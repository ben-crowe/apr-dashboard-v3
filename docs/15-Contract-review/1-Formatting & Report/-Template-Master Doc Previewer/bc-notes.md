
BC NOTEs Pg. 25.12.23

**DOCUMENTATION - MF Report Template System**

---

## SOURCE DOCUMENT

**File:** `VAL251012 - North Battleford Apt.docx`
**Path:** `/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/master-word doc/VAL251012 - North Battleford Apt.docx`

This is the reference appraisal report from Valcre. It contains:
- Boilerplate text with embedded field IDs (visible as SDT tags)
- Page layout and content placement
- Images (flattened in place, each with unique ID for location reference)
- Tables (flattened as images but each represents a structured data table with its own field IDs)

---

## SOURCE WORKBOOK

**File:** `VAL251012_-_North_Battleford_Apt.xlsm`
**Path:** `/docs/15-Contract-review/6-Source Reports & Workbook/Ref-1-North Battleford/`

This is the Valcre Excel workbook containing:
- 7,988 named ranges
- Individual sheets per table (DIRECTCAP, SALE1-5, SURVEY1-5, RENTROLL, etc.)
- Calc engine logic that feeds the Word doc template
- All numeric/tabular data that populates the report

---

## EXTRACTED IMAGES

**Folder:** `/docs/15-Contract-review/6-Source Reports & Workbook/Ref-1-North Battleford/extracted-images/`

**Manifest:** `IMAGE-MANIFEST.json`

Contains 89 images extracted from source document:
- `company-logo` → image1.png
- `cover-photo` → image2.jpeg
- `subject-photo-01` through `subject-photo-24` → image12-35.jpeg
- `map-regional`, `map-aerial`, `map-local` → image1.png, image36-37.png
- `comparables-map` → image38.png
- `comp1-photo`, `comp2-photo`, `comp3-photo` → image73, 75, 77.jpg
- `rental-comp1-photo`, `rental-comp2-photo` → image44-45.png
- `zoning-map`, `flood-map` → image48-49.png
- `chart-01`, `chart-02`, `chart-03` → image51-53.emf

The manifest JSON maps field IDs to image paths so the template can reference them.

---

## EXTRACTED TABLES

**Documentation:** [agent to fill - table structure MD file]
**Path:** [agent to fill]

Tables extracted from workbook with cell IDs mapped:
- Direct Capitalization (Page 49)
- Sales Comparison Grid (Pages 55-62)
- Rent Survey (Pages 37-43)
- Market Rent Analysis
- Rent Roll
- Operating Expense History

Each table has its own sheet in the workbook with named ranges that map to our template field IDs.

---

## FIELD ID CROSSWALK

**Original Valcre IDs:** `TEST-DATA-VALCRE-ORIGINAL.json`
**Our Kebab-Case IDs:** `TEST-DATA-TRANSFORMED-V2.json`
**Crosswalk Reference:** `valcre-crosswalk-verified.ts`

Valcre uses naming like `IA_DirCap_NOI` → We use `calc-noi`
Valcre uses naming like `SA1_1_SalePrice` → We use `comp1-sale-price`

---

## TEST DATA

**File:** `northBattlefordTestData.ts`
**Path:** `src/features/report-builder/data/northBattlefordTestData.ts`

Contains 1,020+ field values extracted from the source document and workbook. Used to simulate user input and demonstrate the report generator produces the same output as the reference report.

---

## OUTPUT - MF Report Template

**File:** `Report-MF-Template-Framed-v2.1.html`
**Path:** [app template location]

71 pages, 1,020 field placeholders in `{{kebab-case-id}}` format.
- All field IDs verified against registry (0 mismatches)
- All naming standardized to kebab-case
- Ready for integration with report builder

---

## FIELD REGISTRY

**File:** `fieldRegistry.ts`
**Path:** `src/features/report-builder/schema/fieldRegistry.ts`

1,643 field definitions including:
- Field ID (kebab-case)
- Label
- Section/subsection
- Valcre mapping reference
- Data type

Source of truth for all valid field IDs in the system.

---

