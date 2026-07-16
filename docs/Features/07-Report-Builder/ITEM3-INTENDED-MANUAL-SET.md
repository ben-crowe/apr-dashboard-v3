---
title: "Item 3 — the intended-manual set (authored from domain reason, BEFORE the fill change)"
type: build-artifact
status: authored — commit before touching the fill (per SPEC-guided-walk-fixes-batch1.md Item 3)
author: react2
sibling_spec: docs/Features/07-Report-Builder/SPEC-guided-walk-fixes-batch1.md
entry_point: src/components/dashboard/JobDetailAccordion.tsx (handleFillTestData)
---

# Item 3 — Intended-manual set

The per-job **Fill with Test Data** link (`handleFillTestData` in `JobDetailAccordion.tsx`) should
populate every job-page field EXCEPT the ones listed here. This list is authored from domain reason
FIRST, before the fill code is changed, so the acceptance ("every field fills except this set") is
falsifiable — a walker can tell a real fix from one that left the wrong field blank.

**Rule for being on this list:** a field is manual because a STATED domain rule makes a test value
untruthful or wrong — never because the current fill happens to leave it blank.

## Deliberately MANUAL (must NOT be test-filled)

| Field | Key | Rule for being manual |
|---|---|---|
| Retainer Amount | `retainerAmount` | The firm's standard is 100% of the fee on signing. A retainer (a partial up-front amount) applies only to special-case jobs, so a blank / `$0.00` is the *correct* default — a test value would misstate the standard contract. (The field's own in-app note says exactly this: "Standard is 100% on signing — a retainer (partial)…", LoeQuoteSection.tsx ~line 2273.) |
| Retainer Paid Date | `retainerPaidDate` | An ACTUAL receipt date. Only truthful once a retainer exists and has been paid. No planned/test value is honest. |
| Signed Date | `signedDate` | The ACTUAL LOE signing date — written by the e-signature completion flow, not a plan value. Test-filling it fakes a signed job. |
| Payment Amount | `paymentAmount` | An ACTUAL amount received at closing, not a plan value. |
| Payment Paid Date | `paymentPaidDate` | An ACTUAL payment date, set at closing. Test-filling fakes a paid job. |

**Why these five and no others:** they are the two *retainer* fields and the three *lifecycle-actual*
fields (signed, payment amount, payment date). Every one records something that either did or did not
happen to this specific job; a canned value asserts an event that has not occurred. The current fill
already correctly omits `signedDate`, `paymentAmount`, and `paymentPaidDate` — this list makes that
omission a *rule* rather than an accident, and adds the two retainer fields to it explicitly.

## NOT manual — these MUST fill (they are the Item 3 bug)

Every field in the guided-walk symptom is a *should-fill* field; none has a rule that makes it manual:

| Field | Key | Why it must fill |
|---|---|---|
| Purpose | `purpose` | Binding in the spec: "Purpose is NOT manual → it must fill with a test value." The handler currently never sets `purpose` at all. |
| Report Format | `reportFormat` | A plan field. Valid option `Comprehensive` exists; it should populate. |
| Analysis Level | `analysisLevel` | A plan field. Valid option `Detailed` exists; it should populate. |
| Current Use | `currentUse` | A plan field. Valid option `Industrial` exists; it should populate. |
| Proposed Use | `proposedUse` | A plan field. Valid option `Industrial` exists; it should populate. |
| CMHC Financing | `cmhcFinancing` | A plan field. Valid option `No` exists; it should populate. |
| Previously Appraised | `previouslyAppraised` | A plan field. Valid option `No` exists; it should populate. (Its *relocation* is held for Ben under Item 6 — that does not change that it should fill.) |
| Internal / General notes | `appraiserComments` | A free-text notes box. Handler currently never sets it. |
| Delivery instructions | `deliveryComments` | A free-text notes box. Handler currently never sets it. |
| Payment terms | `paymentComments` | A free-text notes box. Handler currently never sets it. |

## The two root causes found by code-reading (to be confirmed by live-repro before the fill)

1. **Never set at all** — `purpose`, `appraiserComments`, `deliveryComments`, `paymentComments`. The
   fill object in `handleFillTestData` has no keys for these. Straightforward: add test values.
2. **Set but not landing** — the six dropdowns. Their fill values ALL match their `<SelectItem>`
   option lists exactly (`Comprehensive`/`Detailed`/`Industrial`/`No`), so this is NOT a
   value-vs-option mismatch. `reportType` and `assignmentType` come through the same
   `onUpdateDetails({...})` object and DO fill, which rules out the whole object failing. The real
   cause is in the details data-flow (which detail keys `onUpdateDetails` actually persists /
   re-hydrates) and must be reproduced live on localhost:8086 and traced before the fill is written —
   guessing here would be the exact back-fitting the spec forbids.
