# Agent Guide: Report Page Formatting (Pages 19-25)

**Project:** APR Dashboard v3 - Report Builder HTML Template Migration
**Task:** Format pages 19-25 from Word document into clean HTML with field mapping
**Status:** Pages 3-18 complete and approved ✅

---

## 🎯 Mission

Convert pages 19-25 from the reference Word document into properly formatted HTML pages that:
1. Match the existing visual style (pages 3-18)
2. Use the master CSS stylesheet
3. Map all dynamic content to `{{Field_ID}}` placeholders
4. Fit within strict 11-inch page height (WYSIWYG preview)
5. Include consistent footer styling

---

## 📋 Current Progress

**Completed Pages (3-18):**
- Pages 3-7: Letter of Transmittal, Limiting Conditions, TOC, Property Overview
- Pages 8-12: Hypothetical Conditions, Photo grids (25 photos)
- Pages 13-18: Maps (Regional/Local/Aerial), Property ID, Sales History, Exposure Time

**Next Batch (19-25):** Your assignment

---

## 🏗️ HTML Structure Reference

### Page Anatomy

Every page follows this structure:

```html
<div class="page-sheet" data-page-num="Page 19">
    <!-- Page Header (if needed) -->
    <div class="Header1">Section Name</div>

    <!-- Page Content -->
    <div class="Header2">SUBSECTION NAME</div>

    <div class="Subheader1">Detail Section</div>
    <p>
        Content with <span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span> mapping.
    </p>

    <!-- Tables (if applicable) -->
    <table>
        <tr>
            <td class="label-col">Label</td>
            <td class="value-col">
                <span class="field-mapped" title="{{Field_Value}}">{{Field_Value}}</span>
            </td>
        </tr>
    </table>

    <!-- Page Footer (REQUIRED ON EVERY PAGE) -->
    <div class="page-footer">
        <div>
            <span class="page-num">19</span>
            <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span>,
            <span class="field-mapped" title="{{Subject_City}}">{{Subject_City}}</span> |
            File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span>
        </div>
        <div class="footer-accent"></div>
    </div>
</div>
```

### Example: Full Page with Content

```html
<div class="page-sheet" data-page-num="Page 19">
    <div class="Header1">Market Analysis</div>
    <div class="Header2">REGIONAL MARKET OVERVIEW</div>

    <div class="Subheader1">Economic Indicators</div>
    <p>
        The regional economy is characterized by
        <span class="field-mapped" title="{{Market_EconomicIndicators}}">{{Market_EconomicIndicators}}</span>
        with a current unemployment rate of
        <span class="field-mapped" title="{{Market_UnemploymentRate}}">{{Market_UnemploymentRate}}</span>.
    </p>

    <div class="Subheader1">Market Trends</div>
    <table>
        <tr>
            <td class="label-col">Supply Trend</td>
            <td class="value-col">
                <span class="field-mapped" title="{{Market_SupplyTrend}}">{{Market_SupplyTrend}}</span>
            </td>
        </tr>
        <tr>
            <td class="label-col">Demand Trend</td>
            <td class="value-col">
                <span class="field-mapped" title="{{Market_DemandTrend}}">{{Market_DemandTrend}}</span>
            </td>
        </tr>
    </table>

    <div class="page-footer">
        <div>
            <span class="page-num">19</span>
            <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span>,
            <span class="field-mapped" title="{{Subject_City}}">{{Subject_City}}</span> |
            File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span>
        </div>
        <div class="footer-accent"></div>
    </div>
</div>
```

---

## 🎨 Master CSS Stylesheet

**DO NOT include the `<style>` tags or CSS in your output.**
Just reference these classes in your HTML. The master file already has this CSS.

### Key CSS Classes:

```css
.page-sheet {
    height: 11in; /* STRICT - Pages cannot grow */
    overflow: hidden; /* Content overflow gets clipped */
}

.Header1 {
    font-size: 18pt;
    color: #003B7E;
    border-bottom: 1px solid #003B7E;
    margin-bottom: 12px;
}

.Header2 {
    font-size: 12pt;
    color: #003B7E;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 12px;
    margin-bottom: 6px;
}

.Subheader1 {
    font-size: 11pt;
    color: #003B7E;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 10px;
    margin-bottom: 4px;
}

.field-mapped {
    background-color: rgba(255, 255, 0, 0.15); /* Yellow highlight */
    border-bottom: 1px dotted #999;
    cursor: help;
}

.page-footer {
    margin-top: auto; /* Pushes to bottom via flexbox */
    padding-top: 15px;
    border-top: 1px solid #ccc;
    flex-shrink: 0;
}

.footer-accent {
    width: 60px;
    height: 10px;
    background: linear-gradient(to right, #4a9fd8, #003d7a);
    border-radius: 2px;
}

.page-num {
    color: #003B7E;
    font-weight: bold;
    margin-right: 15px;
}

table {
    margin-bottom: 10px;
    border-collapse: collapse;
}

td, th {
    padding: 4px 8px;
    border: 1px solid #ddd;
}

.label-col {
    background-color: #f0f0f0;
    font-weight: bold;
    width: 35%;
}

.value-col {
    width: 65%;
}
```

