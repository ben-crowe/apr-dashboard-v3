# Field Mapping: Page 61 - Direct Comparison Approach Conclusion

**Page:** 61
**Table Name:** Direct Comparison Approach (DCA) Conclusion Grid
**Total Fields:** 68 (35 comp fields + 28 summary fields + 5 conclusion fields)
**HTML Lines:** TBD (Page 61)
**Status:** ✅ Ready for HTML Update
**Registry Status:** ✅ All 68 fields verified at registry field count 784

---

## Overview

Page 61 contains the conclusion table for the Sales Comparison Approach (also called Direct Comparison Approach - DCA). This table summarizes the adjusted sale prices from the 5 comparable properties analyzed on Page 59, calculates statistical measures (HIGH/AVG/MED/LOW), and arrives at a concluded value per unit for the subject property.

**Table Structure:**
- **5 Comparable Rows:** Individual comp data with adjustments applied
- **4 Summary Rows:** Statistical analysis (HIGH, AVG, MED, LOW)
- **1 Conclusion Section:** Final indicated value calculation
- **7 Columns:** Transaction Price, Trans Adj, Adjusted Price, Property Adj, Final Price, Net Adj %, Gross Adj %

---

## Field Mapping Table

### Section 1: Comparable Property Rows (35 fields)

#### Comparable 1 (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 1 | {{COMP1_TransactionPrice}} | comp1-price-per-unit | SALE1.pricePerUnit | ✅ Verified | Sale price ÷ units |
| 2 | {{COMP1_TransactionalAdj}} | comp1-total-trans-adj | SALE1.totalTransAdj | ✅ Verified | Sum of transaction adjustments (%) |
| 3 | {{COMP1_Adjusted}} | comp1-trans-adj-price | SALE1.transAdjPrice | ✅ Verified | Price after transaction adjustments |
| 4 | {{COMP1_PropertyAdj}} | comp1-total-phys-adj | SALE1.totalPhysAdj | ✅ Verified | Sum of physical/property adjustments (%) |
| 5 | {{COMP1_Final}} | comp1-adj-price-per-unit | SALE1.adjPricePerUnit | ✅ Verified | Final adjusted price per unit |
| 6 | {{COMP1_NetAdj}} | comp1-net-adj | SALE1.netAdj | ✅ Verified | Net adjustment % (trans + property) |
| 7 | {{COMP1_GrossAdj}} | comp1-gross-adj | SALE1.grossAdj | ✅ Verified | Absolute value of all adjustments |

#### Comparable 2 (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 8 | {{COMP2_TransactionPrice}} | comp2-price-per-unit | SALE2.pricePerUnit | ✅ Verified | Sale price ÷ units |
| 9 | {{COMP2_TransactionalAdj}} | comp2-total-trans-adj | SALE2.totalTransAdj | ✅ Verified | Sum of transaction adjustments (%) |
| 10 | {{COMP2_Adjusted}} | comp2-trans-adj-price | SALE2.transAdjPrice | ✅ Verified | Price after transaction adjustments |
| 11 | {{COMP2_PropertyAdj}} | comp2-total-phys-adj | SALE2.totalPhysAdj | ✅ Verified | Sum of physical/property adjustments (%) |
| 12 | {{COMP2_Final}} | comp2-adj-price-per-unit | SALE2.adjPricePerUnit | ✅ Verified | Final adjusted price per unit |
| 13 | {{COMP2_NetAdj}} | comp2-net-adj | SALE2.netAdj | ✅ Verified | Net adjustment % (trans + property) |
| 14 | {{COMP2_GrossAdj}} | comp2-gross-adj | SALE2.grossAdj | ✅ Verified | Absolute value of all adjustments |

