# 🎯 APR Dashboard V3 System - MASTER EVERGREEN OVERVIEW

> **⚠️ READ THIS FILE FIRST** - This is the master system overview that provides complete context for the APR Dashboard V3 project. All session-specific files in this directory reference this master document.

**File Purpose:** Evergreen master overview - Updated when system fundamentals change, not per-session
**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/-passover-sessions/00-SYSTEM-OVERVIEW-EVERGREEN.md`
**Naming Convention:** `00-` prefix ensures this appears first alphabetically for easy discovery

---

**Project Location:** `/Users/bencrowe/Development/APR-Dashboard-v3`

**Date Created:** October 2025 (V3 rebuild)
**Date Documented:** November 18, 2025
**Last Updated:** November 27, 2025 (ClickUp hyperlink fix deployed)
**Status:** Production - Testing Phase (90% complete)
**Client:** Chris (Valta Appraisals)
**Core Innovation:** Automated appraisal job workflow from client submission → Valcre Appraisal App → ClickUp task management → DocuSeal LOE generation

---

## 📂 How Session Files Are Organized

**This folder structure:**
- `00-SYSTEM-OVERVIEW-EVERGREEN.md` ← **YOU ARE HERE** (master overview, read first)
- `25-11-19-3 - [Session Name].md` ← Session-specific work (chronological)
- `25-11-06 | APR Ses-3 [Session Name].md` ← Older sessions
- `README.md` ← Index of all sessions (if exists)

**Session Files Location:**
`/Users/bencrowe/Development/APR-Dashboard-v3/docs/-passover-sessions`

**How to Find Specific Work:**
See "How to Find & Continue This Work" section below ↓


## How to Find & Continue This Work
**Search Patterns for Memory:**

```bash
# Primary project search
/check-all-memory "[project name]"

# By date range
/check-all-memory "[project name] after:2025-11-01"

# By feature/component
/check-all-memory "[project name] [key feature]"
/check-all-memory "[project name] [technology/integration]"

