# Cover Section Input Fields

These are the USER INPUT fields for the Report Builder Cover Section.

**Loads via:** "Load Test Data" button in Cover section of EditPanel
**Rule:** User enters these. Template displays them on the cover page.

---

## Cover Photo

The main property image displayed on the report cover.

- **Cover Photo:** `cover-photo`  |  /extracted-images/image2.jpeg  |  Path to main cover image
- **Cover Photo Caption:** `cover-photo-caption`  |  1101, 1121 109 St - North Battleford Apartments  |  Caption displayed under cover photo

---

## Property Identification

Property details displayed prominently on cover.

- **Property Name:** `property-name`  |  North Battleford Apartments  |  Common name of property
- **Property Address:** `property-address`  |  1101, 1121 109 St  |  Street address
- **City:** `city`  |  North Battleford  |  City name
- **Province:** `province`  |  Saskatchewan  |  Province/State

---

## Report Identification

Report metadata for the cover page.

- **Report Date:** `report-date`  |  2025-11-20  |  Date report is issued
- **Effective Date:** `effective-date`  |  October 17, 2025  |  Valuation effective date
- **Job Number:** `job-number`  |  VAL251012 - 1  |  Valcre job reference

---

## Field Mapping: Source to Cover

Maps source fields from `northBattlefordTestData.ts` to cover field IDs.

**Photo Fields:**
- `cover-photo` → Cover page main image
- `cover-photo-caption` → Image caption text

**Property Fields:**
- `property-name` → Property title on cover
- `property-address` → Address line 1
- `city` → City name
- `province` → Province/State

**Report Fields:**
- `report-date` → Report date display
- `effective-date` → Valuation date display
- `job-number` → File reference

---

## Total Fields: 9

- Cover Photo: 2
- Property Identification: 4
- Report Identification: 3

---

## Adding New Cover Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadCoverTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button
