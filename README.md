# Comedy Formula Library

A Telugu comedy formula library: 648 comedy formulas (F01–F648) collected from 23 reference scripts in 26 batches, each assigned to the existing cast (Madhu, Mahesh, Master, Budatha, Venki, Father) with a fresh sample line in Uttarandhra slang.

- `index.html` — the library page (formulas, old scenes, breakdowns, scene writer). Open it in a browser. On GitHub Pages the scene writer uses your own Claude API key, saved only in your browser.
- `formula-notes.md` — every formula as plain text, grouped by type, with owner and sample.
- `Old_to_New_Dialogue_Evolution.pdf` — old vs new dialogue for every formula, in order.
- `batches/` — the breakdown PDF for each batch (Batches 3–5 and 10–26).
- `by-character/` — the new formulas of Batches 17–26, listed by character.
- `Everything_I_sent_in_this_chat.pdf` — every message, script and screenshot sent in the original chat, oldest first.
- `gold-techniques.md` — the 8 gold techniques (G01–G08) learned from your hand-picked best lines, with rules and fresh examples; the lines themselves are in `references/`.
- `app/` — the full web application for AWS: a Node.js server that connects the library page to the Claude API (same scene prompt and output structure as in claude.ai), saves scenes on the server and has an optional sign-in. Deploy guide: `app/DEPLOY-AWS.md`.
