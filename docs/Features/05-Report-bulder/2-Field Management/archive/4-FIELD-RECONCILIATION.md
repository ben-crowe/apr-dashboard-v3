# Field Reconciliation - Three-Way Cross-Reference

**Created:** December 11, 2025  
**Purpose:** Authoritative mapping between Valcre Workbook → User Documentation → Built Code  
**Gold Standard:** VAL251012.xlsm (Valcre Workbook Named Ranges)

---

## Critical Naming Convention Differences

| Source | Convention | Example |
|--------|------------|---------|
| **Valcre Workbook** | PascalCase with underscores | `IA_DirCap_PGI`, `Value_FinalScenario1` |
| **2-FIELD-MAPPING.md** | snake_case | `income_pgi`, `recon_finalValue` |
| **fieldRegistry.ts** | kebab-case | `calc-pgr`, `recon-final-value` |

---

## SECTION 1: INCOME APPROACH CALCULATIONS

### Core Income Values

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status | Notes |
|-------------------|-------------------|------------------|--------|-------|
| `IA_DirCap_PGI` | `income_pgi` | `calc-pgr` | MISMATCH | Registry uses "pgr" (Potential Gross Revenue) vs "pgi" (Income) |
| `IA_DirCap_EGI` | `income_egi` | `calc-egr` | MISMATCH | Registry uses "egr" vs "egi" |
| `IA_DirCap_NOI` | `income_noi` | `calc-noi` | ALIGNED | All three match concept |
| `IA_DirCap_Value` | `income_valueIndication` | `calc-indicated-value` | ALIGNED | Income approach indicated value |
| `IA_DirCap_CapRate1` | `income_capRate` | `calc-cap-rate` | ALIGNED | Capitalization rate |
| `IA_DirCap_Expenses` | `expense_total` | `calc-expenses-total` | ALIGNED | Total operating expenses |
| `IA_DirCap_LossTotal` | `income_vacancyLoss` | `calc-vacancy-loss` | ALIGNED | Total vacancy & loss |
| `IA_DirCap_PGIPSF` | — | — | MISSING | PGI per square foot (not in registry) |
| `IA_DirCap_EGIPSF` | — | — | MISSING | EGI per square foot (not in registry) |
| `IA_DirCap_NOIPSF` | — | `calc-noi-per-sf` | PARTIAL | Registry has it, 2-FIELD-MAPPING doesn't |

### Per-Unit Metrics

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| `IA_DirCap_PGIUnit` | — | — | MISSING |
| `IA_DirCap_EGIUnit` | — | — | MISSING |
| `IA_DirCap_NOIUnit` | — | `calc-noi-per-unit` | PARTIAL |

### Vacancy Components

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| `IA_DirCap_Vac` | `income_vacancyRate` | `calc-vacancy-rate` | ALIGNED |
| `IA_DirCap_Loss` | — | `calc-bad-debt-rate` | PARTIAL |

---

## SECTION 2: RECONCILIATION & FINAL VALUE

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status | Notes |
|-------------------|-------------------|------------------|--------|-------|
| `Value_FinalScenario1` | `recon_finalValue` | `recon-final-value` | ALIGNED | Final reconciled value |
| `Value_IARecScenario1` | `recon_incomeValue` | `recon-income-value` | ALIGNED | Income approach conclusion |
| `Value_SARecScenario1` | `recon_salesValue` | `recon-sales-value` | ALIGNED | Sales comparison conclusion |
| `Value_CostScenario1` | `recon_costValue` | `recon-cost-value` | ALIGNED | Cost approach conclusion |
| `Value_LandScenario1` | — | `land-value-conclusion` | PARTIAL | Land value |

---

## SECTION 3: SUBJECT PROPERTY DATA

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status | Notes |
|-------------------|-------------------|------------------|--------|-------|
| `Subject_NRA` | `transmittal_netRentableArea` | `total-nra` | MISMATCH | Different section assignments |
| `Subject_Units` | `transmittal_numberOfUnits` | `total-units` | MISMATCH | Different section assignments |
| `Subject_Primary` | `cover_propertyType` | `property-type-display` | ALIGNED | Property type classification |
| `Subject_AreaType` | — | — | MISSING | Area measurement type |

---

