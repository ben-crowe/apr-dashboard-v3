# Property Type Field Mapping - Valcre Integration

**Last Updated:** November 16, 2025
**Status:** ✅ All 17 property types verified and working

---

## Overview

Valcre has two separate property-related fields that require different formatting:

1. **PropertyType** - Single-value enum field (not used for multi-select properties)
2. **Types** - Multi-select text field (accepts comma-separated values)

The Dashboard sends property types in human-readable format (e.g., "Multi-Family", "Healthcare") but Valcre's **Types field** requires PascalCase format without hyphens or spaces (e.g., "MultiFamily", "HealthCare").

---

## Critical Limitation

⚠️ **IMPORTANT:** Property type **CANNOT be updated** after a job has been synced to Valcre. The property type is set during initial job creation and is immutable afterward. Any attempt to update property type via the Dashboard after Valcre sync will fail silently or be ignored by Valcre.

**Workaround:** Property types must be set correctly BEFORE creating the Valcre job. If a property type needs to be changed, it must be done manually in the Valcre UI.

---

## Format Conversion Map

The following conversions are applied automatically when sending property types to Valcre:

### Conversions Required (TYPES_FIELD_MAP)

| Dashboard Value | Valcre Types Field | Notes |
|----------------|-------------------|-------|
| Healthcare | **HealthCare** | Capital C required |
| Multi-Family | **MultiFamily** | Remove hyphen, PascalCase |
| Single-Family | **SingleFamily** | Remove hyphen, PascalCase |
| Self-Storage | **SelfStorage** | Remove hyphen, PascalCase |
| Manufactured Housing | **ManufacturedHousing** | Remove space, PascalCase |
| Special Purpose | **SpecialPurpose** | Remove space, PascalCase |

### Pass Through (No Conversion)

The following values are sent as-is to Valcre:

- Agriculture
- Building
- Hospitality
- Industrial
- Land
- Office
- Retail
- Unknown

### Legacy Mappings (PROPERTY_TYPE_MAP)

These are legacy Dashboard values that don't exist in Valcre's dropdown:

| Dashboard Value | Maps To | Reason |
|----------------|---------|--------|
| Mixed Use | Building | Legacy value, not in Valcre enum |
| Commercial | Building | Legacy value, not in Valcre enum |
| Residential | Building | Legacy value, not in Valcre enum |

---

## Technical Implementation

### Location

**File:** `/api/valcre.ts`
**Lines:** 762-773 (TYPES_FIELD_MAP), 755-760 (PROPERTY_TYPE_MAP)

### Code

```typescript
// TYPES FIELD CONVERSION - Dashboard values → Valcre Types field values
const TYPES_FIELD_MAP: Record<string, string> = {
  'Multi-Family': 'MultiFamily',
  'Single-Family': 'SingleFamily',
  'Self-Storage': 'SelfStorage',
  'Manufactured Housing': 'ManufacturedHousing',
  'Special Purpose': 'SpecialPurpose',
  'Healthcare': 'HealthCare', // "HealthCare" with capital C
};

// PROPERTY_TYPE_MAP - Legacy mappings
const PROPERTY_TYPE_MAP: Record<string, string> = {
  'Mixed Use': 'Building',
  'Commercial': 'Building',
  'Residential': 'Building',
  'Multi-Family': 'Building', // PropertyType field doesn't support Multi-Family
};
```

### Processing Logic

1. Dashboard sends `PropertyTypeEnum` (comma-separated string)
2. API splits into array and maps each value through `TYPES_FIELD_MAP`
3. Converted values are joined and sent to Valcre's `Types` field
4. PropertyType field is set using first value (mapped via `PROPERTY_TYPE_MAP` if needed)

---

## Testing

### Comprehensive Test Suite

**File:** `test-all-property-types.ts`

Tests all 17 property types by:
1. Updating a test property's Types field
2. Verifying the value is accepted by Valcre
3. Confirming the readback matches expected format

### Test Results (November 16, 2025)

✅ **17/17 PASSING**

