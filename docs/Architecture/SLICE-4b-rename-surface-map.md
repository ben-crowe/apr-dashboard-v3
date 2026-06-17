---
id: slice-4b-rename-surface-map
title: "SLICE-4b JOB 1 — Rename Surface Map + Safe-Execution Plan (PRE-RUN, QA-gated)"
created: 2026-06-17
type: surface-audit + execution-plan
status: for-QA-review-gate → then RUN → then QA verify-fills + drift-gate
authority: docs/Features/08-Master-Field-Registry/BASELINE-v03-2026-06-09-authority.{json,md}
owner: "ui-designer (author) · qa-agent (review-gate) · co-architect (spec)"
---

# SLICE-4b JOB 1 — Rename Surface Map (complete repo audit)

> **Why this exists:** the first rename attempt used an inline sed loop and CORRUPTED `fieldRegistry.ts`
> via substring chaining (`client-organization` is a substring of its own target `client-organization-address`).
> Reverted clean (HEAD `b1dabf5`), no damage shipped. This map + the paired script are the safe redo,
> **gated by QA before any run.**

## ⚑ TOP FINDING — renames touch 8–22 files each, NOT the protocol's 6

The protocol named 6 surfaces (fieldRegistry · bridge · workbookFieldMapping · template · TestDataSet ·
EditPanel). The audit found **every rename also hits**: `reportBuilderStore.ts`, `HomeTabPanel.tsx`, the
calc engine (`fieldGenerators.ts`, `salesCompCalculations.ts`, `calculator-demo-v4/CalculatorWithPreview.tsx`),
`TestInputDashboard.tsx`, a SECOND registry (`src/components/DocumentBuilder/services/FieldRegistry.ts`),
real-data fixtures (`northBattlefordTestData-REAL.ts`), **and the drift-gate stack** (see next).

## ⚑ DRIFT-GATE CONSISTENCY — every rename touches the gate master

EVERY one of the 9 ids appears in **`public/field-registry-v6.html`** (the drift-gate MASTER) and in the
committed **`GENERATED-*.json`** derivatives (`GENERATED-field-mapping.json`, `GENERATED-v4-form-config.json`,
`GENERATED-v3-drift-check.json`). **Do NOT hand-edit the GENERATED files** — they are emitted by
`scripts/generate-registry-derivatives.mjs` + `scripts/gen-v3-actual-manifest.mjs` from the master HTML.
**Correct order: rename in the master (`field-registry-v6.html`) + `fieldRegistry.ts`, then REGENERATE the
derivatives, then run the drift-gate.** Otherwise the gate baseline silently drifts.

## Per-field surface map (exact-token occurrences; backups/_archive EXCLUDED)

| Old id | New id | Kind | Files touched (count) | Gate master? |
|---|---|---|---|---|
| `client-organization` | `client-company-name` | rename | template(13) · store(3) · fieldRegistry(2) · HomeTabPanel(2) · EditPanel(1) · bridge(1) · TestData(1) · v6.html(1) · 2 scripts · 3 GENERATED | ✅ yes |
| `client-address` | `client-organization-address` | rename (TWIN, 2 defs) | template(6) · fieldRegistry(4) · store(4) · EditPanel(2) · HomeTabPanel(2) · northBattlefordREAL(2) · TestInputDashboard(2) · gen-table(2) · workbookMap(1) · bridge(1) · 2 template-backups · TestData(1) · DocBuilderFieldRegistry(1) · v6.html(1) · GENERATED | ✅ yes |
| `intended-use` | `authorized-use` | rename | store(4) · fieldRegistry(2) · v6.html(2) · bridge(1) · TestData(1) · DocBuilderFieldRegistry(1) · scripts · GENERATED · V3-to-V4-map | ✅ yes |
| `value-scenario` | `value-scenarios` | rename (CASCADE) | HomeTabPanel(6) · CalculatorWithPreview(3) · template(3) · fieldRegistry(2) · northBattlefordREAL(2) · store(2) · workbookMap(1) · EditPanel(1) · bridge(1) · TestData(1) · v6.html(1) · GENERATED | ✅ yes |
| `approaches-applied` | `approaches-to-value` | rename (CASCADE) | fieldRegistry(2) · bridge(1) · v6.html(1) · scripts · GENERATED | ✅ yes |
| `timeframe` | `value-timeframe` | rename (CASCADE) | fieldRegistry(2) · bridge(1) · v6.html(1) · scripts · GENERATED | ✅ yes |
| ~~`appraisal-fee`~~ | ~~`fee`~~ | **DROPPED** (co-arch 2026-06-17 — bare `fee` = substring footgun, no client harm leaving `appraisal-fee`; label-only change if 'Fee' wanted) | — | — |
| `impv-tenancy` | `tenancy` | **CONSOLIDATE 2→1** | template(3) · fieldRegistry(2) · bridge(2) · v6.html(2) · TestData(1) · GENERATED | ✅ yes |
| `property-rights` | `interest-appraised` | **CONSOLIDATE 3→2** (twin+existing) | store(6) · fieldRegistry(4) · fieldGenerators(3) · HomeTabPanel(3) · template(3) · EditPanel(2) · northBattlefordREAL(2) · CalculatorWithPreview(2) · v6.html(2) · gen-table(2) · workbookMap(1) · bridge(1) · salesCompCalc(1) · DocBuilderFieldRegistry(1) · GENERATED | ✅ yes |

