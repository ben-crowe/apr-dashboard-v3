---
name: ClickUp Integration - Comprehensive Test Plan
overview: ""
todos: []
isProject: false
---

# ClickUp Integration - Comprehensive Test Plan

**Status**: ⚠️ **PARTIAL IMPLEMENTATION**

**Last Updated**: January 25, 2026 - Enhanced with domain expertise and integration status

**Component**: APR Dashboard v3 → ClickUp Integration

**Reference Docs**:

- `/Section Plans/03-ClickUp-Integration/`
- `/docs/Features/04-Job & Client Mgt./95-CLICKUP-DOMAIN-EXPERT-SUMMARY.md`
- `/docs/Features/04-Job & Client Mgt./96-LOE-TESTING-CONTINUATION.md`
- `/docs/Features/04-Job & Client Mgt./99-TESTING-TOOLS-INVENTORY.md`

---

## Executive Summary

### Current Implementation Status

| Feature | Status | Notes |

|---------|--------|-------|

| **Manual Task Creation** | ✅ **Complete** | Button works, creates task with template |

| **Task Format** | ✅ **Complete** | Stage 1 format matches spec |

| **Template Integration** | ✅ **Complete** | 9 subtasks added automatically |

| **Button Persistence** | ✅ **Complete** | State survives page reload |

| **Automatic Task Creation** | ❌ **Not Implemented** | Planned but not built |

| **Status Sync** | ❌ **Not Implemented** | No automation on workflow events |

| **Custom Field (Dashboard URL)** | ❌ **Not Implemented** | Planned for bidirectional nav |

| **Idempotency** | ⚠️ **Partial** | Button disabled during creation, but no DB check |

### Test Coverage Goals

- ✅ Verify current manual workflow works correctly
- ✅ Test task format matches Stage 1 specification
- ✅ Validate template application (9 subtasks)
- ✅ Test button state management
- ❌ Test automatic creation (when implemented)
- ❌ Test status sync automation (when implemented)
- ❌ Test bidirectional navigation (when implemented)

---

## Part 1: Current Implementation Testing

### Test Suite 1.1: Manual Task Creation (✅ Implemented)

**Purpose**: Verify existing "Create ClickUp Task" button workflow

#### E2E Test 1.1.1: Create Task Button Flow

```typescript
// File: tests/clickup-integration.spec.ts
test('Create ClickUp task via dashboard button', async ({ page }) => {
  // Navigate to job with VAL number
  await page.goto('/dashboard/job/{jobId}');
  
  // Verify "Create ClickUp Task" button exists
  const createBtn = page.locator('button:has-text("Create ClickUp Task")');
  await expect(createBtn).toBeVisible();
  
  // Click button
  await createBtn.click();
  
  // Verify loading state
  await expect(page.locator('text=Creating...')).toBeVisible({ timeout: 1000 });
  
  // Wait for task creation (3-5 seconds)
  await page.waitForTimeout(5000);
  
  // Verify button changed to "View in ClickUp"
  await expect(page.locator('button:has-text("View in ClickUp")')).toBeVisible();
  
  // Verify no page reload occurred
  expect(page.url()).toContain('/dashboard/job/');
  
  // Verify task ID saved to database (can check via API)
});
```

**Expected Results**:

- ✅ Button shows loading state during creation
- ✅ Task created in ClickUp (check test list: `901703694310`)
- ✅ Button updates without page reload
- ✅ `clickup_task_id` saved to `job_submissions` table
- ✅ `clickup_task_id` saved to `job_loe_details` table (dual storage)
- ✅ Button state persists on page refresh

#### Manual Test 1.1.2: Task Format Verification

**Reference**: `03-TASK-FORMAT-VISUAL.md` Stage 1 format

**Checklist**:

