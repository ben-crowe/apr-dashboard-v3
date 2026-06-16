<!-- GENERATED from public/field-registry-v6.html by scripts/generate-registry-derivatives.mjs.
     DO NOT hand-edit — edit the HTML registry, then regenerate. Runtime truth = api/valcre.ts. -->

# APR Field Mapping — Generated Derivative

> Generated from the canonical **HTML field registry**. Edit there, not here. QA certifies against `api/valcre.ts`.

## Field → Valcre mapping

| Field | Label | Control | Source | Routes To | Entity | Req | Notes |
|---|---|---|---|---|---|---|---|
| `JobNumber` | Job Number | Alpha Numeric | Valcre API | Job.Number | Job | Yes | Unique job identifier from Valcre |
| `JobName` | Job Name | Alpha Numeric | User Input | Job.Name | Job | Yes | Job/project name |
| `JobStatus` | Job Status | Select one | User Input | Job.Status | Job | Yes | Current job status |
| `SubjectProperty` | Subject Property | Alpha Numeric | Valcre API | Job.Property._DisplayName | Job | Yes | Property display name from Valcre |
| `ClientCompanyName` | Client Company Name | Alpha Numeric | User Input | Job.Client._DisplayName | Job | Yes | Client company display name |
| `ClientOrganizationAddress` | Client Organization Address | Alpha Numeric | User Input | Contact.AddressStreet/City/State/PostalCode | Contact | Yes | 4-field structured address (street/city/province/postal) → Contact.AddressStreet/City/State/PostalCode. ⚠ CREATE-ONLY (written only when minting a new contact, never re-PATCHed on edit). NO-CROSS: client address parts come ONLY from client fields, never the property. |
| `ClientFirstName` | Client First Name | Text | User Input | Contact.FirstName | Contact | Yes | ⚠ Contact CREATE-ONLY (set on new-contact creation, not re-PATCHed). |
| `ClientLastName` | Client Last Name | Text | User Input | Contact.LastName | Contact | Yes | ⚠ Contact CREATE-ONLY. |
| `ClientTitle` | Client Title | Text | User Input | Contact.Title | Contact | Yes | ⚠ Contact CREATE-ONLY (app key clientTitle). |
| `ClientPhone` | Client Phone | Text | User Input | Contact.PhoneNumber | Contact | Yes | ⚠ Contact CREATE-ONLY. |
| `ClientEmail` | Client Email | Text | User Input | Contact.Email | Contact | Yes | ⚠ Contact CREATE-ONLY. Also the match key — existing contact reused if email matches. |
| `PropertyName` | Property Name | Alpha Numeric | User Input | Property.Name | Property | Yes |  |
| `PropertyAddress` | Property Address | Alpha Numeric | User Input | Property.AddressStreet | Property | Yes |  |
| `PropertyType` | Property Type | Select one | User Input | Property.Type (single) + Property.Types (multi) | Property | Yes | Primary property classification — cascade trigger. Writes BOTH Valcre fields: Property.Type (single validated enum, first of the split) AND Property.Types (multi PascalCase from PropertyTypeEnum). |
| `PropertySubtype` | Property Subtype | Select one | User Input | Property.SecondaryType | Property | Yes | Secondary type — overrides Property Rights |
| `Tenancy` | Tenancy | Select one | User Input | CF12408 | Job | Yes | Occupancy type — highest priority override for Property Rights. Valcre custom field CF12408 (SingleOption). |
| `StateofImprovements` | State of Improvements | Select one | Logic | CF12409 | Job | Yes | Derived from Status of Improvements. Valcre custom field CF12409 (SingleOption). |
| `StatusofImprovements` | Status of Improvements | Select one | User Input | CF12407 | Job | Yes | DIRECT user pick — drives the Value Scenarios + Approaches + Property Rights cascade. Valcre custom field CF12407 (SingleOption). |
| `InterestAppraised` | Interest Appraised (Property Rights) | Select multiple | Logic | CF12412 | Job | Yes | DERIVED (derivePropertyRights) from PropertyType + Subtype + Tenancy — not user-typed. App key interestAppraised → Valcre custom field CF12412 (MultiOption). User sees 'Property Rights'. |
| `AuthorizedUse` | Authorized Use | Select one | User Input | CF12413 | Job | Yes | Insurance overrides Value Scenarios. App keys authorizedUse + intendedUse both → Valcre custom field CF12413 (SingleOption). |
| `ValueScenarios` | Value Scenarios | Select multiple | Logic | CF12414 | Job | Yes | DERIVED (deriveValueScenarios) from Status of Improvements + Authorized Use — not user-typed. Valcre custom field CF12414 (MultiOption). |
| `ApproachestoValue` | Approaches to Value | Select multiple | Logic | CF12415 | Job | Yes | DERIVED (deriveApproaches) from Status of Improvements + Authorized Use — not user-typed. Valcre custom field CF12415 (MultiOption). |
| `AssignmentType` | Assignment Type | Select one | User Input | CF12416 | Job | Yes | Single or multiple property. Valcre custom field CF12416 (SingleOption). |
| `ReportType` | Report Type | Select one | User Input | CF12417 | Job | Yes | Comprehensive, Concise, or Form. Valcre custom field CF12417 (SingleOption). |
| `DesktopReport` | Desktop Report | Select one | User Input | CF12418 | Job | Yes | Desktop-only report flag. Valcre custom field CF12418 (SingleOption). |
| `Valuetimeframe` | Value Timeframe | Select one | User Input | CF12419 | Job | Yes | Current, Prospective, or Retrospective. Valcre custom field CF12419 (SingleOption). |
| `InspectionDate` | Inspection Date | Date | User Input | Job.InspectionDate | Job | Yes |  |
| `Fee` | Fee | Whole Number | Calculated | Job.Fee | Job | Yes | Appraisal fee amount |
| `DeliveryTime` | Delivery Time | Whole Number | User Input | CF12420 | Job | No | Business days for delivery. Valcre custom field CF12420. |
| `PaidDate` | Paid Date | Date | Logic | Job.PaidDate | Job | No | Date payment received |
| `Paid` | Paid | Checkbox | Logic | CF12421 | Job | No | Payment received flag. Valcre custom field CF12421. |
| `RequestDate` | Request Date | Date | Logic | Job.BidDate | Job | No | Date job was requested (Bid Date in Valcre) |
| `SignedDate` | Signed Date | Date | Logic | Job.AwardDate | Job | No | LOE signed date (Award Date in Valcre) |
| `DueDate` | Due Date | Date | Logic | Job.DueDate | Job | No | Report due date |
| `AmountPaid` | Amount Paid | Decimal | Logic | Job.AmountPaid | Job | No | Total amount paid to date |
| `ClientDocuments` | Client Documents | Select multiple | Logic | CF12422 | Job | Yes | Documents provided by client. Valcre custom field CF12422 (MultiOption). |
| `TransactionStatus` | Transaction Status | Select multiple | User Input | CF12424 | Job | Yes | Property transaction status. Valcre custom field CF12424. |
| `ZoningStatus` | Zoning Status | Select one | User Input | CF12425 | Job | Yes | Valcre custom field CF12425. |
| `LandMetric` | Land $/Metric | Select one | User Input | CF12426 | Job | Yes | Land valuation metric. Valcre custom field CF12426. |
| `CMHCFinancing` | CMHC Financing | Select one | User Input | CF12427 | Job | Yes | CMHC insured financing flag. Valcre custom field CF12427. |
| `CurrentUseImprovements` | Current Use | Select one | User Input | CF12410 | Job | No | DIRECT user pick — current use of improvements (app key currentUseImprovements). Valcre custom field CF12410 (SingleOption). |
| `ProposedUseImprovements` | Proposed Use | Select one | User Input | CF12411 | Job | No | DIRECT user pick — proposed use of improvements (app key proposedUseImprovements). Valcre custom field CF12411 (SingleOption). |
| `PreviouslyAppraised` | Previously Appraised | Select one | User Input | CF12423 | Job | No | DIRECT user pick — previously-appraised flag (app key previouslyAppraised). Valcre custom field CF12423. |
| `EA1` | Extraordinary Assumption 1 | Multi-line | Logic | — | — | No | Auto-populated from cascade/text library |
| `EA2` | Extraordinary Assumption 2 | Multi-line | Logic | — | — | No |  |
| `EA3` | Extraordinary Assumption 3 | Multi-line | Logic | — | — | No |  |
| `EA4` | Extraordinary Assumption 4 | Multi-line | Logic | — | — | No |  |
| `EA5` | Extraordinary Assumption 5 | Multi-line | Logic | — | — | No |  |

