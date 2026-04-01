# APR Dashboard — Master Testing & Field Mapping Reference

**Single source of truth for testing procedures, field mapping verification, CLI tools, and audit history.**

**Last updated:** 2026-04-01
**Last full audit:** 2026-03-28 (QA Agent, 4-phase field lifecycle)
**Last VALTA field addition:** 2026-03-30 (13 custom fields added to Valcre, IDs 12042-12054)

---

## Quick Start — Run a Test

### 1. Start the app

```bash
cd ~/Development/APR-Dashboard-v3
npm run dev    # Vite on port 5173, proxied to 8087
```

### 2. Submit a test form

```bash
# Open the intake form
open http://localhost:8087

# Or use the CLI to fill and submit programmatically
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "fill form"
```

### 3. Verify on dashboard

```bash
open http://localhost:8087/dashboard
# Click into the new submission
# Press "Test Data" button to populate all fields
# Verify all dropdowns, inputs, and addresses render correctly
```

### 4. Use CLI tools for deeper verification

```bash
# Search all ~125 CLI commands
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "<what you want to check>"

# Common checks:
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "verify fields"
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "valcre job"
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "docuseal status"
python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "clickup task"
```

---

## CLI Toolkit Reference

### cli-apr-tools (primary)

**Location:** `~/.claude/skills/cli-apr-tools/`
**Commands:** ~125 across 8 domains
**Search:** `python3 ~/.claude/skills/cli-apr-tools/scripts/search.py "<query>"`

| Domain | What It Covers |
|--------|---------------|
| `form` | Intake form submission, field validation, test data |
| `supabase` | DB queries, job_submissions, job_loe_details, client_profiles |
| `dashboard` | Dashboard UI fields, test data buttons, section rendering |
| `valcre` | Valcre API — job creation, contact sync, field mapping, conversion maps |
| `docuseal` | DocuSeal template, e-signature, webhook, field pre-population |
| `clickup` | ClickUp task creation, custom fields, checklist updates |
| `qa` | QA workflows, regression checks, field audit procedures |
| `deploy` | Vercel deployment, Supabase edge functions, GitHub auth |

### cli-clickup-tools (supplementary)

**Location:** `~/.claude/skills/cli-clickup-tools/`
**Commands:** 60 (6 APR-specific + 49 general + 5 reference)
**Covers:** Task CRUD, custom fields, time tracking, documents, tags, board management

---

## Credentials & Access

| Service | Auth Method | Notes |
|---------|------------|-------|
| Supabase | `ngovnamnjmexdpjtcnky.supabase.co` | Anon key in `.env`. LIVE instance, not paused |
| Valcre API | API key in Vercel env vars only | Server-side only via `api/valcre.ts` |
| ClickUp (Ben) | Personal API token `VITE_CLICKUP_API_TOKEN` | Token: `pk_10791838_LS46SHHP1RFUYP4TUA9V8NOIGGZMMPVG` (2026-03-30) |
| ClickUp (Valta) | `pk_54774263` | Production workspace |
| DocuSeal | Template ID `1680270` | Edge function proxy |
| GitHub | `gh auth login -h github.com` | Expires periodically — run when push fails |
| Supabase CLI | `supabase login` | Expires periodically — run when deploy fails |

---

## Field Mapping Summary

### Total Fields Traced (as of 2026-03-28)

| System | Fields |
|--------|--------|
| Intake Form to Supabase | 22 (18 content + 4 auto) |
| Dashboard to Valcre (Job) | 25 |
| Dashboard to Valcre (Contact) | 11 |
| Dashboard to Valcre (Property) | 17 |
| Dashboard to Valcre (Parcel/Assessment) | 8 |
| Dashboard to DocuSeal | 22 (7 sent empty — known issue) |
| Dashboard to ClickUp | 7 in description |
| **Total unique fields** | **~62 across all systems** |

### VALTA Custom Fields (added 2026-03-30)

13 custom fields created in Valcre (IDs 12042-12054):

