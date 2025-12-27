# Data Flow Explanation: Test Report Button

## Overview
This document explains how data flows from the "Test Report" button click through to the final rendered report in the Editor Panel and Preview.

---

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 1: USER CLICKS "TEST REPORT" BUTTON                                │
│ Location: TestInputDashboard.tsx                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 2: SET TEST MODE                                                    │
│ setTestMode('test-report')                                               │
│ - Updates Zustand store: activeTestMode = 'test-report'                  │
│ - Disables "Designer Mode" button visually                              │
│ - Button shows checkmark (✓) and blue highlight                          │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 3: CALL loadUserInputsOnly()                                       │
│ Location: reportBuilderStore.ts                                          │
│                                                                          │
│ 3a. CHECK SECTIONS INITIALIZED                                          │
│     - If sections.length === 0, call initializeMockData()               │
│     - initializeMockData() builds sections from fieldRegistry.ts       │
│     - Creates ReportSection[] structure with all fields                 │
│     - Each field has: { id, label, type, value: '', isEditable }        │
│                                                                          │
│ 3b. BUILD UPDATE BATCH                                                   │
│     - Create empty array: updates = []                                   │
│     - Loop through fieldRegistry.ts:                                     │
│       * If field.inputSource === 'calculated':                          │
│         → Add { fieldId, value: '' } to clear it                        │
│     - Loop through northBattlefordTestData.ts:                           │
│       * If field.inputSource === 'user-input':                           │
│         → Add { fieldId, value } from test data                         │
│     - Result: Array of ~1,000+ field updates                             │
│                                                                          │
│ 3c. APPLY ALL UPDATES AT ONCE                                           │
│     - Map through current sections                                      │
│     - For each field, find matching update                               │
│     - Update field.value with new value                                  │
│     - Preserve all other field properties (label, type, etc.)            │
│     - Update Zustand store: set({ sections: updatedSections })          │
│                                                                          │
│     Example:                                                             │
│     Before: { id: 'property-name', label: 'Property Name', value: '' }  │
│     After:  { id: 'property-name', label: 'Property Name',                │
│              value: 'North Battleford Apartments' }                      │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 4: RUN CALCULATOR ENGINE                                            │
│ Location: reportBuilderStore.ts → runCalculations()                      │
│                                                                          │
│ 4a. READ USER INPUT VALUES                                               │
│     - getFieldValue('calc-type1-count') → 4                              │
│     - getFieldValue('calc-type1-rent') → 900                             │
│     - getFieldValue('calc-type2-count') → 12                             │
│     - getFieldValue('calc-type2-rent') → 1060                            │
│     - ... (reads all calc-* input fields)                               │
│                                                                          │
│ 4b. PERFORM CALCULATIONS                                                 │
│     - Unit Mix:                                                           │
│       * type1Annual = 4 × 900 × 12 = $43,200                             │
│       * type2Annual = 12 × 1060 × 12 = $152,640                         │
│       * Total Rental Revenue = $195,840                                 │
│     - Other Income:                                                      │
│       * Parking: 16 units × $31.25/mo × 12 = $6,000                     │
│       * Laundry: 16 units × $12.50/mo × 12 = $2,400                     │
│       * Total Other Income = $8,400                                      │
│     - Potential Gross Revenue (PGR) = $204,240                           │
│     - Vacancy Loss = PGR × 3.8% = $7,761                                │
│     - Effective Gross Revenue (EGR) = $196,479                          │
│     - Operating Expenses = $84,621                                      │
│     - Net Operating Income (NOI) = $111,771                              │
│     - Indicated Value = NOI / Cap Rate = $1,790,000                      │
│                                                                          │
│ 4c. BATCH UPDATE CALCULATED FIELDS                                       │
│     - Create array: calcUpdates = []                                    │
│     - Add all calculated results:                                        │
│       * { fieldId: 'calc-pgr', value: 204240 }                          │
│       * { fieldId: 'calc-egr', value: 196479 }                           │
│       * { fieldId: 'calc-noi', value: 111771 }                           │
│       * { fieldId: 'calc-indicated-value', value: 1790000 }             │
│       * ... (all calc-* output fields)                                 │
│     - Map through sections, update field.value for each                 │
│     - Update Zustand store: set({ sections: sectionsWithCalcs })         │
│                                                                          │
│     Example:                                                             │
│     Before: { id: 'calc-noi', label: 'NOI', value: '' }                 │
│     After:  { id: 'calc-noi', label: 'NOI', value: 111771 }            │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 5: GENERATE PREVIEW HTML                                            │
│ Location: reportBuilderStore.ts → interpolateTemplate()                  │
│                                                                          │
│ 5a. LOAD TEMPLATE                                                        │
│     - Fetch /Report-MF-template.html (if not cached)                    │
│     - Template contains placeholders: {{property-name}}, {{calc-noi}}, etc│
│                                                                          │
│ 5b. BUILD FIELD VALUE MAP                                               │
│     - Loop through all sections and subsections                          │
│     - Extract field.id and field.value                                  │
│     - Create Map: fieldMap.set('property-name', 'North Battleford...')  │
│     - Create Map: fieldMap.set('calc-noi', '$111,771')                 │
│     - Result: Map with ~1,000+ field ID → value pairs                   │
│                                                                          │
│ 5c. REPLACE PLACEHOLDERS                                                 │
│     - Use regex: /\{\{([^}]+)\}\}/g                                     │
│     - Find all {{field-id}} in template                                 │
│     - Replace with value from fieldMap                                   │
│     - Example:                                                           │
│       Template: <h1>{{property-name}}</h1>                               │
│       After:    <h1>North Battleford Apartments</h1>                    │
│                                                                          │
│ 5d. UPDATE STORE                                                         │
│     - set({ previewHtml: interpolatedHtml })                            │
│     - This triggers PreviewPanel.tsx to re-render                        │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 6: EDITOR PANEL RE-RENDERS                                         │
│ Location: EditPanel.tsx                                                  │
│                                                                          │
│ 6a. READ FROM STORE                                                      │
│     - const { sections } = useReportBuilderStore()                      │
│     - Zustand automatically re-renders when sections change              │
│                                                                          │
│ 6b. DISPLAY FIELDS                                                       │
│     - Find current section: sections.find(s => s.id === activeSection) │
│     - Render section.fields and section.subsections                     │
│     - Each field shows:                                                 │
│       * Label: "Property Name"                                           │
│       * Input: <Input value={field.value} />                             │
│       * Value: "North Battleford Apartments"                            │
│                                                                          │
│     Example Display:                                                     │
│     ┌─────────────────────────────────────┐                              │
│     │ 01 - COVER PAGE                    │                              │
│     ├─────────────────────────────────────┤                              │
│     │ Property Name                       │                              │
│     │ [North Battleford Apartments]       │                              │
│     │                                     │                              │
│     │ Street Address                      │                              │
│     │ [1101, 1121 109 St]                │                              │
│     │                                     │                              │
│     │ 15 - VALUATIONS                     │                              │
│     ├─────────────────────────────────────┤                              │
│     │ NOI                                 │                              │
│     │ [$111,771]  ← Calculated field     │                              │
│     │                                     │                              │
│     │ Indicated Value                     │                              │
│     │ [$1,790,000]  ← Calculated field    │                              │
│     └─────────────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 7: PREVIEW PANEL RE-RENDERS                                         │
│ Location: PreviewPanel.tsx                                               │
│                                                                          │
│ 7a. DETECT HTML CHANGE                                                   │
│     - useEffect watches previewHtml from store                           │
│     - When previewHtml changes, inject into iframe                      │
│                                                                          │
│ 7b. INJECT INTO IFRAME                                                   │
│     - Extract .page-sheet divs from previewHtml                        │
│     - Inject into #pages-wrapper in preview-wrapper.html               │
│     - Result: 71-page report with all values interpolated               │
│                                                                          │
│ 7c. DISPLAY REPORT                                                       │
│     - User sees fully populated report                                  │
│     - All {{placeholders}} replaced with actual values                  │
│     - Images load from URLs in field values                             │
│     - Calculations show correct results                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Data Structures

