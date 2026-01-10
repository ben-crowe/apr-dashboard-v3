# Field Registry Validation Report

**Date:** December 22, 2025
**Purpose:** Validate existing fieldRegistry.ts (889 fields) against VALCRE-TO-TEMPLATE-CROSSWALK.md
**Registry Agent:** Validation of Valcre field mappings

---

## Executive Summary

**Current State:**
- fieldRegistry.ts: 889 total fields
- Valcre-related fields: ~140 (calc-*, subject-*, value-*)
- Crosswalk expectations: ~350 mapped fields
- **Gap**: ~210 fields need to be added

**Field Categories in Registry:**
1. **TDD/Intake fields** (intake-*, loe-*): ~70 fields - V3 Dashboard data
2. **Image fields** (img-*): ~40 fields - S3 image management
3. **Calc engine fields** (calc-*): 127 fields - Direct Capitalization
4. **Subject property** (subject-*): 13 fields - Property basics
5. **Value fields** (value-*): ~5 fields - Value conclusions
6. **Other** (company-*, client-*, etc.): ~200 fields

---

## 1. VALIDATION RESULTS

### 1.1 Key Calc Engine Fields ✅

**CONFIRMED - Core fields exist:**

| Crosswalk Expected | Registry Has | Status | Notes |
|--------------------|--------------|--------|-------|
| `calc-pgi` | `calc-pgr` | ⚠️ NAME VARIANT | PGI = PGR (Potential Gross Income = Potential Gross Revenue) |
| `calc-egr` | `calc-egr` | ✅ EXACT MATCH | Effective Gross Revenue |
| `calc-noi` | `calc-noi` | ✅ EXACT MATCH | Net Operating Income |
| `calc-pgi-perunit` | `calc-pgr-per-unit` | ⚠️ NAME VARIANT | Per unit calculation |
| `calc-pgi-psf` | `calc-pgr-per-sf` | ⚠️ NAME VARIANT | Per SF calculation |

**VERDICT**: Core calc engine fields exist, but use PGR instead of PGI terminology. Both are correct.

---

### 1.2 Subject Property Fields Status

**Registry Count:** 13 subject-* fields
**Crosswalk Count:** ~80+ Subject_* mappings
**Gap:** ~67 missing subject property fields

**Existing in Registry:**
```bash
subject-buildings
subject-floors
subject-gba
subject-nra
subject-propertyname
subject-street
subject-streetnumber
subject-streetname
subject-units
# + 4 more
```

**Missing from Registry (High Priority):**
```
subject-city        → city (crosswalk maps to 'city', not 'subject-city')
subject-geocode     → geocode
subject-county      → county
subject-msa         → msa
subject-occupancy   → occupancy-rate
subject-year-built  → year-built
subject-quality     → quality
subject-condition   → condition
subject-parking     → parking
# + 58 more subject fields
```

---

### 1.3 Naming Convention Analysis

**Crosswalk Pattern:** Most subject fields drop the `subject-` prefix
```
Subject_City     → city          (NOT subject-city)
Subject_County   → county        (NOT subject-county)
Subject_MSA      → msa           (NOT subject-msa)
Subject_Geocode  → geocode       (NOT subject-geocode)
```

**But some keep it:**
```
Subject_NRA            → subject-nra
Subject_GBA            → subject-gba
Subject_PropertyName   → subject-propertyname
Subject_Units          → subject-units
```

**Rule Appears To Be:**
- **Keep prefix** when field is unique to subject property (NRA, GBA, Units, Buildings)
- **Drop prefix** when field is generic/shared (city, county, quality, condition)

**Registry Currently Has:** Mix of both patterns, mostly keeping prefix

---

### 1.4 Direct Capitalization Field Coverage

**Registry Has:** 127 calc-* fields
**Crosswalk Expects:** ~80 dircap-* or calc-* fields

**Coverage Analysis:**

| Category | Expected (Crosswalk) | Found (Registry) | Status |
|----------|---------------------|------------------|--------|
| Unit Mix (calc-type1-*, calc-type2-*) | 9 fields × 3 types = 27 | 30+ | ✅ COVERED |
| Revenue (calc-pgr, calc-egr, calc-noi) | 15 fields | ~10 | ⚠️ GAPS |
| Expenses (calc-exp-*) | 35 fields (7 cat × 5 metrics) | 35 | ✅ COVERED (Session 28) |
| Vacancy/Loss | 10 fields | TBD | ❓ NEEDS CHECK |
| Cap Rate/Value | 10 fields | ~5 | ⚠️ GAPS |

