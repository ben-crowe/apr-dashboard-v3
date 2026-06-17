---
id: spec-email-as-first-class
title: "Spec — Email as a first-class sibling of documents (two-dropdown compose, opt-in preview, doc↔email pairing)"
status: draft-for-review (not yet gated)
created: 2026-06-17
type: spec
owner: ui-designer (build) · Ben (direction)
supersedes_notes: docs/Features/12-LOE-Esign/SPEC-NOTES-email-editor-phase2.md (folds in + extends)
entry_files:
  - src/components/dashboard/job-details/actions/EmailComposeModal.tsx
  - src/components/dashboard/job-details/actions/LOEPreviewModal.tsx
  - src/components/dashboard/job-details/LoeQuoteSection.tsx
  - src/utils/loe/emailTemplate.ts
tags: [loe, email, templates, first-class-email, opt-in-preview, doc-email-pairing, spec]
---

# Spec — Email as a first-class sibling of documents

> Promote email from a forced step buried at the bottom of the document send flow to a
> first-class action with its own template library, an optional preview, a direct send, and an
> optional default pairing to a document template. Mostly a UI build — the data layer already
> supports multiple email templates, document-less emails, and email draft/sent on the job.

---

## 1. Goal (what changes for the user)

Today email is a forced sub-step: open a document → scroll to the bottom → "Continue to Email" →
a split-pane email editor opens whether or not you want it. There is one managed default email and
no way to send an email without a document.

After this build:

- The compose surface has **two template dropdowns at the top**: **Document Templates** (renamed
  from the current "Template:") and a new **Email Templates**.
- From the document viewer, a **Send by Email** control is an inline row: `[Email template ▼] [👁] [Send]`.
  Pick a template (often pre-picked — see pairing) and press **Send**. No forced preview.
- The **👁 (eyeball) is the only door to the email previewer**. Open it to read / edit / save the
  email; skip it to send directly.
- **Email Templates is a library** of named types (the current LOE e-sign email is type one;
  "monthly check-in", "thank-you", "follow-up" are future types). Editing the default or saving a
  new version from the previewer adds it to the dropdown — same behaviour document templates already have.
- You can **send an email with no document at all** from the job area (same inline control).
- Saving an email writes it to the job as an **email draft / sent**, alongside document drafts.
- An email template can be **paired to a document template as its default**. Opening that document
  to send **pre-selects** the paired email — often nothing to choose. The dropdown still allows override.

The entry-button rename ("Create Contract" → something more general like "Create / Send") is
explicitly **out of scope** here — a trivial later tweak.

## 2. What already exists (build on, don't rebuild)

- **`email_templates`** table (`name`, `subject`, `body_html`, `is_default`, timestamps). A unique
  index enforces *at most one* default — but the table already supports MANY rows. Today the TS
  layer (`emailTemplate.ts`) only ever reads/writes the single default.
- **`job_email_instances`** table + `loadJobEmailInstances` / `saveJobEmailInstance` — job-scoped
  draft/sent, `contract_id` is **nullable** (so a document-less email is already representable).
  Written but never wired to the UI.
- **`EmailComposeModal.tsx`** — the WYSIWYG email editor + `</> HTML source` toggle + live preview.
  Reused as the opt-in previewer.
- Document-template model to mirror: `loe_templates` (`name`, `template_html`, `is_default`,
  `version`, `is_active`) + `saveTemplate.ts` / `loadAllTemplates` / `setDefaultTemplate`.

## 3. Data model changes

Small, additive — no destructive migration.

1. **Email-template library functions** in `emailTemplate.ts` (mirror `saveTemplate.ts`):
   - `loadAllEmailTemplates()` — all rows, default first.
   - `saveEmailTemplate({ id?, name, subject, body_html, setAsDefault })` — insert new named version
     or update in place; clears prior default when `setAsDefault`.
   - `setDefaultEmailTemplate(id)`.
   - Keep `loadDefaultEmailTemplate` / `resetDefaultEmailTemplateToSeed` as-is.
2. **Document↔email pairing** — add nullable column `paired_template_id UUID` to `email_templates`
   (references a `loe_templates.id`). Resolver: `resolveEmailTemplateForDocument(docTemplateId)` →
   the email template whose `paired_template_id` matches, else the global default email.