## SECTION 4: COVER PAGE & IDENTIFICATION

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `cover_propertyName` | `property-name` | ALIGNED |
| — | `cover_propertyAddress` | `street-address` | ALIGNED |
| — | `cover_propertyCity` | `city` | ALIGNED |
| — | `cover_propertyProvince` | `province` | ALIGNED |
| — | `cover_clientName` | `client-contact-name` | ALIGNED |
| — | `cover_clientCompany` | `client-company` | ALIGNED |
| — | `cover_valuationDate` | `valuation-date` | ALIGNED |
| — | `cover_reportDate` | `report-date` | ALIGNED |
| — | `cover_fileNumber` | `file-number` | ALIGNED |

---

## SECTION 5: SITE DETAILS

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `site_totalArea` | `site-total-area` | ALIGNED |
| — | `site_acreage` | `site-acreage` | ALIGNED |
| — | `site_adjacentNorth` | `adjacent-north` | ALIGNED |
| — | `site_adjacentSouth` | `adjacent-south` | ALIGNED |
| — | `site_adjacentEast` | `adjacent-east` | ALIGNED |
| — | `site_adjacentWest` | `adjacent-west` | ALIGNED |
| — | `site_easements` | `easements` | ALIGNED |
| — | `site_rating` | `site-rating` | ALIGNED |

---

## SECTION 6: TAX ASSESSMENT

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `tax_assessmentYear` | `assessment-year` | ALIGNED |
| — | `tax_assessedValue` | `total-assessment` | ALIGNED |
| — | `tax_landValue` | `land-assessment` | ALIGNED |
| — | `tax_buildingValue` | `building-assessment` | ALIGNED |
| — | `tax_annualTax` | `annual-taxes` | ALIGNED |

---

## SECTION 7: IMPROVEMENTS

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `improv_numberOfBuildings` | `impv-num-buildings` | ALIGNED |
| — | `improv_netRentableArea` | `impv-nra` | ALIGNED |
| — | `improv_yearBuilt` | `impv-year-built` | ALIGNED |
| — | `improv_numberOfUnits` | `impv-num-units` | ALIGNED |
| — | `improv_numberOfStories` | `impv-stories` | ALIGNED |
| — | `improv_parkingSpaces` | `parking-spaces` | ALIGNED |
| — | `improv_parkingRatio` | `parking-ratio` | ALIGNED |
| — | `improv_foundation` | `foundation` | ALIGNED |
| — | `improv_exteriorWalls` | `exterior-walls` | ALIGNED |
| — | `improv_roof` | `roof` | ALIGNED |
| — | `improv_hvac` | `hvac` | ALIGNED |
| — | `improv_electrical` | `electrical` | ALIGNED |
| — | `improv_plumbing` | `plumbing` | ALIGNED |

---

## SECTION 8: ZONING

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `zoning_classification` | `zoning-classification` | ALIGNED |
| — | `zoning_description` | `zoning-description` | ALIGNED |
| — | `zoning_permittedUses` | `permitted-uses` | ALIGNED |
| — | `zoning_conformance` | `zoning-conformance` | ALIGNED |

---

## SECTION 9: HIGHEST & BEST USE

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `hbu_asVacant_legal` | `hbu-vacant-legal` | ALIGNED |
| — | `hbu_asVacant_physical` | `hbu-vacant-physical` | ALIGNED |
| — | `hbu_asVacant_financial` | `hbu-vacant-financial` | ALIGNED |
| — | `hbu_asVacant_maxProductivity` | `hbu-vacant-productive` | ALIGNED |
| — | `hbu_asImproved` | `hbu-improved` | ALIGNED |
| — | `hbu_conclusion` | `hbu-conclusion-text` | ALIGNED |

---

## SECTION 10: SALES COMPARISON

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `subject_numberOfUnits` | `subject-units` | ALIGNED |
| — | `subject_gba` | `subject-gba` | ALIGNED |
| — | `subject_yearBuilt` | `subject-year` | ALIGNED |
| — | `subject_siteArea` | `subject-site-area` | ALIGNED |
| — | `salesComp_valueIndication` | `sales-value-indication` | ALIGNED |

---

