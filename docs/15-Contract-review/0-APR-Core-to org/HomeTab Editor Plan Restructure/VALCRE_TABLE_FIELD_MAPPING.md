# Valcre Table Field Mapping - DEFINITIVE REFERENCE
## VAL251012 Workbook Named Ranges → Report Table Cells

**Purpose**: Map Valcre Excel named ranges to specific table cells for HTML template data binding  
**Source**: VAL251012_-_North_Battleford_Apt.xlsm (7,988 named ranges)  
**Date**: December 22, 2025

---

## Priority Tables Mapping

---

## 1. Direct Capitalization Table (Page 50)
**Source Worksheet**: DIRECTCAP  
**Report Section**: Income Approach - Direct Capitalization Conclusion  
**Total Named Ranges**: 150

### Unit Mix Section
| Row Label | Type (Col C) | Units (Col D) | Category (Col E) | Contract (Col F) | Market (Col G) | Cont v Mkt (Col H) | $/Unit (Col I) | $/SF(Yr) (Col J) | $/SF(Mo) (Col K) | $/Year (Col L) |
|-----------|--------------|---------------|------------------|------------------|----------------|-------------------|----------------|------------------|------------------|----------------|
| Header | `IA_DirCap_UnitMix` (range) | - | - | - | - | - | - | - | - | - |
| Unit Type 1 | Row 19, Col C | Row 19, Col D | Row 19, Col E | Row 19, Col F | Row 19, Col G | Row 19, Col H | Row 19, Col I | Row 19, Col J | Row 19, Col K | Row 19, Col L |
| Unit Type 2 | Row 20, Col C | Row 20, Col D | Row 20, Col E | Row 20, Col F | Row 20, Col G | Row 20, Col H | Row 20, Col I | Row 20, Col J | Row 20, Col K | Row 20, Col L |

### Revenue Section
| Row Label | Named Range | Cell Reference | Description |
|-----------|-------------|----------------|-------------|
| Total Rental Revenue | - | Row 189 | Rental subtotal |
| Rent Total | `IA_DirCap_Rent` | DIRECTCAP!$L$189 | Total rental income |
| Rent $/Unit | `IA_DirCap_RentPerUnit` | DIRECTCAP!$I$189 | Rent per unit |
| Rent $/SF(Yr) | `IA_DirCap_RentPSFYr` | DIRECTCAP!$J$189 | Rent per SF annual |
| Rent $/SF(Mo) | `IA_DirCap_RentPSFMo` | DIRECTCAP!$K$189 | Rent per SF monthly |
| Reimbursement Total | `IA_DirCap_Rmb` | DIRECTCAP!$L$203 | Reimbursement income |
| Rmb $/Unit | `IA_DirCap_RmbPerUnit` | DIRECTCAP!$I$203 | Reimbursement per unit |
| Rmb $/SF(Yr) | `IA_DirCap_RmbPSFYr` | DIRECTCAP!$J$203 | Reimbursement per SF annual |
| Rmb $/SF(Mo) | `IA_DirCap_RmbPSFMo` | DIRECTCAP!$K$203 | Reimbursement per SF monthly |
| Misc Income Total | `IA_DirCap_Misc` | DIRECTCAP!$L$217 | Miscellaneous income |
| Misc $/Unit | `IA_DirCap_MiscPerUnit` | DIRECTCAP!$I$217 | Misc per unit |
| Misc $/SF(Yr) | `IA_DirCap_MiscPSFYr` | DIRECTCAP!$J$217 | Misc per SF annual |
| Misc $/SF(Mo) | `IA_DirCap_MiscPSFMo` | DIRECTCAP!$K$217 | Misc per SF monthly |

