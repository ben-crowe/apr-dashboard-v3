# Complete Appraisal Report Field Mapping
**Source:** VAL251012 - North Battleford Apartments (Actual Report Analysis)
**Date:** November 22, 2025
**Purpose:** Comprehensive field inventory from final appraisal report

---

## SECTION 1: COVER PAGE & IDENTIFICATION

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `cover_propertyType` | Property Type Category | Text | "Multi-Family Walkup Property" | Report classification |
| `cover_propertyName` | Property Name | Text | "North Battleford Apartments" | Marketing/common name |
| `cover_propertyAddress` | Property Address | Text | "1101, 1121 109 St" | Street address |
| `cover_propertyCity` | City | Text | "North Battleford" | |
| `cover_propertyProvince` | Province/State | Text | "Saskatchewan" | |
| `cover_clientName` | Client Contact Name | Text | "Kenneth Engler" | |
| `cover_clientCompany` | Client Company | Text | "102109845 Saskatchewan Ltd." | |
| `cover_clientAddress` | Client Address | Text | "1901, 1088 - 6th Ave SW" | |
| `cover_clientCity` | Client City | Text | "Calgary, AB T2P 5N3" | |
| `cover_appraiserCompany` | Appraiser Company | Text | "Valta Property Valuations Ltd." | |
| `cover_appraiserAddress` | Appraiser Address | Text | "300, 4838 Richard Road SW" | |
| `cover_appraiserCity` | Appraiser City | Text | "Calgary, AB T3E 6L1" | |
| `cover_appraiserPhone` | Office Phone | Phone | "587-801-5151" | |
| `cover_appraiserWebsite` | Website | URL | "www.valta.ca" | |
| `cover_valuationDate` | Date of Valuation | Date | "October 17, 2025" | Effective date |
| `cover_reportDate` | Date of Report | Date | "November 20, 2025" | Report completion date |
| `cover_fileNumber` | File Number | Text | "VAL251012 - 1" | Valcre job number |

---

## SECTION 2: LETTER OF TRANSMITTAL

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `transmittal_date` | Letter Date | Date | "November 20, 2025" | |
| `transmittal_clientName` | Addressee | Text | "102109845 Saskatchewan Ltd." | |
| `transmittal_attention` | Attention Line | Text | "Kenneth Engler" | |
| `transmittal_subject` | Subject/Re Line | Text | "As Stabilized (Fee Simple Estate) current market value..." | Purpose statement |
| `transmittal_propertyDescription` | Property Description | Text (multi-line) | "multi-family, walkup property with improvements..." | Narrative description |
| `transmittal_numberOfBuildings` | Number of Buildings | Integer | 2 | Total structures |
| `transmittal_netRentableArea` | Net Rentable Area (NRA) | Number (SF) | 10,204 | Square feet |
| `transmittal_yearBuilt` | Year Built | Integer | 1970 | Original construction |
| `transmittal_occupancyRate` | Occupancy Rate | Percentage | "100.0%" | Current occupancy |
| `transmittal_numberOfUnits` | Number of Units | Integer | 16 | Total dwelling units |
| `transmittal_numberOfStories` | Number of Stories | Integer | 2 | Building height |
| `transmittal_buildingFormat` | Building Format | Text | "garden style" | Design type |
| `transmittal_appraiserName` | Appraiser Name | Text | "Chris Chornohos" | Signing appraiser |
| `transmittal_appraiserDesignation` | Professional Designation | Text | "AACI, MRICS" | Credentials |
| `transmittal_appraiserTitle` | Appraiser Title | Text | "Founder" | |
| `transmittal_appraiserEmail` | Appraiser Email | Email | "chris.chornohos@valta.ca" | |
| `transmittal_appraiserLicense` | License Number | Text | "AIC No: 902097" | Professional registration |
| `transmittal_signatureImage` | Digital Signature | Image | (signature.png) | For PDF |

---

