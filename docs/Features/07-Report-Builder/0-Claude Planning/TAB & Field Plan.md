# TAB & Field Management Strategy

**Created:** 2025-12-25
**Status:** Planning Document - Core Principles

---

## 🏗️ System Architecture: TDD Dashboard vs Report Builder

**SCOPE:** Per Job/Appraisal (not global for everything)

### The Separation of Concerns

**TDD Dashboard = Central Data Capture & Consolidation Hub (Per Job)**
- Receives data from MULTIPLE sources FOR THIS JOB:
  - V3 Dashboard (previous system)
  - S1 - Client intake information (this job)
  - S2 - Appraiser/job setup information (this job)
  - S3 - Image management (this job's images)
  - Manual user input (this job's data)
  - External APIs (this job's data)
  - Other data sources (relevant to this job)
- **Purpose:** Capture ALL appraisal data for this job in one place
- **Function:** Consolidate, organize, validate this job's data
- **Result:** Single source of truth for this job's field values
- **User Role:** Data entry, consolidation, quality control (per job)
- **Scope:** Each job has its own TDD Dashboard instance

**Report Builder = Output Generation Tool (Multiple Report Types)**
- Reads data FROM TDD Dashboard
- Generates different report outputs FROM the same data
- Current Output Types:
  - Appraisal Report (main)
  - Future: Financial Reports
  - Future: XYZ Finance Reports
  - Future: Other report variants
- **Purpose:** Present the consolidated data in different formats
- **Function:** Format, layout, render reports
- **Result:** Multiple report variants from single data source
- **User Role:** Report generation, customization, export

### Data Flow Architecture

```
┌─────────────────────────────────────────┐
│      MULTIPLE DATA SOURCES               │
│  V3 Dashboard, APIs, Manual Input, etc.  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   TDD DASHBOARD (Data Capture Hub)       │
│  S1 - Client Intake                      │
│  S2 - LOE Prep                           │
│  S3 - Image Management                   │
│  + Numbered tabs for data entry/review   │
│  = All data consolidated & validated     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   CENTRAL DATA STORE                     │
│   (Single Source of Truth)               │
│   All field values, images, metadata     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   REPORT BUILDER (Output Generation)     │
│   Editor Panel with split view:          │
│   - Left: Edit fields in context         │
│   - Right: Preview formatted output      │
└──────────────────┬──────────────────────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Appraisal│ │Financial │ │   XYZ    │
    │ Report   │ │ Reports  │ │ Reports  │
    └──────────┘ └──────────┘ └──────────┘
```

### Why This Separation Matters

| Aspect | TDD Dashboard | Report Builder |
|--------|---------------|----------------|
| **Focus** | Data capture & consolidation | Output generation |
| **Data Source** | Multiple sources (V3, APIs, manual) | One source (TDD) |
| **Output** | Organized data store | Formatted reports |
| **Scalability** | Add new report types without changing data capture | Easy to create new report variants |
| **Consistency** | All reports use same validated data | No data duplication |
| **User Experience** | Data entry once | Many output options |

---

## 🎯 Core Principle: Single Source of Truth (Per Job)

For each appraisal/job, fields are managed in ONE place (the TDD Dashboard). All other references link back to that source. This is scoped per job - each job has its own data consolidation and single source of truth.

---

## 📍 Field Management Hierarchy

### S1, S2, S3 Tabs (Consolidated Input Areas)

**PURPOSE:** Centralized management areas where data is entered ONCE

**S1 - CLIENT INTAKE (V3)**
- Client name, company, contact info
- Property basics, loan info
- All fields FULLY EDITABLE
- No "Managed Elsewhere" links

**S2 - LOE PREP (V3)**
- Appraiser name, credentials, AIC
- Job details: job number, valuation date, report date
- Financial terms, report scope
- All fields FULLY EDITABLE
- No "Managed Elsewhere" links

**S3 - IMAGE MANAGEMENT**
- Subject photos, comparables, maps, site plans
- Organized by destination subsections (01, 03, 07, 08, 09, 10, 11)
- All image uploads FULLY EDITABLE
- No "Managed Elsewhere" links
- Exception only in odd circumstances

---

### Numbered Report Tabs (01-22)

**PURPOSE:** Display report sections with references back to consolidated sources

**Tab 01 - COVER PAGE - CORRECT UI PATTERN**

```
Client Name: John Smith [🔗 Edit in S1]
             ^^^^^^^^^^^  ^^^^^^^^^^^^^^
             Filled value Read-only + Link to source

Appraiser: Jane Appraiser, AACI [🔗 Edit in S2]
           ^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^
           Filled value (read-only)   Link to source

Cover Photo: [Thumbnail] [🔗 Manage in S3]
             ^^^^^^^^^^  ^^^^^^^^^^^^^^^^^
             Shows image Read-only + Link to source
```

**WRONG Pattern (Do Not Do This):**
```
Client Name: [🔗 Managed in S1]
             ^^^^^^^^^^^^^^^^^^^
             ❌ No visible value, just link (confusing - looks like field is empty)
```

**Tab 22 - CERTIFICATION**
- Shows `appraiser-name` → Value displayed (read-only) + "🔗 Edit in S2" link
- Shows `appraiser-signature` → Value/image displayed (read-only) + "🔗 Edit in S2" link
- User sees the actual data AND knows where to edit it

**All Other Numbered Tabs**
- Any field consolidated to S1/S2/S3 appears with FILLED VALUE (read-only)
- Link beside it indicating source location
- User can SEE the value in context AND click to edit at source
- Better UX: Value visible + easy navigation to source

---

## 🔑 Field ID Convention (NON-NEGOTIABLE)

### Registry IDs Are Permanent

| Scenario | Field ID | Action |
|----------|----------|--------|
| Field in registry | `client-name` | **NEVER changes** |
| Field moved to S1 | `client-name` | ID stays same |
| Field appears in Tab 01 | `client-name` | ID stays same |
| Field in multiple tabs | `client-name` | ID stays same everywhere |

### What Changed vs What Didn't

| Aspect | Before Consolidation | After Consolidation | ID Changes? |
|--------|----------------------|---------------------|-------------|
| Location | Scattered across tabs 01, 02, 05, etc. | Centralized in S1 | ❌ NO |
| Editability | Editable in each tab | Editable only in S1 | ❌ NO (ID) |
| References | Duplicated entry | Single source + links | ❌ NO (ID) |
| Field ID | `client-name` | `client-name` | ❌ NO |

### WRONG Approach (Do Not Do This)

```
❌ Field moved to S1
❌ ID changed to "s1-client-name" or "valcre-client-name"
❌ Now doesn't match registry
❌ Breaks editor panel mapping
```

### RIGHT Approach (Do This)

```
✅ Field moved to S1
✅ ID stays "client-name" (registry name)
✅ Other tabs reference it with same ID
✅ Editor panel finds it correctly
```

---

## 🔄 Data Flow & Mapping

### User Interaction Flow

```
S1/S2/S3 Area:
  ├── User edits "client-name"
  │   (fully editable field)
  │
  └── Value updates in store

Numbered Tabs:
  ├── Tab 01 displays "client-name" (read-only)
  ├── Shows link "🔗 Managed in S1"
  ├── User clicks link
  └── Navigates to S1 to edit
```

### Editor Panel Mapping (Split View)

```
LEFT SIDE (Editor Panel):
├── Shows all fields for Tab 01
├── Fields from S1: "client-name" (read-only, has link)
├── Fields from S2: "appraiser-name" (read-only, has link)
├── Fields from S3: "cover-photo" (read-only, has link)
└── Regular Tab 01 fields: (editable directly)

RIGHT SIDE (Preview):
└── Renders Tab 01 with all field values populated
```

**CRITICAL:** Editor panel can only map fields if:
1. Field ID in registry matches ID in TDD
2. Field ID in TDD matches ID in numbered tab reference
3. No ID substitution with V3/Valcre tag names

---

## 🚨 Known Issues (To Fix)

**Issue 1: Field IDs Overridden**
- S1/S2 fields have been given V3/Valcre tag IDs instead of registry IDs
- Example: `valcre-client-name` instead of `client-name`
- This breaks editor panel mapping

**Issue 2: UI Pattern for Managed Fields**
- Currently showing ONLY link: `[🔗 Managed in S1]` (no visible value)
- Should show VALUE + LINK: `John Smith [🔗 Edit in S1]`
- User needs to see the actual data, not just a link
- Looks like field is empty when it's actually just hidden

**Why This Breaks Things:**
1. Registry expects `client-name`
2. TDD has `valcre-client-name`
3. Editor panel looks for `client-name` → not found
4. Fields don't appear in split panel editor
5. No mapping between TDD and Editor

**Solution Path:**
1. Audit S1/S2 fields for incorrect IDs
2. Restore registry-compliant IDs
3. Verify editor panel mapping works

---

## ✅ Checklist: Field Consolidation Done Right

When consolidating a field to S1/S2/S3:

- [ ] Field ID remains exactly as defined in registry
- [ ] Field moved to source tab (S1/S2/S3)
- [ ] Field marked as fully editable in source tab
- [ ] No "Managed Elsewhere" link in source tab
- [ ] Other tabs show field VALUE (read-only, not editable)
- [ ] Field value is VISIBLE - user can see it
- [ ] Link beside value indicates source: "🔗 Edit in S1/S2/S3"
- [ ] Link directs to correct source tab
- [ ] UI pattern: `Value [🔗 Link]` NOT just `[🔗 Link]`
- [ ] Editor panel can access field with correct ID
- [ ] No V3/Valcre tag names used in registry

---

## 📋 Editor Panel Tab Structure & Report Flow

**FINAL DESIRED STATE - Complete Tab Structure:**

```
CONSOLIDATED INPUT AREAS (S-TABS)
│
├── S1 - CLIENT INTAKE (V3)
├── S2 - LOE PREP (V3)
└── S3 - IMAGE MANAGEMENT
    ├── S3-01 - COVER & SIGNATURE
    ├── S3-03 - LOCATION MAPS
    ├── S3-07 - PROPERTY PHOTOGRAPHS
    ├── S3-08 - SUBJECT PROPERTY PHOTOS
    ├── S3-09 - SALES COMP PHOTOS
    ├── S3-10 - SALES COMP MAPS
    └── S3-11 - RENTAL COMP PHOTOS

NUMBERED REPORT TABS (Report Sections)
│
├── 01 - COVER PAGE
├── 02 - INTRODUCTION LETTER
├── 03 - LOCATION MAPS ⚠️ MISSING (consolidated into S3)
├── 04 - IDENTIFICATION OF ASSIGNMENT ⚠️ MISSING
├── 05 - REPORT INFORMATION
├── 06 - EXECUTIVE SUMMARY
├── 07 - PROPERTY PHOTOGRAPHS ⚠️ MISSING (consolidated into S3)
├── 08 - SITE DETAILS
├── 09 - LOCATION ANALYSIS
├── 10 - PROPERTY TAXES
├── 11 - MARKET ANALYSIS
├── 12 - IMPROVEMENTS
├── 13 - ZONING
├── 14 - HIGHEST & BEST USE
├── 15 - A-INCOME APPROACH (includes Rent Comps + Rent Roll data)
├── 17 - B-COST APPROACH (includes Land Value data)
├── 18 - C-SALES COMPS APPROACH
├── 21 - RECONCILIATION
└── 22 - CERTIFICATION
```

**Key Changes from Original Structure:**
- Consolidations corrected: Tab 16 (Land Value) → merged into Tab 17
- Consolidations corrected: Tabs 19-20 (Rent Comps/Roll) → merged into Tab 15
- Three approaches now clearly labeled: A (Income), B (Cost), C (Sales Comps)
- Numbered sequence: 01-18 then jumps to 21-22 (03, 04, 07 missing; 16, 19, 20 consolidated)
- All missing tabs noted with ⚠️ to indicate where they've been consolidated

**Why This Structure Works:**
- **Logical flow:** Report proceeds through analysis → three approaches → reconciliation → certification
- **Three Approaches separate:** Each has own tab with related data consolidated within it
- **Data consolidation:** Supporting data (rents, land value, comparables) grouped with relevant approach
- **Missing tabs shown:** Even though consolidated elsewhere, gaps are noted so users understand structure
- **User experience:** User viewing page 15 in previewer sees Tab 15 in editor (Income Approach with rent data visible)
- **Alignment maintained:** Editor tabs match previewer page sequence and flow

**Core Principles Applied:**
- Tabs represent sequential flow of appraisal report
- Editor tabs must match previewer pages for logical alignment
- Show all tabs (even if fields managed elsewhere) for structural continuity
- Fields appear in context with values visible + "Managed Elsewhere" links where applicable
- Same field IDs and naming apply in both TDD and Report Builder

---

## 📋 Implementation Order

**Phase 1: Plan (Current)**
- ✅ Define correct field ID strategy
- ✅ Document "Managed Elsewhere" pattern
- ✅ Establish S1/S2/S3 field scoping rules
- ✅ Document Editor Panel tab structure requirement

**Phase 2: Audit (Next)**
- [ ] Identify which fields are in S1/S2
- [ ] Check for incorrect IDs (V3/Valcre tags)
- [ ] List all consolidation issues
- [ ] Review current Editor Panel tab names/structure

**Phase 3: Fix**
- [ ] Add S1, S2, S3 tabs to Editor Panel
- [ ] Update all tab names to match TDD (with numbers)
- [ ] Restore correct registry IDs
- [ ] Verify editor panel mapping
- [ ] Test split panel functionality

**Phase 4: Validate**
- [ ] All S1/S2/S3 fields fully editable
- [ ] No "Managed Elsewhere" links within S1/S2/S3
- [ ] Numbered tabs show correct read-only references with links
- [ ] Editor panel tabs mirror TDD exactly
- [ ] Editor panel maps all fields correctly

---

## 🔗 Related Documents

- `TDD-DASHBOARD-TAB-ARCHITECTURE.md` - Tab structure overview
- `TDD-VS-EDITOR-PANEL-FIELD-MAP.md` - Current field mapping
- `APR-DASHBOARD-FILE-SYNC-OVERVIEW.md` - 4-file sync system
- `FIELD-NAMING-CONVENTION-CLEAN.md` - Field ID standards

---

**Status:** Planning document - ready for audit phase
**Next Step:** Audit S1/S2 fields for incorrect IDs
**Owner:** Marcel Superagent / Claude Code

