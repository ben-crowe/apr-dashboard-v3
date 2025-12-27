# Valcre Field Extraction Summary

## Documents Analyzed
1. **North Battleford Apartments** - Primary reference (1101, 1121 109 St, North Battleford, SK)
2. **Binscarth Apartments** - Cross-reference (802 Bankview Dr, Drumheller, AB)

## Key Findings

### Document Structure
Both documents are FINALIZED exports from Valcre - merge fields have been resolved to actual values.
This means we extracted DATA VALUES rather than live merge field codes.

### Field Categories Identified
- **Cover/Basic Info**: 32 fields
- **Physical/Site**: 11 fields
- **Income Approach**: 27 fields
- **Sales Comparison**: 64 fields
- **Total Unique Fields**: 134

### Data Types
- Text: 45
- Currency: 38
- Number: 30
- Percentage: 14
- Date: 7

### Key Values Extracted - North Battleford
| Field | Value |
|-------|-------|
| PGR | $204,240 |
| Vacancy Rate | 3.8% |
| EGR | $196,406 |
| NOI | $111,771 |
| Cap Rate | 6.25% |
| Indicated Value (Income) | ~$1,788,336 |
| Price/Unit (Sales Comp) | $112,500 |
| Indicated Value (Sales) | ~$1,800,000 |

### Key Values Extracted - Binscarth
| Field | Value |
|-------|-------|
| PGR | $351,000 |
| Vacancy Rate | 2.0% |
| EGR | $344,066 |
| NOI | $207,806 |
| Cap Rate (As Is) | 6.25% |
| Cap Rate (Renovated) | 6.50% |
| Contract Price | $3,000,000 |

### Boilerplate Text Identified
25 static text blocks identified that are identical between reports.
These can be hardcoded in templates.

### Tables Note
Many key data tables in the reports are embedded as IMAGES (flattened screenshots),
not as live text/field data. This includes:
- Executive Summary value tables
- Unit Mix tables
- Income Summary tables
- Comparable Sales summary tables
- Direct Cap calculation tables

These tables will need to be recreated programmatically in the APR Dashboard.

## Generated Files
1. `valcre-field-registry.ts` - All field IDs with metadata
2. `test-data-north-battleford.ts` - Extracted test values
3. `test-data-binscarth.ts` - Cross-validation values
4. `boilerplate-registry.ts` - Static template text
5. `field-placements.ts` - Field location mapping

## Next Steps
1. Validate field registry against existing APR Dashboard TDD form fields
2. Map extracted fields to existing component props
3. Build lookup tables for comparable sales structure
4. Implement calculation engine for Income Approach fields
5. Create test suite using extracted values
