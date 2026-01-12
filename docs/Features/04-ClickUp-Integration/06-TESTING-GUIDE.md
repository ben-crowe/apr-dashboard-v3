# ClickUp 4-Stage Automation Testing Guide

**Quick Reference for Testing the ClickUp Integration**
**Date:** November 19, 2025

---

## Quick Start Testing

### 1. Test Stage 1 (Form Submission → Task Created)

**Method 1: Via Dashboard Form Submission**
1. Go to client form: https://apr-dashboard-v3.vercel.app
2. Fill out and submit a test job
3. Check ClickUp task appears in BC Workspace (List: 901703694310)

**Method 2: Direct API Call**
```bash
# Call create-clickup-task Edge Function directly
curl -X POST https://[your-project-ref].supabase.co/functions/v1/create-clickup-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your-service-role-key]" \
  -d '{"jobId": "[existing-job-id]"}'
```

**Expected Result:**
- Task created with name: `PENDING - Property Name, Street, City`
- Description shows clean format with triangles (▸) and bullets (•)
- Links show "Coming Soon" for Valcre Job, File Storage, Pipedrive
- Submission date/time appears correctly

---

### 2. Test Stage 2 (Valcre Job → LOE Section Added)

**Method 1: Via Dashboard**
1. Open job in Dashboard Section 2
2. Fill out LOE details
3. Click "Create Valcre Job"
4. Trigger update-clickup-task function (need to add this to dashboard)

**Method 2: Direct API Call**
```bash
# Call update-clickup-task Edge Function
curl -X POST https://[your-project-ref].supabase.co/functions/v1/update-clickup-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your-service-role-key]" \
  -d '{"jobId": "[job-id-with-loe-details]"}'
```

**Method 3: Using Supabase CLI (Local Testing)**
```bash
# Deploy function locally
supabase functions serve update-clickup-task

# Test with curl
curl -X POST http://localhost:54321/functions/v1/update-clickup-task \
  -H "Content-Type: application/json" \
  -d '{"jobId": "[job-id]"}'
```

**Expected Result:**
- Task name changes from `PENDING` to `VAL251032`
- Valcre Job link updates from "Coming Soon" to actual link
- LOE section appears with quote details
- All Stage 1 data preserved

---

### 3. Test Stage 2.5 (LOE Sent → Timestamp Added)

**Method 1: Via Dashboard**
1. Open job with LOE details
2. Click "Send LOE" button
3. DocuSeal sends email and triggers webhook

**Method 2: Simulate DocuSeal Webhook**
```bash
# Simulate submission.created webhook
curl -X POST https://[your-project-ref].supabase.co/functions/v1/docuseal-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "submission.created",
    "data": {
      "id": "[docuseal-submission-id]",
      "status": "pending",
      "email": "client@example.com",
      "created_at": "2025-11-19T15:45:00Z"
    }
  }'
```

**Expected Result:**
- "LOE Sent" line appears after "Submission Date"
- Timestamp formatted as: `25.11.19 / 3:45 PM`
- loe_sent_at updated in database

---

### 4. Test Stage 3 (LOE Signed → Timestamp + Name Added)

**Method 1: Via DocuSeal**
1. Client receives LOE email
2. Client opens and signs document
3. DocuSeal triggers completion webhook

**Method 2: Simulate DocuSeal Webhook**
```bash
# Simulate submission.completed webhook
curl -X POST https://[your-project-ref].supabase.co/functions/v1/docuseal-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "submission.completed",
    "data": {
      "id": "[docuseal-submission-id]",
      "status": "completed",
      "email": "client@example.com",
      "created_at": "2025-11-19T15:45:00Z",
      "completed_at": "2025-11-22T13:45:00Z",
      "submitters": [
        {
          "name": "Steven Torres",
          "email": "steven.torres@example.com"
        }
      ],
      "documents": [
        {
          "id": "doc123",
          "name": "LOE Agreement.pdf",
          "url": "https://docuseal.co/d/abc123"
        }
      ]
    }
  }'
```

**Expected Result:**
- "LOE Signed" line appears after "LOE Sent"
- Timestamp and signer name: `25.11.22 / 1:45 PM by Steven Torres`
- Job status updated to 'loe_signed'
- Signed document URL stored in database

---

## End-to-End Test Flow

### Complete Workflow Test

```bash
# 1. Create test job submission (via form or API)
# 2. Verify ClickUp task created (Stage 1)

# 3. Add LOE details and create Valcre job
curl -X POST http://localhost:54321/functions/v1/update-clickup-task \
  -H "Content-Type: application/json" \
  -d '{"jobId": "test-job-id"}'

# 4. Verify ClickUp task updated (Stage 2)

# 5. Simulate LOE sent
curl -X POST http://localhost:54321/functions/v1/docuseal-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "submission.created",
    "data": {
      "id": "test-submission-id",
      "created_at": "2025-11-19T15:45:00Z"
    }
  }'

# 6. Verify "LOE Sent" line added (Stage 2.5)

# 7. Simulate LOE signed
curl -X POST http://localhost:54321/functions/v1/docuseal-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "submission.completed",
    "data": {
      "id": "test-submission-id",
      "completed_at": "2025-11-22T13:45:00Z",
      "submitters": [{"name": "Test Client"}]
    }
  }'

# 8. Verify "LOE Signed" line added (Stage 3)
```

---

## Database Queries for Verification