**Missing Direct Cap Fields (Priority):**
```
dircap-rent-total          → calc-pgr-rent? (may exist with different name)
dircap-reimb-total         → calc-reimb? (needs verification)
dircap-misc-total          → calc-misc? (needs verification)
dircap-vacancy-pct         → calc-vacancy-rate? (needs verification)
dircap-caprate1            → calc-cap-rate? (needs verification)
dircap-blend               → MISSING (high priority)
```

---

## 2. RECOMMENDED ACTIONS

### Priority 1: CRITICAL GAPS (Add Immediately)

**Missing Core Calc Fields (~10 fields):**
```typescript
// High-priority Direct Cap fields from crosswalk
'dircap-blend'              // Blended cap rate
'dircap-caprate1'           // Primary cap rate
'dircap-caprate2'           // Secondary cap rate
'dircap-vacancy-total'      // Vacancy dollar loss
'dircap-concession-total'   // Concession loss
'dircap-loss-total'         // Total loss dollars
```

### Priority 2: SUBJECT PROPERTY BASICS (~20 fields)

**Essential property identification:**
```typescript
// Drop subject- prefix per crosswalk convention
'city'                  // Subject_City
'city-formal'           // Subject_CityFormal
'province'              // Subject_State
'province-abbrev'       // Subject_ST
'postal-code'           // Subject_Zip
'county'                // Subject_County
'msa'                   // Subject_MSA
'geocode'               // Subject_Geocode
'year-built'            // Subject_YearBuilt
'quality'               // Subject_Quality
'condition'             // Subject_Condition
'occupancy-rate'        // Subject_Occupancy
'parking'               // Subject_Parking
```

### Priority 3: VALUE CONCLUSION (~10 fields)

**Value scenario fields:**
```typescript
'value-scenario1'       // Value_Scenario1
'value-scenario2'       // Value_Scenario2
'value-scenario3'       // Value_Scenario3
'value-perunit'         // Value per unit
'value-persf'           // Value per SF
```

---

## 3. NAMING INCONSISTENCY FINDINGS

### Issue 1: PGI vs PGR Terminology

**Crosswalk uses:** PGI (Potential Gross Income)
**Registry uses:** PGR (Potential Gross Revenue)
**Resolution:** Both are correct. Consider aliasing or accept as equivalent.

**Examples:**
- Crosswalk: `calc-pgi` → Registry: `calc-pgr` ✅ OK
- Crosswalk: `calc-pgi-perunit` → Registry: `calc-pgr-per-unit` ✅ OK

### Issue 2: Subject Prefix Inconsistency

**Crosswalk pattern:** Drop prefix for generic fields
**Registry pattern:** Keep prefix for most fields

**Resolution:** Follow crosswalk convention - only keep `subject-` for unique identifiers

### Issue 3: Dircap vs Calc Prefix

**Crosswalk uses both:**
- `dircap-*` for Direct Cap specific fields
- `calc-*` for calculated totals/results

**Registry uses:** Mostly `calc-*` for everything

**Resolution:** This is OK - `calc-` is more general and works for all calculations

---

## 4. VALIDATION METHODOLOGY

### How This Report Was Created

**Step 1:** Extract all field IDs from fieldRegistry.ts
```bash
grep -o "id: '[^']*'" fieldRegistry.ts | cut -d"'" -f2 > registry-fields.txt
```

**Step 2:** Compare against crosswalk JSON
```bash
jq -r '.subject_property | to_entries[] | .value' crosswalks/valcre_template_crosswalk.json
```

**Step 3:** Identify gaps
- Fields in crosswalk but NOT in registry = MISSING
- Fields in registry but NOT in crosswalk = OK (TDD/custom fields)

**Step 4:** Categorize by priority
- Priority 1: Calc engine fields (critical for reports)
- Priority 2: Subject property basics (used on multiple pages)
- Priority 3: Value conclusions (final report output)

---

## 5. NEXT STEPS

### Immediate Actions (Today)

1. ✅ Complete this validation report
2. ⏳ Create priority field addition list from gap analysis
3. ⏳ Add Priority 1 fields (10 critical calc fields)
4. ⏳ Add Priority 2 fields (20 subject property basics)

