import { chromium } from 'playwright';

async function runFinalTests() {
  console.log('🧪 APR Dashboard V3 - Final Two Tests\n');
  console.log('Production URL: https://apr-dashboard-v3.vercel.app');
  console.log('Test Job: VAL251014 (ID: 709207)\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track console messages
  const consoleMessages: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    consoleMessages.push(`[${msg.type()}] ${text}`);

    // Show important messages immediately
    if (text.includes('Syncing') || text.includes('saved') || msg.type() === 'error') {
      console.log(`  [Console] ${msg.type()}: ${text}`);
    }
  });

  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔐 MANUAL STEP: Login Required');
    console.log('═══════════════════════════════════════════════════════\n');

    await page.goto('https://apr-dashboard-v3.vercel.app/dashboard');
    console.log('Browser opened. Please log in manually.');
    console.log('Waiting 30 seconds for you to log in...\n');

    await page.waitForTimeout(30000);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('TEST 1: Asset Condition Auto-Save');
    console.log('═══════════════════════════════════════════════════════\n');

    // Wait for dashboard to be ready
    await page.waitForTimeout(2000);

    console.log('Step 1: Finding job VAL251014...');
    // Try to find and click the job
    const jobExists = await page.locator('text=VAL251014').count() > 0;

    if (jobExists) {
      console.log('✅ Found VAL251014, clicking...');
      await page.locator('text=VAL251014').first().click();
      await page.waitForTimeout(3000);
    } else {
      console.log('⚠️ Please manually select job VAL251014');
      console.log('Waiting 15 seconds...');
      await page.waitForTimeout(15000);
    }

    console.log('\nStep 2: Looking for Asset Condition dropdown...');
    const assetConditionExists = await page.locator('text=Asset Condition').count() > 0;

    if (!assetConditionExists) {
      console.log('❌ Asset Condition field not found');
      console.log('Please ensure you are viewing job details for VAL251014');
      console.log('Pausing for 30 seconds for manual navigation...');
      await page.waitForTimeout(30000);
    }

    // Find the dropdown
    const dropdown = page.locator('select').filter({
      has: page.locator('option[value="Excellent"]')
    }).or(page.locator('select[name*="asset"]')).first();

    console.log('\nStep 3: Getting current Asset Condition value...');
    const currentValue = await dropdown.inputValue().catch(() => 'Not found');
    console.log(`Current value: ${currentValue}`);

    console.log('\nStep 4: Changing Asset Condition to "Excellent"...');
    await dropdown.selectOption('Excellent');
    console.log('✅ Value changed');

    console.log('\nStep 5: Waiting for toast notification...');
    await page.waitForTimeout(2000);

    const toastVisible = await page.locator('text=/.*Asset Condition.*saved.*/i').isVisible().catch(() => false);
    console.log(toastVisible ? '✅ Toast notification appeared' : '⚠️ Toast notification not detected');

    console.log('\nStep 6: Waiting 3 seconds for auto-save to complete...');
    await page.waitForTimeout(3000);

    console.log('\nStep 7: Refreshing page...');
    await page.reload();
    await page.waitForTimeout(3000);

    console.log('\nStep 8: Verifying persistence...');
    const dropdownAfter = page.locator('select').filter({
      has: page.locator('option[value="Excellent"]')
    }).or(page.locator('select[name*="asset"]')).first();

    const valueAfter = await dropdownAfter.inputValue().catch(() => 'Not found');

    if (valueAfter === 'Excellent') {
      console.log('✅ SUCCESS: Value persisted as "Excellent"');
    } else {
      console.log(`❌ FAILED: Value is "${valueAfter}" (expected "Excellent")`);
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('TEST 2: Comments Mapping Verification');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('Step 1: Finding Client Comments field...');
    const clientCommentsField = page.locator('textarea[placeholder*="client" i], textarea[name="notes"]').first();

    if (await clientCommentsField.count() > 0) {
      console.log('✅ Found Client Comments field');
      await clientCommentsField.clear();
      await clientCommentsField.fill('Test client comments mapping - ' + Date.now());
      console.log('✅ Entered test client comments');

      await page.waitForTimeout(2000);
      const clientToast = await page.locator('text=/.*saved.*/i').isVisible().catch(() => false);
      console.log(clientToast ? '✅ Client comments auto-save toast appeared' : '⚠️ No toast detected');
    } else {
      console.log('⚠️ Client Comments field not found - may need to scroll');
    }

    console.log('\nStep 2: Finding Appraiser Comments field (LOE section)...');
    await page.waitForTimeout(1000);

    // Try to find appraiser comments in LOE section
    const appraiserCommentsField = page.locator('textarea[placeholder*="appraiser" i], textarea[name="appraiserComments"]').first();

    if (await appraiserCommentsField.count() > 0) {
      console.log('✅ Found Appraiser Comments field');
      await appraiserCommentsField.clear();
      await appraiserCommentsField.fill('Test appraiser internal comments - ' + Date.now());
      console.log('✅ Entered test appraiser comments');

      await page.waitForTimeout(2000);
      const appraiserToast = await page.locator('text=/.*saved.*/i').isVisible().catch(() => false);
      console.log(appraiserToast ? '✅ Appraiser comments auto-save toast appeared' : '⚠️ No toast detected');
    } else {
      console.log('⚠️ Appraiser Comments field not found - may be in different section');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Console Log Analysis');
    console.log('═══════════════════════════════════════════════════════\n');

    // Filter important console messages
    const syncMessages = consoleMessages.filter(m => m.includes('Syncing'));
    const errorMessages = consoleMessages.filter(m => m.includes('[error]'));

    console.log('Sync Messages:');
    if (syncMessages.length > 0) {
      syncMessages.forEach(m => console.log(`  ${m}`));
    } else {
      console.log('  None detected');
    }

    console.log('\nError Messages:');
    if (errorMessages.length > 0) {
      errorMessages.forEach(m => console.log(`  ${m}`));
    } else {
      console.log('  ✅ No errors');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Tests Complete - Browser will remain open for inspection');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('⚠️ IMPORTANT: For Test 2 verification, you must manually:');
    console.log('1. Open Valcre dashboard');
    console.log('2. Find job VAL251014 (Valcre ID: 709207)');
    console.log('3. Verify Client Comments appear in correct field');
    console.log('4. Verify Appraiser Comments appear in separate field');
    console.log('5. Confirm no data mixing between fields\n');

    console.log('Press Ctrl+C to close browser and exit');
    await page.waitForTimeout(300000); // Wait 5 minutes

  } catch (error) {
    console.error('\n❌ Test Error:', error);
  } finally {
    await browser.close();
  }
}

runFinalTests();
