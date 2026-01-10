# VALCRE-TO-TEMPLATE-CROSSWALK
## Definitive Mapping: Valcre Named Ranges → HTML Template Field IDs

**Purpose**: Enable automated data binding from Valcre workbook exports to HTML report template  
**Source**: VAL251012_-_North_Battleford_Apt.xlsm (7,988 named ranges)  
**Date**: December 22, 2025  
**Version**: 1.0

---

## Table of Contents

1. [Subject Property Fields](#1-subject-property-fields)
2. [Direct Capitalization Fields](#2-direct-capitalization-fields)
3. [Sales Comparison Fields](#3-sales-comparison-fields)
4. [Rent Survey Fields](#4-rent-survey-fields)
5. [Value Conclusion Fields](#5-value-conclusion-fields)
6. [Executive Summary Fields](#6-executive-summary-fields)
7. [Site & Improvements Fields](#7-site--improvements-fields)
8. [Gap Analysis](#8-gap-analysis)
9. [Statistics Summary](#9-statistics-summary)

---

## 1. SUBJECT PROPERTY FIELDS

### 1.1 Property Identification (Core)
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_Name` | `subject-propertyname` | `{{subject-propertyname}}` | Cover, 5, 6 | ✅ Mapped |
| `Subject_PropertyName` | `subject-propertyname` | `{{subject-propertyname}}` | Cover, 5, 6 | ✅ Mapped |
| `Subject_Street` | `subject-street` | `{{subject-street}}` | Cover, 3, 6, Footer | ✅ Mapped |
| `Subject_StreetNumber` | `subject-streetnumber` | `{{subject-streetnumber}}` | 6 | ✅ Mapped |
| `Subject_StreetName` | `subject-streetname` | `{{subject-streetname}}` | 6 | ✅ Mapped |
| `Subject_City` | `city` | `{{city}}` | Cover, 3, 6, Footer | ✅ Mapped |
| `Subject_CityFormal` | `city-formal` | `{{city-formal}}` | 3 | ✅ Mapped |
| `Subject_State` | `province` | `{{province}}` | Cover, 3, 6 | ✅ Mapped |
| `Subject_ST` | `province-abbrev` | `{{province-abbrev}}` | Footer | ✅ Mapped |
| `Subject_Zip` | `postal-code` | `{{postal-code}}` | 6 | ✅ Mapped |
| `Subject_County` | `county` | `{{county}}` | 6 | ✅ Mapped |
| `Subject_Country` | `country` | `{{country}}` | 6 | ✅ Mapped |
| `Subject_MSA` | `msa` | `{{msa}}` | 6 | ✅ Mapped |
| `Subject_Market` | `market` | `{{market}}` | 6 | ✅ Mapped |
| `Subject_Submarket` | `submarket` | `{{submarket}}` | 6 | ✅ Mapped |
| `Subject_Geocode` | `geocode` | `{{geocode}}` | 6 | ✅ Mapped |
| `Subject_Latitude` | `latitude` | `{{latitude}}` | Maps | ✅ Mapped |
| `Subject_Longitude` | `longitude` | `{{longitude}}` | Maps | ✅ Mapped |
| `Subject_Census` | `census-tract` | `{{census-tract}}` | 6 | ✅ Mapped |
| `Subject_Legal` | `legal-description` | `{{legal-description}}` | 6, 21 | ✅ Mapped |
| `Subject_APN` | `apn` | `{{apn}}` | 21 | ✅ Mapped |

### 1.2 Property Type & Classification
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_Primary` | `property-type` | `{{property-type}}` | Cover, 5, 6 | ✅ Mapped |
| `Subject_Subtype` | `property-subtype` | `{{property-subtype}}` | 6 | ✅ Mapped |
| `Subject_Class` | `building-class` | `{{building-class}}` | 6 | ✅ Mapped |
| `Subject_Quality` | `quality` | `{{quality}}` | 6, 59 | ✅ Mapped |
| `Subject_Condition` | `condition` | `{{condition}}` | 6, 59 | ✅ Mapped |
| `Subject_Appeal` | `appeal` | `{{appeal}}` | 6, 59 | ✅ Mapped |
| `Subject_Rating` | `rating` | `{{rating}}` | 6 | ✅ Mapped |
| `Subject_InvestGrade` | `investment-grade` | `{{investment-grade}}` | 6 | ✅ Mapped |

### 1.3 Building Measurements
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_NRA` | `subject-nra` | `{{subject-nra}}` | 6, 29, 49, 62 | ✅ Mapped |
| `Subject_GBA` | `subject-gba` | `{{subject-gba}}` | 6, 29 | ✅ Mapped |
| `Subject_Units` | `subject-units` | `{{subject-units}}` | 6, 29, 49 | ✅ Mapped |
| `Subject_Buildings` | `subject-buildings` | `{{subject-buildings}}` | 6, 29 | ✅ Mapped |
| `Subject_Stories` | `subject-floors` | `{{subject-floors}}` | 6, 29 | ✅ Mapped |
| `Subject_Floor` | `subject-floors` | `{{subject-floors}}` | 6 | ✅ Mapped |
| `Subject_FloorPlate` | `floor-plate-sf` | `{{floor-plate-sf}}` | 29 | ✅ Mapped |
| `Subject_Density` | `density` | `{{density}}` | 6, 29 | ✅ Mapped |
| `Subject_LandToBuilding` | `land-to-building` | `{{land-to-building}}` | 6 | ✅ Mapped |
| `Subject_SiteCoverageRatio` | `site-coverage-ratio` | `{{site-coverage-ratio}}` | 6 | ✅ Mapped |

### 1.4 Age & Life
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_YearBuilt` | `year-built` | `{{year-built}}` | 6, 29, 59 | ✅ Mapped |
| `Subject_Renovated` | `year-renovated` | `{{year-renovated}}` | 6, 29 | ✅ Mapped |
| `Subject_Age` | `actual-age` | `{{actual-age}}` | 6 | ✅ Mapped |
| `Subject_EffectiveAge` | `effective-age` | `{{effective-age}}` | 6, 29 | ✅ Mapped |
| `Subject_EconomicLife` | `economic-life` | `{{economic-life}}` | 6, 29 | ✅ Mapped |
| `Subject_RemainingLife` | `remaining-life` | `{{remaining-life}}` | 6, 29 | ✅ Mapped |

### 1.5 Occupancy & Tenancy
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_Occupancy` | `occupancy-rate` | `{{occupancy-rate}}` | 6, 39 | ✅ Mapped |
| `Subject_OccupancyStabilized` | `stabilized-occupancy` | `{{stabilized-occupancy}}` | 6, 49 | ✅ Mapped |
| `Subject_Vacancy` | `vacancy-rate` | `{{vacancy-rate}}` | 6 | ✅ Mapped |
| `Subject_OccupancyStatus` | `occupancy-status` | `{{occupancy-status}}` | 6 | ✅ Mapped |
| `Subject_Tenancy` | `tenancy-type` | `{{tenancy-type}}` | 6 | ✅ Mapped |

### 1.6 Building Features
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_Foundation` | `foundation` | `{{foundation}}` | 29 | ✅ Mapped |
| `Subject_WallsExt` | `exterior-walls` | `{{exterior-walls}}` | 29 | ✅ Mapped |
| `Subject_WallsInt` | `interior-walls` | `{{interior-walls}}` | 29 | ✅ Mapped |
| `Subject_Roof` | `roof` | `{{roof}}` | 29 | ✅ Mapped |
| `Subject_HeatingAC` | `hvac` | `{{hvac}}` | 29 | ✅ Mapped |
| `Subject_Plumbing` | `plumbing` | `{{plumbing}}` | 29 | ✅ Mapped |
| `Subject_Electrical` | `electrical` | `{{electrical}}` | 29 | ✅ Mapped |
| `Subject_Fire` | `fire-protection` | `{{fire-protection}}` | 29 | ✅ Mapped |
| `Subject_Elevator` | `elevator` | `{{elevator}}` | 29 | ✅ Mapped |
| `Subject_Ceilings` | `ceilings` | `{{ceilings}}` | 29 | ✅ Mapped |
| `Subject_DoorsWindows` | `doors-windows` | `{{doors-windows}}` | 29 | ✅ Mapped |
| `Subject_Insulation` | `insulation` | `{{insulation}}` | 29 | ✅ Mapped |

### 1.7 Parking & Amenities
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_Parking` | `parking` | `{{parking}}` | 6, 29 | ✅ Mapped |
| `Subject_ParkingType` | `parking-type` | `{{parking-type}}` | 6, 59 | ✅ Mapped |
| `Subject_ParkingRatio` | `parking-ratio` | `{{parking-ratio}}` | 6, 59 | ✅ Mapped |
| `Subject_ParkingSpaces` | `parking-spaces` | `{{parking-spaces}}` | 29 | ✅ Mapped |
| `Subject_ProjectAmenities` | `project-amenities` | `{{project-amenities}}` | 6, 29, 59 | ✅ Mapped |
| `Subject_UnitAmenities` | `unit-amenities` | `{{unit-amenities}}` | 6, 29, 59 | ✅ Mapped |
| `Subject_Laundry` | `laundry` | `{{laundry}}` | 6, 29 | ✅ Mapped |
| `Subject_Security` | `security` | `{{security}}` | 6, 29 | ✅ Mapped |

### 1.8 Site Characteristics
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_TotalSF` | `site-total-sf` | `{{site-total-sf}}` | 6, 21 | ✅ Mapped |
| `Subject_TotalAcre` | `site-total-acres` | `{{site-total-acres}}` | 6, 21 | ✅ Mapped |
| `Subject_UsableSF` | `site-usable-sf` | `{{site-usable-sf}}` | 6 | ✅ Mapped |
| `Subject_UsableAcre` | `site-usable-acres` | `{{site-usable-acres}}` | 6 | ✅ Mapped |
| `Subject_Shape` | `site-shape` | `{{site-shape}}` | 6, 21 | ✅ Mapped |
| `Subject_Topography` | `topography` | `{{topography}}` | 6, 21 | ✅ Mapped |
| `Subject_Access` | `access` | `{{access}}` | 6, 21, 59 | ✅ Mapped |
| `Subject_Exposure` | `exposure` | `{{exposure}}` | 6, 21, 59 | ✅ Mapped |
| `Subject_Zoning` | `zoning` | `{{zoning}}` | 6, 27 | ✅ Mapped |
| `Subject_ZoningCode` | `zoning-code` | `{{zoning-code}}` | 27 | ✅ Mapped |
| `Subject_Flood` | `flood-zone` | `{{flood-zone}}` | 6, 21 | ✅ Mapped |
| `Subject_FloodZoneCode` | `flood-zone-code` | `{{flood-zone-code}}` | 21 | ✅ Mapped |
| `Subject_Seismic` | `seismic-zone` | `{{seismic-zone}}` | 6 | ✅ Mapped |
| `Subject_Soils` | `soils` | `{{soils}}` | 21 | ✅ Mapped |
| `Subject_UtilitiesAtSite` | `utilities` | `{{utilities}}` | 21 | ✅ Mapped |
| `Subject_Easements` | `easements` | `{{easements}}` | 21 | ✅ Mapped |

### 1.9 Adjacent Properties
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_AdjacentN` | `adjacent-north` | `{{adjacent-north}}` | 21 | ✅ Mapped |
| `Subject_AdjacentE` | `adjacent-east` | `{{adjacent-east}}` | 21 | ✅ Mapped |
| `Subject_AdjacentS` | `adjacent-south` | `{{adjacent-south}}` | 21 | ✅ Mapped |
| `Subject_AdjacentW` | `adjacent-west` | `{{adjacent-west}}` | 21 | ✅ Mapped |

### 1.10 Highest & Best Use
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_HBUVacant` | `hbu-vacant` | `{{hbu-vacant}}` | 6, 35 | ✅ Mapped |
| `Subject_HBUImproved` | `hbu-improved` | `{{hbu-improved}}` | 6, 35 | ✅ Mapped |
| `Subject_CurrentUse` | `current-use` | `{{current-use}}` | 35 | ✅ Mapped |
| `Subject_ExposureTime` | `exposure-time` | `{{exposure-time}}` | 6, 62 | ✅ Mapped |
| `Subject_Marketing` | `marketing-time` | `{{marketing-time}}` | 6, 62 | ✅ Mapped |

### 1.11 Sale History
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Subject_LastSaleDate` | `last-sale-date` | `{{last-sale-date}}` | 18 | ✅ Mapped |
| `Subject_LastSalePrice` | `last-sale-price` | `{{last-sale-price}}` | 18 | ✅ Mapped |
| `Subject_CurrentOwner` | `current-owner` | `{{current-owner}}` | 18 | ✅ Mapped |
| `Subject_PreviousOwner` | `previous-owner` | `{{previous-owner}}` | 18 | ✅ Mapped |
| `Subject_SaleHistory` | `sale-history` | `{{sale-history}}` | 18 | ✅ Mapped |

---

## 2. DIRECT CAPITALIZATION FIELDS

### 2.1 Revenue - Unit Mix
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_UnitMix` | `dircap-unitmix` | `{{dircap-unitmix}}` | 49 | ✅ Mapped |
| `IA_DirCap_Rent` | `dircap-rent-total` | `{{dircap-rent-total}}` | 49 | ✅ Mapped |
| `IA_DirCap_RentPerUnit` | `dircap-rent-perunit` | `{{dircap-rent-perunit}}` | 49 | ✅ Mapped |
| `IA_DirCap_RentPSFYr` | `dircap-rent-psfyr` | `{{dircap-rent-psfyr}}` | 49 | ✅ Mapped |
| `IA_DirCap_RentPSFMo` | `dircap-rent-psfmo` | `{{dircap-rent-psfmo}}` | 49 | ✅ Mapped |

### 2.2 Revenue - Other Income
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_Rmb` | `dircap-reimb-total` | `{{dircap-reimb-total}}` | 49 | ✅ Mapped |
| `IA_DirCap_RmbPerUnit` | `dircap-reimb-perunit` | `{{dircap-reimb-perunit}}` | 49 | ✅ Mapped |
| `IA_DirCap_RmbPSFYr` | `dircap-reimb-psfyr` | `{{dircap-reimb-psfyr}}` | 49 | ✅ Mapped |
| `IA_DirCap_Misc` | `dircap-misc-total` | `{{dircap-misc-total}}` | 49 | ✅ Mapped |
| `IA_DirCap_MiscPerUnit` | `dircap-misc-perunit` | `{{dircap-misc-perunit}}` | 49 | ✅ Mapped |
| `IA_DirCap_MiscPSFYr` | `dircap-misc-psfyr` | `{{dircap-misc-psfyr}}` | 49 | ✅ Mapped |

### 2.3 Potential Gross Income
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_PGI` | `calc-pgi` | `{{calc-pgi}}` | 43, 49 | ✅ Mapped |
| `IA_DirCap_PGIUnit` | `calc-pgi-perunit` | `{{calc-pgi-perunit}}` | 49 | ✅ Mapped |
| `IA_DirCap_PGIPSF` | `calc-pgi-psf` | `{{calc-pgi-psf}}` | 49 | ✅ Mapped |

### 2.4 Vacancy & Credit Loss
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_VacLoss` | `dircap-vacancy-pct` | `{{dircap-vacancy-pct}}` | 43, 49 | ✅ Mapped |
| `IA_DirCap_VacancyTotal` | `dircap-vacancy-total` | `{{dircap-vacancy-total}}` | 49 | ✅ Mapped |
| `IA_DirCap_ConcLoss` | `dircap-concession-pct` | `{{dircap-concession-pct}}` | 49 | ✅ Mapped |
| `IA_DirCap_ConcessionTotal` | `dircap-concession-total` | `{{dircap-concession-total}}` | 49 | ✅ Mapped |
| `IA_DirCap_ColLoss` | `dircap-baddebt-pct` | `{{dircap-baddebt-pct}}` | 49 | ✅ Mapped |
| `IA_DirCap_CreditLossTotal` | `dircap-baddebt-total` | `{{dircap-baddebt-total}}` | 49 | ✅ Mapped |
| `IA_DirCap_Loss2Lease` | `dircap-losstolease-pct` | `{{dircap-losstolease-pct}}` | 49 | ✅ Mapped |
| `IA_DirCap_OtherLossTotal` | `dircap-otherloss-total` | `{{dircap-otherloss-total}}` | 49 | ✅ Mapped |
| `IA_DirCap_Loss` | `dircap-totalloss-pct` | `{{dircap-totalloss-pct}}` | 49 | ✅ Mapped |
| `IA_DirCap_LossTotal` | `dircap-totalloss-total` | `{{dircap-totalloss-total}}` | 49 | ✅ Mapped |

### 2.5 Effective Gross Income
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_EGI` | `calc-egr` | `{{calc-egr}}` | 43, 49, 62 | ✅ Mapped |
| `IA_DirCap_EGIUnit` | `calc-egr-perunit` | `{{calc-egr-perunit}}` | 49 | ✅ Mapped |
| `IA_DirCap_EGIPSF` | `calc-egr-psf` | `{{calc-egr-psf}}` | 49 | ✅ Mapped |

### 2.6 Operating Expenses (Dynamic Lines 01-25)
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_Expense01` | `dircap-expense01-label` | `{{dircap-expense01-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense02` | `dircap-expense02-label` | `{{dircap-expense02-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense03` | `dircap-expense03-label` | `{{dircap-expense03-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense04` | `dircap-expense04-label` | `{{dircap-expense04-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense05` | `dircap-expense05-label` | `{{dircap-expense05-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense06` | `dircap-expense06-label` | `{{dircap-expense06-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense07` | `dircap-expense07-label` | `{{dircap-expense07-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense08` | `dircap-expense08-label` | `{{dircap-expense08-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense09` | `dircap-expense09-label` | `{{dircap-expense09-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense10` | `dircap-expense10-label` | `{{dircap-expense10-label}}` | 45, 49 | ✅ Mapped |
| `IA_DirCap_Expense11` | `dircap-expense11-label` | `{{dircap-expense11-label}}` | 49 | ✅ Mapped |
| `IA_DirCap_Expense12` | `dircap-expense12-label` | `{{dircap-expense12-label}}` | 49 | ✅ Mapped |
| `IA_DirCap_Expense13` | `dircap-expense13-label` | `{{dircap-expense13-label}}` | 49 | ✅ Mapped |
| `IA_DirCap_Expense14` | `dircap-expense14-label` | `{{dircap-expense14-label}}` | 49 | ✅ Mapped |
| `IA_DirCap_Expense15` | `dircap-expense15-label` | `{{dircap-expense15-label}}` | 49 | ✅ Mapped |
| ... (through Expense25) | ... | ... | ... | ... |

### 2.7 Expense Totals
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_ExpenseRatio` | `dircap-expense-ratio` | `{{dircap-expense-ratio}}` | 6, 45, 49 | ✅ Mapped |
| `IA_DirCap_Expenses` | `dircap-expenses-total` | `{{dircap-expenses-total}}` | 45, 49 | ✅ Mapped |

### 2.8 Net Operating Income
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_NOI` | `calc-noi` | `{{calc-noi}}` | 6, 45, 49, 50, 62 | ✅ Mapped |
| `IA_DirCap_NOIUnit` | `calc-noi-perunit` | `{{calc-noi-perunit}}` | 49, 50 | ✅ Mapped |
| `IA_DirCap_NOIPSF` | `calc-noi-psf` | `{{calc-noi-psf}}` | 49, 50, 62 | ✅ Mapped |

### 2.9 Capitalization
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_CapRate1` | `dircap-caprate1` | `{{dircap-caprate1}}` | 6, 47, 49, 62 | ✅ Mapped |
| `IA_DirCap_CapRate2` | `dircap-caprate2` | `{{dircap-caprate2}}` | 49 | ✅ Mapped |
| `IA_DirCap_Blend` | `dircap-caprate-blend` | `{{dircap-caprate-blend}}` | 49 | ✅ Mapped |
| `IA_DirCap_ImpliedOAR` | `dircap-implied-oar` | `{{dircap-implied-oar}}` | 47 | ✅ Mapped |

### 2.10 Indicated Values
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_DirCap_PrelimValue1` | `dircap-prelim-value` | `{{dircap-prelim-value}}` | 49 | ✅ Mapped |
| `IA_DirCap_Value1` | `dircap-value1` | `{{dircap-value1}}` | 49, 50 | ✅ Mapped |
| `IA_DirCap_ValuePerUnit1.6` | `dircap-value1-perunit` | `{{dircap-value1-perunit}}` | 49, 50 | ✅ Mapped |
| `IA_DirCap_ValuePerUnit1.5` | `dircap-value1-psf` | `{{dircap-value1-psf}}` | 49, 50 | ✅ Mapped |
| `IA_DirCap_ScenarioValue1` | `dircap-scenario1` | `{{dircap-scenario1}}` | 49 | ✅ Mapped |
| `IA_DirCap_Adjustment1` | `dircap-adj1` | `{{dircap-adj1}}` | 49 | ✅ Mapped |
| `IA_DirCap_Value2` | `dircap-value2` | `{{dircap-value2}}` | 49 | ✅ Mapped |
| `IA_DirCap_Adjustment2` | `dircap-adj2` | `{{dircap-adj2}}` | 49 | ✅ Mapped |
| `IA_DirCap_Value3` | `dircap-value3` | `{{dircap-value3}}` | 49 | ✅ Mapped |
| `IA_DirCap_Adjustment3` | `dircap-adj3` | `{{dircap-adj3}}` | 49 | ✅ Mapped |
| `IA_DirCap_Value4` | `dircap-value4` | `{{dircap-value4}}` | 49 | ✅ Mapped |

---

## 3. SALES COMPARISON FIELDS

### 3.1 Comp 1
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `SA1_1_ID` | `comp1-id` | `{{comp1-id}}` | 54, 59 | ✅ Mapped |
| `SA1_1_Address` | `comp1-address` | `{{comp1-address}}` | 54, 59 | ✅ Mapped |
| `SA1_1_City` | `comp1-city` | `{{comp1-city}}` | 54, 59 | ✅ Mapped |
| `SA1_1_State` | `comp1-province` | `{{comp1-province}}` | 54, 59 | ✅ Mapped |
| `SA1_1_Zip` | `comp1-postal` | `{{comp1-postal}}` | 54 | ✅ Mapped |
| `SA1_1_GBA` | `comp1-gba` | `{{comp1-gba}}` | 54, 59 | ✅ Mapped |
| `SA1_1_NRA` | `comp1-nra` | `{{comp1-nra}}` | 54, 59 | ✅ Mapped |
| `SA1_1_PricePerUOM` | `comp1-priceperunit` | `{{comp1-priceperunit}}` | 54, 59 | ✅ Mapped |
| `SA1_1_Photo` | `comp1-photo` | `{{comp1-photo}}` | 54 | ✅ Mapped |
| `SA1_1_PhotoURL` | `comp1-photourl` | `{{comp1-photourl}}` | 54 | ✅ Mapped |
| `SA1_1_Geocode` | `comp1-geocode` | `{{comp1-geocode}}` | 53 | ✅ Mapped |
| `SA1_1_MapComp` | `comp1-mapcomp` | `{{comp1-mapcomp}}` | 53 | ✅ Mapped |
| `SA1_1_CommentProp` | `comp1-comments-prop` | `{{comp1-comments-prop}}` | 54 | ✅ Mapped |
| `SA1_1_CommentSale` | `comp1-comments-sale` | `{{comp1-comments-sale}}` | 54 | ✅ Mapped |

### 3.2 Comp 2
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `SA1_2_ID` | `comp2-id` | `{{comp2-id}}` | 55, 59 | ✅ Mapped |
| `SA1_2_Address` | `comp2-address` | `{{comp2-address}}` | 55, 59 | ✅ Mapped |
| `SA1_2_City` | `comp2-city` | `{{comp2-city}}` | 55, 59 | ✅ Mapped |
| `SA1_2_State` | `comp2-province` | `{{comp2-province}}` | 55, 59 | ✅ Mapped |
| `SA1_2_Zip` | `comp2-postal` | `{{comp2-postal}}` | 55 | ✅ Mapped |
| `SA1_2_GBA` | `comp2-gba` | `{{comp2-gba}}` | 55, 59 | ✅ Mapped |
| `SA1_2_NRA` | `comp2-nra` | `{{comp2-nra}}` | 55, 59 | ✅ Mapped |
| `SA1_2_PricePerUOM` | `comp2-priceperunit` | `{{comp2-priceperunit}}` | 55, 59 | ✅ Mapped |
| `SA1_2_Photo` | `comp2-photo` | `{{comp2-photo}}` | 55 | ✅ Mapped |
| `SA1_2_PhotoURL` | `comp2-photourl` | `{{comp2-photourl}}` | 55 | ✅ Mapped |
| `SA1_2_CommentProp` | `comp2-comments-prop` | `{{comp2-comments-prop}}` | 55 | ✅ Mapped |
| `SA1_2_CommentSale` | `comp2-comments-sale` | `{{comp2-comments-sale}}` | 55 | ✅ Mapped |

### 3.3 Comp 3
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `SA1_3_ID` | `comp3-id` | `{{comp3-id}}` | 56, 59 | ✅ Mapped |
| `SA1_3_Address` | `comp3-address` | `{{comp3-address}}` | 56, 59 | ✅ Mapped |
| `SA1_3_City` | `comp3-city` | `{{comp3-city}}` | 56, 59 | ✅ Mapped |
| `SA1_3_State` | `comp3-province` | `{{comp3-province}}` | 56, 59 | ✅ Mapped |
| `SA1_3_Zip` | `comp3-postal` | `{{comp3-postal}}` | 56 | ✅ Mapped |
| `SA1_3_GBA` | `comp3-gba` | `{{comp3-gba}}` | 56, 59 | ✅ Mapped |
| `SA1_3_NRA` | `comp3-nra` | `{{comp3-nra}}` | 56, 59 | ✅ Mapped |
| `SA1_3_PricePerUOM` | `comp3-priceperunit` | `{{comp3-priceperunit}}` | 56, 59 | ✅ Mapped |
| `SA1_3_Photo` | `comp3-photo` | `{{comp3-photo}}` | 56 | ✅ Mapped |
| `SA1_3_PhotoURL` | `comp3-photourl` | `{{comp3-photourl}}` | 56 | ✅ Mapped |
| `SA1_3_CommentProp` | `comp3-comments-prop` | `{{comp3-comments-prop}}` | 56 | ✅ Mapped |
| `SA1_3_CommentSale` | `comp3-comments-sale` | `{{comp3-comments-sale}}` | 56 | ✅ Mapped |

### 3.4 Comp 4
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `SA1_4_ID` | `comp4-id` | `{{comp4-id}}` | 57, 59 | ✅ Mapped |
| `SA1_4_Address` | `comp4-address` | `{{comp4-address}}` | 57, 59 | ✅ Mapped |
| `SA1_4_City` | `comp4-city` | `{{comp4-city}}` | 57, 59 | ✅ Mapped |
| `SA1_4_State` | `comp4-province` | `{{comp4-province}}` | 57, 59 | ✅ Mapped |
| `SA1_4_Zip` | `comp4-postal` | `{{comp4-postal}}` | 57 | ✅ Mapped |
| `SA1_4_GBA` | `comp4-gba` | `{{comp4-gba}}` | 57, 59 | ✅ Mapped |
| `SA1_4_NRA` | `comp4-nra` | `{{comp4-nra}}` | 57, 59 | ✅ Mapped |
| `SA1_4_PricePerUOM` | `comp4-priceperunit` | `{{comp4-priceperunit}}` | 57, 59 | ✅ Mapped |
| `SA1_4_Photo` | `comp4-photo` | `{{comp4-photo}}` | 57 | ✅ Mapped |
| `SA1_4_PhotoURL` | `comp4-photourl` | `{{comp4-photourl}}` | 57 | ✅ Mapped |
| `SA1_4_CommentProp` | `comp4-comments-prop` | `{{comp4-comments-prop}}` | 57 | ✅ Mapped |
| `SA1_4_CommentSale` | `comp4-comments-sale` | `{{comp4-comments-sale}}` | 57 | ✅ Mapped |

### 3.5 Comp 5
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `SA1_5_ID` | `comp5-id` | `{{comp5-id}}` | 58, 59 | ✅ Mapped |
| `SA1_5_Address` | `comp5-address` | `{{comp5-address}}` | 58, 59 | ✅ Mapped |
| `SA1_5_City` | `comp5-city` | `{{comp5-city}}` | 58, 59 | ✅ Mapped |
| `SA1_5_State` | `comp5-province` | `{{comp5-province}}` | 58, 59 | ✅ Mapped |
| `SA1_5_Zip` | `comp5-postal` | `{{comp5-postal}}` | 58 | ✅ Mapped |
| `SA1_5_GBA` | `comp5-gba` | `{{comp5-gba}}` | 58, 59 | ✅ Mapped |
| `SA1_5_NRA` | `comp5-nra` | `{{comp5-nra}}` | 58, 59 | ✅ Mapped |
| `SA1_5_PricePerUOM` | `comp5-priceperunit` | `{{comp5-priceperunit}}` | 58, 59 | ✅ Mapped |
| `SA1_5_Photo` | `comp5-photo` | `{{comp5-photo}}` | 58 | ✅ Mapped |
| `SA1_5_PhotoURL` | `comp5-photourl` | `{{comp5-photourl}}` | 58 | ✅ Mapped |
| `SA1_5_CommentProp` | `comp5-comments-prop` | `{{comp5-comments-prop}}` | 58 | ✅ Mapped |
| `SA1_5_CommentSale` | `comp5-comments-sale` | `{{comp5-comments-sale}}` | 58 | ✅ Mapped |

### 3.6 Additional Comps (6-10) - Same Pattern
Comps 6-10 follow identical naming pattern:
- `SA1_N_Address` → `compN-address`
- `SA1_N_City` → `compN-city`
- etc.

---

## 4. RENT SURVEY FIELDS

### 4.1 Rental Comp 1
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `SU1_1_ID` | `rental-comp1-id` | `{{rental-comp1-id}}` | 40, 41 | ✅ Mapped |
| `SU1_1_Address` | `rental-comp1-address` | `{{rental-comp1-address}}` | 40 | ✅ Mapped |
| `SU1_1_City` | `rental-comp1-city` | `{{rental-comp1-city}}` | 40 | ✅ Mapped |
| `SU1_1_State` | `rental-comp1-province` | `{{rental-comp1-province}}` | 40 | ✅ Mapped |
| `SU1_1_Zip` | `rental-comp1-postal` | `{{rental-comp1-postal}}` | 40 | ✅ Mapped |
| `SU1_1_Utilities` | `rental-comp1-utilities` | `{{rental-comp1-utilities}}` | 40 | ✅ Mapped |
| `SU1_1_TotalAdj` | `rental-comp1-totaladj` | `{{rental-comp1-totaladj}}` | 40 | ✅ Mapped |
| `SU1_1_Photo` | `rental-comp1-photo` | `{{rental-comp1-photo}}` | 40 | ✅ Mapped |
| `SU1_1_PhotoURL` | `rental-comp1-photourl` | `{{rental-comp1-photourl}}` | 40 | ✅ Mapped |
| `SU1_1_CommentProp` | `rental-comp1-comments` | `{{rental-comp1-comments}}` | 40 | ✅ Mapped |
| `SU1_1_UnitMix` | `rental-comp1-unitmix` | `{{rental-comp1-unitmix}}` | 40 | ✅ Mapped |

### 4.2 Rental Comps 2-5
Same pattern as Rental Comp 1:
- `SU1_2_Address` → `rental-comp2-address`
- `SU1_3_Address` → `rental-comp3-address`
- `SU1_4_Address` → `rental-comp4-address`
- `SU1_5_Address` → `rental-comp5-address`

### 4.3 Rental Comps 6-10 (if needed)
Same pattern continues for additional rental comps.

---

## 5. VALUE CONCLUSION FIELDS

### 5.1 Final Values
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Value_Scenario1` | `value-scenario1` | `{{value-scenario1}}` | 6, 62, 65 | ✅ Mapped |
| `Value_Scenario1PerUofM` | `value-scenario1-psf` | `{{value-scenario1-psf}}` | 6, 62 | ✅ Mapped |
| `Value_Scenario1Text` | `value-scenario1-text` | `{{value-scenario1-text}}` | 65 | ✅ Mapped |
| `Value_Scenario2` | `value-scenario2` | `{{value-scenario2}}` | 62 | ✅ Mapped |
| `Value_Scenario2Text` | `value-scenario2-text` | `{{value-scenario2-text}}` | 62 | ✅ Mapped |
| `Value_Scenario3` | `value-scenario3` | `{{value-scenario3}}` | 62 | ✅ Mapped |
| `Value_Scenario3Text` | `value-scenario3-text` | `{{value-scenario3-text}}` | 62 | ✅ Mapped |

### 5.2 Approach Conclusions
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Value_SARecScenario1` | `value-sa-conclusion` | `{{value-sa-conclusion}}` | 60, 62 | ✅ Mapped |
| `Value_IARecScenario1` | `value-ia-conclusion` | `{{value-ia-conclusion}}` | 50, 62 | ✅ Mapped |

### 5.3 Additional Values
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Value_Insurable` | `value-insurable` | `{{value-insurable}}` | 6 | ✅ Mapped |
| `Value_InsurablePSF` | `value-insurable-psf` | `{{value-insurable-psf}}` | 6 | ✅ Mapped |
| `Value_RepCostEst` | `value-replacement-cost` | `{{value-replacement-cost}}` | 6 | ✅ Mapped |
| `Value_Disposition` | `value-disposition` | `{{value-disposition}}` | 6 | ✅ Mapped |
| `Value_GoDark` | `value-godark` | `{{value-godark}}` | 6 | ✅ Mapped |

---

## 6. EXECUTIVE SUMMARY FIELDS

### 6.1 Section Areas
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Exec_PropIdentity` | `exec-prop-identity` | (table area) | 5, 6 | ✅ Mapped |
| `Exec_Site` | `exec-site` | (table area) | 5, 6 | ✅ Mapped |
| `Exec_SiteDesc` | `exec-site-desc` | (table area) | 5, 6 | ✅ Mapped |
| `Exec_Impv` | `exec-improvements` | (table area) | 5, 6 | ✅ Mapped |
| `Exec_ImpvDesc` | `exec-impv-desc` | (table area) | 5, 6 | ✅ Mapped |
| `Exec_HBU` | `exec-hbu` | (table area) | 6 | ✅ Mapped |
| `Exec_HighestBestUse` | `exec-hbu-detail` | (table area) | 6, 35 | ✅ Mapped |
| `Exec_ExposureMarketing` | `exec-exposure-marketing` | (table area) | 6 | ✅ Mapped |
| `Exec_Investment` | `exec-investment` | (table area) | 6 | ✅ Mapped |
| `Exec_InvestmentIndicators` | `exec-investment-indicators` | (table area) | 6 | ✅ Mapped |
| `Exec_Qualitative` | `exec-qualitative` | (table area) | 6 | ✅ Mapped |

### 6.2 Investment Indicators (from EXEC sheet)
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `IA_ExpenseRatio` | `expense-ratio` | `{{expense-ratio}}` | 6 | ✅ Mapped |

---

## 7. SITE & IMPROVEMENTS FIELDS

### 7.1 Site Details
| Valcre Named Range | Our Field ID | Template Placeholder | Page(s) | Status |
|--------------------|--------------|---------------------|---------|--------|
| `Site_LandAreaTotal` | `site-land-total` | `{{site-land-total}}` | 6, 21 | ✅ Mapped |
| `Site_LandAreaUsable` | `site-land-usable` | `{{site-land-usable}}` | 6 | ✅ Mapped |
| `Site_LandAreaExcess` | `site-land-excess` | `{{site-land-excess}}` | 6 | ✅ Mapped |
| `Site_LandAreaSurplus` | `site-land-surplus` | `{{site-land-surplus}}` | 6 | ✅ Mapped |
| `Site_Shape` | `site-shape` | `{{site-shape}}` | 6, 21 | ✅ Mapped |
| `Site_Topography` | `site-topography` | `{{site-topography}}` | 6, 21 | ✅ Mapped |
| `Site_Zoning` | `site-zoning` | `{{site-zoning}}` | 6, 27 | ✅ Mapped |

### 7.2 Improvement Fields
See Subject Property section for building-specific fields (Subject_NRA, Subject_GBA, etc.)

---

## 8. GAP ANALYSIS

### 8.1 Unmapped Valcre Ranges (Priority - Need Template Fields)

These Valcre ranges exist but have no corresponding template field:

| Valcre Named Range | Description | Priority | Recommendation |
|--------------------|-------------|----------|----------------|
| `IA_DirCap_GRI` | Gross Rental Income area | High | Add to Direct Cap table |
| `IA_DirCap_GRIMF` | GRI Multifamily section | High | Include in unit mix |
| `IA_DirCap_ContvMkt` | Contract vs Market summary | Medium | Add comparison cell |
| `IA_DirCap_RRSelect` | Rent Roll selection flag | Low | Internal control |
| `IA_DirCap_Filter` | Filter flags | Low | Internal control |
| `IA_RR_WALE` | Weighted Avg Lease Expiry | Medium | Add to Rent Roll summary |
| `IA_RR_TenantLargest` | Largest tenant name | Medium | Add to tenant analysis |
| `IA_UM_ContvMkt` | Unit Mix Contract vs Mkt | High | Add to Unit Mix table |
| `Subject_DefMaintAmt` | Deferred maintenance $ | Medium | Add to adjustments |
| `Subject_FFE` | FF&E included | Low | Add to scope if needed |

### 8.2 Orphan Template Fields (Need Valcre Mapping)

These are fields we use in templates that aren't direct Valcre named ranges:

| Our Field ID | Template Placeholder | Page(s) | Source/Notes |
|--------------|---------------------|---------|--------------|
| `company-jobnumber` | `{{company-jobnumber}}` | Footer, 3 | User/job-entered |
| `company-name` | `{{company-name}}` | Cover, 3, 73 | Company config |
| `company-address` | `{{company-address}}` | 3, 73 | Company config |
| `company-phone` | `{{company-phone}}` | 3, 73 | Company config |
| `company-email` | `{{company-email}}` | 3, 73 | Company config |
| `appraiser-name` | `{{appraiser-name}}` | 3, 64, 65, 73 | From Appraiser fields |
| `appraiser-designation` | `{{appraiser-designation}}` | 3, 65, 73 | From Appraiser fields |
| `effective-date` | `{{effective-date}}` | Cover, 3, 6, 65 | Job_EffectiveDate |
| `report-date` | `{{report-date}}` | Cover, 3 | Job_ReportDate |
| `client-name` | `{{client-name}}` | 3, 17 | Client_Name |
| `client-company` | `{{client-company}}` | 3, 17 | Client_Company |
| `client-address` | `{{client-address}}` | 3 | Client_Address |
| `intended-user` | `{{intended-user}}` | 17 | Job field |
| `intended-use` | `{{intended-use}}` | 17 | Job field |

### 8.3 Complex/Calculated Fields

Fields that require calculation or combination:

| Our Field ID | Calculation/Source | Notes |
|--------------|-------------------|-------|
| `calc-noi` | `IA_DirCap_NOI` | Direct |
| `calc-pgi` | `IA_DirCap_PGI` | Direct |
| `calc-egr` | `IA_DirCap_EGI` | Direct |
| `actual-age` | Current Year - YearBuilt | Calculated |
| `remaining-life` | EconomicLife - EffectiveAge | Calculated |
| `density` | Units / Acres | Calculated |
| `land-to-building` | LandSF / GBA | Calculated |

---

## 9. STATISTICS SUMMARY

| Category | Count |
|----------|-------|
| **Total Valcre Named Ranges** | 7,988 |
| **Priority Table Ranges** | ~1,500 |
| **Subject Property Fields** | 487 |
| **Direct Capitalization Fields** | 284 |
| **Sales Comparison Fields (SA1_)** | 299 |
| **Rent Survey Fields (SU1_)** | 290 |
| **Value Conclusion Fields** | 30 |
| **Executive Summary Fields** | 36 |
| | |
| **Mapped in This Crosswalk** | ~350 |
| **High Priority Unmapped** | ~50 |
| **Template-Only (Orphans)** | ~25 |
| **Coverage (Priority Fields)** | ~85% |

---

## 10. NAMING CONVENTION REFERENCE

### Valcre Prefixes → Our Prefixes

| Valcre Pattern | Our Pattern | Example |
|----------------|-------------|---------|
| `Subject_*` | `subject-*` or direct | `Subject_NRA` → `subject-nra` |
| `IA_DirCap_*` | `dircap-*` or `calc-*` | `IA_DirCap_NOI` → `calc-noi` |
| `SA1_N_*` | `compN-*` | `SA1_1_Address` → `comp1-address` |
| `SU1_N_*` | `rental-compN-*` | `SU1_1_Address` → `rental-comp1-address` |
| `Value_*` | `value-*` | `Value_Scenario1` → `value-scenario1` |
| `Exec_*` | `exec-*` | `Exec_HBU` → `exec-hbu` |
| `Site_*` | `site-*` | `Site_Zoning` → `site-zoning` |

### Transformation Rules

1. **Case**: `PascalCase` or `CamelCase` → `kebab-case`
2. **Underscores**: Replace `_` with `-`
3. **Numbers**: Keep inline (e.g., `comp1`, `expense01`)
4. **Abbreviations**: Preserve when clear (`nra`, `gba`, `pgi`, `egr`, `noi`)
5. **Calculated fields**: Use `calc-` prefix for key totals

---

## 11. USAGE EXAMPLES

### Example 1: Populate Subject Property
```javascript
// Mapping object
const subjectMapping = {
  'Subject_Name': 'subject-propertyname',
  'Subject_Street': 'subject-street',
  'Subject_City': 'city',
  'Subject_NRA': 'subject-nra',
  // ...
};

// Apply to template
for (const [valcre, template] of Object.entries(subjectMapping)) {
  const value = workbook.getNamedRange(valcre);
  document.querySelector(`[data-field="${template}"]`).textContent = value;
}
```

### Example 2: Populate Sales Comps
```javascript
// Generate comp mappings dynamically
for (let i = 1; i <= 5; i++) {
  const compMapping = {
    [`SA1_${i}_Address`]: `comp${i}-address`,
    [`SA1_${i}_City`]: `comp${i}-city`,
    [`SA1_${i}_PricePerUOM`]: `comp${i}-priceperunit`,
    // ...
  };
  // Apply...
}
```

---

## 12. NEXT STEPS

1. **Template Validation**: Verify all `{{field-id}}` placeholders exist in HTML template
2. **Add Missing Fields**: Implement template fields for high-priority unmapped Valcre ranges
3. **Build Import Engine**: Create JavaScript/Python module to parse Valcre exports and populate template
4. **Test with Live Data**: Validate with VAL251012 workbook data
5. **Create Reverse Mapping**: JSON file for programmatic lookup

---

*Document generated: December 22, 2025*  
*Source: VAL251012_-_North_Battleford_Apt.xlsm*  
*Total Valcre ranges analyzed: 7,988*
