# Income Section Template Implementation Guide

**File:** `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportHtmlTemplate.ts`

**Task:** Replace generic section rendering for the INCOME section with a proper formatted template matching Section 17 from V4-REPORT-TEMPLATE-SPECIFICATION.md

## Implementation Overview

The INCOME section (id: 'income') needs a custom template that renders:
1. Pro Forma Operating Statement Table
2. Direct Capitalization section
3. Value Calculation Table

## Step 1: Add CSS Styles

Add these CSS classes to the `<style>` section (after line 475):

```css
/* Financial Table Styles */
.financial-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 11px;
}

.financial-table th {
  background: #f3f4f6;
  border: 1px solid #bfbfbf;
  padding: 0.5rem;
  text-align: left;
  font-weight: bold;
  color: #1f2937;
}

.financial-table .line-item-col {
  width: 40%;
  text-align: left;
}

.financial-table .amount-col,
.financial-table .per-unit-col,
.financial-table .percent-col {
  width: 20%;
  text-align: right;
}

.financial-table td {
  border: 1px solid #bfbfbf;
  padding: 0.4rem 0.5rem;
}

.financial-table .line-item {
  text-align: left;
  padding-left: 1rem;
}

.financial-table .amount,
.financial-table .per-unit,
.financial-table .percent {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.financial-table .negative {
  color: #dc2626;
}

.financial-table .section-header-row td {
  background: #e5e7eb;
  padding: 0.5rem;
  font-weight: bold;
  border: 1px solid #bfbfbf;
}

.financial-table .subtotal-row {
  background: #f9fafb;
  border-top: 2px solid #1a365d;
}

.financial-table .total-row {
  background: #e5e7eb;
  border-top: 3px double #1a365d;
  border-bottom: 3px double #1a365d;
  font-weight: bold;
}

.financial-table .spacer-row {
  height: 0.5rem;
  border: none;
}

.financial-table .spacer-row td {
  border: none;
  padding: 0;
}

/* Value Calculation Table */
.value-calculation-table {
  width: 60%;
  margin: 1rem auto;
  border-collapse: collapse;
  font-size: 12px;
}

.value-calculation-table th {
  background: #f3f4f6;
  border: 1px solid #bfbfbf;
  padding: 0.5rem;
  text-align: left;
  font-weight: bold;
  color: #1f2937;
}

.value-calculation-table .component-col {
  width: 60%;
  text-align: left;
}

.value-calculation-table .value-col {
  width: 40%;
  text-align: right;
}

.value-calculation-table td {
  border: 1px solid #bfbfbf;
  padding: 0.5rem;
}

.value-calculation-table .component {
  text-align: left;
}

.value-calculation-table .value {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.value-calculation-table .total-row {
  background: #e5e7eb;
  border-top: 3px double #1a365d;
  font-weight: bold;
  font-size: 13px;
}
```

## Step 2: Update formatCurrency Helper

Replace the existing `formatCurrency` function (around line 68) to accept both string and number:

```typescript
const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  if (isNaN(num)) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};
```

## Step 3: Add renderIncomeSection Function

Add this function after the `renderSiteSection` function (similar pattern):

