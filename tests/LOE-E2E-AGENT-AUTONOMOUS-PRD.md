# PRD — LOE End-to-End Test, Agent-Autonomous

**Status:** PRD — reality-reconciled 2026-06-03, decisions locked (see `tests/E2E-TESTING-WORKFLOW-MASTER.md` LOCKED block). Ready to author the protocol.
**Filed:** 2026-05-15 · **Reconciled:** 2026-06-03
**Author:** co-architect (per Ben request)
**Wraps:** `tests/LOE-END-TO-END-TEST-PLAN.md` (Jan 20, last updated Feb 26)
**Owner if approved:** qa-agent (Tier-1)
**Companion (executes):** **Codex (Computer Use)** drives the browser actions — intake form-fill + DocuSeal portal-sign · react-specialist/fullstack-developer dispatched only if test exposes a build gap (e.g. the clickup.ts:11 dead-list fix)

---

## 2026-06-03 reconciliation (supersedes stale refs below)

- **Pin job = VAL261101 "Westside Mall"** (NOT the old VAL261003 / `f8f1106a-...`, which no longer exists). Modify-not-create. HARD guardrail: verify the Valcre job name still reads "Westside Mall" before any write — VAL numbers get reassigned to real clients (261028→Bentley Multifamily, 251031→Barrie Townhomes).
- **Phase 6 (sign) = Codex Computer Use**, not a programmatic DocuSeal endpoint. Phase 1 form-fill = Codex too. Codex needs GPT-5.5 + one-time Chrome pre-auth. Primary verification stays programmatic (DB/API); capturer ≠ verifier holds.
- **Canonical ClickUp test list = `901709622357`** (27 fields). App bug: `clickup.ts:11` points at dead `901703694310` — fix before Phase 2.
- **DocuSeal + Resend have no CLIs** — author thin read-only status wrappers.
- Full locked detail + follow-ups: `tests/E2E-TESTING-WORKFLOW-MASTER.md`.

---

## TL;DR

Repackage the existing LOE end-to-end test plan into a process qa-agent runs solo from start to finish, no Ben in the loop. Identify every step where qa currently can't act alone, propose a verification method that uses agent capabilities (agent-browser CDP, REST APIs, MCP), and lock acceptance criteria so a "pass" run produces hard evidence, not a human ✅.

## Why this matters

Current `LOE-END-TO-END-TEST-PLAN.md` is half automated, half manual. Steps like "open ClickUp workspace and visually find the task" or "check your email inbox for the signing link" assume Ben is the operator. qa is a Tier-1 agent with full toolchain — agent-browser CDP, Bash, Read, Write, Task tool to dispatch fixers, MCP for ClickUp/Supabase/Resend if wired. Anywhere the test asks Ben to do something a tool can do, it's wasted human time and a recurring blocker.

## Scope

In:
- Client intake form → ClickUp task → LOE generated → DocuSeal+email → client signs → webhook → ClickUp updated → dashboard reflects
- All eight phases of the source plan
- Replace any Playwright-flavored steps with agent-browser CDP (`agent-browser --cdp 9222`)
- Identify verification methods for every previously-manual checkpoint

Out:
- Calculator field testing (separate spec)
- LOE template editor UI changes (locked, per source plan note)
- Production deployment verification (separate gate)
- Real client email send to a real Microsoft account (sandbox-only for now)

## Source plan — eight phases recap

1. Pre-flight checks (server up, test job exists, fields populated)
2. ClickUp task creation
3. LOE generation + preview
4. Send LOE to client (DocuSeal + email via Resend)
5. Email verification
6. Client signing in DocuSeal portal
7. Webhook fires + DB + ClickUp updates
8. Dashboard reflects signed status

## Gap analysis per phase — where qa might fall + proposed fix

