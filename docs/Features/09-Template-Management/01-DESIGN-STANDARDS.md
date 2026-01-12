# Template Design Standards

**Purpose**: Authoritative reference for all visual design decisions in Report-MF-template.html
**Maintained by**: Composer + Sonnet + Ben
**Last Updated**: 2026-01-09

---

## Color Standards

### Primary Colors

| Name | Hex | RGB | Usage | Required For |
|------|-----|-----|-------|--------------|
| **Brand Blue** | `#003b7e` | RGB(0, 59, 126) | Headers, borders | Header1 border-bottom, Header2 text |
| **Table Header Blue** | `#003B7E` | RGB(0, 59, 126) | Table headers background | All `<th>` elements |
| **White** | `#FFFFFF` | RGB(255, 255, 255) | Backgrounds, header text | Page background, table header text |
| **Black** | `#000000` | RGB(0, 0, 0) | Body text | All body content |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Light Gray | `#f0f0f0` | RGB(240, 240, 240) | Section backgrounds, table row highlights |
| Medium Gray | `#666666` | RGB(102, 102, 102) | Placeholder text, secondary info |
| Border Gray | `#ccc` | RGB(204, 204, 204) | Table borders, dividers |
| Light Blue | `#e8f4f8` | RGB(232, 244, 248) | Map placeholders, image placeholders |

### Mode-Specific Colors

**Dev Mode**:
- Field highlight: `rgba(255, 255, 0, 0.2)` (yellow, 20% opacity)
- Border: `1px dashed #ff0000` (red dashed)

**User Ready Mode**:
- Unmapped fields: `#999` (gray)
- Font style: `italic`

---

## Typography Standards

### Font Family

**Primary**: `"Open Sans", Arial, sans-serif`
- Used for all body text, headers, tables
- Fallback to Arial if Open Sans unavailable
- Sans-serif as final fallback

### Font Sizes

#### Headers

| Element | Size | Weight | Color | Line Height |
|---------|------|--------|-------|-------------|
| `.Header1` | **18pt** | normal | #003b7e | default |
| `.Header2` | **11pt** | bold | #003b7e | default |
| `.Subheader1` | **11pt** | bold | #000000 | default |
| `.centered-title` | **11pt** | bold | #003b7e | default |
| `.subsection-header` | **11pt** | bold | #FFFFFF (on blue bg) | default |

#### Body Text

| Element | Size | Weight | Color | Line Height |
|---------|------|--------|-------|-------------|
| Body paragraphs | **10pt** | normal | #000000 | 1.4 |
| Footnotes | **8pt** | normal | #000000 | 1.3 |

#### Tables

| Element | Size | Weight | Color | Context |
|---------|------|--------|-------|---------|
| Table headers (`<th>`) | **8pt** | bold | #FFFFFF | All tables |
| Table cells (`<td>`) | **7pt** | normal | #000000 | Financial tables |
| Table cells (`<td>`) | **8pt** | normal | #000000 | Comp sheets |
| Section headers in tables | **8pt** | bold | #000000 | Row headers |

#### Cover Page

| Element | Size | Weight |
|---------|------|--------|
| Main title | **24pt** | bold |
| Subtitle | **16pt** | normal |
| Client info | **12pt** | normal |

---

## Header Styling (CRITICAL)

### Header1 - Main Page Headers

**MANDATORY CSS**:
```css
.Header1 {
    font-size: 18pt;
    color: #003b7e;
    border-bottom: 1px solid #003b7e;  /* REQUIRED - DO NOT REMOVE */
    padding-bottom: 5px;                /* REQUIRED - DO NOT REMOVE */
    margin-bottom: 12px;
    font-weight: normal;
}
```

