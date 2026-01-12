# Sales Comparables Data Mapping
## Missing Data Fields Analysis

**Date:** 2025-12-08
**Project:** APR Dashboard Report Builder v3
**Purpose:** Identify missing sales comparable data for North Battleford test data

---

## Executive Summary

**CRITICAL GAP IDENTIFIED:** The test data file (`northBattlefordTestData.ts`) contains ZERO sales comparable data, despite the store definition having complete field structures for 3 comparable sales.

- **Store Definition:** Has complete field structures for 3 comparables (comp1, comp2, comp3)
- **Test Data:** Has ZERO comparable sale entries
- **Impact:** Sales Comparison section will render empty/incomplete in reports

---

## 1. Sales Comparables Fields Structure

### Current Store Definition (EXISTS)

The store (`reportBuilderStore.ts`) defines the following structure for each comparable:

#### Subsection: `sale-comp-1`, `sale-comp-2`, `sale-comp-3`

Each comparable has these fields:

| Field ID | Label | Type | Input Type | Calculated? |
|----------|-------|------|------------|-------------|
| `compN-name` | Property Name | text | user-input | No |
| `compN-address` | Address | text | user-input | No |
| `compN-sale-date` | Sale Date | date | user-input | No |
| `compN-sale-price` | Sale Price | number | user-input | No |
| `compN-units` | Units | number | user-input | No |
| `compN-price-per-unit` | Price/Unit | calculated | auto-filled | **YES** |
| `compN-gba` | GBA (SF) | number | user-input | No |
| `compN-price-per-sf` | Price/SF | calculated | auto-filled | **YES** |
| `compN-year` | Year Built | number | user-input | No |
| `compN-cap-rate` | Cap Rate (%) | number | user-input | No |

**Note:** N = 1, 2, 3 for the three comparables

---

## 2. Missing Data Fields

### Test Data File: `northBattlefordTestData.ts`

**Current Status:** Lines 269-275 contain ONLY subject property data:

```typescript
// SALES COMPARISON (SALES) - CURRENT STATE
'subject-num-units': 16,
'subject-gba': 10204,
'subject-year-built': 1970,
'subject-site-area': 24400,
'subject-parking-ratio': 1.5,
'subject-condition': 'Average',
```

**MISSING:** All 3 comparable sale entries (approximately 30 data points total)

---

## 3. Required Data Fields for Each Comparable

Based on typical multi-family appraisal practice and store field structure:

### COMPARABLE SALE 1

**Basic Information:**
- `comp1-name`: Property name/identifier (e.g., "Northview Apartments")
- `comp1-address`: Full street address
- `comp1-sale-date`: Transaction date (format: YYYY-MM-DD)
- `comp1-sale-price`: Actual sale price ($)

**Property Characteristics:**
- `comp1-units`: Number of residential units
- `comp1-gba`: Gross Building Area (square feet)
- `comp1-year`: Year of construction

**Financial Metrics:**
- `comp1-cap-rate`: Capitalization rate (%)

**Calculated Fields (auto-computed):**
- `comp1-price-per-unit`: Sale price ÷ units (calculated by system)
- `comp1-price-per-sf`: Sale price ÷ GBA (calculated by system)

### COMPARABLE SALE 2

(Same structure as Comparable 1, with `comp2-` prefix)

### COMPARABLE SALE 3

(Same structure as Comparable 1, with `comp3-` prefix)

---

## 4. Additional Missing Fields (Optional Enhancement)

Based on comprehensive appraisal practice, consider adding:

### Property Details (per comparable)
- `compN-property-type`: Property type/format (e.g., "Lowrise Walkup")
- `compN-stories`: Number of stories
- `compN-site-area`: Land area (SF)
- `compN-parking-spaces`: Number of parking spaces
- `compN-parking-ratio`: Parking ratio (spaces/unit)
- `compN-condition`: Overall condition rating

### Location/Quality Adjustments
- `compN-location-adjustment`: Location quality adjustment (+/-)
- `compN-age-adjustment`: Age/condition adjustment (+/-)
- `compN-size-adjustment`: Size/scale adjustment (+/-)
- `compN-total-adjustment`: Total net adjustment (%)
- `compN-adjusted-price-per-unit`: Adjusted price per unit ($)
- `compN-adjusted-price-per-sf`: Adjusted price per SF ($)

### Additional Information
- `compN-photo`: Comparable property image (image)
- `compN-distance`: Distance from subject (miles)
- `compN-verification-source`: Data source/verification method
- `compN-comments`: Appraiser notes/commentary (textarea)
- `compN-noi`: Net Operating Income ($) - if income approach comparison
- `compN-financing-terms`: Special financing or concessions

---

## 5. Field Naming Convention

### Established Pattern (DO NOT CHANGE)

**Current Pattern:**
```
comp[N]-[field-name]
```

**Examples:**
- `comp1-sale-price`
- `comp2-units`
- `comp3-cap-rate`

**DO NOT USE:**
- `sale-1-price` (incorrect)
- `comparable-1-price` (incorrect)
- `sale1-price` (incorrect)

---

## 6. Data Source Classification

### Field Input Types (per store definition)

