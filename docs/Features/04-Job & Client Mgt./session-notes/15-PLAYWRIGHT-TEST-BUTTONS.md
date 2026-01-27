# Playwright Testing Guide - Dashboard Test Buttons

**Created:** January 8, 2026  
**Purpose:** Guide for using Dashboard UI test buttons with Playwright for end-to-end testing  
**Status:** ✅ Ready for Use

---

## ⚠️ IMPORTANT: Dashboard vs Report Builder

**This document is ONLY about the JOB DASHBOARD test buttons.**

- **Dashboard** (`/dashboard/job/:id`) - Job management interface with "Fill Test Data" buttons
- **Report Builder** (`/report-builder` or `/mock-builder`) - Separate app with "Load Test Data" buttons
- **These are DIFFERENT systems** - Do not confuse them!

---

## 🎯 Overview

The **Job Dashboard** has **built-in "Fill Test Data" buttons** in multiple sections that can be used with Playwright for comprehensive testing. 

**Key Principle:** Use Playwright to **CLICK THE BUTTONS** (not fill fields directly). If buttons don't work in Playwright, they won't work for users either - so test via buttons.

Instead of creating seed scripts that directly populate database fields, use Playwright to click these buttons and test the full user workflow.

---

## 🔘 Dashboard Test Buttons (Job Dashboard Only)

### 1. **Fill Test Data** Buttons (Dashboard Sections)

**Location:** Multiple sections throughout the **Job Dashboard** detail view (`/dashboard/job/:id`)  
**Purpose:** Pre-fill form fields with realistic test data in the dashboard  
**Visibility:** Only shown in development mode (`localhost` or `10.0.0.238`)  
**Component Path:** `src/components/dashboard/job-details/`

**⚠️ NOT to be confused with Report Builder's "Load Test Data" buttons** (which are in `src/features/report-builder/`)

#### Sections with "Fill Test Data" buttons:

| Section | Component File | Button Location |
|---------|---------------|-----------------|
| **Property Info** | `PropertyInfoSection.tsx` | Top-right of Property Site section |
| **LOE Quote** | `LoeQuoteSection.tsx` | Top-right of LOE Quote section |
| **Organizing Docs** | `OrganizingDocsSection.tsx` | Top-right of Organizing Docs section |
| **Client Submission** | `ClientSubmissionSection.tsx` | Top-right of Client Submission section |

**Playwright Selector Pattern:**
```typescript
// Generic pattern - button text "Fill Test Data"
await page.click('button:has-text("Fill Test Data")');

// Or more specific by section:
// Property Info section
await page.click('[data-section="property-info"] button:has-text("Fill Test Data")');

// LOE Quote section  
await page.click('[data-section="loe-quote"] button:has-text("Fill Test Data")');
```

**What it does:**
- Fills all form fields in that **Dashboard section** with realistic test data
- Updates form state via `onUpdateDetails` callback
- Does NOT create database records (auto-save happens separately)
- Does NOT create Valcre jobs
- Only populates the form UI for testing

**Playwright Testing Approach:**
```typescript
// ✅ CORRECT: Click the button, let it fill fields
await page.click('button:has-text("Fill Test Data")');
await page.waitForTimeout(500); // Wait for form to populate

// ❌ WRONG: Don't fill fields directly - test the button instead
// await page.fill('#appraisal_fee', '3500'); // This bypasses the button!
```

---

### 2. **Create Valcre Job** Button

**Location:** LOE Quote Section (`LoeQuoteSection.tsx`, line ~798)  
**Purpose:** Creates an actual Valcre job via API and returns job number  
**Visibility:** Only shown when job is ready (has required LOE fields filled)

**Button Text:**
- Default: `"Create Valcre Job"`
- Loading: `"Creating..."`
- After creation: Transforms to `"View in Valcre"` link

**Playwright Selector:**
```typescript
// Find by button text
await page.click('button:has-text("Create Valcre Job")');

// Or by data attribute (if added)
await page.click('[data-action="create-valcre-job"]');

// Wait for button to appear (it's conditional)
await page.waitForSelector('button:has-text("Create Valcre Job")', { timeout: 10000 });
```

