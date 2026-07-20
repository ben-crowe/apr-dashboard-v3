// Full document/email + e-signature area sweep — full-page live captures.
// SAFETY: never click Send to Valcre / actual send actions.
import { chromium } from 'playwright';
const out = process.env.HOME + '/Development/KM-Exp/data/screenshots/stitch-apr-review/sweep/';
import { mkdirSync } from 'fs';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const log = [];
async function shot(name, full = true) {
  await page.waitForTimeout(1200);
  await page.screenshot({ path: out + name + '.png', fullPage: full });
  log.push(name);
}
async function tryStep(desc, fn) {
  try { await fn(); } catch (e) { log.push('SKIP ' + desc + ': ' + String(e).split('\n')[0].slice(0, 90)); }
}
await page.goto('http://localhost:8086/dashboard/job/f4650e9b-c583-4ab7-bd89-f5f6e68ac37a');
await page.waitForSelector('text=VAL261070', { timeout: 20000 });
await page.waitForTimeout(2500);
await shot('01-job-page-full');

// 2) Previewer (Create Document/Email)
await tryStep('previewer', async () => {
  await page.click('button:has-text("Create Document/Email")');
  await page.waitForTimeout(5000);
  await shot('02-previewer-document', false);
});
// 3) Edit Document (template editor) from previewer
await tryStep('edit-document', async () => {
  await page.click('button:has-text("Edit Document")');
  await page.waitForTimeout(4000);
  await shot('03-document-editor', false);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
});
// 4) Continue to Email (compose view — does not send)
await tryStep('email-compose', async () => {
  await page.click('button:has-text("Continue to Email")');
  await page.waitForTimeout(3000);
  await shot('04-email-compose', false);
});
// close any modal
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);

// 5) Asset Studio
await tryStep('asset-studio', async () => {
  await page.click('text=Asset Studio');
  await page.waitForTimeout(4000);
  await shot('05-asset-studio', false);
});
// 6) inside studio: look for a document list/preview (split panel)
await tryStep('studio-document-view', async () => {
  const docRow = page.locator('text=LOE').first();
  await docRow.click({ timeout: 5000 });
  await page.waitForTimeout(4000);
  await shot('06-studio-document-split-panel', false);
});
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);

// 7) LOE section preview route (Preview & Send LOE — preview only)
await tryStep('loe-preview-route', async () => {
  await page.goto('http://localhost:8086/dashboard/job/f4650e9b-c583-4ab7-bd89-f5f6e68ac37a');
  await page.waitForSelector('text=VAL261070', { timeout: 20000 });
  await page.waitForTimeout(2000);
  const btn = page.locator('button:has-text("Preview & Send LOE"), button:has-text("Preview")').first();
  await btn.click({ timeout: 5000 });
  await page.waitForTimeout(5000);
  await shot('07-loe-direct-preview', false);
});
console.log(JSON.stringify(log, null, 1));
await browser.close();
