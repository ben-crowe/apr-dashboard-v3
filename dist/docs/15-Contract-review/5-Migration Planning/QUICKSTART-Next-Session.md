# Quick Start - Next Session

**Goal:** Add Comparable 1 fields to field registry and test

**Estimated Time:** 2-3 hours

---

## Before You Start

### Read First (5 min)
- ✅ `SUMMARY-Integration-Plan.md` (this directory)
- ✅ `REPORT-Preview-Architecture-Analysis.md` (full details)

### Verify Environment (2 min)
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
npm run dev  # Should start without errors
git status   # Should show clean working tree
```

---

## Step-by-Step: Add Comparable 1 Fields

### Step 1: Create Branch (1 min)

```bash
git checkout -b feature/comparable-fields-integration
```

---

### Step 2: Open Field Registry (1 min)

```bash
code /Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts
```

---

### Step 3: Find Insertion Point (2 min)

**Search for:** `// SALES COMPARISON SECTION`

**Add after existing sales fields, before next section**

---

### Step 4: Add Comp1 Fields (45-60 min)

**Copy-paste this block into fieldRegistry.ts:**

```typescript
  // ============================================================================
  // COMPARABLE 1 FIELDS (50 fields)
  // ============================================================================

  // Basic Info (10 fields)
  { id: 'comp1-name', storeId: 'comp1-name', label: 'Comparable 1 Name', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
  { id: 'comp1-address', storeId: 'comp1-address', label: 'Comparable 1 Address', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
  { id: 'comp1-city', storeId: 'comp1-city', label: 'Comparable 1 City', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
  { id: 'comp1-province', storeId: 'comp1-province', label: 'Comparable 1 Province', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: true },
  { id: 'comp1-postal-code', storeId: 'comp1-postal-code', label: 'Comparable 1 Postal Code', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-latitude', storeId: 'comp1-latitude', label: 'Comparable 1 Latitude', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-longitude', storeId: 'comp1-longitude', label: 'Comparable 1 Longitude', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },

  // Sale Information (10 fields)
  { id: 'comp1-buyer', storeId: 'comp1-buyer', label: 'Comparable 1 Buyer', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-seller', storeId: 'comp1-seller', label: 'Comparable 1 Seller', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-sale-date', storeId: 'comp1-sale-date', label: 'Comparable 1 Sale Date', section: 'sales', subsection: 'comp1', type: 'date', inputSource: 'user-input', required: true },
  { id: 'comp1-sale-price', storeId: 'comp1-sale-price', label: 'Comparable 1 Sale Price', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'user-input', required: true },
  { id: 'comp1-sale-terms', storeId: 'comp1-sale-terms', label: 'Comparable 1 Sale Terms', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-property-rights', storeId: 'comp1-property-rights', label: 'Comparable 1 Property Rights', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-financing', storeId: 'comp1-financing', label: 'Comparable 1 Financing', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-data-source', storeId: 'comp1-data-source', label: 'Comparable 1 Data Source', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-verification-source', storeId: 'comp1-verification-source', label: 'Comparable 1 Verification Source', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-mls-number', storeId: 'comp1-mls-number', label: 'Comparable 1 MLS Number', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },

  // Property Details (10 fields)
  { id: 'comp1-year-built', storeId: 'comp1-year-built', label: 'Comparable 1 Year Built', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: true },
  { id: 'comp1-building-style', storeId: 'comp1-building-style', label: 'Comparable 1 Building Style', section: 'sales', subsection: 'comp1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-units', storeId: 'comp1-units', label: 'Comparable 1 Units', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: true },
  { id: 'comp1-gba', storeId: 'comp1-gba', label: 'Comparable 1 GBA', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: true },
  { id: 'comp1-nra', storeId: 'comp1-nra', label: 'Comparable 1 NRA', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: true },
  { id: 'comp1-land-area', storeId: 'comp1-land-area', label: 'Comparable 1 Land Area (SF)', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-land-area-acres', storeId: 'comp1-land-area-acres', label: 'Comparable 1 Land Area (Acres)', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-parking-spaces', storeId: 'comp1-parking-spaces', label: 'Comparable 1 Parking Spaces', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-parking-ratio', storeId: 'comp1-parking-ratio', label: 'Comparable 1 Parking Ratio', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-stories', storeId: 'comp1-stories', label: 'Comparable 1 Stories', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'user-input', required: false },

  // Valuation Metrics (8 fields)
  { id: 'comp1-price-per-unit', storeId: 'comp1-price-per-unit', label: 'Comparable 1 Price Per Unit', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'calculated', required: false, calculationFormula: 'comp1-sale-price / comp1-units' },
  { id: 'comp1-price-per-sf', storeId: 'comp1-price-per-sf', label: 'Comparable 1 Price Per SF', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'calculated', required: false, calculationFormula: 'comp1-sale-price / comp1-gba' },
  { id: 'comp1-price-per-nra-sf', storeId: 'comp1-price-per-nra-sf', label: 'Comparable 1 Price Per NRA SF', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'calculated', required: false, calculationFormula: 'comp1-sale-price / comp1-nra' },
  { id: 'comp1-cap-rate', storeId: 'comp1-cap-rate', label: 'Comparable 1 Cap Rate', section: 'sales', subsection: 'comp1', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'comp1-grm', storeId: 'comp1-grm', label: 'Comparable 1 GRM', section: 'sales', subsection: 'comp1', type: 'number', inputSource: 'calculated', required: false },
  { id: 'comp1-land-value', storeId: 'comp1-land-value', label: 'Comparable 1 Land Value', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp1-land-value-per-sf', storeId: 'comp1-land-value-per-sf', label: 'Comparable 1 Land Value Per SF', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp1-land-value-per-acre', storeId: 'comp1-land-value-per-acre', label: 'Comparable 1 Land Value Per Acre', section: 'sales', subsection: 'comp1', type: 'currency', inputSource: 'calculated', required: false },

  // Ratings (4 fields)
  { id: 'comp1-location-rating', storeId: 'comp1-location-rating', label: 'Comparable 1 Location Rating', section: 'sales', subsection: 'comp1', type: 'select', options: ['Superior', 'Average', 'Inferior'], inputSource: 'user-input', required: true },
  { id: 'comp1-quality-rating', storeId: 'comp1-quality-rating', label: 'Comparable 1 Quality Rating', section: 'sales', subsection: 'comp1', type: 'select', options: ['Superior', 'Average', 'Inferior'], inputSource: 'user-input', required: true },
  { id: 'comp1-condition-rating', storeId: 'comp1-condition-rating', label: 'Comparable 1 Condition Rating', section: 'sales', subsection: 'comp1', type: 'select', options: ['Superior', 'Average', 'Inferior'], inputSource: 'user-input', required: true },
  { id: 'comp1-appeal-rating', storeId: 'comp1-appeal-rating', label: 'Comparable 1 Appeal Rating', section: 'sales', subsection: 'comp1', type: 'select', options: ['Superior', 'Average', 'Inferior'], inputSource: 'user-input', required: true },

  // Visual Assets (2 fields)
  { id: 'comp1-photo', storeId: 'comp1-photo', label: 'Comparable 1 Photo', section: 'sales', subsection: 'comp1', type: 'image', inputSource: 'user-input', required: false },
  { id: 'comp1-map', storeId: 'comp1-map', label: 'Comparable 1 Location Map', section: 'sales', subsection: 'comp1', type: 'image', inputSource: 'user-input', required: false },

  // Narrative (2 fields)
  { id: 'comp1-remarks', storeId: 'comp1-remarks', label: 'Comparable 1 Remarks', section: 'sales', subsection: 'comp1', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'comp1-adjustments-narrative', storeId: 'comp1-adjustments-narrative', label: 'Comparable 1 Adjustments Narrative', section: 'sales', subsection: 'comp1', type: 'textarea', inputSource: 'user-input', required: false },
```

