# Boilerplate vs Dynamic Content Analysis
## Comprehensive Appraisal Report Comparison: North Battleford vs Drumheller

**Analysis Date:** 2025-12-12
**Method:** Section-by-section paragraph comparison using pandoc plain text conversion
**Reports Compared:**
- Property 1: North Battleford Apartments, SK (VAL251012) - 2,705 lines
- Property 2: Binscarth Apartments, Drumheller, AB (VAL251026) - 2,728 lines

---

## Executive Summary

### Overall Findings
- **Boilerplate Content:** ~75-80% of report text is identical or near-identical
- **Dynamic Content:** ~20-25% varies by property
- **Semi-Dynamic Content:** ~15% has same structure but different values

The reports follow a highly standardized template with most sections containing boilerplate text. Property-specific information is concentrated in specific areas: cover page, property overview, location analysis, site details, building description, and financial analysis.

### Key Insights for Template Development
1. **Standard CUSPAP sections** (definitions, certification, limiting conditions) are 100% boilerplate
2. **Methodological sections** (valuation approach descriptions, H&B use framework) are 90%+ boilerplate
3. **Property data sections** require ~50 primary dynamic fields
4. **Financial sections** require calculation engine with ~30 computed fields
5. **Conditional content** varies by value scenario type (As Stabilized vs As If Renovated)

---

## Section-by-Section Analysis

### 1. Cover Page / Title Page

**Boilerplate (30%):**
```
Appraisal Report
Multi-Family Walkup Property
PREPARED BY:
Valta Property Valuations Ltd.
300, 4838 Richard Road SW
Calgary, AB T3E 6L1
Office: 587-801-5151
www.valta.ca
```

**Dynamic (70%):**

| Element | North Battleford | Drumheller | Field Name |
|---------|------------------|------------|------------|
| Property Name | North Battleford Apartments | Binscarth Apartments | `{{property-name}}` |
| Address Line 1 | 1101, 1121 109 St | 802 Bankview Dr | `{{property-address-line1}}` |
| Address Line 2 | North Battleford, Saskatchewan | Drumheller, Alberta | `{{property-city-province}}` |
| Client Name | Kenneth Engler | Hermel Godbout | `{{client-name}}` |
| Client Title | (blank) | CEO | `{{client-title}}` |
| Client Company | 102109845 Saskatchewan Ltd. | 2766129 Alberta Ltd. and Calco Realty Holdings Inc. | `{{client-company}}` |
| Client Address | 1901, 1088 - 6th Ave SW, Calgary, AB T2P 5N3 | 121 Paris Street, Irishtown, NB E1H 0P4 | `{{client-address}}` |
| Valuation Date | October 17, 2025 | November 28, 2025 | `{{valuation-date}}` |
| Report Date | November 20, 2025 | December 12, 2025 | `{{report-date}}` |
| File Number | VAL251012 - 1 | VAL251026 | `{{file-number}}` |

---

### 2. Transmittal Letter

**Boilerplate (60%):**
```
[Date]

[Client Company]
[Client Address]

Attention: [Client Name], [Title]

Re: [Value Scenario] (Fee Simple Estate) current market value for the property located at [Address].

Valta Property Valuations Ltd. is proud to present the appraisal report that satisfies the agreed upon scope of work with [Client Company]. The purpose of this assignment is to provide the [Value Scenario] current market value of the property [scenario details] located at [Address] (herein referred to as the 'subject property').

[Property description paragraph - mixed]

Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth in the body of this appraisal report, as of the effective date, we have concluded the following:

[Value conclusion table - dynamic]

[Hypothetical Conditions section - variable]

[Extraordinary Assumptions section - variable]

Extraordinary Limiting Conditions

No Extraordinary Limiting Conditions were made for this assignment.

The report has been completed in accordance with the Canadian Uniform Standards of Professional Appraisal Practice ("CUSPAP") adopted January 1, 2024. The full narrative appraisal report that follows sets forth the pertinent data and analyses leading to the conclusions presented herein. The appraisal requirements section of this report sets out the basis of the appraisal, definitions and the valuation methodology and must be read to gain a full understanding of the process.

If there are any specific questions or concerns regarding the attached appraisal report, or if Valta can be of additional assistance, please contact the individuals listed below.

Respectfully Submitted,

VALTA PROPERTY VALUATIONS LTD.

Chris Chornohos, AACI, MRICS
Founder
chris.chornohos@valta.ca
AIC No: 902097
```

**Dynamic (40%):**

| Field | North Battleford | Drumheller | Field Name |
|-------|------------------|------------|------------|
| Value Scenario | As Stabilized | As Is and As If Renovated & Stabilized | `{{value-scenario-type}}` |
| Scenario Description | "which at the time of inspection represents the improved property as of the effective date and leased up at market rental rates and operating costs" | "which at the time of inspection represents the improved property as of the effective date" | `{{scenario-description}}` |

**Semi-Dynamic - Property Description Paragraph:**
```
The subject property, located at {{property-address}}, is a multi-family, walkup property with improvements located in {{city-name}}. The improvements are comprised of {{building-count}} total buildings, and consist of {{nra-sqft}} square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in {{year-built}}; ({{year-built-weighted}} weighted) is approximately {{occupancy-percent}}% occupied and features {{unit-count}} units in a {{story-count}}-story, garden style format.
```

North Battleford values:
- `{{building-count}}` = 2
- `{{nra-sqft}}` = 10,204
- `{{year-built}}` = 1970
- `{{occupancy-percent}}` = 100.0
- `{{unit-count}}` = 16
- `{{story-count}}` = 2

Drumheller values:
- `{{building-count}}` = 1
- `{{nra-sqft}}` = 18,117
- `{{year-built}}` = 1981
- `{{occupancy-percent}}` = 91.7
- `{{unit-count}}` = 24
- `{{story-count}}` = 3

---

### 3. Hypothetical Conditions & Extraordinary Assumptions

**VARIABLE SECTION - Content differs significantly between reports**

**North Battleford (As Stabilized scenario):**
```
Hypothetical Conditions

The use of a hypothetical condition(s) may have impacted the results of the assignment. The As Stabilized value has been developed based on the hypothetical condition that the subject property is fully leased at prevailing market rents and has achieved stabilized occupancy as of the effective date of the appraisal. Under this premise, no deductions are made for holding costs, rent loss, or lease-up expenses. In addition it is a hypothetical condition that all units could achieve current market rent levels and stabilized occupancy as of the effective date. In reality, as of the effective date, the property's existing lease terms reflect contract rents that are deemed to be below-market rents. For the purposes of this analysis, it is assumed that lease-up to market rent levels has occurred under typical market conditions, without undue delay or concessions exceeding market norms. If this assumption proves incorrect, such as market rents are not achievable the value conclusion may be materially impacted.

Extraordinary Assumptions

No Extraordinary Assumptions were made for this assignment.
```

