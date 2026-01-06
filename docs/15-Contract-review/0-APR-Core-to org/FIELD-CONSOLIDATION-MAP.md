# Field Consolidation Map: S1 & S2 as Source of Truth

**Exported:** 2025-12-24 05:45 MST

## Principle

**S1 (Client Intake)** = ALL client/contact/property identifying info  
**S2 (LOE Prep)** = ALL job setup, appraiser, dates, scope info  
**Numbered Tabs** = Show "Managed in S1/S2" links (like images show "Managed in S3")

---

## S1 - CLIENT INTAKE: Consolidation

### Currently in S1 (intake-* fields) - KEEP
| Field ID | Label |
|----------|-------|
| intake-client-first-name | Client First Name |
| intake-client-last-name | Client Last Name |
| intake-client-email | Client Email |
| intake-client-phone | Client Phone |
| intake-client-title | Client Title |
| intake-client-organization | Organization |
| intake-client-address | Client Address |
| intake-property-name | Property Name |
| intake-property-address | Property Address |
| intake-property-type | Property Type |
| intake-intended-use | Intended Use |
| intake-valuation-premises | Valuation Premises |
| intake-asset-condition | Asset Condition |
| intake-contact-first-name | Contact First Name |
| intake-contact-last-name | Contact Last Name |
| intake-contact-email | Contact Email |
| intake-contact-phone | Contact Phone |
| intake-notes | Notes |

### MOVE TO S1 (from other tabs)
| Current Field ID | Current Section | Action |
|------------------|-----------------|--------|
| client-name | cover | → Computed from intake-client-first/last-name |
| client-contact-name | cover | → Computed from intake-contact-first/last-name |
| client-company | cover | → Map to intake-client-organization |
| client-address | cover | → Map to intake-client-address |
| client-city | cover | → ADD to S1 as intake-client-city |
| client-province | cover | → ADD to S1 as intake-client-province |
| client-postal | cover | → ADD to S1 as intake-client-postal |
| client-title | cover | → Already exists as intake-client-title |
| client-city-state-zip | cover | → Computed from city/province/postal |

### COMPUTED FIELDS (derived, not entered)
| Field ID | Computed From |
|----------|---------------|
| client-name | `${intake-client-first-name} ${intake-client-last-name}` |
| client-contact-name | `${intake-contact-first-name} ${intake-contact-last-name}` |
| client-city-state-zip | `${intake-client-city}, ${intake-client-province} ${intake-client-postal}` |

---

## S2 - LOE PREP: Consolidation

### Currently in S2 (loe-* fields) - KEEP
| Field ID | Label |
|----------|-------|
| loe-valcre-job-id | Valcre Job ID (VAL#) |
| loe-appraisal-fee | Appraisal Fee |
| loe-retainer-amount | Retainer Amount |
| loe-payment-terms | Payment Terms |
| loe-delivery-date | Delivery Date |
| loe-report-type | Report Type |
| loe-property-rights | Property Rights Appraised |
| loe-scope-of-work | Scope of Work |
| loe-special-instructions | Special Instructions |
| loe-internal-comments | Internal Comments |
| loe-appraiser-comments | Appraiser Comments |

### MOVE TO S2 (from other tabs)
| Current Field ID | Current Section | Action |
|------------------|-----------------|--------|
| valuation-date | cover | → ADD to S2 as loe-valuation-date |
| report-date | exec | → ADD to S2 as loe-report-date |
| appraiser-name | cover | → ADD to S2 as loe-appraiser-name |
| appraiser-credentials | cover | → ADD to S2 as loe-appraiser-credentials |
| appraiser-title | cover | → ADD to S2 as loe-appraiser-title |
| appraiser-email | cover | → ADD to S2 as loe-appraiser-email |
| appraiser-aic-number | cover | → ADD to S2 as loe-appraiser-aic |
| appraiser1-name | cover | → Primary appraiser in S2 |
| appraiser1-email | cover | → Primary appraiser in S2 |
| appraiser1-title | cover | → Primary appraiser in S2 |
| appraiser2-name | cover | → Secondary appraiser in S2 |
| report-type | report-info | → Already exists as loe-report-type |
| report-purpose | report-info | → ADD to S2 as loe-report-purpose |
| report-scope | report-info | → Already exists as loe-scope-of-work |

### COMPANY INFO (static, maybe separate section)
| Field ID | Notes |
|----------|-------|
| company-name | Valta - rarely changes |
| company-address | Valta - rarely changes |
| company-phone | Valta - rarely changes |
| company-website | Valta - rarely changes |

These could stay in S1 or move to a "Company Settings" area since they're not per-job.

---

## Field Mapping: Old → New

### Client Fields
| OLD Field (numbered tabs) | NEW Field (S1) | Display In |
|---------------------------|----------------|------------|
| client-name | intake-client-first-name + last-name | Cover, Exec, Cert |
| client-company | intake-client-organization | Cover, LOE |
| client-address | intake-client-address | Cover |
| client-city | intake-client-city | Cover |
| client-province | intake-client-province | Cover |
| client-postal | intake-client-postal | Cover |

### Appraiser Fields  
| OLD Field (numbered tabs) | NEW Field (S2) | Display In |
|---------------------------|----------------|------------|
| appraiser-name | loe-appraiser-name | Cover, Cert |
| appraiser-credentials | loe-appraiser-credentials | Cover, Cert |
| valuation-date | loe-valuation-date | Cover, Exec |
| report-date | loe-report-date | Cover, Exec |

---

## Implementation Steps

### Phase 1: Add Missing Fields to S1/S2
Add to S1 (client-intake section):
- intake-client-city
- intake-client-province  
- intake-client-postal

Add to S2 (loe-prep section):
- loe-valuation-date
- loe-report-date
- loe-appraiser-name
- loe-appraiser-credentials
- loe-appraiser-title
- loe-appraiser-email
- loe-appraiser-aic
- loe-appraiser1-name (primary)
- loe-appraiser1-email
- loe-appraiser1-title
- loe-appraiser2-name (secondary)
- loe-report-purpose

### Phase 2: Update UI for Reference Links
In numbered tabs, fields like `client-name` become:
```
client-name    Client Name    "Managed in S1"    [Kenneth Engler]
                              Client Intake       (shows current value)
```

### Phase 3: Update Test Data
Add values for new loe-* and intake-* fields in northBattlefordTestData.ts

### Phase 4: Update Template Mapping
Ensure HTML template `{{client-name}}` pulls from the computed/mapped value.

---

## Result

After consolidation:

**S1 - Client Intake:** ~25 fields (all client/property info)
**S2 - LOE Prep:** ~20 fields (all job setup/appraiser info)
**S3 - Image Management:** ~158 fields (all images)

**Numbered Tabs:** Mostly "Managed in S1/S2/S3" links + section-specific fields only

---

*This is the same pattern as images: Upload/enter in ONE place, reference everywhere else.*
