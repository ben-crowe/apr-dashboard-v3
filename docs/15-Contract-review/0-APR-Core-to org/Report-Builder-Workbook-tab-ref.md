# Report Builder Reference Valcre Workbook Setup
NOTE all field ID's are Valcre and if going to use this structure for the APR Report Builder make sure
to convert each id to correct field id from the master registry file. 

This was examined for UX purposes to fully undersand how apprasers are currently using the workbook to understand 
how they are using the workbook to create reports to then decide if we will adopt this format in our digical version report builder.  

---

## TAB STRUCTURE

| Tab | Subsections |
|-----|-------------|
| **1. Home** | Setup, Firm, Client, Appraisers, Dates, Valuation Scenarios, Conditions, Occupancy |
| **2. Introduction & Executive Summary** | Property Overview, Photographs, Maps, Identification of Assignment |
| **3. Property Analysis** | Location, Site Details, Taxes & Assessment, Land Use & Planning, Improvements |
| **4. Market Context** | Economic, Market Overview,HBU, Methodology, 3 Approach, Cert |
| **5. Appendices** | Limiting Conditions, Definitions, Qualifications |

---

---

# TAB 1: HOME

*Central data hub - fields used across multiple pages*

---

## 1.1 SETUP
*11 fields*

- **Job ID** | VAL251031 | `job_id` | lookup
- **Property Type** | Multi-Family | `property_type` | dropdown
- **Property Subtype** | Apartment MURB | `property_subtype` | dropdown
- **Valuation Type** | Current | `valuation_type` | dropdown
- **# Rental Units** | 48 | `rental_units` | number
- **Occupancy Status** | Multi-Tenant | `occupancy_status` | dropdown
- **Property Description Prefix** | The subject property is a 48-unit apartment building | `property_description_prefix` | textarea
- **Timeframe** | CURRENT | `timeframe` | dropdown
- **Use Stabilization Tool** | Yes | `use_stabilization` | toggle
- **Select Workbook** | Direct Comparison and Income | `select_workbook` | dropdown
- **Select Modules** | DC, Income | `select_modules` | multi-select

---

## 1.2 APPROACH TOGGLES
*8 fields*

- **Use Site & Land DC** | No | `use_land_dc` | toggle
- **Use Cost Approach** | No | `use_cost` | toggle
- **Use Direct Comparison** | Yes | `use_direct_comparison` | toggle
- **Use Multi-DC** | No | `use_multi_dc` | toggle
- **Sale/Lease Config** | $/Unit | `sale_lease_config` | dropdown
- **Use Income Approach** | Yes | `use_income` | toggle
- **Use DCF** | No | `use_dcf` | toggle
- **Use Special/Hotel** | No | `use_special` | toggle

---

## 1.3 APPRAISAL FIRM
*6 fields*

- **Company Name** | Valta Property Valuations Ltd. | `company_name` | text
- **Company Address** | 301, 4838 Richard Road SW | `company_address` | text
- **City, Province** | Calgary, AB T3E 6L1 | `company_city_province` | text
- **Phone** | 403-800-9747 | `company_phone` | text
- **Report Type** | Appraisal Report | `report_type` | dropdown
- **Appraisal Status** | Fully Detailed | `appraisal_status` | dropdown

---

## 1.4 CLIENT
*7 fields*

- **Client Name (legal)** | Investment Co Sager | `client_name_legal` | text
- **Company Name** | 12374946 Saskatchewan Ltd. | `client_company` | text
- **Contact** | Brad Blake | `client_contact` | text
- **Email** | brad@saskltd.com | `client_email` | text
- **Address** | 1631 Main - 6th Ave SE, Calgary | `client_address` | text
- **Attention Line** | att'n Brad Blake | `client_attention` | text
- **Salutation** | Dear Mr. Blake | `client_salutation` | text

---

## 1.5 APPRAISERS

### Primary Appraiser
*13 fields*

- **Name** | J. Michael Fershin | `appraiser1_name` | text
- **Credentials** | AACI, MRICS | `appraiser1_credentials` | text
- **Role** | Primary Appraiser | `appraiser1_role` | dropdown
- **Title** | Partner | `appraiser1_title` | text
- **Phone** | 587-891-5712 | `appraiser1_phone` | text
- **Email** | chris.fershin@valtapv.ca | `appraiser1_email` | text
- **Inspector?** | Yes | `appraiser1_inspector` | toggle
- **Date Inspected** | 2025-10-17 | `appraiser1_inspection_date` | date
- **License Number** | A-12345 | `appraiser1_license` | text
- **License Expiry** | 2026-12-31 | `appraiser1_license_expiry` | date
- **CE Completed** | Yes | `appraiser1_ce` | toggle
- **Ethics Completed** | Yes | `appraiser1_ethics` | toggle
- **Signature** | (image) | `appraiser1_signature` | file

### Secondary Appraiser
*8 fields*