**What it does:**
1. Validates required LOE fields are filled
2. Calls Supabase Edge Function `create-valcre-job`
3. Creates job in Valcre API
4. Returns VAL job number (e.g., `VAL251999`)
5. Updates `job_submissions.job_number` and `job_loe_details.valcre_job_id`
6. Updates ClickUp task (if exists) with VAL number
7. Transforms button to "View in Valcre" link

**Prerequisites:**
- Job must have LOE details filled (appraisal fee, scope of work, etc.)
- Property info should be filled (for Valcre property creation)
- Client info should be filled (for Valcre client creation)

**Expected Flow:**
```typescript
// 1. Fill test data first
await page.click('button:has-text("Fill Test Data")'); // In LOE section
await page.waitForTimeout(500); // Wait for form to populate

// 2. Create Valcre job
await page.click('button:has-text("Create Valcre Job")');

// 3. Wait for success toast/button transformation
await page.waitForSelector('button:has-text("View in Valcre")', { timeout: 30000 });

// 4. Verify job number appears
const jobNumber = await page.textContent('[data-field="job-number"]');
expect(jobNumber).toMatch(/^VAL\d+$/);
```

---

### 3. **Create ClickUp Task** Button

**Location:** Job Number Field (`JobNumberField.tsx`, via `ClickUpAction.tsx`)  
**Purpose:** Creates ClickUp task manually (Phase 1 workflow)  
**Visibility:** Only shown when Valcre job number exists

**Button Text:**
- Default: `"Create ClickUp Task"`
- After creation: Shows checkmark + `"Task created"`

**Playwright Selector:**
```typescript
// Find ClickUp action button
await page.click('button:has-text("Create ClickUp Task")');

// Or via component
await page.click('[data-action="create-clickup-task"]');
```

**What it does:**
1. Calls Supabase Edge Function `create-clickup-task`
2. Creates task in ClickUp with Stage 1 format
3. Stores `clickup_task_id` in `job_submissions`
4. Updates UI to show task link

**Prerequisites:**
- Must have Valcre job number (VAL number)
- ClickUp API token must be valid

---

## 🧪 Playwright Test Example

### Complete Dashboard Workflow Test (Using Buttons Only)

**Key Principle:** Click buttons, don't fill fields directly. If buttons don't work, users can't use them either.

```typescript
import { test, expect } from '@playwright/test';

test('Complete dashboard job creation workflow via buttons', async ({ page }) => {
  // Navigate to job detail page (use seed script to create job, but NO job_number)
  await page.goto('/dashboard/job/test-job-report-builder-001');
  
  // Step 1: Click "Fill Test Data" button in Property Info section
  // ✅ CORRECT: Click button, let it fill fields
  const propertySection = page.locator('section:has-text("Property Site")');
  await propertySection.locator('button:has-text("Fill Test Data")').click();
  await page.waitForTimeout(500); // Wait for form to populate
  
  // Verify fields were filled (test that button worked)
  const zoningField = propertySection.locator('input[name="zoningClassification"]');
  await expect(zoningField).not.toHaveValue('');
  
  // Step 2: Click "Fill Test Data" button in LOE Quote section
  const loeSection = page.locator('section:has-text("LOE Quote")');
  await loeSection.locator('button:has-text("Fill Test Data")').click();
  await page.waitForTimeout(500);
  
  // Verify LOE fields were filled
  const feeField = loeSection.locator('input[name="appraisal_fee"]');
  await expect(feeField).not.toHaveValue('');
  
  // Step 3: Click "Create Valcre Job" button (requires filled LOE fields)
  // ✅ CORRECT: Click button, let it create job via API
  await loeSection.locator('button:has-text("Create Valcre Job")').click();
  
  // Wait for job creation (check for success toast or button transformation)
  await page.waitForSelector('button:has-text("View in Valcre")', { timeout: 30000 });
  
  // Step 4: Verify job number appears (created by button, not hardcoded)
  const jobNumberField = page.locator('input[name="jobNumber"]');
  const jobNumber = await jobNumberField.inputValue();
  expect(jobNumber).toMatch(/^VAL\d+$/); // Real Valcre job number
  
  // Step 5: Click "Create ClickUp Task" button
  await page.click('button:has-text("Create ClickUp Task")');
  await page.waitForSelector('text=Task created', { timeout: 10000 });
  
  // Step 6: Verify ClickUp task ID stored
  const clickupStatus = page.locator('text=Task created');
  await expect(clickupStatus).toBeVisible();
});
```

