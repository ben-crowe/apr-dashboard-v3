# Table Creation Guide for Report Page Formatting

**Project:** APR Dashboard v3 - Report Builder HTML Template Migration
**Purpose:** Comprehensive guide for creating tables with proper field mapping and toggle support
**Last Updated:** 2025-12-16
**Based on:** Verified working examples from Pages 40-42

---

## 🎯 Purpose

This guide teaches you how to create properly formatted HTML tables with field mapping for the report template. Use this when formatting pages that contain data tables (comparables, surveys, revenue tables, etc.).

---

## 📚 Proven Examples - Pages 40-42

**Pages 40-42 are VERIFIED WORKING** and serve as the gold standard for table creation.

**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html`

**What these pages demonstrate:**
- ✅ Correct field-mapped span format with data-sample attribute
- ✅ Proper table structure with `<tr>` tags
- ✅ CSS utility classes instead of inline styles
- ✅ Toggle functionality working in browser
- ✅ Row labels as plain text (not field-mapped)
- ✅ Data values properly wrapped in field-mapped spans

**Search PREVIEW-Master.html for these page sections to see working examples.**

---

## 🏗️ Step-by-Step Table Creation Workflow

### Step 1: Create Basic Table Structure

Start with a clean table structure with proper semantic HTML:

```html
<table class="compact-table">
  <thead>
    <tr>
      <th>Column 1 Header</th>
      <th>Column 2 Header</th>
      <th>Column 3 Header</th>
    </tr>
  </thead>
  <tbody>
    <!-- Rows will go here -->
  </tbody>
</table>
```

**Critical:**
- ✅ Add `class="compact-table"` to `<table>` tag
- ✅ Always include `<thead>` and `<tbody>` sections
- ✅ Every row needs `<tr>` wrapper
- ❌ Do NOT use inline styles on table, tr, or td elements

---

### Step 2: Add Column Headers

Header rows define the structure. Use proper classes for alignment:

```html
<thead>
  <tr>
    <th>Unit Type</th>                    <!-- Left-aligned by default -->
    <th class="text-right">Unit Size</th> <!-- Right-align numeric headers -->
    <th class="text-right">Rent/Unit</th>
    <th class="text-right">Rent/SF</th>
  </tr>
</thead>
```

**Rules:**
- Text headers: No class needed (left-aligned by default)
- Numeric/currency headers: Add `class="text-right"`
- ❌ Do NOT field-map header text (headers are static labels)

---

### Step 3: Identify Static vs Dynamic Content

Before adding data rows, identify what should be field-mapped:

**✅ Field-Map These (Dynamic Content):**
- Numeric values (650, 1200, $15,600)
- Currency amounts ($1,200, $1.85)
- Percentages (5.2%, 95%)
- Property-specific data (addresses, names, measurements)
- Calculated results (totals, averages, adjustments)

**❌ Don't Field-Map These (Static Labels):**
- Row labels (e.g., "1 Bedroom", "2 Bedroom")
- Unit type descriptions (e.g., "1 Flat 1 Bed / 1 Bath")
- Category names (e.g., "Gross Rent", "Vacancy")
- Any text that doesn't change between properties

---

### Step 4: Create Data Rows

Add rows with proper `<tr>` wrappers and field mapping:

```html
<tbody>
  <tr>
    <td>1 Flat 1 Bed / 1 Bath</td>  <!-- Static label - plain text -->
    <td class="text-right">
      <span class="field-mapped" data-sample="650" title="{{Market_Rent_1Bed_Comp1_UnitSize}}">{{Market_Rent_1Bed_Comp1_UnitSize}}</span>
    </td>
    <td class="text-right">
      <span class="field-mapped" data-sample="$1,200" title="{{Market_Rent_1Bed_Comp1_RentUnit}}">{{Market_Rent_1Bed_Comp1_RentUnit}}</span>
    </td>
    <td class="text-right">
      <span class="field-mapped" data-sample="$1.85" title="{{Market_Rent_1Bed_Comp1_RentSF}}">{{Market_Rent_1Bed_Comp1_RentSF}}</span>
    </td>
  </tr>