#### Comparable 3 (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 15 | {{COMP3_TransactionPrice}} | comp3-price-per-unit | SALE3.pricePerUnit | ✅ Verified | Sale price ÷ units |
| 16 | {{COMP3_TransactionalAdj}} | comp3-total-trans-adj | SALE3.totalTransAdj | ✅ Verified | Sum of transaction adjustments (%) |
| 17 | {{COMP3_Adjusted}} | comp3-trans-adj-price | SALE3.transAdjPrice | ✅ Verified | Price after transaction adjustments |
| 18 | {{COMP3_PropertyAdj}} | comp3-total-phys-adj | SALE3.totalPhysAdj | ✅ Verified | Sum of physical/property adjustments (%) |
| 19 | {{COMP3_Final}} | comp3-adj-price-per-unit | SALE3.adjPricePerUnit | ✅ Verified | Final adjusted price per unit |
| 20 | {{COMP3_NetAdj}} | comp3-net-adj | SALE3.netAdj | ✅ Verified | Net adjustment % (trans + property) |
| 21 | {{COMP3_GrossAdj}} | comp3-gross-adj | SALE3.grossAdj | ✅ Verified | Absolute value of all adjustments |

#### Comparable 4 (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 22 | {{COMP4_TransactionPrice}} | comp4-price-per-unit | SALE4.pricePerUnit | ✅ Verified | Sale price ÷ units |
| 23 | {{COMP4_TransactionalAdj}} | comp4-total-trans-adj | SALE4.totalTransAdj | ✅ Verified | Sum of transaction adjustments (%) |
| 24 | {{COMP4_Adjusted}} | comp4-trans-adj-price | SALE4.transAdjPrice | ✅ Verified | Price after transaction adjustments |
| 25 | {{COMP4_PropertyAdj}} | comp4-total-phys-adj | SALE4.totalPhysAdj | ✅ Verified | Sum of physical/property adjustments (%) |
| 26 | {{COMP4_Final}} | comp4-adj-price-per-unit | SALE4.adjPricePerUnit | ✅ Verified | Final adjusted price per unit |
| 27 | {{COMP4_NetAdj}} | comp4-net-adj | SALE4.netAdj | ✅ Verified | Net adjustment % (trans + property) |
| 28 | {{COMP4_GrossAdj}} | comp4-gross-adj | SALE4.grossAdj | ✅ Verified | Absolute value of all adjustments |

#### Comparable 5 (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 29 | {{COMP5_TransactionPrice}} | comp5-price-per-unit | SALE5.pricePerUnit | ✅ Verified | Sale price ÷ units |
| 30 | {{COMP5_TransactionalAdj}} | comp5-total-trans-adj | SALE5.totalTransAdj | ✅ Verified | Sum of transaction adjustments (%) |
| 31 | {{COMP5_Adjusted}} | comp5-trans-adj-price | SALE5.transAdjPrice | ✅ Verified | Price after transaction adjustments |
| 32 | {{COMP5_PropertyAdj}} | comp5-total-phys-adj | SALE5.totalPhysAdj | ✅ Verified | Sum of physical/property adjustments (%) |
| 33 | {{COMP5_Final}} | comp5-adj-price-per-unit | SALE5.adjPricePerUnit | ✅ Verified | Final adjusted price per unit |
| 34 | {{COMP5_NetAdj}} | comp5-net-adj | SALE5.netAdj | ✅ Verified | Net adjustment % (trans + property) |
| 35 | {{COMP5_GrossAdj}} | comp5-gross-adj | SALE5.grossAdj | ✅ Verified | Absolute value of all adjustments |

---

### Section 2: Statistical Summary Rows (28 fields)

#### HIGH Summary Row (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 36 | {{COMP_HIGH_TransactionPrice}} | dca-high-price-per-unit | Calculated | ✅ Verified | MAX(comp1-5 transaction prices) |
| 37 | {{COMP_HIGH_TransactionalAdj}} | dca-high-trans-adj | Calculated | ✅ Verified | Trans adj % for highest price comp |
| 38 | {{COMP_HIGH_Adjusted}} | dca-high-trans-adj-price | Calculated | ✅ Verified | Adjusted price for highest comp |
| 39 | {{COMP_HIGH_PropertyAdj}} | dca-high-phys-adj | Calculated | ✅ Verified | Property adj % for highest comp |
| 40 | {{COMP_HIGH_Final}} | dca-high-final-price | Calculated | ✅ Verified | Final adjusted price for highest |
| 41 | {{COMP_HIGH_NetAdj}} | dca-high-net-adj | Calculated | ✅ Verified | Net adj % for highest comp |
| 42 | {{COMP_HIGH_GrossAdj}} | dca-high-gross-adj | Calculated | ✅ Verified | Gross adj % for highest comp |

