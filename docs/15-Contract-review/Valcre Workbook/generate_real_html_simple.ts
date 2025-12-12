/**
 * Generate Real HTML from Report Builder Template - Simplified
 *
 * Uses getMockData() to get ReportSection[] structure,
 * then passes to generateReportHtml
 */

import { writeFileSync } from 'fs';
import { generateReportHtml } from '../../../src/features/report-builder/templates/reportHtmlTemplate';

console.log('\n' + '='.repeat(70));
console.log('GENERATING HTML FROM ACTUAL REPORT BUILDER TEMPLATE');
console.log('='.repeat(70) + '\n');

// Import the getMockData function from the store
// We need to create a simple version that returns ReportSection[]
const getMockData = () => {
  // For now, return a minimal structure to test
  // This will be replaced with actual data loading
  return [];
};

// Get sections structure
console.log('📊 Getting report sections structure...');
const sections = getMockData();
console.log(`   ✅ Loaded ${sections.length} sections`);

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
