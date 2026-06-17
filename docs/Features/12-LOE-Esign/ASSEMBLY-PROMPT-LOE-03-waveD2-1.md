---
id: assembly-prompt-loe-03-waveD2-1
title: "Assembly Prompt — LOE-03 WAVE D2.1 (INV-5 recipient defaults to CLIENT + Change Recipient; non-prod delivery still sandboxed) → fullstack fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: D2.1 (small additive fix on top of D2 acd53f8 — land BEFORE Ben click-tests so the composer doesn't show the test-email-hardwired default)
status: for-prompt-gate (qa-agent /review-gate prompt-mode) → fork-deploy → deploy D2+D2.1 → Ben click-test
---

# Assembly Prompt — LOE-03 Wave D2.1 (INV-5 recipient default)

> Vehicle = Mode B-2 fork (`subagent_type: "fork"`; Step 0 bash-loads fullstack-developer). Small, surgical: the email composer currently DEFAULTS the recipient to the TEST address (bc@crowestudio.com) → looks hardwired to the dev's email (Ben flagged). Fix the DEFAULT to the CLIENT + a Change Recipient control — WITHOUT weakening the non-prod sandbox safety.

## ⭐ INV-5 (the gate runs this)
```
INV-5 — The recipient DEFAULTS to the CLIENT, with a "Change Recipient" control; must NOT look hardwired to the test address. Non-prod DELIVERY still sandbox-redirects to test (INV-1 preserved).
  FAIL-WHEN: the recipient field defaults to/shows the test address as if hardwired; OR no way to change recipient; OR (safety) a real client email is actually DELIVERED in non-prod.
  PROVED-BY: open the composer → recipient defaults to the job's client email + a "Change Recipient" control present; in non-prod the actual Resend delivery still redirects to the test address (sandbox) with a visible note.
```

## The prompt (paste to the fork)

```
You are the fullstack builder for APR Dashboard v3, Wave D2.1 of PRD-APR-LOE-03 — a small surgical recipient-default fix on top of D2 (commit acd53f8). You are a FORK — you inherit co-architect's full context (PRD with INV-5, D2). Build ONLY INV-5.

STEP 0: bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh fullstack-developer · load /cli-agent-all /build-discipline /supabase-deploy /search-tools · Read ~/Development/APR-Dashboard-v3/CLAUDE.md (🚫 NO-LOGIN) · run /search-2phase scoped "LOE-03 EmailComposeModal recipientEmail safeRecipient job.clientEmail Resend sandbox recipient default change".
BUILD-DISCIPLINE pre-flight (load for real): brainstorming · pre-change-audit (inventory: where the composer sets recipientEmail today — it currently passes safeRecipient(job?.clientEmail) which FORCES the test address as the displayed default; the safeRecipient fn from D1; the Resend sandbox L320-321) · systematic-debugging · verification-before-completion.

THE FIX (INV-5 — separate DISPLAY from DELIVERY):
- DISPLAY/DEFAULT: the composer's recipient field DEFAULTS to the job's CLIENT email (job.clientEmail), NOT the test address. Add a "Change Recipient" control so it's editable. The user sees they're emailing the CLIENT (the real intent).
- DELIVERY (safety — do NOT weaken): at SEND time, in non-prod, the actual Resend delivery STILL redirects to the test address (the existing safeRecipient / Resend sandbox) — INV-1 preserved. A real client email must NOT be delivered in non-prod.
- ⚑ So: the recipient FIELD shows/defaults to the client (editable); the DELIVERED recipient in non-prod is still the sandbox test address. Show a small visible NOTE that non-prod delivery is sandboxed to the test address (so it's clear why it shows client but sends to test).
- Apply on BOTH email paths (standalone doc-less + the under-a-document path) since both use the composer.

FENCES: do NOT touch the live document send logic (handleApproveAndSend) beyond the recipient display; report-builder/Slice-4b; RLS; migration-history. Do NOT remove the sandbox redirect (that's the safety).
(Optional, non-blocking: SendByEmailControl is now unused dead code from D2's deviation — you MAY remove it if trivial + zero-risk, else leave a cleanup note. Do not let it expand scope.)

VERIFY (CODE/LOGIC/DATA only — NO screenshots/app-walk/login; Ben click-tests):
- INV-5: recipient field defaults to job.clientEmail (NOT the test address) + a Change Recipient control exists; read the SEND path → in non-prod the delivered recipient is STILL the sandbox test address (real client NOT delivered in non-prod). Both display=client and delivery=sandboxed-test confirmed.
- INV-1 still holds (delivery fail-safe intact). Live document send unchanged.
- tsc --noEmit clean · drift green (V3 untouched) · checkpoint as fullstack-developer.

WORKER DOCTRINE: no AskUserQuestion/menus — pick + "proceeding"; "STUCK: <q>" if blocked. No screenshots/app-driving/login. Push DONE to dev-1 with code/DB evidence. Co-arch verifies; QA build-verifies INV-5 (display=client, delivery=sandbox-test); Ben click-tests.
```

---

→ qa-agent `/review-gate` prompt-mode. On PASS: fork-deploy → deploy D2+D2.1 together → Ben click-tests the full confirmed model (two-dropdown Previewer placement + client-default recipient).
