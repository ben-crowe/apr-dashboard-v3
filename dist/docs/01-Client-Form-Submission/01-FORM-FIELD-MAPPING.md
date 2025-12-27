# Client Form Submission - Field Mapping

**Status:** ✅ Production Form (Live)
**Form URL:** https://valta.ca/request-appraisal/intake?embedded=true
**Last Updated:** November 5, 2025

---

## What This Mapping Shows

**Visual Form Layout** → Database Storage

You'll see the form as it appears to the client, then the database columns each field maps to.

---

## Visual Form Layout

```
CLIENT INFORMATION

First Name *                         Last Name *
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Client Title                         Client Organization
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Client Organization Address
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Phone *                              Email *
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘


PROPERTY & JOB INFORMATION

Property Name *                      Property Address
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Property Type *                      Intended Use
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│ ▼ Please Select                 │  │ ▼ Please Select                 │
└─────────────────────────────────┘  └─────────────────────────────────┘
  • Multifamily                        • Financing Purposes
  • Self Storage                       • Internal Business Decisions
  • Retail                             • Underwriting Decisions
  • Industrial                         • Litigation Purposes
  • Land                               • Other
  • Office
  • Hotel
  • Senior
  • Other

Valuation Premises
┌─────────────────────────────────────────────────────────────────────┐
│ ▼ Please Select                                                     │
└─────────────────────────────────────────────────────────────────────┘
  • Market Value As Is
  • Market Value As Is & As Stabilized
  • Market Value As Complete & As Stabilized
  • Market Value Land As Is & As Complete & As Stabilized
  • Market Value Land As Is
  • Market Value Land As Is & As Rezoned

Asset Current Condition
┌─────────────────────────────────────────────────────────────────────┐
│ ▼ Please Select                                                     │
└─────────────────────────────────────────────────────────────────────┘
  • New Development
  • Existing Property

Additional Information
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      REQUIRED DOCUMENTS                             │
└─────────────────────────────────────────────────────────────────────┘

Please upload the following documents:

  • Full Property Details or Prior Appraisal
  • Proforma
  • Unit Mix (MF/SS) or Rent Roll (Retail/Office/Industrial)
  • Operating Expenses (1-3 Years Historical and Budget)
  • Drawings/Plans (New Developments only)
  • Contact for property tour (Existing Buildings only)

┌──────────────────────────────────────────────────────────────┐
│  📎 Drop files here or click to upload                      │
│                                                              │
│  Supported: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG            │
│  Max 10MB per file                                          │
└──────────────────────────────────────────────────────────────┘


                    [ Submit Appraisal Request → ]


                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓


═══════════════════════════════════════════════════════════════════════
        APR DASHBOARD - SECTION 1: Client Information & Property Details
═══════════════════════════════════════════════════════════════════════

CLIENT INFORMATION

     First Name: ┌──────────────────────┐           Last Name: ┌──────────────────────┐
                 └──────────────────────┘                      └──────────────────────┘

          Title: ┌──────────────────────┐      Organization: ┌──────────────────────┐
                 └──────────────────────┘                      └──────────────────────┘

          Phone: ┌──────────────────────┐               Email: ┌──────────────────────┐
                 └──────────────────────┘                      └──────────────────────┘

        Address: ┌──────────────────────┐
                 └──────────────────────┘


PROPERTY INFORMATION

  Property Name: ┌──────────────────────┐      Property Types: ┌──────────────────────┐
                 └──────────────────────┘                       └──────────────────────┘

        Address: ┌──────────────────────┐         Intended Use: ┌──────────────────────┐
                 └──────────────────────┘                        │ ▼ Select...          │
                                                                 └──────────────────────┘
                                                                   • Financing Purposes
                                                                   • Internal Business Decisions
                                                                   • Underwriting Decisions
                                                                   • Litigation Purposes
                                                                   • Other

Valuation Premises: ┌─────────────────────────────┐    Asset Condition: ┌─────────────────────────────┐
                    │ ▼ Select...                 │                      │ ▼ Select...                 │
                    └─────────────────────────────┘                      └─────────────────────────────┘
                      • Market Value As Is                                 • New Development
                      • Market Value As Is & As Stabilized                 • Existing Property
                      • Market Value As Complete & As Stabilized
                      • Market Value Land As Is & As Complete & As Stabilized
                      • Market Value Land As Is
                      • Market Value Land As Is & As Rezoned


PROPERTY CONTACT

     First Name: ┌──────────────────────┐         Email: ┌──────────────────────┐
                 └──────────────────────┘                └──────────────────────┘

      Last Name: ┌──────────────────────┐         Phone: ┌──────────────────────┐
                 └──────────────────────┘                └──────────────────────┘


CLIENT COMMENTS
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


UPLOADED DOCUMENTS
┌──────────────────────────────────────────────────────────────┐
│  📎 Upload Files                                            │
│                                                              │
│  No files uploaded yet                                      │
└──────────────────────────────────────────────────────────────┘


                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓


═══════════════════════════════════════════════════════════════════════
            APR DASHBOARD - SECTION 2: LOE & Quote Details
                     (Appraiser Prep for Valcre Sync)
═══════════════════════════════════════════════════════════════════════

JOB ASSIGNMENT

      Job Number: ┌──────────────────────┐      Valcre Job ID: ┌──────────────────────┐
                  └──────────────────────┘                     └──────────────────────┘


FINANCIAL TERMS

   Appraisal Fee: ┌──────────────────────┐     Retainer Amount: ┌──────────────────────┐
                  └──────────────────────┘                       └──────────────────────┘

   Payment Terms: ┌──────────────────────────────────┐    Report Delivery: ┌──────────────────────┐
                  │ ▼ Select...                      │                      └──────────────────────┘
                  └──────────────────────────────────┘
                    • On LOE Signature
                    • 50% Upfront, 50% on Delivery
                    • Net 30
                    • Custom


APPRAISER NOTES

Internal Comments
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


                 [ 📝 Generate & Send LOE → ]


                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓


═══════════════════════════════════════════════════════════════════════
                              VALCRE APP
                    (Auto-syncs when Job Number assigned)
═══════════════════════════════════════════════════════════════════════

JOB INFORMATION

Job.PropertyName                     Job.AddressStreet
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Job.PropertyType                     Job.Condition
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Job.ValuationType
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Job.Purposes
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘


CONTACT INFORMATION

Contact.FirstName                    Contact.LastName
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Contact.Title                        Contact.Company
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Contact.Phone                        Contact.Email
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Contact.Address
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘


LOE/QUOTE DETAILS

Job.Fee                              Job.Retainer
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Job.PaymentTerms                     Job.DeliveryDate
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Job.InternalNotes
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


BUILDING INFORMATION

Building.YearBuilt                   Building.GrossBuildingArea
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Building.NumberOfUnits               Building.ParkingSpaces
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘

Property.LegalDescription
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓
                              ↓  ↓  ↓  ↓  ↓


═══════════════════════════════════════════════════════════════════════
                    LOE (LETTER OF ENGAGEMENT) - DOCUSEAL
═══════════════════════════════════════════════════════════════════════

DOCUMENT HEADER

Date                                 Job Number
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
└─────────────────────────────────┘  └─────────────────────────────────┘


CLIENT INFORMATION (In Document Header)

Client Company Name
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Client Name
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Client Address
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘


PROPERTY DETAILS TABLE

Property Identification
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Property Type
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Authorized Client
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Authorized Users
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Authorized Use
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Effective Date of Value
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Value to be Appraised
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Property Rights Appraised
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Report Type
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Fee
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘

Scope of Work
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Delivery Date
┌─────────────────────────────────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘


E-SIGNATURE SECTION (DocuSeal Interactive Fields)

Client Signature
┌─────────────────────────────────────────────────────────────────────┐
│ <signature-field role="First Party">                               │
└─────────────────────────────────────────────────────────────────────┘

Date Signed
┌─────────────────────────────────────────────────────────────────────┐
│ <date-field role="First Party">                                    │
└─────────────────────────────────────────────────────────────────────┘


                         [ ✅ Complete Signature → ]

```

