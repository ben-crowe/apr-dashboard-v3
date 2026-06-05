# APR screen-viewing / screenshot method (confirmed)

**By:** qa-agent · 2026-06-03 · confirmed via two-phase search + ground-truth source reads (NOT from memory)
**Owner:** qa-agent owns visual verification of APR. **Headless only — no window in Ben's face.**

## Confirmed against ground truth
- **Port = 8086 ✓ (CoArch is right).** `vite.config.ts` line 9 `server.port: 8086`. The "5173" in the generic CLAUDE.md line is wrong for APR (5173 is KM-Exp's dev server). Gemini E2E-workflow store corroborates 8086.
- **Method = `/agent-screenshot` Method 2 (out-of-app, headless) ✓.** APR is a web app, so Method 2 is correct (Method 1 CDP-attach is the KM-Exp Electron case).
- **Skills to load:** `/cli-browser-auto` (canonical for Method 2) + `/agent-screenshot` (method selector). `/vision-prime` if detailed pixel analysis is needed.
- `agent-browser` is on PATH (`~/.npm-global/bin/agent-browser`).

## ⛔ CRITICAL CORRECTION (2026-06-03, TESTED) — "headless" is NOT automatically isolated
The earlier "plain `agent-browser open` = safe headless" assumption was **WRONG and caused KM-Exp to be hijacked.** Root cause (proven): agent-browser's **`default` session is bound to KM-Exp's CDP** (`agent-browser --session default get url` → `localhost:5173?windowId=main`). A plain `agent-browser open` reuses the `default` session's already-connected browser → it drives KM-Exp's window, not an isolated Chrome. agent-browser is **sticky per session** (see `~/.claude/scripts/agent-browser-wrap/SPEC-target-selector.md` — "--session resets the sticky cache").

**THE ISOLATION FIX:** always pass a **unique `--session` name** that has never connected to 9222. A fresh session launches its OWN isolated browser, leaving KM-Exp untouched.

## The exact procedure (TESTED — KM-Exp untouched across 4 captures + close)
```bash
# 1. Load skill
/cli-browser-auto
# 2. APR dev server MUST be running first
cd ~/Development/APR-Dashboard-v3 && npm run dev    # serves http://localhost:8086
# 3. Open + capture in a UNIQUE, ISOLATED session (the --session flag is mandatory)
S=apr-qa-iso                                                  # any unique name NOT used for KM-Exp
agent-browser --session "$S" open http://localhost:8086/dashboard/job/<id>
agent-browser --session "$S" snapshot                         # confirm field labels in DOM
agent-browser --session "$S" screenshot --full /tmp/apr.png   # capture
agent-browser --session "$S" close                            # closes ONLY this session (KM-Exp's default untouched)
# 4. Read the PNG (multimodal), describe pixels, verify fields
```

### Safety check to run EVERY time (proves KM-Exp not touched)
Before AND after the open, confirm KM-Exp's 9222 target is unchanged:
```bash
curl -s http://127.0.0.1:9222/json/list | python3 -c "import sys,json;d=json.load(sys.stdin);print(d[0]['url'])"
# must stay http://localhost:5173/?windowId=main — if it changes to :8086, you hijacked KM-Exp → abort
```

## Full interaction (TESTED — not just screenshots) — all headless + isolated
The whole loop works in the isolated session, KM-Exp untouched:
```bash
S=apr-qa-iso
agent-browser --session "$S" open <url>            # navigate
agent-browser --session "$S" snapshot -i           # element refs, format: [ref=e40]
agent-browser --session "$S" fill @e40 "text"       # TYPE into a field (ref WITHOUT the 'ref=' prefix, prepend @)
agent-browser --session "$S" get value @e40         # read it back
agent-browser --session "$S" click @e20             # CLICK (e.g. a job row → navigates to /dashboard/job/<id>)
agent-browser --session "$S" get url                # confirm navigation
agent-browser --session "$S" screenshot --full /tmp/x.png
agent-browser --session "$S" close
```
Ref syntax gotcha: `snapshot -i` prints `[ref=e40]`; click/fill with `@e40` (strip `ref=`, prepend `@`). Match the search box by its real placeholder ("Search by property name, address or client name…"), not a guessed substring.

## Hard rules (confirmed + corrected)
- **UNIQUE `--session` IS MANDATORY** — the isolation knob. Plain/default `open` rides the KM-Exp-bound default session and hijacks the app. (This replaces the wrong "headless = isolated" rule.)
- **NEVER use `--cdp 9222`** for APR — that explicitly attaches to KM-Exp's Electron.
- **NEVER `--headed`** — visible window + Chrome-daemon collision.
- **NEVER computer-use** — opens a visible window.
- **Run the 9222 before/after safety check** on any APR capture while KM-Exp is running.

## Rigor note (the verification gate)
Per the visual-verification SOP: the capturer should not self-certify on a glance. Either (a) Read the PNG myself and describe the literal pixels (not the DOM), or (b) dispatch a visual-verifier subagent for the two-agent gate on anything Ben will rely on. Evidence = pixels, never a DOM read or "build green."

## Confirmation to CoArch
1. **8086 is right** — verified in vite.config.ts, not a guess.
2. **The method is right** — headless agent-browser open→screenshot, /cli-browser-auto loaded, no --headed, no computer-use.
3. **I've got the verification** of react-spec's new job-prep fields once his code+build lands. I'll start `npm run dev` (it's not currently up), open headless against :8086, navigate to the job-prep section, capture, Read the PNG, and report field-by-field PASS/FAIL.
