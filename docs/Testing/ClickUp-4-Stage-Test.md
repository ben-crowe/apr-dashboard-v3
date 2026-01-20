# ClickUp 4-Stage Automation Testing Guide

Quick reference for testing the complete ClickUp task lifecycle automation.

---

## Quick Start

```bash
# Make script executable
chmod +x test-clickup-4-stages.sh

# Test all stages interactively
./test-clickup-4-stages.sh all

# Test specific stage only
./test-clickup-4-stages.sh 1    # Stage 1 only
./test-clickup-4-stages.sh 2    # Stages 1-2
./test-clickup-4-stages.sh 2.5  # Stages 1-2.5
./test-clickup-4-stages.sh 3    # All stages 1-3

# Cleanup test data
./test-clickup-4-stages.sh cleanup
```

---

## What Each Test Does

### Stage 1: Form Submission → Create ClickUp Task
**Simulates:** Client submitting appraisal request form

**Actions:**
1. Creates test job in `job_submissions` table
2. Calls `create-clickup-task` Edge Function
3. ClickUp task created with Stage 1 format

**Expected Result:**
- Task name: `PENDING - Test Plaza, 123 Test Lane`
- Description has client info, property info, submission notes
- Bottom shows: `⏳ Waiting for LOE Quote Preparation...`
- Links at top: APR Dashboard, Coming Soon placeholders

---

### Stage 2: Valcre Job Created → Update ClickUp Task
**Simulates:** Appraiser creating Valcre job after filling LOE details

**Actions:**
1. Creates LOE details in `job_loe_details` table
2. Calls `update-clickup-task` Edge Function
3. Task updated with LOE section

**Expected Result:**
- Task name updated: `VAL251999 - Test Plaza, 123 Test Lane`
- LOE section added with:
  - 📋 LOE QUOTE PREPARED header
  - Job Details (VAL number, date)
  - Property Valuation (Rights, Scope, Report Type)
  - Financial Details (Fee, Retainer, Terms)
  - Comments (General, Delivery, Payment)
- Valcre Job link updated from "Coming Soon" to actual link
- Stage 1 data preserved

---

### Stage 2.5: DocuSeal Send → Add "LOE Sent" Timestamp
**Simulates:** DocuSeal sending LOE for signature

**Actions:**
1. Sends DocuSeal webhook with `submission.created` event
2. `docuseal-webhook` function adds timestamp
3. Task updated with "LOE Sent" line

**Expected Result:**
- Line added at top after Submission Date:
  ```
  ▸ LOE Sent:   25.11.19 / 3:45 PM
  ▸ LOE Signed: [Pending]
  ```
- Timestamp reflects current time
- Format: YY.MM.DD / H:MM AM/PM

---

### Stage 3: DocuSeal Signature → Add "LOE Signed"
**Simulates:** Client signing LOE via DocuSeal

**Actions:**
1. Sends DocuSeal webhook with `submission.completed` event
2. `docuseal-webhook` function adds signed timestamp + name
3. Task updated with "LOE Signed" line

**Expected Result:**
- Line updated at top:
  ```
  ▸ LOE Sent:   25.11.19 / 3:45 PM
  ▸ LOE Signed: 25.11.19 / 3:47 PM by Steven Torres
  ```
- Client name extracted from DocuSeal submitter
- Timestamp reflects current time

---

## Manual Verification Checklist

After running tests, manually verify in ClickUp:

### ✅ Stage 1 Format
- [ ] Task name: `PENDING - Test Plaza, 123 Test Lane`
- [ ] Links at top use triangles (▸)
- [ ] "APR Dashboard" not "APR Hub"
- [ ] Submission date formatted correctly
- [ ] Client info has bullets (•)
- [ ] Property info has bullets (•)
- [ ] Property Contact section present
- [ ] Bottom shows waiting message

### ✅ Stage 2 Format
- [ ] Task name updated to `VAL251999 - ...`
- [ ] LOE section has 📋 emoji
- [ ] Job Details section present
- [ ] Property Valuation section present
- [ ] Financial Details section present
- [ ] Comments section present (all 3 types)
- [ ] All fields use bullets (•)
- [ ] Stage 1 data still present (not overwritten)
- [ ] Valcre Job link updated

### ✅ Stage 2.5 Format
- [ ] "LOE Sent" line appears at top
- [ ] Triangle (▸) used
- [ ] Timestamp format: YY.MM.DD / H:MM AM/PM
- [ ] Proper spacing/alignment
- [ ] "LOE Signed: [Pending]" appears

### ✅ Stage 3 Format
- [ ] "LOE Signed" line updated
- [ ] Client name appears after timestamp
- [ ] Format: `by Steven Torres`
- [ ] Both LOE lines present and aligned

---

## Troubleshooting

### Script Fails on Stage 1
**Possible causes:**
- Supabase URL or API key incorrect
- Edge Function not deployed
- Database permissions issue

**Debug:**
```bash
# Check Edge Function exists
supabase functions list

# Check database connection
curl -X GET "${SUPABASE_URL}/rest/v1/job_submissions?limit=1" \
  -H "apikey: ${SUPABASE_ANON_KEY}"
```

### Stage 2 Doesn't Update Task Name
**Possible causes:**
- ClickUp API rate limit
- Task ID not saved correctly
- VAL number not in LOE data

**Debug:**
Check LOE data exists:
```bash
curl -X GET "${SUPABASE_URL}/rest/v1/job_loe_details?job_id=eq.${TEST_JOB_ID}" \
  -H "apikey: ${SUPABASE_ANON_KEY}"
```

### DocuSeal Webhooks Not Working
**Possible causes:**
- Webhook payload format mismatch
- Edge Function expects different structure
- ClickUp task ID not in metadata

**Debug:**
Check webhook handler logs:
```bash
supabase functions logs docuseal-webhook
```

---

## Cleanup

The script leaves the ClickUp task for manual verification. To clean up:

```bash
# Delete test data from Supabase
./test-clickup-4-stages.sh cleanup

# Manually delete ClickUp task
# Go to ClickUp → Find task → Delete
```

---

## Next Steps After Testing

1. **Verify all formats** match design specification
2. **Fix any issues** found during testing
3. **Test with real data** (form submission, Valcre job, DocuSeal)
4. **Deploy to production** after successful dev testing
5. **Monitor logs** for first few production runs

---

## Production Deployment Checklist

- [ ] All dev tests pass
- [ ] Format matches design spec exactly
- [ ] Database field names verified
- [ ] Edge Functions deployed to production
- [ ] ClickUp workspace switched to production
- [ ] Webhook endpoints updated
- [ ] Test with real form submission
- [ ] Verify no data loss during updates
- [ ] Monitor first 5 jobs closely

---

**Last Updated:** November 19, 2025
**Test Script:** `test-clickup-4-stages.sh`
**Session Summary:** `docs/-passover-sessions/25.11.19-2 - ClickUp-Section-2-Integration.md`
