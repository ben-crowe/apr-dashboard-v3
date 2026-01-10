# Reference Pages Viewer

## Quick Start

**View all reference HTML pages:**
```bash
open docs/15-Contract-review/reference-pages-viewer-iframe-style.html
```

**Regenerate viewer:**
```bash
./scripts/concat-html-pages-iframe-style.sh
```

**Old viewers (deprecated):**
- `reference-pages-viewer.html` - simple body concatenation (loses CSS)
- `reference-pages-viewer-fixed.html` - CSS scoping attempt (skipped body styles)
- Use iframe-style version above instead

## What This Is

A simple concatenated viewer of all **77 reference HTML pages** from the source report. These pages:

- ✅ **Have actual content** - North Battleford Apartments data, tables, text
- ✅ **Are visually formatted** - Match the reference PDF styling
- ✅ **Are the SOURCE** - These will be used to extract field IDs and create templates
- ⚠️ **Not connected to Report Builder** - This is separate from the main app preview

## Pages Included

**77 pages total:**
- Page 01 (Cover)
- Page 03-79 (Letter of Transmittal through Back Cover)

**Missing:**
- Page 02 - Not in the source HTML folder

## Purpose

**Visual verification ONLY.** Use this viewer to:

1. ✅ Confirm pages are visually formatted correctly
2. ✅ Compare against reference PDF side-by-side
3. ✅ Identify which content is boilerplate (keep) vs data fields (extract)
4. ✅ Spot any formatting issues before template extraction

## What's Next

After visual confirmation:

1. **Extract field IDs** - Find `${getFieldValue(...)}` patterns in each page
2. **Remove hardcoded data** - Replace with field ID placeholders
3. **Keep boilerplate text** - Standard appraisal language stays in templates
4. **Update `reportPageTemplates.ts`** - Copy cleaned HTML to render functions

## Files

**Viewer:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/reference-pages-viewer.html`

**Source HTML Pages:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/6-Souce Reports & Workbook/Ref-1-North Battleford/REPORT Pg Img/html-pages/`

**Build Script:** `/Users/bencrowe/Development/APR-Dashboard-v3/scripts/concat-html-pages.sh`

## Important Notes

- **Does NOT touch Report Builder** - Completely separate viewer
- **Does NOT modify reportPageTemplates.ts** - Those templates stay as-is
- **Simple concatenation** - Just stitches HTML pages together with page breaks
- **Export to PDF** - Use browser print dialog (File → Print → Save as PDF)

---

**This viewer is read-only and safe to use for visual verification.**