- [ ] Navigate to ClickUp test list: `https://app.clickup.com/8555561/v/li/901703694310`
- [ ] Find newly created task
- [ ] Verify task name format: `"NEW SUBMISSION - {PropertyName}, {PropertyAddress}"`
- [ ] Verify description sections:
  - [ ] Header: `📍 **NEW JOB ARRIVED - [View in APR Hub](URL)`
  - [ ] Separator line: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  - [ ] **CLIENT INFORMATION** section:
    - [ ] Name: `{firstName} {lastName}`
    - [ ] Organization: `{organization}`
    - [ ] Email: `{email}`
    - [ ] Phone: `{phone}`
  - [ ] **PROPERTY INFORMATION** section:
    - [ ] Property Name: `{propertyName}`
    - [ ] Address: `{propertyAddress}`
    - [ ] Property Type: `{propertyType}`
    - [ ] Intended Use: `{intendedUse}`
    - [ ] Asset Condition: `{assetCondition}`
    - [ ] Valuation Premise: `{valuationPremise}` (if available)
  - [ ] **SUBMISSION NOTES** section:
    - [ ] Notes: `{notes}`
  - [ ] Footer: `⏳ Waiting for LOE Quote Preparation...`
- [ ] Verify markdown formatting renders correctly
- [ ] Verify Dashboard link in description is clickable

#### Manual Test 1.1.3: Template Verification

**Reference**: Template ID `t-86b3exqe8` (LOE New Template 2025.01.09)

**Critical Distinction**: Subtasks vs Checklists

- ✅ **Subtasks**: Real child tasks with own IDs, can be assigned, have due dates, show in hierarchy
- ❌ **Checklists**: Simple checkboxes, cannot be assigned, no due dates, no hierarchy

**Verification Checklist**:

- [ ] Open task in ClickUp
- [ ] Verify 9 **subtasks** added automatically (NOT checklists):

  1. [ ] Create & Send LOE
  2. [ ] Plan Job
  3. [ ] Pull (TTSZ)
  4. [ ] Tour Property
  5. [ ] Sale and Lease Comps
  6. [ ] Build Front End
  7. [ ] Complete Valuation
  8. [ ] Send to Client
  9. [ ] Book Job

- [ ] Verify all subtasks are unchecked (initial state)
- [ ] Verify subtask names match template exactly
- [ ] Verify subtasks appear in task hierarchy (not as checkboxes)
- [ ] Verify subtasks have own task IDs (can be assigned individually)

#### Manual Test 1.1.4: Button State Persistence

**Checklist**:

- [ ] Create ClickUp task for a job
- [ ] Verify button shows "View in ClickUp"
- [ ] Refresh page (F5)
- [ ] Verify button still shows "View in ClickUp" (not reverted to "Create")
- [ ] Navigate away from job detail page
- [ ] Navigate back to same job
- [ ] Verify button state persists correctly
- [ ] Check database: Verify `clickup_task_id` exists in both tables

#### E2E Test 1.1.5: View in ClickUp Button

```typescript
test('View in ClickUp button opens task', async ({ page, context }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Verify "View in ClickUp" button exists
  const viewBtn = page.locator('button:has-text("View in ClickUp")');
  await expect(viewBtn).toBeVisible();
  
  // Click button (should open in new tab)
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    viewBtn.click()
  ]);
  
  // Verify ClickUp task page opened
  await expect(newPage).toHaveURL(/app\.clickup\.com\/t\//);
  
  // Verify task ID matches database
  const taskId = await newPage.url().match(/\/t\/([^\/]+)/)?.[1];
  // Can verify against database if needed
});
```

**Expected Results**:

- ✅ Button opens ClickUp task in new tab
- ✅ URL matches `clickup_task_url` in database
- ✅ Task displays correct information

---

## Part 2: API Integration Testing

### Test Suite 2.1: ClickUp API Direct Testing

**Purpose**: Verify API integration using test scripts

**Critical Pattern**: "3 Lookups + 1 API Call" for Subtasks

When creating subtasks, NEVER assume values. Always perform 3 lookups:

1. Get parent task's list ID (from parent task)
2. Get valid status from list (from list statuses)
3. Create subtask with `parent` field (using looked-up values)

**Reference**: `95-CLICKUP-DOMAIN-EXPERT-SUMMARY.md` - Mastered pattern

#### API Test 2.1.1: Test Script Execution

