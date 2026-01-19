# APR Dashboard v3 - Full Ecosystem Integration

> **Generated:** 2025-12-31 | **Updated:** 2026-01-06
> **Purpose:** Combined view showing complete data flow from client form to final report
> **Source:** 3 parallel research agents analyzing Stages 1-4 + Platform Strategy merge

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Stage 1-3: Pre-Report Flow](#stage-1-3-pre-report-flow)
3. [Stage 4: Report Builder](#stage-4-report-builder)
4. [Integration Bridge](#integration-bridge)
5. [Complete Field Mappings](#complete-field-mappings)
6. [Implementation Plan](#implementation-plan)
7. [Platform Independence Strategy](#platform-independence-strategy)

---

## System Overview

### Four-Stage Architecture

```
+------------------------------------------------------------------+
|  STAGE 1: CLIENT INTAKE                                           |
|  Route: / (public form)                                           |
|  Output: job_submissions table                                    |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|  STAGE 2: JOB MANAGEMENT & LOE PREPARATION                       |
|  Route: /dashboard/job/:jobId                                     |
|  Output: job_loe_details, job_property_info tables               |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|  STAGE 3: E-SIGNATURE FLOW                                        |
|  Integration: DocuSeal                                            |
|  Output: Signed LOE, status update                               |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|  STAGE 4: REPORT BUILDER                                          |
|  Route: /mock-builder (current) -> /dashboard/job/:jobId/report  |
|  Output: Complete appraisal report                               |
+------------------------------------------------------------------+
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| UI | shadcn/ui, Tailwind CSS |
| State | Zustand (Report Builder), React Context (Jobs) |
| Backend | Supabase (PostgreSQL + Storage + Edge Functions) |
| Routing | React Router v6 |
| Integrations | Valcre API, DocuSeal API, ClickUp API, Google Drive API |

---

## Stage 1-3: Pre-Report Flow

### Database Schema

#### `job_submissions` Table (50+ columns)

**Core Fields:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `status` | string | Yes | See status flow below |
| `created_at` | timestamp | Auto | ISO 8601 |
| `updated_at` | timestamp | Auto | ISO 8601 |

**Client Information:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `client_first_name` | string | Yes | From intake form |
| `client_last_name` | string | Yes | From intake form |
| `client_email` | string | Yes | Used for LOE delivery |
| `client_phone` | string | Yes | Format: numeric only |
| `client_title` | string | No | e.g., "VP of Real Estate" |
| `client_organization` | string | No | Company name |
| `client_address` | string | No | Full address |

**Property Information:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `property_name` | string | No | e.g., "Downtown Plaza" |
| `property_address` | string | Yes | Required for Valcre |
| `property_type` | string | Yes | Comma-separated multi-select |
| `intended_use` | string | No | Dropdown selection |
| `valuation_premises` | string | No | Dropdown selection |
| `asset_condition` | string | No | Excellent/Very Good/Good/Fair/Poor |

**Property Contact:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `property_contact_first_name` | string | No | Contact at property |
| `property_contact_last_name` | string | No | |
| `property_contact_email` | string | No | |
| `property_contact_phone` | string | No | |
| `same_as_client_contact` | boolean | No | Copy from client |

**Integration Fields:**
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `job_number` | string | No | VAL number from Valcre |
| `valcre_job_id` | string | No | Numeric ID from Valcre |
| `clickup_task_id` | string | No | ClickUp task ID |
| `clickup_task_url` | string | No | Direct link |
| `docuseal_submission_id` | string | No | DocuSeal e-signature |

---

#### `job_loe_details` Table (20+ columns)

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `job_id` | UUID | Yes | FK to job_submissions |
| `job_number` | string | No | Duplicate for convenience |
| `valcre_job_id` | integer | No | Valcre internal ID |
| `appraisal_fee` | numeric | No | Fee amount in dollars |
| `retainer_amount` | text | No | Stored as string |
| `delivery_date` | date | No | YYYY-MM-DD format |
| `payment_terms` | string | No | Dropdown selection |
| `property_rights_appraised` | string | No | Required for DocuSeal |
| `report_type` | string | No | Required for DocuSeal |
| `scope_of_work` | string | No | Required for DocuSeal |
| `valuation_premises` | string | No | Dropdown selection |
| `special_instructions` | string | No | Notes for appraiser |
| `internal_comments` | string | No | Appraiser notes |

---

#### `job_property_info` Table (25+ columns)

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `job_id` | UUID | Yes | FK to job_submissions |
| `year_built` | string | No | Year of construction |
| `building_size` | string | No | Square footage |
| `legal_description` | string | No | Legal property description |
| `number_of_units` | number | No | Unit count |
| `parking_spaces` | number | No | Parking count |
| `zoning_classification` | string | No | Zoning code |
| `zone_abbreviation` | string | No | Short code |
| `land_use_designation` | string | No | Land use type |
| `flood_zone` | string | No | FEMA zone |
| `utilities` | string | No | Available utilities |
| `parcel_number` | string | No | Tax parcel ID |
| `usable_land_sf` | number | No | Usable square feet |
| `usable_land_acres` | number | No | Usable acres |
| `gross_land_sf` | number | No | Gross square feet |
| `gross_land_acres` | number | No | Gross acres |
| `assessed_value` | number | No | Total assessed value |
| `taxes` | number | No | Annual property taxes |
| `assessment_year` | string | No | Year of assessment |
| `land_assessment_value` | number | No | Land-only value |
| `improved_assessment_value` | number | No | Building-only value |

---

#### `job_files` Table

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | UUID | Yes | Primary key |
| `job_id` | UUID | Yes | FK to job_submissions |
| `file_name` | string | Yes | Original filename |
| `file_path` | string | Yes | Storage path: `{job_id}/{name}` |
| `file_type` | string | Yes | MIME type |
| `file_size` | number | Yes | Size in bytes |
| `created_at` | timestamp | Auto | Upload timestamp |

---

### Status Flow

```
submitted
    |
    v
in_progress (Appraiser reviewing)
    |
    v
loe_pending (Valcre job created)
    |
    v
loe_sent (DocuSeal submission created)
    |
    v
loe_signed (Client signed)
    |
    v
contract_generated
    |
    v
paid
    |
    v
active (Report building)
    |
    v
completed
```

---

### Valcre Integration

**Data Sent to Valcre:**
```javascript
{
  Name: "property_name",
  Status: "Lead",
  OwnerId: 7095,
  ClientName: "firstName lastName",
  ClientEmail: "client@email.com",
  ClientPhone: "403-555-0100",
  ClientCompany: "client_organization",
  PropertyAddress: "full address string",
  PropertyType: "Multi-Family",
  AppraisalFee: 3500,
  Retainer: 350,
  DeliveryDate: "2025-02-14",
  intendedUse: "Financing",
  reportType: "Appraisal Report",
  propertyRightsAppraised: "Fee Simple Interest",
  valuationPremises: "As-Is"
}
```

**Data Returned:**
```javascript
{
  success: true,
  jobNumber: "VAL-20250101-001",
  jobId: 12345
}
```

---

## Stage 4: Report Builder

### Architecture

```
fieldRegistry.ts (944 fields)
       |
       v
reportBuilderStore.ts (6,340 lines - Zustand)
       |
       v
+-------------------+     +-------------------+     +-------------------+
|   SectionSidebar  | <-> |     EditPanel     | <-> |   PreviewPanel    |
| (22 sections)     |     | (field editors)   |     | (iframe preview)  |
+-------------------+     +-------------------+     +-------------------+
```

### Field Registry Analysis

**Total: 944 fields across 30 sections**

| Section | Fields | Purpose |
|---------|--------|---------|
| `calc-output` | 334 | Calculated results |
| `sales` | 283 | 5 comps x 45+ fields each |
| `sales-comparison` | 187 | DCA analysis |
| `calc` | 180 | Calculator engine inputs |
| `rent-analysis` | 176 | 1BR + 2BR analysis |
| `image-mgt` | 160 | 55 images + captions |
| `exec` | 79 | Executive Summary |
| `calc-expenses` | 74 | Operating expenses |
| `property-identification` | 65 | Subject property data |
| `impv` | 54 | Improvements/building specs |
| `subject-photos` | 51 | Subject property photos |
| `market-rent-1br` | 46 | 1BR market rents |
| `market-rent-2br` | 45 | 2BR market rents |
| `cover` | 44 | Cover page fields |
| `site` | 43 | Site characteristics |
| `home` | 2 | **EXISTS BUT HIDDEN** |

### Field Types

| Type | Count | Purpose |
|------|-------|---------|
| `text` | ~500 | Single-line text inputs |
| `number` | ~200 | Numeric inputs |
| `calculated` | ~150 | Auto-computed values |
| `image` | 55 | Photo uploads |
| `date` | ~30 | Date pickers |
| `currency` | ~20 | Money fields |
| `dropdown` | ~15 | Select menus |
| `textarea` | ~24 | Multi-line text |

### Input Sources

| Source | Count | UI Color |
|--------|-------|----------|
| `user-input` | ~650 | Yellow |
| `calculated` | ~150 | Green |
| `auto-filled` | ~30 | Green |
| `dropdown` | ~15 | Blue |

### CRITICAL FINDING: Home Section Exists

```typescript
// These 2 fields already exist with section: 'home'
{ id: 'transmittal-date', section: 'home', type: 'date', inputSource: 'auto-filled' }
{ id: 'transmittal-body', section: 'home', type: 'textarea', inputSource: 'user-input' }
```

**Problem:** The `home` section is filtered OUT of SectionSidebar (treated as TDD-only).

### Current Sidebar Structure

**Hidden (TDD-only):**
- S1 - INTAKE (28 fields: client-intake)
- S2 - LOE (21 fields: loe-prep)
- S3 - IMAGE MGT (160 fields: image-mgt)

**Visible (22 sections):**
- 01-COVER through 22-CERT

### Approach-to-Section Mapping

| Approach | Sections | Fields |
|----------|----------|--------|
| Income | 19-INCOME, 20-RENTAL | 196 fields |
| Sales Comparison | 18-SALES | 283 fields |
| Cost | 17-COST | 32 fields |
| Supporting | 15-CALC, 21-RECON | 195 fields |

---

## Integration Bridge

### Current Problem

```
Job Detail:      /dashboard/job/:jobId  --> Supabase data
Report Builder:  /mock-builder          --> NO job context, NO persistence
```

- **No bridge exists** - completely disconnected
- **Data loss risk** - closing Report Builder loses ALL work
- **No auto-save** - nothing persisted to database

### Proposed Solution

**New Route:**
```
/dashboard/job/:jobId/report
```

**New Database Table:**
```sql
CREATE TABLE report_builder_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES job_submissions(id) ON DELETE CASCADE,
  version_number INT DEFAULT 1,
  sections_json JSONB NOT NULL,
  section_groups_json JSONB,
  active_section VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft',
  notes TEXT,
  pdf_export_url TEXT,
  pdf_generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  last_modified_by UUID REFERENCES auth.users(id),
  UNIQUE(job_id, version_number)
);

CREATE INDEX idx_report_builder_job_id ON report_builder_data(job_id);
CREATE INDEX idx_report_builder_updated ON report_builder_data(updated_at);
```

### Data Loading Function

```typescript
async function loadJobIntoReportBuilder(jobId: string) {
  // 1. Fetch all job data
  const { data: job } = await supabase
    .from('job_submissions')
    .select('*')
    .eq('id', jobId)
    .single();

  const { data: loeDetails } = await supabase
    .from('job_loe_details')
    .select('*')
    .eq('job_id', jobId)
    .single();

  const { data: propInfo } = await supabase
    .from('job_property_info')
    .select('*')
    .eq('job_id', jobId)
    .single();

  // 2. Check for existing report
  const { data: existingReport } = await supabase
    .from('report_builder_data')
    .select('*')
    .eq('job_id', jobId)
    .order('version_number', { ascending: false })
    .limit(1);

  if (existingReport) {
    return loadFromExistingReport(existingReport);
  }

  // 3. Transform Supabase fields to Report Builder fields
  const fieldValues = {
    'client-first-name': job.client_first_name,
    'client-last-name': job.client_last_name,
    'client-full-name': `${job.client_first_name} ${job.client_last_name}`,
    'client-email': job.client_email,
    'client-phone': job.client_phone,
    'client-organization': job.client_organization,
    'property-name': job.property_name,
    'property-address': job.property_address,
    'property-type': job.property_type,
    'intended-use': job.intended_use,
    'valuation-premises': loeDetails?.valuation_premises,
    'appraisal-fee': loeDetails?.appraisal_fee,
    'delivery-date': loeDetails?.delivery_date,
    'report-type': loeDetails?.report_type,
    'property-rights': loeDetails?.property_rights_appraised,
    'scope-of-work': loeDetails?.scope_of_work,
    // ... more fields
  };

  // 4. Update store
  store.getState().bulkUpdateFields(fieldValues);

  return { success: true, fieldsPopulated: Object.keys(fieldValues).length };
}
```

### Auto-Save Strategy

```typescript
const debouncedSave = debounce(async (jobId, sections) => {
  await supabase
    .from('report_builder_data')
    .upsert({
      job_id: jobId,
      version_number: currentVersion,
      sections_json: sections,
      updated_at: new Date().toISOString(),
    });
}, 2000); // Save 2 seconds after last change
```

---

## Complete Field Mappings

### Supabase to Report Builder Home Tab

| Source Table | Database Column | Report Builder Field | Type |
|--------------|-----------------|---------------------|------|
| job_submissions | client_first_name | `client-first-name` | text |
| job_submissions | client_last_name | `client-last-name` | text |
| COMPUTED | first + last | `client-full-name` | text |
| job_submissions | client_email | `client-email` | text |
| job_submissions | client_phone | `client-phone` | text |
| job_submissions | client_title | `client-title` | text |
| job_submissions | client_organization | `client-organization` | text |
| job_submissions | client_address | `client-address` | text |
| job_submissions | property_name | `property-name` | text |
| job_submissions | property_address | `property-address` | text |
| job_submissions | property_type | `property-type` | dropdown |
| job_submissions | intended_use | `intended-use` | dropdown |
| job_submissions | valuation_premises | `valuation-premises` | dropdown |
| job_submissions | asset_condition | `asset-condition` | dropdown |
| job_submissions | property_contact_first_name | `contact-first-name` | text |
| job_submissions | property_contact_last_name | `contact-last-name` | text |
| job_submissions | property_contact_email | `contact-email` | text |
| job_submissions | property_contact_phone | `contact-phone` | text |
| COMPUTED | contact first + last | `contact-full-name` | text |
| job_submissions | notes | `intake-notes` | textarea |
| job_submissions | job_number | `job-number` | text |
| job_loe_details | appraisal_fee | `appraisal-fee` | currency |
| job_loe_details | retainer_amount | `retainer-amount` | currency |
| job_loe_details | delivery_date | `delivery-date` | date |
| job_loe_details | payment_terms | `payment-terms` | dropdown |
| job_loe_details | property_rights_appraised | `property-rights` | dropdown |
| job_loe_details | report_type | `report-type` | dropdown |
| job_loe_details | scope_of_work | `scope-of-work` | textarea |
| job_loe_details | special_instructions | `special-instructions` | textarea |
| job_loe_details | internal_comments | `internal-comments` | textarea |
| job_property_info | year_built | `year-built` | text |
| job_property_info | building_size | `building-size` | text |
| job_property_info | legal_description | `legal-description` | textarea |
| job_property_info | number_of_units | `number-of-units` | number |
| job_property_info | parking_spaces | `parking-spaces` | number |
| job_property_info | zoning_classification | `zoning-classification` | text |
| job_property_info | land_use_designation | `land-use-designation` | text |
| job_property_info | parcel_number | `parcel-number` | text |
| job_property_info | assessed_value | `assessed-value` | currency |
| job_property_info | taxes | `annual-taxes` | currency |

**Total: ~35 fields ready for pre-population**

---

## Implementation Plan

### Phase 0: Database Setup
- Create `report_builder_data` table
- Set up RLS policies
- Create helper functions

### Phase 1: Expose Home Section (Quick Win)
- Modify SectionSidebar.tsx to show 'home' section
- Position HOME at top of sidebar
- **File:** `src/features/report-builder/components/SectionSidebar.tsx`

### Phase 2: Add Home Section Fields
- Add ~35 fields with 8 subsections
- Subsections: job-setup, client-info, appraiser-info, property-info, assignment-details, subject-contact, assumptions-conditions, transmittal
- **File:** `src/features/report-builder/schema/fieldRegistry.ts`

### Phase 3: Integration Bridge Route
- Add route: `/dashboard/job/:jobId/report`
- Create ReportBuilderRoute wrapper component
- Implement `loadJobIntoReportBuilder()` function
- Add "Begin Report" button to JobDetailView

### Phase 4: Report Persistence
- Add `saveToSupabase()` method to store
- Add debounced auto-save (2s)
- Add "Saved version X" indicator
- Add version history display

### Phase 5: Dynamic Conditions List
- Create DynamicListEditor component
- Add field type: 'dynamic-list'
- **File:** `src/features/report-builder/components/EditPanel/DynamicListEditor.tsx`

### Phase 6: Locked Fields + "Edit in Home"
- Add `editInSection` property to fields
- Create LockedFieldDisplay component
- **File:** `src/features/report-builder/components/EditPanel/LockedFieldDisplay.tsx`

### Phase 7: Page-to-Editor Sync (Future)
- Create PAGE_TO_SECTION_MAP
- Add scroll listener to PreviewPanel
- Update activeSection on scroll

---

## Key Files Reference

### Report Builder Core
```
src/features/report-builder/
  schema/fieldRegistry.ts              # 944 field definitions
  store/reportBuilderStore.ts          # 6,340 lines Zustand store
  components/
    SectionSidebar.tsx                  # Section navigation
    EditPanel/EditPanel.tsx             # Field editors
    PreviewPanel/PreviewPanel.tsx       # iframe preview
  types/reportBuilder.types.ts          # TypeScript types
```

### Job Management Core
```
src/components/dashboard/
  JobDetailView.tsx                     # Job detail page
  job-details/
    ClientSubmissionSection.tsx         # Client info display
    LoeQuoteSection.tsx                 # LOE preparation
    client-submission/
      ClientInformationSection.tsx      # Client form
      PropertyInformationSection.tsx    # Property form
    loe-quote/
      ValuationSection.tsx              # Fee/dates
      PropertyRightsSection.tsx         # Rights dropdown

src/hooks/
  useJobDetail.ts                       # Job data fetching
  useJobData.ts                         # Job data management

src/types/job.ts                        # Job TypeScript types
```

### Integration Points
```
src/utils/webhooks/
  valcre.ts                             # Valcre API
  docuseal.ts                           # DocuSeal e-signature
  clickup.ts                            # ClickUp tasks

src/integrations/supabase/
  client.ts                             # Supabase client
  types.ts                              # Database types
```

---

## Success Criteria

- [ ] Home section visible as first section in sidebar
- [ ] Home section has 8 subsections with ~40 fields
- [ ] Job data pre-populates Home Tab from Job Detail
- [ ] Report Builder auto-saves to Supabase (2s debounce)
- [ ] Version history tracked per job
- [ ] Conditions use dynamic list UI (add/remove items)
- [ ] Locked fields in other sections show "Edit in Home" link
- [ ] Closing Report Builder does NOT lose data
- [ ] "Begin Report" button in Job Detail View
- [ ] Route: `/dashboard/job/:jobId/report` works

---

## Platform Independence Strategy

> **Objective:** Eliminate Valcre, ClickUp, and Pipedrive dependencies. Build a complete appraisal business platform on owned infrastructure.

### Strategic Direction

APR Dashboard v3 is evolving from a "report builder with integrations" to a **complete appraisal business platform**. The goal is platform independence - owning the full stack rather than stitching together SaaS tools.

### Target State

| Function | Current | Target | Status |
|----------|---------|--------|--------|
| Report Generation | Valcre | Report Builder | ~80% complete |
| Project Management | ClickUp | Job Mgt v3 | ~60% complete |
| CRM / Pipeline | Pipedrive | Acquisition Pipeline | ~40% complete |
| E-Signatures | DocuSeal | DocuSeal (keep) | Complete |
| Database | Supabase | Supabase (keep) | Complete |
| File Storage | Google Drive | Supabase Storage | Working |

### Tech Stack Simplification

**Before:**
```
Supabase + Valcre + ClickUp + Pipedrive + DocuSeal + Google Drive
    |         |         |          |          |           |
  Core    Reports    Tasks       CRM      E-Sign      Files
```

**After:**
```
Supabase + DocuSeal
    |          |
Everything   E-Sign
```

### Three Workstreams

#### Workstream A: Report Builder (Kill Valcre)
**Goal:** Complete Valcre replacement with specialized section editors

**Done:**
- Field registry (944 fields)
- Calculator engine (277 metrics, validated)
- HTML template system (70+ pages)
- Live preview with PostMessage bridge (500+ fields)
- Income/Sales/Cost approach panels

**Remaining:**
- Home Tab (workbook setup, common fields)
- Image Manager (grid, reorder, layout)
- Narrative Editor (rich text, templates)
- Data persistence (auto-save to Supabase)
- Job integration (pre-populate from job_submissions)

#### Workstream B: Job Management (Kill ClickUp)
**Goal:** Replace ClickUp with built-in job/task management

**Done:**
- Job list view with search/filter
- Job detail view with accordion sections
- Document upload and organization
- Status tracking (basic)

**Remaining:**
- Task checklist per job
- Pipeline view (kanban or enhanced list)
- Activity log / notes per job
- Due date reminders
- Status-based automations

#### Workstream C: Acquisition Pipeline (Kill Pipedrive)
**Goal:** Replace Pipedrive with built-in lead tracking

**Done:**
- Client intake form (public)
- Job submission to Supabase
- LOE generation
- DocuSeal e-signature flow

**Remaining:**
- Lead/inquiry stage (pre-submission)
- Pipeline view for acquisition
- Automated email triggers
- Client history view

### What We Keep

| Tool | Keep? | Reason |
|------|-------|--------|
| Supabase | Yes | Core database, auth, storage, functions |
| DocuSeal | Yes | E-signatures are complex, works well |
| Resend | Yes | Email delivery API |
| Google Drive | Optional | Could migrate to Supabase Storage |

These integrations add value without creating dependency on external workflow tools.

### Implementation Priority

1. **Phase 1: Report Builder Completion** (Kill Valcre) - Revenue-generating
2. **Phase 2: Job Pipeline Enhancement** (Kill ClickUp) - Workflow efficiency
3. **Phase 3: Acquisition & CRM** (Kill Pipedrive) - Can use existing status flow initially

> **Reference:** For detailed specs on Dual Calculator, Client Link Delivery, and Template Components, see `architecture-v4/README.md`

---

## Appendix: Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| Supabase | snake_case | `client_first_name` |
| TypeScript/React | camelCase | `clientFirstName` |
| Report Builder | kebab-case | `client-first-name` |
| Valcre API | PascalCase | `ClientName` |
