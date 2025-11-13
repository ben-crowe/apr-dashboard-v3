# APR Dashboard V3 - API & Field Mapping Reference

**Version:** 2.0 (Production)
**Last Updated:** November 13, 2025
**Status:** ✅ Live in Production
**Extracted From:** Working production code (GitHub `main` branch)

---

## Document Purpose

This is the **single source of truth** for all field mappings between APR Dashboard and Valcre API. All mappings are reverse-engineered from the actual working production code, ensuring 100% accuracy.

**Use this document to:**
- Understand complete data flow: Client Form → Dashboard → Database → Valcre API
- Reference exact field names and data transformations
- Verify enum value conversions
- Troubleshoot integration issues
- Plan new feature implementations (Section 3 & 4)

---

## Table of Contents

1. [⚡ Quick Reference Cheat Sheet](#-quick-reference-cheat-sheet)
2. [System Overview](#system-overview)
3. [Authentication](#authentication)
4. [Section 1: Client Form Submission](#section-1-client-form-submission)
5. [Section 2: LOE Quote Details](#section-2-loe-quote-details)
6. [Enum Value Conversions](#enum-value-conversions)
7. [Special Handling & Transformations](#special-handling--transformations)
8. [Section 3 & 4: To Be Documented](#section-3--4-to-be-documented)
9. [Known Issues](#known-issues)
10. [Code References](#code-references)

---

## ⚡ Quick Reference Cheat Sheet

**For detailed mappings, see sections below. This is a fast-lookup guide for the most commonly used fields.**

### Critical Payment Fields ⚠️

| Dashboard Field | Valcre API Field | Type | Critical Notes |
|----------------|------------------|------|----------------|
| `retainerAmount` | `Job.Retainer` | number | ⚠️ **MUST use `Retainer`** NOT `RetainerAmount` (Oct 2025 fix) |
| `appraisalFee` | `Job.Fee` | number | Strip $ and commas before sending |
| `deliveryDate` | `Job.DeliveryDate` | date | ISO format (YYYY-MM-DD) |
| `paymentTerms` | `Job.PaymentTerms` | string | Text field |

### Property Type (Multi-Select Pattern)

| Dashboard Field | Valcre API Field | Type | Critical Notes |
|----------------|------------------|------|----------------|
| `propertyType` | `Property.PropertyType` | string | **First value only** (single enum field) |
| `propertyType` | `Property.Types` | string | **All values** (comma-separated: `"Retail, Office"`) |

**See**: [4-SINGLE-TO-MULTI-SELECT-PATTERN.md](4-SINGLE-TO-MULTI-SELECT-PATTERN.md) for complete implementation

### Critical Enum Fields (Requires Conversion)

| Dashboard Field | Valcre API Field | Allowed Values | Conversion Required? |
|----------------|------------------|----------------|---------------------|
| `intendedUse` | `Job.IntendedUse` | 15 values | ✅ YES - See [Enum Conversions](#enum-value-conversions) |
| `reportType` | `Job.ReportType` | 14 values | ✅ YES - See [Enum Conversions](#enum-value-conversions) |
| `propertyRightsAppraised` | `Job.PropertyRightsAppraised` | 11 values | ✅ YES - See [Enum Conversions](#enum-value-conversions) |
| `valuationPremises` | `Job.ValuationPremises` | 23 values | ✅ YES - See [Enum Conversions](#enum-value-conversions) |

### Common Property Fields

| Dashboard Field | Valcre API Field | Type | Notes |
|----------------|------------------|------|-------|
| `propertyName` | `Property.Name` | string | Building/property name |
| `propertyAddress` | `Property.AddressStreet` | string | Full street address (parsed automatically) |
| `buildingSize` | `Property.SizeSF` | number | Square feet (numeric only) |
| `numberOfUnits` | `Property.BuildingsCount` | number | Unit count |
| `assetCondition` | `Property.InvestmentGrade` | string | Mapped to `"1"`, `"2"`, `"3"`, `"4"` (string numbers) |

### Client & Contact Fields

| Dashboard Field | Valcre API Field | Type | Notes |
|----------------|------------------|------|-------|
| `clientFirstName` | `Contact.FirstName` | string | Client contact |
| `clientLastName` | `Contact.LastName` | string | Client contact |
| `clientEmail` | `Contact.Email` | string | **Required** - used for duplicate detection |
| `clientPhone` | `Contact.PhoneNumber` | string | Use `PhoneNumber` not `Phone` |
| `clientOrganization` | `Contact.Organization` | string | Company name |

### Special Handling Required ⚠️

| Pattern | Dashboard → Valcre | Example | See Section |
|---------|-------------------|---------|-------------|
| Currency | Strip `$` and `,` | `"$2,500"` → `2500` | [Special Handling](#special-handling--transformations) |
| Multi-select | Comma-separated string | `["Retail", "Office"]` → `"Retai, Office"` | [Special Handling](#special-handling--transformations) |
| Address | Parse components | Full address → Street/City/State/Postal | [Special Handling](#special-handling--transformations) |
| Asset Quality | Map to numeric string | `"Excellent"` → `"1"` | [Special Handling](#special-handling--transformations) |
| Comments | Three separate fields | `notes` → `ClientComments`, `appraiserComments` → `Comments`, `deliveryComments` → `DeliveryComments`, `paymentComments` → `PaymentComments` | [Special Handling](#special-handling--transformations) |

### Most Common Mistakes to Avoid ❌

1. **Using `RetainerAmount` instead of `Retainer`** - Will fail silently
2. **Sending currency with `$` or commas** - API will reject or parse incorrectly
3. **Sending arrays instead of comma-separated strings** - Valcre cannot parse arrays
4. **Forgetting enum conversions** - Display values ≠ API values (e.g., "Market Value" → "AsIs")
5. **Not trimming whitespace** - Especially in multi-select comma-separated values

### Quick Navigation

- **Need complete field list?** → See [Section 1](#section-1-client-form-submission) or [Section 2](#section-2-loe-quote-details)
- **Need enum conversion values?** → See [Enum Value Conversions](#enum-value-conversions)
- **Troubleshooting sync issues?** → See [Known Issues](#known-issues)
- **Need code line references?** → See [Code References](#code-references)

---

## System Overview

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENT FORM (Valta Website iframe)                          │
│ - Client submits property appraisal request                 │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ SUPABASE DATABASE                                            │
│ - job_submissions table (Section 1 data)                    │
│ - job_loe_details table (Section 2 data)                    │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ APR DASHBOARD                                                │
│ - Section 1: Client & Property Info (Review)                │
│ - Section 2: LOE Quote Details (Create)                     │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ VALCRE API INTEGRATION                                       │
│ - Contact Entity (Client + Property Contact)                │
│ - Property Entity (Building/Land details)                   │
│ - Job Entity (Appraisal job)                                │
│ - PropertyParcel Entity (Land parcel info)                  │
│ - PropertyAssessment Entity (Tax assessment)                │
└─────────────────────────────────────────────────────────────┘
```

### API Files

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `src/utils/webhooks/valcre.ts` | Frontend mapping | 478 | ✅ Production |
| `api/valcre.ts` | Backend API handler | 1078 | ✅ Production |
| `src/config/valcre.ts` | Configuration | ~50 | ✅ Production |

---

## Authentication

### OAuth 2.0 Password Grant

**Endpoint:** `https://auth.valcre.com/oauth/token`
**Method:** POST
**Grant Type:** `password`

**Request Body:**
```json
{
  "grant_type": "password",
  "client_id": "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
  "client_secret": "6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ",
  "username": "chris.chornohos@valta.ca",
  "password": "Valvalta1!",
  "scope": "offline_access",
  "audience": "https://valcre.api.com"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Usage:**
```typescript
headers: {
  "Authorization": `Bearer ${access_token}`,
  "Content-Type": "application/json"
}
```

---

## Section 1: Client Form Submission

### Overview

Section 1 captures initial client submission data from the public form. This data creates Contact and Property entities in Valcre.

### Entity Creation Flow

```
1. Create/Find CLIENT Contact (Valcre Contacts API)
2. Create PROPERTY Contact (if different from client)
3. Create PROPERTY Entity (building/land details)
4. Create JOB Entity (appraisal job - links all entities)
5. Create PROPERTYPARCEL (if parcel data provided)
6. Create PROPERTYASSESSMENT (if assessment data provided)
```

---

### 1.1 Client Contact Fields

**Dashboard Source → Valcre Contact Entity**

| Dashboard Field | Valcre Field | Type | Required | Notes |
|----------------|--------------|------|----------|-------|
| `clientName` | Split into `FirstName` + `LastName` | string | ✅ | Parsed on space |
| `clientFirstName` | `FirstName` | string | ✅ | Extracted from `clientName` |
| `clientLastName` | `LastName` | string | ✅ | Remaining after first name |
| `clientEmail` | `Email` | string | ✅ | Used for duplicate detection |
| `clientPhone` | `PhoneNumber` | string | | Raw numbers only |
| `clientOrganization` | `Company` | string | | Defaults to "Direct Client" |
| `clientTitle` | `Title` | string | | Job title |
| `propertyAddress` | `AddressStreet` | string | | Parsed address |
| — | `AddressCity` | string | | Extracted from address |
| — | `AddressState` | string | | Extracted from address (AB, BC, etc.) |
| — | `AddressPostalCode` | string | | Extracted from address |
| — | `OwnerId` | number | ✅ | Hardcoded: `7095` (Chris) |

**Code Reference:** `api/valcre.ts` lines 400-450

**Example:**
```json
{
  "FirstName": "John",
  "LastName": "Smith",
  "Company": "ABC Corporation",
  "Email": "john.smith@example.com",
  "PhoneNumber": "4035551234",
  "AddressStreet": "123 Main St",
  "AddressCity": "Calgary",
  "AddressState": "AB",
  "AddressPostalCode": "T2P 1A1",
  "Title": "Property Manager",
  "OwnerId": 7095
}
```

---

### 1.2 Property Contact Fields

**Dashboard Source → Valcre Contact Entity (Separate)**

Property Contact is created **only if** email differs from client email.

| Dashboard Field | Valcre Field | Type | Required | Notes |
|----------------|--------------|------|----------|-------|
| `propertyContactFirstName` | `FirstName` | string | | From PropertyContact object |
| `propertyContactLastName` | `LastName` | string | | From PropertyContact object |
| `propertyContactEmail` | `Email` | string | ✅ | Must differ from clientEmail |
| `propertyContactPhone` | `PhoneNumber` | string | | |
| `clientOrganization` | `Company` | string | | Falls back to client company |
| — | `Title` | string | | Defaults to "Property Manager" |
| — | `OwnerId` | number | ✅ | Hardcoded: `7095` |

**Code Reference:** `api/valcre.ts` lines 500-576
**Frontend Reference:** `src/utils/webhooks/valcre.ts` lines 287-303

**Logic:**
```typescript
const needsSeparatePropertyContact =
  jobData.PropertyContact &&
  (jobData.PropertyContact.Email !== clientEmail ||
   jobData.PropertyContact.FirstName !== clientFirstName);

if (needsSeparatePropertyContact) {
  // Create separate Contact entity
  propertyContactId = <new Contact ID>
} else {
  // Leave propertyContactId as null (prevents duplicate display)
  propertyContactId = null;
}
```

---

### 1.3 Property Entity Fields

**Dashboard Source → Valcre Property Entity**

| Dashboard Field | Valcre Field | Type | Validation | Notes |
|----------------|--------------|------|------------|-------|
| `propertyName` | `Name` | string | | Defaults to "Unnamed Property" |
| `propertyAddress` | `AddressStreet` | string | | Combined with unit if provided |
| — | `AddressCity` | string | | Parsed from address |
| — | `AddressState` | string | | Parsed from address |
| — | `AddressPostalCode` | string | | Parsed from address |
| `propertyTypes[]` | `PropertyType` | enum | ⚠️ See list | **FIRST value only** |
| `propertyTypes[]` | `Types` | string | | Comma-separated all values |
| `propertySubtype` | `SecondaryType` | string | | Optional secondary classification |
| `buildingSize` | `SizeSF` | number | | Square feet |
| `grossBuildingAreaSf` | `SizeSF` | number | | Overrides buildingSize |
| `netRentableAreaSf` | `RentableSF` | number | | Rentable square feet |
| `yearBuilt` | `YearBuilt` | number | | Construction year |
| `numberOfUnits` | `BuildingsCount` | number | | Unit count |
| `parkingSpaces` | `ParkingSpacesCount` | number | | Parking count |
| `zoningClassification` | `Zoning` | string | | Zoning code |
| `zoneAbbreviation` | `ZoningName` | string | | Zoning abbreviation |
| `landUseDesignation` | `ProposedLandUse` | string | | Proposed use |
| `floodZone` | `SiteFloodZone` | string | | Flood zone designation |
| `utilities` | `Utilities` | string | | Utilities description |
| `usableLandSf` | `BuildableArea` | number | | Buildable land area |
| `environmentalPhase1` | `EnvironmentalIssues` | string | | Environmental notes |
| `assetCondition` | `InvestmentGrade` | enum → string | ⚠️ See mapping | Mapped to 1-4 scale |
| `assetQuality` | `QualitativeCondition` | enum → string | ⚠️ See mapping | Mapped to 1-8 scale |
| `marketArea` | `Market` | string | | Market classification |
| `submarket` | `SubmarketName` | string | | Submarket name |
| `legalDescription` | `DescriptionText` | string | | Combined with other descriptions |
| `internalComments` | `CommentsPrivate` | string | | Private notes |

**Code Reference:** `api/valcre.ts` lines 578-713

---

#### Property Type Validation

**Valid Valcre Property Types (Enum):**
```typescript
[
  'Agriculture', 'Building', 'Healthcare', 'Hospitality',
  'Industrial', 'Land', 'Manufactured Housing', 'Multi-Family',
  'Office', 'Retail', 'Self-Storage', 'Single-Family',
  'Special Purpose', 'Unknown'
]
```

**Auto-Mapping for Invalid Types:**
```typescript
{
  'Mixed Use': 'Building',
  'Commercial': 'Building',
  'Residential': 'Multi-Family'
}
```

**Multi-Select Handling:**
```typescript
// Dashboard sends: ["Office", "Retail", "Industrial"]

// Valcre receives:
PropertyType: "Office"              // FIRST value only (enum field)
Types: "Office, Retail, Industrial" // All values (string field)
```

**Code Reference:** `api/valcre.ts` lines 599-648

---

#### Asset Condition Mapping

**Dashboard → Valcre Investment Grade (String number 1-4):**

| Dashboard Value | Valcre InvestmentGrade | Grade |
|----------------|----------------------|-------|
| Excellent | "1" | A |
| Very Good | "2" | B |
| Good | "2" | B |
| Fair | "3" | C |
| Poor | "4" | ValueAdd |

**Code Reference:** `api/valcre.ts` lines 672-681

---

#### Asset Quality Mapping

**Dashboard → Valcre Qualitative Condition (String number 1-8):**

| Dashboard Value | Valcre QualitativeCondition |
|----------------|---------------------------|
| Excellent | "1" |
| Very Good | "2" |
| Good | "3" |
| Above Average | "4" |
| Average | "5" |
| Below Average | "6" |
| Fair | "7" |
| Poor | "8" |

**Code Reference:** `api/valcre.ts` lines 684-697

---

### 1.4 Property Parcel Fields

**Dashboard Source → Valcre PropertyParcel Entity**

Created only if parcel data is provided.

| Dashboard Field | Valcre Field | Type | Notes |
|----------------|--------------|------|-------|
| — | `PropertyId` | number | Links to Property entity |
| `parcelNumber` | `Number` | string | Parcel ID |
| `legalDescription` | `LegalDescription` | string | Legal description |
| `usableLandSf` | `UsableLandSf` | number | Usable land area |
| `grossLandSf` | `GrossLandSf` | number | Gross land area |

**Code Reference:** `api/valcre.ts` lines 793-820

---

### 1.5 Property Assessment Fields

**Dashboard Source → Valcre PropertyAssessment Entity**

Created only if assessment data is provided.

| Dashboard Field | Valcre Field | Type | Notes |
|----------------|--------------|------|-------|
| — | `PropertyId` | number | Links to Property entity |
| `assessmentYear` | `Year` | number | Tax year |
| `landAssessmentValue` | `LandValue` | number | Land assessed value |
| `improvedAssessmentValue` | `ImprovedValue` | number | Improved assessed value |
| `taxes` | `Taxes` | number | Annual taxes |

**Code Reference:** `api/valcre.ts` lines 822-850

---

## Section 2: LOE Quote Details

### Overview

Section 2 captures Letter of Engagement (LOE) details created by the appraiser in the dashboard. This data creates the Valcre Job entity and updates with appraisal-specific details.

### Job Entity Creation

**Two Operations:**
1. **Initial Creation** - Creates Job entity linked to Contact + Property
2. **LOE Update** - Updates Job with quote details (PATCH operation)

---

### 2.1 Initial Job Creation Fields

**Dashboard Source → Valcre Job Entity**

| Dashboard Field | Valcre Field | Type | Required | Notes |
|----------------|--------------|------|----------|-------|
| `propertyName` | `Name` | string | ✅ | Job display name |
| — | `Status` | enum | ✅ | Hardcoded: "Lead" |
| — | `OwnerId` | number | ✅ | Hardcoded: `7095` (Chris) |
| `clientName` | `ClientName` | string | ✅ | Display in file explorer |
| `clientEmail` | `ClientEmail` | string | ✅ | Client email |
| `clientPhone` | `ClientPhone` | string | | Client phone |
| `clientOrganization` | `ClientCompany` | string | | Organization name |
| `appraisalFee` | `AppraisalFee` | number | | Fee amount |
| `retainerAmount` | `Retainer` | number | ⚠️ Special | **Strip $ and commas** |
| `deliveryDate` | `DeliveryDate` | date | | ISO format (YYYY-MM-DD) |
| `notes` | `ClientComments` | string | | Client-visible comments |
| `appraiserComments` | `Comments` | string | | Internal appraiser notes |
| `intendedUse` | `intendedUse` | enum | ⚠️ See mapping | Requires conversion |
| `reportType` | `reportType` | enum | ⚠️ See mapping | Requires conversion |
| `propertyRightsAppraised` | `propertyRightsAppraised` | enum | ⚠️ See mapping | Requires conversion |
| `valuationPremises` | `valuationPremises` | enum | ⚠️ See mapping | Requires conversion |
| `analysisLevel` | `analysisLevel` | enum | ⚠️ See mapping | Defaults to "Comprehensive" |

**Code Reference:**
- Frontend: `src/utils/webhooks/valcre.ts` lines 196-279
- Backend: `api/valcre.ts` lines 850-950

---

### 2.2 LOE Update Fields (PATCH)

**Triggered:** When user edits Section 2 fields in dashboard
**Method:** PATCH `/api/v1/Jobs({jobId})`
**Debounce:** 500ms on field blur

| Dashboard Field | Valcre Field | Type | Special Handling |
|----------------|--------------|------|-----------------|
| `appraisalFee` | `Fee` | number | |
| `retainerAmount` | `Retainer` | number | **Strip $ and commas** |
| `deliveryDate` | `DueDate` | date | Extract date only (split on 'T') |
| `scopeOfWork` | `ScopeOfWork` | string | |
| `valuationPremises` | `ValuationPremises` | string | Enum conversion applied |
| `propertyRightsAppraised` | `PropertyRightsAppraised` | string | Enum conversion applied |
| `reportType` | `ReportType` | string | Enum conversion applied |
| `propertyTypes[]` | `PropertyType` | string | Comma-separated |
| `propertyName` | `Name` | string | Updates job name |
| `notes` / `clientComments` | `ClientComments` | string | Client-visible |
| `appraiserComments` | `Comments` | string | Internal (mapped to InternalComments) |
| `paymentTerms` | `PaymentTerms` | string | |

**Code Reference:**
- Frontend: `src/utils/webhooks/valcre.ts` lines 82-131
- Backend: `api/valcre.ts` lines 194-356

**Example PATCH Payload:**
```json
{
  "Fee": 3500,
  "Retainer": 1750,
  "DueDate": "2025-12-15",
  "ClientComments": "Client prefers email updates",
  "Comments": "Jane Williams assigned - standard timeline"
}
```

---

## Enum Value Conversions

### Overview

Valcre API uses specific enum values that differ from dashboard display values. All enum fields require conversion before sending to Valcre.

**Conversion Maps Location:** `api/valcre.ts` lines 11-105

---

### 3.1 Property Rights Appraised (PURPOSES_MAP)

**Dashboard Value → Valcre Enum**

| Dashboard Display | Valcre API Value |
|------------------|------------------|
| Fee Simple Interest | `FeeSimple` |
| Leased Fee Interest | `LeasedFee` |
| Leasehold Interest | `Leasehold` |
| Undivided Interest | `UndividedInterest` |
| Partial Interest | `PartialInterest` |
| Other | `Other` |
| Going Concern | `GoingConcern` |
| Condominium Ownership | `CondominiumOwnership` |
| Cost Segregation Study | `CostSegregationStudy` |
| ASC 805 | `ASC805` |
| None | `None` |

**Code Reference:** `api/valcre.ts` lines 12-24

---

### 3.2 Valuation Premises (REQUESTED_VALUES_MAP)

**Dashboard Value → Valcre Enum**

| Dashboard Display | Valcre API Value |
|------------------|------------------|
| Market Value | `AsIs` |
| As-Is | `AsIs` |
| Market Rent | `MarketRentStudy` |
| Liquidation Value | `Liquidation` |
| Investment Value | `InvestmentValue` |
| Insurable Value | `InsurableValue` |
| Prospective at Completion | `ProspectiveAtCompletion` |
| Prospective at Stabilization | `ProspectiveAtStabilization` |
| As-Vacant | `AsVacant` |
| Insurable Replacement Cost | `InsurableReplacementCost` |
| Bulk Value | `BulkValue` |
| Disposition | `Disposition` |
| Go Dark | `GoDark` |
| Hypothetical | `Hypothetical` |
| In Use | `InUse` |
| Lots | `Lots` |
| Lots to Houses | `LotsToHouses` |
| Market Rent Study | `MarketRentStudy` |
| Other | `Other` |
| Rent Restricted | `RentRestricted` |
| Retrospective | `Retrospective` |
| Tax Credits | `TaxCredits` |

**Code Reference:** `api/valcre.ts` lines 27-53

---

### 3.3 Report Type (REPORT_FORMAT_MAP)

**Dashboard Value → Valcre Enum**

| Dashboard Display | Valcre API Value |
|------------------|------------------|
| Comprehensive | `Appraisal` |
| Summary | `Appraisal` |
| Restricted | `RestrictedAppraisal` |
| Form | `Form` |
| Appraisal Report | `Appraisal` |
| Amendment Letter | `AmendmentLetter` |
| Broker Opinion of Value | `BrokerOpinionOfValue` |
| Completion Report | `CompletionReport` |
| Consultation | `Consultation` |
| Desk Review | `DeskReview` |
| Evaluation | `Evaluation` |
| Peer Review | `PeerReview` |
| Rent Study | `RentStudy` |
| Restricted Appraisal Report | `RestrictedAppraisal` |

**Code Reference:** `api/valcre.ts` lines 56-74

---

### 3.4 Analysis Level (ANALYSIS_LEVEL_MAP)

**Dashboard Value → Valcre Enum**

| Dashboard Display | Valcre API Value |
|------------------|------------------|
| Comprehensive | `Detailed` |
| Concise | `Concise` |
| Form | `Form` |

**Code Reference:** `api/valcre.ts` lines 77-81

**Note:** Verified from Valcre job #706542 that "Comprehensive" maps to "Detailed" in production.

---

### 3.5 Intended Use (INTENDED_USES_MAP)

**Dashboard Value → Valcre Enum**

| Dashboard Display | Valcre API Value |
|------------------|------------------|
| Financing/Refinancing | `Financing` |
| Financing | `Financing` |
| Insurance | `Financing` |
| Acquisition | `AcquisitionDisposition` |
| Disposition | `AcquisitionDisposition` |
| Acquisition/Disposition | `AcquisitionDisposition` |
| Litigation | `Litigation` |
| Estate Planning | `EstatePlanning` |
| Consulting | `Consulting` |
| Decision-Making/Internal | `DecisionMakingInternal` |
| Dispute Resolution | `DisputeResolution` |
| Divorce | `Divorce` |
| Establish Sales Price | `EstablishSalesPrice` |
| Financial Reporting | `FinancialReporting` |
| Other | `Other` |
| Property Tax Appeal | `PropertyTaxAppeal` |
| Review | `Review` |

**Code Reference:** `api/valcre.ts` lines 84-105

---

## Special Handling & Transformations

### 4.1 Currency Parsing

**Problem:** Dashboard displays currency as `"$3,500"` but Valcre expects numeric `3500`

**Solution:**
```typescript
function parseDollarAmount(value: string | number | undefined): number {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
}
```

**Applied to:**
- `appraisalFee` → `Fee`
- `retainerAmount` → `Retainer`

**Code Reference:** `api/valcre.ts` lines 108-112

**Example:**
```typescript
// Input
retainerAmount: "$1,750.00"

// Output
Retainer: 1750
```

---

### 4.2 Address Parsing

**Problem:** Dashboard has single address field, Valcre needs separate street/city/province/postal

**Solution:**
```typescript
function parseAddress(address: string): {
  street: string;
  city: string;
  province: string;
  postalCode: string;
} {
  // Parses: "123 Main St, Calgary, AB T2P 1A1"
  // Returns: {
  //   street: "123 Main St",
  //   city: "Calgary",
  //   province: "AB",
  //   postalCode: "T2P 1A1"
  // }
}
```

**Regex Patterns:**
- Province: `/\b(AB|BC|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU)\b/i`
- Postal Code: `/\b([A-Z]\d[A-Z]\s*\d[A-Z]\d)\b/i`

**Defaults:**
- City: `"Calgary"`
- Province: `"AB"`

**Code Reference:** `api/valcre.ts` lines 115-168

---

### 4.3 Comments Split Logic

**Four Comment Fields (as of Nov 13, 2025):**
1. **Client Comments** - Client-visible in Valcre
2. **General Comments** - Internal/private notes (formerly "Appraiser Comments")
3. **Delivery Comments** - Delivery-specific instructions (custom field)
4. **Payment Comments** - Payment-related notes (custom field)

**Mapping:**

| Dashboard Field | Valcre Field | Visibility |
|----------------|--------------|-----------|
| `notes` (client form) | `ClientComments` | Client-visible |
| `clientComments` (dashboard) | `ClientComments` | Client-visible |
| `appraiserComments` (dashboard) | `Comments` (General) | Internal only |
| `deliveryComments` (dashboard) | `DeliveryComments` (Delivery) | Internal only |
| `paymentComments` (dashboard) | `PaymentComments` (Payment) | Internal only |

**Code Reference:**
- Frontend: `src/utils/webhooks/valcre.ts` lines 117-126, 281-289
- Backend: `api/valcre.ts` lines 240-245

**Important:** Issue #1 in IMPLEMENTATION-STATUS.md - Appraiser Comments currently disappearing (not mapping correctly to `Comments` field).

---

### 4.4 Property Contact Duplication Prevention

**Problem:** Original implementation sent client contact as property contact, causing duplicate display in Valcre

**Solution:**
```typescript
if (formData.propertyContactEmail &&
    formData.propertyContactEmail !== formData.clientEmail) {
  jobData.PropertyContact = {
    FirstName: formData.propertyContactFirstName,
    LastName: formData.propertyContactLastName,
    Email: formData.propertyContactEmail,
    // ... other fields
  };
} else {
  // Leave PropertyContact undefined - prevents duplication
}
```

**Code Reference:** `src/utils/webhooks/valcre.ts` lines 287-303

**Fix Applied:** Nov 6, 2025 (commit 934b687)

---

### 4.5 Multi-Select Property Types

**Problem:** Valcre has two fields:
- `PropertyType` - Single enum value only
- `Types` - Comma-separated string (multiple values)

**Solution:**
```typescript
// Dashboard sends array: ["Office", "Retail", "Industrial"]

// Backend sends:
PropertyType: "Office"                    // FIRST value only
Types: "Office, Retail, Industrial"       // ALL values
```

**Validation:** Auto-maps invalid types to valid Valcre enums
```typescript
'Mixed Use' → 'Building'
'Commercial' → 'Building'
'Residential' → 'Multi-Family'
```

**Code Reference:**
- Frontend: `src/utils/webhooks/valcre.ts` lines 214-225
- Backend: `api/valcre.ts` lines 612-648

---

### 4.6 Date Formatting

**Dashboard:** ISO 8601 with time: `"2025-12-15T00:00:00.000Z"`
**Valcre:** Date only: `"2025-12-15"`

**Conversion:**
```typescript
const date = jobData.deliveryDate || jobData.DeliveryDate;
updateData.DueDate = date.split("T")[0];
```

**Code Reference:** `api/valcre.ts` lines 234-237

---

## Section 3 & 4: To Be Documented

**Status:** Not yet implemented in production

### Section 3: Building Information
- Gross Building Area
- Net Rentable Area
- Year Built
- Construction Type
- Number of Stories
- Building Class
- (More fields TBD)

### Section 4: Income & Expenses
- Rental Income
- Operating Expenses
- NOI Calculations
- Cap Rate
- Cash Flow
- (More fields TBD)

**Next Steps:**
1. Implement Section 3 & 4 in dashboard
2. Map fields to Valcre Property/Building entities
3. Update this document with complete mappings

---

## Known Issues

**Reference:** See `/docs/IMPLEMENTATION-STATUS.md` for complete bug tracking

### Recently Resolved ✅

**Issue #1: Appraiser Comments Disappearing (RESOLVED Nov 13, 2025)**
- **Problem:** Comments weren't syncing to Valcre "General" field
- **Root Cause:** API only accepted `InternalComments`, frontend sent `appraiserComments`
- **Fix:** Updated API to accept all field name variants
- **Enhancement:** Added Delivery and Payment comment fields matching Valcre custom fields
- **Status:** ✅ Working - All three comment fields (General, Delivery, Payment) now sync correctly

### Current Issues

**Issue #2: Valuation Premises Not Mapping (Enhancement)**
- **Problem:** New Valcre custom field "Valuation Premise - 1" not mapped
- **Client Form Values:** "Market Value: As Is", "Market Value: As Is & As Stabilized", etc.
- **Valcre Values:** "As Is", "As Stabilized", "As If Complete & Stabilized", etc.
- **Status:** Feature request (not critical)
- **Mapping Strategy Needed:** Strip "Market Value:" prefix? Support multiple scenarios?

**Potential Enhancement: Additional Valcre Custom Fields**
- **Custom Fields Identified:** Lender fields (Company Name, Address, Contact), Valuation Premise - 2, Appraised Value - 1 & 2
- **Status:** Under review for Dashboard integration
- **Reference:** See custom fields list in IMPLEMENTATION-STATUS.md

---

## Code References

### Production Files (GitHub main branch)

**Backend API:**
```
/api/valcre.ts                          1078 lines
  - Lines 11-105:   Enum conversion maps
  - Lines 108-168:  Helper functions (currency, address parsing)
  - Lines 194-356:  Update operation (PATCH)
  - Lines 358-950:  Job creation operation (POST)
  - Lines 400-498:  Contact creation/search
  - Lines 500-576:  Property Contact logic
  - Lines 578-791:  Property entity creation
  - Lines 793-820:  PropertyParcel creation
  - Lines 822-850:  PropertyAssessment creation
```

**Frontend Integration:**
```
/src/utils/webhooks/valcre.ts          478 lines
  - Lines 6-9:     Field mapping constants
  - Lines 12-29:   Intended use mapping function
  - Lines 32-68:   Address parsing function
  - Lines 82-131:  LOE sync operation
  - Lines 175-279: Initial job creation
  - Lines 287-303: Property Contact handling
```

**Configuration:**
```
/src/config/valcre.ts                  ~50 lines
  - API endpoints
  - Job number validation (VAL######)
```

---

## Testing & Verification

### Verified Working (Nov 13, 2025)

**Section 1 Fields (95% functional):**
- ✅ Client Contact creation
- ✅ Property Contact separation
- ✅ Property entity with all fields
- ✅ Multi-select property types
- ✅ Asset condition/quality mapping
- ✅ Address parsing
- ✅ PropertyParcel creation
- ✅ PropertyAssessment creation

**Section 2 Fields (95% functional):**
- ✅ Appraisal Fee mapping
- ✅ Retainer Amount (fixed Nov 6)
- ✅ Delivery Date
- ✅ Payment Terms
- ✅ Report Type (with enum conversion)
- ✅ Intended Use (with enum conversion)
- ✅ Property Rights (with enum conversion)
- ✅ Valuation Premises (with enum conversion)
- ✅ Client Comments
- ✅ General Comments (formerly Appraiser Comments - FIXED Nov 13)
- ✅ Delivery Comments (NEW - Nov 13)
- ✅ Payment Comments (NEW - Nov 13)

### Test Checklist

**Client Form Submission:**
- [ ] Submit form with all required fields
- [ ] Verify Contact created in Valcre
- [ ] Verify Property created with correct type
- [ ] Verify Property Contact created (if different email)
- [ ] Check address parsed correctly
- [ ] Verify asset condition/quality mapped

**LOE Creation:**
- [ ] Fill Section 2 LOE fields
- [ ] Create Valcre job
- [ ] Verify all enum values converted correctly
- [ ] Check currency amounts (no $ or commas)
- [ ] Verify date format (YYYY-MM-DD only)
- [ ] Test client comments saved
- [ ] Test appraiser comments (currently fails)

**Field Updates:**
- [ ] Edit fee amount - verify PATCH request
- [ ] Edit retainer - verify currency parsed
- [ ] Edit delivery date - verify date extracted
- [ ] Edit property types - verify comma-separated
- [ ] Edit comments - verify separate fields

---

## Change Log

**Version 2.0 (Nov 13, 2025):**
- ✅ Reverse-engineered from production code (GitHub main)
- ✅ Complete enum conversion maps documented
- ✅ All special handling patterns documented
- ✅ Property Contact duplication fix documented
- ✅ Multi-select property types documented
- ✅ Currency and date parsing documented
- ✅ Asset condition/quality mappings added
- ✅ Code line references for all mappings

**Version 1.0 (Oct-Nov 2025):**
- Basic field mapping reference
- Manual documentation (not code-based)
- Incomplete enum conversions

---

## Maintenance

**When updating field mappings:**
1. Update production code in `api/valcre.ts` or `src/utils/webhooks/valcre.ts`
2. Test thoroughly in production
3. Update this document with new mappings
4. Update code line references
5. Add test cases to checklist

**Document Owner:** Development Team
**Last Verified:** November 13, 2025
**Next Review:** When Section 3 & 4 are implemented

---

**End of API & Field Mapping Reference**
