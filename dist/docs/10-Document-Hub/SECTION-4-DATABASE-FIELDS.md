# Section 4: Supporting Documents Database Schema

## Database Fields for Job Table

### Section 4A: Legal Documents

```sql
-- Legal Documents (Required for Report)
land_title_url TEXT,                    -- PDF of land title certificate
land_title_uploaded_at TIMESTAMP,
land_title_status VARCHAR(20),          -- 'pending', 'uploaded', 'verified'

survey_certificate_url TEXT,            -- PDF of survey/RPR (if available)
survey_certificate_uploaded_at TIMESTAMP,
survey_certificate_status VARCHAR(20),  -- 'pending', 'uploaded', 'not_available'
```

### Section 4B: Assessment Documents

```sql
-- Assessment Documents (For Valuation Section)
assessment_split_data JSONB,            -- Scraped/gathered data
assessment_split_data_gathered_at TIMESTAMP,
assessment_split_source VARCHAR(50),    -- 'calgary_assessment', 'manual'
assessment_split_land_value DECIMAL,
assessment_split_building_value DECIMAL,

tax_notice_url TEXT,                    -- PDF if available
tax_notice_uploaded_at TIMESTAMP,
tax_notice_status VARCHAR(20),
```

### Section 4C: Maps & Zoning

```sql
-- Visual Documents (Required for Report)
zoning_map_url TEXT,                    -- PNG/JPG screenshot
zoning_map_captured_at TIMESTAMP,
zoning_map_source_url TEXT,             -- Where it came from
zoning_designation VARCHAR(20),         -- 'C-COR2', 'RM-3', etc.

flood_map_url TEXT,                     -- PNG/JPG screenshot
flood_map_captured_at TIMESTAMP,
flood_zone_status VARCHAR(50),          -- 'outside_flood_zone', 'flood_fringe', etc.

aerial_photo_url TEXT,                  -- JPG from Google/GIS
aerial_photo_captured_at TIMESTAMP,
aerial_photo_source VARCHAR(20),        -- 'google_maps', 'city_gis'
```

### Section 4D: Permits & Improvements

```sql
-- Permit Documents (For Property Description)
building_permits_urls JSONB,            -- Array of permit PDFs
building_permits_uploaded_at TIMESTAMP,
recent_improvements TEXT,                -- Extracted summary
permit_years JSONB,                     -- [2023, 2021, 2019]

site_plan_url TEXT,                     -- PDF/Image if available
site_plan_uploaded_at TIMESTAMP,
site_plan_status VARCHAR(20),
```

### Section 4E: Document Source Tracking

```sql
-- Learning System Fields
document_sources JSONB,                 -- Track where docs came from
/* Example:
{
  "land_title": {
    "suggested_url": "spin2.gov.ab.ca/search",
    "actual_url": "spin2.gov.ab.ca/search",
    "confirmed": true,
    "confidence": 0.95
  },
  "zoning_map": {
    "suggested_url": "maps.calgary.ca",
    "actual_url": "maps.calgary.ca",
    "confirmed": true,
    "confidence": 1.0
  }
}
*/
documents_complete_count INT DEFAULT 0,
documents_total_required INT DEFAULT 9,
section_4_status VARCHAR(20),           -- 'incomplete', 'partial', 'complete'
```

## Single Upload Interface

Each document type gets ONE upload slot:

```javascript
const SECTION_4_DOCUMENTS = {
  // Legal (2 documents)
  land_title: {
    required: true,
    format: 'PDF',
    source: 'SPIN2/ISC',
    report_section: 'Addendum'
  },
  survey_certificate: {
    required: false,  // Often not available
    format: 'PDF',
    source: 'SPIN2/Owner',
    report_section: 'Site Description'
  },
  
  // Assessment (2 items)
  assessment_split: {
    required: true,
    format: 'DATA',  // Not a file, scraped data
    source: 'Municipal Site',
    report_section: 'Cost Approach'
  },
  tax_notice: {
    required: false,
    format: 'PDF',
    source: 'Owner/Municipal',
    report_section: 'Market Analysis'
  },
  
  // Maps (3 documents)
  zoning_map: {
    required: true,
    format: 'IMAGE',
    source: 'City GIS',
    report_section: 'Neighbourhood'
  },
  flood_map: {
    required: true,
    format: 'IMAGE',
    source: 'Flood Portal',
    report_section: 'Limiting Conditions'
  },
  aerial_photo: {
    required: true,
    format: 'IMAGE',
    source: 'Google Maps',
    report_section: 'Subject Photos'
  },
  
  // Permits (2 documents)
  building_permits: {
    required: false,
    format: 'PDF',
    multiple: true,  // Can have multiple permits
    source: 'Municipal Permits',
    report_section: 'Property Description'
  },
  site_plan: {
    required: false,
    format: 'PDF/IMAGE',
    source: 'Municipal/Owner',
    report_section: 'Site Description'
  }
};
```

## Upload Component Structure

```javascript
// Simple one-slot-per-document interface
<Section4Documents jobId={jobId}>
  
  <DocumentCategory title="Legal Documents">
    <DocumentUpload 
      type="land_title"
      currentFile={job.land_title_url}
      onUpload={handleUpload}
      smartLink={generateSPIN2Link(address)}
    />
    <DocumentUpload 
      type="survey_certificate"
      currentFile={job.survey_certificate_url}
      optional={true}
    />
  </DocumentCategory>
  
  <DocumentCategory title="Assessment">
    <DataGather
      type="assessment_split"
      data={job.assessment_split_data}
      onGather={handleAssessmentScrape}
      smartLink={generateAssessmentLink(city, address)}
    />
    <DocumentUpload 
      type="tax_notice"
      optional={true}
    />
  </DocumentCategory>
  
  <DocumentCategory title="Maps & Zoning">
    <ScreenshotCapture
      type="zoning_map"
      currentImage={job.zoning_map_url}
      onCapture={handleZoningCapture}
      smartLink={generateZoningLink(city, address)}
    />
    <ScreenshotCapture
      type="flood_map"
      currentImage={job.flood_map_url}
      onCapture={handleFloodCapture}
    />
    <ImageCapture
      type="aerial_photo"
      currentImage={job.aerial_photo_url}
      onCapture={handleAerialCapture}
    />
  </DocumentCategory>
  
  <DocumentCategory title="Permits & Plans">
    <MultiDocumentUpload
      type="building_permits"
      currentFiles={job.building_permits_urls}
      onUpload={handlePermitUpload}
    />
    <DocumentUpload
      type="site_plan"
      optional={true}
    />
  </DocumentCategory>
  
</Section4Documents>
```

## Storage in Supabase

```javascript
// Upload to Supabase Storage
const uploadDocument = async (jobId, docType, file) => {
  // Store file
  const { data, error } = await supabase.storage
    .from('appraisal-documents')
    .upload(`jobs/${jobId}/${docType}/${file.name}`, file);
    
  // Update job record
  await supabase.from('jobs').update({
    [`${docType}_url`]: data.path,
    [`${docType}_uploaded_at`]: new Date(),
    [`${docType}_status`]: 'uploaded',
    documents_complete_count: job.documents_complete_count + 1
  }).eq('id', jobId);
};
```

## Summary

**Section 4 has 9 document slots:**
1. Land Title (PDF) - Required
2. Survey Certificate (PDF) - Optional
3. Assessment Split (Data) - Required
4. Tax Notice (PDF) - Optional
5. Zoning Map (Image) - Required
6. Flood Map (Image) - Required
7. Aerial Photo (Image) - Required
8. Building Permits (PDFs) - Optional
9. Site Plan (PDF/Image) - Optional

**Section 5 (Future)**: Property inspection photos from appraiser's site visit

This gives us a clean, single-upload-per-type interface that maps directly to the appraisal report requirements!