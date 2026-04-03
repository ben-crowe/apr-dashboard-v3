# Test 1: Workflow Gates — Button Activation Chain

## Workflow Dependency Chain

```
Form Submit → Supabase (no gates)
    ↓
Dashboard: "Create Valcre Job" → REQUIRES 5 fields
    ↓
"Preview & Send LOE" → REQUIRES Valcre job number + 4 fields
    ↓
Client receives email → Signs LOE
```

## Button State Analysis

### "Create Valcre Job" Button

**Current state on test job:** ENABLED (all required fields filled)

**Required fields (from `canCreateValcreJob`):**
1. `job.propertyAddress` — Property Address
2. `job.propertyType` — Property Type (comma-separated string, must have content)
3. `job.intendedUse` — Intended Use
4. `jobDetails.appraisalFee` — Appraisal Fee
5. `jobDetails.scopeOfWork` — Scope of Work
6. `jobDetails.valuationPremises` — Valuation Premises

**When disabled:** Shows tooltip with list: "Fill required fields first:" + missing fields list

**After creation:** Button transforms to either:
- "Check Valcre Dashboard" (if PENDING status)
- Disabled "VAL-XXXXXX" display (if real job number exists)

### "Preview & Send LOE" Button

**Current state on test job:** DISABLED (opacity 0.5, cursor: not-allowed)
**Reason:** No Valcre job number (`isValcreJobNumber(jobDetails?.jobNumber)` returns false — shows "Awaiting Valcre job")

**Gate 1:** Must have a valid Valcre job number (not null, not "Awaiting")
**Gate 2:** Must pass `validation.isValid` (from `validateRequiredFields` in docuseal.ts):
  - Client First Name
  - Client Last Name
  - Client Email
  - Property Address

**Gate 3:** Not currently sending or generating

**Tooltip when disabled (no Valcre job):** "Please create a Valcre job first to generate the LOE"
**Tooltip when disabled (missing fields):** Shows specific missing fields with amber alert icon

**After LOE is sent:** Button text changes to "Resend LOE" with amber styling

### "View in ClickUp" Button

**Current state:** ENABLED (always visible)
**Note:** Links to ClickUp task even before Valcre job exists. The task gets created automatically when Valcre job is booked.

### "Test Data" Buttons

Found 3 separate Test Data buttons:
1. `@e19` — In "Client Information & Property Details" section
2. `@e46` — In "LOE Quote & Valuation Details" section
3. `@e62` — In "Building Information" section
4. `@e69` — In "Data Gathering" section

## Answers to Specific Questions

| Question | Answer |
|----------|--------|
| Can you send to DocuSeal WITHOUT a Valcre job number? | **NO** — "Preview & Send LOE" is disabled until a valid Valcre job number exists. Even if validation passes, the button code checks `isValcreJobNumber()` first. |
| What fields for "Create Valcre Job"? | Property Address, Property Type, Intended Use, Appraisal Fee, Scope of Work, Valuation Premises (6 fields) |
| What fields for "Send for E-Signature"? | Valcre job number (from Valcre API) + Client First Name, Last Name, Email, Property Address (5 conditions) |
| Is there a Preview that works independently? | **NO** — Preview and Send are the same button ("Preview & Send LOE"). It generates the LOE preview AND offers send. Both require Valcre job number. |

## Observed Job State

**Job:** "Commercial dulpex, 6794-6796 Rue St-Hubert, Montreal"
- Status: Submitted
- Job Number: "Awaiting Valcre job"
- ClickUp Task: Has "View in ClickUp" button
- LOE fields filled: Property Rights (Leased Fee Interest), Scope (All Applicable), Fee ($3,500), Retainer ($350), Delivery (2026-04-09), Payment Terms (On LOE Signature)
- Report Type: EMPTY (visible gap)

## Screenshots

- `/tmp/apr-field-audit/round2/dashboard-list.png` — Job list
- `/tmp/apr-field-audit/round2/job-detail-top.png` — Job detail (client info)
- `/tmp/apr-field-audit/round2/job-detail-actions.png` — Property info section
- `/tmp/apr-field-audit/round2/job-detail-loe-section.png` — LOE section with action buttons
- `/tmp/apr-field-audit/round2/hover-valcre-btn.png` — Button hover state
