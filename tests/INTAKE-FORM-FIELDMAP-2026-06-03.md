# APR Intake Form — field map (Codex smoke-test answer key)

**By:** qa-agent · 2026-06-03 · source: `src/components/SubmissionForm.tsx` (active sections: ClientInformationSection, PropertyInformationSection, DocumentsSection)
**Purpose:** pre-brief Codex (5x faster per CoArch) + ground-truth checklist for the read-back smoke test. Codex reads what it sees → compare against this → PASS/FAIL.

## URL
- **Route:** `/` (Index → SubmissionForm)
- **Prod (cleanest, no local server):** `https://apr-dashboard-v3.vercel.app/`
- **Local:** `http://localhost:5173/` (needs dev server up)

## Smoke test = READ-BACK ONLY (no fill)
Codex opens the URL, reports every field it sees. PASS if all sections + fields below are present and visible. No typing, no submit.

## Expected fields (the answer key)

### Section 1 — Client Information
| Field | Type |
|---|---|
| Client First Name | text |
| Client Last Name | text |
| Client Email | email |
| Client Phone | phone |
| Client Title | text (e.g. CEO, Property Manager) |
| Client Organization Name | text |
| Client Organization Address | text |

### Section 2 — Property Information (includes Property Contact)
| Field | Type |
|---|---|
| Property Address | text |
| Property Name | text |
| Property Type | dropdown (incl. Manufactured Housing, Special Purpose, …) |
| Intended Use / Authorized Use | dropdown (First Mortgage Financing, Financial Reporting, Estate Planning, Underwriting Decisions, …) |
| **Valuation Premises** | dropdown — ⚠ see note |
| Asset Current Condition | dropdown |
| Property Contact — First Name/Department | text |
| Property Contact — Last Name | text |
| Property Contact — Email | email |
| Property Contact — Phone | phone |

### Section 3 — Documents
| Field | Type |
|---|---|
| Document upload(s) | file picker |

### Section 4 — Additional Notes / Information
| Field | Type |
|---|---|
| Additional Notes | textarea |

### Submit
- "Submit" button at bottom.

## ⚠ Note for the FILL phase (not the smoke test, but flag it now)
**Valuation Premises** is the field behind the known Stage-2 bug: the intake form saves it to `job_submissions`, but the "Create Valcre" button reads `job_loe_details` → button stays disabled. When the test progresses past read-back into fill+submit+create, EXPECT the Create-Valcre button to be disabled, and treat that as the known defect, not a Codex failure.

## Codex gotchas (from CoArch's codex.idx review — carry into the brief)
- Click by **spatial coordinates**, not element/a11y index (index clicks fail in webview — Apple-event error).
- approval_policy=never → no permission prompts; two-way tmux comms confirmed working.