- **Name** | Sarah Johnson | `appraiser2_name` | text
- **Credentials** | AACI | `appraiser2_credentials` | text
- **Role** | Co-Appraiser | `appraiser2_role` | dropdown
- **Title** | Senior Director | `appraiser2_title` | text
- **Phone** | 587-891-5713 | `appraiser2_phone` | text
- **Email** | sarah.johnson@valtapv.ca | `appraiser2_email` | text
- **Inspector?** | No | `appraiser2_inspector` | toggle
- **Date Inspected** | — | `appraiser2_inspection_date` | date

### Assistance
*2 fields*

- **Assistance Provided** | No one provided significant real property appraisal assistance... | `assistance_provided` | textarea
- **Assistant Name** | None | `assistant_name` | text

---

## 1.6 DATES
*4 fields*

- **Letter Date** | 2025-12-26 | `letter_date` | date
- **Inspection Date** | 2025-10-17 | `inspection_date` | date
- **Report Date** | 2025-12-26 | `report_date` | date
- **Effective Date** | 2025-10-17 | `effective_date` | date

---

## 1.7 VALUATION SCENARIOS
*3 fields*

- **Scenario Name** | As Stabilized | `scenario_name` | dropdown
- **Property Rights** | Fee Simple Estate | `property_rights` | dropdown
- **Value Component** | Real Property | `value_component` | dropdown

---

## 1.8 SUBJECT PROPERTY
*15 fields*

- **Property Name** | North Battleford Apartments | `property_name` | text
- **Street Address** | 1521 100th Street | `street_address` | text
- **City** | North Battleford | `city` | text
- **Province** | Saskatchewan | `province` | dropdown
- **Postal Code** | S9A2W9 | `postal_code` | text
- **Country** | Canada | `country` | dropdown
- **Latitude** | 52.7599945 | `latitude` | text
- **Longitude** | -108.2801917 | `longitude` | text
- **GET GEOCODE** | (button) | `get_geocode` | button
- **Parcel ID** | 123456789 | `parcel_id` | text
- **Legal Description** | Lot 1, Block 2, Plan 101234567... | `legal_description` | textarea
- **Adjacent North** | Residential | `adjacent_north` | dropdown
- **Adjacent South** | Residential | `adjacent_south` | dropdown
- **Adjacent East** | Residential | `adjacent_east` | dropdown
- **Adjacent West** | Residential | `adjacent_west` | dropdown

---

## 1.9 QUALITATIVE
*7 fields*

- **Site Appeal** | Average | `site_appeal` | dropdown
- **Site Exposure** | Average | `site_exposure` | dropdown
- **Site Utility** | Average | `site_utility` | dropdown
- **Building Quality** | Average | `building_quality` | dropdown
- **Building Appeal** | Average | `building_appeal` | dropdown
- **Building Condition** | Average | `building_condition` | dropdown
- **Building Function** | Average | `building_function` | dropdown

---

## 1.10 TRANSACTION HISTORY
*7 fields*

- **Current Owner** | 12374946 Saskatchewan Ltd. | `current_owner` | text
- **Owner Address** | 1631 Main - 6th Ave SE | `owner_address` | text
- **Prior Owner** | ABC Holdings Inc. | `prior_owner` | text
- **Last Purchase Price** | $3,200,000 | `last_purchase_price` | currency
- **Deed Type** | Warranty | `deed_type` | dropdown
- **Ownership History** | The subject property is currently under the ownership of... | `ownership_history` | textarea
- **Sales History** | Based on our research the subject property has no changes... | `sales_history` | textarea

---

## 1.11 CONDITIONS

### Extraordinary Assumptions
*5 fields*

- **EA 1** | (blank) | `ea_1` | textarea
- **EA 2** | (blank) | `ea_2` | textarea
- **EA 3** | (blank) | `ea_3` | textarea
- **EA 4** | (blank) | `ea_4` | textarea
- **EA Default** | No Extraordinary Assumptions were made for this assignment. | `ea_default` | auto

### Hypothetical Conditions
*5 fields*

- **HC 1** | The As Stabilized value has been determined based on... | `hc_1` | textarea
- **HC 2** | (blank) | `hc_2` | textarea
- **HC 3** | (blank) | `hc_3` | textarea
- **HC 4** | (blank) | `hc_4` | textarea
- **HC Default** | No Hypothetical Conditions were made for this assignment. | `hc_default` | auto

### Limiting Conditions
*4 fields*

- **ELC 1** | (blank) | `elc_1` | textarea
- **ELC 2** | (blank) | `elc_2` | textarea
- **ELC 3** | (blank) | `elc_3` | textarea
- **ELC Default** | No Extraordinary Limiting Conditions were made for this assignment. | `elc_default` | auto

---

## 1.12 OCCUPANCY
*4 fields*

- **Occupancy %** | 100.0% | `occupancy_percent` | percent
- **Stabilized Occupancy** | 95.0% | `stabilized_occupancy` | percent
- **Stabilized Vacancy** | 5.0% | `stabilized_vacancy` | percent
- **Market Vacancy** | 5.0% | `market_vacancy` | percent

---

### HOME TAB TOTAL: 114 fields

---

---

# TAB 2: INTRODUCTION & EXECUTIVE SUMMARY

---

## 2.1 PROPERTY OVERVIEW
*12 fields*

