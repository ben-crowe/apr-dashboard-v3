# ClickUp Integration - Comprehensive Test Plan

**Status**: ⚠️ **PARTIAL IMPLEMENTATION**  
**Last Updated**: Based on codebase review and planning documentation  
**Component**: APR Dashboard v3 → ClickUp Integration  
**Reference Docs**: `/Section Plans/03-ClickUp-Integration/`

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

**Checklist**:
- [ ] Open task in ClickUp
- [ ] Verify 9 subtasks added automatically:
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

---

## Part 3: Planned Features Testing (Not Yet Implemented)

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

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Access to ClickUp test workspace (`901703694310`)
- [ ] Access to ClickUp production workspace (`901402094744`)
- [ ] Valid API keys configured
- [ ] Test job with VAL number available
- [ ] Test job without VAL number available
- [ ] Browser console open for debugging
- [ ] Supabase logs accessible

### Phase 1: Current Implementation (Week 1)
- [ ] Test Suite 1.1: Manual Task Creation
- [ ] Test Suite 2.1: API Integration Testing
- [ ] Test Suite 3.1: Edge Function Testing
- [ ] Test Suite 4.1: Database Integration
- [ ] Test Suite 6.1: Error Handling
- [ ] Test Suite 7.1: Environment Testing

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

---

**Last Updated**: Based on comprehensive codebase review  
**Status**: Ready for execution (current features)  
**Next Steps**: Execute Phase 1 tests, then implement planned features

