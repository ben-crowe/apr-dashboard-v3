# TDD Page Architecture & Current Issue - Team Debug Document

**Created:** 2026-01-05
**Purpose:** Help team debug the "0 mapped inputs" issue on the Test Data Dashboard page

---

## Overview: What is the TDD Page?

The **Test Data Dashboard** (`/test-input`) is a development/testing page that allows loading sample data into the Report Builder system to verify:
1. Template placeholders render correctly
2. Data flows from store -> template -> preview
3. The calculation engine processes inputs correctly
4. Editor panels display data properly

---

## The Two Test Buttons - Purpose & Expected Behavior

### Button 1: "Load Data" (Test User Input Flow)

**PURPOSE:** Simulate what happens when a real user enters data through the editor.

**EXPECTED FLOW:**
```
TestDataSet1.ts -> Filter to user-input fields -> Store sections -> Calc Engine -> Template -> Preview
```

**STEPS:**
1. Load fields from `TestDataSet1.ts` that are marked as `inputSource: 'user-input'` in `fieldRegistry.ts`
2. Skip calculated fields (the calc engine will compute these)
3. Load values into the Zustand store (`sections[].fields[].value`)
4. Run the calculation engine (`runCalculations()`)
5. Generate preview HTML by interpolating store values into template
6. **Stay on TDD page** - update stats to show coverage

**EXPECTED STATS AFTER:**
```
Template: 1247 (placeholders in HTML)
Mapped Inputs: ~1000+ (fields with values)
Coverage: ~80%+
```

---

### Button 2: "Report DataSet1" (Test Template Rendering)

**PURPOSE:** Bypass the store entirely and test if ALL template placeholders have matching test data.

**EXPECTED FLOW:**
```
TestDataSet1.ts -> Template HTML directly (no store, no calc) -> Preview
```

**STEPS:**
1. Fetch the template HTML (`Report-MF-template.html`)
2. Replace ALL `{{field-id}}` placeholders with values from `TestDataSet1.ts`
3. Set `previewHtml` directly (does NOT load into store sections)
4. **Navigate to `/mock-builder`** to show the rendered preview

**PURPOSE:** Answer the question "Does every template placeholder have test data?"

---

## The 4-File Sync Architecture

These 4 files MUST have matching field IDs:

| File | Purpose | Location |
|------|---------|----------|
| **fieldRegistry.ts** | Master field definitions (SOURCE OF TRUTH) | `src/features/report-builder/schema/` |
| **TestDataSet1.ts** | Test values for all fields | `src/features/report-builder/data/` |
| **Report-MF-template.html** | HTML with `{{field-id}}` placeholders | `public/` |
| **EditPanel.tsx** | Hardcoded layout arrays for editor UI | `src/features/report-builder/components/EditPanel/` |

---

## How Field IDs Work Across The System

### 1. Field Registry (`fieldRegistry.ts`)

The registry defines every field with:
```typescript
{
  id: 'client-first-name',           // Canonical field ID
  storeId: 'client-first-name',      // ID used in store (same as id)
  label: 'Client First Name',         // Human-readable label
  section: 'client-intake',           // Which section it belongs to
  subsection: 'client-info-intake',   // Sub-grouping
  type: 'text',                       // Field type
  inputSource: 'user-input',          // HOW data enters: user-input, calculated, auto-filled, api-fetch
  required: true
}
```

**inputSource types:**
| Type | Count | Description |
|------|-------|-------------|
| `user-input` | 1,511 | Human types these in editor |
| `calculated` | 402 | Calc engine computes from user inputs |
| `auto-filled` | 95 | System populates automatically |
| `api-fetch` | 8 | External API provides value |

---

### 2. Test Data (`TestDataSet1.ts`)

Simple key-value pairs:
```typescript
export const testDataSet1 = {
  "client-first-name": "Kenneth",
  "client-last-name": "Engler",
  "property-name": "North Battleford Apartments",
  "calc-noi": 125000,  // Even calculated fields have test values
  // ... ~2,270 fields total
};
```

---

### 3. Template (`Report-MF-template.html`)

HTML with mustache-style placeholders:
```html
<p>Client: {{client-first-name}} {{client-last-name}}</p>
<p>Property: {{property-name}}</p>
<p>NOI: {{calc-noi}}</p>
```

**Total placeholders:** ~1,247 unique `{{field-id}}` patterns

---

### 4. Store Sections (Runtime)

The Zustand store holds sections with fields:
```typescript
sections: [
  {
    id: 'client-intake',
    name: 'Client Intake',
    fields: [
      { id: 'client-first-name', value: '', label: 'Client First Name', ... },
      { id: 'client-last-name', value: '', label: 'Client Last Name', ... },
    ],
    subsections: [...]
  },
  // ... more sections
]
```

