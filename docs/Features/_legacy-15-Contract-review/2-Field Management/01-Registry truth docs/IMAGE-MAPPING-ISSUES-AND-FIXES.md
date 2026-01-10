# Image Mapping Issues & Fixes

## Current Issues in northBattlefordTestData.ts

### Issue 1: Wrong Image Assignments

| Field ID | Currently Points To | Should Be |
|----------|--------------------|-----------| 
| `img-map-regional` | image1.png (company logo) | image36.png (regional map) |
| `rental-comp1-photo` | image44.png (site plan) | Actual rental comp photo |
| `rental-comp2-photo` | image45.png (site plan) | Actual rental comp photo |

### Issue 2: Duplicate Mappings

| Image File | Mapped To Multiple Fields |
|------------|---------------------------|
| image1.png | `company-logo`, `img-map-regional` |
| image2.jpeg | `cover-photo`, `subject-photo` |
| image44.png | `img-site-plan-1`, `rental-comp1-photo` |
| image45.png | `img-site-plan-2`, `rental-comp2-photo` |

### Issue 3: Missing Mappings (41 fields)

Registry defines these image fields but test data has no paths:

**Exterior Photos (should use subject-photo images):**
- `img-exterior-1` through `img-exterior-6`

**Interior/Common Photos:**
- `img-common-1` through `img-common-4`
- `img-unit-1` through `img-unit-6`

**Street Views:**
- `img-street-1` through `img-street-3`

**System Photos:**
- `img-systems-1` through `img-systems-4`

**Maps (duplicates with different naming):**
- `img-map-aerial-1`, `img-map-aerial-2`
- `img-cover-photo` (duplicate of `cover-photo`)
- `map-regional`, `map-local`, `map-aerial` (duplicates of `img-map-*`)

**Signatures:**
- `appraiser1-signature`
- `cert-signature`
- `img-signature`

---

## Recommended Fixes

### Fix 1: Correct the Misassignments

```typescript
// In northBattlefordTestData.ts, change:
"img-map-regional": "/extracted-images/image36.png",  // Was image1.png
"rental-comp1-photo": "[need actual rental comp photo]",
"rental-comp2-photo": "[need actual rental comp photo]",
```

### Fix 2: Decide on Duplicate Field Strategy

**Option A: Keep Both, Point to Same Image**
- `cover-photo` and `img-cover-photo` both → image2.jpeg
- Allows template flexibility

**Option B: Consolidate in Registry**
- Remove duplicates from fieldRegistry.ts
- Pick one canonical name

**Recommendation:** Option A for now, clean up later.

### Fix 3: Add Missing Mappings

For fields like `img-exterior-1`, you can either:
1. Map to existing subject-photo images
2. Leave empty (optional fields)
3. Add placeholder images

```typescript
// Map exterior to subject photos (if reusing):
"img-exterior-1": "/extracted-images/image12.jpeg",  // Same as subject-photo-1
"img-exterior-2": "/extracted-images/image13.jpeg",  // Same as subject-photo-2
// ... etc
```

---

## Correct Image Assignments

Based on my extraction analysis:

| Field ID | Correct Image | Description |
|----------|---------------|-------------|
| `company-logo` | image1.png | Valta logo |
| `cover-photo` | image2.jpeg | Building exterior |
| `img-cover-photo` | image2.jpeg | Same as above |
| `subject-photo` | image2.jpeg | Same as cover |
| `subject-photo-1` | image12.jpeg | Thumbnail 1 |
| `subject-photo-2` | image13.jpeg | Thumbnail 2 |
| ... | ... | ... |
| `subject-photo-24` | image35.jpeg | Thumbnail 24 |
| `img-map-regional` | image36.png | Saskatchewan regional map |
| `img-map-aerial` | image37.png | Aerial view |
| `img-map-local` | image38.png | Local area map |
| `img-site-plan-1` | image44.png | Parcel plat |
| `img-site-plan-2` | image45.png | Second parcel plat |
| `img-zoning-map` | image48.png | Zoning map |
| `img-comparables-map` | image72.png | Sales comp map |
| `img-rental-comparables-map` | image57.png | Rental comp map |
| `comp1-photo` | image73.jpg | Heritage House |
| `comp1-map` | image74.png | Comp 1 location |
| `comp2-photo` | image75.jpg | College View Apts |
| `comp2-map` | image76.png | Comp 2 location |
| `comp3-photo` | image77.jpg | Woodland Estates |
| `comp3-map` | image78.png | Comp 3 location |
| `comp4-photo` | image79.png | Parkside Flats 1 |
| `comp4-map` | image80.png | Comp 4 location |
| `comp5-photo` | image81.png | Parkside Flats 2 |
| `comp5-map` | image82.png | Comp 5 location |

---

## Rental Comp Photos - Missing

The Word document didn't have separate rental comp photos embedded. Options:

1. **Use Valcre URLs:** The test data has `comp1-photo-url` fields with CDN links
2. **Leave blank:** Mark as optional
3. **Reuse sales comp photos:** If same properties

---

*Created: 2025-12-23*