### Short-Term (This Week)

5. Add Priority 3 fields (value conclusions)
6. Verify all 127 existing calc-* fields map correctly
7. Check for duplicate mappings
8. Update crosswalk with actual registry field names

### Long-Term (Next Session)

9. Add remaining 150+ subject property fields
10. Add sales comp fields (comp1-*, comp2-*, etc.)
11. Add rental comp fields (rental-comp1-*, etc.)
12. Complete 100% coverage of priority crosswalk fields

---

## 6. STATISTICS SUMMARY

| Metric | Count |
|--------|-------|
| **Total Registry Fields** | 889 |
| **Valcre-Related Fields** | ~140 |
| **TDD/Intake Fields** | ~70 |
| **Image Management Fields** | ~40 |
| **Calc Engine Fields** | 127 |
| **Subject Property Fields** | 13 |
| **Crosswalk Mapped Fields** | ~350 |
| **Missing from Registry** | ~210 |
| **Priority 1 Missing** | 10 |
| **Priority 2 Missing** | 20 |
| **Priority 3 Missing** | 10 |
| **Total Priority Gap** | 40 |

---

## 7. VALIDATION STATUS BY CATEGORY

| Category | Expected | Found | Gap | Coverage % |
|----------|----------|-------|-----|------------|
| Subject Property | 80 | 13 | 67 | 16% |
| Direct Capitalization | 80 | 127 | +47 | 159% (over) |
| Sales Comparison | 60 | 0 | 60 | 0% |
| Rental Comparison | 50 | 0 | 50 | 0% |
| Value Conclusion | 30 | 5 | 25 | 17% |
| Executive Summary | 40 | ~10 | 30 | 25% |
| **TOTAL PRIORITY** | **340** | **155** | **185** | **46%** |

**Note:** Direct Cap shows 159% because registry has many granular fields (calc-type1-*, calc-type2-*, calc-exp-*) that may map to fewer crosswalk fields.

---

## 8. RECOMMENDED FIELD ADDITIONS

### Add These 10 Fields First (Priority 1)

```typescript
// In fieldRegistry.ts

// Blended cap rate (HIGH PRIORITY)
{
  id: 'dircap-blend',
  storeId: 'dircap-blend',
  label: 'Cap Rate Blend',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'percentage',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_Blend'
},

// Primary cap rate
{
  id: 'dircap-caprate1',
  storeId: 'dircap-caprate1',
  label: 'Capitalization Rate 1',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'percentage',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_CapRate1'
},

// Secondary cap rate
{
  id: 'dircap-caprate2',
  storeId: 'dircap-caprate2',
  label: 'Capitalization Rate 2',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'percentage',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_CapRate2'
},

// Vacancy total
{
  id: 'dircap-vacancy-total',
  storeId: 'dircap-vacancy-total',
  label: 'Vacancy Total',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'currency',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_VacancyTotal'
},

// Concession total
{
  id: 'dircap-concession-total',
  storeId: 'dircap-concession-total',
  label: 'Concession Total',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'currency',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_ConcessionTotal'
},

// Total loss dollars
{
  id: 'dircap-loss-total',
  storeId: 'dircap-loss-total',
  label: 'Total Loss',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'currency',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_LossTotal'
},

// Rent total (verify if calc-pgr-rent exists)
{
  id: 'dircap-rent-total',
  storeId: 'dircap-rent-total',
  label: 'Total Rental Revenue',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'currency',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_Rent'
},

// Reimbursement total
{
  id: 'dircap-reimb-total',
  storeId: 'dircap-reimb-total',
  label: 'Reimbursement Total',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'currency',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_Rmb'
},

// Misc income total
{
  id: 'dircap-misc-total',
  storeId: 'dircap-misc-total',
  label: 'Miscellaneous Income Total',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'currency',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_Misc'
},

// Expense ratio
{
  id: 'dircap-expense-ratio',
  storeId: 'dircap-expense-ratio',
  label: 'Expense Ratio',
  section: 'calc',
  subsection: 'calc-direct-cap',
  type: 'percentage',
  inputSource: 'calculated',
  required: false,
  valcreRange: 'IA_DirCap_ExpenseRatio'
}
```

---

**Validation Complete**
**Next Action:** Create priority field addition list and begin adding fields with atomic commits.
