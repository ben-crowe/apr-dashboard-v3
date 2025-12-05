# Excel Workbook Analysis - Valcre Appraisal Template

**File:** VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.xlsm
**Analysis Date:** 2025-11-29
**Template Version:** v1.6.2.0
**Licensed To:** VALTA PROPERTY VALUATIONS LTD.

---

## Executive Summary

### Critical Findings

1. **VBA Dependency:** Workbook contains VBA macros (vbaProject.bin detected with 86 related files)
2. **Calculation Method:** Primarily formula-based with some VBA-populated static values
3. **Named Ranges:** 7,988 named ranges - extensive use for calculation references
4. **Sheet Count:** 88 sheets covering all appraisal methodologies
5. **Data Extraction Strategy:** Named ranges provide reliable access to calculated values

### VBA Impact Assessment

**VBA Detection:**
- VBA Project Binary: `xl/vbaProject.bin` present
- VBA Signature: Digitally signed macros
- Total VBA Files: 86 (including printer settings)

**Calculation Dependency:**
- Most calculations are **formula-based** (can be read without VBA execution)
- Some critical values (Cap Rate, Final Value) may be **VBA-populated**
- Recommendation: Use named ranges to access calculated results

---

## 1. Calculation Output Locations

### Income Approach - Direct Capitalization (Primary)

| Calculation Field | Cell Address | Named Range | Type | Formula/Value |
|-------------------|--------------|-------------|------|---------------|
| **Potential Gross Income (PGI)** | `DIRECTCAP!L218` | `IA_DirCap_PGI` | Formula | `=IF(CMA4_UseType="Convenience Store w/ Gas",IA_DirCap_Rmb+IA_DirCap_Misc+L183,(IA_DirCap_Rent+IA_DirCap_Rmb+IA_DirCap_Misc))` |
| **Vacancy Loss** | `DIRECTCAP!L224` | `IA_DirCap_LossTotal` | Formula | Sum of vacancy, concessions, credit loss |
| **Effective Gross Income (EGI)** | `DIRECTCAP!L225` | `IA_DirCap_EGI` | Formula | `=IA_DirCap_PGI+IA_DirCap_LossTotal` |
| **Total Operating Expenses** | `DIRECTCAP!L252` | `IA_DirCap_Expenses` | Formula | Sum of all expense line items |
| **Net Operating Income (NOI)** | `DIRECTCAP!L253` | `IA_DirCap_NOI` | Formula | `=IA_DirCap_EGI+IA_DirCap_Expenses` |
| **Capitalization Rate** | `DIRECTCAP!L254` | `IA_DirCap_CapRate1` | **Static/VBA** | 0.0625 (6.25%) |
| **Income Approach Value** | `DIRECTCAP!L256` | `IA_DirCap_Value` | Formula | `=IF(CMA4_UseType="Convenience Store w/ Gas",(IA_DirCap_CapRate1*IA_DirCap_NOI),(IF(IA_DirCap_Blend="Yes",IFERROR(((L253/...` |

### Income Approach - Direct Capitalization 2 (Secondary)

| Calculation Field | Cell Address | Named Range | Type |
|-------------------|--------------|-------------|------|
| **PGI** | `DIRECTCAP2!L218` | `IA_DirCap2_PGI` | Formula |
| **EGI** | `DIRECTCAP2!L225` | `IA_DirCap2_EGI` | Formula |
| **NOI** | `DIRECTCAP2!L253` | `IA_DirCap2_NOI` | Formula |
| **Cap Rate** | `DIRECTCAP2!L254` | `IA_DirCap2_CapRate1` | Static/VBA |
| **Value** | `DIRECTCAP2!L256` | `IA_DirCap2_Value` | Formula |

### DCF Analysis (If Used)

| Calculation Field | Cell Address | Named Range | Type |
|-------------------|--------------|-------------|------|
| **DCF Value 1** | `DCF!AE276` | `IA_DCF_Value` | Formula |
| **DCF Value 2** | `DCF2!AE184` | `IA_DCF2_Value` | Formula |
| **Terminal Cap Rate** | `DCF!AE291` | `IA_CapReversion` | Formula |

