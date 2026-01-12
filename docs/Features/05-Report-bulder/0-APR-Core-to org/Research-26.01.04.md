RESEARCH COMPLETE - Here's What I Found

The Real Picture

| What                             | Count | Where               |
|----------------------------------|-------|---------------------|
| Total Registry Fields            | 1,687 | fieldRegistry.ts    |
| User-Input Fields                | 1,252 | In registry         |
| Calculated Fields                | 332   | Calc engine outputs |
| Actual Human Entry (Full Report) | ~575  | Forms + comps       |
| Calc Engine Inputs Specifically  | 24    | Calculator panels   |

EditPanel Structure

208 fields in 9 hardcoded *_FIELD_LAYOUT arrays:
- HOME: 43 fields
- COVER: 9 fields
- SITE: 20 fields
- IMPV: 44 fields
- SALES: 46 fields
- etc.

Plus specialized TabPanels with their own layouts (HomeTabPanel has 80+ fields alone)

KEY FINDING: Calc Engine Inputs

The 24 calc engine input fields (calc-type1-count, calc-vacancy-rate, etc.) are NOT in EditPanel layouts. They're in:
- OperatingHistoryPanel
- IncomeApproachPanel

These are separate calculator components within IncomeTabPanel.

Your Slash Commands

| Command                          | Does                           |
|----------------------------------|--------------------------------|
| /check-apr-domain-knowledge      | Load complete domain reference |
| /check-apr-field-varify          | 8-step field sync verification |
| /check-apr-domain-registry-agent | Registry Expert persona        |
| /check-apr-frontend-agent        | Template Expert persona  



-----
-----

# Template Field IDs - Readable Format

**Total Unique Field IDs:** 1252
**Fields with Mock Data:** 1242
**Pages:** 76

## Page -4

**Fields:** 19

### city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### client-address
- **Label:** Client Address
- **Toggle Mock Data:** "1901, 1088 - 6th Ave SW,"

### client-city-state-zip
- **Label:** Client City/State/Zip
- **Toggle Mock Data:** "Calgary, AB T2P 5N3"

### client-full-name
- **Label:** Client Full Name
- **Toggle Mock Data:** "Kenneth Engler"

### client-organization
- **Label:** Organization
- **Toggle Mock Data:** "102109845 Saskatchewan Ltd."

### company-address
- **Label:** Company Address
- **Toggle Mock Data:** "#300, 4658 Richard Road SW"

### company-city-state-zip
- **Label:** Company City/State/Zip
- **Toggle Mock Data:** "Calgary, AB T3E 6L1"

### company-name
- **Label:** Company Name
- **Toggle Mock Data:** "Valta Property Valuations Ltd."

### company-phone
- **Label:** Company Phone
- **Toggle Mock Data:** "587-801-5151"

### company-website
- **Label:** Company Website
- **Toggle Mock Data:** "www.valta.ca"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-date
- **Label:** Date of Report
- **Toggle Mock Data:** "November 20, 2025"

### report-effectivedate
- **Label:** Effective Date
- **Toggle Mock Data:** "October 17, 2025"

### subject-name
- **Label:** Property Name
- **Toggle Mock Data:** "North Battleford Apartments"

### subject-photo
- **Label:** Primary Photo
- **Toggle Mock Data:** "[Property Photo]"

### subject-primary
- **Label:** Primary Type
- **Toggle Mock Data:** "multi-family, walkup"

### subject-state
- **Label:** State
- **Toggle Mock Data:** "Saskatchewan"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-subtype
- **Label:** Property Subtype
- **Toggle Mock Data:** "Walkup"

---

## Page -3

**Fields:** 22

### city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### client-address
- **Label:** Client Address
- **Toggle Mock Data:** "1901, 1088 - 6th Ave SW,"

### client-city-state-zip
- **Label:** Client City/State/Zip
- **Toggle Mock Data:** "Calgary, AB T2P 5N3"

### client-full-name
- **Label:** Client Full Name
- **Toggle Mock Data:** "Kenneth Engler"

### client-organization
- **Label:** Organization
- **Toggle Mock Data:** "102109845 Saskatchewan Ltd."

### company-address
- **Label:** Company Address
- **Toggle Mock Data:** "#300, 4658 Richard Road SW"

### company-city-state-zip
- **Label:** Company City/State/Zip
- **Toggle Mock Data:** "Calgary, AB T3E 6L1"

### company-name
- **Label:** Company Name
- **Toggle Mock Data:** "Valta Property Valuations Ltd."

### company-phone
- **Label:** Company Phone
- **Toggle Mock Data:** "587-801-5151"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-date
- **Label:** Date of Report
- **Toggle Mock Data:** "November 20, 2025"

### report-date1
- **Label:** Report Date
- **Toggle Mock Data:** "October 17, 2025"

### report-extraordinary
- **Label:** Extraordinary Assumptions
- **Toggle Mock Data:** "No Extraordinary Assumptions were made for this assignment."

### report-hypothetical
- **Label:** Hypothetical Conditions
- **Toggle Mock Data:** "The use of a hypothetical condition(s) may have impacted the results of the assignment. The As Stabilized value has been developed based on the hypothetical condition that the subject property is full..."

### report-interest
- **Label:** Interest Appraised
- **Toggle Mock Data:** "Fee Simple Estate"

### report-values
- **Label:** Final Value Conclusion
- **Toggle Mock Data:** "$1,800,000"

### report-valuescenario1
- **Label:** Value Scenario 1
- **Toggle Mock Data:** "As Stabilized"

### subject-econcharacteristics
- **Label:** Economic Characteristics
- **Toggle Mock Data:** "The improvements are comprised of 2 total buildings, and consist of 10,204 square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in 1970; (1970 weighted) is a..."

### subject-exposuretime
- **Label:** Exposure Time
- **Toggle Mock Data:** "Six Months"

### subject-introcomment
- **Label:** Introduction Comment
- **Toggle Mock Data:** "The subject property, located at 1101, 1121 109 St, North Battleford, SK, is a multi-family, walkup property with improvements located in North Battleford"

### subject-state
- **Label:** State
- **Toggle Mock Data:** "Saskatchewan"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page -2

**Fields:** 11

### appraiser1-email
- **Label:** Appraiser 1 Email
- **Toggle Mock Data:** "chris.chornohos@valta.ca"

### appraiser1-name
- **Label:** Appraiser 1 Name
- **Toggle Mock Data:** "Chris Chornohos, AACI, MRICS"

### appraiser1-title
- **Label:** Appraiser 1 Title
- **Toggle Mock Data:** "Founder"

### company-address
- **Label:** Company Address
- **Toggle Mock Data:** "#300, 4658 Richard Road SW"

### company-city-state-zip
- **Label:** Company City/State/Zip
- **Toggle Mock Data:** "Calgary, AB T3E 6L1"

### company-email
- **Label:** Company Email
- **Toggle Mock Data:** "clientcare@valta.ca"

### company-name
- **Label:** Company Name
- **Toggle Mock Data:** "Valta Property Valuations Ltd."

### company-phone
- **Label:** Company Phone
- **Toggle Mock Data:** "587-801-5151"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-limcond
- **Label:** Limiting Conditions
- **Toggle Mock Data:** "No Extraordinary Limiting Conditions were made for this assignment."

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page -1

**Fields:** 0

---

## Page 1

**Fields:** 43

### city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-legal
- **Label:** Legal Description
- **Toggle Mock Data:** "Plan - C4240; Block - 95; Lot - 17,18, 19, 20"

### subject-actualage
- **Label:** Actual Age
- **Toggle Mock Data:** "55 Years"

### subject-appeal-rating
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### subject-condition
- **Label:** Condition
- **Toggle Mock Data:** "Average"

### subject-density
- **Label:** Density
- **Toggle Mock Data:** "29"

### subject-economiclife
- **Label:** Economic Life
- **Toggle Mock Data:** "75 Years"

### subject-effectiveage
- **Label:** Effective Age
- **Toggle Mock Data:** "35 Years"

### subject-gba
- **Label:** Gross Building Area (SF)
- **Toggle Mock Data:** "10,204"

### subject-geocode
- **Label:** Geocode
- **Toggle Mock Data:** "52.7738945, -108.2861417"

### subject-laundry
- **Label:** Laundry
- **Toggle Mock Data:** "On Site"

### subject-market
- **Label:** Market
- **Toggle Mock Data:** "North Battleford"

### subject-name
- **Label:** Property Name
- **Toggle Mock Data:** "North Battleford Apartments"

### subject-nra
- **Label:** Net Rentable Area
- **Toggle Mock Data:** "10,204"

### subject-parking
- **Label:** Parking Ratio
- **Toggle Mock Data:** "1.1 / Unit"

### subject-primary
- **Label:** Primary Type
- **Toggle Mock Data:** "multi-family, walkup"

### subject-proj-amenities
- **Label:** Project Amenities
- **Toggle Mock Data:** "Guest Parking"

### subject-quality-rating
- **Label:** Quality Rating
- **Toggle Mock Data:** "average"

### subject-remaininglife
- **Label:** Remaining Life
- **Toggle Mock Data:** "40 Years"

### subject-security-features
- **Label:** Security Features
- **Toggle Mock Data:** "Deadbolts, Exterior Lighting, Secured Entry"

### subject-shape
- **Label:** Site Shape
- **Toggle Mock Data:** "Rectangular"

### subject-siteaccess
- **Label:** Site Access
- **Toggle Mock Data:** "Average"

### subject-siteexposure
- **Label:** Site Exposure
- **Toggle Mock Data:** "Average"

### subject-sitequality
- **Label:** Site Quality
- **Toggle Mock Data:** "Average"

### subject-siteutility
- **Label:** Site Utility
- **Toggle Mock Data:** "Average"

### subject-state
- **Label:** State
- **Toggle Mock Data:** "Saskatchewan"

### subject-stories
- **Label:** Number of Stories
- **Toggle Mock Data:** "2"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-submarket
- **Label:** Submarket
- **Toggle Mock Data:** "North Battleford"

### subject-subtype
- **Label:** Property Subtype
- **Toggle Mock Data:** "Walkup"

### subject-tenancy
- **Label:** Tenancy
- **Toggle Mock Data:** "Multi-Tenant Occupied By Third Party Tenants - 16 Units"

### subject-topography
- **Label:** Topography
- **Toggle Mock Data:** "Level"

### subject-totalacre
- **Label:** Total Acres
- **Toggle Mock Data:** "0.56"

### subject-totalbuildings
- **Label:** Total Buildings
- **Toggle Mock Data:** "2"

### subject-totalsf
- **Label:** Total SF
- **Toggle Mock Data:** "24,400"

### subject-units
- **Label:** Number of Units
- **Toggle Mock Data:** "16"

### subject-usableacre
- **Label:** Usable Acre
- **Toggle Mock Data:** "0.56"

### subject-usablesf
- **Label:** Usable SF
- **Toggle Mock Data:** "24,400"

### subject-year-built
- **Label:** Year Built
- **Toggle Mock Data:** "1970; (1970 weighted)"

### subject-zip
- **Label:** Zip Code
- **Toggle Mock Data:** "S9A 2E5"

### subject-zoning
- **Label:** Zoning
- **Toggle Mock Data:** "Low Density Residential District (R2)"

### subject-zoningcode
- **Label:** Zoning Code
- **Toggle Mock Data:** "R2"

---

## Page 2

**Fields:** 25

### ia-dircap-cap-rate1
- **Label:** Direct Cap Cap Rate
- **Toggle Mock Data:** "6.25%"

### ia-dircap-expenseratio
- **Label:** Direct Cap Expense Ratio
- **Toggle Mock Data:** "43.09%"

### ia-dircap-noi
- **Label:** Direct Cap NOI
- **Toggle Mock Data:** "$111,771"

### ia-dircap-noi-per-unit
- **Label:** Direct Cap NOI Per Unit
- **Toggle Mock Data:** "$6,986/Unit"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### occupancy-rate
- **Label:** Occupancy Rate (%)
- **Toggle Mock Data:** "100.00%"

### report-effectivedate
- **Label:** Effective Date
- **Toggle Mock Data:** "October 17, 2025"

### report-interest
- **Label:** Interest Appraised
- **Toggle Mock Data:** "Fee Simple Estate"

### report-valuationcost
- **Label:** Valuation - Cost Approach
- **Toggle Mock Data:** "Not Presented"

### report-valuationincome
- **Label:** Valuation - Income Approach
- **Toggle Mock Data:** "$1,800,000"

### report-valuationsales
- **Label:** Valuation - Sales Approach
- **Toggle Mock Data:** "$1,800,000"

### report-values
- **Label:** Final Value Conclusion
- **Toggle Mock Data:** "$1,800,000"

### subject-concludedrent
- **Label:** Concluded Rent
- **Toggle Mock Data:** "$1,020"

### subject-currentrent
- **Label:** Current Rent
- **Toggle Mock Data:** "$1,015"

### subject-exposuretime
- **Label:** Exposure Time
- **Toggle Mock Data:** "Six Months"

### subject-hbuimproved
- **Label:** HBU As Improved
- **Toggle Mock Data:** "Multifamily"

### subject-hbuvacant
- **Label:** HBU As Vacant
- **Toggle Mock Data:** "Multifamily"

### subject-marketing
- **Label:** Marketing Time
- **Toggle Mock Data:** "Six Months"

### subject-occupancystabilized
- **Label:** Stabilized Occupancy
- **Toggle Mock Data:** "96.16%"

### subject-occupied-units
- **Label:** Occupied Units
- **Toggle Mock Data:** "16"

### subject-proposedconstruction
- **Label:** Proposed Construction
- **Toggle Mock Data:** "No"

### subject-sfmultifamily
- **Label:** SF Multifamily
- **Toggle Mock Data:** "10,204"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-vacancycreditloss
- **Label:** Vacancy & Credit Loss
- **Toggle Mock Data:** "3.84%"

### subject-vacant-units
- **Label:** Vacant Units
- **Toggle Mock Data:** "0"

---

## Page 3

**Fields:** 5

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-extraordinary
- **Label:** Extraordinary Assumptions
- **Toggle Mock Data:** "No Extraordinary Assumptions were made for this assignment."

### report-hypothetical
- **Label:** Hypothetical Conditions
- **Toggle Mock Data:** "The use of a hypothetical condition(s) may have impacted the results of the assignment. The As Stabilized value has been developed based on the hypothetical condition that the subject property is full..."

### report-limcond
- **Label:** Limiting Conditions
- **Toggle Mock Data:** "No Extraordinary Limiting Conditions were made for this assignment."

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 4

**Fields:** 14

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-photo-1
- **Label:** Subject Photo 1
- **Toggle Mock Data:** "Subject_Photo_1"

### subject-photo-1-caption
- **Label:** Caption
- **Toggle Mock Data:** "1101 - East Elevation"

### subject-photo-2
- **Label:** Subject Photo 2
- **Toggle Mock Data:** "Subject_Photo_2"

### subject-photo-2-caption
- **Label:** Caption
- **Toggle Mock Data:** "1101 - West Elevation"

### subject-photo-3
- **Label:** Subject Photo 3
- **Toggle Mock Data:** "Subject_Photo_3"

### subject-photo-3-caption
- **Label:** Caption
- **Toggle Mock Data:** "Street View Facing East"

### subject-photo-4
- **Label:** Subject Photo 4
- **Toggle Mock Data:** "Subject_Photo_4"

### subject-photo-4-caption
- **Label:** Caption
- **Toggle Mock Data:** "Street View Facing North"

### subject-photo-5
- **Label:** Subject Photo 5
- **Toggle Mock Data:** "Subject_Photo_5"

### subject-photo-5-caption
- **Label:** Caption
- **Toggle Mock Data:** "Street View Facing South"

### subject-photo-6
- **Label:** Subject Photo 6
- **Toggle Mock Data:** "Subject_Photo_6"

### subject-photo-6-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Stairway"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 5

**Fields:** 14

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-photo-10
- **Label:** Subject Photo 10
- **Toggle Mock Data:** "Subject_Photo_10"

### subject-photo-10-caption
- **Label:** Caption
- **Toggle Mock Data:** "Electrical Room"

### subject-photo-11
- **Label:** Subject Photo 11
- **Toggle Mock Data:** "Subject_Photo_11"

### subject-photo-11-caption
- **Label:** Caption
- **Toggle Mock Data:** "Mechanical Room"

### subject-photo-12
- **Label:** Subject Photo 12
- **Toggle Mock Data:** "Subject_Photo_12"

### subject-photo-12-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Kitchen"

### subject-photo-7
- **Label:** Subject Photo 7
- **Toggle Mock Data:** "Subject_Photo_7"

### subject-photo-7-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Bathroom"

### subject-photo-8
- **Label:** Subject Photo 8
- **Toggle Mock Data:** "Subject_Photo_8"

### subject-photo-8-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Bedroom 1"

### subject-photo-9
- **Label:** Subject Photo 9
- **Toggle Mock Data:** "Subject_Photo_9"

### subject-photo-9-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Bedroom 2"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 6

**Fields:** 14

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-photo-13
- **Label:** Subject Photo 13
- **Toggle Mock Data:** "Subject_Photo_13"

### subject-photo-13-caption
- **Label:** Caption
- **Toggle Mock Data:** "Living Room"

### subject-photo-14
- **Label:** Subject Photo 14
- **Toggle Mock Data:** "Subject_Photo_14"

### subject-photo-14-caption
- **Label:** Caption
- **Toggle Mock Data:** "West Elevation"

### subject-photo-15
- **Label:** Subject Photo 15
- **Toggle Mock Data:** "Subject_Photo_15"

### subject-photo-15-caption
- **Label:** Caption
- **Toggle Mock Data:** "East Elevation"

### subject-photo-16
- **Label:** Subject Photo 16
- **Toggle Mock Data:** "Subject_Photo_16"

### subject-photo-16-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Hallway"

### subject-photo-17
- **Label:** Subject Photo 17
- **Toggle Mock Data:** "Subject_Photo_17"

### subject-photo-17-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Stairway"

### subject-photo-18
- **Label:** Subject Photo 18
- **Toggle Mock Data:** "Subject_Photo_18"

### subject-photo-18-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Living Room"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 7

**Fields:** 14

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-photo-19
- **Label:** Subject Photo 19
- **Toggle Mock Data:** "Subject_Photo_19"

### subject-photo-19-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Bathroom"

### subject-photo-20
- **Label:** Subject Photo 20
- **Toggle Mock Data:** "Subject_Photo_20"

### subject-photo-20-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Kitchen"

### subject-photo-21
- **Label:** Subject Photo 21
- **Toggle Mock Data:** "Subject_Photo_21"

### subject-photo-21-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Bedroom"

### subject-photo-22
- **Label:** Subject Photo 22
- **Toggle Mock Data:** "Subject_Photo_22"

### subject-photo-22-caption
- **Label:** Caption
- **Toggle Mock Data:** "Laundry Room"

### subject-photo-23
- **Label:** Subject Photo 23
- **Toggle Mock Data:** "Subject_Photo_23"

### subject-photo-23-caption
- **Label:** Caption
- **Toggle Mock Data:** "Electrical Room"

### subject-photo-24
- **Label:** Subject Photo 24
- **Toggle Mock Data:** "Subject_Photo_24"

### subject-photo-24-caption
- **Label:** Caption
- **Toggle Mock Data:** "Typical Boiler"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 8

**Fields:** 4

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-photo-25
- **Label:** Subject Photo 25
- **Toggle Mock Data:** "Subject_Photo_25"

### subject-photo-25-caption
- **Label:** Caption
- **Toggle Mock Data:** "Utility Room"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 9

**Fields:** 3

### img-map-regional
- **Label:** Regional Map - Province/region context
- **Toggle Mock Data:** "[Regional Context Map]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 10

**Fields:** 3

### img-map-local
- **Label:** Local Area Map - City/neighborhood
- **Toggle Mock Data:** "[Local Area Map]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 11

**Fields:** 3

### img-map-aerial
- **Label:** Aerial Overview Map
- **Toggle Mock Data:** "[Aerial Overview Map]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 12

**Fields:** 17

### city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### client-organization
- **Label:** Organization
- **Toggle Mock Data:** "102109845 Saskatchewan Ltd."

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-date
- **Label:** Date of Report
- **Toggle Mock Data:** "November 20, 2025"

### report-date1
- **Label:** Report Date
- **Toggle Mock Data:** "October 17, 2025"

### report-dateinspection
- **Label:** Date of Inspection
- **Toggle Mock Data:** "October 17, 2025"

### report-hypothetical
- **Label:** Hypothetical Conditions
- **Toggle Mock Data:** "The use of a hypothetical condition(s) may have impacted the results of the assignment. The As Stabilized value has been developed based on the hypothetical condition that the subject property is full..."

### report-intendeduse
- **Label:** Intended Use
- **Toggle Mock Data:** "The authorized use of this report is for first mortgage financing purposes."

### report-intendeduser
- **Label:** Intended User
- **Toggle Mock Data:** "102109845 Saskatchewan Ltd. is the only authorized user of this report."

### report-legal
- **Label:** Legal Description
- **Toggle Mock Data:** "Plan - C4240; Block - 95; Lot - 17,18, 19, 20"

### report-valuescenario1
- **Label:** Value Scenario 1
- **Toggle Mock Data:** "As Stabilized"

### subject-econcharacteristics
- **Label:** Economic Characteristics
- **Toggle Mock Data:** "The improvements are comprised of 2 total buildings, and consist of 10,204 square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in 1970; (1970 weighted) is a..."

### subject-gba
- **Label:** Gross Building Area (SF)
- **Toggle Mock Data:** "10,204"

### subject-primary
- **Label:** Primary Type
- **Toggle Mock Data:** "multi-family, walkup"

### subject-state
- **Label:** State
- **Toggle Mock Data:** "Saskatchewan"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-subtype
- **Label:** Property Subtype
- **Toggle Mock Data:** "Walkup"

---

## Page 13

**Fields:** 8

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-extraordinary
- **Label:** Extraordinary Assumptions
- **Toggle Mock Data:** "No Extraordinary Assumptions were made for this assignment."

### report-limcond
- **Label:** Limiting Conditions
- **Toggle Mock Data:** "No Extraordinary Limiting Conditions were made for this assignment."

### subject-exposuretime
- **Label:** Exposure Time
- **Toggle Mock Data:** "Six Months"

### subject-marketing
- **Label:** Marketing Time
- **Toggle Mock Data:** "Six Months"

### subject-owner
- **Label:** Owner
- **Toggle Mock Data:** "The subject property is currently under the ownership of 102109845 Saskatchewan Ltd."

