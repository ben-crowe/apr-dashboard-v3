# Cost Approach: INPUT → OUTPUT Mapping

**Section**: Cost Approach (Replacement Cost Less Depreciation)
**Report Pages**: Pages 46-50 (approx)
**Status**: ✅ CostApproachPanel built, need verification
**Last Updated**: 2026-01-09

---

## INPUT FIELDS (User Entry)

### Section 1: Land Valuation

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `cost-land-sf` | Land Area (SF) | number | CostTabPanel → Land Valuation | ✅ | Yes |
| `cost-land-rate-per-sf` | Land Rate per SF | currency | CostTabPanel → Land Valuation | ✅ | Yes |

**Example Filled Input**:
```
Land Area: 15,000 SF
Land Rate/SF: $25.00
```

---

### Section 2: Replacement Cost New (RCN)

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `cost-rcn-gba` | RCN: GBA (SF) | number | CostTabPanel → Replacement Cost New | ✅ | Yes |
| `cost-rcn-rate-per-sf` | RCN: Cost per SF | currency | CostTabPanel → Replacement Cost New | ✅ | Yes |
| `cost-rcn-indirect-pct` | RCN: Indirect Costs (%) | percentage | CostTabPanel → Replacement Cost New | ✅ | No |
| `cost-rcn-entrepreneur-pct` | RCN: Entrepreneur Profit (%) | percentage | CostTabPanel → Replacement Cost New | ✅ | No |

**Example Filled Input**:
```
GBA: 12,700 SF
Cost/SF: $150.00
Indirect Costs: 15%
Entrepreneur Profit: 10%
```

---

### Section 3: Depreciation

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `cost-depr-physical-age` | Physical: Actual Age (years) | number | CostTabPanel → Depreciation | ✅ | No |
| `cost-depr-physical-life` | Physical: Economic Life (years) | number | CostTabPanel → Depreciation | ✅ | Yes |
| `cost-depr-physical-effective-age` | Physical: Effective Age (years) | number | CostTabPanel → Depreciation | ✅ | Yes |
| `cost-depr-functional-total` | Functional Obsolescence ($) | currency | CostTabPanel → Depreciation | ✅ | No |
| `cost-depr-external-total` | External Obsolescence ($) | currency | CostTabPanel → Depreciation | ✅ | No |

**Example Filled Input**:
```
Actual Age: 35 years
Economic Life: 50 years
Effective Age: 38 years
Functional Obsolescence: $25,000
External Obsolescence: $0
```

---

### Section 4: Site Improvements

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `cost-site-parking-spaces` | Parking: Number of Spaces | number | CostTabPanel → Site Improvements | ✅ | No |
| `cost-site-parking-cost` | Parking: Cost per Space | currency | CostTabPanel → Site Improvements | ✅ | No |
| `cost-site-landscaping` | Landscaping ($) | currency | CostTabPanel → Site Improvements | ✅ | No |
| `cost-site-paving` | Paving ($) | currency | CostTabPanel → Site Improvements | ✅ | No |
| `cost-site-utilities` | Utilities ($) | currency | CostTabPanel → Site Improvements | ✅ | No |
| `cost-site-other` | Other Site Improvements ($) | currency | CostTabPanel → Site Improvements | ✅ | No |

**Example Filled Input**:
```
Parking Spaces: 20
Parking Cost/Space: $2,500
Landscaping: $15,000
Paving: $12,000
Utilities: $8,000
Other: $5,000
```

---

## OUTPUT FIELDS (Calculated Results)

These are **calculated** by `runCostApproachCalculations()` from the inputs above, then displayed in `CostApproachPanel` tables and exported to report template.

### Output Table 1: Land Valuation

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `cost-land-value` | Page 46 | cost-land-sf × cost-land-rate-per-sf | `cost-land-sf`, `cost-land-rate-per-sf` |

