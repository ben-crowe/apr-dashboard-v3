# Smart Document Links Integration

## Overview
Smart links provide pre-populated URLs that take users directly to government/city websites with the property address already loaded. This saves 10-15 minutes per property by eliminating manual searching.

## How It Works in Our System

### Current Implementation (Section4Compact.tsx)
We already have Smart Links implemented! They're the external arrow icons (↗️) next to each upload box.

```typescript
// From src/utils/smartLinks.ts
export const getSmartLinks = (
  city: string,
  address: string,
  docType: DocumentType
): string | null
```

### Current Smart Link Coverage

#### Calgary Links ✅
- **Land Title**: SPIN2 with address search
- **Survey**: SPIN2 check
- **Assessment**: Calgary Assessment Search
- **Tax Notice**: Calgary Tax Portal  
- **Zoning**: Calgary GIS with zoning layer
- **Flood**: Calgary Flood Map
- **Aerial**: Google Maps satellite view
- **Permits**: Calgary MyProperty portal

#### Edmonton Links ✅
- **Assessment**: Edmonton Assessment Search
- **Zoning**: Edmonton Maps with zoning
- **Flood**: Alberta Provincial Flood
- **Aerial**: Google Maps satellite
- **Permits**: Edmonton Permits Search

#### Saskatoon Links ✅
- **Assessment**: Saskatoon Property Search
- **Zoning**: Saskatoon Map Portal
- **Flood**: Water Security Agency
- **Aerial**: Google Maps satellite

## Integration with File Management

### The Complete Workflow
1. **Smart Link** → User clicks to go to government site
2. **Manual Download** → User saves document from site
3. **Upload to APR** → User uploads via our interface
4. **File Preview** → User can preview in-app (new system)
5. **Storage** → File stored in Supabase

### Enhanced UI Concept
```
📁 Land Title Certificate
├── Status: Not uploaded
├── 🔗 [Get from SPIN2] ← Smart link (existing)
├── 📤 [Upload File]     ← Upload box (existing)  
└── 👁️ [Preview]        ← New preview system

When file is uploaded:
📁 Land Title Certificate ✅
├── Status: Uploaded 2024-11-25
├── 📄 land_title_123.pdf
├── 👁️ [Preview] ⬇️ [Download] 🗑️ [Delete]
└── 🔗 [Get Updated Version] ← Keep smart link available
```

## Implementation Improvements

### 1. Smart Link Enhancements
```typescript
// Add tooltips to explain what each link does
const SmartLinkButton = ({ link, docType }) => (
  <Tooltip content={`Opens ${getProviderName(docType)} with address pre-filled`}>
    <Button
      onClick={() => {
        trackLinkUsage(docType); // Analytics
        window.open(link, '_blank');
      }}
    >
      <ExternalLink className="h-4 w-4" />
      Get from {getProviderName(docType)}
    </Button>
  </Tooltip>
);
```

### 2. Link Usage Analytics
```typescript
// Track which links are most useful
const trackLinkUsage = async (docType: string) => {
  await supabase.from('smart_link_usage').insert({
    doc_type: docType,
    clicked_at: new Date(),
    job_id: currentJob.id,
    city: property.city
  });
};
```

### 3. Progressive Enhancement Path

#### Phase 1: Current State ✅
- Smart links with address pre-filled
- Manual download and upload
- Basic file preview (window.open)

#### Phase 2: Enhanced Preview (In Progress)
- In-app file preview with zoom
- File management dashboard
- Download tracking

#### Phase 3: Semi-Automation (Future)
- Auto-screenshot for map-based documents
- OCR for searchable PDFs
- Bulk download helpers

#### Phase 4: Full Automation (Future)
- API integration where available
- Web scraping for public data
- Automatic document refresh

## Smart Link URL Patterns

### Dynamic Generation
```typescript
function generateSmartLink(
  docType: string, 
  address: string, 
  city: string
): string {
  const encoded = encodeURIComponent(address);
  
  const patterns = {
    calgary: {
      land_title: `https://alta.registries.gov.ab.ca/spinii/search.aspx?type=address&value=${encoded}`,
      assessment: `https://assessmentsearch.calgary.ca/Search?address=${encoded}`,
      zoning: `https://maps.calgary.ca/CalgaryImagery/?find=${encoded}&layers=zoning&zoom=18`,
      flood: `https://maps.calgary.ca/FloodInfo/?address=${encoded}&showflood=true`,
      aerial: `https://www.google.com/maps/search/${encoded}/@${lat},${lng},18z/data=!3m1!1e3`,
      permits: `https://www.calgary.ca/pda/pd/permits/search.html?address=${encoded}`
    },
    edmonton: {
      // Similar patterns...
    },
    saskatoon: {
      // Similar patterns...
    }
  };
  
  return patterns[city.toLowerCase()]?.[docType] || null;
}
```

## Benefits of Integration

### Time Savings
- **Without smart links**: 3 minutes to find each document
- **With smart links**: 30 seconds per document
- **Time saved**: 2.5 minutes × 9 documents = 22.5 minutes per property

### User Experience
- One-click access to document sources
- No typing errors (address pre-filled)
- Consistent workflow every time
- Educational (users learn where data comes from)

### Progressive Value
1. **Immediate**: Smart links (already implemented)
2. **Quick Win**: File preview system (in progress)
3. **Medium Term**: Auto-screenshot maps
4. **Long Term**: Full automation where possible

## Next Steps

### Priority 1: Complete File Preview Integration
- Wire up FilePreviewModal to Section4Compact
- Replace window.open() with in-app preview
- Test with all document types

### Priority 2: Enhance Smart Links
- Add provider names to links
- Show last retrieved date
- Add refresh reminders for time-sensitive docs

### Priority 3: Usage Analytics
- Track which links are clicked most
- Identify automation opportunities
- Measure time savings

## ROI Calculation

### Current State (with smart links)
- 9 documents × 30 seconds = 4.5 minutes

### Without Smart Links
- 9 documents × 3 minutes = 27 minutes

### Savings
- **22.5 minutes saved per property**
- **100 properties/month = 37.5 hours saved**
- **$50/hour × 37.5 = $1,875/month value**

Even without full automation, smart links provide immediate, measurable value!