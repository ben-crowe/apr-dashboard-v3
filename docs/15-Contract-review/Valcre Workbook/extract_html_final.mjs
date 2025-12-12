/**
 * Extract Generated HTML via window.__PREVIEW_HTML__
 * Final version - uses exposed window variable
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const DEV_SERVER_URL = 'http://localhost:8082';
const TDD_PATH = '/mock-builder';

console.log('\n' + '='.repeat(70));
console.log('EXTRACTING HTML FROM REPORT BUILDER');
console.log('='.repeat(70) + '\n');

async function extractHTML() {
  let browser;

  try {
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`📍 Navigating to ${DEV_SERVER_URL}${TDD_PATH}...`);
    await page.goto(DEV_SERVER_URL + TDD_PATH, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('   ✅ Page loaded');

    // Wait for React to render
    await page.waitForTimeout(3000);

    // Take screenshot to debug
    await page.screenshot({ path: './page-before-click.png' });

    // Click "Load Test Data" button
    console.log('\n📋 Loading test data...');
    const loadButton = page.locator('button:has-text("Load Test Data")');
    await loadButton.click({ timeout: 5000 }).catch(async () => {
      console.log('   ⚠️  Button not found, trying alternative...');
      await page.screenshot({ path: './page-no-button.png' });
      // Try clicking any button that loads data
      await page.click('button').catch(() => {});
    });
    console.log('   ✅ Clicked Load Test Data');

    // Wait for data to load and preview to generate
    await page.waitForTimeout(4000);

    // Extract HTML from window.__PREVIEW_HTML__
    console.log('\n🔍 Extracting HTML from window.__PREVIEW_HTML__...');
    const html = await page.evaluate(() => {
      return window.__PREVIEW_HTML__;
    });

    if (!html) {
      console.log('❌ window.__PREVIEW_HTML__ is not set');
      console.log('📸 Taking screenshot for debugging...');
      await page.screenshot({ path: './debug-screenshot.png', fullPage: true });
      throw new Error('HTML not found on window object');
    }

    if (html.length < 5000) {
      console.log(`⚠️  HTML is very short: ${html.length} characters`);
      throw new Error(`HTML too short (${html.length} chars, expected > 5000)`);
    }

    console.log(`   ✅ Extracted ${html.length} characters`);

    // Count some basic elements as a sanity check
    const textBlockCount = (html.match(/<p/g) || []).length;
    const sectionCount = (html.match(/class="[^"]*section/g) || []).length;
    console.log(`   📊 Found ~${textBlockCount} <p> tags, ~${sectionCount} sections`);

    // Save to file
    const outputPath = './generated-report.html';
    writeFileSync(outputPath, html, 'utf8');
    console.log(`   ✅ Saved to: ${outputPath}\n`);

    return html;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

extractHTML()
  .then(() => {
    console.log('✅ HTML extraction complete!\n');
    console.log('════════════════════════════════════════════════════════════════════════');
    console.log('NEXT STEP: Run comparison to get actual percentage match');
    console.log('════════════════════════════════════════════════════════════════════════');
    console.log('\n  python3 compare_reports.py\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error.message);
    process.exit(1);
  });
