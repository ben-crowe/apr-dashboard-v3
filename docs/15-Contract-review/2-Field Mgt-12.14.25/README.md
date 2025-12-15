# Reference Field Mapping - Dec 11 Work (VERIFIED)

**Created:** November-December 2025
**Status:** ✅ TRUSTED - Use these as source of truth
**Purpose:** Complete field mapping between Valcre workbook and React app

---

## The Four Key Files

### 1. 2-FIELD-MAPPING.md (Original Field Map Table)
**Date:** November 22, 2025
**Source:** Manual analysis of VAL251012 reference report
**Naming:** `snake_case` (e.g., `cover_propertyType`, `income_pgi`)
**Content:** 500+ fields organized by report section

**What it contains:**
- Field ID (snake_case)
- Field Name (human readable)
- Type (Text, Number, Currency, Date, etc.)
- Example values from reference report
- Notes/context

**Use this for:** Understanding what fields exist in the final report

---

### 2. 3-EXCEL-ANALYSIS.md (Workbook Analysis)
**Date:** November 29, 2025
**Source:** Automated extraction of VAL251012.xlsm workbook
**Naming:** Valcre named ranges (PascalCase with underscores)
**Content:** 7,988 named ranges from workbook

**Critical findings:**
- VBA macros present (86 files)
- Most calculations are formula-based
- Named ranges provide reliable data access
- Calculation locations documented

**Key named range patterns:**
- `IA_DirCap_*` - Income Approach Direct Capitalization
- `Value_*` - Final reconciled values
- `Subject_*` - Subject property data
- `IA_DCF_*` - Discounted Cash Flow
- `L_*` - List/lookup values

**Use this for:** Understanding workbook structure and where data comes from

---

### 3. 4-FIELD-RECONCILIATION.md (Three-Way Mapping)
**Date:** December 11, 2025
**Source:** Cross-reference of workbook → 2-FIELD-MAPPING → fieldRegistry
**Content:** Authoritative mapping showing naming convention differences

**The three naming systems:**
| Source | Convention | Example |
|--------|------------|---------|
| Valcre Workbook | PascalCase_Underscore | `IA_DirCap_PGI` |
| 2-FIELD-MAPPING | snake_case | `income_pgi` |
| fieldRegistry.ts | kebab-case | `calc-pgr` |

**Sections covered:**
- Income Approach Calculations
- Reconciliation & Final Value
- Subject Property Data
- Cover Page & Identification
- Site Details
- Tax Assessment
- Improvements
- Zoning

**Use this for:** Mapping workbook field names to registry field IDs

---

### 4. MASTER-FIELD-DIRECTORY.md (Complete Workbook Inventory)
**Date:** December 6, 2025
**Source:** Automated extraction of all 7,967 named ranges
**Content:** Every field in the Valcre workbook organized by sheet

**Statistics:**
- Total fields: 7,967
- Input fields (user-entered): 4,016
- Calculated fields (formula): 3,951
- Sheets with fields: 88

**Major sections:**
- LISTS (502 fields)
- RENT1-4 (391-329 fields each)
- HOME (365 fields)
- SITE (189 fields)
- IMPV (206 fields)
- DIRECTCAP (150 fields)
- And 70+ more sheets...

**Use this for:** Finding any workbook field by searching keywords

---

## How These Files Work Together

### Workflow: Workbook → Report

```
1. Valcre Workbook (Excel)
   └─ Named Range: IA_DirCap_PGI
       ↓
2. 2-FIELD-MAPPING.md (Design Spec)
   └─ Field ID: income_pgi
       ↓
3. 4-FIELD-RECONCILIATION.md (Mapping Table)
   └─ Maps: IA_DirCap_PGI → income_pgi → calc-pgr
       ↓
4. fieldRegistry.ts (Code)
   └─ Registry ID: calc-pgr
       ↓
5. Template (Rendering)
   └─ getFieldValue(sections, 'calc-pgr')
```

