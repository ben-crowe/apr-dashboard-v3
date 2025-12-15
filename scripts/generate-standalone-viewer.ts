/**
 * Generate Standalone Viewer for All Report Pages
 *
 * This script generates a standalone HTML file that displays all 78 rendered
 * report pages in sequence for visual verification against the reference PDF.
 *
 * Usage: npm run generate-viewer
 * Output: docs/15-Contract-review/standalone-viewer.html
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  renderPage01, renderPage02, renderPage03, renderPage04, renderPage05,
  renderPage06, renderPage07, renderPage08, renderPage09, renderPage11,
  renderPage12, renderPage13, renderPage14, renderPage15, renderPage16,
  renderPage17, renderPage18, renderPage19, renderPage20, renderPage21,
  renderPage22, renderPage23, renderPage24, renderPage25, renderPage26,
  renderPage27, renderPage28, renderPage29, renderPage30, renderPage31,
  renderPage32, renderPage33, renderPage34, renderPage35, renderPage36,
  renderPage37, renderPage38, renderPage39, renderPage40, renderPage41,
  renderPage42, renderPage43, renderPage44, renderPage45, renderPage46,
  renderPage47, renderPage48, renderPage49, renderPage50, renderPage51,
  renderPage52, renderPage53, renderPage54, renderPage55, renderPage56,
  renderPage57, renderPage58, renderPage59, renderPage60, renderPage61,
  renderPage62, renderPage63, renderPage64, renderPage65, renderPage66,
  renderPage67, renderPage68, renderPage69, renderPage70, renderPage71,
  renderPage72, renderPage73, renderPage74, renderPage75, renderPage76,
  renderPage77, renderPage78, renderPage79
} from '../src/features/report-builder/templates/reportPageTemplates.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// MOCK TEST DATA
// ============================================================================

// Minimal mock sections array - pages should render with empty fields if no data
const testSections: any[] = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    shortName: 'EXEC',
    fields: [
      { id: 'property-name', value: 'Sample Property', type: 'text', label: 'Property Name', isEditable: true },
      { id: 'property-address-line1', value: '123 Main Street', type: 'text', label: 'Address Line 1', isEditable: true },
      { id: 'property-address-line2', value: 'City, State 12345', type: 'text', label: 'Address Line 2', isEditable: true },
      { id: 'client-name', value: 'Sample Client LLC', type: 'text', label: 'Client Name', isEditable: true },
      { id: 'appraiser-company', value: 'Valuation Experts', type: 'text', label: 'Appraiser Company', isEditable: true },
      { id: 'valuation-date', value: '2025-12-15', type: 'date', label: 'Valuation Date', isEditable: true },
      { id: 'report-date', value: '2025-12-15', type: 'date', label: 'Report Date', isEditable: true },
      { id: 'file-number', value: 'APR-2025-001', type: 'text', label: 'File Number', isEditable: true }
    ],
    subsections: []
  }
];

const valueScenarioType = 'as-is';

// ============================================================================
// RENDER ALL PAGES
// ============================================================================

console.log('Rendering all 78 report pages...');

// Note: Page 10 is missing from the templates (pages 01-09, then 11-79)
const allPages = [
  renderPage01(testSections, valueScenarioType),
  renderPage02(testSections, valueScenarioType),
  renderPage03(testSections, valueScenarioType),
  renderPage04(testSections, valueScenarioType),
  renderPage05(testSections, valueScenarioType),
  renderPage06(testSections, valueScenarioType),
  renderPage07(testSections, valueScenarioType),
  renderPage08(testSections, valueScenarioType),
  renderPage09(testSections, valueScenarioType),
  // Page 10 is missing
  renderPage11(testSections, valueScenarioType),
  renderPage12(testSections, valueScenarioType),
  renderPage13(testSections, valueScenarioType),
  renderPage14(testSections, valueScenarioType),
  renderPage15(testSections, valueScenarioType),
  renderPage16(testSections, valueScenarioType),
  renderPage17(testSections, valueScenarioType),
  renderPage18(testSections, valueScenarioType),
  renderPage19(testSections, valueScenarioType),
  renderPage20(testSections, valueScenarioType),
  renderPage21(testSections, valueScenarioType),
  renderPage22(testSections, valueScenarioType),
  renderPage23(testSections, valueScenarioType),
  renderPage24(testSections, valueScenarioType),
  renderPage25(testSections, valueScenarioType),
  renderPage26(testSections, valueScenarioType),
  renderPage27(testSections, valueScenarioType),
  renderPage28(testSections, valueScenarioType),
  renderPage29(testSections, valueScenarioType),
  renderPage30(testSections, valueScenarioType),
  renderPage31(testSections, valueScenarioType),
  renderPage32(testSections, valueScenarioType),
  renderPage33(testSections, valueScenarioType),
  renderPage34(testSections, valueScenarioType),
  renderPage35(testSections, valueScenarioType),
  renderPage36(testSections, valueScenarioType),
  renderPage37(testSections, valueScenarioType),
  renderPage38(testSections, valueScenarioType),
  renderPage39(testSections, valueScenarioType),
  renderPage40(testSections, valueScenarioType),
  renderPage41(testSections, valueScenarioType),
  renderPage42(testSections, valueScenarioType),
  renderPage43(testSections, valueScenarioType),
  renderPage44(testSections, valueScenarioType),
  renderPage45(testSections, valueScenarioType),
  renderPage46(testSections, valueScenarioType),
  renderPage47(testSections, valueScenarioType),
  renderPage48(testSections, valueScenarioType),
  renderPage49(testSections, valueScenarioType),
  renderPage50(testSections, valueScenarioType),
  renderPage51(testSections, valueScenarioType),
  renderPage52(testSections, valueScenarioType),
  renderPage53(testSections, valueScenarioType),
  renderPage54(testSections, valueScenarioType),
  renderPage55(testSections, valueScenarioType),
  renderPage56(testSections, valueScenarioType),
  renderPage57(testSections, valueScenarioType),
  renderPage58(testSections, valueScenarioType),
  renderPage59(testSections, valueScenarioType),
  renderPage60(testSections, valueScenarioType),
  renderPage61(testSections, valueScenarioType),
  renderPage62(testSections, valueScenarioType),
  renderPage63(testSections, valueScenarioType),
  renderPage64(testSections, valueScenarioType),
  renderPage65(testSections, valueScenarioType),
  renderPage66(testSections, valueScenarioType),
  renderPage67(testSections, valueScenarioType),
  renderPage68(testSections, valueScenarioType),
  renderPage69(testSections, valueScenarioType),
  renderPage70(testSections, valueScenarioType),
  renderPage71(testSections, valueScenarioType),
  renderPage72(testSections, valueScenarioType),
  renderPage73(testSections, valueScenarioType),
  renderPage74(testSections, valueScenarioType),
  renderPage75(testSections, valueScenarioType),
  renderPage76(testSections, valueScenarioType),
  renderPage77(testSections, valueScenarioType),
  renderPage78(testSections, valueScenarioType),
  renderPage79(testSections, valueScenarioType)
].join('\n');

console.log(`Rendered ${78} pages successfully`);

// ============================================================================
// HTML WRAPPER
// ============================================================================

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APR Report - All 78 Pages Visual Verification</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
    }

    /* Navigation bar for screen viewing */
    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #333;
      color: white;
      padding: 10px 20px;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-bar h1 {
      font-size: 18px;
      font-weight: 600;
    }

    .nav-bar .info {
      font-size: 14px;
    }

    .nav-bar button {
      background: #0066cc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .nav-bar button:hover {
      background: #0052a3;
    }

    /* Container for all pages */
    .pages-container {
      margin-top: 60px;
      padding: 20px;
    }

    /* Individual page styling for screen viewing */
    .page {
      background: white;
      margin: 0 auto 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: relative;
      max-width: 8.5in;
      min-height: 11in;
      page-break-after: always;
      page-break-inside: avoid;
    }

    /* Page number indicator */
    .page-indicator {
      position: absolute;
      top: -30px;
      left: 0;
      background: #0066cc;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Print-specific styles */
    @media print {
      body {
        background: white;
      }

      .nav-bar {
        display: none !important;
      }

      .pages-container {
        margin: 0;
        padding: 0;
      }

      .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
        page-break-inside: avoid;
      }

      .page-indicator {
        display: none;
      }

      @page {
        size: 8.5in 11in;
        margin: 0;
      }
    }

    /* Hide navigation on print */
    @media print {
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="nav-bar no-print">
    <h1>APR Report - Visual Verification</h1>
    <div class="info">78 Pages (01-09, 11-79)</div>
    <button onclick="window.print()">Export to PDF</button>
  </div>

  <div class="pages-container">
${allPages}
  </div>

  <script>
    // Add page indicators for screen viewing
    document.addEventListener('DOMContentLoaded', () => {
      const pages = document.querySelectorAll('.page');
      const pageNumbers = [
        '01', '02', '03', '04', '05', '06', '07', '08', '09',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
        '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
        '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
        '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
        '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
        '71', '72', '73', '74', '75', '76', '77', '78', '79'
      ];

      pages.forEach((page, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'page-indicator no-print';
        indicator.textContent = \`Page \${pageNumbers[index]}\`;
        page.parentElement.insertBefore(indicator, page);
      });

      console.log('Standalone viewer loaded with', pages.length, 'pages');
    });
  </script>
</body>
</html>`;

// ============================================================================
// WRITE OUTPUT FILE
// ============================================================================

const outputDir = path.join(__dirname, '../docs/15-Contract-review');
const outputPath = path.join(outputDir, 'standalone-viewer.html');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Write the HTML file
fs.writeFileSync(outputPath, html, 'utf-8');

console.log('');
console.log('✓ Standalone viewer generated successfully!');
console.log('');
console.log(`Output: ${outputPath}`);
console.log('');
console.log('Next steps:');
console.log('1. Open the file in your browser to view all pages');
console.log('2. Click "Export to PDF" button or use File > Print > Save as PDF');
console.log('3. Compare against the reference PDF');
console.log('');
