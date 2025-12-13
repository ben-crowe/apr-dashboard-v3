/**
 * Report Page Templates - Individual page render functions
 *
 * This file contains 77 individual page render functions, one for each page
 * in the appraisal report. Each function returns HTML as a string.
 *
 * Generated from: master-field-mapping-consolidated.json
 * Date: 2025-12-12
 */

import { ReportSection } from '../types/reportBuilder.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * A single page from the consolidated JSON structure
 */
export interface PageData {
  page_number: number;
  title: string;
  section: string;
  content_type: string;
  page_type: string;
  fields: PageField[];
}

/**
 * A field within a page
 */
export interface PageField {
  selector: string;
  fieldId: string;
  currentValue: string;
  description: string;
}

/**
 * Function signature for page render functions
 */
export type PageRenderFunction = (
  sections: ReportSection[],
  valueScenarioType: string
) => string;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get field value from any section by field ID
 */
function getFieldValue(sections: ReportSection[], fieldId: string): string {
  for (const section of sections) {
    // Check main fields
    const mainField = section.fields.find(f => f.id === fieldId);
    if (mainField && mainField.value) return String(mainField.value);

    // Check subsection fields
    if (section.subsections) {
      for (const subsection of section.subsections) {
        const subField = subsection.fields.find(f => f.id === fieldId);
        if (subField && subField.value) return String(subField.value);
      }
    }
  }
  return '';
}

/**
 * Get image URL from field value (handles both string URLs and image objects)
 */
function getImageUrl(sections: ReportSection[], fieldId: string): string {
  const value = getFieldValue(sections, fieldId);
  if (!value) return '';

  // If it's already a string URL, return it
  if (typeof value === 'string') return value;

  // If it's an object with url property, extract it
  try {
    const parsed = JSON.parse(value);
    return parsed.url || '';
  } catch {
    return value;
  }
}

// ============================================================================
// PAGE RENDER FUNCTIONS (77 pages)
// ============================================================================

/**
 * Page 1: Cover Page - Appraisal Report
 * Fields: report-title, property-type, property-name, property-address-line1, property-address-line2,
 * client-name, client-address-full, appraiser-company, appraiser-address, valuation-date, report-date, file-number
 */
