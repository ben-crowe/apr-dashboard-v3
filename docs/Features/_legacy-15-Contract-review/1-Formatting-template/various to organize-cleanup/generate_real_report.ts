#!/usr/bin/env npx tsx
/**
 * ACTUAL Report Generation - Uses the Real Template
 * 
 * This script properly imports and executes the actual 364KB reportHtmlTemplate.ts
 * NOT a hardcoded stub like the previous broken script.
 * 
 * Usage: npx tsx generate_real_report.ts
 * 
 * Prerequisites:
 *   npm install -D tsx   (if not already installed)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '../../..');

// Import the REAL template and test data
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('REAL REPORT GENERATION - Using Actual 364KB Template');
  console.log('='.repeat(70) + '\n');

  // Dynamically import the actual template
  console.log('📦 Loading actual reportHtmlTemplate.ts...');
  const templateModule = await import(
    path.join(REPO_ROOT, 'src/features/report-builder/templates/reportHtmlTemplate.ts')
  );
  const { generateReportHtml } = templateModule;
  console.log('   ✅ Template loaded');

  // Load actual test data
  console.log('\n📊 Loading North Battleford test data...');
  const testDataModule = await import(
    path.join(REPO_ROOT, 'src/features/report-builder/data/northBattlefordTestData.ts')
  );
  const testData = testDataModule.northBattlefordTestData;
  console.log(`   ✅ Test data loaded (${Object.keys(testData).length} fields)`);

  // Also load REAL data for comparison
  console.log('\n📊 Loading REAL data for accuracy comparison...');
  const realDataModule = await import(
    path.join(REPO_ROOT, 'src/features/report-builder/data/northBattlefordTestData-REAL.ts')
  );
  const realData = realDataModule.northBattlefordRealData;
  console.log(`   ✅ Real data loaded (${Object.keys(realData).length} fields)`);

  // Build sections structure (similar to how the store does it)
  console.log('\n🔨 Building sections from field registry...');
  
  // Import field registry
  const registryModule = await import(
    path.join(REPO_ROOT, 'src/features/report-builder/schema/fieldRegistry.ts')
  );
  const { fieldRegistry, getSectionConfig } = registryModule;

  // Create sections with fields populated from test data
  const sectionIds = ['cover', 'home', 'exec', 'assignment', 'location', 'site', 'impv', 
                      'zone', 'tax', 'hbu', 'market', 'income', 'rental-survey', 'calc',
                      'sales', 'recon', 'photos', 'maps', 'certification'];
  
  const sections = sectionIds.map(sectionId => {
    const config = getSectionConfig(sectionId);
    const sectionFields = fieldRegistry.filter(f => f.section === sectionId);
    
    return {
      id: sectionId,
      name: config?.name || sectionId.toUpperCase(),
      enabled: true,
      fields: sectionFields.map(fieldDef => ({
        id: fieldDef.id,
        value: testData[fieldDef.id] ?? realData[fieldDef.id] ?? fieldDef.defaultValue ?? '',
        type: fieldDef.type,
        label: fieldDef.label,
        category: fieldDef.category
      })),
      subsections: config?.subsections || []
    };
  });

  console.log(`   ✅ Built ${sections.length} sections`);

  // Generate HTML using the ACTUAL template
  console.log('\n🚀 Generating HTML with real template...');
  const html = generateReportHtml(sections);
  console.log(`   ✅ Generated HTML: ${(html.length / 1024).toFixed(1)} KB`);

  // Write output
  const outputPath = path.join(__dirname, 'generated-report-REAL.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`   ✅ Saved to: ${path.basename(outputPath)}`);

  // Quick stats
  console.log('\n📈 HTML Statistics:');
  console.log(`   - Total size: ${(html.length / 1024).toFixed(1)} KB`);
  console.log(`   - Lines: ${html.split('\n').length}`);
  console.log(`   - Sections rendered: ${(html.match(/id="section-/g) || []).length}`);
  console.log(`   - Tables: ${(html.match(/<table/g) || []).length}`);
  console.log(`   - Images: ${(html.match(/<img/g) || []).length}`);

  console.log('\n✅ Done! Now run compare_reports.py against generated-report-REAL.html\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
