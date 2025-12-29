# Quick Start Guide for Template Builder
**APR Dashboard V3 - Field Integration**

**Date:** 2025-12-12
**Status:** Ready for implementation

---

## Your Mission

Integrate 79 PNG-to-HTML pages with existing fieldRegistry system.

You have **99 template fields** extracted from boilerplate analysis.
You have **519 existing fields** in fieldRegistry.ts.

---

## File Locations

All files in: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img./`

### Reference Files:
1. **FIELD-CROSS-REFERENCE-SUMMARY.md** - START HERE (executive summary)
2. **new-fields-needed.json** - 77 field specs (after consolidation, only ~31 truly new)
3. **existing-fields-mapping.json** - 22 exact + 37 similar matches
4. **conditional-logic-requirements.json** - 8 conditional scenarios
5. **BOILERPLATE-VS-DYNAMIC-ANALYSIS.md** - Source analysis

### Existing System Files:
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts` - 519 existing fields
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportHtmlTemplate.ts` - Broken template to replace

---

## Quick Facts

### Field Breakdown:
- **22 fields** - Already exist, use as-is
- **37 fields** - High similarity, consolidate with existing
- **9 fields** - Calculated/composite (create helper functions)
- **31 fields** - Truly new, add to registry

### Critical Fields:
1. **value-scenario-type** - Controls 4 major sections (HIGHEST PRIORITY)
   - Values: "As Stabilized" | "As If Renovated & Stabilized" | "As Is"
   - Affects: hypothetical-conditions-text, extraordinary-assumptions-text, hbu-scenario, scenario-description

2. **building-count** - Controls singular/plural language throughout

3. **inspector-provided** - Boolean, toggles entire assistance paragraph

### Consolidation Examples:

| Don't Create | Use Existing Instead |
|--------------|----------------------|
| `building-count` | `total-buildings` |
| `capitalization-rate` | `calc-cap-rate` |
| `net-operating-income` | `calc-noi` |
| `city-name` | `city` |
| `market-name` | `market` |

**See existing-fields-mapping.json for complete list**

---

## Implementation Steps

### Step 1: Review Consolidation (30 min)
1. Open `existing-fields-mapping.json`
2. Review 37 "similar_mappings" entries
3. Decide which existing fields to use instead of creating new ones
4. Goal: Reduce 77 new fields to ~31

### Step 2: Add New Fields to Registry (1 hour)
1. Open `new-fields-needed.json`
2. For each field NOT consolidated, add to `fieldRegistry.ts`
3. Follow existing structure:
```typescript
{
  id: 'field-id',
  storeId: 'field-id',  // Must match id
  label: 'Human Label',
  section: 'cover|exec|site|impv|calc|etc',
  type: 'text|textarea|number|date|currency|percentage|select',
  inputSource: 'user-input|calculated|template|auto-filled',
  required: true|false,
  defaultValue: 'optional default'
}
```

### Step 3: Create Conditional Logic Helpers (1 hour)
1. Open `conditional-logic-requirements.json`
2. Create helper function for value-scenario-type:
```typescript
function getValueScenarioContent(scenarioType: string) {
  return {
    hypotheticalConditions: /* text variant */,
    extraordinaryAssumptions: /* text variant */,
    hbuScenario: /* As Improved | As Proposed */,
    scenarioDescription: /* text variant */
  };
}
```
3. Create building-count helper (singular/plural)
4. Create boolean helpers (inspector-provided, pending-sale, include-demographics)

### Step 4: Create Calculated Field Helpers (30 min)
```typescript
function getPropertyFullAddress(fields: any) {
  return `${fields['street-address']}, ${fields['city']}, ${fields['province']}`;
}

function getClientAddressFull(fields: any) {
  return `${fields['client-address']}, ${fields['client-city']}, ${fields['client-province']} ${fields['client-postal']}`;
}

function getContractRentPercent(contractRent: number, marketRent: number) {
  return ((contractRent / marketRent) * 100).toFixed(1);
}
```

### Step 5: Update Template with Consolidated Names (2 hours)
1. Replace all `{{field-name}}` with consolidated registry field IDs
2. Use calculated helpers for composite fields
3. Integrate conditional logic helpers
4. Example:
```typescript
// OLD:
const cityName = getFieldValue('city-name');

// NEW (use existing):
const cityName = getFieldValue('city');

// CALCULATED:
const fullAddress = getPropertyFullAddress(fields);

// CONDITIONAL:
const scenarioContent = getValueScenarioContent(fields['value-scenario']);
```

### Step 6: Test Integration (1 hour)
1. Load North Battleford property data
2. Render template
3. Verify all 99 fields resolve
4. Check conditional logic works
5. Validate against original PNG pages

---

## Critical Conditionals

### 1. Value Scenario (MUST IMPLEMENT FIRST)

```typescript
const scenarioContent = getValueScenarioContent(fields['value-scenario']);

