---
content_type: sop
title: Agent CLI & Browser Tooling — SOP for Driving the APR App
status: living reference
home: 00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, apr-testing, cli-tools, agent-browser, app-driving, screenshots, sync-verify]
related: [APR-TESTING-PLAYBOOK.md, APR-TESTING-REFERENCE.md, ../tests/E2E-TESTING-WORKFLOW-MASTER.md]
---

# Agent CLI & Browser Tooling — SOP for Driving the APR App

**Status:** Living reference · refine over time
**Author:** ui-designer (dev-4), tracking the qa-agent (dev-2) app-driving session
**Created:** 2026-06-04
**Use when:** any agent needs to log into the APR Dashboard, fill fields, switch pages/tabs, capture screenshots, or verify data sync (Valcre / ClickUp / LOE).

---

## What this is

A plain-language SOP for the tool suite an agent must **load and use** before touching the APR app or any web UI. It exists because reaching for raw browser JS instead of our own canonical skills wastes time and silently breaks saves. Load the skills below FIRST, then work by the rules.

The one-line version: **use our skills, fill with real keystrokes, never raw JS `.value`, and ground yourself with a context search before you start.**

---

## STEP 0 — Load these skills FIRST (don't improvise)

Run these before any browser work. Each is loaded with its slash name.

- **`/cli-browser-auto`** — the agent-browser engine (the 127-command CLI). Open URLs, navigate, snapshot for element refs, click, scroll. This is the driver for everything below.
- **`/agent-fill-fields`** — the canonical fill skill. The real-vs-fake TYPE method (see the Golden Rule). Load this any time you type into a field.
- **`/agent-screenshot`** — the capture skill we built. Three methods; Method 2 is for the APR web app (headless, isolated session).
- **`/cli-apr-tools`** — APR-specific CLI helpers.
- **SS12 two-phase context search** — not a browser skill, but mandatory grounding. Run it before working so you recover prior sessions' hard-won method (see STEP 1).

If you skip STEP 0 and reach for raw `agent-browser eval` JS, you will hit the trap in the Golden Rule.

---

## STEP 1 — Ground yourself (SS12 two-phase search)

Before driving the app, run the full two-phase context search so you don't re-derive what was already solved. Layers and what each gives you:

- **Layer 1 — JSONL** (`~/.claude/scripts/search-local "<topic>" --deep --full`) — your own recent session transcripts.
- **Layer 2 — context-search** (`~/.claude/scripts/context-search --agent <name> --topic "<topic>"`) — checkpoints + learnings + primes.
- **Layer 3 — Gemini** — the agent-checkpoints / memory stores (watch for 429 rate-limits; note them honestly).
- **Layer 4 — Vault** (`~/.claude/scripts/vault-search "<topic>"`) — Ben's authored notes + method docs.
- **(Cognee)** — knowledge graph; flag if down rather than fake it.

Report RICH / THIN / EMPTY per layer. The point: surface prior method docs (e.g. `tests/METHOD-apr-screenshot-verification.md`) and the canonical-skill checkpoints BEFORE acting.

---

## THE GOLDEN RULE — Fill with real keystrokes, never raw JS

There are three ways to put a value in a field. Only one persists.

- **Method 1 — CORRECT: `agent-browser --session <name> fill @ref "value"`**
  Wraps **real CDP keystrokes**. Fires React's synthetic `onChange` AND a real `focus`/`blur`. The blur is the load-bearing event — it triggers the app's `handleBlur → autoSaveField → 500ms debounce → supabase.update`. The value actually saves.

- **Method 2 — Real click for dropdowns:** Radix selects save on a **real click** (`onValueChange` fires on a trusted click). Click the option, don't set it.

- **Method 3 — THE TRAP (never do this): raw `agent-browser eval` setting `el.value = ...; dispatch('input')`**
  This fires `onChange` so the UI *looks* filled — but it never fires `blur`, so the debounce-save never runs. On reload, every field you "filled" this way is **empty**. This is exactly how a whole LOE Quote section appeared filled but persisted nothing.

