# APR Dashboard — Field Mapping by Workflow Stage

Every field in the APR pipeline, organized by the stage where it enters the system. Columns: what the user sees, what the code calls it, what type it is, what options exist (if dropdown), where it lives in Supabase, and where it maps in Valcre.

---

## Stage 1: Client Form Submission

Fields the client fills on the intake form at `/`. 18 content fields + file upload + 4 auto-generated.

### Client Information Section

| Field Label | Field Name | Type | Options | DB Column | Valcre Field |
|-------------|-----------|------|---------|-----------|-------------|
| First Name | clientFirstName | text | — | client_first_name | Contact.FirstName |
| Last Name | clientLastName | text | — | client_last_name | Contact.LastName |
| Client Title | clientTitle | text | — | client_title | Contact.Title |
| Client Company Name | clientOrganization | text | — | client_organization | Contact.Company |
| Client Organization Address | clientAddress | text | — | client_address | Contact.AddressStreet (via parseAddress) |
| Client Phone | clientPhone | text | — | client_phone | Contact.PhoneNumber |
| Client Email | clientEmail | text | — | client_email | Contact.Email |

### Property Information Section

| Field Label | Field Name | Type | Options | DB Column | Valcre Field |
|-------------|-----------|------|---------|-----------|-------------|
| Property Name | propertyName | text | — | property_name | Property.Name |
| Property Address | propertyAddress | text | — | property_address | Property.AddressStreet (via parseAddress) |
| Property Type | propertyType | dropdown (single) | Agriculture, Building, Healthcare, Hospitality, Industrial, Land, Manufactured Housing, Multi-Family, Office, Retail, Self-Storage, Single-Family, Special Purpose | property_type | Property.PropertyType (via PROPERTY_TYPE_MAP) + Property.Types (via TYPES_FIELD_MAP) |
| Authorized Use | intendedUse | dropdown | First Mortgage Financing, Financial Reporting, Insurance, Internal Decision-Making, Acquisition-Disposition, Estate Planning, Litigation, GST | intended_use | Job.IntendedUses (via INTENDED_USES_MAP) |
| Valuation Premises | valuationPremises | dropdown | Market Value, As-Is, Market Rent, Liquidation Value, Investment Value, Insurable Value, Prospective at Completion, Prospective at Stabilization | valuation_premises | Job.RequestedValues (via REQUESTED_VALUES_MAP) |
| Asset Current Condition | assetCondition | dropdown | Excellent, Good, Average, Poor | asset_condition | Property.InvestmentGrade (Excellent=1, Good=2, Average=3, Poor=4) |

### Property Contact Section

| Field Label | Field Name | Type | Options | DB Column | Valcre Field |
|-------------|-----------|------|---------|-----------|-------------|
| First Name / Department | propertyContactFirstName | text | — | property_contact_first_name | PropertyContact.FirstName |
| Last Name | propertyContactLastName | text | — | property_contact_last_name | PropertyContact.LastName |
| Email | propertyContactEmail | text | — | property_contact_email | PropertyContact.Email |
| Phone | propertyContactPhone | text | — | property_contact_phone | PropertyContact.PhoneNumber |

### Notes & Files Section

| Field Label | Field Name | Type | Options | DB Column | Valcre Field |
|-------------|-----------|------|---------|-----------|-------------|
| Additional Information | notes | textarea | — | notes | — |
| File Upload | files | file | — | job_files (separate table) | — |

### Auto-Generated Fields

| Field | DB Column | Value |
|-------|-----------|-------|
| Status | status | auto |
| Source | source | "webform" |
| Tags | tags | [] |
| Source Metadata | source_metadata | referrer + user agent |

**Gotcha:** Property Type is single-select on the form but multi-select (comma-separated) on the dashboard. Form submits a string; dashboard allows adding multiple types.

---

## Stage 2: Dashboard Receives Form

How the 18 client-submitted fields appear on the dashboard when the appraiser opens a job. All fields are editable with auto-save on blur. If a Valcre job exists, blur also triggers a Valcre PATCH.

