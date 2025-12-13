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
  return `
    <div class="page page-16">
      <div class="page-title">Introduction & Executive Summary</div>
      <div class="map-container">
        <div class="image-placeholder">
          ${getImageUrl(sections, 'intro-map-regional') || '[MAP: Regional location map showing subject property marked in central circle with nearby highways, municipalities, towns, and provincial geography with roads and water features]'}
        </div>
      </div>
      <div class="footer-section">
        <div class="address-info">
          <span class="page-number">11</span>${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}
        </div>
        <div class="accent-bar"></div>
      </div>
    </div>
  `;
}

/**
 * Page 17: Introduction & Executive Summary - Subject Property Description
 * Fields: subject-property-location, property-improvements-summary, appraisal-purpose, hypothetical-conditions
 */
export function renderPage17(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-17">
      <div class="content-wrapper">
        <div class="page-header">
          <div class="page-title">Introduction & Executive Summary</div>
        </div>

        <div class="section-heading">Identification of Assignment</div>

        <h3 class="subsection-heading">Property Identification</h3>
        <p class="first-paragraph">The subject property, located at ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')}, is a multi-family, walkup property with approximately ${getFieldValue(sections, 'building-nra-sf')} square feet of net rentable area.</p>
        <p>The improvements are comprised of ${getFieldValue(sections, 'number-of-buildings')} total buildings, and consist of ${getFieldValue(sections, 'building-nra-sf')} square feet of net rentable area (NRA) as of the valuation date. The property, reportedly built in ${getFieldValue(sections, 'year-built')}; (${getFieldValue(sections, 'effective-year-built')} weighted) is approximately ${getFieldValue(sections, 'occupancy-rate')}% occupied and features ${getFieldValue(sections, 'total-units')} units in a ${getFieldValue(sections, 'number-of-stories')}-story, garden style format.</p>

        <h3 class="subsection-heading">Legal Description</h3>
        <p class="first-paragraph">${getFieldValue(sections, 'legal-description')}</p>

        <h3 class="subsection-heading">Authorized Client Identification</h3>
        <p class="first-paragraph">The authorized client of this specific assignment is ${getFieldValue(sections, 'client-name')}.</p>

        <h3 class="subsection-heading">Authorized Use & Authorized Users</h3>
        <p class="first-paragraph">The authorized use of this report is for ${getFieldValue(sections, 'appraisal-purpose')}. ${getFieldValue(sections, 'client-name')} is the only authorized user of this report.</p>

        <h3 class="subsection-heading">Effective Date of Value and Report Date</h3>
        <p class="first-paragraph">The effective date of value of this appraisal is ${getFieldValue(sections, 'effective-date')}. The report date is ${getFieldValue(sections, 'report-date')}.</p>

        <h3 class="subsection-heading">Inspection Date</h3>
        <p class="first-paragraph">${getFieldValue(sections, 'inspection-date')}</p>

        <h3 class="subsection-heading">Purpose</h3>
        <p class="first-paragraph">The purpose of this assignment is to provide the ${valueScenarioType} which at the time of inspection represents the existing improvements assuming stabilized occupancy as of the effective date for the property located at ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} (herein referred to as the Subject property).</p>

        <h3 class="subsection-heading">Hypothetical Conditions</h3>
        <p class="first-paragraph">${getFieldValue(sections, 'hypothetical-conditions') || 'One of a hypothetical condition(s) may have impacted the results of the assignment. The As Stabilized value has been developed based on the hypothetical condition that the subject property is fully leased at prevailing market rents and has achieved stabilized occupancy as of the effective date of the appraisal.'}</p>
      </div>

      <div class="page-footer">
        <span class="footer-text">12     ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</span>
        <div class="footer-accent"></div>
      </div>
    </div>
  `;
}

/**
 * Page 18: Introduction & Executive Summary - Ownership & Exposure Time
 * Fields: current-owner, ownership-history, exposure-time-definition, marketing-time-vs-exposure-time,
 * exposure-time-assumptions, exposure-time-conclusion
 */
export function renderPage18(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-18">
      <div class="page-header">
        <h1>Introduction & Executive Summary</h1>
      </div>

      <div class="section">
        <h2 class="section-title">Extraordinary Assumptions</h2>
        <p class="text-content">${getFieldValue(sections, 'extraordinary-assumptions') || 'No Extraordinary Assumptions were made for this assignment.'}</p>
      </div>

      <div class="section">
        <h2 class="section-title">Extraordinary Limiting Conditions</h2>
        <p class="text-content">${getFieldValue(sections, 'extraordinary-limiting-conditions') || 'No Extraordinary Limiting Conditions were made for this assignment.'}</p>
      </div>

      <div class="section">
        <h2 class="section-title">Property And Sales History</h2>

        <h3 class="subsection-title">Current Owner</h3>
        <p class="text-content">The subject property is currently under the ownership of ${getFieldValue(sections, 'current-owner') || getFieldValue(sections, 'client-name')}.</p>

        <h3 class="subsection-title">Three-Year Sales History</h3>
        <p class="text-content">${getFieldValue(sections, 'ownership-history') || 'Ownership of the subject property has not changed in the past three years. We are unaware of any pending sales or listing activity relating to the subject property.'}</p>
      </div>

      <div class="section">
        <h2 class="section-title">Exposure & Marketing Time</h2>
        <p class="text-content">An estimate of market value is related to the concept of reasonable exposure time. Exposure time is the property's estimated marketing time prior to a hypothetical sale at market value on the effective date of the appraisal. It is a retrospective function of asking price, property type, and past market conditions and encompasses not only adequate, sufficient and appropriate marketing time but also adequate, sufficient and logical effort. Reasonable exposure time is a necessary element of a market value definition but is not a prediction of a specific date of sale.</p>

        <p class="text-content">In appraisal theory and practice, there is a distinction relating to the perspective between exposure time and marketing time. Exposure time is presumed to precede the effective date of appraisal whereas marketing time is presumed to succeed the effective date. Marketing time is a prospective function of asking price, property type, and anticipated market conditions.</p>

        <ul>
          <li>The property would have been offered at a competitive price on the open market</li>
          <li>The owner provided interested agents with any and all relevant property information</li>
          <li>Negotiated for any offers to purchase were performed in a timely manner</li>
          <li>The property was maintained at a physical status equivalent to its present condition</li>
          <li>Market level financing was readily available</li>
        </ul>

        <p class="text-content">Noting the subject property's physical, legal, economic and market characteristics, we have concluded a reasonable estimate of <strong>exposure and marketing time</strong> for the subject property to be ${getFieldValue(sections, 'exposure-time-conclusion') || 'six months'}.</p>

        <div class="table-container">
          <div class="table-header">EXPOSURE & MARKETING TIME</div>
          <table>
            <tr>
              <th>PROFILE</th>
              <th>AVERAGE</th>
            </tr>
            <tr>
              <td>Exposure Period Conclusion</td>
              <td>${getFieldValue(sections, 'exposure-period') || 'Six Months'}</td>
            </tr>
            <tr>
              <td>Marketing Time Conclusion</td>
              <td>${getFieldValue(sections, 'marketing-time') || 'Six Months'}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="page-footer">
        <div class="footer-left">
          13 | ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}
        </div>
        <div class="footer-right">
          <div class="footer-bar"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Page 19: Introduction & Executive Summary - Definitions & Value Scenarios
 * Fields: market-value-definition, market-value-characteristics, property-rights-appraised,
 * property-rights-details, value-scenarios
 */
export function renderPage19(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-19">
      <div class="page-header">
        <h1>Introduction & Executive Summary</h1>
      </div>

      <h2>Definition of Market Value</h2>
      <p>According to the January 1, 2024 version of the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP), market value is defined as:</p>

      <div class="definition-block">
        <p><em>"The most probable price, as of a specified date, in cash, or in terms equivalent to cash, or in other precisely revealed terms, for which the specified property rights should sell after reasonable exposure in a competitive market under all conditions requisite to a fair sale, with the buyer and the seller each acting prudently, knowledgeably, and for self-interest, and assuming that neither is under duress."</em></p>
      </div>

      <p>Implicit in this definition are the consumption of a sale of the specified date and the passing of title from seller to buyer under the following conditions whereby:</p>

      <ol>
        <li>the seller and buyer are typically motivated;</li>
        <li>both parties are well informed or well advised, and acting in what they consider their best interests;</li>
        <li>a reasonable time is allowed for exposure in the open market;</li>
        <li>payment is made in terms of cash in Canadian dollars or in terms of financial arrangements comparable thereto;</li>
        <li>the price represents the normal consideration for the property sold unaffected by special or creative financing or sales concessions granted by anyone associated with the sale.</li>
      </ol>

      <h2>Property Rights Appraised</h2>
      <p>The property rights appraised constitute the fee simple estate interest.</p>

      <h3>Fee Simple Interest</h3>
      <p>Absolute ownership unencumbered by any other interest or estate, subject only to the limitations imposed by the governmental powers of taxation, eminent domain, police power and escheat. The subject multifamily property is appraised under the fee simple interest, as residential tenancies are typically short-term in nature and do not constitute long-term encumbrances on the estate that would give rise to a leased fee interest.</p>

      <h2>Value Scenarios</h2>

      <h3>Current Value</h3>
      <p>Current Value Opinion refers to an effective date at the time of inspection or, at some other date within a reasonably short period of time from the date of inspection when market conditions have not or are not expected to have changed.</p>

      <h3>Scope of Work</h3>
      <p>The scope of work for this appraisal assignment is outlined below:</p>

      <ul>
        <li>The appraisal analyzes legal and physical features of the subject including site size, improvement size, site zoning, easements, encumbrances, site access and site exposure.</li>
        <li>The appraisal includes a market analysis for the ${getFieldValue(sections, 'property-city')} market and ${getFieldValue(sections, 'property-city')} submarket using vacancy and rent data.</li>
        <li>Research of recent sale and rent comparables. Examined market conditions and analyzed their potential effect on the various properties.</li>
        <li>The appraisal includes a Highest and Best Use analysis and conclusions have been completed for the highest and best use of the subject property As Though Vacant and As Improved.</li>
      </ul>

      <div class="footnote">
        <p><strong>14</strong>&nbsp;&nbsp;&nbsp;${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</p>
      </div>
    </div>
  `;
}

/**
 * Page 20: Introduction & Executive Summary - Assistance & Sources of Information
 * Fields: appraiser-assistance-provided, sources-of-information-table, sources-data-limitation-note
 */