### From Home Tab (linked)
- `property_name`, `street_address`, `city`, `province`, `effective_date`
- `scenario_name`, `property_rights`, `current_owner`, `occupancy_percent`

### Section-Specific

- **Property Overview Narrative** | The subject property is a well-maintained 48-unit... | `overview_narrative` | textarea
- **Year Built** | 2008 | `year_built` | number
- **Number of Units** | 48 | `number_of_units` | number
- **Number of Stories** | 4 | `number_of_stories` | number
- **GBA** | 52,000 | `gba` | number
- **NRA** | 48,000 | `nra` | number
- **Site Area** | 1.25 acres | `site_area` | text
- **Parking Spaces** | 60 | `parking_spaces` | number
- **Indicated Value - SCA** | $8,500,000 | `value_sca` | currency
- **Indicated Value - Income** | $8,750,000 | `value_income` | currency
- **Final Value** | $8,600,000 | `final_value` | currency
- **Value Per Unit** | $179,167 | `value_per_unit` | currency

---

## 2.2 PHOTOGRAPHS
*12 fields*

- **Exterior Photo 1** | (image) | `photo_exterior_1` | file
- **Exterior Photo 1 Caption** | Front elevation | `photo_exterior_1_cap` | text
- **Exterior Photo 2** | (image) | `photo_exterior_2` | file
- **Exterior Photo 2 Caption** | Rear elevation | `photo_exterior_2_cap` | text
- **Exterior Photo 3** | (image) | `photo_exterior_3` | file
- **Exterior Photo 3 Caption** | Parking area | `photo_exterior_3_cap` | text
- **Interior Photo 1** | (image) | `photo_interior_1` | file
- **Interior Photo 1 Caption** | Typical unit - living | `photo_interior_1_cap` | text
- **Interior Photo 2** | (image) | `photo_interior_2` | file
- **Interior Photo 2 Caption** | Typical unit - kitchen | `photo_interior_2_cap` | text
- **Interior Photo 3** | (image) | `photo_interior_3` | file
- **Interior Photo 3 Caption** | Common area | `photo_interior_3_cap` | text

---

## 2.3 MAPS
*6 fields*

- **Location Map** | (image) | `map_location` | file
- **Location Map Caption** | Regional location | `map_location_cap` | text
- **Aerial Map** | (image) | `map_aerial` | file
- **Aerial Map Caption** | Aerial view | `map_aerial_cap` | text
- **Neighborhood Map** | (image) | `map_neighborhood` | file
- **Neighborhood Map Caption** | Surrounding area | `map_neighborhood_cap` | text

---

## 2.4 IDENTIFICATION OF ASSIGNMENT
*14 fields*

### From Home Tab (linked)
- `client_name_legal`, `client_company`, `report_type`, `scenario_name`
- `property_rights`, `effective_date`, `inspection_date`, `report_date`

### Section-Specific

- **Purpose of Appraisal** | To estimate market value | `purpose` | text
- **Intended Use** | Mortgage financing | `intended_use` | text
- **Intended Users** | Client and intended lender | `intended_users` | text
- **Definition of Value** | Market Value as defined by CUSPAP... | `value_definition` | textarea
- **Scope of Work** | The scope of work includes inspection... | `scope_of_work` | textarea
- **Exposure Time** | 3-6 months | `exposure_time` | text
- **Marketing Time** | 3-6 months | `marketing_time` | text
- **Interest Appraised** | Fee Simple | `interest_appraised` | text
- **Personal Property** | None included | `personal_property` | text
- **FF&E** | None included | `ffe` | text
- **Competency** | The appraisers are competent to complete this assignment... | `competency` | textarea
- **Prior Services** | No prior services within 3 years | `prior_services` | textarea
- **Jurisdictional Exception** | None | `jurisdictional_exception` | text
- **Hypothetical/EA Reference** | See Conditions section | `conditions_reference` | text

---

### TAB 2 TOTAL: 44 fields

---

---

# TAB 3: PROPERTY ANALYSIS

---

## 3.1 LOCATION
*10 fields*

### From Home Tab (linked)
- `property_name`, `street_address`, `city`, `province`, `postal_code`
- `latitude`, `longitude`, `adjacent_north/south/east/west`

### Section-Specific

- **Location Description** | The subject is located in the northwest quadrant... | `location_description` | textarea
- **Neighborhood Description** | The surrounding area is characterized by... | `neighborhood_description` | textarea
- **Access** | Access is provided via 100th Street | `access` | text
- **Visibility** | Good | `visibility` | dropdown
- **Proximity to Amenities** | Shopping, schools, transit within 1 km | `proximity_amenities` | textarea
- **Street Photo** | (image) | `photo_street` | file
- **Neighborhood Photo 1** | (image) | `photo_neighborhood_1` | file
- **Neighborhood Photo 2** | (image) | `photo_neighborhood_2` | file
- **Location Positives** | Good access, established neighborhood... | `location_positives` | textarea
- **Location Negatives** | Limited transit options... | `location_negatives` | textarea

---

## 3.2 SITE DETAILS
*20 fields*

### From Home Tab (linked)
- `site_appeal`, `site_exposure`, `site_utility`

