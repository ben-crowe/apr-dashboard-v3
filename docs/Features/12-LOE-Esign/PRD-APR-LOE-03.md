---
title: "PRD-APR-LOE-03 — Email as a First-Class Object (template management + send, paired to documents)"
id: PRD-APR-LOE-03
type: PRD
status: LOCKED-2026-06-17
series: LOE-Esign (follows PRD-APR-LOE-01 Multi-Document Creator, PRD-APR-LOE-02 LOE Series Part 2)
authored: co-architect (via /write-prd) + Ben (define + lock)
spec_source: SPEC-email-as-first-class-2026-06-17.md + PLAN-email-as-first-class-2026-06-17.md (dev-7)
spec_gate: PASS-WITH-FIXES (qa-agent, /review-gate spec-mode) — the 5 fixes are folded into the Key Results + Guardrails below
tags: [apr, loe-esign, email, template-management, prd, first-class-object, docuseal, valcre]
gemini_store: workflows
---

# PRD-APR-LOE-03 — Email as a First-Class Object

> **North star.** Email stops being a bolted-on "Continue to Email" step and becomes a managed object — created, edited, paired to a document template, and sent — the same way documents already are. The proof is the editable-email pilot extended to the full lifecycle.

> **LOCKED 2026-06-17.** Implementation plan + per-task detail stay living in the spec/plan; this north star is frozen. Build runs through /workflow-orc-2agt: spec-gate (done, PASS-WITH-FIXES) → Assembly Prompt → prompt-gate → forked builders (wave order) → build-verify → fold → close.

---

## ⭐ Key Results (each with how it's proven)

1. **Email templates are managed like documents** — create / edit / list / pair an email template to a document template, in the UI.
   *Proven:* do each in the running app; the DB row (`email_templates`) confirms create/edit; the pairing persists.

2. **Send happens from the inline control** (replacing "Continue to Email"), and the LOE path still triggers DocuSeal e-sign with a working signing link.
   *Proven:* send an LOE via the inline control on a test job; signing link resolves + DocuSeal e-sign fires (no regression vs the old button).
   *Proven (the FIRST-CLASS headline — qa spec-gate catch):* send an email from the job with **NO document attached** → a `sent` instance with `contract_id = null` is written + the email arrives. This is the path that proves email is no longer a sub-step of a document.

3. **A send is logged only when it actually sends.**
   *Proven:* force a Resend failure → toast shown, NO `sent` instance written, the item stays unsent; succeed → exactly one `sent` instance row.

4. **Pairing is deterministic** — one email ↔ one document template, or a defined tie-break if more than one pairs.
   *Proven:* pair two emails to one doc → resolution is predictable (enforced uniqueness or the named tie-break), never a silent first-match.

5. **No accidental live client email** — sends are hard-guarded to the test recipient with a confirm/undo in non-prod.
   *Proven:* attempt a send → recipient is forced to the test address + a confirm step appears; a misclick cannot fire a real client email.

---

## Invariants (INV) — author-side rules the gate enforces verbatim (2026-06-17)

> The architecture is written as TESTABLE invariants, not prose — so QA's `/review-gate` runs the PROVED-BY directly. INV-0 = the thesis (sequenced FIRST in the build). The "email buried under a document" bug happened because this was prose with no gate hook; the INV closes that.

