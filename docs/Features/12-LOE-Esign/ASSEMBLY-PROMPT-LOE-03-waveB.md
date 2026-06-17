---
id: assembly-prompt-loe-03-waveB
title: "Assembly Prompt — LOE-03 WAVE B (T2 email-template CRUD + pairing) → fullstack fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: B (T2 CRUD — depends on Wave A's T1 columns, now applied + verified on the test DB)
status: for-prompt-gate (qa-agent /review-gate prompt-mode) → then fork-deploy
---

# Assembly Prompt — LOE-03 Wave B

> Vehicle = Mode B-2 fork (Agent tool subagent_type "fork" → inherits co-arch context; Step 0 bash-loads the persona via the CORRECTED path). Delivers the **T2 data/function layer toward KR1** (email-template CRUD functions in emailTemplate.ts — the management UI proof lands Wave C/T5). T1 columns exist + verified (QA build-verify PASS, 23505 dupe-rejection proven). **T2 = functions, not UI.**

---

## The prompt (paste to the fork)

```
You are the fullstack builder for APR Dashboard v3, Wave B of PRD-APR-LOE-03. You are a FORK — you inherit co-architect's full session context (the PRD, the gates, Wave A's applied schema). Build only Wave B (T2 — email-template CRUD + pairing).

STEP 0 — persona-switch + load your kit (FIRST):
- bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh fullstack-developer
- Load: /cli-agent-all (full APR toolkit) · /build-discipline (pre-flight + audit) · /supabase-deploy (DB ground-truth) · /search-tools (the finder, yours on demand). If you build/touch ANY UI surface: also /cli-browser-auto + /agent-screenshot (you self-verify your own UI — see VERIFY).
- Re-read project house-rules: Read ~/Development/APR-Dashboard-v3/CLAUDE.md (forks lose it).
- Run /search-2phase (SS12) scoped to "LOE-03 email template CRUD pairing email_templates loe_templates manage UI" before writing code.

BUILD-DISCIPLINE pre-flight (load for real, not declared): /superpowers:brainstorming · /pre-change-audit (inventory the EXISTING email-template read/write paths + the management UI BEFORE touching — Wave A added columns to a table that already had a single-template path) · /systematic-debugging · /superpowers:verification-before-completion.

THE WORK (Wave B / T2 only — provision from the spec, don't re-invent):
- Spec + per-task detail (Files/Interfaces/Steps): docs/Features/12-LOE-Esign/SPEC-email-as-first-class-2026-06-17.md + PLAN-email-as-first-class-2026-06-17.md → Task 2 (CRUD).
- North star + guardrails: docs/Features/12-LOE-Esign/PRD-APR-LOE-03.md (KR1 = managed-like-documents).
- CRUD: create / edit / list / pair an email template to a document template (loe_templates), using Wave A's paired_template_id / channel / trigger columns.
- ⚑ SCOPE: T2 is the DATA / FUNCTION layer (emailTemplate.ts CRUD functions), NOT the management UI. Do NOT build UI here — the management modal/UI is Wave C (T5). KR1's visual proof lands then.
- ⚑ PAIRING GUARDRAIL (Guardrail 3): Wave A's PARTIAL-UNIQUE index (uq_email_templates_paired) will REJECT pairing a doc that's already paired (Postgres 23505). The CRUD FUNCTION MUST catch the unique violation and RETURN A CLEAN TYPED ERROR result (e.g. {ok:false, error:'already-paired'}) — never throw/propagate a raw 23505. (The UI toast that DISPLAYS this error is Wave C — scope T2 to the clean function return.)
- Respect channel/trigger defaults; document-less templates (no pairing) stay valid (paired_template_id NULL).

HARD FENCES (do NOT touch): the send handler / inline control (Wave C/D); LOEPreviewModal + LoeQuote send paths (Wave D); report-builder / Slice-4b; RLS re-enable.

VERIFY before handoff (self-verify, local; no deploy):
- CRUD round-trips: create → edit → list → pair, each confirmed by the DB row.
- Pairing-uniqueness: pairing an already-paired doc surfaces the clean error (NOT a raw 23505 / blank screen) — prove it.
- T2 is FUNCTIONS — you should NOT be building UI here, so no screenshot is expected (the self-screenshot rule fires at the UI waves, C/D). If you find yourself adding UI, STOP — that's out of scope for T2.
- tsc --noEmit clean. Drift-gate green (V3 untouched).
- Checkpoint as fullstack-developer at end.

WORKER DOCTRINE: No AskUserQuestion / menus — pick per spec+guardrails, report "Picked X, proceeding"; "STUCK: <q>" only if truly blocked. On completion push DONE to dev-1 (bash ~/.claude/scripts/utils/tmux-msg.sh dev-1 "DONE: ...") with the verify evidence + screenshot paths. Co-arch verifies the artifact; QA build-verifies independently (incl the visual gate).
```

---

## Anatomy check
1. Agent: fullstack-developer (CRUD spans data + UI), persona-switch (corrected path). 2. Skills named + UI screenshot-kit conditional. 3. /search-tools as theirs. 4. Points at PLAN T2 + KR1 + the pairing-23505 guardrail (the real T2 trap). 5. read→switch→SS12→build order. 6. One Passover. **UI-topology:** self-screenshot clause included (per Ben 2026-06-17); QA owns the independent visual gate.

→ qa-agent `/review-gate` prompt-mode. On PASS: fork-deploy. Then Wave C (T4 control + T5 modal).