### 1. Test Data (`northBattlefordTestData.ts`)
```typescript
{
  "property-name": "North Battleford Apartments",
  "street-address": "1101, 1121 109 St",
  "calc-type1-count": 4,
  "calc-type1-rent": 900,
  "calc-type2-count": 12,
  "calc-type2-rent": 1060,
  // ... ~1,000+ more fields
}
```

### 2. Field Registry (`fieldRegistry.ts`)
```typescript
{
  id: 'property-name',
  storeId: 'property-name',
  label: 'Property Name',
  section: 'cover',
  type: 'text',
  inputSource: 'user-input',  // ← Used to filter in loadUserInputsOnly()
  required: true
}
```

### 3. Store Sections (`reportBuilderStore.ts`)
```typescript
sections: [
  {
    id: 'cover',
    name: 'Cover Page',
    fields: [
      {
        id: 'property-name',
        label: 'Property Name',
        type: 'text',
        value: 'North Battleford Apartments',  // ← Updated by loadUserInputsOnly()
        isEditable: true
      }
    ],
    subsections: [...]
  }
]
```

### 4. Template HTML (`Report-MF-template.html`)
```html
<h1>{{property-name}}</h1>
<p>Address: {{street-address}}</p>
<p>NOI: {{calc-noi}}</p>
```

