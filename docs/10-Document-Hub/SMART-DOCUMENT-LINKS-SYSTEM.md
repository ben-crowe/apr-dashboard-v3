# Smart Document Links System
**Pre-Populated URLs for Every Document Source**

## The Vision
Every document in Section 4 has a smart link that takes Chris DIRECTLY to the right page with the property address already loaded. No searching, no typing - just click and you're there!

## How Smart Links Work

### Example: Calgary Flood Map
```javascript
// Instead of:
"Go to maps.calgary.ca, search for address, click flood layer..."

// We provide:
const smartLink = `https://maps.calgary.ca/CalgaryImagery/?find=${encodeURIComponent('1510 8th Street East')}&layers=flood`;

// User clicks link → Opens directly to flood map with property highlighted!
```

## Complete Smart Link Library

### 📁 Legal Documents

#### Land Title (SPIN2 - Alberta)
```javascript
// Direct to SPIN2 search with address pre-filled
const spin2Link = `https://alta.registries.gov.ab.ca/spinii/search.aspx?type=address&value=${encodeURIComponent(address)}`;

// Display in UI:
"🔗 Get Land Title from SPIN2" [Click opens SPIN2 with address ready]
```

#### Land Title (ISC - Saskatchewan)
```javascript
const iscLink = `https://apps.isc.ca/LSReg/web/Search.aspx?address=${encodeURIComponent(address)}`;
```

### 📊 Assessment Documents

#### Calgary Assessment Split
```javascript
// Direct to assessment search with address
const calgaryAssessmentLink = `https://assessmentsearch.calgary.ca/Search?address=${encodeURIComponent(address)}`;

// Even better - direct to specific roll number if we have it:
const directAssessmentLink = `https://assessmentsearch.calgary.ca/Property/${rollNumber}`;
```

#### Edmonton Assessment
```javascript
const edmontonAssessmentLink = `https://www.edmonton.ca/residential_neighbourhoods/property_assessment/assessment-search.aspx?address=${encodeURIComponent(address)}`;
```

#### Saskatoon Assessment
```javascript
const saskatoonAssessmentLink = `https://apps4.saskatoon.ca/app/aSearch/property/${encodeURIComponent(address)}`;
```

### 🗺️ Maps & Visuals

#### Zoning Map
```javascript
// Calgary - Opens GIS with zoning layer active
const calgaryZoningLink = `https://maps.calgary.ca/CalgaryImagery/?find=${encodeURIComponent(address)}&layers=zoning&zoom=18`;

// Edmonton
const edmontonZoningLink = `https://maps.edmonton.ca/map.aspx?lookingFor=${encodeURIComponent(address)}&maptype=zoning`;

// Saskatoon
const saskatoonZoningLink = `https://map.saskatoon.ca/?address=${encodeURIComponent(address)}&layer=zoning`;
```

#### Flood Maps
```javascript
// Calgary - Direct to flood hazard layer
const calgaryFloodLink = `https://maps.calgary.ca/FloodInfo/?address=${encodeURIComponent(address)}&showflood=true`;

// Alberta Provincial
const albertaFloodLink = `https://floods.alberta.ca/map/?location=${encodeURIComponent(address)}`;
```

#### Aerial Photos
```javascript
// Google Maps - Satellite view
const googleAerialLink = `https://www.google.com/maps/search/${encodeURIComponent(address)}/@${lat},${lng},18z/data=!3m1!1e3`;

// Calgary Imagery
const calgaryAerialLink = `https://maps.calgary.ca/CalgaryImagery/?find=${encodeURIComponent(address)}&imagery=2024`;
```

### 🔨 Permits & Plans

#### Building Permits
```javascript
// Calgary - MyProperty portal
const calgaryPermitsLink = `https://www.calgary.ca/pda/pd/permits/search.html?address=${encodeURIComponent(address)}`;

// Edmonton
const edmontonPermitsLink = `https://www.edmonton.ca/residential_neighbourhoods/permits/search-permits?address=${encodeURIComponent(address)}`;
```

## Implementation in Section 4 UI

```javascript
SECTION 4: SUPPORTING DOCUMENTS
================================

📁 Legal Documents
├── ⏳ Land Title Certificate
│   Status: Not gathered
│   🔗 [Get from SPIN2] ← Pre-populated link!
│   💡 Tip: Chris's login required
│   [Upload if you have it]
│
├── ⚠️ Survey Certificate
│   Status: Not available online
│   🔗 [Check SPIN2] ← Maybe attached to title
│   🔗 [Request from Owner]
│   [Upload Document]

