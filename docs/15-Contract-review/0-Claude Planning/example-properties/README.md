# Example Properties for Calculator Demo

This folder contains standalone property files that can be loaded into the Calculator Demo for testing.

---

## How It Works

1. **Pick an example property** from this folder
2. **Load it** into the Calculator Demo (via dropdown or button)
3. **Calculator computes** all three valuation approaches
4. **Compare** the demo output against the expected values in Section 2
5. **Record** any discrepancies in Section 3

---

## File Structure

Each example property has TWO files:

### 1. Markdown File (`.md`) - Human Reference
- **Section 1: INPUTS** - What gets loaded (human-input fields only)
- **Section 2: EXPECTED OUTPUTS** - What the source report shows
- **Section 3: VALIDATION REPORT** - Fill in after testing

### 2. JSON File (`.json`) - Machine Readable
- Same data in JSON format
- Can be loaded directly by the app
- No need to add to registry

---

## Available Example Properties

| ID | Name | Units | Location | Status |
|----|------|-------|----------|--------|
| `north-battleford-16unit` | North Battleford Multi-Family | 16 | North Battleford, SK | Active |

---

## Adding a New Example Property

### Step 1: Create the JSON file

Copy the template and fill in your property data:

```json
{
  "id": "your-property-id",
  "name": "Your Property Name",
  "description": "Brief description",
  "sourceReference": "Where this data came from",

  "inputs": {
    "subject": {
      "property-name": "...",
      "property-total-units": 0,
      "property-gba": 0
    },
    "unitMix": { ... },
    "expenses": { ... },
    "vacancy": { ... },
    "capRate": { ... },
    "comparableSales": [ ... ],
    "compAdjustments": { ... },
    "costApproach": { ... }
  },

  "expectedOutputs": {
    "incomeApproach": { ... },
    "salesComparison": { ... },
    "costApproach": { ... },
    "reconciliation": { ... }
  }
}
```

### Step 2: Create the Markdown file

Copy the template structure with three sections:
1. Human inputs (from your JSON)
2. Expected outputs (from your source report)
3. Blank validation report (fill in after testing)

### Step 3: Test it

1. Load the example in Calculator Demo
2. Compare output to expected values
3. Document any discrepancies

---

## What Gets Loaded vs Calculated

### LOADED (Human Inputs)
- Property info (name, address, units, GBA, year)
- Unit mix (counts, rents)
- Operating expenses (7 categories)
- Vacancy rate
- Cap rate
- Comparable sales (5 properties)
- Comp adjustments (8 categories × 5 comps)
- Cost approach inputs (if applicable)

### CALCULATED (By Calc Engine)
- PGR, EGR, NOI
- Expense breakdowns (per unit, per SF, % of EGR)
- $/Unit and $/SF for each comp
- Adjusted values for each comp
- Indicated values (Income, Sales, Cost)
- Reconciled final value

---

## Key Principle

**The calc engine does ALL the math.**

The only "expected values" are for VISUAL COMPARISON by a human reviewing the demo output. They are NOT used for automated validation or hardcoded into the app.

---

*Last Updated: December 26, 2025*