### Section-Specific

- **Site Area Acres** | 1.25 | `site_acres` | number
- **Site Area SF** | 54,450 | `site_sf` | number
- **Frontage** | 250 ft | `frontage` | number
- **Depth** | 218 ft | `depth` | number
- **Shape** | Rectangular | `shape` | dropdown
- **Topography** | Level | `topography` | dropdown
- **Drainage** | Adequate | `drainage` | dropdown
- **Soil Conditions** | Assumed adequate | `soil_conditions` | text
- **Environmental** | No known issues | `environmental` | textarea
- **Flood Zone** | Zone X - Minimal risk | `flood_zone` | text
- **Flood Map Number** | 48201C0205F | `flood_map_number` | text
- **Utilities - Water** | Municipal | `util_water` | dropdown
- **Utilities - Sewer** | Municipal | `util_sewer` | dropdown
- **Utilities - Electric** | EPCOR | `util_electric` | text
- **Utilities - Gas** | ATCO | `util_gas` | text
- **Site Improvements** | Asphalt parking, concrete walks, landscaping | `site_improvements` | textarea
- **Easements/Encroachments** | None noted | `easements` | textarea
- **Site Photo 1** | (image) | `photo_site_1` | file
- **Site Photo 2** | (image) | `photo_site_2` | file
- **Site Comments** | The site is adequate for the improvements... | `site_comments` | textarea

---

## 3.3 PROPERTY TAXES & ASSESSMENT
*10 fields*

- **Assessment Year** | 2025 | `assessment_year` | number
- **Assessed Value - Land** | $500,000 | `assessed_land` | currency
- **Assessed Value - Improvements** | $4,500,000 | `assessed_improvements` | currency
- **Total Assessed Value** | $5,000,000 | `assessed_total` | currency
- **Mill Rate** | 0.0185 | `mill_rate` | number
- **Annual Taxes** | $92,500 | `annual_taxes` | currency
- **Tax Status** | Current | `tax_status` | dropdown
- **Assessment Trend** | Stable | `assessment_trend` | dropdown
- **Tax Document** | (file) | `tax_document` | file
- **Tax Comments** | Taxes are considered typical for the area... | `tax_comments` | textarea

---

## 3.4 LAND USE & PLANNING
*12 fields*

- **Zoning Code** | MC-2 | `zoning_code` | text
- **Zoning Description** | Medium Density Commercial | `zoning_desc` | text
- **Permitted Uses** | Multi-family, commercial, mixed-use | `permitted_uses` | textarea
- **Zoning Compliance** | Legal conforming | `zoning_compliance` | dropdown
- **Setbacks - Front** | 25 ft | `setback_front` | text
- **Setbacks - Side** | 10 ft | `setback_side` | text
- **Setbacks - Rear** | 20 ft | `setback_rear` | text
- **Max Height** | 45 ft | `max_height` | text
- **Max Density** | 40 units/acre | `max_density` | text
- **Parking Required** | 1.5/unit | `parking_required` | text
- **Zoning Map** | (image) | `zoning_map` | file
- **Zoning Comments** | The subject complies with all zoning requirements... | `zoning_comments` | textarea

---

## 3.5 DESCRIPTION OF THE IMPROVEMENTS
*30 fields*

### From Home Tab (linked)
- `building_quality`, `building_appeal`, `building_condition`, `building_function`

### General
*10 fields*

- **Year Built** | 2008 | `bldg_year_built` | number
- **Effective Age** | 12 | `effective_age` | number
- **Economic Life** | 50 | `economic_life` | number
- **Remaining Life** | 38 | `remaining_life` | number
- **Number of Buildings** | 1 | `num_buildings` | number
- **Number of Stories** | 4 | `num_stories` | number
- **Number of Units** | 48 | `num_units` | number
- **GBA** | 52,000 | `bldg_gba` | number
- **NRA** | 48,000 | `bldg_nra` | number
- **Building Class** | B | `building_class` | dropdown

### Construction
*10 fields*

- **Construction Type** | Wood frame | `construction_type` | dropdown
- **Foundation** | Concrete | `foundation` | dropdown
- **Framing** | Wood | `framing` | dropdown
- **Exterior Walls** | Stucco/Hardie | `exterior_walls` | text
- **Roof Type** | Flat | `roof_type` | dropdown
- **Roof Cover** | Membrane | `roof_cover` | dropdown
- **Windows** | Double-pane vinyl | `windows` | text
- **HVAC** | In-suite forced air | `hvac` | text
- **Electrical** | 200 amp per unit | `electrical` | text
- **Plumbing** | Copper/PEX | `plumbing` | text

### Interior & Amenities
*10 fields*

- **Interior Finish** | Drywall, carpet, LVP | `interior_finish` | text
- **Unit Finishes** | Standard rental grade | `unit_finishes` | textarea
- **Common Areas** | Lobby, hallways, fitness | `common_areas` | textarea
- **Amenities** | Fitness center, storage, laundry | `amenities` | textarea
- **Parking Type** | Surface | `parking_type` | dropdown
- **Parking Spaces** | 60 | `bldg_parking` | number
- **Parking Ratio** | 1.25/unit | `parking_ratio` | text
- **Deferred Maintenance** | None observed | `deferred_maintenance` | textarea
- **Functional Issues** | None observed | `functional_issues` | textarea
- **Building Comments** | The improvements are well-maintained... | `building_comments` | textarea

