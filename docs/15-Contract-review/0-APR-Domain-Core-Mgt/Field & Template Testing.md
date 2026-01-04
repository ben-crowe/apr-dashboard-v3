# Field & Template Testing Guide

**Created:** 2026-01-04
**Updated:** 2026-01-04
**Purpose:** Document field creation, testing methods, and debugging workflow

---

## Key Definitions

### fieldRegistry.ts

**Single source of truth** that defines every field in the system.

| Property | Description |
|----------|-------------|
| `id` | Unique field identifier |
| `label` | Display name |
| `type` | text, number, date, dropdown, etc. |
| `section` | Which section it belongs to (cover, site, calc, etc.) |
| `inputSource` | 'user-input' or 'calculated' |
| `defaultValue` | Starting value (optional) |

**What it does:**
- Tells the store what fields exist and how to build them
- Tells the calc engine which fields are inputs vs outputs
- Reference for TestDataSet1 to know what IDs are valid

**File:** `/src/features/report-builder/schema/fieldRegistry.ts`

---

### Data vs Scripts

**DATA:** `TestDataSet1.ts` - Contains all test field values for sample property

**SCRIPTS:** Functions that perform ACTIONS on the data
- `loadFullTestData` - Test 2 action (loads all fields to App Fields)
- `testScriptUserInputsCalc` - Test 3 action (user inputs → calc)

---

## Step 0 - Field Creation

Before testing, fields must be created in three places:

### Step 0a - Define Field (fieldRegistry.ts)
```typescript
{
  id: 'city',
  storeId: 'city',
  label: 'City',
  type: 'text',
  section: 'cover',
  inputSource: 'user-input'
}
```

### Step 0b - Add to EditPanel Layout (EditPanel.tsx)
```typescript
const COVER_FIELD_LAYOUT = [
  { id: 'city', label: 'City' },
  // ...
];
```
**Note:** Currently HARDCODED. If field not in layout array → won't show in Editor Panel.

### Step 0c - Add to Template (Report-MF-template.html)
```html
<span class="field-mapped" data-sample="North Battleford">{{city}}</span>
```

**Field ID must match exactly across all three locations.**

---

## Three Testing Methods

All tests use **TestDataSet1** - same data source.

---

### Test 1 - HTML Placement/Designer Test

**Purpose:** Verify field ID is placed correctly on template page

1. `TestDataSet1` values hardcoded as `data-sample` attributes in template
2. Toggle switch swaps between `{{field-id}}` and sample values
3. **How to trigger:**
   - a: Toggle switch in template header frame
   - b: TDD page → 'Designer Mode' → 'Preview Builder'

**Example:**
```html
<span class="field-mapped" data-sample="North Battleford" title="{{city}}">{{city}}</span>
```
- Toggle OFF: Shows `{{city}}`
- Toggle ON: Shows `North Battleford`

**Source:** `/public/Report-MF-template.html`

---

### Test 2 - TDD ID Test (Load All Fields)

**Purpose:** Verify field IDs exist in store and can accept values

1. Script: `loadFullTestData` reads from `TestDataSet1`
2. Loads ALL fields into App Fields (TDD page) for review
3. **How to trigger:**
   - a: TDD page → 'Load Test Data' button
   - b: Request agent to run script

**Workflow:** Review all fields have values in TDD → then proceed to Test 3

**Source:** `/src/features/report-builder/store/reportBuilderStore.ts` - `loadFullTestData()`

---

### Test 3 - Production Flow (User Inputs + Calc)

**Purpose:** Verify full production flow works

1. Script: `testScriptUserInputsCalc` reads from `TestDataSet1`
2. Loads only USER INPUT data to App Fields, then runs calc engine
3. **How to trigger:**
   - a: TDD page → 'Test Report' → 'View in Report'
   - b: Request agent to run script

**Source:** `/src/features/report-builder/store/reportBuilderStore.ts` - `testScriptUserInputsCalc()`

---

### Summary: Data Flow

| Step | What it tests | Data Flow |
|------|---------------|-----------|
| Test 1 | ID placement on page | Baked into HTML (`data-sample`) |
| Test 2 | ID exists in store | Script → App Fields (TDD review) |
| Test 3 | Full production flow | Script → App Fields → Calc Engine → Template |

**Two ways data reaches template:**
- Test 1: Hardcoded in HTML
- Test 3: App Fields → Calc → Template

