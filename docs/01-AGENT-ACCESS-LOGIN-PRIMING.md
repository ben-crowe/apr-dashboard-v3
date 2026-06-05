---
content_type: access-priming-sheet
title: Agent Access, Login & Priming — APR Dashboard, ClickUp, Supabase, Valcre
status: living — the single startup/handover sheet
home: 00-APR-MASTER-DASHBOARD.md
owner: co-architect (maintains) · used by every agent before touching any APR system
tags: [apr-workflow, access, login, priming, startup, agent-handover, clickup, supabase, valcre, cli-tools, agent-browser, master-document]
keywords: [how to log in APR dashboard, agent access sheet, priming sheet, startup skills to load, clickup login token cli, supabase access, valcre login cli, agent handover, dashboard credentials, isolated session apr-qa, this is how you do it]
related: [00-APR-MASTER-DASHBOARD.md, AGENT-CLI-TOOLING-SOP.md, ../Data-Flow Visuals/01-Data-Flow-Diagram.md, ../tests/E2E-TESTING-WORKFLOW-MASTER.md]
---

# Agent Access, Login & Priming Sheet

`#apr-workflow` `#access` `#login` `#priming` `#startup` — the ONE place an agent learns how to
get into and drive every APR system. Not scattered across five files.

> **This is the startup/handover sheet.** Before ANY agent touches the APR Dashboard, ClickUp,
> Supabase, or Valcre, it does STEP 1 (load skills) + STEP 2 (ground via search), then uses the
> per-system access blocks below. Other areas (e.g. a dedicated ClickUp doc) point BACK here for
> "how do I log in / what CLIs" instead of duplicating it. It's a living doc — update it when
> access changes.

---

## STEP 1 — Load these skills FIRST (the predefined startup set)

Never improvise with raw browser JS. Load these by slash name before doing anything:

| Skill | Purpose |
|---|---|
| `/cli-browser-auto` | The agent-browser engine (127-cmd CLI) — open URLs, snapshot for refs, click, scroll. The driver for everything. |
| `/agent-fill-fields` | The canonical fill skill — real keystrokes, never JS `.value` (see Golden Rule). |
| `/agent-screenshot` | Capture skill — Method 2 for the APR web app (headless, isolated session). |
| `/cli-apr-tools` | APR-specific CLI helpers (search: `python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "<intent>"`). |
| `/cli-clickup-tools` | 60-command ClickUp CLI (task CRUD, custom fields, lists). |
| `/supabase-deploy` | Supabase CLI (edge fns, migrations, SQL) — auto-authed. |

---

## STEP 2 — Ground yourself (SS12 two-phase search)

Before driving anything, run the full two-phase search so you recover prior method instead of
re-deriving it:
- Phase 1: `~/.claude/scripts/context-search --agent <name> --topic "<topic>"`
- Phase 2: `/search-all "<topic>"` (all five layers — JSONL, Cognee, Gemini, Vault, Files)

Report RICH/THIN/EMPTY per layer. Do NOT guess what was already solved.

---

## APR Dashboard — access

- **Production (use this for testing):** `https://apr-dashboard-v3.vercel.app`
- **Local dev:** `http://localhost:8086` (port set in vite.config.ts — NOT 5173; 5173 is KM-Exp).
- **Job URL pattern:** `…/dashboard/job/<jobUUID>`. Pinned test job VAL261101 "Westside Mall" = `https://apr-dashboard-v3.vercel.app/dashboard/job/e5a7ba2f-0535-4fbf-9ba7-b7027cf0a157`.

**Isolation rule (critical):** ALWAYS use a unique `--session <name>` (e.g. `apr-qa`).
- Plain `agent-browser` with no session rides the `default` CDP session = **hijacks Ben's KM-Exp app.**
- Never `--headed`, never `--cdp 9222` (that IS KM-Exp). Safety tripwire: confirm KM-Exp stayed on its own port before/after.

**Open + confirm:**
```bash
agent-browser --session apr-qa open "https://apr-dashboard-v3.vercel.app/dashboard/job/<uuid>"
sleep 3
agent-browser --session apr-qa get url     # confirm it landed
agent-browser --session apr-qa snapshot -i # get @refN interactive refs
```

**Login flow:** snapshot → `fill @ref` the email → click Next → `fill @ref` the password → click Sign in → `get url` confirms the dashboard. Once logged in, the named `--session` PERSISTS the login — subsequent commands in the same session ride it (no re-login).

**Dashboard login credentials:**
> ⚠ PENDING — Ben to provide ONCE, then saved here so no agent is ever blocked.
> - Email: `__PENDING__`
> - Password: `__PENDING__`
> Alternative: Ben logs in once in the agent's `apr-qa` session and the agent rides that session.

---

## ClickUp — access + CLIs