```typescript
// Function to render the Income Approach section with custom template
const renderIncomeSection = (section: ReportSection): string => {
  // Get values from subsections
  const pgi = getFieldValue(section, 'income-pgi');
  const vacancyRate = getFieldValue(section, 'income-vacancy-rate');
  const vacancyLoss = getFieldValue(section, 'income-vacancy-loss');
  const otherIncome = getFieldValue(section, 'income-other-income');
  const egi = getFieldValue(section, 'income-egi');
  const totalGross = getFieldValue(section, 'income-total-gross');

  const expenseManagement = getFieldValue(section, 'expense-management');
  const expenseInsurance = getFieldValue(section, 'expense-insurance');
  const expensePropertyTax = getFieldValue(section, 'expense-property-tax');
  const expenseUtilities = getFieldValue(section, 'expense-utilities');
  const expenseRepairs = getFieldValue(section, 'expense-repairs');
  const expenseJanitorial = getFieldValue(section, 'expense-janitorial');
  const expenseLandscaping = getFieldValue(section, 'expense-landscaping');
  const expenseProfessional = getFieldValue(section, 'expense-professional');
  const expenseReserves = getFieldValue(section, 'expense-reserves');
  const expenseOther = getFieldValue(section, 'expense-other');
  const totalExpenses = getFieldValue(section, 'expense-total');

  const noi = getFieldValue(section, 'income-noi');
  const capRate = getFieldValue(section, 'income-cap-rate');
  const incomeValue = getFieldValue(section, 'income-value-indication');
  const analysisNotes = getFieldValue(section, 'income-analysis-notes');

  // Get total units for per-unit calculations
  const totalUnitsNum = parseFloat(totalUnits) || 1;

  // Convert to numbers
  const pgiNum = parseFloat(pgi) || 0;
  const vacancyLossNum = parseFloat(vacancyLoss) || 0;
  const otherIncomeNum = parseFloat(otherIncome) || 0;
  const totalGrossNum = parseFloat(totalGross) || 0;

  const expManagementNum = parseFloat(expenseManagement) || 0;
  const expInsuranceNum = parseFloat(expenseInsurance) || 0;
  const expPropertyTaxNum = parseFloat(expensePropertyTax) || 0;
  const expUtilitiesNum = parseFloat(expenseUtilities) || 0;
  const expRepairsNum = parseFloat(expenseRepairs) || 0;
  const expJanitorialNum = parseFloat(expenseJanitorial) || 0;
  const expLandscapingNum = parseFloat(expenseLandscaping) || 0;
  const expProfessionalNum = parseFloat(expenseProfessional) || 0;
  const expReservesNum = parseFloat(expenseReserves) || 0;
  const expOtherNum = parseFloat(expenseOther) || 0;
  const totalExpensesNum = parseFloat(totalExpenses) || 0;

  const noiNum = parseFloat(noi) || 0;

  // Calculate percentages based on EGI (Total Gross Income)
  const vacancyPct = totalGrossNum > 0 ? ((vacancyLossNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expManagementPct = totalGrossNum > 0 ? ((expManagementNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expInsurancePct = totalGrossNum > 0 ? ((expInsuranceNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expPropertyTaxPct = totalGrossNum > 0 ? ((expPropertyTaxNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expUtilitiesPct = totalGrossNum > 0 ? ((expUtilitiesNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expRepairsPct = totalGrossNum > 0 ? ((expRepairsNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expJanitorialPct = totalGrossNum > 0 ? ((expJanitorialNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expLandscapingPct = totalGrossNum > 0 ? ((expLandscapingNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expProfessionalPct = totalGrossNum > 0 ? ((expProfessionalNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expReservesPct = totalGrossNum > 0 ? ((expReservesNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const expOtherPct = totalGrossNum > 0 ? ((expOtherNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const totalExpensesPct = totalGrossNum > 0 ? ((totalExpensesNum / totalGrossNum) * 100).toFixed(1) : '0.0';
  const noiPct = totalGrossNum > 0 ? ((noiNum / totalGrossNum) * 100).toFixed(1) : '0.0';

  // Calculate per-unit values
  const pgiPerUnit = pgiNum / totalUnitsNum;
  const vacancyPerUnit = vacancyLossNum / totalUnitsNum;
  const otherIncomePerUnit = otherIncomeNum / totalUnitsNum;
  const totalGrossPerUnit = totalGrossNum / totalUnitsNum;
  const expManagementPerUnit = expManagementNum / totalUnitsNum;
  const expInsurancePerUnit = expInsuranceNum / totalUnitsNum;
  const expPropertyTaxPerUnit = expPropertyTaxNum / totalUnitsNum;
  const expUtilitiesPerUnit = expUtilitiesNum / totalUnitsNum;
  const expRepairsPerUnit = expRepairsNum / totalUnitsNum;
  const expJanitorialPerUnit = expJanitorialNum / totalUnitsNum;
  const expLandscapingPerUnit = expLandscapingNum / totalUnitsNum;
  const expProfessionalPerUnit = expProfessionalNum / totalUnitsNum;
  const expReservesPerUnit = expReservesNum / totalUnitsNum;
  const expOtherPerUnit = expOtherNum / totalUnitsNum;
  const totalExpensesPerUnit = totalExpensesNum / totalUnitsNum;
  const noiPerUnit = noiNum / totalUnitsNum;

  return `
  <div class="section">
    <h2 class="section-title">${section.name}</h2>

    ${analysisNotes ? `
      <div class="field-group">
        <div class="field-label">Income Analysis:</div>
        <div class="field-value">${analysisNotes}</div>
      </div>
    ` : ''}

    <h3 class="subsection-title">Pro Forma Operating Statement</h3>

    <table class="financial-table">
      <thead>
        <tr>
          <th class="line-item-col">Line Item</th>
          <th class="amount-col">Amount</th>
          <th class="per-unit-col">$/Unit</th>
          <th class="percent-col">% of EGI</th>
        </tr>
      </thead>
      <tbody>
        <tr class="section-header-row">
          <td colspan="4"><strong>Revenue</strong></td>
        </tr>
        <tr>
          <td class="line-item">Potential Gross Income</td>
          <td class="amount">${formatCurrency(pgiNum)}</td>
          <td class="per-unit">${formatCurrency(pgiPerUnit)}</td>
          <td class="percent"></td>
        </tr>
        <tr>
          <td class="line-item">Less: Vacancy & Collection Loss</td>
          <td class="amount negative">(${formatCurrency(vacancyLossNum)})</td>
          <td class="per-unit negative">(${formatCurrency(vacancyPerUnit)})</td>
          <td class="percent">${vacancyPct}%</td>
        </tr>
        <tr>
          <td class="line-item">Add: Other Income</td>
          <td class="amount">${formatCurrency(otherIncomeNum)}</td>
          <td class="per-unit">${formatCurrency(otherIncomePerUnit)}</td>
          <td class="percent"></td>
        </tr>
        <tr class="subtotal-row">
          <td class="line-item"><strong>Effective Gross Income</strong></td>
          <td class="amount"><strong>${formatCurrency(totalGrossNum)}</strong></td>
          <td class="per-unit"><strong>${formatCurrency(totalGrossPerUnit)}</strong></td>
          <td class="percent"><strong>100.0%</strong></td>
        </tr>
        <tr class="spacer-row">
          <td colspan="4"></td>
        </tr>
        <tr class="section-header-row">
          <td colspan="4"><strong>Operating Expenses</strong></td>
        </tr>
        <tr>
          <td class="line-item">Management Fees</td>
          <td class="amount">${formatCurrency(expManagementNum)}</td>
          <td class="per-unit">${formatCurrency(expManagementPerUnit)}</td>
          <td class="percent">${expManagementPct}%</td>
        </tr>
        <tr>
          <td class="line-item">Insurance</td>
          <td class="amount">${formatCurrency(expInsuranceNum)}</td>
          <td class="per-unit">${formatCurrency(expInsurancePerUnit)}</td>
          <td class="percent">${expInsurancePct}%</td>
        </tr>
        <tr>
          <td class="line-item">Property Taxes</td>
          <td class="amount">${formatCurrency(expPropertyTaxNum)}</td>
          <td class="per-unit">${formatCurrency(expPropertyTaxPerUnit)}</td>
          <td class="percent">${expPropertyTaxPct}%</td>
        </tr>
        <tr>
          <td class="line-item">Utilities</td>
          <td class="amount">${formatCurrency(expUtilitiesNum)}</td>
          <td class="per-unit">${formatCurrency(expUtilitiesPerUnit)}</td>
          <td class="percent">${expUtilitiesPct}%</td>
        </tr>
        <tr>
          <td class="line-item">Repairs & Maintenance</td>
          <td class="amount">${formatCurrency(expRepairsNum)}</td>
          <td class="per-unit">${formatCurrency(expRepairsPerUnit)}</td>
          <td class="percent">${expRepairsPct}%</td>
        </tr>
        ${expJanitorialNum > 0 ? `
        <tr>
          <td class="line-item">Janitorial</td>
          <td class="amount">${formatCurrency(expJanitorialNum)}</td>
          <td class="per-unit">${formatCurrency(expJanitorialPerUnit)}</td>
          <td class="percent">${expJanitorialPct}%</td>
        </tr>
        ` : ''}
        ${expLandscapingNum > 0 ? `
        <tr>
          <td class="line-item">Landscaping</td>
          <td class="amount">${formatCurrency(expLandscapingNum)}</td>
          <td class="per-unit">${formatCurrency(expLandscapingPerUnit)}</td>
          <td class="percent">${expLandscapingPct}%</td>
        </tr>
        ` : ''}
        ${expProfessionalNum > 0 ? `
        <tr>
          <td class="line-item">Professional Fees</td>
          <td class="amount">${formatCurrency(expProfessionalNum)}</td>
          <td class="per-unit">${formatCurrency(expProfessionalPerUnit)}</td>
          <td class="percent">${expProfessionalPct}%</td>
        </tr>
        ` : ''}
        ${expReservesNum > 0 ? `
        <tr>
          <td class="line-item">Replacement Reserves</td>
          <td class="amount">${formatCurrency(expReservesNum)}</td>
          <td class="per-unit">${formatCurrency(expReservesPerUnit)}</td>
          <td class="percent">${expReservesPct}%</td>
        </tr>
        ` : ''}
        ${expOtherNum > 0 ? `
        <tr>
          <td class="line-item">Other Expenses</td>
          <td class="amount">${formatCurrency(expOtherNum)}</td>
          <td class="per-unit">${formatCurrency(expOtherPerUnit)}</td>
          <td class="percent">${expOtherPct}%</td>
        </tr>
        ` : ''}
        <tr class="subtotal-row">
          <td class="line-item"><strong>Total Operating Expenses</strong></td>
          <td class="amount"><strong>${formatCurrency(totalExpensesNum)}</strong></td>
          <td class="per-unit"><strong>${formatCurrency(totalExpensesPerUnit)}</strong></td>
          <td class="percent"><strong>${totalExpensesPct}%</strong></td>
        </tr>
        <tr class="spacer-row">
          <td colspan="4"></td>
        </tr>
        <tr class="total-row">
          <td class="line-item"><strong>Net Operating Income</strong></td>
          <td class="amount"><strong>${formatCurrency(noiNum)}</strong></td>
          <td class="per-unit"><strong>${formatCurrency(noiPerUnit)}</strong></td>
          <td class="percent"><strong>${noiPct}%</strong></td>
        </tr>
      </tbody>
    </table>

    <h3 class="subsection-title" style="margin-top: 2rem;">Direct Capitalization</h3>

    <div class="field-group">
      <p>The net operating income is capitalized at a market-derived capitalization rate to determine the indicated value by the Income Approach.</p>
    </div>

    <table class="value-calculation-table">
      <thead>
        <tr>
          <th class="component-col">Component</th>
          <th class="value-col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="component">Net Operating Income</td>
          <td class="value">${formatCurrency(noiNum)}</td>
        </tr>
        <tr>
          <td class="component">Capitalization Rate</td>
          <td class="value">${capRate}%</td>
        </tr>
        <tr class="total-row">
          <td class="component"><strong>Indicated Value</strong></td>
          <td class="value"><strong>${formatCurrency(incomeValue)}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
  `;
};
```

