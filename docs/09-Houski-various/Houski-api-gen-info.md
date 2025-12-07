Houski API
https://www.houski.ca/api-documentation
--

Houski.ca allows public users to test its property data platform directly on their website before committing to an API subscription. The website offers a search area and interactive property map that enables users to look up properties, view available data points, check assessment values, permit history, building info, and more—without requiring API access. This lets users see firsthand the depth and breadth of property data Houski can provide and sample its user interface and coverage for both residential and commercial properties. This preliminary testing is valuable to confirm whether Houski's data quality and coverage meet a firm’s needs before investing in automated integration.

--
API documentation overview
What is the Houski property data API?
The Houski property API provides access to the Houski database of over 17 million Canadian properties (and counting).

This means that for the first time ever, detailed property information, including number of bedrooms, bathrooms, etc, is available to the public with fair and transparent per-request pricing.

Manage subscription
Get/view your API key

-
Model Context Protocol
https://www.houski.ca/mcp
The Model Context Protocol (MCP) is an open standard that enables AI models to securely connect to external data sources and tools. Houski's MCP integration allows AI models to query Canadian property data directly, enabling powerful real estate analysis and insights.

Through MCP, AI models can access all Houski API endpoints with natural language queries, making property data analysis more intuitive and powerful than ever before.

Connection endpoint
https://www.houski.ca/mcp
Getting started
Sign up for a Houski account and get your API key
Install an MCP-compatible client (like Claude Desktop)
Configure the client to connect to https://www.houski.ca/mcp
Provide your API key when prompted
Start asking questions about Canadian property data!
Supported MCP clients
Houski's MCP server works with any MCP-compatible client. Popular options include:

Client	Description	Best For
Claude Desktop	Anthropic's official desktop application with built-in MCP support	General users, real estate professionals
Claude Web Interface	Anthropic's web-based interface with MCP capabilities	Cross-platform users, browser-based workflows
Claude messages API	Programmatic access through Anthropic's API with MCP tools	Developers, custom applications
Cursor	Code editor with AI capabilities and MCP integration	Developers, data analysts, technical users
Custom MCP Clients	Build your own MCP client using the open standard	Enterprise integrations, specialized workflows
Example queries
With MCP, you can ask natural language questions and the AI model will intelligently utilize the Houski API to answer them:

Construction planning:

"Where in Calgary would be an optimal location to build a new hospital?"

Urban planning insights:

"Where in Calgary would be optimal to build a new hospital based on population density, income levels, and transit access?"

Climate risk analysis:

"Show me properties in Vancouver with high flood risk scores but low earthquake risk - I need this for insurance underwriting"

Investment arbitrage:

"Find undervalued properties in Toronto where the list price is 20% below the AI estimated value and they have permits for secondary suites"

Gentrification tracking:

"Which neighborhoods in Montreal have seen the biggest increase in renovation permits and new construction in the last 2 years?"

Lifestyle matching:

"I'm a 28-year-old software engineer who bikes to work. Find condos under $600k in areas with high education levels, good internet scores, and strong bike infrastructure"

Market timing strategy:

"Show me properties that have had multiple price decreases in the last 6 months and are now priced below their 2023 assessment values"

Available tools
Houski's MCP server mirrors the entire functionality of the Houski API, providing access to all property data tools. Your AI model of choice can call these tools using natural language queries.

Tool Name	Description	Use Cases
get_data_for_properties	Retrieve detailed property data with filtering, sorting, and expansion options	Market analysis, property research, investment screening
aggregate_properties	Get statistical aggregations (median, mean, percentiles) for market analysis	Market comparisons, pricing analysis, demographic insights
geocode_properties	Find properties around specific coordinates with radius-based search	Location-based searches, proximity analysis, CMA reports
get_locations	Retrieve hierarchical geographic data (countries, provinces, cities, communities)	Market research, location discovery, geographic analysis
get_map_data	Generate map visualization data including pins, clusters, and heatmaps	Spatial analysis, market visualization, trend mapping
predict_property_values	Generate historical property value estimates using machine learning models	Trend analysis, model backtesting, historical research
fuzzy_search_address_tool	Search for specific properties using flexible address matching	Property identification, address lookup, unit searches
validate_api_key	Validate API key authentication and test connectivity	Setup verification, troubleshooting, key validation
search_api_documentation	Access Houski API documentation for learning and reference	Documentation lookup, learning, troubleshooting
Pricing
MCP tool calls are billed according to our standard API pricing. Each tool call corresponds to an API request and is charged based on the data returned.

Same transparent, usage-based pricing as direct API calls
No additional fees for MCP connectivity
Monitor usage through your dashboard
See our pricing page for detailed cost information.

-------

API Recipes
Learn how to use the Houski API with practical examples.

