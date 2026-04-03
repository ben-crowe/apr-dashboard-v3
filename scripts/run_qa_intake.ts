import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    // Keep consistent viewport for good video
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        recordVideo: { dir: '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/' }
    });
    const page = await context.newPage();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        console.log("Navigating to form...");
        await page.goto('http://localhost:8087');
        await delay(2000);
        
        console.log("Clicking Test Data...");
        await page.click('text="Test Data"');
        await delay(2000);

        // Tweak a text field
        await page.fill('input[name="propertyName"]', 'Bayview Commerce Centre (Updated)');
        await delay(1000);

        console.log("Interacting with dropdowns slowly...");
        
        async function slowSelect(nameOrAria, optionText) {
            try {
                // Find dropdown trigger (could be a select or combobox or button)
                const trigger = page.locator(`select[name="${nameOrAria}"]`).first();
                if (await trigger.count() > 0) {
                    await trigger.click();
                    await delay(1500);
                    await trigger.selectOption({ label: optionText });
                } else {
                    // Custom dropdown - attempt to click sibling or label
                    await page.click(`text="${nameOrAria}"`);
                    await delay(1500);
                    await page.click(`text="${optionText}"`);
                }
                await delay(500);
            } catch (e) {
                console.log(`Could not select ${optionText} for ${nameOrAria}`);
            }
        }

        await slowSelect('propertyType', 'Office');
        await slowSelect('intendedUse', 'First Mortgage Financing');
        await slowSelect('valuationPremise', 'Market Value');
        await slowSelect('assetCondition', 'Good');

        console.log("Uploading file...");
        await page.setInputFiles('input[type="file"]', '/Users/bencrowe/Development/APR-Dashboard-v3/scripts/run_qa.ts');
        await delay(1000);

        console.log("Scrolling back up, then down to show the form...");
        await page.evaluate(() => window.scrollTo(0, 0));
        await delay(1000);
        await page.evaluate(() => window.scrollTo(0, 500));
        await delay(1000);
        await page.evaluate(() => window.scrollTo(0, window.document.body.scrollHeight));
        await delay(1000);

        console.log("Submitting...");
        await page.click('button[type="submit"]', { timeout: 3000 }).catch(() => page.click('text="Submit"').catch(() => page.click('text="Submit Appraisal Request"')));

        await delay(3000); // wait for success screen
        
        console.log("Taking screenshot...");
        await page.screenshot({ path: '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/07-form-submit-success.png', fullPage: true });

        // wait a little bit to ensure recording is finished
        await delay(1000);
    } catch (e) {
        console.error(e);
    } finally {
        await context.close();
        await browser.close();
    }
})();