### subject-salehistory
- **Label:** Sale History
- **Toggle Mock Data:** "Ownership of the subject property has not changed in the past three years. We are unaware of any pending sales or listing activity relating to the subject property."

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 14

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 15

**Fields:** 13

### info-assessment-source
- **Label:** Assessment Info Source
- **Toggle Mock Data:** "SAMA"

### info-buildingsize-source
- **Label:** Building Size Info Source
- **Toggle Mock Data:** "Client"

### info-comps-source
- **Label:** Comparables Info Source
- **Toggle Mock Data:** "CoStar | Confirmed by Local Agents"

### info-environmental-source
- **Label:** Environmental Info Source
- **Toggle Mock Data:** "Not Provided"

### info-incomeexpense-source
- **Label:** Income/Expense Info Source
- **Toggle Mock Data:** "Client"

### info-lease-source
- **Label:** Lease Info Source
- **Toggle Mock Data:** "Not Provided"

### info-legal-source
- **Label:** Legal Info Source
- **Toggle Mock Data:** "Client"

### info-rentroll-source
- **Label:** Rent Roll Info Source
- **Toggle Mock Data:** "Client"

### info-sitesize-source
- **Label:** Site Size Info Source
- **Toggle Mock Data:** "ICS"

### info-title-source
- **Label:** Title Info Source
- **Toggle Mock Data:** "Not Provided"

### info-zoning-source
- **Label:** Zoning Info Source
- **Toggle Mock Data:** "City of North Battleford Zoning"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 16

**Fields:** 14

### appraiser1-allunits
- **Label:** Appraiser 1 Inspected All Units
- **Toggle Mock Data:** "No"

### appraiser1-extent
- **Label:** Appraiser 1 Inspection Extent
- **Toggle Mock Data:** "N/A"

### appraiser1-inspected
- **Label:** Appraiser 1 Inspected Property
- **Toggle Mock Data:** "No"

### appraiser1-inspectiondate
- **Label:** Appraiser 1 Inspection Date
- **Toggle Mock Data:** "October 17, 2025"

### appraiser1-name
- **Label:** Appraiser 1 Name
- **Toggle Mock Data:** "Chris Chornohos, AACI, MRICS"

### appraiser1-role
- **Label:** Appraiser 1 Role
- **Toggle Mock Data:** "Primary Appraiser"

### appraiser2-allunits
- **Label:** Appraiser 2 Inspected All Units
- **Toggle Mock Data:** "No"

### appraiser2-extent
- **Label:** Appraiser 2 Inspection Extent
- **Toggle Mock Data:** "Interior & Exterior"

### appraiser2-inspected
- **Label:** Appraiser 2 Inspected Property
- **Toggle Mock Data:** "Yes"

### appraiser2-inspectiondate
- **Label:** Appraiser 2 Inspection Date
- **Toggle Mock Data:** "October 17, 2025"

### appraiser2-name
- **Label:** Appraiser 2 Name
- **Toggle Mock Data:** "Paul Liboiron"

### appraiser2-role
- **Label:** Appraiser 2 Role
- **Toggle Mock Data:** "Inspector"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 17

**Fields:** 12

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### location-access
- **Label:** Access
- **Toggle Mock Data:** "The property fronts 109 Street with convenient connections to major arterials including 100th Street/Highway 4 (north-south route to downtown and Highway 16) and Territorial Drive (east-west loop conn..."

### location-description
- **Label:** Location Description
- **Toggle Mock Data:** "The subject property is located in North Battleford, Saskatchewan, in a centrally situated residential area near key commercial corridors and the downtown core."

### location-localarea
- **Label:** Local Area Overview
- **Toggle Mock Data:** "The neighborhood is a mature urban district with a mix of single-family homes, small multi-unit buildings, and local businesses. Residents are close to grocery, cafes, and parks, with recreation and s..."

### location-nearbyschool-1
- **Label:** Nearby School 1
- **Toggle Mock Data:** "Bready School (K-7, public)"

### location-nearbyschool-2
- **Label:** Nearby School 2
- **Toggle Mock Data:** "Connaught School (K-7, public)"

### location-nearbyschool-3
- **Label:** Nearby School 3
- **Toggle Mock Data:** "North Battleford Comprehensive High School (Grades 10-12, public)"

### location-nearbyschool-4
- **Label:** Nearby School 4
- **Toggle Mock Data:** "John Paul II Collegiate (Grades 9-12, Catholic)"

### location-nearbyschool-5
- **Label:** Nearby School 5
- **Toggle Mock Data:** "St. Mary School (K-7, Catholic)"

### location-publictransit
- **Label:** Public Transit
- **Toggle Mock Data:** "Local bus service operates on nearby corridors such as 100th Street and Territorial Drive, providing direct access to downtown, retail centres, and community facilities."

### location-walkbikescores
- **Label:** Walk/Bike Scores
- **Toggle Mock Data:** "The immediate area offers moderate walkability and cycling potential, with an estimated Walk Score around 60, Transit Score near 35, and Bike Score around 55, reflecting car-optional access for daily ..."

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 18

**Fields:** 10

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### report-legal
- **Label:** Legal Description
- **Toggle Mock Data:** "Plan - C4240; Block - 95; Lot - 17,18, 19, 20"

### subject-shape
- **Label:** Site Shape
- **Toggle Mock Data:** "Rectangular"

### subject-sitequality
- **Label:** Site Quality
- **Toggle Mock Data:** "Average"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-topography
- **Label:** Topography
- **Toggle Mock Data:** "Level"

### subject-totalacre
- **Label:** Total Acres
- **Toggle Mock Data:** "0.56"

### subject-totalsf
- **Label:** Total SF
- **Toggle Mock Data:** "24,400"

### subject-usableacres
- **Label:** Usable Acres
- **Toggle Mock Data:** "0.56"

### subject-usablesf
- **Label:** Usable SF
- **Toggle Mock Data:** "24,400"

---

## Page 19

**Fields:** 33

### frontage1-distance
- **Label:** Frontage 1 Distance (ft)
- **Toggle Mock Data:** "200 feet"

### frontage1-street
- **Label:** Frontage 1 Street
- **Toggle Mock Data:** "109 Street"

### frontage2-distance
- **Label:** Frontage 2 Distance (ft)
- **Toggle Mock Data:** "125 feet"

### frontage2-street
- **Label:** Frontage 2 Street
- **Toggle Mock Data:** "11 Avenue"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### street1-centerlane
- **Label:** *(no label)*
- **Toggle Mock Data:** "x"

### street1-curbs
- **Label:** Street 1 Curbs
- **Toggle Mock Data:** "x"

### street1-direction
- **Label:** *(no label)*
- **Toggle Mock Data:** "Two-Way"

### street1-lanes
- **Label:** Street 1 Lanes
- **Toggle Mock Data:** "2"

### street1-lights
- **Label:** *(no label)*
- **Toggle Mock Data:** "x"

### street1-name
- **Label:** Street 1 Name
- **Toggle Mock Data:** "109 Street"

### street1-type
- **Label:** Street 1 Type
- **Toggle Mock Data:** "Minor arterial"

### street2-bikelane
- **Label:** *(no label)*
- **Toggle Mock Data:** "x"

### street2-centerlane
- **Label:** *(no label)*
- **Toggle Mock Data:** "x"

### street2-curbs
- **Label:** Street 2 Curbs
- **Toggle Mock Data:** "x"

### street2-direction
- **Label:** *(no label)*
- **Toggle Mock Data:** "Two-Way"

### street2-lanes
- **Label:** Street 2 Lanes
- **Toggle Mock Data:** "4"

### street2-lights
- **Label:** *(no label)*
- **Toggle Mock Data:** "x"

### street2-name
- **Label:** Street 2 Name
- **Toggle Mock Data:** "11 Avenue"

### street2-sidewalks
- **Label:** Street 2 Sidewalks
- **Toggle Mock Data:** "x"

### street2-type
- **Label:** Street 2 Type
- **Toggle Mock Data:** "Minor arterial"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### traffic-total
- **Label:** Total Traffic Count
- **Toggle Mock Data:** "0"

### traffic1-count
- **Label:** Traffic Count 1
- **Toggle Mock Data:** "0"

### traffic1-date
- **Label:** Traffic Count 1 Date
- **Toggle Mock Data:** "Jan-00"

### traffic1-location
- **Label:** *(no label)*
- **Toggle Mock Data:** "0"

### traffic1-source
- **Label:** Traffic Count 1 Source
- **Toggle Mock Data:** "0"

### traffic1-street
- **Label:** Traffic Count 1 Street
- **Toggle Mock Data:** "109 Street"

### traffic2-count
- **Label:** Traffic Count 2
- **Toggle Mock Data:** "0"

### traffic2-date
- **Label:** Traffic Count 2 Date
- **Toggle Mock Data:** "Jan-00"

### traffic2-location
- **Label:** *(no label)*
- **Toggle Mock Data:** "0"

### traffic2-source
- **Label:** Traffic Count 2 Source
- **Toggle Mock Data:** "0"

### traffic2-street
- **Label:** Traffic Count 2 Street
- **Toggle Mock Data:** "11 Avenue"

---

## Page 20

**Fields:** 9

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### street1-name
- **Label:** Street 1 Name
- **Toggle Mock Data:** "109 Street"

### street2-name
- **Label:** Street 2 Name
- **Toggle Mock Data:** "11 Avenue"

### subject-easements
- **Label:** Easements Text
- **Toggle Mock Data:** "A legal opinion regarding title information was not provided or commissioned in conjunction with this assignment. Under the scope of this appraisal, it is assumed that any legal notations and register..."

### subject-hazerdous
- **Label:** *(no label)*
- **Toggle Mock Data:** "Based on a review of the independent investigation to determine the presence or absence of toxins on the subject property, none are present. If questions arise, the reader is strongly cautioned to see..."

### subject-siteconclusion
- **Label:** Site Conclusion
- **Toggle Mock Data:** "In conclusion, the site"

### subject-siterating
- **Label:** Site Rating
- **Toggle Mock Data:** "Overall, the subject site is considered average as a multi-family site in terms of its location, exposure and access to employment, education and shopping centers, based on its location along a minor ..."

### subject-soils
- **Label:** Soils
- **Toggle Mock Data:** "We have not undertaken a detailed soil analysis and we are not qualified to comment on soil conditions. As such, the soils are assumed to be similar to other lands in the area and suitable to drainage..."

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 21

**Fields:** 4

### img-site-plan-1
- **Label:** Site Plan - Layout/footprint
- **Toggle Mock Data:** "[Site Plan - Lot 17]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### site-plan-1-title
- **Label:** Site Plan 1 Title
- **Toggle Mock Data:** "Site Plans – Lot 17"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 22

**Fields:** 4

### img-site-plan-2
- **Label:** Survey/Plot Plan
- **Toggle Mock Data:** "[Site Plan - Lot 18]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### site-plan-2-title
- **Label:** Site Plan 2 Title
- **Toggle Mock Data:** "Site Plans – Lot 18"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 23

**Fields:** 9

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-tax-per-sf
- **Label:** Tax per SF
- **Toggle Mock Data:** "$1.83"

### subject-taxamount
- **Label:** Tax Amount
- **Toggle Mock Data:** "$18,688"

### subject-taxassessment
- **Label:** Tax Assessment
- **Toggle Mock Data:** "$1,063,900"

### subject-taxrate
- **Label:** Tax Rate
- **Toggle Mock Data:** "0.01757"

### subject-taxyear
- **Label:** Tax Year
- **Toggle Mock Data:** "2025"

### tax-commentary-1
- **Label:** Tax Commentary Paragraph 1
- **Toggle Mock Data:** "The assessed value is below the value concluded herein, a tax assessment appeal is not warranted."

### tax-commentary-2
- **Label:** Tax Commentary Paragraph 2
- **Toggle Mock Data:** "The assessed value is lower than our valuation herein. Smaller markets tend to under assess real property assets in comparison to larger markets."

---

## Page 24

**Fields:** 13

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-conforminglot
- **Label:** Conforming Lot
- **Toggle Mock Data:** "The bulk of the improvements as well as the parking conform to the requirements"

### subject-conforminguse
- **Label:** Conforming Use
- **Toggle Mock Data:** "The bulk of the improvements as well as the parking conform to the requirements ordinance."

### subject-legally-permitted
- **Label:** Legally Permitted
- **Toggle Mock Data:** "Yes"

### subject-permitteduses
- **Label:** Permitted Uses
- **Toggle Mock Data:** "low and medium density residential"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-subtype
- **Label:** Property Subtype
- **Toggle Mock Data:** "Walkup"

### subject-zoning
- **Label:** Zoning
- **Toggle Mock Data:** "Low Density Residential District (R2)"

### subject-zoningauthority
- **Label:** Zoning Authority
- **Toggle Mock Data:** "City of North Battleford"

### subject-zoningchange
- **Label:** Zoning Change
- **Toggle Mock Data:** "No"

### subject-zoningconclusion
- **Label:** Zoning Conclusion
- **Toggle Mock Data:** "The current use for the subject property is walkup and is a permitted use based on the current zoning guidelines. No zoning change is believed to be imminent. Based on the foregoing, it appears that t..."

### subject-zoningdescription
- **Label:** Zoning Description
- **Toggle Mock Data:** "Low Density Residential District (R2)"

### subject-zoningtype
- **Label:** Zoning Type
- **Toggle Mock Data:** "Low Density Residential District"

---

## Page 25

**Fields:** 4

### img-zoning-map
- **Label:** Zoning Map - Municipal zoning
- **Toggle Mock Data:** "[Zoning Map]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### zoning-map-title
- **Label:** Zoning Map Title
- **Toggle Mock Data:** "Zoning Map"

---

## Page 26

**Fields:** 22

### impv-actualage
- **Label:** Actual Age
- **Toggle Mock Data:** "55"

### impv-appeal
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### impv-condition
- **Label:** Condition Rating
- **Toggle Mock Data:** "Average"

### impv-density
- **Label:** Density (Units/Acre)
- **Toggle Mock Data:** "28.6"

### impv-economiclife
- **Label:** Economic Life
- **Toggle Mock Data:** "75"

### impv-effectiveage
- **Label:** Effective Age
- **Toggle Mock Data:** "35"

### impv-floors
- **Label:** *(no label)*
- **Toggle Mock Data:** "2"

### impv-landtobldg
- **Label:** Land to Building Ratio
- **Toggle Mock Data:** "2.39 : 1"

### impv-nra
- **Label:** Net Rentable Area (SF)
- **Toggle Mock Data:** "10,204"

### impv-parkingratio
- **Label:** Parking Ratio
- **Toggle Mock Data:** "1.1 / Unit"

### impv-parkingspaces
- **Label:** Parking Spaces
- **Toggle Mock Data:** "018 - Surface spaces"

### impv-propertytype
- **Label:** Property Type
- **Toggle Mock Data:** "Multi-Family - Walkup"

### impv-quality
- **Label:** Quality Rating
- **Toggle Mock Data:** "Average"

### impv-remaininglife
- **Label:** Remaining Life
- **Toggle Mock Data:** "40"

### impv-sitecoverage
- **Label:** *(no label)*
- **Toggle Mock Data:** "12.86% (Based On Total Overall Site Area)"

### impv-tenancy
- **Label:** Tenancy Type
- **Toggle Mock Data:** "Multi-Tenant Occupied By Third Party Tenants - 16 Units"

### impv-totalbuildings
- **Label:** *(no label)*
- **Toggle Mock Data:** "2"

### impv-yearbuilt
- **Label:** *(no label)*
- **Toggle Mock Data:** "1970; (1970 weighted)"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-econcharacteristics
- **Label:** Economic Characteristics
- **Toggle Mock Data:** "The improvements are comprised of 2 total buildings, and consist of 10,204 square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in 1970; (1970 weighted) is a..."

### subject-introcomment
- **Label:** Introduction Comment
- **Toggle Mock Data:** "The subject property, located at 1101, 1121 109 St, North Battleford, SK, is a multi-family, walkup property with improvements located in North Battleford"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 27

**Fields:** 24

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### unitmix-avg-size
- **Label:** Average Unit Size
- **Toggle Mock Data:** "638"

### unitmix-desc-1
- **Label:** Unit Mix Description 1
- **Toggle Mock Data:** "One Bed/One Bath"

### unitmix-desc-2
- **Label:** Unit Mix Description 2
- **Toggle Mock Data:** "Two Bed/One Bath"

### unitmix-gba-avgsize
- **Label:** *(no label)*
- **Toggle Mock Data:** "638"

### unitmix-gba-total
- **Label:** *(no label)*
- **Toggle Mock Data:** "10,204"

### unitmix-gba-units
- **Label:** *(no label)*
- **Toggle Mock Data:** "16"

### unitmix-nra-1
- **Label:** Unit Type 1 NRA
- **Toggle Mock Data:** "2,200"

### unitmix-nra-2
- **Label:** Unit Type 2 NRA
- **Toggle Mock Data:** "8,004"

### unitmix-nra-avgsize
- **Label:** *(no label)*
- **Toggle Mock Data:** "638"

### unitmix-nra-total
- **Label:** *(no label)*
- **Toggle Mock Data:** "10,204"

### unitmix-nra-units
- **Label:** *(no label)*
- **Toggle Mock Data:** "16"

### unitmix-pct-1
- **Label:** Unit Type 1 Percentage
- **Toggle Mock Data:** "25%"

### unitmix-pct-2
- **Label:** Unit Type 2 Percentage
- **Toggle Mock Data:** "75%"

### unitmix-size-1
- **Label:** Unit Type 1 Size
- **Toggle Mock Data:** "550"

### unitmix-size-2
- **Label:** Unit Type 2 Size
- **Toggle Mock Data:** "667"

### unitmix-total-nra
- **Label:** Total NRA
- **Toggle Mock Data:** "10,204"

### unitmix-total-pct
- **Label:** *(no label)*
- **Toggle Mock Data:** "100%"

### unitmix-total-units
- **Label:** Total Units
- **Toggle Mock Data:** "16"

### unitmix-type-1
- **Label:** Unit Type 1 Name
- **Toggle Mock Data:** "Flat 1 Bed / 1 Bath"

### unitmix-type-2
- **Label:** Unit Type 2 Name
- **Toggle Mock Data:** "Flat 2 Bed / 1 Bath"

### unitmix-units-1
- **Label:** Unit Type 1 Count
- **Toggle Mock Data:** "4"

### unitmix-units-2
- **Label:** Unit Type 2 Count
- **Toggle Mock Data:** "12"

---

## Page 28

**Fields:** 27

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-ceilings
- **Label:** Ceilings
- **Toggle Mock Data:** "Textured drywall;"

### subject-doorswindows
- **Label:** Doors & Windows
- **Toggle Mock Data:** "Wood interior & metal exterior doors/Vinyl or metal frame double pane glazing;"

### subject-electrical
- **Label:** Electrical
- **Toggle Mock Data:** "Individually metered;"

### subject-elevator
- **Label:** Elevator
- **Toggle Mock Data:** "None;"

### subject-exteriorwalls
- **Label:** Exterior Walls
- **Toggle Mock Data:** "1121 - Brick, 1101 Stucco/Wood frame;"

### subject-fireprotection
- **Label:** Fire Protection
- **Toggle Mock Data:** "None;"

### subject-floorcovering
- **Label:** Floor Covering
- **Toggle Mock Data:** "Combination of carpet, tile, vinyl tile and laminate hard wood;"

### subject-foundation
- **Label:** Foundation
- **Toggle Mock Data:** "Concrete footings and walls;"

### subject-functionaldesign
- **Label:** Functional Design
- **Toggle Mock Data:** "The building features a functional "

### subject-hazardousmaterials
- **Label:** Hazardous Materials
- **Toggle Mock Data:** "A Phase I report was not provided. This appraisal assumes that the improvements are constructed free of all hazardous waste and toxic substances."

### subject-hvac
- **Label:** HVAC
- **Toggle Mock Data:** "1101 - 8 Furnaces, 1121 - Boilers with baseboard radiant heat;"

### subject-insulation
- **Label:** Insulation
- **Toggle Mock Data:** "Fiberglass;"

### subject-interiorfinish
- **Label:** *(no label)*
- **Toggle Mock Data:** "Standard rental finishes;"

### subject-interiorwalls
- **Label:** Interior Walls
- **Toggle Mock Data:** "Painted drywall;"

### subject-landscaping
- **Label:** Landscaping
- **Toggle Mock Data:** "Landscaping around the building perimeter to consist of shrubs and trees. The landscaping as proposed is well established and well maintained."

### subject-laundry
- **Label:** Laundry
- **Toggle Mock Data:** "On Site"

### subject-lighting
- **Label:** Lighting
- **Toggle Mock Data:** "Various;"

### subject-parkingdesc
- **Label:** Parking Description
- **Toggle Mock Data:** "The subject provides 18 parking spaces and is therefore conforming to zoning requirements. The parking ratio of 1.1 per unit is within the typical range of 0.75-1.25 spaces per unit within zoning requ..."

### subject-plumbing
- **Label:** Plumbing
- **Toggle Mock Data:** "Standard;"

### subject-projectamenities
- **Label:** *(no label)*
- **Toggle Mock Data:** "Guest Parking"

### subject-roof
- **Label:** *(no label)*
- **Toggle Mock Data:** "Flat built up membrane;"

### subject-security
- **Label:** Security
- **Toggle Mock Data:** "Deadbolts, Exterior Lighting, Secured Entry"

### subject-sitecoverageratio
- **Label:** *(no label)*
- **Toggle Mock Data:** "12.9% (3,138 SF footprint / 24,400 SF site), which is within market standards (20-35%) for similar walkup buildings in the area."

### subject-siteimprovements
- **Label:** Site Improvements
- **Toggle Mock Data:** "Gravel parking, sidewalks, and curbs;"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-unitamenities
- **Label:** *(no label)*
- **Toggle Mock Data:** "Deck/Patio, Range/Stove, Refrigerator"

---

## Page 29

**Fields:** 15

### ca-business-investment
- **Label:** Canada Business Investment
- **Toggle Mock Data:** "1–2% growth"

### ca-gdp
- **Label:** Canada GDP
- **Toggle Mock Data:** "CA$ 2.23 trillion"

### ca-gdp-growth
- **Label:** Canada GDP Growth
- **Toggle Mock Data:** "1.8%"

### ca-housing-starts
- **Label:** Canada Housing Starts
- **Toggle Mock Data:** "6% growth"

### ca-inflation
- **Label:** Canada Inflation Rate
- **Toggle Mock Data:** "2.0%"

