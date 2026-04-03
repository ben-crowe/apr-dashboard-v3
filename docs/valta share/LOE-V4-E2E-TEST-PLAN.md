# LOE V4 End-to-End Test Plan

**Target job:** VAL261029 — Riverside Complex, Michael Garcia (Valcre ID: 834912)
**URL:** https://apr-dashboard-v3.vercel.app/dashboard
**Purpose:** Verify payment fields + LOE V4 template work end-to-end on production

---

## Pre-Requisites

1. Load `/cli-browser-auto` skill first
2. Open the production dashboard: `agent-browser open https://apr-dashboard-v3.vercel.app/dashboard`
3. You may need to login first — check if a login page appears

---

## Step 1: Navigate to VAL261029

1. `agent-browser snapshot -i` — find the job list
2. Look for "Riverside Complex" or "VAL261029" in the job list
3. Click that job row to open the job detail view
4. `agent-browser screenshot /tmp/e2e-step1-joblist.png` — capture the job list state
5. After clicking, `agent-browser snapshot -i` — verify you're on the job detail page
6. `agent-browser screenshot /tmp/e2e-step1-jobdetail.png`

**Verify:** Job header shows VAL261029, Riverside Complex, Michael Garcia

---

## Step 2: Click Test Data Button

1. `agent-browser snapshot -i` — find the "Test Data" button/link in the LOE section
2. It's a small discrete button with a chevron icon and "Test Data" text — may need to scroll down to the LOE Quote section
3. Click the Test Data button
4. Wait 2 seconds for fields to populate
5. `agent-browser snapshot -i` — verify fields are now filled

**Verify these NEW payment fields specifically:**
- Retainer Paid date field shows: 2026-04-01
- Payment Amount field shows: $7,500.00
- Payment Paid date field shows: 2026-04-15
- (Existing Retainer Amount should also be filled)

6. `agent-browser screenshot /tmp/e2e-step2-testdata.png` — capture the LOE section with filled fields

---

## Step 3: Scroll Down to Verify All LOE Fields

1. Scroll through the entire LOE section
2. Check that ALL fields are populated (no empty/blank fields)
3. Key fields to verify:
   - Property Rights: "Fee Simple Interest"
   - Scope of Work: "All Applicable"
   - Report Type: "Appraisal Report"
   - Appraisal Fee: shows a dollar amount
   - Retainer Amount: shows a dollar amount
   - Delivery Date: shows a date
   - Payment Terms: shows a value
   - Comments: all three comment fields have text
4. `agent-browser screenshot /tmp/e2e-step3-allfields.png`

---

## Step 4: Click "Preview & Send LOE"

1. `agent-browser snapshot -i` — find the "Preview & Send LOE" button
2. It has a FileSignature icon and may show as "LOE Sent" if already sent before — that's OK, click it anyway
3. Click the button
4. Wait 3 seconds for the LOE Preview Modal to open
5. `agent-browser snapshot -i` — verify the modal is open
6. `agent-browser screenshot /tmp/e2e-step4-modal.png` — capture the modal

**Verify in the modal:**
- Template dropdown shows "V4 - Updated Template" (or similar) as selected
- Preview iframe shows the LOE document rendered

---

## Step 5: Inspect LOE Preview Content

1. The LOE preview is in an iframe — may need to scroll within it
2. Take screenshots at different scroll positions to capture the full document
3. `agent-browser screenshot /tmp/e2e-step5-loe-top.png` — top of LOE (header, client info)

**Verify these V4-specific elements:**
- Header shows client phone and email (not just name/address)
- Introduction text starts with "This Letter of Engagement (this 'LOE', 'Agreement')..."
- Table has "Job Name" (not "Property Identification")
- Table has "Interest Appraised" (not "Property Rights Appraised")
- Table has "Purpose" row with "market value" text
- Table has "Value Scenarios" row
- Fee section shows "Professional Fee" (not just "Fee")
- Fee section has "Payment Terms" as fixed prose about 5-day invoicing (NOT a placeholder)
- NO retainer amount row in the fee table
- Scope of Work section visible with CUSPAP text
- Delivery shows "4 weeks" format (not an exact date)
- Property Data Request section visible
- Signature block shows "Respectfully, VALTA PROPERTY VALUATIONS LTD."
- T&C section starts with proper legal text

4. Scroll down and screenshot more: `agent-browser screenshot /tmp/e2e-step5-loe-mid.png`
5. Scroll to bottom: `agent-browser screenshot /tmp/e2e-step5-loe-bottom.png`

---

## Step 6: Test V3 Template Switching

1. In the LOE Preview modal, find the template dropdown
2. Switch to "V3 - Original Template"
3. Wait for regeneration
4. `agent-browser screenshot /tmp/e2e-step6-v3.png`

**Verify:** Preview changes to V3 format (should show "Property Identification" instead of "Job Name", retainer row visible, old-style intro text)

5. Switch back to V4
6. Verify V4 renders correctly again

---

## Step 7: Close Modal, Verify Dashboard State

1. Close the LOE Preview modal (X button or Escape)
2. `agent-browser snapshot -i` — verify we're back on the job detail
3. Verify the payment fields still have their values (not wiped by the modal open/close)
4. `agent-browser screenshot /tmp/e2e-step7-afterclose.png`

---

## DO NOT DO

- Do NOT click "Send to Client" — this sends a real email via DocuSeal
- Do NOT modify any job data beyond what Test Data fills
- Do NOT create new jobs or Valcre records

---

## Expected Screenshots (7 total)

1. `e2e-step1-joblist.png` — Dashboard job list showing VAL261029
2. `e2e-step1-jobdetail.png` — Job detail page header
3. `e2e-step2-testdata.png` — LOE section with Test Data filled (including new payment fields)
4. `e2e-step3-allfields.png` — Full LOE section scrolled
5. `e2e-step4-modal.png` — LOE Preview modal open
6. `e2e-step5-loe-top.png` — LOE document preview (top half)
7. `e2e-step5-loe-mid.png` — LOE document preview (middle/bottom)
8. `e2e-step6-v3.png` — V3 template selected for comparison
9. `e2e-step7-afterclose.png` — Dashboard state after modal close

---

## Report Format

After completing all steps, report:

```
STEP 1: PASS/FAIL — [notes]
STEP 2: PASS/FAIL — [notes about payment fields specifically]
STEP 3: PASS/FAIL — [any empty fields?]
STEP 4: PASS/FAIL — [modal opened? template dropdown visible?]
STEP 5: PASS/FAIL — [V4 elements present? any raw brackets?]
STEP 6: PASS/FAIL — [V3 switch worked? V4 switch back worked?]
STEP 7: PASS/FAIL — [dashboard state preserved?]
```
