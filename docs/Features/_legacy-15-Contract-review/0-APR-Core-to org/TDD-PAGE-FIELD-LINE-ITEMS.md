# TDD Page Field Line Items - Data Source Explanation

**Date:** January 3, 2026  
**Purpose:** Clarify what each column in the TDD page field table represents and where the data comes from  
**Status:** ✅ Complete

---

## Table Structure

Each field on the TDD page displays as a table row with **4 columns**:

| Column | Display | Data Source |
|--------|--------|-------------|
| **Field ID** | `field.storeId` | `fieldRegistry.ts` |
| **Label** | `field.label` | `fieldRegistry.ts` |
| **Value** | Input field or display | `reportBuilderStore` (sections) OR `localValues` |
| **Status** | Badge (Mapped/Empty/Missing) | Calculated from store value |

---

## Column 1: Field ID

### What It Shows
The **canonical field ID** used throughout the system (kebab-case format).

**Example:** `client-first-name`, `property-type`, `calc-type1-count`

### Data Source
**File:** `src/features/report-builder/schema/fieldRegistry.ts`  
**Property:** `field.storeId`

**Code Reference:**
```1022:1022:src/features/test-input/TestInputDashboard.tsx
                                                        <td className="px-2 py-1.5 text-xs font-mono w-48" style={{ color: '#9ca3af' }}>{field.storeId}</td>
```

### Where It Comes From
1. TDD page imports `fieldRegistry` from `fieldRegistry.ts`
2. Iterates through all fields in `fieldRegistry`
3. Displays `field.storeId` in monospace font (gray color)

**Important:** This is the **same ID** used in:
- Template placeholders: `{{field-id}}`
- Store field IDs: `sections[].fields[].id`
- Test data mappings

---

## Column 2: Label

### What It Shows
The **human-readable label** for the field (what users see in the UI).

**Example:** `Client First Name`, `Property Type`, `Unit Type 1 Count`

### Data Source
**File:** `src/features/report-builder/schema/fieldRegistry.ts`  
**Property:** `field.label`

**Code Reference:**
```1023:1023:src/features/test-input/TestInputDashboard.tsx
                                                        <td className="px-2 py-1.5 text-sm text-white">{field.label}</td>
```

### Where It Comes From
1. Same `fieldRegistry` import
2. Displays `field.label` property
3. Used for UI display only (not for data storage/retrieval)

**Example from fieldRegistry:**
```typescript
{
  id: 'client-first-name',
  storeId: 'client-first-name',
  label: 'Client First Name',  // ← This is what shows in Label column
  section: 'client-intake',
  // ...
}
```

---

## Column 3: Value

### What It Shows
The **current value** stored for this field. Can be:
- An input field (editable)
- A read-only display (for calculated fields or legacy fields)
- Empty (if no value set)

**Example:** `"John"`, `"Multi-Family"`, `24`, `""` (empty)

### Data Source
**Priority Order:**
1. **`localValues[field.storeId]`** - Local state (if user just typed)
2. **`reportBuilderStore.sections[].fields[].value`** - Store value (persisted)

**Code Reference:**
```380:384:src/features/test-input/TestInputDashboard.tsx
  const getCurrentValue = (field: FieldDefinition): any => {
    if (localValues[field.storeId] !== undefined) {
      return localValues[field.storeId];
    }
    return getStoreValue(field.storeId) || '';
  };
```

**Store Value Lookup:**
```196:210:src/features/test-input/TestInputDashboard.tsx
  const getStoreValue = (storeId: string): any => {
    for (const section of sections) {
      // Check section fields
      for (const field of section.fields) {
        if (field.id === storeId) return field.value;
      }
      // Check subsection fields
      for (const subsection of section.subsections || []) {
        for (const field of subsection.fields) {
          if (field.id === storeId) return field.value;
        }
      }
    }
    return undefined;
  };
```

### Where It Comes From

**Initial Values:**
- Empty fields: `''` (empty string) or `undefined`
- Test data: From `northBattlefordTestData.ts` when "Test Report" or "Designer Mode" buttons are clicked
- User input: When user types in the input field

**Update Flow:**
1. User types in input → Updates `localValues[field.storeId]`
2. `handleFieldChange()` called → Updates `reportBuilderStore` via `updateFieldValue()`
3. Store persists value → Available across page navigation

**Code Reference:**
```370:373:src/features/test-input/TestInputDashboard.tsx
  const handleFieldChange = (field: FieldDefinition, value: any) => {
    setLocalValues(prev => ({ ...prev, [field.storeId]: value }));
    updateFieldValue(field.storeId, value);
  };
```

---

## Column 4: Status

### What It Shows
A **colored badge** indicating the field's data status:

| Badge | Color | Meaning |
|-------|-------|---------|
| **Mapped** | 🟢 Green | Field has a value (not empty, not null) |
| **Empty** | 🟡 Yellow | Field exists but is empty string or empty array |
| **Missing** | 🔴 Red | Field value is `undefined` or `null` |

### Data Source
**Calculated** from the store value using `getFieldStatus()` function.