### ca-natgas
- **Label:** Canada Natural Gas Price
- **Toggle Mock Data:** "CA$ 2–3/GJ"

### ca-pop-growth
- **Label:** Canada Population Growth
- **Toggle Mock Data:** "1.0–1.5%"

### ca-population
- **Label:** Canada Population
- **Toggle Mock Data:** "41.5 million"

### ca-retail
- **Label:** Canada Retail Sales
- **Toggle Mock Data:** "Soft to modest"

### ca-unemployment
- **Label:** Canada Unemployment Rate
- **Toggle Mock Data:** "6.9%"

### ca-wcs
- **Label:** Canada WCS Oil Price
- **Toggle Mock Data:** "US$ 55–65/bbl"

### ca-wells
- **Label:** Canada Oil Wells Drilled
- **Toggle Mock Data:** "6,000–7,000"

### ca-wti
- **Label:** Canada WTI Oil Price
- **Toggle Mock Data:** "US$ 70–80/bbl"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 30

**Fields:** 14

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### sk-avg-home-price
- **Label:** SK Average Home Price
- **Toggle Mock Data:** "$385,000"

### sk-avg-rent-2br
- **Label:** SK Average 2BR Rent
- **Toggle Mock Data:** "$1,250"

### sk-credit-rating
- **Label:** SK Credit Rating
- **Toggle Mock Data:** "AA"

### sk-econ-overview
- **Label:** SK Economic Overview
- **Toggle Mock Data:** "Saskatchewan"

### sk-gdp-growth
- **Label:** SK GDP Growth
- **Toggle Mock Data:** "+1.8%"

### sk-housing-starts
- **Label:** SK Housing Starts
- **Toggle Mock Data:** "3,200"

### sk-inflation
- **Label:** SK Inflation Rate
- **Toggle Mock Data:** "1.8%"

### sk-oil-price
- **Label:** SK Oil Price
- **Toggle Mock Data:** "$78/barrel"

### sk-pop-growth
- **Label:** SK Population Growth
- **Toggle Mock Data:** "1.5%"

### sk-potash
- **Label:** SK Potash Production
- **Toggle Mock Data:** "12M tonnes"

### sk-rental-vacancy
- **Label:** SK Rental Vacancy Rate
- **Toggle Mock Data:** "3.0%"

### sk-unemployment
- **Label:** SK Unemployment Rate
- **Toggle Mock Data:** "5.7%"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 31

**Fields:** 10

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### sk-avgrent-1bed
- **Label:** SK Avg Rent - 1 Bedroom
- **Toggle Mock Data:** "$1,160"

### sk-avgrent-2bed
- **Label:** SK Avg Rent - 2 Bedroom
- **Toggle Mock Data:** "$1,390"

### sk-avgrent-3bed
- **Label:** SK Avg Rent - 3 Bedroom
- **Toggle Mock Data:** "$1,650"

### sk-avgrent-bachelor
- **Label:** SK Avg Rent - Bachelor
- **Toggle Mock Data:** "$885"

### sk-new-supply
- **Label:** SK New Supply
- **Toggle Mock Data:** "+1,200 units YoY"

### sk-rental-rate-growth
- **Label:** SK Rental Rate Growth
- **Toggle Mock Data:** "+3.5% YoY"

### sk-supply-growth-rate
- **Label:** SK Supply Growth Rate
- **Toggle Mock Data:** "+3.0% YoY"

### sk-vacancy-rate
- **Label:** SK Vacancy Rate
- **Toggle Mock Data:** "3.0%"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 32

**Fields:** 5

### hbu-conclusion-vacant
- **Label:** HBU Conclusion Vacant
- **Toggle Mock Data:** "multifamily"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### site-size
- **Label:** Site Size
- **Toggle Mock Data:** "0.5601-acres (24,400 SF)"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### zoning-designation
- **Label:** Zoning Designation
- **Toggle Mock Data:** "Low Density Residential District (R2)"

---

## Page 33

**Fields:** 6

### hbu-asimproved-1
- **Label:** *(no label)*
- **Toggle Mock Data:** "The legal factors influencing the highest and best use of the subject property are primarily governmental regulations such as zoning and building codes. The subject"

### hbu-asimproved-2
- **Label:** HBU As Improved Paragraph 2
- **Toggle Mock Data:** "The five possible alternative treatments of the property are redevelopment/demolition (not warranted as the improvements contribute substantial value to the site), expansion (not applicable, no excess..."

### hbu-asimproved-3
- **Label:** HBU As Improved Paragraph 3
- **Toggle Mock Data:** "Among the five alternative uses, a continuation of the multifamily use is the Highest and Best Use of the subject is As Improved."

### hbu-mostprobablebuyer
- **Label:** Most Probable Buyer
- **Toggle Mock Data:** "Based on the type of property and the income generating potential of the improvements, it is our opinion that the most probable buyer for the subject would be a local or regional investor As Improved,"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 34

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 35

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 36

**Fields:** 39

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### rentroll-avg-actual-sf
- **Label:** Average Actual Rent/SF
- **Toggle Mock Data:** "$1.59"

### rentroll-avg-actual-unit
- **Label:** Average Actual Rent/Unit
- **Toggle Mock Data:** "$1,015"

### rentroll-avg-asking-sf
- **Label:** Average Asking Rent/SF
- **Toggle Mock Data:** "$0.00"

### rentroll-avg-asking-unit
- **Label:** Average Asking Rent/Unit
- **Toggle Mock Data:** "$0"

### rentroll-avg-occ-pct
- **Label:** Average Occupancy %
- **Toggle Mock Data:** "100.0%"

### rentroll-avg-recent-sf
- **Label:** Average Recent Rent/SF
- **Toggle Mock Data:** "$0.00"

### rentroll-avg-recent-unit
- **Label:** Average Recent Rent/Unit
- **Toggle Mock Data:** "$0"

### rentroll-avg-size
- **Label:** Average Size (SF)
- **Toggle Mock Data:** "638"

### rentroll-avg-vac-pct
- **Label:** Average Vacancy %
- **Toggle Mock Data:** "0.0%"

### rentroll-total-occ
- **Label:** Total Occupied
- **Toggle Mock Data:** "16"

### rentroll-total-pct
- **Label:** Total %
- **Toggle Mock Data:** "100%"

### rentroll-total-units
- **Label:** Total Units
- **Toggle Mock Data:** "16"

### rentroll-total-vac
- **Label:** Total Vacant
- **Toggle Mock Data:** "0"

### rentroll-type1-actual-sf
- **Label:** Type 1 Actual Rent/SF
- **Toggle Mock Data:** "$1.63"

### rentroll-type1-actual-unit
- **Label:** Type 1 Actual Rent/Unit
- **Toggle Mock Data:** "$895"

### rentroll-type1-desc
- **Label:** Type 1 Description
- **Toggle Mock Data:** "One Bed/One Bath"

### rentroll-type1-name
- **Label:** Type 1 Name
- **Toggle Mock Data:** "Flat 1 Bed / 1 Bath"

### rentroll-type1-occ
- **Label:** Type 1 Occupied
- **Toggle Mock Data:** "4"

### rentroll-type1-occ-pct
- **Label:** Type 1 Occupancy %
- **Toggle Mock Data:** "100.0%"

### rentroll-type1-pct
- **Label:** Type 1 %
- **Toggle Mock Data:** "25%"

### rentroll-type1-recent-sf
- **Label:** Type 1 Recent Rent/SF
- **Toggle Mock Data:** "$0.00"

### rentroll-type1-size
- **Label:** Type 1 Size (SF)
- **Toggle Mock Data:** "550"

### rentroll-type1-total
- **Label:** Type 1 Total
- **Toggle Mock Data:** "4"

### rentroll-type1-vac
- **Label:** Type 1 Vacant
- **Toggle Mock Data:** "0"

### rentroll-type1-vac-pct
- **Label:** Type 1 Vacancy %
- **Toggle Mock Data:** "0.0%"

### rentroll-type2-actual-sf
- **Label:** Type 2 Actual Rent/SF
- **Toggle Mock Data:** "$1.58"

### rentroll-type2-actual-unit
- **Label:** Type 2 Actual Rent/Unit
- **Toggle Mock Data:** "$1,055"

### rentroll-type2-desc
- **Label:** Type 2 Description
- **Toggle Mock Data:** "Two Bed/One Bath"

### rentroll-type2-name
- **Label:** Type 2 Name
- **Toggle Mock Data:** "Flat 2 Bed / 1 Bath"

### rentroll-type2-occ
- **Label:** Type 2 Occupied
- **Toggle Mock Data:** "12"

### rentroll-type2-occ-pct
- **Label:** Type 2 Occupancy %
- **Toggle Mock Data:** "100.0%"

### rentroll-type2-pct
- **Label:** Type 2 %
- **Toggle Mock Data:** "75%"

### rentroll-type2-recent-sf
- **Label:** Type 2 Recent Rent/SF
- **Toggle Mock Data:** "$0.00"

### rentroll-type2-size
- **Label:** Type 2 Size (SF)
- **Toggle Mock Data:** "667"

### rentroll-type2-total
- **Label:** Type 2 Total
- **Toggle Mock Data:** "12"

### rentroll-type2-vac
- **Label:** Type 2 Vacant
- **Toggle Mock Data:** "0"

### rentroll-type2-vac-pct
- **Label:** Type 2 Vacancy %
- **Toggle Mock Data:** "0.0%"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 37

**Fields:** 132

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### rentcomp1-address
- **Label:** Rentcomp1 Address
- **Toggle Mock Data:** "2424 Buhler Ave"

### rentcomp1-appeal
- **Label:** Rentcomp1 Appeal
- **Toggle Mock Data:** "Average"

### rentcomp1-avg-unit-sf
- **Label:** Rentcomp1 Avg Unit SF
- **Toggle Mock Data:** "725"

### rentcomp1-city
- **Label:** Rentcomp1 City
- **Toggle Mock Data:** "North Battleford"

### rentcomp1-condition
- **Label:** Rentcomp1 Condition
- **Toggle Mock Data:** "Average"

### rentcomp1-laundry
- **Label:** Rentcomp1 Laundry
- **Toggle Mock Data:** "Washer/Dryer"

### rentcomp1-location
- **Label:** Rentcomp1 Location
- **Toggle Mock Data:** "Average"

### rentcomp1-name
- **Label:** Rentcomp1 Name
- **Toggle Mock Data:** "2424 Buhler Ave Apts"

### rentcomp1-parking-incl
- **Label:** Rentcomp1 Parking Included
- **Toggle Mock Data:** "Carport"

### rentcomp1-parking-type
- **Label:** Rentcomp1 Parking Type
- **Toggle Mock Data:** "Surface"

### rentcomp1-proj-amenities
- **Label:** Rentcomp1 Project Amenities
- **Toggle Mock Data:** "Elevators, Guest Parking, Storage Units"

### rentcomp1-province
- **Label:** Rentcomp1 Province
- **Toggle Mock Data:** "SK"

### rentcomp1-quality
- **Label:** Rentcomp1 Quality
- **Toggle Mock Data:** "Average"

### rentcomp1-rent-sf-avg
- **Label:** Rentcomp1 Rent/SF Avg
- **Toggle Mock Data:** "$2.43"

### rentcomp1-rent-unit-avg
- **Label:** Rentcomp1 Rent/Unit Avg
- **Toggle Mock Data:** "$1,763"

### rentcomp1-renttype
- **Label:** Rentcomp1 Rent Type
- **Toggle Mock Data:** "Market"

### rentcomp1-security
- **Label:** Rentcomp1 Security
- **Toggle Mock Data:** "Cameras, Deadbolts, Exterior Lighting, Secured Entry"

### rentcomp1-surveycomments
- **Label:** Rentcomp1 Survey Comments
- **Toggle Mock Data:** "-$35/mth for extra parking space"

### rentcomp1-totaladj
- **Label:** Rentcomp1 Total Adj
- **Toggle Mock Data:** *(none)*

### rentcomp1-unit-amenities
- **Label:** Rentcomp1 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Deck/Patio, Premium Appliances, Premium Countertops, Premium Flooring"

### rentcomp1-units
- **Label:** Rentcomp1 Units
- **Toggle Mock Data:** "4"

### rentcomp1-utilities
- **Label:** Rentcomp1 Utilities
- **Toggle Mock Data:** "G, Heat, I, W"

### rentcomp2-address
- **Label:** Rentcomp2 Address
- **Toggle Mock Data:** "531 5 St E"

### rentcomp2-appeal
- **Label:** Rentcomp2 Appeal
- **Toggle Mock Data:** "Average"

### rentcomp2-avg-unit-sf
- **Label:** Rentcomp2 Avg Unit SF
- **Toggle Mock Data:** "700"

### rentcomp2-city
- **Label:** Rentcomp2 City
- **Toggle Mock Data:** "Prince Albert"

### rentcomp2-condition
- **Label:** Rentcomp2 Condition
- **Toggle Mock Data:** "Average"

### rentcomp2-laundry
- **Label:** Rentcomp2 Laundry
- **Toggle Mock Data:** "On Site"

### rentcomp2-location
- **Label:** Rentcomp2 Location
- **Toggle Mock Data:** "Average"

### rentcomp2-name
- **Label:** Rentcomp2 Name
- **Toggle Mock Data:** "The Mews – River"

### rentcomp2-parking-incl
- **Label:** Rentcomp2 Parking Included
- **Toggle Mock Data:** "Open"

### rentcomp2-parking-type
- **Label:** Rentcomp2 Parking Type
- **Toggle Mock Data:** "Surface"

### rentcomp2-proj-amenities
- **Label:** Rentcomp2 Project Amenities
- **Toggle Mock Data:** "Guest Parking, Storage Units"

### rentcomp2-province
- **Label:** Rentcomp2 Province
- **Toggle Mock Data:** "SK"

### rentcomp2-quality
- **Label:** Rentcomp2 Quality
- **Toggle Mock Data:** "Average"

### rentcomp2-rent-sf-avg
- **Label:** Rentcomp2 Rent/SF Avg
- **Toggle Mock Data:** "$1.77"

### rentcomp2-rent-unit-avg
- **Label:** Rentcomp2 Rent/Unit Avg
- **Toggle Mock Data:** "$1,239"

### rentcomp2-renttype
- **Label:** Rentcomp2 Rent Type
- **Toggle Mock Data:** "Market"

### rentcomp2-security
- **Label:** Rentcomp2 Security
- **Toggle Mock Data:** "Cameras, Exterior Lighting, Secured Entry"

### rentcomp2-surveycomments
- **Label:** Rentcomp2 Survey Comments
- **Toggle Mock Data:** "- Parking availability without the monthly parking fee."

### rentcomp2-totaladj
- **Label:** Rentcomp2 Total Adj
- **Toggle Mock Data:** *(none)*

### rentcomp2-unit-amenities
- **Label:** Rentcomp2 Unit Amenities
- **Toggle Mock Data:** "Deck/Patio, Premium Appliances, Premium Countertops, Premium Flooring"

### rentcomp2-units
- **Label:** Rentcomp2 Units
- **Toggle Mock Data:** "6"

### rentcomp2-utilities
- **Label:** Rentcomp2 Utilities
- **Toggle Mock Data:** "Heat, W"

### rentcomp3-address
- **Label:** Rentcomp3 Address
- **Toggle Mock Data:** "2300 2 Ave W"

### rentcomp3-appeal
- **Label:** Rentcomp3 Appeal
- **Toggle Mock Data:** "Average"

### rentcomp3-avg-unit-sf
- **Label:** Rentcomp3 Avg Unit SF
- **Toggle Mock Data:** "700"

### rentcomp3-city
- **Label:** Rentcomp3 City
- **Toggle Mock Data:** "Prince Albert"

### rentcomp3-condition
- **Label:** Rentcomp3 Condition
- **Toggle Mock Data:** "Average"

### rentcomp3-laundry
- **Label:** Rentcomp3 Laundry
- **Toggle Mock Data:** "On Site"

### rentcomp3-location
- **Label:** Rentcomp3 Location
- **Toggle Mock Data:** "Average"

### rentcomp3-name
- **Label:** Rentcomp3 Name
- **Toggle Mock Data:** "The Mews – MGM"

### rentcomp3-parking-incl
- **Label:** Rentcomp3 Parking Included
- **Toggle Mock Data:** "Open"

### rentcomp3-parking-type
- **Label:** Rentcomp3 Parking Type
- **Toggle Mock Data:** "Surface"

### rentcomp3-proj-amenities
- **Label:** Rentcomp3 Project Amenities
- **Toggle Mock Data:** "Guest Parking, Storage Units"

### rentcomp3-province
- **Label:** Rentcomp3 Province
- **Toggle Mock Data:** "SK"

### rentcomp3-quality
- **Label:** Rentcomp3 Quality
- **Toggle Mock Data:** "Average"

### rentcomp3-rent-sf-avg
- **Label:** Rentcomp3 Rent/SF Avg
- **Toggle Mock Data:** "$1.88"

### rentcomp3-rent-unit-avg
- **Label:** Rentcomp3 Rent/Unit Avg
- **Toggle Mock Data:** "$1,317"

### rentcomp3-renttype
- **Label:** Rentcomp3 Rent Type
- **Toggle Mock Data:** "Market"

### rentcomp3-security
- **Label:** Rentcomp3 Security
- **Toggle Mock Data:** "Cameras, Deadbolts, Exterior Lighting, Secured Entry"

### rentcomp3-surveycomments
- **Label:** Rentcomp3 Survey Comments
- **Toggle Mock Data:** "- Parking availability without the monthly parking fee."

### rentcomp3-totaladj
- **Label:** Rentcomp3 Total Adj
- **Toggle Mock Data:** *(none)*

### rentcomp3-unit-amenities
- **Label:** Rentcomp3 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Deck/Patio, Premium Appliances, Premium Countertops, Premium Flooring"

### rentcomp3-units
- **Label:** Rentcomp3 Units
- **Toggle Mock Data:** "6"

### rentcomp3-utilities
- **Label:** Rentcomp3 Utilities
- **Toggle Mock Data:** "Heat, W"

### rentcomp4-address
- **Label:** Rentcomp4 Address
- **Toggle Mock Data:** "3030 Dunn Dr"

### rentcomp4-appeal
- **Label:** Rentcomp4 Appeal
- **Toggle Mock Data:** "Average"

### rentcomp4-avg-unit-sf
- **Label:** Rentcomp4 Avg Unit SF
- **Toggle Mock Data:** "783"

### rentcomp4-city
- **Label:** Rentcomp4 City
- **Toggle Mock Data:** "Prince Albert"

### rentcomp4-condition
- **Label:** Rentcomp4 Condition
- **Toggle Mock Data:** "Average"

### rentcomp4-laundry
- **Label:** Rentcomp4 Laundry
- **Toggle Mock Data:** "On Site"

### rentcomp4-location
- **Label:** Rentcomp4 Location
- **Toggle Mock Data:** "Average"

### rentcomp4-name
- **Label:** Rentcomp4 Name
- **Toggle Mock Data:** "Forest Grove Village"

### rentcomp4-parking-incl
- **Label:** Rentcomp4 Parking Included
- **Toggle Mock Data:** "Open"

### rentcomp4-parking-type
- **Label:** Rentcomp4 Parking Type
- **Toggle Mock Data:** "Surface"

### rentcomp4-proj-amenities
- **Label:** Rentcomp4 Project Amenities
- **Toggle Mock Data:** "Guest Parking, Storage Units"

### rentcomp4-province
- **Label:** Rentcomp4 Province
- **Toggle Mock Data:** "SK"

### rentcomp4-quality
- **Label:** Rentcomp4 Quality
- **Toggle Mock Data:** "Average"

### rentcomp4-rent-sf-avg
- **Label:** Rentcomp4 Rent/SF Avg
- **Toggle Mock Data:** "$1.76"

### rentcomp4-rent-unit-avg
- **Label:** Rentcomp4 Rent/Unit Avg
- **Toggle Mock Data:** "$1,378"

### rentcomp4-renttype
- **Label:** Rentcomp4 Rent Type
- **Toggle Mock Data:** "Market"

### rentcomp4-security
- **Label:** Rentcomp4 Security
- **Toggle Mock Data:** "Cameras, Deadbolts, Exterior Lighting, Secured Entry"

### rentcomp4-surveycomments
- **Label:** Rentcomp4 Survey Comments
- **Toggle Mock Data:** "- Parking availability without the monthly parking fee."

### rentcomp4-totaladj
- **Label:** Rentcomp4 Total Adj
- **Toggle Mock Data:** *(none)*

### rentcomp4-unit-amenities
- **Label:** Rentcomp4 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Deck/Patio, Premium Appliances, Premium Countertops, Premium Flooring"

### rentcomp4-units
- **Label:** Rentcomp4 Units
- **Toggle Mock Data:** "9"

### rentcomp4-utilities
- **Label:** Rentcomp4 Utilities
- **Toggle Mock Data:** "Heat, W"

### rentcomp5-address
- **Label:** Rentcomp5 Address
- **Toggle Mock Data:** "399 32 St W"

### rentcomp5-appeal
- **Label:** Rentcomp5 Appeal
- **Toggle Mock Data:** "Average"

### rentcomp5-avg-unit-sf
- **Label:** Rentcomp5 Avg Unit SF
- **Toggle Mock Data:** "725"

### rentcomp5-city
- **Label:** Rentcomp5 City
- **Toggle Mock Data:** "Prince Albert"

### rentcomp5-condition
- **Label:** Rentcomp5 Condition
- **Toggle Mock Data:** "Average"

### rentcomp5-laundry
- **Label:** Rentcomp5 Laundry
- **Toggle Mock Data:** "On Site"

### rentcomp5-location
- **Label:** Rentcomp5 Location
- **Toggle Mock Data:** "Average"

### rentcomp5-name
- **Label:** Rentcomp5 Name
- **Toggle Mock Data:** "Hilltop Towers"

### rentcomp5-parking-incl
- **Label:** Rentcomp5 Parking Included
- **Toggle Mock Data:** "Open"

### rentcomp5-parking-type
- **Label:** Rentcomp5 Parking Type
- **Toggle Mock Data:** "Surface"

### rentcomp5-proj-amenities
- **Label:** Rentcomp5 Project Amenities
- **Toggle Mock Data:** "Elevators, Guest Parking, Storage Units"

### rentcomp5-province
- **Label:** Rentcomp5 Province
- **Toggle Mock Data:** "SK"

### rentcomp5-quality
- **Label:** Rentcomp5 Quality
- **Toggle Mock Data:** "Average"