**Reference**: `/Section Plans/03-ClickUp-Integration/test-scripts/01-create-test-task-v2.js`

**Steps**:

```bash
cd /Users/bencrowe/Development/00-Project-Planning/APR-Dashboard/Section Plans/03-ClickUp-Integration/test-scripts
node 01-create-test-task-v2.js
```

**Expected Output**:

```
================================================
   ClickUp Test - Development Environment
================================================

🧪 Creating test task in Ben's test environment...

📤 Creating task in test list...

✅ Task created successfully!
Task ID: abc123xyz
Task Name: NEW SUBMISSION - Sparwood McDonalds, 2100 Middletown Place, Sparwood, BC T1K 2L3
URL: https://app.clickup.com/t/abc123xyz

📋 Check Ben's test list: https://app.clickup.com/8555561/v/li/901703694310
```

**Verification Checklist**:

- [ ] Script executes without errors
- [ ] Task appears in test list (`901703694310`)
- [ ] Task format matches Stage 1 specification
- [ ] Console output shows success message
- [ ] Task ID is valid ClickUp format

#### API Test 2.1.2: Template Verification Script

**Reference**: `02-get-clickup-templates.js`

**Steps**:

```bash
node 02-get-clickup-templates.js
```

**Expected Results**:

- [ ] Script lists available templates
- [ ] Template `t-86b3exqe8` appears in results
- [ ] Template name matches "LOE New Template 2025.01.09"

#### API Test 2.1.3: Template Details Script

**Reference**: `03-get-template-details.js`

**Steps**:

```bash
node 03-get-template-details.js
```

**Expected Results**:

- [ ] Script shows template structure
- [ ] 9 subtasks listed
- [ ] Subtask names match expected list

#### API Test 2.1.4: Subtask Creation Pattern Verification

**Purpose**: Verify Edge Function follows "3 lookups + 1 API call" pattern

**Reference**: `95-CLICKUP-DOMAIN-EXPERT-SUMMARY.md`

**Verification Steps**:

1. **Check Edge Function Code** (`supabase/functions/create-clickup-task/index.ts`):

   - [ ] Does NOT hardcode list ID
   - [ ] Does NOT hardcode status name
   - [ ] Looks up list ID from parent task: `GET /task/{parent_id}`
   - [ ] Looks up valid status from list: `GET /list/{list_id}`
   - [ ] Creates subtasks with `parent` field: `POST /list/{list_id}/task` with `{"parent": "...", "status": "..."}`

2. **Verify Subtask Creation**:

   - [ ] Create task via dashboard button
   - [ ] Check ClickUp API response for subtasks
   - [ ] Verify subtasks have `parent` field set correctly
   - [ ] Verify subtasks use looked-up status (not hardcoded)

**Expected Pattern**:

```typescript
// CORRECT: 3 lookups + 1 API call
const parentTask = await getTask(parentId);
const listId = parentTask.list.id;
const list = await getList(listId);
const status = list.statuses[0].status;
await createSubtask({ parent: parentId, status, ... });

// WRONG: Assuming values
await createSubtask({ parent: parentId, status: "to do", ... }); // ❌
```

---

## Part 3: Edge Function Testing

### Test Suite 3.1: Supabase Edge Function

**Purpose**: Test Edge Function that creates ClickUp tasks

**Location**: `supabase/functions/create-clickup-task/index.ts`

#### Manual Test 3.1.1: Edge Function Direct Call

**Using curl or Postman**:

```bash
curl -X POST 'https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/create-clickup-task' \
  -H 'Authorization: Bearer {anon_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "jobId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "taskId": "abc123xyz",
  "taskUrl": "https://app.clickup.com/9014181018/t/abc123xyz"
}
```

**Verification Checklist**:

- [ ] Function returns success response
- [ ] Task ID is valid
- [ ] Task URL is correct format
- [ ] Task appears in ClickUp
- [ ] Database updated with task ID

#### Manual Test 3.1.2: Error Handling

**Test Cases**:

- [ ] Call with invalid job ID → Returns error
- [ ] Call with missing jobId parameter → Returns 400 error
- [ ] Call with job that already has task → Should return existing task (idempotency)
- [ ] Call with invalid API key → Returns 401 error