📊 Assessment Documents
├── ⏳ Assessment Split Report
│   Status: Ready to gather
│   🔗 [Get from Calgary Assessment] ← One click!
│   🤖 [Auto-Gather] ← Or let us scrape it
│
├── ⏳ Tax Notice
│   Status: Not gathered
│   🔗 [Calgary Tax Portal] ← If owner gives access
│   [Upload Document]

🗺️ Maps & Visuals
├── ⏳ Zoning Map
│   Status: Ready to capture
│   🔗 [View on Calgary GIS] ← Opens with address
│   🤖 [Auto-Screenshot] ← We capture it
│
├── ⏳ Flood Map
│   Status: Ready to capture
│   🔗 [Check Flood Status] ← Direct to flood layer
│   🤖 [Auto-Screenshot]
│
├── ⏳ Aerial Photo
│   Status: Ready to capture
│   🔗 [Google Maps Aerial] ← Satellite view
│   🔗 [Calgary 2024 Imagery] ← Latest city photos
│   🤖 [Auto-Capture Best]
```

## Smart Link Features

### 1. Dynamic URL Generation
```javascript
function generateSmartLinks(property) {
  const links = {};
  
  // Encode address for URLs
  const encodedAddress = encodeURIComponent(property.address);
  const city = property.city.toLowerCase();
  
  // Generate all applicable links
  if (city === 'calgary') {
    links.assessment = `https://assessmentsearch.calgary.ca/Search?address=${encodedAddress}`;
    links.zoning = `https://maps.calgary.ca/CalgaryImagery/?find=${encodedAddress}&layers=zoning`;
    links.flood = `https://maps.calgary.ca/FloodInfo/?address=${encodedAddress}`;
    links.permits = `https://www.calgary.ca/pda/pd/permits/search.html?address=${encodedAddress}`;
  } else if (city === 'edmonton') {
    // Edmonton specific links...
  }
  
  // Add Google Maps (works everywhere)
  links.aerial = `https://maps.google.com/search/${encodedAddress}`;
  
  return links;
}
```

### 2. Fallback Options
```javascript
// If automation fails, user has instant manual access:
try {
  // Try to auto-scrape
  const assessmentData = await scrapeAssessment(address);
} catch (error) {
  // Provide smart link for manual access
  showMessage("Auto-gather failed. Click here to get it manually: [Smart Link]");
}
```

### 3. Time Tracking
```javascript
// Track how users get documents:
- Auto-gathered: 2 seconds
- Via smart link: 30 seconds  
- Manual search: 3 minutes

// Shows ROI of smart links even without full automation!
```

## Benefits of Smart Links

### Immediate Value (No automation needed!)
- **Zero setup**: Just generate URLs
- **Time saved**: 2-3 minutes per document
- **No searching**: Direct to right page
- **Address pre-filled**: No typing errors

### Progressive Enhancement
1. **Level 1**: Smart links (immediate)
2. **Level 2**: Auto-screenshot maps (1 week)
3. **Level 3**: Scrape assessments (2 weeks)
4. **Level 4**: SPIN2 automation (1 month)

### User Experience
- **One click**: Instead of navigate → search → filter
- **Consistent**: Same process every time
- **Reliable**: Links always work
- **Educational**: Users learn where data comes from

## Implementation Code

```javascript
// Add to Section 4 component
const DocumentLink = ({ type, address, city }) => {
  const url = generateSmartLink(type, address, city);
  
  return (
    <div className="document-item">
      <span className="status">⏳ Not gathered</span>
      <a 
        href={url} 
        target="_blank"
        className="smart-link"
        onClick={() => trackLinkUsage(type)}
      >
        🔗 Get {type} Document
      </a>
      <button onClick={() => autoGather(type)}>
        🤖 Auto-Gather
      </button>
    </div>
  );
};
```

## ROI Calculation

### Manual Process (current):
1. Remember/Google where to get flood map (30 sec)
2. Navigate to site (10 sec)
3. Type address (20 sec)
4. Find flood layer option (20 sec)
5. Toggle flood view (10 sec)
**Total: 90 seconds per document**

### With Smart Links:
1. Click link (2 sec)
2. Page loads with address and layer (5 sec)
**Total: 7 seconds per document**

**Time saved: 83 seconds per document × 9 documents = 12.5 minutes per property!**

## Summary

Smart links are the PERFECT intermediate step:
- **Immediate value** without complex automation
- **Risk-free** (just generating URLs)
- **User-friendly** (one click to destination)
- **Progressive** (add automation over time)

Even if we NEVER fully automate, smart links alone save Chris 10-15 minutes per property!