# Valcre Custom Fields — Admin Ground Truth

**Source:** Live Valcre admin → https://app.valcre.com/admin/customfields (logged in as chris.chornohos@valta.ca)
**Captured:** 2026-06-03 by qa-agent (isolated browser session, read-only — CANCEL used on every edit panel, no SAVE/DELETE)
**Cross-checked against:** Ben's admin screenshot (`~/Development/KM-Exp/data/tasks/content/task_015q1z37/attachments/screencapture-app-valcre-admin-customfields-2026-06-03-19_55_15.png`) — types match.
**Entity:** all 20 are **Job**-level fields, scope "All offices".

> Admin UI does NOT expose numeric field IDs or AvailableValue IDs. The `id` / option-id columns below are cross-referenced from `api/valcre.ts` (`VALTA_CUSTOM_FIELD_IDS` + `VALTA_FIELD_CONFIG`) where a mapping exists.

## Complete field set (20)

| Name | Label | Type | code id | In code map? |
|---|---|---|---|---|
| LenderCompanyName | Lender Company Name | Text | — | ❌ not mapped |
| LenderCompanyAddress | Lender Company Address | Text | — | ❌ not mapped |
| LenderContactName | Lender Contact Name | Text | — | ❌ not mapped |
| LenderContactEmail | Lender Contact Email | Text | — | ❌ not mapped |
| LenderContactPhone | Lender Contact Phone | Text | — | ❌ not mapped |
| LenderContactTitle | Lender Contact Title | Text | — | ❌ not mapped |
| ValuationPremiseOne | Valuation Premise - 1 | Select one | — | ❌ not mapped |
| ValuationPremiseTwo | Valuation Premise - 2 | Select one | — | ❌ not mapped |
| AppraisedValueOne | Appraised Value - 1 | Whole number | — | ❌ not mapped |
| AppraisedValueTwo | Appraised Value - 2 | Whole number | — | ❌ not mapped |
| Tenancy | Tenancy | Select one | 12042 | ✅ |
| StateOfImprovements | State of Improvements | Select one | 12043 | ✅ |
| StatusOfImprovements | Status of Improvements | Select one | 12044 | ✅ |
| PropertySubtype | Property Subtype | Select one | 12045 | ✅ |
| LandMetric | Land Metric | Select one | 12046 | ✅ |
| AssignmentType | Assignment Type | Select one | 12049 | ✅ |
| ValueTimeframe | Value Timeframe | Select one | 12051 | ✅ |
| ApproachesToValue | Approaches to Value | **Select multiple** | 12052 | ✅ |
| TransactionStatus | Transaction Status | Select one | 12053 | ✅ |
| ZoningStatus | Zoning Status | Select one | 12054 | ✅ |

## ⚠️ Phantom fields — in code but DO NOT EXIST in live Valcre

These are in `VALTA_CUSTOM_FIELD_IDS` but have NO admin definition (confirmed absent from the 20-field set):

| code field | code id | Status |
|---|---|---|
| environmentalAssessment | 12047 | ❌ phantom — no live field |
| heritageConservation | 12048 | ❌ phantom — no live field |
| **desktopReport** | **12050** | ❌ **phantom — no live field** (this is why PRD-A #4 fails) |

Also confirmed by Ben: **no Desktop Report and no CMHC custom field exists.** Any dashboard field routed to these (Desktop Report, CMHC Financing) cannot land as a Valcre custom field — needs a native field, a new custom field created in admin, or to be dropped.

## Dropdown option sets (ground truth)

**ValuationPremiseOne** (Valuation Premise - 1): As Is · As Stabilized · As Is Vacant Land · As If Vacant Land · As If Complete & Stabilized · As If Renovated & Stabilized · As If Rezoned · As If Serviced · As If Subdivided
**ValuationPremiseTwo** (Valuation Premise - 2): As Is · As Stabilized · As If Renovated & Stabilized · As If Complete & Stabilized · As Is Vacant Land · As If Vacant Land · As If Rezoned · As If Serviced · As If Subdivided
**Tenancy:** Multi-Tenant · Single-Tenant · Owner-Occupied · Partial Owner Occupied · Vacant · Unknown
**StateOfImprovements:** Proposed · Under Construction · Complete
**StatusOfImprovements:** As Is · As Complete · As Stabilized · As Proposed
**PropertySubtype:** Low-Rise · Mid-Rise · High-Rise · Garden · Walk-Up · Townhouse · Mixed-Use
**LandMetric:** Square Feet · Acres · Hectares
**AssignmentType:** Standard · Update · Retrospective · Desktop
**ValueTimeframe:** Current · Retrospective · Prospective
**ApproachesToValue** (multi): All Applicable · Cost Approach · Direct Comparison · Income Approach · Cost + Direct Comparison · Cost + Income · Direct Comparison + Income
**TransactionStatus:** Arms Length · Non-Arms Length · Listing · Under Contract · REO/Bank Sale
**ZoningStatus:** Legal Conforming · Legal Non-Conforming · Illegal · No Zoning

> All captured option sets match `api/valcre.ts` `VALTA_FIELD_CONFIG` labels exactly (option AvailableValue IDs in code: tenancy 5949–5954, stateOfImprovements 5955–5957, statusOfImprovements 5958–5961, propertySubtype 5962–5968, landMetric 5969–5971, assignmentType 5972–5975, valueTimeframe 5976–5978, approachesToValue 5979–5985, transactionStatus 5986–5990, zoningStatus 5991–5994).

## For react-spec — A/B sort inputs
- **Desktop Report, CMHC Financing** → no custom field exists. Decide: create field, use native, or drop. (A: needs a decision)
- **Value Scenarios / Requested Values** → likely route to ValuationPremiseOne/Two (Select one) + AppraisedValueOne/Two — NOT currently in code map. Note Premise-1 and Premise-2 have slightly different option orders.
- **Property Rights (multi)** → native `Job.Purposes` (PURPOSES_MAP) per api/valcre.ts, not a custom field.
- All ✅-mapped select fields above have verified option labels — safe to wire.

## Evidence (screenshots, ~/Development/KM-Exp/data/screenshots)
- `valcre-admin-customfields-01.png` — admin table (Name/Label/Type)
- `valcre-admin-assignmenttype-edit.png` — edit-panel pattern (options list)
