# Agent Task: Add Comp 4-5 to Store

## Priority: 🔴 CRITICAL

## Problem
The SALES tab UI renders 5 comparables, but the store only defines Comp 1-3.
Data entered for Comp 4-5 does not persist.

## File to Edit
```
src/features/image-configurator/report-builder/store/reportBuilderStore.ts
```
Lines approximately 3820-4350 (SALES section)

## Current State
Store has field definitions for:
- ✅ comp1-* (all 18 fields)
- ✅ comp2-* (all 18 fields)
- ✅ comp3-* (all 18 fields)
- ❌ comp4-* (MISSING)
- ❌ comp5-* (MISSING)

## Required Fields Per Comparable

Copy the pattern from comp1-3. Each comparable needs **18 fields**:

### Property ID (2)
```typescript
'comp4-name': '',
'comp4-address': '',
```

### Sale Info (2)
```typescript
'comp4-sale-date': '',
'comp4-sale-price': 0,
```

### Property Details (6)
```typescript
'comp4-units': 0,
'comp4-price-per-unit': 0,  // calculated
'comp4-gba': 0,
'comp4-price-per-sf': 0,    // calculated
'comp4-year-built': 0,
'comp4-cap-rate': 0,
```

### Adjustments (8)
```typescript
'comp4-adj-property-rights': 0,
'comp4-adj-financing': 0,
'comp4-adj-conditions': 0,
'comp4-adj-market-time': 0,
'comp4-adj-location': 0,
'comp4-adj-size': 0,
'comp4-adj-age-condition': 0,
'comp4-adj-other': 0,
```

## Implementation Steps

1. Find where comp3-* fields are defined in the store
2. Copy the entire block
3. Paste and rename comp3 → comp4
4. Paste and rename comp3 → comp5
5. Ensure default values match comp1-3 pattern

## Verification

After adding, run this check:
```bash
grep -E "comp[45]-" src/features/image-configurator/report-builder/store/reportBuilderStore.ts | wc -l
```
Should return ~36 lines (18 fields × 2 comps)

## Also Check

Field Registry may also need comp4-5 entries:
```
src/features/image-configurator/report-builder/schema/fieldRegistry.ts
```

Search for comp3 entries and ensure comp4/comp5 equivalents exist.

## Test

1. Open Report Builder → SALES tab
2. Enter data for Comparable 4
3. Switch to another tab
4. Return to SALES tab
5. Verify Comp 4 data persisted

## Do NOT
- Change the UI components
- Modify field naming patterns
- Add new field types not already used by comp1-3
