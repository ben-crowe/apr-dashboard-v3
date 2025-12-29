# Field Naming Convention: Clean Canonical IDs

**Exported:** 2025-12-24 05:45 MST

## Principle

**ONE field ID per concept. No prefixes. The `section` property determines which tab.**

Instead of:
- `intake-client-first-name` (S1)
- `client-name` (Cover)
- `loe-valuation-date` (S2)  
- `valuation-date` (Cover)

We have:
- `client-first-name` (section: client-intake)
- `valuation-date` (section: loe-prep)

---

## S1 - CLIENT INTAKE: Canonical Fields

### Client Info (subsection: client-info)
| Field ID | Label | Type |
|----------|-------|------|
| client-first-name | Client First Name | text |
| client-last-name | Client Last Name | text |
| client-email | Client Email | text |
| client-phone | Client Phone | text |
| client-title | Client Title | text |
| client-organization | Client Organization | text |
| client-address | Client Address | text |
| client-city | Client City | text |
| client-province | Client Province | text |
| client-postal | Client Postal Code | text |

### Property Info (subsection: property-info)
| Field ID | Label | Type |
|----------|-------|------|
| property-name | Property Name | text |
| property-address | Property Address | text |
| property-city | Property City | text |
| property-province | Property Province | text |
| property-postal | Property Postal Code | text |
| property-type | Property Type | text |
| property-subtype | Property Subtype | text |

### Intended Use (subsection: engagement-info)
| Field ID | Label | Type |
|----------|-------|------|
| intended-use | Intended Use | text |
| valuation-premises | Valuation Premises | text |
| asset-condition | Asset Condition | text |
| property-rights | Property Rights Appraised | text |

### Property Contact (subsection: property-contact)
| Field ID | Label | Type |
|----------|-------|------|
| contact-first-name | Contact First Name | text |
| contact-last-name | Contact Last Name | text |
| contact-email | Contact Email | text |
| contact-phone | Contact Phone | text |

### Notes (subsection: notes)
| Field ID | Label | Type |
|----------|-------|------|
| intake-notes | Intake Notes | textarea |

---

## S2 - LOE PREP: Canonical Fields

