# Verify — intake submission (Sarah Harris / Northgate Center)

**By:** qa-agent · 2026-06-03 · read-only Supabase check
**Record:** `7001c13e-2a62-418e-a188-495e405d5f28` · created 2026-06-03 19:40:46 UTC · count now 24
**Status:** ✅ **PASS** — 20/20 form fields landed in the correct `job_submissions` columns. Zero mismatches.

> Timing note: my first check read 23/absent because it ran in the gap between auto-fill (form timestamp 1:38:21 PM) and Submit (~19:40 UTC). Reading was true at that instant, just early. Re-verified against the persisted record below.

## Field-by-field (intake reference → job_submissions column → DB value)

| Form field | DB column | DB value | Match |
|---|---|---|---|
| First Name | client_first_name | Sarah | ✓ |
| Last Name | client_last_name | Harris | ✓ |
| Client Title | client_title | CEO | ✓ |
| Client Company Name | client_organization | Quantum Holdings | ✓ |
| Client Phone | client_phone | (587) 430-5760 | ✓ |
| Client Email | client_email | sarah.harris.501566@test.com | ✓ |
| Client Organization Address | client_address | Suite 270, 497 Main Place, Calgary, AB T6Y 2M3 | ✓ |
| Property Name | property_name | Northgate Center | ✓ |
| Property Address | property_address | 5713 Mountain Circle | ✓ |
| Property Type | property_type | Retail | ✓ |
| **Authorized Use** | **intended_use** | Litigation | ✓ (mapping confirmed) |
| **Valuation Premises** | **valuation_premises** | Market Rent | ✓ (column exists + populated) |
| Asset Current Condition | asset_condition | Poor | ✓ |
| Additional Information | notes | Test submission generated at 1:38:21 PM | ✓ |
| Contact — First Name/Dept | property_contact_first_name | Joseph | ✓ |
| Contact — Last Name | property_contact_last_name | Miller | ✓ |
| Contact — Email | property_contact_email | joseph.miller.501566@test.com | ✓ |
| Contact — Phone | property_contact_phone | (403) 493-8470 | ✓ |
| (contact provided ≠ client) | same_as_client_contact | false | ✓ |
| status | status | submitted | ✓ |

## Notes
- **No field landed in the wrong place** — Ben's "that field was supposed to go over here" check passes clean.
- `valuation_premises` **saved correctly to job_submissions** ('Market Rent'). Reminder: the known Stage-2 bug is on the READ side — the "Create Valcre" button checks `job_loe_details`, not this column. Intake-side persistence is fine; the disabled-button defect is downstream, not here.
- `job_number` = null (expected — VAL number is assigned at the Create-Valcre step, not at intake).
- `property_types` (plural) = null — unused parallel column; singular `property_type` carries the value. Not a defect, just a dead column to note.

## Verdict
Stage-1 link (intake form → DB persistence + field mapping) is **GREEN**. All 4 of CoArch's watch-fields (Authorized Use→intended_use, Valuation Premises, Asset Condition, Optional Property Contact) confirmed correct.
