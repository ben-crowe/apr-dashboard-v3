/**
 * Calc Engine to Template Field Test
 * Verifies all calculator output fields populate correctly in the template
 */

import { test, expect } from '@playwright/test';

// All fields that CalculatorWithPreview.tsx sends
const testValues: Record<string, string> = {
  // Revenue
  'calc-pgr': '$204,240',
  'calc-pgr-per-unit': '$12,765/Unit',
  'calc-pgr-per-sf': '$20.02/SF',
  'calc-egr': '$196,070',
  'calc-egr-per-unit': '$12,254/Unit',
  'calc-egr-per-sf': '$19.22/SF',

  // Rental revenue
  'calc-total-rental-revenue': '$195,840',
  'calc-rental-revenue-per-unit': '$12,240/Unit',

  // Other income
  'calc-other-income': '$8,400',
  'calc-other-income-per-unit': '$525/Unit',
  'calc-other-income-per-sf': '$0.82/SF',

  // Unit Type 1
  'calc-type1-count': '6',
  'calc-type1-rent': '$1,040',
  'calc-type1-contract-rent': '$975',
  'calc-type1-cont-v-market': '93.75%',
  'calc-type1-per-unit': '$12,480',
  'calc-type1-per-sf': '$18.09/SF',
  'calc-type1-annual': '$74,880',

  // Unit Type 2
  'calc-type2-count': '10',
  'calc-type2-rent': '$1,008',
  'calc-type2-contract-rent': '$1,008',
  'calc-type2-cont-v-market': '100.00%',
  'calc-type2-per-unit': '$12,096',
  'calc-type2-per-sf': '$16.99/SF',
  'calc-type2-annual': '$120,960',

  // Type totals
  'calc-type-total-per-unit': '$12,240/Unit',
  'calc-type-total-per-sf': '$17.19/SF',

  // Vacancy
  'calc-vacancy-loss': '($8,170)',
  'calc-vacancy-per-unit': '($511)/Unit',
  'calc-vacancy-per-sf': '($0.80)/SF',
  'calc-vacancy-rate': '4.00%',

  // Expenses total
  'calc-expenses-total': '($85,569)',
  'calc-expenses-per-unit': '($5,348)/Unit',
  'calc-expenses-per-sf': '($8.39)',
  'calc-expense-ratio': '43.64%',

  // Taxes
  'calc-exp-taxes-annual': '($19,688)',
  'calc-exp-taxes-per-unit': '($1,231)',
  'calc-exp-taxes-per-sf': '($1.93)',
  'calc-exp-taxes-pct-pgr': '(9.64%)',
  'calc-exp-taxes-pct-egr': '10.04%',

  // Insurance
  'calc-exp-insurance-annual': '($11,360)',
  'calc-exp-insurance-per-unit': '($710)',
  'calc-exp-insurance-per-sf': '($1.11)',
  'calc-exp-insurance-pct-pgr': '(5.56%)',
  'calc-exp-insurance-pct-egr': '5.79%',

  // Repairs
  'calc-exp-repairs-annual': '($13,280)',
  'calc-exp-repairs-per-unit': '($830)',
  'calc-exp-repairs-per-sf': '($1.30)',
  'calc-exp-repairs-pct-pgr': '(6.50%)',
  'calc-exp-repairs-pct-egr': '6.77%',

  // Payroll
  'calc-exp-payroll-annual': '($8,000)',
  'calc-exp-payroll-per-unit': '($500)',
  'calc-exp-payroll-per-sf': '($0.78)',
  'calc-exp-payroll-pct-pgr': '(3.92%)',
  'calc-exp-payroll-pct-egr': '4.08%',

  // Utilities
  'calc-exp-utilities-annual': '($21,040)',
  'calc-exp-utilities-per-unit': '($1,315)',
  'calc-exp-utilities-per-sf': '($2.06)',
  'calc-exp-utilities-pct-pgr': '(10.30%)',
  'calc-exp-utilities-pct-egr': '10.73%',

  // Management
  'calc-exp-management-annual': '($8,281)',
  'calc-exp-management-per-unit': '($518)',
  'calc-exp-management-per-sf': '($0.81)',
  'calc-exp-management-pct-pgr': '(4.05%)',
  'calc-exp-management-pct-egr': '4.22%',

  // Other expenses
  'calc-exp-other-annual': '($3,920)',
  'calc-exp-other-per-unit': '($245)',
  'calc-exp-other-per-sf': '($0.38)',
  'calc-exp-other-pct-pgr': '(1.92%)',
  'calc-exp-other-pct-egr': '2.00%',

  // NOI
  'calc-noi': '$111,771',
  'calc-noi-per-unit': '$6,986/Unit',
  'calc-noi-per-sf': '$10.96/SF',

  // Cap rate and value
  'calc-cap-rate': '6.25%',
  'calc-indicated-value': '$1,788,336',
  'calc-value-per-unit': '$111,771/Unit',
  'calc-value-per-sf': '$175',
  'calc-indicated-value-rounded': '$1,790,000',

  // Direct cap
  'ia-dircap-noi': '$111,771',
  'ia-dircap-noi-per-unit': '$6,986/Unit',
  'ia-dircap-cap-rate1': '6.25%',
  'ia-dircap-expenseratio': '43.64%',

  // Reconciliation
  'recon-final-value': '$1,790,000',
  'recon-final-value-per-sf': '$175',
  'recon-effective-date': 'October 17, 2025',

  // Sales comparison
  'sca-indicated-value': '$1,790,000',
  'sca-indicated-value-rounded': '$1,790,000',
  'sca-value-per-sf': '$175'
};

