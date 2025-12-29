# APR Dashboard Export Index

**Session Date:** December 24, 2025  
**Exported:** 2025-12-24 05:45 MST  
**Purpose:** Index of all files to export and preserve from this session

---

## CATEGORY A: Field Registry & Sync Set (CRITICAL)

These 5 files MUST stay in sync. When field IDs change, update all three core files.

| File | Version | Description |
|------|---------|-------------|
| `fieldRegistry.ts` | v2.3.0 | Source of truth for all 1,687 fields |
| `northBattlefordTestData.ts` | v2.3.0 | Test data values (1,778 entries) |
| `Report-MF-Template-Framed-v2_3.html` | v2.3.0 | HTML template with `{{placeholders}}` |
| `FIELD-NAMING-CONVENTION-CLEAN.md` | - | Canonical naming rules (no prefixes) |
| `FIELD-CONSOLIDATION-MAP.md` | - | Old → New field ID mapping |

**Sync Rule:** Template placeholders must match registry IDs must match test data keys.

---

## CATEGORY B: Architecture Documentation

| File | Description |
|------|-------------|
| `TDD-DASHBOARD-TAB-ARCHITECTURE.md` | S1/S2/S3 + numbered tabs explained, "Managed Elsewhere" pattern |
| `SPLIT-PANEL-EDITOR-UX.md` | Dual-mode workflow (TDD bulk entry vs Editor contextual) |
| `APR-DASHBOARD-FILE-SYNC-OVERVIEW.md` | 4-file sync system overview |
| `LOE-TEMPLATE-FIELD-MAPPING.md` | Which S2 fields go to LOE Contract vs Report |

---

## CATEGORY C: Calculator Engine

| File | Description |
|------|-------------|
| `Calc-ENG_Field_Map.md` | Input/output field mapping (~95 inputs, ~85 outputs) |
| `PARKING-LAUNDRY-CALCULATION-HISTORY.md` | Formula issue: per-unit-per-month vs flat annual |
| `Calculator Demo README.md` | How /calculator-demo works (3-panel layout) |
| `INVESTIGATION-Calculator-Value-Discrepancy.md` | $1.78M vs $1.79M analysis |
| `CalculatorDemoPage.tsx` | Main calculator demo component |
| `InputPanel.tsx` | Calculator input fields component |

**Validated Result:** $1,790,000 (North Battleford test data)

---

## CATEGORY D: Image Management

| File | Description |
|------|-------------|
| `IMAGE-FIELD-MAPPING-CORRECTED.json` | 48 image paths mapped from test data |
| `IMAGE-MAPPING-ISSUES-AND-FIXES.md` | Wrong assignments, duplicates, missing |

**Image Field Pattern:**
- `subject-photo-1` through `subject-photo-25`
- `comp1-photo` through `comp5-photo`
- `img-map-regional`, `img-map-local`, `img-map-aerial`
- Each image can have a `-caption` field

---

## CATEGORY E: Sales Comparison (FUTURE BUILD)

| File | Description |
|------|-------------|
| `SALES-COMPARISON-ENGINE-HANDOFF.md` | Full spec for agent to build (~620 fields, 5 comps) |

**Status:** NOT BUILT - Income Approach complete, Sales Comp is next priority.

---

## CATEGORY F: Extraction & Analysis

| File | Description |
|------|-------------|
| `EXTRACTION-STATUS-HANDOFF.md` | Where we left off (74% coverage correct) |
| `HUMAN-INPUT-TEST-DATA.json` | 774 user-input fields for calc engine testing |
| `VALUATIONS-SECTION-ANALYSIS.md` | Breakdown of calc section subsections |

---

## CATEGORY G: Pending Fixes

| File | Description |
|------|-------------|
| `CURSOR-BATCH-FIXES.md` | 12 code/logic fixes for Cursor |
| `FRONTEND-DEV-FIXES.md` | 9 UI/spacing/layout fixes |

---

## Quick Export Command for Cursor

```
Create folder "APR-Dashboard-Handoff-Dec24" and copy:

From /docs/:
- All .md files created this session

From /mnt/user-data/outputs/:
- All files

From src/:
- fieldRegistry.ts
- northBattlefordTestData.ts

From public/:
- Report-MF-template.html (current version)

Create INDEX.md in that folder with this file's contents.
```

---

## File Locations Reference

```
/src/features/report-builder/schema/fieldRegistry.ts
/src/features/report-builder/data/northBattlefordTestData.ts
/public/Report-MF-template.html
/src/pages/calculator-demo/CalculatorDemoPage.tsx
/src/pages/calculator-demo/components/InputPanel.tsx
/docs/15-Contract-review/2-Field Management/*.md
```

---

## Session Summary

**Accomplished:**
- Field consolidation (removed intake-*, loe-* prefixes)
- Sync set aligned at v2.3.0
- Calculator validated at $1,790,000
- Image field cleanup and caption additions
- TDD Dashboard architecture documented
- Split Panel Editor UX documented

**Pending:**
- Cursor batch fixes (12 items)
- Frontend dev UI fixes (9 items)
- Sales Comparison calc engine (separate build)
- Template page overflow fixes (frontend)

---

*Export these files before starting new session.*
