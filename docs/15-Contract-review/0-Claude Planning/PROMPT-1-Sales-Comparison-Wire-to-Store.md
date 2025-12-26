# Task: Wire SalesComparisonPanel to Store & Add Calc Engine

**Prompt Set:** Calculator Demo Valuation Approaches (1 of 4)
**Priority:** Highest - UI already exists, needs wiring

---

## Context

The Calculator Demo v4 has a working SalesComparisonPanel.tsx that uses LOCAL STATE (React useState).
It needs to be connected to the Zustand store so calculations persist and sync with the report builder.

## Current State

- File: `src/features/calculator-demo-v4/components/SalesComparisonPanel.tsx`
- Uses useState for comps array and adjustments array (lines 64-78)
- Already imports getFieldValue from store (line 99 gets subject units)
- Has local calculation functions (calcPerUnit, calcPerSF, calcNetAdjustment, calcAdjustedPerUnit)

---

## What Needs to Be Done

### Step 1: Add 40 Adjustment Fields to Registry

Add to `src/features/report-builder/schema/fieldRegistry.ts` (after line ~987 in sale-comp-1 section):

For each comp (1-5), add these 8 adjustment fields:
- `compN-adj-property-rights` - percentage, user-input
- `compN-adj-financing` - percentage, user-input
- `compN-adj-sale-conditions` - percentage, user-input
- `compN-adj-market-conditions` - percentage, user-input
- `compN-adj-location` - percentage, user-input
- `compN-adj-size` - percentage, user-input
- `compN-adj-age-condition` - percentage, user-input
- `compN-adj-other` - percentage, user-input

**Pattern:**
```typescript
{ id: 'comp1-adj-property-rights', storeId: 'comp1-adj-property-rights', label: 'Property Rights Adj %', section: 'sales', subsection: 'sale-comp-1', type: 'percentage', inputSource: 'user-input', required: false },
```

### Step 2: Add Test Data Values

Add to `src/features/report-builder/data/northBattlefordTestData.ts`:

**EXISTING DATA (DO NOT MODIFY)** - These already exist with correct values from the reference report:

| Comp | Name | Sale Price | Units | GBA | Year |
|------|------|------------|-------|-----|------|
| 1 | Heritage House | $3,117,383 | 24 | 22,754 | 2000 |
| 2 | College View Apartments | $4,590,858 | 45 | 33,509 | 2000 |
| 3 | Woodland Estates | $2,055,056 | 24 | 15,000 | 1980 |
| 4 | Parkside Flats 1 | $9,310,000 | 47 | 47,916 | 2016 |
| 5 | Parkside Flats 2 | $13,720,000 | 64 | 52,708 | 2019 |

**ADD ONLY** the 40 adjustment fields (8 per comp × 5 comps), all defaulting to 0:

```typescript
// SALES COMP ADJUSTMENT DEFAULTS
'comp1-adj-property-rights': 0,
'comp1-adj-financing': 0,
'comp1-adj-sale-conditions': 0,
'comp1-adj-market-conditions': 0,
'comp1-adj-location': 0,
'comp1-adj-size': 0,
'comp1-adj-age-condition': 0,
'comp1-adj-other': 0,
// Repeat for comp2 through comp5...
```

### Step 3: Create Separate Calculation File (CRITICAL - Protects Income Approach)

**DO NOT modify the main calc engine in reportBuilderStore.ts directly.**

Create a NEW file: `src/features/report-builder/store/salesCompCalculations.ts`

This isolation protects the validated Income Approach calculations ($1,790,000) from accidental damage.

**File: `src/features/report-builder/store/salesCompCalculations.ts`**