### PGI / Vacancy / EGI Section
| Row Label | Named Range | Cell Reference | Description |
|-----------|-------------|----------------|-------------|
| **POTENTIAL GROSS REVENUE** | `IA_DirCap_PGI` | DIRECTCAP!$L$218 | Total PGI |
| PGI $/Unit | `IA_DirCap_PGIUnit` | DIRECTCAP!$I$218 | PGI per unit |
| PGI $/SF | `IA_DirCap_PGIPSF` | DIRECTCAP!$J$218 | PGI per SF |
| Vacancy % | `IA_DirCap_VacLoss` | DIRECTCAP!$G$220 | Vacancy percentage |
| Vacancy Total | `IA_DirCap_VacancyTotal` | DIRECTCAP!$L$220 | Vacancy dollar loss |
| Concession % | `IA_DirCap_ConcLoss` | DIRECTCAP!$G$221 | Concession percentage |
| Concession Total | `IA_DirCap_ConcessionTotal` | DIRECTCAP!$L$221 | Concession dollar loss |
| Bad Debt % | `IA_DirCap_ColLoss` | DIRECTCAP!$G$222 | Collection loss percentage |
| Bad Debt Total | `IA_DirCap_CreditLossTotal` | DIRECTCAP!$L$222 | Collection loss dollars |
| Loss to Lease % | `IA_DirCap_Loss2Lease` | DIRECTCAP!$G$223 | Loss to lease percentage |
| Other Loss Total | `IA_DirCap_OtherLossTotal` | DIRECTCAP!$L$223 | Other loss dollars |
| Total Loss % | `IA_DirCap_Loss` | DIRECTCAP!$G$224 | Total vacancy/loss percentage |
| Total Loss $ | `IA_DirCap_LossTotal` | DIRECTCAP!$L$224 | Total vacancy/loss dollars |
| **EFFECTIVE GROSS REVENUE** | `IA_DirCap_EGI` | DIRECTCAP!$L$225 | Total EGI |
| EGI $/Unit | `IA_DirCap_EGIUnit` | DIRECTCAP!$I$225 | EGI per unit |
| EGI $/SF | `IA_DirCap_EGIPSF` | DIRECTCAP!$J$225 | EGI per SF |

### Operating Expenses Section
| Row Label | Named Range | Cell Reference | Description |
|-----------|-------------|----------------|-------------|
| Expense Line 01 | `IA_DirCap_Expense01` | DIRECTCAP!$C$227 | Taxes |
| Expense Line 02 | `IA_DirCap_Expense02` | DIRECTCAP!$C$228 | Insurance |
| Expense Line 03 | `IA_DirCap_Expense03` | DIRECTCAP!$C$229 | CAM |
| Expense Line 04 | `IA_DirCap_Expense04` | DIRECTCAP!$C$230 | Repairs & Maintenance |
| Expense Line 05 | `IA_DirCap_Expense05` | DIRECTCAP!$C$231 | Cleaning |
| Expense Line 06 | `IA_DirCap_Expense06` | DIRECTCAP!$C$232 | Roads & Grounds |
| Expense Line 07 | `IA_DirCap_Expense07` | DIRECTCAP!$C$233 | Advertising |
| Expense Line 08 | `IA_DirCap_Expense08` | DIRECTCAP!$C$234 | Payroll |
| Expense Line 09 | `IA_DirCap_Expense09` | DIRECTCAP!$C$235 | Security |
| Expense Line 10 | `IA_DirCap_Expense10` | DIRECTCAP!$C$236 | Utilities |
| Expense Line 11 | `IA_DirCap_Expense11` | DIRECTCAP!$C$237 | Electricity |
| Expense Line 12 | `IA_DirCap_Expense12` | DIRECTCAP!$C$238 | Gas |
| Expense Line 13 | `IA_DirCap_Expense13` | DIRECTCAP!$C$239 | Water & Sewer |
| Expense Line 14 | `IA_DirCap_Expense14` | DIRECTCAP!$C$240 | Other Utilities |
| Expense Line 15 | `IA_DirCap_Expense15` | DIRECTCAP!$C$241 | Management Fees |
| Expense Line 16 | `IA_DirCap_Expense16` | DIRECTCAP!$C$242 | Administrative Fees |
| Expense Line 17 | `IA_DirCap_Expense17` | DIRECTCAP!$C$243 | Professional Fees |
| Expense Line 18 | `IA_DirCap_Expense18` | DIRECTCAP!$C$244 | Non-Reimbursable |
| Expense Line 19 | `IA_DirCap_Expense19` | DIRECTCAP!$C$245 | Ground Rent |
| Expense Line 20 | `IA_DirCap_Expense20` | DIRECTCAP!$C$246 | Other Expenses |
| Expense Line 21 | `IA_DirCap_Expense21` | DIRECTCAP!$C$247 | Reserves |
| Expense Ratio | `IA_DirCap_ExpenseRatio` | DIRECTCAP!$H$252 | Expense ratio % |
| **TOTAL OPERATING EXPENSES** | `IA_DirCap_Expenses` | DIRECTCAP!$L$252 | Total expenses |

