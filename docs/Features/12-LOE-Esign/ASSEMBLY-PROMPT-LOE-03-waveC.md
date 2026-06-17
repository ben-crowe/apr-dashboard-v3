---
id: assembly-prompt-loe-03-waveC
title: "Assembly Prompt — LOE-03 WAVE C (T4 SendByEmailControl + T5 EmailComposeModal) → react fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: C (T4 control + T5 modal — the FIRST UI wave; both depend on T2 functions, done+verified)
status: for-prompt-gate (qa-agent /review-gate prompt-mode — GATES FOR THE SELF-SCREENSHOT CLAUSE) → then fork-deploy
---

# Assembly Prompt — LOE-03 Wave C (first UI wave)

> Vehicle = Mode B-2 fork (Agent tool **`subagent_type: "fork"`** → inherits context; Step 0 bash-loads the **react-specialist** persona). First UI wave → **builder self-screenshots its own work; QA owns the independent visual gate** (no ui-designer passover — these MIRROR the existing EmailComposeModal + pill/LOEPreviewModal patterns, no net-new design to judge).

---

## The prompt (paste to the fork)

```
You are the React builder for APR Dashboard v3, Wave C of PRD-APR-LOE-03 (the first UI wave). You are a FORK — you inherit co-architect's full session context (the PRD, the gates, Wave A schema + Wave B functions). Build only Wave C: T4 (SendByEmailControl) + T5 (EmailComposeModal).

STEP 0 — persona-switch + load your kit (FIRST):
- bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh react-specialist
- Load: /cli-agent-all (full APR toolkit) · /build-discipline (pre-flight + audit) · /cli-browser-auto (agent-browser HEADLESS — APR on :8086, NOT 5173) · /agent-screenshot (you SELF-VERIFY your own UI — mandatory this wave) · /search-tools (the finder, yours on demand).
- Re-read project house-rules: Read ~/Development/APR-Dashboard-v3/CLAUDE.md (forks lose it).
- Run /search-2phase (SS12) scoped to "LOE-03 SendByEmailControl EmailComposeModal email template dropdown preview save-as-version pairing" before writing code.

BUILD-DISCIPLINE pre-flight (load for real): /superpowers:brainstorming · /pre-change-audit (inventory the EXISTING EmailComposeModal + the footer "Continue to Email" + the contract-pill pattern BEFORE touching — you're MODIFYING an existing modal, MIRRORING existing patterns) · /systematic-debugging · /superpowers:verification-before-completion.

THE WORK (Wave C / T4 + T5 only — provision from the spec, don't re-invent):
- Spec + per-task detail (Files/Interfaces/Steps): docs/Features/12-LOE-Esign/PLAN-email-as-first-class-2026-06-17.md → Task 4 (SendByEmailControl) + Task 5 (EmailComposeModal). PRD: docs/Features/12-LOE-Esign/PRD-APR-LOE-03.md.
- T4 — CREATE src/components/dashboard/job-details/actions/SendByEmailControl.tsx: the inline [template ▼][👁 preview][Send] row. Reusable; takes docTemplateId (string OR null = document-less), onSend(tpl), onPreview(tpl). Template dropdown sourced from Wave B's loadAllEmailTemplates. MIRROR the existing inline-control / pill styling — do not invent new visual design.
- T5 — MODIFY src/components/dashboard/job-details/actions/EmailComposeModal.tsx: preview-first, template dropdown, save-as-version with a "Pair to current document" control. When that pairing save hits Wave B's saveEmailTemplate and gets {success:false, error:'already-paired'}, DISPLAY a clean toast ("that document is already paired to an email") — this is the UI side of Guardrail 3 (the function already returns the typed error; you surface it, never a raw crash).
- Wire the data via Wave B's functions (loadAll / save / setDefault / resolveForDocument). Do NOT re-implement them.

HARD FENCES (do NOT touch / not this wave): the actual SEND firing + instance persistence + the recipient-guard (Wave D / T6+T7 — T4 only exposes the onSend callback interface; don't wire the real send here); LOEPreviewModal + LoeQuoteSection consumption (Wave D); report-builder / Slice-4b; RLS re-enable.

⭐ SELF-VERIFY WITH YOUR OWN SCREENSHOTS — MANDATORY this wave (before handoff):
- NO LOGIN NEEDED — the dashboard at :8086 renders headless ANON (verified 2026-06-17; the RLS concern is about WRITES, not page access). Drive agent-browser headless straight to the surface; do NOT attempt a login.
- ⚑ MOUNT REALITY: SendByEmailControl (T4) is CREATED this wave but its consumers (LOEPreviewModal + LoeQuoteSection) are Wave D (fenced out) — so it has NO mount point yet. Do NOT screenshot it in-situ (can't pixel-verify an unmounted component) — its visual proof DEFERS to Wave D. Just confirm it compiles + tsc-clean.
- SCREENSHOT SCOPE for Wave C = the EmailComposeModal ONLY (reachable via the still-present "Continue to Email" footer entry — Wave D removes that entry, not this wave): (a) the modal opens preview-first with the template dropdown populated; (b) the pairing control appears in save-as-version. READ THE PIXELS BACK — non-blank, controls present, not broken. Attach the shot paths.
- This is YOUR self-check; QA runs the independent visual gate on top.

ALSO VERIFY: tsc --noEmit clean. Drift-gate green (V3 untouched). Checkpoint as react-specialist at end.

WORKER DOCTRINE: No AskUserQuestion / menus — pick per spec+patterns, report "Picked X, proceeding"; "STUCK: <q>" only if truly blocked. On completion push DONE to dev-1 (bash ~/.claude/scripts/utils/tmux-msg.sh dev-1 "DONE: ...") with verify evidence + the screenshot paths. Co-arch verifies the artifact; QA build-verifies independently incl the visual gate.
```

---

## Anatomy + topology check
1. Agent: react-specialist (UI), persona-switch via corrected path + `subagent_type:"fork"`. 2. Skills named incl `/agent-screenshot` + `/cli-browser-auto` for self-verify. 3. `/search-tools` as theirs. 4. Points at PLAN T4+T5 + PRD + the Guardrail-3 UI-toast requirement + document-less null control. 5. read→switch→SS12→build order. 6. One Passover. **⭐ UI-wave self-screenshot clause PRESENT (Ben 2026-06-17 topology) — QA gates for it at prompt-gate + runs the independent visual gate; no ui-designer (mirrors existing patterns, no net-new design).**

→ qa-agent `/review-gate` prompt-mode (checks the self-screenshot clause is in). On PASS: fork-deploy. Then Wave D (T6 LOEPreview + T7 LoeQuote — wires the real send).
