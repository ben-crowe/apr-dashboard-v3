# LOE Template Field Mapping Analysis

**Last Updated**: 2025-12-23  
**Purpose**: Document which fields from `loe-prep` section feed into LOE contract vs appraisal report

---

## LOE Contract Template Fields

### Template Location
- **File**: `/src/utils/loe/v3Template.ts`
- **Placeholder Format**: `[field-name]` (bracketed placeholders)
- **Mapping Function**: `mapDataToV3Fields()` in `/src/utils/loe/generateLOE.ts`

### Complete Field List (17 placeholders found in template)

| # | LOE Template Placeholder | Source Section | Dashboard Field ID | Field Registry ID | Used In |
|---|-------------------------|----------------|-------------------|-------------------|---------|
| 1 | `[date.created]` | Auto-generated | Current date | N/A | LOE Contract |
| 2 | `[propertycontact.company]` | client-intake | `clientOrganization` | `client-organization` | LOE Contract |
| 3 | `[propertycontact.firstname]` | client-intake | `clientFirstName` | `client-first-name` | LOE Contract |
| 4 | `[propertycontact.lastname]` | client-intake | `clientLastName` | `client-last-name` | LOE Contract |
| 5 | `[propertycontact.title]` | client-intake | `clientTitle` | `client-title` | LOE Contract |
| 6 | `[propertycontact.addressstreet]` | client-intake | `clientAddress` | `client-address` | LOE Contract |
| 7 | `[name]` | loe-prep | `jobNumber` | `job-number` | LOE Contract |
| 8 | `[addressstreet]` | client-intake | `propertyAddress` | `property-address` | LOE Contract |
| 9 | `[purposes]` | client-intake | `intendedUse` | `intended-use` | LOE Contract |
| 10 | `[intendeduses]` | client-intake | `intendedUse` | `intended-use` | LOE Contract |
| 11 | `[requestedvalues]` | client-intake | `valuationPremises` | `valuation-premises` | LOE Contract |
| 12 | `[propertyrights]` | loe-prep | `propertyRightsAppraised` | `property-rights` | LOE Contract |
| 13 | `[reportformat]` | loe-prep | `reportType` | `report-type` | LOE Contract |
| 14 | `[fee]` | loe-prep | `appraisalFee` | `appraisal-fee` | LOE Contract |
| 15 | `[scopes]` | loe-prep | `scopeOfWork` | `scope-of-work` | LOE Contract |
| 16 | `[duedate]` | loe-prep | `deliveryDate` | `delivery-date` | LOE Contract |

**Additional Fields in Mapping Function** (may be used conditionally):
- `[jobnumber]` - Maps to `job-number` (same as `[name]`)
- `[paymentterms]` - Maps to `payment-terms` 
- `[retainer]` - Maps to `retainer-amount`
- `[notes]` - Maps to `special-instructions` (fallback chain: `jobDetails.specialInstructions` → `job.notes` → `""`)

**DocuSeal Signature Fields** (not placeholders, but HTML tags):
- `<signature-field role="First Party">` - Client signature capture
- `<date-field role="First Party">` - Signature date capture

---

## Fields from `loe-prep` Section

### Used in LOE Contract Only (8 fields)

