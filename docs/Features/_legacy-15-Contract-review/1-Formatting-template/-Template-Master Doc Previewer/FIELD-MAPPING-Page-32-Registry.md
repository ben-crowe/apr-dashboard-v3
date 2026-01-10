# Field Mapping - Page 32 (Highest & Best Use Analysis)

**Page:** 32 - Market Analysis - Highest & Best Use Conclusion
**Location in HTML:** Lines 1957-1999
**Total Fields:** 3 HBU analysis fields
**Status:** HTML Updated ✅ | Field IDs Converted to kebab-case ✅

---

## Overview

Page 32 presents a comprehensive Highest & Best Use (HBU) analysis for the subject property as if vacant. The page includes:

1. **HBU Analysis Narrative** - Four-step framework evaluating legal, physical, financial, and use constraints
2. **3 Key HBU Field IDs** - Zoning classification, site area, and HBU conclusion
3. **Standard Footer** - (footer fields from page template)

All field IDs have been converted to kebab-case format for consistency with the established registry pattern across all pages.

---

## Field Crosswalk

| # | HTML Field ID (Registry) | Valcre Source | Sample Value | Notes |
|---|-------------------------|---------------|--------------|-------|
| **HBU Analysis Fields - 3 fields** |
| 1 | `zoning-designation` | PROPERTY.ZoningDesignation | "Low Density Residential District (R2)" | Legal constraint - permitted zoning classification |
| 2 | `site-size` | PROPERTY.SiteSize | "0.5601-acres (24,400 SF)" | Physical constraint - total site area |
| 3 | `hbu-conclusion-vacant` | HBU.ConclusionVacant | "Multifamily apartment" | Use conclusion for the property as vacant |

---

## Table Structure

### Highest & Best Use Analysis

**Analysis Approach:**
Uses a four-step framework to evaluate constraints on highest and best use:
1. **Legal Constraints** - Zoning classification and permitted uses
2. **Physical Constraints** - Site dimensions, topography, size
3. **Financial Constraints** - Market demand and economic viability
4. **Conclusion** - Most productive use of the property as vacant

**Content Sections:**
- Introduction paragraph (static)
- Legal analysis paragraph (static, references `zoning-designation`)
- Physical analysis paragraph (static, references `site-size`)
- Financial analysis paragraph (static, describes market conditions)
- Conclusion paragraph (references `hbu-conclusion-vacant`)