#### Manual Test 3.1.3: Edge Function Production Readiness

**Purpose**: Verify Edge Functions support production credentials

**Reference**: `96-LOE-TESTING-CONTINUATION.md`, `99-TESTING-TOOLS-INVENTORY.md`

**Current Issue**: Edge Functions use dev credentials (`CLICKUP_API_TOKEN`)

**Required Updates**:

| Function | Current State | Fix Required |

|----------|---------------|--------------|

| `create-clickup-task` | Uses `CLICKUP_API_TOKEN` (dev) | Add `CLICKUP_API_TOKEN_VALTA` env var support |

| `update-clickup-task` | Uses `CLICKUP_API_TOKEN` (dev) | Add `CLICKUP_API_TOKEN_VALTA` env var support |

**Verification Checklist**:

- [ ] Check Edge Function code for credential selection logic
- [ ] Verify environment variable detection (test vs production)
- [ ] Test with `CLICKUP_API_TOKEN` (dev workspace: BC)
- [ ] Test with `CLICKUP_API_TOKEN_VALTA` (production workspace: Valta)
- [ ] Verify correct workspace used per environment
- [ ] Verify tasks created in correct list:
  - Dev: List ID `901706896375` (BC workspace)
  - Production: List ID `901402094744` (Valta workspace)

**Test Commands**:

```bash
# Test dev credentials
curl -X POST 'https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/create-clickup-task' \
  -H 'Authorization: Bearer {anon_key}' \
  -H 'Content-Type: application/json' \
  -d '{"jobId": "{testJobId}", "environment": "dev"}'

# Test production credentials (after update)
curl -X POST 'https://ngovnamnjmexdpjtcnky.supabase.co/functions/v1/create-clickup-task' \
  -H 'Authorization: Bearer {anon_key}' \
  -H 'Content-Type: application/json' \
  -d '{"jobId": "{testJobId}", "environment": "production"}'
```

---

## Part 4: Database Integration Testing

### Test Suite 4.1: Database Persistence

**Purpose**: Verify task IDs stored correctly in both tables

#### Manual Test 4.1.1: Dual Table Storage

**SQL Queries**:

```sql
-- Check job_submissions table
SELECT id, clickup_task_id, clickup_task_url 
FROM job_submissions 
WHERE id = '{jobId}';

-- Check job_loe_details table
SELECT job_id, clickup_task_id, clickup_task_url 
FROM job_loe_details 
WHERE job_id = '{jobId}';
```

**Expected Results**:

- [ ] Both tables have same `clickup_task_id`
- [ ] Both tables have same `clickup_task_url`
- [ ] Values match ClickUp task URL format
- [ ] No NULL values

#### Manual Test 4.1.2: Button State Query

**Test**: Verify button state can be determined from database

**Query**:

```sql
SELECT 
  js.id,
  js.clickup_task_id,
  CASE 
    WHEN js.clickup_task_id IS NOT NULL THEN 'View in ClickUp'
    ELSE 'Create ClickUp Task'
  END as button_text
FROM job_submissions js
WHERE js.id = '{jobId}';
```

**Expected Results**:

- [ ] Query returns correct button text
- [ ] Matches UI button state

---

## Part 5: Planned Features Testing (Not Yet Implemented)

### Test Suite 5.1: Automatic Task Creation

**Status**: ❌ **NOT IMPLEMENTED** - Test plan for when feature is built

**Reference**: `02-AUTO-CREATION-TECHNICAL-SPEC.md`

#### Planned Test 5.1.1: Database Webhook Trigger

**When Implemented**:

```typescript
test('Form submission auto-creates ClickUp task', async ({ page }) => {
  // Submit form
  await page.goto('/');
  // ... fill and submit form
  
  // Wait for webhook processing (2-3 seconds)
  await page.waitForTimeout(3000);
  
  // Navigate to dashboard
  await page.goto('/dashboard');
  
  // Find new job
  const newJob = page.locator(`text=${clientName}`);
  await newJob.click();
  
  // Verify "View in ClickUp" button already exists (not "Create")
  await expect(page.locator('button:has-text("View in ClickUp")')).toBeVisible();
  
  // Verify task created in ClickUp
  // Can check via API or manually
});
```