// Use scenarioContent.hypotheticalConditions in Hypothetical Conditions section
// Use scenarioContent.extraordinaryAssumptions in Extraordinary Assumptions section
// Use scenarioContent.hbuScenario for H&B Use
// Use scenarioContent.scenarioDescription in transmittal letter
```

### 2. Building Count

```typescript
const buildingText = fields['total-buildings'] === 1
  ? 'comprised of 1 building'
  : `comprised of ${fields['total-buildings']} total buildings`;
```

### 3. Inspector Provided

```typescript
const assistanceText = fields['inspector-provided'] === true
  ? `${fields['inspector-name']} of ${fields['inspector-company']}...`
  : 'No one provided real property appraisal assistance...';
```

---

## Field Defaults

Apply these defaults for missing optional fields:

```typescript
const defaults = {
  'extraordinary-limiting-conditions': 'No Extraordinary Limiting Conditions were made for this assignment.',
  'exposure-time-conclusion': 'six months',
  'project-amenities': 'Guest Parking',
  'unit-amenities': 'Deck/Patio, Range/Stove, Refrigerator',
  'laundry': 'On Site',
  'security': 'Deadbolts, Exterior Lighting, Secured Entry',
  'elevator': 'None',
  'insulation': 'Fiberglass',
  'lighting': 'Various',
  'authorized-use': 'first mortgage financing purposes',
  'zoning-change-statement': 'No zoning change is believed to be imminent.'
};
```

---

## Validation Rules

Before rendering template, validate:

```typescript
// Required for all scenarios:
if (!fields['value-scenario']) throw new Error('value-scenario-type required');
if (!fields['property-name']) throw new Error('property-name required');
if (!fields['valuation-date']) throw new Error('valuation-date required');

// Conditional requirements:
if (fields['value-scenario'] === 'As If Renovated & Stabilized') {
  if (!fields['capex-budget-total']) throw new Error('capex-budget-total required for renovation scenario');
}

if (fields['inspector-provided'] === true) {
  if (!fields['inspector-name']) throw new Error('inspector-name required when inspector-provided is true');
}

if (fields['pending-sale'] === true) {
  if (!fields['pending-sale-price']) throw new Error('pending-sale-price required when pending-sale is true');
}
```

---

## Success Criteria

### You're Done When:
1. All 99 template fields resolve to either:
   - Existing registry field (22 fields)
   - Consolidated registry field (37 fields)
   - Calculated field (9 fields)
   - New registry field (31 fields)

2. All 8 conditional scenarios work:
   - value-scenario-type (4 content variants)
   - building-count (singular/plural)
   - inspector-provided (boolean)
   - pending-sale (boolean)
   - include-demographics (boolean)
   - year-built-weighted (conditional)
   - client-title (conditional)
   - capital-expenditures (conditional)

3. Template renders correctly:
   - North Battleford property matches original
   - Drumheller property matches original
   - All sections present
   - No undefined/null values
   - Conditional content appears correctly

---

## Troubleshooting

### "Field not found" errors:
1. Check `existing-fields-mapping.json` - might be using wrong name
2. Check if field should be calculated instead of stored
3. Verify field was added to registry with correct storeId

### Conditional content not showing:
1. Check value-scenario-type is set correctly
2. Verify conditional helper functions return correct content
3. Check boolean fields are true/false (not 'true'/'false' strings)

### Missing data in rendered output:
1. Check field has data in reportBuilderStore
2. Verify getFieldValue() is using correct field ID
3. Check if field should have default value applied

---

## Files to Modify

### Add Fields:
- `/src/features/report-builder/schema/fieldRegistry.ts` - Add ~31 new fields

### Create Helpers:
- `/src/features/report-builder/utils/templateHelpers.ts` - New file for helpers
- `/src/features/report-builder/utils/fieldDefaults.ts` - New file for defaults

### Update Template:
- `/src/features/report-builder/templates/reportHtmlTemplate.ts` - Replace with new structure

---

## Next Session Handoff

**When you're done, document:**
1. Which fields were consolidated (actual list)
2. Which fields were added to registry (actual count)
3. Any fields that couldn't be mapped (edge cases)
4. Test results with both properties
5. Any issues encountered

**Create file:** `INTEGRATION-COMPLETE.md` with results

---

**Remember:** This is NOT a new system. You're INTEGRATING with existing fieldRegistry and reportBuilderStore. Use existing field IDs wherever possible.

**Priority:** value-scenario-type conditional is most critical. Get that working first.

---

**Good luck!**