### NOI & Valuation Section
| Row Label | Named Range | Cell Reference | Description |
|-----------|-------------|----------------|-------------|
| **NET OPERATING INCOME** | `IA_DirCap_NOI` | DIRECTCAP!$L$253 | NOI total |
| NOI $/Unit | `IA_DirCap_NOIUnit` | DIRECTCAP!$I$253 | NOI per unit |
| NOI $/SF | `IA_DirCap_NOIPSF` | DIRECTCAP!$J$253 | NOI per SF |
| Capitalization Rate 1 | `IA_DirCap_CapRate1` | DIRECTCAP!$L$254 | Primary cap rate |
| Capitalization Rate 2 | `IA_DirCap_CapRate2` | DIRECTCAP!$L$255 | Secondary cap rate |
| Cap Rate Blend | `IA_DirCap_Blend` | DIRECTCAP!$P$254 | Blended cap rate |
| Capitalized Value | - | DIRECTCAP!$L$256 | Raw capitalized value |
| **INDICATED VALUE (Scenario 1)** | `IA_DirCap_Value1` | DIRECTCAP!$L$257 | Rounded value |
| Value $/Unit | `IA_DirCap_ValuePerUnit1.6` | DIRECTCAP!$I$257 | Value per unit |
| Value $/SF | `IA_DirCap_ValuePerUnit1.5` | DIRECTCAP!$J$257 | Value per SF |
| Scenario Value 1 | `IA_DirCap_ScenarioValue1` | DIRECTCAP!$P$257 | Scenario 1 |
| Adjustment 1 | `IA_DirCap_Adjustment1` | DIRECTCAP!$L$258 | Capital expenditures |
| **INDICATED VALUE (Scenario 2)** | `IA_DirCap_Value2` | DIRECTCAP!$L$261 | Value after adj 1 |
| Adjustment 2 | `IA_DirCap_Adjustment2` | DIRECTCAP!$L$262 | Additional adjustment |
| **INDICATED VALUE (Scenario 3)** | `IA_DirCap_Value3` | DIRECTCAP!$L$265 | Value after adj 2 |
| Adjustment 3 | `IA_DirCap_Adjustment3` | DIRECTCAP!$L$266 | Additional adjustment |
| **INDICATED VALUE (Scenario 4)** | `IA_DirCap_Value4` | DIRECTCAP!$L$269 | Final value |

---

## 2. Direct Comparison Adjustment Grid (Page 59)
**Source Worksheet**: SALE1  
**Report Section**: Direct Comparison Approach - Adjustment Table  
**Total Named Ranges**: 312

### Column Structure
| Column | Content | Subject | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|--------|---------|---------|--------|--------|--------|--------|--------|
| Letter | - | D | E | G | I | K | M |
| Comp ID | Named Range | - | `SA1_1_ID` | `SA1_2_ID` | `SA1_3_ID` | `SA1_4_ID` | `SA1_5_ID` |

### Property Identification
| Row | Field | Subject | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|-----|-------|---------|--------|--------|--------|--------|--------|
| 25 | Name | `Subject_Name` | E25 | G25 | I25 | K25 | M25 |
| 26 | Address | `Subject_Street` | `SA1_1_Address` | `SA1_2_Address` | `SA1_3_Address` | `SA1_4_Address` | `SA1_5_Address` |
| 27 | City | `Subject_City` | `SA1_1_City` | `SA1_2_City` | `SA1_3_City` | `SA1_4_City` | `SA1_5_City` |
| 28 | Province | `Subject_State` | `SA1_1_State` | `SA1_2_State` | `SA1_3_State` | `SA1_4_State` | `SA1_5_State` |
| 29 | Postal Code | `Subject_Zip` | `SA1_1_Zip` | `SA1_2_Zip` | `SA1_3_Zip` | `SA1_4_Zip` | `SA1_5_Zip` |

### Sale Information (Row 42+)
| Row | Field | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|-----|-------|--------|--------|--------|--------|--------|
| 45 | Transaction Price | E45 | G45 | I45 | K45 | M45 |
| 46 | Price $/Unit | `SA1_1_PricePerUOM` | `SA1_2_PricePerUOM` | `SA1_3_PricePerUOM` | `SA1_4_PricePerUOM` | `SA1_5_PricePerUOM` |
| 47 | Property Rights | E47 | G47 | I47 | K47 | M47 |
| 48 | Financing | E48 | G48 | I48 | K48 | M48 |
| 49 | Sale Conditions | E49 | G49 | I49 | K49 | M49 |
| 50 | Expenditures After Sale | E50 | G50 | I50 | K50 | M50 |

### Income Information (Row 59+)
| Row | Field | Subject | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|-----|-------|---------|--------|--------|--------|--------|--------|
| 60 | Occupancy | D60 | E60 | G60 | I60 | K60 | M60 |
| 61 | Capitalization Rate | - | E61 | G61 | I61 | K61 | M61 |

