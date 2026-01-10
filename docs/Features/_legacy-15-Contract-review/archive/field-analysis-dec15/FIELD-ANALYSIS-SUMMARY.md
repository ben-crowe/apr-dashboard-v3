# Field Comparison Analysis Summary

**Date:** 2025-12-15
**Analyst:** Backend Developer Agent
**Purpose:** Compare Word HTML template fields against fieldRegistry.ts schema

---

## Executive Summary

### Critical Finding: 100% Naming Convention Mismatch

The Word HTML template and fieldRegistry.ts use **completely different naming conventions**, resulting in a 0% direct match rate despite both containing comprehensive field sets.

**Word HTML Convention:** `PascalCase_Underscore`
Examples: `Client_Name`, `Subject_PropertyName`, `Report_Date`, `IA_DirCap`

**fieldRegistry.ts Convention:** `kebab-case`
Examples: `client-company`, `property-name`, `report-date`, `calc-noi`

---

## Quantitative Analysis

| Metric | Count | Notes |
|--------|-------|-------|
| **Word HTML Unique Fields** | 169 | Extracted from 4-page sample document |
| **fieldRegistry.ts Fields** | 519 | Complete application schema |
| **Direct Matches** | 0 | Due to naming convention difference |
| **Word HTML Pages Analyzed** | 4 | Cover, Transmittal, TOC, Sample content |
| **Field Instances Found** | 261 | Many fields repeat across pages |

---

## Field Distribution by Page

### Page 1 - Cover Page (37 fields)
**Field Categories:**
- **Appraiser Fields (4):** `Appraiser1_Email`, `Appraiser1_Name`, `Appraiser1_Signature`, `Appraiser1_Title`
- **Client Fields (6):** `Client_Name`, `Client_Company`, `Client_Address`, etc.
- **Company Fields (5):** `Company_Name`, `Company_Address`, `Company_Phone`, etc.
- **Report Metadata (8):** `Report_Date`, `Report_Date1`, `Report_Values`, `Report_ValueSummary`, etc.
- **Subject Property (10):** `Subject_PropertyName`, `Subject_Street`, `Subject_City`, `Subject_State`, etc.
- **Executive Summary (2):** `Exec_Summary1`, `Exec_Summary2`
- **Legal/Conditions (2):** `Report_Extraordinary`, `Report_Hypothetical`, `Report_LimCond`

### Page 2 - Transmittal Letter (4 fields)
- `Map_Aerial`
- `Report_Extraordinary`
- `Report_Hypothetical`
- `Report_LimCond`

### Page 3 - Table of Contents (34 fields)
**Key Categories:**
- Report configuration fields (scope, approaches, valuation types)
- Subject property identifiers
- Client information
- Maps (Regional, Local)
- Date fields
- Market/submarket fields

### Page 4 - Content Sample (132 fields)
**Comprehensive field set including:**
- **Income Approach (22 fields):** `IA_DirCap`, `IA_OARConclusion`, `IA_UM_UnitMix`, etc.
- **Sales Approach (14 fields):** `SA1_Conclusion`, `SA1_PSFAvg`, `SA1_Map`, etc.
- **Subject Analysis (70 fields):** `Subject_Zoning`, `Subject_Condition`, `Subject_Parking`, etc.
- **Site Description (11 fields):** `Site_Summary`, `Site_Streets`, adjacency fields
- **Improvement Details (1 field):** `Impv_Summary`
- **Report Values (14 fields):** `Report_ValuationIncome`, `Report_Reconciliation`, etc.

---

## Field Naming Pattern Analysis

### Word HTML Patterns

**Prefix Categories:**
1. **Appraiser1_** - Appraiser information (4 fields)
2. **Client_** - Client details (6 fields)
3. **Company_** - Appraisal company info (5 fields)
4. **Exec_** - Executive summary (2 fields)
5. **IA_** - Income Approach analysis (22 fields)
6. **Impv_** - Improvement details (1 field)
7. **Map_** - Map images (3 fields)
8. **Report_** - Report metadata/config (30 fields)
9. **SA1_** - Sales Approach (14 fields)
10. **SU1_** - Sales/Subject comparison? (4 fields)
11. **Site_** - Site characteristics (4 fields)
12. **Subject_** - Subject property details (70 fields)
13. **Tax_** - Tax information (1 field)
14. **W_** - Word/grammar helpers (5 fields)
15. **Zone_** - Zoning details (1 field)

