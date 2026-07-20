// Full-page live screenshots of the APR app, headless, JS running.
import { chromium } from 'playwright';
const out = process.env.HOME + '/Development/KM-Exp/data/screenshots/stitch-apr-review/v3/';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://localhost:8086/dashboard/job/f4650e9b-c583-4ab7-bd89-f5f6e68ac37a');
await page.waitForSelector('text=VAL261070', { timeout: 20000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: out + 'LIVE-job-page-fullpage.png', fullPage: true });
// open the Create Document/Email previewer
await page.click('button:has-text("Create Document/Email")');
await page.waitForTimeout(5000); // let the letter render
await page.screenshot({ path: out + 'LIVE-previewer-modal.png', fullPage: false });
console.log('done');
await browser.close();