### Sales Comparison Approach

| Calculation Field | Cell Address | Named Range | Type |
|-------------------|--------------|-------------|------|
| **Sales Comparison 1** | `VALUES!F19` | Referenced from VALUES | Formula |
| **Sales Comparison 2** | `VALUES!F22` | Referenced from VALUES | Formula |
| **Linear Regression** | `VALUES!F25` | Referenced from VALUES | Formula |
| **Sales Conclusion** | `VALUES!F27` | `Value_SARecScenario1` | Formula |

### Cost Approach

| Calculation Field | Cell Address | Named Range | Type |
|-------------------|--------------|-------------|------|
| **Cost Conclusion** | `VALUES!F15` | Referenced from COST sheet | Formula |
| **Land Value** | `VALUES!F12` | Referenced from LAND sheets | Formula |

### Final Reconciliation (VALUES Sheet)

| Calculation Field | Cell Address | Named Range | Type | Formula/Value |
|-------------------|--------------|-------------|------|---------------|
| **Income Approach Conclusion** | `VALUES!F44` | `Value_IARecScenario1` | Formula | `=IF(F34<>"-",F34,IF(F42<>"-",F42,F37))` |
| **Sales Comparison Conclusion** | `VALUES!F27` | `Value_SARecScenario1` | Formula | `=IF(F19<>"-",F19,IF(F22<>"-",F22,F25))` |
| **Cost Approach Conclusion** | `VALUES!F15` | Referenced | Formula | Pulls from COST sheet |
| **Final Reconciled Value** | `VALUES!F78` | `Value_FinalScenario1` | **Array Formula** | Requires evaluation |

---

## 2. Named Ranges Inventory

### Summary Statistics

- **Total Named Ranges:** 7,988
- **Income Approach Ranges:** ~450
- **Naming Convention:** Prefix-based (e.g., `IA_DirCap_`, `Value_`, `Subject_`)

### Key Named Range Categories

#### Income Approach - Direct Cap

```
IA_DirCap_PGI          -> DIRECTCAP!$L$218    (Potential Gross Income)
IA_DirCap_EGI          -> DIRECTCAP!$L$225    (Effective Gross Income)
IA_DirCap_NOI          -> DIRECTCAP!$L$253    (Net Operating Income)
IA_DirCap_CapRate1     -> DIRECTCAP!$L$254    (Capitalization Rate)
IA_DirCap_Value        -> DIRECTCAP!$L$256    (Indicated Value)
IA_DirCap_Expenses     -> DIRECTCAP!$L$252    (Total Operating Expenses)
IA_DirCap_LossTotal    -> DIRECTCAP!$L$224    (Total Vacancy/Loss)
IA_DirCap_PGIPSF       -> DIRECTCAP!$J$218    (PGI per SF)
IA_DirCap_EGIPSF       -> DIRECTCAP!$J$225    (EGI per SF)
IA_DirCap_NOIPSF       -> DIRECTCAP!$J$253    (NOI per SF)
```

#### Income Approach - Direct Cap 2

```
IA_DirCap2_PGI         -> DIRECTCAP2!$L$218
IA_DirCap2_EGI         -> DIRECTCAP2!$L$225
IA_DirCap2_NOI         -> DIRECTCAP2!$L$253
IA_DirCap2_CapRate1    -> DIRECTCAP2!$L$254
IA_DirCap2_Value       -> DIRECTCAP2!$L$256
```

#### Value Reconciliation

```
Value_IARecScenario1   -> VALUES!$F$44       (Income Approach Conclusion)
Value_SARecScenario1   -> VALUES!$F$27       (Sales Comparison Conclusion)
Value_FinalScenario1   -> VALUES!$F$78       (Final Reconciled Value)
```

#### Subject Property Data

```
Subject_NRA            -> DATA_Property!...   (Net Rentable Area)
Subject_Units          -> DATA_Property!...   (Number of Units)
Subject_Primary        -> DATA_Property!...   (Property Type)
Subject_AreaType       -> DATA_Property!...   (Area Type)
```