export function renderPage01(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appraisal Report - Page 1</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 8.5in 11in; margin: 0; }
    body {
      width: 8.5in; height: 11in; font-family: Arial, Helvetica, sans-serif;
      background-color: white; color: #333; position: relative; overflow: hidden;
    }
    .header {
      padding: 24px 32px 0 32px; background-color: white; height: 120px;
      display: flex; align-items: flex-start;
    }
    .logo { font-size: 0; }
    .logo-text {
      font-size: 24px; font-weight: bold; color: #1a4d6d;
      letter-spacing: 6px; line-height: 1.2;
    }
    .logo-subtext {
      font-size: 9px; color: #555; letter-spacing: 2px;
      margin-top: 2px; font-weight: normal;
    }
    .content-wrapper { display: flex; height: calc(11in - 120px); position: relative; }
    .left-section {
      flex: 0 0 45%; padding: 32px; padding-right: 16px;
      display: flex; flex-direction: column; justify-content: flex-start;
    }
    .property-photo {
      width: 100%; height: 200px; background-color: #ddd; border: 1px solid #ccc;
      display: flex; align-items: center; justify-content: center;
      color: #666; font-size: 12px; margin-bottom: 24px;
    }
    .right-section {
      flex: 1; padding: 32px; padding-left: 16px;
      display: flex; flex-direction: column; justify-content: flex-start;
      background-color: white; position: relative; z-index: 1;
    }
    .heading {
      font-size: 32px; font-weight: bold; color: #1a1a1a;
      margin-bottom: 28px; line-height: 1.2;
    }
    .property-type { font-size: 14px; font-weight: bold; color: #1a1a1a; margin-bottom: 6px; }
    .property-address { font-size: 12px; color: #1a1a1a; margin-bottom: 2px; line-height: 1.4; }
    .property-city { font-size: 12px; color: #1a1a1a; margin-bottom: 24px; line-height: 1.4; }
    .diagonal-section {
      position: absolute; bottom: 0; right: 0; width: 100%; height: 520px;
      background: linear-gradient(135deg, #004a6f 0%, #1a5f7f 50%, #1a6b8f 100%);
      clip-path: polygon(0 35%, 100% 0, 100% 100%, 0 100%);
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 60px 32px 32px 32px; z-index: 0;
    }
    .info-section {
      color: white; font-size: 12px; line-height: 1.6;
      margin-bottom: 36px; position: relative; z-index: 2;
    }
    .info-label {
      font-weight: bold; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 8px;
    }
    .info-content { font-size: 12px; line-height: 1.5; }
    .info-content-name { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
    .prepared-for, .prepared-by { text-align: right; margin-bottom: 32px; }
    .prepared-for .info-label, .prepared-by .info-label { text-align: right; }
    .prepared-for .info-content, .prepared-for .info-content-name,
    .prepared-by .info-content, .prepared-by .info-content-name { text-align: right; }
    .footer-info {
      text-align: right; color: white; font-size: 11px;
      line-height: 1.6; position: relative; z-index: 2;
    }
    .date-line { margin-bottom: 2px; }
    .file-number { margin-bottom: 0; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="32" height="32" viewBox="0 0 32 32" style="display: inline-block;">
          <g fill="#1a4d6d">
            <path d="M4 8L12 20L8 20L0 8Z"></path>
            <path d="M20 8L28 20L24 20L16 8Z"></path>
          </g>
        </svg>
        <div>
          <div class="logo-text">VALTA</div>
          <div class="logo-subtext">PROPERTY VALUATIONS</div>
        </div>
      </div>
    </div>
  </div>

  <div class="content-wrapper">
    <div class="left-section">
      <div class="property-photo">
        <!-- Property Photo Placeholder -->
      </div>
    </div>

    <div class="right-section">
      <h1 class="heading">${getFieldValue(sections, 'report-title') || 'Appraisal Report'}</h1>
      <div class="property-type">${getFieldValue(sections, 'property-type')}</div>
      <div class="property-address">${getFieldValue(sections, 'property-name')}</div>
      <div class="property-address">${getFieldValue(sections, 'property-address-line1')}</div>
      <div class="property-city">${getFieldValue(sections, 'property-address-line2')}</div>
    </div>

    <div class="diagonal-section">
      <div class="prepared-for">
        <div class="info-label">PREPARED FOR:</div>
        <div class="info-content-name">${getFieldValue(sections, 'client-name')}</div>
        <div class="info-content">${getFieldValue(sections, 'client-address-full').replace(/\n/g, '<br>')}</div>
      </div>

      <div class="prepared-by">
        <div class="info-label">PREPARED BY:</div>
        <div class="info-content-name">${getFieldValue(sections, 'appraiser-company')}</div>
        <div class="info-content">${getFieldValue(sections, 'appraiser-address').replace(/\n/g, '<br>')}</div>
      </div>

      <div class="footer-info">
        <div class="date-line">Date of Valuation: ${getFieldValue(sections, 'valuation-date')}</div>
        <div class="date-line">Date of Report: ${getFieldValue(sections, 'report-date')}</div>
        <div class="file-number" style="margin-top: 8px;">File No: ${getFieldValue(sections, 'file-number')}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Page 2: Letter of Transmittal
 * Fields: report-date, client-address-full, client-name, appraiser-company, appraiser-address,
 * assignment-purpose-text, scope-of-work, property-description, value-scenario-type, interest-appraised,
 * exposure-time-conclusion, valuation-date, concluded-value, hypothetical-conditions-text, extraordinary-assumptions-text
 */
export function renderPage02(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 02 - Letter of Transmittal
  // Fields to interpolate:
  // - report-date, client-address-full, client-name, appraiser-company, appraiser-address
  // - assignment-purpose-text, scope-of-work, property-description, value-scenario-type
  // - interest-appraised, exposure-time-conclusion, valuation-date, concluded-value
  // - hypothetical-conditions-text, extraordinary-assumptions-text

  return `
    <div class="page page-02">
      <h1>Page 2: Letter of Transmittal</h1>
      <p>TODO: Implement transmittal letter template</p>
    </div>
  `;
}

/**
 * Page 3: Extraordinary Limiting Conditions
 * Fields: section-title, extraordinary-limiting-conditions, appraiser-company,
 * appraiser-signatory-name, appraiser-signatory-title, appraiser-email, appraiser-aic-number
 */
export function renderPage03(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page 4 - Extraordinary Limiting Conditions</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    @page { size: 8.5in 11in; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 8.5in; height: 11in; font-family: Arial, sans-serif;
      font-size: 11px; line-height: 1.4; color: #000; background: #fff;
      padding: 0; margin: 0; display: flex; flex-direction: column;
    }
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 24px 36px 16px 36px; border-bottom: none;
    }
    .logo { width: 150px; flex-shrink: 0; }
    .logo-text {
      font-weight: 600; font-size: 14px; color: #003d7a; letter-spacing: 0.5px;
    }
    .company-info {
      text-align: right; font-size: 10px; line-height: 1.5; color: #000;
    }
    .company-info p { margin: 2px 0; }
    .content {
      flex: 1; padding: 0 36px 40px 36px; overflow-y: auto;
    }
    h1 {
      font-size: 18px; font-weight: bold; color: #003d7a;
      margin: 12px 0 8px 0; letter-spacing: 0.3px;
    }
    .intro-line {
      font-size: 11px; margin-bottom: 12px; color: #000; font-weight: normal;
    }
    p {
      font-size: 11px; line-height: 1.5; margin-bottom: 10px;
      text-align: justify; color: #000;
    }
    .closing-text { margin-top: 16px; font-size: 11px; line-height: 1.5; }
    .closing-line { margin-bottom: 6px; }
    .signature-section { margin-top: 20px; margin-bottom: 8px; }
    .signature {
      width: 60px; height: 30px; border-top: 1px solid #000;
      margin-bottom: 4px; font-style: italic;
    }
    .signature-text { font-size: 11px; line-height: 1.4; margin-top: 2px; }
    .signatory-name { font-weight: bold; margin-bottom: 2px; }
    .signatory-title { margin-bottom: 1px; }
    .signatory-email { margin-bottom: 1px; }
    .signatory-aic { margin-bottom: 0; }
    .footer-bar {
      width: 100%; height: 12px;
      background: linear-gradient(to right, #4a9fd8 0%, #003d7a 100%);
      margin-top: auto; flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="page-header">
    <div class="logo">
      <div class="logo-text">VALTA</div>
      <div style="font-size: 9px; color: #666; margin-top: 2px;">PROPERTY VALUATIONS</div>
    </div>

    <div class="company-info">
      <p><strong>${getFieldValue(sections, 'appraiser-company')}</strong></p>
      <p>#300-6858 Richard Road SW.</p>
      <p>Calgary, AB T3E 6L1</p>
      <p>Office: 587-801-5151</p>
      <p>clientcare@valta.ca</p>
      <p>www.valta.ca</p>
    </div>
  </div>

  <div class="content">
    <h1>${getFieldValue(sections, 'section-title') || 'Extraordinary Limiting Conditions'}</h1>

    <div class="intro-line">${getFieldValue(sections, 'extraordinary-limiting-conditions')}</div>

    <p>The report has been completed in accordance with the Canadian Uniform Standards of Professional Appraisal Practice (CUSAP) adopted January 1, 2024. The full narrative appraisal report that follows sets forth the pertinent data and analyses leading to the conclusions presented herein. The appraisal requirements section of this report sets out the basis of the appraisal, definitions and the valuation methodology and must be read to gain a full understanding of the process.</p>

    <p>If there are any specific questions or concerns regarding the attached appraisal report, or if Valta can be of additional assistance, please contact the individuals listed below.</p>

    <div class="closing-text">
      <div class="closing-line">Respectfully Submitted,</div>
      <div style="font-weight: bold; margin-bottom: 10px;">${getFieldValue(sections, 'appraiser-company').toUpperCase()}</div>

      <div class="signature-section">
        <div class="signature"></div>
        <div class="signature-text">
          <div class="signatory-name">${getFieldValue(sections, 'appraiser-signatory-name')}</div>
          <div class="signatory-title">${getFieldValue(sections, 'appraiser-signatory-title')}</div>
          <div class="signatory-email">${getFieldValue(sections, 'appraiser-email')}</div>
          <div class="signatory-aic">AIC No: ${getFieldValue(sections, 'appraiser-aic-number')}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar"></div>
</body>
</html>
  `;
}

/**
 * Page 4: Table of Contents
 * Fields: section-title, toc-section-1, toc-section-2
 */
export function renderPage04(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Table of Contents - Page 5</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    @page { size: 8.5in 11in; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 8.5in; height: 11in; margin: 0; padding: 0;
      font-family: Arial, sans-serif; background-color: #fff; display: flex;
    }
    .sidebar {
      width: 180px; background-color: #1a3a52; padding: 40px 20px;
      display: flex; align-items: flex-start; justify-content: flex-start;
    }
    .sidebar-title {
      color: #fff; font-size: 28px; font-weight: bold;
      line-height: 1.2; text-align: center; width: 100%;
    }
    .content { flex: 1; padding: 40px 40px; overflow-y: auto; }
    .toc-section { margin-bottom: 28px; }
    .section-title {
      font-size: 13px; font-weight: bold; color: #1a3a52;
      margin-bottom: 12px; text-transform: capitalize;
    }
    .toc-item {
      display: flex; justify-content: space-between; align-items: baseline;
      font-size: 12px; color: #333; margin-bottom: 8px; line-height: 1.4;
    }
    .toc-item-text { flex: 1; padding-right: 10px; }
    .toc-item-page {
      flex-shrink: 0; text-align: right; font-weight: 600; color: #1a3a52;
    }
    .sub-item { margin-left: 0; }
    .sub-item .toc-item-text { font-weight: normal; color: #333; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="sidebar-title">${getFieldValue(sections, 'section-title') || 'Table of<br>Contents'}</div>
  </div>

  <div class="content">
    <div class="toc-section">
      <div class="section-title">Introduction & Executive Summary</div>
      <div class="toc-item">
        <div class="toc-item-text">Property Overview</div>
        <div class="toc-item-page">1</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Photographs</div>
        <div class="toc-item-page">4</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Maps</div>
        <div class="toc-item-page">9</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Identification of Assignment</div>
        <div class="toc-item-page">12</div>
      </div>
    </div>

    <div class="toc-section">
      <div class="section-title">Property Analysis</div>
      <div class="toc-item">
        <div class="toc-item-text">Location</div>
        <div class="toc-item-page">17</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Site Details</div>
        <div class="toc-item-page">18</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Property Taxes & Assessment</div>
        <div class="toc-item-page">23</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Land Use & Planning</div>
        <div class="toc-item-page">24</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Description of the Improvements</div>
        <div class="toc-item-page">26</div>
      </div>
    </div>

    <div class="toc-section">
      <div class="section-title">Market Context</div>
      <div class="toc-item">
        <div class="toc-item-text">Economic Overviews</div>
        <div class="toc-item-page">29</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Multi-Family Market Overview</div>
        <div class="toc-item-page">31</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Highest & Best Use</div>
        <div class="toc-item-page">32</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Valuation Methodology</div>
        <div class="toc-item-page">34</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Income Approach</div>
        <div class="toc-item-page">36</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Direct Comparison Approach: Multifamily</div>
        <div class="toc-item-page">50</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Reconciliation of Value</div>
        <div class="toc-item-page">61</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Certification</div>
        <div class="toc-item-page">63</div>
      </div>
    </div>

    <div class="toc-section">
      <div class="section-title">Appendices</div>
      <div class="toc-item">
        <div class="toc-item-text">Contingent & Limiting Conditions</div>
        <div class="toc-item-page">65</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Definition of Terms</div>
        <div class="toc-item-page">68</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-text">Qualifications of the Appraiser</div>
        <div class="toc-item-page">72</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Page 5: Introduction & Executive Summary (Property Identification)
 * Fields: 43 fields including property-name, property-type, property-address, market-name,
 * legal-description, site-area-sf, zoning-district, tenancy-type, nra-sqft, unit-count, etc.
 */
export function renderPage05(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page 6 - Introduction & Executive Summary</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    @page { size: 8.5in 11in; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 8.5in; height: 11in; margin: 0; padding: 0.5in;
      font-family: Arial, sans-serif; background: white; color: #000;
      font-size: 11px; line-height: 1.4;
    }
    .page-title {
      font-size: 18px; font-weight: bold; margin-bottom: 20px;
      border-bottom: 2px solid #000; padding-bottom: 8px;
    }
    .section-title {
      font-size: 12px; font-weight: bold; color: #003d82;
      margin-top: 20px; margin-bottom: 10px; text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-header {
      background-color: #003d82; color: white; padding: 6px 10px;
      font-weight: bold; font-size: 11px; margin-bottom: 0;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    table {
      width: 100%; border-collapse: collapse; margin-bottom: 15px;
    }
    td {
      padding: 6px 8px; border: 1px solid #ccc; font-size: 11px;
      vertical-align: top;
    }
    td.label {
      font-weight: bold; width: 50%; background-color: #f5f5f5;
    }
    td.value { width: 50%; background-color: white; }
    .footer {
      position: absolute; bottom: 0.5in; width: 7.5in;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 9px; margin-top: 20px; padding-top: 10px;
      border-top: 1px solid #ccc;
    }
    .footer-left { flex: 1; }
    .footer-right {
      width: 100px; height: 40px;
      background: linear-gradient(to right, #e8f0f7 50%, #003d82 50%);
    }
  </style>
</head>
<body>
  <div class="page-title">${getFieldValue(sections, 'section-title') || 'Introduction & Executive Summary'}</div>

  <div class="section-title">${getFieldValue(sections, 'subsection-title') || 'Property Overview'}</div>

  <div class="section-header">PROPERTY IDENTIFICATION</div>
  <table>
    <tr>
      <td class="label">Name</td>
      <td class="value">${getFieldValue(sections, 'property-name')}</td>
    </tr>
    <tr>
      <td class="label">Property</td>
      <td class="value">${getFieldValue(sections, 'property-type')}</td>
    </tr>
    <tr>
      <td class="label">Address</td>
      <td class="value">${getFieldValue(sections, 'property-address-line1')}</td>
    </tr>
    <tr>
      <td class="label">City, Province, Postal Code</td>
      <td class="value">${getFieldValue(sections, 'property-address-line2')}</td>
    </tr>
    <tr>
      <td class="label">Market / Submarket</td>
      <td class="value">${getFieldValue(sections, 'market-name')}</td>
    </tr>
    <tr>
      <td class="label">Geocode</td>
      <td class="value">${getFieldValue(sections, 'geocode')}</td>
    </tr>
  </table>

  <div class="section-header">SITE DESCRIPTION</div>
  <table>
    <tr>
      <td class="label">Legal Description</td>
      <td class="value">${getFieldValue(sections, 'legal-description')}</td>
    </tr>
    <tr>
      <td class="label">Land Area</td>
      <td class="value">Square Feet</td>
    </tr>
    <tr>
      <td class="label">Usable</td>
      <td class="value">${getFieldValue(sections, 'site-area-sf')}</td>
    </tr>
    <tr>
      <td class="label">Total</td>
      <td class="value">${getFieldValue(sections, 'site-area-sf')}</td>
    </tr>
    <tr>
      <td class="label">Zoning</td>
      <td class="value">${getFieldValue(sections, 'zoning-district')}</td>
    </tr>
    <tr>
      <td class="label">Shape</td>
      <td class="value">${getFieldValue(sections, 'site-shape')}</td>
    </tr>
    <tr>
      <td class="label">Topography</td>
      <td class="value">${getFieldValue(sections, 'topography')}</td>
    </tr>
  </table>

  <div class="section-header">IMPROVEMENT DESCRIPTION</div>
  <table>
    <tr>
      <td class="label">Tenancy</td>
      <td class="value">${getFieldValue(sections, 'tenancy-type')}</td>
    </tr>
    <tr>
      <td class="label">Net Rentable Area (NRA)</td>
      <td class="value">${getFieldValue(sections, 'nra-sqft')}</td>
    </tr>
    <tr>
      <td class="label">Gross Building Area (GBA)</td>
      <td class="value">${getFieldValue(sections, 'building-nra-sqft')}</td>
    </tr>
    <tr>
      <td class="label">Units</td>
      <td class="value">${getFieldValue(sections, 'unit-count')}</td>
    </tr>
    <tr>
      <td class="label">Density (Units/Acre)</td>
      <td class="value">${getFieldValue(sections, 'density-units-per-acre')}</td>
    </tr>
    <tr>
      <td class="label">Total Buildings</td>
      <td class="value">${getFieldValue(sections, 'building-count')}</td>
    </tr>
    <tr>
      <td class="label">Stories</td>
      <td class="value">${getFieldValue(sections, 'story-count')}</td>
    </tr>
    <tr>
      <td class="label">Year Built</td>
      <td class="value">${getFieldValue(sections, 'year-built')}</td>
    </tr>
    <tr>
      <td class="label">Actual Age</td>
      <td class="value">${getFieldValue(sections, 'actual-age')}</td>
    </tr>
    <tr>
      <td class="label">Effective Age</td>
      <td class="value">${getFieldValue(sections, 'effective-age')}</td>
    </tr>
    <tr>
      <td class="label">Economic Life</td>
      <td class="value">${getFieldValue(sections, 'economic-life')}</td>
    </tr>
    <tr>
      <td class="label">Remaining Useful Life</td>
      <td class="value">${getFieldValue(sections, 'remaining-useful-life')}</td>
    </tr>
    <tr>
      <td class="label">Parking</td>
      <td class="value">${getFieldValue(sections, 'parking-ratio')}</td>
    </tr>
    <tr>
      <td class="label">Project Amenities</td>
      <td class="value">${getFieldValue(sections, 'project-amenities')}</td>
    </tr>
    <tr>
      <td class="label">Laundry</td>
      <td class="value">${getFieldValue(sections, 'laundry')}</td>
    </tr>
    <tr>
      <td class="label">Security Features</td>
      <td class="value">${getFieldValue(sections, 'security-features')}</td>
    </tr>
  </table>

  <div class="section-header">QUALITATIVE ANALYSIS</div>
  <table>
    <tr>
      <td class="label">Site Quality</td>
      <td class="value">${getFieldValue(sections, 'site-quality-rating')}</td>
    </tr>
    <tr>
      <td class="label">Site Access</td>
      <td class="value">${getFieldValue(sections, 'site-access-rating')}</td>
    </tr>
    <tr>
      <td class="label">Site Exposure</td>
      <td class="value">${getFieldValue(sections, 'site-exposure-rating')}</td>
    </tr>
    <tr>
      <td class="label">Site Utility</td>
      <td class="value">${getFieldValue(sections, 'site-utility-rating')}</td>
    </tr>
    <tr>
      <td class="label">Building Quality</td>
      <td class="value">${getFieldValue(sections, 'building-quality-rating')}</td>
    </tr>
    <tr>
      <td class="label">Building Condition</td>
      <td class="value">${getFieldValue(sections, 'building-condition-rating')}</td>
    </tr>
    <tr>
      <td class="label">Building Appeal</td>
      <td class="value">${getFieldValue(sections, 'building-appeal-rating')}</td>
    </tr>
  </table>

  <div class="footer">
    <div class="footer-left">
      1   ${getFieldValue(sections, 'property-address-line1')}. ${getFieldValue(sections, 'property-address-line2')} | File ${getFieldValue(sections, 'file-number')}
    </div>
    <div class="footer-right"></div>
  </div>
</body>
</html>
  `;
}

/**
 * Page 6: Introduction & Executive Summary (HBU, Exposure Time, Investment Indicators, Value Conclusion)
 * Fields: 28 fields including hbu-proposed-construction, hbu-vacant-use, hbu-improved-use,
 * exposure-time-conclusion, current-occupancy-percent, capitalization-rate, concluded-value, etc.
 */
export function renderPage06(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page 7 - Introduction & Executive Summary</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 8.5in 11in; margin: 0; }
    body {
      width: 8.5in; height: 11in; margin: 0; padding: 0;
      font-family: Arial, sans-serif; font-size: 11px; color: #000;
      background: #fff; line-height: 1.3;
    }
    .page-container {
      width: 100%; height: 100%; display: flex; flex-direction: column;
      padding: 36px 36px 36px 36px;
    }
    .content-area { flex: 1; }
    .page-title {
      font-size: 16px; font-weight: bold; margin-bottom: 20px; color: #000;
      border-bottom: 2px solid #003d66; padding-bottom: 8px;
    }
    .section-title {
      background-color: #003d66; color: white; padding: 8px 12px;
      font-weight: bold; font-size: 12px; margin-top: 16px;
      margin-bottom: 0; letter-spacing: 0.5px;
    }
    table {
      width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px;
    }
    table.hbu-table { margin-top: 0; }
    table.hbu-table th, table.hbu-table td {
      padding: 6px 8px; text-align: left; border-bottom: 1px solid #d0d0d0;
    }
    table.hbu-table th { background-color: #f5f5f5; font-weight: bold; }
    table.hbu-table tr:nth-child(even) { background-color: #fafafa; }
    table.investment-table tr, table.investment-table td, table.investment-table th {
      padding: 5px 8px; text-align: left; border-bottom: 1px solid #d0d0d0;
    }
    table.investment-table tr:nth-child(even) { background-color: #fafafa; }
    table.investment-table th { background-color: #f5f5f5; font-weight: bold; }
    table.value-conclusion { margin-top: 0; }
    table.value-conclusion tr, table.value-conclusion td {
      padding: 5px 8px; border-bottom: 1px solid #d0d0d0;
    }
    table.value-conclusion tr:nth-child(even) { background-color: #fafafa; }
    table.value-conclusion .label-cell { font-weight: normal; width: 60%; }
    table.value-conclusion .value-cell {
      text-align: right; width: 40%; padding-right: 16px;
    }
    .final-value-row {
      background-color: #003d66; color: white; font-weight: bold;
    }
    .final-value-row .label-cell, .final-value-row .value-cell { color: white; }
    .col1-narrow { width: 50%; }
    .col2-narrow { width: 50%; }
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 24px; padding-top: 12px; border-top: 1px solid #e0e0e0;
      font-size: 9px; color: #666;
    }
    .footer-left { display: flex; gap: 6px; }
    .footer-right { width: 80px; height: 40px; }
    .logo-placeholder {
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #e8f0f7 0%, #d0dce8 100%);
      display: flex; align-items: center; justify-content: center;
      border: 1px solid #bbb; font-size: 8px; color: #666;
    }
    .spacer { height: 48px; }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="content-area">
      <div class="page-title">${getFieldValue(sections, 'section-title') || 'Introduction & Executive Summary'}</div>

      <div class="section-title">HIGHEST & BEST USE</div>
      <table class="hbu-table">
        <tr>
          <td class="col1-narrow">Proposed Construction</td>
          <td class="col2-narrow">${getFieldValue(sections, 'hbu-proposed-construction')}</td>
        </tr>
        <tr>
          <td>As Though Vacant</td>
          <td>${getFieldValue(sections, 'hbu-vacant-use')}</td>
        </tr>
        <tr>
          <td>As Improved</td>
          <td>${getFieldValue(sections, 'hbu-improved-use')}</td>
        </tr>
      </table>

      <div class="section-title">EXPOSURE & MARKETING TIME</div>
      <table class="hbu-table">
        <tr>
          <td class="col1-narrow">Exposure Time</td>
          <td class="col2-narrow">${getFieldValue(sections, 'exposure-time-conclusion')}</td>
        </tr>
        <tr>
          <td>Marketing Time</td>
          <td>${getFieldValue(sections, 'marketing-time')}</td>
        </tr>
      </table>

      <div class="section-title">INVESTMENT INDICATORS</div>
      <table class="investment-table">
        <tr>
          <td class="col1-narrow">Current Occupancy</td>
          <td class="col2-narrow">${getFieldValue(sections, 'current-occupancy-percent')}</td>
        </tr>
        <tr>
          <td>Stabilized Occupancy, Stabilized Vacancy & Credit Loss</td>
          <td>${getFieldValue(sections, 'stabilized-occupancy-percent')}</td>
        </tr>
        <tr>
          <td>SF Multifamily</td>
          <td>${getFieldValue(sections, 'multifamily-sf')}</td>
        </tr>
        <tr>
          <td>Occupied MF Units / Vacant MF Units</td>
          <td>${getFieldValue(sections, 'units-occupied-vacant')}</td>
        </tr>
        <tr>
          <td>Current Rent/MF Units / Concluded Rent/MF Units</td>
          <td>${getFieldValue(sections, 'current-rent-per-unit')}</td>
        </tr>
        <tr>
          <td></td>
          <td>${getFieldValue(sections, 'concluded-rent-per-unit')}</td>
        </tr>
        <tr>
          <td>Expense Ratio (Expenses/EGI)</td>
          <td>${getFieldValue(sections, 'expense-ratio')}</td>
        </tr>
        <tr>
          <td>Debt Service Coverage Ratio</td>
          <td>${getFieldValue(sections, 'dscr-or-noi-per-unit')}</td>
        </tr>
        <tr>
          <td>Capitalization Rate (OAR) Conclusion</td>
          <td>${getFieldValue(sections, 'capitalization-rate')}</td>
        </tr>
      </table>

      <div class="section-title">VALUE CONCLUSION</div>
      <table class="value-conclusion" style="margin-bottom: 8px;">
        <tr>
          <td class="label-cell">VALUATION SCENARIOS</td>
          <td class="value-cell">${getFieldValue(sections, 'value-scenario-type')}</td>
        </tr>
        <tr>
          <td class="label-cell">Interest</td>
          <td class="value-cell">${getFieldValue(sections, 'interest-appraised')}</td>
        </tr>
        <tr>
          <td class="label-cell">Exposure Time</td>
          <td class="value-cell">${getFieldValue(sections, 'exposure-time-value-table')}</td>
        </tr>
        <tr>
          <td class="label-cell">Effective Date</td>
          <td class="value-cell">${getFieldValue(sections, 'valuation-date')}</td>
        </tr>
        <tr>
          <td class="label-cell">Cost Approach</td>
          <td class="value-cell">${getFieldValue(sections, 'cost-approach-status')}</td>
        </tr>
        <tr>
          <td class="label-cell">Direct Comparison Approach</td>
          <td class="value-cell">${getFieldValue(sections, 'direct-comparison-value')}</td>
        </tr>
        <tr>
          <td class="label-cell">Income Approach</td>
          <td class="value-cell">${getFieldValue(sections, 'income-approach-value')}</td>
        </tr>
        <tr class="final-value-row">
          <td class="label-cell">FINAL VALUE CONCLUSION</td>
          <td class="value-cell">${getFieldValue(sections, 'concluded-value')}</td>
        </tr>
      </table>

      <div class="spacer"></div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <span>2</span>
        <span>${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-address-line2')} | File ${getFieldValue(sections, 'file-number')}</span>
      </div>
      <div class="footer-right">
        <div class="logo-placeholder">[LOGO]</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Page 7: Introduction & Executive Summary (Hypothetical Conditions and Assumptions)
 * Fields: section-title, subsection-title, hypothetical-conditions-text, extraordinary-assumptions-text,
 * extraordinary-limiting-conditions, page-footer
 */
export function renderPage07(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Valuation Report - Page 8</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    @page { size: 8.5in 11in; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 8.5in; height: 11in; margin: 0; padding: 0;
      font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5;
      color: #000; background: #fff; position: relative;
    }
    body::before {
      content: ''; position: absolute; top: 0; right: 0; width: 40px;
      height: 1056px;
      background: linear-gradient(to right, #1a5a96 0%, #2a7bb7 50%, #3a9ad9 100%);
      z-index: -1;
    }
    .page-container {
      width: 100%; height: 100%; display: flex; flex-direction: column;
      padding: 0.75in 0.75in 0.5in 0.75in;
    }
    .header {
      border-bottom: 2px solid #003d7a; padding-bottom: 8px; margin-bottom: 20px;
    }
    .header h1 { font-size: 16px; font-weight: bold; color: #000; }
    .content { flex: 1; overflow: hidden; }
    .section { margin-bottom: 18px; }
    .section-title {
      font-size: 12px; font-weight: bold; color: #0047ab; margin-bottom: 8px;
    }
    .section-content {
      font-size: 11px; line-height: 1.6; color: #000; text-align: justify;
      margin-bottom: 12px;
    }
    .footer {
      display: flex; justify-content: space-between; align-items: flex-end;
      border-top: 1px solid #ccc; padding-top: 6px; font-size: 9px;
      color: #666; margin-top: auto; position: absolute; bottom: 0.3in;
      left: 0.75in; right: 1in; width: calc(100% - 1.75in);
    }
    .footer-left { display: flex; gap: 20px; align-items: center; }
    .footer-text { font-size: 9px; color: #333; }
    .page-number { font-size: 9px; color: #333; }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header">
      <h1>${getFieldValue(sections, 'section-title') || 'Introduction & Executive Summary'}</h1>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Hypothetical Conditions</div>
        <div class="section-content">${getFieldValue(sections, 'hypothetical-conditions-text')}</div>
      </div>

      <div class="section">
        <div class="section-title">Extraordinary Assumptions</div>
        <div class="section-content">${getFieldValue(sections, 'extraordinary-assumptions-text')}</div>
      </div>

      <div class="section">
        <div class="section-title">Extraordinary Limiting Conditions</div>
        <div class="section-content">${getFieldValue(sections, 'extraordinary-limiting-conditions')}</div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <span class="footer-text">3</span>
        <span class="footer-text">${getFieldValue(sections, 'property-address-line1')}. ${getFieldValue(sections, 'property-address-line2')} | File ${getFieldValue(sections, 'file-number')}</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Page 8: Photographs (Page 1 of 2)
 * Fields: section-title, subsection-title, photo-1-caption through photo-6-caption, page-footer
 */
export function renderPage08(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page 9 - Photographs</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 8.5in 11in; margin: 0; }
    body {
      width: 8.5in; height: 11in; margin: 0; padding: 0.5in 0.5in;
      font-family: Arial, sans-serif; background: white; font-size: 11px;
      line-height: 1.4;
    }
    .page-header {
      margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #003d7a;
    }
    .page-header h1 {
      font-size: 16px; font-weight: bold; color: #000; margin-bottom: 5px;
    }
    .section-title {
      font-size: 12px; font-weight: bold; color: #003d7a;
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;
    }
    .photos-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
      margin-bottom: 40px;
    }
    .photo-item { text-align: center; }
    .photo-placeholder {
      width: 100%; height: auto; background: #cccccc;
      display: flex; align-items: center; justify-content: center;
      color: #666; font-size: 11px; border: 1px dashed #999;
      margin-bottom: 8px; aspect-ratio: 4 / 3;
    }
    .photo-caption {
      font-size: 11px; color: #000; font-weight: 500; line-height: 1.3;
    }
    .footer-text {
      position: absolute; bottom: 0.5in; left: 0.5in; right: 0.5in;
      font-size: 9px; color: #666; display: flex;
      justify-content: space-between; align-items: center;
      padding-top: 10px; border-top: 1px solid #ddd;
    }
    .page-number { font-size: 9px; color: #666; }
    .footer-logo {
      width: 80px; height: 20px;
      background: linear-gradient(90deg, #003d7a 0%, #0066cc 100%);
      border-radius: 3px;
    }
    .body-content { margin-bottom: 80px; }
  </style>
</head>
<body>
  <div class="page-header">
    <h1>${getFieldValue(sections, 'section-title') || 'Introduction & Executive Summary'}</h1>
  </div>

  <div class="body-content">
    <div class="section-title">${getFieldValue(sections, 'subsection-title') || 'Photographs'}</div>

    <div class="photos-grid">
      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 1]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-1-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 2]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-2-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 3]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-3-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 4]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-4-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 5]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-5-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 6]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-6-caption')}</div>
      </div>
    </div>
  </div>

  <div class="footer-text">
    <div class="page-number">4    ${getFieldValue(sections, 'property-address-line1')}. ${getFieldValue(sections, 'property-address-line2')} | File ${getFieldValue(sections, 'file-number')}</div>
    <div class="footer-logo"></div>
  </div>
</body>
</html>
  `;
}

/**
 * Page 9: Photographs (Page 2 of 2)
 * Fields: section-title, photo-7-caption through photo-12-caption, page-footer
 */
export function renderPage09(sections: ReportSection[], valueScenarioType: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page 9 - Photographs (Page 2)</title>
  <link rel="stylesheet" href="master-appraisal-styles.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 8.5in 11in; margin: 0; }
    body {
      width: 8.5in; height: 11in; margin: 0; padding: 0.5in 0.5in;
      font-family: Arial, sans-serif; background: white; font-size: 11px;
      line-height: 1.4;
    }
    .page-header {
      margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #003d7a;
    }
    .page-header h1 {
      font-size: 16px; font-weight: bold; color: #000; margin-bottom: 5px;
    }
    .section-title {
      font-size: 12px; font-weight: bold; color: #003d7a;
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;
    }
    .photos-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
      margin-bottom: 40px;
    }
    .photo-item { text-align: center; }
    .photo-placeholder {
      width: 100%; height: auto; background: #cccccc;
      display: flex; align-items: center; justify-content: center;
      color: #666; font-size: 11px; border: 1px dashed #999;
      margin-bottom: 8px; aspect-ratio: 4 / 3;
    }
    .photo-caption {
      font-size: 11px; color: #000; font-weight: 500; line-height: 1.3;
    }
    .footer-text {
      position: absolute; bottom: 0.5in; left: 0.5in; right: 0.5in;
      font-size: 9px; color: #666; display: flex;
      justify-content: space-between; align-items: center;
      padding-top: 10px; border-top: 1px solid #ddd;
    }
    .page-number { font-size: 9px; color: #666; }
    .footer-logo {
      width: 80px; height: 20px;
      background: linear-gradient(90deg, #003d7a 0%, #0066cc 100%);
      border-radius: 3px;
    }
    .body-content { margin-bottom: 80px; }
  </style>
</head>
<body>
  <div class="page-header">
    <h1>${getFieldValue(sections, 'section-title') || 'Introduction & Executive Summary'}</h1>
  </div>

  <div class="body-content">
    <div class="section-title">Photographs</div>

    <div class="photos-grid">
      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 7]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-7-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 8]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-8-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 9]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-9-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 10]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-10-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 11]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-11-caption')}</div>
      </div>

      <div class="photo-item">
        <div class="photo-placeholder">[PHOTO: Photo 12]</div>
        <div class="photo-caption">${getFieldValue(sections, 'photo-12-caption')}</div>
      </div>
    </div>
  </div>

  <div class="footer-text">
    <div class="page-number">5    ${getFieldValue(sections, 'property-address-line1')}. ${getFieldValue(sections, 'property-address-line2')} | File ${getFieldValue(sections, 'file-number')}</div>
    <div class="footer-logo"></div>
  </div>
</body>
</html>
  `;
}

/**
 * Page 11: Introduction & Executive Summary - Photos (Part 1)
 * Fields: intro-photo-1 through intro-photo-6
 */
export function renderPage11(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-11">
      <div class="page-header">Introduction & Executive Summary</div>
      <div class="photos-grid">
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-1') || '[PHOTO: Unit 1101 - Living Room]'}</div>
          <div class="photo-caption">1101 - Living Room</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-2') || '[PHOTO: West Elevation]'}</div>
          <div class="photo-caption">1121 - West Elevation</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-3') || '[PHOTO: East Elevation]'}</div>
          <div class="photo-caption">1121 - East Elevation</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-4') || '[PHOTO: Typical Hallway]'}</div>
          <div class="photo-caption">1121 - Typical Hallway</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-5') || '[PHOTO: Typical Stairway]'}</div>
          <div class="photo-caption">1121 - Typical Stairway</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-6') || '[PHOTO: Typical Living Room]'}</div>
          <div class="photo-caption">1121 - Typical Living Room</div>
        </div>
      </div>
      <div class="page-footer">
        <span>6</span>
        <span>\${getFieldValue(sections, 'property-address-line1')}, \${getFieldValue(sections, 'property-address-line2')} | File \${getFieldValue(sections, 'file-number')}</span>
      </div>
    </div>
  `;
}

/**
 * Page 12: Introduction & Executive Summary - Photos (Part 2)
 * Fields: intro-photo-7 through intro-photo-12
 */
export function renderPage12(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-12">
      <div class="page-header">Introduction & Executive Summary</div>
      <div class="photos-grid">
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-7') || '[PHOTO: Typical Bathroom]'}</div>
          <div class="photo-caption">1121 - Typical Bathroom</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-8') || '[PHOTO: Typical Kitchen]'}</div>
          <div class="photo-caption">1121 - Typical Kitchen</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-9') || '[PHOTO: Typical Bedroom]'}</div>
          <div class="photo-caption">1121 - Typical Bedroom</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-10') || '[PHOTO: Laundry Room]'}</div>
          <div class="photo-caption">1121 - Laundry Room</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-11') || '[PHOTO: Electrical Room]'}</div>
          <div class="photo-caption">1121 - Electrical Room</div>
        </div>
        <div class="photo-item">
          <div class="photo-placeholder">${getImageUrl(sections, 'intro-photo-12') || '[PHOTO: Typical Boiler]'}</div>
          <div class="photo-caption">1121 - Typical Boiler</div>
        </div>
      </div>
      <div class="page-footer">
        <span>7</span>
        <span>\${getFieldValue(sections, 'property-address-line1')}, \${getFieldValue(sections, 'property-address-line2')} | File \${getFieldValue(sections, 'file-number')}</span>
      </div>
    </div>
  `;
}

/**
 * Page 13: Introduction & Executive Summary - Photos (Part 3)
 * Fields: intro-photo-13
 */
export function renderPage13(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-13">
      <div class="page-header">Introduction & Executive Summary</div>
      <div class="single-photo">
        <div class="photo-placeholder large">${getImageUrl(sections, 'intro-photo-13') || '[PHOTO: Additional Property View]'}</div>
        <div class="photo-caption">Additional Property View</div>
      </div>
      <div class="page-footer">
        <span>8</span>
        <span>\${getFieldValue(sections, 'property-address-line1')}, \${getFieldValue(sections, 'property-address-line2')} | File \${getFieldValue(sections, 'file-number')}</span>
      </div>
    </div>
  `;
}

/**
 * Page 14: Introduction & Executive Summary - Maps (Street Level)
 * Fields: intro-map-street
 */
export function renderPage14(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-14">
      <div class="page-header">Introduction & Executive Summary</div>
      <div class="map-container">
        <div class="map-placeholder">${getImageUrl(sections, 'intro-map-street') || '[MAP: Street Level View]'}</div>
        <div class="map-caption">Street Level Map</div>
      </div>
      <div class="page-footer">
        <span>9</span>
        <span>\${getFieldValue(sections, 'property-address-line1')}, \${getFieldValue(sections, 'property-address-line2')} | File \${getFieldValue(sections, 'file-number')}</span>
      </div>
    </div>
  `;
}

/**
 * Page 15: Introduction & Executive Summary - Maps (Localized)
 * Fields: intro-map-local
 */
export function renderPage15(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-15">
      <div class="page-header">Introduction & Executive Summary</div>
      <div class="map-container">
        <div class="map-placeholder">${getImageUrl(sections, 'intro-map-local') || '[MAP: Localized Area View]'}</div>
        <div class="map-caption">Localized Area Map</div>
      </div>
      <div class="page-footer">
        <span>10</span>
        <span>\${getFieldValue(sections, 'property-address-line1')}, \${getFieldValue(sections, 'property-address-line2')} | File \${getFieldValue(sections, 'file-number')}</span>
      </div>
    </div>
  `;
}

/**
 * Page 16: Introduction & Executive Summary - Maps (Regional)
 * Fields: intro-map-regional
 */
export function renderPage16(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 16 - Maps (Regional)
  // Fields: intro-map-regional

  return `
    <div class="page page-16">
      <h1>Page 16: Maps (Regional)</h1>
      <p>TODO: Implement regional map template</p>
    </div>
  `;
}

/**
 * Page 17: Introduction & Executive Summary - Subject Property Description
 * Fields: subject-property-location, property-improvements-summary, appraisal-purpose, hypothetical-conditions
 */
export function renderPage17(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 17 - Subject Property Description
  // Fields: subject-property-location, property-improvements-summary
  // appraisal-purpose, hypothetical-conditions

  return `
    <div class="page page-17">
      <h1>Page 17: Subject Property Description</h1>
      <p>TODO: Implement property description template</p>
    </div>
  `;
}

/**
 * Page 18: Introduction & Executive Summary - Ownership & Exposure Time
 * Fields: current-owner, ownership-history, exposure-time-definition, marketing-time-vs-exposure-time,
 * exposure-time-assumptions, exposure-time-conclusion
 */
export function renderPage18(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 18 - Ownership & Exposure Time
  // Fields: current-owner, ownership-history, exposure-time-definition
  // marketing-time-vs-exposure-time, exposure-time-assumptions, exposure-time-conclusion

  return `
    <div class="page page-18">
      <h1>Page 18: Ownership & Exposure Time</h1>
      <p>TODO: Implement ownership template</p>
    </div>
  `;
}

/**
 * Page 19: Introduction & Executive Summary - Definitions & Value Scenarios
 * Fields: market-value-definition, market-value-characteristics, property-rights-appraised,
 * property-rights-details, value-scenarios
 */
export function renderPage19(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 19 - Definitions & Value Scenarios
  // Fields: market-value-definition, market-value-characteristics
  // property-rights-appraised, property-rights-details, value-scenarios

  return `
    <div class="page page-19">
      <h1>Page 19: Definitions & Value Scenarios</h1>
      <p>TODO: Implement definitions template</p>
    </div>
  `;
}

/**
 * Page 20: Introduction & Executive Summary - Assistance & Sources of Information
 * Fields: appraiser-assistance-provided, sources-of-information-table, sources-data-limitation-note
 */
export function renderPage20(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 20 - Assistance & Sources
  // Fields: appraiser-assistance-provided, sources-of-information-table, sources-data-limitation-note

  return `
    <div class="page page-20">
      <h1>Page 20: Assistance & Sources</h1>
      <p>TODO: Implement sources template</p>
    </div>
  `;
}

/**
 * Page 21: Subject Property Inspection
 * Fields: inspection-appraiser-1, inspection-appraiser-2, inspection-date-1, inspection-date-2,
 * inspection-extent, all-units-inspected, inspection-role-1, inspection-role-2
 */
export function renderPage21(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 21 - Subject Property Inspection
  // Fields: inspection-appraiser-1, inspection-appraiser-2, inspection-date-1, inspection-date-2
  // inspection-extent, all-units-inspected, inspection-role-1, inspection-role-2

  return `
    <div class="page page-21">
      <h1>Page 21: Property Inspection</h1>
      <p>TODO: Implement inspection template</p>
    </div>
  `;
}

/**
 * Page 22: Location, Access, Transportation & Local Area
 * Fields: location-description, access-description, public-transit-description, walk-transit-bike-scores,
 * local-area-description, nearby-schools
 */
export function renderPage22(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 22 - Location, Access, Transportation
  // Fields: location-description, access-description, public-transit-description
  // walk-transit-bike-scores, local-area-description, nearby-schools

  return `
    <div class="page page-22">
      <h1>Page 22: Location & Access</h1>
      <p>TODO: Implement location template</p>
    </div>
  `;
}

/**
 * Page 23: Site Details
 * Fields: 22 fields including site-intro-text, property-address-full, legal-description,
 * site-area-sqft, site-topography, site-shape, municipal-services, etc.
 */
export function renderPage23(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 23 - Site Details
  // 22 fields total including site measurements, topography, utilities, adjacencies

  return `
    <div class="page page-23">
      <h1>Page 23: Site Details</h1>
      <p>TODO: Implement site details template</p>
    </div>
  `;
}

/**
 * Page 24: Access & Frontage / Traffic Analysis
 * Fields: frontage-description, traffic-count-data, visibility-rating
 */
export function renderPage24(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 24 - Access & Frontage / Traffic
  // Fields: frontage-description, traffic-count-data, visibility-rating

  return `
    <div class="page page-24">
      <h1>Page 24: Access & Traffic</h1>
      <p>TODO: Implement traffic analysis template</p>
    </div>
  `;
}

/**
 * Page 25: Continued Analysis Section
 * Fields: page-25-continuation
 */
export function renderPage25(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 25 - Continued Analysis
  // Fields: page-25-continuation

  return `
    <div class="page page-25">
      <h1>Page 25: Continued Analysis</h1>
      <p>TODO: Implement continuation template</p>
    </div>
  `;
}

/**
 * Page 26: Site Plans - Lot 17
 * Fields: site-plan-lot-17-image, lot-17-dimensions, lot-17-adjacent-lots
 */
export function renderPage26(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 26 - Site Plans Lot 17
  // Fields: site-plan-lot-17-image, lot-17-dimensions, lot-17-adjacent-lots

  return `
    <div class="page page-26">
      <h1>Page 26: Site Plans - Lot 17</h1>
      <p>TODO: Implement site plan template</p>
    </div>
  `;
}

/**
 * Page 27: Site Plans - Lot 18
 * Fields: site-plan-lot-18-image, lot-18-dimensions
 */
export function renderPage27(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 27 - Site Plans Lot 18
  // Fields: site-plan-lot-18-image, lot-18-dimensions

  return `
    <div class="page page-27">
      <h1>Page 27: Site Plans - Lot 18</h1>
      <p>TODO: Implement site plan template</p>
    </div>
  `;
}

/**
 * Page 28: Improvements Analysis
 * Fields: improvements-summary, building-description
 */
export function renderPage28(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 28 - Improvements Analysis
  // Fields: improvements-summary, building-description

  return `
    <div class="page page-28">
      <h1>Page 28: Improvements Analysis</h1>
      <p>TODO: Implement improvements template</p>
    </div>
  `;
}

/**
 * Page 29: Land Use & Zoning
 * Fields: zoning-classification, zoning-description, land-use-conformity, highest-best-use
 */
export function renderPage29(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 29 - Land Use & Zoning
  // Fields: zoning-classification, zoning-description, land-use-conformity, highest-best-use

  return `
    <div class="page page-29">
      <h1>Page 29: Zoning</h1>
      <p>TODO: Implement zoning template</p>
    </div>
  `;
}

/**
 * Page 30: Zoning Map
 * Fields: zoning-map-image, zoning-districts
 */
export function renderPage30(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 30 - Zoning Map
  // Fields: zoning-map-image, zoning-districts

  return `
    <div class="page page-30">
      <h1>Page 30: Zoning Map</h1>
      <p>TODO: Implement zoning map template</p>
    </div>
  `;
}

/**
 * Page 31: Property Analysis - Description of Improvements
 * No fields defined yet
 */
export function renderPage31(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 31 - Property Analysis - Description of Improvements
  // No fields defined in JSON yet

  return `
    <div class="page page-31">
      <h1>Page 31: Description of Improvements</h1>
      <p>TODO: Implement improvements description template</p>
    </div>
  `;
}

/**
 * Page 32: Property Analysis - Unit Breakdown
 * No fields defined yet
 */
export function renderPage32(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 32 - Unit Breakdown
  // No fields defined in JSON yet

  return `
    <div class="page page-32">
      <h1>Page 32: Unit Breakdown</h1>
      <p>TODO: Implement unit breakdown template</p>
    </div>
  `;
}

/**
 * Page 33: Property Analysis - Building Description
 * No fields defined yet
 */
export function renderPage33(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 33 - Building Description
  // No fields defined in JSON yet

  return `
    <div class="page page-33">
      <h1>Page 33: Building Description</h1>
      <p>TODO: Implement building description template</p>
    </div>
  `;
}

/**
 * Page 34: Property Analysis - Continuation
 * No fields defined yet
 */
export function renderPage34(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 34 - Property Analysis Continuation
  // No fields defined in JSON yet

  return `
    <div class="page page-34">
      <h1>Page 34: Property Analysis Continuation</h1>
      <p>TODO: Implement continuation template</p>
    </div>
  `;
}

/**
 * Page 35: Market Context - Economic Overviews
 * No fields defined yet
 */
export function renderPage35(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 35 - Economic Overviews
  // No fields defined in JSON yet

  return `
    <div class="page page-35">
      <h1>Page 35: Economic Overviews</h1>
      <p>TODO: Implement economic overview template</p>
    </div>
  `;
}

/**
 * Page 36: Market Context - Provincial
 * No fields defined yet
 */
export function renderPage36(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 36 - Provincial Context
  // No fields defined in JSON yet

  return `
    <div class="page page-36">
      <h1>Page 36: Provincial Context</h1>
      <p>TODO: Implement provincial context template</p>
    </div>
  `;
}

/**
 * Page 37: Market Context - Multi-Family Market Overview
 * No fields defined yet
 */
export function renderPage37(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 37 - Multi-Family Market
  // No fields defined in JSON yet

  return `
    <div class="page page-37">
      <h1>Page 37: Multi-Family Market Overview</h1>
      <p>TODO: Implement market overview template</p>
    </div>
  `;
}

/**
 * Page 38: Valuation & Conclusions - Highest & Best Use
 * No fields defined yet
 */
export function renderPage38(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 38 - Highest & Best Use
  // No fields defined in JSON yet

  return `
    <div class="page page-38">
      <h1>Page 38: Highest & Best Use</h1>
      <p>TODO: Implement HBU template</p>
    </div>
  `;
}

/**
 * Page 39: Valuation & Conclusions - As Improved Analysis
 * No fields defined yet
 */
export function renderPage39(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 39 - As Improved Analysis
  // No fields defined in JSON yet

  return `
    <div class="page page-39">
      <h1>Page 39: As Improved Analysis</h1>
      <p>TODO: Implement as improved template</p>
    </div>
  `;
}

/**
 * Page 40: Valuation & Conclusions - Valuation Methodology
 * No fields defined yet
 */
export function renderPage40(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 40 - Valuation Methodology
  // No fields defined in JSON yet

  return `
    <div class="page page-40">
      <h1>Page 40: Valuation Methodology</h1>
      <p>TODO: Implement methodology template</p>
    </div>
  `;
}

/**
 * Page 41: Valuation & Conclusions
 * Fields: approaches-to-value-table, valuation-intro-text
 */
export function renderPage41(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 41 - Valuation & Conclusions
  // Fields: approaches-to-value-table, valuation-intro-text

  return `
    <div class="page page-41">
      <h1>Page 41: Valuation Approaches</h1>
      <p>TODO: Implement valuation approaches template</p>
    </div>
  `;
}

/**
 * Page 42: Valuation & Conclusions - Income Approach
 * Fields: 9 fields including income-approach-overview, direct-capitalization-method,
 * multifamily-revenue-analysis-intro, subject-rent-roll-table, etc.
 */
export function renderPage42(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 42 - Income Approach
  // 9 fields total

  return `
    <div class="page page-42">
      <h1>Page 42: Income Approach</h1>
      <p>TODO: Implement income approach template</p>
    </div>
  `;
}

/**
 * Page 43: Valuation & Conclusions - Rent Survey
 * Fields: survey-presentation-intro, survey-comparison-table, rent-survey-information-table, building-information-table
 */
export function renderPage43(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 43 - Rent Survey
  // Fields: survey-presentation-intro, survey-comparison-table
  // rent-survey-information-table, building-information-table

  return `
    <div class="page page-43">
      <h1>Page 43: Rent Survey</h1>
      <p>TODO: Implement rent survey template</p>
    </div>
  `;
}

/**
 * Page 44: Valuation & Conclusions - Comparable Location Map
 * Fields: location-map-placeholder, comparable-distance-table
 */
export function renderPage44(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 44 - Comparable Location Map
  // Fields: location-map-placeholder, comparable-distance-table

  return `
    <div class="page page-44">
      <h1>Page 44: Comparable Location Map</h1>
      <p>TODO: Implement location map template</p>
    </div>
  `;
}

/**
 * Page 45: Valuation & Conclusions - Market Rent Analysis
 * Fields: market-rent-conclusion-intro, one-bed-units-analysis-table, one-bed-unit-conclusion-table,
 * two-bed-units-analysis-table, two-bed-unit-conclusion-table
 */
export function renderPage45(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 45 - Market Rent Analysis
  // Fields: market-rent-conclusion-intro, one-bed-units-analysis-table
  // one-bed-unit-conclusion-table, two-bed-units-analysis-table, two-bed-unit-conclusion-table

  return `
    <div class="page page-45">
      <h1>Page 45: Market Rent Analysis</h1>
      <p>TODO: Implement market rent template</p>
    </div>
  `;
}

/**
 * Page 46: Valuation & Conclusions - Section Divider
 * Fields: section-divider-page
 */
export function renderPage46(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 46 - Section Divider
  // Fields: section-divider-page

  return `
    <div class="page page-46">
      <h1>Page 46: Section Divider</h1>
      <p>TODO: Implement divider template</p>
    </div>
  `;
}

/**
 * Page 47: Valuation & Conclusions - Revenue Analysis
 * Fields: 7 fields including unit-rent-discussion, contract-vs-market-rent-section,
 * rental-revenue-table, other-revenue-conclusions-table, etc.
 */
export function renderPage47(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 47 - Revenue Analysis
  // 7 fields total

  return `
    <div class="page page-47">
      <h1>Page 47: Revenue Analysis</h1>
      <p>TODO: Implement revenue template</p>
    </div>
  `;
}

/**
 * Page 48: Valuation & Conclusions - Vacancy & EGR
 * Fields: vacancy-allowance-discussion, vacancy-loss-table, effective-gross-revenue-section, operating-expenses-discussion
 */
export function renderPage48(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 48 - Vacancy & EGR
  // Fields: vacancy-allowance-discussion, vacancy-loss-table
  // effective-gross-revenue-section, operating-expenses-discussion

  return `
    <div class="page page-48">
      <h1>Page 48: Vacancy & EGR</h1>
      <p>TODO: Implement vacancy template</p>
    </div>
  `;
}

/**
 * Page 49: Valuation & Conclusions - Operating Expenses
 * Fields: operating-history-table, operating-expenses-breakdown-table, net-operating-income-ytd
 */
export function renderPage49(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 49 - Operating Expenses
  // Fields: operating-history-table, operating-expenses-breakdown-table, net-operating-income-ytd

  return `
    <div class="page page-49">
      <h1>Page 49: Operating Expenses</h1>
      <p>TODO: Implement expenses template</p>
    </div>
  `;
}

/**
 * Page 50: Valuation & Conclusions - Expense Detail
 * Fields: expense-conclusions-header, operating-expenses-detail-table, net-operating-income-conclusion
 */
export function renderPage50(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 50 - Expense Detail
  // Fields: expense-conclusions-header, operating-expenses-detail-table, net-operating-income-conclusion

  return `
    <div class="page page-50">
      <h1>Page 50: Expense Detail</h1>
      <p>TODO: Implement expense detail template</p>
    </div>
  `;
}

/**
 * Page 51: Valuation & Conclusions - Capitalization Rate Selection
 * Fields: cap-rate-selection-intro, alternative-investment-rates-text, investment-activity-trends-text, multifamily-chart-placeholder
 */
export function renderPage51(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 51 - Cap Rate Selection
  // Fields: cap-rate-selection-intro, alternative-investment-rates-text
  // investment-activity-trends-text, multifamily-chart-placeholder

  return `
    <div class="page page-51">
      <h1>Page 51: Cap Rate Selection</h1>
      <p>TODO: Implement cap rate template</p>
    </div>
  `;
}

/**
 * Page 52: Valuation & Conclusions - Cap Rate Methodology
 * Fields: cap-rate-methodology-intro, comparable-sales-table
 */
export function renderPage52(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 52 - Cap Rate Methodology
  // Fields: cap-rate-methodology-intro, comparable-sales-table

  return `
    <div class="page page-52">
      <h1>Page 52: Cap Rate Methodology</h1>
      <p>TODO: Implement cap rate methodology template</p>
    </div>
  `;
}

/**
 * Page 53: Valuation & Conclusions - Comparable Analysis
 * Fields: comparable-details-table
 */
export function renderPage53(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 53 - Comparable Analysis
  // Fields: comparable-details-table

  return `
    <div class="page page-53">
      <h1>Page 53: Comparable Analysis</h1>
      <p>TODO: Implement comparable analysis template</p>
    </div>
  `;
}

/**
 * Page 54: Valuation & Conclusions - Direct Capitalization
 * Fields: direct-capitalization-intro, income-approach-conclusion-table, dcf-methodology-note
 */
export function renderPage54(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 54 - Direct Capitalization
  // Fields: direct-capitalization-intro, income-approach-conclusion-table, dcf-methodology-note

  return `
    <div class="page page-54">
      <h1>Page 54: Direct Capitalization</h1>
      <p>TODO: Implement direct capitalization template</p>
    </div>
  `;
}

/**
 * Page 55: Valuation & Conclusions - Comparable 1 Analysis
 * Fields: 7 fields for comp1 including sale-info-table, income-analysis-table, property-table,
 * unit-mix-table, photo-placeholder, map-placeholder, description
 */
export function renderPage55(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 55 - Comparable 1
  // 7 fields for comp1

  return `
    <div class="page page-55">
      <h1>Page 55: Comparable 1 Analysis</h1>
      <p>TODO: Implement comparable 1 template</p>
    </div>
  `;
}

/**
 * Page 56: Valuation & Conclusions - Direct Comparison Approach
 * Fields: direct-comparison-section-heading, direct-comparison-intro-text
 */
export function renderPage56(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 56 - Direct Comparison Approach
  // Fields: direct-comparison-section-heading, direct-comparison-intro-text

  return `
    <div class="page page-56">
      <h1>Page 56: Direct Comparison Approach</h1>
      <p>TODO: Implement direct comparison template</p>
    </div>
  `;
}

/**
 * Page 57: Valuation & Conclusions - Comparable Properties Presentation
 * Fields: comparable-presentation-heading, comparable-content-placeholder
 */
export function renderPage57(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 57 - Comparable Properties
  // Fields: comparable-presentation-heading, comparable-content-placeholder

  return `
    <div class="page page-57">
      <h1>Page 57: Comparable Properties</h1>
      <p>TODO: Implement comparable properties template</p>
    </div>
  `;
}

/**
 * Page 58: Valuation & Conclusions - Comparable 2
 * Fields: comp2-analysis-section
 */
export function renderPage58(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 58 - Comparable 2
  // Fields: comp2-analysis-section

  return `
    <div class="page page-58">
      <h1>Page 58: Comparable 2</h1>
      <p>TODO: Implement comparable 2 template</p>
    </div>
  `;
}

/**
 * Page 59: Valuation & Conclusions - Market Analysis
 * Fields: market-analysis-content
 */
export function renderPage59(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 59 - Market Analysis
  // Fields: market-analysis-content

  return `
    <div class="page page-59">
      <h1>Page 59: Market Analysis</h1>
      <p>TODO: Implement market analysis template</p>
    </div>
  `;
}

/**
 * Page 60: Valuation & Conclusions - Comparable 2 Details
 * Fields: 7 fields for comp2 including sale-info-table, income-analysis-table, property-table,
 * unit-mix-table, photo-placeholder, map-placeholder, description
 */
export function renderPage60(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 60 - Comparable 2 Details
  // 7 fields for comp2

  return `
    <div class="page page-60">
      <h1>Page 60: Comparable 2 Details</h1>
      <p>TODO: Implement comparable 2 details template</p>
    </div>
  `;
}

/**
 * Page 61: Valuation & Conclusions - Comparable 1 (Woodland Estates)
 * Fields: 39 fields for comparable-1 including title, property-name, buyer, seller, sale-date,
 * transaction-status, sale-price, financing, occupancy, NOI, cap-rate, address, property details, etc.
 */
export function renderPage61(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 61 - Comparable 1 (Woodland Estates)
  // 39 fields total for comparable-1

  return `
    <div class="page page-61">
      <h1>Page 61: Comparable 1 (Woodland Estates)</h1>
      <p>TODO: Implement comparable 1 full template</p>
    </div>
  `;
}

/**
 * Page 62: Valuation & Conclusions - Comparable 4 (Parkside Flats 1)
 * Fields: 42 fields for comparable-4 including title, property-name, buyer, seller, sale details,
 * financial metrics, property characteristics, unit mix, etc.
 */
export function renderPage62(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 62 - Comparable 4 (Parkside Flats 1)
  // 42 fields total for comparable-4

  return `
    <div class="page page-62">
      <h1>Page 62: Comparable 4 (Parkside Flats 1)</h1>
      <p>TODO: Implement comparable 4 template</p>
    </div>
  `;
}

/**
 * Page 63: Valuation & Conclusions - Comparable 1 (Parkside Flats 2)
 * Fields: 45 fields for comparable-1b including all sale details, financial metrics,
 * property characteristics, unit mix breakdown, analysis text, etc.
 */
export function renderPage63(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 63 - Comparable 1 (Parkside Flats 2)
  // 45 fields total for comparable-1b

  return `
    <div class="page page-63">
      <h1>Page 63: Comparable 1 (Parkside Flats 2)</h1>
      <p>TODO: Implement comparable 1b template</p>
    </div>
  `;
}

/**
 * Page 64: Valuation & Conclusions - Direct Comparison Approach Table
 * Fields: 37 fields including title, addresses for subject and 6 comps, sale info, income info,
 * physical info, adjustments arrays, etc.
 */
export function renderPage64(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 64 - Direct Comparison Table
  // 37 fields total including comparison grid data

  return `
    <div class="page page-64">
      <h1>Page 64: Direct Comparison Table</h1>
      <p>TODO: Implement comparison table template</p>
    </div>
  `;
}

/**
 * Page 65: Valuation & Conclusions - Sales Comparison Approach Analysis
 * Fields: sales-comparison-title, sales-comparison-approach-title, 4 analysis paragraphs,
 * unadjusted-adjusted-price-chart
 */
export function renderPage65(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 65 - Sales Comparison Analysis
  // Fields: titles, 4 analysis paragraphs, price chart

  return `
    <div class="page page-65">
      <h1>Page 65: Sales Comparison Analysis</h1>
      <p>TODO: Implement sales comparison template</p>
    </div>
  `;
}

/**
 * Page 66: Valuation & Conclusions - Direct Comparison Approach Conclusion
 * Fields: 49 fields including conclusion data for all comparables, adjustment percentages,
 * final values, statistical summary (high, avg, med, low), subject indicated value
 */
export function renderPage66(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 66 - Direct Comparison Conclusion
  // 49 fields total with complete conclusion data

  return `
    <div class="page page-66">
      <h1>Page 66: Direct Comparison Conclusion</h1>
      <p>TODO: Implement comparison conclusion template</p>
    </div>
  `;
}

/**
 * Page 67: Valuation & Conclusions - Reconciliation of Value
 * Fields: reconciliation-title, reconciliation-of-value-title, 6 reconciliation paragraphs,
 * page-number, footer-address
 */
export function renderPage67(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 67 - Reconciliation
  // Fields: titles, 6 reconciliation paragraphs, footer

  return `
    <div class="page page-67">
      <h1>Page 67: Reconciliation of Value</h1>
      <p>TODO: Implement reconciliation template</p>
    </div>
  `;
}

/**
 * Page 68: Valuation & Conclusions - Reconciliation of Values (Final)
 * Fields: 34 fields including final reconciliation title, valuation scenarios, interest/date,
 * direct comparison final values, income approach final values, final value conclusion,
 * hypothetical conditions, extraordinary assumptions/limiting conditions
 */
export function renderPage68(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 68 - Final Reconciliation
  // 34 fields total with complete final value conclusion

  return `
    <div class="page page-68">
      <h1>Page 68: Final Reconciliation</h1>
      <p>TODO: Implement final reconciliation template</p>
    </div>
  `;
}

/**
 * Page 69: Valuation & Conclusions - Certification
 * Fields: 15 fields including certification-title, section-title, 11 certification items,
 * page-number, footer-address
 */
export function renderPage69(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 69 - Certification
  // 15 fields total with all certification statements

  return `
    <div class="page page-69">
      <h1>Page 69: Certification</h1>
      <p>TODO: Implement certification template</p>
    </div>
  `;
}

/**
 * Page 71: Appendices - Contingent & Limiting Conditions
 * No fields defined yet
 */
export function renderPage71(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 71 - Contingent & Limiting Conditions
  // No fields defined in JSON yet

  return `
    <div class="page page-71">
      <h1>Page 71: Contingent & Limiting Conditions</h1>
      <p>TODO: Implement conditions template</p>
    </div>
  `;
}

/**
 * Page 72: Appendices - Contingent & Limiting Conditions (continued)
 * No fields defined yet
 */
export function renderPage72(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 72 - Conditions (continued)
  // No fields defined in JSON yet

  return `
    <div class="page page-72">
      <h1>Page 72: Conditions (continued)</h1>
      <p>TODO: Implement conditions continuation template</p>
    </div>
  `;
}

/**
 * Page 73: Appendices - Contingent & Limiting Conditions (continued)
 * No fields defined yet
 */
export function renderPage73(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 73 - Conditions (continued)
  // No fields defined in JSON yet

  return `
    <div class="page page-73">
      <h1>Page 73: Conditions (continued)</h1>
      <p>TODO: Implement conditions continuation template</p>
    </div>
  `;
}

/**
 * Page 74: Appendices - Definition of Terms
 * No fields defined yet
 */
export function renderPage74(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 74 - Definition of Terms
  // No fields defined in JSON yet

  return `
    <div class="page page-74">
      <h1>Page 74: Definition of Terms</h1>
      <p>TODO: Implement definitions template</p>
    </div>
  `;
}

/**
 * Page 75: Appendices - Definition of Terms (continued)
 * No fields defined yet
 */
export function renderPage75(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 75 - Definitions (continued)
  // No fields defined in JSON yet

  return `
    <div class="page page-75">
      <h1>Page 75: Definitions (continued)</h1>
      <p>TODO: Implement definitions continuation template</p>
    </div>
  `;
}

/**
 * Page 76: Appendices - Definition of Terms (continued)
 * No fields defined yet
 */
export function renderPage76(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 76 - Definitions (continued)
  // No fields defined in JSON yet

  return `
    <div class="page page-76">
      <h1>Page 76: Definitions (continued)</h1>
      <p>TODO: Implement definitions continuation template</p>
    </div>
  `;
}

/**
 * Page 77: Appendices - Definition of Terms (continued)
 * No fields defined yet
 */
export function renderPage77(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 77 - Definitions (continued)
  // No fields defined in JSON yet

  return `
    <div class="page page-77">
      <h1>Page 77: Definitions (continued)</h1>
      <p>TODO: Implement definitions continuation template</p>
    </div>
  `;
}

/**
 * Page 78: Appendices - Qualifications of the Appraiser
 * No fields defined yet
 */
export function renderPage78(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 78 - Appraiser Qualifications
  // No fields defined in JSON yet

  return `
    <div class="page page-78">
      <h1>Page 78: Appraiser Qualifications</h1>
      <p>TODO: Implement qualifications template</p>
    </div>
  `;
}

/**
 * Page 79: Back Cover
 * No fields defined yet
 */
export function renderPage79(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 79 - Back Cover
  // No fields defined in JSON yet

  return `
    <div class="page page-79">
      <h1>Page 79: Back Cover</h1>
      <p>TODO: Implement back cover template</p>
    </div>
  `;
}

// ============================================================================
// MASTER ORCHESTRATOR
// ============================================================================

/**
 * Page number to render function mapping
 */
const PAGE_RENDERERS: Record<number, PageRenderFunction> = {
  1: renderPage01,
  2: renderPage02,
  3: renderPage03,
  4: renderPage04,
  5: renderPage05,
  6: renderPage06,
  7: renderPage07,
  8: renderPage08,
  9: renderPage09,
  11: renderPage11,
  12: renderPage12,
  13: renderPage13,
  14: renderPage14,
  15: renderPage15,
  16: renderPage16,
  17: renderPage17,
  18: renderPage18,
  19: renderPage19,
  20: renderPage20,
  21: renderPage21,
  22: renderPage22,
  23: renderPage23,
  24: renderPage24,
  25: renderPage25,
  26: renderPage26,
  27: renderPage27,
  28: renderPage28,
  29: renderPage29,
  30: renderPage30,
  31: renderPage31,
  32: renderPage32,
  33: renderPage33,
  34: renderPage34,
  35: renderPage35,
  36: renderPage36,
  37: renderPage37,
  38: renderPage38,
  39: renderPage39,
  40: renderPage40,
  41: renderPage41,
  42: renderPage42,
  43: renderPage43,
  44: renderPage44,
  45: renderPage45,
  46: renderPage46,
  47: renderPage47,
  48: renderPage48,
  49: renderPage49,
  50: renderPage50,
  51: renderPage51,
  52: renderPage52,
  53: renderPage53,
  54: renderPage54,
  55: renderPage55,
  56: renderPage56,
  57: renderPage57,
  58: renderPage58,
  59: renderPage59,
  60: renderPage60,
  61: renderPage61,
  62: renderPage62,
  63: renderPage63,
  64: renderPage64,
  65: renderPage65,
  66: renderPage66,
  67: renderPage67,
  68: renderPage68,
  69: renderPage69,
  71: renderPage71,
  72: renderPage72,
  73: renderPage73,
  74: renderPage74,
  75: renderPage75,
  76: renderPage76,
  77: renderPage77,
  78: renderPage78,
  79: renderPage79,
};

/**
 * Master orchestrator function to render all report pages
 *
 * @param sections - All report sections containing field data
 * @param valueScenarioType - The value scenario type (e.g., "As Stabilized", "As Is")
 * @returns Array of HTML strings, one per page
 */
export function renderReportPages(
  sections: ReportSection[],
  valueScenarioType: string
): string[] {
  const pages: string[] = [];

  // Render all pages in order (note: pages 2, 10, 70 are skipped per consolidated JSON)
  const pageNumbers = Object.keys(PAGE_RENDERERS)
    .map(Number)
    .sort((a, b) => a - b);

  for (const pageNum of pageNumbers) {
    const renderFunc = PAGE_RENDERERS[pageNum];
    if (renderFunc) {
      const pageHtml = renderFunc(sections, valueScenarioType);
      pages.push(pageHtml);
    }
  }

  return pages;
}

/**
 * Render a single page by page number
 *
 * @param pageNumber - The page number to render (1-79, excluding 2, 10, 70)
 * @param sections - All report sections containing field data
 * @param valueScenarioType - The value scenario type
 * @returns HTML string for the requested page, or empty string if page doesn't exist
 */
export function renderSinglePage(
  pageNumber: number,
  sections: ReportSection[],
  valueScenarioType: string
): string {
  const renderFunc = PAGE_RENDERERS[pageNumber];
  if (!renderFunc) {
    console.warn(`No render function found for page ${pageNumber}`);
    return '';
  }

  return renderFunc(sections, valueScenarioType);
}

/**
 * Get list of all available page numbers
 */
export function getAvailablePageNumbers(): number[] {
  return Object.keys(PAGE_RENDERERS)
    .map(Number)
    .sort((a, b) => a - b);
}
