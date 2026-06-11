---
title: Valcre OData Schema Reference — Authoritative Enum Values
status: active
created: 2026-06-11
updated: 2026-06-11
last_reviewed: 2026-06-11
description: Ground-truth enum/option sets for every Valcre field we write to. Generated directly from Valcre OData $metadata. Use this before guessing any token value.
tags: [valcre, api, odata, enum, field-mapping, ground-truth, apr-dashboard]
---

# Valcre OData Schema Reference — Authoritative Enum Values

**Tags:** #valcre #api #odata #enum #field-mapping #ground-truth

**Entities:** [[Valcre]] [[api/valcre.ts]] [[VALCRE-DATE-FIELDS-MAP]]

---

## API Hosts — Clarification

Two Valcre hosts exist. They are **NOT** the same backend for all purposes:

| Host | Purpose | Notes |
|------|---------|-------|
| `https://api-core.valcre.com/api/v1/` | REST API — all CRUD operations | AUTHORITATIVE for create/update/custom fields |
| `https://valcreapi-9a09f00a2b97.herokuapp.com/api/odata` | OData endpoint (secondary/legacy) | Returns "No such app" as of 2026-06-11 — DEAD |

The `$metadata` EDMX document that defines all entity types and enums is served from:

```
GET https://api-core.valcre.com/api/v1/$metadata
Authorization: Bearer <token>
```

All converter maps in [api/valcre.ts](~/Development/APR-Dashboard-v3/api/valcre.ts) must use tokens from THIS document.

Authentication uses the OAuth2 password flow at `https://auth.valcre.com/oauth/token`.

---

## Job Entity — Enum Fields

The `Job` entity in Valcre uses the following enum-typed properties. Each accepts only the tokens listed below.

### Scopes (JobScopes)

Field name sent in payload: `Scopes`. Multi-select — comma-join tokens (e.g. `"CostApproach, IncomeApproach"`).

| Valcre Token | Dashboard Label (our converter key) |
|---|---|
| `None` | — |
| `AllApplicable` | All Applicable |
| `BestApproach` | Best One Approach |
| `BestApproaches` | Best Two Approaches |
| `DepreciatedReplacementCost` | *(no dashboard mapping)* |
| `CostApproach` | Cost Approach |
| `DiscountedCashFlow` | Discounted Cash Flow |
| `FeasibilityStudy` | Feasibility Study |
| `IncomeApproach` | Income Approach |
| `LandValue` | Land Value |
| `Litigation` | Litigation |
| `MarketResearch` | Market Research |
| `MarketStudy` | Market Study |
| `RentSurvey` | *(nearest to "Net Rent Review" — UNRESOLVED, see below)* |
| `SalesComparisonApproach` | Direct Comparison Approach |
| `Update` | Update |
| `All` | — |

**UNRESOLVED:** Dashboard value `"Net Rent Review"` maps to `"NetRentReview"` in the code — this token does NOT exist in `JobScopes`. Nearest candidate is `RentSurvey`. Pending Chris/Ben confirmation before changing.

### Purposes (JobPurposes)

Field name: `Purposes`. Single enum value.

| Valcre Token | Dashboard Label |
|---|---|
| `None` | None |
| `FeeSimple` | Fee Simple Interest |
| `LeasedFee` | Leased Fee Interest |
| `Leasehold` | Leasehold Interest |
| `Other` | Other |
| `MarketStudy` | Market Study |
| `PartialInterest` | Partial Interest |
| `Asc805` | ASC 805 |
| `CostSegregation` | Cost Segregation Study |
| `RentRestricted` | Rent Restricted |
| `GoingConcern` | Going Concern |
| `LeaseholdFranchise` | *(no dashboard mapping)* |
| `PartialInterestTaking` | Partial Interest Taking |
| `TotalTaking` | Total Taking |
| `CondominiumOwnership` | Condominium Ownership |
| `All` | — |

**UNRESOLVED:** Dashboard value `"Undivided Interest"` previously mapped to `"UndividedInterest"` — that token does NOT exist in `JobPurposes`. Removed from the map (will log a warning and skip).