export function renderPage20(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-20">
      <h1>Introduction & Executive Summary</h1>

      <div class="section">
        <p>In selecting applicable approaches to value, the appraiser's considered the agreed upon appraisal scope and assessed the applicability of each traditional approach given the subject's characteristics and the intended use of the appraisal. As a result, this appraisal developed Direct Comparison and Income (Direct Capitalization) Approaches. The values presented represent the ${valueScenarioType} (see Appraisal Exhibits).</p>

        <p>The assignment was prepared as an Appraisal Report in accordance with CUSPAP, with the analysis stated within the document and representing a fully described scope of analysis.</p>

        <p>The author of this report has the knowledge and experience to complete this assignment competently. The following work was not undertaken as it was not required for credible results within the scope of this appraisal.</p>

        <p>Environmental reports, building condition assessments, and title searches were not reviewed by the appraiser and are assumed to be satisfactory unless otherwise stated.</p>

        <p>The appraiser did not review title documents or legal encumbrances other than zoning information provided by municipal sources.</p>

        <p>No verification of building permits, code compliance, or outstanding orders was undertaken. Rent rolls, leases and operating statements, were accepted as accurate without audit or verification.</p>

        <p>This appraisal was completed in conformity with the CUSPAP 2024 Appraisal Standard and the Reporting Standard for a Concise Report, which requires inclusion of all relevant information necessary to produce a credible result.</p>
      </div>

      <h2>Assistance Provided</h2>
      <div class="section">
        <p>${getFieldValue(sections, 'appraiser-assistance-provided') || 'Property inspection assistance was provided by a qualified inspector registered with the AIC to provide professional assistance with real property inspection.'}</p>
      </div>

      <h2>Sources of Information</h2>
      <div class="section">
        <p>The following sources were contacted to obtain relevant information:</p>

        <table>
          <thead>
            <tr>
              <th>INFORMATION PROVIDED</th>
              <th>SOURCE</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Property Assessment & Tax</td><td>SAMA</td></tr>
            <tr><td>Zoning & Land Use Planning</td><td>City of ${getFieldValue(sections, 'property-city')} Zoning</td></tr>
            <tr><td>Site Size</td><td>ICS</td></tr>
            <tr><td>Building Size</td><td>Client</td></tr>
            <tr><td>Comparable Information</td><td>CoStar | Confirmed by Local Agents</td></tr>
            <tr><td>Legal Description</td><td>Client</td></tr>
            <tr><td>Rent Roll</td><td>Client</td></tr>
            <tr><td>Income/Expense Budget</td><td>Not Provided</td></tr>
            <tr><td>Title</td><td>Not Provided</td></tr>
            <tr><td>Lease Documents</td><td>Not Provided</td></tr>
          </tbody>
        </table>

        <p>${getFieldValue(sections, 'sources-data-limitation-note') || 'The lack of the unavailable items could affect the results of this analysis. As part of the general assumptions and limiting conditions, the subject is assumed to have no adverse easements, significant items of deferred maintenance, or be impacted by adverse environmental conditions.'}</p>
      </div>

      <div class="footer-text">
        ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}
      </div>

      <div class="page-number">15</div>
    </div>
  `;
}

/**
 * Page 21: Subject Property Inspection
 * Fields: inspection-appraiser-1, inspection-appraiser-2, inspection-date-1, inspection-date-2,
 * inspection-extent, all-units-inspected, inspection-role-1, inspection-role-2
 */
export function renderPage21(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-21">
      <div class="page-header">
        <div class="section-title">Introduction & Executive Summary</div>
      </div>

      <div class="subsection-title">Subject Property Inspection</div>

      <table class="property-inspection-table">
        <thead>
          <tr>
            <th>APPRAISER</th>
            <th>INSPECTED</th>
            <th>EXTENT</th>
            <th>ALL UNITS INSPECTED</th>
            <th>DATE</th>
            <th>ROLE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${getFieldValue(sections, 'inspection-appraiser-1') || getFieldValue(sections, 'appraiser-name')}<br>${getFieldValue(sections, 'inspection-appraiser-2') || ''}</td>
            <td>Yes</td>
            <td>${getFieldValue(sections, 'inspection-extent') || 'Interior & Exterior'}</td>
            <td>${getFieldValue(sections, 'all-units-inspected') || 'No'}</td>
            <td>${getFieldValue(sections, 'inspection-date-1') || getFieldValue(sections, 'inspection-date')}<br>${getFieldValue(sections, 'inspection-date-2') || ''}</td>
            <td>${getFieldValue(sections, 'inspection-role-1') || 'Primary Appraiser'}<br>${getFieldValue(sections, 'inspection-role-2') || 'Inspector'}</td>
          </tr>
        </tbody>
      </table>

      <div class="subsection-title">Personal Property & Business Intangible</div>

      <div class="text-content">
        <p>${getFieldValue(sections, 'personal-property-note') || 'There is no personal property (FF&E) included in this valuation. There is not any business or intangible value included in the value conclusion reported here.'}</p>
      </div>

      <div class="footer">
        <div class="footer-left">16&nbsp;&nbsp;&nbsp;&nbsp;${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 22: Location, Access, Transportation & Local Area
 * Fields: location-description, access-description, public-transit-description, walk-transit-bike-scores,
 * local-area-description, nearby-schools
 */
export function renderPage22(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-22">
      <div class="content">
        <h1>Property Analysis</h1>

        <div class="section">
          <div class="section-title">Location</div>
          <div class="section-content">
            <p>${getFieldValue(sections, 'location-description') || 'The subject property is located in ' + getFieldValue(sections, 'property-city') + ', ' + getFieldValue(sections, 'property-province') + ', in a centrally situated residential area near key commercial corridors and the downtown core.'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Access</div>
          <div class="section-content">
            <p>${getFieldValue(sections, 'access-description') || 'The property fronts ' + getFieldValue(sections, 'frontage-street') + ' with convenient connections to major arterials.'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Public Transportation</div>
          <div class="section-content">
            <p>${getFieldValue(sections, 'public-transit-description') || 'Local bus service operates on nearby corridors, providing direct access to downtown, retail centres, and community facilities.'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Walk/Bike/Transit Scores</div>
          <div class="section-content">
            <p>${getFieldValue(sections, 'walk-transit-bike-scores') || 'The immediate area offers moderate walkability and cycling potential, with an estimated Walk Score around 60, Transit Score near 35, and Bike Score around 55, reflecting car-optional access for daily needs.'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Local Area</div>
          <div class="section-content">
            <p>${getFieldValue(sections, 'local-area-description') || 'The neighborhood is a mature urban district with a mix of single-family homes, small multi-unit buildings, and local businesses. Residents are close to grocery, cafes, and parks, with recreation and services clustered nearby.'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Nearby Schools</div>
          <ul class="bullet-list">
            ${getFieldValue(sections, 'nearby-schools') || '<li>Local Elementary School (K-7, public)</li><li>Local High School (Grades 10-12, public)</li>'}
          </ul>
        </div>
      </div>

      <div class="footer">
        <div class="footer-left">17   ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 23: Site Details
 * Fields: 22 fields including site-intro-text, property-address-full, legal-description,
 * site-area-sqft, site-topography, site-shape, municipal-services, etc.
 */
export function renderPage23(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-23">
      <h1>Property Analysis</h1>

      <h2>Site Details</h2>

      <p class="intro-text">
        ${getFieldValue(sections, 'site-intro-text') || 'The subject property consists of one parcel with a total site area of ' + getFieldValue(sections, 'site-area-sqft') + ' SF (' + getFieldValue(sections, 'site-area-acres') + ' AC) which is based on information obtained from ICS. For the purposes of this report, we have relied on this site area and reserve the right to amend our analysis upon receipt of a formal legal plan.'}
      </p>

      <table class="details-table">
        <tr class="data-row">
          <td class="label-cell">Address</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Legal Description</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'legal-description')}</td>
        </tr>
        <tr class="header-row">
          <td class="label-cell"></td>
          <td style="text-align: center; font-weight: 600;">Square Feet</td>
          <td style="text-align: center; font-weight: 600;">Acres</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Economic Unit (Primary) Site Size</td>
          <td class="numeric-cell">${getFieldValue(sections, 'site-area-sqft')}</td>
          <td class="numeric-cell">${getFieldValue(sections, 'site-area-acres')}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Usable Site Size</td>
          <td class="numeric-cell">${getFieldValue(sections, 'usable-site-sqft') || getFieldValue(sections, 'site-area-sqft')}</td>
          <td class="numeric-cell">${getFieldValue(sections, 'usable-site-acres') || getFieldValue(sections, 'site-area-acres')}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Total Land Area</td>
          <td class="numeric-cell">${getFieldValue(sections, 'site-area-sqft')}</td>
          <td class="numeric-cell">${getFieldValue(sections, 'site-area-acres')}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Excess/Surplus Land</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'excess-surplus-land') || 'No'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Corner</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-corner') || 'No'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Site Topography</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-topography') || 'Level'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Site Shape</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-shape') || 'Rectangular'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Site Grade</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-grade') || 'At street grade'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Site Quality</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-quality') || 'Average'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Site Access</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-access') || 'Average'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Site Exposure</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-exposure') || 'Average'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Site Utility</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'site-utility') || 'Average'}</td>
        </tr>
        <tr class="data-row">
          <td class="label-cell">Municipal Services</td>
          <td class="value-cell" colspan="2">${getFieldValue(sections, 'municipal-services') || 'Full Municipal Services'}</td>
        </tr>
      </table>

      <div class="adjacent-properties">
        <strong>Adjacent Properties</strong>
        <div>
          North: ${getFieldValue(sections, 'adjacent-north') || 'Residential'}<br>
          South: ${getFieldValue(sections, 'adjacent-south') || 'Residential'}<br>
          East: ${getFieldValue(sections, 'adjacent-east') || 'Residential'}<br>
          West: ${getFieldValue(sections, 'adjacent-west') || 'Residential'}
        </div>
      </div>

      <p class="accessibility-note">
        <strong>Accessibility</strong> ${getFieldValue(sections, 'accessibility-note') || 'Access to the subject site is considered average overall.'}
      </p>

      <div class="footer">
        <div class="footer-left">18 &nbsp;&nbsp;&nbsp; ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 24: Access & Frontage / Traffic Analysis
 * Fields: frontage-description, traffic-count-data, visibility-rating
 */
export function renderPage24(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-24">
      <div class="section-title">Property Analysis</div>

      <div class="subsection-header">Access & Frontage</div>

      <div class="improvements-section">
        <div class="improvements-label">Street Improvements</div>
        <table>
          <thead>
            <tr>
              <th style="width: 20%;">Street</th>
              <th style="width: 18%;">Type</th>
              <th style="width: 12%;">Direction</th>
              <th style="width: 8%;">Lanes</th>
              <th style="width: 8%; text-align: center;">Lit</th>
              <th style="width: 8%; text-align: center;">Curb</th>
              <th style="width: 8%; text-align: center;">Gutter</th>
              <th style="width: 10%; text-align: center;">Sidewalk</th>
              <th style="width: 10%; text-align: center;">Parking</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${getFieldValue(sections, 'frontage-street-1') || '109 Street'}</td>
              <td>${getFieldValue(sections, 'street-1-type') || 'Minor arterial'}</td>
              <td>Two-Way</td>
              <td class="centered-text">${getFieldValue(sections, 'street-1-lanes') || '2'}</td>
              <td class="centered-text">x</td>
              <td class="centered-text">x</td>
              <td class="centered-text">x</td>
              <td class="centered-text"></td>
              <td class="centered-text"></td>
            </tr>
            <tr>
              <td>${getFieldValue(sections, 'frontage-street-2') || '11 Avenue'}</td>
              <td>${getFieldValue(sections, 'street-2-type') || 'Minor arterial'}</td>
              <td>Two-Way</td>
              <td class="centered-text">${getFieldValue(sections, 'street-2-lanes') || '4'}</td>
              <td class="centered-text">x</td>
              <td class="centered-text">x</td>
              <td class="centered-text">x</td>
              <td class="centered-text">x</td>
              <td class="centered-text"></td>
            </tr>
          </tbody>
        </table>

        <div class="improvements-label">Frontage</div>
        <table>
          <thead>
            <tr>
              <th style="width: 33%;">Street</th>
              <th style="width: 33%;">Distance</th>
              <th style="width: 33%;"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${getFieldValue(sections, 'frontage-street-1') || '109 Street'}</td>
              <td>${getFieldValue(sections, 'frontage-1-distance') || '200 feet'}</td>
              <td></td>
            </tr>
            <tr>
              <td>${getFieldValue(sections, 'frontage-street-2') || '11 Avenue'}</td>
              <td>${getFieldValue(sections, 'frontage-2-distance') || '125 feet'}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="traffic-section">
        <div class="improvements-label">Traffic Counts</div>
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">Location</th>
              <th style="width: 25%;">Date</th>
              <th style="width: 25%;">Source</th>
              <th style="width: 25%;">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${getFieldValue(sections, 'frontage-street-1') || '109 Street'}</td>
              <td class="centered-text">${getFieldValue(sections, 'traffic-date') || 'N/A'}</td>
              <td class="centered-text">${getFieldValue(sections, 'traffic-source') || 'N/A'}</td>
              <td class="numeric">${getFieldValue(sections, 'traffic-count-1') || 'N/A'}</td>
            </tr>
            <tr>
              <td>${getFieldValue(sections, 'frontage-street-2') || '11 Avenue'}</td>
              <td class="centered-text">${getFieldValue(sections, 'traffic-date') || 'N/A'}</td>
              <td class="centered-text">${getFieldValue(sections, 'traffic-source') || 'N/A'}</td>
              <td class="numeric">${getFieldValue(sections, 'traffic-count-2') || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div class="footer-left">
          19 | ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}
        </div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 25: Continued Analysis Section
 * Fields: page-25-continuation
 */
export function renderPage25(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-25">
      <div class="page-content">
        <h1>Property Analysis</h1>

        <div class="section">
          <h2>Exposure & Visibility</h2>
          <p>${getFieldValue(sections, 'exposure-visibility') || 'Exposure of the subject is average noting frontage on ' + getFieldValue(sections, 'frontage-street-1') + ' & ' + getFieldValue(sections, 'frontage-street-2')}</p>
        </div>

        <div class="section">
          <h2>Easements</h2>
          <p>${getFieldValue(sections, 'easements-note') || 'A legal opinion regarding title information was not provided or commissioned in conjunction with this assignment. Under the scope of this appraisal, it is assumed that any legal notations and registered charges on the do not adversely affect the highest and best use of the subject property as described herein, unless otherwise noted. If there is any concern on the part of the reader with respect to the status of title, we recommend a legal opinion be obtained.'}</p>
        </div>

        <div class="section">
          <h2>Soils</h2>
          <p>${getFieldValue(sections, 'soils-note') || 'We have not undertaken a detailed soil analysis and we are not qualified to comment on soil conditions. As such, the soils are assumed to be similar to other lands in the area and suitable to drainage qualities and load bearing capacity to support the existing development.'}</p>
        </div>

        <div class="section">
          <h2>Hazardous Waste</h2>
          <p>${getFieldValue(sections, 'hazardous-waste-note') || 'Based on a review of the independent investigation to determine the presence or absence of toxins on the subject property, none are present. If questions arise, the reader is strongly cautioned to seek qualified professional assistance in this matter. Please see the Assumptions and Limiting Conditions for a full disclaimer.'}</p>
        </div>

        <div class="section">
          <h2>Site Rating</h2>
          <p>${getFieldValue(sections, 'site-rating') || 'Overall, the subject site is considered average as a multi-family site in terms of its location, exposure and access to employment, education and shopping centers, based on its location along a minor arterial.'}</p>
        </div>

        <div class="section">
          <h2>Site Conclusion</h2>
          <p>${getFieldValue(sections, 'site-conclusion') || 'In conclusion, the site\'s physical characteristics appear to be supportive of the subject\'s current use and there were no significant detriments discovered that would inhibit development in accordance with its highest and best use.'}</p>
        </div>
      </div>

      <div class="page-footer">
        <div class="footer-left">20&nbsp;&nbsp;&nbsp;&nbsp;${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 26: Site Plans - Lot 17
 * Fields: site-plan-lot-17-image, lot-17-dimensions, lot-17-adjacent-lots
 */
export function renderPage26(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-26">
      <div class="section-title">Property Analysis</div>

      <div class="subsection-title">Site Plans - Lot 17</div>

      <div class="diagram-container">
        <div class="image-placeholder">
          ${getImageUrl(sections, 'site-plan-lot-17-image') || '[SITE PLAN: Lot 17 property diagram showing subject property with boundary lines, adjacent lot numbers, and dimensions]'}
        </div>
      </div>

      <div class="footer">
        <div class="footer-left">21     ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 27: Site Plans - Lot 18
 * Fields: site-plan-lot-18-image, lot-18-dimensions
 */
export function renderPage27(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-27">
      <div class="section-title">Property Analysis</div>

      <div class="subsection-title">Site Plans - Lot 18</div>

      <div class="image-placeholder">
        ${getImageUrl(sections, 'site-plan-lot-18-image') || '[MAP: Property site plan showing Lot 18 with cadastral references, property boundaries, and subject property outlined with dimensions]'}
      </div>

      <div class="footer">
        <div class="footer-left">
          <span>22</span>
          <span>${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</span>
        </div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 28: Improvements Analysis
 * Fields: improvements-summary, building-description
 */
export function renderPage28(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-28">
      <div class="page-content">
        <div class="main-content">
          <h1>Property Analysis</h1>

          <div class="section-title">Property Taxes & Assessment</div>

          <div class="subsection-title">Real Estate Taxes</div>
          <p>The subject's assessment and taxes are shown in the following table:</p>

          <table>
            <thead>
              <tr>
                <th>YEAR</th>
                <th>TOTAL ASSESSMENT VALUE</th>
                <th>TAX RATE</th>
                <th>TAXES</th>
                <th>TAXES/SF</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${getFieldValue(sections, 'tax-year') || '2025'}</td>
                <td>$${getFieldValue(sections, 'assessed-value') || getFieldValue(sections, 'calc-assessed-value')}</td>
                <td>${getFieldValue(sections, 'tax-rate') || '0.21757'}</td>
                <td>$${getFieldValue(sections, 'annual-taxes') || getFieldValue(sections, 'calc-real-estate-taxes')}</td>
                <td>$${getFieldValue(sections, 'taxes-per-sf') || getFieldValue(sections, 'calc-taxes-per-sf')}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Taxation & Assessment Commentary</div>

          <div class="commentary">
            <p class="commentary-text">${getFieldValue(sections, 'tax-assessment-commentary') || 'The assessed value is below the value concluded here, a tax assessment appeal is not warranted.'}</p>

            <p class="commentary-text">${getFieldValue(sections, 'tax-assessment-note') || 'The assessed value is lower than our valuation herein. Smaller markets tend to under assess real property assets in comparison to larger markets.'}</p>
          </div>
        </div>

        <div class="page-footer">
          <div class="page-number">23 | ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
          <div class="footer-accent"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Page 29: Land Use & Zoning
 * Fields: zoning-classification, zoning-description, land-use-conformity, highest-best-use
 */
export function renderPage29(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-29">
      <div class="page-content">
        <div class="main-content">
          <h1 class="section-title">Property Analysis</h1>

          <h2 class="subsection-title">Land Use & Planning</h2>

          <p>The subject is located in the ${getFieldValue(sections, 'zoning-classification') || 'Low Density Residential District (R2)'} zoning area which is a ${getFieldValue(sections, 'zoning-district-type') || 'Low Density Residential District'}.</p>

          <div class="zoning-table-header">ZONING</div>

          <table class="zoning-table">
            <tr>
              <td>Designation</td>
              <td>${getFieldValue(sections, 'zoning-classification') || 'Low Density Residential District (R2)'}</td>
            </tr>
            <tr>
              <td>Zoning Authority</td>
              <td>City of ${getFieldValue(sections, 'property-city')}</td>
            </tr>
            <tr>
              <td>Permitted Uses</td>
              <td>${getFieldValue(sections, 'zoning-permitted-uses') || 'Low and medium density residential'}</td>
            </tr>
            <tr>
              <td>Current Use</td>
              <td>${getFieldValue(sections, 'property-type') || 'Walkup'}</td>
            </tr>
            <tr>
              <td>Current Use Legally Permitted</td>
              <td>${getFieldValue(sections, 'use-legally-permitted') || 'Yes'}</td>
            </tr>
            <tr>
              <td>Conforming Use</td>
              <td>${getFieldValue(sections, 'conforming-use') || 'The bulk of the improvements as well as the parking conform to the requirements'}</td>
            </tr>
            <tr>
              <td>Conforming Lot</td>
              <td>${getFieldValue(sections, 'conforming-lot') || 'The bulk of the improvements as well as the parking conform to the requirements'}</td>
            </tr>
            <tr>
              <td>Zoning Change</td>
              <td>${getFieldValue(sections, 'zoning-change') || 'No'}</td>
            </tr>
          </table>

          <h2 class="subsection-title">Zoning Conclusion</h2>

          <p>${getFieldValue(sections, 'zoning-conclusion') || 'The current use for the subject property is walkup and is a permitted use based on the current zoning guidelines. No zoning change is believed to be imminent. Based on the foregoing, it appears that the subject\'s improvements are a legally conforming use of the subject site.'}</p>
        </div>

        <div class="footer">
          <div class="footer-left">24    ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
          <div class="footer-right"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Page 30: Zoning Map
 * Fields: zoning-map-image, zoning-districts
 */
export function renderPage30(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-30">
      <div class="section-title">Property Analysis</div>

      <div class="map-title">Zoning Map</div>

      <div class="image-placeholder">
        ${getImageUrl(sections, 'zoning-map-image') || '[MAP: Zoning/cadastral map of ' + getFieldValue(sections, 'property-city') + ' showing property parcels with zoning designations (R2, R3, R1, etc.) and marked areas of interest]'}
      </div>

      <div class="footer">
        <div class="footer-left">25   ${getFieldValue(sections, 'property-address-line1')}, ${getFieldValue(sections, 'property-city')}, ${getFieldValue(sections, 'property-province')} | File ${getFieldValue(sections, 'file-number')}</div>
        <div class="footer-right"></div>
      </div>
    </div>
  `;
}

