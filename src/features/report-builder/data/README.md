# Report Builder Test Data

This directory contains comprehensive test data for the APR Report Builder.

## North Battleford Test Data

### Overview

The `northBattlefordTestData.ts` file contains complete test data extracted from an actual North Battleford Apartments appraisal report. This data can be used for:

- Testing report generation functionality
- Demonstrating the Report Builder UI
- Validating field mappings and calculations
- Training and documentation

### Property Details

- **Property Name**: North Battleford Apartments
- **Address**: 1101, 1121 109 St, North Battleford, Saskatchewan
- **File Number**: VAL251012 - 1
- **Valuation Date**: October 17, 2025
- **Report Date**: November 20, 2025
- **Client**: Kenneth Engler / 102109845 Saskatchewan Ltd.

### Property Characteristics

- **Units**: 16 (4x 1BR/1BA, 12x 2BR/1BA)
- **Buildings**: 2
- **Year Built**: 1970
- **Stories**: 2
- **Net Rentable Area**: 10,204 SF
- **Site Area**: 24,400 SF (0.56 acres)
- **Concluded Value**: $1,780,000

## Usage

### Import Test Data

```typescript
import {
  northBattlefordTestData,
  loadNorthBattlefordTestData,
  northBattlefordImages,
  northBattlefordSummary
} from './data/northBattlefordTestData';
```

### Load into Report Builder

```typescript
import { useReportBuilderStore } from './store/reportBuilderStore';

// Get the store's update function
const { updateFieldValue } = useReportBuilderStore();

// Load all test data
loadNorthBattlefordTestData(updateFieldValue);
```

### Access Specific Fields

```typescript
// Get a specific field value
const propertyName = northBattlefordTestData['property-name'];
const concludedValue = northBattlefordTestData['recon-final-value'];

// Get image paths
const coverPhoto = northBattlefordImages.cover;
const exteriorPhotos = northBattlefordImages.exterior;

// Get property summary
console.log(northBattlefordSummary);
```

## Data Structure

### Sections Included

The test data covers all major report sections:

1. **COVER** - Cover page, client info, appraiser info
2. **EXEC** - Executive summary, property identification, key characteristics
3. **PHOTOS** - Exterior, street views, interior common areas, unit interiors, building systems
4. **SITE** - Site area, adjacent uses, characteristics, conditions
5. **LOCATION** - Overview, access, walkability scores, local area, maps
6. **TAX** - Assessment year, values, taxes, commentary
7. **MARKET** - National, provincial, local, and property type market analysis
8. **IMPV** - Building overview, amenities, construction, systems, finishes
9. **ZONE** - Classification, description, requirements, conformance
10. **HBU** - Highest and best use analysis (vacant and improved)
11. **CALC** - Income approach calculator with unit mix, income, expenses, cap rate
12. **SALES** - Subject property summary for sales comparison
13. **RECON** - Reconciliation of value approaches

### Field ID Format

All field IDs follow the store's naming convention:
- Section prefix + field name (e.g., `calc-unit-1-count`)
- Subsection fields use parent section prefix (e.g., `photo-exterior-1`)

### Data Types

- **Text fields**: String values
- **Number fields**: Numeric values
- **Date fields**: ISO date strings (YYYY-MM-DD)
- **Dropdown fields**: String matching option values
- **Image fields**: String arrays with file paths
- **Textarea fields**: Multi-line string content

## Image Paths

Test data references images at `/test-data/images/` with the following structure:

```
/test-data/images/
├── cover/
│   └── cover-photo.jpeg
├── exterior/
│   ├── exterior-1.jpeg
│   ├── exterior-2.jpeg
│   ├── exterior-3.jpeg
│   └── exterior-4.jpeg
├── interior/
│   ├── interior-1.jpeg
│   ├── interior-2.jpeg
│   └── ... (18 total)
├── street-views/
│   ├── street-1.jpeg
│   └── street-2.jpeg
└── maps/
    ├── location-map.png
    ├── aerial-map.png
    └── zoning-map.png
```

## Calculator Values

The CALC section includes realistic income approach data:

### Unit Mix
- **Unit Type 1**: 4x 1BR/1BA @ 550 SF, $900/mo
- **Unit Type 2**: 12x 2BR/1BA @ 667 SF, $1,060/mo

### Income
- **Laundry**: $300/unit/year
- **Vacancy Rate**: 4%

### Expenses (per unit annually)
- **Management**: 5% of EGR
- **Taxes**: $1,125
- **Insurance**: $625
- **Utilities**: $750
- **Repairs & Maintenance**: $625
- **Administrative**: $156.25
- **Reserves**: $250

### Capitalization
- **Cap Rate**: 6.25%

### Expected Results
- **Potential Gross Revenue**: ~$206,400
- **Effective Gross Revenue**: ~$198,144
- **Net Operating Income**: ~$111,250
- **Indicated Value**: ~$1,780,000

## Value Reconciliation

- **Income Approach**: $1,780,000 (70% weight)
- **Sales Comparison**: $1,800,000 (30% weight)
- **Final Value**: $1,780,000

## Testing Calculations

Use this data to verify:
1. Unit mix calculations (totals, averages)
2. Income calculations (PGR, EGR)
3. Expense calculations (total, ratio)
4. NOI calculation
5. Capitalized value calculation
6. Per-unit and per-SF metrics

## Adding More Test Data

To add additional test data files:

1. Create a new file (e.g., `calgaryHighriseTestData.ts`)
2. Follow the same structure as `northBattlefordTestData.ts`
3. Export test data object, load function, and summary
4. Update this README with the new data set

## Notes

- All monetary values are in CAD
- All areas are in square feet (SF)
- Dates use ISO 8601 format (YYYY-MM-DD)
- Image paths are relative to public directory
- Test data matches actual appraisal report format
