# APR Dashboard - Complete System Documentation

**Status:** ✅ **FULLY IMPLEMENTED & DEPLOYED**
**Last Updated:** November 4, 2025
**Project:** APR Dashboard v3
**Production URL:** https://apr-dashboard-v3.vercel.app

---

## Overview

Modern appraisal job submission and management platform with 5 collapsible sections, auto-save everywhere, Valcre API integration, and smart document management.

## Dashboard Architecture

### Routing Structure
```typescript
/dashboard                    → Job list view
/dashboard/job/:jobId         → Job detail view (bookmarkable)
```

**Path-based routing** (not query params) for:
- Bookmarkable URLs
- Browser back/forward support
- Shareable job links

### 5 Dashboard Sections

#### Section 1: Client Information & Property Details
**Component:** `ClientSubmissionSection.tsx`

**Features:**
- Client contact information (7 fields)
- Property information (6 fields)
- Property contact (separate from client)
- Property Types (multi-select with add/remove)
- Client comments (expandable textarea)
- Uploaded documents with drag-and-drop

**Auto-Save Fields (18 total):**
```typescript
const VALCRE_SYNC_FIELDS = [
  'notes', 'valuationPremises', 'intendedUse', 'assetCondition',
  'propertyTypes', 'propertyName', 'propertyAddress',
  'clientFirstName', 'clientLastName', 'clientTitle',
  'clientOrganization', 'clientEmail', 'clientPhone', 'clientAddress',
  'propertyContactFirstName', 'propertyContactLastName',
  'propertyContactEmail', 'propertyContactPhone'
]
```

**File Upload System:**
- Drag-and-drop support
- Multiple file upload
- Supabase Storage bucket: `job-files`
- File management with download/view/delete
- Automatic file reference in `job_files` table

#### Section 2: LOE & Quote Details
**Component:** `LoeQuoteSection.tsx`

**Features:**
- Job number assignment
- Appraisal fee calculation
- Retainer amount (editable, not auto-calculated)
- Payment terms dropdown
- Report delivery date picker
- Appraiser comments
- LOE generation with DocuSeal
- Email sending with Resend API

**Currency Formatting:**
```typescript
// Display: $1,234.56
// Store: 1234.56 (raw number)
const formatCurrency = (value) => {
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
```

**LOE Generation Workflow:**
1. Fill in all required LOE fields
2. Click "Generate & Send LOE"
3. System generates HTML LOE with 22 mapped fields
4. Creates DocuSeal submission
5. Sends email to client with signing link
6. Client signs → DocuSeal webhook → Job status: 'loe_signed'

#### Section 3: Building Information & Legal Description
**Component:** `OrganizingDocsSection.tsx`

**Features:**
- Year Built
- Building Size (SF)
- Number of Units
- Parking Spaces
- Legal Description (multiline)

**Valcre Sync:** All 5 fields sync to Valcre when job number exists

#### Section 4: Property Research Data
**Component:** `PropertyInfoSection.tsx`

**Three Subsections:**

**4A. Property Site**
- Zoning Classification
- Zone Abbreviation
- Land Use Designation
- Flood Zone
- Utilities

**4B. Parcels Summary**
- Parcel Number
- Gross Building Area (SF) - formatted with commas
- Net Rentable Area (SF) - formatted with commas
- Year Built
- Buildable Land (SF)
- Total Site Area (SF)
- Assessed Value - currency formatted
- Taxes - currency formatted

**4C. Assessments & Taxes**
- Assessment Year
- Land Assessment Value
- Land Split (for reporting)
- Improved Assessment Value
- Total Assessment Value
- Building Split (for reporting)

#### Section 5: Document Upload & Organization
**Component:** `Section4Compact.tsx`

**Smart Links System:**

Automatically generates city-specific resource URLs based on property address:

```typescript
// Auto-detects city from property address
const isCalgary = address?.includes('calgary') || address?.includes('t2');
const isEdmonton = address?.includes('edmonton') || address?.includes('t5');
const isSaskatoon = address?.includes('saskatoon') || address?.includes('s7');

// Generates appropriate links
{
  calgary: {
    land_title: 'https://alta.registries.gov.ab.ca/SpinII/SearchSelectType.aspx',
    assessment: 'https://assessmentsearch.calgary.ca/',
    zoning: 'https://www.calgary.ca/pda/pd/calgary-land-use-bylaw-1p2007/land-use-bylaw-map.html',
    flood: 'https://maps.calgary.ca/RiverFlooding/',
    aerial: `https://maps.google.com/maps?q=${address}&t=k&z=18`,
    permits: 'https://www.calgary.ca/pda/pd/home-building-and-renovations/building-permit-status.html'
  }
  // Similar for Edmonton and Saskatoon
}
```

**Document Types:**
1. Land Title Certificate (required) → SPIN2 link
2. Survey Certificate/RPR → SPIN2 link
3. Tax Assessment Notice → City assessment portal link
4. Aerial Photo → Google Satellite link
5. Zoning Map (required) → City zoning map link
6. Flood Map (required) → City flood map link
7. Building Permits (multiple) → City permits link
8. Site Plan → City planning dept link

**Upload Features:**
- Drag-and-drop for each document type
- Replace existing documents
- View in browser
- Download locally
- External link to city resources
- Stored in Supabase Storage bucket: `documents`

## Auto-Save Pattern (Used Throughout)

**Implementation:**
```typescript
const autoSaveField = useCallback(async (fieldName: string, value: any) => {
  // 500ms debounce
  debounceTimers.current[fieldName] = setTimeout(async () => {
    setFieldStates(prev => ({ ...prev, [fieldName]: 'saving' }));

    // 1. Save to Supabase
    await supabase.from('job_loe_details').upsert({
      job_id: job.id,
      [fieldName]: value,
      updated_at: new Date().toISOString()
    }, { onConflict: 'job_id' });

    // 2. Sync to Valcre (if applicable)
    if (shouldSyncToValcre) {
      await sendToValcre(syncData);
    }

    setFieldStates(prev => ({ ...prev, [fieldName]: 'idle' }));
  }, 500);
}, [job, jobDetails]);
```

**Behavior:**
- 500ms debounce on all field changes
- Saves to Supabase `job_loe_details` table
- Syncs to Valcre if job number exists
- Visual feedback (spinner) during save
- Toast notification on completion
- Field name mapping: camelCase → snake_case

## Database Architecture

### Two-Table Design

**`job_submissions`** (Main job data)
```sql
CREATE TABLE job_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number VARCHAR,
  valcre_job_id VARCHAR,
  status VARCHAR DEFAULT 'pending_loe',

  -- Client Information
  client_first_name VARCHAR,
  client_last_name VARCHAR,
  client_email VARCHAR,
  client_phone VARCHAR,
  client_title VARCHAR,
  client_organization VARCHAR,
  client_address VARCHAR,

  -- Property Information
  property_name VARCHAR,
  property_address VARCHAR,
  property_types VARCHAR[],
  intended_use VARCHAR,
  valuation_premises VARCHAR,
  asset_condition VARCHAR,

  -- Property Contact
  property_contact_first_name VARCHAR,
  property_contact_last_name VARCHAR,
  property_contact_email VARCHAR,
  property_contact_phone VARCHAR,

  -- Client Comments
  notes TEXT,

  -- Integration IDs
  clickup_task_id VARCHAR,
  clickup_task_url VARCHAR,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`job_loe_details`** (Quote/LOE/Property data)
```sql
CREATE TABLE job_loe_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_submissions(id) ON DELETE CASCADE,

  -- LOE Fields
  job_number VARCHAR,
  valcre_job_id VARCHAR,
  appraisal_fee NUMERIC,
  retainer_amount NUMERIC,
  payment_terms VARCHAR,
  report_delivery_date DATE,
  internal_comments TEXT,

  -- Building Information
  year_built VARCHAR,
  building_size VARCHAR,
  number_of_units INTEGER,
  parking_spaces INTEGER,
  legal_description TEXT,

  -- Property Research
  zoning_classification VARCHAR,
  zone_abbreviation VARCHAR,
  land_use_designation VARCHAR,
  flood_zone VARCHAR,
  utilities VARCHAR,
  parcel_number VARCHAR,
  gross_building_area_sf NUMERIC,
  net_rentable_area_sf NUMERIC,
  usable_land_sf NUMERIC,
  gross_land_sf NUMERIC,
  assessed_value NUMERIC,
  taxes NUMERIC,
  assessment_year VARCHAR,
  land_assessment_value NUMERIC,
  assessment_split_land_value NUMERIC,
  improved_assessment_value NUMERIC,
  total_assessment_value NUMERIC,
  assessment_split_building_value NUMERIC,

  -- Document URLs
  land_title_url VARCHAR,
  survey_certificate_url VARCHAR,
  tax_notice_url VARCHAR,
  aerial_photo_url VARCHAR,
  zoning_map_url VARCHAR,
  flood_map_url VARCHAR,
  building_permits_urls VARCHAR[],
  site_plan_url VARCHAR,

  -- DocuSeal Integration
  docuseal_submission_id VARCHAR,
  signed_document_url VARCHAR,
  signed_at TIMESTAMP,

  -- Integration IDs (duplicated for button persistence)
  clickup_task_id VARCHAR,
  clickup_task_url VARCHAR,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(job_id)
);
```

