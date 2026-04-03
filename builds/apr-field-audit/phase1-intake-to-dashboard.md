# Phase 1: Intake Form → Supabase → Dashboard Field Continuity

## Field Mapping Table

| # | Form Label | Form Field (camelCase) | DB Column (snake_case) | Dashboard Section | Dashboard Display | Required | Status |
|---|-----------|----------------------|----------------------|-------------------|-------------------|----------|--------|
| 1 | First Name | clientFirstName | client_first_name | Client Information | Input (editable) | * | PASS |
| 2 | Last Name | clientLastName | client_last_name | Client Information | Input (editable) | * | PASS |
| 3 | Client Title | clientTitle | client_title | Client Information | Input (editable) | | PASS |
| 4 | Client Company Name | clientOrganization | client_organization | Client Information | Input (editable) | | PASS |
| 5 | Client Organization Address | clientAddress | client_address | Client Information | Input (editable) | | PASS |
| 6 | Client Phone | clientPhone | client_phone | Client Information | Input (formatted) | * | PASS |
| 7 | Client Email | clientEmail | client_email | Client Information | Input (editable) | * | PASS |
| 8 | Property Name | propertyName | property_name | Property Information | Input (editable) | * | PASS |
| 9 | Property Address | propertyAddress | property_address | Property Information | Input (editable) | | PASS |
| 10 | Property Type | propertyType | property_type | Property Information | Multi-select (chips) | * | MISMATCH |
| 11 | Intended Use | intendedUse | intended_use | Property Information | Select dropdown | | PASS |
| 12 | Valuation Premises | valuationPremises | valuation_premises | Property Information | Select dropdown | | PASS |
| 13 | Asset Current Condition | assetCondition | asset_condition | Property Information | Select dropdown | | PASS |
| 14 | Additional Information | notes | notes | Client Comments | Textarea (editable) | | PASS |
| 15 | First Name/Department | propertyContactFirstName | property_contact_first_name | Property Contact | Input (editable) | | PASS |
| 16 | Last Name (Property Contact) | propertyContactLastName | property_contact_last_name | Property Contact | Input (editable) | | PASS |
| 17 | Email (Property Contact) | propertyContactEmail | property_contact_email | Property Contact | Input (editable) | | PASS |
| 18 | Phone (Property Contact) | propertyContactPhone | property_contact_phone | Property Contact | Input (formatted) | | PASS |
| 19 | File Upload | files | job_files (separate table) | Uploaded Documents | File list with actions | | PASS |
| 20 | — (auto) | — | status | — | — | auto | PASS |
| 21 | — (auto) | — | source | — | — | auto="webform" | PASS |
| 22 | — (auto) | — | tags | — | — | auto=[] | PASS |
| 23 | — (auto) | — | source_metadata | — | — | auto (referrer/UA) | PASS |

## Issues Found

### MISMATCH: Property Type (#10)
- **Intake form:** Single-select dropdown (`propertyType` → `property_type` as string)
- **Dashboard:** Multi-select with comma-separated string storage (`propertyType` stored as `"Office, Retail"`)
- **Impact:** Form submits a single value; dashboard allows adding multiple types. Data flows correctly but the UI paradigm differs. The `JobSubmission` TypeScript interface has both `propertyType?: string` (legacy single) and `propertyTypes?: string[]` (new multi-select array), but Supabase uses only `property_type` (string column).
- **Dashboard test data function** uses `propertyTypes: [propertyType]` (array format), while the form submission uses `property_type: formData.propertyType` (string). The dashboard then parses commas: `currentTypesStr.split(',').map(t => t.trim())`.

### Notable: Dashboard Adds Valcre Auto-Sync
All 18 content fields in the dashboard have `onBlur` → `autoSaveField()` which:
1. Saves to Supabase
2. If a Valcre job exists, syncs the field to Valcre API

VALCRE_SYNC_FIELDS: notes, valuationPremises, intendedUse, assetCondition, propertyTypes, propertyName, propertyAddress, clientFirstName, clientLastName, clientTitle, clientOrganization, clientEmail, clientPhone, clientAddress, propertyContactFirstName, propertyContactLastName, propertyContactEmail, propertyContactPhone

### Notable: Phone Formatting
Dashboard applies `(XXX) XXX-XXXX` formatting on display but strips to numbers-only on save. Intake form stores raw input (no formatting/stripping).

## Summary
- **18 content fields** traced from form → DB → dashboard
- **4 auto-generated fields** (status, source, tags, source_metadata)
- **1 MISMATCH** (propertyType single→multi paradigm)
- **0 MISSING** fields
- **0 NOT WIRED** fields
- All fields are editable on the dashboard with auto-save + Valcre sync
