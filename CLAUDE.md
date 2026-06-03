# APR Dashboard v3 — Agent Instructions

## Agent Context Priming

On activation, run:
```
/agent-startup ~/Development/APR-Dashboard-v3
```
This searches Gemini checkpoints with keywords matching your task area.
Checkpoint prefixes: APR-DB, APR-PIPELINE, APR-REPORT, APR-DEPLOY, APR-STATUS

---

## Project Overview

4-stage appraisal workflow system:
1. **Client Intake** — submission form → job_submissions table
2. **Job Management** — Valcre API (job creation) + ClickUp (task tracking)
3. **E-Signature** — DocuSeal (LOE documents, webhook-driven)
4. **Report Builder** — 2082 fields, 79-page HTML template (NOT connected to DB yet)

Stages 1-3: Working in production. Stage 4: Standalone only, needs DB integration.

## Stack

- Frontend: React 18 + TypeScript + Vite (dev port **8086** — set in vite.config.ts. NOT 5173; 5173 is KM-Exp's dev server)
- UI: Tailwind CSS + Shadcn UI
- Backend: Supabase (PostgreSQL) + Vercel serverless functions
- Integrations: Valcre API, ClickUp (personal API token), DocuSeal, Resend (email)
- Deployment: Vercel (auto-deploy from GitHub main)
- State: Zustand (report builder)

## Core Principles

1. **TypeScript Strict Mode** — all new code fully typed, no `any`
2. **4-File Sync Requirement** — Report Builder field changes must update: fieldRegistry.ts, TestDataSet, Report-MF-template.html, EditPanel components
3. **UI/Styling** — Tailwind CSS + Shadcn UI only. No generic CSS.
4. **Vertical Slice Architecture** — each feature is a complete slice (DB, API, logic, UI, tests)

## Key Files

| File | Purpose |
|------|---------|
| `src/features/report-builder/schema/fieldRegistry.ts` | 22K lines, 2082 field definitions |
| `public/Report-MF-template.html` | 31K-line, 79-page report template |
| `src/features/report-builder/store/reportBuilderStore.ts` | Zustand store (no persistence) |
| `api/valcre.ts` | Vercel serverless — Valcre API proxy with field mapping |
| `src/utils/webhooks/clickup.ts` | ClickUp task creation (personal API token) |
| `src/utils/webhooks/docuseal.ts` | DocuSeal e-signature integration |
| `src/integrations/supabase/client.ts` | Supabase client |
| `src/integrations/supabase/types.ts` | Auto-generated DB types |

## Database (Supabase)

Instance: `ngovnamnjmexdpjtcnky.supabase.co` — LIVE, not paused.

**Agent Access:** react-specialist (and any builder agent) has FULL Supabase access — can run migrations, query data, modify schema directly via the Supabase MCP or CLI. No need to route migrations through Ben or CoArch. Agents can apply their own SQL migrations.

Core tables with data:
- `job_submissions` (20 rows) — main job records
- `job_loe_details` (12) — LOE/quote line items + DocuSeal columns
- `client_profiles` (104) — CRM client data
- `job_files` (10) — uploaded documents
- `job_property_info` (7) — property details

CRITICAL: `report_builder_data` table DOES NOT EXIST. Must be created before Report Builder can persist data.

## Integrations

**Valcre:** Server-side Vercel function (`api/valcre.ts`). API key in Vercel env vars only.

**ClickUp:** Personal API token (VITE_CLICKUP_API_TOKEN). Two environments:
- Test: BC WorkSpace, list 901703694310
- Production: Valta workspace, list 901402094744
- Template: t-86b3exqe8
- Requires Valcre job number before task creation

**DocuSeal:** Template ID 1680270. Edge function proxy. Custom emails via Resend API. Webhook updates DB + ClickUp on signature completion. Status: Production/Audited.

## Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Index (SubmissionForm) | Client intake form |
| `/login` | Login | Supabase auth |
| `/dashboard/*` | Dashboard | Main app (jobs, details, actions) |
| `/mock-builder` | MockReportBuilder | Standalone report builder |
| `/sign/:id` | SigningPage | DocuSeal signing |
| `/calculator-demo` | CalculatorDemoPage | Calculation engine demo |

## Current Priorities (In Order)

1. Create `report_builder_data` table + migration
2. Route: `/dashboard/job/:jobId/report`
3. Data bridge: job data → Report Builder "Home" section
4. Auto-save: 2-second debounce

## Documentation

| Topic | Location |
|-------|----------|
| Features Overview | `docs/Features/00-FEATURES-OVERVIEW.md` |
| Report Builder | `docs/Features/07-Report-Builder/` |
| Field Registry | `docs/Features/08-Master-Field-Registry/` |
| Template Management | `docs/Features/09-Template-Management/` |
| LOE E-Signature | `docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md` |
| ClickUp Patterns | `docs/Features/04-Job & Client Mgt./` |
| Architecture | `docs/Architecture/APR-V4-ARCHITECTURE.md` |
| UX Documentation | `docs/-uxui/` |
| UX Feature Commits | `docs/-uxui/UX-Feature-Commits.md` |

## Browser Testing — Agent-Browser First

**MANDATORY: Use agent-browser CLI as the default for all browser testing.**

Load the skill first, then use the CLI:

```bash
# Load the skill FIRST
/cli-browser-auto

# Then use agent-browser
agent-browser open http://localhost:8086/dashboard   # APR dev port = 8086 (vite.config.ts). HEADLESS only — never --headed, never computer-use. 5173 = KM-Exp, not APR.
agent-browser snapshot -i
agent-browser click @e42
agent-browser screenshot /tmp/qa-check.png
```

**When to use which tool:**

| Task | Tool | Why |
|------|------|-----|
| Visual QA, screenshots | agent-browser | Screenshots work reliably, compact output, less context |
| Navigation, clicking, scrolling | agent-browser | Simple CLI syntax, @ref-based, fast |
| Filling React controlled inputs | Playwright MCP | Native input setter handles React state correctly |
| Arbitrary DOM queries, React state | Playwright MCP | JS evaluate bypasses ref system |
| Default for any new QA task | agent-browser | Start here, escalate to Playwright only when needed |

agent-browser is the default. Playwright MCP is the escape hatch for raw JS and React controlled input filling.

**Deploying agents must include this in every brief:** "Load `/cli-browser-auto` skill before any browser testing. Use agent-browser, not Playwright MCP."

## GitHub Auth — Agent Self-Service

**Agents have CLI access to GitHub. Do NOT ask Ben to authenticate.**

If `git push` fails with auth errors:
1. Check: `gh auth status`
2. If expired, switch remote to HTTPS and re-auth:
   ```bash
   git remote set-url origin https://github.com/ben-crowe/apr-dashboard-v3.git
   gh auth logout -h github.com -u ben-crowe <<< "Y"
   gh auth login --hostname github.com --git-protocol https --web
   ```
3. The device flow opens a browser — Ben approves once, token persists in keyring
4. Push: `git push origin main`

**Remote protocol:** HTTPS with gh credential helper (configured in global git config). No SSH keys on this machine.

## Deployment — Vercel

**Use Vercel CLI for all deploys. Do NOT just push to main and wait.**

```bash
cd ~/Development/APR-Dashboard-v3
vercel --prod
```

This builds and deploys in one command with live output. You see errors immediately instead of checking the Vercel dashboard.

**Vercel project:** `prj_VkmkFydnDLN6l2EWAX7H1tuY8B4A`
**Framework:** Vite (NOT Next.js)
**Production URL:** `https://apr-dashboard-v3.vercel.app`

**Deploy checklist:**
1. `npm run build` locally first — catch TypeScript errors before deploying
2. `vercel --prod` — deploy with live output
3. Verify production URL loads after deploy completes

**NEVER create workarounds for build failures.** If the build breaks:
- Read the error message
- Fix the root cause
- Do NOT add symlinks, aliases, or disable routes as band-aids
- If unsure, ask before hacking around it

## No Workarounds Rule

**Fix root causes. Do not create band-aids.**

Examples of what NOT to do:
- Symlinks to make duplicate code paths work (breaks Vercel)
- Vite aliases to paper over broken imports
- Disabling routes to avoid build errors
- Commenting out imports instead of fixing paths

If a build breaks, the fix is: update the imports, move the files, or fix the code. One canonical location for every module. No duplicates, no symlinks, no aliases.

## Workflow Rules

1. **Check docs freshness** — use `/audit-docs` if you suspect stale documentation
2. **Clean environment** — remove console.logs, unused imports after work
3. **Plan before refactoring** — write step-by-step plan, get user approval for multi-file changes
4. **UX Feature Commits** — update `docs/-uxui/UX-Feature-Commits.md` after every feature session
5. **README.md** is the single source of truth for project state
