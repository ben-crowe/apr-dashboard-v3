# Autonomous Testing Strategy - Maximizing AI Capabilities

**Created:** January 8, 2026  
**Purpose:** Test critical workflow paths with minimal user involvement  
**Tools Available:** Playwright MCP, Supabase CLI, Terminal, Code Analysis

---

## Testing Capabilities Overview

### What I Can Test Autonomously ✅

1. **Code Analysis & Static Testing**
   - Review code for errors, logic issues
   - Verify function signatures, API calls
   - Check error handling patterns

2. **API Testing via Terminal**
   - Direct API calls to ClickUp, DocuSeal, Resend
   - Test Edge Functions via Supabase CLI
   - Verify responses and error handling

3. **Database Testing via Supabase CLI**
   - Check database triggers
   - Verify data integrity
   - Test migrations
   - Query job records

4. **Browser Automation (Playwright MCP)**
   - Navigate to production/staging
   - Fill forms, click buttons
   - Verify UI state changes
   - Capture screenshots
   - Check console logs

5. **Log Analysis**
   - Supabase Edge Function logs
   - Browser console messages
   - Network requests
   - Error tracking

### What Requires Your Involvement ⚠️

1. **Email Delivery Verification**
   - I can trigger emails, but need you to confirm receipt
   - Can check Resend dashboard for delivery status

2. **ClickUp Task Verification**
   - I can create tasks, but need you to verify in ClickUp UI
   - Can check via ClickUp API for task existence

3. **DocuSeal Signing Flow (NOW FULLY AUTONOMOUS)**
   - ✅ I can simulate client signing using Playwright
   - ✅ I can verify signing link works
   - ✅ I can verify webhook triggers correctly
   - ✅ I can verify dashboard updates
   - ✅ I can verify thank you email sent (via Resend API)

---

## Testing Workflow: Step-by-Step

### Phase 1: Code & Configuration Verification (100% Autonomous)

**What I'll Do:**
1. Review Edge Function code for errors
2. Verify API credentials are configured
3. Check database schema matches code expectations
4. Verify environment variables are set

**Commands I'll Use:**
```bash
# Check Supabase configuration
supabase status

# Verify Edge Functions are deployed
supabase functions list

# Check environment variables
supabase secrets list

# Review Edge Function code
cat supabase/functions/create-clickup-task/index.ts
```

**Expected Output:**
- ✅ All Edge Functions deployed
- ✅ Secrets configured
- ✅ Code has no syntax errors
- ✅ Database schema matches expectations

---

### Phase 2: API Integration Testing (100% Autonomous)

**Test 1: ClickUp API Direct Call**

```bash
# Test ClickUp API connectivity
curl -X GET "https://api.clickup.com/api/v2/user" \
  -H "Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU"

# Test creating a test task
curl -X POST "https://api.clickup.com/api/v2/list/901703694310/task" \
  -H "Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TEST - API Connectivity Check",
    "status": "to do"
  }'
```

**What I'll Verify:**
- ✅ API token is valid
- ✅ List ID exists and is accessible
- ✅ Task creation works
- ✅ Response includes task ID and URL

**Test 1b: ClickUp CLI Verification (NEW)**

```bash
# Set environment variables
export CLICKUP_API_TOKEN="pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU"
export CLICKUP_TEAM_ID="8555561"

# Get task details using CLI script
cd /Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli
./scripts/get-task.py "TASK_ID_HERE"

# Verify Phase 1 task structure:
# - Task name starts with "PENDING -"
# - markdown_description contains client/property info
# - Dashboard link: [APR Dashboard](https://apr-dashboard-v3.vercel.app/dashboard/job/{jobId})
# - Valcre job number shows as "PENDING"

# Verify Phase 2 task structure (after Valcre job created):
# - Task name updated to "VAL250137 - Property Name, Address"
# - markdown_description contains Stage 1 + Stage 2 sections
# - Valcre job link: [VAL250137](https://app.valcre.com/job/edit/{id})
# - LOE Quote section appended
```

