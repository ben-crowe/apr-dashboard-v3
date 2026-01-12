# Field Mapping - Page 37 (Rent Roll Table)

**Page:** 37 - Multi-Family Subject Rent Roll
**Location in HTML:** Lines 2344-2467
**Total Fields:** 26 unique rent roll fields (+ 2 footer fields)
**Status:** HTML Updated ✅

---

## Field Crosswalk

| # | HTML Field ID (Registry) | Valcre Source | Sample Value | Notes |
|---|-------------------------|---------------|--------------|-------|
| **Row 1: Type 1 (Flat 1 Bed / 1 Bath) - 12 fields** |
| 1 | `rentroll-type1-name` | RENTROLL.Type1Name | "Flat 1 Bed / 1 Bath" | Unit type name |
| 2 | `rentroll-type1-desc` | RENTROLL.Type1Desc | "One Bed/One Bath" | Unit description |
| 3 | `rentroll-type1-occ` | RENTROLL.Type1Occupied | "4" | Occupied units count |
| 4 | `rentroll-type1-vac` | RENTROLL.Type1Vacant | "0" | Vacant units count |
| 5 | `rentroll-type1-total` | RENTROLL.Type1Total | "4" | Total units of this type |
| 6 | `rentroll-type1-pct` | RENTROLL.Type1Percent | "25%" | Percentage of total units |
| 7 | `rentroll-type1-size` | RENTROLL.Type1AvgSize | "550" | Average unit size (sq ft) |
| 8 | `rentroll-type1-vac-pct` | RENTROLL.Type1VacancyPct | "0.0%" | Vacancy percentage |
| 9 | `rentroll-type1-occ-pct` | RENTROLL.Type1OccupancyPct | "100.0%" | Occupancy percentage |
| 10 | `rentroll-type1-recent-sf` | RENTROLL.Type1RecentPerSF | "$0.00" | Recent lease $/SF |
| 11 | `rentroll-type1-actual-unit` | RENTROLL.Type1ActualPerUnit | "$895" | Actual rent per unit |
| 12 | `rentroll-type1-actual-sf` | RENTROLL.Type1ActualPerSF | "$1.63" | Actual rent per SF |
| **Row 2: Type 2 (Flat 2 Bed / 1 Bath) - 12 fields** |
| 13 | `rentroll-type2-name` | RENTROLL.Type2Name | "Flat 2 Bed / 1 Bath" | Unit type name |
| 14 | `rentroll-type2-desc` | RENTROLL.Type2Desc | "Two Bed/One Bath" | Unit description |
| 15 | `rentroll-type2-occ` | RENTROLL.Type2Occupied | "12" | Occupied units count |
| 16 | `rentroll-type2-vac` | RENTROLL.Type2Vacant | "0" | Vacant units count |
| 17 | `rentroll-type2-total` | RENTROLL.Type2Total | "12" | Total units of this type |
| 18 | `rentroll-type2-pct` | RENTROLL.Type2Percent | "75%" | Percentage of total units |
| 19 | `rentroll-type2-size` | RENTROLL.Type2AvgSize | "667" | Average unit size (sq ft) |
| 20 | `rentroll-type2-vac-pct` | RENTROLL.Type2VacancyPct | "0.0%" | Vacancy percentage |
| 21 | `rentroll-type2-occ-pct` | RENTROLL.Type2OccupancyPct | "100.0%" | Occupancy percentage |
| 22 | `rentroll-type2-recent-sf` | RENTROLL.Type2RecentPerSF | "$0.00" | Recent lease $/SF |
| 23 | `rentroll-type2-actual-unit` | RENTROLL.Type2ActualPerUnit | "$1,055" | Actual rent per unit |
| 24 | `rentroll-type2-actual-sf` | RENTROLL.Type2ActualPerSF | "$1.58" | Actual rent per SF |
| **TOTAL / AVERAGE Row - 13 fields** |
| 25 | `rentroll-total-occ` | RENTROLL.TotalOccupied | "16" | Total occupied units |
| 26 | `rentroll-total-vac` | RENTROLL.TotalVacant | "0" | Total vacant units |
| 27 | `rentroll-total-units` | RENTROLL.TotalUnits | "16" | Total units in building |
| 28 | `rentroll-total-pct` | RENTROLL.TotalPercent | "100%" | Total percentage (always 100%) |
| 29 | `rentroll-avg-size` | RENTROLL.AvgUnitSize | "638" | Average unit size (weighted) |
| 30 | `rentroll-avg-vac-pct` | RENTROLL.AvgVacancyPct | "0.0%" | Average vacancy percentage |
| 31 | `rentroll-avg-occ-pct` | RENTROLL.AvgOccupancyPct | "100.0%" | Average occupancy percentage |
| 32 | `rentroll-avg-asking-unit` | RENTROLL.AvgAskingPerUnit | "$0" | Average asking rent per unit |
| 33 | `rentroll-avg-asking-sf` | RENTROLL.AvgAskingPerSF | "$0.00" | Average asking rent per SF |
| 34 | `rentroll-avg-recent-unit` | RENTROLL.AvgRecentPerUnit | "$0" | Average recent lease per unit |
| 35 | `rentroll-avg-recent-sf` | RENTROLL.AvgRecentPerSF | "$0.00" | Average recent lease per SF |
| 36 | `rentroll-avg-actual-unit` | RENTROLL.AvgActualPerUnit | "$1,015" | Average actual rent per unit |
| 37 | `rentroll-avg-actual-sf` | RENTROLL.AvgActualPerSF | "$1.59" | Average actual rent per SF |

