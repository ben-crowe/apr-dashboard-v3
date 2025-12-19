# Table Reference Images Catalog

**Location:** `/docs/15-Contract-review/1-Formatting & Report/reference-table-images/media/`
**Total Images:** 86 table design references (image3.png through image85.png)
**Created:** December 16, 2025
**Purpose:** Visual reference library for table formatting and component design

---

## Overview

This directory contains 86 reference images extracted from the appraisal report showing different table designs, layouts, and patterns. These images serve as visual guides for:

- Creating HTML table components
- Matching exact table styling from source documents
- Identifying reusable table patterns
- Verifying field mapping accuracy

---

## Sample Table Types Identified

### 1. Property Site Details Table (image20.png)

**Type:** Key-value table with header row
**Pattern:** Label (left) + Value (right) + Additional columns (Square Feet, Acres)

**Structure:**
- Header: Legal Description, Land Area (with Plan/Block/Lot details)
- Rows:
  - Economic Unit Site Size
  - Usable Site Size
  - Total Land Area
  - Excess/Surplus Land
  - Corner, Site Topography, Site Shape, Site Grade
  - Site Quality, Site Access, Site Exposure, Site Utility
  - Municipal Services

**CSS Class Candidate:** `.property-details-table` or existing `.key-value-table`

**Field Pattern:** `Subject_*` (e.g., Subject_LegalDescription, Subject_SiteSize, Subject_Corner)

---

### 2. Map with Comparables Table (image40.png)

**Type:** Embedded map image with comparable properties table below

**Structure:**
- Top: Google Map showing subject property and comparables with numbered pins
- Bottom: Table with columns:
  - COMPARABLE (1-5)
  - LABEL (numbered)
  - ADDRESS (full street address with city, province, postal code)
  - KILOMETRES FROM SUBJECT (distance)

**CSS Class Candidate:** `.comparables-map-table`

**Field Pattern:** `comp{#}-{attribute}` (e.g., comp1-address, comp1-distance)

**Note:** Map would be image upload, table can be field-mapped

---

### 3. Grid/Cell Layout (image3.png)

**Type:** Document grid showing parcel numbers and measurements

**Structure:** Property parcel grid with:
- Parcel IDs (131454895, 131454828, etc.)
- Measurements (36.57, 15.24, 199.87)
- Red highlighted parcel (subject property)

**Use Case:** Site plan diagrams, lot layouts
**Implementation:** Likely image upload rather than HTML table

---

## Table Design Patterns

Based on sample images, common patterns include:

### Pattern A: Key-Value Tables
- **Usage:** Property details, specifications, zoning information
- **Columns:** 2-4 columns (Label, Value, Optional Unit, Optional Note)
- **Styling:** Clean rows, alternating backgrounds optional
- **Component:** `.key-value-table` (already exists)

### Pattern B: Multi-Column Data Tables
- **Usage:** Comparables, surveys, financial data
- **Columns:** 3-8 columns
- **Styling:** Header row, data rows, sometimes subtotals
- **Component:** `.data-table` (to be created)

### Pattern C: Map + Table Combinations
- **Usage:** Regional maps, comparable locations, market area
- **Sections:** Image on top, table below
- **Implementation:** Image upload + field-mapped table

### Pattern D: Financial/Calculation Tables
- **Usage:** Income approach, operating expenses, NOI calculations
- **Columns:** Multiple columns with numbers, percentages, currency
- **Styling:** Bold totals, indented sub-items, right-aligned numbers
- **Component:** `.financial-table` (to be created)

---

## Recommended Next Steps

### 1. Complete Image Catalog (Future Task)

Sample 10-15 more images across the range to identify:
- All unique table patterns
- Color schemes used (beyond APR blue)
- Border styles
- Font specifications
- Spacing patterns

### 2. Create Missing Components

Based on discovered patterns, create:
- `.data-table` - Multi-column data tables
- `.financial-table` - Financial calculations with totals
- `.comparables-table` - Sales/rental comparable tables
- `.map-with-table` - Combined map image + data table

### 3. Map Images to Report Pages

Cross-reference these 86 images with:
- Page numbers they appear on
- Section names
- Table types
- Field patterns used

### 4. Integration with Component Library

Add reference to this catalog in:
- COMPONENT-LIBRARY.md
- TABLE-COMPONENT-Blue-Header.md
- FIELD-ASSETS-INDEX.md

---

## Usage Instructions

**For Agents Formatting Pages:**

1. **Check if table exists in reference images**
   ```bash
   # Browse images to find matching table design
   open "/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/reference-table-images/media/"
   ```

2. **Identify table pattern**
   - Is it a key-value table? Use `.key-value-table`
   - Is it an economic indicators table? Use `.economic-table`
   - Is it a new pattern? Check this catalog first

3. **Match styling exactly**
   - Compare colors, fonts, spacing to reference image
   - Use browser DevTools to verify pixel-perfect match
   - Test with Preview Mode to verify field mapping

4. **Document new patterns**
   - If you find a new table type not cataloged, add it to this document
   - Create component class in css-components-library.css
   - Update COMPONENT-LIBRARY.md

---

## Image Naming Convention

Images are numbered but not descriptive. When cataloging:

**Suggested naming format for future:**
```
{page-number}-{table-type}-{section}.png

Examples:
p31-economic-indicators-saskatchewan.png
p20-site-details-land-area.png
p40-map-comparables-regional.png
```

**Current format:**
```
image3.png, image10.png, image20.png, etc.
```

---

## Field Mapping Reference

When creating HTML from these reference images:

**Step 1:** Identify table type from this catalog
**Step 2:** Match to existing component (if available)
**Step 3:** Map fields using patterns from FIELD-ASSETS-INDEX.md
**Step 4:** Verify with Preview Mode toggle
**Step 5:** Compare rendered HTML to reference image

---

## Statistics

- **Total Reference Images:** 86
- **File Formats:** PNG (majority), JPG (some)
- **Date Created:** December 12, 2024
- **Source:** Extracted from reference appraisal report
- **Average File Size:** ~100KB (ranges from 16KB to 1.6MB)

---

## Related Documentation

- **Component Library:** [COMPONENT-LIBRARY.md](../../1-Formatting & Report/REPORT Pg Img/doc-page-html/COMPONENT-LIBRARY.md)
- **Field Assets Index:** [FIELD-ASSETS-INDEX.md](./FIELD-ASSETS-INDEX.md)
- **Blue Header Component:** [TABLE-COMPONENT-Blue-Header.md](./TABLE-COMPONENT-Blue-Header.md)
- **Agent Guide:** [AGENT-GUIDE-Page-Formatting.md](../../1-Formatting & Report/-passover-sessions/AGENT-GUIDE-Page-Formatting.md)

---

## Maintenance

**To add new reference images:**
1. Save image to media directory
2. Update this catalog with description
3. Identify table type and pattern
4. Create component class if new pattern
5. Update statistics

**To catalog existing images:**
1. Open image in viewer
2. Identify table type and page location
3. Document in this file
4. Note any new patterns discovered

---

**Status:** Catalog started - 3 of 86 images documented
**Next Action:** Sample additional images to identify all table patterns
**Priority:** Medium - Useful reference but not blocking current work
