# Field Mapping - Page 65 (Final Estimate of Value)

**Page:** 65 - Valuation & Conclusions - Final Estimate of Value
**Location in HTML:** Lines 7106-7174
**Total Fields:** 11 (9 new + 2 footer fields)
**Status:** ⏳ Documentation Created | HTML Update Pending

---

## Overview

Page 65 presents the final market value conclusion for the subject property. This is the culminating page where all valuation approaches converge into a single, supported value opinion. The page includes:

1. **Market Value Conclusion Table** - Single-row table with valuation parameters and final value
2. **Hypothetical Conditions** - USPAP-compliant disclosure of "As Stabilized" scenario
3. **Extraordinary Assumptions** - Any unusual assumptions made during valuation
4. **Extraordinary Limiting Conditions** - Any unusual limiting conditions
5. **Signature Block** - Appraiser signature image and professional credentials

All field IDs will be converted to kebab-case format for consistency with the established registry pattern across all pages.

---

## Field Crosswalk

| # | HTML Field ID (Registry) | Valcre Source | Sample Value | Notes |
|---|-------------------------|---------------|--------------|-------|
| **Market Value Conclusion - 5 fields** |
| 1 | `valuation-scenario` | VALUES.ValuationScenario | "As Stabilized" | Valuation premise (As Is, As Stabilized, Prospective) |
| 2 | `interest-appraised` | VALUES.InterestAppraised | "Fee Simple Estate" | Property interest being valued |
| 3 | `exposure-time` | VALUES.ExposureTime | "Six Months" | Estimated marketing time for property |
| 4 | `effective-date` | VALUES.EffectiveDate | "October 17, 2025" | Date of value estimate |
| 5 | `final-value-conclusion` | VALUES.FinalValue | "$1,800,000" | Concluded market value (formatted currency) |
| **Appraiser Credentials - 4 fields** |
| 6 | `appraiser-name-credentials` | APPRAISER.NameCredentials | "Chris Chornohos, AACI, MRICS" | Full name with professional designations |
| 7 | `appraiser-title` | APPRAISER.Title | "Founder" | Job title or position |
| 8 | `appraiser-email` | APPRAISER.Email | "chris.chornohos@valta.ca" | Contact email |
| 9 | `appraiser-aic-number` | APPRAISER.AICNumber | "90209" | Appraisal Institute of Canada membership number |
| **Footer Fields - 2 fields (existing)** |
| 10 | `property-address` | PROPERTY.Address | "1101, 1121 109 St, North Battleford, Saskatchewan" | Subject property address |
| 11 | `file-number` | REPORT.FileNumber | "VAL251012 - 1" | Internal file tracking number |

---

## Table Structure

### Market Value Conclusion Table

**Purpose:**
Single-row table displaying the final value conclusion with supporting parameters required by USPAP (Uniform Standards of Professional Appraisal Practice).

**Columns (5):**
1. **Valuation Scenario** - Premise of value (As Is, As Stabilized, Prospective)
2. **Interest Appraised** - Legal interest being valued (Fee Simple, Leased Fee, etc.)
3. **Exposure Time** - Estimated time to market and sell the property
4. **Effective Date** - Date as of which the value is estimated
5. **Value** - Final concluded market value (bold, emphasized)

