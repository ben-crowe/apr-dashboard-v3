# Test Data Dashboard (TDD) - Complete Field Structure Reference

**Last Updated:** December 20, 2025
**Purpose:** Master reference for TDD tab structure, field mapping, and Report Builder integration

---

## 📊 Overview

The Test Data Dashboard (TDD) is a comprehensive input interface with **24 main sections** organized into 3 groups:

1. **V3 Operational Sections** (S1-S3) - Client intake and image management
2. **Report Builder Sections** (01-22) - Appraisal report content
3. **Special Accordions** - Consolidated sections for valuations and images

---

## 🗂️ Complete Section Structure

### Group 1: V3 Operational Sections

| Section ID | Tab Name | Field Count | Subsections | Purpose |
|------------|----------|-------------|-------------|---------|
| `client-intake` | S1 - CLIENT INTAKE (V3) | 18 | 4 | Client & property information from V3 Dashboard |
| `loe-prep` | S2 - LOE PREP (V3) | 11 | 5 | Letter of Engagement preparation |
| `image-mgt` | S3 - IMAGE MANAGEMENT | ~35 | 7 | Centralized image upload for all report sections |

#### S1 - Client Intake Subsections:
1. **Client Information** (7 fields)
   - First Name, Last Name, Email, Phone, Title, Organization, Address

2. **Property Information** (6 fields)
   - Property Name, Address, Type, Intended Use, Valuation Premises, Asset Condition

3. **Property Contact** (4 fields)
   - First Name, Last Name, Email, Phone

4. **Notes** (1 field)
   - General notes

**S1 Field Mappings to Report Builder:**
```
intake-client-first-name → client-contact-name
intake-client-organization → client-company
intake-property-name → property-name
intake-property-address → street-address
intake-property-type → property-type-display
intake-intended-use → assignment-intended-use
intake-valuation-premises → value-scenario
```