### Building Photos
*4 fields*

- **Building Photo 1** | (image) | `photo_bldg_1` | file
- **Building Photo 2** | (image) | `photo_bldg_2` | file
- **Building Photo 3** | (image) | `photo_bldg_3` | file
- **Building Photo 4** | (image) | `photo_bldg_4` | file

---

### TAB 3 TOTAL: 82 fields

---

---

# TAB 4: MARKET CONTEXT

---

## 4.1 ECONOMIC OVERVIEWS
*10 fields*

- **Economic Overview** | The regional economy is driven by... | `economic_overview` | textarea
- **Population** | 125,000 | `population` | number
- **Population Growth** | 1.2% annually | `population_growth` | text
- **Employment Rate** | 94.5% | `employment_rate` | percent
- **Major Employers** | Healthcare, government, retail | `major_employers` | textarea
- **Economic Drivers** | Agriculture, energy, services | `economic_drivers` | textarea
- **Economic Outlook** | Stable | `economic_outlook` | dropdown
- **Economic Risks** | Commodity price volatility | `economic_risks` | textarea
- **Economic Chart** | (image) | `economic_chart` | file
- **Economic Comments** | The local economy supports stable demand... | `economic_comments` | textarea

---

## 4.2 MULTI-FAMILY MARKET OVERVIEW
*14 fields*

- **Market Overview** | The multi-family market in North Battleford... | `market_overview` | textarea
- **Supply Analysis** | Current inventory consists of approximately... | `supply_analysis` | textarea
- **Demand Analysis** | Demand is driven by population growth... | `demand_analysis` | textarea
- **Vacancy Trends** | Vacancy has remained stable at 5-6%... | `vacancy_trends` | textarea
- **Rent Trends** | Average rents have increased 3% annually... | `rent_trends` | textarea
- **New Construction** | Limited new supply expected... | `new_construction` | textarea
- **Market Vacancy Rate** | 5.2% | `market_vacancy_rate` | percent
- **Avg Market Rent - 1BR** | $950 | `market_rent_1br` | currency
- **Avg Market Rent - 2BR** | $1,150 | `market_rent_2br` | currency
- **Avg Market Rent - 3BR** | $1,350 | `market_rent_3br` | currency
- **Cap Rate Range Low** | 5.50% | `cap_rate_low` | percent
- **Cap Rate Range High** | 6.50% | `cap_rate_high` | percent
- **Market Outlook** | Stable to improving | `market_outlook` | textarea
- **Market Chart** | (image) | `market_chart` | file

---

## 4.3 HIGHEST & BEST USE
*10 fields*

- **Legally Permissible** | The current use is legally permissible... | `hbu_legal` | textarea
- **Physically Possible** | The site is physically capable of... | `hbu_physical` | textarea
- **Financially Feasible** | Given current market conditions... | `hbu_feasible` | textarea
- **Maximally Productive** | The maximally productive use is... | `hbu_productive` | textarea
- **HBU As Vacant** | Multi-family development | `hbu_vacant` | text
- **HBU As Improved** | Continued multi-family use | `hbu_improved` | text
- **Interim Use** | N/A | `hbu_interim` | text
- **Alternative Uses** | Retail, office, redevelopment | `hbu_alternatives` | textarea
- **HBU Conclusion** | The highest and best use is continued... | `hbu_conclusion` | textarea
- **HBU Comments** | The current use represents the HBU... | `hbu_comments` | textarea

---

## 4.4 VALUATION METHODOLOGY
*6 fields*

- **Approaches Considered** | Cost, Sales Comparison, Income | `approaches_considered` | text
- **Approaches Applied** | Sales Comparison, Income | `approaches_applied` | text
- **Cost Approach Rationale** | Not applied due to age of improvements... | `cost_rationale` | textarea
- **SCA Rationale** | Applied as market participants consider sales... | `sca_rationale` | textarea
- **Income Rationale** | Primary approach as income-producing property... | `income_rationale` | textarea
- **Methodology Comments** | The income approach is given primary weight... | `methodology_comments` | textarea

---

## 4.5 INCOME APPROACH

### 4.5.1 Rent Roll / Unit Mix
*24 fields (6 unit types × 4 fields)*

- **Unit Type 1 Name** | 1BR/1BA | `unit1_type` | text
- **Unit Type 1 Count** | 12 | `unit1_count` | number
- **Unit Type 1 SF** | 650 | `unit1_sf` | number
- **Unit Type 1 Rent** | $950 | `unit1_rent` | currency

- **Unit Type 2 Name** | 2BR/1BA | `unit2_type` | text
- **Unit Type 2 Count** | 24 | `unit2_count` | number
- **Unit Type 2 SF** | 850 | `unit2_sf` | number
- **Unit Type 2 Rent** | $1,150 | `unit2_rent` | currency

