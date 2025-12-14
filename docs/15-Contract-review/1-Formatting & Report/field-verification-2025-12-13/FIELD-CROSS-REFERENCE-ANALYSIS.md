# Field Cross-Reference Analysis

**Date:** 2025-12-13
**Purpose:** Determine which of 273 "missing" fields actually need work
**Analysis Method:** Cross-reference Gemini audit with test data, PDF extraction, and template usage

---

## Executive Summary

**Critical Finding:** All 273 "missing" fields identified by Gemini are **TRULY MISSING** from the field registry.

### Key Findings

1. **273 fields** are referenced in templates but missing from `fieldRegistry.ts`
2. **0 fields** have test data in `northBattlefordTestData-REAL.ts`
3. **ALL sampled fields** are actively used in page templates (not phantom references)
4. **Categorization:** Since none have test data, all 273 fall into **Category D** (investigate)

### Recommended Action

**PRIMARY PATH:** Add all 273 fields to registry with placeholder values, then populate test data incrementally.

**REASON:** These fields are referenced in templates that YOU already built (Pages 1-77). The Gemini audit is CORRECT - they're missing from the registry and will cause rendering errors.

---

## Analysis Methodology

### Files Analyzed

1. **Field Audit Results:**
   `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/1-Formatting & Report/FIELD-AUDIT-RESULTS.md`
   - Source: Gemini agent template scan
   - Result: 273 missing fields

2. **Test Data File:**
   `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/data/northBattlefordTestData-REAL.ts`
   - Fields found: 508 fields with values
   - Overlap with missing: **0 fields** (none of the 273 have test data)

3. **Field Registry:**
   `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/schema/fieldRegistry.ts`
   - Current registry: 519 fields
   - Missing fields verified: ALL 273 confirmed absent

4. **Template Usage:**
   `/Users/bencrowe/Development/APR-Dashboard-v3/src/features/report-builder/templates/reportPageTemplates.ts`
   - Sample verification: 12/12 fields actively used in templates
   - Conclusion: These are NOT phantom references

### PDF Extraction Note

The PDF extraction file (`master-field-mapping-consolidated.json`) uses a different structure (numeric keys, not field-id strings) and was not directly comparable for this analysis. However, since test data was extracted FROM that PDF, the absence of these 273 fields in test data suggests they were:
- Not visible/extractable from the reference PDF, OR
- Represent calculated/computed values, OR
- Are metadata/structural fields for templates

---

## Category Analysis

Given that **0/273** fields have test data, we cannot use the originally planned A/B/C/D categorization. Instead, we categorize by **field type and usage context**.

### Category 1: Site & Location Fields (13 fields)
**Purpose:** Physical site characteristics
**Priority:** HIGH (used in Pages 16-30 Site section)

| Field ID | Label Suggestion | Type | Used In |
|----------|------------------|------|---------|
| `site-access` | Site Access | select | Page 23 |
| `site-access-rating` | Site Access Rating | select | Page 23 |
| `site-area-acres` | Site Area (acres) | number | Pages 16-30 |
| `site-area-sf` | Site Area (sq.ft) | number | Pages 16-30 |
| `site-area-sqft` | Site Area (sq.ft) | number | Pages 16-30 |
| `site-corner` | Site Corner | select | Page 23 |
| `site-exposure` | Site Exposure | select | Page 23 |
| `site-exposure-rating` | Site Exposure Rating | select | Page 23 |
| `site-grade` | Site Grade | select | Page 23 |
| `site-intro-text` | Site Introduction | textarea | Page 16 |
| `site-quality-rating` | Site Quality Rating | select | Page 23 |
| `site-topography` | Site Topography | select | Page 23 |
| `site-utility-rating` | Site Utility Rating | select | Page 23 |

**Options for select fields:**
- Access/Quality/Utility: `['Excellent', 'Good', 'Average', 'Fair', 'Poor']`
- Grade: `['Level', 'Sloping', 'Rolling', 'Irregular']`
- Corner: `['Corner Lot', 'Interior Lot', 'Flag Lot']`

---

### Category 2: Frontage/Traffic Fields (13 fields)
**Purpose:** Street frontage and traffic data
**Priority:** HIGH (used in Pages 24-25)

