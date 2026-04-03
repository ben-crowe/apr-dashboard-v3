# Test 2: Valcre Field Verification (VAL261028)

## Valcre API Response

```json
{
  "success": true,
  "jobNumber": "VAL261028",
  "jobId": 834469,
  "name": "Southlands Plaza, 3494 Spring Parkway, Calgary, AB",
  "status": "Lead"
}
```

## Fields Sent (Client-Side → Vercel Serverless → Valcre API)

Based on console evidence + code analysis from `src/utils/webhooks/valcre.ts` (job creation path):

### Contact Entity

| # | Dashboard Field | Value Sent | Valcre Field | Status |
|---|----------------|-----------|-------------|--------|
| 1 | Client Name | Sarah Wilson | Contact.FirstName="Sarah", LastName="Wilson" | SENT |
| 2 | Client Email | sarah.wilson.213072@test.com | Contact.Email | SENT (search/create) |
| 3 | Client Phone | 5876657269 | Contact.PhoneNumber | SENT |
| 4 | Client Title | Director | Contact.Title | SENT |
| 5 | Client Organization | Quantum Holdings | Contact.Company | SENT |
| 6 | Client Address | 2399 Pine Place, Calgary... | Contact.AddressStreet (parsed) | SENT |
| 7 | Property Contact | David Wright | Separate Contact entity (different email) | SENT |

### Property Entity

| # | Dashboard Field | Value Sent | Valcre Field | Conversion | Status |
|---|----------------|-----------|-------------|-----------|--------|
| 8 | Property Name | Southlands Plaza | Property.Name | Direct | SENT |
| 9 | Property Address | 3494 Spring Parkway | Property.AddressStreet (parsed) | parseAddress() | SENT |
| 10 | Property Type | Land | Property.PropertyType = "Land" | Direct (valid enum) | SENT |
| 11 | Property Types | ["Land"] | Property.Types = "Land" | TYPES_FIELD_MAP | SENT |
| 12 | Asset Condition | Good | Property.InvestmentGrade = "2" | gradeMap (Good→2) | MAPPED |

### Job Entity — Enum Fields (6 Conversion Maps)

| # | Dashboard Field | Value Sent | Valcre API Field | Conversion Map | Valcre Value | Status |
|---|----------------|-----------|-----------------|----------------|-------------|--------|
| 13 | Property Rights | Partial Interest | Purposes | PURPOSES_MAP | "PartialInterest" | MAPPED |
| 14 | Valuation Premises | Liquidation Value | RequestedValues | REQUESTED_VALUES_MAP | "Liquidation" | MAPPED |
| 15 | Report Type | (empty) | ReportFormat | REPORT_FORMAT_MAP | **SKIPPED** (no value) | NOT SENT |
| 16 | Scope of Work | All Applicable | ScopeOfWork | SCOPE_OF_WORK_MAP | "AllApplicable" | MAPPED |
| 17 | Intended Use | Financing/Refinancing | IntendedUses | INTENDED_USES_MAP | "Financing" | MAPPED |
| 18 | Analysis Level | (default) | AnalysisLevel | ANALYSIS_LEVEL_MAP | "Detailed" (default Comprehensive) | MAPPED |

### Job Entity — Direct Fields

| # | Dashboard Field | Value Sent | Valcre API Field | Status |
|---|----------------|-----------|-----------------|--------|
| 19 | Appraisal Fee | $3,500.00 | Fee = 3500 | SENT |
| 20 | Retainer | $350.00 | Retainer = 350 | SENT |
| 21 | Delivery Date | 2026-04-11 | DueDate = "2026-04-11" | SENT |
| 22 | Payment Terms | On LOE Signature | Comments (appended) | COMMENTS workaround |
| 23 | Client Comments | Test submission generated at 4:33:33 PM | ClientComments | SENT |

## Conversion Map Verification

| Map | Dashboard Value | Expected Valcre Value | Sent? |
|-----|----------------|----------------------|-------|
| PURPOSES_MAP | Partial Interest | PartialInterest | YES |
| REQUESTED_VALUES_MAP | Liquidation Value | Liquidation | YES |
| REPORT_FORMAT_MAP | (empty) | (skipped) | NO (empty source) |
| SCOPE_OF_WORK_MAP | All Applicable | AllApplicable | YES |
| INTENDED_USES_MAP | Financing/Refinancing | Financing | YES |
| ANALYSIS_LEVEL_MAP | Comprehensive (default) | Detailed | YES (default) |

## Issues Found

1. **Report Type not sent** — The Report Type dropdown was empty after test data fill (Test Data doesn't populate Report Type). Valcre will have no ReportFormat set for this job.

2. **ClickUp update failed** — `TypeError: Failed to fetch` at `updateClickUpWithValcreJob`. The Valcre job was created but the ClickUp task name was NOT updated with the VAL number.

3. **Address parsing** — "3494 Spring Parkway" has no city/province, so parseAddress() will default to Calgary, AB. This is correct for this use case but would be wrong for out-of-province properties.

## "View in Valcre" Button

After creation, the button changed to "View in Valcre" — this links to the Valcre dashboard. Clicking would require Valcre login credentials (chris.chornohos@valta.ca).