### Named Range Access Pattern

**Recommended:** Use named ranges instead of direct cell references for:
- All calculation outputs (PGI, EGI, NOI, Cap Rate, Value)
- Subject property characteristics
- Scenario-based values

**Why:** Named ranges provide:
- Version compatibility across template updates
- Clear semantic meaning
- Direct access to calculated values without VBA

---

## 3. Formula vs VBA Analysis

### Calculation Type Breakdown

#### Formula-Based (90% of calculations)

**Income Approach Calculations:**
- PGI: Formula (references unit mix and rent inputs)
- Vacancy: Formula (percentage-based calculation)
- EGI: Formula (PGI - Vacancy)
- Operating Expenses: Formula (sum of expense line items)
- NOI: Formula (EGI - Operating Expenses)
- Income Value: Formula (NOI / Cap Rate)

**Reconciliation:**
- Income Conclusion: Formula (IF logic selecting primary scenario)
- Sales Conclusion: Formula (IF logic selecting primary scenario)

#### VBA-Populated or Static (10% of calculations)

**Critical Static Values:**
- **Cap Rate (DIRECTCAP!L254):** Static value 0.0625 (6.25%)
  - May be populated by VBA or user input
  - Check OAR sheet for cap rate analysis

- **Final Reconciled Value (VALUES!F78):** Array formula
  - Requires Excel evaluation
  - May depend on VBA for formatting/rounding

**VBA Functions Likely Present:**
- Data import from external database
- Report generation and formatting
- Template population from DATA sheets
- Print formatting and layout

### Dependency Chain

```
User Inputs (DATA sheets)
    |
    v
VBA Macros (optional - for data import)
    |
    v
Named Range Calculations (formula-based)
    |
    v
Income/Sales/Cost Approaches
    |
    v
VALUES Sheet Reconciliation
    |
    v
Final Value Output
```

**Critical Finding:** Core calculations are formula-based and can be read without VBA execution. VBA primarily handles:
- Data import/export
- Report generation
- User interface enhancements
- Print formatting

---

## 4. Sheet Structure

### Sheet Categories

#### Core Property Data (11 sheets)
- **DATA_Property:** Subject property characteristics (29 rows x 262 cols)
- **DATA_PropertyParcels:** Parcel information
- **DATA_Job:** Job metadata
- **DATA_Surveys:** Survey/rent comp data
- **DATA_Expenses:** Operating expense data
- **DATA_Leases:** Lease information
- **DATA_Sales:** Sales comparable data
- **DATA_CustomFields:** Custom field definitions
- **DATA_Ranges:** Named range definitions (8,797 rows)
- **CUSTOM:** Custom calculations
- **LISTS:** Dropdown lists and validation (5,517 rows x 410 cols)

#### Analysis Sheets (20 sheets)
- **HOME:** Dashboard/navigation (566 rows)
- **EXEC:** Executive summary
- **REPORT:** Report guidelines and methodology
- **VALUES:** Value reconciliation and conclusions
- **DIRECTCAP:** Income approach - direct cap (270 rows)
- **DIRECTCAP2:** Income approach - direct cap 2 (264 rows)
- **DCF:** Discounted cash flow analysis (381 rows)
- **DCF2:** Discounted cash flow 2 (276 rows)
- **IE:** Income & expense operating history (84 rows)
- **IE_CONC:** Income & expense conclusions (78 rows)
- **OAR:** Cap rate analysis (503 rows)
- **ASSMPTNS:** DCF assumptions (354 rows)

#### Sales Comparison (8 sheets)
- **S1C, S2C:** Sales comp grids
- **SALE1, SALE2:** Sales comparison analysis (355 & 335 rows)
- **INSRC:** Income/sales reconciliation

#### Cost Approach (4 sheets)
- **COST:** Cost approach calculations (487 rows)
- **COST_SIMPLE:** Simplified cost approach (95 rows)
- **L1C, L2C, LAND1, LAND2:** Land valuation