**Note:** Ensure comma after last existing field, before this block

---

### Step 5: Type Check (2 min)

```bash
npm run type-check
```

**Expected:** No errors

**If errors:** Check for missing commas, typos in field IDs

---

### Step 6: Commit (1 min)

```bash
git add src/features/report-builder/schema/fieldRegistry.ts
git commit -m "feat(fields): add Comparable 1 fields (50)"
```

---

### Step 7: Add Test Data (30 min)

**Open file:**
```bash
code /Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/data/northBattlefordTestData-REAL.ts
```

**Find insertion point:** After existing sales fields

**Add this block:**

```typescript
  // ============================================================================
  // COMPARABLE 1 DATA
  // ============================================================================

  // Basic Info
  'comp1-name': 'Heritage House',
  'comp1-address': '1551 107 St, North Battleford, SK S9A 2A1',
  'comp1-city': 'North Battleford',
  'comp1-province': 'SK',
  'comp1-postal-code': 'S9A 2A1',
  'comp1-latitude': '52.7600',
  'comp1-longitude': '-108.2900',

  // Sale Information
  'comp1-buyer': 'Private Investor',
  'comp1-seller': 'Heritage Properties Ltd.',
  'comp1-sale-date': '2024-06-17',
  'comp1-sale-price': 3117383,
  'comp1-sale-terms': 'Cash to Vendor',
  'comp1-property-rights': 'Fee Simple',
  'comp1-financing': 'Cash',
  'comp1-data-source': 'MLS',
  'comp1-verification-source': 'Listing Agent',
  'comp1-mls-number': '1234567',

  // Property Details
  'comp1-year-built': 2000,
  'comp1-building-style': 'Walkup',
  'comp1-units': 24,
  'comp1-gba': 22754,
  'comp1-nra': 22754,
  'comp1-land-area': 30000,
  'comp1-land-area-acres': 0.69,
  'comp1-parking-spaces': 36,
  'comp1-parking-ratio': 1.5,
  'comp1-stories': 2,

  // Valuation Metrics (will be calculated)
  'comp1-price-per-unit': 129891,
  'comp1-price-per-sf': 137.00,
  'comp1-price-per-nra-sf': 137.00,
  'comp1-cap-rate': 5.99,
  'comp1-grm': 8.5,
  'comp1-land-value': 0,
  'comp1-land-value-per-sf': 0,
  'comp1-land-value-per-acre': 0,

  // Ratings
  'comp1-location-rating': 'Superior',
  'comp1-quality-rating': 'Superior',
  'comp1-condition-rating': 'Superior',
  'comp1-appeal-rating': 'Superior',

  // Visual Assets
  'comp1-photo': '/test-data/images/comparables/comp1-heritage-house.jpg',
  'comp1-map': '/test-data/images/maps/comp1-map.png',

  // Narrative
  'comp1-remarks': 'Heritage House is a newer multi-family property located in a desirable area of North Battleford. The property features brick construction, updated common areas, and is well-maintained. The location is superior to the subject property with better visibility and access to amenities.',
  'comp1-adjustments-narrative': 'Adjustments required for location (superior), age (newer), and condition (better maintenance).',
```

