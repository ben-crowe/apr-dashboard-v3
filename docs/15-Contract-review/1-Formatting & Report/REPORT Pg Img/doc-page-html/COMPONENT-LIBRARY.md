# APR Dashboard - Component Library

**Purpose:** Reusable HTML/CSS components for SVG-to-HTML conversion

**Location:** `/css-components-library.css`

**Last Updated:** December 16, 2025

---

## 📋 Table of Contents

1. [Table Components](#table-components)
2. [Header Components](#header-components)
3. [Field Mapping](#field-mapping)
4. [Page Layout](#page-layout)
5. [Typography](#typography)
6. [Color Palette](#color-palette)

---

## Table Components

### 1. Economic Indicators Table

**Class:** `.economic-table`

**Usage:** Tables with blue title bar spanning full width, column headers, and data rows

**Found on Pages:** 31 (Saskatchewan Economic Indicators), likely 32-34 (other provinces)

**HTML Structure:**
```html
<table class="economic-table">
    <tr class="table-title-row">
        <th colspan="4" class="table-title">Saskatchewan Economic Indicators</th>
    </tr>
    <tr>
        <th>Indicator</th>
        <th>Estimate</th>
        <th>Commentary</th>
        <th>Source</th>
    </tr>
    <tr>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Name}}">{{SK_Econ_Indicator_1_Name}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Estimate}}">{{SK_Econ_Indicator_1_Estimate}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Commentary}}">{{SK_Econ_Indicator_1_Commentary}}</span></td>
        <td><span class="field-mapped" title="{{SK_Econ_Indicator_1_Source}}">{{SK_Econ_Indicator_1_Source}}</span></td>
    </tr>
</table>
```

**Visual Design:**
- Blue title bar: `rgb(0, 59, 126)` background, white text, centered, 10pt font
- Column headers: Same blue background, white text, left-aligned, bold, 8pt font
- Data cells: White background, 1px gray border, left-aligned, 8pt font
- First column: Bold text

**Field Mapping Pattern:**
- Each data cell wraps content in `<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>`
- Preview Mode toggle replaces field IDs with sample data

---

### 2. Key-Value Table

**Class:** `.key-value-table`

**Usage:** Two-column tables with label (left) and value (right)

**Found on Pages:** 24 (Zoning Details), likely property specification tables

**HTML Structure:**
```html
<table class="key-value-table">
    <tr>
        <td class="label-col">Property Type</td>
        <td class="value-col"><span class="field-mapped" title="{{Subject_Subtype}}">{{Subject_Subtype}}</span></td>
    </tr>
</table>
```

**Visual Design:**
- Label column: 40% width, bold text, light gray background `#f8f9fa`
- Value column: 60% width, white background
- Both: 1px gray border, 6px padding

---

## Header Components

### 1. Blue Header Bar (Standalone)

**Class:** `.blue-header-bar`

**Usage:** Full-width section headers outside of tables

**Variants:**
- `.blue-header-bar.left-align` - Left-aligned text
- `.blue-header-bar.large` - Larger font (12pt) for major sections

**HTML Structure:**
```html
<div class="blue-header-bar">Section Title</div>
<div class="blue-header-bar left-align">Subsection Title</div>
<div class="blue-header-bar large">Major Section Divider</div>
```

**Visual Design:**
- Background: `rgb(0, 59, 126)`
- Text: White, bold
- Default: Centered, 10pt
- Large variant: 12pt, more padding

---

### 2. Typography Headers

**Classes:** `.Header1`, `.Header2`, `.Subheader1`

**Header1 (Major Sections):**
- Font: Montserrat Light, 14.6pt
- Margin-bottom: 27px
- Example: "MARKET CONTEXT"

**Header2 (Subsections):**
- Font: Helvetica, 14.6pt
- Color: `rgb(0, 59, 126)` (APR blue)
- Margin-bottom: 23px
- Example: "Provincial"

**Subheader1 (Minor Sections):**
- Font: Helvetica, 11.5pt
- Margin-bottom: 14.5px
- Example: "Saskatchewan"

---

## Field Mapping

### Field-Mapped Spans

**Class:** `.field-mapped`

**Purpose:** Wraps dynamic field IDs to enable Preview Mode toggle

**HTML Pattern:**
```html
<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>
```

**Visual States:**

**Field ID Mode (Default):**
- Background: `#fff3cd` (light yellow)
- Border-bottom: 2px dotted `#856404` (brown)
- Cursor: Help pointer
- Hover: Brighter yellow `#ffeaa7`

**Preview Mode (Toggle ON):**
- Background: Transparent
- Border: None
- Cursor: Default
- Content: Replaced with sample data via JavaScript

**JavaScript Integration:**
```javascript
// Sample data object
const sampleData = {
    'SK_Econ_Indicator_1_Name': 'Real GDP (2025)',
    'SK_Econ_Indicator_1_Estimate': '+1.8%',
    // ... more fields
};

// Preview mode toggle
previewToggle.addEventListener('change', function() {
    if (this.checked) {
        // Replace field IDs with sample data
        document.querySelectorAll('.field-mapped').forEach(span => {
            const fieldId = span.getAttribute('title').replace(/[{}]/g, '');
            if (sampleData[fieldId]) {
                span.textContent = sampleData[fieldId];
            }
        });
    } else {
        // Restore field IDs
        document.querySelectorAll('.field-mapped').forEach(span => {
            const fieldId = span.getAttribute('title');
            span.textContent = fieldId;
        });
    }
});
```

---

## Page Layout

### Page Sheet

**Class:** `.page-sheet`

**Purpose:** Container for each page in multi-page HTML document

**Specifications:**
- Width: 8.5 inches
- Min-height: 11 inches
- Padding: 0.75in (top, left, right)
- Padding-bottom: 180px (footer space)
- Margin: 0 auto 30px auto (centered with 30px gap between pages)
- Background: White
- Shadow: `0 4px 8px rgba(0,0,0,0.1)`

**HTML Structure:**
```html
<div class="page-sheet" data-page-num="Page 31">
    <!-- Page content -->
    <div class="page-footer">
        <div><span class="page-num">31</span> {{Subject_Street}} | File {{Company_JobNumber}}</div>
        <div class="footer-accent"></div>
    </div>
</div>
```

---

### Page Footer

**Class:** `.page-footer`

**Purpose:** Bottom section with page number and file info

**Specifications:**
- Position: Absolute, bottom 0.5in, left/right 0.75in
- Font-size: 8pt
- Color: `#666` (gray)
- Display: Flex, space-between

**Components:**
- `.page-num` - Bold, APR blue color
- `.footer-accent` - Gradient line from blue to transparent

---

## Color Palette

**CSS Variables (defined in `:root`):**

```css
--apr-blue: rgb(0, 59, 126);
--apr-blue-hex: #003B7E;
--apr-light-gray: #f8f9fa;
--apr-border-gray: #ddd;
--apr-text-gray: #666;
--apr-field-highlight: #fff3cd;
--apr-field-border: #856404;
```

**Usage:**
```css
.custom-element {
    background-color: var(--apr-blue);
    border: 1px solid var(--apr-border-gray);
}
```

---

## How to Use This Library

### 1. Import CSS in HTML

```html
<link rel="stylesheet" href="css-components-library.css">
```

### 2. Replace Page-Specific Styles

**Before (inline styles):**
```html
<style>
    .page-sheet[data-page-num="Page 31"] table {
        /* ... custom styles ... */
    }
</style>
<table>...</table>
```

**After (component class):**
```html
<table class="economic-table">...</table>
```

### 3. Identify Components in SVG

When converting new SVG pages:

1. **Look for blue rectangles** with `fill="#003B7E"` or `rgb(0,59,126)`
2. **Check if it's a table header** - Use `.economic-table`
3. **Check if it's a standalone header** - Use `.blue-header-bar`
4. **Identify table structure** - Title row → Column headers → Data rows
5. **Apply field mapping pattern** - Wrap dynamic content in `.field-mapped` spans

### 4. Test with Preview Mode

After applying components:
1. Open HTML in browser
2. Toggle Preview Mode (top-right switch)
3. Verify field IDs display correctly
4. Verify sample data populates correctly
5. Check visual alignment matches SVG

---

## Component Index by Page

| Page | Component | Class | Notes |
|------|-----------|-------|-------|
| 31 | Saskatchewan Economic Indicators | `.economic-table` | 4 columns, 14 data rows |
| 24 | Zoning Details | `.key-value-table` | Property specifications |
| All | Page Container | `.page-sheet` | 8.5x11 standard |
| All | Page Footer | `.page-footer` | Bottom section with page number |

---

## Adding New Components

When you find a new reusable pattern:

1. **Document the SVG source** - Which page, what section
2. **Extract the CSS** - Colors, fonts, spacing, structure
3. **Create a class** - Add to `css-components-library.css`
4. **Add HTML example** - Document structure in this file
5. **Update component index** - List which pages use it
6. **Test across pages** - Ensure it's truly reusable

---

## Next Steps

**Immediate:**
- Apply `.economic-table` to other provincial indicator tables (likely pages 32-34)
- Scan pages 35-40 for additional table patterns
- Create components for any new patterns found

**Future:**
- Chart/image placeholder components
- Multi-column layout components
- Financial table components (when we reach those pages)

---

## Field Management Integration

### Where Field IDs Come From

All field IDs used in the component library (like `{{SK_Econ_Indicator_1_Name}}`) come from the centralized Field Management system:

**Field Management Directory:**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/`

**Key Files:**
- **MASTER-FIELD-DIRECTORY.md** - Complete catalog of 7,967 fields from final report
- **TABLE-FIELD-ANALYSIS.md** - Table-specific field organization and patterns
- **FIELD-DESTINATION-MAP.md** - Maps each field to its report location
- **README.md** - Quick reference guide for field lookup

### Finding Field IDs for Your Table

**Step 1: Identify the table type**
- Economic indicators table? → Look for `*_Econ_Indicator_*` pattern
- Rental comparables? → Look for `survey1-*`, `survey2-*` patterns
- Sales comparables? → Look for `comp1-*`, `comp2-*` patterns
- Property details? → Look for `Subject_*` pattern

**Step 2: Check existing examples**
- Page 31 Saskatchewan Economic Indicators → 14 rows of `SK_Econ_Indicator_*` fields
- Pattern: `{Province}_Econ_Indicator_{Row#}_{Column}`
- Columns: `_Name`, `_Estimate`, `_Commentary`, `_Source`

**Step 3: Reference Field Management docs**
```bash
# Search for field patterns
grep -r "SK_Econ" /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field\ Management/

# Or check MASTER-FIELD-DIRECTORY.md for complete field list
```

### Table-Specific Field Patterns

**Economic Indicators Tables (Pages 31-34):**
```
Saskatchewan: SK_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
Alberta: AB_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
British Columbia: BC_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
National: National_Econ_Indicator_{1-14}_{Name|Estimate|Commentary|Source}
```

**Rental Survey Tables (Pages 35-39):**
```
survey1-{address|units|nra|rent-per-unit|1br-rent|1br-sf|1br-psf|...}
survey2-{same fields}
survey3-{same fields}
survey4-{same fields}
survey5-{same fields}
```

**Sales Comparables Tables (Pages 55-60):**
```
comp1-{gba|units|year|name|sale-price|price-per-unit|...}
comp2-{same fields}
comp3-{same fields}
```

---

**Created:** December 16, 2025
**Last Updated:** December 16, 2025
**Status:** Active - Use for all future SVG-to-HTML conversions

**Related Documentation:**
- [Field Management Directory](../../2-Field Management/README.md)
- [AGENT-GUIDE-Page-Formatting.md](../-passover-sessions/AGENT-GUIDE-Page-Formatting.md)
- [README-SVG-Conversion.md](../README-SVG-Conversion.md)
