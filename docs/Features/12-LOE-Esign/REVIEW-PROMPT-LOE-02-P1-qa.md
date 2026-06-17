---
id: review-prompt-loe-02-p1-qa
title: "review-gate (PROMPT mode) — Part-1 builder Assembly Prompt"
date: 2026-06-15
type: prompt-review
reviewer: qa-agent
gate: review-gate / prompt-review (mode 2)
target: ~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/ASSEMBLY-PROMPT-LOE-02-P1.md
verdict: PASS pending 3 folds (1 load-bearing, 2 minor)
tags: [review-gate, prompt-review, loe, assembly-prompt, react-specialist]
---

# review-gate PROMPT review — LOE-02 Part 1 builder

**Verdict: PASS pending 3 folds.** Strong prompt — clears every mode-2 criterion: names the builder
(forked persona-switch → react-specialist), the exact skills to activate (with "evidence of
invocation, not just loaded"), the authoritative spec, the testable proof (content-diff + reopen +
contact-lock + tsc), the browser-tool category (cli-browser-auto/agent-browser, port 8086 anon, NOT
Playwright, search-first), and the start order naming the **conductor** (`/search-2phase`), not the
two raw legs. Three things to fold before deploy.

## Folds

### 1. The builder's SELF-VERIFY must run AS the anon app identity — `load-bearing`
- **The hole:** Step 4.1 says "create v1–v4 … query `job_contracts` → distinct rows" but never says
  to do it **through the running app as anon**. The RLS fence (Item 2) is a *verify-it's-visible*
  bullet, not a *verify-AS-anon* instruction.
- **Why it bites:** this is the exact PRD-LOE-01 silent-RLS failure this spec carries a fence for — a
  save that's denied under anon but reports success, invisible to a logged-in/service-role self-check.
  If the builder creates + queries the rows via a service-role/console path, its OWN self-verify
  passes while the anon app persists nothing. QA build-verify (me, as anon) would catch it later — but
  that's a wasted round, and the whole lesson is that the self-verify must run as the real runtime
  identity or it false-passes.
- **Fix:** Step 4.1 — perform the save (Create Contract → Save Draft) **through the running app as
  the anon identity**, and confirm the rows landed via the anon path, not service-role. State it
  plainly; it's the one lesson that keeps recurring.

### 2. Missing the worker "no multi-choice to dispatcher" line — `worker-doctrine`
- **The hole:** the fork is a worker reporting to co-arch, but the brief never forbids
  `AskUserQuestion`/multi-choice menus. The CONSTRAINTS "KEEP GOING / only stop if you'd CHANGE the
  design" is close but not the explicit rule.
- **Why it bites:** a worker that fires a choice menu blocks its own pane and dumps the menu into
  co-arch's chat (worse when Ben's also typing). Locked doctrine (tmux-comms).
- **Fix:** add the line — "Do NOT use AskUserQuestion or multi-choice menus. Pick the best option per
  the spec + Iron Laws, report 'Picked Option N. Reason: <one line>. Proceeding.' If genuinely stuck,
  emit plain text 'STUCK: <question>' — no menu."

### 3. Item 3 rename — scope to user-facing STRINGS only — `scope fence (minor)`
- **The hole:** Item 3 renames "Edit Template" → "Edit Document" and cites `LOEPreviewModal.tsx:408` /
  `TemplateEditorModal.tsx:329`. It doesn't fence the rename to the visible strings.
- **Why it bites:** a builder could over-rename — touching the `TemplateEditorModal` component name /
  identifiers / file — turning a label fix into a refactor with import churn. And line numbers drift.
- **Fix:** state "rename the user-facing STRINGS only (button label + subtitle); leave component/file
  names and code identifiers unchanged. Find the strings by grepping the visible text, not by trusting
  the line numbers." (Also: Item 3 is new since the spec gate — fine for a cosmetic string change, but
  note it bypassed the spec gate so build-verify eyeballs it.)

## What passed
- Agent named + deploy mechanic explicit (fork, no subagent_type, persona-switch). ✓
- Exact skills + "evidence of invocation" gate. ✓
- Spec authoritative + entry files (via spec) + Step-2 search topic names the key files. ✓
- Testable proof concrete (content-diff isolates cascade-Section-10; reopen; contact-lock; tsc). ✓
- Tool reminder: agent-browser, 8086, anon, NOT Playwright, search-first. ✓
- Start order names the conductor `/search-2phase`, not the raw legs. ✓
- Hard constraints: test job + bc only, no send/sign, no Vercel, no secrets. ✓

*qa-agent · review-gate prompt-mode · fold 1 (anon self-verify) is the one that matters → then deploy
the fork.*
