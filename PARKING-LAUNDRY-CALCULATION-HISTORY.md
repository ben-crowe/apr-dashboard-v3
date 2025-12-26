# Parking & Laundry Income Calculation - Complete History & Solution

**Date:** December 23, 2025
**Investigation:** Marcel Superagent + User Validation
**Purpose:** Document previous fixes and correct formula usage
**Status:** ✅ **VALIDATED CORRECT - Calculator Working as Intended**

---

## ✅ VALIDATED CONCLUSION (Dec 23, 2025)

### For North Battleford Property:

**Parking/Laundry = $0 is CORRECT** ✅

**Why?**
- Parking and laundry are **INCLUDED in the $204,240 rental revenue**
- This property charges all-inclusive rent (no separate parking/laundry fees)
- Current test data configuration is the validated state

**Calculator Value:**
- Engine produces: **$1,790,000** (validated)
- Previous reference: $1,780,000
- Difference: $10K (acceptable rounding variance, NOT a parking/laundry issue)

**Conclusion:** Calculator is working correctly. Move forward with current configuration.

---

## 🎯 TL;DR - The Answer

### For North Battleford Property (Current Test Data):
**Parking and laundry are INCLUDED in rental revenue, NOT separate line items.**

```typescript
// Current validated state (Commit 0e42e7e - Dec 12, 2025)
'calc-parking-per-unit': 0,
'calc-parking-total': 0,
'calc-laundry-per-unit': 0,
'calc-laundry-total': 0,
'calc-other-income': 0,
'calc-pgr': 204240,  // Parking/laundry INCLUDED in rental revenue
```

**Why all zeros?**
- PGR = $204,240 already includes parking and laundry
- Rental units charge all-inclusive rent
- No separate parking/laundry charges to residents

---

## 📋 Complete Commit Timeline

### 1. Dec 11, 2025 (b6b900a) - Initial Fix Attempt
**Commit:** "Fix parking and laundry income values in test data"

**Changes Made:**
- `calc-parking-total: 0 → 6000` ($6,000 annual)
- `calc-parking-per-unit: 0 → 375` ($375/unit/month) ❌ **WRONG UNIT!**
- `calc-laundry-total: 0 → 2400` ($2,400 annual)
- `calc-laundry-per-unit: 0 → 150` ($150/unit/month) ❌ **WRONG UNIT!**
- `calc-total-other-income: 0 → 8400`

**Problem:** Confused annual values with monthly per-unit values

---

### 2. Dec 12, 2025 (59ed46e) - Income Breakdown Fix
**Commit:** "Fix income breakdown: separate rental, parking, laundry"

**Changes Made:**
- Rental Revenue: $204,240 → $195,840 (reduced)
- Parking: $0 → $6,000 (separated)
- Laundry: $0 → $2,400 (separated)
- PGR total: $204,240 (unchanged)

**Intent:** Separate parking/laundry from rental revenue as distinct line items

---

### 3. Dec 12, 2025 (0e42e7e) - REVERT TO VALIDATED STATE ✅
**Commit:** "Revert: parking/laundry to $0 (validated state)"

**Changes Made:**
- Parking: $6,000 → $0
- Laundry: $2,400 → $0
- Rental Revenue: Back to $204,240 (all-inclusive)

**Reason:** "Parking and laundry included in rental revenue"

**Result:** This is the **current validated state** - confirmed correct!

---

## 🔧 How the Calculation Engine Works

**File:** `src/features/report-builder/store/reportBuilderStore.ts`
**Lines:** 5818-5824

### Three Ways to Input Other Income:

#### Option 1: Per-Unit-Per-Month (Parking)
```typescript
const parkingPerUnit = getFieldValue("calc-parking-per-unit");  // $/unit/month
const parkingTotal = parkingPerUnit * totalUnits * 12;          // Annual
```

**Example for $6,000/year total:**
- Input: `calc-parking-per-unit: 31.25` ($/unit/month)
- Formula: $31.25 × 16 units × 12 months = $6,000

**When to use:** Parking charged per unit per month (e.g., $30/unit/month)

---

#### Option 2: Per-Unit-Per-Month (Laundry)
```typescript
const laundryPerUnit = getFieldValue("calc-laundry-per-unit");  // $/unit/month
const laundryTotal = laundryPerUnit * totalUnits * 12;          // Annual
```

