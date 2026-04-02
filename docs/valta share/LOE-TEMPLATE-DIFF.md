# LOE Template Diff — Client DOCX vs Current v3Template.ts

**Date:** 2026-04-01
**Prepared by:** co-architect
**Purpose:** Identify changes needed to align v3Template.ts with Chris's updated LOE Template.docx

---

## Field Mapping Comparison

### Fields in BOTH (already aligned)

| Client DOCX Placeholder | Our Bracket | generateLOE.ts Key | Status |
|--------------------------|-------------|---------------------|--------|
| [Today's Date] | [date.created] | `[date.created]` | OK |
| [ClientFirstName] [ClientLastName] | [client.firstname] [client.lastname] | `[client.firstname]`, `[client.lastname]` | OK |
| [ClientCompanyName] | [client.company] | `[client.company]` | OK |
| [ClientOrganizationAddress] | [client.addressstreet] | `[client.addressstreet]` | OK |
| [JobName] | [name] | `[name]` | OK |
| [PropertyAddress] | [addressstreet] | `[addressstreet]` | OK |
| [PropertyType] | [purposes] | `[purposes]` | OK |
| [InterestAppraised] | [propertyrights] | `[propertyrights]` | OK |
| [AuthorizedUse] | [intendeduses] | `[intendeduses]` | OK |
| [ReportType] | [reportformat] | `[reportformat]` | OK |
| [Fee] | [fee] | `[fee]` | OK |

### NEW in Client DOCX — Not in Our Template

| Client DOCX Placeholder | What It Is | Action Needed |
|--------------------------|-----------|---------------|
| [ClientPhone] | Client phone number in header | ADD to template header block |
| [ClientEmail] | Client email in header | ADD to template header block |
| [ClientTitle] | Client title (separate from name) | Already in our template via `[client.title]` -- OK |
| [Valuetimeframe] | "Current/Prospective/Retrospective" in Purpose line | ADD -- maps to `jobDetails.valuationPremises` but used differently: "To estimate the [Valuetimeframe] market value" |
| [ValueScenarios] | Value scenarios (e.g. "As Is, As Complete") | ADD -- new field, maps to value timeframe custom field |
| [ApproachestoValue] | "Direct Comparison, Income, Cost" | ADD -- maps to VALTA custom field (12052) |
| [DeliveryTime] | "X weeks" delivery timeframe | ADD -- new field from V2 registry (parked for dashboard, but needed on LOE) |
| [ClientDocuments] | Checklist of docs to provide | ADD -- the 11-item list from V2 registry |

### In Our Template but NOT in Client DOCX

| Our Bracket | What It Is | Action |
|-------------|-----------|--------|
| [scopes] | Scope of work text | KEEP -- client DOCX has scope section but uses prose not a placeholder |
| [duedate] | Delivery date | KEEP -- client DOCX uses [DeliveryTime] (weeks) instead of exact date |
| [paymentterms] | Payment terms | REMOVE from template -- client DOCX has fixed prose for payment terms, not a placeholder |
| [retainer] | Retainer amount | NOT IN client DOCX fee table -- client uses fixed payment terms prose |
| [jobnumber] | Job number | KEEP -- used in subject line, client DOCX uses [JobName] instead |
| [notes] | Additional notes | NOT IN client DOCX -- remove or keep as hidden |

---

## Structural Differences

### 1. Header Block
**Client DOCX:** Full client contact block with phone + email
**Our Template:** Company + name + title + address only (no phone/email)
**Action:** Add [ClientPhone] and [ClientEmail] to header

### 2. Purpose Line
**Client DOCX:** "To estimate the [Valuetimeframe] market value of the subject property."
**Our Template:** Just "[requestedvalues]" in Value to be Appraised row
**Action:** Change template to use the full sentence with Valuetimeframe

### 3. Value Scenarios
**Client DOCX:** Has a [ValueScenarios] row (e.g. "As Is", "As Complete")
**Our Template:** Not present
**Action:** Add new row after Purpose

### 4. Scope of Work Section
**Client DOCX:** Separate section with [ApproachestoValue] placeholder
**Our Template:** Single row with [scopes]
**Action:** Restructure scope section to match client layout, add ApproachestoValue

### 5. Delivery
**Client DOCX:** "[DeliveryTime] weeks (effective from date of payment or signed/returned engagement contract, whichever is later)"
**Our Template:** "[duedate] from receipt of signed LOE and payment"
**Action:** Change to use weeks format + full qualifier text

### 6. Fee / Payment Section
**Client DOCX:** Single "Professional Fee" row with fixed payment terms prose (no retainer placeholder)
**Our Template:** Fee row + separate retainer amount
**Action:** Align fee section with client DOCX structure. Payment terms are fixed prose, not a field.

### 7. Property Data Request
**Client DOCX:** Has [ClientDocuments] placeholder — the 11-item checklist from V2 registry
**Our Template:** Not present
**Action:** Add new section before signature block with document request list

### 8. Terms & Conditions
**Client DOCX:** Much longer, more detailed legal text (CUSPAP, PIPEDA, environmental disclaimers)
**Our Template:** Abbreviated T&C
**Action:** Replace with client's full legal text

### 9. Signature Block
**Client DOCX:** Simple line signature + date, "Respectfully, VALTA PROPERTY VALUATIONS LTD., Chris Chornohos, AACI, MRICS, Founder"
**Our Template:** DocuSeal signature-field + date-field tags
**Action:** Keep DocuSeal tags but update surrounding text to match client format (add Chris's name/title)

---

## New Fields Needed in generateLOE.ts

```typescript
// NEW mappings to add:
'[client.phone]': job.clientPhone || '',
'[client.email]': job.clientEmail || '',
'[valuetimeframe]': jobDetails.valuationPremises || 'Current',  // reused
'[valuescenarios]': jobDetails.valueScenarios || 'As Is',  // NEW field
'[approachestovalue]': jobDetails.approachesToValue || 'Direct Comparison, Income, Cost',  // VALTA field 12052
'[deliverytime]': jobDetails.deliveryTime || '4',  // NEW from V2 registry (weeks)
'[clientdocuments]': jobDetails.clientDocuments || '',  // NEW from V2 registry (11-item list)
```

---

## Payment Fields — Do They Belong on LOE?

**No.** The client DOCX does NOT have AmountPaid or PaidDate on the LOE. The LOE is a pre-signing engagement letter — payment tracking happens after signing. The payment fields we just built (paymentAmount, paymentPaidDate, retainerPaidDate) are dashboard-only tracking, not LOE document fields. This is correct.

---

## Implementation Priority

1. **Replace T&C section** with client's full legal text (biggest content change, lowest risk)
2. **Update header block** — add phone + email
3. **Add ApproachestoValue** to scope section (already have VALTA field data)
4. **Change delivery format** from date to weeks
5. **Add Property Data Request section** with [ClientDocuments]
6. **Update Purpose line** with Valuetimeframe sentence
7. **Add ValueScenarios** row
8. **Update signature block** appraiser details
9. **Remove [paymentterms] and [retainer]** from template (client uses fixed prose)

---

## Files to Modify

| File | Change |
|------|--------|
| `src/utils/loe/v3Template.ts` | Major template restructure — new sections, updated T&C, new placeholders |
| `src/utils/loe/generateLOE.ts` | Add 5-7 new field mappings |
| `src/types/job.ts` | Add valueScenarios, approachesToValue, deliveryTime, clientDocuments to JobDetails |
| `src/hooks/useJobData.ts` | Map new fields from DB |
| Dashboard UI (optional) | DeliveryTime and ClientDocuments fields if not already there |

---

## Dependencies

- DeliveryTime field — parked in V2 registry (dashboard not built yet, but LOE needs it)
- ClientDocuments field — parked in V2 registry (11-item checklist, LOE needs it as a list)
- ApproachestoValue — already in VALTA custom fields (12052), already on dashboard
- ValueScenarios — may need new dashboard field or derive from existing data