### Job Assignment (subsection: job-assignment)
| Field ID | Label | Type |
|----------|-------|------|
| job-number | Job Number (VAL#) | text |
| valuation-date | Date of Valuation | date |
| report-date | Date of Report | date |
| delivery-date | Delivery Date | date |

### Financial Terms (subsection: financial-terms)
| Field ID | Label | Type |
|----------|-------|------|
| appraisal-fee | Appraisal Fee | currency |
| retainer-amount | Retainer Amount | currency |
| payment-terms | Payment Terms | text |

### Report Details (subsection: report-details)
| Field ID | Label | Type |
|----------|-------|------|
| report-type | Report Type | text |
| report-purpose | Report Purpose | text |
| scope-of-work | Scope of Work | textarea |
| special-instructions | Special Instructions | textarea |

### Lead Appraiser (subsection: appraiser-info)
| Field ID | Label | Type |
|----------|-------|------|
| appraiser-name | Appraiser Name | text |
| appraiser-credentials | Appraiser Credentials | text |
| appraiser-title | Appraiser Title | text |
| appraiser-email | Appraiser Email | text |
| appraiser-phone | Appraiser Phone | text |
| appraiser-aic | AIC Number | text |

### Secondary Appraiser (subsection: appraiser2-info)
| Field ID | Label | Type |
|----------|-------|------|
| appraiser2-name | Appraiser 2 Name | text |
| appraiser2-credentials | Appraiser 2 Credentials | text |
| appraiser2-title | Appraiser 2 Title | text |
| appraiser2-email | Appraiser 2 Email | text |

### Internal (subsection: internal)
| Field ID | Label | Type |
|----------|-------|------|
| internal-comments | Internal Comments | textarea |
| appraiser-comments | Appraiser Comments | textarea |

---

## Company Info (Static - Could be Settings)

| Field ID | Label | Notes |
|----------|-------|-------|
| company-name | Company Name | Valta Property Valuations Ltd. |
| company-address | Company Address | 300, 4838 Richard Road SW |
| company-city-state-zip | Company City/State/Zip | Calgary, AB T3E 6L1 |
| company-phone | Company Phone | 587-801-5151 |
| company-website | Company Website | valta.ca |
| company-logo | Company Logo | Image |

These rarely change - could be app settings rather than per-job fields.

---

## Computed Fields (Derived, Read-Only)

| Field ID | Computed From | inputSource |
|----------|---------------|-------------|
| client-full-name | `${client-first-name} ${client-last-name}` | calculated |
| client-city-state-zip | `${client-city}, ${client-province} ${client-postal}` | calculated |
| contact-full-name | `${contact-first-name} ${contact-last-name}` | calculated |
| property-full-address | `${property-address}, ${property-city}, ${property-province}` | calculated |
| appraiser-name-credentials | `${appraiser-name}, ${appraiser-credentials}` | calculated |

---

## Field ID Mapping: OLD → NEW

### From intake-* (delete old, use new)
| OLD | NEW |
|-----|-----|
| intake-client-first-name | client-first-name |
| intake-client-last-name | client-last-name |
| intake-client-email | client-email |
| intake-client-phone | client-phone |
| intake-client-title | client-title |
| intake-client-organization | client-organization |
| intake-client-address | client-address |
| intake-property-name | property-name |
| intake-property-address | property-address |
| intake-property-type | property-type |
| intake-intended-use | intended-use |
| intake-valuation-premises | valuation-premises |
| intake-asset-condition | asset-condition |
| intake-contact-first-name | contact-first-name |
| intake-contact-last-name | contact-last-name |
| intake-contact-email | contact-email |
| intake-contact-phone | contact-phone |
| intake-notes | intake-notes (keep) |

### From loe-* (delete old, use new)
| OLD | NEW |
|-----|-----|
| loe-valcre-job-id | job-number |
| loe-appraisal-fee | appraisal-fee |
| loe-retainer-amount | retainer-amount |
| loe-payment-terms | payment-terms |
| loe-delivery-date | delivery-date |
| loe-report-type | report-type |
| loe-property-rights | property-rights |
| loe-scope-of-work | scope-of-work |
| loe-special-instructions | special-instructions |
| loe-internal-comments | internal-comments |
| loe-appraiser-comments | appraiser-comments |

### From other tabs (delete duplicates)
| OLD (delete) | CANONICAL (keep) | Section |
|--------------|------------------|---------|
| client-name | client-full-name (computed) | - |
| client-company | client-organization | client-intake |
| valuation-date | valuation-date | loe-prep |
| appraiser-name | appraiser-name | loe-prep |
| appraiser1-name | appraiser-name | loe-prep |
| subject-city | property-city | client-intake |
| subject-province | property-province | client-intake |

---

## Template Placeholder Mapping

The HTML template uses `{{field-id}}`. After consolidation:

| Template Placeholder | Maps To |
|---------------------|---------|
| `{{client-name}}` | `client-full-name` (computed) |
| `{{client-first-name}}` | `client-first-name` |
| `{{property-name}}` | `property-name` |
| `{{valuation-date}}` | `valuation-date` |
| `{{appraiser-name}}` | `appraiser-name` |

---

## Your Other App Integration

Your intake app sends data to these field IDs:

```json
{
  "client-first-name": "Kenneth",
  "client-last-name": "Engler",
  "client-email": "kengler@example.com",
  "property-name": "North Battleford Apartments",
  "property-address": "1101, 1121 109 St",
  "property-city": "North Battleford",
  "property-province": "Saskatchewan",
  "intended-use": "Mortgage Financing"
}
```

Clean, simple, no prefixes needed.

---

## Result

**Before:** 
- intake-client-first-name, client-name, client-contact-name (3 IDs, same concept)

**After:**
- client-first-name (1 ID, one source of truth)

---

*Clean field IDs = easier integration, no translation layer, template placeholders match directly.*