### Client Information (dashboard section)

| Dashboard Label | Display Type | Editable | Source DB Column | Auto-Syncs to Valcre |
|----------------|-------------|----------|-----------------|---------------------|
| First Name | text input | Yes | client_first_name | Yes |
| Last Name | text input | Yes | client_last_name | Yes |
| Client Title | text input | Yes | client_title | Yes |
| Client Company Name | text input | Yes | client_organization | Yes |
| Client Organization Address | text input | Yes | client_address | Yes |
| Client Phone | text input (formatted as (XXX) XXX-XXXX) | Yes | client_phone | Yes |
| Client Email | text input | Yes | client_email | Yes |

### Property Information (dashboard section)

| Dashboard Label | Display Type | Editable | Source DB Column | Auto-Syncs to Valcre |
|----------------|-------------|----------|-----------------|---------------------|
| Property Name | text input | Yes | property_name | Yes |
| Property Address | text input | Yes | property_address | Yes |
| Property Type | multi-select chips | Yes (add/remove) | property_type (comma-separated string) | Yes |
| Intended Use | select dropdown | Yes | intended_use | Yes |
| Valuation Premises | select dropdown | Yes | valuation_premises | Yes |
| Asset Current Condition | select dropdown | Yes | asset_condition | Yes |

### Property Contact (dashboard section)

| Dashboard Label | Display Type | Editable | Source DB Column | Auto-Syncs to Valcre |
|----------------|-------------|----------|-----------------|---------------------|
| Property Contact First Name | text input | Yes | property_contact_first_name | Yes |
| Property Contact Last Name | text input | Yes | property_contact_last_name | Yes |
| Property Contact Email | text input | Yes | property_contact_email | Yes |
| Property Contact Phone | text input (formatted) | Yes | property_contact_phone | Yes |

### Client Comments (dashboard section)

| Dashboard Label | Display Type | Editable | Source DB Column | Auto-Syncs to Valcre |
|----------------|-------------|----------|-----------------|---------------------|
| Notes | textarea | Yes | notes | Yes |

### Uploaded Documents (dashboard section)

| Dashboard Label | Display Type | Source |
|----------------|-------------|-------|
| File list | file names with actions | job_files table (name, path, type, size) |

**Note:** Phone numbers display formatted `(403) 555-0100` but save as numbers-only. Dashboard auto-save fires on blur for every field.

---

## Stage 3: Prep for LOE

Fields the APPRAISER fills on the dashboard job detail — these were NOT on the client form. They live in the `job_loe_details` Supabase table (separate from `job_submissions`). Each auto-saves on blur and triggers Valcre PATCH if a job exists.

