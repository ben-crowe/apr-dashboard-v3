<!-- Updated 2026-05-14: field count reframed per _AUDIT-2026-05-14.md §2 -->
# Master Field Reference Index

**Purpose**: Index for the 218-field calculator subset (Income, Sales, Cost, Reconciliation). Full registry is 2,082 fields — see `09-REGISTRY-GUIDE.md`.
**Status**: Active reference
**Last Updated**: 2026-01-12

---

## QUICK NAVIGATION

### 🎯 Start Here Based on Your Task

| Task | Go To Document |
|------|---------------|
| **Adding a new calculator field** | `09-REGISTRY-GUIDE.md` → "Adding a New Field" |
| **Finding which field goes where** | `03-06-*-INPUT-OUTPUT-MAP.md` (by approach) |
| **Verifying field exists** | `09-REGISTRY-GUIDE.md` → "Validation Commands" |
| **Understanding calculation formulas** | `03-06-*-INPUT-OUTPUT-MAP.md` (by approach) |
| **Cross-checking dependencies** | `07-FIELD-ALIGNMENT-VERIFICATION.md` |
| **Searching registry** | `09-REGISTRY-GUIDE.md` → "Quick Lookup Commands" |
| **Adding new pages/sections** | `09-REGISTRY-GUIDE.md` → "Adding a New Field" + `03-06` docs |

---

## COMPLETE INDEX OF FEATURE 08

### 📋 Core Documentation (Calculator Field Mappings)

#### `00-START-HERE.md`
- **Purpose**: Entry point and quick navigation guide
- **Contains**: Overview, quick navigation, field statistics
- **Use When**: First time visiting this feature

#### `01-MASTER-FIELD-REFERENCE-INDEX.md` (THIS FILE)
- **Purpose**: Master index and navigation guide
- **Contains**: Complete index, quick navigation, task-based routing
- **Use When**: Finding where to look for field information

#### `02-METHODOLOGY-AND-ORGANIZATION.md`
- **Purpose**: Documents Phase 16 methodology and organization structure
- **Contains**: 
  - Step-by-step Phase 16 process
  - Feature 08 vs Feature 09 separation
  - Cross-reference guidelines
  - Recommended workflows
- **Use When**: Understanding how Phase 16 work was conducted

#### `03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`
- **Purpose**: Complete Income Approach field mapping
- **Contains**:
  - 29 INPUT fields (Unit Mix, Other Income, Vacancy, Expenses, Cap Rate, Adjustments)
  - 29 OUTPUT fields (Unit Mix Summary, Revenue, Vacancy, Expenses, NOI, Value)
  - Calculation formulas
  - Example values
  - Dependencies mapped
  - Verification checklist
- **Use When**: Working with Income Approach calculations

#### `04-SALES-COMPARISON-INPUT-OUTPUT-MAP.md`
- **Purpose**: Complete Sales Comparison field mapping
- **Contains**:
  - 77 INPUT fields (Subject property, 5 comparables × 7 fields, 5 comparables × 8 adjustments)
  - 38 OUTPUT fields (Per-comp calculations, adjustments, indicated value)
  - Calculation formulas
  - Example values (5 comparables with adjustments)
  - Cross-section dependencies (Income → Sales)
  - Verification checklist
- **Use When**: Working with Sales Comparison calculations

#### `05-COST-APPROACH-INPUT-OUTPUT-MAP.md`
- **Purpose**: Complete Cost Approach field mapping
- **Contains**:
  - 17 INPUT fields (Land, RCN, Depreciation, Site Improvements)
  - 14 OUTPUT fields (Land value, RCN totals, Depreciation, Site totals, Indicated value)
  - Calculation formulas
  - Example values
  - Sequential dependencies (RCN → Depreciation → Value)
  - Verification checklist
- **Use When**: Working with Cost Approach calculations

#### `06-RECONCILIATION-INPUT-OUTPUT-MAP.md`
- **Purpose**: Complete Reconciliation field mapping
- **Contains**:
  - 7 INPUT fields (Value indications from 3 approaches, weights, narrative)
  - 7 OUTPUT fields (Stored values, weighted values, final reconciled value)
  - Weight auto-adjustment logic
  - Cross-section dependencies (All approaches → Reconciliation)
  - Verification checklist
