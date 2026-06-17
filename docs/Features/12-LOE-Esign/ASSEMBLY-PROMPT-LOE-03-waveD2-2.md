---
id: assembly-prompt-loe-03-waveD2-2
title: "Assembly Prompt — LOE-03 WAVE D2.2 (3 polish items from Ben's D2 click-test: dropdown naming · ribbon crowding · surface Edit/Save-version) → react fork"
date: 2026-06-17
type: assembly-prompt
prd: PRD-APR-LOE-03
wave: D2.2 (polish, from Ben's D2 click-test — land before the full click-test; deploy D2+D2.1+D2.2 together)
status: for-prompt-gate (qa-agent /review-gate prompt-mode) → fork-deploy → deploy bundle → Ben click-test
---

# Assembly Prompt — LOE-03 Wave D2.2 (Ben click-test polish)

> Vehicle = Mode B-2 fork (`subagent_type: "fork"`; Step 0 bash-loads react-specialist). 3 polish items from Ben's D2 click-test. All UI polish / reachability — NO new capability. ⚑ Item 3 is REACHABILITY (the editor already exists from Wave C), NOT a rebuild.

## The prompt (paste to the fork)

```
You are the React builder for APR Dashboard v3, Wave D2.2 of PRD-APR-LOE-03 — 3 polish items from Ben's click-test of the Previewer two-dropdown. You are a FORK — you inherit co-architect's full context (PRD, D2 acd53f8, D2.1). Build ONLY these 3; all polish/reachability, no new capability.

STEP 0: bash ~/.claude/skills/load-persona-skills/load-persona-skills.sh react-specialist · load /cli-agent-all /build-discipline /search-tools · Read ~/Development/APR-Dashboard-v3/CLAUDE.md (🚫 NO-LOGIN) · run /search-2phase scoped "LOE-03 LOEPreviewModal Document Email dropdown labels header action buttons row EmailComposeModal viewMode Edit Save as version".
BUILD-DISCIPLINE pre-flight (load for real): brainstorming · pre-change-audit (inventory: the Previewer header dropdown labels + the action-buttons row [crowding]; EmailComposeModal's existing preview-first viewMode + Edit + Save-draft + Save-as-version from Wave C/Task 5 — item 3 SURFACES these, does not rebuild) · systematic-debugging · verification-before-completion.

THE WORK (3 items):
1. DROPDOWN NAMING — make the two Previewer dropdown labels PARALLEL + SHORT. Today: "Document Templates" + (the new) email one, inconsistent + long. FIX: drop the word "Template(s)" — label them just "Document" + "Email" (parallel, short). (Or a single shared "Templates" header over the pair — pick the cleaner; default to just "Document" + "Email".)
2. RIBBON CROWDING — adding the email dropdown pushed the action buttons (View in Valcre / ClickUp / Create Document/Email) off to the right on page-resize. FIX: the shorter labels from #1 reclaim the width; confirm the action buttons fit again at normal widths (no overflow/push-off). This is mostly a consequence of #1 — verify it's resolved.
3. SURFACE EDIT / SAVE-AS-VERSION (reachability, NOT a rebuild) — when you pick an email from the Email dropdown, the EmailComposeModal opens preview-first; its Edit + "Save as version" capability ALREADY EXISTS (Wave C/Task 5) but isn't obvious/reachable from this path (likely off-screen from #2 crowding or not surfaced). FIX: make Edit + Save-as-version CLEARLY reachable/visible when an email is opened from the dropdown. ⚑ Ben does NOT want "add a brand-new template" — just EDIT the email + SAVE A NEW VERSION. Surface the existing controls; do not build new ones.

FENCES: do NOT touch the live document send / handleApproveAndSend; the recipient logic (D2.1); report-builder/Slice-4b; RLS; migration-history. No new template-creation flow.

VERIFY (CODE/LOGIC only — NO screenshots/app-walk/login; Ben click-tests the visual):
- Dropdown labels are short + parallel ("Document" + "Email" or the shared-header variant).
- The action-buttons row no longer overflows/pushes off (shorter labels reclaim width) — confirm in the layout code.
- Picking an email → the composer's Edit + Save-as-version controls are reachable/visible (confirm they're wired to the existing Wave C viewMode/Save-as-version, not newly built).
- tsc --noEmit clean · drift green (V3 untouched) · checkpoint as react-specialist.

WORKER DOCTRINE: no AskUserQuestion/menus — pick + "proceeding"; "STUCK: <q>" if blocked. No screenshots/app-driving/login. Push DONE to dev-1 with evidence. Co-arch verifies; QA build-verifies (labels short+parallel, no overflow, Edit/Save-version reachable wired-not-rebuilt); Ben click-tests the full clean model.
```

---

→ qa-agent `/review-gate` prompt-mode. On PASS: fork-deploy → deploy D2+D2.1+D2.2 together → Ben click-tests the FULL clean model (two-dropdown Previewer + short labels + uncrowded ribbon + client-default recipient + reachable edit/save-version).
