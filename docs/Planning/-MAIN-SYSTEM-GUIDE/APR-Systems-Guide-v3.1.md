# APR Dashboard V3 - Systems Guide

**Version:** 3.1
**Last Updated:** November 2, 2025
**Status:** [IN PROGRESS] - Comprehensive Systems Documentation

---

## Document Purpose

This Systems Guide serves as the **single source of truth** for the complete APR Dashboard V3 vision, architecture, and implementation roadmap. It captures:

- Complete system architecture
- Current implementation status (what works today)
- Full feature roadmap (phases 1-7+)
- Technical configurations (ClickUp, Houski, N8N, APIs)
- Implementation timeline and priorities
- Missing information and blockers
- **Complete field mappings** (Dashboard → Database → Valcre API)
- **Complete database schema** (SQL definitions)
- **Known issues with prioritization**

**Use this document to:**
- Understand the complete project vision
- Know what's built vs what's planned
- Find all technical configuration details
- Plan implementation work
- Onboard new team members or AI agents
- Reference field mappings for API integration
- Execute database migrations

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Vision & Goals](#project-vision--goals)
3. [System Architecture](#system-architecture)
4. [Current Implementation Status](#current-implementation-status)
5. [Phase Roadmap](#phase-roadmap)
6. [Technical Configurations](#technical-configurations)
7. [N8N Automation Workflows](#n8n-automation-workflows)
8. [Implementation Timeline](#implementation-timeline)
9. [Known Issues & Blockers](#known-issues--blockers)
10. [Appendices](#appendices)

---

## Executive Summary

### What Is APR Dashboard V3?

**APR Dashboard** is a modern appraisal job submission and management platform for **Valta Property Valuations**. It streamlines the complete appraisal workflow from initial client submission through job completion.

**Core Problem Solved:**
Replaces fragmented manual processes (forms, emails, spreadsheets, multiple systems) with a unified web platform that automates data flow between client intake, internal workflow, external systems (Valcre, ClickUp, Pipedrive, GHL), and team coordination.

### Key Statistics

- **Production URL:** https://apr-dashboard-v3.vercel.app
- **Current Phase:** Phase 5 (Email LOE) - 70% complete
- **Tech Stack:** Next.js + React + TypeScript + Supabase + Vercel
- **Active Integrations:** Valcre API, ClickUp, DocuSeal, Resend Email, Pipedrive CRM, GHL Automation
- **Planned Integrations:** N8N, Google Drive, Houski

### System Components

```
CLIENT FORM → DASHBOARD → VALCRE → LOE/E-SIGNATURE → INVOICE → JOB ACTIVATION
    ↓            ↓          ↓            ↓                ↓            ↓
Supabase    5 Sections  Job Mgmt   DocuSeal        GHL Payment   Appraiser
                                                    Pipedrive
```

### Current Status (November 2025)

**✅ Working (Production):**
- Client form submission (iframe from Valta Website)
- Dashboard job list and detail views
- Auto-save across all fields
- Valcre job creation API
- LOE generation with live preview
- Email sending (DocuSeal signing links)
- Per-job URL routing (`/dashboard/job/:jobId`)
- ClickUp task auto-creation on form submission

**⏳ Partially Working:**
- E-signature flow (deployed, awaiting client acceptance testing)
- Email domain (valta.ca working, crowestudio.com optional)

**📋 Planned (Not Yet Built):**
- N8N automation workflows (5 workflows designed)
- Houski property data integration
- Google Drive folder creation
- Payment tracking
- Advanced document hub (Section 4)

---

## Project Vision & Goals

### Vision Statement

Transform APR Dashboard into the **complete appraisal workflow hub** where the Valta team manages everything from initial client submission through job completion, eliminating manual data entry, reducing errors, and enabling the team to focus on high-value appraisal work.

### Business Goals

1. **Reduce Manual Work:** Eliminate repetitive data entry tasks across systems
2. **Eliminate Errors:** Auto-validation prevents incorrect data from entering Valcre
3. **Improve Client Experience:** Faster turnaround, professional e-signatures, automated updates
4. **Enable Scaling:** Handle increased workload without additional admin overhead
5. **Centralize Workflow:** Single platform integrates all necessary tools

### User Goals

**For Chris (Lead Appraiser):**
- Quick job review and approval
- One-click Valcre job creation
- Professional LOE sending
- Clear status tracking

**For Yumi (Assistant):**
- Clear task assignments
- Easy document gathering
- Automated follow-ups
- Organized file management

**For Clients:**
- Simple submission process
- Professional e-signature experience
- Automated status updates
- Easy document upload

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT-FACING                            │
├─────────────────────────────────────────────────────────────────┤
│ • Valta.ca Website (Form)                                       │
│ • DocuSeal E-Signature Interface                                │
│ • Email Communications (via Resend)                             │
│ • GHL Payment Landing Pages (white-labeled)                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APR DASHBOARD V3 (Frontend)                   │
├─────────────────────────────────────────────────────────────────┤
│ • Next.js + React + TypeScript                                  │
│ • Tailwind CSS + shadcn/ui                                      │
│ • Deployed: Vercel                                              │
│ • URL: https://apr-dashboard-v3.vercel.app                      │
│                                                                 │
│ Pages:                                                          │
│ • /                      → Test form (internal)                 │
│ • /dashboard             → Job list                             │
│ • /dashboard/job/[id]    → Job detail (5 sections)              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│ PostgreSQL Database:                                            │
│ • job_submissions                                               │
│ • job_loe_details                                               │
│ • job_property_info                                             │
│ • job_files                                                     │
│                                                                 │
│ Edge Functions:                                                 │
│ • send-loe-email-fixed                                          │
│ • docuseal-webhook                                              │
│ • create-clickup-task                                           │
│ • update-clickup-task (PLANNED)                                 │
│                                                                 │
│ Storage:                                                        │
│ • Client file uploads                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                          │
├─────────────────────────────────────────────────────────────────┤
│ • Valcre API       → Job management system                      │
│ • ClickUp API      → Task management                            │
│ • DocuSeal         → E-signature                                │
│ • Resend API       → Email delivery                             │
│ • Pipedrive CRM    → Deal ticket management (B2B focused)       │
│ • GHL Automation   → Payment follow-up, email sequences         │
│ • N8N Cloud        → Workflow automation (PLANNED)              │
│ • Google Drive     → File storage (PLANNED)                     │
│ • Houski API       → Property data (PLANNED)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow: Form Submission to Job Activation

```
CLIENT FORM SUBMISSION
         │
         ▼
    Supabase DB
    (job_submissions)
         │
         ├──────────────────────────┬──────────────────────┐
         │                          │                      │
         ▼                          ▼                      ▼
   DASHBOARD VIEW            N8N: Missing Docs    CREATE CLICKUP TASK
   Section 1 populated       Check (PLANNED)      (Auto-created)
         │                          │                      │
         │                          ▼                      ▼
         │                     Email follow-up      Task: "PENDING"
         ▼                          │                      │
   Chris fills Section 2            │                      │
   (Fee, Retainer, etc)             │                      │
         │                          │                      │
         ▼                          │                      │
   CREATE VALCRE JOB ◄──────────────┘                      │
         │                                                 │
         ├─────────────────┬───────────────────────────────┘
         │                 │
         ▼                 ▼
   Returns VAL#      N8N: Create Drive Folder (PLANNED)
         │                 │
         ▼                 ▼
   Update job_loe_details  Organize files
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
   GENERATE LOE          UPDATE CLICKUP TASK
   (HTML preview)        (Name: "VAL##### - Property")
         │
         ▼
   SEND LOE EMAIL
   (DocuSeal link)
         │
         ▼
   CLIENT SIGNS
         │
         ▼
   DocuSeal Webhook
         │
         ├───────────────────────┬──────────────────────┐
         │                       │                      │
         ▼                       ▼                      ▼
   Update status:       N8N: Generate Invoice   UPDATE CLICKUP TASK
   "loe_signed"         (GHL Landing Page)      (Status: "LOE Signed")
         │                       │
         │                       ▼
         │              Email payment link to client
         │              (GHL automated sequence)
         │                       │
         │                       ▼
         │              GHL Webhook: Payment received
         │                       │
         ▼                       ▼
   UPDATE CLICKUP          Update status:
   Status: "Invoiced"      "payment_received"
                                 │
                                 ▼
                           ACTIVATE JOB
                           Assign to appraiser
```

### Database Schema (Four-Table Architecture)

**Why Four Tables?**
Separates concerns for cleaner queries, better performance, and future flexibility:
1. `job_submissions` - Initial client data (Section 1)
2. `job_loe_details` - Quote/LOE details (Section 2)
3. `job_property_info` - Building/property research (Section 3)
4. `job_files` - Document uploads (Section 4)

**See Appendix F for complete SQL schema.**

### Tech Stack Details

**Frontend:**
- React 18 + TypeScript
- Next.js (App Router)
- Tailwind CSS + shadcn/ui components
- Vite build system

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Edge Functions (Deno)
- Supabase Storage (file uploads)

**Integrations:**
- Valcre API (job management)
- ClickUp API (task management)
- DocuSeal (e-signature)
- Resend API (email delivery)
- Pipedrive CRM (deal ticket management)
- GHL Automation (payment follow-up, email sequences)
- N8N Cloud (workflow automation - planned)
- Google Drive API (file storage - planned)
- Houski API (property data - planned)

**Deployment:**
- Vercel (auto-deploy from `main` branch)
- Custom domain: apr-dashboard-v3.vercel.app

---

## Current Implementation Status

### What Works Today (Production) [COMPLETE]

#### Phase 1: Form Submission & Storage
```
✅ Client form embedded from Valta Website via iframe
✅ Form data saves to Supabase (job_submissions table)
✅ Dashboard displays new submissions
✅ Per-job URL routing: /dashboard/job/:jobId
✅ Bookmarkable job URLs (shareable links)
⚠️  Email notification (delayed/intermittent - temporary fix deployed)
```

#### Phase 2: Dashboard Interface
```
✅ Job list view (/dashboard)
✅ Job detail view with 5 sections
✅ Section 1: Client & Property Info (read-only display)
✅ Section 2: LOE Quote & Valuation Details (editable)
✅ Section 3: Building Information (editable)
✅ Section 4: Data Gathering (planned document hub)
✅ Section 5: Document Upload (basic upload working)
✅ Auto-save on all editable fields (blur event)
✅ Real-time "Saved" notifications
```

#### Phase 3: Valcre Integration
```
✅ "Create Valcre Job" button in Section 2
✅ API call to Valcre with mapped fields
✅ Returns VAL number (e.g., VAL251019)
✅ Saves VAL number to database
✅ Button updates to "View Valcre Job" after creation
✅ Direct link to Valcre job opens in new tab
✅ Four-table architecture (submissions + loe_details + property_info + files)
✅ Currency formatting (auto-strip $ and commas)
✅ Field validation before API call
```

**Critical Fix Applied (Oct 2025):**
- Retainer field now uses `Retainer` (not `RetainerAmount`)
- Location: `src/utils/webhooks/valcre.ts:142`

#### Phase 4: LOE Generation
```
✅ "Preview & Send LOE" button in Section 2
✅ Popup modal with 4-page LOE preview
✅ HTML rendering with all job details populated
✅ Live preview window (see before sending)
✅ Email recipient override (change TO address for testing)
✅ Professional formatting with company branding
```

#### Phase 5: Email & E-Signature
```
✅ "Send to Client" button in LOE modal
✅ DocuSeal API integration (creates signing link)
✅ Email sent via Resend API
✅ FROM address: Valta Appraisals <admin@valta.ca>
✅ Email includes signing link
✅ Edge Function: send-loe-email-fixed deployed
⏳ Domain verification: valta.ca working, crowestudio.com optional
⏳ Physical testing pending (email delivery + signature)
```

#### Phase 6: E-Signature Workflow (Deployed, Awaiting Client Acceptance Testing)
```
✅ DocuSeal webhook endpoint deployed
✅ Webhook updates job status to "loe_signed"
✅ Signed document storage configured
⏳ End-to-end testing pending (client signature completion)
```

#### Phase 7: ClickUp Integration (Deployed, Awaiting Client Acceptance Testing)
```
✅ Task auto-created on form submission
✅ Uses template with 9 subtasks
✅ Saves clickup_task_id and clickup_task_url to database
✅ Button displays as "View Task" link (task already exists)
✅ Edge Function creates task during job creation
⚠️  Needs update: Auto-update when Valcre job created (task name change)
⚠️  Needs update: Status updates via webhooks
```

**Note:** The "Create ClickUp Task" button in the UI is actually a "View Task" link - the task is already created automatically when the form is submitted. The button provides quick access to view the existing task in ClickUp.

### What's Partially Working [IN PROGRESS]

**Email Notifications:**
- Form submission emails delayed/intermittent
- Temporary fix deployed on Valta Website
- Proper N8N workflow planned

**ClickUp Integration:**
- Task auto-creation works
- Needs formatted description (not basic)
- Needs auto-update when VAL# assigned
- Needs status update automation via webhooks

**Domain Verification:**
- valta.ca domain working for emails
- crowestudio.com not verified (optional)

### What's Planned (Not Built) [PLANNED]

**N8N Automation Workflows:**
1. Missing Documents AI Review
2. Google Drive Folder Creation
3. Payment Follow-up & Landing Page (GHL)
4. Payment Tracking & Job Activation
5. Houski Data Auto-Population with Validation

**Advanced Features:**
- Section 4: Smart Document Hub
- PDF data extraction (AI agent)
- Municipal data scraping
- Assessment split auto-gathering
- Map screenshot automation

---

## Deployment Stages

### Overview

Components are organized into deployment stages based on dependencies. Each stage builds on the previous one - foundation components must be stable before adding components that depend on them.

**No timelines or dates** - stages represent dependency order, not delivery schedules.

---

## STAGE 1: Foundation

**Purpose:** Core workflow components that everything else depends on

**Components in this stage:**

### Client Intake Form
- Embedded from Valta Website
- Saves to Supabase database
- Email notification to team
- **Status:** Complete and stable
- **Section:** Built-in to main codebase

### Dashboard Interface
- Job list view with search/filter
- Job detail view (5 sections)
- Auto-save on all fields
- Per-job URL routing
- **Status:** Complete and stable
- **Section:** Built-in to main codebase

### Valcre Integration
- API integration with field mapping
- Returns VAL number
- Direct link to Valcre job
- **Status:** Complete and stable
- **Section:** Built-in to main codebase

### LOE Generation
- 4-page HTML LOE document
- Live preview before sending
- All job details populated dynamically
- **Status:** Complete and stable
- **Section:** Built-in to main codebase

### E-Signature Workflow
- DocuSeal integration
- Email via Resend API
- Webhook to capture signed LOE
- Updates job status
- **Status:** 90% complete, testing in progress
- **Section:** `2-section-ESIGNATURE/`
- **Implementation Details:** See Appendix for DocuSeal and Resend configuration

### ClickUp Task Management
- Task auto-created on form submission
- Template with 9 subtasks
- Task ID stored in database
- Auto-updates task name when VAL# assigned
- **Status:** Deployed, awaiting acceptance testing
- **Section:** `3-section-ClickUp-Integration/`
- **Implementation Details:** See Appendix H for complete ClickUp configuration

**Dependencies:** None - this is the foundation

**What must be stable before Stage 2:**
- Form submission must reliably save to database
- Dashboard must display and update job data
- Valcre integration must successfully create jobs
- LOE generation must produce correct documents
- E-signature workflow must complete end-to-end
- ClickUp tasks must auto-create and update

---

## STAGE 2: Automation & Workflow Enhancement

**Purpose:** Automated workflows that build on the foundation

**Depends on:** Stage 1 components must be stable

**Components in this stage:**

### N8N Workflow Automations
**What it does:**
- Payment follow-up emails (LOE signed → payment request)
- Payment tracking (payment received → status updates)
- Google Drive folder creation (VAL# assigned → organized folders)
- Missing documents AI review (form submission → document checklist)
- Houski data validation (address entered → validated property data)

**Status:** Planned, workflows designed
**Section:** Planned
**Dependencies:** Requires N8N Cloud setup, Google Drive API, Houski API credentials

### Payment Processing Integration
**What it does:**
- Stripe Checkout embedded in Next.js
- N8N sends payment request emails
- N8N handles payment webhooks
- Updates job status on payment received

**Status:** Planned
**Section:** Planned
**Dependencies:** Requires Stripe account, N8N workflows from above

### Document Hub Expansion
**What it does:**
- Smart document categorization
- Auto-gathering from municipal websites
- PDF data extraction
- Visual progress tracking

**Status:** Planned
**Section:** `4-section-DOC-MANAGEMENT/`
**Dependencies:** Requires stable document upload from Stage 1

**What Stage 2 provides to later stages:**
- Automated payment tracking enables automated job activation
- Google Drive folders provide storage for calculator exports and reports
- Document hub provides source documents for report generation
- Validated Houski data feeds into calculator and reports

---

## STAGE 3: Professional Tools

**Purpose:** Professional calculation and data entry tools

**Depends on:** Stage 1 foundation, benefits from Stage 2 automation

**Components in this stage:**

### Property Valuation Calculator
**What it does:**
- Income Approach (NOI ÷ Cap Rate)
- Sales Comparison (Comparable properties)
- Cost Approach (Replacement cost)
- Comprehensive (Weighted combination)
- Live recalculation, confidence scoring

**Status:** Ready to integrate (built, needs migration)
**Section:** `5-section-Calculator/` (placeholder - components external)
**External Location:** `/Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/08-Calculator/`
**Dependencies:** Requires job data structure from Stage 1, benefits from Houski data in Stage 2

### Google Places Address Autocomplete
**What it does:**
- Real-time address suggestions
- Validated addresses from Google
- Auto-fills city, province, postal code
- Works on client form and dashboard

**Status:** Ready to implement (setup guide complete)
**Section:** Planned (needs section folder creation)
**External Location:** `/Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/10-Google Places-enhansed field ux/`
**Dependencies:** Requires Google Cloud API key, benefits from form validation in Stage 1

### Houski Data Auto-Population
**What it does:**
- Calls Houski API for property data (14 fields)
- Cross-references with Google Maps
- AI validates data consistency
- Auto-populates if validated

**Status:** Planned
**Section:** Built-in to main codebase (planned)
**Dependencies:** Requires property address from Stage 1, validation workflow from Stage 2

**What Stage 3 provides to later stages:**
- Calculator valuation data feeds directly into report generation
- Google Places ensures accurate addresses in reports
- Houski data provides property details for reports

---

## STAGE 4: Report Generation & Analytics

**Purpose:** Complete report generation and business intelligence

**Depends on:** All previous stages - uses data from foundation, automation, and calculations

**Components in this stage:**

### Professional Appraisal Report Generator
**What it does:**
- 233 TypeScript files
- 265+ input fields
- Three valuation approaches built-in
- Professional PDF output (50+ pages)
- USPAP-compliant

**Status:** Production-ready (built, needs deployment decision)
**Section:** `6-section-Report Generator/` (placeholder - app external)
**External Location:** `/Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/14-Contract-Generator/Report-Generator/`
**Dependencies:** Requires job data from Stage 1, benefits from calculator data (Stage 3), uses automation for document gathering (Stage 2)

### Analytics & Reporting Dashboard
**What it does:**
- Job volume trends
- Revenue tracking
- Time-to-completion metrics
- Bottleneck identification

**Status:** Future - not yet designed
**Section:** Planned
**Dependencies:** Requires all job data from Stage 1, payment data from Stage 2

**Why Stage 4 comes last:**
- Reports need complete job data from Stage 1
- Reports benefit from calculator valuations (Stage 3)
- Reports pull documents from Document Hub (Stage 2)
- Analytics need stable workflow before meaningful metrics can be tracked

---

## Component Status Legend

- **Complete and stable** - Built, tested, deployed, working in production
- **Testing in progress** - Built and deployed, awaiting final verification
- **Planned** - Designed but not yet built
- **Ready to integrate** - Built externally, needs migration to main codebase
- **Ready to implement** - Setup guide complete, straightforward to add
- **Production-ready** - Complete application, needs deployment decision
- **Future** - Concept stage, no detailed design yet

---

## Migration Required

Components currently in external locations that need to be moved into `-APR-System-Roadmap/` section folders:

1. **Property Valuation Calculator** → `5-section-Calculator/`
2. **Google Places Autocomplete** → New section folder (needs creation)
3. **Report Generator** → `6-section-Report Generator/`

See `MIGRATION-CHECKLIST.md` for migration plan.

---

## How to Use This Structure

**For Planning:**
- Focus on completing Stage 1 before starting Stage 2
- Don't deploy Stage 3 tools until Stage 1 is rock solid
- Stage 4 requires everything else to be stable

**For Development:**
- Each component has a section folder with resources/docs
- External components have placeholder folders with migration instructions
- Check component status before planning work

**For Contractors:**
- Share the specific section folder for the component they're building
- Section folders contain everything needed for that component
- No need to understand entire system - just their component

---

## Technical Configurations

### Complete ClickUp Configuration

#### API Credentials
```javascript
API_KEY: 'pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'
BASE_URL: 'https://api.clickup.com/api/v2'
```

#### Workspace & List IDs
```javascript
PRODUCTION_LIST: '901402094744'  // Valta workspace (Chris's team)
TEST_LIST: '901703694310'        // Ben's workspace (testing)
TEMPLATE_ID: 't-86b3exqe8'       // LOE New Template 2025.01.09
```

#### Template Includes 9 Subtasks
1. Create & Send LOE
2. Plan Job
3. Pull (TTSZ)
4. Tour Property
5. Sale and Lease Comps
6. Build Front End
7. Complete Valuation
8. Send to Client
9. Book Job

#### Task Name Format
```
PENDING - Property Name, City
↓ (after Valcre creation)
VAL251019 - Westside Mall, Calgary
```

#### Task Description Format (Planned Enhancement)
```markdown
# Job Details

**Client:** [Organization] - [Name]
**Property:** [Address]
**Contact:** [Email] | [Phone]

## Financial
- **Appraisal Fee:** $[amount]
- **Retainer:** $[amount]
- **Payment Terms:** [terms]
- **Delivery Date:** [date]

## Links
- [View in Dashboard](dashboard_url)
- [View in Valcre](valcre_url)

## Status
Current: [status]
```

#### Current Implementation
- **Edge Function:** create-clickup-task (auto-triggered on job creation)
- **Update Function:** update-clickup-task (PLANNED - for VAL# updates)
- **Button Component:** ClickUp action component (View Task link)
- **Reference Documentation:** See Appendix H

#### Status
[x] Task auto-created on form submission
[x] Template with subtasks
[x] Database saves task references
[ ] Needs: Enhanced formatted description
[ ] Needs: Auto-update on Valcre creation
[ ] Needs: Status update automation

---

### Complete Houski Configuration

⚠️ **IMPORTANT - Accuracy Notice:**
Houski data accuracy is approximately 60%. All Houski-populated fields MUST be manually validated before inclusion in final reports. The N8N Workflow 5 includes validation steps - these are NOT optional.

#### API Credentials
```javascript
API_KEY: 'e081b601-58f5-4b03-858a-7584874089e0'
BASE_URL: 'https://api.houski.ca/v1'
```

#### CRITICAL: Correct Endpoint Usage
```bash
❌ WRONG: /search (limited fields)
✅ RIGHT: /properties/details (200+ fields available)

# Correct API call format:
GET https://api.houski.ca/v1/properties/details?address=123-main-street&city=calgary&province=ab&country=ca
Authorization: Bearer e081b601-58f5-4b03-858a-7584874089e0
```

#### 14 Primary Fields Available

| Houski API Field | Dashboard Field | Valcre Field | Section | Priority |
|------------------|-----------------|--------------|---------|----------|
| `construction_year` | yearBuilt | Year Built | 3A | HIGH |
| `total_floor_area` | buildingSize | Building Size | 3A | HIGH |
| `unit_count` | numberOfUnits | Number of Units | 3A | HIGH |
| `parking_total` | parkingSpaces | Parking Spaces | 3A | MEDIUM |
| `property_type` | buildingType | Property Type | 3A | HIGH |
| `zoning` | zoningClassification | Zone Name | 3B | HIGH |
| `lot_sqft` | usableLandSf / grossLandSf | Land Area | 3B | HIGH |
| `lot_acres` | usableLandAcres / grossLandAcres | Land Area | 3B | HIGH |
| `assessment_year` | assessmentYear | Assessment Year | 3B | HIGH |
| `assessment_value` | totalAssessmentValue | Total Assessment | 3B | HIGH |
| `land_assessment` | landAssessmentValue | Land Assessment | 3B | HIGH |
| `improvement_assessment` | improvedAssessmentValue | Improvement Assessment | 3B | HIGH |
| `property_taxes` | taxes | Property Taxes | 3B | HIGH |
| `parcel_id` | parcelNumber | Parcel Number | 3B | MEDIUM |

#### The Houski Validation Problem

**Issue:** Houski sometimes returns data for WRONG building (approximately 40% error rate)

**Example:**
- Search: "10 Quarry Park Blvd SE, Calgary" (Commercial mall)
- Houski matches: "10 Quarry Park Blvd NW, Calgary" (Residential home)
- Returns: Residential data (2-story, single family) for a shopping mall
- No warning given - appears confident

**Root Cause:**
Houski searches its internal database and matches to "closest" address. If exact address not found, returns similar address data without flagging mismatch.

**Solution:**
N8N validation workflow with Google Maps cross-reference (see N8N Automations section). This validation workflow is MANDATORY - do not use Houski data without validation.

#### Files Location
- Documentation: Houski integration folder
- Field Mapping: Houski field mapping reference
- API Usage: Houski API implementation guide

#### Status
[PLANNED] Integration was working, got deleted, needs rebuild
[PLANNED] Validation workflow designed (N8N Workflow 5)
[PLANNED] 14 fields mapped and prioritized
[IN PROGRESS] Awaiting implementation (Phase 8+)

---

### Pipedrive CRM Integration

**Purpose:** Primary CRM for deal ticket management and day-to-day client tracking.

**Status:** [DEPLOYED] In active use by team

**Workflow:**
1. Form submission creates Supabase job record
2. Job data syncs to Pipedrive deal ticket
3. Team manages deal progress in Pipedrive
4. Status updates flow back to dashboard

**Key Features:**
- Deal ticket creation
- Client tracking
- B2B focused workflow
- Team's primary workspace

**Integration Points:**
- Triggered on: Form submission
- Updates on: Job status changes
- Data synced: Client info, job details, status

**Credentials/Access:**
- Login: [To be documented]
- API Key: [Stored in environment variables]

**Team Usage:**
Pipedrive is where Chris and the team work daily for deal management. It provides familiar CRM functionality focused on B2B client relationships and deal tracking.

---

### GHL Automation Platform

**Purpose:** Backend automation for email sequences, payment follow-up, and landing pages.

**Status:** [DEPLOYED] White-labeled automation running behind scenes

**Note:** This is white-labeled as part of Valta's infrastructure. Do not refer to it as "Go High Level" in client-facing materials.

**Automation Workflows:**
1. **Payment Follow-up Sequence:**
   - Triggered: After LOE signature via DocuSeal
   - Sends: Payment request email with branded landing page link
   - Tracks: Payment completion status

2. **Email Sequences:**
   - Welcome emails
   - Payment reminders
   - Status update notifications

3. **Landing Pages:**
   - Payment collection pages (Valta branded)
   - Information gathering forms
   - Client portals

**Integration Points:**
- Triggered on: DocuSeal signature completion
- Updates on: Payment status changes
- Syncs with: Dashboard, Pipedrive

**Technical Details:**
- Platform: GHL (white-labeled)
- Branding: Matches valta.ca
- Configuration: [Environment variables]

**Key Principle:** Team works in Pipedrive (familiar), GHL automates behind scenes (invisible to team).

---

### Email Configuration (Resend)

#### API Credentials
```javascript
API_KEY: 're_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94'
BASE_URL: 'https://api.resend.com'
```

#### Domain Configuration
```
[x] valta.ca - Verified and working
[ ] crowestudio.com - Not verified (optional)
```

#### Email Templates

**Form Submission Notification:**
- Handled by: Valta Website project
- Current recipient: bc@crowestudio.com
- After domain verified: clientcare@valta.ca (production)
- Subject: `[TEST] New Appraisal Request` or `New Appraisal Request`

**LOE Email:**
- Handled by: APR Dashboard (this project)
- FROM: `Valta Appraisals <admin@valta.ca>`
- Subject: `Letter of Engagement - Ready for Signature`
- Includes: DocuSeal signing link

#### Edge Function
- Name: LOE Email Sender Edge Function
- Deployed: [x] Production
- Status: [x] Working with valta.ca domain

---

### Valcre API Integration (Complete Reference)

#### Authentication

**Method:** OAuth 2.0 Password Grant
**Endpoint:** `https://api.valcre.com/api/v1/token`

**Request:**
```json
{
  "grant_type": "password",
  "username": "{username}",
  "password": "{password}"
}
```

**Response:**
```json
{
  "access_token": "{token}",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**⚠️ Important:** Use password grant, NOT client_credentials

#### API Base URL
```
https://api.valcre.com/api/v1
```

#### Entity Creation Order (CRITICAL)

**Valcre API requires entities in this EXACT order:**

1. **Contact Entity** (Client)
2. **PropertyContact Entity** (Property Contact - if different from client)
3. **Property Entity** (Uses ContactId)
4. **PropertyParcel Entity** (Uses PropertyId - optional)
5. **PropertyParcelAssessment Entity** (Uses ParcelId - optional)
6. **Job Entity** (Uses ContactId, PropertyContactId, PropertyId)

**⚠️ Creating out of order = API error**

#### Complete POST Request Example (Create Job)

**Endpoint:** `/api/v1/Jobs`
**Method:** POST
**Trigger:** Section 2 "Create Valcre Job" button

**Request Body Structure:**
```json
{
  "Contact": {
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "john@example.com",
    "PhoneNumber": "(555) 123-4567",
    "Title": "CEO",
    "Company": "Example Corp",
    "AddressStreet": "123 Main St"
  },
  "PropertyContact": {
    "FirstName": "Jane",
    "LastName": "Smith",
    "Email": "jane@property.com",
    "PhoneNumber": "(555) 987-6543"
  },
  "Property": {
    "Name": "Example Office Building",
    "AddressStreet": "456 Commerce Dr",
    "PropertyType": "Office",
    "SizeSF": 50000,
    "BuildingsCount": 1,
    "ParkingSpacesCount": 100,
    "InvestmentGrade": "B",
    "Zoning": "C-2 Commercial",
    "ZoningName": "C-2",
    "ProposedLandUse": "Office",
    "SiteFloodZone": "Zone A",
    "Utilities": "Water, Sewer, Electric, Gas"
  },
  "PropertyParcel": {
    "Number": "123-45-678",
    "LegalDescription": "Lot 5, Block 3...",
    "PrimaryArea": 45000,
    "ExcessArea": 50000
  },
  "PropertyParcelAssessment": {
    "Year": 2024,
    "LandValue": 500000,
    "ImprovedValue": 2000000,
    "Taxes": 45000
  },
  "Job": {
    "OwnerId": 7095,
    "Status": "Active",
    "IntendedUses": "Financing/Refinancing",
    "PropertyRights": "Fee Simple Interest",
    "ValuationPremise": "Market Value As Is",
    "DueDate": "2025-12-31",
    "Description": "Comprehensive appraisal",
    "ReportFormat": "Comprehensive",
    "Fee": 5000,
    "Retainer": 2500,
    "ClientComments": "Rush delivery needed",
    "Comments": "Payment terms: NET 30"
  }
}
```

**Success Response:**
```json
{
  "Id": 12345,
  "Number": "VAL251001",
  "ContactId": 5678,
  "PropertyId": 9012,
  "PropertyContactId": 3456,
  "ParcelId": 7890,
  "AssessmentId": 1234
}
```

**⚠️ Current Implementation Issues:**
- PropertyContact entity creation fails (missing dashboard fields)
- Property, Parcel, Assessment IDs not stored in database
- Cannot update these entities later

#### Complete PATCH Request Example (Update Job)

**Endpoint:** `/api/v1/Jobs({jobId})`
**Method:** PATCH
**Trigger:** Section 3 "Sync to Valcre" button

**⚠️ CRITICAL:** Must use OData format: `/Jobs(123)` NOT `/Jobs/123`

**Request Body (partial update):**
```json
{
  "Description": "Updated scope of work",
  "DueDate": "2025-12-31",
  "Fee": 5500,
  "Retainer": 2500,
  "Comments": "Updated comments"
}
```

**Success Response:**
```json
{
  "Id": 12345,
  "Number": "VAL251001",
  "UpdatedAt": "2025-10-31T19:45:00Z"
}
```

**Limitation:** Can only update Job entity fields, not related entities (Property, PropertyParcel, PropertyParcelAssessment) because their IDs are not stored.

---

### Field Mapping Tables (Complete Section-by-Section Reference)

#### Section 1: Client Information Fields

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Type | Required | Notes |
|----------------|-----------------|----------------|------------------|--------|------|----------|-------|
| First Name | `client_first_name` | job_submissions | FirstName | Contact | Text | ✅ | |
| Last Name | `client_last_name` | job_submissions | LastName | Contact | Text | ✅ | |
| Title | `client_title` | job_submissions | Title | Contact | Text | ❌ | Optional |
| Organization | `client_organization` | job_submissions | Company | Contact | Text | ❌ | Company name |
| Phone | `client_phone` | job_submissions | PhoneNumber | Contact | Text | ✅ | Format: (XXX) XXX-XXXX |
| Email | `client_email` | job_submissions | Email | Contact | Text | ✅ | Validated |
| Address | `client_address` | job_submissions | AddressStreet | Contact | Text | ❌ | Full address |

#### Section 1: Property Information Fields

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Type | Required | Notes |
|----------------|-----------------|----------------|------------------|--------|------|----------|-------|
| Property Name | `property_name` | job_submissions | Name | Property | Text | ✅ | |
| Property Address | `property_address` | job_submissions | AddressStreet | Property | Text | ✅ | |
| Property Type | `property_type` | job_submissions | PropertyType | Property | Dropdown | ✅ | Must match Valcre exactly |
| Intended Use | `intended_use` | job_submissions | IntendedUses | Job | Dropdown | ✅ | |
| Valuation Premises | `valuation_premises` | job_submissions | ValuationPremise | Job | Dropdown | ✅ | |
| Asset Condition | `asset_condition` | job_submissions | InvestmentGrade | Property | Dropdown | ✅ | Maps to A/B/C grades |
| Notes | `notes` | job_submissions | Comments | Job | Textarea | ❌ | Free text |

#### Section 1: Property Contact Fields (🔴 MISSING FROM UI)

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Status | Notes |
|----------------|-----------------|----------------|------------------|--------|--------|-------|
| Same as Client Contact | `same_as_client_contact` | job_submissions | N/A | N/A | ❌ Missing UI | Checkbox logic |
| Property Contact First Name | `property_contact_first_name` | job_submissions | FirstName | PropertyContact | ❌ Missing UI | Data collected but invisible |
| Property Contact Last Name | `property_contact_last_name` | job_submissions | LastName | PropertyContact | ❌ Missing UI | Data collected but invisible |
| Property Contact Email | `property_contact_email` | job_submissions | Email | PropertyContact | ❌ Missing UI | Data collected but invisible |
| Property Contact Phone | `property_contact_phone` | job_submissions | PhoneNumber | PropertyContact | ❌ Missing UI | Data collected but invisible |

#### Section 2: Job Information

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Auto-Generated | Editable | Notes |
|----------------|-----------------|----------------|------------------|--------|----------------|----------|-------|
| Job Number | `job_number` | job_submissions | Number | Job | ✅ | ❌ | Format: VAL25XXXX, read-only |
| ClickUp Task Link | `clickup_task_url` | job_loe_details | N/A | N/A | ✅ | ❌ | Created on form submission |

#### Section 2: Property Details

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Type | Options |
|----------------|-----------------|----------------|------------------|--------|------|---------|
| Property Rights | `property_rights_appraised` | job_loe_details | PropertyRights | Job | Dropdown | Fee Simple, Leased Fee, Leasehold, Partial, Other |
| Valuation Premises | `valuation_premises` | job_loe_details | ValuationPremise | Job | Dropdown | As Is, As Is And Stabilized, As Complete And Stabilized, Land As Is |
| Delivery Date | `delivery_date` | job_loe_details | DueDate | Job | Date | Date picker |
| Scope of Work | `scope_of_work` | job_loe_details | Description | Job | Dropdown | All Applicable, Direct Comparison, Income, Cost, Best Two |
| Report Type | `report_type` | job_loe_details | ReportFormat | Job | Dropdown | Comprehensive, Summary, Restricted, Form, Letter |

#### Section 2: Financial Details

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Format | Transformation |
|----------------|-----------------|----------------|------------------|--------|--------|----------------|
| Appraisal Fee | `appraisal_fee` | job_loe_details | Fee | Job | Currency | Remove $ and commas |
| Retainer Amount | `retainer_amount` | job_loe_details | Retainer | Job | Currency | Remove $ and commas |
| Disbursement % | `disbursement_percentage` | job_loe_details | N/A | N/A | Percentage | Not synced to Valcre |
| Payment Terms | `payment_terms` | job_loe_details | Comments | Job | Dropdown | ⚠️ Workaround field |

#### Section 3A: Building Information

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Format | Notes |
|----------------|-----------------|----------------|------------------|--------|--------|-------|
| Year Built | `year_built` | job_property_info | Comments | Job | Year (YYYY) | ⚠️ Should map to Property.YearBuilt |
| Gross Building Area | `building_size` | job_property_info | SizeSF | Property | Square Feet | Total building area |
| Net Rentable Area | `net_rentable_area` | job_property_info | N/A | N/A | Square Feet | Not synced to Valcre |
| First Floor Footprint | `first_floor_footprint` | job_property_info | N/A | N/A | Square Feet | Not synced to Valcre |
| Number of Units | `number_of_units` | job_property_info | BuildingsCount | Property | Integer | For multifamily |
| Parking Spaces | `parking_spaces` | job_property_info | ParkingSpacesCount | Property | Integer | Total parking |
| Legal Description | `legal_description` | job_property_info | LegalDescription | PropertyParcel | Textarea | |

#### Section 3B: Property Site

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Type | Options |
|----------------|-----------------|----------------|------------------|--------|------|---------|
| Zoning | `zoning_classification` | job_property_info | Zoning | Property | Text | Full description |
| Zone Code | `zone_abbreviation` | job_property_info | ZoningName | Property | Text | Short code (C-2, R-1) |
| Land Use | `land_use_designation` | job_property_info | ProposedLandUse | Property | Text | Allowed uses |
| Flood Zone | `flood_zone` | job_property_info | SiteFloodZone | Property | Dropdown | 11 options (ANI, No Flood, Zone A, etc.) |
| Utilities | `utilities` | job_property_info | Utilities | Property | Text | Available utilities |

#### Section 3B: Parcels Summary

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Format | Notes |
|----------------|-----------------|----------------|------------------|--------|--------|-------|
| Parcel Number | `parcel_number` | job_property_info | Number | PropertyParcel | Text | APN/PIN from tax records |
| Usable Land (SF) | `usable_land_sf` | job_property_info | PrimaryArea | PropertyParcel | Square Feet | Buildable area |
| Gross Land (SF) | `gross_land_sf` | job_property_info | ExcessArea | PropertyParcel | Square Feet | Total parcel area |

#### Section 3B: Assessments & Taxes

| Dashboard Field | Database Column | Database Table | Valcre API Field | Entity | Format | Notes |
|----------------|-----------------|----------------|------------------|--------|--------|-------|
| Assessment Year | `assessment_year` | job_property_info | Year | PropertyParcelAssessment | Year (YYYY) | Tax year |
| Land Value | `land_assessment_value` | job_property_info | LandValue | PropertyParcelAssessment | Currency | Assessed land value |
| Improved Value | `improved_assessment_value` | job_property_info | ImprovedValue | PropertyParcelAssessment | Currency | Assessed building value |
| Taxes | `taxes` | job_property_info | Taxes | PropertyParcelAssessment | Currency | Annual property tax |

---

### Other API Configurations

#### Valcre API
```
Endpoint: [URL from environment]
Authentication: API Key
Field Mapping: See Field Mapping Tables above
```

#### DocuSeal
```
Integration: E-signature
Webhook: /api/webhooks/docuseal
Status: ✅ Working
```

#### Supabase
```
URL: https://ngovnamnjmexdpjtcnky.supabase.co
Project ID: ngovnamnjmexdpjtcnky
Database: PostgreSQL
Storage: Client file uploads
Edge Functions: Deployed
```

---

### Supabase Best Practices & Webhook Patterns

#### The Upsert Anti-Pattern ⚠️ CRITICAL

**Problem Discovered in V2:**
Supabase `.upsert()` without proper `onConflict` handling fails silently when the target column doesn't have a UNIQUE constraint.

**Symptoms:**
- Data appears to save successfully (no errors)
- Database queries show no new/updated rows
- Button states don't persist after page reload
- Webhooks report success but data missing

**Example Failure (V2 ClickUp Integration):**
```typescript
// ❌ FAILS SILENTLY
await supabase
  .from('job_loe_details')
  .upsert(
    { job_id: '123', clickup_task_id: 'abc123' },
    { onConflict: 'job_id' }  // job_id has NO unique constraint!
  );

// Result: No error, no data saved
```

**Root Cause:**
PostgreSQL `ON CONFLICT` requires a UNIQUE constraint on the conflict column. Without it, upsert degrades to an insert-only operation that fails when duplicates exist.

**Solution: Check-Then-Update Pattern** ✅

Always use explicit check-then-update for `job_loe_details` operations:

```typescript
// ✅ WORKS RELIABLY
const { data: existing } = await supabase
  .from('job_loe_details')
  .select('id')
  .eq('job_id', jobId)
  .maybeSingle();

if (existing) {
  // Record exists - UPDATE
  await supabase
    .from('job_loe_details')
    .update({
      clickup_task_id,
      clickup_task_url,
      updated_at: new Date().toISOString()
    })
    .eq('job_id', jobId);
} else {
  // Record doesn't exist - INSERT
  await supabase
    .from('job_loe_details')
    .insert({
      job_id: jobId,
      clickup_task_id,
      clickup_task_url
    });
}
```

**When to Use Check-Then-Update:**
- ✅ Any `job_loe_details` operations
- ✅ Tables without UNIQUE constraints on join columns
- ✅ When upsert behavior is critical to functionality
- ✅ Webhook endpoints saving to database

**When Upsert is Safe:**
- ✅ Tables with proper UNIQUE constraints defined
- ✅ Tables with PRIMARY KEY as onConflict target
- ✅ After verifying database schema supports upsert

**V2 Bug History:**
- **Issue:** ClickUp button persistence failed (Oct 9, 2025)
- **Iterations:** 4 debugging iterations to discover root cause
- **Fix:** Added UNIQUE constraint + rewrote to check-then-update pattern
- **Files Affected:** `LoeQuoteSection.tsx`, `ValcreAction.tsx`, ClickUp Edge Function

**Prevention:**
```sql
-- Verify table has proper constraint before using upsert
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'job_loe_details';

-- Add UNIQUE constraint if needed
ALTER TABLE job_loe_details
ADD CONSTRAINT job_loe_details_job_id_unique UNIQUE (job_id);
```

---

#### Sync vs Creation Operations Pattern

**Problem:**
Shared webhook functions that handle both full job creation AND partial LOE updates can fail when fields are missing.

**Example: Valcre Webhook**
```typescript
// Handles TWO different operations:
// 1. Full job creation (needs ALL fields including clientName)
// 2. LOE sync (only LOE fields, no client data)

// ❌ FAILS: Assumes all fields always present
const [firstName, lastName] = formData.clientName.split(' ');
// TypeError: Cannot read property 'split' of undefined
```

**Solution: Detect Operation Type Early** ✅

```typescript
// Detect operation context FIRST
const isSyncOperation = data.updateType === 'loe_details' && data.jobId;

if (isSyncOperation) {
  // ===== LOE SYNC PATH =====
  // Only LOE fields present, no client data

  // Skip client parsing entirely
  // Only process LOE fields
  const loePayload = {
    Fee: formData.appraisalFee ? parseFloat(formData.appraisalFee.replace(/[$,]/g, '')) : 0,
    Retainer: formData.retainerAmount ? parseFloat(formData.retainerAmount.replace(/[$,]/g, '')) : 0,
    // ... other LOE fields only
  };

  // Field transformations for LOE sync
  // Remove $ symbols, % symbols before sending

  return await patchValcreJob(data.jobId, loePayload);
}

// ===== FULL JOB CREATION PATH =====
// All fields required, validate presence
if (!formData.clientName) {
  return { error: 'Missing required field: clientName' };
}

// Safe to parse now
const [firstName, lastName] = formData.clientName.split(' ');
// ... full entity creation
```

**Key Principles:**
1. **Detect context early** - Check operation type before processing fields
2. **Branch logic explicitly** - Separate code paths for different operations
3. **Validate per context** - Different required fields for different operations
4. **Transform appropriately** - Sync operations may need field cleanup (remove $, %)

**Benefits:**
- ✅ No `undefined.split()` errors
- ✅ Cleaner code separation
- ✅ Easier testing (test each path independently)
- ✅ Better error messages (context-specific validation)

**V2 Bug Fixed:** Sync to Valcre button TypeError (Oct 8, 2025)

**Files Using This Pattern:**
- Valcre API integration webhook handler
- Any webhook handling multiple operation types

---

## N8N Automation Workflows

### Workflow 1: Missing Documents AI Review

**Purpose:** Proactively follow up on incomplete submissions

**Trigger:** Form submission (Supabase webhook)

**Process:**
```
1. Fetch job data (client info, uploaded files)
2. AI Agent reviews submission
   - Checks for critical documents
   - Analyzes property type requirements
   - Identifies missing items
3. IF missing documents:
   - Generate follow-up email
   - List required documents
   - Send to client
   - Update ClickUp task (add checklist)
4. IF complete:
   - Proceed to next workflow
   - No email sent
```

**AI Prompt Example:**
```
Review this appraisal submission:
- Property Type: Commercial Retail
- Documents Uploaded: [list]
- Intended Use: Financing

Required documents for this property type:
[Standard list based on property type]

Identify missing critical documents and draft a professional follow-up email.
```

**Status:** 📋 Designed, awaiting N8N setup

---

### Workflow 2: Google Drive Folder Creation

**Purpose:** Organize job files in Google Drive

**Trigger:** Valcre job created (VAL# assigned)

**Process:**
```
1. Copy folder template
2. Rename: "VAL251019 - Property Name"
3. Place in: 2. Appraisals/2025/Client Intake/
4. Create subfolders:
   - 01-Client-Documents/
   - 02-Research/
   - 03-Photos/
   - 04-Comps/
   - 05-Final-Report/
5. Upload client files from Supabase Storage
6. Rename files with proper naming convention
7. Update Supabase with folder ID and URL
8. Add ClickUp comment with folder link
```

**Missing Information:**
- Google Drive folder template ID
- Parent folder ID
- OAuth credentials
- File naming conventions

**Status:** 📋 Workflow designed, needs Google Drive access

---

### Workflow 3: Payment Follow-up (GHL Integration)

**Purpose:** Automated payment request after LOE signed

**Trigger:** Job status = "loe_signed"

**Process:**
```
1. Fetch job data
2. GHL Automation: Payment Follow-up Sequence
   - Send branded email with payment link
   - Link to white-labeled payment landing page
   - Include invoice details and amount due
3. GHL Landing Page:
   - Collects payment information
   - Valta.ca branding
   - Payment processing
4. Update Supabase
   - payment_requested_at
   - payment_link
   - status: "payment_requested"
5. Update ClickUp
   - Status: "Payment Requested"
   - Comment: "💳 Payment link sent: $[amount]"
```

**Missing Information:**
- GHL API credentials
- Landing page template IDs
- Payment processor integration details
- Email sequence template IDs

**Status:** 📋 Workflow designed, needs GHL configuration

---

### Workflow 4: Payment Tracking & Job Activation

**Purpose:** Activate job when payment received

**Trigger:** GHL webhook (payment received)

**Process:**
```
1. Extract payment info
   - Invoice ID
   - Amount paid
   - Payment date
   - Payment method
2. Find job in Supabase (by invoice_id)
3. Update job status
   - payment_received_at: NOW()
   - payment_amount: [amount]
   - payment_method: [method]
   - status: "payment_received"
4. Update ClickUp task
   - Status: "Active - In Progress"
   - Comment: "✅ Payment received: $[amount]"
   - Assign to field appraiser
5. Update Pipedrive
   - Deal status: "Payment Received"
   - Next action: "Schedule Inspection"
6. Optional: Team notification
   - Slack or email
   - "Job VAL251019 activated"
```

**Missing Information:**
- GHL webhook setup
- Payment workflow preferences
- Team notification preferences

**Status:** 📋 Workflow designed, depends on GHL integration

---

### Workflow 5: Houski Data Validation

**Purpose:** Auto-populate property data with MANDATORY validation

**Trigger:** Address entered in Section 3

⚠️ **CRITICAL:** This validation workflow is MANDATORY. Houski data has approximately 60% accuracy and must be validated before use.

**Detailed Process:**
```
┌─────────────────────────────────────────────┐
│ Node 1: Houski API Lookup                   │
│ GET /properties/details?address=...         │
│ Returns: 14 fields of property data         │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Node 2: Google Maps API - Place Details    │
│ Find place by exact address                 │
│ Returns: {                                  │
│   name: "Property Name",                    │
│   types: ["shopping_mall"],                 │
│   formatted_address: "..."                  │
│ }                                            │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Node 3: Google Street View API              │
│ Get building photo at coordinates           │
│ Returns: Image URL                          │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Node 4: Claude AI - Cross-Reference         │
│                                              │
│ Prompt: "Compare these data sources:        │
│                                              │
│ HOUSKI DATA:                                 │
│ - Property Type: Residential                │
│ - Building Size: 2,500 sq ft                │
│ - Stories: 2                                 │
│ - Zoning: R-1                                │
│                                              │
│ GOOGLE MAPS DATA:                            │
│ - Name: 'Shopping Centre'                   │
│ - Types: ['shopping_mall']                  │
│ - Street View: [image]                      │
│                                              │
│ ANALYZE:                                     │
│ 1. Property type match?                     │
│    Residential vs Mall → CONFLICT           │
│ 2. Size plausible?                          │
│    2,500 sf for mall → CONFLICT             │
│ 3. Zoning match?                            │
│    R-1 for commercial → CONFLICT            │
│ 4. Visual check: Match description?         │
│                                              │
│ Return JSON: {                               │
│   validation_result: 'PASS' | 'FAIL',      │
│   confidence: 0-100,                        │
│   conflicts: [array],                       │
│   recommendation: 'USE' | 'REVIEW'          │
│ }"                                           │
│                                              │
│ Claude analyzes and returns result          │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Node 5: Decision Branch                     │
│                                              │
│ IF confidence >= 80%:                       │
│   → Populate Section 3 with Houski data    │
│   → Mark as validated                       │
│                                              │
│ IF confidence 50-79%:                       │
│   → Populate BUT add warning flag           │
│   → Comment: "⚠️ Verify Houski data"        │
│                                              │
│ IF confidence < 50%:                        │
│   → DO NOT populate                         │
│   → Alert: "❌ Manual entry required"       │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Node 6: Update Dashboard                    │
│ PATCH /rest/v1/job_loe_details             │
│ {                                            │
│   [14 Houski fields if validated],          │
│   houski_validated: true/false,             │
│   validation_confidence: 85,                │
│   validation_conflicts: [array]             │
│ }                                            │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Node 7: Notify Team (if flagged)           │
│ IF confidence < 80:                         │
│   Add ClickUp comment with details          │
│   Link to Google Maps for verification     │
└─────────────────────────────────────────────┘
```

**Validation Checks:**
```javascript
// Check 1: Property Type Match
if (houski.property_type === 'Residential' &&
    google.types.includes('shopping_mall')) {
  conflicts.push('Property type mismatch');
}

// Check 2: Building Size Plausibility
if (houski.building_size < 5000 &&
    google.types.includes('shopping_mall')) {
  conflicts.push('Building too small for shopping center');
}

// Check 3: Zoning Logic
if (houski.zoning.startsWith('R-') &&
    google.name.includes('Mall|Shopping|Commercial')) {
  conflicts.push('Residential zoning for commercial property');
}

// Check 4: Visual Analysis
const visualCheck = analyzeStreetView(image, houski);
if (visualCheck.conflicts.length > 0) {
  conflicts.push(...visualCheck.conflicts);
}

// Calculate confidence
const confidence = conflicts.length === 0 ? 95 :
                   conflicts.length === 1 ? 60 :
                   conflicts.length >= 2 ? 20 : 0;
```

**Status:** 📋 Workflow fully designed, awaiting implementation

---

## Implementation Timeline

### High Priority: ClickUp Integration Completion

**Priority Tasks:**
1. Update `create-clickup-task` Edge Function
   - Add formatted description builder
   - Include all job details in markdown
   - Deploy to production

2. Create `update-clickup-task` Edge Function (NEW)
   - Triggered when Valcre job created
   - Updates task name (PENDING → VAL#)
   - Updates description with Valcre link
   - Deploy to production

3. Add trigger in Valcre webhook
   - Call update-clickup-task after job creation
   - Pass task_id, job_number, job_id

**Deliverable:** Fully automated ClickUp task creation + updates

---

### High Priority: Complete Physical Testing (Phase 5-7)

**Testing Checklist:**

**Phase 5: Email Delivery**
- [ ] Check inbox for LOE email
- [ ] Verify email professional appearance
- [ ] Verify sender shows "Valta Appraisals"
- [ ] Click signing link

**Phase 6: E-Signature**
- [ ] Complete signature in DocuSeal
- [ ] Verify webhook fires
- [ ] Verify status updates to "loe_signed"
- [ ] Check signed document stored

**Phase 7: ClickUp Integration**
- [ ] Verify task created on form submission
- [ ] Verify task updated on Valcre creation
- [ ] Verify formatted description looks good
- [ ] Verify all links work (dashboard, Valcre)

**Deliverable:** Confirmed working workflow end-to-end

---

### Medium Priority: N8N Setup & First Automation

**Tasks:**
1. Setup N8N integrations
   - Connect Supabase webhooks
   - Add Resend API key
   - Add Claude AI API key

2. Build & test: Missing Documents AI Review workflow
   - Create workflow in N8N
   - Test with sample submissions
   - Refine AI prompts

3. Get Yumi's workflow answers
   - Email templates
   - Payment process details
   - Payment tracking preferences

**Deliverable:** Automated missing documents follow-up working

---

### Medium Priority: File Organization & Payment

**Tasks:**
1. Setup Google Drive API access
   - OAuth credentials
   - Folder template ID
   - Parent folder structure

2. Build: Google Drive folder creation workflow
   - Test folder creation
   - Test file uploads
   - Test naming conventions

3. Setup GHL Payment Integration
   - Configure payment landing pages
   - Setup email sequences
   - Configure webhooks

4. Build: Payment follow-up workflow
   - Test email delivery
   - Test landing page
   - Test webhook updates

**Deliverable:** Automated folder creation + payment collection

---

### Future Work: Advanced Features

**Tasks:**
1. Payment tracking via GHL webhooks
2. Job activation workflow
3. Houski API rebuild (14-field auto-population)
4. Houski validation workflow (MANDATORY)
5. PDF data extraction (AI agent)
6. Municipal data scraping (Phase 1)
7. Section 4: Smart Document Hub

**Deliverable:** Minimal manual data entry for Section 3/4

---

## Known Issues & Blockers

### Priority System

**🔴 CRITICAL** - Blocks core functionality, must fix immediately
**🟡 HIGH** - Limits features, fix before wider deployment
**🟢 MEDIUM** - Improves experience, schedule for upcoming sprint
**⚪ LOW** - Nice to have, backlog

---

### 🔴 CRITICAL PRIORITY

#### Issue #1: Missing Property Contact Fields in Dashboard UI

**Status:** Data collected but not visible/editable
**Impact:** CRITICAL - Blocks Valcre PropertyContact entity creation
**Affects:** Section 1, Valcre API integration

**Problem:**
- Website form collects 5 property contact fields
- Fields stored in `job_submissions` table
- Dashboard Section 1 does NOT display these fields
- Cannot verify, edit, or view property contact data
- Valcre API PropertyContact entity creation fails

**Fields Missing from UI:**
1. `same_as_client_contact` (checkbox)
2. `property_contact_first_name`
3. `property_contact_last_name`
4. `property_contact_email`
5. `property_contact_phone`

**Solution Required:**
1. Add Property Contact section to Section 1 UI
2. Include "Same as Client Contact" checkbox with auto-fill logic
3. Make fields editable
4. Update Valcre API integration to use these fields
5. Test PropertyContact entity creation

**Priority:** CRITICAL - Must fix before V3 launch

---

#### Issue #2: Valcre Entity IDs Not Stored

**Status:** Only Job ID stored, others discarded
**Impact:** HIGH - Cannot update Property, Parcel, or Assessment entities
**Affects:** Section 3 sync, long-term data management

**Problem:**
- Valcre API returns entity IDs after creation:
  - `ContactId`
  - `PropertyContactId`
  - `PropertyId`
  - `ParcelId`
  - `AssessmentId`
- Only `JobId` is stored in `job_loe_details.valcre_job_id`
- Other IDs are discarded
- Cannot update Property, Parcel, or Assessment entities later
- Section 3 sync only updates Job entity

**Current Workaround:**
- Section 3 data added to Job.Comments field
- Not ideal for data integrity

**Solution Required:**
1. Add columns to `job_loe_details` table:
   - `valcre_contact_id`
   - `valcre_property_contact_id`
   - `valcre_property_id`
   - `valcre_parcel_id`
   - `valcre_assessment_id`
2. Store all entity IDs during POST response
3. Update PATCH operations to include these entities
4. Implement proper entity update logic

**Priority:** HIGH - Needed for full Valcre integration

---

### 🟡 HIGH PRIORITY

#### Issue #3: Dropdown Value Mismatches

**Status:** Dashboard values don't match Valcre API exactly
**Impact:** MEDIUM-HIGH - Causes sync failures for some properties
**Affects:** Property Type, Intended Use fields

**Problem:**
Dashboard values differ from Valcre API requirements:

| Dashboard | Valcre API | Result |
|-----------|-----------|--------|
| Multifamily | Multi-Family | ❌ Sync fails |
| Mixed Use | Mixed-Use | ❌ Sync fails |
| Multi-Family | Multi-Family | ✅ Would work |

**Solution Options:**

**Option A: Map in code (current approach)**
```javascript
const propertyTypeMap = {
  'Multifamily': 'Multi-Family',
  'Mixed Use': 'Mixed-Use'
};
```

**Option B: Update dashboard dropdowns**
- Change dropdown values to match Valcre exactly
- Update database values for existing records
- Update form validation

**Recommendation:** Option A (code mapping) is safer - no data migration needed

**Priority:** HIGH - Fix before wider deployment

---

#### Issue #4: Fields Using Comments Workaround

**Status:** Working but not ideal
**Impact:** MEDIUM-HIGH - Data not organized properly in Valcre
**Affects:** Payment Terms, Year Built, General Notes

**Problem:**
Some fields added to generic Comments field instead of proper Valcre API fields:

| Field | Current | Should Be |
|-------|---------|-----------|
| Payment Terms | Job.Comments | Dedicated field or internal only |
| Year Built | Job.Comments | Property.YearBuilt |
| General Notes | Job.Comments | OK (correct field) |

**Solution Required:**
1. Research if Payment Terms has dedicated Valcre field
2. Map Year Built to proper Property entity field
3. Update API integration code
4. Test field mapping

**Priority:** HIGH - Improves data organization

---

### 🟢 MEDIUM PRIORITY

#### Issue #5: Missing Optional Valcre Fields

**Status:** Not implemented
**Impact:** LOW-MEDIUM - Limits advanced Valcre features
**Affects:** Property categorization, market analysis

**Valcre Fields Not Mapped:**

| Valcre Field | Entity | Purpose | Priority |
|--------------|--------|---------|----------|
| SecondaryType | Property | Property subtype | Low |
| AnalysisLevel | Job | Analysis depth | Low |
| Market | Property | Market area | Medium |
| SubmarketName | Property | Submarket | Medium |
| QualitativeCondition | Property | Condition rating (different from InvestmentGrade) | Low |

**Solution If Needed:**
1. Add fields to dashboard UI (Section 1 or 2)
2. Add database columns
3. Implement API mappings
4. Test integration

**Priority:** MEDIUM - Nice to have, not critical

---

### ⚪ LOW PRIORITY

#### Issue #6: Section 5 Not Implemented

**Status:** Placeholder only
**Impact:** LOW - Manual process works
**Affects:** Report generation workflow

**Current State:**
- Section 5 exists but has no functionality
- Appraiser generates reports manually in separate software
- Report delivered via email manually

**Planned Features:**
- Report template selection
- Auto-population of collected data
- Valuation calculators
- PDF generation
- Client delivery workflow
- Comparable sales integration (Houski API)

**Priority:** LOW - Future enhancement, V4 or later

---

#### Issue #7: No Real-Time Notifications

**Status:** Not implemented
**Impact:** LOW - Manual checking works
**Affects:** User experience

**Current State:**
- Users manually check dashboard for new jobs
- No email notifications for status changes
- No Slack/SMS alerts

**Planned Features:**
- Email notifications on new submission
- Status change alerts
- LOE signature notifications
- Report delivery confirmations

**Priority:** LOW - Nice to have

---

## Appendices

### Appendix A: Documentation Structure

**ClickUp Integration:**
- Frontend: ClickUp action components
- Backend: ClickUp Edge Functions
- Docs: `/_ClickUp-Integration/01-Documentation/`

**DocuSeal/E-Signature Integration:**
- Docs: `/02-LOE-ESIGNATURE/`
- Edge Function: `send-loe-email-fixed`
- Webhook: `docuseal-webhook`

**Document Management:**
- Docs: `/04-DOCUMENT-MANAGEMENT/`
- Planned: N8N workflows for Google Drive

**Houski Integration:**
- Main Docs: Houski integration folder
- Field Mapping: Houski field mapping tables
- API Guide: Houski API implementation guide

**Master Documentation:**
- This Document: APR Systems Guide (current file)
- Project README: Root README file

---

### Appendix B: Session Documentation

**Primary Source:**
- Session files in passover-session directory (Oct 20, 2025 session onwards)

**Contains:**
- Complete ClickUp configuration
- Complete Houski configuration
- N8N workflow designs
- Current system status
- Implementation roadmap
- Missing information checklist

---

### Appendix C: Key Decisions & Rationale

**Decision 1: ClickUp Formatted Description vs Custom Fields**
- **Chosen:** Formatted markdown description
- **Alternative:** 20+ custom fields with API mapping
- **Rationale:** Simpler implementation, easier to maintain, better readability

**Decision 2: N8N for Complex Workflows**
- **Chosen:** N8N Cloud for multi-step workflows
- **Alternative:** Direct API calls from Edge Functions
- **Rationale:** Better for complex logic, AI integration, visual workflow builder

**Decision 3: valta.ca Email Domain**
- **Chosen:** Use valta.ca for email sending
- **Alternative:** crowestudio.com
- **Rationale:** valta.ca verified and working, professional branding

**Decision 4: Four-Table Database Architecture**
- **Chosen:** `job_submissions` + `job_loe_details` + `job_property_info` + `job_files`
- **Alternative:** Single table with all fields
- **Rationale:** Cleaner queries, better separation of concerns, future flexibility

**Decision 5: Houski Validation with AI**
- **Chosen:** Claude AI cross-references Google Maps data
- **Alternative:** Trust Houski data without validation
- **Rationale:** Prevents wrong building data from entering system (40%+ error rate without validation)

**Decision 6: Pipedrive + GHL Architecture**
- **Chosen:** Pipedrive for team workspace, GHL for automation
- **Alternative:** Single CRM system
- **Rationale:** Team familiar with Pipedrive, GHL provides superior automation, white-labeled payment pages

---

### Appendix D: Comprehensive Field Mapping Table

**Purpose:** Cross-system field comparison showing which fields exist in which systems and how they're named.

**Source:** V2 field mapping analysis (Oct 10, 2025)

| Client Form | Dashboard Fields | ClickUp Fields | Valcre Map | Match |
|------------|-----------------|---------------|-----------|-------|
| First Name | First Name | Contact Name | ✅ | ✅ |
| Last Name | Last Name | Contact Name | ✅ | ✅ |
| Title | Title | — | ✅ | — |
| Organization | Organization | Organization | ✅ | ✅ |
| Phone | Phone | Contact Phone | ✅ | ✅ |
| Email | Email | Contact Email | ✅ | ✅ |
| Address | Address | Contact Address | ✅ | ✅ |
| Property Name | Property Name | Property Name | ✅ | ✅ |
| Property Type | Property Type | Property Type | ✅ | ✅ |
| Address (Property) | Address (Property) | Property Address | ✅ | ✅ |
| Intended Use | Intended Use | — | ✅ | — |
| Valuation Premises | Valuation Premises | — | ✅ | — |
| Asset Condition | Asset Condition | — | ✅ | — |
| Additional Information | Client Comments | — | ✅ | — |
| — | Appraiser Comments | — | ✅ | — |
| — | Job Number | Job Number | ✅ | ✅ |
| — | Property Rights | Property Rights | ✅ | ✅ |
| — | Delivery Date | Delivery Date | ✅ | ✅ |
| — | Scope of Work | Scope of Work | ✅ | ✅ |
| — | Report Type | Report Type | ✅ | ✅ |
| — | Payment Terms | Payment Terms | ✅ | ✅ |
| — | Appraisal Fee | Fee Amount | ✅ | ✅ |
| — | Retainer Amount | Retainer | ✅ | ⚠️ |

**Legend:**
- ✅ = Working/Exists in system
- ❌ = Not mapped/needs implementation
- ⚠️ = Working but had critical bug (fixed in v2, verify v3)
- — = Doesn't exist in this system

**Critical Field Name Variations:**

| Dashboard Field | Valcre API Field | V2 Bug | Notes |
|----------------|------------------|--------|-------|
| `retainerAmount` | `Retainer` | ✅ Fixed | Was incorrectly using `RetainerAmount` |
| `appraisalFee` | `Fee` | ✅ OK | Correct field name |
| `clientName` | `FirstName` + `LastName` | ⚠️ Parse | Split required, handle sync operations |

**V3 Verification Needed:**
- [ ] Check `src/utils/webhooks/valcre.ts` uses `Retainer` (not `RetainerAmount`)
- [ ] Verify sync operations handle missing client data
- [ ] Confirm field transformations (remove $ and %) working

---

### Appendix E: Known V2 Bugs - Verify Not in V3

**Purpose:** Document bugs found and fixed in V2 to ensure they don't exist in V3.

#### Bug 1: Retainer Amount Field Name ⚠️ CRITICAL
**Discovered:** Oct 8, 2025 (V2)
**Location:** `src/utils/webhooks/valcre.ts:142`

**Problem:**
```typescript
// ❌ V2 WRONG (line 142)
RetainerAmount: formData.retainerAmount
  ? parseFloat(String(formData.retainerAmount).replace(/[$,]/g, ''))
  : 0,

// ✅ V2 CORRECT (line 91 - PATCH requests)
Retainer: formData.retainerAmount
  ? parseFloat(String(formData.retainerAmount).replace(/[$,]/g, ''))
  : 0,
```

**Result:**
- Setting retainer to $3000 in dashboard
- Valcre received $350 (default fallback)
- Inconsistency between POST and PATCH operations

**Fix:** Use `Retainer` consistently across all operations

**V3 Check:** Verify `valcre.ts` uses correct field name

---

#### Bug 2: Upsert Without UNIQUE Constraint
**Discovered:** Oct 9, 2025 (V2)
**Location:** Multiple files using `.upsert()` on `job_loe_details`

**Problem:**
```typescript
// ❌ FAILS SILENTLY
await supabase
  .from('job_loe_details')
  .upsert({ job_id, data }, { onConflict: 'job_id' });
// No error, no data saved (job_id has no UNIQUE constraint)
```

**Result:**
- ClickUp button state didn't persist
- Data appeared to save but wasn't in database
- 4 debugging iterations to discover root cause

**Fix:** Check-then-update pattern (see Technical Configurations: Supabase Best Practices)

**V3 Check:**
- [ ] Verify `job_loe_details.job_id` has UNIQUE constraint
- [ ] Or use check-then-update pattern consistently

---

#### Bug 3: Sync Operations Parsing Client Data
**Discovered:** Oct 8, 2025 (V2)
**Location:** `src/utils/webhooks/valcre.ts`

**Problem:**
```typescript
// ❌ FAILS on LOE sync operations
const [firstName, lastName] = formData.clientName.split(' ');
// TypeError: Cannot read property 'split' of undefined
// LOE sync doesn't include client data!
```

**Result:**
- Sync to Valcre button crashed
- TypeError visible to user
- Workflow blocked until fixed

**Fix:** Detect operation type early, branch logic (see Technical Configurations: Sync vs Creation Pattern)

**V3 Check:** Verify webhook handles both creation and sync operations

---

### Appendix F: Complete Database Schema - SQL

**Purpose:** Runnable SQL schema for all database tables with constraints, indexes, and relationships.

**Database:** PostgreSQL 15
**Project:** Supabase - APR Dashboard V3

#### Core Tables

```sql
-- ============================================================================
-- TABLE: job_submissions
-- Purpose: Main job data from client form submission (Section 1)
-- ============================================================================

CREATE TABLE job_submissions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending_review',

  -- Client Information
  client_first_name TEXT NOT NULL,
  client_last_name TEXT NOT NULL,
  client_title TEXT,
  client_organization TEXT,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_address TEXT,

  -- Property Information
  property_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  property_type TEXT NOT NULL,
  intended_use TEXT NOT NULL,
  valuation_premises TEXT,
  asset_condition TEXT,
  notes TEXT,

  -- Property Contact (collected but missing from UI)
  same_as_client_contact BOOLEAN DEFAULT FALSE,
  property_contact_first_name TEXT,
  property_contact_last_name TEXT,
  property_contact_email TEXT,
  property_contact_phone TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending_review', 'in_progress', 'completed', 'cancelled'))
);

-- Indexes for performance
CREATE INDEX idx_job_submissions_job_number ON job_submissions(job_number);
CREATE INDEX idx_job_submissions_status ON job_submissions(status);
CREATE INDEX idx_job_submissions_created_at ON job_submissions(created_at DESC);
CREATE INDEX idx_job_submissions_client_email ON job_submissions(client_email);

-- ============================================================================
-- TABLE: job_loe_details
-- Purpose: LOE and quote details (Section 2)
-- ============================================================================

CREATE TABLE job_loe_details (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_submissions(id) ON DELETE CASCADE,

  -- Valcre Integration
  valcre_job_id INTEGER,
  valcre_contact_id INTEGER,          -- 🔴 NOT IMPLEMENTED (Issue #2)
  valcre_property_contact_id INTEGER, -- 🔴 NOT IMPLEMENTED (Issue #2)
  valcre_property_id INTEGER,         -- 🔴 NOT IMPLEMENTED (Issue #2)
  valcre_parcel_id INTEGER,           -- 🔴 NOT IMPLEMENTED (Issue #2)
  valcre_assessment_id INTEGER,       -- 🔴 NOT IMPLEMENTED (Issue #2)

  -- Property Details
  property_rights_appraised TEXT,
  delivery_date DATE,
  scope_of_work TEXT,
  report_type TEXT,

  -- Financial
  appraisal_fee DECIMAL(10,2),
  retainer_amount DECIMAL(10,2),
  disbursement_percentage DECIMAL(5,2),
  payment_terms TEXT,

  -- Notes
  special_instructions TEXT,
  internal_comments TEXT,

  -- LOE Status
  loe_status TEXT DEFAULT 'draft',
  loe_sent_at TIMESTAMP,
  loe_signed_at TIMESTAMP,
  docuseal_link TEXT,

  -- ClickUp Integration
  clickup_task_id TEXT,
  clickup_task_url TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_to_valcre_at TIMESTAMP,

  -- Constraints
  CONSTRAINT valid_loe_status CHECK (loe_status IN ('draft', 'sent', 'signed', 'cancelled')),
  CONSTRAINT job_loe_details_job_id_unique UNIQUE (job_id)
);

-- Indexes for performance
CREATE INDEX idx_job_loe_valcre_job_id ON job_loe_details(valcre_job_id);
CREATE INDEX idx_job_loe_clickup_task_id ON job_loe_details(clickup_task_id);
CREATE INDEX idx_job_loe_status ON job_loe_details(loe_status);

-- ============================================================================
-- TABLE: job_property_info
-- Purpose: Property research data (Section 3A + 3B)
-- ============================================================================

CREATE TABLE job_property_info (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_submissions(id) ON DELETE CASCADE,

  -- Building Information (3A)
  year_built INTEGER,
  building_size INTEGER,         -- Square feet
  net_rentable_area INTEGER,     -- Square feet
  first_floor_footprint INTEGER, -- Square feet
  number_of_units INTEGER,
  parking_spaces INTEGER,
  legal_description TEXT,

  -- Property Site (3B)
  zoning_classification TEXT,
  zone_abbreviation TEXT,
  land_use_designation TEXT,
  flood_zone TEXT,
  utilities TEXT,

  -- Parcels Summary (3B)
  parcel_number TEXT,
  usable_land_sf INTEGER,
  gross_land_sf INTEGER,

  -- Assessments & Taxes (3B)
  assessment_year INTEGER,
  land_assessment_value DECIMAL(12,2),
  improved_assessment_value DECIMAL(12,2),
  taxes DECIMAL(10,2),

  -- Houski Validation (Future)
  houski_validated BOOLEAN DEFAULT FALSE,
  validation_confidence INTEGER, -- 0-100
  validation_conflicts JSONB,    -- Array of conflict descriptions

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_to_valcre_at TIMESTAMP,

  -- Constraints
  CONSTRAINT job_property_info_job_id_unique UNIQUE (job_id)
);

-- Indexes for performance
CREATE INDEX idx_job_property_info_job_id ON job_property_info(job_id);
CREATE INDEX idx_job_property_info_parcel_number ON job_property_info(parcel_number);

-- ============================================================================
-- TABLE: job_files
-- Purpose: Document uploads (Section 4)
-- ============================================================================

CREATE TABLE job_files (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_submissions(id) ON DELETE CASCADE,

  -- File Details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,  -- Document category
  file_path TEXT NOT NULL,  -- Supabase Storage path
  file_size INTEGER,        -- Bytes
  mime_type TEXT,

  -- Metadata
  uploaded_at TIMESTAMP DEFAULT NOW(),
  uploaded_by UUID,  -- User ID

  -- Constraints
  CONSTRAINT valid_file_type CHECK (file_type IN (
    'title', 'survey', 'tax', 'aerial', 'zoning',
    'flood', 'permits', 'site_plan', 'other'
  ))
);

-- Indexes for performance
CREATE INDEX idx_job_files_job_id ON job_files(job_id);
CREATE INDEX idx_job_files_file_type ON job_files(file_type);
CREATE INDEX idx_job_files_uploaded_at ON job_files(uploaded_at DESC);

-- ============================================================================
-- AUTO-UPDATE TRIGGERS
-- Purpose: Automatically update updated_at timestamp on record modification
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_submissions_updated_at
  BEFORE UPDATE ON job_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_loe_details_updated_at
  BEFORE UPDATE ON job_loe_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_property_info_updated_at
  BEFORE UPDATE ON job_property_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Purpose: Secure database access (configure based on auth requirements)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE job_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_loe_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_property_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_files ENABLE ROW LEVEL SECURITY;

-- Example policy (adjust based on auth requirements)
-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access to job_submissions"
  ON job_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to job_loe_details"
  ON job_loe_details
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to job_property_info"
  ON job_property_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to job_files"
  ON job_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- VIEWS (Optional)
-- Purpose: Convenient queries for common data access patterns
-- ============================================================================

CREATE OR REPLACE VIEW complete_job_view AS
SELECT
  js.id AS job_id,
  js.job_number,
  js.status,
  js.client_first_name || ' ' || js.client_last_name AS client_name,
  js.client_email,
  js.client_phone,
  js.client_organization,
  js.property_name,
  js.property_address,
  js.property_type,
  jld.appraisal_fee,
  jld.retainer_amount,
  jld.delivery_date,
  jld.loe_status,
  jld.valcre_job_id,
  jld.clickup_task_url,
  jpi.year_built,
  jpi.building_size,
  jpi.parcel_number,
  js.created_at,
  js.updated_at
FROM job_submissions js
LEFT JOIN job_loe_details jld ON js.id = jld.job_id
LEFT JOIN job_property_info jpi ON js.id = jpi.job_id;

-- ============================================================================
-- COMMENTS (Documentation)
-- Purpose: Document table and column purposes for future reference
-- ============================================================================

COMMENT ON TABLE job_submissions IS 'Main job data from client form submission (Section 1)';
COMMENT ON TABLE job_loe_details IS 'LOE and quote details (Section 2)';
COMMENT ON TABLE job_property_info IS 'Property research data (Section 3A + 3B)';
COMMENT ON TABLE job_files IS 'Document uploads (Section 4)';

COMMENT ON COLUMN job_submissions.same_as_client_contact IS 'Checkbox: Property contact same as client contact (auto-fill logic)';
COMMENT ON COLUMN job_loe_details.valcre_job_id IS 'Valcre Job entity ID (returned from POST /api/v1/Jobs)';
COMMENT ON COLUMN job_loe_details.valcre_property_id IS 'NOT IMPLEMENTED - Issue #2: Store Property entity ID for updates';
COMMENT ON COLUMN job_property_info.houski_validated IS 'Future: AI validation result from Houski data cross-reference';
```

---

### Appendix G: For Next Session

**Quick Context Restore:**
1. Read this Systems Guide (start with Executive Summary)
2. Check "Current Implementation Status" for what works
3. Review "Implementation Timeline" for current priorities
4. Check "Known Issues & Blockers" for what's needed

**Current Priority:** High Priority - ClickUp Integration Completion

**Next Testing:** High Priority - Physical testing of Phase 5-7 (email → signature → ClickUp)

---

### Appendix H: ClickUp Integration - Reference Documentation

**Status:** [DEPLOYED] Auto-creation on form submission, awaiting client acceptance testing

**How Task Auto-Creation Works:**

1. **Form Submission Trigger**
   - Client submits form on Valta Website
   - Form data saves to Supabase `job_submissions` table
   - Job creation process begins

2. **Edge Function Execution**
   - Edge Function `create-clickup-task` automatically triggered
   - Fetches job details from database
   - Builds task payload with job information

3. **Task Creation**
   - Task created in ClickUp with template ID `t-86b3exqe8`
   - Template automatically adds 9 subtasks
   - Task name: "PENDING - Property Name, City"
   - Priority: Normal (3)
   - Status: "To Do"

4. **Database Update**
   - `clickup_task_id` saved to `job_loe_details` table
   - `clickup_task_url` saved to `job_loe_details` table
   - Task reference available for all future operations

5. **UI Display**
   - Dashboard shows "View Task" button
   - Button is actually a link (task already exists)
   - Opens ClickUp task in new tab

**Task Update Flow (When Valcre Job Created):**

1. User creates Valcre job (gets VAL number)
2. System triggers `update-clickup-task` Edge Function (PLANNED)
3. Updates task name: "PENDING" → "VAL251019 - Property Name, City"
4. Updates task description with Valcre link
5. Updates task status based on workflow

**Edge Function Locations:**
- Create: `/supabase/functions/create-clickup-task/index.ts`
- Update: `/supabase/functions/update-clickup-task/index.ts` (PLANNED)

**Frontend Component:**
- Location: `/src/components/dashboard/job-details/actions/ClickUpAction.tsx`
- Displays: "View Task" button (link to existing task)

**Template Configuration:**
- Template ID: `t-86b3exqe8`
- Template Name: "LOE New Template 2025.01.09"
- Includes 9 subtasks (auto-added)

**Task Name Progression:**
```
Form Submission:  "PENDING - Westside Mall, Calgary"
                          ↓
Valcre Created:   "VAL251019 - Westside Mall, Calgary"
```

**Important Notes:**
- Tasks are NOT created manually by users
- The "Create Task" button is misleading - task already exists
- Button actually provides "View" functionality
- Auto-creation happens during form submission processing
- Task is ready before user sees the dashboard

**Planned Enhancements:**
- Enhanced formatted description with all job details
- Auto-update when VAL# assigned
- Status updates via webhooks on workflow events

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 23, 2025 | Ben Crowe / Marcel | Initial comprehensive document created from Oct 20 session |
| 1.1 | Oct 23, 2025 | Ben Crowe / Marcel | Added V2 learnings: Supabase patterns, field mapping, known bugs, debugging methodology |
| 2.0 | Nov 1, 2025 | Documentation Engineer | **CONSOLIDATION:** Complete SQL schema, detailed field mapping tables, prioritized known issues, complete Valcre API examples. Single unified Systems documentation. |
| 3.1 | Nov 2, 2025 | Documentation Engineer | **CORRECTIONS:** 13 items - Added Pipedrive/GHL integrations, rewrote ClickUp section (auto-creation), updated flowcharts with ClickUp task creation and status updates, fixed email FROM address (admin@valta.ca), added Houski accuracy warning, changed testing language from "Not Tested" to "Awaiting Client Acceptance Testing", added DocuSeal and Document Management to Appendix A. |

**Status:** [IN PROGRESS] - Corrected and Updated Systems Documentation

**Next Update:** As V3 implementation progresses

---

**END OF SYSTEMS GUIDE - VERSION 3.1**

*This document serves as the single source of truth for APR Dashboard V3 vision, architecture, implementation, and technical specifications.*
