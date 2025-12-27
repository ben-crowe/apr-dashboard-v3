Sales Comparison Approach

Create a planning document for adding Sales Comparison Approach calculations to the APR Dashboard.

Output: /docs/15-Contract-review/SALES-COMPARISON-ENGINE-PLAN.md

RESEARCH FIRST:
1. Check what Sales Comparison fields already exist in fieldRegistry.ts
2. Check what Sales Comparison fields exist in workbookFieldMapping.ts
3. Check if any Sales Comparison calculation logic exists in reportBuilderStore.ts
4. Check TDD Dashboard for comp input sections
5. Check reportHtmlTemplate.ts for how comps are currently displayed (pages 50-60)

DOCUMENT SHOULD INCLUDE:

## Current State
- What fields exist for comps (list them)
- What's displayed in report template
- What calculation logic exists (if any)
- Gap: what's missing

## Required Calculations
For each of 5 comparables:
- Sale Price
- ± Adjustments (property rights, financing, conditions, time, location, size, age, other)
- = Adjusted Sale Price
- Adjusted $/Unit (Adjusted Price ÷ Comp Units)
- Adjusted $/SF (Adjusted Price ÷ Comp SF)

Summary:
- Range (Low/High/Average of adjusted values)
- Indicated $/Unit for subject (user selects within range)
- Indicated Value by Sales Comparison = Indicated $/Unit × Subject Units

Reconciliation:
- Income Approach Value (from existing calc)
- Sales Comparison Value (new calc)
- Weighting (user input %)
- Final Reconciled Value

## Fields Needed
List any NEW fields required in fieldRegistry.ts:
- Adjustment fields per comp
- Adjusted value fields per comp
- Summary fields
- Reconciliation weight fields

## Changes Required
1. fieldRegistry.ts - new fields
2. workbookFieldMapping.ts - map to Valcre ranges if they exist
3. reportBuilderStore.ts - new calculation functions
4. TDD Dashboard - verify inputs exist
5. reportHtmlTemplate.ts - verify output displays

## Implementation Order
Recommended sequence of work

DO NOT IMPLEMENT. Just document the plan.
