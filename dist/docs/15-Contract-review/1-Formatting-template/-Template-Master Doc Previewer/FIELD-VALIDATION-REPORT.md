# FIELD VALIDATION REPORT
**Date:** 2025-12-19
**Files Analyzed:**
- PREVIEW-Master.html (1,013 unique field IDs)
- reportBuilderStore.ts (664 unique field IDs)
- MASTER-PAGE-FIELD-REFERENCE.md (1,013 documented fields)

---

## CRITICAL FINDINGS ⚠️

### Summary
| Category | Count | % of Total |
|----------|-------|-----------|
| **Fields in HTML, NOT in Store** (Orphaned) | 936 | 92.4% |
| **Fields in Store, NOT in HTML** (Missing) | 587 | 88.4% of store |
| **Fields Matched** | 77 | 7.6% |

### Analysis

**This represents a 92.4% mismatch between the HTML template and the store.**

The HTML template uses 1,013 field IDs, but only 77 of them (7.6%) exist in reportBuilderStore.ts. This suggests:

1. **HTML was built independently** - The template may have been created before the store schema was finalized
2. **Store uses different naming** - The store may use different field ID conventions
3. **Missing field definitions** - 936 fields need to be added to the store
4. **Unused store fields** - 587 fields in the store are not used in HTML

---

## ORPHANED FIELDS (In HTML, NOT in Store)

**Count:** 936 fields

### Sample (First 50):
```
appraiser-aic-number
appraiser-email
appraiser-name-credentials
appraiser-title
appraiser1-email
appraiser1-name
appraiser1-signature
appraiser1-title
appraiser2-name
bond-yield-10yr
calc-cap-rate
calc-egr
calc-egr-per-sf
calc-egr-per-unit
calc-exp-insurance-annual
calc-exp-insurance-pct-egr
calc-exp-insurance-pct-pgr
calc-exp-insurance-per-sf
calc-exp-insurance-per-unit
calc-exp-management-annual
calc-exp-management-pct-egr
calc-exp-management-pct-pgr
calc-exp-management-per-sf
calc-exp-management-per-unit
calc-exp-other-annual
calc-exp-other-pct-egr
calc-exp-other-pct-pgr
calc-exp-other-per-sf
calc-exp-other-per-unit
calc-exp-payroll-annual
calc-exp-payroll-pct-egr
calc-exp-payroll-pct-pgr
calc-exp-payroll-per-sf
calc-exp-payroll-per-unit
calc-exp-repairs-annual
calc-exp-repairs-pct-egr
calc-exp-repairs-pct-pgr
calc-exp-repairs-per-sf
calc-exp-repairs-per-unit
calc-exp-taxes-annual
calc-exp-taxes-pct-egr
calc-exp-taxes-pct-pgr
calc-exp-taxes-per-sf
calc-exp-taxes-per-unit
calc-exp-utilities-annual
calc-exp-utilities-pct-egr
calc-exp-utilities-pct-pgr
calc-exp-utilities-per-sf
calc-exp-utilities-per-unit
calc-expense-ratio
```

**Full list:** See `/tmp/orphaned.txt`

---

## MISSING FIELDS (In Store, NOT in HTML)

**Count:** 587 fields

### Sample (First 50):
```
accessibility
adjacent-east
adjacent-north
adjacent-south
adjacent-uses
adjacent-west
aerial-maps
amenities
analysis
annual-taxes
appraiser-address
appraiser-aic-number
appraiser-city
appraiser-company
appraiser-credentials
appraiser-email
appraiser-info
appraiser-name
appraiser-phone
appraiser-title
appraiser-website
assessment-year
assignment
assignment-analysis-methods
assignment-client
assignment-client-address
assignment-client-name
assignment-conditions
assignment-data-sources
assignment-dates
assignment-definition-of-value
assignment-description
assignment-effective-date
assignment-exclusions
assignment-extraordinary-assumptions
assignment-general-assumptions
assignment-hypothetical
assignment-intended-use
assignment-intended-users
assignment-limiting-conditions
assignment-property-address
assignment-property-id
assignment-property-rights
assignment-property-type
assignment-report-date
assignment-report-format
assignment-scope
assignment-title
assignment-value-type
back-cover
```

**Full list:** See `/tmp/missing.txt`

---

## MATCHED FIELDS (In Both HTML and Store)

**Count:** 77 fields (7.6% match rate)

```
city
client-address
client-citystatezip
client-company
client-name
company-address
company-citystatezip
company-jobnumber
company-name
company-phone
comp1-address
comp1-buyer
comp1-caprate
comp1-citystatezip
comp1-conditionsofsale
comp1-corner
comp1-county
comp1-distance
comp1-financing
comp1-gba
comp1-label
comp1-landarea
comp1-laundry
comp1-map
comp1-noi
comp1-nra
comp1-occupancy
comp1-parkingtype
comp1-photo
comp1-priceperunit
comp1-projectamenities
comp1-propertyname
comp1-propertytype
comp1-remarks
comp1-renttype
comp1-rightstransferred
comp1-saledate
comp1-saleprice
comp1-securityfeatures
comp1-seller
comp1-structures
comp1-totalparking
comp1-units
comp1-yearbuilt
comp2-address
comp2-buyer
comp2-caprate
comp2-citystatezip
comp2-conditionsofsale
comp2-corner
comp2-county
comp2-distance
comp2-financing
comp2-gba
comp2-label
comp2-landarea
comp2-laundry
comp2-map
comp2-noi
comp2-nra
comp2-occupancy
comp2-parkingtype
comp2-photo
comp2-priceperunit
comp2-projectamenities
comp2-propertyname
comp2-propertytype
comp2-remarks
comp2-renttype
comp2-rightstransferred
comp2-saledate
comp2-saleprice
comp2-securityfeatures
comp2-seller
comp2-structures
```

**Full list:** See `/tmp/matched.txt`

---

## RECOMMENDATIONS

### Option 1: Add Missing Fields to Store (Preferred)
- Add 936 field definitions to reportBuilderStore.ts
- Organize by page section (Income, Expenses, Sales Comps, etc.)
- Use MASTER-PAGE-FIELD-REFERENCE.md as guide

### Option 2: Update HTML to Match Store
- Replace 936 HTML field IDs with store equivalents
- Risk: May break existing field mappings
- Requires comprehensive mapping table

### Option 3: Hybrid Approach
1. Identify which orphaned fields are actively used
2. Add critical fields to store
3. Update HTML for deprecated/renamed fields
4. Document field ID mappings

---

## NEXT STEPS

**Before proceeding with updates, please confirm:**

1. **Which approach?** (Option 1, 2, or 3 above)
2. **Priority fields:** Should I focus on specific pages first (e.g., Income/Expense pages 44-49)?
3. **Naming conventions:** Should store match HTML naming or vice versa?

**Current state:** HTML template and store are fundamentally misaligned. Requires strategic decision before automated corrections can proceed.

---

## VALIDATION METADATA

- **Store Fields Extracted:** 664 unique IDs
- **HTML Fields Extracted:** 1,013 unique IDs
- **Reference Doc Fields:** 1,013 documented
- **Page Coverage:** Pages 1-72 (5 pages without footer numbers: 26,27,30,33,34)
- **Extraction Method:** Regex pattern matching on `id: "..."` (store) and `title="{{...}}"` (HTML)