**Success Criteria** (when implemented):

- ✅ Task created within 3 seconds of form submission
- ✅ No manual button click required
- ✅ Idempotency prevents duplicates
- ✅ Team receives ClickUp notification

#### Planned Test 5.1.2: Idempotency Check

**When Implemented**:

```typescript
test('Idempotency prevents duplicate tasks', async ({ page }) => {
  // Submit form (creates task automatically)
  // ... form submission
  
  // Manually click "Create ClickUp Task" button
  const createBtn = page.locator('button:has-text("Create ClickUp Task")');
  if (await createBtn.isVisible()) {
    await createBtn.click();
  }
  
  // Verify no duplicate task created
  // Check ClickUp for single task
  // Check database for single task_id
});
```

### Test Suite 5.2: Custom Field (Dashboard URL Button)

**Status**: ❌ **NOT IMPLEMENTED**

**Reference**: `02-AUTO-CREATION-TECHNICAL-SPEC.md` Section 4

#### Planned Test 5.2.1: Custom Field Creation

**When Implemented**:

**Manual Steps**:

1. Create custom field via ClickUp API:
```bash
curl -X POST 'https://api.clickup.com/api/v2/list/901402094744/field' \
  -H 'Authorization: pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Dashboard Job URL",
    "type": "url",
    "type_config": {}
  }'
```

2. Save returned field ID
3. Update Edge Function with field ID

#### Planned Test 5.2.2: Bidirectional Navigation

**When Implemented**:

**Manual Checklist**:

- [ ] ClickUp task has "Dashboard Job URL" custom field
- [ ] Custom field is clickable button
- [ ] Clicking button opens Dashboard job in new tab
- [ ] Dashboard job URL is correct format
- [ ] Dashboard "View in ClickUp" button works
- [ ] Both directions navigate correctly

### Test Suite 5.3: Status Sync Automation

**Status**: ❌ **NOT IMPLEMENTED**

**Reference**: `08-Client-Email-Sequence/README.md` Section "ClickUp Status Updates"

#### Planned Test 5.3.1: LOE Signed → Status Update

**When Implemented**:

```typescript
test('LOE signature updates ClickUp task status', async ({ page }) => {
  // Simulate LOE signature (via webhook or manual)
  // Trigger DocuSeal webhook
  
  // Verify ClickUp task status updated
  // Check task status via API:
  const task = await getClickUpTask(taskId);
  expect(task.status.status).toBe('pending payment');
});
```

**Success Criteria** (when implemented):

- ✅ Status updates automatically when LOE signed
- ✅ No manual ClickUp update required
- ✅ Status matches workflow stage

#### Planned Test 5.3.2: Payment Received → Status Update

**When Implemented**:

```typescript
test('Payment received updates ClickUp task status', async ({ page }) => {
  // Simulate payment webhook
  // Trigger Stripe/GHL webhook
  
  // Verify ClickUp task status updated
  const task = await getClickUpTask(taskId);
  expect(task.status.status).toBe('job in progress');
  
  // Verify custom fields updated
  expect(task.custom_fields).toContainEqual({
    name: 'Payment Received',
    value: true
  });
});
```

---

## Part 6: Error Handling and Edge Cases

### Test Suite 6.1: Error Scenarios

#### E2E Test 6.1.1: Network Failure During Creation

```typescript
test('ClickUp creation handles network errors', async ({ page, context }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Simulate network failure
  await context.route('**/functions/v1/create-clickup-task**', route => route.abort());
  
  // Click create button
  await page.click('button:has-text("Create ClickUp Task")');
  
  // Verify error message appears
  await expect(page.locator('text=Failed to create task')).toBeVisible();
  
  // Verify button reverts to "Create" state
  await expect(page.locator('button:has-text("Create ClickUp Task")')).toBeVisible();
});
```

#### Manual Test 6.1.2: Invalid API Key

