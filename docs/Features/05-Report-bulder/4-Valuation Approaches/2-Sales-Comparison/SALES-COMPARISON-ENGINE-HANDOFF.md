# Sales Comparison Approach Engine - Handoff Document
**Date:** December 21, 2025
**Status:** NOT BUILT - Deferred until Income Approach complete
**Priority:** Next after Income Approach verification
**Complexity:** HIGH (~620 fields, adjustment calculations)

---

## Executive Summary

The Sales Comparison Approach section (Pages 54-62) requires:
- **5 comparable sales** (not 3 as originally thought)
- **~620 total fields** (120+ per comp)
- **Adjustment calculations** (transactional + physical)
- **Summary grid** with calculated outputs

This was intentionally deferred because Income Approach was priority. Income Approach is now complete and verified.

---

## Scope

### Pages Covered

| Page | Content | Comp |
|------|---------|------|
| 51 | Introduction & methodology | - |
| 52 | Comp selection narrative | - |
| 53 | Comparables location map | - |
| 54 | Individual comp sheet | Comp 1 |
| 55 | Individual comp sheet | Comp 2 |
| 56 | Individual comp sheet | Comp 3 |
| 57 | Individual comp sheet | Comp 4 |
| 58 | Individual comp sheet | Comp 5 |
| 59 | Summary comparison grid | All 5 |
| 60 | Analysis narrative | - |
| 61-62 | Value conclusion | - |

### Field Count

| Component | Fields |
|-----------|--------|
| Comp 1 | ~123 |
| Comp 2 | ~124 |
| Comp 3 | ~124 |
| Comp 4 | ~124 |
| Comp 5 | ~124 |
| Subject (in grid) | ~30 |
| **Total** | **~620** |

---

## HTML Template Status

**File:** Report-MF-Temp-Framed-v1.html
**Status:** ✅ Complete - All field placeholders exist

### Field ID Pattern
```
comp1-name, comp1-address, comp1-sale-price, comp1-units, etc.
comp2-name, comp2-address, comp2-sale-price, comp2-units, etc.
... through comp5
```

### Sample Fields Per Comp (from HTML)

**Transaction Info:**
- `compN-name`
- `compN-address`
- `compN-city`
- `compN-province`
- `compN-postal-code`
- `compN-sale-price`
- `compN-sale-date` (as market-conditions)
- `compN-sale-status`
- `compN-property-rights`
- `compN-financing`
- `compN-sale-conditions`
- `compN-expenditures-after`

**Calculated Transaction:**
- `compN-price-per-unit` ← CALC: sale-price ÷ units
- `compN-total-trans-adj` ← CALC: sum of transactional adjustments
- `compN-adj-price-per-unit` ← CALC: price-per-unit + adjustments

**Income Info:**
- `compN-noi`
- `compN-noi-per-unit`
- `compN-occupancy`
- `compN-cap-rate`

**Physical Characteristics:**
- `compN-units`
- `compN-gba`
- `compN-nra`
- `compN-year-built`
- `compN-land-area`
- `compN-stories`
- `compN-quality`
- `compN-condition`
- `compN-appeal`
- `compN-parking-type`
- `compN-proj-amenities`
- `compN-unit-amenities`

**Calculated Physical:**
- `compN-total-phys-adj` ← CALC: sum of physical adjustments

**Media:**
- `compN-photo`
- `compN-map`

**Narrative:**
- `compN-remarks`

---

## Calculations Required

### Simple Calculations (per comp)

| Output Field | Formula |
|--------------|---------|
| `compN-price-per-unit` | `compN-sale-price` ÷ `compN-units` |
| `compN-price-per-sf` | `compN-sale-price` ÷ `compN-gba` |
| `compN-noi-per-unit` | `compN-noi` ÷ `compN-units` |

### Adjustment Calculations (per comp)

**Transactional Adjustments:**
| Field | Description |
|-------|-------------|
| Property Rights adjustment | % or $ adjustment |
| Financing adjustment | % or $ adjustment |
| Sale Conditions adjustment | % or $ adjustment |
| Expenditures After adjustment | $ adjustment |
| Market Conditions adjustment | % or $ adjustment |
| `compN-total-trans-adj` | SUM of above |

**Physical Adjustments:**
| Field | Description |
|-------|-------------|
| Location adjustment | Based on comp vs subject |
| Size adjustment | Based on unit count diff |
| Age adjustment | Based on year built diff |
| Condition adjustment | Based on condition rating |
| Quality adjustment | Based on quality rating |
| Amenities adjustment | Based on amenity comparison |
| `compN-total-phys-adj` | SUM of above |

**Final Calculation:**
```
compN-adj-price-per-unit = compN-price-per-unit 
                         + compN-total-trans-adj 
                         + compN-total-phys-adj
```

---

## Test Data Status

**Current:** ZERO comparable data in test file

**File:** `northBattlefordTestData.ts`
**Lines 269-275:** Only subject property data exists

### Data Needed Per Comp (minimum)

