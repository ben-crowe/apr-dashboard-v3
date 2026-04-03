# Test 2: Test Data Pre-Fill & Field Coverage

## Test Data Buttons Found

4 separate Test Data buttons, each filling a different section:
1. **Client Info section** (@e19) — fills client + property fields
2. **LOE Quote section** (@e46) — fills LOE details (fee, delivery, comments, etc.)
3. **Building Info section** (@e62) — fills building information fields
4. **Data Gathering section** (@e69) — fills property research fields

## Field Values After LOE Test Data Click

### Client Information (from original form submission — NOT from test data button)

| Field | Value | Filled? |
|-------|-------|---------|
| First Name | test search | Yes |
| Last Name | Mossa | Yes |
| Title | Owner | Yes |
| Organization | 4381723 Nova Scotia Limited | Yes |
| Phone | (902) 817-9744 | Yes |
| Email | george_mossa@hotmail.de | Yes |
| Address | 21 Mic Mac Boulevard, Dartmouth, NS B3A 4N3 | Yes |

### Property Information

| Field | Value | Filled? |
|-------|-------|---------|
| Property Name | Commercial dulpex | Yes |
| Property Address | 6794-6796 Rue St-Hubert, Montreal QC H2S 2M6 | Yes |
| Property Types | Retail (with "Add more..." multi-select) | Yes |
| Intended Use | Acquisition | Yes |
| Valuation Premises | Market Value | Yes |
| Asset Condition | Excellent | Yes |
| Property Contact First | (empty) | No |
| Property Contact Last | (empty) | No |
| Property Contact Email | (empty) | No |
| Property Contact Phone | (775) 56 (partial) | Partial |

### LOE Quote Fields

| Field | Value | Filled? | Required for Valcre? |
|-------|-------|---------|---------------------|
| Job Number | Awaiting Valcre job | N/A | Auto (from API) |
| Property Rights | Leased Fee Interest | Yes | No |
| Scope of Work | All Applicable | Yes | **YES** |
| Payment Terms | On LOE Signature | Yes | No |
| Appraisal Fee | $3,500.00 | Yes | **YES** |
| Report Type | (empty) | **NO** | No |
| Retainer Amount | $350.00 | Yes | No |
| Delivery Date | 2026-04-09 | Yes | No |

### Comments

| Field | Value | Filled? |
|-------|-------|---------|
| Client Comments | "TD bank is requesting an hgvkjhvhAppraisal..." | Yes (from submission) |
| Internal Notes | "Bob Johnson assigned. Follow up with property manager..." | Yes (from test data) |
| Delivery Instructions | (not captured) | Unknown |
| Payment Notes | (not captured) | Unknown |

## "Create Valcre Job" Readiness

Required fields check:
1. Property Address — YES ("6794-6796 Rue St-Hubert...")
2. Property Type — YES ("Retail")
3. Intended Use — YES ("Acquisition")
4. Appraisal Fee — YES ($3,500.00)
5. Scope of Work — YES ("All Applicable")
6. Valuation Premises — YES ("Market Value")

**Result: ALL 6 required fields filled. Button is ENABLED.**

## "Preview & Send LOE" Readiness

Required conditions:
1. Valcre Job Number — **NO** ("Awaiting Valcre job")
2. Client First Name — YES
3. Client Last Name — YES
4. Client Email — YES
5. Property Address — YES

**Result: BLOCKED by missing Valcre job number. Button is DISABLED (opacity 0.5).**

## Missing After Test Data

| Field | Status | Impact |
|-------|--------|--------|
| Report Type | Empty | Not required for Valcre job creation, but will send empty to Valcre |
| Property Contact fields | Mostly empty | Optional (falls back to client contact) |
| Year Built | Contains garbage data | "Oh yeah, perfect. And no stupid..." — appears to have chat text in it, not a year |

## Issue: Year Built Field Corruption

The "Year Built" field contains what appears to be conversation text: "Oh yeah, perfect. And no stupid box hovering over or clickin..." — this is NOT a year value. Likely a paste error or test data corruption from a previous session. This would cause issues if sent to Valcre (expects a number).