### RequestedValues (JobRequestedValues)

Field name: `RequestedValues`. Single or comma-joined enum.

| Valcre Token | Dashboard Label |
|---|---|
| `None` | — |
| `AsIs` | As-Is / Market Value |
| `AsStabilized` | Prospective at Stabilization / Investment Value |
| `AsComplete` | Prospective at Completion |
| `AsVacant` | As-Vacant |
| `Lots` | Lots |
| `LotsToHouses` | Lots to Houses |
| `BulkValue` | Bulk Value |
| `Retrospective` | Retrospective |
| `RentRestricted` | Rent Restricted |
| `RentSurvey` | *(nearest to "Market Rent Study" — UNRESOLVED)* |
| `TaxCredits` | Tax Credits |
| `InsurableValue` | Insurable Value / Insurable Replacement Cost |
| `Disposition` | Disposition |
| `GoDark` | Go Dark |
| `Hypothetical` | Hypothetical |
| `InUse` | In Use |
| `Liquidation` | Liquidation Value |
| `Other` | Other |
| `RelatedSiteValue` | — |
| `All` | — |

**UNRESOLVED:** `"Market Rent"` and `"Market Rent Study"` mapped to `"MarketRentStudy"` — that token does NOT exist. Nearest is `RentSurvey`. Removed from map pending confirmation.

**FIXED (2026-06-11):**

- `"Insurable Value"` was → `InsurableReplacementCost` (wrong). Now → `InsurableValue` (correct).
- `"Insurable Replacement Cost"` was → `InsurableReplacementCost` (wrong). Now → `InsurableValue` (correct).
- `"Prospective at Completion"` was → `ProspectiveAtCompletion` (not in enum). Now → `AsComplete`.
- `"Prospective at Stabilization"` / `"Investment Value"` was → `ProspectiveAtStabilization` (not in enum). Now → `AsStabilized`.

### ReportFormat (JobReportFormat)

Field name: `ReportFormat`. Single enum value.

| Valcre Token | Dashboard Label |
|---|---|
| `Appraisal` | Comprehensive / Summary / Appraisal Report |
| `RestrictedAppraisal` | Restricted / Restricted Appraisal Report |
| `DeskReview` | Desk Review |
| `AmendmentLetter` | Amendment Letter |
| `Consultation` | Consultation |
| `RentStudy` | Rent Study |
| `Evaluation` | Evaluation |
| `BrokerOpinionOfValue` | Broker Opinion of Value |
| `Redirection` | *(no dashboard mapping)* |
| `Completion` | Completion Report |
| `PeerReview` | Peer Review |

**Note:** `"Form"` is NOT a valid enum member. The code intentionally skips it.

**FIXED (2026-06-11):** `"Completion Report"` was → `CompletionReport` (not in enum). Now → `Completion`.

### IntendedUses (JobIntendedUses)

Field name: `IntendedUses`. Single enum value.

| Valcre Token | Dashboard Label |
|---|---|
| `None` | — |
| `AcquisitionDisposition` | Acquisition-Disposition / Acquisition / Disposition |
| `DecisionMakingInternal` | Internal Decision-Making / Internal Valuation |
| `DisputeResolution` | Dispute Resolution |
| `EstablishSalesPrice` | Establish Sales Price |
| `EstatePlanning` | Estate Planning |
| `Financing` | First Mortgage Financing / Financing/Refinancing / Insurance |
| `Litigation` | Litigation |
| `PropertyTaxAppeal` | Tax Appeal / Property Tax Appeal |
| `Review` | Review |
| `Other` | Other / GST |
| `Consulting` | Consulting |
| `MortgageSecuritySpecifiedLender` | — |
| `MortgageSecurityUnspecifiedLender` | — |
| `RatingAssessment` | — |
| `RentalAssessment` | — |
| `RentalSubmission` | — |
| `RentalDetermination` | — |
| `Compensation` | — |
| `Matrimonial` | *(nearest to "Divorce" — UNRESOLVED)* |
| `FinancialReporting` | Financial Reporting |
| `All` | — |

