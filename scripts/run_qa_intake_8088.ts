import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const outDir = '/Users/bencrowe/Development/APR-Dashboard-v3/builds/5-AG-Reports/2026-03-31-intake-8088/recordings/';
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    // Keep consistent viewport
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        recordVideo: { dir: outDir }
    });
    const page = await context.newPage();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        console.log("Navigating to form on 8088...");
        await page.goto('http://localhost:8088');
        await delay(2000);
        
        console.log("Clicking Test Data...");
        await page.click('text="Test Data"');
        await delay(2000);

        async function slowSelect(nameOrAria) {
            try {
                const trigger = page.locator(`select[name="${nameOrAria}"]`).first();
                if (await trigger.count() > 0) {
                    await trigger.click();
                    await delay(1500); 
                    await trigger.press('ArrowDown');
                    await delay(500);
                    await trigger.press('Enter');
                } else {
                    await page.click(`text="${nameOrAria}"`);
                    await delay(1500);
                    await page.keyboard.press('ArrowDown');
                    await delay(500);
                    await page.keyboard.press('Enter');
                }
                await delay(1000);
            } catch (e) {
                console.log(`Could not slowly select for ${nameOrAria}`);
            }
        }

        await slowSelect('propertyType');
        await slowSelect('intendedUse');
        await slowSelect('valuationPremise');
        await slowSelect('assetCondition');

        console.log("Scrolling form top to bottom...");
        await page.evaluate(() => window.scrollTo(0, 0));
        await delay(1000);
        await page.evaluate(() => window.scrollTo(0, 500));
        await delay(1000);
        await page.evaluate(() => window.scrollTo(0, 1000));
        await delay(1000);
        await page.evaluate(() => window.scrollTo(0, window.document.body.scrollHeight));
        await delay(1000);

        console.log("Submitting form...");
        await page.click('button[type="submit"]', { timeout: 3000 }).catch(() => page.click('text="Submit"').catch(() => page.click('text="Submit Appraisal Request"')));

        await delay(3000);
        
        // Wait just a bit to finalize video
        await delay(1000);
    } catch (e) {
        console.error(e);
    } finally {
        await context.close();
        await browser.close();
    }
})();
