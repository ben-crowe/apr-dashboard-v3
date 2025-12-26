# Task: Create Cost Approach Calculator UI Panel

**Prompt Set:** Calculator Demo Valuation Approaches (2 of 4)
**Priority:** Medium - New feature build

---

## Context

The Calculator Demo v4 needs a new collapsible section for the Cost Approach, similar to SalesComparisonPanel.
This approach calculates: **Land Value + (RCN - Depreciation) + Site Improvements = Value**

## Reference Pattern

Copy the structure from `src/features/calculator-demo-v4/components/SalesComparisonPanel.tsx`:
- Collapsible section with header
- Input grid for values
- Calculated outputs displayed
- onValueChange callback to parent

---

## What to Create

### File: `src/features/calculator-demo-v4/components/CostApproachPanel.tsx`

Create a panel with 5 sections:

**Section 1: Land Valuation**
| Input | Field ID | Type |
|-------|----------|------|
| Land Area (SF) | cost-land-sf | number |
| Rate per SF | cost-land-rate-per-sf | currency |
| **Land Value** | cost-land-value | calculated |

**Section 2: Replacement Cost New (RCN)**
| Input | Field ID | Type |
|-------|----------|------|
| Building GBA | cost-rcn-gba | number |
| Cost per SF | cost-rcn-rate-per-sf | currency |
| Indirect Costs % | cost-rcn-indirect-pct | percentage |
| Entrepreneur Profit % | cost-rcn-entrepreneur-pct | percentage |
| **Total RCN** | cost-rcn-total | calculated |

**Section 3: Depreciation**
| Input | Field ID | Type |
|-------|----------|------|
| Actual Age | cost-depr-physical-age | number |
| Economic Life | cost-depr-physical-life | number |
| Effective Age | cost-depr-physical-effective-age | number |
| Functional Obsolescence | cost-depr-functional-total | currency |
| External Obsolescence | cost-depr-external-total | currency |
| **Total Depreciation** | cost-depr-total-amt | calculated |
| **Depreciation %** | cost-depr-total-pct | calculated |

**Section 4: Site Improvements**
| Input | Field ID | Type |
|-------|----------|------|
| Parking Spaces | cost-site-parking-spaces | number |
| Cost per Space | cost-site-parking-cost | currency |
| Landscaping | cost-site-landscaping | currency |
| Paving | cost-site-paving | currency |
| **Total Site** | cost-site-total | calculated |

**Section 5: Summary**
| Output | Field ID |
|--------|----------|
| Land Value | cost-land-value |
| + Depreciated RCN | cost-depreciated-value |
| + Site Improvements | cost-site-total |
| **= Indicated Value** | cost-indicated-value |

---

## Add Fields to Registry

Add ~60 fields to `src/features/report-builder/schema/fieldRegistry.ts` in a new 'cost' section:

```typescript
// COST APPROACH - Land Valuation
{ id: 'cost-land-sf', storeId: 'cost-land-sf', label: 'Land Area (SF)', section: 'cost', subsection: 'land', type: 'number', inputSource: 'user-input', required: false },
{ id: 'cost-land-rate-per-sf', storeId: 'cost-land-rate-per-sf', label: 'Rate per SF', section: 'cost', subsection: 'land', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-land-value', storeId: 'cost-land-value', label: 'Land Value', section: 'cost', subsection: 'land', type: 'currency', inputSource: 'calculated', required: false },

// COST APPROACH - RCN
{ id: 'cost-rcn-gba', storeId: 'cost-rcn-gba', label: 'Building GBA', section: 'cost', subsection: 'rcn', type: 'number', inputSource: 'user-input', required: false },
{ id: 'cost-rcn-rate-per-sf', storeId: 'cost-rcn-rate-per-sf', label: 'Cost per SF', section: 'cost', subsection: 'rcn', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-rcn-indirect-pct', storeId: 'cost-rcn-indirect-pct', label: 'Indirect Costs %', section: 'cost', subsection: 'rcn', type: 'percentage', inputSource: 'user-input', required: false },
{ id: 'cost-rcn-entrepreneur-pct', storeId: 'cost-rcn-entrepreneur-pct', label: 'Entrepreneur Profit %', section: 'cost', subsection: 'rcn', type: 'percentage', inputSource: 'user-input', required: false },
{ id: 'cost-rcn-direct-costs', storeId: 'cost-rcn-direct-costs', label: 'Direct Costs', section: 'cost', subsection: 'rcn', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-rcn-indirect-costs', storeId: 'cost-rcn-indirect-costs', label: 'Indirect Costs', section: 'cost', subsection: 'rcn', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-rcn-entrepreneur-amt', storeId: 'cost-rcn-entrepreneur-amt', label: 'Entrepreneur Amount', section: 'cost', subsection: 'rcn', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-rcn-total', storeId: 'cost-rcn-total', label: 'Total RCN', section: 'cost', subsection: 'rcn', type: 'currency', inputSource: 'calculated', required: false },

// COST APPROACH - Depreciation
{ id: 'cost-depr-physical-age', storeId: 'cost-depr-physical-age', label: 'Actual Age', section: 'cost', subsection: 'depreciation', type: 'number', inputSource: 'user-input', required: false },
{ id: 'cost-depr-physical-life', storeId: 'cost-depr-physical-life', label: 'Economic Life', section: 'cost', subsection: 'depreciation', type: 'number', inputSource: 'user-input', required: false },
{ id: 'cost-depr-physical-effective-age', storeId: 'cost-depr-physical-effective-age', label: 'Effective Age', section: 'cost', subsection: 'depreciation', type: 'number', inputSource: 'user-input', required: false },
{ id: 'cost-depr-physical-remaining-life', storeId: 'cost-depr-physical-remaining-life', label: 'Remaining Life', section: 'cost', subsection: 'depreciation', type: 'number', inputSource: 'calculated', required: false },
{ id: 'cost-depr-physical-pct', storeId: 'cost-depr-physical-pct', label: 'Physical Depr %', section: 'cost', subsection: 'depreciation', type: 'percentage', inputSource: 'calculated', required: false },
{ id: 'cost-depr-physical-amt', storeId: 'cost-depr-physical-amt', label: 'Physical Depr $', section: 'cost', subsection: 'depreciation', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-depr-functional-total', storeId: 'cost-depr-functional-total', label: 'Functional Obsolescence', section: 'cost', subsection: 'depreciation', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-depr-external-total', storeId: 'cost-depr-external-total', label: 'External Obsolescence', section: 'cost', subsection: 'depreciation', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-depr-total-amt', storeId: 'cost-depr-total-amt', label: 'Total Depreciation', section: 'cost', subsection: 'depreciation', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-depr-total-pct', storeId: 'cost-depr-total-pct', label: 'Depreciation %', section: 'cost', subsection: 'depreciation', type: 'percentage', inputSource: 'calculated', required: false },

// COST APPROACH - Site Improvements
{ id: 'cost-site-parking-spaces', storeId: 'cost-site-parking-spaces', label: 'Parking Spaces', section: 'cost', subsection: 'site', type: 'number', inputSource: 'user-input', required: false },
{ id: 'cost-site-parking-cost', storeId: 'cost-site-parking-cost', label: 'Cost per Space', section: 'cost', subsection: 'site', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-site-parking-total', storeId: 'cost-site-parking-total', label: 'Parking Total', section: 'cost', subsection: 'site', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-site-landscaping', storeId: 'cost-site-landscaping', label: 'Landscaping', section: 'cost', subsection: 'site', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-site-paving', storeId: 'cost-site-paving', label: 'Paving', section: 'cost', subsection: 'site', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-site-utilities', storeId: 'cost-site-utilities', label: 'Utilities', section: 'cost', subsection: 'site', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-site-other', storeId: 'cost-site-other', label: 'Other Site', section: 'cost', subsection: 'site', type: 'currency', inputSource: 'user-input', required: false },
{ id: 'cost-site-total', storeId: 'cost-site-total', label: 'Total Site Improvements', section: 'cost', subsection: 'site', type: 'currency', inputSource: 'calculated', required: false },

// COST APPROACH - Value Indication
{ id: 'cost-depreciated-value', storeId: 'cost-depreciated-value', label: 'Depreciated Value', section: 'cost', subsection: 'value', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-indicated-value', storeId: 'cost-indicated-value', label: 'Indicated Value', section: 'cost', subsection: 'value', type: 'currency', inputSource: 'calculated', required: false },
{ id: 'cost-approach-applied', storeId: 'cost-approach-applied', label: 'Approach Applied', section: 'cost', subsection: 'value', type: 'boolean', inputSource: 'user-input', required: false },
```

---

## Add Calc Engine (ISOLATED FILE - Protects Income & Sales Approaches)

**DO NOT add code directly to reportBuilderStore.ts.**

Create a NEW file: `src/features/report-builder/store/costApproachCalculations.ts`

**File: `src/features/report-builder/store/costApproachCalculations.ts`**

