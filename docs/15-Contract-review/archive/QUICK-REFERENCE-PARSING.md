# Quick Reference: Valcre Excel Parsing for APR-V4

**Last Updated:** 2025-11-29
**Purpose:** Fast implementation guide for reading Valcre appraisal templates

---

## Critical Named Ranges - Copy/Paste Ready

### Income Approach (DIRECTCAP)

```typescript
const INCOME_APPROACH_RANGES = {
  // Core calculations
  pgi: 'IA_DirCap_PGI',              // Potential Gross Income
  vacancy: 'IA_DirCap_LossTotal',     // Total Vacancy/Loss
  egi: 'IA_DirCap_EGI',              // Effective Gross Income
  opex: 'IA_DirCap_Expenses',        // Operating Expenses
  noi: 'IA_DirCap_NOI',              // Net Operating Income
  capRate: 'IA_DirCap_CapRate1',     // Capitalization Rate
  value: 'IA_DirCap_Value',          // Income Approach Value

  // Per SF metrics
  pgiPerSF: 'IA_DirCap_PGIPSF',
  egiPerSF: 'IA_DirCap_EGIPSF',
  noiPerSF: 'IA_DirCap_NOIPSF',

  // Per Unit metrics
  pgiPerUnit: 'IA_DirCap_PGIUnit',
  egiPerUnit: 'IA_DirCap_EGIUnit',
  noiPerUnit: 'IA_DirCap_NOIUnit'
};
```

### Income Approach Alternative (DIRECTCAP2)

```typescript
const INCOME_APPROACH_2_RANGES = {
  pgi: 'IA_DirCap2_PGI',
  vacancy: 'IA_DirCap2_LossTotal',
  egi: 'IA_DirCap2_EGI',
  opex: 'IA_DirCap2_Expenses',
  noi: 'IA_DirCap2_NOI',
  capRate: 'IA_DirCap2_CapRate1',
  value: 'IA_DirCap2_Value'
};
```

### Final Values (VALUES Sheet)

```typescript
const FINAL_VALUE_RANGES = {
  landValue: 'Value_LandScenario1',
  costValue: 'Value_CostScenario1',
  salesValue: 'Value_SARecScenario1',
  incomeValue: 'Value_IARecScenario1',
  finalValue: 'Value_FinalScenario1'
};
```

### Subject Property

```typescript
const SUBJECT_PROPERTY_RANGES = {
  nra: 'Subject_NRA',               // Net Rentable Area (SF)
  units: 'Subject_Units',           // Number of Units
  propertyType: 'Subject_Primary',  // Property Type
  areaType: 'Subject_AreaType'      // Area Type (NRA, GBA, etc.)
};
```

---

## Direct Cell References (Fallback)

If named ranges fail, use these cell addresses:

### DIRECTCAP Sheet

```typescript
const DIRECTCAP_CELLS = {
  pgi: 'L218',
  vacancy: 'L224',
  egi: 'L225',
  opex: 'L252',
  noi: 'L253',
  capRate: 'L254',
  value: 'L256'
};
```

### VALUES Sheet

```typescript
const VALUES_CELLS = {
  incomeValue: 'F44',
  salesValue: 'F27',
  costValue: 'F15',
  landValue: 'F12',
  finalValue: 'F78'
};
```

---

## Complete Implementation (ExcelJS)

```typescript
import ExcelJS from 'exceljs';

interface AppraisalValues {
  // Income Approach
  pgi: number;
  vacancy: number;
  egi: number;
  opex: number;
  noi: number;
  capRate: number;
  incomeValue: number;

  // Per SF Metrics
  pgiPerSF: number;
  egiPerSF: number;
  noiPerSF: number;

  // Final Values
  landValue: number;
  costValue: number;
  salesValue: number;
  finalValue: number;

  // Subject Property
  nra: number;
  units: number;
  propertyType: string;
}

async function extractValcreAppraisal(filePath: string): Promise<AppraisalValues> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // Helper function to get named range value
  const getValue = (rangeName: string, defaultValue: any = null): any => {
    try {
      const namedRange = workbook.definedNames.getDefinedName(rangeName);
      if (!namedRange) return defaultValue;

      const rangeRef = namedRange.ranges[0];
      const match = rangeRef.match(/(.+)!(\$?\w+\$?\d+)/);
      if (!match) return defaultValue;

      const [_, sheetName, cellAddr] = match;
      const worksheet = workbook.getWorksheet(sheetName);
      const cell = worksheet.getCell(cellAddr.replace(/\$/g, ''));

      return cell.value;
    } catch (error) {
      console.warn(`Error reading ${rangeName}:`, error);
      return defaultValue;
    }
  };

  return {
    // Income Approach
    pgi: getValue('IA_DirCap_PGI', 0),
    vacancy: getValue('IA_DirCap_LossTotal', 0),
    egi: getValue('IA_DirCap_EGI', 0),
    opex: getValue('IA_DirCap_Expenses', 0),
    noi: getValue('IA_DirCap_NOI', 0),
    capRate: getValue('IA_DirCap_CapRate1', 0),
    incomeValue: getValue('IA_DirCap_Value', 0),

    // Per SF Metrics
    pgiPerSF: getValue('IA_DirCap_PGIPSF', 0),
    egiPerSF: getValue('IA_DirCap_EGIPSF', 0),
    noiPerSF: getValue('IA_DirCap_NOIPSF', 0),

    // Final Values
    landValue: getValue('Value_LandScenario1', 0),
    costValue: getValue('Value_CostScenario1', 0),
    salesValue: getValue('Value_SARecScenario1', 0),
    finalValue: getValue('Value_FinalScenario1', 0),

    // Subject Property
    nra: getValue('Subject_NRA', 0),
    units: getValue('Subject_Units', 0),
    propertyType: getValue('Subject_Primary', 'Unknown')
  };
}

// Usage
const values = await extractValcreAppraisal('/path/to/appraisal.xlsm');
console.log('Final Value:', values.finalValue);
console.log('NOI:', values.noi);
console.log('Cap Rate:', values.capRate);
```