- **Skill:** `/cli-clickup-tools` (60 commands). Search first: `python3 ~/.claude/skills/cli-clickup-tools/scripts/search.py "<intent>"`.
- **Tokens (NEVER hardcode in app code):** documented in `/cli-clickup-tools` + the API-key reference. `pk_10791838…` = TEST writes, `pk_54774263…` = PRODUCTION reads. Edge functions read the Supabase SECRET `CLICKUP_API_TOKEN` — never a hardcoded fallback (that's the stale-token 401 trap).
- **Team IDs:** `8555561` (Ben's BC workspace — testing) · `9014181018` (Valta — production).
- **Lists:** TEST = `901709622357` ("APR Test — Valta Mirror", 27 fields) · PRODUCTION = `901402094744` (Chris's Valta — NEVER write during testing) · template = `t-86b3exqe8`.
- **CLI session export:** `export CLICKUP_API_TOKEN=<test token>` + `CLICKUP_TEAM_ID=8555561`.
- **Gotcha:** ClickUp is login-gated, so a headless `--session` browser hits the login wall — can't cleanly screenshot a card. Either Ben screenshots from his real browser, or render the card from live data into a clean image. Don't fight the login wall.

---

## Supabase — access

- **Project:** `ngovnamnjmexdpjtcnky` (`ngovnamnjmexdpjtcnky.supabase.co`) — LIVE, never local (`127.0.0.1:54321`).
- **Auth:** persisted no-expiry PAT — use `/supabase-deploy`. NEVER ask for or paste a token.
- **Agent rights:** builder agents have full access — run migrations, query, modify schema directly via the Supabase MCP/CLI. No routing through Ben.
- **Secrets live in Supabase** (e.g. `CLICKUP_API_TOKEN`) — edge functions read them there.

---

## Valcre — access + CLIs

- **App access = server-side proxy** `api/valcre.ts` (Vercel function). API creds in Vercel env vars only (`VALCRE_CLIENT_ID`, `VALCRE_CLIENT_SECRET`, `VALCRE_PASSWORD`) — never client-side.
- **Direct CLIs** (in `~/.claude/scripts/apr/`):
  - `valcre-auth.sh` — authenticate (WORKS; HTTP 200, valid token).
  - `valcre-verify-job.sh` — verify a job by number (had a `$filter` URL-encoding bug — fix that, not auth).
  - `valcre-get-custom-field-values.sh` — **GetValues readback** (the truth check).
  - `valcre-list-custom-fields.sh` · `valcre-set-custom-field.sh` · `valcre-create-custom-fields.sh` · `valcre-patch-custom-field-options.sh` · `valcre-field-audit.sh`.
- **Test job:** VAL261101 / **Valcre Id `784140`**. Name-match guard ("Westside Mall") before ANY write — VAL numbers get reassigned to real clients.
- **No test env** — every call is prod-as-Chris. Modify the one test job; batch any creates.
- **GOLDEN: HTTP 200 ≠ success.** Valcre returns 200 even on silent internal failure (custom-field AND native PATCH). ALWAYS GetValues readback to confirm the value landed.

---

## THE GOLDEN RULE — fill with real keystrokes, never raw JS

- **Method 1 (CORRECT):** `agent-browser --session <name> fill @ref "value"` — real CDP keystrokes, fires React `onChange` + real `blur` → `handleBlur → autoSaveField → debounce → supabase.update`. Persists.
- **Dropdowns:** real **click** the trigger then the option (Radix `onValueChange` needs a trusted click).
- **Method 3 (THE TRAP — never):** raw `eval` `el.value=…; dispatch('input')` — looks filled, never blurs, saves nothing. On reload every field is empty.
- **Verify by RELOAD, not read-back.** UI state can show a value that never hit the DB.
- **Forbidden:** the LOE "Test Data" button (bulk-overrides synced fields); spawning test jobs; plain sessionless `agent-browser`.

---

## Where this connects

This sheet is the access/priming hub. These point back here for login + CLI usage:
- [Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md) — the navigation front door.
- [Agent CLI & Browser Tooling SOP](~/Development/APR-Dashboard-v3/docs/AGENT-CLI-TOOLING-SOP.md) — deeper driving mechanics + the session tally.
- [Data-Flow Visual Verification Workflow](~/Development/APR-Dashboard-v3/Data-Flow%20Visuals/01-Data-Flow-Diagram.md) — QA's screenshot workflow (uses this access).
- [E2E Testing Workflow Master](~/Development/APR-Dashboard-v3/tests/E2E-TESTING-WORKFLOW-MASTER.md) — the full pipeline test.

---

## Refinement log
- **2026-06-05** — v1 created. Consolidated the startup skill set + APR/ClickUp/Supabase/Valcre access + the Golden Rule into one standalone, searchable sheet so access is never a guess. Dashboard login creds slot left PENDING for Ben.