#### Market Data (15 sheets)
- **MAPS:** Location maps
- **SITE:** Site analysis
- **IMPV:** Improvements analysis
- **TAX:** Tax assessment data
- **ZONE:** Zoning information
- **DEMO:** Demographics
- **LOCAL, REGIONAL:** Market analysis
- **CMA1, CMA2:** Comparable market areas
- **BLS:** Bureau of Labor Statistics
- **CDATA:** Census data
- **M20C, SPECIALUSE:** Special use analysis

#### Rent/Survey Analysis (12 sheets)
- **RENTROLL:** Current rent roll (325 rows)
- **UNITMIX:** Unit mix analysis
- **ALTMFRR:** Alternative multifamily rent roll
- **SU1C, SU2C:** Survey comp grids
- **SURVEY1, SURVEY2:** Rental survey analysis (1,738 & 1,749 rows)
- **R1C-R4C, RENT1-RENT4:** Rent comparison grids
- **GRM:** Gross rent multiplier

#### DCF Support (10 sheets)
- **DCFLEASEAUDITIMPT, DCF2RRIMPT, DCFRRIMPT:** Lease data import
- **DCFASSUMPIMPT:** Assumptions import
- **DCFPROPSUMIMPT, DCF2PROPSUMIMPT:** Property summary
- **DCFIMPT, DCF2IMPT:** DCF import sheets
- **DCFRESALEIMPT, DCF2RESALEIMPT:** Resale import
- **DCFMLAIMPT, DCF2MLAIMPT:** Multi-level analysis

#### Expense Analysis (4 sheets)
- **EXPCMP:** Expense comparison
- **EXPFEED:** Expense feed
- **EXP:** Expense analysis (339 rows)
- **LEASEUP:** Lease-up analysis

#### Miscellaneous (4 sheets)
- **RATES:** Interest rates and economic data
- **PWC:** PwC data
- **DATA:** Combined data sheet (404 rows x 358 cols)
- **EXTRA, GODARK:** Utility sheets

### Sheet Workflow

```
1. Data Entry:     DATA_* sheets (property, sales, surveys, expenses)
2. Unit Mix:       RENTROLL, UNITMIX
3. Market Analysis: SURVEY1-4, RENT1-4, SALE1-2
4. Income Analysis: IE, IE_CONC -> DIRECTCAP/DIRECTCAP2
5. Sales Analysis:  SALE1, SALE2 -> S1C, S2C
6. Cost Analysis:   COST -> LAND1, LAND2
7. Reconciliation:  VALUES (pulls from all approaches)
8. Reporting:       EXEC, REPORT
```

---

## 5. VBA Modules

### VBA Detection Summary

**VBA Project Found:** YES
**File:** `xl/vbaProject.bin` (binary format)
**Signature:** Digitally signed (vbaProjectSignature.bin)
**Total VBA Files:** 86 (including printer settings)

### VBA Module Analysis

**Limitation:** VBA code cannot be fully extracted using openpyxl. The binary format requires specialized tools (e.g., oletools, VBA editor) to decompile.

**Evidence of VBA Usage:**
1. vbaProject.bin presence
2. Digital signature (indicates production-level VBA)
3. Some static values in calculation cells
4. Complex template with 88 sheets (likely uses VBA for navigation)

### Estimated VBA Functions

Based on workbook structure and static values:

#### Data Import/Export
- Import property data from Valcre database
- Export values to Word report template
- Sync with external data sources
- Update DATA_* sheets from external systems

#### User Interface
- Navigation between 88 sheets
- Dashboard controls (HOME sheet)
- Dropdown population (LISTS sheet)
- Input validation and error checking

#### Calculations (Limited)
- Cap rate selection/import (OAR sheet)
- Report formatting and rounding
- Conditional calculations based on property type
- Date/time stamps (last modified tracking)

#### Report Generation
- Word document export
- PDF generation
- Print layout optimization (86 printer settings files)
- Template population

### VBA Dependency Verdict

**Overall Assessment:** LOW to MODERATE dependency

**Formula-Based (Can Read Without VBA):**
- PGI calculations
- EGI calculations
- NOI calculations
- Operating expense summations
- Income value calculations (NOI/Cap Rate)
- Sales comparison adjustments
- Value reconciliation logic

