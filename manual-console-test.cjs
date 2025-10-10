/**
 * Manual Console Test - Capture PropertyType & PropertyContact Emoji Logs
 *
 * This script navigates to the form, fills PropertyType and PropertyContact,
 * submits the job, and captures all emoji-prefixed console logs
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function manualConsoleTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console logs with emojis
  const emojiLogs = [];
  const allLogs = [];

  page.on('console', msg => {
    const text = msg.text();
    allLogs.push({
      type: msg.type(),
      text: text,
      timestamp: new Date().toISOString()
    });

    // Capture emoji logs specifically
    if (text.match(/🏢|👤|📤|📥|✅|❌|⚠️|🔍/)) {
      emojiLogs.push({
        emoji: text.match(/🏢|👤|📤|📥|✅|❌|⚠️|🔍/)[0],
        text: text,
        timestamp: new Date().toISOString()
      });
      console.log(`[EMOJI LOG] ${text}`);
    }

    // Also log errors
    if (msg.type() === 'error') {
      console.error(`[ERROR] ${text}`);
    }
  });

  try {
    console.log('=== Starting Manual Console Test ===\n');

    // Navigate to the form
    console.log('1. Navigating to form...');
    await page.goto('http://localhost:8080/');
    await page.waitForTimeout(2000);

    console.log('2. Filling out form with PropertyType and PropertyContact...\n');

    // Fill client info (required fields)
    await page.fill('input[name="clientFirstName"]', 'Test');
    await page.fill('input[name="clientLastName"]', 'Client');
    await page.fill('input[name="clientEmail"]', 'test@example.com');
    await page.fill('input[name="clientPhone"]', '403-555-1234');

    // Fill property info
    await page.fill('input[name="propertyAddress"]', '123 Test St, Calgary, AB');

    // **CRITICAL: Set PropertyType to "Multi-Family"**
    console.log('   Setting PropertyType to "Multi-Family"...');
    const propertyTypeSelect = page.locator('select[name="propertyType"], [role="combobox"]').first();

    try {
      if (await propertyTypeSelect.isVisible({ timeout: 3000 })) {
        await propertyTypeSelect.click();
        await page.waitForTimeout(500);

        // Try clicking the option
        const multiFamilyOption = page.locator('text="Multi-Family"').first();
        if (await multiFamilyOption.isVisible({ timeout: 2000 })) {
          await multiFamilyOption.click();
          console.log('   ✅ PropertyType set to Multi-Family (via click)');
        } else {
          // Try select by value
          await propertyTypeSelect.selectOption('Multi-Family');
          console.log('   ✅ PropertyType set to Multi-Family (via selectOption)');
        }
      } else {
        console.log('   ⚠️ PropertyType dropdown not found, trying alternative selector');
      }
    } catch (e) {
      console.log('   ⚠️ Could not set PropertyType:', e.message);
    }

    // **CRITICAL: Fill PropertyContact fields (different from client)**
    console.log('\n   Filling PropertyContact fields...');

    await page.fill('input[name="propertyContactFirstName"]', 'Jane');
    await page.fill('input[name="propertyContactLastName"]', 'Property');
    await page.fill('input[name="propertyContactEmail"]', 'jane@property.com');
    await page.fill('input[name="propertyContactPhone"]', '403-555-8888');

    console.log('   ✅ PropertyContact fields filled:');
    console.log('      - First Name: Jane');
    console.log('      - Last Name: Property');
    console.log('      - Email: jane@property.com');
    console.log('      - Phone: 403-555-8888');

    // Submit the form
    console.log('\n3. Submitting form...');
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Wait for job creation and Valcre webhook
    console.log('4. Waiting for job creation and Valcre webhook...\n');
    await page.waitForTimeout(10000); // 10 seconds to capture all webhook logs

    // Generate report
    console.log('\n=== Test Complete ===\n');
    console.log(`Total logs captured: ${allLogs.length}`);
    console.log(`Emoji logs captured: ${emojiLogs.length}\n`);

    // Display emoji logs
    if (emojiLogs.length > 0) {
      console.log('=== EMOJI LOGS (Copy these for Cursor) ===\n');
      emojiLogs.forEach(log => {
        console.log(log.text);
      });
      console.log('\n=== END EMOJI LOGS ===\n');
    } else {
      console.log('⚠️ No emoji logs captured - logging may not be working\n');
    }

    // Save to file
    const report = {
      timestamp: new Date().toISOString(),
      testData: {
        propertyType: 'Multi-Family',
        propertyContact: {
          firstName: 'Jane',
          lastName: 'Property',
          email: 'jane@property.com',
          phone: '403-555-8888'
        }
      },
      emojiLogs,
      allLogs: allLogs.filter(log =>
        log.text.includes('PropertyType') ||
        log.text.includes('PropertyContact') ||
        log.text.includes('valcre') ||
        log.text.includes('webhook')
      )
    };

    const reportPath = '/Users/bencrowe/Development/apr-dashboard-v3/MANUAL-TEST-EMOJI-LOGS.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Full report saved to: ${reportPath}\n`);

    // Generate markdown report for Ben/Cursor
    const markdown = generateMarkdownReport(report);
    const mdPath = '/Users/bencrowe/Development/apr-dashboard-v3/MANUAL-TEST-RESULTS.md';
    fs.writeFileSync(mdPath, markdown);
    console.log(`✅ Markdown report saved to: ${mdPath}\n`);

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    console.log('Browser will stay open for 10 seconds for you to inspect...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

function generateMarkdownReport(report) {
  let md = `# Manual Console Test Results - PropertyType & PropertyContact

**Test Date**: ${report.timestamp}

## Test Data Submitted

### PropertyType
\`\`\`
Multi-Family
\`\`\`

### PropertyContact Fields
\`\`\`json
{
  "firstName": "Jane",
  "lastName": "Property",
  "email": "jane@property.com",
  "phone": "403-555-8888"
}
\`\`\`

---

## 📊 Emoji Logs Captured

`;

  if (report.emojiLogs.length > 0) {
    md += '### Key Logs (Copy for Cursor)\n\n```\n';
    report.emojiLogs.forEach(log => {
      md += log.text + '\n';
    });
    md += '```\n\n';
  } else {
    md += '⚠️ **No emoji logs were captured**\n\n';
    md += 'This could mean:\n';
    md += '1. Logging code not present in current build\n';
    md += '2. Form submission failed before reaching webhook\n';
    md += '3. Logs are using different format\n\n';
  }

  md += '---\n\n## 🔍 PropertyType/PropertyContact Related Logs\n\n```\n';
  const relevantLogs = report.allLogs.filter(log =>
    log.text.toLowerCase().includes('propertytype') ||
    log.text.toLowerCase().includes('propertycontact') ||
    log.text.toLowerCase().includes('valcre') ||
    log.text.toLowerCase().includes('webhook') ||
    log.text.toLowerCase().includes('multi-family') ||
    log.text.toLowerCase().includes('jane')
  );

  if (relevantLogs.length > 0) {
    relevantLogs.forEach(log => {
      md += `[${log.type}] ${log.text}\n`;
    });
  } else {
    md += 'No relevant logs found\n';
  }
  md += '```\n\n';

  md += '---\n\n## Analysis Questions for Cursor\n\n';
  md += '1. Is PropertyType "Multi-Family" present in the logs?\n';
  md += '2. Is PropertyContact object with Jane/Property present?\n';
  md += '3. Does the webhook payload show these fields?\n';
  md += '4. If present in webhook, are they reaching /api/valcre?\n';
  md += '5. If reaching /api/valcre, are they being sent to Valcre API?\n\n';

  return md;
}

manualConsoleTest().catch(console.error);
