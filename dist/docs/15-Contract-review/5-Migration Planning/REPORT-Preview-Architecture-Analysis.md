# Report Builder Preview Architecture & Field Mapping Analysis

**Date:** December 17, 2025
**Project:** APR Dashboard V3 - Report Builder Integration
**Purpose:** Analysis of current preview system and strategy for integrating perfected HTML templates

---

## Executive Summary

### Key Findings

1. **Preview Architecture:** Current system uses **pure HTML string templates** rendered in an iframe
2. **Field Mapping:** Uses **string interpolation** with `getFieldValue()` helper function
3. **Integration Path:** **Direct HTML integration is fully compatible** with current system
4. **Toggle Functionality:** Easily implementable via `data-sample` attributes and JavaScript
5. **Recommended Approach:** **Gradual migration** of pages 52-58 as proof of concept

---

## PART 1: Current Preview Architecture Analysis

### 1.1 Template System

**Location:** `/src/features/report-builder/templates/reportHtmlTemplate.ts`

**Type:** **Pure HTML String Templates**

```typescript
export function generateReportHtml(sections: ReportSection[]): string {
  // Returns a complete HTML document as a string
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>/* CSS here */</style>
      </head>
      <body>
        ${renderPages(sections)}
      </body>
    </html>
  `;
}
```

**Key Characteristics:**
- HTML stored as template literals (backtick strings)
- CSS embedded in `<style>` tags
- No JSX or React components
- Pure string concatenation

### 1.2 Rendering Pipeline

**Flow:** Store → Template → Preview

```
┌─────────────────┐
│ reportBuilderStore │ ← Zustand state (field values)
└────────┬──────────┘
         │
         ▼
┌─────────────────────┐
│ reportHtmlTemplate  │ ← Template functions (HTML strings)
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ PreviewRenderer.tsx  │ ← iframe rendering
└──────────────────────┘
```

**Components:**

1. **PreviewPanel.tsx**
   - Container component
   - Manages zoom level
   - Handles export buttons
   - Passes HTML string to PreviewRenderer

2. **PreviewRenderer.tsx**
   - Uses iframe for isolated rendering
   - Writes HTML via `iframeDoc.write(html)`
   - Supports drag-to-pan navigation
   - Fixed 8.5in width, expandable height

3. **reportHtmlTemplate.ts**
   - Contains `generateReportHtml()` main function
   - Calls page-specific render functions
   - Uses `getFieldValue()` helper for field retrieval

### 1.3 Field Value Resolution

**Helper Function Pattern:**

```typescript
const getFieldValue = (sections: ReportSection[], fieldId: string): string => {
  for (const section of sections) {
    // Check main fields
    const mainField = section.fields.find(f => f.id === fieldId);
    if (mainField) return String(mainField.value || '');

    // Check subsection fields
    if (section.subsections) {
      for (const subsection of section.subsections) {
        const subField = subsection.fields.find(f => f.id === fieldId);
        if (subField) return String(subField.value || '');
      }
    }
  }
  return '';
};
```

**Usage in Templates:**

```typescript
export function renderPage54(sections: ReportSection[]): string {
  const comp1Address = getFieldValue(sections, 'comp1-address');
  const comp1SaleDate = getFieldValue(sections, 'comp1-sale-date');

  return `
    <div class="page-sheet" data-page-num="Page 54">
      <h1>Comparable 1</h1>
      <p>Address: ${comp1Address}</p>
      <p>Sale Date: ${comp1SaleDate}</p>
    </div>
  `;
}
```

### 1.4 HTML Boilerplate

**Complete Document Structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Appraisal Report Preview</title>
  <style>
    /* Global styles */
    body { font-family: 'Open Sans', Arial, sans-serif; }
    .page-sheet { width: 8.5in; height: 11in; padding: 0.75in; }

    /* Page-specific styles */
    .page-sheet[data-page-num="Page 54"] { /* specific styles */ }
  </style>
</head>
<body>
  <div class="page-sheet" data-page-num="Page 1">...</div>
  <div class="page-sheet" data-page-num="Page 2">...</div>
  <!-- ... more pages ... -->
</body>
</html>
```

**Key Elements:**
- Full HTML5 document structure
- Page breaks via `.page-sheet` divs
- Page-specific CSS scoping via `data-page-num`
- Inline styles (no external CSS files)

### 1.5 Integration Compatibility Assessment

**Can We Drop In Perfected HTML?** ✅ **YES**

**Reasons:**
1. Template system expects HTML strings
2. CSS scoping pattern matches (`data-page-num="Page 54"`)
3. Field ID pattern compatible (`{{Comp1_Address}}` → `getFieldValue()`)
4. Page dimensions match (8.5in × 11in)
5. No conversion needed

