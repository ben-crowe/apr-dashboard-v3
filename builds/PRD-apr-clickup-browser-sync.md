---
id: PRD-APR-SYNC-01
title: "APR Dashboard → ClickUp Task — Browser-Driven Sync (token-free)"
status: DRAFT — awaiting Ben lock
type: workflow-enablement
created: 2026-06-21
owner: qa-agent (solo — no builder delegation this round)
author: co-architect
series: APR-Dashboard-v3
proves: browser-automation-findings.md (OpenCLI = read/write the real logged-in Chrome, no API token)
tags: [apr, clickup, valcre, browser-automation, opencli, sync, dead-token-workaround]
related:
  - ~/Development/00-Systems-Management/CLI-Libraries/browser-automation-findings.md
  - ~/Development/APR-Dashboard-v3/docs/APR-DATA-FLOW-GROUND-TRUTH-2026-06-18.md
  - ~/Development/APR-Dashboard-v3/builds/APR-FIELD-MAPPING.md
gemini_ingest: pending
gemini_store: "apr-domain"
---

# APR Dashboard → ClickUp Task — Browser-Driven Sync

> **Thesis in one line:** drive a complete APR job into a *fuller* ClickUp task **through Ben's logged-in Chrome (OpenCLI)** — no Valcre/ClickUp API token in the loop.

---

## Why this exists

The APR dashboard's "create ClickUp task" path is a **manual button**, and the API tokens are
dead (Valcre + ClickUp). OpenCLI reads and writes Ben's *real logged-in Chrome* with no token —
the verified unlock from the browser-automation testing. So the sync that the dead token blocked
can run again through the browser, and while we're rebuilding it we make the resulting ClickUp
task carry the **full** job detail instead of the sparse set the old sync dropped.

This PRD is also the first **real** proof task for the browser-automation stack (the findings doc's
open item: "run one real end-to-end task"). qa-agent owns it solo this round — no builder hand-off.

---

## Key Results (each with its proof)

| # | Result | How Ben sees it's done (proof) | Status |
|---|---|---|---|
| KR1 | **Truth table — what syncs vs what skips.** qa-agent drives Chrome on a real job (VALTA JOBS Temp V2), reads the dashboard fields, runs the sync, and records field-by-field what lands in ClickUp vs what drops. | The truth-table doc **+ the live ClickUp task** Ben opens to see exactly what landed. | ⏳ in progress (Phase A) |
| KR2 | **A fuller ClickUp task.** The fields the old sync dropped are mapped in, so the synced task carries the full job detail. | Ben opens the **new ClickUp task** and sees the fields that were missing before — a clear before/after. | ▢ gated on KR1 |
| KR3 | **Token-free path, repeatable.** The whole sync runs through the logged-in Chrome session via OpenCLI — no API token anywhere — and is captured as a runnable recipe. | It ran with **both tokens dead**; the recipe is written so it repeats on the next job. | ▢ |

> KR1 is the discovery that **defines** "full" for KR2 — build it first, then KR2 falls out of it.

---

## Architecture Invariants (INV)

```
INV-0 (THESIS) — A complete APR job MUST sync into a ClickUp task through the logged-in
                 browser session with NO API token, AND the resulting task MUST carry every
                 job field the dashboard holds (or explicitly flag each one it cannot).
  FAIL-WHEN: the sync requires a Valcre/ClickUp API token to run, OR the created ClickUp task
             is missing dashboard fields with no recorded reason.
  PROVED-BY: with both API tokens absent/dead, running the OpenCLI sync on VALTA JOBS Temp V2
             produces a ClickUp task; a field-by-field diff of dashboard vs task shows every
             dashboard field either PRESENT in the task or listed in the truth table with a
             stated skip-reason.
```

```
INV-1 — The sync MUST act through Ben's existing logged-in Chrome session, NEVER a fresh
        re-auth or a separate headless browser.
  FAIL-WHEN: the run opens a login screen or spawns its own Chromium instead of using profile mvb399jv.
  PROVED-BY: `opencli doctor` shows profile mvb399jv connected; the sync commands run as
             `opencli browser mvb399jv <cmd>` against that session.
```

```
INV-2 — The run MUST NOT mutate any real client job destructively; ClickUp writes land on the
        designated test job only.
  FAIL-WHEN: a field is written to a production job/card that wasn't the named test target.
  PROVED-BY: the only ClickUp task created/modified in the run is the VALTA JOBS Temp V2 test task.
```

---

## What "done" looks like

A repeatable, token-free way to push a full APR job into ClickUp through the browser, proven on
one real job, with a truth table that tells us exactly which fields the path carries and which it
can't (and why). Ben opens the resulting ClickUp task and sees the full job.

## Guardrails / out of scope

- **No builder delegation** — qa-agent runs it solo (Ben's call this round).
- **No code change to the APR dashboard or its sync button** unless KR1 proves a field is
  un-syncable through the browser and only a code fix unblocks it — and even then it's flagged
  to Ben first, not done silently.
- **Not** restoring the dead API tokens — the whole point is to route around them.
- **Not** building a dedicated Browser-Use skill yet (separate findings-doc open item).
- Test job only — no production ClickUp cards touched (INV-2).

## Owner + mode

- **Owner:** qa-agent, solo, driving via OpenCLI (`opencli browser mvb399jv …`).
- **co-architect:** authors + holds this PRD, routes the spec gate, documents results back into
  the findings doc, presents proof to Ben.
- **Gate:** qa-agent's own verification discipline (four-layer probe) — the ClickUp write is
  verified by reading the task back, not by the command's success signal.

## Open questions for Ben (lock these)

1. **"Full" target** — should the ClickUp task carry *every* dashboard field, or a chosen subset
   (e.g. skip internal/system fields)? Default: everything, with the truth table surfacing the
   noise so we trim it together.
2. **Where the fuller task lives** — a new ClickUp list/template for the richer task, or the
   existing APR list? (Affects KR2's "fuller" structure.)

---

*Authored by co-architect, 2026-06-21, off the browser-automation testing thread. Condensed PRD —
qa-agent solo, browser-driven. Living until locked; folds results back into browser-automation-findings.md.*