### rentcomp5-rent-sf-avg
- **Label:** Rentcomp5 Rent/SF Avg
- **Toggle Mock Data:** "$1.98"

### rentcomp5-rent-unit-avg
- **Label:** Rentcomp5 Rent/Unit Avg
- **Toggle Mock Data:** "$1,435"

### rentcomp5-renttype
- **Label:** Rentcomp5 Rent Type
- **Toggle Mock Data:** "Market"

### rentcomp5-security
- **Label:** Rentcomp5 Security
- **Toggle Mock Data:** "Cameras, Deadbolts, Exterior Lighting, Secured Entry"

### rentcomp5-surveycomments
- **Label:** Rentcomp5 Survey Comments
- **Toggle Mock Data:** "- Parking availability without the monthly parking fee."

### rentcomp5-totaladj
- **Label:** Rentcomp5 Total Adj
- **Toggle Mock Data:** *(none)*

### rentcomp5-unit-amenities
- **Label:** Rentcomp5 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Deck/Patio, Premium Appliances, Premium Countertops, Premium Flooring"

### rentcomp5-units
- **Label:** Rentcomp5 Units
- **Toggle Mock Data:** "12"

### rentcomp5-utilities
- **Label:** Rentcomp5 Utilities
- **Toggle Mock Data:** "Heat, W"

### subject-appeal
- **Label:** Appeal
- **Toggle Mock Data:** "Average"

### subject-avg-unit-sf
- **Label:** Average Unit SF
- **Toggle Mock Data:** "638"

### subject-city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### subject-condition
- **Label:** Condition
- **Toggle Mock Data:** "Average"

### subject-laundry
- **Label:** Laundry
- **Toggle Mock Data:** "On Site"

### subject-location
- **Label:** Location
- **Toggle Mock Data:** "Average"

### subject-name
- **Label:** Property Name
- **Toggle Mock Data:** "North Battleford Apartments"

### subject-parking-incl
- **Label:** Parking Included
- **Toggle Mock Data:** "None Included"

### subject-parking-type
- **Label:** Parking Type
- **Toggle Mock Data:** "Surface"

### subject-proj-amenities
- **Label:** Project Amenities
- **Toggle Mock Data:** "Guest Parking"

### subject-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### subject-quality
- **Label:** Quality
- **Toggle Mock Data:** "Average"

### subject-rent-sf-avg
- **Label:** Average Rent/SF
- **Toggle Mock Data:** "$1.59"

### subject-rent-unit-avg
- **Label:** Average Rent/Unit
- **Toggle Mock Data:** "$1,016"

### subject-renttype
- **Label:** Rent Type
- **Toggle Mock Data:** "Market"

### subject-security
- **Label:** Security
- **Toggle Mock Data:** "Deadbolts, Exterior Lighting, Secured Entry"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-surveycomments
- **Label:** Survey Comments
- **Toggle Mock Data:** "-"

### subject-unit-amenities
- **Label:** Unit Amenities
- **Toggle Mock Data:** "Deck/Patio, Range/Stove, Refrigerator"

### subject-units
- **Label:** Number of Units
- **Toggle Mock Data:** "16"

### subject-utilities
- **Label:** Utilities
- **Toggle Mock Data:** "Heat, W"

---

## Page 38

**Fields:** 18

### img-rental-comparables-map
- **Label:** Rental Comparables Location Map
- **Toggle Mock Data:** "[Rental Comparables Location Map]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### rental-comp1-address-full
- **Label:** Rental Comp 1 - Full Address
- **Toggle Mock Data:** "1551-107 St, North Battleford, SK, S9A 2A1"

### rental-comp1-distance
- **Label:** Rental Comp 1 - Distance
- **Toggle Mock Data:** "0.3"

### rental-comp1-label
- **Label:** Rental Comp 1 - Label
- **Toggle Mock Data:** "1"

### rental-comp2-address-full
- **Label:** Rental Comp 2 - Full Address
- **Toggle Mock Data:** "1501/5-1091/5 Windsor Crescent, North Battleford, SK, S9A 2G3"

### rental-comp2-distance
- **Label:** Rental Comp 2 - Distance
- **Toggle Mock Data:** "2.8"

### rental-comp2-label
- **Label:** Rental Comp 2 - Label
- **Toggle Mock Data:** "2"

### rental-comp3-address-full
- **Label:** Rental Comp 3 - Full Address
- **Toggle Mock Data:** "1001 Pearson Ave, North Battleford, SK, S9A 3L5"

### rental-comp3-distance
- **Label:** Rental Comp 3 - Distance
- **Toggle Mock Data:** "1.3"

### rental-comp3-label
- **Label:** Rental Comp 3 - Label
- **Toggle Mock Data:** "3"

### rental-comp4-address-full
- **Label:** Rental Comp 4 - Full Address
- **Toggle Mock Data:** "1000 Star Hill Dr, Martensville, SK, S0K 2T1"

### rental-comp4-distance
- **Label:** Rental Comp 4 - Distance
- **Toggle Mock Data:** "123.3"

### rental-comp4-label
- **Label:** Rental Comp 4 - Label
- **Toggle Mock Data:** "4"

### rental-comp5-address-full
- **Label:** Rental Comp 5 - Full Address
- **Toggle Mock Data:** "1030 Parr Hill Dr, Martensville, SK, S0K 2T1"

### rental-comp5-distance
- **Label:** Rental Comp 5 - Distance
- **Toggle Mock Data:** "123.3"

### rental-comp5-label
- **Label:** Rental Comp 5 - Label
- **Toggle Mock Data:** "5"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 39

**Fields:** 85

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### market-rent-1bed-avg-rentsf
- **Label:** 1BR Avg Rent/SF
- **Toggle Mock Data:** "$1.98"

### market-rent-1bed-avg-rentsf-unadj
- **Label:** 1BR Avg Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.98"

### market-rent-1bed-avg-rentunit
- **Label:** 1BR Avg Rent/Unit
- **Toggle Mock Data:** "$1,287"

### market-rent-1bed-avg-unitsize
- **Label:** 1BR Avg Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-comp1-rentsf
- **Label:** 1BR Comp1 Rent/SF
- **Toggle Mock Data:** "$2.12"

### market-rent-1bed-comp1-rentsf-unadj
- **Label:** 1BR Comp1 Rent/SF (Unadj)
- **Toggle Mock Data:** "$2.12"

### market-rent-1bed-comp1-rentunit
- **Label:** 1BR Comp1 Rent/Unit
- **Toggle Mock Data:** "$1,379"

### market-rent-1bed-comp1-unitsize
- **Label:** 1BR Comp1 Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-comp2-rentsf
- **Label:** 1BR Comp2 Rent/SF
- **Toggle Mock Data:** "$1.82"

### market-rent-1bed-comp2-rentsf-unadj
- **Label:** 1BR Comp2 Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.82"

### market-rent-1bed-comp2-rentunit
- **Label:** 1BR Comp2 Rent/Unit
- **Toggle Mock Data:** "$1,185"

### market-rent-1bed-comp2-unitsize
- **Label:** 1BR Comp2 Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-comp3-rentsf
- **Label:** 1BR Comp3 Rent/SF
- **Toggle Mock Data:** "$1.90"

### market-rent-1bed-comp3-rentsf-unadj
- **Label:** 1BR Comp3 Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.90"

### market-rent-1bed-comp3-rentunit
- **Label:** 1BR Comp3 Rent/Unit
- **Toggle Mock Data:** "$1,235"

### market-rent-1bed-comp3-unitsize
- **Label:** 1BR Comp3 Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-comp4-rentsf
- **Label:** 1BR Comp4 Rent/SF
- **Toggle Mock Data:** "$1.79"

### market-rent-1bed-comp4-rentsf-unadj
- **Label:** 1BR Comp4 Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.79"

### market-rent-1bed-comp4-rentunit
- **Label:** 1BR Comp4 Rent/Unit
- **Toggle Mock Data:** "$1,165"

### market-rent-1bed-comp4-unitsize
- **Label:** 1BR Comp4 Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-comp5-rentsf
- **Label:** 1BR Comp5 Rent/SF
- **Toggle Mock Data:** "$1.91"

### market-rent-1bed-comp5-rentsf-unadj
- **Label:** 1BR Comp5 Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.91"

### market-rent-1bed-comp5-rentunit
- **Label:** 1BR Comp5 Rent/Unit
- **Toggle Mock Data:** "$1,240"

### market-rent-1bed-comp5-unitsize
- **Label:** 1BR Comp5 Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-high-rentsf
- **Label:** 1BR High Rent/SF
- **Toggle Mock Data:** "$2.28"

### market-rent-1bed-high-rentsf-unadj
- **Label:** 1BR High Rent/SF (Unadj)
- **Toggle Mock Data:** "$2.28"

### market-rent-1bed-high-rentunit
- **Label:** 1BR High Rent/Unit
- **Toggle Mock Data:** "$1,480"

### market-rent-1bed-high-unitsize
- **Label:** 1BR High Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-low-rentsf
- **Label:** 1BR Low Rent/SF
- **Toggle Mock Data:** "$1.71"

### market-rent-1bed-low-rentsf-unadj
- **Label:** 1BR Low Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.71"

### market-rent-1bed-low-rentunit
- **Label:** 1BR Low Rent/Unit
- **Toggle Mock Data:** "$1,110"

### market-rent-1bed-low-unitsize
- **Label:** 1BR Low Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed-med-rentsf
- **Label:** 1BR Med Rent/SF
- **Toggle Mock Data:** "$1.91"

### market-rent-1bed-med-rentsf-unadj
- **Label:** 1BR Med Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.91"

### market-rent-1bed-med-rentunit
- **Label:** 1BR Med Rent/Unit
- **Toggle Mock Data:** "$1,240"

### market-rent-1bed-med-unitsize
- **Label:** 1BR Med Unit Size
- **Toggle Mock Data:** "650"

### market-rent-1bed1bath-conclusionsf
- **Label:** 1BR1BA Conclusion/SF
- **Toggle Mock Data:** "$1.63"

### market-rent-1bed1bath-rentsf
- **Label:** 1BR1BA Rent/SF
- **Toggle Mock Data:** "$1.63"

### market-rent-1bed1bath-rentunit
- **Label:** 1BR1BA Rent/Unit
- **Toggle Mock Data:** "$895"

### market-rent-1bed1bath-unitsize
- **Label:** 1BR1BA Unit Size
- **Toggle Mock Data:** "650"

### market-rent-2bed-avg-netadj
- **Label:** 2BR Avg Net Adj
- **Toggle Mock Data:** "0%"

### market-rent-2bed-avg-rentsf
- **Label:** 2BR Avg Rent/SF
- **Toggle Mock Data:** "$1.98"

### market-rent-2bed-avg-rentsf-unadj
- **Label:** 2BR Avg Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.98"

### market-rent-2bed-avg-rentunit
- **Label:** 2BR Avg Rent/Unit
- **Toggle Mock Data:** "$1,486"

### market-rent-2bed-avg-unitsize
- **Label:** 2BR Avg Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-comp1-netadj
- **Label:** 2BR Comp1 Net Adj
- **Toggle Mock Data:** "0%"

### market-rent-2bed-comp1-rentsf
- **Label:** 2BR Comp1 Rent/SF
- **Toggle Mock Data:** "$2.00"

### market-rent-2bed-comp1-rentsf-unadj
- **Label:** 2BR Comp1 Rent/SF (Unadj)
- **Toggle Mock Data:** "$2.00"

### market-rent-2bed-comp1-rentunit
- **Label:** 2BR Comp1 Rent/Unit
- **Toggle Mock Data:** "$1,500"

### market-rent-2bed-comp1-unitsize
- **Label:** 2BR Comp1 Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-comp2-netadj
- **Label:** 2BR Comp2 Net Adj
- **Toggle Mock Data:** "0%"

### market-rent-2bed-comp2-rentsf
- **Label:** 2BR Comp2 Rent/SF
- **Toggle Mock Data:** "$2.43"

### market-rent-2bed-comp2-rentsf-unadj
- **Label:** 2BR Comp2 Rent/SF (Unadj)
- **Toggle Mock Data:** "$2.43"

### market-rent-2bed-comp2-rentunit
- **Label:** 2BR Comp2 Rent/Unit
- **Toggle Mock Data:** "$1,825"

### market-rent-2bed-comp2-unitsize
- **Label:** 2BR Comp2 Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-comp3-netadj
- **Label:** 2BR Comp3 Net Adj
- **Toggle Mock Data:** "0%"

### market-rent-2bed-comp3-rentsf
- **Label:** 2BR Comp3 Rent/SF
- **Toggle Mock Data:** "$1.61"

### market-rent-2bed-comp3-rentsf-unadj
- **Label:** 2BR Comp3 Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.61"

### market-rent-2bed-comp3-rentunit
- **Label:** 2BR Comp3 Rent/Unit
- **Toggle Mock Data:** "$1,210"

### market-rent-2bed-comp3-unitsize
- **Label:** 2BR Comp3 Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-comp4-netadj
- **Label:** 2BR Comp4 Net Adj
- **Toggle Mock Data:** "0%"

### market-rent-2bed-comp4-rentsf
- **Label:** 2BR Comp4 Rent/SF
- **Toggle Mock Data:** "$1.71"

### market-rent-2bed-comp4-rentsf-unadj
- **Label:** 2BR Comp4 Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.71"

### market-rent-2bed-comp4-rentunit
- **Label:** 2BR Comp4 Rent/Unit
- **Toggle Mock Data:** "$1,285"

### market-rent-2bed-comp4-unitsize
- **Label:** 2BR Comp4 Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-comp5-netadj
- **Label:** 2BR Comp5 Net Adj
- **Toggle Mock Data:** "0%"

### market-rent-2bed-comp5-rentsf
- **Label:** 2BR Comp5 Rent/SF
- **Toggle Mock Data:** "$1.81"

### market-rent-2bed-comp5-rentsf-unadj
- **Label:** 2BR Comp5 Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.81"

### market-rent-2bed-comp5-rentunit
- **Label:** 2BR Comp5 Rent/Unit
- **Toggle Mock Data:** "$1,360"

### market-rent-2bed-comp5-unitsize
- **Label:** 2BR Comp5 Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-high-rentsf
- **Label:** 2BR High Rent/SF
- **Toggle Mock Data:** "$2.50"

### market-rent-2bed-high-rentsf-unadj
- **Label:** 2BR High Rent/SF (Unadj)
- **Toggle Mock Data:** "$2.50"

### market-rent-2bed-high-rentunit
- **Label:** 2BR High Rent/Unit
- **Toggle Mock Data:** "$1,875"

### market-rent-2bed-high-unitsize
- **Label:** 2BR High Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-low-netadj
- **Label:** 2BR Low Net Adj
- **Toggle Mock Data:** "0%"

### market-rent-2bed-low-rentsf
- **Label:** 2BR Low Rent/SF
- **Toggle Mock Data:** "$1.61"

### market-rent-2bed-low-rentsf-unadj
- **Label:** 2BR Low Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.61"

### market-rent-2bed-low-rentunit
- **Label:** 2BR Low Rent/Unit
- **Toggle Mock Data:** "$1,210"

### market-rent-2bed-low-unitsize
- **Label:** 2BR Low Unit Size
- **Toggle Mock Data:** "750"

### market-rent-2bed-med-rentsf
- **Label:** 2BR Med Rent/SF
- **Toggle Mock Data:** "$1.94"

### market-rent-2bed-med-rentsf-unadj
- **Label:** 2BR Med Rent/SF (Unadj)
- **Toggle Mock Data:** "$1.94"

### market-rent-2bed-med-rentunit
- **Label:** 2BR Med Rent/Unit
- **Toggle Mock Data:** "$1,453"

### market-rent-2bed-med-unitsize
- **Label:** 2BR Med Unit Size
- **Toggle Mock Data:** "750"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 41

**Fields:** 63

### contract-vs-market-percentage
- **Label:** Contract vs Market %
- **Toggle Mock Data:** "99.5%"

### contractvsmarket-1bed-actualrent
- **Label:** 1BR Actual Rent
- **Toggle Mock Data:** "$900"

### contractvsmarket-1bed-askingrent
- **Label:** 1BR Asking Rent
- **Toggle Mock Data:** "$885"

### contractvsmarket-1bed-concludedrent
- **Label:** 1BR Concluded Rent
- **Toggle Mock Data:** "$900"

### contractvsmarket-1bed-percentage
- **Label:** 1BR Percentage
- **Toggle Mock Data:** "98.3%"

### contractvsmarket-1bed-units
- **Label:** 1BR Units
- **Toggle Mock Data:** "4"

### contractvsmarket-2bed-actualrent
- **Label:** 2BR Actual Rent
- **Toggle Mock Data:** "$1,050"

### contractvsmarket-2bed-askingrent
- **Label:** 2BR Asking Rent
- **Toggle Mock Data:** "$1,015"

### contractvsmarket-2bed-concludedrent
- **Label:** 2BR Concluded Rent
- **Toggle Mock Data:** "$1,050"

### contractvsmarket-2bed-percentage
- **Label:** 2BR Percentage
- **Toggle Mock Data:** "96.7%"

### contractvsmarket-2bed-units
- **Label:** 2BR Units
- **Toggle Mock Data:** "12"

### contractvsmarket-total-actualrent
- **Label:** Total Actual Rent
- **Toggle Mock Data:** "$1,015"

### contractvsmarket-total-askingrent
- **Label:** Total Asking Rent
- **Toggle Mock Data:** "$989"

### contractvsmarket-total-concludedrent
- **Label:** Total Concluded Rent
- **Toggle Mock Data:** "$1,020"

### contractvsmarket-total-percentage
- **Label:** Total Percentage
- **Toggle Mock Data:** "99.5%"

### contractvsmarket-total-units
- **Label:** Total Units
- **Toggle Mock Data:** "16"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### market-rent-1bed-concluded
- **Label:** 1BR Concluded Rent
- **Toggle Mock Data:** "$1,050"

### market-rent-1bed-concluded-sf
- **Label:** 1BR Concluded Rent/SF
- **Toggle Mock Data:** "$1.62"

### market-rent-1bed-rangehigh
- **Label:** 1BR Range High
- **Toggle Mock Data:** "$1,575"

### market-rent-1bed-rangelow
- **Label:** 1BR Range Low
- **Toggle Mock Data:** "$1,110"

### market-rent-1bed-sf-high
- **Label:** 1BR SF High
- **Toggle Mock Data:** "$2.42"

### market-rent-1bed-sf-low
- **Label:** 1BR SF Low
- **Toggle Mock Data:** "$1.71"

### market-rent-comps-count
- **Label:** Market Rent Comps Count
- **Toggle Mock Data:** "five"

### market-rent-comps-markets
- **Label:** Market Rent Comps Markets
- **Toggle Mock Data:** "North Battleford and Prince Albert"

### otherrevenue-laundry-percent
- **Label:** Laundry Revenue Percent
- **Toggle Mock Data:** "1.2%"

### otherrevenue-laundry-persf
- **Label:** Laundry Revenue Per SF
- **Toggle Mock Data:** "$0.24"

### otherrevenue-laundry-perunit
- **Label:** Laundry Revenue Per Unit
- **Toggle Mock Data:** "$150"

### otherrevenue-laundry-total
- **Label:** Laundry Revenue Total
- **Toggle Mock Data:** "$2,400"

### otherrevenue-parking-percent
- **Label:** Parking Revenue Percent
- **Toggle Mock Data:** "3.1%"

### otherrevenue-parking-persf
- **Label:** Parking Revenue Per SF
- **Toggle Mock Data:** "$0.59"

### otherrevenue-parking-perunit
- **Label:** Parking Revenue Per Unit
- **Toggle Mock Data:** "$375"

### otherrevenue-parking-total
- **Label:** Parking Revenue Total
- **Toggle Mock Data:** "$6,000"

### otherrevenue-total-persf
- **Label:** Other Revenue Total Per SF
- **Toggle Mock Data:** "$0.82"

### otherrevenue-total-perunit
- **Label:** Other Revenue Total Per Unit
- **Toggle Mock Data:** "$525"

### otherrevenue-total-total
- **Label:** Other Revenue Grand Total
- **Toggle Mock Data:** "$8,400"

### rentalrevenue-1bed-contractrent
- **Label:** 1BR Contract Rent
- **Toggle Mock Data:** "$900"

### rentalrevenue-1bed-convvmkt
- **Label:** 1BR Contract vs Market
- **Toggle Mock Data:** "100%"

### rentalrevenue-1bed-marketrent
- **Label:** 1BR Market Rent
- **Toggle Mock Data:** "$900"

### rentalrevenue-1bed-persf
- **Label:** 1BR Per SF
- **Toggle Mock Data:** "$1.39"

### rentalrevenue-1bed-perunit
- **Label:** 1BR Per Unit
- **Toggle Mock Data:** "$900"

### rentalrevenue-1bed-peryear
- **Label:** 1BR Per Year
- **Toggle Mock Data:** "$43,200"

### rentalrevenue-1bed-units
- **Label:** 1BR Units Count
- **Toggle Mock Data:** "4"

### rentalrevenue-2bed-contractrent
- **Label:** 2BR Contract Rent
- **Toggle Mock Data:** "$1,015"

### rentalrevenue-2bed-convvmkt
- **Label:** 2BR Contract vs Market
- **Toggle Mock Data:** "103%"

### rentalrevenue-2bed-marketrent
- **Label:** 2BR Market Rent
- **Toggle Mock Data:** "$1,050"

### rentalrevenue-2bed-persf
- **Label:** 2BR Per SF
- **Toggle Mock Data:** "$1.63"

### rentalrevenue-2bed-perunit
- **Label:** 2BR Per Unit
- **Toggle Mock Data:** "$1,050"

### rentalrevenue-2bed-peryear
- **Label:** 2BR Per Year
- **Toggle Mock Data:** "$151,200"

### rentalrevenue-2bed-units
- **Label:** 2BR Units Count
- **Toggle Mock Data:** "12"

### rentalrevenue-total-contractrent
- **Label:** Total Contract Rent
- **Toggle Mock Data:** "$989"

### rentalrevenue-total-convvmkt
- **Label:** Total Contract vs Market
- **Toggle Mock Data:** "102%"

### rentalrevenue-total-marketrent
- **Label:** Total Market Rent
- **Toggle Mock Data:** "$1,013"

### rentalrevenue-total-persf
- **Label:** Total Per SF
- **Toggle Mock Data:** "$1.59"

### rentalrevenue-total-perunit
- **Label:** Total Per Unit
- **Toggle Mock Data:** "$1,013"