*[Add more sections as needed]*

---

-----------
-----------


**DOCUMENTATION - MF Report Template System**

---

## SOURCE DOCUMENT

**File:** `VAL251012 - North Battleford Apt.docx`
**Path:** `/docs/15-Contract-review/1-Formatting & Report/REPORT Pg Img/master-word doc/VAL251012 - North Battleford Apt.docx`

This is the reference appraisal report from Valcre. It contains:
- Boilerplate text with embedded field IDs (visible as SDT tags)
- Page layout and content placement
- Images (flattened in place, each with unique ID for location reference)
- Tables (flattened as images but each represents a structured data table with its own field IDs)

---

## SOURCE WORKBOOK

**File:** `VAL251012_-_North_Battleford_Apt.xlsm`
**Path:** `/docs/15-Contract-review/6-Source Reports & Workbook/Ref-1-North Battleford/`

This is the Valcre Excel workbook containing:
- 7,988 named ranges
- Individual sheets per table (DIRECTCAP, SALE1-5, SURVEY1-5, RENTROLL, etc.)
- Calc engine logic that feeds the Word doc template
- All numeric/tabular data that populates the report

---

## EXTRACTED IMAGES

**Folder:** `/docs/15-Contract-review/6-Source Reports & Workbook/Ref-1-North Battleford/extracted-images/`

**Manifest:** `IMAGE-MANIFEST.json`

Contains 89 images extracted from source document:
- `company-logo` → image1.png
- `cover-photo` → image2.jpeg
- `subject-photo-01` through `subject-photo-24` → image12-35.jpeg
- `map-regional`, `map-aerial`, `map-local` → image1.png, image36-37.png
- `comparables-map` → image38.png
- `comp1-photo`, `comp2-photo`, `comp3-photo` → image73, 75, 77.jpg
- `rental-comp1-photo`, `rental-comp2-photo` → image44-45.png
- `zoning-map`, `flood-map` → image48-49.png
- `chart-01`, `chart-02`, `chart-03` → image51-53.emf

The manifest JSON maps field IDs to image paths so the template can reference them.

---

## EXTRACTED TABLES

**Documentation:** [agent to fill - table structure MD file]
**Path:** [agent to fill]

Tables extracted from workbook with cell IDs mapped:
- Direct Capitalization (Page 49)
- Sales Comparison Grid (Pages 55-62)
- Rent Survey (Pages 37-43)
- Market Rent Analysis
- Rent Roll
- Operating Expense History

Each table has its own sheet in the workbook with named ranges that map to our template field IDs.

---

## FIELD ID CROSSWALK

**Original Valcre IDs:** `TEST-DATA-VALCRE-ORIGINAL.json`
**Our Kebab-Case IDs:** `TEST-DATA-TRANSFORMED-V2.json`
**Crosswalk Reference:** `valcre-crosswalk-verified.ts`

Valcre uses naming like `IA_DirCap_NOI` → We use `calc-noi`
Valcre uses naming like `SA1_1_SalePrice` → We use `comp1-sale-price`

---

## TEST DATA

**File:** `northBattlefordTestData.ts`
**Path:** `src/features/report-builder/data/northBattlefordTestData.ts`

Contains 1,020+ field values extracted from the source document and workbook. Used to simulate user input and demonstrate the report generator produces the same output as the reference report.

---

## OUTPUT - MF Report Template

**File:** `Report-MF-Template-Framed-v2.1.html`
**Path:** [app template location]

71 pages, 1,020 field placeholders in `{{kebab-case-id}}` format.
- All field IDs verified against registry (0 mismatches)
- All naming standardized to kebab-case
- Ready for integration with report builder

---

## FIELD REGISTRY

**File:** `fieldRegistry.ts`
**Path:** `src/features/report-builder/schema/fieldRegistry.ts`

1,643 field definitions including:
- Field ID (kebab-case)
- Label
- Section/subsection
- Valcre mapping reference
- Data type

Source of truth for all valid field IDs in the system.

---

*[Add more sections as needed]*

---

Want me to continue filling in the gaps or adjust the format?


