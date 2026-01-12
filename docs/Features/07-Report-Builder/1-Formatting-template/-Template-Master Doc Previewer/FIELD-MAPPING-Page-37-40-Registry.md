# Field Mapping: Pages 37-40 - Rental Survey Grid & Adjustment Analysis

**Pages:** 37-40
**Table Name:** Rental Survey Comparison Grid & Market Rent Adjustments
**Est. Fields:** ~110-140 fields
**HTML Lines:** TBD (Pages 37-40)
**Status:** ⏸️ **DEFERRED - Requires Template Architecture Enhancement**

---

## ⚠️ CRITICAL: Why This Table is Deferred

This table requires **architectural enhancements** that go beyond simple field mapping. We're documenting the analysis here and will return to implementation after foundational work is complete.

### Key Discovery

During field mapping analysis, we identified that Pages 37-40 cannot use the current fixed-field template pattern. The rental survey requires:

1. **Dynamic/Repeating Rows** - Variable number of unit comparisons per comp (not fixed 5 rows)
2. **Array-Based Data Structure** - Not compatible with flat field mapping (e.g., `rental-1bed-comp1-unit-size`)
3. **Template Loop Support** - Needs `{{#each}}` or equivalent iteration capability
4. **Statistical Calc Engine** - HIGH/AVG/MED/LOW calculations don't exist yet
5. **Unit Type Splitting** - Separate grids for 1-bed, 2-bed, etc.

### Current vs. Required Architecture

#### Current Template Pattern (Fixed)
```html
<!-- Page 59 Sales Comp - Works because exactly 5 fixed rows -->
<tr>
  <td>{{comp1-name}}</td>
  <td>{{comp1-units}}</td>
  <td>{{comp1-sale-price}}</td>
</tr>
<tr>
  <td>{{comp2-name}}</td>
  <td>{{comp2-units}}</td>
  <td>{{comp2-sale-price}}</td>
</tr>
<!-- ... exactly 5 comps, always -->
```

#### Required Template Pattern (Dynamic)
```html
<!-- Pages 37-40 Rental Survey - Needs loops for variable rows -->
{{#each rentalComps1Bed}}
<tr>
  <td>{{compNum}}</td>
  <td>{{type}}</td>
  <td>{{unitSize}}</td>
  <td>{{rentUnit}}</td>
  <td>{{rentSF}}</td>
</tr>
{{/each}}

<!-- Then summary rows -->
<tr class="summary">
  <td>HIGH</td>
  <td>{{rentalComps1BedSummary.high.unitSize}}</td>
  <td>{{rentalComps1BedSummary.high.rentUnit}}</td>
  <td>{{rentalComps1BedSummary.high.rentSF}}</td>
</tr>
```

---

## Architectural Gap Analysis

### Gap 1: Data Structure Mismatch

**Current Flat Field Approach:**
```typescript
// Works for fixed tables
{
  'rental-1bed-comp1-unit-size': 650,
  'rental-1bed-comp1-rent-unit': 1575,
  'rental-1bed-comp1-rent-sf': 2.42,
  'rental-1bed-comp2-unit-size': 650,
  'rental-1bed-comp2-rent-unit': 1110,
  'rental-1bed-comp2-rent-sf': 1.71,
  // ... must know exact count ahead of time
}
```

**Required Array-Based Approach:**
```typescript
// Needed for dynamic tables
{
  rentalComps1Bed: [
    { compNum: 1, compName: 'Comp 1', type: 'Flat 1 Bed / 1 Bath + Den', unitSize: 650, rentUnit: 1575, rentSF: 2.42 },
    { compNum: 2, compName: 'Comp 2 - Unit A', type: 'Flat 1 Bed / 1 Bath', unitSize: 650, rentUnit: 1110, rentSF: 1.71 },
    { compNum: 2, compName: 'Comp 2 - Unit B', type: 'Flat 1 Bed / 1 Bath', unitSize: 650, rentUnit: 1185, rentSF: 1.82 },
    { compNum: 2, compName: 'Comp 2 - Unit C', type: 'Flat 1 Bed / 1 Bath', unitSize: 650, rentUnit: 1235, rentSF: 1.90 },
    { compNum: 3, compName: 'Comp 3', type: 'Flat 1 Bed / 1 Bath', unitSize: 700, rentUnit: 1300, rentSF: 1.86 },
    // ... variable length array
  ],
  rentalComps1BedSummary: {
    high: { unitSize: 650, rentUnit: 1575, rentSF: 2.42 },
    avg: { unitSize: 650, rentUnit: 1287, rentSF: 1.98 },
    med: { unitSize: 650, rentUnit: 1240, rentSF: 1.91 },
    low: { unitSize: 650, rentUnit: 1110, rentSF: 1.71 },
  },
  rentalConclusion1Bed: {
    type: 'Flat 1 Bed / 1 Bath',
    unitSize: 550,
    rentUnit: 895,
    rentSF: 1.63,
    conclusionSF: 1.64,
    conclusion: 900,
  }
}
```

