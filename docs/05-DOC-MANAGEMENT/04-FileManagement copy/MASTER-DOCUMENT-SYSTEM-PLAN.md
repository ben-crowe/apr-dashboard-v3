# Master Document Management & Preview System Plan

## 🎯 Project Vision
Transform APR Dashboard from a simple data entry tool into a **complete appraisal workflow hub** where all document gathering, management, extraction, and preview happens in one place - eliminating the need to jump between multiple systems.

## 📊 System Overview

### The Complete Document Workflow
```
1. Client Request → Upload supporting docs (property tax, leases, etc.)
                ↓
2. Smart Links → One-click access to government sites with address pre-filled
                ↓
3. Document Upload → Drag & drop files into organized categories
                ↓
4. Data Extraction → Extract values from PDFs to populate Section 3A/3B
                ↓
5. In-App Preview → View all documents with zoom controls (no external tabs)
                ↓
6. Export Package → Organized folder ready for Valcre or direct report generation
```

## 📁 Document Categories & Database Fields

### Section 4A: Legal Documents (2 docs)
```sql
land_title_url TEXT                    -- PDF from SPIN2
land_title_uploaded_at TIMESTAMP
land_title_status VARCHAR(20)          -- 'pending', 'uploaded', 'verified'

survey_certificate_url TEXT            -- PDF/RPR if available
survey_certificate_uploaded_at TIMESTAMP
survey_certificate_status VARCHAR(20)
```

### Section 4B: Assessment Documents (2 docs)
```sql
assessment_split_data JSONB           -- Scraped data (land vs building value)
assessment_split_source VARCHAR(50)   -- 'calgary_assessment', 'manual'
assessment_split_land_value DECIMAL
assessment_split_building_value DECIMAL

tax_notice_url TEXT                   -- PDF if available
tax_notice_uploaded_at TIMESTAMP
```

### Section 4C: Maps & Visuals (3 docs)
```sql
zoning_map_url TEXT                   -- PNG/JPG screenshot
zoning_designation VARCHAR(20)        -- 'C-COR2', 'RM-3', etc.

flood_map_url TEXT                    -- PNG/JPG screenshot  
flood_zone_status VARCHAR(50)         -- 'outside_flood_zone', 'flood_fringe'

aerial_photo_url TEXT                 -- JPG from Google/GIS
aerial_photo_source VARCHAR(20)       -- 'google_maps', 'city_gis'
```

### Section 4D: Permits & Plans (2 docs)
```sql
building_permits_urls JSONB          -- Array of permit PDFs
recent_improvements TEXT              -- Extracted summary

site_plan_url TEXT                   -- PDF/Image if available
site_plan_status VARCHAR(20)
```

## 🔗 Smart Links System (Already Implemented!)

### Current Coverage
The system already has smart links via `src/utils/smartLinks.ts`:

#### Calgary Links ✅
- **Land Title**: `https://alta.registries.gov.ab.ca/spinii/search.aspx?type=address&value=${encoded}`
- **Assessment**: `https://assessmentsearch.calgary.ca/Search?address=${encoded}`
- **Zoning**: `https://maps.calgary.ca/CalgaryImagery/?find=${encoded}&layers=zoning`
- **Flood**: `https://maps.calgary.ca/FloodInfo/?address=${encoded}`
- **Permits**: `https://www.calgary.ca/pda/pd/permits/search.html?address=${encoded}`

#### Edmonton & Saskatoon ✅
Similar smart links for all document types

### Time Savings
- **Manual search**: 3 minutes per document
- **With smart links**: 30 seconds per document
- **Total savings**: 22.5 minutes per property

## 📄 Data Extraction Workflow

### The Hidden Purpose of Section 3A
Section 3A isn't just "organizing" data - it's **extracting** data from client documents!

### Three Data Sources
1. **Client Documents** (PDFs) → Extract via OCR/manual
2. **Houski API** → 14 fields automatically  
3. **Manual Entry** → Remaining fields

### Extraction Flow
```javascript
// Current manual process
Client PDF → Chris reads → Types into fields → Valcre

// Future automated process  
Client PDF → AI/OCR extraction → Pre-populate fields → Chris verifies → Valcre
```

### Key Documents Containing Data
- **Property Tax Assessment**: Year built, lot size, building area, assessed value
- **Lease Agreements**: Rental rates, tenant info, unit sizes
- **Financial Statements**: Operating expenses, income, NOI
- **Previous Appraisals**: Historical values, comparables

## 👁️ File Preview System (In Progress)

### Current Status
- ✅ Base FilePreviewModal component created
- ✅ Zoom controls (25-200%, 10% increments) from LOE Modal
- ✅ Keyboard shortcuts (Ctrl +/-, arrows, Esc)
- ❌ Not integrated yet
- ❌ Dependencies not installed

### Features to Implement
1. **Image Viewer**: Zoom, pan, rotate
2. **PDF Viewer**: Page navigation, zoom
3. **Document Viewer**: Fallback for other types
4. **Mobile Support**: Touch gestures

