# Comedy Formula Library

A Telugu comedy formula library: 507 comedy formulas collected from 21 reference scripts (Scripts 3–23), each tagged with a general role. The project's characters are DJ Vicky and Golu.

- `index.html` — the library page (formulas, old scenes, breakdowns, scene writer). Open it in a browser. On GitHub Pages the scene writer uses your own Claude API key, saved only in your browser.
- `formula-notes.md` — every formula as plain text, grouped by type, with owner and sample.
- `gold-techniques.md` — the 8 gold techniques (G01–G08) learned from your hand-picked best lines, with rules and fresh examples; the lines themselves are in `references/`.
- `app/` — the full web application for AWS: a Node.js server that connects the library page to the Claude API (same scene prompt and output structure as in claude.ai), saves scenes on the server and has an optional sign-in. Deploy guide: `app/DEPLOY-AWS.md`.

## Scene features on the library page

- **Write a scene** — scans the whole library, uses 1–2 gold techniques, then writes the scene and the full A–F analysis. Speeds: Faster, Best quality, Deepest (up to 5 minutes).
- **Scene combo** — paste up to five versions of a scene (at least two). Claude collects the best punches, comebacks, reactions and slang lines from all of them and sets those lines, as written, into one scene, adding short linking lines only where needed. Every line is tagged with the scene it came from (or "new link"), followed by a combo report and the full A–F analysis. The five boxes are kept between visits.
- **Saved scenes** — every scene is saved. Open one to get **Copy scene** (whole dialogue in one tap) and **Add to scene combo** (fills the next empty combo box). Each saved scene in the list also has **+ Add to scene combo** and **Delete**. Each combo box has a **Saved scene…** list and a **Paste** button.
- **Downloads** — PDF of one scene or of all saved scenes, and the Old to New Dialogue Evolution PDF.
- **Previous scenes** (Write a scene, above Box 1, optional) — paste earlier scenes of your script; the new scene from Box 1 continues that story (same characters and slang, no repeated or contradicted events, callbacks), with a Story continuity box. "Add to previous scenes" appends a written scene so you can go on to the next one. Empty = stand-alone scene.
- **Replace characters** — paste a scene or pick a saved one; the speakers are detected automatically. Choose a replacement for any of them from the character library (e.g. a film character → DJ Vicky). Claude rewrites the replaced characters' dialogues, reactions, slang, attitude, punchlines and timing in the new character's style, keeps the others' lines where they still work, and shows Original vs New side by side. The original is never changed; the new version is saved in Saved scenes.
