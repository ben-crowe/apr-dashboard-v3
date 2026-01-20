# Create All Custom Fields from Job Ticket

**Date:** January 13, 2026  
**Purpose:** Create all custom fields matching the APR Dashboard job ticket  
**List:** APR Test - Valta Mirror (901709622357)

---

## Field Categories

Based on the job ticket structure, we need fields for:

1. **Client Information** (7 fields)
2. **Property Information** (7 fields)
3. **Property Contact** (4 fields)
4. **LOE & Quote Details** (7 fields)
5. **Links** (2 fields)
6. **Workflow** (2 fields)

**Total: 29 custom fields**

---

## Complete Field List

### 1. Client Information (7 fields)

| Field Name | Type | Purpose |
|------------|------|---------|
| Client First Name | `short_text` | Client's first name |
| Client Last Name | `short_text` | Client's last name |
| Client Title | `short_text` | Job title (CEO, Manager, etc.) |
| Client Organization | `short_text` | Company/organization name |
| Client Address | `short_text` | Business address |
| Client Phone | `phone` | Contact phone number |
| Client Email | `email` | Contact email address |

### 2. Property Information (7 fields)

| Field Name | Type | Purpose |
|------------|------|---------|
| Property Name | `short_text` | Property identifier/name |
| Property Address | `short_text` | Full property address |
| Property Type | `drop_down` | Multifamily, Retail, etc. |
| Intended Use | `drop_down` | Financing, Purchase, etc. |
| Valuation Premises | `drop_down` | Market Value As Is, etc. |
| Asset Condition | `drop_down` | New Development, Existing Property |
| Additional Info | `text` | Notes/comments |

### 3. Property Contact (4 fields)

| Field Name | Type | Purpose |
|------------|------|---------|
| Property Contact First Name | `short_text` | Property contact first name |
| Property Contact Last Name | `short_text` | Property contact last name |
| Property Contact Email | `email` | Property contact email |
| Property Contact Phone | `phone` | Property contact phone |

### 4. LOE & Quote Details (7 fields)

| Field Name | Type | Purpose |
|------------|------|---------|
| Appraisal Fee | `currency` | Fee amount ($) |
| Retainer Amount | `currency` | Retainer amount ($) |
| Payment Terms | `drop_down` | Net 30, Net 60, etc. |
| Delivery Date | `date` | Report delivery deadline |
| Report Type | `drop_down` | Comprehensive, Concise, Form |
| Scope of Work | `drop_down` | Scope options |
| Property Rights Appraised | `drop_down` | Fee Simple, Leasehold, etc. |

### 5. Links (2 fields)

| Field Name | Type | Purpose |
|------------|------|---------|
| APR Dashboard Link | `url` | Link to job ticket in dashboard |
| Valcre Job Link | `url` | Link to job in Valcre system |

### 6. Workflow (2 fields)

| Field Name | Type | Purpose |
|------------|------|---------|
| Job Number | `short_text` | Unique job identifier (VAL251999) |
| Job Status | `drop_down` | Workflow sub-status (20 options) |

---

## Dropdown Options

### Property Type
- Multifamily
- Self Storage
- Retail
- Industrial
- Land
- Office
- Hotel
- Senior
- Other

### Intended Use
- Financing Purposes
- Internal Business Decisions
- Financial Reporting
- Underwriting Decisions
- Litigation Purposes
- Other
- GST

### Valuation Premises
- Market Value As Is
- Market Value As Is & As Stabilized
- Market Value As Complete & As Stabilized
- Market Value Land As Is & As Complete & As Stabilized
- Market Value Land As Is
- Market Value Land As Is & As Rezoned

### Asset Condition
- New Development
- Existing Property

### Payment Terms
- Net 30
- Net 60
- Upon Completion
- 50% Upfront
- On LOE Signature

### Report Type
- Comprehensive
- Concise
- Form
- N/A

### Scope of Work
(To be determined from job_loe_details table)

### Property Rights Appraised
- None
- ASC 805
- Condominium Ownership
- Cost Segregation Study
- Fee Simple Interest
- Going Concern
- Leased Fee Interest
- Leasehold Interest
- Market Study
- Other
- Partial Interest
- Partial Interest Taking
- Rent Restricted
- Total Taking

### Job Status (20 options)
- Send LOE
- Paid
- Plan Job
- Get Client Info
- Book Tour
- Call Client Clarify
- Search Comps
- Front End
- Review Comps
- Valuation
- Review Report
- Edits
- Review & Book Tour
- Send to Client
- Client Changes
- Not Paid
- Not Signed
- LOR Req Sent V/A
- Sent for Review
- Cancel

---

## API Commands to Create Fields

See script: `/tmp/create_all_fields.sh`

**Note:** Fields may already exist from previous creation attempts. The script will handle duplicates gracefully.

---

## Verification

After creating all fields, verify via API:

```bash
curl -X GET "https://api.clickup.com/api/v2/list/901709622357/field" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq '.fields | length'
```

Expected: 29+ custom fields (plus standard ClickUp fields)

---

**Document Status:** ✅ Field List Complete  
**Next Step:** Execute field creation script
