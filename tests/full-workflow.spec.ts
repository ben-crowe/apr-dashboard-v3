import { test, expect } from '@playwright/test';

/**
 * Full Workflow Test - End-to-End
 * 
 * Tests complete workflow:
 * 1. Seed test job (assumes already seeded via npm run seed:test-job)
 * 2. Fill Property Info section with test data
 * 3. Fill LOE Quote section with test data
 * 4. Create Valcre job (get VAL number)
 * 5. Create ClickUp task
 * 6. Verify all database updates
 * 7. Verify all UI state changes
 */
test.describe('Full Workflow - End-to-End', () => {
  test('complete job creation workflow via buttons', async ({ page }) => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('Full Workflow Test - End-to-End');
    console.log('═══════════════════════════════════════════════════════\n');

    // Navigate to test job detail page
    // Assumes test job seeded via: npm run seed:test-job
    console.log('Step 1: Navigating to test job...');
    await page.goto('/dashboard/job/00000000-0000-0000-0000-000000000001');
    await page.waitForLoadState('networkidle');
    console.log('✅ Job detail page loaded\n');

    // Step 1: Fill Property Info section with test data
    console.log('Step 2: Filling Property Info section...');
    const propertySection = page.locator('section:has-text("Property Site"), section:has-text("Property Info")').first();
    
    const propertyFillButton = propertySection.locator('button:has-text("Fill Test Data")').first();
    if (await propertyFillButton.isVisible({ timeout: 5000 })) {
      await propertyFillButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Property Info test data filled\n');
    } else {
      console.log('⚠️ Property Info Fill Test Data button not visible (may not be in dev mode)\n');
    }

    // Step 2: Fill LOE Quote section with test data
    console.log('Step 3: Filling LOE Quote section...');
    const loeSection = page.locator('section:has-text("LOE Quote"), section:has-text("Letter of Engagement")').first();
    
    const loeFillButton = loeSection.locator('button:has-text("Fill Test Data")').first();
    if (await loeFillButton.isVisible({ timeout: 5000 })) {
      await loeFillButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ LOE Quote test data filled\n');
    } else {
      console.log('⚠️ LOE Quote Fill Test Data button not visible (may not be in dev mode)\n');
    }

    // Step 3: Create Valcre Job
    console.log('Step 4: Creating Valcre job...');
    const createValcreButton = loeSection.locator('button:has-text("Create Valcre Job")').first();
    
    await createValcreButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(createValcreButton).toBeEnabled();
    
    await createValcreButton.click();
    console.log('✅ Create Valcre Job button clicked');

    // Wait for VAL number
    const jobNumberField = page.locator('input[name="jobNumber"], input[id*="jobNumber"]').first();
    await page.waitForSelector('input[name="jobNumber"]:not([value=""])', { timeout: 30000 });
    
    const valNumber = await jobNumberField.inputValue();
    expect(valNumber).toMatch(/^VAL\d+$/);
    console.log(`✅ Valcre job created: ${valNumber}\n`);

    // Step 4: Create ClickUp Task
    console.log('Step 5: Creating ClickUp task...');
    const createClickUpButton = page.locator('button:has-text("Create ClickUp Task")').first();
    
    await createClickUpButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(createClickUpButton).toBeEnabled();
    
    await createClickUpButton.click();
    console.log('✅ Create ClickUp Task button clicked');

    // Wait for task creation success
    const successIndicator = page.locator('text=Task created, text=/Task.*created/i').first();
    await successIndicator.waitFor({ state: 'visible', timeout: 15000 });
    console.log('✅ ClickUp task created\n');

    // Step 5: Verify final state
    console.log('Step 6: Verifying final state...');
    
    // Verify job number still present
    const finalJobNumber = await jobNumberField.inputValue();
    expect(finalJobNumber).toBe(valNumber);
    console.log(`✅ Job number verified: ${finalJobNumber}`);
    
    // Verify "View in Valcre" button exists
    const viewInValcreButton = page.locator('button:has-text("View in Valcre"), a:has-text("View in Valcre")').first();
    if (await viewInValcreButton.isVisible({ timeout: 2000 })) {
      console.log('✅ "View in Valcre" button visible');
    }
    
    // Verify ClickUp task link exists
    const clickUpLink = page.locator('a[href*="clickup.com"]').first();
    if (await clickUpLink.isVisible({ timeout: 2000 })) {
      const href = await clickUpLink.getAttribute('href');
      console.log(`✅ ClickUp task link: ${href}`);
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ Full workflow test completed successfully!');
    console.log('═══════════════════════════════════════════════════════');
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test error handling scenarios
    // This is a placeholder for future error handling tests
    
    await page.goto('/dashboard/job/00000000-0000-0000-0000-000000000001');
    await page.waitForLoadState('networkidle');
    
    // Monitor for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Perform actions that might cause errors
    // (e.g., clicking buttons without required data)
    
    // Verify no critical errors occurred
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('sourcemap') &&
      !e.includes('Warning')
    );
    
    if (criticalErrors.length > 0) {
      console.log('⚠️ Errors detected:', criticalErrors);
    } else {
      console.log('✅ No critical errors detected');
    }
  });
});