**What I'll Verify:**
- ✅ Task exists in ClickUp
- ✅ Phase 1: Task name format correct (`PENDING - Property Name, Address`)
- ✅ Phase 1: markdown_description contains client info + dashboard link
- ✅ Phase 1: Links are clickable (markdown format correct)
- ✅ Phase 2: Task name updated (`VAL250137 - Property Name, Address`)
- ✅ Phase 2: Stage 1 content preserved
- ✅ Phase 2: Stage 2 LOE section appended correctly
- ✅ Phase 2: Valcre job link added and clickable
- ✅ HTML/markdown formatting is correct

**Test 2: Edge Function Direct Call**

```bash
# Test create-clickup-task Edge Function
supabase functions invoke create-clickup-task \
  --body '{"jobId": "test-job-id"}' \
  --env-file .env.local

# Or via HTTP
curl -X POST "https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/create-clickup-task" \
  -H "Authorization: Bearer [service-role-key]" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "[real-job-id]"}'
```

**What I'll Verify:**
- ✅ Edge Function responds
- ✅ Fetches job data correctly
- ✅ Creates ClickUp task
- ✅ Returns task ID and URL
- ✅ Updates Supabase (non-blocking)

**Test 3: DocuSeal API**

```bash
# Test DocuSeal proxy Edge Function
curl -X POST "https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/docuseal-proxy?endpoint=templates" \
  -H "Authorization: Bearer [anon-key]"
```

**What I'll Verify:**
- ✅ DocuSeal API accessible
- ✅ Proxy function works
- ✅ Authentication valid

**Test 4: Resend Email API**

```bash
# Test Resend API directly
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_T2VGRdd3_CqZuH9XCBrjxJuNPyQwykHJp" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": ["bc@crowestudio.com"],
    "subject": "TEST - API Connectivity",
    "html": "<p>This is a test email</p>"
  }'
```

**What I'll Verify:**
- ✅ Resend API key valid
- ✅ Email sends successfully
- ✅ Returns email ID
- ✅ Can check delivery status via API

---

### Phase 3: Database Trigger Testing (100% Autonomous)

**Test Database Trigger Exists:**

```bash
# Check if trigger exists
supabase db execute "
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'job_submissions';
"
```

**Test Trigger Fires:**

```bash
# Create test job record
supabase db execute "
INSERT INTO job_submissions (
  client_first_name,
  client_last_name,
  client_email,
  property_name,
  property_address,
  property_type,
  status
) VALUES (
  'Test',
  'User',
  'test@example.com',
  'Test Property',
  '123 Test St',
  'Building',
  'submitted'
) RETURNING id;
"

# Check Edge Function logs for trigger execution
supabase functions logs send-appraisal-request --tail
```

**What I'll Verify:**
- ✅ Trigger exists on `job_submissions` INSERT
- ✅ Trigger calls Edge Function correctly
- ✅ Edge Function receives webhook payload
- ✅ Email sent (check Resend API for email ID)

---

### Phase 4: Browser Automation Testing (95% Autonomous)

**Using Playwright MCP Tools:**

**Test 1: Form Submission Flow**

```typescript
// I'll use Playwright MCP to:
1. Navigate to: https://apr-dashboard-v3.vercel.app
2. Take snapshot of page
3. Find and click "Test Data" button (if available)
4. Fill form fields programmatically
5. Submit form
6. Wait for success message
7. Check console for errors
8. Take screenshot of result
```

**Test 2: Dashboard Job List**

```typescript
// I'll use Playwright MCP to:
1. Navigate to: https://apr-dashboard-v3.vercel.app/dashboard
2. Take snapshot
3. Verify jobs appear in list
4. Click on a job
5. Verify job details load
6. Check for ClickUp button
7. Verify button state (Create vs View)
```

**Test 3: ClickUp Button Click**

```typescript
// I'll use Playwright MCP to:
1. Navigate to job with VAL number
2. Find "Create ClickUp Task" button
3. Click button
4. Wait for loading state
5. Check console logs for API calls
6. Verify button changes to "View in ClickUp"
7. Click "View in ClickUp" → Verify opens ClickUp
8. Take screenshot at each step
```