# By problem/issue
/check-all-memory "[project name] [specific issue]"
```

**Search Keywords (use these):**
- Project: `[project-name]` `[project-acronym]`
- Tech: `[tech-stack-items]`
- Features: `[major-features]`
- Integrations: `[external-systems]`
- Client: `[client-name]` (if applicable)


2. **I'll be able to see:**
   - Every question you asked
   - Every answer I gave
   - Every iteration and decision point
   - All code changes and file modifications
   - The exact context of where we left off

3. **vs Memory Search (less accurate):**
   - "Search Cognee for APR Dashboard..."
   - Might miss specific decisions or nuances
   - Requires interpretation of summaries

---


**Major Accomplishments:**


**Files Created/Modified:**
- `/api/valcre.ts` - Complete field mapping overhaul
- `/src/utils/webhooks/valcre.ts` - Added intendedUse + comment fields
- `/src/components/dashboard/job-details/LoeQuoteSection.tsx` - 3 comment fields UI
- `/docs/CUSTOM-FIELDS-ANALYSIS.md` - Analysis of 10 custom fields
- `/docs/FIELD-MAPPING-ASSUMPTIONS.md` - Investment Value assumption
- `/docs/IMPLEMENTATION-STATUS.md` - Updated status
- `/docs/1-API-FIELD-MAPPING-REFERENCE.md` - New field mappings

**Top Discoveries:**


**Next Session Will Focus On:**


---

## What This System Is

A modern web application that automates the complete appraisal job workflow for Valta Appraisals, from initial client submission through CRM integration, task management, and Line of Effort (LOE) document generation. The system replaces manual data entry across multiple platforms (Valcre CRM, ClickUp, DocuSeal) with a single client-facing form that automatically syncs 51 complex field mappings across three integrated systems.

The dashboard provides real-time job tracking, automated quote generation, and seamless integration with existing appraisal workflows, reducing manual data entry from 30+ minutes per job to zero while eliminating human error in field mapping.

### The Big Discovery

**Field mapping complexity is the core challenge** - not just the number of fields (51), but the multiple naming conventions (camelCase vs PascalCase), UI vs API name mismatches, enum format requirements, and webhook payload dependencies that create silent data loss when not handled correctly. The Investment Value mapping assumption and custom field analysis revealed that seemingly simple dropdowns hide deep integration complexities.

**Key Innovation:** Accept multiple field name variants, map UI labels to correct API field names, use PascalCase enum format, and include all fields in webhook payloads to ensure zero data loss across CREATE and UPDATE operations.

**Business Impact for Client (Chris/Valta Appraisals):**
- **Time Savings:** 30+ minutes per job → automated (saves 15+ hours/week)
- **Data Accuracy:** Human error in field entry eliminated
- **Client Experience:** Professional online submission form vs email/phone calls
- **Task Automation:** ClickUp tasks auto-created with all job details
- **Quote Speed:** LOE documents generated instantly via DocuSeal
- **CRM Integration:** Valcre automatically populated with complete job data

---

## Core Architecture

### System Components

**1. Client Submission Form**
- Location: Public-facing form at client URL
- Technology: React 18 + TypeScript + Tailwind CSS + Shadcn UI
- Purpose: Capture all appraisal job details from client
- Fields: Property details, contact info, job requirements, LOE specifications

**2. Supabase Backend**
- Database: PostgreSQL with 2-table architecture
  - `job_submissions` - Main job data
  - `job_loe_details` - Line of Effort / Quote details
- Authentication: Secure access for dashboard
- Real-time: Live updates for job status changes

**3. Valcre API Integration**
- Purpose: CRM system for appraisal jobs
- Integration: RESTful API with complex field mappings
- File: `/api/valcre.ts` (1,200+ lines)
- Webhook: `/src/utils/webhooks/valcre.ts` for real-time sync
- Fields: 51 mapped fields across Jobs, Properties, LOE

**Key Field Mappings (All 51):**
- **Comments:** General, Delivery, Payment → Comments/DeliveryComments/PaymentComments (3)
- **Property Rights:** Dashboard dropdown → Valcre Purpose (13 values)
- **Intended Use:** Dashboard dropdown → Valcre Authorized Use (6 values)
- **Scope of Work:** Dashboard dropdown → Valcre ScopeOfWork (14 values)
- **Valuation Premises:** Dashboard dropdown → Valcre Values (5 values)
- **Report Type:** Dashboard dropdown → Valcre Format (10 values)

**Field Naming Conventions:**
- API accepts multiple variants: `InternalComments`, `internalComments`, `appraiserComments`
- Enum format: PascalCase without spaces (`DirectComparisonApproach`)
- UI vs API: "Scope" (UI) → "ScopeOfWork" (API)

**4. ClickUp Integration**
- Purpose: Task management for appraisal workflow
- Auto-creation: Stage 1 tasks created on job submission
- Auto-update: Stage 2 tasks updated with LOE details on Valcre job creation
- API: ClickUp REST API
- Hyperlinks: APR Dashboard and Valcre job links (clickable blue text)
- Token: Frontend token needs update (401 errors - Issue #6)
- Task Format: [Client Name] - [Address] - [Job Type]
- **Recent Fix (Nov 27):** Hyperlinks now render correctly using markdown_description field

**5. DocuSeal LOE Generation**
- Purpose: Line of Effort quote documents with eSignature
- Integration: Multi-page field mapping to DocuSeal templates
- Workflow: LOE Preview → Send to Client → eSignature
- Status: Working correctly, but email preview error exists (Issue #3)

**6. Dashboard UI**
- Location: `/src/components/dashboard/`
- Job Details View: Complete job information with edit capabilities
- LOE Quote Section: 3-column responsive layout for comments + quote fields
- Real-time sync: Auto-save to Supabase + Valcre
- UX Issue: Annoying sync popups need fixing (Issue #4)

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn UI Components
- React Router for navigation

**Backend:**
- Supabase (PostgreSQL + Auth + Real-time)
- Node.js serverless functions (Vercel)

**Integrations:**
- Valcre API (Appraisal CRM)
- ClickUp API (Task Management)
- DocuSeal API (Document + eSignature)

**Deployment:**
- Vercel (frontend + serverless functions)
- Production URL: [Client-facing URL]

---

## How It Works

### Complete Job Workflow

**Step 1: Client Submission**
- Client fills out public submission form
- Form captures all property details, contact info, job requirements
- Submission creates record in Supabase `job_submissions` table

**Step 2: Valcre Job Creation**
- Webhook triggers on submission
- Creates Valcre Job with all field mappings
- Creates Valcre Property with property details
- Maps 51 fields using correct API names and enum formats
- Returns VAL number (Valcre job ID)

**Step 3: ClickUp Task Creation**
- Stage 1 task auto-created in ClickUp
- Task name: [Client Name] - [Address] - [Job Type]
- Task includes all job details in description
- Assigned to appropriate team member

**Step 4: Dashboard Access**
- Appraiser logs into dashboard
- Views complete job details
- Can edit any field with auto-save to Supabase
- Changes sync to Valcre in real-time (via webhook)

**Step 5: LOE Quote Generation**
- Appraiser fills LOE section (quote details)
- Data syncs to `job_loe_details` table
- "Preview & Send LOE" generates DocuSeal document
- Multi-page field mapping populates all LOE fields
- Client receives eSignature request via email

**Step 6: Quote Approval**
- Client signs LOE via DocuSeal
- Signed document stored
- Status updates to "Quote Approved"
- ClickUp task moves to next stage (Stage 2 - future implementation)

### Field Mapping Flow (Critical Detail)

**CREATE Operation (New Job):**
1. Client form submits → Supabase
2. Webhook reads Supabase data
3. Maps Dashboard field names → Valcre API field names
4. Converts values to PascalCase enum format
5. POSTs to Valcre API `/Jobs`, `/Properties`, `/LOE` endpoints
6. Returns VAL number, stores in Supabase

**UPDATE Operation (Edit Job):**
1. Dashboard auto-save triggers on field change
2. Webhook reads changed field from Supabase
3. Must include field in webhook payload (or PATCH fails)
4. Maps field name + value format
5. PATCHes to Valcre API
6. Returns success/failure

**Critical Requirements:**
- Fields must be in webhook payload to sync on UPDATE
- API must accept multiple field name variants
- Enum values must be exact PascalCase match
- UI field labels ≠ API field names (requires mapping)

### Data Flow Diagram

```
Client Form Submission
    ↓
