---
content_type: field-map
status: draft
phase1_prep: true
ingest_proposed: true
ingested: false
tags: [job-prep, loe-quote, fields, dropdowns, field-registry, valta-merge, APR]
created: 2026-06-03
author: co-architect
source_component: src/components/dashboard/job-details/LoeQuoteSection.tsx
related: [VALTA-MASTER-DELTA-2026-05-14.md]
---

# Job-Prep Area — Field Map (current + new to add)

#job-prep #fields #valta-merge

The job-prep / LOE-Quote area is Stage-2 of the job detail. This map = the **single reference** for what fields exist, their control types + dropdown options + order, and where the new Valta fields slot in. Agents: study this and match the existing pattern. Do NOT guess order or invent dropdown options.

Live component: `src/components/dashboard/job-details/LoeQuoteSection.tsx` (this is what renders — matches the VAL261101 paste). Subsections exist under `loe-quote/` — **see the ⚠ duplicate-component flag below before editing.**

Pattern to match: each field is a `<CompactField label="...">` wrapping either `<Select>` (dropdown), `<Input type="date">`, or `<Input>` with a `$` placeholder (currency). Keep options alphabetized as the existing ones are.

## 1. CURRENT fields (verified live, in render order)

### Job Information
| # | Field | Type | Notes |
|---|---|---|---|
| 1 | Job Number | Input (text) | from Valcre; "Awaiting Valcre job" placeholder |
| 2 | ClickUp Task | link/button | View/Create ClickUp task |

### Job Details
| # | Field | Type | Dropdown options (current) |
|---|---|---|---|
| 3 | Property Rights | **Select** | ASC 805 · Condominium Ownership · Cost Segregation Study · Fee Simple Interest · Going Concern · Leased Fee Interest · Leasehold Interest · Market Study · Other · Partial Interest · Partial Interest Taking · Rent Restricted · Total Taking (13) |
| 4 | Scope of Work | **Select** | All Applicable · Best One/Two Approaches · Cost Approach · Direct Comparison · Discounted Cash Flow · Feasibility Study · Income Approach · Land Value · Litigation · Market Research · Market Study · Net Rent Review · Update (14) |
| 5 | Payment Terms | **Select** | On LOE Signature · NET 30 Days · On Completion · 50% Upfront (4) |
| 6 | Appraisal Fee | Input (currency $) | |
| 7 | Report Type | **Select** | Amendment Letter · Appraisal Report · Broker Opinion of Value · Completion Report · Consultation · Desk Review · Evaluation · Peer Review · Rent Study · Restricted Appraisal Report (10) |
| 8 | Retainer Amount | Input (currency $) | |
| 9 | Retainer Paid | Input (date) | |
| 10 | Amount Paid | Input (currency $) | |
| 11 | Delivery Date | Input (date) | |
| 12 | Paid Date | Input (date) | |

### Comments
| # | Field | Type |
|---|---|---|
| 13 | General | Textarea |
| 14 | Delivery | Textarea |
| 15 | Payment | Textarea |

## 2. NEW fields to ADD here (from the Valta Delta — `loe-prep` tagged)
Control type confirmed from the Delta; **dropdown option CONTENTS must be pulled from Valta's v6 `DROPDOWN_OPTIONS`** (do NOT invent — that's the still-pending "dropdown-contents" audit).

| Field | Type | Options source | Valcre map? | Notes |
|---|---|---|---|---|
| Job Status | Select one | Valta DROPDOWN_OPTIONS | — | |
| Authorized Use | Select one | Valta DROPDOWN_OPTIONS | ✓ Job.IntendedUses | |
| Assignment Type | Select one | Valta DROPDOWN_OPTIONS | — | |
| Desktop Report | Select one (Yes/No) | Yes/No | — | |
| CMHC Financing | Select one (Yes/No) | Yes/No | — | Canadian intake flag |
| Request Date | Input (date) | — | ✓ | confirm not already present |
| Signed Date | Input (date) | — | ✓ | confirm not already present |
| Due Date | Input (date) | — | ✓ | may overlap existing "Delivery Date" |

## 3. TYPE FIXES that touch this area (from Delta Section D)
| Field | Current | Should be | Note |
|---|---|---|---|
| Property Rights (= `interest-appraised`) | Select **one** | Select **multiple** | Delta: Valta proves multi-select; verify no calc consumer depends on single |
| Value Scenario(s) | (in ValuationSection) | Select **multiple** + plural | rename `value-scenario`→`value-scenarios` |

## ⚠ 4. VERIFY-BEFORE-EDITING (don't be messy)
1. **Possible duplicate components.** `loe-quote/PropertyRightsSection.tsx`, `ValuationSection.tsx`, `PaymentSection.tsx` define OVERLAPPING but slightly DIFFERENT fields/options vs the live `LoeQuoteSection.tsx` (e.g. PropertyRightsSection adds a "None" option; ValuationSection has "Value Scenario"/"Approaches to Value"; PaymentSection has "Report Format" Comprehensive/Summary/… + Net 30/60). **Confirm which set actually renders before touching anything** — one set may be dead/unused (Ben's "fields we may not need"). Do NOT edit both blindly.
2. **Net-new dates may already exist.** Request/Signed/Due Date — reconcile against the existing Retainer Paid / Amount Paid / Delivery Date / Paid Date so we don't add duplicates under new names.
3. **Dropdown option contents** for the new Select fields = pull from Valta v6 `DROPDOWN_OPTIONS`; the contents-diff audit is still pending.

## 5. Decisions still pending Ben (gate the build)
- Transaction Status + Zoning Status placement (job-prep vs intake/site/report).
- The 6 LOE-critical fields (Purpose, Effective Date, Scope of Work, Analysis Level, Report Format, Lead Appraiser) — include or hold. *(Note: "Report Format" + "Scope of Work" may already partly exist — see duplicate-component flag.)*
