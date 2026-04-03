# Phase 2: Dashboard → Valcre API Field Mapping

## Table A: Field-by-field Valcre Mapping

### Job Entity Fields (via 6 Conversion Maps)

| # | Dashboard Field | Valcre API Field | Conversion Map | Dashboard Value Example | Valcre Enum Value | Status |
|---|----------------|------------------|----------------|------------------------|-------------------|--------|
| 1 | Appraisal Fee | Fee | Direct (parseDollarAmount) | $5,000 | 5000 | DIRECT |
| 2 | Retainer Amount | Retainer | Direct (strip $,) | $2,500 | 2500 | DIRECT |
| 3 | Delivery Date | DueDate | Direct (split T) | 2026-04-15 | 2026-04-15 | DIRECT |
| 4 | Intended Use | IntendedUses | INTENDED_USES_MAP | Financing/Refinancing | Financing | MAPPED |
| 5 | Intended Use | IntendedUses | INTENDED_USES_MAP | Acquisition | AcquisitionDisposition | MAPPED |
| 6 | Intended Use | IntendedUses | INTENDED_USES_MAP | Insurance | Financing | MAPPED |
| 7 | Intended Use | IntendedUses | INTENDED_USES_MAP | Litigation | Litigation | MAPPED |
| 8 | Intended Use | IntendedUses | INTENDED_USES_MAP | Estate Planning | EstatePlanning | MAPPED |
| 9 | Scope of Work | ScopeOfWork | SCOPE_OF_WORK_MAP | All Applicable | AllApplicable | MAPPED |
| 10 | Scope of Work | ScopeOfWork | SCOPE_OF_WORK_MAP | Cost Approach | CostApproach | MAPPED |
| 11 | Special Instructions | ClientComments | Direct | "Rush delivery" | "Rush delivery" | DIRECT |
| 12 | Internal Comments | Comments | Direct | "Check zoning" | "Check zoning" | DIRECT |
| 13 | Property Rights | Purposes | PURPOSES_MAP | Fee Simple Interest | FeeSimple | MAPPED |
| 14 | Property Rights | Purposes | PURPOSES_MAP | Leased Fee Interest | LeasedFee | MAPPED |
| 15 | Report Type | ReportFormat | REPORT_FORMAT_MAP | Comprehensive | Appraisal | MAPPED |
| 16 | Report Type | ReportFormat | REPORT_FORMAT_MAP | Summary | Appraisal | MAPPED |
| 17 | Report Type | ReportFormat | REPORT_FORMAT_MAP | Restricted | RestrictedAppraisal | MAPPED |
| 18 | Valuation Premises | RequestedValues | REQUESTED_VALUES_MAP | Market Value | AsIs | MAPPED |
| 19 | Valuation Premises | RequestedValues | REQUESTED_VALUES_MAP | Market Rent | MarketRentStudy | MAPPED |
| 20 | Valuation Premises | RequestedValues | REQUESTED_VALUES_MAP | Liquidation Value | Liquidation | MAPPED |
| 21 | Valuation Premises | RequestedValues | REQUESTED_VALUES_MAP | Investment Value | ProspectiveAtStabilization | MAPPED |
| 22 | Valuation Premises | RequestedValues | REQUESTED_VALUES_MAP | Insurable Value | InsurableReplacementCost | MAPPED |
| 23 | Payment Terms | Comments (appended) | COMMENTS workaround | Net 30 | "Payment Terms: Net 30" | COMMENTS |
| 24 | Delivery Comments | DeliveryComments | Direct | "Rush" | "Rush" | DIRECT |
| 25 | Payment Comments | PaymentComments | Direct | "Wire only" | "Wire only" | DIRECT |

### Contact Entity Fields

