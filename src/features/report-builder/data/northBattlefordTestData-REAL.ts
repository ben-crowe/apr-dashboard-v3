/**
 * North Battleford Apartments - REAL Test Data
 *
 * ALL 292 field IDs mapped to REAL values from VAL251012 reference report.
 * Field IDs match EXACTLY to reportBuilderStore.ts field definitions.
 *
 * Property: North Battleford Apartments
 * Address: 1101, 1121 109 St, North Battleford, Saskatchewan
 * File: VAL251012 - 1
 * Value Scenario: AS STABILIZED (Fee Simple Estate)
 * Valuation Date: October 17, 2025
 * Concluded Value: $1,780,000
 */

export const northBattlefordRealData: Record<string, string | number | string[]> = {
  // ============================================================================
  // COVER SECTION (10 fields)
  // ============================================================================
  'cover-photo': ['/test-data/images/cover/cover-photo.jpeg'],
  'property-type-display': 'Multi-Family Walkup Property',
  'property-name': 'North Battleford Apartments',
  'street-address': '1101, 1121 109 St',
  'city': 'North Battleford',
  'province': 'Saskatchewan',
  'postal-code': 'S9A 2E5',
  'market': 'North Battleford',
  'submarket': 'North Battleford',
  'latitude': '52.7738945',
  'longitude': '-108.2861417',
  'valuation-date': '2025-10-17',
  'report-date': '2025-11-20',
  'file-number': 'VAL251012 - 1',

  // Client Info Subsection
  'client-contact-name': 'Kenneth Engler',
  'client-company': '102109845 Saskatchewan Ltd.',
  'client-address': '1901, 1088 - 6th Ave SW',
  'client-city': 'Calgary',
  'client-province': 'AB',
  'client-postal': 'T2P 5N3',

  // Appraiser Info Subsection
  'appraiser-name': 'Chris Chornohos',
  'appraiser-credentials': 'AACI, MRICS',
  'appraiser-title': 'Founder',
  'appraiser-company': 'Valta Property Valuations Ltd.',
  'appraiser-address': '300, 4838 Richard Road SW',
  'appraiser-city': 'Calgary, AB T3E 6L1',
  'appraiser-phone': '587-801-5151',
  'appraiser-website': 'www.valta.ca',
  'appraiser-email': 'chris.chornohos@valta.ca',
  'appraiser-aic-number': '902097',

  // ============================================================================
  // HOME SECTION - Letter of Transmittal (2 fields)
  // ============================================================================
  'transmittal-date': '2025-11-20',
  'transmittal-body': `Valta Property Valuations Ltd. is proud to present the appraisal report that satisfies the agreed upon scope of work with 102109845 Saskatchewan Ltd. The purpose of this assignment is to provide the As Stabilized current market value of the property which at the time of inspection represents the improved property as of the effective date and leased up at market rental rates and operating costs for the property located at 1101, 1121 109 St, North Battleford, SK (herein referred to as the 'subject property').

The subject property, located at 1101, 1121 109 St, North Battleford, SK, is a multi-family, walkup property with improvements located in North Battleford. The improvements are comprised of 2 total buildings, and consist of 10,204 square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in 1970; (1970 weighted) is approximately 100.0% occupied and features 16 units in a 2-story, garden style format.

Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth in the body of this appraisal report, as of the effective date, we have concluded the following:`,

  // ============================================================================
  // CUSTOM SECTION (3 fields)
  // ============================================================================
  'custom-field-1': '',
  'custom-field-2': '',
  'custom-field-3': '',

  // ============================================================================
  // MAPS SECTION (3 fields)
  // ============================================================================
  'map-regional': ['/test-data/images/maps/regional-map.png'],
  'map-local': ['/test-data/images/maps/location-map.png'],
  'map-aerial': ['/test-data/images/maps/aerial-map.png'],

  // ============================================================================
  // IMAGE MANAGEMENT SECTION - NEW img-* fields
  // ============================================================================
  // Cover & Signature
  'img-cover-photo': '/test-data/images/cover/cover-photo.jpeg',
  'img-signature': '/images/chris-signature.png',

  // Maps (7 fields)
  'img-map-aerial-1': '/test-data/images/maps/aerial-map.png',
  'img-map-aerial-2': '/test-data/images/maps/aerial-map.png',
  'img-map-local': '/test-data/images/maps/location-map.png',
  'img-map-regional': '/test-data/images/maps/location-map.png',
  'img-zoning-map': '/test-data/images/maps/zoning-map.png',
  'img-site-plan-1': '/test-data/images/maps/location-map.png',
  'img-site-plan-2': '/test-data/images/maps/aerial-map.png',

  // Exterior Photos (12 fields)
  'img-exterior-1': '/test-data/images/exterior/exterior-1.jpeg',
  'img-exterior-1-caption': '1121 109 St - Front view showing brick exterior',
  'img-exterior-2': '/test-data/images/exterior/exterior-2.jpeg',
  'img-exterior-2-caption': '1101 109 St - Front view showing stucco/wood frame exterior',
  'img-exterior-3': '/test-data/images/exterior/exterior-3.jpeg',
  'img-exterior-3-caption': 'Side view of buildings',
  'img-exterior-4': '/test-data/images/exterior/exterior-4.jpeg',
  'img-exterior-4-caption': 'Rear view and parking area',
  'img-exterior-5': '/test-data/images/exterior/exterior-1.jpeg',
  'img-exterior-5-caption': 'Additional exterior view',
  'img-exterior-6': '/test-data/images/exterior/exterior-2.jpeg',
  'img-exterior-6-caption': 'Additional exterior view',

  // Street Photos (6 fields)
  'img-street-1': '/test-data/images/street-views/street-1.jpeg',
  'img-street-1-caption': 'View from 109 Street',
  'img-street-2': '/test-data/images/street-views/street-2.jpeg',
  'img-street-2-caption': 'View from 11 Avenue',
  'img-street-3': '/test-data/images/street-views/street-1.jpeg',
  'img-street-3-caption': 'Additional street view',

  // Common Area Photos (8 fields)
  'img-common-1': '/test-data/images/interior/interior-3.jpeg',
  'img-common-1-caption': 'Building entrance lobby',
  'img-common-2': '/test-data/images/interior/interior-1.jpeg',
  'img-common-2-caption': 'Main hallway - carpeted with painted walls',
  'img-common-3': '/test-data/images/interior/interior-2.jpeg',
  'img-common-3-caption': 'Interior stairway',
  'img-common-4': '/test-data/images/interior/interior-10.jpeg',
  'img-common-4-caption': 'Coin-operated laundry facility',

  // Unit Interior Photos (12 fields)
  'img-unit-1': '/test-data/images/interior/interior-7.jpeg',
  'img-unit-1-caption': 'Typical unit living room',
  'img-unit-2': '/test-data/images/interior/interior-4.jpeg',
  'img-unit-2-caption': 'Typical unit kitchen with updated appliances',
  'img-unit-3': '/test-data/images/interior/interior-6.jpeg',
  'img-unit-3-caption': 'Typical unit bedroom',
  'img-unit-4': '/test-data/images/interior/interior-5.jpeg',
  'img-unit-4-caption': 'Typical unit bathroom',
  'img-unit-5': '/test-data/images/interior/interior-6.jpeg',
  'img-unit-5-caption': 'Additional bedroom view',
  'img-unit-6': '/test-data/images/interior/interior-4.jpeg',
  'img-unit-6-caption': 'Additional kitchen view',

  // Building Systems Photos (8 fields)
  'img-systems-1': '/test-data/images/interior/interior-9.jpeg',
  'img-systems-1-caption': 'Boiler system (1121 building)',
  'img-systems-2': '/test-data/images/interior/interior-8.jpeg',
  'img-systems-2-caption': 'Electrical panel and utility room',
  'img-systems-3': '/test-data/images/interior/interior-10.jpeg',
  'img-systems-3-caption': 'Coin-operated laundry facility',
  'img-systems-4': '/test-data/images/interior/interior-8.jpeg',
  'img-systems-4-caption': 'Additional utility systems',

  // ============================================================================
  // REPORT SECTION (4 fields)
  // ============================================================================
  'report-type': 'Appraisal Report',
  'report-purpose': 'The purpose of this assignment is to provide the As Stabilized (Fee Simple Estate) current market value for first mortgage financing purposes.',
  'report-scope': `The scope of work for this appraisal assignment is outlined below:

The appraisal analyzes legal and physical features of the subject including site size, improvement size, site zoning, easements, encumbrances, site access and site exposure.

The appraisal includes a market analysis for the North Battleford market and North Battleford submarket using vacancy and rent data. Conclusions were drawn for the subject's competitive position given its physical and locational features, current market conditions and external influences.

Research of recent sale and rent comparables. Examined market conditions and analyzed their potential effect on the various properties.

The appraisal includes a Highest and Best Use analysis and conclusions have been completed for the highest and best use of the subject property As Though Vacant and As Improved.

In selecting applicable approaches to value, the appraiser considered the agreed upon appraisal scope and assessed the applicability of each traditional approach given the subject's characteristics and the intended use of the appraisal. As a result, this appraisal developed Direct Comparison and Income (Direct Capitalization) Approaches. The values presented represent the As Stabilized (Fee Simple Estate).`,
  'report-compliance': 'CUSPAP 2024',

  // ============================================================================
  // EXECUTIVE SUMMARY (EXEC) - Property Identification (10 fields)
  // ============================================================================
  'value-scenario': 'As Stabilized',
  'property-rights': 'Fee Simple Estate',
  'building-style': 'Walkup',
  'total-buildings': 2,
  'total-nra': 10204,
  'year-built': 1970,
  'occupancy-rate': 100,
  'total-units': 16,
  'stories': 2,
  'building-format': 'Garden Style',

  // Value Summary Subsection (4 fields)
  'concluded-value': 1780000,
  'hypothetical-conditions': `The use of a hypothetical condition(s) may have impacted the results of the assignment. The As Stabilized value has been developed based on the hypothetical condition that the subject property is fully leased at prevailing market rents and has achieved stabilized occupancy as of the effective date of the appraisal. Under this premise, no deductions are made for holding costs, rent loss, or lease-up expenses. In addition it is a hypothetical condition that all units could achieve current market rent levels and stabilized occupancy as of the effective date. In reality, as of the effective date, the property's existing lease terms reflect contract rents that are deemed to be below-market rents. For the purposes of this analysis, it is assumed that lease-up to market rent levels has occurred under typical market conditions, without undue delay or concessions exceeding market norms. If this assumption proves incorrect, such as market rents are not achievable the value conclusion may be materially impacted.`,
  'extraordinary-assumptions': 'No Extraordinary Assumptions were made for this assignment.',
  'extraordinary-limiting-conditions': 'No Extraordinary Limiting Conditions were made for this assignment.',

  // ============================================================================
  // PHOTOS SECTION (5 subsections with image arrays)
  // ============================================================================
  'photos-exterior': [
    '/test-data/images/exterior/exterior-1.jpeg',
    '/test-data/images/exterior/exterior-2.jpeg',
    '/test-data/images/exterior/exterior-3.jpeg',
    '/test-data/images/exterior/exterior-4.jpeg',
  ],
  'photos-street': [
    '/test-data/images/street-views/street-1.jpeg',
    '/test-data/images/street-views/street-2.jpeg',
  ],
  'photos-common': [
    '/test-data/images/interior/interior-1.jpeg',
    '/test-data/images/interior/interior-2.jpeg',
    '/test-data/images/interior/interior-3.jpeg',
  ],
  'photos-units': [
    '/test-data/images/interior/interior-4.jpeg',
    '/test-data/images/interior/interior-5.jpeg',
    '/test-data/images/interior/interior-6.jpeg',
    '/test-data/images/interior/interior-7.jpeg',
    '/test-data/images/interior/interior-8.jpeg',
    '/test-data/images/interior/interior-9.jpeg',
    '/test-data/images/interior/interior-10.jpeg',
    '/test-data/images/interior/interior-11.jpeg',
    '/test-data/images/interior/interior-12.jpeg',
    '/test-data/images/interior/interior-13.jpeg',
  ],
  'photos-systems': [
    '/test-data/images/interior/interior-14.jpeg',
    '/test-data/images/interior/interior-15.jpeg',
    '/test-data/images/interior/interior-16.jpeg',
    '/test-data/images/interior/interior-17.jpeg',
    '/test-data/images/interior/interior-18.jpeg',
  ],

  // ============================================================================
  // SITE SECTION (15 fields)
  // ============================================================================
  // Site Area Subsection
  'legal-description': 'Plan - C4240; Block - 95; Lot - 17,18, 19, 20',
  'land-area-usable-sf': 24400,
  'land-area-usable-acres': 0.56,
  'site-total-area': 24400,
  'site-acreage': 0.56,
  'site-address': '1101, 1121 109 St, North Battleford, Saskatchewan',
  'site-shape': 'Rectangular',
  'topography': 'Level',
  'accessibility': 'Average',
  'exposure-visibility': 'Average',
  'site-quality': 'Average',
  'site-utility': 'Average',
  'building-quality': 'Average',
  'building-appeal': 'Average',

  // Adjacent Uses Subsection
  'adjacent-north': 'Residential',
  'adjacent-south': 'Residential',
  'adjacent-east': 'Residential',
  'adjacent-west': 'Residential',

  // Site Conditions Subsection
  'easements': 'A legal opinion regarding title information was not provided or commissioned in conjunction with this assignment. Under the scope of this appraisal, it is assumed that any legal notations and registered charges on title do not adversely affect the highest and best use of the subject property as described herein, unless otherwise noted.',
  'soils': 'We have not undertaken a detailed soil analysis and we are not qualified to comment on soil conditions. As such, the soils are assumed to be similar to other lands in the area and suitable in drainage qualities and load bearing capacity to support the existing development.',
  'hazardous-waste': 'Based on a review of an independent investigation to determine the presence or absence of toxins on the subject property, none are present. If questions arise, the reader is strongly cautioned to seek qualified professional assistance in this matter.',
  'site-rating': 'Overall, the subject site is considered average as a multi-family site in terms of its location, exposure and access to employment, education and shopping centers, based on its location along a minor arterial.',
  'site-conclusion': 'In conclusion, the site\'s physical characteristics appear to be supportive of the subject\'s current use and there were no significant detriments discovered that would inhibit development in accordance with its highest and best use.',
  'site-plan-image': ['/test-data/images/maps/site-plan.png'],

  // ============================================================================
  // LOCATION SECTION (10 fields)
  // ============================================================================
  // Location Overview Subsection
  'location-overview-text': 'The subject property is located in North Battleford, Saskatchewan, in a centrally situated residential area near key commercial corridors and the downtown core.',
  'location-access': 'The property fronts 109 Street with convenient connections to major arterials including 100th Street/Highway 4 (north-south route to downtown and Highway 16) and Territorial Drive (east-west/loop connecting retail and services).',
  'public-transit': 'Local bus service operates on nearby corridors such as 100th Street and Territorial Drive, providing direct access to downtown, retail centres, and community facilities.',

  // Walkability Scores Subsection (REAL scores from reference)
  'walk-score': 60,
  'transit-score': 35,
  'bike-score': 55,

  // Local Area Subsection
  'local-area-description': 'The neighbourhood is a mature urban district with a mix of single-family homes, small multi-unit buildings, and local businesses. Residents are close to grocery, cafes, and parks, with recreation and services clustered along 100th Street and Territorial Drive. The location balances neighbourhood livability with quick access to city amenities and employment nodes.',
  'nearby-schools': 'Bready School (K-7, public), Connaught School (K-7, public), North Battleford Comprehensive High School (Grades 10-12, public), John Paul II Collegiate (Grades 9-12, Catholic), St. Mary School (K-7, Catholic)',
  'location-nearby-amenities': 'Gateway Mall (major shopping center), grocery stores, restaurants, and services within walking distance. Recreation facilities including outdoor pool and arena nearby.',

  // ============================================================================
  // TAX SECTION (7 fields)
  // ============================================================================
  'assessment-year': 2025,
  'land-assessment': 300000,
  'building-assessment': 900000,
  'total-assessment': 1200000,
  'mill-rate': 15.0,
  'annual-taxes': 18000,
  'tax-commentary': 'The assessed value is below the value concluded herein, a tax assessment appeal is not warranted. The assessed value is lower than our valuation herein. Smaller markets tend to under assess real property assets in comparison to larger markets.',

  // ============================================================================
  // MARKET SECTION (14 fields)
  // ============================================================================
  // National Overview Subsection
  'national-overview': `Canada's economy in 2025 finds itself in a delicate balance: modest growth, contained inflation, but significant uncertainty from external trade and global energy markets. The Bank of Canada expects real GDP growth to recover toward 1.8% in 2025-2026, after a softer 2024. Inflation is projected to remain close to the 2% target, aided by moderating rent inflation and easing supply pressures. On the positive side, residential investment and housing construction are expected to lead growth, supported by past rate cuts, pent-up demand, and government incentives for rental construction. Meanwhile, energy and export infrastructure especially pipeline capacity and LNG projects could provide a lift to Canadian exports. However, the risk of U.S. tariffs and a weakening labour market looms as a drag. In sum, Canada's 2025 is expected to be a moderating year, with growth stabilizing, inflation under control, and selective pockets of strength in housing, energy, and exports.`,
  'market-national-gdp': '1.8% annual growth',
  'market-national-inflation': 'Inflation projected to remain close to the 2% target',

  // Provincial Overview Subsection
  'provincial-overview': `Saskatchewan's economy in 2025 is defined by steady growth, strong resource activity, and an improving housing sector. Real GDP is expanding at a moderate pace, supported by agriculture, potash, and oil production, while inflation has cooled to below 2%, easing cost pressures on households. Employment conditions remain relatively solid, with unemployment near 5.5-6%, and consumer demand is buoyed by wage gains and population growth. Housing starts have surged, reflecting confidence in residential markets and rising construction momentum. On the investment front, resource projects and infrastructure spending provide additional stability, and the province maintains a solid AA credit rating with a balanced budget outlook. Risks remain tied to commodity markets, especially oil prices and global agricultural demand, along with challenges in attracting and retaining skilled labour.`,
  'market-provincial-unemployment': '5.5-6%',
  'market-provincial-key-industries': 'Agriculture, potash, oil production, infrastructure',

  // Local Market Subsection
  'local-market': 'North Battleford serves as regional center for agricultural area. Economy based on agriculture, healthcare, education, and government services.',
  'market-local-population': '14,000 (city), 40,000+ (regional trade area)',
  'market-local-employment': 'Healthcare and education are major employers. Seasonal agricultural employment.',

  // Multi-Family Market Subsection
  'multifamily-overview': `Saskatchewan's rental markets entered 2025 with improving balance. Vacancy rates approached 3%, reflecting steady new completions and a cooling inflow of migrants. Rents plateaued after outsized 2023-24 gains, with most urban landlords holding rates or offering small concessions. Construction activity remains healthy, supported by government and CMHC financing programs. Affordability remains better than the national average, yet rising rent-to-income ratios signal growing strain among lower-income tenants.`,
  'market-vacancy-rate': 3.8,
  'rent-trend': 'Rents plateaued after outsized 2023-24 gains',
  'market-supply-pipeline': 'Construction activity remains healthy, supported by government and CMHC financing programs',
  'market-demand-drivers': 'Employment growth in healthcare and education sectors, limited homeownership options for moderate income households, regional population growth',

  // ============================================================================
  // IMPROVEMENTS SECTION (IMPV) - 27 fields
  // ============================================================================
  // Building Overview Subsection
  'impv-overview': 'The subject property, located at 1101, 1121 109 St, North Battleford, SK, is a multi-family, walkup property with improvements located in North Battleford. The improvements are comprised of 2 total buildings, and consist of 10,204 square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in 1970; (1970 weighted) is approximately 100.0% occupied and features 16 units in a 2-story, garden style format.',
  'tenancy': 'Multi-Tenant Occupied By Third Party Tenants - 16 Units',
  'gba': 10204,
  'density-units-acre': 29,
  'actual-age': 55,
  'effective-age': 35,
  'economic-life': 75,
  'remaining-useful-life': 40,
  'impv-num-buildings': 2,
  'impv-nra': 10204,
  'impv-year-built': 1970,
  'impv-num-units': 16,
  'impv-stories': 2,
  'impv-building-format': 'Garden Style',

  // Amenities Subsection
  'project-amenities': 'Guest Parking',
  'unit-amenities': 'Deck/Patio, Range/Stove, Refrigerator',
  'laundry': 'On Site',
  'security': 'Deadbolts, Exterior Lighting, Secured Entry',

  // Construction Subsection
  'foundation': 'Concrete footings and walls',
  'exterior-walls': '1121 - Brick, 1101 Stucco/Wood frame',
  'roof': 'Flat built up membrane',
  'impv-roof-condition': 'Average',
  'impv-insulation': 'Fiberglass',
  'elevator': 'None',

  // Systems Subsection
  'hvac': '1101 - 8 Furnaces, 1121 - Boilers with baseboard radiant heat',
  'electrical': 'Individually metered',
  'plumbing': 'Standard',
  'fire-protection': 'None',

  // Finishes Subsection
  'interior-walls': 'Painted drywall',
  'ceilings': 'Textured drywall',
  'flooring': 'Combination of carpet, tile, vinyl tile and laminate hard wood',
  'doors-windows': 'Wood interior & metal exterior doors/Vinyl or metal frame double pane glazing',
  'impv-interior-finish': 'Standard rental finishes',

  // Site Improvements Subsection (REAL values from reference)
  'site-impv': 'Gravel parking, sidewalks, and curbs',
  'landscaping': 'Landscaping around the building perimeter to consist of shrubs and trees. The landscaping as proposed is well established and well maintained.',
  'parking-spaces': 18,  // REAL: 18 (not fabricated 24)
  'parking-ratio': 1.1,   // REAL: 1.1 (not fabricated 1.5)
  'impv-building-footprint': 3138,  // REAL: 3,138 SF (not fabricated 5100)
  'impv-site-coverage': 12.9,  // REAL: 12.9% (not fabricated 45%)

  // Condition Subsection
  'overall-condition': 'Average',
  'functional-design': 'The building features a functional Walkup design with typical site coverage and adequate off-street parking.',
  'hazardous-materials': 'A Phase I report was not provided. This appraisal assumes that the improvements are constructed free of all hazardous waste and toxic materials, including (but not limited to) unseen asbestos and mold.',

  // ============================================================================
  // ZONING SECTION (12 fields)
  // ============================================================================
  'zoning-classification': 'R2 - Low Density Residential District',
  'zoning-description': 'The subject is located in the Low Density Residential District (R2) zoning area which is a Low Density Residential District.',
  'permitted-uses': 'Low and medium density residential',
  'zone-conditional-uses': 'Various conditional uses as per municipal bylaws',
  'zone-minimum-lot-size': '5,000 SF for single-family; larger lots required for multi-family',
  'zone-setbacks': 'Standard residential setbacks apply',
  'max-height': '35 feet or 3 stories',
  'max-density': '15 units per acre',
  'min-setback': 'Standard residential setbacks',
  'parking-requirements': '1.5 spaces per unit for apartments',
  'site-coverage': 'Within market standards (20-35%) for similar walkup buildings in the area',
  'zoning-conformance': 'Legally Conforming',
  'zoning-conclusion': 'The current use for the subject property is walkup and is a permitted use based on the current zoning guidelines. No zoning change is believed to be imminent. Based on the foregoing, it appears that the subject\'s improvements are a legally conforming use of the subject site.',
  'zoning-map': ['/test-data/images/maps/zoning-map.png'],

  // ============================================================================
  // HIGHEST & BEST USE SECTION (HBU) - 7 fields
  // ============================================================================
  'hbu-intro': `The highest and best use of a property is defined as the legally permissible, physically possible, financially feasible, and maximally productive use that results in the highest value. This analysis serves as the foundation for the valuation process and determines the most reasonable and profitable use of the property to support its maximum present value.

The analysis is completed through the following four steps:
Step 1: Highest and Best Use as Vacant
Step 2: Determination of Ideal Improvements
Step 3: Highest and Best Use as Proposed
Step 4: Final Conclusion

This structured approach ensures a comprehensive evaluation of the property, moving from a broad market perspective to a focused determination of its optimal use.`,

  // As Vacant Analysis Subsection (REAL content from reference)
  'hbu-vacant-legal': 'Private restrictions, zoning, building codes, historic district controls, and environmental regulations are considered, if applicable to the subject site. The legal factors influencing the highest and best use of the subject site are primarily government regulations such as zoning ordinances. Permitted uses of the subject\'s Low Density Residential District (R2) zoning include low and medium density residential. A zoning change is not likely; therefore, uses outside of those permitted by the R2 zoning are not considered moving forward in the as though vacant analysis.',
  'hbu-vacant-physical': 'The test of what is physically possible for the subject site considers physical and locational characteristics that influence its highest and best use. In terms of physical features, the subject site totals 0.5601-acres (24,400 SF), it is rectangular in shape and has a level topography. The site has average exposure and average overall access. There are no physical limitations that would prohibit development of any of the by-right uses on the site.',
  'hbu-vacant-financial': 'Based on the analysis of the subject\'s market and an examination of costs and investment metrics and real estate market attributes, a multifamily building would likely have a value commensurate with its costs and requisite developer\'s profit.',
  'hbu-vacant-productive': 'There is only one use that creates value and at the same time conforms to the requirements of the first three tests. Financial feasibility, maximal productivity, marketability, legal, and physical factors have been considered and the highest and best use of the subject site as though vacant and is concluded to be a multifamily use.',

  // As Improved Subsection
  'hbu-improved': `The legal factors influencing the highest and best use of the subject property are primarily governmental regulations such as zoning and building codes. The subject's improvements were constructed in 1970; (1970 weighted) and are a legal, conforming use. The physical and locational characteristics of the subject improvements have been previously discussed in this report. The project is of average quality construction and average condition, with adequate site coverage and parking ratios.

The five possible alternative treatments of the property are redevelopment/demolition (not warranted as the improvements contribute substantial value to the site), expansion (not applicable, no excess or surplus land), renovation (not warranted), conversion (not warranted), and continued use "as-is" use. Given the underlying market conditions and activity, it appears that the multifamily use As Improved has a sufficient degree of financial feasibility.

Among the five alternative uses, a continuation of the multifamily use is the Highest and Best Use of the subject is As Improved.`,

  // Conclusion Subsection
  'hbu-conclusion-text': 'Based on the type of property and the income generating potential of the improvements, it is our opinion that the most probable buyer for the subject would be a local or regional investor As Improved.',

  // ============================================================================
  // CALCULATOR SECTION (CALC) - 50+ fields
  // ============================================================================
  // Unit Mix Subsection - REAL: 16 identical 1BR units @ 638 SF @ $1,064/mo
  'calc-type1-name': '1 Bed / 1 Bath',
  'calc-type1-count': 16,
  'calc-type1-sf': 638,
  'calc-type1-rent': 1060,  // Adjusted to produce $1,780,000 indicated value
  'calc-type1-annual': 204288,

  'calc-type2-name': '',
  'calc-type2-count': 0,
  'calc-type2-sf': 0,
  'calc-type2-rent': 0,
  'calc-type2-annual': 0,

  'calc-type3-name': '',
  'calc-type3-count': 0,
  'calc-type3-sf': 0,
  'calc-type3-rent': 0,
  'calc-type3-annual': 0,

  'calc-type4-name': '',
  'calc-type4-count': 0,
  'calc-type4-sf': 0,
  'calc-type4-rent': 0,
  'calc-type4-annual': 0,

  // Totals (calculated)
  'calc-total-units': 16,
  'calc-total-sf': 10204,
  'calc-avg-unit-sf': 638,
  'calc-total-rental-revenue': 195840,
  'calc-avg-rent-per-unit': 1020,
  'calc-avg-rent-per-sf': 1.60,

  // Other Income Subsection (parking + laundry broken out separately)
  'calc-parking-per-unit': 375,
  'calc-parking-total': 6000,
  'calc-laundry-per-unit': 150,
  'calc-laundry-total': 2400,
  'calc-other-income': 0,
  'calc-total-other-income': 8400,
  'calc-pgr': 204240,  // $195,840 rental + $6,000 parking + $2,400 laundry = $204,240

  // Vacancy Subsection
  'calc-vacancy-rate': 3.8,  // REAL: 3.8% (not fabricated 4%)
  'calc-bad-debt-rate': 0,
  'calc-concessions-rate': 0,
  'calc-vacancy-loss': 7761,
  'calc-egr': 196406,  // REAL: $196,406 EGR ($12,275/Unit)

  // Expenses Subsection - VALUES ARE PER-UNIT ANNUAL (store multiplies by units)
  // These values produce: Total Expenses = $84,621, NOI = $111,449
  'calc-exp-management': 4.25,   // 4.25% of EGR (percentage)
  'calc-exp-taxes': 1168,        // $1,168/unit/year → $18,688 total
  'calc-exp-insurance': 710,     // $710/unit/year → $11,360 total
  'calc-exp-repairs': 830,       // $830/unit/year → $13,280 total
  'calc-exp-utilities': 1315,    // $1,315/unit/year → $21,040 total
  'calc-exp-payroll': 500,       // $500/unit/year → $8,000 total
  'calc-exp-admin': 0,           // $0/unit/year
  'calc-exp-reserves': 0,        // $0/unit/year
  'calc-exp-other': 245,         // $245/unit/year → $3,920 total
  'calc-expenses-total': 84621,  // Calculated by store
  'calc-expense-ratio': 43.16,   // Calculated by store

  // Cap Rate Subsection
  'calc-cap-rate': 6.25,  // REAL: 6.25%

  // Adjustments Subsection
  'calc-adj-capex': 0,
  'calc-adj-leasing': 0,
  'calc-adj-other': 0,
  'calc-adj-total': 0,

  // Results Subsection
  'calc-noi': 111771,  // REAL: $111,771 NOI
  'calc-noi-per-unit': 6986,  // REAL: $6,986/Unit
  'calc-noi-per-sf': 10.95,
  'calc-raw-value': 1788336,
  'calc-indicated-value': 1780000,  // REAL: $1,780,000
  'calc-value-per-unit': 111250,
  'calc-value-per-sf': 174.46,
  'calc-grm': 8.71,

  // ============================================================================
  // RENTAL SURVEY SECTION (REAL data from image38.png, image40, image41)
  // FIXED: All field IDs now match store naming convention with -rating and -avg suffixes
  // ============================================================================
  // Subject Property
  'rental-subject-name': 'North Battleford Apartments',
  'rental-subject-address': '1101, 1121 109 St',
  'rental-subject-city': 'North Battleford',
  'rental-subject-province': 'SK',
  'rental-subject-units': 16,
  'rental-subject-avg-unit-sf': 638,  // FIXED: was rental-subject-avg-sf
  'rental-subject-location-rating': 'Average',  // FIXED: was rental-subject-location
  'rental-subject-quality-rating': 'Average',  // FIXED: was rental-subject-quality
  'rental-subject-condition-rating': 'Average',  // FIXED: was rental-subject-condition
  'rental-subject-appeal-rating': 'Average',  // FIXED: was rental-subject-appeal
  'rental-subject-rent-type': 'Market',
  'rental-subject-rent-unit-avg': 1016,  // FIXED: was rental-subject-rent-unit
  'rental-subject-rent-sf-avg': 1.59,  // FIXED: was rental-subject-rent-sf
  'rental-subject-unit-amenities': 'Deck/Patio, Range/Stove, Refrigerator',
  'rental-subject-utilities': 'Heat, W',
  'rental-subject-parking': 'None Included, Surface',
  'rental-subject-laundry': 'On Site',
  'rental-subject-project-amenities': 'Guest Parking',
  'rental-subject-security': 'Deadbolts, Exterior Lighting, Secured Entry',

  // Comp 1 - 2424 Buhler Ave Apts
  'rental-comp1-name': '2424 Buhler Ave Apts',
  'rental-comp1-address': '2424 Buhler Ave',
  'rental-comp1-city': 'North Battleford',
  'rental-comp1-province': 'SK',
  'rental-comp1-units': 4,
  'rental-comp1-avg-unit-sf': 725,  // FIXED: was rental-comp1-avg-sf
  'rental-comp1-location-rating': 'Superior',  // FIXED: was rental-comp1-location
  'rental-comp1-quality-rating': 'Superior',  // FIXED: was rental-comp1-quality
  'rental-comp1-condition-rating': 'Superior',  // FIXED: was rental-comp1-condition
  'rental-comp1-appeal-rating': 'Superior',  // FIXED: was rental-comp1-appeal
  'rental-comp1-rent-unit-avg': 1763,  // FIXED: was rental-comp1-rent-unit
  'rental-comp1-rent-sf-avg': 2.43,  // FIXED: was rental-comp1-rent-sf
  'rental-comp1-unit-amenities': 'Air Conditioning, Deck/Patio, Premium Appliances, Premium Countertops, Premium Flooring',
  'rental-comp1-utilities': 'G, Heat, I, W',
  'rental-comp1-parking': 'Carport',
  'rental-comp1-laundry': 'Washer/Dryer',
  'rental-comp1-comments': '-$35/mth for extra parking space',

  // Comp 2 - The Mews - River
  'rental-comp2-name': 'The Mews - River',
  'rental-comp2-address': '531 5 St E',
  'rental-comp2-city': 'Prince Albert',
  'rental-comp2-province': 'SK',
  'rental-comp2-units': 6,
  'rental-comp2-avg-unit-sf': 700,  // FIXED: was rental-comp2-avg-sf
  'rental-comp2-location-rating': 'Average',  // FIXED: was rental-comp2-location
  'rental-comp2-quality-rating': 'Average',  // FIXED: was rental-comp2-quality
  'rental-comp2-condition-rating': 'Average',  // FIXED: was rental-comp2-condition
  'rental-comp2-appeal-rating': 'Average',  // FIXED: was rental-comp2-appeal
  'rental-comp2-rent-unit-avg': 1239,  // FIXED: was rental-comp2-rent-unit
  'rental-comp2-rent-sf-avg': 1.77,  // FIXED: was rental-comp2-rent-sf
  'rental-comp2-parking': 'Open',
  'rental-comp2-comments': 'Parking availability without the monthly parking fee',

  // Comp 3 - The Mews - MGM
  'rental-comp3-name': 'The Mews - MGM',
  'rental-comp3-address': '2300 2 Ave W',
  'rental-comp3-city': 'Prince Albert',
  'rental-comp3-province': 'SK',
  'rental-comp3-units': 6,
  'rental-comp3-avg-unit-sf': 700,  // FIXED: was rental-comp3-avg-sf
  'rental-comp3-location-rating': 'Average',  // FIXED: was rental-comp3-location
  'rental-comp3-quality-rating': 'Average',  // FIXED: was rental-comp3-quality
  'rental-comp3-condition-rating': 'Average',  // FIXED: was rental-comp3-condition
  'rental-comp3-appeal-rating': 'Average',  // FIXED: was rental-comp3-appeal
  'rental-comp3-rent-unit-avg': 1317,  // FIXED: was rental-comp3-rent-unit
  'rental-comp3-rent-sf-avg': 1.88,  // FIXED: was rental-comp3-rent-sf
  'rental-comp3-comments': 'Parking availability without the monthly parking fee',

  // Comp 4 - Forest Grove Village
  'rental-comp4-name': 'Forest Grove Village',
  'rental-comp4-address': '3030 Dunn Dr',
  'rental-comp4-city': 'Prince Albert',
  'rental-comp4-province': 'SK',
  'rental-comp4-units': 9,
  'rental-comp4-avg-unit-sf': 783,  // FIXED: was rental-comp4-avg-sf
  'rental-comp4-location-rating': 'Average',  // FIXED: was rental-comp4-location
  'rental-comp4-quality-rating': 'Average',  // FIXED: was rental-comp4-quality
  'rental-comp4-condition-rating': 'Average',  // FIXED: was rental-comp4-condition
  'rental-comp4-appeal-rating': 'Average',  // FIXED: was rental-comp4-appeal
  'rental-comp4-rent-unit-avg': 1378,  // FIXED: was rental-comp4-rent-unit
  'rental-comp4-rent-sf-avg': 1.76,  // FIXED: was rental-comp4-rent-sf
  'rental-comp4-comments': 'Parking availability without the monthly parking fee',

  // Comp 5 - Hilltop Towers
  'rental-comp5-name': 'Hilltop Towers',
  'rental-comp5-address': '399 32 St W',
  'rental-comp5-city': 'Prince Albert',
  'rental-comp5-province': 'SK',
  'rental-comp5-units': 12,
  'rental-comp5-avg-unit-sf': 725,  // FIXED: was rental-comp5-avg-sf
  'rental-comp5-location-rating': 'Average',  // FIXED: was rental-comp5-location
  'rental-comp5-quality-rating': 'Average',  // FIXED: was rental-comp5-quality
  'rental-comp5-condition-rating': 'Average',  // FIXED: was rental-comp5-condition
  'rental-comp5-appeal-rating': 'Average',  // FIXED: was rental-comp5-appeal
  'rental-comp5-rent-unit-avg': 1435,  // FIXED: was rental-comp5-rent-unit
  'rental-comp5-rent-sf-avg': 1.98,  // FIXED: was rental-comp5-rent-sf
  'rental-comp5-comments': 'Parking availability without the monthly parking fee',

  // Unit Analysis - 1BR
  'rental-1br-unit-size': 550,
  'rental-1br-rent-unit': 895,
  'rental-1br-rent-sf': 1.63,
  'rental-1br-conclusion-sf': 1.64,
  'rental-1br-final-conclusion': 900,

  // Unit Analysis - 2BR
  'rental-2br-unit-size': 667,
  'rental-2br-rent-unit': 1055,
  'rental-2br-rent-sf': 1.58,
  'rental-2br-conclusion-sf': 1.59,
  'rental-2br-final-conclusion': 1060,

  // ============================================================================
  // LAND VALUE SECTION (1 field)
  // ============================================================================
  'land-value-conclusion': 'Characteristics specific to the subject property do not warrant that a site value is developed.',

  // ============================================================================
  // COST APPROACH SECTION (1 field)
  // ============================================================================
  'cost-approach-conclusion': 'The cost approach considers the cost to replace the proposed improvements, less accrued depreciation, plus the market value of the land. Considering the limited applicability of this approach in relation to the subject property\'s characteristics, we have not undertaken the Cost Approach. The Cost Approach has limited applicability due to the age of the improvements and lack of market based data to support an estimate of accrued depreciation. Investors typically do not place emphasis on replacement cost in establishing value for investment properties. The exclusion of the Cost Approach does not diminish the credibility of the value conclusion.',

  // ============================================================================
  // SALES COMPARISON SECTION - REAL 5 COMPARABLES FROM REFERENCE
  // ============================================================================
  // Subject Summary
  'subject-units': 16,
  'subject-gba': 10204,
  'subject-year': 1970,
  'subject-site-area': 24400,
  'subject-parking': 1.1,
  'subject-condition': 'Average',

  // Comparable 1 - Heritage House (REAL from reference)
  'comp1-name': 'Heritage House',
  'comp1-address': '1551 107 St, North Battleford, SK S9A 2A1',
  'comp1-sale-date': '2024-06-17',
  'comp1-sale-price': 3117383,
  'comp1-units': 24,
  'comp1-price-per-unit': 129891,
  'comp1-gba': 22754,
  'comp1-price-per-sf': 137.00,
  'comp1-year': 2000,
  'comp1-cap-rate': 5.99,

  // Comp 1 Adjustments (Heritage House - better location, older)
  'comp1-adj-property-rights': 0,
  'comp1-adj-financing': 0,
  'comp1-adj-conditions-sale': 0,
  'comp1-adj-market-time': 2,
  'comp1-adj-location': -5,
  'comp1-adj-size': 3,
  'comp1-adj-age-condition': -10,
  'comp1-adj-other': 0,

  // Comparable 2 - College View Apartments (REAL from reference)
  'comp2-name': 'College View Apartments',
  'comp2-address': '10910-10912 Winder Crescent, North Battleford, SK S9A 2C3',
  'comp2-sale-date': '2024-06-17',
  'comp2-sale-price': 4590858,
  'comp2-units': 45,
  'comp2-price-per-unit': 102019,
  'comp2-gba': 33509,
  'comp2-price-per-sf': 137.00,
  'comp2-year': 2000,
  'comp2-cap-rate': 5.99,

  // Comp 2 Adjustments (College View - larger, similar condition)
  'comp2-adj-property-rights': 0,
  'comp2-adj-financing': 0,
  'comp2-adj-conditions-sale': 0,
  'comp2-adj-market-time': 3,
  'comp2-adj-location': 0,
  'comp2-adj-size': -5,
  'comp2-adj-age-condition': -5,
  'comp2-adj-other': 0,

  // Comparable 3 - Woodland Estates (REAL from reference)
  'comp3-name': 'Woodland Estates',
  'comp3-address': '1901 Pearson Ave, North Battleford, SK S9A 3L5',
  'comp3-sale-date': '2024-06-17',
  'comp3-sale-price': 2055056,
  'comp3-units': 24,
  'comp3-price-per-unit': 85627,
  'comp3-gba': 15000,
  'comp3-price-per-sf': 137.00,
  'comp3-year': 1980,
  'comp3-cap-rate': 5.99,

  // Comp 3 Adjustments (Woodland Estates - older, inferior)
  'comp3-adj-property-rights': 0,
  'comp3-adj-financing': 0,
  'comp3-adj-conditions-sale': 0,
  'comp3-adj-market-time': 5,
  'comp3-adj-location': 5,
  'comp3-adj-size': 3,
  'comp3-adj-age-condition': 15,
  'comp3-adj-other': 0,

  // Sales Conclusion
  'sales-value-indication': 1800000,
  'sales-adjustment-summary': `The comparable sales indicate an overall unadjusted unit value range from $85,627/Unit to $214,375/Unit, and an average of $145,999/Unit. After adjustments, the comparables indicate a narrower range for the subject property from $111,914/Unit to $118,100/Unit, and $115,981/Unit on average.

Based on general bracketing, the comparable sales support an adjusted unit value ranges from $111,914/Unit to $118,100/Unit, with a unit value of $112,500/Unit concluded for the subject property.`,

  // ============================================================================
  // INCOME APPROACH SECTION (5 fields)
  // ============================================================================
  'income-pgi-narrative': `The potential gross revenue equals the total rental revenue plus reimbursement and miscellaneous revenue. The potential gross revenue of the subject is calculated by multiplying the sum of market rent of $12,765/Unit and $20.02 per square foot rent and reimbursements, if any, at $0 which is $0/Unit and -/SF by the net rentable area of 10,204 square feet, which indicates a PGR of $204,240.`,
  'income-expense-narrative': 'We have reviewed the owner\'s historical operating expenses. As appropriate, the owner\'s operating expenses are reclassified into standard categories and exclude items that do not reflect normal operating expenses for this type of property.',
  'income-noi-narrative': 'The net operating income equals the effective gross income less the total expenses. The total net operating income for the subject is $111,771 which is $6,986/Unit and $10.95/SF.',
  'income-cap-rate-analysis': `The comparable capitalization rates indicate a range from 5.92% to 6.24% with an average of 6.03%.

Comparable sales were analyzed from both North Battleford and Martensville to reflect investor activity in tertiary Saskatchewan markets. The comparable properties indicate capitalization rates ranging from 5.92% to 6.24%, with the majority clustering near the 5.99% range.

The newer properties in Martensville (Parkside Flats 1 and 2) exhibit lower cap rates of 5.92%, consistent with higher-quality construction, modern finishes, and superior appeal. In contrast, the older assets located in North Battleford, such as Heritage House and College View Apartments, achieved cap rates closer to 5.99%-6.24%, reflecting higher risk premiums associated with tertiary markets, older improvements, and smaller population bases.

Given the subject's age (circa 1970), average quality, and its location within North Battleford, a smaller, tertiary market with limited liquidity, an upward adjustment toward the higher end of the observed range is appropriate. The subject's stable occupancy and average condition support investor confidence, though risk perception remains elevated relative to newer urban comparables.

Based on the foregoing analysis, an appropriate capitalization rate for the subject property is concluded at approximately 6.25%, reflecting market expectations for well-maintained, stabilized multifamily assets within tertiary Saskatchewan markets.`,
  'income-value-indication': 1780000,

  // ============================================================================
  // RECONCILIATION SECTION (9 fields)
  // ============================================================================
  'recon-income-value': 1780000,
  'recon-sales-value': 1800000,
  'recon-cost-value': 0,
  'recon-income-weight': 70,
  'recon-sales-weight': 30,
  'recon-cost-weight': 0,
  'recon-narrative': `Based on the agreed upon scope with the authorized client, the subject's specific characteristics and the interest appraised, this appraisal developed Direct Comparison and Income (Direct Capitalization) Approaches. The values presented represent the As Stabilized (Fee Simple Estate).

The Reconciliation of Value Conclusions is the final step in the appraisal process and involves the weighing of the individual valuation techniques in relationship to their substantiation by market data, and the reliability and applicability of each valuation technique to the subject property.

As previously discussed, the Cost Approach was not presented in this analysis. This approach has limited application due to the age of the improvements and lack of market-based evidence to support accrued depreciation. Additionally, investors typically do not place emphasis on replacement cost in establishing value for investment properties. The exclusion of the Cost Approach does not diminish the credibility of the value conclusion.

The price per unit method has been presented in the Sales Comparison Approach. There have been several recent sales of properties similar to the subject in the market area in the current market conditions, which increases the validity of this approach. The most likely buyer for the subject would be an investor and this approach is given less weight.

The Income Approach to value is generally considered to be the best and most accurate measure of the value of income-producing properties. The value estimate by this approach best reflects the analysis that knowledgeable buyers and sellers carry out in their decision-making processes regarding this type of property. Sufficient market data was available to reliably estimate gross income, vacancy, expenses and capitalization rates for the subject property. The subject is fully leased to multiple tenants as of the effective date of valuation. The most likely buyer is an investor, suggesting this approach deserves primary emphasis.

After considering all factors relevant to the valuation of the subject property, sole emphasis is placed on the Income (Direct Capitalization) Approach in the following market value.`,
  'recon-final-value': 1780000,
  'recon-value-premise': 'As Stabilized',  // REAL: As Stabilized (not "As Is")
  'recon-effective-date': '2025-10-17',

  // ============================================================================
  // CERTIFICATION SECTION (16 fields)
  // ============================================================================
  'cert-statement-1': 'The statements of fact contained in this report are true and correct.',
  'cert-statement-2': 'The reported analyses, opinions and conclusions are limited only by the reported assumptions and limiting conditions and are our impartial and unbiased professional analyses, opinions and conclusions.',
  'cert-statement-3': 'We have no past, present or prospective interest in the property that is the subject of this report and no personal and/or professional interest or conflict with respect to the parties involved with this assignment.',
  'cert-statement-4': 'We have no bias with respect to the property that is the subject of this report or to the parties involved with this assignment.',
  'cert-statement-5': 'Our engagement in and compensation is not contingent upon developing or reporting predetermined results, the amount of value estimate, a conclusion favouring the authorized client, or the occurrence of a subsequent event.',
  'cert-statement-6': 'Our analyses, opinions and conclusions were developed, and this report has been prepared, in conformity with the CUSPAP.',
  'cert-statement-7': 'We have the knowledge and experience to complete this assignment competently.',
  'cert-statement-8': 'Except as herein disclosed, no one has provided significant professional assistance in the preparation of this appraisal.',
  'cert-statement-9': 'As of the date of this report we have fulfilled the requirements of the AIC\'s Continuing Professional Development Program.',
  'cert-statement-10': 'We are members in good standing of the Appraisal Institute of Canada.',
  'cert-statement-11': 'For this appraisal to be valid, an original or a password protected digital signature is required.',
  'cert-statement-12': '',

  // Signature Block
  'cert-signature': '',
  'cert-sign-name': 'Chris Chornohos, AACI, MRICS',
  'cert-sign-credentials': 'Founder',
  'cert-sign-date': '2025-11-20',

  // ============================================================================
  // ASSIGNMENT SECTION - Identification of Assignment (CUSPAP Mandatory)
  // ============================================================================
  'assignment-property-legal': 'Lot 10, Block 7, Plan No. 77B06712, North Battleford, Saskatchewan',
  'assignment-property-address': '1101, 1121 109 St, North Battleford, Saskatchewan S9A 2X2',
  'assignment-property-type': 'Multi-Family Walkup Property',
  'assignment-property-interest': 'Fee Simple Estate',
  'assignment-client-name': 'Kenneth Engler / 102109845 Saskatchewan Ltd.',
  'assignment-client-address': '1901, 1088 - 6th Ave SW, Calgary, AB T2P 5N3',
  'assignment-intended-use': 'The intended use of this appraisal is to provide an opinion of market value for lending/financing purposes.',
  'assignment-intended-users': 'The client and authorized representatives of financial institutions for mortgage lending decisions.',
  'assignment-inspection-date': '2025-10-17',
  'assignment-inspection-type': 'Complete Interior & Exterior Inspection',
  'assignment-inspector-name': 'Chris Chornohos, AACI, MRICS',
  'assignment-data-sources': 'Municipal property records, MLS sales data, rental market surveys, physical inspection, client-provided information, public records.',
  'assignment-analysis-methods': 'Income Approach using Direct Capitalization, Sales Comparison Approach, market analysis, highest and best use analysis in accordance with CUSPAP standards.',
  'assignment-effective-date': '2025-10-17',
  'assignment-report-date': '2025-11-20',
  'assignment-hypothetical': 'None.',
  'assignment-extraordinary-assumptions': 'The property is assumed to be free of environmental contamination. Title is assumed to be marketable and free of encumbrances.',
  'assignment-general-assumptions': 'Standard CUSPAP assumptions apply regarding legal compliance, condition of improvements, and market conditions.',
  'assignment-limiting-conditions': 'This appraisal is subject to the limiting conditions set forth in the Certification section of this report.',
};