**INV-0 (THESIS — placement is part of the proof; Ben-confirmed via full explain-back, LOCKED FINAL 2026-06-17) — Email MUST be sendable without a document, via an Email dropdown SIDE-BY-SIDE with the Document dropdown IN THE PREVIEWER.** The dashboard button **"Create Document/Email"** opens the Previewer; two peer dropdowns render side by side. DOCUMENT path → document workflow → the **bottom document-Send button** sends WITH the document connected (signing link) — that button STAYS. EMAIL path → the email previewer standalone, nothing connected (`contract_id=null`). **One reusable email component both ways** (SendByEmailControl, `docTemplateId: string|null`): under a document → `docTemplateId=the-doc` (connected, signing link); from the Email dropdown → `docTemplateId=null` (standalone). Same screen/template-edit both ways; only the document-connection differs.
  - FAIL-WHEN: the email entry is a loose element on the dashboard/job page, OR not beside the Document dropdown in the Previewer, OR the bottom document-Send button was removed.
  - PROVED-BY: the dashboard button reads "Create Document/Email" → opens the Previewer → Document + Email dropdowns render SIDE BY SIDE; pick Email + Send → `job_email_instances` row with `contract_id=null`, no document opened; the bottom document-Send button is still present + the live LOE document send works (document path, `docTemplateId=the-doc`, signing link); the loose D1 dashboard email widget is GONE.
  - *Drift history (why placement is in the PROVED-BY): viewer-header (right) → entry-button (drift 2, co-arch mis-moved) → dashboard/job-page (drift 3, D1) → locked back to the Previewer. D1's dashboard widget REMOVED; built correctly in D2.*

**INV-1 — A misclick MUST NOT send a live client email** (test-recipient fail-safe).
  - FAIL-WHEN: a send can reach a real client address in non-prod / on ambiguity.
  - PROVED-BY: the recipient fail-safes to the test address at the finalize point; the Resend sandbox restriction is preserved.

**INV-2 — A send is logged ONLY when it actually sends.**
  - FAIL-WHEN: a `sent` instance row exists for a send that failed.
  - PROVED-BY: force a Resend failure → no `sent` row + toast; success → exactly one `sent` row.

**INV-3 — Pairing is deterministic; DocuSeal link only where it belongs.**
  - FAIL-WHEN: two emails pair one doc nondeterministically; OR a signing link is injected into a doc-less/non-LOE send; OR the LOE send loses its link.
  - PROVED-BY: partial-unique pairing rejects a dupe (23505 → clean typed error); LOE send → signing link present; doc-less send → no link.

**INV-4 — A sent/drafted email lands as a pill in the "Saved Documents/Email" section** (the saved section is renamed from "Saved Documents").
  - FAIL-WHEN: a sent/drafted email does not appear as a pill in that section, OR the section header still reads "Saved Documents", OR an emailed document is DOUBLE-listed (a separate email entry instead of an "emailed" marker on its document pill).
  - PROVED-BY: send a standalone email → a pill appears under the Email filter; the section header reads "Saved Documents/Email".
  - *Grouping (default, derivable from `contract_id`; ui-designer refines): email-only (`contract_id=null`) → Email/Thank-You pill; a document that was emailed (`contract_id` set) → stays under its document pill with an "emailed" marker, NOT a second entry.*