## SECTION 3: EXECUTIVE SUMMARY

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `exec_propertyName` | Property Name | Text | "North Battleford Apartments" | |
| `exec_propertyAddress` | Full Address | Text | "1101, 1121 109 St, North Battleford, SK" | |
| `exec_propertyType` | Property Type | Text | "Multi-family walkup" | |
| `exec_grossBuildingArea` | Gross Building Area | Number (SF) | 10,204 | |
| `exec_numberOfUnits` | Number of Units | Integer | 16 | |
| `exec_yearBuilt` | Year Built | Integer | 1970 | |
| `exec_valuationPremise` | Valuation Premise | Text | "As Stabilized (Fee Simple Estate)" | |
| `exec_finalValue` | Market Value Conclusion | Currency | "$2,400,000" | FINAL VALUE |
| `exec_hypotheticalConditions` | Hypothetical Conditions | Text (multi-line) | "The As Stabilized value has been developed based on..." | Standard disclosure |
| `exec_extraordinaryAssumptions` | Extraordinary Assumptions | Text | "No Extraordinary Assumptions were made..." | Or specific text |
| `exec_limitingConditions` | Extraordinary Limiting Conditions | Text | "No Extraordinary Limiting Conditions..." | Or specific text |

---

## SECTION 4: PHOTOGRAPHS (Image Gallery)

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `photo_01` | Photo 1 | Image | "1101 - East Elevation" | Exterior view |
| `photo_01_caption` | Photo 1 Caption | Text | "1101 - East Elevation" | Description |
| `photo_02` | Photo 2 | Image | "1101 - West Elevation" | |
| `photo_02_caption` | Photo 2 Caption | Text | "1101 - West Elevation" | |
| `photo_03` | Photo 3 | Image | "Street View Facing East - 11 Ave" | |
| `photo_03_caption` | Photo 3 Caption | Text | "Street View Facing East - 11 Ave" | |
| `photo_04` | Photo 4 | Image | "Street View Facing North - 109 St" | |
| `photo_04_caption` | Photo 4 Caption | Text | "Street View Facing North - 109 St" | |
| `photo_05` | Photo 5 | Image | "1101 - Typical Hallway" | Interior common |
| `photo_05_caption` | Photo 5 Caption | Text | "1101 - Typical Hallway" | |
| `photo_06` | Photo 6 | Image | "1101 - Typical Stairway" | |
| `photo_06_caption` | Photo 6 Caption | Text | "1101 - Typical Stairway" | |
| `photo_07` | Photo 7 | Image | "1101 - Typical Bathroom" | Unit interior |
| `photo_07_caption` | Photo 7 Caption | Text | "1101 - Typical Bathroom" | |
| `photo_08` | Photo 8 | Image | "1101 - Typical Bedroom 1" | |
| `photo_08_caption` | Photo 8 Caption | Text | "1101 - Typical Bedroom 1" | |
| `photo_09` | Photo 9 | Image | "1101 - Typical Bedroom 2" | |
| `photo_09_caption` | Photo 9 Caption | Text | "1101 - Typical Bedroom 2" | |
| `photo_10` | Photo 10 | Image | "1101 - Electrical Room" | Building systems |
| `photo_10_caption` | Photo 10 Caption | Text | "1101 - Electrical Room" | |
| `photo_11` | Photo 11 | Image | "1101 - Mechanical Room" | |
| `photo_11_caption` | Photo 11 Caption | Text | "1101 - Mechanical Room" | |
| `photo_12` | Photo 12 | Image | "1101 - Typical Kitchen" | |
| `photo_12_caption` | Photo 12 Caption | Text | "1101 - Typical Kitchen" | |
| `photo_13` | Photo 13 | Image | "1101 - Living Room" | |
| `photo_13_caption` | Photo 13 Caption | Text | "1101 - Living Room" | |
| `photo_14` | Photo 14 | Image | "1121 - West Elevation" | Building 2 exterior |
| `photo_14_caption` | Photo 14 Caption | Text | "1121 - West Elevation" | |
| `photo_15` | Photo 15 | Image | "1121 - East Elevation" | |
| `photo_15_caption` | Photo 15 Caption | Text | "1121 - East Elevation" | |
| `photo_16` | Photo 16 | Image | "1121 - Typical Hallway" | |
| `photo_16_caption` | Photo 16 Caption | Text | "1121 - Typical Hallway" | |
| `photo_17` | Photo 17 | Image | "1121 - Typical Stairway" | |
| `photo_17_caption` | Photo 17 Caption | Text | "1121 - Typical Stairway" | |
| `photo_18` | Photo 18 | Image | "1121 - Typical Living Room" | |
| `photo_18_caption` | Photo 18 Caption | Text | "1121 - Typical Living Room" | |
| `photo_19` | Photo 19 | Image | "1121 - Typical Bathroom" | |
| `photo_19_caption` | Photo 19 Caption | Text | "1121 - Typical Bathroom" | |
| `photo_20` | Photo 20 | Image | "1121 - Typical Kitchen" | |
| `photo_20_caption` | Photo 20 Caption | Text | "1121 - Typical Kitchen" | |
| `photo_21` | Photo 21 | Image | "1121 - Typical Bedroom" | |
| `photo_21_caption` | Photo 21 Caption | Text | "1121 - Typical Bedroom" | |
| `photo_22` | Photo 22 | Image | "1121 - Laundry Room" | |
| `photo_22_caption` | Photo 22 Caption | Text | "1121 - Laundry Room" | |
| `photo_23` | Photo 23 | Image | "1121 - Electrical Room" | |
| `photo_23_caption` | Photo 23 Caption | Text | "1121 - Electrical Room" | |
| `photo_24` | Photo 24 | Image | "1121 - Typical Boiler" | |
| `photo_24_caption` | Photo 24 Caption | Text | "1121 - Typical Boiler" | |
| `photo_25` | Photo 25 | Image | "1121 - Utility Room" | |
| `photo_25_caption` | Photo 25 Caption | Text | "1121 - Utility Room" | |