All Dashboard property types successfully create Valcre jobs:
- Standard types: Agriculture, Building, Hospitality, Industrial, Land, Office, Retail, Unknown
- Format conversions: Healthcare, Multi-Family, Single-Family, Self-Storage, Manufactured Housing, Special Purpose
- Legacy mappings: Mixed Use, Commercial, Residential

### How to Run Tests

```bash
# Test all 17 property types on a specific property
npx tsx test-all-property-types.ts <propertyId>

# Query a job by VAL number to verify Types field
npx tsx test-valcre-job-by-number.ts <valNumber>

# Query recent jobs to analyze property type patterns
npx tsx test-valcre-property-types.ts
```

---

## Valcre Property Type Dropdown

Official Valcre property types (from Valcre UI):

1. Agriculture
2. Building
3. Healthcare
4. Hospitality
5. Industrial
6. Land
7. Manufactured Housing
8. Multi-Family
9. Office
10. Retail
11. Self-Storage
12. Single-Family
13. Special Purpose
14. Unknown

---

## Discovery Process

### Test Data Analysis

Analyzed 30 actual Valcre jobs (test-valcre-property-types.ts):
- **PropertyType field:** NULL/empty for all Multi-Family properties
- **Types field:** "MultiFamily" (PascalCase, no hyphen)
- Conclusion: Types field is the primary field for property designation

### Format Discovery

Through empirical testing on job VAL251031 (Property ID: 25628739):
1. Attempted "Multi-Family" → Rejected: "Requested value 'Multi-Family' was not found"
2. Attempted "Multifamily" → Rejected: "Requested value 'Multifamily' was not found"
3. Attempted "multi_family" → Rejected: "Requested value 'multi_family' was not found"
4. Discovered "MultiFamily" → ✅ Accepted
5. Discovered "HealthCare" → ✅ Accepted (capital C required)

### Key Finding

Valcre's Types field validation:
- ✅ Accepts: PascalCase format ("MultiFamily", "HealthCare")
- ❌ Rejects: Hyphenated format ("Multi-Family", "Self-Storage")
- ❌ Rejects: Lowercase variants ("Multifamily", "Healthcare")
- ❌ Rejects: Snake case ("multi_family")

---

## Troubleshooting

### Job Creation Fails with Property Type Error

**Symptom:** `{"error":["Requested value 'X' was not found."]}`

**Cause:** Property type not in TYPES_FIELD_MAP or incorrect format

**Solution:**
1. Check if property type is in Valcre's dropdown list (see above)
2. Verify TYPES_FIELD_MAP has correct conversion
3. Run comprehensive tests to verify mapping

### Property Type Shows Incorrectly in Valcre

**Symptom:** Property type in Valcre doesn't match Dashboard selection

**Cause:**
- Property type updated after Valcre sync (not supported)
- Missing or incorrect TYPES_FIELD_MAP conversion

**Solution:**
- If before sync: Fix mapping in TYPES_FIELD_MAP and redeploy
- If after sync: Update manually in Valcre UI (API cannot update)

### Multi-Select Not Working

**Symptom:** Only one property type appears in Valcre

**Cause:** Dashboard UI or webhook not sending comma-separated values

**Solution:**
1. Verify Dashboard sends `propertyTypes` array
2. Verify webhook joins array with commas: `propertyTypes.join(', ')`
3. Verify API receives `PropertyTypeEnum` as comma-separated string

---

## Related Documentation

- [API Field Mapping Reference](/docs/1-API-FIELD-MAPPING-REFERENCE.md)
- [Valcre API Integration Guide](/docs/07-Valcre-Integration/VALCRE-API-INTEGRATION-GUIDE.md)
- [Multi-Select Property Type Findings](/docs/PROPERTYTYPE-MULTISELECT-FINDINGS.md)

---

## Changelog

### November 16, 2025
- ✅ Added Healthcare → HealthCare mapping (capital C required)
- ✅ Verified all 17 property types working (17/17 passing)
- ✅ Created comprehensive test suite
- ✅ Documented property type update limitation
- ✅ Discovered and documented PascalCase format requirements

### November 13, 2025
- ✅ Added Multi-Family → MultiFamily mapping
- ✅ Discovered Types field vs PropertyType field distinction
- ✅ Created initial TYPES_FIELD_MAP conversion table
