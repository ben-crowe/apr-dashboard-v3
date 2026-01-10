# V4 Report Template Specification

**Reference:** VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.docx
**Purpose:** Document every page, field, and image for exact HTML template matching

---

## Typography Standards (from reference HTML)

```
Body Text:      Times 12px, #00000a
Titles:         Times 18px bold, right-aligned, #00000a
Headers:        Times 14-16px bold
Table Text:     Times 8px, #333333 / #666666
White on Dark:  Times 12px, #ffffff
Captions:       Times 12px, centered
```

---

## Section 1: Cover Page

### Layout
- 2-column table structure
- Right column contains all text (right-aligned)
- Dark section with white text for client/preparer info

### Template Content

```
[Column 1: Empty/Logo space]

[Column 2 - Right aligned:]
                                        Appraisal Report

                                        {{property_type}} Property
                                        {{property_name}}
                                        {{street_address}}
                                        {{city}}, {{province}}




                                        PREPARED FOR:
                                        {{client_contact_name}}

                                        {{client_company}}
                                        {{client_address}}
                                        {{client_city}}, {{client_province}} {{client_postal}}


                                        PREPARED BY:
                                        {{appraiser_company}}
                                        {{appraiser_address}}
                                        {{appraiser_city}}, {{appraiser_province}} {{appraiser_postal}}
                                        Office: {{appraiser_phone}}
                                        {{appraiser_website}}


                                        Date of Valuation: {{valuation_date}}
                                        Date of Report: {{report_date}}

                                        File No: {{file_number}}
```

### Fields (15)
- `{{property_type}}` - Multi-Family Walkup, Commercial, etc.
- `{{property_name}}` - North Battleford Apartments
- `{{street_address}}` - 1101, 1121 109 St
- `{{city}}` - North Battleford
- `{{province}}` - Saskatchewan
- `{{client_contact_name}}` - Kenneth Engler
- `{{client_company}}` - 102109845 Saskatchewan Ltd.
- `{{client_address}}` - 1901, 1088 - 6th Ave SW
- `{{client_city}}` - Calgary
- `{{client_province}}` - AB
- `{{client_postal}}` - T2P 5N3
- `{{appraiser_company}}` - Valta Property Valuations Ltd.
- `{{appraiser_address}}`, `{{appraiser_city}}`, `{{appraiser_province}}`, `{{appraiser_postal}}`
- `{{appraiser_phone}}` - 587-801-5151
- `{{appraiser_website}}` - www.valta.ca
- `{{valuation_date}}` - October 17, 2025
- `{{report_date}}` - November 20, 2025
- `{{file_number}}` - VAL251012 - 1

---

## Section 2: Letter of Transmittal

### Layout
- Single column, left-aligned
- Business letter format
- Signature block at bottom

### Template Content

```
{{report_date}}

{{client_company}}
{{client_address}}
{{client_city}}, {{client_province}} {{client_postal}}

Attention: {{client_contact_name}},

Re: {{value_scenario}} ({{property_rights}}) current market value for the property located at {{street_address}}, {{city}}, {{province_abbrev}}.

{{appraiser_company}} is proud to present the appraisal report that satisfies the agreed upon scope of work with {{client_company}}. The purpose of this assignment is to provide the {{value_scenario}} current market value of the property which at the time of inspection represents the improved property as of the effective date and leased up at market rental rates and operating costs for the property located at {{street_address}}, {{city}}, {{province_abbrev}} (herein referred to as the 'subject property').

The subject property, located at {{street_address}}, {{city}}, {{province_abbrev}}, is a {{property_type_lower}}, {{building_style}} property with improvements located in {{city}}. The improvements are comprised of {{total_buildings}} total buildings, and consist of {{total_nra}} square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in {{year_built}}; ({{year_built}} weighted) is approximately {{occupancy_rate}}% occupied and features {{total_units}} units in a {{stories}}-story, {{building_format}} format.

Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth in the body of this appraisal report, as of the effective date, we have concluded the following:

[TABLE: Value Conclusion]
| Value Scenario | Interest Appraised | Effective Date | Concluded Value |
|----------------|-------------------|----------------|-----------------|
| {{value_scenario}} | {{property_rights}} | {{valuation_date}} | ${{concluded_value}} |

Hypothetical Conditions
{{hypothetical_conditions_text}}

Extraordinary Assumptions
{{extraordinary_assumptions_text}}

Extraordinary Limiting Conditions
{{extraordinary_limiting_conditions_text}}

The report has been completed in accordance with the Canadian Uniform Standards of Professional Appraisal Practice ("CUSPAP") adopted January 1, 2024. The full narrative appraisal report that follows sets forth the pertinent data and analyses leading to the conclusions presented herein. The appraisal requirements section of this report sets out the basis of the appraisal, definitions and the valuation methodology and must be read to gain a full understanding of the process.

If there are any specific questions or concerns regarding the attached appraisal report, or if {{appraiser_company_short}} can be of additional assistance, please contact the individuals listed below.

Respectfully Submitted,
{{appraiser_company}}

[SIGNATURE BLOCK]
{{appraiser_name}}, {{appraiser_credentials}}
{{appraiser_title}}
{{appraiser_email}}
AIC No: {{appraiser_aic_number}}
```

### Fields (35+)
- All cover page fields plus:
- `{{value_scenario}}` - As Stabilized
- `{{property_rights}}` - Fee Simple Estate
- `{{province_abbrev}}` - SK
- `{{property_type_lower}}` - multi-family
- `{{building_style}}` - walkup
- `{{total_buildings}}` - 2
- `{{total_nra}}` - 10,204
- `{{year_built}}` - 1970
- `{{occupancy_rate}}` - 100.0
- `{{total_units}}` - 16
- `{{stories}}` - 2
- `{{building_format}}` - garden style
- `{{concluded_value}}` - formatted currency
- `{{hypothetical_conditions_text}}` - long text block
- `{{extraordinary_assumptions_text}}` - "No Extraordinary Assumptions were made for this assignment."
- `{{extraordinary_limiting_conditions_text}}` - "No Extraordinary Limiting Conditions were made for this assignment."
- `{{appraiser_company_short}}` - Valta
- `{{appraiser_name}}` - Chris Chornohos
- `{{appraiser_credentials}}` - AACI, MRICS
- `{{appraiser_title}}` - Founder
- `{{appraiser_email}}` - chris.chornohos@valta.ca
- `{{appraiser_aic_number}}` - 902097

