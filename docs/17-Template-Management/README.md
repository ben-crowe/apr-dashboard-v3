# Phase 17: Template Management

**Phase Type**: Ongoing Maintenance & Governance
**Status**: 🟢 ACTIVE
**Created**: 2026-01-09
**Purpose**: Centralized management and quality control for Report-MF-template.html

---

## Phase Definition

This folder is the **single source of truth** for all template modifications, standards, and maintenance work. Any changes to the 75-page report template must be documented here.

**Key Principles**:
- ✅ All template changes documented before implementation
- ✅ Consistent formatting standards enforced
- ✅ Version control and change tracking
- ✅ Composer + Sonnet collaborative management
- ✅ Specs for fonts, tables, colors, spacing maintained

---

## Template Overview

**File**: `public/Report-MF-template.html`
**Current Version**: v2.9.0
**Last Major Update**: 2026-01-07 (Pages 52-57 structure replacement)
**Total Pages**: 75 pages
**Total Fields**: 1,643 mapped fields
**Template Size**: ~33,000 lines

### Template Modes

**Dev Mode** (default):
- Yellow highlight on all field-mapped spans
- Shows `{{field-id}}` placeholders
- Data attributes visible
- Used for development and field mapping

**User Ready Mode** (toggle):
- Gray italic styling on unmapped fields
- Shows `data-sample` example values
- Clean presentation
- Used for client previews

---

## Design Standards

### Typography

| Element | Font Size | Color | Weight | Line Height |
|---------|-----------|-------|--------|-------------|
| `.Header1` | 18pt | #003b7e | normal | - |
| `.Header2` | 11pt | #003b7e | bold | - |
| `.Subheader1` | 11pt | #000000 | bold | - |
| Body text | 10pt | #000000 | normal | 1.4 |
| Table headers | 8-9pt | #FFFFFF | bold | - |
| Table cells | 7-8pt | #000000 | normal | 1.3 |

### Header Styling (CRITICAL)

**All Header1 elements MUST have**:
```css
.Header1 {
    font-size: 18pt;
    color: #003b7e;
    border-bottom: 1px solid #003b7e;  /* REQUIRED */
    padding-bottom: 5px;                /* REQUIRED */
    margin-bottom: 12px;
    font-weight: normal;
}
```

**Recent Issue**: Pages 52-57 had local overrides that removed the blue border-bottom. Fixed 2026-01-09.

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Blue | `#003b7e` | Headers, borders, table headers |
| White | `#FFFFFF` | Background, table header text |
| Light Gray | `#f0f0f0` | Section backgrounds |
| Gray | `#666666` | Placeholder text |
| Black | `#000000` | Body text |
| Light Blue | `#e8f4f8` | Map placeholders |

### Table Standards

**Standard Table Header** (used in comp tables, financial tables):
```css
th {
    background-color: #003B7E;
    color: white;
    font-weight: bold;
    padding: 4px 6px;
    text-align: left;
    border: 1px solid #003B7E;
}
```

**Table Cell**:
```css
td {
    padding: 3px 6px;
    border: none;
    vertical-align: top;
    line-height: 1.3;
}
```

### Page Dimensions

**Standard Page**:
```css
.page-sheet {
    width: 8.5in;
    height: 11in;
    padding: 54px;           /* Standard all-around padding */
    padding-bottom: 180px;   /* Footer clearance */
}
```

**Custom Padding** (only when needed):
- Page 52: `padding-bottom: 180px;` only
- Pages 53-57: `padding: 54px 54px 180px 54px;` (4-sided)

---

## Field Mapping Standards

### Field-Mapped Span Structure

**Required attributes**:
```html
<span
    class="field-mapped"
    data-field-id="{{field-id}}"
    title="{{field-id}}"
    data-sample="Example Value"
>{{field-id}}</span>
```

**Critical rules**:
1. ✅ `data-field-id` must have `{{mustache}}` syntax
2. ✅ `title` matches `data-field-id` exactly
3. ✅ `data-sample` contains realistic example value (for User Ready mode)
4. ✅ Inner text matches `data-field-id`

### Pages Requiring data-sample

**All calculated/financial pages MUST have data-sample**:
- Pages 48-51: Income Approach ✅
- Pages 52-57: Sales Comparison (map, summaries) ✅
- Pages 58-62: Cost Approach ✅
- Page 36: Income Approach intro ⚠️ (needs adding)
- Page 37: Rent Survey table ⚠️ (needs adding)

