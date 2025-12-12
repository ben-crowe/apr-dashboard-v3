import { test, expect } from '@playwright/test';

test('Calculator loads test data', async ({ page }) => {
  // Capture ALL browser console output
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8082/calculator-demo');
  await page.waitForTimeout(2000);

  // Get initial state
  const initialValues = await page.$$eval('input[type="number"]', inputs =>
    inputs.map((inp: HTMLInputElement) => inp.value)
  );
  console.log('INITIAL VALUES:', initialValues.slice(0, 5));

  // Click Load Test Data
  console.log('CLICKING BUTTON...');
  await page.click('button:has-text("Load North Battleford Test Data")');
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'tests/calc-result.png', fullPage: true });

  // Get values after click
  const values = await page.$$eval('input[type="number"]', inputs =>
    inputs.map((inp: HTMLInputElement) => inp.value)
  );
  console.log('AFTER CLICK VALUES:', values);

  // Check for non-zero values
  const nonZeroCount = values.filter(v => v !== '0' && v !== '').length;
  console.log('NON-ZERO COUNT:', nonZeroCount);

  // Get indicated value
  const indicatedEl = await page.$('.text-2xl.font-bold.text-purple-900');
  const indicatedText = indicatedEl ? await indicatedEl.textContent() : 'not found';
  console.log('INDICATED VALUE:', indicatedText);

  // Check the store directly via browser
  const storeState = await page.evaluate(() => {
    // @ts-ignore
    const store = window.__ZUSTAND_STORE__;
    if (store) {
      const state = store.getState();
      const calcSection = state.sections?.find((s: any) => s.id === 'calc');
      return {
        hasStore: true,
        calcSectionExists: !!calcSection,
        subsectionsCount: calcSection?.subsections?.length || 0
      };
    }
    return { hasStore: false };
  });
  console.log('STORE STATE:', storeState);
});
