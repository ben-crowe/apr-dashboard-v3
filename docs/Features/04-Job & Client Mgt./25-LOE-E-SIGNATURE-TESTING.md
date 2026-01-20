# LOE E-Signature Testing Guide

**Date:** January 8, 2026  
**Status:** 🟡 **READY TO TEST**  
**Test Job:** `f8f1106a-e44c-477e-b046-42315ce38d8f` (VAL261003)

---

## 🎯 Testing Goals

1. ✅ Verify "Preview & Send LOE" button works
2. ✅ Verify DocuSeal submission is created
3. ✅ Verify email is sent to client
4. ✅ Test signing flow (manual or Playwright)
5. ✅ Verify webhook updates job status to `loe_signed`
6. ✅ Verify ClickUp task updates with LOE Signed timestamp

---

## 📋 Prerequisites

- ✅ Job with VAL number exists: `VAL261003` (Job ID: 754404)
- ✅ DocuSeal integration configured
- ✅ Resend API configured
- ✅ DocuSeal webhook configured: `https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook`
- ✅ ClickUp task exists: `86dz5ht3z`

---

## 🧪 Test Steps

### Step 1: Generate LOE Preview

**Action:**
1. Navigate to job: `/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f`
2. Scroll to Section 2 (LOE Quote)
3. Ensure all required fields are filled:
   - ✅ Job Number: `VAL261003`
   - ✅ Appraisal Fee
   - ✅ Retainer Amount
   - ✅ Delivery Date
   - ✅ Property Rights
   - ✅ Scope of Work
   - ✅ Report Type
4. Click **"Preview & Send LOE"** button

**Expected Result:**
- ✅ Preview modal opens
- ✅ LOE document displays correctly formatted
- ✅ All job data appears in document
- ✅ Signature fields visible

**Verification:**
- Check browser console for any errors
- Verify preview HTML is generated
- Confirm all fields are populated correctly

---

### Step 2: Send LOE for E-Signature

**Action:**
1. Review preview document
2. Verify client email is correct (or edit if needed)
3. Click **"Send to Client"** button

**Expected Result:**
- ✅ DocuSeal submission created
- ✅ Submission ID returned
- ✅ Email sent to client
- ✅ Success toast notification shown
- ✅ Signing link displayed (if email fails)

**Verification:**
- Check browser console for:
  - `✅ DocuSeal submission created`
  - `✅ Email sent successfully`
- Check Supabase `job_loe_details` table:
  - `docuseal_submission_id` should be populated
- Check email inbox (if using test email)

**Database Check:**
```sql
SELECT docuseal_submission_id, loe_status, loe_sent_at
FROM job_loe_details
WHERE job_id = 'f8f1106a-e44c-477e-b046-42315ce38d8f';
```

---

### Step 3: Client Receives Email

**Action:**
1. Check client email inbox (`job.client_email`)
2. Open email from `onboarding@resend.dev`
3. Subject: `"Letter of Engagement - Ready for Signature"`

**Expected Result:**
- ✅ Email received
- ✅ Professional formatting
- ✅ Signing button/link present
- ✅ Link goes to DocuSeal portal

**Verification:**
- Click signing link
- Verify DocuSeal portal opens
- Document should be visible

---

### Step 4: Sign Document (Manual Test)

**Action:**
1. Open DocuSeal signing link
2. Review document
3. Fill signature field
4. Fill date field
5. Submit signature

**Expected Result:**
- ✅ Document displays correctly
- ✅ Signature field works
- ✅ Date field works
- ✅ Submission successful
- ✅ Confirmation message shown

**Alternative (Playwright Test):**
- Can automate signing flow with Playwright
- See `tests/loe-signing.spec.ts` (if exists)

---

### Step 5: Verify Webhook Updates

**Action:**
1. Wait 5-10 seconds after signing
2. Check Supabase logs for webhook call
3. Verify job status updated

**Expected Result:**
- ✅ Webhook receives `submission.completed` event
- ✅ Job status updated to `loe_signed`
- ✅ `signed_document_url` stored in `job_loe_details`
- ✅ `signed_at` timestamp stored
- ✅ File record created in `job_files` table

**Database Check:**
```sql
-- Check job status
SELECT status, updated_at
FROM job_submissions
WHERE id = 'f8f1106a-e44c-477e-b046-42315ce38d8f';
-- Should be: status = 'loe_signed'

-- Check signed document
SELECT signed_document_url, signed_at
FROM job_loe_details
WHERE job_id = 'f8f1106a-e44c-477e-b046-42315ce38d8f';
-- Should have URL and timestamp

-- Check file record
SELECT file_name, file_type, storage_path, category
FROM job_files
WHERE job_id = 'f8f1106a-e44c-477e-b046-42315ce38d8f'
AND category = 'signed_agreement';
```

**Supabase Logs:**
- Check Edge Function logs: `docuseal-webhook`
- Should see: `Successfully processed signed document for job: f8f1106a-e44c-477e-b046-42315ce38d8f`

---

### Step 6: Verify ClickUp Task Update