---

## Section 3: Table of Contents

### Layout
- Single column with tab-separated page numbers
- Section titles left, page numbers right

### Template Content

```
Introduction & Executive Summary                    {{toc_intro_page}}
Property Overview                                   {{toc_overview_page}}
Photographs                                         {{toc_photos_page}}
Maps                                                {{toc_maps_page}}
Identification of Assignment                        {{toc_assignment_page}}
Property Analysis                                   {{toc_analysis_page}}
Location                                            {{toc_location_page}}
Site Details                                        {{toc_site_page}}
Property Taxes & Assessment                         {{toc_taxes_page}}
Land Use & Planning                                 {{toc_zoning_page}}
Description of the Improvements                     {{toc_improvements_page}}
Market Context                                      {{toc_market_page}}
Economic Overviews                                  {{toc_economic_page}}
Multi-Family Market Overview                        {{toc_multifamily_page}}
Highest & Best Use                                  {{toc_hbu_page}}
Valuation Methodology                               {{toc_methodology_page}}
Income Approach                                     {{toc_income_page}}
Direct Comparison Approach: Multifamily             {{toc_comparison_page}}
Reconciliation of Value                             {{toc_reconciliation_page}}
Certification                                       {{toc_certification_page}}
Appendices                                          {{toc_appendices_page}}
Contingent & Limiting Conditions                    {{toc_conditions_page}}
Definition of Terms                                 {{toc_definitions_page}}
Qualifications of the Appraiser                     {{toc_qualifications_page}}
```

### Fields (24)
- All `{{toc_*_page}}` fields for page numbers

---

## Section 4: Introduction & Executive Summary / Property Overview

### Layout
- Section header
- Property summary table
- Value conclusion table
- Conditions text blocks

### Template Content

```
Introduction & Executive Summary
Property Overview

[TABLE: Property Summary - embedded in page layout]

Hypothetical Conditions
{{hypothetical_conditions_text}}

Extraordinary Assumptions
{{extraordinary_assumptions_text}}

Extraordinary Limiting Conditions
{{extraordinary_limiting_conditions_text}}
```

### Fields
- Reuses Letter of Transmittal fields
- Summary table pulls from property identification fields

---

## Section 5: Photographs

### Layout
- **2-column table grid**
- Each cell: [IMAGE placeholder] + centered caption below
- 2 photos per row
- Times 12px centered captions

### Template Content

```
Photographs

[TABLE: 2-column photo grid]
| [IMAGE: exterior_1]              | [IMAGE: exterior_2]              |
| {{photo_caption_1}}              | {{photo_caption_2}}              |
|----------------------------------|----------------------------------|
| [IMAGE: exterior_3]              | [IMAGE: exterior_4]              |
| {{photo_caption_3}}              | {{photo_caption_4}}              |
|----------------------------------|----------------------------------|
| [IMAGE: interior_hallway]        | [IMAGE: interior_stairway]       |
| {{photo_caption_5}}              | {{photo_caption_6}}              |
|----------------------------------|----------------------------------|
| [IMAGE: interior_bathroom]       | [IMAGE: interior_bedroom_1]      |
| {{photo_caption_7}}              | {{photo_caption_8}}              |
|----------------------------------|----------------------------------|
| [IMAGE: interior_bedroom_2]      | [IMAGE: electrical_room]         |
| {{photo_caption_9}}              | {{photo_caption_10}}             |
|----------------------------------|----------------------------------|
| [IMAGE: mechanical_room]         | [IMAGE: interior_kitchen]        |
| {{photo_caption_11}}             | {{photo_caption_12}}             |
|----------------------------------|----------------------------------|
| [IMAGE: interior_living]         | [IMAGE: building_2_exterior_1]   |
| {{photo_caption_13}}             | {{photo_caption_14}}             |
|----------------------------------|----------------------------------|
... continues for all photos
```

### Image Placeholders (25 from reference)
1. `[IMAGE: 1101_east_elevation]` - "1101 - East Elevation"
2. `[IMAGE: 1101_west_elevation]` - "1101 - West Elevation"
3. `[IMAGE: street_view_east]` - "Street View Facing East - 11 Ave"
4. `[IMAGE: street_view_north]` - "Street View Facing North - 109 St"
5. `[IMAGE: 1101_hallway]` - "1101 - Typical Hallway"
6. `[IMAGE: 1101_stairway]` - "1101 - Typical Stairway"
7. `[IMAGE: 1101_bathroom]` - "1101 - Typical Bathroom"
8. `[IMAGE: 1101_bedroom_1]` - "1101 - Typical Bedroom 1"
9. `[IMAGE: 1101_bedroom_2]` - "1101 - Typical Bedroom 2"
10. `[IMAGE: 1101_electrical]` - "1101 - Electrical Room"
11. `[IMAGE: 1101_mechanical]` - "1101 - Mechanical Room"
12. `[IMAGE: 1101_kitchen]` - "1101 - Typical Kitchen"
13. `[IMAGE: 1101_living]` - "1101 - Living Room"
14. `[IMAGE: 1121_west_elevation]` - "1121 - West Elevation"
15. `[IMAGE: 1121_east_elevation]` - "1121 - East Elevation"
16. `[IMAGE: 1121_hallway]` - "1121 - Typical Hallway"
17. `[IMAGE: 1121_stairway]` - "1121 - Typical Stairway"
18. `[IMAGE: 1121_living]` - "1121 - Typical Living Room"
19. `[IMAGE: 1121_bathroom]` - "1121 - Typical Bathroom"
20. `[IMAGE: 1121_kitchen]` - "1121 - Typical Kitchen"
21. `[IMAGE: 1121_bedroom]` - "1121 - Typical Bedroom"
22. `[IMAGE: 1121_laundry]` - "1121 - Laundry Room"
23. `[IMAGE: 1121_electrical]` - "1121 - Electrical Room"
24. `[IMAGE: 1121_boiler]` - "1121 - Typical Boiler"
25. `[IMAGE: 1121_utility]` - "1121 - Utility Room"