**Example Output**:
```
Land Value: $375,000 (15,000 SF × $25.00/SF)
```

---

### Output Table 2: Replacement Cost New (RCN)

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `cost-rcn-direct-costs` | Page 47 | cost-rcn-gba × cost-rcn-rate-per-sf | `cost-rcn-gba`, `cost-rcn-rate-per-sf` |
| `cost-rcn-indirect-costs` | Page 47 | cost-rcn-direct-costs × (cost-rcn-indirect-pct / 100) | `cost-rcn-direct-costs`, `cost-rcn-indirect-pct` |
| `cost-rcn-entrepreneur-amt` | Page 47 | (cost-rcn-direct-costs + cost-rcn-indirect-costs) × (cost-rcn-entrepreneur-pct / 100) | `cost-rcn-direct-costs`, `cost-rcn-indirect-costs`, `cost-rcn-entrepreneur-pct` |
| `cost-rcn-total` | Page 47 | cost-rcn-direct-costs + cost-rcn-indirect-costs + cost-rcn-entrepreneur-amt | `cost-rcn-direct-costs`, `cost-rcn-indirect-costs`, `cost-rcn-entrepreneur-amt` |

**Calculation Logic**:
1. Direct Costs = GBA × Cost per SF
2. Indirect Costs = Direct Costs × Indirect %
3. Entrepreneur Amount = (Direct + Indirect) × Entrepreneur %
4. Total RCN = Direct + Indirect + Entrepreneur

**Example Output** (using example inputs above):
```
Direct Costs: $1,905,000 (12,700 SF × $150.00/SF)
Indirect Costs: $285,750 ($1,905,000 × 15%)
Entrepreneur Amount: $219,075 (($1,905,000 + $285,750) × 10%)
───────────────────────
Total RCN: $2,409,825
```

---

### Output Table 3: Depreciation

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `cost-depr-physical-remaining-life` | Page 48 | cost-depr-physical-life - cost-depr-physical-effective-age | `cost-depr-physical-life`, `cost-depr-physical-effective-age` |
| `cost-depr-physical-pct` | Page 48 | (cost-depr-physical-effective-age / cost-depr-physical-life) × 100 | `cost-depr-physical-effective-age`, `cost-depr-physical-life` |
| `cost-depr-physical-amt` | Page 48 | cost-rcn-total × (cost-depr-physical-pct / 100) | `cost-rcn-total`, `cost-depr-physical-pct` |
| `cost-depr-total-amt` | Page 48 | cost-depr-physical-amt + cost-depr-functional-total + cost-depr-external-total | `cost-depr-physical-amt`, `cost-depr-functional-total`, `cost-depr-external-total` |
| `cost-depr-total-pct` | Page 48 | (cost-depr-total-amt / cost-rcn-total) × 100 | `cost-depr-total-amt`, `cost-rcn-total` |

**Calculation Logic**:
1. Remaining Life = Economic Life - Effective Age
2. Physical Depreciation % = (Effective Age / Economic Life) × 100
3. Physical Depreciation $ = RCN Total × Physical %
4. Total Depreciation = Physical + Functional + External
5. Total Depreciation % = (Total Depreciation / RCN Total) × 100

**Example Output** (using example inputs above):
```
Remaining Life: 12 years (50 - 38)
Physical Depreciation %: 76.00% (38 / 50 × 100)
Physical Depreciation $: $1,831,467 ($2,409,825 × 76%)
Functional Obsolescence: $25,000
External Obsolescence: $0
───────────────────────
Total Depreciation: $1,856,467
Total Depreciation %: 77.04% ($1,856,467 / $2,409,825 × 100)
```

---

### Output Table 4: Site Improvements

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `cost-site-parking-total` | Page 49 | cost-site-parking-spaces × cost-site-parking-cost | `cost-site-parking-spaces`, `cost-site-parking-cost` |
| `cost-site-total` | Page 49 | cost-site-parking-total + cost-site-landscaping + cost-site-paving + cost-site-utilities + cost-site-other | `cost-site-parking-total`, `cost-site-landscaping`, `cost-site-paving`, `cost-site-utilities`, `cost-site-other` |