**Drumheller (As If Renovated & Stabilized scenario):**
```
Hypothetical Conditions

The use of a hypothetical condition(s) may have impacted the results of the assignment. The As If Renovated & Stabilized market value concluded herein has been developed under the hypothetical condition that the existing improvements, as described in this report, have been fully renovated and have been leased at market rents with stabilized occupancy as of the effective date. In reality, the renovations are not complete as of the effective date. This appraisal does not consider unforeseeable events that could affect the timing, cost, or outcome of the renovation and lease-up process. If the stated hypothetical condition does not hold true, the value conclusion presented herein may be materially affected.

Extraordinary Assumptions

The use of an extraordinary assumption(s) may have impacted the results of the assignment. The As If Renovated & Stabilized market value concluded herein has been developed under the extraordinary assumption that the existing improvements, as described in this report, have been fully renovated and have been leased at market rents with stabilized occupancy as of the effective date. In reality, the renovations are not complete as of the effective date. This appraisal does not consider unforeseeable events that could affect the timing, cost, or outcome of the renovation and lease-up process. If the stated hypothetical condition does not hold true, the value conclusion presented herein may be materially affected.
```

**Template Strategy:**
These sections need conditional templates based on `{{value-scenario-type}}`:
- `{{hypothetical-conditions-text}}` - varies by scenario
- `{{extraordinary-assumptions-text}}` - varies by scenario
- Common fallback: "No Extraordinary Assumptions were made for this assignment."
- Common constant: "No Extraordinary Limiting Conditions were made for this assignment."

---

### 4. Table of Contents

**Boilerplate (90%):**
Identical structure in both reports with minor page number differences.

**Dynamic (10%):**
Page numbers vary based on report length.

**Template:** Static structure, dynamic page numbers can be auto-generated.

---

### 5. Property Overview Section

**Boilerplate (40%):**
```
Introduction & Executive Summary

PROPERTY OVERVIEW

[Tables/summary boxes - dynamic content]

Hypothetical Conditions
[Variable text based on scenario]

Extraordinary Assumptions
[Variable text based on scenario]

Extraordinary Limiting Conditions
No Extraordinary Limiting Conditions were made for this assignment.
```

**Dynamic (60%):**
Property overview tables contain all property-specific data (address, building details, financial metrics).

---

### 6. Photographs Section

**Boilerplate (20%):**
```
PHOTOGRAPHS
```

**Dynamic (80%):**
- All photo captions are property-specific
- Photo layout and count varies by property
- Building-specific labels (e.g., "1101 - East Elevation" vs "Front Elevation")

**Field Examples:**
- `{{photo-caption-array}}` - array of photo descriptions
- Photos are completely property-specific

---

### 7. Maps Section

**Boilerplate (100%):**
```
MAPS
[Map images]
```

**Dynamic (100%):**
All map images are property-specific. No boilerplate text.

---

### 8. Identification of Assignment

**Boilerplate (50%):**
```
IDENTIFICATION OF ASSIGNMENT

Property Identification

The subject property, located at [address], is a multi-family, walkup property with improvements located in [city].

The improvements are comprised of [X] total buildings, and consist of [X,XXX] square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in [YEAR]; ([YEAR] weighted) is approximately [XX.X]% occupied and features [XX] units in a [X]-story, garden style format.

Legal Description

[Legal description - dynamic]

Authorized Client Identification

The authorized client of this specific assignment is [Client Company].

Authorized Use & Authorized Users

The authorized use of this report is for first mortgage financing purposes. [Client Company] is the only authorized user of this report.

Effective Date of Value and Report Date

The effective date of value of this appraisal is [Date]. The report date is [Date].

Inspection Date

[Date]

Purpose

The purpose of this assignment is to provide the [Value Scenario] [scenario description] for the property located at [Address] (herein referred to as the 'subject property').
```

**Dynamic (50%):**

| Field | North Battleford | Drumheller | Field Name |
|-------|------------------|------------|------------|
| Legal Description | Plan - C4240; Block - 95; Lot - 17,18, 19, 20 | Condo Plan 9711306, Unit 1 - 24 | `{{legal-description}}` |
| Inspection Date | October 17, 2025 | November 28, 2025 and January 25, 2022 | `{{inspection-date}}` |

**Property and Sales History Section:**

**Boilerplate (70%):**
```
Property And Sales History

Current Owner

The subject property is currently under the ownership of [Owner Name].

Three-Year Sales History

Ownership of the subject property has not changed in the past three years. [Additional details if applicable]
```

**Dynamic (30%):**

| Field | North Battleford | Drumheller | Field Name |
|-------|------------------|------------|------------|
| Current Owner | 102109845 Saskatchewan Ltd. | 523023 Alberta Ltd. | `{{current-owner}}` |
| Sales History Details | "We are unaware of any pending sales or listing activity relating to the subject property." | "As noted, the subject property is currently under contract by our client at a sale price of $3,000,000. Offer was signed November 18, 2025 with final waiver on February 06, 2026 and closing March 17, 2026." | `{{sales-history-details}}` |

**Exposure & Marketing Time Section:**

**Boilerplate (95%):**
```
Exposure & Marketing Time

An estimate of market value is related to the concept of reasonable exposure time. Exposure time is the property's estimated marketing time prior to a hypothetical sale at market value on the effective date of the appraisal. It is a retrospective function of asking price, property type, and past market conditions and encompasses not only adequate, sufficient and reasonable time but also adequate, sufficient and reasonable effort. Reasonable exposure time is a necessary element of a market value definition but is not a prediction of a specific date of sale.

In appraisal theory and practice, there is a distinction relating to the perspective between exposure time and marketing time. Exposure time is presumed to precede the effective date of appraisal whereas marketing time is presumed to succeed the effective date. Marketing time is a prospective function of asking price, property type, and anticipated market conditions. The exposure period assumes the following:

- The property was extensively marketed. Potential purchasers could inspect the property at will.

- The owner provided interested agents with any and all relevant property information.

- Negotiations of any offers to purchase were performed in a timely manner.

- The property was maintained at a physical status equivalent to its present condition.

- Market level financing was readily available.

- The seller was not under duress.

A marketing time estimate is a forecast of a future occurrence. History should be considered as a guide, but anticipation of future events and market circumstances should be the prime determinant.

Noting the subject property's physical, legal, economic and market characteristics, which are described further in this report, we have concluded a reasonable estimate of exposure and marketing time for the subject property to be six months.
```