**Pages that DON'T need data-sample** (text-only):
- Page 63: Certification (legal text)
- Pages 69-70: Glossary

---

## Page Inventory

### Pages by Section

| Pages | Section | Fields | Images | Tables | Status |
|-------|---------|--------|--------|--------|--------|
| 1-5 | Cover & TOC | 50+ | 3 | 1 | ✅ Complete |
| 6-35 | Property Description | 300+ | 20+ | 15+ | ✅ Complete |
| 36-37 | Income Intro & Rent Survey | 40+ | 0 | 2 | ⚠️ Need data-sample |
| 48-51 | Income Approach | 150+ | 0 | 8 | ✅ Complete |
| 52 | Comparables Map | 15 | 1 | 1 | ✅ Complete |
| 53-57 | Sales Summary Sheets | 400+ | 10 | 25 | ✅ Complete |
| 58-62 | Cost Approach | 100+ | 0 | 5 | ✅ Complete |
| 63 | Certification | 10 | 1 | 0 | ✅ Complete |
| 64-75 | Addenda & Glossary | 50+ | 0 | 3 | ✅ Complete |

### Calculator-Generated Pages

**Income Approach Calculator** generates:
- **Page 49** (Template Page 53): Direct Capitalization
- **Page 50** (Template Page 54): Income Conclusion

**Input fields**: 49 (per v2 spec)
**Output fields**: 78 (per v2 spec)
**Total fields**: 127

---

## Version History

### v2.9.0 (2026-01-07)
- Two-Mode Toggle System (Dev Mode vs User Ready Mode)
- `data-field-id` attributes on all field-mapped spans
- Pages 52-57 replaced with corrected structure
- `.populated` class support for real data injection

### v2.8.0 (2026-01-01)
- Enhanced preview zoom system
- Zoom anchoring to selected page
- Panel size responsiveness

### v2.7.0 (2025-12-30)
- Restructured Page 48
- Operating Expenses table alignment
- Color standardization (removed blue/red highlights)

### v2.6.0 (2025-12-26)
- Field registry alignment
- 1,643 fields verified
- 100% template coverage

---

## Change Request Process

### Before Making Template Changes:

1. **Create Issue Document** in this folder:
   - Filename: `ISSUE-[number]-[short-description].md`
   - Example: `ISSUE-001-missing-blue-borders-pages-52-57.md`

2. **Document the issue**:
   - What's wrong?
   - Which pages affected?
   - Screenshots if visual issue
   - Line numbers in template

3. **Propose solution**:
   - CSS changes needed
   - HTML structure changes
   - Field ID additions/changes

4. **Get approval** from Ben or team lead

5. **Implement & document**:
   - Make changes
   - Update CHANGELOG.md
   - Note in README version history
   - Close issue document

### Issue Template

```markdown
# ISSUE-XXX: [Title]

**Created**: [Date]
**Status**: 🟡 Open / 🟢 In Progress / ✅ Resolved
**Priority**: High / Medium / Low
**Affected Pages**: [Page numbers]

## Problem Description
[What's wrong?]

## Current Behavior
[What happens now]

## Expected Behavior
[What should happen]

## Solution Proposal
[How to fix]

## Implementation
- [ ] CSS changes
- [ ] HTML changes
- [ ] Field registry updates
- [ ] Testing
- [ ] Documentation

## Resolution
[What was done to fix it]
```

---

## Font Size Reference

### By Page Section

**Cover Page**:
- Title: 24pt
- Subtitle: 16pt
- Client info: 12pt

**Table of Contents**:
- Section headers: 11pt bold
- Page entries: 10pt

**Body Pages**:
- Page headers (Header1): 18pt
- Section headers (Header2): 11pt
- Body text: 10pt
- Table headers: 8-9pt
- Table cells: 7-8pt
- Footnotes: 8pt

**Financial Tables** (Pages 48-51):
- Column headers: 8pt bold
- Data cells: 7pt
- Section headers: 8pt bold
- Totals row: 8pt bold

**Comp Sheets** (Pages 53-57):
- Property name: 11pt
- Table headers: 8pt
- Table data: 7pt
- Remarks text: 7pt

---

## Table Reference

### Standard Financial Table

**Example**: Page 49 Direct Capitalization

