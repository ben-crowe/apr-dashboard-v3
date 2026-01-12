# Home Tab Input Fields

These are the USER INPUT fields for the Report Builder Home Tab.

**Loads via:** "Load Test Data" button in Home section of EditPanel
**Rule:** User enters these. Template displays them in appropriate locations.

---

## Job Setup

Controls report identification and status.

- **Job ID:** `home-job-id`  |  VAL251012  |  Valcre job reference
- **Job Status:** `home-job-status`  |  In Progress  |  Draft / In Progress / Complete
- **Report Date:** `home-report-date`  |  2025-01-15  |  Date of report

---

## Client Information

Client details for letter of engagement and report cover.

- **Client Name:** `home-client-name`  |  Kenneth Engler  |  Full name of client
- **Client Company:** `home-client-company`  |  102109845 Saskatchewan Ltd.  |  Organization name
- **Client Email:** `home-client-email`  |  kengler@example.com  |  Contact email
- **Client Phone:** `home-client-phone`  |  (306) 555-1234  |  Contact phone
- **Street Address:** `home-client-address-street`  |  1901, 1088 - 6th Ave SW  |  Street address
- **City:** `home-client-address-city`  |  Calgary  |  City name
- **Province/State:** `home-client-address-state`  |  Alberta  |  Province or state
- **Postal Code:** `home-client-address-postal`  |  T3E 6L1  |  Postal/ZIP code
- **Client Reference:** `home-client-reference`  |  (optional)  |  Client's internal reference

---

## Appraiser Information

Appraiser credentials for certification page.

- **Appraiser Name:** `home-appraiser-name`  |  Chris Chornohos, AACI, MRICS  |  Full name with designations
- **Designation:** `home-appraiser-designation`  |  AACI, MRICS  |  Professional designations
- **License Number:** `home-appraiser-license`  |  A12345  |  AIC or provincial license
- **Email:** `home-appraiser-email`  |  chris.chornohos@valta.ca  |  Appraiser email
- **Phone:** `home-appraiser-phone`  |  (optional)  |  Appraiser phone
- **Company:** `home-appraiser-company`  |  Valta Group Inc.  |  Firm name

---

## Property Information

Subject property details for cover and throughout report.

- **Property Name:** `home-property-name`  |  North Battleford Apartments  |  Common name of property
- **Street Address:** `home-property-address-street`  |  1101, 1121 109 St  |  Street address
- **City:** `home-property-address-city`  |  North Battleford  |  City name
- **Province:** `home-property-address-province`  |  Saskatchewan  |  Province
- **Postal Code:** `home-property-address-postal`  |  (optional)  |  Postal code
- **Property Type:** `home-property-type`  |  Multi-Family  |  Property classification
- **Legal Description:** `home-property-legal-description`  |  Plan - C4240; Block - 95; Lot - 17,18,19,20  |  Legal land description
- **PID/Parcel Number:** `home-property-pid`  |  (optional)  |  Parcel identifier

---

## Assignment Details

Assignment scope and parameters.

- **Report Type:** `home-report-type`  |  Appraisal Report  |  Narrative / Form / Restricted
- **Property Rights:** `home-property-rights`  |  Fee Simple Estate  |  Rights being appraised
- **Intended Use:** `home-intended-use`  |  Mortgage Financing  |  Purpose of the appraisal
- **Intended Users:** `home-intended-users`  |  102109845 Saskatchewan Ltd.  |  Authorized users
- **Scope of Work:** `home-scope-of-work`  |  Complete appraisal including all three approaches...  |  Work to be performed

---

## Property Contact

On-site contact for property access (if different from client).

- **Contact Name:** `home-contact-name`  |  (optional)  |  Property manager name
- **Contact Title:** `home-contact-title`  |  (optional)  |  Title/position
- **Contact Phone:** `home-contact-phone`  |  (optional)  |  Phone number
- **Contact Email:** `home-contact-email`  |  (optional)  |  Email address
- **Inspection Date:** `home-inspection-date`  |  (optional)  |  Date of property inspection

---

## Special Conditions

Extraordinary assumptions and limiting conditions.

- **Extraordinary Assumptions:** `home-extraordinary-assumptions`  |  No Extraordinary Assumptions were made...  |  Any special assumptions
- **Hypothetical Conditions:** `home-hypothetical-conditions`  |  (optional)  |  Hypothetical scenarios
- **Limiting Conditions:** `home-limiting-conditions`  |  No Extraordinary Limiting Conditions...  |  Additional limitations

---

## Field Mapping: Source to Home

Maps source fields from `northBattlefordTestData.ts` to `home-*` field IDs.

**Client Fields:**
- `client-first-name` + `client-last-name` → `home-client-name`
- `client-organization` → `home-client-company`
- `client-email` → `home-client-email`
- `client-phone` → `home-client-phone`
- `client-address` → `home-client-address-street`
- `client-city` → `home-client-address-city`
- `client-province` → `home-client-address-state`

**Appraiser Fields:**
- `appraiser-name` → `home-appraiser-name`
- `appraiser-credentials` → `home-appraiser-designation`
- `appraiser-email` → `home-appraiser-email`
- `appraiser-aic` → `home-appraiser-license`

**Property Fields:**
- `property-name` → `home-property-name`
- `street-address` / `property-address` → `home-property-address-street`
- `city` → `home-property-address-city`
- `province` → `home-property-address-province`
- `property-type` → `home-property-type`
- `report-legal` → `home-property-legal-description`

**Assignment Fields:**
- `report-type` → `home-report-type`
- `property-rights` → `home-property-rights`
- `intended-use` → `home-intended-use`
- `intended-user` → `home-intended-users`
- `scope-of-work` → `home-scope-of-work`

---

## Implementation Location

**Store Function:** `loadHomeTestData()` in `reportBuilderStore.ts:6140`
**Button Location:** `EditPanel.tsx:544-562` (Home section only)
**Field Definitions:** `reportBuilderStore.ts:878-1224` (initializeMockData)

---

## Total Fields: 37

- Job Setup: 3
- Client Information: 9
- Appraiser Information: 6
- Property Information: 8
- Assignment Details: 5
- Property Contact: 5
- Special Conditions: 3

---

## Adding New Home Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadHomeTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button
