---
content_type: field-routing
status: draft
phase1_prep: true
ingest_proposed: true
ingested: false
tags: [apr-workflow, field-routing, clickup-card, loe-07, dashboard, job-prep, intake, APR]
home: 00-APR-MASTER-DASHBOARD.md
created: 2026-06-03
author: qa-agent
sources:
  - docs/Features/08-Master-Field-Registry/JOB-PREP-FIELDS-MAP-2026-06-03.md
  - docs/valta share/LOE-07-INTAKE-2026-06-03.md
  - tests/MAPPING-dashboard-to-clickup.md (edge-function card structure)
related: [VALTA-MASTER-DELTA-2026-05-14.md]
---

# Field Routing — Dashboard field → ClickUp card? → LOE-07?

#field-routing #clickup-card #loe-07

The ONE go-to doc: for every dashboard field, does it flow to the **ClickUp card** (the rich edge-function card) and/or the **LOE-07** contract. "ClickUp" column = appears in the card built by `create-clickup-task` (Stage-1 rich) or `update-clickup-task` (Stage-2 LOE Quote section). "LOE-07" column = sources a `[Placeholder]` in LOE-Template-V07.

Legend: ✅ goes · ❌ does not · ➕ new field being added · ⚠ gap/confirm · ⚙ system-derived

## 1. Intake — Client Information (Stage-1)
| Dashboard field | → ClickUp card? | → LOE-07? | Notes |
|---|---|---|---|
| Client First Name | ✅ CLIENT INFORMATION | ✅ `[ClientFirstName]` | |
| Client Last Name | ✅ CLIENT INFORMATION | ✅ `[ClientLastName]` | |
| Client Title | ❌ (not on card) | ❌ | held on job only |
| Client Organization / Company | ✅ CLIENT INFORMATION (Org) | ✅ `[ClientCompanyName]` | |
| Client Organization Address | ❌ | ✅ `[ClientOrganizationAddress]` | LOE needs it; card omits |
| Client Phone | ✅ CLIENT INFORMATION | ✅ `[ClientPhone]` | |
| Client Email | ✅ CLIENT INFORMATION | ✅ `[ClientEmail]` | |

## 2. Intake — Property & Contact (Stage-1)
| Dashboard field | → ClickUp card? | → LOE-07? | Notes |
|---|---|---|---|
| Property Name | ✅ PROPERTY INFORMATION | ✅ `[PropertyName]` / `[JobName]` | |
| Property Address | ✅ PROPERTY INFORMATION | ✅ `[PropertyAddress]` | |
| Property Type | ✅ PROPERTY INFORMATION | ✅ `[PropertyType]` | |
| Asset Condition | ✅ PROPERTY INFORMATION (Condition) | ⚠ `[CurrentUseImprovements]`? | confirm mapping |
| Valuation Premises | ✅ PROPERTY INFORMATION (Premise) | ⚠ relates to `[ValueScenarios]` | intake-side; ValueScenarios is the LOE multi-select |
| Intended Use / Authorized Use | ✅ PROPERTY INFO (Use) | ✅ `[AuthorizedUse]` | ➕ job-prep "Authorized Use" being added; maps Job.IntendedUses |
| Property Contact First/Last | ✅ PROPERTY CONTACT | ❌ | card only (Valcre also) |
| Property Contact Email | ✅ PROPERTY CONTACT | ❌ | |
| Property Contact Phone | ✅ PROPERTY CONTACT | ❌ | |
| Client Comments (notes) | ✅ CLIENT COMMENTS | ❌ | |