**Example Output** (using example inputs above):
```
Parking Total: $50,000 (20 spaces × $2,500/space)
Landscaping: $15,000
Paving: $12,000
Utilities: $8,000
Other: $5,000
───────────────────────
Total Site Improvements: $90,000
```

---

### Output Table 5: Value Indication

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `cost-depreciated-value` | Page 50 | cost-rcn-total - cost-depr-total-amt | `cost-rcn-total`, `cost-depr-total-amt` |
| `cost-indicated-value` | Page 50 | cost-land-value + cost-depreciated-value + cost-site-total | `cost-land-value`, `cost-depreciated-value`, `cost-site-total` |

**Calculation Logic**:
1. Depreciated Value = RCN Total - Total Depreciation
2. Indicated Value = Land Value + Depreciated Value + Site Improvements

**Example Output** (using all example values above):
```
Land Value: $375,000
RCN Total: $2,409,825
Total Depreciation: $1,856,467
───────────────────────
Depreciated Value: $553,358 ($2,409,825 - $1,856,467)
Site Improvements: $90,000
───────────────────────
Indicated Value: $1,018,358 ($375,000 + $553,358 + $90,000)
```

---

## DEPENDENCIES MAPPED

### Input Dependencies

**Land Valuation**:
- Requires both `cost-land-sf` and `cost-land-rate-per-sf` to calculate land value
- No dependencies on other sections

**Replacement Cost New (RCN)**:
- Requires `cost-rcn-gba` and `cost-rcn-rate-per-sf` (minimum for direct costs)
- Optional: `cost-rcn-indirect-pct` and `cost-rcn-entrepreneur-pct` (default to 0%)
- No dependencies on other sections

**Depreciation**:
- Requires `cost-depr-physical-life` and `cost-depr-physical-effective-age` (minimum for physical depreciation)
- Optional: `cost-depr-physical-age` (for reference, not used in calculations)
- Optional: `cost-depr-functional-total` and `cost-depr-external-total` (default to $0)
- **Depends on RCN**: Physical depreciation amount calculated from `cost-rcn-total`

**Site Improvements**:
- All fields optional (default to 0)
- No dependencies on other sections

### Output Dependencies

**Land Valuation**:
- `cost-land-value` ← `cost-land-sf`, `cost-land-rate-per-sf`

**RCN Calculations** (sequential):
- `cost-rcn-direct-costs` ← `cost-rcn-gba`, `cost-rcn-rate-per-sf`
- `cost-rcn-indirect-costs` ← `cost-rcn-direct-costs`, `cost-rcn-indirect-pct`
- `cost-rcn-entrepreneur-amt` ← `cost-rcn-direct-costs`, `cost-rcn-indirect-costs`, `cost-rcn-entrepreneur-pct`
- `cost-rcn-total` ← `cost-rcn-direct-costs`, `cost-rcn-indirect-costs`, `cost-rcn-entrepreneur-amt`

**Depreciation Calculations** (sequential):
- `cost-depr-physical-remaining-life` ← `cost-depr-physical-life`, `cost-depr-physical-effective-age`
- `cost-depr-physical-pct` ← `cost-depr-physical-effective-age`, `cost-depr-physical-life`
- `cost-depr-physical-amt` ← `cost-rcn-total`, `cost-depr-physical-pct`
- `cost-depr-total-amt` ← `cost-depr-physical-amt`, `cost-depr-functional-total`, `cost-depr-external-total`
- `cost-depr-total-pct` ← `cost-depr-total-amt`, `cost-rcn-total`

