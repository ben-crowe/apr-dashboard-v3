---
title: "Where to Edit — LOE eSign + Email quick reference"
status: living — add rows as we find more editable surfaces
created: 2026-06-18
owner: Ben + qa-agent
description: "The one-stop map: every editable part of the LOE send → sign → email flow (the thank-you screen, the sender name, the DocuSeal submission name, the signing page, etc.) and exactly where it lives. Search this before hunting through code."
tags: [apr-workflow, loe, esign, email, where-to-edit, quick-reference, signing-page, docuseal, sender, thank-you]
cognee_ingest: skip
gemini_ingest: skip
gemini_store: ""
---

# Where to Edit — LOE eSign + Email

**Tags:** #apr-workflow #loe #esign #email #where-to-edit #quick-reference
**Backlink:** [LOE Flow Architecture](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/eSign-Workflow/LOE-FLOW-ARCHITECTURE.md)

> Search this doc when you want to change *what something says or looks like* in the LOE flow. Each row = the editable thing + the one spot to change it. Line numbers drift, so it points at the file + the marker to look for.

---

## The editable surfaces

| What you want to change | Where it lives | Notes |
|---|---|---|
| **Thank-you screen** (after signing — "Thank You! …") | [SigningPage.tsx](~/Development/APR-Dashboard-v3/src/pages/SigningPage.tsx) — the `if (signed)` block | The post-sign screen. Also where it promises "you'll receive a copy via email." Redesign target. |
| **Signing page top header bar** ("VALTA Property Valuations") | [SigningPage.tsx](~/Development/APR-Dashboard-v3/src/pages/SigningPage.tsx) — the `<header>` | Our page's header (not DocuSeal). Redundant with the document letterhead — safe to slim/remove. |
| **Signing page heading** ("Please review and sign your Letter of Engagement below") | [SigningPage.tsx](~/Development/APR-Dashboard-v3/src/pages/SigningPage.tsx) — above the `DocusealForm` | Plain text; reword freely. |
| **DocuSeal submission name** (shows as "LOE-VAL261065") | [generateLOE.ts](~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts) — `name: \`LOE-${job.jobNumber}\`` | One line. Change to include the property name / drop the "LOE-" prefix here. |
| **Signing link URL** (`/sign/{id}`) | [generateLOE.ts](~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts) | The link the email carries. |
| **Email sender NAME** ("Valta Appraisals") | Secret `GRAPH_SEND_NAME` (default in [send-loe-email-fixed](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts)) | Change the secret — **no code deploy**. |
| **Email sender ADDRESS** (clientcare@valta.ca) | Secret `GRAPH_SEND_MAILBOX` | Change the secret — no code deploy. Must be a real M365 mailbox. |
| **Email subject + body** ("Letter of Engagement - Ready for Signature" + the HTML) | [send-loe-email-fixed](~/Development/APR-Dashboard-v3/supabase/functions/send-loe-email-fixed/index.ts) (subject/template) + [emailTemplate.ts](~/Development/APR-Dashboard-v3/src/utils/loe/emailTemplate.ts) | The client email copy + the signing-link button. |
| **Recipient default / override** ("Send to" field) | [LOEPreviewModal.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/actions/LOEPreviewModal.tsx) — `recipientEmail` | Defaults to the client; editable per-send. No test-mode redirect anymore. |
| **Job Status labels** (Submitted → Sent — Awaiting Signature → Signed by Client …) | [LoeQuoteSection.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/LoeQuoteSection.tsx) — the Job Status field's label map | Plain-language labels for the workflow status. |
| **ClickUp updates on sign** (status line / tags) | [docuseal-webhook/index.ts](~/Development/APR-Dashboard-v3/supabase/functions/docuseal-webhook/index.ts) | What the signed/sent events write to the ClickUp task. (Tag-swap wiring lands here.) |
| **The LOE document content** (the letterhead, the sections, the body you like) | [generateLOE.ts](~/Development/APR-Dashboard-v3/src/utils/loe/generateLOE.ts) + the V07 LOE template | The generated document itself. |
| **DocuSeal frame branding** (the centered logo by the submission name) | **DocuSeal account settings** (not our code) | The logo/branding on DocuSeal's own document frame — adjust in the DocuSeal dashboard. |

---

## Secrets vs code (so you know which needs a deploy)

- **Secrets (instant, no deploy):** sender name, sender address — change in Supabase Edge Function secrets.
- **Edge functions (need `supabase functions deploy <name>`):** the email subject/body, the ClickUp webhook behavior.
- **Frontend (need a Vercel deploy):** the signing page (header/heading/thank-you), the submission name, the recipient UI, the Job Status labels.
- **DocuSeal dashboard (no code):** the document-frame logo/branding.

---

**Last reviewed:** 2026-06-18 by qa-agent — built from the live dial-in; add rows as more editable surfaces surface.
