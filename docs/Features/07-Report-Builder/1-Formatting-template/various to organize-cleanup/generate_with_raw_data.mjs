/**
 * Generate HTML using Report Builder Template with Raw Data
 *
 * This script manually builds the minimal ReportSection[] structure
 * from northBattlefordTestData and passes it to generateReportHtml
 */

import { writeFileSync } from 'fs';
import { generateReportHtml } from '../../../src/features/report-builder/templates/reportHtmlTemplate.js';
import { northBattlefordTestData } from '../../../src/features/report-builder/data/northBattlefordTestData.js';

console.log('\n' + '='.repeat(70));
console.log('GENERATING HTML FROM REPORT BUILDER TEMPLATE WITH RAW DATA');
console.log('='.repeat(70) + '\n');

console.log('📊 Building report sections from test data...');

// Build minimal sections structure
// The template only needs sections with fields that have id and value
const sections = [
  {
    id: 'cover',
    name: 'Cover',
    shortName: 'Cover',
    fields: [],
    subsections: []
  },
  {
    id: 'exec',
    name: 'Executive Summary',
    shortName: 'Executive Summary',
    fields: [],
    subsections: []
  },
  {
    id: 'photos',
    name: 'Photos',
    shortName: 'Photos',
    fields: [],
    subsections: []
  },
  {
    id: 'site',
    name: 'Site',
    shortName: 'Site',
    fields: [],
    subsections: []
  },
  {
    id: 'impv',
    name: 'Improvements',
    shortName: 'Improvements',
    fields: [],
    subsections: []
  },
  {
    id: 'recon',
    name: 'Reconciliation',
    shortName: 'Reconciliation',
    fields: [],
    subsections: []
  }
];

// Map test data fields to sections
// This is a simplified version - just add all fields to their respective sections
const sectionMap = {
  'cover': 'cover',
  'exec': 'exec',
  'photos': 'photos',
  'site': 'site',
  'impv': 'impv',
  'recon': 'recon'
};

// Convert test data to fields
let totalFields = 0;
for (const [fieldId, value] of Object.entries(northBattlefordTestData)) {
  // Skip functions
  if (typeof value === 'function') continue;

  // Create a field object
  const field = {
    id: fieldId,
    value: value,
    label: fieldId,
    type: 'text',
    isEditable: true
  };

  // Add to appropriate section (default to cover for now)
  sections[0].fields.push(field);
  totalFields++;
}

console.log(`   ✅ Built ${sections.length} sections with ${totalFields} total fields`);

// Generate HTML
console.log('\n📝 Generating HTML from template...');
const html = generateReportHtml(sections);
console.log(`   ✅ Generated ${html.length} characters`);

// Write to file
const outputPath = './generated-report.html';
writeFileSync(outputPath, html, 'utf8');
console.log(`   ✅ Saved to: ${outputPath}`);

console.log('\n✅ HTML generation complete!\n');
console.log('Next step: Run comparison');
console.log('  python3 compare_reports.py\n');
