# Assembly Prompt — Create-Stage Bug Fixes (builder fork brief)

> co-arch authored · qa PROMPT-GATES this before deploy · then it's handed verbatim to the forked builder. Grounded in the V3-CLIENT-READY-RUN-PLAN + the plan-critic's corrections + today's lessons.

---

## 0 — Who + load (Step 0, before anything)

You are the **apr-domain-agent builder** on the APR Dashboard v3 (React 18 + TS + Vite + Supabase + Vercel edge fns) — deployed as a fresh persona (this brief is fully self-contained; no inherited context needed). Load:
- `/cli-apr-tools` — the FULL APR toolkit (Valcre / DocuSeal / Supabase / ClickUp / intake CLIs). **Search the catalog before hand-rolling any curl** — ~90% of actions have a command.
- `/build-discipline` — the 4 iron-laws + 3 test gates + reproduce-before-fix. Non-negotiable here.
- `/cli-browser-auto` — browser driving, BUT see the ⚠ real-event rule below.
- `/supabase-deploy` — DB ground-truth (dev hits PROD Supabase `ngovnamnjmexdpjtcnky`, confirmed).
- `/search-tools` is yours whenever you don't know a command exists.
- **EXTRA-ARMS:** you're a capable agent — use forks of yourself for the OFFLOADABLE heavy lifting (big multi-file code traces, parallel per-bug reproduction reads) to keep your own thread clear. **NEVER fork the search or the judgment** (comprehension only forms in the mind that read it), and **verify any fork's artifact — never trust its "done."**

Then run `/search-2phase` (SS12) on "APR Create Valcre Job flow LoeQuoteSection handleCreateValcreJob LOE detail save 22007 ClickUp sync edge function" before touching code.

## ⚠ TWO HARD LESSONS FROM TODAY (ignore these and you'll waste the run)

