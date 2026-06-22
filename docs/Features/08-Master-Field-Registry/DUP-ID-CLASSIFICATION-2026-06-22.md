---
content_type: findings
title: Duplicate-ID Classification — V4 report-builder registry (v2, FIX-1 corrected)
created: 2026-06-22
updated: 2026-06-22
author: ui-designer
gate: qa-agent
applies_rule: docs/Features/08-Master-Field-Registry/REGISTRY-DUP-ID-RULE.md
source: src/features/report-builder/schema/fieldRegistry.ts (canonical) — re-confirm before any fix
tags: [apr-dashboard, field-registry, duplicate-id, v4, findings]
---

# Duplicate-ID Classification — V4 report-builder registry (v2)

> Applies the [Registry Dup-ID Rule](./REGISTRY-DUP-ID-RULE.md) to all **110 duplicate ids**. **CLASSIFY-only — no fixes.** qa gates; re-confirm against live `fieldRegistry.ts` before editing.
>
> **v2 correction (per qa gate 2026-06-22):** same-section **+ same-subsection** dups = **FIX-1 REDUNDANT** (collapse to one), NOT FIX-2/FIX-3 (which are cross-section reconcile-keep-both). Re-running with that distinction.

## Summary (v2)

| Class | Count | Action |
|---|---|---|
| **KEEP** — intentional cross-section reference | 12 | leave (same id/type/options across DIFFERENT sections = shared-value wiring) |
| **FIX-1** — REDUNDANT (same section+subsection) | 46 | collapse to ONE, delete extra |
| **FIX-2** — TYPE-COLLISION (cross-section, type differs) | 23 | reconcile to one canonical type |
| **FIX-3** — DIVERGENT (cross-section, label/options drift) | 29 | reconcile to canonical label/options |

*(50+29+31 in v1 → 12+46+23+29 in v2; the 38 reclassified were same-section+subsection dups wrongly counted KEEP/FIX-2/FIX-3.)*

## ⚑ FIX-1 finding — the rent-analysis double-definition (the bulk)

**35 of the 46 FIX-1 are the `rent-analysis` section defining every `rentcomp1–5` field TWICE** — exact identical copies (same section/subsection/type/label), ~200 lines apart (verified: `rentcomp1-avg-unit-sf` @ lines 16266 + 16466). Pure redundant duplication, no reference-elsewhere justification → collapse each to one. The other ~11 FIX-1 = the qa-confirmed set (comp1–5-year-built, subject-parking-incl, sca-concluded-value-per-unit, subject-rent-sf/unit-avg) + subject-year-built/avg-unit-sf/parking-type.

> **Delta flag for qa:** consistent FIX-1 = **46, not ~9** (your ~9 was illustrative off the v1 FIX lists). The extra 35 are the rent-analysis exact-duplicate cluster. Confirm scope before any collapse.

## ⚑ SCOPE (per qa) — legacy `sales` retire is NARROW

`sales-comparison` = canonical for the colliding `comp1–5` ids (FIX-2/FIX-3). **Do NOT blanket-retire the whole legacy `sales` section (~283 fields)** — most are non-colliding and some may be unique/needed. Scope NOW = reconcile/retire ONLY the colliding comp duplicates. The rest of legacy `sales` = a SEPARATE dead-code assessment, not part of this dup pass.

## Lane split

- **qa bridge lane (S1/S2):** `interest-appraised` [loe-prep dropdown = canonical vs exec text] — qa takes it.
- **ui-designer V4-native (qa-gated per fix):** the rent-analysis FIX-1 cluster, sales↔sales-comparison FIX-2/FIX-3, subject-* same-loc FIX-1, comp photo/map + calc-output label drift.

## Full auto-classification (v2)

