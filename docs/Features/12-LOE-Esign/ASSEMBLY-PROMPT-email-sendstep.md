---
id: assembly-prompt-email-sendstep
title: "Assembly Prompt (DRAFT) — Email send-step build → react-spec"
date: 2026-06-14
type: assembly-prompt
status: draft-for-prompt-review
agent: react-spec (build) · qa-agent (verify)
spec: PRD-APR-LOE-01.md → "Email template" Key Result (PASSED review-gate spec mode)
gate: pending review-gate / prompt-review (mode 2)
---

# Assembly Prompt — Email send-step (encapsulated Passover to react-spec)

> DRAFT. Goes through `/review-gate` prompt-mode (qa-agent) before it's sent to react-spec. NOT yet deployed.

**To:** react-spec (build). qa-agent verifies after. *(Agent already chosen — small fixed cast; no registry hunt.)*

**Load these skills first:** `build-discipline` (this is a real build — the 4 iron-law pre-flight skills), `react-specialist-domain`, `frontend-design` + `ui-ux-pro-max` (the email editor is a new UI surface), `supabase-deploy` (edge function + DB persistence), `cli-browser-auto` (headless test on :8086), `guide-gmail-cli` (**check the test inbox bc@crowestudio.com to confirm the email actually ARRIVED** — a send 200 is NOT delivery).

**Build from this SPEC (don't re-design):** the **"Email template" Key Result** in `~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/PRD-APR-LOE-01.md` — read it in full incl. the REVISED block (it carries every locked decision + the 6 closed blockers). It PASSED the spec gate; build exactly to it.

**Entry-point files (the nail, not just the hammer):**
- `supabase/functions/send-loe-email-fixed/index.ts` — the LIVE send fn: hardcoded subject + body (the seed), the hardcoded Resend key (move to a managed secret), `send_email=false` custom-Resend path.
- `LOEPreviewModal.tsx` — the current "Send to Client" action that fires immediately; this is where the ② Email step inserts (stepper ① Review document → ② Email → ③ Sent).
- `LoeQuoteSection.tsx` — the stepper host + the saved-docs list (don't break the shipped C pills / chunk-1 round-trip).
- `job_contracts` (the per-instance pattern to MIRROR for the per-send email instance) + `job_submissions` (merge source for names + job number).
- **STORAGE TO CREATE** (migrations via `supabase-deploy`): a settings-scoped **`email_templates`** table holding the ONE managed default (subject + body, recoverable seed); and a **job-scoped per-send email instance** (mirror `job_contracts`). Default and instance are SEPARATE objects — that's what enforces "editing one send never changes the default." Don't let the builder invent where the default lives.

**Tools you have for this (from the toolkit — reminder, run `/search-tools` to go deeper):** `docuseal-send-loe` (the send), `docuseal-email-path` (the custom-Resend edge fn = `send-loe-email-fixed`), `docuseal-signing-link` (the slug — **resolves only at send**). Gotcha: a send **200 ≠ signed** (only "sent"); test sends go to the **test address only**, never a client.

**Three build-time notes (from prompt-review prep):**
- (a) the default-EDIT surface mirrors the document editor's existing **"Set Default" toggle** (consistency).
- (b) **SNAPSHOT the verbatim current email as the immutable seed at build time** — capture subject+body BEFORE lifting them out of `send-loe-email-fixed`, or reset-to-seed isn't real.
- (c) the proof must explicitly eyeball that the **arrived test email's button links to the real signing URL**.

**PROOF to hit (self-verify before QA):** test job → open the ② Email step → edit the email (the `{signing link}` shows a placeholder) → Send (to the test inbox, with the "TEST — sandbox, not the client" banner) → the arrived email reflects your edits + merged name/job# + **its button links to the real signing URL**. AND: edit one send → open a fresh send → the default is unchanged. **Also prove (don't ship these new guardrails unverified):** (a) **arrival** — confirm via the test inbox (`guide-gmail-cli`/email-check on bc@crowestudio.com) that the email actually landed, edits + merged fields present, button → real signing URL (NOT just a send 200); (b) **failure** — force a failed send (e.g. a temporarily invalid recipient or key in a local test) → confirm the document is NOT marked sent + retry works; (c) **reset-to-seed** — clobber the default → reset → confirm it returns to the verbatim original. *(QA independently re-verifies arrival in build-verify.)*

**Guardrails:** an instance edit NEVER changes the managed default; document is NOT marked sent on send-failure; double-send guard (disable after first dispatch + check sent flag); don't break the shipped C pills or chunk-1 round-trip; the marker parser/render untouched. **Local build + self-verify only — NO Vercel.** Test sends to the test address ONLY.

**Start in this order:** read this Passover first → run `/search-2phase` (SS12) on "APR LOE email send-step DocuSeal Resend edit template persistence" → then build to spec.

**Worker doctrine:** no AskUserQuestion — pick per spec, report "Picked X, proceeding"; `STUCK: <q>` only if truly blocked. Ping co-arch on dev-5 when built + self-verified.

---
*Draft — co-architect. Routes to qa-agent `/review-gate` prompt-mode; revise on gaps; STOP before deploying react (Ben: dial the workflow through both gates first).*