**Dynamic (5%):**
- `{{exposure-time-conclusion}}` = "six months" (same in both reports)

**Definition of Market Value Section:**

**Boilerplate (100%):**
Identical in both reports - complete CUSPAP definition.

**Property Rights Appraised Section:**

**Boilerplate (100%):**
```
Property Rights Appraised

The property rights appraised constitute the fee simple estate interest.

Fee Simple Interest

Absolute ownership unencumbered by any other interest or estate, subject only to the limitations imposed by the governmental powers of taxation, eminent domain, police power and escheat. The subject multifamily property is appraised under the fee simple interest, as residential tenancies are typically short-term in nature and do not constitute long-term encumbrances on the estate that would give rise to a leased fee interest.

Value Scenarios

Current Value

Current Value Opinion refers to an effective date at the time of inspection or, at some other date within a reasonably short period of time from the date of inspection when market conditions have not or are not expected to have changed.
```

---

### 9. Scope of Work

**Boilerplate (85%):**
```
Scope of Work

The scope of work for this appraisal assignment is outlined below:

- The appraisal analyzes legal and physical features of the subject including site size, improvement size, site zoning, easements, encumbrances, site access and site exposure.

- The appraisal includes a market analysis for the [Market Name] market and [Submarket Name] submarket using vacancy and rent data. Conclusions were drawn for the subject's competitive position given its physical and locational features, current market conditions and external influences.

- Research of recent sale and rent comparables. Examined market conditions and analyzed their potential effect on the various properties.

- The appraisal includes a Highest and Best Use analysis and conclusions have been completed for the highest and best use of the subject property As Though Vacant and [As Improved/As Proposed]. The analysis considered legal, locational, physical and financial feasibility characteristics of the subject site and existing improvements.

- In selecting applicable approaches to value, the appraiser considered the agreed upon appraisal scope and assessed the applicability of each traditional approach given the subject's characteristics and the intended use of the appraisal. As a result, this appraisal developed Direct Comparison and Income (Direct Capitalization) Approaches. The values presented represent the [Value Scenarios].

- The assignment was prepared as an Appraisal Report in accordance with CUSPAP, with the analysis stated within the document and representing a fully described level of analysis.

- The author of this report has the knowledge and experience to complete this assignment competently.

The following work was not undertaken as it was not required for credible results within the scope of this concise assignment in conformity with CUSPAP 2024.

- Environmental reports, building condition assessments, and title searches were not reviewed by the appraiser and are assumed to be satisfactory unless otherwise stated.

- The appraiser did not review title documents or legal encumbrances other than zoning information provided by municipal sources.

- No verification of building permits, code compliance, or outstanding orders was undertaken.

- Rent rolls, leases and operating statements, were accepted as accurate without audit or verification.

- Discussions with market participants were limited to informal inquiries and published sources.

This appraisal was completed in conformity with the CUSPAP 2024 Appraisal Standard and the Reporting Standard for a Concise Report, which requires inclusion of all relevant information necessary to produce a credible result, summarized in narrative form with supporting detail in the work file.
```

**Dynamic (15%):**

| Field | North Battleford | Drumheller | Field Name |
|-------|------------------|------------|------------|
| Market Name | North Battleford | Drumheller | `{{market-name}}` |
| Submarket Name | North Battleford | Drumheller | `{{submarket-name}}` |
| H&B Use Scenario | "As Improved" | "As Proposed" | `{{hbu-scenario}}` |
| Value Scenarios | "As Stabilized (Fee Simple Estate)" | "As Is (Fee Simple Estate) and As If Renovated & Stabilized (Fee Simple Estate)" | `{{value-scenarios-list}}` |

**Assistance Provided Section:**

**VARIABLE CONTENT:**

North Battleford:
```
Assistance Provided

Paul Liboiron of Insight Home Inspections Ltd., a member of Alberta Professional Home Inspectors Society provided real property appraisal assistance to the appraisers signing this certification. Assistance provided includes property inspection. Paul Liboiron is registered as a non-member with the AIC to provide professional assistance with real property inspection.
```

Drumheller:
```
Assistance Provided

No one provided real property appraisal assistance to the appraiser signing this certification. Assistance provided includes miscellaneous administrative assistance, such as file and exhibit preparation, as well as data entry relating to area descriptions and other routine front-half related duties.
```

**Field:** `{{assistance-provided-text}}`

**Sources of Information Section:**

**Boilerplate (100%):**
```
Sources of Information

The following sources were contacted to obtain relevant information:

[Table - dynamic]

The lack of the unavailable items could affect the results of this analysis. As part of the general assumptions and limiting conditions, the subject is assumed to have no adverse easements, significant items of deferred maintenance, or be impacted by adverse environmental conditions.
```

**Subject Property Inspection Section:**

**Boilerplate (100%):**
```
Subject Property Inspection

[Table - dynamic]
```

**Personal Property & Business Intangible Section:**

**Boilerplate (100%):**
```
Personal Property & Business Intangible

There is no personal property (FF&E) included in this valuation. There is not any business or intangible value included in the value conclusion reported herein.
```

---

### 10. Property Analysis - Location Section

**Boilerplate (30%):**
```
Property Analysis

LOCATION

The subject property is located [location description].

Access
[Access description]

Public Transportation
[Transit description]

Walk/Bike/Transit Scores
[Scores description]

Local Area
[Area description]

Nearby Schools
[Schools list]
```

**Dynamic (70%):**
All descriptive text is property-specific.

**North Battleford Example:**
```
The subject property is located in North Battleford, Saskatchewan, in a centrally situated residential area near key commercial corridors and the downtown core.

Access
The property fronts 109 Street with convenient connections to major arterials including 100th Street/Highway 4 (north–south route to downtown and Highway 16) and Territorial Drive (east–west/loop connecting retail and services).

Public Transportation
Local bus service operates on nearby corridors such as 100th Street and Territorial Drive, providing direct access to downtown, retail centres, and community facilities.

Walk/Bike/Transit Scores
The immediate area offers moderate walkability and cycling potential, with an estimated Walk Score around 60, Transit Score near 35, and Bike Score around 55, reflecting car-optional access for daily needs.
```