**Why This Matters:**
- Comp 2 might have 3 different unit types to list
- Comp 5 might have 7 different unit types
- Can't predict count ahead of time with fixed field IDs
- Need array iteration in template

---

### Gap 2: Template Engine Capabilities

**Current Template Engine:**
- Uses `getFieldValue(sections, 'field-id')` for flat key-value lookups
- No loop/iteration support
- Works perfectly for fixed-structure tables (Page 49, Page 59)

**Required Template Engine:**
- Needs `{{#each arrayName}}` or equivalent loop syntax
- OR needs custom JSX-style `.map()` rendering
- Conditional rendering for summary rows
- Nested object access (`summary.high.rentSF`)

**Action Required:**
1. Check if `reportHtmlTemplate.ts` already supports loops
2. If not, evaluate template engine options:
   - **Handlebars** - `{{#each items}}...{{/each}}`
   - **Mustache** - `{{#items}}...{{/items}}`
   - **React/JSX** - `items.map(item => <tr>...</tr>)`
   - **Custom** - Build loop processor into generateReportHtml()

---

### Gap 3: Calculation Engine Missing

**Current Calculator Status:**

| Valuation Approach | Calc Engine | Status | Complexity |
|-------------------|-------------|--------|------------|
| **Income Approach (Direct Cap)** | ✅ Built | 11-step validated to $1,780,000 | Medium |
| **Sales Comparison Approach** | ❌ Not built | Simple division/sums needed | Low |
| **Rental Survey (Market Rent)** | ❌ Not built | Statistical + aggregation | **High** |

**Rental Survey Calc Requirements:**

1. **Statistical Analysis:**
   - Calculate HIGH (max rent/SF across all comps)
   - Calculate AVG (average rent/SF)
   - Calculate MED (median rent/SF)
   - Calculate LOW (min rent/SF)

2. **Unit Type Grouping:**
   - Split by unit type (1-bed, 2-bed, 3-bed, etc.)
   - Separate grids per type
   - Individual conclusions per type

3. **Adjustment Grid (Page 40):**
   - Quality adjustments (Superior, Good, Average, Fair)
   - Condition adjustments
   - Location adjustments
   - Applied to raw rent data before statistical analysis

**Why This is Complex:**
- Not a simple pass-through like Sales Comp
- Requires aggregation across variable comp counts
- Statistical functions not yet implemented
- Adjustment logic needs to be applied BEFORE summary calcs

---

### Gap 4: Data Flow Integration

**Current Income Approach Flow:**
```
Manual Rent Input
    ↓
fieldRegistry (calc-type1-rent, etc.)
    ↓
Income Calc Engine
    ↓
PGR → EGR → NOI → Value
```

**Required Rental Survey Flow:**
```
Raw Comp Data Entry (140 fields)
    ↓
Adjustment Grid (Page 40)
    ↓
Rental Survey Calc Engine
    ↓
Statistical Analysis (HIGH/AVG/MED/LOW)
    ↓
Market Rent Conclusions
    ↓
Feed INTO Income Approach as calc-type1-rent, calc-type2-rent, etc.
    ↓
PGR → EGR → NOI → Value
```

**Integration Point:**
- Rental Survey OUTPUT becomes Income Approach INPUT
- Currently Income Approach uses manual rent inputs
- Future: Income Approach pulls from Rental Survey conclusions

---

## Rental Survey Table Breakdown

### Page 37-39: Rental Comparable Detail Sheets (5 Comps)

**Structure:** Similar to Sales Comp detail sheets (Pages 54-58)

**Fields per Comparable (~28 fields each × 5 comps = 140 fields):**
- Property name, address, location
- Units (total count)
- Unit mix breakdown (by type)
- Individual unit rents (variable count)
- Rent per unit, rent per SF
- Quality/condition ratings
- Amenities, parking
- Distance from subject

**Current Status:**
- 140 rental-comp fields exist in test data
- Template pages exist but structure is hardcoded
- No field mapping yet

---

### Page 40: Rental Adjustment Grid & Market Rent Conclusions

**Two-Part Table:**

#### Part 1: Adjustment Grid (1-Bed and 2-Bed)

**Per Unit Type Grid Structure:**
```
COMPARABLE | COMP # | UNIT TYPE | UNIT SIZE | RENT/UNIT | RENT/SF | RENT/SF UNADJ
---------------------------------------------------------------------------
[5-20 rows - VARIABLE COUNT based on unit data]
---------------------------------------------------------------------------
HIGH       |   -    |     -     |    ###    |   $####   |  $#.##  |   $#.##
AVG        |   -    |     -     |    ###    |   $####   |  $#.##  |   $#.##
MED        |   -    |     -     |    ###    |   $####   |  $#.##  |   $#.##
LOW        |   -    |     -     |    ###    |   $####   |  $#.##  |   $#.##
```

