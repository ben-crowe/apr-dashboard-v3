---
content_type: research
title: QuickBooks Payment Integration — research findings (for the closing sequence)
status: research (forked-agent findings 2026-06-04)
home: 00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, quickbooks, payments, invoice-link, webhook, closing-sequence]
related: [CLIENT-CLOSING-SEQUENCE-ROADMAP.md, LOE-DOCUSEAL-ARCHITECTURE.md]
note: Part 2 (flow architecture) landed. Part 1 (which QB product + CANADA availability) still pending.
---

# QuickBooks Payment Integration — Research

## Part 2 — Flow architecture (LANDED)

### Reuse story (it's an EXTENSION, not a rebuild)
The existing signed-handler `supabase/functions/docuseal-webhook/index.ts` has the attach point at **line ~395** (`// TODO: Trigger payment flow (GHL integration)`) right after it flips `status = loe_signed`. Replace that TODO with QuickBooks. Reuse as-is: the DocuSeal-signed edge fn + its job-lookup, `job_loe_details` (fee source), Resend senders (`send-loe-email*`), `updateClickUpLOEStatus()`, Supabase service-role/CORS scaffolding, and the DB-status-drives-dashboard mechanism.

### The chain
1. DocuSeal `submission.completed` → existing `docuseal-webhook` (extend at ~395).
2. Read fee from `job_loe_details`.
3. NEW `create-qb-invoice` edge fn (isolated so DocuSeal retries don't re-create invoices): QB OAuth → create Invoice (CustomerRef + fee) → `GET invoice?include=invoiceLink` → QuickBooks-hosted pay URL → persist `qb_invoice_id` + `qb_invoice_link` (idempotent on job) → Resend "thank you / pay now" email → status `loe_signed_awaiting_payment`.
4. Thank-you page (NEW React route `/pay/:jobId`) reads the SAME stored `qb_invoice_link` (no live QB call, no double-create). Email + page point at the identical link.
5. Client pays on QB's hosted page (QB handles PCI/cards/ACH — we never touch card data).
6. NEW `quickbooks-webhook` edge fn (twin of docuseal-webhook): verify `intuit-signature` (HMAC-SHA256 over RAW body, verifier token) → payload has NO data, so GET Payment by id → `LinkedTxn` → Invoice id → match `qb_invoice_id` → job → reconcile (`Balance==0` = fully paid) → dedupe on `qb_payment_id` → status `paid` + `amount_paid`/`paid_at` → ClickUp "Paid" line.
7. Dashboard reflects `paid` via the existing status mechanism.

### Build notes / gotchas
- **Link OUT to QB's hosted page** — do NOT embed a payment form. In email: bulletproof `<a>` button (table + VML for Outlook, anchor not `<button>`, NEVER an image, always a visible text-URL fallback). Thank-you page can optionally iframe the hosted page (web only).
- **QB webhook payloads carry NO data** — they're a trigger; you fetch the Payment by id. Subscribe to the `Payment` entity in the Intuit dashboard.
- **CloudEvents migration deadline JUL 31 2026** — Intuit is changing the webhook payload shape (`type`/`intuitentityid`/`intuitaccountid`); build the new handler to read CloudEvents or add a normalizing adapter.
- **Idempotency:** reuse `qb_invoice_id` if set (no double-invoice); dedupe payments on `qb_payment_id`; match by `LinkedTxn` Invoice id, never by amount.
- **New columns on `job_loe_details`:** `qb_invoice_id, qb_invoice_link, qb_payment_id, payment_status, amount_paid, paid_at`.
- **New pieces:** QB OAuth token store + refresh, `create-qb-invoice` fn, `quickbooks-webhook` fn, `/pay/:jobId` route, Resend sender clone.

## Part 1 — Which QB product + CANADA availability (LANDED)

### CANADA — CONFIRMED AVAILABLE
QuickBooks Payments is available to Canadian merchants — card, Apple Pay, and bank (EFT) payments. So the integration is VIABLE. Nuance: Canadian bank payments are **EFT, not US ACH** (up to $50k/txn, 3–4 day funding; cards fund next business day). Treat US "ACH" docs as the US equivalent; do a CA-region sandbox spike before trusting US-first Payments docs.

### RECOMMENDED APPROACH
**QBO Invoicing with an online-payment-enabled Invoice + the `invoiceLink` sharable URL — NOT the raw Payments charge API.** Intuit hosts the PCI-compliant payment page → our edge functions stay out of PCI scope. Maps exactly to "generate a pay link for $X tied to a customer, send it, get paid." (Raw Payments API = embed-your-own-checkout = more PCI burden, overkill. GoPayment = in-person card reader, irrelevant.)

### Setup steps
1. Intuit Developer app (sandbox + prod keys).
2. **Canadian QBO company + apply for QuickBooks Payments / Merchant Services — underwriting approval required (legal name, address, SIN, maybe 3mo bank statements). NOT instant — START THIS EARLY, parallel to the build.** (Ben action — it's the business's merchant account.)
3. OAuth2 Authorization Code, scopes `com.intuit.quickbooks.accounting` + `com.intuit.quickbooks.payment` — one-time consent for the single company, persist + rotate the refresh token.
4. Create Invoice: line item = quote fee, `CustomerRef`, `BillEmail.Address` populated (REQUIRED or no link), `AllowOnlineCreditCardPayment: true`, `AllowOnlineACHPayment: true`. Then `GET invoice?include=invoiceLink` → hosted "Pay now" URL → embed in Resend email.
5. Webhook on `Payment` + `Invoice` entities, verify `intuit-signature`, re-fetch on event (payload is notification-only).

### Fees (Canada, confirm vs signed merchant agreement)
~2.9% + $0.25 invoiced cards · 3.5% keyed · 2.5% card-reader · ~1% bank/EFT. Trigger fires on payment authorization (webhook), not settlement (cards next-day, bank 3–4 days).

### Verify-before-build (quick sandbox spike)
Intuit docs are JS-rendered (couldn't fetch cleanly) — confirm the exact `invoiceLink` field name + `AllowOnlineACHPayment` CA-region behavior in sandbox before committing the wiring.

## Verdict
GREEN LIGHT — viable in Canada, recommended approach is QBO invoice + invoiceLink, flow extends the existing DocuSeal-signed handler. Only long-pole = the merchant-account underwriting approval (Ben starts it). Build sequence: merchant approval + OAuth setup → react-spec wires create-qb-invoice + quickbooks-webhook per Part 2.