| Field ID | Label | Subsection | Used In |
|----------|-------|------------|---------|
| `job-number` | Valcre Job ID (VAL#) | job-assignment | LOE Contract only |
| `appraisal-fee` | Appraisal Fee | financial-terms | LOE Contract only |
| `retainer-amount` | Retainer Amount | financial-terms | LOE Contract only |
| `payment-terms` | Payment Terms | financial-terms | LOE Contract only |
| `delivery-date` | Delivery Date | delivery-details | LOE Contract only |
| `report-type` | Report Type | delivery-details | LOE Contract only |
| `property-rights` | Property Rights Appraised | delivery-details | LOE Contract only |
| `scope-of-work` | Scope of Work | scope-loe | LOE Contract only |
| `special-instructions` | Special Instructions | scope-loe | LOE Contract only |

### Used in Appraisal Report Only (7 fields)

| Field ID | Label | Subsection | Used In |
|----------|-------|------------|---------|
| `appraiser-name` | Appraiser Name | appraiser-info | Appraisal Report only |
| `appraiser-credentials` | Appraiser Credentials | appraiser-info | Appraisal Report only |
| `appraiser-title` | Appraiser Title | appraiser-info | Appraisal Report only |
| `appraiser-email` | Appraiser Email | appraiser-info | Appraisal Report only |
| `appraiser-aic` | AIC Number | appraiser-info | Appraisal Report only |
| `valuation-date` | Date of Valuation | appraiser-info | Appraisal Report only |
| `report-date` | Date of Report | appraiser-info | Appraisal Report only |

### Used in Both LOE Contract AND Appraisal Report (0 fields)

**Note**: `valuation-premises` is in `client-intake` section, not `loe-prep`, so it's not counted in this breakdown.

### Internal Only - Not Used in Documents (2 fields)

| Field ID | Label | Subsection | Used In |
|----------|-------|------------|---------|
| `internal-comments` | Internal Comments | comments-loe | Internal only |
| `appraiser-comments` | Appraiser Comments | comments-loe | Internal only |

---

## Summary Breakdown

### LOE Contract Document Fields
**Total**: 17 placeholders found in template
- **From client-intake**: 7 fields (client info, property address, intended use, valuation-premises)
- **From loe-prep**: 9 fields (job number, fees, dates, scope, rights, etc.)
- **Auto-generated**: 1 field (date.created)

### Appraisal Report Document Fields
**Total**: 7 fields from loe-prep
- All from `appraiser-info` subsection
- Used in report headers, certification, and appraiser identification sections

### Field Overlap
- **No overlap**: All `loe-prep` fields are used in either LOE Contract OR Appraisal Report, but not both
- **Note**: `valuation-premises` is in `client-intake` section and appears in both documents

---

## Field Mapping Notes

### LOE Template Mapping
- Uses **bracketed placeholders**: `[field-name]`
- Mapped in `mapDataToV3Fields()` function
- Data sources: `job` (client-intake) + `jobDetails` (loe-prep)

### Appraisal Report Template Mapping
- Uses **double-brace placeholders**: `{{field-id}}`
- Mapped directly from fieldRegistry store
- Data sources: All sections including `loe-prep`

### Key Differences
1. **LOE Contract**: Uses `job` + `jobDetails` objects (dashboard data structure)
2. **Appraisal Report**: Uses fieldRegistry store (standardized field IDs)
3. **Placeholder Format**: `[brackets]` vs `{{braces}}`
4. **Field Names**: LOE uses descriptive names (`[propertycontact.company]`), Report uses canonical IDs (`{{client-organization}}`)

---

## Recommendations

### For Field Registry Alignment
1. **LOE Contract fields** are mapped from dashboard objects, not fieldRegistry directly
2. **Appraisal Report fields** use fieldRegistry IDs directly
3. Consider creating a mapping layer to align LOE template with canonical field names

### Field Usage Summary
- **LOE Contract**: 9 fields from `loe-prep` section
- **Appraisal Report**: 7 fields from `loe-prep` section  
- **Both Documents**: 0 fields (all `loe-prep` fields are document-specific)
- **Internal Only**: 2 fields (`internal-comments`, `appraiser-comments`)

**Total `loe-prep` fields**: 18 fields
- 9 → LOE Contract
- 7 → Appraisal Report  
- 2 → Internal only

---

**Files Referenced**:
- `/src/utils/loe/v3Template.ts` - LOE HTML template
- `/src/utils/loe/generateLOE.ts` - Field mapping function
- `/src/features/report-builder/schema/fieldRegistry.ts` - Field definitions
- `/public/Report-MF-template.html` - Appraisal report template
- `/docs/3-DOCUSEAL-LOE-FIELD-MAPPING.md` - DocuSeal integration docs

