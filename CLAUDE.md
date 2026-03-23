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
4. **Report Builder** — 2084 fields, 79-page HTML template (NOT connected to DB yet)

Stages 1-3: Working in production. Stage 4: Standalone only, needs DB integration.

## Stack

- Frontend: React 18 + TypeScript + Vite (port 5173)
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
| `src/features/report-builder/schema/fieldRegistry.ts` | 22K lines, 2084 field definitions |
| `public/Report-MF-template.html` | 31K-line, 79-page report template |
| `src/features/report-builder/store/reportBuilderStore.ts` | Zustand store (no persistence) |
| `api/valcre.ts` | Vercel serverless — Valcre API proxy with field mapping |
| `src/utils/webhooks/clickup.ts` | ClickUp task creation (personal API token) |
| `src/utils/webhooks/docuseal.ts` | DocuSeal e-signature integration |
| `src/integrations/supabase/client.ts` | Supabase client |
| `src/integrations/supabase/types.ts` | Auto-generated DB types |

## Database (Supabase)

Instance: `ngovnamnjmexdpjtcnky.supabase.co` — LIVE, not paused.

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

## Workflow Rules

1. **Check docs freshness** — use `/audit-docs` if you suspect stale documentation
2. **Clean environment** — remove console.logs, unused imports after work
3. **Plan before refactoring** — write step-by-step plan, get user approval for multi-file changes
4. **UX Feature Commits** — update `docs/-uxui/UX-Feature-Commits.md` after every feature session
5. **README.md** is the single source of truth for project state