---

### Step 8: Add Field Mappings (5 min)

**In same file, find:** `export const fieldToSectionMap`

**Add these entries:**

```typescript
  // Comparable 1 mappings
  'comp1-name': 'sales',
  'comp1-address': 'sales',
  'comp1-city': 'sales',
  'comp1-province': 'sales',
  'comp1-postal-code': 'sales',
  'comp1-latitude': 'sales',
  'comp1-longitude': 'sales',
  'comp1-buyer': 'sales',
  'comp1-seller': 'sales',
  'comp1-sale-date': 'sales',
  'comp1-sale-price': 'sales',
  'comp1-sale-terms': 'sales',
  'comp1-property-rights': 'sales',
  'comp1-financing': 'sales',
  'comp1-data-source': 'sales',
  'comp1-verification-source': 'sales',
  'comp1-mls-number': 'sales',
  'comp1-year-built': 'sales',
  'comp1-building-style': 'sales',
  'comp1-units': 'sales',
  'comp1-gba': 'sales',
  'comp1-nra': 'sales',
  'comp1-land-area': 'sales',
  'comp1-land-area-acres': 'sales',
  'comp1-parking-spaces': 'sales',
  'comp1-parking-ratio': 'sales',
  'comp1-stories': 'sales',
  'comp1-price-per-unit': 'sales',
  'comp1-price-per-sf': 'sales',
  'comp1-price-per-nra-sf': 'sales',
  'comp1-cap-rate': 'sales',
  'comp1-grm': 'sales',
  'comp1-land-value': 'sales',
  'comp1-land-value-per-sf': 'sales',
  'comp1-land-value-per-acre': 'sales',
  'comp1-location-rating': 'sales',
  'comp1-quality-rating': 'sales',
  'comp1-condition-rating': 'sales',
  'comp1-appeal-rating': 'sales',
  'comp1-photo': 'sales',
  'comp1-map': 'sales',
  'comp1-remarks': 'sales',
  'comp1-adjustments-narrative': 'sales',
```