| Field Label | Field Name | Type | Options | DB Column (job_loe_details) | Valcre Field |
|-------------|-----------|------|---------|---------------------------|-------------|
| Appraisal Fee | appraisalFee | number ($) | — | appraisal_fee | Job.Fee (strips $ and commas) |
| Retainer Amount | retainerAmount | number ($) | — | retainer_amount | Job.Retainer (strips $ and commas) |
| Delivery Date | deliveryDate | date | — | delivery_date | Job.DueDate (split at T) |
| Intended Use | intendedUse | dropdown | First Mortgage Financing, Financial Reporting, Insurance, Internal Decision-Making, Acquisition-Disposition, Estate Planning, Litigation, GST, Financing/Refinancing, Consulting, Dispute Resolution, Divorce, Establish Sales Price, Property Tax Appeal, Review, Other | intended_use | Job.IntendedUses (via INTENDED_USES_MAP, 23 values) |
| Scope of Work | scopeOfWork | dropdown | All Applicable, Best One Approach, Best Two Approaches, Cost Approach, Direct Comparison Approach, Discounted Cash Flow, Feasibility Study, Income Approach, Land Value, Litigation, Market Research, Market Study, Net Rent Review, Update | scope_of_work | Job.Scopes (via SCOPE_OF_WORK_MAP, 14 values) |
| Valuation Premises | valuationPremises | dropdown | Market Value, As-Is, Market Rent, Liquidation Value, Investment Value, Insurable Value, Prospective at Completion, Prospective at Stabilization, As-Vacant, Insurable Replacement Cost, Bulk Value, Disposition, Go Dark, Hypothetical, In Use, Lots, Lots to Houses, Market Rent Study, Retrospective, Tax Credits, Other | valuation_premises | Job.RequestedValues (via REQUESTED_VALUES_MAP, 22 values) |
| Property Rights Appraised | propertyRightsAppraised | dropdown | Fee Simple Interest, Leased Fee Interest, Leasehold Interest, Undivided Interest, Partial Interest, Partial Interest Taking, Total Taking, Rent Restricted, Market Study, Going Concern, Condominium Ownership, Cost Segregation Study, ASC 805, None, Other | property_rights_appraised | Job.Purposes (via PURPOSES_MAP, 15 values) |
| Report Type | reportType | dropdown | Comprehensive, Summary, Restricted, Form, Appraisal Report, Amendment Letter, Broker Opinion of Value, Completion Report, Consultation, Desk Review, Evaluation, Peer Review, Rent Study, Restricted Appraisal Report | report_type | Job.ReportFormat (via REPORT_FORMAT_MAP, 14 values) |
| Analysis Level | analysisLevel | dropdown | Comprehensive, Concise, Form | analysis_level | Job.AnalysisLevel (Comprehensive=Detailed, Concise=Concise, Form=Form) |
| Payment Terms | paymentTerms | text | — | payment_terms | Job.Comments (appended as "Payment Terms: {value}") |
| Special Instructions | specialInstructions | textarea | — | special_instructions | Job.ClientComments |
| Internal Comments | internalComments | textarea | — | internal_comments | Job.Comments |
| Delivery Comments | deliveryComments | textarea | — | delivery_comments | Job.DeliveryComments |
| Payment Comments | paymentComments | textarea | — | payment_comments | Job.PaymentComments |

### Workflow Gates

| Gate | Required Fields | Enables |
|------|----------------|---------|
| Valcre Gate | Property Address + Property Type + Intended Use + Appraisal Fee + Scope of Work + Valuation Premises | "Create Valcre Job" button |
| LOE Gate | Valid VAL number + Client First Name + Client Last Name + Client Email + Property Address | "Preview & Send LOE" button |

**Gotcha:** Valcre gate checks `valuation_premises` from `job_loe_details`, but the intake form writes it to `job_submissions`. New jobs show the value on screen but the gate fails until the LOE details record exists.

**Gotcha:** Valcre field is `Scopes` NOT `ScopeOfWork` — using wrong name returns 400 error.

**Gotcha:** "Form" in REPORT_FORMAT_MAP is skipped — not a valid Valcre ReportFormat enum.

**Gotcha:** Payment Terms has no dedicated Valcre field — gets appended to Comments.

---

## Stage 4: Generate Valcre Job Number

Fields sent to Valcre when "Create Valcre Job" is clicked. Creates 3 linked entities. All values come from Stages 1-3 fields, mapped through 6 conversion maps.

### Contact Entity (Valcre)

| Valcre Field | Source | Conversion |
|-------------|--------|-----------|
| Contact.FirstName | clientFirstName | direct |
| Contact.LastName | clientLastName | direct |
| Contact.Email | clientEmail | direct (used for dedup search) |
| Contact.PhoneNumber | clientPhone | direct |
| Contact.Title | clientTitle | direct (defaults to "Client") |
| Contact.Company | clientOrganization | direct |
| Contact.AddressStreet | clientAddress | via parseAddress() → street |
| Contact.AddressCity | clientAddress | via parseAddress() → city (default: Calgary) |
| Contact.AddressState | clientAddress | via parseAddress() → province (default: AB) |
| Contact.AddressPostalCode | clientAddress | via parseAddress() → postalCode |
| Contact.OwnerId | — | hardcoded 7095 (Chris Chornohos) |

If property contact has different email, a second Contact entity is created with PropertyContact fields.

