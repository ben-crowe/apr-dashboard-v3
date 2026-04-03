# Test 4: Intake Form → Dashboard Round-Trip Verification

## Submitted Data

**Test Data auto-filled on intake form, then submitted.**

## Round-Trip Comparison Table

| # | Form Field | Value Submitted | Dashboard Shows | Match? |
|---|-----------|----------------|-----------------|--------|
| 1 | First Name * | Sarah | Sarah | PASS |
| 2 | Last Name * | Wilson | Wilson | PASS |
| 3 | Client Title | Director | Director | PASS |
| 4 | Client Company Name | Quantum Holdings | Quantum Holdings | PASS |
| 5 | Client Organization Address | 2399 Pine Place, Calgary, AB T2X 1Y6 | 2399 Pine Place, Calgary, AB T2X 1Y6 | PASS |
| 6 | Client Phone * | (587) 665-7269 | (587) 665-7269 | PASS |
| 7 | Client Email * | sarah.wilson.213072@test.com | sarah.wilson.213072@test.com | PASS |
| 8 | Property Name * | Southlands Plaza | Southlands Plaza | PASS |
| 9 | Property Address | 3494 Spring Parkway | 3494 Spring Parkway | PASS |
| 10 | Property Type * | Land (single select) | Land (multi-select chip) | PASS |
| 11 | Intended Use | Financing/Refinancing | Financing/Refinancing | PASS |
| 12 | Valuation Premises | Liquidation Value | Liquidation Value | PASS |
| 13 | Asset Current Condition | Good | Good | PASS |
| 14 | Additional Information | Test submission generated at 4:33:33 PM | Test submission generated at 4:33:33 PM | PASS |
| 15 | Property Contact First | David | David | PASS |
| 16 | Property Contact Last | Wright | Wright | PASS |
| 17 | Property Contact Email | david.wright.213073@test.com | david.wright.213073@test.com | PASS |
| 18 | Property Contact Phone | (403) 380-2644 | (403) 380-2644 | PASS |
| 19 | File Upload | test-property-document.pdf (auto) | test-property-document.pdf (1 KB, with Download/View/Delete) | PASS |

## Results

**18/18 content fields + 1 file upload = 19/19 PASS.** Every field submitted on the intake form appears correctly on the dashboard.

## Success Page Observations

The success page shows:
- "Thank You for Your Submission!"
- Job Reference UUID: 558ab43f-36c7-4e9b-bf5b-5779b2f3b9c4
- "Your appraisal request has been successfully submitted."
- **"You'll receive a confirmation email shortly"** — **THIS IS A LIE.** No email is sent on form submission (confirmed in Round 1 code analysis and no email-related console logs).

## Dashboard State After Submission

- Job appears at top of list with "Submitted" status
- Title: "Southlands Plaza, 3494 Spring Parkway"
- All client info, property info, property contact, notes, and file upload present
- LOE section: All dropdowns show "Select..." (empty) — expected since no LOE data has been entered yet
- Job Number: "Awaiting Valcre job" — expected

## Screenshots

- `/tmp/apr-field-audit/round2/test4-form-empty.png` — Empty form
- `/tmp/apr-field-audit/round2/test4-form-filled.png` — Filled form (full page)
- `/tmp/apr-field-audit/round2/test4-success.png` — Success page with job reference
- `/tmp/apr-field-audit/round2/test4-dashboard-new-job.png` — Job list with new job at top
- `/tmp/apr-field-audit/round2/test4-new-job-detail.png` — New job detail view