**Test 4: LOE Preview & Send**

```typescript
// I'll use Playwright MCP to:
1. Navigate to job with VAL number
2. Fill LOE details (Section 2)
3. Click "Preview & Send LOE"
4. Wait for preview modal
5. Verify LOE content
6. Click "Send to Client"
7. Check console for DocuSeal API calls
8. Verify success message
9. Check network requests for email API call
```

**Test 5: DocuSeal E-Signature Flow (CRITICAL - Most Important)**

```typescript
// I'll use Playwright MCP to simulate client signing:
1. Get signing link from email (or DocuSeal API)
2. Navigate to DocuSeal signing portal
3. Take snapshot of signing page
4. Verify LOE document displays correctly
5. Verify signature fields are visible
6. Fill signature field (draw or type signature)
7. Click "Submit" or "Sign Document"
8. Wait for confirmation page
9. Verify "Document Signed Successfully" message
10. Check that webhook was triggered:
    - Monitor Supabase Edge Function logs (docuseal-webhook)
    - Verify job status updated to 'loe_signed'
    - Verify signed_document_url stored
    - Verify ClickUp task updated with "LOE Signed" timestamp
11. Navigate back to Dashboard
12. Verify job status shows "LOE Signed"
13. Verify signed document is available for download
14. Check for thank you email (if implemented)
```

**What I'll Verify:**
- ✅ Signing link works and opens DocuSeal portal
- ✅ LOE document displays correctly with all fields populated
- ✅ Client can sign the document
- ✅ Signature submission works
- ✅ Webhook fires and updates database
- ✅ Dashboard reflects signed status
- ✅ Signed document URL is stored
- ✅ ClickUp task updated with signing timestamp
- ✅ Thank you email sent (if implemented)

**What I'll Capture:**
- Screenshots at each step
- Console logs (errors, API calls)
- Network requests (verify API calls made)
- UI state changes (button states, loading indicators)

---

### Phase 5: End-to-End Workflow Test (90% Autonomous)

**Complete Flow Test:**

```bash
# Step 1: Create test job via API
# (I'll use Supabase CLI or direct API call)

# Step 2: Verify job in database
supabase db execute "
SELECT id, client_email, property_name, status 
FROM job_submissions 
ORDER BY created_at DESC 
LIMIT 1;
"

# Step 3: Check if team email was sent
# (Check Resend API for recent emails to bc@crowestudio.com)

# Step 4: Use Playwright to:
# - Open Dashboard
# - Find the test job
# - Create Valcre job
# - Create ClickUp task
# - Send LOE

# Step 5: Verify each step via API:
# - Check Valcre job exists (via Valcre API)
# - Check ClickUp task exists (via ClickUp API)
# - Check DocuSeal submission exists (via DocuSeal API)
# - Check email sent (via Resend API)
```

**What I'll Verify:**
- ✅ Job created in database
- ✅ Team email sent (check Resend API)
- ✅ Valcre job created (check Valcre API)
- ✅ ClickUp task created (check ClickUp API)
- ✅ **ClickUp task Phase 1 verified** (using `get-task.py` CLI):
  - Task name: `PENDING - Property Name, Address`
  - markdown_description contains client info
  - Dashboard link is clickable
  - Valcre job number shows "PENDING"
- ✅ **ClickUp task Phase 2 verified** (using `get-task.py` CLI):
  - Task name updated: `VAL250137 - Property Name, Address`
  - Stage 1 content preserved
  - Stage 2 LOE section appended
  - Valcre job link added and clickable
- ✅ LOE sent (check DocuSeal API + Resend API)
- ✅ **LOE SIGNED (CRITICAL)** - Using Playwright:
  - Client can sign document
  - Webhook triggers correctly
  - Job status updates to 'loe_signed'
  - Signed document URL stored
  - ClickUp task updated with signing timestamp
  - Dashboard reflects signed status
- ✅ Thank you email sent (check Resend API - if implemented)
- ✅ All data persisted correctly