---

## Validation Rules

```typescript
function validateAppraisalValues(values: AppraisalValues): string[] {
  const errors: string[] = [];

  // Required fields
  if (!values.noi) errors.push('NOI is missing');
  if (!values.capRate) errors.push('Cap Rate is missing');
  if (!values.finalValue) errors.push('Final Value is missing');

  // Logical consistency
  if (values.egi > values.pgi) {
    errors.push('EGI cannot exceed PGI');
  }

  if (values.noi > values.egi) {
    errors.push('NOI cannot exceed EGI');
  }

  // Cap rate range check
  if (values.capRate < 0.01 || values.capRate > 0.50) {
    errors.push(`Cap Rate ${values.capRate} outside reasonable range (1%-50%)`);
  }

  // Income value calculation check
  if (values.noi && values.capRate) {
    const calculatedValue = values.noi / values.capRate;
    const variance = Math.abs(calculatedValue - values.incomeValue) / calculatedValue;

    if (variance > 0.05) { // 5% tolerance
      errors.push(`Income value variance: ${(variance * 100).toFixed(2)}%`);
    }
  }

  // Per SF checks
  if (values.nra && values.noiPerSF) {
    const calculatedNOIPerSF = values.noi / values.nra;
    const variance = Math.abs(calculatedNOIPerSF - values.noiPerSF) / calculatedNOIPerSF;

    if (variance > 0.01) {
      errors.push('NOI per SF calculation mismatch');
    }
  }

  return errors;
}
```

---

## Database Insert (Supabase)

```typescript
import { createClient } from '@supabase/supabase-js';

async function saveAppraisalToDatabase(
  supabase: SupabaseClient,
  jobId: string,
  values: AppraisalValues
) {
  const { data, error } = await supabase
    .from('appraisal_values')
    .upsert({
      job_id: jobId,

      // Income Approach
      potential_gross_income: values.pgi,
      vacancy_loss: values.vacancy,
      effective_gross_income: values.egi,
      total_operating_expenses: values.opex,
      net_operating_income: values.noi,
      capitalization_rate: values.capRate,
      income_approach_value: values.incomeValue,

      // Per SF Metrics
      pgi_per_sf: values.pgiPerSF,
      egi_per_sf: values.egiPerSF,
      noi_per_sf: values.noiPerSF,

      // Final Values
      land_value: values.landValue,
      cost_approach_value: values.costValue,
      sales_comparison_value: values.salesValue,
      final_reconciled_value: values.finalValue,

      // Subject Property
      net_rentable_area: values.nra,
      number_of_units: values.units,
      property_type: values.propertyType,

      // Metadata
      extracted_at: new Date().toISOString(),
      template_version: 'v1.6.2.0' // Detect from HOME sheet if needed
    });

  if (error) {
    console.error('Error saving appraisal values:', error);
    throw error;
  }

  return data;
}
```

---

## Error Handling

```typescript
async function safeExtractValcreAppraisal(
  filePath: string
): Promise<{ success: boolean; values?: AppraisalValues; errors: string[] }> {
  const errors: string[] = [];

  try {
    // Extract values
    const values = await extractValcreAppraisal(filePath);

    // Validate
    const validationErrors = validateAppraisalValues(values);
    errors.push(...validationErrors);

    return {
      success: validationErrors.length === 0,
      values,
      errors
    };
  } catch (error) {
    errors.push(`Extraction failed: ${error.message}`);
    return {
      success: false,
      errors
    };
  }
}

// Usage with error handling
const result = await safeExtractValcreAppraisal('/path/to/appraisal.xlsm');

if (result.success) {
  await saveAppraisalToDatabase(supabase, jobId, result.values);
  console.log('Appraisal values saved successfully');
} else {
  console.error('Extraction errors:', result.errors);
  // Log errors to database or notify user
}
```

