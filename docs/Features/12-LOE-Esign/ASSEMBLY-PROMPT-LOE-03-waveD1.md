---
id: assembly-prompt-loe-03-waveD1
title: "Assembly Prompt — LOE-03 WAVE D1 (additive document-less send entry) → fullstack fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: D1 (additive, LOW-RISK — the standalone document-less email path; does NOT touch the live LOE send. Satisfies the FAIL CONDITION.)
status: for-prompt-gate (qa-agent /review-gate prompt-mode) → then fork-deploy (pending Ben's nod on the D1/D2 split)
note: D2 (the live-send swap + polished single-button two-dropdown chooser) is SEPARATE + careful, with Ben click-test. D1 proves email-is-not-a-sub-step without production risk.
---

# Assembly Prompt — LOE-03 Wave D1 (additive doc-less send)

> Split from Wave D after the Wave-D fork correctly STOPPED before blind-rewriting the live LOE/DocuSeal/Resend send. **D1 = additive**: add the standalone document-less email path (satisfies the FAIL CONDITION — email reachable without opening a document) WITHOUT touching the existing live LOE send. D2 (separate) does the live-send swap + the polished chooser with Ben click-test.

## Verified integration map (from the Wave-D fork — provisioned, don't re-derive)
- LOE send lives in `LoeQuoteSection` ~L1087–1133: `recipientEmail = overrideEmail || job.clientEmail` (L1087 = the client-side recipient-finalize point → the guard belongs here); `sendLOEEmail(...)`; instance persists `state:'sent'` ONLY on success (Guardrail 4 already honored); signing link via `generateAndSendLOE` (Guardrail 5 / DocuSeal).
- Resend **sandbox** already restricts delivery to the test address (`EmailComposeModal` L320–321) — that IS the existing recipient-guard; PRESERVE it.
- Doc-less send = `sendLOEEmail` with an EMPTY signing link (G5: no link for doc-less) + `persistEmailInstance(contractId:null)` (KR2).
- `SendByEmailControl` (Wave C) is a dumb picker; the parent wires the send.

## The prompt (paste to the fork)

```
You are the fullstack builder for APR Dashboard v3, Wave D1 of PRD-APR-LOE-03. You are a FORK — you inherit co-architect's full context (PRD, gates, Wave A/B/C, the verified integration map above). Build ONLY D1: the ADDITIVE document-less email send entry. Do NOT touch the live LOE send path (that's D2).

STEP 0: bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh fullstack-developer · load /cli-agent-all /build-discipline /supabase-deploy /search-tools · Read ~/Development/APR-Dashboard-v3/CLAUDE.md (note 🚫 NO-LOGIN) · run /search-2phase scoped "LOE-03 LoeQuoteSection document-less SendByEmailControl sendLOEEmail persistEmailInstance recipient sandbox".
BUILD-DISCIPLINE pre-flight (load for real): brainstorming · pre-change-audit (inventory LoeQuoteSection L1087–1133 + the Resend sandbox L320–321 + the contract-pill pattern BEFORE touching) · systematic-debugging · verification-before-completion.

THE WORK (D1 — additive only):
- RENAME the "Create Contract" button → "Create Document/Contract" (general; it is NOT always a contract). (Safe now BECAUSE D1 adds the email path — not a misleading rename.)
- ADD a STANDALONE document-less Send-by-Email entry on the job (SendByEmailControl docTemplateId={null}) — reachable WITHOUT opening a document. ⭐ This satisfies the FAIL CONDITION.
- Render an email draft/sent PILL list like the contract pills.
- Wire the DOC-LESS send: sendLOEEmail with an EMPTY signing link (Guardrail 5: no link for a doc-less send) + persistEmailInstance(contractId:null) (KR2). Persist 'sent' ONLY on success (Guardrail 4).
- ⚑ RECIPIENT-GUARD (G2 / INV-1): PRESERVE the existing Resend sandbox/test-recipient (EmailComposeModal L320–321); at the recipient-finalize point (L1087 pattern), FAIL-SAFE — ambiguous/unknown recipient → FORCE test address, never the real client; non-prod = import.meta.env.PROD/MODE. ⚑ QA-TIGHTEN: the doc-less send REUSES sendLOEEmail — confirm the DOC-LESS path's recipient ALSO routes through the SAME guarded fail-safe finalize (a no-document send with an ambiguous recipient must STILL force the test address — don't let the new path bypass the guard the existing LOE send has).
- ⚑ ADDITIVE FENCE: do NOT modify the existing live LOE send path / "Continue to Email" / the 4-state gated document flow — D1 adds a NEW doc-less path ALONGSIDE; D2 swaps the live one. Leave the existing send working.

VERIFY (CODE/LOGIC/DATA only — NO screenshots/app-walk/login; Ben click-tests):
- ⭐ FAIL CONDITION: the standalone doc-less Send-by-Email entry EXISTS + is reachable WITHOUT opening a document — confirm.
- Doc-less send → persistEmailInstance(contractId:null) + EMPTY signing link.
- Recipient fail-safes to the test address (read the finalize path).
- Existing live LOE send path UNCHANGED (additive — confirm no diff to it).
- tsc --noEmit clean · drift green (V3 untouched) · checkpoint as fullstack-developer.

WORKER DOCTRINE: no AskUserQuestion/menus — pick + "proceeding"; "STUCK: <q>" if blocked. No screenshots/app-driving/login. Push DONE to dev-1 (bash ~/.claude/scripts/utils/tmux-msg.sh dev-1 "DONE: ...") with code/DB evidence. Co-arch verifies; QA build-verifies at code/DB; Ben click-tests.
```

---

→ qa-agent `/review-gate` prompt-mode. On PASS + Ben's nod on the split: fork-deploy. **D2 (live-send swap + polished single-button two-dropdown chooser) is separate, careful, with Ben click-test.**
