<!-- Updated 2026-05-14: field count reframed per _AUDIT-2026-05-14.md §2 -->
# Master Field Registry - START HERE

**Feature**: 08-Master-Field-Registry
**Status**: Active reference — registry receives ongoing updates
**Last Updated**: 2026-01-12

---

## What This Feature Contains

This folder is the deep reference for the **218-field calculator subset** of the APR field registry (Income, Sales, Cost, Reconciliation approaches). The full registry contains **2,082 fields** — see `09-REGISTRY-GUIDE.md` for navigation across the entire registry.

- ✅ **Complete coverage** of the 218 calculator fields
- ✅ **Field mappings** (INPUT → OUTPUT) for all 4 valuation approaches
- ✅ **Calculation formulas** and dependencies
- ✅ **Registry search methods** (grep commands for finding fields)
- ✅ **Field management workflows** (adding, verifying, updating fields)
- ✅ **Valcre API integration** mappings (how calculator fields map to Valcre workbook)

---

## Quick Navigation

### 🎯 Start Here Based on Your Task

| Task | Go To Document |
|------|---------------|
| **New to fields?** | `01-MASTER-FIELD-REFERENCE-INDEX.md` - Complete index |
| **Adding a new calculator field** | `09-REGISTRY-GUIDE.md` → "Adding a New Field" |
| **Finding which field goes where** | `03-06-*-INPUT-OUTPUT-MAP.md` (by approach) |
| **Verifying field exists** | `09-REGISTRY-GUIDE.md` → "Validation Commands" |
| **Understanding calculation formulas** | `03-06-*-INPUT-OUTPUT-MAP.md` (by approach) |
| **Cross-checking dependencies** | `07-FIELD-ALIGNMENT-VERIFICATION.md` |
| **Searching registry** | `09-REGISTRY-GUIDE.md` → "Quick Lookup Commands" |
| **Adding new pages/sections** | `09-REGISTRY-GUIDE.md` → "Adding a New Field" + `03-06` docs |

---

## Field Statistics

**Calculator-Subset Field Count**: 218 fields (verified at time of authoring). Full registry total: 2,082 — see `09-REGISTRY-GUIDE.md`. Note: active inbox work ("VALTA Field Spec — 13 missing fields") means the registry is not frozen.

| Approach | Input Fields | Output Fields | Total |
|----------|--------------|---------------|-------|
| Income | 29 | 29 | 58 |
| Sales Comparison | 77 | 38 | 115 |
| Cost | 17 | 14 | 31 |
| Reconciliation | 7 | 7 | 14 |
| **Total** | **130** | **88** | **218** |

**Registry Status**: All 218 calculator-subset fields verified in `fieldRegistry.ts` (registry total: 2,082).

---

## Document Structure

```
08-Master-Field-Registry/
├── 00-START-HERE.md                         # ✨ You are here
├── 01-MASTER-FIELD-REFERENCE-INDEX.md       # Complete index & navigation
├── 02-METHODOLOGY-AND-ORGANIZATION.md       # Phase 16 methodology
│
├── 03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md   # 58 fields
├── 04-SALES-COMPARISON-INPUT-OUTPUT-MAP.md  # 115 fields
├── 05-COST-APPROACH-INPUT-OUTPUT-MAP.md     # 31 fields
├── 06-RECONCILIATION-INPUT-OUTPUT-MAP.md    # 14 fields
│
├── 07-FIELD-ALIGNMENT-VERIFICATION.md       # Cross-verification (218 fields)
├── 08-VALCRE-WORKBOOK-INCOME-STRUCTURE.md   # Valcre workbook reference
├── 09-REGISTRY-GUIDE.md                     # 🔧 Search methods & workflows
│
├── Valcre-Integration/                     # Valcre API field mappings
└── archive/                                # Historical docs
```

---

## Key Documents

### Master References
- **`01-MASTER-FIELD-REFERENCE-INDEX.md`** - Complete index with task-based navigation
- **`09-REGISTRY-GUIDE.md`** - Registry search methods, validation commands, field management
- **`02-METHODOLOGY-AND-ORGANIZATION.md`** - How Phase 16 work was conducted

### Field Mappings (By Approach)
- **`03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`** - Income Approach (58 fields)
- **`04-SALES-COMPARISON-INPUT-OUTPUT-MAP.md`** - Sales Comparison (115 fields)
- **`05-COST-APPROACH-INPUT-OUTPUT-MAP.md`** - Cost Approach (31 fields)
- **`06-RECONCILIATION-INPUT-OUTPUT-MAP.md`** - Reconciliation (14 fields)

### Verification
- **`07-FIELD-ALIGNMENT-VERIFICATION.md`** - Cross-verification of the 218-field calculator subset

### Integration
- **`Valcre-Integration/`** - Valcre API field mapping documentation

---

## Common Workflows

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

### Finding Which Field Goes Where

1. **Find Field in Approach Docs** (`03-06`)
   - Check INPUT table for user-entered fields
   - Check OUTPUT table for calculated fields
   - See calculation formula and dependencies

2. **Verify Registry** (`09-REGISTRY-GUIDE.md`)
   - Use validation commands to check existence
   - Verify 4-file sync

3. **Check Cross-Section Dependencies** (`07`)
   - See if field depends on other approaches
   - Verify dependencies are valid

### Searching the Registry

**Quick Search Commands** (from `09-REGISTRY-GUIDE.md`):

```bash
# Check if field exists
grep "field-id-name" src/features/report-builder/schema/fieldRegistry.ts

# Find all calculator fields
grep "id: 'calc-" src/features/report-builder/schema/fieldRegistry.ts

# Find all Sales Comparison fields
grep "id: 'comp[1-5]-" src/features/report-builder/schema/fieldRegistry.ts
```

**See**: `09-REGISTRY-GUIDE.md` for complete list of search commands.

---

## Relationship to Other Features

### Feature 09: Template Management

**Feature 08** (This feature) focuses on **calculator logic** - HOW calculations work:
- Field mappings (INPUT → OUTPUT)
- Calculation formulas
- Registry search methods
- Field management workflows

**Feature 09** focuses on **template integration** - WHERE fields appear:
- Template design standards
- Page-to-field mapping
- Store-to-template pipelines

**Both reference the same registry** but from different perspectives.

---

## Related Documentation

- **Field Registry File**: `src/features/report-builder/schema/fieldRegistry.ts`
- **Calculation Functions**: `src/features/report-builder/store/*Calculations.ts`
- **Template File**: `public/Report-MF-template.html`
- **Feature 09**: `../09-Template-Management/`

---

**Status**: ✅ Master Reference Complete
**Go-to folder for**: All field-related work, registry management, field mappings, calculation formulas