| Phase | Step | Gap (current plan assumes Ben) | qa-autonomous fix |
|---|---|---|---|
| 1 | 1.1 Dev server check | `curl` already automatable | No gap. Already works. |
| 1 | 1.2 Test job exists | Uses `agent-browser open` against running app — **CRASHES KM-Exp**, but APR runs on its own dev server (port 8086) not Electron — safe here. Confirm context. | Confirm APR dev server runs standalone outside Electron app. agent-browser open is OK against APR. Use `--cdp` flag only against Electron. Document distinction in test prelude. |
| 1 | 1.3 Required fields populated | Manual checkbox list | Read job_submissions row via Supabase REST or MCP. Compare against required-field schema. Pass/fail programmatic. |
| 2 | 2.3 Verify task in ClickUp workspace | "Open ClickUp, navigate to list, find task" — pure manual | ClickUp API GET task by ID. Verify name, list, content. Need: ClickUp API token in env (already exists per CLAUDE.md — `VITE_CLICKUP_API_TOKEN`). |
| 2 | 2.4 DB link verification | SQL check noted as "optional" | Promote to required. Supabase REST query, parse JSON. |
| 3 | 3.2 Verify LOE content | Manual checkbox list of fields | Programmatic: DOM scrape via agent-browser `get-text` for each field name. Compare to expected job data. Pass/fail. |
| 4 | 4.1 Send LOE | Click button → wait → see success | Already automatable. agent-browser click + console log read. No gap. |
| 4 | 4.3 DB update | "Optional" SQL — promote to required | Same as 2.4. |
| 4 | 4.4 ClickUp checklist updated | "Open ClickUp, check checklist item 1" — manual | ClickUp API GET task checklist. Verify item 1 = checked + has timestamp. |
| 5 | 5.1 Email received | **HARD GAP** — needs Ben to open inbox | Use Resend API (`GET /emails/:id`) to query sent message status. Email object returns delivered/bounced/etc. NO inbox read needed — just confirm Resend sent + delivered. |
| 5 | 5.2 Click signing link | Manual click in email client | Extract signing URL from DocuSeal API (`GET /submissions/:id`) — returns submitter URLs. Visit URL with agent-browser. Verifies portal loads. |
| 5 | 5.3 Microsoft email test | **HARD GAP** — real human email | DEFERRED. Sandbox testing covers programmatic happy path. Real-client test is a separate Ben-only gate. |
| 6 | 6.1 Sign document | Manual mouse/touchpad sign in DocuSeal portal | DocuSeal API supports programmatic completion: `POST /submissions/:id/submitters/:id/complete` (or similar — verify exact endpoint). Bypasses portal entirely. |
| 6 | 6.2 Signature completion confirmation | Manual visual check of thank-you page | Read DocuSeal API response. status field flips to "completed". Programmatic. |
| 7 | 7.1 Webhook received | SQL DB check | Same as 2.4/4.3. Programmatic. |
| 7 | 7.2 ClickUp updated | Manual ClickUp check | ClickUp API GET task. Verify checklist item 2 + comment with timestamp. |
| 7 | 7.3 Signed PDF in job_files | SQL check | Programmatic. |
| 8 | 8.1-8.3 Dashboard reflects status | agent-browser refresh + visual check | Already automatable. agent-browser snapshot + verify text content. |

## Hard gaps that DON'T close (acceptable)

1. **Real Microsoft client email delivery** — sandbox tests only. Real-client validation is a Ben gate, kept separate.
2. **First-time DocuSeal account/template setup** — one-time human config. Out of test scope.
3. **ClickUp workspace + list ID drift** — if Ben renames a list, test breaks. Acceptable cost — ClickUp config is stable.

## Required external API capabilities — verify before approval

Before this PRD is greenlit, confirm qa has working access to:

- [ ] ClickUp API: token in env, GET task + checklist
- [ ] Supabase REST: anon key + service-role key (already in env per CLAUDE.md)
- [ ] Resend API: key in env, GET email delivery status
- [ ] DocuSeal API: key + URL for programmatic submission completion

If any of these aren't wired, the PRD ships in two parts:
- Phase 1: refactor what's possible TODAY (agent-browser + DB + ClickUp)
- Phase 2: add Resend/DocuSeal API steps once auth confirmed

## Acceptance criteria — what a "pass" looks like

A successful run produces:

1. **One log file** at `~/Development/APR-Dashboard-v3/tests/runs/loe-e2e-<timestamp>.md` capturing every step's evidence (DB row IDs, API response codes, agent-browser snapshots, timestamps)
2. **Eight phase verdicts** in the log: PASS / PARTIAL / FAIL with cause for any non-PASS
3. **Hard evidence per checkpoint** — no manual ✅. Either a programmatic check passed or it didn't.
4. **Three screenshots minimum** — pre-send dashboard, DocuSeal portal (programmatic load), post-sign dashboard
5. **Zero human-action prompts in the log** — if qa had to ask Ben to do anything, that's a fail of the autonomy goal even if the workflow passed

## Deliverables if approved

1. Rewritten `LOE-END-TO-END-TEST-PLAN.md` as `LOE-E2E-AGENT-PROTOCOL.md` (versioned doc, qa owns)
2. Helper script `~/.claude/scripts/qa/loe-e2e-run.sh` — single-command full run
3. Verification helpers per phase if needed (`loe-e2e-check-clickup.sh`, `loe-e2e-sign-programmatic.sh`)
4. Log template at `tests/runs/_template-loe-e2e-run.md`
5. README in `tests/runs/` explaining how to read a run log

## Recommended dispatch

qa-agent owns the work. They:
1. Read this PRD
2. Verify the four external API capabilities listed above
3. Pitch back any blockers + proposed Phase 1/Phase 2 split if needed
4. Author the protocol doc + helper scripts
5. Dry-run once against the pin job **VAL261101 "Westside Mall"** (verify the name matches first)
6. Report results + iterate

Estimated qa-side scope: 1-2 focused sessions, no Tier-2 dispatch needed (qa has all toolchain).

## Out of scope additions

- LOE template content changes
- ClickUp task format changes
- Email template redesign
- Adding new test fixtures (use pin job VAL261101 "Westside Mall")

## Open questions for Ben — status 2026-06-03

1. APR dev server port — verify at run time (agent-browser opens the dev server, not Electron; CDP only for Electron).
2. ClickUp test list — RESOLVED: `901703694310` is DEAD (app bug). Canonical = `901709622357`.
3. Resend sender — STILL OPEN (minor): sandbox vs verified Valta domain; `resend-domain-check` wrapper answers it. Sandbox is fine for autonomous runs.
4. DocuSeal template `1680270` — verify still current during the DocuSeal wrapper authoring.
5. Real-client email gate — STAYS a Ben-only run after sandbox passes (not in the standard autonomous suite).

## Status

**Not approved, not dispatched.** Filed for Ben review. Once approved, hands to qa-agent who delivers the rewritten protocol + scripts.
