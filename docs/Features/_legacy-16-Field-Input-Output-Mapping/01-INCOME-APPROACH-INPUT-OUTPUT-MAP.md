# Income Approach: INPUT → OUTPUT Mapping

**Section**: Income Approach (Direct Capitalization)
**Report Pages**: Pages 36-40 (approx)
**Status**: ✅ CalcInputPanel built, need verification
**Last Updated**: 2026-01-09

---

## INPUT FIELDS (User Entry)

### Section 1: Unit Mix (×4 types)

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `calc-type1-name` | Type 1: Name | text | CalcInputPanel → Unit Mix | ✅ | Yes |
| `calc-type1-count` | Type 1: Count | number | CalcInputPanel → Unit Mix | ✅ | Yes |
| `calc-type1-sf` | Type 1: Avg SF | number | CalcInputPanel → Unit Mix | ✅ | Yes |
| `calc-type1-rent` | Type 1: Market Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | Yes |
| `calc-type1-contract-rent` | Type 1: Contract Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type2-name` | Type 2: Name | text | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type2-count` | Type 2: Count | number | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type2-sf` | Type 2: Avg SF | number | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type2-rent` | Type 2: Market Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type2-contract-rent` | Type 2: Contract Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type3-name` | Type 3: Name | text | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type3-count` | Type 3: Count | number | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type3-sf` | Type 3: Avg SF | number | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type3-rent` | Type 3: Market Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type3-contract-rent` | Type 3: Contract Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type4-name` | Type 4: Name | text | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type4-count` | Type 4: Count | number | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type4-sf` | Type 4: Avg SF | number | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type4-rent` | Type 4: Market Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | No |
| `calc-type4-contract-rent` | Type 4: Contract Rent/Mo | currency | CalcInputPanel → Unit Mix | ✅ | No |

**Example Filled Input**:
```
Type 1: "1 Bed / 1 Bath" | Count: 8 | Avg SF: 650 | Market: $1,200 | Contract: $1,150
Type 2: "2 Bed / 1 Bath" | Count: 6 | Avg SF: 850 | Market: $1,450 | Contract: $1,450
Type 3: "3 Bed / 2 Bath" | Count: 2 | Avg SF: 1100 | Market: $1,800 | Contract: $1,750
Type 4: "" | Count: 0 | Avg SF: 0 | Market: $0 | Contract: $0
```

---

### Section 2: Other Income

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `calc-parking-per-unit` | Parking $/Unit/Mo | currency | CalcInputPanel → Other Income | ✅ | No |
| `calc-laundry-per-unit` | Laundry $/Unit/Mo | currency | CalcInputPanel → Other Income | ✅ | No |
| `calc-other-income` | Other Income (Annual) | currency | CalcInputPanel → Other Income | ✅ | No |

**Example Filled Input**:
```
Parking: $50/unit/mo | Laundry: $25/unit/mo | Other: $2,000/yr
```

---

### Section 3: Vacancy & Loss

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `calc-vacancy-rate` | Vacancy Rate (%) | percentage | CalcInputPanel → Vacancy & Loss | ✅ | Yes |
| `calc-bad-debt-rate` | Bad Debt Rate (%) | percentage | CalcInputPanel → Vacancy & Loss | ✅ | No |
| `calc-concessions-rate` | Concessions Rate (%) | percentage | CalcInputPanel → Vacancy & Loss | ✅ | No |

**Example Filled Input**:
```
Vacancy: 5.0% | Bad Debt: 1.0% | Concessions: 0.5%
```

---

### Section 4: Operating Expenses

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `calc-exp-taxes-annual` | Taxes (Annual) | currency | CalcInputPanel → Operating Expenses | ✅ | Yes |
| `calc-exp-insurance-annual` | Insurance (Annual) | currency | CalcInputPanel → Operating Expenses | ✅ | Yes |
| `calc-exp-repairs-annual` | Repairs & Maint (Annual) | currency | CalcInputPanel → Operating Expenses | ✅ | Yes |
| `calc-exp-payroll-annual` | Payroll (Annual) | currency | CalcInputPanel → Operating Expenses | ✅ | No |
| `calc-exp-utilities-annual` | Utilities (Annual) | currency | CalcInputPanel → Operating Expenses | ✅ | Yes |
| `calc-exp-management-annual` | Management (Annual) | currency | CalcInputPanel → Operating Expenses | ✅ | Yes |
| `calc-exp-other-annual` | Other Expenses (Annual) | currency | CalcInputPanel → Operating Expenses | ✅ | No |