| Field | Valcre Custom Field ID | Type |
|-------|----------------------|------|
| Tenancy | 12042 | Select |
| State of Improvements | 12043 | Select |
| Status of Improvements | 12044 | Select |
| Property Subtype | 12045 | Select |
| Assignment Type | 12046 | Select |
| Approaches to Value | 12047 | Select |
| Desktop Report | 12048 | Select |
| Value Timeframe | 12049 | Select |
| Transaction Status | 12050 | Select |
| Zoning Status | 12051 | Select |
| Land Metric | 12052 | Select |
| Environmental Assessment | 12053 | Text |
| Heritage / Conservation | 12054 | Text |

All 13 wired into `api/valcre.ts` create+update paths. Verified with QA (26/26 PASS).

### Field Naming Conventions

| Layer | Convention | Example |
|-------|-----------|---------|
| React form state | camelCase | `clientFirstName` |
| Supabase DB | snake_case | `client_first_name` |
| Valcre API | PascalCase | `FirstName` |
| DocuSeal fields | snake_case | `client_name` |
| LOE template | bracket syntax | `[propertycontact.firstname]` |
| ClickUp | camelCase (JS) | `clientFirstName` |

---

## Testing Procedure — Full Pipeline

### Phase 1: Intake Form to Dashboard

1. Open `http://localhost:8087` (intake form)
2. Fill all fields with test data (or use programmatic fill)
3. Upload a test file attachment
4. Submit the form
5. Verify success screen shows Job Reference UUID
6. Navigate to dashboard, find the new submission
7. Verify all fields populated correctly in Client Info, Property Info sections

**Detailed mapping:** `builds/apr-field-audit/phase1-intake-to-dashboard.md`

### Phase 2: Dashboard to Valcre

1. Open a job on the dashboard
2. Fill LOE section (use Test Data button)
3. Press "Create Valcre Job"
4. Verify job appears in Valcre with correct field mapping
5. Check: Property Type mapping (Building + Types), Contact creation, Custom fields (13 VALTA)

**Detailed mapping:** `builds/apr-field-audit/phase2-dashboard-to-valcre.md`
**Conversion maps in code:** `api/valcre.ts` — 6 conversion maps (PROPERTY_TYPE_MAP, CONDITION_MAP, INTENDED_USE_MAP, RIGHTS_MAP, SCOPE_MAP, REPORT_TYPE_MAP)

### Phase 3: Dashboard to DocuSeal

1. Fill LOE details on dashboard
2. Press "Preview & Send LOE"
3. Verify LOE preview renders all fields
4. Send for signature
5. Check DocuSeal submission — 22 fields mapped

**Known issue:** 7 SELECT fields sent as empty to avoid overlay bug. Fix: convert to TEXT in DocuSeal template.
**Detailed mapping:** `builds/apr-field-audit/phase3-dashboard-to-docuseal.md`

### Phase 4: Integrations (ClickUp, Email, Webhooks)

1. After Valcre job creation, verify ClickUp task auto-created
2. Check ClickUp task description has correct field data
3. After LOE signed, verify webhook updates DB
4. Check email delivery via Resend

**Detailed mapping:** `builds/apr-field-audit/phase4-integrations.md`

---

## Audit History

| Date | Auditor | Scope | Result | Files |
|------|---------|-------|--------|-------|
| 2026-03-28 | QA Agent | 4-phase full pipeline | 62 fields traced, 10 issues found | `builds/apr-field-audit/SUMMARY.md` |
| 2026-03-30 | React Specialist + QA | VALTA custom fields | 13 fields created, 26/26 PASS | Checkpoint #127 |
| 2026-03-30 | QA Agent | LOE/DocuSeal verification | 5 client fields verified | `builds/loe-test-screenshots/` |
| 2026-04-01 | React Specialist | Dashboard field layout redesign | 55+ commits, all sections updated | `docs/-uxui/UX-Feature-Commits.md` |

---

## QA Screenshots

| Location | Content |
|----------|---------|
| `builds/apr-field-audit/round2/` | Early field mapping verification |
| `builds/apr-field-audit/round3/` | Dashboard field population |
| `builds/apr-field-audit/round4/` | Valcre screenshots + API responses |
| `builds/apr-field-audit/round5/` | LOE preview verification |
| `builds/apr-field-audit/round6/` | Full pipeline screenshots |
| `builds/loe-test-screenshots/` | LOE/DocuSeal signing page verification |

---