Supabase (job_submissions table)
    ↓
Webhook Trigger
    ├─→ Valcre API
    │   ├─ POST /Jobs (create job with 51 field mappings)
    │   ├─ POST /Properties (property details)
    │   └─ POST /LOE (quote details)
    │       ↓
    │   Returns VAL number
    │
    └─→ ClickUp API
        └─ POST /Tasks (Stage 1 task creation)
            ↓
        Returns Task ID
    ↓
Dashboard View (React UI)
    ├─ Display job details
    ├─ Edit any field (auto-save)
    │   ↓
    │   Webhook → PATCH Valcre (real-time sync)
    │
    └─ Generate LOE
        ↓
    DocuSeal API
        ├─ POST /Templates (multi-page field mapping)
        └─ Send eSignature email to client
            ↓
    Client Signs → Status Update → ClickUp Stage 2
```

---

## Where You Left Off

**Status:** Production - Testing Phase (90% complete)

**What's Working:**

- ✅ Client form submission (all fields captured)
- ✅ Supabase database (2-table architecture)
- ✅ Valcre integration (51 field mappings working)
- ✅ ClickUp Stage 1 auto-creation (deployed Nov 6)
- ✅ ClickUp Stage 2 auto-update with LOE details (deployed Nov 27)
- ✅ ClickUp hyperlinks (APR Dashboard + Valcre job links clickable - deployed Nov 27)
- ✅ DocuSeal LOE generation (multi-page field mapping functional)
- ✅ Dashboard UI (core functionality working)
- ✅ Real-time sync (Supabase → Valcre webhook)
- ✅ Comment fields (General, Delivery, Payment - 3-column layout)
- ✅ All dropdown field mappings (Property Rights, Intended Use, Scope, Valuation Premises, Report Type)

**What's Pending:**

1. **Issue #2 (HIGH):** Additional Notes polluting "Off-Site Improvements" field
   - Client form "Additional Information" maps to wrong Valcre field
   - Currently: Maps to Property "Off-Site Improvements" (incorrect)
   - Should: Map to Job Comments "Client" field
   - Impact: Pollutes property data with client notes

2. **Issue #3 (MEDIUM):** LOE Email Preview error
   - Error appears after changing email in eSignature Previewer
   - Unclear if email actually sends
   - Steps: Fill LOE → Preview & Send → Change email → Error
   - Need to reproduce and capture exact error message

3. **Issue #4 (MEDIUM):** Valcre Sync annoying popups
   - Popup on every field change (poor UX)
   - Shows before job exists (no VAL number yet)
   - Should: Silent sync with subtle indicator, single confirmation

4. **Issue #5 (MEDIUM):** ClickUp task name too long
   - Current: [Client Name] - [Full Address with Province/Postal] - [Job Type]
   - Should: Remove province/postal for brevity
   - Impact: Cosmetic, but clutters ClickUp UI

5. **Issue #6 (MEDIUM):** Frontend ClickUp token expired
   - 401 errors when creating tasks from frontend
   - Need to update ClickUp API token in frontend config
   - Impact: Frontend task creation fails

6. **Issue #7 (LOW):** Remove legacy Disbursement field
   - Old field no longer used
   - Should remove from UI and database
   - Impact: Cosmetic cleanup

7. **Future:** ClickUp Stage 2 updates
   - Code exists, not yet implemented
   - Would auto-update ClickUp tasks on LOE signing
   - Status: Documented, awaiting client priority

8. **Future:** Custom fields implementation
   - Lender Information (6 fields) - deferred
   - Appraised Values (2 fields) - deferred until results workflow
   - Valuation Premise custom fields - documented for consideration

9. **Client Confirmation Needed:**
   - Verify "Investment Value" → "Prospective at Stabilization" mapping is correct
   - QA test all 51 field mappings in production
   - Review custom fields analysis and decide on implementation

**Blockers:** None - system is production-ready pending QA testing

---

## Key Files and Documentation

### Core Application Files

📄 **api/valcre.ts** (1,200+ lines)
- Purpose: Complete Valcre API integration with all field mappings
- Key functions: `createValcreJob()`, `updateValcreJob()`, `createProperty()`, `createLOE()`
- Field mappings: All 51 mappings with variant handling
- Lines of note: 244-255 (comment fields), 11-29 (PURPOSES_MAP), 88-104 (SCOPE_OF_WORK_MAP)

📄 **src/utils/webhooks/valcre.ts**
- Purpose: Webhook handler for Supabase → Valcre real-time sync
- Key functions: `syncToValcre()`, `handleJobUpdate()`, `handleJobCreate()`
- Webhook payload: Must include all fields to sync on UPDATE
- Lines of note: 101 (intendedUse), 128-134 (comment fields)

📄 **src/components/dashboard/job-details/LoeQuoteSection.tsx**
- Purpose: LOE quote section UI with 3-column comment fields
- Key features: Auto-save, responsive grid, DocuSeal preview
- Lines of note: 1030-1072 (3-column comment layout)

📄 **src/components/submission-form/**
- Purpose: Public client submission form
- Key features: Multi-step form, validation, Supabase submission

📄 **supabase/migrations/**
- Purpose: Database schema migrations
- Tables: `job_submissions`, `job_loe_details`
- Recent: Added `delivery_comments`, `payment_comments` columns (Nov 13)

### Documentation Files

📄 **docs/1-API-FIELD-MAPPING-REFERENCE.md**
- Purpose: Master reference for all 51 Valcre API field mappings
- Updated: November 13, 2025
- Contents: Dashboard field → Valcre field, enum values, examples

📄 **docs/FIELD-MAPPING-ASSUMPTIONS.md**
- Purpose: Documents field mapping assumptions needing client confirmation
- Key assumption: "Investment Value" → "Prospective at Stabilization"
- Created: November 13, 2025

📄 **docs/CUSTOM-FIELDS-ANALYSIS.md**
- Purpose: Analysis of 10 custom fields for future implementation
- Contents: Lender Information (6 fields), Appraised Values (2 fields), Valuation Premise fields
- Created: November 13, 2025

📄 **docs/IMPLEMENTATION-STATUS.md**
- Purpose: Complete bug tracking and implementation status
- Updated: November 13, 2025
- Contents: Open bugs (#2-#7), resolved issues, feature status

📄 **docs/api-reference.md**
- Purpose: API integration docs and conventions
- Contents: Endpoints, authentication, field schemas

📄 **docs/field-mapping.md**
- Purpose: Original field mapping documentation
- Status: Superseded by 1-API-FIELD-MAPPING-REFERENCE.md

📄 **docs/deployment.md**
- Purpose: Deployment procedures and troubleshooting
- Platform: Vercel
- Environment: Production

### Passover Session Files

📂 **docs/-passover-sessions/**
- Latest: `25-11-13 | APR Ses-13.md` (Field Mapping Fixes session)
- Complete history: Sessions 1-13 (Oct-Nov 2025)
- Archive: `_v3-early-sessions/` (V3 rebuild sessions)

📄 **25-11-13 | APR Ses-13.md** (Most Recent)
- Session overview, 6 issues fixed, 51 field mappings
- Key decisions, deliverables, complete field mapping summary
- Next steps, search keywords

📄 **25-11-13 | Field Mapping Fixes.md**
- Detailed technical documentation of all 6 fixes
- Code changes with line numbers
- Before/after examples

📄 **README.md** (docs/-passover-sessions/)
- Index of all sessions
- Session naming convention
- Quick reference

---

## Integration with Other Systems

### Valcre CRM (Primary Integration)

**What it does:** Appraisal job management CRM for real estate appraisers

**Integration depth:** Deep - 51 field mappings across 3 API endpoints

**Key challenges:**
- UI labels ≠ API field names ("Scope" vs "ScopeOfWork")
- Enum format requirements (PascalCase without spaces)
- Multiple field name variants needed (camelCase, PascalCase)
- Webhook payload requirements for UPDATE operations

**API Documentation:** Limited - required extensive trial/error testing

**Success metrics:**
- 51/51 field mappings working (as of Nov 13)
- Zero data loss on CREATE and UPDATE operations
- Real-time sync functional

### ClickUp (Task Management)

**What it does:** Project management and task tracking

**Integration:** Auto-create Stage 1 tasks on job submission

**Status:** Working (deployed Nov 6), but token expired (Issue #6)

**Future:** Stage 2 auto-update on LOE signing (code exists, not deployed)

**Task format:** [Client Name] - [Address] - [Job Type]

### DocuSeal (Document + eSignature)

**What it does:** LOE quote document generation and eSignature

**Integration:** Multi-page field mapping to template

**Status:** Working, but email preview error exists (Issue #3)

**Workflow:** Generate LOE → Preview → Send to client → eSignature

### Supabase (Database + Backend)

**What it does:** PostgreSQL database, authentication, real-time subscriptions

**Integration:** Core backend for entire application

**Tables:**
- `job_submissions` - Main job data
- `job_loe_details` - Quote details

**Features used:**
- Database (PostgreSQL)
- Authentication (secure dashboard access)
- Real-time (webhook triggers on data changes)
- Row Level Security (RLS for multi-tenancy)

---

## The Real Value

### Client Impact (Chris/Valta Appraisals)

**Time Savings:**
- Manual data entry: 30+ minutes per job
- Automated: Zero manual entry
- Weekly savings: 15+ hours (assuming 30 jobs/week)
- Monthly savings: 60+ hours

**Revenue Impact:**
- Faster job intake = more jobs processed
- Professional client experience = higher conversion
- Reduced errors = fewer client disputes
- Time savings = capacity for more billable work

**Cost Savings:**
- Eliminated: Manual CRM data entry
- Eliminated: Manual ClickUp task creation
- Eliminated: Manual LOE document creation
- Reduced: Data entry errors requiring rework

### Technical Achievements

**Field Mapping Complexity:**
- 51 total field mappings (3 comments + 48 dropdown options)
- 6 major mapping systems (Comments, Property Rights, Intended Use, Scope, Valuation Premises, Report Type)
- Multiple naming convention handling (camelCase, PascalCase, UI labels)
- Enum format conversion (PascalCase without spaces)
- Variant field name acceptance (3 variants per comment field)

**Integration Achievements:**
- 3 external APIs integrated (Valcre, ClickUp, DocuSeal)
- Real-time sync (Supabase → Valcre webhook)
- Multi-page document field mapping (DocuSeal)
- Automated workflow (Submission → CRM → Task → Document → Signature)

**Production Readiness:**
- 90% complete (ClickUp hyperlinks fixed, pending 5 bug fixes)
- Deployed to Vercel production
- Client actively using system
- QA testing in progress

### Business Model

**Revenue:** Paying customer (Chris/Valta Appraisals)

**Priority:** 🔥 9/10 (Highest revenue potential)

**Future Opportunities:**
- Template this system for other appraisal firms
- SaaS model: Monthly subscription per appraiser
- Market size: Thousands of appraisal firms in North America
- Competitive advantage: Deep Valcre integration (complex, high barrier to entry)

---

## Search Keywords

`apr-dashboard` `valcre-api` `field-mapping` `appraisal-workflow` `clickup-integration` `clickup-hyperlinks` `markdown-description` `docuseal-loe` `supabase-backend` `react-typescript` `valta-appraisals` `chris-client` `property-rights` `intended-use` `scope-of-work` `valuation-premises` `report-type` `comment-fields` `enum-conversion` `webhook-sync` `real-time-integration` `pascalcase` `camelcase` `investment-value-assumption` `custom-fields` `loe-quote` `esignature` `multi-page-mapping` `vercel-deployment` `clickable-links`

---

## Resume Instructions

### To Continue This Project

1. **Review Latest Session:**
   ```bash
   cat "/Users/bencrowe/Development/APR-Dashboard-v3/docs/-passover-sessions/25-11-13 | APR Ses-13.md"
   ```

2. **Check Current Implementation Status:**
   ```bash
   cat "/Users/bencrowe/Development/APR-Dashboard-v3/docs/IMPLEMENTATION-STATUS.md"
   ```

3. **Review Open Bugs:**
   - Issue #2 (HIGH): Additional Notes → Wrong Valcre Field
   - Issue #3 (MED): LOE Email Preview error
   - Issue #4 (MED): Valcre Sync annoying popups
   - Issue #5 (MED): ClickUp task name too long
   - Issue #6 (MED): Frontend ClickUp token expired
   - Issue #7 (LOW): Remove legacy Disbursement field

4. **Search Memory:**
   ```bash
   # Find specific implementation details
   /check-all-memory "APR Dashboard valcre field mapping"
   /check-all-memory "APR Dashboard clickup integration"
   /check-all-memory "APR Dashboard docuseal loe"
   ```

5. **Start Development Server:**
   ```bash
   cd "/Users/bencrowe/Development/APR-Dashboard-v3"
   npm run dev
   # Access at http://localhost:5173
   ```

### To Fix Issue #2 (HIGH Priority)

**Problem:** Additional Notes → Wrong Valcre Field

**Investigation Steps:**
1. Find where client form "Additional Information" field is mapped
   ```bash
   cd "/Users/bencrowe/Development/APR-Dashboard-v3"
   grep -r "Additional Information" src/
   grep -r "Off-Site Improvements" api/valcre.ts
   ```

2. Check webhook payload
   ```bash
   cat "src/utils/webhooks/valcre.ts" | grep -A 10 "additionalInformation"
   ```

3. **Fix:**
   - Update webhook to map to correct Valcre field (Job Comments → Client)
   - Remove from Property "Off-Site Improvements" mapping
   - Test CREATE and UPDATE flows
   - Verify in Valcre UI

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Fix Additional Notes mapping to correct Valcre field"
   git push
   # Vercel auto-deploys
   ```

