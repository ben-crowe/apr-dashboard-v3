---
title: "LOE Flow Architecture — Send · Sign · Trigger Map"
status: active
created: 2026-06-18
owner: qa-agent (verification) · Ben
description: "How the LOE flow connects end-to-end: what gets sent, what DocuSeal sends back, and what each callback triggers."
tags: [apr-workflow, loe, docuseal, email, trigger-map, architecture, webhook, clickup, quickbooks, sharepoint]
cognee_ingest: skip
gemini_ingest: skip
gemini_store: ""
---

# LOE Flow Architecture — Send · Sign · Trigger Map

**Tags:** #apr-workflow #loe #docuseal #email #trigger-map #architecture #webhook
**Entities:** [[DocuSeal]] [[Microsoft Graph]] [[ClickUp]] [[QuickBooks]] [[SharePoint]] [[Resend]]
**Backlink:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)
**Deep-dives:** [LOE Email Delivery Setup](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-EMAIL-DELIVERY-SETUP.md) · [LOE-DocuSeal Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)
**Where this is heading:** [Vision — Workflow Sequence Builder](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/VISION-workflow-sequence-builder.md) (the previewer as a visual, editable sequence hub)

---

## On this page

- [TL;DR](#tldr) — how it works in one breath
- [Trigger map](#trigger-map) — the send + sign-back diagram
- [DocuSeal events](#docuseal-events) — what comes back, what each fires
- [Components](#components) — email · signing · document · storage · payment · tracking (each links to its own doc)
- [Live vs pending](#live-vs-pending) — what's built vs to-build
- [Security flags](#security-flags) — cleanup items

---

## TL;DR

The dashboard builds an LOE document, hands it to **DocuSeal** for e-signature, and emails the client a signing link. When the client **signs**, DocuSeal calls one webhook back into the app — and that single callback fans out into everything that should happen next: the job is marked signed, the signed PDF is stored and mirrored to SharePoint, a QuickBooks invoice is created and sent, and ClickUp is stamped. **The "signed" event is the real trigger in this system — not the email.**

---

## Trigger map

Two halves: **SEND** (app → client) and **SIGN-BACK** (DocuSeal → app, where all the triggers fire).

```text
SEND  ──────────────────────────────────────────────────────────────────

  [Dashboard — "Create Document/Email"]
          │  pick an email template and/or a document
          ▼
  [LOEPreviewModal → generateLOE]
          │  builds the LOE HTML + DocuSeal anchor tags
          ▼
  [docuseal-proxy] ──creates submission──► [DocuSeal] ──returns──► signing link
          │                                                            │
          ▼                                                            │
  [send-loe-email-fixed] ──email carrying the link──► Client inbox ◄───┘
     (Graph → clientcare@valta.ca   ·  Resend sandbox today)
          │
          ▼
     Client clicks ──► /sign/{id}   (fallback: docuseal.com/s/{slug})


SIGN-BACK  ─────────────────────────────────────────────────────────────

  [Client signs in DocuSeal]
          │
          ▼
  [DocuSeal] ──webhook POST──► [docuseal-webhook]   (one entry point, two events)
                                      │
   ┌──────────────┬──────────────────┼───────────────────┬──────────────────┐
   ▼              ▼                  ▼                   ▼                  ▼
 job_           job_loe_          job_files          upload-loe-        qbo-create-customer
 submissions    details           INSERT             to-sharepoint      → qbo-create-invoice
 status =       signed_at +       'signed_           (mirror signed     → qbo-send-invoice
 'loe_signed'   signed PDF url    agreement'          PDF to billing)    (QuickBooks invoice)
                                                            │
   └────────────────────────────────────────────────────► ClickUp task
                                          "▸ LOE Signed: {time} by {signer}"
```

:::details{summary="Mermaid source (if your viewer renders it)"}

```mermaid
flowchart TD
  A["Dashboard — Create Document/Email"] --> B["LOEPreviewModal → generateLOE"]
  B --> P["docuseal-proxy"]
  P -->|create submission| D["DocuSeal"]
  D -->|signing link| E["send-loe-email-fixed<br/>Graph → clientcare@valta.ca"]
  E -->|email w/ link| C["Client inbox"]
  C -->|clicks /sign/{id}| S["Client signs"]
  S --> D
  D -->|webhook| W["docuseal-webhook"]
  W --> J1["job_submissions.status = loe_signed"]
  W --> J2["job_loe_details: signed_at + signed PDF"]
  W --> J3["job_files: insert signed_agreement"]
  W --> SP["upload-loe-to-sharepoint (mirror PDF)"]
  W --> QB["qbo: create customer → invoice → send"]
  W --> CU["ClickUp: LOE Signed timestamp"]
```

:::

---

## DocuSeal events

| DocuSeal event | Means | What the webhook triggers |
|---|---|---|
| `submission.created` | LOE **sent** (Stage 2.5) | Writes `loe_sent_at` on `job_loe_details` · stamps ClickUp task "▸ LOE Sent: {time}" |
| `submission.completed` | LOE **signed** (Stage 3) | The full fan-out: job status → `loe_signed` · signed PDF + `signed_at` · `job_files` `signed_agreement` row · mirror PDF to SharePoint · QuickBooks customer→invoice→send · ClickUp "▸ LOE Signed: {time} by {signer}" |

**How the webhook finds the right job:** by `docuseal_submission_id` on `job_loe_details` (production), falling back to `metadata.job_id` (test mode). If no job matches, it logs and returns 200 — it does **not** retry. (That HTTP-200-on-miss is a known soft spot — a missed match silently won't re-fire.)

---

## Components

The map above is the flow. Each piece below is summarized here and **links out to its full doc** — nothing is duplicated or moved.

### Email — carries the signing link
Email's only job is to **deliver the signing link to the client** — it does not trigger anything downstream. Built to send direct via **Microsoft Graph from `clientcare@valta.ca`**; currently still on the **Resend sandbox** until the sender is named. The template `trigger` setting (`manual` / `after_sign`) is **not yet wired** — every email is a manual send today.
→ [LOE Email Delivery Setup](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-EMAIL-DELIVERY-SETUP.md)

### Signing — DocuSeal (the spine)
DocuSeal hosts the document, captures the signature, and **calls the one webhook back** that fires every downstream trigger. The signing link is a custom `/sign/{id}` route (fallback `docuseal.com/s/{slug}`).
→ [LOE-DocuSeal Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md)

### Document & cascade versions — what's in the LOE
The LOE content is built from the job's field cascade (Value Scenarios, Approaches, Property Rights), and multiple **saved versions** can be shown to the client on a real job.
→ [Cascade Logic — Spec & Wiring](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CASCADE-LOGIC-SPEC-AND-WIRING.md)

### Storage — SharePoint (same Entra app as email)
The signed LOE PDF mirrors one-way into the job's SharePoint billing folder, and per-job folders are created via Microsoft Graph — **the same registered app that sends the email.**
→ [Asset Storage — SharePoint](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/ASSET-STORAGE-SHAREPOINT.md)

### Payment — QuickBooks (the closing half, sandbox-first)
**The model (important):** we never embed a payment link in our own email — QuickBooks only attaches its secure pay button when the invoice is sent through *its* own email. So our app's only job is to **trigger QuickBooks** (create invoice → send invoice, via the API); QuickBooks then emails the client the invoice carrying the pay button (the button shows because Chris has **QuickBooks Payments** enabled on his account). Built against the **QuickBooks sandbox** first (the real API on a fake company — no merchant account, no real money). The chain: `signed → our app triggers QuickBooks → QuickBooks emails the invoice + pay button → client pays → paid webhook → dashboard "Paid"`.

**Manual fallback — works WITHOUT the integration, build this first:** even before the auto-trigger is wired, the signed event should fire **two team signals by default**:
1. **ClickUp task status** → **"Signed — awaiting payment"** on Chris's team's board (plus the dashboard job flips to *client signed*).
2. **An internal heads-up email to Chris's team** — sent to the inbox his assistant manages (the **clientcare@valta.ca** account) — e.g. *"Heads up: John Smith just signed — awaiting payment invoice. Please send/check it in QuickBooks (it may already have gone out)."* with **a link to the dashboard job and a link to the ClickUp task** so they can act in one click.

This human task-and-email path is worth building now so the step always happens — wired or not. The QuickBooks auto-trigger is the upgrade on top (it turns "go send it" into "already sent"); the notify-the-team default is good service and a clean record for their team either way. (No Zapier/Make needed — our DocuSeal webhook is the trigger; the QuickBooks call + the notify email just get added to it.)
- → [Closing & Payment Feature Sheet](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/00-CLOSING-PAYMENT-FEATURE.md) — the front door (Sign → Thank-You → Pay → Paid).
- → [QuickBooks Sandbox Payment Path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md) — **how the sandbox is set up** + the two-trigger sequence.
- → [Sandbox Build Spec](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-BUILD-SPEC-2026-06-11.md) · [Integration Research](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-PAYMENT-INTEGRATION-RESEARCH.md) · [Merchant How-To](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-MERCHANT-APPLICATION-HOWTO.md) · [Activation Runbook](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/GRAPH-QBO-ACTIVATION-RUNBOOK.md)

### Job tracking — ClickUp
Each milestone stamps the ClickUp task: **LOE Sent** (on create), **LOE Signed → awaiting payment** (on completed — the cue for Chris's team to send/check the QuickBooks invoice, by hand now or automatically later), and **Paid** (on the QuickBooks paid signal). This signed → "awaiting payment" task is the manual-fallback path above — it should ship whether or not the QuickBooks auto-trigger is wired.
→ [ClickUp Sync — Canonical](~/Development/APR-Dashboard-v3/docs/Features/04-Job%20%26%20Client%20Mgt./CLICKUP-SYNC-CANONICAL.md)

## Live vs pending

| Piece | State |
|---|---|
| DocuSeal send + signing link | 🟢 Live |
| `submission.created` → loe_sent_at + ClickUp "Sent" | 🟢 Live |
| `submission.completed` → status + signed PDF + job_files + ClickUp "Signed" | 🟢 Live |
| Mirror signed PDF → SharePoint | 🟢 Now unblocked (Entra app configured); was 503-skipping before |
| QuickBooks invoice (customer → invoice → send) | 🟡 Wired in the webhook — confirm live end-to-end |
| Email via Graph from clientcare@valta.ca | 🟡 Built, waiting on sender config (see email doc) |
| `after_sign` email auto-trigger | 🔴 Column exists, not wired |
| Retire Resend + bc@crowestudio.com sender | 🟡 After Graph send is verified live |
| Email signature on outbound | 🟡 Verify — Graph API sends do NOT inherit the mailbox's Outlook signature; put it in the email template OR an org-wide Exchange disclaimer rule |
| Sender-identity picker (choose the "from") | 🔵 Optional future — easy to offer a pick among **valta.ca** mailboxes (widen the access policy + a dropdown); sending as an external identity (e.g. a personal/crowestudio address) is NOT a simple toggle and reads as spoofing |

## Security flags

- **Hard-coded ClickUp token** in [docuseal-webhook/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/docuseal-webhook/index.ts) — move to a secret.
- **Hard-coded Resend key** in [send-loe-email-fixed/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts) — move to a secret (moot once Resend is retired).

---

**Last reviewed:** 2026-06-18 by qa-agent — built the trigger map from the verified webhook chain (`docuseal-webhook` created/completed handlers); email folded in as one node.
