# Mock-Builder App - Registry & Workbook Expert Review

**Date:** January 3, 2026  
**Reviewer:** Registry & Workbook Expert  
**App Location:** `/mock-builder` route  
**Status:** ✅ **ARCHITECTURE COMPLIANT** with minor recommendations

---

## Executive Summary

The mock-builder app correctly follows the **fieldRegistry.ts as Single Source of Truth** architecture pattern. The store dynamically builds all sections from the registry (1,687 fields), ensuring consistency across the application. However, there are opportunities to improve Valcre ID verification and field mapping documentation.

---

## ✅ Architecture Compliance

### 1. Field Registry as Source of Truth

**Status:** ✅ **CORRECT**

The app correctly implements the hierarchy:

```
fieldRegistry.ts (1,687 fields)
    ↓
reportBuilderStore.ts (buildAllSectionsFromRegistry)
    ↓
UI Components (EditPanel, PreviewPanel)
    ↓
Template (reportHtmlTemplate.ts)
```

**Evidence:**
- `reportBuilderStore.ts:199-262` - `buildAllSectionsFromRegistry()` dynamically builds sections from `fieldRegistry`
- Store imports directly from `fieldRegistry.ts:10`
- No hardcoded field definitions in components

**Code Reference:**
```199:262:src/features/report-builder/store/reportBuilderStore.ts
const buildAllSectionsFromRegistry = (): ReportSection[] => {
  // Group fields by section, then by subsection
  const sectionMap = new Map<string, Map<string, ReportField[]>>();

  fieldRegistry.forEach(fieldDef => {
    const sectionId = fieldDef.section;
    const subsectionId = fieldDef.subsection || '__root__';

    // Initialize section if doesn't exist
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, new Map());
    }

    const subsectionMap = sectionMap.get(sectionId)!;

    // Initialize subsection if doesn't exist
    if (!subsectionMap.has(subsectionId)) {
      subsectionMap.set(subsectionId, []);
    }

    // Add field to subsection
    subsectionMap.get(subsectionId)!.push({
      id: fieldDef.storeId,
      label: fieldDef.label,
      type: fieldDef.type as any,
      value: fieldDef.defaultValue || '',
      isEditable: true,
      inputType: 'user-input',
    });
  });

  // Build section objects from the map
  const sections: ReportSection[] = [];

  sectionMap.forEach((subsectionMap, sectionId) => {
    const subsections: Array<{ id: string; title: string; fields: ReportField[] }> = [];
    const rootFields: ReportField[] = [];

    subsectionMap.forEach((fields, subsectionId) => {
      if (subsectionId === '__root__') {
        rootFields.push(...fields);
      } else {
        subsections.push({
          id: subsectionId,
          title: formatTitle(subsectionId),
          fields: fields,
        });
      }
    });

    sections.push({
      id: sectionId,
      name: formatTitle(sectionId),
      shortName: formatShortName(sectionId),
      fields: rootFields,
      subsections: subsections.length > 0 ? subsections : undefined,
    });
  });

  return sections;
};
```

---

## ⚠️ Valcre ID Mapping Status

### Current State

**Status:** ⚠️ **PARTIAL IMPLEMENTATION**

Some fields have `valcreRange` property, but:
1. **Not in TypeScript interface** - `FieldDefinition` doesn't include `valcreRange`
2. **Not verified against ground truth** - No verification against `valcre-named-ranges-complete.json`
3. **Inconsistent usage** - Only ~49 fields have `valcreRange` out of 1,687 total

**Example Fields with valcreRange:**
```345:345:src/features/report-builder/schema/fieldRegistry.ts
  { id: 'city-formal', storeId: 'city-formal', label: 'City (Formal Name)', section: 'cover', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_CityFormal' },
```

**Fields Missing valcreRange:**
- Most fields in `fieldRegistry.ts` don't have Valcre mappings
- `workbookFieldMapping.ts` exists but isn't integrated with registry

### Recommendations