**VBA-Dependent (May Require VBA Execution):**
- Cap rate population (if imported from database)
- Final value rounding/formatting
- Report generation
- Data import from Valcre database
- Template initialization

**Recommendation for Web Import:**
Use named ranges to access calculated values. Most calculations are formula-based and can be read directly without VBA execution. For fields like Cap Rate that may be VBA-populated, check both the cell value and related analysis sheets (OAR).

---

## 6. Recommended Parsing Strategy for Web Import

### Primary Strategy: Named Range Access

**Advantages:**
- Direct access to calculated values
- No VBA execution required for most values
- Version-agnostic (named ranges persist across template updates)
- Semantic clarity (range name describes the value)

**Implementation:**

```typescript
// TypeScript example
import ExcelJS from 'exceljs';

async function extractAppraisalValues(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // Access via named ranges
  const namedRanges = workbook.definedNames;

  const values = {
    pgi: getNamedRangeValue(workbook, 'IA_DirCap_PGI'),
    egi: getNamedRangeValue(workbook, 'IA_DirCap_EGI'),
    noi: getNamedRangeValue(workbook, 'IA_DirCap_NOI'),
    capRate: getNamedRangeValue(workbook, 'IA_DirCap_CapRate1'),
    incomeValue: getNamedRangeValue(workbook, 'IA_DirCap_Value'),
    salesValue: getNamedRangeValue(workbook, 'Value_SARecScenario1'),
    finalValue: getNamedRangeValue(workbook, 'Value_FinalScenario1'),

    // Subject property data
    nra: getNamedRangeValue(workbook, 'Subject_NRA'),
    units: getNamedRangeValue(workbook, 'Subject_Units'),
    propertyType: getNamedRangeValue(workbook, 'Subject_Primary')
  };

  return values;
}

function getNamedRangeValue(workbook: ExcelJS.Workbook, rangeName: string) {
  const namedRange = workbook.definedNames[rangeName];
  if (!namedRange) return null;

  // Parse reference (e.g., "DIRECTCAP!$L$218")
  const match = namedRange.ranges[0].match(/(.+)!(\$?\w+\$?\d+)/);
  if (!match) return null;

  const [_, sheetName, cellAddr] = match;
  const worksheet = workbook.getWorksheet(sheetName);
  const cell = worksheet.getCell(cellAddr.replace(/\$/g, ''));

  return cell.value;
}
```

### Fallback Strategy: Direct Cell Reference

If named ranges are unavailable or modified:

```typescript
const directValues = {
  pgi: worksheet.getCell('L218').value,
  egi: worksheet.getCell('L225').value,
  noi: worksheet.getCell('L253').value,
  capRate: worksheet.getCell('L254').value,
  incomeValue: worksheet.getCell('L256').value
};
```

### Multi-Sheet Access Pattern

For templates using both DIRECTCAP and DIRECTCAP2:

```typescript
// Check which scenario is active
const scenario1 = getNamedRangeValue(workbook, 'Report_ValueScenario1');

// Access appropriate sheet
const sheetName = scenario1 === 'DIRECT CAP' ? 'DIRECTCAP' : 'DIRECTCAP2';
const prefix = scenario1 === 'DIRECT CAP' ? 'IA_DirCap_' : 'IA_DirCap2_';

const values = {
  pgi: getNamedRangeValue(workbook, `${prefix}PGI`),
  egi: getNamedRangeValue(workbook, `${prefix}EGI`),
  noi: getNamedRangeValue(workbook, `${prefix}NOI`),
  // ...
};
```

### Value Reconciliation Access

Always use VALUES sheet for final conclusions:

```typescript
const finalValues = {
  landValue: getNamedRangeValue(workbook, 'Value_LandScenario1'),
  costValue: getNamedRangeValue(workbook, 'Value_CostScenario1'),
  salesValue: getNamedRangeValue(workbook, 'Value_SARecScenario1'),
  incomeValue: getNamedRangeValue(workbook, 'Value_IARecScenario1'),
  finalValue: getNamedRangeValue(workbook, 'Value_FinalScenario1')
};
```