**Drumheller Example:**
```
The subject property is located at 802 Bankview Drive in the Bankview neighbourhood of Drumheller, Alberta, on the south side of the Red Deer River valley just across Highway 9 from the main townsite. The area is a quiet residential community of single-family homes and low-rise apartments with convenient highway access to Drumheller's commercial core, health services, and major attractions in the Canadian Badlands.

Access
• Highway 9 / South Railway Avenue – primary east–west highway and commercial corridor
• Highway 56 – north–south connector to regional centres
• Highway 575 / South Dinosaur Trail – east–west route along the valley

Public Transportation
Public transportation in Drumheller is limited, with no fixed-route local transit system. Residents typically rely on private vehicles, taxis, or limited regional shuttle/coach services. The area is therefore primarily auto-oriented for daily travel.

Walk/Bike/Transit Scores
Bankview is a car-dependent neighbourhood. Estimated Walk Score is around 28, Bike Score in the mid-40s, and Transit Score approximately 10, reflecting limited transit and reliance on vehicle travel.
```

**Template Fields:**
- `{{location-overview-text}}`
- `{{access-description}}`
- `{{transit-description}}`
- `{{walk-bike-scores-text}}`
- `{{local-area-description}}`
- `{{nearby-schools-list}}` (optional - Drumheller has this, North Battleford has slightly different format)
- `{{demographics-text}}` (Drumheller only)

---

### 11. Site Details Section

**Boilerplate (60%):**
```
SITE DETAILS

The subject property consists of one parcel with a total site area of [XX,XXX] SF ([X.XX] AC) which is based on information obtained from [Source]. [Legal plan statement]. The following summarizes the salient characteristics of the subject site.

Address [Full Address]

[Table - dynamic]

Adjacent Properties

North [Description]
South [Description]
East [Description]
West [Description]

Accessibility Access to the subject site is considered average overall.

[Table/rating - dynamic]

Exposure & Visibility

Exposure of the subject is average noting frontage on [Street Names]

Easements

A legal opinion regarding title information was not provided or commissioned in conjunction with this assignment. Under the scope of this appraisal, it is assumed that any legal notations and registered charges on title do not adversely affect the highest and best use of the subject property as described herein, unless otherwise noted. If there is any concern on the part of the reader with respect to the status of title, we recommend a legal opinion be obtained. A copy of the subject property title has been inserted in the appendix to this report if further information is required.

Soils

We have not undertaken a detailed soil analysis and we are not qualified to comment on soil conditions. As such, the soils are assumed to be similar to other lands in the area and suitable in drainage qualities and load bearing capacity to support the existing development.

Hazardous Waste

Based on a review of an independent investigation to determine the presence or absence of toxins on the subject property, none are present. If questions arise, the reader is strongly cautioned to seek qualified professional assistance in this matter. Please see the Assumptions and Limiting Conditions for a full disclaimer.

Site Rating

Overall, the subject site is considered average as a multi-family site in terms of its location, exposure and access to employment, education and shopping centers, based on its location along a minor arterial.

Site Conclusion

In conclusion, the site's physical characteristics appear to be supportive of the subject's current use and there were no significant detriments discovered that would inhibit development in accordance with its highest and best use.
```

**Dynamic (40%):**

| Field | North Battleford | Drumheller | Field Name |
|-------|------------------|------------|------------|
| Site Area | 24,400 SF (0.56 AC) | 30,514 SF (0.70 AC) | `{{site-area-sf}}`, `{{site-area-ac}}` |
| Source | ICS | Client | `{{site-area-source}}` |
| Adjacent North | Residential | Residential | `{{adjacent-north}}` |
| Adjacent South | Residential | Residential | `{{adjacent-south}}` |
| Adjacent East | Residential | Vacant Land | `{{adjacent-east}}` |
| Adjacent West | Residential | Residential | `{{adjacent-west}}` |
| Frontage Streets | "109 Street & 11 Avenue" | "Bankview Dr and Delbourne Road" | `{{frontage-streets}}` |

---

### 12. Property Taxes & Assessment

**Boilerplate (80%):**
```
PROPERTY TAXES & ASSESSMENT

Real Estate Taxes

The subject's assessment and taxes are shown in the following table:

[Table - dynamic]

Taxation & Assessment Commentary

The assessed value is below the value concluded herein, a tax assessment appeal is not warranted.

The assessed value is lower than our valuation herein. Smaller markets tend to under assess real property assets in comparison to larger markets.
```

**Dynamic (20%):**
- Assessment table data (completely property-specific)

**Note:** The commentary is identical in both reports (boilerplate).

---

### 13. Land Use & Planning

**Boilerplate (70%):**
```
LAND USE & PLANNING

The subject is located in the [Zoning District Name] ([Code]) zoning area which is [zoning description].

[Zoning details table - dynamic]

Zoning Conclusion

The current use for the subject property is walkup and is a permitted use based on the current zoning guidelines. [Additional zoning statement]. Based on the foregoing, it appears that the subject's improvements are a legally conforming use of the subject site.

Zoning Map

[Map - dynamic]
```

**Dynamic (30%):**

| Field | North Battleford | Drumheller | Field Name |
|-------|------------------|------------|------------|
| Zoning District | Low Density Residential District (R2) | Neighbourhood District (ND) | `{{zoning-district}}` |
| Zoning Description | "a Low Density Residential District" | "to enable primarily ground-oriented residential development with an emphasis on diverse, walkable neighbourhoods with varying built forms and housing typologies" | `{{zoning-description}}` |
| Zoning Statement | "No zoning change is believed to be imminent." | "A zoning change for the subject does not appear likely." | `{{zoning-change-statement}}` |

---

### 14. Description of the Improvements

**Boilerplate (50%):**
```
DESCRIPTION OF THE IMPROVEMENTS

The information presented below is a basic description of the [existing/proposed] improvements that are used in the valuation of the property. Reliance is placed on information provided by sources deemed dependable for this analysis. It is assumed that there are no hidden defects, and that all structural components are functional and operational, unless otherwise noted. If questions arise regarding the integrity of the improvements or their operational components, it may be necessary to consult additional professional resources. The sizes are based on the information provided by the client and from public sources.

Overview

The subject property, located at [Address], is a multi-family, walkup property with improvements located in the [City].

The improvements are comprised of [X] building(s), and consist of [XX,XXX] square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in [YEAR] [and additional statements], is approximately [XX.X]% occupied and features [XX] units in a [X]-story, garden style format.

[Tables - dynamic]

Building Description

[Table with building components - semi-dynamic]
```

**Semi-Dynamic - Building Description Table (40%):**