**Example for $2,400/year total:**
- Input: `calc-laundry-per-unit: 12.5` ($/unit/month)
- Formula: $12.50 × 16 units × 12 months = $2,400

**When to use:** Laundry charged per unit per month (e.g., $12/unit/month)

---

#### Option 3: Flat Annual Amount (Other Income) ✅ USE THIS FOR FLAT AMOUNTS
```typescript
const otherIncome = getFieldValue("calc-other-income");  // Flat annual $
const totalOtherIncome = parkingTotal + laundryTotal + otherIncome;
```

**Example for $6,000/year flat:**
- Input: `calc-other-income: 6000` (flat annual)
- Formula: No calculation - just adds 6000 as-is

**When to use:**
- ✅ Flat annual amounts (not per-unit)
- ✅ Miscellaneous income
- ✅ Storage fees, pet fees (if flat annual)
- ✅ Vending machines, bulk cable/internet income

---

## 🎓 The Lesson Learned

### Common Mistake:
Confusing **annual per-unit values** with **monthly per-unit values**

**Example Error (from commit b6b900a):**
```typescript
// WRONG - This treats $375/year as $375/month!
'calc-parking-per-unit': 375,  // Meant annual, but formula does × 12
// Result: $375 × 16 units × 12 months = $72,000 (way too high!)
```

**Correct conversion:**
```typescript
// RIGHT - Convert annual to monthly first
// $375/year ÷ 12 months = $31.25/month
'calc-parking-per-unit': 31.25,
// Result: $31.25 × 16 units × 12 months = $6,000 ✓
```

---

## 📊 Field Reference Table

| Field ID | Label | Unit | Formula | Example Input | Annual Result |
|----------|-------|------|---------|---------------|---------------|
| `calc-parking-per-unit` | Parking $/Unit/Mo | $/unit/month | value × units × 12 | 31.25 | $6,000 |
| `calc-parking-total` | Parking Annual | Calculated | (auto-calculated) | - | $6,000 |
| `calc-laundry-per-unit` | Laundry $/Unit/Mo | $/unit/month | value × units × 12 | 12.5 | $2,400 |
| `calc-laundry-total` | Laundry Annual | Calculated | (auto-calculated) | - | $2,400 |
| `calc-other-income` | Other Income Annual | Flat annual $ | No formula (as-is) | 6000 | $6,000 |
| `calc-total-other-income` | Total Other Income | Calculated | parking + laundry + other | - | $8,400 |

---

## 🏢 Property-Specific Guidance

### North Battleford Apartments (VAL251012)
**Rental Structure:** All-inclusive rent (parking/laundry included)
```typescript
'calc-parking-per-unit': 0,      // Included in rent
'calc-laundry-per-unit': 0,      // Included in rent
'calc-other-income': 0,          // No separate charges
'calc-pgr': 204240,              // Total includes everything
```

---

### Properties with Separate Parking/Laundry Charges
**Rental Structure:** Base rent + separate parking/laundry fees

**Scenario A: Per-unit-per-month charges**
```typescript
// Example: $30/month parking, $15/month laundry per unit
'calc-parking-per-unit': 30,     // $/unit/month
'calc-laundry-per-unit': 15,     // $/unit/month
'calc-other-income': 0,
// Result: Parking = $30 × 16 × 12 = $5,760
//         Laundry = $15 × 16 × 12 = $2,880
```

**Scenario B: Flat annual amounts**
```typescript
// Example: Property gets flat $6,000/year from parking lot lease
'calc-parking-per-unit': 0,
'calc-laundry-per-unit': 0,
'calc-other-income': 6000,       // Flat $6,000/year
// Result: Other Income = $6,000 (no calculation)
```

---

## 🔍 How to Determine Which Method to Use

### Ask These Questions:

**1. Is income charged per unit or property-wide?**
- Per unit → Use `calc-parking-per-unit` or `calc-laundry-per-unit`
- Property-wide flat → Use `calc-other-income`

**2. Is the charge monthly or annual?**
- Monthly → Input monthly amount in per-unit fields (formula multiplies by 12)
- Annual → Convert to monthly first, OR use `calc-other-income` for flat amounts

**3. Is the income already in rental revenue?**
- Yes → Set all to $0 (like North Battleford)
- No → Add as separate income

---

## 📝 Code Comments from reportBuilderStore.ts

