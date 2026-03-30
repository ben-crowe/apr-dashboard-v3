# APR Dashboard — Workflow Stages & CLI Tools

Each stage follows the real client lifecycle from form submission to project delivery. Every cli-apr-tools command is mapped to the stage where it applies.

---

## Stage 1: Client Form Submission

Client fills the intake form at the root URL. 18 content fields covering client info, property details, and job parameters. No authentication required — anyone with the link can submit. File upload optional. No confirmation email is sent despite the success page claiming one.

| Command | What It Does |
|---------|-------------|
| `form-submit` | Submit the full intake form (18 fields + file upload) |
| `form-fill-client` | Fill 7 client fields (name, title, org, address, phone, email) |
| `form-fill-property` | Fill property fields (name, address, type, use, premises, condition) |
| `form-fill-property-contact` | Fill 4 property contact fields (can differ from client) |
| `form-fill-notes` | Fill notes/instructions + optional file upload |
| `form-authorized-use-options` | Reference: 8 dropdown values for Authorized Use |
| `form-valuation-premises-options` | Reference: dropdown values for Valuation Premises |
| `form-property-type-options` | Reference: 13 property type dropdown values |
| `form-file-upload` | File upload to Supabase Storage job-files bucket |
| `form-success-page` | Gotcha: success page promises email that never sends |
| `form-roundtrip-test` | QA: verify all 18 fields land correctly on dashboard |

---

## Stage 2: Dashboard Receives Form

Form data lands in the `job_submissions` Supabase table and appears on the dashboard job list. Appraiser sees all submissions, clicks a job to open the detail view. Fields are displayed in camelCase (converted from Supabase snake_case). Double-fetch on load is a known StrictMode artifact.

| Command | What It Does |
|---------|-------------|
| `supabase-query-jobs` | Query job_submissions table (20 rows in production) |
| `supabase-query-clients` | Query client_profiles table (104 rows, CRM data) |
| `supabase-query-files` | Query job_files table for uploaded documents |
| `supabase-query-property` | Query job_property_info table for property details |
| `supabase-insert-job` | Insert a new job submission (18 content + 4 auto fields) |
| `supabase-health-check` | Verify all 6 Supabase endpoints return 200 |
| `supabase-instance` | Reference: Supabase URL, project ID, credentials |
| `supabase-tables` | Reference: database schema overview (6 tables, report_builder_data MISSING) |
| `supabase-storage` | Reference: storage buckets (job-files active, documents MISSING) |
| `supabase-client-import` | Reference: how to import Supabase client in code |
| `dashboard-navigate` | Open the dashboard job list |
| `dashboard-job-detail` | Click a job row to open detail view |
| `dashboard-routes` | Reference: all application routes |
| `dashboard-field-naming` | Reference: 4 naming conventions across 8 systems |
| `dashboard-port` | Reference: Vite dev on 5173, /api proxies to production |
| `dashboard-double-fetch` | Gotcha: double Supabase fetch on page load (StrictMode) |
| `dashboard-auth-warning` | Gotcha: auth session warning on every action |

---

## Stage 3: Prep for LOE

Appraiser reviews the job detail and fills LOE fields: appraisal fee, retainer, delivery date, intended use, scope of work, valuation premises, property rights, report type, payment terms. Fields auto-save on blur to Supabase. Test Data button fills 5/6 fields (misses Report Type, requires double-click). Two workflow gates control what happens next.

| Command | What It Does |
|---------|-------------|
| `supabase-upsert-loe` | Insert/update LOE details for a job |
| `supabase-valuation-premises-gap` | Gotcha: valuation_premises in two tables, gate checks wrong one |
| `dashboard-loe-section` | Reference: LOE section fields (fee, retainer, date, enums) |
| `dashboard-test-data` | Click Test Data button to fill LOE fields |
| `dashboard-auto-save` | Reference: fields save on blur, trigger Valcre PATCH |
| `form-test-data-button` | Test Data button details (double-click, misses Report Type) |
| `form-valcre-gate` | Reference: 6 required fields to enable Create Valcre Job |
| `form-loe-gate` | Reference: 4 required fields for LOE preview/send |
| `qa-workflow-gates` | QA: test both gates with missing fields |
| `qa-test-data-coverage` | QA: assess Test Data button field coverage |

