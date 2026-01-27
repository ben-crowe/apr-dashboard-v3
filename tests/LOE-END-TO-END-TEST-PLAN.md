# LOE End-to-End Testing Plan

**Created:** January 20, 2026  
**Purpose:** Complete testing workflow from form-fill → client-signing → ClickUp verification  
**Status:** Ready for Testing

---

## Current State Summary

### ✅ Completed Features

1. **LOE Template Editor** - Redesigned form-based editor (good enough per user)
2. **LOE Generation** - Working, generates HTML from template
3. **DocuSeal Integration** - API integration operational
4. **Email Sending** - Resend API integration working
5. **Webhook Handling** - DocuSeal webhook updates status
6. **ClickUp Integration** - Manual task creation + automatic status updates

### 📧 Email Accounts Available

- **Testing Account:** `bc@crowestudio.com` (for initial tests)
- **Client Account:** Microsoft email account (for proper testing)
- **From Address:** `onboarding@resend.dev` (sandbox - safe for testing)

### 🎯 Test Job

- **Job ID:** `f8f1106a-e44c-477e-b046-42315ce38d8f`
- **Job Number:** `VAL261003`
- **Status:** Pre-configured with Valcre job number and e-signature component
- **URL:** `http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f`

---

## Complete Workflow Overview

```
1. Form Submission (Already Done)
   ↓
2. ClickUp Task Creation (Manual Button)
   ↓
3. LOE Generation & Preview
   ↓
4. Send LOE to Client (DocuSeal + Email)
   ↓
5. Client Receives Email
   ↓
6. Client Signs LOE (DocuSeal Portal)
   ↓
7. Webhook Updates Status
   ↓
8. ClickUp Task Updated Automatically
```

---

## Testing Protocol

### Phase 1: Pre-Flight Checks

**Objective:** Verify system is ready for testing

#### Step 1.1: Verify Dev Server Running

```bash
# Check if server is running
curl http://localhost:8086

# Expected: HTML response
```

#### Step 1.2: Verify Test Job Exists

```bash
# Navigate to test job
agent-browser open http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f --headed

# Check console for job data
agent-browser console | grep -i "job\|VAL261003"
```

**Expected:**
- ✅ Job loads successfully
- ✅ Job number `VAL261003` displayed
- ✅ No console errors

#### Step 1.3: Verify Required Fields

**Check these fields are populated:**
- [ ] Client First Name
- [ ] Client Last Name
- [ ] Client Email
- [ ] Property Address
- [ ] Job Number (VAL261003)
- [ ] Appraisal Fee
- [ ] Delivery Date

**If missing:** Use test data buttons OR manually fill required fields

---

### Phase 2: ClickUp Task Creation

**Objective:** Create ClickUp task manually and verify it's linked

#### Step 2.1: Locate ClickUp Button

```bash
agent-browser snapshot -i | grep -i "clickup\|create.*task"
```

**Expected:** "Create ClickUp Task" button visible

#### Step 2.2: Create Task

```bash
# Click the button (replace @eXX with actual ref)
agent-browser click @eXX
agent-browser wait 2000
```

**Expected:**
- ✅ Button shows loading state
- ✅ Success message appears
- ✅ Task URL displayed/clickable
- ✅ Button changes to "Open Task" or similar

#### Step 2.3: Verify Task in ClickUp

**Manual Check:**
1. Open ClickUp workspace: `BC Workspace - Development`
2. Navigate to list: `901703694310`
3. Find task: Should show `VAL261003 - [Property Name]`
4. Verify task includes:
   - Dashboard link
   - Client information
   - Property details

**Expected Task Format:**
```
VAL261003 - Tech Center Building, 355 Centre Street, Calgary
```

#### Step 2.4: Verify Database Link

```bash
# Check console for task ID
agent-browser console | grep -i "clickup.*task\|task.*id"
```

**Expected:**
- ✅ `clickup_task_id` stored in database
- ✅ `clickup_task_url` stored in database

**Database Check (Optional):**
```sql
SELECT clickup_task_id, clickup_task_url 
FROM job_submissions 
WHERE id = 'f8f1106a-e44c-477e-b046-42315ce38d8f';
```

---

### Phase 3: LOE Generation & Preview

**Objective:** Generate LOE and verify preview

#### Step 3.1: Open LOE Preview

```bash
# Find "Preview & Send LOE" button
agent-browser snapshot -i | grep -i "preview.*send\|send.*loe"

# Click button
agent-browser click @eXX
agent-browser wait 2000
```

**Expected:**
- ✅ Preview modal opens
- ✅ LOE document displayed in iframe
- ✅ "Edit Template" button visible (if template editor enabled)
- ✅ "Send to Client" button visible

#### Step 3.2: Verify LOE Content