**Checklist**:

- [ ] Temporarily set invalid API key in Edge Function
- [ ] Attempt to create task
- [ ] Verify error message displayed
- [ ] Verify no task created in ClickUp
- [ ] Verify database not updated
- [ ] Restore valid API key

#### Manual Test 6.1.3: Missing Template

**Checklist**:

- [ ] Temporarily set invalid template ID
- [ ] Attempt to create task
- [ ] Verify task created but without subtasks
- [ ] Verify error logged in Supabase logs
- [ ] Restore valid template ID

#### Manual Test 6.1.4: Duplicate Prevention

**Current State**: Button disabled during creation (partial protection)

**Checklist**:

- [ ] Click "Create ClickUp Task" button
- [ ] Rapidly click again before first completes
- [ ] Verify only one task created
- [ ] Verify button disabled during creation
- [ ] Check database for single task_id

**Note**: Full idempotency requires database check (not yet implemented)

---

## Part 7: Environment Testing

### Test Suite 7.1: Environment Configuration

#### Manual Test 7.1.1: Test vs Production

**Reference**: `96-LOE-TESTING-CONTINUATION.md` - Integration Status

**Integration Status Summary**:

| Integration | Status | Details |

|-------------|--------|---------|

| ClickUp BC Workspace | ✅ **WORKING** | Dev testing, List ID: `901706896375` |

| ClickUp Valta Workspace | ⚠️ **PARTIAL** | Edge Functions use dev creds, production creds documented |

| Resend Sandbox | ✅ **WORKING** | Sends to admin@valta.ca |

| Resend valta.ca | ❌ **NOT DONE** | Domain not verified, can't send from noreply@valta.ca |

| DocuSeal | ✅ **WORKING** | LOE generation + signing |

| Email Checker | ✅ **WORKING** | bc@crowestudio.com OAuth |

**Checklist**:

- [ ] Verify `VITE_CLICKUP_ENV` environment variable
- [ ] Test environment uses: List ID `901703694310` (old test) OR `901706896375` (BC workspace)
- [ ] Production environment uses: List ID `901402094744` (Valta workspace)
- [ ] Verify correct API key used per environment:
  - Dev: `CLICKUP_API_TOKEN` (BC workspace)
  - Production: `CLICKUP_API_TOKEN_VALTA` (Valta workspace - needs Edge Function update)
- [ ] Test task creation in test environment
- [ ] Verify tasks don't appear in production list
- [ ] Verify Edge Functions support both credentials (see Test 3.1.3)

#### Manual Test 7.1.2: Configuration Verification

**Reference**: `00-ENVIRONMENT-CONFIG.md`

**Checklist**:

- [ ] API keys configured correctly
- [ ] List IDs match environment
- [ ] Template ID correct (`t-86b3exqe8`)
- [ ] Workspace IDs correct
- [ ] Dashboard URL format correct

#### Manual Test 7.1.3: Testing Tools Inventory

**Reference**: `99-TESTING-TOOLS-INVENTORY.md`

**Available Testing Scripts**:

**ClickUp CLI Library** (46 Production-Ready Scripts):

- Location: `/Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli/`
- Categories: Task Operations (15), Time Tracking (6), List Management (5), Folder Management (4), Tag Management (6), Member Management (2), Document Management (7), Workspace (1)

**Test Scripts**:

- Location: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./test-scripts/`
- `01-create-test-task-v2.js` - Create test task
- `02-get-clickup-templates.js` - List templates
- `03-get-template-details.js` - Template details

**Quick Test Commands**:

```bash
# Test ClickUp task creation
cd /Users/bencrowe/Development/00-Systems-Management/CLI-Libraries/clickup-cli
./scripts/create-task.py "Test Task" --list-id 901706896375

