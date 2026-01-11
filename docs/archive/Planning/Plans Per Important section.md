# Deployment Stages (New Structure)

## Overview

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

### ClickUp Task Management
- Task auto-created on form submission
- Template with 9 subtasks
- Task ID stored in database
- **Status:** Deployed, awaiting acceptance testing
- **Section:** `3-section-ClickUp-Integration/`

**Dependencies:** None - this is the foundation

---

## STAGE 2: Automation & Workflow Enhancement

**Purpose:** Automated workflows that build on the foundation

**Depends on:** Stage 1 components must be stable

**Components in this stage:**

### N8N Workflow Automations
- Payment follow-up emails (LOE signed → Stripe link)
- Payment tracking (Stripe webhook → status updates)
- Google Drive folder creation (VAL# assigned)
- Missing documents AI review
- **Status:** Planned, workflows designed
- **Section:** Planned

### Payment Processing (Stripe + N8N)
- Stripe Checkout embedded in Next.js
- N8N sends payment emails
- N8N handles payment webhooks
- Updates job status on payment
- **Status:** Planned
- **Section:** Planned

### Document Hub Expansion
- Smart document categorization
- Auto-gathering from municipal websites
- PDF data extraction
- Visual progress tracking
- **Status:** Planned
- **Section:** `4-section-DOC-MANAGEMENT/`

**Dependencies:** 
- Requires stable foundation (Stage 1)
- Requires N8N Cloud setup
- Requires payment processor account

---

## STAGE 3: Professional Tools & Enhancements

**Purpose:** Professional calculation and data entry tools

**Depends on:** Stage 1 foundation, benefits from Stage 2 automation

**Components in this stage:**

### Property Valuation Calculator
- Income Approach (NOI ÷ Cap Rate)
- Sales Comparison (Comparable properties)
- Cost Approach (Replacement cost)
- Comprehensive (Weighted combination)
- Live recalculation, confidence scoring
- **Status:** Ready to integrate (built, needs migration)
- **Section:** `5-section-Calculator/` (placeholder - components external)
- **External Location:** `/Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/08-Calculator/`

### Google Places Address Autocomplete
- Real-time address suggestions
- Validated addresses from Google
- Auto-fills city, province, postal code
- Works on client form and dashboard
- **Status:** Ready to implement (setup guide complete)
- **Section:** Planned
- **External Location:** `/Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/10-Google Places-enhansed field ux/`

### Houski Data Auto-Population
- Calls Houski API for property data (14 fields)
- Cross-references with Google Maps
- AI validates data consistency
- Auto-populates if validated
- **Status:** Planned
- **Section:** Built-in to main codebase (planned)

**Dependencies:**
- Requires stable foundation (Stage 1)
- Calculator needs job data structure from Stage 1
- Houski needs property address from Stage 1
- Google Places benefits from form validation

---

## STAGE 4: Report Generation & Analytics

**Purpose:** Complete report generation and business intelligence

**Depends on:** All previous stages - uses data from foundation, automation, and calculations

**Components in this stage:**

### Professional Appraisal Report Generator
- 233 TypeScript files
- 265+ input fields
- Three valuation approaches built-in
- Professional PDF output (50+ pages)
- USPAP-compliant
- **Status:** Production-ready (built, needs deployment decision)
- **Section:** `6-section-Report Generator/` (placeholder - app external)
- **External Location:** `/Users/bencrowe/Development/APR-Dashboard-v2-Res/01-APR-Resources/14-Contract-Generator/Report-Generator/`

### Analytics & Reporting Dashboard
- Job volume trends
- Revenue tracking
- Time-to-completion metrics
- Bottleneck identification
- **Status:** Future - not yet designed
- **Section:** Planned

**Dependencies:**
- Requires all job data from Stage 1
- Benefits from calculations in Stage 3
- Can pull from automation data in Stage 2
- Needs stable workflow before generating reports

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
2. **Google Places Autocomplete** → New section folder
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

**This replaces the old "Phase Roadmap" section in the Systems Guide**
