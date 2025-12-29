/**
 * Extract Generated HTML from Zustand Store
 * Simple version - directly access useReportBuilderStore
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const DEV_SERVER_URL = 'http://localhost:8082';
const TDD_PATH = '/test-input';

console.log('\n' + '='.repeat(70));
console.log('EXTRACTING HTML FROM REPORT BUILDER STORE');
console.log('='.repeat(70) + '\n');

async function extractHTML() {
  let browser;

  try {
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`📍 Navigating to ${DEV_SERVER_URL}${TDD_PATH}...`);
    await page.goto(DEV_SERVER_URL + TDD_PATH, { waitUntil: 'networkidle' });
    console.log('   ✅ Page loaded');

    // Wait for React to render
    await page.waitForTimeout(2000);

    // Click "Load Test Data" button
    console.log('\n📋 Loading test data...');
    await page.click('button:has-text("Load Test Data")');
    await page.waitForTimeout(3000); // Wait for store to update

    // Access the Zustand store directly
    console.log('🔍 Accessing Zustand store...');
    const html = await page.evaluate(() => {
      // Zustand stores are accessed through module imports
      // We need to find the store instance in the React component tree

      // Method 1: Look for the store in window (if exposed for debugging)
      if (window.useReportBuilderStore) {
        return window.useReportBuilderStore.getState().previewHtml;
      }

      // Method 2: Access through React DevTools hooks
      // Find the root React element
      const root = document.querySelector('#root');
      if (!root) return null;

      // Get React Fiber from the root
      const fiberKey = Object.keys(root).find(key => key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance'));
      if (!fiberKey) return null;

      let fiber = root[fiberKey];

      // Traverse the fiber tree to find components with memoizedState containing previewHtml
      const visited = new Set();
      const traverse = (node, depth = 0) => {
        if (!node || depth > 50 || visited.has(node)) return null;
        visited.add(node);

        // Check if this node has a memoizedState with previewHtml
        if (node.memoizedState) {
          // For hooks, memoizedState is a linked list
          let state = node.memoizedState;
          while (state) {
            if (state.memoizedState && typeof state.memoizedState === 'string' && state.memoizedState.includes('<!DOCTYPE')) {
              return state.memoizedState;
            }
            if (typeof state === 'string' && state.includes('<!DOCTYPE')) {
              return state;
            }
            state = state.next || state.baseState;
            if (!state || state === node.memoizedState) break;
          }

          // Check if memoizedState itself contains previewHtml
          if (node.memoizedState.previewHtml) {
            return node.memoizedState.previewHtml;
          }
        }

        // Check stateNode (for class components)
        if (node.stateNode && node.stateNode.state && node.stateNode.state.previewHtml) {
          return node.stateNode.state.previewHtml;
        }

        // Traverse children
        let result = null;
        if (node.child) result = traverse(node.child, depth + 1);
        if (result) return result;
        if (node.sibling) result = traverse(node.sibling, depth + 1);
        if (result) return result;
        if (node.return) result = traverse(node.return, depth + 1);
        return result;
      };

      const result = traverse(fiber);
      if (result) return result;

      // Method 3: Try to find iframe with preview
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
        return iframe.contentWindow.document.documentElement.outerHTML;
      }

      return null;
    });

    if (!html || html.length < 5000) {
      console.log(`⚠️  HTML extraction returned ${html?.length || 0} characters (expected > 5000)`);
      console.log('❌ Taking screenshot for debugging...');
      await page.screenshot({ path: './debug-screenshot.png', fullPage: true });
      throw new Error(`HTML too short or missing (${html?.length || 0} chars)`);
    }

    console.log(`   ✅ Extracted ${html.length} characters`);

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
    console.log('Next step: Run comparison');
    console.log('  python3 compare_reports.py\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error.message);
    process.exit(1);
  });