# Test email checker
cd /Users/bencrowe/Development/APR-Dashboard-v3
python3 scripts/check-bc-email.py
```

**Checklist**:

- [ ] Verify CLI library accessible
- [ ] Test script execution works
- [ ] Verify script outputs match expected format
- [ ] Test with both dev and production credentials (when available)

---

## Part 8: Integration with Other Systems

### Test Suite 8.1: Valcre Integration

#### Manual Test 8.1.1: Task Name Includes VAL Number

**Checklist**:

- [ ] Create Valcre job (generates VAL######)
- [ ] Create ClickUp task
- [ ] Verify task name includes VAL number: `"VAL###### - {Property}, {Address}"`
- [ ] If no VAL number yet, verify name: `"NEW - {Property}, {Address}"`

#### Manual Test 8.1.2: Task Update After Valcre Creation

**Reference**: `updateClickUpWithValcreJob()` function

**Checklist**:

- [ ] Create ClickUp task before Valcre job exists (name: "NEW - ...")
- [ ] Create Valcre job (generates VAL number)
- [ ] Verify ClickUp task name updated: `"VAL###### - ..."`
- [ ] Verify description updated with VAL number
- [ ] Verify "Book Job" subtask marked complete

### Test Suite 8.2: DocuSeal Integration

#### Planned Test 8.2.1: LOE Sent → Checklist Update

**Status**: ❌ **NOT IMPLEMENTED**

**When Implemented**:

- [ ] Send LOE for signature
- [ ] Verify ClickUp subtask "1. Create & Send LOE" marked complete
- [ ] Verify status updated (if implemented)

---

## Testing Approach: Dev Config vs Production

### Current Testing Strategy

**Reference**: `96-LOE-TESTING-CONTINUATION.md`

**Testing Can Proceed With Dev Config**:

- ✅ **ClickUp**: BC workspace (dev) - List ID `901706896375`
- ✅ **Email**: Sandbox - sends to admin@valta.ca
- ✅ **DocuSeal**: Production - fully working

This allows **full workflow testing** while production domain/workspace setup is pending.

**Production Blockers** (testing can proceed without):

- ⚠️ ClickUp Valta workspace credentials in Edge Functions (can test with BC workspace)
- ⚠️ Resend valta.ca domain verification (can test with sandbox)
- ⚠️ Microsoft 365 license (not needed for ClickUp integration testing)

**Recommendation**: Execute Phase 1 tests with dev config, then update Edge Functions and verify Resend domain before production deployment.

---

## Test Execution Checklist

### Pre-Testing Setup

**Environment Access**:

- [ ] Access to ClickUp BC workspace (dev) - List ID `901706896375`
- [ ] Access to ClickUp Valta workspace (production) - List ID `901402094744`
- [ ] Valid API keys configured:
  - `CLICKUP_API_TOKEN` (dev/BC workspace)
  - `CLICKUP_API_TOKEN_VALTA` (production/Valta workspace - for Edge Functions)
- [ ] Test job with VAL number available
- [ ] Test job without VAL number available
- [ ] Browser console open for debugging
- [ ] Supabase logs accessible

**Testing Tools**:

- [ ] ClickUp CLI library accessible (`/00-Systems-Management/CLI-Libraries/clickup-cli/`)
- [ ] Test scripts accessible (`/docs/Features/04-Job & Client Mgt./test-scripts/`)
- [ ] Email checker script accessible (`scripts/check-bc-email.py`)

**Note**: Testing can proceed with dev config (BC workspace, sandbox email) while production setup (Valta workspace, domain verification) is pending. See `96-LOE-TESTING-CONTINUATION.md` for details.

### Phase 1: Current Implementation (Week 1)

- [ ] Test Suite 1.1: Manual Task Creation
- [ ] Test Suite 2.1: API Integration Testing
- [ ] Test Suite 3.1: Edge Function Testing
- [ ] Test Suite 4.1: Database Integration
- [ ] Test Suite 6.1: Error Handling
- [ ] Test Suite 7.1: Environment Testing

### Phase 2: Integration Testing (Week 2)

- [ ] Test Suite 8.1: Valcre Integration
- [ ] Test Suite 8.2: DocuSeal Integration (if applicable)

### Phase 3: Planned Features (When Implemented)

- [ ] Test Suite 5.1: Automatic Task Creation
- [ ] Test Suite 5.2: Custom Field (Dashboard URL)
- [ ] Test Suite 5.3: Status Sync Automation

---

## Test Results Template

### Test Report Format

```markdown
## ClickUp Integration Test Report
**Date**: [Date]
**Tester**: [Name]
**Environment**: Test / Production

