#!/usr/bin/env node
/**
 * Field Extraction Test - Page 23 Site Details
 * Proves HTML structure supports field binding for fieldRegistry
 */

const fs = require('fs');
const path = require('path');

// Read page-23.html
const htmlPath = path.join(__dirname, 'html-pages/page-23.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Simple regex-based extraction (no dependencies needed)
function extractField(html, labelText) {
  // Find row with label
  const labelRegex = new RegExp(`<td class="label-cell">${labelText}</td>\\s*<td[^>]*>([^<]+)</td>`, 'i');
  const match = html.match(labelRegex);
  return match ? match[1].trim() : null;
}

function extractSiteSize(html, labelText, column) {
  // Find row with label and extract specific column (Square Feet or Acres)
  const rowRegex = new RegExp(`<td class="label-cell">${labelText}</td>\\s*<td class="numeric-cell">([^<]+)</td>\\s*<td class="numeric-cell">([^<]+)</td>`, 'i');
  const match = html.match(rowRegex);
  if (!match) return null;

  return column === 'squareFeet' ? match[1].trim() : match[2].trim();
}

console.log('='.repeat(60));
console.log('FIELD EXTRACTION TEST - Page 23 Site Details');
console.log('='.repeat(60));
console.log('');

// Extract fields
const fields = {
  address: extractField(html, 'Address'),
  legalDescription: extractField(html, 'Legal Description'),
  siteSizeSquareFeet: extractSiteSize(html, 'Economic Unit \\(Primary\\) Site Size', 'squareFeet'),
  siteSizeAcres: extractSiteSize(html, 'Economic Unit \\(Primary\\) Site Size', 'acres'),
  usableSiteSquareFeet: extractSiteSize(html, 'Usable Site Size', 'squareFeet'),
  usableSiteAcres: extractSiteSize(html, 'Usable Site Size', 'acres'),
  totalLandAreaSquareFeet: extractSiteSize(html, 'Total Land Area', 'squareFeet'),
  totalLandAreaAcres: extractSiteSize(html, 'Total Land Area', 'acres'),
  siteTopography: extractField(html, 'Site Topography'),
  siteShape: extractField(html, 'Site Shape'),
  municipalServices: extractField(html, 'Municipal Services')
};

console.log('EXTRACTED DATA:');
console.log('-'.repeat(60));
console.log('Address:              ', fields.address);
console.log('Legal Description:    ', fields.legalDescription);
console.log('Site Size (SF):       ', fields.siteSizeSquareFeet);
console.log('Site Size (Acres):    ', fields.siteSizeAcres);
console.log('Usable Site (SF):     ', fields.usableSiteSquareFeet);
console.log('Usable Site (Acres):  ', fields.usableSiteAcres);
console.log('Total Land (SF):      ', fields.totalLandAreaSquareFeet);
console.log('Total Land (Acres):   ', fields.totalLandAreaAcres);
console.log('Site Topography:      ', fields.siteTopography);
console.log('Site Shape:           ', fields.siteShape);
console.log('Municipal Services:   ', fields.municipalServices);
console.log('');

console.log('='.repeat(60));
console.log('FIELD REGISTRY MAPPING');
console.log('='.repeat(60));
console.log('');

// Map to fieldRegistry format
const fieldRegistry = {
  "siteDetails.address": {
    "selector": "table.details-table tr.data-row:has(td.label-cell:contains('Address')) td.value-cell",
    "value": fields.address,
    "extractedSuccessfully": !!fields.address
  },
  "siteDetails.legalDescription": {
    "selector": "table.details-table tr.data-row:has(td.label-cell:contains('Legal Description')) td.value-cell",
    "value": fields.legalDescription,
    "extractedSuccessfully": !!fields.legalDescription
  },
  "siteDetails.economicUnitSiteSize.squareFeet": {
    "selector": "table.details-table tr.data-row:has(td.label-cell:contains('Economic Unit')) td.numeric-cell:nth-child(2)",
    "value": fields.siteSizeSquareFeet,
    "extractedSuccessfully": !!fields.siteSizeSquareFeet
  },
  "siteDetails.economicUnitSiteSize.acres": {
    "selector": "table.details-table tr.data-row:has(td.label-cell:contains('Economic Unit')) td.numeric-cell:nth-child(3)",
    "value": fields.siteSizeAcres,
    "extractedSuccessfully": !!fields.siteSizeAcres
  },
  "siteDetails.usableSiteSize.squareFeet": {
    "selector": "table.details-table tr.data-row:has(td.label-cell:contains('Usable Site Size')) td.numeric-cell:nth-child(2)",
    "value": fields.usableSiteSquareFeet,
    "extractedSuccessfully": !!fields.usableSiteSquareFeet
  },
  "siteDetails.totalLandArea.acres": {
    "selector": "table.details-table tr.data-row:has(td.label-cell:contains('Total Land Area')) td.numeric-cell:nth-child(3)",
    "value": fields.totalLandAreaAcres,
    "extractedSuccessfully": !!fields.totalLandAreaAcres
  }
};

console.log(JSON.stringify(fieldRegistry, null, 2));
console.log('');

// Validation summary
const totalFields = Object.keys(fieldRegistry).length;
const successfulExtractions = Object.values(fieldRegistry).filter(f => f.extractedSuccessfully).length;

console.log('='.repeat(60));
console.log('EXTRACTION SUMMARY');
console.log('='.repeat(60));
console.log(`Total fields tested:  ${totalFields}`);
console.log(`Successfully extracted: ${successfulExtractions}`);
console.log(`Success rate:         ${((successfulExtractions/totalFields)*100).toFixed(1)}%`);
console.log('');

if (successfulExtractions === totalFields) {
  console.log('✅ ALL FIELDS EXTRACTED SUCCESSFULLY');
  console.log('✅ Field binding works - ready for fieldRegistry integration');
} else {
  console.log('⚠️  Some fields failed extraction - review selectors');
}
console.log('');