**Action:**
1. Open ClickUp task: `https://app.clickup.com/t/86dz5ht3z`
2. Check task description

**Expected Result:**
- ✅ LOE Sent timestamp added (if not already there)
- ✅ LOE Signed timestamp added
- ✅ Format: `▸ LOE Signed: 26.01.08 / 7:50 PM by [Client Name]`

**Verification:**
- Check task description in ClickUp
- Verify timestamp format matches expected format
- Verify signer name appears

**ClickUp API Check:**
```bash
curl -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  "https://api.clickup.com/api/v2/task/86dz5ht3z" | \
  grep -A 2 "LOE Signed"
```

---

### Step 7: Verify Dashboard Status Update

**Action:**
1. Refresh dashboard: `/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f`
2. Check job status badge

**Expected Result:**
- ✅ Status badge shows "LOE Signed"
- ✅ Status color is green (emerald)
- ✅ Status updates in real-time (or after refresh)

**Verification:**
- Check `JobDetailHeader` component
- Status should be `loe_signed`
- Badge should display "LOE Signed" with green color

---

## 🐛 Troubleshooting

### Issue: Email Not Received

**Possible Causes:**
- Resend API domain not verified
- Email address invalid
- Email in spam folder

**Solutions:**
- Check Resend dashboard for delivery status
- Verify email address format
- Check spam folder
- Use test email address

---

### Issue: Webhook Not Firing

**Possible Causes:**
- Webhook URL not configured in DocuSeal
- Webhook secret mismatch
- Network issues

**Solutions:**
- Verify webhook URL in DocuSeal dashboard:
  - `https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook`
- Check webhook events selected: `submission.created`, `submission.completed`
- Check Supabase Edge Function logs
- Test webhook manually with curl

**Manual Webhook Test:**
```bash
curl -X POST "https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "submission.completed",
    "data": {
      "id": "test_submission_id",
      "status": "completed",
      "completed_at": "2026-01-08T19:50:00Z",
      "submitters": [{"name": "Test Client"}],
      "documents": [{"url": "https://example.com/signed.pdf"}]
    }
  }'
```

---

### Issue: Job Status Not Updating

**Possible Causes:**
- Webhook failed silently
- Database update failed
- Job ID mismatch

**Solutions:**
- Check Supabase logs for errors
- Verify `docuseal_submission_id` matches in webhook payload
- Manually update status if needed:
  ```sql
  UPDATE job_submissions
  SET status = 'loe_signed', updated_at = NOW()
  WHERE id = 'f8f1106a-e44c-477e-b046-42315ce38d8f';
  ```

---

### Issue: ClickUp Task Not Updating

**Possible Causes:**
- ClickUp API token invalid
- Task ID not found
- Update function failed

**Solutions:**
- Verify ClickUp API token is valid
- Check task ID exists: `86dz5ht3z`
- Check Edge Function logs for ClickUp update errors
- Manually update ClickUp task if needed

---

## 📊 Test Results Template

```markdown
### LOE E-Signature Test Results

**Test Date:** [Date]
**Tested By:** [Name]
**Result:** ✅ PASS / ❌ FAIL

**Step 1: Preview Generation**
- Status: ✅ / ❌
- Notes: [Any issues]

**Step 2: Send LOE**
- Status: ✅ / ❌
- DocuSeal Submission ID: [ID]
- Email Sent: ✅ / ❌
- Notes: [Any issues]

**Step 3: Email Received**
- Status: ✅ / ❌
- Email Address: [email]
- Notes: [Any issues]

**Step 4: Document Signed**
- Status: ✅ / ❌
- Signing Method: Manual / Playwright
- Notes: [Any issues]

**Step 5: Webhook Updates**
- Status: ✅ / ❌
- Job Status Updated: ✅ / ❌
- Signed Document URL: [URL]
- Notes: [Any issues]

**Step 6: ClickUp Update**
- Status: ✅ / ❌
- LOE Signed Timestamp: [timestamp]
- Notes: [Any issues]

**Step 7: Dashboard Update**
- Status: ✅ / ❌
- Status Badge: ✅ / ❌
- Notes: [Any issues]

**Overall Result:** ✅ PASS / ❌ FAIL
**Issues Found:** [List any issues]
**Next Steps:** [What needs to be fixed]
```

---

## 🔗 Related Documentation

- **Workflow State:** `10-CURRENT-WORKFLOW-STATE.md`
- **Testing Status:** `19-TESTING-STATUS.md`
- **DocuSeal Implementation:** `../06-LOE-Generator/DocuSeal-Implementation.md`
- **Webhook Function:** `supabase/functions/docuseal-webhook/index.ts`

---

## ✅ Success Criteria

All of the following must pass:
1. ✅ LOE preview generates correctly
2. ✅ DocuSeal submission created successfully
3. ✅ Email sent to client
4. ✅ Document can be signed
5. ✅ Webhook updates job status to `loe_signed`
6. ✅ Signed document URL stored
7. ✅ ClickUp task updated with LOE Signed timestamp
8. ✅ Dashboard status badge shows "LOE Signed"

---

**Ready to test!** 🚀