**Note:** Photos are dynamic - count varies by property. System should support unlimited uploads.

---

## SECTION 5: MAPS (Location Context)

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `map_regional` | Regional Map | Image | (regional_context.png) | Province/city location |
| `map_local` | Local Area Map | Image | (local_area.png) | Neighbourhood context |
| `map_site` | Site Plan/Aerial | Image | (aerial_photo.png) | Property boundaries |
| `map_zoning` | Zoning Map | Image | (zoning_map.png) | Zoning overlay |
| `map_street` | Street View | Image | (street_view.png) | Property frontage |

**Note:** Map types vary - should support flexible image uploads with captions.

---

## SECTION 6: PROPERTY IDENTIFICATION & ASSIGNMENT

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `ident_propertyAddress` | Property Address | Text | "1101, 1121 109 St, North Battleford, SK" | Full address |
| `ident_propertyDescription` | Property Description | Text (multi-line) | "multi-family, walkup property with improvements..." | Narrative |
| `ident_numberOfBuildings` | Number of Buildings | Integer | 2 | |
| `ident_netRentableArea` | Net Rentable Area | Number (SF) | 10,204 | |
| `ident_yearBuilt` | Year Built | Integer | 1970 | |
| `ident_occupancyRate` | Occupancy Rate | Percentage | 100.0 | |
| `ident_numberOfUnits` | Number of Units | Integer | 16 | |
| `ident_buildingFormat` | Building Format | Text | "2-story, garden style" | |
| `ident_legalDescription` | Legal Description | Text | "Plan - C4240; Block - 95; Lot - 17,18, 19, 20" | From land title |
| `ident_authorizedClient` | Authorized Client | Text | "102109845 Saskatchewan Ltd." | |
| `ident_authorizedUse` | Authorized Use | Text | "first mortgage financing purposes" | Purpose of appraisal |
| `ident_authorizedUsers` | Authorized Users | Text | "102109845 Saskatchewan Ltd." | Who can rely on report |
| `ident_effectiveDate` | Effective Date of Value | Date | "October 17, 2025" | Valuation date |
| `ident_reportDate` | Report Date | Date | "November 20, 2025" | Report completion |
| `ident_inspectionDate` | Inspection Date | Date | "October 17, 2025" | Site visit date |
| `ident_purpose` | Purpose of Appraisal | Text (multi-line) | "The purpose of this assignment is to provide..." | Assignment scope |
| `ident_currentOwner` | Current Owner | Text | "102109845 Saskatchewan Ltd." | |
| `ident_salesHistory` | Three-Year Sales History | Text | "Ownership has not changed in the past three years..." | Transaction history |
| `ident_exposureTime` | Exposure Time | Text | "six months" | Marketing time estimate |
| `ident_propertyRights` | Property Rights Appraised | Text | "Fee Simple Interest" | Estate type |
| `ident_valueScenario` | Value Scenario | Text | "As Stabilized" | Current/Prospective |

---

## SECTION 7: SCOPE OF WORK & COMPLIANCE

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `scope_analysisCompleted` | Analyses Completed | Text (multi-line) | "Legal and physical features, market analysis..." | Bullet list |
| `scope_approachesUsed` | Valuation Approaches Used | Text | "Direct Comparison and Income (Direct Capitalization)" | |
| `scope_reportType` | Report Type | Text | "Appraisal Report" | CUSPAP classification |
| `scope_complianceStandard` | Compliance Standard | Text | "CUSPAP 2024" | Regulatory framework |
| `scope_assistanceProvided` | Assistance Provided | Text | "Paul Liboiron of Insight Home Inspections Ltd..." | Contributors |
| `scope_sourcesOfInfo` | Sources of Information | Text (multi-line) | List of data sources | |
| `scope_inspectionType` | Inspection Type | Text | "Full interior and exterior" | |
| `scope_personalProperty` | Personal Property Included | Boolean/Text | "No personal property (FF&E) included" | |