### Check ClickUp Task IDs
```sql
-- Find jobs with ClickUp tasks
SELECT
  id,
  client_first_name,
  client_last_name,
  clickup_task_id,
  clickup_task_url
FROM job_submissions
WHERE clickup_task_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

### Check LOE Details and Timestamps
```sql
-- Find LOE details with timestamps
SELECT
  job_id,
  job_number,
  clickup_task_id,
  loe_sent_at,
  signed_at,
  docuseal_submission_id
FROM job_loe_details
WHERE job_number IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

### Find Test Jobs
```sql
-- Find recent test submissions
SELECT
  id,
  client_email,
  property_name,
  clickup_task_id,
  created_at
FROM job_submissions
WHERE client_email LIKE '%@test.com'
ORDER BY created_at DESC
LIMIT 10;
```

---

## ClickUp API Testing

### Fetch Task by ID
```bash
# Get task details from ClickUp
curl -X GET https://api.clickup.com/api/v2/task/[task-id] \
  -H "Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU"
```

### Update Task Manually (for testing)
```bash
# Update task description manually
curl -X PUT https://api.clickup.com/api/v2/task/[task-id] \
  -H "Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU" \
  -H "Content-Type: application/json" \
  -d '{
    "markdown_description": "Test description update"
  }'
```

---

## Expected Task Format at Each Stage

### After Stage 1
```markdown
▸ NEW Appraisal Request:   [View in APR Dashboard](link)
▸ VALCRE Job:              Coming Soon
▸ File Storage:            Coming Soon
▸ Pipedrive CRM:           Coming Soon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submission Date: November 19, 2025 / 11:53 AM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT INFORMATION
• Name: Steven Torres
• Organization: Cornerstone Development
• Email: steven.torres.023370@test.com
• Phone: (587) 657-9438

[... rest of Stage 1 data ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Waiting for LOE Quote Preparation...
```

### After Stage 2
```markdown
▸ NEW Appraisal Request:   [View in APR Dashboard](link)
▸ VALCRE Job:              [View VAL251032](valcre-link)
▸ File Storage:            Coming Soon
▸ Pipedrive CRM:           Coming Soon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submission Date: November 19, 2025 / 11:53 AM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... Stage 1 data preserved ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOE QUOTE PREPARED

JOB DETAILS
• Valcre Job Number: VAL251032
• Created: November 19, 2025

[... rest of LOE section ...]
```

### After Stage 2.5
```markdown
▸ NEW Appraisal Request:   [View in APR Dashboard](link)
▸ VALCRE Job:              [View VAL251032](valcre-link)
▸ File Storage:            Coming Soon
▸ Pipedrive CRM:           Coming Soon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submission Date: November 19, 2025 / 11:53 AM
▸ LOE Sent:   25.11.19 / 3:45 PM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... rest of content ...]
```

### After Stage 3 (Complete)
```markdown
▸ NEW Appraisal Request:   [View in APR Dashboard](link)
▸ VALCRE Job:              [View VAL251032](valcre-link)
▸ File Storage:            Coming Soon
▸ Pipedrive CRM:           Coming Soon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submission Date: November 19, 2025 / 11:53 AM
▸ LOE Sent:   25.11.19 / 3:45 PM
▸ LOE Signed: 25.11.22 / 1:45 PM by Steven Torres

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... rest of content ...]
```

---

## Common Issues & Solutions

### Task Not Found
**Issue:** ClickUp API returns 404
**Solution:**
- Verify task ID is correct in database
- Check API token has access to workspace
- Confirm task hasn't been deleted

### Timestamp Format Wrong
**Issue:** Date shows as ISO string instead of formatted
**Solution:**
- Check formatTimestamp function is being called
- Verify timezone handling in date parsing
- Test with different date formats

### Description Not Updating
**Issue:** Changes don't appear in ClickUp
**Solution:**
- Use markdown_description (not description)
- Check for special characters breaking regex
- Verify PATCH request is successful (not just 200)

### Webhook Not Triggering
**Issue:** DocuSeal events not reaching Edge Function
**Solution:**
- Verify webhook URL is correct
- Check DocuSeal webhook configuration
- Review DocuSeal webhook logs
- Test with manual curl request

---

## Debugging Commands

### Check Edge Function Logs
```bash
# View logs for create-clickup-task
supabase functions logs create-clickup-task

# View logs for update-clickup-task
supabase functions logs update-clickup-task

# View logs for docuseal-webhook
supabase functions logs docuseal-webhook
```

### Test Locally with Supabase CLI
```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve update-clickup-task --env-file .env.local

# Deploy to production
supabase functions deploy update-clickup-task
```

---

## Success Checklist

- [ ] Stage 1: Task created with PENDING name
- [ ] Stage 1: Clean format with triangles and bullets
- [ ] Stage 1: Submission date/time formatted correctly
- [ ] Stage 2: Task name changes to VAL number
- [ ] Stage 2: Valcre Job link updated
- [ ] Stage 2: LOE section appears with all details
- [ ] Stage 2: Stage 1 data preserved
- [ ] Stage 2.5: LOE Sent line added with timestamp
- [ ] Stage 3: LOE Signed line added with name
- [ ] All: No data loss through transitions
- [ ] All: Error handling works correctly
- [ ] All: Idempotency preserved (no duplicates)

---

**Testing Complete?** Report results to session for review before production deployment.
