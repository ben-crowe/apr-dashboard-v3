# Stitch prompt workflow — APR Dashboard (Ben pastes into Stitch desktop)

The repeatable recipe for generating APR screens in Stitch when Ben drives the
Stitch desktop app himself (no MCP, no project-level design-system binding).

## Skills the designer loads (in order)

1. `design-md` — write/refresh `DESIGN.md` from the app's real source tokens
   (`src/index.css` CSS variables + `tailwind.config.ts`). Source-code mode —
   no Stitch project needed.
2. `enhance-prompt` — structure the screen idea: platform, page type, numbered
   section list, professional UI terms.
3. `generate-design` — prompt discipline: layout + content + intent only;
   one screen per prompt.

Skip `stitch-mgt` (MCP tool reference) and `stitch-loop` (autonomous baton
loop) — both only apply when the agent drives Stitch through the API.

## The steps

1. **DESIGN.md first** — `~/Development/apr-clean-working/DESIGN.md` holds the
   extracted design system. Refresh it if the app's tokens change.
2. **Author the prompt** — structure + content, with the design-system block
   pasted at the BOTTOM of the prompt (desktop paste has no project binding,
   so the prompt must carry appearance).
3. **Ben pastes into Stitch desktop**, reviews, screenshots back anything he
   likes or wants changed.
4. **Edit prompts change exactly ONE thing** — never restate the design
   system, never bundle changes.
5. Approved screen → hand HTML/design to the workspace lead for build dispatch
   (designer never sends build instructions to a builder directly).

## Prompt file convention

One file per screen in this folder, numbered: `01-login-prompt.md`,
`02-account-settings-prompt.md`, ... Everything below the `---` line in each
file is the paste payload.

## The three inputs (proven 2026-07-17, in fidelity order)

1. **Words** — structure only. Master prompt (readable, NOT condensed — the
   condensed test produced wrong page order) for pages that don't exist.
2. **Screenshots** — looks. Drag a PNG of a real page onto the canvas +
   "make it look like this". Beats any written description of appearance.
3. **CODE — truth.** Capture the live page as one clean HTML file
   (`~/.claude/scripts/design/stitch-push-page.sh`, or the chunked capture
   for cmux surfaces), put it on Ben's Desktop, BEN drags it onto the
   canvas + "can you create this" → Stitch rebuilds it as a native,
   editable screen at production fidelity. Proven on the V3 job page.
   ⚠ The API upload route (screens:batchCreate) gets code into project
   DATA but its canvas placement never showed in Ben's client — Ben's
   drag-drop is the delivery, always. Never add screens to Ben's project
   without telling him first; number every screen title.

## ⭐ THE WINNING RECIPE (proven 2026-07-17, job page run 3)

For any page that EXISTS in the app, give Stitch BOTH references in one
message, with roles assigned:
- the SCREENSHOT of the real page → owns look (colors, spacing, width, trim)
- the captured HTML file → owns content (structure, every label, every value)
- the message: "rebuild this exactly: colors, spacing and page width from
  the screenshot; structure and every label from the HTML file."
Result: near-production fidelity, and it CLEANED UP edge/alignment slop our
real page carries — dual-reference output can exceed the source. Single-
reference runs are the fallbacks: screenshot-only = fast + interpretive
(good for idea passes), code-only = faithful incl. flaws (good for a true
baseline).