---

## Step 4 - Debug (When Field Doesn't Work)

If a field doesn't display correctly, check these three locations for the SAME field ID:

| Check | File | What to look for |
|-------|------|------------------|
| 1. Registry | `fieldRegistry.ts` | Is ID defined? |
| 2. Test Data | `TestDataSet1.ts` | Does test data have this ID? |
| 3. Template | `Report-MF-template.html` | Does template have `{{field-id}}`? |

**Quick debug commands:**
```bash
# Check all three files for a field ID
grep "'city'" src/features/report-builder/schema/fieldRegistry.ts
grep '"city"' src/features/report-builder/data/TestDataSet1.ts
grep '{{city}}' public/Report-MF-template.html
```

**Common issues:**
- ID mismatch (typo, different casing)
- Field in registry but not in EditPanel layout
- Field in test data but wrong key name

---

## TDD Page Control Panel (`/test-input`)

| Button | Color | Action |
|--------|-------|--------|
| **Refresh** | Gray | Hard page reload |
| **Load Test Data** | - | Test 2 - loads all fields to App Fields |
| **Test Report** | Blue | Test 3 - user inputs + calc engine |
| **Designer Mode** | Purple | Enables Test 1 toggle in template |
| **Preview in Builder** | Green | View in `/mock-builder` |

**Stats bar shows:**
- Mapped: X (fields with values)
- Empty: X (fields in store but no value)
- Missing: X (fields in registry but not in store)
- Coverage: X%

**Source:** `/src/features/test-input/TestInputDashboard.tsx`

---

## Field Verification Report Card Format

When auditing fields, check ALL THREE sources and report mismatches:

### Report Card Template

```
## Page: [Page Name]
**Audit Date:** YYYY-MM-DD

### Field Status Table

| Field ID (Template) | In Registry? | In Test Data? | Test Data Key | Section Match? | Status |
|---------------------|--------------|---------------|---------------|----------------|--------|
| `field-id`          | YES/NO       | YES/NO        | `key-name`    | YES/NO         | OK/BROKEN |

### Issues Found
1. **ID Mismatch:** Template uses `X`, test data has `Y`
2. **Missing Data:** Field `X` has no test value
3. **Section Issue:** Field `X` registered in section `Y` but template looks in `Z`

### Fixes Required
- [ ] Fix 1
- [ ] Fix 2
```

---

## Cover Page Audit (2026-01-04)

### Template Field Extraction

**Source:** `/src/features/report-builder/templates/reportHtmlTemplate.ts` lines 60-105

Cover page variables extracted from `coverSection`:

| Variable | Field ID Used | Line |
|----------|---------------|------|
| propertyType | `property-type-display` | 61 |
| propertyName | `property-name` | 62 |
| streetAddress | `street-address` | 63 |
| city | `city` | 64 |
| province | `province` | 65 |
| clientContactName | `client-contact-name` | 66 |
| clientCompany | `client-company` | 67 |
| clientAddress | `client-address` | 68 |
| clientCity | `client-city` | 69 |
| clientProvince | `client-province` | 70 |
| clientPostal | `client-postal` | 71 |
| appraiserCompany | `appraiser-company` | 72 |
| appraiserAddress | `appraiser-address` | 73 |
| appraiserCity | `appraiser-city` | 74 |
| appraiserProvince | `appraiser-province` | 75 |
| appraiserPostal | `appraiser-postal` | 76 |
| appraiserPhone | `appraiser-phone` | 77 |
| appraiserWebsite | `appraiser-website` | 78 |
| valuationDate | `valuation-date` | 79 |
| reportDate | `report-date` | 80 |
| fileNumber | `file-number` | 81 |
| appraiserName | `appraiser-name` | 101 |
| appraiserCredentials | `appraiser-credentials` | 102 |
| appraiserTitle | `appraiser-title` | 103 |
| appraiserEmail | `appraiser-email` | 104 |
| appraiserAicNumber | `appraiser-aic-number` | 105 |
| coverPhoto | `img-cover-photo` | 195-197 (global) |

---

### Field Status Table - Cover Page

