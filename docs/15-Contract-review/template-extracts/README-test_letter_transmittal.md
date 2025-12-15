# Letter of Transmittal Template

## File Created
`test_letter_transmittal.html`

## Source
Extracted from: `VAL251012 - North Battleford Apt, 1101, 1121 109 Street, North Battleford.html`
- Source Section: **WordSection2** (Letter of Transmittal page)
- Source Lines: 4481-4822 (page content)
- Style Lines: 677-3910 (complete CSS)

## What Was Extracted

### 1. Complete Styles Block
All CSS from the original Word export was preserved, including:
- Font definitions (Open Sans, Calibri, Montserrat, Segoe UI, etc.)
- Paragraph styles (MsoNormal, MsoHeader, MsoFooter, etc.)
- Heading styles (h1-h6 with blue colors #003B7E, #0A3D62)
- Table styles
- Character styles
- Blue header block color (#00467F)

### 2. One Page of Content
The Letter of Transmittal page, which includes:
- Date field
- Client address block
- Re: line with property details
- Opening paragraphs about the appraisal
- Value summary table (as image)
- Hypothetical conditions section
- Extraordinary assumptions section
- Extraordinary limiting conditions section
- Guidelines paragraph
- Signature block with appraiser details

### 3. Field Placeholders (24 unique fields)

**Client Fields:**
- `{{Client_Name}}`
- `{{Client_Title}}`
- `{{Client_Company}}`
- `{{Client_Address}}`
- `{{Client_Suite}}`
- `{{Client_CityStateZip}}`

**Subject Property Fields:**
- `{{Subject_Street}}`
- `{{Subject_City}}`
- `{{Subject_ST}}` (State abbreviation)
- `{{Subject_IntroComment}}`
- `{{Subject_EconCharacteristics}}`

**Report Fields:**
- `{{Report_Date}}`
- `{{Report_Values}}`
- `{{Report_ValueScenario1}}`
- `{{Report_Hypothetical}}`
- `{{Report_Extraordinary}}`
- `{{Report_LimCond}}` (Limiting Conditions)
- `{{Report_Guidlines}}`

**Company Fields:**
- `{{Company_Name}}`

**Appraiser Fields:**
- `{{Appraiser1_Name}}`
- `{{Appraiser1_Title}}`
- `{{Appraiser1_Email}}`

### 4. Image Placeholders (2 images)
- `[IMAGE: {{Report_ValueSummary}}]` - Value summary table
- `[IMAGE: {{Appraiser1_Signature}}]` - Appraiser signature

## Template Structure

```html
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:o="urn:schemas-microsoft-com:office:office"
     xmlns:w="urn:schemas-microsoft-com:office:word"
     xmlns="http://www.w3.org/TR/REC-html40">

<head>
  <meta charset="UTF-8">
  <title>Letter of Transmittal - Template</title>
  <style>
    /* COMPLETE CSS FROM WORD EXPORT */
  </style>
</head>

<body>
  <div class="WordSection2">
    <!-- PAGE CONTENT WITH PLACEHOLDERS -->
    <p class="MsoNormal">
      <w:Sdt Title="Report_Date">{{Report_Date}}</w:Sdt>
    </p>
    <!-- etc. -->
  </div>
</body>
</html>
```

## How Placeholders Work

### Text Fields
The `<w:Sdt>` (Structured Document Tag) structure is preserved from Word:
```html
<w:Sdt DocPart="..." Title="Client_Name (...)" ID="...">
  {{Client_Name}}
</w:Sdt>
```

### Image Fields
Image fields are replaced with simple placeholders:
```html
[IMAGE: {{Report_ValueSummary}}]
```

## Formatting Preserved

All original formatting is intact:
- Paragraph spacing and alignment
- Font sizes and colors
- Table structures
- Line heights
- Margins and padding
- Bold and italic text
- Blue section headers
- Nested span structures for bookmarks

## File Statistics
- Size: 113 KB
- Lines: ~3,500
- Unique Fields: 24
- Image Placeholders: 2

## Usage

1. Open in browser to see the rendered layout
2. All blue styling will display correctly
3. Placeholders can be replaced with actual data using search/replace or template engine
4. Original Word formatting is preserved for PDF export compatibility

## Next Steps

To use this template:
1. Load the HTML file
2. Replace `{{FieldName}}` placeholders with actual values
3. Replace `[IMAGE: {{FieldName}}]` with actual images
4. Render to PDF or display in browser

The complete CSS ensures that the page will look identical to the original Word document when rendered.
