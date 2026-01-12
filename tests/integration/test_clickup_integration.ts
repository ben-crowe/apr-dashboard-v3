import { chromium } from 'playwright';

async function testClickUpIntegration() {
  console.log('🧪 Testing ClickUp Auto-Creation Integration\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Step 1: Navigate to form');
    await page.goto('https://apr-dashboard-v3.vercel.app/appraisal-request-form', {
      waitUntil: 'networkidle'
    });
    console.log('✅ Page loaded\n');

    await page.waitForTimeout(2000);

    console.log('Step 2: Click "Test Data" button');
    const testDataButton = page.locator('button:has-text("Test Data")');
    await testDataButton.click();
    console.log('✅ Test data filled\n');

    await page.waitForTimeout(1000);

    console.log('Step 3: Submit form');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    console.log('✅ Submit clicked\n');

    console.log('Step 4: Wait for success message');
    await page.waitForTimeout(5000);

    const successMessage = await page.locator('text=/success|submitted/i').first().isVisible({ timeout: 10000 });

    if (successMessage) {
      console.log('✅ Form submitted successfully!\n');
      console.log('Check your ClickUp workspace for the new task.');
      console.log('List URL: https://app.clickup.com/8555561/v/li/901706896375\n');
    } else {
      console.log('⚠️ No success message found\n');
    }

    console.log('Keeping browser open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

testClickUpIntegration();