**Fields Required per Unit Type:**
- Variable data rows (rental-1bed-comp1-unit-size, rental-1bed-comp1-rent-unit, etc.)
- Summary calculations (high, avg, med, low)
- 6 columns × ~10-20 rows = 60-120 fields per unit type
- Repeated for 1-bed, 2-bed, possibly 3-bed = 180-360 total fields

#### Part 2: Market Rent Conclusion Table

**Structure:**
```
UNIT TYPE | UNIT SIZE | RENT/UNIT | RENT/SF | CONCLUSION RENT/SF | CONCLUSION
-------------------------------------------------------------------------
1-Bed     |    ###    |   $####   |  $#.##  |       $#.##        |   $####
2-Bed     |    ###    |   $####   |  $#.##  |       $#.##        |   $####
```

**Fields (~12 fields):**
- rental-conclusion-1bed-type
- rental-conclusion-1bed-unit-size
- rental-conclusion-1bed-rent-unit
- rental-conclusion-1bed-rent-sf
- rental-conclusion-1bed-conclusion-sf
- rental-conclusion-1bed-conclusion
- (Repeat for 2-bed)

---

## Why We're Deferring This Work

### Reason 1: Template Architecture Not Ready
- Current template = fixed field placeholders
- Rental Survey = dynamic repeating rows
- Need loop/iteration capability first
- Don't want to hard-code 20+ rows when 5-10 might be needed

### Reason 2: Calculation Engine Doesn't Exist
- No statistical analysis functions (high/avg/med/low)
- No unit type grouping logic
- No adjustment application logic
- Income Approach is the only calc engine built so far

### Reason 3: Data Structure Redesign Required
- Moving from flat fields to array-based data
- Impacts store, test data, field registry
- Significant refactor, not just field mapping
- Should be done as dedicated architectural task

### Reason 4: Current Workaround is Acceptable
- Income Approach works with manual rent inputs
- Rental Survey template exists visually (even if hardcoded)
- No immediate blocker to report generation
- Can revisit after core tables are wired

---

## Recommended Approach When We Return

### Phase 1: Template Engine Enhancement
1. **Evaluate Options:**
   - Check if current engine supports loops
   - If not, choose template library (Handlebars, Mustache, etc.)
   - OR build custom loop processor

2. **Proof of Concept:**
   - Test loop rendering with sample array data
   - Verify nested object access works
   - Confirm performance with 20+ row tables