---

### Step 9: Type Check Again (2 min)

```bash
npm run type-check
```

---

### Step 10: Commit (1 min)

```bash
git add src/features/report-builder/data/northBattlefordTestData-REAL.ts
git commit -m "feat(data): add Comparable 1 test data"
```

---

### Step 11: Test in Browser (10 min)

**Start dev server (if not running):**
```bash
npm run dev
```

**Open browser:**
```
http://localhost:3000/mock-builder
```

**Test:**
1. Click "Load Test Data" button
2. Check console for errors
3. Verify no "Missing field" warnings for comp1-* fields
4. Check if comp1 fields appear in TDD page

**Expected:** No console errors, comp1 fields populate

---

## Success Criteria

✅ **Step completed successfully if:**
- [ ] Type check passes (no errors)
- [ ] 2 commits created (`fields` + `data`)
- [ ] "Load Test Data" button works
- [ ] No console errors mentioning comp1 fields
- [ ] Comp1 fields visible in TDD page

---

## If Things Go Wrong

### Error: Type check fails

**Cause:** Syntax error in fieldRegistry.ts

**Fix:**
1. Check for missing commas
2. Verify all field IDs are valid (no spaces, lowercase + dashes only)
3. Ensure field definitions match interface

---

### Error: "Field not found" in console

**Cause:** Field ID mismatch between registry and test data

**Fix:**
1. Verify field IDs are identical (case-sensitive)
2. Check `fieldToSectionMap` has entries for all new fields
3. Ensure no typos in field IDs

---

### Error: "Load Test Data" doesn't populate comp1 fields

**Cause:** Missing `fieldToSectionMap` entries

**Fix:**
1. Verify all comp1-* fields have entries in `fieldToSectionMap`
2. Ensure all entries point to 'sales' section
3. Check console for skipped fields

---

## Next Steps After This Session

**Session 2:** Add Comparable 2-5 fields (repeat this process 4 more times)

**Session 3:** Convert Page 54 HTML to TypeScript function

**Session 4:** Add remaining pages + toggle button

---

## Estimated Progress After This Session

- ✅ 50/260 fields complete (19%)
- ✅ 1/5 comparables complete (20%)
- ✅ Proof of concept validated
- ⏳ Template conversion not started
- ⏳ Toggle functionality not started

---

## Questions Before Starting?

**Review these documents:**
- `SUMMARY-Integration-Plan.md` - Overview and timeline
- `REPORT-Preview-Architecture-Analysis.md` - Full technical details

**Key principle:** Small commits, test frequently, don't modify store unless absolutely necessary

---

## Time Checkpoint

**Expected total time:** 2-3 hours

**If taking longer:** That's okay! Quality > speed

**If stuck:** Review error messages carefully, check file paths, verify syntax

---

**Good luck! Remember to commit early and often.**

**Next handoff document:** Create after completing Comp1-5 fields