Examples
Get property details in a location
Get a price quote for any API request
Get properties with listing history
Find properties with specific building permits
Find properties by assessment value range
Get recent listings in specific communities
Get age demographics for properties
Calculate ROI, cap rate and cash on cash return
Find luxury homes over $1M with pools
Find family homes with 3+ bedrooms
Search properties by partial address
Get the names of communities in a city
Get map pins for property visualization
Get heatmap data for price analysis
Validate your API key
Find properties within radius of coordinates
Get address from latitude/longitude
Calculate median prices by property type
Compare median prices across cities
Get automated property valuation
List and sale price historical trend
Rental income historical trend
Get property details in a location
Programming language
Select the programming language you want to display the code examples in.


Typescript
Get property details by location
Retrieve detailed property information by filtering on location and property characteristics. This example shows getting properties in a specific community with selected fields like bedrooms, bathrooms, size and price.
Request
Shell session
curl -X GET "https://api.houski.ca/properties?api_key=YOUR_API_KEY&bedroom_gte=3&city=calgary&country_abbreviation=ca&page=1&property_type_eq=House&province_abbreviation=ab&results_per_page=3&select=address,bedroom,den,bathroom_full,bathroom_half,interior_sq_m,estimate_list_price"
TypeScript code
const houski_recipe_data = async (): Promise<PropertiesResponse> => {

    // You must copy the PropertiesResponse type declarations from the
    // Houski API documentation to strongly type the response

    const url = new URL('https://api.houski.ca/properties');
    url.searchParams.set('api_key', 'YOUR_API_KEY');
    url.searchParams.set('bedroom_gte', '3');
    url.searchParams.set('city', 'calgary');
    url.searchParams.set('country_abbreviation', 'ca');
    url.searchParams.set('page', '1');
    url.searchParams.set('property_type_eq', 'House');
    url.searchParams.set('province_abbreviation', 'ab');
    url.searchParams.set('results_per_page', '3');
    url.searchParams.set('select', 'address,bedroom,den,bathroom_full,bathroom_half,interior_sq_m,estimate_list_price');

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

(async () => {
let data: PropertiesResponse = await houski_recipe_data();

// Log the response
console.log(data);
})();
Response
JSON
{
  "cache_hit": false,
  "cost_cents": 2.4000000953674316,
  "data": [
    {
      "address": "6 1744 7 Street SW",
      "bathroom_full": 2,
      "bathroom_half": 0,
      "bedroom": 3,
      "den": 0,
      "estimate_list_price": 1187100,
      "interior_sq_m": 108.7885513305664,
      "property_id": "10004f7afe0c1946"
    },
    {
      "address": "384 Copperpond Landng SE",
      "bathroom_full": 2,
      "bathroom_half": 0,
      "bedroom": 3,
      "den": 0,
      "estimate_list_price": 703300,
      "interior_sq_m": 108.7885513305664,
      "property_id": "10007f9761f49940"
    },
    {
      "address": "239 Dalhurst Way NW",
      "bathroom_full": 2,
      "bathroom_half": 0,
      "bedroom": 3,
      "den": 1,
      "estimate_list_price": 1260437,
      "interior_sq_m": 107.11631774902344,
      "property_id": "100086f6bc064d3f"
    }
  ],
  "error": "",
  "pagination": {
    "current_page": 1,
    "has_next_page": true,
    "has_previous_page": false,
    "page_total": 140614
  },
  "price_quote": false,
  "result_total": 421841,
  "time_ms": 97,
  "ui_info": {
    "city": "Calgary",
    "city_id": "6ec95b53075d062c",
    "city_link": "ca/ab/calgary",
    "city_slug": "calgary",
    "country": "Canada",
    "country_abbreviation": "CA",
    "country_abbreviation_id": "9ace2b6431b7f1be",
    "country_abbreviation_link": "ca",
    "country_slug": "canada",
    "province": "Alberta",
    "province_abbreviation": "AB",
    "province_abbreviation_id": "aae1f05a0f89d2c7",
    "province_abbreviation_link": "ca/ab",
    "province_slug": "alberta"
  }
}

----------

Fields and expansions
This page contains information on all data that can be returned from the Houski API, for both regular fields as well as expansion data sets.

Expansion data sets are different from regular fields. They are sets of data versus single values. For example, a property's city assessment data for various years.

The following table provides a list of available fields in the Houski Property Data API, along with their meta data for reference.

Each field has a price, and indicates if it can be sorted, filtered, and predicted.

Expansion data sets
The Houski API can provide you with extensive property listing, rental, assessment and permit data for many properties across Canada. Expansion data sets costs 1 cent per row.

Sale listings
Name	Description	Values	Sortable	Filterable	Source
expand_estimate_list_price
Show
N/A	Yes	Yes	AI
expand_listing_date
Show
N/A	Yes	Yes	AI
expand_listing_event
Show
Show
Yes	Yes	AI
Rental listings
Name	Description	Values	Sortable	Filterable	Source
expand_estimate_rent_monthly
Show
N/A	Yes	Yes	AI
expand_for_rent_what_is
Show
Show
Yes	Yes	AI
expand_listing_rent_date
Show
N/A	Yes	Yes	AI
expand_listing_rent_event
Show
Show
Yes	Yes	AI
Assessments
Name	Description	Values	Sortable	Filterable	Source
expand_assessment_year
Show
N/A	Yes	Yes	document
expand_assessment_value
Show
N/A	Yes	Yes	document
Permits
Name	Description	Values	Sortable	Filterable	Source
expand_permit_application_date
Show
N/A	Yes	Yes	document
expand_permit_content
Show
N/A	Yes	Yes	document
expand_permit_type
Show
N/A	Yes	Yes	document
Fields
These are the available information fields for all properties in the database.

Name ▲	Description	Price ▲	Values	Sortable ▲	Filterable ▲	Predictable ▲	Source ▲
address
Show
$0.0010	N/A	Yes	Yes	No	AI
address_link
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
address_slug
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
air_cleaner_brand
Show
$0.0010
Show
Yes	Yes	No	AI
air_cleaner_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
air_cleaner_type
Show
$0.0010
Show
Yes	Yes	No	AI
architecture_style
Show
$0.0010
Show
Yes	Yes	No	AI
area_commercial_list_price_per_sq_m
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
area_comparable_assessment_value_per_sq_m
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
area_comparable_list_price_per_sq_m
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
area_comparable_property_tax_per_sq_m
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
area_residential_list_price_per_sq_m
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
area_residential_rent_price_per_sq_m
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
assessment_value
Show
$0.0010	N/A	Yes	Yes	No	AI
assessment_vs_estimate
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
assessment_year
Show
$0.0010	N/A	Yes	Yes	No	document
attic_is_functional
Show
$0.0010
Show
Yes	Yes	No	AI
backs_onto
Show
$0.0010
Show
Yes	Yes	No	AI
balcony_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
balcony_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
balcony_type_third
Show
$0.0010
Show
Yes	Yes	No	AI
basement_ceiling_height_m
Show
$0.0010	N/A	Yes	Yes	No	AI
basement_finish
Show
$0.0010
Show
Yes	Yes	No	AI
basement_has_crawlspace
Show
$0.0010
Show
Yes	Yes	No	AI
basement_has_entrance
Show
$0.0010
Show
Yes	Yes	No	AI
basement_is_walkout
Show
$0.0010
Show
Yes	Yes	No	AI
basement_type
Show
$0.0010
Show
Yes	Yes	No	AI
basement_year_last_renovated
Show
$0.0010	N/A	Yes	Yes	No	AI
bathroom_full
Show
$0.0010	N/A	Yes	Yes	No	AI
bathroom_half
Show
$0.0010	N/A	Yes	Yes	No	AI
bathroom_total
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
bathroom_year_last_renovated
Show
$0.0010	N/A	Yes	Yes	No	AI
bedroom
Show
$0.0010	N/A	Yes	Yes	No	AI
bedroom_total
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
bedroom_year_last_renovated
Show
$0.0010	N/A	Yes	Yes	No	AI
building_name
Show
$0.0010	N/A	Yes	Yes	No	AI
cap_rate
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
carport_parking_space
Show
$0.0010	N/A	Yes	Yes	No	AI
cash_on_cash_return
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
cat_allowed_by_bylaw
Show
$0.0010
Show
Yes	Yes	No	AI
cat_allowed_by_bylaw_require_approval
Show
$0.0010
Show
Yes	Yes	No	AI
ceiling_height_m
Show
$0.0010	N/A	Yes	Yes	No	AI
ceiling_is_vaulted
Show
$0.0010
Show
Yes	Yes	No	AI
ceiling_style
Show
$0.0010
Show
Yes	Yes	No	AI
city
Show
$0.0010	N/A	Yes	Yes	No	document
city_id
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
city_link
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
city_slug
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
commercial_use
Show
$0.0010
Show
Yes	Yes	No	AI
community
Show
$0.0010	N/A	Yes	Yes	No	community_source
community_id
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
community_link
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
community_slug
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
community_source
Show
$0.0001
Show
Yes	Yes	No	none
construction_age
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
construction_material
Show
$0.0010
Show
Yes	Yes	No	AI
construction_year
Show
$0.0010	N/A	Yes	Yes	No	construction_year_source
construction_year_source
Show
$0.0001
Show
Yes	Yes	No	none
converted_to_commercial_use
Show
$0.0010
Show
Yes	Yes	No	AI
converted_to_residential_use
Show
$0.0010
Show
Yes	Yes	No	AI
cooling_brand_first
Show
$0.0010
Show
Yes	Yes	No	AI
cooling_install_year_first
Show
$0.0010	N/A	Yes	Yes	No	AI
cooling_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
cooling_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
country
Show
$0.0010	N/A	Yes	Yes	No	document
country_abbreviation
Show
$0.0010	N/A	Yes	Yes	No	document
country_abbreviation_id
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
country_abbreviation_link
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
country_slug
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
demographic_age_0_to_4_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_100_years_and_over_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_10_to_14_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_15_to_19_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_20_to_24_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_25_to_29_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_30_to_34_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_35_to_39_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_40_to_44_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_45_to_49_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_50_to_54_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_55_to_59_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_5_to_9_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_60_to_64_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_65_to_69_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_70_to_74_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_75_to_79_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_80_to_84_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_85_to_89_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_90_to_94_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_95_to_99_years_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_average_of_the_population
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_age_median_of_the_population
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_covid_19_government_pre_tax_income_support_and_benefit_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_dwellings_occupied_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_agriculture_natural_resources_and_conservation_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_architecture_engineering_and_related_trades_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_business_management_and_public_administration_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_health_and_related_fields_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_humanities_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_mathematics_computer_and_information_sciences_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_personal_protective_and_transportation_services_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_physical_and_life_sciences_and_technologies_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_social_and_behavioral_sciences_and_law_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_degree_teaching_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_level_apprenticeship_or_trades_certificate_or_diploma_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_level_bachelors_degree_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_level_degree_in_medicine_dentistry_veterinary_medicine_or_optometry_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_level_earned_doctorate_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_level_high_school_diploma_or_equivalency_certificate_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_level_masters_degree_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_education_level_no_certificate_diploma_or_degree_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_employed_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_accommodation_and_food_services_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_administrative_and_support_waste_management_and_remediation_services_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_agriculture_forestry_fishing_and_hunting_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_arts_entertainment_and_recreation_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_construction_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_educational_services_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_finance_and_insurance_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_health_care_and_social_assistance_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_information_and_cultural_industries_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_management_of_companies_and_enterprises_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_manufacturing_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_mining_quarrying_and_oil_and_gas_extraction_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_other_services_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_professional_scientific_and_technical_services_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_public_administration_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_real_estate_and_rental_and_leasing_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_retail_trade_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_transportation_and_warehousing_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_utilities_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_industries_wholesale_trade_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_insurance_benefit_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_business_finance_and_administration_occupations_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_health_occupations_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_in_art_culture_recreation_and_sport_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_in_education_law_and_social_community_and_government_services_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_in_manufacturing_and_utilities_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_legislative_and_senior_management_occupations_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_natural_and_applied_sciences_and_related_occupations_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_natural_resources_agriculture_and_related_production_occupations_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_sales_and_service_occupations_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_occupations_trades_transport_and_equipment_operators_and_related_occupations_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_pre_tax_income_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_employment_unemployed_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_size_1_person_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_size_2_persons_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_size_3_persons_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_size_4_persons_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_size_5_or_more_persons_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_type_family_with_children_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_type_family_without_children_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_type_single_with_children_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_household_type_single_without_children_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_100000_to_149999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_10000_to_19999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_150000_and_over_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_20000_to_29999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_30000_to_39999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_40000_to_49999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_50000_to_59999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_60000_to_69999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_70000_to_79999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_80000_to_89999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_90000_to_99999_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_average_after_tax
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_average_pre_tax
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_median_after_tax
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_median_pre_tax
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_income_under_10000_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_language_most_spoken_fifth
Show
$0.0010
Show
Yes	Yes	No	AI
demographic_language_most_spoken_fifth_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_language_most_spoken_first
Show
$0.0010
Show
Yes	Yes	No	AI
demographic_language_most_spoken_first_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_language_most_spoken_fourth
Show
$0.0010
Show
Yes	Yes	No	AI
demographic_language_most_spoken_fourth_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_language_most_spoken_second
Show
$0.0010
Show
Yes	Yes	No	AI
demographic_language_most_spoken_second_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_language_most_spoken_third
Show
$0.0010
Show
Yes	Yes	No	AI
demographic_language_most_spoken_third_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_marital_status_common_law_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_marital_status_married_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_marital_status_single_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_median_covid_19_emergency_and_recovery_benefits
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_municipal_population
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_municipal_population_density_sq_km
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_municipal_population_female_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_municipal_population_male_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_transportation_bicycle_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_transportation_car_truck_or_van_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_transportation_public_transit_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
demographic_transportation_walk_percent
Show
$0.0010	N/A	Yes	Yes	No	AI
den
Show
$0.0010	N/A	Yes	Yes	No	AI
direction_facing
Show
$0.0010
Show
Yes	Yes	No	AI
dog_allowed_by_bylaw
Show
$0.0010
Show
Yes	Yes	No	AI
dog_allowed_by_bylaw_require_approval
Show
$0.0010
Show
Yes	Yes	No	AI
driveway_parking_space
Show
$0.0010	N/A	Yes	Yes	No	AI
electricity_provider
Show
$0.0010
Show
Yes	Yes	No	AI
elevator
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_city_population
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
estimate_days_on_market_until_rented
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_days_on_market_until_sale
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_list_price
Show
$0.0010	N/A	Yes	Yes	Yes	AI
estimate_monthly_electrical_cost
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_monthly_heat_cost
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_monthly_water_cost
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_political_lean
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
estimate_rent_date_listed
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_rent_date_rented
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_rent_monthly
Show
$0.0010	N/A	Yes	Yes	Yes	AI
estimate_sale_date_listed
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_sale_date_sold
Show
$0.0010	N/A	Yes	Yes	No	AI
estimate_sale_price
Show
$0.0010	N/A	Yes	Yes	Yes	AI
estimate_sale_price_per_sq_m
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
exterior_finish
Show
$0.0010
Show
Yes	Yes	No	AI
exterior_year_last_renovated
Show
$0.0010	N/A	Yes	Yes	No	AI
fence_type
Show
$0.0010
Show
Yes	Yes	No	AI
fire_suppression_type
Show
$0.0010
Show
Yes	Yes	No	AI
fireplace
Show
$0.0010	N/A	Yes	Yes	No	AI
floor_above_ground
Show
$0.0010	N/A	Yes	Yes	No	AI
floor_below_ground
Show
$0.0010	N/A	Yes	Yes	No	AI
floor_material_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
floor_material_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
floor_plan_type
Show
$0.0010
Show
Yes	Yes	No	AI
for_rent
Show
$0.0010
Show
Yes	Yes	No	AI
for_rent_by
Show
$0.0010
Show
Yes	Yes	No	AI
for_rent_has_own_laundry
Show
$0.0010
Show
Yes	Yes	No	AI
for_rent_has_seperate_external_entrance
Show
$0.0010
Show
Yes	Yes	No	AI
for_sale
Show
$0.0010
Show
Yes	Yes	No	AI
for_sale_by
Show
$0.0010
Show
Yes	Yes	No	AI
for_sale_list_date
Show
$0.0010	N/A	Yes	Yes	No	AI
foundation_type
Show
$0.0010
Show
Yes	Yes	No	AI
fronts_onto
Show
$0.0010
Show
Yes	Yes	No	AI
furnished
Show
$0.0010
Show
Yes	Yes	No	AI
garage_240v_first
Show
$0.0010
Show
Yes	Yes	No	AI
garage_240v_second
Show
$0.0010
Show
Yes	Yes	No	AI
garage_floor_above_ground_first
Show
$0.0010	N/A	Yes	Yes	No	AI
garage_floor_above_ground_second
Show
$0.0010	N/A	Yes	Yes	No	AI
garage_floor_below_ground_first
Show
$0.0010	N/A	Yes	Yes	No	AI
garage_floor_below_ground_second
Show
$0.0010	N/A	Yes	Yes	No	AI
garage_heating_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
garage_heating_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
garage_parking_space_first
Show
$0.0010	N/A	Yes	Yes	No	AI
garage_parking_space_second
Show
$0.0010	N/A	Yes	Yes	No	AI
garage_tandem_first
Show
$0.0010
Show
Yes	Yes	No	AI
garage_tandem_second
Show
$0.0010
Show
Yes	Yes	No	AI
garage_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
garage_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
gas_provider
Show
$0.0010
Show
Yes	Yes	No	AI
has_assigned_storage_space
Show
$0.0010
Show
Yes	Yes	No	AI
has_backyard
Show
$0.0010
Show
Yes	Yes	No	AI
has_expand_listings
Show
$0.0010
Show
Yes	Yes	No	AI
has_expand_listings_rent
Show
$0.0010
Show
Yes	Yes	No	AI
has_frontyard
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_indoor_gym
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_indoor_hot_tub
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_indoor_sauna
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_indoor_swimming_pool
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_indoor_workshop
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_outdoor_gym
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_outdoor_hot_tub
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_outdoor_sauna
Show
$0.0010
Show
Yes	Yes	No	AI
has_private_outdoor_swimming_pool
Show
$0.0010
Show
Yes	Yes	No	AI
has_rv_parking
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_indoor_gym
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_indoor_hot_tub
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_indoor_sauna
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_indoor_swimming_pool
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_indoor_workshop
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_laundry_room
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_outdoor_gym
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_outdoor_hot_tub
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_outdoor_sauna
Show
$0.0010
Show
Yes	Yes	No	AI
has_shared_outdoor_swimming_pool
Show
$0.0010
Show
Yes	Yes	No	AI
heating_brand_first
Show
$0.0010
Show
Yes	Yes	No	AI
heating_install_year_first
Show
$0.0010	N/A	Yes	Yes	No	AI
heating_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
heating_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
humidifier_brand
Show
$0.0010
Show
Yes	Yes	No	AI
humidifier_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
humidifier_type
Show
$0.0010
Show
Yes	Yes	No	AI
image
Show
$0.0100	N/A	Yes	Yes	No	none
in_cul_de_sac
Show
$0.0010
Show
Yes	Yes	No	AI
interior_sq_m
Show
$0.0010	N/A	Yes	Yes	No	interior_sq_m_source
interior_sq_m_source
Show
$0.0001
Show
Yes	Yes	No	none
internet_provider
Show
$0.0010
Show
Yes	Yes	No	AI
irrigation_system_type
Show
$0.0010
Show
Yes	Yes	No	AI
is_commercial
Show
$0.0010
Show
Yes	Yes	No	is_commercial_source
is_commercial_source
Show
$0.0001
Show
Yes	Yes	No	none
is_condemned
Show
$0.0010
Show
Yes	Yes	No	AI
is_farmland
Show
$0.0010
Show
Yes	Yes	No	is_farmland_source
is_farmland_source
Show
$0.0001
Show
Yes	Yes	No	none
is_judicial_sale
Show
$0.0010
Show
Yes	Yes	No	AI
is_residential
Show
$0.0010
Show
Yes	Yes	No	is_residential_source
is_residential_source
Show
$0.0001
Show
Yes	Yes	No	none
kitchen_appliance_brand
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_appliance_finish
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_countertop_material
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_dishwasher_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
kitchen_dishwasher_type
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_fridge_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
kitchen_fridge_type
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_microwave_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
kitchen_microwave_type
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_stove_heat_type
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_stove_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
kitchen_stove_type
Show
$0.0010
Show
Yes	Yes	No	AI
kitchen_year_last_renovated
Show
$0.0010	N/A	Yes	Yes	No	AI
land_area_sq_m
Show
$0.0010	N/A	Yes	Yes	No	land_area_sq_m_source
land_area_sq_m_source
Show
$0.0001
Show
Yes	Yes	No	none
land_depth_m
Show
$0.0010	N/A	Yes	Yes	No	AI
land_frontage_m
Show
$0.0010	N/A	Yes	Yes	No	AI
latitude
Show
$0.0010	N/A	Yes	Yes	No	document
laundry_appliance_brand
Show
$0.0010
Show
Yes	Yes	No	AI
laundry_appliance_finish
Show
$0.0010
Show
Yes	Yes	No	AI
laundry_dryer_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
laundry_dryer_type
Show
$0.0010
Show
Yes	Yes	No	AI
laundry_washer_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
laundry_washer_type
Show
$0.0010
Show
Yes	Yes	No	AI
list_price
Show
$0.0010	N/A	Yes	Yes	No	AI
list_price_vs_estimate
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
living_room_year_last_renovated
Show
$0.0010	N/A	Yes	Yes	No	AI
loading_bays
Show
$0.0010	N/A	Yes	Yes	No	AI
longitude
Show
$0.0010	N/A	Yes	Yes	No	document
maintenance_fee
Show
$0.0010	N/A	Yes	Yes	No	AI
maintenance_fee_include_electric
Show
$0.0010
Show
Yes	Yes	No	AI
maintenance_fee_include_heat
Show
$0.0010
Show
Yes	Yes	No	AI
maintenance_fee_include_water
Show
$0.0010
Show
Yes	Yes	No	AI
need_ceiling_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_cooling_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_drywall_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_electrical_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_floor_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_foundation_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_heating_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_mold_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_paint_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_plumbing_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_roof_repair
Show
$0.0010
Show
Yes	Yes	No	AI
need_window_repair
Show
$0.0010
Show
Yes	Yes	No	AI
outbuilding_type_fifth
Show
$0.0010
Show
Yes	Yes	No	AI
outbuilding_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
outbuilding_type_fourth
Show
$0.0010
Show
Yes	Yes	No	AI
outbuilding_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
outbuilding_type_third
Show
$0.0010
Show
Yes	Yes	No	AI
ownership_type
Show
$0.0010
Show
Yes	Yes	No	AI
parent_address
Show
$0.0010	N/A	Yes	Yes	No	AI
parent_property_id
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
parking_lot_parking_space
Show
$0.0010	N/A	Yes	Yes	No	AI
parking_lot_parking_space_legal_type
Show
$0.0010
Show
Yes	Yes	No	AI
plumbing_pipe_material
Show
$0.0010
Show
Yes	Yes	No	AI
postal_code
Show
$0.0010	N/A	Yes	Yes	No	postal_code_source
postal_code_source
Show
$0.0001
Show
Yes	Yes	No	none
property_id
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
property_taxes
Show
$0.0010	N/A	Yes	Yes	No	AI
property_taxes_year
Show
$0.0010	N/A	Yes	Yes	No	none
property_type
Show
$0.0010
Show
Yes	Yes	No	AI
province
Show
$0.0010	N/A	Yes	Yes	No	document
province_abbreviation
Show
$0.0010	N/A	Yes	Yes	No	document
province_abbreviation_id
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
province_abbreviation_link
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
province_slug
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
rent_monthly
Show
$0.0010	N/A	Yes	Yes	No	AI
return_on_investment
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
roof_is_functional
Show
$0.0010
Show
Yes	Yes	No	AI
roof_material
Show
$0.0010
Show
Yes	Yes	No	AI
roof_material_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
score_air_quality
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_bicycle
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_cell_coverage
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_curb_appeal
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_earthquake
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_education
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_entertainment
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_family
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_fire
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_flood
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_food_and_drink
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_hurricane
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_internet
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_nature
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_parking
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_quiet
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_retirement
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_safety
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_shopping
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_smell
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_tornado
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_total
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
score_total_percent
Show
$0.0010	N/A	Yes	Yes	No	calc'd from other fields
score_traffic
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_transit
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_walkability
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
score_water_quality
Show
$0.0010
Show
Yes	Yes	No	vote/crowd-sourced
secondary_suite_has_own_laundry_first
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_has_own_laundry_second
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_has_own_laundry_third
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_seperate_entrance_first
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_seperate_entrance_second
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_seperate_entrance_third
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
secondary_suite_type_third
Show
$0.0010
Show
Yes	Yes	No	AI
shared_bicycle_storage_type
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_240v_first
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_240v_second
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_floor_above_ground_first
Show
$0.0010	N/A	Yes	Yes	No	AI
shared_garage_floor_above_ground_second
Show
$0.0010	N/A	Yes	Yes	No	AI
shared_garage_floor_below_ground_first
Show
$0.0010	N/A	Yes	Yes	No	AI
shared_garage_floor_below_ground_second
Show
$0.0010	N/A	Yes	Yes	No	AI
shared_garage_heating_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_heating_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_legal_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_legal_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_parking_space_first
Show
$0.0010	N/A	Yes	Yes	No	AI
shared_garage_parking_space_second
Show
$0.0010	N/A	Yes	Yes	No	AI
shared_garage_tandem_first
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_tandem_second
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_type_first
Show
$0.0010
Show
Yes	Yes	No	AI
shared_garage_type_second
Show
$0.0010
Show
Yes	Yes	No	AI
shared_parking_lot_parking_space
Show
$0.0010	N/A	Yes	Yes	No	AI
shared_parking_lot_parking_space_legal_type
Show
$0.0010
Show
Yes	Yes	No	AI
summer_garbage_pickup_day
Show
$0.0010
Show
Yes	Yes	No	AI
summer_garbage_pickup_schedule
Show
$0.0010
Show
Yes	Yes	No	AI
summer_organic_waste_pickup_day
Show
$0.0010
Show
Yes	Yes	No	AI
summer_organic_waste_pickup_schedule
Show
$0.0010
Show
Yes	Yes	No	AI
summer_recycle_pickup_day
Show
$0.0010
Show
Yes	Yes	No	AI
summer_recycle_pickup_schedule
Show
$0.0010
Show
Yes	Yes	No	AI
view_type
Show
$0.0010
Show
Yes	Yes	No	AI
water_heater_brand
Show
$0.0010
Show
Yes	Yes	No	AI
water_heater_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
water_heater_type
Show
$0.0010
Show
Yes	Yes	No	AI
water_provider
Show
$0.0010
Show
Yes	Yes	No	AI
water_softener_brand
Show
$0.0010
Show
Yes	Yes	No	AI
water_softener_install_year
Show
$0.0010	N/A	Yes	Yes	No	AI
water_softener_type
Show
$0.0010
Show
Yes	Yes	No	AI
winter_garbage_pickup_day
Show
$0.0010
Show
Yes	Yes	No	AI
winter_garbage_pickup_schedule
Show
$0.0010
Show
Yes	Yes	No	AI
winter_organic_waste_pickup_day
Show
$0.0010
Show
Yes	Yes	No	AI
winter_organic_waste_pickup_schedule
Show
$0.0010
Show
Yes	Yes	No	AI
winter_recycle_pickup_day
Show
$0.0010
Show
Yes	Yes	No	AI
winter_recycle_pickup_schedule
Show
$0.0010
Show
Yes	Yes	No	AI
workshop_type
Show
$0.0010
Show
Yes	Yes	No	AI
zoning
Show
$0.0010	N/A	Yes	Yes	No	zoning_source
zoning_source

----------

/aggregate
GET
https://api.houski.ca/aggregate
This endpoint returns averages of property data for a given location. You can use this endpoint to get an overview of the property market or property features in a specific area.

This endpoint handles single and batch requests. Batch requests, which enable multiple operations with varying fields, aggregations, and filters in one go, are more efficient than multiple single requests.

Example use cases
Real estate analysts can perform granular market trend analysis by comparing average property prices, square footage, or other characteristics across different neighborhoods or cities.
Provide potential buyers or renters with insights into the average costs of properties (e.g., rent, purchase price) in different areas, enhancing their search experience.
Assist real estate investors in identifying undervalued areas by comparing the average property values against regional income levels.
Portfolio managers can assess the performance of their real estate investments by tracking changes in the average value of properties within their portfolio over time.
Support government housing authorities in monitoring and developing policies related to affordable housing by analyzing the average prices of properties across different zones.
Request parameters
Name	Required	Type	Description
api_key	Yes	UUID v4	Your API key for authorization
field	Yes	String	The field to be aggregated - see fields for all available fields
aggregation	No	String	The aggregation type:
count
sum
mean
median (default)
mode
max
min
quantile-10
quantile-25
quantile-40
quantile-60
quantile-75
quantile-80
quantile-85
quantile-90
quantile-95
quantile-99
country_abbreviation	No	String	A country abbreviation
province_abbreviation	No	String	A province abbreviation within the country
city	No	String	A city within the province
community	No	String	A community within the city
Response object
Type declarations are available at the bottom of this page.

Name	Type	Description
cache_hit	Boolean	Indicates if the response was a cache hit
cost_cents	Integer	Cost of the request in cents
data	Array<AggregateData>	Array containing the aggregation results data
error	String	Details about the error. Empty if no error
price_quote	Boolean	Indicates whether the response is a price quote
time_ms	Integer	Time taken for the request to complete in milliseconds
AggregateData object
Each aggregation result contains the following fields:

Name	Type	Description
field	String	The field that was aggregated (e.g., 'estimate_list_price', 'bedroom')
aggregation	String	The aggregation method used (e.g., 'median', 'mean', 'count', 'sum')
value	String	The calculated aggregate value as a string
Example requests and responses
Programming language
Select the programming language you want to display the code examples in.


Typescript
Get the average list price in a community
This request returns the median list price of properties in the Riverbend community in Calgary, Alberta, Canada.
Request
Shell session
curl -X GET "https://api.houski.ca/aggregate?aggregation=median&api_key=YOUR_API_KEY&city=calgary&community=riverbend&country_abbreviation=ca&field=estimate_list_price&province_abbreviation=ab"
TypeScript code
const houski_get_aggregate = async (): Promise<AggregateResponse> => {

    // You must copy the AggregateResponse type declarations from the
    // Houski API documentation to strongly type the response

    const url = new URL('https://api.houski.ca/aggregate');
    url.searchParams.set('aggregation', 'median');
    url.searchParams.set('api_key', 'YOUR_API_KEY');
    url.searchParams.set('city', 'calgary');
    url.searchParams.set('community', 'riverbend');
    url.searchParams.set('country_abbreviation', 'ca');
    url.searchParams.set('field', 'estimate_list_price');
    url.searchParams.set('province_abbreviation', 'ab');

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

(async () => {
let data: AggregateResponse = await houski_get_aggregate();

// Log the response
console.log(data);
})();
Response
JSON
{
  "cache_hit": false,
  "cost_cents": 1.0,
  "data": [
    {
      "aggregation": "median",
      "field": "estimate_list_price",
      "value": "654585"
    }
  ],
  "error": "",
  "price_quote": false,
  "time_ms": 25
}
Multiple batched aggregate query
This request performs multiple aggregate operations batched together.
Request
Shell session
curl -X GET "https://api.houski.ca/aggregate?agg0_aggregation=sum&agg0_city=edmonton&agg0_country_abbreviation=ca&agg0_field=bedroom&agg0_property_type_eq=Apartment&agg0_province_abbreviation=ab&agg1_aggregation=median&agg1_city=calgary&agg1_country_abbreviation=ca&agg1_field=estimate_list_price&agg1_property_type_eq=House&agg1_province_abbreviation=ab&api_key=YOUR_API_KEY"
TypeScript code
const houski_get_aggregate_batch = async (): Promise<AggregateResponse> => {

    // You must copy the AggregateResponse type declarations from the
    // Houski API documentation to strongly type the response

    const url = new URL('https://api.houski.ca/aggregate');
    url.searchParams.set('agg0_aggregation', 'sum');
    url.searchParams.set('agg0_city', 'edmonton');
    url.searchParams.set('agg0_country_abbreviation', 'ca');
    url.searchParams.set('agg0_field', 'bedroom');
    url.searchParams.set('agg0_property_type_eq', 'Apartment');
    url.searchParams.set('agg0_province_abbreviation', 'ab');
    url.searchParams.set('agg1_aggregation', 'median');
    url.searchParams.set('agg1_city', 'calgary');
    url.searchParams.set('agg1_country_abbreviation', 'ca');
    url.searchParams.set('agg1_field', 'estimate_list_price');
    url.searchParams.set('agg1_property_type_eq', 'House');
    url.searchParams.set('agg1_province_abbreviation', 'ab');
    url.searchParams.set('api_key', 'YOUR_API_KEY');

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

(async () => {
let data: AggregateResponse = await houski_get_aggregate_batch();

// Log the response
console.log(data);
})();
Response
JSON
{
  "cache_hit": false,
  "cost_cents": 2.0,
  "data": [
    {
      "aggregation": "sum",
      "field": "bedroom",
      "value": "56851"
    },
    {
      "aggregation": "median",
      "field": "estimate_list_price",
      "value": "755685"
    }
  ],
  "error": "",
  "price_quote": false,
  "time_ms": 52
}
Response type declarations
TypeScript code
interface AggregateResponse {
    cache_hit: boolean;
    cost_cents: number;
    data: AggregateData[];
    error: string;
    price_quote: boolean;
    time_ms: number;
}

interface AggregateData {
    field: string;
    aggregation: string;
    value: string;
}

-----------
