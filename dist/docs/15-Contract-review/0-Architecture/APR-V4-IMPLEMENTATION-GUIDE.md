# APR-V4 Implementation Guide

**Created:** November 29, 2025
**Updated:** December 1, 2025
**Status:** Analysis Complete - Ready for Implementation
**Purpose:** Quick-start action guide for APR system development

---

## Executive Summary

**Two Systems, Sequential Workflow:**

| System | Purpose | Status |
|--------|---------|--------|
| **APR-V3** | Intake & data gathering (5 sections) | Sections 1-2 working, 3-5 need field gaps filled |
| **APR-V4** | Report builder (19 sections, 330+ fields) | New project, consumes VAL# from Valcre |

**Core Problem Solved:** Chris's current workflow (Valcre -> Excel -> Word -> PDF -> Gmail) fails at delivery due to 23MB attachment limits.

**System Relationship:**
```
Client Form → APR-V3 → Valcre (VAL# created) → APR-V4 (pulls VAL# data) → Report
```

---

## Analysis Complete

All pre-implementation analysis has been completed:

| Analysis | Status | Document |
|----------|--------|----------|
| Excel Reverse Engineering | Complete | `EXCEL-ANALYSIS.md` |
| Valcre API Evaluation | Complete | `VALCRE-API-EVALUATION.md` |
| Component Reuse Audit | Complete | `COMPONENT-REUSE-AUDIT.md` |
| Architecture Design | Complete | `APR-V4-ARCHITECTURE.md` |
| Field Mapping | Complete | `2-FIELD-MAPPING.md` |
| V3 Field Gaps | Complete | `5-V3-FIELD-RECONCILIATION.md` |

---

## Development Workflow (Branch Safety)

**Critical:** APR-V3 Sections 1 & 2 are in production. All new development uses feature branches.

### Git Branch Workflow

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/section-3-property-details

# 2. Work locally - view at localhost:5173 (Vite)
npm run dev

# 3. When happy, merge to main
git checkout main
git merge feature/section-3-property-details
git push origin main

# 4. Vercel auto-deploys from GitHub main branch
```

### Safety Guarantees

| What | Safety |
|------|--------|
| Sections 1 & 2 | Not touched on feature branch |
| Live production | Only updates when main branch changes |
| Local testing | Full preview at localhost before merge |
| Rollback | Git revert if issues post-deploy |

---

## APR-V3 Field Gaps (Sections 3-5)

Before APR-V4 development, V3 needs these field gaps filled for Sections 3-5.

### Section 3: Property Details (~30 new fields)

**Valcre provides (read-only):** PID, Legal Description, Municipality, Coordinates

**V3 must capture:**
- Site area (acres/SF)
- Shape, topography, frontage
- Zoning designation & permitted uses
- Services (water, sewer, gas, power)
- Flood plain status
- Environmental concerns
- Access/egress details

### Section 4: Building Details (~25 new fields)

**Valcre provides:** Year Built, GBA, NRA, # Units

**V3 must capture:**
- Construction type (wood frame, concrete, etc.)
- Foundation type
- Roof type & condition
- HVAC systems
- Sprinkler/fire safety
- Elevator details
- Parking configuration
- Building condition assessment
- Recent renovations

### Section 5: Photo Gallery (new component)

**Requirement:** Multi-image upload with drag-drop ordering

**Fields:**
- Subject exterior photos (4-6)
- Subject interior photos (6-10)
- Street scene photos (2-4)
- Comparable property photos (3-5 per comp)

**See:** `5-V3-FIELD-RECONCILIATION.md` for complete field list

---

## Implementation Sequence

### 1. Valcre READ Operations (HIGH VALUE)

**Why First:** Eliminates ~80% of manual data entry for 80+ fields

**Add GET requests to existing `/api/valcre.ts`:**
```
GET /Jobs?$filter=Number eq 'VAL251012'
GET /Jobs({id})?$expand=Property,Client,PropertyContact
GET /Properties({id})?$expand=Parcels,Parcels/Assessments
```

**Blocker:** None - existing auth works, just add endpoints

---

### 2. Project Scaffolding

**Stack:**
- Next.js 15 (App Router)
- React 19
- Zustand (NOT Context - per user requirement)
- TypeScript strict mode
- Supabase via API routes (not direct client calls)

**Why Zustand:** Context causes re-render cascades with 330+ fields

---

### 3. Valcre Data Preview Component

**Purpose:** Show "what Valcre knows" before user starts filling

**Fields pullable (80+):**
- Job metadata (file number, effective date, purpose)
- Property (address, legal description, coordinates)
- Client (name, email, company)
- Property Contact (name, role)
- Parcel data (PID, legal, lot/block/plan)
- Assessment data (land value, improvement value)

---

### 4. First Sections to Build

Build these 5 sections first (straightforward, validates architecture):

1. **Cover Page** (17 fields) - Mix of Valcre + manual
2. **Transmittal Letter** (18 fields) - Template + Valcre
3. **Executive Summary** (11 fields) - Includes final value display
4. **Property Identification** (19 fields) - Heavy Valcre pull
5. **Certification** (7 fields) - Mostly template defaults

---

### 5. Calculator + Excel Comparison

**Dual Mode Architecture:**

```
Toggle: [Internal Calculator] <-> [Excel Import]