### Physical Information (Row 68+)
| Row | Field | Subject | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|-----|-------|---------|--------|--------|--------|--------|--------|
| 69 | Units | D69 | E69 | G69 | I69 | K69 | M69 |
| 71 | GBA (SF) | `SA1_1_GBA` | E71 | G71 | I71 | K71 | M71 |
| 72 | NRA (SF) | `SA1_1_NRA` | E72 | G72 | I72 | K72 | M72 |
| 73 | Year Built | D73 | E73 | G73 | I73 | K73 | M73 |
| 74 | Location | D74 | E74 (val) F74 (adj) | G74 H74 | I74 J74 | K74 L74 | M74 N74 |
| 75 | Access | D75 | E75 F75 | G75 H75 | I75 J75 | K75 L75 | M75 N75 |
| 76 | Exposure | D76 | E76 F76 | G76 H76 | I76 J76 | K76 L76 | M76 N76 |
| 77 | Quality | D77 | E77 F77 | G77 H77 | I77 J77 | K77 L77 | M77 N77 |
| 78 | Condition | D78 | E78 F78 | G78 H78 | I78 J78 | K78 L78 | M78 N78 |
| 79 | Appeal | D79 | E79 F79 | G79 H79 | I79 J79 | K79 L79 | M79 N79 |
| 81 | Parking Type | D81 | E81 | G81 | I81 | K81 | M81 |
| 84 | Proj. Amenities | D84 | E84 | G84 | I84 | K84 | M84 |
| 85 | Unit Amenities | D85 | E85 | G85 | I85 | K85 | M85 |

### Adjustment Totals
| Row | Field | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|-----|-------|--------|--------|--------|--------|--------|
| 99 | Total Physical Adj | E99 | G99 | I99 | K99 | M99 |
| 100 | Adjusted $/Unit | E100 | G100 | I100 | K100 | M100 |
| 101 | Overall Comparison | E101 | G101 | I101 | K101 | M101 |

### Additional Comp Ranges (per comp pattern)
For each comp N (1-10), these named ranges exist:
- `SA1_N_ID` - Comp identifier
- `SA1_N_Address` - Street address
- `SA1_N_City` - City
- `SA1_N_State` - Province/State
- `SA1_N_Zip` - Postal code
- `SA1_N_GBA` - Gross building area
- `SA1_N_NRA` - Net rentable area
- `SA1_N_PricePerUOM` - Price per unit of measure
- `SA1_N_Photo` - Photo range
- `SA1_N_PhotoURL` - Photo URL
- `SA1_N_CommentProp` - Property comments
- `SA1_N_CommentSale` - Sale comments
- `SA1_N_Geocode` - Geocode
- `SA1_N_MapComp` - Map component

---

## 3. Rent Roll Table (Page 39)
**Source Worksheet**: RENTROLL  
**Report Section**: Income Approach - Rent Roll  
**Total Named Ranges**: 134

### Main Rent Roll Area
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `IA_RentRoll` | RENTROLL!$C$101:$R$247 | Full rent roll table |
| `IA_LeaseAbstract` | RENTROLL!$C$14:$R$71 | Lease abstract section |
| `IA_RR_STAREA` | RENTROLL!$B$7:$S$72 | Single-tenant area |
| `IA_RR_MTAREA` | RENTROLL!$B$73:$BQ$309 | Multi-tenant area |

### Summary Metrics
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `IA_RR_NRA` | RENTROLL!$E$247 | Total NRA |
| `IA_RR_BaseRent` | RENTROLL!$R$247 | Total base rent |
| `IA_RR_Occupancy` | RENTROLL!$F$205 | Occupancy rate |
| `IA_RR_OccupiedSF` | RENTROLL!$E$205 | Occupied SF |
| `IA_RR_VacantSF` | RENTROLL!$E$246 | Vacant SF |
| `IA_RR_Vacancy` | RENTROLL!$F$246 | Vacancy rate |
| `IA_RR_OccRevenue` | RENTROLL!$R$205 | Occupied revenue |
| `IA_RR_VacantRevenue` | RENTROLL!$R$246 | Vacant revenue |
| `IA_RR_WALE` | RENTROLL!$CF$205 | Weighted avg lease expiry |

### Tenant Statistics
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `IA_RR_SpacesTotal` | RENTROLL!$AG$274 | Total spaces |
| `IA_RR_SpacesOccupied` | RENTROLL!$AE$274 | Occupied spaces |
| `IA_RR_SpacesVacant` | RENTROLL!$AF$274 | Vacant spaces |
| `IA_RR_TenantLargest` | RENTROLL!$F$252 | Largest tenant |
| `IA_RR_TenantSFHigh` | RENTROLL!$E$252 | Largest tenant SF |
| `IA_RR_TenantSFLow` | RENTROLL!$E$251 | Smallest tenant SF |
| `IA_RR_TenantSFAverage` | RENTROLL!$E$253 | Average tenant SF |

