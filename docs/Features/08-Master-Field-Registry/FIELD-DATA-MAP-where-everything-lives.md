---
content_type: field-data-index
title: Field Data Map — where every piece of field info lives (the one place to look)
status: living index — the answer to "where is the field data?"
owner: co-architect
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
purpose: A single index so nobody has to hunt for where field options, mappings, cascade logic, routing, and the registry source-of-truth live. Built 2026-06-09 after the field-clarity work nearly lost track of these locations.
tags: [apr-workflow, field-registry, field-mapping, index, navigation, where-is-it]
---

# Field Data Map — where everything lives

The one place to answer **"where is the field data / mapping / options / routing?"** — so it's never a hunt again. Each row says what kind of field info it is and exactly where it lives.

---

## Where the field OPTIONS (dropdowns) are defined — the live app

The actual dropdown options + which fields are free-text live in the dashboard section components:

| Dashboard section | Component file |
|---|---|
| Client Info & Property Details (Stage 1) | `src/components/dashboard/job-details/ClientSubmissionSection.tsx` |
| LOE Quote & Valuation Details (Stage 2 — the LOE gate) | `src/components/dashboard/job-details/LoeQuoteSection.tsx` |
| Building Info | `src/components/dashboard/job-details/OrganizingDocsSection.tsx` |
| Data Gathering / Property Research (Stage 3) | `src/components/dashboard/job-details/PropertyInfoSection.tsx` |
| Documents | `src/components/dashboard/job-details/Section4Compact.tsx` |

## Where the CASCADE LOGIC lives (status → scenarios → §10)

- `src/utils/loe/loeCascade.ts` — `STATUS_TO_SCENARIOS` (Status of Improvements → Value Scenarios), the Insurance override, and the `NARRATIVES` text library. **The single source of truth for the cascade.**

## Where the LOE TOKEN MAPPING lives (dashboard field → LOE contract placeholder)

- `src/utils/loe/generateLOE.ts` — `mapDataToV07Fields` maps each dashboard field to its `[V07 Token]` in the contract (e.g. `propertyRightsAppraised → [InterestAppraised]`, `appraisalFee → [Fee]`). Value Scenarios / Approaches / §10 are DERIVED here via `deriveValueScenarios`.

## Where the VALCRE / CLICKUP ROUTING lives (which field goes where)

- **In code:** `LoeQuoteSection.tsx` — the `VALCRE_SYNC_FIELDS`, `CLICKUP_CARD_FIELDS`, and do-NOT-wire arrays (the authoritative wiring); `api/valcre.ts` — the Valcre payload + field mapping.
- **In docs:** [Dashboard→Valcre LOCATION map](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/Valcre-Integration/DASHBOARD-TO-VALCRE-LOCATION-MAP.md) — readback-verified, the human-navigable "where each field lands in Valcre."

## Where the CLIENT REGISTRY (source of truth for option-sets) lives

- `docs/Features/08-Master-Field-Registry/client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx` — the client's own file, pulled from their live SharePoint. The **"Dropdown Lists" tab** holds the authoritative option-sets; the **"Field Registry" tab** holds per-field provenance. `v03` = the client's naming; he bumps it on major changes.

## Where field data is STORED (database)

- Supabase tables: `job_submissions` (intake), `job_loe_details` (LOE/quote fields + DocuSeal columns), `job_property_info` (property research). Instance `ngovnamnjmexdpjtcnky`.

## The working DOCS (this field-clarity effort)

- [Extracted Field Registry — current dashboard](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/EXTRACTED-FIELD-REGISTRY-dashboard.md) — every live field, options, role, routing (from code).
- [Job-Detail Field Audit](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/JOB-DETAIL-FIELD-AUDIT-2026-06-09.md) — dropdown clarity, duplicate conflicts, gaps, the co-arch cross-check.
- [Proposed Section Re-Sort](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PROPOSED-SECTION-RESORT-2026-06-09.md) — the new layout + full field reference table.
- [Mock Dashboard Test Data](~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/MOCK-DASHBOARD-TEST-DATA.md) — one base job, switchable cascade logic, for the version picker.

## The visual surfaces

- **Field Registry Explorer** (live): `https://apr-dashboard-v3.vercel.app/field-registry-v6.html` — source: `public/field-registry-v6.html`. Tabs: Field Registry · Logic Fields · Dashboard & Forms · **Current APR Dashboard** · **Proposed APR Dashboard**. Ben's playground for cascade logic + the current/proposed dashboard mock.

---

*If you're looking for anything field-related, it's one of the rows above. Keep this index current as locations move.*