```typescript
// COMPARABLE SALE 1
'comp1-name': 'Heritage House',
'comp1-address': '1351 107 St',
'comp1-city': 'North Battleford',
'comp1-province': 'SK',
'comp1-postal-code': 'S9A 2A1',
'comp1-sale-price': 3117383,
'comp1-sale-date': '2024-06-17',
'comp1-units': 24,
'comp1-gba': 22754,
'comp1-year-built': 2000,
'comp1-noi': 186731,
'comp1-cap-rate': 5.99,
'comp1-occupancy': 100,
'comp1-condition': 'Average',
'comp1-quality': 'Average',
// ... additional fields
```

### Data Source

The HTML `data-sample` attributes contain realistic test values from actual North Battleford market. These can be extracted and used as test data.

**Sample values visible in HTML:**
- Comp 1: Heritage House, $3,117,383, 24 units, 5.99% cap
- Comp 2: College View, $4,590,858, 45 units, 5.99% cap
- Comp 3: Woodland Estates, $2,055,056, 24 units, 5.99% cap
- Comp 4: Parkside Flats 1, $9,310,000, 47 units, 6.24% cap
- Comp 5: Parkside Flats 2, $13,720,000, 64 units, 5.92% cap

---

## Implementation Plan

### Phase 1: Registry & Store
1. Add all ~620 comp fields to field registry
2. Organize by comp (sale-comp-1, sale-comp-2, etc.)
3. Mark calculated fields appropriately

### Phase 2: Test Data
1. Extract sample values from HTML `data-sample` attributes
2. Add to `northBattlefordTestData.ts`
3. Minimum: core fields for 5 comps (~75 fields)

### Phase 3: Calc Engine
1. Add `runSalesCompCalculations()` function to store
2. Implement price-per-unit, price-per-sf calculations
3. Implement adjustment sum calculations
4. Wire to `runCalculations()` master function

### Phase 4: Verification
1. Load test data
2. Verify Pages 54-58 individual sheets populate
3. Verify Page 59 summary grid populates
4. Verify calculated fields compute correctly

---

## Comparison to Income Approach (Reference)

| Aspect | Income Approach | Sales Comparison |
|--------|-----------------|------------------|
| Pages | 44-50 (7 pages) | 51-62 (12 pages) |
| Fields | ~180 | ~620 |
| Calc complexity | 11-step flow | Simple math + sums |
| Status | ✅ COMPLETE | ❌ NOT STARTED |

**Note:** Sales Comp has MORE fields but SIMPLER calculations than Income Approach. Mostly division and summation.

---

## Dependencies

### Must Have Before Starting
- ✅ Report-MF-Temp-Framed-v1.html (latest template)
- ✅ MASTER-PAGE-FIELD-REFERENCE.md (page inventory)
- ✅ Income Approach complete (for calc engine pattern reference)

### Agent Requirements
- **Registry Agent:** Add ~620 fields
- **Frontend Dev Agent:** Build calc engine, add test data
- **Browser testing:** Verify all 5 comp sheets + grid

---

## Risks & Considerations

### Complexity
- 5× the work of a single comp
- Easy to miss fields or make ID typos
- Grid alignment must match Subject + 5 comps

### Adjustment Logic
- May need appraiser input on adjustment methodology
- Valcre workbook may have specific adjustment formulas
- Consider: are adjustments user-input or calculated?

### Test Data Quality
- Sample values in HTML may not be mathematically consistent
- May need to recalculate to ensure NOI ÷ price = cap rate, etc.

---

## Files to Reference

| File | Purpose |
|------|---------|
| Report-MF-Temp-Framed-v1.html | HTML template with all field IDs |
| SALES-COMPARABLES-DATA-MAPPING.md | Original planning doc (shows 3 comps - outdated) |
| reportBuilderStore.ts | Pattern for calc engine (see runCalculations) |
| MASTER-PAGE-FIELD-REFERENCE.md | Page-by-page field inventory |

---

## Quick Start for New Session

1. **Upload these files:**
   - This handoff doc
   - Report-MF-Temp-Framed-v1.html
   - SALES-COMPARABLES-DATA-MAPPING.md (reference, but note it says 3 comps)

2. **First task:** Extract all comp field IDs from HTML (I counted ~620)

3. **Second task:** Build test data from HTML `data-sample` values

4. **Third task:** Create calc engine for simple calculations

5. **Fourth task:** Wire adjustments (may need clarification on methodology)

---

## Questions to Resolve

1. **Are adjustments user-input or calculated?**
   - User enters adjustment %/$ per category?
   - Or system calculates based on comp vs subject comparison?

2. **Adjustment methodology from Valcre?**
   - Does Valcre workbook have specific adjustment formulas?
   - Or is it appraiser judgment?

3. **Which comps are required vs optional?**
   - Must have all 5?
   - Or can report work with 3-5?

---

## Success Criteria

- [ ] All 5 comp sheets (Pages 54-58) populate with test data
- [ ] Summary grid (Page 59) shows all 6 columns (Subject + 5 comps)
- [ ] Price-per-unit calculates correctly for all comps
- [ ] Adjustment totals sum correctly
- [ ] Adjusted price-per-unit computes correctly
- [ ] No `{{fieldId}}` placeholders visible when test data loaded

---

*End of Sales Comparison Engine Handoff*
