# Improvements Section Input Fields

These are the USER INPUT fields for the Report Builder Improvements Section.

**Loads via:** "Load Test Data" button in Improvements section of EditPanel
**Rule:** User enters these. Template displays them in the Building Description pages.

---

## Building Basics

Core building metrics and identification.

- **Year Built:** `year-built`  |  1981  |  Year of original construction
- **Building Class:** `building-class`  |  0  |  Property class rating
- **GBA:** `gba`  |  10,204  |  Gross building area (SF)
- **NRA:** `nra`  |  10,204  |  Net rentable area (SF)
- **Total Units:** `calc-total-units`  |  16  |  Number of residential units

---

## Building Design

Structural and design characteristics.

- **Functional Design:** `functional-design`  |  The building features a functional Walkup design with typical site coverage and adequate off-street parking.  |  Building design description

---

## Interior Finishes

Interior construction and finish details.

- **Ceilings:** `ceilings`  |  Textured drywall;  |  Ceiling finish type
- **Flooring:** `flooring`  |  Combination of carpet, tile, vinyl tile and laminate hard wood;  |  Floor finish types
- **Interior Walls:** `interior-walls`  |  Painted drywall;  |  Wall finish type
- **Interior Buildout:** `interior-buildout`  |  Standard rental finishes;  |  Overall interior finish level

---

## Unit Mix

Unit type breakdown and specifications.

- **Type 1 Name:** `calc-type1-name`  |  1 Bed / 1 Bath  |  Unit type 1 description
- **Type 1 Count:** `calc-type1-count`  |  4  |  Number of type 1 units
- **Type 1 SF:** `calc-type1-sf`  |  550  |  Average SF for type 1
- **Type 2 Name:** `calc-type2-name`  |  2 Bed / 1 Bath  |  Unit type 2 description
- **Type 2 Count:** `calc-type2-count`  |  12  |  Number of type 2 units
- **Type 2 SF:** `calc-type2-sf`  |  667  |  Average SF for type 2
- **Type 3 Count:** `calc-type3-count`  |  0  |  Number of type 3 units
- **Type 4 Count:** `calc-type4-count`  |  0  |  Number of type 4 units

---

## Parking

Parking facilities and ratios.

- **Parking Per Unit:** `calc-parking-per-unit`  |  0  |  Parking spaces per unit

---

## Property Condition

Condition assessment notes.

- **Asset Condition:** `asset-condition`  |    |  Property condition rating

---

## Field Mapping: Source to Improvements

Maps source fields from `northBattlefordTestData.ts` to improvements field IDs.

**Building Fields:**
- `year-built` → Year of construction
- `building-class` → Property classification
- `gba`, `nra` → Building areas
- `calc-total-units` → Unit count

**Design Fields:**
- `functional-design` → Building design description

**Finish Fields:**
- `ceilings`, `flooring`, `interior-walls` → Finish details
- `interior-buildout` → Overall finish level

**Unit Mix Fields:**
- `calc-type{N}-name` → Unit type descriptions
- `calc-type{N}-count` → Unit counts by type
- `calc-type{N}-sf` → Unit sizes by type

---

## Total Fields: 19

- Building Basics: 5
- Building Design: 1
- Interior Finishes: 4
- Unit Mix: 8
- Parking: 1
- Property Condition: 1

---

## Adding New Improvements Fields

1. Add field definition to `initializeMockData()` in `reportBuilderStore.ts`
2. Add mapping in `loadImprovementsTestData()` function
3. Update this documentation
4. Test with "Load Test Data" button
