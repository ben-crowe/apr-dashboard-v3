# Binscarth Apartments Report - Page Organization

**Property:** VAL251026 - Binscarth Apartments, 802 Bankview Dr, Drumheller, AB
**Report Date:** 2025-12-12 (Revised v01)
**Organization Date:** 2025-12-17

---

## Directory Structure

```
REPORT Pg Img/
├── doc-page-images/              ← Source SVG files (renamed for consistency)
│   ├── -a-cover.svg              (Front matter - no page numbers)
│   ├── -b-conditions.svg
│   ├── -c-letter.svg
│   ├── -d-table-contents.svg
│   └── Page-01.svg → Page-71.svg (Numbered document pages)
│
└── doc-page-html/
    ├── doc-pages-html-single/    ← Individual page HTML files (to be created)
    └── doc-pages-html-formatted/ ← Batch files + PREVIEW-Master (to be created)
```

---

## File Organization

**Total Files:** 75 SVG files

**Front matter (4 pages - no page numbers):**
- `-a-cover.svg` - Cover page
- `-b-conditions.svg` - Conditions page
- `-c-letter.svg` - Letter of Transmittal
- `-d-table-contents.svg` - Table of Contents

**Numbered pages (71 pages):**
- `Page-01.svg` through `Page-71.svg`

---

## Naming Convention

Matches the North Battleford property naming convention:

**Front matter:**
- Prefix: `-[letter]-` (dash, lowercase letter, dash)
- Letters: `a`, `b`, `c`, `d`
- Descriptive names: `cover`, `conditions`, `letter`, `table-contents`
- Sorts alphabetically before numbered pages

**Numbered pages:**
- Format: `Page-[NN].svg`
- Two-digit padding: `01`, `02`, etc.
- Sequential numbering from 01 to 71

---

## Source Files

**Original SVG files:** `Binscarth Apt -SVG/`
- Original naming: `VAL251026 - Binscarth Apartments, 802 Bankview Dr, Drumheller, AB Revised v01 2025-12-12_[N].svg`
- Files 1-4: Front matter (cover, conditions, letter, TOC)
- Files 5-75: Numbered pages 1-71

**Mapping:**
- SVG file 1 → `-a-cover.svg`
- SVG file 2 → `-b-conditions.svg`
- SVG file 3 → `-c-letter.svg`
- SVG file 4 → `-d-table-contents.svg`
- SVG file 5 → `Page-01.svg`
- SVG file 6 → `Page-02.svg`
- ...
- SVG file 75 → `Page-71.svg`

---

## Next Steps

1. **Convert SVG to PNG** (if needed for visual reference)
2. **Extract text from SVG files** using Python coordinate-based extraction
3. **Create HTML pages** following the format from North Battleford property
4. **Apply field mapping** using data-sample attribute pattern
5. **Test toggle functionality**

---

## Reference Property

This organization matches the North Battleford property structure:
`/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/`

Use that property as the reference for:
- HTML page structure
- Field mapping patterns
- CSS styling
- Toggle implementation

---

**Organized:** 2025-12-17
**Ready for:** HTML page creation and field mapping