### Property Entity (Valcre)

| Valcre Field | Source | Conversion |
|-------------|--------|-----------|
| Property.Name | propertyName | direct |
| Property.AddressStreet | propertyAddress | via parseAddress() |
| Property.AddressCity | propertyAddress | via parseAddress() |
| Property.AddressState | propertyAddress | via parseAddress() |
| Property.AddressPostalCode | propertyAddress | via parseAddress() |
| Property.PropertyType | propertyType (first value) | PROPERTY_TYPE_MAP: Mixed Use/Commercial/Residential/Multi-Family → Building. Others pass through. |
| Property.Types | propertyType (all values) | TYPES_FIELD_MAP: Multi-Family→MultiFamily, Single-Family→SingleFamily, Self-Storage→SelfStorage, Manufactured Housing→ManufacturedHousing, Special Purpose→SpecialPurpose, Healthcare→HealthCare |
| Property.InvestmentGrade | assetCondition | gradeMap: Excellent→1, Good→2, Average→3, Poor→4 (Valcre converts to letter: 2→B) |
| Property.YearBuilt | yearBuilt | direct |
| Property.SizeSF | buildingSize | direct |
| Property.BuildingsCount | numberOfUnits | direct |
| Property.ParkingSpacesCount | parkingSpaces | direct |
| Property.Zoning | zoningClassification | direct |
| Property.ZoningName | zoneAbbreviation | direct |
| Property.ProposedLandUse | landUseDesignation | direct |
| Property.SiteFloodZone | floodZone | direct |
| Property.Utilities | utilities | direct |
| Property.BuildableArea | usableLandSF | direct |
| Property.DescriptionText | legalDescription | prepend "Legal: " |

### Job Entity (Valcre)

| Valcre Field | Source | Conversion Map |
|-------------|--------|---------------|
| Job.Fee | appraisalFee | parseDollarAmount (strips $ and commas) |
| Job.Retainer | retainerAmount | strips $ and commas |
| Job.DueDate | deliveryDate | split at T |
| Job.IntendedUses | intendedUse | INTENDED_USES_MAP (23 values) |
| Job.Scopes | scopeOfWork | SCOPE_OF_WORK_MAP (14 values) |
| Job.RequestedValues | valuationPremises | REQUESTED_VALUES_MAP (22 values) |
| Job.Purposes | propertyRightsAppraised | PURPOSES_MAP (15 values) |
| Job.ReportFormat | reportType | REPORT_FORMAT_MAP (14 values, "Form" skipped) |
| Job.AnalysisLevel | analysisLevel | ANALYSIS_LEVEL_MAP (3 values) |
| Job.ClientComments | specialInstructions | direct |
| Job.Comments | internalComments | direct (+ Payment Terms appended) |
| Job.DeliveryComments | deliveryComments | direct |
| Job.PaymentComments | paymentComments | direct |

### Conversion Maps (complete values)

**INTENDED_USES_MAP** (Dashboard → Valcre IntendedUses)

| Dashboard Value | Valcre Enum |
|----------------|------------|
| First Mortgage Financing | Financing |
| Financial Reporting | FinancialReporting |
| Insurance | Financing |
| Internal Decision-Making | DecisionMakingInternal |
| Acquisition-Disposition | AcquisitionDisposition |
| Estate Planning | EstatePlanning |
| Litigation | Litigation |
| GST | Other |
| Financing/Refinancing | Financing |
| Financing | Financing |
| Acquisition | AcquisitionDisposition |
| Disposition | AcquisitionDisposition |
| Tax Appeal | PropertyTaxAppeal |
| Internal Valuation | DecisionMakingInternal |
| Acquisition/Disposition | AcquisitionDisposition |
| Consulting | Consulting |
| Decision-Making/Internal | DecisionMakingInternal |
| Dispute Resolution | DisputeResolution |
| Divorce | Divorce |
| Establish Sales Price | EstablishSalesPrice |
| Other | Other |
| Property Tax Appeal | PropertyTaxAppeal |
| Review | Review |

