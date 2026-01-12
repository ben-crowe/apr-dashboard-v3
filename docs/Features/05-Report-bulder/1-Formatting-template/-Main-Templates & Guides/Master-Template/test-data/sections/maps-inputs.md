# Maps Section Input Fields

These are the USER INPUT fields for the Report Builder Maps Section.

**Loads via:** "Load Test Data" button in Maps section of EditPanel
**Rule:** User enters these. Template displays maps and location images.

---

## Aerial Maps

Primary aerial/satellite imagery of the property.

- **Aerial Map:** `img-map-aerial`  |  /extracted-images/image36.png  |  Main aerial view of property
- **Aerial 1 Title:** `img-map-aerial-1-title`  |  Aerial View  |  Caption for first aerial
- **Aerial 2 Title:** `img-map-aerial-2-title`  |  Site Boundary  |  Caption for second aerial

---

## Comparables Map

Map showing location of comparable sales.

- **Comparables Map:** `img-comparables-map`  |  /extracted-images/image38.png  |  Map with comp locations marked

---

## Site Plans

Detailed site plan drawings.

- **Site Plan 1:** `img-site-plan-1`  |  /extracted-images/image44.png  |  Primary site plan image
- **Site Plan 1 Title:** `site-plan-1-title`  |  (optional)  |  Caption for site plan 1
- **Site Plan 2:** `img-site-plan-2`  |  /extracted-images/image45.png  |  Secondary site plan image
- **Site Plan 2 Title:** `site-plan-2-title`  |  (optional)  |  Caption for site plan 2

---

## Zoning Map

Zoning district map for the subject property.

- **Zoning Map:** `img-zoning-map`  |  /extracted-images/image48.png  |  Official zoning map image

---

## Comparable Property Photos

Photos of each comparable sale property.

- **Comp 1 Photo:** `comp1-photo`  |  /extracted-images/image73.jpg  |  Comp 1 property photo
- **Comp 1 Map:** `comp1-map`  |  /extracted-images/image74.png  |  Comp 1 location map
- **Comp 1 Caption:** `comp1-photo-caption`  |  Comp 1 - 1551 107 St, North Battleford  |  Photo caption
- **Comp 2 Photo:** `comp2-photo`  |  /extracted-images/image75.jpg  |  Comp 2 property photo
- **Comp 2 Map:** `comp2-map`  |  /extracted-images/image76.png  |  Comp 2 location map
- **Comp 2 Caption:** `comp2-photo-caption`  |  Comp 2 - 10910 Winder Crescent  |  Photo caption
- **Comp 3 Photo:** `comp3-photo`  |  /extracted-images/image77.jpg  |  Comp 3 property photo
- **Comp 3 Map:** `comp3-map`  |  /extracted-images/image78.png  |  Comp 3 location map
- **Comp 3 Caption:** `comp3-photo-caption`  |  Comp 3 - 1901 Pearson Ave  |  Photo caption
- **Comp 4 Photo:** `comp4-photo`  |  /extracted-images/image79.png  |  Comp 4 property photo
- **Comp 4 Map:** `comp4-map`  |  /extracted-images/image80.png  |  Comp 4 location map
- **Comp 4 Caption:** `comp4-photo-caption`  |  Comp 4 - 1000 Chicken Hill Rd  |  Photo caption

---

## Field Mapping: Source to Maps

Maps source fields from `northBattlefordTestData.ts` to maps field IDs.

**Aerial Fields:**
- `img-map-aerial` → Primary aerial image
- `img-map-aerial-1-title` → First aerial caption
- `img-map-aerial-2-title` → Second aerial caption

**Comparables Map:**
- `img-comparables-map` → Comparables location map

**Site Plan Fields:**
- `img-site-plan-1`, `img-site-plan-2` → Site plan images
- `site-plan-1-title`, `site-plan-2-title` → Site plan captions

**Zoning:**
- `img-zoning-map` → Zoning district map

**Comp Photo Fields:**
- `comp{N}-photo` → Property photo for comp N
- `comp{N}-map` → Location map for comp N
- `comp{N}-photo-caption` → Caption for comp N

---

## Total Fields: 22

- Aerial Maps: 3
- Comparables Map: 1
- Site Plans: 4
- Zoning Map: 1
- Comparable Photos: 12 (3 per comp × 4 comps)

---

## Adding New Maps Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadMapsTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button