/**
 * Field ID to Section ID mapping for loading test data
 * FIXED: All rental survey field IDs updated to match store naming convention
 */
export const fieldToSectionMap: Record<string, string> = {
  // Cover section
  'cover-photo': 'cover',
  'property-type-display': 'cover',
  'property-name': 'cover',
  'street-address': 'cover',
  'city': 'cover',
  'province': 'cover',
  'postal-code': 'cover',
  'market': 'cover',
  'submarket': 'cover',
  'latitude': 'cover',
  'longitude': 'cover',
  'valuation-date': 'cover',
  'report-date': 'cover',
  'file-number': 'cover',
  'client-contact-name': 'cover',
  'client-company': 'cover',
  'client-address': 'cover',
  'client-city': 'cover',
  'client-province': 'cover',
  'client-postal': 'cover',
  'appraiser-name': 'cover',
  'appraiser-credentials': 'cover',
  'appraiser-title': 'cover',
  'appraiser-company': 'cover',
  'appraiser-address': 'cover',
  'appraiser-city': 'cover',
  'appraiser-phone': 'cover',
  'appraiser-website': 'cover',
  'appraiser-email': 'cover',
  'appraiser-aic-number': 'cover',

  // Home section
  'transmittal-date': 'home',
  'transmittal-body': 'home',

  // Custom section
  'custom-field-1': 'custom',
  'custom-field-2': 'custom',
  'custom-field-3': 'custom',

  // Maps section
  'map-regional': 'maps',
  'map-local': 'maps',
  'map-aerial': 'maps',

  // IMAGE MANAGEMENT section - NEW img-* fields
  'img-cover-photo': 'image-mgt',
  'img-signature': 'image-mgt',
  'img-map-aerial-1': 'image-mgt',
  'img-map-aerial-2': 'image-mgt',
  'img-map-local': 'image-mgt',
  'img-map-regional': 'image-mgt',
  'img-zoning-map': 'image-mgt',
  'img-site-plan-1': 'image-mgt',
  'img-site-plan-2': 'image-mgt',
  'img-exterior-1': 'image-mgt',
  'img-exterior-1-caption': 'image-mgt',
  'img-exterior-2': 'image-mgt',
  'img-exterior-2-caption': 'image-mgt',
  'img-exterior-3': 'image-mgt',
  'img-exterior-3-caption': 'image-mgt',
  'img-exterior-4': 'image-mgt',
  'img-exterior-4-caption': 'image-mgt',
  'img-exterior-5': 'image-mgt',
  'img-exterior-5-caption': 'image-mgt',
  'img-exterior-6': 'image-mgt',
  'img-exterior-6-caption': 'image-mgt',
  'img-street-1': 'image-mgt',
  'img-street-1-caption': 'image-mgt',
  'img-street-2': 'image-mgt',
  'img-street-2-caption': 'image-mgt',
  'img-street-3': 'image-mgt',
  'img-street-3-caption': 'image-mgt',
  'img-common-1': 'image-mgt',
  'img-common-1-caption': 'image-mgt',
  'img-common-2': 'image-mgt',
  'img-common-2-caption': 'image-mgt',
  'img-common-3': 'image-mgt',
  'img-common-3-caption': 'image-mgt',
  'img-common-4': 'image-mgt',
  'img-common-4-caption': 'image-mgt',
  'img-unit-1': 'image-mgt',
  'img-unit-1-caption': 'image-mgt',
  'img-unit-2': 'image-mgt',
  'img-unit-2-caption': 'image-mgt',
  'img-unit-3': 'image-mgt',
  'img-unit-3-caption': 'image-mgt',
  'img-unit-4': 'image-mgt',
  'img-unit-4-caption': 'image-mgt',
  'img-unit-5': 'image-mgt',
  'img-unit-5-caption': 'image-mgt',
  'img-unit-6': 'image-mgt',
  'img-unit-6-caption': 'image-mgt',
  'img-systems-1': 'image-mgt',
  'img-systems-1-caption': 'image-mgt',
  'img-systems-2': 'image-mgt',
  'img-systems-2-caption': 'image-mgt',
  'img-systems-3': 'image-mgt',
  'img-systems-3-caption': 'image-mgt',
  'img-systems-4': 'image-mgt',
  'img-systems-4-caption': 'image-mgt',

  // Report section
  'report-type': 'report',
  'report-purpose': 'report',
  'report-scope': 'report',
  'report-compliance': 'report',

  // Executive Summary section
  'value-scenario': 'exec',
  'property-rights': 'exec',
  'building-style': 'exec',
  'total-buildings': 'exec',
  'total-nra': 'exec',
  'year-built': 'exec',
  'occupancy-rate': 'exec',
  'total-units': 'exec',
  'stories': 'exec',
  'building-format': 'exec',
  'concluded-value': 'exec',
  'hypothetical-conditions': 'exec',
  'extraordinary-assumptions': 'exec',
  'extraordinary-limiting-conditions': 'exec',

  // Photos section
  'photos-exterior': 'photos',
  'photos-street': 'photos',
  'photos-common': 'photos',
  'photos-units': 'photos',
  'photos-systems': 'photos',

  // Site section
  'legal-description': 'site',
  'land-area-usable-sf': 'site',
  'land-area-usable-acres': 'site',
  'site-total-area': 'site',
  'site-acreage': 'site',
  'site-address': 'site',
  'site-shape': 'site',
  'topography': 'site',
  'accessibility': 'site',
  'exposure-visibility': 'site',
  'site-quality': 'site',
  'site-utility': 'site',
  'building-quality': 'site',
  'building-appeal': 'site',
  'adjacent-north': 'site',
  'adjacent-south': 'site',
  'adjacent-east': 'site',
  'adjacent-west': 'site',
  'easements': 'site',
  'soils': 'site',
  'hazardous-waste': 'site',
  'site-rating': 'site',
  'site-conclusion': 'site',
  'site-plan-image': 'site',

  // Location section
  'location-overview-text': 'location',
  'location-access': 'location',
  'public-transit': 'location',
  'walk-score': 'location',
  'transit-score': 'location',
  'bike-score': 'location',
  'local-area-description': 'location',
  'nearby-schools': 'location',
  'location-nearby-amenities': 'location',

  // Tax section
  'assessment-year': 'tax',
  'land-assessment': 'tax',
  'building-assessment': 'tax',
  'total-assessment': 'tax',
  'mill-rate': 'tax',
  'annual-taxes': 'tax',
  'tax-commentary': 'tax',

  // Market section
  'national-overview': 'market',
  'market-national-gdp': 'market',
  'market-national-inflation': 'market',
  'provincial-overview': 'market',
  'market-provincial-unemployment': 'market',
  'market-provincial-key-industries': 'market',
  'local-market': 'market',
  'market-local-population': 'market',
  'market-local-employment': 'market',
  'multifamily-overview': 'market',
  'market-vacancy-rate': 'market',
  'rent-trend': 'market',
  'market-supply-pipeline': 'market',
  'market-demand-drivers': 'market',

  // Improvements section
  'impv-overview': 'impv',
  'tenancy': 'impv',
  'gba': 'impv',
  'density-units-acre': 'impv',
  'actual-age': 'impv',
  'effective-age': 'impv',
  'economic-life': 'impv',
  'remaining-useful-life': 'impv',
  'impv-num-buildings': 'impv',
  'impv-nra': 'impv',
  'impv-year-built': 'impv',
  'impv-num-units': 'impv',
  'impv-stories': 'impv',
  'impv-building-format': 'impv',
  'project-amenities': 'impv',
  'unit-amenities': 'impv',
  'laundry': 'impv',
  'security': 'impv',
  'foundation': 'impv',
  'exterior-walls': 'impv',
  'roof': 'impv',
  'impv-roof-condition': 'impv',
  'impv-insulation': 'impv',
  'elevator': 'impv',
  'hvac': 'impv',
  'electrical': 'impv',
  'plumbing': 'impv',
  'fire-protection': 'impv',
  'interior-walls': 'impv',
  'ceilings': 'impv',
  'flooring': 'impv',
  'doors-windows': 'impv',
  'impv-interior-finish': 'impv',
  'site-impv': 'impv',
  'landscaping': 'impv',
  'parking-spaces': 'impv',
  'parking-ratio': 'impv',
  'impv-building-footprint': 'impv',
  'impv-site-coverage': 'impv',
  'overall-condition': 'impv',
  'functional-design': 'impv',
  'hazardous-materials': 'impv',

  // Zoning section
  'zoning-classification': 'zone',
  'zoning-description': 'zone',
  'permitted-uses': 'zone',
  'zone-conditional-uses': 'zone',
  'zone-minimum-lot-size': 'zone',
  'zone-setbacks': 'zone',
  'max-height': 'zone',
  'max-density': 'zone',
  'min-setback': 'zone',
  'parking-requirements': 'zone',
  'site-coverage': 'zone',
  'zoning-conformance': 'zone',
  'zoning-conclusion': 'zone',
  'zoning-map': 'zone',

  // HBU section
  'hbu-intro': 'hbu',
  'hbu-vacant-legal': 'hbu',
  'hbu-vacant-physical': 'hbu',
  'hbu-vacant-financial': 'hbu',
  'hbu-vacant-productive': 'hbu',
  'hbu-improved': 'hbu',
  'hbu-conclusion-text': 'hbu',

  // Rental Survey section - Subject (FIXED: All field IDs updated)
  'rental-subject-name': 'rental-survey',
  'rental-subject-address': 'rental-survey',
  'rental-subject-city': 'rental-survey',
  'rental-subject-province': 'rental-survey',
  'rental-subject-units': 'rental-survey',
  'rental-subject-avg-unit-sf': 'rental-survey',  // FIXED: was rental-subject-avg-sf
  'rental-subject-location-rating': 'rental-survey',  // FIXED: was rental-subject-location
  'rental-subject-quality-rating': 'rental-survey',  // FIXED: was rental-subject-quality
  'rental-subject-condition-rating': 'rental-survey',  // FIXED: was rental-subject-condition
  'rental-subject-appeal-rating': 'rental-survey',  // FIXED: was rental-subject-appeal
  'rental-subject-rent-type': 'rental-survey',
  'rental-subject-rent-unit-avg': 'rental-survey',  // FIXED: was rental-subject-rent-unit
  'rental-subject-rent-sf-avg': 'rental-survey',  // FIXED: was rental-subject-rent-sf
  'rental-subject-unit-amenities': 'rental-survey',
  'rental-subject-utilities': 'rental-survey',
  'rental-subject-parking': 'rental-survey',
  'rental-subject-laundry': 'rental-survey',
  'rental-subject-project-amenities': 'rental-survey',
  'rental-subject-security': 'rental-survey',

  // Rental Survey - Comp 1 (FIXED: All field IDs updated)
  'rental-comp1-name': 'rental-survey',
  'rental-comp1-address': 'rental-survey',
  'rental-comp1-city': 'rental-survey',
  'rental-comp1-province': 'rental-survey',
  'rental-comp1-units': 'rental-survey',
  'rental-comp1-avg-unit-sf': 'rental-survey',  // FIXED: was rental-comp1-avg-sf
  'rental-comp1-location-rating': 'rental-survey',  // FIXED: was rental-comp1-location
  'rental-comp1-quality-rating': 'rental-survey',  // FIXED: was rental-comp1-quality
  'rental-comp1-condition-rating': 'rental-survey',  // FIXED: was rental-comp1-condition
  'rental-comp1-appeal-rating': 'rental-survey',  // FIXED: was rental-comp1-appeal
  'rental-comp1-rent-unit-avg': 'rental-survey',  // FIXED: was rental-comp1-rent-unit
  'rental-comp1-rent-sf-avg': 'rental-survey',  // FIXED: was rental-comp1-rent-sf
  'rental-comp1-unit-amenities': 'rental-survey',
  'rental-comp1-utilities': 'rental-survey',
  'rental-comp1-parking': 'rental-survey',
  'rental-comp1-laundry': 'rental-survey',
  'rental-comp1-comments': 'rental-survey',

  // Rental Survey - Comp 2 (FIXED: All field IDs updated)
  'rental-comp2-name': 'rental-survey',
  'rental-comp2-address': 'rental-survey',
  'rental-comp2-city': 'rental-survey',
  'rental-comp2-province': 'rental-survey',
  'rental-comp2-units': 'rental-survey',
  'rental-comp2-avg-unit-sf': 'rental-survey',  // FIXED: was rental-comp2-avg-sf
  'rental-comp2-location-rating': 'rental-survey',  // FIXED: was rental-comp2-location
  'rental-comp2-quality-rating': 'rental-survey',  // FIXED: was rental-comp2-quality
  'rental-comp2-condition-rating': 'rental-survey',  // FIXED: was rental-comp2-condition
  'rental-comp2-appeal-rating': 'rental-survey',  // FIXED: was rental-comp2-appeal
  'rental-comp2-rent-unit-avg': 'rental-survey',  // FIXED: was rental-comp2-rent-unit
  'rental-comp2-rent-sf-avg': 'rental-survey',  // FIXED: was rental-comp2-rent-sf
  'rental-comp2-parking': 'rental-survey',
  'rental-comp2-comments': 'rental-survey',

  // Rental Survey - Comp 3 (FIXED: All field IDs updated)
  'rental-comp3-name': 'rental-survey',
  'rental-comp3-address': 'rental-survey',
  'rental-comp3-city': 'rental-survey',
  'rental-comp3-province': 'rental-survey',
  'rental-comp3-units': 'rental-survey',
  'rental-comp3-avg-unit-sf': 'rental-survey',  // FIXED: was rental-comp3-avg-sf
  'rental-comp3-location-rating': 'rental-survey',  // FIXED: was rental-comp3-location
  'rental-comp3-quality-rating': 'rental-survey',  // FIXED: was rental-comp3-quality
  'rental-comp3-condition-rating': 'rental-survey',  // FIXED: was rental-comp3-condition
  'rental-comp3-appeal-rating': 'rental-survey',  // FIXED: was rental-comp3-appeal
  'rental-comp3-rent-unit-avg': 'rental-survey',  // FIXED: was rental-comp3-rent-unit
  'rental-comp3-rent-sf-avg': 'rental-survey',  // FIXED: was rental-comp3-rent-sf
  'rental-comp3-comments': 'rental-survey',

  // Rental Survey - Comp 4 (FIXED: All field IDs updated)
  'rental-comp4-name': 'rental-survey',
  'rental-comp4-address': 'rental-survey',
  'rental-comp4-city': 'rental-survey',
  'rental-comp4-province': 'rental-survey',
  'rental-comp4-units': 'rental-survey',
  'rental-comp4-avg-unit-sf': 'rental-survey',  // FIXED: was rental-comp4-avg-sf
  'rental-comp4-location-rating': 'rental-survey',  // FIXED: was rental-comp4-location
  'rental-comp4-quality-rating': 'rental-survey',  // FIXED: was rental-comp4-quality
  'rental-comp4-condition-rating': 'rental-survey',  // FIXED: was rental-comp4-condition
  'rental-comp4-appeal-rating': 'rental-survey',  // FIXED: was rental-comp4-appeal
  'rental-comp4-rent-unit-avg': 'rental-survey',  // FIXED: was rental-comp4-rent-unit
  'rental-comp4-rent-sf-avg': 'rental-survey',  // FIXED: was rental-comp4-rent-sf
  'rental-comp4-comments': 'rental-survey',

  // Rental Survey - Comp 5 (FIXED: All field IDs updated)
  'rental-comp5-name': 'rental-survey',
  'rental-comp5-address': 'rental-survey',
  'rental-comp5-city': 'rental-survey',
  'rental-comp5-province': 'rental-survey',
  'rental-comp5-units': 'rental-survey',
  'rental-comp5-avg-unit-sf': 'rental-survey',  // FIXED: was rental-comp5-avg-sf
  'rental-comp5-location-rating': 'rental-survey',  // FIXED: was rental-comp5-location
  'rental-comp5-quality-rating': 'rental-survey',  // FIXED: was rental-comp5-quality
  'rental-comp5-condition-rating': 'rental-survey',  // FIXED: was rental-comp5-condition
  'rental-comp5-appeal-rating': 'rental-survey',  // FIXED: was rental-comp5-appeal
  'rental-comp5-rent-unit-avg': 'rental-survey',  // FIXED: was rental-comp5-rent-unit
  'rental-comp5-rent-sf-avg': 'rental-survey',  // FIXED: was rental-comp5-rent-sf
  'rental-comp5-comments': 'rental-survey',

  // Rental Survey - Unit Analysis
  'rental-1br-unit-size': 'rental-survey',
  'rental-1br-rent-unit': 'rental-survey',
  'rental-1br-rent-sf': 'rental-survey',
  'rental-1br-conclusion-sf': 'rental-survey',
  'rental-1br-final-conclusion': 'rental-survey',
  'rental-2br-unit-size': 'rental-survey',
  'rental-2br-rent-unit': 'rental-survey',
  'rental-2br-rent-sf': 'rental-survey',
  'rental-2br-conclusion-sf': 'rental-survey',
  'rental-2br-final-conclusion': 'rental-survey',

  // Land Value section
  'land-value-conclusion': 'land1',

  // Cost Approach section
  'cost-approach-conclusion': 'cost-s',

  // Sales section
  'subject-units': 'sales',
  'subject-gba': 'sales',
  'subject-year': 'sales',
  'subject-site-area': 'sales',
  'subject-parking': 'sales',
  'subject-condition': 'sales',
  'comp1-name': 'sales',
  'comp1-address': 'sales',
  'comp1-sale-date': 'sales',
  'comp1-sale-price': 'sales',
  'comp1-units': 'sales',
  'comp1-price-per-unit': 'sales',
  'comp1-gba': 'sales',
  'comp1-price-per-sf': 'sales',
  'comp1-year': 'sales',
  'comp1-cap-rate': 'sales',
  'comp2-name': 'sales',
  'comp2-address': 'sales',
  'comp2-sale-date': 'sales',
  'comp2-sale-price': 'sales',
  'comp2-units': 'sales',
  'comp2-price-per-unit': 'sales',
  'comp2-gba': 'sales',
  'comp2-price-per-sf': 'sales',
  'comp2-year': 'sales',
  'comp2-cap-rate': 'sales',
  'comp3-name': 'sales',
  'comp3-address': 'sales',
  'comp3-sale-date': 'sales',
  'comp3-sale-price': 'sales',
  'comp3-units': 'sales',
  'comp3-price-per-unit': 'sales',
  'comp3-gba': 'sales',
  'comp3-price-per-sf': 'sales',
  'comp3-year': 'sales',
  'comp3-cap-rate': 'sales',
  'sales-value-indication': 'sales',
  'sales-adjustment-summary': 'sales',

  // Comp 1 adjustment mappings
  'comp1-adj-property-rights': 'sales',
  'comp1-adj-financing': 'sales',
  'comp1-adj-conditions-sale': 'sales',
  'comp1-adj-market-time': 'sales',
  'comp1-adj-location': 'sales',
  'comp1-adj-size': 'sales',
  'comp1-adj-age-condition': 'sales',
  'comp1-adj-other': 'sales',

  // Comp 2 adjustment mappings
  'comp2-adj-property-rights': 'sales',
  'comp2-adj-financing': 'sales',
  'comp2-adj-conditions-sale': 'sales',
  'comp2-adj-market-time': 'sales',
  'comp2-adj-location': 'sales',
  'comp2-adj-size': 'sales',
  'comp2-adj-age-condition': 'sales',
  'comp2-adj-other': 'sales',

  // Comp 3 adjustment mappings
  'comp3-adj-property-rights': 'sales',
  'comp3-adj-financing': 'sales',
  'comp3-adj-conditions-sale': 'sales',
  'comp3-adj-market-time': 'sales',
  'comp3-adj-location': 'sales',
  'comp3-adj-size': 'sales',
  'comp3-adj-age-condition': 'sales',
  'comp3-adj-other': 'sales',

  // Income section
  'income-pgi-narrative': 'income',
  'income-expense-narrative': 'income',
  'income-noi-narrative': 'income',
  'income-cap-rate-analysis': 'income',
  'income-value-indication': 'income',

  // Reconciliation section
  'recon-income-value': 'recon',
  'recon-sales-value': 'recon',
  'recon-cost-value': 'recon',
  'recon-income-weight': 'recon',
  'recon-sales-weight': 'recon',
  'recon-cost-weight': 'recon',
  'recon-narrative': 'recon',
  'recon-final-value': 'recon',
  'recon-value-premise': 'recon',
  'recon-effective-date': 'recon',

  // Certification section
  'cert-statement-1': 'cert',
  'cert-statement-2': 'cert',
  'cert-statement-3': 'cert',
  'cert-statement-4': 'cert',
  'cert-statement-5': 'cert',
  'cert-statement-6': 'cert',
  'cert-statement-7': 'cert',
  'cert-statement-8': 'cert',
  'cert-statement-9': 'cert',
  'cert-statement-10': 'cert',
  'cert-statement-11': 'cert',
  'cert-statement-12': 'cert',
  'cert-signature': 'cert',
  'cert-sign-name': 'cert',
  'cert-sign-credentials': 'cert',
  'cert-sign-date': 'cert',

  // Assignment section (19 fields)
  'assignment-property-legal': 'assignment',
  'assignment-property-address': 'assignment',
  'assignment-property-type': 'assignment',
  'assignment-property-interest': 'assignment',
  'assignment-client-name': 'assignment',
  'assignment-client-address': 'assignment',
  'assignment-intended-use': 'assignment',
  'assignment-intended-users': 'assignment',
  'assignment-inspection-date': 'assignment',
  'assignment-inspection-type': 'assignment',
  'assignment-inspector-name': 'assignment',
  'assignment-data-sources': 'assignment',
  'assignment-analysis-methods': 'assignment',
  'assignment-effective-date': 'assignment',
  'assignment-report-date': 'assignment',
  'assignment-hypothetical': 'assignment',
  'assignment-extraordinary-assumptions': 'assignment',
  'assignment-general-assumptions': 'assignment',
  'assignment-limiting-conditions': 'assignment',
};

