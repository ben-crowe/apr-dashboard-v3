/**
 * Generate Real HTML from Report Builder Template
 *
 * Uses actual reportHtmlTemplate with North Battleford test data
 */

import { writeFileSync } from 'fs';
import { generateReportHtml } from '../../../src/features/report-builder/templates/reportHtmlTemplate';
import { loadNorthBattlefordTestData } from '../../../src/features/report-builder/data/northBattlefordTestData';
import type { ReportSection } from '../../../src/features/report-builder/types/reportBuilder.types';

console.log('\n' + '='.repeat(70));
console.log('GENERATING HTML FROM ACTUAL REPORT BUILDER TEMPLATE');
console.log('='.repeat(70) + '\n');

// Load test data into sections structure
console.log('📊 Loading North Battleford test data...');
const sections: ReportSection[] = loadNorthBattlefordTestData();
console.log(`   ✅ Loaded ${sections.length} sections`);

// Count total fields
const totalFields = sections.reduce((sum, section) => {
  let count = section.fields.length;
  if (section.subsections) {
    count += section.subsections.reduce((subSum, subsection) =>
      subSum + subsection.fields.length, 0
    );
  }
  return sum + count;
}, 0);
console.log(`   ✅ Total fields: ${totalFields}`);

// Generate HTML using actual template
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
