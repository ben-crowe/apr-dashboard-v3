/**
 * Extract Generated HTML from Test Input Dashboard using Playwright
 * Version 2 - Click Load Test Data and extract from preview
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
    browser = await chromium.launch({ headless: false }); // visible for debugging
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`📍 Navigating to ${DEV_SERVER_URL}${TDD_PATH}...`);
    await page.goto(DEV_SERVER_URL + TDD_PATH, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('   ✅ Page loaded');

    // Wait for React to render
    await page.waitForTimeout(2000);

    // Click "Load Test Data" button
    console.log('\n📋 Clicking "Load Test Data" button...');
    const loadButton = page.locator('button:has-text("Load Test Data")');
    await loadButton.click();
    console.log('   ✅ Test data loaded');

    // Wait for preview to update
    await page.waitForTimeout(3000);

    // The preview HTML is likely in the previewHtml state of the Zustand store
    // Let's try to access it through the browser's window object
    console.log('\n🔍 Extracting HTML from preview...');

    const html = await page.evaluate(() => {
      // Try to access the Zustand store directly
      // The store might be exposed on window for debugging
      if (window.__REPORT_BUILDER_STORE__) {
        return window.__REPORT_BUILDER_STORE__.getState().previewHtml;
      }

      // Try to find an iframe with the preview
      const iframe = document.querySelector('iframe[title*="preview"], iframe.preview-frame');
      if (iframe && iframe.contentDocument) {
        return iframe.contentDocument.documentElement.outerHTML;
      }

      // Try to find a div with the preview HTML
      const previewDiv = document.querySelector('[data-preview], .preview-content, #preview-container');
      if (previewDiv) {
        return previewDiv.innerHTML;
      }

      // Try to access React's internal state through the DOM
      // Find the preview component's root element
      const previewRoot = document.querySelector('[class*="preview"]');
      if (previewRoot && previewRoot._reactProps) {
        return previewRoot._reactProps.html || previewRoot._reactProps.children;
      }

      return null;
    });

    if (!html || html.length < 1000) {
      console.log('⚠️  Standard extraction failed, trying alternative method...');

      // Try to access the store through React DevTools protocol
      const storeHtml = await page.evaluate(() => {
        // Look for all script tags and find one that might contain the store
        const scripts = Array.from(document.querySelectorAll('script'));
        for (const script of scripts) {
          if (script.textContent && script.textContent.includes('previewHtml')) {
            return script.textContent;
          }
        }

        // Try accessing through React Fiber
        const rootElement = document.querySelector('#root');
        if (rootElement) {
          const fiberKey = Object.keys(rootElement).find(key => key.startsWith('__react'));
          if (fiberKey) {
            let fiber = rootElement[fiberKey];
            // Traverse the fiber tree to find the store
            const traverse = (node, depth = 0) => {
              if (depth > 20) return null;
              if (node && node.memoizedState && node.memoizedState.previewHtml) {
                return node.memoizedState.previewHtml;
              }
              if (node && node.child) {
                return traverse(node.child, depth + 1) || traverse(node.sibling, depth + 1);
              }
              if (node && node.sibling) {
                return traverse(node.sibling, depth + 1);
              }
              return null;
            };
            return traverse(fiber);
          }
        }

        return null;
      });

      if (storeHtml && storeHtml.length > 1000) {
        console.log(`   ✅ Extracted ${storeHtml.length} characters via React state`);
        writeFileSync('./generated-report.html', storeHtml, 'utf8');
        console.log(`   ✅ Saved to: ./generated-report.html`);
        return storeHtml;
      }

      throw new Error('Could not extract HTML from any source');
    }

    console.log(`   ✅ Extracted ${html.length} characters of HTML`);

    // Save to file
    const outputPath = './generated-report.html';
    writeFileSync(outputPath, html, 'utf8');
    console.log(`   ✅ Saved to: ${outputPath}`);

    console.log('\n✅ HTML extraction complete!\n');

    // Keep browser open for 5 seconds so we can see the result
    await page.waitForTimeout(5000);

    return html;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (browser) {
      // Keep browser open on error so we can inspect
      console.log('⏸️  Browser kept open for inspection. Close manually when done.');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
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
