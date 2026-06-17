---
id: spec-notes-email-editor-phase2
title: "Spec Notes — Email editor Phase 2 (preview-first · versions dropdown · save to job as draft/sent)"
status: notes-for-spec (not yet gated)
created: 2026-06-16
type: spec-notes
owner: co-architect (notes) · ui-designer (current editor build) · Ben (direction)
source_review: ui-designer dev-3 live build + SS12 (both phases) on the email editor + job-draft topic
entry_files:
  - ~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/actions/EmailComposeModal.tsx
  - ~/Development/APR-Dashboard-v3/src/utils/loe/emailTemplate.ts
  - ~/Development/APR-Dashboard-v3/src/utils/loe/jobContracts.ts
  - ~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/actions/LOEPreviewModal.tsx
tags: [loe, email, editor, versions, job-draft, phase2, spec-notes]
---

# Spec Notes — Email editor Phase 2

> These are **grounded notes** to seed a real spec — NOT a gated build spec yet. Captured from
> reviewing the ui-designer's live email-editor build + a full SS12 search. Ben's intent: make the
> email editor work like the **document editor** — preview first, version dropdown, save versions to
> the job as drafts/sent that show up in the job area.

---

## 1. What the email editor IS today (`EmailComposeModal.tsx`, 352 lines)

The "② Email" step in the send stepper (① Review document → ② Email → ③ Sent). Opens AFTER document
review, BEFORE the actual DocuSeal send — you never compose one cold.

- **ALWAYS opens in a 2-pane split** (`grid-cols-2`): left = editor, right = live preview. *(This is
  the thing Ben wants changed — see 3A.)*
- **One managed default**, no versions. Seeds from a single `email_templates` default row (subject +
  body). Edit-time merge tokens (`{{first_name}}` `{{last_name}}` `{{job_number}}`
  `{{property_address}}`) resolve now from job data; `{{signing_link}}` stays a placeholder until send.
- **Editing is an instance edit** — local state, applies to THIS send only; never changes the default.
  "Set as Default" / "Reset default to original" are the only paths that touch the default.
- **Left pane** = rendered WYSIWYG (contentEditable iframe) with a `</> HTML source` toggle to raw HTML.
- **No version concept, no save-to-job, no draft/sent history.** On Send it fires `onSend({subject,
  bodyHtml})` and the email is gone — not persisted against the job, not visible afterward.

## 2. ⭐ What ALREADY EXISTS to build on (the big find from the deep search)

The **data layer for email drafts/sent is already written** — built deliberately to MIRROR the
document model (`job_contracts`), just **never wired to the UI**:

- **`job_email_instances`** (in `emailTemplate.ts`) — job-scoped per-send instance, `state: 'draft' |
  'sent'`, carries `subject` / `body_html` / `recipient_email` / `contract_id` / `docuseal_submission_id`.
- **`loadJobEmailInstances(jobId)`** + **`saveJobEmailInstance(input)`** — load-all-newest-first +
  insert-or-update-in-place. **1:1 the same shape as `loadJobContracts` / `saveJobContract`.**
- The document side this mirrors: `jobContracts.ts` — `ContractState = 'draft' | 'saved' | 'sent'`,
  `saveJobContract` (no id = INSERT new draft, id = update), `markContractSent`, `deleteJobContract`.
  Documents already list on the job as draft/sent pills and reopen to their saved HTML.

> **So the persistence pattern Ben wants for emails is already designed and coded — it just isn't
> called anywhere or surfaced in the job area.** Verify the `job_email_instances` TABLE actually exists
> in Supabase (the functions exist; the migration may or may not have run) before building on it.

## 3. Ben's three asks (this session) — what to spec

### A. Preview-first, then edit → split (mirror the document editor)
Today the email opens straight into the 2-pane split. Ben wants it to **open in preview mode** (read
the email as it'll look), and **only move to split mode when you choose to edit** — exact same concept
as the document editor's preview → "Edit Document" → split. *Ben flagged this as its own phase.*

### B. Email-type / version dropdown at the top
A dropdown at the top of the editor showing the **versions of emails that can be sent** — same concept
as the document editor's template/version dropdown. Pick a version → the editor loads that email. You
can **change an email and save it as a different version.** (Today there's exactly one default and no
way to pick among saved variants.)

### C. Save versions to the job as draft / sent → visible in the job area
Saving an email writes it against the **client / job ticket** as an **"email draft"** or **"email
sent"** — same concept as saving a document draft. It then becomes **visible in the job area** just
like the saved documents/contracts are. This is the `job_email_instances` draft/sent model from
Section 2, surfaced as a list on the job (mirror the contract pills).

## 4. Open questions to resolve before this is a buildable spec (DON'T assume)

- **Versions vs default:** are "email versions" (3B) the same objects as saved per-send instances
  (3C), or a separate library of reusable named email types (like document templates)? The document
  editor has BOTH a template/version dropdown AND saved job drafts — clarify which Ben means for email,
  or whether it's both (a managed set of email *types* + per-job saved drafts).
- **Does `job_email_instances` table exist** in Supabase today, or only the TS functions? (migration check)
- **Draft vs sent lifecycle:** a "sent" email is immutable (view what went out); a "draft" reopens to
  edit. Confirm same rules as contracts. Can you have multiple email drafts per job like multiple
  contract drafts?
- **Delete:** mirror the document hover-X delete-draft (drafts only, sent locked)?
- **Where in the job area** do email drafts/sent list — alongside the contract pills in
  `LoeQuoteSection`, or their own section?
- **Relationship to the send stepper:** does preview-first (3A) change the ② Email step flow, and does
  a saved draft let you resume a send later?

## 5. Files this will touch (preliminary)

- `EmailComposeModal.tsx` — preview-first mode + the versions dropdown + save-as-draft/version controls.
- `emailTemplate.ts` — already has the instance load/save; may need a "named version" concept for 3B.
- `LoeQuoteSection.tsx` (or wherever contract pills live) — surface the email draft/sent list on the job.
- A migration if `job_email_instances` isn't live yet.
- Possibly `LOEPreviewModal.tsx` — the stepper host.

---

*co-architect notes, 2026-06-16. Grounded in the live editor + SS12 (both phases — Phase 2 surfaced the
unwired `job_email_instances` draft/sent layer). Next: resolve Section 4 with Ben → promote to a gated
build spec → QA gate → build.*
