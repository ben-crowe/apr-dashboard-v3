# Root Level Files Cleanup Plan

**Created:** December 14, 2025
**Goal:** Remove confusing duplicates, organize valuable files into numbered groups

---

## 🔴 PRIORITY 1: Archive Duplicate Field Files

**These already exist in `2-Field Mgt-12.14.25/` - SAFE TO ARCHIVE:**

```bash
# Move to z-archive/
2-FIELD-MAPPING.md                    # ← Duplicate (in Field Mgt)
3-EXCEL-ANALYSIS.md                   # ← Duplicate (in Field Mgt)
4-FIELD-RECONCILIATION.md             # ← Duplicate (in Field Mgt)
MASTER-FIELD-DIRECTORY.md             # ← Duplicate (in Field Mgt)
```

---

## 🟡 PRIORITY 2: Field Files - Keep or Move?

| File | Date | Decision | Destination |
|------|------|----------|-------------|
| `5-V3-FIELD-RECONCILIATION.md` | Dec 1 | ❓ Different scope (V3 sections) | Keep root OR move to Field Mgt? |
| `4-APR-Field-Flow-Map.xlsx` | Dec 1 | ❓ Excel mapping | Move to Field Mgt OR archive? |
| `FIELD-COVERAGE-GAP-ANALYSIS.md` | Dec 8 | ⚠️ Superseded by 41-FIELD-VERIFICATION? | Archive? |
| `FIELD-FILES-CLEANUP-INVENTORY.md` | Dec 14 | ✅ Just created (meta) | Can archive after cleanup done |
| `FILE-CLEANUP-PLAN.md` | Dec 14 | ✅ Planning doc | Can archive after cleanup done |

---

## 🔵 PRIORITY 3: Move to Group 1 (Formatting & Report)

**CSS & Layout Files:**
```
CSS-IMPLEMENTATION-GUIDE.md
CSS-Paged-Media-Technical-Solutions.md
LAYOUT-PATTERN-LIBRARY.md
PROFESSIONAL-DOCUMENT-TEMPLATE-ANALYSIS.md
CONSOLIDATED-FORMATTING-SPECIFICATION.md
continuous-flow-document-research.md
```

**Component Files:**
```
COMPONENT-CATALOG.md
COMPONENT-REUSE-AUDIT.md
```

**Page Analysis Files:**
```
PAGE-1-DATA-FLOW-VERIFICATION-REPORT.md
PAGE-6-EXECUTIVE-SUMMARY-VERIFICATION-REPORT-FINAL.md
PAGE-6-VERIFICATION-SUMMARY.md
PAGE-BREAK-FIXES.md
PAGE-INVENTORY.md
PDF-FIXES-VERIFICATION-REPORT.md
```

**Section Expansion Files:**
```
EXEC-SUMMARY-REBUILD-COMPLETE.md
IMPV-BEFORE-AFTER-COMPARISON.md
IMPV-SECTION-EXPANSION-COMPLETE.md
INCOME-SECTION-EXPANSION-COMPLETE.md
INCOME-SECTION-STRUCTURE.txt
INCOME-SECTION-TEMPLATE-IMPLEMENTATION.md
SALES-SECTION-EXPANSION-COMPLETE.md
SALES-SECTION-STRUCTURE.md
ZONE-SECTION-EXPANSION-COMPLETE-CODE.md
ZONE-SECTION-EXPANSION-SUMMARY.md
README-ZONE-EXPANSION.md
```

**Implementation/Spec Files:**
```
ASSIGNMENT-SECTION-IMPLEMENTATION.md
EXPORT-IMPLEMENTATION-SUMMARY.md
MOCK-REPORT-BUILDER-IMPLEMENTATION.md
V4-REPORT-TEMPLATE-SPECIFICATION.md
```

**Gap Analysis Files:**
```
CONTENT-GAP-ANALYSIS.md
REFERENCE-BLUEPRINT-GAP-ANALYSIS.md
```

**Coverage & Catalog:**
```
IMAGE-TABLE-CATALOG.md
COVER-PAGE-ANALYSIS.md
AUTOMATED-COMPARISON-REPORT.md
```

---

## 🟢 PRIORITY 4: Move to Group 3 (Calc Eng & Plan Agent)

```
Calculator-Engine-Valcre-Validation-Report.md
```

---

## 🟣 PRIORITY 5: Move to Group 4 (Sales Comp Approach)

```
SALES-COMPARABLES-DATA-MAPPING.md
SALES-SECTION-EXPANSION-COMPLETE.md
SALES-SECTION-STRUCTURE.md
```

---

## 🔶 PRIORITY 6: Archive Old Session/Planning Files

**These are historical and can be archived:**

```bash
# Move to z-archive/historical-sessions/
session.md                            # Old session backup
session-continue-4.md                 # Old session backup
Full Session-backup.md                # Session backup
plan-rebuild.md                       # Old planning
plan-notes-25-12-07.md                # Old planning notes
```

---

## 🔷 PRIORITY 7: Archive HTML Snippets & Test Files

**Development test files - archive:**

```bash
# Move to z-archive/dev-snippets/
cover-page-CORRECTED.html
cover-page-exact.html
cover-page-reference.html
pandoc-output.html
renderZoneSection-EXPANDED.ts.snippet
```

---

