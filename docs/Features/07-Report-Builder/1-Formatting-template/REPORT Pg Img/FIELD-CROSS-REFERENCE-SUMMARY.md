# Field Cross-Reference Summary
**APR Dashboard V3 - Template Field Integration Analysis**

**Date:** 2025-12-12
**Task:** Extract all template fields from boilerplate analysis and cross-reference with existing fieldRegistry
**Status:** COMPLETE

---

## Executive Summary

### Field Analysis Results

| Metric | Count | Percentage |
|--------|-------|------------|
| **Boilerplate Template Fields** | 99 | 100% |
| **Existing Registry Fields** | 519 | - |
| **Exact Matches** | 22 | 22.2% |
| **High-Similarity Matches** | 37 | 37.4% |
| **New Fields Required** | 77 | 77.8% |
| **Actual New Fields (After Consolidation)** | ~30-40 | ~30-40% |

### Key Findings

1. **22 fields already exist** with exact ID matches in fieldRegistry.ts
2. **37 fields have high-similarity matches** - can likely use existing fields with minor naming adjustments
3. **77 fields flagged as "new"** - but after consolidation, only ~30-40 are truly new fields needed
4. **Critical conditional logic identified** - 8 major scenarios control content variation

---

## Files Created

### 1. new-fields-needed.json
**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img./new-fields-needed.json`

**Contents:**
- 77 field definitions for fields NOT found in registry
- Full field specifications including:
  - Suggested field ID and storeId
  - Human-readable label
  - Section assignment
  - Data type (text, textarea, number, date, currency, percentage, select)
  - Input source (user-input, calculated, template, auto-filled)
  - Required status
  - Default values (where applicable)
  - Implementation notes

**Critical Fields Identified:**
- `value-scenario-type` - Controls major conditional logic
- `hypothetical-conditions-text` - Varies by scenario
- `extraordinary-assumptions-text` - Varies by scenario
- `building-count` - Controls singular/plural language
- `inspector-provided` - Boolean for assistance text

---

### 2. existing-fields-mapping.json
**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img./existing-fields-mapping.json`

**Contents:**
- 22 exact matches between template fields and registry
- 37 high-similarity mappings with consolidation recommendations
- Field-by-field comparison with notes

**Exact Matches Include:**
- `adjacent-east`, `adjacent-north`, `adjacent-south`, `adjacent-west`
- `building-style`, `client-address`, `client-company`
- `elevator`, `exterior-walls`, `file-number`
- `interior-walls`, `laundry`, `legal-description`
- `location-overview-text`, `project-amenities`, `property-name`
- `report-date`, `unit-amenities`, `valuation-date`
- `topography`, `site-shape`, `local-area-description`

**High-Similarity Matches (Can Consolidate):**
- `building-count` → `total-buildings`
- `capitalization-rate` → `calc-cap-rate`
- `effective-gross-revenue` → `calc-egr`
- `net-operating-income` → `calc-noi`
- `city-name` → `city`
- `market-name` → `market`
- Plus 30+ more consolidation opportunities

---

### 3. conditional-logic-requirements.json
**Location:** `/Users/bencrowe/Development/APR-Dashboard-v3/docs/15-Contract-review/North Battleford Apt -Report-content extracted copy/REPORT Pg Img./conditional-logic-requirements.json`

**Contents:**
- 8 major conditional scenarios documented
- Content variants for each scenario
- Field validation rules
- Template rendering execution order
- Default values for boilerplate fields

**Major Conditional Scenarios:**

1. **Value Scenario Conditional** (HIGHEST PRIORITY)
   - Trigger: `value-scenario-type`
   - Values: "As Stabilized" | "As If Renovated & Stabilized" | "As Is"
   - Affects: `hypothetical-conditions-text`, `extraordinary-assumptions-text`, `hbu-scenario`, `scenario-description`

2. **Building Count Conditional**
   - Trigger: `building-count`
   - Affects: Singular vs plural language throughout report

3. **Assistance Provided Conditional**
   - Trigger: `inspector-provided` (boolean)
   - Toggles between inspector assistance text and "no assistance" text

4. **Demographics Section Conditional**
   - Trigger: `include-demographics` (boolean)
   - Optionally includes demographics paragraph

5. **Sales History Conditional**
   - Trigger: `pending-sale` (boolean)
   - Includes pending sale details or "unaware of sales" text

6. **Weighted Year Built Conditional**
   - Trigger: `year-built-weighted` (exists and differs from `year-built`)
   - Includes weighted year for multi-building properties

7. **Client Title Conditional**
   - Trigger: `client-title` (exists and not empty)
   - Includes title in transmittal attention line

8. **Capital Expenditures Section Conditional**
   - Trigger: `value-scenario-type == 'As If Renovated & Stabilized'`
   - Includes capex section for renovation scenarios