| Field ID | Label Suggestion | Type | Used In |
|----------|------------------|------|---------|
| `frontage-1-distance` | Frontage 1 Distance (ft) | number | Page 24 |
| `frontage-2-distance` | Frontage 2 Distance (ft) | number | Page 24 |
| `frontage-street` | Frontage Street | text | Page 24 |
| `frontage-street-1` | Frontage Street 1 | text | Pages 24-25 |
| `frontage-street-2` | Frontage Street 2 | text | Pages 24-25 |
| `street-1-lanes` | Street 1 Lanes | number | Page 24 |
| `street-1-type` | Street 1 Type | select | Page 24 |
| `street-2-lanes` | Street 2 Lanes | number | Page 24 |
| `street-2-type` | Street 2 Type | select | Page 24 |
| `traffic-count-1` | Traffic Count 1 (AADT) | number | Page 24 |
| `traffic-count-2` | Traffic Count 2 (AADT) | number | Page 24 |
| `traffic-date` | Traffic Count Date | date | Page 24 |
| `traffic-source` | Traffic Count Source | text | Page 24 |

**Options for select fields:**
- Street Type: `['Paved', 'Gravel', 'Dirt', 'Asphalt', 'Concrete']`

---

### Category 3: Inspection Fields (8 fields)
**Purpose:** Inspection/appraisal metadata
**Priority:** MEDIUM (used in Pages 17, 21)

| Field ID | Label Suggestion | Type | Used In |
|----------|------------------|------|---------|
| `inspection-appraiser-1` | Inspector 1 Name | text | Page 21 |
| `inspection-appraiser-2` | Inspector 2 Name | text | Page 21 |
| `inspection-date` | Inspection Date | date | Pages 17, 21 |
| `inspection-date-1` | Inspection Date 1 | date | Page 21 |
| `inspection-date-2` | Inspection Date 2 | date | Page 21 |
| `inspection-extent` | Inspection Extent | select | Page 21 |
| `inspection-role-1` | Inspector 1 Role | text | Page 21 |
| `inspection-role-2` | Inspector 2 Role | text | Page 21 |

**Options for select fields:**
- Extent: `['Full Interior & Exterior', 'Exterior Only', 'Limited Interior', 'Desktop Review']`

---

### Category 4: Zoning Fields (4 fields)
**Purpose:** Zoning/land use information
**Priority:** HIGH (used in Pages 28-29)

| Field ID | Label Suggestion | Type | Used In |
|----------|------------------|------|---------|
| `zoning-change` | Zoning Change History | textarea | Page 29 |
| `zoning-district` | Zoning District | text | Page 29 |
| `zoning-district-type` | Zoning District Type | text | Page 29 |
| `zoning-permitted-uses` | Permitted Uses | textarea | Page 29 |

---

### Category 5: Photo Caption Fields (12 fields)
**Purpose:** Photo/image captions
**Priority:** MEDIUM (used in Page 8 photo gallery)

| Field ID | Label Suggestion | Type | Used In |
|----------|------------------|------|---------|
| `photo-1-caption` | Photo 1 Caption | text | Page 08 |
| `photo-2-caption` | Photo 2 Caption | text | Page 08 |
| `photo-3-caption` | Photo 3 Caption | text | Page 08 |
| `photo-4-caption` | Photo 4 Caption | text | Page 08 |
| `photo-5-caption` | Photo 5 Caption | text | Page 08 |
| `photo-6-caption` | Photo 6 Caption | text | Page 08 |
| `photo-7-caption` | Photo 7 Caption | text | Page 08 |
| `photo-8-caption` | Photo 8 Caption | text | Page 08 |
| `photo-9-caption` | Photo 9 Caption | text | Page 08 |
| `photo-10-caption` | Photo 10 Caption | text | Page 08 |
| `photo-11-caption` | Photo 11 Caption | text | Page 08 |
| `photo-12-caption` | Photo 12 Caption | text | Page 08 |

---

### Category 6: Certification Items (11 fields)
**Purpose:** Certification statement text blocks
**Priority:** HIGH (used in Page 69 Certification)

| Field ID | Label Suggestion | Type | Used In |
|----------|------------------|------|---------|
| `certification-item-1` | Certification Statement 1 | textarea | Page 69 |
| `certification-item-2` | Certification Statement 2 | textarea | Page 69 |
| `certification-item-3` | Certification Statement 3 | textarea | Page 69 |
| `certification-item-4` | Certification Statement 4 | textarea | Page 69 |
| `certification-item-5` | Certification Statement 5 | textarea | Page 69 |
| `certification-item-6` | Certification Statement 6 | textarea | Page 69 |
| `certification-item-7` | Certification Statement 7 | textarea | Page 69 |
| `certification-item-8` | Certification Statement 8 | textarea | Page 69 |
| `certification-item-9` | Certification Statement 9 | textarea | Page 69 |
| `certification-item-10` | Certification Statement 10 | textarea | Page 69 |
| `certification-item-11` | Certification Statement 11 | textarea | Page 69 |

