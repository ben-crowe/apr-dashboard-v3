# Document to Appraisal Report Mapping
**Understanding Where Each Document Goes in the Final Report**

## Document Flow Analysis

### Current Workflow (What we think happens):
```
1. APR Hub (data entry) 
   ↓
2. Document gathering (manual/automated)
   ↓
3. Valcre (some docs/data)
   ↓
4. Word/PDF merge template
   ↓
5. Final Appraisal Report
```

### But Reality Might Be:
```
APR Hub → Valcre (just core data)
Documents → Direct to Report Template (drag & drop)
Some docs → Reference only (never in report)
```

## Where Documents Appear in Final Appraisal Report

Based on our appraisal report generator research, here's where each document typically goes:

### 📁 Legal Documents

#### Land Title Certificate
- **In Report**: YES - Addendum section
- **Purpose**: Verify ownership, encumbrances
- **Format**: Usually referenced, key points extracted
- **Typical Text**: "As per Land Title Certificate dated [date], the property is registered to [owner] with the following encumbrances..."

#### Survey Certificate/RPR
- **In Report**: YES - Addendum or Site Description
- **Purpose**: Confirm lot dimensions, building location
- **Format**: Image inserted or referenced
- **Typical Location**: Section 3 (Site Description) or Addendum

### 📊 Assessment Documents

#### Assessment Split (Land vs Building)
- **In Report**: YES - Cost Approach section
- **Purpose**: Support land value in cost approach
- **Format**: Values inserted into calculations
- **Example**: "Land Value (per municipal assessment): $2,450,000"

#### Tax Assessment Notice
- **In Report**: SOMETIMES - Market Analysis
- **Purpose**: Reference for tax burden analysis
- **Format**: Summary data, not full document

### 🗺️ Maps & Visuals

#### Zoning Map
- **In Report**: YES - Neighbourhood section
- **Purpose**: Show permitted uses
- **Format**: Image with property highlighted
- **Location**: Section 2 (Neighbourhood) or Addendum

#### Flood Map
- **In Report**: YES - Risk/Limiting Conditions
- **Purpose**: Disclose environmental risks
- **Format**: Image or statement
- **Text**: "The subject property is [within/outside] the 1:100 year flood zone"

#### Aerial Photo
- **In Report**: YES - Subject photos section
- **Purpose**: Show property context
- **Format**: Full page image
- **Location**: Photo section (usually after page 2)

### 🔨 Permits & Plans

#### Building Permits
- **In Report**: SOMETIMES - Property Description
- **Purpose**: Document improvements/renovations
- **Format**: Summary list, not full permits
- **Example**: "Recent improvements per city permits: 2023 roof replacement, 2021 HVAC upgrade"

#### Site Plan
- **In Report**: YES - Site section
- **Purpose**: Show building placement
- **Format**: Image/diagram
- **Location**: Site Description section

## Document Organization Strategy

### Group by Report Section (Not by Document Type!)

Instead of organizing by document type, organize by WHERE they go in the report:

```
SECTION 4: APPRAISAL REPORT DOCUMENTS
======================================

📄 EXECUTIVE SUMMARY DOCS
├── Nothing typically needed here

📍 PROPERTY DESCRIPTION DOCS
├── Land Title (ownership verification)
├── Building Permits (recent improvements)
├── Survey/Site Plan (lot configuration)

🏘️ NEIGHBOURHOOD DOCS  
├── Zoning Map (permitted uses)
├── Aerial Photo (context)

📊 VALUATION SUPPORT DOCS
├── Assessment Split (land vs building)
├── Tax Notice (carrying costs)

⚠️ RISK & CONDITIONS DOCS
├── Flood Map (environmental risks)
├── Title Encumbrances (from Land Title)

📎 ADDENDUM DOCS
├── Full Land Title Certificate
├── Full Survey Certificate
├── Additional maps/photos
```

## Valcre Integration Points

### What Goes to Valcre:
- Core property data (address, size, age)
- Comparable sales
- Final values

### What DOESN'T Go to Valcre:
- Supporting documents (PDFs, images)
- Maps and photos
- These go directly to report template

## Recommended Section 4 Design

### Organize by Workflow, Not Document Type:

```javascript
// Phase 1: Gather for Analysis
"Documents for Property Analysis" {
  - Land Title (check encumbrances)
  - Assessment data (understand values)
  - Permits (recent improvements)
}

// Phase 2: Gather for Report
"Documents for Report Sections" {
  - Property Description: Survey, permits
  - Neighbourhood: Zoning, aerial
  - Valuation: Assessment split
  - Risk: Flood maps
}

// Phase 3: Prepare for Template
"Ready for Report Template" {
  - Formatted images
  - Extracted text snippets
  - Organized by section
}
```

## Key Insights

### Some Documents Are Just Research:
- Not every document goes in the report
- Some are just for appraiser's analysis
- Track which ones are "For Report" vs "Reference Only"

### Different Formats for Different Uses:
- **For Analysis**: Full PDF/raw data
- **For Report**: Extracted snippets/formatted images
- **For Addendum**: Full documents as attachments

### Direct to Template Workflow:
Many documents might bypass Valcre entirely:
1. Gather in APR Hub Section 4
2. Download as organized package
3. Drag into Word/PDF template
4. Skip Valcre for these documents

## Action Items

### Need to Confirm with Chris:
1. Which documents go to Valcre vs direct to report?
2. What format does each document need to be in?
3. Does he use a merge template? If so, what fields?
4. Which documents are reference-only vs included?

### Section 4 Should Support:
- Marking documents as "For Report" vs "Reference"
- Organizing by report section, not document type
- Extracting key text for easy copy/paste
- Formatting images for report insertion
- Creating "Report Package" download with proper organization