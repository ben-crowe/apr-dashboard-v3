# SOP: Adding Report Fields

> **Purpose:** Step-by-step procedure for adding new fields to the Report Builder
> **Applies to:** Any field addition or modification

---

## Pre-Flight Checklist

Before adding a field, confirm:
- [ ] Field ID follows naming convention (kebab-case, section prefix if needed)
- [ ] Field doesn't already exist (check fieldRegistry.ts)
- [ ] You know which section/subsection it belongs to
- [ ] You understand the field type and input source

---

## The 4-File Sync Rule

**You MUST update all 4 files when adding a field:**

1. `src/features/report-builder/schema/fieldRegistry.ts`
2. `src/features/report-builder/data/TestDataSet1.ts`
3. `public/Report-MF-template.html`
4. `src/features/report-builder/components/EditPanel/EditPanel.tsx` (if visible in editor)

---

## Step 1: Add to Field Registry

**File:** `src/features/report-builder/schema/fieldRegistry.ts`

```typescript
{
  id: 'your-field-id',
  storeId: 'your-field-id',  // Must match id
  label: 'Your Field Label',
  section: 'section-id',      // e.g., 'exec', 'site', 'impv'
  subsection: 'subsection-id', // Optional
  type: 'text',               // text, number, textarea, date, image, etc.
  inputSource: 'user-input',  // user-input, calculated, auto-filled
  required: false,
  defaultValue: '',           // Optional
  placeholder: '',            // Optional
}
```

**Location:** Add to the appropriate section group in the file.

---

## Step 2: Add to Test Data

**File:** `src/features/report-builder/data/TestDataSet1.ts`

```typescript
{
  fieldId: 'your-field-id',
  value: 'Test value for the field',
}
```

**Note:** Add in the section-appropriate location within the test data array.

---

## Step 3: Add to HTML Template

**File:** `public/Report-MF-template.html`

For text fields:
```html
<span class="field-mapped">{{your-field-id}}</span>
```

For image fields:
```html
<div class="img-placeholder">
  <img src="{{your-field-id}}"
       style="width:100%; height:100%; object-fit:cover;"
       onerror="this.style.display='none';" />
</div>
```

**Warning:** Images MUST use `<img src="{{field-id}}">`, NOT `{{field-id}}` as text content.

---

## Step 4: Add to Editor Layout (If Applicable)

**File:** `src/features/report-builder/components/EditPanel/EditPanel.tsx`

Add to the appropriate section's layout array:

```typescript
const SECTION_FIELD_LAYOUT = {
  'your-section': [
    { fields: ['existing-field', 'your-field-id'], widths: ['50%', '50%'] },
  ],
};
```

For image fields, add to `SECTION_IMAGE_MAPPING`:

```typescript
const SECTION_IMAGE_MAPPING = {
  'your-section': ['your-image-field-id'],
};
```

---

## Step 5: Handle Field ID Mapping (If Needed)

If test data uses a different ID than the store:

**File:** `src/features/report-builder/store/reportBuilderStore.ts`

Add to `testDataFieldMapping`:
```typescript
export const testDataFieldMapping: Record<string, string> = {
  // ...existing mappings
  'test-data-id': 'store-field-id',
};
```

---

## Step 6: Verify

1. Run the app: `npm run dev`
2. Navigate to `/test-input`
3. Click "Load Data"
4. Check that your field:
   - Appears in the store (use React DevTools)
   - Renders in preview (if in template)
   - Shows in editor (if added to EditPanel)

---

## Common Mistakes to Avoid

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Mismatched field ID across files | Field won't populate | Ensure exact match in all 4 files |
| Image as text placeholder | Shows path, not image | Use `<img src="{{field-id}}">` |
| Missing from TestDataSet1 | No test value | Add entry to test data |
| Wrong section/subsection | Field appears in wrong place | Check registry section values |

---

## Field Naming Conventions

- Use kebab-case: `client-first-name` not `clientFirstName`
- Section prefixes where helpful: `calc-`, `impv-`, `ia-`, `sca-`
- Numbered for arrays: `comp-1-price`, `comp-2-price`
- Be descriptive: `assessed-value-total` not `avt`

**Reference:** `docs/15-Contract-review/0-APR-Domain-Core-Mgt/FIELD-NAMING-CONVENTION-CLEAN.md`

---

## After Adding Fields

- [ ] Commit your changes (all 4 files together)
- [ ] Update field counts in registry header comment if significant
- [ ] Note in session log if it's a major addition

---

*This procedure prevents the most common field-related bugs.*