## 3. Job-Prep / LOE-Quote (Stage-2) — current fields
| Dashboard field | → ClickUp card? | → LOE-07? | Notes |
|---|---|---|---|
| Job Number | ✅ header (VALCRE JOB NUMBER) | ✅ `[JobNumber]` | from Valcre |
| Property Rights | ✅ LOE QUOTE → Property Rights | ✅ `[InterestAppraised]` | type-fix → multi-select |
| Scope of Work | ✅ LOE QUOTE → Scope of Work | ✅ `[ApproachestoValue]`/`[ScopeOfWork]` | |
| Payment Terms | ✅ LOE QUOTE (appended) | ✅ §11 fees & terms | |
| Appraisal Fee | ✅ LOE QUOTE → Appraisal Fee | ✅ `[Fee]` | |
| Report Type | ✅ LOE QUOTE → Report Type | ✅ `[ReportType]` | |
| Retainer Amount | ✅ LOE QUOTE → Retainer | ⚠ §11? | confirm LOE wants retainer |
| Retainer Paid (date) | ❌ | ❌ | internal tracking |
| Amount Paid | ❌ | ❌ | internal tracking |
| Delivery Date | ✅ LOE QUOTE → Delivery Date | ⚠ `[DeliveryTime]` | LOE wants WEEKS-from-payment, not a date — confirm |
| Paid Date | ❌ | ❌ | internal tracking |
| Comments — General/Delivery/Payment | ✅ APPRAISER NOTES | ❌ | card only |

## 4. Job-Prep — NEW fields being added (➕) and their routing
| Dashboard field (new) | → ClickUp card? | → LOE-07? | Notes |
|---|---|---|---|
| Job Status | ❌ (card uses ClickUp status, not a card line) | ❌ | workflow only |
| Authorized Use | ✅ (PROPERTY INFO Use) | ✅ `[AuthorizedUse]` | Job.IntendedUses |
| Assignment Type | ⚠ not yet on card | ✅ `[AssignmentType]` | drives Schedule A (Multiple Properties) |
| Desktop Report | ❌ | ⚠ relates to `[ReportType]`/scope | Yes/No flag |
| CMHC Financing | ❌ | ⚠ possible §3/§4 | Canadian intake flag |
| Request Date | ❌ | ✅ `[Today's Date]`?/request | ⚙ confirm vs system date |
| Signed Date | ✅ status tracker (LOE Signed) | ✅ §16 acceptance | from DocuSeal webhook |
| Due Date | ✅ LOE QUOTE (Delivery) | ⚠ overlaps Delivery Date | reconcile dup |

## 5. LOE-07 fields with NO clean dashboard source (gaps to add)
These LOE-07 placeholders are NOT currently fed by a dashboard field — flagged in LOE-07-INTAKE:
| LOE-07 placeholder | ClickUp? | Status |
|---|---|---|
| `[ProposedUseImprovements]` | ❌ | ⚠ GAP — no source field |
| `[ApproachestoValue]` | ✅ (via Scope) | ⚠ cascade not wired to dashboard yet |
| `[PreviouslyAppraised]` (§15) | ❌ | ⚠ GAP — new Yes/No field needed |
| `[Valuetimeframe]` | ❌ | ⚠ CONFIRM exists (Valcre 13) |
| `[ValueScenario1–6]` | ❌ | ⚠ PARTIAL — EA4/EA5 net-new |
| `[EA/HCSummary1–6]` | ❌ | ⚠ SPECIAL — narrative Text Library, not a field |

## Summary
- **ClickUp card** = the client/property snapshot + contact + comments (Stage-1) and the LOE Quote financials + appraiser notes (Stage-2) + the status tracker. It does NOT carry internal-only tracking dates (Retainer Paid, Amount Paid, Paid Date) or Client Title/Org-Address.
- **LOE-07** = the contract; needs the client/property identity, the LOE quote terms, and the new assignment/authorized-use/value-scenario fields, plus several gaps (ProposedUseImprovements, PreviouslyAppraised, ApproachestoValue cascade) not yet sourced.
- **Both** get: client name/phone/email, property name/address/type, intended/authorized use, property rights, scope, report type, fee, job number.
- **Neither**: internal payment-tracking dates.

> RENDER VERIFICATION of the new job-prep fields is PENDING — agent-browser capture was halted (daemon latching onto KM-Exp's CDP 9222 instead of isolated headless). Routing built from source docs + verified edge-function card structure. Render PASS/FAIL to follow once headless capture is isolated.