## Step 4: Update Section Rendering Logic

In the "Additional Sections" rendering (around line 695), find where sections are rendered and add a check for the income section:

```typescript
// Additional Sections
${sections.filter(s => s.id !== 'cover' && s.id !== 'exec' && s.id !== 'home' && s.id !== 'custom' && s.id !== 'report').map(section => {
  // Check if this is the income section - render with custom template
  if (section.id === 'income') {
    return `
<div class="page exec-page" style="position: relative;">
  <!-- Page Header -->
  <div class="page-header">
    <img src="/images/valta-logo-optimized.png" alt="Valta" class="page-header-logo" />
    <div class="page-header-title">
      <div>${propertyName || 'Appraisal Report'}</div>
      <div>${streetAddress ? streetAddress + ', ' : ''}${city || ''}</div>
    </div>
  </div>

  ${renderIncomeSection(section)}

  <!-- Page Footer -->
  <div class="page-footer">
    <div class="page-footer-left">${fileNumber || ''}</div>
    <div class="page-footer-right">${appraiserCompany || 'Valta Property Valuations Ltd.'}</div>
  </div>
</div>
    `;
  }

  // Check if this is the site section - render with custom template
  if (section.id === 'site') {
    return renderSiteSection(section);
  }

  // Generic section rendering for all other sections
  return `