### Fields (25)
- `{{photo_caption_1}}` through `{{photo_caption_25}}`

---

## Section 6: Maps

### Layout
- Full page maps, one per page
- Centered placement

### Image Placeholders (4-5)
1. `[IMAGE: map_regional]` - Regional Location Map
2. `[IMAGE: map_neighbourhood]` - Neighbourhood Map
3. `[IMAGE: map_aerial]` - Aerial View
4. `[IMAGE: map_zoning]` - Zoning Map (if applicable)
5. `[IMAGE: map_site_plan]` - Site Plan (if applicable)

---

## Section 7: Identification of Assignment

### Layout
- Section header with bold "Assignment" in larger font
- Multiple subsections with headers

### Template Content

```
Identification of Assignment

Property Identification
The subject property, located at {{street_address}}, {{city}}, {{province_abbrev}}, is a {{property_type_lower}}, {{building_style}} property with improvements located in {{city}}.

The improvements are comprised of {{total_buildings}} total buildings, and consist of {{total_nra}} square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in {{year_built}}; ({{year_built}} weighted) is approximately {{occupancy_rate}}% occupied and features {{total_units}} units in a {{stories}}-story, {{building_format}} format.

Legal Description
{{legal_description}}

Authorized Client Identification
The authorized client of this specific assignment is {{client_company}}.

Authorized Use & Authorized Users
The authorized use of this report is for {{authorized_use}}. {{client_company}} is the only authorized user of this report.

Effective Date of Value and Report Date
The effective date of value of this appraisal is {{valuation_date}}. The report date is {{report_date}}.

Inspection Date
{{inspection_date}}

Purpose
The purpose of this assignment is to provide the {{value_scenario}} which at the time of inspection represents the existing improvements assuming stabilized occupancy as of the effective date for the property located at {{street_address}}, {{city}}, {{province_abbrev}} (herein referred to as the 'subject property').

Hypothetical Conditions
{{hypothetical_conditions_text}}

Extraordinary Assumptions
{{extraordinary_assumptions_text}}

Extraordinary Limiting Conditions
{{extraordinary_limiting_conditions_text}}

Property And Sales History

Current Owner
The subject property is currently under the ownership of {{current_owner}}.

Three-Year Sales History
{{three_year_sales_history}}

Exposure & Marketing Time
[Standard boilerplate text about exposure time definition]

Noting the subject property's physical, legal, economic and market characteristics, which are described further in this report, we have concluded a reasonable estimate of exposure and marketing time for the subject property to be {{exposure_marketing_time}}.

Definition of Market Value
According to the January 1, 2024 version of the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP), market value is defined as:

[Standard CUSPAP market value definition - boilerplate]

Property Rights Appraised
The property rights appraised constitute the {{property_rights_lower}} interest.

{{property_rights_type}} Interest
{{property_rights_description}}

Value Scenarios
{{value_scenario}}
{{value_scenario_description}}

Scope of Work
The scope of work for this appraisal assignment is outlined below:
{{scope_of_work_items}}

The following work was not undertaken as it was not required for credible results within the scope of this concise assignment in conformity with CUSPAP 2024.
{{scope_exclusions}}

Assistance Provided
{{assistance_provided}}

Sources of Information
The following sources were contacted to obtain relevant information:
{{sources_of_information}}

Subject Property Inspection
{{inspection_details}}

Personal Property & Business Intangible
{{personal_property_statement}}
```

### Fields (30+)
- `{{legal_description}}` - Plan - C4240; Block - 95; Lot - 17,18, 19, 20
- `{{authorized_use}}` - first mortgage financing purposes
- `{{inspection_date}}` - October 17, 2025
- `{{current_owner}}` - 102109845 Saskatchewan Ltd.
- `{{three_year_sales_history}}` - ownership history text
- `{{exposure_marketing_time}}` - six months
- `{{property_rights_lower}}` - fee simple estate
- `{{property_rights_type}}` - Fee Simple
- `{{property_rights_description}}` - definition text
- `{{value_scenario_description}}` - Current Value Opinion description
- `{{scope_of_work_items}}` - bulleted list
- `{{scope_exclusions}}` - bulleted list
- `{{assistance_provided}}` - inspector details
- `{{sources_of_information}}` - source list
- `{{inspection_details}}` - inspection summary
- `{{personal_property_statement}}` - FF&E statement

---

## Section 8: Property Analysis - Location

### Layout
- Section header
- Narrative paragraphs
- Location data table

### Template Content

```
Property Analysis
Location

{{location_overview_paragraph}}

[TABLE: Location Details]
| Category | Details |
|----------|---------|
| Municipality | {{municipality}} |
| Neighbourhood | {{neighbourhood}} |
| Proximity to Downtown | {{downtown_proximity}} |
| Major Arterials | {{major_arterials}} |
| Public Transit | {{public_transit}} |
| Schools | {{nearby_schools}} |
| Shopping | {{nearby_shopping}} |
| Employment Centres | {{employment_centres}} |
```

### Fields (10+)
- `{{location_overview_paragraph}}`
- `{{municipality}}`
- `{{neighbourhood}}`
- `{{downtown_proximity}}`
- `{{major_arterials}}`
- `{{public_transit}}`
- `{{nearby_schools}}`
- `{{nearby_shopping}}`
- `{{employment_centres}}`

---

