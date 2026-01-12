const fs = require('fs');
const path = require('path');

// File paths
const templatePath = 'docs/15-Contract-review/1-Formatting & Report/Report-MF-Template-Framed-v2.1.html';
const currentDataPath = 'src/features/report-builder/data/northBattlefordTestData.ts';
const imageManifestPath = 'docs/15-Contract-review/2-Field Management/IMAGE-MANIFEST.json';

// Read template and extract all field IDs
console.log('📖 Reading template...');
const template = fs.readFileSync(templatePath, 'utf8');
const fieldIdRegex = /\{\{([^}]+)\}\}/g;
const fieldIds = new Set();
let match;
while ((match = fieldIdRegex.exec(template)) !== null) {
  fieldIds.add(match[1].trim());
}
console.log(`✅ Found ${fieldIds.size} unique field IDs`);

// Read current test data
console.log('📖 Reading current test data...');
const currentDataContent = fs.readFileSync(currentDataPath, 'utf8');
// Extract the data object (everything between { and };)
const dataMatch = currentDataContent.match(/export const northBattlefordTestData[^=]*=\s*(\{[\s\S]*\});/);
if (!dataMatch) {
  throw new Error('Could not parse current test data');
}
const currentData = eval(`(${dataMatch[1]})`);
console.log(`✅ Loaded ${Object.keys(currentData).length} existing fields`);

// Read IMAGE-MANIFEST.json
console.log('📖 Reading IMAGE-MANIFEST.json...');
const imageManifest = JSON.parse(fs.readFileSync(imageManifestPath, 'utf8'));
console.log(`✅ Loaded ${Object.keys(imageManifest.images).length} image mappings`);

// Helper to determine if a field is an image field
function isImageField(fieldId) {
  const imageKeywords = ['photo', 'image', 'img', 'map', 'logo', 'signature', 'chart', 'plan'];
  return imageKeywords.some(keyword => fieldId.toLowerCase().includes(keyword));
}

// Helper to get placeholder value based on field type
function getPlaceholder(fieldId) {
  // Check if it's a number field
  if (fieldId.includes('price') || fieldId.includes('value') || fieldId.includes('cost') || 
      fieldId.includes('rent') || fieldId.includes('expense') || fieldId.includes('noi') ||
      fieldId.includes('cap-rate') || fieldId.includes('grm') || fieldId.includes('psf') ||
      fieldId.includes('per-unit') || fieldId.includes('pct') || fieldId.includes('ratio') ||
      fieldId.includes('adj') || fieldId.includes('size') || fieldId.includes('sf') ||
      fieldId.includes('units') || fieldId.includes('age') || fieldId.includes('year') ||
      fieldId.includes('id') || fieldId.includes('geocode') || fieldId.includes('latitude') ||
      fieldId.includes('longitude')) {
    // Check if it's a percentage
    if (fieldId.includes('pct') || fieldId.includes('ratio') || fieldId.includes('cap-rate')) {
      return '0%';
    }
    // Check if it's a currency field
    if (fieldId.includes('price') || fieldId.includes('value') || fieldId.includes('cost') ||
        fieldId.includes('rent') || fieldId.includes('expense') || fieldId.includes('noi') ||
        fieldId.includes('adj') || fieldId.includes('per-unit') || fieldId.includes('psf')) {
      return '$0';
    }
    return 0;
  }
  
  // Check if it's a date field
  if (fieldId.includes('date') || fieldId.includes('year-built')) {
    return '';
  }
  
  // Default placeholder text
  return `[${fieldId}]`;
}

// Build complete data object
console.log('🔨 Building complete data object...');
const completeData = { ...currentData };
let filledCount = 0;
let placeholderCount = 0;
let imageCount = 0;

Array.from(fieldIds).sort().forEach(fieldId => {
  // Skip if already exists
  if (completeData[fieldId] !== undefined) {
    return;
  }
  
  // Check if it's an image field
  if (isImageField(fieldId)) {
    // Try to find in IMAGE-MANIFEST
    let imagePath = null;
    
    // Direct match
    if (imageManifest.images[fieldId]) {
      imagePath = `/${imageManifest.images[fieldId]}`;
    } else {
      // Try variations
      const variations = [
        fieldId.replace('-photo', ''),
        fieldId.replace('img-', ''),
        fieldId.replace('photo-', 'subject-photo-'),
        `subject-${fieldId}`,
        fieldId.replace('comp', 'comp').replace('-photo', '-photo'),
      ];
      
      for (const variation of variations) {
        if (imageManifest.images[variation]) {
          imagePath = `/${imageManifest.images[variation]}`;
          break;
        }
      }
    }
    
    if (imagePath) {
      completeData[fieldId] = imagePath;
      imageCount++;
    } else {
      completeData[fieldId] = getPlaceholder(fieldId);
      placeholderCount++;
    }
  } else {
    // Use placeholder
    completeData[fieldId] = getPlaceholder(fieldId);
    placeholderCount++;
  }
  
  filledCount++;
});

console.log(`✅ Filled ${filledCount} missing fields`);
console.log(`   - ${imageCount} image fields`);
console.log(`   - ${placeholderCount} placeholder fields`);

// Generate output
console.log('📝 Generating output...');
const outputLines = [
  '/**',
  ' * North Battleford Apartments Test Data',
  ' *',
  ' * Comprehensive test data extracted from North Battleford appraisal report.',
  ' * This data can be used to populate the Report Builder for testing and demonstration.',
  ' *',
  ' * Property: North Battleford Apartments',
  ' * Address: 1101, 1121 109 St, North Battleford, Saskatchewan',
  ' * File: VAL251012 - 1',
  ' * Valuation Date: October 17, 2025',
  ' *',
  ' * Updated: ' + new Date().toISOString().split('T')[0],
  ' * Complete dataset with all 1,020 template field IDs filled.',
  ' */',
  '',
  '/**',
  ' * Test data mapping field IDs to values.',
  ' * Maps to field IDs defined in reportBuilderStore.ts and fieldRegistry.ts',
  ' */',
  'export const northBattlefordTestData: Record<string, string | number | string[]> =',
  '{'
];

// Sort keys for better organization
const sortedKeys = Object.keys(completeData).sort();

sortedKeys.forEach((key, index) => {
  const value = completeData[key];
  let valueStr;
  
  if (Array.isArray(value)) {
    valueStr = JSON.stringify(value);
  } else if (typeof value === 'string') {
    valueStr = JSON.stringify(value);
  } else if (typeof value === 'number') {
    valueStr = value.toString();
  } else {
    valueStr = JSON.stringify(value);
  }
  
  outputLines.push(`  "${key}": ${valueStr}${index < sortedKeys.length - 1 ? ',' : ''}`);
});

outputLines.push('};');

const output = outputLines.join('\n');

// Write to file
fs.writeFileSync(currentDataPath, output, 'utf8');
console.log(`✅ Written complete data to ${currentDataPath}`);
console.log(`📊 Total fields: ${sortedKeys.length}`);
console.log(`📊 Existing fields: ${Object.keys(currentData).length}`);
console.log(`📊 New fields: ${filledCount}`);


