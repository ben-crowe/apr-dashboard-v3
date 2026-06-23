---
content_type: field-note
status: noted — pending Ben's go to action
tags: [apr-workflow, loe, delivery-date, payment-terms, field-cleanup, contract-truth, APR]
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
created: 2026-06-19
author: qa-agent
grounds_on:
  - ~/Development/APR-Dashboard-v3/src/utils/loe/v5Template.ts (Payment Terms + Delivery clauses)
  - ~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts ([deliverytime] token, default '4')
---

# LOE Delivery Date + Payment Terms — Field Notes (contract-verified)

`#loe` `#delivery-date` `#payment-terms` `#field-cleanup`

Read directly from the LOE contract template (not searched). Two findings, both confirm Ben's read.

## 1. Payment Terms — NOT a needed field (Ben-confirmed)
**Payment is a FIXED contract clause, not a per-job choice.** Payment is tied to **signing/commencement** of the engagement (the work-start trigger; the delivery clock itself runs "from date of payment or signed contract"), and the contract's fee clause sets the delinquency rule (not paid within **five (5) days** = delinquent). Exact wording lives in the LOE; the point is it's the same boilerplate for every job.

- The dashboard "Payment Terms" dropdown (On LOE Signature / NET 30 Days / On Completion / 50% Upfront) **maps nowhere** — the dynamic `[paymentterms]` placeholder was removed long ago, so it feeds nothing in the document, and it does not reflect the actual fixed terms.
- The client does not use it. Its only remaining downstream is the Valcre sync.
- Already correctly EXCLUDED from the ClickUp mirror sync.
- **Recommendation:** retire the Payment Terms field from the dashboard (and its Valcre sync) — dead/questionable field, maps to nothing real. (Pending Ben's go.)

## 2. Delivery — it's WEEKS-from-job-start, not a fixed date
**Contract text:**
> "Delivery: **[deliverytime] weeks** (effective from date of payment or signed/returned engagement contract, whichever is later)."

- The LOE expresses delivery as a **number of weeks**, and the clock STARTS at job start (payment or signed contract, whichever is later). There is no fixed calendar delivery date in the contract.
- Implication for the dashboard: the "Delivery Date" should be **blank/derived until the LOE is prepared** — only at LOE creation/send does the start-clock exist, so only then is a real date meaningful. The date becomes set at LOE-prepared time, not entered upfront.
- The genuine input is the **weeks** number. Code default is currently `'4'` (generateLOE.ts: `jobDetails.deliveryTime || '4'`, two places). **Ben: should be 3, not 4** — the 4 is a mistake.
- **Recommendation:** (a) change the default weeks from 4 → 3; (b) make Delivery Date blank until the LOE is prepared, then set it = LOE-prepared/sent date + N weeks (or just carry the weeks number, which is what the contract uses). (Pending Ben's go.)

## 3. Dates glossary (verified in code/registry — these are NOT interchangeable)
| Field | What it actually is (verified) | On client ClickUp? |
|---|---|---|
| **Effective Date** | The **Date of Value** — the date the property is valued *as of* ("market value as of the effective date"). Core appraisal/legal field. NOT the signing date. | No (matters to the report, not their task board) |
| **Delivery Date** | Target ready-to-send / due date. Derived = job-start + N weeks; should set at LOE-prepared time, blank before. | **Yes** (in their Dates group) |
| **Request Date** | As built: **"Date job was requested" (Valcre Job.BidDate)** — the intake/bid date. Maps only to Valcre. | No |
| **Signed Date** | LOE signed date (job start trigger). | via LOE Signed |
| **Delivery Time (weeks)** | The real delivery input → LOE prints "[X] weeks." Default `'4'` in code; **should be 3** per Ben. | No |

**Not redundant:** Effective Date (when value applies) ≠ Delivery Date (when report is due). The ~3 weeks is job-start→delivery, not effective→delivery.

### ⚠ GAP — "client requested delivery date" (Ben 2026-06-19)
Ben recalls Request Date as a **client's special requested delivery date** (rush or extended, e.g. "need it in 5 weeks"). That concept does NOT exist today — the current Request Date is just bid/intake date (Job.BidDate). DECISION FOR BEN: add a real "client requested delivery date" field (rush/extended turnaround), or leave Request Date as bid-date. Pending.

## 4. Retainer — not in the contract (verified)
- `[retainer]` placeholder was REMOVED from the LOE template → retainer prints nowhere in the document.
- **Retainer Paid:** maps to NOTHING (no Valcre, no ClickUp, no LOE, no intake) — fully orphaned dead field.
- **Retainer Amount:** maps only to Valcre Job.Retainer — not in LOE, not on client ClickUp.
- No "100% due on signing" / deposit clause exists in the contract; payment language is the due-on-receipt/5-day boilerplate only.
- Both are "questionable" fields (see convention below).

## 5. "Questionable field" tooltip convention (Ben 2026-06-19)
Instead of silently deleting fields we're unsure the client needs, attach a **client-facing clickable `?` tooltip** flagging the uncertainty so the CLIENT decides keep-or-remove. Apply to:
- **Payment Terms** — "? This may not be needed — payment terms are fixed in the contract (due on signing/receipt). Keep or remove?"
- **Retainer Amount** — "? Is a retainer required, or is it 100% on signing? This field may be removable."
- **Retainer Paid** — "? Currently feeds nothing — keep for internal tracking, or remove?"
This makes the dashboard self-document our open questions for the client. Flag-don't-delete is the new default for uncertain fields.

## Status
NOTED per Ben 2026-06-19 ("make note of it"). No code changed yet — awaiting his go on: retire Payment Terms field, and the delivery default 4→3 + blank-until-prepared behavior.
