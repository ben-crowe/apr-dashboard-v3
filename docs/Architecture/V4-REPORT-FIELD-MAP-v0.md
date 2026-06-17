---
title: Report Field Map v0 — Consolidated, Section-Level
status: draft-for-review
audience: Ben + KN-Mgr
date: 2026-06-16
scope: APR multi-page appraisal report (VAL251012 North Battleford reference)
purpose: One reviewable view that consolidates ALL existing field-mapping work into a section/page-level table. NOT a new design — a roll-up of what already exists on disk.
tags: [apr, report-builder, field-map, consolidation, review]
---

# Report Field Map v0 — Section-Level Review Sheet

This is a **consolidation of existing work**, not a new design. It rolls up the page structure, the cell-to-named-range mappings, the field consolidation map, the image map, and the calculator subset maps into ONE section-level table so Ben + KN-Mgr can review the whole report in one pass — without reading the ~2,082 individual fields.

**Reference report:** VAL251012 — North Battleford Apartments (74 physical pages / 70 footer-numbered).

---

## 1. How to read the status columns

For each section, three best-effort flags (NOT a deep per-field audit):

- **Code?** — is there a field code / render function for this section in the app (registry IDs, page render functions)?
- **Template?** — is the placeholder present in the HTML report template (`public/Report-MF-template.html`, 79-page template)?
- **Registry?** — do the field entries exist in `fieldRegistry.ts`?

Symbols: ✅ present · 🟡 partial / mixed · ❌ not yet · — n/a.

**Field source mix legend:** U = user-input · C = calculated · I = image · A = auto-from-job (S1/S2 intake/LOE) · X = external/market data.

---

## 2. Section / Page Map (whole report)

### Front Matter (physical pp. 1–4, no footer #)

| Section | Pages | Contains | Source mix | Detailed mapping lives in | Code? | Tmpl? | Reg? |
|---|---|---|---|---|---|---|---|
| Cover | 1 | Property photo, title block, client+appraiser addresses, dates, file no. | A, I | FIELD-CONSOLIDATION-MAP (S1/S2), TDD-map §01, IMAGE-MAPPING (cover-photo) | ✅ | ✅ | ✅ |
| Transmittal Letter | 2 | Client address, RE line, value-conclusion table (5-col), hypothetical conditions | A, C | TDD-map §02, VALCRE_TABLE §7 (Value Conclusion) | ✅ | ✅ | ✅ |
| Letter Signature | 3 | Signature block, appraiser name + credentials (AACI/MRICS), AIC no. | A, I | FIELD-CONSOLIDATION-MAP (S2 appraiser), IMAGE-MAPPING (signature) | ✅ | ✅ | 🟡 |
| Table of Contents | 4 | Full TOC, section titles + page numbers | C | VALCRE_REPORT_STRUCTURE | 🟡 | ✅ | — |

### Introduction & Executive Summary (footer 1–16)

| Section | Pages | Contains | Source mix | Detailed mapping lives in | Code? | Tmpl? | Reg? |
|---|---|---|---|---|---|---|---|
| Property Overview | 5 | 4 tables: Property ID (6r), Site Desc (7r), Improvement Desc (20+r), Qualitative (7r) | A, U, C | VALCRE_TABLE §5 (EXEC ranges), registry `property-identification`/`site`/`impv`/`exec` | ✅ | ✅ | ✅ |
| Executive Summary | 6 | 4 tables: H&BU (3r), Exposure (2r), Investment Indicators (8r), Value Conclusion (5×5) | C, U | VALCRE_TABLE §6 + §7, TDD-map §06, registry `exec` | ✅ | ✅ | ✅ |
| Hypothetical Conditions | 7 | Narrative — assumptions, extraordinary assumptions/limiting conditions | U | TDD-map §04/§22 (extraordinary-*) | ✅ | ✅ | 🟡 |
| Photographs | 8–12 | ~25 property photos in 2×3 caption grid | I | IMAGE-MAPPING, TDD-map S3 (exterior/street/common/unit/systems) | ✅ | ✅ | ✅ |
| Maps | 13–15 | 3 full-page maps (street, regional, area) | I | IMAGE-MAPPING (`img-map-*`), TDD-map S3 | ✅ | ✅ | ✅ |
| Identification of Assignment | 16–20 | Property ID, legal desc, client ID, authorized use, dates, purpose, scope, sources-of-info table, inspection table | A, U | TDD-map §04, registry `client-intake`/`loe-prep` | ✅ | ✅ | ✅ |

