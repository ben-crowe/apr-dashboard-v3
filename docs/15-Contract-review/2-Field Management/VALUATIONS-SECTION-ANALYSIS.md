# 15 - VALUATIONS Section Analysis

**Date:** 2025-12-24  
**Purpose:** Current state analysis before reorganization

---

## CURRENT STATE: CALC SECTION SUBSECTIONS

### 1. Subsection IDs and Display Names (Currently Rendered)

| Subsection ID | Display Name | User-Input | Calculated | Total |
|---------------|--------------|------------|------------|-------|
| `calc-unit-mix` | Unit Mix | 20 | 22 | 42 |
| `calc-other-income` | Other Income | 3 | 9 | 12 |
| `calc-vacancy` | Vacancy & Loss | 3 | 7 | 10 |
| `calc-expenses` | Operating Expenses | 41 | 33 | 74 |
| `calc-cap` | Cap Rate | 3 | 4 | 7 |
| `calc-adjustments` | Adjustments | 3 | 1 | 4 |
| `calc-results` | Calculated Results | 0 | 8 | 8 |

**Total Currently Rendered:** 73 user-input, 84 calculated = **157 fields**

### 2. Additional Subsections in Registry (NOT Currently Rendered)

| Subsection ID | Display Name | User-Input | Calculated | Total |
|---------------|--------------|------------|------------|-------|
| `expenses` | Expenses (alternative?) | 7 | 0 | 7 |
| `calc-revenue-pct` | Revenue Percentages | 0 | 8 | 8 |
| `calculated-values` | Calculated Values | 0 | 8 | 8 |

**Total Additional:** 7 user-input, 16 calculated = **23 fields**

### 3. Sales Comparison Fields Status

**❌ Sales Comparison fields are NOT in `calc` section**

- **Section:** `sales-comparison` (separate from `calc`)
- **Subsections:** `comp1`, `comp2`, `comp3`, `comp4`, `comp5`
- **Field Counts:**
  - comp1: 39 user-input fields
  - comp2: 37 user-input fields
  - comp3: 37 user-input fields
  - comp4: 37 user-input fields
  - comp5: 37 user-input fields
- **Total:** 187 user-input fields (all user-input, no calculated fields in registry)

**Note:** Sales comparison fields include:
- Property data (address, price, units, SF, year built, etc.)
- Adjustment inputs (location, condition, age, etc.)
- Transaction details (date, buyer, conditions of sale, etc.)

---

## PROPOSED REORGANIZATION

### Proposed Structure for "15 - VALUATIONS" Tab

#### **Tab 1: Income Inputs**
- **Purpose:** All user-input fields for income approach
- **Subsections to combine:**
  - `calc-unit-mix` (20 user-input)
  - `calc-other-income` (3 user-input)
  - `calc-vacancy` (3 user-input)
  - `calc-expenses` (41 user-input)
  - `calc-cap` (3 user-input)
  - `expenses` (7 user-input) - if different from calc-expenses
- **Total:** ~77 user-input fields

#### **Tab 2: Income Results**
- **Purpose:** All calculated fields for income approach
- **Subsections to combine:**
  - `calc-unit-mix` (22 calculated)
  - `calc-other-income` (9 calculated)
  - `calc-vacancy` (7 calculated)
  - `calc-expenses` (33 calculated)
  - `calc-cap` (4 calculated)
  - `calc-revenue-pct` (8 calculated)
  - `calculated-values` (8 calculated)
- **Total:** ~91 calculated fields
- **Key outputs:** PGR, EGR, NOI, Indicated Value, Value/Unit, Value/SF

#### **Tab 3: Sales Comp Data**
- **Purpose:** All comp property inputs
- **Source:** `sales-comparison` section, subsections `comp1-5`
- **Fields:** Address, price, units, SF, year built, transaction details, etc.
- **Total:** 187 user-input fields

#### **Tab 4: Sales Adjustments**
- **Purpose:** All adjustment inputs for comps
- **Source:** `sales-comparison` section, subsections `comp1-5`
- **Fields:** Location adj, condition adj, age adj, etc.
- **Total:** Included in Sales Comp Data (part of comp1-5 fields)

#### **Tab 5: Sales Results**
- **Purpose:** Calculated comp metrics
- **Note:** Currently NO calculated fields in `sales-comparison` section
- **May need to add:** Price/unit, adjusted values, range calculations
- **Total:** 0 fields currently (would need to be added)

#### **Tab 6: Reconciliation**
- **Purpose:** Final value weighting
- **Source:** `recon` section (separate tab currently)
- **Note:** Currently exists as separate "21 - RECONCILIATION" tab

---

## QUESTIONS FOR DECISION

1. **Should Sales Comparison fields be moved INTO the calc section?**
   - Currently they're in separate `sales-comparison` section
   - Would require moving 187 fields from `sales-comparison` to `calc`

2. **Should Reconciliation be included in VALUATIONS tab?**
   - Currently separate "21 - RECONCILIATION" tab
   - Or keep separate but reference from VALUATIONS?

3. **What about `calc-adjustments` subsection?**
   - Currently 3 user-input, 1 calculated
   - Should this be in Income Inputs or separate?

4. **Are `expenses` and `calc-expenses` different?**
   - Need to verify if `expenses` subsection is duplicate or serves different purpose

5. **Sales Results tab - calculated fields don't exist yet**
   - Should we add calculated fields to sales-comparison section?
   - Or calculate on-the-fly in UI?

---

## RECOMMENDATION

**Option A: Keep Sales Comparison Separate (Current Structure)**
- Keep `sales-comparison` as separate section/tab
- Reorganize only `calc` section into Income Inputs / Income Results
- Simpler, less disruptive

**Option B: Consolidate Everything into VALUATIONS**
- Move sales-comparison fields into calc section
- Create unified VALUATIONS tab with all 6 sub-tabs
- More comprehensive but requires major refactor

**Recommendation:** Start with **Option A** - reorganize calc section first, then evaluate if consolidation makes sense.