## SECTION 11: EXECUTIVE SUMMARY

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status | Notes |
|-------------------|-------------------|------------------|--------|-------|
| — | `exec_finalValue` | `concluded-value` | ALIGNED | Final market value |
| — | `exec_hypotheticalConditions` | `hypothetical-conditions` | ALIGNED |
| — | `exec_extraordinaryAssumptions` | `extraordinary-assumptions` | ALIGNED |
| — | `exec_valuationPremise` | `value-scenario` | ALIGNED |
| — | `exec_propertyType` | — | MISSING | Missing in registry |
| — | `ident_exposureTime` | — | MISSING | Identified in earlier mapping |
| — | — | — | MISSING | `marketing-time` also missing |

---

## SECTION 12: CERTIFICATION

| Valcre Named Range | 2-FIELD-MAPPING ID | fieldRegistry ID | Status |
|-------------------|-------------------|------------------|--------|
| — | `cert_appraiserName` | `cert-sign-name` | ALIGNED |
| — | `cert_appraiserDesignation` | `cert-sign-credentials` | ALIGNED |
| — | `cert_signatureDate` | `cert-sign-date` | ALIGNED |
| — | `cert_signatureImage` | `cert-signature` | ALIGNED |

---

## GAP ANALYSIS SUMMARY

### Fields in Valcre NOT in Registry (Critical)

| Valcre Named Range | Purpose | Priority |
|-------------------|---------|----------|
| `IA_DirCap_PGIPSF` | PGI per square foot | HIGH |
| `IA_DirCap_EGIPSF` | EGI per square foot | HIGH |
| `IA_DirCap_PGIUnit` | PGI per unit | MEDIUM |
| `IA_DirCap_EGIUnit` | EGI per unit | MEDIUM |
| `Subject_AreaType` | Area measurement type | LOW |
| `IA_DirCap2_*` | Secondary Direct Cap scenario | LOW (if not used) |
| `IA_DCF_*` | DCF Analysis fields | LOW (if not used) |

### Fields in 2-FIELD-MAPPING NOT in Registry

| 2-FIELD-MAPPING ID | Purpose | Priority |
|-------------------|---------|----------|
| `ident_exposureTime` | Exposure time estimate | HIGH (on exec summary) |
| `ident_marketingTime` | Marketing time | HIGH |
| `exec_propertyType` | Property type display | MEDIUM |

### Fields in Registry NOT in 2-FIELD-MAPPING

| fieldRegistry ID | Purpose | Notes |
|-----------------|---------|-------|
| `intake-*` (19 fields) | Client intake form | V3 Dashboard specific |
| `loe-*` (10 fields) | LOE preparation | V3 Dashboard specific |
| `img-*` (47 fields) | Image management | Consolidated image slots |
| `survey*` (100+ fields) | Rental survey comps | Expanded from original |

---

## NAMING MISMATCH RESOLUTION

### Income Terminology Issue

The biggest mismatch is Income terminology:
- **Valcre/2-FIELD**: Uses "PGI" (Potential Gross Income)
- **fieldRegistry**: Uses "PGR" (Potential Gross Revenue)

**Resolution:** Both terms are valid in appraisal practice. However, for consistency with Valcre workbook (gold standard), consider renaming:
- `calc-pgr` → `calc-pgi`
- `calc-egr` → `calc-egi`

This requires coordinated update to:
1. `fieldRegistry.ts`
2. `reportBuilderStore.ts`
3. `reportHtmlTemplate.ts` (getFieldValue calls)

### Section Assignment Differences

Some fields exist in different sections:
- `Subject_NRA` → In Valcre DATA sheet, but displays in transmittal/exec
- Solution: Keep field in one section, reference in multiple render functions

---

## TRANSLATION TABLE (For Excel Import)

When importing from Valcre workbook, use this translation:

```typescript
const valcreToRegistry: Record<string, string> = {
  // Income Approach
  'IA_DirCap_PGI': 'calc-pgr',        // Note: PGI → PGR naming
  'IA_DirCap_EGI': 'calc-egr',        // Note: EGI → EGR naming
  'IA_DirCap_NOI': 'calc-noi',
  'IA_DirCap_CapRate1': 'calc-cap-rate',
  'IA_DirCap_Value': 'calc-indicated-value',
  'IA_DirCap_Expenses': 'calc-expenses-total',
  'IA_DirCap_LossTotal': 'calc-vacancy-loss',
  
  // Reconciliation
  'Value_FinalScenario1': 'recon-final-value',
  'Value_IARecScenario1': 'recon-income-value',
  'Value_SARecScenario1': 'recon-sales-value',
  'Value_CostScenario1': 'recon-cost-value',
  
  // Subject Property
  'Subject_NRA': 'total-nra',
  'Subject_Units': 'total-units',
  'Subject_Primary': 'property-type-display',
};
```