**What Needs Changing:**
- Field IDs: `{{Comp1_Address}}` → Template literal: `${getFieldValue(sections, 'comp1-address')}`
- Toggle functionality: Add JavaScript for `data-sample` attribute switching
- Page function structure: Wrap HTML in `export function renderPageXX()`

---

## PART 2: Field Mapping & Test Data Loading

### 2.1 Field Registry Structure

**Location:** `/src/features/report-builder/schema/fieldRegistry.ts`

**Interface Definition:**

```typescript
export interface FieldDefinition {
  id: string;                    // Canonical field ID (kebab-case)
  storeId: string;               // ID used in store (MUST match exactly)
  label: string;                 // Human-readable label for UI
  section: string;               // Section ID (cover, exec, site, sales, etc.)
  subsection?: string;           // Optional subsection grouping
  type: 'text' | 'number' | 'date' | 'image' | 'textarea' | 'select' | 'currency' | 'percentage' | 'calculated';
  inputSource: 'user-input' | 'calculated' | 'api-fetch' | 'template' | 'auto-filled';
  options?: string[];            // For select fields
  required: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  calculationFormula?: string;   // For calculated fields
  notes?: string;                // Additional context
}
```

**Example Entry:**

```typescript
{
  id: 'comp1-address',
  storeId: 'comp1-address',
  label: 'Comparable 1 Address',
  section: 'sales',
  subsection: 'comp1',
  type: 'text',
  inputSource: 'user-input',
  required: true
}
```

**Current Count:** ~270 fields defined

### 2.2 Test Data Structure

**Location:** `/src/features/report-builder/data/northBattlefordTestData-REAL.ts`

**Format:**

```typescript
export const northBattlefordRealData: Record<string, string | number | string[]> = {
  // Cover section
  'property-name': 'North Battleford Apartments',
  'street-address': '1101, 1121 109 St',
  'city': 'North Battleford',

  // Sales comparables (pattern we need to extend)
  'comp1-name': 'Heritage House',
  'comp1-address': '1551 107 St, North Battleford, SK S9A 2A1',
  'comp1-sale-date': '2024-06-17',
  'comp1-sale-price': 3117383,
  'comp1-units': 24,
  'comp1-price-per-unit': 129891,
  // ... more comp1 fields
};
```

**Section Mapping:**

```typescript
export const fieldToSectionMap: Record<string, string> = {
  'comp1-name': 'sales',
  'comp1-address': 'sales',
  'comp1-sale-date': 'sales',
  // ... maps field IDs to section IDs for loading
};
```

### 2.3 "Load Test Data" Button Mechanism

**Location:** `/src/features/report-builder/store/reportBuilderStore.ts`

**Function:**

```typescript
export function loadNorthBattlefordRealData(
  updateFieldValue: (sectionId: string, fieldId: string, value: any) => void
): { loaded: number; skipped: string[] } {
  let loaded = 0;
  const skipped: string[] = [];

  Object.entries(northBattlefordRealData).forEach(([fieldId, value]) => {
    const sectionId = fieldToSectionMap[fieldId];
    if (sectionId) {
      updateFieldValue(sectionId, fieldId, value);
      loaded++;
    } else {
      skipped.push(fieldId);
    }
  });

  return { loaded, skipped };
}
```

**Process:**
1. Iterate through test data object
2. Look up section ID from field ID
3. Call `updateFieldValue()` to update store
4. Store triggers preview regeneration
5. New values appear in preview instantly

### 2.4 Field ID Naming Conventions

**Current Pattern (Kebab-Case):**

| Template HTML | Field Registry | Test Data | Store ID |
|---------------|----------------|-----------|----------|
| `{{Comp1_Address}}` | `comp1-address` | `comp1-address` | `comp1-address` |
| `{{Comp1_SaleDate}}` | `comp1-sale-date` | `comp1-sale-date` | `comp1-sale-date` |
| `{{Comp1_Buyer}}` | `comp1-buyer` | `comp1-buyer` | `comp1-buyer` |

**Conversion Needed:**
- Template: `{{Comp1_Address}}` (PascalCase with underscores)
- System: `comp1-address` (kebab-case)

**Pattern:** `{{CompN_FieldName}}` → `compN-field-name`

### 2.5 Missing Fields for Comparable Pages

**Estimated Fields Needed:** ~250 new fields (5 comparables × ~50 fields each)

**Field Categories:**

**A. Basic Info (per comparable)**
```typescript
'comp1-name': 'text',
'comp1-address': 'text',
'comp1-city': 'text',
'comp1-province': 'text',
'comp1-postal-code': 'text',
```

**B. Sale Information**
```typescript
'comp1-buyer': 'text',
'comp1-seller': 'text',
'comp1-sale-date': 'date',
'comp1-sale-price': 'currency',
'comp1-terms': 'text',
'comp1-data-source': 'text',
```

