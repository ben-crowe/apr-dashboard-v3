/**
 * Phase 2 Testing: PropertyType & PropertyContact Auto-Sync Error Capture
 *
 * This script tests the auto-sync functionality and captures detailed error logs
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function testAutoSyncErrors() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture all console messages
  const consoleLogs = [];
  const errors = [];
  const networkErrors = [];

  page.on('console', msg => {
    const logEntry = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    consoleLogs.push(logEntry);
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    const errorEntry = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    errors.push(errorEntry);
    console.error('Page Error:', error.message);
  });

  page.on('response', response => {
    if (!response.ok() && (response.status() >= 400)) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date().toISOString()
      });
      console.error(`Network Error: ${response.status()} ${response.url()}`);
    }
  });

  const testResults = {
    environment: {
      url: 'http://localhost:8080/dashboard',
      job: 'VAL251022',
      testDate: new Date().toISOString()
    },
    tests: []
  };

  try {
    console.log('Navigating to dashboard...');
    await page.goto('http://localhost:8080/dashboard');
    await page.waitForTimeout(3000); // Wait for page load

    console.log('Looking for job VAL251022...');
    // Try to find and click the job
    const jobCard = page.locator('text=VAL251022').first();
    if (await jobCard.isVisible({ timeout: 5000 })) {
      await jobCard.click();
      await page.waitForTimeout(2000);
      console.log('✅ Found and opened job VAL251022');
    } else {
      console.log('⚠️ Could not find job VAL251022, testing on current page');
    }

    // Test 1: PropertyType
    console.log('\n=== Testing PropertyType ===');
    const propertyTypeTest = {
      field: 'PropertyType',
      action: 'Changed to "Multi-Family"',
      consoleLogs: [],
      errors: [],
      networkErrors: []
    };

    const beforePropertyTypeLogs = consoleLogs.length;
    const beforePropertyTypeErrors = errors.length;
    const beforePropertyTypeNetwork = networkErrors.length;

    try {
      // Find PropertyType dropdown
      const propertyTypeSelect = page.locator('select, [role="combobox"]').filter({ hasText: /property type/i }).first();
      if (await propertyTypeSelect.isVisible({ timeout: 3000 })) {
        await propertyTypeSelect.click();
        await page.waitForTimeout(500);

        // Select "Multi-Family"
        const multiFamilyOption = page.locator('text="Multi-Family"').first();
        if (await multiFamilyOption.isVisible({ timeout: 2000 })) {
          await multiFamilyOption.click();
          console.log('Selected Multi-Family');
        } else {
          // Try selecting by value
          await propertyTypeSelect.selectOption('Multi-Family');
        }

        // Blur to trigger auto-sync
        await page.keyboard.press('Tab');
        await page.waitForTimeout(2500); // Wait for 500ms debounce + save attempt

        propertyTypeTest.result = 'Triggered';
      } else {
        propertyTypeTest.result = 'Field not found';
        console.log('⚠️ PropertyType field not found');
      }
    } catch (e) {
      propertyTypeTest.result = 'Error: ' + e.message;
      propertyTypeTest.errors.push(e.message);
    }

    propertyTypeTest.consoleLogs = consoleLogs.slice(beforePropertyTypeLogs);
    propertyTypeTest.errors = errors.slice(beforePropertyTypeErrors);
    propertyTypeTest.networkErrors = networkErrors.slice(beforePropertyTypeNetwork);
    testResults.tests.push(propertyTypeTest);

    // Test 2: PropertyContact Fields
    console.log('\n=== Testing PropertyContact Fields ===');

    const contactFields = [
      { name: 'propertyContactFirstName', label: 'Property Contact', value: 'TestFirst' },
      { name: 'propertyContactLastName', label: 'Last Name', value: 'TestLast' },
      { name: 'propertyContactEmail', label: 'Email', value: 'test@example.com' },
      { name: 'propertyContactPhone', label: 'Phone', value: '555-1234' }
    ];

    for (const field of contactFields) {
      console.log(`\nTesting ${field.name}...`);
      const fieldTest = {
        field: field.name,
        action: `Changed to "${field.value}"`,
        consoleLogs: [],
        errors: [],
        networkErrors: []
      };

      const beforeLogs = consoleLogs.length;
      const beforeErrors = errors.length;
      const beforeNetwork = networkErrors.length;

      try {
        // Find the input field
        const input = page.locator(`input[name="${field.name}"]`).first();
        if (await input.isVisible({ timeout: 3000 })) {
          await input.fill(field.value);
          await input.blur(); // Trigger auto-sync
          await page.waitForTimeout(2500); // Wait for debounce + save

          fieldTest.result = 'Triggered';
          console.log(`✅ ${field.name} value changed and blurred`);
        } else {
          // Try finding by label
          const labelInput = page.locator(`label:has-text("${field.label}") + input, label:has-text("${field.label}") ~ input`).first();
          if (await labelInput.isVisible({ timeout: 2000 })) {
            await labelInput.fill(field.value);
            await labelInput.blur();
            await page.waitForTimeout(2500);
            fieldTest.result = 'Triggered';
            console.log(`✅ ${field.name} found by label and changed`);
          } else {
            fieldTest.result = 'Field not found';
            console.log(`⚠️ ${field.name} field not found`);
          }
        }
      } catch (e) {
        fieldTest.result = 'Error: ' + e.message;
        fieldTest.errors.push(e.message);
      }

      fieldTest.consoleLogs = consoleLogs.slice(beforeLogs);
      fieldTest.errors = errors.slice(beforeErrors);
      fieldTest.networkErrors = networkErrors.slice(beforeNetwork);
      testResults.tests.push(fieldTest);
    }

    // Check for save notifications
    console.log('\n=== Checking for save notifications ===');
    const savedNotification = page.locator('text=/saved|failed to save/i').first();
    if (await savedNotification.isVisible({ timeout: 5000 })) {
      const notificationText = await savedNotification.textContent();
      console.log(`Notification: ${notificationText}`);
      testResults.notification = notificationText;
    } else {
      console.log('⚠️ No save notification found');
    }

    // Wait a bit to capture any delayed errors
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('Test error:', error);
    testResults.testError = error.message;
  } finally {
    // Generate report
    const report = generateMarkdownReport(testResults, consoleLogs, errors, networkErrors);

    // Save report
    const reportPath = '/Users/bencrowe/Development/apr-dashboard-v3/PHASE2-TEST-RESULTS.md';
    fs.writeFileSync(reportPath, report);
    console.log(`\n✅ Report saved to: ${reportPath}`);

    // Save raw logs
    const logsPath = '/Users/bencrowe/Development/apr-dashboard-v3/test-logs.json';
    fs.writeFileSync(logsPath, JSON.stringify({
      testResults,
      consoleLogs,
      errors,
      networkErrors
    }, null, 2));
    console.log(`✅ Raw logs saved to: ${logsPath}`);

    await browser.close();
  }
}

function generateMarkdownReport(testResults, consoleLogs, errors, networkErrors) {
  let report = `# Phase 2 Test Results - PropertyType & PropertyContact Auto-Sync

## Environment
- **URL**: ${testResults.environment.url}
- **Job**: ${testResults.environment.job}
- **Test Date**: ${testResults.environment.testDate}

`;

  // PropertyType Test
  const propertyTypeTest = testResults.tests.find(t => t.field === 'PropertyType');
  if (propertyTypeTest) {
    report += `## PropertyType Test

### Action
Changed to "Multi-Family"

### Result
${propertyTypeTest.result}

### Console Logs
\`\`\`
${propertyTypeTest.consoleLogs.map(log => `[${log.type}] ${log.text}`).join('\n') || 'No console logs captured'}
\`\`\`

### Errors
\`\`\`
${propertyTypeTest.errors.map(e => typeof e === 'string' ? e : JSON.stringify(e, null, 2)).join('\n') || 'No errors captured'}
\`\`\`

### Network Errors
\`\`\`json
${JSON.stringify(propertyTypeTest.networkErrors, null, 2) || 'No network errors'}
\`\`\`

`;
  }

  // PropertyContact Tests
  report += `## PropertyContact Tests\n\n`;

  const contactTests = testResults.tests.filter(t => t.field.startsWith('propertyContact'));
  contactTests.forEach(test => {
    report += `### ${test.field}
- **Action**: ${test.action}
- **Result**: ${test.result}

**Console Logs:**
\`\`\`
${test.consoleLogs.map(log => `[${log.type}] ${log.text}`).join('\n') || 'No logs'}
\`\`\`

**Errors:**
\`\`\`
${test.errors.map(e => typeof e === 'string' ? e : JSON.stringify(e, null, 2)).join('\n') || 'No errors'}
\`\`\`

**Network Errors:**
\`\`\`json
${JSON.stringify(test.networkErrors, null, 2) || 'No network errors'}
\`\`\`

`;
  });

  // All Console Logs Summary
  report += `## All Console Logs Summary

### Errors (red messages)
\`\`\`
${consoleLogs.filter(log => log.type === 'error').map(log => log.text).join('\n') || 'No error logs'}
\`\`\`

### Warnings
\`\`\`
${consoleLogs.filter(log => log.type === 'warning').map(log => log.text).join('\n') || 'No warnings'}
\`\`\`

### Info/Debug (with emojis)
\`\`\`
${consoleLogs.filter(log => log.text.match(/🏢|👤|📤|📥|✅|❌/)).map(log => log.text).join('\n') || 'No webhook logs found'}
\`\`\`

`;

  // All Network Errors
  if (networkErrors.length > 0) {
    report += `## All Network Errors\n\`\`\`json\n${JSON.stringify(networkErrors, null, 2)}\n\`\`\`\n\n`;
  }

  // Save Notification
  if (testResults.notification) {
    report += `## Save Notification\n\`\`\`\n${testResults.notification}\n\`\`\`\n\n`;
  }

  // Root Cause Analysis
  report += `## Root Cause Analysis

`;

  // Analyze errors
  const hasSupabaseErrors = consoleLogs.some(log => log.text.includes('Supabase') || log.text.includes('StorageApiError'));
  const hasFieldNameErrors = consoleLogs.some(log => log.text.includes('propertyType') || log.text.includes('property_type'));
  const hasWebhookErrors = consoleLogs.some(log => log.text.includes('webhook') || log.text.includes('valcre'));
  const has4xxErrors = networkErrors.some(err => err.status >= 400 && err.status < 500);
  const has5xxErrors = networkErrors.some(err => err.status >= 500);

  if (hasSupabaseErrors) {
    report += `### ⚠️ Supabase Connection Issues
- Error logs contain Supabase-related errors
- Possible causes:
  - RLS policies blocking updates
  - Missing VITE_SUPABASE_* environment variables
  - Table column mismatches

`;
  }

  if (hasFieldNameErrors) {
    report += `### ⚠️ Field Name Mismatches
- Logs show propertyType vs property_type inconsistencies
- Check database schema vs JavaScript field names

`;
  }

  if (hasWebhookErrors) {
    report += `### ⚠️ Valcre Webhook Issues
- Webhook logs detected in console
- Check if webhook is hitting correct endpoint
- Verify field mapping in webhook payload

`;
  }

  if (has4xxErrors) {
    report += `### ⚠️ Client Errors (4xx)
- ${networkErrors.filter(e => e.status >= 400 && e.status < 500).length} requests failed with 4xx status
- Likely authentication, permission, or validation errors
- URLs: ${networkErrors.filter(e => e.status >= 400 && e.status < 500).map(e => e.url).join(', ')}

`;
  }

  if (has5xxErrors) {
    report += `### ⚠️ Server Errors (5xx)
- ${networkErrors.filter(e => e.status >= 500).length} requests failed with 5xx status
- Server-side issues with Supabase or Valcre API
- URLs: ${networkErrors.filter(e => e.status >= 500).map(e => e.url).join(', ')}

`;
  }

  if (!hasSupabaseErrors && !hasFieldNameErrors && !hasWebhookErrors && networkErrors.length === 0) {
    report += `### ✅ No Obvious Errors Detected
- Console logs appear clean
- No network errors
- May need to check Supabase logs directly
- Verify auto-sync is actually triggering

`;
  }

  report += `## Cursor's Next Steps

Based on this analysis, Cursor should:

1. **Investigate identified error patterns** (see Root Cause Analysis above)
2. **Check Supabase RLS policies** if Supabase errors detected
3. **Verify field name consistency** across UI → Database → Webhook
4. **Review network error responses** for specific error messages
5. **Add more detailed logging** to webhook and save handlers

## Raw Data

Full logs available in: \`test-logs.json\`
`;

  return report;
}

testAutoSyncErrors().catch(console.error);