### Property Analysis (footer 17–27)

| Section | Pages | Contains | Source mix | Detailed mapping lives in | Code? | Tmpl? | Reg? |
|---|---|---|---|---|---|---|---|
| Location | 21 | Access, transit, walk/bike scores, local area, schools | U | TDD-map §09 (`location-*`), registry `market`/`site` | ✅ | ✅ | ✅ |
| Site Details | 22–23 | Land area table, site characteristics, adjacency, frontage/traffic (9-col), exposure, easements, soils, hazmat, rating, conclusion | U | TDD-map §08, **07-Report-Builder/.claude site/frontage/traffic fields** (Priority 1–5, partly unbuilt), VALCRE_TABLE §5 (Site ranges) | 🟡 | ✅ | 🟡 |
| Site Plans | 24–25 | 2 full-page lot plan diagrams | I | IMAGE-MAPPING (`img-site-plan-*`) | ✅ | ✅ | ✅ |
| Property Taxes & Assessment | 26 | Assessment + tax table (4-col), commentary | U | TDD-map §10 (`tax-*`), registry `site` | ✅ | ✅ | ✅ |
| Land Use & Planning | 27 | Zoning table (8r), zoning conclusion | U | TDD-map §13 (`zone-*`), **.claude zoning Priority 4 (partly unbuilt)** | 🟡 | ✅ | 🟡 |
| Zoning Map | 28 | Full-page zoning map | I | IMAGE-MAPPING (`img-zoning-map`) | ✅ | ✅ | ✅ |
| Description of Improvements | 29–31 | Overview narrative, unit-mix table (5-col), Building Description table (25r components) | U, C | VALCRE_TABLE §8 (UNITMIX) + §9 (IMPV), TDD-map §12, registry `impv` (93) | ✅ | ✅ | ✅ |

### Market Context (footer 28–30)

| Section | Pages | Contains | Source mix | Detailed mapping lives in | Code? | Tmpl? | Reg? |
|---|---|---|---|---|---|---|---|
| Economic Overview — National | 32 | Canada narrative + indicators table (13r) | X, U | VALCRE_TABLE §10 (external feeds), TDD-map §11, registry `market` | 🟡 | ✅ | 🟡 |
| Economic Overview — Provincial | 33 | Saskatchewan narrative + indicators table (15r) | X, U | same as above | 🟡 | ✅ | 🟡 |
| Multi-Family Market Overview | 34 | SK rental narrative + multifamily indicators (8r) | X, U | VALCRE_TABLE §10, registry `market` | 🟡 | ✅ | 🟡 |

### Valuation & Conclusions (footer 31–61)

| Section | Pages | Contains | Source mix | Detailed mapping lives in | Code? | Tmpl? | Reg? |
|---|---|---|---|---|---|---|---|
| Highest & Best Use | 35–36 | As-vacant + as-improved analysis, most probable buyer | U | TDD-map §14 (`hbu-*`) | ✅ | ✅ | ✅ |
| Valuation Methodology | 37–38 | Approach narratives, Approaches-Applied table (4r) | U, C | TDD-map §15, VALCRE_TABLE §7 | ✅ | ✅ | ✅ |
| **Income Approach** | 39–51 | Rent roll (10-col), survey comparison (5 comps), market-rent analysis (1BR/2BR), contract-vs-market, revenue, vacancy/EGR, operating history, expense conclusions, cap-rate selection + 2 charts, **Direct Cap pro forma (25+ rows)**, summary | U, C, I | **GOLD: 03-INCOME-APPROACH map (77 rows)**, VALCRE_TABLE §1 (DirCap 150 ranges) + §3 (RentRoll 134) + §4 (Survey 246) + §11 + §12, registry `calc`/`calc-output`/`calc-expenses`/`rent-analysis`/`income`/`rentroll`/`rentcomp1-5` | ✅ | ✅ | ✅ |
| **Direct Comparison Approach** | 52–61 | Intro, comps map, 5 comp summary sheets, **major adjustment grid (subject + 5 comps)**, analysis chart, conclusion | U, C, I | **GOLD: 04-SALES-COMPARISON map (115 rows)**, VALCRE_TABLE §2 (SALE1 312 ranges), IMAGE-MAPPING (comp photos/maps), registry `sales`/`sales-comparison`/`sale-comp-1-5`/`comp1-5` | ✅ | ✅ | ✅ |
| Reconciliation of Value | 62–63 | Reconciliation-of-values table, final value conclusion, hypothetical conditions | C, U | **06-RECONCILIATION map (14 rows)**, VALCRE_TABLE §7 (VALUES), registry `cost`/recon fields | ✅ | ✅ | 🟡 |
| Certification | 64 | Certification header + 11-point list | U, A | TDD-map §22 (`cert-*`), registry `cert` (36) | ✅ | ✅ | ✅ |
| Final Estimate of Value | 65 | Market-value conclusion table (5-col), conditions, signature | C, I, A | VALCRE_TABLE §7, IMAGE-MAPPING (signature) | ✅ | ✅ | ✅ |