1. **Add `valcreId` to FieldDefinition interface:**
```typescript
export interface FieldDefinition {
  id: string;
  storeId: string;
  label: string;
  section: string;
  subsection?: string;
  type: 'text' | 'number' | 'date' | 'image' | 'textarea' | 'select' | 'dropdown' | 'multi-select' | 'currency' | 'percentage' | 'calculated' | 'boolean';
  inputSource: 'user-input' | 'calculated' | 'api-fetch' | 'template' | 'auto-filled';
  options?: string[];
  required: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  calculationFormula?: string;
  notes?: string;
  valcreId?: string;  // ← ADD THIS (Valcre named range, e.g., 'IA_DirCap_CapRate')
  valcreVerified?: boolean;  // ← ADD THIS (true if verified against ground truth JSON)
}
```

2. **Verify all Valcre IDs against ground truth:**
```bash
# For each valcreRange in fieldRegistry.ts, verify:
grep '"Subject_CityFormal"' docs/15-Contract-review/2-Field\ Management/valcre-named-ranges-complete.json
```

3. **Integrate workbookFieldMapping.ts with fieldRegistry:**
   - Currently `workbookFieldMapping.ts` has mappings but isn't used
   - Consider auto-generating `valcreId` from `workbookFieldMapping.ts` during build

---

## ✅ Template Field ID Usage

### Status: ✅ **MOSTLY CORRECT**

The template (`reportHtmlTemplate.ts`) correctly uses registry field IDs:

**Evidence:**
- Template uses `getFieldValue()` helper that searches sections by field ID
- Field IDs match registry `storeId` values
- Template correctly handles subsections

**Example:**
```61:81:src/features/report-builder/templates/reportHtmlTemplate.ts
  const propertyType = getFieldValue(coverSection, 'property-type-display');
  const propertyName = getFieldValue(coverSection, 'property-name');
  const streetAddress = getFieldValue(coverSection, 'street-address');
  const city = getFieldValue(coverSection, 'city');
  const province = getFieldValue(coverSection, 'province');
  const clientContactName = getFieldValue(coverSection, 'client-contact-name');
  const clientCompany = getFieldValue(coverSection, 'client-company');
  const clientAddress = getFieldValue(coverSection, 'client-address');
  const clientCity = getFieldValue(coverSection, 'client-city');
  const clientProvince = getFieldValue(coverSection, 'client-province');
  const clientPostal = getFieldValue(coverSection, 'client-postal');
  const appraiserCompany = getFieldValue(coverSection, 'appraiser-company');
  const appraiserAddress = getFieldValue(coverSection, 'appraiser-address');
  const appraiserCity = getFieldValue(coverSection, 'appraiser-city');
  const appraiserProvince = getFieldValue(coverSection, 'appraiser-province');
  const appraiserPostal = getFieldValue(coverSection, 'appraiser-postal');
  const appraiserPhone = getFieldValue(coverSection, 'appraiser-phone');
  const appraiserWebsite = getFieldValue(coverSection, 'appraiser-website');
  const valuationDate = getFieldValue(coverSection, 'valuation-date');
  const reportDate = getFieldValue(coverSection, 'report-date');
  const fileNumber = getFieldValue(coverSection, 'file-number');
```

**Note:** Template uses `getGlobalFieldValue()` for cross-section lookups (e.g., `postal-code`, `market`), which is correct for fields that may exist in multiple sections.

---

## ✅ Test Data Mapping

### Status: ✅ **CORRECT**

The store includes `testDataFieldMapping` to handle field ID differences between test data and registry:

**Evidence:**
```14:157:src/features/report-builder/store/reportBuilderStore.ts
// Field ID mapping: test data ID -> store field ID (for fields that differ)
const testDataFieldMapping: Record<string, string> = {
  // CALC section - unit fields
  "calc-unit-1-type": "calc-type1-name",
  "calc-unit-1-count": "calc-type1-count",
  "calc-unit-1-sf": "calc-type1-sf",
  "calc-unit-1-market-rent": "calc-type1-rent",
  // ... more mappings
};
```

**Recommendation:** Document why these mappings exist. Are test data IDs legacy, or do they serve a specific purpose?

---