### To Fix Issue #3 (LOE Email Preview)

**Investigation Steps:**
1. Reproduce error:
   - Fill LOE section
   - Click "Preview & Send LOE"
   - Change recipient email in DocuSeal preview
   - Submit
   - Capture exact error message

2. Check DocuSeal integration:
   ```bash
   grep -r "DocuSeal" src/
   find src/ -name "*docuseal*"
   ```

3. Check email sending service
4. Review LOE preview modal component

### To Use This System

1. **Client Submission:**
   - Navigate to client-facing form URL
   - Fill all required fields
   - Submit form
   - Verify Valcre job creation (check VAL number)

2. **Dashboard Access:**
   ```bash
   cd "/Users/bencrowe/Development/APR-Dashboard-v3"
   npm run dev
   ```
   - Login to dashboard
   - View job details
   - Edit any field (auto-saves)
   - Verify Valcre sync

3. **LOE Generation:**
   - Fill LOE section fields
   - Click "Preview & Send LOE"
   - Review multi-page DocuSeal document
   - Send eSignature request to client

4. **Testing Workflow:**
   - Test CREATE operation (new job submission)
   - Test UPDATE operation (edit existing job)
   - Verify ClickUp task creation
   - Verify DocuSeal LOE generation
   - Check all 51 field mappings in Valcre UI

---

**Last Updated:** November 18, 2025
**Next Milestone:** Fix Issue #2 (HIGH) - Additional Notes field mapping
**Long-term Vision:** Template this system for SaaS deployment to thousands of appraisal firms across North America with monthly subscription model