**Example Filled Input**:
```
Taxes: $19,688 | Insurance: $8,500 | Repairs: $12,000 | Payroll: $15,000 |
Utilities: $9,600 | Management: $11,700 | Other: $3,500
```

---

### Section 5: Cap Rate

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `calc-cap-rate` | Cap Rate (%) | percentage | CalcInputPanel → Cap Rate | ✅ | Yes |
| `cap-rate-range-low` | Range Low (%) | percentage | CalcInputPanel → Cap Rate | ✅ | No |
| `cap-rate-range-high` | Range High (%) | percentage | CalcInputPanel → Cap Rate | ✅ | No |

**Example Filled Input**:
```
Cap Rate: 5.50% | Range Low: 5.00% | Range High: 6.00%
```

---

### Section 6: Adjustments

| Field ID | Label | Type | Tab Location | Registry | Required |
|----------|-------|------|--------------|----------|----------|
| `calc-adj-capex` | CapEx Adjustment | currency | CalcInputPanel → Adjustments | ✅ | No |
| `calc-adj-leasing` | Leasing Costs | currency | CalcInputPanel → Adjustments | ✅ | No |
| `calc-adj-other` | Other Adjustments | currency | CalcInputPanel → Adjustments | ✅ | No |

**Example Filled Input**:
```
CapEx: -$5,000 | Leasing: -$3,000 | Other: $0
```

---

## OUTPUT FIELDS (Calculated Results)

These are **calculated** by the calc engine from the inputs above, then displayed in `IncomeApproachPanel` tables and exported to report template.

### Output Table 1: Unit Mix Summary

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `calc-total-units` | Page 36 | SUM(type1-count, type2-count, type3-count, type4-count) | `calc-type1-count`, `calc-type2-count`, `calc-type3-count`, `calc-type4-count` |
| `calc-total-sf` | Page 36 | SUM(type1-count × type1-sf, type2-count × type2-sf, ...) | All `calc-typeN-count`, `calc-typeN-sf` |
| `calc-type1-annual` | Page 36 | type1-count × type1-rent × 12 | `calc-type1-count`, `calc-type1-rent` |
| `calc-type2-annual` | Page 36 | type2-count × type2-rent × 12 | `calc-type2-count`, `calc-type2-rent` |
| `calc-type3-annual` | Page 36 | type3-count × type3-rent × 12 | `calc-type3-count`, `calc-type3-rent` |
| `calc-type4-annual` | Page 36 | type4-count × type4-rent × 12 | `calc-type4-count`, `calc-type4-rent` |
| `calc-type1-cont-v-market` | Page 36 | (type1-contract-rent / type1-rent) × 100 | `calc-type1-contract-rent`, `calc-type1-rent` |
| `calc-type1-per-unit` | Page 36 | type1-rent × 12 | `calc-type1-rent` |
| `calc-type1-per-sf` | Page 36 | (type1-rent × 12) / type1-sf | `calc-type1-rent`, `calc-type1-sf` |

**Example Output**:
```
Total Units: 16
Total SF: 12,700
Type 1 Annual: $115,200 (8 units × $1,200/mo × 12)
Type 2 Annual: $104,400 (6 units × $1,450/mo × 12)
Type 3 Annual: $43,200 (2 units × $1,800/mo × 12)
Type 1 Cont v Market: 95.8% ($1,150 / $1,200)
```

---

### Output Table 2: Revenue Summary

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `calc-total-rental-revenue` | Page 36 | SUM(type1-annual, type2-annual, type3-annual, type4-annual) | All `calc-typeN-annual` (calculated) |
| `calc-rental-revenue-per-unit` | Page 36 | calc-total-rental-revenue / calc-total-units | `calc-total-rental-revenue`, `calc-total-units` |
| `calc-parking-income` | Page 37 | calc-parking-per-unit × calc-total-units × 12 | `calc-parking-per-unit`, `calc-total-units` |
| `calc-laundry-income` | Page 37 | calc-laundry-per-unit × calc-total-units × 12 | `calc-laundry-per-unit`, `calc-total-units` |
| `calc-total-other-revenue` | Page 37 | parking-income + laundry-income + other-income | `calc-parking-income`, `calc-laundry-income`, `calc-other-income` |
| `calc-other-revenue-per-unit` | Page 37 | calc-total-other-revenue / calc-total-units | `calc-total-other-revenue`, `calc-total-units` |
| `calc-pgr` | Page 37 | calc-total-rental-revenue + calc-total-other-revenue | `calc-total-rental-revenue`, `calc-total-other-revenue` |
| `calc-pgr-per-unit` | Page 37 | calc-pgr / calc-total-units | `calc-pgr`, `calc-total-units` |