**Built by:** `buildAllSectionsFromRegistry()` which iterates through `fieldRegistry` and creates sections/fields dynamically.

---

## The Editor Panel (Mock Builder) - HARDCODED LAYOUTS

### The Problem: EditPanel Uses Hardcoded Field Arrays

In `EditPanel.tsx`, there are hardcoded layout arrays that define which fields appear in each tab:

```typescript
const HOME_FIELD_LAYOUT = {
  'job-setup': [
    { fields: ['job-number', 'report-date'], widths: ['50%', '50%'] },
  ],
  'client-info': [
    { fields: ['client-first-name', 'client-last-name'], widths: ['50%', '50%'] },
    { fields: ['client-email', 'client-phone'], widths: ['50%', '50%'] },
  ],
  'appraiser-info': [
    { fields: ['appraiser-name', 'appraiser-credentials'], widths: ['50%', '50%'] },
  ],
  // ... more subsections
};
```

**These field IDs are HARDCODED** - they must exactly match:
1. The `storeId` in `fieldRegistry.ts`
2. The key in `TestDataSet1.ts`
3. The `{{field-id}}` in template

### How EditPanel Finds Field Values

```typescript
const findFieldById = (fieldId: string): ReportField | undefined => {
  for (const section of sections) {
    // Check main fields
    for (const field of section.fields || []) {
      if (field.id === fieldId) return field;
    }
    // Check subsection fields
    for (const sub of section.subsections || []) {
      for (const field of sub.fields || []) {
        if (field.id === fieldId) return field;
      }
    }
  }
  return undefined;
};
```

**If a field ID in the layout doesn't exist in the store sections, the editor shows nothing.**

---

## The Current Issue: 0 Mapped Inputs

### What's Happening

When clicking "Load Data":
```
Template: 1247
Mapped Inputs: 0
Empty: 0
Missing: 1247
Coverage: 0%
```

### The Stats Calculation Logic

Located in `TestInputDashboard.tsx` (lines 515-560):

```typescript
const stats = useMemo(() => {
  // 1. Get template placeholder count
  const total = templateFieldIds.length;  // ~1247

  // 2. Build map of store values
  const storeValues = new Map();
  sections.forEach((section) => {
    section.fields?.forEach((field) => storeValues.set(field.id, field.value));
    section.subsections?.forEach((sub) => {
      sub.fields.forEach((field) => storeValues.set(field.id, field.value));
    });
  });

  // 3. Count how many template IDs have values in store
  templateFieldIds.forEach((fieldId) => {
    if (storeValues.has(fieldId)) {
      if (storeValues.get(fieldId) !== '') {
        mapped++;  // Has a value
      } else {
        empty++;   // Exists but empty
      }
    } else {
      missing++; // Not in store at all
    }
  });

  return { total, mapped, empty, missing };
}, [sections, selectedDataset, templateFieldIds]);
```

### Why It Shows 0

The `storeValues` map is empty because `sections` is empty or not populated when the stats calculate.

**Root Cause Investigation:**

1. **`loadDataSet1User()` checks sections:**
   ```typescript
   let sections = get().sections;
   if (!sections || sections.length === 0) {
     await get().initializeMockData();  // Should create sections
     sections = get().sections;
   }
   ```

2. **If `initializeMockData()` fails or sections is never set**, then `fieldExists()` returns false for ALL fields:
   ```typescript
   const fieldExists = (fieldId: string): boolean => {
     for (const section of sections) {  // If sections is [], loop never runs
       if (section.fields.find((f) => f.id === fieldId)) return true;
     }
     return false;  // Always returns false if sections empty
   };
   ```

3. **No fields are added to updates array**, so nothing gets loaded into store.

---

## Data Flow Diagram

