# Page 49: Direct Capitalization - Field Mapping

**Page:** 49
**Table:** Direct Capitalization Conclusion
**Lines:** 4058-4284
**Total Fields:** 72 fields

---

## Table Structure Verification ✅

Page 49 contains **4 interconnected tables** that form the Direct Capitalization analysis:

1. **DIRECT CAPITALIZATION** - Unit mix and rental revenue breakdown
2. **POTENTIAL GROSS REVENUE** - PGR calculation with other income and vacancy
3. **OPERATING EXPENSES** - Detailed expense breakdown by category
4. **NET OPERATING INCOME** - NOI calculation, cap rate, and final value

---

## Complete Field ID List (72 Fields)

### TABLE 1: DIRECT CAPITALIZATION - Unit Mix & Rental Revenue (20 fields)

| Row | Field ID | Sample Value | Description |
|-----|----------|--------------|-------------|
| **Unit Type 1 (1 Bed / 1 Bath)** |
| 1 | `{{Unit_Type_1_Count}}` | 6 | Number of units |
| 2 | `{{Unit_Type_1_Contract_Rent}}` | $650 | Contract rent per unit |
| 3 | `{{Unit_Type_1_Market_Rent}}` | $800 | Market rent per unit |
| 4 | `{{Unit_Type_1_Cont_v_Market}}` | 81% | Contract vs Market % |
| 5 | `{{Unit_Type_1_Per_Unit}}` | $1,040 | Annual rent per unit |
| 6 | `{{Unit_Type_1_Per_SF}}` | $18.07 | Annual rent per SF |
| 7 | `{{Unit_Type_1_Annual}}` | $152,640 | Total annual revenue |
| **Unit Type 2 (2 Bed / 1 Bath)** |
| 8 | `{{Unit_Type_2_Count}}` | 12 | Number of units |
| 9 | `{{Unit_Type_2_Contract_Rent}}` | $1,055 | Contract rent per unit |
| 10 | `{{Unit_Type_2_Market_Rent}}` | $1,080 | Market rent per unit |
| 11 | `{{Unit_Type_2_Cont_v_Market}}` | 100% | Contract vs Market % |
| 12 | `{{Unit_Type_2_Per_Unit}}` | $1,080 | Annual rent per unit |
| 13 | `{{Unit_Type_2_Per_SF}}` | $18.19 | Annual rent per SF |
| 14 | `{{Unit_Type_2_Annual}}` | $155,640 | Total annual revenue |
| **Totals** |
| 15 | `{{Total_Units}}` | 18 | Total unit count |
| 16 | `{{Total_Per_Unit}}` | $12,240 | Total per unit (annual) |
| 17 | `{{Total_Per_SF}}` | $18.19 | Total per SF (annual) |
| 18 | `{{Total_Rental_Revenue}}` | $185,640 | Total rental revenue |

---

### TABLE 2: POTENTIAL GROSS REVENUE (11 fields)

| Row | Field ID | Sample Value | Description |
|-----|----------|--------------|-------------|
| **Other Income** |
| 19 | `{{Other_Income_Per_Unit}}` | $0 | Other income per unit |
| 20 | `{{Other_Income_Per_SF}}` | $0.00 | Other income per SF |
| 21 | `{{Other_Income_Annual}}` | $0 | Total other income |
| **Potential Gross Revenue** |
| 22 | `{{PGR_Per_Unit}}` | $12,705 | PGR per unit |
| 23 | `{{PGR_Per_SF}}` | $23.02 | PGR per SF |
| 24 | `{{PGR_Annual}}` | $204,240 | Total PGR |
| **Vacancy** |
| 25 | `{{Vacancy_Pct_PGR}}` | 4.0% | Vacancy as % of PGR |
| 26 | `{{Vacancy_Pct_EGR}}` | 4.0% | Vacancy as % of EGR |
| 27 | `{{Vacancy_Per_Unit}}` | ($406) | Vacancy per unit |
| 28 | `{{Vacancy_Per_SF}}` | ($0.77) | Vacancy per SF |
| 29 | `{{Vacancy_Annual}}` | ($7,426) | Total vacancy loss |
| **Effective Gross Revenue** |
| 30 | `{{EGR_Per_Unit}}` | $12,275 | EGR per unit |
| 31 | `{{EGR_Per_SF}}` | $19.25 | EGR per SF |
| 32 | `{{EGR_Total}}` | $196,406 | Total EGR |