---

## SECTION 8: LOCATION ANALYSIS

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `location_overview` | Location Overview | Text (multi-line) | "Located in North Battleford, Saskatchewan, in a centrally..." | Narrative |
| `location_access` | Access | Text | "Fronts 109 Street with connections to Highway 4..." | Road access |
| `location_publicTransit` | Public Transportation | Text | "Local bus service on 100th Street and Territorial Drive..." | Transit access |
| `location_walkScore` | Walk Score | Integer | 60 | Walkability metric |
| `location_transitScore` | Transit Score | Integer | 35 | Transit accessibility |
| `location_bikeScore` | Bike Score | Integer | 55 | Cycling infrastructure |
| `location_localArea` | Local Area Description | Text (multi-line) | "Mature urban district with mix of single-family homes..." | Neighbourhood |
| `location_nearbySchools` | Nearby Schools | Text (multi-line) | "• Bready School (K–7)\n• Connaught School (K–7)..." | Schools list |

---

## SECTION 9: SITE DETAILS

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `site_totalArea` | Total Site Area | Number (SF) | 24,400 | |
| `site_acreage` | Site Area (Acres) | Number | 0.56 | |
| `site_address` | Site Address | Text | "1101, 1121 109 St, North Battleford, Saskatchewan" | |
| `site_adjacentNorth` | Adjacent North | Text | "Residential" | Surrounding uses |
| `site_adjacentSouth` | Adjacent South | Text | "Residential" | |
| `site_adjacentEast` | Adjacent East | Text | "Residential" | |
| `site_adjacentWest` | Adjacent West | Text | "Residential" | |
| `site_accessibility` | Accessibility | Text | "average overall" | |
| `site_exposureVisibility` | Exposure & Visibility | Text | "average noting frontage on 109 Street & 11 Avenue" | |
| `site_easements` | Easements | Text | "Assumed satisfactory unless noted" | Legal encumbrances |
| `site_soils` | Soils | Text | "Assumed suitable for development" | Geotechnical |
| `site_hazardousWaste` | Hazardous Waste | Text | "None present based on review" | Environmental |
| `site_rating` | Site Rating | Text | "average as a multi-family site" | Overall assessment |
| `site_conclusion` | Site Conclusion | Text (multi-line) | "Physical characteristics supportive of current use..." | Summary |
| `site_planImage_lot17` | Site Plan - Lot 17 | Image | (site_plan_lot17.png) | Survey/plot plan |
| `site_planImage_lot18` | Site Plan - Lot 18 | Image | (site_plan_lot18.png) | |

---

## SECTION 10: PROPERTY TAXES & ASSESSMENT

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `tax_assessmentYear` | Assessment Year | Integer | 2025 | Tax year |
| `tax_assessedValue` | Total Assessed Value | Currency | "$1,850,000" | Municipal assessment |
| `tax_landValue` | Land Assessed Value | Currency | "$450,000" | Land component |
| `tax_buildingValue` | Building Assessed Value | Currency | "$1,400,000" | Improvement value |
| `tax_annualTax` | Annual Property Tax | Currency | "$28,500" | Total tax bill |
| `tax_commentary` | Taxation Commentary | Text | "Assessed value below concluded value..." | Appraiser notes |

---

## SECTION 11: ZONING & LAND USE

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `zoning_classification` | Zoning Classification | Text | "Low Density Residential District (R2)" | Municipal zoning |
| `zoning_description` | Zoning Description | Text (multi-line) | Description of permitted uses | |
| `zoning_permittedUses` | Permitted Uses | Text | "Low and medium density residential" | Allowed uses |
| `zoning_conformance` | Conforming Use | Boolean/Text | "Legally conforming use" | Compliance status |
| `zoning_conclusion` | Zoning Conclusion | Text | "Current use is permitted, no change imminent" | |
| `zoning_mapImage` | Zoning Map | Image | (zoning_map.png) | Visual reference |

---