3. **Type metadata (future-proofing for §8 template types)** — two small additive columns on
   `email_templates`, both with safe defaults so existing rows are unaffected:
   - `channel TEXT NOT NULL DEFAULT 'email'` — `'email'` | `'popup'` (the in-app post-action message
     is edited/previewed in the same library but rendered as a pop-up, not sent).
   - `trigger TEXT NOT NULL DEFAULT 'manual'` — `'manual'` (user presses Send) | `'after_sign'`
     (queued/shown automatically once a document is signed).
   This build only needs them to EXIST + be editable; the automation that fires `after_sign` /
   renders `popup` is a later build (§8).
4. No change to `job_email_instances` shape — wire the existing load/save. Document-less email saves
   with `contract_id = null`.

## 4. UI surfaces

### 4A. Two-dropdown compose header
The header that today shows one "Template:" picker (`LOEPreviewModal`) gains a second picker.
"Document Templates" drives the document preview/edit/send exactly as now. "Email Templates" drives
the email side. Both read their full libraries.

### 4B. Inline "Send by Email" control (the default, no-preview path)
A compact row living in the document-viewer footer (replacing the current "Continue to Email"
button) AND as the document-less entry from the job area:

```
Send by Email:  [ Email template ▼ ]   [ 👁 Preview ]   [ Send ]
```

- The dropdown pre-selects the paired email for the open document (4A pairing); document-less
  defaults to the global default email.
- **Send** fires the existing send path (merge tokens resolved; `{{signing_link}}` only when the
  email type carries one) and writes a `job_email_instances` row as `sent`.
- **👁 Preview** opens the previewer (4C). It is the only way into the previewer.

### 4C. Email previewer / editor (opt-in)
The enhanced `EmailComposeModal`:
- Opens in **read-first preview** (full-width rendered email), with an **Edit** button that reveals
  the split editor (mirrors the document preview→edit pattern, including a "Back to Preview" exit).
- Carries the **Email Templates dropdown** at the top.
- Actions: **Save as draft** (to the job), **Save as version** (new named library template / set
  default / set pairing), **Send**.
- Existing merge-token palette + `Set as Default` / `Reset default` retained.

### 4D. Save-to-job surfacing
Email drafts/sent list on the job alongside the contract pills (`LoeQuoteSection`), reusing the
draft/sent pill pattern — newest-first, draft above sent, drafts deletable, sent read-only.

## 5. Flows

- **Fast path (dominant):** open LOE in document viewer → glance → `Send by Email` row already shows
  the paired LOE email → press **Send**. Zero email-preview friction.
- **Review path:** same, but click **👁** → previewer opens → read / edit / save draft → Send.
- **Document-less:** job area → email entry → pick template (or default) → Send, or 👁 to edit first.
- **Authoring a new email type:** previewer → edit → **Save as version** (name it, optionally set as
  default, optionally pair to a document template) → it appears in the Email Templates dropdown.

## 6. Out of scope (don't bundle)

- Renaming the "Create Contract" entry button (trivial later tweak).
- Multi-recipient / CC / attachments.
- Scheduling / automated sends (e.g. an actual recurring monthly check-in) — the *template* can
  exist; automation does not.
- Rich template categ/type taxonomy beyond name + optional pairing.

## 7. Open questions (resolve in review)

- **Pairing cardinality:** one email default per document template (1:1)? Assume yes — `paired_template_id`
  on the email row, one email points at one doc template; a doc template resolves to the first email
  that pairs to it.
- **Send-with-link types:** does a non-LOE email type (thank-you) ever need `{{signing_link}}`?
  Assume no — link only resolves when a document/submission is in play; document-less send omits it.
- **Where exactly** the document-less email entry sits in the job area — ✅ **RESOLVED (Ben, 2026-06-17):
  beside "Create Contract", as a standalone control. Document-less email is NON-NEGOTIABLE and ships in
  the SAME wave as the document path — not deferred.**

## ⛔ ARCHITECTURE LOCK (Ben, 2026-06-17) — email is NEVER reached only through a document

