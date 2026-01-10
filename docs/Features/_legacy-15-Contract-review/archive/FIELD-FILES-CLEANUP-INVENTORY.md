# Field Files Cleanup Inventory

**Created:** December 14, 2025
**Purpose:** Identify duplicates and organize field-related files

---

## DUPLICATE FILES (Need to Archive/Delete)

### 1. Core Field Mapping Files - ROOT DUPLICATES

| File Location (ROOT) | Date Modified | Status | Action |
|---------------------|---------------|--------|--------|
| `2-FIELD-MAPPING.md` | Nov 22 | ⚠️ DUPLICATE | Move to archive (copy in Field Mgt-12.14.25/) |
| `4-FIELD-RECONCILIATION.md` | Dec 11 | ⚠️ DUPLICATE | Move to archive (copy in Field Mgt-12.14.25/) |
| `MASTER-FIELD-DIRECTORY.md` | Dec 6 | ⚠️ DUPLICATE | Move to archive (copy in Field Mgt-12.14.25/) |

**Active copies are in:** `Field Mgt-12.14.25/` folder

### 2. field-verification-2025-12-13 Folders - TRIPLE COPIES

| Location | Status | Action |
|----------|--------|--------|
| `1-Formatting & Report/field-verification-2025-12-13/` | ⚠️ DUPLICATE | Move to archive |
| `z-archive/field-verification-2025-12-13/` | ✅ ARCHIVED | Keep in archive |
| Original location (moved to Field Mgt) | ✅ MOVED | Files now in Field Mgt-12.14.25/ |

---

## UNIQUE FILES (Need to Evaluate)

### File: 5-V3-FIELD-RECONCILIATION.md

**Location:** Root (`/docs/15-Contract-review/`)
**Date:** December 1, 2025
**Purpose:** Different scope - V3 Dashboard section assignments (NOT Valcre mapping)
**Content:** What V3 Sections 3/4/5 should capture (manual fields, photos, narratives)

**Decision Needed:**
- ❓ Keep in root (different purpose than Field Mgt folder)
- ❓ Move to Field Mgt folder (all field-related work together)
- ❓ Move to archive (outdated/superseded)

### File: FIELD-COVERAGE-GAP-ANALYSIS.md

**Location:** Root
**Date:** December 8, 2025
**Purpose:** Gap analysis of field coverage
**Content:** Analysis of missing rental survey, sales comps, income tables

**Decision Needed:**
- ❓ Keep in root
- ❓ Move to Field Mgt folder
- ❓ Move to archive (superseded by 41-FIELD-VERIFICATION-REPORT.md?)

### File: 4-APR-Field-Flow-Map.xlsx

**Location:** Root
**Purpose:** Excel-based field flow mapping
**Date:** Unknown

**Decision Needed:**
- ❓ Keep in root
- ❓ Move to Field Mgt folder
- ❓ Move to archive

---

## PASSOVER SESSION FILES (Historical Documentation)

Located in: `-passover-sessions/`

| File | Date | Purpose |
|------|------|---------|
| 25.12.06-7-Master-Field-Directory-Extraction.md | Dec 6 | MASTER-FIELD-DIRECTORY creation |
| 25.12.08-12-V3-Dashboard-Field-Mapping.md | Dec 8 | V3 Dashboard mapping |
| 25.12.08-13-Image-Field-Mapping-Table.md | Dec 8 | Image field mapping |
| 25.12.09-15-S1-S2-Field-Migration-Planning.md | Dec 9 | S1-S2 migration |
| 25.12.10-4-Workbook-Field-Validation-Mapping.md | Dec 10 | Workbook validation |

**Status:** ✅ Keep as historical record (already in passover-sessions folder)

---

## IMAGE FIELD MAPPING FILES

Located in: `North Battleford Apt -Report-content extracted copy/REPORT Pg Img/`

