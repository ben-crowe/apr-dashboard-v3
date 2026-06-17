---
id: spec-chunk1-instance-roundtrip
title: "Design Spec — Chunk 1: Instance round-trip + naming + drafts"
status: ready-for-build
created: 2026-06-13
type: design-spec
owner: ui-designer (spec) · react-spec (build) · qa-agent (verify)
parent_prd: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-01.md
ground_truth: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/CONTRACT-EDITOR-ARCHITECTURE.md
tags: [apr-workflow, loe, econtract, multi-document, drafts, design-spec]
---

**Tags:** #apr-workflow #loe #econtract #multi-document #drafts #design-spec
**Entities:** [[eContract Editor]] [[job_contracts]]

# Design Spec — Chunk 1: Instance round-trip + naming + drafts

> Build from this. UX placement + states + round-trip behavior — not code. Scope is exactly
> PRD Chunk 1: Save-as-Draft, document naming, reopen-rehydrate-the-same-instance-by-id, and
> draft-vs-sent in the per-client collection. Send-state *marking on send* and the email-body
> editor are **Chunk 2 — out of scope here** (noted where the seam is).

## The one mental model

A document instance has a lifecycle: **draft → (edit/resave as same draft)* → sent**. The screen
must make "this is unfinished, continue it" and "this already went out, view only" two visibly
different things, and resaving must never spawn a second row.

## Current ground truth (what's already there)

- **Naming UI exists, mislabeled.** `TemplateEditorModal` has a save dialog with a name field —
  but labeled **"Template Name"** with a **"Save Template"** button. `onSave(name, html, setAsDefault)`.
- **The handler hardcodes `state:'saved'`** (`LOEPreviewModal.tsx:506`) and threads **no `id`**, so
  every save inserts a new row.
- **`saveJobContract` already supports `id`** (present = update in place, absent = insert) — the
  round-trip plumbing exists; the UI just never passes `id`.
- **Collection exists** (`LoeQuoteSection.tsx:1304`): rows show name + state badge + **Open**. Open
  today does `setPreviewHTML(edited_html); setShowPreview(true)` → **read-only preview, no edit, no id.**
- DB `job_contracts.state` already supports `draft | saved | sent`.

## (a) Save-as-Draft, distinct from Send

Two actions on **two different surfaces** — keep them physically separate so they never read as one:

- **Save Draft** lives in the **editor** (`TemplateEditorModal` save dialog). Relabel the dialog from
  "Save Template" → **"Save Document"**; primary button **"Save Draft."** Writes `state:'draft'`.
  This is the safe, no-send commit. After save: toast-silent (Ben), close dialog, collection refreshes,
  editor stays open so they can keep working.
- **Send** stays where it is — the `LOEPreviewModal` footer **"Send to Client."** Unchanged in Chunk 1
  except: it must carry the **current instance `id`** so the eventual sent-marking (Chunk 2) updates
  the same row instead of forking one. (Actual `state:'sent'` flip = Chunk 2.)

Net: drafting = editor button; sending = preview footer button. A user never sees "save" and "send"
as the same control.

## (b) The document-NAME field — where + when

- **Where:** the existing name field in the **Save Document dialog** (relabel "Template Name" →
  **"Document Name"**). No new surface needed.
- **When:** named at **first Save Draft**. Pre-fill a sensible default so the field is never blank:
  **`{TemplateType} — {ClientLastName or FirstName} — {Mon D}`** (e.g. *"LOE-07 — Henderson — Jun 13"*).
  User can overwrite. The default already half-exists in `LOEPreviewModal.tsx:501`'s fallback — move it
  into the dialog as the pre-filled value, not just a save-time fallback.
- **Persistence:** the name is stored on the instance and **shown pre-filled on every reopen** — editing
  it updates the same row (it's just another edit). Name is required only in the sense that the default
  guarantees one; don't block save on an empty field — fall back to the default.
- The collection row already renders `c.name`; nothing to change there for naming.

## (c) Reopen-rehydrate the SAME instance (no duplicate row)

The editor/preview flow needs to hold a **current instance id** in state. Two entry points set it:

- **Create Contract** (the action button) → **new** instance: id is **absent** → save **inserts**. (Existing.)
- **Open from the collection** → **existing** instance: load `id`, `name`, `edited_html` into the
  flow → save **updates in place** (pass `id` to `saveJobContract`). No duplicate.

**Branch Open by state** (this is the core behavior change):

- **Open a `draft`** → open the **editor** (`TemplateEditorModal`), rehydrated with `edited_html`,
  carrying `id` + `name`. They continue editing; Save Draft updates the same row. Button label: **"Continue."**
- **Open a `sent`** → open the **read-only preview** (current `showPreview` path). No editor, no resave.
  Button label: **"View."** (Truthful-sent guardrail: a sent doc cannot be silently re-edited into a new send.)

Acceptance for this piece (QA runs it on a real client, not a screenshot):
**Create Contract → name → Save Draft → it appears as a draft → Continue → edit → Save Draft again →
still ONE row, updated.**

## (d) Draft vs sent in the per-client collection

Keep the existing single list (`LoeQuoteSection.tsx:1304`), refine the row:

- **Badge** (already there): `draft` = blue, `sent` = green. Keep. (A `saved` row from old data → treat
  as draft for action purposes: editable, "Continue.")
- **Action label varies by state:** draft → **"Continue"** (opens editor); sent → **"View"** (opens
  read-only preview). This is the visible draft-vs-sent tell besides the badge.
- **Order:** drafts (actionable/unfinished) sort **above** sent (archive). Within a group, newest first
  (the query already orders by `updated_at desc`).
- **Empty state unchanged** (list hidden when none).
- Out of scope here, flag for Chunk 2: the *Create Contract button itself* shouldn't imply "send fresh"
  when a sent doc exists — that button-level affordance is Chunk 2's sent-truthfulness work, not this row spec.

## What NOT to touch (guardrails)

- Don't touch the marker parser / grouped render / numbering — that's done and approved.
- Editing an instance **never** writes to `loe_templates`. Save goes to `job_contracts` only.
- Don't add `state:'sent'` flipping or the email-body editor — Chunk 2.
- No duplicate-on-resave — the whole point; verify the id round-trip.

## Files react-spec will touch (entry points, for orientation)

- `src/components/dashboard/job-details/actions/TemplateEditorModal.tsx` — relabel dialog, "Save Draft",
  pre-filled Document Name default.
- `src/components/dashboard/job-details/actions/LOEPreviewModal.tsx` — `state:'draft'` on draft save;
  thread current-instance `id`; default-name into the dialog.
- `src/components/dashboard/job-details/LoeQuoteSection.tsx` — Open branches by state (Continue→editor /
  View→preview); carry `id` into the editor; draft-above-sent ordering.
- `src/utils/loe/jobContracts.ts` — no change (upsert-by-id already supports it).

---
*ui-designer · Chunk 1 of PRD-multi-document-creator · ready for react-spec build + qa verify*
