import { test, expect } from '@playwright/test';

test('capture report builder state', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  // Listen for errors
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to Report Builder...');
  await page.goto('http://localhost:5173/mock-builder', { waitUntil: 'networkidle' });

  // Wait for content to load
  await page.waitForTimeout(2000);

  // Take full page screenshot
  console.log('Taking full page screenshot...');
  await page.screenshot({
    path: '/Users/bencrowe/Development/report-builder-full.png',
    fullPage: true
  });

  // Try to find the preview panel
  console.log('Looking for preview panel...');
  const previewSelectors = [
    '[class*="preview"]',
    '[class*="Preview"]',
    '[data-testid*="preview"]',
    'iframe',
    '[class*="document"]',
    '[class*="Document"]'
  ];

  for (const selector of previewSelectors) {
    const element = await page.$(selector);
    if (element) {
      console.log(`Found element with selector: ${selector}`);
      await element.screenshot({
        path: `/Users/bencrowe/Development/report-builder-${selector.replace(/[^a-z]/gi, '')}.png`
      });
    }
  }

  // Get page structure info
  const title = await page.title();
  console.log('Page title:', title);

  // Check for specific elements
  const pageBreaksCount = await page.locator('[class*="page-break"]').count();
  console.log('Page breaks found:', pageBreaksCount);

  const pageElements = await page.locator('[class*="page"]').count();
  console.log('Page elements found:', pageElements);

  // Get all class names to help identify structure
  const classes = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const classSet = new Set();
    allElements.forEach(el => {
      if (el.className && typeof el.className === 'string') {
        el.className.split(' ').forEach(cls => {
          if (cls.toLowerCase().includes('page') ||
              cls.toLowerCase().includes('preview') ||
              cls.toLowerCase().includes('document')) {
            classSet.add(cls);
          }
        });
      }
    });
    return Array.from(classSet);
  });
  console.log('Relevant classes found:', classes);

  console.log('\nScreenshots saved successfully');
});