| Component | North Battleford | Drumheller | Notes |
|-----------|------------------|------------|-------|
| Project Amenities | Guest Parking | Guest Parking | **SAME** |
| Unit Amenities | Deck/Patio, Range/Stove, Refrigerator | Deck/Patio, Range/Stove, Refrigerator | **SAME** |
| Laundry | On Site | On Site | **SAME** |
| Security Features | Deadbolts, Exterior Lighting, Secured Entry | Deadbolts, Exterior Lighting, Secured Entry | **SAME** |
| Foundation | Concrete footings and walls | Concrete | Different |
| Exterior Walls/Framing | 1121 - Brick, 1101 Stucco/Wood frame | Wood siding and stucco/Wood frame | Different |
| Roof | Flat built up membrane | Asphalt shingles | Different |
| Elevator | None | None | **SAME** |
| Heating & AC (HVAC) | 1101 - 8 Furnaces, 1121 - Boilers with baseboard radiant heat | Boilers with baseboard radiant heat | Different |
| Insulation | Fiberglass | Fiberglass | **SAME** |
| Lighting | Various | Various | **SAME** |
| Electrical | (not shown) | Individually metered | Different |
| Interior Walls | (not shown) | Painted drywall | May be standard |

**Template Strategy:**
Most amenity fields are standardized for walkup apartments:
- `{{project-amenities}}` = "Guest Parking" (default)
- `{{unit-amenities}}` = "Deck/Patio, Range/Stove, Refrigerator" (default)
- `{{laundry}}` = "On Site" (default)
- `{{security-features}}` = "Deadbolts, Exterior Lighting, Secured Entry" (default)
- `{{elevator}}` = "None" (for walkups)
- `{{insulation}}` = "Fiberglass" (default)
- `{{lighting}}` = "Various" (default)

Variable fields:
- `{{foundation-type}}`
- `{{exterior-walls}}`
- `{{roof-type}}`
- `{{hvac-description}}`
- `{{electrical-description}}`

---

### 15. Market Context / Economic Overviews

**Boilerplate (20%):**
```
Market Context / Economic Overviews

[Section title varies]

[Content is heavily customized by market]
```

**Dynamic (80%):**
All economic and market overview content is city/region-specific. No reusable boilerplate.

---

### 16. Multi-Family Market Overview

**Boilerplate (30%):**
Section structure is similar, but content is market-specific.

**Dynamic (70%):**
Market vacancy rates, rental trends, supply/demand analysis - all property/market-specific.

---

### 17. Highest & Best Use

**Boilerplate (60%):**
```
HIGHEST & BEST USE

[As Though Vacant Analysis - semi-boilerplate]

The legal factors influencing the highest and best use of the subject property are primarily governmental regulations such as zoning and building codes. [Details]. The physical and locational characteristics [details]. Financially, [market analysis].

The five possible alternative uses are [list of alternatives with reasoning]. Among the five alternative uses, a continuation of the multifamily use is the Highest and Best Use of the subject is As Though Vacant.

As [Improved/Proposed] Analysis

[Similar structure with property-specific details]

Among the five alternative uses, a continuation of the multifamily [scenario] is the Highest and Best Use of the subject is As [Improved/Proposed].

Most Probable Buyer

Based on the type of property and the income generating potential of the improvements, it is our opinion that the most probable buyer for the subject would be a local or regional investor As [Improved/Proposed].
```

**Dynamic (40%):**
- Specific analysis details
- Zoning references
- Market feasibility analysis
- `{{hbu-scenario}}` = "As Improved" or "As Proposed"

---

### 18. Valuation Methodology

**Boilerplate (90%):**
```
VALUATION METHODOLOGY

In traditional valuation theory, the three approaches to estimating the value of an asset are the cost approach, sales comparison approach, and income capitalization approach. Each approach assumes valuation of the property at the property's highest and best use. From the indications of these analyses, an opinion of value is reached based upon expert judgment within the outline of the appraisal process.

Land Valuation

Characteristics specific to the subject property do not warrant that a site value is developed.

Cost Approach

The cost approach considers the cost to replace the proposed improvements, less accrued depreciation, plus the market value of the land. The cost approach is based on the understanding that market participants relate value to cost. The value of the property is derived by adding the estimated value of the land to the current cost of constructing a reproduction or replacement for the improvements and then subtracting the amount of depreciation in the structure from all causes. Profit for coordination by the entrepreneur is included in the value indication. Considering the limited applicability of this approach in relation to the subject property's characteristics, we have not undertaken the Cost Approach. The Cost Approach has limited applicability due to the age of the improvements and lack of market based data to support an estimate of accrued depreciation. Based on the preceding information, the Cost Approach has not been undertaken as part of this analysis.

Investors typically do not place emphasis on replacement cost in establishing value for investment properties. The exclusion of the Cost Approach does not diminish the credibility of the value conclusion.

Sales Comparison Approach / Direct Comparison Approach

The [sales/direct] comparison approach estimates value based on what other purchasers and sellers in the market have agreed to as price for comparable properties. This approach is based upon the principle of substitution, which states that the limits of prices, rents, and rates tend to be set by the prevailing prices, rents, and rates of equally desirable substitutes. In conducting the sales comparison approach, [we/I] gather data on reasonably substitutable properties and make adjustments for transactional and property characteristics. The resulting adjusted prices lead to an estimate of the price one might expect to realize upon sale of the property.

We have undertaken the Direct Comparison Approach as part of this assignment. Considering the applicability of this approach in relation to the subject property's characteristics, we consider the application of this approach to be warranted.

Income Capitalization Approach

The income capitalization approach ("income approach") simulates the reasoning of an investor who views the cash flows that would result from the anticipated revenue and expense on a property throughout its lifetime. The net income developed in our analysis is the balance of potential income remaining after vacancy and collection loss, and operating expenses. This net income is then capitalized at an appropriate rate to derive an estimate of value or discounted by an appropriate yield rate over a typical projection period in a discounted cash flow analysis. Thus, two key steps are involved: (1) estimating the net income applicable to the subject and (2) choosing appropriate capitalization rates and discount rates. The appropriate rates are ones that will provide both a return on the investment and a return of the investment over the life of the particular property.

We have undertaken the Income Approach as part of this assignment. The subject property comprises an income generating asset and as such, we consider the inclusion of this approach warranted. In undertaking this approach, we have relied on the Direct Capitalization method only as the Discounted Cash Flow method does not contribute substantially to estimating the market value of the subject property beyond the Direct Capitalization method.

Correlation and Conclusion

[Upon/Based upon] scope with the authorized client, the subject's specific characteristics and the interest appraised, this appraisal developed Direct Comparison and Income (Direct Capitalization) Approaches. The values presented represent the [Value Scenarios]. This appraisal does not develop the Cost Approach, the impact of which is addressed in the reconciliation section.
```

