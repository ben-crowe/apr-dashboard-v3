# PREVIEW-Master.html - APR Report Template

**Protected Template Folder** - This directory contains the master HTML template for the APR appraisal report.

---

## File Information

- **File:** PREVIEW-Master.html
- **Status:** Active Master Template
- **Total Pages:** 72+ (including appendices)
- **Last Updated:** December 18, 2025

---

## Session History

### Session: December 18, 2025
**Date:** 2025-12-18
**Completed Pages:** 65-72 (8 pages)

#### Pages Added:
- **Page 65** - Final Estimate of Value
  - Market Value Conclusion table
  - Actual signature image (base64-encoded)
  - Appraiser details with field-mapped values

- **Pages 66-68** - Contingent & Limiting Conditions (3 pages)
  - 18 numbered legal disclaimer items
  - Client authorization, market conditions, legal matters, compliance, surveys, testimony, environmental conditions, digital signatures, liability, market stability

- **Pages 69-72** - Definition of Terms (4 pages)
  - 54 key appraisal concepts glossary
  - Terms include: Absorption, Ad Valorem Tax, Market Value, Lease types, Occupancy Rate, Rentable Area, Usable Area, Value Indication, etc.

#### Commits Made:
1. `ffdaa02` - Page 65 initial addition
2. `43d8eb5` - Page 65 signature replacement
3. `d51464b` - Page 66 Contingent & Limiting Conditions
4. `99c745a` - Page 67 continuation (items 7-14)
5. `883c091` - Page 68 continuation (items 14-18)
6. `a4dd082` - Page 69 Definition of Terms (14 concepts)
7. `d38ba36` - Page 70 continuation (17 concepts)
8. `bbdfc84` - Page 71 continuation (14 concepts)
9. `03d7de2` - Page 72 continuation (9 concepts)

---

## Usage Notes

### Viewing the Report
- Open `PREVIEW-Master.html` in any modern web browser
- The report renders as letter-size pages (8.5" × 11") with proper spacing
- Use browser zoom for easier reading (Ctrl/Cmd + or -)
- Print preview shows accurate page layout for PDF export

### Field Mapping
- All dynamic fields use `{{FieldName}}` placeholder syntax
- Sample data shown via `data-sample` attribute for testing
- Field-mapped spans use `.field-mapped` class for identification

### Page Structure
```html
<div class="page-sheet" data-page-num="Page XX">
  <div class="Header1">Section Title</div>
  <div class="Header2">Subsection Title</div>
  <!-- Content -->
  <div class="page-footer"><!-- Footer with page number --></div>
</div>
```

---

## Important Guidelines

### DO NOT:
- Modify without updating this README
- Make large changes without committing to git
- Alter page dimensions (8.5in × 11in locked)
- Remove field-mapped attributes from dynamic content
- Edit without cross-referencing against source materials

### DO:
- Keep this README updated with any changes
- Make atomic commits (one logical change per commit)
- Test spacing in browser after adding content
- Preserve existing page structure and styling
- Verify against original PDF for accuracy

---

## Pages Status

| Pages | Status | Last Updated |
|-------|--------|--------------|
| 1-59  | Stable | Prior sessions |
| 60-64 | Stable | Dec 13, 2025 |
| 65-72 | ✅ Complete | **Dec 18, 2025** |
| 73-77 | Ready | Existing content |

---

## Next Steps

- Pages 73-77 are ready as-is; no changes needed currently
- May adjust pages 65-72 if spacing/layout issues found during testing
- Browser testing in progress for final visual verification

---

## Questions?

Refer to the master field mapping document: `master-field-mapping-consolidated.json`

**Last Modified:** December 18, 2025
**Maintained By:** Claude Code (APR Report Formatter)