**Check LOE includes:**
- [ ] Subject line with job number
- [ ] Client name and address
- [ ] Property address
- [ ] Property details table
- [ ] Appraisal fee
- [ ] Delivery date
- [ ] Terms & Conditions section
- [ ] Signature area

#### Step 3.3: Test Template Editor (Optional)

**If template editing needed:**
```bash
# Click "Edit Template"
agent-browser snapshot -i | grep -i "edit template"
agent-browser click @eXX
agent-browser wait 1000

# Verify editor opens
agent-browser snapshot -i | grep -i "save template\|textarea"
```

**Note:** User mentioned template editor is "good enough" - skip if not needed

---

### Phase 4: Send LOE to Client

**Objective:** Send LOE via DocuSeal and email

#### Step 4.1: Send LOE

```bash
# In preview modal, click "Send to Client"
agent-browser snapshot -i | grep -i "send.*client\|approve.*send"
agent-browser click @eXX
agent-browser wait 3000
```

**Expected:**
- ✅ Loading state shown
- ✅ Success message: "LOE sent successfully"
- ✅ Signing link displayed (can copy)
- ✅ Modal closes or shows success state

#### Step 4.2: Verify Console Logs

```bash
agent-browser console | grep -i "docuseal\|submission\|email\|send"
```

**Expected Logs:**
- ✅ "Creating DocuSeal submission..."
- ✅ "DocuSeal submission created: [slug]"
- ✅ "Sending email to client..."
- ✅ "Email sent successfully"

#### Step 4.3: Verify Database Updates

**Check these fields updated:**
- [ ] `loe_submissions` table has new record
- [ ] `job_loe_details.submission_id` populated
- [ ] `job_loe_details.loe_sent_at` timestamp set

**Database Check (Optional):**
```sql
SELECT submission_id, loe_sent_at 
FROM job_loe_details 
WHERE job_id = 'f8f1106a-e44c-477e-b046-42315ce38d8f';
```

#### Step 4.4: Verify ClickUp Checklist Updated

**Manual Check in ClickUp:**
1. Open the task created in Phase 2
2. Check checklist item: "1. Create & Send LOE"
3. **Expected:** ✅ Checked (marked complete)
4. **Expected:** Timestamp added: "LOE Sent: [date/time]"

---

### Phase 5: Email Verification

**Objective:** Verify client receives email

#### Step 5.1: Check Email (Testing Account)

**For `bc@crowestudio.com`:**
1. Check inbox
2. Look for email from: `onboarding@resend.dev`
3. Subject: `"Letter of Engagement - Ready for Signature"`

**Expected Email Content:**
- ✅ Professional HTML email
- ✅ Client name in greeting
- ✅ Property address mentioned
- ✅ Signing link/button
- ✅ Clear call-to-action

#### Step 5.2: Verify Signing Link

**Click the signing link in email**

**Expected:**
- ✅ Opens DocuSeal portal
- ✅ LOE document displayed
- ✅ Signature widget visible
- ✅ Client can review document

#### Step 5.3: Test with Client Email (Microsoft Account)

**Repeat Steps 5.1-5.2 with client's Microsoft email account**

**Note:** This is the "proper" test - verify email delivery works with real client email

---

### Phase 6: Client Signing Process

**Objective:** Complete signature process

#### Step 6.1: Sign Document

**In DocuSeal portal:**
1. Review LOE document
2. Scroll to signature area
3. Click signature field
4. Sign using mouse/touchpad
5. Click "Complete" or "Sign"

**Expected:**
- ✅ Signature appears in field
- ✅ Document can be completed
- ✅ Confirmation message shown

#### Step 6.2: Verify Signature Completion

**After signing:**
- ✅ Thank you/confirmation page shown
- ✅ Option to download signed PDF
- ✅ Email confirmation sent (optional)

---

### Phase 7: Webhook Verification

**Objective:** Verify webhook updates database and ClickUp

#### Step 7.1: Check Webhook Received

**Wait 5-10 seconds after signing, then check:**

```bash
# Check Supabase logs (if accessible)
# OR check database directly
```

**Database Check:**
```sql
SELECT 
  status,
  loe_signed_at,
  signed_document_url,
  docuseal_submission_id
FROM job_submissions
WHERE id = 'f8f1106a-e44c-477e-b046-42315ce38d8f';
```

**Expected:**
- ✅ `status` = `'loe_signed'`
- ✅ `loe_signed_at` timestamp set
- ✅ `signed_document_url` populated
- ✅ `docuseal_submission_id` stored

#### Step 7.2: Verify ClickUp Task Updated

**Manual Check in ClickUp:**
1. Open the task
2. Check task description/comments
3. **Expected:** "LOE Signed: [date/time] by [Client Name]"

**Or check checklist:**
- ✅ "2. Client Signs LOE" checked (if checklist exists)

#### Step 7.3: Verify Signed PDF Available

