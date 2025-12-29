# Field Assets Index

**Purpose:** Central index of all field-related assets, patterns, and naming conventions
**Last Updated:** December 16, 2025

---

## 📋 Field Documentation Files

### Core Analysis Files (Existing)

1. **[MASTER-FIELD-DIRECTORY.md](./MASTER-FIELD-DIRECTORY.md)**
   - Complete catalog of 7,967 fields from Word HTML reference
   - Organized by table structure and section
   - Primary source of truth for report output requirements

2. **[DATA-FLOW-SUMMARY.md](./DATA-FLOW-SUMMARY.md)**
   - End-to-end field data flow analysis
   - Tracks: fieldRegistry.ts → Store → Word HTML
   - Coverage analysis and gap identification

3. **[FIELD-ALIGNMENT-REPORT.md](./FIELD-ALIGNMENT-REPORT.md)**
   - Three-way field alignment (Word HTML, Valcre, fieldRegistry)
   - Identifies aligned, partially aligned, unaligned fields
   - Reconciliation recommendations

4. **[FIELD-INPUT-OUTPUT-CLASSIFICATION.md](./FIELD-INPUT-OUTPUT-CLASSIFICATION.md)**
   - Input source classification (user-input, auto-filled, calculated)
   - Calculation dependencies
   - Manual entry requirements

5. **[FIELD-DESTINATION-MAP.md](./FIELD-DESTINATION-MAP.md)**
   - Maps each field to final report location
   - Tracks multiple destinations for shared fields
   - Field transformations and aggregations

6. **[TABLE-FIELD-ANALYSIS.md](./TABLE-FIELD-ANALYSIS.md)**
   - Field groupings within report tables
   - Table layouts and relationships
   - Table-level patterns and dependencies

### New Field Definitions (2025-12-16)

7. **[NEW-FIELDS-Economic-Indicators.md](./NEW-FIELDS-Economic-Indicators.md)** ⭐ NEW
   - Economic indicator table fields (Pages 31-34)
   - 224 placeholder fields: SK, AB, BC, National
   - Valcre workflow documentation
   - Implementation options (image upload vs field-level)

### Reference Documentation

8. **[VALCRE-WORKBOOK-TECHNICAL-GUIDE.md](./VALCRE-WORKBOOK-TECHNICAL-GUIDE.md)**
   - Valcre Excel workbook technical documentation
   - VBA macro analysis
   - Named range catalog (700+ ranges)
   - Formula structure and calculation chains

9. **[REPORT-TABLE-LAYOUTS.md](./REPORT-TABLE-LAYOUTS.md)**
   - Visual table layouts from PDF output
   - Field positioning and alignment specifications
   - Table formatting rules and styles

---

## 🎨 Field Naming Conventions

### Established Patterns

**Property Fields:**
```
Subject_{PropertyAttribute}
Subject_Street, Subject_City, Subject_Subtype, etc.
```

**Company/Client Fields:**
```
Company_{Attribute}
Company_Name, Company_JobNumber, etc.

Client_{Attribute}
Client_Name, Client_Address, etc.
```

**Calculated Fields:**
```
calc-{calculation-type}
calc-noi, calc-egr, calc-cap-rate, calc-grm
```

**Survey/Comparable Fields:**
```
survey{#}-{attribute}
survey1-address, survey1-units, survey1-nra

comp{#}-{attribute}
comp1-gba, comp2-units, comp3-year
```

### New Patterns (Placeholder - Needs Validation)

**Economic Indicators:**
```
{Region}_Econ_Indicator_{Row#}_{Column}

Examples:
SK_Econ_Indicator_1_Name
SK_Econ_Indicator_1_Estimate
SK_Econ_Indicator_1_Commentary
SK_Econ_Indicator_1_Source
```

**Regions:** SK (Saskatchewan), AB (Alberta), BC (British Columbia), National

---

## 📊 Field Statistics