**`job_files`** (File management)
```sql
CREATE TABLE job_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_submissions(id) ON DELETE CASCADE,
  file_name VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,  -- Supabase Storage path
  file_type VARCHAR,
  file_size INTEGER,
  storage_path VARCHAR,  -- For external signed documents
  category VARCHAR,  -- 'client_upload', 'signed_agreement', 'research_doc'
  is_client_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Why Two Tables?

**Separation of Concerns:**
- `job_submissions` = Client-provided data at intake
- `job_loe_details` = Appraiser-added data during processing

**Benefits:**
- Cleaner queries for job lists
- Easier reporting on submission vs LOE metrics
- Clear data ownership boundaries
- Prevents accidental client data overwrites

## Job Status Flow

**Status Progression:**
```
pending_loe → loe_sent → loe_signed → payment_pending → job_in_progress → completed
```

**Status Updates:**
- `pending_loe` - Initial state after form submission
- `loe_sent` - After appraiser sends LOE email
- `loe_signed` - DocuSeal webhook updates after e-signature
- `payment_pending` - Manual update or future payment integration
- `job_in_progress` - After payment received
- `completed` - After appraisal report delivered

## Integration Points

### Upstream (Form → Dashboard)
1. Client submits form (Section 1: Client Form Submission)
2. Data saves to `job_submissions` table
3. ClickUp task auto-created (Section 3: ClickUp Integration)
4. Dashboard loads job for processing

### Internal (Dashboard → Dashboard)
1. Appraiser fills LOE details (Section 2)
2. Auto-save to `job_loe_details` table
3. Valcre sync if job number exists (Section 5: Valcre Integration)
4. Document uploads to Supabase Storage (Section 1, Section 5)

### Downstream (Dashboard → External Systems)
1. **Valcre Integration** - Syncs 18 fields when job number assigned
2. **DocuSeal** - Generates LOE with 22 mapped fields
3. **Resend API** - Sends LOE email to client
4. **ClickUp** - Updates task with job progress

## Key Features

### 1. Path-Based Routing
```typescript
// Dashboard.tsx
<Routes>
  <Route path="/" element={<JobListRoute />} />
  <Route path="/job/:jobId" element={<JobDetailRoute />} />
</Routes>

// Bookmarkable URLs
https://apr-dashboard-v3.vercel.app/dashboard/job/abc-123-def
```

### 2. Smart Links System
Auto-generates city-specific resource links:
- Calgary: SPIN2, Calgary Assessment, Calgary Zoning
- Edmonton: SPIN2, Edmonton Assessment, Edmonton Zoning
- Saskatoon: ISC, Saskatoon Assessment, Saskatoon Zoning

### 3. Test Data Buttons
Every section has "Test Data" button for development:
```typescript
fillTestData() {
  onUpdateDetails({
    yearBuilt: '1998',
    buildingSize: '25000',
    numberOfUnits: 24,
    parkingSpaces: 48,
    // ... realistic test data
  });
}
```

### 4. Currency Formatting
**Display:** $1,234.56
**Store:** 1234.56
**Input Handling:** Strips $ and commas on save

### 5. Phone Formatting
**Display:** (403) 555-0100
**Store:** 4035550100
**Auto-format on blur**

### 6. Collapsible Sections
All 5 sections independent with:
- Expand/collapse state
- Loading indicators
- Auto-save feedback
- Test data buttons

## Testing

### Playwright E2E Tests
**Location:** `tests/job-routing.spec.ts`

**Tests:**
1. Job list loads
2. Click job → navigates to `/dashboard/job/:jobId`
3. URL persists on refresh
4. Browser back/forward works
5. Auto-save functionality
6. Field validation

**Run:** `npm test`

## Known Issues

### Resolved
- ✅ Retainer field now uses `Retainer` (not `RetainerAmount`) - Fixed October 2025
- ✅ ClickUp task ID persistence - Fixed with dual table update
- ✅ Currency formatting display - Working correctly
- ✅ Property Types multi-select - Using array storage

### Current Limitations
- ⚠️ **Google Docs Integration**: NOT implemented (uses Supabase Storage instead)
- ⚠️ **Document Versioning**: No version history for replaced documents
- ⚠️ **File Size Limits**: 10MB per file (Supabase Storage limit)
- ⚠️ **Collaborative Editing**: No real-time multi-user editing

## Documentation References

### Project Files
- `/Users/bencrowe/Development/APR-Dashboard-v3/README.md` - Project overview
- `/Users/bencrowe/Development/APR-Dashboard-v3/.docs/field-mapping.md` - Valcre field mappings
- `/Users/bencrowe/Development/APR-Dashboard-v3/.docs/api-reference.md` - Database schema
- `/Users/bencrowe/Development/APR-Dashboard-v3/tests/job-routing.spec.ts` - E2E tests

### Component Files
```
src/components/dashboard/
├── Dashboard.tsx                         # Main routing component
├── JobListView.tsx                       # Job list with filters
├── JobDetailView.tsx                     # Job detail wrapper
├── JobDetailAccordion.tsx                # 5 sections container
└── job-details/
    ├── ClientSubmissionSection.tsx       # Section 1
    ├── LoeQuoteSection.tsx               # Section 2
    ├── OrganizingDocsSection.tsx         # Section 3
    ├── PropertyInfoSection.tsx           # Section 4
    ├── Section4Compact.tsx               # Section 5
    └── ValcreStyles.tsx                  # Shared styling components
```

### Related Sections
- **Section 1: Client Form Submission** - Feeds data into dashboard
- **Section 3: ClickUp Integration** - Task management
- **Section 5: Valcre Integration** - API field sync
- **Section 6: LOE Generator** - Uses dashboard data
- **Section 7: Email Sequence** - Continues after LOE generation

---

**Dashboard is production-ready and fully operational with 5 complete sections.**