**Site Improvements**:
- `cost-site-parking-total` ← `cost-site-parking-spaces`, `cost-site-parking-cost`
- `cost-site-total` ← `cost-site-parking-total`, `cost-site-landscaping`, `cost-site-paving`, `cost-site-utilities`, `cost-site-other`

**Final Value Indication**:
- `cost-depreciated-value` ← `cost-rcn-total`, `cost-depr-total-amt`
- `cost-indicated-value` ← `cost-land-value`, `cost-depreciated-value`, `cost-site-total`

### Cross-Section Dependencies

**Cost Approach is Independent**:
- No dependencies on Income Approach or Sales Comparison Approach
- All calculations are self-contained within Cost Approach inputs
- Can be completed independently of other valuation approaches

---

## EXAMPLE VALUES (Complete Flow)

### Input Values

**Land Valuation**:
```
Land Area: 15,000 SF
Land Rate/SF: $25.00
```

**Replacement Cost New (RCN)**:
```
GBA: 12,700 SF
Cost/SF: $150.00
Indirect Costs: 15%
Entrepreneur Profit: 10%
```

**Depreciation**:
```
Actual Age: 35 years
Economic Life: 50 years
Effective Age: 38 years
Functional Obsolescence: $25,000
External Obsolescence: $0
```

**Site Improvements**:
```
Parking Spaces: 20
Parking Cost/Space: $2,500
Landscaping: $15,000
Paving: $12,000
Utilities: $8,000
Other: $5,000
```

### Calculated Outputs

**Land Valuation**:
```
Land Value: $375,000
```

**Replacement Cost New**:
```
Direct Costs: $1,905,000
Indirect Costs: $285,750
Entrepreneur Amount: $219,075
───────────────────────
Total RCN: $2,409,825
```

**Depreciation**:
```
Remaining Life: 12 years
Physical Depreciation %: 76.00%
Physical Depreciation $: $1,831,467
Functional Obsolescence: $25,000
External Obsolescence: $0
───────────────────────
Total Depreciation: $1,856,467 (77.04%)
```

**Site Improvements**:
```
Parking Total: $50,000
Landscaping: $15,000
Paving: $12,000
Utilities: $8,000
Other: $5,000
───────────────────────
Total Site Improvements: $90,000
```

**Value Indication**:
```
Land Value: $375,000
+ Depreciated RCN: $553,358 ($2,409,825 - $1,856,467)
+ Site Improvements: $90,000
───────────────────────
Indicated Value: $1,018,358
```

---

## VERIFICATION CHECKLIST

### Input Verification
- [x] All input fields exist in fieldRegistry.ts (1,643 fields)
- [x] All input fields rendered in CostApproachPanel.tsx
- [x] Input fields wired to `updateFieldValue()` + `runCalculations()`
- [ ] **VERIFY**: Test data saves to store correctly
- [ ] **VERIFY**: Calculations trigger after input change
- [ ] **VERIFY**: Default values handle empty inputs correctly (0 for numbers, 0% for percentages)

### Output Verification
- [x] All calculated fields exist in fieldRegistry.ts as `inputSource: "calculated"`
- [x] All calculated fields rendered in CostApproachPanel.tsx
- [x] Calculation logic implemented in `costApproachCalculations.ts`
- [ ] **VERIFY**: Calculation formulas match expected logic
- [ ] **VERIFY**: Template placeholders populate from calculated values
- [ ] **VERIFY**: PDF export shows correct calculated results
- [ ] **VERIFY**: RCN calculations handle zero percentages correctly
- [ ] **VERIFY**: Depreciation calculations handle zero values correctly
- [ ] **VERIFY**: Site improvements sum correctly