### Appendices (footer 62–70)

| Section | Pages | Contains | Source mix | Detailed mapping lives in | Code? | Tmpl? | Reg? |
|---|---|---|---|---|---|---|---|
| Contingent & Limiting Conditions | 66–68 | 18-point numbered boilerplate | U (static) | VALCRE_REPORT_STRUCTURE only | 🟡 | ✅ | ❌ |
| Definition of Terms | 69–72 | Alphabetical glossary boilerplate | U (static) | VALCRE_REPORT_STRUCTURE only | 🟡 | ✅ | ❌ |
| Qualifications of Appraiser | 73 | Logo, headshot, bio, credentials, contact | A, I | FIELD-CONSOLIDATION-MAP (S2), IMAGE-MAPPING | 🟡 | ✅ | 🟡 |
| Back Cover | 74 | Valta contact block, footer disclaimer | static | VALCRE_REPORT_STRUCTURE only | 🟡 | 🟡 | ❌ |

### Cost Approach (NOT in this reference report — narrated as "not undertaken")

| Section | Pages | Contains | Source mix | Detailed mapping lives in | Code? | Tmpl? | Reg? |
|---|---|---|---|---|---|---|---|
| Cost Approach (latent) | — | Land val, RCN, depreciation, site improvements | U, C | **05-COST-APPROACH map (31 rows)**, registry `cost` (32) | ✅ | 🟡 | ✅ |

---

## 3. FRESH field count (counted now, not trusted from docs)

Counted directly from `fieldRegistry.ts` this session (`grep -cE "^\s+id: ['\"]"`):

| Metric | Real number (counted now) |
|---|---|
| **Total field definitions** | **2,082** |
| user-input | 1,557 |
| calculated | 421 |
| auto-filled | 95 |
| api-fetch | 8 |
| valcre-mapping | 1 |
| image-type fields | 95 |
| distinct `section` values | 190 |
| `calc-*` prefixed fields | 183 (127 calculated + 37 user-input + others) |

**Calculator-subset maps (docs 03–06) field-row counts:** Income 77 · Sales 115 · Cost 31 · Reconciliation 14 ≈ **237 calc rows mapped** (subset of the 421 calculated + their inputs).

### Doc-count DRIFT — call it out

The docs disagree with the live registry. **Trust the 2,082 number; the others are stale.**