/**
 * Page 31: Property Analysis - Description of Improvements
 * Fields: improvements-description (boilerplate text)
 */
export function renderPage31(sections: ReportSection[], valueScenarioType: string): string {
  const improvementsDesc = getFieldValue(sections, 'improvements-description') || 'The subject property is an improved multi-family residential property. The improvements have been inspected and are described in this section.';

  return `
    <div class="page page-31" style="font-family: Arial, sans-serif; padding: 40px 36px; position: relative; min-height: 11in;">
      <div class="page-content">
        <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 8px; letter-spacing: 0.5px;">Property Analysis</h2>

        <h3 style="font-size: 12px; font-weight: bold; color: #003d7a; margin-bottom: 12px;">Description of Improvements</h3>

        <p style="font-size: 11px; line-height: 1.6; margin-bottom: 16px; text-align: justify;">${improvementsDesc}</p>

        <p style="font-size: 11px; line-height: 1.6; margin-bottom: 16px; text-align: justify;">The improvements were inspected as part of this appraisal assignment. The building features and physical characteristics are summarized in the following pages.</p>
      </div>

      <div class="footer" style="position: absolute; bottom: 30px; left: 36px; right: 36px; border-top: 1px solid #d0d0d0; padding-top: 10px; font-size: 9px; color: #666; display: flex; justify-content: space-between; align-items: center;">
        <span>26 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="width: 60px; height: 20px; background: linear-gradient(90deg, #5ba3d0 0%, #1a3a52 100%);"></div>
      </div>
    </div>
  `;
}

