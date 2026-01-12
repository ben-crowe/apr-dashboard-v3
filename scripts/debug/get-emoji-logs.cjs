/**
 * Automated Emoji Log Capture - PropertyType & PropertyContact
 * Fills in Albert Peterson as PropertyContact, saves, captures ONLY the 3 emoji logs we need
 */

const { chromium } = require('playwright');

async function getEmojiLogs() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const targetLogs = {
    propertyType: null,
    propertyContact: null,
    fullPayload: null
  };

  page.on('console', msg => {
    const text = msg.text();

    // Capture ONLY the 3 logs we need
    if (text.includes('🏢 PropertyType from UI:')) {
      targetLogs.propertyType = text;
      console.log('\n' + text);
    }
    if (text.includes('👤 PropertyContact fields:')) {
      targetLogs.propertyContact = text;
      console.log(text);
    }
    if (text.includes('📤 Full payload to /api/valcre:')) {
      targetLogs.fullPayload = text;
      console.log(text + '\n');
    }
  });

  try {
    console.log('🎯 Starting automated emoji log capture...\n');

    // Navigate to dashboard
    await page.goto('http://localhost:8080/dashboard');
    await page.waitForTimeout(3000);

    // Open the first job
    console.log('Opening job...');
    const jobCard = page.locator('[class*="cursor-pointer"]').first();
    if (await jobCard.isVisible({ timeout: 5000 })) {
      await jobCard.click();
      await page.waitForTimeout(3000);
      console.log('✅ Job opened\n');
    }

    // Fill PropertyContact fields with Albert Peterson
    console.log('Filling PropertyContact fields with Albert Peterson...');

    await page.fill('input[name="propertyContactFirstName"]', 'Albert');
    await page.fill('input[name="propertyContactLastName"]', 'Peterson');
    await page.fill('input[name="propertyContactEmail"]', 'Mark@AlbertJohnson.com');
    await page.fill('input[name="propertyContactPhone"]', '(221) 663-8812');

    console.log('✅ PropertyContact fields filled\n');

    // Trigger save by clicking a save button or blurring
    console.log('Triggering save...');

    // Try to find and click save button
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Send to Valcre")').first();
    if (await saveButton.isVisible({ timeout: 2000 })) {
      await saveButton.click();
      console.log('✅ Save button clicked\n');
    } else {
      // Blur the last field to trigger auto-save
      await page.locator('input[name="propertyContactPhone"]').blur();
      console.log('✅ Field blurred to trigger auto-save\n');
    }

    // Wait for logs to appear
    console.log('Waiting for emoji logs (10 seconds)...\n');
    await page.waitForTimeout(10000);

    // Display results
    console.log('\n========================================');
    console.log('CAPTURED EMOJI LOGS FOR CURSOR');
    console.log('========================================\n');

    if (targetLogs.propertyType) {
      console.log(targetLogs.propertyType);
    } else {
      console.log('⚠️ No 🏢 PropertyType log captured');
    }

    if (targetLogs.propertyContact) {
      console.log(targetLogs.propertyContact);
    } else {
      console.log('⚠️ No 👤 PropertyContact log captured');
    }

    if (targetLogs.fullPayload) {
      console.log(targetLogs.fullPayload);
    } else {
      console.log('⚠️ No 📤 Full payload log captured');
    }

    console.log('\n========================================\n');

    if (!targetLogs.propertyType && !targetLogs.propertyContact && !targetLogs.fullPayload) {
      console.log('❌ No emoji logs captured. This means:');
      console.log('   1. Cursor hasn\'t added the logging code yet, OR');
      console.log('   2. The save didn\'t trigger the webhook\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    console.log('Closing browser in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

getEmojiLogs().catch(console.error);
