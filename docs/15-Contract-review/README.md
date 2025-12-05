# APR System Planning Documentation

**Last Updated:** December 5, 2025
**Status:** V4 Report Builder In Development - CALC Engine Verified

---

## System Overview

**Two Systems, Sequential Workflow:**

| System | Purpose | Status |
|--------|---------|--------|
| **APR-V3** | Intake & data gathering (5 sections) | Sections 1-2 in production, 3-5 need field gaps |
| **APR-V4** | Report builder (21 sections, 395+ fields) | **In Development** - CALC engine verified |

```
Client Form -> APR-V3 -> Valcre (VAL# created) -> APR-V4 (pulls VAL# data) -> Report
```

---

## Current Progress (V4 Report Builder)

**Location:** `/src/features/report-builder/`

| Component | Lines | Status |
|-----------|-------|--------|
| `store/reportBuilderStore.ts` | ~3,200 | 21 sections with full field structures + CALC engine |
| `templates/reportHtmlTemplate.ts` | 2,505 | 10 custom render functions + boilerplate |
| Preview Panel | Complete | Zoom, drag-to-pan, PDF/DOCX export, auto-scroll to section |
| Edit Panel | Complete | Field editing with color-coded input types |
| **CALC Engine** | **Verified** | Matches Valcre output ($1,780,000 test case) |

**Custom Render Functions (10):**
- Site, Tax, Zone, HBU, Recon, Income, Impv, Sales, Photos, Certification

**Store Sections (21):**
COVER, HOME, CUSTOM, MAPS, REPORT, EXEC, PHOTOS, SITE, LOCATION, TAX, MARKET, IMPV, ZONE, HBU, **CALC**, LAND1, COST-S, SALES, INCOME, SURVEY1, RECON

### CALC Section - Calculator Engine

**Purpose:** Self-contained income approach calculator sandbox

| Subsection | Fields | Description |
|------------|--------|-------------|
| Unit Mix | 26 | 4 unit types with count/SF/rent + totals |
| Other Income | 7 | Parking, Laundry, Other, PGR |
| Vacancy & Loss | 5 | Vacancy/Bad Debt/Concessions rates, EGR |
| Operating Expenses | 12 | 10 expense categories with 5 calc bases |
| Capitalization | 1 | Cap rate input |
| Post-Value Adjustments | 4 | CapEx, Leasing, Other |
| Valuation Results | 8 | NOI, Values, Ratios, GRM |

**Expense Calculation Bases:**
- `percent_pgr` - % of Potential Gross Revenue
- `percent_egr` - % of Effective Gross Revenue
- `fixed` - Fixed dollar amount
- `per_unit` - $ per unit
- `per_sf` - $ per square foot

**Calculation Flow:**
```
Unit Mix -> Rental Revenue -> PGR -> EGR -> NOI -> Value -> RECON sync
```

**Test Data Loader:** Click "Load Valcre Test Data" button in CALC section to verify calculations

---

## Key Planning Documents

### V4-REPORT-TEMPLATE-SPECIFICATION.md (NEW)
**Purpose:** Complete template specification with boilerplate text
- 21 sections with exact HTML structure
- Typography standards (Times 12px, colors)
- All 500+ fields with placeholder syntax
- Table layouts matching Valcre reports

**Use For:** HTML template implementation, boilerplate text reference

---

### #1 - APR-V4-IMPLEMENTATION-GUIDE.md
**Purpose:** Quick-start action guide for development
- Two-system relationship (V3 intake -> V4 report builder)
- Git branch workflow for safe V3 development
- V3 Sections 3-5 field gaps summary
- Implementation sequence and first tasks

**Start Here:** For understanding what to build and in what order

---

### #2 - FIELD-MAPPING.md (2-FIELD-MAPPING.md)
**Purpose:** Source of truth for all 330+ report fields
- 19 report sections with field IDs
- Data types and examples
- Validation rules
- Data sources (Valcre, Calculator, Manual)

**Use For:** Field definitions, database schema design, form building

---

### #3 - EXCEL-ANALYSIS.md (3-EXCEL-ANALYSIS.md)
**Purpose:** Complete technical analysis of Valcre Excel template
- 7,988 named ranges inventory
- Critical calculation outputs and cell locations
- VBA dependency assessment (LOW - formulas work without VBA)
- Sheet structure breakdown (88 sheets)