1. **agent-browser fills/clicks do NOT fire React's events** — they set DOM values, React state stays empty, and submits/clicks silently no-op. This produced a full day of phantom "broken submit" debugging. **For any UI interaction that must fire React (clicking "Create Valcre Job", filling a field), use REAL-event clicking — claude-in-chrome real click / computer-use / Playwright native input setter — NEVER agent-browser DOM injection.** Better still: reproduce + verify at the CODE + DB + API level where you can, and only drive the UI when the bug is genuinely UI-gated.
2. **REPRODUCE BEFORE YOU FIX.** Each bug below may already be partly fixed or be a non-bug. For EACH: first reproduce it on the fixture; if it does NOT repro, document that and move on — do NOT "fix" a phantom (we burned hours on a non-existent bug today; don't repeat it).

## 1 — The fixture + the guardrails (READ — violating these touches the client's live data)

- **Pinned fixture = the qa-confirmed valcre-null job: "Riverside Commerce Centre"** (client Sarah, `job_submissions.id = b8d6468f`, `valcre_job_id` null → it has no Valcre job yet, so it should render the "Create Valcre Job" button). **NOT VAL261101** (LOE-signed, past this stage). (A valcre-null row may not have a VAL number yet — identify it by `id`/client/property, not a VAL#; the VAL# is what Create-Valcre RETURNS.)
- **⚑ STEP 0 — CONFIRM THE FIXTURE + SATISFY THE ENABLEMENT GATE (qa deep-probe 2026-06-22, `LoeQuoteSection.tsx:1398-1432`).** The "Create Valcre Job" button ALWAYS renders, in 3 states: (1) valcre exists → "Valcre Job: {num}" disabled; (2) `canCreateValcreJob` TRUE → **ACTIVE green "Create Valcre Job"** with `disabled={isCreatingJob}` (= bug-C's existing disable @1413); (3) `canCreateValcreJob` FALSE → DISABLED button + a tooltip listing the missing fields. ⚠ Note: a DOM/interactive read FILTERS OUT disabled buttons — "button not found" usually means it's there but DISABLED (gate unmet), not absent (another agent-browser artifact).
  - **THE GATE:** `canCreateValcreJob` (line 486) requires ALL 6 SAVED: `propertyAddress`, `propertyType`, `intendedUse`, `appraisalFee`, `scopeOfWork`, `valuationPremises`. `getMissingFieldsForValcre` (503) drives the tooltip. On the fixture these 6 APPEAR filled in the UI (4820 Macleod Trail / Industrial / First Mortgage Financing / $6,500 / Income Approach / Market Value) — but **CONFIRM they're PERSISTED (the `jobDetails` row), not just displayed**, so the ACTIVE button renders. Only then can you reproduce bugs A/C.
  - If the gate can't be satisfied on this fixture (a field won't persist), that's itself a finding → escalate; **do NOT create a new job** (no new inserts).
- **⛔ NO NEW `job_submissions` INSERTS.** There is no test-flag column in the schema, and dev writes to the client's PROD Supabase. MODIFY the pinned fixture rows only. (The one already-created test row — Laura Wright, job ref `43af0d33` — was the single deliberate exception; Ben deletes it. Do not create more.)
- **ClickUp: BC test list `901709622357` ONLY.** NEVER the client's prod list `901402094744`.
- **Golden rule: HTTP 200 ≠ success → readback.** For Valcre, read back via **`job_number` (VAL2610xx)**, NOT `valcre_job_id` (null on real rows).

## 2 — The three bugs (spec + the UNFAKEABLE finish-line each)

**Bug A — empty-date Postgres `22007` on Create-Valcre + "View in Valcre" no-flip.**
- Symptom (run 3): clicking "Create Valcre Job" creates the Valcre job fine, but a downstream **LOE-detail save throws Postgres `22007` (invalid datetime — an empty-STRING date instead of null)**, which blocks the button flipping to "View in Valcre."
- Likely root cause: a date field written as `""` instead of `null` in the post-create LOE-detail insert/update. **Bug-A surface (qa deep-probe):** the empty DATE inputs on the fixture — Retainer Paid / Signed / Effective (all `yyyy-mm-dd` blank) — are the `22007` trigger; an empty-string date from any of these is the suspect.
- **Finish-line:** reproduce the `22007` on the fixture; fix = coerce empty date → `null` at the save; then a Create-Valcre run completes with the LOE-detail row saved AND the button flips to "View in Valcre." Prove via DB readback (the LOE-detail row persists, no error) + the UI flip.

**Bug B — ClickUp update "Failed to fetch" on create (from dev origin).**
- Symptom: the ClickUp update on create fails "Failed to fetch" (CORS/edge path) from the dev origin. Critic note: NOT observed on load — the real trigger is the **field-change SYNC**, so you must fire a sync to repro.
- **Reproduce FIRST:** trigger a field-change sync on the fixture and confirm whether "Failed to fetch" actually fires (is it dev-only CORS, or a real edge-fn break?). If dev-only, document it as such (not a client-facing bug).
- **Finish-line:** a field change on the fixture syncs to the BC test ClickUp card with a clean response (readback the field landed), OR a documented finding that it's a dev-origin-only CORS artifact with the exact cause.

**Bug C — double-click "Create Valcre Job" → two jobs.**
- ⚠ Critic correction: the button **already has `disabled={isCreatingJob}` (`LoeQuoteSection` ~line 1413)** — so the missing-disable theory is WRONG. The real race is sub-commit (a double-click before React flips `isCreatingJob`).
- **Reproduce FIRST:** does it still repro despite the disable? If not, document + move on.
- **Finish-line (if it repros):** fix = a **synchronous ref-lock inside `handleCreateValcreJob`** (a `useRef` guard that flips before the async work, not the `disabled` prop). Prove: a rapid double-invoke creates exactly ONE job (readback `job_number` — one job, not two).

## 3 — Loop discipline (the cap)

Per bug: **max 3 root-cause/fix attempts → ESCALATE** to co-arch with `BLOCKED: <bug> — <the specific wall> — tried X,Y,Z`, then move to the next bug (never halt the whole run). Reproduce-first means a non-repro is a fast documented "not a bug," not an attempt.

## 4 — Close-out

- **Checkpoint AS react-specialist** at end-of-build (your work stays independently auditable).
- **Report back to co-arch** (`tmux-msg.sh dev-2`) with per-bug status: REPRODUCED+FIXED (with the DB/API proof) / NOT-A-BUG (with why) / BLOCKED (with the wall). Verify the artifact — never report "fixed" without the readback proof.
- qa verifies independently after; co-arch + qa WATCH the run; cold auditor reviews at close.

---

## Start order (literal)
1. Read this Passover. 2. Step 0 load + SS12. 3. For each bug: reproduce-first on the fixture (real-event / code+DB) → root-cause → fix → readback-verify → next. 4. Checkpoint + report per-bug status to co-arch.
