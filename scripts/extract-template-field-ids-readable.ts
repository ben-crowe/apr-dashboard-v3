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
const sampleDataMap = new Map<string, string>();
const samplePattern = /data-sample=["']([^"']+)["'][^>]*title=["']\{\{([^}]+)\}\}["']/g;
const sampleMatches = templateContent.matchAll(samplePattern);
for (const match of sampleMatches) {
  const sampleData = match[1];
  const fieldId = match[2].trim();
  sampleDataMap.set(fieldId, sampleData);
}

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

const lines = templateContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const pageMatch = line.match(/data-page-num=["']Page\s+(-?\d+)["']/i);
  if (pageMatch) {
    currentPage = `Page ${pageMatch[1]}`;
    if (!sections[currentPage]) {
      sections[currentPage] = [];
    }
  }
  
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

// Generate readable format
let output = '# Template Field IDs - Readable Format\n\n';
output += `**Total Unique Field IDs:** ${fieldIds.size}\n`;
output += `**Fields with Mock Data:** ${sampleDataMap.size}\n`;
output += `**Pages:** ${Object.keys(sections).length}\n\n`;

// Sort pages numerically
const sortedSections = Object.keys(sections).sort((a, b) => {
  const pageA = a.match(/Page\s+(-?\d+)/);
  const pageB = b.match(/Page\s+(-?\d+)/);
  if (pageA && pageB) {
    return parseInt(pageA[1]) - parseInt(pageB[1]);
  }
  return a.localeCompare(b);
});

for (const section of sortedSections) {
  const fieldIdsInSection = sections[section].sort();
  
  output += `## ${section}\n\n`;
  output += `**Fields:** ${fieldIdsInSection.length}\n\n`;
  
  for (const fieldId of fieldIdsInSection) {
    const label = fieldLabels.get(fieldId) || '*(no label)*';
    const mockData = sampleDataMap.get(fieldId);
    
    output += `### ${fieldId}\n`;
    output += `- **Label:** ${label}\n`;
    if (mockData) {
      // Truncate very long mock data
      const displayData = mockData.length > 200 
        ? mockData.substring(0, 200) + '...' 
        : mockData;
      output += `- **Toggle Mock Data:** "${displayData}"\n`;
    } else {
      output += `- **Toggle Mock Data:** *(none)*\n`;
    }
    output += '\n';
  }
  
  output += '---\n\n';
}

// Write to file
const outputPath = path.join(__dirname, '../docs/15-Contract-review/0-APR-Domain-Core-Mgt/TEMPLATE-FIELD-IDS-READABLE.md');
fs.writeFileSync(outputPath, output);
console.log(`\n✅ Readable format created: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`   - Total field IDs: ${fieldIds.size}`);
console.log(`   - Fields with mock data: ${sampleDataMap.size}`);
console.log(`   - Pages: ${sortedSections.length}`);