---

## Stage 4: Generate Valcre Job Number

Appraiser clicks "Create Valcre Job" (requires 6 fields filled). The serverless function authenticates with Valcre OAuth, creates three linked entities (Contact, Property, Job), applies 6 conversion maps for enum fields, and returns a VAL number. Response takes ~8 seconds. Button changes to show the VAL number.

| Command | What It Does |
|---------|-------------|
| `valcre-auth` | Authenticate with Valcre API, get bearer token |
| `valcre-create-job` | Create Contact + Property + Job in Valcre, get VAL number |
| `valcre-update-job` | PATCH existing job with converted enum values |
| `valcre-create-contact` | Create contact entity (OwnerId 7095 = Chris) |
| `valcre-create-property` | Create property entity with PropertyType + Types fields |
| `valcre-get-job-by-id` | Fetch job by internal numeric ID |
| `valcre-get-job-by-number` | Fetch job by VAL number (e.g. VAL261028) |
| `valcre-get-contact` | Search for existing contact by email (dedup) |
| `valcre-get-property` | Fetch property entity by ID |
| `valcre-list-jobs` | List recent jobs with property details |
| `valcre-field-verify` | Verify all field values landed correctly in Valcre |
| `valcre-purposes-map` | Reference: Property Rights → Valcre Purposes (15 values) |
| `valcre-requested-values-map` | Reference: Valuation Premises → RequestedValues (17 values) |
| `valcre-report-format-map` | Reference: Report Type → ReportFormat (10 values) |
| `valcre-scope-map` | Reference: Scope of Work → Scopes (14 values) |
| `valcre-intended-uses-map` | Reference: Intended Use → IntendedUses (17 values) |
| `valcre-property-type-map` | Reference: PropertyType + Types two-map system |
| `valcre-api-base` | Reference: API URLs and auth endpoint |
| `valcre-entity-chain` | Reference: Job → Client + PropertyContact + Property |
| `valcre-owner-id` | Reference: OwnerId 7095 = Chris Chornohos |
| `valcre-parse-address` | Reference: address parsing helper |
| `valcre-investment-grade` | Reference: Asset Condition → InvestmentGrade (4 values) |
| `valcre-test-property-types` | Test: analyze PropertyType vs Types across 30 real jobs |
| `valcre-web-login` | Manual verification via Valcre web UI |
| `valcre-field-name-gotcha` | Gotcha: field is Scopes NOT ScopeOfWork |
| `valcre-contact-address-gotcha` | Gotcha: client got property address (fixed ed510bc) |
| `valcre-creation-vs-update-gotcha` | Gotcha: RequestedValues/Scopes only set on UPDATE path |
| `valcre-parcel-workaround` | Gotcha: 8 parcel fields go to Comments on PATCH |
| `valcre-payment-terms-workaround` | Gotcha: Payment Terms appended to Comments |
| `dashboard-create-valcre` | Click Create Valcre Job button on dashboard |
| `dashboard-view-valcre` | View in Valcre link after job created |
| `qa-valcre-field-audit` | QA: field-by-field comparison against API |
| `qa-valcre-web-verify` | QA: visual verification in Valcre web UI |
| `qa-contact-verify` | QA: verify both contacts have correct addresses |

---

## Stage 5: Send LOE via DocuSeal

Appraiser clicks "Preview & Send LOE" (requires VAL number + client info). Opens a preview modal showing the V3 HTML template with all fields populated. Clicking Send triggers DocuSeal submission and a custom email via Gmail SMTP edge function with the signing link. The legacy docuseal.ts code path with 7 empty SELECT fields is dead code — V3 generateLOE.ts is the active path.