**C. Property Details**
```typescript
'comp1-year-built': 'number',
'comp1-building-style': 'text',
'comp1-units': 'number',
'comp1-gba': 'number',
'comp1-nra': 'number',
'comp1-land-area': 'number',
'comp1-parking-spaces': 'number',
'comp1-parking-ratio': 'number',
```

**D. Income Analysis**
```typescript
'comp1-actual-rent': 'currency',
'comp1-market-rent': 'currency',
'comp1-vacancy-rate': 'percentage',
'comp1-expenses': 'currency',
'comp1-noi': 'currency',
'comp1-cap-rate': 'percentage',
```

**E. Valuation Metrics**
```typescript
'comp1-price-per-unit': 'currency',
'comp1-price-per-sf': 'currency',
'comp1-grm': 'number',
```

**F. Qualitative Ratings**
```typescript
'comp1-location-rating': 'select', // options: ['Superior', 'Average', 'Inferior']
'comp1-quality-rating': 'select',
'comp1-condition-rating': 'select',
'comp1-appeal-rating': 'select',
```

**G. Unit Mix**
```typescript
'comp1-unit-type-1': 'text',
'comp1-unit-count-1': 'number',
'comp1-unit-sf-1': 'number',
'comp1-unit-rent-1': 'currency',
// Repeat for 2-4 unit types
```

**H. Visual Assets**
```typescript
'comp1-photo': 'image',
'comp1-map': 'image',
```

**I. Narrative**
```typescript
'comp1-remarks': 'textarea',
'comp1-adjustments-narrative': 'textarea',
```

**Total per Comparable:** ~50 fields × 5 comparables = **250 fields**

---

## PART 3: Toggle Functionality Implementation

### 3.1 Current HTML Pattern (From Perfected Templates)

```html
<span class="field-mapped"
      data-sample="1551-107 St, North Battleford, SK"
      title="{{Comp1_Address}}">
  {{Comp1_Address}}
</span>
```

**Attributes:**
- `class="field-mapped"`: Marks elements for toggle
- `data-sample="..."`: Sample data to show when toggle ON
- `title="{{Comp1_Address}}"`: Tooltip showing field ID
- Inner text: Field ID placeholder

### 3.2 Toggle Logic (JavaScript)

**Approach:** Add toggle button to PreviewPanel that runs JavaScript in iframe

**Implementation:**

```typescript
// In PreviewPanel.tsx
const handleToggleFieldIds = () => {
  const iframe = iframeRef.current;
  const iframeDoc = iframe.contentDocument;

  if (!iframeDoc) return;

  // Get current toggle state
  const isShowingSampleData = iframe.dataset.showSampleData === 'true';

  // Find all field-mapped elements
  const fieldElements = iframeDoc.querySelectorAll('.field-mapped');

  fieldElements.forEach(element => {
    if (isShowingSampleData) {
      // Show field IDs
      element.textContent = element.title; // e.g., "{{Comp1_Address}}"
    } else {
      // Show sample data
      element.textContent = element.dataset.sample || element.title;
    }
  });

  // Toggle state
  iframe.dataset.showSampleData = (!isShowingSampleData).toString();
};
```

**UI Addition:**

```tsx
<Button
  variant="outline"
  size="sm"
  onClick={handleToggleFieldIds}
  title="Toggle between field IDs and sample data"
>
  <Eye className="h-4 w-4 mr-1" />
  Toggle Fields
</Button>
```

### 3.3 Template Generation Strategy

**Option 1: Hybrid Approach (Recommended)**

Keep both `data-sample` and template literal value:

```typescript
export function renderPage54(sections: ReportSection[]): string {
  const comp1Address = getFieldValue(sections, 'comp1-address');

  return `
    <span class="field-mapped"
          data-sample="${comp1Address}"
          title="comp1-address">
      ${comp1Address}
    </span>
  `;
}
```

**Benefits:**
- Shows actual data by default (not field IDs)
- Toggle can show field IDs via title attribute
- Sample data updates when store changes
- No hardcoded sample data

**Option 2: Field ID Mode**

Show field IDs by default, toggle to data:

```typescript
<span class="field-mapped"
      data-field-id="comp1-address"
      data-value="${comp1Address}"
      title="${comp1Address}">
  {{comp1-address}}
</span>
```

**Toggle Logic:**
```javascript
if (showingFieldIds) {
  element.textContent = element.dataset.fieldId;
} else {
  element.textContent = element.dataset.value;
}
```

---

## PART 4: Integration Strategy & Recommendations

### 4.1 Recommended Approach: Gradual Migration

**Phase 1: Proof of Concept (Pages 52-58)**

1. **Add Missing Fields to Registry** (Week 1)
   - Create field definitions for Comp1-5 fields
   - Add to `fieldRegistry.ts` in batches
   - Commit each batch separately