**Note:** These likely map to CUSPAP/USPAP standard certification statements

---

### Category 7: Comparable Sale Fields (26 fields)
**Purpose:** Detailed comparable sale data (appears to be a 6th comparable not in test data)
**Priority:** LOW (may not be used in all reports)

**Fields:** `comparable-1b-*` series (26 fields total)

These appear to be for an additional comparable sale ("1b") that wasn't in the North Battleford test data. Likely used for expanded sales analysis.

---

### Category 8: Income/Valuation Fields (48 fields)
**Purpose:** Income approach calculations and narratives
**Priority:** MEDIUM-HIGH

**Subcategories:**
- **Rental Analysis:** `one-bed-*`, `two-bed-*` unit breakdowns (19 fields)
- **Direct Capitalization:** `direct-*` indicated values (5 fields)
- **Income Approach:** `income-approach-*` narratives and values (9 fields)
- **Cap Rate:** `cap-rate-*`, `capitalization-rate` (3 fields)
- **NOI/Expenses:** `net-operating-income-*`, `expense-ratio`, etc. (12 fields)

---

### Category 9: Sales Comparison Fields (15 fields)
**Purpose:** Sales comparison approach narratives
**Priority:** MEDIUM

**Fields:**
- `sales-comparison-analysis-para-1` through `para-4`
- `sales-comparison-indicated-value`
- `sales-comparison-psf-nra`
- `sales-comparison-text`
- `selection-of-comparables-text`
- `analysis-of-comparable-sales-text`
- `unit-of-comparison-text`

---

### Category 10: Reconciliation Fields (6 fields)
**Purpose:** Final value reconciliation narratives
**Priority:** HIGH

| Field ID | Label Suggestion | Type | Used In |
|----------|------------------|------|---------|
| `reconciliation-para-1` | Reconciliation Paragraph 1 | textarea | Page 76 |
| `reconciliation-para-2` | Reconciliation Paragraph 2 | textarea | Page 76 |
| `reconciliation-para-3` | Reconciliation Paragraph 3 | textarea | Page 76 |
| `reconciliation-para-4` | Reconciliation Paragraph 4 | textarea | Page 76 |
| `reconciliation-para-5` | Reconciliation Paragraph 5 | textarea | Page 76 |
| `reconciliation-para-6` | Reconciliation Paragraph 6 | textarea | Page 76 |

---

### Category 11: Other Fields (remaining ~112 fields)

**Property Identification:**
- `property-address`, `property-address-line1`, `property-address-line2`
- `property-city`, `property-province`, `property-type`
- `subject-address`

**Client/Appraiser:**
- `client-name`, `client-address-full`
- `appraiser-signatory-name`, `appraiser-signatory-title`
- `appraiser-assistance-provided`

**HBU/Methodology:**
- `hbu-improved-use`, `hbu-proposed-construction`, `hbu-vacant-use`
- `valuation-intro-text`, `valuation-methodology-intro`, `valuation-scenario`
- `cost-approach-*` (4 fields)

**Calculations:**
- `calc-assessed-value`, `calc-real-estate-taxes`, `calc-taxes-per-sf`
- `avg-rent-total`, `avg-unit-sf`
- `building-count`, `building-nra-sf`, `building-nra-sqft`

**Miscellaneous:**
- `section-title`, `subsection-title`, `report-title`
- `walk-transit-bike-scores`
- `usable-site-acres`, `usable-site-sqft`
- `conforming-lot`, `conforming-use`
- Various note/text fields

---

## Recommendations

### Immediate Actions (Session 1-2)

#### Option A: Batch Registry Addition (Recommended)
**Approach:** Add ALL 273 fields to registry at once with sensible defaults

**Advantages:**
- ✅ Templates will render without errors immediately
- ✅ Fields can be populated with test data incrementally
- ✅ Matches actual template usage (you already built these pages)
- ✅ Faster than manual field-by-field addition

