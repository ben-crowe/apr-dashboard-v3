import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        recordVideo: { dir: '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/' }
    });
    const page = await context.newPage();

    // Need a generic wait, e.g. delay
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        console.log("Navigating to form...");
        await page.goto('http://localhost:8087');
        
        // Fill form
        await page.fill('input[name="clientName"]', 'Rachel Thornton');
        await page.fill('input[name="companyName"]', 'Thornton Associates');
        await page.fill('input[name="clientAddress"]', '100 King St West, Suite 4000 Toronto ON M5X 1E2');
        await page.fill('input[name="clientPhone"]', '(416) 882-3400');
        await page.fill('input[name="clientEmail"]', 'rachel.thornton@thorntonassociates.ca');
        await page.fill('input[name="propertyName"]', 'Bayview Commerce Centre');
        await page.fill('input[name="propertyAddress"]', '2800 Bayview Avenue North York ON M2K 1E6');
        
        // Let's assume there are selects or text inputs
        // Just fill the easiest matching inputs
        try { await page.selectOption('select[name="propertyType"]', { label: 'Office' }); } catch {}
        try { await page.fill('input[name="propertyType"]', 'Office'); } catch {}
        
        try { await page.selectOption('select[name="intendedUse"]', { label: 'First Mortgage Financing' }); } catch {}
        try { await page.fill('input[name="intendedUse"]', 'First Mortgage Financing'); } catch {}

        try { await page.selectOption('select[name="valuationPremise"]', { label: 'Market Value' }); } catch {}
        try { await page.fill('input[name="valuationPremise"]', 'Market Value'); } catch {}

        try { await page.selectOption('select[name="assetCondition"]', { label: 'Good' }); } catch {}
        try { await page.fill('input[name="assetCondition"]', 'Good'); } catch {}

        await page.fill('textarea[name="additionalInfo"]', '3-storey commercial office building, 45,000 sq ft, built 2012. Full appraisal required for refinancing.');

        // File upload
        await page.setInputFiles('input[type="file"]', '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/dummy-upload.txt');

        console.log("Submitting...");
        await page.click('button[type="submit"]', { timeout: 3000 }).catch(() => page.click('text="Submit"'));

        await delay(2000); // wait for success
        // screenshot 03
        await page.screenshot({ path: '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/03-form-success.png', fullPage: true });

        console.log("Go to dashboard...");
        await page.goto('http://localhost:8087/dashboard');
        await delay(3000);

        // Click on Rachel Thornton or Bayview Commerce Centre
        await page.click('text="Bayview Commerce Centre"').catch(() => page.click('text="Rachel Thornton"'));
        await delay(2000);
        await page.screenshot({ path: '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/04-dashboard-rachel-thornton.png', fullPage: true });

        console.log("Filling LOE...");
        // Select or fill
        try { await page.selectOption('select[name="propertyRights"]', { label: 'Fee Simple Interest' }); } catch {}
        try { await page.selectOption('select[name="scopeOfWork"]', { label: 'All Applicable' }); } catch {}
        try { await page.selectOption('select[name="paymentTerms"]', { label: 'NET 30 Days' }); } catch {}
        try { await page.selectOption('select[name="reportType"]', { label: 'Appraisal Report' }); } catch {}
        try { await page.fill('input[name="appraisalFee"]', '7500'); } catch {}
        try { await page.fill('input[name="retainerAmount"]', '3750'); } catch {}
        try { await page.fill('input[name="deliveryDate"]', '2026-06-15'); } catch {}
        await delay(1000);
        await page.screenshot({ path: '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/05-loe-filled.png', fullPage: true });

        console.log("Test Data click...");
        await page.click('text="Test Data"');
        await delay(2000);
        await page.screenshot({ path: '/Users/bencrowe/Development/APR-Dashboard-v3/builds/apr-field-audit/round6/06-building-info-filled.png', fullPage: true });

        console.log("Done");
    } catch (e) {
        console.error(e);
    } finally {
        await context.close();
        await browser.close();
    }
})();