**Visual appearance**:
- Dark blue text (Brand Blue #003b7e)
- 1px solid blue line below text
- 5px space between text and line
- 12px space below line before content

**Common mistake**: Local page overrides that remove border-bottom
**Recent fix**: Pages 52-57 (2026-01-09)

### Header2 - Section Headers

```css
.Header2 {
    font-size: 11pt;
    color: #003b7e;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 15px;
    margin-bottom: 12px;
}
```

**Visual appearance**:
- Dark blue text, bold, uppercase
- No border
- Used for subsections within pages

---

## Table Standards

### Standard Financial Table (Pages 48-51)

**CSS Template**:
```css
table.financial-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7pt;
    margin-bottom: 12px;
}

table.financial-table th {
    background-color: #003B7E;      /* REQUIRED */
    color: white;                    /* REQUIRED */
    font-weight: bold;
    font-size: 8pt;
    padding: 3px 6px;
    text-align: left;
    border: 1px solid #003B7E;
}

table.financial-table td {
    padding: 2px 4px;
    border: none;
    vertical-align: top;
    line-height: 1.3;
}

table.financial-table td.label {
    font-weight: 600;
    width: 30%;
}

table.financial-table tr.total {
    font-weight: bold;
    border-top: 2px solid #003B7E;
}
```

### Comp Sheet Tables (Pages 53-57)

**CSS Template**:
```css
table.comp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7pt;
    margin-bottom: 0;
}

table.comp-table th {
    background-color: #003B7E;      /* REQUIRED */
    color: white;                    /* REQUIRED */
    font-weight: bold;
    font-size: 8pt;
    padding: 3px 4px;
    text-align: left;
    border: none;
}

table.comp-table td {
    padding: 2px 4px;
    border: none;
    vertical-align: top;
    line-height: 1.3;
}

table.comp-table td.label {
    font-weight: 600;
    width: 45%;
}
```

### Comparables List Table (Page 52)

```css
table.comparables-list {
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
}

table.comparables-list th {
    background-color: #003B7E;
    color: white;
    font-weight: bold;
    padding: 4px 6px;
    text-align: left;
    border: 1px solid #003B7E;
}

table.comparables-list td {
    padding: 3px 6px;
    border: none;
    vertical-align: top;
    line-height: 1.3;
}
```

---

## Page Layout Standards

### Page Dimensions

**Standard page**:
```css
.page-sheet {
    width: 8.5in;              /* Letter size width */
    height: 11in;              /* Letter size height */
    padding: 54px;             /* Standard all-around padding */
    padding-bottom: 180px;     /* Footer clearance */
    background-color: white;
    page-break-after: always;
}
```

**Page measurements**:
- Width: 8.5 inches (612pt)
- Height: 11 inches (792pt)
- Top padding: 54px
- Left/Right padding: 54px
- Bottom padding: 180px (for footer)

### Content Area

**Usable content area** (after padding):
- Width: 8.5in - (54px × 2) = ~7.5in
- Height: 11in - (54px + 180px) = ~8.5in

### Footer Area

**Footer positioning**:
```css
.page-footer {
    position: absolute;
    bottom: 54px;              /* 54px from page bottom */
    left: 54px;
    right: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-accent {
    height: 3px;
    width: 100%;
    background: linear-gradient(to right, #003b7e, transparent);
}
```

---

## Spacing Standards

### Vertical Spacing

| Element | Top Margin | Bottom Margin |
|---------|------------|---------------|
| Header1 | 0 | 12px |
| Header2 | 15px | 12px |
| Paragraph | 0 | 12px |
| Table | 0 | 12px |
| Section break | 16px | 16px |

### Padding

| Element | Padding |
|---------|---------|
| Page (standard) | 54px all sides |
| Page bottom (footer clearance) | 180px |
| Table header cells | 3px 6px |
| Table data cells | 2px 4px |
| Subsection headers | 8px 12px |

---

## Field-Mapped Span Standards

### Required Structure

**All field placeholders MUST follow this pattern**:
```html
<span
    class="field-mapped"
    data-field-id="{{field-id}}"
    title="{{field-id}}"
    data-sample="Example Value"
>{{field-id}}</span>
```

### Attributes Explained

**`class="field-mapped"`**:
- Enables Dev Mode highlighting
- Enables User Ready Mode styling
- Required for all field placeholders

**`data-field-id="{{field-id}}"`**:
- Field ID in mustache syntax
- Must match fieldRegistry.ts exactly
- Used by report builder for injection

**`title="{{field-id}}"`**:
- Tooltip on hover
- Must match data-field-id exactly

**`data-sample="Example Value"`**:
- Shown in User Ready Mode
- Should be realistic example (from North Battleford data)
- Required for all calculated/financial fields

**Inner text `{{field-id}}`**:
- Shown in Dev Mode
- Must match data-field-id exactly

### Pages Requiring data-sample

✅ **Must have data-sample**:
- All Income Approach pages (48-51)
- All Sales Comparison pages (52-57)
- All Cost Approach pages (58-62)
- Any page with calculated fields

❌ **Don't need data-sample**:
- Certification page (63) - legal text only
- Glossary pages (69-70) - definitions only
- Cover page - has real content, not placeholders

---

## Image & Map Standards

### Image Placeholders

```html
<div class="property-photo">
    <span
        class="field-mapped"
        data-field-id="{{comp1-photo}}"
        title="{{comp1-photo}}"
        data-sample="[Property Photo]"
    >{{comp1-photo}}</span>
</div>
```

**Container CSS**:
```css
.property-photo {
    width: 100%;
    height: 280px;
    background-color: #e8f4f8;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 9pt;
}
```

### Map Placeholders

```html
<div class="map-container">
    <span
        class="field-mapped"
        data-field-id="{{img-comparables-map}}"
        title="{{img-comparables-map}}"
        data-sample="[Comparables Location Map]"
    >{{img-comparables-map}}</span>
</div>
```

**Container CSS**:
```css
.map-container {
    width: 100%;
    height: 650px;
    background-color: #e8f4f8;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 10pt;
}
```

---

## Mode Toggle Standards

### Dev Mode (Default)

**Purpose**: Development and field mapping work

**Styling**:
```css
.field-mapped {
    background-color: rgba(255, 255, 0, 0.2);  /* Yellow highlight */
    border: 1px dashed #ff0000;                 /* Red dashed border */
    padding: 1px 2px;
}
```

**Display**: Shows `{{field-id}}` from inner text

### User Ready Mode

**Purpose**: Client previews with example data

**Styling**:
```css
.field-mapped:not(.populated) {
    color: #999;        /* Gray out unmapped */
    font-style: italic;
}

.field-mapped.populated {
    /* Normal styling when data injected */
    background: none;
    border: none;
}
```

**Display**: Shows `data-sample` value if exists, otherwise gray italic field-id

---

## Common Patterns

### Two-Column Layout (Comp Sheets)

```css
.content-wrapper {
    display: flex;
    gap: 12px;
    margin-top: 12px;
}

.left-column {
    flex: 0 0 48%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.right-column {
    flex: 0 0 48%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
```

### Section Headers in Tables

```css
tr.section-header {
    background: #f0f0f0;
    border-bottom: 0.5px solid #333;
    border-top: 6px solid white;
}

td.section-header {
    padding: 3px 6px;
    font-weight: bold;
    font-size: 8pt;
}
```

### Highlight Rows (Totals, Important Values)

```css
tr.highlight {
    font-weight: bold;
    background-color: #f8f8f8;
}

tr.total {
    font-weight: bold;
    border-top: 2px solid #003B7E;
}
```

---

## Quality Checklist

Before considering any page "complete", verify:

### Visual
- [ ] Header1 has blue border-bottom (1px solid #003b7e)
- [ ] Table headers are blue background (#003B7E)
- [ ] Table header text is white
- [ ] Font sizes match standards (18pt headers, 7-8pt tables)
- [ ] Spacing is consistent (12px margins, 54px padding)
- [ ] Footer has 180px bottom clearance

### Functional
- [ ] All field-mapped spans have data-field-id
- [ ] All field-mapped spans have title attribute
- [ ] All calculated fields have data-sample
- [ ] Field IDs match fieldRegistry.ts
- [ ] Dev Mode shows yellow highlights
- [ ] User Ready Mode shows example values

### Layout
- [ ] Content fits within page bounds
- [ ] No orphaned text at page breaks
- [ ] Footer positioned correctly
- [ ] Images/maps have proper placeholders
- [ ] Tables don't overflow horizontally

---

## Reference Examples

**Well-formatted page**: Page 49 (Direct Capitalization)
- ✅ Blue header borders
- ✅ Blue table headers
- ✅ All fields have data-sample
- ✅ Proper spacing
- ✅ Footer clearance

**Use as template for**: All financial/calculated pages

---

**Document Status**: ✅ Complete
**Maintained by**: Composer + Sonnet + Ben
**Last Updated**: 2026-01-09