| Field ID (Template) | In Registry? | Registry Section | In Test Data? | Test Data Key | Status |
|---------------------|--------------|------------------|---------------|---------------|--------|
| `property-type-display` | YES | cover | NO | `property-type` | **BROKEN** - ID mismatch |
| `property-name` | YES | cover | YES | `property-name` | OK |
| `street-address` | YES | cover | YES | `street-address` | OK |
| `city` | YES | cover | YES | `city` | OK |
| `province` | YES | cover | NO | - | **BROKEN** - no test value |
| `client-contact-name` | NO | - | NO | `client-name` | **BROKEN** - ID mismatch |
| `client-company` | YES | client-intake | YES | `client-company` | OK |
| `client-address` | YES | cover | YES | `client-address` | OK |
| `client-city` | YES | cover | YES | `client-city` | OK |
| `client-province` | YES | cover | YES | `client-province` | OK |
| `client-postal` | YES | client-intake | YES | `client-postal` | OK |
| `appraiser-company` | YES | loe-prep | NO | - | **BROKEN** - no test value |
| `appraiser-address` | YES | cover | NO | - | **BROKEN** - no test value |
| `appraiser-city` | YES | cover | NO | - | **BROKEN** - no test value |
| `appraiser-province` | YES | cover | NO | - | **BROKEN** - no test value |
| `appraiser-postal` | YES | cover | NO | - | **BROKEN** - no test value |
| `appraiser-phone` | YES | loe-prep | NO | - | **BROKEN** - no test value |
| `appraiser-website` | YES | cover | NO | - | **BROKEN** - no test value |
| `valuation-date` | YES | loe-prep | YES | `valuation-date` | OK (section mismatch) |
| `report-date` | YES | loe-prep | YES | `report-date` | OK (section mismatch) |
| `file-number` | YES | cover | NO | `job-number` | **BROKEN** - ID mismatch |
| `appraiser-name` | YES | loe-prep | YES | `appraiser-name` | OK |
| `appraiser-credentials` | YES | loe-prep | YES | `appraiser-credentials` | OK |
| `appraiser-title` | YES | loe-prep | YES | `appraiser-title` | OK |
| `appraiser-email` | YES | loe-prep | YES | `appraiser-email` | OK |
| `appraiser-aic-number` | YES | loe-prep | NO | `appraiser-aic` | **BROKEN** - ID mismatch |
| `img-cover-photo` | YES | image-mgt | YES | `img-cover-photo` | OK |

---

### Issues Found - Cover Page

#### Issue 1: ID Mismatches (Template vs Test Data)

| Template Uses | Test Data Has | Fix Required |
|---------------|---------------|--------------|
| `client-contact-name` | `client-name` | Add `client-contact-name` to registry OR change template to use `client-name` |
| `property-type-display` | `property-type` | Add `property-type-display` to test data OR create alias |
| `file-number` | `job-number` | Add `file-number` to test data OR create alias |
| `appraiser-aic-number` | `appraiser-aic` | Add `appraiser-aic-number` to test data OR create alias |

#### Issue 2: Missing Test Data Values

These fields exist in registry but have NO test data values:

| Field ID | Label | Impact |
|----------|-------|--------|
| `appraiser-company` | Company Name | PREPARED BY section blank |
| `appraiser-address` | Company Address | PREPARED BY section blank |
| `appraiser-city` | Company City | PREPARED BY section blank |
| `appraiser-province` | Company Province | PREPARED BY section blank |
| `appraiser-postal` | Company Postal | PREPARED BY section blank |
| `appraiser-phone` | Company Phone | PREPARED BY section blank |
| `appraiser-website` | Company Website | PREPARED BY section blank |
| `province` | Province | City/Province line incomplete |

#### Issue 3: Section Assignment Concerns

Template uses `getFieldValue(coverSection, 'field-id')` but some fields are registered in other sections:

| Field ID | Registered In | Template Looks In |
|----------|---------------|-------------------|
| `appraiser-company` | loe-prep | coverSection |
| `appraiser-phone` | loe-prep | coverSection |
| `valuation-date` | loe-prep | coverSection |
| `report-date` | loe-prep | coverSection |

**Note:** The template uses a `getFieldValue` helper that searches through sections, so cross-section lookups may still work. Need to verify.

---

### Fixes Required - Cover Page

