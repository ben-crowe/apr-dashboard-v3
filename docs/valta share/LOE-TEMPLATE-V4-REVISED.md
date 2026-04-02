# LOE Template — V4 Revised (per Chris's Updated DOCX)

**Based on:** `docs/valta share/LOE Template.docx` (client's updated version)
**Compared against:** `LOE-TEMPLATE-V3-CURRENT.md` (production version)
**Purpose:** Shows what the revised template will look like. Changes marked with CHANGED/ADDED/REMOVED.

---

## HEADER

**[Valta Logo]**

[date.created]

[client.company] | [client.firstname] [client.lastname], [client.title]
[client.addressstreet]
[client.phone] -- ADDED
[client.email] -- ADDED

---

## SUBJECT LINE (unchanged)

Re: Letter of Engagement ("LOE" or "Agreement") for Appraisal and Valuation Services for the Subject Property Identified as: [name], [addressstreet]

---

## INTRODUCTION

-- CHANGED: Updated to match client DOCX phrasing

This Letter of Engagement (this "LOE", "Agreement") is made and entered into on [date.created] (Engagement Date), by and between Valta Property Valuations Ltd. and [client.company] (herein referred to as "Authorized Client").

---

## PROPERTY DETAILS TABLE

| Field | Value | Status |
|-------|-------|--------|
| Job Name | [name] | CHANGED: was "Property Identification" with address |
| Property Address | [addressstreet] | ADDED: separate row |
| Property Type | [purposes] | unchanged |
| Interest Appraised | [propertyrights] | CHANGED: was "Property Rights Appraised" |
| Authorized User | The appraisal will be prepared for the above-mentioned Authorized Client. Authorized users include the Authorized Client. | CHANGED: was "Authorized Users" with different text |
| Authorized Use | The report to be performed under this Agreement ("Appraisal") is authorized for [intendeduses] | CHANGED: phrasing updated |
| Purpose | To estimate the [valuetimeframe] market value of the subject property. | ADDED: new field [valuetimeframe] |
| Value Scenarios | [valuescenarios] | ADDED: new row |
| Effective Date | Date of inspection. | CHANGED: shortened text |
| Report Type | [reportformat] | unchanged |

## FEE & DELIVERY TABLE

| Field | Value | Status |
|-------|-------|--------|
| Professional Fee | [fee] | CHANGED: was "Fee" with "plus applicable taxes" |
| Expenses | Fees include all associated expenses. | ADDED: new row |
| Payment Terms | Appraiser shall invoice Client for services rendered... invoices are due upon receipt... delinquent if not paid within five (5) days. | CHANGED: was [paymentterms] placeholder, now fixed prose |

-- REMOVED: "Scope of Work" row (moved to separate section)
-- REMOVED: "Delivery Date" row (moved to Scope section as [deliverytime])
-- REMOVED: [retainer] (not in client's fee structure)

---

## SCOPE OF WORK SECTION -- ADDED (new section from client DOCX)

**Valuation Approaches:** Appraiser will provide the Appraisal in accordance with Canadian Uniform Standards of Professional Appraisal (CUSPAP). Appraiser will research relevant market data and perform analysis to the extent necessary to produce credible appraisal results. Appraiser anticipates developing the following valuation approaches:

[approachestovalue] -- ADDED: maps to VALTA custom field 12052

The scope of work will be included in the Appraisal. A copy of the Assumptions and Limiting Conditions, which appear in the Appraisal, is available upon request.

**Delivery:** [deliverytime] weeks (effective from date of payment or signed/returned engagement contract, whichever is later) -- ADDED: replaces old [duedate]

**Number of Reports:** One (1) Electronic Final Appraisal

**Acceptance Date:** These specifications are subject to modification if this Agreement is not accepted within 5 business days from the date of this letter.

---

## PROPERTY DATA REQUEST SECTION -- ADDED (new section from client DOCX)

Please forward any additional materials you would consider relevant in the analysis of the subject property. Such items may include, as applicable:

[clientdocuments] -- ADDED: 11-item checklist from V2 registry

Additionally, any other third party reports, or any other sources of information known to exist that may impact the valuation of the property.

Our ability to honor the terms of this Agreement will require Authorized Client's response within five (5) business days. If you have questions regarding the enclosed, please feel free to contact me, Valta Property Valuations Ltd. appreciates this opportunity to be of service to you on this assignment and looks forward to serving you. If you have additional questions, please contact us.

---

## CLOSING -- CHANGED

I, [client.firstname] [client.lastname], agree to the above stated terms and authorize Valta Property Valuations Ltd. to prepare the above referenced appraisal.

---

## SIGNATURE BLOCK (structure unchanged, text updated)

**[Line for signature]** Date: **[date line]**
[client.firstname] [client.lastname]

Respectfully,
**VALTA PROPERTY VALUATIONS LTD.**

Chris Chornohos, AACI, MRICS
Founder

-- NOTE: DocuSeal signature-field and date-field tags remain exactly as-is. Only surrounding text changes.

---

## PROPERTY LIST (unchanged)

[To be entered for multiple properties -- Property Name, Property Address]

---

## TERMS & CONDITIONS -- CHANGED (full replacement with client DOCX version)

The client's updated DOCX has much longer, more detailed T&C covering:
- PIPEDA compliance
- Environmental disclaimers (detailed)
- Copyright and electronic document protection
- Mortgage lending conditions
- All content from the extracted `LOE-Template-Extracted.md`

The `<ol class="terms-list">` and `<li>` HTML structure stays the same. Only the text content of each `<li>` item is replaced.

---

## CHANGE SUMMARY

### New Bracket Fields (need mapping in generateLOE.ts)

| Bracket | Maps to | Source |
|---------|---------|--------|
| `[client.phone]` | `job.clientPhone` | Existing DB field |
| `[client.email]` | `job.clientEmail` | Existing DB field |
| `[valuetimeframe]` | `jobDetails.valuationPremises` (reused) | Existing — "Current"/"Prospective" |
| `[valuescenarios]` | NEW or derive from existing | Needs decision — "As Is", "As Complete" |
| `[approachestovalue]` | VALTA custom field 12052 | Already on dashboard |
| `[deliverytime]` | NEW `jobDetails.deliveryTime` | V2 registry field (weeks, not date) |
| `[clientdocuments]` | NEW `jobDetails.clientDocuments` | V2 registry field (11-item list) |

### Removed Brackets

| Bracket | Reason |
|---------|--------|
| `[paymentterms]` | Client uses fixed prose, not a placeholder |
| `[retainer]` | Not in client's fee table |
| `[scopes]` | Moved to prose in Scope section (may keep as [scopes] in prose) |

### Structural Changes

| Section | Change |
|---------|--------|
| Header | Add phone + email lines |
| Introduction | Replace with client's formal engagement language |
| Property Details table | Rename rows, split Property ID into Name + Address, add Purpose + Value Scenarios |
| Fee table | Rename to "Professional Fee", add Expenses row, fixed Payment Terms prose |
| Scope of Work | NEW section with approaches, delivery time, acceptance date |
| Property Data Request | NEW section with [clientdocuments] checklist |
| Closing | Replace with client's acceptance statement |
| T&C | Full text replacement (longer, more detailed) |

### Unchanged (do NOT touch)

- Valta logo (base64 image)
- Chris's signature (base64 image)
- DocuSeal `<signature-field>` and `<date-field>` tags
- All CSS classes and styling
- Footer
- Property List section

### Dependencies (fields not yet on dashboard)

| Field | Status | Needed for LOE? |
|-------|--------|-----------------|
| DeliveryTime | Parked in V2 registry | Yes — use default "4" weeks if not set |
| ClientDocuments | Parked in V2 registry | Yes — use empty string or default list if not set |
| ValueScenarios | Not on dashboard | Decide — hardcode "As Is" or add field |
| ApproachesToValue | On dashboard (VALTA 12052) | Yes — already available |