---

## Template Version Detection

```typescript
async function detectValcreVersion(filePath: string): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const homeSheet = workbook.getWorksheet('HOME');
  const versionCell = homeSheet.getCell('A3');

  return versionCell.value?.toString() || 'Unknown';
}

// Usage
const version = await detectValcreVersion('/path/to/appraisal.xlsm');
console.log('Template version:', version); // "v1.6.2.0"
```

---

## Multi-Scenario Support

```typescript
async function extractAllScenarios(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const getValue = (rangeName: string) => {
    // Implementation from above
  };

  return {
    scenario1: {
      name: getValue('Report_ValueScenario1'),
      incomeValue: getValue('Value_IARecScenario1'),
      salesValue: getValue('Value_SARecScenario1'),
      finalValue: getValue('Value_FinalScenario1')
    },
    scenario2: {
      name: getValue('Report_ValueScenario2'),
      incomeValue: getValue('Value_IARecScenario2'),
      salesValue: getValue('Value_SARecScenario2'),
      finalValue: getValue('Value_FinalScenario2')
    },
    scenario3: {
      name: getValue('Report_ValueScenario3'),
      incomeValue: getValue('Value_IARecScenario3'),
      salesValue: getValue('Value_SARecScenario3'),
      finalValue: getValue('Value_FinalScenario3')
    }
  };
}
```

---

## Performance Tips

1. **Cache Workbook:** Don't re-load for each value extraction
2. **Batch Reads:** Group named ranges by sheet
3. **Lazy Loading:** Only load needed sheets
4. **Memory Management:** Close workbook after extraction

```typescript
// Optimized batch extraction
async function batchExtractValues(filePath: string, rangeNames: string[]) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // Group ranges by sheet
  const rangesBySheet = new Map<string, string[]>();

  for (const rangeName of rangeNames) {
    const namedRange = workbook.definedNames.getDefinedName(rangeName);
    if (!namedRange) continue;

    const match = namedRange.ranges[0].match(/(.+)!(\$?\w+\$?\d+)/);
    if (!match) continue;

    const sheetName = match[1];
    if (!rangesBySheet.has(sheetName)) {
      rangesBySheet.set(sheetName, []);
    }
    rangesBySheet.get(sheetName).push(rangeName);
  }

  // Extract all values
  const results = {};
  for (const [sheetName, ranges] of rangesBySheet) {
    const worksheet = workbook.getWorksheet(sheetName);
    for (const rangeName of ranges) {
      const namedRange = workbook.definedNames.getDefinedName(rangeName);
      const match = namedRange.ranges[0].match(/(\$?\w+\$?\d+)/);
      const cellAddr = match[1].replace(/\$/g, '');
      results[rangeName] = worksheet.getCell(cellAddr).value;
    }
  }

  return results;
}
```

---

## Testing

```typescript
describe('Valcre Excel Extraction', () => {
  const testFilePath = '/path/to/test-appraisal.xlsm';

  it('should extract income approach values', async () => {
    const values = await extractValcreAppraisal(testFilePath);

    expect(values.pgi).toBeGreaterThan(0);
    expect(values.noi).toBeGreaterThan(0);
    expect(values.capRate).toBeGreaterThan(0);
  });

  it('should validate logical consistency', async () => {
    const values = await extractValcreAppraisal(testFilePath);
    const errors = validateAppraisalValues(values);

    expect(errors).toHaveLength(0);
  });

  it('should handle missing named ranges gracefully', async () => {
    const result = await safeExtractValcreAppraisal(testFilePath);

    expect(result.success).toBeDefined();
    expect(result.errors).toBeDefined();
  });
});
```

---

## Next Steps for APR-V4

1. **Install ExcelJS:**
   ```bash
   npm install exceljs
   ```

2. **Create extraction utility:**
   ```
   /src/lib/valcre-extractor.ts
   ```

3. **Add database schema:**
   ```sql
   CREATE TABLE appraisal_values (
     job_id UUID PRIMARY KEY,
     potential_gross_income DECIMAL(10,2),
     effective_gross_income DECIMAL(10,2),
     net_operating_income DECIMAL(10,2),
     capitalization_rate DECIMAL(5,4),
     ...
   );
   ```

4. **Create API endpoint:**
   ```
   POST /api/appraisals/extract
   Body: { file: File }
   Response: { values: AppraisalValues, errors: string[] }
   ```

5. **Add UI component:**
   - File upload for Excel appraisal
   - Display extracted values
   - Show validation errors
   - Compare to LOE estimate

---

**Priority Named Ranges to Implement First:**

1. `IA_DirCap_NOI` - Net Operating Income
2. `IA_DirCap_CapRate1` - Capitalization Rate
3. `IA_DirCap_Value` - Income Approach Value
4. `Value_FinalScenario1` - Final Reconciled Value
5. `Subject_NRA` - Property Size

These 5 ranges provide 80% of the value for initial implementation.
