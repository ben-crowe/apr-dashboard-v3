# APR E2E — CLI Inventory + Preflight (read-only)

**Run:** 2026-06-03 · **By:** qa-agent · **Scope:** BC TEST workspace (8555561) only — no prod/Valta/Chris writes, no Valcre job creation
**Source of truth diffed against:** `tests/E2E-TESTING-WORKFLOW-MASTER.md` (CLI inventory + mini test plan sections)
**Verdict:** Evidence-gathering only. NOT a full run. 3 read-only preflights PASS; 2 discrepancies + 5 authoring gaps found.

---

## 1. Exists / Missing / Needs-authoring — per integration

### Valcre — `~/.claude/scripts/apr/`
**KEY FINDING: Valcre has NO test environment.** `valcre-auth.sh` authenticates as Chris (chris.chornohos@valta.ca) into LIVE prod with hardcoded creds. Every Valcre call is prod-as-Chris. Job-CRUD scripts are absent; the toolkit is field-level only.

| Capability (doc) | Status | Reality on disk |
|---|---|---|
| Audit job fields vs dashboard (`valcre-field-audit.sh`) | ✓ EXISTS | present |
| Verify job (`valcre-verify-job.sh`) | ✓ EXISTS | present (the get/audit path) |
| Field ops (set/list/get/create/patch custom fields) | ✓ EXISTS | 5 scripts present |
| Auth (`valcre-auth.sh`) | ✓ EXISTS | present — **prod-as-Chris, no test env** |
| Get job by VAL number | ❌ MISSING | not present |
| Delete job (`valcre-delete-job`) | ❌ MISSING | not present (+ API support unverified — not tested, prod guardrail) |
| Reset test job (`valcre-reset-test-job`) | ❌ MISSING | not present |
| List jobs by appraiser | ❌ MISSING | not present |

### ClickUp — `~/.claude/scripts/apr/` + `.../CLI-Libraries/clickup-cli/scripts/`
**Best-covered integration.** apr/ has 6 sh scripts; clickup-cli/ has ~48 python scripts (full CRUD, comments, docs, tags, time, bulk).

| Capability (doc unknown) | Status | Reality |
|---|---|---|
| Auth / create-task / list-fields / list-tasks / get-task / update-field | ✓ EXISTS | apr/ scripts present |
| Delete task | ✓ EXISTS | `clickup-cli/delete-task.py` |
| List tasks | ✓ EXISTS | `clickup-list-tasks.sh` + `get-workspace-tasks.py` |
| Add comment to task | ✓ EXISTS | `clickup-cli/create-task-comment.py` |
| **Update checklist item state** | ❌ MISSING | NOT in either location — **Phase 4.4 + 7.2 gap** |

### DocuSeal
**ZERO standalone CLIs.** All logic locked in app edge function `src/utils/webhooks/docuseal.ts`.

| Capability | Status |
|---|---|
| create-submission / get-submission / list / delete | ❌ MISSING (no CLI) |
| complete-submission (programmatic sign) | ❌ MISSING + endpoint-existence unknown → **moot: use Codex browser portal-sign** |

### Resend
**ZERO standalone CLIs.** Send exists only inside app edge function.

| Capability | Status |
|---|---|
| Send transactional email | ✓ (app edge function only, not a CLI) |
| get-email (delivery status) / list / domain-check | ❌ MISSING (Resend REST supports these — wrappers need authoring) |

### Supabase — `~/.claude/scripts/apr/`
| Capability | Status |
|---|---|
| Read/write/DDL via `supabase-connect.sh` (psql, service-role) | ✓ EXISTS |
| Reset test job to baseline (`reset-test-job.sh`) | ❌ MISSING |

### Test-state scaffold
- `tests/scripts/` directory **does not exist** → `reset-test-state.sh` MISSING (confirmed). Whole scaffold needs creating.

---

## 2. Preflight results (read-only, BC test only)

| ID | Check | Command | Result |
|---|---|---|---|
| C1 | ClickUp auth | `clickup-auth-test.sh` (BC test token) | **PASS** — 3 workspaces; BC WorkSpace 8555561 reachable (3 members) |
| C2 | List custom fields | `clickup-list-fields.sh 901709622357` | **PASS w/ DISCREPANCY** — returns **27** fields; doc claims **49** |
| S1 | Supabase read | `supabase-connect.sh "SELECT count(*) FROM job_submissions"` | **PASS** — 23 rows (doc said 20; minor drift) |
| V* | Valcre preflight | — | **SKIPPED** — no test env; won't auth as Chris into prod (guardrail) |
| D*/R* | DocuSeal / Resend preflight | — | **N/A** — no CLIs exist to test |

---

## 3. Discrepancies to reconcile (team)

1. **Field count: doc says 49, live test list has 27.** Either the create-task 49-field mapping targets a different/superset list, or the doc is stale. The Phase-2 "49 custom fields populated" assertion will FAIL until reconciled. Which list is canonical?
2. **job_submissions: doc 20 → live 23.** Benign data growth, but update the doc's baseline.

---

## 4. Needs-authoring list (priority)

| Priority | Script | Blocks | Owner | Note |
|---|---|---|---|---|
| HIGH | `tests/scripts/reset-test-state.sh` + dir | every run | qa + apr-domain | Supabase part doable now; Valcre-reset part gated on Q5 (no test env) |
| HIGH | `clickup-update-checklist` | Phase 4.4 + 7.2 | clickup-expert | ClickUp checklist API is a separate endpoint |
| MED | `resend-get-email`, `resend-domain-check` | Phase 5 + off-board item 2 | apr-domain | Resend REST supports both |
| MED | `docuseal-get-submission`, `docuseal-list` | Phase 6 status checks | apr-domain | thin wrappers over DocuSeal API |
| SKIP | `docuseal-complete-submission` | — | — | use Codex portal-sign instead |
| SKIP | `valcre-delete-job` | — | — | prod-risk, no test env; rely on modify-not-create (Q5) |

---

## 5. Bottom line for the team

- **ClickUp + Supabase = ready** for the API-layer checks (one gap: checklist-update).
- **DocuSeal + Resend = need thin read-only wrappers authored** (or lean on Codex/app for the rest).
- **Valcre is the real constraint** — single live prod env as Chris. Off-board item 4 (pin one canonical job, modify-not-create) isn't a nicety, it's the *only* safe pattern. Elevates Ben's open Q5.
- **Codex earns its place** exactly where CLIs are missing/risky: intake form-fill + DocuSeal portal-sign.