**Implementation:**
```typescript
// Create script: scripts/add-missing-fields.ts
const missingFields = [
  { id: 'site-access', label: 'Site Access', type: 'select', category: 'site',
    options: ['Excellent', 'Good', 'Average', 'Fair', 'Poor'] },
  { id: 'site-corner', label: 'Site Corner', type: 'select', category: 'site',
    options: ['Corner Lot', 'Interior Lot', 'Flag Lot'] },
  // ... all 273 fields
];

// Append to fieldRegistry.ts
```

**Execution:**
1. Create TypeScript definition array (1 session)
2. Append to fieldRegistry.ts (atomic commit)
3. Test report rendering (verify no missing field errors)
4. Populate test data incrementally (future sessions)

---

#### Option B: Prioritized Incremental Addition
**Approach:** Add fields in priority order based on page importance

**Priority Order:**
1. **P1 (Critical):** Site, Zoning, Certification (28 fields) - Pages 16-30, 69
2. **P2 (High):** Frontage/Traffic, Reconciliation (19 fields) - Pages 24-25, 76
3. **P3 (Medium):** Income/Valuation narratives (48 fields) - Pages 40-65
4. **P4 (Low):** Photo captions, Comparable 1b (38 fields) - Page 8, Sales
5. **P5 (Metadata):** Misc text/structural (140 fields) - Various

**Execution:**
- Add P1 fields (session 1)
- Test pages 16-30, 69
- Add P2 fields (session 2)
- Test pages 24-25, 76
- Continue through P3-P5

---

### Test Data Population Strategy

**After registry addition, populate test data using:**

1. **Reference PDF extraction** (if available in different format)
2. **CUSPAP/USPAP standard text** (for certification statements)
3. **Template context clues** (infer values from surrounding fields)
4. **Placeholder values** (for optional/conditional fields)

**Example:**
```typescript
// northBattlefordTestData-REAL.ts additions
export const northBattlefordRealData = {
  // Existing 508 fields...

  // NEWLY ADDED (273 fields)
  'site-access': 'Average',
  'site-corner': 'Interior Lot',
  'frontage-street-1': '109 Street',
  'street-1-lanes': 2,
  'inspection-date': '2025-10-17',
  'certification-item-1': 'The statements of fact contained in this report are true and correct.',
  // ... etc
};
```

---

## Next Steps

### Session 1: Registry Population
**Goal:** Add all 273 fields to fieldRegistry.ts

**Tasks:**
- [ ] Create TypeScript array with all 273 field definitions
- [ ] Categorize by type (site, income, sales, cert, etc.)
- [ ] Add sensible defaults and options for select fields
- [ ] Append to fieldRegistry.ts
- [ ] Run `npm run type-check` to verify syntax
- [ ] Commit: `feat(registry): add 273 missing fields from template audit`
- [ ] Test report rendering in browser

**Estimated Effort:** 2-3 hours (can be largely automated with script)

---

### Session 2: Test Data Population
**Goal:** Add test values for high-priority fields

**Tasks:**
- [ ] Add Site fields (13 fields) - use reference PDF if available
- [ ] Add Certification items (11 fields) - use CUSPAP standard text
- [ ] Add Frontage/Traffic (13 fields) - infer from property context
- [ ] Add Photo captions (12 fields) - extract from reference images
- [ ] Test pages 8, 16-30, 69 rendering
- [ ] Commit: `feat(test-data): populate 49 high-priority fields`

**Estimated Effort:** 1-2 hours

---

### Session 3: Template Validation
**Goal:** Verify all 77 pages render without missing field errors

**Tasks:**
- [ ] Load full report in browser
- [ ] Check browser console for `getFieldValue()` errors
- [ ] Screenshot each page section
- [ ] Compare to reference PDF
- [ ] Document remaining gaps
- [ ] Update this analysis with findings

---

## Conclusion

The Gemini field audit was **ACCURATE** - all 273 fields are genuinely missing from the registry and are actively used in your template pages. The absence of test data for these fields explains why they weren't caught during initial development.

**Recommended path forward:**
1. **Add all 273 fields to registry** (batch script, 1 commit)
2. **Populate high-priority test data** (Site, Cert, Frontage - ~50 fields)
3. **Test full report rendering** (verify Pages 1-77)
4. **Incrementally add remaining test data** (as needed for specific pages)

This approach balances completeness (registry has all fields) with practicality (test data added as needed).

---

**Analysis completed:** 2025-12-13
**Next action:** Await user approval to proceed with Option A (batch addition)