**Styling:**
- Table header: Dark blue (#003B7E) with white text, uppercase
- Column headers: 8pt font, uppercase, center-aligned
- Data row: 10pt font, center-aligned, bordered bottom with 2px blue line
- Final value column: Bold font weight for emphasis
- Table margin: 12px top for spacing from paragraph

**Data Pattern:**
All cells contain dynamic field values using the `field-mapped` class with `data-sample` attributes for testing.

---

## Field Category: Value Conclusion

**Registry Category:** `value-conclusion`

**Field Types:**
- Valuation scenario: select (options: "As Is", "As Stabilized", "Prospective")
- Interest appraised: select (options: "Fee Simple Estate", "Leased Fee Estate", "Leasehold Estate")
- Exposure time: text (e.g., "Six Months", "90-120 Days")
- Effective date: date (formatted as "Month DD, YYYY")
- Final value conclusion: currency (formatted with $ and commas)

**Validation Rules:**
- Effective date must be ≤ report date
- Final value must be > $0
- Valuation scenario must align with analysis in report body
- Interest appraised must match property ownership type

---

## Field Category: Appraiser Information

**Registry Category:** `appraiser`

**Field Types:**
- Name with credentials: text (Name + professional designations)
- Title: text (job position)
- Email: email (validated format)
- AIC number: text (5-digit membership number)

**Data Sources:**
- Appraiser profile in Valcre system
- Company directory
- Professional association records (AIC, RICS, etc.)

---

## Data Source: Values & Appraiser Profile

**Sources for These Fields:**

**Market Value Fields:**
- Valuation scenario: Determined during scope of work definition
- Interest appraised: From property records and engagement letter
- Exposure time: Derived from market analysis and comparable sales
- Effective date: Specified in engagement letter or inspection date
- Final value: Reconciliation of all valuation approaches (Pages 62-63)

**Appraiser Fields:**
- Name/credentials: User profile in Valcre
- Title: User profile or company directory
- Email: User profile contact information
- AIC number: Professional association membership records

**How These Fields Are Used:**
1. **Value conclusion** establishes the final market value opinion
2. **Valuation parameters** provide context and compliance with USPAP requirements
3. **Signature block** authenticates the report and provides appraiser accountability
4. **Contact information** allows readers to reach appraiser with questions

---

## HTML Code Pattern

```html
<!-- Market Value Conclusion Table -->
<table style="width: 100%; border-collapse: collapse; font-size: 10pt; margin-top: 12px;">
    <thead>
        <tr>
            <th colspan="5" style="background-color: #003B7E; color: white; font-weight: bold; text-transform: uppercase; padding: 8px; text-align: center;">Market Value Conclusion</th>
        </tr>
        <tr style="border-bottom: 1px solid #ccc;">
            <th style="padding: 6px 8px; text-align: center; font-weight: bold; text-transform: uppercase; font-size: 8pt;">Valuation Scenario</th>
            <th style="padding: 6px 8px; text-align: center; font-weight: bold; text-transform: uppercase; font-size: 8pt;">Interest Appraised</th>
            <th style="padding: 6px 8px; text-align: center; font-weight: bold; text-transform: uppercase; font-size: 8pt;">Exposure Time</th>
            <th style="padding: 6px 8px; text-align: center; font-weight: bold; text-transform: uppercase; font-size: 8pt;">Effective Date</th>
            <th style="padding: 6px 8px; text-align: center; font-weight: bold; text-transform: uppercase; font-size: 8pt;">Value</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom: 2px solid #003B7E;">
            <td style="padding: 8px; text-align: center;"><span class="field-mapped" data-sample="As Stabilized" title="{{valuation-scenario}}">{{valuation-scenario}}</span></td>
            <td style="padding: 8px; text-align: center;"><span class="field-mapped" data-sample="Fee Simple Estate" title="{{interest-appraised}}">{{interest-appraised}}</span></td>
            <td style="padding: 8px; text-align: center;"><span class="field-mapped" data-sample="Six Months" title="{{exposure-time}}">{{exposure-time}}</span></td>
            <td style="padding: 8px; text-align: center;"><span class="field-mapped" data-sample="October 17, 2025" title="{{effective-date}}">{{effective-date}}</span></td>
            <td style="padding: 8px; text-align: center; font-weight: bold;"><span class="field-mapped" data-sample="$1,800,000" title="{{final-value-conclusion}}">{{final-value-conclusion}}</span></td>
        </tr>
    </tbody>
</table>

<!-- Signature Block -->
<div class="signature-block" style="margin-top: 30px;">
    <div class="signature-image" style="height: 70px; margin-bottom: 8px;">
        <img src="data:image/webp;base64,..." alt="Signature" style="height: 65px; width: auto;">
    </div>
    <div class="appraiser-details" style="font-size: 10pt; line-height: 1.5;">
        <div><span class="field-mapped" data-sample="Chris Chornohos, AACI, MRICS" title="{{appraiser-name-credentials}}">{{appraiser-name-credentials}}</span></div>
        <div><span class="field-mapped" data-sample="Founder" title="{{appraiser-title}}">{{appraiser-title}}</span></div>
        <div><span class="field-mapped" data-sample="chris.chornohos@valta.ca" title="{{appraiser-email}}">{{appraiser-email}}</span></div>
        <div>AIC No: <span class="field-mapped" data-sample="90209" title="{{appraiser-aic-number}}">{{appraiser-aic-number}}</span></div>
    </div>
</div>
```

**Pattern Elements:**
- `class="field-mapped"` - Identifies dynamic content
- `data-sample="..."` - Provides sample value for testing
- `title="{{field-id}}"` - Tooltip shows field ID
- `{{field-id}}` - Mustache template placeholder in kebab-case

---

## Field Naming Convention

**Format (kebab-case):**
- `{{valuation-scenario}}`
- `{{interest-appraised}}`
- `{{exposure-time}}`
- `{{effective-date}}`
- `{{final-value-conclusion}}`
- `{{appraiser-name-credentials}}`
- `{{appraiser-title}}`
- `{{appraiser-email}}`
- `{{appraiser-aic-number}}`

**Original PascalCase (to be replaced):**
- `{{Valuation_Scenario}}` → `{{valuation-scenario}}`
- `{{Interest_Appraised}}` → `{{interest-appraised}}`
- `{{Exposure_Time}}` → `{{exposure-time}}`
- `{{Effective_Date}}` → `{{effective-date}}`
- `{{Final_Value_Conclusion}}` → `{{final-value-conclusion}}`
- `{{Appraiser_Name_Credentials}}` → `{{appraiser-name-credentials}}`
- `{{Appraiser_Title}}` → `{{appraiser-title}}`
- `{{Appraiser_Email}}` → `{{appraiser-email}}`
- `{{Appraiser_AIC_Number}}` → `{{appraiser-aic-number}}`

**Rationale:** Consistent with established field naming pattern across all pages (Pages 31, 32, 37, 39, 44, 49, 59, 61, 63).

---

## Registry Addition Requirements

These 9 new fields need to be added to `fieldRegistry.ts`:

```typescript
// Value Conclusion Fields (Page 65)
'valuation-scenario': {
  id: 'valuation-scenario',
  label: 'Valuation Scenario',
  type: 'select',
  category: 'value-conclusion',
  options: ['As Is', 'As Stabilized', 'Prospective'],
  description: 'Premise of value (As Is, As Stabilized, Prospective)'
},
'interest-appraised': {
  id: 'interest-appraised',
  label: 'Interest Appraised',
  type: 'select',
  category: 'value-conclusion',
  options: ['Fee Simple Estate', 'Leased Fee Estate', 'Leasehold Estate'],
  description: 'Legal property interest being valued'
},
'exposure-time': {
  id: 'exposure-time',
  label: 'Exposure Time',
  type: 'text',
  category: 'value-conclusion',
  description: 'Estimated marketing time required to sell the property (e.g., "Six Months", "90-120 Days")'
},
'effective-date': {
  id: 'effective-date',
  label: 'Effective Date',
  type: 'date',
  category: 'value-conclusion',
  description: 'Date as of which the value estimate applies'
},
'final-value-conclusion': {
  id: 'final-value-conclusion',
  label: 'Final Value Conclusion',
  type: 'currency',
  category: 'value-conclusion',
  description: 'Concluded market value after reconciliation of all approaches'
},

// Appraiser Information Fields (Page 65)
'appraiser-name-credentials': {
  id: 'appraiser-name-credentials',
  label: 'Appraiser Name & Credentials',
  type: 'text',
  category: 'appraiser',
  description: 'Full name with professional designations (e.g., AACI, MRICS)'
},
'appraiser-title': {
  id: 'appraiser-title',
  label: 'Appraiser Title',
  type: 'text',
  category: 'appraiser',
  description: 'Job title or position (e.g., Founder, Senior Appraiser)'
},
'appraiser-email': {
  id: 'appraiser-email',
  label: 'Appraiser Email',
  type: 'email',
  category: 'appraiser',
  description: 'Contact email address'
},
'appraiser-aic-number': {
  id: 'appraiser-aic-number',
  label: 'AIC Membership Number',
  type: 'text',
  category: 'appraiser',
  description: 'Appraisal Institute of Canada (AIC) membership number'
},
```

---

## Page Context

**Section:** Valuation & Conclusions (Pages 65-72)
**Purpose:** Present final market value opinion with USPAP-compliant disclosures and appraiser authentication
**Relationship to Other Pages:**
- **Page 49:** Income Approach value conclusion (one of the approaches reconciled)
- **Page 61:** Direct Comparison Approach conclusion (another approach reconciled)
- **Page 63:** Reconciliation of Values table (leads into this final conclusion)
- **Pages 62-63:** Reconciliation narrative explaining weight given to each approach
- **Pages 66-68:** Contingent & Limiting Conditions (support final value opinion)

**Valuation Flow:**
1. Pages 43-50: Income Approach analysis → value indication
2. Pages 51-61: Sales Comparison Approach → value indication
3. Pages 62-63: Reconciliation of approaches → weighting and synthesis
4. **Page 65:** Final value conclusion with USPAP parameters
5. Pages 66-72: Appendices (conditions, definitions)

---

## Relationship to Other Field Categories

**Value Conclusion depends on:**
- **Income Approach fields** (Page 49) - NOI, cap rate, indicated value
- **Sales Comparison fields** (Page 61) - HIGH/AVG/MED/LOW value indications
- **Reconciliation fields** (Page 63) - Final weight given to each approach
- **Property fields** - Address, legal description, property type

**Value Conclusion supports:**
- **Executive Summary** (Page 7) - Value summary table references this final value
- **Certification** (Page 64) - Certifies the value conclusion on this page
- **Lending decisions** - Loan-to-value ratios calculated from this value
- **Client reporting** - Primary deliverable for engagement

---

## USPAP Compliance Notes

**Required Elements (All Present):**
- ✅ Valuation scenario clearly stated ("As Stabilized")
- ✅ Interest appraised identified ("Fee Simple Estate")
- ✅ Effective date specified
- ✅ Exposure time estimated
- ✅ Hypothetical conditions disclosed (As Stabilized premise)
- ✅ Extraordinary assumptions disclosed (or stated as "None")
- ✅ Extraordinary limiting conditions disclosed (or stated as "None")
- ✅ Appraiser signature and credentials
- ✅ Professional designation and membership number

**Compliance Pattern:**
Page 65 follows USPAP Standards Rule 2-2 requirements for communicating the appraisal in a written report.

---

## Testing Checklist

- [ ] Field IDs converted to kebab-case in HTML
- [ ] All 9 new fields properly wrapped in `<span class="field-mapped">`
- [ ] Table styling consistent with brand (#003B7E, 10pt body, 8pt headers)
- [ ] Signature image displays correctly (Base64 embedded)
- [ ] Fields added to fieldRegistry.ts (9 new fields)
- [ ] Sample values tested in preview
- [ ] Value field formatted as currency ($X,XXX,XXX)
- [ ] Date field formatted as "Month DD, YYYY"
- [ ] Appraiser email validated as proper email format
- [ ] Footer fields (property-address, file-number) rendering correctly

---

## Notes

- **Signature Image:** Currently uses a Base64-encoded WebP image. In production, this should be dynamically loaded from appraiser profile or allow upload.
- **Hypothetical Conditions:** The narrative is currently static text. May need to become a dynamic field if different scenarios are commonly used.
- **Extraordinary Assumptions/Conditions:** Currently show "None" as static text. Should potentially be dynamic textarea fields if often populated.
- **Professional Designations:** AACI (Accredited Appraiser Canadian Institute), MRICS (Member of Royal Institution of Chartered Surveyors) - may need dropdown for common designations.
- **AIC Number Format:** 5-digit number, no validation currently beyond text field.

---

**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Related Commits:** (Pending - HTML update and registry additions)
