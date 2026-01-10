# Executive Summary Pages 6-8: Data Mapping Status

**Last Updated:** 2025-12-12
**Commit:** ff9e14d

---

## PAGE 6: Property Overview Tables

### ✅ FULLY DATA-CONNECTED

All 4 tables on Page 6 use `renderExecSection(execSection)` which pulls data via `getGlobalFieldValue()` from reportHtmlTemplate.ts:5030-5304.

**Tables:**
1. PROPERTY IDENTIFICATION (6 rows)
2. SITE DESCRIPTION (7 rows)
3. IMPROVEMENT DESCRIPTION (14 rows)
4. QUALITATIVE ANALYSIS (7 rows)

**Data Flow:** 100% connected to actual field data.

---

## PAGE 7: Summary & Conclusion Tables

### ⚠️ PARTIALLY DATA-CONNECTED

| Table | Field | Status | Variable | Field ID | Fallback Value |
|-------|-------|--------|----------|----------|----------------|
| **HIGHEST & BEST USE** | | | | | |
| | Proposed Construction | 🔴 HARDCODED | — | — | "No" |
| | As Though Vacant | 🔴 HARDCODED | — | — | "Multifamily" |
| | As Improved | 🔴 HARDCODED | — | — | "Multifamily" |
| **EXPOSURE & MARKETING TIME** | | | | | |
| | Exposure Time | ✅ DATA | `exposureTime` | `exposure-time` | "Six Months" |
| | Marketing Time | ✅ DATA | `marketingTime` | `marketing-time` | "Six Months" |
| **INVESTMENT INDICATORS** | | | | | |
| | Current Occupancy | ✅ DATA | `occupancyRate` | `occupancy-rate` | "100" |
| | Stabilized Occupancy | 🔴 HARDCODED | — | — | "96.16%" |
| | Stabilized Vacancy & Credit Loss | 🔴 HARDCODED | — | — | "3.84%" |
| | SF Multifamily | ✅ DATA | `totalNra` | `total-nra` | "10,204" |
| | Occupied MF Units | ✅ DATA | `totalUnits` | `total-units` | "16" |
| | Vacant MF Units | 🔴 HARDCODED | — | — | "0" |
| | Current Rent/MF Units | 🔴 HARDCODED | — | — | "$1,015" |
| | Concluded Rent/MF Units | 🔴 HARDCODED | — | — | "$1,020" |
| | Expense Ratio | 🔴 HARDCODED | — | — | "+3.09%" |
| | Capitalization Rate (OAR) | 🔴 HARDCODED | — | — | "6.25%" |
| **VALUE CONCLUSION** | | | | | |
| | Valuation Scenarios | 🔴 HARDCODED | — | — | "AS STABILIZED" |
| | Interest | ✅ DATA | `propertyRights` | `property-rights` | "Fee Simple Estate" |
| | Exposure Time | ✅ DATA | `exposureTime` | `exposure-time` | "Six Months" |
| | Effective Date | ✅ DATA | `formatDate(valuationDate)` | `valuation-date` | "October 17, 2025" |
| | Cost Approach | 🔴 HARDCODED | — | — | "Not Presented" |
| | Direct Comparison Approach | ✅ DATA | `finalValue` | `concluded-value` | "$1,800,000" |
| | Income Approach | ✅ DATA | `finalValue` | `concluded-value` | "$1,800,000" |
| | FINAL VALUE CONCLUSION | ✅ DATA | `finalValue` | `concluded-value` | "$1,800,000" |

---

## PAGE 8: Hypothetical Conditions & Assumptions

### ✅ FULLY DATA-CONNECTED

| Section | Status | Variable | Field ID | Fallback |
|---------|--------|----------|----------|----------|
| Hypothetical Conditions | ✅ DATA | `hypotheticalConditions` | `hypothetical-conditions` | Default text |
| Extraordinary Assumptions | ✅ DATA | `extraordinaryAssumptions` | `extraordinary-assumptions` | "No Extraordinary Assumptions..." |
| Extraordinary Limiting Conditions | ✅ DATA | `extraordinaryLimitingConditions` | `extraordinary-limiting-conditions` | "No Extraordinary Limiting Conditions..." |

---

## SUMMARY

**Page 6:** ✅ 100% data-connected (via renderExecSection)
**Page 7:** ⚠️ 60% data-connected (12 of 20 fields)
**Page 8:** ✅ 100% data-connected

---

## REQUIRED FIXES FOR FULL DATA CONNECTION

To make Page 7 100% data-driven, add these field lookups at reportHtmlTemplate.ts:87-92:

```typescript
// HIGHEST & BEST USE fields
const hbuProposedConstruction = getFieldValue(execSection, 'hbu-proposed-construction') || 'No';
const hbuAsThoughVacant = getFieldValue(execSection, 'hbu-as-though-vacant') || 'Multifamily';
const hbuAsImproved = getFieldValue(execSection, 'hbu-as-improved') || 'Multifamily';

// INVESTMENT INDICATORS fields
const stabilizedOccupancy = getFieldValue(execSection, 'stabilized-occupancy') || '96.16';
const stabilizedVacancy = getFieldValue(execSection, 'stabilized-vacancy') || '3.84';
const vacantUnits = getFieldValue(execSection, 'vacant-units') || '0';
const currentRentPerUnit = getFieldValue(execSection, 'current-rent-per-unit') || '1015';
const concludedRentPerUnit = getFieldValue(execSection, 'concluded-rent-per-unit') || '1020';
const expenseRatio = getFieldValue(execSection, 'expense-ratio') || '3.09';
const capRate = getFieldValue(execSection, 'cap-rate') || '6.25';

// VALUE CONCLUSION fields
const valuationScenario = getFieldValue(execSection, 'value-scenario') || 'AS STABILIZED';
const costApproachValue = getFieldValue(execSection, 'cost-approach-value') || 'Not Presented';
```

Then update Page 7 template to use these variables instead of hardcoded strings.

---

## TESTING INSTRUCTIONS

**To verify data flow:**

1. Open Report Builder
2. Go to Executive Summary section (S0)
3. Set test values for:
   - `exposure-time`: "Three Months"
   - `marketing-time`: "Four Months"
   - `concluded-value`: "2500000"
4. Preview report - should see test values on Page 7
5. Export PDF - verify values appear correctly

**Fields that WON'T change (hardcoded):**
- HIGHEST & BEST USE (all 3 rows)
- Stabilized Occupancy/Vacancy
- Rent amounts
- Expense Ratio
- Cap Rate

---

**Status:** PARTIAL - Page 7 needs additional field mapping for full data connection.
