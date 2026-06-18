---
title: "eSign + Email — Testing Status (APR)"
status: living — updated as we test
created: 2026-06-18
owner: Ben + qa-agent
description: "Where the LOE e-sign + email flow stands in testing — what's working, what's deployed, what's left."
tags: [apr-workflow, loe, esign, email, testing-status, docuseal, valta-sender]
cognee_ingest: skip
gemini_ingest: skip
gemini_store: ""
---

# eSign + Email — Testing Status

**Tags:** #apr-workflow #loe #esign #email #testing-status
**Backlink:** [LOE Flow Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-FLOW-ARCHITECTURE.md)

> Snapshot of the live dial-in (Ben + QA, one-on-one). Updated as we test.

---

## ✅ Working / verified

- **Signed trigger (DocuSeal webhook)** — fixed + WORKING. The webhook URL was a placeholder (`example.com/hook`); now points at our function. A test sign flows through: job flips to `loe_signed`, signed date lands on the dashboard record. Verified in the database.
- **Email delivery with the signing link** — working (currently via **Resend** test path).

## 🚀 Deployed this session (verify on next live test)

- **Signing page shows ONE document** — removed the redundant raw-HTML copy; DocuSeal widget only.
- **Job Status field** — now shows the workflow label (Submitted → Sent — Awaiting Signature → Signed by Client …), not the dead Valcre placeholder.
- **Recipient override** — test-mode redirect removed across all send paths; email goes to whoever's in the recipient field (calm "Sending to:" line replaces the TEST-mode banner).
- **Backup status-advance on sign** — signing page also advances the dashboard job directly, as a webhook backstop.

## ⏳ Pending — email

- **Valta as the sender** (clientcare@valta.ca via Microsoft Graph) — NOT live yet; still sending from Resend. The Mail.Send permission + the real mailbox + the send-code are all ready. Gated on ONE setting: set **`GRAPH_SEND_MAILBOX = clientcare@valta.ca`** in the edge-function secrets + confirm the three Graph creds are present → flips to Valta, no redeploy.
  - Optional guardrail: Exchange Application Access Policy locking Mail.Send to clientcare@valta.ca only.
  - Gotcha: Graph API sends do NOT auto-pull an Outlook signature — put it in the email template or an org-wide rule.
- **Client confirmation email after signing** — the thank-you screen already promises "you'll receive a copy via email shortly"; make that real (send the signed copy / next-steps).

## ⏳ Pending — other

- **Duplicate document** — if a fresh sign STILL shows two document sets after the deploy, the duplication is inside the DocuSeal document itself (generation), not the app page; investigate generateLOE.
- **Thank-you screen redesign** — bare/ugly; becomes the first proper Popup component.

---

**Last reviewed:** 2026-06-18 by qa-agent — email status snapshot; Valta-sender is the one real piece left on email.