#### AVG (Average) Summary Row (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 43 | {{COMP_AVG_TransactionPrice}} | dca-avg-price-per-unit | Calculated | ✅ Verified | AVERAGE(comp1-5 transaction prices) |
| 44 | {{COMP_AVG_TransactionalAdj}} | dca-avg-trans-adj | Calculated | ✅ Verified | AVERAGE(comp1-5 trans adj %) |
| 45 | {{COMP_AVG_Adjusted}} | dca-avg-trans-adj-price | Calculated | ✅ Verified | AVERAGE(comp1-5 adjusted prices) |
| 46 | {{COMP_AVG_PropertyAdj}} | dca-avg-phys-adj | Calculated | ✅ Verified | AVERAGE(comp1-5 property adj %) |
| 47 | {{COMP_AVG_Final}} | dca-avg-final-price | Calculated | ✅ Verified | AVERAGE(comp1-5 final prices) |
| 48 | {{COMP_AVG_NetAdj}} | dca-avg-net-adj | Calculated | ✅ Verified | AVERAGE(comp1-5 net adj %) |
| 49 | {{COMP_AVG_GrossAdj}} | dca-avg-gross-adj | Calculated | ✅ Verified | AVERAGE(comp1-5 gross adj %) |

#### MED (Median) Summary Row (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 50 | {{COMP_MED_TransactionPrice}} | dca-med-price-per-unit | Calculated | ✅ Verified | MEDIAN(comp1-5 transaction prices) |
| 51 | {{COMP_MED_TransactionalAdj}} | dca-med-trans-adj | Calculated | ✅ Verified | Trans adj % for median comp |
| 52 | {{COMP_MED_Adjusted}} | dca-med-trans-adj-price | Calculated | ✅ Verified | Adjusted price for median comp |
| 53 | {{COMP_MED_PropertyAdj}} | dca-med-phys-adj | Calculated | ✅ Verified | Property adj % for median comp |
| 54 | {{COMP_MED_Final}} | dca-med-final-price | Calculated | ✅ Verified | Final adjusted price for median |
| 55 | {{COMP_MED_NetAdj}} | dca-med-net-adj | Calculated | ✅ Verified | Net adj % for median comp |
| 56 | {{COMP_MED_GrossAdj}} | dca-med-gross-adj | Calculated | ✅ Verified | Gross adj % for median comp |

#### LOW Summary Row (7 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 57 | {{COMP_LOW_TransactionPrice}} | dca-low-price-per-unit | Calculated | ✅ Verified | MIN(comp1-5 transaction prices) |
| 58 | {{COMP_LOW_TransactionalAdj}} | dca-low-trans-adj | Calculated | ✅ Verified | Trans adj % for lowest price comp |
| 59 | {{COMP_LOW_Adjusted}} | dca-low-trans-adj-price | Calculated | ✅ Verified | Adjusted price for lowest comp |
| 60 | {{COMP_LOW_PropertyAdj}} | dca-low-phys-adj | Calculated | ✅ Verified | Property adj % for lowest comp |
| 61 | {{COMP_LOW_Final}} | dca-low-final-price | Calculated | ✅ Verified | Final adjusted price for lowest |
| 62 | {{COMP_LOW_NetAdj}} | dca-low-net-adj | Calculated | ✅ Verified | Net adj % for lowest comp |
| 63 | {{COMP_LOW_GrossAdj}} | dca-low-gross-adj | Calculated | ✅ Verified | Gross adj % for lowest comp |

---

### Section 3: Conclusion Section (5 fields)

