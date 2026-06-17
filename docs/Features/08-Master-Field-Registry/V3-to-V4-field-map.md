---
title: "V3 → V4 Field Map — registry-keyed, bridge-grounded"
status: input-to-registry-extension (hand-fold by ui-designer → HTML FIELDS → regenerate → QA reconcile)
type: field-map
created: 2026-06-16
author: co-architect (fullstack fork)
owner: ui-designer (folds into HTML registry) · co-architect (authored) · qa-agent (reconcile)
companion: ./V3-to-V4-field-map.json
grounded_against:
  - src/features/report-builder/hooks/useLoadJobIntoReport.ts  (the live V3→V4 bridge — status authority)
  - docs/Features/08-Master-Field-Registry/GENERATED-field-mapping.json  (48-field intake/LOE registry — diff target + row shape)
  - src/integrations/supabase/types.ts  (job_submissions / job_loe_details / job_property_info columns)
tags: [apr, v4, field-map, registry-extension, bridge, value-scenarios, three-way-reconcile]
---

# V3 → V4 Field Map

> **What this is:** every V3 Section 1 (intake) + Section 2 (LOE/valuation) field, keyed by the
> **registry field `name`** (1:1 against `GENERATED-field-mapping.json`), tagged with a `status`
> flag and a `reportTarget`. It is an **input to ui-designer's fold**, not to the generator
> (HTML FIELDS is canonical; the script only emits, never ingests).

## ⚠ Read the status definition before folding — it is BRIDGE-FLOW, not registry-presence
The three V3 fields and the report builder share the registry as a field universe, so "registry
presence" alone wouldn't surface the real gap. **The actual V3→V4 question is: does the field's
value get carried into the report builder today?** That is the live `useLoadJobIntoReport` bridge.
So `status` here means:

- **`maps-clean`** — the bridge carries the value into a report-builder store field faithfully (an id-rename is fine if the value is intact).
- **`mismatched-stale`** — the bridge carries it but **lossy / option-collapsed / drops sub-parts** (needs a fix, not just a new mapping).
- **`missing-in-v4`** — **NOT bridged into the report builder at all** (no entry in `fieldMappings`). The field exists in the intake registry/Valcre, but its value never reaches the report builder. This is the work list.

`reportTarget` = the verified Valcre target from the registry `routesTo` (CF id or native path).
Template `{{placeholder}}` side is **unverified** (would need a template dig) — marked as such, never invented (cite-or-drop).

## Counts (derived from the 52 rows, not guessed)
- **maps-clean: 15**
- **mismatched-stale: 2**
- **missing-in-v4: 35**
- Total rows: 52 (48 intake-registry fields + 4 report-store fields that are registry gaps)

## Headline gaps (what matters most for the V3→V4 data flow)

1. **The ENTIRE LOE valuation cascade does not bridge into the report builder.** `StatusofImprovements` (CF12407) → `ValueScenarios` (CF12414) → `ApproachestoValue` (CF12415), plus `Tenancy` (CF12408), `Valuetimeframe` (CF12419), `StateofImprovements` (CF12409). This is the engine that drives §10 of the LOE — none of it reaches the report builder today. **Biggest gap.**
2. **`PropertyType` is stale (mismatched).** The bridge's `typeMap` collapses Single-Family→Multi-Family and Agriculture→Land (lossy), and ignores the registry's `Property.Type`(single)+`Property.Types`(multi) dual-write.
3. **`PropertyAddress` is lossy (mismatched).** Bridge takes `parseAddress(...).street` only — city/province/postal are dropped for the property (the client address keeps all four). `parseAddress` itself is a heuristic comma-split.
4. **`PropertySubtype` (Property.SecondaryType) and `AssignmentType` (CF12416) don't bridge** — both shape valuation framing.
5. **`TransactionStatus` (CF12424), `ZoningStatus` (CF12425), `CMHCFinancing` (CF12427), `LandMetric` (CF12426)** — Section-2 valuation context, none bridged.
6. **`CurrentUseImprovements` / `ProposedUseImprovements` / `PreviouslyAppraised`** (CF12410/12411/12423) — not bridged.
7. **All scheduling/fee fields** (`Fee`, `InspectionDate`, `DueDate`, `DeliveryTime`, `Paid`/`PaidDate`/`AmountPaid`, `RequestDate`, `SignedDate`) — not bridged (may be intentional for a report builder, but flagged for the decision).
8. **Registry gaps (bridged but not in the intake registry):** `LegalDescription`, `ScopeOfWork`, the subject-`PropertyContact` set, and the computed `ReportDate` flow into V4 but aren't represented in `GENERATED-field-mapping.json` — registry should add them.
9. **`EA1`–`EA5`** are the §10 EA/HC summary slots (cascade-derived outputs, not intake fields) — correctly not-bridged; listed for completeness.

## What maps-clean today (the 15 that already flow)
`JobNumber`, `ClientCompanyName`, `ClientOrganizationAddress`, `ClientFirstName`, `ClientLastName`,
`ClientPhone`, `ClientEmail`, `PropertyName`, `ReportType`, `InterestAppraised` (→ store `property-rights`),
`AuthorizedUse` (→ store `intended-use`), plus the 4 registry-gap report-store fields
(`LegalDescription`, `ScopeOfWork`, `PropertyContact`, `ReportDate`).

## How ui-designer folds this
1. Diff `V3-to-V4-field-map.json` vs the live `GENERATED-field-mapping.json` (same `name` keys → clean 1:1 diff).
2. Fold `status` + `reportTarget` into the HTML `FIELDS` rows (and add the 4 registry-gap rows).
3. Regenerate the derivatives; QA reconciles vs `api/valcre.ts`.

## Method / honesty
- Status authority = the bridge (`useLoadJobIntoReport.ts`), read in full — not inferred from names.
- Row shape + the 48 `name` keys = lifted verbatim from `GENERATED-field-mapping.json` for a clean diff.
- Cite-or-drop: template `{{placeholder}}` targets are marked unverified, never invented.
