---
content_type: mock-test-data
title: Mock Dashboard Test Data — one base job, switchable cascade logic
status: ready for ui-designer to wire into the mock dashboard's version picker
owner: co-architect (built from extracted registry + V07 token map) · ui-designer (wires it)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
purpose: One coherent fake appraisal job that fills EVERY dashboard field. The version picker changes ONLY the cascade-logic fields, so the same base data renders 3–4 different LOE PDFs.
tags: [apr-workflow, field-registry, mock-data, test-data, cascade, loe]
---

# Mock Dashboard Test Data

One realistic fictional job fills **every** field. The version picker flips ONLY the logic input (Status of Improvements, + Authorized Use for the insurance case); the cascade re-derives Value Scenarios / Approaches / §10. Everything else stays constant — so you get 3–4 LOE PDFs that differ only by the logic.

> **Fictional — safe to use.** Property "Riverside Commerce Centre" is invented; no real client/job.

---

## BASE SET — constant across all versions

### Section 1 — Client & Property
- **First Name:** Sarah · **Last Name:** Mitchell
- **Title:** Portfolio Manager · **Organization:** Bridgepoint Capital Partners
- **Phone:** (403) 555-0142 · **Email:** sarah.mitchell@bridgepointcap.com
- **Address:** 350 7th Avenue SW, Suite 1800, Calgary, AB T2P 3N9
- **Property Name:** Riverside Commerce Centre
- **Property Address:** 4820 Macleod Trail SE, Calgary, AB T2G 0A5
- **Property Type:** Industrial
- **Authorized Use:** Financial Reporting  *(V4 switches this → Insurance)*
- **Valuation Premises:** Market Value · **Asset Condition:** Good
- **Property Contact:** Daniel Okafor · d.okafor@riversidecc.ca · (403) 555-0199
- **Client Comments:** Refinancing appraisal; site access via property manager Daniel Okafor.

### Section 2 — LOE Quote (the LOE gate)
- **Job Number:** VAL261142 · **Job Status:** In Progress
- **Purpose:** Financial Reporting
- **Status of Improvements:** ⚡ SWITCHES — see versions below
- **Value Scenarios:** ⚙ DERIVED — leave blank, the cascade fills it
- **Property Subtype:** Multi-Tenant Industrial · **Tenancy:** Multi-Tenant
- **Property Rights:** Leased Fee Interest
- **Approaches to Value:** ⚙ DERIVED — leave blank
- **Value Timeframe:** Current
- **Scope of Work:** Income Approach
- **Report Type:** Appraisal Report · **Report Format:** Comprehensive
- **Assignment Type:** Single Property · **Analysis Level:** Detailed
- **Appraisal Fee:** $6,500 · **Retainer Amount:** $1,500
- **Payment Terms:** On LOE Signature
- **Effective Date:** 2026-06-15 · **Request Date:** 2026-06-09
- **Delivery Date:** 2026-07-10 · **Delivery Time (wks):** 4
- **Client Documents:** Rent roll, T12 operating statements, current leases
- **Previously Appraised:** No
- **Current Use:** Multi-tenant industrial / warehouse
- **Proposed Use:** Multi-tenant industrial / warehouse
- **CMHC Financing:** No
- **Transaction Status:** Under Contract · **Zoning Status:** In Place
- **General 1 / General 2:** *(leave blank — note slots)*

### Section 3 — Building Information
- **Year Built:** 2008 · **Building Size (SF):** 84,500
- **Number of Units:** 12 · **Parking Spaces:** 140
- **State of Improvements:** Improved · **Land Metric:** Square Feet
- **Env. Assessment:** Phase I — no concerns · **Heritage / Conserv.:** None
- **Legal Description:** Plan 0712345, Block 4, Lot 7

### Section 4 — Property Research
- **Zoning:** I-G (Industrial General) · **Zone Code:** IG-2 · **Land Use:** Industrial
- **Flood Zone:** Zone X (minimal risk) · **Utilities:** Full municipal services
- **Parcel Number:** 0192-837-465
- **Gross Building Area:** 84,500 · **Net Rentable Area:** 81,200
- **Year Built (research):** 2008 · **Buildable Land:** 120,000 · **Total Site Area:** 195,000
- **Assessed Value:** $11,400,000 · **Taxes:** $168,000
- **Assessment Year:** 2026 · **Land Value:** $4,200,000 · **Improved Value:** $7,200,000 · **Total Value:** $11,400,000

---

## THE SWITCH — only these change per version

| Version | Set Status of Improvements to… | Authorized Use | → Cascade derives (Value Scenarios) |
|---|---|---|---|
| **V1 — Completed** | Improved - Completed | Financial Reporting | **As Stabilized** (1 scenario) |
| **V2 — Under Renovation** | Improved - Under Renovation | Financial Reporting | **As-Is** + **As If Complete & Stabilized** (2) |
| **V3 — Demolition Land** | Proposed - Improved Land (Demolition Required) | Financial Reporting | **As If Vacant Land** + **As If Complete & Stabilized** (2) |
| **V4 — Insurance override** | *(keep base)* | **Insurance** | **Insurable Replacement Cost** (1 — narrative blank, pending Chris) |

Everything else in the base set stays identical. Pick a version → the cascade re-runs → §5 / §9 / §10 of the LOE change → a different PDF, same job.

> Note for V3/V4 realism (optional later): a demolition-land or insurance job would in reality also shift Current/Proposed Use and Property Rights — but per Ben, keep the base constant for now; only the logic input flips. We can add per-version field overrides later if the variants need to read fully real.
