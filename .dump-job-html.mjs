import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const OUT = process.argv[2];
const URL = 'http://localhost:8086/dashboard/job/f4650e9b-c583-4ab7-bd89-f5f6e68ac37a';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 2000 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
const html = await page.content();
writeFileSync(OUT, html);
console.log('bytes:', html.length, 'client-info:', (html.match(/Client Information/g) || []).length);
await browser.close();