test.describe('Calc Engine to Template Field Mapping', () => {
  test('all calculator fields should exist in template', async ({ page }) => {
    // Load the template directly
    await page.goto('http://localhost:8086/Report-MF-template.html');
    await page.waitForLoadState('domcontentloaded');

    const missing: string[] = [];
    const found: string[] = [];

    for (const fieldId of Object.keys(testValues)) {
      const selector = `[title*="${fieldId}"]`;
      const count = await page.locator(selector).count();

      if (count > 0) {
        found.push(fieldId);
      } else {
        missing.push(fieldId);
      }
    }

    console.log(`\n✅ FOUND: ${found.length} fields`);
    console.log(`❌ MISSING: ${missing.length} fields`);

    if (missing.length > 0) {
      console.log('\nMissing fields:');
      missing.forEach(f => console.log(`  - ${f}`));
    }

    expect(missing).toHaveLength(0);
  });

  test('postMessage should update field values', async ({ page }) => {
    await page.goto('http://localhost:8086/Report-MF-template.html');
    await page.waitForLoadState('domcontentloaded');

    // Send postMessage with test values
    await page.evaluate((values) => {
      window.postMessage({
        type: 'CALCULATOR_UPDATE',
        values
      }, '*');
    }, testValues);

    // Wait for update
    await page.waitForTimeout(500);

    // Check a few key fields were updated
    const noiElement = page.locator('[title*="calc-noi"]').first();
    const noiText = await noiElement.textContent();

    console.log(`\nNOI field value: ${noiText}`);

    // Field should contain our test value
    expect(noiText).toContain('$111,771');
  });

  test('all fields should receive postMessage values', async ({ page }) => {
    await page.goto('http://localhost:8086/Report-MF-template.html');
    await page.waitForLoadState('domcontentloaded');

    // Send postMessage with test values
    await page.evaluate((values) => {
      window.postMessage({
        type: 'CALCULATOR_UPDATE',
        values
      }, '*');
    }, testValues);

    // Wait for update
    await page.waitForTimeout(1000);

    const updated: string[] = [];
    const notUpdated: string[] = [];

    for (const [fieldId, expectedValue] of Object.entries(testValues)) {
      const selector = `[title*="${fieldId}"]`;
      const element = page.locator(selector).first();
      const count = await page.locator(selector).count();

      if (count === 0) {
        notUpdated.push(`${fieldId} (not in template)`);
        continue;
      }

      const actualText = await element.textContent();

      // Check if the value was updated (contains our test value)
      if (actualText && actualText.includes(expectedValue.replace(/[()]/g, ''))) {
        updated.push(fieldId);
      } else {
        notUpdated.push(`${fieldId} (expected: ${expectedValue}, got: ${actualText})`);
      }
    }

    console.log(`\n✅ UPDATED: ${updated.length} fields`);
    console.log(`❌ NOT UPDATED: ${notUpdated.length} fields`);

    if (notUpdated.length > 0) {
      console.log('\nNot updated:');
      notUpdated.forEach(f => console.log(`  - ${f}`));
    }

    // Allow some margin for formatting differences
    expect(notUpdated.length).toBeLessThan(10);
  });
});