2. **Update Test Data** (Week 1)
   - Add Comp1-5 data to `northBattlefordTestData-REAL.ts`
   - Add field-to-section mappings
   - Test "Load Test Data" button

3. **Convert Template HTML to TypeScript** (Week 2)
   - Create `renderPage52()` through `renderPage58()` functions
   - Convert field IDs: `{{Comp1_Address}}` → `${getFieldValue(sections, 'comp1-address')}`
   - Add to `PAGE_RENDERERS` mapping

4. **Implement Toggle Functionality** (Week 2)
   - Add toggle button to PreviewPanel
   - Implement iframe JavaScript injection
   - Test toggle between field IDs and data

5. **Validate Against Reference PDF** (Week 3)
   - Visual comparison page by page
   - Fix spacing/styling issues
   - Ensure page breaks correct

**Phase 2: Full Report Migration (Pages 1-77)**

1. **Batch Process Remaining Pages**
   - Group by section (Site, Market, HBU, etc.)
   - 10-15 pages per batch
   - Test after each batch

2. **Field Registry Completion**
   - Add all remaining fields (~40 identified in handoff)
   - Validate no missing field errors in console

3. **Performance Testing**
   - Test with full 77-page report
   - Optimize iframe rendering if needed
   - Consider lazy loading for very long reports

4. **Documentation**
   - Update README with new template patterns
   - Document field naming conventions
   - Create migration guide for future pages

### 4.2 Critical Path to Success

**Prerequisites:**
- ✅ Field registry accepts new fields
- ✅ Store handles Comp1-5 field sections
- ✅ Test data includes all comparable fields
- ✅ Template system supports new render functions

**Blockers to Avoid:**
- ❌ Don't modify store structure without understanding impact
- ❌ Don't change field ID naming convention mid-migration
- ❌ Don't skip test data updates (causes "Load Test Data" failures)
- ❌ Don't forget `PAGE_RENDERERS` registration (pages won't render)

**Success Criteria:**
- ✅ All 250+ comparable fields defined in registry
- ✅ Pages 52-58 render without console errors
- ✅ "Load Test Data" populates all comparable fields
- ✅ Toggle button switches between field IDs and data
- ✅ Visual output matches reference PDF

### 4.3 Field Registry Addition Pattern

**Batch Processing Approach:**

**Batch 1: Comp1 Basic Info (10 fields)**
```typescript
// Add to fieldRegistry.ts
{ id: 'comp1-name', storeId: 'comp1-name', label: 'Comparable 1 Name', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
{ id: 'comp1-address', storeId: 'comp1-address', label: 'Comparable 1 Address', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
// ... 8 more
```

Commit: `feat(fields): add Comp1 basic info fields (10)`

**Batch 2: Comp1 Sale Info (7 fields)**
```typescript
{ id: 'comp1-buyer', storeId: 'comp1-buyer', label: 'Comparable 1 Buyer', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
// ... 6 more
```

Commit: `feat(fields): add Comp1 sale information fields (7)`

**Batch 3-10: Repeat for Comp2-5**

**Total Commits:** ~50 (10 batches × 5 comparables)

### 4.4 Test Data Addition Pattern

**Mirror Field Registry Structure:**

```typescript
// Add to northBattlefordTestData-REAL.ts
export const northBattlefordRealData: Record<string, string | number | string[]> = {
  // Existing fields...

  // Comparable 1 - Basic Info
  'comp1-name': 'Heritage House',
  'comp1-address': '1551 107 St, North Battleford, SK S9A 2A1',
  'comp1-city': 'North Battleford',
  'comp1-province': 'SK',
  'comp1-postal-code': 'S9A 2A1',

  // Comparable 1 - Sale Info
  'comp1-buyer': 'Private Investor',
  'comp1-seller': 'Previous Owner Corp',
  'comp1-sale-date': '2024-06-17',
  'comp1-sale-price': 3117383,
  'comp1-terms': 'Cash to Vendor',
  'comp1-data-source': 'MLS Listing',

  // ... continue for all Comp1 fields

  // Comparable 2 - Basic Info
  'comp2-name': 'College View Apartments',
  // ... repeat pattern
};

// Add mappings
export const fieldToSectionMap: Record<string, string> = {
  // Existing mappings...

  // Comparable 1
  'comp1-name': 'sales',
  'comp1-address': 'sales',
  'comp1-city': 'sales',
  // ... all comp1 fields

  // Comparable 2
  'comp2-name': 'sales',
  // ... repeat for comp2-5
};
```

### 4.5 Validation Checklist

**After Each Batch:**
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] No console errors when loading preview
- [ ] "Load Test Data" button works
- [ ] New fields appear in TDD page
- [ ] Fields render in preview (if page implemented)
- [ ] Git commit with clear message