---

## Table Structure

### 15-Column Rent Roll Table (Lines 2360-2444)

**Header Row 1:** "Rent Roll" title spanning all 15 columns
**Header Row 2:** Category headers (Type, Description, Unit Detail [4 cols], Size, Vac %, Occ %, Asking Rent [2 cols], Recent Leases [2 cols], Actual Rent [2 cols])
**Header Row 3:** Sub-headers for unit detail (Occ, Vac, Tot, % Tot) and rent categories ($/Unit, $/SF for each)

**Data Rows:**
- **Row 1:** Type 1 (Flat 1 Bed / 1 Bath) - 12 mapped fields
- **Row 2:** Type 2 (Flat 2 Bed / 1 Bath) - 12 mapped fields
- **Row 3:** TOTAL / AVERAGE - 13 mapped fields

**Styling:**
- Font size: 7.5pt (body), 7pt (main headers), 6pt (sub-headers), 9pt (title)
- Padding: 4px 2px (tight horizontal spacing for 15 columns)
- Brand color: #003B7E (title row and total row border)
- Alternating row colors: #f0f8ff and white

---

## Field Categories

### Unit Detail (Columns 3-6)
**Purpose:** Physical unit counts and mix breakdown
**Fields per row:** 4 (Occ, Vac, Tot, % Tot)
**Type:** Integer counts and percentages
**Calculation:** Type totals sum to building totals

### Unit Characteristics (Columns 7-9)
**Purpose:** Unit size and occupancy metrics
**Fields per row:** 3 (Size, Vac %, Occ %)
**Type:** Integer (size) and percentages
**Calculation:** Size is weighted average for totals row

### Asking Rent (Columns 10-11)
**Purpose:** Advertised rental rates for vacant units
**Fields per row:** 2 ($/Unit, $/SF)
**Type:** Currency
**Note:** Empty cells allowed if no asking rents available

### Recent Leases (Columns 12-13)
**Purpose:** Most recent lease transactions
**Fields per row:** 2 ($/Unit, $/SF)
**Type:** Currency
**Note:** Tracks recent market activity

### Actual Rent (Columns 14-15)
**Purpose:** Current in-place contract rents
**Fields per row:** 2 ($/Unit, $/SF)
**Type:** Currency
**Calculation:** Weighted average for totals row

---

## Calculation Logic