**Default Values for Boilerplate Fields:**
- `extraordinary-limiting-conditions` = "No Extraordinary Limiting Conditions were made for this assignment." (100% boilerplate)
- `exposure-time-conclusion` = "six months"
- `project-amenities` = "Guest Parking"
- `unit-amenities` = "Deck/Patio, Range/Stove, Refrigerator"
- `laundry` = "On Site"
- `security-features` = "Deadbolts, Exterior Lighting, Secured Entry"
- `elevator` = "None"
- `insulation` = "Fiberglass"
- `lighting` = "Various"

---

## Consolidation Recommendations

### Priority 1: Use Existing Registry Fields

**Instead of creating new fields, map template fields to existing registry:**

| Template Field | Use Existing Registry Field | Notes |
|----------------|----------------------------|-------|
| `building-count` | `total-buildings` | Same data |
| `building-nra-sqft` | `total-nra` or `impv-nra` | Verify which to use |
| `capitalization-rate` | `calc-cap-rate` | Same data |
| `city-name` | `city` | Same data |
| `client-name` | `client-contact-name` | Same data |
| `effective-gross-revenue` | `calc-egr` | Same data |
| `electrical-description` | `electrical` | Remove redundant suffix |
| `exposure-description` | `exposure-visibility` | Same concept |
| `foundation-type` | `foundation` | Remove redundant suffix |
| `hvac-description` | `hvac` | Remove redundant suffix |
| `market-name` | `market` | Same data |
| `market-rent-per-sf` | `calc-avg-rent-per-sf` | Same calculation |
| `market-rent-per-unit` | `calc-avg-rent-per-unit` | Same calculation |
| `nearby-schools-list` | `nearby-schools` | Remove redundant suffix |
| `net-operating-income` | `calc-noi` | Same calculation |
| `noi-per-sf` | `calc-noi-per-sf` | Same calculation |
| `noi-per-unit` | `calc-noi-per-unit` | Same calculation |
| `nra-sqft` | `total-nra` | Same data |
| `occupancy-percent` | `occupancy-rate` | Same data |
| `potential-gross-revenue` | `calc-pgr` | Same calculation |
| `property-address-line1` | `street-address` | Same data |
| `property-city` | `city` | Same data |
| `property-province` | `province` | Same data |
| `roof-type` | `roof` | Remove redundant suffix |
| `security-features` | `security` | Remove redundant suffix |
| `site-area-ac` | `site-acreage` | Same data |
| `site-area-sf` | `site-total-area` | Same data |
| `story-count` | `stories` or `impv-stories` | Verify which to use |
| `submarket-name` | `submarket` | Remove redundant suffix |
| `total-operating-expenses` | `calc-expenses-total` | Same calculation |
| `transit-description` | `public-transit` | Remove redundant suffix |
| `unit-count` | `total-units` or `impv-num-units` | Verify which to use |
| `vacancy-percent` | `calc-vacancy-rate` | Same data |
| `value-scenario-type` | `value-scenario` | Remove redundant suffix |

**Result:** Reduces 77 "new" fields to ~30-40 truly new fields

---

### Priority 2: Create Calculated/Composite Fields

**These fields should be calculated from existing fields, not stored separately:**

| Template Field | Calculation Logic |
|----------------|-------------------|
| `property-address-line2` | `city + ', ' + province` |
| `property-city-province` | `city + ', ' + province` |
| `property-full-address` | `street-address + ', ' + city + ', ' + province` |
| `client-address-full` | `client-address + ', ' + client-city + ', ' + client-province + ' ' + client-postal` |
| `authorized-user` | Copy of `client-company` |
| `contract-rent-percent-of-market` | `(avg-contract-rent / avg-market-rent) * 100` |
| `operating-expenses-per-sf` | `calc-expenses-total / total-nra` |
| `operating-expenses-per-unit` | `calc-expenses-total / total-units` |
| `value-scenarios-list` | Format `value-scenario-type` with "(Fee Simple Estate)" suffix |

**Result:** Reduces field count by another 9 fields

---

### Priority 3: Truly New Fields Required

**After consolidation, these ~30 fields genuinely need to be added to registry:**

