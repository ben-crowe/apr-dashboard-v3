# Site Section Input Fields

These are the USER INPUT fields for the Report Builder Site Section.

**Loads via:** "Load Test Data" button in Site section of EditPanel
**Rule:** User enters these. Template displays them in the Site Description pages.

---

## Site Size & Configuration

Physical dimensions and layout of the site.

- **Site Size:** `site-size`  |  0  |  Total site area in SF
- **Site Coverage Ratio:** `site-coverage-ratio`  |  12.9% (3,138 SF footprint / 24,400 SF site)  |  Building to land ratio
- **Site Coverage Ratio Text:** `site-coverage-ratio-text`  |  12.9% (3,138 SF footprint / 24,400 SF site), which is within market standards...  |  Coverage ratio narrative
- **Land to Building Ratio:** `land-to-building`  |  2.39  |  Land to building ratio

---

## Site Information

General site description and characteristics.

- **Site Info:** `site-info`  |  The subject property consists of one parcel with a total site area of 24,400 SF...  |  Site description narrative
- **Site Conclusion:** `site-conclusion`  |  In conclusion, the site's physical characteristics appear to be supportive of the subject's current use...  |  Site analysis conclusion
- **Site Rating:** `site-rating`  |  Overall, the subject site is considered average as a multi-family site...  |  Site quality rating narrative

---

## Streets & Frontage

Street frontage and access information.

- **Street 1:** `site-street1`  |  109 Street  |  Primary street frontage
- **Street 2:** `site-street2`  |  11 Avenue  |  Secondary street frontage
- **Access:** `access`  |  average  |  Site accessibility rating
- **Exposure:** `exposure`  |  average  |  Site visibility/exposure rating

---

## Adjacent Properties

Land uses on adjacent properties.

- **Adjacent North:** `adjacent-north`  |  Residential  |  Use to north
- **Adjacent South:** `adjacent-south`  |  Residential  |  Use to south
- **Adjacent East:** `adjacent-east`  |  Residential  |  Use to east
- **Adjacent West:** `adjacent-west`  |  Residential  |  Use to west

---

## Site Improvements

Physical improvements on the site.

- **Site Improvements:** `site-improvements`  |  Gravel parking, sidewalks, and curbs;  |  Site improvement description
- **Landscaping:** `landscaping`  |  Landscaping around the building perimeter to consist of shrubs and trees...  |  Landscaping description
- **Lighting:** `lighting`  |  Various;  |  Site lighting description

---

## Flood & Environmental

Flood zone and environmental information.

- **Flood Zone:** `flood-zone`  |    |  Flood zone designation
- **Hazardous Text:** `hazardous-text`  |  Based on a review of an independent investigation to determine the presence or absence of toxins...  |  Environmental disclosure

---

## Easements & Title

Legal encumbrances and title matters.

- **Easements Text:** `easements-text`  |  A legal opinion regarding title information was not provided or commissioned...  |  Easements disclosure statement

---

## Site Plan Images

Site plan and boundary drawings.

- **Site Plan 1:** `img-site-plan-1`  |  /extracted-images/image44.png  |  Primary site plan image
- **Site Plan 1 Title:** `site-plan-1-title`  |  (optional)  |  Caption for site plan 1
- **Site Plan 2:** `img-site-plan-2`  |  /extracted-images/image45.png  |  Secondary site plan image
- **Site Plan 2 Title:** `site-plan-2-title`  |  (optional)  |  Caption for site plan 2

---

## Field Mapping: Source to Site

Maps source fields from `northBattlefordTestData.ts` to site field IDs.

**Size Fields:**
- `site-size` → Site area
- `site-coverage-ratio`, `land-to-building` → Coverage ratios

**Description Fields:**
- `site-info` → General site description
- `site-conclusion` → Site analysis conclusion
- `site-rating` → Quality rating

**Location Fields:**
- `site-street1`, `site-street2` → Street frontage
- `access`, `exposure` → Site accessibility
- `adjacent-north/south/east/west` → Adjacent uses

**Improvement Fields:**
- `site-improvements`, `landscaping`, `lighting` → Physical improvements

---

## Total Fields: 24

- Site Size & Configuration: 4
- Site Information: 3
- Streets & Frontage: 4
- Adjacent Properties: 4
- Site Improvements: 3
- Flood & Environmental: 2
- Easements & Title: 1
- Site Plan Images: 4

---

## Adding New Site Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadSiteTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button
