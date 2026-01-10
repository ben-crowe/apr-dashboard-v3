# APR Template Compact Styling Guide

**Originally from**: Phase 15 Contract Review / Report Formatting Guide
**Moved to**: Phase 17 Template Management (2026-01-09)
**Purpose:** CSS techniques to prevent page content from overflowing into footer areas
**Template:** Report-MF-template.html
**Last Updated:** 2026-01-09

---

## Quick Reference Table

| Technique | CSS | Effect |
|-----------|-----|--------|
| compact-table class | `font-size: 7.5-8pt; padding: 3px 6px;` | Smaller table text & padding |
| Reduced line-height | `line-height: 1.1 - 1.3` | Tighter vertical spacing |
| Smaller margins | `margin-bottom: 2-4px` | Less space between elements |
| Smaller padding | `padding: 2-4px` | Less cell/element padding |
| Address font | `font-size: 6.5pt` | Extra small for addresses |

---

## Quick Fix Recipe (Apply in Order)

When a page overflows into footer, apply these progressively until it fits:

1. **Add compact-table class** to tables
2. **Reduce header margins:** `margin-top: 6px; margin-bottom: 4px;`
3. **Tighten line-height:** `1.2 → 1.1`
4. **Reduce font:** `9pt → 8pt → 7.5pt`
5. **Reduce padding:** `4px → 3px → 2px`

---

## Page-Specific Examples (From Template)

### Page 38 - Income Approach (Standard Compact)
```css
.page-sheet[data-page-num="Page 38"] .compact-table {
    font-size: 7.5pt;
    margin-bottom: 0;
}
.page-sheet[data-page-num="Page 38"] .compact-table td,
.page-sheet[data-page-num="Page 38"] .compact-table th {
    padding: 4px 6px;
    line-height: 1.3;
}
/* Addresses: 6.5pt */
```

### Page 47 - More Aggressive
```css
.page-sheet[data-page-num="Page 47"] .compact-table td,
.page-sheet[data-page-num="Page 47"] .compact-table th {
    padding: 3px 3px;
    line-height: 1.1;
}
/* font-size: 7.5pt */
```

### Page 59 - Tightest (Maximum Compression)
```css
.page-sheet[data-page-num="Page 59"] {
    font-size: 7.5pt;
}
.page-sheet[data-page-num="Page 59"] td,
.page-sheet[data-page-num="Page 59"] th {
    padding: 2px 3px;
    line-height: 1.1;
}
/* Addresses: 6.5pt */
```

---

## CSS Class Reference

### .compact-table
Apply to any `<table>` that needs tighter spacing:
```html
<table class="compact-table">
```

### Scoped Page Styles
Always scope CSS to specific pages to avoid affecting others:
```css
.page-sheet[data-page-num="Page XX"] .your-class {
    /* styles here */
}
```

---

## Compression Levels

| Level | Font | Padding | Line-Height | Use Case |
|-------|------|---------|-------------|----------|
| Normal | 9-10pt | 6-8px | 1.4-1.5 | Most pages |
| Light | 8-9pt | 4-6px | 1.3 | Slightly tight pages |
| Medium | 7.5-8pt | 3-4px | 1.2 | Moderate overflow |
| Tight | 7.5pt | 2-3px | 1.1 | Severe overflow |
| Maximum | 6.5-7pt | 2px | 1.1 | Last resort |

---

## Pages with Known Overflow Issues

| Page | Status | Notes |
|------|--------|-------|
| 28 | Pending | Content overflows footer |
| 59 | Pending | Content overflows footer |
| 60 | Pending | Content overflows footer |
| 61 | Pending | Content overflows footer |

See: `/.claude/plans/template-page-review.md` for full issue tracker

---

## Tips

- **Test after each change** - Small adjustments compound
- **Check print preview** - Screen and print can differ
- **Preserve readability** - Don't go below 6.5pt for any text
- **Use browser DevTools** - Inspect element to test CSS live
- **Scope your CSS** - Always use `[data-page-num="Page XX"]` selector

---

## Related Files

- **Template:** `/public/Report-MF-template.html`
- **Issue Tracker:** `/.claude/plans/template-page-review.md`
- **Field Registry:** `/src/features/report-builder/data/fieldRegistry.ts`