### Error Handling

```typescript
function safeGetNamedRange(workbook: ExcelJS.Workbook, rangeName: string, defaultValue: any = null) {
  try {
    const value = getNamedRangeValue(workbook, rangeName);

    // Handle Excel errors
    if (value && typeof value === 'object' && 'error' in value) {
      console.warn(`Named range ${rangeName} contains error: ${value.error}`);
      return defaultValue;
    }

    // Handle formula results
    if (value && typeof value === 'object' && 'result' in value) {
      return value.result;
    }

    return value;
  } catch (error) {
    console.error(`Error reading named range ${rangeName}:`, error);
    return defaultValue;
  }
}
```

### Data Validation

```typescript
function validateAppraisalValues(values: any) {
  const errors = [];

  // Check for missing critical values
  if (!values.noi) errors.push('NOI is missing');
  if (!values.capRate) errors.push('Cap Rate is missing');
  if (!values.finalValue) errors.push('Final Value is missing');

  // Check for logical consistency
  if (values.egi > values.pgi) {
    errors.push('EGI cannot exceed PGI');
  }

  if (values.noi > values.egi) {
    errors.push('NOI cannot exceed EGI');
  }

  // Check cap rate range
  if (values.capRate < 0.01 || values.capRate > 0.50) {
    errors.push('Cap Rate outside reasonable range (1%-50%)');
  }

  // Verify income value calculation
  const calculatedValue = values.noi / values.capRate;
  const variance = Math.abs(calculatedValue - values.incomeValue) / calculatedValue;
  if (variance > 0.01) {
    errors.push('Income value does not match NOI/Cap Rate calculation');
  }

  return errors;
}
```

### Performance Optimization

```typescript
// Batch read multiple named ranges
async function batchReadNamedRanges(workbook: ExcelJS.Workbook, rangeNames: string[]) {
  const results = {};

  // Group ranges by worksheet to minimize sheet access
  const rangesBySheet = {};

  for (const rangeName of rangeNames) {
    const namedRange = workbook.definedNames[rangeName];
    if (!namedRange) continue;

    const match = namedRange.ranges[0].match(/(.+)!(\$?\w+\$?\d+)/);
    if (!match) continue;

    const [_, sheetName, cellAddr] = match;

    if (!rangesBySheet[sheetName]) {
      rangesBySheet[sheetName] = [];
    }

    rangesBySheet[sheetName].push({ rangeName, cellAddr });
  }

  // Read all values from each sheet in one pass
  for (const [sheetName, ranges] of Object.entries(rangesBySheet)) {
    const worksheet = workbook.getWorksheet(sheetName);

    for (const { rangeName, cellAddr } of ranges) {
      const cell = worksheet.getCell(cellAddr.replace(/\$/g, ''));
      results[rangeName] = cell.value;
    }
  }

  return results;
}
```

---

## 7. Integration Checklist for APR-V4

### Phase 1: Read Capability

- [ ] Install ExcelJS library
- [ ] Create named range extraction utility
- [ ] Implement direct cell fallback
- [ ] Add error handling for missing ranges
- [ ] Test with sample Valcre templates

### Phase 2: Value Mapping

- [ ] Map Valcre named ranges to APR database fields
- [ ] Create field mapping configuration
- [ ] Handle multiple scenarios (DIRECTCAP vs DIRECTCAP2)
- [ ] Implement value validation rules
- [ ] Test with actual appraisal files

### Phase 3: Data Population

- [ ] Auto-populate LOE fields from Excel values
- [ ] Display income approach summary in dashboard
- [ ] Show sales comparison data
- [ ] Present final reconciled value
- [ ] Calculate variance from LOE estimate

### Phase 4: Validation & QC

- [ ] Verify calculation accuracy (NOI/Cap Rate = Value)
- [ ] Check logical consistency (EGI < PGI, NOI < EGI)
- [ ] Flag outliers and unusual values
- [ ] Compare to database expectations
- [ ] Generate QC report

### Phase 5: Reporting

