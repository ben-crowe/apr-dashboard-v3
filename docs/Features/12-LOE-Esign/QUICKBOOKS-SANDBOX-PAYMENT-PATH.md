---
content_type: finding
title: QuickBooks Sandbox — Payment Closing Path (unblocks building now)
status: proposal — ready to build against sandbox
owner: qa-agent
created: 2026-06-05
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, closing-sequence, loe-closing, payment, quickbooks, sandbox, intuit, webhook, clickup, unblock]
keywords: [quickbooks sandbox, intuit developer sandbox, build closing flow without merchant account, invoice only model, sign to paid sandbox, payment closing path]
related: [~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CLIENT-CLOSING-SEQUENCE-ROADMAP.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-CLOSING-INFOGRAPHIC-PLAN.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md, ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md]
---

# QuickBooks Sandbox — Payment Closing Path

**Why this exists:** payment is the one missing piece in the closing flow (the `docuseal-webhook` has a
`// TODO: Trigger payment flow` placeholder, originally noted as GHL). Ben's decision: payment runs through
**QuickBooks invoicing** (not a card "Pay Now" link). The blocker everyone assumed — waiting on a real
merchant-account application — is **NOT** a blocker for building. Intuit gives a free sandbox that is the
real API, so we can build and test the entire closing choreography now and swap to the live company later
with config only.

---

## 1. Sandbox setup (brief)

What it takes to spin up:

- **Free Intuit Developer account** at developer.intuit.com — no merchant application, no approval wait.
- **Create an app** in the developer portal → get **sandbox Client ID + Client Secret** (the dev keys).
- **Sandbox QuickBooks Online company** is auto-provisioned with the account (a fake books company,
  pre-seeded, safe to write to).
- **OAuth2** (authorization-code grant) to get access/refresh tokens scoped to the Accounting API.
  Tokens + realmId (company id) stored as edge-function secrets, same pattern as our other integrations.
- **Point the edge function at the sandbox base host** (Intuit sandbox API host) instead of production —
  a config/env swap, nothing structural.

### What the sandbox lets us test END-TO-END (no real money, no merchant account)
- Create a **Customer** + create an **Invoice** via the Accounting API (from the signed-LOE job data).
- **Send** the invoice (QuickBooks emails it / generates the invoice the client receives).
- **Record a Payment** against the invoice (simulate the client paying) — flips the invoice to Paid.
- **Receive Intuit webhooks** on the invoice/payment event → fire our downstream Trigger-2 chain
  (thank-you/receipt email + app status update + ClickUp status flip + team notify).
- The full sign → thank-you → invoice → paid → downstream loop, rehearsed start to finish.

### What still needs the REAL merchant account (QuickBooks Payments)
- **Only** a live, clickable card "**Pay Now**" on the invoice that actually charges a card. That requires
  the approved **QuickBooks Payments** merchant account.
- **Not needed for Ben's chosen model:** invoice-only, where the client pays (e-transfer/cheque/etc.) and
  the invoice is marked Paid — the "paid" webhook still fires. So the merchant account is a later upgrade,
  not a gate on building or demoing the flow.

### Build-time items to confirm (not blockers, just verify against current Intuit docs)
- Exact OAuth scope string for Accounting, sandbox API host, and the webhook event names/payload shape.
- Token refresh cadence (Intuit refresh tokens rotate) — store + rotate like the other integrations.

---

## 2. The closing sequence (two triggers) + what's updated

Framed with Ben — the closing flow is **two automatic triggers**; naming them separately is what makes it
buildable:

- **Trigger 1 — LOE signed** (DocuSeal `submission.completed`, already firing): send a branded
  thank-you-for-signing email **and** create + send the QuickBooks invoice. This is where the existing
  `docuseal-webhook` payment TODO gets replaced with the QB invoice call.
- **Trigger 2 — invoice paid** (Intuit webhook): send a thank-you/receipt email, update the job in the app,
  flip the ClickUp card status, and notify the team.

Proposed ClickUp status path: **Pending → Invoice Sent → Paid** (confirm "Paid" wording with the client).

Open product confirm (Ben): one thank-you email from us on signing **plus** QuickBooks' own invoice email,
vs. letting QuickBooks' invoice email carry it. Leaning: one short branded thank-you from us + QB's invoice.

**Net:** build the whole closing loop against the sandbox now; the only thing that waits on the merchant
account is live online card payment, which Ben's invoice-only model doesn't require to ship.
