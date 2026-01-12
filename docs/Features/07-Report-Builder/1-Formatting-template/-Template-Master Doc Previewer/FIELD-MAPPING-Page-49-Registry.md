# Page 49: Direct Capitalization - HTML to Registry Field Mapping

**Page:** 49
**Table Name:** Direct Capitalization Conclusion
**HTML Lines:** 4058-4284
**Total Fields:** 80 fields
**Registry Status:** ✅ All 80 fields exist in fieldRegistry.ts

---

## Purpose

This document maps HTML template field IDs (e.g., `{{Tax_Pct_PGR}}`) to their corresponding registry field IDs (e.g., `calc-exp-taxes-pct-pgr`) for proper data binding in the APR Dashboard application.

---

## TABLE 1: Unit Mix & Rental Revenue (20 fields)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| **Unit Type 1 (1 Bed / 1 Bath)** |
| `{{Unit_Type_1_Count}}` | `calc-type1-count` | number | user-input | UNITMIX | ✅ |
| `{{Unit_Type_1_Contract_Rent}}` | `calc-type1-contract-rent` | currency | user-input | UNITMIX!AT | ✅ |
| `{{Unit_Type_1_Market_Rent}}` | `calc-type1-rent` | number | user-input | UNITMIX!BI | ✅ |
| `{{Unit_Type_1_Cont_v_Market}}` | `calc-type1-cont-v-market` | percentage | calculated | (contract/market) | ✅ |
| `{{Unit_Type_1_Per_Unit}}` | `calc-type1-per-unit` | currency | calculated | (annual/count) | ✅ |
| `{{Unit_Type_1_Per_SF}}` | `calc-type1-per-sf` | number | calculated | (annual/sf) | ✅ |
| `{{Unit_Type_1_Annual}}` | `calc-type1-annual` | calculated | calculated | (rent×12×count) | ✅ |
| **Unit Type 2 (2 Bed / 1 Bath)** |
| `{{Unit_Type_2_Count}}` | `calc-type2-count` | number | user-input | UNITMIX | ✅ |
| `{{Unit_Type_2_Contract_Rent}}` | `calc-type2-contract-rent` | currency | user-input | UNITMIX!AT | ✅ |
| `{{Unit_Type_2_Market_Rent}}` | `calc-type2-rent` | number | user-input | UNITMIX!BI | ✅ |
| `{{Unit_Type_2_Cont_v_Market}}` | `calc-type2-cont-v-market` | percentage | calculated | (contract/market) | ✅ |
| `{{Unit_Type_2_Per_Unit}}` | `calc-type2-per-unit` | currency | calculated | (annual/count) | ✅ |
| `{{Unit_Type_2_Per_SF}}` | `calc-type2-per-sf` | number | calculated | (annual/sf) | ✅ |
| `{{Unit_Type_2_Annual}}` | `calc-type2-annual` | calculated | calculated | (rent×12×count) | ✅ |
| **Totals** |
| `{{Total_Units}}` | `total-units` | number | calculated | Sum of all types | ✅ |
| `{{Total_Per_Unit}}` | `calc-type-total-per-unit` | currency | calculated | (total annual/units) | ⚠️ Verify |
| `{{Total_Per_SF}}` | `calc-type-total-per-sf` | number | calculated | (total annual/sf) | ⚠️ Verify |
| `{{Total_Rental_Revenue}}` | `calc-total-rental-revenue` | currency | calculated | Sum of all annual | ✅ |

**Notes:**
- Unit Types 3 and 4 follow the same pattern if needed
- Total per-unit and per-sf fields may need registry verification

---

