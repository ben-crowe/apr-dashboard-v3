---
content_type: wiring-reference
title: Section 2 (LoeQuoteSection) — authoritative field→wiring map for the live reorg
status: active — ground-truth from code 2026-06-10; re-verify if sync arrays change
owner: qa-agent (verified from source) · ui-designer (does the regroup) · co-architect (wiring authority)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
date: 2026-06-10
tags: [apr-workflow, field-registry, valcre-sync, clickup-sync, section-2, loe-quote, wiring-map, ground-truth]
---

# Section 2 — Authoritative Field→Wiring Map

**Tags:** #apr-workflow #valcre-sync #clickup-sync #section-2 #wiring-map #ground-truth
**Entities:** [[LoeQuoteSection]] [[Valcre Sync]] [[ClickUp Sync]]

For the LIVE Section-2 regroup. Built from the actual source 2026-06-10 (not docs). The reorg only MOVES JSX — preserve every binding per the rule at the bottom.

---

## ⚠ FIRST — the right file (verified from code)

**The live Section 2 is [`LoeQuoteSection.tsx`](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx).**

- `JobDetailView.tsx:3` imports `JobDetailAccordion` ("Use the correct clean version") → renders `LoeQuoteSection.tsx`.
- `LoeQuoteSectionIndependent.tsx` is rendered ONLY by `JobDetailAccordionFixed.tsx`, which `JobDetailView.tsx:5` marks **"DO NOT USE - has wrong fields."** Do NOT reorg that one — it's dead and only pushes a tiny job-creation payload.

---

## The authoritative rule: wiring = the arrays, NOT a JSX scrape

A field is wired to Valcre **iff its jobDetails key is in `VALCRE_SYNC_FIELDS`** (LoeQuoteSection.tsx:81-88), and to ClickUp **iff in `CLICKUP_CARD_FIELDS`** (line 96-97). **A custom-field ID existing in `VALTA_CUSTOM_FIELD_IDS` does NOT mean the field is wired** — it's only wired if it's also in the sync array (e.g. `assignmentType`, `authorizedUse` have CF IDs but are NOT in this section's sync array → job-record-only here).

---

## Valcre-wired fields (VALCRE_SYNC_FIELDS — 20 keys)

Server (`api/valcre.ts`) resolves by jobDetails NAME → native Job field OR custom CF id.

### → Native Job fields

| jobDetails key | Valcre native field | Also ClickUp? |
|---|---|---|
| `appraisalFee` | `Job.Fee` | ✓ Appraisal Fee |
| `retainerAmount` | `Job.Retainer` | ✓ Retainer |
| `deliveryDate` | `Job.DueDate` | ✓ Delivery Date |
| `requestDate` | `Job.BidDate` | — |
| `signedDate` | `Job.AwardDate` | — |
| `effectiveDate` | `Job.EffectiveDate` | — |
| `propertyRightsAppraised` | `Job.Purposes` | ✓ Property Rights Appraised |
| `scopeOfWork` | `Job.Scopes` | ✓ Scope of Work |
| `reportType` | `Job.ReportFormat` | ✓ Report Type |
| `analysisLevel` | `Job.AnalysisLevel` | — |
| `valuationPremises` | `Job.RequestedValues` | — |
| `paymentAmount` | `Job.AmountPaid` | — |
| `paymentPaidDate` | `Job.PaidDate` | — |
| `paymentTerms` | `Job.Comments` (payment section) | ✓ Payment Terms |
| `appraiserComments` | `Job.Comments` | ✓ Appraiser Notes |
| `deliveryComments` | `Job.DeliveryComments` | ✓ |
| `paymentComments` | `Job.PaymentComments` | ✓ |

### → Custom fields (live block, server resolves NAME→ID)

| jobDetails key | Custom field | Note |
|---|---|---|
| `transactionStatus` | **CF 12424** | live-verified |
| `zoningStatus` | **CF 12425** | live-verified |
| `valueScenarios` | CF 12414 (registry) | ⚠ live values land in **premise 11563/11564**, 12414 unused — divergence #1, Chris question |

---

## Job-record-only (rendered in Section 2, NOT in any sync array)

Save to `job_loe_details` only — no Valcre, no ClickUp. Safe to move freely:
`currentUse`, `proposedUse`, `jobStatus`, `leadAppraiser`, `purpose`, `approachesToValue`, `deliveryTime`, `retainerPaidDate`, `assignmentType`, `authorizedUse` (here — it syncs from ClientSubmissionSection via `intendedUse`, not Section 2).

## LOE tokens

Every Section-2 field feeds the LOE contract via the `generateLOE` mapper, which reads `jobDetails` by key — **layout-independent**. Regrouping does not affect LOE fill.

---

## THE REGROUP RULE — what keeps wiring intact

Wiring is keyed by the field's **jobDetails name** + the three arrays + the `syncData` if-chain. Moving/regrouping the JSX does NOT touch any of that. So the reorg is wiring-safe **as long as you:**

1. **Keep each field's `name`/key exactly** (`name="transactionStatus"` stays `transactionStatus`).
2. **Keep the value binding** (`value={jobDetails.X}`) and the **`onChange`/handler** on each moved control.
3. **Do NOT edit** `VALCRE_SYNC_FIELDS`, `CLICKUP_CARD_FIELDS`, or the `syncData` if-chain (LoeQuoteSection.tsx:539-560).
4. **Only move JSX** — reorder/regroup the rendered controls into new visual groups.

Do those four and no binding breaks. **QA readback after** (test job 784140) confirms it.

---

**Last reviewed:** 2026-06-10 by qa-agent — built from source (VALCRE_SYNC_FIELDS, CLICKUP_CARD_FIELDS, api/valcre.ts native+custom maps, clickup-fields.ts hub map). Caught the wrong-file (Independent) before the reorg started.
