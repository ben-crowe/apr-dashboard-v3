# APR Dashboard v3 - Complete Architecture Overview

## Table of Contents
1. [System Overview](#system-overview)
2. [Stage 1: Client Intake & Job Creation](#stage-1-client-intake--job-creation)
3. [Stage 2: Job Management & LOE Preparation](#stage-2-job-management--loe-preparation)
4. [Stage 3: E-Signature Flow](#stage-3-e-signature-flow)
5. [Stage 4: Report Builder (Phase 2)](#stage-4-report-builder-phase-2)
6. [Data Architecture](#data-architecture)
7. [Integration Points](#integration-points)
8. [File Structure Reference](#file-structure-reference)

---

## System Overview

APR Dashboard v3 is a comprehensive appraisal management system that orchestrates the entire workflow from client submission to final report generation. The system is built on **React + TypeScript** with **Supabase** as the backend database and integrates with multiple third-party services.

### Core Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand (for report builder), React Context (for job list)
- **Backend**: Supabase (PostgreSQL + Storage + Edge Functions)
- **Routing**: React Router v6
- **External Integrations**: Valcre API, DocuSeal API, ClickUp API, Google Drive API

### Application Flow
```
Client Form → Supabase → Dashboard → Valcre → LOE Generation → DocuSeal → 
Client Signs → Status Update → Report Builder → Final Report
```

---

## Stage 1: Client Intake & Job Creation

### Overview
Clients submit appraisal requests through a public-facing form. The form captures client information, property details, and optional file uploads. All data is immediately saved to Supabase.

### Key Components

#### 1. Client Intake Form (`/` route)
**File**: `src/pages/Index.tsx`
- Public-facing form (no authentication required)
- Multi-section form with validation
- File upload capability
- Auto-fill from client profile (if exists)

**Form Sections**:
- Client Information (name, email, phone, organization, address)
- Property Information (name, address, type, intended use, valuation premises)
- Property Contact (optional - defaults to client contact)
- Additional Notes

**Key Files**:
```
src/pages/Index.tsx                          # Main entry page
src/components/submission-form/SubmissionForm.tsx  # Form component
src/components/submission-form/useFormSubmission.ts  # Form logic hook
src/components/submission-form/ClientInformationSectionWithAutoFill.tsx
src/components/submission-form/PropertyInformationSection.tsx
src/utils/validation.ts                       # Form validation
```

#### 2. Data Submission Flow

**Process**:
1. Client fills out form
2. Form validates all required fields
3. Data saved to `job_submissions` table in Supabase
4. Files uploaded to Supabase Storage (`job-files` bucket)
5. File metadata saved to `job_files` table
6. Success message displayed to client

**Database Tables**:
- `job_submissions` - Main job record
- `job_files` - File metadata
- `client_profiles` - Client auto-fill data (optional)

**Key Code**:
```typescript
// src/components/submission-form/useFormSubmission.ts
const handleSubmit = async () => {
  // 1. Validate form
  const validationErrors = validateForm(formData);
  
  // 2. Save to Supabase
  const { data: jobData } = await supabase
    .from('job_submissions')
    .insert({ ...formData, status: "submitted" })
    .select('*')
    .single();
  
  // 3. Upload files
  for (const file of formData.files) {
    await supabase.storage
      .from('job-files')
      .upload(`${jobData.id}/${file.name}`, file);
    
    await supabase.from('job_files').insert({
      job_id: jobData.id,
      file_name: file.name,
      file_path: `${jobData.id}/${file.name}`,
      ...
    });
  }
};
```

#### 3. Job Status After Submission
- **Status**: `"submitted"`
- **Location**: Appears in dashboard job list
- **Next Step**: Appraiser reviews and prepares LOE

---

## Stage 2: Job Management & LOE Preparation

### Overview
After client submission, appraisers access the dashboard to manage jobs, create Valcre jobs, and prepare Letters of Engagement (LOE).

### Key Components

#### 1. Dashboard Job List (`/dashboard` route)
**File**: `src/pages/Dashboard.tsx`

**Features**:
- List view and table view toggle
- Search by property name, address, or client name
- Status filtering (submitted, in_progress, loe_pending, completed)
- Job deletion
- Click job to view details

**Key Files**:
```
src/pages/Dashboard.tsx                      # Main dashboard route
src/components/dashboard/JobListView.tsx     # List view container
src/components/dashboard/job-list/JobList.tsx  # Job list component
src/components/dashboard/job-list/JobListItem.tsx  # Individual job item
src/components/dashboard/job-list/JobListContext.tsx  # State management
src/components/dashboard/job-list/JobSearch.tsx  # Search component
src/components/dashboard/job-list/StatusFilter.tsx  # Status filter
src/components/dashboard/AppraisalTable.tsx   # Table view
```

#### 2. Job Detail View (`/dashboard/job/:jobId` route)
**File**: `src/components/dashboard/JobDetailView.tsx`

**Sections** (Accordion-based):
1. **Client Submission** - View submitted data
2. **LOE Quote** - Prepare Letter of Engagement
3. **Property Info** - Additional property details
4. **Organizing Docs** - Document management
5. **Section 4** - Data gathering tools

**Key Files**:
```
src/components/dashboard/JobDetailView.tsx
src/components/dashboard/JobDetailAccordion.tsx
src/components/dashboard/job-details/JobDetailHeader.tsx
src/components/dashboard/job-details/ClientSubmissionSection.tsx
src/components/dashboard/job-details/LoeQuoteSection.tsx
src/hooks/useJobDetail.ts                    # Job data fetching hook
```

#### 3. Valcre Integration - Creating Jobs

**Process**:
1. Appraiser fills LOE details (fees, dates, scope)
2. Clicks "Create Valcre Job" button
3. System sends data to Valcre API
4. Valcre returns job number (e.g., `VAL251014`) and job ID
5. System saves job number to `job_submissions.job_number`
6. System saves Valcre job ID to `job_loe_details.valcre_job_id`

**Key Files**:
```
src/components/dashboard/job-details/actions/ValcreAction.tsx
src/utils/webhooks/valcre.ts                 # Valcre API integration
src/config/valcre.ts                         # Valcre configuration
```

**Code Flow**:
```typescript
// src/components/dashboard/job-details/actions/ValcreAction.tsx
const handleSendToValcre = async () => {
  // 1. Prepare data
  const valcreData = {
    formData: {
      clientFirstName: job.clientFirstName,
      clientLastName: job.clientLastName,
      propertyAddress: job.propertyAddress,
      appraisalFee: jobDetails.appraisalFee,
      // ... more fields
    }
  };
  
  // 2. Send to Valcre API
  const result = await sendToValcre(valcreData);
  
  // 3. Update database with job number
  if (result.success && result.jobNumber) {
    await supabase
      .from('job_submissions')
      .update({ 
        job_number: result.jobNumber,
        valcre_status: 'sent'
      })
      .eq('id', job.id);
    
    // Also update LOE details
    await supabase
      .from('job_loe_details')
      .update({ valcre_job_id: result.jobId })
      .eq('job_id', job.id);
  }
};
```

**Database Updates**:
- `job_submissions.job_number` → Valcre job number (e.g., "VAL251014")
- `job_submissions.valcre_status` → "sent"
- `job_loe_details.valcre_job_id` → Valcre internal job ID (integer)

#### 4. LOE Preparation Section

**Location**: `src/components/dashboard/job-details/LoeQuoteSection.tsx`

**Features**:
- Job number display (from Valcre or pending)
- Property rights selection
- Valuation section (fee, retainer, payment terms)
- Delivery date
- Scope of work
- Comments section
- "Sync to Valcre" button (updates existing Valcre job)

**LOE Fields**:
- Job Number (from Valcre)
- Appraisal Fee
- Retainer Amount
- Payment Terms
- Delivery Date
- Scope of Work
- Property Rights Appraised
- Report Type
- Special Instructions

**Database Table**: `job_loe_details`
- Links to `job_submissions` via `job_id`
- Stores all LOE-specific data
- Can sync to Valcre when updated

---

## Stage 3: E-Signature Flow

### Overview
After LOE is prepared, appraisers generate a preview, review it, and send it to clients for e-signature via DocuSeal.

### Key Components

#### 1. LOE Preview Generation

**Process**:
1. Appraiser clicks "Generate LOE Preview" button
2. System loads V3 LOE template (HTML)
3. System maps job data to template fields
4. System generates HTML document with all data populated
5. Preview modal opens showing complete document

**Key Files**:
```
src/components/dashboard/job-details/actions/ESignatureAction.tsx
src/components/dashboard/job-details/actions/LOEPreviewModal.tsx
src/utils/loe/generateLOE.ts                 # LOE generation logic
src/utils/loe/v3Template.ts                  # LOE HTML template
```

**Code Flow**:
```typescript
// src/components/dashboard/job-details/actions/ESignatureAction.tsx
const handleGeneratePreview = async () => {
  // 1. Generate HTML from template
  const html = await generateLOEHTML(job, jobDetails);
  
  // 2. Show preview modal
  setPreviewHTML(html);
  setShowPreview(true);
};

// src/utils/loe/generateLOE.ts
export async function generateLOEHTML(job, jobDetails) {
  // Load template
  let templateHTML = await loadV3Template();
  
  // Map data to template fields
  const fieldMappings = mapDataToV3Fields(job, jobDetails);
  
  // Replace placeholders
  for (const [field, value] of Object.entries(fieldMappings)) {
    templateHTML = templateHTML.replace(
      new RegExp(field, 'g'), 
      value
    );
  }
  
  return templateHTML;
}
```

#### 2. LOE Preview Modal

**Features**:
- Full document preview in iframe
- Zoom controls (25% - 200%)
- Email recipient editing
- Download preview as HTML
- "Send to Client" button

**File**: `src/components/dashboard/job-details/actions/LOEPreviewModal.tsx`

**Preview Features**:
- Responsive zoom (default 75%)
- Email validation
- Download functionality
- Approval workflow

#### 3. DocuSeal Integration - Sending for Signature

**Process**:
1. Appraiser reviews preview
2. Appraiser clicks "Send to Client"
3. System creates DocuSeal submission
4. System sends email to client via Resend API
5. Client receives email with signing link
6. System saves DocuSeal submission ID to database

**Key Files**:
```
src/utils/webhooks/docuseal.ts               # DocuSeal API integration
src/utils/webhooks/formSubmission.ts         # Email sending (Resend)
```

**Code Flow**:
```typescript
// src/components/dashboard/job-details/actions/ESignatureAction.tsx
const handleApproveAndSend = async (recipientEmail?: string) => {
  // 1. Map job data to DocuSeal fields
  const docuSealFields = mapJobToDocuSealFields(job, jobDetails);
  
  // 2. Create DocuSeal submission
  const submission = await createDocuSealSubmission({
    template_id: DOCUSEAL_TEMPLATE_ID,
    send_email: true,
    submitters: [{
      email: recipientEmail || job.clientEmail,
      name: `${job.clientFirstName} ${job.clientLastName}`,
      role: 'signer',
      fields: docuSealFields
    }]
  });
  
  // 3. Save submission ID
  await supabase
    .from('job_loe_details')
    .update({ 
      docuseal_submission_id: submission.id,
      loe_sent_at: new Date().toISOString()
    })
    .eq('job_id', job.id);
  
  // 4. Update job status
  await supabase
    .from('job_submissions')
    .update({ status: 'loe_pending' })
    .eq('id', job.id);
};
```

**Email Flow**:
- Edge Function: `supabase/functions/send-loe-email-fixed`
- Uses Resend API for email delivery
- Includes signing link: `https://docuseal.com/s/[slug]`
- HTML and plain text versions

#### 4. Client Signing Page (`/sign/:id` route)

**File**: `src/pages/SigningPage.tsx`

**Features**:
- Displays complete LOE document
- Embedded DocuSeal signing widget
- Mobile-friendly
- Branded with Valta logo

**Process**:
1. Client clicks link in email
2. Page loads with LOE document displayed
3. DocuSeal widget shows signature fields
4. Client signs document
5. DocuSeal finalizes document
6. Client receives signed PDF via email

#### 5. Post-Signature Workflow

**Webhook Integration** (Future):
- DocuSeal sends webhook when document signed
- Dashboard receives webhook
- Job status updates to `"in_progress"`
- Signed PDF available for download

**Current Status**:
- Manual status update after client signs
- Signed PDF available in DocuSeal dashboard
- Can be downloaded and stored in Supabase Storage

**Database Updates**:
- `job_submissions.status` → `"in_progress"`
- `job_loe_details.loe_signed_at` → Timestamp
- `job_loe_details.signed_pdf_url` → PDF URL (if stored)

---

## Stage 4: Report Builder (Phase 2)

### Overview
After LOE is signed, the job moves to the report building phase. The Report Builder is a comprehensive tool for creating appraisal reports with 1,687+ fields organized into 19 sections.

### Key Components

#### 1. Report Builder Entry Point (`/mock-builder` route)

**File**: `src/pages/MockReportBuilder.tsx`

**Features**:
- Split-screen layout (edit panel + preview panel)
- Section sidebar navigation
- Live preview with debouncing
- Test data loading
- Full report generation

**Key Files**:
```
src/pages/MockReportBuilder.tsx              # Entry point
src/features/report-builder/components/ReportBuilderLayout.tsx  # Main layout
src/features/report-builder/components/SectionSidebar.tsx  # Section navigation
src/features/report-builder/components/EditPanel/EditPanel.tsx  # Editor panel
src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx  # Preview panel
src/features/report-builder/store/reportBuilderStore.ts  # State management (6,340 lines!)
```

#### 2. State Management

**Technology**: Zustand

**Store File**: `src/features/report-builder/store/reportBuilderStore.ts` (6,340 lines)

**Key Features**:
- 1,687 fields dynamically generated from `fieldRegistry`
- 19 sections with subsections
- Calculated fields (Income Approach, Sales Comparison, Cost Approach)
- Image management
- Template interpolation
- Preview HTML generation

**Store Structure**:
```typescript
interface ReportBuilderState {
  sections: ReportSection[];           // All report sections
  activeSection: string;                // Currently selected section
  previewHtml: string;                  // Generated HTML preview
  activeTestMode: 'designer' | 'test-report';
  
  // Actions
  updateFieldValue: (fieldId: string, value: any) => void;
  runCalculations: () => void;
  loadFullTestData: () => Promise<void>;
  initializeMockData: () => void;
  interpolateTemplate: (sections: ReportSection[], template: string) => string;
}
```

#### 3. Field Registry System

**File**: `src/features/report-builder/schema/fieldRegistry.ts`

**Purpose**: Central registry of all 1,687 fields with metadata

**Field Structure**:
```typescript
{
  id: string;                    // Unique field ID
  storeId: string;               // Store field ID (may differ)
  label: string;                 // Display label
  type: 'text' | 'number' | 'textarea' | 'image' | 'calculated';
  section: string;                // Section ID (e.g., 'cover', 'calc')
  subsection?: string;            // Optional subsection
  defaultValue: any;              // Default value
  inputSource: 'user-input' | 'calculated' | 'auto-filled';
  inputType?: 'user-input' | 'dropdown' | 'auto-filled';
}
```

**Sections**:
1. Cover
2. Home
3. Report
4. Exec (Executive Summary)
5. Photos
6. Site
7. Location
8. Tax
9. Market
10. Zone (Zoning)
11. HBU (Highest & Best Use)
12. Calc (Income Approach Calculator)
13. Land1
14. Cost S (Cost Approach)
15. Calc Output
16. Rentroll
17. Sales (Sales Comparison)
18. Rent Analysis
19. Income
20. Recon (Reconciliation)
21. Cert (Certification)

#### 4. Edit Panel

**File**: `src/features/report-builder/components/EditPanel/EditPanel.tsx`

**Features**:
- Tab navigation between sections
- Field editors by type:
  - Text fields → `TextFieldEditor.tsx`
  - Image fields → `ImageFieldEditor.tsx`
  - Calculated fields → `CalculatedFieldDisplay.tsx`
  - Dropdown fields → Select component
- Section-specific image management
- Field background colors (user-input = yellow, calculated = green)

**Field Rendering**:
```typescript
const renderField = (field: ReportField) => {
  if (field.type === 'image') {
    return <ImageFieldEditor field={field} />;
  }
  if (field.type === 'calculated') {
    return <CalculatedFieldDisplay field={field} />;
  }
  if (field.type === 'textarea') {
    return <TextFieldEditor field={field} />;
  }
  // ... more types
};
```

#### 5. Preview Panel

**File**: `src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx`

**Features**:
- iframe-based preview
- Uses standalone viewer (`/preview-wrapper.html`)
- Injects generated HTML pages
- Toggle between sample data and interpolated values
- Page count display

**Preview Flow**:
1. Store generates HTML from template
2. HTML injected into iframe
3. Standalone viewer renders pages
4. User can toggle preview mode
5. Updates automatically on field changes (debounced)

#### 6. Calculation Engine

**Files**:
- `src/features/report-builder/store/costApproachCalculations.ts`
- `src/features/report-builder/store/salesCompCalculations.ts`
- Calculation logic embedded in `reportBuilderStore.ts`

**Income Approach Calculations**:
- Potential Gross Revenue (PGR)
- Vacancy & Loss
- Effective Gross Revenue (EGR)
- Operating Expenses
- Net Operating Income (NOI)
- Capitalization Rate
- Indicated Value

**Sales Comparison Calculations**:
- Comparable sales adjustments
- Adjusted values
- Final reconciled value

**Cost Approach Calculations**:
- Land value
- Building cost
- Depreciation
- Total cost value

**Calculation Flow**:
```typescript
// In reportBuilderStore.ts
runCalculations: () => {
  // 1. Extract all field values
  const fieldValues = extractFieldValues(sections);
  
  // 2. Run Income Approach
  const incomeOutputs = runIncomeCalculations(fieldValues);
  
  // 3. Run Sales Comparison
  const salesOutputs = runSalesCompCalculations(fieldValues);
  
  // 4. Run Cost Approach
  const costOutputs = runCostApproachCalculations(fieldValues);
  
  // 5. Update all calculated fields
  updateFields([...incomeOutputs, ...salesOutputs, ...costOutputs]);
  
  // 6. Regenerate preview
  regeneratePreview();
}
```

#### 7. Template System

**File**: `src/features/report-builder/templates/reportHtmlTemplate.ts`

**Purpose**: HTML template for report generation

**Features**:
- Page-based structure (`.page-sheet` divs)
- Field interpolation (`{{fieldId}}`)
- Styling for print-ready output
- Multi-page support

**Template Interpolation**:
```typescript
interpolateTemplate: (sections: ReportSection[], template: string) => {
  // Extract all field values
  const fieldValues = extractAllFieldValues(sections);
  
  // Replace placeholders
  let html = template;
  for (const [fieldId, value] of Object.entries(fieldValues)) {
    html = html.replace(
      new RegExp(`{{${fieldId}}}`, 'g'),
      String(value || '')
    );
  }
  
  return html;
}
```

#### 8. Test Data System

**File**: `src/features/report-builder/data/northBattlefordTestData.ts`

**Purpose**: Comprehensive test data for validation

**Features**:
- 750+ fields populated
- Real-world property data
- Image URLs
- Calculated values

**Loading Test Data**:
```typescript
loadFullTestData: async () => {
  // 1. Load test data
  Object.entries(northBattlefordTestData).forEach(([fieldId, value]) => {
    updateFieldValue(fieldId, value);
  });
  
  // 2. Run calculations
  runCalculations();
  
  // 3. Regenerate preview
  regeneratePreview();
}
```

---

## Data Architecture

### Supabase Database Schema

#### Core Tables

**1. `job_submissions`**
- Main job record
- Client information
- Property information
- Status tracking
- Valcre job number

**Key Columns**:
```sql
id (uuid, primary key)
client_first_name
client_last_name
client_email
client_phone
property_name
property_address
property_type
intended_use
valuation_premises
status (submitted, in_progress, loe_pending, completed)
job_number (Valcre job number, e.g., "VAL251014")
valcre_status
valcre_sent_at
created_at
updated_at
```

**2. `job_loe_details`**
- LOE-specific data
- Links to job via `job_id`
- Valcre integration
- DocuSeal integration

**Key Columns**:
```sql
id (uuid, primary key)
job_id (uuid, foreign key → job_submissions.id)
job_number (Valcre job number)
valcre_job_id (integer, Valcre internal ID)
appraisal_fee
retainer_amount
payment_terms
delivery_date
scope_of_work
property_rights_appraised
report_type
docuseal_submission_id
loe_sent_at
loe_signed_at
signed_pdf_url
```

**3. `job_files`**
- File metadata
- Links to job via `job_id`
- Storage path reference

**Key Columns**:
```sql
id (uuid, primary key)
job_id (uuid, foreign key → job_submissions.id)
file_name
file_path (storage path)
file_type
file_size
uploaded_at
```

**4. `job_details`**
- Additional job details
- Extended property information
- Internal notes

**5. `client_profiles`**
- Client auto-fill data
- Historical client information
- Contact preferences

### Storage Buckets

**1. `job-files`**
- Client-uploaded documents
- Structure: `{job_id}/{filename}`
- Public read, authenticated write

**2. `report-images`** (Future)
- Report images
- S3 integration for image management

### Data Flow

```
Client Form
  ↓
job_submissions (status: "submitted")
  ↓
Dashboard Review
  ↓
Valcre Job Creation
  ↓
job_submissions.job_number = "VAL251014"
job_loe_details.valcre_job_id = 12345
  ↓
LOE Generation
  ↓
DocuSeal Submission
  ↓
job_loe_details.docuseal_submission_id = "sub_abc123"
job_submissions.status = "loe_pending"
  ↓
Client Signs
  ↓
job_submissions.status = "in_progress"
job_loe_details.loe_signed_at = timestamp
  ↓
Report Builder
  ↓
Final Report Generation
```

---

## Integration Points

### 1. Valcre API Integration

**Purpose**: Create and manage appraisal jobs in Valcre

**Endpoints Used**:
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/{jobId}` - Update existing job
- `GET /api/jobs/{jobId}` - Get job details

**Key File**: `src/utils/webhooks/valcre.ts`

**Field Mapping**:
- Client info → Valcre client fields
- Property info → Valcre property fields
- LOE details → Valcre job fields
- Custom field mapping for property types, intended use

**Response Handling**:
- Job number (e.g., "VAL251014")
- Job ID (integer)
- Error handling and retry logic

### 2. DocuSeal API Integration

**Purpose**: E-signature workflow for LOE

**Endpoints Used**:
- `POST /api/submissions` - Create submission
- `GET /api/submissions/{id}` - Get submission status
- Webhook: `POST /api/webhooks/docuseal` - Signature completion

**Key File**: `src/utils/webhooks/docuseal.ts`

**Template**: DocuSeal template ID `1680270`

**Field Mapping**: 22 fields mapped from job data

**Email Integration**: Resend API via Edge Function

### 3. ClickUp API Integration

**Purpose**: Task management and workflow tracking

**Endpoints Used**:
- `POST /api/v2/list/{listId}/task` - Create task
- `PUT /api/v2/task/{taskId}` - Update task
- Custom fields for job tracking

**Key File**: `src/utils/webhooks/clickup.ts`

**Features**:
- Automatic task creation (optional)
- Status updates
- Job number linking

### 4. Google Drive API Integration

**Purpose**: Create project folders for document organization

**Key File**: `src/components/dashboard/job-details/actions/GoogleFolderAction.tsx`

**Features**:
- Create folder with job number
- Set permissions
- Link folder to job

### 5. Supabase Integration

**Purpose**: Backend database and storage

**Features**:
- Real-time subscriptions
- Row-level security
- Storage buckets
- Edge Functions

**Key Files**:
```
src/integrations/supabase/client.ts         # Supabase client
src/integrations/supabase/types.ts           # Generated types
```

---

## File Structure Reference

### Core Application Files

```
src/
├── pages/
│   ├── Index.tsx                            # Client intake form
│   ├── Dashboard.tsx                         # Dashboard routes
│   ├── SigningPage.tsx                       # Client signing page
│   └── MockReportBuilder.tsx                # Report builder entry
│
├── components/
│   ├── submission-form/                      # Client form components
│   │   ├── SubmissionForm.tsx
│   │   ├── useFormSubmission.ts
│   │   ├── ClientInformationSectionWithAutoFill.tsx
│   │   └── PropertyInformationSection.tsx
│   │
│   └── dashboard/
│       ├── JobListView.tsx                   # Job list view
│       ├── JobDetailView.tsx                 # Job detail view
│       ├── JobListItem.tsx                   # Job list item
│       ├── JobDetailAccordion.tsx            # Accordion sections
│       │
│       ├── job-list/                         # Job list components
│       │   ├── JobList.tsx
│       │   ├── JobListContext.tsx
│       │   ├── JobSearch.tsx
│       │   └── StatusFilter.tsx
│       │
│       └── job-details/                      # Job detail components
│           ├── JobDetailHeader.tsx
│           ├── ClientSubmissionSection.tsx
│           ├── LoeQuoteSection.tsx
│           ├── PropertyInfoSection.tsx
│           │
│           └── actions/                      # Action buttons
│               ├── ValcreAction.tsx
│               ├── ESignatureAction.tsx
│               ├── LOEPreviewModal.tsx
│               ├── GoogleFolderAction.tsx
│               └── ClickUpAction.tsx
│
├── features/
│   └── report-builder/                        # Report builder feature
│       ├── components/
│       │   ├── ReportBuilderLayout.tsx       # Main layout
│       │   ├── SectionSidebar.tsx             # Navigation
│       │   ├── EditPanel/
│       │   │   ├── EditPanel.tsx
│       │   │   ├── TextFieldEditor.tsx
│       │   │   ├── ImageFieldEditor.tsx
│       │   │   └── CalculatedFieldDisplay.tsx
│       │   └── PreviewPanel/
│       │       ├── PreviewPanel.tsx
│       │       └── PreviewRenderer.tsx
│       │
│       ├── store/
│       │   ├── reportBuilderStore.ts          # Main store (6,340 lines!)
│       │   ├── costApproachCalculations.ts
│       │   └── salesCompCalculations.ts
│       │
│       ├── schema/
│       │   ├── fieldRegistry.ts               # 1,687 fields
│       │   ├── fieldGenerators.ts
│       │   └── workbookFieldMapping.ts
│       │
│       ├── templates/
│       │   ├── reportHtmlTemplate.ts          # HTML template
│       │   └── reportPageTemplates.ts
│       │
│       ├── data/
│       │   ├── northBattlefordTestData.ts    # Test data
│       │   └── image-manifest.json
│       │
│       └── utils/
│           ├── exportReport.ts
│           └── previewDebounce.ts
│
├── hooks/
│   ├── useJobDetail.ts                        # Job data hook
│   ├── useJobData.ts
│   ├── useJobActions.ts
│   └── useSaveJobDetails.ts
│
├── utils/
│   ├── webhooks/
│   │   ├── valcre.ts                          # Valcre integration
│   │   ├── docuseal.ts                        # DocuSeal integration
│   │   ├── clickup.ts                         # ClickUp integration
│   │   └── formSubmission.ts                  # Form submission
│   │
│   ├── loe/
│   │   ├── generateLOE.ts                      # LOE generation
│   │   └── v3Template.ts                      # LOE template
│   │
│   └── formatters.ts                          # Data formatting
│
├── types/
│   └── job.ts                                 # TypeScript types
│
└── integrations/
    └── supabase/
        ├── client.ts                          # Supabase client
        └── types.ts                           # Database types
```

### Documentation Files

```
docs/
├── ARCHITECTURE-OVERVIEW.md                   # This file
├── 01-Client-Form-Submission/                 # Client intake docs
├── 06-LOE-Generator/                           # LOE generation docs
├── 07-Valcre-Integration/                      # Valcre integration docs
├── 15-Contract-review/                         # Report builder docs
│   └── 0-Architecture/
│       └── MOCK-REPORT-BUILDER-IMPLEMENTATION.md
└── PHASE-1-COMPLETE-WORKFLOW.md               # Workflow documentation
```

---

## Workflow Summary

### Complete Job Lifecycle

1. **Client Submission** (`/`)
   - Client fills form
   - Data saved to Supabase
   - Status: `"submitted"`

2. **Dashboard Review** (`/dashboard`)
   - Appraiser views job list
   - Clicks job to view details
   - Reviews client submission

3. **LOE Preparation** (`/dashboard/job/:id`)
   - Appraiser fills LOE details
   - Creates Valcre job (optional)
   - Gets Valcre job number

4. **LOE Preview & Send**
   - Generate LOE preview
   - Review in modal
   - Send to client via DocuSeal

5. **Client Signing** (`/sign/:id`)
   - Client receives email
   - Reviews LOE document
   - Signs via DocuSeal widget

6. **Post-Signature**
   - Status updates to `"in_progress"`
   - Job ready for report building

7. **Report Building** (`/mock-builder`)
   - Navigate to report builder
   - Fill 1,687+ fields
   - Run calculations
   - Generate preview
   - Export final report

---

## Key Design Decisions

### 1. Two-Stage Workflow
- **Stage 1**: Client intake → LOE → Signature
- **Stage 2**: Report building → Final report

### 2. Supabase as Single Source of Truth
- All data stored in Supabase
- External APIs used for specific functions
- Job status drives workflow

### 3. Component-Based Architecture
- Reusable components
- Clear separation of concerns
- Context for shared state

### 4. Field Registry System
- Centralized field definitions
- Dynamic section generation
- Easy to add/modify fields

### 5. Preview-First Approach
- Always show preview before sending
- Real-time updates
- Quality assurance built-in

---

## Future Enhancements

### Phase 2.5 (In Progress)
- Report builder integration with job workflow
- Automatic job status updates
- Report export to PDF/DOCX

### Phase 3 (Planned)
- Client portal for status tracking
- Automated reminders
- Advanced reporting
- Multi-user collaboration

---

## Conclusion

APR Dashboard v3 is a comprehensive system that manages the entire appraisal workflow from client submission to final report generation. The architecture is designed for scalability, maintainability, and extensibility, with clear separation between stages and well-defined integration points.

The system successfully integrates multiple third-party services while maintaining Supabase as the central data store, ensuring data consistency and reliability throughout the workflow.

