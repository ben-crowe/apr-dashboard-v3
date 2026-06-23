---
content_type: proposal
title: FIX-3 Label/Options Divergence — proposal + scope/convention questions
created: 2026-06-22
author: ui-designer
gate: qa-agent
applies_rule: docs/Features/08-Master-Field-Registry/REGISTRY-DUP-ID-RULE.md
tags: [apr-dashboard, field-registry, duplicate-id, fix-3, proposal]
---

# FIX-3 — Label/Options Divergence (proposal, no edits yet)

> 49 dup-ids with same type but drifted label/options. Grew from 29→49 because FIX-2 reconciled the sales↔sales-comparison comp TYPES, leaving their LABELS as FIX-3. **3 = qa bridge lane, 46 = ui-designer V4-native.** Two decisions needed before I execute — classify-only so far.

## Lane split
- **qa bridge (3):** client-organization-address (client-intake "Street Address" vs cover "Client Address" — bridge wins), appraiser1-allunits, appraiser2-allunits (loe-prep vs cert). → qa handles/routes.
- **ui-designer V4-native (46):** below.

## The 46 V4-native split into TWO clusters

### Cluster A — BOTH-LIVE (genuine reconcile, both sections active) — 10
`comp1-5-photo` + `comp1-5-map`: image-mgt "Comp 1 Photo" (spaced) vs sales-comparison "Comp1 Photo" (no space). Both sections are live/canonical → must reconcile to ONE label.

### Cluster B — LEGACY-INVOLVED (the legacy `sales` section) — 36
The legacy `sales` section uses BARE labels ("Sale Price", "Sale Date", "Project Amenities", "Cap Rate (%)") vs `sales-comparison`'s canonical "Comp{N} ..." prefixed labels. `sca-concluded-value-per-unit` is sales↔sales (within legacy). Since legacy `sales` is the eventual RETIRE target (per FIX-2 scope ruling), relabeling it may be wasted churn.

## ⛔ DECISIONS NEEDED (won't guess)

**(1) Label convention for Cluster A (both-live comp photo/map):** spaced "Comp 1 Photo" (readable, user-facing in the image gallery) vs sales-comparison's "Comp1 Photo" (canonical-section).
  - **My rec:** spaced "Comp {N} Photo/Map" — it's user-facing; change sales-comparison no-space → spaced.

**(2) Scope for Cluster B (legacy `sales` labels):** reconcile-now to canonical sales-comparison labels, OR DEFER to the legacy-sales dead-code/retire assessment (don't relabel code that's headed for deletion)?
  - **My rec:** DEFER — fold Cluster B into the legacy-sales retire pass, don't churn 36 labels on a section slated for removal. Execute only Cluster A now.