```
TOTAL dup-ids: 110
KEEP: 12 | FIX-1 REDUNDANT: 46 | FIX-2 TYPE-COLLISION: 23 | FIX-3 DIVERGENT: 29

FIX-1 REDUNDANT (same section+subsection -> collapse to ONE):
  subject-year-built @ exec/property-identification  [number]
  subject-avg-unit-sf @ exec/property-identification  [number]
  subject-parking-incl @ impv/amenities  [select+text]
  subject-parking-type @ impv/amenities  [dropdown]
  subject-rent-sf-avg @ calc-output/rent-analysis  [currency]
  subject-rent-unit-avg @ calc-output/rent-analysis  [currency]
  comp1-year-built @ sales-comparison/comp1  [text+number]
  comp2-year-built @ sales-comparison/comp2  [text+number]
  comp3-year-built @ sales-comparison/comp3  [text+number]
  comp4-year-built @ sales-comparison/comp4  [text+number]
  comp5-year-built @ sales-comparison/comp5  [text+number]
  rentcomp1-avg-unit-sf @ rent-analysis/rentcomp1  [number]
  rentcomp1-parking-incl @ rent-analysis/rentcomp1  [text]
  rentcomp1-parking-type @ rent-analysis/rentcomp1  [text]
  rentcomp1-proj-amenities @ rent-analysis/rentcomp1  [text]
  rentcomp1-rent-sf-avg @ rent-analysis/rentcomp1  [currency]
  rentcomp1-rent-unit-avg @ rent-analysis/rentcomp1  [currency]
  rentcomp1-unit-amenities @ rent-analysis/rentcomp1  [text]
  rentcomp2-avg-unit-sf @ rent-analysis/rentcomp2  [number]
  rentcomp2-parking-incl @ rent-analysis/rentcomp2  [text]
  rentcomp2-parking-type @ rent-analysis/rentcomp2  [text]
  rentcomp2-proj-amenities @ rent-analysis/rentcomp2  [text]
  rentcomp2-rent-sf-avg @ rent-analysis/rentcomp2  [currency]
  rentcomp2-rent-unit-avg @ rent-analysis/rentcomp2  [currency]
  rentcomp2-unit-amenities @ rent-analysis/rentcomp2  [text]
  rentcomp3-avg-unit-sf @ rent-analysis/rentcomp3  [number]
  rentcomp3-parking-incl @ rent-analysis/rentcomp3  [text]
  rentcomp3-parking-type @ rent-analysis/rentcomp3  [text]
  rentcomp3-proj-amenities @ rent-analysis/rentcomp3  [text]
  rentcomp3-rent-sf-avg @ rent-analysis/rentcomp3  [currency]
  rentcomp3-rent-unit-avg @ rent-analysis/rentcomp3  [currency]
  rentcomp3-unit-amenities @ rent-analysis/rentcomp3  [text]
  rentcomp4-avg-unit-sf @ rent-analysis/rentcomp4  [number]
  rentcomp4-parking-incl @ rent-analysis/rentcomp4  [text]
  rentcomp4-parking-type @ rent-analysis/rentcomp4  [text]
  rentcomp4-proj-amenities @ rent-analysis/rentcomp4  [text]
  rentcomp4-rent-sf-avg @ rent-analysis/rentcomp4  [currency]
  rentcomp4-rent-unit-avg @ rent-analysis/rentcomp4  [currency]
  rentcomp4-unit-amenities @ rent-analysis/rentcomp4  [text]
  rentcomp5-avg-unit-sf @ rent-analysis/rentcomp5  [number]
  rentcomp5-parking-incl @ rent-analysis/rentcomp5  [text]
  rentcomp5-parking-type @ rent-analysis/rentcomp5  [text]
  rentcomp5-proj-amenities @ rent-analysis/rentcomp5  [text]
  rentcomp5-rent-sf-avg @ rent-analysis/rentcomp5  [currency]
  rentcomp5-rent-unit-avg @ rent-analysis/rentcomp5  [currency]
  rentcomp5-unit-amenities @ rent-analysis/rentcomp5  [text]

FIX-2 TYPE-COLLISION (cross-section, different type -> reconcile):
  interest-appraised [dropdown vs text] @ loe-prep,exec
  subject-proj-amenities [text vs textarea] @ sales,impv
  subject-unit-amenities [text vs textarea] @ sales,impv
  comp1-sale-price [number vs currency] @ sales,sales-comparison
  comp1-price-per-unit [calculated vs currency] @ sales,sales-comparison
  comp1-cap-rate [number vs percentage] @ sales,sales-comparison
  comp1-parking-type [dropdown vs text] @ sales,sales-comparison
  comp2-sale-price [number vs currency] @ sales,sales-comparison
  comp2-price-per-unit [calculated vs currency] @ sales,sales-comparison
  comp2-cap-rate [number vs percentage] @ sales,sales-comparison
  comp2-parking-type [dropdown vs text] @ sales,sales-comparison
  comp3-sale-price [number vs currency] @ sales,sales-comparison
  comp3-price-per-unit [calculated vs currency] @ sales,sales-comparison
  comp3-cap-rate [number vs percentage] @ sales,sales-comparison
  comp3-parking-type [dropdown vs text] @ sales,sales-comparison
  comp4-sale-price [number vs currency] @ sales,sales-comparison
  comp4-price-per-unit [calculated vs currency] @ sales,sales-comparison
  comp4-cap-rate [number vs percentage] @ sales,sales-comparison
  comp4-parking-type [dropdown vs text] @ sales,sales-comparison
  comp5-sale-price [number vs currency] @ sales,sales-comparison
  comp5-price-per-unit [calculated vs currency] @ sales,sales-comparison
  comp5-cap-rate [number vs percentage] @ sales,sales-comparison
  comp5-parking-type [dropdown vs text] @ sales,sales-comparison

FIX-3 DIVERGENT (cross-section, label/options drift -> reconcile):
  client-organization-address @ client-intake,cover  labels: "Street Address" / "Client Address"
  appraiser1-allunits @ loe-prep,cert  labels: "Appraiser 1 All Units Inspected" / "Appraiser 1 Inspected All Units"
  appraiser2-allunits @ loe-prep,cert  labels: "Appraiser 2 All Units Inspected" / "Appraiser 2 Inspected All Units"
  comp1-photo @ image-mgt,sales-comparison  labels: "Comp 1 Photo" / "Comp1 Photo"
  comp2-photo @ image-mgt,sales-comparison  labels: "Comp 2 Photo" / "Comp2 Photo"
  comp3-photo @ image-mgt,sales-comparison  labels: "Comp 3 Photo" / "Comp3 Photo"
  comp4-photo @ image-mgt,sales-comparison  labels: "Comp 4 Photo" / "Comp4 Photo"
  comp5-photo @ image-mgt,sales-comparison  labels: "Comp 5 Photo" / "Comp5 Photo"
  comp1-map @ image-mgt,sales-comparison  labels: "Comp 1 Map" / "Comp1 Map"
  comp2-map @ image-mgt,sales-comparison  labels: "Comp 2 Map" / "Comp2 Map"
  comp3-map @ image-mgt,sales-comparison  labels: "Comp 3 Map" / "Comp3 Map"
  comp4-map @ image-mgt,sales-comparison  labels: "Comp 4 Map" / "Comp4 Map"
  comp5-map @ image-mgt,sales-comparison  labels: "Comp 5 Map" / "Comp5 Map"
  sca-concluded-value-per-unit @ sales,sales  labels: "SCA Concluded Value Per Unit" / "Concluded Value/Unit"
  comp1-sale-date @ sales,sales-comparison  labels: "Sale Date" / "Comp1 Sale Date"
  comp1-proj-amenities @ sales,sales-comparison  labels: "Project Amenities" / "Comp1 Project Amenities"
  comp1-unit-amenities @ sales,sales-comparison  labels: "Unit Amenities" / "Comp1 Unit Amenities"
  comp2-sale-date @ sales,sales-comparison  labels: "Sale Date" / "Comp2 Sale Date"
  comp2-market-conditions @ sales,sales-comparison  labels: "Market Conditions" / "Comp2 Market Conditions"
  comp2-unit-amenities @ sales,sales-comparison  labels: "Unit Amenities" / "Comp2 Unit Amenities"
  comp3-sale-date @ sales,sales-comparison  labels: "Sale Date" / "Comp3 Sale Date"
  comp3-market-conditions @ sales,sales-comparison  labels: "Market Conditions" / "Comp3 Market Conditions"
  comp3-unit-amenities @ sales,sales-comparison  labels: "Unit Amenities" / "Comp3 Unit Amenities"
  comp4-sale-date @ sales,sales-comparison  labels: "Sale Date" / "Comp4 Sale Date"
  comp4-market-conditions @ sales,sales-comparison  labels: "Market Conditions" / "Comp4 Market Conditions"
  comp4-unit-amenities @ sales,sales-comparison  labels: "Unit Amenities" / "Comp4 Unit Amenities"
  comp5-sale-date @ sales,sales-comparison  labels: "Sale Date" / "Comp5 Sale Date"
  comp5-market-conditions @ sales,sales-comparison  labels: "Market Conditions" / "Comp5 Market Conditions"
  comp5-unit-amenities @ sales,sales-comparison  labels: "Unit Amenities" / "Comp5 Unit Amenities"
```

---

*v2 2026-06-22 by ui-designer per qa gate. Regenerate: `node /tmp/dup-classify2.mjs`. qa gates any fix; 4-file-sync + re-confirm-live mandatory.*
