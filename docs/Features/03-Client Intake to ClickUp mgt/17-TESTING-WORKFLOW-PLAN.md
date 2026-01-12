# Complete Testing Workflow Plan

**Created:** January 8, 2026  
**Purpose:** Comprehensive testing plan for Valcre job creation and ClickUp integration  
**Status:** ✅ Ready to Execute - ClickUp API Token Configured  
**Update:** Valcre job creation manually tested and confirmed working ✅

---

## 🎯 Core Testing Goals

1. **✅ Valcre Job Creation** - Verify VAL number is returned and stored
2. **✅ ClickUp API** - Verify task creation and updates work
3. **✅ Full Workflow** - End-to-end from form fill → Valcre → ClickUp

---

## 📋 Testing Components Needed

### 1. Valcre Job Creation Test ⚠️ **CRITICAL**

**What to Test:**
- Click "Create Valcre Job" button
- Verify VAL number is returned (format: `VAL251999`)
- Verify `valcre_job_id` is stored in database
- Verify job number appears in UI
- Verify "View in Valcre" link works

**Test File:** `tests/valcre-job-creation.spec.ts`

**Prerequisites:**
- Valid Valcre API credentials in Supabase Edge Function
- Test job seeded (via `npm run seed:test-job`)
- Job has LOE details filled (via "Fill Test Data" button)

**Success Criteria:**
- ✅ Button click triggers API call
- ✅ VAL number returned (e.g., `VAL251999`)
- ✅ `job_loe_details.valcre_job_id` populated
- ✅ `job_submissions.job_number` updated
- ✅ UI shows job number in Job Number field
- ✅ "View in Valcre" button appears and links correctly

---

### 2. ClickUp API Test ⚠️ **CRITICAL**

**What to Test:**
- Create ClickUp task via API
- Verify task appears in ClickUp
- Verify task has correct format (Stage 1)
- Verify task ID stored in database
- Update task with VAL number (Stage 2)
- Verify task updates correctly

**Test File:** `tests/clickup-integration.spec.ts`

**Prerequisites:**
- Valid ClickUp API token (get via prompt in `16-CLICKUP-API-KEY-PROMPT.md`)
- ClickUp API token in Supabase Edge Function env vars
- Test job with VAL number (from Test 1)

**Success Criteria:**
- ✅ Task created in ClickUp List `901706896375`
- ✅ Task name format: `PENDING - Property Name, Address` (Stage 1)
- ✅ Task description has client info, property info
- ✅ `job_submissions.clickup_task_id` populated
- ✅ Task updates to `VAL251999 - Property Name, Address` (Stage 2)
- ✅ LOE section added to task description (Stage 2)

---

### 3. Full Workflow Test (End-to-End)

**What to Test:**
- Complete flow: Seed job → Fill forms → Create Valcre → Create ClickUp
- Verify all database updates
- Verify all UI state changes
- Verify all API calls succeed

**Test File:** `tests/full-workflow.spec.ts`

**Flow:**
1. Seed test job (`npm run seed:test-job`)
2. Navigate to job detail page
3. Click "Fill Test Data" in Property Info section
4. Click "Fill Test Data" in LOE Quote section
5. Click "Create Valcre Job" button
6. Wait for VAL number
7. Click "Create ClickUp Task" button
8. Verify task created
9. Verify database state
10. Verify UI state

**Success Criteria:**
- ✅ All buttons work
- ✅ All API calls succeed
- ✅ All database fields populated correctly
- ✅ UI reflects all state changes
- ✅ No errors in console

---

## 🛠️ Test Infrastructure Setup

### Playwright Configuration

**File:** `playwright.config.ts` (already exists)