---

## NEXT STEPS

1. **Add Missing Fields to Registry:**
   - `exposure-time` (exec section)
   - `marketing-time` (exec section)
   - PSF metrics if needed for display

2. **Decide on PGI/PGR Naming:**
   - Option A: Keep "PGR" (current) - less work, slightly confusing
   - Option B: Rename to "PGI" (Valcre aligned) - more work, cleaner

3. **Build Excel Import Service:**
   - Use translation table above
   - Read named ranges from uploaded workbook
   - Populate store fields via mapping

4. **Update Template Cross-References:**
   - Ensure each render function pulls correct fields
   - Add missing fields to relevant page renders

---

---

## APPENDIX: Gap Analysis Cross-Reference (from Dec 8 FIELD-COVERAGE-GAP-ANALYSIS.md)

### Status of Previously Identified Gaps

| Gap (Dec 8) | Status (Dec 11) | Notes |
|-------------|-----------------|-------|
| **Rental Survey Section - 0%** | RESOLVED | fieldRegistry.ts now has 100+ survey fields |
| **Sales Comps 4-5 missing** | STILL MISSING | Registry only has comp1-3 |
| **Income expense table (%EGR, $/SF, $/Unit)** | STILL MISSING | Only have total amounts |
| **Per-SF metrics (PGI/SF, EGI/SF, NOI/SF)** | PARTIAL | `calc-noi-per-sf` exists, PGI/EGI per SF missing |
| **Exposure/Marketing time** | STILL MISSING | Identified in both analyses |
| **Reconciliation per-SF values** | STILL MISSING | Only totals, no $/SF |

### Fields to Add (Consolidated Priority List)

**CRITICAL - Missing from reference report display:**
```typescript
// Exposure/Marketing Time (Page 7 Exec Summary)
{ id: 'exposure-time', section: 'exec', type: 'text' }
{ id: 'marketing-time', section: 'exec', type: 'text' }

// Sales Comps 4-5 (catalog shows 5 comps)
{ id: 'comp4-*', section: 'sales' }  // Full comp4 field set
{ id: 'comp5-*', section: 'sales' }  // Full comp5 field set

// Per-SF Display Metrics
{ id: 'calc-pgi-per-sf', section: 'calc', type: 'calculated' }
{ id: 'calc-egi-per-sf', section: 'calc', type: 'calculated' }
{ id: 'recon-income-value-per-sf', section: 'recon', type: 'calculated' }
{ id: 'recon-sales-value-per-sf', section: 'recon', type: 'calculated' }
{ id: 'recon-final-value-per-sf', section: 'recon', type: 'calculated' }
```

**HIGH - Expense table display columns:**
```typescript
// For each expense category, add display columns
{ id: 'calc-exp-taxes-egr-percent', type: 'calculated' }
{ id: 'calc-exp-taxes-per-sf', type: 'calculated' }
{ id: 'calc-exp-insurance-egr-percent', type: 'calculated' }
{ id: 'calc-exp-insurance-per-sf', type: 'calculated' }
// ... repeat for all 9 expense categories
```

**MEDIUM - Sales comp income info:**
```typescript
// For each comp, add income details
{ id: 'comp1-noi-per-unit', type: 'number' }
{ id: 'comp1-occupancy-percent', type: 'number' }
{ id: 'comp1-financing-terms', type: 'text' }
{ id: 'comp1-quality-rating', type: 'select' }
{ id: 'comp1-condition-rating', type: 'select' }
// ... repeat for all 5 comps
```

### Coverage Summary (Updated)

| Section | Dec 8 Coverage | Dec 11 Coverage | Change |
|---------|---------------|-----------------|--------|
| Rental Survey | 0% | ~90% | +90% (added) |
| Sales Comparison | 40% | 40% | No change (still need comp4-5) |
| Income Approach | 25% | 35% | +10% (calc fields improved) |
| Property Summary | 70% | 75% | +5% |
| Reconciliation | 65% | 70% | +5% |
| **Overall** | **31%** | **~55%** | **+24%** |

---

**Document Status:** COMPLETE - RECONCILIATION + GAP ANALYSIS MERGED  
**Last Updated:** December 11, 2025
