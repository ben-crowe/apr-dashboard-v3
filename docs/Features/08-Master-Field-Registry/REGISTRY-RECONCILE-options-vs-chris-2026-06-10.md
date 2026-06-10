---
title: Registry Reconcile — Our Options vs Chris's Source (option-lists + field-names only)
status: findings
created: 2026-06-10
updated: 2026-06-10
last_reviewed: 2026-06-10
description: The Layer-2 reconcile link. Diffs every dropdown's option VALUES in our Valta registry (field-registry-v6.html) against Chris's Excel "Dropdown Lists" tab (v03 reviewed 2026-06-09). Valcre IDs explicitly OUT of scope (QA's lane, already confirmed correct). Anchor = Chris's sheet, machine-extracted via openpyxl.
tags: [apr-workflow, field-registry, dashboard, registry-reconcile, option-lists]
entities: [[APR Dashboard]] [[Master Field Registry]]
related: [~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/MOVE-LIST-current-vs-proposed-2026-06-10.md]
---

# Registry Reconcile — Our Options vs Chris's Source

**Tags:** #apr-workflow #field-registry #registry-reconcile #option-lists
**Entities:** [[APR Dashboard]] [[Master Field Registry]]

[🏠 Home](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

> **Scope:** option VALUES + field names only. Valcre target IDs are OUT (QA's lane — already confirmed our code's ID map matches Chris's). Anchor = `Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx` "Dropdown Lists" tab, machine-dumped (openpyxl, no re-typing).

## How to read this

Two surfaces carry options in `field-registry-v6.html`: the **mock dashboard** (the proposed APR dashboard tab) and the older **registry index tab**. The mock is mostly already reconciled; the index tab still shows the raw Valcre dump for Property Type. Rows below are the **mock** unless noted.

✓ = matches Chris exactly · ⚠ = mismatch (fix) · ◇ = no Chris list (internal/dashboard-only — not a mismatch)

---

## ✓ Already matching Chris (leave alone)

| Field | Notes |
|---|---|
| **Property Type** (mock) | 9 values, exact match to `ListPropertyType`. *(The registry INDEX tab still shows the 16-value Valcre dump flagged "9 vs 16" — fix that tab to the 9, or drop the dump.)* |
| **Authorized Use** | exact match to `ListAuthorizedUse` (8) |
| **Status of Improvements** | exact match to `ListSatusofImprovements` (7) — drives the cascade |
| **Tenancy** | values match `ListTenancy` (6) — but see ⚠ typo note below |
| **Assignment Type** | exact match `ListAssignmentType` |
| **Value Timeframe** | same 3 values as `ListValueTimeFrame` (order differs only) |
| **Transaction Status** | exact match `ListTransactionStatus` |
| **CMHC Financing** | Yes/No = `ListYes/No` |

---

## ⚠ Mismatches to fix (our values differ from Chris's)

| Field | Ours now | Chris's list | Action |
|---|---|---|---|
| **Report Type** | Appraisal Report · Completion Report · Evaluation · Restricted Appraisal Report | `ListReportType`: **Comprehensive · Concise · Form** | Total value mismatch. Tied to the naming swap (Chris's "Report Type" = our "Report Format"). Reconcile names + values with Chris before changing. |
| **Zoning Status** | Legal Conforming · Legal Non-Conforming · Illegal · No Zoning | `ListZoningStatus`: **In Place · To Be Rezoned** | Totally different. Confirm which Chris means (his 2 look like a workflow state, ours like a legal classification). Flag to Chris. |
| **Land Metric** | Square Feet · Acres · Hectares | `ListLand$/Metric`: **$/Unit · $/FAR · $/SF · $/Acre** | Different concept (ours = area unit, Chris = price-per metric). Flag to Chris. |
| **State of Improvements** | Existing · Proposed · Vacant Land | `ListSateofImprovements`: **Improved · Proposed · Vacant Land · Improved Development Land** | "Existing"→"Improved"; add "Improved Development Land". |
| **Property Subtype** | Apartment · Townhouse · Mixed Use | `ListPropertySubtype`: + **Shopping Centre** | Add "Shopping Centre". |
| **Tenancy** (typo trap) | Unknown | Chris's literal value is **"Unkown"** (his typo) | Exact-text cascade matching means our corrected spelling won't match his. Either flag the typo to Chris to fix at source, or mirror it. Do NOT silently diverge. |
| **Proposed Use** (the new dropdown I built) | 6 values, missing "Not Applicable" | `ListProposedUseImprovements`: **Not Applicable** · Single Family · Multifamily · Mixed Use · Retail · Industrial · Office (7) | Add "Not Applicable" as first option. **Already actionable — mine to fix.** |
| **Report Type / index tab** | 16-value Valcre dump | 9-value `ListPropertyType` | Align the registry index tab's Property Type to the 9 (the mock is already right). |

---

## ◇ No Chris list — internal / dashboard-only (NOT mismatches)

These have no row in `ListDropdownLists`; they're our own UI fields. Listed so they don't get "flagged" later:

- **Valuation Premises** (Market Value · Market Rent · Investment Value · Insurable Value) — internal; distinct from Value Scenarios.
- **Asset Condition** (Excellent → Poor) — internal.
- **Job Status** (Draft · In Progress · Under Review · Completed · On Hold) — these are invented; Chris's Job Status maps to the Valcre **Status** enum, not a dropdown list. Confirm the real Valcre Status values before trusting ours.
- **Scope of Work** (All Applicable · Best One Approach · …) — no `ListScopeOfWork`; confirm intent with Chris.
- **Property Rights** — values match `ListInterestAppraised` plus one derived combo ("Fee Simple & Leased Fee"); it's a derived outcome, extra combined value is by design.

---

## What's mine to fix now vs flag to Chris

- **Mine (no client input needed):** add "Not Applicable" to Proposed Use; add "Shopping Centre" to Property Subtype; fix State of Improvements values; align the index-tab Property Type to the 9.
- **Flag to Chris (his call):** Report Type values + naming swap; Zoning Status meaning; Land Metric concept; the "Unkown" typo; the real Valcre Status enum for Job Status; Scope of Work intent.

---

**Last reviewed:** 2026-06-10 by ui-designer — initial option-value reconcile of our registry vs Chris's v03 sheet (Valcre IDs out of scope).