## Value Scenarios — Section 10 library

| Scenario | Section 10 Summary | EA/HC | Derived From | Valcre (CF12414) | Status |
|---|---|---|---|---|---|
| As Is Vacant Land | current market value of the subject property as of the effective date | — | Proposed - Vacant Land | CF12414 · 7499 | Has text |
| As If Vacant Land | current makret value based on the extraordinary assumption and hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. | EA + HC | Proposed - Improved Land (Demolition Required); Proposed - Under Construction | CF12414 · 7507 | Has text |
| As If Complete & Stabilized | current market value of the subject property as proposed based upon the extraordinary assumption and hypothetical condition that the project is 100% complete and fully leased at market rents and is at stabilized occupancy, as of the effective date. | EA + HC | Improved - Under Renovation; Improved - Proposed Renovation; Proposed - Vacant Land; Proposed - Improved Land (Demolition Required); Proposed - Under Construction | CF12414 · 7506 | Has text |
| As-Is | current market value of the subject property as improved as of the effective date | — | Improved - Under Renovation; Improved - Proposed Renovation | CF12414 · 7505 | Has text |
| As Stabilized | current market value of the subject property based on the extraordinary assumption that the subject property is fully leased at market rents and is at stabilized occupancy as of the effective date. | EA + HC | Improved - Completed; Improved - Renovated | CF12414 · 7504 | Has text |
| As If Complete & Stabilized - Renovated | current market value of the subject property as proposed based upon the extraordinary assumption and hypothetical condition that the renovation is 100% complete and the property is fully leased and is at stabilized occupancy, as of the effective date. | — | Option-set only (not derived today) | CF12414 · 7503 | Has text |
| As If Complete - Rezoned | _pending — Chris to supply_ | — | Option-set only | CF12414 · 7502 | Needs text |
| As If Complete - Serviced | _pending — Chris to supply_ | — | Option-set only | CF12414 · 7501 | Needs text |
| As If Complete - Subdivided | _pending — Chris to supply_ | — | Option-set only | CF12414 · 7500 | Needs text |
| Insurable Replacement Cost | _pending — Chris to supply_ | — | Authorized Use = Insurance (override) | CF12414 · 7508 | Needs text |
