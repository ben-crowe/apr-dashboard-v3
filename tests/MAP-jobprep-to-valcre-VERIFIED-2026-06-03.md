---
content_type: field-map
status: verified-live
created: 2026-06-03
author: react-specialist
verified_against: live Valcre API (api-core.valcre.com) on VAL261101 / Job Id 784140
related: [PRD-A-fields-to-valcre-mapping.md, VALTA-MASTER-DELTA-2026-05-14.md, api/valcre.ts]
---

# Job-Prep Fields → Valcre — VERIFIED live map (PRD-A step 1)

**Name-match guard:** VAL261101 = `Westside Mall, 2129 Broadway Court, Calgary, AB` · Job Id **784140** · Status `Lead`. ✓ matches PRD. All writes target Id 784140 ONLY.

**Live native Job fields confirmed present:** IntendedUses=`Financing`, Purposes=`LeasedFee`, Scopes=`AllApplicable`, ReportFormat=`Appraisal`, AnalysisLevel=`Detailed`, DueDate=`2026-02-10`, BidDate=`2026-01-27`, AwardDate=`null`, PaidDate=`null`, EffectiveDate=`null`.

**Live custom-field options confirmed** (match `valcre.ts` hardcode exactly): AssignmentType 12049 = Standard/Update/Retrospective/Desktop · TransactionStatus 12053 = Arms Length/Non-Arms Length/Listing/Under Contract/REO·Bank Sale · ZoningStatus 12054 = Legal Conforming/Legal Non-Conforming/Illegal/No Zoning · DesktopReport 12050 = Boolean.

## A. CLEAN — ready to wire now (native Job field, verified, no collision)

| Dashboard field | Valcre target | Type | Note |
|---|---|---|---|
| Request Date (`requestDate`) | `Job.BidDate` | date | live BidDate exists; clean |
| Signed Date (`signedDate`) | `Job.AwardDate` | date | live field exists (currently null) |
| Effective Date (`effectiveDate`) | `Job.EffectiveDate` | date | live field exists (currently null) |
| Desktop Report (`desktopReport`) | custom field 12050 (Boolean) | Yes/No→bool | config already correct in valcre.ts |

## B. CONFLICT / DECISION NEEDED — do NOT blind-wire

| Dashboard field | Issue | Needs |
|---|---|---|
| **Assignment Type** | Concept clash. Dashboard built from v6 = `Single Property / Multiple Properties` (property COUNT). Live Valcre CF 12049 "AssignmentType" = `Standard/Update/Retrospective/Desktop` (appraisal TYPE). Different meanings, same name. Dashboard values map to NOTHING → silently skipped. | Ben: is the dashboard field property-count (no Valcre target) or appraisal-type (re-option the dropdown to the 4 Valcre values)? |
| **Transaction Status** | Option mismatch. Dashboard = `Listed/Not Applicable/Under Contract`. Live CF 12053 = `Arms Length/Non-Arms Length/Listing/Under Contract/REO·Bank Sale`. Only "Under Contract" maps; "Listed"≠"Listing", "Not Applicable" no match. | Re-option dashboard to the 5 live values, or confirm partial. |
| **Zoning Status** | Control-type wrong. Dashboard = free-text (v6 list was empty). Live CF 12054 is a **dropdown** = Legal Conforming/Legal Non-Conforming/Illegal/No Zoning. Free text won't map. | Convert dashboard to a Select with those 4 options. |
| **Authorized Use** | Dedup. Maps to `Job.IntendedUses` — the SAME target as the existing intake field `job.intendedUse` (already wired). Two dashboard inputs → one Valcre field = last-writer-wins. | Ben: keep both or collapse? |
| **Property Rights** | Multi→single. Now a multi-select (comma string), but `Job.Purposes` + `PURPOSES_MAP` are single-value — a comma string maps to nothing. | Decide: send first value only, or confirm Valcre Purposes is single and dashboard should stay single. |
| **Report Format** | Collision. New field → `Job.ReportFormat`, but existing `reportType` ALSO maps to `ReportFormat`. Two writers, one field. | Pick which dashboard field owns ReportFormat. |
| **Purpose** | Collision. Delta maps Purpose → `Job.Purposes`, but Property Rights already owns Purposes. | Resolve target. |
| **Value Scenarios** | No clean target. Options (As-Is, As If Complete…) match neither ApproachesToValue (CF 12052) nor RequestedValues. | Confirm target field or hold. |
| **Lead Appraiser** | Maps to `Job.OwnerId`/`StaffAppraisers` — needs a staff-ID lookup, not a string write. | Defer — needs appraiser-ID resolution. |
| **Job Status** | `Job.Status` is an enum (live=`Lead`). Dashboard is free text. | Supply Status enum values or hold. |
| **CMHC Financing** | No Valcre target exists (native or custom). | Create a new custom field, or hold (Supabase-only). |
| **Due Date** | Already reconciled to existing "Delivery Date" → `Job.DueDate`. No separate field. | Confirmed — no action. |

## Wiring order proposed
Start with **A** (4 clean fields), one at a time, hand each to QA on 784140. Hold all of **B** until Ben/CoArch rule on the conflicts. Field #1 = **Request Date → Job.BidDate**.