### Spacing Guidelines (IMPORTANT):
- Moderate spacing (not too tight, not too loose)
- Headers: 12px margins
- Subheaders: 10px top, 4px bottom
- Paragraphs: 8pt spacing
- Tables: 10px bottom margin
- **Content must fit in 11 inches!** If footer disappears, content is too long.

---

## 🏷️ Field Mapping Rules

### Format:
```html
<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>
```

### Common Field IDs:

**Subject Property:**
- `{{Subject_Street}}` - Property address
- `{{Subject_City}}` - City
- `{{Subject_State}}` - State/Province
- `{{Subject_Primary}}` - Primary property type
- `{{Subject_Subtype}}` - Property subtype
- `{{Subject_NRA}}` - Net rentable area
- `{{Subject_Owner}}` - Current owner

**Company/Report:**
- `{{Company_JobNumber}}` - File number
- `{{Company_Name}}` - Appraisal company
- `{{Report_Date}}` - Report date
- `{{Report_Date1}}` - Effective date of value
- `{{Report_DateInspection}}` - Inspection date

**Market/Valuation:**
- `{{Market_[Description]}}` - Market analysis fields
- `{{Value_[Type]}}` - Valuation fields
- `{{Comp_[Number]_[Field]}}` - Comparable property data

### Field Naming Convention:
1. Use **PascalCase** (e.g., `Subject_Street`, not `subject_street`)
2. Use **descriptive names** (e.g., `Market_SupplyTrend`, not `mkt_sup`)
3. Match existing patterns from pages 3-18
4. **Check the master field ID document** if unsure

### What to Map:
✅ **Map these:**
- Property addresses, names, descriptions
- Dates, numbers, measurements
- Owner/client names
- Market data, valuations
- Any user-editable content

❌ **Don't map these:**
- Section headers ("Introduction & Executive Summary")
- Static labels in tables ("Property Type", "Legal Description")
- Boilerplate text (standard disclaimers, definitions)
- Instructional text

---

## 📄 Source Material

**Reference Document:**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/`

Look for:
- `Ref.Report-VAL251012-North Battleford Apt.docx.pdf` - Original Word document as PDF
- Individual page screenshots if available

**Master Field ID Document:**
Check `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/2-Field Management/` for field registry reference.

---

## 📐 WYSIWYG Requirements (CRITICAL)

### The Problem We Solved:
"If the previewer doesn't show you the failure, it's not a previewer—it's a liar." - Gemini

### The Solution:
- **Fixed height: 11 inches** (not min-height)
- **overflow: hidden** (content that exceeds gets clipped)
- **Footer behavior:** If content is too long, footer gets clipped = visual warning

### What This Means for You:
1. **Content must fit in 11 inches** (including footer)
2. **Test your pages:** If footer disappears, content is too long
3. **Solutions if content too long:**
   - Reduce paragraph spacing (use inline `margin-bottom: 6pt`)
   - Split content across two pages
   - Use more compact table formatting
   - Remove unnecessary line breaks

### Visual Feedback:
✅ **Footer visible** = Page fits correctly
⚠️ **Footer missing/clipped** = Content overflow, needs adjustment

---

## 📦 Output Format

### File Structure:

Create a single HTML file named: `pg-19-25.html`

**File structure:**
```html
<!-- NO <!DOCTYPE> or <html> tags -->
<!-- NO <head> or <style> tags -->
<!-- JUST the page content -->

<div class="page-sheet" data-page-num="Page 19">
    <!-- Page 19 content -->
    <div class="page-footer">...</div>
</div>

<div class="page-sheet" data-page-num="Page 20">
    <!-- Page 20 content -->
    <div class="page-footer">...</div>
</div>

<!-- ... pages 21-25 ... -->
```

### Save Location:
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/html-pages/New Formated/pg-19-25.html`

