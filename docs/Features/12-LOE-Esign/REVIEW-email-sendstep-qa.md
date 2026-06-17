---
id: review-email-sendstep-qa
title: "review-gate (SPEC mode) — Email send-step Key Result"
date: 2026-06-14
type: spec-review
reviewer: qa-agent
gate: review-gate / spec-review (7 lenses)
target: PRD-APR-LOE-01.md → "Email template" Key Result + LOCKED SCOPE / CONTEXT FINDING / FLOW RULE
verdict: REVISE
tags: [review-gate, spec-review, loe, email-editor, apr-workflow]
---

# review-gate SPEC review — Email send-step

**Verdict: REVISE** — strong, code-grounded spec (the GROUND-TRUTH lens passes cleanly). But six gate-blockers and three clarifications stand between it and "builder-ready." Co-architect owns the spec; these are gaps to close, not a rewrite.

Output shape: each gap is `the hole → why it bites → suggested fix`.

---

## Gate-blockers (fix before the assembly prompt)

### 1. Signing-link merge token can't resolve at edit time — `contradiction / adversarial`
- **The hole:** the spec says all four merge tokens (first name, last name, job number, **signing link**) auto-fill and are *visible in the editor* at step ② Email. But the signing link is produced by the **send action** (the DocuSeal submission) — it does not exist yet at the edit step, which happens *before* send.
- **Why it bites:** the builder wires `{signing link}` to resolve in-editor; it renders blank or broken, and the proof ("arriving email reflects merged fields") fails on the single token that matters most — the button the client clicks to sign.
- **Suggested fix:** state that `{signing link}` shows a **labeled placeholder** in the editor and resolves **at send-time only**. Name when each token resolves: names + job number at edit time (from job data), signing link at send.

### 2. Email-template persistence model isn't grounded — `ground truth`
- **The hole:** documents live in `job_contracts`, but the email template — the managed **DEFAULT** and the per-send **edited instance** — has no storage home named anywhere in the spec.
- **Why it bites:** the builder invents a table and shape; the default-vs-instance split gets modeled wrong, and the "editing one send never changes the default" guarantee becomes unenforceable because both read/write the same object.
- **Suggested fix:** name the storage explicitly — a **default email template** row (settings-scoped, one source of truth) **and** a **per-send instance** (job-scoped, same pattern as `job_contracts`), plus the column(s) carrying subject + body. State the merge-source tables (names/job# from `job_submissions`; signing link from the DocuSeal submission).

### 3. Default isolation has no proof + a gating contradiction — `testability / guardrail`
- **The hole:** LOCKED SCOPE says editing one send **never** changes the default AND "overwrite/change the default anytime." Two problems: (a) the **proof never verifies** the isolation, and (b) "overwrite anytime" contradicts the document guardrail that template edits are **gated/approval-only** (Guardrails line 69).
- **Why it bites:** the builder ships a shared object where editing a send mutates the default, or lets anyone freely clobber the default that every future send inherits — and nothing in the proof would catch it.
- **Suggested fix:** add an explicit proof step — *edit one send → open a fresh send → confirm the default is unchanged.* And decide + state whether changing the email **DEFAULT** is gated like a document template, or intentionally free (and why it differs).

### 4. Missing states: sending, error, and step ③ Sent — `completeness`
- **The hole:** no loading/sending state, no send-**failure** state (Resend/sandbox error, network timeout), and the **③ Sent** step content is undefined — the stepper names it but nothing says what it renders.
- **Why it bites:** the builder ships a Send button that silently hangs or fails (the email is lost with no feedback), and an empty step ③.
- **Suggested fix:** define **sending** (button disabled/spinner), **error** (message + retry; the document is **NOT** marked sent on failure), and **③ Sent** (confirmation + recipient shown + the return path back to the job).

### 5. "Email" pill: not-creatable here vs. shipped as a pill — `contradiction`
- **The hole:** this KR says "Email is NOT a creatable saved-docs pill" and "sent emails appear as records." But the **C pills just shipped** render an `Email` type pill, and the naming KR groups "Emails sent" as a type.
- **Why it bites:** the Create path offers "Email" as a creatable type — a cold email with no attached document, the exact thing the FLOW RULE forbids — or the two KRs simply fight and the builder picks wrong.
- **Suggested fix:** state explicitly that the **Email pill is a filter/record bucket for *sent* emails only, never a create target**; the Create-Contract type list must not include Email.

### 6. Double-send on the Email step — `guardrail`
- **The hole:** nothing stops a user clicking **Send** on ② Email twice → two emails to the client.
- **Why it bites:** the client receives the same engagement email twice (the email equivalent of the chunk-1 duplicate-row hazard).
- **Suggested fix:** disable Send after first dispatch + check a sent flag before dispatch — mirror the chunk-1 no-duplicate guard.

---

## Clarifications (fence these, don't leave ambiguous)

### 7. Scope of the security cleanup — `scope fence`
The hardcoded **Resend API key in the function source** and the **dead variants** (`send-loe-email`, `-v2`, `-gmail`) are named as findings. State whether moving the secret to a managed secret + the cleanup are **IN this sub-item** or **fenced to the sender-cutover item**. A secret-in-code shouldn't sit un-owned between two specs.

### 8. Test-path truthfulness — `adversarial`
The Resend sandbox delivers **only to bc@crowestudio.com**, but the email is addressed/merged as the **client**. A tester can believe the client received it. Add a visible **"TEST — delivered to sandbox, not the client"** indicator on the send step while on the Resend test path.

### 9. Reset-to-original-default — `adversarial`
If the managed default gets clobbered, is there a recover-the-seed escape hatch? The verbatim current email (`send-loe-email-fixed`) is the seed — keep it recoverable so a bad overwrite isn't permanent.

---

## What passed

- **Ground truth** — strongest lens here: the exact live function named, transport/Graph state documented, the secret + dead variants identified, reference assets provided (`current-email.png`, `email-editor-mock.html`). The spec read the code; it didn't guess.
- **Scope fence (sender cutover)** — production sender (Graph/valta.ca or verified Resend domain) is cleanly separated as a later sub-item.
- **Seed-verbatim discipline** — "expose the current email as the default, do not redesign" is the right call and explicitly stated.

---

*qa-agent · review-gate spec-review · first live run · co-architect revises → re-review or prompt-review next.*