## Section 9: Site Details

### Layout
- Multiple subsection headers
- Data tables
- Narrative descriptions

### Template Content

```
Site Details

[TABLE: Site Summary]
| Item | Details |
|------|---------|
| Municipal Address | {{street_address}}, {{city}}, {{province_abbrev}} |
| Legal Description | {{legal_description}} |
| Site Area | {{site_area_sf}} SF / {{site_area_acres}} Acres |
| Shape | {{site_shape}} |
| Topography | {{site_topography}} |
| Frontage | {{site_frontage}} |
| Access | {{site_access}} |
| Visibility | {{site_visibility}} |
| Corner Lot | {{is_corner_lot}} |

Utilities
[TABLE: Utilities]
| Utility | Provider/Status |
|---------|-----------------|
| Water | {{water_utility}} |
| Sanitary Sewer | {{sewer_utility}} |
| Storm Sewer | {{storm_utility}} |
| Electricity | {{electricity_utility}} |
| Natural Gas | {{gas_utility}} |
| Telephone | {{telephone_utility}} |

Site Improvements
{{site_improvements_description}}

Parking
{{parking_description}}
Total Spaces: {{total_parking_spaces}}
Parking Ratio: {{parking_ratio}} per unit

Easements & Encumbrances
{{easements_description}}

Environmental
{{environmental_description}}
```

### Fields (25+)
- `{{site_area_sf}}`, `{{site_area_acres}}`
- `{{site_shape}}` - Rectangular, Irregular, etc.
- `{{site_topography}}` - Level, Sloping, etc.
- `{{site_frontage}}`
- `{{site_access}}`
- `{{site_visibility}}`
- `{{is_corner_lot}}` - Yes/No
- `{{water_utility}}`, `{{sewer_utility}}`, `{{storm_utility}}`
- `{{electricity_utility}}`, `{{gas_utility}}`, `{{telephone_utility}}`
- `{{site_improvements_description}}`
- `{{parking_description}}`
- `{{total_parking_spaces}}`
- `{{parking_ratio}}`
- `{{easements_description}}`
- `{{environmental_description}}`

---

## Section 10: Property Taxes & Assessment

### Layout
- Data table
- Historical comparison if available

### Template Content

```
Property Taxes & Assessment

[TABLE: Current Assessment]
| Category | Value |
|----------|-------|
| Land Assessment | ${{land_assessment}} |
| Improvement Assessment | ${{improvement_assessment}} |
| Total Assessment | ${{total_assessment}} |
| Assessment Year | {{assessment_year}} |
| Mill Rate | {{mill_rate}} |
| Annual Taxes | ${{annual_taxes}} |

Tax Status: {{tax_status}}

{{tax_commentary}}
```

### Fields (8)
- `{{land_assessment}}`
- `{{improvement_assessment}}`
- `{{total_assessment}}`
- `{{assessment_year}}`
- `{{mill_rate}}`
- `{{annual_taxes}}`
- `{{tax_status}}` - Current, In Arrears, etc.
- `{{tax_commentary}}`

---

## Section 11: Land Use & Planning (Zoning)

### Layout
- Zoning designation table
- Permitted uses list
- Compliance analysis

### Template Content

```
Land Use & Planning

[TABLE: Zoning Summary]
| Item | Details |
|------|---------|
| Zoning Designation | {{zoning_designation}} |
| Zoning Authority | {{zoning_authority}} |
| Official Plan Designation | {{official_plan_designation}} |

Permitted Uses
{{permitted_uses_list}}

Development Standards
[TABLE: Zoning Compliance]
| Standard | Required | Existing | Compliance |
|----------|----------|----------|------------|
| Minimum Lot Area | {{min_lot_area}} | {{actual_lot_area}} | {{lot_area_compliance}} |
| Maximum Density | {{max_density}} | {{actual_density}} | {{density_compliance}} |
| Maximum Height | {{max_height}} | {{actual_height}} | {{height_compliance}} |
| Minimum Setback - Front | {{min_front_setback}} | {{actual_front_setback}} | {{front_setback_compliance}} |
| Minimum Setback - Rear | {{min_rear_setback}} | {{actual_rear_setback}} | {{rear_setback_compliance}} |
| Minimum Setback - Side | {{min_side_setback}} | {{actual_side_setback}} | {{side_setback_compliance}} |
| Parking Required | {{parking_required}} | {{parking_provided}} | {{parking_compliance}} |

Legal Conforming Status: {{legal_conforming_status}}

{{zoning_commentary}}
```

### Fields (25+)
- `{{zoning_designation}}`
- `{{zoning_authority}}`
- `{{official_plan_designation}}`
- `{{permitted_uses_list}}`
- Compliance table fields (required, actual, compliance status)
- `{{legal_conforming_status}}`
- `{{zoning_commentary}}`

---

## Section 12: Description of the Improvements

### Layout
- Building summary table
- Construction details table
- Unit mix table
- Condition ratings

### Template Content

