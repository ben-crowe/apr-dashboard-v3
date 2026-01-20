# Valcre Workbook: Income Approach Structure Reference

**Document**: 06 - Valcre Workbook Income Structure
**Source**: Valcre DIRECTCAP Sheet Analysis
**Created**: 2026-01-09
**Purpose**: Document original Valcre workbook structure for Income Approach to ensure APR Dashboard implementation matches source architecture

---

## Overview

This document extracts the **exact structure** of the Valcre Excel workbook's Income Approach / Direct Capitalization section. This serves as the authoritative reference for understanding:
- How many unit types are supported
- What columns exist for each unit type
- What expense line items are available
- Which fields are user inputs vs calculated outputs

**Source Files**:
- `src/features/report-builder/schema/workbookFieldMapping.ts` (588 lines of Valcre → APR mappings)
- `docs/15-Contract-review/2-Field Management/archive-2025-12-19/Valcre ID-Mapping-dec.18.25/table-structures.ts`
- `docs/16-Field-Input-Output-Mapping/01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`

---

## Valcre Workbook Architecture

### Sheet: DIRECTCAP
**Purpose**: Direct Capitalization Income Statement
**Row Range**: 17-275
**Data Sources**: Pulls from UNITMIX, IE_IN, IE_CONC sheets

---

## SECTION 1: UNIT MIX TABLE

**Location**: DIRECTCAP Rows 17-44
**Source Sheet**: UNITMIX
**Capacity**: **Up to 25 unit types**

### Column Structure (10 columns per unit type)

| Column | Field Name | Input/Calc | Valcre Named Range | Notes |
|--------|------------|------------|-------------------|-------|
| C | Unit Type Name | **INPUT** | `UNITMIX!T{row}` | e.g., "1 Bed / 1 Bath" |
| D | Unit Count | **INPUT** | `UNITMIX!V{row}` | Number of units of this type |
| E | Avg SF per Unit | **INPUT** | `UNITMIX!P{row}` | Average square footage |
| F | Contract Rent/Mo | **INPUT** | `UNITMIX!AT{row}` | Current contract rent |
| G | Market Rent/Mo | **INPUT** | `UNITMIX!BI{row}` | Market rent per month |
| H | Rent Ratio % | CALCULATED | - | Contract / Market × 100 |
| I | Selected Rent | CALCULATED | - | User toggles Contract or Market |
| J | Annual Rent $/SF | CALCULATED | - | (Selected × 12) / Avg SF |
| K | Monthly Rent $/SF | CALCULATED | - | Selected / Avg SF |
| L | Total Annual Rent | CALCULATED | - | Selected × Count × 12 |

### Example Data (Row 19 - Type 1)

```
C: "1 Bed / 1 Bath"
D: 8 units
E: 650 SF
F: $1,150/mo (contract)
G: $1,200/mo (market)
H: 95.8% (calculated ratio)
I: $1,200 (selected market rent)
J: $22.15/SF/year (calculated)
K: $1.85/SF/month (calculated)
L: $115,200/year (calculated: 8 × $1,200 × 12)
```

### Total Row (Row 44)
- Sums all unit counts → Total Units
- Sums all SF → Total NRA
- Sums all annual rent → Total Rental Revenue

---

## SECTION 2: REVENUE SUMMARY

**Location**: DIRECTCAP Rows 218-225

| Field | Row | Input/Calc | Valcre Field ID | Calculation |
|-------|-----|------------|----------------|-------------|
| **Potential Gross Revenue (PGR)** | 218 | CALCULATED | `IA_DirCap_PGI` | Sum(all unit annual rent) + other income |
| PGR per Unit | 218 | CALCULATED | `IA_DirCap_PGIUnit` | PGR / Total Units |
| PGR per SF/Year | 218 | CALCULATED | `IA_DirCap_PGIPSF` | PGR / Total SF |
| **Vacancy Loss Rate %** | 220 | **INPUT** | `IA_DirCap_VacLoss` | User enters % (e.g., 5.0%) |
| Vacancy Loss Amount | 220 | CALCULATED | `IA_DirCap_VacancyTotal` | PGR × Vacancy % |
| **Concessions Rate %** | 221 | **INPUT** | `IA_DirCap_ConcLoss` | User enters % |
| Concessions Amount | 221 | CALCULATED | `IA_DirCap_ConcessionTotal` | PGR × Concessions % |
| **Credit Loss Rate %** | 222 | **INPUT** | `IA_DirCap_ColLoss` | User enters % (bad debt) |
| Credit Loss Amount | 222 | CALCULATED | `IA_DirCap_CreditLossTotal` | PGR × Credit Loss % |
| **Other Loss Rate %** | 223 | **INPUT** | `IA_DirCap_Loss2Lease` | User enters % |
| Other Loss Amount | 223 | CALCULATED | `IA_DirCap_OtherLossTotal` | PGR × Other Loss % |
| **Total Vacancy & Loss** | 224 | CALCULATED | `IA_DirCap_LossTotal` | Sum(all loss amounts) |
| **Effective Gross Revenue (EGR)** | 225 | CALCULATED | `IA_DirCap_EGI` | PGR - Total Loss |
| EGR per Unit | 225 | CALCULATED | `IA_DirCap_EGIUnit` | EGR / Total Units |
| EGR per SF/Year | 225 | CALCULATED | `IA_DirCap_EGIPSF` | EGR / Total SF |