### Example: Finding a Field

**Question:** "Where is Potential Gross Income in the workbook?"

1. **Search MASTER-FIELD-DIRECTORY.md** for "PGI"
   - Find: `IA_DirCap_PGI` at `DIRECTCAP!L218`

2. **Check 3-EXCEL-ANALYSIS.md** for details
   - Type: Formula
   - Formula: `=IF(CMA4_UseType="Convenience Store w/ Gas"...`

3. **Check 4-FIELD-RECONCILIATION.md** for mapping
   - Valcre: `IA_DirCap_PGI`
   - 2-FIELD-MAPPING: `income_pgi`
   - fieldRegistry: `calc-pgr`
   - Status: MISMATCH (uses "pgr" vs "pgi")

4. **Use in code:**
   ```typescript
   getFieldValue(sections, 'calc-pgr')
   ```

---

## The ~41 Missing Fields Problem ✅ VERIFIED

**Original Goal:** Add 41 missing fields to fieldRegistry.ts
**Verification Complete:** December 14, 2025
**Actual Missing:** 27 fields (14 were already mapped in Dec 11 work)

### Verification Results

**Original breakdown:**
- Site fields: 9 fields → **3 actually missing** (6 already mapped)
- Frontage/traffic: 12 fields → **12 still missing** (0 mapped)
- Inspection: 7 fields → **7 still missing** (0 mapped)
- Zoning: 5 fields → **3 still missing** (1 mapped, 1 uncertain)
- Other: 8 fields → **5 still missing** (2 mapped, 1 uncertain)

**Total: 27 truly missing fields** (see [41-FIELD-VERIFICATION-REPORT.md](../field-verification-2025-12-13/41-FIELD-VERIFICATION-REPORT.md))

### Already Mapped in Dec 11 Work (14 fields)

These were already completed:
- `site-total-area`, `site-acreage`, `adjacent-north/south/east/west`, `site-rating`
- `permitted-uses` (zoning)
- `easements`, `extraordinary-assumptions`

**Key Insight:** The Gemini "273 missing fields" report was incorrect. The real number was 41, and Dec 11 work already completed 14 of them, leaving 27 to add.

---

## Status of Dec 11 Work

**What's complete:**
✅ Income Approach calculations mapped
✅ Reconciliation values mapped
✅ Cover page fields mapped
✅ Some site fields mapped (total area, acreage, adjacent properties)
✅ Zoning fields partially mapped (4 of 5)

**What's incomplete:**
❌ Site characteristic fields (corner, grade, quality ratings)
❌ Frontage/traffic fields
❌ Inspection fields (dates, inspectors, roles)
❌ Some photo caption fields
❌ Some narrative/boilerplate text fields

---

## Next Steps ✅ UPDATED

1. ✅ **Verify the 41 missing fields list** - COMPLETE (see 41-FIELD-VERIFICATION-REPORT.md)
2. ✅ **Cross-check against 4-FIELD-RECONCILIATION.md** - COMPLETE (27 truly missing)
3. **For the 27 unmapped fields:**
   - [ ] Check if in MASTER-FIELD-DIRECTORY.md (workbook field → needs mapping)
   - [ ] If NOT in workbook → boilerplate (hardcode in template)
   - [ ] Prioritize by category: Site (3) → Frontage (12) → Inspection (7) → Zoning (3) → Misc (5)
4. **Add missing fields** to fieldRegistry.ts using vibe coding workflow (WRAP-UP-WORKFLOW-VIBE-CODING.md)

---

## Files NOT to Use

⚠️ **field-verification-2025-12-13/** - Dec 13-14 work based on Gemini's incorrect "273 missing fields" report. Contains duplicate/incorrect analysis.

✅ **Use this folder instead** - Verified Dec 11 work with correct field mappings.

---

**These files are your source of truth. Trust them.**
