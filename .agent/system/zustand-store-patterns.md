# Zustand Store Patterns

> **Read time:** 2 minutes
> **Purpose:** Understand state management in Report Builder

---

## Store Location

**File:** `src/features/report-builder/store/reportBuilderStore.ts`
**Size:** ~6,340 lines (large, handles all report state)

---

## Store Structure

```typescript
interface ReportBuilderState {
  // Core data
  sections: ReportSection[];        // All field data by section
  sectionGroups: SectionGroup[];    // UI groupings for navigation

  // UI state
  activeSection: string;            // Currently selected section
  showRawIds: boolean;              // Toggle: show field IDs vs values
  activeTestMode: TestMode;         // 'user-input' | 'test-report'

  // Preview
  previewHtml: string;              // Rendered HTML for preview panel
  previewTemplate: string;          // Raw template HTML

  // Actions (see below)
}
```

---

## Section Structure

```typescript
sections: [
  {
    id: 'client-intake',
    name: 'Section 1: Client Intake',
    shortName: 'S1 - INTAKE',
    fields: [],  // Top-level fields (usually empty)
    subsections: [
      {
        id: 'client-info-intake',
        title: 'CLIENT INFORMATION',
        fields: [
          { id: 'client-first-name', value: 'Kenneth', label: '...', type: 'text' },
          { id: 'client-last-name', value: 'Engler', label: '...', type: 'text' },
        ]
      }
    ]
  }
]
```

---

## Key Store Actions

| Action | Purpose |
|--------|---------|
| `initializeMockData()` | Build sections from registry |
| `loadDataSet1User()` | Load test data, run calc engine |
| `generatePreview()` | Regenerate previewHtml |
| `updateFieldValue(id, value)` | Update single field |
| `setActiveSection(id)` | Change editor section |
| `runCalculations()` | Execute calculation engine |

---

## Common Patterns

### Getting Store State

```typescript
import { useReportBuilderStore } from '../store/reportBuilderStore';

// In component
const sections = useReportBuilderStore(state => state.sections);
const updateField = useReportBuilderStore(state => state.updateFieldValue);
```

### Finding a Field

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

### Updating a Field

```typescript
// Simple update
updateFieldValue('client-first-name', 'John');

// Update without regenerating preview
updateFieldValue('client-first-name', 'John', false);
```

---

## Calculation Engine

Three separate calculation modules:
- `runSalesCompCalculations()` - Sales comparison approach
- `runCostApproachCalculations()` - Cost approach
- `runIncomeApproachCalculations()` - Income approach (in main store)

**Flow:**
```
User inputs (user-input fields)
       |
       v
  Calc Engine
       |
       v
Calculated fields updated
       |
       v
Preview regenerated
```

---

## Template Interpolation

The `interpolateTemplate()` function:
1. Builds fieldMap from all sections
2. Replaces `{{field-id}}` placeholders with values
3. Returns interpolated HTML for preview

---

## File References

| Related File | Purpose |
|--------------|---------|
| `salesCompCalculations.ts` | Sales comp calculations |
| `costApproachCalculations.ts` | Cost approach calculations |
| `reportBuilder.types.ts` | TypeScript interfaces |

---

*For complete store documentation, see `docs/bc research & notes/TDD-PAGE-ARCHITECTURE.md`*