- **Use When**: Working with Reconciliation calculations

#### `07-FIELD-ALIGNMENT-VERIFICATION.md`
- **Purpose**: Master cross-verification document
- **Contains**:
  - Registry verification (all 218 calculator-subset fields checked; full registry: 2,082)
  - Cross-section dependencies validated
  - Missing fields identified (0 found)
  - Orphaned fields identified (1 found: `cost-depr-physical-age`)
  - Master summary tables
  - Issues log
- **Use When**: Verifying field alignment, checking for gaps

---

### 🔧 Registry & Field Management

#### `08-VALCRE-WORKBOOK-INCOME-STRUCTURE.md`
- **Purpose**: Valcre workbook structure reference
- **Contains**: Valcre API field mapping for Income Approach
- **Use When**: Integrating with Valcre API

#### `09-REGISTRY-GUIDE.md` (Master Registry Reference)
- **Purpose**: Complete guide to field registry structure, search methods, and field management
- **Contains**:
  - Field registry location and structure
  - Field naming conventions (kebab-case)
  - Field types and inputSource types
  - **4-File Sync Requirement** (CRITICAL)
  - **Validation Commands** (grep commands to search registry)
  - **Adding a New Field** (step-by-step process)
  - **Quick Lookup Commands** (search methods)
  - Common registry errors and fixes
  - Template placeholder formats
- **Use When**: 
  - Adding new fields
  - Searching registry
  - Verifying field existence
  - Understanding registry structure

---

### 📊 Reference & Integration


#### `Valcre-Integration/` (Subfolder)
- **Purpose**: Valcre API integration field mapping
- **Contains**:
  - `1-API-FIELD-MAPPING-REFERENCE.md`
  - `5-FIELD-MAPPING-ASSUMPTIONS.md`
  - `6-CUSTOM-FIELDS-ANALYSIS.md`
  - `PROPERTY-TYPE-FIELD-MAPPING.md`
  - `VALCRE-API-INTEGRATION-GUIDE.md`
- **Use When**: Working with Valcre API integration

---

### 📁 Archive (Historical Reference)

#### `archive/00-PASSOVER-SESSION.md`
- **Purpose**: Original Phase 16 handoff instructions
- **Contains**: Mission, methodology, success criteria
- **Use When**: Understanding Phase 16 origins

#### `archive/FIELD-REGISTRY-GUIDE.md`
- **Purpose**: Original registry guide (superseded by `09-REGISTRY-GUIDE.md`)
- **Status**: Historical reference only

#### `archive/07-TEMPLATE-PAGES-ANALYSIS.md`
- **Purpose**: Template page analysis
- **Use When**: Historical reference for template structure

#### `archive/Calculator-Field-Reference (1).html`
- **Purpose**: Visual field reference (HTML)
- **Use When**: Visual reference for field mappings

#### Other Archive Files
- `FIELD-AUDIT-FULL.md`
- `PARKING-LAUNDRY-CALCULATION-HISTORY.md`
- `PROPERTYTYPE-*-FINDINGS.md` (various fixes)

---

## FIELD STATISTICS SUMMARY

### Calculator-Subset Fields Documented: 218 (full registry total: 2,082)

| Approach | Input Fields | Output Fields | Total |
|----------|--------------|---------------|-------|
| Income | 29 | 29 | 58 |
| Sales Comparison | 77 | 38 | 115 |
| Cost | 17 | 14 | 31 |
| Reconciliation | 7 | 7 | 14 |
| **Total** | **130** | **88** | **218** |

### Registry Status
- **Total Registry Fields**: 2,082 fields (verified via `grep -cE "^\s+id: ['\"]" fieldRegistry.ts`)
- **Calculator Fields Documented Here**: 218 fields
- **Registry Coverage**: All documented fields exist in registry ✅

---

## REGISTRY SEARCH METHODS

### Quick Lookup Commands

