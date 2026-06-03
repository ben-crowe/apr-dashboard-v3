# LOE End-to-End Testing Workflow — Master Plan

**Status:** v2 (2026-06-03) — reality-reconciled with Ben, decisions LOCKED (see block below). Ready to author the runnable protocol.
**Lives at:** `~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md`
**Wraps:** `tests/LOE-END-TO-END-TEST-PLAN.md` (the source eight-phase plan) + `tests/LOE-E2E-AGENT-AUTONOMOUS-PRD.md` (the autonomy PRD)
**Owner if approved:** qa-agent

---

## LOCKED REALITY (2026-06-03) — supersedes any stale refs below

Reconciled live with Ben + qa-agent CLI inventory (`tests/CLI-INVENTORY-PREFLIGHT-2026-06-03.md`) + pin-job search (`tests/PIN-JOB-PROPOSAL-2026-06-03.md`). Where this block conflicts with older text below, THIS wins.

**Decisions locked:**

1. **Pin job = VAL261101 "Westside Mall" (2129 Broadway Court, Calgary AB).** The only one of our 5 test jobs still present in Valcre AND still carrying our test name. Confirmed both sides (Ben + qa). Modify-not-create; it is the bridge until a dedicated job is stood up.
2. **VAL-number REASSIGNMENT HAZARD (safety-critical).** Valcre reuses/reassigns VAL numbers to REAL clients. VAL261028 (our "Southlands Plaza") is now real client **Bentley Multifamily**; VAL251031 is now **Barrie Townhomes**. VAL261029 + VAL251032 are deleted from Valcre. **HARD GUARDRAIL: before ANY Valcre write, verify the job's client/property name still reads "Westside Mall" — abort on mismatch.** Never modify a job by number alone.
3. **Canonical ClickUp TEST list = `901709622357`** ("APR Test - Valta Mirror", Space "APR Testing" > Folder "APR Test Lists", 27 fields). Reachable with the BC test token. *(The doc was right; see app-bug.)*
4. **APP BUG to fix:** `src/utils/webhooks/clickup.ts:11` hardcodes a DEAD list `901703694310` ("Automation Team Board") that no test token can see — app test-mode writes nowhere. Fix = point it at `901709622357`. Route to react-specialist/apr-domain (NOT a test-side change).
5. **ClickUp task = a formatted MARKDOWN CARD + tag, ZERO custom fields (verified in code `src/utils/webhooks/clickup.ts`, 2026-06-03).** The "49 custom fields" figure is fully LEGACY (pre-dashboard, all submission fields were dumped into ClickUp custom fields). The current app: `mapJobToClickUpFields()` returns an EMPTY array; the task carries a `markdown_description` card — 📍 "NEW JOB ARRIVED → [View in APR Hub](link)" header, divider, then **Client / Property / Type / Intended Use / Notes** — plus a "NEW ARRIVAL" tag and template `t-86b3exqe8`. It's a notification + mini-portal back to the dashboard; the client does NOT use ClickUp to gather appraisal data (that's the APR dashboard's job). **Phase-2 verifies the CARD renders + the Hub link resolves + tag present — NOT a field count.** The 27/49 list fields are irrelevant leftovers the app doesn't populate. Prod list `901402094744` = Chris's, do NOT write.
6. **DocuSeal + Resend have ZERO CLIs.** Author thin READ-ONLY wrappers (get-submission, get-email, domain-check) for hard per-phase evidence. DocuSeal SIGN (Phase 6) is done by **Codex Computer Use**, not a programmatic endpoint (endpoint unknown + unneeded).
7. **Codex Computer Use is IN the team** (Ben on GPT-5.5, confirmed). Role = OPERATOR for the two human-action phases: intake **form-fill** (Phase 1/2 trigger) + DocuSeal **portal-sign** (Phase 6). It drives the real logged-in browser. Requires one-time setup: GPT-5.5 + Chrome "Always allow" + portals left logged in. Primary verification stays PROGRAMMATIC (DB row / API status) — Codex acts, the data trail proves; capturer ≠ verifier still holds. Codex capability notes: `~/.claude/learnings/codex.txt`.
8. **Valcre has NO test env** — every call is prod-as-Chris. `valcre-auth.sh` initially errored (exit 3) then was used successfully for the pin-job cross-check. Treat auth as fragile; re-verify before a run. Missing scripts: `valcre-get-by-number`, `valcre-delete-job` (prod-risk; rely on modify-not-create), `valcre-reset-test-job`.

