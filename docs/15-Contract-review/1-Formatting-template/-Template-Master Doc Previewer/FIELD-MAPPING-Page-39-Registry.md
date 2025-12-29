# Field Mapping: Page 39 - Rental Comparable Location Table

**Page:** 39
**Table Name:** Rental Comparable Location Table
**Total Fields:** 20 (4 fields × 5 comparables)
**HTML Lines:** 2668-2709
**Status:** ✅ Complete

---

## Overview

Page 39 contains a simple location reference table showing the 5 rental comparables used in the rental survey analysis. This table appears below the Saskatchewan location map and provides quick reference for comparable names, addresses, and distances from subject property.

**Table Structure:**
- 4 columns: Comparable Name, Label (1-5), Address, Distance from Subject
- 5 rows (one per rental comparable)
- Alternating row colors for readability

---

## Field Mapping Table

### Complete Field List (20 Fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| **COMPARABLE 1 (4 fields)** |
| 1 | {{rental-comp1-name}} | rental-comp1-name | SURVEY1.name | ✅ Verified | Property name/identifier |
| 2 | {{rental-comp1-address}} | rental-comp1-address | SURVEY1.address | ✅ Verified | Street address only |
| 3 | {{rental-comp1-city}} | rental-comp1-city | SURVEY1.city | ✅ Verified | City name |
| 4 | {{rental-comp1-province}} | rental-comp1-province | SURVEY1.province | ✅ Verified | Province abbreviation (SK) |
| 5 | {{rental-comp1-distance}} | rental-comp1-distance | SURVEY1.distance | ⚠️ Need to Add | Distance in kilometres |
| **COMPARABLE 2 (4 fields)** |
| 6 | {{rental-comp2-name}} | rental-comp2-name | SURVEY2.name | ✅ Verified | Property name/identifier |
| 7 | {{rental-comp2-address}} | rental-comp2-address | SURVEY2.address | ✅ Verified | Street address only |
| 8 | {{rental-comp2-city}} | rental-comp2-city | SURVEY2.city | ✅ Verified | City name |
| 9 | {{rental-comp2-province}} | rental-comp2-province | SURVEY2.province | ✅ Verified | Province abbreviation (SK) |
| 10 | {{rental-comp2-distance}} | rental-comp2-distance | SURVEY2.distance | ⚠️ Need to Add | Distance in kilometres |
| **COMPARABLE 3 (4 fields)** |
| 11 | {{rental-comp3-name}} | rental-comp3-name | SURVEY3.name | ✅ Verified | Property name/identifier |
| 12 | {{rental-comp3-address}} | rental-comp3-address | SURVEY3.address | ✅ Verified | Street address only |
| 13 | {{rental-comp3-city}} | rental-comp3-city | SURVEY3.city | ✅ Verified | City name |
| 14 | {{rental-comp3-province}} | rental-comp3-province | SURVEY3.province | ✅ Verified | Province abbreviation (SK) |
| 15 | {{rental-comp3-distance}} | rental-comp3-distance | SURVEY3.distance | ⚠️ Need to Add | Distance in kilometres |
| **COMPARABLE 4 (4 fields)** |
| 16 | {{rental-comp4-name}} | rental-comp4-name | SURVEY4.name | ✅ Verified | Property name/identifier |
| 17 | {{rental-comp4-address}} | rental-comp4-address | SURVEY4.address | ✅ Verified | Street address only |
| 18 | {{rental-comp4-city}} | rental-comp4-city | SURVEY4.city | ✅ Verified | City name |
| 19 | {{rental-comp4-province}} | rental-comp4-province | SURVEY4.province | ✅ Verified | Province abbreviation (SK) |
| 20 | {{rental-comp4-distance}} | rental-comp4-distance | SURVEY4.distance | ⚠️ Need to Add | Distance in kilometres |
| **COMPARABLE 5 (4 fields)** |
| 21 | {{rental-comp5-name}} | rental-comp5-name | SURVEY5.name | ✅ Verified | Property name/identifier |
| 22 | {{rental-comp5-address}} | rental-comp5-address | SURVEY5.address | ✅ Verified | Street address only |
| 23 | {{rental-comp5-city}} | rental-comp5-city | SURVEY5.city | ✅ Verified | City name |
| 24 | {{rental-comp5-province}} | rental-comp5-province | SURVEY5.province | ✅ Verified | Province abbreviation (SK) |
| 25 | {{rental-comp5-distance}} | rental-comp5-distance | SURVEY5.distance | ⚠️ Need to Add | Distance in kilometres |

---

## Field Status Summary

