# PRP: LOE Template V4 Update

**Priority:** High
**Agent:** react-specialist
**Prepared by:** co-architect
**Date:** 2026-04-02
**Approved by:** Ben

---

## Context

Client (Chris) sent an updated LOE Template.docx. We are updating our v3Template.ts to match his new version. This is a TEXT-ONLY update to an existing template — same CSS, same images, same DocuSeal tags, same structure patterns. We duplicate the template, make text changes on the duplicate, and wire up new field mappings.

**Source of truth:** Chris's DOCX (extracted at `docs/valta share/LOE-Template-Extracted.md`)
**Clean preview (approved):** `docs/valta share/LOE-V4-CLEAN-PREVIEW.md`
**Current template reference:** `docs/valta share/LOE-TEMPLATE-V3-CURRENT.md`
**Editor capabilities:** `docs/valta share/TEMPLATE-EDITOR-CAPABILITIES.md`
**Architecture reference (MUST READ):** `docs/Features/12-LOE-Esign/LOE-DOCUSEAL-ARCHITECTURE.md`

---

## Approach

**Duplicate then modify. Zero risk to production.**

1. Copy `src/utils/loe/v3Template.ts` to `src/utils/loe/v4Template.ts`
2. All changes happen in v4Template.ts only
3. Update `generateLOE.ts` to import V4_TEMPLATE instead of V3_TEMPLATE
4. Keep v3Template.ts as backup — do not delete

---

## DO NOT TOUCH