**INV-5 — The recipient DEFAULTS to the CLIENT, with a "Change Recipient" control; it must NOT look hardwired to the test address.** (Ben: the composer currently shows `bc@crowestudio.com` as the default → looks hardwired to the dev's email.) ⚑ Safety preserved: non-prod DELIVERY is still sandbox-redirected to the test address (INV-1) — the DISPLAYED/intended recipient is the client; the actual non-prod send still goes to test, shown as a note.
  - FAIL-WHEN: the recipient field defaults to / shows the test address as if hardwired; OR there's no way to change the recipient; OR (safety) a real client email is actually DELIVERED in non-prod.
  - PROVED-BY: open the email composer → the recipient defaults to the job's client email + a "Change Recipient" control is present; in non-prod the actual Resend delivery still redirects to the test address (sandbox), with a visible note. (Display = client/intended; non-prod delivery = test/sandbox.)

## Entry architecture (Ben-confirmed via full explain-back, 2026-06-17 — FINAL, see INV-0)

- **ENTRY:** the dashboard button **"Create Document/Email"** (rename) is the single entry → pressing it OPENS the Previewer.
- **PREVIEWER:** two dropdowns SIDE BY SIDE — **Document** + **Email**.
  - **Document path:** pick Document → the document workflow → the **bottom document-Send button** (the existing send) sends by email WITH the document connected (signing link). ⚑ KEEP that bottom button — do NOT remove it.
  - **Email path:** pick Email → the email previewer opens STANDALONE — nothing connected (`contract_id=null`), adjust the template, send.
- **⭐ ONE reusable component both ways:** the email previewer/dropdown is the SAME component (SendByEmailControl, `docTemplateId: string|null`); the ONLY difference is the connection — under a document → `docTemplateId=the-doc` (connected, signing link); from the Email dropdown directly → `docTemplateId=null` (standalone). Same screen + template-edit both ways. NOT a new component — feed it the doc vs null.
- **REMOVE:** D1's loose "Send by Email: [Default LOE Email][Preview][Send]" widget on the dashboard/job page.

This is QA's original Hole 0 (Previewer two-dropdown, §4A) — correct before it drifted (viewer-header → entry-button → dashboard → locked back to the Previewer).

## Scope

- Email-template CRUD + pairing to document templates (managed-object parity with documents).
- The inline send control replacing "Continue to Email" (LOEPreviewModal + LoeQuote paths).
- Instance logging on success; failure handling.
- Pairing cardinality + tie-break.
- Send safety guardrails (test-recipient hard-guard + confirm).

## Out of scope (fenced)

- Re-enabling RLS on the email tables — **tracked as a pre-client-cutover prerequisite** (see Guardrails), NOT this build.
- Multi-recipient / CC / BCC, scheduling, attachments beyond the existing doc.
- Any change to the report-builder or the shipped Slice-4b fields.
- TemplateEditorModal beyond what the send/pairing needs.

## Guardrails (the 5 spec-gate fixes — folded in, must hold)

1. **Stale-RLS reality:** RLS is currently OFF on `email_templates` + `job_email_instances` (migration disabled it). Headless verification IS valid here (anon writes land) — build/verify accordingly. **Re-enabling RLS is a logged pre-cutover prerequisite**, not optional.
2. **Irreversible send guard:** non-prod hard-guards the recipient to the test address + a confirm (or undo window). A one-click send must not fire a live client email.
3. **Pairing cardinality:** enforce 1 email ↔ 1 doc (partial-unique index) OR a defined tie-break (e.g. most-recent) — never nondeterministic first-match.
4. **Send-failure state:** persist `sent` ONLY on Resend success; on failure show a toast + leave unsent (no false timeline).
5. **DocuSeal no-regression:** the inline control must preserve the LOE signing-link send that triggers DocuSeal e-sign (the path being replaced).

## Pass/fail gates (up front)

- Each Key Result proven by its named artifact (DB row + real arrival/pixels, never just a 200).
- QA build-verify runs **as the app's real runtime identity** (the anon lesson — a logged-in self-check misses silent bugs).
- `tsc --noEmit` clean + drift-gate stays green (V3/report-builder untouched).
- No partial syncs; all 5 guardrails demonstrated.

## Build path (per /workflow-orc-2agt)

Spec-gate PASS-WITH-FIXES is **done** (qa-agent). Next: co-arch drafts the Assembly Prompts → QA prompt-gate → forked persona-switch builders in the dependency-WAVE order QA mapped (T1 migration + T3 wire → T2 CRUD → T4 control + T5 modal → T6 LOEPreview + T7 LoeQuote → T8 pairing round-trip + full-flow verify) → QA build-verify each → fold → proof-first close.

**Verification model (Ben, 2026-06-17 — supersedes the visual-gate apparatus):** agents verify **CODE / LOGIC / DATA only** — fast + deterministic (components built, wiring correct, guardrails catch, tsc + drift green, DB proofs like the 23505 already-paired return). **NO agent app-walking, NO agent screenshots, NO builder self-screenshots** (driving the app to screenshot a modal burns too much time for "does it look weird" on pattern-mirroring UI). **VISUAL = Ben click-tests the DEPLOYED app** (the proof-first close — a live link Ben clicks + tests beats any agent screenshot). ui-designer stays by-exception for genuinely net-new design only.

---

*Authored 2026-06-17 by co-architect via /write-prd (its first dogfood run) + Ben. Series: LOE-Esign. Spec + 8-task plan: dev-7. Spec-gate: qa-agent. → routes to QA spec-gate confirmation, then Assembly Prompt → prompt-gate → deploy.*
