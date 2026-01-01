# APR Dashboard v3 - Platform Independence Strategy

> **Objective:** Eliminate Valcre, ClickUp, and Pipedrive dependencies. Build a complete appraisal business platform on owned infrastructure.

---

## Executive Summary

APR Dashboard v3 is evolving from a "report builder with integrations" to a **complete appraisal business platform**. The goal is platform independence - owning the full stack rather than stitching together SaaS tools that each take 10% of their value while adding complexity.

### Target State

| Function | Current | Target | Status |
|----------|---------|--------|--------|
| Report Generation | Valcre | Report Builder | ~80% complete |
| Project Management | ClickUp | Job Mgt v3 | ~60% complete |
| CRM / Pipeline | Pipedrive | Acquisition Pipeline | ~40% complete |
| E-Signatures | DocuSeal | DocuSeal (keep) | ✅ Complete |
| Database | Supabase | Supabase (keep) | ✅ Complete |
| File Storage | Google Drive | Supabase Storage (optional migrate) | ✅ Working |

### Tech Stack Simplification

**Before:**
```
Supabase + Valcre + ClickUp + Pipedrive + DocuSeal + Google Drive
    ↓         ↓         ↓          ↓          ↓           ↓
  Core    Reports    Tasks      CRM      E-Sign      Files
```

**After:**
```
Supabase + DocuSeal
    ↓          ↓
Everything   E-Sign
```

---

## Three Workstreams

### Workstream A: Report Builder (Kill Valcre)

**Goal:** Complete Valcre replacement with specialized section editors

**Already Done:**
- ✅ Field registry (944 fields mapped)
- ✅ Calculator engine (277 metrics, validated exact match)
- ✅ HTML template system (70+ pages)
- ✅ Live preview with real-time updates
- ✅ Income Approach panel (3-panel: input → calc → preview)
- ✅ Operating History panel
- ✅ Sales Comparison panel
- ✅ Value Reconciliation panel
- ✅ PostMessage bridge (500+ fields flowing)

**Remaining:**
- ⏳ Home Tab (workbook setup, common fields)
- ⏳ Image Manager (grid, reorder, layout picker)
- ⏳ Narrative Editor (rich text, templates)
- ⏳ Approach Toggles (show/hide Income/Sales/Cost)
- ⏳ Data persistence (auto-save to Supabase)
- ⏳ Job integration (pre-populate from job_submissions)

**Architecture:**
```
Report Builder (container shell)
├── Section Router
├── Specialized Editors:
│   ├── HomeTabEditor (forms, config) ← NEW
│   ├── CalculatorEditor (existing 3-panel) ← DONE, PRESERVE
│   ├── ImageManager (grid, shuffle, layout) ← NEW
│   └── NarrativeEditor (rich text) ← NEW
└── Shared Preview Panel (right side)
```

**Critical Constraint:** Calculator panels are DONE. They must be integrated into the container, NOT rebuilt.

---

### Workstream B: Job Management (Kill ClickUp)

**Goal:** Replace ClickUp with built-in job/task management

**Already Done:**
- ✅ Job list view with search/filter
- ✅ Job detail view with accordion sections
- ✅ Document upload and organization
- ✅ Status tracking (basic)
- ✅ Valcre job creation (will become optional)

**Remaining:**
- ⏳ Task checklist per job
- ⏳ Pipeline view (kanban or enhanced list)
- ⏳ Activity log / notes per job
- ⏳ Due date reminders
- ⏳ Status-based automations

**Job Completion Pipeline Stages:**
```
Active → Data Gathering → Analysis → Draft → Review → Final → Delivered → Paid/Closed
```