**UNRESOLVED:** `"Divorce"` mapped to `"Divorce"` — that token does NOT exist in `JobIntendedUses`. Nearest is `Matrimonial`. Removed from map pending confirmation.

### AnalysisLevel (JobAnalysisLevel)

Field name: `AnalysisLevel`. Single enum value.

| Valcre Token | Dashboard Label |
|---|---|
| `Detailed` | Detailed / Comprehensive (legacy) |
| `Summary` | Summary |
| `Brief` | Brief |
| `RentalAssessmentLetter` | RentalAssessmentLetter |
| `RentalSubmission` | RentalSubmission |
| `RentalDetermination` | RentalDetermination |
| `ValuationAssessmentLetter` | ValuationAssessmentLetter |
| `DetailedResidential` | DetailedResidential |
| `PropertyPro` | PropertyPro |
| `RestrictedAccessReport` | RestrictedAccessReport |
| `ProgressReport` | ProgressReport |

All tokens in `ANALYSIS_LEVEL_MAP` verified correct as of 2026-06-11.

---

## Property Entity — Enum Fields

### Types (PropertyTypes)

Field name: `Types`. Comma-joined multi-select string.

| Valcre Token | Dashboard Label |
|---|---|
| `None` | — |
| `Industrial` | Industrial |
| `Office` | Office |
| `Retail` | Retail |
| `MultiFamily` | Multi-Family / Multifamily |
| `Land` | Land |
| `HealthCare` | Healthcare *(capital C!)* |
| `Building` | Building / Mixed Use |
| `SpecialPurpose` | Special Purpose |
| `SingleFamily` | Single-Family |
| `SelfStorage` | Self-Storage |
| `Hospitality` | Hospitality |
| `ManufacturedHousing` | Manufactured Housing |
| `Childcare` | — |
| `Community` | — |
| `Agriculture` | Agriculture |
| `Unknown` | Unknown |
| `All` | — |

All tokens in `TYPES_FIELD_MAP` verified correct as of 2026-06-11.

### PropertyType

`PropertyType` is typed as `Edm.String` in the $metadata — NOT an enum. It accepts free text. The code uses a validation list and `PROPERTY_TYPE_MAP` to normalize dashboard values before sending.

### AddressCountry

`AddressCountry` is typed as `Edm.String` — NOT an enum. Free text; no schema restriction.

---

## VALTA Custom Fields (CF12407–CF12427)

These are Job-level custom fields set via `POST /api/v1/CustomFields/UpdateSelectFieldValue`. The option IDs below are the live `AvailableValue.Id` values from the Valcre API (verified 2026-06-11).

### CF12407 — Status of Improvements (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7432 | Improved - Completed |
| 7433 | Improved - Renovated |
| 7434 | Improved - Under Renovation |
| 7435 | Improved - Proposed Renovation |
| 7436 | Proposed - Vacant Land |
| 7437 | Proposed - Improved Land (Demolition Required) |
| 7438 | Proposed - Under Construction |

### CF12408 — Tenancy (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7418 | Multi-Tenant |
| 7419 | Owner Occupied |
| 7420 | Partial Owner Occupied |
| 7421 | Single-Tenant |
| 7422 | Unkown *(sic — Valcre typo)* |
| 7423 | Vacant |

### CF12409 — State of Improvements (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7428 | Improved |
| 7429 | Proposed |
| 7430 | Vacant Land |
| 7431 | Improved Development Land |

### CF12410 — Current Use Improvements (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7445 | Vacant Land |
| 7446 | Single Family |
| 7447 | Multifamily |
| 7448 | Retail |
| 7449 | Industrial |
| 7450 | Office |

### CF12411 — Proposed Use Improvements (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7458 | Not Applicable |
| 7459 | Single Family |
| 7460 | Multifamily |
| 7461 | Mixed Use |
| 7462 | Retail |
| 7463 | Industrial |
| 7464 | Office |

### CF12412 — Interest Appraised (MultiOption)