#### S2 - LOE Prep Subsections:
1. **Job Assignment** (1 field)
   - Valcre Job ID (VAL#)

2. **Financial Terms** (3 fields)
   - Appraisal Fee, Retainer Amount, Payment Terms

3. **Delivery Details** (3 fields)
   - Delivery Date, Report Type, Property Rights Appraised

4. **Scope** (2 fields)
   - Scope of Work, Special Instructions

5. **Comments** (2 fields)
   - Internal Comments, Appraiser Comments

**S2 Field Mappings to Report Builder:**
```
loe-valcre-job-id → file-number
loe-report-type → report-type
loe-property-rights → property-rights
loe-scope-of-work → report-scope
```

#### S3 - Image Management Subsections:
1. **Cover & Signature** - img-cover-photo, img-signature
2. **Maps** - img-map-regional, img-map-local, img-map-aerial-1, img-map-aerial-2, img-zoning-map, img-site-plan-1, img-site-plan-2
3. **Exterior Photos** - img-exterior-1 through img-exterior-6
4. **Street Views** - img-street-1 through img-street-3
5. **Common Areas** - img-common-1 through img-common-4
6. **Unit Interiors** - img-unit-1 through img-unit-6
7. **Building Systems** - img-systems-1 through img-systems-4

---

### Group 2: Report Builder Sections (01-22)

| # | Section ID | Tab Name | Subsections | Key Fields |
|---|------------|----------|-------------|------------|
| 01 | `cover` | COVER PAGE | 0 | property-name, file-number, inspection-date, effective-date |
| 02 | `home` | INTRODUCTION LETTER | 0 | transmittal-letter (textarea) |
| 03 | `maps` | LOCATION MAPS | 0 | **Hidden** - Consolidated into accordion |
| 04 | `assignment` | IDENTIFICATION OF ASSIGNMENT | 2 | client-company, assignment-intended-use, value-scenario |
| 05 | `report` | REPORT INFORMATION | 3 | report-type, property-rights, report-scope |
| 06 | `exec` | EXECUTIVE SUMMARY | 0 | executive-summary (textarea) |
| 07 | `photos` | PROPERTY PHOTOGRAPHS | 0 | **Hidden** - Consolidated into accordion |
| 08 | `site` | SITE DETAILS | 5 | site-area, site-description, topography, utilities |
| 09 | `location` | LOCATION ANALYSIS | 3 | neighborhood-description, market-conditions |
| 10 | `tax` | PROPERTY TAXES | 0 | assessed-value, tax-rate, annual-taxes |
| 11 | `market` | MARKET ANALYSIS | 2 | market-trends, supply-demand |
| 12 | `impv` | IMPROVEMENTS | 6 | building-area, year-built, construction-quality, condition |
| 13 | `zone` | ZONING | 0 | zoning-district, permitted-uses |
| 14 | `hbu` | HIGHEST & BEST USE | 4 | hbu-conclusion, hbu-analysis |
| 15 | `calc` | VALUATIONS (All 3 Approaches) | 0 | **Consolidated** - Contains unit mix, income, expenses |
| 16 | `land1` | LAND VALUE | 0 | land-value, land-value-psf |
| 17 | `cost-s` | COST APPROACH | 0 | **Hidden** - Consolidated into accordion |
| 18 | `sales` | SALES COMPARISON | 0 | **Hidden** - Consolidated into accordion |
| 19 | `income` | INCOME APPROACH | 0 | **Hidden** - Consolidated into accordion |
| 20 | `rental-survey` | RENTAL SURVEY | 0 | rental-comparables |
| 21 | `recon` | RECONCILIATION | 0 | recon-cost-value, recon-sales-value, recon-income-value |
| 22 | `cert` | CERTIFICATION | 0 | appraiser-name, appraiser-certification |

---

## 🔄 Data Flow: TDD → Report Builder Editor Panel → Preview

### Flow Diagram:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TEST DATA DASHBOARD (TDD)                        │
│                     src/features/test-input/                        │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ User enters data in tabs
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FIELD REGISTRY                                 │
│              fieldRegistry.ts (924 fields)                          │
│                                                                     │
│  Maps: TDD field → storeId → Report Builder field                  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ updateFieldValue(storeId, value)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 ZUSTAND STORE (reportBuilderStore)                  │
│                                                                     │
│  State: sections[] with 24 sections                                │
│  Actions: updateFieldValue(), runCalculations()                    │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ sections updated
                            │
                ┌───────────┴──────────────┐
                │                          │
                ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   EDIT PANEL (Left)      │  │  PREVIEW PANEL (Right)   │
│   EditPanel.tsx          │  │  PreviewPanel.tsx        │
│                          │  │                          │
│ Shows fields for active  │  │ Shows full report with   │
│ section with inputs      │  │ {{field-id}} interpolated│
│ based on inputType:      │  │                          │
│ - user-input (yellow)    │  │ Uses PREVIEW-Master.html │
│ - dropdown (blue)        │  │ template with live data  │
│ - auto-filled (green)    │  │                          │
│ - calculated (display)   │  │                          │
└──────────────────────────┘  └──────────────────────────┘
```

### When User Clicks a Section in Sidebar:

1. **TDD updates `activeSection` in store**
2. **Edit Panel re-renders** showing fields for that section
3. **Preview Panel may scroll** to corresponding section in report

---

## 📋 Field Input Types & Color Coding

Fields are categorized by `inputSource` (formerly `inputType`) which determines how they appear in the Edit Panel:

| Input Source | Color | Description | Example |
|-------------|-------|-------------|---------|
| `user-input` | 🟨 Yellow | Manual user entry required | property-name, street-address |
| `dropdown` | 🟦 Blue | Select from predefined options | property-type, value-scenario |
| `auto-filled` | 🟩 Green | Auto-populated from S1/S2 or API | client-company (from S1) |
| `calculated` | ⚪ Gray/Display | Read-only, computed by calc engine | calc-noi, calc-indicated-value |

---

## 🧮 Calculator Section (Section 15) - Special Case

The `calc` section is unique:
- **Consolidated view** of all 3 valuation approaches (Cost, Sales, Income)
- **Inputs** include: unit mix, rents, expenses, cap rate
- **Outputs** (35 new fields added Dec 20): expense breakdowns per category
  - For each of 7 expense categories (management, taxes, insurance, repairs, utilities, payroll, other):
    - `calc-exp-{category}-annual`
    - `calc-exp-{category}-per-unit`
    - `calc-exp-{category}-per-sf`
    - `calc-exp-{category}-pct-pgr`
    - `calc-exp-{category}-pct-egr`

**Calculation Engine:** `reportBuilderStore.ts` → `runCalculations()`
- Runs automatically when input fields change
- Computes NOI, cap rate valuation, adjustments
- Updates all calculated fields in real-time

---

## 🖼️ Image Fields - Centralized Management

**Old Approach (deprecated):**
- Image fields scattered across sections (cover-photo, zoning-map, etc.)

**New Approach (current):**
- All images managed in S3 - IMAGE MANAGEMENT tab
- Legacy image field IDs redirect to S3 with "Manage in S3" button
- Images organized by destination:
  - Cover & Signature → `img-cover-photo`, `img-signature`
  - Location Maps → 7 map images
  - Property Photos → Exterior (6), Street (3), Common (4), Unit (6), Systems (4)

**Mapping:**
```typescript
legacyImageFields = {
  'cover-photo': { managedFieldId: 'img-cover-photo', destination: '01 - Cover & Signature' },
  'site-plan-image': { managedFieldId: 'img-site-plan-1', destination: '03 - Location Maps' },
  'zoning-map': { managedFieldId: 'img-zoning-map', destination: '03 - Location Maps' },
  'cert-signature': { managedFieldId: 'img-signature', destination: '01 - Cover & Signature' }
}
```

---

## 🎯 Section-to-Page Mapping (TDD → Report Preview)

When viewing a section in the Edit Panel, the corresponding report page(s) display:

| TDD Section | Report Pages Affected | Key Template Fields |
|-------------|----------------------|---------------------|
| S1 - CLIENT INTAKE | 01 (Cover), 04 (Assignment) | {{property-name}}, {{client-company}} |
| S2 - LOE PREP | 01 (Cover), 05 (Report Info) | {{file-number}}, {{report-type}} |
| S3 - IMAGE MGT | 01, 03, 07 (various) | {{img-cover-photo}}, {{img-map-regional}} |
| 01 - COVER | Page 1 | {{property-name}}, {{inspection-date}} |
| 02 - INTRO | Page 2 | {{transmittal-letter}} |
| 03 - MAPS | Page 3-8 | {{img-map-regional}}, {{img-site-plan-1}} |
| 04 - ASSIGNMENT | Page 9-12 | {{assignment-intended-use}}, {{value-scenario}} |
| 05 - REPORT | Page 13-15 | {{report-scope}}, {{property-rights}} |
| 06 - EXEC | Page 16 | {{executive-summary}} |
| 07 - PHOTOS | Page 17-22 | {{img-exterior-1}}, {{img-unit-1}} |
| 08 - SITE | Page 23-30 | {{site-area}}, {{topography}} |
| 09 - LOCATION | Page 31-34 | {{neighborhood-description}} |
| 10 - TAX | Page 35-36 | {{assessed-value}}, {{tax-rate}} |
| 11 - MARKET | Page 37-40 | {{market-trends}} |
| 12 - IMPV | Page 41-46 | {{building-area}}, {{year-built}} |
| 13 - ZONE | Page 47-48 | {{zoning-district}} |
| 14 - HBU | Page 49-50 | {{hbu-conclusion}} |
| 15 - CALC | Page 51-61 | {{calc-noi}}, {{calc-indicated-value}} |
| 16 - LAND | Page 62 | {{land-value}} |
| 17 - COST | Page 63-65 | {{cost-approach-value}} |
| 18 - SALES | Page 66-70 | {{sales-approach-value}} |
| 19 - INCOME | Page 71-74 | {{income-approach-value}} |
| 20 - RENTAL | Page 75 | {{rental-comparables}} |
| 21 - RECON | Page 76 | {{recon-income-value}} |
| 22 - CERT | Page 77 | {{appraiser-name}} |

---

## 📝 Field Registry Structure

Each field is defined in `fieldRegistry.ts` with this structure:

```typescript
interface FieldDefinition {
  id: string;              // Registry ID (unique)
  storeId: string;         // ID in Zustand store
  label: string;           // Display label in TDD
  category: string;        // Section grouping
  subcategory?: string;    // Subsection grouping
  type: FieldType;         // text, number, date, image, calculated, dropdown, textarea
  inputSource: InputSource; // user-input, dropdown, auto-filled, calculated
  options?: string[];      // For dropdown fields
  mapsTo?: string;         // For S1/S2 fields - where they auto-populate
}
```

**Total Fields:** 924 fields across all sections

---

## 🔍 Quick Reference: Find a Field

### By Section:
```typescript
import { getFieldsBySection } from 'fieldRegistry';
const coverFields = getFieldsBySection('cover');
```

### By Subsection:
```typescript
import { getFieldsBySubsection } from 'fieldRegistry';
const clientInfoFields = getFieldsBySubsection('client-intake', 'client-info');
```

### By Field ID:
```typescript
import { fieldRegistry } from 'fieldRegistry';
const propertyNameField = fieldRegistry['property-name'];
```

---

## 🎨 UI Components

### TDD (Input Interface)
- **Location:** `/src/features/test-input/TestInputDashboard.tsx`
- **Purpose:** Data entry interface with tabs for all 24 sections
- **Features:** Field status badges, statistics, expand/collapse, image upload

### Edit Panel (Field Editor)
- **Location:** `/src/features/report-builder/components/EditPanel/EditPanel.tsx`
- **Purpose:** Edit fields for currently active section
- **Features:** Color-coded inputs, calculated field display, text editor, image selector

### Preview Panel (Report Viewer)
- **Location:** `/src/features/report-builder/components/PreviewPanel/PreviewPanel.tsx`
- **Purpose:** Live preview of full report with interpolated data
- **Features:** Zoom, dark mode, PDF export, page navigation

---

## 🚀 Next Steps (Stage 1 - Template Preparation)

You will be updating PREVIEW-Master.html template page-by-page:

1. **Receive page number and field IDs** from user
2. **Update template** with correct `{{field-id}}` placeholders
3. **Verify field IDs** exist in fieldRegistry.ts
4. **Add missing fields** to registry if needed
5. **Repeat** for all 77 pages

**Exit Criteria:**
- ✅ All {{field-id}} references have matching fieldRegistry entries
- ✅ Template validated and complete
- ✅ Ready for Stage 2 integration into Report Builder

---

**Related Files:**
- `/src/features/report-builder/schema/fieldRegistry.ts` - Field definitions
- `/src/features/report-builder/store/reportBuilderStore.ts` - State management
- `/src/features/test-input/TestInputDashboard.tsx` - TDD UI
- `/src/features/report-builder/components/EditPanel/EditPanel.tsx` - Field editor
- `/docs/15-Contract-review/-passover-sessions/25.12.08 - TDD-V3-section-sync.md` - Original spec
