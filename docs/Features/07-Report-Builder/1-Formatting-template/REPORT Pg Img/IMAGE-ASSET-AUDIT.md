# Image Asset Audit - North Battleford Report

**Date:** 2025-12-12
**Context:** Investigating where actual images are stored and how to integrate them

---

## ✅ IMAGES FOUND

**Location:** `/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/images/`

**Total:** **89 image files**
- Mix of PNG and JPG
- Named sequentially: `image1.png`, `image2.png`, ..., `image89.jpg`
- Extracted from .docx file (via Pandoc/Mammoth conversion)

**File Sizes:**
- Logo images: ~34-40KB (small)
- Maps: ~1-4MB (large - image16.png = 1.6MB, image32.png = 1.1MB)
- Photos: ~20-150KB (medium)
- Signatures: ~4KB (very small - image34.png = 4.3KB)

---

## EXISTING SYSTEM: How reportHtmlTemplate.ts Handles Images

**From reportHtmlTemplate.ts (line 194-200):**
```typescript
// Extract cover photo from the img-cover-photo field (may be in cover or image-mgt section)
const coverPhotoValue = getGlobalFieldValue('img-cover-photo');

// Extract appraiser signature from the img-signature field
const signatureValue = getGlobalFieldValue('img-signature');
```

**How it works:**
1. `getGlobalFieldValue()` searches ALL sections for a field
2. Pulls value from fieldRegistry field (e.g., `img-cover-photo`, `img-signature`)
3. Value is expected to be a **base64-encoded data URL** or image path

**Example from reportHtmlTemplate.ts (line 6880):**
```html
<img src="${VALTA_LOGO_BASE64}" alt="Valta Property Valuations" class="cover-logo" />
```

**Valta Logo:**
- Stored as **base64-encoded data URL** constant
- Embedded directly in template
- No external file dependency (works in PDF export)

---

## IMAGE FIELDS IN fieldRegistry.ts

**From `image-mgt` section (55 fields total):**

**Cover/Signature:**
- `img-cover-photo` - Main property image
- `img-signature` - Appraiser signature

**Maps:**
- `img-map-regional` - Province/region context
- `img-map-local` - City/neighborhood
- `img-map-aerial-1` - Bird's eye view
- `img-map-aerial-2` - Site boundary
- `img-zoning-map` - Municipal zoning
- `img-site-plan-1` - Layout/footprint
- `img-site-plan-2` - Survey/plot plan

**Exterior Photos (6):**
- `img-exterior-1` + `img-exterior-1-caption`
- `img-exterior-2` + `img-exterior-2-caption`
- ... through `img-exterior-6`

**Street Photos (3):**
- `img-street-1` + `img-street-1-caption`
- `img-street-2` + `img-street-2-caption`
- `img-street-3` + `img-street-3-caption`

**Common Area Photos (4):**
- `img-common-1` through `img-common-4` (with captions)

**Unit Interior Photos (6):**
- `img-unit-1` through `img-unit-6` (with captions)

**Building Systems Photos (4):**
- `img-systems-1` through `img-systems-4` (with captions)

**Total image slots:** ~35 images + captions

---

## PROBLEM: Mapping Sequential Images to Semantic Fields

**Current state:**
- Images extracted: `image1.png`, `image2.png`, ..., `image89.png`
- fieldRegistry expects: `img-cover-photo`, `img-exterior-1`, `img-map-regional`, etc.

**Question:** Which `image##.png` corresponds to which semantic field?

**Options:**

### Option A: Manual Mapping (Tedious)
View each image, identify what it shows, map to field name
- `image1.png` → Valta logo?
- `image8.png` → Cover photo?
- `image16.png` (1.6MB) → Regional map?
- etc.

### Option B: OCR/AI Detection (Automated)
Use vision AI to classify images:
- "This is a logo"
- "This is a property exterior"
- "This is a map"

### Option C: Page-by-Page Context (Best for 79-page approach)
- Page 7 has a placeholder `[LOGO: valta-logo.png]`
- That page in the original PDF had image## at that location
- Map page position → image number → semantic meaning

---

## NEXT STEPS

1. **Find which pages have image placeholders** (already found 24 pages)
2. **Match placeholder text to original PDF page images**
3. **Create mapping:** `image## → fieldRegistry field ID`
4. **Convert images to base64** (for PDF export compatibility)
5. **Update 79-page template** to use actual images vs. placeholders

---

## QUESTIONS FOR USER

1. Do you have a mapping of which image## corresponds to what?
2. Should we use base64-encoded images (like Valta logo) or file paths?
3. Where should production images be stored?
   - In `/public/images/` for web app?
   - Converted to base64 for PDF export?
   - Both?

---

*Audit in progress...*
