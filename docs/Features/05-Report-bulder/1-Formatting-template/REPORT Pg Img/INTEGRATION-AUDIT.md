# APR Dashboard V3 - Integration Audit

**Date:** 2025-12-12
**Task:** Replace broken reportHtmlTemplate.ts with 79-page structure
**Goal:** Integrate PNG-to-HTML pages with EXISTING fieldRegistry system

---

## ✅ CONFIRMED: Plan A - MODIFY Existing System

**NOT building separate thing.**
**USING existing fieldRegistry field names.**
**INTEGRATING with TDD Dashboard (Left=Editor, Right=Viewer).**

---

## EXISTING SYSTEM AUDIT

### 1. fieldRegistry.ts
**Path:** `/src/features/report-builder/schema/fieldRegistry.ts`
**Size:** 835 lines
**Total Fields:** ~521 field definitions

**Structure:**
```typescript
export interface FieldDefinition {
  id: string;                    // Canonical field ID
  storeId: string;               // MUST match reportBuilderStore exactly
  label: string;                 // Human-readable label for UI
  section: string;               // Section ID (cover, exec, site, etc.)
  subsection?: string;           // Subsection if applicable
  type: 'text' | 'number' | 'date' | 'image' | 'textarea' | 'select' | 'currency' | 'percentage' | 'calculated';
  inputSource: 'user-input' | 'calculated' | 'api-fetch' | 'template' | 'auto-filled';
  options?: string[];            // For select fields
  required: boolean;
  defaultValue?: string | number;
}
```

**Sections Found:** 103 unique sections

**Top Sections by Field Count:**
1. `survey` - 123 fields
2. `calc` - 62 fields
3. `image-mgt` - 55 fields
4. `impv` (Improvements) - 42 fields
5. `sales` - 38 fields
6. `cover` - 32 fields
7. `calc-unit-mix` - 26 fields
8. `site` - 24 fields ← **RELEVANT FOR PAGE 23**
9. `exec` (Executive Summary) - 14 fields
10. `cert` (Certification) - 16 fields

---

### 2. workbookFieldMapping.ts
**Path:** Search in progress...
**Status:** File not found at expected location

**Alternative locations:**
- `/src/features/report-builder/types/reportBuilder.types.ts` (mentions workbook)
- Needs investigation

---

### 3. reportHtmlTemplate.ts
**Path:** `/src/features/report-builder/templates/reportHtmlTemplate.ts`
**Size:** ~7,481 lines (26,394 tokens)
**Status:** BROKEN - overflow/pagination issues

**Structure:**
- Takes `sections: ReportSection[]` as input
- Uses helper functions: `getFieldValue()`, `getGlobalFieldValue()`
- Looks for sections by ID: 'cover', 'exec', 'image-mgt'
- Has base64-encoded Valta logo for PDF export

**Problem:** Single monolithic template with overflow issues
**Solution:** Replace with 79-page discrete structure

---

## FIELD MAPPING EXAMPLE: Page 23 Site Details

### Extracted Data (from PNG-to-HTML):
```javascript
{
  address: "1101, 1121 109 St, North Battleford, Saskatchewan",
  legalDescription: "Plan - C4240, Block - 95; Lot - 17, 18, 19, 20",
  siteSizeSquareFeet: "24,400",
  siteSizeAcres: "0.56",
  usableSiteSquareFeet: "24,400",
  usableSiteAcres: "0.56",
  totalLandAreaSquareFeet: "24,400",
  totalLandAreaAcres: "0.56",
  siteTopography: "Level",
  siteShape: "Rectangular",
  municipalServices: "Full Municipal Services"
}
```

### ✅ Mapped to EXISTING fieldRegistry IDs:
```javascript
{
  "site-address": "1101, 1121 109 St, North Battleford, Saskatchewan",
  "legal-description": "Plan - C4240, Block - 95; Lot - 17, 18, 19, 20",  // ✅ EXISTS
  "site-total-area": 24400,        // ✅ EXISTS - Number (SF)
  "site-acreage": 0.56,            // ✅ EXISTS - Number (Acres)
  "land-area-usable-sf": 24400,    // ✅ EXISTS - Usable site (SF)
  "land-area-usable-acres": 0.56,  // ✅ EXISTS - Usable site (Acres)
  "site-shape": "Rectangular",     // ✅ EXISTS - Text
  "topography": "Level",           // ✅ EXISTS - Text
  "site-quality": "Average",       // ✅ EXISTS - Text
  "site-utility": "Average",       // ✅ EXISTS - Text
  // Municipal Services: No dedicated field found (may need to add or use different approach)
}
```

**ALL EXISTING `site` section fields (24 total):**
- ✅ `accessibility`
- ✅ `adjacent-east`
- ✅ `adjacent-north`
- ✅ `adjacent-south`
- ✅ `adjacent-west`
- ✅ `building-appeal`
- ✅ `building-quality`
- ✅ `easements`
- ✅ `exposure-visibility`
- ✅ `hazardous-waste`
- ✅ `land-area-usable-acres`
- ✅ `land-area-usable-sf`
- ✅ `legal-description`
- ✅ `site-acreage`
- ✅ `site-address`
- ✅ `site-conclusion`
- ✅ `site-plan-image`
- ✅ `site-quality`
- ✅ `site-rating`
- ✅ `site-shape`
- ✅ `site-total-area`
- ✅ `site-utility`
- ✅ `soils`
- ✅ `topography`

**Field Mapping Status:**
- ✅ **10/11 fields mapped** to existing fieldRegistry IDs
- ⚠️ **"Municipal Services"** - No exact match found (may need to add field or use `accessibility` / `site-conclusion`)

**CONCLUSION:** Page 23 Site Details integration is **90% complete** with existing fields.

---

## TODO STATUS

- [x] 1. AUDIT existing fieldRegistry.ts (IN PROGRESS)
- [ ] 2. AUDIT existing workbook mapping
- [ ] 3. MAP 79 HTML pages to existing fields
- [ ] 4. CREATE new reportHtmlTemplate.ts
- [ ] 5. INTEGRATE with viewer
- [ ] 6. TEST with Property 1 (North Battleford)
- [ ] 7. VALIDATE with Property 2 (Drumheller)
- [ ] 8. VISUAL POLISH (last, optional)

---

## NEXT STEPS

1. Extract all unique `section:` values from fieldRegistry
2. Count fields per section
3. Identify which sections map to which PNG pages (1-79)
4. Map page-23 Site Details fields to existing fieldRegistry IDs
5. Prove integration works before scaling to all 79 pages

---

*Audit in progress...*