**Database Changes:**
```sql
-- Expand status enum
ALTER TYPE job_status ADD VALUE 'data_gathering';
ALTER TYPE job_status ADD VALUE 'analysis';
ALTER TYPE job_status ADD VALUE 'draft';
ALTER TYPE job_status ADD VALUE 'review';
ALTER TYPE job_status ADD VALUE 'final';
ALTER TYPE job_status ADD VALUE 'delivered';
ALTER TYPE job_status ADD VALUE 'paid';

-- Add tasks table
CREATE TABLE job_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_submissions(id),
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  due_date DATE,
  sort_order INT,
  created_at TIMESTAMP DEFAULT now()
);

-- Add activity log
CREATE TABLE job_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_submissions(id),
  activity_type VARCHAR(50), -- 'note', 'status_change', 'email_sent', 'file_uploaded'
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  created_by UUID
);
```

---

### Workstream C: Acquisition Pipeline (Kill Pipedrive)

**Goal:** Replace Pipedrive with built-in lead/acquisition tracking

**Already Done:**
- ✅ Client intake form (public)
- ✅ Job submission to Supabase
- ✅ LOE generation
- ✅ DocuSeal e-signature flow
- ✅ Status updates on signing

**Remaining:**
- ⏳ Lead/inquiry stage (pre-submission)
- ⏳ Pipeline view for acquisition
- ⏳ Automated email triggers
- ⏳ Client history view
- ⏳ Basic contact management

**Acquisition Pipeline Stages:**
```
Inquiry → Quote Sent → LOE Sent → LOE Signed → Active Job
```

**Email Automation Triggers:**
| Trigger | Email | Template |
|---------|-------|----------|
| New inquiry received | "Thanks, we'll review" | inquiry_received |
| Quote/LOE sent | "Please review attached" | loe_sent |
| LOE signed | "Welcome, next steps" | loe_signed |
| Report delivered | "Your report is ready" | report_delivered |
| Payment received | "Thank you" | payment_received |

**Database Changes:**
```sql
-- Lead tracking (optional, could use job_submissions with status='inquiry')
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50), -- 'website', 'referral', 'phone', 'email'
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  property_address TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'quoted', 'converted', 'lost'
  converted_job_id UUID REFERENCES job_submissions(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Email automation rules
CREATE TABLE email_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_event VARCHAR(50), -- 'status_change', 'form_submit', 'signature_complete'
  trigger_condition JSONB, -- { "status": "loe_signed" }
  email_template VARCHAR(50),
  delay_minutes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- Email log
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_submissions(id),
  template VARCHAR(50),
  recipient_email VARCHAR(255),
  subject VARCHAR(255),
  status VARCHAR(20), -- 'sent', 'delivered', 'opened', 'failed'
  sent_at TIMESTAMP DEFAULT now(),
  metadata JSONB
);
```

**Email Implementation:**
- Supabase Edge Functions for triggers
- Resend API for delivery (already integrated)
- Simple template system (HTML with variable substitution)

---

## Implementation Priority

### Phase 1: Report Builder Completion (Kill Valcre)
**Priority: HIGH - This is the revenue-generating tool**

1. **Home Tab** - Common fields, job setup
2. **Approach Toggles** - Conditional visibility pattern
3. **Integration Bridge** - Pre-populate from job data
4. **Persistence** - Auto-save to Supabase
5. **Image Manager** - Custom photo management UX
6. **Narrative Editor** - Rich text for descriptions

### Phase 2: Job Pipeline Enhancement (Kill ClickUp)
**Priority: MEDIUM - Improves workflow efficiency**

1. **Status expansion** - Full pipeline stages
2. **Task checklist** - Simple per-job tasks
3. **Pipeline view** - Visual status board
4. **Activity log** - Track all job activity
5. **Reminders** - Due date notifications

### Phase 3: Acquisition & CRM (Kill Pipedrive)
**Priority: LOWER - Can use existing status flow initially**

1. **Email automations** - Trigger-based sending
2. **Pipeline view** - Acquisition stages
3. **Client history** - Past jobs per client
4. **Lead tracking** - Pre-submission inquiries

---

## Architecture Decisions

### Report Builder: Container + Specialized Editors

NOT a generic field renderer. Each section type gets purpose-built UX:

| Section Type | Editor Component | UX Pattern |
|--------------|------------------|------------|
| Home/Setup | HomeTabEditor | Form cards, grouped fields |
| Financial | CalculatorEditor | 3-panel (input → calc → preview) |
| Images | ImageManager | Grid, drag-reorder, layout picker |
| Narratives | NarrativeEditor | Rich text, templates |
| Tables | (existing) | Inline editing in preview |

### Job Management: Status-Driven Pipeline

Single `status` field drives entire workflow:
- Pipeline view groups by status
- Automations trigger on status change
- Tasks can be templated per status

### Data Model: Supabase as Single Source

Everything in Supabase:
- Jobs, tasks, activity, files
- Report builder state (JSONB)
- Email logs, automation rules
- Client/lead data

---

## Files Reference

### Report Builder (Workstream A)
```
src/features/report-builder/
├── components/
│   ├── ReportBuilderLayout.tsx (container)
│   ├── SectionSidebar.tsx (navigation)
│   ├── EditPanel/ (generic field rendering)
│   ├── PreviewPanel/ (iframe preview)
│   └── editors/ (NEW - specialized editors)
│       ├── HomeTabEditor.tsx
│       ├── ImageManager.tsx
│       └── NarrativeEditor.tsx
├── schema/fieldRegistry.ts (944 fields)
├── store/reportBuilderStore.ts (state)
└── hooks/
    ├── useLoadJobIntoReport.ts (NEW)
    └── useSaveReportBuilderData.ts (NEW)

src/features/calculator-demo-v4/ (PRESERVE - already working)
├── components/
│   ├── InputPanel.tsx
│   ├── IncomeApproachPanel.tsx
│   ├── OperatingHistoryPanel.tsx
│   ├── SalesComparisonPanel.tsx
│   └── ReconciliationPanel.tsx
└── CalculatorWithPreview.tsx
```

### Job Management (Workstream B)
```
src/components/dashboard/
├── JobListView.tsx
├── JobDetailView.tsx
├── job-list/
│   ├── JobList.tsx
│   ├── PipelineView.tsx (NEW)
│   └── StatusFilter.tsx
└── job-details/
    ├── TaskChecklist.tsx (NEW)
    ├── ActivityLog.tsx (NEW)
    └── ... (existing sections)
```

### Acquisition/CRM (Workstream C)
```
src/features/crm/ (NEW)
├── components/
│   ├── AcquisitionPipeline.tsx
│   ├── ClientHistory.tsx
│   └── LeadCard.tsx
├── hooks/
│   └── useEmailAutomation.ts
└── templates/
    └── emailTemplates.ts

supabase/functions/
├── email-trigger/
└── automation-runner/
```

---

## Success Metrics

### Valcre Eliminated When:
- [ ] All report types buildable without Valcre
- [ ] No Valcre API calls required for new jobs
- [ ] Existing Valcre integration becomes optional/deprecated

### ClickUp Eliminated When:
- [ ] Task tracking fully in-app
- [ ] Pipeline view replaces ClickUp board
- [ ] No ClickUp API calls on job creation
- [ ] Activity/notes captured internally

### Pipedrive Eliminated When:
- [ ] Lead tracking in-app
- [ ] Automated emails on status changes
- [ ] Client history viewable
- [ ] No external CRM needed

---

## Next Steps

1. **Approve this strategy** - Confirm direction
2. **Update existing plan** - Incorporate calculator preservation, specialized editors
3. **Start Phase 1** - Home Tab as first deliverable
4. **Parallel track** - Database schema updates for job pipeline

---

## Appendix: What We Keep

| Tool | Keep? | Reason |
|------|-------|--------|
| Supabase | ✅ Yes | Core database, auth, storage, functions |
| DocuSeal | ✅ Yes | E-signatures are complex, works well |
| Resend | ✅ Yes | Email delivery API |
| Google Drive | ⚠️ Optional | Could migrate to Supabase Storage |

These integrations add value without creating dependency on external workflow tools.