| # | Dashboard Field | Valcre API Field | Conversion Map | Status |
|---|----------------|------------------|----------------|--------|
| 26 | Client First Name | Contact.FirstName | Direct | DIRECT |
| 27 | Client Last Name | Contact.LastName | Direct | DIRECT |
| 28 | Client Email | Contact.Email | Direct (search/create) | DIRECT |
| 29 | Client Phone | Contact.PhoneNumber | Direct | DIRECT |
| 30 | Client Title | Contact.Title | Direct | DIRECT |
| 31 | Client Organization | Contact.Company | Direct | DIRECT |
| 32 | Client Address | Contact.AddressStreet | parseAddress() | DIRECT |
| 33 | Prop Contact First | PropertyContact.FirstName | Direct (if different email) | DIRECT |
| 34 | Prop Contact Last | PropertyContact.LastName | Direct (if different email) | DIRECT |
| 35 | Prop Contact Email | PropertyContact.Email | Direct (if different email) | DIRECT |
| 36 | Prop Contact Phone | PropertyContact.PhoneNumber | Direct (if different email) | DIRECT |

### Property Entity Fields

| # | Dashboard Field | Valcre API Field | Conversion Map | Status |
|---|----------------|------------------|----------------|--------|
| 37 | Property Name | Property.Name | Direct | DIRECT |
| 38 | Property Address | Property.AddressStreet | parseAddress() | DIRECT |
| 39 | Property Type (first) | Property.PropertyType | PROPERTY_TYPE_MAP | MAPPED |
| 40 | Property Types (all) | Property.Types | TYPES_FIELD_MAP | MAPPED |
| 41 | Asset Condition | Property.InvestmentGrade | gradeMap (Excellent→1, Poor→4) | MAPPED |
| 42 | Year Built | Property.YearBuilt | Direct | DIRECT |
| 43 | Building Size | Property.SizeSF | Direct | DIRECT |
| 44 | Number of Units | Property.BuildingsCount | Direct | DIRECT |
| 45 | Parking Spaces | Property.ParkingSpacesCount | Direct | DIRECT |
| 46 | Zoning Classification | Property.Zoning | Direct | DIRECT |
| 47 | Zone Abbreviation | Property.ZoningName | Direct | DIRECT |
| 48 | Land Use Designation | Property.ProposedLandUse | Direct | DIRECT |
| 49 | Flood Zone | Property.SiteFloodZone | Direct | DIRECT |
| 50 | Utilities | Property.Utilities | Direct | DIRECT |
| 51 | Usable Land SF | Property.BuildableArea | Direct | DIRECT |
| 52 | Legal Description | Property.DescriptionText | Prepend "Legal: " | DIRECT |
| 53 | Notes | ~~Property.OffSiteImprovements~~ | REMOVED (was polluting) | NOT SENT |

### Parcel/Assessment Fields (Update limitation — go to Comments)

| # | Dashboard Field | Valcre API Field | Status |
|---|----------------|------------------|--------|
| 54 | Parcel Number | Comments (appended) | COMMENTS |
| 55 | Legal Description | Comments (appended) | COMMENTS |
| 56 | Usable Land SF | Comments (appended) | COMMENTS |
| 57 | Gross Land SF | Comments (appended) | COMMENTS |
| 58 | Assessment Year | Comments (appended) | COMMENTS |
| 59 | Land Assessment Value | Comments (appended) | COMMENTS |
| 60 | Improved Assessment Value | Comments (appended) | COMMENTS |
| 61 | Taxes | Comments (appended) | COMMENTS |

**Note:** Parcel/assessment fields go to Comments only during UPDATE operations (PATCH). During initial job creation, they go to proper Property entity fields. This is because the update path doesn't have the Property entity ID to PATCH directly.

---

## Table B: VALTA-FIELD-SPEC Gap Analysis (62 fields, 13 NEW)

