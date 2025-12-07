import { chromium } from 'playwright';

async function testAssetConditionAutoSave() {
  console.log('🧪 Starting Asset Condition Auto-Save Test\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.text().includes('Syncing assetCondition')) {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    }
  });

  try {
    console.log('Step 1: Navigating to dashboard...');
    await page.goto('https://apr-dashboard-v3.vercel.app/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✅ Dashboard loaded\n');

    console.log('Step 1b: Looking for job VAL251014 (709207)...');
    // Wait for jobs table to load
    await page.waitForSelector('table', { timeout: 15000 });

    // Look for VAL251014 in the table and click it
    const jobRow = page.locator('tr:has-text("VAL251014")');
    if (await jobRow.count() > 0) {
      console.log('✅ Found job VAL251014, clicking...');
      await jobRow.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️ Job VAL251014 not found in table, trying to search...');
      // Try searching for it
      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('VAL251014');
      await page.waitForTimeout(1000);
      await page.locator('tr:has-text("VAL251014")').click();
      await page.waitForTimeout(2000);
    }
    console.log('✅ Job opened\n');

    console.log('Step 2: Finding Asset Condition dropdown...');
    await page.waitForSelector('text=Asset Condition', { timeout: 10000 });

    // Find the Asset Condition dropdown - it should be a select element
    const dropdown = page.locator('select').filter({ has: page.locator('option[value="Excellent"]') }).first();

    console.log('Step 3: Checking current value...');
    const currentValue = await dropdown.inputValue();
    console.log(`Current value: ${currentValue}\n`);

    console.log('Step 4: Changing value to "Excellent"...');
    await dropdown.selectOption('Excellent');
    console.log('✅ Value changed to Excellent\n');

    console.log('Step 5: Waiting for toast notification...');
    await page.waitForTimeout(1000); // Wait for toast
    const toast = await page.locator('text=Asset Condition saved').isVisible().catch(() => false);
    console.log(toast ? '✅ Toast notification appeared' : '❌ Toast notification NOT found\n');

    console.log('Step 6: Waiting 3 seconds for auto-save...');
    await page.waitForTimeout(3000);
    console.log('✅ Wait complete\n');

    console.log('Step 7: Refreshing page...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    console.log('✅ Page refreshed\n');

    console.log('Step 8: Verifying "Excellent" persists...');
    await page.waitForSelector('text=Asset Condition', { timeout: 10000 });
    const dropdownAfterRefresh = page.locator('select').filter({ has: page.locator('option[value="Excellent"]') }).first();
    const valueAfterRefresh = await dropdownAfterRefresh.inputValue();

    if (valueAfterRefresh === 'Excellent') {
      console.log('✅ Value persisted: Excellent\n');
    } else {
      console.log(`❌ Value did NOT persist. Current value: ${valueAfterRefresh}\n`);
    }

    console.log('Test completed successfully');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testAssetConditionAutoSave();
