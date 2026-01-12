# 07-Template-Management

**Status**: ACTIVE
**Last Updated**: 2026-01-12
**Template Version**: v3.0

---

## Overview

Central documentation for Report-MF-template.html management, field mapping, and Report Builder integration.

**Template File**: `public/Report-MF-template.html`
**Store File**: `src/features/image-configurator/report-builder/store/reportBuilderStore.ts`
**Current Pages**: 75+ pages
**Current Fields**: 1,700+ mapped fields

---

## Current Pipeline Status

All 4 Report Builder tabs now have complete builder-to-store-to-template pipelines:

| Tab | Inputs | Store | Template | Status |
|-----|--------|-------|----------|--------|
| INCOME | 49 | Wired | Page 48 | Complete |
| SALES | 62 | Wired | Pages 53-60 | Complete |
| COST | 18 | Wired | Page 61 | Complete |
| RECON | 9 | Wired | Pages 62-63 | Complete |

**Next Step**: End-to-end testing (enter data, generate report, verify output)

---

## File Structure

```
07-Template-Management/
├── README.md                              # This file - overview and navigation
├── CHANGELOG.md                           # Version history (v2.6 → v3.0)
│
├── 01-DESIGN-STANDARDS.md                 # Typography, colors, spacing specs
├── 02-FIELD-TOGGLE-SYSTEM.md              # Dev Mode vs User Ready toggle
├── 03-COMPACT-STYLING-GUIDE.md            # CSS compression for page overflow
├── 04-PIPELINE-COMPLETION-SUMMARY.md      # Sessions 3-4 work summary (NEW)
│
├── 05-AGENT-PROMPT-SALES-STORE-FIX.md     # Comp 4-5 store fix (COMPLETED)
├── 06-AGENT-PROMPT-INCOME-TEMPLATE-FIX.md # Type 3-6 + SF column (COMPLETED)
├── 07-AGENT-PROMPT-COST-TEMPLATE-CREATE.md # New Cost page (COMPLETED)
├── 08-FIELD-REGISTRY-GUIDE.md             # Field naming conventions, 4-file sync
│
├── templates/                             # Reusable HTML snippets
│   ├── Template-Page-Field-Mapping.md     # Page-to-field reference
│   ├── comp-sheet-table.html              # Comparable sheet table template
│   ├── header-standard.html               # Standard header template
│   └── table-standard.html                # Standard table template
│
└── archive/                               # Historical/completed docs
    └── REORGANIZATION-PLAN.md             # Migration plan (completed)
```

---

## Quick Reference

### Design Specs
| Element | Value |
|---------|-------|
| Header1 | 18pt, #003b7e, border-bottom |
| Header2 | 11pt, #003b7e, bold |
| Body text | 10pt, #000000 |
| Table headers | 8-9pt, white on #003B7E |
| Table cells | 7-8pt, #000000 |
| Page size | 8.5in x 11in |
| Standard padding | 54px |
| Footer clearance | 180px |

### Key Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Brand Blue | `#003b7e` | Headers, borders |
| Table Header | `#003B7E` | Table backgrounds |
| Light Gray | `#f0f0f0` | Section backgrounds |
| White | `#FFFFFF` | Background, text on blue |

### Field Mapping Pattern
```html
<span
    class="field-mapped"
    data-field-id="{{field-id}}"
    title="{{field-id}}"
    data-sample="Example Value"
>{{field-id}}</span>
```

---

## Recent Changes (v3.0)

**Date**: 2026-01-11
**Commit**: `b34bff2`

### Added
- **Page 61**: Complete Cost Approach template page
- **Page 48**: Type 3-6 rows + AVG SF column
- **Store**: Comp 4-5 field definitions (36 fields)

### Changed
- Reconciliation pages: 61-62 → 62-63
- Certification page: 63 → 64
- Unit Mix table: 9 → 10 columns

See `CHANGELOG.md` for full version history.

---

## Agent Prompts (Completed)

These prompts were executed in Session 4:

| # | Prompt | Status | Result |
|---|--------|--------|--------|
| 05 | SALES Store Fix | DONE | +36 comp4-5 fields |
| 06 | INCOME Template Fix | DONE | +4 type rows, +SF column |
| 07 | COST Template Create | DONE | New Page 61 |

Details in `04-PIPELINE-COMPLETION-SUMMARY.md`.

---

## Template Pages by Section

| Pages | Section | Key Fields |
|-------|---------|------------|
| 1-5 | Cover & TOC | Property info, client info |
| 6-35 | Property Description | Site, improvements, market |
| 36-37 | Income Intro | Market rent survey |
| 48 | Direct Capitalization | Unit mix, income, expenses, NOI |
| 49-51 | Income Approach | Vacancy, value indication |
| 52 | Comparables Map | Subject + 5 comps |
| 53-60 | Sales Comparison | Comp sheets, adjustments |
| 61 | Cost Approach | Land, RCN, depreciation, site (NEW) |
| 62-63 | Reconciliation | Weights, final value |
| 64 | Certification | Legal certification |
| 65-75 | Addenda | Glossary, qualifications |

---

## Templates Subfolder

Reusable HTML/CSS snippets for consistency:

- **Template-Page-Field-Mapping.md** - Reference for which fields map to which pages
- **comp-sheet-table.html** - Standard comparable property table
- **header-standard.html** - Page header with blue border
- **table-standard.html** - Financial data table

---

## Field Statistics (from Phase 16)

**Total Calculator Fields Verified**: 218 fields

| Approach | Input Fields | Output Fields | Total |
|----------|--------------|---------------|-------|
| Income | 29 | 29 | 58 |
| Sales Comparison | 77 | 38 | 115 |
| Cost | 17 | 14 | 31 |
| Reconciliation | 7 | 7 | 14 |
| **Total** | **130** | **88** | **218** |

**Source**: `06-Field-Input-Output-Mapping/05-FIELD-ALIGNMENT-VERIFICATION.md`

---

## Related Documentation

- **Field Registry**: `src/features/image-configurator/report-builder/schema/fieldRegistry.ts`
- **Store**: `src/features/image-configurator/report-builder/store/reportBuilderStore.ts`
- **Calculations**: `src/features/image-configurator/report-builder/store/costApproachCalculations.ts`
- **Session Checkpoint**: `~/.claude/checkpoints/session-20260111-204529.json`

---

## Testing Checklist

Before finalizing template changes:

- [ ] Preview in Dev Mode (field IDs visible with yellow highlight)
- [ ] Toggle to User Ready Mode (data-sample values show)
- [ ] Verify blue borders on all Header1 elements
- [ ] Confirm table headers are blue (#003B7E)
- [ ] Test page breaks (no orphaned content)
- [ ] Check footer positioning (180px clearance)
- [ ] Validate field-mapped spans have data-sample
- [ ] Test with real data injection (calculator pages)

---

## Known Issues

1. **Page numbers 64-72**: Still have old numbers (64-72 should be 65-73)
2. **Cost calculations**: Need verification that `costApproachCalculations.ts` field IDs match template
3. **E2E testing**: Data entry through report generation not yet verified

---

**Maintained by**: Claude Opus 4.5 + Ben
**Go-to folder for**: Template modifications, field mapping, design standards