### Subject Property Lease Info
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `Subject_Tenant` | RENTROLL!$E$15 | Tenant name |
| `Subject_SFLeased` | RENTROLL!$E$16 | SF leased |
| `Subject_LeaseStartDate` | RENTROLL!$E$18 | Lease start |
| `Subject_LeaseTerm` | RENTROLL!$E$19 | Lease term |
| `Subject_RentMonthly` | RENTROLL!$E$20 | Monthly rent |
| `Subject_RentAnnual` | RENTROLL!$Q$20 | Annual rent |
| `Subject_RentPSF` | RENTROLL!$Q$25 | Rent per SF |
| `Subject_ExpenseStructure` | RENTROLL!$Q$16 | Expense structure |
| `Subject_LeaseStatus` | RENTROLL!$Q$17 | Lease status |
| `Subject_LeaseEndDate` | RENTROLL!$Q$18 | Lease end |
| `Subject_LeaseOptions` | RENTROLL!$Q$19 | Lease options |

---

## 4. Survey Comparison Table (Page 40)
**Source Worksheet**: SURVEY1  
**Report Section**: Income Approach - Rent Survey  
**Total Named Ranges**: 246

### Column Structure for Rent Comps
| Field | Subject | Comp 1 | Comp 2 | Comp 3 | Comp 4 | Comp 5 |
|-------|---------|--------|--------|--------|--------|--------|
| Column | C/D | E | G | I | K | M |
| ID | - | `SU1_1_ID` | `SU1_2_ID` | `SU1_3_ID` | `SU1_4_ID` | `SU1_5_ID` |
| Address | - | `SU1_1_Address` | `SU1_2_Address` | `SU1_3_Address` | `SU1_4_Address` | `SU1_5_Address` |
| City | - | `SU1_1_City` | `SU1_2_City` | `SU1_3_City` | `SU1_4_City` | `SU1_5_City` |
| State | - | `SU1_1_State` | `SU1_2_State` | `SU1_3_State` | `SU1_4_State` | `SU1_5_State` |
| Zip | - | `SU1_1_Zip` | `SU1_2_Zip` | `SU1_3_Zip` | `SU1_4_Zip` | `SU1_5_Zip` |
| Utilities | - | `SU1_1_Utilities` | `SU1_2_Utilities` | `SU1_3_Utilities` | `SU1_4_Utilities` | `SU1_5_Utilities` |
| Total Adj | - | `SU1_1_TotalAdj` | `SU1_2_TotalAdj` | `SU1_3_TotalAdj` | `SU1_4_TotalAdj` | `SU1_5_TotalAdj` |
| Photo | - | `SU1_1_Photo` | `SU1_2_Photo` | `SU1_3_Photo` | `SU1_4_Photo` | `SU1_5_Photo` |
| Photo URL | - | `SU1_1_PhotoURL` | `SU1_2_PhotoURL` | `SU1_3_PhotoURL` | `SU1_4_PhotoURL` | `SU1_5_PhotoURL` |
| Comments | - | `SU1_1_CommentProp` | `SU1_2_CommentProp` | `SU1_3_CommentProp` | `SU1_4_CommentProp` | `SU1_5_CommentProp` |

### Map Ranges
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `Map_Survey1` | SURVEY1!$AT$1577:$BB$1625 | Survey map |
| `Map_Survey1URL` | SURVEY1!$BC$1564 | Map URL |
| `Map_Survey1HereURL` | SURVEY1!$AS$1564 | HERE map URL |

---

## 5. Property Overview Tables (Page 5)
**Source Worksheet**: EXEC  
**Report Section**: Executive Summary - Property Overview

### Property Identification Table
| Row | Field Label | Value Cell | Named Range |
|-----|-------------|------------|-------------|
| 21 | Name | EXEC!E21 | `Subject_Name` → HOME!$H$192 |
| 22 | Property Type | EXEC!E22 | `Subject_Primary` → HOME!$H$41 |
| 23 | Address | EXEC!E23 | `Subject_Street` → HOME!$H$351 |
| 24 | City, Province, Postal | EXEC!E24 | Composite |
| 25 | County | EXEC!E25 | `Subject_County` → HOME!$H$360 |
| 26 | MSA | EXEC!E26 | `Subject_MSA` → HOME!$H$361 |
| 27 | Market / Submarket | EXEC!E27 | `Subject_Market` / `Subject_Submarket` |
| 28 | Geocode | EXEC!E28 | `Subject_Geocode` → HOME!$H$357 |
| 29 | Census Tract | EXEC!E29 | `Subject_Census` → HOME!$H$362 |
| 30 | Legal Description | EXEC!E30 | See SITE worksheet |

**Key EXEC Ranges:**
- `Exec_PropIdentity` = EXEC!$C$21:$F$30 (Property Identification area)
- `Exec_General` = EXEC!$C$20:$F$30 (General section)

