# Deploy the Comedy Formula Library on AWS

The app is one small Node.js server (`app/server.js`) plus the library page — the repository's `index.html`, the same single file GitHub Pages uses. Edit only that one file; the server and the Docker image both read it.
The page builds the **same scene prompt it uses inside claude.ai** (full library scan, character notes,
slang, all the A–F analysis sections) and sends it to the server. The server sends it to the Claude API
with your key and streams the answer back. So scenes, the Library scan, old → new lines, the Telugu HOW
boxes, formula sources, character and originality analysis all come out in the same structure as in
claude.ai.

## What you need

1. An **AWS account**.
2. A **Claude API key** from <https://console.anthropic.com> → API keys, with some credit added.
   API usage is billed by Anthropic, separately from a Claude.ai plan.
3. This repository (`Vishnureddimi026/Comedy_Library`).

## Option A — EC2 with Docker (recommended)

1. **Launch an instance.** EC2 → Launch instance → Ubuntu Server 24.04 LTS → `t3.small` (or `t3.micro`
   for light use) → create a key pair → in *Network settings* allow **SSH (22)**, **HTTP (80)** and
   **HTTPS (443)**. Launch.
2. **Connect.** EC2 → your instance → Connect → *EC2 Instance Connect* (opens a terminal in the browser).
3. **Get the code.**
   ```bash
   git clone https://github.com/Vishnureddimi026/Comedy_Library.git
   cd Comedy_Library
   ```
   If the repository is private, use a GitHub personal access token as the password when asked.
4. **First run of the setup script** creates `app/.env`:
   ```bash
   bash app/deploy/setup-ec2.sh
   nano app/.env        # paste ANTHROPIC_API_KEY, set APP_PASSWORD, save with Ctrl+O, Enter, Ctrl+X
   ```
5. **Second run** builds and starts everything (Docker container + nginx):
   ```bash
   bash app/deploy/setup-ec2.sh
   ```
   It prints the address, e.g. `http://13.233.x.x/`. Open it, sign in with `APP_USER` / `APP_PASSWORD`,
   and the Write a scene tab shows **"Connected to the AI server."**

### Add a domain and HTTPS (optional but recommended)

Point an `A` record for your domain (for example `comedy.example.in`) at the instance's public IP
(use an **Elastic IP** so it never changes), then:
```bash
DOMAIN=comedy.example.in bash app/deploy/setup-ec2.sh
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d comedy.example.in
```

### Update after new batches

```bash
cd ~/Comedy_Library && git pull && sudo docker compose up -d --build
```
Saved scenes live in the Docker volume `scenes` and survive updates.

## Option B — EC2 without Docker

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs nginx
git clone https://github.com/Vishnureddimi026/Comedy_Library.git && cd Comedy_Library/app
npm ci --omit=dev && cp .env.example .env && nano .env
sudo cp deploy/comedy-library.service /etc/systemd/system/ && sudo systemctl enable --now comedy-library
sudo cp deploy/nginx.conf /etc/nginx/sites-available/comedy-library && sudo sed -i 's/YOUR_DOMAIN/_/' /etc/nginx/sites-available/comedy-library
sudo ln -sf /etc/nginx/sites-available/comedy-library /etc/nginx/sites-enabled/ && sudo rm -f /etc/nginx/sites-enabled/default && sudo systemctl reload nginx
```

## Settings (`app/.env`)

| Setting | What it does |
|---|---|
| `ANTHROPIC_API_KEY` | Your Claude API key. Required for scene writing. |
| `APP_USER`, `APP_PASSWORD` | Browser sign-in for the whole app. Leave the password empty to turn it off (not recommended on a public server — anyone could spend your API credit). |
| `MODEL_BEST` / `MODEL_FAST` | Models for "Best quality" and "Faster". Best quality is the closest to the chat. |
| `DEFAULT_TIER` | `complex` (best quality, default) or `default` (faster). |
| `MAX_TOKENS` | Longest answer allowed. Raise it if very long scenes get cut off. |
| `GEN_PER_HOUR` | Safety limit on AI calls per hour from one address. |

## Billing: your Claude subscription is not used

- The app talks to the **Claude API** with the key in `ANTHROPIC_API_KEY`. The API is billed through the
  **Anthropic Console** (console.anthropic.com → Billing), separately from a Claude.ai Pro/Max plan.
- When your Claude.ai subscription ends, the app keeps working as long as the **API account has credit**.
  Turn on auto-reload in the Console, or check the balance from time to time.
- If the API credit runs out or the key stops working, Claude answers with an error and the app switches
  to the **backup AI** (next section) if you set one up.

## Backup AI (optional)

Fill in `FALLBACK_BASE_URL`, `FALLBACK_API_KEY` and `FALLBACK_MODEL` in `app/.env` (examples are in
`.env.example`: OpenAI, Google Gemini, OpenRouter, or your own Ollama). Then restart:
`sudo docker compose up -d --build`.

- The server always tries **Claude first**. If Claude can't be reached or refuses (no credit, bad key,
  overloaded, outage), the same request goes to the backup AI with the same instructions and library.
- The backup writes in the same structure (scan, Box 1, Box 2, A–F), but its comedy, Telugu and slang
  will **not be as good** as Claude's. Treat it as an emergency spare.
- The backup has its own account and billing with that provider.
- Logs show which AI wrote each scene, e.g. `[generate] backup:<model> …`.

## Good to know

- **Long requests.** A scene can take 1–5 minutes. nginx is set to wait 15 minutes. If you put an AWS
  Load Balancer in front, raise its *idle timeout* to 600 seconds or more.
- **Costs.** Each scene sends the whole formula library (~140 KB) to Claude, plus a second call for the
  analysis. Check the cost per scene in the Anthropic console after your first few scenes.
- **Same structure, same model family.** The app uses the same prompt and the same page as claude.ai,
  so the structure and sections match. The exact wording of each scene is different every time, as it is
  in the chat.
- **Logs:** `sudo docker compose logs -f` (Docker) or `journalctl -u comedy-library -f` (no Docker).
  Each AI call is logged with model, size and time.
- **Health check:** `GET /healthz` returns `{"ok":true}` (no sign-in needed) — use it for monitoring.