### Weighted Averages (TOTAL/AVERAGE Row)
All average values are **weighted by unit count**, not simple averages:

**Average Unit Size:**
```
avg-size = (type1-total × type1-size + type2-total × type2-size) / total-units
638 = (4 × 550 + 12 × 667) / 16
```

**Average Actual Rent per Unit:**
```
avg-actual-unit = (type1-total × type1-actual-unit + type2-total × type2-actual-unit) / total-units
$1,015 = (4 × $895 + 12 × $1,055) / 16
```

**Average Actual Rent per SF:**
```
avg-actual-sf = avg-actual-unit / avg-size
$1.59 = $1,015 / 638
```

### Occupancy Calculations
```
vac-pct = vac / total × 100%
occ-pct = occ / total × 100% = 100% - vac-pct
```

### Percentage of Total
```
type1-pct = type1-total / total-units × 100%
25% = 4 / 16 × 100%
```

---

## Field Registry Status

### Expected Registry Additions (37 fields total)
All 37 rent roll fields need to be added to fieldRegistry.ts under category: `rent-roll`

**Type 1 Fields (12):**
- ✅ rentroll-type1-name (category: rent-roll, type: text)
- ✅ rentroll-type1-desc (category: rent-roll, type: text)
- ✅ rentroll-type1-occ (category: rent-roll, type: number)
- ✅ rentroll-type1-vac (category: rent-roll, type: number)
- ✅ rentroll-type1-total (category: rent-roll, type: number)
- ✅ rentroll-type1-pct (category: rent-roll, type: percentage)
- ✅ rentroll-type1-size (category: rent-roll, type: number)
- ✅ rentroll-type1-vac-pct (category: rent-roll, type: percentage)
- ✅ rentroll-type1-occ-pct (category: rent-roll, type: percentage)
- ✅ rentroll-type1-recent-sf (category: rent-roll, type: currency)
- ✅ rentroll-type1-actual-unit (category: rent-roll, type: currency)
- ✅ rentroll-type1-actual-sf (category: rent-roll, type: currency)

**Type 2 Fields (12):**
- (Same structure as Type 1, but with `type2-` prefix)

**TOTAL/AVERAGE Fields (13):**
- ✅ rentroll-total-occ (category: rent-roll, type: number, calculated: true)
- ✅ rentroll-total-vac (category: rent-roll, type: number, calculated: true)
- ✅ rentroll-total-units (category: rent-roll, type: number, calculated: true)
- ✅ rentroll-total-pct (category: rent-roll, type: percentage, calculated: true)
- ✅ rentroll-avg-size (category: rent-roll, type: number, calculated: true)
- ✅ rentroll-avg-vac-pct (category: rent-roll, type: percentage, calculated: true)
- ✅ rentroll-avg-occ-pct (category: rent-roll, type: percentage, calculated: true)
- ✅ rentroll-avg-asking-unit (category: rent-roll, type: currency, calculated: true)
- ✅ rentroll-avg-asking-sf (category: rent-roll, type: currency, calculated: true)
- ✅ rentroll-avg-recent-unit (category: rent-roll, type: currency, calculated: true)
- ✅ rentroll-avg-recent-sf (category: rent-roll, type: currency, calculated: true)
- ✅ rentroll-avg-actual-unit (category: rent-roll, type: currency, calculated: true)
- ✅ rentroll-avg-actual-sf (category: rent-roll, type: currency, calculated: true)

---

## Next Steps

1. ✅ **HTML Updated** - Page 37 replaced with 15-column rent roll table (commit a8a6153)
2. **Field Registry:** Add 37 rent roll fields to fieldRegistry.ts
3. **Calculation Engine:** Implement weighted average calculations for TOTAL/AVERAGE row
4. **Test Data:** Add sample rent roll data to northBattlefordTestData-REAL.ts
5. **Update TABLE-OF-CONTENTS:** Note Page 37 as "Rent Roll Table" (26 fields)

---

**Created:** December 18, 2025
**Status:** HTML wired with registry field IDs, ready for registry additions