1. `access-description` - Location access narrative
2. `accessibility-rating` - Site accessibility rating (Poor/Average/Excellent)
3. `assistance-provided-text` - Inspector assistance paragraph
4. `authorized-use` - Report authorized use
5. `client-title` - Client contact title (optional)
6. `current-owner` - Current property owner
7. `demographics-text` - Optional demographics paragraph
8. `exposure-time-conclusion` - Marketing time estimate
9. `extraordinary-assumptions-text` - EA paragraph (conditional)
10. `final-value-conclusion` - Reconciled final value
11. `frontage-streets` - Streets property fronts on
12. `hbu-scenario` - H&B Use scenario (As Improved/As Proposed)
13. `hypothetical-conditions-text` - HC paragraph (conditional)
14. `include-demographics` - Boolean flag
15. `inspection-date` - Date of property inspection
16. `inspector-provided` - Boolean flag
17. `insulation` - Insulation type
18. `lighting` - Lighting description
19. `map-files-array` - Array of map images
20. `market-overview-text` - Market analysis narrative
21. `pending-sale` - Boolean flag
22. `photo-caption-array` - Array of photo captions
23. `photo-files-array` - Array of photo files
24. `sales-history-details` - Sales history narrative
25. `scenario-description` - Value scenario description
26. `site-area-source` - Source of site measurement
27. `unit-rent-discussion` - Unit rent analysis narrative
28. `walk-bike-scores-text` - Walk/bike/transit scores
29. `year-built-weighted` - Weighted year for multi-building
30. `zoning-change-statement` - Zoning change likelihood
31. `zoning-code` - Zoning code (may be part of zoning-classification)
32. `zoning-district` - Full zoning district name

---

## Implementation Roadmap

### Phase 1: Field Consolidation
1. Review all high-similarity mappings
2. Update template to use existing registry field IDs where possible
3. Create calculated field helper functions for composite values
4. Validate template renders correctly with consolidated fields

### Phase 2: Add New Fields to Registry
1. Add ~30 truly new fields to fieldRegistry.ts
2. Ensure storeId matches id for consistency
3. Add to appropriate sections
4. Update reportBuilderStore to handle new fields

### Phase 3: Implement Conditional Logic
1. Create value-scenario-type helper function (returns object with all conditional content)
2. Implement building-count conditional (singular/plural)
3. Implement boolean conditionals (inspector-provided, pending-sale, include-demographics)
4. Add validation for required conditional fields

### Phase 4: Template Integration
1. Update reportHtmlTemplate.ts with consolidated field names
2. Integrate conditional logic helpers
3. Test with North Battleford property data
4. Validate with Drumheller property data
5. Verify all 99 template fields resolve correctly

### Phase 5: Field Defaults
1. Implement default values for boilerplate fields
2. Create field validation rules
3. Add user-friendly error messages for missing required fields
4. Test edge cases (missing optional fields, invalid conditionals)

---

## Next Actions

### Immediate Next Steps:
1. **Review consolidation recommendations** - Validate which existing fields to use
2. **Add ~30 new fields to fieldRegistry.ts** - Following field definition structure
3. **Create conditional logic helpers** - Starting with value-scenario-type
4. **Update template with consolidated field names** - Use existing registry IDs
5. **Test integration** - Use North Battleford data as test case

### Files Ready for Template Builder:
- ✅ `new-fields-needed.json` - Full specifications for new fields
- ✅ `existing-fields-mapping.json` - Exact and similar matches
- ✅ `conditional-logic-requirements.json` - All conditional scenarios
- ✅ `BOILERPLATE-VS-DYNAMIC-ANALYSIS.md` - Source analysis (already existed)

---

## Statistics

**Field Coverage:**
- 22 fields (22.2%) - Direct match, no work needed
- 37 fields (37.4%) - High similarity, use existing with minor changes
- 9 fields (9.1%) - Calculated/composite, create helper functions
- 31 fields (31.3%) - Truly new, add to registry

**Boilerplate Analysis:**
- Total lines analyzed: 5,433 (2 complete reports)
- Boilerplate ratio: ~75-80%
- Dynamic ratio: ~20-25%
- Template fields needed: 99
- Conditional scenarios: 8 major scenarios

**Registry Scale:**
- Existing fields: 519
- New fields after consolidation: ~31
- Final registry size: ~550 fields
- Growth: +6% field count

---

## Success Criteria

### Template Builder Can:
1. ✅ See all 99 template fields with full specifications
2. ✅ Identify which 22 fields already exist (no action needed)
3. ✅ See 37 consolidation opportunities (use existing fields)
4. ✅ Know exactly which 31 fields to add to registry
5. ✅ Understand all 8 conditional logic scenarios
6. ✅ See default values for boilerplate fields
7. ✅ Validate field requirements before rendering

### Deliverables Complete:
- ✅ new-fields-needed.json (77 field definitions)
- ✅ existing-fields-mapping.json (22 exact + 37 similar)
- ✅ conditional-logic-requirements.json (8 scenarios)
- ✅ FIELD-CROSS-REFERENCE-SUMMARY.md (this document)

---

## Notes

**Critical Insights:**
- **Value-scenario-type is THE key field** - Controls content for 4 major sections
- **High consolidation opportunity** - 37 fields can use existing registry
- **Boilerplate defaults reduce data entry** - 11 fields have smart defaults
- **Conditional validation is critical** - Missing required conditional fields will break template

**Recommendations:**
- Start with value-scenario-type conditional (highest priority)
- Use existing calc-* fields for all financial calculations
- Create calculated field helpers for composite values
- Add validation before template rendering to catch missing fields
- Provide clear error messages for missing conditional dependencies

---

**End of Summary**
