# Calculator Value Discrepancy Investigation

**Date:** December 12, 2025
**Issue:** Calculator not matching reference document values

---

## The Problem

The test data file has values that DON'T match the reference report OR the fixes we supposedly made.

---

## Current Test Data vs Reference Report

| Field | Test Data File | Reference Report (Page 49) | Status |
|-------|----------------|---------------------------|--------|
| **Total Units** | 16 | 14 | ❌ MISMATCH |
| **Vacancy Rate** | 3.8% | 4% | ❌ MISMATCH |
| **Parking/Unit** | $375 | N/A (included in rent) | ⚠️ ISSUE |
| **Laundry/Unit** | $150 | N/A (included in rent) | ⚠️ ISSUE |
| **PGR** | $204,240 | $204,240 | ✓ Match |
| **Vacancy Loss** | $7,761 | $8,170 | ❌ MISMATCH |
| **EGR** | $196,406 | $196,070 | ❌ MISMATCH |
| **NOI** | $111,771 | $111,449 | ❌ MISMATCH |
| **Indicated** | $1,780,000 | $1,780,000 | ✓ Match (by luck!) |

---

## Session Summary Said We Changed These:

From `25.12.12-1 - Calculator-Demo-Store-Fix.md`:
```typescript
// Fixed values
'calc-type1-rent': 1060,  // Was 1064
'calc-parking-per-unit': 0,  // Was 375
'calc-laundry-per-unit': 0,  // Was 150
```

## But The File Currently Shows:

```typescript
'calc-parking-per-unit': 375,   // ← NOT changed to 0!
'calc-laundry-per-unit': 150,   // ← NOT changed to 0!
'calc-vacancy-rate': 3.8,       // ← Should be 4%
'calc-total-units': 16,         // ← Should be 14
```

---

## Root Cause Analysis

Two possibilities:
1. **Changes weren't saved** - The edits from the last session didn't persist
2. **Wrong file** - There might be multiple versions of this file

---

## Reference Report Breakdown (Page 49 - PROJECTION DCAP)

The reference shows this exact breakdown:

```
RENTAL REVENUE
  Total Multifamily Revenue:     $195,840  (100%)

MISCELLANEOUS REVENUE
  Parking Income:                $6,000    (3%)
  Laundry:                       $2,400    (1%)
  TOTAL MISC REVENUE:            $8,400    (4%)

POTENTIAL GROSS REVENUE:         $204,240  (104%)

ALL VACANCY LOSS:                ($7,834)  (4%)
  → Actually shows as 4% in DCAP column

EFFECTIVE GROSS REVENUE:         $196,406  (96%)

OPERATING EXPENSES:
  Taxes:                         ($18,688) (10%)
  Insurance:                     ($11,360) (6%)
  Repairs & Maintenance:         ($13,280) (7%)
  Payroll:                       ($8,000)  (4%)
  Utilities:                     ($21,040) (11%)
  Management Fees:               ($8,347)  (4%)
  Other Expenses:                ($3,920)  (2%)
  TOTAL OPERATING EXPENSES:      ($84,635) (43%)

NET OPERATING INCOME:            $111,771  (57%)
```

Wait - the reference actually shows NOI of $111,771 for 16 units when you look at it correctly!

---

## The REAL Reference Values (Page 49)

Looking more carefully at Page 49 "PROJECTION - DCAP" column:

| Line Item | YTD 2025 | PROJECTION - DCAP |
|-----------|----------|-------------------|
| Total Multifamily Revenue | $195,060 | $195,840 |
| Parking Income | $6,000 | $6,000 |
| Laundry | $2,400 | $2,400 |
| **POTENTIAL GROSS REVENUE** | $203,460 | **$204,240** |
| ALL VACANCY LOSS | ($8,138) | **($7,834)** = (4%) |
| **EFFECTIVE GROSS REVENUE** | $199,322 | **$196,406** |
| Operating Expenses... | ... | ... |
| **TOTAL OPERATING EXPENSES** | ($84,510) | **($84,635)** |
| **NET OPERATING INCOME** | $110,812 | **$111,771** |

---

## Corrected Understanding

The test data might actually be MORE CORRECT than I thought!

**16 units** is correct (the reference shows 16 units)
**NOI = $111,771** matches the PROJECTION - DCAP column
**PGR = $204,240** matches
**Vacancy = 4%** of $204,240 = $8,170... but reference shows $7,834?

Let me recalculate:
- $204,240 × 4% = $8,170 (our calc)
- But reference shows $7,834... that's 3.83%

So the reference is using ~3.83% vacancy, not exactly 4%!

$204,240 × 3.83% = $7,822 ≈ $7,834 ✓

---

## Actual Discrepancy: Parking/Laundry Formula

The REAL issue is how parking and laundry are calculated:

**Reference Report shows:**
- Parking: $6,000/year total (flat)
- Laundry: $2,400/year total (flat)

**Our Calculator does:**
- Parking: $375/unit × 16 units × 12 months = $72,000 ← WRONG!
- Laundry: $150/unit × 16 units × 12 months = $28,800 ← WRONG!

If parking/laundry are multiplied by units AND by 12, we get massive values.
That's why we set them to 0 - to avoid the wrong multiplication.

---

## Questions to Resolve

1. What is the correct formula for parking/laundry in the calculator?
   - Is it `perUnit × units × 12`?
   - Or is it `totalAnnual` (flat amount)?

2. Did our fix (setting to 0) actually get saved?

3. Should we match the reference exactly (14 or 16 units)?

---

## Next Steps

1. Check the calculator engine formula for parking/laundry
2. Verify what values produce $1,780,000
3. Decide on correct test data values

---

**Status:** Investigation in progress
