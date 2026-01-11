# APR Dashboard - Parallel Research Agent Prompts

## Overview

Three research agents to document the full APR Dashboard ecosystem. Each agent focuses on a specific stage of the workflow. Outputs should be comprehensive markdown documents that can be used by implementation agents.

---

## Agent 1: Pre-Report Flow (Stages 1-3)

### Focus
Client Intake → Job Management → LOE → E-Signature

### Research Tasks

1. **Document the Client Intake Form**
   - All form fields captured in `job_submissions` table
   - Validation rules
   - File upload flow to Supabase Storage
   - Field naming conventions

2. **Document Job Management Flow**
   - `job_submissions` table schema (all columns)
   - `job_loe_details` table schema (all columns)
   - `job_files` table schema
   - Status values and transitions (`submitted` → `in_progress` → `loe_pending` → etc.)

3. **Document Valcre Integration**
   - What data is sent to Valcre
   - What data comes back (job_number, valcre_job_id)
   - Where it's stored

4. **Document LOE Preparation Fields**
   - All fields in LoeQuoteSection.tsx
   - Which fields map to DocuSeal template
   - Which fields should flow to Report Builder

5. **Create Field Mapping Table**
   ```
   | Supabase Column | Form Field | LOE Field | Report Builder Field |
   |-----------------|------------|-----------|---------------------|
   | client_first_name | clientFirstName | - | client-first-name |
   ```

### Key Files to Review
```
src/components/submission-form/SubmissionForm.tsx
src/components/submission-form/useFormSubmission.ts
src/components/dashboard/job-details/LoeQuoteSection.tsx
src/components/dashboard/job-details/ClientSubmissionSection.tsx
src/hooks/useJobDetail.ts
src/utils/webhooks/valcre.ts
src/integrations/supabase/types.ts
```

### Output
`docs/STAGE-1-3-DATA-FLOW.md` containing:
- Complete Supabase schema documentation
- Field mapping table (Supabase → Form → LOE → Report Builder)
- Status flow diagram
- Integration points summary

---

## Agent 2: Report Builder Deep Dive (Stage 4)

### Focus
Current Report Builder architecture, field registry, and Home Tab implementation plan

### Research Tasks

1. **Document Current Architecture**
   - How `buildAllSectionsFromRegistry()` works
   - Section/subsection structure
   - Field type handling in EditPanel
   - Preview generation flow

2. **Analyze Field Registry**
   - Total fields by section
   - Field types used (text, number, dropdown, image, calculated, textarea)
   - Which fields are `user-input` vs `calculated` vs `auto-filled`
   - Identify Home Tab candidate fields (client, property, appraiser, dates, conditions)

3. **Document Page-to-Section Mapping**
   - Which template pages belong to which sections
   - Create PAGE_TO_SECTION_MAP for preview sync feature
   - Identify which pages use which field prefixes

4. **Approach Toggle Analysis**
   - Which pages belong to Income Approach (~37-51)
   - Which pages belong to Sales Comparison (~56-61)
   - Which pages belong to Cost Approach (~52-55)
   - Which sections in sidebar correspond to each approach

5. **Home Tab Field Grouping**
   - List all fields that should be in Home Tab
   - Propose subsection structure (setup, client, appraiser, property, dates, conditions)
   - Identify fields that need to be re-tagged vs newly created

### Key Files to Review
```
src/features/report-builder/schema/fieldRegistry.ts
src/features/report-builder/store/reportBuilderStore.ts
src/features/report-builder/components/EditPanel/EditPanel.tsx
src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx
src/features/report-builder/components/SectionSidebar.tsx
src/features/report-builder/types/reportBuilder.types.ts
docs/15-Contract-review/2-Field Management/Registry-field Info Guides/FIELD-REGISTRY-ALL-IDS.md
```

### Output
`docs/REPORT-BUILDER-ARCHITECTURE.md` containing:
- Architecture diagram (fieldRegistry → store → components → preview)
- Field registry analysis (counts by section, type breakdown)
- PAGE_TO_SECTION_MAP (complete mapping)
- APPROACH_TO_PAGES_MAP (for toggle feature)
- Home Tab field list with proposed groupings

---

## Agent 3: Integration Bridge

### Focus
How job detail view transitions into report builder, data pre-population strategy

### Research Tasks

1. **Document Current Entry Points**
   - How does user currently get to `/mock-builder`?
   - Is there a job context passed?
   - What's missing for job-specific report building?

2. **Design Data Pre-Population Flow**
   - Map Supabase fields to Report Builder fields
   - Identify which Home Tab fields can be auto-filled from job data
   - Propose API/function for loading job into report builder

3. **Identify Gaps**
   - Fields in Report Builder that don't exist in Supabase
   - Fields in Supabase that don't have Report Builder equivalents
   - Data transformations needed (e.g., separate first/last name → full name)

4. **Propose Route Structure**
   - Current: `/mock-builder` (no job context)
   - Proposed: `/mock-builder/:jobId` or `/dashboard/job/:jobId/report`
   - How to handle "new report" vs "edit existing report"

5. **Report Persistence Strategy**
   - Where should report builder data be saved?
   - New Supabase table? Extension of job_submissions?
   - Auto-save strategy
   - Version history?

### Key Files to Review
```
src/App.tsx (routing)
src/pages/MockReportBuilder.tsx
src/components/dashboard/JobDetailView.tsx
src/hooks/useJobDetail.ts
src/features/report-builder/store/reportBuilderStore.ts
src/integrations/supabase/types.ts
```

### Output
`docs/INTEGRATION-BRIDGE.md` containing:
- Current vs proposed routing diagram
- Field mapping table (Supabase → Report Builder Home Tab)
- `loadJobIntoReportBuilder()` function spec
- Report persistence schema proposal
- Migration/transition plan

---

## Coordination Notes

### Shared Outputs
All three agents should use consistent field naming:
- Supabase: `snake_case` (e.g., `client_first_name`)
- React/Form: `camelCase` (e.g., `clientFirstName`)
- Report Builder: `kebab-case` (e.g., `client-first-name`)

### Dependencies
- Agent 3 depends on outputs from Agent 1 (Supabase schema) and Agent 2 (Report Builder fields)
- Suggest Agent 1 and 2 run in parallel, Agent 3 runs after or reviews their outputs

### Final Deliverable
After all three complete, create:
`docs/FULL-ECOSYSTEM-INTEGRATION.md` - Combined view showing complete data flow from client form to final report

---

## Quick Reference: Key Tables

### Supabase Tables
| Table | Purpose |
|-------|---------|
| `job_submissions` | Main job record, client/property info |
| `job_loe_details` | LOE-specific fields, Valcre job ID |
| `job_files` | Uploaded file metadata |
| `client_profiles` | Client auto-fill data |

### Report Builder Sections (Current)
| Section | Fields | Purpose |
|---------|--------|---------|
| `client-intake` | 18 | Client info |
| `cover` | 40 | Cover page, appraiser |
| `exec` | 29 | Executive summary, conditions |
| `calc` | 165 | Calculator inputs |
| `sales` | 235 | Sales comparables |
| `survey` | 128 | Rental survey |
| `image-mgt` | 55 | Photo management |

### Approach Toggle Mapping (Proposed)
| Approach | Pages | Sections |
|----------|-------|----------|
| Income | 37-51 | income, hist, rentroll, calc |
| Sales Comparison | 56-61 | sales, survey |
| Cost | 52-55 | cost |