**After Phase 1 Completion:**
- [ ] All 250+ comparable fields in registry
- [ ] All comparable test data present
- [ ] Pages 52-58 render correctly
- [ ] Toggle button functional
- [ ] Visual match to reference PDF
- [ ] No performance issues (iframe loads quickly)

---

## PART 5: Technical Implementation Details

### 5.1 Template Function Structure

**Standard Pattern:**

```typescript
/**
 * Page 54 - Comparable 1 Detail Page
 * 2-column layout with tables (left) and visuals (right)
 */
export function renderPage54(sections: ReportSection[], valueScenarioType: string): string {
  // Extract all field values at top
  const comp1Name = getFieldValue(sections, 'comp1-name');
  const comp1Address = getFieldValue(sections, 'comp1-address');
  const comp1SaleDate = getFieldValue(sections, 'comp1-sale-date');
  const comp1SalePrice = getFieldValue(sections, 'comp1-sale-price');
  // ... all fields used in page

  return `
    <style>
      /* Page-specific CSS scoped to Page 54 */
      .page-sheet[data-page-num="Page 54"] {
        /* styles here */
      }
    </style>

    <div class="page-sheet" data-page-num="Page 54">
      <h1>Valuation & Conclusions</h1>
      <h2>Sales Summary Sheets</h2>
      <h3>${comp1Name}<br><span>Comparable 1</span></h3>

      <div class="content-wrapper">
        <div class="left-column">
          <table class="comp-table">
            <thead>
              <tr><th colspan="2">Sale Information</th></tr>
            </thead>
            <tbody>
              <tr>
                <td class="label">Buyer</td>
                <td>
                  <span class="field-mapped"
                        data-sample="${comp1Buyer}"
                        title="comp1-buyer">
                    ${comp1Buyer}
                  </span>
                </td>
              </tr>
              <!-- More rows -->
            </tbody>
          </table>
        </div>

        <div class="right-column">
          <div class="property-photo">
            ${comp1Photo ? `<img src="${comp1Photo}" alt="${comp1Name}">` : 'Photo placeholder'}
          </div>
        </div>
      </div>
    </div>
  `;
}
```

### 5.2 PAGE_RENDERERS Registration

**Location:** End of `reportHtmlTemplate.ts`

```typescript
export const PAGE_RENDERERS: Record<number, PageRenderer> = {
  // Existing pages
  1: renderPage1,
  2: renderPage2,
  // ...
  51: renderPage51,

  // New comparable pages
  52: renderPage52,  // Comparable Map
  53: renderPage53,  // Comparable Chart
  54: renderPage54,  // Comp 1 Detail
  55: renderPage55,  // Comp 2 Detail
  56: renderPage56,  // Comp 3 Detail
  57: renderPage57,  // Comp 4 Detail
  58: renderPage58,  // Comp 5 Detail

  // Remaining pages
  59: renderPage59,
  // ...
};
```

**CRITICAL:** Missing registration = page won't render

### 5.3 Toggle Button Addition

**Location:** `/src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx`

**Add State:**

```typescript
const [showFieldIds, setShowFieldIds] = useState(false);
```

**Add Button (after export buttons):**

```tsx
<Button
  variant="outline"
  size="sm"
  onClick={handleToggleFieldIds}
  title="Toggle between field IDs and actual data"
>
  <Eye className="h-4 w-4 mr-1" />
  {showFieldIds ? 'Show Data' : 'Show Field IDs'}
</Button>
```

**Add Handler:**

```typescript
const handleToggleFieldIds = () => {
  if (!iframeRef.current?.contentDocument) return;

  const doc = iframeRef.current.contentDocument;
  const fieldElements = doc.querySelectorAll('.field-mapped');
  const newState = !showFieldIds;

  fieldElements.forEach(el => {
    if (newState) {
      // Show field ID
      el.textContent = el.getAttribute('title') || '';
      el.style.backgroundColor = '#fff3cd'; // Highlight for visibility
    } else {
      // Show data value
      el.textContent = el.getAttribute('data-sample') || '';
      el.style.backgroundColor = 'transparent';
    }
  });

  setShowFieldIds(newState);
};
```

### 5.4 CSS Scoping Best Practices

**Always Scope to Page Number:**

```css
/* ✅ GOOD - Scoped */
.page-sheet[data-page-num="Page 54"] .comp-table td {
  padding: 2px 4px;
}

/* ❌ BAD - Global */
.comp-table td {
  padding: 2px 4px;
}
```

**Group Similar Pages:**

```css
/* If pages 54-58 share styles */
.page-sheet[data-page-num="Page 54"] .comp-table,
.page-sheet[data-page-num="Page 55"] .comp-table,
.page-sheet[data-page-num="Page 56"] .comp-table,
.page-sheet[data-page-num="Page 57"] .comp-table,
.page-sheet[data-page-num="Page 58"] .comp-table {
  font-size: 7pt;
  border-collapse: collapse;
}
```