## SECTION 12: IMPROVEMENTS DESCRIPTION

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `improv_overview` | Overview | Text (multi-line) | "Multi-family walkup property, 2 buildings..." | Summary |
| `improv_numberOfBuildings` | Number of Buildings | Integer | 2 | |
| `improv_netRentableArea` | Net Rentable Area | Number (SF) | 10,204 | |
| `improv_yearBuilt` | Year Built | Integer | 1970 | |
| `improv_occupancyRate` | Occupancy Rate | Percentage | 100.0 | |
| `improv_numberOfUnits` | Number of Units | Integer | 16 | |
| `improv_numberOfStories` | Number of Stories | Integer | 2 | |
| `improv_buildingFormat` | Building Format | Text | "garden style" | Design type |
| `improv_projectAmenities` | Project Amenities | Text | "Guest Parking" | Common amenities |
| `improv_unitAmenities` | Unit Amenities | Text | "Deck/Patio, Range/Stove, Refrigerator" | In-unit features |
| `improv_laundry` | Laundry | Text | "On Site" | Laundry facilities |
| `improv_security` | Security Features | Text | "Deadbolts, Exterior Lighting, Secured Entry" | |
| `improv_foundation` | Foundation | Text | "Concrete footings and walls" | Structural |
| `improv_exteriorWalls` | Exterior Walls/Framing | Text | "1121 - Brick, 1101 Stucco/Wood frame" | Construction |
| `improv_roof` | Roof | Text | "Flat built up membrane" | Roof system |
| `improv_elevator` | Elevator | Text | "None" | Vertical transport |
| `improv_hvac` | Heating & AC (HVAC) | Text | "1101 - 8 Furnaces, 1121 - Boilers with baseboard" | Climate control |
| `improv_insulation` | Insulation | Text | "Fiberglass" | Thermal |
| `improv_lighting` | Lighting | Text | "Various" | Electrical fixtures |
| `improv_electrical` | Electrical | Text | "Individually metered" | Power system |
| `improv_interiorWalls` | Interior Walls | Text | "Painted drywall" | Finishes |
| `improv_doorsWindows` | Doors and Windows | Text | "Wood interior & metal exterior/Vinyl double pane" | Openings |
| `improv_ceilings` | Ceilings | Text | "Textured drywall" | Ceiling finish |
| `improv_plumbing` | Plumbing | Text | "Standard" | Plumbing system |
| `improv_flooring` | Floor Covering | Text | "Combination of carpet, tile, vinyl, laminate" | Floor finishes |
| `improv_fireProtection` | Fire Protection | Text | "None" | Fire safety |
| `improv_interiorFinish` | Interior Finish/Build-Out | Text | "Standard rental finishes" | |
| `improv_siteImprovements` | Site Improvements | Text | "Gravel parking, sidewalks, curbs" | Hardscape |
| `improv_landscaping` | Landscaping | Text | "Shrubs and trees around perimeter, well maintained" | Softscape |
| `improv_parkingSpaces` | Parking Spaces | Integer | 18 | Count |
| `improv_parkingRatio` | Parking Ratio | Number | 1.1 | Spaces per unit |
| `improv_siteCoverage` | Site Coverage Ratio | Percentage | 12.9 | Building footprint % |
| `improv_buildingFootprint` | Building Footprint | Number (SF) | 3,138 | Ground floor area |
| `improv_functionalDesign` | Functional Design | Text | "Functional Walkup design with adequate parking" | Design assessment |
| `improv_hazardousMaterials` | Hazardous Materials | Text | "Assumes free of hazardous waste, asbestos, mold" | Environmental |

---

## SECTION 13: MARKET CONTEXT

### Economic Overview - National

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `market_national_overview` | National Economic Overview | Text (multi-line) | "Canada's economy in 2025 finds itself..." | Macro context |
| `market_national_gdpGrowth` | GDP Growth Forecast | Percentage | 1.8 | Economic indicator |
| `market_national_inflation` | Inflation Rate | Percentage | 2.0 | Target rate |

### Economic Overview - Provincial

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `market_provincial_overview` | Provincial Overview | Text (multi-line) | "Saskatchewan's economy in 2025..." | Regional context |
| `market_provincial_unemployment` | Unemployment Rate | Percentage | "5.5-6%" | Labour market |

### Multifamily Market

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `market_multifamily_overview` | Multifamily Market Overview | Text (multi-line) | "Saskatchewan's rental markets entered 2025..." | Sector analysis |
| `market_multifamily_vacancyRate` | Market Vacancy Rate | Percentage | 3.0 | Supply indicator |
| `market_multifamily_rentTrend` | Rent Trend | Text | "Plateaued after 2023-24 gains" | Pricing trend |

