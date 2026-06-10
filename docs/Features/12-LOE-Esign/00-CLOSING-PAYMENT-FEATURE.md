---
content_type: feature-sheet
title: Closing & Payment (Sign → Thank-You → Pay → Paid) — Feature Sheet
status: MOSTLY TO-BUILD — Email 1 + e-sign live; thank-you, payment portal, paid-trigger not built. Sandbox path ready.
owner: Ben (direction) · co-architect (coordination) · react-spec (build) · ui-designer (thank-you page) · qa-agent (verify)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, closing-sequence, payment, quickbooks, thank-you-page, paid-trigger, client-email, resend, feature-sheet]
keywords: [closing payment feature, sign to paid sequence, quickbooks payment link portal, thank you page after signing, follow-up email payment, paid trigger webhook, how the closing phase works, brief an agent on payment]
related: [~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-CLOSING-INFOGRAPHIC-PLAN.md, "~/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./Client-Email-Sequence/README.md", ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md]
---

# Closing & Payment (Sign → Thank-You → Pay → Paid) — Feature Sheet

The single front door for the **final phase**: take a signed LOE all the way to a paid client,
automatically. Linked from the [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)
(Stage 4). Picks up where the [LOE / E-Signature feature](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md) ends.

> **Why this sheet exists:** the closing pieces were scattered — the email sequence in one feature
> folder, QuickBooks + the closing roadmap in another. This is the go-to source of truth; it links
> out to the detail docs.

---

## 1. What it is

After a client signs the LOE, the app should **thank them, collect payment via QuickBooks, and mark
the job paid — automatically**, with no manual chasing. Each step triggers the next, mirroring the
existing sign-trigger automation.

## 2. How it works (the target sequence)

```
LOE email (sign link)  →  client signs (DocuSeal)  →  [signed webhook]
   →  thank-you page  +  auto-send QuickBooks payment link (amount = the quote/LOE fee)
   →  client pays in QuickBooks  →  [paid webhook]  →  dashboard status = PAID
```

1. **LOE email** — carries the signing link. **Built** (Resend, `send-loe-email-fixed` edge function).
2. **E-signature** — client signs in DocuSeal. **Built.** (See the [E-Signature feature sheet](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md).)
3. **Thank-you page** (post-signing) — what the client sees after signing; **must lead to the payment portal**. *To build* — ui-designer mocks it.
4. **Payment portal (QuickBooks)** — the thank-you page and/or a follow-up email carries a QuickBooks payment link for **the quote amount**. Auto-fires on the DocuSeal "signed" event. *To build.*
5. **Paid trigger** — when the client pays, a QuickBooks webhook fires back → dashboard status → **paid**, mirroring the existing DocuSeal-signed trigger pattern. *To build.*

## 3. Current state — what's built vs. not

- ✅ **Email 1 (LOE / sign link)** — Resend, fully operational (`noreply@crowestudio.com`).
- ✅ **E-signature** — DocuSeal, live (V07 contract as of 2026-06-05).
- ⚠️ **ClickUp status updates** — partial (the existing stage automation; "paid" not wired).
- ❌ **Thank-you page** — not built.
- ❌ **Follow-up / payment email (Email 2)** — not built.
- ❌ **QuickBooks payment portal/link** — not built. **Research done; sandbox path identified.**
- ❌ **Paid trigger (QB webhook → dashboard)** — not built.

**Key unblock:** the whole flow is **buildable NOW against the QuickBooks SANDBOX** — no waiting on
the merchant-account application, and an invoice-only model can even ship without the merchant
account. See [QuickBooks Sandbox Payment Path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md).

## 4. How to tell an agent to work on it

- **Read first:** this sheet, the [Closing Sequence Roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md) (the trigger chain + owners), and the [Sandbox Payment Path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md).
- **Prime properly:** two-phase search (Phase 1 `context-search` + Phase 2 `/search-all` SS12) on QuickBooks/payment/webhook/thank-you, and report the layers run.
- **Pattern to mirror:** the **DocuSeal signed-webhook → status update** automation already exists — the QuickBooks paid-trigger copies that shape. Don't invent a new pattern.
- **Amount source:** the payment amount = the **quote / LOE fee** on the job (not hand-entered).
- **Iron rules:** sandbox first (no real charges); test recipient only (`bc@crowestudio.com`), never a real client; destination-side readback on every webhook/status write.
- **Build brief pattern:** same as the V07 go-live — a build-brief doc the agent reads + executes, gated through co-architect on Ben's go.

## 5. Pending / what's left to build (this is the bulk of the phase)

- **Thank-you page** (post-signing) — ui-designer mocks + screenshots; must embed/lead to payment. See [Closing Infographic Plan](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-CLOSING-INFOGRAPHIC-PLAN.md).
- **QuickBooks payment link/portal** — generate a payment link for the quote amount; build against sandbox. See [QB Integration Research](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md).
- **Auto-send on signed** — DocuSeal "signed" event → fire the payment link + thank-you.
- **Paid webhook → dashboard "paid"** — mirror the DocuSeal-signed trigger.
- **Follow-up email (Email 2)** — Resend, carries the payment link. See [Client Email Sequence](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./Client-Email-Sequence/README.md).
- **ClickUp "paid" status** — finish the partial status automation.
- **Merchant account (later)** — only needed for real card processing; sandbox unblocks the build now. [Merchant Application How-To](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md).

## 6. Related docs (all linked, working together)

- [Client Closing Sequence Roadmap](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md) — the trigger chain + owners + open questions.
- [QuickBooks Sandbox Payment Path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md) — the build-now unblock.
- [QuickBooks Payment Integration Research](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md) — API options for payment link + paid detection.
- [QuickBooks Merchant Application How-To](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md) — the real-account signup (Canada, later).
- [LOE Closing Infographic Plan](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-CLOSING-INFOGRAPHIC-PLAN.md) — the thank-you / closing visual.
- [Client Email Sequence](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./Client-Email-Sequence/README.md) — Email 1 (done) + Email 2 (to build).
- [LOE / E-Signature Feature Sheet](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-LOE-ESIGN-FEATURE.md) — the prior phase this one continues from.
- [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) — project front door (this = Stage 4).
