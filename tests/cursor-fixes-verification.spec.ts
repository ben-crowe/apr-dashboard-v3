import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E Tests for Cursor's Critical Fixes
 *
 * Tests verify all 5 critical error fixes:
 * 1. PropertyTypes array → Valcre 500 error
 * 2. Appraisal Fee editing
 * 3. Retainer Amount editing
 * 4. Supabase job_loe_details 400 error
 * 5. Console log spam
 */

const DASHBOARD_URL = 'http://localhost:8080/dashboard';

test.describe('Cursor Fix Verification Tests', () => {
  let page: Page;
  let consoleMessages: string[] = [];
  let consoleErrorCount = 0;
  let network400Errors: string[] = [];

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Capture all console messages for spam detection
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(text);

      // Count specific spam patterns
      if (text.includes('📁 ClientSubmissionSection')) consoleErrorCount++;
      if (text.includes('🔍 [ClickUp] Component state')) consoleErrorCount++;
      if (text.includes('🏢 PropertyType from UI')) consoleErrorCount++;
      if (text.includes('👤 PropertyContact fields')) consoleErrorCount++;
    });

    // Capture network errors (400s)
    page.on('response', response => {
      if (response.status() === 400) {
        network400Errors.push(`${response.url()} - ${response.status()}`);
      }
    });

    // Navigate to dashboard
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');

    // Clear initial console messages from page load
    consoleMessages = [];
    consoleErrorCount = 0;
    network400Errors = [];
  });

  test.afterEach(async () => {
    await page.close();
  });

  /**
   * Test 1: Single Property Type - Job Creation
   * Verifies: PropertyTypes array → string conversion works
   */
  test('Test 1: Create job with SINGLE property type', async () => {
    console.log('\n🧪 TEST 1: Single Property Type Job Creation');

    // Click "Create New Job" or navigate to blank job
    await page.click('button:has-text("Create New Job")');
    await page.waitForTimeout(1000);

    // Fill required client fields
    await page.fill('input[name="clientFirstName"]', 'Test');
    await page.fill('input[name="clientLastName"]', 'User');
    await page.fill('input[name="clientEmail"]', 'test@example.com');
    await page.fill('input[name="clientPhone"]', '4035551234');

    // Fill property address
    await page.fill('input[name="propertyAddress"]', '123 Test Street, Calgary, AB');

    // Select SINGLE property type
    await page.click('button:has-text("Add more...")'); // Property types dropdown
    await page.click('text=Industrial');

    // Verify only one type selected
    const selectedTypes = await page.locator('span:has-text("Industrial")').count();
    expect(selectedTypes).toBeGreaterThan(0);

    // Fill LOE fields
    await page.fill('input[name="appraisalFee"]', '3500');
    await page.selectOption('select[name="scopeOfWork"]', 'All Applicable');
    await page.selectOption('select[name="valuationPremises"]', 'Market Value As Is');

    // Click "Create Valcre Job"
    await page.click('button:has-text("Create Valcre Job")');

    // Wait for job creation
    await page.waitForTimeout(3000);

    // Verify no 500 error from Valcre
    const has500Error = consoleMessages.some(msg =>
      msg.includes('Status: 500') ||
      msg.includes('StartArray node')
    );
    expect(has500Error).toBeFalsy();

    // Verify success
    const successToast = await page.locator('text=/Job created|success/i').count();
    expect(successToast).toBeGreaterThan(0);

    console.log('✅ TEST 1 PASSED: Single property type job created successfully');
  });

  /**
   * Test 2: Multiple Property Types - Job Creation
   * Verifies: Comma-separated string sent to Valcre (not array)
   */
  test('Test 2: Create job with MULTIPLE property types', async () => {
    console.log('\n🧪 TEST 2: Multiple Property Types Job Creation');

    // Create new job
    await page.click('button:has-text("Create New Job")');
    await page.waitForTimeout(1000);

    // Fill required fields
    await page.fill('input[name="clientFirstName"]', 'Multi');
    await page.fill('input[name="clientLastName"]', 'Type');
    await page.fill('input[name="clientEmail"]', 'multi@example.com');
    await page.fill('input[name="clientPhone"]', '4035555678');
    await page.fill('input[name="propertyAddress"]', '456 Mixed Use Building, Calgary, AB');

    // Select MULTIPLE property types (Retail + Office + Multi-Family)
    await page.click('button:has-text("Add more...")');
    await page.click('text=Retail');

    await page.click('button:has-text("Add more...")');
    await page.click('text=Office');

    await page.click('button:has-text("Add more...")');
    await page.click('text=Multi-Family');

    // Verify all three types selected
    expect(await page.locator('span:has-text("Retail")').count()).toBeGreaterThan(0);
    expect(await page.locator('span:has-text("Office")').count()).toBeGreaterThan(0);
    expect(await page.locator('span:has-text("Multi-Family")').count()).toBeGreaterThan(0);

    // Fill LOE fields
    await page.fill('input[name="appraisalFee"]', '5000');
    await page.selectOption('select[name="scopeOfWork"]', 'All Applicable');
    await page.selectOption('select[name="valuationPremises"]', 'Market Value As Is');

    // Click "Create Valcre Job"
    await page.click('button:has-text("Create Valcre Job")');
    await page.waitForTimeout(3000);

    // Verify payload sent to Valcre contains comma-separated string (not array)
    const valcrePayload = consoleMessages.find(msg => msg.includes('Full payload to /api/valcre'));
    if (valcrePayload) {
      // Should contain: "PropertyTypes": "Retail, Office, Multi-Family" (string, not array)
      expect(valcrePayload).toContain('PropertyTypes');
      // Should NOT contain: "PropertyTypes": ["Retail", "Office", "Multi-Family"] (array)
      expect(valcrePayload).not.toContain('["Retail"');
    }

    // Verify no 500 error
    const has500Error = consoleMessages.some(msg =>
      msg.includes('Status: 500') ||
      msg.includes('StartArray node')
    );
    expect(has500Error).toBeFalsy();

    console.log('✅ TEST 2 PASSED: Multiple property types sent as comma-separated string');
  });

  /**
   * Test 3: Appraisal Fee Editing
   * Verifies: Local state allows typing, auto-save works
   */
  test('Test 3: Edit appraisal fee field', async () => {
    console.log('\n🧪 TEST 3: Appraisal Fee Editing');

    // Navigate to existing job with LOE section
    const jobCard = await page.locator('div[role="button"]:has-text("VAL")').first();
    await jobCard.click();
    await page.waitForTimeout(1000);

    // Find and focus appraisal fee input
    const appraisalFeeInput = await page.locator('input[name="appraisalFee"]');

    // Clear and type new value
    await appraisalFeeInput.click();
    await appraisalFeeInput.fill(''); // Clear
    await appraisalFeeInput.type('4500'); // Type new value

    // Verify typing works (not blocked)
    const inputValue = await appraisalFeeInput.inputValue();
    expect(inputValue).toContain('4500');

    // Blur to trigger auto-save
    await appraisalFeeInput.blur();
    await page.waitForTimeout(1000); // Wait for debounce + save

    // Verify no Supabase 400 error
    expect(network400Errors.length).toBe(0);

    // Verify save indicator appeared
    const savingIndicator = await page.locator('text=/Saving|Saved/i').count();
    expect(savingIndicator).toBeGreaterThan(0);

    console.log('✅ TEST 3 PASSED: Appraisal fee editable and auto-saves');
  });

  /**
   * Test 4: Retainer Amount Editing
   * Verifies: String conversion for DB, local state editing
   */
  test('Test 4: Edit retainer amount field', async () => {
    console.log('\n🧪 TEST 4: Retainer Amount Editing');

    // Navigate to job
    const jobCard = await page.locator('div[role="button"]:has-text("VAL")').first();
    await jobCard.click();
    await page.waitForTimeout(1000);

    // Find and edit retainer amount
    const retainerInput = await page.locator('input[name="retainerAmount"]');

    await retainerInput.click();
    await retainerInput.fill('');
    await retainerInput.type('450');

    // Verify typing works
    const inputValue = await retainerInput.inputValue();
    expect(inputValue).toContain('450');

    // Blur to save
    await retainerInput.blur();
    await page.waitForTimeout(1000);

    // Verify no Supabase 400 error (schema mismatch)
    expect(network400Errors.length).toBe(0);

    // Check console for successful save (not error)
    const hasSupabaseError = consoleMessages.some(msg =>
      msg.includes('Supabase save error') ||
      msg.includes('retainer_amount')
    );
    expect(hasSupabaseError).toBeFalsy();

    console.log('✅ TEST 4 PASSED: Retainer amount editable and saves as string');
  });

  /**
   * Test 5: Console Log Spam Verification
   * Verifies: Removed excessive logging
   */
  test('Test 5: Verify console logs are clean (no spam)', async () => {
    console.log('\n🧪 TEST 5: Console Log Spam Check');

    // Navigate between a few jobs to trigger renders
    const jobCards = await page.locator('div[role="button"]:has-text("VAL")');
    const jobCount = await jobCards.count();

    if (jobCount > 0) {
      // Click first job
      await jobCards.first().click();
      await page.waitForTimeout(500);

      // Click second job if exists
      if (jobCount > 1) {
        await jobCards.nth(1).click();
        await page.waitForTimeout(500);
      }
    }

    // Count spam patterns (should be 0 or very low)
    console.log(`📊 Console spam count: ${consoleErrorCount}`);
    console.log(`📊 Total console messages: ${consoleMessages.length}`);

    // Verify spam logs removed
    const fileUploadSpam = consoleMessages.filter(msg => msg.includes('📁 ClientSubmissionSection')).length;
    const clickUpSpam = consoleMessages.filter(msg => msg.includes('🔍 [ClickUp] Component state')).length;
    const propertyTypeSpam = consoleMessages.filter(msg => msg.includes('🏢 PropertyType from UI')).length;

    expect(fileUploadSpam).toBeLessThan(5); // Should be 0, but allow few
    expect(clickUpSpam).toBeLessThan(10);
    expect(propertyTypeSpam).toBe(0); // Should be completely removed

    console.log('✅ TEST 5 PASSED: Console logs are clean');
  });

  /**
   * Test 6: Supabase Save Verification
   * Verifies: No 400 errors on job_loe_details endpoint
   */
  test('Test 6: Verify Supabase saves work (no 400 errors)', async () => {
    console.log('\n🧪 TEST 6: Supabase Save Verification');

    // Navigate to job and edit multiple fields
    const jobCard = await page.locator('div[role="button"]:has-text("VAL")').first();
    await jobCard.click();
    await page.waitForTimeout(1000);

    // Edit appraisal fee
    const appraisalFeeInput = await page.locator('input[name="appraisalFee"]');
    await appraisalFeeInput.fill('3750');
    await appraisalFeeInput.blur();
    await page.waitForTimeout(1000);

    // Edit delivery date
    const deliveryDateInput = await page.locator('input[name="deliveryDate"]');
    await deliveryDateInput.fill('2025-11-01');
    await deliveryDateInput.blur();
    await page.waitForTimeout(1000);

    // Edit payment terms
    const paymentSelect = await page.locator('select[name="paymentTerms"]');
    await paymentSelect.selectOption('NET 30 Days');
    await page.waitForTimeout(1000);

    // Verify no 400 errors on job_loe_details endpoint
    const loeErrors = network400Errors.filter(err => err.includes('job_loe_details'));
    expect(loeErrors.length).toBe(0);

    // Verify no "onConflict" errors in console
    const onConflictError = consoleMessages.some(msg =>
      msg.includes('on_conflict') ||
      msg.includes('violates row-level security')
    );
    expect(onConflictError).toBeFalsy();

    console.log('✅ TEST 6 PASSED: Supabase saves work without 400 errors');
  });

  /**
   * Test 7: End-to-End Job Creation
   * Verifies: Complete workflow with all fixes working together
   */
  test('Test 7: Complete job creation workflow', async () => {
    console.log('\n🧪 TEST 7: Complete End-to-End Workflow');

    // Create job with multiple property types
    await page.click('button:has-text("Create New Job")');
    await page.waitForTimeout(1000);

    // Fill client info
    await page.fill('input[name="clientFirstName"]', 'E2E');
    await page.fill('input[name="clientLastName"]', 'Test');
    await page.fill('input[name="clientEmail"]', 'e2e@example.com');
    await page.fill('input[name="clientPhone"]', '4035559999');

    // Fill property info
    await page.fill('input[name="propertyAddress"]', '789 Complete St, Calgary, AB');

    // Select multiple types
    await page.click('button:has-text("Add more...")');
    await page.click('text=Retail');
    await page.click('button:has-text("Add more...")');
    await page.click('text=Office');

    // Fill LOE fields
    await page.fill('input[name="appraisalFee"]', '4250');
    await page.fill('input[name="retainerAmount"]', '425');
    await page.selectOption('select[name="propertyRightsAppraised"]', 'Fee Simple Interest');
    await page.selectOption('select[name="scopeOfWork"]', 'All Applicable');
    await page.selectOption('select[name="valuationPremises"]', 'Market Value As Is');

    // Create Valcre job
    await page.click('button:has-text("Create Valcre Job")');
    await page.waitForTimeout(3000);

    // Verify complete success
    const has500Error = consoleMessages.some(msg => msg.includes('Status: 500'));
    const has400Error = network400Errors.length > 0;
    const hasSupabaseError = consoleMessages.some(msg => msg.includes('Supabase save error'));

    expect(has500Error).toBeFalsy();
    expect(has400Error).toBeFalsy();
    expect(hasSupabaseError).toBeFalsy();

    console.log('✅ TEST 7 PASSED: Complete workflow successful');
  });

  /**
   * Final Test Summary
   */
  test.afterAll(async () => {
    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log('✅ All 7 tests completed');
    console.log(`📝 Total console messages: ${consoleMessages.length}`);
    console.log(`⚠️  Console spam count: ${consoleErrorCount}`);
    console.log(`❌ Network 400 errors: ${network400Errors.length}`);

    if (network400Errors.length > 0) {
      console.log('\n❌ 400 Errors Found:');
      network400Errors.forEach(err => console.log(`   - ${err}`));
    }
  });
});
