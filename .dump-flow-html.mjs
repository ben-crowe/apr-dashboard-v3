// Capture rendered HTML (dark theme) at each document/email flow state,
// for building Stitch paired-reference files. Never clicks send actions.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const out = process.env.HOME + '/Development/KM-Exp/data/screenshots/stitch-apr-review/sweep/html/';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.addInitScript(() => {
  localStorage.setItem('theme', 'dark');
  document.documentElement.classList.add('dark');
});
const log = [];
async function dump(name) {
  await page.waitForTimeout(1200);
  const html = await page.content();
  writeFileSync(out + name + '.html', html);
  log.push(name + ' ' + html.length + 'b');
}
async function tryStep(desc, fn) {
  try { await fn(); } catch (e) { log.push('SKIP ' + desc + ': ' + String(e).split('\n')[0].slice(0, 90)); }
}

await page.goto('http://localhost:8086/dashboard/job/f4650e9b-c583-4ab7-bd89-f5f6e68ac37a');
await page.waitForSelector('text=VAL261070', { timeout: 20000 });
await page.waitForTimeout(2500);
await dump('01d-job-page');

await tryStep('previewer', async () => {
  await page.click('button:has-text("Create Document/Email")');
  await page.waitForTimeout(5000);
  await dump('02d-previewer');
});
await tryStep('edit-document', async () => {
  await page.click('button:has-text("Edit Document")');
  await page.waitForTimeout(4000);
  await dump('03d-document-editor');
});
await tryStep('email-compose', async () => {
  await page.click('button:has-text("Continue to Email")');
  await page.waitForTimeout(3000);
  await dump('04d-email-compose');
});
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);

await tryStep('asset-studio', async () => {
  await page.click('text=Asset Studio');
  await page.waitForTimeout(4000);
  await dump('05d-asset-studio');
});
await tryStep('studio-document-view', async () => {
  const docRow = page.locator('text=LOE').first();
  await docRow.click({ timeout: 5000 });
  await page.waitForTimeout(4000);
  await dump('06d-studio-document');
});
console.log(JSON.stringify(log, null, 1));
await browser.close();
