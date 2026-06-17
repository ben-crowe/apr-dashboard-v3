---
title: "Slice-4 — 5 option-drift triage (registry-master vs V3-actual)"
created: 2026-06-17
author: qa-agent
purpose: Triage the 5 real dropdown option-drifts the non-circular drift-gate caught on first real run, so co-arch can assign canonical source per field before prod-live.
status: for-triage (co-arch/Chris)
---

# Slice-4 option-drift triage — the 5 the gate caught

Context: the drift-gate ran non-circular end-to-end on the real config + V3-actual manifest. `required` is being dropped as a blocking dimension (V3 doesn't enforce it). These 5 are the REAL option-set drifts left — the gate doing its job. Per field: registry-master vs V3-actual + QA triage read.

---

## 1. ApproachestoValue — PURE LABEL-DRIFT (easiest)
- **Registry:** `Land Direct Comparison Approach, Cost Approach, Direct Comparison Approach, Income Approach`
- **V3:** `Direct Comparison, Income, Cost, Land Direct Comparison`
- **Delta:** SAME 4 concepts, registry has the `" Approach"` suffix, V3 doesn't. Zero semantic difference.
- **QA triage → LABEL-ALIGN.** Pick one convention (recommend the V3 bare form, since that's what the LOE actually renders), align the other. Trivial. Not a Chris-question.

## 2. ValueScenarios — V3 is a strict SUBSET of registry
- **Registry (10):** As Is Vacant Land, As If Vacant Land, As If Complete & Stabilized, As-Is, As Stabilized, As If Complete & Stabilized - Renovated, As If Complete - Rezoned, As If Complete - Serviced, As If Complete - Subdivided, Insurable Replacement Cost
- **V3 (4):** As If Complete - Rezoned, As If Complete - Serviced, As If Complete - Subdivided, Insurable Replacement Cost
- **Delta:** in-V3-not-registry = NONE. V3 carries only 4 of the registry's 10 (these are the loeCascade PENDING_SCENARIOS subset; the other 6 — As-Is/As Stabilized/etc — are the live cascade scenarios, missing from this manifest slice).
- **QA triage → ALIGN-TO-REGISTRY (likely manifest-gen incomplete).** The 6 missing are the COMMON scenarios (As-Is, As Stabilized) — almost certainly the manifest-gen pulled only PENDING_SCENARIOS, not the full STATUS_TO_SCENARIOS∪NARRATIVES set. Verify the manifest-gen's ValueScenarios extraction is complete before treating this as real product drift. If V3 genuinely only offers 4 → Chris-question.

## 3. PropertyType — MIXED (label-variants + genuinely divergent sets)
- **Registry (9):** Multifamily, Self-Storage, Retail, Industrial, Office, Land, Hotel, Seniors, Other
- **V3 (11):** Agriculture, Building, Healthcare, Hospitality, Industrial, Land, Manufactured Housing, Multi-Family, Office, Retail, Self-Storage
- **Delta:** overlap = Industrial/Land/Office/Retail/Self-Storage. Label-variants: `Multifamily`(reg)≈`Multi-Family`(V3); `Hotel`(reg)≈`Hospitality`(V3). Registry-only: Seniors, Other. V3-only: Agriculture, Building, Healthcare, Manufactured Housing.
- **QA triage → V3-IS-RIGHT (registry likely stale) — but confirm.** V3 is the richer, current intake taxonomy (more property types). Registry looks like an older/trimmed list. Recommend align-to-V3 (+ reconcile the Multifamily/Multi-Family + Hotel/Hospitality label variants). Light Chris-touch to confirm Seniors/Other aren't needed.

## 4. AuthorizedUse — substantially different lists (Chris-question)
- **Registry (8):** First Mortgage Financing, Financial Reporting, Insurance, Internal Decision-Making, Acquisition-Disposition, Estate Planning, Litigation, GST
- **V3 (11):** Acquisition/Disposition, Consulting, Decision-Making/Internal, Dispute Resolution, Divorce, Establish Sales Price, Estate Planning, Financial Reporting, Financing, Litigation, Other
- **Delta:** overlap = Estate Planning, Financial Reporting, Litigation. Label-variants: `Acquisition-Disposition`/`Acquisition/Disposition`; `Internal Decision-Making`/`Decision-Making/Internal`. Otherwise genuinely different (registry: Insurance, GST, First Mortgage Financing; V3: Consulting, Divorce, Dispute Resolution, Establish Sales Price, Financing, Other).
- **QA triage → CHRIS-QUESTION.** The intended-use taxonomy differs materially between registry and intake — not a clean align. Needs Chris to say which use-list is canonical (or merge). Fix the 2 label-variants regardless.

## 5. ReportType — ⚠ DISJOINT — possible SEMANTIC MIS-ALIAS (most important)
- **Registry (3):** Comprehensive, Concise, Form
- **V3 (10):** Amendment Letter, Appraisal Report, Broker Opinion of Value, Completion Report, Consultation, Desk Review, Evaluation, Peer Review, Rent Study, Restricted Appraisal Report
- **Delta:** ZERO overlap. These appear to measure DIFFERENT AXES — registry `Comprehensive/Concise/Form` = report FORMAT/detail-level; V3 `Appraisal Report/Desk Review/...` = report PRODUCT/type.
- **QA triage → ⚠ NOT a value-drift — likely a WRONG ALIAS.** Registry "ReportType" (format) and V3 "reportType" (product) may be two DIFFERENT fields wrongly crosswalked to one canonical `n`. Before reconciling values, co-arch/Chris must confirm they're even the same concept. If they're different axes, this is an alias-map error to split, not an option-set to align. **Highest-priority of the 5.**

---

## Summary triage table
| # | Field | Type of drift | QA call |
|---|---|---|---|
| 1 | ApproachestoValue | label-only ("X" vs "X Approach") | LABEL-ALIGN (trivial) |
| 2 | ValueScenarios | V3 subset (4 of 10) | check manifest-gen completeness → likely ALIGN-TO-REGISTRY |
| 3 | PropertyType | mixed label + divergent | V3-IS-RIGHT (registry stale), confirm |
| 4 | AuthorizedUse | materially different | CHRIS-QUESTION |
| 5 | ReportType | disjoint axes | ⚠ POSSIBLE WRONG-ALIAS — verify same concept FIRST |

After these are resolved/tagged (+ required dropped as blocking) → re-run gate → green → QA clears → prod-live.

---

# ADDENDUM — the 4 RESIDUAL blocks (surfaced after required→report-only)

The original "5" was really **9** — these 4 were present from the first run but OVERSHADOWED by the universal `required=null` block (every field blocked on required). Once `required` became report-only, these 4 surfaced as the real remaining blocks. QA ran a FULL extraction-gap scan across all 26 so we stop finding them 3-at-a-time. **Scan result is BOUNDED — exactly these 4, no more:**

## Class A — options=NULL (manifest-gen extraction INCOMPLETE) — 3 fields
The inline-`<SelectItem>` lift (the Phase-3 precursor) did NOT cover these — the manifest-gen has no options to compare, so the gate correctly fail-closes (3 fields blind = blocked). **NOT real drift — same extraction-gap class as the `required=null` and ValueScenarios-subset bugs.**
- **PropertySubtype** — registry has `[Apartment, Townhouse, Mixed Use]`; V3-actual `options=null`.
- **Tenancy** — registry `[Multi-Tenant, Owner Occupied, Partial Owner Occupied, Single-Tenant, Unknown, Vacant]`; V3-actual `null`.
- **InterestAppraised** — registry `[Fee Simple, Leased Fee Interest, Leasehold Estate, Going Concern]`; V3-actual `null`.
- **FIX:** complete the options-lift for these 3 (read their real V3 options). Recommend the gen ALSO set `readable:false` for any field it genuinely can't extract, so the gate blocks them as "unreadable (fail-closed)" rather than the mislabeled "options-drift" — clearer diagnostics.

## Class B — set-match, ORDER differs — 1 field
- **Valuetimeframe** — same 3 values, different order: registry `[Current, Prospective, Retrospective]` vs V3 `[Current, Retrospective, Prospective]`. Trivial.
- **FIX:** align V3 order to the registry (master canonical) — per co-arch's routing (C).

## Bounding note (QA completeness pass — co-arch's ask B)
Full scan of all 26 checkable fields: **options=null in exactly 3** (above), **order-diff in exactly 1** (Valuetimeframe), `required=null` universal (24, now report-only → fine). **No further extraction gaps exist** — after these 4, the manifest is complete. The completeness pass should confirm this holds after the re-emit.

→ ui-designer: (A) lift options for the 3 null fields, (B) confirm the full-26 completeness, (C) Valuetimeframe order. Re-emit → QA re-runs → green-26 → clear → prod-live.