```
Description of the Improvements

[TABLE: Building Summary]
| Item | Details |
|------|---------|
| Property Type | {{property_type}} |
| Building Style | {{building_style}} |
| Number of Buildings | {{total_buildings}} |
| Number of Stories | {{stories}} |
| Year Built | {{year_built}} |
| Effective Age | {{effective_age}} years |
| Remaining Economic Life | {{remaining_economic_life}} years |
| Gross Building Area | {{gross_building_area}} SF |
| Net Rentable Area | {{total_nra}} SF |
| Total Units | {{total_units}} |

Construction Details
[TABLE: Construction]
| Component | Description |
|-----------|-------------|
| Foundation | {{foundation_type}} |
| Structural Frame | {{structural_frame}} |
| Exterior Walls | {{exterior_walls}} |
| Roof Type | {{roof_type}} |
| Roof Covering | {{roof_covering}} |
| Windows | {{window_type}} |
| Exterior Doors | {{exterior_doors}} |

Interior Finishes
[TABLE: Interior]
| Component | Description |
|-----------|-------------|
| Interior Walls | {{interior_walls}} |
| Ceilings | {{ceilings}} |
| Flooring | {{flooring}} |
| Interior Doors | {{interior_doors}} |
| Kitchen | {{kitchen_description}} |
| Bathrooms | {{bathroom_description}} |

Mechanical Systems
[TABLE: Mechanical]
| System | Description |
|--------|-------------|
| HVAC | {{hvac_system}} |
| Heating | {{heating_system}} |
| Cooling | {{cooling_system}} |
| Hot Water | {{hot_water_system}} |
| Electrical | {{electrical_system}} |
| Plumbing | {{plumbing_system}} |
| Fire Protection | {{fire_protection}} |
| Security | {{security_system}} |
| Elevator | {{elevator}} |

Unit Mix
[TABLE: Unit Mix - DYNAMIC ROWS]
| Unit Type | # Units | Avg SF | Total SF | % of Total |
|-----------|---------|--------|----------|------------|
| {{unit_type_1}} | {{unit_count_1}} | {{unit_avg_sf_1}} | {{unit_total_sf_1}} | {{unit_pct_1}}% |
| {{unit_type_2}} | {{unit_count_2}} | {{unit_avg_sf_2}} | {{unit_total_sf_2}} | {{unit_pct_2}}% |
| {{unit_type_3}} | {{unit_count_3}} | {{unit_avg_sf_3}} | {{unit_total_sf_3}} | {{unit_pct_3}}% |
| **Total** | **{{total_units}}** | **{{avg_unit_sf}}** | **{{total_nra}}** | **100%** |

Amenities
Building Amenities: {{building_amenities}}
Unit Amenities: {{unit_amenities}}

Condition Assessment
[TABLE: Condition Ratings]
| Component | Rating | Comments |
|-----------|--------|----------|
| Foundation | {{foundation_condition}} | {{foundation_comments}} |
| Structure | {{structure_condition}} | {{structure_comments}} |
| Roof | {{roof_condition}} | {{roof_comments}} |
| Exterior | {{exterior_condition}} | {{exterior_comments}} |
| Interior Common | {{interior_common_condition}} | {{interior_common_comments}} |
| Units | {{units_condition}} | {{units_comments}} |
| Mechanical | {{mechanical_condition}} | {{mechanical_comments}} |
| Overall | {{overall_condition}} | {{overall_comments}} |

Deferred Maintenance
{{deferred_maintenance_description}}

Functional Utility
{{functional_utility_description}}

External Obsolescence
{{external_obsolescence_description}}
```

### Fields (80+)
- Building summary fields
- Construction detail fields (foundation, frame, walls, roof, windows, doors)
- Interior finish fields
- Mechanical system fields
- Unit mix table (dynamic rows)
- Amenity fields
- Condition rating fields with comments
- Depreciation fields

---

## Section 13: Market Context - Economic Overviews

### Layout
- National/Provincial/Local economic summaries
- Key indicators table
- Narrative paragraphs

### Template Content

```
Market Context
Economic Overviews

National Economic Overview
{{national_economic_overview}}

Provincial Economic Overview
{{provincial_economic_overview}}

Local Economic Overview
{{local_economic_overview}}

[TABLE: Key Economic Indicators]
| Indicator | National | Provincial | Local |
|-----------|----------|------------|-------|
| GDP Growth | {{gdp_national}}% | {{gdp_provincial}}% | {{gdp_local}}% |
| Unemployment Rate | {{unemployment_national}}% | {{unemployment_provincial}}% | {{unemployment_local}}% |
| Population Growth | {{pop_growth_national}}% | {{pop_growth_provincial}}% | {{pop_growth_local}}% |
| Interest Rates | {{interest_rate}}% | - | - |
```

### Fields (15+)
- Economic overview paragraphs
- Indicator percentages

---

## Section 14: Multi-Family Market Overview

### Layout
- Market statistics table
- Rent comparables
- Vacancy analysis

### Template Content

```
Multi-Family Market Overview

{{market_overview_introduction}}

[TABLE: Market Statistics]
| Metric | Value |
|--------|-------|
| Total Inventory (Units) | {{market_total_units}} |
| Vacancy Rate | {{market_vacancy_rate}}% |
| Average Rent | ${{market_avg_rent}}/month |
| Rent Growth (YoY) | {{rent_growth_yoy}}% |
| Cap Rate Range | {{cap_rate_low}}% - {{cap_rate_high}}% |
| Price Per Unit Range | ${{price_per_unit_low}} - ${{price_per_unit_high}} |

{{market_trends_paragraph}}

{{market_outlook_paragraph}}
```

### Fields (12+)
- `{{market_overview_introduction}}`
- `{{market_total_units}}`
- `{{market_vacancy_rate}}`
- `{{market_avg_rent}}`
- `{{rent_growth_yoy}}`
- `{{cap_rate_low}}`, `{{cap_rate_high}}`
- `{{price_per_unit_low}}`, `{{price_per_unit_high}}`
- `{{market_trends_paragraph}}`
- `{{market_outlook_paragraph}}`

---

## Section 15: Highest & Best Use

### Layout
- As Vacant analysis
- As Improved analysis
- Conclusion

### Template Content

```
Highest & Best Use

The concept of highest and best use represents the premise upon which value is based. The four criteria the highest and best use must meet are legal permissibility, physical possibility, financial feasibility, and maximum productivity.

Highest & Best Use - As Though Vacant
{{hbu_as_vacant_analysis}}

Legally Permissible: {{hbu_legally_permissible}}
Physically Possible: {{hbu_physically_possible}}
Financially Feasible: {{hbu_financially_feasible}}
Maximally Productive: {{hbu_maximally_productive}}

Conclusion - As Vacant: {{hbu_vacant_conclusion}}

Highest & Best Use - As Improved
{{hbu_as_improved_analysis}}

Conclusion - As Improved: {{hbu_improved_conclusion}}
```