## ✅ PRIORITY 8: Files That Can STAY in Root

**Simple/Obvious Files (Not Confusing):**
```
README.md                             # Main readme - KEEP
CC Sig.png                            # Signature image - OK to keep
Valta-blue.2.svg                      # Logo - OK to keep
.DS_Store                             # System file
15-Contract-review.code-workspace     # VS Code workspace
```

**Workflow/Overview (Makes Sense in Root):**
```
1-Workflow Overview.md
1.2-SOP-Manual-Current-cc.md
Workflow-MSvsGoogle.md
```

**Architecture Guides (Could stay or move to Group 1):**
```
APR-V4-ARCHITECTURE.md
APR-V4-IMPLEMENTATION-GUIDE.md
ARCHITECTURE-DIAGRAM.md
IMPLEMENTATION-ROADMAP.md
IMPLEMENTATION-SUMMARY.md
QUICK-START-GUIDE.md
QUICK-REFERENCE.md
QUICK-REFERENCE-PARSING.md
VERIFICATION-CHECKLIST.md
ANTIGRAVITY-IDE-TESTING-GUIDE.md
MASTER-BUILD-PLAN-PDF-SECTION-UPDATE.md
KBPR-INGESTION-PLAN-PDF-FORMATTING-PATTERNS.md
```

**Reference Materials (Probably OK in root):**
```
VAL251012 - North Battleford Apt*.xlsm            # Workbook
VAL251012 - North Battleford Apt*.docx            # Word doc
Ref.Report-VAL251012*.md                          # Markdown
Ref.Report-VAL251012*.pdf                         # PDF
Ref.Report-VAL251012*.html                        # HTML
Ref.Report-VAL251012*.docx                        # Word
appraisal-report-VAL251012*.doc                   # Old format
appraisal-report-VAL251012*.pdf                   # Old PDF
```

**Research/Troubleshooting:**
```
RESEARCH-TypeScript-File-Upload-Issue.md
GEMINI-FILE-SEARCH-INVALID-ARGUMENT-RESEARCH.md
VALCRE-API-EVALUATION.md
```

**Screenshots/Images:**
```
Screenshot 2025-12-12 at 5.28.05 AM.png
Screenshot 2025-12-14 at 7.08.58 AM.png
screencapture-localhost-8082*.png
pg-cover.png
pg ref2.png
tab.png
test-data-page.png
```

**Quick Win Fixes:**
```
QUICK-WIN-FIXES.md
```

---

## 📋 EXECUTION PLAN

### Phase 1: Archive Confirmed Duplicates (SAFE - No Risk)

```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review

# Move field duplicates
mv 2-FIELD-MAPPING.md z-archive/
mv 3-EXCEL-ANALYSIS.md z-archive/
mv 4-FIELD-RECONCILIATION.md z-archive/
mv MASTER-FIELD-DIRECTORY.md z-archive/
```

### Phase 2: Archive Old Sessions

```bash
mkdir -p z-archive/historical-sessions

mv session.md z-archive/historical-sessions/
mv session-continue-4.md z-archive/historical-sessions/
mv "Full Session-backup.md" z-archive/historical-sessions/
mv plan-rebuild.md z-archive/historical-sessions/
mv plan-notes-25-12-07.md z-archive/historical-sessions/
```

### Phase 3: Archive Dev Snippets

```bash
mkdir -p z-archive/dev-snippets

mv cover-page-*.html z-archive/dev-snippets/
mv pandoc-output.html z-archive/dev-snippets/
mv renderZoneSection-EXPANDED.ts.snippet z-archive/dev-snippets/
```

### Phase 4: Organize into Groups (Need to create subdirectories)

**Group 1: Formatting & Report**
```bash
cd "1-Formatting & Report"
mkdir -p css-layout
mkdir -p components
mkdir -p page-analysis
mkdir -p section-implementations
mkdir -p gap-analyses

# Move files (see detailed list above)
```

### Phase 5: Evaluate Field Files (USER DECISION NEEDED)

**Questions for user:**
1. Keep `5-V3-FIELD-RECONCILIATION.md` in root OR move to Field Mgt?
2. Keep `4-APR-Field-Flow-Map.xlsx` OR archive?
3. Archive `FIELD-COVERAGE-GAP-ANALYSIS.md`? (superseded by 41-FIELD-VERIFICATION)

---

## 📊 SUMMARY

**Total Files in Root:** ~100+ files
**Confirmed Archive:** ~15 files (duplicates + old sessions + dev snippets)
**Move to Groups:** ~40 files (formatting, sections, components, etc.)
**Stay in Root:** ~30 files (workflows, architecture, references, images)
**Need User Decision:** 3-5 field-related files

**End Result:** ~35 files in root (down from 100+)

---

## ⚠️ IMPORTANT NOTES

1. **Reference files** (VAL251012 workbook/PDFs) are large but useful - probably OK to keep in root
2. **Architecture guides** could move to Group 1 or stay in root (your choice)
3. **Screenshots** could go to a media folder or stay in root
4. **Cleanup docs** (FIELD-FILES-CLEANUP-INVENTORY.md, FILE-CLEANUP-PLAN.md, this file) can be archived after cleanup is done

---

**Next Step:** Get user decisions on the 3-5 uncertain field files, then execute phases 1-3 (safe archives)
