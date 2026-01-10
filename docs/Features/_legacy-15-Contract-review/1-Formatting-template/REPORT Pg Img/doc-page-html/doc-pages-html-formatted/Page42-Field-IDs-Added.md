# Page 42 Field ID Mapping - Complete

## Summary
- **Page:** 42 - Unit Rent Discussion & Contract vs Market
- **Previous field-mapped spans:** 2
- **Updated field-mapped spans:** 65
- **Net new field IDs added:** 63

---

## Field IDs Added to Page 42

### Property Description Fields (11 fields)
1. `Property_Name` - Property name/identifier
2. `Subject_Street` - Subject property street address
3. `Total_Units` - Total number of units in property
4. `Property_Quality` - Quality rating of property
5. `Property_Condition` - Condition rating of property
6. `Utilities_Included` - Which utilities are included (e.g., "heat and water")
7. `Parking_Type` - Type of parking (e.g., "surface")
8. `Laundry_Location` - Location of laundry facilities (e.g., "on-site")
9. `Property_Characteristics` - Descriptive characteristics
10. `Unit_Type_Description` - Description of unit types (e.g., "1 bedroom")
11. `Company_JobNumber` - Job/file number

### Market Rent Analysis Fields (12 fields)
12. `Market_Rent_Comps_Count` - Number of comparable properties surveyed
13. `Market_Rent_Comp_Locations` - Locations of comparable properties
14. `Market_Rent_Range_Low` - Low end of market rent range ($/month)
15. `Market_Rent_Range_High` - High end of market rent range ($/month)
16. `Market_Rent_SF_Range_Low` - Low end of market rent per SF
17. `Market_Rent_SF_Range_High` - High end of market rent per SF
18. `Comps_Utilities_Included` - Utilities included in comps
19. `Comps_Interior_Quality` - Interior quality of comps
20. `Market_Rent_Unit_Type` - Unit type for concluded rent
21. `Market_Rent_Concluded_Unit` - Concluded market rent ($/month)
22. `Market_Rent_Concluded_SF` - Concluded market rent ($/SF)
23. `Market_Rent_Comparison` - Comparison to market (e.g., "slightly below market averages")

### Contract vs Market Rent Fields (24 fields)

**Overall:**
24. `Contract_vs_Market_Avg` - Average contract vs market percentage

**1 Bedroom Unit:**
25. `Contract_Market_1Bed_Type` - Unit type (e.g., "Flat 1 Bed / 1 Bath")
26. `Contract_Market_1Bed_Desc` - Unit description
27. `Contract_Market_1Bed_Units` - Number of units
28. `Contract_Market_1Bed_Asking` - Asking rent per unit
29. `Contract_Market_1Bed_Actual` - Actual rent per unit
30. `Contract_Market_1Bed_Concluded` - Concluded rent per unit
31. `Contract_Market_1Bed_Percent` - Contract vs market percentage

**2 Bedroom Unit:**
32. `Contract_Market_2Bed_Type` - Unit type
33. `Contract_Market_2Bed_Desc` - Unit description
34. `Contract_Market_2Bed_Units` - Number of units
35. `Contract_Market_2Bed_Asking` - Asking rent per unit
36. `Contract_Market_2Bed_Actual` - Actual rent per unit
37. `Contract_Market_2Bed_Concluded` - Concluded rent per unit
38. `Contract_Market_2Bed_Percent` - Contract vs market percentage

**Totals/Averages:**
39. `Contract_Market_Total_Units` - Total units
40. `Contract_Market_Avg_Asking` - Average asking rent
41. `Contract_Market_Avg_Actual` - Average actual rent
42. `Contract_Market_Avg_Concluded` - Average concluded rent
43. `Contract_Market_Avg_Percent` - Average contract vs market percentage

### Total Rental Revenue Fields (28 fields)

**Overall:**
44. `Revenue_Contract_vs_Market` - Revenue contract vs market percentage