**✅ Verified in Test Data:** 15 fields
- rental-comp1-name through rental-comp5-name (5 fields)
- rental-comp1-address through rental-comp5-address (5 fields)
- rental-comp1-city through rental-comp5-city (5 fields)
- rental-comp1-province through rental-comp5-province (5 fields)

**⚠️ Need to Add to Test Data:** 5 fields
- rental-comp1-distance through rental-comp5-distance
- Currently have sample values from hardcoded template (177.9, 177.1, 175.4, 177.9, 174.9 km)

---

## Registry Field Verification

### Fields Found in northBattlefordTestData-REAL.ts

✅ **All location fields exist:**
```typescript
'rental-comp1-name': '2424 Buhler Ave Apts',
'rental-comp1-address': '2424 Buhler Ave',
'rental-comp1-city': 'North Battleford',
'rental-comp1-province': 'SK',

'rental-comp2-name': '531 S St E Apts',
'rental-comp2-address': '531 S St. E.',
'rental-comp2-city': 'Prince Albert',
'rental-comp2-province': 'SK',
// ... and so on for comp3, comp4, comp5
```

### Missing Distance Fields

⚠️ **Need to add to test data:**
```typescript
// Add these to northBattlefordTestData-REAL.ts:
'rental-comp1-distance': 177.9,  // km from subject
'rental-comp2-distance': 177.1,
'rental-comp3-distance': 175.4,
'rental-comp4-distance': 177.9,
'rental-comp5-distance': 174.9,
```

**Action for TypeScript Pro Agent:**
- Add 5 distance fields to test data file
- Verify registry definitions exist in fieldRegistry.ts
- Update field mapping if needed

---

## HTML Implementation

### Sample Row (Comparable 1)

```html
<tr>
    <td style="padding: 2px 3px; border: 1px solid #ddd; font-size: 7px;">
        <span class="field-mapped" title="{{rental-comp1-name}}" data-sample="2424 Buhler Ave Apts">
            {{rental-comp1-name}}
        </span>
    </td>
    <td style="padding: 2px 3px; border: 1px solid #ddd; text-align: center; font-size: 7px;">
        1
    </td>
    <td style="padding: 2px 3px; border: 1px solid #ddd; font-size: 7px;">
        <span class="field-mapped" title="{{rental-comp1-address}}" data-sample="2424 Buhler Ave">
            {{rental-comp1-address}}
        </span>,
        <span class="field-mapped" title="{{rental-comp1-city}}" data-sample="North Battleford">
            {{rental-comp1-city}}
        </span>,
        <span class="field-mapped" title="{{rental-comp1-province}}" data-sample="SK">
            {{rental-comp1-province}}
        </span>
    </td>
    <td style="padding: 2px 3px; border: 1px solid #ddd; text-align: center; font-size: 7px;">
        <span class="field-mapped" title="{{rental-comp1-distance}}" data-sample="177.9">
            {{rental-comp1-distance}}
        </span>
    </td>
</tr>
```

---

## Changes Made

**Before (Hardcoded):**
```html
<td style="padding: 2px 3px; border: 1px solid #ddd; font-size: 7px;">COMPARABLE 1</td>
<td style="padding: 2px 3px; border: 1px solid #ddd; text-align: center; font-size: 7px;">1</td>
<td style="padding: 2px 3px; border: 1px solid #ddd; font-size: 7px;">1520 - 99 Ave., North Battleford, SK, S9A 3X6</td>
<td style="padding: 2px 3px; border: 1px solid #ddd; text-align: center; font-size: 7px;">177.9</td>
```

**After (Field-Mapped):**
```html
<td><span class="field-mapped" title="{{rental-comp1-name}}" data-sample="2424 Buhler Ave Apts">{{rental-comp1-name}}</span></td>
<td style="text-align: center;">1</td>
<td><span class="field-mapped">{{rental-comp1-address}}</span>, <span class="field-mapped">{{rental-comp1-city}}</span>, <span class="field-mapped">{{rental-comp1-province}}</span></td>
<td style="text-align: center;"><span class="field-mapped" title="{{rental-comp1-distance}}">{{rental-comp1-distance}}</span></td>
```

---

## Next Steps

**For TypeScript Pro Agent:**
1. Add 5 distance fields to `northBattlefordTestData-REAL.ts`
2. Verify these fields exist in `fieldRegistry.ts`
3. Test field binding in preview panel
4. Update testDataFieldMapping if needed

**For Pages 37-40 Field Mapping:**
- Page 37-39: Full rental comparable detail sheets (similar to sales comp pages 54-58)
- Page 40: Rental adjustment grid
- This Page 39 location table provides foundation for more detailed mapping

---

**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Status:** ✅ HTML Updated | ⚠️ 5 distance fields need adding to test data
