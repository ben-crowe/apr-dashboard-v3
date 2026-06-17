---
id: spec-v4-slice4b-add-missing-fields
title: "SPEC — V4 Slice 4b: Add the ~13 missing S2 fields to the report builder (DIRECT adds; cascade already lands via Slice-3)"
created: 2026-06-17
type: implementation-spec
status: for-spec-gate (QA flaw-review) → then Ben sign-off → then build
track: "Branched from Slice 4 (Ben approved the branch 2026-06-17)"
owner: co-architect (author) · ui-designer (registry/seed) · react/fullstack (build) · qa-agent (4-file-sync verify + cascade-render) · Ben (sign-off)
source: SEED-V4b-add-missing-fields.md (Slice-4 Phase-1 reconcile, 0-hit confirmed)
tags: [apr, v4, slice-4b, field-registry, missing-fields, cascade-bridge, four-file-sync, section-10]
---

# SPEC — V4 Slice 4b: Add the ~13 missing S2 fields (DIRECT adds)

> **One line:** The report builder is missing ~13 job-classification fields that Chris's registry requires
> and V3 Section 2 collects. Add each via the mandated 4-file sync so V4 has a home for them. **All DIRECT
> fields** — the cascade-DERIVED outputs (value-scenario/approaches/timeframe) ALREADY exist + land via the
> Slice-3 bridge, so this slice does NOT re-wire the cascade (see Corrected Classification below).

> **PREP — nothing builds until QA passes + Ben signs off.**

## Why this exists (the reconcile earned it)
Slice-4 Phase-1 reconcile confirmed these 16 are **0-hit in `fieldRegistry.ts`** — genuinely absent, not renamed/misplaced. V4's S1/S2 registry was the LOE-document/appraiser field set; it had no home for the cascade/classification set. **This is exactly why the §10 cascade "never bridged to the builder" (Slice-3).** Closing this list closes that gap.

## ⚑ CORRECTED FIELD CLASSIFICATION (QA gate + co-arch code-verify, 2026-06-17 — the seed's "16 all-absent / 4 derived" was WRONG)
QA caught two seed errors; co-arch confirmed both directly in code. The list is NOT "16 absent, add all." Three buckets:

**A. ALREADY EXIST in V4 + ALREADY FED by the Slice-3 bridge → DO NOT add (would create empty duplicates):**
- `ValueScenarios` = exists as **`value-scenario`** (`fieldRegistry.ts:2734`), fed by `useLoadJobIntoReport:228`.
- `ApproachestoValue` = exists as **`approaches-applied`** (`:2648`), fed `:232`.
- `Valuetimeframe` = exists as **`timeframe`** (`:21093`), fed `:236`.
- The seed's "0-hit" was a PascalCase grep miss (real ids are kebab). **⚑ Adding new fields alongside = data keeps landing in the old ones, new stay empty → the headline acceptance FAILS.** These 3 are DONE (Slice-3). If canonical-naming is later wanted, that's a RE-POINT/rename — NOT an add, and not this slice. **So the §10 cascade-bridge derived outputs ALREADY LAND** — the "cascade-bridge close" framing was overstated; Slice-3 closed it for the derived values.

**B. MISLABELED "derived" → actually DIRECT user input (no computation logic exists):**
- `StateofImprovements` — seed said Logic/derived; it's a plain user `Select` (`OrganizingDocsSection:217`), zero derivation in `loeCascade.ts`. Add as DIRECT.
- `ClientDocuments` — seed said Logic/derived; no derivation logic anywhere. Add as DIRECT (or a doc-list), NOT cascade-fed.
- (`loeCascade.ts` genuinely derives ONLY `ValueScenarios`/`Approaches`/`PropertyRights` — and the first two already exist + are fed, bucket A.)

**C. GENUINELY ABSENT (0-hit confirmed) → ADD as DIRECT fields, section-home=S2:** `StatusofImprovements` (the cascade TRIGGER — user input), `AssignmentType`, `TransactionStatus`, `ZoningStatus`, `CMHCFinancing`, `LandMetric`, `DesktopReport`, `CurrentUseImprovements`, `ProposedUseImprovements`, `PreviouslyAppraised`, `DeliveryTime`, + the 2 reclassified from B (`StateofImprovements`, `ClientDocuments`). **All DIRECT — none are cascade-derived-and-unfed**, so this slice is field-adds (4-file sync), not cascade wiring (that's done).

**⚑ Net: this slice is ~13 DIRECT field ADDs, not 16, and NOT a cascade re-wire. ui-designer to correct the seed (3 exist, 2 mislabeled).**

## Per-field build — the mandated 4-FILE SYNC (CLAUDE.md rule) + verify
For EACH of the ~13 bucket-C (DIRECT) fields, all four, no partial syncs:
1. **`fieldRegistry.ts`** entry (section-home = loe-prep/S2; id/storeId; control per the seed; dropdown list).
2. **`Report-MF-template.html`** `{{placeholder}}` where it renders.
3. **`TestDataSet1`** value (so the fixture carries it — ties to Slice-4 Phase-4 fixture).
4. **EditPanel** control.
Then **render-verify** (the field appears + populates in the report preview).

- **Dropdown option lists** (`ListStatusofImprovements`, `ListTransactionStatus`, …): source the option sets from Chris's registry. (No cascade-derived lists here — the derived fields are NOT in this slice; they already exist + land via Slice-3.)
- **No cascade wiring in this slice** — the §10 derived outputs (value-scenario/approaches/timeframe) already exist and are fed by the Slice-3 bridge. This slice is DIRECT field-adds only. `StatusofImprovements` is added as the cascade TRIGGER input (direct), not a derived output.

## Acceptance (verified on the DEPLOYED app)
1. All ~13 bucket-C fields exist in `fieldRegistry.ts` with section-home = S2; QA reconciles each entry vs the corrected `SEED-V4b…` + Chris's `Valta-field-v03.xlsx`.
2. Each field passes the **4-file sync** (registry + template placeholder + TestDataSet + EditPanel) — QA verifies no partial syncs.
3. **No duplicates (the headline fix):** the bucket-A fields (`value-scenario`/`approaches-applied`/`timeframe`) are NOT re-added — they still populate from the Slice-3 bridge (verify they still fill; confirm no empty duplicate field was created). The §10 derived values already land — this slice does not re-wire that.
4. The ~13 bucket-C direct fields render + accept their values; dropdown option sets match Chris's registry; `StatusofImprovements` (the cascade trigger) is present as a report field.
5. No regression to the existing report fields or the Slice-4 machinery.
6. `tsc --noEmit` + build clean; deployed Vercel build passes.
7. **Hand-off to Slice 4:** once added, these 16 become part of the shared-source set — Slice-4's capture + drift-check now cover them (they graduate from "class 3 absent" to "class 1 present"). Note in the registry so Slice-4 picks them up.

## Out of scope
- The Slice-4 machinery itself (shared-source generator + drift-check) — that's Slice 4, running in parallel; 4b just adds the fields it will then cover.
- Section 3/4 deep building fields — still out (not in Chris's registry).
- Calculator / SaaS tracks.

---

*co-architect, 2026-06-17. Branched from Slice 4 per Ben. Off `SEED-V4b-add-missing-fields.md`. → QA spec-gate → Ben sign-off → build (react/fullstack + ui-designer registry) → QA 4-file-sync + cascade-render verify. Closes the Slice-3 cascade-bridge gap.*