### Fields (10)
- Analysis paragraphs
- Four criteria assessments
- Conclusions

---

## Section 16: Valuation Methodology

### Layout
- Methodology explanation
- Approaches applied table

### Template Content

```
Valuation Methodology

{{valuation_methodology_introduction}}

Three traditional approaches to value are available:

Cost Approach
{{cost_approach_description}}
Applied: {{cost_approach_applied}}

Sales Comparison Approach (Direct Comparison)
{{sales_comparison_description}}
Applied: {{sales_comparison_applied}}

Income Approach
{{income_approach_description}}
Applied: {{income_approach_applied}}

[TABLE: Approaches Applied]
| Approach | Applied | Rationale |
|----------|---------|-----------|
| Cost Approach | {{cost_approach_applied}} | {{cost_approach_rationale}} |
| Direct Comparison | {{sales_comparison_applied}} | {{sales_comparison_rationale}} |
| Income Approach | {{income_approach_applied}} | {{income_approach_rationale}} |
```

### Fields (12)
- Methodology introduction
- Approach descriptions
- Applied status (Yes/No)
- Rationales

---

## Section 17: Income Approach

### Layout
- **Most complex section with multiple financial tables**
- Rent roll table
- Operating statement
- Cap rate analysis
- Direct capitalization

### Template Content

```
Income Approach

{{income_approach_introduction}}

Rent Analysis

[TABLE: Rent Roll - DYNAMIC ROWS]
| Unit # | Unit Type | SF | Monthly Rent | Annual Rent | $/SF/Month |
|--------|-----------|-------|--------------|-------------|------------|
| {{unit_number_1}} | {{unit_type_1}} | {{unit_sf_1}} | ${{monthly_rent_1}} | ${{annual_rent_1}} | ${{rent_psf_1}} |
| {{unit_number_2}} | {{unit_type_2}} | {{unit_sf_2}} | ${{monthly_rent_2}} | ${{annual_rent_2}} | ${{rent_psf_2}} |
... (repeats for all units)
| **Total/Avg** | | **{{total_sf}}** | **${{total_monthly_rent}}** | **${{total_annual_rent}}** | **${{avg_rent_psf}}** |

Market Rent Analysis
{{market_rent_analysis}}

[TABLE: Market Rent Comparables]
| Property | Location | Unit Type | SF | Rent | $/SF |
|----------|----------|-----------|-------|------|------|
| {{rent_comp_1_name}} | {{rent_comp_1_location}} | {{rent_comp_1_type}} | {{rent_comp_1_sf}} | ${{rent_comp_1_rent}} | ${{rent_comp_1_psf}} |
| {{rent_comp_2_name}} | {{rent_comp_2_location}} | {{rent_comp_2_type}} | {{rent_comp_2_sf}} | ${{rent_comp_2_rent}} | ${{rent_comp_2_psf}} |
| {{rent_comp_3_name}} | {{rent_comp_3_location}} | {{rent_comp_3_type}} | {{rent_comp_3_sf}} | ${{rent_comp_3_rent}} | ${{rent_comp_3_psf}} |
| {{rent_comp_4_name}} | {{rent_comp_4_location}} | {{rent_comp_4_type}} | {{rent_comp_4_sf}} | ${{rent_comp_4_rent}} | ${{rent_comp_4_psf}} |

Concluded Market Rent: ${{concluded_market_rent}}/month per unit

Vacancy & Collection Loss
{{vacancy_analysis}}
Stabilized Vacancy Rate: {{stabilized_vacancy_rate}}%

Other Income
{{other_income_description}}
Other Income Amount: ${{other_income_amount}}

[TABLE: Pro Forma Operating Statement]
| Line Item | Amount | $/Unit | % of EGI |
|-----------|--------|--------|----------|
| **Revenue** | | | |
| Potential Gross Income | ${{pgi}} | ${{pgi_per_unit}} | |
| Less: Vacancy & Collection Loss | (${{vacancy_loss}}) | (${{vacancy_per_unit}}) | {{vacancy_pct}}% |
| Add: Other Income | ${{other_income_amount}} | ${{other_income_per_unit}} | |
| **Effective Gross Income** | **${{egi}}** | **${{egi_per_unit}}** | **100%** |
| | | | |
| **Operating Expenses** | | | |
| Property Taxes | ${{exp_taxes}} | ${{exp_taxes_per_unit}} | {{exp_taxes_pct}}% |
| Insurance | ${{exp_insurance}} | ${{exp_insurance_per_unit}} | {{exp_insurance_pct}}% |
| Utilities | ${{exp_utilities}} | ${{exp_utilities_per_unit}} | {{exp_utilities_pct}}% |
| Repairs & Maintenance | ${{exp_repairs}} | ${{exp_repairs_per_unit}} | {{exp_repairs_pct}}% |
| Management | ${{exp_management}} | ${{exp_management_per_unit}} | {{exp_management_pct}}% |
| Administrative | ${{exp_admin}} | ${{exp_admin_per_unit}} | {{exp_admin_pct}}% |
| Reserves | ${{exp_reserves}} | ${{exp_reserves_per_unit}} | {{exp_reserves_pct}}% |
| **Total Operating Expenses** | **${{total_expenses}}** | **${{exp_per_unit}}** | **{{expense_ratio}}%** |
| | | | |
| **Net Operating Income** | **${{noi}}** | **${{noi_per_unit}}** | **{{noi_pct}}%** |

Capitalization Rate Analysis

[TABLE: Cap Rate Comparables]
| Sale | Property | Sale Date | Sale Price | NOI | Cap Rate |
|------|----------|-----------|------------|-----|----------|
| 1 | {{cap_comp_1_property}} | {{cap_comp_1_date}} | ${{cap_comp_1_price}} | ${{cap_comp_1_noi}} | {{cap_comp_1_cap}}% |
| 2 | {{cap_comp_2_property}} | {{cap_comp_2_date}} | ${{cap_comp_2_price}} | ${{cap_comp_2_noi}} | {{cap_comp_2_cap}}% |
| 3 | {{cap_comp_3_property}} | {{cap_comp_3_date}} | ${{cap_comp_3_price}} | ${{cap_comp_3_noi}} | {{cap_comp_3_cap}}% |

{{cap_rate_analysis}}

Concluded Capitalization Rate: {{concluded_cap_rate}}%

Direct Capitalization

[TABLE: Value Calculation]
| Component | Value |
|-----------|-------|
| Net Operating Income | ${{noi}} |
| Capitalization Rate | {{concluded_cap_rate}}% |
| **Indicated Value** | **${{income_approach_value}}** |
| Value Per Unit | ${{value_per_unit}} |
| Value Per SF | ${{value_per_sf}} |
```

