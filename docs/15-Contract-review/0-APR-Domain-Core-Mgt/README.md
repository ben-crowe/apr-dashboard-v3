# APR Domain Core Management

**Purpose:** Central workspace for APR Dashboard domain knowledge, registry management, and Valcre workbook expertise.

**Start Here:** Read `APR-DOMAIN-KNOWLEDGE-25.12.26.md` first for current state overview.


(NOTE FROM BEN - review these as i added them as i thought they were impotant way to keep all ID Field files in sync:  
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/0-APR-Domain-Core-Mgt/ID File-Sync-INDEX.md
/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/0-APR-Domain-Core-Mgt/ID FILE-SYNC-OVERVIEW.md)

---

## Quick Start

### 1. Load Domain Knowledge
```
/check-apr-domain-knowledge
```

### 2. For Registry/Workbook Work
```
/check-registry-agent
```
Recommends **TypeScript-Pro** persona for code quality.

---

## This Folder Contains

| File | Description |
|------|-------------|
| `APR-DOMAIN-KNOWLEDGE-25.12.26.md` | **PRIMARY REFERENCE** - Field counts, calc engine status, valuation approaches |
| `CALC-ENGINE-FIELD-MAP.md` | Maps calc engine outputs to field registry IDs |
| `VALCRE-TO-TEMPLATE-CROSSWALK.md` | Valcre named ranges to HTML template mapping |
| `VALCRE_REPORT_STRUCTURE.md` | Complete 88-sheet workbook structure |
| `VALCRE_TABLE_FIELD_MAPPING.md` | Table-level field mappings by page |
| `Valcre-HomeTab-*.md` | HomeTab analysis (3 files) |
| `Report-Builder-Field-Registry.md` | Field registry documentation |
| `FIELD-NAMING-CONVENTION-CLEAN.md` | Field ID naming conventions |
| `FIELD-CLASSIFICATION.json` | Field type classifications |
| `FIELD-CONSOLIDATION-MAP.md` | Field consolidation mappings |

---

## Key Locations (Outside This Folder)

### Source Code Files

| File | Location | Purpose |
|------|----------|---------|
| Field Registry | `src/features/report-builder/schema/fieldRegistry.ts` | 1,687 field definitions |
| Calc Engine | `src/features/report-builder/store/reportBuilderStore.ts` | Calculation logic |
| Test Data | `src/features/report-builder/data/northBattlefordTestData.ts` | North Battleford values |
| HTML Template | `public/Report-MF-template.html` | 79-page report template |

### Documentation Folders

| Folder | Purpose |
|--------|---------|
| `../2-Field Management/` | Ground truth JSON (9,652 ranges), Valcre mappings |
| `../3-Calc Eng & Plan Agent/` | Calculator Demo implementation plans |
| `../4-Valuation Approaches/` | Three approaches: Income, Sales, Cost |

---

## Three Valuation Approaches

| Approach | Status | Calc Fields | Location |
|----------|--------|-------------|----------|
| **Income** | COMPLETE | 86 fields | `../4-Valuation Approaches/1-Income-Approach/` |
| **Sales Comparison** | IN PROGRESS | ~620 needed | `../4-Valuation Approaches/2-Sales-Comparison/` |
| **Cost** | NOT STARTED | ~100 needed | `../4-Valuation Approaches/3-Cost-Approach/` |

---

## Calculator Demo

**URL:** `http://localhost:PORT/calculator-demo`

**Implementation Plans:**
- `../3-Calc Eng & Plan Agent/Calculator-Demo-Implementation-Plan.md`
- `../3-Calc Eng & Plan Agent/FEATURE-Sales-Comparison-Approach.md`

**Current Active Plan:**
- `~/.claude/plans/enchanted-tumbling-umbrella.md` (Phases 1-4)

---

## Key Metrics (Dec 26, 2025)

| Metric | Value |
|--------|-------|
| Total Fields | 1,687 |
| Calculated Fields (Income) | 86 |
| Valcre Named Ranges | 9,652 |
| Template Pages | 79 |
| **Indicated Value (North Battleford)** | **$1,790,000** |

---

## Ground Truth & Verification

| Resource | Location |
|----------|----------|
| Valcre Named Ranges JSON | `../2-Field Management/valcre-named-ranges-complete.json` |
| Ground Truth README | `../2-Field Management/VALCRE-GROUND-TRUTH-README.md` |
| Workbook Technical Guide | `../2-Field Management/VALCRE-WORKBOOK-TECHNICAL-GUIDE.md` |
| Master Page Field Reference | `../2-Field Management/-MASTER-PAGE-FIELD-REFERENCE.md` |

### Quick Verification Command
```bash
# Verify a Valcre named range exists
grep '"IA_YourFieldName"' ../2-Field\ Management/valcre-named-ranges-complete.json
```

---

## Agent Instructions

When working as **Registry & Workbook Expert**:

1. Request **TypeScript-Pro** persona for code quality
2. Read `APR-DOMAIN-KNOWLEDGE-25.12.26.md` for current field counts
3. Verify Valcre IDs in ground truth JSON before adding fields
4. **Keep this folder clean** - curated files only

### Where to Save Files

| File Type | Location |
|-----------|----------|
| Session summaries, scratch files | `../0-Claude Planning/` (working folder) |
| Finalized valuable docs | Here (after curation) |
| Domain knowledge updates | Update `APR-DOMAIN-KNOWLEDGE-*.md` here |

**Do NOT dump session summaries here.** Use `../0-Claude Planning/` for working files.

---

## Archived/Historical

| Folder | Notes |
|--------|-------|
| `../0-Architecture/` | Nov-Dec 2025 design docs - OUTDATED, see its README |
| `../0-Claude Planning/` | Session planning, handoffs |
| `../-passover-sessions/` | Historical session summaries |

---

*Last Updated: December 26, 2025*
