# APR Dashboard v3 — Agent Instructions

## 🚫 NO LOGIN — THE APP IS WIDE OPEN (read this first, never forget it)

**There is NO login on this app. It is wide open. Nobody — no agent, not Ben — ever logs in.**
Every route renders directly: `/dashboard`, the job details, the LOE/email flows — open the URL and it's there. Yes, a `/login` route and Supabase-auth code exist in the source; they are NOT enforced. **DO NOT spend a single second logging in, provisioning credentials, saving passwords, or "authenticating as a test account."** If you ever think a screen needs a login: it doesn't — just open the route with your browser tool and screenshot it.
(The only auth-shaped thing that's real is RLS on *database writes* — and even that is OFF on the email tables. Page access is never gated. Never conflate "anon DB write" with "the page needs a login.")

## ⭐ START / RESUME HERE — READ THE MASTER DASHBOARD FIRST (mandatory)

**Before ANY significant work on this project — and on EVERY restart, post-compact resume, or first activation — READ the full APR Master Dashboard:**

```
docs/00-APR-MASTER-DASHBOARD.md
```

Read it **in full, all sections** — not a skim of the top:
- **Significant Features** — the whole pipeline (intake → job → field-sync → LOE/e-sign → closing) + where every feature & doc lives.
- **Accounts & Access** — what runs on Ben's test accounts vs the client's, and the cutover gate.
- **Testing** — THE end-to-end testing workflow (`tests/E2E-TESTING-WORKFLOW-MASTER.md`), the visual-verification workflow, the CLI tooling inventory, and how agents drive the app. **Know the team's tools before doing anything manual.**
- **Reference** — field maps, Valcre/ClickUp wiring, the registry source of truth.
- **Status & Filing** — what's proven (`[x]`), in-flight (`[~]`), open (`[ ]`).

It is the single source of truth for what's built, what's wired, where everything lives, how to test, and current status. **Do not start designing, building, or testing until you've read it.** This is the canonical "resume working on APR" step — every agent restarting the project runs it.

**The `/prime-apr` skill runs this whole sequence for you** — full dashboard read → full SS12 search on the parts → a "where the project stands" briefing — before any work. Fire it on first activation, after any `/compact`, or whenever resuming APR. (Aliases: `/apr-prime`, `/resume-apr`.)

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
4. **Report Builder** — field registry + 79-page HTML template (count it live, never trust a quoted number: `grep -c 'id: "' src/features/report-builder/schema/fieldRegistry.ts`; domain context: `/apr-domain` skill)

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
| `src/features/report-builder/schema/fieldRegistry.ts` | The field registry — single source of truth for "do we have this field" (grep it live; counts in docs go stale) |
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

## Browser / Visual Testing

**Which browser tool to use is NOT set here — it lives in the browser skills an agent loads** (`/cli-browser-auto`, `/cmux-browser`), which the Main workspace keeps current with whatever is actually working. A tool named in this project file goes stale the moment that tool breaks or is replaced, and then contradicts what agents are deployed with — so tool choice belongs to the skill, not here. Load your browser skill and use the tool it specifies; if it says a tool is down, follow the skill's current alternative.

**APR-specific facts a skill can't know (these DO belong here):**

- **Dev server port is 8086** (`vite.config.ts`). 5173 is KM-Exp, not APR.
- **Headless only.** Never a headed browser, never computer-use.
- **No login, ever.** Every route renders directly — do not authenticate (see the top of this file). Just open the route and screenshot it.

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
