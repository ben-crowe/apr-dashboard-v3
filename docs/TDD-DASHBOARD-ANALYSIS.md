# TDD Dashboard Analysis

**Date:** 2025-12-23  
**Purpose:** Identify tabs to remove and test data loading issues

---

## 🔴 Issue 1: Tabs That Should Be Removed from TDD

**Criteria:** TDD should only show tabs with **human input fields** (user-input, image uploads).  
**Remove:** Tabs that contain ONLY calculated/generated fields.

### Current Hidden Sections (Already Hidden)
```typescript
const hiddenSections = ['maps', 'photos', 'cost-s', 'sales', 'income'];
```

### Analysis: Sections with Calculated Fields

**Sections that may need hiding:**
- Most sections have a mix of user-input and calculated fields
- Need to check each section individually

**Recommendation:** Review sections that are primarily calculated outputs:
- Sections with mostly `inputSource: 'calculated'` should be hidden
- Sections with mostly `inputSource: 'auto-filled'` should be hidden
- Only show sections with `inputSource: 'user-input'` or `inputSource: 'template'`

---

## 🔴 Issue 2: Test Data Field ID Mismatch

### Problem Identified

**IMAGE-MANIFEST.json** uses different field ID format than **fieldRegistry**:

| IMAGE-MANIFEST.json | fieldRegistry / Test Data | Status |
|---------------------|---------------------------|--------|
| `subject-photo-01` | `subject-photo-1` | ❌ MISMATCH |
| `subject-photo-02` | `subject-photo-2` | ❌ MISMATCH |
| `subject-photo-10` | `subject-photo-10` | ✅ MATCH |
| `cover-photo` | `cover-photo` | ✅ MATCH |
| `company-logo` | `company-logo` | ✅ MATCH |
| `map-regional` | `map-regional` | ✅ MATCH |

### Root Cause

**IMAGE-MANIFEST.json** format:
```json
{
  "subject-photo-01": "extracted-images/image12.jpeg",
  "subject-photo-02": "extracted-images/image13.jpeg",
  ...
}
```

**fieldRegistry** expects:
```typescript
{ id: 'subject-photo-1', storeId: 'subject-photo-1', ... }
{ id: 'subject-photo-2', storeId: 'subject-photo-2', ... }
```

**Test Data** uses:
```typescript
"subject-photo-1": "/extracted-images/image12.jpeg",
"subject-photo-2": "/extracted-images/image13.jpeg",
```

### How Test Data Loading Works

**Location:** `src/features/report-builder/store/reportBuilderStore.ts`  
**Function:** `loadFullTestData()` (line 5975)

**Process:**
1. Iterates through `northBattlefordTestData` object
2. For each `[fieldId, value]` pair:
   - Checks `testDataFieldMapping` for ID translation
   - Calls `fieldExists(storeFieldId)` to verify field exists in store
   - If exists: calls `updateFieldValue(storeFieldId, value)`
   - If not: adds to `unmappedFields` array

**Key Code:**
```typescript
Object.entries(northBattlefordTestData).forEach(([fieldId, value]) => {
  const storeFieldId = testDataFieldMapping[fieldId] || fieldId;
  
  if (fieldExists(storeFieldId)) {
    get().updateFieldValue(storeFieldId, value);
    mappedCount++;
  } else {
    unmappedFields.push(fieldId);
  }
});
```

### Why Images Don't Load

**Problem:** IMAGE-MANIFEST.json uses `subject-photo-01` format, but:
1. Test data (`northBattlefordTestData.ts`) uses `subject-photo-1` format ✅
2. Registry expects `subject-photo-1` format ✅
3. **BUT:** If test data was populated from IMAGE-MANIFEST.json, it might have wrong IDs

**Solution Options:**

**Option 1:** Update IMAGE-MANIFEST.json to match registry format
- Change `subject-photo-01` → `subject-photo-1`
- Change `subject-photo-02` → `subject-photo-2`
- etc.

**Option 2:** Add mapping in `testDataFieldMapping`
```typescript
const testDataFieldMapping: Record<string, string> = {
  // ... existing mappings ...
  "subject-photo-01": "subject-photo-1",
  "subject-photo-02": "subject-photo-2",
  "subject-photo-03": "subject-photo-3",
  // ... etc for 01-09 ...
};
```

**Option 3:** Update test data generation script to normalize IDs
- When reading IMAGE-MANIFEST.json, convert `-01` → `-1` format

### Image Path Format Issue

**IMAGE-MANIFEST.json:**
```json
"cover-photo": "extracted-images/image2.jpeg"
```

**Test Data:**
```typescript
"cover-photo": "/extracted-images/image2.jpeg"
```

**Difference:** Test data has leading `/`, manifest doesn't.

**Impact:** Paths might not resolve correctly if app expects `/extracted-images/` format.

---

## 📋 Action Items

### 1. Identify Tabs to Hide
- [ ] Review each section's `inputSource` breakdown
- [ ] Hide sections with 0 user-input fields
- [ ] Update `hiddenSections` array in `TestInputDashboard.tsx`

### 2. Fix Image Field ID Mismatch
- [ ] Decide on approach (update manifest vs add mapping)
- [ ] Update IMAGE-MANIFEST.json OR add mappings
- [ ] Verify test data uses correct field IDs
- [ ] Test image loading

### 3. Fix Image Path Format
- [ ] Standardize on `/extracted-images/` format (with leading slash)
- [ ] Update IMAGE-MANIFEST.json paths OR update test data paths
- [ ] Verify paths resolve correctly in app

---

## 🔍 Field ID Comparison

### Image Fields in Registry
- `subject-photo-1` through `subject-photo-25` ✅
- `cover-photo` ✅
- `company-logo` ✅
- `map-regional`, `map-aerial`, `map-local` ✅
- `comp1-photo` through `comp5-photo` ✅
- `rental-comp1-photo`, `rental-comp2-photo` ✅

### Image Fields in IMAGE-MANIFEST.json
- `subject-photo-01` through `subject-photo-24` ❌ (should be `-1` through `-24`)
- `cover-photo` ✅
- `company-logo` ✅
- `map-regional`, `map-aerial`, `map-local` ✅
- `comp1-photo` through `comp3-photo` ✅
- `rental-comp1-photo`, `rental-comp2-photo` ✅

---

## 💡 Recommendations

1. **Standardize field IDs:** Update IMAGE-MANIFEST.json to use `-1` format (no leading zeros)
2. **Add ID normalization:** When loading from manifest, normalize `-01` → `-1`
3. **Update test data:** Ensure all image paths use `/extracted-images/` format
4. **Add validation:** Log warnings when field IDs don't match registry