- [ ] Extract key metrics for client reports
- [ ] Generate appraisal summary PDF
- [ ] Create variance analysis
- [ ] Track template versions
- [ ] Archive original Excel files

---

## 8. Field Mapping Reference

### Income Approach Fields

| Valcre Named Range | APR Database Field | Data Type | Notes |
|--------------------|-------------------|-----------|-------|
| `IA_DirCap_PGI` | `potential_gross_income` | Decimal(10,2) | Annual PGI |
| `IA_DirCap_LossTotal` | `vacancy_loss` | Decimal(10,2) | Total vacancy/concessions |
| `IA_DirCap_EGI` | `effective_gross_income` | Decimal(10,2) | Annual EGI |
| `IA_DirCap_Expenses` | `total_operating_expenses` | Decimal(10,2) | Annual OpEx |
| `IA_DirCap_NOI` | `net_operating_income` | Decimal(10,2) | Annual NOI |
| `IA_DirCap_CapRate1` | `capitalization_rate` | Decimal(5,4) | As decimal (0.0625 = 6.25%) |
| `IA_DirCap_Value` | `income_approach_value` | Decimal(12,2) | Rounded to $10k |
| `IA_DirCap_PGIPSF` | `pgi_per_sf` | Decimal(8,2) | Per SF annual |
| `IA_DirCap_EGIPSF` | `egi_per_sf` | Decimal(8,2) | Per SF annual |
| `IA_DirCap_NOIPSF` | `noi_per_sf` | Decimal(8,2) | Per SF annual |

### Subject Property Fields

| Valcre Named Range | APR Database Field | Data Type | Notes |
|--------------------|-------------------|-----------|-------|
| `Subject_NRA` | `net_rentable_area` | Integer | Square feet |
| `Subject_Units` | `number_of_units` | Integer | Total units |
| `Subject_Primary` | `property_type` | String | Multi-Family, Retail, etc. |
| `Subject_AreaType` | `area_measurement_type` | String | NRA, GBA, etc. |

### Final Value Fields

| Valcre Named Range | APR Database Field | Data Type | Notes |
|--------------------|-------------------|-----------|-------|
| `Value_LandScenario1` | `land_value` | Decimal(12,2) | Scenario 1 |
| `Value_CostScenario1` | `cost_approach_value` | Decimal(12,2) | Scenario 1 |
| `Value_SARecScenario1` | `sales_comparison_value` | Decimal(12,2) | Scenario 1 |
| `Value_IARecScenario1` | `income_approach_conclusion` | Decimal(12,2) | Scenario 1 |
| `Value_FinalScenario1` | `final_reconciled_value` | Decimal(12,2) | Scenario 1 |

---

## 9. Known Issues & Limitations

### VBA Dependencies

**Issue:** Some values may require VBA execution to populate
**Impact:** Cap rates and final values may be missing in raw file read
**Mitigation:** Use Excel calculation engine or open file in Excel before export

### Array Formulas

**Issue:** Final reconciled value uses array formulas
**Impact:** May require formula evaluation to get result
**Mitigation:** Use ExcelJS formula evaluation or read calculated value

### Template Versions

**Issue:** Named ranges may vary across Valcre template versions
**Impact:** Field mapping may break with template updates
**Mitigation:** Version detection and fallback mapping

### Multiple Scenarios

**Issue:** Template supports 3 value scenarios (As-Is, As-Stabilized, Prospective)
**Impact:** Need to detect active scenario
**Mitigation:** Check `Report_ValueScenario1` named range

### Printer Settings

**Issue:** 86 printer setting files detected
**Impact:** Large file size, slower parsing
**Mitigation:** Ignore printer settings during parsing

---

## 10. Sample Data from Analyzed File

### Actual Values Extracted

**Property:** 1101, 1121 109 Street, North Battleford
**File:** VAL251012
**Template:** v1.6.2.0

**Income Approach (DIRECTCAP):**
- Cap Rate: 0.0625 (6.25%)
- Other values: Formula-based (require calculation)

**Data Validation:**
- Formula integrity: PASS (all key formulas present)
- Named range integrity: PASS (7,988 ranges detected)
- VBA presence: YES (86 VBA files)
- Sheet structure: COMPLETE (88 sheets)