> The build deviated: today the only door to email is opening a document and walking its send flow as if
> sending the document. **That is incorrect** — it works, but it's the wrong architecture. Email is a
> first-class SIBLING of documents, not a sub-step inside one. Two doors, and the standalone door is mandatory:
>
> 1. **Standalone "Send by Email" — beside the "Create Contract" button** (`SendByEmailControl docTemplateId={null}`):
>    `[ Email template ▼ ] [ 👁 ] [ Send ]`. Pick → Send. **No document opened, nothing pretending to be a
>    document send.** This is how you send an email on its own. It is REQUIRED, not optional, and must be
>    visible at the job level without entering any document.
> 2. **Inside the document editor — email as a PEER dropdown** beside the Document Templates dropdown (the
>    two-dropdown header), NOT a forced final step after the document.
>
> **Fail condition:** if the only way to reach the email template/compose area is by going through a document
> send, the wave is WRONG regardless of whether it renders. This is a design-architecture acceptance criterion
> (placement), not a visual-integrity one — it renders fine and is still incorrect.

## 8. Planned template types (next builds — NOT this one)

This infra build ships the library + pairing + type metadata + the **LOE e-sign email** (type one,
`channel:email`, `trigger:manual`). These types follow, slotting into the same library with no
re-architecture:

1. **Payment-request email** — `channel:email`, `trigger:after_sign`. Carries the QuickBooks
   payment link. High priority ("ASAP" per Ben). The actual after-sign automation + QuickBooks
   invoice generation is its own build; the email being a stronger fit than a pop-up here precisely
   *because* invoice creation may need time after signing.
2. **Post-sign pop-up message** — `channel:popup`, `trigger:after_sign`. An in-app window shown
   after the client signs (e.g. an immediate "pay now" CTA). Not an email, but authored/previewed in
   the same template area so there's one place to edit and see it. Whether the pop-up ships at all is
   undecided — but the requirement is to be ABLE to author/preview it. The pop-up and the
   payment-request email are complementary, not mutually exclusive (pop-up = seamless now, email =
   reliable once the invoice exists).

> Implication for THIS build: the data model (`channel`, `trigger`, pairing) and the template
> library/previewer must not assume "email sent via Resend" is the only outcome — a template can be
> a pop-up, and a template can be triggered by an event rather than a button. We only build the
> authoring/preview + the manual LOE email now; the firing of `after_sign` and the `popup` renderer
> are later.

## 9. North Star — the visual sequence map (NOT built now, but don't preclude)

The end vision Ben sees: a **visual automation/sequence map** per job — like an email-campaign
builder. A signature is a **trigger**; from it a timeline flows downward:

```
[ LOE email — sent ]
        │
   (on signing)  ◀── click → see the signing page
        │
   (+2 hours)
        │
[ Thank-you email ]
        │
[ Payment-request email — QuickBooks link ]
        │
[ Appraisal report delivered ]
```

Plus: every email to that client *about that job* accrues onto the same map over time, each node
clickable to see what was sent. This is a separate, much larger build (a sequence/automation engine
+ a canvas UI). We are **not** building it now.

**What THIS build does to keep that door open (all already in scope — costs nothing extra):**

- **Every send is logged as a job-scoped instance** (`job_email_instances`, `contract_id` optional).
  That log IS the timeline the future map renders — so log faithfully now, even for the simple cases.
- **`trigger` + `channel` are first-class template metadata** — those are precisely the node *types*
  (manual vs event-fired; email vs pop-up vs, later, report-delivery) the map would lay out.
- **Pairing (doc↔template)** is the first primitive *edge* (document → its default email).
- **Don't bake in "email = step two of a document."** Treat each communication as an independent
  event tied to a job (+ optional document/trigger), not as a sub-step that only exists inside a
  document send. The first-class compose surface (§4) already does this.

> No new work for the north star in this build — just the discipline of logging every comm against
> the job and keeping comms independent of the document flow. The map becomes a future build that
> reads what this one already records.

---

*ui-designer draft, 2026-06-17. Grounded in the live LOE/email code + SS12. Folds in and extends
SPEC-NOTES-email-editor-phase2.md. Next: Ben review → gate → implementation plan.*