**Example Output**:
```
Total Rental Revenue: $262,800
Rental Revenue/Unit: $16,425
Parking Income: $9,600 (16 units × $50/mo × 12)
Laundry Income: $4,800 (16 units × $25/mo × 12)
Other Income: $2,000
Total Other Revenue: $16,400
PGR (Potential Gross Revenue): $279,200
PGR/Unit: $17,450
```

---

### Output Table 3: Vacancy & EGR

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `calc-vacancy-loss` | Page 37 | calc-pgr × (calc-vacancy-rate + calc-bad-debt-rate + calc-concessions-rate) / 100 | `calc-pgr`, `calc-vacancy-rate`, `calc-bad-debt-rate`, `calc-concessions-rate` |
| `calc-vacancy-per-unit` | Page 37 | calc-vacancy-loss / calc-total-units | `calc-vacancy-loss`, `calc-total-units` |
| `calc-egr` | Page 37 | calc-pgr - calc-vacancy-loss | `calc-pgr`, `calc-vacancy-loss` |
| `calc-egr-per-unit` | Page 37 | calc-egr / calc-total-units | `calc-egr`, `calc-total-units` |
| `calc-egr-per-sf` | Page 37 | calc-egr / calc-total-sf | `calc-egr`, `calc-total-sf` |

**Example Output**:
```
Vacancy Loss: -$18,148 (6.5% × $279,200)
Vacancy Loss/Unit: -$1,134
EGR (Effective Gross Revenue): $261,052
EGR/Unit: $16,316
EGR/SF: $20.56
```

---

### Output Table 4: Operating Expenses

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `calc-exp-taxes-per-unit` | Page 38 | calc-exp-taxes-annual / calc-total-units | `calc-exp-taxes-annual`, `calc-total-units` |
| `calc-exp-insurance-per-unit` | Page 38 | calc-exp-insurance-annual / calc-total-units | `calc-exp-insurance-annual`, `calc-total-units` |
| `calc-exp-repairs-per-unit` | Page 38 | calc-exp-repairs-annual / calc-total-units | `calc-exp-repairs-annual`, `calc-total-units` |
| `calc-exp-payroll-per-unit` | Page 38 | calc-exp-payroll-annual / calc-total-units | `calc-exp-payroll-annual`, `calc-total-units` |
| `calc-exp-utilities-per-unit` | Page 38 | calc-exp-utilities-annual / calc-total-units | `calc-exp-utilities-annual`, `calc-total-units` |
| `calc-exp-management-per-unit` | Page 38 | calc-exp-management-annual / calc-total-units | `calc-exp-management-annual`, `calc-total-units` |
| `calc-exp-other-per-unit` | Page 38 | calc-exp-other-annual / calc-total-units | `calc-exp-other-annual`, `calc-total-units` |
| `calc-total-expenses` | Page 38 | SUM(all calc-exp-*-annual) | All `calc-exp-*-annual` inputs |
| `calc-total-expenses-per-unit` | Page 38 | calc-total-expenses / calc-total-units | `calc-total-expenses`, `calc-total-units` |

**Example Output**:
```
Taxes: $19,688 ($1,231/unit)
Insurance: $8,500 ($531/unit)
Repairs: $12,000 ($750/unit)
Payroll: $15,000 ($938/unit)
Utilities: $9,600 ($600/unit)
Management: $11,700 ($731/unit)
Other: $3,500 ($219/unit)
───────────────────────
Total Expenses: $79,988 ($4,999/unit)
```

---

### Output Table 5: NOI & Value Indication