## Known Issues (Pending)

1. **7 Empty DocuSeal SELECT Fields** — CRITICAL. Client must re-select 6 fields despite data existing. Fix: convert to TEXT in DocuSeal template.
2. **No Client Confirmation Email** — No email sent on form submission.
3. **ClickUp Checklist Not Updated on Signature** — Webhook handler doesn't call `updateClickUpChecklist`.
4. **Select Trigger Text Indent** — Long dropdown values (e.g. "First Mortgage Financing") push text right on dashboard.
5. **Client Comments Not Editable** — Textarea on dashboard doesn't accept input. Needs investigation.

---

## Client Field Registry (Source of Truth from Chris)

| File | Purpose |
|------|---------|
| `Valta Field Reg-cc.xlsx` | Chris's original field registry spreadsheet — the client request that drove all field mapping |
| `docs/VALTA-FIELD-SPEC.md` | Markdown version of the VALTA field spec — 37 fields with types, options, and Valcre mapping |

---

## Current Field Mapping Files (Co-Architect + QA, 2026-03-30)

Complete field-by-field mapping across every system in the pipeline:

| File | Scope |
|------|-------|
| `builds/field-mapping/1-client-form.md` | Intake form fields and where they go |
| `builds/field-mapping/2-dashboard.md` | Dashboard field layout and data sources |
| `builds/field-mapping/3-valcre-job.md` | Dashboard to Valcre job field mapping |
| `builds/field-mapping/4-loe-esignature.md` | LOE/DocuSeal field mapping |
| `builds/field-mapping/5-clickup-task-clean.md` | ClickUp task field mapping (clean version) |
| `builds/field-mapping/6-dropdown-options.md` | All dropdown/select option values |
| `builds/field-mapping/7-file-uploads.md` | File upload handling and storage |
| `builds/field-mapping/8-client-communication.md` | Email and notification mapping |
| `builds/field-mapping/9-dashboard-to-valcre-mapping.md` | Detailed dashboard-to-Valcre field crosswalk |
| `builds/field-mapping/10-clickup-workflow-sync-spec.md` | ClickUp workflow sync specification |

---

## Valcre Custom Fields Specs

| File | Purpose |
|------|---------|
| `builds/valcre-custom-fields-spec.md` | Spec for the 13 VALTA custom fields (pre-creation) |
| `builds/VALCRE-CUSTOM-FIELDS-AUDIT.md` | Audit confirming all 13 fields created and wired |

---

## QA Audit Files

| File | Purpose |
|------|---------|
| `builds/apr-field-audit/SUMMARY.md` | Full 4-phase audit summary (62 fields, 10 issues) |
| `builds/apr-field-audit/phase1-intake-to-dashboard.md` | Phase 1: Form to DB to Dashboard |
| `builds/apr-field-audit/phase2-dashboard-to-valcre.md` | Phase 2: Dashboard to Valcre API |
| `builds/apr-field-audit/phase3-dashboard-to-docuseal.md` | Phase 3: Dashboard to DocuSeal |
| `builds/apr-field-audit/phase4-integrations.md` | Phase 4: ClickUp, Email, Webhooks |
| `builds/APR-DASHBOARD-FIELD-AUDIT.md` | Earlier field audit document |

---

## UX & Design Files

| File | Purpose |
|------|---------|
| `docs/-uxui/UX-Feature-Commits.md` | All UI commits with revert hashes |
| `docs/-uxui/dashboard-field-style-guide.md` | Field layout style guide (three field types, spacing rules) |
| `docs/-uxui/dashboard-field-design-brief.md` | Design brief with grid math and colon alignment |
| `builds/field-layout-prototype-v2.html` | Approved dashboard HTML prototype |
| `builds/field-layout-form-v1-current.html` | Intake form HTML — current stacked layout |
| `builds/field-layout-form-v2-dashboard-style.html` | Intake form HTML — dashboard CompactField style |

---

## Project Files

| File | Purpose |
|------|---------|
| `PLAN.md` | Project roadmap, pending work, backlog |
| `CLAUDE.md` | Agent instructions and project context |
| `README.md` | Project overview and setup |
| `docs/Features/08-Master-Field-Registry/` | Report Builder field registry docs (2084 fields) |