### rentalrevenue-total-peryear
- **Label:** Total Per Year
- **Toggle Mock Data:** "$194,400"

### subject-amenities-laundry
- **Label:** Amenities - Laundry
- **Toggle Mock Data:** "on-site laundry"

### subject-amenities-parking
- **Label:** Amenities - Parking
- **Toggle Mock Data:** "surface parking"

### subject-amenities-utilities
- **Label:** Amenities - Utilities
- **Toggle Mock Data:** "heat and water included"

### subject-name
- **Label:** Property Name
- **Toggle Mock Data:** "North Battleford Apartments"

### subject-quality-rating
- **Label:** Quality Rating
- **Toggle Mock Data:** "average"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-units
- **Label:** Number of Units
- **Toggle Mock Data:** "16"

---

## Page 42

**Fields:** 10

### calc-egr
- **Label:** Effective Gross Revenue
- **Toggle Mock Data:** "$196,406"

### calc-egr-per-sf
- **Label:** EGR Per SF
- **Toggle Mock Data:** "$19.25"

### calc-egr-per-unit
- **Label:** EGR Per Unit
- **Toggle Mock Data:** "$12,275"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-occupancy-current
- **Label:** Current Occupancy
- **Toggle Mock Data:** "100.0%"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### vacancy-loss-sf
- **Label:** Vacancy Loss Per SF
- **Toggle Mock Data:** "($0.77)"

### vacancy-loss-unit
- **Label:** Vacancy Loss Per Unit
- **Toggle Mock Data:** "($493)"

### vacancy-loss-year
- **Label:** Vacancy Loss Per Year
- **Toggle Mock Data:** "($7,786)"

### vacancy-rate-concluded
- **Label:** Vacancy Rate - Concluded
- **Toggle Mock Data:** "3.8%"

---

## Page 43

**Fields:** 99

### calc-egr
- **Label:** Effective Gross Revenue
- **Toggle Mock Data:** "$196,406"

### calc-egr-per-unit
- **Label:** EGR Per Unit
- **Toggle Mock Data:** "$12,275"

### calc-exp-insurance-annual
- **Label:** Insurance Annual
- **Toggle Mock Data:** "($11,360)"

### calc-exp-insurance-pct-pgr
- **Label:** Insurance % of PGR
- **Toggle Mock Data:** "(6%)"

### calc-exp-insurance-per-unit
- **Label:** Insurance/Unit
- **Toggle Mock Data:** "($710)"

### calc-exp-management-annual
- **Label:** Management Annual
- **Toggle Mock Data:** "($8,281)"

### calc-exp-management-pct-pgr
- **Label:** Management % of PGR
- **Toggle Mock Data:** "(4%)"

### calc-exp-management-per-unit
- **Label:** Management/Unit
- **Toggle Mock Data:** "($518)"

### calc-exp-other-annual
- **Label:** Other Annual
- **Toggle Mock Data:** "($3,920)"

### calc-exp-other-pct-pgr
- **Label:** Other % of PGR
- **Toggle Mock Data:** "(2%)"

### calc-exp-other-per-unit
- **Label:** Other/Unit
- **Toggle Mock Data:** "($245)"

### calc-exp-payroll-annual
- **Label:** Payroll Annual
- **Toggle Mock Data:** "($8,000)"

### calc-exp-payroll-pct-pgr
- **Label:** Payroll % of PGR
- **Toggle Mock Data:** "(4%)"

### calc-exp-payroll-per-unit
- **Label:** Payroll/Unit
- **Toggle Mock Data:** "($500)"

### calc-exp-repairs-annual
- **Label:** Repairs Annual
- **Toggle Mock Data:** "($13,280)"

### calc-exp-repairs-pct-pgr
- **Label:** Repairs % of PGR
- **Toggle Mock Data:** "(7%)"

### calc-exp-repairs-per-unit
- **Label:** Repairs/Unit
- **Toggle Mock Data:** "($830)"

### calc-exp-taxes-annual
- **Label:** Taxes Annual
- **Toggle Mock Data:** "($19,688)"

### calc-exp-taxes-pct-pgr
- **Label:** Taxes % of PGR
- **Toggle Mock Data:** "(10%)"

### calc-exp-taxes-per-unit
- **Label:** Taxes/Unit
- **Toggle Mock Data:** "($1,231)"

### calc-exp-utilities-annual
- **Label:** Utilities Annual
- **Toggle Mock Data:** "($21,040)"

### calc-exp-utilities-pct-pgr
- **Label:** Utilities % of PGR
- **Toggle Mock Data:** "(11%)"

### calc-exp-utilities-per-unit
- **Label:** Utilities/Unit
- **Toggle Mock Data:** "($1,315)"

### calc-expense-ratio
- **Label:** Expense Ratio (%)
- **Toggle Mock Data:** "(44%)"

### calc-expenses-per-unit
- **Label:** Expenses Per Unit
- **Toggle Mock Data:** "($5,348)"

### calc-expenses-total
- **Label:** Total Expenses
- **Toggle Mock Data:** "($85,569)"

### calc-noi
- **Label:** Net Operating Income
- **Toggle Mock Data:** "$111,771"

### calc-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$6,840"

### calc-other-income
- **Label:** Other Income Annual
- **Toggle Mock Data:** "$8,400"

### calc-other-income-per-unit
- **Label:** Other Income Per Unit
- **Toggle Mock Data:** "$525"

### calc-pgr
- **Label:** Potential Gross Revenue
- **Toggle Mock Data:** "$202,800"

### calc-pgr-per-unit
- **Label:** PGR Per Unit
- **Toggle Mock Data:** "$12,675"

### calc-rental-revenue-per-unit
- **Label:** Rental Revenue Per Unit
- **Toggle Mock Data:** "$12,150"

### calc-total-rental-revenue
- **Label:** Total Rental Revenue
- **Toggle Mock Data:** "$194,400"

### calc-vacancy-loss
- **Label:** Total Vacancy & Loss
- **Toggle Mock Data:** "($7,786)"

### calc-vacancy-per-unit
- **Label:** Vacancy Per Unit
- **Toggle Mock Data:** "($487)"

### calc-vacancy-rate
- **Label:** Vacancy Rate (%)
- **Toggle Mock Data:** "(4%)"

### egr-proj-pct
- **Label:** EGR Projection %
- **Toggle Mock Data:** "96%"

### hist-egr-pct-pgr
- **Label:** EGR % PGR
- **Toggle Mock Data:** "96%"

### hist-egr-per-unit
- **Label:** EGR/Unit
- **Toggle Mock Data:** "$12,233"

### hist-egr-total
- **Label:** EGR Total
- **Toggle Mock Data:** "$195,729"

### hist-exp-insurance-pct-pgr
- **Label:** Insurance % PGR
- **Toggle Mock Data:** "(6%)"

### hist-exp-insurance-per-unit
- **Label:** Insurance/Unit
- **Toggle Mock Data:** "($707)"

### hist-exp-insurance-total
- **Label:** Insurance
- **Toggle Mock Data:** "($11,314)"

### hist-exp-management-pct-pgr
- **Label:** Management % PGR
- **Toggle Mock Data:** "(4%)"

### hist-exp-management-per-unit
- **Label:** Management/Unit
- **Toggle Mock Data:** "($519)"

### hist-exp-management-total
- **Label:** Management
- **Toggle Mock Data:** "($8,301)"

### hist-exp-other-pct-pgr
- **Label:** Other % PGR
- **Toggle Mock Data:** "(2%)"

### hist-exp-other-per-unit
- **Label:** Other/Unit
- **Toggle Mock Data:** "($244)"

### hist-exp-other-total
- **Label:** Other Expenses
- **Toggle Mock Data:** "($3,908)"

### hist-exp-payroll-pct-pgr
- **Label:** Payroll % PGR
- **Toggle Mock Data:** "(4%)"

### hist-exp-payroll-per-unit
- **Label:** Payroll/Unit
- **Toggle Mock Data:** "($500)"

### hist-exp-payroll-total
- **Label:** Payroll
- **Toggle Mock Data:** "($8,000)"

### hist-exp-repairs-pct-pgr
- **Label:** Repairs % PGR
- **Toggle Mock Data:** "(7%)"

### hist-exp-repairs-per-unit
- **Label:** Repairs/Unit
- **Toggle Mock Data:** "($830)"

### hist-exp-repairs-total
- **Label:** Repairs & Maintenance
- **Toggle Mock Data:** "($13,280)"

### hist-exp-taxes-pct-pgr
- **Label:** Taxes % PGR
- **Toggle Mock Data:** "(10%)"

### hist-exp-taxes-per-unit
- **Label:** Taxes/Unit
- **Toggle Mock Data:** "($1,163)"

### hist-exp-taxes-total
- **Label:** Taxes
- **Toggle Mock Data:** "($18,600)"

### hist-exp-total-pct-pgr
- **Label:** Total Expenses % PGR
- **Toggle Mock Data:** "(44%)"

### hist-exp-total-per-unit
- **Label:** Total Expenses/Unit
- **Toggle Mock Data:** "($5,402)"

### hist-exp-total-total
- **Label:** Total Expenses
- **Toggle Mock Data:** "($86,428)"

### hist-exp-utilities-pct-pgr
- **Label:** Utilities % PGR
- **Toggle Mock Data:** "(12%)"

### hist-exp-utilities-per-unit
- **Label:** Utilities/Unit
- **Toggle Mock Data:** "($1,439)"

### hist-exp-utilities-total
- **Label:** Utilities
- **Toggle Mock Data:** "($23,025)"

### hist-noi-pct-pgr
- **Label:** NOI % PGR
- **Toggle Mock Data:** "54%"

### hist-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$6,831"

### hist-noi-total
- **Label:** NOI
- **Toggle Mock Data:** "$109,301"

### hist-pgr-pct-pgr
- **Label:** Historical PGR %
- **Toggle Mock Data:** "100%"

### hist-pgr-per-unit
- **Label:** PGR/Unit
- **Toggle Mock Data:** "$12,716"

### hist-pgr-total
- **Label:** PGR Total
- **Toggle Mock Data:** "$203,460"

### hist-revenue-laundry-pct-pgr
- **Label:** Laundry Revenue % PGR
- **Toggle Mock Data:** "1%"

### hist-revenue-laundry-per-unit
- **Label:** Laundry Revenue/Unit
- **Toggle Mock Data:** "$150"

### hist-revenue-laundry-total
- **Label:** Laundry Revenue
- **Toggle Mock Data:** "$2,400"

### hist-revenue-misc-pct-pgr
- **Label:** Misc Revenue % PGR
- **Toggle Mock Data:** "4%"

### hist-revenue-misc-per-unit
- **Label:** Misc Revenue/Unit
- **Toggle Mock Data:** "$525"

### hist-revenue-misc-total
- **Label:** Misc Revenue
- **Toggle Mock Data:** "$8,400"

### hist-revenue-multifamily-pct-pgr
- **Label:** Multifamily Revenue % PGR
- **Toggle Mock Data:** "96%"

### hist-revenue-multifamily-per-unit
- **Label:** Multifamily Revenue/Unit
- **Toggle Mock Data:** "$12,191"

### hist-revenue-multifamily-total
- **Label:** Multifamily Revenue
- **Toggle Mock Data:** "$195,060"

### hist-revenue-parking-pct-pgr
- **Label:** Parking Revenue % PGR
- **Toggle Mock Data:** "3%"

### hist-revenue-parking-per-unit
- **Label:** Parking Revenue/Unit
- **Toggle Mock Data:** "$375"

### hist-revenue-parking-total
- **Label:** Parking Revenue
- **Toggle Mock Data:** "$6,000"

### hist-revenue-rental-pct-pgr
- **Label:** Rental Revenue % PGR
- **Toggle Mock Data:** "96%"

### hist-revenue-rental-per-unit
- **Label:** Rental Revenue/Unit
- **Toggle Mock Data:** "$12,191"

### hist-revenue-rental-total
- **Label:** Rental Revenue
- **Toggle Mock Data:** "$195,060"

### hist-vacancy-pct-pgr
- **Label:** Vacancy % PGR
- **Toggle Mock Data:** "(4%)"

### hist-vacancy-per-unit
- **Label:** Vacancy/Unit
- **Toggle Mock Data:** "($483)"

### hist-vacancy-total
- **Label:** Vacancy Loss
- **Toggle Mock Data:** "($7,731)"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### noi-proj-pct
- **Label:** NOI Projection %
- **Toggle Mock Data:** "54%"

### pgr-proj-pct
- **Label:** PGR Projection %
- **Toggle Mock Data:** "100%"

### revenue-laundry-proj-pct
- **Label:** Laundry Revenue - Projected %
- **Toggle Mock Data:** "1%"

### revenue-laundry-proj-total
- **Label:** Laundry Revenue - Projected Total
- **Toggle Mock Data:** "$2,400"

### revenue-misc-proj-pct
- **Label:** Misc Revenue - Projected %
- **Toggle Mock Data:** "4%"

### revenue-multifamily-proj-pct
- **Label:** Multifamily Revenue - Projected %
- **Toggle Mock Data:** "95%"

### revenue-parking-proj-pct
- **Label:** Parking Revenue - Projected %
- **Toggle Mock Data:** "3%"

### revenue-rental-proj-pct
- **Label:** Rental Revenue - Projected %
- **Toggle Mock Data:** "95%"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 44

**Fields:** 44

### calc-exp-insurance-annual
- **Label:** Insurance Annual
- **Toggle Mock Data:** "($11,360)"

### calc-exp-insurance-pct-egr
- **Label:** Insurance % of EGR
- **Toggle Mock Data:** "5.8%"

### calc-exp-insurance-per-sf
- **Label:** Insurance/SF
- **Toggle Mock Data:** "$1.11"

### calc-exp-insurance-per-unit
- **Label:** Insurance/Unit
- **Toggle Mock Data:** "($710)"

### calc-exp-management-annual
- **Label:** Management Annual
- **Toggle Mock Data:** "($8,281)"

### calc-exp-management-pct-egr
- **Label:** Management % of EGR
- **Toggle Mock Data:** "4.2%"

### calc-exp-management-per-sf
- **Label:** Management/SF
- **Toggle Mock Data:** "$0.81"

### calc-exp-management-per-unit
- **Label:** Management/Unit
- **Toggle Mock Data:** "($518)"

### calc-exp-other-annual
- **Label:** Other Annual
- **Toggle Mock Data:** "($3,920)"

### calc-exp-other-pct-egr
- **Label:** Other % of EGR
- **Toggle Mock Data:** "2.0%"

### calc-exp-other-per-sf
- **Label:** Other/SF
- **Toggle Mock Data:** "$0.38"

### calc-exp-other-per-unit
- **Label:** Other/Unit
- **Toggle Mock Data:** "($245)"

### calc-exp-payroll-annual
- **Label:** Payroll Annual
- **Toggle Mock Data:** "($8,000)"

### calc-exp-payroll-pct-egr
- **Label:** Payroll % of EGR
- **Toggle Mock Data:** "4.1%"

### calc-exp-payroll-per-sf
- **Label:** Payroll/SF
- **Toggle Mock Data:** "$0.78"

### calc-exp-payroll-per-unit
- **Label:** Payroll/Unit
- **Toggle Mock Data:** "($500)"

### calc-exp-repairs-annual
- **Label:** Repairs Annual
- **Toggle Mock Data:** "($13,280)"

### calc-exp-repairs-pct-egr
- **Label:** Repairs % of EGR
- **Toggle Mock Data:** "6.8%"

### calc-exp-repairs-per-sf
- **Label:** Repairs/SF
- **Toggle Mock Data:** "$1.30"

### calc-exp-repairs-per-unit
- **Label:** Repairs/Unit
- **Toggle Mock Data:** "($830)"

### calc-exp-taxes-annual
- **Label:** Taxes Annual
- **Toggle Mock Data:** "($19,688)"

### calc-exp-taxes-pct-egr
- **Label:** Taxes % of EGR
- **Toggle Mock Data:** "10.1%"

### calc-exp-taxes-per-sf
- **Label:** Taxes/SF
- **Toggle Mock Data:** "$1.93"

### calc-exp-taxes-per-unit
- **Label:** Taxes/Unit
- **Toggle Mock Data:** "($1,231)"

### calc-exp-utilities-annual
- **Label:** Utilities Annual
- **Toggle Mock Data:** "($21,040)"

### calc-exp-utilities-pct-egr
- **Label:** Utilities % of EGR
- **Toggle Mock Data:** "10.8%"

### calc-exp-utilities-per-sf
- **Label:** Utilities/SF
- **Toggle Mock Data:** "$2.06"

### calc-exp-utilities-per-unit
- **Label:** Utilities/Unit
- **Toggle Mock Data:** "($1,315)"

### calc-expense-ratio
- **Label:** Expense Ratio (%)
- **Toggle Mock Data:** "(44%)"

### calc-expenses-per-sf
- **Label:** Expenses Per SF
- **Toggle Mock Data:** "$8.38"

### calc-expenses-per-unit
- **Label:** Expenses Per Unit
- **Toggle Mock Data:** "($5,348)"

### calc-expenses-total
- **Label:** Total Expenses
- **Toggle Mock Data:** "($85,569)"

### calc-noi
- **Label:** Net Operating Income
- **Toggle Mock Data:** "$111,771"

### calc-noi-per-sf
- **Label:** NOI/SF
- **Toggle Mock Data:** "$10.95"

### calc-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$6,840"

### exp-insurance-comment
- **Label:** Insurance Comment
- **Toggle Mock Data:** "The concluded amount is based on the historical expenses and the expense comparable information"

### exp-management-comment
- **Label:** Management Comment
- **Toggle Mock Data:** "The concluded amount is based on the historical expenses and the expense comparable information"

### exp-other-comment
- **Label:** Other Comment
- **Toggle Mock Data:** "The concluded amount is based on the historical expenses and the expense comparable information"

### exp-payroll-comment
- **Label:** Payroll Comment
- **Toggle Mock Data:** "The concluded amount is based on the historical expenses and the expense comparable information"

### exp-repairs-comment
- **Label:** Repairs Comment
- **Toggle Mock Data:** "The concluded amount is based on the historical expenses and the expense comparable information"

### exp-taxes-comment
- **Label:** Taxes Comment
- **Toggle Mock Data:** "The concluded amount is based on the historical expenses and the expense comparable information"

### exp-utilities-comment
- **Label:** Utilities Comment
- **Toggle Mock Data:** "The concluded amount is based on the historical expenses and the expense comparable information"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 45

**Fields:** 6

### bond-yield-10yr
- **Label:** 10-Year Bond Yield
- **Toggle Mock Data:** "3.2%"

### cap-rate-implied-range
- **Label:** Cap Rate Implied Range
- **Toggle Mock Data:** "4.25%-6.25%"

### chart-mf-investment-indicators
- **Label:** MF Investment Indicators Chart
- **Toggle Mock Data:** "Multi_Family_Investment_Indicators_Chart"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### risk-premium-bp
- **Label:** Risk Premium (BP)
- **Toggle Mock Data:** "75-300"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 46

**Fields:** 70

### cap-rate-average
- **Label:** Cap Rate Average
- **Toggle Mock Data:** "6.03%"

### cap-rate-high
- **Label:** Cap Rate High
- **Toggle Mock Data:** "6.24%"

### cap-rate-low
- **Label:** Cap Rate Low
- **Toggle Mock Data:** "5.92%"

### comp1-address
- **Label:** Address
- **Toggle Mock Data:** "1501 102 St"

### comp1-cap-rate
- **Label:** Comp1 Cap Rate
- **Toggle Mock Data:** "5.98%"

### comp1-city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### comp1-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "22,754"

### comp1-name
- **Label:** Property Name
- **Toggle Mock Data:** "Heritage House"

### comp1-noi
- **Label:** NOI
- **Toggle Mock Data:** "$129,891"

### comp1-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$7,780.02"

### comp1-price-per-sf
- **Label:** Price/SF
- **Toggle Mock Data:** "$137"

### comp1-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp1-sale-date
- **Label:** Comp1 Sale Date
- **Toggle Mock Data:** "2024-06-17"

### comp1-sale-price
- **Label:** Comp1 Sale Price
- **Toggle Mock Data:** "$3,750,000"

### comp1-units
- **Label:** Units
- **Toggle Mock Data:** "24"

### comp1-year
- **Label:** Year Built
- **Toggle Mock Data:** "2006"

### comp2-address
- **Label:** Address
- **Toggle Mock Data:** "1070-1092 Ferguson Ave"

### comp2-cap-rate
- **Label:** Comp2 Cap Rate
- **Toggle Mock Data:** "5.98%"

### comp2-city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### comp2-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "33,309"

### comp2-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside View Apartments"

### comp2-noi
- **Label:** NOI
- **Toggle Mock Data:** "$102,019"

### comp2-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$6,111.00"

### comp2-price-per-sf
- **Label:** Price/SF
- **Toggle Mock Data:** "$137"

### comp2-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp2-sale-date
- **Label:** Comp2 Sale Date
- **Toggle Mock Data:** "2024-04-17"

### comp2-sale-price
- **Label:** Comp2 Sale Price
- **Toggle Mock Data:** "$2,650,000"

### comp2-units
- **Label:** Units
- **Toggle Mock Data:** "45"

### comp2-year
- **Label:** Year Built
- **Toggle Mock Data:** "2002"

### comp3-address
- **Label:** Address
- **Toggle Mock Data:** "1901 Pearson Ave"

### comp3-cap-rate
- **Label:** Comp3 Cap Rate
- **Toggle Mock Data:** "5.99%"

### comp3-city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### comp3-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "15,000"

### comp3-name
- **Label:** Property Name
- **Toggle Mock Data:** "Woodland Estates"

### comp3-noi
- **Label:** NOI
- **Toggle Mock Data:** "$82,827"

### comp3-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$5,129.00"

### comp3-price-per-sf
- **Label:** Price/SF
- **Toggle Mock Data:** "$137"

### comp3-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp3-sale-date
- **Label:** Comp3 Sale Date
- **Toggle Mock Data:** "2024-05-27"

### comp3-sale-price
- **Label:** Comp3 Sale Price
- **Toggle Mock Data:** "$1,500,000"

### comp3-units
- **Label:** Units
- **Toggle Mock Data:** "24"

### comp3-year
- **Label:** Year Built
- **Toggle Mock Data:** "1980"

### comp4-address
- **Label:** Address
- **Toggle Mock Data:** "1030 Parr Hill Dr"

### comp4-cap-rate
- **Label:** Comp4 Cap Rate
- **Toggle Mock Data:** "6.24%"

### comp4-city
- **Label:** City
- **Toggle Mock Data:** "Martensville"