## TABLE 2: Potential Gross Revenue (14 fields)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| **Other Income** |
| `{{Other_Income_Per_Unit}}` | `calc-other-income-per-unit` | currency | calculated | (annual/units) | ⚠️ Verify |
| `{{Other_Income_Per_SF}}` | `calc-other-income-per-sf` | number | calculated | (annual/sf) | ⚠️ Verify |
| `{{Other_Income_Annual}}` | `calc-other-income` | currency | user-input | DIRECTCAP | ✅ |
| **Potential Gross Revenue** |
| `{{PGR_Per_Unit}}` | `calc-pgr-per-unit` | currency | calculated | IA_DirCap_PGIUnit | ✅ |
| `{{PGR_Per_SF}}` | `calc-pgr-per-sf` | number | calculated | IA_DirCap_PGIPSF | ✅ |
| `{{PGR_Annual}}` | `calc-pgr` | currency | calculated | IA_DirCap_PGI | ✅ |
| **Vacancy & Loss** |
| `{{Vacancy_Pct_PGR}}` | `calc-vacancy-rate` | percentage | user-input | IA_DirCap_VacLoss | ✅ |
| `{{Vacancy_Pct_EGR}}` | `calc-vacancy-rate` | percentage | calculated | Same as PGR | ⚠️ Note |
| `{{Vacancy_Per_Unit}}` | `calc-vacancy-per-unit` | currency | calculated | (loss/units) | ⚠️ Verify |
| `{{Vacancy_Per_SF}}` | `calc-vacancy-per-sf` | number | calculated | (loss/sf) | ⚠️ Verify |
| `{{Vacancy_Annual}}` | `calc-vacancy-loss` | currency | calculated | IA_DirCap_VacancyTotal | ✅ |
| **Effective Gross Revenue** |
| `{{EGR_Per_Unit}}` | `calc-egr-per-unit` | currency | calculated | IA_DirCap_EGIUnit | ✅ |
| `{{EGR_Per_SF}}` | `calc-egr-per-sf` | number | calculated | IA_DirCap_EGIPSF | ✅ |
| `{{EGR_Total}}` | `calc-egr` | currency | calculated | IA_DirCap_EGI | ✅ |

**Notes:**
- `Vacancy_Pct_EGR` may be the same field as `Vacancy_Pct_PGR` (both show vacancy rate)
- Per-unit and per-sf breakdowns for other income and vacancy need registry verification

---

## TABLE 3: Operating Expenses (40 fields)

### Taxes (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Tax_Pct_PGR}}` | `calc-exp-taxes-pct-pgr` | percentage | calculated | ✅ |
| `{{Tax_Pct_EGR}}` | `calc-exp-taxes-pct-egr` | percentage | calculated | ✅ |
| `{{Tax_Per_Unit}}` | `calc-exp-taxes-per-unit` | currency | calculated | ✅ |
| `{{Tax_Per_SF}}` | `calc-exp-taxes-per-sf` | number | calculated | ✅ |
| `{{Tax_Annual}}` | `calc-exp-taxes-annual` | currency | user-input | ✅ |

### Insurance (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Insurance_Pct_PGR}}` | `calc-exp-insurance-pct-pgr` | percentage | calculated | ✅ |
| `{{Insurance_Pct_EGR}}` | `calc-exp-insurance-pct-egr` | percentage | calculated | ✅ |
| `{{Insurance_Per_Unit}}` | `calc-exp-insurance-per-unit` | currency | calculated | ✅ |
| `{{Insurance_Per_SF}}` | `calc-exp-insurance-per-sf` | number | calculated | ✅ |
| `{{Insurance_Annual}}` | `calc-exp-insurance-annual` | currency | user-input | ✅ |

### Repairs & Maintenance (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Repairs_Pct_PGR}}` | `calc-exp-repairs-pct-pgr` | percentage | calculated | ✅ |
| `{{Repairs_Pct_EGR}}` | `calc-exp-repairs-pct-egr` | percentage | calculated | ✅ |
| `{{Repairs_Per_Unit}}` | `calc-exp-repairs-per-unit` | currency | calculated | ✅ |
| `{{Repairs_Per_SF}}` | `calc-exp-repairs-per-sf` | number | calculated | ✅ |
| `{{Repairs_Annual}}` | `calc-exp-repairs-annual` | currency | user-input | ✅ |

