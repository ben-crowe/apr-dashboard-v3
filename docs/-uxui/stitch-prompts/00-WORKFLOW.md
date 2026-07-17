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