- `CLAUDE.md` (project root) and `VALCRE_REPORT_STRUCTURE`-era docs say **2082** — matches. ✅
- `TDD-VS-EDITOR-PANEL-FIELD-MAP.md` says **"~1,687 fields (v2.3.0)"** and **"~450 TDD / ~340 Editor"** — **stale, undercount by ~400.** ❌
- `FIELD-CONSOLIDATION-MAP.md` projects "S1 ~25 / S2 ~20 / S3 ~158" — aspirational target, not current.
- Live section counts differ from the TDD doc (e.g. registry `image-mgt` = 134, doc says "70+"; registry has 190 sections vs the doc's 24 TDD tabs). The registry is far more granular than the tab docs imply.

Bottom line: the **tab-level docs describe an earlier, smaller registry.** The 2,082-field registry is the source of truth; the section-level rollups in those docs are still directionally useful but the totals are wrong.

---

## 4. GOLD MINE vs WHITE SPACE

### Already richly mapped (GOLD — reuse, don't redo)

- **Calculator engine (Income / Sales / Cost / Reconciliation):** docs 03–06 give explicit input→output→formula→report-page mapping. This is the most complete part of the whole system. ✅
- **Valcre cell-to-named-range mapping:** `VALCRE_TABLE_FIELD_MAPPING.md` maps the priority tables to **7,988 Valcre named ranges** with exact cell refs (DirCap 150, SALE1 312, Survey 246, RentRoll 134, IMPV 206, etc.). This is the bridge from Valcre workbook → report cells. ✅
- **Page-by-page structure:** `VALCRE_REPORT_STRUCTURE.md` — authoritative 74-page layout, 40 tables inventoried, all charts/maps/photos catalogued. ✅
- **Image slots:** `IMAGE-MAPPING-ISSUES-AND-FIXES.md` + TDD-map S3 — ~95 image fields with destinations, plus known mis-assignments flagged. ✅
- **Intake/LOE → report flow:** `FIELD-CONSOLIDATION-MAP.md` — S1/S2 as source of truth, computed/derived fields, "Managed in S1/S2/S3" link pattern. ✅

### White space (NOT field-mapped yet)

- **Appendix boilerplate** (Contingent & Limiting Conditions, Definition of Terms, Back Cover) — present in template as static text, but **no registry entries / no field-level mapping.** Likely intentional (static), but should be confirmed.
- **Market/economic indicator tables (pp. 32–34)** — sourced from external feeds; the mapping doc only says "imported/linked data." **No concrete field IDs or data source wired.** Biggest genuine gap.
- **Site / frontage / traffic / zoning detail fields (pp. 22–27)** — the `07-Report-Builder/.claude/CLAUDE.md` lists ~40 of these as **still-to-add to the registry** (Priority 1–5). Partly unbuilt.
- **TOC + page-number generation** — structural, no field map.

---

## 5. OPEN QUESTIONS for Ben (ambiguities in the existing docs)

1. **Which registry is canonical?** Two paths appear in the docs: `src/features/image-configurator/report-builder/schema/fieldRegistry.ts` (counted: 2,082) vs `src/features/report-builder/data/fieldRegistry.ts` (cited in the 07 `.claude` guide). Confirm which one is live so the count is anchored to the right file.

2. **Cost Approach — keep latent fields?** This report narrates Cost Approach as "not undertaken," yet there are 32 `cost` registry fields + a full 05-map. Keep them for other property types, or prune?

3. **Market/economic tables — what's the data source?** pp. 32–34 say "external feeds / imported data" with no field IDs. Manual entry, Valcre pull, or a market-data API? This is the largest unmapped block.

4. **Static appendices — fielded or frozen?** Should Contingent Conditions / Definition of Terms be registry-backed (editable per job) or hard-coded boilerplate in the template?

5. **Drift fix — do we retire the stale tab docs?** The TDD-vs-Editor map (1,687) and its tab counts are ~400 fields behind. Refresh them to 2,082, or treat this v0 sheet as the new section-level source and deprecate the tab totals?

6. **Image mis-assignments** — IMAGE-MAPPING flags known wrong/duplicate slots (e.g. `img-map-regional` → logo). Fixed since Dec, or still open?

---

## Source documents (full paths)

- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/Ref.Report-VAL251012-North Battleford Apt.docx`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.docx`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/2-Field Management/valcre-mappings/VALCRE_REPORT_STRUCTURE.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/2-Field Management/valcre-mappings/VALCRE_TABLE_FIELD_MAPPING.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/0-APR-Core-to org/FIELD-CONSOLIDATION-MAP.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/0-APR-Core-to org/IMAGE-MAPPING-ISSUES-AND-FIXES.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/07-Report-Builder/0-Claude Planning/TDD-VS-EDITOR-PANEL-FIELD-MAP.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/image-configurator/report-builder/schema/fieldRegistry.ts` (2,082 defs — counted this session)
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/03-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/04-SALES-COMPARISON-INPUT-OUTPUT-MAP.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/05-COST-APPROACH-INPUT-OUTPUT-MAP.md`
- `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/06-RECONCILIATION-INPUT-OUTPUT-MAP.md`
