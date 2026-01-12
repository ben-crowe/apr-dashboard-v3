# APR Dashboard V4 - Documentation Hub

**Purpose:** Master navigation for all APR Dashboard documentation and planning.

**Read this first** before exploring other folders.

**Last Updated:** December 26, 2025

---

## Quick Start for Agents

### 1. Load Domain Knowledge (ALWAYS START HERE)
```
/check-apr-domain-knowledge
```
Loads current field counts, calc engine status, and valuation approach progress.

### 2. For Registry/Workbook Work
```
/check-registry-agent
```
Activates registry expertise with Valcre workbook context.

---

## Core Folders

| Folder | Purpose | Start Here |
|--------|---------|------------|
| `0-APR-Domain-Core-Mgt/` | **PRIMARY** - Domain knowledge, registry docs, workbook analysis | `APR-DOMAIN-KNOWLEDGE-25.12.26.md` |
| `0-Architecture/` | OUTDATED - Historical architecture docs (Nov-Dec 2025) | See README for status |
| `0-Claude Planning/` | Session planning, handoffs, general notes | Various |

---

## Feature Areas

| Folder | Purpose | Status |
|--------|---------|--------|
| `2-Field Management/` | Field registry ground truth, Valcre mappings | Active |
| `3-Calc Eng & Plan Agent/` | Calculator Demo implementation plans | Active |
| `4-Valuation Approaches/` | Three approaches: Income, Sales, Cost | Active |

---

## Three Valuation Approaches

| Approach | Status | Calc Fields | Location |
|----------|--------|-------------|----------|
| **Income** | COMPLETE | 86 fields | `4-Valuation Approaches/1-Income-Approach/` |
| **Sales Comparison** | IN PROGRESS | ~620 needed | `4-Valuation Approaches/2-Sales-Comparison/` |
| **Cost** | NOT STARTED | ~100 needed | `4-Valuation Approaches/3-Cost-Approach/` |

---

## Calculator Demo

**URL:** `http://localhost:PORT/calculator-demo`

**Implementation Plans:**
- `3-Calc Eng & Plan Agent/Calculator-Demo-Implementation-Plan.md`
- `3-Calc Eng & Plan Agent/FEATURE-Sales-Comparison-Approach.md`

**Current Active Plan:**
- `~/.claude/plans/enchanted-tumbling-umbrella.md` (Phases 1-4: Report Tables + All 3 Approaches)

---

## Source of Truth Files

| File | Location | Purpose |
|------|----------|---------|
| **Domain Knowledge** | `0-APR-Domain-Core-Mgt/APR-DOMAIN-KNOWLEDGE-25.12.26.md` | Current state overview |
| Field Registry | `src/features/report-builder/schema/fieldRegistry.ts` | 1,687 field definitions |
| Calc Engine | `src/features/report-builder/store/reportBuilderStore.ts` | Calculation logic |
| Test Data | `src/features/report-builder/data/northBattlefordTestData.ts` | North Battleford values |
| Ground Truth | `2-Field Management/valcre-named-ranges-complete.json` | 9,652 Valcre named ranges |
| HTML Template | `public/Report-MF-template.html` | 79-page report template |

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

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/check-apr-domain-knowledge` | Load current domain knowledge |
| `/check-registry-agent` | Activate registry/workbook expertise |

---

## Archived/Historical

| Folder | Notes |
|--------|-------|
| `0-Architecture/` | Nov-Dec 2025 design docs - outdated field counts, see README |
| `1-Formatting & Report/` | Report formatting specifications |
| `5-Migration Planning/` | V3 to V4 migration notes |
| `6-Source Reports & Workbook/` | Original Valcre workbook files |
| `-passover-sessions/` | Historical session summaries |

---

## System Overview

**Two Systems, Sequential Workflow:**

| System | Purpose | Status |
|--------|---------|--------|
| **APR-V3** | Intake & data gathering | Sections 1-2 in production |
| **APR-V4** | Report builder + Calculator Demo | In active development |

```
Client Form -> APR-V3 -> Valcre (VAL# created) -> APR-V4 -> Report
```

---

## Development

```bash
# Start dev server
cd /Users/bencrowe/Development/APR-Dashboard-v3
npm run dev

# Calculator Demo at: http://localhost:PORT/calculator-demo
# Mock Builder at: http://localhost:PORT/mock-builder
```

---

*For detailed domain knowledge, always start with `/check-apr-domain-knowledge`*