---

## Field Mapping Process

### Step-by-Step Field Matching:

1. **Test Data Field ID** → **Store Field ID**
   ```
   "property-name" (in test data)
   ↓
   testDataFieldMapping lookup (if needed)
   ↓
   "property-name" (in store)
   ```

2. **Store Field** → **Registry Definition**
   ```
   Find fieldRegistry entry where:
   - fieldRegistry.id === storeFieldId OR
   - fieldRegistry.storeId === storeFieldId
   ```

3. **Check Input Source**
   ```
   If fieldDef.inputSource === 'user-input':
     → Load value from test data
   If fieldDef.inputSource === 'calculated':
     → Clear value (will be filled by calculator)
   ```

4. **Update Store**
   ```
   Find field in sections array:
   - Search section.fields
   - Search section.subsections[].fields
   - Update field.value
   ```

---

## Calculator Flow

### Input Fields (user-input):
- `calc-type1-count`: 4
- `calc-type1-rent`: 900
- `calc-type2-count`: 12
- `calc-type2-rent`: 1060
- `calc-parking-per-unit`: 31.25
- `calc-laundry-per-unit`: 12.50
- `calc-vacancy-rate`: 3.8
- `calc-cap-rate`: 6.25
- ... (expense fields)

### Calculation Process:
```
1. Unit Mix Calculations
   → type1Annual = count × rent × 12
   → type2Annual = count × rent × 12
   → Total Rental Revenue

2. Other Income
   → Parking = units × parking-per-unit × 12
   → Laundry = units × laundry-per-unit × 12
   → Total Other Income

3. Gross Revenue
   → PGR = Rental Revenue + Other Income
   → Vacancy Loss = PGR × vacancy-rate%
   → EGR = PGR - Vacancy Loss

4. Operating Expenses
   → Sum all expense fields
   → Total Expenses

5. Net Operating Income
   → NOI = EGR - Total Expenses

6. Indicated Value
   → Value = NOI / (cap-rate / 100)
   → Round to nearest $10K
```

### Output Fields (calculated):
- `calc-pgr`: $204,240
- `calc-egr`: $196,479
- `calc-noi`: $111,771
- `calc-indicated-value`: $1,790,000
- ... (all calc-* output fields)

---

## Why Batching Matters

### Without Batching (OLD - SLOW):
```
For each field update:
  1. updateFieldValue(fieldId, value)
  2. Map through all sections
  3. Update one field
  4. set({ sections }) ← Triggers re-render
  5. generatePreview() ← Async, expensive
  6. Repeat 1,000+ times
```
**Result**: 1,000+ re-renders, 1,000+ preview generations = SLOW

### With Batching (NEW - FAST):
```
1. Collect all updates in array
2. Apply all updates at once
3. set({ sections }) ← One re-render
4. generatePreview() ← One preview generation
```
**Result**: 1 re-render, 1 preview generation = FAST

---

## Editor Panel Display Logic

### How Fields Appear in Editor:

1. **Read Active Section**
   ```typescript
   const currentSection = sections.find(s => s.id === activeSection)
   ```

2. **Render Section Fields**
   ```typescript
   currentSection.fields.map(field => (
     <Input value={field.value} />
   ))
   ```

3. **Render Subsections**
   ```typescript
   currentSection.subsections?.map(subsection => (
     <Collapsible>
       {subsection.fields.map(field => (
         <Input value={field.value} />
       ))}
     </Collapsible>
   ))
   ```

4. **Auto-Scroll Sync**
   - When user clicks section tab → Preview scrolls to that section
   - When user scrolls preview → Editor tab changes to visible section

---

## Summary

**Data Flow Path:**
```
Test Data File
    ↓
loadUserInputsOnly()
    ↓
Zustand Store (sections array)
    ↓
runCalculations()
    ↓
Zustand Store (updated sections)
    ↓
interpolateTemplate()
    ↓
Zustand Store (previewHtml)
    ↓
EditPanel.tsx (reads sections)
    ↓
PreviewPanel.tsx (reads previewHtml)
    ↓
User sees populated report
```

**Key Points:**
1. All data flows through Zustand store (`sections` array)
2. Editor Panel reads directly from `sections`
3. Preview reads from `previewHtml` (generated from `sections`)
4. Calculator reads from `sections`, writes back to `sections`
5. Batching prevents performance issues
6. Field matching uses `fieldRegistry.ts` as source of truth



