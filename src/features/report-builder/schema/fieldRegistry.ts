/**
 * Field Registry - Single Source of Truth for All Report Builder Fields
 *
 * IMPORTANT: The storeId field MUST exactly match the field id in reportBuilderStore.ts
 * This file was rebuilt 2025-12-05 to fix field ID mapping issues.
 *
 * Total Fields: ~270 (matching all store field IDs)
 */

export interface FieldDefinition {
  id: string;                    // Canonical field ID (same as storeId for simplicity)
  storeId: string;               // ID used in reportBuilderStore - MUST MATCH EXACTLY
  label: string;                 // Human-readable label for UI
  section: string;               // Section ID (cover, exec, site, etc.)
  subsection?: string;           // Subsection if applicable
  type: 'text' | 'number' | 'date' | 'image' | 'textarea' | 'select' | 'currency' | 'percentage' | 'calculated';
  inputSource: 'user-input' | 'calculated' | 'api-fetch' | 'template' | 'auto-filled';
  options?: string[];            // For select fields
  required: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  calculationFormula?: string;   // For calculated fields
  notes?: string;                // Additional context
}

/**
 * Complete Field Registry - Organized by Section
 * All storeIds EXACTLY match the field ids in reportBuilderStore.ts
 */
export const fieldRegistry: FieldDefinition[] = [

  // ============================================================================
  // SECTION S1: CLIENT INTAKE (V3 Dashboard)
  // These fields mirror the deployed V3 Dashboard client form submission
  // ============================================================================

  // Client Information Subsection
  { id: 'intake-client-first-name', storeId: 'intake-client-first-name', label: 'Client First Name', section: 'client-intake', subsection: 'client-info-intake', type: 'text', inputSource: 'user-input', required: true },
  { id: 'intake-client-last-name', storeId: 'intake-client-last-name', label: 'Client Last Name', section: 'client-intake', subsection: 'client-info-intake', type: 'text', inputSource: 'user-input', required: true },
  { id: 'intake-client-email', storeId: 'intake-client-email', label: 'Client Email', section: 'client-intake', subsection: 'client-info-intake', type: 'text', inputSource: 'user-input', required: true },
  { id: 'intake-client-phone', storeId: 'intake-client-phone', label: 'Client Phone', section: 'client-intake', subsection: 'client-info-intake', type: 'text', inputSource: 'user-input', required: true },
  { id: 'intake-client-title', storeId: 'intake-client-title', label: 'Client Title', section: 'client-intake', subsection: 'client-info-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-client-organization', storeId: 'intake-client-organization', label: 'Organization', section: 'client-intake', subsection: 'client-info-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-client-address', storeId: 'intake-client-address', label: 'Client Address', section: 'client-intake', subsection: 'client-info-intake', type: 'text', inputSource: 'user-input', required: false },

  // Property Information Subsection
  { id: 'intake-property-name', storeId: 'intake-property-name', label: 'Property Name', section: 'client-intake', subsection: 'property-info-intake', type: 'text', inputSource: 'user-input', required: true },
  { id: 'intake-property-address', storeId: 'intake-property-address', label: 'Property Address', section: 'client-intake', subsection: 'property-info-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-property-type', storeId: 'intake-property-type', label: 'Property Type', section: 'client-intake', subsection: 'property-info-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-intended-use', storeId: 'intake-intended-use', label: 'Intended Use', section: 'client-intake', subsection: 'property-info-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-valuation-premises', storeId: 'intake-valuation-premises', label: 'Valuation Premises', section: 'client-intake', subsection: 'property-info-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-asset-condition', storeId: 'intake-asset-condition', label: 'Asset Condition', section: 'client-intake', subsection: 'property-info-intake', type: 'text', inputSource: 'user-input', required: false },

  // Property Contact Subsection
  { id: 'intake-contact-first-name', storeId: 'intake-contact-first-name', label: 'Contact First Name', section: 'client-intake', subsection: 'property-contact-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-contact-last-name', storeId: 'intake-contact-last-name', label: 'Contact Last Name', section: 'client-intake', subsection: 'property-contact-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-contact-email', storeId: 'intake-contact-email', label: 'Contact Email', section: 'client-intake', subsection: 'property-contact-intake', type: 'text', inputSource: 'user-input', required: false },
  { id: 'intake-contact-phone', storeId: 'intake-contact-phone', label: 'Contact Phone', section: 'client-intake', subsection: 'property-contact-intake', type: 'text', inputSource: 'user-input', required: false },

  // Notes Subsection
  { id: 'intake-notes', storeId: 'intake-notes', label: 'Notes', section: 'client-intake', subsection: 'notes-intake', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION S2: LOE PREP (V3 Dashboard)
  // These fields mirror the deployed V3 Dashboard LOE/Quote section
  // ============================================================================

  // Job Assignment Subsection
  { id: 'loe-valcre-job-id', storeId: 'loe-valcre-job-id', label: 'Valcre Job ID (VAL#)', section: 'loe-prep', subsection: 'job-assignment', type: 'text', inputSource: 'user-input', required: false },

  // Financial Terms Subsection
  { id: 'loe-appraisal-fee', storeId: 'loe-appraisal-fee', label: 'Appraisal Fee', section: 'loe-prep', subsection: 'financial-terms', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'loe-retainer-amount', storeId: 'loe-retainer-amount', label: 'Retainer Amount', section: 'loe-prep', subsection: 'financial-terms', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'loe-payment-terms', storeId: 'loe-payment-terms', label: 'Payment Terms', section: 'loe-prep', subsection: 'financial-terms', type: 'text', inputSource: 'user-input', required: false },

  // Delivery Details Subsection
  { id: 'loe-delivery-date', storeId: 'loe-delivery-date', label: 'Delivery Date', section: 'loe-prep', subsection: 'delivery-details', type: 'date', inputSource: 'user-input', required: false },
  { id: 'loe-report-type', storeId: 'loe-report-type', label: 'Report Type', section: 'loe-prep', subsection: 'delivery-details', type: 'text', inputSource: 'user-input', required: false },
  { id: 'loe-property-rights', storeId: 'loe-property-rights', label: 'Property Rights Appraised', section: 'loe-prep', subsection: 'delivery-details', type: 'text', inputSource: 'user-input', required: false },

  // Scope Subsection
  { id: 'loe-scope-of-work', storeId: 'loe-scope-of-work', label: 'Scope of Work', section: 'loe-prep', subsection: 'scope-loe', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'loe-special-instructions', storeId: 'loe-special-instructions', label: 'Special Instructions', section: 'loe-prep', subsection: 'scope-loe', type: 'textarea', inputSource: 'user-input', required: false },

  // Comments Subsection
  { id: 'loe-internal-comments', storeId: 'loe-internal-comments', label: 'Internal Comments', section: 'loe-prep', subsection: 'comments-loe', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'loe-appraiser-comments', storeId: 'loe-appraiser-comments', label: 'Appraiser Comments', section: 'loe-prep', subsection: 'comments-loe', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION S3: IMAGE MANAGEMENT
  // Consolidated image uploads - easier to manage all in one place
  // These reference the same storeIds as the originals scattered in other sections
  // ============================================================================

  // Cover & Report Images
  { id: 'img-cover-photo', storeId: 'cover-photo', label: 'Cover Photo (→ 01-Cover)', section: 'image-mgt', subsection: 'report-images', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-signature', storeId: 'cert-signature', label: 'Signature Image (→ 22-Cert)', section: 'image-mgt', subsection: 'report-images', type: 'image', inputSource: 'user-input', required: false },

  // Maps
  { id: 'img-map-regional', storeId: 'map-regional', label: 'Regional Map (→ 03-Maps)', section: 'image-mgt', subsection: 'maps-images', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-map-local', storeId: 'map-local', label: 'Local Area Map (→ 03-Maps)', section: 'image-mgt', subsection: 'maps-images', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-map-aerial', storeId: 'map-aerial', label: 'Aerial/Site Map (→ 03-Maps)', section: 'image-mgt', subsection: 'maps-images', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-zoning-map', storeId: 'zoning-map', label: 'Zoning Map (→ 13-Zone)', section: 'image-mgt', subsection: 'maps-images', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-site-plan', storeId: 'site-plan-image', label: 'Site Plan (→ 08-Site)', section: 'image-mgt', subsection: 'maps-images', type: 'image', inputSource: 'user-input', required: false },

  // Property Photos
  { id: 'img-photos-exterior', storeId: 'photos-exterior', label: 'Exterior Photos (→ 07-Photos)', section: 'image-mgt', subsection: 'property-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-photos-street', storeId: 'photos-street', label: 'Street View Photos (→ 07-Photos)', section: 'image-mgt', subsection: 'property-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-photos-common', storeId: 'photos-common', label: 'Common Area Photos (→ 07-Photos)', section: 'image-mgt', subsection: 'property-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-photos-units', storeId: 'photos-units', label: 'Unit Interior Photos (→ 07-Photos)', section: 'image-mgt', subsection: 'property-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-photos-systems', storeId: 'photos-systems', label: 'Building Systems Photos (→ 07-Photos)', section: 'image-mgt', subsection: 'property-photos', type: 'image', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: COVER PAGE
  // ============================================================================

  { id: 'cover-photo', storeId: 'cover-photo', label: 'Cover Photo', section: 'cover', type: 'image', inputSource: 'user-input', required: false },
  { id: 'property-type-display', storeId: 'property-type-display', label: 'Property Type', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'property-name', storeId: 'property-name', label: 'Property Name', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'street-address', storeId: 'street-address', label: 'Street Address', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'city', storeId: 'city', label: 'City', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'province', storeId: 'province', label: 'Province', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'valuation-date', storeId: 'valuation-date', label: 'Date of Valuation', section: 'cover', type: 'date', inputSource: 'user-input', required: true },
  { id: 'report-date', storeId: 'report-date', label: 'Date of Report', section: 'cover', type: 'date', inputSource: 'auto-filled', required: true },
  { id: 'file-number', storeId: 'file-number', label: 'File Number', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },

  // Cover - Client Info Subsection
  { id: 'client-contact-name', storeId: 'client-contact-name', label: 'Client Contact Name', section: 'cover', subsection: 'client-info', type: 'text', inputSource: 'user-input', required: true },
  { id: 'client-company', storeId: 'client-company', label: 'Client Company', section: 'cover', subsection: 'client-info', type: 'text', inputSource: 'user-input', required: true },
  { id: 'client-address', storeId: 'client-address', label: 'Client Address', section: 'cover', subsection: 'client-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'client-city', storeId: 'client-city', label: 'Client City', section: 'cover', subsection: 'client-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'client-province', storeId: 'client-province', label: 'Client Province', section: 'cover', subsection: 'client-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'client-postal', storeId: 'client-postal', label: 'Client Postal Code', section: 'cover', subsection: 'client-info', type: 'text', inputSource: 'user-input', required: false },

  // Cover - Appraiser Info Subsection
  { id: 'appraiser-name', storeId: 'appraiser-name', label: 'Appraiser Name', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: true },
  { id: 'appraiser-credentials', storeId: 'appraiser-credentials', label: 'Appraiser Credentials', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'appraiser-title', storeId: 'appraiser-title', label: 'Appraiser Title', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'appraiser-company', storeId: 'appraiser-company', label: 'Company Name', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'appraiser-address', storeId: 'appraiser-address', label: 'Company Address', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-city', storeId: 'appraiser-city', label: 'Company City', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-phone', storeId: 'appraiser-phone', label: 'Company Phone', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-website', storeId: 'appraiser-website', label: 'Company Website', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-email', storeId: 'appraiser-email', label: 'Appraiser Email', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'appraiser-aic-number', storeId: 'appraiser-aic-number', label: 'AIC Number', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: HOME (Letter of Transmittal)
  // ============================================================================

  { id: 'transmittal-date', storeId: 'transmittal-date', label: 'Letter Date', section: 'home', subsection: 'transmittal-content', type: 'date', inputSource: 'auto-filled', required: true },
  { id: 'transmittal-body', storeId: 'transmittal-body', label: 'Letter Body', section: 'home', subsection: 'transmittal-content', type: 'textarea', inputSource: 'user-input', required: true },

  // ============================================================================
  // SECTION: MAPS
  // ============================================================================

  { id: 'map-regional', storeId: 'map-regional', label: 'Regional Map', section: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'map-local', storeId: 'map-local', label: 'Local Area Map', section: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'map-aerial', storeId: 'map-aerial', label: 'Aerial/Site Map', section: 'maps', type: 'image', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: REPORT INFORMATION
  // ============================================================================

  { id: 'report-type', storeId: 'report-type', label: 'Report Type', section: 'report', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'report-purpose', storeId: 'report-purpose', label: 'Purpose', section: 'report', type: 'textarea', inputSource: 'user-input', required: true },
  { id: 'report-scope', storeId: 'report-scope', label: 'Scope of Work', section: 'report', type: 'textarea', inputSource: 'user-input', required: true },
  { id: 'report-compliance', storeId: 'report-compliance', label: 'Compliance Standard', section: 'report', type: 'text', inputSource: 'auto-filled', required: true },

  // ============================================================================
  // SECTION: EXECUTIVE SUMMARY
  // ============================================================================

  // Exec - Property Identification Subsection
  { id: 'value-scenario', storeId: 'value-scenario', label: 'Value Scenario', section: 'exec', subsection: 'property-identification', type: 'select', inputSource: 'user-input', required: true, options: ['As Is', 'As Stabilized', 'As Complete', 'As Proposed'] },
  { id: 'property-rights', storeId: 'property-rights', label: 'Property Rights', section: 'exec', subsection: 'property-identification', type: 'select', inputSource: 'user-input', required: true, options: ['Fee Simple Estate', 'Leased Fee', 'Leasehold'] },
  { id: 'building-style', storeId: 'building-style', label: 'Building Style', section: 'exec', subsection: 'property-identification', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'total-buildings', storeId: 'total-buildings', label: 'Total Buildings', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'total-nra', storeId: 'total-nra', label: 'Net Rentable Area (SF)', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'year-built', storeId: 'year-built', label: 'Year Built', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'occupancy-rate', storeId: 'occupancy-rate', label: 'Occupancy Rate (%)', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'total-units', storeId: 'total-units', label: 'Total Units', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'stories', storeId: 'stories', label: 'Number of Stories', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'building-format', storeId: 'building-format', label: 'Building Format', section: 'exec', subsection: 'property-identification', type: 'text', inputSource: 'auto-filled', required: false },

  // Exec - Value Summary Subsection
  { id: 'concluded-value', storeId: 'concluded-value', label: 'Concluded Value', section: 'exec', subsection: 'value-summary', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'hypothetical-conditions', storeId: 'hypothetical-conditions', label: 'Hypothetical Conditions', section: 'exec', subsection: 'value-summary', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'extraordinary-assumptions', storeId: 'extraordinary-assumptions', label: 'Extraordinary Assumptions', section: 'exec', subsection: 'value-summary', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'extraordinary-limiting-conditions', storeId: 'extraordinary-limiting-conditions', label: 'Extraordinary Limiting Conditions', section: 'exec', subsection: 'value-summary', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: PHOTOS
  // ============================================================================

  { id: 'photos-exterior', storeId: 'photos-exterior', label: 'Exterior Photos', section: 'photos', subsection: 'exterior-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'photos-street', storeId: 'photos-street', label: 'Street View Photos', section: 'photos', subsection: 'street-views', type: 'image', inputSource: 'user-input', required: false },
  { id: 'photos-common', storeId: 'photos-common', label: 'Common Area Photos', section: 'photos', subsection: 'interior-common', type: 'image', inputSource: 'user-input', required: false },
  { id: 'photos-units', storeId: 'photos-units', label: 'Unit Interior Photos', section: 'photos', subsection: 'unit-interiors', type: 'image', inputSource: 'user-input', required: false },
  { id: 'photos-systems', storeId: 'photos-systems', label: 'Building Systems Photos', section: 'photos', subsection: 'building-systems', type: 'image', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: SITE DETAILS
  // ============================================================================

  // Site - Site Area Subsection
  { id: 'site-total-area', storeId: 'site-total-area', label: 'Total Site Area (SF)', section: 'site', subsection: 'site-area', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'site-acreage', storeId: 'site-acreage', label: 'Site Acreage', section: 'site', subsection: 'site-area', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'site-address', storeId: 'site-address', label: 'Site Address', section: 'site', subsection: 'site-area', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'site-shape', storeId: 'site-shape', label: 'Shape', section: 'site', subsection: 'site-area', type: 'text', inputSource: 'user-input', required: false },
  { id: 'topography', storeId: 'topography', label: 'Topography', section: 'site', subsection: 'site-area', type: 'text', inputSource: 'user-input', required: false },
  { id: 'accessibility', storeId: 'accessibility', label: 'Accessibility', section: 'site', subsection: 'site-area', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exposure-visibility', storeId: 'exposure-visibility', label: 'Exposure & Visibility', section: 'site', subsection: 'site-area', type: 'text', inputSource: 'user-input', required: false },

  // Site - Adjacent Uses Subsection
  { id: 'adjacent-north', storeId: 'adjacent-north', label: 'North', section: 'site', subsection: 'adjacent-uses', type: 'text', inputSource: 'user-input', required: false },
  { id: 'adjacent-south', storeId: 'adjacent-south', label: 'South', section: 'site', subsection: 'adjacent-uses', type: 'text', inputSource: 'user-input', required: false },
  { id: 'adjacent-east', storeId: 'adjacent-east', label: 'East', section: 'site', subsection: 'adjacent-uses', type: 'text', inputSource: 'user-input', required: false },
  { id: 'adjacent-west', storeId: 'adjacent-west', label: 'West', section: 'site', subsection: 'adjacent-uses', type: 'text', inputSource: 'user-input', required: false },

  // Site - Site Conditions Subsection
  { id: 'easements', storeId: 'easements', label: 'Easements & Encroachments', section: 'site', subsection: 'site-conditions', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'soils', storeId: 'soils', label: 'Soils', section: 'site', subsection: 'site-conditions', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hazardous-waste', storeId: 'hazardous-waste', label: 'Environmental Concerns', section: 'site', subsection: 'site-conditions', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'site-rating', storeId: 'site-rating', label: 'Site Rating', section: 'site', subsection: 'site-conditions', type: 'text', inputSource: 'user-input', required: false },
  { id: 'site-conclusion', storeId: 'site-conclusion', label: 'Site Conclusion', section: 'site', subsection: 'site-conditions', type: 'textarea', inputSource: 'user-input', required: false },

  // Site - Site Plan Images Subsection
  { id: 'site-plan-image', storeId: 'site-plan-image', label: 'Site Plan Images', section: 'site', subsection: 'site-plan-images', type: 'image', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: LOCATION ANALYSIS
  // ============================================================================

  // Location - Location Overview Subsection
  { id: 'location-overview-text', storeId: 'location-overview-text', label: 'Location Overview', section: 'location', subsection: 'location-overview', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'location-access', storeId: 'location-access', label: 'Access', section: 'location', subsection: 'location-overview', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'public-transit', storeId: 'public-transit', label: 'Public Transportation', section: 'location', subsection: 'location-overview', type: 'textarea', inputSource: 'user-input', required: false },

  // Location - Walkability Scores Subsection
  { id: 'walk-score', storeId: 'walk-score', label: 'Walk Score', section: 'location', subsection: 'walkability-scores', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'transit-score', storeId: 'transit-score', label: 'Transit Score', section: 'location', subsection: 'walkability-scores', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'bike-score', storeId: 'bike-score', label: 'Bike Score', section: 'location', subsection: 'walkability-scores', type: 'number', inputSource: 'auto-filled', required: false },

  // Location - Local Area Subsection
  { id: 'local-area-description', storeId: 'local-area-description', label: 'Local Area Description', section: 'location', subsection: 'local-area', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'nearby-schools', storeId: 'nearby-schools', label: 'Nearby Schools', section: 'location', subsection: 'local-area', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'location-nearby-amenities', storeId: 'location-nearby-amenities', label: 'Nearby Amenities', section: 'location', subsection: 'local-area', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: TAX
  // ============================================================================

  { id: 'assessment-year', storeId: 'assessment-year', label: 'Assessment Year', section: 'tax', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'land-assessment', storeId: 'land-assessment', label: 'Land Assessment', section: 'tax', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'building-assessment', storeId: 'building-assessment', label: 'Building Assessment', section: 'tax', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'total-assessment', storeId: 'total-assessment', label: 'Total Assessment', section: 'tax', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'mill-rate', storeId: 'mill-rate', label: 'Mill Rate', section: 'tax', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'annual-taxes', storeId: 'annual-taxes', label: 'Annual Taxes', section: 'tax', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'tax-commentary', storeId: 'tax-commentary', label: 'Tax Commentary', section: 'tax', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: MARKET ANALYSIS
  // ============================================================================

  // Market - National Overview Subsection
  { id: 'national-overview', storeId: 'national-overview', label: 'National Economic Overview', section: 'market', subsection: 'market-national', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'market-national-gdp', storeId: 'market-national-gdp', label: 'GDP Growth', section: 'market', subsection: 'market-national', type: 'text', inputSource: 'user-input', required: false },
  { id: 'market-national-inflation', storeId: 'market-national-inflation', label: 'Inflation Rate', section: 'market', subsection: 'market-national', type: 'text', inputSource: 'user-input', required: false },

  // Market - Provincial Overview Subsection
  { id: 'provincial-overview', storeId: 'provincial-overview', label: 'Provincial Overview', section: 'market', subsection: 'market-provincial', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'market-provincial-unemployment', storeId: 'market-provincial-unemployment', label: 'Unemployment Rate', section: 'market', subsection: 'market-provincial', type: 'text', inputSource: 'user-input', required: false },
  { id: 'market-provincial-key-industries', storeId: 'market-provincial-key-industries', label: 'Key Industries', section: 'market', subsection: 'market-provincial', type: 'textarea', inputSource: 'user-input', required: false },

  // Market - Local Market Subsection
  { id: 'local-market', storeId: 'local-market', label: 'Local Market Analysis', section: 'market', subsection: 'market-local', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'market-local-population', storeId: 'market-local-population', label: 'Population', section: 'market', subsection: 'market-local', type: 'text', inputSource: 'user-input', required: false },
  { id: 'market-local-employment', storeId: 'market-local-employment', label: 'Employment', section: 'market', subsection: 'market-local', type: 'textarea', inputSource: 'user-input', required: false },

  // Market - Multifamily Market Subsection
  { id: 'multifamily-overview', storeId: 'multifamily-overview', label: 'Multifamily Market Overview', section: 'market', subsection: 'market-multifamily', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'market-vacancy-rate', storeId: 'market-vacancy-rate', label: 'Market Vacancy Rate (%)', section: 'market', subsection: 'market-multifamily', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'rent-trend', storeId: 'rent-trend', label: 'Rent Trend', section: 'market', subsection: 'market-multifamily', type: 'text', inputSource: 'user-input', required: false },
  { id: 'market-supply-pipeline', storeId: 'market-supply-pipeline', label: 'Supply Pipeline', section: 'market', subsection: 'market-multifamily', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'market-demand-drivers', storeId: 'market-demand-drivers', label: 'Demand Drivers', section: 'market', subsection: 'market-multifamily', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: IMPROVEMENTS
  // ============================================================================

  // Improvements - Building Overview Subsection
  { id: 'impv-overview', storeId: 'impv-overview', label: 'Overview', section: 'impv', subsection: 'building-overview', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'impv-num-buildings', storeId: 'impv-num-buildings', label: 'Number of Buildings', section: 'impv', subsection: 'building-overview', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'impv-nra', storeId: 'impv-nra', label: 'Net Rentable Area (SF)', section: 'impv', subsection: 'building-overview', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'impv-year-built', storeId: 'impv-year-built', label: 'Year Built', section: 'impv', subsection: 'building-overview', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'impv-num-units', storeId: 'impv-num-units', label: 'Number of Units', section: 'impv', subsection: 'building-overview', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'impv-stories', storeId: 'impv-stories', label: 'Number of Stories', section: 'impv', subsection: 'building-overview', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'impv-building-format', storeId: 'impv-building-format', label: 'Building Format', section: 'impv', subsection: 'building-overview', type: 'text', inputSource: 'auto-filled', required: false },

  // Improvements - Amenities Subsection
  { id: 'project-amenities', storeId: 'project-amenities', label: 'Project Amenities', section: 'impv', subsection: 'amenities', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'unit-amenities', storeId: 'unit-amenities', label: 'Unit Amenities', section: 'impv', subsection: 'amenities', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'laundry', storeId: 'laundry', label: 'Laundry', section: 'impv', subsection: 'amenities', type: 'text', inputSource: 'user-input', required: false },
  { id: 'security', storeId: 'security', label: 'Security Features', section: 'impv', subsection: 'amenities', type: 'textarea', inputSource: 'user-input', required: false },

  // Improvements - Construction Subsection
  { id: 'foundation', storeId: 'foundation', label: 'Foundation', section: 'impv', subsection: 'construction', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exterior-walls', storeId: 'exterior-walls', label: 'Exterior Walls/Framing', section: 'impv', subsection: 'construction', type: 'text', inputSource: 'user-input', required: false },
  { id: 'roof', storeId: 'roof', label: 'Roof', section: 'impv', subsection: 'construction', type: 'text', inputSource: 'user-input', required: false },
  { id: 'impv-roof-condition', storeId: 'impv-roof-condition', label: 'Roof Condition', section: 'impv', subsection: 'construction', type: 'text', inputSource: 'user-input', required: false },
  { id: 'impv-insulation', storeId: 'impv-insulation', label: 'Insulation', section: 'impv', subsection: 'construction', type: 'text', inputSource: 'user-input', required: false },
  { id: 'elevator', storeId: 'elevator', label: 'Elevator', section: 'impv', subsection: 'construction', type: 'text', inputSource: 'user-input', required: false },

  // Improvements - Systems Subsection
  { id: 'hvac', storeId: 'hvac', label: 'HVAC', section: 'impv', subsection: 'systems', type: 'text', inputSource: 'user-input', required: false },
  { id: 'electrical', storeId: 'electrical', label: 'Electrical', section: 'impv', subsection: 'systems', type: 'text', inputSource: 'user-input', required: false },
  { id: 'plumbing', storeId: 'plumbing', label: 'Plumbing', section: 'impv', subsection: 'systems', type: 'text', inputSource: 'user-input', required: false },
  { id: 'fire-protection', storeId: 'fire-protection', label: 'Fire Protection', section: 'impv', subsection: 'systems', type: 'text', inputSource: 'user-input', required: false },

  // Improvements - Finishes Subsection
  { id: 'interior-walls', storeId: 'interior-walls', label: 'Interior Walls', section: 'impv', subsection: 'finishes', type: 'text', inputSource: 'user-input', required: false },
  { id: 'ceilings', storeId: 'ceilings', label: 'Ceilings', section: 'impv', subsection: 'finishes', type: 'text', inputSource: 'user-input', required: false },
  { id: 'flooring', storeId: 'flooring', label: 'Flooring', section: 'impv', subsection: 'finishes', type: 'text', inputSource: 'user-input', required: false },
  { id: 'doors-windows', storeId: 'doors-windows', label: 'Doors & Windows', section: 'impv', subsection: 'finishes', type: 'text', inputSource: 'user-input', required: false },
  { id: 'impv-interior-finish', storeId: 'impv-interior-finish', label: 'Interior Finish Quality', section: 'impv', subsection: 'finishes', type: 'text', inputSource: 'user-input', required: false },

  // Improvements - Site Improvements Subsection
  { id: 'site-impv', storeId: 'site-impv', label: 'Site Improvements', section: 'impv', subsection: 'site-improvements', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'landscaping', storeId: 'landscaping', label: 'Landscaping', section: 'impv', subsection: 'site-improvements', type: 'text', inputSource: 'user-input', required: false },
  { id: 'parking-spaces', storeId: 'parking-spaces', label: 'Parking Spaces', section: 'impv', subsection: 'site-improvements', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'parking-ratio', storeId: 'parking-ratio', label: 'Parking Ratio', section: 'impv', subsection: 'site-improvements', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'impv-building-footprint', storeId: 'impv-building-footprint', label: 'Building Footprint (SF)', section: 'impv', subsection: 'site-improvements', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'impv-site-coverage', storeId: 'impv-site-coverage', label: 'Site Coverage (%)', section: 'impv', subsection: 'site-improvements', type: 'number', inputSource: 'auto-filled', required: false },

  // Improvements - Condition Subsection
  { id: 'overall-condition', storeId: 'overall-condition', label: 'Overall Condition', section: 'impv', subsection: 'condition', type: 'text', inputSource: 'user-input', required: false },
  { id: 'functional-design', storeId: 'functional-design', label: 'Functional Design', section: 'impv', subsection: 'condition', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hazardous-materials', storeId: 'hazardous-materials', label: 'Hazardous Materials', section: 'impv', subsection: 'condition', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: ZONING
  // ============================================================================

  { id: 'zoning-classification', storeId: 'zoning-classification', label: 'Zoning Classification', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'zoning-description', storeId: 'zoning-description', label: 'Zoning Description', section: 'zone', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'permitted-uses', storeId: 'permitted-uses', label: 'Permitted Uses', section: 'zone', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'zone-conditional-uses', storeId: 'zone-conditional-uses', label: 'Conditional Uses', section: 'zone', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'zone-minimum-lot-size', storeId: 'zone-minimum-lot-size', label: 'Minimum Lot Size', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'zone-setbacks', storeId: 'zone-setbacks', label: 'Setback Requirements', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'max-height', storeId: 'max-height', label: 'Max Height', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'max-density', storeId: 'max-density', label: 'Max Density', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'min-setback', storeId: 'min-setback', label: 'Min Setback', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'parking-requirements', storeId: 'parking-requirements', label: 'Parking Requirements', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'site-coverage', storeId: 'site-coverage', label: 'Site Coverage', section: 'zone', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'zoning-conformance', storeId: 'zoning-conformance', label: 'Conformance', section: 'zone', type: 'text', inputSource: 'user-input', required: false },
  { id: 'zoning-conclusion', storeId: 'zoning-conclusion', label: 'Zoning Conclusion', section: 'zone', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'zoning-map', storeId: 'zoning-map', label: 'Zoning Map', section: 'zone', type: 'image', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: HIGHEST & BEST USE
  // ============================================================================

  { id: 'hbu-intro', storeId: 'hbu-intro', label: 'HBU Introduction', section: 'hbu', subsection: 'hbu-introduction', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hbu-vacant-legal', storeId: 'hbu-vacant-legal', label: 'Legally Permissible', section: 'hbu', subsection: 'hbu-as-vacant', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hbu-vacant-physical', storeId: 'hbu-vacant-physical', label: 'Physically Possible', section: 'hbu', subsection: 'hbu-as-vacant', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hbu-vacant-financial', storeId: 'hbu-vacant-financial', label: 'Financially Feasible', section: 'hbu', subsection: 'hbu-as-vacant', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hbu-vacant-productive', storeId: 'hbu-vacant-productive', label: 'Maximally Productive', section: 'hbu', subsection: 'hbu-as-vacant', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hbu-improved', storeId: 'hbu-improved', label: 'Highest & Best Use As Improved', section: 'hbu', subsection: 'hbu-as-improved', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'hbu-conclusion-text', storeId: 'hbu-conclusion-text', label: 'HBU Conclusion', section: 'hbu', subsection: 'hbu-conclusion', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: CALCULATOR (Income Approach)
  // ============================================================================

  // Calc - Unit Mix Subsection
  { id: 'calc-type1-name', storeId: 'calc-type1-name', label: 'Unit Type 1', section: 'calc', subsection: 'calc-unit-mix', type: 'text', inputSource: 'user-input', required: false },
  { id: 'calc-type1-count', storeId: 'calc-type1-count', label: 'Unit Count', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type1-sf', storeId: 'calc-type1-sf', label: 'Avg SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type1-rent', storeId: 'calc-type1-rent', label: 'Market Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type1-annual', storeId: 'calc-type1-annual', label: 'Annual Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },

  { id: 'calc-type2-name', storeId: 'calc-type2-name', label: 'Unit Type 2', section: 'calc', subsection: 'calc-unit-mix', type: 'text', inputSource: 'user-input', required: false },
  { id: 'calc-type2-count', storeId: 'calc-type2-count', label: 'Unit Count', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type2-sf', storeId: 'calc-type2-sf', label: 'Avg SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type2-rent', storeId: 'calc-type2-rent', label: 'Market Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type2-annual', storeId: 'calc-type2-annual', label: 'Annual Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },

  { id: 'calc-type3-name', storeId: 'calc-type3-name', label: 'Unit Type 3', section: 'calc', subsection: 'calc-unit-mix', type: 'text', inputSource: 'user-input', required: false },
  { id: 'calc-type3-count', storeId: 'calc-type3-count', label: 'Unit Count', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type3-sf', storeId: 'calc-type3-sf', label: 'Avg SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type3-rent', storeId: 'calc-type3-rent', label: 'Market Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type3-annual', storeId: 'calc-type3-annual', label: 'Annual Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },

  { id: 'calc-type4-name', storeId: 'calc-type4-name', label: 'Unit Type 4', section: 'calc', subsection: 'calc-unit-mix', type: 'text', inputSource: 'user-input', required: false },
  { id: 'calc-type4-count', storeId: 'calc-type4-count', label: 'Unit Count', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type4-sf', storeId: 'calc-type4-sf', label: 'Avg SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type4-rent', storeId: 'calc-type4-rent', label: 'Market Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type4-annual', storeId: 'calc-type4-annual', label: 'Annual Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },

  { id: 'calc-total-units', storeId: 'calc-total-units', label: 'Total Units', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-total-sf', storeId: 'calc-total-sf', label: 'Total SF', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-avg-unit-sf', storeId: 'calc-avg-unit-sf', label: 'Avg Unit SF', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-total-rental-revenue', storeId: 'calc-total-rental-revenue', label: 'Total Rental Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-avg-rent-per-unit', storeId: 'calc-avg-rent-per-unit', label: 'Avg Rent/Unit', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-avg-rent-per-sf', storeId: 'calc-avg-rent-per-sf', label: 'Avg Rent/SF', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },

  // Calc - Other Income Subsection
  { id: 'calc-parking-per-unit', storeId: 'calc-parking-per-unit', label: 'Parking $/Unit/Mo', section: 'calc', subsection: 'calc-other-income', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-parking-total', storeId: 'calc-parking-total', label: 'Parking Annual', section: 'calc', subsection: 'calc-other-income', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-laundry-per-unit', storeId: 'calc-laundry-per-unit', label: 'Laundry $/Unit/Mo', section: 'calc', subsection: 'calc-other-income', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-laundry-total', storeId: 'calc-laundry-total', label: 'Laundry Annual', section: 'calc', subsection: 'calc-other-income', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-other-income', storeId: 'calc-other-income', label: 'Other Income Annual', section: 'calc', subsection: 'calc-other-income', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-total-other-income', storeId: 'calc-total-other-income', label: 'Total Other Income', section: 'calc', subsection: 'calc-other-income', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-pgr', storeId: 'calc-pgr', label: 'Potential Gross Revenue', section: 'calc', subsection: 'calc-other-income', type: 'calculated', inputSource: 'calculated', required: false },

  // Calc - Vacancy Subsection
  { id: 'calc-vacancy-rate', storeId: 'calc-vacancy-rate', label: 'Vacancy Rate (%)', section: 'calc', subsection: 'calc-vacancy', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-bad-debt-rate', storeId: 'calc-bad-debt-rate', label: 'Bad Debt Rate (%)', section: 'calc', subsection: 'calc-vacancy', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-concessions-rate', storeId: 'calc-concessions-rate', label: 'Concessions Rate (%)', section: 'calc', subsection: 'calc-vacancy', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-vacancy-loss', storeId: 'calc-vacancy-loss', label: 'Total Vacancy & Loss', section: 'calc', subsection: 'calc-vacancy', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-egr', storeId: 'calc-egr', label: 'Effective Gross Revenue', section: 'calc', subsection: 'calc-vacancy', type: 'calculated', inputSource: 'calculated', required: false },

  // Calc - Expenses Subsection
  { id: 'calc-exp-management', storeId: 'calc-exp-management', label: 'Management', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-taxes', storeId: 'calc-exp-taxes', label: 'Real Estate Taxes', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-insurance', storeId: 'calc-exp-insurance', label: 'Insurance', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-repairs', storeId: 'calc-exp-repairs', label: 'Repairs & Maintenance', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-utilities', storeId: 'calc-exp-utilities', label: 'Utilities', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-payroll', storeId: 'calc-exp-payroll', label: 'Payroll', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-admin', storeId: 'calc-exp-admin', label: 'Admin & General', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-reserves', storeId: 'calc-exp-reserves', label: 'Replacement Reserves', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-exp-other', storeId: 'calc-exp-other', label: 'Other Expenses', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-expenses-total', storeId: 'calc-expenses-total', label: 'Total Expenses', section: 'calc', subsection: 'calc-expenses', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-expense-ratio', storeId: 'calc-expense-ratio', label: 'Expense Ratio (%)', section: 'calc', subsection: 'calc-expenses', type: 'calculated', inputSource: 'calculated', required: false },

  // Calc - Cap Rate Subsection
  { id: 'calc-cap-rate', storeId: 'calc-cap-rate', label: 'Cap Rate (%)', section: 'calc', subsection: 'calc-cap', type: 'number', inputSource: 'user-input', required: false },

  // Calc - Adjustments Subsection
  { id: 'calc-adj-capex', storeId: 'calc-adj-capex', label: 'CapEx Adjustment', section: 'calc', subsection: 'calc-adjustments', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-adj-leasing', storeId: 'calc-adj-leasing', label: 'Leasing Costs', section: 'calc', subsection: 'calc-adjustments', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-adj-other', storeId: 'calc-adj-other', label: 'Other Adjustments', section: 'calc', subsection: 'calc-adjustments', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-adj-total', storeId: 'calc-adj-total', label: 'Total Adjustments', section: 'calc', subsection: 'calc-adjustments', type: 'calculated', inputSource: 'calculated', required: false },

  // Calc - Results Subsection
  { id: 'calc-noi', storeId: 'calc-noi', label: 'Net Operating Income', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-noi-per-unit', storeId: 'calc-noi-per-unit', label: 'NOI/Unit', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-noi-per-sf', storeId: 'calc-noi-per-sf', label: 'NOI/SF', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-raw-value', storeId: 'calc-raw-value', label: 'Raw Value', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-indicated-value', storeId: 'calc-indicated-value', label: 'Indicated Value', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-value-per-unit', storeId: 'calc-value-per-unit', label: 'Value/Unit', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-value-per-sf', storeId: 'calc-value-per-sf', label: 'Value/SF', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-grm', storeId: 'calc-grm', label: 'GRM', section: 'calc', subsection: 'calc-results', type: 'calculated', inputSource: 'calculated', required: false },

  // ============================================================================
  // SECTION: LAND VALUE
  // ============================================================================

  { id: 'land-value-conclusion', storeId: 'land-value-conclusion', label: 'Land Value Conclusion', section: 'land1', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: COST APPROACH
  // ============================================================================

  { id: 'cost-approach-conclusion', storeId: 'cost-approach-conclusion', label: 'Cost Approach Conclusion', section: 'cost-s', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: SALES COMPARISON
  // ============================================================================

  // Sales - Subject Summary Subsection
  { id: 'subject-units', storeId: 'subject-units', label: 'Number of Units', section: 'sales', subsection: 'subject-summary', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'subject-gba', storeId: 'subject-gba', label: 'Gross Building Area (SF)', section: 'sales', subsection: 'subject-summary', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'subject-year', storeId: 'subject-year', label: 'Year Built', section: 'sales', subsection: 'subject-summary', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'subject-site-area', storeId: 'subject-site-area', label: 'Site Area (SF)', section: 'sales', subsection: 'subject-summary', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'subject-parking', storeId: 'subject-parking', label: 'Parking Ratio', section: 'sales', subsection: 'subject-summary', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'subject-condition', storeId: 'subject-condition', label: 'Condition', section: 'sales', subsection: 'subject-summary', type: 'text', inputSource: 'user-input', required: false },

  // Sales - Comp 1 Subsection
  { id: 'comp1-name', storeId: 'comp1-name', label: 'Property Name', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-address', storeId: 'comp1-address', label: 'Address', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-sale-date', storeId: 'comp1-sale-date', label: 'Sale Date', section: 'sales', subsection: 'sale-comp-1', type: 'date', inputSource: 'user-input', required: false },
  { id: 'comp1-sale-price', storeId: 'comp1-sale-price', label: 'Sale Price', section: 'sales', subsection: 'sale-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-units', storeId: 'comp1-units', label: 'Units', section: 'sales', subsection: 'sale-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-price-per-unit', storeId: 'comp1-price-per-unit', label: 'Price/Unit', section: 'sales', subsection: 'sale-comp-1', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp1-gba', storeId: 'comp1-gba', label: 'GBA (SF)', section: 'sales', subsection: 'sale-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-price-per-sf', storeId: 'comp1-price-per-sf', label: 'Price/SF', section: 'sales', subsection: 'sale-comp-1', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp1-year', storeId: 'comp1-year', label: 'Year Built', section: 'sales', subsection: 'sale-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp1-cap-rate', storeId: 'comp1-cap-rate', label: 'Cap Rate (%)', section: 'sales', subsection: 'sale-comp-1', type: 'number', inputSource: 'user-input', required: false },

  // Sales - Comp 2 Subsection
  { id: 'comp2-name', storeId: 'comp2-name', label: 'Property Name', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-address', storeId: 'comp2-address', label: 'Address', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-sale-date', storeId: 'comp2-sale-date', label: 'Sale Date', section: 'sales', subsection: 'sale-comp-2', type: 'date', inputSource: 'user-input', required: false },
  { id: 'comp2-sale-price', storeId: 'comp2-sale-price', label: 'Sale Price', section: 'sales', subsection: 'sale-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp2-units', storeId: 'comp2-units', label: 'Units', section: 'sales', subsection: 'sale-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp2-price-per-unit', storeId: 'comp2-price-per-unit', label: 'Price/Unit', section: 'sales', subsection: 'sale-comp-2', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp2-gba', storeId: 'comp2-gba', label: 'GBA (SF)', section: 'sales', subsection: 'sale-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp2-price-per-sf', storeId: 'comp2-price-per-sf', label: 'Price/SF', section: 'sales', subsection: 'sale-comp-2', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp2-year', storeId: 'comp2-year', label: 'Year Built', section: 'sales', subsection: 'sale-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp2-cap-rate', storeId: 'comp2-cap-rate', label: 'Cap Rate (%)', section: 'sales', subsection: 'sale-comp-2', type: 'number', inputSource: 'user-input', required: false },

  // Sales - Comp 3 Subsection
  { id: 'comp3-name', storeId: 'comp3-name', label: 'Property Name', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-address', storeId: 'comp3-address', label: 'Address', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-sale-date', storeId: 'comp3-sale-date', label: 'Sale Date', section: 'sales', subsection: 'sale-comp-3', type: 'date', inputSource: 'user-input', required: false },
  { id: 'comp3-sale-price', storeId: 'comp3-sale-price', label: 'Sale Price', section: 'sales', subsection: 'sale-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp3-units', storeId: 'comp3-units', label: 'Units', section: 'sales', subsection: 'sale-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp3-price-per-unit', storeId: 'comp3-price-per-unit', label: 'Price/Unit', section: 'sales', subsection: 'sale-comp-3', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp3-gba', storeId: 'comp3-gba', label: 'GBA (SF)', section: 'sales', subsection: 'sale-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp3-price-per-sf', storeId: 'comp3-price-per-sf', label: 'Price/SF', section: 'sales', subsection: 'sale-comp-3', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp3-year', storeId: 'comp3-year', label: 'Year Built', section: 'sales', subsection: 'sale-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp3-cap-rate', storeId: 'comp3-cap-rate', label: 'Cap Rate (%)', section: 'sales', subsection: 'sale-comp-3', type: 'number', inputSource: 'user-input', required: false },

  // Sales - Conclusion Subsection
  { id: 'sales-value-indication', storeId: 'sales-value-indication', label: 'Sales Comparison Value', section: 'sales', subsection: 'sales-conclusion', type: 'number', inputSource: 'user-input', required: false },
  { id: 'sales-adjustment-summary', storeId: 'sales-adjustment-summary', label: 'Adjustment Summary', section: 'sales', subsection: 'sales-conclusion', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: INCOME APPROACH
  // ============================================================================

  { id: 'income-pgi-narrative', storeId: 'income-pgi-narrative', label: 'PGI Analysis', section: 'income', subsection: 'income-potential', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'income-expense-narrative', storeId: 'income-expense-narrative', label: 'Expense Analysis', section: 'income', subsection: 'income-expenses', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'income-noi-narrative', storeId: 'income-noi-narrative', label: 'NOI Analysis', section: 'income', subsection: 'income-noi', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'income-cap-rate-analysis', storeId: 'income-cap-rate-analysis', label: 'Cap Rate Analysis', section: 'income', subsection: 'income-analysis', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'income-value-indication', storeId: 'income-value-indication', label: 'Income Approach Value', section: 'income', subsection: 'income-analysis', type: 'number', inputSource: 'calculated', required: false },

  // ============================================================================
  // SECTION: RECONCILIATION
  // ============================================================================

  // Recon - Value Indications Subsection
  { id: 'recon-income-value', storeId: 'recon-income-value', label: 'Income Approach Value', section: 'recon', subsection: 'value-indications', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'recon-sales-value', storeId: 'recon-sales-value', label: 'Sales Comparison Value', section: 'recon', subsection: 'value-indications', type: 'number', inputSource: 'user-input', required: false },
  { id: 'recon-cost-value', storeId: 'recon-cost-value', label: 'Cost Approach Value', section: 'recon', subsection: 'value-indications', type: 'number', inputSource: 'user-input', required: false },

  // Recon - Weights Subsection
  { id: 'recon-income-weight', storeId: 'recon-income-weight', label: 'Income Weight (%)', section: 'recon', subsection: 'reconciliation-weights', type: 'number', inputSource: 'user-input', required: false },
  { id: 'recon-sales-weight', storeId: 'recon-sales-weight', label: 'Sales Weight (%)', section: 'recon', subsection: 'reconciliation-weights', type: 'number', inputSource: 'user-input', required: false },
  { id: 'recon-cost-weight', storeId: 'recon-cost-weight', label: 'Cost Weight (%)', section: 'recon', subsection: 'reconciliation-weights', type: 'number', inputSource: 'user-input', required: false },

  // Recon - Analysis Subsection
  { id: 'recon-narrative', storeId: 'recon-narrative', label: 'Reconciliation Narrative', section: 'recon', subsection: 'reconciliation-analysis', type: 'textarea', inputSource: 'user-input', required: false },

  // Recon - Final Value Subsection
  { id: 'recon-final-value', storeId: 'recon-final-value', label: 'Final Value', section: 'recon', subsection: 'final-value', type: 'number', inputSource: 'calculated', required: false },
  { id: 'recon-value-premise', storeId: 'recon-value-premise', label: 'Value Premise', section: 'recon', subsection: 'final-value', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'recon-effective-date', storeId: 'recon-effective-date', label: 'Effective Date', section: 'recon', subsection: 'final-value', type: 'date', inputSource: 'auto-filled', required: false },

  // ============================================================================
  // SECTION: CERTIFICATION
  // ============================================================================

  // Cert - Statements Subsection
  { id: 'cert-statement-1', storeId: 'cert-statement-1', label: 'Statement 1', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-2', storeId: 'cert-statement-2', label: 'Statement 2', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-3', storeId: 'cert-statement-3', label: 'Statement 3', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-4', storeId: 'cert-statement-4', label: 'Statement 4', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-5', storeId: 'cert-statement-5', label: 'Statement 5', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-6', storeId: 'cert-statement-6', label: 'Statement 6', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-7', storeId: 'cert-statement-7', label: 'Statement 7', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-8', storeId: 'cert-statement-8', label: 'Statement 8', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-9', storeId: 'cert-statement-9', label: 'Statement 9', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-10', storeId: 'cert-statement-10', label: 'Statement 10', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-11', storeId: 'cert-statement-11', label: 'Statement 11', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },
  { id: 'cert-statement-12', storeId: 'cert-statement-12', label: 'Statement 12', section: 'cert', subsection: 'certification-statements', type: 'textarea', inputSource: 'auto-filled', required: false },

  // Cert - Signature Block Subsection
  { id: 'cert-signature', storeId: 'cert-signature', label: 'Signature Image', section: 'cert', subsection: 'signature-block', type: 'image', inputSource: 'user-input', required: false },
  { id: 'cert-sign-name', storeId: 'cert-sign-name', label: 'Appraiser Name', section: 'cert', subsection: 'signature-block', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'cert-sign-credentials', storeId: 'cert-sign-credentials', label: 'Credentials', section: 'cert', subsection: 'signature-block', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'cert-sign-date', storeId: 'cert-sign-date', label: 'Signature Date', section: 'cert', subsection: 'signature-block', type: 'date', inputSource: 'auto-filled', required: false },

];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getFieldsBySection = (sectionId: string): FieldDefinition[] =>
  fieldRegistry.filter(f => f.section === sectionId);

export const getFieldById = (id: string): FieldDefinition | undefined =>
  fieldRegistry.find(f => f.id === id);

export const getFieldByStoreId = (storeId: string): FieldDefinition | undefined =>
  fieldRegistry.find(f => f.storeId === storeId);

export const getAllSections = (): string[] =>
  Array.from(new Set(fieldRegistry.map(f => f.section)));

export const getRequiredFields = (): FieldDefinition[] =>
  fieldRegistry.filter(f => f.required);

export const getFieldsBySubsection = (sectionId: string, subsectionId: string): FieldDefinition[] =>
  fieldRegistry.filter(f => f.section === sectionId && f.subsection === subsectionId);