**Use For:** Excel import implementation, named range extraction

---

### #4 - APR-V4-ARCHITECTURE.md
**Purpose:** Full technical architecture specification
- System architecture and data flow
- Dual calculator specification (internal vs Excel comparison)
- Live HTML preview system
- Client link delivery system
- Database schema
- 7-phase implementation sequence

**Use For:** Technical decisions, system design, architecture reference

---

### #5 - V3-FIELD-RECONCILIATION.md (5-V3-FIELD-RECONCILIATION.md)
**Purpose:** What APR-V3 Sections 3-5 need to capture
- Fields Valcre provides (read-only display)
- Fields V3 must capture (appraiser fills)
- Section 3: Property Details (~30 new fields)
- Section 4: Building Details (~25 new fields)
- Section 5: Photo Gallery (new component)

**Use For:** V3 Section 3-5 development, form field planning

---

### #6 - VALCRE-API-EVALUATION.md
**Purpose:** Valcre API capabilities and gaps
- Working endpoints (OAuth, CREATE Job, UPDATE Job)
- Missing endpoints (READ Job, READ Property - need to add)
- 80+ fields pullable once READ operations added

**Use For:** API integration planning, understanding what's pullable

---

### #7 - COMPONENT-REUSE-AUDIT.md
**Purpose:** What's portable from V2 Report Generator
- Immediately portable: shadcn/ui primitives (25%)
- Light refactoring needed: 35%
- Significant rebuild: auth, routing, state (40%)

**Use For:** Component migration decisions

---

## Session History

Session summaries are stored in: `-passover-sessions/`

| Session | Date | Focus |
|---------|------|-------|
| 1 | Nov 25 | Contract Review README Update |
| 2 | Nov 29 | APR-V4 Analysis Complete |
| 3 | Dec 4 | V4 Template Specification Planning |
| 4 | Dec 4 | Review of Report Sections |
| 5 | Dec 4 | V4 Report Builder Template Implementation |
| 6 | Dec 4-5 | CALC Engine Integration - Preview auto-scroll, calculator verified |

---

## Supporting Documents

### QUICK-REFERENCE-PARSING.md
Copy/paste ready code for Excel extraction

### 1-Workflow Overview.md
Original workflow analysis and process mapping

### 4-APR-Field-Flow-Map.xlsx
Visual Excel showing data flow: APR-V3 -> Valcre -> Report

---

## Sample Files

### VAL251012 - North Battleford Apt.xlsm
Real Valcre appraisal template (88 sheets, 7,988 named ranges)

### VAL251012-North-Battleford-Apt.docx
70-page completed appraisal report for output format reference

---

## Quick Start

### To continue V4 Report Builder:
1. Review `/src/features/report-builder/` components
2. Reference `V4-REPORT-TEMPLATE-SPECIFICATION.md` for boilerplate
3. Run `npm run dev` and navigate to `/mock-builder`

### To test CALC engine:
1. Navigate to CALC tab in sidebar
2. Click "Load Valcre Test Data" button
3. Verify Indicated Value = $1,780,000

### To build V3 Sections 3-5:
1. Read `#5 V3-FIELD-RECONCILIATION.md`
2. Create feature branch per Implementation Guide

### To implement Excel import:
1. Read `#3 EXCEL-ANALYSIS.md`
2. Use `QUICK-REFERENCE-PARSING.md` for code

---

## Development Workflow

```bash
# V4 Report Builder development
cd /Users/bencrowe/Development/APR-Dashboard-v3
npm run dev  # View at localhost:8080/mock-builder (port may vary)

# Safe V3 development (Sections 1-2 are in production)
git checkout -b feature/section-3-property-details
# Vercel auto-deploys from GitHub main
```

---

## Next Actions

1. ~~Review V4 preview in browser~~ - Complete
2. ~~CALC engine implementation~~ - Verified ($1,780,000 matches Valcre)
3. **Get correct color logo** - White version for dark backgrounds
4. **Add Table of Contents page** - Template not yet implemented
5. **Connect to Supabase** - Load real job data by VAL#
6. **Add Location/Market custom templates** - Currently using generic render
7. **Test PDF/DOCX export** - With populated data
8. **Wire CALC to INCOME section** - Display calculated values in report narrative