```bash
# Check if field exists in registry
grep "field-id-name" src/features/report-builder/schema/fieldRegistry.ts

# Check if field has test data
grep "field-id-name" src/features/report-builder/data/TestDataSet1.ts

# Check if field is in template
grep "{{field-id-name}}" public/Report-MF-template.html

# List all sections in registry
grep "section:" src/features/report-builder/schema/fieldRegistry.ts | sort -u

# Count fields per inputSource
grep "inputSource:" src/features/report-builder/schema/fieldRegistry.ts | sort | uniq -c

# Find all image fields
grep "type: 'image'" src/features/report-builder/schema/fieldRegistry.ts

# Find all calculated fields
grep "inputSource: 'calculated'" src/features/report-builder/schema/fieldRegistry.ts | wc -l

# Count all template placeholders
grep -o "{{[^}]*}}" public/Report-MF-template.html | wc -l
```

**See**: `09-REGISTRY-GUIDE.md` for complete search methods and validation commands.

---

## WORKFLOWS

### Adding a New Calculator Field

1. **Document INPUT → OUTPUT mapping** (`03-06` docs)
   - Add to appropriate approach doc
   - Document calculation formula
   - Add example values

2. **Add to Registry** (`09-REGISTRY-GUIDE.md`)
   - Add to `fieldRegistry.ts` (following conventions)
   - Add test value to `TestDataSet1.ts`
   - Add placeholder to template
   - Add to UI component (if user-editable)

3. **Verify Alignment** (`07-FIELD-ALIGNMENT-VERIFICATION.md`)
   - Add field to verification checklist
   - Verify cross-section dependencies
   - Update master summary

### Reviewing Which Field Goes Where

1. **Find Field in Approach Docs** (`03-06`)
   - Check INPUT table for user-entered fields
   - Check OUTPUT table for calculated fields
   - See calculation formula and dependencies

2. **Verify Registry** (`09-REGISTRY-GUIDE.md`)
   - Use validation commands to check existence
   - Verify 4-file sync

3. **Check Cross-Section Dependencies** (`05`)
   - See if field depends on other approaches
   - Verify dependencies are valid

### Adding New Pages/Sections

1. **Plan Field Structure** (`03-06` docs)
   - Determine which approach (Income, Sales, Cost, Recon)
   - Document INPUT → OUTPUT mapping
   - Create example values

2. **Add Fields to Registry** (`09-REGISTRY-GUIDE.md`)
   - Follow naming conventions (kebab-case)
   - Set correct `inputSource` (`user-input` vs `calculated`)
   - Complete 4-file sync

3. **Update Verification** (`05`)
   - Add fields to registry verification
   - Update master summary tables

---

## WHAT'S MISSING / WHAT TO ADD

### ✅ Currently Complete
- INPUT → OUTPUT mappings (all 4 approaches)
- Field alignment verification
- Calculation formulas
- Cross-section dependencies
- Example values

### ✅ Complete
- **Registry Guide with Search Methods** → `09-REGISTRY-GUIDE.md` ✅ **DONE**
- **Complete field registry structure documentation** → `09-REGISTRY-GUIDE.md` ✅
- **4-file sync process documentation** → `09-REGISTRY-GUIDE.md` ✅
- **Field naming conventions reference** → `09-REGISTRY-GUIDE.md` ✅

---

## ✅ MASTER REFERENCE COMPLETE

**Feature 08 is now THE master field reference** that includes:

1. ✅ Calculator field mappings (Docs 03-06) - **DONE**
2. ✅ Field alignment verification (Doc 07) - **DONE**
3. ✅ Registry guide with search methods (`09-REGISTRY-GUIDE.md`) - **DONE**
4. ✅ Methodology documentation (`02`) - **DONE**
5. ✅ Master index (`01`) - **DONE**
6. ✅ Entry point (`00-START-HERE.md`) - **DONE**

**Feature 08 is now the complete master field reference guide** for:
- ✅ Finding which field goes where
- ✅ Adding new fields
- ✅ Searching the registry
- ✅ Verifying field alignment
- ✅ Understanding calculation formulas
- ✅ Managing field registry

---

**Status**: ✅ **MASTER REFERENCE COMPLETE**
**Go-to folder for**: All field-related work, registry management, field mappings