- Base64 embedded images (logo + Chris's signature) — copy as-is
- DocuSeal `<signature-field>` and `<date-field>` tags — copy as-is
- CSS styles in `<head>` — copy as-is (add new classes only if needed)
- CSS class names used by templateParser.ts (`.subject-line`, `.intro`, `.property-table`, `.action-section`, `.terms-list`)
- `templateParser.ts` — no changes
- `TemplateEditorModal.tsx` — no changes
- `LOEPreviewModal.tsx` — no changes
- `saveTemplate.ts` — no changes

---

## Changes to Make in v4Template.ts

### 1. Header — Add phone + email

Current:
```html
<div class="address-block">
    <div class="company-line">[client.company] | [client.firstname] [client.lastname], [client.title]</div>
    <div class="address-line">[client.addressstreet]</div>
</div>
```

Change to:
```html
<div class="address-block">
    <div class="company-line">[client.company] | [client.firstname] [client.lastname], [client.title]</div>
    <div class="address-line">[client.addressstreet]</div>
    <div class="address-line">[client.phone]</div>
    <div class="address-line">[client.email]</div>
</div>
```

### 2. Introduction — Replace text

Current:
```
Thank you for your request to hire Valta Property Valuations Ltd. ("Valta" or "Firm") to complete the valuation and appraisal services of the above referenced subject property. This letter of engagement is intended to outline the terms and conditions of the assignment.
```

Change to:
```
This Letter of Engagement (this "LOE", "Agreement") is made and entered into on [date.created] (Engagement Date), by and between Valta Property Valuations Ltd. and [client.company] (herein referred to as "Authorized Client").
```

### 3. Property Details Table — Update rows

Replace the FIRST property-table contents with:

```html
<tr><td>Job Name</td><td>[name]</td></tr>
<tr><td>Property Address</td><td>[addressstreet]</td></tr>
<tr><td>Property Type</td><td>[purposes]</td></tr>
<tr><td>Interest Appraised</td><td>[propertyrights]</td></tr>
<tr><td>Authorized User</td><td>The appraisal will be prepared for the above-mentioned Authorized Client. Authorized users include the Authorized Client.</td></tr>
<tr><td>Authorized Use</td><td>The report to be performed under this Agreement ("Appraisal") is authorized for [intendeduses]. No other use is authorized by Appraiser. The authorized use as stated shall be used by Appraiser in determining the appropriate Scope of Work for the assignment.</td></tr>
<tr><td>Purpose</td><td>To estimate the [valuetimeframe] market value of the subject property.</td></tr>
<tr><td>Value Scenarios</td><td>[valuescenarios]</td></tr>
<tr><td>Effective Date</td><td>Date of inspection.</td></tr>
<tr><td>Report Type</td><td>[reportformat]</td></tr>
```

### 4. Fee Table — Replace SECOND property-table contents

Remove: Report Type row (moved to first table), Scope of Work row, Delivery Date row
Remove: [retainer] and [paymentterms] — NOT in Chris's version

Replace with:
```html
<tr><td>Professional Fee</td><td>[fee]</td></tr>
<tr><td>Expenses</td><td>Fees include all associated expenses.</td></tr>
<tr><td>Payment Terms</td><td>Appraiser shall invoice Client for services rendered pursuant to this Agreement based upon the fees specified in this Agreement. Appraiser's invoices are considered due upon receipt by Client and shall be deemed delinquent if not paid within five (5) days of the date of Appraiser's invoice.</td></tr>
```

### 5. NEW Section — Scope of Work (add after fee table, before action-section)

```html
<div class="property-details" style="margin-top: 20px;">
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Scope of Work</h3>
    <p style="margin-bottom: 10px;">Appraiser will provide the Appraisal in accordance with Canadian Uniform Standards of Professional Appraisal (CUSPAP). Appraiser will research relevant market data and perform analysis to the extent necessary to produce credible appraisal results. Appraiser anticipates developing the following valuation approaches:</p>
    <p style="margin-bottom: 10px; padding-left: 15px; font-style: italic;">[approachestovalue]</p>
    <p style="margin-bottom: 10px;">The scope of work will be included in the Appraisal. A copy of the Assumptions and Limiting Conditions, which appear in the Appraisal, is available upon request.</p>
    <table class="property-table">
        <tr><td>Delivery</td><td>[deliverytime] weeks (effective from date of payment or signed/returned engagement contract, whichever is later)</td></tr>
        <tr><td>Number of Reports</td><td>One (1) Electronic Final Appraisal</td></tr>
        <tr><td>Acceptance Date</td><td>These specifications are subject to modification if this Agreement is not accepted within 5 business days from the date of this letter.</td></tr>
    </table>
</div>
```

### 6. NEW Section — Property Data Request (add after Scope of Work, before action-section)

```html
<div class="property-details" style="margin-top: 20px;">
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Property Data Request</h3>
    <p style="margin-bottom: 10px;">Please forward any additional materials you would consider relevant in the analysis of the subject property. Such items may include, as applicable:</p>
    <p style="margin-bottom: 10px; padding-left: 15px;">[clientdocuments]</p>
    <p style="margin-bottom: 10px;">Additionally, any other third party reports, or any other sources of information known to exist that may impact the valuation of the property.</p>
    <p>Our ability to honor the terms of this Agreement will require Authorized Client's response within five (5) business days. If you have questions regarding the enclosed, please feel free to contact me, Valta Property Valuations Ltd. appreciates this opportunity to be of service to you on this assignment and looks forward to serving you.</p>
</div>
```

### 7. Closing (action-section) — Update text

Current:
```
If this letter of engagement correctly outlines the Client's understanding of the services to be rendered and the Client has read and agrees to the terms and conditions herein, please sign below.
```

Change to:
```
I, [client.firstname] [client.lastname], agree to the above stated terms and authorize Valta Property Valuations Ltd. to prepare the above referenced appraisal.
```

### 8. Signature Block — Update appraiser text

In the signature-company div, ensure it reads:
```
Respectfully,
VALTA PROPERTY VALUATIONS LTD.
[Chris's Signature Image - unchanged]
Chris Chornohos, AACI, MRICS
Founder
```

Keep ALL DocuSeal tags exactly as-is in the signature-block div.

### 9. Terms & Conditions — Replace <li> contents

Replace the text content of each `<li>` inside `<ol class="terms-list">` with the full legal text from Chris's DOCX.

Source: `docs/valta share/LOE-Template-Extracted.md` — the T&C section starting at "TERMS AND CONDITIONS".

**CRITICAL:** Keep the `<ol class="terms-list">` wrapper. Keep `<li>` tags. Keep the nested `<ol class="terms-sublist">` for insurance clauses (item 30). Only change the TEXT CONTENT inside each `<li>`.

The client's T&C has more paragraphs than our current 31 — count them from the extracted doc and add/remove `<li>` items as needed.

---

## Changes to generateLOE.ts — mapDataToV3Fields()

Add these new mappings to the return object:

```typescript
// NEW V4 fields
'[client.phone]': job.clientPhone || '',
'[client.email]': job.clientEmail || '',
'[valuetimeframe]': jobDetails.valuationPremises || 'Current',
'[valuescenarios]': jobDetails.valueScenarios || 'As Is',
'[approachestovalue]': jobDetails.approachesToValue || 'Direct Comparison, Income, Cost',
'[deliverytime]': jobDetails.deliveryTime || '4',
'[clientdocuments]': jobDetails.clientDocuments || '',
```

Remove these mappings (no longer in template):
```typescript
// REMOVED in V4
// '[paymentterms]' — removed, fixed prose in template
// '[retainer]' — removed, not in Chris's fee table
// '[scopes]' — removed from table, prose in Scope section now
// '[duedate]' — replaced by [deliverytime]
```

Update the import:
```typescript
// Change: import { V3_TEMPLATE } from './v3Template';
// To: import { V4_TEMPLATE } from './v4Template';
```

And update `loadV3Template()` fallback to use V4_TEMPLATE.

---

## Types Update — src/types/job.ts

Add to JobDetails interface:
```typescript
valueScenarios?: string;
approachesToValue?: string;
deliveryTime?: string;
clientDocuments?: string;
```

Note: `clientPhone` and `clientEmail` already exist on the `DetailJob` type (from submission form).

---

## Defaults

| Field | Default Value | Reason |
|-------|--------------|--------|
| `[valuetimeframe]` | "Current" | Most common valuation basis |
| `[valuescenarios]` | "As Is" | Standard default |
| `[approachestovalue]` | "Direct Comparison, Income, Cost" | All three approaches |
| `[deliverytime]` | "4" | 4 weeks per Ben's direction |
| `[clientdocuments]` | "" (empty) | Populated when dashboard field exists |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/utils/loe/v4Template.ts` | NEW — duplicate of v3Template.ts with all text changes |
| `src/utils/loe/generateLOE.ts` | Import V4, add 7 new mappings, remove 4 old mappings |
| `src/types/job.ts` | Add 4 optional fields to JobDetails |

## Files NOT to Modify

| File | Reason |
|------|--------|
| `src/utils/loe/v3Template.ts` | Backup — keep as-is |
| `src/utils/loe/templateParser.ts` | Editor code — no changes |
| `src/utils/loe/saveTemplate.ts` | Save code — no changes |
| `TemplateEditorModal.tsx` | Editor UI — no changes |
| `LOEPreviewModal.tsx` | Preview UI — no changes |

---

## QA Checklist

1. `npm run build` — clean, no TS errors
2. Preview LOE for existing test job — all fields render (no raw brackets showing)
3. New fields show defaults when not set (valuetimeframe=Current, deliverytime=4, etc.)
4. DocuSeal signature/date fields still present in HTML output
5. Logo and Chris's signature image render correctly
6. Template editor still works — can open, edit text, save, preview
7. Old V3 template still available as fallback (v3Template.ts untouched)
8. T&C section renders all clauses with correct numbering including nested insurance sublists