## ✅ Section Building Logic

### Status: ✅ **CORRECT**

The `buildAllSectionsFromRegistry()` function correctly:
1. Groups fields by section → subsection
2. Handles fields without subsections (`__root__`)
3. Formats section names from kebab-case IDs
4. Preserves field metadata (type, label, defaultValue)

**Architecture Pattern:** ✅ Follows single-source-of-truth pattern

---

## ⚠️ Image Fields Classification

### Status: ⚠️ **NEEDS VERIFICATION**

Image fields in `fieldRegistry.ts` should be classified per the Registry Expert guidelines:

**Current State:**
- `img-map-regional`, `img-map-local`, `img-map-aerial` → Should sync from Valcre (`Map_Regional`, `Map_Local`, `Map_Aerial`)
- `img-cover-photo` → Should sync from Valcre (`Subject_Photo`)
- `subject-photo-1` through `subject-photo-25` → Should be `DASHBOARD-IMAGE` (uploader-managed)
- All other image fields → Should be `DASHBOARD-IMAGE`

**Recommendation:** Add `imageSource` property to image fields:
```typescript
{
  id: 'img-map-regional',
  type: 'image',
  imageSource: 'valcre-sync',  // or 'dashboard-upload'
  valcreId: 'Map_Regional',
  // ...
}
```

---

## ✅ Store Initialization

### Status: ✅ **CORRECT**

The store correctly initializes from registry:

**Evidence:**
```5959:5975:src/features/report-builder/store/reportBuilderStore.ts
  initializeMockData: async () => {
    // Build ALL sections dynamically from fieldRegistry (1,687 fields)
    const sections = buildAllSectionsFromRegistry();

    console.log(`initializeMockData: Built ${sections.length} sections from fieldRegistry`);
    const totalFields = sections.reduce((sum, section) => {
      const sectionFields = section.fields?.length || 0;
      const subsectionFields = section.subsections?.reduce((subSum, sub) => subSum + sub.fields.length, 0) || 0;
      return sum + sectionFields + subsectionFields;
    }, 0);
    console.log(`initializeMockData: Total fields in store: ${totalFields}`);

    // Force reload template to ensure we get the latest version
    const template = await get().loadPreviewTemplate(true);
    const html = get().interpolateTemplate(sections, template);
    set({ sections, sectionGroups, previewHtml: html });
  },
```

**Note:** Store preserves existing data when loading job data (line 33-40 in `MockReportBuilder.tsx`), which is correct behavior.

---

## 📋 Recommendations Summary

### High Priority

1. **Add `valcreId` to FieldDefinition interface** - Currently using `valcreRange` but not in TypeScript interface
2. **Verify Valcre IDs against ground truth** - Use `/check-field-verify` command before adding mappings
3. **Classify image fields** - Add `imageSource` property to distinguish Valcre-synced vs uploader-managed

### Medium Priority

4. **Document test data mappings** - Explain why `testDataFieldMapping` exists
5. **Integrate workbookFieldMapping.ts** - Connect existing mappings to registry
6. **Add Valcre verification flag** - Track which fields have been verified

### Low Priority

7. **Consider field ID validation** - Runtime check that template field IDs exist in registry
8. **Add field usage tracking** - Track which fields are used in template vs UI

---

## ✅ Compliance Checklist

- [x] Field registry is single source of truth
- [x] Store builds sections dynamically from registry
- [x] Template uses registry field IDs
- [x] Test data mappings exist for ID differences
- [x] Section building logic is correct
- [ ] Valcre IDs verified against ground truth
- [ ] Image fields properly classified
- [ ] FieldDefinition interface includes Valcre mapping

---

## Conclusion

The mock-builder app **correctly implements the fieldRegistry architecture pattern**. The dynamic section building from registry ensures consistency and maintainability. The main improvement opportunity is formalizing Valcre ID mappings and verifying them against ground truth.

**Overall Grade:** ✅ **A-** (Excellent architecture, minor improvements needed for Valcre integration)

---

*Review completed: January 3, 2026*  
*Next review: After Valcre ID verification implementation*