**Check `job_files` table:**
```sql
SELECT file_name, file_url, file_type
FROM job_files
WHERE job_id = 'f8f1106a-e44c-477e-b046-42315ce38d8f'
AND file_type = 'loe_signed';
```

**Expected:**
- ✅ Signed PDF record created
- ✅ File URL accessible
- ✅ File name includes "signed" or "LOE"

---

### Phase 8: Dashboard Status Verification

**Objective:** Verify dashboard reflects signed status

#### Step 8.1: Refresh Dashboard

```bash
# Refresh job detail page
agent-browser refresh
agent-browser wait 2000
```

#### Step 8.2: Check Status Display

**Look for:**
- [ ] Status badge shows "LOE Signed" or similar
- [ ] Signed date displayed
- [ ] Signed PDF download link (if implemented)
- [ ] Next steps/actions available

#### Step 8.3: Verify UI Updates

**Check these components:**
- [ ] Job status badge updated
- [ ] LOE section shows "Signed" state
- [ ] Timeline/progress indicator updated (if exists)

---

## Testing Checklist

### Pre-Testing Setup

- [ ] Dev server running on port 8086
- [ ] Test job exists and accessible
- [ ] Required fields populated
- [ ] ClickUp workspace accessible
- [ ] Email accounts ready (bc@crowestudio.com + client Microsoft)

### ClickUp Integration

- [ ] Task creation button works
- [ ] Task created in ClickUp with correct format
- [ ] Task linked to job in database
- [ ] Checklist updated when LOE sent
- [ ] Task updated when LOE signed

### LOE Generation

- [ ] Preview modal opens
- [ ] LOE content correct
- [ ] All fields populated correctly
- [ ] Template renders properly

### Email & DocuSeal

- [ ] DocuSeal submission created
- [ ] Email sent successfully
- [ ] Email received in inbox
- [ ] Signing link works
- [ ] DocuSeal portal loads correctly

### Signing Process

- [ ] Client can sign document
- [ ] Signature appears correctly
- [ ] Document completion works
- [ ] Confirmation shown

### Webhook & Updates

- [ ] Webhook received by Supabase
- [ ] Database status updated
- [ ] Signed PDF URL stored
- [ ] ClickUp task updated automatically
- [ ] Dashboard UI reflects signed status

---

## Troubleshooting

### Issue: ClickUp Task Not Created

**Check:**
1. Console logs: `agent-browser console | grep -i "clickup"`
2. Network tab: Check API call to `/create-clickup-task`
3. ClickUp API token valid
4. List ID correct

**Fix:**
- Verify API token in Edge Function
- Check ClickUp workspace/list access
- Verify job has VAL number

### Issue: Email Not Received

**Check:**
1. Spam/junk folder
2. Resend dashboard for delivery status
3. Console logs for email sending
4. Email address valid

**Fix:**
- Check Resend API key
- Verify email address format
- Check Resend dashboard for errors

### Issue: Webhook Not Firing

**Check:**
1. DocuSeal webhook URL configured
2. Supabase Edge Function deployed
3. Webhook logs in Supabase dashboard
4. Network connectivity

**Fix:**
- Verify webhook URL in DocuSeal dashboard
- Redeploy Edge Function if needed
- Check Supabase logs for errors

### Issue: ClickUp Not Updating

**Check:**
1. Task ID stored in database
2. Webhook includes task ID lookup
3. ClickUp API token valid
4. Task exists in ClickUp

**Fix:**
- Verify `clickup_task_id` in database
- Check webhook function logs
- Verify ClickUp API permissions

---

## Success Criteria

### ✅ Complete Success

All phases complete successfully:
- ClickUp task created and linked
- LOE generated and previewed
- Email sent and received
- Client signs successfully
- Webhook updates database
- ClickUp task updated automatically
- Dashboard shows signed status

### ⚠️ Partial Success

Most phases work, minor issues:
- Email delayed but received
- Webhook delayed but eventually updates
- UI updates but with slight delay

### ❌ Failure Points

Critical failures to address:
- ClickUp task creation fails
- Email not sent
- Webhook not received
- Database not updated
- ClickUp not updated

---

## Next Steps After Testing

1. **Document Issues:** Note any bugs or issues found
2. **Fix Critical Issues:** Address blocking problems
3. **Retest:** Repeat failed phases after fixes
4. **Production Readiness:** Verify all systems operational
5. **Client Handoff:** Prepare for real client testing

---

## Notes

- **Template Editor:** User confirmed it's "good enough" - focus testing on workflow, not editor
- **Email Testing:** Use `bc@crowestudio.com` first, then client Microsoft account
- **ClickUp:** Verify updates happen automatically (no manual intervention needed)
- **Webhook Timing:** May take 5-10 seconds after signing for webhook to process

---

**Last Updated:** January 20, 2026  
**Test Job:** `f8f1106a-e44c-477e-b046-42315ce38d8f` (VAL261003)