### comp4-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "47,916"

### comp4-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside Flats 1"

### comp4-noi
- **Label:** NOI
- **Toggle Mock Data:** "$189,400"

### comp4-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$12,389.00"

### comp4-price-per-sf
- **Label:** Price/SF
- **Toggle Mock Data:** "$194"

### comp4-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp4-sale-date
- **Label:** Comp4 Sale Date
- **Toggle Mock Data:** "2023-05-19"

### comp4-sale-price
- **Label:** Comp4 Sale Price
- **Toggle Mock Data:** "$3,650,000"

### comp4-units
- **Label:** Units
- **Toggle Mock Data:** "47"

### comp4-year
- **Label:** Year Built
- **Toggle Mock Data:** "2016"

### comp5-address
- **Label:** Address
- **Toggle Mock Data:** "1030 Parr Hill Dr"

### comp5-cap-rate
- **Label:** Comp5 Cap Rate
- **Toggle Mock Data:** "5.92%"

### comp5-city
- **Label:** City
- **Toggle Mock Data:** "Martensville"

### comp5-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "52,708"

### comp5-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside Flats 2"

### comp5-noi
- **Label:** NOI
- **Toggle Mock Data:** "$214,375"

### comp5-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$12,891.00"

### comp5-price-per-sf
- **Label:** Price/SF
- **Toggle Mock Data:** "$286"

### comp5-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp5-sale-date
- **Label:** Comp5 Sale Date
- **Toggle Mock Data:** "2023-05-19"

### comp5-sale-price
- **Label:** Comp5 Sale Price
- **Toggle Mock Data:** "$4,200,000"

### comp5-units
- **Label:** Units
- **Toggle Mock Data:** "52"

### comp5-year
- **Label:** Year Built
- **Toggle Mock Data:** "2019"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 47

**Fields:** 9

### calc-cap-rate
- **Label:** Cap Rate (%)
- **Toggle Mock Data:** "6.25%"

### cap-rate-average
- **Label:** Cap Rate Average
- **Toggle Mock Data:** "6.03%"

### cap-rate-high
- **Label:** Cap Rate High
- **Toggle Mock Data:** "6.24%"

### cap-rate-low
- **Label:** Cap Rate Low
- **Toggle Mock Data:** "5.92%"

### cap-rate-range
- **Label:** Cap Rate Range
- **Toggle Mock Data:** "5.92% to 6.24%"

### comp5-cap-rate
- **Label:** Comp5 Cap Rate
- **Toggle Mock Data:** "5.92%"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### year-built
- **Label:** Year Built
- **Toggle Mock Data:** "1970"

---

## Page 48

**Fields:** 114

### calc-avg-cont-v-market
- **Label:** Avg Contract vs Market %
- **Toggle Mock Data:** "100%"

### calc-avg-contract-rent
- **Label:** Avg Contract Rent
- **Toggle Mock Data:** "$1,015"

### calc-avg-market-rent
- **Label:** Avg Market Rent
- **Toggle Mock Data:** "$1,020"

### calc-cap-rate
- **Label:** Cap Rate (%)
- **Toggle Mock Data:** "6.25%"

### calc-egr
- **Label:** Effective Gross Revenue
- **Toggle Mock Data:** "$196,406"

### calc-egr-per-sf
- **Label:** EGR Per SF
- **Toggle Mock Data:** "$19.25"

### calc-egr-per-unit
- **Label:** EGR Per Unit
- **Toggle Mock Data:** "$12,275"

### calc-exp-insurance-annual
- **Label:** Insurance Annual
- **Toggle Mock Data:** "($11,360)"

### calc-exp-insurance-pct-egr
- **Label:** Insurance % of EGR
- **Toggle Mock Data:** "5.8%"

### calc-exp-insurance-pct-pgr
- **Label:** Insurance % of PGR
- **Toggle Mock Data:** "(6%)"

### calc-exp-insurance-per-sf
- **Label:** Insurance/SF
- **Toggle Mock Data:** "$1.11"

### calc-exp-insurance-per-unit
- **Label:** Insurance/Unit
- **Toggle Mock Data:** "($710)"

### calc-exp-management-annual
- **Label:** Management Annual
- **Toggle Mock Data:** "($8,281)"

### calc-exp-management-pct-egr
- **Label:** Management % of EGR
- **Toggle Mock Data:** "4.2%"

### calc-exp-management-pct-pgr
- **Label:** Management % of PGR
- **Toggle Mock Data:** "(4%)"

### calc-exp-management-per-sf
- **Label:** Management/SF
- **Toggle Mock Data:** "$0.81"

### calc-exp-management-per-unit
- **Label:** Management/Unit
- **Toggle Mock Data:** "($518)"

### calc-exp-other-annual
- **Label:** Other Annual
- **Toggle Mock Data:** "($3,920)"

### calc-exp-other-pct-egr
- **Label:** Other % of EGR
- **Toggle Mock Data:** "2.0%"

### calc-exp-other-pct-pgr
- **Label:** Other % of PGR
- **Toggle Mock Data:** "(2%)"

### calc-exp-other-per-sf
- **Label:** Other/SF
- **Toggle Mock Data:** "$0.38"

### calc-exp-other-per-unit
- **Label:** Other/Unit
- **Toggle Mock Data:** "($245)"

### calc-exp-payroll-annual
- **Label:** Payroll Annual
- **Toggle Mock Data:** "($8,000)"

### calc-exp-payroll-pct-egr
- **Label:** Payroll % of EGR
- **Toggle Mock Data:** "4.1%"

### calc-exp-payroll-pct-pgr
- **Label:** Payroll % of PGR
- **Toggle Mock Data:** "(4%)"

### calc-exp-payroll-per-sf
- **Label:** Payroll/SF
- **Toggle Mock Data:** "$0.78"

### calc-exp-payroll-per-unit
- **Label:** Payroll/Unit
- **Toggle Mock Data:** "($500)"

### calc-exp-repairs-annual
- **Label:** Repairs Annual
- **Toggle Mock Data:** "($13,280)"

### calc-exp-repairs-pct-egr
- **Label:** Repairs % of EGR
- **Toggle Mock Data:** "6.8%"

### calc-exp-repairs-pct-pgr
- **Label:** Repairs % of PGR
- **Toggle Mock Data:** "(7%)"

### calc-exp-repairs-per-sf
- **Label:** Repairs/SF
- **Toggle Mock Data:** "$1.30"

### calc-exp-repairs-per-unit
- **Label:** Repairs/Unit
- **Toggle Mock Data:** "($830)"

### calc-exp-taxes-annual
- **Label:** Taxes Annual
- **Toggle Mock Data:** "($19,688)"

### calc-exp-taxes-pct-egr
- **Label:** Taxes % of EGR
- **Toggle Mock Data:** "10.1%"

### calc-exp-taxes-pct-pgr
- **Label:** Taxes % of PGR
- **Toggle Mock Data:** "(10%)"

### calc-exp-taxes-per-sf
- **Label:** Taxes/SF
- **Toggle Mock Data:** "$1.93"

### calc-exp-taxes-per-unit
- **Label:** Taxes/Unit
- **Toggle Mock Data:** "($1,231)"

### calc-exp-utilities-annual
- **Label:** Utilities Annual
- **Toggle Mock Data:** "($21,040)"

### calc-exp-utilities-pct-egr
- **Label:** Utilities % of EGR
- **Toggle Mock Data:** "10.8%"

### calc-exp-utilities-pct-pgr
- **Label:** Utilities % of PGR
- **Toggle Mock Data:** "(11%)"

### calc-exp-utilities-per-sf
- **Label:** Utilities/SF
- **Toggle Mock Data:** "$2.06"

### calc-exp-utilities-per-unit
- **Label:** Utilities/Unit
- **Toggle Mock Data:** "($1,315)"

### calc-expense-ratio-egr
- **Label:** Expense Ratio (% of EGR)
- **Toggle Mock Data:** "43.1%"

### calc-expense-ratio-pgr
- **Label:** Expense Ratio (% of PGR)
- **Toggle Mock Data:** "41.4%"

### calc-expenses-per-sf
- **Label:** Expenses Per SF
- **Toggle Mock Data:** "$8.38"

### calc-expenses-per-unit
- **Label:** Expenses Per Unit
- **Toggle Mock Data:** "($5,348)"

### calc-expenses-total
- **Label:** Total Expenses
- **Toggle Mock Data:** "($85,569)"

### calc-indicated-value
- **Label:** Indicated Value
- **Toggle Mock Data:** "$1,800,000"

### calc-indicated-value-rounded
- **Label:** Indicated Value (Rounded)
- **Toggle Mock Data:** "$1,800,000"

### calc-laundry-annual
- **Label:** Laundry Revenue Annual
- **Toggle Mock Data:** "$2,400"

### calc-laundry-pct-egr
- **Label:** Laundry % of EGR
- **Toggle Mock Data:** "1%"

### calc-laundry-pct-pgr
- **Label:** Laundry % of PGR
- **Toggle Mock Data:** "1%"

### calc-laundry-pct-prr
- **Label:** Laundry % of Rental Revenue
- **Toggle Mock Data:** "1%"

### calc-laundry-per-sf
- **Label:** Laundry Per SF
- **Toggle Mock Data:** "$0.24"

### calc-laundry-per-unit
- **Label:** Laundry $/Unit/Mo
- **Toggle Mock Data:** "$150"

### calc-mf-annual
- **Label:** Multifamily Revenue Annual
- **Toggle Mock Data:** "$195,840"

### calc-mf-pct-egr
- **Label:** Multifamily % of EGR
- **Toggle Mock Data:** "100%"

### calc-mf-pct-pgr
- **Label:** Multifamily % of PGR
- **Toggle Mock Data:** "96%"

### calc-mf-pct-prr
- **Label:** Multifamily % of Rental Revenue
- **Toggle Mock Data:** "100%"

### calc-mf-per-sf
- **Label:** Multifamily Revenue Per SF
- **Toggle Mock Data:** "$19.19"

### calc-mf-per-unit
- **Label:** Multifamily Revenue Per Unit
- **Toggle Mock Data:** "$12,240"

### calc-noi
- **Label:** Net Operating Income
- **Toggle Mock Data:** "$111,771"

### calc-noi-per-sf
- **Label:** NOI/SF
- **Toggle Mock Data:** "$10.95"

### calc-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$6,840"

### calc-other-rev-annual
- **Label:** Other Revenue Annual
- **Toggle Mock Data:** "$8,400"

### calc-other-rev-pct-egr
- **Label:** Other Revenue % of EGR
- **Toggle Mock Data:** "4%"

### calc-other-rev-pct-pgr
- **Label:** Other Revenue % of PGR
- **Toggle Mock Data:** "4%"

### calc-other-rev-pct-prr
- **Label:** Other Revenue % of Rental Revenue
- **Toggle Mock Data:** "4%"

### calc-other-rev-per-sf
- **Label:** Other Revenue Per SF
- **Toggle Mock Data:** "$0.82"

### calc-other-rev-per-unit
- **Label:** Other Revenue Per Unit
- **Toggle Mock Data:** "$525"

### calc-parking-annual
- **Label:** Parking Revenue Annual
- **Toggle Mock Data:** "$6,000"

### calc-parking-pct-egr
- **Label:** Parking % of EGR
- **Toggle Mock Data:** "3%"

### calc-parking-pct-pgr
- **Label:** Parking % of PGR
- **Toggle Mock Data:** "3%"

### calc-parking-pct-prr
- **Label:** Parking % of Rental Revenue
- **Toggle Mock Data:** "3%"

### calc-parking-per-sf
- **Label:** Parking Revenue Per SF
- **Toggle Mock Data:** "$0.59"

### calc-parking-per-unit
- **Label:** Parking $/Unit/Mo
- **Toggle Mock Data:** "$375"

### calc-pgr
- **Label:** Potential Gross Revenue
- **Toggle Mock Data:** "$202,800"

### calc-pgr-per-sf
- **Label:** PGR Per SF
- **Toggle Mock Data:** "$20.02"

### calc-pgr-per-unit
- **Label:** PGR Per Unit
- **Toggle Mock Data:** "$12,675"

### calc-rental-rev-annual
- **Label:** Rental Revenue Annual
- **Toggle Mock Data:** "$195,840"

### calc-rental-rev-per-sf
- **Label:** Rental Revenue Per SF
- **Toggle Mock Data:** "$19.19"

### calc-rental-rev-per-unit
- **Label:** Rental Revenue Per Unit
- **Toggle Mock Data:** "$12,240"

### calc-subtotal-annual
- **Label:** Subtotal Revenue Annual
- **Toggle Mock Data:** "$195,840"

### calc-subtotal-per-sf
- **Label:** Subtotal Revenue Per SF
- **Toggle Mock Data:** "$19.19"

### calc-subtotal-per-unit
- **Label:** Subtotal Revenue Per Unit
- **Toggle Mock Data:** "$1,020"

### calc-total-vacancy-loss
- **Label:** Total Vacancy Loss
- **Toggle Mock Data:** "($7,834)"

### calc-total-vacancy-pct-egr
- **Label:** Total Vacancy % of EGR
- **Toggle Mock Data:** "4.0%"

### calc-total-vacancy-pct-pgr
- **Label:** Total Vacancy % of PGR
- **Toggle Mock Data:** "3.8%"

### calc-total-vacancy-per-sf
- **Label:** Total Vacancy Per SF
- **Toggle Mock Data:** "($0.77)"

### calc-total-vacancy-per-unit
- **Label:** Total Vacancy Per Unit
- **Toggle Mock Data:** "($490)"

### calc-type1-annual
- **Label:** Annual Revenue
- **Toggle Mock Data:** "$43,200"

### calc-type1-cont-v-market
- **Label:** Contract vs Market %
- **Toggle Mock Data:** "99%"

### calc-type1-contract-rent
- **Label:** Contract Rent/Mo
- **Toggle Mock Data:** "$895"

### calc-type1-count
- **Label:** Unit Count
- **Toggle Mock Data:** "4"

### calc-type1-per-sf
- **Label:** Revenue/SF
- **Toggle Mock Data:** "$19.64"

### calc-type1-per-unit
- **Label:** Revenue/Unit
- **Toggle Mock Data:** "$900"

### calc-type1-rent
- **Label:** Market Rent/Mo
- **Toggle Mock Data:** "$900"

### calc-type2-annual
- **Label:** Annual Revenue
- **Toggle Mock Data:** "$152,640"

### calc-type2-cont-v-market
- **Label:** Contract vs Market %
- **Toggle Mock Data:** "100%"

### calc-type2-contract-rent
- **Label:** Contract Rent/Mo
- **Toggle Mock Data:** "$1,055"

### calc-type2-count
- **Label:** Unit Count
- **Toggle Mock Data:** "12"

### calc-type2-per-sf
- **Label:** Revenue/SF
- **Toggle Mock Data:** "$19.07"

### calc-type2-per-unit
- **Label:** Revenue/Unit
- **Toggle Mock Data:** "$1,060"

### calc-type2-rent
- **Label:** Market Rent/Mo
- **Toggle Mock Data:** "$1,060"

### calc-vacancy-loss
- **Label:** Total Vacancy & Loss
- **Toggle Mock Data:** "($7,786)"

### calc-vacancy-pct-egr
- **Label:** Vacancy % of EGR
- **Toggle Mock Data:** "4.0%"

### calc-vacancy-pct-pgr
- **Label:** Vacancy % of PGR
- **Toggle Mock Data:** "4.0%"

### calc-vacancy-per-sf
- **Label:** Vacancy Per SF
- **Toggle Mock Data:** "($0.77)"

### calc-vacancy-per-unit
- **Label:** Vacancy Per Unit
- **Toggle Mock Data:** "($487)"

### calc-value-per-sf
- **Label:** Value/SF
- **Toggle Mock Data:** "$176"

### calc-value-per-unit
- **Label:** Value/Unit
- **Toggle Mock Data:** "$112,500/Unit"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### total-units
- **Label:** Total Units
- **Toggle Mock Data:** "16"

---

## Page 49

**Fields:** 7

### calc-cap-rate
- **Label:** Cap Rate (%)
- **Toggle Mock Data:** "6.25%"

### calc-indicated-value-rounded
- **Label:** Indicated Value (Rounded)
- **Toggle Mock Data:** "$1,800,000"

### calc-noi
- **Label:** Net Operating Income
- **Toggle Mock Data:** "$111,771"

### calc-noi-per-sf
- **Label:** NOI/SF
- **Toggle Mock Data:** "$10.95"

### calc-value-per-sf
- **Label:** Value/SF
- **Toggle Mock Data:** "$176"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 50

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 51

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 52

**Fields:** 18

### comp1-address-full
- **Label:** Comp1 Address Full
- **Toggle Mock Data:** "1551-107 St, North Battleford, SK, S9A 2A1"

### comp1-distance
- **Label:** Comp1 Distance
- **Toggle Mock Data:** "0.3"

### comp1-label
- **Label:** Comp1 Label
- **Toggle Mock Data:** "1"

### comp2-address-full
- **Label:** Comp2 Address Full
- **Toggle Mock Data:** "1501/5-1091/5 Windsor Crescent, North Battleford, SK, S9A 2G3"

### comp2-distance
- **Label:** Comp2 Distance
- **Toggle Mock Data:** "2.8"

### comp2-label
- **Label:** Comp2 Label
- **Toggle Mock Data:** "2"

### comp3-address-full
- **Label:** Comp3 Address Full
- **Toggle Mock Data:** "1001 Pearson Ave, North Battleford, SK, S9A 3L5"

### comp3-distance
- **Label:** Comp3 Distance
- **Toggle Mock Data:** "1.3"

### comp3-label
- **Label:** Comp3 Label
- **Toggle Mock Data:** "3"

### comp4-address-full
- **Label:** Comp4 Address Full
- **Toggle Mock Data:** "1000 Star Hill Dr, Martensville, SK, S0K 2T1"

### comp4-distance
- **Label:** Comp4 Distance
- **Toggle Mock Data:** "123.3"

### comp4-label
- **Label:** Comp4 Label
- **Toggle Mock Data:** "4"

### comp5-address-full
- **Label:** Comp5 Address Full
- **Toggle Mock Data:** "1030 Parr Hill Dr, Martensville, SK, S0K 2T1"

### comp5-distance
- **Label:** Comp5 Distance
- **Toggle Mock Data:** "123.3"

### comp5-label
- **Label:** Comp5 Label
- **Toggle Mock Data:** "5"

### img-comparables-map
- **Label:** Sales Comparables Location Map
- **Toggle Mock Data:** "[Comparables Location Map]"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 53

**Fields:** 43

### comp1-address
- **Label:** Address
- **Toggle Mock Data:** "1501 102 St"

### comp1-analysis-price
- **Label:** Comp1 Analysis Price
- **Toggle Mock Data:** "$3,117,383"

### comp1-analysis-price-per-unit
- **Label:** Comp1 Analysis Price Per Unit
- **Toggle Mock Data:** "$129,891"

### comp1-buyer
- **Label:** Comp1 Buyer
- **Toggle Mock Data:** "Epiphany Group"

### comp1-cap-rate
- **Label:** Comp1 Cap Rate
- **Toggle Mock Data:** "5.98%"

### comp1-city-state-zip
- **Label:** Comp1 City State Zip
- **Toggle Mock Data:** "North Battleford, SK S9A 2A1"

### comp1-conditions-of-sale
- **Label:** Comp1 Conditions of Sale
- **Toggle Mock Data:** "Arm"

### comp1-corner
- **Label:** Comp1 Corner
- **Toggle Mock Data:** "No"

### comp1-county
- **Label:** Comp1 County
- **Toggle Mock Data:** "North Battleford"

### comp1-financing
- **Label:** Financing
- **Toggle Mock Data:** "Cash To Seller"

### comp1-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "22,754"

### comp1-landarea
- **Label:** Comp1 Land Area
- **Toggle Mock Data:** "0.5 Acres (21,780 SF)"

### comp1-laundry
- **Label:** Comp1 Laundry
- **Toggle Mock Data:** "On Site"

### comp1-map
- **Label:** Comp1 Map
- **Toggle Mock Data:** "[Location Map]"

### comp1-name
- **Label:** Property Name
- **Toggle Mock Data:** "Heritage House"

### comp1-noi
- **Label:** NOI
- **Toggle Mock Data:** "$129,891"

### comp1-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$7,780.02"

### comp1-nra
- **Label:** Comp1 NRA
- **Toggle Mock Data:** "22,754 SF"

### comp1-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp1-parking-type
- **Label:** Comp1 Parking Type
- **Toggle Mock Data:** "Surface"

### comp1-photo
- **Label:** Comp1 Photo
- **Toggle Mock Data:** "[Property Photo]"

### comp1-price-per-unit
- **Label:** Comp1 Price Per Unit
- **Toggle Mock Data:** "$129,891"

### comp1-proj-amenities
- **Label:** Comp1 Project Amenities
- **Toggle Mock Data:** "Parking"

### comp1-property-type
- **Label:** Comp1 Property Type
- **Toggle Mock Data:** "Multi-family, Walk-Up"

### comp1-remarks
- **Label:** Comp1 Remarks
- **Toggle Mock Data:** "Macro Properties Toronto sold this 143-unit portfolio to Epiphany Group for $14,000,000 or $97,902.09 per unit. The buyer was drawn to purchasing these properties to diversify and strengthen their inv..."

### comp1-renttype
- **Label:** Comp1 Rent Type
- **Toggle Mock Data:** "Market"

### comp1-rights-transferred
- **Label:** Comp1 Rights Transferred
- **Toggle Mock Data:** "Fee Simple"

### comp1-sale-date
- **Label:** Comp1 Sale Date
- **Toggle Mock Data:** "2024-06-17"

### comp1-sale-price
- **Label:** Comp1 Sale Price
- **Toggle Mock Data:** "$3,750,000"

### comp1-security-features
- **Label:** Comp1 Security Features
- **Toggle Mock Data:** "Deadbolts, Exterior Lighting, Secured Entry"

### comp1-seller
- **Label:** Comp1 Seller
- **Toggle Mock Data:** "Macro Properties Toronto"

### comp1-structures
- **Label:** Comp1 Structures
- **Toggle Mock Data:** "1 Building, 3 Floors"

### comp1-submarket
- **Label:** Comp1 Submarket
- **Toggle Mock Data:** "Saskatchewan Area"

### comp1-transaction-status
- **Label:** Comp1 Transaction Status
- **Toggle Mock Data:** "Closed"

### comp1-unit-amenities
- **Label:** Comp1 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove, Refrigerator"