**Test surface / URLs (locked):**
- **Shared testing zone = the HOSTED Vercel app** `https://apr-dashboard-v3.vercel.app` (confirmed live HTTP 200). Stable URL that Ben, Codex, and agents all hit — no local-server drift. Local Vite (5173) is for code-change work only (e.g. the clickup.ts:11 fix), not workflow runs.
- **Intake form (our test stand-in for the client's website form) = `/appraisal-request-form`** (also `/`). We submit HERE, never the client's actual site. Submissions land in our live Supabase and flow the chain.
- **No custom Valta domain is configured for the app** — it's the `.vercel.app` host. (The `valta.ca` strings in code are report-template appraiser contact content, not the app host.) If a Valta custom domain gets added later, update this line.
- Both hosted and local hit the SAME live backend (Supabase + Valcre prod-as-Chris + ClickUp test list 901709622357 + DocuSeal/Resend sandbox) — reinforces the pin-job + name-match guardrails.

**ClickUp environment path (test → promote, locked):**
- **ALL testing creates tasks in BEN'S BC ClickUp** — test workspace `8555561`, list `901709622357` ("APR Test - Valta Mirror"). It LOOKS like we're filling Ben's ClickUp, by design. NEVER the client's Valta ClickUp during testing.
- **Promotion to the client's Valta ClickUp** (workspace `9014181018`, prod list `901402094744`) is a deliberate, BEN-GATED switch done only AFTER a flow is dialed — mechanically just retargeting the list ID + token in `clickup.ts`.
- **The task is a markdown CARD, not custom fields:** app writes a `markdown_description` (Client/Property/Type/Intended Use/Notes + APR Hub link) + "NEW ARRIVAL" tag, and ZERO custom fields. No field-count work needed. The only ClickUp config that matters for the client is `VITE_APP_URL` (the Hub link target) being set correctly on Vercel.

**Follow-ups logged (not blocking the first run):**
- Verify `VITE_APP_URL` is set on Vercel so the ClickUp card's "View in APR Hub" link resolves to the live job (not localhost:8080), and confirm the link's URL shape (code uses an older `/#/dashboard?jobId=` hash form — check it matches the app's actual routing). The ClickUp task is a markdown card + ZERO custom fields, so no field-mapping work is needed — drop the old 49-field reconciliation idea entirely.
- Clean up STALE DB records whose VAL numbers no longer match Valcre (261028→Bentley, 251031→Barrie, 261029/251032 deleted) so no agent ever touches a real client job. Delete/flag in our app.
- Archive the 2 duplicate "Valta Mirror" lists (`901709621852`, `901709621790`); keep `901709622357`.
- Stand up a dedicated **"E2E TEST — DO NOT DELETE"** Valcre job to permanently end the reassignment hazard.
- Author: `tests/scripts/reset-test-state.sh`, `clickup-update-checklist`, the DocuSeal/Resend read-only wrappers.

**Comms doctrine (team):** pull-not-push — teammates write findings to files and ping CoArch one line only when its pane is idle; use `~/.claude/scripts/utils/tmux-msg.sh` (never raw multi-line send-keys).

---

## Purpose

One canonical doc covering how we test the APR Dashboard end-to-end (intake → ClickUp → LOE → DocuSeal → email → client signs → webhook → ClickUp updated). The doc covers:

1. The eight-phase flow + what each phase visually proves
2. What lands on the visual tldraw board per phase + what doesn't
3. The five "off-board" items we need to lock before a real run
4. CLI tool inventory per integration (Valcre / ClickUp / DocuSeal / Resend / Supabase) — what we have, what's missing, who owns it
5. How the test grows as the app grows — onboarding new features into the suite

---

## The two run artifacts (every test run produces both)

1. **Markdown log** at `tests/runs/<YYYY-MM-DD-HHMM>/run.md` — eight phase sections, evidence per step (API responses, timestamps, DB row IDs), pass/fail verdict
2. **tldraw board** at `tests/runs/<YYYY-MM-DD-HHMM>/run.tldr` — visual receipt, one node per phase, screenshot + write-up underneath, arrows showing flow

Reviewer scans the board in thirty seconds, drills into the markdown only if something looks off. Diffing two recent boards side-by-side spots regressions visually.

---

## Phase-by-phase — what's on the visual board

| Phase | Visual board node | Evidence underneath |
|---|---|---|
| 1 — Pre-flight | Dashboard mounted at `/dashboard/job/<test-id>` | Server health curl OK, job loads, required fields populated, no console errors |
| 2 — ClickUp task created | Screenshot of created task in BC test workspace | Task ID + URL stored in DB; name matches `VAL<num> - <property>`; the **markdown card** renders (Client / Property / Type / Intended Use / Notes); **"View in APR Hub" link resolves to the job** (not localhost); "NEW ARRIVAL" tag present. NOT a custom-field count — the app populates ZERO custom fields. |
| 3 — LOE preview | Screenshot of the LOE preview modal with content rendered | Subject line, client name, address, fee, delivery date, T&Cs visible — programmatic DOM scrape compares against expected |
| 4 — Send LOE | Screenshot of success state after "Send to Client" click | DocuSeal submission slug returned, Resend email ID returned, DB `loe_sent_at` set, ClickUp checklist item 1 checked |
| 5 — Email delivered | Screenshot of Resend dashboard entry OR API response showing `delivered` status | NO inbox read — Resend API confirms delivery, signing URL extracted from DocuSeal API |
| 6 — Client signs | Screenshot of DocuSeal portal (loaded programmatically) + screenshot of completion state | DocuSeal API: `status: "completed"` on submission |
| 7 — Webhook fires | Screenshot of dashboard reflecting signed state | DB `status: "loe_signed"`, `loe_signed_at` timestamp, `signed_document_url`, ClickUp checklist item 2 checked + comment with timestamp |
| 8 — Dashboard final state | Screenshot of job page after refresh | Status badge updated, LOE section shows "Signed", signed PDF download link present |

Each node on the tldraw board: screenshot at top, short write-up underneath (3-5 lines), arrow to the next phase.

---

## The five off-board items (knock these off one at a time before any run)

Items that need configuration / setup but never appear visually on the board. They're infrastructure, not test evidence.

### 1. ClickUp dual-account setup

**Locked from context-search:**

- **BC test workspace:** ID `8555561` — test list `901709622357` — Ben token `pk_10791838_LS46SHHP1RFUYP4TUA9V8NOIGGZMMPVG`
- **Valta production workspace:** ID `9014181018` — prod list `901402094744` — Valta token `pk_54774263_VRTOFK2ENK5O96J549ESCPUESS76E1AT`
- **Chris workspace:** ID `36880663` (client account, do not write to during testing)
- **Template:** `t-86b3exqe8`

**Rule for testing:** all test runs hit the BC test workspace. Production list and client workspace get touched ONLY after Ben explicitly promotes a tested flow.

### 2. Resend domain verification

**Open question.** Source plan uses `onboarding@resend.dev` sandbox sender. Production needs a verified Valta domain. Confirm:
- Is a Valta domain already verified in Resend, or still sandbox-only?
- Quota on sandbox (daily limit) — will daily test runs hit it?
- Plan: stay sandbox for autonomous runs, switch to verified Valta domain for client-facing runs only.

### 3. DocuSeal — programmatic sign capability

**Verification needed.** Source plan has a human signing in the DocuSeal portal. For autonomous testing, qa needs to complete a submission via API. Confirm:
- DocuSeal API endpoint for "complete submission as signer" — exists or not?
- If not, alternatives: (a) headless agent-browser navigates the portal, (b) webhook-fake (build a small endpoint that simulates the DocuSeal POST), (c) keep manual sign and accept Phase 6 as a Ben gate.

### 4. Valcre — single-job modify pattern, not multi-job spawn

**Hard rule:** the test suite should make ONE Valcre job and MODIFY it across runs, not create a new VAL number every time. Twenty test runs = twenty bogus VAL numbers = Valcre noise.

**CLI tool status from context-search:**
- `valcre-update-job` — EXISTS. PATCHes existing job by jobId, applies 6 conversion maps.
- `valcre-field-audit.sh VAL<num>` — EXISTS. Compares dashboard state vs Valcre state field-by-field.
- `valcre-create-job` — implicit, triggered by dashboard button (POST /api/valcre).
- **`valcre-delete-job`** — NOT FOUND in current toolkit. Need to verify whether Valcre's REST API even allows delete, or if we have to live with manually pruning test jobs in the Valcre UI.
- `valcre-set-fields-bulk` for resetting a test job to known state — NOT FOUND. Need to author or confirm `valcre-update-job` handles a full reset.

**Test pattern:**
- One canonical test Valcre job (pre-existing, jobId pinned in test config)
- Each run modifies fields → audits → resets fields to known baseline
- No fresh job creation during routine test runs

### 5. Test job state reset between runs

**Hard problem.** After a successful run, the test job is in "loe_signed" state. Next run starts from signed, not fresh. Need:
- A reset script that flips the test job back to pre-LOE state in Supabase
- Cleanup of any test ClickUp tasks created in the run (delete via ClickUp API)
- Reset of the Valcre job fields to baseline (per item 4 above)
- One command: `bash tests/scripts/reset-test-state.sh` runs before any test invocation.

---

## CLI tool inventory per integration

For each integration: what CLIs exist today, what's missing, where they live, which agent's domain owns them.

### Valcre (owned by apr-domain-agent, used by qa-agent)

| Capability | CLI | Status | Location |
|---|---|---|---|
| Create job (via dashboard button) | dashboard-create-valcre | ✓ exists | UI click |
| Update job by jobId | valcre-update-job | ✓ exists | `~/.claude/scripts/apr/` (probable) |
| Audit job fields vs dashboard | valcre-field-audit.sh | ✓ exists | `~/.claude/scripts/apr/valcre-field-audit.sh` |
| Get job by VAL number | valcre-get-by-number | unknown | check `~/.claude/scripts/apr/` |
| Delete job | valcre-delete-job | ❌ MISSING | needs author OR confirm API supports |
| Bulk reset fields to baseline | valcre-reset-test-job | ❌ MISSING | needs author |
| List all jobs by appraiser | valcre-list-jobs | unknown | check |

**Skill anchor:** `~/Development/APR-Dashboard-v3/builds/cli-apr-tools-SPEC.md`, `cli-apr-tools-SKILL.md`

**Action for qa before first autonomous run:**
1. Inventory `~/.claude/scripts/apr/valcre-*.sh` actual files vs the table above
2. Verify Valcre REST API supports DELETE on Jobs endpoint (or document workaround)
3. Author missing reset script if gap confirmed

### ClickUp (owned by clickup-expert + apr-domain-agent, used by qa-agent)

| Capability | CLI | Status |
|---|---|---|
| Auth check | clickup-auth-test.sh | ✓ exists |
| Get workspace member list | get-workspace-members.py | ✓ exists |
| List custom fields on a list | clickup-list-fields.sh | ✓ exists |
| Create task with APR custom fields | clickup-create-task.sh | ✓ exists (49 fields mapped) |
| Update task | clickup-update-task | ✓ exists (updateClickUpWithValcreJob function) |
| Delete task | clickup-delete-task | unknown — verify |
| List tasks on a list | clickup-list-tasks | unknown — verify |
| Update checklist item state | clickup-update-checklist | unknown — verify (Phase 4.4 + Phase 7.2 need this) |
| Add comment to task | clickup-add-comment | unknown — verify (Phase 7.2 needs this) |

**Locations:** `~/.claude/scripts/apr/` + `/Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/scripts/`

**Action for qa:**
1. Inventory existing scripts in both locations
2. Confirm checklist-update + add-comment scripts exist (Phase 4.4 + 7.2 verification needs them)
3. Author missing pieces — clickup-expert agent owns this if Tier-2 dispatch needed

### DocuSeal (owned by apr-domain-agent, used by qa-agent)

| Capability | CLI | Status |
|---|---|---|
| Create submission from template | docuseal-create-submission | unknown — verify |
| Get submission status | docuseal-get-submission | unknown — verify |
| Complete submission as signer (programmatic sign) | docuseal-complete-submission | ❌ UNKNOWN whether endpoint exists |
| List submissions | docuseal-list | unknown |
| Delete submission | docuseal-delete | unknown |
| Webhook payload reference | docs/docuseal-webhook-schema.md | unknown — verify |

**Action for qa:**
1. Confirm DocuSeal API documentation has a "complete submission" endpoint
2. If yes — author the CLI wrapper
3. If no — pick fallback (headless browser sign vs webhook fake vs manual gate)

### Resend (owned by apr-domain-agent, used by qa-agent)

| Capability | CLI | Status |
|---|---|---|
| Send transactional email | already in Edge Function | ✓ exists in API layer |
| Get email delivery status by ID | resend-get-email | unknown — verify |
| List recent sends | resend-list | unknown — verify |
| Domain verification status | resend-domain-check | unknown — verify (covers off-board item 2) |

**Action for qa:**
1. Confirm Resend API supports GET email-by-id (it does per Resend docs — verify wrapper exists locally)
2. Author the wrapper if missing

### Supabase (owned by apr-domain-agent, used by qa-agent)

| Capability | CLI | Status |
|---|---|---|
| Read row by table+id | supabase REST + service-role key | ✓ exists (built-in) |
| Update row | supabase REST PATCH | ✓ exists |
| Run arbitrary SQL | Supabase MCP if wired | unknown — verify |
| Reset test job to baseline | reset-test-job.sh | ❌ MISSING |

**Action:** confirm MCP wiring + author reset script.

---

## How the suite grows as the app grows

Once the LOE E2E suite is dialed, the pattern becomes the template for every new feature flow:

1. New feature ships → triggers a stub entry in `tests/E2E-INDEX.md` (top-level test directory index)
2. qa-agent picks up the stub at next session activation, opens an authoring session, fills the spec from feature docs + commit history
3. First run produces a markdown log + tldraw board. Both archived under `tests/runs/`
4. Subsequent feature changes append phases to the spec, not rewrite it. Spec stays canonical, runs stay disposable.

**Suggested directory layout going forward:**

```
~/Development/APR-Dashboard-v3/tests/
  E2E-TESTING-WORKFLOW-MASTER.md   ← this file
  E2E-INDEX.md                      ← which suites exist, which agent owns, last run verdict
  loe-e2e/
    PROTOCOL.md                     ← the runnable spec, agent-owned
    scripts/                        ← reset, check-clickup, sign-programmatic, etc.
  intake-e2e/                       ← next suite to author after LOE
  valcre-field-audit/               ← already exists as a one-shot, promote to suite
  runs/
    2026-05-15-1430/
      run.md
      run.tldr
      screenshots/
  scripts/
    reset-test-state.sh             ← single command, resets everything before any run
```

---

## What lives in this doc vs other docs

This doc = the master plan + gap analysis + CLI inventory.

The runnable protocol = `tests/loe-e2e/PROTOCOL.md` (to be authored once this is approved).

The source plan = `tests/LOE-END-TO-END-TEST-PLAN.md` (frozen reference — do not edit, supersede via the new protocol).

The PRD wrapping qa autonomy = `tests/LOE-E2E-AGENT-AUTONOMOUS-PRD.md` (drafted today, complements this doc).

---

## Open questions for Ben — RESOLVED 2026-06-03

1. ClickUp setup — BC test workspace `8555561` ✓ confirmed reachable. Canonical TEST list = `901709622357` (not the app-hardcoded dead one). See LOCKED block.
2. Resend — STILL OPEN (minor): sandbox vs verified Valta domain. Plan: stay sandbox for autonomous runs, switch to verified domain for client-facing runs only. `resend-domain-check` wrapper will answer it.
3. DocuSeal sign — RESOLVED: **Codex Computer Use signs the portal** (no programmatic endpoint needed). Phase 6 is autonomous, not a Ben gate.
4. Valcre test job — RESOLVED: **pin VAL261101 "Westside Mall"**, modify-not-create, with the name-match guardrail. Dedicated job to follow.
5. Suite cadence — STILL OPEN: default to **on-demand** for now; revisit daily/on-merge once the first clean run lands.

---

## Visual verification — HARD RULE (locked 2026-05-15)

**The agent that captures a screenshot is NEVER the same agent that verifies what it shows.**

Why this exists: agents have systematic blind spot here. They take the screenshot, see the PNG file is on disk, declare the step PASSED — without actually looking at the image content. Worse, when they DO look, they're biased by what they just did and tend to confirm their own work. Self-verification of visual evidence is unreliable.

**Mandatory routing:**

1. The capturing agent (qa-agent in most cases) takes the screenshot, files it under `tests/runs/<run>/screenshots/`, names it descriptively (e.g. `phase-3-loe-preview.png`).
2. The capturing agent dispatches `visual-verifier` (registered persona, Mode 2b subagent) with the file path and the assertion to check (e.g. "Confirm the LOE preview modal shows the property address, fee, and signature area").
3. `visual-verifier` opens the image with the Read tool — multimodal vision — describes what it sees, answers the assertion yes/no, lists anomalies.
4. Capturing agent reads the visual-verifier report, marks the phase PASS/FAIL/UNCERTAIN.
5. Anything UNCERTAIN escalates to Ben.

**Anti-patterns auditors must flag:**

- Capturer claims PASS without a visual-verifier dispatch in the run log
- Capturer dispatches visual-verifier but doesn't include the file path
- Capturer summarizes the verdict without quoting the verifier's actual description
- Single-agent "I took the screenshot, looks fine" — instant FAIL on the run

**Mode D auditor addition:** when auditing any test run, the auditor MUST grep the run log for `visual-verifier:` dispatch entries. Run with screenshots claimed but zero verifier dispatches = systemic audit failure flag, not just per-run fail.

---

## Mini test plan — prove every CLI works before any real run

Before qa attempts the full LOE E2E, run this preflight to verify EVERY tool category is operational. Each row produces a pass/fail. The full run is gated on a clean preflight.

### Valcre preflight

| # | Capability | Test command | Pass criteria |
|---|---|---|---|
| V1 | API auth | `curl -s POST /api/valcre -d '{"jobData":{"updateType":"ping"}}'` (or equivalent ping) | HTTP 200 or expected error code, NOT 401/403 |
| V2 | Get job by VAL number | `~/.claude/scripts/apr/valcre-get-job.sh VAL261003` | Returns JSON with jobId + fields |
| V3 | Field audit | `~/.claude/scripts/apr/valcre-field-audit.sh VAL261003` | Returns audit report |
| V4 | Update single field | `valcre-update-job` with one safe field (e.g. internal note) | Field updates, audit reflects change |
| V5 | Update reverts | re-run V4 with original value | Field back to baseline |
| V6 | Delete (if available) | `valcre-delete-job.sh <test-jobId>` against a disposable test job | Either succeeds OR returns documented "not supported" |

**Outcome:** confirms qa can read + modify + reset a Valcre job without creating new ones.

### ClickUp preflight

| # | Capability | Test command | Pass criteria |
|---|---|---|---|
| C1 | Token auth (Ben/test) | `~/.claude/scripts/apr/clickup-auth-test.sh <ben-token>` | Returns workspace list including BC WorkSpace 8555561 |
| C2 | List custom fields | `~/.claude/scripts/apr/clickup-list-fields.sh 901709622357 <ben-token>` | Returns 49 custom field definitions |
| C3 | Create test task | `~/.claude/scripts/apr/clickup-create-task.sh 901709622357 <ben-token> /tmp/test-job.json` | Returns task ID + URL |
| C4 | Get task by ID | `clickup-get-task.sh <task-id>` | Returns full task JSON |
| C5 | Update checklist item | `clickup-update-checklist.sh <task-id> <item-id> checked` | Item state flips |
| C6 | Add comment | `clickup-add-comment.sh <task-id> "test"` | Comment appears |
| C7 | Delete test task | `clickup-delete-task.sh <task-id>` | Task gone, GET returns 404 |

**Outcome:** confirms full CRUD on test workspace tasks + checklist + comments.

### DocuSeal preflight

| # | Capability | Test command | Pass criteria |
|---|---|---|---|
| D1 | API auth | `curl -H "X-Auth-Token: <key>" https://api.docuseal.co/templates` | Returns template list including 1680270 |
| D2 | Get template | `docuseal-get-template.sh 1680270` | Returns template JSON |
| D3 | Create submission | `docuseal-create-submission.sh 1680270 test@example.com` | Returns submission ID + signing URL |
| D4 | Get submission status | `docuseal-get-submission.sh <id>` | Returns status: "pending" |
| D5 | Programmatic sign | `docuseal-complete-submission.sh <id>` | Status flips to "completed" — IF endpoint exists |
| D6 | Delete submission | `docuseal-delete-submission.sh <id>` | Submission gone |

**Outcome:** confirms DocuSeal CRUD + answers the "can we programmatically sign?" question. D5 result determines whether Phase 6 stays manual or goes autonomous.

### Resend preflight

| # | Capability | Test command | Pass criteria |
|---|---|---|---|
| R1 | API auth | `curl -H "Authorization: Bearer <key>" https://api.resend.com/domains` | Returns domain list |
| R2 | Send test email | `resend-send.sh bc@crowestudio.com "test subject" "test body"` | Returns email ID |
| R3 | Get email status | `resend-get-email.sh <id>` | Returns delivery status |
| R4 | Verified domain check | `resend-domain-check.sh valta.com` (or current Valta domain) | Returns verified yes/no — answers off-board item 2 |

**Outcome:** confirms Resend send + delivery-status visibility without needing inbox read.

### Supabase preflight

| # | Capability | Test command | Pass criteria |
|---|---|---|---|
| S1 | Read job_submissions row | `curl -s "$SUPABASE_URL/rest/v1/job_submissions?id=eq.<test-id>" -H "apikey: $SERVICE_ROLE_KEY"` | Returns row JSON |
| S2 | Update single field | PATCH same endpoint with one field | Update succeeds |
| S3 | Read related tables | job_loe_details, job_files, job_property_info | All return rows |
| S4 | MCP query (if wired) | `mcp__supabase__query "SELECT ..."` | Returns rows |
| S5 | Reset test job | `tests/scripts/reset-test-state.sh` | Job flipped to pre-LOE state |

**Outcome:** confirms full DB CRUD + reset script works.

### agent-browser + screenshot preflight

| # | Capability | Test command | Pass criteria |
|---|---|---|---|
| B1 | Open APR dev URL | `agent-browser open http://localhost:8086` | Page loads (NOT against running Electron) |
| B2 | Snapshot with refs | `agent-browser snapshot -i \| head -40` | Returns DOM tree with @eXX refs |
| B3 | Click element | `agent-browser click @eXX` | Click registers |
| B4 | Take screenshot | `agent-browser screenshot /tmp/preflight-b4.png` | PNG file created, >5KB |
| B5 | Read console | `agent-browser console \| tail -20` | Returns console output |
| B6 | CDP attach (Electron only — NOT against APR dev) | `agent-browser --cdp 9222 snapshot -i` | Skip if APR dev server is web-only |

**Outcome:** confirms qa can drive the browser, capture state, screenshot phases.

### tldraw board screenshot insertion preflight

For visual board artifacts to work, qa must be able to:

| # | Capability | Test command | Pass criteria |
|---|---|---|---|
| T1 | Init board | `tldraw-init ~/tmp/preflight.tldr --name preflight` | File created |
| T2 | Insert PNG as image shape | `tldraw-image-insert ~/tmp/preflight.tldr /tmp/preflight-b4.png --x 100 --y 100 --w 600` | Returns shapeId |
| T3 | Insert text label | `tldraw-insert ~/tmp/preflight.tldr --type text --x 100 --y 720 --text "Phase 1 verdict: PASS"` | Returns shapeId |
| T4 | Insert sticky note | `tldraw-insert ~/tmp/preflight.tldr --type note --x 800 --y 100 --text "evidence ..." --color yellow` | Returns shapeId |
| T5 | Connect with arrow | `tldraw-arrow ~/tmp/preflight.tldr --from <id1> --to <id2>` | Returns arrowId |
| T6 | Open in viewer | POST /api/viewer-open with the .tldr path + windowId viewer-1 | Board loads in viewer |

**Outcome:** qa can author run boards end-to-end without questions. **Canonical skill = `cli-tldraw-tools` at `~/.claude/skills/cli-tldraw-tools/SKILL.md` — qa must load it before any run.**

### Pre-built run-board template

Each test run starts from a pre-built tldraw template board with empty slots for each phase. qa fills the slots — doesn't lay out a board from scratch.

Template lives at `tests/templates/loe-e2e-board-template.tldr` and contains:

- Eight numbered frames (one per phase) in a left-to-right grid
- Each frame: empty image slot at top, empty text slot underneath labeled "evidence", "verdict" badge slot
- Arrows pre-connecting Phase 1 → 2 → 3 → ... → 8
- Title frame at top: "LOE E2E Run — <date>" (qa replaces date on copy)

Run procedure:
1. `cp tests/templates/loe-e2e-board-template.tldr tests/runs/<date>/run.tldr`
2. Execute each phase, screenshot at completion
3. `tldraw-image-insert` into the matching frame's image slot
4. `tldraw-insert --type text` for the evidence write-up
5. `tldraw-insert --type note --color green` ("PASS") or `--color red` ("FAIL") into verdict slot

**Action for first run:** author the template board if it doesn't exist yet. One-time prep.

---

## Status
