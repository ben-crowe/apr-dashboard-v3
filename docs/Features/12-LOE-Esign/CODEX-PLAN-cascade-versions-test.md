---
id: codex-plan-cascade-versions-test
title: "Codex execution plan — drive the cascade versions on the test job + capture evidence"
date: 2026-06-15
type: executor-plan
author: qa-agent
executor: codex
verifier: qa-agent (reads Valcre + Supabase after each step)
test_job: VAL261101 / Westside Mall / Supabase id e5a7ba2f-0535-4fbf-9ba7-b7027cf0a157 / Valcre Job 784140
tags: [loe, cascade, codex, e2e-test, valcre-verify]
---

# Codex plan — cascade versions on the test job

**Division of labor:** Codex DRIVES the real app (real clicks, logged-in) and captures screenshots/PDF.
qa-agent VERIFIES each step against Valcre + Supabase. Codex does NOT need to verify Valcre — just
drive + screenshot honestly, including any error popups.

## Pre-flight (Codex, before any clicks)

1. App running at **http://localhost:8086** (APR dev port — NOT 5173). If down: `cd ~/Development/APR-Dashboard-v3 && npm run dev`.
2. **Be LOGGED IN.** The dashboard renders without login but SAVES only persist with an authenticated
   Supabase session (RLS). If `/login` shows a logged-out state, log in first (Ben's test account).
   This is the single thing qa-agent's headless session could not do — it's why you're driving.
3. Real clicks only — real pointer (CDP `Input.dispatchMouseEvent` / `agent-browser --cdp <port> click`),
   never `element.dispatchEvent` (inert). Screenshot before + after every state change; READ the pixels.
4. Save every screenshot with a clear name: `codex-cascade-<Vn>-<before|after|popup>.png`.

## ⚠ Read this first — expected partial results (NOT your bug)

The dashboard's `/api` calls hit the **DEPLOYED** Vercel server (Vite proxies `/api` → prod), so the
server-side fixes that are committed-but-NOT-deployed are NOT in effect yet. Expect, pre-deploy:
- **Property Rights** will NOT reach its custom field (its server alias isn't deployed) — may throw a
  "Failed to sync" popup. EXPECTED. Screenshot it, don't debug it.
- **Custom-only fields** (Value Scenarios / Approaches / Status / Timeframe / Tenancy) may throw a
  "Failed to sync" popup from the empty-native-PATCH bug (server fix not deployed). EXPECTED.
- **Subtype** "Mixed-Use" is not a value Valcre's native Subtype accepts → silent no-write. EXPECTED (Chris Q).
So: capture whatever happens honestly. qa-agent interprets pass/fail against Valcre. The IDEAL run is
AFTER Ben deploys the bundle — ask Ben whether to run pre- or post-deploy.

## The cascade picker (where it is)

Open job **VAL261101 - Westside Mall** from the Jobs list → scroll to **Section 2 "LOE Quote &
Valuation Details"** → top-right control labeled **"Cascade Options — pick a scenario"** (a dropdown).
Picking a version auto-fills the cluster below: Status of Improvements, Value Scenarios, Approaches to
Value, Property Rights.

The four versions and what each should cascade to:

| Version | Status of Improvements | Value Scenarios | Approaches |
|---|---|---|---|
| **V1** | Completed | As Stabilized | Direct Comparison + Income |
| **V2** | Under Renovation | As-Is + As If Complete & Stabilized | Direct Comparison + Income + Cost |
| **V3** | Improved Land (Demo Req) | As If Vacant Land + As If Complete & Stabilized | Land Direct Comparison + Cost |
| **V4** | Insurance | Insurable Replacement Cost | Cost Approach |

## Steps — do this for V1, then V2, then V3, then V4

For each version:
1. Screenshot Section 2 BEFORE (`...-before.png`).
2. Click the **"Cascade Options — pick a scenario"** dropdown. Confirm the menu actually OPENS
   (screenshot the open menu — this is the exact step automation failed at; verify it opened).
3. Click the version (e.g. "Completed" for V1).
4. Screenshot Section 2 AFTER (`...-after.png`) — the Status / Value Scenarios / Approaches / Property
   Rights fields should now show the cascaded values from the table above.
5. If ANY toast/popup appears (e.g. "Failed to sync … to Valcre"), screenshot it (`...-popup.png`) and
   note the EXACT text.
6. Tell qa-agent "Vn done" → qa-agent reads Valcre Job 784140 + Supabase and reports what actually landed.

(Optional, if Ben wants the named-draft part too: after a version, click **"Create Contract"** and save
it as a draft named e.g. **"V1 LoE Cascade"**, then screenshot the Saved Documents pills.)

## What qa-agent does after each "Vn done"
- `npx tsx ~/Development/APR-Dashboard-v3/tests/valcre/test-valcre-job-by-number.ts VAL261101` (sanity)
- `bash ~/.claude/scripts/apr/valcre-get-custom-field-values.sh 784140` → compare to the baseline in
  `READBACK-BASELINE-cascade-fields-qa.md` (did Value Scenarios / Approaches / Tenancy / Status / Timeframe
  flip to the version's expected option ids?).
- Supabase read of `job_loe_details` + `job_property_info` for the cascade columns (did it persist?).
- Report per-field: LANDED / DID-NOT-LAND / EXPECTED-FAIL (pre-deploy), with the evidence.

## Baseline (qa-agent already captured, read-only)
Job 784140 before any change: ValueScenarios=7499,7506 (populated); StatusofImprovements=7434
(populated); Tenancy / InterestAppraised / ApproachesToValue / Valuetimeframe = EMPTY. Full table +
expected option-id targets in `READBACK-BASELINE-cascade-fields-qa.md`.

*qa-agent · plan for Codex. Codex drives + screenshots; qa verifies in Valcre + DB. Recommend running
AFTER the deploy bundle ships so results reflect the intended behavior, not stale-server failures.*

---

## ADDENDUM (2026-06-15) — run BOTH paths: cascade vs direct-edit

Ben's diagnostic: the cascade picker fires many field-saves at once; a DIRECT single-field edit may
behave differently. Run BOTH and compare — same field, both ways — so we isolate whether a sync/persist
failure is cascade-specific or universal.

**qa-agent already proved (cascade path, V1, unauthenticated session):**
- Drove the cascade picker; V1 cascaded on-screen correctly (Status→Improved-Completed, Value
  Scenarios→As Stabilized, Approaches→Direct Comparison+Income).
- Valcre RECEIVED: Value Scenarios (→As Stabilized / id 7504) + Status of Improvements (→7432). ✓
- Valcre did NOT receive: Approaches, Value Timeframe, Property Rights. ✗
- The dashboard's OWN DB (job_loe_details + job_property_info) did NOT retain the cascade values
  (read back empty) — BUT the session was unauthenticated, so this persistence result is CONFOUNDED.
  A logged-in run is required to know if this is RLS-on-an-unauthed-session vs a real bug.

**Codex (LOGGED IN), for each of these fields — Value Scenarios, Approaches, Status of Improvements,
Value Timeframe — do the A/B:**
1. CASCADE path: pick a version, note the field's new value, screenshot. Tell qa → qa reads Valcre+DB.
2. DIRECT path: change that ONE field via its own dropdown (no cascade), blur it, screenshot. Tell qa →
   qa reads Valcre+DB.
3. For each, qa reports: did it reach Valcre? did it persist to Supabase? — and whether cascade and
   direct give the SAME answer or DIFFER. If they differ, that's the cascade-specific bug Ben suspected.

**Run order:** ideally AFTER Ben deploys the committed server bundle (so Approaches/Timeframe/Property
Rights have their server handling live). Pre-deploy, expect those three to fail to sync BOTH ways
(server, not cascade) — which is itself the answer.