- **Unit Type 3 Name** | 2BR/2BA | `unit3_type` | text
- **Unit Type 3 Count** | 8 | `unit3_count` | number
- **Unit Type 3 SF** | 950 | `unit3_sf` | number
- **Unit Type 3 Rent** | $1,250 | `unit3_rent` | currency

- **Unit Type 4 Name** | 3BR/2BA | `unit4_type` | text
- **Unit Type 4 Count** | 4 | `unit4_count` | number
- **Unit Type 4 SF** | 1,100 | `unit4_sf` | number
- **Unit Type 4 Rent** | $1,450 | `unit4_rent` | currency

- **Unit Type 5 Name** | — | `unit5_type` | text
- **Unit Type 5 Count** | — | `unit5_count` | number
- **Unit Type 5 SF** | — | `unit5_sf` | number
- **Unit Type 5 Rent** | — | `unit5_rent` | currency

- **Unit Type 6 Name** | — | `unit6_type` | text
- **Unit Type 6 Count** | — | `unit6_count` | number
- **Unit Type 6 SF** | — | `unit6_sf` | number
- **Unit Type 6 Rent** | — | `unit6_rent` | currency

### 4.5.2 Other Income
*4 fields*

- **Parking Income** | $6,000 | `income_parking` | currency
- **Laundry Income** | $4,800 | `income_laundry` | currency
- **Storage Income** | $2,400 | `income_storage` | currency
- **Other Income** | $1,200 | `income_other` | currency

### 4.5.3 Income Summary
*6 fields*

- **Potential Gross Income** | $619,200 | `pgi` | currency
- **Vacancy Loss** | ($30,960) | `vacancy_loss` | currency
- **Effective Gross Income** | $588,240 | `egi` | currency
- **Total Other Income** | $14,400 | `other_income_total` | currency
- **Gross Operating Income** | $602,640 | `goi` | currency
- **Income Analysis** | Based on the rent roll and market... | `income_analysis` | textarea

### 4.5.4 Operating Expenses
*16 fields*

- **Property Taxes** | $85,000 | `exp_taxes` | currency
- **Insurance** | $24,000 | `exp_insurance` | currency
- **Utilities** | $36,000 | `exp_utilities` | currency
- **Repairs & Maintenance** | $28,000 | `exp_repairs` | currency
- **Management Fee** | $30,132 | `exp_management` | currency
- **Management Fee %** | 5% | `exp_management_pct` | percent
- **Administrative** | $6,000 | `exp_admin` | currency
- **Payroll** | $18,000 | `exp_payroll` | currency
- **Landscaping** | $4,800 | `exp_landscaping` | currency
- **Snow Removal** | $3,600 | `exp_snow` | currency
- **Trash Removal** | $4,200 | `exp_trash` | currency
- **Professional Fees** | $2,400 | `exp_professional` | currency
- **Reserves** | $12,000 | `exp_reserves` | currency
- **Other Expenses** | $3,000 | `exp_other` | currency
- **Total Expenses** | $257,132 | `exp_total` | currency
- **Expense Ratio** | 42.7% | `expense_ratio` | percent

### 4.5.5 NOI & Capitalization
*8 fields*

- **Net Operating Income** | $345,508 | `noi` | currency
- **Cap Rate** | 5.75% | `cap_rate` | percent
- **Cap Rate Source** | Market extraction | `cap_rate_source` | text
- **Cap Rate Analysis** | The cap rate was derived from... | `cap_rate_analysis` | textarea
- **Indicated Value - Income** | $6,009,704 | `income_indicated_raw` | currency
- **Rounded Value** | $6,000,000 | `income_indicated_value` | currency
- **Value Per Unit** | $125,000 | `income_value_per_unit` | currency
- **Value Per SF** | $125.00 | `income_value_per_sf` | currency

---

## 4.6 DIRECT COMPARISON APPROACH

### 4.6.1 Comparable 1
*11 fields*

- **Address** | 100 River Road | `comp1_address` | text
- **City** | Saskatoon | `comp1_city` | text
- **Sale Price** | $7,200,000 | `comp1_price` | currency
- **Sale Date** | 2024-05-15 | `comp1_date` | date
- **Units** | 42 | `comp1_units` | number
- **Price/Unit** | $171,429 | `comp1_per_unit` | currency
- **Year Built** | 2006 | `comp1_year` | number
- **GBA** | 45,000 | `comp1_gba` | number
- **Price/SF** | $160.00 | `comp1_per_sf` | currency
- **Cap Rate** | 5.8% | `comp1_cap` | percent
- **Photo** | (image) | `comp1_photo` | file

### 4.6.2 Comparable 2
*11 fields*

- **Address** | 250 Park Lane | `comp2_address` | text
- **City** | Prince Albert | `comp2_city` | text
- **Sale Price** | $8,900,000 | `comp2_price` | currency
- **Sale Date** | 2024-02-28 | `comp2_date` | date
- **Units** | 50 | `comp2_units` | number
- **Price/Unit** | $178,000 | `comp2_per_unit` | currency
- **Year Built** | 2010 | `comp2_year` | number
- **GBA** | 55,000 | `comp2_gba` | number
- **Price/SF** | $161.82 | `comp2_per_sf` | currency
- **Cap Rate** | 5.6% | `comp2_cap` | percent
- **Photo** | (image) | `comp2_photo` | file