**Styling:**
- Header3 titles: 11pt dark blue (#003B7E)
- Body paragraphs: 9pt with 1.3 line-height
- Spacing: Minimal margins (12px top, 3px bottom) for page fit
- Full width layout, justified text

---

## Field Category: Highest & Best Use (HBU)

All 3 Page 32 fields belong to the **highest-best-use** category in the field registry. These fields document the subject property's most productive use as a vacant property.

**Registry Category:** `highest-best-use`

**Field Types:**
- Zoning designation: text (classification string)
- Site size: text (area with unit notation)
- HBU conclusion: text (use type, e.g., "multifamily", "office", "retail")

---

## Data Source: Property Records & Market Analysis

**Sources for These Fields:**
- **Zoning Designation:** City/Municipal Zoning Bylaw and property records
- **Site Size:** Legal property description, survey documents, or property records
- **HBU Conclusion:** Appraiser's analysis combining legal, physical, financial constraints

**How These Fields Are Used:**
1. Page 32 narrative discusses the specific zoning designation
2. Readers understand the physical constraints of the site
3. HBU conclusion is referenced in valuation approaches to justify market rent and expense assumptions

---

## HTML Code Pattern

```html
<p style="font-size: 9pt; line-height: 1.3; margin-bottom: 6px;">
    The Legal Constraints analysis determines the permissible uses according to municipal zoning regulations. 
    The subject property is classified as <span class="field-mapped" data-sample="Low Density Residential District (R2)" title="{{zoning-designation}}">{{zoning-designation}}</span>.
</p>

<p style="font-size: 9pt; line-height: 1.3; margin-bottom: 6px;">
    The Physical Constraints analysis examines the site dimensions and usability. The subject property consists of 
    <span class="field-mapped" data-sample="0.5601-acres (24,400 SF)" title="{{site-size}}">{{site-size}}</span> of land area.
</p>

<!-- ... financial analysis section ... -->

<p style="font-size: 9pt; line-height: 1.3; margin-bottom: 6px;">
    <strong>Highest and Best Use Conclusion:</strong> Based on the above analysis of legal, physical, and financial constraints, 
    the highest and best use of the subject property, as if vacant and available for development, is 
    <span class="field-mapped" data-sample="multifamily apartment" title="{{hbu-conclusion-vacant}}">{{hbu-conclusion-vacant}}</span>.
</p>
```

**Pattern Elements:**
- `class="field-mapped"` - Identifies dynamic content
- `data-sample="..."` - Provides sample value for testing
- `title="{{field-id}}"` - Tooltip shows field ID
- `{{field-id}}` - Mustache template placeholder
- Integrated into flowing paragraphs, not table cells

---

## Field Naming Convention

**Format (kebab-case):**
- `{{zoning-designation}}`
- `{{site-size}}`
- `{{hbu-conclusion-vacant}}`

**Rationale:** Consistent with established field naming pattern across all pages (Pages 31, 37, 39, 44, 49, 59, 61, 63).

**Conversion Date:** December 18, 2025
**Commit:** 7df6bff

---

## Registry Addition Requirements

These 3 fields need to be added to `fieldRegistry.ts`:

```typescript
// Highest & Best Use Analysis Fields (Page 32)
'zoning-designation': {
  id: 'zoning-designation',
  label: 'Zoning Designation',
  type: 'text',
  category: 'highest-best-use',
  description: 'Zoning classification for the subject property (e.g., Low Density Residential)'
},
'site-size': {
  id: 'site-size',
  label: 'Site Size',
  type: 'text',
  category: 'highest-best-use',
  description: 'Total land area in acres and/or square feet'
},
'hbu-conclusion-vacant': {
  id: 'hbu-conclusion-vacant',
  label: 'HBU Conclusion (Vacant)',
  type: 'text',
  category: 'highest-best-use',
  description: 'Appraiser conclusion of highest and best use as if vacant (e.g., multifamily apartment)'
},
```

---

## Page Context

**Section:** Market Analysis (Pages 31-42)
**Purpose:** Analyze property constraints and determine optimal use for valuation
**Relationship to Other Pages:**
- **Page 31:** Saskatchewan market indicators (provincial context)
- **Page 32:** Subject property HBU analysis (property-specific)
- **Pages 37-40:** Rental comparables (validates HBU conclusion)
- **Page 49:** Income approach using HBU assumptions

**Analysis Flow:**
1. Page 31: Market conditions in Saskatchewan
2. Page 32: Property's optimal use given zoning/physical constraints
3. Pages 33-34: Property improvements details
4. Pages 37-40: Comparable rental properties supporting HBU
5. Page 49: Income approach applied using HBU assumptions

---

## Relationship to Other Field Categories

**HBU Analysis depends on:**
- **Zoning fields** (page 29) - Legal constraints
- **Site fields** (pages 23-25) - Physical constraints
- **Property records** - Base data for site size and zoning

**HBU Analysis supports:**
- **Rental comparables** (pages 37-40) - Selected based on HBU conclusion
- **Income approach** (pages 43-50) - Market rent based on HBU use type
- **Sales comparables** (pages 51-61) - Similar properties with same HBU

---

## Testing Checklist

- [x] Field IDs converted to kebab-case
- [x] All 3 HBU fields properly wrapped in `<span class="field-mapped">`
- [x] Table styling consistent with brand (#003B7E, 9pt body)
- [ ] Fields added to fieldRegistry.ts
- [ ] Sample values tested in preview
- [ ] HBU narrative reflects actual property constraints
- [ ] Zoning designation matches municipal records

---

## Notes

- **Page 32 Replacement:** This page completely replaced the old Unit Mix table with HBU analysis. The Unit Mix table has moved to Page 37 as a Rent Roll format.
- **HBU Conclusion Flexibility:** The `hbu-conclusion-vacant` field is phrased as "as if vacant" to comply with USPAP standards for HBU analysis.
- **Narrative vs. Tabular:** Unlike other pages with data-heavy tables, Page 32 uses flowing paragraphs with embedded field IDs to tell the story of the analysis.
- **Appraiser Judgment:** The HBU conclusion represents the appraiser's professional judgment and should be reviewed/updated during appraisal process.

---

**Created:** December 18, 2025
**Last Updated:** December 18, 2025
**Related Commits:** 7df6bff (Page 32 replacement), 43f1730 (TABLE-OF-CONTENTS update)
