# TDD Stats Bug Analysis - 0 Mapped Inputs

**Issue:** TDD page stats show `Mapped Inputs: 0` even though `loadDataSet1User()` loads 1,606 fields.

**Root Cause:** Field ID mismatch between template placeholders and store field IDs.

---

## The Problem

### Stats Calculation Logic
**File:** `src/features/test-input/TestInputDashboard.tsx` (lines 528-560)

1. **Extracts template placeholders:** `{{field-id}}` → `templateFieldIds` array
   - Example: `{{calc-unit-1-type}}` → `"calc-unit-1-type"`

2. **Builds store values map:** Uses `field.id` from sections
   - Example: Store has field with `id: "calc-type1-name"`

3. **Checks if template IDs exist in store:**
   ```typescript
   templateFieldIds.forEach((fieldId) => {
     if (!storeValues.has(fieldId)) {  // ❌ Mismatch!
       missing++;
     }
   });
   ```

### Field ID Mapping Issue
**File:** `src/features/report-builder/store/reportBuilderStore.ts` (lines 16-158)

`testDataFieldMapping` maps test data IDs to store IDs:
```typescript
const testDataFieldMapping: Record<string, string> = {
  "calc-unit-1-type": "calc-type1-name",  // ❌ Template uses "calc-unit-1-type"
  "calc-unit-1-count": "calc-type1-count", // But store uses "calc-type1-name"
  // ... 50+ more mappings
};
```

### What Happens

1. **Template has:** `{{calc-unit-1-type}}`
2. **TestDataSet1 has:** `"calc-unit-1-type": "2 Bedroom"`
3. **loadDataSet1User() maps:** `"calc-unit-1-type"` → `"calc-type1-name"` (via `testDataFieldMapping`)
4. **Updates store field:** `field.id = "calc-type1-name"` with value `"2 Bedroom"`
5. **Stats check:** Looks for `"calc-unit-1-type"` in `storeValues`
6. **Result:** `storeValues.has("calc-unit-1-type")` = `false` ❌
7. **Stats show:** Missing (should be Mapped)

---

## The Fix

### Option 1: Map Template IDs to Store IDs in Stats (Recommended)

Update stats calculation to resolve template IDs to store IDs:

```typescript
// In TestInputDashboard.tsx stats calculation
import { testDataFieldMapping } from '../report-builder/store/reportBuilderStore';

templateFieldIds.forEach((templateFieldId) => {
  // Resolve template ID to store ID
  const storeFieldId = testDataFieldMapping[templateFieldId] || templateFieldId;
  
  if (!storeValues.has(storeFieldId)) {
    missing++;
  } else {
    const value = storeValues.get(storeFieldId);
    if (value !== undefined && value !== null && value !== "") {
      mapped++;
    } else {
      empty++;
    }
  }
});
```

### Option 2: Use Registry to Resolve IDs

Use `fieldRegistry` to find the `storeId` for each template field ID:

```typescript
templateFieldIds.forEach((templateFieldId) => {
  // Find field in registry
  const fieldDef = fieldRegistry.find(
    f => f.id === templateFieldId || f.storeId === templateFieldId
  );
  
  const storeFieldId = fieldDef?.storeId || templateFieldId;
  
  if (!storeValues.has(storeFieldId)) {
    missing++;
  } else {
    // ... check value
  }
});
```

### Option 3: Export testDataFieldMapping

Make `testDataFieldMapping` exportable from `reportBuilderStore.ts`:

```typescript
// In reportBuilderStore.ts
export const testDataFieldMapping: Record<string, string> = {
  // ... existing mappings
};
```

Then import in `TestInputDashboard.tsx` and use Option 1.

---

## Why This Wasn't Caught Earlier

1. **Stats were recently changed** to measure template coverage (commit `b38dc28`)
2. **Previous stats** measured registry coverage, not template coverage
3. **Field ID mapping** (`testDataFieldMapping`) was added for test data loading but stats weren't updated to account for it
4. **No validation** that template IDs match store IDs

---

## Verification Steps

After fix:
1. Click "Report DataSet1" button
2. Check stats:
   - Should show `Mapped Inputs: > 0` (not 0)
   - Should show `Missing: < 1247` (not 1247)
   - Coverage should be `> 0%` (not 0%)
3. Navigate to "View Report"
4. Verify fields populate correctly in template

---

## Related Files

- `src/features/test-input/TestInputDashboard.tsx` - Stats calculation (lines 513-560)
- `src/features/report-builder/store/reportBuilderStore.ts` - Field ID mapping (lines 16-158)
- `src/features/report-builder/store/reportBuilderStore.ts` - loadDataSet1User() (lines 7170-7326)