**Dynamic (10%):**
- Minor word variations ("we" vs "I", "Sales Comparison" vs "Direct Comparison")
- `{{value-scenarios-list}}` in final paragraph

**Note:** One minor difference - Drumheller uses "I gather" instead of "we gather" in Sales Comparison section, suggesting possible authorship variation.

---

### 19. Income Approach

**Boilerplate (40%):**
```
INCOME APPROACH

The Income Approach is based on the premise that properties are purchased for their income producing potential. It considers both the annual return on the invested capital and the return of the invested capital. The two fundamental methods of this valuation technique include Discounted Cash Flow and Direct Capitalization. The Direct Capitalization method of the Income Approach is used in this analysis. This valuation technique best represents the decision-making process of an investor.

Direct Capitalization Method

The first step in direct capitalization is to estimate the durable rental income through analysis of the in-place or projected (proposed developments) leases and market rent terms. Next, reimbursements and other revenue are analyzed. Then, vacancy and operating expenses are estimated. Finally, the net operating income is capitalized at a supported rate. The implied value may be adjusted to account for non-stabilized conditions or required capital expenditures to reflect an as-is value.

Multi-Family Revenue Analysis

Multi-Family Subject Rent Roll

The following table summarizes the subjects in place unit mix and rental rates.

[Table - dynamic]

The majority of the subject tenant leases are on 12-month leases. In addition, security deposit fees for the property equal one month's rent. The landlord pays for all utilities except electricity.

Multi-Family Market Rent Survey Analysis

This section examines comparable properties within the marketplace to estimate market rent for the subject. This allows for a comparison of the subject property's contract [rent/rent to what is attainable in the current market].

Unit of Comparison

The analysis is conducted on a dollar per square foot, per month basis, reflecting market behavior. The total dollar per month per unit is also considered.

Selection of Comparables

A complete search of the area was conducted to find the most comparable properties in terms of location, tenancy, age, exposure, quality, and condition. The comparables in this analysis are the most reliable indicators of market rent for the subject available at the time of this appraisal.

Concessions

Currently landlords are not offering concessions.

Presentation

The following summarizes the comparables most similar to the subject property. The Survey Comparison Table, location map, photographs, and an analysis of the rent survey are presented on the following pages.

[Rent comp tables - dynamic]

Conclusion Of Market Rent - Multi-Family

The following table summarizes the various indicators of market rent for each unit type and provides the market rent analysis and the conclusions for the subject property.

[Market rent tables - dynamic]

Unit Rent Discussion

[Property-specific analysis - dynamic]

Contract Versus Market Rent

Based on the previous conclusions, the subject's average contract rent is [XX.X]% of market rents.

[Table - dynamic]

Total Rental Revenue - Multi-Family

The Total Rental Revenue for the Multi-Family component is summarized in the table below. The subject's average contract rent is [XX.X]% of market rents. Market rents are applied in our analysis.

[Table - dynamic]

[Miscellaneous Revenue section - optional in Drumheller]

The following table summarizes the miscellaneous revenue projected for the subject property.

[Table - dynamic]

Potential Gross Revenue (PGR)

The potential gross revenue equals the total rental revenue plus reimbursement and miscellaneous revenue. The potential gross revenue of the subject is calculated by multiplying the sum of market rent of $[XX,XXX]/Unit and $[XX.XX] per square foot rent and reimbursements, if any, at $0 which is $0/Unit and -/SF by the net rentable area of [XX,XXX] square feet, which indicates a PGR of $[XXX,XXX].

Vacancy Allowance

This category accounts for the time period between occupants, as well as possible prolonged vacancies under slow market conditions. Market participants typically expect a vacancy of 2% to 5% of potential gross income for similar property types. This assignment reflects the probable vacancy during the economic life of the property and not necessarily the current or short-term vacancy. The findings of the Multi-Family Market Overview section support a typical vacancy allocation. As of the effective date, the subject is [XX.X]% occupied. Based on current and perceived long-term market conditions and the subject's anticipated tenancy over a typical holding period, a vacancy allowance of [X.X]% is concluded.

[Table - dynamic]

Effective Gross Revenue (EGR)

Effective gross revenue equals the potential gross revenue less vacancy. The total effective gross revenue for the subject is $[XXX,XXX] which is $[XX,XXX]/Unit and $[XX.XX]/SF.

Operating Expenses

We have reviewed the owner's historical operating expenses. As appropriate, the owner's operating expenses are reclassified into standard categories and exclude items that do not reflect normal operating expenses for this type of property. The reclassification is done for proper analysis against comparable data and industry benchmarks as appropriate. The subject's historical operating expenses with our projections are shown in the following chart.

[Tables - dynamic]

Expense Conclusions

The individual expense conclusions for the subject are summarized below.

[Table - dynamic]

Net Operating Income (NOI)

The net operating income equals the effective gross income less the total expenses. The total net operating income for the subject is $[XXX,XXX] which is $[X,XXX]/Unit and $[XX.XX]/SF.

Capitalization Rate Selection

[Cap rate analysis - semi-boilerplate with dynamic market data]

[Value conclusion - dynamic]
```

**Dynamic (60%):**
- All tables (rent rolls, comps, expenses, revenue)
- All financial calculations
- Market rent analysis
- Property-specific rent discussions
- Cap rate market data
- Final value conclusions

**Semi-Dynamic:**
- Lease terms descriptions (mostly similar)
- Utility payment structures
- Vacancy percentages
- Operating expense commentary

---

### 20. Direct Comparison Approach: Multifamily

**Boilerplate (30%):**
```
DIRECT COMPARISON APPROACH: MULTIFAMILY

[Introduction to approach - similar structure]

[Sales comparable tables - dynamic]

[Sales comparable photos - dynamic]

[Adjustment analysis - dynamic]

[Value conclusion - dynamic]
```

**Dynamic (70%):**
- All comparable sales data
- Adjustment grids
- Photos
- Analysis narrative
- Final value indications

---

### 21. Reconciliation of Value

**Boilerplate (50%):**
```
RECONCILIATION OF VALUE

[Approach weight discussion - semi-boilerplate]

[Value conclusion - dynamic]
```

**Dynamic (50%):**
- Specific value indications from each approach
- Final reconciled value
- Scenario-specific conclusions

---

### 22. Certification

**Boilerplate (95%):**
Standard CUSPAP certification language.