### Site Description Table  
| Row | Field Label | Value (SF) | Value (Acres) | Named Range |
|-----|-------------|------------|---------------|-------------|
| 33 | Number of Parcels | EXEC!E33 | - | From SITE sheet |
| 34 | Legal Description | EXEC!E34 | - | From SITE sheet |
| 36 | Usable Area | EXEC!E36 | EXEC!F36 | `Site_LandAreaUsable` |
| 37 | Excess Area | EXEC!E37 | EXEC!F37 | `Site_LandAreaExcess` |
| 38 | Surplus Area | EXEC!E38 | EXEC!F38 | `Site_LandAreaSurplus` |
| 40 | Total Area | EXEC!E40 | EXEC!F40 | `Site_LandAreaTotal` |
| 41 | Zoning | EXEC!E41 | - | `Site_Zoning` |
| 42 | Shape | EXEC!E42 | - | `Site_Shape` |
| 43 | Topography | EXEC!E43 | - | `Site_Topography` |

**Key EXEC Ranges:**
- `Exec_Site` = EXEC!$C$32:$F$45 (Site section)
- `Exec_SiteDesc` = EXEC!$C$33:$F$45 (Site description)

### Improvement Description Table
| Row | Field Label | Value Cell | Named Range |
|-----|-------------|------------|-------------|
| 48 | Tenancy | EXEC!E48 | `Exec_Tenancy` → EXEC!$C$48 |
| 49 | Net Rentable Area | EXEC!E49 | `Subject_NRA` → IMPV |
| 50 | Gross Building Area | EXEC!E50 | `Subject_GBA` → IMPV |
| 52 | Units | EXEC!E52 | `Subject_Units` → IMPV |
| 53 | Density | EXEC!E53 | Calculated |
| 54 | Total Buildings | EXEC!E54 | `Subject_Buildings` |
| 55 | Floors | EXEC!E55 | `Subject_Floors` |
| 56 | Year Built | EXEC!E56 | `Subject_YearBuilt` |
| 57 | Actual Age | EXEC!E57 | Calculated |
| 58 | Effective Age | EXEC!E58 | `Subject_EffectiveAge` |
| 59 | Economic Life | EXEC!E59 | `Subject_EconomicLife` |
| 60 | Remaining Life | EXEC!E60 | Calculated |
| 63 | Land to Building Ratio | EXEC!E63 | Calculated |
| 64 | Site Coverage Ratio | EXEC!E64 | Calculated |
| 65 | Parking | EXEC!E65 | `Subject_Parking` |
| 81 | Project Amenities | EXEC!E81 | `Subject_ProjectAmenities` |
| 82 | Laundry | EXEC!E82 | `Subject_Laundry` |
| 83 | Security Features | EXEC!E83 | `Subject_Security` |

**Key EXEC Ranges:**
- `Exec_Impv` = EXEC!$C$47:$F$83 (Improvements section)
- `Exec_ImpvDesc` = EXEC!$C$48:$F$83 (Improvement description)

---

## 6. Investment Indicators Table (Page 6)
**Source Worksheet**: EXEC  
**Report Section**: Executive Summary - Investment Indicators

| Row | Field Label | Value Cell | Named Range |
|-----|-------------|------------|-------------|
| 108 | Current Occupancy | EXEC!E108 | `Subject_Occupancy` |
| 109 | Stabilized Occupancy | EXEC!E109 | `Subject_OccupancyStabilized` |
| 111 | SF Multifamily | EXEC!E111 | Related to NRA |
| 112 | Occupied MF Units | EXEC!E112 | From UNITMIX |
| 113 | Current/Concluded Rent | EXEC!E113/F113 | From DIRECTCAP |
| 119 | Expense Ratio | EXEC!E119 | `IA_ExpenseRatio` → EXEC!$E$119 |
| 120 | Direct Cap NOI | EXEC!E120 | `IA_DirCap_NOI` |
| 121 | Cap Rate Conclusion | EXEC!E121 | From DIRECTCAP |

**Key EXEC Ranges:**
- `Exec_InvestmentIndicators` = EXEC!$C$107:$F$135
- `Exec_Investment` = Multiple cells for investment metrics

---

## 7. Value Conclusion Table (Page 6 & Page 62)
**Source Worksheet**: VALUES  
**Report Section**: Executive Summary & Reconciliation

