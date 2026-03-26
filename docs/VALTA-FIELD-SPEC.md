# Valta Master Field Registry — Specification Tables

*Converted from Valta Master Field Registry.xlsx*

## 1. Field Registry

**62 fields total**

| # | Field Name | Label | Control Type | Source | Dropdown | Outputs | New | Required | Valcre Field | Record Location |
|---|-----------|-------|-------------|--------|----------|---------|-----|----------|-------------|----------------|
| 1 | JobNumber | Job Number | Alpha Numeric | Valcre API |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 2 | JobName | Job Name | Alpha Numeric | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 3 | JobStatus | Job Status | Select one option | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 4 | AssignmentType | Assignment Type | Select one option | User Input | ListAssignmentType | LOR, Excel, Word, CU | No | Yes |  | Job |
| 5 | SubjectProperty | Subject Property | Alpha Numeric | Valcre API |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 6 | ClientFirstName | Client First Name | Text | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 7 | ClientLastName | Client Last Name | Text | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 8 | ClientTitle | Client Title | Text | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 9 | ClientCompanyName | Client Company Name | Alpha Numeric | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 10 | ClientOrganizationAddress | Client Organization Address | Alpha Numeric | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 11 | ClientPhone | Client Phone | Text | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 12 | ClientEmail | Client Email | Text | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 13 | PropertyName | Property Name | Alpha Numeric | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 14 | PropertyAddress | Property Address | Alpha Numeric | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 15 | PropertyType | Property Type | Select one option | User Input | ListPropertyType | LOR, Excel, Word, CU | No | Yes |  | Job |
| 16 | PropertySubtype | Property Subtype | Select one option | User Input | ListPropertySubtype | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 17 | Tenancy | Tenancy | Select one option | User Input | ListTenancy | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 18 | StateofImprovements | State of Improvements | Select one option | User Input | ListSateofImprovements | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 19 | StatusofImprovements | Status of Improvements | Select one option | User Input | ListSatusofImprovements | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 20 | InterestAppraised | Interest Appraised | Select multiple options | User Input | ListInterestAppraised | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 21 | AuthorizedUse | Authorized Use | Select one option | User Input | ListAuthorizedUse | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 22 | ValueScenarios | Value Scenario (s) | Select multiple options | User Input | ListValueScenarios | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 23 | ApproachestoValue | Approaches to Value | Select multiple options | Logic | ListApproachestoValue | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 24 | ReportType | Report Type | Select one option | User Input | ListReportType | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 25 | DesktopReport | Desktop Report | Select one option | User Input | ListYes/No | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 26 | Valuetimeframe | Value Timeframe | Select one option | User Input | ListValueTimeFrame | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 27 | InspectionDate | Inspection Date | Date | User Input |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 28 | Fee | Fee | Whole Number | Calculated |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 29 | Paid | Paid | Checkbox | Logic |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 30 | RequestDate | Request Date | Date | Logic |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 31 | SignedDate | Signed Date | Date | Logic |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 32 | DueDate | Due Date | Date | Logic |  | LOR, Excel, Word, CU | No | Yes |  | Job |
| 33 | TransactionStatus | Transaction Status | Select multiple options | User Input | ListTransactionStatus | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 34 | ZoningStatus | Zoning Status | Select one option | User Input | ListZoningStatus | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 35 | LandMetric | Land $/Metric | Select one option | User Input | ListLand$/Metric | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 36 | EA | EA | Multiple lines of text | Logic |  | LOR, Excel, Word, CU | Yes | Yes |  | Job |
| 37 | HC | HC | Multiple lines of text | Logic |  |  |  |  |  |  |

## 2. Dropdown Lists

### ListPropertyType
Values: Multifamily | Self-Storage | Retail | Industrial | Office | Land | Hotel | Seniors  | Other

### ListPropertySubtype
Values: Apartment | Townhouse | Mixed Use