### Fields (100+)
- Rent roll fields (per unit)
- Rent comparable fields (4-6 comps)
- Operating expense fields
- Cap rate comparable fields
- Calculated fields (NOI, EGI, etc.)
- Concluded values

---

## Section 18: Direct Comparison Approach (Sales Comparison)

### Layout
- Comparable sale summaries
- Adjustment grid table
- Value reconciliation

### Template Content

```
Direct Comparison Approach: Multifamily

{{sales_comparison_introduction}}

Comparable Sales Summary

Sale 1: {{sale_1_address}}
[TABLE: Sale 1 Details]
| Item | Details |
|------|---------|
| Address | {{sale_1_address}} |
| Sale Date | {{sale_1_date}} |
| Sale Price | ${{sale_1_price}} |
| Price/Unit | ${{sale_1_price_per_unit}} |
| Price/SF | ${{sale_1_price_per_sf}} |
| Cap Rate | {{sale_1_cap_rate}}% |
| Year Built | {{sale_1_year_built}} |
| Units | {{sale_1_units}} |
| GBA/NRA | {{sale_1_sf}} SF |
| Property Type | {{sale_1_type}} |
| Condition | {{sale_1_condition}} |

[IMAGE: sale_1_photo]

{{sale_1_comments}}

[Repeat for Sales 2-6]

Adjustment Grid

[TABLE: Sales Adjustment Grid - 8px Times font]
| Element | Subject | Sale 1 | Sale 2 | Sale 3 | Sale 4 | Sale 5 | Sale 6 |
|---------|---------|--------|--------|--------|--------|--------|--------|
| Sale Price | | ${{s1_price}} | ${{s2_price}} | ${{s3_price}} | ${{s4_price}} | ${{s5_price}} | ${{s6_price}} |
| Price/Unit | | ${{s1_ppu}} | ${{s2_ppu}} | ${{s3_ppu}} | ${{s4_ppu}} | ${{s5_ppu}} | ${{s6_ppu}} |
| **Transaction Adjustments** | | | | | | | |
| Property Rights | {{subj_rights}} | {{s1_rights_adj}} | {{s2_rights_adj}} | {{s3_rights_adj}} | {{s4_rights_adj}} | {{s5_rights_adj}} | {{s6_rights_adj}} |
| Financing | {{subj_financing}} | {{s1_fin_adj}} | {{s2_fin_adj}} | {{s3_fin_adj}} | {{s4_fin_adj}} | {{s5_fin_adj}} | {{s6_fin_adj}} |
| Conditions of Sale | {{subj_conditions}} | {{s1_cond_adj}} | {{s2_cond_adj}} | {{s3_cond_adj}} | {{s4_cond_adj}} | {{s5_cond_adj}} | {{s6_cond_adj}} |
| Market Conditions | {{subj_market}} | {{s1_mkt_adj}} | {{s2_mkt_adj}} | {{s3_mkt_adj}} | {{s4_mkt_adj}} | {{s5_mkt_adj}} | {{s6_mkt_adj}} |
| **Adjusted Price/Unit** | | ${{s1_adj_ppu}} | ${{s2_adj_ppu}} | ${{s3_adj_ppu}} | ${{s4_adj_ppu}} | ${{s5_adj_ppu}} | ${{s6_adj_ppu}} |
| **Property Adjustments** | | | | | | | |
| Location | {{subj_location}} | {{s1_loc_adj}} | {{s2_loc_adj}} | {{s3_loc_adj}} | {{s4_loc_adj}} | {{s5_loc_adj}} | {{s6_loc_adj}} |
| Size (Units) | {{subj_units}} | {{s1_size_adj}} | {{s2_size_adj}} | {{s3_size_adj}} | {{s4_size_adj}} | {{s5_size_adj}} | {{s6_size_adj}} |
| Age/Condition | {{subj_age}} | {{s1_age_adj}} | {{s2_age_adj}} | {{s3_age_adj}} | {{s4_age_adj}} | {{s5_age_adj}} | {{s6_age_adj}} |
| Quality | {{subj_quality}} | {{s1_qual_adj}} | {{s2_qual_adj}} | {{s3_qual_adj}} | {{s4_qual_adj}} | {{s5_qual_adj}} | {{s6_qual_adj}} |
| Amenities | {{subj_amenities}} | {{s1_amen_adj}} | {{s2_amen_adj}} | {{s3_amen_adj}} | {{s4_amen_adj}} | {{s5_amen_adj}} | {{s6_amen_adj}} |
| **Net Adjustment** | | {{s1_net_adj}} | {{s2_net_adj}} | {{s3_net_adj}} | {{s4_net_adj}} | {{s5_net_adj}} | {{s6_net_adj}} |
| **Adjusted Value/Unit** | | **${{s1_final_ppu}}** | **${{s2_final_ppu}}** | **${{s3_final_ppu}}** | **${{s4_final_ppu}}** | **${{s5_final_ppu}}** | **${{s6_final_ppu}}** |

Reconciliation of Sales Data
{{sales_reconciliation_analysis}}

Value Range: ${{sales_value_low}} - ${{sales_value_high}} per unit
Concluded Value Per Unit: ${{concluded_value_per_unit}}

[TABLE: Direct Comparison Value Conclusion]
| Component | Value |
|-----------|-------|
| Total Units | {{total_units}} |
| Concluded Value Per Unit | ${{concluded_value_per_unit}} |
| **Indicated Value** | **${{sales_comparison_value}}** |
| (Rounded) | **${{sales_comparison_value_rounded}}** |
```