- [x] Add `client-contact-name` alias to test data (FIXED 2026-01-04 v2.5.0)
- [x] Add `property-type-display` alias to test data (FIXED 2026-01-04 v2.5.0)
- [x] Add `file-number` alias to test data (FIXED 2026-01-04 v2.5.0)
- [x] Add `appraiser-aic-number` alias to test data (FIXED 2026-01-04 v2.5.0)
- [x] Add appraiser company info to test data (FIXED 2026-01-04 v2.5.0):
  - `appraiser-company`: "Valta Property Valuations Ltd."
  - `appraiser-address`: "#300-6858 Richard Road SW"
  - `appraiser-city`: "Calgary"
  - `appraiser-province`: "AB"
  - `appraiser-postal`: "T3E 6L1"
  - `appraiser-phone`: "587-801-5151"
  - `appraiser-website`: "www.valta.ca"
- [x] `province` already exists in test data (line 1206: "Saskatchewan") - registered in cover section

**All 11 broken fields fixed in northBattlefordTestData.ts v2.5.0**

---

## The Architecture Disconnect (CRITICAL)

### Original Architecture (Dynamic - Worked Well)
```
fieldRegistry.ts → Store → EditPanel → Template
     ↓               ↓         ↓           ↓
  Source of      Dynamic    Dynamic     Renders
   Truth         build      sync        fields
```
- TDD page loaded test data by default
- EditPanel auto-synced from registry
- Adding field to registry = appears in EditPanel automatically
- Fields guaranteed in sync

### Current Architecture (Broken Sync)
```
fieldRegistry.ts → Store (DYNAMIC) → EditPanel (STATIC) → Template
     ↓                  ↓                  ↓                 ↓
  1,687 fields    buildAllSections    *_FIELD_LAYOUT      Renders
                  FromRegistry()      hardcoded arrays
```

**The Problem:**
- **Store:** Uses `buildAllSectionsFromRegistry()` - DYNAMIC from registry
- **EditPanel:** Uses `HOME_FIELD_LAYOUT`, `COVER_FIELD_LAYOUT`, etc. - HARDCODED
- Adding field to registry creates it in store but NOT in EditPanel
- User can't see or edit fields that exist in registry but not in layout configs

### Why This Happened
Dynamic sync was disabled to allow manual field layout/positioning control.
The trade-off: Flexibility in UI layout vs automatic field sync.

### Files Involved
| File | Role | Dynamic? |
|------|------|----------|
| `fieldRegistry.ts` | Source of truth (1,687 fields) | N/A |
| `reportBuilderStore.ts` | Store sections | YES - `buildAllSectionsFromRegistry()` |
| `EditPanel.tsx` | UI field display | NO - `*_FIELD_LAYOUT` configs |
| `northBattlefordTestData.ts` | Test values | N/A |
| Template (HTML) | Renders `{{field-id}}` | N/A |

---

## The Verification Gap

Previous agent verification checked:
- "Does field exist in registry?" YES/NO
- "Does test data have this key?" YES/NO

**But NOT:**
- "Does template use the SAME field ID as registry?"
- "Does test data use the SAME key as template expects?"
- "Can the lookup function find it in the right section?"
- **"Is the field in the EditPanel hardcoded layout?"** (NEW - Critical!)

### Proper Verification Protocol (Updated)

For each field on a page:

1. **Extract field ID from template** - What ID does the HTML/TS actually use?
2. **Check registry** - Is that exact ID in fieldRegistry.ts?
3. **Check test data** - Is that exact key in northBattlefordTestData.ts?
4. **Check section alignment** - Does template lookup match registry section?
5. **Check EditPanel layout** - Is field in the `*_FIELD_LAYOUT` config for its section?
6. **Visual verification** - Does the field show data in the actual rendered preview?

Only when ALL SIX pass is a field truly "mapped and working."

### Quick Check Commands

```bash
# 1. Check if field exists in registry
grep "'field-id'" src/features/report-builder/schema/fieldRegistry.ts

# 2. Check if field has test data
grep '"field-id"' src/features/report-builder/data/northBattlefordTestData.ts

# 3. Check if field is in EditPanel layout (CRITICAL!)
grep "'field-id'" src/features/report-builder/components/EditPanel/EditPanel.tsx
```

---

## Audit Log

| Date | Page | Auditor | Issues Found | Fixed |
|------|------|---------|--------------|-------|
| 2026-01-04 | Cover Page | Claude Opus | 11 broken fields | YES - v2.5.0 |

---

*Document maintained by APR Dashboard development team*
