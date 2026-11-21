'use strict';
// Comedy Formula Library — web server with Claude-powered scene writing.
// The page (public/index.html) builds the exact same prompt it uses inside claude.ai
// and sends it here; this server forwards it to the Claude API and streams the answer back.

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const env = (k, d) => (process.env[k] === undefined || process.env[k] === '' ? d : process.env[k]);
loadDotEnv(path.join(__dirname, '.env'));

const PORT = +env('PORT', 3000);
const HOST = env('HOST', '0.0.0.0');
const API_KEY = env('ANTHROPIC_API_KEY', '');
const API_BASE = env('ANTHROPIC_BASE_URL', 'https://api.anthropic.com').replace(/\/+$/, '');
const MODEL_FAST = env('MODEL_FAST', 'claude-sonnet-5-5');
const MODEL_BEST = env('MODEL_BEST', 'claude-opus-5-5');
const DEFAULT_TIER = env('DEFAULT_TIER', 'complex'); // "complex" = best quality, closest to the chat
const MAX_TOKENS = +env('MAX_TOKENS', 32000);
const APP_USER = env('APP_USER', 'admin');
const APP_PASSWORD = env('APP_PASSWORD', '');
const GEN_PER_HOUR = +env('GEN_PER_HOUR', 60);
const DATA_DIR = path.resolve(__dirname, env('DATA_DIR', 'data'));
const SCENES_FILE = path.join(DATA_DIR, 'scenes.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const EVO_PDF = [path.join(PUBLIC_DIR, 'Old_to_New_Dialogue_Evolution.pdf'), path.join(__dirname, '..', 'Old_to_New_Dialogue_Evolution.pdf')].find(p => fs.existsSync(p));

fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// --- optional password (HTTP Basic auth) for the whole app -----------------
function safeEq(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
app.use((req, res, next) => {
  if (!APP_PASSWORD || req.path === '/healthz') return next();
  const h = req.headers.authorization || '';
  if (h.startsWith('Basic ')) {
    const [u, ...rest] = Buffer.from(h.slice(6), 'base64').toString('utf8').split(':');
    if (safeEq(u, APP_USER) && safeEq(rest.join(':'), APP_PASSWORD)) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Comedy Formula Library", charset="UTF-8"');
  res.status(401).send('Sign in required.');
});

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'same-origin');
  next();
});

// --- health -----------------------------------------------------------------
app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/api/health', (req, res) =>
  res.json({ ok: true, ai: !!API_KEY, models: { fast: MODEL_FAST, best: MODEL_BEST }, defaultTier: DEFAULT_TIER }));

// --- simple per-IP rate limit for generation -------------------------------
const hits = new Map();
function rateOk(ip) {
  const now = Date.now(), hour = 3600e3;
  const list = (hits.get(ip) || []).filter(t => now - t < hour);
  if (list.length >= GEN_PER_HOUR) { hits.set(ip, list); return false; }
  list.push(now); hits.set(ip, list); return true;
}

// --- AI generation: stream Claude's text back to the page -------------------
app.post('/api/generate', express.json({ limit: '8mb' }), async (req, res) => {
  const prompt = req.body && req.body.prompt;
  if (typeof prompt !== 'string' || !prompt.trim()) return res.status(400).json({ error: 'missing_prompt' });
  if (!API_KEY) return res.status(503).json({ error: 'no_api_key', message: 'The server has no ANTHROPIC_API_KEY set.' });
  if (!rateOk(req.ip)) return res.status(429).json({ error: 'rate_limited', message: `Limit of ${GEN_PER_HOUR} generations per hour reached.` });

  const tier = req.body.tier === 'default' ? 'default' : req.body.tier === 'complex' ? 'complex' : DEFAULT_TIER;
  const model = tier === 'default' ? MODEL_FAST : MODEL_BEST;
  const ctl = new AbortController();
  res.on('close', () => { if (!res.writableFinished) ctl.abort(); });

  let upstream;
  try {
    upstream = await fetch(`${API_BASE}/v1/messages`, {
      method: 'POST',
      signal: ctl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: MAX_TOKENS, stream: true, messages: [{ role: 'user', content: prompt }] }),
    });
  } catch (e) {
    if (ctl.signal.aborted) return;
    console.error('[generate] network error:', e.message);
    return res.status(502).json({ error: 'upstream_unreachable', message: 'Could not reach the Claude API.' });
  }
  if (!upstream.ok) {
    const t = await upstream.text().catch(() => '');
    let msg = `Claude API error ${upstream.status}`;
    try { msg = JSON.parse(t).error.message || msg; } catch (_) {}
    console.error('[generate]', upstream.status, msg);
    const code = upstream.status === 401 ? 'bad_api_key' : upstream.status === 429 ? 'rate_limited' : 'api_error';
    return res.status(upstream.status === 401 ? 502 : upstream.status).json({ error: code, message: msg });
  }

  res.status(200);
  res.set({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no', 'X-Model': model });
  res.flushHeaders();
  const t0 = Date.now();
  let buf = '', out = 0, stop = '';
  const dec = new TextDecoder();
  try {
    for await (const chunk of upstream.body) {
      buf += dec.decode(chunk, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith('data:')) continue;
        let ev; try { ev = JSON.parse(line.slice(5)); } catch (_) { continue; }
        if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') { res.write(ev.delta.text); out += ev.delta.text.length; }
        else if (ev.type === 'message_delta' && ev.delta && ev.delta.stop_reason) stop = ev.delta.stop_reason;
        else if (ev.type === 'error') { res.write(`\u0000ERR:${(ev.error && ev.error.message) || 'stream error'}`); }
      }
    }
    if (stop === 'max_tokens') res.write('\u0000ERR:The answer was cut off at the token limit. Raise MAX_TOKENS on the server or ask for a shorter scene.');
  } catch (e) {
    if (!ctl.signal.aborted) res.write(`\u0000ERR:${e.message}`);
  }
  console.log(`[generate] ${model} ${tier} ${(prompt.length / 1024).toFixed(0)}KB in → ${out} chars out, ${((Date.now() - t0) / 1000).toFixed(1)}s, stop=${stop || 'n/a'}`);
  res.end();
});

// --- saved scenes, kept on the server ----------------------------------------
function readScenes() { try { return JSON.parse(fs.readFileSync(SCENES_FILE, 'utf8')); } catch (_) { return []; } }
function writeScenes(list) {
  const tmp = SCENES_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(list));
  fs.renameSync(tmp, SCENES_FILE);
}
app.get('/api/scenes', (req, res) => res.json(readScenes()));
app.put('/api/scenes', express.json({ limit: '25mb' }), (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'expected_array' });
  writeScenes(req.body.slice(0, 200));
  res.json({ ok: true, count: Math.min(req.body.length, 200) });
});

// --- static files -------------------------------------------------------------
if (EVO_PDF) app.get('/Old_to_New_Dialogue_Evolution.pdf', (req, res) => res.sendFile(EVO_PDF));
app.use(express.static(PUBLIC_DIR, { index: 'index.html', maxAge: '5m' }));
app.use((req, res) => res.status(404).send('Not found'));

app.listen(PORT, HOST, () => {
  console.log(`Comedy Formula Library on http://${HOST}:${PORT}`);
  console.log(`AI: ${API_KEY ? `on (fast=${MODEL_FAST}, best=${MODEL_BEST}, default=${DEFAULT_TIER})` : 'OFF — set ANTHROPIC_API_KEY'}`);
  console.log(`Password: ${APP_PASSWORD ? 'on' : 'off'} · scenes file: ${SCENES_FILE}`);
});

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