### Integration Points
Replace all `window.open()` calls in:
- Section4Compact.tsx
- FileUpload components
- Document upload boxes

## 📋 Document-to-Report Mapping

### Where Documents Go in Final Report

| Document | Report Section | Format |
|----------|---------------|---------|
| Land Title | Addendum | Referenced text |
| Survey/RPR | Site Description | Image |
| Assessment Split | Cost Approach | Values in calculations |
| Tax Notice | Market Analysis | Summary data |
| Zoning Map | Neighbourhood | Image with highlight |
| Flood Map | Risk/Limiting Conditions | Image or statement |
| Aerial Photo | Subject Photos | Full page image |
| Building Permits | Property Description | Summary list |
| Site Plan | Site Description | Image/diagram |

### Key Insight
Not all documents go to Valcre! Many go directly to the report template:
```
Documents → APR Hub Section 4 → Download package → Word/PDF template
           (Skip Valcre for supporting docs)
```

## 🚀 Implementation Phases

### Phase 1: Foundation (Current)
- ✅ Smart links to government sites
- ✅ Basic file upload interface
- ✅ File preview component (not integrated)
- ⏳ Status tracking

### Phase 2: Integration (Next)
- [ ] Wire up FilePreviewModal
- [ ] Install dependencies (react-pdf, etc.)
- [ ] Replace window.open() with in-app preview
- [ ] Add zoom/pan for all file types

### Phase 3: Data Extraction
- [ ] Add OCR capabilities
- [ ] Pre-populate Section 3A fields from PDFs
- [ ] Confidence scoring
- [ ] Chris verification workflow

### Phase 4: Automation
- [ ] SPIN2 integration (Chris has login!)
- [ ] Municipal assessment scraping
- [ ] Auto-screenshot maps
- [ ] Direct Valcre API upload

## 🏗️ Technical Architecture

### Component Structure
```
04-FileManagement/
├── components/
│   ├── FilePreviewModal.tsx          ✅ Created
│   ├── viewers/
│   │   ├── ImageViewer.tsx          🔄 To build
│   │   ├── PDFViewer.tsx            🔄 To build
│   │   └── DocumentViewer.tsx       🔄 To build
│   ├── SmartLinks/
│   │   └── SmartLinkButton.tsx      ✅ Exists in main app
│   └── DocumentUpload/
│       └── DocumentUploadBox.tsx     ✅ Exists in main app
```

### Storage Structure (Supabase)
```
appraisal-documents/
├── {job-id}/
│   ├── legal/
│   │   ├── land_title.pdf
│   │   └── survey.pdf
│   ├── assessment/
│   │   └── tax_notice.pdf
│   ├── maps/
│   │   ├── zoning.png
│   │   ├── flood.png
│   │   └── aerial.jpg
│   └── permits/
│       └── building_permits.pdf
```

## 📈 ROI & Metrics

### Time Savings
- **Document gathering**: 45 min → 10 min per job
- **Smart links**: Save 22.5 min per property
- **In-app preview**: Save 5-10 min (no tab switching)
- **Total**: ~60 minutes saved per property

### Financial Impact
- 100 properties/month × 1 hour saved = 100 hours
- 100 hours × $50/hour = $5,000/month value
- Annual value: $60,000 in time savings

### Success Metrics to Track
- Document completion rate (target: 95%)
- Automation success rate (target: 70%)
- Time to complete Section 4 (target: <10 min)
- Error reduction in Valcre (target: 50% reduction)

## 🔄 Integration with Existing Report Generator

### Discovery
There's already a Report Generator at:
`/Users/bencrowe/Development/APR-Hub-Extended/_APR-Hub-Master/14-Contract-Generator/Report-Generator/`

### Opportunity
Instead of: `APR Hub → Valcre → Word Merge`
Could be: `APR Hub → Report Generator → PDF` (skip Valcre for documents)

### Next Steps
1. Analyze Report Generator field mapping
2. Consider direct integration
3. Potentially eliminate Word merge templates

## ✅ Immediate Action Items

1. **Install dependencies for file preview**:
```bash
npm install @react-pdf-viewer/core react-pdf pdfjs-dist react-zoom-pan-pinch
```

2. **Integrate FilePreviewModal** into Section4Compact.tsx

3. **Test with existing uploads**

4. **Track smart link usage** to identify most-clicked links

5. **Document extraction POC** - Start with property tax PDFs

## 📝 Notes

- The LOE Preview Modal zoom implementation works perfectly - use it as reference
- Smart links alone provide immediate value even without automation
- Focus on documents that go IN the report, not just reference documents
- Chris has SPIN2 access - prioritize automating land title retrieval
- Consider that Section 3A is really about extracting data FROM documents, not just organizing

---

*This master plan consolidates all Phase 2 documentation into a single actionable roadmap for the complete document management and preview system.*