### Test Case: [Test Name]
**Status**: ✅ Pass / ❌ Fail / ⚠️ Warning

**Steps Executed**:
1. [Step 1]
2. [Step 2]

**Expected Results**:
- [Expected result 1]
- [Expected result 2]

**Actual Results**:
- [Actual result 1]
- [Actual result 2]

**Screenshots**: [Attach if applicable]

**Notes**: [Any observations]
```

---

## Known Issues and Limitations

### Current Limitations

1. **No Automatic Creation**: Tasks must be created manually via button
2. **No Status Sync**: ClickUp status doesn't update automatically on workflow events
3. **No Custom Field**: Dashboard URL button not yet implemented in ClickUp
4. **Partial Idempotency**: Button disabled but no database check prevents duplicates
5. **Edge Functions Use Dev Credentials**: Production workspace (Valta) credentials not yet supported in Edge Functions
6. **Resend Domain Not Verified**: Cannot send from noreply@valta.ca, using sandbox (redirects to admin@valta.ca)

### Planned Improvements

1. **Automatic Task Creation**: Database webhook on form submission
2. **Status Sync**: Auto-update on LOE signed, payment received
3. **Custom Field**: Bidirectional navigation button
4. **Full Idempotency**: Database check before task creation
5. **Edge Function Production Support**: Add `CLICKUP_API_TOKEN_VALTA` env var support to Edge Functions
6. **Resend Domain Verification**: Verify valta.ca domain to enable noreply@valta.ca sending

---

## Success Criteria

### Current Implementation (✅ Complete)

- ✅ Manual task creation works reliably
- ✅ Task format matches Stage 1 specification
- ✅ Template adds 9 subtasks correctly
- ✅ Button state persists across page reloads
- ✅ Task appears in correct ClickUp list
- ✅ Database stores task IDs correctly

### Planned Features (❌ Not Implemented)

- ❌ Automatic task creation on form submission
- ❌ Status sync on workflow events
- ❌ Custom field for Dashboard URL
- ❌ Full idempotency protection

---

## References

### Documentation Files

- `01-CURRENT-STATE-HANDOFF.md` - Current implementation details
- `02-AUTO-CREATION-TECHNICAL-SPEC.md` - Planned automatic creation
- `03-TASK-FORMAT-VISUAL.md` - Task format specification
- `04-QUICK-REFERENCE.md` - Quick lookup guide
- `00-CLICKUP-API-REFERENCE.md` - API documentation

### Test Scripts

- `test-scripts/01-create-test-task-v2.js` - Create test task
- `test-scripts/02-get-clickup-templates.js` - List templates
- `test-scripts/03-get-template-details.js` - Template details

### Code Locations

- Edge Function: `supabase/functions/create-clickup-task/index.ts`
- Frontend Component: `src/components/dashboard/job-details/actions/ClickUpAction.tsx`
- Utility Functions: `src/utils/webhooks/clickup.ts`

### Additional Reference Documents

- `95-CLICKUP-DOMAIN-EXPERT-SUMMARY.md` - Mastered "3 lookups + 1 API call" pattern, subtasks vs checklists
- `96-LOE-TESTING-CONTINUATION.md` - Integration status, production readiness blockers
- `99-TESTING-TOOLS-INVENTORY.md` - Complete testing tools inventory, script locations
- `DOMAIN-CLICKUP-EXPERT.md` - Comprehensive ClickUp domain knowledge
- `CLICKUP-SCRIPTS-REFERENCE.md` - 46 CLI scripts inventory

---

**Last Updated**: January 25, 2026 - Enhanced with domain expertise and integration status

**Status**: Ready for execution (current features)

**Next Steps**:

1. Execute Phase 1 tests with dev config (BC workspace)
2. Update Edge Functions for production credential support
3. Verify Resend domain status
4. Implement planned features (automatic creation, status sync, custom fields)