**SCOPE_OF_WORK_MAP** (Dashboard → Valcre Scopes)

| Dashboard Value | Valcre Enum |
|----------------|------------|
| All Applicable | AllApplicable |
| Best One Approach | BestOneApproach |
| Best Two Approaches | BestTwoApproaches |
| Cost Approach | CostApproach |
| Direct Comparison Approach | DirectComparisonApproach |
| Discounted Cash Flow | DiscountedCashFlow |
| Feasibility Study | FeasibilityStudy |
| Income Approach | IncomeApproach |
| Land Value | LandValue |
| Litigation | Litigation |
| Market Research | MarketResearch |
| Market Study | MarketStudy |
| Net Rent Review | NetRentReview |
| Update | Update |

**REQUESTED_VALUES_MAP** (Dashboard Valuation Premises → Valcre RequestedValues)

| Dashboard Value | Valcre Enum |
|----------------|------------|
| Market Value | AsIs |
| As-Is | AsIs |
| Market Rent | MarketRentStudy |
| Liquidation Value | Liquidation |
| Investment Value | ProspectiveAtStabilization |
| Insurable Value | InsurableReplacementCost |
| Prospective at Completion | ProspectiveAtCompletion |
| Prospective at Stabilization | ProspectiveAtStabilization |
| As-Vacant | AsVacant |
| Insurable Replacement Cost | InsurableReplacementCost |
| Bulk Value | BulkValue |
| Disposition | Disposition |
| Go Dark | GoDark |
| Hypothetical | Hypothetical |
| In Use | InUse |
| Lots | Lots |
| Lots to Houses | LotsToHouses |
| Market Rent Study | MarketRentStudy |
| Other | Other |
| Rent Restricted | RentRestricted |
| Retrospective | Retrospective |
| Tax Credits | TaxCredits |

**PURPOSES_MAP** (Dashboard Property Rights → Valcre Purposes)

| Dashboard Value | Valcre Enum |
|----------------|------------|
| Fee Simple Interest | FeeSimple |
| Leased Fee Interest | LeasedFee |
| Leasehold Interest | Leasehold |
| Undivided Interest | UndividedInterest |
| Partial Interest | PartialInterest |
| Partial Interest Taking | PartialInterestTaking |
| Total Taking | TotalTaking |
| Rent Restricted | RentRestricted |
| Market Study | MarketStudy |
| Other | Other |
| Going Concern | GoingConcern |
| Condominium Ownership | CondominiumOwnership |
| Cost Segregation Study | CostSegregationStudy |
| ASC 805 | ASC805 |
| None | None |

**REPORT_FORMAT_MAP** (Dashboard Report Type → Valcre ReportFormat)

| Dashboard Value | Valcre Enum |
|----------------|------------|
| Comprehensive | Appraisal |
| Summary | Appraisal |
| Restricted | RestrictedAppraisal |
| Form | *(skipped — not valid)* |
| Appraisal Report | Appraisal |
| Amendment Letter | AmendmentLetter |
| Broker Opinion of Value | BrokerOpinionOfValue |
| Completion Report | CompletionReport |
| Consultation | Consultation |
| Desk Review | DeskReview |
| Evaluation | Evaluation |
| Peer Review | PeerReview |
| Rent Study | RentStudy |
| Restricted Appraisal Report | RestrictedAppraisal |

### Parcel/Assessment Fields (Update-only limitation)

During initial creation these go to proper Property fields. During PATCH updates they get appended to Job.Comments because the Property entity ID isn't available.

| Dashboard Field | On Creation | On Update |
|----------------|------------|----------|
| Parcel Number | Property field | Comments (appended) |
| Legal Description | Property.DescriptionText | Comments (appended) |
| Usable Land SF | Property.BuildableArea | Comments (appended) |
| Gross Land SF | Property field | Comments (appended) |
| Assessment Year | Property field | Comments (appended) |
| Land Assessment Value | Property field | Comments (appended) |
| Improved Assessment Value | Property field | Comments (appended) |
| Taxes | Property field | Comments (appended) |

---

