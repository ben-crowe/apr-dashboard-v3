---
content_type: extracted-field-registry
title: Extracted Field Registry — Current Dashboard fields (Intake → Quote Prep → Job Execution)
status: CURRENT-state spec, all 3 stages, pulled from component source. Numbering aligns to the Field Registry Explorer's stage scheme (1.x / 2.x / 3.x). Suggested version goes UNDER each section later.
owner: co-architect (built from code) · ui-designer (builds the "Current" HTML tab) · Ben (review)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
scope: Live dashboard job-detail sections. Options + ClickUp/Valcre routing pulled from source code (LoeQuoteSection / ClientSubmissionSection / PropertyInfoSection), not guessed.
tags: [apr-workflow, field-registry, dashboard, extracted-registry, loe, valcre, clickup, current-state]
---

# Extracted Field Registry — CURRENT Dashboard

Every field laid out **as it sits on the live dashboard** — stage by stage, numbered to match the Field Registry Explorer (1.1, 1.2 … 3.x). Each field shows control type, current dropdown options, role, and where it routes (→ ClickUp / → Valcre). **All option-sets pulled from the component source code.**

**Role key:** **INPUT** = you pick it (has a dropdown) · **DERIVED** = the cascade fills it (no manual pick) · **FREE-TEXT** = you type it (no dropdown by design or by gap).

> This is the **CURRENT** state — warts included. The "Suggested" version goes **under** each section later. The HTML "Current" tab on the Field Registry Explorer should mirror THIS, not the registry-ideal.

---

## STAGE 1 — Client Submission  *(ClientSubmissionSection)*

### 1.1 Client Information
- **1.1.1 First Name** — FREE-TEXT
- **1.1.2 Last Name** — FREE-TEXT
- **1.1.3 Title** — FREE-TEXT
- **1.1.4 Organization** — FREE-TEXT
- **1.1.5 Phone** — FREE-TEXT
- **1.1.6 Email** — FREE-TEXT
- **1.1.7 Address** — FREE-TEXT

### 1.2 Property Information
- **1.2.1 Property Name** — FREE-TEXT → Valcre (Property record)
- **1.2.2 Property Address** — FREE-TEXT → Valcre (Property record). *(Gap: no property postal collected.)*
- **1.2.3 Property Type** — INPUT dropdown (16): Agriculture · Building · Healthcare · Hospitality · Industrial · Land · Manufactured Housing · Multi-Family · Office · Retail · Self-Storage · Single-Family · Senior · Special Purpose · Unknown · Other. → Valcre (Property Type). *(Client registry list is only 9 + different names — mismatch flagged.)*
- **1.2.4 Authorized Use** — INPUT dropdown (8): First Mortgage Financing · Financial Reporting · Insurance · Internal Decision-Making · Acquisition-Disposition · Estate Planning · Litigation · GST. → Valcre (Job.IntendedUses). *(Insurance overrides the Value-Scenarios cascade.)*
- **1.2.5 Valuation Premises** — INPUT dropdown (5): Market Value · Market Rent · Investment Value · Insurable Value · Liquidation Value. *(DISTINCT from Value Scenarios — do not merge.)*
- **1.2.6 Asset Condition** — INPUT dropdown (5): Excellent · Very Good · Good · Fair · Poor.

### 1.3 Property Contact
- **1.3.1 First Name** · **1.3.2 Last Name** · **1.3.3 Email** · **1.3.4 Phone** — all FREE-TEXT → Valcre (separate Property Contact, only if it differs from the client).

---

## STAGE 2 — Quote Preparation  *(LoeQuoteSection — the section that makes the LOE)*

**Job Information (top bar):** Job Number · LOE Version *(picker: LOE-07-1 …)* · ClickUp Task *(link)*

### 2.1 LOE Quote & Valuation Details — two-column layout (as on the dashboard)

| Left column | Right column |
|---|---|
| **2.1.1 Property Rights** — Leased Fee Interest | **2.1.10 Scope of Work** — Income Approach |
| **2.1.2 Payment Terms** — On LOE Signature | **2.1.11 Appraisal Fee** — $3,500 |
| **2.1.3 Report Type** — Appraisal Report | **2.1.12 Retainer Amount** — $350 |
| **2.1.4 Retainer Paid** — date | **2.1.13 Amount Paid** — $3,850 |
| **2.1.5 Delivery Date** — 2026-02-10 | **2.1.14 Paid Date** — date |
| **2.1.6 Job Status** — In Progress | **2.1.15 Assignment Type** — Single Property |
| **2.1.7 Report Format** — Comprehensive | **2.1.16 Value Scenarios** — As Stabilized |
| **2.1.8 Transaction Status** — Under Contract | **2.1.17 Zoning Status** — In Place |
| **2.1.9 Analysis Level** — Detailed | **2.1.18 Purpose** — Financial Reporting |

