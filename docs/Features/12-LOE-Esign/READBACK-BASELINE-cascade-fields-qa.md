---
id: readback-baseline-cascade-fields
title: "Cascade→Valcre readback — Phase A baseline (before-state) + Phase B plan"
date: 2026-06-15
type: verification-baseline
author: qa-agent
status: phase-a-captured
test_job: VAL261101 / Job 784140 / Property 25802872 (Westside Mall, Industrial)
tags: [loe, cascade, valcre, readback, verification, before-state]
---

# Cascade→Valcre readback — Phase A baseline

**Why this exists:** "wired + typecheck clean" ≠ "lands." This is the empirical before-state so the
post-deploy readback can prove each write actually reaches Valcre (a CHANGE from empty → populated),
not just that the code compiles. Captured read-only (safe; no live writes).

## How it was read (read-only, team tools)
1. `npx tsx tests/valcre/test-valcre-job-by-number.ts VAL261101` → Job Id **784140**, Property Id **25802872**.
2. `bash ~/.claude/scripts/apr/valcre-get-custom-field-values.sh 784140` → Job custom-field VALUES
   (GetValues `entityId=784140&type=6`). Raw `AvailableValueId`/`SelectedIds` read directly — the
   script's hardcoded `ID_TO_NAME` is STALE (old 59xx ids), so values mapped against the live
   definitions (`VALCRE-CUSTOM-FIELDS-LIVE-PULL-2026-06-15.txt`), not the script's labels.
3. Property.SecondaryType (native) = a Property entity read (not GetValues).

## Phase A — before-state (2026-06-15, pre-deploy)

| Field (dashboard) | Valcre target | CF | Before-state | Note |
|---|---|---|---|---|
| Value Scenarios | ValueScenarios | 12414 | **7499, 7506** (populated) | the one field already syncing |
| Status of Improvements | StatusofImprovements | 12407 | **7434** (populated) | wired last session |
| **Value Timeframe** | Valuetimeframe | 12419 | **EMPTY** | wired last session — should populate post-deploy |
| **Approaches to Value** | ApproachestoValue | 12415 | **EMPTY** | wired 2026-06-15 — should populate post-deploy |
| **Tenancy** | Tenancy | 12408 | **EMPTY** | wired 2026-06-15 — should populate post-deploy |
| **Property Rights** | InterestAppraised | 12412 | **EMPTY** | wired 2026-06-15 — should populate post-deploy |
| **Property Subtype** | `Property.SecondaryType` (native) | — | **None** (per PV-1, 06-10) | value-set pending Chris (see PV-1) |

## Phase B — write→readback (POST-DEPLOY ONLY, Ben-gated)

**Do not run before the deploy** — the server changes (Property Rights → interestAppraised alias,
empty-native-PATCH skip, proxy-error-surfacing) aren't live yet, so a write now tests STALE code.

Per-field, after deploy, on the test job only:
1. Edit the field in the dashboard (drives the real client→proxy→Valcre path).
2. Re-run the read above.
3. **PASS** = the four EMPTY fields flip to populated with the expected option ids; **FAIL** = still
   empty (→ the empty-native-PATCH bug or another blocker is still in play — diagnose, don't mute).
4. Property Subtype: separate — blocked on Chris's accepted value set (PV-1), not on wiring.

Expected option-id targets (from the live definitions, for the PASS check):
- Tenancy (12408, SingleOption): 7418-7423 per the chosen option.
- Approaches (12415, MultiOption): 7513 / 7514 / 7515 / 7516.
- Property Rights (12412, MultiOption): 7469 / 7470 / 7471 / 7472.
- Value Timeframe (12419, SingleOption): per live definition.

*qa-agent · Phase A captured read-only 2026-06-15. Phase B is the deploy-gated proof — the
"done-done" gate I owe after the wired≠lands correction.*
