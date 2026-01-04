import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read template file
const templatePath = path.join(__dirname, '../public/Report-MF-template.html');
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Read registry to get field labels
const registryPath = path.join(__dirname, '../src/features/report-builder/schema/fieldRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extract field labels from registry
const fieldLabels = new Map<string, string>();
const fieldMatches = registryContent.matchAll(/storeId:\s*['"]([^'"]+)['"].*?label:\s*['"]([^'"]+)['"]/gs);
for (const match of fieldMatches) {
  fieldLabels.set(match[1], match[2]);
}

// Extract all {{field-id}} placeholders
const fieldIdPattern = /\{\{([^}]+)\}\}/g;
const fieldIds = new Set<string>();
const fieldMatches2 = templateContent.matchAll(fieldIdPattern);
for (const match of fieldMatches2) {
  fieldIds.add(match[1].trim());
}

// Extract data-sample attributes and match with field IDs
// Pattern: data-sample="..." title="{{field-id}}"
const sampleDataMap = new Map<string, string>();
const samplePattern = /data-sample=["']([^"']+)["'][^>]*title=["']\{\{([^}]+)\}\}["']/g;
const sampleMatches = templateContent.matchAll(samplePattern);
for (const match of sampleMatches) {
  const sampleData = match[1];
  const fieldId = match[2].trim();
  sampleDataMap.set(fieldId, sampleData);
}

// Also try reverse pattern: title="{{field-id}}" ... data-sample="..."
const samplePattern2 = /title=["']\{\{([^}]+)\}\}["'][^>]*data-sample=["']([^"']+)["']/g;
const sampleMatches2 = templateContent.matchAll(samplePattern2);
for (const match of sampleMatches2) {
  const fieldId = match[1].trim();
  const sampleData = match[2];
  if (!sampleDataMap.has(fieldId)) {
    sampleDataMap.set(fieldId, sampleData);
  }
}

// Organize by page using data-page-num attribute
const sections: Record<string, string[]> = {};
let currentPage = 'Unknown';

// Split template into lines to detect pages
const lines = templateContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect page markers: data-page-num="Page X"
  const pageMatch = line.match(/data-page-num=["']Page\s+(-?\d+)["']/i);
  if (pageMatch) {
    currentPage = `Page ${pageMatch[1]}`;
    if (!sections[currentPage]) {
      sections[currentPage] = [];
    }
  }
  
  // Extract field IDs from this line
  const lineFieldMatches = line.matchAll(fieldIdPattern);
  for (const match of lineFieldMatches) {
    const fieldId = match[1].trim();
    if (!sections[currentPage]) {
      sections[currentPage] = [];
    }
    if (!sections[currentPage].includes(fieldId)) {
      sections[currentPage].push(fieldId);
    }
  }
}

// Generate markdown table
let output = '# Template Field IDs Extraction\n\n';
output += `**Total Unique Field IDs in Template:** ${fieldIds.size}\n\n`;

output += '## Field IDs by Section/Page\n\n';
output += '| Section/Page | Field ID | Field Label | Toggle Mock Data |\n';
output += '|--------------|----------|-------------|------------------|\n';

// Sort sections
const sortedSections = Object.keys(sections).sort((a, b) => {
  // Sort pages numerically
  const pageA = a.match(/Page\s+(-?\d+)/);
  const pageB = b.match(/Page\s+(-?\d+)/);
  if (pageA && pageB) {
    return parseInt(pageA[1]) - parseInt(pageB[1]);
  }
  return a.localeCompare(b);
});

for (const section of sortedSections) {
  const fieldIdsInSection = sections[section].sort();
  
  for (const fieldId of fieldIdsInSection) {
    const label = fieldLabels.get(fieldId) || '*(no label)*';
    const mockData = sampleDataMap.get(fieldId) || '';
    const mockDataDisplay = mockData ? `"${mockData}"` : '';
    
    output += `| ${section} | ${fieldId} | ${label} | ${mockDataDisplay} |\n`;
  }
}

// Summary table
output += '\n## Summary\n\n';
output += '| Metric | Count |\n';
output += '|--------|-------|\n';
output += `| Total Field IDs in Template | ${fieldIds.size} |\n`;
output += `| Fields with Mock Data | ${sampleDataMap.size} |\n`;
output += `| Fields without Mock Data | ${fieldIds.size - sampleDataMap.size} |\n`;
output += `| Sections/Pages | ${sortedSections.length} |\n`;

// Write to file
const outputPath = path.join(__dirname, '../docs/15-Contract-review/0-APR-Domain-Core-Mgt/TEMPLATE-FIELD-IDS.md');
fs.writeFileSync(outputPath, output);
console.log(`\n✅ Template field IDs extracted: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`   - Total field IDs: ${fieldIds.size}`);
console.log(`   - Fields with mock data: ${sampleDataMap.size}`);
console.log(`   - Sections/Pages: ${sortedSections.length}`);

