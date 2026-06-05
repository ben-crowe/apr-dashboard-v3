# ClickUp Job-Hub — field spec (custom-fields model)

**By:** qa-agent · 2026-06-04
**Concept (Ben):** the ClickUp task is a lightweight **job hub** — identify the job + link out to the real systems (APR Dashboard, Valcre) + a light job summary + status tracker. NOT a re-creation of the full intake (the APR dashboard owns that). Data lives in **typed custom fields**, not a markdown description blob.

**Why custom fields beat the description card:** no duplication possible (setting a field replaces, never appends — kills the "VAL261101 VAL261101" / double-section bug), board views can filter/sort/group/color by field, and each value is its own typed slot (text / date / dollar / dropdown / url).

**Proven:** demo task `86e1qn375` (test list "APR Test - Valta Mirror" 901709622357) populated 16 fields cleanly via API → https://app.clickup.com/t/86e1qn375

---

## KEEP — the hub field set

| Field | Type | Source (dashboard) |
|---|---|---|
| Job Number | short_text | valcre job number |
| APR Dashboard Link | url | dashboard job URL |
| Valcre Job Link | url | valcre job URL |
| Client First Name | short_text | client_first_name |
| Client Last Name | short_text | client_last_name |
| Client Organization | short_text | client_organization |
| Client Email | email | client_email *(optional — quick contact)* |
| Property Name | short_text | property_name |
| Property Address | short_text | property_address |
| Property Type | drop_down | property_type |
| Report Type | drop_down | report_type |
| Intended Use | drop_down | authorized_use → IntendedUses |
| Property Rights | drop_down | property_rights_appraised |
| Scope of Work | short_text | scope_of_work |
| Payment Terms | drop_down | payment_terms |
| Appraisal Fee | currency/dollar | appraisal_fee ***(field not on mirror list yet — ADD)*** |
| Delivery Date | date | delivery_date |
| Received Date | date | job.created_at ***(ADD)*** |
| LOE Sent | date | DocuSeal sent / dashboard ***(ADD)*** |
| LOE Signed | date | DocuSeal signed / dashboard signed_date ***(ADD)*** |

Group/order on the board in 3 clusters (acts as "dividers"): **Links** → **Job Summary** → **Status/Dates**.

## REMOVE from the hub (hide from view or omit from template)

Client Title · Client Phone · Client Address · **all Property Contact fields** (first/last/email/phone) · Job Status (ClickUp's native task status covers workflow) · Asset Condition · Valuation Premises · Additional Info/Notes.

## Dropdown option-sets to RECONCILE (dashboard ↔ ClickUp must match exactly, or the value silently won't map)

- **Report Type** — ClickUp opts = Comprehensive/Concise/Form/N/A; dashboard sends "Appraisal Report". Mismatch → align.
- **Transaction Status** (prod board) — ClickUp = Arms Length/Listing/…; dashboard = Listed/Not Applicable/Under Contract. Mismatch.
- Verify every dropdown's options 1:1 before wiring (Intended Use, Property Rights, Property Type, Payment Terms verified matching on the mirror).

---

## Implementation (what's API vs UI)

- **Populate fields = API** (edge function) — `create-clickup-task` / `update-clickup-task` should set `custom_fields: [{id, value}]` instead of (or alongside) the description. Setting a dropdown needs the option **id**; date = unix ms; phone = E.164; currency = dollars. (react-spec)
- **Delete/hide fields, build template = ClickUp UI** — the API returns 405 on field delete and has no save-as-template. So: build the **Job Hub template** in the ClickUp UI with exactly the KEEP set (add Appraisal Fee + the 3 date fields), hide the rest from the view, then **save as a template** and replicate it in the client's **Valta** area. (Ben / UI)

## Net
Keep a **tiny description** only for anything that reads better as text (or drop it entirely). Everything structured → custom fields. Build once as a UI template → integration populates it → replicate the template to the Valta client board.