</tbody>
```

**Critical Format:**
```html
<span class="field-mapped" data-sample="VALUE" title="{{Field_ID}}">{{Field_ID}}</span>
```

**Why this format:**
- `textContent` = `{{Field_ID}}` (shows field ID by default)
- `data-sample` attribute = sample value (used by toggle)
- `title` attribute = `{{Field_ID}}` (tooltip reference)

---

### Step 5: Add CSS Utility Classes

Use CSS classes instead of inline styles:

**Available Utility Classes:**
- `.text-right` - Right-align text and numbers
- `.bold` - Bold text
- `.compact-table` - Apply to `<table>` for compact spacing

**Example:**
```html
<table class="compact-table">  <!-- ✅ CORRECT -->
  <tr>
    <td>Label</td>
    <td class="text-right">  <!-- ✅ CORRECT -->
      <span class="field-mapped" data-sample="650" title="{{Field_ID}}">{{Field_ID}}</span>
    </td>
  </tr>
</table>
```

**Don't use inline styles:**
```html
<td style="text-align: right;">  <!-- ❌ WRONG -->
```

---

### Step 6: Verify Toggle Functionality

After creating your table, verify the toggle works:

1. **Toggle OFF (default):** Field IDs visible (e.g., `{{Market_Rent_1Bed_Comp1_UnitSize}}`)
2. **Toggle ON:** Sample data visible (e.g., `650`)

**The toggle JavaScript reads from `data-sample` attribute:**
```javascript
// Toggle OFF: field.textContent shows "{{Market_Rent_1Bed_Comp1_UnitSize}}"
// Toggle ON: field.textContent = field.getAttribute('data-sample'); // Shows "650"
```

---

## 📋 Complete Table Examples

### Example 1: Market Rent Comparables (Page 40)

**This is a 5-column table with numeric data:**

```html
<table class="compact-table">
  <thead>
    <tr>
      <th>Unit Type</th>
      <th class="text-right">Unit Size (SF)</th>
      <th class="text-right">Rent/Unit</th>
      <th class="text-right">Rent/SF</th>
      <th class="text-right">Adjusted Rent/SF</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1 Flat 1 Bed / 1 Bath</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="650" title="{{Market_Rent_1Bed_Comp1_UnitSize}}">{{Market_Rent_1Bed_Comp1_UnitSize}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1,200" title="{{Market_Rent_1Bed_Comp1_RentUnit}}">{{Market_Rent_1Bed_Comp1_RentUnit}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.85" title="{{Market_Rent_1Bed_Comp1_RentSF}}">{{Market_Rent_1Bed_Comp1_RentSF}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.80" title="{{Market_Rent_1Bed_Comp1_RentSF_Unadj}}">{{Market_Rent_1Bed_Comp1_RentSF_Unadj}}</span>
      </td>
    </tr>
    <tr>
      <td>1 Flat 1 Bed / 1 Bath</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="700" title="{{Market_Rent_1Bed_Comp2_UnitSize}}">{{Market_Rent_1Bed_Comp2_UnitSize}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1,250" title="{{Market_Rent_1Bed_Comp2_RentUnit}}">{{Market_Rent_1Bed_Comp2_RentUnit}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.79" title="{{Market_Rent_1Bed_Comp2_RentSF}}">{{Market_Rent_1Bed_Comp2_RentSF}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.75" title="{{Market_Rent_1Bed_Comp2_RentSF_Unadj}}">{{Market_Rent_1Bed_Comp2_RentSF_Unadj}}</span>
      </td>
    </tr>
  </tbody>
</table>
```

**Field Naming Pattern:**
```
{{Market_Rent_[1/2]Bed_Comp[1-5]_[UnitSize/RentUnit/RentSF/RentSF_Unadj/NetAdj]}}
```

---

### Example 2: Revenue Summary Table (Page 42)

**This is a 4-column table comparing contract vs market rent:**

```html
<table class="compact-table">
  <thead>
    <tr>
      <th>Unit Type</th>
      <th class="text-right">Units</th>
      <th class="text-right">Contract Rent/Month</th>
      <th class="text-right">Market Rent/Month</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1 Bedroom</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="12" title="{{ContractVsMarket_1Bed_Units}}">{{ContractVsMarket_1Bed_Units}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$14,400" title="{{ContractVsMarket_1Bed_Contract}}">{{ContractVsMarket_1Bed_Contract}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$15,600" title="{{ContractVsMarket_1Bed_Market}}">{{ContractVsMarket_1Bed_Market}}</span>
      </td>
    </tr>
    <tr>
      <td>2 Bedroom</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="24" title="{{ContractVsMarket_2Bed_Units}}">{{ContractVsMarket_2Bed_Units}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$28,800" title="{{ContractVsMarket_2Bed_Contract}}">{{ContractVsMarket_2Bed_Contract}}</span>
      </td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$31,200" title="{{ContractVsMarket_2Bed_Market}}">{{ContractVsMarket_2Bed_Market}}</span>
      </td>
    </tr>
    <tr>
      <td class="bold">Total</td>
      <td class="text-right bold">
        <span class="field-mapped" data-sample="36" title="{{ContractVsMarket_Total_Units}}">{{ContractVsMarket_Total_Units}}</span>
      </td>
      <td class="text-right bold">
        <span class="field-mapped" data-sample="$43,200" title="{{ContractVsMarket_Total_Contract}}">{{ContractVsMarket_Total_Contract}}</span>
      </td>
      <td class="text-right bold">
        <span class="field-mapped" data-sample="$46,800" title="{{ContractVsMarket_Total_Market}}">{{ContractVsMarket_Total_Market}}</span>
      </td>
    </tr>
  </tbody>
</table>
```

**Field Naming Pattern:**
```
{{ContractVsMarket_[UnitType]_[Metric]}}
{{RentalRevenue_[UnitType]_[Metric]}}
{{OtherRevenue_[Category]_[Metric]}}
```

**Note:** Total row uses `.bold` class for emphasis.

---

### Example 3: Statistics Summary Table (Page 40)

**This is a 2-column table with statistics:**

```html
<table class="compact-table">
  <thead>
    <tr>
      <th>Statistic</th>
      <th class="text-right">Rent/SF</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>High</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.92" title="{{Market_Rent_1Bed_High}}">{{Market_Rent_1Bed_High}}</span>
      </td>
    </tr>
    <tr>
      <td>Average</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.82" title="{{Market_Rent_1Bed_Avg}}">{{Market_Rent_1Bed_Avg}}</span>
      </td>
    </tr>
    <tr>
      <td>Median</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.80" title="{{Market_Rent_1Bed_Med}}">{{Market_Rent_1Bed_Med}}</span>
      </td>
    </tr>
    <tr>
      <td>Low</td>
      <td class="text-right">
        <span class="field-mapped" data-sample="$1.75" title="{{Market_Rent_1Bed_Low}}">{{Market_Rent_1Bed_Low}}</span>
      </td>
    </tr>
  </tbody>
</table>
```

**Field Naming Pattern:**
```
{{Market_Rent_[1/2]Bed_[High/Avg/Med/Low]}}
```

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ MISTAKE 1: Wrapping Row Labels in field-mapped spans

**WRONG:**
```html
<tr>
  <td><span class="field-mapped" data-sample="1 Bedroom" title="{{Label}}">{{Label}}</span></td>
  <td class="text-right"><span class="field-mapped" data-sample="12" title="{{Units}}">{{Units}}</span></td>
</tr>
```

**CORRECT:**
```html
<tr>
  <td>1 Bedroom</td>  <!-- Static label - plain text -->
  <td class="text-right"><span class="field-mapped" data-sample="12" title="{{ContractVsMarket_1Bed_Units}}">{{ContractVsMarket_1Bed_Units}}</span></td>
</tr>
```

**Why:** Row labels are static text that don't change between properties. Only wrap the actual data values.

---

### ❌ MISTAKE 2: Using Inline Styles

**WRONG:**
```html
<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="border: 1px solid #ddd; text-align: right; padding: 8px;">650</td>
  </tr>
</table>
```

**CORRECT:**
```html
<table class="compact-table">
  <tr>
    <td class="text-right">650</td>
  </tr>
</table>
```

**Why:** Inline styles override CSS and make tables too wide, causing layout issues. Use CSS utility classes instead.

---

### ❌ MISTAKE 3: Missing `<tr>` Row Tags

**WRONG:**
```html
<tbody>
  <td>Label</td>
  <td>Value</td>
  <td>Label</td>
  <td>Value</td>
</tbody>
```

**CORRECT:**
```html
<tbody>
  <tr>
    <td>Label</td>
    <td>Value</td>
  </tr>
  <tr>
    <td>Label</td>
    <td>Value</td>
  </tr>
</tbody>
```

**Why:** Every set of `<td>` cells must be wrapped in a `<tr>` tag. Tables won't render correctly without proper row structure.

---

### ❌ MISTAKE 4: Wrong data-sample Format

**WRONG - Value as textContent:**
```html
<span class="field-mapped" title="{{Field_ID}}">650</span>
```

**WRONG - Field ID in data-sample:**
```html
<span class="field-mapped" data-sample="{{Field_ID}}" title="{{Field_ID}}">650</span>
```

**CORRECT:**
```html
<span class="field-mapped" data-sample="650" title="{{Market_Rent_1Bed_Comp1_UnitSize}}">{{Market_Rent_1Bed_Comp1_UnitSize}}</span>
```

**Why:** The toggle mechanism reads from `data-sample` to display sample values. Field ID must be textContent to show by default.

---

## 🏷️ Field Naming Conventions

### General Pattern

**PascalCase with underscores separating components:**
```
{{Category_Subcategory_Identifier_Metric}}
```

### Market Rent Comparables

**Pattern:**
```
{{Market_Rent_[BedCount]Bed_Comp[Number]_[Metric]}}
```

**Examples:**
- `{{Market_Rent_1Bed_Comp1_UnitSize}}` - Unit size for 1-bed comparable #1
- `{{Market_Rent_2Bed_Comp3_RentUnit}}` - Monthly rent for 2-bed comparable #3
- `{{Market_Rent_1Bed_Comp5_RentSF}}` - Rent per square foot for 1-bed comparable #5

**Metrics:**
- `UnitSize` - Square footage
- `RentUnit` - Rent per unit (monthly)
- `RentSF` - Rent per square foot
- `RentSF_Unadj` - Unadjusted rent per SF
- `NetAdj` - Net adjustment percentage

---

### Revenue Tables

**Pattern:**
```
{{Revenue_Category_UnitType_Metric}}
```

**Examples:**
- `{{ContractVsMarket_1Bed_Units}}` - Number of 1-bedroom units
- `{{ContractVsMarket_2Bed_Contract}}` - Contract rent for 2-bedroom
- `{{RentalRevenue_Total_Annual}}` - Total annual rental revenue
- `{{OtherRevenue_Parking_Monthly}}` - Monthly parking revenue

---

### Statistics Tables

**Pattern:**
```
{{Market_Rent_[BedCount]Bed_[Statistic]}}
```

**Examples:**
- `{{Market_Rent_1Bed_High}}` - Highest rent/SF for 1-bedroom
- `{{Market_Rent_2Bed_Avg}}` - Average rent/SF for 2-bedroom
- `{{Market_Rent_1Bed_Med}}` - Median rent/SF for 1-bedroom
- `{{Market_Rent_2Bed_Low}}` - Lowest rent/SF for 2-bedroom

---

## ✅ Quality Checklist

Before delivering your table, verify:

### Structure:
- [ ] Table has `class="compact-table"`
- [ ] `<thead>` and `<tbody>` sections present
- [ ] Every data row wrapped in `<tr>` tags
- [ ] No unclosed `<tr>`, `<td>`, or `<th>` tags

### Field Mapping:
- [ ] All dynamic data wrapped in `<span class="field-mapped">`
- [ ] Field-mapped spans use correct format: `data-sample="VALUE" title="{{Field_ID}}">{{Field_ID}}`
- [ ] Row labels (first column) are plain text, NOT field-mapped
- [ ] Field IDs follow naming conventions (PascalCase_Underscore)

### Styling:
- [ ] No inline styles on any elements
- [ ] Numeric/currency columns use `class="text-right"`
- [ ] Bold rows (like totals) use `class="bold"`
- [ ] Consistent spacing and alignment

### Toggle Functionality:
- [ ] All field-mapped spans have `data-sample` attribute
- [ ] Sample values are realistic and match data type
- [ ] Toggle should show field IDs by default, sample data when ON

---

## 🔗 Related Documentation

- **Field ID Guide:** See [FIELD-ID-GUIDE-for-Agents.md](./FIELD-ID-GUIDE-for-Agents.md) for finding field IDs
- **Agent Guide:** See [AGENT-GUIDE-Page-Formatting.md](../1-Formatting & Report/-passover-sessions/AGENT-GUIDE-Page-Formatting.md) for complete page formatting workflow
- **Page 40-42 Fix Documentation:** See [-passover-sessions/25.12.16-2 - Page-40-Fix-Documentation.md](./-passover-sessions/25.12.16-2 - Page-40-Fix-Documentation.md) for detailed fix explanations

---

## 📚 Reference: Pages 40-42 in PREVIEW-Master.html

**Always reference the actual working examples when creating tables.**

**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/doc-page-html/doc-pages-html-formatted/PREVIEW-Master.html`

**Search for these sections:**
- Page 40: Market Rent Comparables (lines ~4200-4500)
- Page 42: Revenue Summary Tables (lines ~4800-5100)

**These pages demonstrate:**
- ✅ Correct data-sample attribute usage
- ✅ Proper table structure
- ✅ CSS utility classes
- ✅ Field naming patterns
- ✅ Toggle functionality

**When in doubt, copy the pattern from Pages 40-42 exactly.**

---

**Ready to create tables? Follow the 6-step workflow! 🚀**