### 4.6.3 Comparable 3
*11 fields*

- **Address** | 88 Central Ave | `comp3_address` | text
- **City** | North Battleford | `comp3_city` | text
- **Sale Price** | $5,400,000 | `comp3_price` | currency
- **Sale Date** | 2023-11-10 | `comp3_date` | date
- **Units** | 32 | `comp3_units` | number
- **Price/Unit** | $168,750 | `comp3_per_unit` | currency
- **Year Built** | 2004 | `comp3_year` | number
- **GBA** | 35,000 | `comp3_gba` | number
- **Price/SF** | $154.29 | `comp3_per_sf` | currency
- **Cap Rate** | 6.1% | `comp3_cap` | percent
- **Photo** | (image) | `comp3_photo` | file

### 4.6.4 Comparable 4
*11 fields*

- **Address** | 500 Maple Drive | `comp4_address` | text
- **City** | Regina | `comp4_city` | text
- **Sale Price** | $12,500,000 | `comp4_price` | currency
- **Sale Date** | 2024-07-01 | `comp4_date` | date
- **Units** | 68 | `comp4_units` | number
- **Price/Unit** | $183,824 | `comp4_per_unit` | currency
- **Year Built** | 2015 | `comp4_year` | number
- **GBA** | 72,000 | `comp4_gba` | number
- **Price/SF** | $173.61 | `comp4_per_sf` | currency
- **Cap Rate** | 5.4% | `comp4_cap` | percent
- **Photo** | (image) | `comp4_photo` | file

### 4.6.5 Comparable 5
*11 fields*

- **Address** | 321 Oak Street | `comp5_address` | text
- **City** | Moose Jaw | `comp5_city` | text
- **Sale Price** | $6,100,000 | `comp5_price` | currency
- **Sale Date** | 2024-01-15 | `comp5_date` | date
- **Units** | 36 | `comp5_units` | number
- **Price/Unit** | $169,444 | `comp5_per_unit` | currency
- **Year Built** | 2007 | `comp5_year` | number
- **GBA** | 40,000 | `comp5_gba` | number
- **Price/SF** | $152.50 | `comp5_per_sf` | currency
- **Cap Rate** | 6.0% | `comp5_cap` | percent
- **Photo** | (image) | `comp5_photo` | file

### 4.6.6 Comparable 6
*11 fields*

- **Address** | 777 Birch Blvd | `comp6_address` | text
- **City** | Yorkton | `comp6_city` | text
- **Sale Price** | $4,800,000 | `comp6_price` | currency
- **Sale Date** | 2023-09-20 | `comp6_date` | date
- **Units** | 28 | `comp6_units` | number
- **Price/Unit** | $171,429 | `comp6_per_unit` | currency
- **Year Built** | 2005 | `comp6_year` | number
- **GBA** | 30,000 | `comp6_gba` | number
- **Price/SF** | $160.00 | `comp6_per_sf` | currency
- **Cap Rate** | 6.2% | `comp6_cap` | percent
- **Photo** | (image) | `comp6_photo` | file

### 4.6.7 Adjustment Grid
*14 fields*

- **Adj - Property Rights** | 0%, 0%, 0%, 0%, 0%, 0% | `adj_rights` | text
- **Adj - Financing** | 0%, 0%, 0%, 0%, 0%, 0% | `adj_financing` | text
- **Adj - Conditions of Sale** | 0%, 0%, 0%, 0%, 0%, 0% | `adj_conditions` | text
- **Adj - Market Conditions** | +2%, +3%, +5%, +1%, +4%, +6% | `adj_market` | text
- **Adj - Location** | 0%, -5%, +5%, -10%, 0%, +5% | `adj_location` | text
- **Adj - Size** | -5%, +5%, -10%, +10%, -5%, -10% | `adj_size` | text
- **Adj - Age/Condition** | -5%, +5%, -10%, +10%, -5%, -5% | `adj_age` | text
- **Adj - Quality** | 0%, 0%, 0%, -5%, 0%, +5% | `adj_quality` | text
- **Adj - Amenities** | 0%, 0%, +5%, 0%, +5%, +5% | `adj_amenities` | text
- **Net Adjustment** | -8%, +8%, -5%, +11%, -1%, +1% | `adj_net` | text
- **Adjusted Price/Unit** | $157,714, $192,240, etc. | `adj_price_unit` | text
- **SCA Analysis** | The comparable sales indicate... | `sca_analysis` | textarea
- **Indicated Value - SCA** | $8,500,000 | `sca_indicated_value` | currency
- **Comp Map** | (image) | `comp_map` | file

---

## 4.7 RECONCILIATION OF VALUE
*14 fields*

### From Home Tab (linked)
- `scenario_name`, `property_rights`, `effective_date`

### Section-Specific