**Note:** Field #32 has nested field-mapped spans:
```html
<span class="field-mapped" title="{{EGR_Annual}}">
  <span class="field-mapped" title="{{EGR_Total}}" data-sample="$196,406">
    {{EGR_Total}}
  </span>
</span>
```

---

### TABLE 3: OPERATING EXPENSES (38 fields)

| Row | Field ID | Sample Value | Description |
|-----|----------|--------------|-------------|
| **Real Estate Taxes** |
| 33 | `{{Tax_Pct_PGR}}` | 9.2% | Tax as % of PGR |
| 34 | `{{Tax_Pct_EGR}}` | 9.4% | Tax as % of EGR |
| 35 | `{{Tax_Per_Unit}}` | ($1,131) | Tax per unit |
| 36 | `{{Tax_Per_SF}}` | ($1.77) | Tax per SF |
| 37 | `{{Tax_Annual}}` | ($20,358) | Total tax expense |
| **Insurance** |
| 38 | `{{Insurance_Pct_PGR}}` | 5.6% | Insurance as % of PGR |
| 39 | `{{Insurance_Pct_EGR}}` | 5.8% | Insurance as % of EGR |
| 40 | `{{Insurance_Per_Unit}}` | ($715) | Insurance per unit |
| 41 | `{{Insurance_Per_SF}}` | ($1.11) | Insurance per SF |
| 42 | `{{Insurance_Annual}}` | ($11,680) | Total insurance |
| **Repairs & Maintenance** |
| 43 | `{{Repairs_Pct_PGR}}` | 8.5% | Repairs as % of PGR |
| 44 | `{{Repairs_Pct_EGR}}` | 8.9% | Repairs as % of EGR |
| 45 | `{{Repairs_Per_Unit}}` | ($1,035) | Repairs per unit |
| 46 | `{{Repairs_Per_SF}}` | ($1.62) | Repairs per SF |
| 47 | `{{Repairs_Annual}}` | ($18,630) | Total repairs |
| **Payroll** |
| 48 | `{{Payroll_Pct_PGR}}` | 3.9% | Payroll as % of PGR |
| 49 | `{{Payroll_Pct_EGR}}` | 4.1% | Payroll as % of EGR |
| 50 | `{{Payroll_Per_Unit}}` | ($500) | Payroll per unit |
| 51 | `{{Payroll_Per_SF}}` | ($0.78) | Payroll per SF |
| 52 | `{{Payroll_Annual}}` | ($9,000) | Total payroll |
| **Utilities** |
| 53 | `{{Utilities_Pct_PGR}}` | 10.3% | Utilities as % of PGR |
| 54 | `{{Utilities_Pct_EGR}}` | 10.7% | Utilities as % of EGR |
| 55 | `{{Utilities_Per_Unit}}` | ($1,315) | Utilities per unit |
| 56 | `{{Utilities_Per_SF}}` | ($2.06) | Utilities per SF |
| 57 | `{{Utilities_Annual}}` | ($23,640) | Total utilities |
| **Management Fees** |
| 58 | `{{Management_Pct_PGR}}` | 4.1% | Management as % of PGR |
| 59 | `{{Management_Pct_EGR}}` | 4.3% | Management as % of EGR |
| 60 | `{{Management_Per_Unit}}` | ($525) | Management per unit |
| 61 | `{{Management_Per_SF}}` | ($0.82) | Management per SF |
| 62 | `{{Management_Annual}}` | ($9,347) | Total management |
| **Other Expenses** |
| 63 | `{{Other_Expenses_Pct_PGR}}` | 1.9% | Other as % of PGR |
| 64 | `{{Other_Expenses_Pct_EGR}}` | 2.0% | Other as % of EGR |
| 65 | `{{Other_Expenses_Per_Unit}}` | ($245) | Other per unit |
| 66 | `{{Other_Expenses_Per_SF}}` | ($0.38) | Other per SF |
| 67 | `{{Other_Expenses_Annual}}` | ($4,401) | Total other expenses |
| **Total Operating Expenses** |
| 68 | `{{Total_OpEx_Pct_PGR}}` | 41.6% | Total OpEx as % of PGR |
| 69 | `{{Total_OpEx_Pct_EGR}}` | 43.7% | Total OpEx as % of EGR |
| 70 | `{{Total_OpEx_Per_Unit}}` | ($5,467) | Total OpEx per unit |
| 71 | `{{Total_OpEx_Per_SF}}` | ($8.54) | Total OpEx per SF |
| 72 | `{{Total_OpEx_Annual}}` | ($85,635) | Total operating expenses |