### What NOT to Include:
❌ `<!DOCTYPE html>`
❌ `<html>`, `<head>`, `<body>` tags
❌ `<style>` block (CSS is already in master)
❌ `<script>` tags
❌ Personal comments or notes

### What TO Include:
✅ Just the `<div class="page-sheet">` blocks
✅ Properly formatted HTML
✅ All field mappings with `class="field-mapped"`
✅ Footer on every page
✅ Page numbers in `data-page-num` attribute

---

## ✅ Quality Checklist

Before delivering your HTML, verify:

### Structure:
- [ ] Each page is wrapped in `<div class="page-sheet" data-page-num="Page X">`
- [ ] Every page has a footer with `<div class="page-footer">`
- [ ] Footer includes page number, address, file number
- [ ] Footer includes `<div class="footer-accent"></div>`

### Content:
- [ ] All dynamic content wrapped in `<span class="field-mapped" title="{{Field_ID}}">{{Field_ID}}</span>`
- [ ] Field IDs use PascalCase (e.g., `Subject_Street`)
- [ ] No hard-coded property-specific data (use field IDs instead)
- [ ] Static labels are NOT field-mapped

### Formatting:
- [ ] Headers use proper classes (Header1, Header2, Subheader1)
- [ ] Tables use label-col and value-col classes
- [ ] Paragraphs have proper spacing (8pt default)
- [ ] Content fits within 11-inch page height
- [ ] Footer is visible on all pages (not clipped)

### Consistency:
- [ ] Style matches pages 3-18 (check PREVIEW-Master.html)
- [ ] Spacing is moderate (not too tight, not too loose)
- [ ] Color scheme matches (#003B7E for headers)
- [ ] Table formatting is consistent

### Technical:
- [ ] Valid HTML (no unclosed tags)
- [ ] No inline CSS (use classes instead)
- [ ] No DOCTYPE or html/head/body tags
- [ ] File saved as `pg-19-25.html`

---

## 🔄 Workflow After Delivery

1. **You create:** `pg-19-25.html` with pages 19-25
2. **I append:** Your HTML to `PREVIEW-Master.html`
3. **We review:** Preview together in browser
4. **You refine:** Based on feedback (if needed)
5. **Repeat:** For next batch of pages

---

## 💡 Tips & Best Practices

### Content Fitting:
- Start with page 19, check footer visibility
- If footer clips, reduce spacing before moving to page 20
- Use reference PDF to gauge content density

### Field Mapping:
- When in doubt, map it (better to have extra fields than missing ones)
- Use descriptive field names that match the content
- Check existing pages for similar content patterns

### Tables:
- Keep table rows compact (4px vertical padding)
- Use label-col for left column (35% width)
- Use value-col for right column (65% width)
- Map all data cells, not label cells

### Common Patterns:

**Property Description:**
```html
<p>
    The subject property, located at
    <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span>,
    <span class="field-mapped" title="{{Subject_City}}">{{Subject_City}}</span>,
    is a <span class="field-mapped" title="{{Subject_Primary}}">{{Subject_Primary}}</span>
    with <span class="field-mapped" title="{{Subject_NRA}}">{{Subject_NRA}}</span> square feet.
</p>
```

**Data Table:**
```html
<table>
    <tr>
        <td class="label-col">Property Type</td>
        <td class="value-col">
            <span class="field-mapped" title="{{Subject_Primary}}">{{Subject_Primary}}</span>
        </td>
    </tr>
    <tr>
        <td class="label-col">Total Units</td>
        <td class="value-col">
            <span class="field-mapped" title="{{Subject_Units}}">{{Subject_Units}}</span>
        </td>
    </tr>
</table>
```

---

## 📞 Questions?

If you encounter:
- **Unclear content:** Use best judgment, we'll refine in review
- **Missing field IDs:** Create descriptive names following the pattern
- **Content overflow:** Try reducing spacing first, then ask
- **Formatting questions:** Check pages 3-18 in PREVIEW-Master.html

---

## 🎯 Success Criteria

Your pages 19-25 are successful when:
1. ✅ All content fits within 11-inch pages (footers visible)
2. ✅ Visual style matches pages 3-18
3. ✅ All dynamic content is field-mapped
4. ✅ Footer on every page with correct page numbers
5. ✅ HTML is clean and valid
6. ✅ File saved as `pg-19-25.html` in correct location

---

**Ready to start? Format pages 19-25 and save as `pg-19-25.html`!**

**Good luck! 🚀**
