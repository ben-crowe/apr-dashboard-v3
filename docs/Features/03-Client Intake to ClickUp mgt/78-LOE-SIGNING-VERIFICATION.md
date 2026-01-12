# LOE Signing Verification - End-to-End Test

**Date:** January 8, 2026  
**Status:** ✅ User confirmed signing successful

---

## ✅ What Should Have Happened

When you signed the LOE document, the following should have occurred automatically:

### 1. DocuSeal Webhook Triggered
- DocuSeal sends `submission.completed` event to webhook
- Webhook URL: `https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-webhook`

### 2. Job Status Updated
- **Database:** `job_submissions.status` → `'loe_signed'`
- **Table:** `job_submissions`
- **Field:** `status`

### 3. Signed Document Stored
- **Database:** `job_loe_details.signed_document_url` → DocuSeal PDF URL
- **Database:** `job_loe_details.signed_at` → Timestamp
- **Database:** `job_files` → New record with signed PDF

### 4. ClickUp Task Updated
- **Task Description:** Adds line: `▸ LOE Signed: [timestamp] by [signer name]`
- **Format:** `YY.MM.DD / H:MM AM/PM by [name]`
- **Example:** `▸ LOE Signed: 25.01.08 / 2:55 PM by Ben Crowe`

---

## 🔍 How to Verify

### Option 1: Check Dashboard
1. Go to the job in dashboard
2. Check job status → Should show "LOE Signed"
3. Check LOE section → Should show signed document

### Option 2: Check ClickUp Task
1. Open ClickUp task
2. Check description → Should have "LOE Signed" line with timestamp
3. Format: `▸ LOE Signed: [date/time] by [name]`

### Option 3: Check Database (CLI)
```bash
# Check job status
supabase db query "SELECT id, status FROM job_submissions WHERE status = 'loe_signed' ORDER BY updated_at DESC LIMIT 5;"

# Check LOE details
supabase db query "SELECT job_id, signed_at, signed_document_url FROM job_loe_details WHERE signed_at IS NOT NULL ORDER BY signed_at DESC LIMIT 5;"

# Check ClickUp task ID
supabase db query "SELECT job_id, clickup_task_id FROM job_loe_details WHERE signed_at IS NOT NULL ORDER BY signed_at DESC LIMIT 5;"
```

---

## 📋 Expected Results

**If everything worked:**

✅ Job status = `loe_signed`  
✅ `job_loe_details.signed_at` = Timestamp  
✅ `job_loe_details.signed_document_url` = DocuSeal PDF URL  
✅ ClickUp task description updated with "LOE Signed" line  
✅ `job_files` record created for signed PDF  

---

## 🐛 If Something Didn't Work

### Webhook Not Received
- Check Supabase Edge Function logs
- Verify DocuSeal webhook URL is configured correctly
- Check webhook events enabled: `submission.completed`

### Job Status Not Updated
- Check webhook logs for errors
- Verify `job_loe_details.docuseal_submission_id` matches DocuSeal submission ID
- Check database connection in Edge Function

### ClickUp Task Not Updated
- Check webhook logs for ClickUp API errors
- Verify `job_loe_details.clickup_task_id` exists
- Check ClickUp API token is valid

---

## 🎯 Next Steps After Verification

**If everything worked:**
- ✅ LOE signing flow is complete!
- Next: Payment flow (Stage 9)

**If something didn't work:**
- Check Supabase Edge Function logs
- Verify DocuSeal webhook configuration
- Check database records

---

**Action:** Verify the above items to confirm the complete flow worked!
