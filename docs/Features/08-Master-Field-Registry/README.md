# Master Field Registry

**Phase Type**: Foundation Work Block
**Status**: COMPLETE (Reference Only)
**Created**: 2026-01-09
**Completed**: 2026-01-09
**Last Reorganized**: 2026-01-12

---

## Phase Summary

This phase created comprehensive INPUT → OUTPUT field mappings for all calculator sections. The work documented here enabled the v3.0 template and store updates.

**Key Deliverable**: 218 unique fields documented and verified across 4 valuation approaches.

---

## Current File Structure

```
08-Master-Field-Registry/
├── README.md                              # This file
├── 00-START-HERE.md                       # ✨ Entry point - START HERE
├── 01-MASTER-FIELD-REFERENCE-INDEX.md     # Complete index & navigation
├── 02-METHODOLOGY-AND-ORGANIZATION.md     # Phase 16 methodology & structure
│
├── 03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md # 58 fields (29 in, 29 out)
├── 04-SALES-COMPARISON-INPUT-OUTPUT-MAP.md # 115 fields (77 in, 38 out)
├── 05-COST-APPROACH-INPUT-OUTPUT-MAP.md   # 31 fields (17 in, 14 out)
├── 06-RECONCILIATION-INPUT-OUTPUT-MAP.md  # 14 fields (7 in, 7 out)
│
├── 07-FIELD-ALIGNMENT-VERIFICATION.md     # Master cross-verification
├── 08-VALCRE-WORKBOOK-INCOME-STRUCTURE.md # Valcre workbook reference
├── 09-REGISTRY-GUIDE.md                   # 🔧 Master registry reference (search methods, field management)
│
├── Valcre-Integration/                    # Valcre API field mapping docs
│   ├── 1-API-FIELD-MAPPING-REFERENCE.md
│   ├── 5-FIELD-MAPPING-ASSUMPTIONS.md
│   ├── 6-CUSTOM-FIELDS-ANALYSIS.md
│   ├── PROPERTY-TYPE-FIELD-MAPPING.md
│   ├── README.md
│   └── VALCRE-API-INTEGRATION-GUIDE.md
│
└── archive/                               # Historical docs (completed work)
    ├── 00-PASSOVER-SESSION.md
    ├── 07-TEMPLATE-PAGES-ANALYSIS.md
    ├── Calculator-Field-Reference (1).html
    ├── FIELD-REGISTRY-GUIDE.md            # Moved to 07-Template-Management
    ├── PARKING-LAUNDRY-CALCULATION-HISTORY.md
    ├── PROPERTYTYPE-FIX-APPLIED.md
    ├── PROPERTYTYPE-MULTISELECT-FINDINGS.md
    └── PROPERTYTYPE-PROPERTYCONTACT-FINDINGS.md
```

---

## Field Statistics Summary

| Approach | Input Fields | Output Fields | Total |
|----------|--------------|---------------|-------|
| Income | 29 | 29 | 58 |
| Sales Comparison | 77 | 38 | 115 |
| Cost | 17 | 14 | 31 |
| Reconciliation | 7 | 7 | 14 |
| **Total** | **130** | **88** | **218** |

---

## How to Use This Folder

### 🎯 START HERE
- **New to fields?** → `00-START-HERE.md` (entry point) → `01-MASTER-FIELD-REFERENCE-INDEX.md` (complete index)
- **Adding a field?** → `09-REGISTRY-GUIDE.md` (registry guide, search methods)
- **Finding a field?** → `03-06` docs (by approach) or `09-REGISTRY-GUIDE.md` (search commands)

### For Field Reference
- **Which field goes where?** → `03-06` docs for detailed INPUT/OUTPUT tables with calculation formulas
- **Verifying alignment?** → `07` for cross-section dependencies and alignment verification
- **Searching registry?** → `09-REGISTRY-GUIDE.md` for grep commands and search methods

### For Registry Management
- **Adding new fields** → `09-REGISTRY-GUIDE.md` → "Adding a New Field"
- **Searching registry** → `09-REGISTRY-GUIDE.md` → "Validation Commands"
- **Understanding structure** → `09-REGISTRY-GUIDE.md` → "Field Structure"

### For Valcre Integration
- See `Valcre-Integration/` subfolder for API field mapping

### For Historical Context
- See `archive/` for debugging history (PropertyType fixes, etc.)

---

## Relationship to Feature 09: Template Management

**This folder (Feature 08)** focuses on **calculator logic** - HOW calculations work:
- INPUT → OUTPUT mappings
- Calculation formulas
- Cross-section dependencies

**Feature 09: Template Management** focuses on **template integration** - WHERE fields appear:
- Template design standards
- Field registry conventions
- Page-to-field mapping
- Store-to-template pipelines

**See**: `02-METHODOLOGY-AND-ORGANIZATION.md` for detailed explanation of the separation.

**Cross-References**:
- Template field locations: `../09-Template-Management/templates/Template-Page-Field-Mapping.md`
- Field registry conventions: `../09-Template-Management/08-FIELD-REGISTRY-GUIDE.md`
- Design standards: `../09-Template-Management/01-DESIGN-STANDARDS.md`

---

## Phase 16 Outcomes

- All 218 fields verified in `fieldRegistry.ts`
- Cross-section dependencies mapped (Income → Sales → Recon)
- 2 minor issues identified (documented, low impact)
- Foundation laid for v3.0 template updates

---

**Phase Status**: COMPLETE - **MASTER FIELD REFERENCE GUIDE**
**Go-to folder for**: 
- ✅ Complete field mappings (all 218 calculator fields)
- ✅ Registry search methods and validation commands
- ✅ Field management workflows (adding, verifying, updating)
- ✅ Calculation formulas and dependencies
- ✅ Valcre API mapping

---

## Quick Navigation

### 🎯 Master References
- **Entry Point** → `00-START-HERE.md` (START HERE)
- **Complete Index** → `01-MASTER-FIELD-REFERENCE-INDEX.md`
- **Registry Guide** → `09-REGISTRY-GUIDE.md` (search methods, field management)
- **Methodology** → `02-METHODOLOGY-AND-ORGANIZATION.md`

### 📊 Field Mappings
- **Income Approach** → `03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`
- **Sales Comparison** → `04-SALES-COMPARISON-INPUT-OUTPUT-MAP.md`
- **Cost Approach** → `05-COST-APPROACH-INPUT-OUTPUT-MAP.md`
- **Reconciliation** → `06-RECONCILIATION-INPUT-OUTPUT-MAP.md`

### ✅ Verification
- **Field Alignment** → `07-FIELD-ALIGNMENT-VERIFICATION.md`

### 🔗 Related
- **Templates** → `../09-Template-Management/`
- **Valcre Integration** → `Valcre-Integration/`
