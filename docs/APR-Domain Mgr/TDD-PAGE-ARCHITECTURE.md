# APR Dashboard V3 - Master Knowledge File

> **🎯 START HERE** - This is the central knowledge hub for the APR Dashboard V3 project. Read the Session Notes first, then dive into sections as needed.
>
> **Skill:** Run `/apr-orchestrator` to load APR Orchestrator role and check pending tasks automatically.

---

## 📓 Session Notes & Updates

*Read this section first when starting a new session. Add new entries at the top.*

### 2026-01-05 (PM) - Ecosystem Understanding Expanded
- **Added:** FULL-ECOSYSTEM-INTEGRATION.md to knowledge folder
- **Key Learning:** Report Builder is STAGE 4 of a 4-stage system (Intake → LOE → E-Sign → Report)
- **Current Gap:** Report Builder disconnected from job system, no persistence, no auto-save
- **Future Work:** Integration bridge, `report_builder_data` table, `/dashboard/job/:jobId/report` route
- **Added:** `/apr-orchestrator` skill and command (proper skill/command pattern)
- **Added:** PENDING-TASKS.md for persistent task tracking

### 2026-01-05 (AM) - Image Debugging & Doc Foundation
- **Fixed:** Cover image (`subject-photo`) not rendering - template had proper `<img>` tags but issue was elsewhere
- **Fixed:** 26 gallery images (subject-photo-1 to -25) had broken text placeholders instead of `<img>` tags (commit `d6bf37d`)
- **Fixed:** Map images (`img-map-aerial`) same issue - text placeholder, not `<img>` tag
- **Added:** "Image Fields in HTML Template" section with correct patterns
- **Added:** "Preview Panel & Iframe Architecture" section
- **Added:** "Debugging: Image Display Issues" section with checklist
- **Started:** Building this file as central knowledge hub
- **Key Learning:** Images MUST use `<img src="{{field-id}}">`, NOT `{{field-id}}` as text content

### Document Created - 2026-01-05
- Initial architecture documentation for TDD page and Report Builder
- Documented 4-file sync architecture
- Added reference library links to `docs/15-Contract-review/`

---

## 🔗 Quick Links (Central Hub)

| Resource | Path | Purpose |
|----------|------|---------|
| **`/apr-orchestrator` Skill** | `~/.claude/skills/apr-orchestrator.md` | APR Orchestrator - run to load context & check tasks |
| **This File** | `docs/bc research & notes/TDD-PAGE-ARCHITECTURE.md` | Master knowledge hub |
| **FULL ECOSYSTEM** | `docs/bc research & notes/FULL-ECOSYSTEM-INTEGRATION.md` | 4-stage architecture, database schema, integration plan |
| **PENDING TASKS** | `docs/bc research & notes/PENDING-TASKS.md` | Tasks that MUST get done - check at session start |
| **Calc Engine Map** | `docs/bc research & notes/CALC-ENGINE-FIELD-MAP.md` | Calculator field mappings |
| **Reference Library** | `docs/15-Contract-review/` | Extensive field guides, crosswalks, Valcre mappings |
| **Field Registry** | `src/features/report-builder/schema/fieldRegistry.ts` | Source of truth for all 1,687 fields |
| **Test Data** | `src/features/report-builder/data/TestDataSet1.ts` | Test values for all fields |
| **HTML Template** | `public/Report-MF-template.html` | Report template with placeholders |
| **Store** | `src/features/report-builder/store/reportBuilderStore.ts` | Zustand store, all state management |

---

## 🌐 Ecosystem Context

**APR Dashboard V3 is a 4-stage appraisal workflow system:**

```
STAGE 1: CLIENT INTAKE ───→ STAGE 2: JOB MGT & LOE ───→ STAGE 3: E-SIGNATURE ───→ STAGE 4: REPORT BUILDER
   /                        /dashboard/job/:jobId         DocuSeal                   /mock-builder
   job_submissions          job_loe_details               Signed LOE                 (THIS DOC COVERS)
                            job_property_info
```

