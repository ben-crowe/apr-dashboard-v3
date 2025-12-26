# Cost Approach Engine - Handoff Document

**Date:** December 26, 2025
**Status:** NOT BUILT - Required for complete valuation toolkit
**Priority:** After Sales Comparison Approach
**Complexity:** MEDIUM (~100 fields, straightforward calculations)

---

## Executive Summary

The Cost Approach is one of the **three core valuation methods** required for a complete appraisal system. Even when not applied to a specific property (like the North Battleford multi-family), the system should:

1. Have the Cost Approach fully built and functional
2. Allow appraisers to toggle its inclusion/exclusion per report
3. Document when it IS and IS NOT applicable
4. Show the approach in the calculator demo for training/reference

---

## When to Use Cost Approach

### Highly Applicable
- **New construction** (minimal depreciation)
- **Special-purpose properties** (churches, schools, unique buildings)
- **Insurance valuations** (replacement cost focus)
- **Properties with limited sales data**
- **Proposed construction** (prospective value)
- **Renovation/conversion analysis**

### Limited Applicability (May Exclude)
- **Older income properties** (depreciation hard to estimate) ← North Battleford
- **Investment properties** (investors focus on income)
- **Properties with significant functional obsolescence**
- **Markets with abundant comparable sales**

### Template Language (When Excluded)
> "The Cost Approach has limited applicability due to the age of the improvements and lack of market-based data to support an estimate of accrued depreciation. The exclusion of the Cost Approach does not diminish the credibility of the value conclusion."

---

## Cost Approach Formula

```
Indicated Value = Land Value + Replacement Cost New - Total Depreciation

Where:
  Replacement Cost New = Direct Costs + Indirect Costs + Entrepreneurial Profit
  Total Depreciation = Physical + Functional + External Obsolescence
```

---

## Field Requirements

### Land Valuation (~20 fields)
| Field ID | Description | Type |
|----------|-------------|------|
| `cost-land-value` | Concluded land value | calculated |
| `cost-land-sf` | Land area (SF) | input |
| `cost-land-rate-per-sf` | $/SF rate | input |
| `cost-land-comp1-address` | Land comp 1 address | input |
| `cost-land-comp1-price` | Land comp 1 sale price | input |
| `cost-land-comp1-sf` | Land comp 1 size | input |
| `cost-land-comp1-rate` | Land comp 1 $/SF | calculated |
| `cost-land-comp2-*` | Land comp 2 fields | ... |
| `cost-land-comp3-*` | Land comp 3 fields | ... |
| `cost-land-method` | Valuation method used | input |
| `cost-land-comments` | Appraiser notes | input |

### Replacement Cost New (~30 fields)
| Field ID | Description | Type |
|----------|-------------|------|
| `cost-rcn-gba` | Gross building area | input |
| `cost-rcn-rate-per-sf` | Cost per SF (Marshall & Swift) | input |
| `cost-rcn-direct-costs` | Direct construction costs | calculated |
| `cost-rcn-indirect-pct` | Indirect costs (% of direct) | input |
| `cost-rcn-indirect-costs` | Indirect costs amount | calculated |
| `cost-rcn-entrepreneur-pct` | Entrepreneurial profit % | input |
| `cost-rcn-entrepreneur-amt` | Entrepreneurial profit amount | calculated |
| `cost-rcn-total` | Total RCN | calculated |
| `cost-rcn-source` | Cost data source | input |
| `cost-rcn-quality-class` | Building quality class | input |
| `cost-rcn-construction-type` | Construction type | input |

### Site Improvements (~15 fields)
| Field ID | Description | Type |
|----------|-------------|------|
| `cost-site-parking-spaces` | Number of parking spaces | input |
| `cost-site-parking-cost` | Parking cost per space | input |
| `cost-site-parking-total` | Total parking cost | calculated |
| `cost-site-landscaping` | Landscaping cost | input |
| `cost-site-paving` | Paving/roads cost | input |
| `cost-site-utilities` | Site utilities cost | input |
| `cost-site-other` | Other site improvements | input |
| `cost-site-total` | Total site improvements | calculated |