---

### TABLE 4: NET OPERATING INCOME & VALUE (7 fields)

| Row | Field ID | Sample Value | Description |
|-----|----------|--------------|-------------|
| **Net Operating Income** |
| 73 | `{{NOI_Per_Unit}}` | $6,860 | NOI per unit |
| 74 | `{{NOI_Per_SF}}` | $10.65 | NOI per SF |
| 75 | `{{NOI_Annual}}` | $111,771 | Total NOI |
| **Capitalization** |
| 76 | `{{Concluded_CapRate}}` | 6.25% | Concluded cap rate |
| 77 | `{{Capitalized_Value}}` | $1,788,338 | Capitalized value |
| **Final Value** |
| 78 | `{{Value_Per_Unit}}` | $112,586/Unit | Value per unit |
| 79 | `{{Value_Per_SF}}` | $179 | Value per SF |
| 80 | `{{Indicated_Value_Rounded}}` | $1,800,000 | **Indicated value (rounded)** |

---

## Design Verification Results

### ✅ Table Structure: CORRECT

- 4 logical table sections properly separated
- Headers use `.table-section-header` class
- Numeric cells use `.numeric-cell` class
- Total rows use bold styling with gray background (#f0f0f0)
- Column alignment is consistent

### ✅ Field Mapping: CORRECT

- All 80 fields have `.field-mapped` class
- All have `title="{{FieldName}}"` attribute
- All have `data-sample` with test values
- Field names follow consistent naming convention

### ⚠️ Minor Issue Found (Line 4165)

**Nested field-mapped spans on EGR_Total:**
```html
<span class="field-mapped" title="{{EGR_Annual}}">
  <span class="field-mapped" title="{{EGR_Total}}" data-sample="$196,406">
    {{EGR_Total}}
  </span>
</span>
```

**Recommendation:** Remove outer span or consolidate into single field.

---

## Field Grouping for Your Assistant

### Group 1: Revenue Fields (18 fields)
Fields 1-18: Unit mix and rental revenue breakdown

### Group 2: PGR & Vacancy (14 fields)
Fields 19-32: Other income, PGR, vacancy, EGR calculations

### Group 3: Operating Expenses (40 fields)
Fields 33-72: 7 expense categories × 5 metrics each + totals

### Group 4: Value Conclusion (8 fields)
Fields 73-80: NOI, cap rate, final value metrics

---

## Data Source Mapping

| Field Range | Data Source Sheet | Notes |
|-------------|-------------------|-------|
| 1-18 | DIRECTCAP, UNITMIX | Unit counts, contract/market rents |
| 19-32 | DIRECTCAP | PGR, other income, vacancy |
| 33-72 | IE_CONC, DIRECTCAP | Operating expense projections |
| 73-80 | DIRECTCAP, VALUES | NOI, cap rate, final value |

---

## Summary

**Total Fields Identified:** 80 (not 60 as estimated)

**Table Design:** ✅ Correct and well-structured

**Field Mapping Status:** ✅ Complete with consistent naming

**Action Items:**
1. Fix nested field-mapped span on line 4165 ({{EGR_Total}})
2. Verify all 80 fields exist in field registry
3. Map to DIRECTCAP workbook columns

**Next Steps:**
Ready for your assistant to map these 80 field IDs to the DIRECTCAP workbook columns in the master field mapping file.

---

**Last Reviewed:** December 18, 2025
**Reviewed By:** Claude Code
