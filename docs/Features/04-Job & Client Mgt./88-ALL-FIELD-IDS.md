# All Custom Field IDs - Complete Reference

**Date:** January 13, 2026  
**List:** APR Test - Valta Mirror (901709622357)  
**Total Fields:** 29 custom fields

---

## Field IDs by Category

### Client Information (7 fields)

| Field Name | Field ID | Type |
|------------|----------|------|
| Client First Name | `[TO_BE_FETCHED]` | short_text |
| Client Last Name | `[TO_BE_FETCHED]` | short_text |
| Client Title | `[TO_BE_FETCHED]` | short_text |
| Client Organization | `[TO_BE_FETCHED]` | short_text |
| Client Address | `[TO_BE_FETCHED]` | short_text |
| Client Phone | `[TO_BE_FETCHED]` | phone |
| Client Email | `[TO_BE_FETCHED]` | email |

### Property Information (7 fields)

| Field Name | Field ID | Type |
|------------|----------|------|
| Property Name | `[TO_BE_FETCHED]` | short_text |
| Property Address | `[TO_BE_FETCHED]` | short_text |
| Property Type | `[TO_BE_FETCHED]` | drop_down |
| Intended Use | `[TO_BE_FETCHED]` | drop_down |
| Valuation Premises | `[TO_BE_FETCHED]` | drop_down |
| Asset Condition | `[TO_BE_FETCHED]` | drop_down |
| Additional Info | `[TO_BE_FETCHED]` | text |

### Property Contact (4 fields)

| Field Name | Field ID | Type |
|------------|----------|------|
| Property Contact First Name | `[TO_BE_FETCHED]` | short_text |
| Property Contact Last Name | `[TO_BE_FETCHED]` | short_text |
| Property Contact Email | `[TO_BE_FETCHED]` | email |
| Property Contact Phone | `[TO_BE_FETCHED]` | phone |

### LOE & Quote Details (7 fields)

| Field Name | Field ID | Type |
|------------|----------|------|
| Appraisal Fee | `[TO_BE_FETCHED]` | currency |
| Retainer Amount | `[TO_BE_FETCHED]` | currency |
| Payment Terms | `[TO_BE_FETCHED]` | drop_down |
| Delivery Date | `[TO_BE_FETCHED]` | date |
| Report Type | `[TO_BE_FETCHED]` | drop_down |
| Scope of Work | `[TO_BE_FETCHED]` | short_text |
| Property Rights Appraised | `[TO_BE_FETCHED]` | drop_down |

### Links (2 fields)

| Field Name | Field ID | Type |
|------------|----------|------|
| APR Dashboard Link | `[TO_BE_FETCHED]` | url |
| Valcre Job Link | `[TO_BE_FETCHED]` | url |

### Workflow (2 fields)

| Field Name | Field ID | Type |
|------------|----------|------|
| Job Number | `[TO_BE_FETCHED]` | short_text |
| Job Status | `[TO_BE_FETCHED]` | drop_down |

---

## Fetch All Field IDs

```bash
curl -X GET "https://api.clickup.com/api/v2/list/901709622357/field" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq '[.fields[] | select(.name | test("Client|Property|Job|Dashboard|Valcre|Appraisal|Retainer|Payment|Delivery|Report|Scope|Rights|Additional|Contact"; "i"))] | sort_by(.name) | .[] | {name, id, type}'
```

---

## Usage in Edge Function

When creating/updating ClickUp tasks, populate all fields:

```typescript
const customFields = [
  { id: "CLIENT_FIRST_NAME_ID", value: job.client_first_name },
  { id: "CLIENT_LAST_NAME_ID", value: job.client_last_name },
  { id: "CLIENT_TITLE_ID", value: job.client_title },
  { id: "CLIENT_ORG_ID", value: job.client_organization },
  { id: "CLIENT_ADDRESS_ID", value: job.client_address },
  { id: "CLIENT_PHONE_ID", value: job.client_phone },
  { id: "CLIENT_EMAIL_ID", value: job.client_email },
  { id: "PROPERTY_NAME_ID", value: job.property_name },
  { id: "PROPERTY_ADDRESS_ID", value: job.property_address },
  { id: "PROPERTY_TYPE_ID", value: job.property_type },
  { id: "INTENDED_USE_ID", value: job.intended_use },
  { id: "VALUATION_PREMISES_ID", value: job.valuation_premises },
  { id: "ASSET_CONDITION_ID", value: job.asset_condition },
  { id: "ADDITIONAL_INFO_ID", value: job.notes },
  { id: "PROP_CONTACT_FIRST_ID", value: job.property_contact_first_name },
  { id: "PROP_CONTACT_LAST_ID", value: job.property_contact_last_name },
  { id: "PROP_CONTACT_EMAIL_ID", value: job.property_contact_email },
  { id: "PROP_CONTACT_PHONE_ID", value: job.property_contact_phone },
  { id: "APPRAISAL_FEE_ID", value: loe.appraisal_fee },
  { id: "RETAINER_ID", value: loe.retainer_amount },
  { id: "PAYMENT_TERMS_ID", value: loe.payment_terms },
  { id: "DELIVERY_DATE_ID", value: loe.delivery_date },
  { id: "REPORT_TYPE_ID", value: loe.report_type },
  { id: "SCOPE_OF_WORK_ID", value: loe.scope_of_work },
  { id: "PROPERTY_RIGHTS_ID", value: loe.property_rights_appraised },
  { id: "DASHBOARD_LINK_ID", value: jobUrl },
  { id: "VALCRE_LINK_ID", value: valcreUrl },
  { id: "JOB_NUMBER_ID", value: job.job_number },
  { id: "JOB_STATUS_ID", value: jobStatus }
].filter(field => field.value != null && field.value !== '')
```

---

**Document Status:** ✅ Fields Created  
**Next Step:** Fetch and document all field IDs
