



**This is exactly what I need.** Your template has more granular fields than my summary - that's good, means you captured the detail.

Let me map your fields to the crosswalk:

---

**Page 49 - Direct Capitalization Field Mapping**

| Your Template Field | Registry ID | Valcre ID | Status |
|---------------------|-------------|-----------|--------|
| **UNIT MIX SECTION** |
| `Unit_Type_1_Count` | `unit-type-1-count` | UNITMIX | ☐ Verify |
| `Unit_Type_1_Contract_Rent` | `unit-type-1-contract-rent` | UNITMIX!AT | ☐ Verify |
| `Unit_Type_1_Market_Rent` | `unit-type-1-market-rent` | UNITMIX!BI | ☐ Verify |
| `Unit_Type_1_Cont_v_Market` | `unit-type-1-cont-v-market` | calculated | ☐ Verify |
| `Unit_Type_1_Per_Unit` | `unit-type-1-per-unit` | calculated | ☐ Verify |
| `Unit_Type_1_Per_SF` | `unit-type-1-per-sf` | calculated | ☐ Verify |
| `Unit_Type_1_Annual` | `unit-type-1-annual` | calculated | ☐ Verify |
| `Unit_Type_2_*` | (same pattern) | | ☐ Verify |
| `Total_Units` | `total-units` | `Subject_Units` | ✅ Mapped |
| `Total_Rental_Revenue` | `calc-total-rental-revenue` | `IA_DirCap_GRIMF` | ☐ Verify |
| **REVENUE SECTION** |
| `PGR_Per_Unit` | `calc-pgr-per-unit` | `IA_DirCap_PGIUnit` | ✅ Mapped |
| `PGR_Per_SF` | `calc-pgr-per-sf` | `IA_DirCap_PGIPSF` | ✅ Mapped |
| `PGR_Annual` | `calc-pgr` | `IA_DirCap_PGI` | ✅ Mapped |
| `Vacancy_Pct_PGR` | `calc-vacancy-rate` | `IA_DirCap_VacLoss` | ✅ Mapped |
| `Vacancy_Annual` | `calc-vacancy-loss` | `IA_DirCap_VacancyTotal` | ✅ Mapped |
| `EGR_Per_Unit` | `calc-egr-per-unit` | `IA_DirCap_EGIUnit` | ✅ Mapped |
| `EGR_Per_SF` | `calc-egr-per-sf` | `IA_DirCap_EGIPSF` | ✅ Mapped |
| `EGR_Total` | `calc-egr` | `IA_DirCap_EGI` | ✅ Mapped |
| **EXPENSES SECTION** |
| `Tax_Pct_PGR` | `expense-tax-pct-pgr` | `IA_Expense01` area | ☐ Add? |
| `Tax_Pct_EGR` | `expense-tax-pct-egr` | calculated | ☐ Add? |
| `Tax_Per_Unit` | `expense-tax-per-unit` | calculated | ☐ Add? |
| `Tax_Per_SF` | `expense-tax-per-sf` | calculated | ☐ Add? |
| `Tax_Annual` | `expense-tax-annual` | IE_CONC | ☐ Add? |
| (Insurance, Repairs, Payroll, Utilities, Management, Other - same pattern) |
| `Total_OpEx_Pct_PGR` | `calc-expense-ratio` | `IA_DirCap_ExpenseRatio` | ✅ Mapped |
| `Total_OpEx_Annual` | `calc-expenses-total` | `IA_DirCap_Expenses` | ✅ Mapped |
| **NOI/VALUE SECTION** |
| `NOI_Per_Unit` | `calc-noi-per-unit` | `IA_DirCap_NOIUnit` | ✅ Mapped |
| `NOI_Per_SF` | `calc-noi-per-sf` | `IA_DirCap_NOIPSF` | ✅ Mapped |
| `NOI_Annual` | `calc-noi` | `IA_DirCap_NOI` | ✅ Mapped |
| `Concluded_CapRate` | `calc-cap-rate` | `IA_DirCap_CapRate1` | ✅ Mapped |
| `Capitalized_Value` | `calc-indicated-value` | `IA_DirCap_Value1` | ✅ Mapped |
| `Indicated_Value_Rounded` | `calc-indicated-value-rounded` | `IA_DirCap_Value1` | ☐ Verify |

---

**Gap Analysis:**

Your template has **~70+ fields** for this table. My mapping covered the summary rows but **missed the individual expense line items** (7 expense categories × 5 columns = 35 fields).

**Question:** Are those expense line item fields in your registry? Or do they need to be added?

If you share what your registry has for expenses, I can complete the crosswalk and build the CC prompt.


---

⏺ Complete Field Status for Page 49 Crosswalk

  Unit Mix Section - PARTIAL COVERAGE

  Registry has (per type 1-4):
  | Template Field          | Registry ID               | Status    |
  |-------------------------|---------------------------|-----------|
  | Unit_Type_1_Count       | calc-type1-count          | ✅ EXISTS |
  | Unit_Type_1_Market_Rent | calc-type1-rent           | ✅ EXISTS |
  | Unit_Type_1_Annual      | calc-type1-annual         | ✅ EXISTS |
  | Total_Units             | calc-total-units          | ✅ EXISTS |
  | Total_Rental_Revenue    | calc-total-rental-revenue | ✅ EXISTS |

  Missing (need to add):
  | Template Field            | Proposed Registry ID     |
  |---------------------------|--------------------------|
  | Unit_Type_1_Contract_Rent | calc-type1-contract-rent |
  | Unit_Type_1_Cont_v_Market | calc-type1-cont-v-market |
  | Unit_Type_1_Per_Unit      | calc-type1-per-unit      |
  | Unit_Type_1_Per_SF        | calc-type1-per-sf        |
  | (repeat for types 2-4)    |                          |

  Unit Mix Gap: ~16 fields missing (4 fields × 4 types)

  ---
  Expenses Section - MINIMAL COVERAGE

  Registry has (totals only):
  calc-exp-taxes, calc-exp-insurance, calc-exp-repairs,
  calc-exp-payroll, calc-exp-utilities, calc-exp-management, calc-exp-other
  calc-expense-ratio, calc-expenses-per-unit, calc-expenses-per-sf,
  calc-expenses-total

  Missing: Full 5-column breakdown per category (35 fields)

  | Category   | Pct_PGR | Pct_EGR | Per_Unit | Per_SF | Annual |
  |------------|---------|---------|----------|--------|--------|
  | Taxes      | ❌      | ❌      | ❌       | ❌     | ❌     |
  | Insurance  | ❌      | ❌      | ❌       | ❌     | ❌     |
  | Repairs    | ❌      | ❌      | ❌       | ❌     | ❌     |
  | Payroll    | ❌      | ❌      | ❌       | ❌     | ❌     |
  | Utilities  | ❌      | ❌      | ❌       | ❌     | ❌     |
  | Management | ❌      | ❌      | ❌       | ❌     | ❌     |
  | Other      | ❌      | ❌      | ❌       | ❌     | ❌     |

  ---
  Summary for Page 49

  | Section           | Exists | Missing | Total |
  |-------------------|--------|---------|-------|
  | Unit Mix          | 10     | 16      | 26    |
  | Revenue (PGR/EGR) | 10     | 0       | 10    |
  | Expenses          | 11     | 35      | 46    |
  | NOI/Value         | 8      | 0       | 8     |
  | TOTAL             | 39     | 51      | 90    |

  51 fields need to be added to complete Page 49 Direct Capitalization table.

  Want me to add these fields to the registry now?
