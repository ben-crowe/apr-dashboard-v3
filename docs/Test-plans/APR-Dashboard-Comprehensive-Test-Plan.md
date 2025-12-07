# APR Dashboard V3 - Comprehensive Test Plan

**Status**: Ready for Execution  
**Last Updated**: Based on comprehensive codebase review  
**Component**: Full Application Testing

---

## Overview

This test plan verifies all workflows from client form submission through job completion, covering:
- Form submission and database persistence
- Auto-save functionality across all sections
- Valcre integration (job creation and sync)
- ClickUp integration (manual and planned automatic)
- E-signature workflow (DocuSeal)
- Client email sequence
- Routing and navigation
- Status transitions
- Error handling

**Test Levels**:
1. **E2E Playwright Tests** - Automated browser testing
2. **API Integration Tests** - Using existing test scripts
3. **Manual Testing Checklists** - Visual verification and edge cases
4. **Performance Tests** - Load and response time verification

---

## Test Environment Setup

### Production URL
```
https://apr-dashboard-v3.vercel.app
```

### Test Credentials
- **Test ClickUp List**: `901703694310` (Ben's test environment)
- **Production ClickUp List**: `901402094744` (Valta workspace)
- **Test Valcre Jobs**: Use VAL prefix (not CAL)

### Prerequisites
- Node.js 18+ installed
- Playwright installed: `npm install -D @playwright/test`
- Supabase connection configured
- Test job data available

---

## Part 1: Form Submission Workflow

### Test Suite 1.1: Form Submission to Database

**Purpose**: Verify client form submission creates job record correctly

#### E2E Test 1.1.1: Form Submission Flow
```typescript
// File: tests/form-submission.spec.ts
test('Submit form creates job in database', async ({ page }) => {
  // Navigate to form
  await page.goto('/');
  
  // Fill required fields
  await page.fill('[name="clientFirstName"]', 'Test');
  await page.fill('[name="clientLastName"]', 'User');
  await page.fill('[name="clientEmail"]', 'test@example.com');
  // ... fill all required fields
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Verify success screen appears
  await expect(page.locator('text=Thank you')).toBeVisible();
  
  // Verify job appears in dashboard
  await page.goto('/dashboard');
  await expect(page.locator('text=Test User')).toBeVisible();
});
```

**Expected Results**:
- ✅ Form submits successfully
- ✅ Job appears in dashboard immediately
- ✅ All fields saved correctly in `job_submissions` table
- ✅ Status is "submitted"
- ✅ Created timestamp is set

#### Manual Test 1.1.2: Database Verification
**Checklist**:
- [ ] Query `job_submissions` table directly
- [ ] Verify all form fields match database columns
- [ ] Check `property_type` vs `property_types[]` handling
- [ ] Verify property contact fields saved correctly
- [ ] Check file uploads (if applicable)

#### Manual Test 1.1.3: Field Mapping Verification
**Reference**: `.docs/field-mapping.md`

**Checklist**:
- [ ] Client fields map correctly (firstName → client_first_name)
- [ ] Property fields map correctly (address → property_address)
- [ ] Enum values saved correctly (intendedUse, assetCondition)
- [ ] Property types array saved correctly (multi-select)
- [ ] Property contact fields saved when provided

---

## Part 2: Auto-Save Functionality

### Test Suite 2.1: Field-Level Auto-Save

**Purpose**: Verify all fields auto-save on blur with correct debouncing

#### E2E Test 2.1.1: Auto-Save on Field Blur
```typescript
test('Field auto-saves on blur', async ({ page }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Edit appraisal fee field
  const feeField = page.locator('[name="appraisalFee"]');
  await feeField.fill('5000');
  await feeField.blur();
  
  // Wait for save indicator
  await expect(page.locator('text=Saved')).toBeVisible({ timeout: 2000 });
  
  // Verify database update (can check via API or directly)
  // ... verify value persisted
});
```

**Expected Results**:
- ✅ Field shows "saving..." indicator immediately
- ✅ Changes saved within 500ms (debounce delay)
- ✅ Success indicator appears ("Saved" toast)
- ✅ No page reload

#### E2E Test 2.1.2: Multiple Fields Auto-Save
```typescript
test('Multiple fields auto-save independently', async ({ page }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Edit multiple fields rapidly
  await page.fill('[name="appraisalFee"]', '5000');
  await page.fill('[name="retainerAmount"]', '2500');
  await page.fill('[name="deliveryDate"]', '2025-12-31');
  
  // Wait for all saves to complete
  await page.waitForTimeout(1000);
  
  // Verify all fields persisted
  // ... check database
});
```

**Expected Results**:
- ✅ Each field saves independently
- ✅ No conflicts between simultaneous saves
- ✅ All values persist correctly
- ✅ Two-table pattern: saves to both `job_submissions` AND `job_loe_details`

#### Manual Test 2.1.3: Two-Table Persistence
**Reference**: Architecture section on two-table pattern

**Checklist**:
- [ ] Edit LOE field (appraisalFee)
- [ ] Verify saved to `job_loe_details`
- [ ] Verify also saved to `job_submissions` (if applicable)
- [ ] Edit property field (buildingSize)
- [ ] Verify saved to `job_property_info`
- [ ] Check field name transformations (camelCase → snake_case)

#### Manual Test 2.1.4: Currency Field Formatting
**Checklist**:
- [ ] Enter "$5,000" in appraisal fee
- [ ] Verify saved as number: `5000`
- [ ] Check database has no $ or commas
- [ ] Edit retainer field with "$2,500.50"
- [ ] Verify saved correctly without formatting

---

## Part 3: Valcre Integration

### Test Suite 3.1: Valcre Job Creation

**Purpose**: Verify Valcre job creation workflow

#### E2E Test 3.1.1: Create Valcre Job Button
```typescript
test('Create Valcre job generates job number', async ({ page }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Find and click "Create Valcre Job" button
  const createBtn = page.locator('button:has-text("Create Valcre Job")');
  await createBtn.click();
  
  // Wait for job creation
  await expect(page.locator('text=VAL')).toBeVisible({ timeout: 10000 });
  
  // Verify job number format: VAL######
  const jobNumber = await page.locator('[data-testid="job-number"]').textContent();
  expect(jobNumber).toMatch(/^VAL\d+$/);
  
  // Verify button changed to "View in Valcre"
  await expect(page.locator('button:has-text("View in Valcre")')).toBeVisible();
});
```

**Expected Results**:
- ✅ Clicking button creates job in Valcre
- ✅ Job number generated (format: VAL######)
- ✅ `valcre_job_id` saved to database
- ✅ Button updates to "View in Valcre"
- ✅ No duplicate jobs created on double-click

#### Manual Test 3.1.2: Valcre API Payload Verification
**Reference**: `.docs/field-mapping.md`

**Checklist**:
- [ ] Use test script or network monitor to capture API call
- [ ] Verify field names use PascalCase (Retainer, AppraisalFee)
- [ ] Verify currency fields stripped of $ and commas
- [ ] Check Retainer field uses `Retainer` NOT `RetainerAmount`
- [ ] Verify date format is ISO 8601 (YYYY-MM-DD)
- [ ] Check property type mapping is correct

#### Manual Test 3.1.3: Valcre Sync Conditions
**Checklist**:
- [ ] Edit field while job has no Valcre job number → Should NOT sync
- [ ] Edit field when `jobNumber` is "PENDING" → Should NOT sync
- [ ] Edit field when `jobNumber` is VAL###### → SHOULD sync
- [ ] Edit non-sync field → Should NOT sync to Valcre
- [ ] Check `VALCRE_SYNC_FIELDS` whitelist is respected

### Test Suite 3.2: Valcre Field Sync

#### E2E Test 3.2.1: Auto-Sync to Valcre
```typescript
test('Field change syncs to Valcre when conditions met', async ({ page }) => {
  // Navigate to job with Valcre job number
  await page.goto('/dashboard/job/{valcreJobId}');
  
  // Edit sync-able field
  await page.fill('[name="appraisalFee"]', '6000');
  await page.blur('[name="appraisalFee"]');
  
  // Wait for save and sync
  await page.waitForTimeout(2000);
  
  // Verify sync occurred (check network tab or Valcre directly)
  // Alternative: Check for sync success indicator in UI
});
```

**Expected Results**:
- ✅ Field saves to Supabase first
- ✅ Then syncs to Valcre (if conditions met)
- ✅ No errors if Valcre sync fails (non-blocking)

---

## Part 4: ClickUp Integration

**Status**: ⚠️ **PARTIAL IMPLEMENTATION**
- ✅ Manual task creation works
- ❌ Automatic task creation (planned, not implemented)
- ❌ Status sync automation (not implemented)

### Test Suite 4.1: Manual ClickUp Task Creation (✅ Implemented)

**Purpose**: Verify existing manual button workflow

#### E2E Test 4.1.1: Create ClickUp Task Button
```typescript
test('Create ClickUp task via button', async ({ page }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Find "Create ClickUp Task" button
  const createBtn = page.locator('button:has-text("Create ClickUp Task")');
  await expect(createBtn).toBeVisible();
  
  // Click button
  await createBtn.click();
  
  // Wait for task creation (3-5 seconds)
  await page.waitForTimeout(5000);
  
  // Verify button changed to "View in ClickUp"
  await expect(page.locator('button:has-text("View in ClickUp")')).toBeVisible();
  
  // Verify task ID saved to database
  // Can verify via API check or database query
});
```

**Expected Results**:
- ✅ Button shows loading state during creation
- ✅ Task created in ClickUp (check test list: `901703694310`)
- ✅ Task includes all client/property information
- ✅ Task description formatted correctly (markdown)
- ✅ Template applied (9 subtasks added)
- ✅ Button updates without page reload
- ✅ `clickup_task_id` saved to database

**See**: `.docs/test-plans/ClickUp-Integration-Test-Plan.md` for detailed ClickUp testing

---

## Part 5: Client Email Sequence and E-Signature

**Status Overview**:
- ✅ **Email 1 (LOE Email)**: Fully Implemented
- ✅ **E-Signature Process**: Fully Implemented  
- ❌ **Email 2 (Thank You + Payment)**: NOT Implemented
- ❌ **Payment Processing**: NOT Implemented

### Test Suite 5.1: Email 1 - LOE Email (✅ Implemented)

**Purpose**: Verify LOE email sending workflow

#### E2E Test 5.1.1: Send LOE Email
```typescript
test('Send LOE triggers email and DocuSeal signature', async ({ page }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Fill required LOE fields
  await page.fill('[name="appraisalFee"]', '5000');
  await page.fill('[name="deliveryDate"]', '2025-12-31');
  // ... fill other required fields
  
  // Find "Send LOE" button
  const sendBtn = page.locator('button:has-text("Send LOE")');
  await sendBtn.click();
  
  // Verify email sent confirmation
  await expect(page.locator('text=Email sent')).toBeVisible();
  
  // Verify DocuSeal submission created
  await expect(page.locator('text=Signature link sent')).toBeVisible();
  
  // Verify status updated to "loe_sent"
  // Verify docuseal_submission_id saved
});
```

**Expected Results**:
- ✅ LOE email sent via Resend API
- ✅ Email contains signing link
- ✅ DocuSeal submission created
- ✅ `docuseal_submission_id` saved to database
- ✅ Status updated to "loe_sent"

#### Manual Test 5.1.2: Email Content Verification
**Checklist**:
- [ ] Check email inbox for LOE email
- [ ] Verify sender: `Valta Appraisals <noreply@crowestudio.com>`
- [ ] Verify subject: `Letter of Engagement - Ready for Signature`
- [ ] Verify email contains:
  - [ ] Personalized greeting
  - [ ] Property address reference
  - [ ] "Review & Sign Document" button
  - [ ] Contact information
  - [ ] Company branding
- [ ] Click signing button → Opens DocuSeal portal

### Test Suite 5.2: E-Signature Process (✅ Implemented)

#### Manual Test 5.2.1: DocuSeal Signature Flow
**Checklist**:
- [ ] Client clicks signing link in email
- [ ] DocuSeal portal opens
- [ ] LOE document displays correctly
- [ ] All 22 fields populated correctly
- [ ] Client can sign electronically
- [ ] Client submits signature
- [ ] Confirmation message appears

#### Manual Test 5.2.2: DocuSeal Webhook Verification
**Reference**: `supabase/functions/docuseal-webhook/index.ts`

**Checklist**:
- [ ] Client signs LOE in DocuSeal
- [ ] Verify webhook received at `/functions/v1/docuseal-webhook`
- [ ] Check Supabase logs for webhook processing
- [ ] Verify status updated to "loe_signed"
- [ ] Verify `signed_document_url` saved
- [ ] Verify file record created in `job_files` table
- [ ] Check signed document accessible

### Test Suite 5.3: Email 2 - Thank You + Payment (❌ NOT Implemented)

**Status**: ❌ **NOT IMPLEMENTED** - Test plan for when feature is built

**Missing Components**:
- ❌ Email template not created
- ❌ Trigger mechanism not built
- ❌ Time delay system not implemented
- ❌ Payment page not created

**When Implemented, Test**:
- [ ] Email 2 sent 1 hour after LOE signature
- [ ] Email contains payment amount (retainer)
- [ ] Email contains "Pay Now" button
- [ ] Payment page accessible
- [ ] Payment instructions clear

### Test Suite 5.4: Payment Processing (❌ NOT Implemented)

**Status**: ❌ **NOT IMPLEMENTED**

**Decision Required**: Stripe vs GoHighLevel (GHL)

**When Implemented, Test**:
- [ ] Payment page loads correctly
- [ ] Payment amount matches retainer from LOE
- [ ] Payment processing works (Stripe or GHL)
- [ ] Payment webhook updates job status
- [ ] Status changes to "paid" or "active"
- [ ] ClickUp status updates (if implemented)

---

## Part 6: Routing and Navigation

### Test Suite 6.1: URL Routing

**Purpose**: Verify bookmarkable URLs and navigation

**Reference**: Existing tests in `tests/job-routing.spec.ts`

#### E2E Test 6.1.1: Job List to Detail Navigation
```typescript
test('Navigate from list to job detail', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Click first job
  const firstJob = page.locator('div[role="button"]:has-text("VAL")').first();
  await firstJob.click();
  
  // Verify URL format
  expect(page.url()).toMatch(/\/dashboard\/job\/[a-f0-9-]+$/);
  
  // Verify job detail view loaded
  await expect(page.locator('h1')).toBeVisible();
});
```

**Expected Results**:
- ✅ URL uses path-based routing (`/dashboard/job/:jobId`)
- ✅ NOT using query params (`?jobId=`)
- ✅ Job detail view loads correctly
- ✅ Back button returns to list

#### E2E Test 6.1.2: Direct URL Access
```typescript
test('Direct URL access to job works', async ({ page }) => {
  // Navigate directly to job URL
  await page.goto('/dashboard/job/{knownJobId}');
  
  // Verify job loads correctly
  await expect(page.locator('[data-testid="job-detail"]')).toBeVisible();
  
  // Verify job data displayed correctly
});
```

**Expected Results**:
- ✅ Can bookmark job URLs
- ✅ Direct URL access works
- ✅ Browser refresh on job URL works
- ✅ Invalid job ID shows 404 or error message

---

## Part 7: Status Transitions and Workflow

### Test Suite 7.1: Job Status Flow

**Purpose**: Verify status transitions through workflow stages

**Status Flow**: `submitted` → `loe_pending` → `loe_sent` → `loe_signed` → `paid` → `active` → `completed`

#### Manual Test 7.1.1: Status Transitions
**Checklist**:
- [ ] Form submission sets status to "submitted"
- [ ] Create Valcre job → Status remains "submitted" (or updates?)
- [ ] Send LOE → Status updates to "loe_sent"
- [ ] Client signs LOE → Status updates to "loe_signed" (via webhook)
- [ ] Mark payment received → Status updates to "paid" (manual or automated)
- [ ] Move to active work → Status updates to "active"
- [ ] Complete job → Status updates to "completed"

#### E2E Test 7.1.2: Workflow Progress Indicator
```typescript
test('Workflow progress shows current stage', async ({ page }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Check WorkflowProgress component
  const progressSteps = page.locator('[data-testid="workflow-step"]');
  
  // Verify correct step is marked as current
  // Verify completed steps show checkmark
  // Verify unavailable steps are disabled
});
```

---

## Part 8: Error Handling and Edge Cases

### Test Suite 8.1: Error Scenarios

#### E2E Test 8.1.1: Network Failure During Save
```typescript
test('Auto-save handles network errors gracefully', async ({ page, context }) => {
  await page.goto('/dashboard/job/{jobId}');
  
  // Simulate network failure
  await context.route('**/rest/v1/**', route => route.abort());
  
  // Edit field
  await page.fill('[name="appraisalFee"]', '5000');
  await page.blur('[name="appraisalFee"]');
  
  // Verify error toast appears
  await expect(page.locator('text=Failed to save')).toBeVisible();
  
  // Verify field retains edited value (not reverted)
});
```

#### Manual Test 8.1.2: Validation Errors
**Checklist**:
- [ ] Submit form with invalid email format → Shows error
- [ ] Enter negative appraisal fee → Shows validation error
- [ ] Enter future delivery date → Validates correctly
- [ ] Required fields empty → Prevents submission
- [ ] Currency fields reject non-numeric → Shows error

---

## Part 9: Integration Testing

### Test Suite 9.1: End-to-End Workflow

**Purpose**: Test complete workflow from submission to completion

#### E2E Test 9.1.1: Complete Job Lifecycle
```typescript
test('Complete job workflow from submission to completion', async ({ page }) => {
  // Step 1: Submit form
  await page.goto('/');
  // ... fill and submit form
  // Capture job ID from success screen
  
  // Step 2: Navigate to dashboard
  await page.goto('/dashboard');
  // Find new job
  
  // Step 3: Open job detail
  // Click on job
  
  // Step 4: Create Valcre job
  // Click "Create Valcre Job" button
  // Verify job number generated
  
  // Step 5: Fill LOE details
  // Enter appraisal fee, retainer, delivery date
  
  // Step 6: Create ClickUp task
  // Click "Create ClickUp Task" button
  
  // Step 7: Send LOE
  // Click "Send LOE" button
  // Verify status updated
  
  // Step 8: Verify all integrations completed
  // Check Valcre has job
  // Check ClickUp has task
  // Check DocuSeal submission created
});
```

---

## Test Execution Schedule

### Phase 1: Critical Path Testing (Week 1)
1. Form submission → Database persistence
2. Auto-save functionality (all sections)
3. Valcre job creation
4. Basic routing and navigation

### Phase 2: Integration Testing (Week 2)
1. ClickUp manual task creation
2. DocuSeal LOE workflow
3. Status transitions
4. End-to-end workflow

### Phase 3: Edge Cases and Polish (Week 3)
1. Error handling
2. Validation edge cases
3. Performance testing
4. Cross-browser compatibility

---

## Success Criteria

All tests pass when:
1. ✅ Form submission creates job correctly
2. ✅ All fields auto-save reliably
3. ✅ Valcre integration creates jobs and syncs fields
4. ✅ ClickUp tasks created with correct format
5. ✅ LOE workflow completes successfully
6. ✅ Routing works for all navigation paths
7. ✅ Status transitions update correctly
8. ✅ Error handling graceful and informative
9. ✅ Performance meets requirements (< 2s page loads)

---

## Missing Features Summary

### Critical (Blocks Payment Workflow)
- ❌ Email 2 (Thank You + Payment Info)
- ❌ Payment processing (Stripe or GHL)
- ❌ Payment webhook handler

### High Priority (Improves Workflow)
- ❌ ClickUp automatic task creation
- ❌ ClickUp status sync automation
- ❌ Time-delayed email triggers

---

**Last Updated**: Based on comprehensive codebase review  
**Status**: Ready for execution  
**Next Steps**: Begin Phase 1 testing