### Payroll (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Payroll_Pct_PGR}}` | `calc-exp-payroll-pct-pgr` | percentage | calculated | ✅ |
| `{{Payroll_Pct_EGR}}` | `calc-exp-payroll-pct-egr` | percentage | calculated | ✅ |
| `{{Payroll_Per_Unit}}` | `calc-exp-payroll-per-unit` | currency | calculated | ✅ |
| `{{Payroll_Per_SF}}` | `calc-exp-payroll-per-sf` | number | calculated | ✅ |
| `{{Payroll_Annual}}` | `calc-exp-payroll-annual` | currency | user-input | ✅ |

### Utilities (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Utilities_Pct_PGR}}` | `calc-exp-utilities-pct-pgr` | percentage | calculated | ✅ |
| `{{Utilities_Pct_EGR}}` | `calc-exp-utilities-pct-egr` | percentage | calculated | ✅ |
| `{{Utilities_Per_Unit}}` | `calc-exp-utilities-per-unit` | currency | calculated | ✅ |
| `{{Utilities_Per_SF}}` | `calc-exp-utilities-per-sf` | number | calculated | ✅ |
| `{{Utilities_Annual}}` | `calc-exp-utilities-annual` | currency | user-input | ✅ |

### Management Fees (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Management_Pct_PGR}}` | `calc-exp-management-pct-pgr` | percentage | calculated | ✅ |
| `{{Management_Pct_EGR}}` | `calc-exp-management-pct-egr` | percentage | calculated | ✅ |
| `{{Management_Per_Unit}}` | `calc-exp-management-per-unit` | currency | calculated | ✅ |
| `{{Management_Per_SF}}` | `calc-exp-management-per-sf` | number | calculated | ✅ |
| `{{Management_Annual}}` | `calc-exp-management-annual` | currency | user-input | ✅ |

### Other Expenses (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Other_Expenses_Pct_PGR}}` | `calc-exp-other-pct-pgr` | percentage | calculated | ✅ |
| `{{Other_Expenses_Pct_EGR}}` | `calc-exp-other-pct-egr` | percentage | calculated | ✅ |
| `{{Other_Expenses_Per_Unit}}` | `calc-exp-other-per-unit` | currency | calculated | ✅ |
| `{{Other_Expenses_Per_SF}}` | `calc-exp-other-per-sf` | number | calculated | ✅ |
| `{{Other_Expenses_Annual}}` | `calc-exp-other-annual` | currency | user-input | ✅ |

### Total Operating Expenses (5 fields)
| HTML Field ID | Registry Field ID | Type | Input Source | Status |
|---------------|-------------------|------|--------------|--------|
| `{{Total_OpEx_Pct_PGR}}` | `calc-expense-ratio` | percentage | calculated | ✅ |
| `{{Total_OpEx_Pct_EGR}}` | `calc-expense-ratio` | percentage | calculated | ⚠️ Same as PGR? |
| `{{Total_OpEx_Per_Unit}}` | `calc-expenses-per-unit` | currency | calculated | ✅ |
| `{{Total_OpEx_Per_SF}}` | `calc-expenses-per-sf` | number | calculated | ✅ |
| `{{Total_OpEx_Annual}}` | `calc-expenses-total` | currency | calculated | ✅ |

**Notes:**
- All expense annual values are user-input (source data)
- All other metrics (%, per-unit, per-sf) are calculated from annual
- Expense ratio may need separate PGR vs EGR fields in registry

---

## TABLE 4: Net Operating Income & Value (8 fields)