---

## PART 6: Timeline & Effort Estimates

### Conservative Estimates

**Phase 1: Pages 52-58 (Proof of Concept)**

| Task | Est. Hours | Priority |
|------|-----------|----------|
| Field registry additions (250 fields) | 8-10 | P0 |
| Test data additions | 4-6 | P0 |
| Template conversions (7 pages) | 10-12 | P0 |
| Toggle functionality | 3-4 | P1 |
| Testing & validation | 4-6 | P0 |
| Documentation | 2-3 | P2 |
| **TOTAL PHASE 1** | **31-41 hrs** | |

**Phase 2: Remaining Pages (1-51, 59-77)**

| Task | Est. Hours | Priority |
|------|-----------|----------|
| Field registry (40 remaining fields) | 3-4 | P0 |
| Template conversions (70 pages) | 35-40 | P0 |
| Testing per batch | 15-20 | P0 |
| Performance optimization | 4-6 | P1 |
| Final validation | 6-8 | P0 |
| **TOTAL PHASE 2** | **63-78 hrs** | |

**Grand Total:** 94-119 hours (~2.5-3 weeks at full-time pace)

### Realistic Schedule

**Week 1: Field Registry & Data**
- Days 1-2: Add Comp1-2 fields
- Days 3-4: Add Comp3-5 fields
- Day 5: Add remaining 40 fields, test data updates

**Week 2: Template Migration & Toggle**
- Days 1-2: Convert Pages 52-55
- Days 3-4: Convert Pages 56-58, add toggle
- Day 5: Testing & validation

**Week 3: Full Report (if continuing)**
- Days 1-3: Batch convert remaining pages
- Days 4-5: Final testing & documentation

---

## PART 7: Risk Assessment & Mitigation

### High Risks

**Risk 1: Field ID Mismatches**

**Impact:** Fields don't render, "Load Test Data" fails

**Mitigation:**
- Use consistent naming convention (kebab-case)
- Validate field IDs before committing
- Test "Load Test Data" after each batch
- Create field ID validation script

**Risk 2: Store Structure Changes**

**Impact:** Breaking changes to existing functionality

**Mitigation:**
- Don't modify `reportBuilderStore.ts` unless absolutely necessary
- If changes needed, create backup first
- Test all existing pages after store changes
- Document any store modifications

**Risk 3: Performance Degradation**

**Impact:** Slow preview rendering, laggy UI

**Mitigation:**
- Profile iframe rendering performance
- Consider lazy loading for long reports
- Optimize template string concatenation
- Test with full 77-page report

### Medium Risks

**Risk 4: CSS Conflicts**

**Impact:** Styling breaks on other pages

**Mitigation:**
- Always scope CSS to specific pages
- Test multiple pages together
- Use specific selectors (avoid globals)
- Review CSS before committing

**Risk 5: Toggle Complexity**

**Impact:** Toggle doesn't work or breaks rendering

**Mitigation:**
- Start with simple toggle implementation
- Test with small subset of fields first
- Add error handling for missing attributes
- Provide fallback to showing data if toggle fails

### Low Risks

**Risk 6: Field Registry Size**

**Impact:** Large file, hard to maintain

**Mitigation:**
- Consider splitting into multiple files (by section)
- Add comments for field groups
- Keep alphabetical or logical ordering
- Document field naming conventions

---

## PART 8: Success Metrics

### Quantitative Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Field Registry Completeness | 100% | All fields in templates exist in registry |
| Console Errors | 0 | No errors when loading preview |
| Page Render Success | 100% | All pages render without failures |
| Test Data Coverage | 100% | All fields have test data values |
| Performance | <2s | Full report generation time |

### Qualitative Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Visual Accuracy | 95%+ match | Comparison to reference PDF |
| Toggle Usability | Intuitive | User can understand field IDs |
| Code Maintainability | High | New developers can add pages |
| Documentation Quality | Complete | All patterns documented |

### Validation Checklist

**Before Declaring Phase 1 Complete:**

- [ ] All 250+ comparable fields in registry
- [ ] All comparable fields have test data
- [ ] Pages 52-58 render without errors
- [ ] Toggle button switches cleanly between modes
- [ ] Visual output matches reference PDF within 5%
- [ ] No console warnings or errors
- [ ] Performance acceptable (<3s for preview generation)
- [ ] Code reviewed and committed
- [ ] Documentation updated
- [ ] Handoff document created for next session

---

## PART 9: Open Questions & Decisions Needed

### Architecture Decisions

**Q1: Toggle Default State**

Options:
- A) Show actual data by default (recommended)
- B) Show field IDs by default
- C) Remember user preference in localStorage

**Recommendation:** Option A (show data) - more useful for visual validation

