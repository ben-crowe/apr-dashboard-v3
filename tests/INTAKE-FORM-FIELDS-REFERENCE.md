# Intake Form — Field Reference + Sample Submission

**Captured:** 2026-06-03 from the live hosted intake form (auto-fill "Test Data" button), pasted by Ben.
**Purpose:** the canonical field map of the client intake form — what fields exist, their grouping, and the expected values for the sample submission. Use as the VERIFICATION CHECKLIST: every field below must land in the matching `job_submissions` column + dashboard display (and later the ClickUp card section).

This sample = the submission generated at **1:38:21 PM** (the record we're confirming this run).

> ⚠️ **NOT the field registry / source of truth.** This is a SAMPLE to spot where a field landed wrong — not the authority on correct mapping. If a field looks off, verify against the **registry system** (`fieldRegistry.ts` + the Field Crosswalk), NOT this paste. Don't treat this as gospel.

## Client Information
| Form field | Value |
|---|---|
| First Name * | Sarah |
| Last Name * | Harris |
| Client Title | CEO |
| Client Company Name | Quantum Holdings |
| Client Phone * | (587) 430-5760 |
| Client Email * | sarah.harris.501566@test.com |
| Client Organization Address | Suite 270, 497 Main Place, Calgary, AB T6Y 2M3 |

## Property & Job Information
| Form field | Value |
|---|---|
| Property Name * | Northgate Center |
| Property Address | 5713 Mountain Circle |

### Optional Property Contact (blank if same as client)
| Form field | Value |
|---|---|
| First Name/Department | Joseph |
| Last Name | Miller |
| Email | joseph.miller.501566@test.com |
| Phone | (403) 493-8470 |

### Classification
| Form field | Value |
|---|---|
| Property Type * | Retail |
| Authorized Use | Litigation |
| Valuation Premises | Market Rent |
| Asset Current Condition | Poor |
| Additional Information | Test submission generated at 1:38:21 PM |

## Required Documents (upload)
- Full Property Details or Prior Appraisal
- Proforma
- Unit Mix (MF/SS) or Rent Roll (Retail/Office/Industrial)
- Operating Expenses (1-3 Years Historical and Budget)
- Drawings/Plans (New Developments only)
- Contact for property tour (Existing Buildings only)
- Sample uploaded: `test-property-document.pdf`

## Notes for verification
- Confirm EACH field above maps to the correct `job_submissions` column (watch for any that land in the wrong place — Ben's "that field was supposed to go over here" check).
- "Authorized Use" (form) likely maps to the `intended_use` column — confirm.
- "Valuation Premises" + "Asset Current Condition" + "Optional Property Contact" — confirm columns exist and populate (these are the richer fields beyond the basic set).
