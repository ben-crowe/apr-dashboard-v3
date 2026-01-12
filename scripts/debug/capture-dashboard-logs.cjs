/**
 * Dashboard Console Log Capture - PropertyType & PropertyContact
 *
 * Navigates to dashboard, opens job, captures console logs during editing
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function captureDashboardLogs() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  const emojiLogs = [];
  const allLogs = [];

  page.on('console', msg => {
    const text = msg.text();
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];

    allLogs.push({
      type: msg.type(),
      text: text,
      timestamp: timestamp
    });

    // Capture emoji logs
    if (text.match(/🏢|👤|📤|📥|✅|❌|⚠️|🔍/)) {
      emojiLogs.push(`[${timestamp}] ${text}`);
      console.log(`${text}`);
    }

    if (msg.type() === 'error') {
      console.error(`[ERROR] ${text}`);
    }
  });

  try {
    console.log('\n=== Navigating to Dashboard ===\n');

    // Go directly to dashboard
    await page.goto('http://localhost:8080/dashboard');
    console.log('✅ Navigated to dashboard');

    await page.waitForTimeout(3000);

    // Look for any job card to click
    console.log('\nLooking for job to open...');

    const jobCard = page.locator('[class*="cursor-pointer"], .job-card, [role="button"]').first();

    if (await jobCard.isVisible({ timeout: 5000 })) {
      console.log('✅ Found job card, clicking...');
      await jobCard.click();
      await page.waitForTimeout(3000);

      console.log('\n📝 Job opened - Now monitoring console for emoji logs...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // Let it run for 20 seconds to capture logs
      await page.waitForTimeout(20000);

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n=== EMOJI LOGS SUMMARY ===\n');

      if (emojiLogs.length > 0) {
        emojiLogs.forEach(log => console.log(log));
      } else {
        console.log('⚠️ No emoji logs captured');
        console.log('\nThis means:');
        console.log('1. Cursor\'s logging code hasn\'t been added yet');
        console.log('2. Or the logging is in a different part of the flow');
        console.log('\nShowing all logs related to PropertyType/PropertyContact:\n');

        const relevantLogs = allLogs.filter(log =>
          log.text.toLowerCase().includes('property') ||
          log.text.toLowerCase().includes('contact') ||
          log.text.toLowerCase().includes('valcre') ||
          log.text.toLowerCase().includes('webhook')
        );

        if (relevantLogs.length > 0) {
          relevantLogs.forEach(log => {
            console.log(`[${log.timestamp}] [${log.type}] ${log.text}`);
          });
        }
      }

      // Save logs
      const report = {
        timestamp: new Date().toISOString(),
        emojiLogs,
        relevantLogs: allLogs.filter(log =>
          log.text.toLowerCase().includes('property') ||
          log.text.toLowerCase().includes('contact') ||
          log.text.toLowerCase().includes('valcre')
        ),
        allLogs
      };

      const jsonPath = '/Users/bencrowe/Development/apr-dashboard-v3/dashboard-console-logs.json';
      fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
      console.log(`\n✅ Logs saved to: ${jsonPath}\n`);

    } else {
      console.log('❌ No jobs found on dashboard');
    }

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  } finally {
    console.log('\nClosing browser in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

captureDashboardLogs().catch(console.error);
