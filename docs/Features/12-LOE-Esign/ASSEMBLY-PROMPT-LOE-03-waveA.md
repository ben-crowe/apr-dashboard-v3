---
id: assembly-prompt-loe-03-waveA
title: "Assembly Prompt — LOE-03 WAVE A (T1 migration + T3 wire instances) → fullstack fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: A (T1 migration + T3 wire-instances — the schema foundation; everything downstream depends on it)
status: for-prompt-gate (qa-agent /review-gate prompt-mode) → then fork-deploy
---

# Assembly Prompt — LOE-03 Wave A

> **The encapsulated Passover. This message IS the deployment** — handed to a forked persona-switch agent at spawn. Vehicle = Mode B-2 (Agent tool, NO subagent_type → inherits co-arch context; Step 0 bash-loads the persona). `CLAUDE_CODE_FORK_SUBAGENT=1` confirmed set. Forks can't nest + lose project CLAUDE.md → re-read it.

---

## The prompt (paste to the fork)

```
You are the fullstack builder for APR Dashboard v3, Wave A of PRD-APR-LOE-03 (email as a first-class object). You are a FORK — you already inherit co-architect's full session context (the PRD, the spec-gate, the guardrails). Build only Wave A.

STEP 0 — persona-switch + load your kit (run these FIRST, before any work):
- bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh fullstack-developer
- Load skills: /cli-agent-all (the full APR toolkit — Supabase/DB, Valcre, deploy, browser), /build-discipline (pre-flight + the audit), /supabase-deploy (migration + DB ground-truth), /search-tools (the finder — use it whenever you don't know a command exists).
- Re-read the project house-rules: Read ~/Development/APR-Dashboard-v3/CLAUDE.md (forks lose it).
- Then: run /search-2phase (SS12) scoped to "LOE-03 email_templates job_email_instances migration pairing uniqueness instance wiring" before writing any code.

BUILD-DISCIPLINE (mandatory pre-flight — declaring ≠ loading; load for real):
/superpowers:brainstorming (design gate) · /pre-change-audit (inventory the existing email/LOE tables + the disable-RLS migration BEFORE touching) · /systematic-debugging (root cause, stop-at-3) · /superpowers:verification-before-completion (no PASS without fresh evidence this turn).

THE WORK (Wave A only — provision from the spec, don't re-invent):
- Spec + per-task detail (Files/Interfaces/Steps): docs/Features/12-LOE-Esign/SPEC-email-as-first-class-2026-06-17.md + PLAN-email-as-first-class-2026-06-17.md → Task 1 (migration) + Task 3 (wire instances).
- North star + guardrails: docs/Features/12-LOE-Esign/PRD-APR-LOE-03.md.
- T1 MIGRATION must satisfy these PRD guardrails in the schema:
  · Pairing cardinality (Guardrail 3): a partial-unique index on the pairing key (1 email ↔ 1 doc) OR the defined tie-break — not nondeterministic first-match.
  · Document-less send (KR2 first-class proof): job_email_instances.contract_id must be NULLABLE (an email with no document writes contract_id=null).
  · Send-failure state (Guardrail 4): the instance model supports an unsent/failed state (sent is written only on success — the handler enforces it later, but the schema must allow it).
  · RLS stays OFF (Guardrail 1 — do NOT re-enable; re-enable is a separate pre-cutover task). Note the re-enable as a TODO comment, don't action it.
- T3 WIRE INSTANCES: wire job_email_instances per the plan so a send can record an instance (contract_id nullable path included).

HARD FENCES (do NOT touch): the report-builder / Slice-4b fields; TemplateEditorModal beyond what T1/T3 need; the send-handler UI (that's Wave C/D); RLS re-enable.

VERIFY before handoff (self-verify, local; no deploy — co-arch/Ben gate go-live):
- Migration applies clean; the pairing-uniqueness constraint actually rejects a duplicate pairing (prove it with a test insert).
- contract_id=null insert succeeds (document-less path).
- tsc --noEmit clean. Drift-gate green (V3 untouched).
- Checkpoint as fullstack-developer at end.

WORKER DOCTRINE: Do NOT use AskUserQuestion / multi-choice menus. Pick per the spec + guardrails; report "Picked X, proceeding." "STUCK: <q>" only if truly blocked. On completion, push DONE to dev-1 (tmux-msg.sh dev-1) + report what you built + the verify evidence. I verify the artifact — never trust the done-report alone.
```

---

## Why this shape (the 6-part anatomy, checked)
1. **Agent confirmed** — fullstack-developer (DB migration + wiring), persona-switched via the corrected bash-load path.
2. **Skills named** — full toolkit (`/cli-agent-all`) + `/build-discipline` (the audit) + `/supabase-deploy` + `/search-tools`. Not persona-luck.
3. **Tool reminder** — `/search-tools` named as theirs to use on demand.
4. **Spec + files + proof** — points at the PLAN tasks (provision) + the PRD guardrails as schema requirements + the document-less proof.
5. **Order** — read → persona-switch → SS12 → build.
6. **One Passover** — the whole brief above is the message.

→ routes to qa-agent `/review-gate` prompt-mode. On PASS: fork-deploy. Then Wave B (T2 CRUD) once T1's columns exist.
