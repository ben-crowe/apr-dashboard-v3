# File Cleanup Plan - Contract Review Directory

**Created:** 2025-12-14
**Purpose:** Organize 80+ loose files into manageable folders

---

## DUPLICATE WORK FOUND

**4-FIELD-RECONCILIATION.md** (Dec 11, 380 lines) already has:
- Three-way mapping: Valcre Workbook → 2-FIELD-MAPPING → fieldRegistry
- Naming convention differences documented
- Workbook field names (PascalCase) → template IDs (kebab-case)

**This likely solves the 273 missing fields problem!**

The field verification work from today (Dec 13-14) in `field-verification-2025-12-13/` may be DUPLICATE of this earlier work.

---

## Proposed Folder Structure

### Keep in Root (Reference Files)
- `MASTER-FIELD-DIRECTORY.md` - All 7,973 workbook fields
- `4-FIELD-RECONCILIATION.md` - Three-way field mapping ⭐
- `VAL251012 - North Battleford Apt...xlsm` - Source workbook
- `Ref.Report-VAL251012...pdf/docx/html` - Reference report
- `README.md` - Main documentation

### Archive/Old Analysis (Create folder: `archive-gap-analyses/`)
Move these - they're from Dec 8-12 and may be outdated:
- `CONTENT-GAP-ANALYSIS.md`
- `FIELD-COVERAGE-GAP-ANALYSIS.md`
- `REFERENCE-BLUEPRINT-GAP-ANALYSIS.md`
- `COMPONENT-REUSE-AUDIT.md`
- `AUTOMATED-COMPARISON-REPORT.md`

### Session-Specific Work (Create folder: `implementation-sessions/`)
Move completed implementation docs:
- `EXEC-SUMMARY-REBUILD-COMPLETE.md`
- `IMPV-SECTION-EXPANSION-COMPLETE.md`
- `INCOME-SECTION-EXPANSION-COMPLETE.md`
- `SALES-SECTION-EXPANSION-COMPLETE.md`
- `ZONE-SECTION-EXPANSION-COMPLETE.md`
- `PAGE-6-EXECUTIVE-SUMMARY-VERIFICATION-REPORT-FINAL.md`
- `PAGE-1-DATA-FLOW-VERIFICATION-REPORT.md`
- `Calculator-Engine-Valcre-Validation-Report.md`

### Architecture/Guides (Create folder: `architecture-guides/`)
Move planning/architecture docs:
- `APR-V4-ARCHITECTURE.md`
- `APR-V4-IMPLEMENTATION-GUIDE.md`
- `V4-REPORT-TEMPLATE-SPECIFICATION.md`
- `IMPLEMENTATION-ROADMAP.md`
- `MASTER-BUILD-PLAN-PDF-SECTION-UPDATE.md`
- `CSS-IMPLEMENTATION-GUIDE.md`
- `LAYOUT-PATTERN-LIBRARY.md`

### Tools/Scripts (Create folder: `tools-scripts/`)
Move any .md files that are about tooling:
- `ANTIGRAVITY-IDE-TESTING-GUIDE.md`
- `Workflow-MSvsGoogle.md`

### Catalog/Reference (Create folder: `catalogs/`)
Move inventory/catalog files:
- `IMAGE-TABLE-CATALOG.md`
- `PAGE-INVENTORY.md`
- `COMPONENT-CATALOG.md`
- `QUICK-REFERENCE.md`

### Screenshots/Media (Create folder: `media/`)
Move all .png, .svg files:
- All screenshots
- Logo files
- Test images

### Delete Candidates
These look like temporary/outdated files:
- `session.md`
- `session-continue-4.md`
- `plan-notes-25-12-07.md`
- `Full Session-backup.md`
- `continuous-flow-document-research.md`
- `cover-page-exact.html` / `cover-page-reference.html`
- `pandoc-output.html`

---

## IMMEDIATE ACTION NEEDED

Before organizing, CHECK if `4-FIELD-RECONCILIATION.md` already solves the 273 missing fields:

1. Read the full file (380 lines)
2. See if it maps the missing fields like `site-corner`, `inspection-date`, etc.
3. If YES → Archive `field-verification-2025-12-13/` as duplicate work
4. If NO → Keep both and understand why they're different

---

## Folder Creation Commands

```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review

# Create folders
mkdir -p archive-gap-analyses
mkdir -p implementation-sessions
mkdir -p architecture-guides
mkdir -p tools-scripts
mkdir -p catalogs
mkdir -p media

# Move files (run after confirming what to keep)
# ... specific mv commands based on your decisions
```

---

## Questions for You

1. **Should I read 4-FIELD-RECONCILIATION.md fully to see if it already maps the 273 fields?**
2. **Do you want me to auto-organize or show you the mv commands first?**
3. **Any folders you want named differently?**

This will clean up the directory from 80+ loose files to ~10 organized folders.
