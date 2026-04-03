# Test 3: DocuSeal LOE Send Test

## Result: SUCCESS

**DocuSeal Submission ID:** 6609936
**Signing Slug:** zu53LLXj3gJTPr
**Signing Link:** https://docuseal.com/s/zu53LLXj3gJTPr
**Email sent to:** bc@crowestudio.com (testing mode)
**Original client email:** sarah.wilson.213072@test.com

## Send Flow Observed

1. Clicked "Send to Client" in LOE Preview modal
2. Console logged: "Sending LOE to email: bc@crowestudio.com" (test override active)
3. HTML document sent via DocuSeal proxy (submissions/html endpoint)
4. DocuSeal returned slug: zu53LLXj3gJTPr
5. LOE submission saved to database (attempted — see error below)
6. job_loe_details updated with DocuSeal submission ID: 6609936
7. Email sent via Gmail SMTP Edge Function: SUCCESS
8. Toast: "LOE sent to bc@crowestudio.com successfully!"

## Post-Send UI Changes

- Button changed: "Preview & Send LOE" → "Resend LOE" (amber border styling)
- Job Number field populated: VAL261028
- No page navigation — stayed on same job detail view

## LOE Preview Field Verification (V3 Template)

| # | LOE Field | Value in Preview | From Dashboard | Populated? | Notes |
|---|-----------|-----------------|---------------|-----------|-------|
| 1 | Date | March 28, 2026 | auto | YES | Auto-generated |
| 2 | Client Company | Quantum Holdings | job.clientOrganization | YES | |
| 3 | Client Name | Sarah Wilson, Director | job.clientFirstName + LastName + Title | YES | |
| 4 | Client Address | 2399 Pine Place, Calgary, AB T2X 1Y6 | job.clientAddress | YES | |
| 5 | Property ID | VAL261028, 3494 Spring Parkway | jobDetails.jobNumber + propertyAddress | YES | |
| 6 | **Property Type** | **Financing/Refinancing** | **Should be "Land"** | **WRONG** | **Bug: maps intendedUse to [purposes]** |
| 7 | Authorized Client | Quantum Holdings | job.clientOrganization | YES | |
| 8 | Authorized Use | Financing/Refinancing | job.intendedUse | YES | |
| 9 | Value to be Appraised | Market Value As Is And Stabilized | Liquidation Value → enhanced text | YES | Note: "Liquidation Value" in dashboard becomes "Market Value As Is..." |
| 10 | Property Rights | Partial Interest | jobDetails.propertyRightsAppraised | YES | |
| 11 | Report Type | Summary | Default fallback | YES | Was empty in dashboard, got default |
| 12 | Fee | $3,500 plus applicable taxes | jobDetails.appraisalFee | YES | Enhanced with "plus applicable taxes" |
| 13 | Scope of Work | All Applicable | jobDetails.scopeOfWork | YES | |
| 14 | Delivery Date | 2026-04-11 from receipt of signed LOE and payment | jobDetails.deliveryDate | YES | Enhanced with condition text |
| 15 | Signature Block | SIGNATURE / DATE SIGNED / Sarah Wilson, Director | auto | YES | |

## The "7 Empty Fields" — Final Verdict

The send uses the V3 HTML template path (`generateLOE.ts`), NOT the legacy `mapJobToDocuSealFields` path. The HTML is pre-rendered with all fields filled, then sent to DocuSeal's `submissions/html` endpoint.

**In the ACTUAL send: 0 of the 7 fields were empty.** The V3 template populates everything. The legacy `docuseal.ts` path with empty SELECT fields is dead code for this flow.

However, `send_email: false` is set — DocuSeal does NOT send its own email. The app sends a custom email via Gmail SMTP instead. So the DocuSeal SELECT fields in the template are irrelevant — they're not used in the signing flow either. The client signs using the HTML document directly.

## Errors During Send

1. **LOE submission save failed:** `Failed to save LOE submission: Object` — The insert to `loe_submissions` table failed (likely missing table or column). The LOE was still sent successfully via DocuSeal.
2. **job_loe_details update succeeded:** DocuSeal submission ID (6609936) was saved correctly.

## Value Discrepancy: "Liquidation Value" → "Market Value As Is And Stabilized"

Dashboard shows "Liquidation Value" for Valuation Premises, but the LOE preview shows "Market Value As Is And Stabilized". This is because `generateLOE.ts` line 81 uses a hardcoded enhanced format:
```javascript
'[requestedvalues]': jobDetails.valuationPremises || 'Market Value',
```
But the V3 template text around it adds "As Is And Stabilized". The actual valuationPremises value ("Liquidation Value") should appear, but the template may have static text that overrides it. This needs investigation.

## Screenshots

- `/tmp/apr-field-audit/round3/test3-loe-modal.png` — LOE preview before send
- `/tmp/apr-field-audit/round3/test3-send-result.png` — Success toast after send