## Full detail
```
FIX-3 total: 49 | MINE(V4-native): 46 | QA(bridge): 3

=== QA BRIDGE LANE (3) ===
  client-organization-address
      client-intake: "Street Address"
      cover: "Client Address"
  appraiser1-allunits
      loe-prep: "Appraiser 1 All Units Inspected"
      cert: "Appraiser 1 Inspected All Units"
  appraiser2-allunits
      loe-prep: "Appraiser 2 All Units Inspected"
      cert: "Appraiser 2 Inspected All Units"

=== MINE V4-NATIVE (46) ===
  comp1-photo [label-only]
      image-mgt: "Comp 1 Photo"
      sales-comparison: "Comp1 Photo"
  comp2-photo [label-only]
      image-mgt: "Comp 2 Photo"
      sales-comparison: "Comp2 Photo"
  comp3-photo [label-only]
      image-mgt: "Comp 3 Photo"
      sales-comparison: "Comp3 Photo"
  comp4-photo [label-only]
      image-mgt: "Comp 4 Photo"
      sales-comparison: "Comp4 Photo"
  comp5-photo [label-only]
      image-mgt: "Comp 5 Photo"
      sales-comparison: "Comp5 Photo"
  comp1-map [label-only]
      image-mgt: "Comp 1 Map"
      sales-comparison: "Comp1 Map"
  comp2-map [label-only]
      image-mgt: "Comp 2 Map"
      sales-comparison: "Comp2 Map"
  comp3-map [label-only]
      image-mgt: "Comp 3 Map"
      sales-comparison: "Comp3 Map"
  comp4-map [label-only]
      image-mgt: "Comp 4 Map"
      sales-comparison: "Comp4 Map"
  comp5-map [label-only]
      image-mgt: "Comp 5 Map"
      sales-comparison: "Comp5 Map"
  sca-concluded-value-per-unit [label-only]
      sales: "SCA Concluded Value Per Unit"
      sales: "Concluded Value/Unit"
  comp1-sale-date [label-only]
      sales: "Sale Date"
      sales-comparison: "Comp1 Sale Date"
  comp1-sale-price [label-only]
      sales: "Sale Price"
      sales-comparison: "Comp1 Sale Price"
  comp1-price-per-unit [label-only]
      sales: "Price/Unit"
      sales-comparison: "Comp1 Price Per Unit"
  comp1-cap-rate [label-only]
      sales: "Cap Rate (%)"
      sales-comparison: "Comp1 Cap Rate"
  comp1-parking-type [label-only]
      sales: "Parking Type" opts["Surface","Underground","Structured","Street"]
      sales-comparison: "Comp1 Parking Type" opts["Surface","Underground","Structured","Street"]
  comp1-proj-amenities [label-only]
      sales: "Project Amenities"
      sales-comparison: "Comp1 Project Amenities"
  comp1-unit-amenities [label-only]
      sales: "Unit Amenities"
      sales-comparison: "Comp1 Unit Amenities"
  comp2-sale-date [label-only]
      sales: "Sale Date"
      sales-comparison: "Comp2 Sale Date"
  comp2-sale-price [label-only]
      sales: "Sale Price"
      sales-comparison: "Comp2 Sale Price"
  comp2-price-per-unit [label-only]
      sales: "Price/Unit"
      sales-comparison: "Comp2 Price Per Unit"
  comp2-cap-rate [label-only]
      sales: "Cap Rate (%)"
      sales-comparison: "Comp2 Cap Rate"
  comp2-market-conditions [label-only]
      sales: "Market Conditions"
      sales-comparison: "Comp2 Market Conditions"
  comp2-parking-type [label-only]
      sales: "Parking Type" opts["Surface","Underground","Structured","Street"]
      sales-comparison: "Comp2 Parking Type" opts["Surface","Underground","Structured","Street"]
  comp2-unit-amenities [label-only]
      sales: "Unit Amenities"
      sales-comparison: "Comp2 Unit Amenities"
  comp3-sale-date [label-only]
      sales: "Sale Date"
      sales-comparison: "Comp3 Sale Date"
  comp3-sale-price [label-only]
      sales: "Sale Price"
      sales-comparison: "Comp3 Sale Price"
  comp3-price-per-unit [label-only]
      sales: "Price/Unit"
      sales-comparison: "Comp3 Price Per Unit"
  comp3-cap-rate [label-only]
      sales: "Cap Rate (%)"
      sales-comparison: "Comp3 Cap Rate"
  comp3-market-conditions [label-only]
      sales: "Market Conditions"
      sales-comparison: "Comp3 Market Conditions"
  comp3-parking-type [label-only]
      sales: "Parking Type" opts["Surface","Underground","Structured","Street"]
      sales-comparison: "Comp3 Parking Type" opts["Surface","Underground","Structured","Street"]
  comp3-unit-amenities [label-only]
      sales: "Unit Amenities"
      sales-comparison: "Comp3 Unit Amenities"
  comp4-sale-date [label-only]
      sales: "Sale Date"
      sales-comparison: "Comp4 Sale Date"
  comp4-sale-price [label-only]
      sales: "Sale Price"
      sales-comparison: "Comp4 Sale Price"
  comp4-price-per-unit [label-only]
      sales: "Price/Unit"
      sales-comparison: "Comp4 Price Per Unit"
  comp4-cap-rate [label-only]
      sales: "Cap Rate (%)"
      sales-comparison: "Comp4 Cap Rate"
  comp4-market-conditions [label-only]
      sales: "Market Conditions"
      sales-comparison: "Comp4 Market Conditions"
  comp4-parking-type [label-only]
      sales: "Parking Type" opts["Surface","Underground","Structured","Street"]
      sales-comparison: "Comp4 Parking Type" opts["Surface","Underground","Structured","Street"]
  comp4-unit-amenities [label-only]
      sales: "Unit Amenities"
      sales-comparison: "Comp4 Unit Amenities"
  comp5-sale-date [label-only]
      sales: "Sale Date"
      sales-comparison: "Comp5 Sale Date"
  comp5-sale-price [label-only]
      sales: "Sale Price"
      sales-comparison: "Comp5 Sale Price"
  comp5-price-per-unit [label-only]
      sales: "Price/Unit"
      sales-comparison: "Comp5 Price Per Unit"
  comp5-cap-rate [label-only]
      sales: "Cap Rate (%)"
      sales-comparison: "Comp5 Cap Rate"
  comp5-market-conditions [label-only]
      sales: "Market Conditions"
      sales-comparison: "Comp5 Market Conditions"
  comp5-parking-type [label-only]
      sales: "Parking Type" opts["Surface","Underground","Structured","Street"]
      sales-comparison: "Comp5 Parking Type" opts["Surface","Underground","Structured","Street"]
  comp5-unit-amenities [label-only]
      sales: "Unit Amenities"
      sales-comparison: "Comp5 Unit Amenities"
```
