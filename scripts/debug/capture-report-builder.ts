import { chromium } from 'playwright';

async function captureReportBuilder() {
  console.log('Opening Report Builder...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Track console messages
  page.on('console', (msg) => {
    console.log(`[Browser] ${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', (error) => {
    console.log(`[Browser Error] ${error.message}`);
  });

  try {
    console.log('Navigating to http://localhost:8082/mock-builder...');
    await page.goto('http://localhost:8082/mock-builder', { waitUntil: 'networkidle' });

    console.log('Waiting for content to load...');
    await page.waitForTimeout(3000);

    // Take full page screenshot
    console.log('Capturing full page screenshot...');
    await page.screenshot({
      path: 'report-builder-full.png',
      fullPage: true
    });
    console.log('✅ Saved: report-builder-full.png');

    // Try to capture viewport screenshot
    await page.screenshot({
      path: 'report-builder-viewport.png',
      fullPage: false
    });
    console.log('✅ Saved: report-builder-viewport.png');

    // Get page info
    const title = await page.title();
    console.log(`\nPage title: ${title}`);

    // Check for page elements
    const pageElements = await page.locator('[class*="page"]').count();
    console.log(`Page-related elements: ${pageElements}`);

    const pageBreaks = await page.locator('[class*="page-break"]').count();
    console.log(`Page breaks: ${pageBreaks}`);

    // Get relevant classes
    const relevantClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const classes = new Set<string>();
      elements.forEach(el => {
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(cls => {
            if (cls && (cls.toLowerCase().includes('page') ||
                       cls.toLowerCase().includes('preview') ||
                       cls.toLowerCase().includes('document'))) {
              classes.add(cls);
            }
          });
        }
      });
      return Array.from(classes);
    });
    console.log(`\nRelevant classes found: ${relevantClasses.join(', ')}`);

    console.log('\nBrowser will remain open for 2 minutes for inspection...');
    console.log('Press Ctrl+C to close early.');
    await page.waitForTimeout(120000);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

captureReportBuilder();