| Input Type | Description | Fields |
|------------|-------------|--------|
| `user-input` | Appraiser manually enters | Most fields (name, address, sale date, price, units, GBA, year, cap rate) |
| `auto-filled` | System could pull from Valcre/MLS (future) | Currently none defined |
| `calculated` | Computed by system | `price-per-unit`, `price-per-sf` |

### Recommended Source Priority

**Primary Sources:**
1. Local MLS/Real Estate Boards
2. CoStar/Real Capital Analytics
3. Valcre workbook historical data
4. Public records/tax assessor
5. Broker confirmation

**Data Verification:**
- All sale data should be verified with buyer, seller, or broker
- Public record verification recommended
- Document verification source in field: `compN-verification-source`

---

## 7. Sample Data Template

### Comparable Sale 1 - Example Data Structure

```typescript
// COMPARABLE SALE 1
'comp1-name': 'Riverside Manor Apartments',
'comp1-address': '905 103 St, North Battleford, SK',
'comp1-sale-date': '2024-03-15',
'comp1-sale-price': 1650000,
'comp1-units': 14,
'comp1-gba': 8960,
'comp1-year': 1968,
'comp1-cap-rate': 6.5,
// Calculated fields (auto-computed by system)
'comp1-price-per-unit': 117857, // calc: 1650000 / 14
'comp1-price-per-sf': 184.15,   // calc: 1650000 / 8960
```

### Comparable Sale 2 - Example Data Structure

```typescript
// COMPARABLE SALE 2
'comp2-name': 'Parkview Terrace',
'comp2-address': '1420 98 St, North Battleford, SK',
'comp2-sale-date': '2023-11-08',
'comp2-sale-price': 1925000,
'comp2-units': 18,
'comp2-gba': 11520,
'comp2-year': 1972,
'comp2-cap-rate': 6.2,
// Calculated fields (auto-computed by system)
'comp2-price-per-unit': 106944, // calc: 1925000 / 18
'comp2-price-per-sf': 167.10,   // calc: 1925000 / 11520
```

### Comparable Sale 3 - Example Data Structure

```typescript
// COMPARABLE SALE 3
'comp3-name': 'Century Plaza',
'comp3-address': '802 105 St, North Battleford, SK',
'comp3-sale-date': '2024-06-22',
'comp3-sale-price': 1550000,
'comp3-units': 15,
'comp3-gba': 9600,
'comp3-year': 1975,
'comp3-cap-rate': 6.8,
// Calculated fields (auto-computed by system)
'comp3-price-per-unit': 103333, // calc: 1550000 / 15
'comp3-price-per-sf': 161.46,   // calc: 1550000 / 9600
```

---

## 8. Other Missing Data Sections

### Photos Section - STATUS: ADEQUATE
- **Current:** 32 photo fields with captions
- **Status:** Well-populated

### Calculator (CALC) Section - STATUS: ADEQUATE
- **Current:** Unit mix (4 unit types), income, expenses
- **Status:** Well-populated

### Site Section - STATUS: ADEQUATE
- **Current:** 14 fields including area, adjacencies, characteristics
- **Status:** Well-populated

### Improvements (IMPV) Section - STATUS: ADEQUATE
- **Current:** 31 fields covering building details
- **Status:** Well-populated

### Income/Reconciliation Sections - STATUS: MINIMAL
- These sections have basic value conclusions but limited narrative support

---

## 9. Implementation Priority

### CRITICAL (Must Have)
1. **Add 3 comparable sales** with core 10 fields each
   - Priority: **IMMEDIATE**
   - Impact: Sales Comparison section completely non-functional without this

### HIGH (Should Have)
2. **Add photo fields** for each comparable (`compN-photo`)
   - Priority: **HIGH**
   - Impact: Visual comparison impossible without images

3. **Add location data** (`compN-distance` from subject)
   - Priority: **HIGH**
   - Impact: Important context for comparability

### MEDIUM (Nice to Have)
4. **Add adjustment fields** for analytical purposes
   - Priority: **MEDIUM**
   - Impact: Enhanced analysis capability

5. **Add narrative fields** (`compN-comments`)
   - Priority: **MEDIUM**
   - Impact: Better appraiser documentation

---

## 10. Data Collection Requirements

### For North Battleford Test Data

**Market:** North Battleford, Saskatchewan, Canada
**Property Type:** Multi-family residential (2-story walkup)
**Subject:** 16 units, 10,204 SF GBA, built 1970

**Search Criteria for Comparables:**
- **Location:** Within 5 miles of subject
- **Property Type:** Multi-family residential (8-24 units preferred)
- **Sale Date:** Within 24 months (2023-2025)
- **Building Type:** Low-rise walkup or similar
- **Condition:** Average to good
- **Sale Type:** Arms-length transaction (non-distress)

**Minimum Data Required:**
- Verified sale price
- Sale date
- Physical characteristics (units, GBA, year built)
- Location address
- Cap rate (if available) or NOI data

---

## 11. Field Mapping to Test Data File

### Recommended Addition Location

**File:** `src/features/report-builder/data/northBattlefordTestData.ts`
**Insert After:** Line 275 (after subject property data)