**Why the app behaves this way (APR-specific):** in `LoeQuoteSection.tsx`, `handleChange` only updates in-memory UI state (and only auto-saves the one `appraiserComments` field). Persistence for every other field is triggered by `handleBlur → autoSaveField`. No real blur = no save. The app's own `CLAUDE.md` states the rule: *React controlled inputs → native input setter that fires the React change event, not JS eval.*

---

## Field-type cheatsheet

- **Text inputs** → Method 1 `fill @ref`. Filling the next field (or pressing Tab) blurs the prior one and fires its save. End the batch with a final Tab to blur the last field.
- **Radix dropdowns** → real **click** on the trigger, then real click on the option. Persists immediately.
- **Native segmented date inputs** (Year/Month/Day spinbuttons) → the fussy ones. `eval`-focus + type does NOT take. Needs a **real click on the segment + real keystrokes**. (Exact keystroke sequence still being dialed in — see tally below; update this line when locked.)

---

## Isolation + safety (do NOT hijack KM-Exp)

- **Always use a unique `--session <name>`** (e.g. `apr-qa`, `valcre-qa`). A plain `agent-browser` with no session rides the `default` session, which is bound to KM-Exp's CDP and will **hijack Ben's running app**.
- **Safety tripwire:** before/after capture, confirm KM-Exp stayed on its own port. If its window navigated, you rode the wrong session — abort.
- **APR dev port = 8086** (local) · **production = `apr-dashboard-v3.vercel.app`**. Never `--headed`, never `--cdp 9222` (that IS KM-Exp).

---

## Navigation — pages, tabs, refs

