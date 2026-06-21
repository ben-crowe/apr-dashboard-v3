---
content_type: system-status
title: APR System Status — Where We Are / Where To Continue
status: LIVE status board — open this to see the whole system at a glance, any time
created: 2026-06-11
updated: 2026-06-21
owner: co-architect (keeps current) · qa-agent (drives) · Codex (human-action legs)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, system-status, where-we-are, wire-through, e2e, dashboard]
---

# APR System Status — Where We Are

**Tags:** #system-status #where-we-are #wire-through #apr-workflow
**The one-glance board for the whole system.** Each leg = one app→app wire. Click a leg's **detail ↓** link to jump to its full definition: what "done" actually means + the evidence required. Status is honest against that stricter bar.

## Status legend
- ✅ **DONE** — data verified by readback **AND** the full evidence chain captured (both screenshots on the board).
- 🟢 **DATA-PASS** — the backend is verified, but the visual evidence chain (filled + mapped screenshots on the board) isn't locked yet. **Not "done" until the screenshots exist.**
- 🟡 **NEEDS A SETUP** — works once a one-time human/Codex action (login/account/app) lands.
- 🟠 **HAS A FIX** — runs but a real bug to fix.
- 🔴 **UNBUILT** — feature/wiring doesn't exist yet → build queue.

> **Why two "pass" levels:** a backend row is NOT proof a leg works. Proof = the input screenshot, the action (CLI), the output/mapping screenshot, all saved to the tldr board. 🟢 means the data's right but that visual chain isn't locked — so it's not green-DONE yet.

---

## ⭐ WHERE TO CONTINUE — the 3 things waiting on YOU (one Codex sitting unlocks 3 legs)
| # | Action | Unlocks | Resource (click) |
|---|---|---|---|
| 1 | **Email re-auth** — run via `!`, approve in browser | Leg 6 (open + validate the e-sign email) | [reauth_gmail.py](~/Development/02-Project-Planning/EPA%20BC-Support%20system/src/support-system/01-Label-Manager/reauth_gmail.py) |
| 2 | **Create free Intuit sandbox account** (Codex guides) | Leg 9 (QuickBooks closing) | [QB sandbox path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md) |
| 3 | **Register the SharePoint app** (you, as Global Admin; Codex guides) | Leg 8 (folders auto-create + connect button) | [SharePoint app recipe](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/SHAREPOINT-APP-SETUP-RECIPE.md) |

---

