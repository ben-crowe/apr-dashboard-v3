---
content_type: prd
title: PRD-A — Job-Prep Fields → Valcre Mapping + Sync Testing
status: ready-to-roll
created: 2026-06-03
owner: agents (react-spec + QA), co-architect coordinates
test_job: VAL261101 "Westside Mall" (pinned — name-match guard before any write)
related: [JOB-PREP-FIELDS-MAP-2026-06-03.md, VALTA-MASTER-DELTA-2026-05-14.md, MAPPING-dashboard-to-clickup.md]
---

# PRD-A — Job-Prep Fields → Valcre Mapping + Sync Testing

## Goal
The new job-prep fields are built + verified on the dashboard (LoeQuoteSection.tsx, build green).
Now wire + prove each one end-to-end: dashboard field → Valcre custom field (and ClickUp card
where routed), filled and confirmed it landed in the right Valcre field. Agent-owned testing on
the ONE pinned test job — not a Ben-driven click-through.

## Scope
- The new/changed job-prep fields: Authorized Use, Assignment Type, Job Status, Value Scenarios
  (multi), Property Rights (multi), Desktop Report, CMHC Financing, Request/Signed/Due dates,
  plus the 7 pending-Ben extras IF Ben keeps them (Report Format, Transaction Status, Zoning
  Status, Purpose, Analysis Level, Lead Appraiser, Effective Date).
- Out: Report Builder fields, anything not in the job-prep area.

## Steps (agent-owned)
1. **Confirm the target Valcre field for each** — review the live Valcre API / job schema; build a
   per-field map (dashboard field → Valcre property). Start from VALTA-MASTER-DELTA known maps
   (e.g. Authorized Use → Job.IntendedUses) and verify each against the live API, don't assume.
2. **Wire** the field → Valcre sync (api/valcre.ts proxy + field mapping) one field at a time.
3. **Fill + push** on the pinned test job VAL261101 (name-match guard FIRST — VAL numbers get
   reassigned).
4. **Verify it arrived** — read the value back from Valcre, confirm it's in the correct custom
   field. Screenshot the Valcre side. One field at a time; don't batch-and-pray.
5. **ClickUp leg** — for fields routed to the card (per MAPPING-dashboard-to-clickup.md), confirm
   they land on the edge-function card too.
6. **Report** a per-field pass/fail table + screenshots, in Ben's viewer (grouped, /km-open).

## Done = 
Every in-scope field proven to land in its correct Valcre custom field (and ClickUp where routed),
with a screenshot per verification, on VAL261101. No new jobs created.

## Gates
- Pin job VAL261101 only; name-match guard before ANY Valcre write.
- Isolated --session for any browser capture; save to data/screenshots; never /tmp.
- Screenshot-and-read before any "done" claim.

## Agent Fill Method — CANONICAL (this belonged in the deploy brief from the start)

> Added 2026-06-04 after QA's field fills "succeeded" in chat but came back blank on reload.
> Root cause: wrong fill method. This section is the standing answer — load it into every
> field-testing deploy brief. Use OUR OWN CLI suite, not Playwright-as-first-resort.

**Reference skills (load before any fill testing):** `/cli-browser-auto` · `/agent-fill-fields` ·
`/agent-click` · `/agent-screenshot`. `/agent-fill-fields` is the canonical TYPE-method authority.

### The one correct method — Method 1 (agent-browser CLI over CDP)
```bash
agent-browser --session <name> fill @<field-ref> "value"   # text / date inputs
agent-browser --session <name> press Tab                   # force blur → triggers save
agent-browser --session <name> click @<ref>                # dropdowns (Radix Select)
```
**Why it works:** `fill` drives the real Chromium keyboard pipeline through React's monkey-patched
native value-setter → synthetic `onChange` fires → focus/blur fires → the 500ms debounce in
`LoeQuoteSection.tsx` (handleChange/handleBlur → autoSaveField, ~lines 1180-1230, 254/293) runs →
`supabase.update`. Both halves (state update + blur-save) happen. **The field actually persists.**

### The trap — Method 3 (JS value-assign) — BANNED for testing
```javascript
input.value = 'foo'; input.dispatchEvent(new Event('input'))   // ❌ React rejects this
```
Sets `.value` directly, bypassing React's patched setter. UI shows the value for one tick, then
the next render reverts it. **This is exactly why QA's text/date fills looked set but saved blank.**
Dropdowns survived only because a real `click` on a Radix Select fires `onValueChange` legitimately.

### Method 2 (osascript / cliclick) — native OS keystroke
Only for native macOS apps. Not for this browser/Electron work. Method 1 is faster + no perms.

### Playwright MCP — escape hatch ONLY, not the default
APR CLAUDE.md lists Playwright as a fallback for React controlled inputs. It works, but our
**canonical default is `agent-browser fill`** (Method 1). Reach for Playwright only if agent-browser
fill genuinely can't target the element — never as the first move.

### The full real-user chain (don't skip a link)
1. `agent-browser ... click @<ref>` — focus the field (or open the dropdown)
2. `agent-browser ... fill @<ref> "value"` — real keystrokes into the focused field
3. `agent-browser ... press Tab` — blur to fire the debounce-save (text/date fields)
4. `/agent-screenshot` before AND after — visual proof, never trust "value set" in chat
5. Reload the tab, read the value back — ground-truth that it persisted to the DB

### Verdict rule
Any agent reporting a fill PASS must STATE THE METHOD. "agent-browser fill" / "Input.insertText" =
trust. "input.value = …" / "dispatchEvent" / ambiguous = RE-RUN with Method 1. No method named = not
a pass.

### Test-Data button — FORBIDDEN on the pinned job
The LOE Quote section's "Test Data" button bulk-populates the whole section and OVERRIDES fields
already set + synced on VAL261101. Never click it during sync testing — it destroys the one-field-
at-a-time verification this PRD exists for. Fill only the empty in-scope fields, individually.