### Depreciation (~25 fields)
| Field ID | Description | Type |
|----------|-------------|------|
| **Physical Depreciation** | | |
| `cost-depr-physical-age` | Actual age (years) | input |
| `cost-depr-physical-life` | Economic life (years) | input |
| `cost-depr-physical-effective-age` | Effective age | input |
| `cost-depr-physical-remaining-life` | Remaining economic life | calculated |
| `cost-depr-physical-pct` | Physical depreciation % | calculated |
| `cost-depr-physical-amt` | Physical depreciation $ | calculated |
| **Functional Obsolescence** | | |
| `cost-depr-functional-superadequacy` | Superadequacy amount | input |
| `cost-depr-functional-deficiency` | Deficiency amount | input |
| `cost-depr-functional-total` | Total functional obsolescence | calculated |
| **External Obsolescence** | | |
| `cost-depr-external-market` | Market conditions impact | input |
| `cost-depr-external-location` | Location-based obsolescence | input |
| `cost-depr-external-total` | Total external obsolescence | calculated |
| **Summary** | | |
| `cost-depr-total-pct` | Total depreciation % | calculated |
| `cost-depr-total-amt` | Total depreciation $ | calculated |

### Value Indication (~10 fields)
| Field ID | Description | Type |
|----------|-------------|------|
| `cost-depreciated-value` | RCN - Depreciation | calculated |
| `cost-plus-site` | Depreciated value + site improvements | calculated |
| `cost-indicated-value` | Final Cost Approach value | calculated |
| `cost-indicated-per-unit` | Value per unit | calculated |
| `cost-indicated-per-sf` | Value per SF | calculated |
| `cost-approach-applied` | Whether approach is used (boolean) | input |
| `cost-approach-weight` | Weight in reconciliation (%) | input |
| `cost-approach-comments` | Appraiser commentary | input |

**Total: ~100 fields**

---

## Calculations

### Land Value
```typescript
'cost-land-value' = 'cost-land-sf' × 'cost-land-rate-per-sf'
// Or derived from land comp analysis
```

### Replacement Cost New
```typescript
'cost-rcn-direct-costs' = 'cost-rcn-gba' × 'cost-rcn-rate-per-sf'
'cost-rcn-indirect-costs' = 'cost-rcn-direct-costs' × ('cost-rcn-indirect-pct' / 100)
'cost-rcn-entrepreneur-amt' = ('cost-rcn-direct-costs' + 'cost-rcn-indirect-costs') × ('cost-rcn-entrepreneur-pct' / 100)
'cost-rcn-total' = 'cost-rcn-direct-costs' + 'cost-rcn-indirect-costs' + 'cost-rcn-entrepreneur-amt'
```

### Site Improvements
```typescript
'cost-site-parking-total' = 'cost-site-parking-spaces' × 'cost-site-parking-cost'
'cost-site-total' = 'cost-site-parking-total' + 'cost-site-landscaping' + 'cost-site-paving' + 'cost-site-utilities' + 'cost-site-other'
```

### Depreciation (Age/Life Method)
```typescript
'cost-depr-physical-remaining-life' = 'cost-depr-physical-life' - 'cost-depr-physical-effective-age'
'cost-depr-physical-pct' = 'cost-depr-physical-effective-age' / 'cost-depr-physical-life' × 100
'cost-depr-physical-amt' = 'cost-rcn-total' × ('cost-depr-physical-pct' / 100)

'cost-depr-functional-total' = 'cost-depr-functional-superadequacy' + 'cost-depr-functional-deficiency'
'cost-depr-external-total' = 'cost-depr-external-market' + 'cost-depr-external-location'

'cost-depr-total-amt' = 'cost-depr-physical-amt' + 'cost-depr-functional-total' + 'cost-depr-external-total'
'cost-depr-total-pct' = 'cost-depr-total-amt' / 'cost-rcn-total' × 100
```

### Final Value
```typescript
'cost-depreciated-value' = 'cost-rcn-total' - 'cost-depr-total-amt'
'cost-plus-site' = 'cost-depreciated-value' + 'cost-site-total'
'cost-indicated-value' = 'cost-land-value' + 'cost-plus-site'
'cost-indicated-per-unit' = 'cost-indicated-value' / totalUnits
'cost-indicated-per-sf' = 'cost-indicated-value' / totalGBA
```

---

## Calculator Demo Integration

### New Panel: CostApproachPanel.tsx

Similar structure to Income and Sales panels:
- Land value section with comp inputs
- Replacement cost inputs ($/SF, quality class)
- Depreciation calculator (age/life method)
- Site improvements section
- Value indication summary