### Reconciliation of Values Table
| Row | Field | Scenario 1 | Scenario 2 | Scenario 3 | Named Range |
|-----|-------|------------|------------|------------|-------------|
| 8 | Valuation Scenarios | F8 | G8 | H8 | - |
| 9 | Interest | F9 | G9 | H9 | - |
| 10 | Date | F10 | G10 | H10 | - |
| 19 | Direct Comparison Value | F19 | G19 | H19 | - |
| 20 | Direct Comparison $/SF | F20 | G20 | H20 | - |
| 27 | Sales Comparison Conc | F27 | G27 | H27 | `Value_SARecScenario1` |
| 31 | Direct Cap NOI | F31 | G31 | H31 | - |
| 33 | Cap Rate | F33 | G33 | H33 | - |
| 34 | Direct Cap Value | F34 | G34 | H34 | - |
| 44 | Income Approach Conc | F44 | G44 | H44 | `Value_IARecScenario1` |
| 74 | **FINAL VALUE** | F74 | G74 | H74 | `Value_Scenario1`, `Value_Scenario2`, `Value_Scenario3` |
| 75 | Value $/SF NRA | F75 | G75 | H75 | `Value_Scenario1PerUofM` |
| 78 | Value in Words | F78 | G78 | H78 | `Value_Scenario1Text` |

**Key VALUES Ranges:**
- `Report_Reconciliation` = VALUES!$C$7:$H$76 (Full reconciliation)
- `Report_ValueConclusion` = VALUES!$C$80:$H$104 (Value conclusion section)
- `Report_FMV` = VALUES!$K$131:$O$138 (Fair Market Value)
- `ASC_ApproachConclusions` = VALUES!$C$80:$F$88 (Approach conclusions)

---

## 8. Unit Mix Table (Page 30)
**Source Worksheet**: UNITMIX  
**Report Section**: Description of Improvements - Unit Mix

### Unit Mix Table Structure
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `IA_UM_UnitMix` | UNITMIX!$T$16:$Z$57 | Main unit mix table |
| `IA_UM_RentRoll` | UNITMIX!$AD$16:$AU$45 | Rent roll data |
| `IA_UM_CvM` | UNITMIX!$AY$16:$BK$45 | Contract vs Market |
| `IA_UM_ContvMkt` | UNITMIX!$BK$44 | Contract vs Market total |
| `IA_UM_Units` | UNITMIX!$AH$44 | Total units |
| `IA_UM_OccupiedUnits` | UNITMIX!$AF$44 | Occupied units |
| `IA_UM_VacantUnits` | UNITMIX!$AG$44 | Vacant units |

### Unit Type Groups
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `IA_UM_Group1` | UNITMIX!$F$6 | Group 1 name (e.g., "1 Bed") |
| `IA_UM_Group2` | UNITMIX!$F$7 | Group 2 name (e.g., "2 Bed") |
| `IA_UM_Group3` | UNITMIX!$F$8 | Group 3 name |
| `IA_UM_Group4` | UNITMIX!$F$9 | Group 4 name |
| `IA_UM_Group5` | UNITMIX!$F$10 | Group 5 name |
| `IA_UM_GroupNum` | UNITMIX!$F$5 | Number of groups |

### Average Rent by Unit Type (rows 19-43)
| Named Range | Row | Description |
|-------------|-----|-------------|
| `IA_UM_AvgRent01` | UNITMIX!$N$19 | Avg rent type 1 |
| `IA_UM_AvgRent02` | UNITMIX!$N$20 | Avg rent type 2 |
| ... | ... | ... |
| `IA_UM_AvgRent25` | UNITMIX!$N$43 | Avg rent type 25 |

### Area Calculations
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `IA_UM_NRASF1` | UNITMIX!$Z$45 | NRA SF config 1 |
| `IA_UM_NRASF2` | UNITMIX!$Z$46 | NRA SF config 2 |
| `IA_UM_GBASF1` | UNITMIX!$Z$51 | GBA SF config 1 |
| `IA_UM_GBASF2` | UNITMIX!$Z$52 | GBA SF config 2 |

---

## 9. Building Description Table (Page 31)
**Source Worksheet**: IMPV  
**Report Section**: Description of Improvements - Building Details
**Total Named Ranges**: 206

### Key Building Fields
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `Subject_NRA` | IMPV sheet | Net Rentable Area |
| `Subject_GBA` | IMPV sheet | Gross Building Area |
| `Subject_Units` | IMPV sheet | Total units |
| `Subject_Buildings` | IMPV sheet | Number of buildings |
| `Subject_Floors` | IMPV sheet | Number of floors |
| `Subject_YearBuilt` | IMPV sheet | Year built |
| `Subject_EffectiveAge` | IMPV sheet | Effective age |
| `Subject_EconomicLife` | IMPV sheet | Economic life |
| `Subject_Foundation` | IMPV sheet | Foundation type |
| `Subject_ExteriorWalls` | IMPV sheet | Exterior wall type |
| `Subject_Roof` | IMPV sheet | Roof type |
| `Subject_HVAC` | IMPV sheet | HVAC system |
| `Subject_Plumbing` | IMPV sheet | Plumbing |
| `Subject_Electrical` | IMPV sheet | Electrical |
| `Subject_FireProtection` | IMPV sheet | Fire protection |
| `Subject_Parking` | IMPV sheet | Parking details |
| `Subject_ProjectAmenities` | IMPV sheet | Project amenities |
| `Subject_UnitAmenities` | IMPV sheet | Unit amenities |
| `Subject_Laundry` | IMPV sheet | Laundry facilities |
| `Subject_Security` | IMPV sheet | Security features |

