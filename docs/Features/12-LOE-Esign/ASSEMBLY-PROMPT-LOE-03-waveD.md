---
id: assembly-prompt-loe-03-waveD
title: "Assembly Prompt — LOE-03 WAVE D (T6 LOEPreviewModal + T7 LoeQuoteSection) → fullstack fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: D (T6 + T7 — mounts Wave C's control/modal + WIRES THE REAL SEND + recipient-guard; needs T3/T4/T5)
status: for-prompt-gate (qa-agent /review-gate prompt-mode) → then fork-deploy
verification: CODE / LOGIC / DATA only (Ben 2026-06-17) — NO self-screenshot, NO agent app-walk. Visual = Ben click-tests the deploy.
---

# Assembly Prompt — LOE-03 Wave D (wires the real send)

> Vehicle = Mode B-2 fork (Agent tool **`subagent_type: "fork"`** → inherits context; Step 0 bash-loads **fullstack-developer**). Mounts SendByEmailControl (T4) + EmailComposeModal (T5) and WIRES THE ACTUAL SEND. This is where **Guardrail 2 (recipient-guard)**, **Guardrail 4 (send-failure state)**, **Guardrail 5 (DocuSeal no-regression)**, and **KR2 (document-less send)** all land. **No self-screenshot — agents verify code/logic/DB; Ben click-tests the deployed result.**

---

## The prompt (paste to the fork)

