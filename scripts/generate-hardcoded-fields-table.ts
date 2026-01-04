import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read EditPanel file
const editPanelPath = path.join(__dirname, '../src/features/report-builder/components/EditPanel/EditPanel.tsx');
const editPanelContent = fs.readFileSync(editPanelPath, 'utf8');

// Read fieldRegistry to get all fields
const registryPath = path.join(__dirname, '../src/features/report-builder/schema/fieldRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extract all field IDs from registry
const registryFieldIds = new Set<string>();
const storeIdMatches = registryContent.matchAll(/storeId:\s*['"]([^'"]+)['"]/g);
for (const match of storeIdMatches) {
  registryFieldIds.add(match[1]);
}

console.log(`Total fields in registry: ${registryFieldIds.size}`);

// Parse hardcoded layouts manually (since we can't eval TypeScript)
const layouts: Record<string, Record<string, string[]>> = {
  'home': {
    'job-setup': ['job-number', 'report-date'],
    'client-info': ['client-first-name', 'client-last-name', 'client-full-name', 'client-organization', 'client-email', 'client-phone', 'client-address', 'client-city', 'client-province', 'client-postal'],
    'appraiser-info': ['appraiser-name', 'appraiser-credentials', 'appraiser-aic', 'appraiser-company', 'appraiser-email', 'appraiser-phone'],
    'property-info': ['property-name', 'property-address', 'property-type', 'report-legal'],
    'assignment-details': ['report-type', 'property-rights', 'report-intendeduse', 'report-intendeduser', 'scope-of-work'],
    'subject-contact': ['contact-first-name', 'contact-last-name', 'contact-phone', 'contact-email', 'valuation-date'],
    'assumptions-conditions': ['report-extraordinary', 'report-hypothetical', 'report-limcond'],
    'transmittal-content': ['transmittal-date', 'transmittal-body'],
  },
  'cover': {
    'client-info': ['client-contact-name', 'client-company', 'client-address', 'client-city', 'client-province', 'client-postal'],
    'appraiser-info': ['appraiser-name', 'appraiser-credentials', 'appraiser-title', 'appraiser-company', 'appraiser-address', 'appraiser-city', 'appraiser-phone', 'appraiser-website', 'appraiser-email', 'appraiser-aic-number'],
  },
  'maps': {
    'location-maps': ['img-map-regional', 'img-map-local'],
    'aerial-maps': ['img-map-aerial-1', 'img-map-aerial-2', 'img-zoning-map'],
    'site-plans': ['img-site-plan-1', 'img-site-plan-2'],
  },
  'assignment': {
    'assignment-property-id': ['assignment-property-legal', 'assignment-property-address', 'assignment-property-type', 'assignment-property-interest'],
    'assignment-client': ['assignment-client-name', 'assignment-client-address', 'assignment-intended-use', 'assignment-intended-users'],
    'assignment-scope': ['assignment-inspection-date', 'assignment-inspection-type', 'assignment-inspector-name', 'assignment-data-sources', 'assignment-analysis-methods'],
    'assignment-dates': ['assignment-effective-date', 'assignment-report-date'],
    'assignment-conditions': ['assignment-hypothetical', 'assignment-extraordinary-assumptions', 'assignment-general-assumptions', 'assignment-limiting-conditions'],
  },
  'exec': {
    'property-identification': ['value-scenario', 'property-rights', 'building-style', 'total-buildings', 'total-nra', 'total-units', 'year-built', 'occupancy-rate', 'stories', 'building-format'],
    'value-summary': ['concluded-value', 'hypothetical-conditions', 'extraordinary-assumptions', 'extraordinary-limiting-conditions'],
  },
  'site': {
    'site-area': ['site-total-area', 'site-acreage', 'site-address', 'site-shape', 'topography', 'accessibility', 'exposure-visibility'],
    'adjacent-uses': ['adjacent-north', 'adjacent-south', 'adjacent-east', 'adjacent-west'],
    'site-conditions': ['easements', 'soils', 'hazardous-waste', 'site-rating', 'site-conclusion'],
    'site-plan-images': ['site-plan-image'],
  },
  'impv': {
    'building-overview': ['impv-overview', 'impv-num-buildings', 'impv-nra', 'impv-year-built', 'impv-num-units', 'impv-stories', 'impv-building-format'],
    'amenities': ['project-amenities', 'unit-amenities', 'laundry', 'security'],
    'construction': ['foundation', 'exterior-walls', 'roof', 'impv-roof-condition', 'impv-insulation', 'elevator'],
    'systems': ['hvac', 'electrical', 'plumbing', 'fire-protection'],
    'finishes': ['interior-walls', 'ceilings', 'flooring', 'doors-windows', 'impv-interior-finish'],
    'site-improvements': ['site-impv', 'landscaping', 'parking-spaces', 'parking-ratio', 'impv-building-footprint', 'impv-site-coverage'],
    'condition': ['overall-condition', 'functional-design', 'hazardous-materials'],
  },
  'sales': {
    'subject-summary': ['subject-units', 'subject-gba', 'subject-year', 'subject-site-area', 'subject-parking', 'subject-condition'],
    'sale-comp-1': ['comp1-name', 'comp1-address', 'comp1-sale-date', 'comp1-sale-price', 'comp1-units', 'comp1-price-per-unit', 'comp1-gba', 'comp1-price-per-sf', 'comp1-year', 'comp1-cap-rate', 'comp1-adj-property-rights', 'comp1-adj-financing', 'comp1-adj-conditions-sale', 'comp1-adj-market-time', 'comp1-adj-location', 'comp1-adj-size', 'comp1-adj-age-condition', 'comp1-adj-other'],
    'sale-comp-2': ['comp2-name', 'comp2-address', 'comp2-sale-date', 'comp2-sale-price', 'comp2-units', 'comp2-price-per-unit', 'comp2-gba', 'comp2-price-per-sf', 'comp2-year', 'comp2-cap-rate', 'comp2-adj-property-rights', 'comp2-adj-financing', 'comp2-adj-conditions-sale', 'comp2-adj-market-time', 'comp2-adj-location', 'comp2-adj-size', 'comp2-adj-age-condition', 'comp2-adj-other'],
    'sale-comp-3': ['comp3-name', 'comp3-address', 'comp3-sale-date', 'comp3-sale-price', 'comp3-units', 'comp3-price-per-unit', 'comp3-gba', 'comp3-price-per-sf', 'comp3-year', 'comp3-cap-rate', 'comp3-adj-property-rights', 'comp3-adj-financing', 'comp3-adj-conditions-sale', 'comp3-adj-market-time', 'comp3-adj-location', 'comp3-adj-size', 'comp3-adj-age-condition', 'comp3-adj-other'],
    'sales-conclusion': ['sales-value-indication', 'sales-adjustment-summary'],
  },
  'income': {
    'income-potential': ['income-pgi-narrative'],
    'income-expenses': ['income-expense-narrative'],
    'income-noi': ['income-noi-narrative'],
    'income-analysis': ['income-cap-rate-analysis', 'income-value-indication'],
  },
};

// Collect all hardcoded field IDs
const hardcodedFieldIds = new Set<string>();
Object.values(layouts).forEach(sectionLayouts => {
  Object.values(sectionLayouts).forEach(fieldIds => {
    fieldIds.forEach(id => hardcodedFieldIds.add(id));
  });
});

console.log(`Total hardcoded field IDs: ${hardcodedFieldIds.size}`);

// Find missing fields per section
const sectionFields = new Map<string, Set<string>>();
registryContent.split('\n').forEach(line => {
  const sectionMatch = line.match(/section:\s*['"]([^'"]+)['"]/);
  const storeIdMatch = line.match(/storeId:\s*['"]([^'"]+)['"]/);
  if (sectionMatch && storeIdMatch) {
    const section = sectionMatch[1];
    const fieldId = storeIdMatch[1];
    if (!sectionFields.has(section)) {
      sectionFields.set(section, new Set());
    }
    sectionFields.get(section)!.add(fieldId);
  }
});

// Generate markdown table
let output = '# Hardcoded Field IDs in EditPanel\n\n';
output += `**Total Fields in Registry:** ${registryFieldIds.size}\n`;
output += `**Total Hardcoded Field IDs:** ${hardcodedFieldIds.size}\n`;
output += `**Missing Fields (in store, not in UI):** ${registryFieldIds.size - hardcodedFieldIds.size}\n\n`;

output += '## Field IDs by Tab/Section/Subsection\n\n';
output += '| Tab | Section | Subsection | Hardcoded Field IDs | Missing Field IDs (in store) |\n';
output += '|-----|---------|------------|---------------------|-------------------------------|\n';

const tabOrder = ['home', 'cover', 'maps', 'assignment', 'exec', 'site', 'impv', 'sales', 'income'];

tabOrder.forEach(tab => {
  const sectionLayouts = layouts[tab];
  if (!sectionLayouts) return;

  Object.entries(sectionLayouts).forEach(([subsection, fieldIds]) => {
    const hardcodedIds = fieldIds.join(', ');
    
    // Find missing fields for this section/subsection
    const sectionStoreFields = sectionFields.get(tab) || new Set();
    const missingFields = Array.from(sectionStoreFields)
      .filter(id => !hardcodedFieldIds.has(id))
      .sort();
    
    const missingIds = missingFields.length > 0 ? missingFields.join(', ') : '*(none)*';
    
    output += `| ${tab} | ${tab} | ${subsection} | ${hardcodedIds} | ${missingIds} |\n`;
  });
});

// Add sections that exist in store but have NO hardcoded layouts
output += '\n## Sections with NO Hardcoded Layouts (All Fields Missing from UI)\n\n';
output += '| Section | Total Fields in Store | Field IDs |\n';
output += '|---------|---------------------|-----------|\n';

sectionFields.forEach((fields, section) => {
  if (!layouts[section] && fields.size > 0) {
    const fieldList = Array.from(fields).sort().join(', ');
    output += `| ${section} | ${fields.size} | ${fieldList} |\n`;
  }
});

// Write to file
const outputPath = path.join(__dirname, '../docs/15-Contract-review/0-APR-Domain-Core-Mgt/HARDCODED-FIELDS-TABLE.md');
fs.writeFileSync(outputPath, output);
console.log(`\n✅ Table generated: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`   - Hardcoded: ${hardcodedFieldIds.size} fields`);
console.log(`   - Missing: ${registryFieldIds.size - hardcodedFieldIds.size} fields`);