- **Open:** `agent-browser --session <name> open "<url>"` then `sleep` a few seconds, then `get url` to confirm it landed.
- **Get element refs:** `agent-browser --session <name> snapshot -i` (interactive elements with `@refN`). Re-snapshot after navigation — refs change.
- **Click / scroll:** `click @ref`, `scroll`. Use `find text "<label>" click` to jump to a known control.
- **Ref drift after a click (gotcha):** `@refN` values go **stale after an interaction** — clicking the first option in a multi-select can re-render the list, so the next `click @ref` fails with "Could not locate element". Fix: **re-snapshot** for fresh refs after each state change, OR select by **text** (`find text "<label>" click`) which survives re-renders. Don't reuse a ref across a click that mutates the DOM.
- **Daemon busy / unresponsive (gotcha):** agent-browser's background daemon can return "Resource temporarily unavailable (os error 35)" or hang under rapid-fire commands. Fix: give it a breather (`sleep`), then do a clean **reload of the page** and re-verify state. Don't hammer it — space out commands when it's flaky.
- **Verify by RELOAD, not just read-back:** the only honest test that a field saved is to reload the page and read the persisted value. UI-state read-back can show a value that never hit the DB (that's the JS-trap failure mode). Reload → read → confirm.
- **ClickUp can't be headless-screenshotted (gotcha):** ClickUp is login-gated, so the isolated `--session` browser hits the login wall — no clean card capture. Two workarounds: (a) **Ben screenshots the card from his real browser** (most authentic — real ClickUp chrome), or (b) **render the card from the exact live data into a clean image** (headless, no login) labeled as a faithful render for the canvas. Don't fight the login wall.
- **Login flow:** snapshot → `fill @ref` the email → click Next → `fill @ref` the password → click Sign in → confirm `get url` shows the dashboard.

---

## Screenshots (the APR web app)

- Use **`/agent-screenshot` Method 2** — `agent-browser --session <name> screenshot <path>` (headless, isolated session).
- **Save under `~/Development/KM-Exp/data/screenshots/`** — the only root the KM-Exp viewer + Paper canvas can render. NEVER `/tmp` (rejected by the viewer).
- Mirror a copy into the working folder (e.g. `~/Development/APR-Dashboard-v3/Data-Flow Visuals/screenshots/`) for the shared record.
- Zoom back enough to show all fields in a frame — don't shoot one-field-per-shot.

### Screenshot verification protocol (state method BEFORE you shoot)

A screenshot is proof, so treat it like proof — don't just fire it. Before capturing, **state your method in your pane**, confirming all four:

1. **Method** — `/agent-screenshot` Method 2 for the APR web app: `agent-browser --session apr-qa screenshot <path>`.
2. **Save path** — under `~/Development/KM-Exp/data/screenshots/` (NEVER `/tmp` — the viewer + Paper can't render it). Mirror a copy to the working folder for the shared record.
3. **Isolation** — a unique `--session` (e.g. `apr-qa`) so KM-Exp isn't hijacked, plus the before/after KM-Exp safety check (its window must stay on its own port).
4. **Frame content** — the shot must actually show the thing being proven (e.g. the filled fields — Request/Signed/Effective dates + text + dropdowns — as the *persisted* values).

Then: shoot → **Read the PNG yourself** and confirm the expected values are visible → only then call it done. A filled-fields proof shot that doesn't legibly show the values isn't proof. Hand the verified shot to the UI designer to place on the Paper canvas as a verification page.

---

## Hard DON'Ts

- ❌ **Raw JS `.value` fills** (Method 3 trap) — looks filled, saves nothing.
- ❌ **The "Test Data" button** on the LOE Quote section — it **bulk-overrides the entire section and wipes fields already set + synced** on the live test job. Off-limits.
- ❌ **Spawning test jobs** — we work the ONE Valcre test job (VAL261101 / Valcre Id 784140). Don't create others.
- ❌ **Plain `agent-browser` with no `--session`** — hijacks KM-Exp.
- ❌ **Blurting "just use Playwright MCP"** — we have our own canonical CLI suite; use it. Playwright MCP is the escape hatch for raw JS / React controlled input only when our tools genuinely can't.

---

## Session tally — qa-agent app-driving (VAL261101, Westside Mall)

Running log of what's been done, so we keep track together. Append as it progresses.

**2026-06-04**

1. **Data-flow capture started** — plan doc `~/Development/APR-Dashboard-v3/Data-Flow Visuals/01-Data-Flow-Diagram.md`. Stops: Intake → APR Dashboard (Section 1 + 2) → ClickUp → Valcre → LOE.
2. **Valcre shots: 2 of the set captured** — `03-valcre-01-general-dates-report.png`, `03-valcre-02-custom-fields.png` (zoomed-back, cover the whole job). Filed in the shared `screenshots/` folder.
3. **LOE Quote fill — first attempt FAILED (the trap):** set inputs via `agent-browser eval` JS `.value`. UI looked filled; on reload, text + the 3 sync-critical dates (Request/Signed/Effective) were **empty**. Dropdowns stuck (real-click `onValueChange`).
4. **Hard stop — Test Data forbidden.** Root cause identified: no real blur → `handleBlur → autoSaveField` never ran.
5. **Re-grounded:** loaded `/agent-fill-fields`, ran the SS12 two-phase search (JSONL RICH, Vault RICH, Gemini RICH w/ some 429s, Cognee not run). Recovered yesterday's canonical method.
6. **Switched to Method 1** (`agent-browser fill` real keystrokes) — text fields + dropdowns now fill and **persist correctly** on reload.
7. **In progress:** native segmented **date inputs** (Request/Signed/Effective) still resisting click-segment-then-type — dialing in the exact keystroke sequence.
8. **Blocked earlier on:** production vs. local dev for the remaining dashboard/ClickUp/LOE shots → working against **production** (vercel).
9. **DOM/integration testing (in progress):** filling Value Scenarios (As-Is / As Stabilized) to match Valcre via real-click selection. Hit **ref drift** after the first click (stale `@ref`) → adapting to re-snapshot / select-by-text. Hit **daemon-busy flakiness** → breather + clean reload.
10. **Filled-fields proof shot CAPTURED + dates PERSIST:** `apr-jobprep-FILLED-proof.png` (under KM-Exp screenshots dir). On reload the Job Prep section shows the real-keystroke fills saved — the 3 sync-critical dates now populated (Request 2026-03-15, Signed 2026-03-20, Effective 2026-04-01) + Delivery 2026-02-10, plus Report Format=Comprehensive, Transaction Status=Under Contract, Approaches=Income & Direct Comparison, Appraisal Fee $3,500, Retainer $350, Current/Proposed Use=Industrial, Zoning=Legal Conforming, Scope=All Applicable. Method 1 confirmed working. Remaining empty: Value Scenarios (ref-drift fight), Authorized Use, Desktop Report, Analysis Level, Previously Appraised, Paid Date.
11. **Field-mapping method (the real sync question):** for each dashboard field, check whether Valcre has a **matching destination** — a custom field ID or a native picker — to decide if it's a *sync field* or *dashboard-only*. Findings: **Lead Appraiser** = no custom field, native Staff picker only, client staff not guaranteed to be Valcre accounts → **dashboard-only text is correct** (an earlier "should be a staff picker" flag was wrong). **Zoning Status** = has **custom field 12054** → the dropdown conversion actually feeds Valcre (real win). Loose ends: Analysis Level + Purpose (free-text didn't save — confirm intended or dead). Field-check shots: `apr-fc-01..05*.png`.
12. **Latent-bug pattern found — free-text feeding a map-based sync:** a free-text field that syncs through a conversion map in `api/valcre.ts` is a latent bug — a typo **silently won't push** to Valcre. Fix: convert to a **dropdown whose options are pulled verbatim from that map**, so dashboard values can't drift from sync-accepted values. Same class as the Zoning Status fix. **CORRECTION (react-spec caught it):** only **Analysis Level** qualifies — its options = keys of `ANALYSIS_LEVEL_MAP` (Comprehensive / Concise / Form), and it does sync (`Job.AnalysisLevel`) → convert it. **Purpose does NOT sync to `Valcre.Purposes`** — *Property Rights* feeds Purposes via `PURPOSES_MAP`, not the Purpose text field. Converting Purpose would've pushed values into the wrong Valcre field → **leave Purpose as free-text.** Lesson: confirm the field's ACTUAL map target before converting; don't assume by name. (The "didn't save" on these was the wrong-fill-method, not dead wiring.)
    - **Open question for Ben:** Analysis Level's 3 options are identical to Report Format's — possible redundant/duplicate fields.
13. **Sync test NOT yet done (status honesty):** the field values sitting in Valcre so far were placed by **direct API writes** (to prove each field's correct target) — NOT by a dashboard push through the sync. The real end-to-end test — *fill on the dashboard → watch it populate the Valcre job* — is still ahead. One job only, both sides: VAL261101 / Westside Mall / Valcre Id 784140, name-match guard before any write, never spawn new jobs.
14. **Post-deploy fill results:** dropdowns live; most fields filled + persisted via the proper method (dates, Property Rights, Approaches, Current/Proposed Use, Delivery Time, other dropdowns). **Two snags:** (a) **Analysis Level dropdown save does NOT persist** — likely a wiring gap in react-spec's *fresh* conversion (same fill method works on other dropdowns) → **flag to react-spec.** (b) **Multi-selects (Value Scenarios, Client Documents) are stubborn** — Value Scenarios kept only "As Stabilized," Client Documents still shows old "Requested"; the multi-select control fights automation + browser-session flakiness. Decision put to Ben: proceed to the sync test with the solid fields now, circle back on the 3 stubborn ones.
15. **Cascade settled (CoArch confirmed):** Value Scenarios = manual value, cascade auto-derive **deferred**; Approaches to Value stays **unwired**. Not blocking — QA doesn't wait on cascade.
16. **STANDBY — ball with react-spec:** react-spec runs the data migration → wires the auto-sync per QA's `AUTO-SYNC-WIRING-MAP.md`. CoArch monitors him + pings QA when wiring is committed + Ben green-lights deploy. THEN QA runs the **live one-at-a-time sync test**: change each wired field on the dashboard → `GetValues?entityId=784140&type=6` readback per field (never trust HTTP 200) → screenshot the Valcre side → per-field PASS/FAIL. Those Valcre-side proof shots → ui-designer for the canvas board.

**Next:** lock the date-segment method → finish the LOE Quote fill → resume the remaining 7 data-flow shots → hand the set to ui-designer for the Paper canvas board.

---

## Refinement log

- **2026-06-04** — v0.1 created from the qa-agent app-driving session. Captures the skill suite, the Golden Rule (real keystrokes vs JS trap), field-type cheatsheet, isolation safety, and the running tally.