### Fields (150+)
- 6 comparable sales with full details each
- Adjustment grid fields (subject + 6 sales × 10+ adjustments)
- Reconciliation fields
- Final value calculations

---

## Section 19: Reconciliation of Value

### Layout
- Value summary table
- Weighting analysis
- Final conclusion

### Template Content

```
Reconciliation of Value

[TABLE: Value Summary]
| Approach | Indicated Value | Weight |
|----------|-----------------|--------|
| Income Approach (Direct Capitalization) | ${{income_approach_value}} | {{income_weight}}% |
| Direct Comparison Approach | ${{sales_comparison_value}} | {{sales_weight}}% |

{{reconciliation_analysis}}

Final Value Conclusion

Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth in the body of this appraisal report, as of {{valuation_date}}, we have concluded the following:

[TABLE: Final Value]
| Value Scenario | Interest Appraised | Effective Date | Concluded Value |
|----------------|-------------------|----------------|-----------------|
| {{value_scenario}} | {{property_rights}} | {{valuation_date}} | **${{final_concluded_value}}** |

Value Indicators:
- Value Per Unit: ${{final_value_per_unit}}
- Value Per SF: ${{final_value_per_sf}}
- Overall Cap Rate: {{final_cap_rate}}%
- GIM: {{final_gim}}x
```

### Fields (15)
- Approach values and weights
- Reconciliation analysis
- Final concluded value
- Value indicators

---

## Section 20: Certification

### Layout
- Numbered certification statements
- Signature blocks

### Template Content

```
Certification

The undersigned certify that, to the best of our knowledge and belief:

1. The statements of fact contained in this report are true and correct.

2. The reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions, and are our personal, impartial, and unbiased professional analyses, opinions, and conclusions.

3. We have no present or prospective interest in the property that is the subject of this report, and we have no personal interest with respect to the parties involved.

4. We have no bias with respect to the property that is the subject of this report or to the parties involved with this assignment.

5. Our engagement in this assignment was not contingent upon developing or reporting predetermined results.

6. Our compensation for completing this assignment is not contingent upon the development or reporting of a predetermined value or direction in value that favours the cause of the client, the amount of the value opinion, the attainment of a stipulated result, or the occurrence of a subsequent event directly related to the intended use of this appraisal.

7. Our analyses, opinions, and conclusions were developed, and this report has been prepared, in conformity with the Canadian Uniform Standards of Professional Appraisal Practice.

8. {{appraiser_name}} has made a personal inspection of the property that is the subject of this report. {{additional_inspectors}}

9. {{assistance_certification}}

10. The reported analyses, opinions, and conclusions were developed, and this report has been prepared, in conformity with the requirements of the Code of Professional Ethics and Standards of Professional Appraisal Practice of the Appraisal Institute of Canada.

11. The use of this report is subject to the requirements of the Appraisal Institute of Canada relating to review by its duly authorized representatives.

12. As of the date of this report, {{appraiser_name}} has fulfilled the requirements of The Appraisal Institute of Canada's Continuing Professional Development Program.


[SIGNATURE BLOCK]
{{appraiser_name}}, {{appraiser_credentials}}
{{appraiser_title}}
{{appraiser_company}}
AIC #: {{appraiser_aic_number}}
Date: {{report_date}}
```

### Fields (10)
- Appraiser details
- Certification-specific text

---

## Section 21: Appendices

### Subsections

**A. Contingent & Limiting Conditions**
- Standard boilerplate conditions
- Assignment-specific conditions

**B. Definition of Terms**
- Market Value
- Fee Simple Estate
- Leased Fee Estate
- Effective Age
- Remaining Economic Life
- Capitalization Rate
- Net Operating Income
- Etc.

**C. Qualifications of the Appraiser**
```
{{appraiser_name}}, {{appraiser_credentials}}

Professional Designations
{{professional_designations}}

Education
{{education}}

Professional Memberships
{{memberships}}

Experience
{{experience_summary}}

Areas of Expertise
{{areas_of_expertise}}
```

### Fields (15+)
- Appraiser qualification fields

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Total Sections** | 21 |
| **Total Fields** | ~500+ |
| **Image Placeholders** | 30+ |
| **Dynamic Tables** | 14 |
| **Boilerplate Text Blocks** | 20+ |

### Field Categories
- Property Identification: ~50 fields
- Location/Site: ~40 fields
- Building Description: ~80 fields
- Financial (Income): ~100 fields
- Comparables (Sales): ~150 fields
- Market Data: ~30 fields
- Appraiser/Admin: ~30 fields
- Miscellaneous: ~20 fields

---

## Implementation Notes

### Required for HTML Templates
1. **Font embedding**: Times New Roman (or Times)
2. **Table styling**: Match exact border colors (#bfbfbf)
3. **Color codes**: #00000a, #ffffff, #808080, #333333, #666666
4. **Alignment**: Right-align for cover page, centered for captions
5. **Photo grid**: 2-column table with consistent cell sizing

### Data Sources
- V3 Dashboard fields → Map to template fields
- Supabase `job_submissions` table
- Supabase `job_loe_details` table
- Photo storage bucket

### Template Engine Requirements
- Support for `{{field_name}}` variable substitution
- Conditional sections (show/hide based on property type)
- Dynamic table row generation (unit mix, rent roll, comparables)
- Image placeholder replacement
- Page break controls for PDF generation

---

**Document Created:** December 4, 2025
**Based on Reference:** VAL251012 - North Battleford Apt DOCX (converted to HTML)
**Version:** 1.0
