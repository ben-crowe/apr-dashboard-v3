# APR-V3 Field Reconciliation
**Created:** December 1, 2025
**Purpose:** Determine what V3 Sections 3/4/5 should capture (NOT in Valcre, NOT in Calculator)

---

## The Three Buckets

| Bucket | Source | V3 Role | V4 Role |
|--------|--------|---------|---------|
| **1. Valcre Fields** | Already in Valcre | Display read-only | Pull via API |
| **2. Calculator Fields** | Excel/V4 Calculator | Skip in V3 | V4 handles |
| **3. Manual/Narrative** | Appraiser types in Word | **V3 Captures** | Pre-populate from V3 |

---

## SECTION-BY-SECTION RECONCILIATION

### Report Section 1-3: Cover, Transmittal, Executive Summary

**These are covered by V3 Sections 1 & 2 + Valcre**

| Report Field | In Valcre? | V3 Section | Action |
|--------------|------------|------------|--------|
| Property Name | Yes | Sec 1 | Display only |
| Property Address | Yes | Sec 1 | Display only |
| Client Name/Company | Yes | Sec 1 | Display only |
| File Number (VAL#) | Yes | Sec 2 | Display only |
| Effective Date | Yes | Sec 2 | Display only |
| Intended Use | Yes | Sec 2 | Display only |
| Property Rights | Yes | Sec 2 | Display only |
| Final Value | No (Calculator) | Skip | V4 Calculator |

**Status:** Covered

---

### Report Section 4: Photographs (50+ slots)

**V3 Section 5 needs to handle this**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| Exterior photos (4+) | Unknown* | V3 Sec 5 - Upload |
| Interior photos (10+) | Unknown* | V3 Sec 5 - Upload |
| Unit photos (10+) | Unknown* | V3 Sec 5 - Upload |
| System photos (mechanical, electrical) | Unknown* | V3 Sec 5 - Upload |
| Photo captions (each) | No | V3 Sec 5 - Manual entry |

*Photos may be in Valcre CDN but API access unconfirmed. For now, V3 handles uploads.

**V3 Section 5 Current Gap:**
- Has 8 document types
- Needs 50+ photo slots with captions
- Needs photo categorization (Exterior, Interior, Unit, Systems)

---

### Report Section 5: Maps (5 types)

**V3 Section 5 needs to handle this**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| Regional Map | No | V3 Sec 5 - Upload |
| Local Area Map | No | V3 Sec 5 - Upload |
| Aerial Photo | No | V3 Sec 5 - Upload |
| Zoning Map | No | V3 Sec 5 - Upload |
| Site Plan | No | V3 Sec 5 - Upload |

**Status:** Partially covered (need dedicated map section)

---

### Report Section 6: Property Identification

**Mostly Valcre + V3 Section 3/4**

| Report Field | In Valcre? | V3 Section | Action |
|--------------|------------|------------|--------|
| Property Address | Yes | Sec 1 | Display only |
| Legal Description | Yes (Parcel) | Sec 3 | Display only |
| Number of Buildings | Yes | Sec 3 | Display only |
| NRA (Net Rentable Area) | Yes | Sec 3 | Display only |
| Year Built | Yes | Sec 3 | Display only |
| Number of Units | Yes | Sec 3 | Display only |
| Authorized Client | Yes (Contact) | Sec 1 | Display only |
| Authorized Use | Yes (Job) | Sec 2 | Display only |
| Effective Date | Yes (Job) | Sec 2 | Display only |
| Inspection Date | **No** | **V3 Sec 4** | Appraiser fills |
| Current Owner | **No** | **V3 Sec 4** | Appraiser fills |
| Sales History | **No** | **V3 Sec 4** | Appraiser fills |
| Exposure Time | **No** | **V3 Sec 4** | Appraiser fills |

---

### Report Section 7: Scope of Work

**Mostly Valcre + Template Defaults**

| Report Field | In Valcre? | V3 Section | Action |
|--------------|------------|------------|--------|
| Scope of Work Type | Yes (Job) | Sec 2 | Display only |
| Report Format | Yes (Job) | Sec 2 | Display only |
| Approaches Used | **No** | Template/V4 | V4 sets based on calculations |
| Inspection Type | **No** | **V3 Sec 4** | Appraiser fills |
| Data Sources | No | Template | Standard text |

---

### Report Section 8: Location Analysis

**V3 Section 4 MUST capture these narratives**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| Market Area | Yes (Property) | Display only |
| Submarket Name | Yes (Property) | Display only |
| Location Overview | **No** | **V3 Sec 4** - Narrative |
| Access Description | **No** | **V3 Sec 4** - Narrative |
| Public Transit | **No** | **V3 Sec 4** - Narrative |
| Walk Score | **No** | **V3 Sec 4** - Manual/Auto |
| Transit Score | **No** | **V3 Sec 4** - Manual/Auto |
| Bike Score | **No** | **V3 Sec 4** - Manual/Auto |
| Local Area Description | **No** | **V3 Sec 4** - Narrative |
| Nearby Schools | **No** | **V3 Sec 4** - Narrative |
| Surrounding Uses | **No** | **V3 Sec 4** - Narrative |
| Neighborhood Trends | **No** | **V3 Sec 4** - Narrative |

**V3 Section 4 Current Gap:** Missing all narrative fields

---

### Report Section 9: Site Details

**Mix of Valcre + V3 Section 4**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| Total Site Area (SF) | Yes (Parcel) | Display only |
| Site Area (Acres) | Calculated | V4 calculates |
| Parcel Number | Yes (Parcel) | Display only |
| Buildable Land SF | Yes (Property) | Display only |
| Adjacent North/South/East/West | **No** | **V3 Sec 4** - Manual |
| Accessibility | **No** | **V3 Sec 4** - Dropdown |
| Exposure & Visibility | **No** | **V3 Sec 4** - Manual |
| Easements | **No** | **V3 Sec 4** - Manual |
| Soils | **No** | **V3 Sec 4** - Manual |
| Hazardous Waste | Yes (Property) | Display only |
| Site Rating | **No** | **V3 Sec 4** - Dropdown |
| Shape | **No** | **V3 Sec 4** - Dropdown |
| Topography | **No** | **V3 Sec 4** - Dropdown |
| Drainage | **No** | **V3 Sec 4** - Dropdown |

---

### Report Section 10: Property Taxes

**Valcre (Assessment entity)**

| Report Field | In Valcre? | V3 Section | Action |
|--------------|------------|------------|--------|
| Assessment Year | Yes | Sec 4 | Display only |
| Land Value | Yes | Sec 4 | Display only |
| Building Value | Yes | Sec 4 | Display only |
| Total Assessed Value | Yes | Sec 4 | Display only |
| Annual Tax | Yes | Sec 4 | Display only |
| Tax Commentary | **No** | **V3 Sec 4** | Appraiser fills |

---

### Report Section 11: Zoning & Land Use

**Valcre covers most**

| Report Field | In Valcre? | V3 Section | Action |
|--------------|------------|------------|--------|
| Zoning Classification | Yes (Property) | Sec 4 | Display only |
| Zoning Name | Yes (Property) | Sec 4 | Display only |
| Land Use | Yes (Property) | Sec 4 | Display only |
| Conforming Use | **No** | **V3 Sec 4** | Dropdown |
| Zoning Description | **No** | **V3 Sec 4** | Narrative |
| Permitted Uses | **No** | **V3 Sec 4** | Narrative |

---

### Report Section 12: Improvements Description (42 fields!)

**This is the BIG GAP - V3 Section 3 needs major expansion**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| Number of Buildings | Yes | Display only |
| NRA | Yes | Display only |
| Year Built | Yes | Display only |
| Number of Units | Yes | Display only |
| Parking Spaces | Yes | Display only |
| **Foundation** | **No** | **V3 Sec 3** |
| **Exterior Walls/Framing** | **No** | **V3 Sec 3** |
| **Roof Type/Condition** | **No** | **V3 Sec 3** |
| **HVAC System** | **No** | **V3 Sec 3** |
| **Electrical Service** | **No** | **V3 Sec 3** |
| **Plumbing** | **No** | **V3 Sec 3** |
| **Interior Walls** | **No** | **V3 Sec 3** |
| **Ceilings** | **No** | **V3 Sec 3** |
| **Flooring** | **No** | **V3 Sec 3** |
| **Doors & Windows** | **No** | **V3 Sec 3** |
| **Insulation** | **No** | **V3 Sec 3** |
| **Fire Protection** | **No** | **V3 Sec 3** |
| **Elevator** | **No** | **V3 Sec 3** |
| **Security Features** | **No** | **V3 Sec 3** |
| **Unit Amenities** | **No** | **V3 Sec 3** |
| **Project Amenities** | **No** | **V3 Sec 3** |
| **Laundry Facilities** | **No** | **V3 Sec 3** |
| **Site Improvements** | **No** | **V3 Sec 3** |
| **Landscaping** | **No** | **V3 Sec 3** |
| **Parking Ratio** | **No** | **V3 Sec 3** |
| **Building Footprint** | **No** | **V3 Sec 3** |
| **Site Coverage %** | **No** | **V3 Sec 3** |
| **Functional Design** | **No** | **V3 Sec 3** |
| **Hazardous Materials** | **No** | **V3 Sec 3** |
| **Deferred Maintenance** | **No** | **V3 Sec 3** |
| **Renovation History** | **No** | **V3 Sec 3** |
| **Unit Mix (1BR/2BR/3BR counts)** | **No** | **V3 Sec 3** |
| **Average Unit Size** | **No** | **V3 Sec 3** |

**V3 Section 3 Current State:** ~5 fields
**V3 Section 3 Needed:** ~35 fields

---

### Report Section 13: Market Context

**V3 Section 4 captures narratives**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| National Economic Overview | **No** | **V3 Sec 4** - Narrative/Research |
| Provincial Overview | **No** | **V3 Sec 4** - Narrative/Research |
| Multifamily Market Overview | **No** | **V3 Sec 4** - Narrative/Research |
| Market Vacancy Rate | **No** | **V3 Sec 4** - Research |
| Rent Trend | **No** | **V3 Sec 4** - Research |

---

### Report Section 14: Highest & Best Use

**V3 Section 4 captures narratives**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| As Vacant - Legal | **No** | **V3 Sec 4** - Narrative |
| As Vacant - Physical | **No** | **V3 Sec 4** - Narrative |
| As Vacant - Financial | **No** | **V3 Sec 4** - Narrative |
| As Vacant - Max Productivity | **No** | **V3 Sec 4** - Narrative |
| As Improved | **No** | **V3 Sec 4** - Narrative |
| H&BU Conclusion | **No** | **V3 Sec 4** - Narrative |

---

### Report Sections 15-17: Income, Sales, Reconciliation

**V4 CALCULATOR HANDLES - SKIP IN V3**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| PGI, EGI, NOI | No | **Skip - V4 Calculator** |
| Operating Expenses | No | **Skip - V4 Calculator** |
| Cap Rate | No | **Skip - V4 Calculator** |
| Income Value | No | **Skip - V4 Calculator** |
| Rent Comparables | No | **Skip - V4 Calculator** |
| Sale Comparables | No | **Skip - V4 Calculator** |
| Adjustments | No | **Skip - V4 Calculator** |
| Final Value | No | **Skip - V4 Calculator** |

---

### Report Section 18: Certification

**Template defaults + Valcre**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| Appraiser Name | Template | Static |
| Designation | Template | Static |
| License Number | Template | Static |
| Company Name | Template | Static |
| Signature | Template | Pre-loaded image |
| Certification Text | Template | Standard language |

---

### Report Section 19: Appendices

**V3 Section 5 handles document uploads**

| Report Field | In Valcre? | V3 Assignment |
|--------------|------------|---------------|
| Land Title Certificate | No | V3 Sec 5 - Upload |
| Survey/RPR | No | V3 Sec 5 - Upload |
| Tax Assessment Notice | No | V3 Sec 5 - Upload |
| Additional Documents | No | V3 Sec 5 - Upload |
| Limiting Conditions | Template | Standard text |
| Definitions | Template | Standard text |

---

## SUMMARY: V3 FIELD GAPS

### Section 3 (Building Info) - MAJOR GAP

**Currently Has (~5 fields):**
- Year Built
- Building Size (SF)
- Number of Units
- Parking Spaces
- Legal Description

**Needs to Add (~30 fields):**

**Construction & Structure:**
- Foundation type
- Exterior walls/framing
- Roof type & condition
- Number of stories
- Building format (garden, mid-rise, etc.)

**Building Systems:**
- HVAC system
- Electrical service
- Plumbing
- Insulation
- Fire protection
- Elevator

**Interior Finishes:**
- Interior walls
- Ceilings
- Flooring
- Doors & windows

**Amenities:**
- Unit amenities (list)
- Project amenities (list)
- Laundry facilities
- Security features

**Site Improvements:**
- Landscaping description
- Site improvements (paving, fencing, etc.)
- Parking ratio
- Building footprint SF
- Site coverage %

**Condition:**
- Functional design rating
- Deferred maintenance notes
- Renovation history

**Unit Mix:**
- Studio count + avg SF
- 1BR count + avg SF
- 2BR count + avg SF
- 3BR count + avg SF

---

### Section 4 (Property Research) - MAJOR GAP

**Currently Has (~15 fields):**
- Zoning, Zone Code, Land Use
- Flood Zone, Utilities
- Parcel Number, GBA, NRA
- Assessment data (land/building/total values)

**Needs to Add (~25 fields):**

**Location Narratives:**
- Location overview (text area)
- Access description (text area)
- Public transit description (text area)
- Local area description (text area)
- Surrounding uses (text area)
- Neighborhood trends (text area)
- Nearby schools/services (text area)

**Scores:**
- Walk Score
- Transit Score
- Bike Score

**Site Details:**
- Adjacent uses (N/S/E/W)
- Shape (regular/irregular)
- Topography (level/sloped)
- Drainage (adequate/poor)
- Accessibility rating
- Exposure & visibility
- Site rating
- Easements
- Soils assumptions

**Research Data:**
- Census tract
- Demographics summary
- Current owner name
- Three-year sales history
- Exposure time estimate
- Inspection date

**Market Context:**
- National economic notes
- Provincial economic notes
- Local market overview
- Market vacancy rate
- Rent trend notes

**Highest & Best Use:**
- As vacant - legal (text area)
- As vacant - physical (text area)
- As vacant - financial (text area)
- As improved (text area)
- H&BU conclusion (text area)

**Zoning Details:**
- Zoning description (text area)
- Permitted uses (text area)
- Conforming use (yes/no)
- Zoning conclusion

**Tax Commentary:**
- Assessment comparison notes

---

### Section 5 (Documents) - MODERATE GAP

**Currently Has (8 document types):**
- Land Title Certificate
- Survey Certificate/RPR
- Tax Assessment Notice
- Aerial Photo
- Zoning Map
- Flood Map
- Building Permits
- Site Plan

**Needs to Add:**

**Photo Management (50+ slots):**
- Exterior photos (4+ with captions)
- Street scene photos (2+ with captions)
- Interior common area photos (4+ with captions)
- Unit interior photos (10+ with captions)
- Kitchen/bathroom photos (per unit type)
- System photos (mechanical, electrical, boiler)
- Parking/site photos (2+ with captions)

**Maps:**
- Regional map
- Local area map
- Location map (if different from aerial)

**Additional Documents:**
- Environmental reports
- Building inspection reports
- Rent roll (if available)
- Operating statements (if available)

---

## RECOMMENDED V3 UI STRUCTURE

### Section 3: Building Information

```
┌─────────────────────────────────────────────────────────────────┐
│ Section 3: Building Information                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─── FROM VALCRE (read-only) ─────────────────────────────────┐│
│ │ Year Built: 1970          Number of Buildings: 2            ││
│ │ Building Size: 10,204 SF  Number of Units: 16               ││
│ │ Parking Spaces: 18        Legal Description: Plan C4240...  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── CONSTRUCTION & STRUCTURE ────────────────────────────────┐│
│ │ Foundation: [Concrete ▼]    Exterior Walls: [Wood Frame ▼] ││
│ │ Roof Type: [Flat Membrane ▼] Roof Condition: [Average ▼]   ││
│ │ Stories: [2]                Format: [Garden Style ▼]        ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── BUILDING SYSTEMS ────────────────────────────────────────┐│
│ │ HVAC: [Forced Air + Boiler ▼]  Electrical: [Individual ▼]  ││
│ │ Plumbing: [Standard ▼]         Fire Protection: [None ▼]   ││
│ │ Elevator: [None ▼]             Insulation: [Fiberglass ▼]  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── INTERIOR FINISHES ───────────────────────────────────────┐│
│ │ Interior Walls: [Painted Drywall]                           ││
│ │ Ceilings: [Textured Drywall]                                ││
│ │ Flooring: [Carpet/Vinyl/Laminate Mix]                       ││
│ │ Doors/Windows: [Wood interior, vinyl DG]                    ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── AMENITIES ───────────────────────────────────────────────┐│
│ │ Project Amenities: [☑ Guest Parking] [☑ On-site Laundry]   ││
│ │ Unit Amenities: [☑ Deck/Patio] [☑ Range] [☑ Fridge]        ││
│ │ Security: [☑ Deadbolts] [☑ Exterior Lighting]              ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── UNIT MIX ────────────────────────────────────────────────┐│
│ │ Type      Count    Avg SF    Total SF                       ││
│ │ Studio    [0]      [0]       0                              ││
│ │ 1BR       [8]      [550]     4,400                          ││
│ │ 2BR       [8]      [725]     5,800                          ││
│ │ 3BR       [0]      [0]       0                              ││
│ │ Total     16       638       10,200                         ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── CONDITION ───────────────────────────────────────────────┐│
│ │ Functional Design: [Average ▼]                              ││
│ │ Deferred Maintenance: [Minor items noted ▼]                 ││
│ │ Renovation History: [None significant                    ]  ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Section 4: Property Research

```
┌─────────────────────────────────────────────────────────────────┐
│ Section 4: Property Research                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─── FROM VALCRE (read-only) ─────────────────────────────────┐│
│ │ Zoning: R2    Zone Code: Low Density Residential            ││
│ │ Flood Zone: None    Utilities: All available                ││
│ │ Market: North Battleford    Submarket: Central              ││
│ │ Parcel: 123456789    Site Area: 24,400 SF                   ││
│ │ Land Assessment: $450,000    Building: $1,400,000           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── LOCATION ANALYSIS (Narrative) ───────────────────────────┐│
│ │ Location Overview:                                          ││
│ │ [Located in North Battleford, Saskatchewan, in a          ] ││
│ │ [centrally located urban district...                      ] ││
│ │                                                             ││
│ │ Access & Transportation:                                    ││
│ │ [Fronts 109 Street with connections to Highway 4...       ] ││
│ │                                                             ││
│ │ Surrounding Uses:                                           ││
│ │ [Mature urban district with mix of single-family homes... ] ││
│ │                                                             ││
│ │ Walk Score: [60]  Transit Score: [35]  Bike Score: [55]    ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── SITE DETAILS ────────────────────────────────────────────┐│
│ │ Shape: [Rectangular ▼]      Topography: [Level ▼]          ││
│ │ Drainage: [Adequate ▼]      Accessibility: [Average ▼]     ││
│ │                                                             ││
│ │ Adjacent North: [Residential    ]  South: [Residential   ] ││
│ │ Adjacent East:  [Residential    ]  West:  [Residential   ] ││
│ │                                                             ││
│ │ Easements: [Assumed satisfactory unless noted            ] ││
│ │ Soils: [Assumed suitable for development                 ] ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── MARKET CONTEXT (Narrative) ──────────────────────────────┐│
│ │ National Overview:                                          ││
│ │ [Canada's economy in 2025 finds itself at a crossroads... ] ││
│ │                                                             ││
│ │ Provincial Overview:                                        ││
│ │ [Saskatchewan's economy in 2025 continues...              ] ││
│ │                                                             ││
│ │ Local Market:                                               ││
│ │ [Saskatchewan's rental markets entered 2025 with...       ] ││
│ │                                                             ││
│ │ Market Vacancy: [3.0%]    Rent Trend: [Stable ▼]           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── HIGHEST & BEST USE (Narrative) ──────────────────────────┐│
│ │ As Vacant - Legally Permissible:                            ││
│ │ [R2 zoning permits low/medium density residential...      ] ││
│ │                                                             ││
│ │ As Vacant - Physically Possible:                            ││
│ │ [0.56 acres, rectangular, level topography...             ] ││
│ │                                                             ││
│ │ As Vacant - Financially Feasible:                           ││
│ │ [Multifamily building would likely be most profitable...  ] ││
│ │                                                             ││
│ │ As Improved:                                                ││
│ │ [Continued use as multifamily walkup...                   ] ││
│ │                                                             ││
│ │ Conclusion:                                                 ││
│ │ [The highest and best use is continued multifamily...     ] ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── OWNERSHIP & HISTORY ─────────────────────────────────────┐│
│ │ Current Owner: [102109845 Saskatchewan Ltd.              ] ││
│ │ Sales History: [Ownership has not changed in 3 years     ] ││
│ │ Exposure Time: [6 months ▼]                                ││
│ │ Inspection Date: [October 17, 2025]                        ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Section 5: Documents & Photos

```
┌─────────────────────────────────────────────────────────────────┐
│ Section 5: Documents & Photos                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─── PROPERTY PHOTOS ─────────────────────────────────────────┐│
│ │                                                             ││
│ │ EXTERIOR (4+ required)                                      ││
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    ││
│ │ │ +   │ │ img │ │ img │ │ img │ │ img │                    ││
│ │ │ Add │ │     │ │     │ │     │ │     │                    ││
│ │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                    ││
│ │ Caption: [East Elevation] [West Elevation] [...]           ││
│ │                                                             ││
│ │ STREET VIEWS (2+ required)                                  ││
│ │ ┌─────┐ ┌─────┐ ┌─────┐                                    ││
│ │ │ +   │ │ img │ │ img │                                    ││
│ │ └─────┘ └─────┘ └─────┘                                    ││
│ │                                                             ││
│ │ INTERIOR - COMMON AREAS (4+ required)                       ││
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    ││
│ │ │ +   │ │ img │ │ img │ │ img │ │ img │                    ││
│ │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                    ││
│ │                                                             ││
│ │ INTERIOR - UNIT TYPES (by unit type)                        ││
│ │ 1BR Unit:  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                 ││
│ │            │ +   │ │LR   │ │Kit  │ │Bath │                 ││
│ │            └─────┘ └─────┘ └─────┘ └─────┘                 ││
│ │ 2BR Unit:  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                 ││
│ │            │ +   │ │LR   │ │Kit  │ │BR1  │                 ││
│ │            └─────┘ └─────┘ └─────┘ └─────┘                 ││
│ │                                                             ││
│ │ BUILDING SYSTEMS (mechanical, electrical, etc.)             ││
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                            ││
│ │ │ +   │ │Mech │ │Elec │ │Boil │                            ││
│ │ └─────┘ └─────┘ └─────┘ └─────┘                            ││
│ │                                                             ││
│ │ Photo Count: 25 / 50 minimum                                ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── MAPS ────────────────────────────────────────────────────┐│
│ │ Regional Map:    [Upload ▼] ✓ Uploaded                      ││
│ │ Local Area Map:  [Upload ▼] ✓ Uploaded                      ││
│ │ Aerial Photo:    [Upload ▼] ✓ Uploaded                      ││
│ │ Zoning Map:      [Upload ▼] ✓ Uploaded                      ││
│ │ Site Plan:       [Upload ▼] ✓ Uploaded                      ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─── SUPPORTING DOCUMENTS ────────────────────────────────────┐│
│ │ Land Title Certificate:  [Upload ▼] ✓ Uploaded              ││
│ │ Survey/RPR:              [Upload ▼] ✓ Uploaded              ││
│ │ Tax Assessment Notice:   [Upload ▼] ✓ Uploaded              ││
│ │ Building Permits:        [Upload ▼] Optional                ││
│ │ Environmental Report:    [Upload ▼] Optional                ││
│ │ Rent Roll:               [Upload ▼] Optional                ││
│ │ Operating Statement:     [Upload ▼] Optional                ││
│ │ Additional Documents:    [+ Add Document]                   ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## ACTION ITEMS

### Immediate (V3 Development)

1. **Section 3 - Add ~30 fields:**
   - Construction details (foundation, walls, roof)
   - Building systems (HVAC, electrical, plumbing)
   - Interior finishes
   - Amenities (checkboxes)
   - Unit mix table
   - Condition assessment

2. **Section 4 - Add ~25 fields:**
   - Narrative text areas for location, market, H&BU
   - Site detail dropdowns
   - Scores (walk/transit/bike)
   - Ownership/history fields

3. **Section 5 - Restructure for photos:**
   - Photo gallery with categories
   - 50+ photo slots with captions
   - Keep existing document uploads
   - Add map-specific uploads

### Design Principle

**Visual separation in UI:**
- "FROM VALCRE" section (gray background, read-only)
- "APPRAISER FILLS" section (white background, editable)

This makes it immediately clear what comes from Valcre vs what the appraiser needs to enter.

---

**Document Status:** Complete field reconciliation
**Next Action:** Implement field additions in V3 Sections 3/4/5
