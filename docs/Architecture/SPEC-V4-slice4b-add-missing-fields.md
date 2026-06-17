---
id: spec-v4-slice4b-add-missing-fields
title: "SPEC — V4 Slice 4b: Add the 16 missing S2 fields to the report builder (+ close the §10 cascade bridge)"
created: 2026-06-17
type: implementation-spec
status: for-spec-gate (QA flaw-review) → then Ben sign-off → then build
track: "Branched from Slice 4 (Ben approved the branch 2026-06-17)"
owner: co-architect (author) · ui-designer (registry/seed) · react/fullstack (build) · qa-agent (4-file-sync verify + cascade-render) · Ben (sign-off)
source: SEED-V4b-add-missing-fields.md (Slice-4 Phase-1 reconcile, 0-hit confirmed)
tags: [apr, v4, slice-4b, field-registry, missing-fields, cascade-bridge, four-file-sync, section-10]
---

# SPEC — V4 Slice 4b: Add the 16 missing S2 fields (+ close the §10 cascade bridge)

> **One line:** The report builder is missing 16 fields that Chris's registry requires and V3 Section 2
> collects — the valuation-cascade + job-classification set. Add each via the mandated 4-file sync so V4
> can RECEIVE them. Adding + wiring the cascade cluster closes the Slice-3 §10 cascade-bridge in the
> same stroke (V4 finally has fields to land §10 in).

> **PREP — nothing builds until QA passes + Ben signs off.**

## Why this exists (the reconcile earned it)
Slice-4 Phase-1 reconcile confirmed these 16 are **0-hit in `fieldRegistry.ts`** — genuinely absent, not renamed/misplaced. V4's S1/S2 registry was the LOE-document/appraiser field set; it had no home for the cascade/classification set. **This is exactly why the §10 cascade "never bridged to the builder" (Slice-3).** Closing this list closes that gap.

## The 16 fields (authority: `SEED-V4b-add-missing-fields.md` — that table is the field list of record)
All **section-home = S2 (loe-prep)** per the pre-acceptance rule. Two kinds — the distinction drives the build:
- **DIRECT (User Input)** — a plain control the appraiser/intake fills: `StatusofImprovements`, `AssignmentType`, `Valuetimeframe`, `TransactionStatus`, `ZoningStatus`, `CMHCFinancing`, `LandMetric`, `DesktopReport`, `CurrentUseImprovements`, `ProposedUseImprovements`, `PreviouslyAppraised`, `DeliveryTime`.
- **⚑ LOGIC/DERIVED (computed by `loeCascade.ts`, NOT free input)** — `StateofImprovements`, `ValueScenarios`, `ApproachestoValue`, `ClientDocuments`. These are produced by the cascade engine; the build must FEED `loeCascade.ts` output into the builder field, not just add an empty control. **This is the cascade-bridge close.**

## Per-field build — the mandated 4-FILE SYNC (CLAUDE.md rule) + verify
For EACH of the 16, all four, no partial syncs:
1. **`fieldRegistry.ts`** entry (section-home = loe-prep/S2; id/storeId; control per the seed; dropdown list).
2. **`Report-MF-template.html`** `{{placeholder}}` where it renders.
3. **`TestDataSet1`** value (so the fixture carries it — ties to Slice-4 Phase-4 fixture).
4. **EditPanel** control.
Then **render-verify** (the field appears + populates in the report preview).

- **Dropdown option lists** (`ListStatusofImprovements`, `ListValueScenarios`, …): source the option sets from Chris's registry; for the LOGIC/DERIVED lists, the values come from `loeCascade.ts` (`STATUS_TO_SCENARIOS`, `deriveValueScenarios`, `STATUS_TO_APPROACHES`, etc.) — reuse, don't re-author.
- **Cascade wiring (the 4 derived fields):** feed `loeCascade.ts` output → the new V4 fields via the existing `useLoadJobIntoReport` bridge (the Slice-3 mechanism, now with a home to land in). Pass values RAW (no lossy transform).

## Acceptance (verified on the DEPLOYED app)
1. All 16 fields exist in `fieldRegistry.ts` with section-home = S2; QA reconciles each entry vs `SEED-V4b…` + Chris's `Valta-field-v03.xlsx`.
2. Each field passes the **4-file sync** (registry + template placeholder + TestDataSet + EditPanel) — QA verifies no partial syncs.
3. **§10 CASCADE-BRIDGE CLOSED:** load a job with section-2 cascade data → `StatusofImprovements` + the derived `ValueScenarios`/`ApproachestoValue`/`StateofImprovements` populate in the report from the job's cascade (same values §10 produces). The Slice-3 gap is gone.
4. The 12 direct fields render + accept their values; dropdown option sets match Chris's registry.
5. No regression to the existing report fields or the Slice-4 machinery.
6. `tsc --noEmit` + build clean; deployed Vercel build passes.
7. **Hand-off to Slice 4:** once added, these 16 become part of the shared-source set — Slice-4's capture + drift-check now cover them (they graduate from "class 3 absent" to "class 1 present"). Note in the registry so Slice-4 picks them up.

## Out of scope
- The Slice-4 machinery itself (shared-source generator + drift-check) — that's Slice 4, running in parallel; 4b just adds the fields it will then cover.
- Section 3/4 deep building fields — still out (not in Chris's registry).
- Calculator / SaaS tracks.

---

*co-architect, 2026-06-17. Branched from Slice 4 per Ben. Off `SEED-V4b-add-missing-fields.md`. → QA spec-gate → Ben sign-off → build (react/fullstack + ui-designer registry) → QA 4-file-sync + cascade-render verify. Closes the Slice-3 cascade-bridge gap.*