**Dynamic (5%):**
- Appraiser signature
- Date
- Project-specific references

---

### 23. Appendices

**Appendix: Contingent & Limiting Conditions**

**Boilerplate (100%):**
Identical standard conditions in both reports.

**Appendix: Definition of Terms**

**Boilerplate (100%):**
Identical standard definitions in both reports (CUSPAP terms).

**Appendix: Qualifications of the Appraiser**

**Boilerplate (100%):**
Same appraiser in both reports (Chris Chornohos).

---

## Summary of Template Field Requirements

### High Priority Dynamic Fields (Cover to Executive Summary)

**Property Identification:**
- `{{property-name}}`
- `{{property-address-line1}}`
- `{{property-address-line2}}`
- `{{property-city}}`
- `{{property-province}}`
- `{{property-city-province}}`
- `{{property-full-address}}`

**Client Information:**
- `{{client-name}}`
- `{{client-title}}` (optional)
- `{{client-company}}`
- `{{client-address-full}}`

**Report Metadata:**
- `{{valuation-date}}`
- `{{report-date}}`
- `{{inspection-date}}`
- `{{file-number}}`

**Building Statistics:**
- `{{building-count}}`
- `{{nra-sqft}}`
- `{{year-built}}`
- `{{year-built-weighted}}` (optional)
- `{{occupancy-percent}}`
- `{{unit-count}}`
- `{{story-count}}`
- `{{building-style}}` (e.g., "garden style")

**Site Information:**
- `{{site-area-sf}}`
- `{{site-area-ac}}`
- `{{site-area-source}}`
- `{{legal-description}}`

**Ownership & Sales:**
- `{{current-owner}}`
- `{{sales-history-details}}`
- `{{authorized-use}}`
- `{{authorized-user}}`

**Value Scenario (Critical for Conditional Content):**
- `{{value-scenario-type}}` (e.g., "As Stabilized", "As Is", "As If Renovated & Stabilized")
- `{{value-scenarios-list}}`
- `{{scenario-description}}`
- `{{hypothetical-conditions-text}}`
- `{{extraordinary-assumptions-text}}`

### Location & Context Fields

- `{{location-overview-text}}`
- `{{access-description}}`
- `{{transit-description}}`
- `{{walk-bike-scores-text}}`
- `{{local-area-description}}`
- `{{demographics-text}}` (optional)
- `{{nearby-schools-list}}`

### Adjacency & Exposure

- `{{adjacent-north}}`
- `{{adjacent-south}}`
- `{{adjacent-east}}`
- `{{adjacent-west}}`
- `{{frontage-streets}}`
- `{{accessibility-rating}}`
- `{{exposure-description}}`

### Zoning

- `{{zoning-district}}`
- `{{zoning-code}}`
- `{{zoning-description}}`
- `{{zoning-change-statement}}`

### Building Components (Semi-Dynamic - may use defaults)

**Standard Defaults for Walkup Apartments:**
- `{{project-amenities}}` = "Guest Parking"
- `{{unit-amenities}}` = "Deck/Patio, Range/Stove, Refrigerator"
- `{{laundry}}` = "On Site"
- `{{security-features}}` = "Deadbolts, Exterior Lighting, Secured Entry"
- `{{elevator}}` = "None"
- `{{insulation}}` = "Fiberglass"
- `{{lighting}}` = "Various"

**Variable Building Components:**
- `{{foundation-type}}`
- `{{exterior-walls}}`
- `{{roof-type}}`
- `{{hvac-description}}`
- `{{electrical-description}}`
- `{{interior-walls}}`

### Financial Analysis Fields (Complex - Require Calculation Engine)

**Revenue:**
- `{{market-rent-per-unit}}`
- `{{market-rent-per-sf}}`
- `{{contract-rent-percent-of-market}}`
- `{{potential-gross-revenue}}`
- `{{vacancy-percent}}`
- `{{effective-gross-revenue}}`

**Expenses:**
- `{{total-operating-expenses}}`
- `{{operating-expenses-per-unit}}`
- `{{operating-expenses-per-sf}}`

**NOI & Value:**
- `{{net-operating-income}}`
- `{{noi-per-unit}}`
- `{{noi-per-sf}}`
- `{{capitalization-rate}}`
- `{{final-value-conclusion}}`

### Scope of Work Variables

- `{{market-name}}`
- `{{submarket-name}}`
- `{{hbu-scenario}}` ("As Improved", "As Proposed", etc.)
- `{{assistance-provided-text}}`

### Media Assets (Property-Specific)

- `{{photo-caption-array}}` (array of captions)
- `{{photo-files-array}}` (array of image paths)
- `{{map-files-array}}` (location maps, site plans, zoning maps)

---

## Conditional Template Logic Requirements

### 1. Value Scenario Conditionals

**IF** `{{value-scenario-type}}` == "As Stabilized":
- Use "As Stabilized" hypothetical conditions text
- No extraordinary assumptions
- H&B Use scenario = "As Improved"

**IF** `{{value-scenario-type}}` == "As If Renovated & Stabilized":
- Use renovation-specific hypothetical conditions
- Include extraordinary assumptions about renovation completion
- H&B Use scenario = "As Proposed"
- Include "Proposed Capital Expenditures" section

**IF** `{{value-scenario-type}}` == "As Is":
- Standard current value conditions
- No renovation assumptions
- H&B Use scenario = "As Improved"

### 2. Building Count Conditionals

**IF** `{{building-count}}` == 1:
- "comprised of 1 building"
- Single site plan

**IF** `{{building-count}}` > 1:
- "comprised of {{building-count}} total buildings"
- Multiple site plans (one per lot/parcel)

### 3. Assistance Provided Conditionals

**IF** `{{inspector-provided}}` == true:
- Use inspector assistance text with name/company
**ELSE:**
- Use "No one provided assistance" text

### 4. Demographics Section Conditional

**IF** `{{include-demographics}}` == true:
- Include demographics paragraph in Location section

### 5. Sales History Conditional

**IF** `{{pending-sale}}` == true:
- Include pending sale details
**ELSE:**
- Use "We are unaware of any pending sales..." text

---

## Boilerplate Percentage by Section