| Output Field ID | Report Page | Calculation | Depends On Inputs |
|----------------|-------------|-------------|-------------------|
| `calc-noi` | Page 39 | calc-egr - calc-total-expenses | `calc-egr`, `calc-total-expenses` |
| `calc-noi-per-unit` | Page 39 | calc-noi / calc-total-units | `calc-noi`, `calc-total-units` |
| `calc-noi-per-sf` | Page 39 | calc-noi / calc-total-sf | `calc-noi`, `calc-total-sf` |
| `calc-raw-value` | Page 40 | calc-noi / (calc-cap-rate / 100) | `calc-noi`, `calc-cap-rate` |
| `calc-adj-total` | Page 40 | calc-adj-capex + calc-adj-leasing + calc-adj-other | `calc-adj-capex`, `calc-adj-leasing`, `calc-adj-other` |
| `calc-indicated-value` | Page 40 | calc-raw-value + calc-adj-total | `calc-raw-value`, `calc-adj-total` |
| `calc-indicated-value-per-unit` | Page 40 | calc-indicated-value / calc-total-units | `calc-indicated-value`, `calc-total-units` |
| `calc-value-range-low` | Page 40 | calc-noi / (cap-rate-range-high / 100) | `calc-noi`, `cap-rate-range-high` |
| `calc-value-range-high` | Page 40 | calc-noi / (cap-rate-range-low / 100) | `calc-noi`, `cap-rate-range-low` |

**Example Output**:
```
NOI (Net Operating Income): $181,064 ($11,317/unit, $14.25/SF)
Cap Rate: 5.50%
Raw Value: $3,292,073 (NOI / Cap Rate)
Adjustments: -$8,000 (CapEx + Leasing)
───────────────────────
Indicated Value: $3,284,000 ($205,250/unit)
Value Range: $3,021,280 to $3,621,280 (at 5.0%-6.0% cap)
```

---

## VERIFICATION CHECKLIST

### Input Verification
- [x] All input fields exist in fieldRegistry.ts (1,643 fields)
- [x] All input fields rendered in CalcInputPanel.tsx
- [x] Input fields wired to `updateFieldValue()` + `runCalculations()`
- [ ] **VERIFY**: Test data saves to store correctly
- [ ] **VERIFY**: Calculations trigger after input change

### Output Verification
- [x] All calculated fields exist in fieldRegistry.ts as `inputSource: "calculated"`
- [x] All calculated fields rendered in IncomeApproachPanel.tsx
- [x] All calculated fields have `{{field-id}}` placeholders in Report-MF-template.html
- [ ] **VERIFY**: Calculation formulas match expected logic
- [ ] **VERIFY**: Template placeholders populate from calculated values
- [ ] **VERIFY**: PDF export shows correct calculated results

### Flow Verification
- [ ] **VERIFY**: User enters inputs → Store updates → Calc engine runs → Outputs update → Template shows results
- [ ] **VERIFY**: No orphaned inputs (inputs that don't feed any output)
- [ ] **VERIFY**: No orphaned outputs (outputs missing required inputs)

---

## ISSUES IDENTIFIED

### Missing Inputs (Still Need UI)
- None identified for Income Approach ✅

### Potential Calculation Issues
1. **Contract vs Market Rent**: Check if `calc-typeN-contract-rent` is used in revenue calcs or only for ratio display
2. **Bad Debt & Concessions**: Verify these rates are additive with vacancy rate
3. **Expense Reserves**: Check if reserves fields exist but not in CalcInputPanel
4. **Cap Rate Range Logic**: Verify LOW cap rate = HIGH value (inverse relationship)

### Template Mapping Gaps
- [ ] **TODO**: Verify all `calc-*` fields in template have corresponding calculated fields in registry
- [ ] **TODO**: Check for duplicate field IDs in template (known issue: 121 duplicates pending cleanup)

---

## NEXT STEPS

1. **Run Test**: Fill all CalcInputPanel inputs with sample data, verify outputs populate correctly
2. **Export Test**: Generate PDF, verify all `{{calc-*}}` placeholders show calculated values (not literal text)
3. **Create Similar Docs**: Replicate this INPUT → OUTPUT format for:
   - Sales Comparison Approach
   - Cost Approach
   - Reconciliation
   - Other report sections with calculations

---

**Document Status**: ✅ First draft complete
**Ready for**: Testing & verification by agent or user