---

## SECTION 3: OPERATING EXPENSES

**Location**: DIRECTCAP Rows 227-252
**Source Sheet**: IE_CONC (Expense Conclusion)
**Capacity**: **Up to 25 expense line items**

### Expense Line Item Structure

| Component | Input/Calc | Source | Notes |
|-----------|------------|--------|-------|
| Expense Label | **INPUT** | `IA_Expense01` through `IA_Expense25` (IE_IN sheet) | Customizable labels (Taxes, Insurance, etc.) |
| Expense Amount | **INPUT** | IE_CONC!G{48-72} | User enters total annual $ |
| % of EGI | CALCULATED | IE_CONC!D{48-72} | Expense / EGR × 100 |
| $/SF | CALCULATED | IE_CONC!E{48-72} | Expense / Total SF |
| $/Unit | CALCULATED | IE_CONC!F{48-72} | Expense / Total Units |

### Common Expense Labels (Examples from IA_Expense01-25)

```
IA_Expense01: "Property Taxes"
IA_Expense02: "Insurance"
IA_Expense03: "Repairs & Maintenance"
IA_Expense04: "Payroll"
IA_Expense05: "Utilities"
IA_Expense06: "Management Fees"
IA_Expense07: "Supplies"
IA_Expense08: "Administrative"
IA_Expense09: "Marketing"
IA_Expense10: "Landscaping"
... (up to 25 customizable)
```

### Total Row (Row 252)

| Field | Valcre Field ID | Calculation |
|-------|----------------|-------------|
| Total Operating Expenses | `IA_DirCap_Expenses` | Sum(all expense amounts) |
| Expense Ratio % | `IA_DirCap_ExpenseRatio` | Total Expenses / EGR × 100 |

---

## SECTION 4: NET OPERATING INCOME

**Location**: DIRECTCAP Row 253

| Field | Column | Valcre Field ID | Calculation |
|-------|--------|----------------|-------------|
| **Net Operating Income (NOI)** | L | `IA_DirCap_NOI` | EGR - Total Expenses |
| NOI per Unit | I | `IA_DirCap_NOIUnit` | NOI / Total Units |
| NOI per SF/Year | J | `IA_DirCap_NOIPSF` | NOI / Total SF |

---

## SECTION 5: CAPITALIZATION & VALUE

**Location**: DIRECTCAP Rows 254-269

### Cap Rate Inputs

| Field | Row | Input/Calc | Valcre Field ID | Notes |
|-------|-----|------------|----------------|-------|
| **Cap Rate 1 (Primary)** | 254 | **INPUT** | `IA_DirCap_CapRate1` | User enters % (e.g., 5.50%) |
| **Cap Rate 2 (Blended)** | 255 | **INPUT** | `IA_DirCap_CapRate2` | Optional blended rate |
| **Use Blended?** | - | **INPUT** | `IA_DirCap_Blend` | Toggle "Yes"/"No" |

### Value Conclusions (Up to 4 Scenarios)

| Scenario | Row | Valcre Field ID | Calculation |
|----------|-----|----------------|-------------|
| **Preliminary Value** | 256 | `IA_DirCap_PrelimValue1` | NOI / Cap Rate 1 |
| **Indicated Value 1** | 257 | `IA_DirCap_Value1` | Preliminary + Adjustment 1 |
| Value 1 per Unit | 257 | `IA_DirCap_ValuePerUnit1.6` | Value 1 / Total Units |
| Value 1 per SF | 257 | `IA_DirCap_ValuePerUnit1.5` | Value 1 / Total SF |
| **Adjustment 1** | 258 | `IA_DirCap_Adjustment1` | **INPUT** (e.g., CapEx reserves) |
| Adjustment 1 Toggle | - | `IA_DirCap_Adj1` | **INPUT** Enable/disable |
| **Indicated Value 2** | 261 | `IA_DirCap_Value2` | Preliminary + Adjustment 2 |
| **Indicated Value 3** | 265 | `IA_DirCap_Value3` | Scenario 3 with adjustments |
| **Indicated Value 4** | 269 | `IA_DirCap_Value4` | Scenario 4 with adjustments |

---

## COMPLETE FIELD BREAKDOWN: INPUT vs CALCULATED