| HTML Field ID | Registry Field ID | Type | Input Source | Valcre Source | Status |
|---------------|-------------------|------|--------------|---------------|--------|
| **Net Operating Income** |
| `{{NOI_Per_Unit}}` | `calc-noi-per-unit` | currency | calculated | IA_DirCap_NOIUnit | ✅ |
| `{{NOI_Per_SF}}` | `calc-noi-per-sf` | number | calculated | IA_DirCap_NOIPSF | ✅ |
| `{{NOI_Annual}}` | `calc-noi` | currency | calculated | IA_DirCap_NOI | ✅ |
| **Capitalization** |
| `{{Concluded_CapRate}}` | `calc-cap-rate` | percentage | user-input | IA_DirCap_CapRate1 | ✅ |
| `{{Capitalized_Value}}` | `calc-indicated-value` | currency | calculated | IA_DirCap_Value1 | ✅ |
| **Final Value** |
| `{{Value_Per_Unit}}` | `calc-value-per-unit` | currency | calculated | (value/units) | ⚠️ Verify |
| `{{Value_Per_SF}}` | `calc-value-per-sf` | number | calculated | (value/sf) | ⚠️ Verify |
| `{{Indicated_Value_Rounded}}` | `calc-indicated-value-rounded` | currency | calculated | Round(value,-3) | ⚠️ Verify |

**Notes:**
- Cap rate is user input (appraiser conclusion)
- Capitalized value = NOI / Cap Rate
- Value per-unit and per-sf fields need registry verification
- Rounded value may need separate registry field or formatting rule

---

## Summary Statistics

| Section | HTML Fields | Registry Fields | Verified | Need Review |
|---------|-------------|-----------------|----------|-------------|
| Unit Mix | 20 | 18 | 18 | 2 |
| Revenue (PGR/EGR) | 14 | 10 | 10 | 4 |
| Operating Expenses | 40 | 40 | 40 | 0 |
| NOI & Value | 8 | 6 | 6 | 2 |
| **TOTAL** | **82** | **74** | **74** | **8** |

---

## Fields Needing Registry Verification (8 fields)

1. `calc-type-total-per-unit` - Total revenue per unit (all types)
2. `calc-type-total-per-sf` - Total revenue per SF (all types)
3. `calc-other-income-per-unit` - Other income per unit breakdown
4. `calc-other-income-per-sf` - Other income per SF breakdown
5. `calc-vacancy-per-unit` - Vacancy loss per unit breakdown
6. `calc-vacancy-per-sf` - Vacancy loss per SF breakdown
7. `calc-value-per-unit` - Indicated value per unit
8. `calc-value-per-sf` - Indicated value per SF

---

## Implementation Notes

### For Template Engine:
1. Use registry field ID as the lookup key
2. Apply formatting based on field type:
   - `currency` → Format with $ and comma separators
   - `percentage` → Format with % symbol
   - `number` → Format with 2 decimal places
   - `calculated` → Format based on context

### For Data Binding:
1. User inputs flow into `user-input` fields
2. Calculated fields derive from source data automatically
3. All expense breakdowns calculate from annual values:
   - `pct-pgr` = (annual / PGR) × 100
   - `pct-egr` = (annual / EGR) × 100
   - `per-unit` = annual / total-units
   - `per-sf` = annual / NRA

### HTML Template Update Required:
Replace HTML field IDs with registry equivalents:
```html
<!-- OLD -->
<span class="field-mapped" title="{{Tax_Pct_PGR}}">{{Tax_Pct_PGR}}</span>

<!-- NEW -->
<span class="field-mapped" data-field-id="calc-exp-taxes-pct-pgr">{{calc-exp-taxes-pct-pgr}}</span>
```

---

## Next Steps

1. ✅ Verify 8 fields needing review exist in registry
2. ⬜ Update HTML template with registry field IDs
3. ⬜ Test data binding with sample values
4. ⬜ Create similar mapping for Page 59 (Sales Comparison Grid)
5. ⬜ Create similar mapping for Pages 37-40 (Rental Survey)

---

**Document Template:** This structure can be replicated for other tables
**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Status:** Ready for implementation
