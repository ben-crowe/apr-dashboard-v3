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

**INV-0 (THESIS) — Email MUST be sendable WITHOUT a document** (email is first-class, never a document sub-step).
  - FAIL-WHEN: the only path to compose/send an email is through opening a document.
  - PROVED-BY: from the job view with NO document, the Send-by-Email control writes a `job_email_instances` row with `contract_id = null` and the email is reachable without opening a document. *(Built FIRST — Wave D1.)*

**INV-1 — A misclick MUST NOT send a live client email** (test-recipient fail-safe).
  - FAIL-WHEN: a send can reach a real client address in non-prod / on ambiguity.
  - PROVED-BY: the recipient fail-safes to the test address at the finalize point; the Resend sandbox restriction is preserved.

**INV-2 — A send is logged ONLY when it actually sends.**
  - FAIL-WHEN: a `sent` instance row exists for a send that failed.
  - PROVED-BY: force a Resend failure → no `sent` row + toast; success → exactly one `sent` row.

**INV-3 — Pairing is deterministic; DocuSeal link only where it belongs.**
  - FAIL-WHEN: two emails pair one doc nondeterministically; OR a signing link is injected into a doc-less/non-LOE send; OR the LOE send loses its link.
  - PROVED-BY: partial-unique pairing rejects a dupe (23505 → clean typed error); LOE send → signing link present; doc-less send → no link.

## Entry architecture (Ben click-test LOCK, 2026-06-17 — resolves spec §7 entry-placement)

The SINGLE ENTRY is the renamed **"Create Document/Contract"** button on the job (was "Create Contract" — it is NOT always a contract). Clicking it opens **TWO DROPDOWNS side by side: "Email Templates" + "Documents/Contracts"** — two ways in from one place. **You do NOT open a document first to reach email** (that buried-in-the-send-modal flow was the deviation Ben caught — it made email a document sub-step, killing the north star). From the entry: pick an email template → standalone document-less send (connects to the job, contract_id=null); pick a document → the existing document/LOE flow (where the email-tied-to-that-document inline send lives). The two-dropdown surface is at the ENTRY, never buried after opening a document.

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