## Stage 5: LOE Document (DocuSeal)

Fields that populate the LOE e-signature document. Two code paths exist — only the V3 HTML path is active.

### DocuSeal API Fields (legacy path — docuseal.ts, DEAD CODE)

22 fields sent to DocuSeal submissions API. 7 SELECT fields intentionally sent empty to avoid template overlay bugs.

| DocuSeal Field | Source | Type | Value Sent | Status |
|---------------|--------|------|-----------|--------|
| date_created | auto | text | "3/28/2026" | AUTO |
| date_signed | — | text | "" | CLIENT fills on signing |
| company_name | job.clientOrganization | text | "ABC Development Corp" | POPULATED |
| client_address | job.clientAddress | text | "123 Main St, Calgary" | POPULATED |
| client_name | clientFirstName + " " + clientLastName | text | "John Smith" | POPULATED |
| client_phone | job.clientPhone | text | "4035550100" | POPULATED |
| client_title | job.clientTitle | text | "VP of Real Estate" | POPULATED |
| client_email | job.clientEmail | text | "john@abc.ca" | POPULATED |
| property_address | job.propertyAddress | text | "456 River Rd" | POPULATED |
| notes | specialInstructions or notes | text | "Rush delivery" | POPULATED |
| scope_of_work | jobDetails.scopeOfWork | text | "All Applicable" | POPULATED |
| job_number | jobDetails.jobNumber | text | "VAL261028" | POPULATED |
| appraisal_fee | jobDetails.appraisalFee | number | 5000 | POPULATED |
| retainer_amount | jobDetails.retainerAmount | text | "$2,500" | POPULATED |
| property_type | — | select | "" | EMPTY |
| intended_use | — | select | "" | EMPTY |
| requested_value | — | select | "" | EMPTY |
| property_rights | — | select | "" | EMPTY |
| report_type | — | select | "" | EMPTY |
| payment_terms | — | select | "" | EMPTY |
| report_delivery | — | select | "" | EMPTY |
| client_signature | — | signature | "" | CLIENT fills on signing |

### V3 HTML Template Fields (generateLOE.ts — ACTIVE PATH)

19 placeholders in the HTML template. This path populates ALL fields including the 7 that DocuSeal sends empty.

| Template Placeholder | Source | Example Value |
|---------------------|--------|--------------|
| [date.created] | auto | "March 28, 2026" |
| [propertycontact.company] | job.clientOrganization | "ABC Development Corp" |
| [propertycontact.firstname] | job.clientFirstName | "John" |
| [propertycontact.lastname] | job.clientLastName | "Smith" |
| [propertycontact.title] | job.clientTitle | "VP of Real Estate" |
| [propertycontact.addressstreet] | job.clientAddress | "123 Main St" |
| [name] / [jobnumber] | jobDetails.jobNumber | "VAL261028" |
| [addressstreet] | job.propertyAddress | "456 River Rd" |
| [purposes] | job.intendedUse | "Financing/Refinancing" |
| [intendeduses] | job.intendedUse | "Financing/Refinancing" |
| [requestedvalues] | jobDetails.valuationPremises | "Market Value" |
| [propertyrights] | jobDetails.propertyRightsAppraised | "Fee Simple" |
| [reportformat] | jobDetails.reportType | "Full Narrative Report" |
| [fee] | jobDetails.appraisalFee | "$5,000" |
| [scopes] | jobDetails.scopeOfWork | "All Applicable" |
| [duedate] | jobDetails.deliveryDate | "15 business days" |
| [paymentterms] | jobDetails.paymentTerms | "Net 30 days" |
| [retainer] | jobDetails.retainerAmount | "$2,500" |
| [notes] | job.notes or specialInstructions | "Rush" |

**Gotcha:** [purposes] placeholder shows intendedUse value in the Property Type row — template mapping error.