```css
table.income-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7pt;
}

table.income-table th {
    background-color: #003B7E;
    color: white;
    font-weight: bold;
    font-size: 8pt;
    padding: 3px 6px;
    text-align: left;
}

table.income-table td {
    padding: 2px 4px;
    border: none;
    vertical-align: top;
}
```

### Standard Comp Sheet Table

**Example**: Pages 53-57 Sales Summaries

```css
table.comp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7pt;
}

table.comp-table th {
    background-color: #003B7E;
    color: white;
    font-weight: bold;
    font-size: 8pt;
    padding: 3px 4px;
    text-align: left;
}
```

---

## Common Issues & Solutions

### Issue: Blue borders missing on headers
**Solution**: Ensure all `.Header1` elements have `border-bottom: 1px solid #003b7e;`
**Pages affected**: 52-57 (fixed 2026-01-09)

### Issue: Field IDs showing in User Ready mode
**Solution**: Add `data-sample="example"` to all field-mapped spans
**Pages affected**: 36-37 (pending fix)

### Issue: Content pushing past footer
**Solution**: Verify `padding-bottom: 180px;` on page-sheet
**Common on**: Custom layout pages

### Issue: Table headers not blue
**Solution**: Check for local CSS overrides removing `background-color: #003B7E;`

### Issue: Images not displaying
**Solution**: Ensure `<img>` tags used, not `<span>` with field-mapped class

---

## Testing Checklist

Before finalizing template changes:

- [ ] Preview in Dev Mode (field IDs visible)
- [ ] Toggle to User Ready Mode (data-sample values show)
- [ ] Check all affected pages (52-57 in recent fix)
- [ ] Verify blue borders on all Header1 elements
- [ ] Confirm table headers are blue (#003B7E)
- [ ] Test page breaks (no orphaned content)
- [ ] Check footer positioning (180px clearance)
- [ ] Validate field-mapped spans have data-sample
- [ ] Verify no console errors in browser
- [ ] Test with real data injection (if calculator page)

---

## Agent Collaboration

**Composer (Comp)**: Primary template editor
- Handles CSS/HTML structure changes
- Implements design standards
- Manages version updates

**Sonnet**: Documentation & verification
- Documents changes in this folder
- Verifies field registry alignment
- Reviews before/after changes

**Desktop**: Calculator page generation
- Generates Pages 49-50 content
- Creates UI mockups for reference
- Provides field specs

---

## File Structure

```
docs/17-Template-Management/
├── README.md                    (this file)
├── CHANGELOG.md                 (version history)
├── DESIGN-STANDARDS.md          (detailed specs)
├── FIELD-MAPPING-GUIDE.md       (field-mapped spans)
├── ISSUE-001-*.md               (issue tracking)
├── ISSUE-002-*.md
└── templates/
    ├── table-standard.html      (reusable table templates)
    ├── header-standard.html     (header templates)
    └── page-layout.html         (page structure templates)
```

---

## Quick Reference

**Template location**: `public/Report-MF-template.html`
**Field registry**: `src/features/report-builder/schema/fieldRegistry.ts`
**Current version**: v2.9.0
**Total pages**: 75
**Total fields**: 1,643

**Key colors**:
- Brand blue: `#003b7e`
- Table header blue: `#003B7E`
- Light gray: `#f0f0f0`

**Key sizes**:
- Header1: 18pt
- Header2: 11pt
- Body: 10pt
- Tables: 7-8pt

**Page size**: 8.5in × 11in
**Standard padding**: 54px all sides
**Footer clearance**: 180px bottom

---

## Recent Changes

**2026-01-09**: Pages 52-57 header borders confirmed restored
**2026-01-07**: v2.9.0 upgrade - Pages 52-57 structure replacement
**2026-01-01**: v2.8.0 - Preview zoom enhancements
**2025-12-30**: v2.7.0 - Page 48 restructure

---

## Related Documentation

- **Phase 16**: Field Input-Output Mapping (`docs/16-Field-Input-Output-Mapping/`)
- **Phase 15**: Contract Review field registry work (`docs/15-Contract-review/`)
- **Phase 03**: ClickUp Integration workflow example (`docs/03-ClickUp-Integration/`)
- **Field Registry**: `.agent/system/field-registry-overview.md`

---

**Phase 17: ACTIVE** 🟢

**Managed by**: Composer + Sonnet + Ben
**Go-to folder for**: All template modifications, specs, standards, consistency
