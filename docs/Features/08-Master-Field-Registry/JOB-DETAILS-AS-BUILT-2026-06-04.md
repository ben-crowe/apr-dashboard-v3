---
content_type: field-reference
title: Job Details Section — AS-BUILT (every field, type, dropdown, new-flag)
status: authoritative
created: 2026-06-04
author: co-architect
source_of_truth: src/components/dashboard/job-details/LoeQuoteSection.tsx (read line-by-line 2026-06-04)
supersedes: JOB-PREP-FIELDS-MAP-2026-06-03.md (that was the PLAN; this is what actually renders)
test_job: VAL261101 "Westside Mall"
---

# Job Details Section — AS-BUILT

> Read straight from the live component on 2026-06-04. This is exactly what renders on the dashboard
> — field order, control type, and dropdown options verbatim from source. **➕ = new field added
> 2026-06-03/04.** Plain wording, scannable.

**Legend:** `Dropdown` = pick-one Select · `Multi` = pick-many · `Text` = free-text input ·
`Date` = date picker · `$` = currency input · `Textarea` = multi-line.
**⚠ Text-not-dropdown** = expected to be a dropdown but built as free text because no option list
existed in the Valta v6 spec (options were NOT invented).

---

## Group 1 — Job Information

| Field | Type | Options / source | New? |
|---|---|---|---|
| Job Number | Text | from Valcre | |
| ClickUp Task | Link button | View/Create in ClickUp | |
| LOE Version | Dropdown | list of LOE templates (newest = default) | |

## Group 2 — Job Details · existing fields

| Field | Type | Dropdown options (verbatim) | New? |
|---|---|---|---|
| Property Rights | **Multi** | ASC 805 · Condominium Ownership · Cost Segregation Study · Fee Simple Interest · Going Concern · Leased Fee Interest · Leasehold Interest · Market Study · Other · Partial Interest · Partial Interest Taking · Rent Restricted · Total Taking (13) | type-fix: was pick-one |
| Scope of Work | Dropdown | All Applicable · Best One Approach · Best Two Approaches · Cost Approach · Direct Comparison Approach · Discounted Cash Flow · Feasibility Study · Income Approach · Land Value · Litigation · Market Research · Market Study · Net Rent Review · Update (14) | |
| Payment Terms | Dropdown | On LOE Signature · NET 30 Days · On Completion · 50% Upfront (4) | |
| Appraisal Fee | $ | — | |
| Report Type | Dropdown | Amendment Letter · Appraisal Report · Broker Opinion of Value · Completion Report · Consultation · Desk Review · Evaluation · Peer Review · Rent Study · Restricted Appraisal Report (10) | |
| Retainer Amount | $ | — | |
| Retainer Paid | Date | — | |
| Amount Paid | $ | — | |
| Delivery Date | Date | — | |
| Paid Date | Date | — | |

## Group 3 — Job Details · NEW Valta loe-prep fields ➕

| Field | Type | Dropdown options (verbatim) | Valcre sync |
|---|---|---|---|
| ➕ Job Status | **Text ⚠ not-dropdown** | no v6 list → free text | app-only |
| ➕ Authorized Use | Dropdown | Acquisition-Disposition · Estate Planning · Financial Reporting · First Mortgage Financing · GST · Insurance · Internal Decision-Making · Litigation (8) | ✓ → Job.IntendedUses |
| ➕ Assignment Type | Dropdown | Multiple Properties · Single Property (2) | ✓ |
| ➕ Report Format | Dropdown | Comprehensive · Concise · Form (3) | |
| ➕ Value Scenarios | **Multi** | As If Complete & Stabilized · …Stabilized - Renovated · As If Complete - Rezoned · …- Serviced · …- Subdivided · As If Vacant Land · As Is Vacant Land · As Stabilized · As-Is · Insurable Replacement Cost (10) | ✓ |
| ➕ Transaction Status | Dropdown | Listed · Not Applicable · Under Contract (3) | |
| ➕ Zoning Status | **Text ⚠ not-dropdown** | v6 list empty → free text | |
| ➕ Analysis Level | **Text ⚠ not-dropdown** | no v6 list → free text | |
| ➕ Purpose | **Text ⚠ not-dropdown** | no v6 list → free text | |
| ➕ Lead Appraiser | **Text ⚠ not-dropdown** | no v6 list → free text | |
| ➕ Desktop Report | Dropdown | Yes · No (2) | |
| ➕ CMHC Financing | Dropdown | Yes · No (2) | |
| ➕ Effective Date | Date | — | |
| ➕ Request Date | Date | — | ✓ → Job.BidDate |
| ➕ Signed Date | Date | — | ✓ → Job.AwardDate |

## Group 4 — Job Details · LOE-07 gap fields ➕ (feed the v07 contract)

| Field | Type | Dropdown options | |
|---|---|---|---|
| ➕ Current Use | Text | — | |
| ➕ Proposed Use | Text | — | |
| ➕ Approaches to Value | Text | — | |
| ➕ Delivery Time (wks) | Text | — | |
| ➕ Client Documents | Text | — | |
| ➕ Previously Appraised | Dropdown | Yes · No (2) | |

## Group 5 — Comments

| Field | Type |
|---|---|
| General | Textarea |
| Delivery | Textarea |
| Payment | Textarea |

---

## The four you asked about

**Job Status, Analysis Level, Purpose, Lead Appraiser are all plain Text inputs — not dropdowns.**
Deliberate: the Valta v6 spec had no option list for them, so react-spec left them as free text
rather than invent options. They show empty because they're text boxes nobody has successfully
typed into yet (and the earlier fill attempts used the wrong method, so nothing persisted). The
code comment on each reads: *"No v6 options — text input (not invented)."*

These are the candidates to revisit if you DO want dropdowns on them — but you'd need to supply the
option lists (they don't exist in the source spec).

## Save behaviour (all fields)

Every field saves on change/blur via a 500ms debounce → `supabase.update` (handleChange/handleBlur
→ autoSaveField). Dropdowns save on selection. To fill via an agent, use `agent-browser fill`
(Method 1) — see PRD-A "Agent Fill Method" section. The JS `input.value=` poke does NOT save.