```typescript
/**
 * Sales Comparison Approach Calculations
 * ISOLATED from Income Approach to prevent accidental damage
 *
 * Pure function: takes inputs, returns calculated outputs
 */

export function runSalesCompCalculations(inputs: Record<string, any>): Record<string, number> {
  const outputs: Record<string, number> = {};

  for (let i = 1; i <= 5; i++) {
    const prefix = `comp${i}`;
    const salePrice = parseFloat(inputs[`${prefix}-sale-price`]) || 0;
    const units = parseFloat(inputs[`${prefix}-units`]) || 0;
    const gba = parseFloat(inputs[`${prefix}-gba`]) || 0;

    // Basic per-unit/per-sf
    outputs[`${prefix}-price-per-unit`] = units > 0 ? salePrice / units : 0;
    outputs[`${prefix}-price-per-sf`] = gba > 0 ? salePrice / gba : 0;

    // Sum transactional adjustments
    const transAdj = ['property-rights', 'financing', 'sale-conditions', 'market-conditions']
      .reduce((sum, adj) => sum + (parseFloat(inputs[`${prefix}-adj-${adj}`]) || 0), 0);

    // Sum physical adjustments
    const physAdj = ['location', 'size', 'age-condition', 'other']
      .reduce((sum, adj) => sum + (parseFloat(inputs[`${prefix}-adj-${adj}`]) || 0), 0);

    outputs[`${prefix}-total-trans-adj`] = transAdj;
    outputs[`${prefix}-total-phys-adj`] = physAdj;
    outputs[`${prefix}-net-adj`] = transAdj + physAdj;
    outputs[`${prefix}-gross-adj`] = Math.abs(transAdj) + Math.abs(physAdj);

    // Adjusted price per unit
    const pricePerUnit = outputs[`${prefix}-price-per-unit`];
    outputs[`${prefix}-adj-price-per-unit`] = pricePerUnit * (1 + (transAdj + physAdj) / 100);
  }

  // Calculate indicated value from average of adjusted prices
  const validComps = [1,2,3,4,5].filter(i =>
    (parseFloat(inputs[`comp${i}-sale-price`]) || 0) > 0
  );

  if (validComps.length > 0) {
    const avgAdjPrice = validComps.reduce((sum, i) =>
      sum + outputs[`comp${i}-adj-price-per-unit`], 0
    ) / validComps.length;

    const subjectUnits = parseFloat(inputs['calc-total-units']) || parseFloat(inputs['property-total-units']) || 0;
    outputs['sales-indicated-value'] = avgAdjPrice * subjectUnits;
  }

  return outputs;
}
```

### Step 3b: Import and Call from Store (MINIMAL CHANGE ONLY)

In `src/features/report-builder/store/reportBuilderStore.ts`:

1. Add import at top of file:
```typescript
import { runSalesCompCalculations } from './salesCompCalculations';
```

2. Inside `runCalculations()`, after Income Approach calculations complete, add ONE LINE:
```typescript
// === SALES COMPARISON APPROACH ===
// Isolated in separate file to protect Income Approach
const salesCompOutputs = runSalesCompCalculations(get().fields);
Object.entries(salesCompOutputs).forEach(([key, value]) => updateField(key, value));
```

**IMPORTANT:** Do NOT modify any existing Income Approach code. Only ADD the import and the 3-line integration block.

### Step 4: Modify SalesComparisonPanel to Use Store

Replace local useState with store reads/writes:
- Import setFieldValue from useReportBuilderStore
- Replace comps array with store field reads
- Replace setComps with setFieldValue calls
- Keep the UI structure the same

---

## Files to Create/Modify

### NEW FILE (Create):
1. `src/features/report-builder/store/salesCompCalculations.ts` - **NEW** isolated calc engine

### MODIFY (Existing):
2. `src/features/report-builder/schema/fieldRegistry.ts` - Add 40 adjustment fields
3. `src/features/report-builder/data/northBattlefordTestData.ts` - Add adjustment defaults
4. `src/features/report-builder/store/reportBuilderStore.ts` - **MINIMAL CHANGE**: Add import + 3-line call only
5. `src/features/calculator-demo-v4/components/SalesComparisonPanel.tsx` - Wire to store

### PROTECTED (Do NOT Modify):
- All existing Income Approach calculations in reportBuilderStore.ts
- The validated $1,790,000 output must remain unchanged

---

## Validation

- Panel should load existing comp data from store
- Changing an adjustment should trigger recalculation
- Indicated value should update in ReconciliationPanel
- Test with North Battleford data: comp1 at $3,117,383, 24 units = $129,891/unit base

---

## 4-File Sync Reminder

After adding fields, ensure sync across:
1. fieldRegistry.ts - Field definitions
2. northBattlefordTestData.ts - Test values
3. Report-MF-template.html - Template placeholders (if displayed in report)
4. IMAGE-FIELD-MAPPING.json - Image paths (not applicable here)

---

*Generated: December 26, 2025*
