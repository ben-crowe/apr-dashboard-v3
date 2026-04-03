---
name: cli-apr-tools
description: "APR Dashboard integration toolkit — Valcre API, Supabase, DocuSeal, ClickUp, intake form, dashboard, QA, deploy. Searchable engine with ~125 indexed commands."
category: workflow
activation: auto
auto-activate-keywords: ["valcre", "valcre api", "valcre job", "valcre field", "conversion map", "apr dashboard", "apr pipeline", "docuseal", "loe send", "loe signature", "supabase query", "intake form", "field mapping", "field audit", "apr deploy", "apr qa", "apr regression", "apr health check", "clickup task apr", "create valcre", "verify fields", "apr toolkit"]
priority: high
version: 1.0
updated: 2026-03-29
---

# CLI-APR-Tools — APR Dashboard Integration Toolkit

**8 domains, ~125 commands** covering the full APR Dashboard pipeline: intake form, Supabase DB, dashboard UI, Valcre API, DocuSeal e-sign, ClickUp tasks, QA workflows, and deployment.

---

## MANDATORY: Search Before You Act

**Do NOT guess API endpoints, field names, or conversion maps. Search first, every time.**

```bash
# Search all ~125 commands across all domains
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "what you want to do"

# Filter to a specific domain
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "auth token" --domain valcre
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "query jobs" --domain supabase
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "fill form" --domain form
```

### Domains

| Domain | Integration | Rows |
|--------|------------|------|
| `valcre` | Valcre REST API (auth, CRUD, 6 conversion maps, gotchas) | 30 |
| `supabase` | Supabase DB (queries, upserts, schema, gotchas) | 14 |
| `form` | Intake form (fill, submit, gates, options, gotchas) | 15 |
| `dashboard` | Dashboard UI (navigate, actions, auto-save, routes) | 17 |
| `docuseal` | DocuSeal e-sign (send LOE, webhooks, templates) | 10 |
| `clickup` | ClickUp tasks (create, update, checklist, env) | 9 |
| `qa` | QA workflows (pipeline test, field audit, evidence) | 14 |
| `deploy` | Deployment (Vercel push, proxy, env vars, rollback) | 9 |

### Examples

| You Want To | Search Query | Top Result |
|-------------|-------------|------------|
| Create a Valcre job | `"create valcre job"` | `valcre-create-job` — POST /api/valcre with jobData |
| Check conversion maps | `"conversion map"` | `valcre-purposes-map` + all 6 maps |
| Verify fields landed | `"verify fields valcre"` | `valcre-field-verify` — compare sent vs received |
| Query Supabase jobs | `"query jobs supabase"` | `supabase-query-jobs` — SELECT from job_submissions |
| Fill the intake form | `"fill form client"` | `form-fill-client` — 7 client fields |
| Send LOE document | `"send loe"` | `docuseal-send-loe` — POST to DocuSeal submissions/html |
| Deploy to Vercel | `"deploy vercel"` | `deploy-vercel-push` — git push triggers auto-deploy |
| Run QA regression | `"full pipeline test"` | `qa-full-pipeline` — 7-step end-to-end test |
| Check known bugs | `"known issues"` | `qa-known-issues` — 10 ranked issues |
| Valcre field name gotcha | `"scopes field name"` | `valcre-field-name-gotcha` — Scopes NOT ScopeOfWork |

---

## Quick Decision

```
Valcre API operations?              -> --domain valcre
Database queries?                   -> --domain supabase
Filling the intake form?            -> --domain form
Dashboard navigation + actions?     -> --domain dashboard
LOE / e-signature?                  -> --domain docuseal
ClickUp task management?            -> --domain clickup
Testing / verification?             -> --domain qa
Deploying / environment?            -> --domain deploy
Not sure?                           -> search all (default)
```

---

## Domain: Valcre (30 commands)

**API Base:** `https://api-core.valcre.com/api/v1/` (OData)
**Auth:** `https://auth.valcre.com/oauth/token` (OAuth password grant)
**Web UI:** `https://app.valcre.com`

### 6 Conversion Maps