Internal:
- Build Income/Sales/Cost approaches
- Use existing Calculator module (all 3 approaches exist)

Excel Import:
- ExcelJS + named ranges
- Extract 5-6 final values only (not 40 intermediates)
- Show match percentage

Comparison Display:
| Metric        | Internal | Excel  | Match |
|---------------|----------|--------|-------|
| NOI           | $X       | $Y     | 99%   |
| Cap Rate      | X%       | Y%     | 100%  |
| Income Value  | $X       | $Y     | 98%   |
| Final Value   | $X       | $Y     | 99%   |
```

**Trust Building:** Chris uses Excel values initially, sees internal matches, gradually trusts internal.

---

### 6. Remaining Sections

After calculator works:
- Income Approach (40+ fields)
- Sales Comparison (50+ fields)
- Site Details (15 fields)
- Improvements (42 fields)
- Market Context (7 fields)
- Highest & Best Use (7 fields)
- Reconciliation (10 fields)
- Photos (50+ fields) - DEFERRED pending investigation

---

### 7. Preview + Export

**Preview:**
- Live HTML preview while filling
- Same component renders to PDF
- Responsive for mobile viewing

**Export:**
- PDF generation via async background job (NOT synchronous Vercel Edge)
- HTML shareable link with expiry
- Client portal viewing

---

### 8. Photos (DEFERRED)

**Status:** Need to investigate Valcre photo API

**Questions:**
- Does Valcre expose photo endpoints?
- Are photos at `static-photos.valcre.com` accessible?
- Need CDN integration or manual upload?

---

## Technical Constraints

### From Analysis:

1. **State Management:** Zustand, not Context (330+ fields = re-render hell)
2. **Routing:** Next.js App Router (not react-router-dom)
3. **Auth:** Middleware-based (not client localStorage)
4. **Database:** Hybrid JSONB + columns
   - JSONB for narratives
   - Proper columns for queryable fields (final_value, noi, cap_rate, etc.)
5. **PDF:** Async background job (Vercel Edge has 10s timeout)
6. **Excel:** ExcelJS + named ranges (no VBA execution needed)

### From Architecture Review (53 issues found):

**Critical fixes needed:**
- Calculator comparison spec incomplete
- Valcre API deferred too late in original plan
- Timeline estimates 40% optimistic (ignored per user request)
- Component reuse claims don't add up (15-20% realistic, not 40%)

---

## Key Named Ranges (Excel Import)

From `EXCEL-ANALYSIS.md`:

```typescript
const FINAL_VALUES = {
  pgi: 'IA_DirCap_PGI',           // DIRECTCAP!L218
  noi: 'IA_DirCap_NOI',           // DIRECTCAP!L253
  capRate: 'IA_DirCap_CapRate1',  // DIRECTCAP!L254
  incomeValue: 'IA_DirCap_Value', // DIRECTCAP!L256
  finalValue: 'Value_FinalScenario1', // VALUES!F78
  salesValue: 'Value_SARecScenario1'  // Sales approach
};
```

**7,988 named ranges available** - Only compare ~6 for trust building.

---

## Component Reuse Reality

From `COMPONENT-REUSE-AUDIT.md`:

| Category | Count | Portability |
|----------|-------|-------------|
| Immediately Portable | 42 (25%) | shadcn/ui primitives |
| Light Refactoring | 59 (35%) | API/state updates |
| Significant Refactoring | 67 (40%) | Auth, routing, state |

**Realistic time savings:** 15-20% (not 40%)

**Portable:**
- shadcn/ui components (Button, Input, Select, etc.)
- Utility functions
- Type definitions

**NOT Portable (need rebuild):**
- Auth (client localStorage -> middleware)
- Routing (react-router-dom -> App Router)
- State (Context -> Zustand)

---

## Database Schema Direction

**Hybrid approach:**

```sql
-- Queryable columns for reporting/filtering
final_value DECIMAL(12,2),
noi DECIMAL(12,2),
cap_rate DECIMAL(5,4),
property_type VARCHAR(100),
effective_date DATE,