### fieldRegistry.ts Patterns

**Prefix Categories:**
1. **intake-** - Initial data collection (18 fields)
2. **client-** - Client information (6 fields)
3. **appraiser-** - Appraiser details (13 fields)
4. **loe-** - Letter of Engagement (11 fields)
5. **property-** - Property identifiers (6 fields)
6. **site-** - Site characteristics (13 fields)
7. **impv-** - Improvement details (12 fields)
8. **zoning-** - Zoning information (7 fields)
9. **market-** - Market analysis (11 fields)
10. **calc-** - Calculated fields (70 fields)
11. **income-** - Income approach (5 fields)
12. **sales-** - Sales approach (2 fields)
13. **recon-** - Reconciliation (9 fields)
14. **cert-** - Certification (14 fields)
15. **img-** - Image references (40 fields)
16. **comp1/2/3-** - Comparable sales (30 fields)
17. **survey1/2/3/4/5-** - Rental surveys (120 fields)

---

## Semantic Mapping Candidates

### Likely Matches (Semantic Equivalence)

| Word HTML Field | fieldRegistry.ts Field | Confidence |
|----------------|----------------------|-----------|
| `Client_Name` | `client-contact-name` | High |
| `Client_Company` | `client-company` | High |
| `Client_Address` | `client-address` | High |
| `Subject_PropertyName` | `property-name` | High |
| `Subject_Street` | `street-address` | High |
| `Subject_City` | `city` | High |
| `Subject_State` | `province` | High |
| `Subject_YearBuilt` | `year-built` | High |
| `Company_Name` | `appraiser-company` | High |
| `Company_Phone` | `appraiser-phone` | High |
| `Company_Address` | `appraiser-address` | High |
| `Report_Date` | `report-date` | High |
| `Map_Aerial` | `img-map-aerial-1` | Medium |
| `Map_Regional` | `img-map-regional` | High |
| `Map_Local` | `img-map-local` | High |
| `Subject_Zoning` | `zoning-classification` | Medium |
| `Subject_ZoningCode` | `zoning-classification` | Medium |
| `Subject_Parking` | `parking-spaces` | Medium |
| `Subject_TotalSF` | `gba` | Medium |
| `Subject_TotalAcre` | `site-acreage` | Medium |

### Fields Unique to Word HTML (No Clear Registry Match)

**Income Approach Analysis:**
- `IA_DirCap`, `IA_DirCapVacancy`, `IA_DirCap_EGRComment`
- `IA_OARComps`, `IA_OARConclusion`, `IA_OARNOI`
- `IA_UM_UnitMix`, `IA_UM_RentRoll`, `IA_UM_CvM`
- `IA_ExpConclusions`, `IA_IncConclusions`

**Sales Approach Analysis:**
- `SA1_Conclusion`, `SA1_Summary`, `SA1_Map`
- `SA1_PSFAvg`, `SA1_PSFHigh`, `SA1_PSFLow`
- `SA1_FinalPSFAvg`, `SA1_FinalPSFHigh`, `SA1_FinalPSFLow`
- `SA1_UoC`, `SA1_MktAdj`, `SA1_SPAdjUnadj`

**Report Configuration:**
- `Report_Approaches`, `Report_ApproachesApplied`
- `Report_ValuationIncome`, `Report_ValuationSales`, `Report_ValuationCost`
- `Report_ReconIncome`, `Report_ReconSales`
- `Report_Reconciliation`, `Report_ValueSummary`

**Subject Property Details:**
- `Subject_HBUImproved`, `Subject_HBUVacant`
- `Subject_FunctionalDesign`, `Subject_InteriorBuildout`
- `Subject_ProjectAmenities`, `Subject_UnitAmenities`
- `Subject_SiteConclusion`, `Subject_ZoningConclusion`

**Word/Grammar Helpers:**
- `W_I.We`, `W_My.Our`, `W_Noun.s`, `W_ExistingProposed`, `W_ProposedYesNo`

### Fields Unique to fieldRegistry.ts (No Word HTML Equivalent)

**Calculated Fields (70):**
- `calc-noi`, `calc-egr`, `calc-pgr`, `calc-cap-rate`
- `calc-expenses-total`, `calc-vacancy-rate`
- `calc-avg-rent-per-unit`, `calc-value-per-sf`
- All calc- prefixed fields appear to be programmatically generated