**Field detail:**
- **2.1.1 Property Rights** — INPUT dropdown (multi-select): Fee Simple Interest · Leasehold Interest · Leased Fee Interest · Partial Interest. → Valcre (Job.Purposes) · ClickUp.
- **2.1.2 Payment Terms** — INPUT dropdown: On LOE Signature · NET 30 Days · On Completion · 50% Upfront. → Valcre (Comments, appended).
- **2.1.3 Report Type** — INPUT dropdown: Amendment Letter · Appraisal Report · Broker Opinion of Value · Completion Report · Consultation · Desk Review · Evaluation · Peer Review · Rent Study · Restricted Appraisal Report. → Valcre · ClickUp.
- **2.1.4 Retainer Paid** — FREE-TEXT (date). Internal only.
- **2.1.5 Delivery Date** — FREE-TEXT (date). → Valcre (Due Date).
- **2.1.6 Job Status** — FREE-TEXT (no dropdown — "options not invented"). Internal.
- **2.1.7 Report Format** — INPUT dropdown: Comprehensive · Concise · Form. → NOT wired to Valcre (held decision).
- **2.1.8 Transaction Status** — INPUT dropdown: Not Applicable · Listed · Under Contract. → Valcre. *(Canonical set; the Data-Gathering copy 3.x is stale.)*
- **2.1.9 Analysis Level** — INPUT dropdown: Detailed · Summary · Brief · Detailed Residential · Restricted Access Report · Progress Report · Valuation Assessment Letter · Rental Assessment Letter · Rental Submission · Rental Determination · Property Pro. → Valcre.
- **2.1.10 Scope of Work** — INPUT dropdown (single-pick today; Valcre treats as checkbox): All Applicable · Best One Approach · Best Two Approaches · Cost Approach · Direct Comparison Approach · Discounted Cash Flow · Feasibility Study · Income Approach · Land Value · Litigation · Market Research · Market Study · Net Rent Review · Update. → Valcre.
- **2.1.11 Appraisal Fee** — FREE-TEXT (currency). → Valcre (Fee).
- **2.1.12 Retainer Amount** — FREE-TEXT (currency). → Valcre (Retainer).
- **2.1.13 Amount Paid** — FREE-TEXT (currency). Internal only.
- **2.1.14 Paid Date** — FREE-TEXT (date). Internal only.
- **2.1.15 Assignment Type** — INPUT dropdown: Single Property · Multiple Properties. → NOT wired to Valcre (held — concept clash). *(Canonical set; Data-Gathering copy 3.x is a different concept.)*
- **2.1.16 Value Scenarios** — DERIVED (multi-select), filled by the cascade from Status of Improvements (Insurance override). Cascade options: As Is Vacant Land · As If Vacant Land · As-Is · As If Complete & Stabilized · As Stabilized · etc. → Valcre (Valuation Premise 1/2). *(Currently shows stale hand-typed values — cascade not yet wired to the live display.)*
- **2.1.17 Zoning Status** — INPUT dropdown: In Place · To Be Rezoned. → Valcre. *(Canonical set; Data-Gathering copy 3.x is stale.)*
- **2.1.18 Purpose** — FREE-TEXT (no dropdown). → does NOT go to Valcre (Property Rights feeds Valcre's Purpose).

**Also in this section (below the main 18):** Lead Appraiser (free-text, dashboard-only) · Current Use (free-text — GAP, registry has a list) · Proposed Use (free-text — GAP, registry has a list) · Approaches to Value (free-text here — DERIVED from Value Scenarios, wrong control) · Delivery Time wks (free-text) · Desktop Report (Yes/No) · CMHC Financing (Yes/No).

### 2.2 Building Information  *(OrganizingDocsSection)*
Year Built · Building Size (SF) · Number of Units · Parking Spaces · Status of Improvements *(INPUT dropdown — the cascade TRIGGER: Improved-Completed / Improved-Renovated / Improved-Under Renovation / Improved-Proposed Renovation / Proposed-Vacant Land / Proposed-Improved Land (Demolition Required) / Proposed-Under Construction)* · State of Improvements · Tenancy *(INPUT dropdown: Owner-Occupied · Single-Tenant · Multi-Tenant · Vacant — client list has 6, mismatch)* · Property Subtype · Land Metric.

---

## STAGE 3 — Job Execution  *(PropertyInfoSection — Data Gathering / Property Research)*

> ⚠ **3.x carries the STALE duplicate fields** — same DB columns as 2.1.8/2.1.15/2.1.17 but older option-sets. Do not treat as authoritative; reconcile per the Field Audit (FLAG 1: confirm which copy feeds the Valcre sync before removing either).

### 3.1 Appraisal Assignment (Data-Gathering copies)
- **3.1.1 Assignment Type (stale)** — Standard · Update · Retrospective · Desktop. *(Different concept from 2.1.15.)*
- **3.1.2 Desktop Report** — Yes / No.
- **3.1.3 Value Timeframe** — Current · Retrospective · Prospective.
- **3.1.4 Approaches to Value (stale dropdown)** — All Applicable · Cost Approach · Direct Comparison · Income Approach · Cost + Direct Comparison · Cost + Income · Direct Comparison + Income. *(DERIVED concept; client list is 4 atomic strings.)*
- **3.1.5 Transaction Status (stale)** — Arm's Length · Non-Arm's Length · Listing · Under Contract · REO/Bank Sale.
- **3.1.6 Zoning Status (stale)** — Legal Conforming · Legal Non-Conforming · Illegal · No Zoning.

### 3.2 Property Site & Parcels (all FREE-TEXT, appraiser research)
Zoning Classification · Zone Code · Land Use Designation · Flood Zone · Utilities · Parcel Number · Gross Building Area (SF) · Net Rentable Area (SF) · Year Built · Usable Land (SF) · Gross Land (SF) · Assessed Value · Taxes · Assessment Year · Land Assessment Value · Land Split · Improved Assessment Value · Total Assessment Value · Building Split.

### 3.3 Document Uploads  *(Section4Compact)*
Land Title Certificate · Survey Certificate/RPR · Tax Assessment Notice · Aerial Photo · Zoning Map · Flood Map · Building Permits · Site Plan — all file-upload.

---

*Next: confirm, then the Suggested version goes under each stage (fix the gaps, retire the stale duplicates per the Field Audit reconcile, wire the derived fields, regroup by role).*
