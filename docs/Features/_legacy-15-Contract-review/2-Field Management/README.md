# Field Management Documentation

**Project:** APR Dashboard Report Builder v3
**Purpose:** Comprehensive field analysis and data flow documentation
**Last Updated:** 2025-12-15

---

## Overview

This directory contains authoritative field management documentation for the APR Dashboard Report Builder. The documentation tracks all data fields from three primary sources:

1. **Word HTML Reference** - Final report output structure (7,967 total fields)
2. **Valcre Excel Workbook** - Legacy data source with formulas and calculations
3. **fieldRegistry.ts** - Application field definitions and store configuration

All analysis files represent the current state of field mapping, alignment, and data flow between these systems.

---

## Active Documentation Files

### Core Field Analysis

#### [MASTER-FIELD-DIRECTORY.md](./MASTER-FIELD-DIRECTORY.md)
**Comprehensive field catalog from Word HTML reference**
- Complete inventory of 7,967 fields extracted from final report HTML
- Organized by table structure and section
- Primary source of truth for report output requirements
- Use this to understand: What fields appear in the final report?

#### [DATA-FLOW-SUMMARY.md](./DATA-FLOW-SUMMARY.md)
**End-to-end field data flow analysis**
- Tracks field journey: fieldRegistry.ts → Store → Word HTML
- Coverage analysis and gap identification
- Field status classifications (complete, partial, missing)
- Use this to understand: How does data flow through the system?

#### [FIELD-ALIGNMENT-REPORT.md](./FIELD-ALIGNMENT-REPORT.md)
**Three-way field alignment between all sources**
- Maps fields between Word HTML, Valcre workbook, and fieldRegistry.ts
- Identifies aligned, partially aligned, and unaligned fields
- Provides reconciliation recommendations
- Use this to understand: Are fields properly connected across systems?

#### [FIELD-INPUT-OUTPUT-CLASSIFICATION.md](./FIELD-INPUT-OUTPUT-CLASSIFICATION.md)
**Input source and calculation classification**
- Categorizes fields by source type (user-input, auto-filled, calculated)
- Identifies which fields require manual entry vs. automation
- Documents calculation dependencies
- Use this to understand: Where does each field's data come from?

#### [FIELD-DESTINATION-MAP.md](./FIELD-DESTINATION-MAP.md)
**Field routing and destination mapping**
- Maps each field to its final report location
- Tracks multiple destinations for shared fields
- Documents field transformations and aggregations
- Use this to understand: Where does each field appear in the output?

#### [TABLE-FIELD-ANALYSIS.md](./TABLE-FIELD-ANALYSIS.md)
**Table structure and field organization**
- Analyzes field groupings within report tables
- Documents table layouts and relationships
- Identifies table-level patterns and dependencies
- Use this to understand: How are fields organized in tables?

### Reference Documentation

#### [VALCRE-WORKBOOK-TECHNICAL-GUIDE.md](./VALCRE-WORKBOOK-TECHNICAL-GUIDE.md)
**Valcre Excel workbook technical documentation**
- VBA macro analysis and code documentation
- Named range catalog (700+ ranges)
- Formula structure and calculation chains
- Cell address mapping and worksheet organization
- Use this to understand: How does the legacy Excel workbook work?

#### [REPORT-TABLE-LAYOUTS.md](./REPORT-TABLE-LAYOUTS.md)
**Final report table format catalog**
- Visual table layouts from PDF output
- Field positioning and alignment specifications
- Table formatting rules and styles
- Use this to understand: What do report tables look like?

---

## Archive

The [archive/](./archive/) directory contains superseded documentation that has been replaced by more comprehensive automated analysis:

- `2-FIELD-MAPPING.md` - Manual field mapping (superseded by FIELD-ALIGNMENT-REPORT.md)
- `27-FIELDS-WORKBOOK-SEARCH-RESULTS.md` - Partial 27 fields (superseded by MASTER-FIELD-DIRECTORY.md)
- `4-FIELD-RECONCILIATION.md` - Old three-way reconciliation (superseded by FIELD-INPUT-OUTPUT-CLASSIFICATION.md)
- `41-FIELD-VERIFICATION-REPORT.md` - Old verification (superseded by TABLE-FIELD-ANALYSIS.md)
- `FIELD-COVERAGE-GAP-ANALYSIS.md` - Outdated gap analysis (superseded by DATA-FLOW-SUMMARY.md)
- `FILE-CLEANUP-RECOMMENDATION.md` - Archive rationale documentation

These files are preserved for historical reference but should not be used for current development.

---

## Quick Reference Guide

**Need to find...**

- **All fields in the final report?** → [MASTER-FIELD-DIRECTORY.md](./MASTER-FIELD-DIRECTORY.md)
- **How data flows through the system?** → [DATA-FLOW-SUMMARY.md](./DATA-FLOW-SUMMARY.md)
- **Which fields are aligned across systems?** → [FIELD-ALIGNMENT-REPORT.md](./FIELD-ALIGNMENT-REPORT.md)
- **Where a field's data comes from?** → [FIELD-INPUT-OUTPUT-CLASSIFICATION.md](./FIELD-INPUT-OUTPUT-CLASSIFICATION.md)
- **Where a field appears in output?** → [FIELD-DESTINATION-MAP.md](./FIELD-DESTINATION-MAP.md)
- **How fields are organized in tables?** → [TABLE-FIELD-ANALYSIS.md](./TABLE-FIELD-ANALYSIS.md)
- **Legacy Excel workbook details?** → [VALCRE-WORKBOOK-TECHNICAL-GUIDE.md](./VALCRE-WORKBOOK-TECHNICAL-GUIDE.md)
- **Report table visual layouts?** → [REPORT-TABLE-LAYOUTS.md](./REPORT-TABLE-LAYOUTS.md)

---

## Field Statistics

- **Total Fields in Report HTML:** 7,967
- **Fields in fieldRegistry.ts:** ~400+
- **Valcre Named Ranges:** 700+
- **Data Sources Analyzed:** 3 (Word HTML, Valcre, fieldRegistry)

---

## Related Documentation

- **Session Summaries:** `../­-passover-sessions/` - Detailed session work logs
- **Sales Comparables Data:** `../4-Sales Comp Approach/` - Sales comp field analysis
- **Contract Review:** `../../` - Parent contract review documentation

---

## Document Generation

All field analysis files are generated through automated extraction and analysis:
- Word HTML parsing (BeautifulSoup/XML extraction)
- Excel workbook analysis (openpyxl, VBA parsing)
- TypeScript AST analysis (fieldRegistry.ts)
- Cross-reference alignment algorithms

Manual updates to these files should be avoided - regenerate from source when possible.

---

**For questions or updates to this documentation, see session summaries in `-passover-sessions/`**
