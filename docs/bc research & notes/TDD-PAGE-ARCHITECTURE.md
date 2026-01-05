# TDD Page & Report Builder Architecture

**Purpose:** Knowledge file for session context - explains how the Test Data Dashboard and Report Builder system works.

**Last Updated:** 2026-01-05

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

*This document serves as architectural reference for session context refresh.*