## Target-collision facts (verified)
- `tenancy` — already 1 def (impv/building-overview). Consolidation: **impv-tenancy removed, surviving `tenancy`=1.**
- `interest-appraised` — already 1 def (exec/property-identification). Consolidation: **exec property-rights twin merges INTO it; loe-prep property-rights renames to interest-appraised → surviving interest-appraised=2 (loe-prep + exec), property-rights=0.**
- `fee` — 0 existing defs (no collision), but a dangerously generic id. ⚑ **Recommend leaving `appraisal-fee` as-is** (clearer, no client harm) unless co-arch insists; flagged for decision.

## ⚑ Risk surfaces needing same-field confirmation BEFORE rename (calc engine)
- `property-rights` appears in `salesCompCalculations.ts` + `fieldGenerators.ts` + `calculator-demo-v4`. Must confirm these reference the EXACT `property-rights` field (not `comp1-property-rights`, `comp1-adj-property-rights`) before the script touches them — the script uses exact quoted/braced tokens, which already exclude comp-prefixed siblings, but QA should spot-confirm the calc refs are the assignment field.
- `value-scenario` in HomeTabPanel(6) + CalculatorWithPreview(3) — same exact-token guard; confirm not `value-scenario1..6`.

## Safe-execution plan (the paired script: `scripts/slice4b-rename.mjs`)
1. **Sentinel two-phase** per id: `OLD → @@RENAME_n@@ → NEW`. Eliminates ALL substring chaining (the corruption cause).
2. **Exact token forms only**: `"id"`, `'id'`, `` `id` ``, `"id":`, `{{id}}`. Never bare substring. Excludes comp-prefixed + numbered siblings.
3. **EXCLUDE**: `*.backup`, `*.bak`, `_archive/`, `dist/`, `.vercel/`, `node_modules/`. (Backups + dist regenerate.)
4. **GENERATED-*.json NOT hand-edited** — script renames master (`field-registry-v6.html`) + `fieldRegistry.ts` + code, THEN runs `generate-registry-derivatives.mjs` + `gen-v3-actual-manifest.mjs` to re-emit derivatives consistently.
5. **Consolidations = block-delete + rename**: remove `impv-tenancy` def + remove exec `property-rights` twin def (block-aware, by id+section), then rename remaining occurrences.
6. **Per-field def-count asserts** (the QA point — targets do NOT start at 0 for the 2 consolidations):
   - 7 clean renames: `OLD defs == NEW defs` (before==after), `OLD remaining == 0`.
   - `tenancy`: after = 1 (impv-tenancy removed), impv-tenancy = 0.
   - `interest-appraised`: after = 2 (loe-prep + exec), `property-rights` = 0, NO double exec def.
7. **DRY-RUN by default** — prints every planned change + the assert table; only applies with `--apply`.
8. After `--apply`: `npm run build` (drift-gate must stay green) + render-verify each renamed field still FILLS.

## ⛔→✅ QA FAIL FIX (round 1 → round 2) — property-rights calc-collision

QA round-1 caught: `property-rights` is ALSO a sales-comp ADJUSTMENT CATEGORY (`fieldGenerators.ts` →
`comp{n}-adj-property-rights` ×40; `salesCompCalculations.ts` `transAdj`) — same literal token, different concept.
A blanket re-point would emit `comp1-adj-interest-appraised` while templates keep `{{comp1-adj-property-rights}}`
→ the 40-field comp grid silently breaks, and the fieldRegistry-only asserts wouldn't catch it. Fix applied:
- `FILE_EXCLUDE['property-rights'] = ['fieldGenerators.ts', 'salesCompCalculations.ts']` — category-key files left untouched.
- `READ_SCOPE['CalculatorWithPreview.tsx'] = ['property-rights', 'value-scenario']` — only `getFieldString('OLD')` reads
  rename; `values['OLD']` output keys stay (verified by simulation: L364-366 `values[]` unchanged, reads renamed).
- property-rights re-point: 14 → **12 files** (2 calc files excluded). Other 7 ops unchanged (QA-cleared).

**STATUS: PRE-RUN (round 2, QA-fix applied). Re-routed to QA spot-verify. Do NOT --apply until QA re-PASSes.**