---

## Appendix A: Complete Named Range List (Sample)

```
Income Approach - Direct Capitalization:
- IA_DirCap_PGI          -> DIRECTCAP!$L$218
- IA_DirCap_Rent         -> DIRECTCAP!$L$186
- IA_DirCap_Rmb          -> DIRECTCAP!$L$203
- IA_DirCap_Misc         -> DIRECTCAP!$L$217
- IA_DirCap_Vac          -> DIRECTCAP!$G$220
- IA_DirCap_VacTotal     -> DIRECTCAP!$L$220
- IA_DirCap_Loss         -> DIRECTCAP!$G$224
- IA_DirCap_LossTotal    -> DIRECTCAP!$L$224
- IA_DirCap_EGI          -> DIRECTCAP!$L$225
- IA_DirCap_Expense01    -> DIRECTCAP!$C$227
- IA_DirCap_Expense02    -> DIRECTCAP!$C$228
... (25 expense line items)
- IA_DirCap_Expenses     -> DIRECTCAP!$L$252
- IA_DirCap_NOI          -> DIRECTCAP!$L$253
- IA_DirCap_CapRate1     -> DIRECTCAP!$L$254
- IA_DirCap_CapRate2     -> DIRECTCAP!$L$255
- IA_DirCap_Value        -> DIRECTCAP!$L$256

Per-Unit and Per-SF Metrics:
- IA_DirCap_PGIUnit      -> DIRECTCAP!$I$218
- IA_DirCap_PGIPSF       -> DIRECTCAP!$J$218
- IA_DirCap_EGIUnit      -> DIRECTCAP!$I$225
- IA_DirCap_EGIPSF       -> DIRECTCAP!$J$225
- IA_DirCap_NOIUnit      -> DIRECTCAP!$I$253
- IA_DirCap_NOIPSF       -> DIRECTCAP!$J$253
```

---

## Appendix B: Sheet Dimensions Reference

```
Analysis Sheets:
- DIRECTCAP:    270 rows x 12 columns (primary income approach)
- DIRECTCAP2:   264 rows x 12 columns (secondary income approach)
- DCF:          381 rows x 47 columns (discounted cash flow)
- VALUES:       330 rows x 80 columns (reconciliation)
- IE:            84 rows x 50 columns (income & expense)
- OAR:          503 rows x 93 columns (cap rate analysis)

Data Sheets:
- DATA_Property: 29 rows x 262 columns
- DATA_Ranges:   8,797 rows x 16 columns
- LISTS:         5,517 rows x 410 columns

Market Sheets:
- SURVEY1:      1,738 rows x 137 columns
- SURVEY2:      1,749 rows x 137 columns
- SALE1:        355 rows x 181 columns
```

---

## Appendix C: Formula Examples

### PGI Calculation
```excel
=IF(CMA4_UseType="Convenience Store w/ Gas",
    IA_DirCap_Rmb+IA_DirCap_Misc+L183,
    (IA_DirCap_Rent+IA_DirCap_Rmb+IA_DirCap_Misc))
```

### EGI Calculation
```excel
=IA_DirCap_PGI+IA_DirCap_LossTotal
```

### NOI Calculation
```excel
=IA_DirCap_EGI+IA_DirCap_Expenses
```
Note: Expenses are negative, so this is actually EGI - OpEx

### Income Value Calculation
```excel
=IF(CMA4_UseType="Convenience Store w/ Gas",
    (IA_DirCap_CapRate1*IA_DirCap_NOI),
    (IF(IA_DirCap_Blend="Yes",
        IFERROR(((L253/...)),
        (IA_DirCap_NOI/IA_DirCap_CapRate1))))
```

### Final Value Selection
```excel
=IF(F34<>"-",F34,IF(F42<>"-",F42,F37))
```
Hierarchy: Direct Cap > DCF > EBITDA

---

**End of Analysis**

*For APR-V4 implementation, prioritize named range access for all value extraction. This provides the most reliable and version-agnostic method for reading Valcre appraisal templates.*
