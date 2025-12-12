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
  // TODO: Implement page 01 - Cover Page - Appraisal Report
  // Fields to interpolate:
  // - report-title
  // - property-type
  // - property-name
  // - property-address-line1
  // - property-address-line2
  // - client-name
  // - client-address-full
  // - appraiser-company
  // - appraiser-address
  // - valuation-date
  // - report-date
  // - file-number

  return `
    <div class="page page-01">
      <h1>Page 1: Cover Page</h1>
      <p>TODO: Implement cover page template</p>
    </div>
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
 * Fields: section-title, extraordinary-limiting-conditions, appraiser-company, appraiser-signatory-name,
 * appraiser-signatory-title, appraiser-email, appraiser-aic-number
 */
export function renderPage03(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 03 - Extraordinary Limiting Conditions
  // Fields: section-title, extraordinary-limiting-conditions, appraiser-company
  // appraiser-signatory-name, appraiser-signatory-title, appraiser-email, appraiser-aic-number

  return `
    <div class="page page-03">
      <h1>Page 3: Extraordinary Limiting Conditions</h1>
      <p>TODO: Implement limiting conditions template</p>
    </div>
  `;
}

/**
 * Page 4: Table of Contents
 * Fields: section-title, toc-section-1, toc-section-2
 */
export function renderPage04(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 04 - Table of Contents
  // Fields: section-title, toc-section-1, toc-section-2

  return `
    <div class="page page-04">
      <h1>Page 4: Table of Contents</h1>
      <p>TODO: Implement table of contents template</p>
    </div>
  `;
}

/**
 * Page 5: Introduction & Executive Summary (Property Identification)
 * Fields: 43 fields including property-name, property-type, property-address, market-name,
 * legal-description, site-area-sf, zoning-district, tenancy-type, nra-sqft, unit-count, etc.
 */
export function renderPage05(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 05 - Introduction & Executive Summary (Property Identification)
  // 43 fields total - see master-field-mapping-consolidated.json for full list

  return `
    <div class="page page-05">
      <h1>Page 5: Executive Summary - Property Identification</h1>
      <p>TODO: Implement property identification template</p>
    </div>
  `;
}

/**
 * Page 6: Introduction & Executive Summary (HBU, Exposure Time, Investment Indicators, Value Conclusion)
 * Fields: 28 fields including hbu-proposed-construction, hbu-vacant-use, hbu-improved-use,
 * exposure-time-conclusion, current-occupancy-percent, capitalization-rate, concluded-value, etc.
 */
export function renderPage06(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 06 - Executive Summary (HBU, Exposure, Value)
  // 28 fields total

  return `
    <div class="page page-06">
      <h1>Page 6: Executive Summary - HBU & Value</h1>
      <p>TODO: Implement HBU and value conclusion template</p>
    </div>
  `;
}

/**
 * Page 7: Introduction & Executive Summary (Hypothetical Conditions and Assumptions)
 * Fields: section-title, subsection-title, hypothetical-conditions-text, extraordinary-assumptions-text,
 * extraordinary-limiting-conditions, page-footer
 */
export function renderPage07(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 07 - Hypothetical Conditions and Assumptions
  // Fields: section-title, subsection-title, hypothetical-conditions-text
  // extraordinary-assumptions-text, extraordinary-limiting-conditions, page-footer

  return `
    <div class="page page-07">
      <h1>Page 7: Hypothetical Conditions and Assumptions</h1>
      <p>TODO: Implement conditions and assumptions template</p>
    </div>
  `;
}

/**
 * Page 8: Photographs (Page 1 of 2)
 * Fields: section-title, subsection-title, photo-1-caption through photo-6-caption, page-footer
 */
export function renderPage08(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 08 - Photographs (Page 1 of 2)
  // Fields: section-title, subsection-title, photo-1-caption...photo-6-caption, page-footer

  return `
    <div class="page page-08">
      <h1>Page 8: Photographs (1 of 2)</h1>
      <p>TODO: Implement photographs page 1 template</p>
    </div>
  `;
}

/**
 * Page 9: Photographs (Page 2 of 2)
 * Fields: section-title, photo-7-caption through photo-12-caption, page-footer
 */
export function renderPage09(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 09 - Photographs (Page 2 of 2)
  // Fields: section-title, photo-7-caption...photo-12-caption, page-footer

  return `
    <div class="page page-09">
      <h1>Page 9: Photographs (2 of 2)</h1>
      <p>TODO: Implement photographs page 2 template</p>
    </div>
  `;
}

/**
 * Page 11: Introduction & Executive Summary - Photos (Part 1)
 * Fields: intro-photo-1 through intro-photo-6
 */
export function renderPage11(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 11 - Photos (Part 1)
  // Fields: intro-photo-1...intro-photo-6

  return `
    <div class="page page-11">
      <h1>Page 11: Photos (Part 1)</h1>
      <p>TODO: Implement photos part 1 template</p>
    </div>
  `;
}

/**
 * Page 12: Introduction & Executive Summary - Photos (Part 2)
 * Fields: intro-photo-7 through intro-photo-12
 */
export function renderPage12(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 12 - Photos (Part 2)
  // Fields: intro-photo-7...intro-photo-12

  return `
    <div class="page page-12">
      <h1>Page 12: Photos (Part 2)</h1>
      <p>TODO: Implement photos part 2 template</p>
    </div>
  `;
}

/**
 * Page 13: Introduction & Executive Summary - Photos (Part 3)
 * Fields: intro-photo-13
 */
export function renderPage13(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 13 - Photos (Part 3)
  // Fields: intro-photo-13

  return `
    <div class="page page-13">
      <h1>Page 13: Photos (Part 3)</h1>
      <p>TODO: Implement photos part 3 template</p>
    </div>
  `;
}

/**
 * Page 14: Introduction & Executive Summary - Maps (Street Level)
 * Fields: intro-map-street
 */
export function renderPage14(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 14 - Maps (Street Level)
  // Fields: intro-map-street

  return `
    <div class="page page-14">
      <h1>Page 14: Maps (Street Level)</h1>
      <p>TODO: Implement street map template</p>
    </div>
  `;
}

/**
 * Page 15: Introduction & Executive Summary - Maps (Localized)
 * Fields: intro-map-local
 */
export function renderPage15(sections: ReportSection[], valueScenarioType: string): string {
  // TODO: Implement page 15 - Maps (Localized)
  // Fields: intro-map-local

  return `
    <div class="page page-15">
      <h1>Page 15: Maps (Localized)</h1>
      <p>TODO: Implement local map template</p>
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