### Toggle for Applicability
```typescript
// In calculator or report settings
const [costApproachApplied, setCostApproachApplied] = useState(false);

// When disabled, show explanation
{!costApproachApplied && (
  <div className="text-muted">
    Cost Approach not applied. Reason: [dropdown or text input]
  </div>
)}
```

---

## Report Tables

### Pages (when applied)
| Page | Content |
|------|---------|
| 63 | Cost Approach introduction & methodology |
| 64 | Land valuation (comps or allocation) |
| 65 | Replacement cost analysis |
| 66 | Depreciation schedule |
| 67 | Site improvements |
| 68 | Cost approach value conclusion |

### When NOT Applied
Single paragraph explaining exclusion (current template behavior).

---

## Test Data

For testing, use a **hypothetical new construction** scenario:

```typescript
// COST APPROACH TEST DATA - New Construction Scenario
'cost-approach-applied': true,

// Land
'cost-land-sf': 24400,
'cost-land-rate-per-sf': 15,
'cost-land-value': 366000,

// RCN
'cost-rcn-gba': 10204,
'cost-rcn-rate-per-sf': 175,
'cost-rcn-direct-costs': 1785700,
'cost-rcn-indirect-pct': 10,
'cost-rcn-indirect-costs': 178570,
'cost-rcn-entrepreneur-pct': 10,
'cost-rcn-entrepreneur-amt': 196427,
'cost-rcn-total': 2160697,

// Depreciation (new = minimal)
'cost-depr-physical-age': 2,
'cost-depr-physical-life': 50,
'cost-depr-physical-effective-age': 2,
'cost-depr-physical-pct': 4,
'cost-depr-physical-amt': 86428,
'cost-depr-functional-total': 0,
'cost-depr-external-total': 0,
'cost-depr-total-amt': 86428,

// Site
'cost-site-total': 75000,

// Final
'cost-depreciated-value': 2074269,
'cost-plus-site': 2149269,
'cost-indicated-value': 2515269,  // Land + Depreciated + Site
'cost-indicated-per-unit': 125763,
```

---

## Implementation Steps

### Step 1: Add Cost Approach Fields to Registry
Add ~100 fields to `fieldRegistry.ts` with proper sections:
- `cost-land` section
- `cost-rcn` section
- `cost-depreciation` section
- `cost-site` section
- `cost-summary` section

### Step 2: Create Calc Engine Function
Add `runCostApproachCalculations()` to `reportBuilderStore.ts`

### Step 3: Create CostApproachPanel.tsx
New component for Calculator Demo v4 with:
- Collapsible sections for each component
- Toggle for "Apply Cost Approach"
- Clear labeling of calculated vs. input fields

### Step 4: Add Cost Approach Report Table
Template-matched HTML for report output

### Step 5: Update Reconciliation
Include Cost Approach value (when applied) in weighted reconciliation

---

## Files to Create/Modify

**New Files:**
- `src/features/report-builder/tables/cost-table.ts` - Table definition
- `src/features/calculator-demo-v4/components/CostApproachPanel.tsx` - Calculator UI
- `src/features/calculator-demo-v4/components/tables/CostReportTable.tsx` - Report table

**Modify:**
- `src/features/report-builder/registry/fieldRegistry.ts` - Add ~100 cost fields
- `src/features/report-builder/data/northBattlefordTestData.ts` - Add test scenario
- `src/features/report-builder/store/reportBuilderStore.ts` - Add `runCostApproachCalculations()`
- `src/features/calculator-demo-v4/components/SalesComparisonSection.tsx` - Add Cost section
- `src/features/calculator-demo-v4/components/ReconciliationPanel.tsx` - Include Cost weight

---

## Validation Criteria

1. Land value calculates from inputs or comps
2. RCN calculates correctly (direct + indirect + profit)
3. Depreciation uses age/life method accurately
4. Site improvements sum correctly
5. Final indicated value = Land + Depreciated RCN + Site
6. Toggle enables/disables approach in report
7. When disabled, shows appropriate exclusion language
8. Report table matches professional format

---

## Dependencies

Before starting:
- ✅ Income Approach complete
- ⚠️ Sales Comparison in progress
- ✅ Field registry structure established
- ✅ Calculator Demo v4 pattern established

---

*This approach ensures the valuation toolkit is complete, even when specific reports exclude it.*