| AvailableValueId | Label |
|---|---|
| 7469 | Fee Simple |
| 7470 | Leased Fee Interest |
| 7471 | Leasehold Estate |
| 7472 | Going Concern |

### CF12413 — Authorized Use (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7481 | First Mortgage Financing |
| 7482 | Litigation |
| 7483 | Estate Planning |
| 7484 | Acquisition-Disposition |
| 7485 | Internal Decision-Making |
| 7486 | Insurance |
| 7487 | Financial Reporting |
| 7488 | GST |

### CF12414 — Value Scenarios (MultiOption)

| AvailableValueId | Label |
|---|---|
| 7499 | As Is Vacant Land |
| 7500 | As If Complete - Subdivided |
| 7501 | As If Complete - Serviced |
| 7502 | As If Complete - Rezoned |
| 7503 | As If Complete & Stabilized - Renovated |
| 7504 | As Stabilized |
| 7505 | As-Is |
| 7506 | As If Complete & Stabilized |
| 7507 | As If Vacant Land |
| 7508 | Insurable Replacement Cost |

### CF12415 — Approaches to Value (MultiOption)

| AvailableValueId | Label |
|---|---|
| 7513 | Land Direct Comparison Approach |
| 7514 | Cost Approach |
| 7515 | Direct Comparison Approach |
| 7516 | Income Approach |

### CF12416 — Assignment Type (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7519 | Single Property |
| 7520 | Multiple Properties |

### CF12417 — Report Type (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7524 | Comprehensive |
| 7525 | Concise |
| 7526 | Form |

### CF12418 — Desktop Report (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7529 | Yes |
| 7530 | No |

### CF12419 — Value Timeframe (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7534 | Current |
| 7535 | Prospective |
| 7536 | Retrospective |

### CF12420 — Delivery Time (Integer)

Free integer. No option set.

### CF12421 — Paid (Boolean)

Boolean. No option set.

### CF12422 — Client Documents (MultiOption)

| AvailableValueId | Label |
|---|---|
| 7548 | Previous Appraisal |
| 7549 | Environmental Reports |
| 7550 | Purchase & Sale Agreement |
| 7551 | Contact for Property Tour |
| 7552 | Development Permit Drawings |
| 7553 | Historical Operating Expenses |
| 7554 | Rent Roll |
| 7555 | Unit Mix |
| 7556 | Proforma |
| 7557 | Property Details |
| 7558 | Property Condition Reports |

### CF12423 — Previously Appraised (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7561 | Yes |
| 7562 | No |

### CF12424 — Transaction Status (MultiOption)

| AvailableValueId | Label |
|---|---|
| 7566 | Not Applicable |
| 7567 | Listed |
| 7568 | Under Contract |

### CF12425 — Zoning Status (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7571 | In Place |
| 7572 | To Be Rezoned |

### CF12426 — Land Metric (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7577 | $/Unit |
| 7578 | $/FAR |
| 7579 | $/SF |
| 7580 | $/Acre |

### CF12427 — CMHC Financing (SingleOption)

| AvailableValueId | Label |
|---|---|
| 7583 | Yes |
| 7584 | No |

---

## Unresolved Mismatches (flagged, not guessed)

These dashboard values have no confirmed Valcre enum match. They are removed from the converter maps and will log a warning + skip:

| Dashboard Value | Field | Closest Candidate | Status |
|---|---|---|---|
| `"Net Rent Review"` | Scopes | `RentSurvey` | Pending Chris/Ben |
| `"Undivided Interest"` | Purposes | *(none)* | Pending resolution |
| `"Market Rent"` | RequestedValues | `RentSurvey` | Pending Chris/Ben |
| `"Market Rent Study"` | RequestedValues | `RentSurvey` | Pending Chris/Ben |
| `"Divorce"` | IntendedUses | `Matrimonial` | Pending Chris/Ben |

---

**Last reviewed:** 2026-06-11 by qa-agent — generated from Valcre OData $metadata at `https://api-core.valcre.com/api/v1/$metadata`.