```
You are the fullstack builder for APR Dashboard v3, Wave D of PRD-APR-LOE-03. You are a FORK — you inherit co-architect's full session context (PRD, gates, Wave A schema + Wave B functions + Wave C control/modal). Build only Wave D: T6 (LOEPreviewModal) + T7 (LoeQuoteSection) — mount the control/modal + wire the real send.

STEP 0 — persona-switch + load your kit (FIRST):
- bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh fullstack-developer
- Load: /cli-agent-all (full APR toolkit — Resend/email send, Supabase, DocuSeal, deploy) · /build-discipline (pre-flight + audit) · /supabase-deploy (DB ground-truth) · /search-tools.
- Re-read project house-rules: Read ~/Development/APR-Dashboard-v3/CLAUDE.md (forks lose it — and note the 🚫 NO-LOGIN rule: the app is wide open, never authenticate).
- Run /search-2phase (SS12) scoped to "LOE-03 LOEPreviewModal LoeQuoteSection Continue-to-Email send Resend resolveSigningLink DocuSeal email instance persist recipient guard" before writing code.

BUILD-DISCIPLINE pre-flight (load for real): /superpowers:brainstorming · /pre-change-audit (inventory the EXISTING "Continue to Email" send path + resolveSigningLink/DocuSeal trigger + the contract-pill pattern BEFORE touching) · /systematic-debugging · /superpowers:verification-before-completion.

THE WORK (Wave D / T6 + T7 — provision from the spec, don't re-invent):
- Spec + per-task detail: docs/Features/12-LOE-Esign/PLAN-email-as-first-class-2026-06-17.md → Task 6 (LOEPreviewModal) + Task 7 (LoeQuoteSection). PRD: PRD-APR-LOE-03.md.
- ⭐ ENTRY ARCHITECTURE (Ben's click-test LOCK 2026-06-17 — resolves spec §7 entry-placement; the two-dropdown surface lives at the ENTRY, NOT in the doc-preview header): the SINGLE ENTRY is the renamed "Create Document/Contract" button on the job (T7). Clicking it opens TWO DROPDOWNS side by side — "Email Templates" + "Documents/Contracts" — two ways in from one place. You do NOT open a document first to reach email. (This supersedes the earlier 'two dropdowns in the LOEPreviewModal header' reading — direct email access is at the Create entry now.)
- T7 — LoeQuoteSection.tsx (the ENTRY, the headline fix):
  · RENAME the "Create Contract" button → "Create Document/Contract" (a general name — it is NOT always a contract).
  · That button is the SINGLE ENTRY → opens a TWO-DROPDOWN surface: "Email Templates" + "Documents/Contracts". Pick an email template → the standalone (document-less) email send (SendByEmailControl docTemplateId={null}); pick a document → the existing document/LOE flow.
  · The standalone email send CONNECTS to the job: wire onSend → persistEmailInstance (Wave A/T3) with contract_id=null (KR2 document-less).
  · Render an email draft/sent pill list like the contract pills.
- T6 — LOEPreviewModal.tsx (the WITH-DOCUMENT send, reached after picking a document):
  · Rename the doc picker label (Template: → Document Templates:).
  · REPLACE the footer "Continue to Email" with the inline SendByEmailControl (Wave C, docTemplateId = the document's template id); previewer opens via the control's onPreview → EmailComposeModal.
  · NOTE: direct email-template access is NOT here — it's at the Create entry (T7). T6 is only the email-tied-to-this-document send path.
  · ⭐ VIEWER RENAME (Ben catch — the viewer holds more than LOEs: an LOE, a client letter, anything): generalize the USER-FACING TEXT — the "LOE Preview" / "LOE Previewer" label → **"Previewer"** (Ben's FINAL name — WITH the 'er'), and the heading "Review Letter of Engagement before sending" → "Review before sending" (it's the pre-send review of WHATEVER — doc or email). KEEP the component/file name (LOEPreviewModal.tsx) as-is — change only the displayed text, no import churn.
- T7 — LoeQuoteSection.tsx: add a DOCUMENT-LESS Send-by-Email entry beside "Create Contract" (SendByEmailControl docTemplateId={null}); render an email draft/sent pill list like the contract pills; wire onSend → persistEmailInstance (Wave A/T3) with contract_id=null for the document-less path.
- ⚑ GUARDRAIL 2 (recipient-guard, the SEND lands here — SAFETY-CRITICAL, QA-tightened): the real send goes SERVER-SIDE via an EDGE FUNCTION (generateLOE.ts ~L485 → send-loe-email-fixed posts to clientEmail), so a CLIENT-only guard is BYPASSABLE. Requirements: (a) PRESERVE the existing Resend SANDBOX / test-recipient restriction (EmailComposeModal ~L321 already restricts to the test address) — do NOT regress it; (b) non-prod signal = import.meta.env.PROD / import.meta.env.MODE (client-side check); (c) FAIL-SAFE: if the recipient is ambiguous/unknown, FORCE the test address — NEVER default to the real client email; (d) confirm WHERE the recipient is finalized (client vs the edge function) and put the guard there so it's AUTHORITATIVE, not a half-guard the edge bypasses. A misclick must not be able to fire a live client email by any path.
- ⚑ GUARDRAIL 4 (send-failure state): persist the email instance as 'sent' ONLY on Resend SUCCESS; on failure → toast + leave it UNSENT (no false 'sent' row).
- ⚑ GUARDRAIL 5 (DocuSeal no-regression — BOTH directions, QA-scoped): resolveSigningLink MUST still fire on the LOE send (preserve the DocuSeal e-sign trigger when replacing "Continue to Email") AND must NOT be injected into document-less / non-LOE sends (the signing_link belongs only to an email type that carries one). Verify BOTH directions: LOE send → link present; document-less send → no link.
- ⚑ KR2 (document-less): the T7 no-document send writes an instance with contract_id=null.

HARD FENCES (do NOT touch): report-builder / Slice-4b; RLS re-enable; the migration-history reconcile (co-arch pre-close item).

VERIFY before handoff — CODE / LOGIC / DATA only (NO screenshots, NO app-walking — Ben click-tests the deploy):
- ⭐ FAIL CONDITION (the architecture is a TESTABLE acceptance, not just a description): if the ONLY path to the email / compose area is THROUGH a document send, the wave is WRONG regardless of how it renders. The standalone (document-less) Send-by-Email entry — reachable directly from the renamed "Create Document/Contract" two-dropdown surface — MUST exist and ship THIS wave. Confirm a doc-less send is reachable WITHOUT opening a document.
- Recipient-guard present at the send call (non-prod → test address + confirm); read the code path, confirm a misclick can't reach a real client address.
- Send-failure: trace the onSend path — 'sent' instance persists ONLY on Resend success; failure → toast, no row. (Prove with the function/DB path.)
- Document-less: T7 no-doc send → persistEmailInstance contract_id=null.
- DocuSeal: resolveSigningLink still called on the LOE send path (no regression) — confirm in code.
- SendByEmailControl now MOUNTED in both T6 + T7 (its visual proof was deferred from Wave C — but per the model, that's Ben's click-test on deploy, not yours).
- tsc --noEmit clean. Drift-gate green (V3 untouched). Checkpoint as fullstack-developer at end.

WORKER DOCTRINE: No AskUserQuestion / menus — pick per spec+guardrails, report "Picked X, proceeding"; "STUCK: <q>" only if truly blocked. No screenshots, no app-driving. On completion push DONE to dev-1 (bash ~/.claude/scripts/utils/tmux-msg.sh dev-1 "DONE: ...") with the code/DB verify evidence. Co-arch verifies the artifact; QA build-verifies the send-logic + guardrails + instance-persistence at code/DB level; Ben click-tests the deployed result for the visual + real-arrival proof.
```

---

## Anatomy + model check
Agent: fullstack-developer (send wiring + DB), `subagent_type:"fork"`, corrected persona-switch path. Skills: cli-agent-all + build-discipline + supabase-deploy + search-tools (NO screenshot kit — no visual verify this model). Points at PLAN T6+T7 + the 4 guardrails (2/4/5 + KR2) that land here. read→switch→SS12→build order. **NO self-screenshot clause (Ben 2026-06-17 model).** Verification = QA code/logic/DB; visual = Ben click-tests the deploy.

→ qa-agent `/review-gate` prompt-mode. On PASS: fork-deploy. Then Wave E (T8 — pairing round-trip + full-flow), then DEPLOY → Ben click-tests → proof-first close.
