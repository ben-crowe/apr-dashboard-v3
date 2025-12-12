/**
 * Extract Generated HTML from Test Input Dashboard using Playwright
 *
 * This script:
 * 1. Launches the dev server (or connects to running instance)
 * 2. Navigates to Test Input Dashboard
 * 3. Waits for data to load
 * 4. Extracts the generated preview HTML
 * 5. Saves to file
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const DEV_SERVER_URL = 'http://localhost:8082';
const TDD_PATH = '/test-input';

console.log('\n' + '='.repeat(70));
console.log('EXTRACTING HTML FROM TEST INPUT DASHBOARD');
console.log('='.repeat(70) + '\n');

async function extractHTML() {
  let browser;

  try {
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`📍 Navigating to ${DEV_SERVER_URL}${TDD_PATH}...`);
    const response = await page.goto(DEV_SERVER_URL + TDD_PATH, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    if (!response || !response.ok()) {
      throw new Error(`Failed to load page: ${response?.status() || 'unknown error'}`);
    }

    console.log('   ✅ Page loaded');

    // Wait for React to render
    console.log('\n⏳ Waiting for data to load...');
    await page.waitForTimeout(2000);

    // Find the preview container or hidden HTML field
    // The Report Builder might store generated HTML in a specific element
    console.log('🔍 Looking for generated HTML...');

    // Try to find the preview HTML in various ways:
    // 1. Check if there's a preview pane with HTML
    let html = await page.evaluate(() => {
      // Look for a preview container
      const previewContainer = document.querySelector('[data-preview-html]');
      if (previewContainer) {
        return previewContainer.getAttribute('data-preview-html');
      }

      // Look for a hidden textarea or div with HTML
      const htmlContainer = document.querySelector('#preview-html, .preview-html');
      if (htmlContainer) {
        return htmlContainer.textContent || htmlContainer.value;
      }

      // Try to access the store directly if it's exposed
      if (window.__REPORT_BUILDER_HTML__) {
        return window.__REPORT_BUILDER_HTML__;
      }

      return null;
    });

    if (!html) {
      console.log('⚠️  HTML not found in preview container');
      console.log('📝 Attempting to trigger HTML generation...');

      // Try clicking a "Generate Report" or "Preview" button
      const generateButton = page.locator('button:has-text("Generate"), button:has-text("Preview"), button:has-text("Export")');
      if (await generateButton.count() > 0) {
        await generateButton.first().click();
        await page.waitForTimeout(1000);

        // Try again to get HTML
        html = await page.evaluate(() => {
          const previewContainer = document.querySelector('[data-preview-html]');
          if (previewContainer) {
            return previewContainer.getAttribute('data-preview-html');
          }
          return document.querySelector('#preview-html, .preview-html')?.textContent;
        });
      }
    }

    if (!html || html.length < 1000) {
      console.log('❌ Could not extract generated HTML from page');
      console.log('   HTML length found:', html?.length || 0);
      console.log('\n💡 Debug: Taking screenshot...');
      await page.screenshot({ path: './debug-screenshot.png', fullPage: true });
      console.log('   Screenshot saved to: ./debug-screenshot.png');
      throw new Error('HTML extraction failed - see screenshot for debugging');
    }

    console.log(`   ✅ Extracted ${html.length} characters of HTML`);

    // Save to file
    const outputPath = './generated-report.html';
    writeFileSync(outputPath, html, 'utf8');
    console.log(`   ✅ Saved to: ${outputPath}`);

    console.log('\n✅ HTML extraction complete!\n');
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

// Run extraction
extractHTML()
  .then(() => {
    console.log('Next step: Run comparison');
    console.log('  python3 compare_reports.py\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to extract HTML');
    console.error(error);
    process.exit(1);
  });
