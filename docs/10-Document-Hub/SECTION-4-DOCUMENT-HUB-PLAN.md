# Section 4: Supporting Documents Hub
**Complete Work Environment for Document Management**

## Vision
Transform APR Hub into the COMPLETE appraisal workflow hub where Chris and his assistant manage everything BEFORE sending to Valcre. No more jumping between systems!

## Section 4 Interface Design

### Document Categories with Smart Management

```
SECTION 4: SUPPORTING DOCUMENTS
================================

📁 Legal Documents (2 of 2 complete)
├── ✅ Land Title Certificate
│   • Source: SPIN2
│   • File: land-title-VAL2024-1234.pdf [View] [Replace]
│   • Uploaded: Sept 14, 2025 by Chris
│   • Auto-extracted: Owner: Avenue Living, Mortgage: RBC
│
├── ✅ Survey Certificate/RPR
│   • Source: Owner Provided
│   • File: survey-1510-8th-st.pdf [View] [Replace]
│   • Uploaded: Sept 14, 2025 by Assistant
│   • Status: Verified current

📊 Assessment Documents (1 of 2 complete)
├── ✅ Assessment Split Report
│   • Source: Calgary Assessment [Auto-gathered]
│   • Land Value: $2,450,000
│   • Building Value: $16,050,000
│   • Total: $18,500,000
│   • [Refresh Data] [Export PDF]
│
├── ⏳ Tax Assessment Notice
│   • Status: Requested from owner
│   • [Upload Document] [Mark Unavailable]

🗺️ Maps & Visuals (3 of 3 complete)
├── ✅ Zoning Map
│   • Source: Calgary GIS [Auto-captured]
│   • Zone: C-COR2
│   • Image: zoning-map.png [View] [Recapture]
│
├── ✅ Flood Map
│   • Source: Flood Portal [Auto-captured]
│   • Status: Outside flood zone
│   • Image: flood-map.png [View] [Recapture]
│
├── ✅ Aerial Photo
│   • Source: Google Maps [Auto-captured]
│   • Image: aerial-view.jpg [View] [Update]

🔨 Permits & Plans (1 of 2 complete)
├── ✅ Building Permits (3 documents)
│   • 2023: Roof replacement permit.pdf
│   • 2021: HVAC upgrade permit.pdf
│   • 2019: Lobby renovation permit.pdf
│   • [Add More] [Bulk Upload]
│
├── ⚠️ Site Plan
│   • Status: Not available online
│   • [Upload] [Request from City] [Mark N/A]

═════════════════════════════════════
Progress: 7 of 9 documents complete (78%)
[Gather Available Documents] [Export All to Valcre]
```

## Key Features

### 1. Smart Status Tracking
- **✅ Complete**: Document uploaded and verified
- **⏳ In Progress**: Requested or being gathered
- **⚠️ Missing**: Needs attention
- **🚫 N/A**: Not applicable/available for this property

### 2. Upload & Management
```javascript
// Each document type has:
- Drag & drop upload zone
- Multiple file support (for permits)
- Version control (replace/update)
- Preview capability
- Metadata capture (source, date, uploader)
```

### 3. Automation Integration
```javascript
// "Gather Available Documents" button triggers:
1. SPIN2 land title download (with Chris's login)
2. Assessment split scraping
3. GIS map screenshots
4. Google aerial capture
5. Permit search

// Shows progress in real-time:
"Gathering documents... 
 ✓ Land title downloaded
 ✓ Assessment data retrieved
 ⟳ Capturing zoning map..."
```

### 4. Export to Valcre
```javascript
// One-click package creation:
- Organizes all documents by category
- Creates Valcre-ready folder structure
- Generates document index
- Zips for easy transfer
- OR direct API upload to Valcre (future)
```

## Database Schema

```sql
-- Document tracking table
CREATE TABLE job_documents (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  category VARCHAR(50), -- 'legal', 'assessment', 'maps', 'permits'
  document_type VARCHAR(50), -- 'land_title', 'survey', etc.
  status VARCHAR(20), -- 'complete', 'pending', 'na'
  source VARCHAR(100), -- 'SPIN2', 'Owner', 'Auto-gathered'
  file_url TEXT,
  file_name VARCHAR(255),
  uploaded_by VARCHAR(100),
  uploaded_at TIMESTAMP,
  metadata JSONB, -- Store extracted data
  notes TEXT
);
```

## Workflow Benefits

### For Chris (Appraiser):
- **Single workspace** - No switching between systems
- **Clear progress** - See what's done, what's needed
- **Auto-gathering** - Click once, get multiple documents
- **Quality control** - Nothing missed before Valcre

### For Assistant:
- **Task clarity** - Know exactly what to gather
- **Easy uploads** - Drag and drop interface
- **Status updates** - Mark items complete/unavailable
- **Collaboration** - See who uploaded what, when

### For Management:
- **Time tracking** - How long does document gathering take?
- **Bottleneck identification** - Which documents slow the process?
- **Compliance** - Ensure all required documents collected
- **Efficiency metrics** - Track automation success rate

## Implementation Phases

### Phase 1: Manual Upload Interface
- Create Section 4 UI in dashboard
- File upload capability
- Status tracking
- Basic organization

### Phase 2: Auto-Gathering Integration
- Connect Houski data (already done)
- Add assessment scraping
- Implement map screenshots
- Google Maps API integration

### Phase 3: Advanced Automation
- SPIN2 integration with Chris's login
- Permit portal searching
- OCR for data extraction
- Direct Valcre upload API

## Success Metrics

- **Time Saved**: 45 min → 10 min per job for document gathering
- **Completion Rate**: Track % of documents successfully gathered
- **Automation Rate**: % gathered automatically vs manually
- **Error Reduction**: Fewer missing documents in Valcre

## Summary

Section 4 transforms APR Hub from a data entry tool into a **complete appraisal workflow hub**. Everything happens in one place:

1. Client submits request (Section 1)
2. Chris assigned, Property Contact added (Section 1)
3. Chris enters building data (Section 3A)
4. Houski enriches data (Section 3B)
5. **Documents gathered and managed (Section 4)** ← NEW
6. Complete package sent to Valcre

This makes APR Hub the single source of truth for the entire pre-appraisal workflow!