---

## SECTION 14: HIGHEST & BEST USE ANALYSIS

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `hbu_introduction` | Introduction | Text (multi-line) | "The highest and best use of a property is defined as..." | Definition |
| `hbu_asVacant_legal` | As Vacant - Legally Permissible | Text | "R2 zoning permits low/medium density residential" | Legal constraints |
| `hbu_asVacant_physical` | As Vacant - Physically Possible | Text | "0.56 acres, rectangular, level topography..." | Physical factors |
| `hbu_asVacant_financial` | As Vacant - Financially Feasible | Text | "Multifamily building would likely be most profitable..." | Economic analysis |
| `hbu_asVacant_maxProductivity` | As Vacant - Maximally Productive | Text | "Multifamily development" | Optimal use |
| `hbu_asImproved` | Highest & Best Use As Improved | Text | "Continued use as multifamily walkup" | Current use analysis |
| `hbu_conclusion` | HBU Conclusion | Text | "The highest and best use... is continued multifamily..." | Final determination |

---

## SECTION 15: INCOME APPROACH (Values & Calculations)

### Potential Income

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `income_pgi` | Potential Gross Income (PGI) | Currency | "$192,000" | Maximum revenue |
| `income_vacancyRate` | Vacancy & Collection Loss Rate | Percentage | 5.0 | Market vacancy |
| `income_vacancyLoss` | Vacancy & Collection Loss | Currency | "$9,600" | Calculated loss |
| `income_egi` | Effective Gross Income (EGI) | Currency | "$182,400" | PGI - Vacancy |
| `income_otherIncome` | Other Income | Currency | "$2,400" | Parking, laundry, etc. |
| `income_totalGrossIncome` | Total Gross Income | Currency | "$184,800" | EGI + Other |

### Operating Expenses

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `expense_management` | Management Fees | Currency | "$9,240" | Usually 5% EGI |
| `expense_insurance` | Insurance | Currency | "$4,500" | Property insurance |
| `expense_propertyTax` | Property Taxes | Currency | "$28,500" | Municipal taxes |
| `expense_utilities` | Utilities | Currency | "$15,000" | Common area utilities |
| `expense_repairs` | Repairs & Maintenance | Currency | "$12,000" | Ongoing maintenance |
| `expense_janitorial` | Janitorial | Currency | "$3,600" | Cleaning services |
| `expense_landscaping` | Landscaping | Currency | "$2,400" | Grounds maintenance |
| `expense_professional` | Professional Fees | Currency | "$1,800" | Legal, accounting |
| `expense_reserves` | Replacement Reserves | Currency | "$5,000" | Capital reserves |
| `expense_other` | Other Expenses | Currency | "$2,000" | Miscellaneous |
| `expense_total` | Total Operating Expenses | Currency | "$84,040" | Sum of all expenses |

### Net Operating Income & Valuation

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `income_noi` | Net Operating Income (NOI) | Currency | "$100,760" | EGI - OpEx |
| `income_capRate` | Capitalization Rate | Percentage | 6.5 | Market cap rate |
| `income_valueIndication` | Income Approach Value | Currency | "$1,550,000" | NOI / Cap Rate |

### Market Rent Analysis (Comparables)

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `rentComp_01_name` | Rent Comp 1 - Property Name | Text | "Riverside Apartments" | |
| `rentComp_01_address` | Rent Comp 1 - Address | Text | "1234 Main St, North Battleford" | |
| `rentComp_01_unitType` | Rent Comp 1 - Unit Type | Text | "2BR/1BA" | |
| `rentComp_01_rent` | Rent Comp 1 - Rent/Month | Currency | "$950" | |
| `rentComp_01_rentPerSF` | Rent Comp 1 - Rent/SF | Currency | "$1.25" | |
| `rentComp_01_yearBuilt` | Rent Comp 1 - Year Built | Integer | 1975 | |
| `rentComp_01_distance` | Rent Comp 1 - Distance | Text | "0.8 km" | |

**Note:** Repeat pattern for Rent Comp 2, 3, 4, 5 (typically 3-5 comparables)

---

## SECTION 16: SALES COMPARISON APPROACH

### Subject Property Summary

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `subject_numberOfUnits` | Subject - Number of Units | Integer | 16 | |
| `subject_gba` | Subject - Gross Building Area | Number (SF) | 10,204 | |
| `subject_yearBuilt` | Subject - Year Built | Integer | 1970 | |
| `subject_siteArea` | Subject - Site Area | Number (SF) | 24,400 | |
| `subject_parkingRatio` | Subject - Parking Ratio | Number | 1.1 | Spaces/unit |
| `subject_condition` | Subject - Condition | Text | "Average" | Physical condition |

