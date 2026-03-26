# APR Testing Playbook

**Status:** Active reference document
**Created:** 2026-03-26
**Author:** apr-domain-agent (DSLP session)
**Purpose:** The single source of truth for how to run, view, test, and verify APR Dashboard v3. Every agent working on APR reads this before testing anything.

---

## 1. How to Run APR Locally

### Dev Server (Frontend Only)

```bash
cd ~/Development/APR-Dashboard-v3
npm run dev
```

- **Port:** 8086 (configured in `vite.config.ts`, NOT the Vite default 5173)
- **URL:** `http://localhost:8086`
- **API Proxy:** `/api` requests proxy to `https://apr-dashboard-v3.vercel.app` (production Vercel)
- **Hot reload:** Yes (Vite HMR)

### CRITICAL: Local vs Production Architecture

```
LOCAL DEV (port 8086)          PRODUCTION (Vercel)
+------------------+          +------------------+
|  Vite Frontend   |  /api →  |  Vercel Backend   |
|  (UI changes     |  proxy   |  (serverless fns)  |
|   local only)    | -------> |                    |
+------------------+          +--------+-----------+
                                       |
                              +--------v-----------+
                              |  Supabase (LIVE)    |
                              |  SAME DB as client  |
                              +---------------------+
```

- **UI changes are local-only** until pushed to Vercel. Safe to iterate.
- **ALL API calls hit live Vercel backend** via the proxy. Data is REAL.
- **Database is LIVE Supabase** -- the same DB the client uses.
- **DO NOT modify client data during testing.** Use test records or read-only queries.
- This means: **safe to touch UI, dangerous to touch data.**

### Vercel Dev Server (Frontend + Serverless Functions)

```bash
cd ~/Development/APR-Dashboard-v3
npm run vercel-dev
```

- **Port:** 3000 (via `vercel dev --listen 3000`)
- **Includes:** Vercel serverless functions (e.g., `api/valcre.ts`) running locally
- **Use when:** Testing serverless functions or the Valcre API proxy locally

### Expected Output (npm run dev)

```
VITE v5.4.20  ready in ~1s

  > Local:   http://localhost:8086/
  > Network: http://[::]:8086/
```

If the port is already in use, Vite will auto-increment. Always check the terminal output for the actual port.

### Prerequisites