3. **Integration:**
   - Update `generateReportHtml()` to support loops
   - Add `{{#each}}` or equivalent syntax
   - Test with existing fixed tables (shouldn't break)

---

### Phase 2: Rental Survey Calc Engine
1. **Statistical Functions:**
   - Implement `calculateHigh(values)` - max
   - Implement `calculateAvg(values)` - mean
   - Implement `calculateMed(values)` - median
   - Implement `calculateLow(values)` - min

2. **Unit Type Grouping:**
   - Filter rental comp data by unit type
   - Separate 1-bed, 2-bed, 3-bed arrays
   - Apply to each group independently

3. **Adjustment Logic:**
   - Quality adjustment matrix
   - Condition adjustment matrix
   - Location adjustment matrix
   - Apply to raw rent/SF before statistical calcs

4. **Integration with Income Approach:**
   - Rental Survey output → Income Approach input
   - Map conclusions to calc-type1-rent, calc-type2-rent, etc.
   - Validate end-to-end: Raw comp data → Market rent → NOI → Value

---

### Phase 3: Data Structure Redesign
1. **Update Test Data:**
   - Convert flat rental-comp fields to array structure
   - Group by unit type
   - Add summary placeholders

2. **Update Field Registry:**
   - Define array field types
   - Add statistical summary fields
   - Link to Valcre SURVEY data sources

3. **Update Store:**
   - Handle array-based data in reportBuilderStore
   - Support dynamic row counts
   - Wire to template renderer

---

### Phase 4: Template Implementation
1. **Page 40 Adjustment Grid:**
   - Use loop to render variable comp rows
   - Fixed summary rows (HIGH/AVG/MED/LOW)
   - Repeat for each unit type

2. **Pages 37-39 Detail Sheets:**
   - Similar to Sales Comp pages 54-58
   - But with unit mix breakdowns
   - Use loops for variable unit counts

3. **Testing:**
   - Test with 5 rows (typical)
   - Test with 20 rows (stress test)
   - Test with multiple unit types
   - Validate calculations match expected values

---

## Comparison to Sales Comp Approach

**Why Sales Comp (Page 59) Was Simpler:**

| Factor | Sales Comp | Rental Survey |
|--------|-----------|---------------|
| Row count | Fixed (5 comps) | Variable (5-20+ units) |
| Data structure | Flat fields | Array-based |
| Calculations | Simple division | Statistical aggregation |
| Template needs | Fixed placeholders | Loop/iteration |
| Calc engine | Not built (but simple) | Not built (complex) |
| Unit type splits | No | Yes (1-bed, 2-bed, etc.) |

**Sales Comp Next Steps:**
- Build simple calc engine (division/sums)
- Wire to existing template (already field-mapped)
- No template architecture changes needed

**Rental Survey Next Steps:**
- Build complex calc engine (statistical)
- Enhance template architecture (loops)
- Redesign data structure (arrays)
- THEN wire to template

---

## Current Workaround

**Until Rental Survey Calc Engine is Built:**

1. **Manual Input:**
   - User manually enters concluded market rents into Income Approach
   - Fields: `calc-type1-rent`, `calc-type2-rent`, etc.
   - Works perfectly for current Income calc engine

2. **Visual Template:**
   - Pages 37-40 exist visually (even if hardcoded)
   - Report looks complete to end viewer
   - Can be populated manually if needed for presentation

3. **No Immediate Blocker:**
   - Income Approach generates value correctly
   - Report can be generated end-to-end
   - Rental Survey automation is enhancement, not requirement

---

## Session Notes & Insights

### Discovery Process

This architectural gap was discovered during the field mapping phase when we realized:

1. Page 39 location table was hardcoded (fixed easily with field mapping)
2. Page 40 adjustment grid has variable rows (can't fix with simple field mapping)
3. Template pattern that works for Page 49 & 59 won't work here
4. Need to step back and address architecture before field mapping

**This is the correct discovery sequence:**
- Phase 1: Build templates visually ✅ Done
- Phase 2: Wire field IDs (current phase) → Reveals architectural gaps
- Phase 3: Build calc engines (Income ✅, Sales ❌, Rental ❌)
- Phase 4: Enhance template architecture (loops, arrays)

### Key Realizations

1. **Fixed vs. Dynamic Tables:**
   - Some tables work perfectly with flat field mapping (Pages 49, 59)
   - Others need array iteration (Page 40)
   - Template engine must support both patterns

2. **Calc Engine Dependencies:**
   - Income Approach calc ✅ (validated $1.78M)
   - Sales Comp calc ❌ (simple, can build quickly)
   - Rental Survey calc ❌ (complex, needs dedicated work)

3. **Data Flow:**
   - Rental Survey is a SUPPORTING ANALYSIS, not a valuation approach
   - It feeds INTO Income Approach (determines market rents)
   - Current workaround: Manual rent input works fine

4. **When to Build:**
   - Don't build complex calc engines until data wiring reveals exact requirements
   - Current phase (field mapping) is perfect for discovering these gaps
   - Document now, build later when architecture is ready

---

## Related Documentation

**Reference These Files:**
- [Calc-eng Field Map.md](./Calc-eng%20Field%20Map.md) - Shows Sales Comp calc logic (simple division/sums)
- [FIELD-MAPPING-Page-59-Registry.md](./FIELD-MAPPING-Page-59-Registry.md) - Sales Comp example (fixed rows work)
- [FIELD-MAPPING-Page-49-Registry.md](./FIELD-MAPPING-Page-49-Registry.md) - Income Approach (fixed rows work)
- [Team-Workflow.md](./Team-Workflow.md) - Division of labor (when to use TypeScript Pro for calc engine work)

**Search Terms for Memory:**
- "rental survey calculation engine"
- "template loop iteration"
- "dynamic repeating rows"
- "array-based data structure"

---

## Action Items for Future Sessions

**When Ready to Resume:**

1. **[ ] Check Template Engine Capability**
   - Search `reportHtmlTemplate.ts` for loop support
   - Test with sample array data
   - Decision: Use existing or add library?

2. **[ ] Design Rental Survey Calc Engine**
   - Statistical functions (high/avg/med/low)
   - Unit type grouping
   - Adjustment matrix logic
   - Assign to TypeScript Pro agent

3. **[ ] Redesign Data Structure**
   - Convert rental-comp fields to arrays
   - Update test data
   - Update field registry

4. **[ ] Implement Template Loops**
   - Page 40 adjustment grid
   - Variable row rendering
   - Test with different row counts

5. **[ ] Wire to Income Approach**
   - Rental Survey output → Income input
   - End-to-end validation
   - Test with live data

---

**Status:** 📋 **Documented & Deferred**
**Next Table to Map:** Page 44 (Operating History) or Page 65 (Market Value Conclusion)
**Estimated Complexity When We Return:** High (3-5 sessions for full implementation)

---

**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Reason for Deferral:** Architectural enhancement required - template loop support + calc engine development