| Section | Boilerplate % | Dynamic % | Notes |
|---------|---------------|-----------|-------|
| Cover Page | 30% | 70% | Headers standardized, all data dynamic |
| Transmittal Letter | 60% | 40% | Structure boilerplate, details dynamic |
| Table of Contents | 90% | 10% | Structure same, page numbers vary |
| Property Overview | 40% | 60% | Headers boilerplate, tables dynamic |
| Photographs | 20% | 80% | Section header only boilerplate |
| Maps | 0% | 100% | Completely property-specific |
| Identification of Assignment | 50% | 50% | Mix of standard language and property data |
| Location | 30% | 70% | Structure standard, all descriptions dynamic |
| Site Details | 60% | 40% | Disclaimers boilerplate, data dynamic |
| Property Taxes & Assessment | 80% | 20% | Commentary boilerplate, table dynamic |
| Land Use & Planning | 70% | 30% | Structure and conclusions boilerplate |
| Description of Improvements | 50% | 50% | Intro boilerplate, building details mixed |
| Economic Overviews | 20% | 80% | Market-specific content |
| Multi-Family Market Overview | 30% | 70% | Market-specific analysis |
| Highest & Best Use | 60% | 40% | Methodology boilerplate, analysis dynamic |
| Valuation Methodology | 90% | 10% | Standard appraisal theory |
| Income Approach | 40% | 60% | Method boilerplate, all data dynamic |
| Direct Comparison Approach | 30% | 70% | Structure boilerplate, comps dynamic |
| Reconciliation | 50% | 50% | Framework boilerplate, values dynamic |
| Certification | 95% | 5% | CUSPAP standard language |
| Appendices - Conditions | 100% | 0% | Standard legal disclaimers |
| Appendices - Definitions | 100% | 0% | CUSPAP standard terms |
| Appendices - Qualifications | 100% | 0% | Same appraiser in both |

**Overall Report Boilerplate: ~75-80%**
**Overall Report Dynamic: ~20-25%**

---

## Recommendations for Template System

### 1. Core Template Structure
Create a base template with all boilerplate text hardcoded and placeholder variables for dynamic content.

### 2. Conditional Sections
Implement conditional logic for:
- Value scenarios (As Stabilized vs As If Renovated vs As Is)
- Building count (singular vs plural language)
- Optional sections (demographics, pending sales, capital expenditures)
- Inspector assistance vs no assistance

### 3. Default Values for Semi-Dynamic Fields
Establish standard defaults for walkup apartments:
- Project Amenities: "Guest Parking"
- Unit Amenities: "Deck/Patio, Range/Stove, Refrigerator"
- Laundry: "On Site"
- Security: "Deadbolts, Exterior Lighting, Secured Entry"
- Elevator: "None"
- Insulation: "Fiberglass"
- Lighting: "Various"

Allow overrides when property deviates from standards.

### 4. Calculation Engine Requirements
The following values must be calculated from input data:
- Market rent per unit / per SF
- Potential Gross Revenue
- Effective Gross Revenue (PGR - vacancy)
- Net Operating Income (EGR - expenses)
- Per-unit and per-SF metrics throughout
- Contract rent as % of market rent

### 5. Rich Text Fields
The following fields require rich text / multi-paragraph content:
- `{{location-overview-text}}`
- `{{access-description}}`
- `{{local-area-description}}`
- `{{unit-rent-discussion}}`
- Economic and market overview sections

### 6. Data Validation Rules
**Required Fields:**
- All property identification fields
- Client information
- Dates (valuation, report, inspection)
- Building statistics (count, NRA, units, occupancy)
- Site area
- Legal description
- Zoning information

**Conditional Required:**
- Inspector details (if inspector was used)
- Demographics (if included)
- Sales history details (if pending sale exists)
- Capital expenditures (if renovation scenario)

### 7. Standardized Boilerplate Sections (Copy Directly)
These sections can be copied verbatim from the analyzed reports:
- Exposure & Marketing Time (entire section)
- Definition of Market Value (CUSPAP definition)
- Property Rights Appraised (Fee Simple explanation)
- Easements disclaimer
- Soils disclaimer
- Hazardous Waste disclaimer
- Site Rating conclusion
- Scope of Work (most paragraphs)
- Valuation Methodology (all approach descriptions)
- Income Approach methodology intro
- Certification
- Contingent & Limiting Conditions
- Definition of Terms

---

## Field Naming Convention Recommendations

### Standard Prefixes:
- `property-` = property identification/location
- `client-` = client information
- `building-` = building characteristics
- `site-` = site/land characteristics
- `financial-` = revenue/expense/value data
- `date-` = all dates
- `zoning-` = zoning/land use
- `adjacent-` = adjacency descriptions
- `market-` = market analysis content

### Data Type Suffixes:
- `-text` = rich text/paragraph content
- `-percent` = percentage values
- `-sf` = square footage
- `-ac` = acreage
- `-count` = numeric count
- `-description` = short descriptive text
- `-array` = arrays of items (photos, schools, etc.)

### Examples:
- `{{property-full-address}}`
- `{{building-nra-sqft}}`
- `{{financial-vacancy-percent}}`
- `{{site-area-ac}}`
- `{{market-overview-text}}`
- `{{photo-caption-array}}`

---

## Next Steps for Template Development

1. **Extract Complete Boilerplate Library**: Copy all identified boilerplate sections into reusable text blocks
2. **Create Field Schema**: Define all 100+ template fields with data types, validation rules, and default values
3. **Build Conditional Logic Map**: Document all if/then scenarios for content variation
4. **Design Calculation Engine**: Implement financial calculations for Income Approach
5. **Develop Data Input Interface**: Create forms/database schema for capturing all dynamic fields
6. **Implement Template Rendering**: Build system to merge data with boilerplate to generate complete reports
7. **Create Quality Assurance Checklist**: Validate all dynamic fields are populated before report generation

---

## Statistics

**Total Lines Analyzed:**
- North Battleford: 2,705 lines
- Drumheller: 2,728 lines
- Total: 5,433 lines

**Boilerplate Ratio:** ~75-80% identical text
**Dynamic Ratio:** ~20-25% property-specific
**Semi-Dynamic:** ~15% same structure, different values

**Estimated Field Count:**
- High priority dynamic fields: ~50
- Financial/calculated fields: ~30
- Building component fields: ~20
- Optional/conditional fields: ~15
- **Total template fields needed:** ~115 fields

---

## End of Analysis

This comprehensive analysis provides a detailed breakdown of boilerplate vs dynamic content across two complete appraisal reports totaling 5,433 lines. The findings demonstrate that ~75-80% of report content is standardized, making template-based report generation highly feasible with appropriate data capture and conditional logic systems.

**Key Takeaway:** The vast majority of appraisal report text is reusable boilerplate. Investment in a robust templating system with ~115 well-defined fields and conditional logic will enable rapid, consistent report generation across all properties.