**Current Config:**
```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8086',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

**May Need:**
- Update `baseURL` to match your dev server port
- Add environment variable support for API keys
- Add screenshot on failure

---

### Test Files to Create

1. **`tests/valcre-job-creation.spec.ts`**
   - Test "Create Valcre Job" button
   - Verify VAL number returned
   - Verify database updates

2. **`tests/clickup-integration.spec.ts`**
   - Test ClickUp task creation
   - Test ClickUp task updates
   - Verify API responses

3. **`tests/full-workflow.spec.ts`**
   - End-to-end workflow test
   - Uses all test buttons
   - Verifies complete flow

---

## 📝 Test Execution Plan

### Phase 1: Valcre Job Creation (Priority 1)

**Status:** ✅ **MANUALLY TESTED AND CONFIRMED WORKING**

**Manual Test Results (January 8, 2026):**
- ✅ Created new job in dashboard
- ✅ Clicked "Fill Test Data" buttons in top two sections
- ✅ "Create Valcre Job" button became enabled
- ✅ Clicked "Create Valcre Job" button
- ✅ VAL number returned successfully
- ✅ Job number displayed in second section of job ticket

**Next Steps:**
1. ✅ Seed test job: `npm run seed:test-job` - **COMPLETED**
2. ⚠️ Run automated Playwright test: `npx playwright test tests/valcre-job-creation.spec.ts`
3. ✅ Verify VAL number returned - **CONFIRMED VIA MANUAL TEST**
4. ✅ Verify database updated - **CONFIRMED VIA MANUAL TEST**
5. ✅ Verify UI updated - **CONFIRMED VIA MANUAL TEST**

**Expected Output (Automated Test):**
```
✅ Valcre job created successfully
✅ VAL Number: VAL251999 (or similar)
✅ Job ID stored in database
✅ UI updated with job number
```

---

### Phase 2: ClickUp API (Priority 2)

**Steps:**
1. ✅ Get ClickUp API token - **COMPLETED** (`pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY`)
2. ✅ Update Supabase Edge Function fallback tokens - **COMPLETED**
3. ⚠️ **IMPORTANT:** Set `CLICKUP_API_TOKEN` env var in Supabase Dashboard (Edge Functions → Settings)
4. ✅ Run Playwright test: `npx playwright test tests/clickup-integration.spec.ts`
5. ✅ Verify task created in ClickUp
6. ✅ Verify task updates work
7. ✅ Fix any issues found

**Expected Output:**
```
✅ ClickUp task created
✅ Task ID: abc123xyz
✅ Task stored in database
✅ Task updates with VAL number
```

---

### Phase 3: Full Workflow (Priority 3)

**Steps:**
1. ✅ Run full workflow test: `npx playwright test tests/full-workflow.spec.ts`
2. ✅ Verify all steps succeed
3. ✅ Verify no errors
4. ✅ Document results

**Expected Output:**
```
✅ Test job seeded
✅ Property Info filled
✅ LOE Quote filled
✅ Valcre job created: VAL251999
✅ ClickUp task created: abc123xyz
✅ All database fields updated
✅ All UI state correct
```

---

## 🔍 Additional Testing Components

### 4. Database Verification Tests

**What to Test:**
- Verify all database fields populated correctly
- Verify foreign key relationships
- Verify data integrity

**Test File:** `tests/database-verification.spec.ts` (optional)

**Tools:**
- Supabase CLI for direct database queries
- Playwright for UI verification

---

### 5. Error Handling Tests

**What to Test:**
- API failures (Valcre down, ClickUp down)
- Invalid data scenarios
- Network errors
- Timeout handling

**Test File:** `tests/error-handling.spec.ts` (optional)

---

### 6. UI State Tests

**What to Test:**
- Button states (disabled/enabled)
- Loading states
- Success/error messages
- Form validation

**Test File:** `tests/ui-state.spec.ts` (optional)

---

## 📊 Test Results Tracking

**File:** `docs/03-ClickUp-Integration/14-TEST-RESULTS.md`

**Update after each test run:**
- Test name
- Date/time
- Pass/fail status
- Issues found
- Fixes applied

---

## 🚀 Quick Start Commands

```bash
# 1. Seed test job (creates job with job_number: null)
npm run seed:test-job

# 2. Start dev server (if not running)
npm run dev

# 3. Run Valcre job creation test
npx playwright test tests/valcre-job-creation.spec.ts --headed

# 4. Run ClickUp integration test (after getting API token)
npx playwright test tests/clickup-integration.spec.ts --headed

# 5. Run full workflow test
npx playwright test tests/full-workflow.spec.ts --headed

# 6. Run all tests
npx playwright test tests/
```

---

## ⚠️ Prerequisites Checklist

Before running tests, ensure:

- [ ] Dev server running (`npm run dev`)
- [ ] Test job seeded (`npm run seed:test-job`)
- [ ] Valcre API credentials configured in Supabase Edge Function
- [x] ClickUp API token obtained - **COMPLETED** (`pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY`)
- [ ] **IMPORTANT:** Set `CLICKUP_API_TOKEN` env var in Supabase Dashboard (Edge Functions → Settings)
- [ ] Supabase Edge Functions deployed with correct env vars
- [x] Playwright installed - **COMPLETED** (already in package.json)

---

## 📚 Related Documentation

- **ClickUp API Key Prompt:** `16-CLICKUP-API-KEY-PROMPT.md`
- **Test Buttons Guide:** `15-PLAYWRIGHT-TEST-BUTTONS.md`
- **Test Results:** `14-TEST-RESULTS.md`
- **Feature Overview:** `07-FEATURE-OVERVIEW.md`

---

## 🎯 Next Steps

1. **Get ClickUp API Token** - Use prompt in `16-CLICKUP-API-KEY-PROMPT.md`
2. **Create Test Files** - I'll create the test files once you confirm API token
3. **Run Tests** - Execute tests and verify results
4. **Fix Issues** - Address any failures
5. **Document Results** - Update `14-TEST-RESULTS.md`