### USER INPUTS (13 input types)

#### Unit Mix Inputs (per type, up to 25 types)
1. Unit Type Name (text)
2. Unit Count (number)
3. Avg SF (number)
4. Contract Rent/Mo (currency)
5. Market Rent/Mo (currency)

#### Vacancy & Loss Inputs
6. Vacancy Loss Rate % (percentage)
7. Concessions Rate % (percentage)
8. Credit Loss Rate % (percentage)
9. Other Loss Rate % (percentage)

#### Expense Inputs (up to 25 line items)
10. Expense Amounts (currency) - 25 customizable line items

#### Capitalization Inputs
11. Cap Rate 1 (Primary) (percentage)
12. Cap Rate 2 (Blended Option) (percentage)

#### Adjustment Inputs (up to 4 scenarios)
13. Adjustment Amounts (currency) - CapEx, reserves, etc.

### CALCULATED OUTPUTS (all others)

#### Unit Mix Calculations
- Rent Ratio % (Contract/Market)
- Selected Rent (user toggles)
- Annual Rent $/SF
- Monthly Rent $/SF
- Total Annual Rent per type
- Total Units (sum)
- Total SF (sum)

#### Revenue Calculations
- PGR (Potential Gross Revenue)
- PGR per Unit
- PGR per SF
- Vacancy/Loss Amounts (4 types)
- Total Vacancy & Loss
- EGR (Effective Gross Revenue)
- EGR per Unit
- EGR per SF

#### Expense Calculations
- Expense % of EGI (per line item)
- Expense $/SF (per line item)
- Expense $/Unit (per line item)
- Total Operating Expenses
- Expense Ratio %

#### NOI & Value Calculations
- NOI (Net Operating Income)
- NOI per Unit
- NOI per SF
- Preliminary Value (NOI / Cap Rate)
- Indicated Values (1-4 scenarios)
- Value per Unit
- Value per SF

---

## APR DASHBOARD MAPPING STATUS

### Current Implementation (CalcInputPanel)

**Supports**: 4 unit types (Type 1-4)
**Should Support**: 25 unit types (Valcre capacity)

**Current Fields**: 29 input fields
**Full Valcre Capacity**:
- 25 unit types × 5 inputs = 125 unit input fields
- 4 vacancy/loss rates = 4 fields
- 25 expense amounts = 25 fields
- 3 cap rate fields = 3 fields
- 4 adjustment amounts = 4 fields
- **Total Potential**: 161 input fields

### Gap Analysis

| Component | Valcre Capacity | APR Current | Gap |
|-----------|----------------|-------------|-----|
| Unit Types | 25 | 4 | -21 types |
| Expense Lines | 25 | 7 | -18 lines |
| Vacancy/Loss Types | 4 | 3 | -1 type (Other Loss) |
| Value Scenarios | 4 | 1 | -3 scenarios |

---

## VERIFICATION CHECKLIST

- [x] Valcre workbook structure documented
- [x] Input vs calculated fields identified
- [x] Unit mix capacity confirmed (25 types)
- [x] Expense capacity confirmed (25 line items)
- [x] Column structure mapped
- [x] Field ID mappings cross-referenced
- [ ] **TODO**: Verify APR Dashboard supports 25 unit types (currently only 4)
- [ ] **TODO**: Verify APR Dashboard supports 25 expense lines (currently only 7)
- [ ] **TODO**: Add "Other Loss" rate field to match Valcre 4 loss types

---

## RELATED DOCUMENTATION

- **Phase 16 Doc 03**: `03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md` - APR Dashboard implementation
- **Field Mapping**: `src/features/report-builder/schema/workbookFieldMapping.ts` - Valcre ↔ APR mappings
- **Table Structures**: `docs/15-Contract-review/2-Field Management/archive-2025-12-19/Valcre ID-Mapping-dec.18.25/table-structures.ts`
- **Valcre Home Tab**: `docs/15-Contract-review/0-APR-Core-to org/HomeTab Editor Plan Restructure/Valcre-HomeTab-Field-Reference.md`

---

## KEY FINDINGS FOR UI DEVELOPMENT

1. **Scalability Gap**: Valcre supports 25 unit types; APR Dashboard currently limited to 4
2. **Expense Flexibility**: Valcre allows 25 customizable expense line items; APR has 7 hardcoded
3. **Column Alignment**: Each unit type has 10 columns (5 inputs + 5 calculated)
4. **Loss Types**: Valcre tracks 4 separate loss types (Vacancy, Concessions, Credit Loss, Other Loss)
5. **Multiple Scenarios**: Valcre supports 4 value scenarios with individual adjustments

---

**Document Status**: ✅ Complete
**Next Action**: Use this reference when expanding CalcInputPanel to match Valcre capacity
**Agent Context**: Desktop agent requested this extraction for understanding Valcre structure
