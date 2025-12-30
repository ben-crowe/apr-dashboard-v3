# Test Data for Report Template

This folder contains **human-input test data** used to verify the report template.

**Key Principle:** These are fields a USER would fill in. The calculator/template computes everything else. Nothing is hardcoded - we're simulating real user input.

---

## Folder Structure

```
test-data/
├── README.md                     ← This file
├── north-battleford-v1.md        ← Complete test dataset (current)
├── [future-property-v1.md]       ← Add new properties here
│
└── sections/                     ← Field documentation by section
    ├── financial-inputs.md       ← Calculator user inputs
    ├── property-details.md       ← Property info fields
    ├── comparable-sales.md       ← Comp data fields
    └── historical-data.md        ← Operating history fields
```

---

## How Test Data Works

1. **User Input Fields** - Data a human appraiser provides
2. **Calculated Fields** - Computed by calculator (NOT in test data)
3. **Template Fields** - Display slots that receive values

**Flow:**
```
Test Data (user inputs)
        ↓
   Calculator
        ↓
Calculated Values
        ↓
   postMessage
        ↓
  Template Slots
```

---

## Creating a New Test Dataset

1. Duplicate `north-battleford-v1.md`
2. Rename to `[property-name]-v1.md`
3. Update all USER INPUT values
4. Add to calculator's test data loader
5. Creates new "Load [Property] Test Data" button

---

## Field Categories

| Category | Prefix | User Input? | Example |
|----------|--------|-------------|---------|
| Unit Mix | `calc-type{N}-` | YES | count, sf, rent |
| Expenses | `calc-exp-` | YES | per-unit amounts |
| Rates | `calc-*-rate` | YES | vacancy, cap rate |
| Revenue | `calc-*` | CALCULATED | PGR, EGR, NOI |
| Historical | `hist-*` | YES | YTD totals |
| Comps | `comp{N}-*` | YES | sale price, units |
| Statistics | `dca-*` | CALCULATED | high/avg/med/low |
| Property | `prop-*` | YES | address, city |

---

## Active Test Dataset

**Current:** `north-battleford-v1.md`
- Property: North Battleford Apartments  
- Address: 1101, 1121 109 St, North Battleford, SK
- Units: 16 (4x 1BR + 12x 2BR)
- Used by: "Load North Battleford Test Data" button
