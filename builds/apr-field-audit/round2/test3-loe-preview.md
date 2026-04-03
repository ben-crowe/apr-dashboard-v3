# Test 3: DocuSeal LOE Preview Verification

## LOE Preview Modal

**Job tested:** VAL261101 - Westside Mall, 2129 Broadway Court (Edward Johnson, Evergreen Holdings)

The preview opens in an iframe with the full LOE document rendered as HTML. The modal includes:
- Template selector ("Default Template")
- Zoom control (75%)
- "Edit Template" button
- Recipient display: "E-signature will be sent to: bc@crowestudio.com (Testing: bc@crowestudio.com, Client: edward.johnson.988928@test.com)"
- "Change Recipient" button
- "Download" button
- **"Send to Client"** button (LIVE — would send real email)

## Field-by-Field LOE Preview Verification

| # | LOE Field | Expected Value (from dashboard) | Preview Shows | Status |
|---|-----------|-------------------------------|---------------|--------|
| 1 | Date Created | March 28, 2026 | "March 28, 2026" | PASS |
| 2 | Client Company | Evergreen Holdings | "Evergreen Holdings" | PASS |
| 3 | Client Name | Edward Johnson | "Evergreen Holdings \| Edward Johnson, CEO" | PASS |
| 4 | Client Title | CEO | "CEO" (in header) | PASS |
| 5 | Client Address | Suite 264, 1776 Maple Way... | "Suite 264, 1776 Maple Way, Calgary, AB T2X 6Y5" | PASS |
| 6 | Property Identification | VAL261101, 2129 Broadway Court | "VAL261101, 2129 Broadway Court" | PASS |
| 7 | **Property Type** | Retail (from dashboard) | **"Disposition"** | **WRONG** |
| 8 | Authorized Client | Evergreen Holdings | "Evergreen Holdings" | PASS |
| 9 | Authorized Use | Disposition (intendedUse) | "for Disposition only" | PASS |
| 10 | Value to be Appraised | Market Value (valuationPremises) | "Market Value As Is And Stabilized" | PASS (enhanced) |
| 11 | Property Rights | Leased Fee Interest | "Leased Fee Interest" | PASS |
| 12 | Report Type | Appraisal Report | "Appraisal Report" | PASS |
| 13 | Fee | $3,500.00 | "$3,500 plus applicable taxes" | PASS (enhanced) |
| 14 | Scope of Work | All Applicable | "All Applicable" | PASS |
| 15 | Delivery Date | 2026-02-10 | "2026-02-10 from receipt of signed LOE and payment" | PASS (enhanced) |
| 16 | Signature Block | — | "SIGNATURE" / "DATE SIGNED" / "SIGNED BY: Edward Johnson, CEO, Evergreen Holdings" | PASS |
| 17 | Property List | — | "[To be entered for multiple properties]" | PASS (placeholder) |

## Critical Finding: The "7 Empty Fields" from Round 1

**Round 1 code analysis predicted 7 SELECT fields sent empty to DocuSeal.** Let's check the preview reality:

| Field | Round 1 Prediction | Preview Reality | Verdict |
|-------|-------------------|-----------------|---------|
| property_type | EMPTY | Shows "Disposition" (WRONG value — should be "Retail") | **NOT EMPTY but WRONG** |
| intended_use | EMPTY | Shows "Disposition" in "Authorized Use" section | **POPULATED** |
| requested_value | EMPTY | Shows "Market Value As Is And Stabilized" | **POPULATED** |
| property_rights | EMPTY | Shows "Leased Fee Interest" | **POPULATED** |
| report_type | EMPTY | Shows "Appraisal Report" | **POPULATED** |
| payment_terms | Not shown in preview table | Not visible in LOE body | **NOT IN PREVIEW** |
| report_delivery | Not shown in preview table | Not visible in LOE body | **NOT IN PREVIEW** |

**KEY FINDING:** The V3 LOE template (generateLOE.ts) DOES populate these fields — the "7 empty fields" issue from Round 1 applies ONLY to the old DocuSeal API path (docuseal.ts mapJobToDocuSealFields). The current LOE uses the V3 HTML template path which fills all fields correctly via bracket substitution.

However, the DocuSeal SIGNING experience may still have the empty SELECT issue if DocuSeal's interactive fields overlay the HTML content.

## Issue: Property Type Shows "Disposition" Instead of "Retail"

The LOE preview shows "Disposition" in the Property Type field, but the dashboard shows "Retail" as the property type. The "Disposition" value is actually the Intended Use. This is a **mapping bug** — the V3 template's `[purposes]` placeholder is being populated with `job.intendedUse` ("Disposition") instead of the property type.

Looking at `generateLOE.ts` line 79:
```javascript
'[purposes]': job.intendedUse || 'Not Specified',
```

This maps intendedUse to `[purposes]`, and the template renders `[purposes]` in the "Property Type" row. The field label says "Property Type" but the template placeholder is `[purposes]` which gets the intended use value.

## "Send to Client" Button

- **Status:** ENABLED (visible, clickable)
- **DID NOT CLICK** — would send real email to bc@crowestudio.com (testing mode) / edward.johnson.988928@test.com (client)
- The recipient shows test mode is active (emails go to bc@crowestudio.com first)

## Screenshots

- `/tmp/apr-field-audit/round2/test3-val-job-top.png` — Job header with VAL number
- `/tmp/apr-field-audit/round2/test3-val-job-loe.png` — LOE section with enabled buttons
- `/tmp/apr-field-audit/round2/test3-loe-fields.png` — LOE field values
- `/tmp/apr-field-audit/round2/test3-loe-preview-large.png` — LOE preview modal