**This document focuses on Stage 4 (Report Builder)** - the final stage where appraisal reports are assembled.

**Current Integration Status:**
- ⚠️ Report Builder is currently **disconnected** from Stages 1-3
- ⚠️ No persistence to database (data lost on close)
- ⚠️ Missing route `/dashboard/job/:jobId/report`
- 📋 Full integration plan in `FULL-ECOSYSTEM-INTEGRATION.md`

**For full ecosystem details:** Read `FULL-ECOSYSTEM-INTEGRATION.md`

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [The 4-File Sync Architecture](#the-4-file-sync-architecture)
3. [Field Registry Structure](#field-registry-structure)
4. [Zustand Store Structure](#zustand-store-structure)
5. [Data Flow: Load Data Button](#data-flow-load-data-button)
6. [Data Flow: Template Interpolation](#data-flow-template-interpolation)
7. [Editor Panel Architecture](#editor-panel-architecture)
8. [Preview Panel Architecture](#preview-panel-architecture)
9. [Image Fields in HTML Template](#image-fields-in-html-template)
10. [Preview Panel & Iframe Architecture](#preview-panel--iframe-architecture)
11. [Debugging: Image Display Issues](#debugging-image-display-issues)
12. [Reference Documentation Library](#reference-documentation-library)

---

# TDD Page & Report Builder Architecture

**Purpose:** Knowledge file for session context - explains how the Test Data Dashboard and Report Builder system works.

---

## System Overview

The **Test Data Dashboard (TDD)** (`/test-input`) is a development page that manages test data loading for the Report Builder system. It enables:

1. Loading sample data to verify template rendering
2. Testing the data flow: Store -> Template -> Preview
3. Running the calculation engine on test inputs
4. Verifying editor panel displays

The **Report Builder** (`/mock-builder`) is the main editing interface where users view/edit fields and see a live preview of the rendered report.

---

## The 4-File Sync Architecture

These 4 files MUST have matching field IDs for the system to work:

| File | Purpose | Field Count | Location |
|------|---------|-------------|----------|
| **fieldRegistry.ts** | Master field definitions (SOURCE OF TRUTH) | ~1,687 | `src/features/report-builder/schema/` |
| **TestDataSet1.ts** | Test values for all fields | ~2,270 | `src/features/report-builder/data/` |
| **Report-MF-template.html** | HTML with `{{field-id}}` placeholders | ~1,247 | `public/` |
| **EditPanel.tsx** | Hardcoded layout arrays for editor UI | varies | `src/features/report-builder/components/EditPanel/` |

**Critical Rule:** A field ID like `client-first-name` must be identical across all 4 files.

---

## Field Registry Structure

The registry (`fieldRegistry.ts`) defines every field with metadata:

```typescript
{
  id: 'client-first-name',           // Canonical field ID
  storeId: 'client-first-name',      // ID used in store (typically same as id)
  label: 'Client First Name',         // Human-readable label
  section: 'client-intake',           // Parent section
  subsection: 'client-info-intake',   // Sub-grouping within section
  type: 'text',                       // Field type: text, number, textarea, image, date, etc.
  inputSource: 'user-input',          // HOW data enters the system
  required: true
}
```

### inputSource Types

| Type | Count | Description |
|------|-------|-------------|
| `user-input` | ~1,511 | User types these in the editor |
| `calculated` | ~402 | Calc engine computes from other fields |
| `auto-filled` | ~95 | System populates automatically |
| `api-fetch` | ~8 | External API provides value |

---

## Zustand Store Structure

The store (`reportBuilderStore.ts`) holds all report data:

```typescript
interface ReportBuilderState {
  sections: ReportSection[];        // All field data organized by section
  sectionGroups: SectionGroup[];    // UI groupings for navigation
  activeSection: string;            // Currently selected section in editor
  previewHtml: string;              // Rendered HTML for preview panel
  previewTemplate: string;          // Raw template HTML
  showRawIds: boolean;              // Toggle: show field IDs vs values
  activeTestMode: TestMode;         // 'user-input' | 'test-report'
  // ... more state
}
```

### Section Structure

```typescript
sections: [
  {
    id: 'client-intake',
    name: 'Section 1: Client Intake',
    shortName: 'S1 - INTAKE',
    fields: [],  // Top-level fields (usually empty, fields are in subsections)
    subsections: [
      {
        id: 'client-info-intake',
        title: 'CLIENT INFORMATION',
        fields: [
          { id: 'client-first-name', value: 'Kenneth', label: 'Client First Name', type: 'text', ... },
          { id: 'client-last-name', value: 'Engler', label: 'Client Last Name', type: 'text', ... },
        ]
      }
    ]
  },
  // ... 30+ sections
]
```

---

## Data Flow: Load Data Button

When user clicks "Load Data" on TDD page:

```
1. loadDataSet1User() called
   |
2. Check: sections initialized?
   |-- NO --> initializeMockData() --> buildAllSectionsFromRegistry()
   |-- YES --> continue
   |
3. For each field in TestDataSet1:
   |-- Map field ID via testDataFieldMapping (if needed)
   |-- Check: is field calculated? (skip if yes - calc engine handles)
   |-- Check: does field exist in store sections?
   |-- If passes: add to updates array
   |
4. Apply all updates to store sections
   |
5. Run calculation engine (runCalculations())
   |-- Processes all calculated fields
   |-- Uses user-input values as inputs
   |
6. Generate preview HTML (interpolateTemplate())
   |
7. Store updated: { sections, previewHtml }
```

---

## Data Flow: Template Interpolation

The `interpolateTemplate()` function replaces `{{field-id}}` placeholders:

```
1. Build fieldMap from store sections
   |-- Map<fieldId, value>
   |-- Includes all fields from all sections/subsections
   |
2. For each {{field-id}} in template:
   |-- Look up value in fieldMap
   |-- Replace placeholder with value
   |-- Handle special cases (images, calculations)
   |
3. Return interpolated HTML
```

---

## Editor Panel Architecture

### Hardcoded Layout System

`EditPanel.tsx` uses hardcoded layout arrays to define field arrangement:

```typescript
const HOME_FIELD_LAYOUT = {
  'job-setup': [
    { fields: ['job-number', 'report-date'], widths: ['50%', '50%'] },
  ],
  'client-info': [
    { fields: ['client-first-name', 'client-last-name'], widths: ['50%', '50%'] },
    { fields: ['client-email', 'client-phone'], widths: ['50%', '50%'] },
  ],
};
```

### Field Lookup

```typescript
const findFieldById = (fieldId: string): ReportField | undefined => {
  for (const section of sections) {
    for (const field of section.fields || []) {
      if (field.id === fieldId) return field;
    }
    for (const sub of section.subsections || []) {
      for (const field of sub.fields || []) {
        if (field.id === fieldId) return field;
      }
    }
  }
  return undefined;
};
```

### Image Section Mapping

For images, `SECTION_IMAGE_MAPPING` defines which image fields appear in which editor tabs:

```typescript
const SECTION_IMAGE_MAPPING: Record<string, string[]> = {
  'cover': ['subject-photo', 'img-signature'],
  'photos': ['exterior-photo-1', 'exterior-photo-2', ...],
  'maps': ['map-aerial', 'map-local', ...],
  // ...
};
```

---

## Preview Panel Architecture

`PreviewPanel.tsx` renders the report in an iframe:

1. Loads `Report-MF-template.html` as iframe src
2. Injects page content from `previewHtml` into `#pages-wrapper`
3. Handles approach toggle filtering (hide/show page ranges)
4. Manages field display toggle (raw IDs vs interpolated values)

### Page Filtering

```typescript
const APPROACH_TO_PAGES_MAP = {
  "home-use-income-approach": { start: 37, end: 51 },
  "home-use-sales-approach": { start: 56, end: 61 },
  "home-use-cost-approach": { start: 52, end: 55 },
};
```

When an approach toggle is disabled, those pages are excluded from preview.

---

## Image Fields in HTML Template

### Correct Pattern (ALWAYS USE THIS)

Images MUST use proper `<img>` tags with the placeholder in the `src` attribute:

```html
<!-- ✅ CORRECT - Image displays properly -->
<div class="img-placeholder" style="width:100%; height:200px;">
    <img src="{{subject-photo}}"
         style="width:100%; height:100%; object-fit:cover;"
         onerror="this.style.display='none';" />
</div>
```

### Broken Pattern (NEVER USE THIS)

Do NOT put image placeholders as text content - they will NOT render:

```html
<!-- ❌ BROKEN - Renders as text "{{subject-photo}}", not an image -->
<div class="field-mapped" title="{{subject-photo}}">
    {{subject-photo}}
</div>
```

### Why This Matters

The `interpolateTemplate()` function replaces `{{field-id}}` with the field value (e.g., `/extracted-images/image2.jpeg`). When this value is:
- Inside `<img src="...">` → Browser loads the image ✅
- As text content → Browser displays the path as text ❌

### Image Field Checklist

When adding or fixing image fields in the template:

1. **Use `<img>` tag** - Always wrap in `<img src="{{field-id}}">`
2. **Add onerror handler** - Hide broken images: `onerror="this.style.display='none';"`
3. **Use object-fit** - `object-fit: cover` or `contain` for proper scaling
4. **Container sizing** - Parent div should have explicit width/height
5. **No duplicate class** - Don't use `class="field-mapped"` on image containers (causes issues)

### Common Image Fields

| Field ID | Location | Purpose |
|----------|----------|---------|
| `subject-photo` | Cover page | Main property photo |
| `subject-photo-1` to `subject-photo-25` | Gallery pages | Subject property photos |
| `img-map-regional` | Maps section | Regional context map |
| `img-map-local` | Maps section | Local area map |
| `img-map-aerial` | Maps section | Aerial overview |
| `img-signature` | Certification | Appraiser signature |

---

## Preview Panel & Iframe Architecture

### How Preview Rendering Works

```
1. Template loaded from /public/Report-MF-template.html
   |
2. interpolateTemplate() replaces {{field-id}} placeholders
   |
3. PreviewPanel.tsx injects HTML into iframe's #pages-wrapper
   |
4. Iframe displays rendered pages
```

### Iframe Structure

```html
<!-- PreviewPanel.tsx creates this structure -->
<iframe id="preview-iframe" src="/Report-MF-template.html">
    <!-- Inside iframe document: -->
    <div id="pages-wrapper">
        <!-- Page content injected here -->
        <div class="page-sheet" data-page-num="1">...</div>
        <div class="page-sheet" data-page-num="2">...</div>
        <!-- ... more pages -->
    </div>
</iframe>
```

### Key Functions

| Function | File | Purpose |
|----------|------|---------|
| `loadPreviewTemplate()` | reportBuilderStore.ts | Fetches raw template HTML |
| `interpolateTemplate()` | reportBuilderStore.ts | Replaces placeholders with values |
| `generatePreview()` | reportBuilderStore.ts | Full preview regeneration |
| `injectContent()` | PreviewPanel.tsx | Inserts HTML into iframe |

### Content Injection Process

```typescript
// PreviewPanel.tsx simplified flow
const iframe = document.getElementById('preview-iframe');
const iframeDoc = iframe.contentDocument;
const pagesWrapper = iframeDoc.getElementById('pages-wrapper');

// Extract page-sheets from interpolated HTML
const tempDiv = document.createElement('div');
tempDiv.innerHTML = previewHtml;
const pages = tempDiv.querySelectorAll('.page-sheet');

// Clear and inject
pagesWrapper.innerHTML = '';
pages.forEach(page => pagesWrapper.appendChild(page.cloneNode(true)));
```

---

## Debugging: Image Display Issues

### Quick Diagnosis Checklist

When images aren't displaying in preview:

| Check | Command/Location | What to Look For |
|-------|-----------------|------------------|
| 1. Template HTML | `public/Report-MF-template.html` | Is it `<img src="{{field-id}}">` or just `{{field-id}}`? |
| 2. Field in registry | `src/.../fieldRegistry.ts` | Does field exist? Correct section/subsection? |
| 3. Field in TestDataSet1 | `src/.../TestDataSet1.ts` | Does field have a value? |
| 4. Browser console | F12 → Console | Look for `🖼️ IMAGE UPDATE` or `interpolateTemplate` logs |
| 5. Network tab | F12 → Network | Is image URL being requested? 404 errors? |

### Console Debug Markers

The store has debug logging for image fields. Look for:

```
🖼️ IMAGE UPDATE: subject-photo from "" to "/extracted-images/image2.jpeg"
🟣🟣🟣 FOUND subject-photo in section "image-mgt" -> subsection "cover-images"!
interpolateTemplate: Image replacement: {{subject-photo}} → store:subject-photo → value:"/extracted-images/image2.jpeg"
```

### Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Image shows as text path | Missing `<img>` tag | Add `<img src="{{field-id}}">` wrapper |
| Image placeholder stays | Field not in store | Add field to fieldRegistry.ts |
| Image 404 error | Wrong path in TestDataSet1 | Fix path in TestDataSet1.ts |
| Image not updating | Wrong field ID | Check 4-file sync (registry, test data, template, editor) |

### Historical Fix: Broken Image Placeholders (2026-01-05)

**Problem:** 26 gallery images (subject-photo-1 to subject-photo-25) and map images showed as text instead of images.

**Cause:** Template had text placeholders instead of `<img>` tags:
```html
<!-- Broken -->
<div class="field-mapped">[IMAGE: <span class="field-mapped">{{subject-photo-1}}</span>]</div>

<!-- Fixed -->
<div class="img-placeholder"><img src="{{subject-photo-1}}" ... /></div>
```

**Commits:**
- `d6bf37d` - Fix: Replace 26 broken image span placeholders with proper img tags
- `2635a56` - Remove image fallback logic - empty image fields are fine

---

## Field ID Mapping

Some fields have different IDs in test data vs store. The `testDataFieldMapping` handles this:

```typescript
export const testDataFieldMapping: Record<string, string> = {
  // Template ID -> Store ID
  "calc-unit-1-type": "calc-type1-name",
  "location-overview": "location-overview-text",
  "tax-assessment-year": "assessment-year",
  // ... many more
};
```

**Usage:** When loading test data, if `testDataFieldMapping[fieldId]` exists, use the mapped ID to find the store field.

---

## Section Building

### buildAllSectionsFromRegistry()

Dynamically creates all sections from fieldRegistry:

```typescript
const buildAllSectionsFromRegistry = (): ReportSection[] => {
  // Group fields by section, then by subsection
  const sectionMap = new Map<string, Map<string, ReportField[]>>();

  fieldRegistry.forEach(fieldDef => {
    const sectionId = fieldDef.section;
    const subsectionId = fieldDef.subsection || '__root__';

    // Initialize maps as needed
    // Add field to appropriate section/subsection
    // ...
  });

  // Convert maps to section objects
  // Return array of ReportSection
};
```

### buildImageMgtSection()

Specialized builder for the image management section:

```typescript
const buildImageMgtSection = (): ReportSection => {
  const subsections = {
    'cover-images': { ... },
    'maps': { ... },
    'exterior-photos': { ... },
    'subject-photos': { ... },
    'comp-photos': { ... },
    // ... more subsections
  };

  // Populate fields from fieldRegistry where section === 'image-mgt'
  // Return section object
};
```

---

## Calculation Engine

Located in `reportBuilderStore.ts`, the calc engine:

1. `runCalculations()` - Main entry point
2. `runSalesCompCalculations()` - Sales comparison approach
3. `runCostApproachCalculations()` - Cost approach
4. `runIncomeApproachCalculations()` - Income approach

**Flow:**
```
User inputs (user-input fields)
       |
       v
  Calc Engine
       |
       v
Calculated fields (inputSource: 'calculated')
```

---

## Key Store Actions

| Action | Purpose |
|--------|---------|
| `initializeMockData()` | Build sections from registry, initialize empty |
| `loadDataSet1User()` | Load TestDataSet1 into store, run calc engine |
| `loadDataSet1Report()` | Direct template interpolation (bypass store) |
| `generatePreview()` | Regenerate previewHtml from current sections |
| `updateFieldValue()` | Update single field, optionally regenerate preview |
| `setActiveSection()` | Change which section is shown in editor |

---

## File Reference

| File | Purpose |
|------|---------|
| `reportBuilderStore.ts` | Zustand store, all state management |
| `fieldRegistry.ts` | Master field definitions |
| `TestDataSet1.ts` | Test data values |
| `Report-MF-template.html` | HTML template with placeholders |
| `EditPanel.tsx` | Editor UI with hardcoded layouts |
| `PreviewPanel.tsx` | Preview iframe and page injection |
| `ReportBuilderLayout.tsx` | Main layout with resizable panels |
| `SectionSidebar.tsx` | Section navigation sidebar |
| `TestInputDashboard.tsx` | TDD page with load buttons and stats |

---

## Common Patterns

### Finding a Field in Store

```typescript
// From store actions
const findField = (sections: ReportSection[], fieldId: string) => {
  for (const section of sections) {
    const field = section.fields?.find(f => f.id === fieldId);
    if (field) return field;
    for (const sub of section.subsections || []) {
      const subField = sub.fields.find(f => f.id === fieldId);
      if (subField) return subField;
    }
  }
  return undefined;
};
```

### Updating Field Value

```typescript
// In store
updateFieldValue: (fieldId: string, value: any, regeneratePreview = true) => {
  const sections = get().sections.map(section => ({
    ...section,
    fields: section.fields.map(f =>
      f.id === fieldId ? { ...f, value } : f
    ),
    subsections: section.subsections?.map(sub => ({
      ...sub,
      fields: sub.fields.map(f =>
        f.id === fieldId ? { ...f, value } : f
      )
    }))
  }));

  set({ sections });
  if (regeneratePreview) get().generatePreview();
};
```

---

## Stats Calculation (TDD Page)

The TDD page shows coverage stats:

```typescript
const stats = useMemo(() => {
  // Build map of all store values
  const storeValues = new Map();
  sections.forEach(section => {
    section.fields?.forEach(f => storeValues.set(f.id, f.value));
    section.subsections?.forEach(sub => {
      sub.fields.forEach(f => storeValues.set(f.id, f.value));
    });
  });

  // Count against template placeholders
  let mapped = 0, empty = 0, missing = 0;
  templateFieldIds.forEach(fieldId => {
    if (storeValues.has(fieldId)) {
      storeValues.get(fieldId) !== '' ? mapped++ : empty++;
    } else {
      missing++;
    }
  });

  return { total: templateFieldIds.length, mapped, empty, missing };
}, [sections, templateFieldIds]);
```

**Expected Results After Load Data:**
- Template: ~1,247
- Mapped: ~1,000+
- Coverage: ~80%+

---

## Two Test Modes

### 1. User Input Flow ("Load Data" button)

Simulates real user entering data:
- Loads user-input fields from TestDataSet1
- Skips calculated fields (calc engine computes them)
- Runs calculation engine
- Updates store and preview

### 2. Template Test ("Report DataSet1" button)

Tests template rendering directly:
- Replaces ALL placeholders with TestDataSet1 values
- Bypasses store entirely
- No calculation engine
- Direct preview generation

---

## Navigation

| Route | Component | Purpose |
|-------|-----------|---------|
| `/test-input` | TestInputDashboard | TDD page, load data, view stats |
| `/mock-builder` | ReportBuilderLayout | Editor + Preview |
| `/preview` | Preview-only view | Full-screen preview |

---

## Reference Documentation Library

The `docs/15-Contract-review/` folder contains extensive reference documentation organized into key categories. These are invaluable for understanding the system.

### Quick Reference Paths

```
docs/15-Contract-review/
├── 0-APR-Domain-Core-Mgt/          # Domain knowledge, field naming, registry guides
├── 2-Field Management/              # Field crosswalks, mappings, registry docs
│   ├── Registry-field Info Guides/  # ⭐ Per-page field references
│   ├── crosswalks/                  # Template ↔ Valcre mappings
│   ├── valcre-mappings/             # Valcre named ranges & structure
│   └── 01-Registry truth docs/      # Source of truth files
├── 3-Calc Eng & Plan Agent/         # Calculator implementation
├── Architecture/                    # System architecture docs
└── 6-Souce Reports & Workbook/      # Reference reports
```

---

### Registry & Field Guides

**Location:** `docs/15-Contract-review/2-Field Management/Registry-field Info Guides/`

| File | Description |
|------|-------------|
| **`-MASTER-PAGE-FIELD-REFERENCE.md`** | ⭐ Per-page field crosswalk (Template ID ↔ Valcre ID, 70 pages, 1,013 fields) |
| **`VALCRE-WORKBOOK-TECHNICAL-GUIDE.md`** | ⭐ Excel workbook analysis: 88 sheets, 7,988 named ranges, calculation locations |
| **`FIELD-ID-GUIDE-for-Agents.md`** | Agent-friendly field ID conventions and lookup patterns |
| **`FIELD-REGISTRY-ALL-IDS.md`** | Complete list of all field IDs in registry |
| **`FIELD-REGISTRY-VALIDATION-REPORT.md`** | Validation status of all fields |
| **`TABLE-FIELD-ANALYSIS.md`** | Analysis of table-based fields (rental survey, comparables) |
| **`VALCRE-GROUND-TRUTH-README.md`** | How Valcre data serves as source of truth |
| **`DYNAMIC-CHARTS-IMPLEMENTATION.md`** | Chart/graph field implementation guide |

---

### Field Crosswalks & Mappings

**Location:** `docs/15-Contract-review/2-Field Management/`

| File | Description |
|------|-------------|
| **`crosswalks/template_to_valcre_mapping.json`** | JSON mapping: template field IDs → Valcre named ranges |
| **`valcre-mappings/valcre_named_ranges.json`** | All 7,988 Valcre named ranges with cell references |
| **`valcre-mappings/valcre_ranges_by_sheet.json`** | Named ranges organized by Excel sheet |
| **`valcre-mappings/VALCRE_REPORT_STRUCTURE.md`** | Report structure from Valcre perspective |
| **`valcre-mappings/VALCRE_TABLE_FIELD_MAPPING.md`** | Table-specific field mappings |
| **`valcre-named-ranges-complete.json`** | Complete named range export (937KB) |

---

### Source of Truth Documents

**Location:** `docs/15-Contract-review/2-Field Management/01-Registry truth docs/`

| File | Description |
|------|-------------|
| **`APR-DASHBOARD-FILE-SYNC-OVERVIEW.md`** | 4-file sync architecture explained in detail |
| **`IMAGE-FIELD-MAPPING-CORRECTED.json`** | Correct image field ID mappings |
| **`IMAGE-MAPPING-ISSUES-AND-FIXES.md`** | Known image mapping issues and solutions |
| **`HUMAN-INPUT-TEST-DATA.json`** | Test data for user-input fields |
| **`EXTRACTION-STATUS-HANDOFF.md`** | Field extraction status from source documents |

---

### Domain Knowledge & Naming

**Location:** `docs/15-Contract-review/0-APR-Domain-Core-Mgt/`

| File | Description |
|------|-------------|
| **`domain knowlege-APR-25.12.26.md`** | APR domain knowledge for agents |
| **`domain-Registry-guide.md`** | How the registry system works |
| **`FIELD-NAMING-CONVENTION-CLEAN.md`** | ⭐ Field naming conventions and patterns |
| **`FIELD-CONSOLIDATION-MAP.md`** | How duplicate fields are consolidated |
| **`ID FILE-SYNC-OVERVIEW.md`** | 4-file sync with diagrams |
| **`HARDCODED-FIELDS-TABLE.md`** | All hardcoded fields in EditPanel |
| **`TEMPLATE-FIELD-IDS-READABLE.md`** | Human-readable field ID list |
| **`Report-Builder-Workbook-tab-ref.md`** | Workbook tab reference for Report Builder |

---

### Calculator & Valuation

**Location:** `docs/15-Contract-review/3-Calc Eng & Plan Agent/`

| File | Description |
|------|-------------|
| **`Calc-to-Table.md`** | How calculator values flow to tables |
| **`Calculator-Demo-Implementation-Plan.md`** | Calculator implementation details |
| **`FEATURE-Sales-Comparison-Approach.md`** | Sales comparison calculation logic |
| **`IMPLEMENTATION-Sales-Comparison.md`** | Sales comp implementation guide |

---

### Architecture & Planning

**Location:** `docs/15-Contract-review/Architecture/`

| File | Description |
|------|-------------|
| **`APR-V4-ARCHITECTURE.md`** | Full V4 system architecture (58KB) |
| **`APR-V4-IMPLEMENTATION-GUIDE.md`** | Implementation guide for V4 |
| **`ARCHITECTURE-DIAGRAM.md`** | Visual architecture diagrams |
| **`IMPLEMENTATION-ROADMAP.md`** | Development roadmap |
| **`MOCK-REPORT-BUILDER-IMPLEMENTATION.md`** | Mock builder implementation details |

---

### Reference Source Files

**Location:** `docs/15-Contract-review/`

| File | Description |
|------|-------------|
| **`Ref.Report-VAL251012 - North Battleford Apt.pdf`** | ⭐ Reference PDF (14MB) - visual source of truth |
| **`Ref.Report-VAL251012-North Battleford Apt.docx`** | Word version of reference report |
| **`Ref.Report-VAL251012-North Battleford Apt.html`** | HTML export of reference report |
| **`reference-pages-viewer.html`** | Interactive page viewer tool |

---

### Key Concepts from Documentation

#### Valcre Workbook Structure (from VALCRE-WORKBOOK-TECHNICAL-GUIDE.md)

- **88 sheets** covering all appraisal methodologies
- **7,988 named ranges** - primary data access method
- **Key sheets:** DIRECTCAP, DCF, VALUES, COST, LAND, RENTAL
- **Named range pattern:** `IA_DirCap_NOI`, `SCA_Comp1_Price`, etc.

#### Per-Page Field Mapping (from -MASTER-PAGE-FIELD-REFERENCE.md)

Each page documented with:
- Registry Field ID (what our system uses)
- Valcre ID (source system mapping)
- Status (✅ Mapped, ⚠️ No Valcre, ❌ Missing)

Example:
```
PAGE 6 - Executive Summary
| Registry Field ID    | Valcre ID        | Status      |
|---------------------|------------------|-------------|
| `property-name`     | `PropertyName`   | ✅ Mapped   |
| `assessed-value`    | `TaxAssdValue`   | ✅ Mapped   |
| `site-area-sqft`    | ``               | ⚠️ No Valcre|
```

#### Field ID Naming Conventions (from FIELD-NAMING-CONVENTION-CLEAN.md)

- **Prefix patterns:** `calc-`, `ia-`, `sca-`, `recon-`, `impv-`
- **Numbered fields:** `-1`, `-2`, etc. for arrays
- **Subsection prefixes:** Match section grouping

---

### How to Use These References

1. **Finding a field mapping:** Check `-MASTER-PAGE-FIELD-REFERENCE.md` by page number
2. **Understanding Valcre data:** Read `VALCRE-WORKBOOK-TECHNICAL-GUIDE.md`
3. **Adding new fields:** Follow patterns in `FIELD-NAMING-CONVENTION-CLEAN.md`
4. **Debugging data flow:** Reference `APR-DASHBOARD-FILE-SYNC-OVERVIEW.md`
5. **Visual validation:** Compare against reference PDF

---

*This document serves as architectural reference for session context refresh.*