-- JSONB for narrative sections
cover_page JSONB,      -- 17 fields
transmittal JSONB,     -- 18 fields
exec_summary JSONB,    -- 11 fields
narratives JSONB       -- Variable length content
```

---

## Valcre API Status

From `VALCRE-API-EVALUATION.md`:

**Working (Production):**
- OAuth 2.0 Password Grant auth
- CREATE Job
- UPDATE Job

**Gap (Need to Add):**
- READ Job (GET with $filter, $expand)
- READ Property
- READ Contacts
- Photos (unknown)

**80+ fields pullable** once READ operations added.

---

## Source of Truth

| Document | Purpose |
|----------|---------|
| `2-FIELD-MAPPING.md` | All 330+ fields with IDs and types |
| `EXCEL-ANALYSIS.md` | How to extract from Excel |
| `VALCRE-API-EVALUATION.md` | What's pullable from Valcre |
| `COMPONENT-REUSE-AUDIT.md` | What's portable from V2 |
| `QUICK-REFERENCE-PARSING.md` | Code snippets for Excel import |

---

## Not Included (By Design)

Per user guidance, this document does NOT include:
- Week-by-week timelines
- Hour estimates
- Gantt charts
- Calendar-based scheduling

Focus is on **sequence and dependencies only**.

---

## First Implementation Task

When ready to begin:

```typescript
// Add to existing /api/valcre.ts
// GET Job by file number
export async function getJobByNumber(fileNumber: string) {
  const response = await valcreClient.get(
    `/Jobs?$filter=Number eq '${fileNumber}'`
  );
  return response.data.value[0];
}

// GET Job with expanded relations
export async function getJobWithDetails(jobId: string) {
  const response = await valcreClient.get(
    `/Jobs(${jobId})?$expand=Property,Client,PropertyContact`
  );
  return response.data;
}
```

This unblocks 80+ fields of automatic data population.

---

## Source Documents

| Document | Purpose |
|----------|---------|
| `2-FIELD-MAPPING.md` | All 330+ fields with IDs and types |
| `4-APR-Field-Flow-Map.xlsx` | Visual data flow map |
| `5-V3-FIELD-RECONCILIATION.md` | What V3 Sections 3-5 need to capture |
| `APR-V4-ARCHITECTURE.md` | Full technical architecture |
| `EXCEL-ANALYSIS.md` | Excel named ranges and extraction |
| `VALCRE-API-EVALUATION.md` | What's pullable from Valcre |
| `COMPONENT-REUSE-AUDIT.md` | What's portable from V2 |

---

**Document Status:** Ready for implementation
**Next Actions:**
1. Add Valcre READ operations to existing API (unblocks 80+ fields)
2. Create feature branch for V3 Section 3 field gaps
3. Begin APR-V4 project scaffolding
