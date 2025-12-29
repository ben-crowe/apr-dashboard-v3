# REMAINING DATA NEEDS - Beyond Houski API

## Data Fields Still Needed (Not in Houski)

### 1. **Land vs Building Assessment Split**
- **What**: Separate land value vs improvement value
- **Where to get**: 
  - Calgary: `assessmentsearch.calgary.ca` (FREE)
  - Saskatoon: `apps4.saskatoon.ca/app/aSearch/` (FREE)
  - Edmonton: `maps.edmonton.ca/map/assessmentmap/` (FREE)
- **Method**: Web scraping public sites

### 2. **Official Flood Zone Designation**
- **What**: Government flood zone maps/designation
- **Where to get**:
  - Calgary: `maps.calgary.ca/FloodInfo/` (FREE)
  - Federal: `geoportal.gc.ca` flood mapping (FREE)
  - Provincial flood hazard maps (FREE)
- **Method**: Web scraping or screenshot capture

## Documents & Images Needed (Critical for Appraisals)

### 3. **Land Title/Certificate of Title** ⭐
- **What**: Official ownership document with encumbrances
- **Where to get**:
  - Alberta: SPIN2 (`spin2.gov.ab.ca`) - Chris HAS subscription!
  - Saskatchewan: ISC (`isc.ca`) - May have subscription
- **Method**: Automated login + PDF download (with Chris's credentials)
- **Contains**: Owner names, mortgage info, caveats, easements

### 4. **Survey Certificate/Real Property Report (RPR)** 
- **What**: Legal survey showing exact boundaries
- **Where to get**:
  - SPIN2 (if registered) - Sometimes attached to title
  - Municipal records (some cities)
  - Usually owner-provided
- **Method**: Check SPIN2 first, then request from owner

### 5. **Site Plan/Plot Plan Images**
- **What**: Visual building placement on lot
- **Where to get**:
  - Municipal GIS sites (FREE):
    - Calgary: `maps.calgary.ca`
    - Edmonton: `maps.edmonton.ca`
    - Saskatoon: `gis.saskatoon.ca`
- **Method**: Screenshot capture or API if available

### 6. **Zoning Map (Visual)**
- **What**: Color-coded zoning map of area
- **Where to get**:
  - Same municipal GIS sites (FREE)
  - City planning departments online
- **Method**: Screenshot capture with property highlighted

### 7. **Tax Assessment Notice (PDF)**
- **What**: Official municipal tax document
- **Where to get**:
  - Property owner portals (need account):
    - Calgary: `calgary.ca/propertytax`
    - Edmonton: `edmonton.ca/propertytax`
  - Sometimes on assessment search sites
- **Method**: Scrape if public, or owner provides

### 8. **Historical Sales Data/Comparables**
- **What**: Recent sales of similar properties
- **Where to get**:
  - Houski has some (`expand=listings`)
  - Provincial assessment sites (FREE)
  - CREA/MLS (restricted)
- **Method**: Combine Houski + public assessment data

### 9. **Building/Parcel Photos**
- **What**: Street view, aerial view, building photos
- **Where to get**:
  - Google Street View API
  - Municipal GIS aerial photos (FREE)
  - Google Earth Pro (FREE)
- **Method**: API calls or automated screenshots

### 10. **Permit History Documents**
- **What**: Actual permit PDFs (not just data)
- **Where to get**:
  - Municipal permit search sites:
    - Calgary: `calgarybuilding.com`
    - Edmonton: `edmonton.ca/permits`
- **Method**: Search + PDF download

## Priority Automation Targets

### HIGHEST VALUE (Chris has access):
1. **SPIN2 Land Titles** - Chris has subscription!
   - Automate login with his credentials
   - Search by address/legal description
   - Download PDF certificate of title
   - Extract key data (owner, mortgage, caveats)

2. **Municipal Assessment Sites** (FREE)
   - Scrape land vs building values
   - Get historical assessments
   - Download tax notices if available

3. **Municipal GIS/Maps** (FREE)
   - Capture zoning maps
   - Get aerial photos
   - Download site plans

### Perplexity Prompts Needed:

**For SPIN2 Automation:**
"How to automate SPIN2 land title searches in Alberta using Puppeteer or Playwright with existing login credentials? Need to search by address, download PDF certificates of title, and extract ownership data."

**For Municipal Scraping:**
"Best approach to scrape Calgary/Edmonton/Saskatoon property assessment websites for land value, building value, and tax history? Sites are assessmentsearch.calgary.ca, maps.edmonton.ca, apps4.saskatoon.ca"

**For Document Management:**
"How to build automated document collection system that gathers PDFs from multiple sources (SPIN2, municipal sites, GIS systems) and organizes them for commercial property appraisals?"

## Summary

**What we CAN automate (with Chris's credentials):**
- Land titles from SPIN2 ✅
- Assessment splits from municipal sites ✅
- Zoning/flood maps from GIS sites ✅
- Aerial/street photos from Google ✅
- Permit history from city sites ✅

**What remains manual:**
- Survey certificates (unless in SPIN2)
- Some tax notices (owner-specific)
- Interior building photos
- Confidential financial docs

**Next Steps:**
1. Test additional Houski fields
2. Build SPIN2 automation with Chris's login
3. Add municipal assessment scraping
4. Create document collection workflow