- **Total Fields in Report HTML:** 7,967
- **Fields in fieldRegistry.ts:** ~400+
- **Valcre Named Ranges:** 700+
- **New Economic Indicator Fields:** 224 (placeholder)
- **Data Sources Analyzed:** 3 (Word HTML, Valcre, fieldRegistry)

---

## 🔗 Related Asset Locations

### HTML/CSS Components
**Location:** `/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/`

- **css-components-library.css** - Reusable CSS for field-mapped tables
- **COMPONENT-LIBRARY.md** - Component documentation with field patterns
- **PREVIEW-Master.html** - Live preview with field mapping

### Application Code
**Location:** `/src/features/report-builder/schema/`

- **fieldRegistry.ts** - Application field definitions
- **FieldRegistry.ts** - Field registry service (`/src/components/DocumentBuilder/services/`)

### Field Management Guide
**Location:** `./README.md` (this directory)

Quick reference for finding field documentation

---

## 🎯 How to Use This Index

**Need to find a field?**
1. Check MASTER-FIELD-DIRECTORY.md for Word HTML fields
2. Check fieldRegistry.ts for application fields
3. Check VALCRE-WORKBOOK-TECHNICAL-GUIDE.md for Valcre fields

**Need to create new fields?**
1. Follow naming conventions above
2. Document in NEW-FIELDS-{Category}.md (create if needed)
3. Update this index
4. Add to fieldRegistry.ts
5. Update MASTER-FIELD-DIRECTORY.md

**Need to map field flow?**
1. Check DATA-FLOW-SUMMARY.md for existing flows
2. Check FIELD-DESTINATION-MAP.md for output locations
3. Update alignment in FIELD-ALIGNMENT-REPORT.md

**Need table field patterns?**
1. Check TABLE-FIELD-ANALYSIS.md
2. Check COMPONENT-LIBRARY.md for HTML/CSS patterns
3. Reference existing pages in PREVIEW-Master.html

---

## 📁 File Organization

```
2-Field Management/
├── FIELD-ASSETS-INDEX.md          ← YOU ARE HERE
├── README.md                       ← Quick reference guide
│
├── Core Analysis/
│   ├── MASTER-FIELD-DIRECTORY.md
│   ├── DATA-FLOW-SUMMARY.md
│   ├── FIELD-ALIGNMENT-REPORT.md
│   ├── FIELD-INPUT-OUTPUT-CLASSIFICATION.md
│   ├── FIELD-DESTINATION-MAP.md
│   └── TABLE-FIELD-ANALYSIS.md
│
├── New Field Definitions/
│   └── NEW-FIELDS-Economic-Indicators.md
│
├── Reference/
│   ├── VALCRE-WORKBOOK-TECHNICAL-GUIDE.md
│   └── REPORT-TABLE-LAYOUTS.md
│
└── archive/
    └── [superseded files]
```

---

## 🆕 Adding New Field Assets

When creating new field definitions:

1. **Create file:** `NEW-FIELDS-{Category}.md`
2. **Include sections:**
   - Overview (purpose, count, pattern)
   - Current workflow (how it works now)
   - Field structure (complete list)
   - Sample data (examples)
   - HTML structure (if applicable)
   - Integration tasks (what needs updating)

3. **Update this index:**
   - Add to "Field Documentation Files" section
   - Add naming pattern if new
   - Update statistics
   - Commit changes

4. **Cross-reference:**
   - Update README.md if needed
   - Add to COMPONENT-LIBRARY.md if UI component
   - Add to fieldRegistry.ts for application use

---

## 📝 Maintenance Notes

**This index should be updated when:**
- New field definition files are created
- Field naming conventions change
- New field patterns are discovered
- Statistics need updating
- Related asset locations change

**Last Maintenance:** December 16, 2025 - Added Economic Indicators fields

---

**For questions or updates, see session summaries in `-passover-sessions/`**
