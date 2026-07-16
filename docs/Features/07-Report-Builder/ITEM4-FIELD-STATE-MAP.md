---
title: "Item 4 — per-field blank-state map (authored from domain reason, committed BEFORE render)"
type: build-spec-artifact
item: 4 (three-state blank rule)
author: react2
date: 2026-07-16
spec: docs/Features/07-Report-Builder/SPEC-guided-walk-fixes-batch3.md
mockup: ~/Development/KM-Exp/data/screenshots/apr-item4-three-state-fields.html
---

# Item 4 — per-field blank-state map

The substance of Item 4 is the CLASSIFICATION: which state an empty field is in. A blank rendered in the
wrong state is a silent defect a walker cannot catch, so this map is authored from domain reason and
committed BEFORE the render changes (the Item 3 discipline). qa2 verifies each field's reason against
this map before build-verify.

## The three states (from the mockup)

- **N/A — doesn't apply.** Muted italic + "N/A" pill + short reason. The field is intentionally empty;
  nothing is expected.
- **Auto-fills-later.** Dashed placeholder (`— —`) + blue "auto-fills" chip with a hover tooltip naming
  WHEN/HOW it populates. The value is coming from an external event; no user action.
- **Action-needed — blank.** A real empty input with an amber left-edge (3px) + "● action needed"
  marker. The ONLY meaning a plain blank now carries: the user fills it.

A field that HAS a value renders **filled** (normal), whatever its empty-state would be.

## The classification (LOE/Quote + Payment sections)

Render site is `src/components/dashboard/job-details/LoeQuoteSection.tsx`. (Note: `loe-quote/PaymentSection.tsx`
that the spec also names is DEAD code — not imported or rendered anywhere — so it is NOT a live render
site; all five fields below render in LoeQuoteSection. Flagged to coarch2.)

| Field (state key) | DB column (`job_loe_details`) | State when empty | RULE — why |
|---|---|---|---|
| **Amount Paid** (`paymentAmount`) | `payment_amount` | **auto-fills** | Stamped by the payment webhook when the client's e-payment clears. A blank means "waiting on that event," not "user must act." Tooltip: "Fills when e-payment received. This amount is stamped automatically once the client's payment clears — no need to enter it by hand." |
| **Paid Date** (`paymentPaidDate`) | `payment_paid_date` | **auto-fills** | Same payment webhook stamps the date when the payment clears. Tooltip: "Fills when e-payment received. Stamped automatically the moment the payment clears." |
| **Signed Date** (`signedDate`) | `signed_date` | **auto-fills** | DocuSeal stamps this at signing. Tooltip: "DocuSeal stamps at signing. Populated automatically when the client signs the engagement letter." |
| **Retainer Paid** (`retainerPaidDate`) | `retainer_paid_date` | **CONDITIONAL — see below** | Not one static state; the branch is picked by predicate. |
| **Purpose of Appraisal** (`purpose`) | `purpose` | **action-needed** | A free-text user-input field that should be filled and isn't. The default meaning of a plain user-input blank — the user fills it. |

## The Retainer Paid conditional (qa2 spec-gate F5 — the state is PICKED BY A PREDICATE)

`retainerPaidDate` is NOT one static state. The map encodes three branches, selected in this order:

1. **Job has NO retainer** — predicate: `retainerAmount` is empty OR `Number(retainerAmount) <= 0`.
   → **N/A**, reason "no retainer on this job". The field does not apply.
2. **Retainer exists but is UNPAID** — predicate: retainer present (`Number(retainerAmount) > 0`) AND
   `retainerPaidDate` is empty. → **auto-fills**, tooltip "Fills when the retainer payment clears.
   Stamped automatically once the client pays the retainer."
3. **Retainer paid** — predicate: `retainerPaidDate` has a value. → **filled** (render the date normally).

## Scope note (flagged to coarch2)

The spec's action-needed RULE says "any user-input field not covered by an N/A condition or an auto-fill
source defaults here" — which, taken literally, would put an amber left-edge on many blank inputs across
the whole section. The approved mockup demonstrates the amber "action needed" state on ONE field
(Purpose). To match the mockup exactly and avoid a broad unreviewed visual change, this build applies the
amber "action needed" treatment to **Purpose** (the named acceptance field). Broadening it to every
user-input blank in the section is a larger visual change to confirm with Ben — flagged, not assumed.

## Consequence to note (flagged in the DONE report)

For the auto-fill fields (Amount Paid, Paid Date, Signed Date) and the retainer-unpaid branch, an EMPTY
field renders the chip instead of an editable input — matching the mockup, which shows no input for these
(they populate from the webhook / DocuSeal). When the field is filled, the normal editable input returns.
This removes manual entry while empty; it aligns with "populated by the webhook, no user action," but it
IS a behaviour change from today's always-editable inputs — noted for qa2.