- **Cost Value** | N/A | `recon_cost_value` | currency
- **Cost Weight** | 0% | `recon_cost_weight` | percent
- **Cost Commentary** | Not applied... | `recon_cost_comment` | textarea
- **SCA Value** | $8,500,000 | `recon_sca_value` | currency
- **SCA Weight** | 40% | `recon_sca_weight` | percent
- **SCA Commentary** | The sales comparison provides... | `recon_sca_comment` | textarea
- **Income Value** | $8,750,000 | `recon_income_value` | currency
- **Income Weight** | 60% | `recon_income_weight` | percent
- **Income Commentary** | The income approach is most reliable... | `recon_income_comment` | textarea
- **Reconciliation Narrative** | In reconciling the value indications... | `recon_narrative` | textarea
- **Final Value Opinion** | $8,600,000 | `recon_final_value` | currency
- **Final Value Per Unit** | $179,167 | `recon_per_unit` | currency
- **Final Value Per SF** | $165.38 | `recon_per_sf` | currency
- **Exposure Time** | 3-6 months | `recon_exposure` | text

---

## 4.8 CERTIFICATION
*4 fields*

### From Home Tab (linked)
- All appraiser fields, dates, conditions, client info

### Section-Specific

- **Certification Statements** | Standard CUSPAP statements | `cert_statements` | textarea
- **Additional Certifications** | (if any) | `cert_additional` | textarea
- **Appraiser 1 Signature Block** | (auto from Home) | `cert_sig_1` | auto
- **Appraiser 2 Signature Block** | (auto from Home) | `cert_sig_2` | auto

---

### TAB 4 TOTAL: 198 fields

---

---

# TAB 5: APPENDICES

---

## 5.1 CONTINGENT & LIMITING CONDITIONS
*6 fields*

### From Home Tab (linked)
- `ea_1` through `ea_4`, `hc_1` through `hc_4`, `elc_1` through `elc_3`

### Section-Specific

- **Standard Assumptions** | Standard assumptions and limiting conditions... | `std_assumptions` | textarea
- **Standard Limiting Conditions** | Standard limiting conditions per CUSPAP... | `std_limiting` | textarea
- **Extraordinary Assumptions Display** | (auto from Home) | `ea_display` | auto
- **Hypothetical Conditions Display** | (auto from Home) | `hc_display` | auto
- **Extraordinary Limiting Display** | (auto from Home) | `elc_display` | auto
- **Additional Conditions** | (if any) | `additional_conditions` | textarea

---

## 5.2 DEFINITION OF TERMS
*2 fields*

- **Market Value Definition** | Standard market value definition... | `def_market_value` | textarea
- **Additional Definitions** | Fee Simple, Leased Fee, etc... | `def_additional` | textarea

---

## 5.3 QUALIFICATIONS OF THE APPRAISER
*10 fields*

### Appraiser 1
- **CV/Bio** | Professional biography... | `qual_1_bio` | textarea
- **Education** | University of Calgary, BComm... | `qual_1_education` | textarea
- **Designations** | AACI, MRICS | `qual_1_designations` | text
- **Experience** | 15 years in commercial appraisal... | `qual_1_experience` | textarea
- **CV Document** | (pdf) | `qual_1_cv` | file

### Appraiser 2
- **CV/Bio** | Professional biography... | `qual_2_bio` | textarea
- **Education** | University of Alberta, BComm... | `qual_2_education` | textarea
- **Designations** | AACI | `qual_2_designations` | text
- **Experience** | 10 years in commercial appraisal... | `qual_2_experience` | textarea
- **CV Document** | (pdf) | `qual_2_cv` | file

---

## 5.4 SUPPORTING DOCUMENTS
*10 fields*

- **Title Document** | (pdf) | `doc_title` | file
- **Survey/RPR** | (pdf) | `doc_survey` | file
- **Tax Assessment** | (pdf) | `doc_tax` | file
- **Rent Roll** | (pdf) | `doc_rent_roll` | file
- **Operating Statements** | (pdf) | `doc_operating` | file
- **Lease Abstracts** | (pdf) | `doc_leases` | file
- **Flood Map** | (image) | `doc_flood_map` | file
- **Environmental Report** | (pdf) | `doc_environmental` | file
- **Additional Exhibit 1** | (file) | `doc_exhibit_1` | file
- **Additional Exhibit 2** | (file) | `doc_exhibit_2` | file

---

### TAB 5 TOTAL: 28 fields

---

---

# FIELD COUNT SUMMARY

| Tab | Subsections | Fields |
|-----|-------------|--------|
| **1. Home** | 12 | 114 |
| **2. Introduction & Executive Summary** | 4 | 44 |
| **3. Property Analysis** | 5 | 82 |
| **4. Market Context** | 8 | 198 |
| **5. Appendices** | 4 | 28 |
| **TOTAL** | **33** | **466** |

---

## FIELD TYPES

- **text** - single line input
- **textarea** - multi-line input
- **dropdown** - single select
- **multi-select** - multiple selections
- **toggle** - on/off checkbox
- **date** - date picker
- **number** - numeric input
- **currency** - dollar amount
- **percent** - percentage
- **file** - upload/image
- **button** - action trigger
- **auto** - calculated/generated
- **lookup** - pulls from another source