| Map | Dashboard Field | Valcre Field | Values |
|-----|----------------|-------------|--------|
| PURPOSES_MAP | Property Rights | Purposes | 15 (FeeSimple, LeasedFee, ...) |
| REQUESTED_VALUES_MAP | Valuation Premises | RequestedValues | 17 (AsIs, Liquidation, ...) |
| REPORT_FORMAT_MAP | Report Type | ReportFormat | 10 (Appraisal, RestrictedAppraisal, ...) |
| SCOPE_OF_WORK_MAP | Scope of Work | Scopes | 14 (AllApplicable, CostApproach, ...) |
| INTENDED_USES_MAP | Intended Use | IntendedUses | 17 (Financing, AcquisitionDisposition, ...) |
| PROPERTY_TYPE_MAP | Property Type | PropertyType + Types | 14 valid types + PascalCase multi-select |

### Critical Gotchas

- **Scopes NOT ScopeOfWork** — API rejects ScopeOfWork. Field name is `Scopes`.
- **Creation vs Update gap** — RequestedValues and Scopes were only set in UPDATE path, not CREATION.
- **Contact address** — Was using property address instead of client address (fixed).
- **Parcel fields → Comments** — 8 parcel/assessment fields go to Comments during PATCH (no entity ID).

---

## Domain: Supabase (14 commands)

**Instance:** `ngovnamnjmexdpjtcnky.supabase.co` (LIVE)
**Tables:** job_submissions(20), job_loe_details(12), client_profiles(104), job_files(10), job_property_info(7)
**MISSING:** report_builder_data table (blocks Report Builder persistence)

### Critical Gotcha

- **Valuation premises gap** — Form writes to job_submissions. Valcre gate checks job_loe_details. Different tables, same field name. New jobs have value visible on screen but gate fails.

---

## Domain: Form (15 commands)

**URL:** `/` (root)
**18 fields** + file upload. No auth gate.

### Workflow Gates

- **Valcre gate:** 6 fields (Property Address, Type, Intended Use, Fee, Scope, Valuation Premises)
- **LOE gate:** VAL number + Client First/Last/Email + Property Address

---

## Domain: Dashboard (17 commands)

**URL:** `/dashboard`
**Port:** 5173 (Vite dev)

### Critical Gotcha

- **Vite proxy** — `/api` routes proxy to production Vercel. Local `api/` changes invisible until deployed.

---

## Domain: DocuSeal (10 commands)

**Template ID:** 1680270
**Active path:** V3 HTML template (generateLOE.ts) — fills ALL fields
**Dead code:** docuseal.ts mapJobToDocuSealFields (legacy SELECT fields)

---

## Domain: ClickUp (9 commands)

**Auth:** Personal API token (not OAuth)
**Env:** test (BC WorkSpace) or production (Valta)
**Template:** t-86b3exqe8 (same in both)

---

## Domain: QA (14 commands)

**Evidence:** `/tmp/apr-field-audit/round{1-5}/`
**5-round pattern:** R1=code audit, R2=live browser, R3=full pipeline, R4=API+web verify, R5=clean verification

---

## Domain: Deploy (9 commands)

**Platform:** Vercel (auto-deploy from GitHub main)
**Local build:** `vercel build --prod && vercel deploy --prebuilt --prod` (bypasses remote builder)

---

## Common Mistakes

- Using wrong Valcre field name (ScopeOfWork vs Scopes)
- Editing api/valcre.ts locally and expecting it to work (dev proxies to production)
- Checking job_submissions for valuation_premises when the gate checks job_loe_details
- Assuming DocuSeal SELECT fields are empty (V3 template path fills all)
- Calling ClickUp API directly from browser (CORS blocks it — use edge function)

---

## Source Files

| File | Purpose |
|------|---------|
| `api/valcre.ts` | Valcre serverless function (6 conversion maps, all field mapping) |
| `src/utils/webhooks/clickup.ts` | ClickUp task creation and updates |
| `src/utils/webhooks/docuseal.ts` | DocuSeal webhook handler (legacy) |
| `src/utils/loe/generateLOE.ts` | V3 LOE HTML template generator (active) |
| `src/utils/fieldMappings.ts` | Field mapping utilities |
| `tests/valcre/*.ts` | 3 Valcre test scripts (job by ID, by number, property types) |
| `/tmp/apr-field-audit/` | QA evidence from 5 rounds (74 files) |

---

## Version History

### v1.0 (2026-03-29) — Initial build

8 domains, ~125 commands extracted from 5 QA rounds + codebase analysis. BM25 search engine with keyword boost. Built by react-specialist from cli-apr-tools-SPEC.md.