### Comparable Sales

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `saleComp_01_name` | Sale Comp 1 - Property Name | Text | "Parkview Apartments" | |
| `saleComp_01_address` | Sale Comp 1 - Address | Text | "456 Oak St, North Battleford" | |
| `saleComp_01_saleDate` | Sale Comp 1 - Sale Date | Date | "2024-08-15" | Transaction date |
| `saleComp_01_salePrice` | Sale Comp 1 - Sale Price | Currency | "$2,100,000" | Total price |
| `saleComp_01_pricePerUnit` | Sale Comp 1 - Price/Unit | Currency | "$131,250" | Per unit |
| `saleComp_01_pricePerSF` | Sale Comp 1 - Price/SF | Currency | "$206" | Per square foot |
| `saleComp_01_numberOfUnits` | Sale Comp 1 - Number of Units | Integer | 16 | |
| `saleComp_01_gba` | Sale Comp 1 - GBA | Number (SF) | 10,200 | |
| `saleComp_01_yearBuilt` | Sale Comp 1 - Year Built | Integer | 1968 | |
| `saleComp_01_siteArea` | Sale Comp 1 - Site Area | Number (SF) | 22,000 | |
| `saleComp_01_capRate` | Sale Comp 1 - Cap Rate | Percentage | 6.8 | |
| `saleComp_01_adj_location` | Sale Comp 1 - Location Adjustment | Percentage | 0 | % adjustment |
| `saleComp_01_adj_size` | Sale Comp 1 - Size Adjustment | Percentage | 0 | |
| `saleComp_01_adj_age` | Sale Comp 1 - Age Adjustment | Percentage | -2 | |
| `saleComp_01_adj_condition` | Sale Comp 1 - Condition Adjustment | Percentage | 0 | |
| `saleComp_01_adj_parking` | Sale Comp 1 - Parking Adjustment | Percentage | +3 | |
| `saleComp_01_adj_total` | Sale Comp 1 - Total Adjustment | Percentage | +1 | Net adjustment |
| `saleComp_01_adjustedPrice` | Sale Comp 1 - Adjusted Price | Currency | "$2,121,000" | After adjustments |

**Note:** Repeat pattern for Sale Comp 2, 3, 4, 5 (typically 3-5 comparables)

### Sales Comparison Value

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `salesComp_valueIndication` | Sales Comparison Value Indication | Currency | "$2,150,000" | Reconciled value |
| `salesComp_adjustmentSummary` | Adjustment Summary | Text (multi-line) | "Adjustments ranged from -2% to +5%..." | Analysis narrative |

---

## SECTION 17: RECONCILIATION & FINAL VALUE

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `recon_incomeValue` | Income Approach Value | Currency | "$1,550,000" | From Section 15 |
| `recon_salesValue` | Sales Comparison Value | Currency | "$2,150,000" | From Section 16 |
| `recon_costValue` | Cost Approach Value | Currency | "$1,800,000" | If applicable |
| `recon_incomeWeight` | Income Approach Weight | Percentage | 60 | Reconciliation weight |
| `recon_salesWeight` | Sales Comparison Weight | Percentage | 40 | |
| `recon_costWeight` | Cost Approach Weight | Percentage | 0 | |
| `recon_narrative` | Reconciliation Narrative | Text (multi-line) | "Greatest weight placed on income approach..." | Reasoning |
| `recon_finalValue` | Final Value Conclusion | Currency | "$1,800,000" | **FINAL VALUE** |
| `recon_valuePremise` | Value Premise | Text | "As Stabilized" | Type of value |
| `recon_effectiveDate` | Effective Date | Date | "October 17, 2025" | Value as of date |
| `recon_roundedValue` | Rounded Final Value | Currency | "$1,800,000" | May be rounded |

---

## SECTION 18: CERTIFICATION

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `cert_appraiserName` | Appraiser Name | Text | "Chris Chornohos" | Signing appraiser |
| `cert_appraiserDesignation` | Professional Designation | Text | "AACI, MRICS" | Credentials |
| `cert_appraiserLicense` | License Number | Text | "AIC No: 902097" | Professional ID |
| `cert_companyName` | Company Name | Text | "Valta Property Valuations Ltd." | Firm name |
| `cert_signatureImage` | Signature Image | Image | (signature.png) | Digital signature |
| `cert_signatureDate` | Signature Date | Date | "November 20, 2025" | Certification date |
| `cert_statementText` | Certification Statement | Text (multi-line) | "I certify that, to the best of my knowledge..." | Standard language |

