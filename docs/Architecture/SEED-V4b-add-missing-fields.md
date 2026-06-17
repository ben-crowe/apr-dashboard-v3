---
title: "Slice-4b SEED — Fields absent from V4 (must ADD to fieldRegistry)"
status: seed-spec (branched from Slice-4 Phase-1 capture)
created: 2026-06-17
owner: "ui-designer (registry) + co-architect (spec) + react (build) + qa (4-file-sync verify)"
source: Slice-4 Phase-1 reconcile — Chris VALTA-FIELD-SPEC vs V4 fieldRegistry.ts (0-hit confirmed)
tags: [apr, v4, slice-4b, field-registry, missing-fields, cascade-bridge, four-file-sync]
---

# Slice-4b SEED — Chris-registry / V3-Section-2 fields ABSENT from V4

> Slice-4 Phase-1 reconcile confirmed these are **0-hit in `src/features/report-builder/schema/fieldRegistry.ts`** — not renamed, not misplaced, genuinely missing. This is WHY the section-10 valuation cascade never bridged to the report builder (Slice-3 finding): V4 had no fields to land them in. Closing this list also closes the cascade-bridge gap — same work.

**Per-field ADD work (mandated 4-file sync + verify):** (1) `fieldRegistry.ts` entry (section-home = **loe-prep / S2**), (2) `Report-MF-template.html` `{{placeholder}}`, (3) `TestDataSet1` value, (4) EditPanel control → then render-verify.

| Field | Label | Control | Source | Dropdown | Valcre (routesTo) | Derived? |
|---|---|---|---|---|---|---|
| `StatusofImprovements` | Status of Improvements | Select one | User Input | ListStatusofImprovements | CF12407 | direct |
| `StateofImprovements` | State of Improvements | Select one | Logic | ListStateofImprovements | CF12409 | direct |
| `AssignmentType` | Assignment Type | Select one | User Input | ListAssignmentType | CF12416 | direct |
| `TransactionStatus` | Transaction Status | Select multiple | User Input | ListTransactionStatus | CF12424 | direct |
| `ZoningStatus` | Zoning Status | Select one | User Input | ListZoningStatus | CF12425 | direct |
| `CMHCFinancing` | CMHC Financing | Select one | User Input | ListYes/No | CF12427 | direct |
| `LandMetric` | Land $/Metric | Select one | User Input | ListLand$/Metric | CF12426 | direct |
| `DesktopReport` | Desktop Report | Select one | User Input | ListYes/No | CF12418 | direct |
| `ClientDocuments` | Client Documents | Select multiple | Logic | ListClientDocuments | CF12422 | direct |
| `CurrentUseImprovements` | Current Use | Select one | User Input | ListCurrentUse | CF12410 | direct |
| `ProposedUseImprovements` | Proposed Use | Select one | User Input | ListProposedUse | CF12411 | direct |
| `PreviouslyAppraised` | Previously Appraised | Select one | User Input | ListYes/No | CF12423 | direct |
| `DeliveryTime` | Delivery Time | Whole Number | User Input | — | CF12420 | direct |

## Notes
- **Cascade cluster** (StatusofImprovements → ValueScenarios → ApproachestoValue, + StateofImprovements) carries the section-10 logic — adding these + wiring `loeCascade.ts` output into the builder IS the cascade-bridge close.
- **StateofImprovements** is also the S3→S2 move (Slice-4); here it additionally needs a net-new V4 field.
- All section-home = **S2 (loe-prep)** per the pre-acceptance rule.
- Attributes pulled from the canonical registry; QA reconciles each new fieldRegistry entry vs Chris VALTA-FIELD-SPEC + the 4-file sync.