| Command | What It Does |
|---------|-------------|
| `docuseal-send-loe` | Send LOE document for e-signature via DocuSeal |
| `docuseal-signing-link` | Reference: client signing URL format |
| `docuseal-template` | Reference: Template ID 1680270, V3 HTML |
| `docuseal-email-path` | Reference: custom Gmail SMTP, not DocuSeal native |
| `docuseal-two-code-paths` | Reference: V3 active, docuseal.ts is dead code |
| `docuseal-7-empty-fields` | Gotcha: disproven — V3 template fills all fields |
| `docuseal-property-type-bug` | Gotcha: LOE shows intendedUse in Property Type row |
| `docuseal-loe-save-fail` | Gotcha: DB save sometimes fails, LOE still sends |
| `supabase-edge-function` | Reference: Gmail SMTP edge function for email |
| `dashboard-preview-send-loe` | Click Preview & Send LOE button on dashboard |
| `dashboard-resend-loe` | Resend LOE button (amber styling) after initial send |
| `qa-loe-preview-verify` | QA: verify all fields in LOE preview modal |

---

## Stage 6: Client Signs LOE

Client receives email with signing link, opens DocuSeal signing page, signs the LOE. DocuSeal fires a `submission.completed` webhook. The handler updates the database with the signed document URL. Known gap: ClickUp checklist is NOT updated on signature completion — the DB knows but ClickUp doesn't.

| Command | What It Does |
|---------|-------------|
| `docuseal-webhook` | Reference: webhook handler updates DB on signature |
| `docuseal-check-status` | Check if LOE has been sent/signed |
| `clickup-signature-gap` | Gotcha: webhook doesn't update ClickUp checklist |

---

## Stage 7: Create ClickUp Task

ClickUp task is created after Valcre job booking. Contains markdown description with client/property/job fields. Template t-86b3exqe8 includes a checklist. Task is updated with VAL number after booking and checklist items marked complete after LOE send and Valcre booking. Client-side ClickUp API calls fail (CORS) — only the edge function path works.

| Command | What It Does |
|---------|-------------|
| `clickup-create-task` | Create ClickUp task with markdown description + template |
| `clickup-update-task` | Update task with VAL number after job booked |
| `clickup-checklist-update` | Mark checklist items complete (LOE sent, job booked) |
| `clickup-env-config` | Reference: test vs production workspace config |
| `clickup-api-token` | Reference: personal API token (not OAuth) |
| `clickup-cors-issue` | Gotcha: browser CORS blocks direct API calls |
| `clickup-noop-button` | Gotcha: View in ClickUp button does nothing on some jobs |
| `clickup-task-description` | Reference: task description markdown format |
| `dashboard-view-clickup` | View in ClickUp link on dashboard |

---

## Stage 8: Post-Approval Workflow (Future)

Comp research, report generation, and final delivery. The Report Builder exists as a standalone page (`/mock-builder`) with 2084 fields and a 79-page HTML template, but is NOT connected to the database. Requires `report_builder_data` table creation and route integration at `/dashboard/job/:jobId/report`. This is the current development priority.

| Command | What It Does |
|---------|-------------|
| `supabase-tables` | Reference: report_builder_data table DOES NOT EXIST yet |

---

## Cross-Stage: QA & Deployment

These commands span the entire workflow or support deployment and testing across all stages.

| Command | What It Does |
|---------|-------------|
| `qa-full-pipeline` | Run complete 7-step end-to-end test |
| `qa-round-pattern` | Reference: 5-round QA progression methodology |
| `qa-screenshot-audit` | Capture screenshot evidence across all screens |
| `qa-evidence-location` | Reference: /tmp/apr-field-audit/round{1-5}/ |
| `qa-known-issues` | Reference: 10 ranked issues from full audit |
| `qa-valta-field-spec-gap` | Reference: 13 VALTA fields not implemented |
| `deploy-vercel-push` | Push to main, trigger Vercel auto-deploy |
| `deploy-vercel-build-local` | Build locally + deploy prebuilt (bypass remote builder) |
| `deploy-vercel-status` | Check deployment status |
| `deploy-verify-api` | Post-deploy API verification |
| `deploy-proxy-architecture` | Reference: dev server proxies /api to production |
| `deploy-env-vars` | Reference: Vercel environment variables |
| `deploy-rollback` | Rollback to previous Vercel deployment |
| `deploy-git-commits-recent` | Reference: recent QA fix commits |
| `deploy-pre-deploy-checklist` | Workflow: 6-step pre-deploy checklist |
| `dashboard-vite-proxy-gotcha` | Gotcha: local api/ changes invisible until deployed |
