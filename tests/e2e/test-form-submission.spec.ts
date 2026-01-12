import { chromium } from 'playwright';

async function testFormSubmission() {
  console.log('🧪 Form Submission Test - Checkbox Removal Verification\n');
  console.log('Production URL: https://apr-dashboard-v3.vercel.app/appraisal-request-form\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track ALL console messages
  const consoleMessages: Array<{type: string, text: string}> = [];
  page.on('console', (msg) => {
    const logEntry = {
      type: msg.type(),
      text: msg.text()
    };
    consoleMessages.push(logEntry);

    // Show all console output in real-time
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // Track network errors
  page.on('requestfailed', request => {
    console.log(`❌ NETWORK FAILED: ${request.url()}`);
    console.log(`   Failure: ${request.failure()?.errorText}`);
  });

  // Track page errors
  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('Step 1: Navigate to form');
    console.log('═══════════════════════════════════════════════════════\n');

    await page.goto('https://apr-dashboard-v3.vercel.app/appraisal-request-form', {
      waitUntil: 'networkidle'
    });
    console.log('✅ Page loaded\n');

    await page.waitForTimeout(2000);

    console.log('═══════════════════════════════════════════════════════');
    console.log('Step 2: Verify checkbox is removed');
    console.log('═══════════════════════════════════════════════════════\n');

    const checkboxExists = await page.locator('text=Same as Client Contact').count() > 0;
    console.log(checkboxExists ? '❌ FAILED: Checkbox still exists!' : '✅ PASSED: Checkbox removed');

    const newHeading = await page.locator('text=Optional Property Contact').count() > 0;
    console.log(newHeading ? '✅ PASSED: New heading found' : '❌ FAILED: New heading missing');

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Step 3: Fill out form with test data');
    console.log('═══════════════════════════════════════════════════════\n');

    // Fill client information
    await page.fill('input[name="clientFirstName"]', 'Test');
    await page.fill('input[name="clientLastName"]', 'User');
    await page.fill('input[name="clientPhone"]', '(403) 555-1234');
    await page.fill('input[name="clientEmail"]', 'test@example.com');
    console.log('✅ Client info filled');

    // Fill property information
    await page.fill('input[name="propertyName"]', 'Test Property Auto-Creation');
    await page.fill('input[name="propertyAddress"]', '123 Test St, Calgary, AB');

    // Select property type
    await page.click('[id="propertyType"]');
    await page.waitForTimeout(500);
    await page.click('text=Office');
    console.log('✅ Property info filled');

    // Leave property contact BLANK (testing default behavior)
    console.log('✅ Property contact left blank (testing default)');

    await page.waitForTimeout(1000);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Step 4: Submit form');
    console.log('═══════════════════════════════════════════════════════\n');

    // Clear console messages to focus on submission errors
    consoleMessages.length = 0;

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    console.log('✅ Submit button clicked');

    // Wait for either success or error
    await page.waitForTimeout(5000);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Step 5: Check for success or error');
    console.log('═══════════════════════════════════════════════════════\n');

    const successMessage = await page.locator('text=/.*success.*/i').count() > 0;
    const errorMessage = await page.locator('text=/.*error.*/i').count() > 0;

    if (successMessage) {
      console.log('✅ SUCCESS: Form submitted successfully');
    } else if (errorMessage) {
      console.log('❌ ERROR: Form submission failed');
      const errorText = await page.locator('text=/.*error.*/i').first().textContent();
      console.log(`   Error message: ${errorText}`);
    } else {
      console.log('⚠️ UNKNOWN: No success or error message found');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Console Log Analysis (Since Submit)');
    console.log('═══════════════════════════════════════════════════════\n');

    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');
    const logs = consoleMessages.filter(m => m.text.includes('Form Data') || m.text.includes('Job saved') || m.text.includes('Error'));

    console.log('🔴 ERRORS:');
    if (errors.length > 0) {
      errors.forEach(e => console.log(`   ${e.text}`));
    } else {
      console.log('   None');
    }

    console.log('\n⚠️  WARNINGS:');
    if (warnings.length > 0) {
      warnings.forEach(w => console.log(`   ${w.text}`));
    } else {
      console.log('   None');
    }

    console.log('\n📋 RELEVANT LOGS:');
    if (logs.length > 0) {
      logs.forEach(l => console.log(`   ${l.text}`));
    } else {
      console.log('   None');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Test Complete - Browser will remain open');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('Keeping browser open for 60 seconds for inspection...');
    await page.waitForTimeout(60000);

  } catch (error) {
    console.error('\n❌ Test Error:', error);
  } finally {
    await browser.close();
  }
}

testFormSubmission();