---

## 10. Economic Indicators Tables (Pages 32-34)
**Source Worksheet**: Multiple (REGIONAL, LOCAL, DEMO)

### Canada Economic Indicators (Page 32)
Sourced from market data integration - typically imported/linked data

### Saskatchewan Economic Indicators (Page 33)  
Sourced from regional/provincial data feeds

### Multifamily Market Indicators (Page 34)
| Named Range Pattern | Source | Description |
|--------------------|--------|-------------|
| Market data | CDATA/REGIONAL | Market statistics |
| Vacancy rates | External data | Market vacancy |
| Rent trends | External data | Rent growth |

---

## 11. Operating Expenses Table (Page 44)
**Source Worksheet**: IE (Income & Expenses) and IA_OPEX

### Operating History Table
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| `IE_HistoricalArea` | IE sheet | Historical expense area |
| `IA_OPEX_*` | IA_OPEX sheet | Operating expense projections |

### Expense Categories
Standard expense line items from DIRECTCAP (see Direct Capitalization above):
- Taxes, Insurance, CAM, R&M, Utilities, Management, Reserves, etc.

---

## 12. Capitalization Rate Tables (Pages 47-49)
**Source Worksheet**: OAR (Overall Cap Rate)

### Cap Rate Selection
| Named Range | Cell Reference | Description |
|-------------|----------------|-------------|
| OAR sheet ranges | Multiple | Cap rate analysis |
| `IA_DirCap_CapRate1` | DIRECTCAP | Primary cap rate |
| `IA_DirCap_CapRate2` | DIRECTCAP | Secondary cap rate |
| PWC ranges | EXEC | PwC investor survey data |

### Comparable Sales Cap Rates
From SALE1 sheet:
- Each comp has capitalization rate at row 61

---

## Named Range Patterns Reference

### Prefix Conventions
| Prefix | Meaning | Example |
|--------|---------|---------|
| `Subject_` | Subject property field | `Subject_Name` |
| `IA_` | Income Approach | `IA_DirCap_NOI` |
| `SA1_` | Sales Approach Comp | `SA1_1_Address` |
| `SU1_` | Survey Comp | `SU1_1_Address` |
| `Exec_` | Executive Summary | `Exec_HBU` |
| `Report_` | Report output area | `Report_Reconciliation` |
| `Value_` | Value conclusion | `Value_Scenario1` |
| `Site_` | Site description | `Site_LandAreaTotal` |
| `Map_` | Map reference | `Map_Sale1` |
| `Nav_` | Navigation anchor | `Nav_Sale1.1` |

### Comp Numbering
- Comps numbered 1-10 (or more)
- Pattern: `SA1_N_FieldName` for sales
- Pattern: `SU1_N_FieldName` for surveys
- Pattern: `R1_N_FieldName` for rent comps

---

## File References

### JSON Exports Created
1. `valcre_named_ranges.json` - All 7,988 named ranges
2. `valcre_ranges_by_sheet.json` - Ranges categorized by worksheet

### Key Worksheets
| Sheet | Purpose | Range Count |
|-------|---------|-------------|
| HOME | Property master data | 365 |
| EXEC | Executive summary | 92 |
| DIRECTCAP | Direct capitalization | 150 |
| SALE1 | Sales comparison | 312 |
| SURVEY1 | Rent survey | 246 |
| RENTROLL | Rent roll | 134 |
| UNITMIX | Unit mix | 77 |
| IMPV | Improvements | 206 |
| SITE | Site details | 189 |
| VALUES | Value conclusions | 76 |
| OAR | Cap rate analysis | 109 |
| IE | Income/Expense | 115 |
| IA_REV | Revenue analysis | 88 |
| IA_OPEX | Operating expenses | 111 |

---

## Usage Notes

### For HTML Template Data Binding
1. Reference named ranges by exact name
2. Use cell reference as fallback
3. Handle multi-cell ranges with array/loop logic
4. Respect data types (text, number, percentage, currency)

### For Field Registry Mapping
Next step: Create kebab-case field IDs that map to these Valcre ranges
Example: `IA_DirCap_NOI` → `ia-direct-cap-noi`

---

*Document generated: December 22, 2025*
*Source workbook: VAL251012_-_North_Battleford_Apt.xlsm*
*Total named ranges: 7,988*
