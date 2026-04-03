# Valcre Custom Fields Spec — 13 VALTA Fields

**Created by:** QA Agent (qa-4) for React Specialist
**Date:** 2026-03-30
**Source:** Valcre Swagger API + live API inspection of existing custom fields

## API Payload Format

**Create field definition:** `POST /api/v1/CustomFields`

```json
{
  "FieldEntityType": "Job",
  "Name": "FieldName",
  "ValueType": "String|SingleOption|MultiOption|Boolean",
  "DisplayName": "Human Readable Label",
  "Description": "",
  "ValuePrecision": 2,
  "SearchCapabilities": "None",
  "Requirement": "None",
  "Suggestions": "",
  "CanImport": true,
  "CanExport": true,
  "IsHidden": false,
  "Offices": [{"OfficeId": 802}],
  "AvailableValues": ["Option1", "Option2"]
}
```

**Our tenant:** TenantId=596, OfficeId=802
**Existing custom fields:** 12 fields (IDs 11553-11682: Lender info, ValuationPremise, Test)

## The 13 Field Definitions

### Section 3 — Building Information

| # | Name | ValueType | DisplayName | AvailableValues |
|---|------|-----------|-------------|-----------------|
| 1 | Tenancy | SingleOption | Tenancy | Multi-Tenant, Single-Tenant, Owner-Occupied, Partial Owner Occupied, Vacant, Unknown |
| 2 | StateOfImprovements | SingleOption | State of Improvements | Existing Property, Proposed, Under Construction, Complete |
| 3 | StatusOfImprovements | SingleOption | Status of Improvements | As Is, As Complete, As Stabilized, As Proposed |
| 4 | PropertySubtype | SingleOption | Property Subtype | Low-Rise, Mid-Rise, High-Rise, Garden, Walk-Up, Townhouse, Mixed-Use |
| 5 | LandMetric | SingleOption | Land Metric | Square Feet, Acres, Hectares, Square Metres |
| 6 | EnvironmentalAssessment | String | Environmental Assessment | (free text) |
| 7 | HeritageConservation | String | Heritage / Conservation | (free text) |

### Section 4 — Appraisal Assignment

| # | Name | ValueType | DisplayName | AvailableValues |
|---|------|-----------|-------------|-----------------|
| 8 | AssignmentType | SingleOption | Assignment Type | Standard, Update, Retrospective, Desktop |
| 9 | DesktopReport | Boolean | Desktop Report | (true/false) |
| 10 | ValueTimeframe | SingleOption | Value Timeframe | Current, Retrospective, Prospective |
| 11 | ApproachesToValue | MultiOption | Approaches to Value | All Applicable, Cost Approach, Direct Comparison, Income Approach, Cost + Direct Comparison, Cost + Income, Direct Comparison + Income |
| 12 | TransactionStatus | SingleOption | Transaction Status | Arm's Length, Non-Arm's Length, Listing, Under Contract, REO/Bank Sale |
| 13 | ZoningStatus | SingleOption | Zoning Status | Legal Conforming, Legal Non-Conforming, Illegal, No Zoning |

## API Endpoints for Values

**Set a String/Boolean value:**
```
POST /api/v1/CustomFields/UpdateFieldValue
Body: CustomFieldValue object
```

**Set a SingleOption/MultiOption value:**
```
POST /api/v1/CustomFields/UpdateSelectFieldValue
Body: CustomFieldSelectedValue object
```

**Get all values for a job:**
```
GET /api/v1/CustomFields/GetValues?entityId={valcreJobId}&type=6
(type 6 = Job entity)
```

**Batch update:**
```
POST /api/v1/CustomFields/UpdateValues
Body: CustomFieldUpdateValues object
```

## Implementation Notes

1. **Create the 13 field definitions first** (one-time setup script)
2. **Store the returned field IDs** — you'll need them for UpdateFieldValue calls
3. **In api/valcre.ts create path:** After Job creation, loop through the 13 dashboard fields and call UpdateFieldValue/UpdateSelectFieldValue for each
4. **In api/valcre.ts update path:** Same — after Job PATCH, sync custom field values
5. **Dashboard field name -> Valcre custom field name mapping:**
   - `tenancy` -> `Tenancy` (customFieldId from creation)
   - `stateOfImprovements` -> `StateOfImprovements`
   - `statusOfImprovements` -> `StatusOfImprovements`
   - `propertySubtype` -> `PropertySubtype`
   - `landMetric` -> `LandMetric`
   - `environmentalAssessment` -> `EnvironmentalAssessment`
   - `heritageConservation` -> `HeritageConservation`
   - `assignmentType` -> `AssignmentType`
   - `desktopReport` -> `DesktopReport` (convert "Yes"/"No" to true/false)
   - `valueTimeframe` -> `ValueTimeframe`
   - `approachesToValue` -> `ApproachesToValue`
   - `transactionStatus` -> `TransactionStatus`
   - `zoningStatus` -> `ZoningStatus`