**Code Reference:**
```212:233:src/features/test-input/TestInputDashboard.tsx
  const getFieldStatus = (field: FieldDefinition): FieldStatusInfo => {
    const storeValue = getStoreValue(field.storeId);

    // Missing: undefined or null
    if (storeValue === undefined || storeValue === null) {
      return { field, status: 'missing', storeValue: undefined };
    }

    // Empty strings are truly empty
    if (typeof storeValue === 'string' && storeValue.trim() === '') {
      return { field, status: 'empty', storeValue };
    }

    // Empty arrays are empty
    if (Array.isArray(storeValue) && storeValue.length === 0) {
      return { field, status: 'empty', storeValue };
    }

    // Everything else (including 0) is mapped
    return { field, status: 'mapped', storeValue };
  };
```

**Badge Rendering:**
```634:643:src/features/test-input/TestInputDashboard.tsx
  const renderStatusBadge = (status: FieldStatus) => {
    switch (status) {
      case 'mapped':
        return <Badge className="bg-green-500 text-white text-xs">Mapped</Badge>;
      case 'empty':
        return <Badge className="bg-yellow-500 text-white text-xs">Empty</Badge>;
      case 'missing':
        return <Badge className="bg-red-500 text-white text-xs">Missing</Badge>;
    }
  };
```

### Status Logic

**Mapped (Green):**
- Has a non-empty value
- Includes `0` (zero is considered a valid value)
- Includes `false` (boolean false is considered a valid value)
- Non-empty arrays: `[1, 2, 3]` → Mapped
- Non-empty strings: `"Hello"` → Mapped

**Empty (Yellow):**
- Empty string: `""` → Empty
- Whitespace-only string: `"   "` → Empty (trimmed)
- Empty array: `[]` → Empty

**Missing (Red):**
- `undefined` → Missing
- `null` → Missing

---

## Complete Data Flow

### Initial Load
```
1. TDD Page mounts
   ↓
2. Checks if store.sections is empty
   ↓
3. If empty → calls initializeMockData()
   ↓
4. initializeMockData() builds sections from fieldRegistry
   ↓
5. All fields start with defaultValue or '' (empty)
   ↓
6. Status = "Empty" or "Missing" for most fields
```

### After Loading Test Data
```
1. User clicks "Test Report" or "Designer Mode"
   ↓
2. loadDataSet1All() or loadDataSet1User() called
   ↓
3. Test data from northBattlefordTestData.ts loaded into store
   ↓
4. Store values updated: sections[].fields[].value = testData[fieldId]
   ↓
5. getFieldStatus() recalculates status
   ↓
6. Status badges update: "Mapped" (green) for fields with test data
```

### User Editing
```
1. User types in input field
   ↓
2. handleFieldChange(field, newValue) called
   ↓
3. Updates localValues[field.storeId] = newValue (immediate UI update)
   ↓
4. Updates store via updateFieldValue(field.storeId, newValue)
   ↓
5. Store persists value
   ↓
6. Status badge updates to "Mapped" (green)
```

---

## Table Rendering Code

**Location:** `src/features/test-input/TestInputDashboard.tsx` lines 1016-1030

**Code Reference:**
```1016:1030:src/features/test-input/TestInputDashboard.tsx
                                              <table className="w-full text-sm">
                                                <tbody>
                                                  {userInputFields.map(field => {
                                                    const statusInfo = getFieldStatus(field);
                                                    return (
                                                      <tr key={field.id} className="border-b hover:bg-[#333333]" style={{ borderColor: '#4b5563' }}>
                                                        <td className="px-2 py-1.5 text-xs font-mono w-48" style={{ color: '#9ca3af' }}>{field.storeId}</td>
                                                        <td className="px-2 py-1.5 text-sm text-white">{field.label}</td>
                                                        <td className="px-2 py-1.5">{renderInput(field, statusInfo)}</td>
                                                        <td className="px-2 py-1.5 w-20">{renderStatusBadge(statusInfo.status)}</td>
                                                      </tr>
                                                    );
                                                  })}
                                                </tbody>
                                              </table>
```

**What Happens:**
1. `userInputFields` is filtered from `fieldRegistry` (only `inputSource === 'user-input'`)
2. For each field, `getFieldStatus(field)` calculates status
3. `renderInput()` creates the input field or display
4. `renderStatusBadge()` creates the colored badge
5. All 4 columns rendered in table row

---

## Summary

| Column | Source | Purpose |
|--------|--------|---------|
| **Field ID** | `fieldRegistry[].storeId` | Unique identifier for the field |
| **Label** | `fieldRegistry[].label` | Human-readable name |
| **Value** | `reportBuilderStore.sections[].fields[].value` OR `localValues[storeId]` | Current stored value |
| **Status** | Calculated from Value | Visual indicator of data presence |

**Key Insight:** The TDD page is a **data entry interface** that:
- Shows all fields from `fieldRegistry`
- Displays current values from `reportBuilderStore`
- Allows editing values (which update the store)
- Shows status badges to quickly identify which fields have data

---

*Document created: January 3, 2026*  
*Last updated: January 3, 2026*