**1 Bedroom Revenue:**
45. `Revenue_1Bed_Type` - Unit type
46. `Revenue_1Bed_Units` - Number of units
47. `Revenue_1Bed_Category` - Category (e.g., "1 Bed")
48. `Revenue_1Bed_Contract` - Contract rent
49. `Revenue_1Bed_Market` - Market rent
50. `Revenue_1Bed_ConvVMkt` - Contract vs market percentage
51. `Revenue_1Bed_PerUnit` - Rent per unit
52. `Revenue_1Bed_PerSF` - Rent per SF
53. `Revenue_1Bed_PerYear` - Annual revenue

**2 Bedroom Revenue:**
54. `Revenue_2Bed_Type` - Unit type
55. `Revenue_2Bed_Units` - Number of units
56. `Revenue_2Bed_Category` - Category (e.g., "2 Bed")
57. `Revenue_2Bed_Contract` - Contract rent
58. `Revenue_2Bed_Market` - Market rent
59. `Revenue_2Bed_ConvVMkt` - Contract vs market percentage
60. `Revenue_2Bed_PerUnit` - Rent per unit
61. `Revenue_2Bed_PerSF` - Rent per SF
62. `Revenue_2Bed_PerYear` - Annual revenue

**Revenue Subtotals:**
63. `Revenue_Subtotal_Contract` - Subtotal contract rent
64. `Revenue_Subtotal_Market` - Subtotal market rent
65. `Revenue_Subtotal_ConvVMkt` - Subtotal contract vs market percentage
66. `Revenue_Subtotal_PerUnit` - Subtotal per unit
67. `Revenue_Subtotal_PerSF` - Subtotal per SF
68. `Revenue_Subtotal_PerYear` - Subtotal annual revenue

### Other Revenue Fields (18 fields)

**Parking Income:**
69. `Other_Revenue_Parking_Name` - Revenue category name (e.g., "Parking Income")
70. `Other_Revenue_Parking_Percent` - Percentage of revenue
71. `Other_Revenue_Parking_PerSF` - Revenue per SF
72. `Other_Revenue_Parking_PerUnit` - Revenue per unit
73. `Other_Revenue_Parking_Total` - Total parking revenue
74. `Other_Revenue_Parking_Comment` - Comment/description

**Laundry Income:**
75. `Other_Revenue_Laundry_Name` - Revenue category name (e.g., "Laundry")
76. `Other_Revenue_Laundry_Percent` - Percentage of revenue
77. `Other_Revenue_Laundry_PerSF` - Revenue per SF
78. `Other_Revenue_Laundry_PerUnit` - Revenue per unit
79. `Other_Revenue_Laundry_Total` - Total laundry revenue
80. `Other_Revenue_Laundry_Comment` - Comment/description

**Total Other Revenue:**
81. `Other_Revenue_Total_PerSF` - Total other revenue per SF
82. `Other_Revenue_Total_PerUnit` - Total other revenue per unit
83. `Other_Revenue_Total_Total` - Total other revenue amount

---

## Field ID Naming Patterns

### Established Patterns Used:
- **PascalCase with Underscores**: `Contract_Market_1Bed_Type`
- **Hierarchical Structure**: `Revenue_1Bed_PerUnit`, `Revenue_2Bed_PerUnit`
- **Consistent Suffixes**:
  - `_Type`, `_Units`, `_PerSF`, `_PerUnit`, `_PerYear`
  - `_Contract`, `_Market`, `_Concluded`
  - `_Name`, `_Percent`, `_Total`, `_Comment`

### Category Prefixes:
- `Contract_Market_*` - Contract vs Market Rent table
- `Revenue_*` - Total Rental Revenue table
- `Other_Revenue_*` - Other Revenue Conclusions table
- `Market_Rent_*` - Market rent analysis narrative

---

## Integration Notes

### Similar Patterns in Other Pages:
- **Page 40**: Market rent comparables with `Market_Rent_1Bed_Comp1_*` pattern
- **Page 43-44**: Operating expenses with similar table structures
- **Pages 45-50**: Income approach calculations

### Recommended Next Steps:
1. Validate field IDs align with existing registry patterns
2. Add these 63+ fields to `fieldRegistry.ts` if not already present
3. Map to Valcre API data structure in `master-field-mapping-consolidated.json`
4. Test rendering with live data

---

**Updated:** December 16, 2025
**Status:** Page 42 field mapping COMPLETE (65 field-mapped spans)
