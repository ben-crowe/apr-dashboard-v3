# Image-Table Catalog: Reference PDF Data Tables

**Created:** 2025-12-08 Session 10
**Source:** `/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/images/`
**Total Images:** 89 files

---

## Critical Finding

The reference PDF contains **Valcre Excel screenshots** embedded as flattened images. Text extraction tools cannot read this data. These image-tables contain critical valuation data that must be manually extracted or OCR'd.

---

## DATA TABLES (Priority - Need Field Verification)

### Income Approach Tables

| Image | Table Name | Key Data | Fields Needed |
|-------|------------|----------|---------------|
| `image25.png` | EXPENSE CONCLUSIONS | 7 expense categories: Taxes, Insurance, R&M, Payroll, Utilities, Management, Other. Columns: %EGR, $/SF NRA, $/Unit, Total. **Total: $84,635 (43.1%)** | expense-taxes, expense-insurance, expense-repairs, expense-payroll, expense-utilities, expense-management, expense-other |
| `image30.png` | DIRECT CAPITALIZATION | Complete income approach. Unit mix (4×1BR, 12×2BR), Contract/Market rents, PGR: $204,240, Vacancy: 3.8%, EGR: $196,406, Expenses: $84,635, **NOI: $111,771, Cap Rate: 6.25%, Value: $1,800,000** | income-pgr, income-vacancy, income-egr, income-noi, income-cap-rate, income-value |
| `image40.png` | 1 BED UNITS | Rental analysis: 15 comp rows + HIGH/AVG/MED/LOW summaries. **Conclusion: 550 SF, $895/unit, $1.63/SF → $900** | rent-1br-conclusion, rent-1br-sf, rent-1br-psf |
| `image41.png` | 2 BED UNITS | Rental analysis: 15 comp rows + summaries. **Conclusion: 667 SF, $1,055/unit, $1.58/SF → $1,060** | rent-2br-conclusion, rent-2br-sf, rent-2br-psf |

### Sales Approach Tables

| Image | Table Name | Key Data | Fields Needed |
|-------|------------|----------|---------------|
| `image60.png` | DIRECT COMPARISON APPROACH TABLE | **Complete Sales Grid** - Subject + 5 comps. Sections: Sale Info (Price, $/Unit, Rights, Financing, Conditions), Income Info (NOI/Unit, Occupancy, Cap Rate), Physical Info (Units, NRA, Year, Location, Quality, Condition, Amenities). **Adjusted $/Unit range: $111,914 - $118,100** | comp1-5 sale info, income info, physical info, adjustments |
| `image51.png` | DIRECT COMPARISON APPROACH CONCLUSION (UNIT) | 5 comps with Transaction Price, Transactional Adj, Property Adj, Final, Net Adj %. **Subject: 16 units × $112,500/unit = $1,800,000** | sales-value-per-unit, sales-indicated-value |

### Reconciliation Tables

| Image | Table Name | Key Data | Fields Needed |
|-------|------------|----------|---------------|
| `image46.png` | RECONCILIATION OF VALUES | Valuation Scenarios: AS STABILIZED. Interest: Fee Simple. Date: Oct 17, 2025. **Sales: $1,800,000 ($176/SF), Income: $1,800,000 ($176/SF), Final: $1,800,000** | reconciliation-sales, reconciliation-income, final-value |
| `image75.png` | VALUE CONCLUSION | Interest: Fee Simple. Exposure: 6 months. Effective Date: Oct 17, 2025. **Cost: Not Presented, Sales: $1,800,000, Income: $1,800,000, Final: $1,800,000** | value-conclusion-final |

### Property Summary Tables

| Image | Table Name | Key Data | Fields Needed |
|-------|------------|----------|---------------|
| `image73.png` | PROPERTY IDENTIFICATION + SITE + IMPROVEMENT + QUALITATIVE | **Property ID:** North Battleford Apartments, Multi-Family Walkup, 1101/1121 109 St. **Site:** 24,400 SF (0.56 acres), R2 zoning. **Improvements:** 16 units, 10,204 NRA, 1970 built, 55 actual/35 effective age. **Quality:** All Average ratings. | property-name, property-type, site-area, zoning, units, nra, year-built, effective-age |

### Rental Survey Table

| Image | Table Name | Key Data | Fields Needed |
|-------|------------|----------|---------------|
| `image38.png` | SURVEY COMPARISON TABLE | Subject + 5 rental comparables. Sections: Property Info (Name, Address, City), Rent Survey (Type, Rent/Unit, Rent/SF, Amenities, Utilities, Parking, Laundry), Building Info (Units, SF, Location, Quality, Condition, Appeal, Amenities, Security). | rental-comp1-5 full details |

---

## MAPS (Location Reference)

| Image | Description | Contains Data Table? |
|-------|-------------|---------------------|
| `image7.png` | Zoning map (R2, R3, C2, CS zones around subject) | No |
| `image15.png` | Neighborhood map (Subject near Battlefords Union Hospital) | No |
| `image16.png` | Regional location map with subject marker | No |
| `image17.png` | Regional map (North Battleford area, wider view) | No |
| `image32.png` | Sales Comparables Map | **Yes** - Table with 5 comps: addresses, distances |
| `image39.png` | Rental Comparables Map | **Yes** - Table with 5 comps: addresses, distances |

---

## PHOTOS (No Data Extraction Needed)

### Property Photos (JPG format)
- `image13.jpg`, `image14.jpg` - Subject property exterior
- `image24.jpg`, `image33.jpg` - Subject property views
- `image54.jpg` - Subject property
- `image62.jpg` - `image72.jpg` - Property/comparable photos
- `image77.jpg` - `image89.jpg` - Property/comparable photos

### Comparable Photos (PNG format)
- `image56.png` - Sale comparable (building with "1000" address)
- `image58.png` - Sale comparable (building with "For Rent" sign)

### Other Images
- `image49.png` - Appraiser bio (Chris Chornohos, AACI, MRICS)

---

## Field Coverage Summary

### Required Fields from Image-Tables

**Income Section (from image25, image30):**
- 7 expense fields with %EGR, $/SF, $/Unit, Total
- Unit mix (1BR count, 2BR count)
- Contract vs Market rents
- PGR, Vacancy %, EGR, NOI, Cap Rate, Indicated Value

**Sales Section (from image51, image60):**
- 5 sale comparables with full details:
  - Transaction info (price, $/unit, date, status)
  - Income info (NOI/unit, occupancy, cap rate)
  - Physical info (units, NRA, year, location, quality, condition, amenities)
  - Adjustments (transactional, property, net %)
- Subject $/unit conclusion

**Rental Survey (from image38, image40, image41):**
- 5 rental comparables with full details
- 1BR and 2BR unit analysis with conclusions

**Property Summary (from image73):**
- Property identification fields
- Site description fields
- Improvement description fields
- Qualitative analysis ratings

**Reconciliation (from image46, image75):**
- All approach values
- Final value conclusion

---

## Action Items

1. [ ] Compare this catalog against Report Builder store fields
2. [ ] Identify missing fields that need to be added
3. [ ] Verify test data values match these image-tables
4. [ ] Update renderers to display all required sections

---

## Notes

- Valcre workbook exports tables as screenshots, not live data
- Gap analysis agents only saw extractable text, missing all image-table content
- This explains content gaps identified in previous sessions
- Image-table data should be considered authoritative for field values