```typescript
/**
 * Cost Approach Calculations
 * ISOLATED from Income and Sales Approaches to prevent accidental damage
 *
 * Formula: Land Value + (RCN - Depreciation) + Site Improvements = Value
 */

export function runCostApproachCalculations(inputs: Record<string, any>): Record<string, number> {
  const outputs: Record<string, number> = {};

  // Land Value
  outputs['cost-land-value'] = (parseFloat(inputs['cost-land-sf']) || 0) * (parseFloat(inputs['cost-land-rate-per-sf']) || 0);

  // RCN
  outputs['cost-rcn-direct-costs'] = (parseFloat(inputs['cost-rcn-gba']) || 0) * (parseFloat(inputs['cost-rcn-rate-per-sf']) || 0);
  outputs['cost-rcn-indirect-costs'] = outputs['cost-rcn-direct-costs'] * ((parseFloat(inputs['cost-rcn-indirect-pct']) || 0) / 100);
  outputs['cost-rcn-entrepreneur-amt'] = (outputs['cost-rcn-direct-costs'] + outputs['cost-rcn-indirect-costs']) * ((parseFloat(inputs['cost-rcn-entrepreneur-pct']) || 0) / 100);
  outputs['cost-rcn-total'] = outputs['cost-rcn-direct-costs'] + outputs['cost-rcn-indirect-costs'] + outputs['cost-rcn-entrepreneur-amt'];

  // Depreciation
  const economicLife = parseFloat(inputs['cost-depr-physical-life']) || 50;
  const effectiveAge = parseFloat(inputs['cost-depr-physical-effective-age']) || 0;

  outputs['cost-depr-physical-remaining-life'] = economicLife - effectiveAge;
  outputs['cost-depr-physical-pct'] = economicLife > 0 ? (effectiveAge / economicLife) * 100 : 0;
  outputs['cost-depr-physical-amt'] = outputs['cost-rcn-total'] * (outputs['cost-depr-physical-pct'] / 100);

  const functionalObs = parseFloat(inputs['cost-depr-functional-total']) || 0;
  const externalObs = parseFloat(inputs['cost-depr-external-total']) || 0;

  outputs['cost-depr-total-amt'] = outputs['cost-depr-physical-amt'] + functionalObs + externalObs;
  outputs['cost-depr-total-pct'] = outputs['cost-rcn-total'] > 0 ? (outputs['cost-depr-total-amt'] / outputs['cost-rcn-total']) * 100 : 0;

  // Site Improvements
  outputs['cost-site-parking-total'] = (parseFloat(inputs['cost-site-parking-spaces']) || 0) * (parseFloat(inputs['cost-site-parking-cost']) || 0);
  outputs['cost-site-total'] = outputs['cost-site-parking-total'] +
    (parseFloat(inputs['cost-site-landscaping']) || 0) +
    (parseFloat(inputs['cost-site-paving']) || 0) +
    (parseFloat(inputs['cost-site-utilities']) || 0) +
    (parseFloat(inputs['cost-site-other']) || 0);

  // Final Value
  outputs['cost-depreciated-value'] = outputs['cost-rcn-total'] - outputs['cost-depr-total-amt'];
  outputs['cost-indicated-value'] = outputs['cost-land-value'] + outputs['cost-depreciated-value'] + outputs['cost-site-total'];

  return outputs;
}
```

### Store Integration (MINIMAL CHANGE to reportBuilderStore.ts)

In `src/features/report-builder/store/reportBuilderStore.ts`:

1. Add import at top:
```typescript
import { runCostApproachCalculations } from './costApproachCalculations';
```

2. Inside `runCalculations()`, after Sales Comp integration, add:
```typescript
// === COST APPROACH ===
// Isolated in separate file to protect Income and Sales Approaches
const costOutputs = runCostApproachCalculations(get().fields);
Object.entries(costOutputs).forEach(([key, value]) => updateField(key, value));
```

**IMPORTANT:** Do NOT modify any existing Income or Sales Approach code.

---

## Wire to CalculatorDemoPage

Add new collapsible section after Sales Comparison in `CalculatorDemoPage.tsx`.

## Props Interface

```typescript
interface CostApproachPanelProps {
  onValueChange?: (value: number) => void;
}
```

---

## Validation

Calculations should update in real-time.

**Test scenario (new construction):**
- Land: 24,400 SF × $15/SF = **$366,000**
- RCN: 10,204 SF × $175/SF + 10% indirect + 10% profit = **$2,160,697**
- Depreciation: 4% (2-year effective age / 50-year life) = **$86,428**
- Site: 30 spaces × $1,500 + $30,000 other = **$75,000**
- **Total: ~$2,515,269**

---

## Test Data to Add

Add to `northBattlefordTestData.ts`:

```typescript
// COST APPROACH TEST DATA
'cost-land-sf': 24400,
'cost-land-rate-per-sf': 15,
'cost-rcn-gba': 10204,
'cost-rcn-rate-per-sf': 175,
'cost-rcn-indirect-pct': 10,
'cost-rcn-entrepreneur-pct': 10,
'cost-depr-physical-age': 2,
'cost-depr-physical-life': 50,
'cost-depr-physical-effective-age': 2,
'cost-depr-functional-total': 0,
'cost-depr-external-total': 0,
'cost-site-parking-spaces': 30,
'cost-site-parking-cost': 1500,
'cost-site-landscaping': 15000,
'cost-site-paving': 10000,
'cost-site-utilities': 5000,
'cost-site-other': 0,
'cost-approach-applied': false,  // Not applied for North Battleford (older property)
```

---

*Generated: December 26, 2025*
