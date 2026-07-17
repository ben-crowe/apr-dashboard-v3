// Retry the two missed flow states (email compose, studio document view), dark theme.
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const out = process.env.HOME + '/Development/KM-Exp/data/screenshots/stitch-apr-review/sweep/html/';
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

// email compose: previewer -> Continue to Email directly (no editor detour)
await tryStep('email-compose', async () => {
  await page.click('button:has-text("Create Document/Email")');
  await page.waitForTimeout(5000);
  await page.click('button:has-text("Continue to Email")', { timeout: 10000 });
  await page.waitForTimeout(3000);
  await dump('04d-email-compose');
});
await page.keyboard.press('Escape');
await page.waitForTimeout(800);
await page.keyboard.press('Escape');
await page.waitForTimeout(800);

// studio document view: Asset Studio -> click a document card (try several selectors)
await tryStep('studio-document-view', async () => {
  await page.click('text=Asset Studio');
  await page.waitForTimeout(4000);
  const candidates = ['text=LOE Document', 'text=Letter of Engagement', 'text=LOE', 'text=Document'];
  let clicked = false;
  for (const sel of candidates) {
    try { await page.locator(sel).first().click({ timeout: 3000 }); clicked = true; break; } catch {}
  }
  if (!clicked) throw new Error('no document row matched');
  await page.waitForTimeout(4000);
  await dump('06d-studio-document');
});
console.log(JSON.stringify(log, null, 1));
await browser.close();
