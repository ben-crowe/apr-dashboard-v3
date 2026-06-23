---
content_type: run-plan
title: APR V3 — Client-Ready End-to-End Run Plan (the orchestration walk)
status: DRAFT — co-arch authoring (Phase 1 the walk); qa spot-checking tool-interactions in parallel; plan-critic poke BEFORE deploy
created: 2026-06-22
owner: co-architect (authors/maintains the walk) · qa-agent (spot-checks + gates + verifies) · Ben (direction + the human-needed legs)
wraps: ~/Development/APR-Dashboard-v3/tests/E2E-TEST-PRD-FULL-LOOP.md
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, v3, e2e, client-ready, plan-delegate-watch, run-plan]
---

# APR V3 — Client-Ready End-to-End Run Plan

> **The goal (Ben, 2026-06-22):** APR **V3** (not V4) working full client end-to-end so his **client can use it NOW**. This is the first REAL application of the [Plan · Delegate · Watch doctrine](~/Development/00-Systems-Management/Orchestration-System/PLAN-DELEGATE-WATCH-DOCTRINE.md) + the plan-critic hole-poke.

> **This is the ORCHESTRATION LAYER, not a new runbook.** The leg mechanics + 3 run-histories live in [E2E-TEST-PRD-FULL-LOOP.md](~/Development/APR-Dashboard-v3/tests/E2E-TEST-PRD-FULL-LOOP.md). This doc adds what that lacks: **which agent owns each leg, the UNFAKEABLE finish-line, the proof, and where the plan-critic pokes** — so we can deploy a looped team and watch.

---

## Ground truth we're building on (from runbook runs 1–3, NOT hope)

- **DRIVE ON LOCALHOST DEV (:8086) VIA THE APP'S OWN "Fill with Test Data" + "Create Valcre Job" BUTTONS.** Hosted Vercel has NO test buttons; hand-filling the React form is the FORBIDDEN path and the exact source of the dropdown desync we fought. Lesson locked run 3.
- **The drivable spine already PASSES via the button path:** Leg 1 intake, Leg 2 LOE fill, Leg 3 Valcre create (VAL261057, full field map), Leg 5 ClickUp sync, Leg 6 send+delivery.
- **3 REAL BUGS run 3 surfaced that block actual client use — these are Phase A's fix-list:**
  1. **"Create Valcre Job" gives no success feedback** — a post-create LOE-detail save throws empty-string-date Postgres `22007`, blocking the "View in Valcre" flip. (Valcre job itself is fine; the UX + the LOE-detail row are not.)
  2. **ClickUp update on create fails "Failed to fetch"** (CORS/edge path) from the dev origin.
  3. **Double-click on "Create Valcre Job" creates 2 jobs** — no in-flight disable.
- **Genuinely human-needed (not agent-drivable):** 6c sign-as-signer (no programmatic complete endpoint → Codex computer-use), Leg 7 folders (Entra/Graph app unbuilt), Leg 8 QuickBooks (no Intuit sandbox account), and Valcre VISUAL verify (Ben keeps a logged-in Valcre tab).
- **Email verify path is EPA BC-Support CLI** on bc@crowestudio.com (the old gmail/EPA OAuth note is stale — EPA is the live path).

### ⚑ GROUNDED PHASE-A TARGETS (qa spot-check 2026-06-22 — what the team actually fixes, in order)

qa de-risked to the handoff point and grounded the real state. Phase A's fix-list, **sequenced first-leg-first**:

- **TARGET 0 — CONFIRMED BROKEN (wf-bugstatus fork 2026-06-22), THE gating blocker, fix FIRST: intake SUBMIT → `job_submissions` persistence.** Button-fill works (all fields+dropdowns populate, console confirms autofill) — but **SUBMIT fails SILENTLY: `job_submissions` count 7→7, NO console error, NO validation error, and crucially NO NETWORK POST captured** — the submit isn't even POSTing. Repeated hosted AND localhost, multiple attempts, same null. (Latest existing row has empty client fields = the prior persist-empty artifact.) **DIAGNOSIS:** "no POST" ⇒ client-side validation silently blocking on an unflagged field (a dropdown / required-doc below the fold) OR the submit handler isn't firing / errors swallowed. **ROOT-CAUSE FILE for the team:** `src/components/SubmissionForm.tsx` (submit handler + its validation schema). **Likely ONE root cause gating everything** (resolves critic-target #2: REAL, not an env artifact; one cause, not many). Evidence: `/tmp/apr-spotcheck/`.
- **TARGETS 1–3 (the run-3 bugs) are GATED BEHIND TARGET-0 — confirmed untestable until it lands:** (1) empty-date `22007` + "View in Valcre" no-flip — **BLOCKED:** can't reach Create-Valcre without a fresh persisting job; (2) ClickUp "Failed to fetch" — **NOT OBSERVED on load:** its real trigger is a field-change SYNC, not yet fired; (3) double-click → double-job — **BLOCKED:** same gate. They're downstream of the create-flow, which needs a fresh job, which needs TARGET-0.
- **⚑ PARALLELIZATION WRINKLE — RESOLVED (qa DB check 2026-06-22), the two-track plan HOLDS.** VAL261101 is LOE-signed (no Create-Valcre button), BUT the DB has **6 pre-create `job_submissions` rows (`valcre_job_id IS NULL`)** + 1 with-Valcre (=VAL261101). So a pre-create fixture EXISTS. **Track-2 pin = "Riverside Commerce Centre"** (client Sarah, `id b8d6468f`, 2026-06-16, has property_name + client name, `valcre_job_id` NULL) — it should show the "Create Valcre Job" button → exercises bugs (1) `22007`/View-in-Valcre + (3) double-job + (2) ClickUp sync, IN PARALLEL while Track 1 root-causes LEG-1/SubmissionForm. (Skip the 2 empty-client rows = persist-empty artifacts.) **THE TWO TRACKS: Track 1 = root-cause LEG-1 submit (`SubmissionForm.tsx`); Track 2 = pin Riverside Commerce Centre, test the 3 gated bugs.** (The plan-critic still assesses this independently — if it finds a problem with the Riverside fixture, that's a real catch.)
- **Button-fill itself = SOLID, not a target** (Ben: assumed-working; qa confirmed dropdowns stick). The agent-DOM hosted-desync = NOT a bug, not logged.
- **⚑ DEPENDENCY / DON'T-LET-LEG-1-BLOCK-THE-SPINE (qa gate HOLE 1):** legs 2–6 ASSUME a submission exists. If TARGET-0 is a deep handler bug, the spine would stall at leg 1. So **legs 2–6 run against the PINNED existing job VAL261101 IN PARALLEL** with the TARGET-0 root-cause fix; the fresh-submission path re-validates once TARGET-0 lands. Two tracks, not one blocking chain (the runbook's no-stopping rule, applied to the deploy).

---

## 🛑 PLAN-CRITIC RESULT 2026-06-22 = NEEDS-PATCH — DO NOT DEPLOY until the 4 must-fixes clear

An independent adversarial critic red-teamed this plan against the live code + DB and found the gating premise is shaky. **The doctrine worked: this caught a wasteful/harmful deploy before it happened.** Must-fixes:

1. **TARGET-0 = RESOLVED, almost certainly NOT A REAL BUG (qa code-grounded verdict 2026-06-22).** Reading the actual files settled it — a THIRD answer neither the fork nor the critic nailed: `handleSubmit` (`useFormSubmission.ts:101-286`) is CORRECT — `validateForm` → on error `toast.error` + RETURN (no insert); else inserts a FULLY-MAPPED row. There is **NO empty-insert code path.** `validateForm` (`validation.ts:48`) requires 6 fields (name/phone-regex/email/address/type); `testDataGenerator.ts` produces all 6 valid → the button-fill SHOULD pass → POPULATED insert. So the fork's "no new row" = its **agent-browser SUBMIT CLICK not firing React onClick** (automation artifact, same class as the dropdown desync), NOT a handler bug. The critic's "submit posted empty + ran ClickUp" rests on a STALE code model: validation blocks empty inserts, AND **intake submit no longer creates ClickUp at all** (`useFormSubmission.ts:263` "REMOVED: Automatic ClickUp task creation") — so the empty rows' `clickup_task_id` came from ELSEWHERE (dashboard/legacy), not this handler. Good challenge, wrong mechanism. **DEFINITIVE CONFIRM (1 step, doubles as the demo): a single COMPUTER-USE real-click submit on localhost → should land a POPULATED row. If it does, TARGET-0 DISSOLVES.** → **PLAN PIVOT: drop the SubmissionForm root-cause track; the create-stage bugs become the real Phase-A work.**
2. **Wrong root-cause file (HIGH).** `SubmissionForm.tsx` is a 114-line presentational wrapper — neither handler nor schema. Real handler = `src/components/submission-form/useFormSubmission.ts:101` (`handleSubmit`); validation = `src/utils/validation.ts:48` (`validateForm`). Repoint.
3. **`.env` Supabase trap (HIGH).** `.env` → local `127.0.0.1:54321` (DOWN, curl 000); `.env.local` → prod. A dev app that picks up the local URL gets a dead DB → silent no-persist with NO error = EXACTLY the "TARGET-0" symptom. → Confirm which Supabase the dev app actually hits before diagnosing anything.
4. **Prod-pollution: NO test-flag column EXISTS (HIGH).** The HOLE-3 guardrail assumed a test-flag mechanism — there isn't one (no `is_test`/`environment` in schema; prod dashboard has no test filter). So every fresh submit lands in the client's live list. → **Forbid ANY new `insert`; restrict the run to MODIFYING existing pinned rows** (create-stage fixture = VAL261065/VAL261062, `valcre_job_id` null; downstream = VAL261101), OR add a real test-flag column + dashboard filter first.

Other holes folded: bug-3 already has `disabled={isCreatingJob}` (LoeQuoteSection ~1413) → the real fix is a ref-lock for the sub-commit race, not a missing disable; Leg-3 readback anchors on `job_number` (VAL2610xx) NOT `valcre_job_id` (which is null on real rows); Leg-1 finish-line must assert specific fields non-empty (a "new row" can be empty); "client can use it NOW" = **Phase A ONLY** (Phase B sign/folders/QB are gated on infra that doesn't exist — don't claim them as now-ready).

**NEXT (re-sequenced after the resolution):**
1. **Team's FIRST act = ONE computer-use real-click submit on localhost** → confirms TARGET-0 dissolves AND IS the demo-walkthrough proof artifact (kills two birds). This is the ONE deliberate exception to the no-new-inserts guardrail — a single named/deletable test row (Ben deletes after); it has to create one row to prove submit works. If it lands POPULATED → TARGET-0 gone, drop the SubmissionForm track.
2. **Then the create-stage bugs become Phase A** (on a valcre-null pinned job VAL261065/VAL261062, NOT VAL261101 which is signed): bug-1 `22007`/View-in-Valcre, bug-2 ClickUp sync "Failed to fetch" (fire the field-change sync), bug-3 double-job (real fix = a synchronous ref-lock in `handleCreateValcreJob`, NOT the `disabled` prop which already exists at `LoeQuoteSection ~1413`).
3. **Guardrails locked:** no NEW inserts beyond the single confirm-submit (HOLE-7 — no test-flag column exists); HOLE-3 resolved (qa console: dev hits PROD Supabase `ngovnamnjmexdpjtcnky`, MODE development — dead-local-DB cause is OUT); Leg-3 readback anchors on `job_number`, not `valcre_job_id`.
4. **Then deploy the looped team + watch + cold-auditor close.** We did NOT deploy a team to chase a phantom bug in the wrong file — the red-team + the code-grounded reconciliation caught it first.

---

## ⭐ TWO DIFFERENT JOBS — test the workflow vs prove it works (Ben, 2026-06-22)

Don't conflate these — they use different tools on purpose:

| Job | Tool | Why |
|---|---|---|
| **TEST the workflow** (the hard part = the real subject) | the **"Fill with Test Data" button** on localhost :8086 | Data entry is ASSUMED working — the button's whole job is to make field/dropdown entry a SOLVED non-issue so we get straight to testing the PIPELINE (submission → job → LOE → ClickUp → Valcre → email → sign). The real bugs live in the WORKFLOW, not the fields. |
| **PROVE it works** (to Ben / the client — the demo) | a **human-paced field-by-field walkthrough via COMPUTER-USE** (real OS clicks) | An instant button-fill is unconvincing ("what just happened?"); watching every field, dropdown, and checkbox filled one at a time reads as "great, it works." MUST be real clicks (computer-use), NOT agent-browser DOM-injection — DOM-injection is the ONE method that desyncs (agent sets dropdown value, React onChange never fires → silent no-submit; a real human/computer-use never hits it). |

> **The desync is an agent-automation artifact, NOT a form bug — never log it as one.** qa proved it live 2026-06-22: agent-browser hand-fill of the hosted form (text + dropdowns visually stuck) submitted ZERO rows, no error — because DOM-set values don't fire React onChange. A real human, or computer-use real-clicking, submits fine.

## The phasing (3 phases, smallest-valuable-first)

**PHASE A — the DRIVABLE SPINE, clean enough for a real client** (legs 1·2·3·5·6-send + the 3 bug-fixes). This IS the deliverable: a client submits → job is created → LOE generates → ClickUp reflects it → email goes out, with no broken UX. Fully agent-drivable on localhost today.

**PHASE B — the HUMAN-NEEDED legs** (6c sign · 7 folders · 8 QuickBooks). One Ben+Codex setup sitting unblocks all three; runs in PARALLEL, never blocks Phase A.

**PHASE C — DEEPER PROOF** (qa's adds): bidirectional field-change (dashboard → ClickUp AND Valcre) + Valcre VISUAL verify via computer-use on Ben's logged-in tab. Hardens "it really works," beyond API readback.

---

## THE WALK — every leg, every agent's job, the finish-line

> Finish-line rule (from the doctrine): a walk-away leg needs an **UNFAKEABLE** finish; a watched leg can be looser because the watcher is the stop. Golden rule everywhere: **HTTP 200 ≠ success → readback.** Pinned job VAL261101; BC test ClickUp list `901709622357` ONLY (never prod `901402094744`); Resend sandbox; no-login-on-app.

> **⚑ SHARED-DB GUARDRAIL (qa gate HOLE 3 — critical now the client is about to use prod).** The team writes REAL rows to the SHARED Supabase (`job_submissions` + Valcre + ClickUp), and the Master Dashboard warns **local DB writes are NOT isolated — they appear to the deployed/prod app too.** So: **every test row the run creates must be test-flagged / inactive / non-default** so the client's prod view never surfaces a test job mid-run. Prefer modifying the pinned VAL261101 over spawning new rows; any new job is named/flagged as test and Ben deletes test jobs after. Never write to the client's prod ClickUp list.

### PHASE A — drivable spine

| Leg | Owner agent | Action | UNFAKEABLE finish-line (the proof) |
|---|---|---|---|
| **1 · Intake** | builder fork (drives app) | localhost :8086 → click "Fill with Test Data" → submit | a NEW `job_submissions` row with EVERY field landed (field-by-field vs the dashboard Client section) — not a 200, the ROW |
| **2 · LOE fill** | builder fork | click section fill; let cascade derive | every LOE field populated; cascade-derived fields (Value Scenarios/Approaches/Rights) COMPUTED from source, not hand-jammed; zero blank required |
| **3 · Valcre create** | builder fork | click "Create Valcre Job" (single click — see bug #3) | a real Valcre job number + GetValues readback showing Name/Fee/Purposes/RequestedValues populated (the button path, not raw API) |
| **3-fix · the 3 bugs** | builder fork (fix) → qa verify | fix empty-date `22007`, ClickUp failed-to-fetch, double-click double-job | bug 1: "View in Valcre" flips + LOE-detail row saves; bug 2: ClickUp update returns clean; bug 3: second click is disabled in-flight (ONE job) |
| **5 · ClickUp sync** | builder fork | confirm task on test list `901709622357` | every `buildHubCustomFields` field readback-verified in the correct NATIVE custom field; sync-on-change fires |
| **6a · Send LOE** | builder fork | send LOE to bc@crowestudio.com | Resend `last_event=delivered` |
| **6-verify · inbox** | verifier agent (EPA CLI) | read bc@crowestudio.com inbox | the actual LOE email present in the inbox (EPA BC-Support CLI — NOT the stale gmail path) |

### PHASE B — human-needed (parallel; flag, don't block)

| Leg | Owner | What's needed | Finish-line |
|---|---|---|---|
| **6c · Sign** | Codex (computer-use) + Ben | no programmatic sign-as-signer → portal click | DocuSeal `signed_at` set + `signed_document_url`; webhook fires |
| **6d · Triggers** | qa verify | post-sign | ClickUp status flips (Received→LOE Sent→LOE Signed) + Supabase signed-date confirmed |
| **7 · Folders** | Codex + Ben (Global Admin) | Entra app + Graph `Sites.ReadWrite.All`; folder spec is LOCKED | parent `{JOB#} - {Property…}` + the 5 subfolders created at intake; signed LOE lands in `4. CLIENT BILLING` |
| **8 · QuickBooks** | Codex + Ben | free Intuit sandbox app + OAuth | sandbox Customer+Invoice from signed-LOE data → record payment flips Paid → 2 triggers fire (SANDBOX only, never live money) |

### PHASE C — deeper proof (qa's adds)

| Leg | Owner | Action | Finish-line |
|---|---|---|---|
| **C1 · Bidirectional sync** | builder fork → qa verify | change a field on the dashboard for VAL261101 | the change appears in BOTH ClickUp AND Valcre (readback both) |
| **C2 · Valcre visual** | verifier (computer-use) + Ben's logged-in tab | open the Valcre job in Ben's tab, screenshot | the field values VISIBLE in the Valcre UI match the dashboard — visual proof, not just API readback |

---

## Where the PLAN-CRITIC pokes (red-team BEFORE we deploy)

Hand this plan to a critic agent in plan-mode to try to break it. Known soft spots to aim it at:
1. **The localhost-only button dependency** — the whole spine assumes :8086 dev with buttons. Is the team going to accidentally drive hosted (no buttons) and fall back to the forbidden hand-fill again? (Run 1+2's failure.)
2. **The 3 bugs as a hidden gate** — does fixing bug #1 (empty-date `22007`) cascade into the LOE-detail save / ClickUp paths? Is it really 3 independent fixes or one root cause?
3. **Test-data realism** — the button fills fixed/semi-random values that ignore the cascade; is that good enough to call the client journey "proven," or do we need a coherent realistic fixture first?
4. **Bidirectional assumption (C1)** — we've proven dashboard→Valcre and dashboard→ClickUp; is the REVERSE (or even same-direction on-change) actually wired, or are we assuming it?
5. **"Client can use it NOW" scope — RESOLVED 2026-06-22, re-aim the critic.** The original worry (does the real hosted form work without the test button?) is settled: the hosted-form data-entry layer is NOT the hard part and is assumed working (the button exists to make it a non-issue). qa proved the only "failure" — an agent hand-filling the hosted form and getting a silent no-submit — is the **agent-DOM desync artifact, NOT a form bug** (a real human / computer-use submits fine). So the critic should NOT aim at data-entry. **Re-aimed critic targets = the WORKFLOW (the real test subject):** (a) does the button-path submit create a clean job with the 3 run-3 bugs FIXED (empty-date `22007` + "View in Valcre" flip, ClickUp "Failed to fetch", double-job)? (b) do the downstream legs (LOE → ClickUp → Valcre → email → sign) hold under a real run? (c) is the human-needed cluster (sign / folders / QuickBooks) genuinely unblockable in one Ben+Codex sitting, or are there hidden dependencies?

---

## Run protocol (plan → delegate → watch → audit)

1. **co-arch** finalizes this walk with qa's spot-check feedback (what's tool-proven vs needs-Ben).
2. **plan-critic** (agent, plan-mode) pokes holes — especially #5 above — we patch.
3. **deploy a looped team** (builder fork drives the spine + fixes; verifier confirms; qa gates) with a finish-line + an **explicit cap (qa gate HOLE 2 — doctrine: a looped team can't spin).** Per-leg cap = **3 root-cause/fix attempts → ESCALATE to co-arch**, don't loop forever. **"What blocked looks like" (the escalation signal):** the leg's UNFAKEABLE finish-line is still false after 3 attempts AND the agent can name the specific wall (missing endpoint, an unresolved error, a dependency it can't satisfy). On escalate: the agent posts `BLOCKED: <leg> — <the wall> — tried <X,Y,Z>` to co-arch and moves to the next parallel leg (never halts the whole run). TARGET-0 especially gets the cap — a deep submit-handler bug must escalate, not grind.
4. **co-arch + qa WATCH** from the back — interject on a wall, verify the ARTIFACT not the "done," better the agents/skills as they fumble.
5. **cold auditor** reviews the run; fold findings.

---

*Authored 2026-06-22 by co-architect as the Plan·Delegate·Watch application of the existing full-loop runbook. qa-agent spot-checks the risky tool-interactions in parallel + gates this walk. Surfaced from the APR Master Dashboard.*