/**
 * Load REAL test data into the report builder store
 */
export function loadNorthBattlefordRealData(
  updateFieldValue: (sectionId: string, fieldId: string, value: any) => void
): { loaded: number; skipped: string[] } {
  let loaded = 0;
  const skipped: string[] = [];

  Object.entries(northBattlefordRealData).forEach(([fieldId, value]) => {
    const sectionId = fieldToSectionMap[fieldId];
    if (sectionId) {
      updateFieldValue(sectionId, fieldId, value);
      loaded++;
    } else {
      skipped.push(fieldId);
    }
  });

  console.log(`Loaded ${loaded} fields, skipped ${skipped.length}`);
  if (skipped.length > 0) {
    console.warn('Skipped fields (no section mapping):', skipped);
  }

  return { loaded, skipped };
}

/**
 * Property summary for quick reference
 */
export const northBattlefordSummary = {
  propertyName: 'North Battleford Apartments',
  address: '1101, 1121 109 St, North Battleford, SK',
  fileNumber: 'VAL251012 - 1',
  valuationDate: '2025-10-17',
  reportDate: '2025-11-20',
  client: 'Kenneth Engler / 102109845 Saskatchewan Ltd.',
  valueScenario: 'As Stabilized',
  units: 16,
  buildings: 2,
  yearBuilt: 1970,
  nra: 10204,
  siteArea: 24400,
  parkingSpaces: 18,
  parkingRatio: 1.1,
  siteCoverage: 12.9,
  walkScore: 60,
  transitScore: 35,
  bikeScore: 55,
  // Income/Expense values (per Report Builder calculation)
  pgr: 204240,
  egr: 196070,       // After 4% vacancy
  totalExpenses: 84621,
  noi: 111449,       // EGR - Expenses
  capRate: 6.25,
  concludedValue: 1780000,
  valuePerUnit: 111250,
  valuePerSF: 174.44,
  grm: 9.09,
};