```
+-----------------------------------------------------------------------------+
|                           DATA SOURCES                                       |
+------------------+------------------+------------------+--------------------+
|  fieldRegistry   |   TestDataSet1   |     Template     |   EditPanel        |
|  (1,687 fields)  |  (~2,270 values) | (1,247 placeholders) | (HARDCODED IDs)   |
+------------------+------------------+------------------+--------------------+
|                                                                              |
|  FIELD ID MUST MATCH ACROSS ALL 4 FILES                                     |
|  Example: "client-first-name" must exist in ALL files with same ID          |
|                                                                              |
+-----------------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------------+
|                        STORE INITIALIZATION                                  |
+-----------------------------------------------------------------------------+
|                                                                              |
|  buildAllSectionsFromRegistry()                                             |
|  -----------------------------                                              |
|  - Iterates fieldRegistry                                                   |
|  - Groups by section/subsection                                             |
|  - Creates store sections with field.id = fieldDef.storeId                  |
|  - All values start as '' (empty)                                           |
|                                                                              |
|  Result: sections[30+] with ~1,687 fields, all empty                        |
|                                                                              |
+-----------------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------------+
|                     LOAD DATA BUTTON FLOW                                    |
+-----------------------------------------------------------------------------+
|                                                                              |
|  loadDataSet1User()                                                         |
|  -----------------                                                          |
|  1. Check: Are sections initialized? If not, call initializeMockData()      |
|                                                                              |
|  2. For each field in TestDataSet1:                                         |
|     - Map field ID: storeFieldId = testDataFieldMapping[fieldId] || fieldId |
|     - Get registry definition: getFieldDef(storeFieldId)                    |
|     - Check filter: inputSource !== 'calculated'                            |
|     - Check exists: fieldExists(storeFieldId) in sections                   |
|     - If passes: Add to updates array                                       |
|                                                                              |
|  3. Apply updates to sections (set field values)                            |
|                                                                              |
|  4. Run calculation engine (computes calculated fields)                     |
|                                                                              |
|  5. Generate preview HTML                                                   |
|                                                                              |
|  BUG: If sections is empty, fieldExists() returns false for ALL fields      |
|       -> updates array stays empty -> no data loaded                        |
|                                                                              |
+-----------------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------------+
|                        STATS CALCULATION                                     |
+-----------------------------------------------------------------------------+
|                                                                              |
|  Total = templateFieldIds.length (parsed from template HTML)                |
|                                                                              |
|  storeValues = Map of field.id -> field.value from sections                 |
|                                                                              |
|  For each templateFieldId:                                                  |
|    - If storeValues.has(fieldId) && value !== '' -> mapped++                |
|    - If storeValues.has(fieldId) && value === '' -> empty++                 |
|    - If !storeValues.has(fieldId) -> missing++                              |
|                                                                              |
|  BUG: If sections is empty, storeValues is empty -> missing = 1247          |
|                                                                              |
+-----------------------------------------------------------------------------+
```

---

## Expected Behavior After Fix

### "Load Data" Button:
```
1. Sections initialized from fieldRegistry (1,687 fields)
2. TestDataSet1 values loaded into store sections
3. Calc engine runs, computes calculated fields
4. Stats show: Mapped ~1000+, Coverage ~80%+
5. Navigate to /mock-builder -> Editor panel shows values
```

### "Report DataSet1" Button:
```
1. Fetch template HTML
2. Replace ALL {{field-id}} with TestDataSet1 values directly
3. Navigate to /mock-builder -> Preview shows rendered report
4. Editor panel may be empty (data not in store, only in preview HTML)
```

---

## Key Debug Points

### 1. Is `sections` initialized?
```javascript
console.log("Sections count:", sections.length);
console.log("Sample section:", sections[0]);
```

### 2. Does `fieldExists()` find fields?
```javascript
console.log("Does client-first-name exist?", fieldExists('client-first-name'));
```

### 3. Are updates being created?
```javascript
console.log("Updates to apply:", updates.length);
console.log("Sample update:", updates[0]);
```

### 4. After store update, do values exist?
```javascript
const sections = useReportBuilderStore.getState().sections;
const clientField = sections[0]?.fields?.find(f => f.id === 'client-first-name');
console.log("Client first name value:", clientField?.value);
```

---

## Files to Review

| File | Lines | What to Check |
|------|-------|---------------|
| `TestInputDashboard.tsx` | 515-560 | Stats calculation logic |
| `TestInputDashboard.tsx` | 1136-1148 | Load Data button handler |
| `reportBuilderStore.ts` | 7170-7315 | `loadDataSet1User()` function |
| `reportBuilderStore.ts` | 5960-5976 | `initializeMockData()` function |
| `reportBuilderStore.ts` | 200-263 | `buildAllSectionsFromRegistry()` |
| `EditPanel.tsx` | 50-150 | Hardcoded layout arrays |
| `EditPanel.tsx` | 414-428 | `findFieldById()` function |

---

## Summary of the Bug

**Expected:** Click "Load Data" -> Stats show ~1000+ mapped -> Editor shows values

**Actual:** Click "Load Data" -> Stats show 0 mapped -> Editor shows empty fields

**Root Cause:** The store `sections` array is empty when `loadDataSet1User()` runs, so:
1. `fieldExists()` returns false for all fields
2. No updates are added to the updates array
3. Store remains empty
4. Stats calculate against empty store -> 0 mapped

---

## Proposed Fix

**Initialize sections on TDD page mount:**

Add a useEffect to `TestInputDashboard.tsx`:

```typescript
useEffect(() => {
  if (sections.length === 0) {
    initializeMockData();
  }
}, []);
```

This ensures sections exist before any button is clicked.