### comp1-unitmix-avgsize
- **Label:** Comp1 Unit Mix Avg Size
- **Toggle Mock Data:** "0 SF"

### comp1-unitmix-count
- **Label:** Comp1 Unit Mix Count
- **Toggle Mock Data:** "24"

### comp1-unitmix-type
- **Label:** Comp1 Unit Mix Type
- **Toggle Mock Data:** "1 Bed / 1 Bath"

### comp1-units
- **Label:** Units
- **Toggle Mock Data:** "24"

### comp1-utilities
- **Label:** Comp1 Utilities
- **Toggle Mock Data:** "Full Municipal Services"

### comp1-year-built
- **Label:** Comp1 Year Built
- **Toggle Mock Data:** "2000"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 54

**Fields:** 40

### comp2-address
- **Label:** Address
- **Toggle Mock Data:** "1070-1092 Ferguson Ave"

### comp2-analysis-price
- **Label:** Comp2 Analysis Price
- **Toggle Mock Data:** "$4,590,858"

### comp2-buildings
- **Label:** Comp2 Buildings
- **Toggle Mock Data:** "2 Buildings, 3 Floors"

### comp2-buyer
- **Label:** Comp2 Buyer
- **Toggle Mock Data:** "Epiphany Group"

### comp2-cap-rate
- **Label:** Comp2 Cap Rate
- **Toggle Mock Data:** "5.98%"

### comp2-city-state-zip
- **Label:** Comp2 City State Zip
- **Toggle Mock Data:** "North Battleford, SK S9A 2G3"

### comp2-county
- **Label:** Comp2 County
- **Toggle Mock Data:** "North Battleford"

### comp2-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "33,309"

### comp2-landarea
- **Label:** Comp2 Land Area
- **Toggle Mock Data:** "0.5 Acres (21,780 SF)"

### comp2-laundry
- **Label:** Comp2 Laundry
- **Toggle Mock Data:** "On-Site"

### comp2-map
- **Label:** Comp2 Map
- **Toggle Mock Data:** "[Location Map]"

### comp2-market-conditions
- **Label:** Comp2 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp2-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside View Apartments"

### comp2-noi
- **Label:** NOI
- **Toggle Mock Data:** "$102,019"

### comp2-nra
- **Label:** Comp2 NRA
- **Toggle Mock Data:** "31,509 SF"

### comp2-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp2-parking
- **Label:** Comp2 Parking
- **Toggle Mock Data:** "Surface"

### comp2-parking-type
- **Label:** Comp2 Parking Type
- **Toggle Mock Data:** "Surface"

### comp2-photo
- **Label:** Comp2 Photo
- **Toggle Mock Data:** "[Property Photo]"

### comp2-price-per-unit
- **Label:** Comp2 Price Per Unit
- **Toggle Mock Data:** "$102,019"

### comp2-property-type
- **Label:** Comp2 Property Type
- **Toggle Mock Data:** "Multi-Family, Walk-Up"

### comp2-remarks
- **Label:** Comp2 Remarks
- **Toggle Mock Data:** "Macro Properties Toronto sold this 143-unit portfolio to Epiphany Group for $14,000,000 or $97,902.09 per unit. The buyer was drawn to purchasing these properties to diversify and strengthen their inv..."

### comp2-renttype
- **Label:** Comp2 Rent Type
- **Toggle Mock Data:** "Market"

### comp2-rights-transferred
- **Label:** Comp2 Rights Transferred
- **Toggle Mock Data:** "Fee Simple"

### comp2-sale-date
- **Label:** Comp2 Sale Date
- **Toggle Mock Data:** "2024-04-17"

### comp2-sale-price
- **Label:** Comp2 Sale Price
- **Toggle Mock Data:** "$2,650,000"

### comp2-security-features
- **Label:** Comp2 Security Features
- **Toggle Mock Data:** "Deadbolts, Exterior Lighting, Secured Entry"

### comp2-seller
- **Label:** Comp2 Seller
- **Toggle Mock Data:** "Macro Properties Toronto"

### comp2-submarket
- **Label:** Comp2 Submarket
- **Toggle Mock Data:** "Saskatchewan Area"

### comp2-transaction-status
- **Label:** Comp2 Transaction Status
- **Toggle Mock Data:** "Closed"

### comp2-unit-amenities
- **Label:** Comp2 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove, Refrigerator"

### comp2-unitmix-avgsize
- **Label:** Comp2 Unit Mix Avg Size
- **Toggle Mock Data:** "0 SF"

### comp2-unitmix-count
- **Label:** Comp2 Unit Mix Count
- **Toggle Mock Data:** "45"

### comp2-unitmix-type
- **Label:** Comp2 Unit Mix Type
- **Toggle Mock Data:** "1 Bed / 1 Bath"

### comp2-units
- **Label:** Units
- **Toggle Mock Data:** "45"

### comp2-utilities
- **Label:** Comp2 Utilities
- **Toggle Mock Data:** "Full Municipal Services"

### comp2-year-built
- **Label:** Comp2 Year Built
- **Toggle Mock Data:** "2000"

### comp2-zoning
- **Label:** Comp2 Zoning
- **Toggle Mock Data:** "R3"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 55

**Fields:** 40

### comp3-address
- **Label:** Address
- **Toggle Mock Data:** "1901 Pearson Ave"

### comp3-analysis-price
- **Label:** Comp3 Analysis Price
- **Toggle Mock Data:** "$2,055,056"

### comp3-buildings
- **Label:** Comp3 Buildings
- **Toggle Mock Data:** "2 Buildings, 3 Floors"

### comp3-buyer
- **Label:** Comp3 Buyer
- **Toggle Mock Data:** "Epiphany Group"

### comp3-cap-rate
- **Label:** Comp3 Cap Rate
- **Toggle Mock Data:** "5.99%"

### comp3-city-state-zip
- **Label:** Comp3 City State Zip
- **Toggle Mock Data:** "North Battleford, SK S9A 3L5"

### comp3-county
- **Label:** Comp3 County
- **Toggle Mock Data:** "North Battleford"

### comp3-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "15,000"

### comp3-landarea
- **Label:** Comp3 Land Area
- **Toggle Mock Data:** "1.932 Acres (31,977 SF)"

### comp3-laundry
- **Label:** Comp3 Laundry
- **Toggle Mock Data:** "On-Site"

### comp3-map
- **Label:** Comp3 Map
- **Toggle Mock Data:** "[Location Map]"

### comp3-market-conditions
- **Label:** Comp3 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp3-name
- **Label:** Property Name
- **Toggle Mock Data:** "Woodland Estates"

### comp3-noi
- **Label:** NOI
- **Toggle Mock Data:** "$82,827"

### comp3-nra
- **Label:** Comp3 NRA
- **Toggle Mock Data:** "15,000 SF"

### comp3-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp3-parking
- **Label:** Comp3 Parking
- **Toggle Mock Data:** "Surface"

### comp3-parking-type
- **Label:** Comp3 Parking Type
- **Toggle Mock Data:** "Surface"

### comp3-photo
- **Label:** Comp3 Photo
- **Toggle Mock Data:** "[Property Photo]"

### comp3-price-per-unit
- **Label:** Comp3 Price Per Unit
- **Toggle Mock Data:** "$85,627"

### comp3-property-type
- **Label:** Comp3 Property Type
- **Toggle Mock Data:** "Multi-Family, Walk-Up"

### comp3-remarks
- **Label:** Comp3 Remarks
- **Toggle Mock Data:** "Macro Properties Toronto sold this 143-unit portfolio to Epiphany Group for $14,000,000 or $97,902.09 per unit. The buyer was drawn to purchasing these properties to diversify and strengthen their inv..."

### comp3-renttype
- **Label:** Comp3 Rent Type
- **Toggle Mock Data:** "Market"

### comp3-rights-transferred
- **Label:** Comp3 Rights Transferred
- **Toggle Mock Data:** "Fee Simple"

### comp3-sale-date
- **Label:** Comp3 Sale Date
- **Toggle Mock Data:** "2024-05-27"

### comp3-sale-price
- **Label:** Comp3 Sale Price
- **Toggle Mock Data:** "$1,500,000"

### comp3-security-features
- **Label:** Comp3 Security Features
- **Toggle Mock Data:** "Deck Railing, Deadbolts, Exterior Lighting, Secured Entry"

### comp3-seller
- **Label:** Comp3 Seller
- **Toggle Mock Data:** "Macro Properties Toronto"

### comp3-submarket
- **Label:** Comp3 Submarket
- **Toggle Mock Data:** "Saskatchewan Area"

### comp3-transaction-status
- **Label:** Comp3 Transaction Status
- **Toggle Mock Data:** "Closed"

### comp3-unit-amenities
- **Label:** Comp3 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove"

### comp3-unitmix-avgsize
- **Label:** Comp3 Unit Mix Avg Size
- **Toggle Mock Data:** "0 SF"

### comp3-unitmix-count
- **Label:** Comp3 Unit Mix Count
- **Toggle Mock Data:** "24"

### comp3-unitmix-type
- **Label:** Comp3 Unit Mix Type
- **Toggle Mock Data:** "1 Bed / 1 Bath"

### comp3-units
- **Label:** Units
- **Toggle Mock Data:** "24"

### comp3-utilities
- **Label:** Comp3 Utilities
- **Toggle Mock Data:** "Full Municipal Services"

### comp3-year-built
- **Label:** Comp3 Year Built
- **Toggle Mock Data:** "1980"

### comp3-zoning
- **Label:** Comp3 Zoning
- **Toggle Mock Data:** "R3"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 56

**Fields:** 40

### comp4-address
- **Label:** Address
- **Toggle Mock Data:** "1030 Parr Hill Dr"

### comp4-analysis-price
- **Label:** Comp4 Analysis Price
- **Toggle Mock Data:** "$2,055,056"

### comp4-buildings
- **Label:** Comp4 Buildings
- **Toggle Mock Data:** "2 Buildings, 3 Floors"

### comp4-buyer
- **Label:** Comp4 Buyer
- **Toggle Mock Data:** "Epiphany Group"

### comp4-cap-rate
- **Label:** Comp4 Cap Rate
- **Toggle Mock Data:** "6.24%"

### comp4-city-state-zip
- **Label:** Comp4 City State Zip
- **Toggle Mock Data:** "North Battleford, SK S9A 3L5"

### comp4-county
- **Label:** Comp4 County
- **Toggle Mock Data:** "North Battleford"

### comp4-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "47,916"

### comp4-landarea
- **Label:** Comp4 Land Area
- **Toggle Mock Data:** "1.932 Acres (31,977 SF)"

### comp4-laundry
- **Label:** Comp4 Laundry
- **Toggle Mock Data:** "On-Site"

### comp4-map
- **Label:** Comp4 Map
- **Toggle Mock Data:** "[Location Map]"

### comp4-market-conditions
- **Label:** Comp4 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp4-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside Flats 1"

### comp4-noi
- **Label:** NOI
- **Toggle Mock Data:** "$189,400"

### comp4-nra
- **Label:** Comp4 NRA
- **Toggle Mock Data:** "15,000 SF"

### comp4-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp4-parking
- **Label:** Comp4 Parking
- **Toggle Mock Data:** "Surface"

### comp4-parking-type
- **Label:** Comp4 Parking Type
- **Toggle Mock Data:** "Surface"

### comp4-photo
- **Label:** Comp4 Photo
- **Toggle Mock Data:** "[Property Photo]"

### comp4-price-per-unit
- **Label:** Comp4 Price Per Unit
- **Toggle Mock Data:** "$198,085"

### comp4-property-type
- **Label:** Comp4 Property Type
- **Toggle Mock Data:** "Multi-Family, Walk-Up"

### comp4-remarks
- **Label:** Comp4 Remarks
- **Toggle Mock Data:** "Macro Properties Toronto sold this 143-unit portfolio to Epiphany Group for $14,000,000 or $97,902.09 per unit. The buyer was drawn to purchasing these properties to diversify and strengthen their inv..."

### comp4-renttype
- **Label:** Comp4 Rent Type
- **Toggle Mock Data:** "Market"

### comp4-rights-transferred
- **Label:** Comp4 Rights Transferred
- **Toggle Mock Data:** "Fee Simple"

### comp4-sale-date
- **Label:** Comp4 Sale Date
- **Toggle Mock Data:** "2023-05-19"

### comp4-sale-price
- **Label:** Comp4 Sale Price
- **Toggle Mock Data:** "$3,650,000"

### comp4-security-features
- **Label:** Comp4 Security Features
- **Toggle Mock Data:** "Deck Railing, Deadbolts, Exterior Lighting, Secured Entry"

### comp4-seller
- **Label:** Comp4 Seller
- **Toggle Mock Data:** "Macro Properties Toronto"

### comp4-submarket
- **Label:** Comp4 Submarket
- **Toggle Mock Data:** "Saskatchewan Area"

### comp4-transaction-status
- **Label:** Comp4 Transaction Status
- **Toggle Mock Data:** "Closed"

### comp4-unit-amenities
- **Label:** Comp4 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove"

### comp4-unitmix-avgsize
- **Label:** Comp4 Unit Mix Avg Size
- **Toggle Mock Data:** "0 SF"

### comp4-unitmix-count
- **Label:** Comp4 Unit Mix Count
- **Toggle Mock Data:** "24"

### comp4-unitmix-type
- **Label:** Comp4 Unit Mix Type
- **Toggle Mock Data:** "1 Bed / 1 Bath"

### comp4-units
- **Label:** Units
- **Toggle Mock Data:** "47"

### comp4-utilities
- **Label:** Comp4 Utilities
- **Toggle Mock Data:** "Full Municipal Services"

### comp4-year-built
- **Label:** Comp4 Year Built
- **Toggle Mock Data:** "1980"

### comp4-zoning
- **Label:** Comp4 Zoning
- **Toggle Mock Data:** "R3"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 57

**Fields:** 40

### comp5-address
- **Label:** Address
- **Toggle Mock Data:** "1030 Parr Hill Dr"

### comp5-analysis-price
- **Label:** Comp5 Analysis Price
- **Toggle Mock Data:** "$2,055,056"

### comp5-buildings
- **Label:** Comp5 Buildings
- **Toggle Mock Data:** "2 Buildings, 3 Floors"

### comp5-buyer
- **Label:** Comp5 Buyer
- **Toggle Mock Data:** "Epiphany Group"

### comp5-cap-rate
- **Label:** Comp5 Cap Rate
- **Toggle Mock Data:** "5.92%"

### comp5-city-state-zip
- **Label:** Comp5 City State Zip
- **Toggle Mock Data:** "North Battleford, SK S9A 3L5"

### comp5-county
- **Label:** Comp5 County
- **Toggle Mock Data:** "North Battleford"

### comp5-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "52,708"

### comp5-landarea
- **Label:** Comp5 Land Area
- **Toggle Mock Data:** "1.932 Acres (31,977 SF)"

### comp5-laundry
- **Label:** Comp5 Laundry
- **Toggle Mock Data:** "On-Site"

### comp5-map
- **Label:** Comp5 Map
- **Toggle Mock Data:** "[Location Map]"

### comp5-market-conditions
- **Label:** Comp5 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp5-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside Flats 2"

### comp5-noi
- **Label:** NOI
- **Toggle Mock Data:** "$214,375"

### comp5-nra
- **Label:** Comp5 NRA
- **Toggle Mock Data:** "15,000 SF"

### comp5-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp5-parking
- **Label:** Comp5 Parking
- **Toggle Mock Data:** "Surface"

### comp5-parking-type
- **Label:** Comp5 Parking Type
- **Toggle Mock Data:** "Surface"

### comp5-photo
- **Label:** Comp5 Photo
- **Toggle Mock Data:** "[Property Photo]"

### comp5-price-per-unit
- **Label:** Comp5 Price Per Unit
- **Toggle Mock Data:** "$214,375"

### comp5-property-type
- **Label:** Comp5 Property Type
- **Toggle Mock Data:** "Multi-Family, Walk-Up"

### comp5-remarks
- **Label:** Comp5 Remarks
- **Toggle Mock Data:** "Macro Properties Toronto sold this 143-unit portfolio to Epiphany Group for $14,000,000 or $97,902.09 per unit. The buyer was drawn to purchasing these properties to diversify and strengthen their inv..."

### comp5-renttype
- **Label:** Comp5 Rent Type
- **Toggle Mock Data:** "Market"

### comp5-rights-transferred
- **Label:** Comp5 Rights Transferred
- **Toggle Mock Data:** "Fee Simple"

### comp5-sale-date
- **Label:** Comp5 Sale Date
- **Toggle Mock Data:** "2023-05-19"

### comp5-sale-price
- **Label:** Comp5 Sale Price
- **Toggle Mock Data:** "$4,200,000"

### comp5-security-features
- **Label:** Comp5 Security Features
- **Toggle Mock Data:** "Deck Railing, Deadbolts, Exterior Lighting, Secured Entry"

### comp5-seller
- **Label:** Comp5 Seller
- **Toggle Mock Data:** "Macro Properties Toronto"

### comp5-submarket
- **Label:** Comp5 Submarket
- **Toggle Mock Data:** "Saskatchewan Area"

### comp5-transaction-status
- **Label:** Comp5 Transaction Status
- **Toggle Mock Data:** "Closed"

### comp5-unit-amenities
- **Label:** Comp5 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove"

### comp5-unitmix-avgsize
- **Label:** Comp5 Unit Mix Avg Size
- **Toggle Mock Data:** "0 SF"

### comp5-unitmix-count
- **Label:** Comp5 Unit Mix Count
- **Toggle Mock Data:** "24"

### comp5-unitmix-type
- **Label:** Comp5 Unit Mix Type
- **Toggle Mock Data:** "1 Bed / 1 Bath"

### comp5-units
- **Label:** Units
- **Toggle Mock Data:** "52"

### comp5-utilities
- **Label:** Comp5 Utilities
- **Toggle Mock Data:** "Full Municipal Services"

### comp5-year-built
- **Label:** Comp5 Year Built
- **Toggle Mock Data:** "1980"

### comp5-zoning
- **Label:** Comp5 Zoning
- **Toggle Mock Data:** "R3"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 58

**Fields:** 176

### calc-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$6,840"

### city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### comp1-access
- **Label:** Access Rating
- **Toggle Mock Data:** "Average"

### comp1-address
- **Label:** Address
- **Toggle Mock Data:** "1501 102 St"

### comp1-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$116,635"

### comp1-appeal
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### comp1-cap-rate
- **Label:** Comp1 Cap Rate
- **Toggle Mock Data:** "5.98%"

### comp1-city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### comp1-condition
- **Label:** Condition Rating
- **Toggle Mock Data:** "Average"

### comp1-expenditures-after
- **Label:** Expenditures After Sale
- **Toggle Mock Data:** "$0"

### comp1-exposure
- **Label:** Exposure Rating
- **Toggle Mock Data:** "Average"

### comp1-financing
- **Label:** Financing
- **Toggle Mock Data:** "Cash To Seller"

### comp1-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "22,754"

### comp1-location
- **Label:** Location Rating
- **Toggle Mock Data:** "Average"

### comp1-market-conditions
- **Label:** Market Conditions
- **Toggle Mock Data:** "2024-06-17"

### comp1-name
- **Label:** Property Name
- **Toggle Mock Data:** "Heritage House"

### comp1-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$7,780.02"

### comp1-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp1-parking-type
- **Label:** Comp1 Parking Type
- **Toggle Mock Data:** "Surface"

### comp1-postal-code
- **Label:** Postal Code
- **Toggle Mock Data:** "S9A 2A1"

### comp1-price-per-unit
- **Label:** Comp1 Price Per Unit
- **Toggle Mock Data:** "$129,891"

### comp1-proj-amenities
- **Label:** Comp1 Project Amenities
- **Toggle Mock Data:** "Parking"

### comp1-property-rights
- **Label:** Property Rights
- **Toggle Mock Data:** "Fee Simple"

### comp1-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp1-quality
- **Label:** Quality Rating
- **Toggle Mock Data:** "Average"

### comp1-sale-conditions
- **Label:** Conditions of Sale
- **Toggle Mock Data:** "Arm"

### comp1-sale-price
- **Label:** Comp1 Sale Price
- **Toggle Mock Data:** "$3,750,000"

### comp1-sale-status
- **Label:** Sale Status
- **Toggle Mock Data:** "Closed"

### comp1-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "(10%)"

### comp1-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp1-unit-amenities
- **Label:** Comp1 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove, Refrigerator"

### comp1-units
- **Label:** Units
- **Toggle Mock Data:** "24"

### comp1-year
- **Label:** Year Built
- **Toggle Mock Data:** "2006"

### comp2-access
- **Label:** Access Rating
- **Toggle Mock Data:** "Average"

### comp2-address
- **Label:** Address
- **Toggle Mock Data:** "1070-1092 Ferguson Ave"

### comp2-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$116,627"

### comp2-appeal
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### comp2-cap-rate
- **Label:** Comp2 Cap Rate
- **Toggle Mock Data:** "5.98%"

### comp2-city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### comp2-condition
- **Label:** Condition Rating
- **Toggle Mock Data:** "Average"

### comp2-expenditures-after
- **Label:** Expenditures After Sale
- **Toggle Mock Data:** "$0"

### comp2-exposure
- **Label:** Exposure Rating
- **Toggle Mock Data:** "Average"

### comp2-financing
- **Label:** Financing
- **Toggle Mock Data:** "Cash To Seller"

### comp2-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "33,309"

### comp2-location
- **Label:** Location Rating
- **Toggle Mock Data:** "Average"

### comp2-market-conditions
- **Label:** Comp2 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp2-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside View Apartments"

### comp2-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$6,111.00"

### comp2-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp2-parking-type
- **Label:** Comp2 Parking Type
- **Toggle Mock Data:** "Surface"

### comp2-postal-code
- **Label:** Postal Code
- **Toggle Mock Data:** "S9A 2C3"

### comp2-price-per-unit
- **Label:** Comp2 Price Per Unit
- **Toggle Mock Data:** "$102,019"

### comp2-proj-amenities
- **Label:** Project Amenities
- **Toggle Mock Data:** "No Amenities"

### comp2-property-rights
- **Label:** Property Rights
- **Toggle Mock Data:** "Fee Simple"

### comp2-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp2-quality
- **Label:** Quality Rating
- **Toggle Mock Data:** "Average"

### comp2-sale-conditions
- **Label:** Conditions of Sale
- **Toggle Mock Data:** "Arm"

### comp2-sale-price
- **Label:** Comp2 Sale Price
- **Toggle Mock Data:** "$2,650,000"