**Rental Survey Fields (120):**
- `survey1-name` through `survey5-year-built`
- Detailed comparable rental property data
- Not explicitly shown in 4-page Word HTML sample

**Comparable Sales (30):**
- `comp1-address` through `comp3-year`
- Sales comparison data structure
- Not explicitly shown in 4-page Word HTML sample

**Image References (40):**
- `img-exterior-1` through `img-unit-6`
- `img-map-aerial-1`, `img-site-plan-1`, etc.
- UI-specific image management fields

**Intake/Workflow Fields (18):**
- `intake-client-first-name`, `intake-property-type`
- Pre-report data collection fields
- Not part of final report output

---

## Key Insights

### 1. Different Abstraction Levels

**Word HTML:** Report output focused
- Fields represent final report sections/values
- Includes narrative fields (`_Conclusion`, `_Summary`)
- Includes approach-specific calculations (`IA_`, `SA1_`)

**fieldRegistry.ts:** Application data focused
- Fields represent raw data inputs
- Includes workflow/intake fields
- Includes UI-specific fields (images, calculations)
- More granular breakdown (separate first/last name vs. full name)

### 2. Calculated vs. Stored Fields

**Word HTML appears to store:**
- Final calculated values (`IA_DirCap`, `SA1_PSFAvg`)
- Narrative conclusions (`Subject_SiteConclusion`)
- Summary tables (`Report_ValueSummary`)

**fieldRegistry.ts explicitly tracks:**
- Calculation inputs (raw data)
- Calculation outputs (prefixed with `calc-`)
- Clear separation between source data and derived values

### 3. Missing Cross-References

Neither system has:
- A canonical mapping between naming conventions
- Field ID to field name translation table
- Documentation of semantic equivalence

---

## Recommendations

### Immediate Actions

1. **Create Field Mapping Table**
   - Map Word HTML field names to fieldRegistry.ts IDs
   - Document semantic equivalence
   - Identify fields with no match (need to be added)

2. **Determine Source of Truth**
   - Is Word HTML the authoritative template?
   - Should fieldRegistry.ts be updated to match?
   - Or should a translation layer be created?

3. **Add Missing Fields to Registry**
   - 169 Word HTML fields have no clear registry match
   - Prioritize by usage frequency in reports
   - Consider whether to:
     - Add as new fields (with kebab-case names)
     - Create aliases (both naming conventions supported)
     - Build a translation layer

### Strategic Considerations

1. **Naming Convention Standardization**
   - Choose one convention for future fields
   - Create conversion utilities for legacy support
   - Document convention in style guide

2. **Field Categorization**
   - Word HTML uses prefix-based organization
   - Consider adopting similar structure in registry
   - Group related fields explicitly

3. **Narrative vs. Data Fields**
   - Word HTML has many `_Conclusion`, `_Summary` fields
   - These may be rich text/narrative content
   - Registry may need `type: 'richtext'` or `type: 'narrative'`

4. **Approach-Specific Fields**
   - Income Approach (`IA_`) has 22 dedicated fields
   - Sales Approach (`SA1_`) has 14 dedicated fields
   - Consider namespace structure in registry

---

## Next Steps

### Phase 1: Analysis & Mapping
1. Extract complete field list from full Word HTML document (not just 4 pages)
2. Create comprehensive mapping table
3. Identify truly missing fields vs. naming differences
4. Categorize fields by type (data, calculated, narrative, UI)

### Phase 2: Schema Alignment
1. Decide on unified naming convention
2. Add genuinely missing fields to fieldRegistry.ts
3. Create field aliases or translation layer
4. Update documentation

### Phase 3: Testing & Validation
1. Test report generation with aligned schema
2. Verify all Word HTML fields can be populated
3. Validate calculations match expected values
4. Cross-reference with Valcre API field mappings

---

## Technical Artifacts

**Generated Files:**
- `/Users/bencrowe/Development/APR-Dashboard-v3/scripts/compare-word-html-fields.py`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/FIELD-COMPARISON-REPORT.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/FIELD-ANALYSIS-SUMMARY.md` (this file)

**Source Files:**
- Word HTML: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.html`
- Field Registry: `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts`

**Re-run Comparison:**
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
python3 scripts/compare-word-html-fields.py
```

---

**Analysis Complete**
For questions or clarifications, refer to the detailed comparison report or re-run the analysis script with updated parameters.
