# Findings & Notes - APR Dashboard v3

**Last Updated:** 2025-12-23  
**Purpose:** Track discoveries, issues, and todos as we work together

---

## 🔍 Key Discoveries

### Registry Connection & Architecture

**Registry File Path:**
- **Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts`
- **Size:** 362 KB (362,488 bytes)
- **Total Fields:** ~1,687 fields
- **Unique Sections:** 170 sections

**How It's Connected:**
- **TDD Page** imports: `'../report-builder/schema/fieldRegistry'` (line 10)
- **Report Builder Store** imports: `"../schema/fieldRegistry"` (line 9)
- **Both use the same file** - single source of truth

**How Tabs Are Created:**
- Fields are grouped by `section` property in fieldRegistry
- `buildAllSectionsFromRegistry()` dynamically creates tabs from unique sections
- Adding a field with `section: 'new-section'` automatically creates a new tab
- TDD page iterates directly through `fieldRegistry.forEach()`
- Report Builder uses `buildAllSectionsFromRegistry()` to group fields

**Risk Assessment:**
- ✅ **Safe:** Both components use explicit relative import paths
- ⚠️ **Risk:** If import path is changed, could accidentally point to wrong file
- ✅ **Protection:** TypeScript will error if import path is wrong

---

## 🐛 Issues Found

### 1. Tab Names Missing Numbers
**Status:** 🔴 Pending  
**Location:** `reportBuilderStore.ts` line 252  
**Problem:** 
- Report Builder sidebar uses `formatShortName()` which converts `'cover'` → `'COVER'` (no numbers)
- TDD page has hardcoded mapping: `'cover': '01 - COVER PAGE'`
- When `buildAllSectionsFromRegistry()` runs, it loses numbered format

**Impact:** Report Builder tabs show "COVER" instead of "01 - COVER PAGE"

**Solution Needed:** Create section name mapping function (like TDD has) and use it in `buildAllSectionsFromRegistry()`

---

### 2. Fields Not Showing in Editor Panel
**Status:** 🔴 Investigating  
**Location:** `EditPanel.tsx`  
**Problem:** 
- After loading test data, fields should populate but may not be displaying
- `loadFullTestData()` calls `updateFieldValue()` which updates store
- EditPanel renders `currentSection.fields` and `currentSection.subsections`

**Possible Causes:**
- Active section has no fields (all in subsections)
- React not detecting Zustand state changes
- Field values being set but not displayed

**Next Steps:** Check activeSection and verify fields are populated correctly

---

### 3. ImageFieldEditor Error
**Status:** 🔴 Pending  
**Location:** `ImageFieldEditor.tsx` line 484  
**Error:** `TypeError: images.map is not a function`

**Problem:** 
- `ImageFieldEditor` expects `images` to be an array
- Some image fields have non-array values (string or undefined)
- When test data loads, image fields may have string URLs instead of arrays

**Solution Needed:** Ensure image field values are always arrays, or handle both string and array types

---

## 📊 Data Flow Understanding

### Load Test Data Process
1. User clicks "Load Test Data" button
2. `loadFullTestData()` called in store
3. Iterates through `northBattlefordTestData` (1,791 keys)
4. For each key, checks if field exists using `fieldExists()`
5. If exists, calls `updateFieldValue()` to populate
6. Result: 1,088 out of 1,791 fields mapped successfully
7. 703 fields unmapped (don't exist in fieldRegistry/store)

### Stats Calculation
- **TDD Dashboard** counts fields from `fieldRegistry` (excluding hidden sections)
- Only counts fields that exist in store (`storeFieldIds.has(field.storeId)`)
- Stats update when `sections` change in Zustand store

---

## ✅ Completed Fixes

### Stats Calculation Fix
**Date:** 2025-12-23  
**Change:** Updated stats to only count fields that exist in store  
**File:** `TestInputDashboard.tsx` line 151-171  
**Result:** Stats now accurately reflect mapped vs empty vs missing fields

---

## 🚨 Critical Issue: Unnumbered Sections Auto-Created

**Status:** 🔴 **URGENT - Needs Consolidation**  
**Date Discovered:** 2025-12-23  
**Problem:** Fields were added to registry with new standalone section IDs instead of being added as subsections to existing numbered sections. This caused new unnumbered tabs to be auto-generated.

### Sections That Should Be Merged

**Pattern Identified:**
- When fields are added with `section: 'new-section-name'`, `buildAllSectionsFromRegistry()` automatically creates a new tab
- Many of these should have been added as `subsection` properties to existing numbered sections

**Sections to Consolidate:**

1. **`expenses`** (7 fields)
   - **Should be:** Subsection of `income` (19 - INCOME APPROACH) or `calc` (15 - VALUATIONS)
   - **Current:** Standalone section creating unnumbered tab
   - **Fields:** Expense comment fields (taxes, insurance, repairs, payroll, utilities, management, other)

2. **`hist`** (51 fields)
   - **Should be:** Subsection of `income` (19 - INCOME APPROACH)
   - **Current:** Standalone section
   - **Fields:** Historical income/expense data

3. **`rentroll`** (37 fields)
   - **Should be:** Subsection of `income` (19 - INCOME APPROACH) or `rental-survey` (20 - RENTAL SURVEY)
   - **Current:** Standalone section
   - **Fields:** Rent roll data

4. **`survey`** (128 fields)
   - **Should be:** Subsection of `rental-survey` (20 - RENTAL SURVEY)
   - **Current:** Standalone section
   - **Fields:** Rental survey data

5. **`sales-comparison`** (188 fields)
   - **Should be:** Subsection of `sales` (18 - SALES COMPARISON)
   - **Current:** Standalone section
   - **Fields:** Sales comparison analysis

6. **`rent-analysis`** (166 fields)
   - **Should be:** Subsection of `rental-survey` (20 - RENTAL SURVEY)
   - **Current:** Standalone section
   - **Fields:** Rent analysis data

7. **`rent-analysis-1br`** (46 fields)
   - **Should be:** Subsection of `rental-survey` (20 - RENTAL SURVEY)
   - **Current:** Standalone section

8. **`rent-analysis-2br`** (45 fields)
   - **Should be:** Subsection of `rental-survey` (20 - RENTAL SURVEY)
   - **Current:** Standalone section

9. **`income-analysis`** (66 fields)
   - **Should be:** Subsection of `income` (19 - INCOME APPROACH)
   - **Current:** Standalone section

**Correctly Placed (Already Subsections):**
- ✅ `client-info` - subsection of `cover` (01 - COVER PAGE)
- ✅ `appraiser-info` - subsection of `cover` (01 - COVER PAGE)
- ✅ `company-info` - subsection of `cover` (01 - COVER PAGE)
- ✅ `report-info` - subsection of `report` (05 - REPORT INFORMATION)
- ✅ `amenities` - subsection of `impv` (12 - IMPROVEMENTS)
- ✅ `common-photos` - subsection of `image-mgt` (S3 - IMAGE MANAGEMENT)
- ✅ `site-area` - subsection of `site` (08 - SITE DETAILS)
- ✅ `site-conditions` - subsection of `site` (08 - SITE DETAILS)
- ✅ `property-identification` - subsection of `exec` (06 - EXECUTIVE SUMMARY)
- ✅ `hbu-as-improved` - subsection of `hbu` (14 - HIGHEST & BEST USE)
- ✅ `hbu-as-vacant` - subsection of `hbu` (14 - HIGHEST & BEST USE)

**Solution Required:**
1. Update `fieldRegistry.ts` to change standalone sections to subsections
2. Change `section: 'expenses'` → `section: 'income', subsection: 'expenses'`
3. Change `section: 'hist'` → `section: 'income', subsection: 'hist'`
4. Change `section: 'rentroll'` → `section: 'rental-survey', subsection: 'rentroll'`
5. Change `section: 'survey'` → `section: 'rental-survey', subsection: 'survey'`
6. Change `section: 'sales-comparison'` → `section: 'sales', subsection: 'sales-comparison'`
7. Change `section: 'rent-analysis'` → `section: 'rental-survey', subsection: 'rent-analysis'`
8. Change `section: 'rent-analysis-1br'` → `section: 'rental-survey', subsection: 'rent-analysis-1br'`
9. Change `section: 'rent-analysis-2br'` → `section: 'rental-survey', subsection: 'rent-analysis-2br'`
10. Change `section: 'income-analysis'` → `section: 'income', subsection: 'income-analysis'`

**Impact:**
- Will consolidate ~700+ fields into proper numbered sections
- Will eliminate unnumbered tabs from TDD page
- Will improve organization and logical grouping
- Will match the intended report structure

---

## 📝 TODO List

- [ ] **URGENT:** Consolidate unnumbered sections into proper subsections (see above)
- [ ] Fix tab names - restore numbers to match TDD page (e.g., "01 - COVER PAGE" instead of "COVER")
- [ ] Investigate why fields aren't showing in editor panel after loading test data
- [ ] Fix ImageFieldEditor error - ensure image values are always arrays
- [ ] Create section name mapping function for `buildAllSectionsFromRegistry()`
- [ ] Verify activeSection is set correctly when navigating to Report Builder
- [ ] Check if React is detecting Zustand state changes properly

---

## 🔗 Important File Paths

- **Registry:** `src/features/report-builder/schema/fieldRegistry.ts`
- **TDD Page:** `src/features/test-input/TestInputDashboard.tsx`
- **Report Builder Store:** `src/features/report-builder/store/reportBuilderStore.ts`
- **Report Builder Layout:** `src/features/report-builder/components/ReportBuilderLayout.tsx`
- **Edit Panel:** `src/features/report-builder/components/EditPanel/EditPanel.tsx`
- **Preview Panel:** `src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx`
- **Test Data:** `src/features/report-builder/data/northBattlefordTestData.ts`

---

## 💡 Notes

- Browser automation tools allow full interaction with the app (clicking, typing, debugging)
- Stats show 973/1416 fields mapped (69% coverage) after loading test data
- Console shows 1,088 fields mapped from test data, but dashboard shows 973 (difference needs investigation)
- 703 fields in test data don't exist in fieldRegistry (need field definitions added)


