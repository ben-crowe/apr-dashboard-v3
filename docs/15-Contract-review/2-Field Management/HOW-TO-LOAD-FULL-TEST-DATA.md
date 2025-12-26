# How to Load Full Test Data into Report Preview

**Date:** 2025-12-24  
**Purpose:** Step-by-step guide to load test data and view fully populated report

---

## 🎯 Goal

Load all test data from `northBattlefordTestData.ts` into the store and view the fully populated report in the Report Builder preview panel.

---

## 📋 Step-by-Step Process

### **Method 1: Load from TDD Dashboard (Recommended)**

1. **Navigate to TDD Dashboard**
   - URL: `http://localhost:8087/test-input`
   - You should see the "TEST DATA INPUT DASHBOARD" page

2. **Click "Load Test Data" Button**
   - Location: Top action bar (green button with Database icon)
   - Tooltip: "Full Test Mode: Load ALL values from test data (including calculated) - Full mapping test"
   - **What happens:**
     - Loads all 1,865 fields from `northBattlefordTestData.ts`
     - Maps field IDs to store field IDs
     - Updates store with all values
     - Runs `runCalculations()` to compute calculated fields
     - Generates preview HTML with interpolated values
     - Sets `previewHtml` in Zustand store

3. **Verify Data Loaded**
   - Check stats bar: Coverage should show ~80% (692/868 fields mapped)
   - Check console logs: Should see "Test data loaded: X/1865 fields mapped"

4. **Navigate to Report Builder**
   - Click "Preview in Builder" button (gray button with ExternalLink icon)
   - OR manually navigate to: `http://localhost:8087/mock-builder`
   - **What happens:**
     - Zustand store state is preserved (data persists across navigation)
     - Report Builder loads with existing `previewHtml` in store
     - PreviewPanel component watches `previewHtml` and injects into iframe

5. **View Report Preview**
   - The right panel should show the report preview
   - If preview is blank, check browser console for errors
   - Template file: `/Report-MF-template.html` (loaded from `public/` folder)

---

### **Method 2: Load from Report Builder**

1. **Navigate to Report Builder First**
   - URL: `http://localhost:8087/mock-builder`
   - OR click "Preview in Builder" from TDD Dashboard

2. **Click "Load Test Data" Button**
   - Location: Top header bar (next to "Refresh" button)
   - Blue border button with Database icon
   - Tooltip: "Load all test data - Full mapping test mode"
   - **What happens:**
     - Same as Method 1, Step 2
     - Preview should update automatically after loading

3. **View Report Preview**
   - Preview panel should show populated report
   - All `{{field-id}}` placeholders replaced with actual values

---

## 🔍 Technical Flow

```
User clicks "Load Test Data"
    ↓
loadFullTestData() called
    ↓
1. Load all fields from northBattlefordTestData.ts
   - Maps field IDs using testDataFieldMapping
   - Updates store via updateFieldValue()
   - Counts mapped vs unmapped fields
    ↓
2. Run calculations
   - runCalculations() computes all calculated fields
   - Updates NOI, Indicated Value, etc.
    ↓
3. Load template file
   - loadPreviewTemplate() fetches /Report-MF-template.html
   - Caches template in store (previewTemplate)
    ↓
4. Interpolate template
   - interpolateTemplate() replaces {{field-id}} with values
   - Builds field value map from all sections
   - Replaces all placeholders in template HTML
    ↓
5. Set preview HTML
   - set({ previewHtml: html })
   - Triggers PreviewPanel useEffect
    ↓
6. Inject into iframe
   - PreviewPanel watches previewHtml
   - Extracts .page-sheet divs from HTML
   - Injects into #pages-wrapper in preview-wrapper.html
    ↓
Report displays in preview panel
```

---

## ⚠️ Troubleshooting

### **Preview is Blank**

1. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for:
     - `Failed to load template: ...`
     - `pages-wrapper not found`
     - `TypeError: images.map is not a function`

2. **Verify Template File Exists**
   - File should be at: `public/Report-MF-template.html`
   - Check: `ls -lh public/Report-MF-template.html`

3. **Check Preview HTML Generation**
   - In console, check: `useReportBuilderStore.getState().previewHtml`
   - Should contain HTML with `.page-sheet` divs
   - If empty, template interpolation failed

4. **Verify Data Loaded**
   - Check: `useReportBuilderStore.getState().sections[0]?.fields[0]?.value`
   - Should have values after clicking "Load Test Data"

### **Data Not Showing in Preview**

1. **Field ID Mismatch**
   - Template uses `{{field-id}}` placeholders
   - Store uses `field.id` or `field.storeId`
   - Check console for "Unmapped fields" log

2. **Template Not Updated**
   - Template might use old field IDs
   - Check template version matches fieldRegistry version
   - Template should be v2.3.0 to match registry

3. **Preview Not Refreshing**
   - Try clicking "Refresh" button in Report Builder
   - Or manually reload: `window.location.reload()`

---

## 📊 Expected Results

### **After Loading Test Data:**

- **Coverage:** ~80% (692/868 user-input fields mapped)
- **Calculated Fields:** All populated (NOI, Indicated Value, etc.)
- **Preview HTML:** Contains 77+ pages with populated data
- **Console Logs:**
  ```
  === LOAD FULL TEST DATA CALLED ===
  northBattlefordTestData keys: 1865
  Calculations complete. Indicated Value: 1790000
  Test data loaded: 1160/1865 fields mapped
  ```

### **In Report Preview:**

- All text fields show actual values (not `{{field-id}}`)
- Numbers formatted correctly
- Images load from `/test-data/images/` paths
- Calculations show correct values ($1,790,000 indicated value)

---

## 🔄 Alternative: Active Mode

**"Active Mode" Button** (blue button in TDD Dashboard):
- Loads ONLY `user-input` fields
- Clears all calculated fields first
- Runs calc engine to populate calculated outputs
- **Purpose:** Test that inputs → calculations → outputs work correctly

**Use Case:** Verify calculation engine produces correct outputs from inputs only.

---

## 📝 Notes

- **Store Persistence:** Zustand store persists across navigation (React Router)
- **Template Caching:** Template is cached after first load (faster subsequent loads)
- **Field Mapping:** Some field IDs may need mapping via `testDataFieldMapping`
- **Async Operations:** `loadFullTestData()` is async - wait for completion before navigating

---

## ✅ Quick Checklist

- [ ] Navigate to TDD Dashboard (`/test-input`)
- [ ] Click "Load Test Data" button
- [ ] Verify coverage shows ~80%
- [ ] Check console for "Test data loaded" message
- [ ] Click "Preview in Builder" button
- [ ] Verify Report Builder loads (`/mock-builder`)
- [ ] Check preview panel shows populated report
- [ ] Verify no `{{field-id}}` placeholders visible
- [ ] Check calculated values (NOI, Indicated Value) are correct



