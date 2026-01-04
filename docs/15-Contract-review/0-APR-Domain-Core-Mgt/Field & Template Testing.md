# Field & Template Testing Guide

**Created:** 2026-01-04
**Purpose:** Document the two template testing mechanisms and track field mapping verification findings

---

## Two Template Testing Mechanisms

### 1. Template Wrapper Toggle (Report-MF-template.html)

**Location:** Top control bar in the template viewer - labeled "ID" with a toggle switch

**What it does:**
- **OFF (unchecked):** Shows raw field IDs like `{{subject-street}}`, `{{city}}`, `{{job-number}}`
- **ON (checked):** Swaps to **sample data** stored in `data-sample` attributes

**Example field structure:**
```html
<span class="field-mapped" data-sample="North Battleford" title="{{city}}">{{city}}</span>
```
- Toggle OFF: Shows `{{city}}`
- Toggle ON: Shows `North Battleford`

**Purpose:**
- **Designer view** - See what field IDs are where without needing store data
- Quick visual check of field placement
- **Financial fields (calc-*, ia-*, recon-*)** are excluded from toggle - they're controlled by the calculator only

**Source:** `/public/Report-MF-template.html` lines 553-560 (toggle UI), lines 8875-8908 (toggle logic)

---

### 2. TDD Page Control Panel (`/test-input`)

**Location:** Top bar with colored buttons

| Button | Color | What it does |
|--------|-------|--------------|
| **Refresh** | Gray | Hard page reload |
| **Test Report** | Blue | Loads ONLY `user-input` fields from test data, clears calculated fields, then runs calc engine. Validates: "Do calculations work from real inputs?" |
| **Designer Mode** | Purple | Enables the template toggle. Use with "Load Full Test Data" button in Report Builder to see all fields populated |
| **Preview in Builder** | Green | Navigates to `/mock-builder` with current data |

**Stats bar shows:**
- Mapped: X (fields with values)
- Empty: X (fields in store but no value)
- Missing: X (fields in registry but not in store)
- Coverage: X%

**Source:** `/src/features/test-input/TestInputDashboard.tsx` lines 760-892

---

### How They Work Together

```
+-------------------------------------------------------------+
|  TDD Page (/test-input)                                     |
|  +-----------------------------------------------------+   |
|  | [Test Report] [Designer Mode] [Preview in Builder]  |   |
|  +-----------------------------------------------------+   |
|                           |                                 |
|          Loads data into store, sets mode                   |
|                           v                                 |
+-------------------------------------------------------------+
|  Report Builder (/mock-builder)                             |
|  +-----------------------------------------------------+   |
|  | EditPanel | PreviewPanel (iframe)                   |   |
|  |           |  +----------------------------------+   |   |
|  |           |  | [Toggle: ID <-> Sample]          |   |   |
|  |           |  | Renders: Report-MF-template.html |   |   |
|  |           |  +----------------------------------+   |   |
|  +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

**Test Report mode:** Toggle disabled, always shows interpolated store values
**Designer mode:** Toggle enabled, can switch between IDs and sample data

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

## The Verification Gap

Previous agent verification checked:
- "Does field exist in registry?" YES/NO
- "Does test data have this key?" YES/NO

**But NOT:**
- "Does template use the SAME field ID as registry?"
- "Does test data use the SAME key as template expects?"
- "Can the lookup function find it in the right section?"

### Proper Verification Protocol

For each field on a page:

1. **Extract field ID from template** - What ID does the HTML/TS actually use?
2. **Check registry** - Is that exact ID in fieldRegistry.ts?
3. **Check test data** - Is that exact key in northBattlefordTestData.ts?
4. **Check section alignment** - Does template lookup match registry section?
5. **Visual verification** - Does the field show data in the actual rendered preview?

Only when ALL FIVE pass is a field truly "mapped and working."

---

## Audit Log

| Date | Page | Auditor | Issues Found | Fixed |
|------|------|---------|--------------|-------|
| 2026-01-04 | Cover Page | Claude Opus | 11 broken fields | YES - v2.5.0 |

---

*Document maintained by APR Dashboard development team*
