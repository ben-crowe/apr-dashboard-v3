# Template Field ID Analysis - Report-MF-Template-Framed-v2.1.html

## Template Source of Truth

**File:** `docs/15-Contract-review/1-Formatting & Report/Report-MF-Template-Framed-v2.1.html`

## Property Information Fields Used in Template

### Primary Pattern (Used Throughout Most of Template):

| Field | Template Uses | Count |
|-------|--------------|-------|
| **Property Name** | `{{subject-name}}` | ✅ Primary (lines 573, 868) |
| **Street Address** | `{{subject-street}}` | ✅ Primary (lines 574, 644, 691, 731, 876, etc.) |
| **City** | `{{city}}` | ✅ Primary (lines 575, 645, 880) |
| **Province/State** | `{{subject-state}}` | ✅ Primary (lines 575, 880) |
| **Postal Code** | `{{subject-zip}}` | ✅ Primary (line 880) |

### Secondary Pattern (Used in Comparison Table Only):

| Field | Template Uses | Count |
|-------|--------------|-------|
| **Property Name** | `{{property-name}}` | ⚠️ Only 1 instance (line 6839 - comparison table) |
| **Street Address** | `{{street-address}}` | ⚠️ Only 1 instance (line 6848 - comparison table) |

## Key Findings

1. **Template PRIMARY pattern:**
   - `{{subject-name}}` - Property Name
   - `{{subject-street}}` - Street Address  
   - `{{city}}` - City (NOT `{{subject-city}}`)
   - `{{subject-state}}` - Province/State
   - `{{subject-zip}}` - Postal Code

2. **Template SECONDARY pattern (comparison table only):**
   - `{{property-name}}` - Used once in comparison table (line 6839)
   - `{{street-address}}` - Used once in comparison table (line 6848)

3. **City field is special:**
   - Template uses `{{city}}` (NOT `{{subject-city}}`)
   - This is the only field that doesn't use the `subject-` prefix

## Registry vs Template Alignment

### Current Registry Status:

**01 - COVER PAGE Main Section:**
- `property-name` ❌ (template uses `subject-name`)
- `street-address` ❌ (template uses `subject-street`)
- `city` ✅ (matches template)
- `province` ❌ (template uses `subject-state`)

**01 - COVER PAGE Subsection `property-address`:**
- `subject-city` ✅ (but template uses `city`, not `subject-city`)
- `subject-street` ✅ (matches template)
- `subject-province` ❌ (template uses `subject-state`)
- `subject-state` ✅ (matches template)
- `subject-zip` ✅ (matches template)

## Test Data Status:

**Has values:**
- `subject-name`: "North Battleford Apartments" ✅
- `subject-street`: "1101, 1121 109 St" ✅
- `city`: "[city]" ❌ (placeholder, but template expects this)
- `subject-city`: "North Battleford" ✅ (but template doesn't use this)
- `subject-state`: "[subject-state]" ❌ (placeholder)
- `subject-province`: "Saskatchewan" ✅ (but template uses `subject-state`)

## Recommendations

Since the template is the source of truth:

1. **Registry should match template:**
   - Change `property-name` → `subject-name` in registry (or keep both)
   - Change `street-address` → `subject-street` in registry (or keep both)
   - Keep `city` as-is (matches template)
   - Change `province` → `subject-state` in registry (or keep both)

2. **Test data should match template:**
   - Map `subject-name` → `property-name` (if registry keeps both)
   - Map `subject-street` → `street-address` (if registry keeps both)
   - Update `city` with actual value: "North Battleford"
   - Map `subject-province` → `subject-state` (template uses `subject-state`)

3. **Comparison table fields:**
   - Keep `property-name` and `street-address` in registry for comparison table use
   - Ensure test data maps to both sets of IDs

## Next Steps

1. Verify if comparison table needs separate field IDs
2. Update registry to match template's primary pattern
3. Update test data to populate correct field IDs
4. Ensure both patterns work (if comparison table needs different IDs)