---

**Q2: Field ID Tooltip**

Options:
- A) Show field ID in tooltip on hover
- B) Show field ID in toggle mode only
- C) Show field ID in developer mode

**Recommendation:** Option A (tooltip) - non-intrusive, always available

---

**Q3: Field Registry Organization**

Options:
- A) Single file with all fields (current)
- B) Split by section (sales.ts, site.ts, etc.)
- C) Split by field type (text.ts, number.ts, etc.)

**Recommendation:** Option A for now, consider B if >500 fields

---

### Implementation Questions

**Q4: Should toggle affect all pages or just comparable pages?**

**Recommendation:** All pages with `.field-mapped` class for consistency

---

**Q5: What if field value is empty? Show placeholder or hide?**

**Recommendation:** Show empty string, allow toggle to reveal field ID

---

**Q6: Should we validate field IDs at build time?**

**Recommendation:** Yes, create TypeScript script to check template field IDs against registry

---

## PART 10: Next Steps & Action Items

### Immediate Next Actions

**Session 1: Field Registry (Days 1-2)**

1. [ ] Create branch: `feature/comparable-fields-registry`
2. [ ] Add Comp1 fields (50 fields) to `fieldRegistry.ts`
3. [ ] Add Comp1 test data to `northBattlefordTestData-REAL.ts`
4. [ ] Add Comp1 mappings to `fieldToSectionMap`
5. [ ] Test "Load Test Data" button with Comp1
6. [ ] Commit: `feat(fields): add Comparable 1 fields (50)`
7. [ ] Repeat for Comp2-5
8. [ ] Total commits: 5 (one per comparable)

**Session 2: Template Conversion (Days 3-4)**

1. [ ] Create `renderPage54()` in `reportHtmlTemplate.ts`
2. [ ] Convert field IDs to template literals
3. [ ] Add `data-sample` attributes
4. [ ] Register in `PAGE_RENDERERS`
5. [ ] Test page renders
6. [ ] Commit: `feat(page-54): add Comparable 1 detail page`
7. [ ] Repeat for pages 55-58
8. [ ] Total commits: 5-7

**Session 3: Toggle Implementation (Day 5)**

1. [ ] Add toggle button to `PreviewPanel.tsx`
2. [ ] Implement `handleToggleFieldIds` function
3. [ ] Test toggle on pages 54-58
4. [ ] Adjust styling for field ID visibility
5. [ ] Commit: `feat(preview): add field ID toggle functionality`

**Session 4: Validation & Documentation (Day 5)**

1. [ ] Visual comparison pages 54-58 vs reference PDF
2. [ ] Fix spacing/styling issues
3. [ ] Update documentation
4. [ ] Create handoff document
5. [ ] Merge feature branch

### Long-Term Action Items

**Phase 2 Preparation:**

- [ ] Identify all remaining missing fields (40 estimated)
- [ ] Prioritize pages by importance (client-facing first)
- [ ] Create batch groups for remaining pages
- [ ] Plan testing strategy for full report
- [ ] Consider performance optimizations

**Technical Debt:**

- [ ] Create field ID validation script
- [ ] Add TypeScript type checking for field IDs
- [ ] Consider field registry split if it grows too large
- [ ] Document field naming conventions formally
- [ ] Create template generator CLI tool (future)

---

## Appendix A: Key File Locations

### Core Files

| File | Path | Purpose |
|------|------|---------|
| Preview Panel | `/src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx` | Container component |
| Preview Renderer | `/src/features/report-builder/components/PreviewPanel/PreviewRenderer.tsx` | iframe rendering |
| HTML Template | `/src/features/report-builder/templates/reportHtmlTemplate.ts` | Main template file (LARGE) |
| Field Registry | `/src/features/report-builder/schema/fieldRegistry.ts` | Field definitions |
| Test Data | `/src/features/report-builder/data/northBattlefordTestData-REAL.ts` | Sample data |
| Store | `/src/features/report-builder/store/reportBuilderStore.ts` | State management |

### Reference Files

| File | Path | Purpose |
|------|------|---------|
| Perfected Templates | `/docs/15-Contract-review/1-Formatting & Report/Templates & Guides/` | HTML templates |
| Reference PDF | `/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/` | Visual reference |
| Template Usage Guide | `/docs/15-Contract-review/1-Formatting & Report/Templates & Guides/GUIDE-Template-Usage.md` | Best practices |
| Handoff Docs | `/docs/15-Contract-review/1-Formatting & Report/-passover-sessions/` | Session notes |

---

## Appendix B: Field ID Conversion Reference

### Template → System Mapping