### ListTenancy
Values: Multi-Tenant | Owner Occupied | Partial Owner Occupied | Single-Tenant | Unkown | Vacant

### ListInterestAppraised
Values: Fee Simple  | Leased Fee Interest | Leasehold Estate | Going Concern

### ListAuthorizedUse
Values: First Mortgage Financing | Financial Reporting | Insurance | Internal Decision-Making | Acquisition-Disposition | Estate Planning | Litigation | GST

### ListValueTimeFrame
Values: Current | Prospective | Retrospective

### ListSateofImprovements
Values: Existing Property | Proposed

### ListSatusofImprovements
Values: Existing - Completed | Existing - Renovated | Existing - Under Renovation | Existing - To Be Renovated | Proposed - Vacant Land | Proposed - Improved Land (Demolition Required)  | Proposed - Under Construction

### ListValueScenarios
Values: As Is Vacant Land | As If Vacant Land | As If Complete & Stabilized | As-Is | As Stabilized | As If Complete & Stabilized - Renovated | As If Rezoned | As If Complete - Rezoned | As If Complete - Serviced | As If Complete - Subdivided | Insurable Replacement Cost | Retrospective

### ListApproachestoValue
Values: Land Direct Comparison Approach | Cost Approach | Direct Comparison Approach | Income Approach

### ListMethod
Values: Direct Capitalization Method | Discounted Cash Flow Method

### ListReportType
Values: Comprehensive | Concise | Form

### ListAssignmentType
Values: Single Property | Multiple Properties

### ListTransactionStatus
Values: Not Applicable | Listed | Under Contract

### ListSourceType
Values: User Input | Valcre API | Calculated | Logic

### ListOutputType
Values: LOE | Excel | Word | LOR | ClickUP | QBO | LOE, Excel, Word | LOR, Excel, Word, CU | LOE, Excel, Word, LOR, CU | LOE, Excel, Word, LOR, CU, QBO

### ListValcreRecordLocation
Values: Job | Contact | Property | Building | Parcel

### ListDataControlType
Values: Text | Multiple lines of text | Whole Number | Decimal | Select one option | Select multiple options | Checkbox | Date | Calculation | Alpha Numeric

### ListYes/No
Values: Yes | No

## 3. Rules Matrix

| Rule ID | Group | Type | Trigger Field | Operator | Trigger Value | Action | Target Field | Result |
|---------|-------|------|--------------|----------|--------------|--------|-------------|--------|
| R001 | Interest Rule | Derive Value | C18 | = | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | C23 | DD:E2 |
| R002 | Interest Rule | Derive Value | =+D2 |  | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | =+H2 | DD:E2 |
| R003 | Interest Rule | Derive Value | =+D2 |  | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | =+H2 | DD:E3 |
| R004 | Interest Rule | Derive Value | =+D2 |  | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | =+H2 | DD:E3 |
| R005 | Interest Rule | Derive Value | =+D2 |  | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | =+H2 | DD:E3 |
| R006 | Interest Rule | Derive Value | =+D2 |  | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | =+H2 | DD:E2 |
| R007 | Interest Rule | Derive Value | =+D2 |  | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | =+H2 | =+I2 |
| R008 | Interest Rule | Derive Value | =+D2 |  | =+tblPropertyType[[#This Row],[ListPropertyType]] | Set Value | =+H2 | =+I2 |
| R009 | Interest Rule | Derive Value | C20 |  | DD:D3 | Set Value | =+H3 | =+I3 |

## 4. Narrative Library

### EA-001: As If Vacant  Demolition
**Type:** Extraordinary Assumption
**Used In:** Report | LOE
> The As If Vacant market land value is developed under the hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. This condition is contrary to the known physical state of the property and is made for the purpo...

### EA-002: As If Vacant  Demolition
**Type:** Extraordinary Assumption
**Used In:** Report | LOE
> The As If Vacant market land value is developed under the hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. This condition is contrary to the known physical state of the property and is made for the purpo...
