# Phase 3: Dashboard → DocuSeal LOE Field Mapping

## DocuSeal Field Mapping (22 fields via mapJobToDocuSealFields)

Source file: `src/utils/webhooks/docuseal.ts` lines 26-73

| # | DocuSeal Field Name | Source Object | Source Field | Type | Value Sent | Status |
|---|---------------------|---------------|-------------|------|-----------|--------|
| 1 | date_created | — | new Date().toLocaleDateString("en-US") | text | "3/28/2026" | AUTO |
| 2 | date_signed | — | "" | text | "" | CLIENT (filled on signing) |
| 3 | company_name | job | clientOrganization | text | "ABC Development Corp" | POPULATED |
| 4 | client_address | job | clientAddress | text | "123 Main St, Calgary" | POPULATED |
| 5 | client_name | job | clientFirstName + " " + clientLastName | text | "John Smith" | POPULATED |
| 6 | client_phone | job | clientPhone | text | "4035550100" | POPULATED |
| 7 | client_title | job | clientTitle | text | "VP of Real Estate" | POPULATED |
| 8 | client_email | job | clientEmail | text | "john@abc.ca" | POPULATED |
| 9 | property_address | job | propertyAddress | text | "456 River Rd" | POPULATED |
| 10 | notes | jobDetails / job | specialInstructions or notes | text | "Rush delivery" | POPULATED |
| 11 | scope_of_work | jobDetails | scopeOfWork | text | "All Applicable" | POPULATED |
| 12 | job_number | jobDetails | jobNumber | text | "CAL250137" | POPULATED |
| 13 | appraisal_fee | jobDetails | appraisalFee | number | 5000 | POPULATED |
| 14 | retainer_amount | jobDetails | retainerAmount | text | "$2,500" | POPULATED |
| 15 | **property_type** | — | "" | select | **""** | **EMPTY** |
| 16 | **intended_use** | — | "" | select | **""** | **EMPTY** |
| 17 | **requested_value** | — | "" | select | **""** | **EMPTY** |
| 18 | **property_rights** | — | "" | select | **""** | **EMPTY** |
| 19 | **report_type** | — | "" | select | **""** | **EMPTY** |
| 20 | **payment_terms** | — | "" | select | **""** | **EMPTY** |
| 21 | **report_delivery** | — | "" | select | **""** | **EMPTY** |
| 22 | client_signature | — | "" | signature | "" | CLIENT (filled on signing) |

## The 7 Empty SELECT Fields — Critical UX Gap

These fields are intentionally sent as empty strings to avoid "text bleed-through" in the DocuSeal template where pre-populated text overlaps with dropdown UI:

| # | Field | Dashboard Has Data? | Why Empty? | Client Impact |
|---|-------|-------------------|------------|--------------|
| 1 | property_type | YES (job.propertyType) | SELECT overlay bug | Client must re-select |
| 2 | intended_use | YES (job.intendedUse) | SELECT overlay bug | Client must re-select |
| 3 | requested_value | YES (jobDetails.valuationPremises) | SELECT overlay bug | Client must re-select |
| 4 | property_rights | YES (jobDetails.propertyRightsAppraised) | SELECT overlay bug | Client must re-select |
| 5 | report_type | YES (jobDetails.reportType) | SELECT overlay bug | Client must re-select |
| 6 | payment_terms | YES (jobDetails.paymentTerms) | SELECT overlay bug | Client must re-select |
| 7 | report_delivery | NO (not in dashboard) | No source field | Client must select fresh |

**Impact:** The client receives an LOE document where 7 dropdown fields are blank, even though 6 of those 7 have data in the dashboard. The client must manually re-select these values during the signing process. This is a known UX gap caused by a DocuSeal template rendering limitation.

**Recommendation:** Convert these 7 SELECT fields to TEXT fields in the DocuSeal template. Text fields don't have the overlay issue. Pre-populate with the actual values from the dashboard. The client can still edit if needed, but won't face blank dropdowns for data the appraiser already entered.

## V3 LOE Template Mapping (generateLOE.ts — mapDataToV3Fields)

The V3 template uses bracket-placeholder syntax. This is the HTML template path (different from DocuSeal API fields above):

| # | Template Placeholder | Source | Value Example |
|---|---------------------|--------|--------------|
| 1 | [date.created] | auto | "March 28, 2026" |
| 2 | [propertycontact.company] | job.clientOrganization | "ABC Development Corp" |
| 3 | [propertycontact.firstname] | job.clientFirstName | "John" |
| 4 | [propertycontact.lastname] | job.clientLastName | "Smith" |
| 5 | [propertycontact.title] | job.clientTitle | "VP of Real Estate" |
| 6 | [propertycontact.addressstreet] | job.clientAddress | "123 Main St" |
| 7 | [name] / [jobnumber] | jobDetails.jobNumber | "CAL250137" |
| 8 | [addressstreet] | job.propertyAddress | "456 River Rd" |
| 9 | [purposes] | job.intendedUse | "Financing/Refinancing" |
| 10 | [intendeduses] | job.intendedUse | "Financing/Refinancing" |
| 11 | [requestedvalues] | jobDetails.valuationPremises | "Market Value" |
| 12 | [propertyrights] | jobDetails.propertyRightsAppraised | "Fee Simple" |
| 13 | [reportformat] | jobDetails.reportType | "Full Narrative Report" |
| 14 | [fee] | jobDetails.appraisalFee | "$5,000" |
| 15 | [scopes] | jobDetails.scopeOfWork | "All Applicable" |
| 16 | [duedate] | jobDetails.deliveryDate | "15 business days" |
| 17 | [paymentterms] | jobDetails.paymentTerms | "Net 30 days" |
| 18 | [retainer] | jobDetails.retainerAmount | "$2,500" |
| 19 | [notes] | job.notes or specialInstructions | "Rush" |

**Note:** The V3 template path (generateLOE.ts) populates ALL fields including the 7 that DocuSeal sends empty. This means the HTML LOE preview shows correct data, but the DocuSeal signing flow sends those 7 as empty. Two different code paths with different behavior.

## Validation Required Fields (docuseal.ts lines 76-110)

Only 4 fields are hard-required to send LOE:
1. Client First Name
2. Client Last Name
3. Client Email
4. Property Address

Soft warnings (don't block): Job Number, Appraisal Fee
