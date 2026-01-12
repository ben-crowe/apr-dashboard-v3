# Task: Clean Up Calculator Demo - Remove Hardcoded Sample Data

**Prompt Set:** Calculator Demo Valuation Approaches (FIX)
**Priority:** HIGH - Cleans up confusing UX

---

## Problem Statement

The Calculator Demo has multiple "Load Sample Data" buttons with HARDCODED values in individual panels. This is confusing because:
- Top button loads real test data from store
- Panel buttons load fake hardcoded data
- Users don't know which is which

---

## What to Remove

### 1. SalesComparisonPanel.tsx

**DELETE the hardcoded sample data and button:**

- Delete the `loadSampleData()` function (lines ~147-187) with hardcoded "Riverside Apts", "Oak Manor" etc.
- Delete the Data Controls section with the "Load Sample Comps" button (lines ~202-215)

### 2. CostApproachPanel.tsx

**DELETE the hardcoded sample data and button:**

- Delete the `loadSampleData()` function (lines ~95-113) with hardcoded cost values
- Delete the Data Controls section with the "Load Sample Data" button (lines ~129-142)

---

## What Remains

After cleanup:
- ONE button at top: "Load Example Property" (in InputPanel.tsx)
- That button loads from `loadFullTestData()` in store
- Calc engine computes ALL calculated fields
- No per-panel sample data buttons

---

## Example Property Reference Files

**ALREADY CREATED** in `/docs/calculator-demo/example-properties/`:

### north-battleford-16unit.md
Three-section reference document:
1. **INPUTS** - What human values get loaded
2. **EXPECTED OUTPUTS** - What source report shows (for comparison)
3. **VALIDATION REPORT** - Fill in after testing to record discrepancies

### north-battleford-16unit.json
Machine-readable version the app can load from directly.

### README.md
Instructions for adding new example properties.

---

## Future Enhancement: Example Property Selector

Eventually the app could have a dropdown to select from multiple example properties:

```
[ Select Example Property ▼ ]
  - North Battleford 16-Unit
  - Saskatoon 24-Unit (future)
  - Regina Office Building (future)
```

Each loads from its JSON file in `/docs/calculator-demo/example-properties/`.

This way:
- No need to add to registry for each example
- Simple JSON files anyone can create
- Clear separation: inputs (JSON) vs outputs (calc engine)

---

## Implementation Steps

1. **SalesComparisonPanel.tsx** - Delete loadSampleData function and button
2. **CostApproachPanel.tsx** - Delete loadSampleData function and button
3. **(Optional)** Rename button from "Load North Battleford Test Data" to "Load Example Property"

---

## Key Principle

**The calc engine does ALL the math.**

- Human provides inputs (property, comps, expenses)
- Calc engine computes outputs (PGR, NOI, $/Unit, Indicated Values)
- Reference docs are for VISUAL COMPARISON only
- No hardcoded expected values in the app

---

*Generated: December 26, 2025*