**Required to send:** Client First Name, Client Last Name, Client Email, Property Address. Soft warnings (don't block): Job Number, Appraisal Fee.

---

## Stage 6: Client Signs LOE

DocuSeal fires a `submission.completed` webhook when the client signs. Minimal field set — mostly status updates.

### Webhook Payload Fields

| Field | Type | Description |
|-------|------|------------|
| event_type | string | "submission.completed" or "submission.created" |
| data.id | string | DocuSeal submission ID |
| data.status | string | Submission status |
| data.email | string | Signer email |
| data.created_at | string | When submission was created |
| data.completed_at | string | When signing completed |
| data.documents[].id | string | Document ID |
| data.documents[].name | string | Document filename |
| data.documents[].url | string | Signed document download URL |

### What Gets Updated

| System | Field Updated | Value |
|--------|-------------|-------|
| Supabase (loe_submissions) | document_url | Signed document URL from webhook |
| ClickUp | — | **NOTHING** (gap — webhook doesn't update ClickUp checklist) |

**Gap:** `handleDocuSealWebhook` updates the database with the signed document URL but does NOT call `updateClickUpChecklist`. The ClickUp task doesn't know the LOE was signed.

---

## Stage 7: Create ClickUp Task

ClickUp task created after Valcre job booking. Updated again when LOE is sent.

### Initial Task Creation Fields

| ClickUp Field | Source | Value |
|--------------|--------|-------|
| name | propertyName + propertyAddress | "Harbourfront Tower, 456 River Rd, Calgary" |
| markdown_description | template (see below) | Markdown with client/property/job fields |
| tags | hardcoded | ["NEW ARRIVAL", "APR Hub"] |
| template_id | config | t-86b3exqe8 |
| list_id | config (env-dependent) | test: 901703694310, production: 901402094744 |

### Fields in Task Description (on creation)

| Field in Description | Source |
|---------------------|--------|
| Client | clientFirstName + clientLastName |
| Property | propertyName + propertyAddress |
| Type | propertyType |
| Intended Use | intendedUse |
| Notes | notes (if present) |
| APR Hub link | jobId in URL |

### Fields Updated After Valcre Booking

| ClickUp Field | New Value |
|--------------|----------|
| name | "{VAL number} - {propertyAddress}" |
| markdown_description | Updated with VAL number, "JOB BOOKED" header |
| checklist item | "9. Book Job" → resolved |

### Fields Updated After LOE Send

| ClickUp Field | New Value |
|--------------|----------|
| checklist item | "1. Create & Send LOE" → resolved |

### Environment Config

| Setting | Test | Production |
|---------|------|-----------|
| Workspace ID | 8555561 | 9014181018 |
| List ID | 901703694310 | 901402094744 |
| Template | t-86b3exqe8 | t-86b3exqe8 |
| Workspace Name | BC WorkSpace | Valta |

**Gotcha:** Client-side direct ClickUp API calls fail (CORS). Only edge function path works.

**Gotcha:** "View in ClickUp" button renders but is noop on some jobs — task ID exists but URL not constructed.

---

## Stage 8: Post-Approval Workflow (Future)

Report Builder exists as standalone at `/mock-builder` with 2084 fields in `fieldRegistry.ts` and a 79-page HTML template. NOT connected to the database — `report_builder_data` table does not exist yet.

### What Exists

| Component | Status |
|-----------|--------|
| fieldRegistry.ts | 22K lines, 2084 field definitions | Built |
| Report-MF-template.html | 31K lines, 79 pages | Built |
| reportBuilderStore.ts | Zustand store (no persistence) | Built |
| /mock-builder route | Standalone page | Built |
| report_builder_data table | DOES NOT EXIST | Not built |
| /dashboard/job/:jobId/report route | Not implemented | Not built |
| Data bridge (job data → report) | Not implemented | Not built |

### What Needs Building

1. Create `report_builder_data` Supabase table + migration
2. Route: `/dashboard/job/:jobId/report`
3. Data bridge: job_submissions + job_loe_details → Report Builder "Home" section
4. Auto-save: 2-second debounce to Supabase

Field mapping for report builder fields is documented separately in `docs/Features/07-Report-Builder/` and `docs/Features/08-Master-Field-Registry/`.
