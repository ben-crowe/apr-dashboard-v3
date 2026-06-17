<!-- GENERATED from public/field-registry-v6.html by scripts/generate-registry-derivatives.mjs.
     DO NOT hand-edit — edit the HTML registry, then regenerate. Runtime truth = api/valcre.ts. -->

# APR Field Mapping — Generated Derivative

> Generated from the canonical **HTML field registry**. Edit there, not here. QA certifies against `api/valcre.ts`.

## Field → Valcre mapping + V3→V4 bridge flow

> **Bridge** column = does the V3 value actually reach the report builder (BRIDGE-FLOW via `useLoadJobIntoReport.ts`), NOT registry-presence. `maps-clean` reaches it; `mismatched-stale` reaches it lossy; `missing-in-v4` never bridges. **Report Target** = the report-side destination (Valcre CF/native, or report TEMPLATE `{{placeholder}}`). Folded from `V3-to-V4-field-map.json` (co-arch, 2026-06-16).

| Field | Label | Control | Source | Routes To | Entity | Req | Bridge | Report Target | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `JobNumber` | Job Number | Alpha Numeric | Valcre API | Job.Number | Job | Yes | maps-clean | Job.Number | Unique job identifier from Valcre |
| `JobName` | Job Name | Alpha Numeric | User Input | Job.Name | Job | Yes | missing-in-v4 | Job.Name | Job/project name |
| `JobStatus` | Job Status | Select one | User Input | Job.Status | Job | Yes | missing-in-v4 | Job.Status | Current job status |
| `SubjectProperty` | Subject Property | Alpha Numeric | Valcre API | Job.Property._DisplayName | Job | Yes | missing-in-v4 | Job.Property._DisplayName | Property display name from Valcre |
| `ClientCompanyName` | Client Company Name | Alpha Numeric | User Input | Job.Client._DisplayName | Job | Yes | maps-clean | Job.Client._DisplayName | Client company display name |
| `ClientOrganizationAddress` | Client Organization Address | Alpha Numeric | User Input | Contact.AddressStreet/City/State/PostalCode | Contact | Yes | maps-clean | Contact.AddressStreet/City/State/PostalCode | 4-field structured address (street/city/province/postal) → Contact.AddressStreet/City/State/PostalCode. ⚠ CREATE-ONLY (written only when minting a new contact, never re-PATCHed on edit). NO-CROSS: client address parts come ONLY from client fields, never the property. |
| `ClientFirstName` | Client First Name | Text | User Input | Contact.FirstName | Contact | Yes | maps-clean | Contact.FirstName | ⚠ Contact CREATE-ONLY (set on new-contact creation, not re-PATCHed). |
| `ClientLastName` | Client Last Name | Text | User Input | Contact.LastName | Contact | Yes | maps-clean | Contact.LastName | ⚠ Contact CREATE-ONLY. |
| `ClientTitle` | Client Title | Text | User Input | Contact.Title | Contact | Yes | missing-in-v4 | Contact.Title | ⚠ Contact CREATE-ONLY (app key clientTitle). |
| `ClientPhone` | Client Phone | Text | User Input | Contact.PhoneNumber | Contact | Yes | maps-clean | Contact.PhoneNumber | ⚠ Contact CREATE-ONLY. |
| `ClientEmail` | Client Email | Text | User Input | Contact.Email | Contact | Yes | maps-clean | Contact.Email | ⚠ Contact CREATE-ONLY. Also the match key — existing contact reused if email matches. |
| `PropertyName` | Property Name | Alpha Numeric | User Input | Property.Name | Property | Yes | maps-clean | Property.Name |  |
| `PropertyAddress` | Property Address | Alpha Numeric | User Input | Property.AddressStreet | Property | Yes | mismatched-stale | Property.AddressStreet |  |
| `PropertyType` | Property Type | Select one | User Input | Property.Type (single) + Property.Types (multi) | Property | Yes | mismatched-stale | Property.Type (single) + Property.Types (multi) | Primary property classification — cascade trigger. Writes BOTH Valcre fields: Property.Type (single validated enum, first of the split) AND Property.Types (multi PascalCase from PropertyTypeEnum). |
| `PropertySubtype` | Property Subtype | Select one | User Input | Property.SecondaryType | Property | Yes | missing-in-v4 | Property.SecondaryType | Secondary type — overrides Property Rights |
| `Tenancy` | Tenancy | Select one | User Input | CF12408 | Job | Yes | maps-clean | CF12408 | Occupancy type — highest priority override for Property Rights. Valcre custom field CF12408 (SingleOption). |
| `StateofImprovements` | State of Improvements | Select one | User Input | CF12409 | Job | Yes | missing-in-v4 | CF12409 | DIRECT user Select (OrganizingDocsSection — options Proposed/Under Construction/Complete). NOT derived (corrected 2026-06-17: prior 'Derived from...' + source:Logic was drift; code has no derivation). Valcre custom field CF12409 (SingleOption). |
| `StatusofImprovements` | Status of Improvements | Select one | User Input | CF12407 | Job | Yes | missing-in-v4 | CF12407 (intake) · NO report field id / placeholder yet | DIRECT user pick — drives the Value Scenarios + Approaches + Property Rights cascade. Valcre custom field CF12407 (SingleOption). |
| `InterestAppraised` | Interest Appraised (Property Rights) | Select multiple | Logic | CF12412 | Job | Yes | maps-clean | CF12412 | DERIVED (derivePropertyRights) from PropertyType + Subtype + Tenancy — not user-typed. App key interestAppraised → Valcre custom field CF12412 (MultiOption). User sees 'Property Rights'. |
| `AuthorizedUse` | Authorized Use | Select one | User Input | CF12413 | Job | Yes | maps-clean | CF12413 | Insurance overrides Value Scenarios. App keys authorizedUse + intendedUse both → Valcre custom field CF12413 (SingleOption). |
| `ValueScenarios` | Value Scenarios | Select multiple | Logic | CF12414 | Job | Yes | missing-in-v4 | CF12414 | DERIVED (deriveValueScenarios) from Status of Improvements + Authorized Use — not user-typed. Valcre custom field CF12414 (MultiOption). |
| `ApproachestoValue` | Approaches to Value | Select multiple | Logic | CF12415 | Job | Yes | missing-in-v4 | CF12415 | DERIVED (deriveApproaches) from Status of Improvements + Authorized Use — not user-typed. Valcre custom field CF12415 (MultiOption). |
| `AssignmentType` | Assignment Type | Select one | User Input | CF12416 | Job | Yes | missing-in-v4 | CF12416 | Single or multiple property. Valcre custom field CF12416 (SingleOption). |
| `ReportType` | Report Type | Select one | User Input | CF12417 | Job | Yes | maps-clean | CF12417 | Comprehensive, Concise, or Form (FORMAT axis). Valcre custom field CF12417 (SingleOption). |
| `DesktopReport` | Desktop Report | Select one | User Input | CF12418 | Job | Yes | missing-in-v4 | CF12418 | Desktop-only report flag. Valcre custom field CF12418 (SingleOption). |
| `Valuetimeframe` | Value Timeframe | Select one | User Input | CF12419 | Job | Yes | missing-in-v4 | CF12419 | Current, Prospective, or Retrospective. Valcre custom field CF12419 (SingleOption). |
| `InspectionDate` | Inspection Date | Date | User Input | Job.InspectionDate | Job | Yes | mismatched-stale | Job.InspectionDate | Chris-required. V4 home = report-inspectiondate (PRESENT). But NO live V3 form collects it (only testDataGenerator + V4 schema) — V3-side collection gap. |
| `Fee` | Fee | Whole Number | Calculated | Job.Fee | Job | Yes | missing-in-v4 | Job.Fee | Appraisal fee amount |
| `DeliveryTime` | Delivery Time | Whole Number | User Input | CF12420 | Job | No | missing-in-v4 | CF12420 | Business days for delivery. Valcre custom field CF12420. |
| `PaidDate` | Paid Date | Date | Logic | Job.PaidDate | Job | No | missing-in-v4 | Job.PaidDate | Date payment received |
| `Paid` | Paid | Checkbox | Logic | CF12421 | Job | No | missing-in-v4 | CF12421 | Payment received flag. Valcre custom field CF12421. |
| `RequestDate` | Request Date | Date | Logic | Job.BidDate | Job | No | missing-in-v4 | Job.BidDate | Date job was requested (Bid Date in Valcre) |
| `SignedDate` | Signed Date | Date | Logic | Job.AwardDate | Job | No | missing-in-v4 | Job.AwardDate | LOE signed date (Award Date in Valcre) |
| `DueDate` | Due Date | Date | Logic | Job.DueDate | Job | No | missing-in-v4 | Job.DueDate | Report due date |
| `AmountPaid` | Amount Paid | Decimal | Logic | Job.AmountPaid | Job | No | missing-in-v4 | Job.AmountPaid | Total amount paid to date |
| `ClientDocuments` | Client Documents | Select multiple | User Input | CF12422 | Job | Yes | missing-in-v4 | CF12422 | Documents provided by client. Valcre custom field CF12422 (MultiOption). (source corrected 2026-06-17: was Logic, no derivation in code.) |
| `TransactionStatus` | Transaction Status | Select multiple | User Input | CF12424 | Job | Yes | missing-in-v4 | CF12424 | Property transaction status. Valcre custom field CF12424. |
| `ZoningStatus` | Zoning Status | Select one | User Input | CF12425 | Job | Yes | missing-in-v4 | CF12425 | Valcre custom field CF12425. |
| `LandMetric` | Land $/Metric | Select one | User Input | CF12426 | Job | Yes | missing-in-v4 | CF12426 | Land valuation metric. Valcre custom field CF12426. |
| `CMHCFinancing` | CMHC Financing | Select one | User Input | CF12427 | Job | Yes | missing-in-v4 | CF12427 | CMHC insured financing flag. Valcre custom field CF12427. |
| `CurrentUseImprovements` | Current Use | Select one | User Input | CF12410 | Job | No | missing-in-v4 | CF12410 | DIRECT user pick — current use of improvements (app key currentUseImprovements). Valcre custom field CF12410 (SingleOption). |
| `ProposedUseImprovements` | Proposed Use | Select one | User Input | CF12411 | Job | No | missing-in-v4 | CF12411 | DIRECT user pick — proposed use of improvements (app key proposedUseImprovements). Valcre custom field CF12411 (SingleOption). |
| `PreviouslyAppraised` | Previously Appraised | Select one | User Input | CF12423 | Job | No | missing-in-v4 | CF12423 | DIRECT user pick — previously-appraised flag (app key previouslyAppraised). Valcre custom field CF12423. |
| `EA1` | Extraordinary Assumption 1 | Multi-line | Logic | — | — | No | missing-in-v4 | — | Auto-populated from cascade/text library |
| `EA2` | Extraordinary Assumption 2 | Multi-line | Logic | — | — | No | missing-in-v4 | — |  |
| `EA3` | Extraordinary Assumption 3 | Multi-line | Logic | — | — | No | missing-in-v4 | — |  |
| `EA4` | Extraordinary Assumption 4 | Multi-line | Logic | — | — | No | missing-in-v4 | — |  |
| `EA5` | Extraordinary Assumption 5 | Multi-line | Logic | — | — | No | missing-in-v4 | — |  |
| `LegalDescription` | Legal Description | Alpha Numeric | User Input | — | Property | No | mismatched-stale | store legal-description → NO {{legal-description}} placeholder (template candidates: {{report-legal}} / {{info-legal-source}}) | [V4 bridge field — not on intake form] property.legal_description → store legal-description |
| `ScopeOfWork` | Scope of Work | Alpha Numeric | User Input | — | Job | No | mismatched-stale | store scope-of-work → NO {{scope-of-work}} placeholder in template | [V4 bridge field — not on intake form] loe.scope_of_work → store scope-of-work |
| `ContactFirstName` | Subject Property Contact — First Name | Text | User Input | — | PropertyContact | No | maps-clean | — | [1→4 split of Chris 'PropertyContact' composite] subject-property contact first name. |
| `ContactLastName` | Subject Property Contact — Last Name | Text | User Input | — | PropertyContact | No | maps-clean | — | [1→4 split of Chris 'PropertyContact' composite] subject-property contact last name. |
| `ContactEmail` | Subject Property Contact — Email | Text | User Input | — | PropertyContact | No | maps-clean | — | [1→4 split of Chris 'PropertyContact' composite] subject-property contact email. |
| `ContactPhone` | Subject Property Contact — Phone | Text | User Input | — | PropertyContact | No | maps-clean | — | [1→4 split of Chris 'PropertyContact' composite] subject-property contact phone. |
| `ReportDate` | Report Date | Date | Calculated | — | Job | No | maps-clean | {{report-date}} (template placeholder VERIFIED present) | [V4 bridge field — not on intake form] computed today() → store report-date |

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