---

## Testing Tools & Commands Reference

### Supabase CLI Commands

```bash
# Check status
supabase status

# List Edge Functions
supabase functions list

# View Edge Function logs
supabase functions logs create-clickup-task --tail
supabase functions logs send-loe-email-fixed --tail
supabase functions logs docuseal-webhook --tail

# Invoke Edge Function locally
supabase functions serve create-clickup-task
supabase functions invoke create-clickup-task --body '{"jobId": "..."}'

# Check database
supabase db execute "SELECT * FROM job_submissions ORDER BY created_at DESC LIMIT 5;"

# Check triggers
supabase db execute "
SELECT * FROM pg_trigger WHERE tgname LIKE '%job_submissions%';
"

# Check secrets
supabase secrets list
```

### Playwright MCP Commands

```typescript
// Navigation
mcp_playwright_browser_navigate({ url: "https://apr-dashboard-v3.vercel.app" })

// Page inspection
mcp_playwright_browser_snapshot() // Get page structure
mcp_playwright_browser_take_screenshot() // Visual capture

// Interactions
mcp_playwright_browser_click({ element: "...", ref: "..." })
mcp_playwright_browser_type({ element: "...", ref: "...", text: "..." })
mcp_playwright_browser_fill_form({ fields: [...] })

// Monitoring
mcp_playwright_browser_console_messages() // Check for errors
mcp_playwright_browser_network_requests() // Verify API calls
mcp_playwright_browser_wait_for({ text: "..." }) // Wait for UI changes
```

### API Testing Commands

```bash
# ClickUp API
curl -X GET "https://api.clickup.com/api/v2/user" \
  -H "Authorization: [token]"

# ClickUp CLI Scripts (VERIFICATION & MODIFICATION)
export CLICKUP_API_TOKEN="pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU"
export CLICKUP_TEAM_ID="8555561"

cd /Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli

# Get task details (verify formatting)
./scripts/get-task.py "TASK_ID"

# Update task if formatting is wrong
./scripts/update-task.py "TASK_ID" \
  --markdown-description "Fixed description here"

# Get workspace hierarchy (find list IDs)
./scripts/get-workspace-hierarchy.py

# Search for tasks
./scripts/get-workspace-tasks.py --tag "urgent"

# Resend API (check emails)
curl -X GET "https://api.resend.com/emails" \
  -H "Authorization: Bearer [key]"

# DocuSeal API (via proxy)
curl -X GET "https://[project].supabase.co/functions/v1/docuseal-proxy?endpoint=templates" \
  -H "Authorization: Bearer [anon-key]"
```

---

## Testing Execution Plan

### Test Run 1: Configuration Verification (5 minutes)

**What I'll Do:**
1. Check Supabase status and Edge Functions
2. Verify API credentials are set
3. Check database schema
4. Review code for obvious issues

**Report Format:**
```
✅ Supabase: Connected
✅ Edge Functions: 5 deployed
✅ Secrets: Configured
⚠️  Missing: [any missing configs]
```

### Test Run 2: API Connectivity (10 minutes)

**What I'll Do:**
1. Test ClickUp API directly
2. Test Resend API directly
3. Test DocuSeal API via proxy
4. Test Edge Functions via CLI

**Report Format:**
```
✅ ClickUp API: Connected (token valid)
✅ Resend API: Connected (email sent: [id])
✅ DocuSeal API: Connected (proxy working)
✅ Edge Functions: All responding
```

### Test Run 3: Database & Triggers (10 minutes)

**What I'll Do:**
1. Check trigger exists
2. Create test job record
3. Monitor Edge Function logs
4. Verify trigger fires

**Report Format:**
```
✅ Trigger exists: job_submissions_insert_trigger
✅ Test job created: [job-id]
✅ Trigger fired: send-appraisal-request called
✅ Email sent: [email-id from Resend]
```

### Test Run 4: Browser Automation (15 minutes)

**What I'll Do:**
1. Navigate to Dashboard
2. Test form submission (if form accessible)
3. Test ClickUp button
4. Test LOE preview/send
5. Capture screenshots and logs