<div class="page exec-page" style="position: relative;">
  <!-- Generic rendering code... -->
</div>
  `;
}).join('')}
```

## Data Source

The income section data comes from:
- Section ID: `income`
- Subsections:
  - `potential-income` - Contains PGI, vacancy, other income fields
  - `operating-expenses` - Contains all expense line items
  - `net-operating-income` - Contains NOI, cap rate, value indication
  - `income-analysis-notes` - Contains narrative analysis

## Field Mappings

### Revenue Fields
- `income-pgi` - Potential Gross Income
- `income-vacancy-rate` - Vacancy percentage
- `income-vacancy-loss` - Calculated vacancy amount
- `income-other-income` - Other income (parking, laundry, etc.)
- `income-total-gross` - Total EGI

### Expense Fields
- `expense-management` - Management fees
- `expense-insurance` - Insurance
- `expense-property-tax` - Property taxes
- `expense-utilities` - Utilities
- `expense-repairs` - Repairs & Maintenance
- `expense-janitorial` - Janitorial (optional)
- `expense-landscaping` - Landscaping (optional)
- `expense-professional` - Professional fees (optional)
- `expense-reserves` - Replacement reserves (optional)
- `expense-other` - Other expenses (optional)
- `expense-total` - Total expenses (calculated)

### NOI & Value Fields
- `income-noi` - Net Operating Income (calculated)
- `income-cap-rate` - Capitalization rate
- `income-value-indication` - Value from Income Approach (calculated)