- Node.js 18+
- `npm install` (run if `node_modules/` is missing or stale)
- `.env.local` with Supabase credentials (3 env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`)

### IMPORTANT: Two Separate UIs

APR has two distinct interfaces at different routes. When delegating work, **always specify which one**.

| UI | Routes | Audience | Purpose |
|----|--------|----------|---------|
| **Intake Form** | `/`, `/appraisal-request-form` | Client-facing | Appraisal request submission |
| **Dashboard** | `/dashboard` | Internal (requires auth) | Job management, LOE, actions |

**Never say "the dashboard" when you mean the intake form.** They are separate UIs.

### Complete Route Map

**Client-Facing:**
| Route | What You Should See |
|-------|-------------------|
| `/` | Client intake submission form |
| `/appraisal-request-form` | Same intake form (alternate route) |
| `/sign/:id` | DocuSeal signing page |

**Internal (Auth Required):**
| Route | What You Should See |
|-------|-------------------|
| `/login` | Supabase auth login page |
| `/dashboard` | Main dashboard -- jobs, details, actions |

**Report Builder / Tools:**
| Route | What You Should See |
|-------|-------------------|
| `/mock-builder` | Standalone Report Builder (79-page preview) |
| `/calculator-demo` | Calculator engine demo |
| `/calculator-preview` | Calculator preview mode |
| `/standalone-calculator` | Standalone calculator |
| `/test-input` | Field input testing page |
| `/test-loe` | LOE testing page |
| `/image-test` | Image configurator testing |

**System / Utility:**
| Route | What You Should See |
|-------|-------------------|
| `/diagnostic` | System diagnostic page |
| `/style-guide` | UI style guide reference |
| `/clickup/callback` | ClickUp OAuth callback handler |

---

## 2. How to View APR

### Standard: KM-Exp Browser Panel

**We do NOT open localhost in a standalone browser.** Use the KM-Exp browser panel via `/open-in-km`.

```bash
# Open APR in the KM-Exp browser panel
/open-in-km http://localhost:8086
```

Or via curl (if the skill isn't available):

```bash
PORT=$(tmux show-environment -g KM_SERVER_PORT 2>/dev/null | cut -d= -f2)
curl -s -X POST "http://127.0.0.1:$PORT/api/browser-open" \
  -H 'Content-Type: application/json' \
  -d '{"url":"http://localhost:8086"}'
```

### Viewing Specific Routes

```bash
/open-in-km http://localhost:8086/mock-builder    # Report Builder
/open-in-km http://localhost:8086/dashboard        # Dashboard (needs auth)
/open-in-km http://localhost:8086/calculator-demo   # Calculator demo
```

### Why KM-Exp Panel (Not Browser)

- Agents can screenshot, click, and inspect via the Browser Panel API
- Consistent environment across all agents
- No "which browser?" confusion
- Integrated with agent tooling (snapshot, click, fill)

---

## 3. How to Test Visually

### AG (Antigravity) -- Visual QA

AG is the only agent that can **visually see and interact** with a live browser. Use AG for:

- Color verification (does this blue match the design?)
- Layout checking (is the spacing correct?)
- Responsive testing (resize viewport)
- Before/after comparison (screenshot, make change, screenshot again)
- Visual regression detection
- Checking font rendering, hover states, animations

**How to request AG visual QA:**

```
# From any Claude Code agent, message AG via tmux:
tmux send-keys -t ag "Please open http://localhost:8086/mock-builder and verify: (1) page layout matches reference, (2) colors match APR brand, (3) no overflow/clipping issues" Enter
```

AG uses Gemini's multimodal vision -- it literally sees the rendered page and can describe what's wrong.

### Playwright MCP -- Screenshots and Interaction

The Playwright MCP server provides browser automation tools for programmatic testing.

**Take a screenshot:**

```
mcp__playwright__browser_navigate → url: "http://localhost:8086/mock-builder"
mcp__playwright__browser_take_screenshot → (no params for full page)
```

**Click an element:**

```
mcp__playwright__browser_click → element: "Submit" (or CSS selector)
```

**Fill a form field:**

```
mcp__playwright__browser_fill_form → element: "Client Name", value: "Test Client"
```

**Get page snapshot (accessibility tree):**

```
mcp__playwright__browser_snapshot → (returns interactive elements with refs)
```

### KM-Exp Browser Panel API -- Quick Interaction

For pages already loaded in the KM-Exp panel:

```bash
PORT=$(tmux show-environment -g KM_SERVER_PORT 2>/dev/null | cut -d= -f2)

# Get accessibility snapshot of current page
curl -s -X POST "http://127.0.0.1:$PORT/api/browser-snapshot"

# Click an element by ref
curl -s -X POST "http://127.0.0.1:$PORT/api/browser-click" \
  -H 'Content-Type: application/json' \
  -d '{"ref":"E42"}'

# Fill an input
curl -s -X POST "http://127.0.0.1:$PORT/api/browser-fill" \
  -H 'Content-Type: application/json' \
  -d '{"ref":"E15","value":"Test Value"}'
```

---

## 4. How to Test Data

### Supabase -- Verify Tables

**WARNING: This is a LIVE production database. The same DB the client uses. DO NOT insert, update, or delete real client data. Use read-only queries for verification. Create test records only in clearly marked test rows.**

**Direct query via Supabase dashboard:**
Instance: `ngovnamnjmexdpjtcnky.supabase.co`

**Core tables to verify:**

| Table | Expected Rows | What to Check |
|-------|--------------|---------------|
| `job_submissions` | 20+ | Main job records, check `status` field |
| `job_loe_details` | 12+ | LOE line items, check DocuSeal columns |
| `client_profiles` | 104+ | CRM data, check `email` uniqueness |
| `job_files` | 10+ | Uploaded documents, check storage paths |
| `job_property_info` | 7+ | Property details linked to jobs |

**CRITICAL:** `report_builder_data` table DOES NOT EXIST. Any test expecting this table will fail until it's created (Priority #1 blocker).

### Valta Master Field Spec

The client's field specification is at `docs/VALTA-FIELD-SPEC.md`:
- 65 fields, 22+ dropdowns, 26 business rules, narrative templates
- This is the CLIENT's specification -- what the app needs to match
- The internal field registry (2,082 fields) is the implementation; this spec is the requirement

### Field Sync Verification

The 4-file sync set must stay aligned. To verify:

```bash
cd ~/Development/APR-Dashboard-v3

# 1. Count fields in registry
grep -c '^\s*id: "' src/features/report-builder/schema/fieldRegistry.ts
# Expected: 2,082

# 2. Count placeholders in template
grep -o '{{[^}]*}}' public/Report-MF-template.html | sort -u | wc -l
# Should be <= field count (not all fields have template placeholders)

# 3. Count test data entries
grep -c '^\s*"' src/features/report-builder/data/TestDataSet1.ts
# Should cover key fields

# 4. Verify a specific field exists in all files
FIELD="comp1-sale-price"
echo "Registry:"; grep "$FIELD" src/features/report-builder/schema/fieldRegistry.ts | head -1
echo "Template:"; grep "$FIELD" public/Report-MF-template.html | head -1
echo "TestData:"; grep "$FIELD" src/features/report-builder/data/TestDataSet1.ts | head -1
```

### Report Builder Data Verification

Since there's no DB persistence yet, Report Builder data lives only in the Zustand store (in-memory). To verify data flow:

1. Open `/mock-builder` in browser panel
2. Use the "Load Test Data" button (loads TestDataSet1 -- North Battleford sample)
3. Check that fields populate in the edit panel
4. Check that the HTML preview renders with interpolated values
5. **Data does NOT persist** across page reloads -- this is expected until `report_builder_data` table exists

---

## 5. How to Test Deployment

### Vercel Preview Deploys

Every push to a non-main branch creates a preview deploy.

```bash
# Check deployment status
cd ~/Development/APR-Dashboard-v3
vercel ls

# Check specific deployment
vercel inspect [deployment-url]
```

**Vercel project:** `prj_VkmkFydnDLN6l2EWAX7H1tuY8B4A`
**Framework:** Vite (NOT Next.js)
**CLI version:** v48.1.0

### Verify Production is Live

```bash
# Check production URL responds
curl -s -o /dev/null -w "%{http_code}" https://apr-dashboard-v3.vercel.app
# Expected: 200

# Check Valcre API function is deployed
curl -s -o /dev/null -w "%{http_code}" -X OPTIONS https://apr-dashboard-v3.vercel.app/api/valcre
# Expected: 200 (CORS preflight)
```

### Build Verification

```bash
cd ~/Development/APR-Dashboard-v3
npm run build
# Should complete with no TypeScript errors
# Output in dist/ directory
```

**NEEDS VERIFICATION:** Whether `npm run build` currently passes cleanly or has warnings. Run it to check.

---

## 6. How to Test Integrations

### DocuSeal (E-Signature)

**Status:** Production/Audited

DocuSeal is accessed via Supabase Edge Functions, not directly from the frontend.

- **Proxy:** `supabase/functions/docuseal-proxy/` -- relays to `https://api.docuseal.com`
- **Webhook:** `supabase/functions/docuseal-webhook/` -- handles `submission.created` and `submission.completed`
- **Email:** `supabase/functions/send-loe-email-fixed/` -- sends via Resend API
- **Template ID:** 1680270

**Test flow:**
1. Navigate to a job in the dashboard
2. Open the LOE section
3. Click "Preview & Send LOE"
4. Verify the preview renders correctly
5. Send to a test email address
6. Check that `job_loe_details` row updates with `submission_id`

**NEEDS VERIFICATION:** Whether a test/sandbox DocuSeal environment exists or if all testing hits production.

### Valcre API (Job Management)

**Status:** Production

- **Endpoint:** `api/valcre.ts` (Vercel serverless function)
- **API key:** In Vercel env vars only (NOT in `.env.local`)
- **Format:** OData
- **Max duration:** 30 seconds

**Test pattern:**
```bash
# Test via the Vercel production proxy (from local dev, /api is proxied)
curl -X POST http://localhost:8086/api/valcre \
  -H 'Content-Type: application/json' \
  -d '{"action": "getJobs"}'
```

**NEEDS VERIFICATION:** Exact request format and expected response shape for `getJobs`.

### ClickUp (Task Management)

**Status:** Production

- **Auth:** Personal API token (VITE_CLICKUP_API_TOKEN), NOT OAuth
- **Test workspace:** BC WorkSpace, list `901703694310`
- **Production workspace:** Valta workspace, list `901402094744`
- **Template:** `t-86b3exqe8`
- **Requires:** Valcre job number before task creation

**Test pattern:**
```bash
# Verify ClickUp connection (requires API token in env)
# Check task creation flow: submit a job → create Valcre job → auto-create ClickUp task
```

**NEEDS VERIFICATION:** Whether the VITE_CLICKUP_API_TOKEN is set in `.env.local` or only in Vercel env.

---

## 7. Which Tool for Which Job -- Decision Matrix

```
What are you testing?
  |
  +-- Visual appearance (colors, layout, spacing)?
  |     |
  |     +-- Need a human-like visual opinion? → AG (Antigravity)
  |     +-- Need a screenshot for comparison? → Playwright MCP (browser_take_screenshot)
  |     +-- Quick check of what's rendered? → KM-Exp Browser Panel (browser-snapshot)
  |
  +-- User interaction (click, fill, navigate)?
  |     |
  |     +-- Page is in KM-Exp panel? → Browser Panel API (browser-click, browser-fill)
  |     +-- Need complex multi-step flow? → Playwright MCP (navigate, click, fill_form)
  |     +-- Need form submission with verification? → Playwright MCP
  |
  +-- Data correctness (fields, values, DB state)?
  |     |
  |     +-- Field sync across 4 files? → Bash grep (see Section 4)
  |     +-- Database table contents? → Supabase dashboard or API query
  |     +-- Store state during runtime? → Browser console (Zustand devtools)
  |
  +-- Deployment health?
  |     |
  |     +-- Is production live? → curl health check (see Section 5)
  |     +-- Preview deploy working? → vercel ls + open preview URL
  |     +-- Build passes? → npm run build
  |
  +-- Integration working?
        |
        +-- DocuSeal flow? → Manual via dashboard UI (see Section 6)
        +-- Valcre API? → curl to /api/valcre (see Section 6)
        +-- ClickUp task creation? → Submit a test job, verify ClickUp task appears
```

### Tool Comparison

| Tool | Sees Visuals | Clicks/Types | Screenshots | Runs Locally | Best For |
|------|:-----------:|:------------:|:-----------:|:------------:|----------|
| **AG** | Yes (multimodal) | Yes | Yes | Yes | Visual QA, color/layout verification |
| **Playwright MCP** | No (DOM only) | Yes | Yes | Yes | Automated interaction, screenshots, form testing |
| **Browser Panel API** | No (AX tree) | Yes | Via annotation | Yes | Quick interaction with loaded pages |
| **curl** | No | No | No | Yes | API health checks, endpoint testing |
| **Supabase Dashboard** | N/A | N/A | N/A | Browser | Database inspection, row verification |

### Rules

1. **Never open localhost in a standalone browser.** Use `/open-in-km` or Playwright MCP.
2. **AG for visual opinions**, Playwright for programmatic screenshots.
3. **Always check the actual port** from terminal output -- don't assume 8086 if Vite auto-incremented.
4. **Test data resets on reload** -- the Report Builder has no persistence yet.
5. **API keys are server-side only** -- Valcre tests must go through the proxy, not direct API calls.

---

## Quick Reference

| Item | Value |
|------|-------|
| Dev server command | `npm run dev` |
| Dev port | 8086 |
| Vercel dev command | `npm run vercel-dev` |
| Vercel dev port | 3000 |
| Production URL | `https://apr-dashboard-v3.vercel.app` |
| Supabase instance | `ngovnamnjmexdpjtcnky.supabase.co` |
| Vercel project ID | `prj_VkmkFydnDLN6l2EWAX7H1tuY8B4A` |
| DocuSeal template | 1680270 |
| ClickUp test list | 901703694310 (BC workspace) |
| ClickUp prod list | 901402094744 (Valta workspace) |
| Field count | 2,082 |
| Template pages | 79 |
| Template lines | 31,023 |

---

## NEEDS VERIFICATION Items

These items were flagged during DSLP as requiring live verification:

- [ ] Does `npm run build` pass cleanly with no errors?
- [ ] Does `npm run dev` start on port 8086 consistently, or does it sometimes auto-increment?
- [ ] Is `VITE_CLICKUP_API_TOKEN` in `.env.local` or only in Vercel env?
- [ ] Does a DocuSeal test/sandbox environment exist?
- [ ] What is the exact request/response format for `POST /api/valcre` with `getJobs`?
- [ ] Are the existing Playwright test specs (`tests/`) still runnable or fully stale?
- [ ] Does the `/mock-builder` route load without errors when dev server starts fresh?

---

**This document prevents every future agent from guessing how to test APR. Read it. Follow it.**