| # | HTML Field ID | Registry Field ID | Valcre Source | Status | Notes |
|---|--------------|-------------------|---------------|--------|-------|
| 64 | {{subject-units}} | subject-units | SUBJECT.units | ✅ Verified | Number of units in subject property |
| 65 | {{SCA_ConcludedValuePerUnit}} | sca-concluded-value-per-unit | Calculated/Manual | ✅ Verified | Appraiser's concluded $/unit from DCA |
| 66 | {{SCA_IndicatedValue}} | sca-indicated-value | Calculated | ✅ Verified | concludedValuePerUnit × subject-units |
| 67 | {{SCA_IndicatedValueRounded}} | sca-indicated-value-rounded | Calculated | ✅ Verified | Rounded to nearest $5,000 or $10,000 |
| 68 | {{SCA_ValuePerSF}} | sca-value-per-sf | Calculated | ✅ Verified | indicatedValue ÷ subject total SF |

---

## Field Status Summary

**✅ All 68 Fields Verified:**
- 35 comparable fields (7 per comp × 5 comps)
- 28 summary fields (7 per row × 4 summary rows: HIGH/AVG/MED/LOW)
- 5 conclusion fields

**Registry Status:**
- Total registry field count: 784 fields
- All Page 61 fields exist and verified
- No missing fields
- Ready for HTML template update

---

## Calculation Logic

### Comparable Rows (Comp 1-5)
**Input from Page 59 Adjustment Grid:**
- Transaction Price = Sale Price ÷ Units (from comp data)
- Transaction Adjustments % = Sum of time, financing, conditions adjustments
- Property Adjustments % = Sum of location, quality, condition, size adjustments

**Calculations:**
1. **Trans Adjusted Price** = Transaction Price × (1 + Trans Adj %)
2. **Final Adjusted Price** = Trans Adjusted Price × (1 + Property Adj %)
3. **Net Adjustment %** = Trans Adj % + Property Adj %
4. **Gross Adjustment %** = |Trans Adj %| + |Property Adj %|

### Summary Rows
**HIGH Row:** Maximum values across all 5 comps
- Transaction Price = MAX(comp1-5 transaction prices)
- (Same for all columns - pick values from the comp with highest final price)

**AVG Row:** Average values across all 5 comps
- Transaction Price = AVERAGE(comp1-5 transaction prices)
- Trans Adj % = AVERAGE(comp1-5 trans adj %)
- etc.

**MED Row:** Median values
- Transaction Price = MEDIAN(comp1-5 transaction prices)
- (Pick values from the comp at median position)

**LOW Row:** Minimum values
- Transaction Price = MIN(comp1-5 transaction prices)
- (Pick values from the comp with lowest final price)

### Conclusion Section
**Concluded Value Per Unit:**
- Appraiser judgment based on HIGH/AVG/MED/LOW range
- Typically weighted toward comps with lowest gross adjustment %

**Indicated Value:**
- SCA Indicated Value = Concluded $/Unit × Subject Units
- Example: $145,000/unit × 12 units = $1,740,000

**Value Per SF:**
- Total subject SF = sum of all unit square footages
- Value/SF = Indicated Value ÷ Total SF

---

## HTML Implementation Notes