**Report Format:**
```
✅ Dashboard loads
✅ Form submission: [success/failure]
✅ ClickUp button: [works/doesn't work]
✅ LOE preview: [works/doesn't work]
📸 Screenshots: [paths]
```

### Test Run 5: End-to-End Flow (20 minutes)

**What I'll Do:**
1. Create complete test job
2. Verify each step via API
3. Check all integrations
4. Verify non-blocking behavior

**Report Format:**
```
✅ Job created: [id]
✅ Team email: Sent ([email-id])
✅ Valcre job: Created ([VAL-number])
✅ ClickUp task: Created ([task-id])
  ✅ Phase 1 verified: Task name, description, links correct
  ✅ Phase 2 verified: Task updated, Stage 2 appended, links working
✅ LOE sent: [submission-id]
✅ All critical paths: Working
```

---

## What I'll Report to You

### After Each Test Run:

**Summary Format:**
```
🧪 Test Run: [Name]
⏱️  Duration: [X minutes]
✅ Passed: [count]
❌ Failed: [count]
⚠️  Warnings: [count]

Critical Paths:
✅ Form submission → Job creation
✅ Team email notification
⚠️  ClickUp task creation (needs verification)
✅ LOE e-signature sending

Issues Found:
1. [Issue description]
2. [Issue description]

Next Steps:
- [Action item]
- [Action item]
```

### Detailed Results:

**For Each Test:**
- Test name and purpose
- Steps executed
- Expected vs actual results
- Screenshots (if failures)
- Console logs (if errors)
- API responses (if relevant)

---

## Minimal User Involvement Needed

### What I Need From You:

**1. Email Verification (2 minutes)**
- I'll send test emails
- You check inbox and confirm receipt
- Or I can check Resend dashboard for delivery status

**2. ClickUp Verification (FULLY AUTONOMOUS)**
- ✅ I can verify tasks via ClickUp CLI scripts (`get-task.py`)
- ✅ I can check markdown_description formatting (HTML template)
- ✅ I can verify Phase 1 → Phase 2 update process
- ✅ I can check links work correctly
- ✅ I can modify tasks if formatting is wrong (`update-task.py`)
- ⚠️  You may want to visually confirm in ClickUp UI (optional)

**3. DocuSeal Signing Link (2 minutes)**
- I'll generate LOE and get signing link
- You click link to verify it works
- Or I can check DocuSeal API for submission status

**4. Edge Case Testing (as needed)**
- If I find unexpected behavior
- May need your input on expected behavior

---

## Testing Execution Commands

### Quick Start Testing

**I'll run this sequence:**

```bash
# 1. Configuration check
supabase status
supabase functions list
supabase secrets list

# 2. API connectivity
# (Direct API calls via curl)

# 3. Database trigger test
# (Create test job, monitor logs)

# 4. Browser automation
# (Playwright MCP navigation and interaction)

# 5. End-to-end verification
# (Check all APIs for created resources)
```

### Detailed Testing Script

I can create a comprehensive test script that:
- Runs all tests sequentially
- Captures results
- Generates report
- Identifies blockers

**Would you like me to:**
1. Start testing now with the quick checks?
2. Create a comprehensive test script first?
3. Focus on specific areas you're concerned about?

---

## Expected Testing Outcomes

### Best Case Scenario:
- ✅ All critical paths work
- ✅ Non-blocking architecture verified
- ✅ APIs all responding correctly
- ⚠️  Minor issues found (non-critical)

### Typical Scenario:
- ✅ Most critical paths work
- ⚠️  Some Supabase tracking issues (non-blocking)
- ⚠️  Button state inconsistencies (cosmetic)
- ❌ 1-2 blockers found (need fixing)

### Worst Case Scenario:
- ❌ Critical API failures
- ❌ Edge Functions not deployed
- ❌ Database triggers not working
- **Action:** Fix blockers immediately

---

**Ready to start testing?** I can begin with configuration verification and work through each phase systematically. Just say "start testing" and I'll execute the full test suite!