## THE PIPELINE — every leg at a glance (click "detail" for the definition)
| # | Leg (app → app) | Status | Definition + evidence |
|---|---|---|---|
| 1 | **Client Intake** (form → Supabase → dashboard) | 🟢 DATA-PASS | [detail ↓](#leg-1--client-intake) |
| 2 | **LOE Fill** (fields on dashboard) | 🟢 DATA-PASS | [detail ↓](#leg-2--loe-fill) |
| 3 | **Valcre Job** (dashboard → Valcre create) | 🟠 HAS A FIX | [detail ↓](#leg-3--valcre-job) |
| 4 | **ClickUp Card** (dashboard → ClickUp) | 🟢 DATA-PASS | [detail ↓](#leg-4--clickup-card) |
| 5 | **LOE Render** (generate the letter) | ✅ DONE | [detail ↓](#leg-5--loe-render) |
| 6 | **Email Send + Deliver** (LOE → inbox) | 🟢 / 🟡 | [detail ↓](#leg-6--email-send-and-deliver) |
| 7 | **E-Sign + Signed-Date** (sign → triggers) | 🟢 DATA-PASS | [detail ↓](#leg-7--e-sign-and-signed-date) |
| 8 | **SharePoint Folders** (job → folder set) | 🟡 / 🔴 | [detail ↓](#leg-8--sharepoint-folders) |
| 9 | **Closing / QuickBooks** (signed → invoice → paid) | 🟡 / 🔴 | [detail ↓](#leg-9--closing-and-quickbooks) |

---

## Leg-by-leg — what "DONE" means + the evidence

### Leg 1 — Client Intake
- **Done means:** the intake form is literally **filled out** (screenshot of the filled form) → **submitted via a CLI** → lands as a Supabase `job_submissions` row → **every field maps onto the dashboard Client section** (screenshot of the mapped dashboard), zero missing. **Both screenshots saved to the tldr board.**
- **Evidence chain:** `[filled-form screenshot]` → submit (intake CLI) → `job_submissions` row readback → `[dashboard-mapped screenshot]` → both on tldr node "Leg 1".
- **Current:** 🟢 DATA-PASS — row creates + fields map verified by readback (the `intended_use` dropdown-desync is FIXED). **Missing for ✅:** the clean filled-form + mapped screenshot PAIR locked on the board, and a dedicated intake-submit CLI.

### Leg 2 — LOE Fill
- **Done means:** every LOE field filled on the dashboard (learned each + the Test Data button), cascade-derived fields (Value Scenarios/Approaches/Property Rights) **compute from their source** (not hand-jammed), **screenshot of the filled LOE section on the board.**
- **Evidence chain:** `[filled LOE section screenshot]` → field readback → tldr.
- **Current:** 🟢 DATA-PASS — full field set verified on VAL261101. **Missing for ✅:** the locked filled-section screenshot on the board.

### Leg 3 — Valcre Job
- **Done means:** the dashboard creates a **new Valcre job**, and the job **in Valcre** shows property name, purposes, fee, and premises **matching the dashboard** (Valcre-side readback screenshot). On the board.
- **Evidence chain:** `[dashboard source]` → create (CLI/button) → Valcre GetValues readback → `[Valcre job screenshot]` → tldr.
- **Current:** 🟠 HAS A FIX — job creates + returns a number, but the **create-path drops fields**: property name blank ("Unnamed Property"), Purposes/RequestedValues unset, Fee=0. **Fix:** create-path mapping in `api/valcre.ts` + build a valcre-create CLI. (The UPDATE path is clean — that's Leg-3-adjacent and proven.)
- **Readback 2026-06-21 (qa, `valcre-get-job-by-number VAL261065`):** the job in Valcre shows property name (Riverside Commerce Centre), type (Industrial), address, Fee 6500, Retainer 1500, bid/due dates, client + property contact — all populated. Confirms the **data CAN land**, but does NOT clear the create-path bug (this job's state may reflect the clean UPDATE path, not a fresh create). **Create-path fix stays open.** Also found: `valcre-field-audit.sh` silently dies under Python 3.14 (tooling bug, data unaffected).

### Leg 4 — ClickUp Card (the team's NEW-JOB NOTIFICATION)
- **THE GOAL (corrected 2026-06-11):** form submission **auto-creates the ClickUp task** as part of the chain (submit → Supabase → dashboard job → **ClickUp task**). The ClickUp task IS how the team learns a new job came in — **they live in ClickUp, not the APR dashboard.** The task carries the real data because it flowed through the pipeline into it. The old "human opens the APR dashboard and clicks Create ClickUp Task" is **DEPRECATED — dead pattern, out of vocabulary.**
- **Done means:** on submit, a ClickUp task **auto-appears** in the team's ClickUp with every field populated correctly (GET readback) AND the card visually correct (screenshot). On the board.
- **Evidence chain:** form submit → auto-trigger → ClickUp GET readback → `[card screenshot]` → tldr.
- **Current:** 🟠 — manual button sync verified by readback, BUT auto-create-on-submit is currently OFF → **BUILD TASK: wire submit→ClickUp auto-create in the edge function** (the notification). Plus 2 small fixes (phone→E.164, "Premise" vs "Premises" name).
- **Readback 2026-06-21 (qa, via new token-free `opencli clickup task <id>` adapter):** re-push of VAL261065 landed **22 fields, 0 failed, values correct** — and **phone→E.164 is confirmed RESOLVED** (+14035550142). The old "live card 404s with BC test token" readback blocker is **GONE** — the adapter reads the live card via the logged-in Chrome session, no `pk_` token. Independent read also caught the update fn self-reporting "15/22 verified" while all 22 actually landed (function self-check is pessimistic). **Auto-create-on-submit still OFF** (unchanged).
- **PRIORITY CALL — DECISION (Ben 2026-06-21):** **ClickUp field-completeness is DEPRIORITIZED right now — this is NOT a quality bar.** Chasing every remaining ClickUp field is low-priority at the moment; the priority is **doc accuracy + all of us knowing where things stand.** The deferred fields **still matter — just not now.** The currently-blank dropdowns — **Report Type · State of Improvements · Property Subtype** (dashboard wording ≠ ClickUp option label → silent skip) — are **deferred to the Valta client-ClickUp setup**, not abandoned. Manual team/ops fields (Work Phase, Phase Owner, Invoice Paid, TTSZ Done, Template/Photos Saved, Comps Provided, Task Type, Client Info Received) are **correctly empty by design** (hand-filled in ClickUp). Recorded so the deferral isn't forgotten and isn't mistaken for a permanent standard.

### Leg 5 — LOE Render
- **Done means:** the LOE renders as a real **PDF**, passes the **full coverage gate** (Schedule A correct single/multi, §10 scenarios match status, zero token leaks), and the rendered letter is captured. On the board.
- **Evidence chain:** render over http → PDF → coverage-gate checks → `[LOE PDF screenshot]` → tldr.
- **Current:** ✅ DONE — render + gate PASS across 4 versions (prior LOE-GRADE). No LOE-render CLI yet (queue). [LOE Coverage Gate](~/Development/APR-Dashboard-v3/tests/LOE-TEST-COVERAGE-GATE.md).

### Leg 6 — Email Send and Deliver
- **Done means:** the LOE e-sign email **sends** to bc@crowestudio.com → **delivery confirmed** → the **received email is opened + validated** (screenshot of the email + the working signing link). On the board.
- **Evidence chain:** send → Resend delivery status (`delivered`) → `[received-email screenshot]` → tldr.
- **Current:** 🟢 send + delivery PROVEN (Resend). 🟡 the **open/validate-in-inbox** is blocked on **email re-auth** (cluster #1). So delivery's proven; the eyeball screenshot waits on the re-auth.

### Leg 7 — E-Sign and Signed-Date
- **Done means:** the DocuSeal signature **completes** (Codex sign-click) → webhook fires → **ClickUp status flips to Signed** (screenshot) → the **dashboard/Supabase shows the signed DATE** (screenshot). On the board.
- **Evidence chain:** signing page → complete (Codex) → webhook → `[ClickUp Signed-status screenshot]` + `[dashboard signed-date screenshot]` → tldr.
- **Current:** 🟢 DATA-PASS (corrected 2026-06-21 — was wrongly 🟡 on the stale 06-11 board). **The signed trigger was TESTED + verified 2026-06-18** (`TESTING-STATUS-esign-email.md` ✅ section + `tests/leg-sheets/LEG-6-SIGN-TRIGGERS.md`): a real test sign flowed through DocuSeal's `submission.completed` webhook → job flips to `loe_signed`, **signed date lands on the dashboard record**, and the **Job Status field** shows the workflow label (Submitted → Sent → Signed by Client). **Verified in the database.** A backup status-advance on the signing page backstops the webhook. **Missing for ✅:** the screenshot pair on the board. **One open nuance to confirm:** the webhook stamps the ClickUp card, but the code may not call `updateClickUpChecklist` to tick the checklist items on completion — confirm the ClickUp *status-tag* flip on sign is landing, separate from the DB flip which IS verified.

### Leg 8 — SharePoint Folders
- **Done means:** the per-job **folder set is created** (parent + 5 subfolders, exact names) → the **dashboard folders section shows "Connected"** with open-in-SharePoint links → attachments + the signed LOE **land in the right subfolders** (screenshot of the SharePoint folder + the dashboard section). On the board.
- **Evidence chain:** job → Graph folder-create → `[SharePoint folder screenshot]` + `[dashboard Connected section screenshot]` → tldr.
- **Current:** 🟡 NEEDS SETUP + 🔴 UNBUILT — folder + naming spec CONFIRMED live; app NOT registered (cluster #3); folder-create wiring + the "Connect Folders" button UNBUILT. [SharePoint app recipe](~/Development/APR-Dashboard-v3/docs/Features/13-Asset-Storage/SHAREPOINT-APP-SETUP-RECIPE.md).

### Leg 9 — Closing and QuickBooks
- **Done means:** signed-LOE data → QuickBooks **Customer + Invoice** created → sent → **payment recorded (flips Paid)** → **2 triggers fire** (signed→thank-you+invoice; paid→receipt + status/ClickUp flip), all in **sandbox** (screenshots of the invoice + the paid/triggered state). On the board.
- **Evidence chain:** signed data → qbo create-customer/invoice → `[invoice screenshot]` → record-payment → `[paid + trigger screenshot]` → tldr.
- **Current:** 🟡 NEEDS SETUP + 🔴 UNBUILT — zero code, zero creds; needs the **Intuit sandbox account** (cluster #2) → then build 7 qbo CLIs + wire the 2 triggers. [QB sandbox path](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/QUICKBOOKS-SANDBOX-PAYMENT-PATH.md).

---

## THE SUPPORTING SYSTEMS (the machinery around the pipeline)
| System | Status | What it is | Resource |
|---|---|---|---|
| **Test plan** | ✅ LIVE | The runbook QA drives — full journey, leg by leg, pass/fail + screenshots | [Full-Loop E2E Test PRD](~/Development/APR-Dashboard-v3/tests/E2E-TEST-PRD-FULL-LOOP.md) · [grade doc](~/Development/APR-Dashboard-v3/tests/PIPELINE-CLI-GRADE-2026-06-10.md) · [canvas](~/Development/APR-Dashboard-v3/tests/APR-FULL-LOOP-VAL-test.tldr) |
| **CLI tools** | ✅ LIVE | Every CLI as one searchable inventory + a "build a new toolkit" factory + QA cold-agent cert gate | [CLI Tools Dashboard](~/.claude/knowledge/CLI-TOOLS-DASHBOARD.md) |
| **Knowledge findability** | ✅ LIVE | The search→gap→backfill→prove loop; all facets ingested + findable | `/workflow-ingest` (Knowledge Recall & Backfill System) |
| **OpenCLI ClickUp adapter** | ✅ LIVE (2026-06-21) | Token-free read of any ClickUp task's custom fields (`opencli clickup task <id>`) — the readback instrument for sync verification. Mints a short-lived session JWT from the logged-in Chrome (no `pk_` token). | `~/.opencli/clis/clickup/` · endpoints `~/.opencli/sites/clickup/endpoints.json` |

## THE BUILD QUEUE (gaps QA found → build, then QA certifies)
Intake-submit CLI · Valcre-create CLI + create-path mapping fix · LOE-render CLI · DocuSeal-send CLI · resend-get (wait+retry) · 7 QuickBooks CLIs + 2 triggers · SharePoint folder-create wiring + dashboard Connect button + Graph email swap · ClickUp ~~phone-E.164~~ (DONE 2026-06-21) + Premise/Premises fix · **Signing→team-notify email** (on LOE-signed, email the Chris/Valta team to go send the QuickBooks quote link — their manual step; flagged by Ben 2026-06-21, NOT built — this is a 3rd trigger beyond Leg-9's two) · fix `valcre-field-audit.sh` (silent-dies under Python 3.14).

---

## ONE-LINE STATUS
**The pipeline's data path (intake → LOE → ClickUp → e-sign send) is verified end-to-end; the remaining green-DONE work is locking the screenshot evidence on the board, plus the 3 setup-gated legs (signature, folders, QuickBooks) you unlock in one Codex sitting.**

---

**Last reviewed:** 2026-06-21 by qa-agent — backfilled live verifications: Valcre readback of VAL261065 (data populated; create-path fix still open), ClickUp re-push verified via the new token-free OpenCLI adapter (22 fields land, phone→E.164 resolved, old 404-readback blocker gone), recorded Ben's priority call (ClickUp field-completeness DEPRIORITIZED — explicitly NOT a quality bar; remaining dropdowns deferred to the Valta client setup; priority = doc accuracy + shared status), added the signing→team-notify QB-quote email gap + the Python-3.14 audit-script bug to the build queue. **Leg 7 corrected:** an earlier draft of this review wrongly called the sign-trigger unverified by trusting the stale 06-11 board — search-verified it WAS tested 2026-06-18 (test sign → `loe_signed` + signed date + Job Status field, confirmed in DB), so Leg 7 moved 🟡→🟢. Only open sub-item: confirm the ClickUp status-tag flip on sign (DB flip is verified).

_Prior: 2026-06-11 by co-architect — rebuilt so every leg carries its "done means" definition + evidence chain + an anchor link, with honest 🟢 DATA-PASS vs ✅ DONE separation (a backend row is not proof; the screenshot evidence on the board is)._