/**
 * Page 32: Property Analysis - Unit Breakdown
 * Fields: unit-mix-table (tabular data)
 */
export function renderPage32(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-32" style="font-family: Arial, Helvetica, sans-serif; padding: 40px 36px; position: relative; min-height: 11in;">
      <div class="page-content">
        <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 8px; letter-spacing: 0.5px;">Property Analysis</h2>

        <table style="width: 100%; border-collapse: collapse; font-size: 10px; line-height: 1.4;">
          <thead style="background-color: #1a3a52; color: white;">
            <tr>
              <th style="padding: 10px 8px; text-align: left; font-weight: bold; border: 1px solid #1a3a52; font-size: 10px;">TYPE</th>
              <th style="padding: 10px 8px; text-align: left; font-weight: bold; border: 1px solid #1a3a52; font-size: 10px;">DESCRIPTION</th>
              <th style="padding: 10px 8px; text-align: right; font-weight: bold; border: 1px solid #1a3a52; font-size: 10px;">UNIT DETAIL<br>UNITS</th>
              <th style="padding: 10px 8px; text-align: right; font-weight: bold; border: 1px solid #1a3a52; font-size: 10px;">% TOT</th>
              <th style="padding: 10px 8px; text-align: right; font-weight: bold; border: 1px solid #1a3a52; font-size: 10px;">SIZE</th>
              <th style="padding: 10px 8px; text-align: right; font-weight: bold; border: 1px solid #1a3a52; font-size: 10px;">NRA<br>SF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fafafa;">Flat 1 Bed / 1 Bath</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fafafa;">One Bed/One Bath</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fafafa; text-align: right; font-family: 'Courier New', monospace;">4</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fafafa; text-align: right; font-family: 'Courier New', monospace;">25%</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fafafa; text-align: right; font-family: 'Courier New', monospace;">550</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fafafa; text-align: right; font-family: 'Courier New', monospace;">2,200</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fff;">Flat 2 Bed / 1 Bath</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fff;">Two Bed/One Bath</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fff; text-align: right; font-family: 'Courier New', monospace;">12</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fff; text-align: right; font-family: 'Courier New', monospace;">75%</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fff; text-align: right; font-family: 'Courier New', monospace;">667</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; background: #fff; text-align: right; font-family: 'Courier New', monospace;">8,004</td>
            </tr>
            <tr style="font-weight: bold; background: #f5f5f5; border-top: 1px solid #999;">
              <td colspan="2" style="padding: 8px; border: 1px solid #d0d0d0;">TOTAL / AVERAGE</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">16</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">100%</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">638</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">10,204</td>
            </tr>
            <tr style="font-weight: bold; background: #f5f5f5;">
              <td colspan="2" style="padding: 8px; border: 1px solid #d0d0d0;">NET RENTABLE AREA</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">16</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right;"></td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">638</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">10,204</td>
            </tr>
            <tr style="font-weight: bold; background: #f5f5f5;">
              <td colspan="2" style="padding: 8px; border: 1px solid #d0d0d0;">GROSS BUILDING AREA</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">16</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right;"></td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">638</td>
              <td style="padding: 8px; border: 1px solid #d0d0d0; text-align: right; font-family: 'Courier New', monospace;">10,204</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer" style="position: absolute; bottom: 30px; left: 36px; right: 36px; border-top: 1px solid #d0d0d0; padding-top: 10px; font-size: 9px; color: #666; display: flex; justify-content: space-between; align-items: center;">
        <span>27 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="width: 60px; height: 20px; background: linear-gradient(90deg, #5ba3d0 0%, #1a3a52 100%);"></div>
      </div>
    </div>
  `;
}

/**
 * Page 33: Property Analysis - Building Description
 * Fields: building-description-table (component/description pairs)
 */
export function renderPage33(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-33" style="font-family: Arial, sans-serif; padding: 48px 36px; position: relative; min-height: 11in; color: #333; line-height: 1.4;">
      <div class="section-title" style="font-size: 14px; font-weight: bold; margin-bottom: 4px; color: #000; border-bottom: 1px solid #000; padding-bottom: 4px;">Property Analysis</div>

      <div class="subsection-title" style="font-size: 12px; font-weight: bold; color: #003d7a; margin-top: 12px; margin-bottom: 8px;">Building Description</div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px;">
        <thead style="background-color: #003d7a; color: white;">
          <tr>
            <th style="padding: 8px; text-align: left; font-weight: bold; font-size: 11px;">COMPONENT</th>
            <th style="padding: 8px; text-align: left; font-weight: bold; font-size: 11px;">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; width: 20%; background-color: #f0f0f0;">Project Amenities</td><td style="padding: 6px 8px; border: 1px solid #ddd; width: 80%;">Guest Parking</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Unit Amenities</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Deck/Patio, Range/Stove, Refrigerator</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Laundry</td><td style="padding: 6px 8px; border: 1px solid #ddd;">On Site</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Security Features</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Deadbolts, Exterior Lighting, Secured Entry</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Foundation</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Concrete footings and walls;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Exterior Walls/Framing</td><td style="padding: 6px 8px; border: 1px solid #ddd;">1121 - Brick, 1101 Stucco/Wood frame;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Roof</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Flat built up membrane;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Elevator</td><td style="padding: 6px 8px; border: 1px solid #ddd;">None;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Heating & AC (HVAC)</td><td style="padding: 6px 8px; border: 1px solid #ddd;">1101 - 8 Furnaces, 1121 - Boilers with baseboard radiant heat;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Insulation</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Fiberglass;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Lighting</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Various;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Electrical</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Individually metered;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Interior Walls</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Painted drywall;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Doors and Windows</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Wood interior & metal exterior doors/Vinyl or metal frame double pane glazing;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Ceilings</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Textured drywall;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Plumbing</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Standard;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Floor Covering</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Combination of carpet, tile, vinyl tile and laminate hard wood;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Fire Protection</td><td style="padding: 6px 8px; border: 1px solid #ddd;">None;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Interior Finish/Build-Out</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Standard rental finishes;</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Site Improvements</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Gravel parking, sidewalks, and curbs;</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Landscaping</td><td style="padding: 6px 8px; border: 1px solid #ddd;">Landscaping around the building perimeter to consist of shrubs and trees. The landscaping as proposed is well established and well maintained.</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Parking</td><td style="padding: 6px 8px; border: 1px solid #ddd;">The subject provides 18 parking spaces and is therefore conforming to zoning requirements. The parking ratio of 1.1 per unit is within the typical range of 0.75-1.25 spaces per unit.</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Site Coverage Ratio</td><td style="padding: 6px 8px; border: 1px solid #ddd;">12.9% (3,138 SF footprint / 24,400 SF site), which is within market standards (20-35%) for similar walkup buildings in the area.</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Functional Design</td><td style="padding: 6px 8px; border: 1px solid #ddd;">The building features a functional Walkup design with typical site coverage and adequate off-street parking.</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f0f0f0;">Hazardous Materials</td><td style="padding: 6px 8px; border: 1px solid #ddd;">A Phase I report was not provided. This appraisal assumes that the improvements are constructed free of all hazardous waste and toxic substances.</td></tr>
        </tbody>
      </table>

      <div class="footer" style="position: absolute; bottom: 30px; left: 36px; right: 36px; font-size: 10px; color: #666; display: flex; justify-content: space-between; align-items: center;">
        <span>28 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="width: 60px; height: 20px; background: linear-gradient(to right, #4da6ff, #0066cc); border-radius: 3px;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 34: Property Analysis - Continuation (Hazardous Materials)
 * Fields: hazardous-materials-disclaimer
 */
export function renderPage34(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-34" style="font-family: 'Calibri', 'Segoe UI', sans-serif; padding: 40px 40px 80px 40px; position: relative; min-height: 11in;">
      <h1 style="font-size: 16px; font-weight: bold; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #000; letter-spacing: 0.5px;">Property Analysis</h1>

      <p style="font-size: 11px; line-height: 1.6; color: #333; text-align: justify; margin-bottom: 12px;">materials, including (but not limited to) unseen asbestos and mold. Please refer to the Assumptions and Limiting Conditions section regarding this issue.</p>

      <div class="footer" style="position: absolute; bottom: 20px; left: 40px; right: 40px; height: 60px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e0e0e0;">
        <span style="font-size: 10px; color: #666;">29 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="width: 120px; height: 20px; background: linear-gradient(to right, #5a9fd4, #1e3a5f); border-radius: 10px 0 0 0;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 35: Market Context - Economic Overviews (National)
 * Fields: national-economic-overview, canada-economic-indicators-table
 */
export function renderPage35(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-35" style="font-family: 'Calibri', Arial, sans-serif; font-size: 11px; color: #333333; line-height: 1.4; padding: 36px; position: relative; min-height: 11in;">
      <h1 style="font-size: 18px; font-weight: bold; color: #1a1a1a; margin-bottom: 8px;">Market Context</h1>

      <h2 style="font-size: 12px; font-weight: bold; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #2563eb; padding-bottom: 4px; margin-bottom: 12px;">Economic Overviews</h2>

      <h3 style="font-size: 12px; font-weight: bold; color: #1a1a1a; margin-top: 12px; margin-bottom: 8px;">National</h3>

      <p style="font-size: 11px; line-height: 1.5; margin-bottom: 12px; text-align: justify; color: #333333;">Canada's economy in 2025 finds itself in a delicate balance: modest growth, contained inflation, but significant uncertainty from external trade and global energy markets. The Bank of Canada expects real GDP growth to recover toward 1.8% in 2025-2026, after a softer 2024. Inflation is projected to remain close to the 2% target, aided by moderating rent inflation and easing supply pressures. On the positive side, residential investment and housing construction are expected to lead growth, supported by tight rate cuts, pent-up demand, and government incentives for rental construction. Meanwhile, energy and export infrastructure especially pipeline capacity and LNG projects could provide a lift to Canadian exports. However, the risk of U.S. tariffs and a weakening labour market looms as a drag. In sum, Canada's 2025 is expected to be a moderating year, with growth stabilizing, inflation under control, and selective pockets of strength in housing, energy, and exports.</p>

      <div style="font-size: 11px; font-weight: bold; background-color: #1a3a52; color: white; padding: 6px 8px; margin-bottom: 0; margin-top: 12px;">Canada Economic Indicators</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 12px; line-height: 1.3;">
        <thead style="background-color: #e8e8e8;">
          <tr>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border: 1px solid #cccccc;">Indicator</th>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border: 1px solid #cccccc;">Estimate</th>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border: 1px solid #cccccc;">Commentary</th>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border: 1px solid #cccccc;">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #f9f9f9;"><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Population (2025)</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">41.8 million</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Population distribution historic, primarily via immigration growth</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Statistics Canada</td></tr>
          <tr><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Population Growth Rate</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">1.0-1.8%</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Growth slower than historical rates</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Statistics Canada</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Unemployment Rate (2025 YTD)</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">6.1%</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Labour markets have declined; job gains moderate</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Labour Force Survey</td></tr>
          <tr><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Real GDP Growth (YoY)</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">1.8%</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Moderate recovery projected</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Bank of Canada</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Inflation (YoY)</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">2.1%</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Inflation near target; pressures easing</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Bank of Canada</td></tr>
          <tr><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Housing Starts</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">6% growth</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Leading sector with stimulus support</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Bank of Canada</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Energy Benchmark WTI</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">USD 70-80/bbl</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Key driver for trade and income</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Market data</td></tr>
          <tr><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Natural Gas (AECO)</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">CAD 2-3$/GJ</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Normalized after 2022; LNG may firm demand</td><td style="padding: 5px 4px; border: 1px solid #e0e0e0;">Energy market</td></tr>
        </tbody>
      </table>

      <div class="footer" style="position: absolute; bottom: 24px; left: 36px; right: 36px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #666666; border-top: 1px solid #e0e0e0; padding-top: 6px;">
        <span>30 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="background: linear-gradient(90deg, #87ceeb 0%, #1a3a52 100%); width: 60px; height: 20px;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 36: Market Context - Provincial (Saskatchewan)
 * Fields: provincial-economic-overview, saskatchewan-economic-indicators-table
 */
export function renderPage36(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-36" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; padding: 36px; position: relative; min-height: 11in;">
      <h1 style="font-size: 18px; font-weight: bold; color: #000; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #333;">Market Context</h1>

      <h2 style="font-size: 14px; font-weight: bold; color: #003d7a; margin-top: 16px; margin-bottom: 12px;">Provincial</h2>

      <p style="font-size: 11px; line-height: 1.5; margin-bottom: 16px; text-align: justify;">Saskatchewan's economy in 2025 is defined by steady growth, strong resource activity, and an improving housing sector. Real GDP is expanding at a moderate pace, supported by agriculture, potash, and oil production, while inflation has cooled to below 2%, easing cost pressures on households. Investment conditions remain relatively solid, with unemployment near 5.5-6%, and consumer demand is buoyed by wage gains and population growth. Housing starts have surged, reflecting confidence in residential markets and rising construction momentum. On the investment front, resource projects and infrastructure spending provide additional stability, and the province maintains a solid AA credit rating with a balanced budget outlook. Risks remain tied to commodity markets, especially oil prices and global agricultural demand, along with challenges in attracting and retaining skilled labour.</p>

      <div style="font-size: 11px; font-weight: bold; color: #000; margin-top: 16px; margin-bottom: 8px;">Saskatchewan Economic Indicators</div>

      <table style="width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 24px;">
        <thead style="background-color: #f5f5f5;">
          <tr>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border-bottom: 1px solid #ccc;">Indicator</th>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border-bottom: 1px solid #ccc;">Estimate</th>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border-bottom: 1px solid #ccc;">Commentary</th>
            <th style="padding: 6px 4px; text-align: left; font-weight: bold; border-bottom: 1px solid #ccc;">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Population (Apr 2025)</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">1,230,596</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Steady population growth YoY</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Statistics Bureau</td></tr>
          <tr style="background-color: #fafafa;"><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Population Growth Rate</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">1.3%</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Moderate steady growth</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Statistics Canada</td></tr>
          <tr><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Unemployment Rate (2025)</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">5.6%</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Stable labour market; below national avg</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Labour Force Survey</td></tr>
          <tr style="background-color: #fafafa;"><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Total GDP</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">CAD 85.3B</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Solid resource-driven economy</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Government of SK</td></tr>
          <tr><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">GDP/capita</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">$69,000</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Top-tier provincial economy</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Statistics Canada</td></tr>
          <tr style="background-color: #fafafa;"><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Housing Starts</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">5,800 units</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">Strong construction activity</td><td style="padding: 5px 4px; border-bottom: 1px solid #eee;">CMHC</td></tr>
        </tbody>
      </table>

      <div class="footer" style="position: absolute; bottom: 24px; left: 36px; right: 36px; font-size: 9px; color: #666; border-top: 1px solid #ccc; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
        <span>31 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="width: 80px; height: 20px; background-color: #d0e8f2; border-left: 4px solid #003d7a;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 37: Market Context - Multi-Family Market Overview (Saskatchewan)
 * Fields: multifamily-market-overview, saskatchewan-multifamily-indicators-table
 */
export function renderPage37(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-37" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; padding: 54px 54px; position: relative; min-height: 11in;">
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px; color: #000; border-bottom: 2px solid #000; padding-bottom: 8px;">Market Context</div>
      <div style="font-size: 13px; font-weight: bold; color: #003d6b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Multi-Family Market Overview</div>

      <div style="font-size: 14px; font-weight: bold; color: #003d6b; margin-bottom: 12px;">Saskatchewan</div>

      <p style="font-size: 11px; line-height: 1.5; margin-bottom: 16px; color: #333;">Saskatchewan's rental markets entered 2025 with improving balance. Vacancy rates approached 3%, reflecting steady new completions and a cooling influx of migrants. Rents plateaued after outsized 2023-24 gains, with most urban landlords holding rates or offering small concessions. Construction activity remains healthy, supported by government and CMHC financing programs. Affordability remains better than the national average, yet rents signal growing strain among lower-income tenants.</p>

      <div style="font-size: 12px; font-weight: bold; background: #003d6b; color: white; padding: 6px 8px; margin-bottom: 0; text-transform: uppercase;">Saskatchewan Multifamily Indicators</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 10px;">
        <thead style="background: #e8e8e8;">
          <tr>
            <th style="padding: 6px 8px; text-align: left; font-weight: bold; border: 1px solid #ccc;">INDICATOR</th>
            <th style="padding: 6px 8px; text-align: left; font-weight: bold; border: 1px solid #ccc;">ESTIMATE</th>
            <th style="padding: 6px 8px; text-align: left; font-weight: bold; border: 1px solid #ccc;">COMMENTARY</th>
            <th style="padding: 6px 8px; text-align: left; font-weight: bold; border: 1px solid #ccc;">SOURCE</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 6px 8px; border: 1px solid #ccc;">Vacancy Rate</td><td style="padding: 6px 8px; border: 1px solid #ccc;">3.0%</td><td style="padding: 6px 8px; border: 1px solid #ccc;">Near equilibrium with moderate rent growth</td><td style="padding: 6px 8px; border: 1px solid #ccc;">CMHC</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ccc;">Avg Rent - Bachelor</td><td style="padding: 6px 8px; border: 1px solid #ccc;">$851</td><td style="padding: 6px 8px; border: 1px solid #ccc;">Rents stabilizing</td><td style="padding: 6px 8px; border: 1px solid #ccc;">CMHC</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ccc;">Avg Rent - 1 Bed</td><td style="padding: 6px 8px; border: 1px solid #ccc;">$1,168</td><td style="padding: 6px 8px; border: 1px solid #ccc;">Growth moderating</td><td style="padding: 6px 8px; border: 1px solid #ccc;">CMHC</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ccc;">Avg Rent - 2 Bed</td><td style="padding: 6px 8px; border: 1px solid #ccc;">$1,398</td><td style="padding: 6px 8px; border: 1px solid #ccc;">Family units in demand</td><td style="padding: 6px 8px; border: 1px solid #ccc;">CMHC</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ccc;">Rental Rate Growth</td><td style="padding: 6px 8px; border: 1px solid #ccc;">+2.5% YoY</td><td style="padding: 6px 8px; border: 1px solid #ccc;">Moderating from 2024 highs</td><td style="padding: 6px 8px; border: 1px solid #ccc;">CMHC</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 6px 8px; border: 1px solid #ccc;">New Supply</td><td style="padding: 6px 8px; border: 1px solid #ccc;">+1,200 units YoY</td><td style="padding: 6px 8px; border: 1px solid #ccc;">Steady development pipeline</td><td style="padding: 6px 8px; border: 1px solid #ccc;">CMHC</td></tr>
          <tr><td style="padding: 6px 8px; border: 1px solid #ccc;">Supply Growth Ratio</td><td style="padding: 6px 8px; border: 1px solid #ccc;">+3.8% YoY</td><td style="padding: 6px 8px; border: 1px solid #ccc;">Construction outpacing demand</td><td style="padding: 6px 8px; border: 1px solid #ccc;">CMHC</td></tr>
        </tbody>
      </table>

      <div class="footer" style="position: absolute; bottom: 24px; left: 54px; right: 54px; padding-top: 8px; font-size: 9px; color: #666;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>32 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
          <div style="width: 60px; height: 20px; background: #003d6b;"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Page 38: Valuation & Conclusions - Highest & Best Use
 * Fields: hbu-introduction, hbu-as-vacant-analysis, legally-permissible, physically-possible, financial-feasibility, maximum-productivity
 */
export function renderPage38(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-38" style="font-family: 'Calibri', 'Segoe UI', sans-serif; line-height: 1.6; color: #333; padding: 36px; position: relative; min-height: 11in;">
      <div style="border-bottom: 3px solid #003f7f; padding-bottom: 8px; margin-bottom: 20px;">
        <div style="font-size: 18px; font-weight: bold; color: #003f7f; letter-spacing: 0.5px;">Valuation & Conclusions</div>
      </div>

      <div style="font-size: 14px; font-weight: bold; color: #003f7f; margin-top: 16px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Highest & Best Use</div>

      <div style="font-size: 12px; font-weight: bold; color: #003f7f; margin-top: 14px; margin-bottom: 8px;">Introduction</div>
      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">The highest and best use of a property is defined as the legally permissible, physically possible, financially feasible, and maximally productive use that results in the highest value. This analysis serves as the foundation for the valuation process and determines the most reasonable and profitable use of the property to support its maximum present value.</p>

      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">The analysis is completed through the following four steps:</p>

      <ul style="margin-left: 20px; margin-bottom: 12px; font-size: 11px; line-height: 1.65;">
        <li>Step 1: Highest and Best Use as Vacant</li>
        <li>Step 2: Determination of Ideal Improvements</li>
        <li>Step 3: Highest and Best Use as Proposed</li>
        <li>Step 4: Final Conclusion</li>
      </ul>

      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">This section develops the highest and best use of the subject property As Though Vacant and As Improved.</p>

      <div style="font-size: 12px; font-weight: bold; color: #003f7f; margin-top: 14px; margin-bottom: 8px;">As Though Vacant Analysis</div>
      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">In this section the highest and best use of the subject as though vacant is concluded after taking into consideration financial feasibility, maximal productivity, marketability, legal, and physical factors.</p>

      <div style="font-size: 12px; font-weight: bold; color: #003f7f; margin-top: 14px; margin-bottom: 8px;">Legally Permissible</div>
      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">Private restrictions, zoning, building codes, historic district controls, and environmental regulations are considered. The legal factors influencing the highest and best use of the subject site are primarily government regulations such as zoning ordinances. Permitted uses of the subject's Low Density Residential District (R2) zoning include low and medium density residential. A zoning change is not likely, therefore, uses outside of those permitted by the R2 zoning are not considered moving forward in the as though vacant analysis.</p>

      <div style="font-size: 12px; font-weight: bold; color: #003f7f; margin-top: 14px; margin-bottom: 8px;">Physically Possible</div>
      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">An evaluation of what is physically possible for the subject site considers physical and locational characteristics that influence its highest and best use. In terms of physical features, the subject site totals 0.5601 acres (24,400 SF). It is rectangular in shape and has a level topography. The site has average exposure and average overall access. There are no physical limitations that would prohibit development of any of the by-right uses on the site.</p>

      <div style="font-size: 12px; font-weight: bold; color: #003f7f; margin-top: 14px; margin-bottom: 8px;">Financial Feasibility</div>
      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">Based on the analysis of the subject's market and an examination of costs and investment metrics and real estate market attributes, a multifamily building would likely have a value commensurate with its costs and requisite developer's profit.</p>

      <div style="font-size: 12px; font-weight: bold; color: #003f7f; margin-top: 14px; margin-bottom: 8px;">Maximum Productivity</div>
      <p style="font-size: 11px; line-height: 1.65; margin-bottom: 12px; text-align: justify;">There is only one use that creates value and at the same time conforms to the requirements of the first three tests. Financial feasibility, maximal productivity, marketability, legal, and physical factors have been considered and the highest and best use of the subject site as though vacant is concluded to be a multifamily use.</p>

      <div style="position: absolute; bottom: 0; right: 0; width: 120px; height: 80px; background: linear-gradient(135deg, #b0d4e8 0%, #003f7f 100%); clip-path: polygon(100% 0, 100% 100%, 0 100%);"></div>

      <div style="position: absolute; bottom: 36px; left: 36px; right: 36px; font-size: 9px; color: #666; border-top: 1px solid #ccc; padding-top: 6px;">
        33 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}
      </div>
    </div>
  `;
}