| File | Purpose |
|------|---------|
| `image-field-mapping.json` | Image field mappings |
| `existing-fields-mapping.json` | Existing field mappings |
| `new-fields-needed.json` | New fields list |
| `FIELD-CROSS-REFERENCE-SUMMARY.md` | Cross-reference summary |
| `master-field-mapping.json` | Master mapping |
| `master-field-mapping-consolidated.json` | Consolidated mapping |

**Status:** ❓ Evaluate - Are these still relevant or superseded by Field Mgt work?

---

## RECOMMENDED CLEANUP ACTIONS

### Phase 1: Archive Root Duplicates (SAFE - copies exist)

```bash
# Move root duplicates to archive
mv /docs/15-Contract-review/2-FIELD-MAPPING.md \
   /docs/15-Contract-review/z-archive/

mv /docs/15-Contract-review/4-FIELD-RECONCILIATION.md \
   /docs/15-Contract-review/z-archive/

mv /docs/15-Contract-review/MASTER-FIELD-DIRECTORY.md \
   /docs/15-Contract-review/z-archive/
```

### Phase 2: Archive Duplicate field-verification Folder

```bash
# Move duplicate field-verification to archive
mv "/docs/15-Contract-review/1-Formatting & Report/field-verification-2025-12-13" \
   /docs/15-Contract-review/z-archive/field-verification-2025-12-13-copy2
```

### Phase 3: Evaluate Unique Files

**Need decisions on:**
1. `5-V3-FIELD-RECONCILIATION.md` - Keep/Move/Archive?
2. `FIELD-COVERAGE-GAP-ANALYSIS.md` - Keep/Move/Archive?
3. `4-APR-Field-Flow-Map.xlsx` - Keep/Move/Archive?
4. Image field mapping JSON files - Keep/Archive?

### Phase 4: Update References

After moving files, search for broken links:

```bash
grep -r "2-FIELD-MAPPING.md" /docs/15-Contract-review/*.md
grep -r "4-FIELD-RECONCILIATION.md" /docs/15-Contract-review/*.md
grep -r "MASTER-FIELD-DIRECTORY.md" /docs/15-Contract-review/*.md
```

---

## CURRENT VERIFIED STRUCTURE

**✅ ACTIVE FOLDER:** `Field Mgt-12.14.25/`

Contains:
- `README.md` (master guide)
- `2-FIELD-MAPPING.md` (Nov 22)
- `3-EXCEL-ANALYSIS.md` (Nov 29)
- `4-FIELD-RECONCILIATION.md` (Dec 11) ← **NEWEST reconciliation**
- `MASTER-FIELD-DIRECTORY.md` (Dec 6)
- `41-FIELD-VERIFICATION-REPORT.md` (Dec 14)
- `SESSION-SUMMARY.md` (Dec 14)

**Status:** These are the verified, active files for field mapping work

---

## VERIFICATION OF DEC 11 DATE

**Question:** Is Dec 11 the most current field reconciliation work?

**Answer:** YES

**Evidence:**
- `4-FIELD-RECONCILIATION.md` dated Dec 11, 2025 (newest three-way reconciliation)
- `5-V3-FIELD-RECONCILIATION.md` dated Dec 1, 2025 (different purpose - V3 sections)
- `FIELD-COVERAGE-GAP-ANALYSIS.md` dated Dec 8, 2025 (gap analysis, not reconciliation)
- No files dated after Dec 11 for Valcre ↔ fieldRegistry mapping

**Conclusion:** Field Mgt-12.14.25 (containing Dec 11 work) IS the most current field reconciliation source.

---

## NEXT STEPS

1. **Archive root duplicates** (Phase 1)
2. **Archive duplicate field-verification folder** (Phase 2)
3. **Decide on unique files** (Phase 3)
4. **Update README.md in Field Mgt folder** to reference final structure
5. **Proceed with 27 missing fields work** using Field Mgt-12.14.25 as source

---

**Status:** Ready for cleanup - awaiting user decisions on Phase 3 files