### ❌ What NOT to Do

```typescript
// ❌ WRONG: Don't fill fields directly - bypasses button testing
await page.fill('input[name="appraisal_fee"]', '3500');
await page.fill('input[name="scope_of_work"]', 'Full appraisal');

// ✅ CORRECT: Click button, test that button works
await page.click('button:has-text("Fill Test Data")');
```

---

## 📋 Testing Strategy

### Using Seed Script vs. Test Buttons

| Approach | Use Case | Pros | Cons |
|----------|----------|------|------|
| **Seed Script** (`npm run seed:test-job`) | Quick database setup for unit tests | Fast, predictable data, creates job record | Doesn't test UI flow, sets `job_number: null` (correct!) |
| **Playwright + Dashboard Buttons** | End-to-end workflow testing | Tests real user flow, validates buttons work | Slower, requires browser |

**Recommended Flow:**
1. **Seed script** creates job with `job_number: null` (no hardcoded values)
2. **Playwright** clicks "Fill Test Data" buttons to populate forms
3. **Playwright** clicks "Create Valcre Job" button to get real job number
4. **Playwright** clicks "Create ClickUp Task" button to test integration

**Key Principle:** If buttons don't work in Playwright, they won't work for users. Test via buttons, not direct field manipulation.

### Recommended Testing Strategy

1. **Unit Tests:** Use seed script for fast database setup
2. **Integration Tests:** Use Playwright with test buttons for full workflow
3. **Manual Testing:** Use test buttons directly in browser

---

## 🔍 Finding Dashboard Test Buttons in Code

### Component Locations (Dashboard Only)

```bash
# Search for Dashboard Fill Test Data buttons
grep -r "Fill Test Data" src/components/dashboard/job-details/

# Search for Create Valcre Job button (Dashboard)
grep -r "Create Valcre Job" src/components/dashboard/job-details/

# Search for test data functions (Dashboard)
grep -r "fillTestData" src/components/dashboard/job-details/
```

### Key Dashboard Files

- **Dashboard Test Data Functions:** `src/components/dashboard/job-details/*Section.tsx` (each has `fillTestData()`)
- **Valcre Job Creation:** `src/components/dashboard/job-details/LoeQuoteSection.tsx` (line ~128, `handleCreateValcreJob`)
- **ClickUp Task Creation:** `src/components/dashboard/job-details/actions/ClickUpAction.tsx`

### ⚠️ Separate: Report Builder Files (NOT Dashboard)

- **Report Builder Test Data:** `src/features/report-builder/store/reportBuilderStore.ts` (`loadFullTestData`, `loadDataSet1User`)
- **Report Builder UI:** `src/features/report-builder/components/EditPanel/EditPanel.tsx` ("Load Test Data" button)
- **Report Builder Test Dashboard:** `src/features/test-input/TestInputDashboard.tsx` ("Load Data" button)

**These are DIFFERENT systems - don't mix them up!**

---

## ⚠️ Important Notes

1. **Dashboard test buttons only show in development mode** - Check component files for visibility logic (`localhost` or `10.0.0.238`)
2. **"Create Valcre Job" requires real API credentials** - Uses Valcre API, not mocked
3. **Job numbers are NEVER hardcoded** - Always created via "Create Valcre Job" button
4. **Seed script updated** - `scripts/seed-test-job.ts` now sets `job_number: null` (no hardcoded values)
5. **Dashboard vs Report Builder are SEPARATE** - Dashboard buttons are in `src/components/dashboard/`, Report Builder buttons are in `src/features/report-builder/`
6. **Test via buttons, not direct field manipulation** - If buttons don't work in Playwright, they won't work for users

---

## 🚀 Next Steps

1. **Create Playwright test suite** using these button selectors
2. **Add data attributes** to buttons for easier Playwright targeting
3. **Document button states** (disabled, loading, success) for better test reliability
4. **Add test IDs** to form fields for more reliable selectors

---

## 📚 Related Documentation

- **ClickUp Integration Testing:** `docs/03-ClickUp-Integration/14-TEST-RESULTS.md`
- **Valcre Integration:** `docs/03-ClickUp-Integration/07-FEATURE-OVERVIEW.md`
- **Seed Script:** `scripts/seed-test-job.ts`
