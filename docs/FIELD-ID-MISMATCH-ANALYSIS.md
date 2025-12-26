# Field ID Mismatch Analysis: TDD Dashboard vs Test Data

## Issue Summary
The 01 - COVER PAGE section expects field IDs that don't match the actual values in `northBattlefordTestData.ts`. The test data has property information stored under `subject-*` field IDs, but the registry expects `property-*`, `street-address`, `city`, etc.

## 01 - COVER PAGE Expected Fields (from fieldRegistry.ts)

### Property Information Fields:
- `property-name` - Property Name
- `street-address` - Street Address
- `city` - City
- `province` - Province
- `province-abbr` - Province Abbreviation
- `property-full-address` - Full Property Address
- `property-type-display` - Property Type

## Test Data File Status (northBattlefordTestData.ts)

### Fields with Placeholder Values (Expected by 01 - COVER PAGE):
```typescript
"property-name": "[property-name]",           // ❌ Placeholder
"street-address": "[street-address]",         // ❌ Placeholder
"city": "[city]",                             // ❌ Placeholder
"province": "[province]",                     // ❌ Placeholder
```

### Fields with Actual Values (But Wrong Section):
```typescript
"subject-name": "North Battleford Apartments",        // ✅ Has value
"subject-street": "1101, 1121 109 St",                 // ✅ Has value
"subject-city": "North Battleford",                    // ✅ Has value
"subject-city-formal": "City of North Battleford",     // ✅ Has value
"subject-province": "Saskatchewan",                    // ✅ Has value
"subject-state": "[subject-state]",                    // ❌ Placeholder
"subject-zip": "[subject-zip]",                        // ❌ Placeholder
```

## Field Mapping Needed

To fix the mismatch, the test data should map `subject-*` fields to the expected `property-*` fields:

| Expected Field ID | Current Test Data Field ID | Current Value | Status |
|-------------------|---------------------------|---------------|--------|
| `property-name` | `subject-name` | "North Battleford Apartments" | ✅ Value exists |
| `street-address` | `subject-street` | "1101, 1121 109 St" | ✅ Value exists |
| `city` | `subject-city` | "North Battleford" | ✅ Value exists |
| `city-formal` | `subject-city-formal` | "City of North Battleford" | ✅ Value exists |
| `province` | `subject-province` | "Saskatchewan" | ✅ Value exists |
| `province-abbr` | `subject-st` | "SK" | ✅ Value exists (if exists) |

## Additional Property Fields in Test Data

Other `subject-*` fields that may need mapping:
- `subject-streetname`: "1121 109 St"
- `subject-streetnumber`: "1101,"
- `subject-market`: "North Battleford"
- `subject-submarket`: "North Battleford"
- `subject-geocode`: (check if exists)
- `subject-zip`: "[subject-zip]" (placeholder)

## Recommendation

**Option 1: Update Test Data** (Recommended)
- Copy values from `subject-*` fields to the expected `property-*` fields
- Example: `"property-name": "North Battleford Apartments"` (copy from `subject-name`)

**Option 2: Update Registry**
- Change 01 - COVER PAGE to use `subject-*` field IDs instead
- This would require checking if other sections also use these fields

**Option 3: Add Mapping Function**
- Create a mapping function in `loadFullTestData()` that maps `subject-*` → `property-*` fields

## Next Steps

1. Check if `subject-*` fields are used elsewhere (e.g., 06 - EXECUTIVE SUMMARY)
2. Determine which approach is best (update test data vs update registry)
3. Apply the fix consistently across all property information fields