---

## SECTION 19: APPENDICES

### Contingent & Limiting Conditions

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `appendix_conditions` | Limiting Conditions | Text (multi-line) | Standard limiting conditions text | Legal disclaimers |

### Definition of Terms

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `appendix_definitions` | Definitions | Text (multi-line) | "Market Value: The most probable price..." | Glossary (20+ pages) |

### Appraiser Qualifications

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `appendix_qualifications` | Appraiser Qualifications | Text (multi-line) | Education, experience, designations | Resume/CV |

### Supporting Documents

| Field ID | Field Name | Type | Example Value | Notes |
|----------|-----------|------|---------------|-------|
| `appendix_titleCertificate` | Land Title Certificate | PDF | (title_cert.pdf) | Legal document |
| `appendix_surveyReport` | Survey/RPR | PDF | (survey.pdf) | Property survey |
| `appendix_taxNotice` | Tax Assessment Notice | PDF | (tax_notice.pdf) | Municipal tax |
| `appendix_additionalDocs` | Additional Documents | PDF[] | Multiple files | Flexible uploads |

---

## FIELD COUNT SUMMARY

| Section | Field Count |
|---------|-------------|
| 1. Cover Page & Identification | 17 |
| 2. Letter of Transmittal | 18 |
| 3. Executive Summary | 11 |
| 4. Photographs | 50+ (25 photos × 2 fields) |
| 5. Maps | 5 |
| 6. Property Identification | 19 |
| 7. Scope of Work | 8 |
| 8. Location Analysis | 8 |
| 9. Site Details | 15 |
| 10. Property Taxes | 6 |
| 11. Zoning & Land Use | 6 |
| 12. Improvements Description | 42 |
| 13. Market Context | 7 |
| 14. Highest & Best Use | 7 |
| 15. Income Approach | 40+ (includes rent comps) |
| 16. Sales Comparison | 50+ (includes sale comps) |
| 17. Reconciliation | 10 |
| 18. Certification | 7 |
| 19. Appendices | 4+ |
| **TOTAL** | **330+ fields** |

---

## FIELD TYPE DISTRIBUTION

| Field Type | Count | Percentage |
|------------|-------|------------|
| Text (single line) | ~120 | 36% |
| Text (multi-line/narrative) | ~80 | 24% |
| Currency | ~50 | 15% |
| Number | ~30 | 9% |
| Image | ~30 | 9% |
| Date | ~12 | 4% |
| Percentage | ~8 | 2% |
| Boolean | ~5 | 2% |

---

## DATA SOURCE BREAKDOWN

| Data Source | Field Count | Examples |
|-------------|-------------|----------|
| **Valcre (green cells)** | ~80 fields | Property address, client info, GBA, units, year built |
| **Excel calculations (output)** | ~20 fields | NOI, cap rate, value indications, adjusted prices |
| **Manual entry (yellow cells)** | ~150 fields | Comps data, expenses, narrative text |
| **Image uploads** | ~30 fields | Photos, maps, supporting docs |
| **Template defaults** | ~50 fields | Definitions, certifications, limiting conditions |

---

## NOTES ON FIELD MAPPING

### Template Fields (Pre-written Text)
- Definitions section (~20 pages) - STATIC template text
- Certification statement - STATIC with appraiser name/date inserted
- Limiting conditions - STATIC legal language
- Methodology sections - MOSTLY static with minor customization

### Calculated Fields
- NOI = EGI - Total Operating Expenses
- Value Indication (Income) = NOI / Cap Rate
- Adjusted Sale Price = Sale Price × (1 + Total Adjustment %)
- Final Value = Weighted average of approach values

### Repeating Field Patterns
- **Photos:** Dynamic count (typically 20-30)
- **Rent Comparables:** 3-5 comps × 7 fields each = 21-35 fields
- **Sale Comparables:** 3-5 comps × 18 fields each = 54-90 fields

### Image/Document Fields
- All images should support captions
- PDFs should be embedable in appendix
- Maps should support highlighting/markup

---

**Last Updated:** November 22, 2025
**Based On:** VAL251012 - North Battleford Apartments (Actual Report)
**Total Fields Identified:** 330+
**Ready for:** APR Dashboard integration planning
