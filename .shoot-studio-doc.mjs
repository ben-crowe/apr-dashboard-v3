import { chromium } from 'playwright';
const out = process.env.HOME + '/Development/KM-Exp/data/screenshots/stitch-apr-review/sweep/';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://localhost:8086/dashboard/job/f4650e9b-c583-4ab7-bd89-f5f6e68ac37a');
await page.waitForSelector('text=VAL261070', { timeout: 20000 });
await page.waitForTimeout(2000);
await page.click('text=Asset Studio');
await page.waitForTimeout(3000);
// preview the LOE document block inside the sequence
const prev = page.locator('button:has-text("Preview")').nth(1); // document card's Preview
await prev.click();
await page.waitForTimeout(5000);
await page.screenshot({ path: out + '06-studio-document-preview.png', fullPage: false });
console.log('done');
await browser.close();