---

## Universal Field ID Tracking System

**Letter IDs track each field through the complete pipeline:**

| ID | Field Name | Client Form | Dashboard | Valcre | LOE eSignature |
|----|------------|-------------|-----------|--------|----------------|
| A | First Name | ✓ | ✓ | Merged to "Client Name" | Merged to "Client Name" |
| B | Last Name | ✓ | ✓ | Merged to "Client Name" | Merged to "Client Name" |
| C | Client Title | ✓ | ✓ | — | — |
| D | Client Organization | ✓ | ✓ | ✓ | ✓ |
| E | Client Address | ✓ | ✓ | — | ✓ |
| F | Client Phone | ✓ | ✓ | ✓ | ✓ |
| G | Client Email | ✓ | ✓ | ✓ | ✓ |
| H | Property Name | ✓ | ✓ | ✓ | ✓ |
| I | Property Address | ✓ | ✓ | ✓ | ✓ |
| J | Property Type | ✓ | ✓ | ✓ | ✓ |
| K | Intended Use | ✓ | ✓ | ✓ | ✓ |
| L | Valuation Premises | ✓ | ✓ | ✓ | ✓ |
| M | Asset Condition | ✓ | ✓ | ✓ | ✓ |
| N | Additional Info/Notes | ✓ | ✓ (Comments) | ✓ (Notes) | — |
| — | Property Contact | — | ✓ | — | — |
| — | Valcre Job Number | — | — | ✓ (generated) | ✓ |
| — | Appraisal Fee | — | ✓ (entered) | — | ✓ |
| — | Report Type | — | ✓ (entered) | — | ✓ |
| — | Delivery Date | — | ✓ (entered) | — | ✓ |
| — | Scope of Work | — | ✓ (entered) | — | ✓ |