### Table Structure
```html
<!-- Page 61: DCA Conclusion Grid -->
<table class="dca-conclusion-table">
  <thead>
    <tr>
      <th>COMPARABLE</th>
      <th>TRANSACTION PRICE PER UNIT</th>
      <th>TRANSACTIONAL ADJ %</th>
      <th>ADJUSTED $/UNIT</th>
      <th>PROPERTY ADJ %</th>
      <th>FINAL $/UNIT</th>
      <th>NET ADJ %</th>
      <th>GROSS ADJ %</th>
    </tr>
  </thead>
  <tbody>
    <!-- Comp 1-5 rows -->
    <tr>
      <td>Comparable 1</td>
      <td><span class="field-mapped" title="{{comp1-price-per-unit}}">{{comp1-price-per-unit}}</span></td>
      <td><span class="field-mapped" title="{{comp1-total-trans-adj}}">{{comp1-total-trans-adj}}</span>%</td>
      <td><span class="field-mapped" title="{{comp1-trans-adj-price}}">{{comp1-trans-adj-price}}</span></td>
      <td><span class="field-mapped" title="{{comp1-total-phys-adj}}">{{comp1-total-phys-adj}}</span>%</td>
      <td><span class="field-mapped" title="{{comp1-adj-price-per-unit}}">{{comp1-adj-price-per-unit}}</span></td>
      <td><span class="field-mapped" title="{{comp1-net-adj}}">{{comp1-net-adj}}</span>%</td>
      <td><span class="field-mapped" title="{{comp1-gross-adj}}">{{comp1-gross-adj}}</span>%</td>
    </tr>
    <!-- ... Comp 2-5 rows same pattern ... -->

    <!-- Summary Rows -->
    <tr class="summary-row">
      <td><strong>HIGH</strong></td>
      <td><span class="field-mapped" title="{{dca-high-price-per-unit}}">{{dca-high-price-per-unit}}</span></td>
      <!-- ... etc ... -->
    </tr>
    <tr class="summary-row">
      <td><strong>AVG</strong></td>
      <td><span class="field-mapped" title="{{dca-avg-price-per-unit}}">{{dca-avg-price-per-unit}}</span></td>
      <!-- ... etc ... -->
    </tr>
    <!-- ... MED, LOW rows ... -->
  </tbody>
</table>

<!-- Conclusion Section -->
<div class="dca-conclusion">
  <p>Based on the above analysis, the concluded value per unit is
     <span class="field-mapped" title="{{sca-concluded-value-per-unit}}">{{sca-concluded-value-per-unit}}</span>.
  </p>
  <p>Indicated Value via Sales Comparison Approach:</p>
  <p><span class="field-mapped" title="{{sca-concluded-value-per-unit}}">{{sca-concluded-value-per-unit}}</span> ×
     <span class="field-mapped" title="{{subject-units}}">{{subject-units}}</span> units =
     <strong><span class="field-mapped" title="{{sca-indicated-value}}">{{sca-indicated-value}}</span></strong>
  </p>
  <p>Rounded: <strong><span class="field-mapped" title="{{sca-indicated-value-rounded}}">{{sca-indicated-value-rounded}}</span></strong></p>
</div>
```

---

## Relationship to Page 59

**Data Flow:**
```
Page 59 (Sales Comparison Grid)
    ↓
Raw comp data + Adjustments applied
    ↓
Page 61 (DCA Conclusion)
    ↓
Statistical summary (HIGH/AVG/MED/LOW)
    ↓
Concluded value per unit
    ↓
SCA Indicated Value
```

**Page 59 Outputs → Page 61 Inputs:**
- comp1-price-per-unit → COMP1_TransactionPrice
- comp1-total-trans-adj → COMP1_TransactionalAdj
- comp1-trans-adj-price → COMP1_Adjusted
- comp1-total-phys-adj → COMP1_PropertyAdj
- comp1-adj-price-per-unit → COMP1_Final
- comp1-net-adj → COMP1_NetAdj
- comp1-gross-adj → COMP1_GrossAdj

(Same pattern for comp2-5)

---

## Next Steps

**For HTML Template Update:**
1. Read current Page 61 HTML (PREVIEW-Master.html)
2. Replace all 68 field IDs using crosswalk
3. Verify table structure matches 5 comp rows + 4 summary rows + conclusion
4. Test field mapping with sample data
5. Commit changes

**For Sales Comp Calc Engine (Future):**
- Build calculation logic for:
  - Statistical summaries (HIGH/AVG/MED/LOW)
  - Net adjustment % = trans adj % + property adj %
  - Gross adjustment % = |trans adj %| + |property adj %|
  - Indicated value = concluded $/unit × subject units
  - Value per SF = indicated value ÷ total SF

---

**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Status:** ✅ Field mapping complete | Ready for HTML template update
**Registry Status:** ✅ All 68 fields verified at 784 total registry fields