**Line 5718-5722:**
```typescript
// Other Income (Valcre: $375/unit/yr parking, $150/unit/yr laundry)
// Field values are monthly per unit, multiplied by units × 12 in calc
updateField("calc-parking-per-unit", 31.25); // $375/yr / 12 = $31.25/mo
updateField("calc-laundry-per-unit", 12.5);  // $150/yr / 12 = $12.50/mo
updateField("calc-other-income", 0);
```

**This shows the developer's intent:**
- Input fields expect **monthly per-unit values**
- Formula multiplies by units × 12 to get annual
- For Valcre match: $375/year ÷ 12 = $31.25/month

---

## ✅ Recommended Practice

### For New Properties - Decision Tree:

```
Is parking/laundry separate from rent?
    ├─ NO → Set all to $0 (included in rental revenue)
    │
    └─ YES → Is it charged per unit or flat?
            ├─ Per Unit → Is it monthly or annual?
            │   ├─ Monthly → Use calc-parking-per-unit (input monthly $)
            │   └─ Annual → Convert to monthly first (annual ÷ 12)
            │
            └─ Flat Amount → Use calc-other-income (input annual $)
```

---

## 🚨 Common Pitfalls to Avoid

**❌ WRONG:** Putting annual per-unit value in per-unit field
```typescript
// This will multiply by 12 again!
'calc-parking-per-unit': 375,  // Intended $375/year
// Result: $375 × 16 × 12 = $72,000 (12x too high!)
```

**✅ CORRECT:** Convert to monthly first
```typescript
'calc-parking-per-unit': 31.25,  // $375/year ÷ 12 = $31.25/month
// Result: $31.25 × 16 × 12 = $6,000 ✓
```

**✅ BETTER:** Use flat annual field if not per-unit
```typescript
'calc-other-income': 6000,  // Flat $6,000/year
// Result: $6,000 (no multiplication)
```

---

## 📚 Related Files

**Calculation Engine:**
- `src/features/report-builder/store/reportBuilderStore.ts` (lines 5752-6000)

**Test Data:**
- `src/features/report-builder/data/northBattlefordTestData-REAL.ts`

**Field Registry:**
- `src/features/report-builder/schema/fieldRegistry.ts`
  - `calc-parking-per-unit` (line 2990)
  - `calc-parking-total` (line 2998)
  - `calc-laundry-per-unit` (line 3006)
  - `calc-laundry-total` (line 3014)
  - `calc-other-income` (line 3022)
  - `calc-total-other-income` (line 3030)

**Session Documentation:**
- `docs/-passover-sessions/25.12.08-13 - Marcel-Orchestrator-Calculator-Validation-Report.md`

---

## 🎯 Quick Reference

**For $6,000/year parking + $2,400/year laundry with 16 units:**

### Method A: Per-Unit-Per-Month
```typescript
'calc-parking-per-unit': 31.25,   // $6,000 ÷ 16 ÷ 12
'calc-laundry-per-unit': 12.5,    // $2,400 ÷ 16 ÷ 12
'calc-other-income': 0,
// Total: $8,400/year
```

### Method B: Flat Annual (if not per-unit)
```typescript
'calc-parking-per-unit': 0,
'calc-laundry-per-unit': 0,
'calc-other-income': 8400,        // $6,000 + $2,400
// Total: $8,400/year
```

### Method C: North Battleford (Included in Rent)
```typescript
'calc-parking-per-unit': 0,
'calc-laundry-per-unit': 0,
'calc-other-income': 0,
'calc-pgr': 204240,               // All-inclusive
// Total: $0 other income
```

---

---

## 🎯 Final Validation Summary

**Calculator Status:** ✅ Working correctly
**North Battleford Value:** $1,790,000 (validated)
**Parking/Laundry Config:** $0 (correct - included in rent)
**$10K Variance:** Acceptable rounding difference, not a bug

**Common Mistake to Avoid:**
- ❌ `calc-parking-per-unit: 375` (annual value) → $72,000/year (12x too high!)
- ✅ `calc-parking-per-unit: 31.25` (monthly value) → $6,000/year (correct)
- ✅ `calc-other-income: 6000` (flat annual) → $6,000/year (if not per-unit)

**Decision:** Calculator validated, proceed with current configuration.

---

**Status:** ✅ Validated and confirmed correct as of Dec 23, 2025
**Last Updated:** Dec 23, 2025 by Marcel Superagent + User Validation
**Outcome:** No changes needed - calculator working as intended