### comp2-sale-status
- **Label:** Sale Status
- **Toggle Mock Data:** "Closed"

### comp2-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "14%"

### comp2-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp2-unit-amenities
- **Label:** Comp2 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove, Refrigerator"

### comp2-units
- **Label:** Units
- **Toggle Mock Data:** "45"

### comp2-year
- **Label:** Year Built
- **Toggle Mock Data:** "2002"

### comp3-access
- **Label:** Access Rating
- **Toggle Mock Data:** "Average"

### comp3-address
- **Label:** Address
- **Toggle Mock Data:** "1901 Pearson Ave"

### comp3-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$116,629"

### comp3-appeal
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### comp3-cap-rate
- **Label:** Comp3 Cap Rate
- **Toggle Mock Data:** "5.99%"

### comp3-city
- **Label:** City
- **Toggle Mock Data:** "North Battleford"

### comp3-condition
- **Label:** Condition Rating
- **Toggle Mock Data:** "Average"

### comp3-expenditures-after
- **Label:** Expenditures After Sale
- **Toggle Mock Data:** "$0"

### comp3-exposure
- **Label:** Exposure Rating
- **Toggle Mock Data:** "Average"

### comp3-financing
- **Label:** Financing
- **Toggle Mock Data:** "Cash to Seller"

### comp3-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "15,000"

### comp3-location
- **Label:** Location Rating
- **Toggle Mock Data:** "Average"

### comp3-market-conditions
- **Label:** Comp3 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp3-name
- **Label:** Property Name
- **Toggle Mock Data:** "Woodland Estates"

### comp3-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$5,129.00"

### comp3-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp3-parking-type
- **Label:** Comp3 Parking Type
- **Toggle Mock Data:** "Surface"

### comp3-postal-code
- **Label:** Postal Code
- **Toggle Mock Data:** "S9A 3L5"

### comp3-price-per-unit
- **Label:** Comp3 Price Per Unit
- **Toggle Mock Data:** "$85,627"

### comp3-proj-amenities
- **Label:** Project Amenities
- **Toggle Mock Data:** "Guest Parking"

### comp3-property-rights
- **Label:** Property Rights
- **Toggle Mock Data:** "Fee Simple"

### comp3-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp3-quality
- **Label:** Quality Rating
- **Toggle Mock Data:** "Average"

### comp3-sale-conditions
- **Label:** Conditions of Sale
- **Toggle Mock Data:** "Arm"

### comp3-sale-price
- **Label:** Comp3 Sale Price
- **Toggle Mock Data:** "$1,500,000"

### comp3-sale-status
- **Label:** Sale Status
- **Toggle Mock Data:** "Closed"

### comp3-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "36%"

### comp3-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp3-unit-amenities
- **Label:** Comp3 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove"

### comp3-units
- **Label:** Units
- **Toggle Mock Data:** "24"

### comp3-year
- **Label:** Year Built
- **Toggle Mock Data:** "1980"

### comp4-access
- **Label:** Access Rating
- **Toggle Mock Data:** "Average"

### comp4-address
- **Label:** Address
- **Toggle Mock Data:** "1030 Parr Hill Dr"

### comp4-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$111,914"

### comp4-appeal
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### comp4-cap-rate
- **Label:** Comp4 Cap Rate
- **Toggle Mock Data:** "6.24%"

### comp4-city
- **Label:** City
- **Toggle Mock Data:** "Martensville"

### comp4-condition
- **Label:** Condition Rating
- **Toggle Mock Data:** "Average"

### comp4-expenditures-after
- **Label:** Expenditures After Sale
- **Toggle Mock Data:** "$0"

### comp4-exposure
- **Label:** Exposure Rating
- **Toggle Mock Data:** "Average"

### comp4-financing
- **Label:** Financing
- **Toggle Mock Data:** "Cash to Seller"

### comp4-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "47,916"

### comp4-location
- **Label:** Location Rating
- **Toggle Mock Data:** "Average"

### comp4-market-conditions
- **Label:** Comp4 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp4-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside Flats 1"

### comp4-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$12,389.00"

### comp4-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp4-parking-type
- **Label:** Comp4 Parking Type
- **Toggle Mock Data:** "Surface"

### comp4-postal-code
- **Label:** Postal Code
- **Toggle Mock Data:** "S0K 2I1"

### comp4-price-per-unit
- **Label:** Comp4 Price Per Unit
- **Toggle Mock Data:** "$198,085"

### comp4-proj-amenities
- **Label:** Project Amenities
- **Toggle Mock Data:** "Elevators, Guest Parking, Storage Units"

### comp4-property-rights
- **Label:** Property Rights
- **Toggle Mock Data:** "Fee Simple"

### comp4-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp4-quality
- **Label:** Quality Rating
- **Toggle Mock Data:** "Average"

### comp4-sale-conditions
- **Label:** Conditions of Sale
- **Toggle Mock Data:** "Arm"

### comp4-sale-price
- **Label:** Comp4 Sale Price
- **Toggle Mock Data:** "$3,650,000"

### comp4-sale-status
- **Label:** Sale Status
- **Toggle Mock Data:** "Closed"

### comp4-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "(44%)"

### comp4-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp4-unit-amenities
- **Label:** Comp4 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove"

### comp4-units
- **Label:** Units
- **Toggle Mock Data:** "47"

### comp4-year
- **Label:** Year Built
- **Toggle Mock Data:** "2016"

### comp5-access
- **Label:** Access Rating
- **Toggle Mock Data:** "Average"

### comp5-address
- **Label:** Address
- **Toggle Mock Data:** "1030 Parr Hill Dr"

### comp5-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$118,100"

### comp5-appeal
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### comp5-cap-rate
- **Label:** Comp5 Cap Rate
- **Toggle Mock Data:** "5.92%"

### comp5-city
- **Label:** City
- **Toggle Mock Data:** "Martensville"

### comp5-condition
- **Label:** Condition Rating
- **Toggle Mock Data:** "Average"

### comp5-expenditures-after
- **Label:** Expenditures After Sale
- **Toggle Mock Data:** "$0"

### comp5-exposure
- **Label:** Exposure Rating
- **Toggle Mock Data:** "Average"

### comp5-financing
- **Label:** Financing
- **Toggle Mock Data:** "Cash to Seller"

### comp5-gba
- **Label:** GBA (SF)
- **Toggle Mock Data:** "52,708"

### comp5-location
- **Label:** Location Rating
- **Toggle Mock Data:** "Average"

### comp5-market-conditions
- **Label:** Comp5 Market Conditions
- **Toggle Mock Data:** "Arm"

### comp5-name
- **Label:** Property Name
- **Toggle Mock Data:** "Parkside Flats 2"

### comp5-noi-per-unit
- **Label:** NOI/Unit
- **Toggle Mock Data:** "$12,891.00"

### comp5-occupancy
- **Label:** Occupancy %
- **Toggle Mock Data:** "100.0%"

### comp5-parking-type
- **Label:** Comp5 Parking Type
- **Toggle Mock Data:** "Surface"

### comp5-postal-code
- **Label:** Postal Code
- **Toggle Mock Data:** "S0K 2I1"

### comp5-price-per-unit
- **Label:** Comp5 Price Per Unit
- **Toggle Mock Data:** "$214,375"

### comp5-proj-amenities
- **Label:** Project Amenities
- **Toggle Mock Data:** "Elevators, Guest Parking, Storage Units"

### comp5-property-rights
- **Label:** Property Rights
- **Toggle Mock Data:** "Fee Simple"

### comp5-province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### comp5-quality
- **Label:** Quality Rating
- **Toggle Mock Data:** "Average"

### comp5-sale-conditions
- **Label:** Conditions of Sale
- **Toggle Mock Data:** "Arm"

### comp5-sale-price
- **Label:** Comp5 Sale Price
- **Toggle Mock Data:** "$4,200,000"

### comp5-sale-status
- **Label:** Sale Status
- **Toggle Mock Data:** "Closed"

### comp5-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "(45%)"

### comp5-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp5-unit-amenities
- **Label:** Comp5 Unit Amenities
- **Toggle Mock Data:** "Air Conditioning, Range/Stove"

### comp5-units
- **Label:** Units
- **Toggle Mock Data:** "52"

### comp5-year
- **Label:** Year Built
- **Toggle Mock Data:** "2019"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### occupancy-rate
- **Label:** Occupancy Rate (%)
- **Toggle Mock Data:** "100.00%"

### postal-code
- **Label:** Postal Code
- **Toggle Mock Data:** "S9A 2E5"

### property-name
- **Label:** Property Name
- **Toggle Mock Data:** "Acorn Apartments"

### province
- **Label:** Province
- **Toggle Mock Data:** "SK"

### street-address
- **Label:** Street Address
- **Toggle Mock Data:** "1101, 1121 109 St"

### subject-access-rating
- **Label:** Access Rating
- **Toggle Mock Data:** "Average"

### subject-appeal-rating
- **Label:** Appeal Rating
- **Toggle Mock Data:** "Average"

### subject-condition
- **Label:** Condition
- **Toggle Mock Data:** "Average"

### subject-exposure-rating
- **Label:** Exposure Rating
- **Toggle Mock Data:** "Average"

### subject-gba
- **Label:** Gross Building Area (SF)
- **Toggle Mock Data:** "10,204"

### subject-location-rating
- **Label:** Location Rating
- **Toggle Mock Data:** "Average"

### subject-parking
- **Label:** Parking Ratio
- **Toggle Mock Data:** "1.1 / Unit"

### subject-proj-amenities
- **Label:** Project Amenities
- **Toggle Mock Data:** "Guest Parking"

### subject-quality-rating
- **Label:** Quality Rating
- **Toggle Mock Data:** "average"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-unit-amenities
- **Label:** Unit Amenities
- **Toggle Mock Data:** "Deck/Patio, Range/Stove, Refrigerator"

### subject-units
- **Label:** Number of Units
- **Toggle Mock Data:** "16"

### subject-year
- **Label:** Year Built
- **Toggle Mock Data:** "1970 (1970 Weighted)"

---

## Page 59

**Fields:** 5

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### sca-adjusted-value-high
- **Label:** SCA Adjusted Value High
- **Toggle Mock Data:** "$118,100"

### sca-adjusted-value-low
- **Label:** SCA Adjusted Value Low
- **Toggle Mock Data:** "$111,914"

### sca-concluded-value-per-unit
- **Label:** Concluded Value/Unit
- **Toggle Mock Data:** "$112,500"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 60

**Fields:** 70

### comp1-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$116,635"

### comp1-gross-adj
- **Label:** Gross Adjustment %
- **Toggle Mock Data:** "10%"

### comp1-net-adj
- **Label:** Net Adjustment %
- **Toggle Mock Data:** "(10%)"

### comp1-price-per-unit
- **Label:** Comp1 Price Per Unit
- **Toggle Mock Data:** "$129,891"

### comp1-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "(10%)"

### comp1-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp1-trans-adj-price
- **Label:** Transactional Adj Price
- **Toggle Mock Data:** "$129,891"

### comp2-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$116,627"

### comp2-gross-adj
- **Label:** Gross Adjustment %
- **Toggle Mock Data:** "14%"

### comp2-net-adj
- **Label:** Net Adjustment %
- **Toggle Mock Data:** "14%"

### comp2-price-per-unit
- **Label:** Comp2 Price Per Unit
- **Toggle Mock Data:** "$102,019"

### comp2-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "14%"

### comp2-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp2-trans-adj-price
- **Label:** Transactional Adj Price
- **Toggle Mock Data:** "$102,019"

### comp3-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$116,629"

### comp3-gross-adj
- **Label:** Gross Adjustment %
- **Toggle Mock Data:** "36%"

### comp3-net-adj
- **Label:** Net Adjustment %
- **Toggle Mock Data:** "36%"

### comp3-price-per-unit
- **Label:** Comp3 Price Per Unit
- **Toggle Mock Data:** "$85,627"

### comp3-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "36%"

### comp3-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp3-trans-adj-price
- **Label:** Transactional Adj Price
- **Toggle Mock Data:** "$85,627"

### comp4-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$111,914"

### comp4-gross-adj
- **Label:** Gross Adjustment %
- **Toggle Mock Data:** "44%"

### comp4-net-adj
- **Label:** Net Adjustment %
- **Toggle Mock Data:** "(44%)"

### comp4-price-per-unit
- **Label:** Comp4 Price Per Unit
- **Toggle Mock Data:** "$198,085"

### comp4-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "(44%)"

### comp4-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp4-trans-adj-price
- **Label:** Transactional Adj Price
- **Toggle Mock Data:** "$198,085"

### comp5-adj-price-per-unit
- **Label:** Adjusted Price/Unit
- **Toggle Mock Data:** "$118,100"

### comp5-gross-adj
- **Label:** Gross Adjustment %
- **Toggle Mock Data:** "45%"

### comp5-net-adj
- **Label:** Net Adjustment %
- **Toggle Mock Data:** "(45%)"

### comp5-price-per-unit
- **Label:** Comp5 Price Per Unit
- **Toggle Mock Data:** "$214,375"

### comp5-total-phys-adj
- **Label:** Total Physical Adj %
- **Toggle Mock Data:** "(45%)"

### comp5-total-trans-adj
- **Label:** Total Transactional Adj %
- **Toggle Mock Data:** "0%"

### comp5-trans-adj-price
- **Label:** Transactional Adj Price
- **Toggle Mock Data:** "$214,375"

### dca-avg-final-price
- **Label:** Avg Final Price
- **Toggle Mock Data:** "$115,981"

### dca-avg-gross-adj
- **Label:** Avg Gross Adj %
- **Toggle Mock Data:** "30%"

### dca-avg-net-adj
- **Label:** Avg Net Adj %
- **Toggle Mock Data:** "(10%)"

### dca-avg-phys-adj
- **Label:** Avg Physical Adj %
- **Toggle Mock Data:** "(10%)"

### dca-avg-price-per-unit
- **Label:** Avg Price/Unit
- **Toggle Mock Data:** "$145,999"

### dca-avg-trans-adj
- **Label:** Avg Trans Adj %
- **Toggle Mock Data:** "0%"

### dca-avg-trans-adj-price
- **Label:** Avg Trans Adj Price
- **Toggle Mock Data:** "$145,999"

### dca-high-final-price
- **Label:** High Final Price
- **Toggle Mock Data:** "$118,100"

### dca-high-gross-adj
- **Label:** High Gross Adj %
- **Toggle Mock Data:** "45%"

### dca-high-net-adj
- **Label:** High Net Adj %
- **Toggle Mock Data:** "36%"

### dca-high-phys-adj
- **Label:** High Physical Adj %
- **Toggle Mock Data:** "36%"

### dca-high-price-per-unit
- **Label:** High Price/Unit
- **Toggle Mock Data:** "$214,375"

### dca-high-trans-adj
- **Label:** High Trans Adj %
- **Toggle Mock Data:** "0%"

### dca-high-trans-adj-price
- **Label:** High Trans Adj Price
- **Toggle Mock Data:** "$214,375"

### dca-low-final-price
- **Label:** Low Final Price
- **Toggle Mock Data:** "$111,914"

### dca-low-gross-adj
- **Label:** Low Gross Adj %
- **Toggle Mock Data:** "10%"

### dca-low-net-adj
- **Label:** Low Net Adj %
- **Toggle Mock Data:** "(45%)"

### dca-low-phys-adj
- **Label:** Low Physical Adj %
- **Toggle Mock Data:** "(45%)"

### dca-low-price-per-unit
- **Label:** Low Price/Unit
- **Toggle Mock Data:** "$85,627"

### dca-low-trans-adj
- **Label:** Low Trans Adj %
- **Toggle Mock Data:** "0%"

### dca-low-trans-adj-price
- **Label:** Low Trans Adj Price
- **Toggle Mock Data:** "$85,627"

### dca-med-final-price
- **Label:** Median Final Price
- **Toggle Mock Data:** "$116,629"

### dca-med-gross-adj
- **Label:** Median Gross Adj %
- **Toggle Mock Data:** "36%"

### dca-med-net-adj
- **Label:** Median Net Adj %
- **Toggle Mock Data:** "(10%)"

### dca-med-phys-adj
- **Label:** Median Physical Adj %
- **Toggle Mock Data:** "(10%)"

### dca-med-price-per-unit
- **Label:** Median Price/Unit
- **Toggle Mock Data:** "$129,891"

### dca-med-trans-adj
- **Label:** Median Trans Adj %
- **Toggle Mock Data:** "0%"

### dca-med-trans-adj-price
- **Label:** Median Trans Adj Price
- **Toggle Mock Data:** "$129,891"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### sca-concluded-value-per-unit
- **Label:** Concluded Value/Unit
- **Toggle Mock Data:** "$112,500"

### sca-indicated-value
- **Label:** SCA Indicated Value
- **Toggle Mock Data:** "$1,800,000"

### sca-indicated-value-rounded
- **Label:** SCA Indicated Value (Rounded)
- **Toggle Mock Data:** "$1,800,000"

### sca-value-per-sf
- **Label:** SCA Value/SF
- **Toggle Mock Data:** "$176"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### subject-units
- **Label:** Number of Units
- **Toggle Mock Data:** "16"

---

## Page 61

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 62

**Fields:** 14

### calc-cap-rate
- **Label:** Cap Rate (%)
- **Toggle Mock Data:** "6.25%"

### calc-indicated-value
- **Label:** Indicated Value
- **Toggle Mock Data:** "$1,800,000"

### calc-noi
- **Label:** Net Operating Income
- **Toggle Mock Data:** "$111,771"

### calc-noi-per-sf
- **Label:** NOI/SF
- **Toggle Mock Data:** "$10.95"

### calc-value-per-sf
- **Label:** Value/SF
- **Toggle Mock Data:** "$176"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### property-rights
- **Label:** Property Rights
- **Toggle Mock Data:** "Fee Simple Estate"

### recon-effective-date
- **Label:** Effective Date
- **Toggle Mock Data:** "October 17, 2025"

### recon-final-value
- **Label:** Final Value
- **Toggle Mock Data:** "$1,800,000"

### recon-final-value-per-sf
- **Label:** Final Value/SF
- **Toggle Mock Data:** "$176"

### sca-indicated-value
- **Label:** SCA Indicated Value
- **Toggle Mock Data:** "$1,800,000"

### sca-value-per-sf
- **Label:** SCA Value/SF
- **Toggle Mock Data:** "$176"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### value-scenario
- **Label:** Value Scenario
- **Toggle Mock Data:** "AS STABILIZED"

---

## Page 63

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 64

**Fields:** 11

### appraiser-aic
- **Label:** AIC Number
- **Toggle Mock Data:** "902097"

### appraiser-email
- **Label:** Appraiser Email
- **Toggle Mock Data:** "chris.chornohos@valta.ca"

### appraiser-name-credentials
- **Label:** Appraiser Name & Credentials
- **Toggle Mock Data:** "Chris Chornohos, AACI, P.App, MRICS"

### appraiser-title
- **Label:** Appraiser Title
- **Toggle Mock Data:** "Founder"

### effective-date
- **Label:** Effective Date
- **Toggle Mock Data:** "October 17, 2025"

### exposure-time
- **Label:** Exposure Time
- **Toggle Mock Data:** "Six Months"

### final-value-conclusion
- **Label:** Final Value Conclusion
- **Toggle Mock Data:** "$1,800,000"

### interest-appraised
- **Label:** Interest Appraised
- **Toggle Mock Data:** "Fee Simple Estate"

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

### valuation-scenario
- **Label:** Valuation Scenario
- **Toggle Mock Data:** "As Stabilized"

---

## Page 65

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 66

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 67

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 68

**Fields:** 0

---

## Page 69

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 70

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 71

**Fields:** 2

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Page 72

**Fields:** 14

### ${fieldId
- **Label:** *(no label)*
- **Toggle Mock Data:** *(none)*

### appraiser-aic
- **Label:** AIC Number
- **Toggle Mock Data:** "902097"

### appraiser-bio-paragraph1
- **Label:** Appraiser Bio Paragraph 1
- **Toggle Mock Data:** "Chris Chornohos is the founder of Valta Property Valuations Ltd., a boutique commercial real estate appraisal firm based in Calgary, Alberta. With over 15 years of experience in commercial real estate..."

### appraiser-bio-paragraph2
- **Label:** Appraiser Bio Paragraph 2
- **Toggle Mock Data:** "Chris holds the AACI (Accredited Appraiser Canadian Institute) designation from the Appraisal Institute of Canada and is a Member of the Royal Institution of Chartered Surveyors (MRICS). He is committ..."

### appraiser-designation
- **Label:** Appraiser Designation
- **Toggle Mock Data:** "AACI, P.App (Accredited Appraiser Canadian Institute)"

### appraiser-email
- **Label:** Appraiser Email
- **Toggle Mock Data:** "chris.chornohos@valta.ca"

### appraiser-headshot
- **Label:** Appraiser Headshot
- **Toggle Mock Data:** "[Appraiser Headshot]"

### appraiser-license
- **Label:** Appraiser License
- **Toggle Mock Data:** "Licensed in Alberta, Saskatchewan, Manitoba, British Columbia"

### appraiser-name-credentials
- **Label:** Appraiser Name & Credentials
- **Toggle Mock Data:** "Chris Chornohos, AACI, P.App, MRICS"

### appraiser-rics
- **Label:** RICS Membership Number
- **Toggle Mock Data:** "MRICS (Member, Royal Institution of Chartered Surveyors)"

### appraiser-title
- **Label:** Appraiser Title
- **Toggle Mock Data:** "Founder"

### field-id
- **Label:** *(no label)*
- **Toggle Mock Data:** *(none)*

### job-number
- **Label:** Valcre Job ID (VAL#)
- **Toggle Mock Data:** "VAL251012 - 1"

### subject-street
- **Label:** Street
- **Toggle Mock Data:** "1101, 1121 109 Street"

---

## Unknown

**Fields:** 6

### appraiser-aic
- **Label:** AIC Number
- **Toggle Mock Data:** "902097"

### appraiser-aic-number
- **Label:** AIC Member Number
- **Toggle Mock Data:** *(none)*

### client-company
- **Label:** Client Company
- **Toggle Mock Data:** *(none)*

### client-full-name
- **Label:** Client Full Name
- **Toggle Mock Data:** "Kenneth Engler"

### client-name
- **Label:** Client Name
- **Toggle Mock Data:** *(none)*

### client-organization
- **Label:** Organization
- **Toggle Mock Data:** "102109845 Saskatchewan Ltd."

---