## Visual Result

The rendered template will produce:

1. **Section Title:** "Income Approach"

2. **Pro Forma Operating Statement Table:**
   - Right-aligned numbers in monospace font
   - 4 columns: Line Item, Amount, $/Unit, % of EGI
   - Grouped sections: Revenue, Operating Expenses
   - Subtotal rows with gray background
   - Total NOI row with double border

3. **Direct Capitalization Section:**
   - Narrative explaining the approach
   - Value calculation table showing:
     - Net Operating Income
     - Capitalization Rate
     - Indicated Value (bold, highlighted)

## Testing

To test the implementation:

1. Navigate to the Income Approach section in the report builder
2. Enter sample data for PGI, expenses, and cap rate
3. Check the preview to verify:
   - Table formatting matches specification
   - Numbers are right-aligned and formatted as currency
   - Percentages calculate correctly
   - Per-unit values calculate correctly
   - Conditional expense rows only show when > 0

## Notes

- The template uses conditional rendering for optional expense lines (only shows if value > 0)
- All financial values use the `formatCurrency()` helper for consistent formatting
- Per-unit calculations divide by `totalUnits` from the executive summary section
- Percentages are calculated based on EGI (Total Gross Income) as the denominator
- The template follows the same pattern as the existing `renderSiteSection()` function

---

**Implementation Status:** Documentation complete - ready for manual implementation
**Reference:** V4-REPORT-TEMPLATE-SPECIFICATION.md Section 17
**File Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportHtmlTemplate.ts`