### Flow Verification
- [ ] **VERIFY**: User enters inputs → Store updates → Calc engine runs → Outputs update → Template shows results
- [ ] **VERIFY**: No orphaned inputs (inputs that don't feed any output)
- [ ] **VERIFY**: No orphaned outputs (outputs missing required inputs)
- [ ] **VERIFY**: Sequential calculations work correctly (RCN → Depreciation → Value)
- [ ] **VERIFY**: Division by zero protection (economic life = 0, RCN total = 0)

### Calculation Logic Verification
- [ ] **VERIFY**: Land value = SF × Rate/SF
- [ ] **VERIFY**: Direct costs = GBA × Cost/SF
- [ ] **VERIFY**: Indirect costs = Direct × Indirect %
- [ ] **VERIFY**: Entrepreneur amount = (Direct + Indirect) × Entrepreneur %
- [ ] **VERIFY**: RCN Total = Direct + Indirect + Entrepreneur
- [ ] **VERIFY**: Remaining life = Economic Life - Effective Age
- [ ] **VERIFY**: Physical depreciation % = (Effective Age / Economic Life) × 100
- [ ] **VERIFY**: Physical depreciation $ = RCN Total × Physical %
- [ ] **VERIFY**: Total depreciation = Physical + Functional + External
- [ ] **VERIFY**: Total depreciation % = (Total Depreciation / RCN Total) × 100
- [ ] **VERIFY**: Parking total = Spaces × Cost/Space
- [ ] **VERIFY**: Site total = Parking + Landscaping + Paving + Utilities + Other
- [ ] **VERIFY**: Depreciated value = RCN Total - Total Depreciation
- [ ] **VERIFY**: Indicated value = Land + Depreciated + Site Improvements

---

## ISSUES IDENTIFIED

### Missing Inputs (Still Need UI)
- None identified for Cost Approach ✅

### Potential Calculation Issues
1. **Physical Age Field**: `cost-depr-physical-age` is captured but not used in calculations. Only `cost-depr-physical-effective-age` is used. Verify if this is intentional (actual age vs effective age).
2. **Zero Economic Life**: If `cost-depr-physical-life` = 0, physical depreciation % calculation will divide by zero. Current code defaults to 50 years if not provided, but should verify edge case handling.
3. **Zero RCN Total**: If RCN Total = 0, depreciation percentage calculations will divide by zero. Verify protection exists.
4. **Negative Depreciation**: Functional and external obsolescence can be negative (representing appreciation). Verify if this is allowed and handled correctly.
5. **Effective Age > Economic Life**: If effective age exceeds economic life, remaining life becomes negative and depreciation % exceeds 100%. Verify if this edge case is handled or prevented.

### Template Mapping Gaps
- [ ] **TODO**: Verify all `cost-*` fields in template have corresponding calculated fields in registry
- [ ] **TODO**: Verify `cost-indicated-value` placeholder exists in template
- [ ] **TODO**: Check for duplicate field IDs in template (known issue: 121 duplicates pending cleanup)

---

## FIELD COUNT SUMMARY

### Input Fields
- **Land Valuation**: 2 fields
- **Replacement Cost New**: 4 fields
- **Depreciation**: 5 fields
- **Site Improvements**: 6 fields
- **Total Input Fields**: 17 fields

### Output Fields
- **Land Valuation**: 1 field
- **Replacement Cost New**: 4 fields
- **Depreciation**: 5 fields
- **Site Improvements**: 2 fields
- **Value Indication**: 2 fields
- **Total Output Fields**: 14 fields

### Grand Total
- **Total Fields**: 31 fields (17 inputs + 14 outputs)

---

## NEXT STEPS

1. **Run Test**: Fill all CostTabPanel inputs with sample data, verify outputs populate correctly
2. **Export Test**: Generate PDF, verify all `{{cost-*}}` placeholders show calculated values (not literal text)
3. **Edge Case Test**: Test with zero values, negative values, and extreme values (effective age > economic life)
4. **Create Similar Docs**: Replicate this INPUT → OUTPUT format for:
   - Reconciliation
   - Other report sections with calculations

---

**Document Status**: ✅ First draft complete
**Ready for**: Testing & verification by agent or user
