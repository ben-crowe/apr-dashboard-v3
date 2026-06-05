---
content_type: decision-resort
status: verified-live
created: 2026-06-03
author: react-specialist
verified_against: live Valcre API — full Job native schema + all 20 Job custom fields (Job 784140 VAL261101)
related: [MAP-jobprep-to-valcre-VERIFIED-2026-06-03.md, PRD-A-fields-to-valcre-mapping.md, Valcre-Integration/6-CUSTOM-FIELDS-ANALYSIS.md]
---

# 11 conflict fields — A/B re-sort (Ben's reframe)

**Method:** checked each against (1) the full live native Job schema and (2) the complete live list of 20 Job custom fields — NOT guessed. Cited the native prop or custom-field Id for every A.

**STATUS: FINAL** — control-types confirmed against Ben's admin screenshot (2026-06-03) + live API; all select-field option lists pulled live (below). Ready for Ben's per-field ruling.

## Confirmed Valcre control-types + live option lists (for the A select fields)

| Valcre field (Id) | Control type | Live options |
|---|---|---|
| AssignmentType (12049) | Select one | Standard · Update · Retrospective · Desktop |
| TransactionStatus (12053) | Select one | Arms Length · Non-Arms Length · Listing · Under Contract · REO/Bank Sale |
| ZoningStatus (12054) | Select one | Legal Conforming · Legal Non-Conforming · Illegal · No Zoning |
| ValuationPremise-1 (11563) | Select one | As Is · As Stabilized · As If Renovated & Stabilized · As If Complete & Stabilized · As Is Vacant Land · As If Vacant Land · As If Rezoned · As If Serviced · As If Subdivided |
| ValuationPremise-2 (11564) | Select one | (same 9 as Premise-1) |
| ApproachesToValue (12052) | Select **multiple** | All Applicable · Cost Approach · Direct Comparison · Income Approach · Cost + Direct Comparison · Cost + Income · Direct Comparison + Income |

**Dashboard→Valcre control-type realignment required:** Zoning Status (free-text → Select one); Value Scenarios (multi-select → **two** single-selects Premise-1/-2, and relabel options — my dashboard uses "As-Is"/"As If Complete - Rezoned"/"Insurable Replacement Cost" which don't match Valcre's 9); Assignment Type + Transaction Status (re-option to the live values above).

**Headline:** **9 of 12 have a confirmed Valcre field (A); 3 are genuinely LOE-only (B).** Most fields *exist* in Valcre — so the real decisions are **reconciliation** (option/concept/dedup/collision), not "does a field exist." Separate per-field question Ben may still answer: *should* it sync, or stay LOE-only despite a field existing.

> ⚠ **Phantom CF IDs in `api/valcre.ts` (pre-existing bug, now confirmed):** `VALTA_CUSTOM_FIELD_IDS` hardcodes three IDs that DO NOT EXIST on the tenant — **12050 desktopReport, 12047 environmentalAssessment, 12048 heritageConservation**. Any write to these silently 400s. This is what broke Desktop Report (#4). Recommend pruning the 3 dead IDs from valcre.ts.

## Bucket A — Valcre field CONFIRMED (cite + the reconciliation question)

| # | Field | Confirmed Valcre target | Reconciliation question |
|---|---|---|---|
| 1 | Authorized Use | native `Job.IntendedUses` (INTENDED_USES_MAP) | Dedup — same target as existing intake `intendedUse`. One field or two? |
| 2 | Property Rights | native `Job.Purposes` (PURPOSES_MAP) | Now multi-select, but `Purposes` is a single enum. Send first value only, or revert to single? |
| 3 | Report Format | native `Job.ReportFormat` | Collision — existing `reportType` already writes `ReportFormat`. Which field owns it? |
| 4 | Transaction Status | custom field **12053** (SingleOption) | Re-option dashboard to live values: Arms Length / Non-Arms Length / Listing / Under Contract / REO·Bank Sale. |
| 5 | Zoning Status | custom field **12054** (SingleOption) | Convert dashboard free-text → dropdown of 4 live: Legal Conforming / Legal Non-Conforming / Illegal / No Zoning. |
| 6 | Assignment Type | custom field **12049** (SingleOption) | Concept clash — CF options are Standard/Update/Retrospective/Desktop; dashboard built Single/Multiple Properties. Re-option, or is the dashboard field a different concept (→B)? |
| 7 | Job Status | native `Job.Status` (enum, live=`Lead`) | Is the dashboard "Job Status" the Valcre pipeline status (Lead/Active/…)? If yes, supply the enum; if it's a different workflow flag → B. |
| 8 | Lead Appraiser | native `Job.OwnerId` + `Staff1Id/Staff2Id/Staff3Id` | Needs a staff-ID lookup (Valcre wants a person Id, not a name string). Deferred-A. |
| 9 | Value Scenarios | custom fields **11563** (ValuationPremise-1) + **11564** (ValuationPremise-2) — per doc 6 | Parse multi → premise-1 / premise-2. Supersedes the documented-wrong `valuationPremises→RequestedValues`. Dedup with `valuationPremises`. |

## Bucket B — NO Valcre field exists → LOE-contract-only (app + LOE HTML, no sync)

| # | Field | Why B (confirmed) |
|---|---|---|
| 10 | CMHC Financing | No native field and NO custom field in the full live list of 20. Canadian intake flag → LOE HTML + Supabase only. |
| 11 | Purpose | No distinct Valcre field — `Job.Purposes` is the property-rights enum (owned by #2 Property Rights); there is no separate "appraisal purpose" prop or custom field. → LOE HTML + Supabase only. |
| 12 | Desktop Report | **MOVED from clean-4 → B.** Custom field 12050 hardcoded in valcre.ts DOES NOT EXIST (confirmed live API + QA readback + Ben's admin list — no "Desktop" CF anywhere on tenant). #4 wiring REVERTED. → LOE HTML + Supabase only, **unless Ben wants a Valcre CF created** for it. |

## So the decision set for Ben is smaller than feared
- **2 are clean B** (CMHC, Purpose) — wire as LOE-only, no Valcre.
- **9 are A** but need a one-line ruling each (mostly: re-option dropdowns to match live, or resolve a dedup/collision). None require creating a Valcre field.
- Genuinely ambiguous (could flip A→B on Ben's intent): **Assignment Type** (#6) and **Job Status** (#7).