| # | VALTA Field | In Dashboard? | In Valcre API? | In LOE? | Gap Description |
|---|-------------|---------------|----------------|---------|-----------------|
| 1 | JobNumber | Yes | Yes (returned) | Yes | PASS |
| 2 | JobName | Yes (propertyName) | Yes (Name) | Yes ([name]) | PASS |
| 3 | JobStatus | Yes (status) | Yes (Status) | No | Not in LOE (internal) |
| 4 | AssignmentType | NO | NO | NO | **NEW - Not implemented anywhere** |
| 5 | SubjectProperty | Yes (propertyAddress) | Yes (Name) | Yes | PASS |
| 6-12 | Client fields | Yes | Yes | Yes | PASS (all 7) |
| 13 | PropertyName | Yes | Yes | Yes | PASS |
| 14 | PropertyAddress | Yes | Yes | Yes | PASS |
| 15 | PropertyType | Yes | Yes | Yes (empty) | PASS (but LOE sends empty) |
| 16 | PropertySubtype | NO | Yes (SecondaryType) | NO | **NEW - Not in dashboard UI** |
| 17 | Tenancy | NO | NO | NO | **NEW - Not implemented** |
| 18 | StateofImprovements | NO | NO | NO | **NEW - Not implemented** |
| 19 | StatusofImprovements | NO | NO | NO | **NEW - Not implemented** |
| 20 | InterestAppraised | Partial (propertyRightsAppraised) | Yes (Purposes) | Yes ([propertyrights]) | Mapped but different naming |
| 21 | AuthorizedUse | Yes (intendedUse) | Yes (IntendedUses) | Yes ([intendeduses]) | PASS |
| 22 | ValueScenarios | Partial (valuationPremises) | Yes (RequestedValues) | Yes ([requestedvalues]) | Single-select vs multi-select in VALTA spec |
| 23 | ApproachestoValue | NO | NO | NO | **NEW - Not implemented** |
| 24 | ReportType | Yes | Yes (ReportFormat) | Yes ([reportformat]) | PASS |
| 25 | DesktopReport | NO | NO | NO | **NEW - Not implemented** |
| 26 | Valuetimeframe | NO | NO | NO | **NEW - Not implemented** |
| 27 | InspectionDate | NO | NO | NO | Not implemented |
| 28 | Fee | Yes (appraisalFee) | Yes (Fee) | Yes ([fee]) | PASS |
| 29 | Paid | NO | NO | NO | Not implemented |
| 30 | RequestDate | Auto (createdAt) | NO | NO | Only in Supabase |
| 31 | SignedDate | NO | NO | Yes (date_signed) | Only in DocuSeal |
| 32 | DueDate | Yes (deliveryDate) | Yes (DueDate) | Yes ([duedate]) | PASS |
| 33 | TransactionStatus | NO | NO | NO | **NEW - Not implemented** |
| 34 | ZoningStatus | NO | NO | NO | **NEW - Not implemented** |
| 35 | LandMetric | NO | NO | NO | **NEW - Not implemented** |
| 36 | EA (Extraordinary Assumptions) | NO | NO | NO | **NEW - Not implemented** |
| 37 | HC (Hypothetical Conditions) | NO | NO | NO | **NEW - Not implemented** |

### NEW Fields Summary (13 from VALTA-FIELD-SPEC)

| # | VALTA # | Field | Implemented? | Priority Assessment |
|---|---------|-------|-------------|-------------------|
| 1 | 4 | AssignmentType | NO | Medium — single/multiple property |
| 2 | 16 | PropertySubtype | Partial (API only) | Medium — Apartment/Townhouse/Mixed Use |
| 3 | 17 | Tenancy | NO | High — Multi/Single/Owner/Vacant |
| 4 | 18 | StateofImprovements | NO | High — Existing/Proposed |
| 5 | 19 | StatusofImprovements | NO | High — Under Renovation etc. |
| 6 | 20 | InterestAppraised | Partial | Low — overlaps propertyRightsAppraised |
| 7 | 22 | ValueScenarios | Partial | Medium — multi-select version of valuationPremises |
| 8 | 23 | ApproachestoValue | NO | High — Cost/Income/Direct Comparison |
| 9 | 24 | ReportType (new list) | Partial | Low — Comprehensive/Concise/Form exists |
| 10 | 25 | DesktopReport | NO | Low — Yes/No flag |
| 11 | 26 | Valuetimeframe | NO | Medium — Current/Prospective/Retrospective |
| 12 | 33 | TransactionStatus | NO | Low — Listed/Under Contract/NA |
| 13 | 34 | ZoningStatus | NO | Low |
| 14 | 35 | LandMetric | NO | Low |
| 15 | 36 | EA | NO | Medium — narrative text |
| 16 | 37 | HC | NO | Medium — narrative text |

**Of the 13 NEW fields: 0 are fully implemented in the dashboard. 2 are partially mapped (InterestAppraised, ValueScenarios).**