**Key Insights:**
- **A + B merge** into "Client Name" in Valcre and LOE
- **C (Title)** drops after Dashboard (not needed in Valcre/LOE)
- **E (Address)** skipped in Valcre but appears in LOE
- **H-M** flow through all 4 systems (core property data)
- **N (Comments/Notes)** transforms across systems but carries same info
- **Job details** (fee, report type, delivery, scope) added in Dashboard, flow to LOE

---

## Field → Database Mapping

### Client Information Section

| Form Field | Database Column | Type | Required |
|------------|-----------------|------|----------|
| First Name | `client_first_name` | VARCHAR | ✓ |
| Last Name | `client_last_name` | VARCHAR | ✓ |
| Client Title | `client_title` | VARCHAR | |
| Client Organization | `client_organization` | VARCHAR | |
| Client Organization Address | `client_address` | VARCHAR | |
| Phone | `client_phone` | VARCHAR | ✓ |
| Email | `client_email` | VARCHAR | ✓ |

### Property & Job Information Section

| Form Field | Database Column | Type | Required |
|------------|-----------------|------|----------|
| Property Name | `property_name` | VARCHAR | ✓ |
| Property Address | `property_address` | VARCHAR | |
| Property Type | `property_type` | VARCHAR | ✓ |
| Intended Use | `intended_use` | VARCHAR | |
| Valuation Premises | `valuation_premises` | VARCHAR | |
| Asset Current Condition | `asset_condition` | VARCHAR | |
| Additional Information | `additional_info` | TEXT | |

### Document Upload

**Files stored separately** (not in `job_submissions` table)
- Multiple file upload
- Accepted formats: `.pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .png`
- Max 10MB per file

---

## Dropdown Values (Database Storage Format)

### Property Type
```
Database Value        Display Label
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
multifamily       →   Multifamily
self-storage      →   Self Storage
retail            →   Retail
industrial        →   Industrial
land              →   Land
office            →   Office
hotel             →   Hotel
senior            →   Senior
other             →   Other
```

### Intended Use
```
Database Value        Display Label
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
financing         →   Financing Purposes
internal          →   Internal Business Decisions
underwriting      →   Underwriting Decisions
litigation        →   Litigation Purposes
other             →   Other
```

### Valuation Premises
```
Database Value                              Display Label
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
market-value-as-is                      →   Market Value As Is
market-value-as-is-stabilized           →   Market Value As Is & As Stabilized
market-value-complete-stabilized        →   Market Value As Complete & As Stabilized
market-value-land-complete-stabilized   →   Market Value Land As Is & As Complete & As Stabilized
market-value-land-as-is                 →   Market Value Land As Is
market-value-land-rezoned               →   Market Value Land As Is & As Rezoned
```

### Asset Current Condition
```
Database Value        Display Label
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
new-development   →   New Development
existing-property →   Existing Property
```

---

## Quick Reference: Required Fields Only

**Must be filled to submit:**
1. ✓ First Name
2. ✓ Last Name
3. ✓ Phone
4. ✓ Email
5. ✓ Property Name
6. ✓ Property Type

**All other fields are optional.**

---

## Database Schema

```sql
CREATE TABLE job_submissions (
  id UUID PRIMARY KEY,

  -- Client Information
  client_first_name VARCHAR,
  client_last_name VARCHAR,
  client_title VARCHAR,
  client_organization VARCHAR,
  client_address VARCHAR,
  client_phone VARCHAR,
  client_email VARCHAR,

  -- Property & Job Information
  property_name VARCHAR,
  property_address VARCHAR,
  property_type VARCHAR,
  intended_use VARCHAR,
  valuation_premises VARCHAR,
  asset_condition VARCHAR,
  additional_info TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Form Code Reference

**Location:** `/Users/bencrowe/Development/Valta-Website/app/request-appraisal/intake/page.tsx`

**Key Sections:**
- Lines 41-59: FormData structure definition
- Lines 168-269: Client Information fields
- Lines 281-409: Property & Job Information fields
- Lines 412-497: Document Upload section

**Dropdown Definitions:**
- Lines 321-331: Property Type options
- Lines 346-352: Intended Use options
- Lines 366-379: Valuation Premises options
- Lines 392-395: Asset Condition options

---

**This mapping represents the production form as of November 5, 2025.**
**All field names, database columns, and dropdown values are from live code.**