| Template HTML | Field Registry | Test Data | Store |
|---------------|----------------|-----------|-------|
| `{{Comp1_Name}}` | `comp1-name` | `comp1-name` | `comp1-name` |
| `{{Comp1_Address}}` | `comp1-address` | `comp1-address` | `comp1-address` |
| `{{Comp1_SaleDate}}` | `comp1-sale-date` | `comp1-sale-date` | `comp1-sale-date` |
| `{{Comp1_SalePrice}}` | `comp1-sale-price` | `comp1-sale-price` | `comp1-sale-price` |
| `{{Comp1_PricePerUnit}}` | `comp1-price-per-unit` | `comp1-price-per-unit` | `comp1-price-per-unit` |

### Conversion Algorithm

```javascript
function convertFieldId(templateId) {
  // Remove {{ and }}
  let cleaned = templateId.replace(/[{}]/g, '');

  // Convert CompN_FieldName → compN-field-name
  return cleaned
    .replace(/([A-Z])/g, '-$1') // Add dash before capitals
    .toLowerCase()              // All lowercase
    .replace(/^-/, '')          // Remove leading dash
    .replace(/_/g, '-');        // Replace underscores with dashes
}

// Examples:
convertFieldId('{{Comp1_Address}}')     // 'comp1-address'
convertFieldId('{{Comp1_SalePrice}}')   // 'comp1-sale-price'
convertFieldId('{{Comp2_PricePerUnit}}') // 'comp2-price-per-unit'
```

---

## Appendix C: Example Field Registry Entries

### Complete Comparable 1 Field Set (Abbreviated)

```typescript
// Basic Info
{ id: 'comp1-name', storeId: 'comp1-name', label: 'Comparable 1 Name', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
{ id: 'comp1-address', storeId: 'comp1-address', label: 'Comparable 1 Address', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
{ id: 'comp1-city', storeId: 'comp1-city', label: 'Comparable 1 City', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },

// Sale Info
{ id: 'comp1-buyer', storeId: 'comp1-buyer', label: 'Comparable 1 Buyer', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
{ id: 'comp1-sale-date', storeId: 'comp1-sale-date', label: 'Comparable 1 Sale Date', section: 'sales', subsection: 'comp1', type: 'date', inputSource: 'user-input', required: true },
{ id: 'comp1-sale-price', storeId: 'comp1-sale-price', label: 'Comparable 1 Sale Price', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'user-input', required: true },

// Property Details
{ id: 'comp1-year-built', storeId: 'comp1-year-built', label: 'Comparable 1 Year Built', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: true },
{ id: 'comp1-units', storeId: 'comp1-units', label: 'Comparable 1 Units', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: true },
{ id: 'comp1-gba', storeId: 'comp1-gba', label: 'Comparable 1 GBA', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: true },

// Ratings
{ id: 'comp1-location-rating', storeId: 'comp1-location-rating', label: 'Comparable 1 Location Rating', section: 'sales', subsection: 'comp1', type: 'select', options: ['Superior', 'Average', 'Inferior'], inputSource: 'user-input', required: true },
{ id: 'comp1-quality-rating', storeId: 'comp1-quality-rating', label: 'Comparable 1 Quality Rating', section: 'sales', subsection: 'comp1', type: 'select', options: ['Superior', 'Average', 'Inferior'], inputSource: 'user-input', required: true },

// Images
{ id: 'comp1-photo', storeId: 'comp1-photo', label: 'Comparable 1 Photo', section: 'sales', subsection: 'comp1', type: 'image', inputSource: 'user-input', required: false },
{ id: 'comp1-map', storeId: 'comp1-map', label: 'Comparable 1 Map', section: 'sales', subsection: 'comp1', type: 'image', inputSource: 'user-input', required: false },

// Narrative
{ id: 'comp1-remarks', storeId: 'comp1-remarks', label: 'Comparable 1 Remarks', section: 'sales', subsection: 'comp1', type: 'textarea', inputSource: 'user-input', required: false },
```

---

## Conclusion

### Key Takeaways

1. **Current system is fully compatible** with perfected HTML templates
2. **No architectural changes needed** - pure HTML string templates work
3. **Toggle functionality is straightforward** - JavaScript in iframe + data attributes
4. **~250 new fields required** for comparable pages (manageable)
5. **Gradual migration recommended** - proof of concept first (pages 52-58)
6. **3-week effort estimate** for full integration (conservative)

### Decision: Proceed with Integration

**Recommended:** ✅ **YES - Proceed with Phase 1 (Pages 52-58)**

**Rationale:**
- Low risk (no breaking changes to existing system)
- High value (perfect formatting, toggle functionality)
- Incremental approach (can stop after proof of concept)
- Clear success criteria (visual match to reference PDF)
- Existing template patterns proven to work

### Contact for Questions

**File Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/REPORT-Preview-Architecture-Analysis.md`

**Author:** Claude Code (APR Fullstack Developer Agent)
**Date:** December 17, 2025
**Version:** 1.0

---

**END OF REPORT**