/**
 * Page 39: Valuation & Conclusions - As Improved Analysis
 * Fields: as-improved-analysis, most-probable-buyer
 */
export function renderPage39(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-39" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; padding: 36px 40px; position: relative; min-height: 11in;">
      <h1 style="font-size: 18px; font-weight: 700; color: #000; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 3px solid #003d82; display: inline-block;">Valuation & Conclusions</h1>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #003d82; margin-top: 20px; margin-bottom: 12px;">As Improved Analysis</h2>
        <p style="font-size: 12px; line-height: 1.55; margin-bottom: 12px; text-align: justify;">The legal factors influencing the highest and best use of the subject property are primarily governmental regulations such as zoning and building codes. The subject improvements were constructed in 1970 (1970 weighted) and are a legal, conforming use. The physical and locational characteristics of the subject improvements have been previously discussed in this report. The project is of average quality construction and average condition, with adequate site coverage and parking ratios.</p>
        <p style="font-size: 12px; line-height: 1.55; margin-bottom: 12px; text-align: justify;">The five possible alternative treatments of the property are redevelopment/demolition (not warranted as the improvements contribute substantial value to the site), expansion (not applicable, no excess or surplus land), renovation (not warranted), conversion (not warranted), and continued use "as-is". Given the underlying market conditions and activity, it appears that the multifamily use as improved has sufficient degree of financial feasibility.</p>
        <p style="font-size: 12px; line-height: 1.55; margin-bottom: 12px; text-align: justify;">Among the five alternative uses, a continuation of the multifamily use is the Highest and Best Use of the subject As Improved.</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #003d82; margin-top: 20px; margin-bottom: 12px;">Most Probable Buyer</h2>
        <p style="font-size: 12px; line-height: 1.55; margin-bottom: 12px; text-align: justify;">Based on the type of property and the income generating potential of the improvements, it is our opinion that the most probable buyer for the subject would be a local or regional investor As Improved.</p>
      </div>

      <div style="position: absolute; bottom: 24px; left: 40px; right: 40px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <span style="font-size: 11px; color: #666;">34 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="width: 140px; height: 40px; background: linear-gradient(to right, #7ba5d4 0%, #003d82 100%); border-radius: 4px 0 0 0;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 40: Valuation Methodology
 * Fields: valuation-methodology-intro, land-valuation-text, cost-approach-text,
 * sales-comparison-text, income-capitalization-text
 */
export function renderPage40(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-40" style="font-family: 'Calibri', 'Segoe UI', sans-serif; line-height: 1.5; color: #000; padding: 40px 50px; position: relative; min-height: 11in;">
      <!-- Header -->
      <div style="margin-bottom: 30px; border-bottom: 2px solid #1a5490; padding-bottom: 10px;">
        <div style="font-size: 16px; font-weight: bold; color: #1a5490; letter-spacing: 0.5px;">Valuation & Conclusions</div>
      </div>

      <!-- Valuation Methodology Section -->
      <div style="font-size: 14px; font-weight: bold; color: #1a5490; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; margin-bottom: 12px;">Valuation Methodology</div>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 10px; text-align: justify; color: #333;">${getFieldValue(sections, 'valuation-methodology-intro') || 'In traditional valuation theory, the three approaches to estimating the value of an asset are the cost approach, sales comparison approach, and income capitalization approach. Each approach assumes valuation of the property at the property\'s highest and best use. From the indications of these analyses, an opinion of value is reached based upon expert judgment within the outline of the appraised process.'}</p>

      <!-- Land Valuation Subsection -->
      <div style="font-size: 13px; font-weight: bold; color: #1a5490; margin-top: 16px; margin-bottom: 10px;">Land Valuation</div>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 10px; text-align: justify; color: #333;">${getFieldValue(sections, 'land-valuation-text') || 'Characteristics specific to the subject property do not warrant that a site value is developed.'}</p>

      <!-- Cost Approach Subsection -->
      <div style="font-size: 13px; font-weight: bold; color: #1a5490; margin-top: 16px; margin-bottom: 10px;">Cost Approach</div>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 10px; text-align: justify; color: #333;">${getFieldValue(sections, 'cost-approach-text') || 'The cost approach considers the cost to replace the proposed improvements, less accrued depreciation, plus the market value of the land. The cost approach is based upon the understanding that purchasers give careful consideration to the cost to construct a replacement or substitution of improvements and do not depreciation in the structure from all causes. Profit for co-ordination by the entrepreneur is included in the value indication. Considering the limited applicability of this approach in relation to the subject property\'s characteristics, we have not undertaken the Cost Approach. The Cost Approach has limited applicability due to the age of the improvements and lack of market based data to support an estimate of accrued depreciation. Based on the preceding information, the Cost Approach has not been undertaken as part of this analysis.'}</p>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 10px; text-align: justify; color: #333;">Investors typically do not place emphasis on replacement cost in establishing value for investment properties. The exclusion of the Cost Approach does not diminish the credibility of the value conclusion.</p>

      <!-- Sales Comparison Approach Subsection -->
      <div style="font-size: 13px; font-weight: bold; color: #1a5490; margin-top: 16px; margin-bottom: 10px;">Sales Comparison Approach</div>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 10px; text-align: justify; color: #333;">${getFieldValue(sections, 'sales-comparison-text') || 'The sales comparison approach estimates value based on what other purchasers and sellers in the market have agreed to as price for comparable properties. This approach is based upon the principle of substitution, which states that the limit of price, rents, and rates tend to be set by the prevailing prices, terms, and price of equally desirable substitutes. In conducting the sales comparison approach, we gather data on reasonably substitutable properties and make adjustments for transactional and property characteristics. The resulting adjusted prices form a basis to an estimate of the price one might expect to realize upon sale of the property.'}</p>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 10px; text-align: justify; color: #333;">We have undertaken the Direct Comparison Approach as part of this assignment. Considering the applicability of this approach in relation to the subject property's characteristics, we consider the application of this approach to be warranted.</p>

      <!-- Income Capitalization Approach Subsection -->
      <div style="font-size: 13px; font-weight: bold; color: #1a5490; margin-top: 16px; margin-bottom: 10px;">Income Capitalization Approach</div>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 10px; text-align: justify; color: #333;">${getFieldValue(sections, 'income-capitalization-text') || 'The income capitalization approach ("income approach") simulates the reasoning of an investor who views the cash flows that would result from the anticipated revenue and expense of a property throughout its lifetime. The net income developed in our analysis is the balance of potential income remaining after vacancy and collection loss, and operating expenses. This net income is then capitalized at an appropriate rate to derive an estimate of value or discounted by an appropriate yield rate over a typical projection period in a discounted cash flow analysis. Thus, two key steps are involved: (1) estimating the net income applicable to the subject and (2) choosing appropriate capitalization rates and discount rates. The appropriate rates are not typically provided on an investment and return of the investment over the life of the particular property.'}</p>

      <!-- Footer -->
      <div style="position: absolute; bottom: 20px; left: 0; right: 0; height: 40px; background: linear-gradient(to right, transparent 0%, transparent 60%, #1a5490 60%, #1a5490 100%); display: flex; align-items: center; padding: 0 50px; font-size: 10px; color: #666;">
        <div style="flex: 1;">35 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</div>
      </div>
    </div>
  `;
}

/**
 * Page 41: Valuation & Conclusions - Approaches to Value
 * Fields: valuation-intro-text, correlation-conclusion-text, approaches-to-value-table
 */
export function renderPage41(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-41" style="font-family: 'Calibri', 'Segoe UI', sans-serif; line-height: 1.5; color: #1a1a1a; padding: 40px 40px 60px 40px; position: relative; min-height: 11in;">
      <!-- Header -->
      <h1 style="font-size: 16px; font-weight: bold; color: #1a1a1a; border-bottom: 3px solid #003d7a; padding-bottom: 8px; margin-bottom: 16px; letter-spacing: 0.5px;">Valuation & Conclusions</h1>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 12px; text-align: justify; color: #333;">${getFieldValue(sections, 'valuation-intro-text') || 'We have undertaken the Income Approach as part of this assignment. The subject property comprises an income generating asset and as such, we consider the inclusion of this approach warranted. In undertaking this approach, we have relied on the Direct Capitalization method only as the Discounted Cash Flow method does not contribute substantially to estimating the market value of the subject property beyond the Direct Capitalization method.'}</p>

      <!-- Correlation and Conclusion -->
      <h2 style="font-size: 14px; font-weight: bold; color: #1a1a1a; margin-top: 18px; margin-bottom: 12px;">Correlation and Conclusion</h2>

      <p style="font-size: 11px; line-height: 1.6; margin-bottom: 12px; text-align: justify; color: #333;">${getFieldValue(sections, 'correlation-conclusion-text') || 'Upon scope with the authorized client, the subject\'s specific characteristics and the interest appraised, this appraisal report will address the Direct Capitalization Approaches. The values presented represent the As Stabilized (Fee Simple Estate). This appraisal does not develop the Cost Approach, the impact of which is addressed in the reconciliation section.'}</p>

      <!-- Approaches to Value Table -->
      <div style="margin-top: 16px; margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: bold; color: white; background-color: #003d7a; padding: 10px 12px; margin-bottom: 0; letter-spacing: 0.5px;">APPROACHES TO VALUE APPLIED</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 0; font-size: 11px;">
          <thead>
            <tr>
              <th style="background-color: #e8f0f7; color: #1a1a1a; padding: 10px 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #003d7a; font-size: 10px; letter-spacing: 0.3px;">APPROACH</th>
              <th style="background-color: #e8f0f7; color: #1a1a1a; padding: 10px 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #003d7a; font-size: 10px; letter-spacing: 0.3px;">APPLICABILITY TO THE SUBJECT</th>
              <th style="background-color: #e8f0f7; color: #1a1a1a; padding: 10px 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #003d7a; font-size: 10px; letter-spacing: 0.3px;">USE IN ASSIGNMENT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ddd; vertical-align: top;">Cost Approach</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ddd; vertical-align: top;">${getFieldValue(sections, 'cost-approach-applicability') || 'Not Applicable'}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ddd; vertical-align: top;">${getFieldValue(sections, 'cost-approach-use') || 'No'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ddd; vertical-align: top;">Income Approach</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ddd; vertical-align: top;">${getFieldValue(sections, 'income-approach-applicability') || 'Applicable'}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ddd; vertical-align: top;">${getFieldValue(sections, 'income-approach-use') || 'Yes'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #999; vertical-align: top;">Sales Approach</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #999; vertical-align: top;">${getFieldValue(sections, 'sales-approach-applicability') || 'Applicable'}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #999; vertical-align: top;">${getFieldValue(sections, 'sales-approach-use') || 'Yes'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="position: absolute; bottom: 15px; left: 40px; font-size: 9px; color: #666;">36 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</div>
      <div style="position: absolute; bottom: 15px; right: 40px; width: 120px; height: 25px; background: linear-gradient(90deg, #e8f0f7 50%, #003d7a 50%); border-radius: 2px;"></div>
    </div>
  `;
}

/**
 * Page 42: Valuation & Conclusions - Income Approach
 * Fields: income-approach-overview, direct-capitalization-method, multifamily-revenue-analysis-intro,
 * subject-rent-roll-table, rent-roll-note, market-rent-survey-intro, unit-of-comparison-text,
 * selection-of-comparables-text, concessions-text
 */
export function renderPage42(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-42" style="font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.5; color: #333; padding: 0.5in; position: relative; min-height: 11in;">
      <!-- Header -->
      <div style="border-bottom: 3px solid #0052A3; padding-bottom: 8px; margin-bottom: 20px;">
        <h1 style="font-size: 16px; font-weight: bold; color: #000; letter-spacing: 0.5px; margin: 0;">Valuation & Conclusions</h1>
      </div>

      <!-- Income Approach Section -->
      <div style="margin-bottom: 18px;">
        <h2 style="font-size: 13px; font-weight: bold; color: #0052A3; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase;">Income Approach</h2>
        <p style="font-style: italic; font-size: 11px; margin-bottom: 12px; line-height: 1.4;">${getFieldValue(sections, 'income-approach-overview') || 'The Income Approach is based on the premise that properties are purchased for their income producing potential. It considers both the annual return on the invested capital and the rate of return anticipated by market participants. The two fundamental methods of this valuation technique include Discounted Cash Flow and Direct Capitalization. The Direct Capitalization method of the Income Approach is used in this analysis. This capitalization technique best represents the decision-making process of an investor.'}</p>
      </div>

      <!-- Direct Capitalization Method -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: bold; color: #000; margin-bottom: 8px;">Direct Capitalization Method</h3>
        <p style="font-size: 11px; margin-bottom: 10px; text-align: justify; line-height: 1.4;">${getFieldValue(sections, 'direct-capitalization-method') || 'The first step in direct capitalization is to estimate the durable rental income through analysis of the in-place or projected (proposed developments) leases and market rent terms. Next, encumbrances and other revenue are analyzed. Then, vacancy and operating expenses are estimated. Finally, the net operating income is capitalized at a supported rate. The implied value may be adjusted to account for non-stabilized conditions or required capital expenditures to reflect an as-is value.'}</p>
      </div>

      <!-- Multi-Family Revenue Analysis -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: bold; color: #000; margin-bottom: 6px;">Multi-Family Revenue Analysis</h3>
        <h4 style="font-size: 11px; font-weight: bold; margin-bottom: 6px;">Multi-Family Subject Rent Roll</h4>
        <p style="font-size: 11px; margin-bottom: 10px; line-height: 1.4;">${getFieldValue(sections, 'multifamily-revenue-analysis-intro') || 'The following table summarizes the subject in place unit mix and rental rates.'}</p>

        <!-- Rent Roll Table -->
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin: 14px 0;">
          <thead style="background: #003D82; color: white; font-weight: bold;">
            <tr>
              <th style="padding: 6px 4px; text-align: left; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">TYPE</th>
              <th style="padding: 6px 4px; text-align: left; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">DESCRIPTION</th>
              <th style="padding: 6px 4px; text-align: center; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">UNITS</th>
              <th style="padding: 6px 4px; text-align: center; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">% OF TOTAL</th>
              <th style="padding: 6px 4px; text-align: center; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">VAC %</th>
              <th style="padding: 6px 4px; text-align: center; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">OCC %</th>
              <th style="padding: 6px 4px; text-align: center; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">AVG RENT</th>
              <th style="padding: 6px 4px; text-align: center; border: 1px solid #003D82; font-size: 9px; text-transform: uppercase;">ACTUAL RENT</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #f9f9f9;">
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: left;">Flat 1 Bed / 1 Bath</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: left;">One Bed/One Bath</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">${getFieldValue(sections, 'one-bed-units') || '4'}</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">25%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">0%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">100%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">$${getFieldValue(sections, 'one-bed-avg-rent') || '585'}</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">$${getFieldValue(sections, 'one-bed-actual-rent') || '1,633'}</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: left;">Flat 2 Bed / 1 Bath</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: left;">Two Bed/One Bath</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">${getFieldValue(sections, 'two-bed-units') || '12'}</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">75%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">8%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">92%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">$${getFieldValue(sections, 'two-bed-avg-rent') || '650'}</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">$${getFieldValue(sections, 'two-bed-actual-rent') || '1,913'}</td>
            </tr>
            <tr style="background: #f9f9f9; font-weight: bold;">
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: left;">TOTAL / AVERAGE</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc;"></td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">${getFieldValue(sections, 'total-units') || '16'}</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">100%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">6%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">94%</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">$${getFieldValue(sections, 'avg-rent-total') || '1,013'}</td>
              <td style="padding: 5px 4px; border: 1px solid #ccc; text-align: center;">$${getFieldValue(sections, 'actual-rent-total') || '3,546'}</td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 10px; margin-top: 8px; line-height: 1.4;">${getFieldValue(sections, 'rent-roll-note') || 'The majority of the subject tenant leases are on 12-month leases. In addition, security deposit fees for the property equal one month\'s rent. The landlord pays for all utilities except electricity.'}</p>
      </div>

      <!-- Market Rent Survey Analysis -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: bold; color: #000; margin-bottom: 8px;">Multi-Family Market Rent Survey Analysis</h3>
        <p style="font-size: 11px; margin-bottom: 10px; text-align: justify; line-height: 1.4;">${getFieldValue(sections, 'market-rent-survey-intro') || 'This section examines comparable properties within the marketplace to estimate market rent for the subject. This allows for a comparison of the subject property\'s contract to what is attainable in the current market.'}</p>
      </div>

      <!-- Unit of Comparison -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: bold; color: #000; margin-bottom: 8px;">Unit of Comparison</h3>
        <p style="font-size: 11px; margin-bottom: 10px; text-align: justify; line-height: 1.4;">${getFieldValue(sections, 'unit-of-comparison-text') || 'The analysis is conducted on a dollar per square foot, per month basis, reflecting market behavior. The total dollar per month per unit is also considered.'}</p>
      </div>

      <!-- Selection of Comparables -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: bold; color: #000; margin-bottom: 8px;">Selection of Comparables</h3>
        <p style="font-size: 11px; margin-bottom: 10px; text-align: justify; line-height: 1.4;">${getFieldValue(sections, 'selection-of-comparables-text') || 'A comparable search of the marketplace was undertaken to find the most comparable properties in terms of location, tenancy, age, exposure, quality, and condition. The comparables in this analysis are the most reliable indicators of market rent for the subject available at the time of this appraisal.'}</p>
      </div>

      <!-- Concessions -->
      <div style="margin-bottom: 18px;">
        <h3 style="font-size: 12px; font-weight: bold; color: #000; margin-bottom: 8px;">Concessions</h3>
        <p style="font-size: 11px; margin-bottom: 10px; text-align: justify; line-height: 1.4;">${getFieldValue(sections, 'concessions-text') || 'Currently landlords are not offering concessions.'}</p>
      </div>

      <!-- Footer -->
      <div style="position: absolute; bottom: 20px; left: 0; right: 0; padding: 0 40px; border-top: 2px solid #0052A3; padding-top: 8px; font-size: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;"><strong>37</strong> | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</div>
        <div style="width: 80px; height: 30px; background: linear-gradient(to right, #E8F0F8 50%, #003D82 50%); margin-left: 10px;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 43: Valuation & Conclusions - Rent Survey Comparison
 * Fields: survey-presentation-intro, survey-comparison-table, rent-survey-information-table, building-information-table
 */
export function renderPage43(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-43" style="font-family: Arial, sans-serif; padding: 0.5in; position: relative; min-height: 11in; display: flex; flex-direction: column;">
      <div style="flex: 1; overflow: hidden; display: flex; flex-direction: column;">
        <!-- Header -->
        <h1 style="font-size: 18px; font-weight: bold; color: #000; padding-bottom: 8px; border-bottom: 3px solid #4a7ba7; margin-bottom: 12px;">Valuation & Conclusions</h1>

        <!-- Presentation Section -->
        <h2 style="font-size: 13px; font-weight: bold; color: #003366; margin-top: 12px; margin-bottom: 8px;">Presentation</h2>
        <p style="font-size: 10px; line-height: 1.4; color: #333; margin-bottom: 10px; text-align: justify;">${getFieldValue(sections, 'survey-presentation-intro') || 'The following summarizes the comparables most similar to the subject property. The Survey Comparison Table, location map, photographs, and an analysis of the rent survey are presented on the following pages.'}</p>

        <!-- Survey Comparison Table -->
        <div style="margin-bottom: 12px;">
          <div style="background: #2d5a8c; color: white; padding: 6px 8px; font-size: 9px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 0;">SURVEY COMPARISON TABLE</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 10px; border: 1px solid #999;">
            <thead style="background: #e8f0f7;">
              <tr>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">Property Name</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">Subject</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 1</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 2</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 3</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 4</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Address</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'comp1-address') || '2624 B-84th Ave'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'comp2-address') || '521 G-81 St'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'comp3-address') || '2306-2 Ave W'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'comp4-address') || '3050 Ulm St'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'comp5-address') || '399 24 St W'}</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">City</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'property-city') || 'North Battleford'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">North Battleford</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Prince Albert</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Prince Albert</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Prince Albert</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Prince Albert</td>
              </tr>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Province</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">SK</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">SK</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">SK</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">SK</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">SK</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">SK</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Rent Survey Information Table -->
        <div style="margin-bottom: 12px;">
          <div style="background: #2d5a8c; color: white; padding: 6px 8px; font-size: 9px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 0;">RENT SURVEY INFORMATION</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 10px; border: 1px solid #999;">
            <thead style="background: #e8f0f7;">
              <tr>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">Rent Type</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">Market</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;" colspan="5">Comparables</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Rent/Unit Avg</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$${getFieldValue(sections, 'market-rent-unit-avg') || '1,216'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1,762</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1,238</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1,217</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1,375</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1,435</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Rent/SF Avg</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$${getFieldValue(sections, 'market-rent-sf-avg') || '1.39'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$2.43</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1.77</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1.58</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1.76</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">$1.98</td>
              </tr>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Unit Amenities</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Partial Kitchen, Electric Baseboard Heating</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Full Kitchen, Gas Heating</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Full Kitchen, Gas Heating</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Full Kitchen, Gas Heating</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Full Kitchen, Gas Heating</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Full Kitchen, Gas Heating</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Utilities Incl.</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Heat, W</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">G, Heat, L, W</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Heat, W</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Heat, W</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Heat, W</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Heat, W</td>
              </tr>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Parking</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">None included</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Carport</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Open</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Open</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Open</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Open</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Laundry</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">On Site</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Washer/Dryer</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">On-Site</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">On-Site</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">On-Site</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">On-Site</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Building Information Table -->
        <div style="margin-bottom: 12px;">
          <div style="background: #2d5a8c; color: white; padding: 6px 8px; font-size: 9px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 0;">BUILDING INFORMATION</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 10px; border: 1px solid #999;">
            <thead style="background: #e8f0f7;">
              <tr>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">Item</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">Subject</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 1</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 2</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 3</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 4</th>
                <th style="background: #d0dce6; padding: 4px 3px; text-align: center; font-weight: bold; border: 1px solid #999; font-size: 7px;">COMP 5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Avg Unit SF</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">${getFieldValue(sections, 'avg-unit-sf') || '886'}</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">725</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">769</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">768</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">780</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">724</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Quality</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
              </tr>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Condition</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd;">Average</td>
              </tr>
              <tr style="background: #fafbfc;">
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Project Amenities</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Guest Parking</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Elevators, Guest Parking</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Guest Parking, Storage</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Guest Parking, Storage</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Guest Parking, Storage</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Elevators, Guest Parking</td>
              </tr>
              <tr>
                <td style="font-weight: 600; background: #f5f9fc; padding: 3px 4px; border: 1px solid #ddd;">Security</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Deadbolt, Intercom</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Electronic, CCTV</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Deadbolt, CCTV</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Electronic, CCTV</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Electronic, CCTV</td>
                <td style="padding: 3px 4px; border: 1px solid #ddd; font-size: 7px;">Electronic, CCTV</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: auto; padding-top: 0.25in; border-top: 1px solid #ccc; font-size: 9px; color: #666; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold;">38</span>
        <span>${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</span>
        <div style="width: 60px; height: 20px; background: linear-gradient(to right, #4a7ba7 50%, #2d5a8c 50%); border-radius: 2px;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 44: Valuation & Conclusions - Comparable Location Map
 * Fields: location-map-placeholder, comparable-distance-table
 */
export function renderPage44(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-44" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; padding: 40px 36px; position: relative; min-height: 11in; display: flex; flex-direction: column;">
      <!-- Header -->
      <div style="font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #0066cc;">Valuation & Conclusions</div>

      <!-- Map Section -->
      <div style="width: 100%; height: 340px; margin-bottom: 16px;">
        <div style="width: 100%; height: 100%; background: #e8f0f7; display: flex; align-items: center; justify-content: center; color: #666; font-size: 13px; border: 1px solid #ccc; font-weight: normal; font-style: italic;">
          ${getFieldValue(sections, 'location-map-placeholder') || '[MAP: Saskatchewan location map showing subject property and comparable properties. Map includes cities, highways, and geographic features.]'}
        </div>
      </div>

      <!-- Comparable Distance Table -->
      <div style="width: 100%; margin-bottom: 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; line-height: 1.4;">
          <thead>
            <tr>
              <th style="background-color: #d4e6f1; color: #1a1a1a; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #999; font-size: 10px;">COMPARABLE</th>
              <th style="background-color: #d4e6f1; color: #1a1a1a; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #999; font-size: 10px;">LABEL</th>
              <th style="background-color: #d4e6f1; color: #1a1a1a; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #999; font-size: 10px;">ADDRESS</th>
              <th style="background-color: #d4e6f1; color: #1a1a1a; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #999; font-size: 10px;">KILOMETRES FROM SUBJECT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">COMPARABLE 1</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">1</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp1-full-address') || '1520 - 99 Ave., North Battleford, SK, S9A 3X6'}</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp1-distance') || '177.9'}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">COMPARABLE 2</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">2</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp2-full-address') || '531 S St. E., Prince Albert, SK, S6V 6J3'}</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp2-distance') || '177.1'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">COMPARABLE 3</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">3</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp3-full-address') || '2302 2 Ave. W, Prince Albert, SK, S6V 5C7'}</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp3-distance') || '175.4'}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">COMPARABLE 4</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">4</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp4-full-address') || '3020 Durn Dr, Prince Albert, SK, S6V 7E7'}</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp4-distance') || '177.9'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">COMPARABLE 5</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">5</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp5-full-address') || '388 32 St W, Prince Albert, SK, S6V 5Z3'}</td>
              <td style="padding: 6px 8px; border: 1px solid #999; color: #1a1a1a;">${getFieldValue(sections, 'comp5-distance') || '174.9'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="margin-top: auto; font-size: 10px; color: #666; display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #ddd;">
        <div style="flex: 1;">39 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</div>
        <div style="width: 100px; height: 24px; background: #0052a3; border-radius: 2px;"></div>
      </div>
    </div>
  `;
}

/**
 * Page 45: Valuation & Conclusions - Market Rent Analysis
 * Fields: market-rent-conclusion-intro, one-bed-units-analysis-table, one-bed-unit-conclusion-table,
 * two-bed-units-analysis-table, two-bed-unit-conclusion-table
 */
export function renderPage45(sections: ReportSection[], valueScenarioType: string): string {
  return `
    <div class="page page-45" style="font-family: Calibri, Arial, sans-serif; font-size: 11px; line-height: 1.4; color: #000; padding: 40px 40px; position: relative; min-height: 11in;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #0066cc; padding-bottom: 8px; margin-bottom: 16px;">
        <h1 style="font-size: 14px; font-weight: bold; color: #000; margin-bottom: 4px;">Valuation & Conclusions</h1>
        <h2 style="font-size: 12px; font-weight: bold; color: #003d99; margin-bottom: 8px;">Conclusion Of Market Rent - Multi-Family</h2>
      </div>

      <p style="font-size: 11px; margin-bottom: 12px; line-height: 1.5; color: #333;">${getFieldValue(sections, 'market-rent-conclusion-intro') || 'The following table summarizes the various indicators of market rent for each unit type and provides the market rent analysis and conclusions for the subject property.'}</p>

      <!-- 1 BED UNITS TABLE -->
      <div style="margin-bottom: 20px;">
        <div style="background-color: #1f4f78; color: white; padding: 6px 8px; font-weight: bold; font-size: 11px; margin-bottom: 2px; text-align: center;">1 BED UNITS</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 12px;">
          <thead>
            <tr>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">COMP TYPE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">UNIT SIZE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/UNIT</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/SF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">1 Flat 1 Bed / 1 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">650</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,379</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$2.12</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">2 Flat 1 Bed / 1 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">650</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,185</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1.82</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">3 Flat 1 Bed / 1 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">650</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,165</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1.79</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">4 Flat 1 Bed / 1 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">650</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,155</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1.78</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">5 Flat 1 Bed / 1 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">650</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,280</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1.97</td>
            </tr>
            <tr style="background-color: #e8e8e8; font-weight: bold;">
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">AVG</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">650</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'one-bed-avg-rent-conclusion') || '1,287'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'one-bed-avg-rent-sf') || '1.98'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- UNIT TYPE ANALYSIS & CONCLUSIONS - 1 BED -->
      <div style="margin-bottom: 20px;">
        <div style="background-color: #1f4f78; color: white; padding: 6px 8px; font-weight: bold; font-size: 11px; margin-bottom: 2px; text-align: center;">UNIT TYPE ANALYSIS & CONCLUSIONS</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 12px;">
          <thead>
            <tr>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">TYPE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">UNIT SIZE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/UNIT</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/SF</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">CONCLUSION/SF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">Flat 1 Bed / 1 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">${getFieldValue(sections, 'one-bed-unit-size') || '650'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'one-bed-rent-unit') || '895'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'one-bed-rent-sf') || '1.63'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'one-bed-conclusion-sf') || '1.63'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 2 BED UNITS TABLE -->
      <div style="margin-bottom: 20px;">
        <div style="background-color: #1f4f78; color: white; padding: 6px 8px; font-weight: bold; font-size: 11px; margin-bottom: 2px; text-align: center;">2 BED UNITS</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 12px;">
          <thead>
            <tr>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">COMP TYPE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">UNIT SIZE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/UNIT</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/SF</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">NET ADJ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">1 Flat 2 Bed / 2 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">750</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,500</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$2.00</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">0%</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">2 Flat 2 Bed / 2 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">750</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,825</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$2.43</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">0%</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">3 Flat 2 Bed / 2 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">750</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,285</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1.71</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">0%</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">4 Flat 2 Bed / 2 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">750</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,290</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1.72</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">0%</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">5 Flat 2 Bed / 2 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">750</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1,430</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$1.91</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">0%</td>
            </tr>
            <tr style="background-color: #e8e8e8; font-weight: bold;">
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">AVG</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">750</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'two-bed-avg-rent-conclusion') || '1,486'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'two-bed-avg-rent-sf') || '1.98'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">0%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- UNIT TYPE ANALYSIS & CONCLUSIONS - 2 BED -->
      <div style="margin-bottom: 20px;">
        <div style="background-color: #1f4f78; color: white; padding: 6px 8px; font-weight: bold; font-size: 11px; margin-bottom: 2px; text-align: center;">UNIT TYPE ANALYSIS & CONCLUSIONS</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 12px;">
          <thead>
            <tr>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">TYPE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">UNIT SIZE</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/UNIT</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">RENT/SF</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">CONCLUSION/SF</th>
              <th style="background-color: #d9e1f2; border: 1px solid #999; padding: 6px 4px; text-align: center; font-weight: bold; font-size: 9px;">CONCLUSION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: left;">Flat 2 Bed / 1 Bath</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">${getFieldValue(sections, 'two-bed-unit-size') || '667'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'two-bed-rent-unit') || '1,056'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'two-bed-rent-sf') || '1.58'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'two-bed-conclusion-sf') || '1.59'}</td>
              <td style="border: 1px solid #ccc; padding: 5px 4px; text-align: right;">$${getFieldValue(sections, 'two-bed-conclusion-total') || '1,060'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="position: absolute; bottom: 20px; left: 0; right: 0; padding: 0 40px; border-top: 1px solid #ddd; padding-top: 8px; font-size: 9px; color: #666; display: flex; align-items: center; height: 30px;">
        <div style="flex: 1;">40 | ${getFieldValue(sections, 'property-address-line1') || '1101, 1121 109 St'}, ${getFieldValue(sections, 'property-city') || 'North Battleford'}, ${getFieldValue(sections, 'property-province') || 'Saskatchewan'} | File ${getFieldValue(sections, 'file-number') || 'VAL251012 - 1'}</div>
        <div style="width: 40px; height: 20px; background-color: #0066cc; margin-left: auto;"></div>
      </div>
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