**Current Structure (lines 269-275):**
```typescript
// SALES COMPARISON (SALES)
'subject-num-units': 16,
'subject-gba': 10204,
'subject-year-built': 1970,
'subject-site-area': 24400,
'subject-parking-ratio': 1.5,
'subject-condition': 'Average',
```

**ADD IMMEDIATELY AFTER (suggested):**
```typescript
// COMPARABLE SALE 1
'comp1-name': '[Data Needed]',
'comp1-address': '[Data Needed]',
'comp1-sale-date': '[Data Needed]',
'comp1-sale-price': 0,
'comp1-units': 0,
'comp1-gba': 0,
'comp1-year': 0,
'comp1-cap-rate': 0,

// COMPARABLE SALE 2
'comp2-name': '[Data Needed]',
[... repeat structure ...]

// COMPARABLE SALE 3
'comp3-name': '[Data Needed]',
[... repeat structure ...]
```

---

## 12. Calculation Formulas

### Automated Calculations (DO NOT manually enter)

**Price Per Unit:**
```
compN-price-per-unit = compN-sale-price / compN-units
```

**Price Per Square Foot:**
```
compN-price-per-sf = compN-sale-price / compN-gba
```

**System Behavior:**
- These fields are marked as `type: 'calculated'`
- Values are auto-computed when input fields change
- DO NOT include in test data (system will calculate)

---

## 13. Validation Rules

### Required Fields (per comparable)
- `compN-sale-price` > 0
- `compN-units` > 0
- `compN-gba` > 0
- `compN-sale-date` must be valid date format

### Optional But Recommended
- `compN-name` (for identification)
- `compN-address` (for location context)
- `compN-year` (for age comparison)
- `compN-cap-rate` (for income approach validation)

### Data Quality Checks
- Sale price should be reasonable ($50k - $5M range typical)
- Price per unit should align with market ($60k-$150k typical for this market)
- Price per SF should align with market ($100-$250/SF typical)
- Cap rate should be reasonable (4%-9% typical)

---

## 14. Next Steps

### Immediate Actions Required

1. **Obtain Comparable Sales Data**
   - Contact local MLS/brokers in North Battleford, SK
   - Research CoStar or similar databases
   - Verify sales with public records

2. **Populate Test Data File**
   - Add 3 complete comparable sales
   - Use realistic data from actual market
   - Verify calculations work correctly

3. **Test Rendering**
   - Verify Sales Comparison section renders properly
   - Check that calculated fields compute correctly
   - Validate HTML output format

4. **Documentation**
   - Document data sources
   - Note any data limitations
   - Update test data readme

---

## 15. Store Field Mapping Reference

### Test Data Field ID → Store Field ID

**Subject Property (already mapped):**
- `subject-num-units` → `subject-units`
- `subject-year-built` → `subject-year`
- (others map directly)

**Comparable Sales (NEW - need to be added):**
- All `compN-*` fields map directly to store
- No field name translation needed
- Just need to ADD the data

---

## 16. Notes & Assumptions

### Assumptions Made
1. Store definition is CORRECT and COMPLETE
2. Three comparables are sufficient (industry standard is 3-5)
3. Field naming convention is established and should not change
4. Calculated fields work automatically in the system

### Known Limitations
1. Reference HTML is image-based (hard to extract text data)
2. Actual comparable sales data must be researched separately
3. No existing template data to reference
4. Market data for North Battleford may require specialized research

### Data Privacy Considerations
- Ensure comparable sales data is from public sources
- Verify permission to use proprietary data (MLS, CoStar, etc.)
- Consider anonymizing property names if needed for testing

---

## Document Metadata

- **Author:** Data Analysis Agent
- **Version:** 1.0
- **Last Updated:** 2025-12-08
- **Related Files:**
  - `/src/features/report-builder/data/northBattlefordTestData.ts`
  - `/src/features/report-builder/store/reportBuilderStore.ts`
  - `/src/features/report-builder/types/reportBuilder.types.ts`

---

## Appendix A: Complete Field List

### All 30 Required Data Points (3 comparables × 10 fields)

```typescript
// COMPARABLE SALE 1 (10 fields)
comp1-name, comp1-address, comp1-sale-date, comp1-sale-price,
comp1-units, comp1-price-per-unit, comp1-gba, comp1-price-per-sf,
comp1-year, comp1-cap-rate

// COMPARABLE SALE 2 (10 fields)
comp2-name, comp2-address, comp2-sale-date, comp2-sale-price,
comp2-units, comp2-price-per-unit, comp2-gba, comp2-price-per-sf,
comp2-year, comp2-cap-rate

// COMPARABLE SALE 3 (10 fields)
comp3-name, comp3-address, comp3-sale-date, comp3-sale-price,
comp3-units, comp3-price-per-unit, comp3-gba, comp3-price-per-sf,
comp3-year, comp3-cap-rate
```

**Note:** `compN-price-per-unit` and `compN-price-per-sf` are CALCULATED - do not manually enter.

**Total Manual Data Entry Required:** 24 fields (30 total - 6 calculated)

---

END OF DOCUMENT
