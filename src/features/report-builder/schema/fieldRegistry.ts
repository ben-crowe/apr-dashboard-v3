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
  // Consolidated image uploads with individual named slots
  // Each slot has a specific purpose and destination in the report
  // ============================================================================

  // --- COVER & REPORT IMAGES ---
  { id: 'img-cover-photo', storeId: 'img-cover-photo', label: 'Cover Photo - Main property image', section: 'image-mgt', subsection: 'cover-images', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-signature', storeId: 'img-signature', label: 'Appraiser Signature', section: 'image-mgt', subsection: 'cover-images', type: 'image', inputSource: 'user-input', required: false },

  // --- MAPS ---
  { id: 'img-map-regional', storeId: 'img-map-regional', label: 'Regional Map - Province/region context', section: 'image-mgt', subsection: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-map-local', storeId: 'img-map-local', label: 'Local Area Map - City/neighborhood', section: 'image-mgt', subsection: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-map-aerial-1', storeId: 'img-map-aerial-1', label: 'Aerial View - Bird\'s eye of property', section: 'image-mgt', subsection: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-map-aerial-2', storeId: 'img-map-aerial-2', label: 'Site Boundary - Property lines shown', section: 'image-mgt', subsection: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-zoning-map', storeId: 'img-zoning-map', label: 'Zoning Map - Municipal zoning', section: 'image-mgt', subsection: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-site-plan-1', storeId: 'img-site-plan-1', label: 'Site Plan - Layout/footprint', section: 'image-mgt', subsection: 'maps', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-site-plan-2', storeId: 'img-site-plan-2', label: 'Survey/Plot Plan', section: 'image-mgt', subsection: 'maps', type: 'image', inputSource: 'user-input', required: false },

  // --- EXTERIOR PHOTOS (6 slots with captions) ---
  { id: 'img-exterior-1', storeId: 'img-exterior-1', label: 'Exterior 1 - Front Facade', section: 'image-mgt', subsection: 'exterior-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-exterior-1-caption', storeId: 'img-exterior-1-caption', label: 'Caption', section: 'image-mgt', subsection: 'exterior-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: '1101 - East Elevation' },
  { id: 'img-exterior-2', storeId: 'img-exterior-2', label: 'Exterior 2 - Rear Elevation', section: 'image-mgt', subsection: 'exterior-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-exterior-2-caption', storeId: 'img-exterior-2-caption', label: 'Caption', section: 'image-mgt', subsection: 'exterior-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: '1101 - West Elevation' },
  { id: 'img-exterior-3', storeId: 'img-exterior-3', label: 'Exterior 3 - Left Side', section: 'image-mgt', subsection: 'exterior-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-exterior-3-caption', storeId: 'img-exterior-3-caption', label: 'Caption', section: 'image-mgt', subsection: 'exterior-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-exterior-4', storeId: 'img-exterior-4', label: 'Exterior 4 - Right Side', section: 'image-mgt', subsection: 'exterior-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-exterior-4-caption', storeId: 'img-exterior-4-caption', label: 'Caption', section: 'image-mgt', subsection: 'exterior-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-exterior-5', storeId: 'img-exterior-5', label: 'Exterior 5 - Detail/Feature', section: 'image-mgt', subsection: 'exterior-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-exterior-5-caption', storeId: 'img-exterior-5-caption', label: 'Caption', section: 'image-mgt', subsection: 'exterior-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-exterior-6', storeId: 'img-exterior-6', label: 'Exterior 6 - Additional', section: 'image-mgt', subsection: 'exterior-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-exterior-6-caption', storeId: 'img-exterior-6-caption', label: 'Caption', section: 'image-mgt', subsection: 'exterior-photos', type: 'text', inputSource: 'user-input', required: false },

  // --- STREET VIEW PHOTOS (3 slots with captions) ---
  { id: 'img-street-1', storeId: 'img-street-1', label: 'Street View 1 - Looking North', section: 'image-mgt', subsection: 'street-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-street-1-caption', storeId: 'img-street-1-caption', label: 'Caption', section: 'image-mgt', subsection: 'street-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: 'Street View Facing East - 11 Ave' },
  { id: 'img-street-2', storeId: 'img-street-2', label: 'Street View 2 - Looking South', section: 'image-mgt', subsection: 'street-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-street-2-caption', storeId: 'img-street-2-caption', label: 'Caption', section: 'image-mgt', subsection: 'street-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: 'Street View Facing North - 109 St' },
  { id: 'img-street-3', storeId: 'img-street-3', label: 'Street View 3 - Streetscape/Context', section: 'image-mgt', subsection: 'street-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-street-3-caption', storeId: 'img-street-3-caption', label: 'Caption', section: 'image-mgt', subsection: 'street-photos', type: 'text', inputSource: 'user-input', required: false },

  // --- COMMON AREA PHOTOS (4 slots with captions) ---
  { id: 'img-common-1', storeId: 'img-common-1', label: 'Common Area 1 - Lobby/Entrance', section: 'image-mgt', subsection: 'common-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-common-1-caption', storeId: 'img-common-1-caption', label: 'Caption', section: 'image-mgt', subsection: 'common-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: '1101 - Typical Hallway' },
  { id: 'img-common-2', storeId: 'img-common-2', label: 'Common Area 2 - Hallway/Corridor', section: 'image-mgt', subsection: 'common-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-common-2-caption', storeId: 'img-common-2-caption', label: 'Caption', section: 'image-mgt', subsection: 'common-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: '1101 - Typical Stairway' },
  { id: 'img-common-3', storeId: 'img-common-3', label: 'Common Area 3 - Amenity Space', section: 'image-mgt', subsection: 'common-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-common-3-caption', storeId: 'img-common-3-caption', label: 'Caption', section: 'image-mgt', subsection: 'common-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-common-4', storeId: 'img-common-4', label: 'Common Area 4 - Additional', section: 'image-mgt', subsection: 'common-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-common-4-caption', storeId: 'img-common-4-caption', label: 'Caption', section: 'image-mgt', subsection: 'common-photos', type: 'text', inputSource: 'user-input', required: false },

  // --- UNIT INTERIOR PHOTOS (6 slots with captions) ---
  { id: 'img-unit-1', storeId: 'img-unit-1', label: 'Unit Interior 1 - Living Room', section: 'image-mgt', subsection: 'unit-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-unit-1-caption', storeId: 'img-unit-1-caption', label: 'Caption', section: 'image-mgt', subsection: 'unit-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: '1101 - Typical Bedroom 1' },
  { id: 'img-unit-2', storeId: 'img-unit-2', label: 'Unit Interior 2 - Kitchen', section: 'image-mgt', subsection: 'unit-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-unit-2-caption', storeId: 'img-unit-2-caption', label: 'Caption', section: 'image-mgt', subsection: 'unit-photos', type: 'text', inputSource: 'user-input', required: false, defaultValue: '1101 - Typical Bedroom 2' },
  { id: 'img-unit-3', storeId: 'img-unit-3', label: 'Unit Interior 3 - Bedroom', section: 'image-mgt', subsection: 'unit-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-unit-3-caption', storeId: 'img-unit-3-caption', label: 'Caption', section: 'image-mgt', subsection: 'unit-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-unit-4', storeId: 'img-unit-4', label: 'Unit Interior 4 - Bathroom', section: 'image-mgt', subsection: 'unit-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-unit-4-caption', storeId: 'img-unit-4-caption', label: 'Caption', section: 'image-mgt', subsection: 'unit-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-unit-5', storeId: 'img-unit-5', label: 'Unit Interior 5 - Additional Room', section: 'image-mgt', subsection: 'unit-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-unit-5-caption', storeId: 'img-unit-5-caption', label: 'Caption', section: 'image-mgt', subsection: 'unit-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-unit-6', storeId: 'img-unit-6', label: 'Unit Interior 6 - Additional', section: 'image-mgt', subsection: 'unit-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-unit-6-caption', storeId: 'img-unit-6-caption', label: 'Caption', section: 'image-mgt', subsection: 'unit-photos', type: 'text', inputSource: 'user-input', required: false },

  // --- BUILDING SYSTEMS PHOTOS (4 slots with captions) ---
  { id: 'img-systems-1', storeId: 'img-systems-1', label: 'Building Systems 1 - Mechanical Room', section: 'image-mgt', subsection: 'systems-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-systems-1-caption', storeId: 'img-systems-1-caption', label: 'Caption', section: 'image-mgt', subsection: 'systems-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-systems-2', storeId: 'img-systems-2', label: 'Building Systems 2 - Electrical Panel', section: 'image-mgt', subsection: 'systems-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-systems-2-caption', storeId: 'img-systems-2-caption', label: 'Caption', section: 'image-mgt', subsection: 'systems-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-systems-3', storeId: 'img-systems-3', label: 'Building Systems 3 - Plumbing/Water Heater', section: 'image-mgt', subsection: 'systems-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-systems-3-caption', storeId: 'img-systems-3-caption', label: 'Caption', section: 'image-mgt', subsection: 'systems-photos', type: 'text', inputSource: 'user-input', required: false },
  { id: 'img-systems-4', storeId: 'img-systems-4', label: 'Building Systems 4 - HVAC/Furnace', section: 'image-mgt', subsection: 'systems-photos', type: 'image', inputSource: 'user-input', required: false },
  { id: 'img-systems-4-caption', storeId: 'img-systems-4-caption', label: 'Caption', section: 'image-mgt', subsection: 'systems-photos', type: 'text', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: COVER PAGE
  // ============================================================================

  { id: 'cover-photo', storeId: 'cover-photo', label: 'Cover Photo', section: 'cover', type: 'image', inputSource: 'user-input', required: false },
  { id: 'property-type-display', storeId: 'property-type-display', label: 'Property Type', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'property-name', storeId: 'property-name', label: 'Property Name', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'street-address', storeId: 'street-address', label: 'Street Address', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'city', storeId: 'city', label: 'City', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'city-formal', storeId: 'city-formal', label: 'City (Formal Name)', section: 'cover', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_CityFormal' },
  { id: 'province', storeId: 'province', label: 'Province', section: 'cover', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'province-abbr', storeId: 'province-abbr', label: 'Province Abbreviation', section: 'cover', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'property-full-address', storeId: 'property-full-address', label: 'Full Property Address', section: 'cover', type: 'text', inputSource: 'calculated', required: false },
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
  { id: 'client-title', storeId: 'client-title', label: 'Client Title', section: 'cover', subsection: 'client-info', type: 'text', inputSource: 'user-input', required: false },

  // Cover - Appraiser Info Subsection
  { id: 'appraiser-name', storeId: 'appraiser-name', label: 'Appraiser Name', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: true },
  { id: 'appraiser-credentials', storeId: 'appraiser-credentials', label: 'Appraiser Credentials', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'appraiser-title', storeId: 'appraiser-title', label: 'Appraiser Title', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'appraiser-company', storeId: 'appraiser-company', label: 'Company Name', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: true },
  { id: 'appraiser-address', storeId: 'appraiser-address', label: 'Company Address', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-city', storeId: 'appraiser-city', label: 'Company City', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-province', storeId: 'appraiser-province', label: 'Company Province', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-postal', storeId: 'appraiser-postal', label: 'Company Postal Code', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-phone', storeId: 'appraiser-phone', label: 'Company Phone', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-website', storeId: 'appraiser-website', label: 'Company Website', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'appraiser-email', storeId: 'appraiser-email', label: 'Appraiser Email', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'appraiser-aic-number', storeId: 'appraiser-aic-number', label: 'AIC Number', section: 'cover', subsection: 'appraiser-info', type: 'text', inputSource: 'user-input', required: false },

  // Cover - Location Fields (for Exec Summary)
  { id: 'postal-code', storeId: 'postal-code', label: 'Postal Code', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'market', storeId: 'market', label: 'Market', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'submarket', storeId: 'submarket', label: 'Submarket', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'user-input', required: false },
  { id: 'latitude', storeId: 'latitude', label: 'Latitude', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'longitude', storeId: 'longitude', label: 'Longitude', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'auto-filled', required: false },
  { id: 'county', storeId: 'county', label: 'County', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_County' },
  { id: 'msa', storeId: 'msa', label: 'MSA', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_MSA' },
  { id: 'geocode', storeId: 'geocode', label: 'Geocode', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_Geocode' },
  { id: 'census-tract', storeId: 'census-tract', label: 'Census Tract', section: 'cover', subsection: 'location-info', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_Census' },

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
  { id: 'stabilized-occupancy', storeId: 'stabilized-occupancy', label: 'Stabilized Occupancy (%)', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_OccupancyStabilized' },
  { id: 'quality', storeId: 'quality', label: 'Quality', section: 'exec', subsection: 'property-identification', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_Quality' },
  { id: 'condition', storeId: 'condition', label: 'Condition', section: 'exec', subsection: 'property-identification', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_Condition' },
  { id: 'appeal', storeId: 'appeal', label: 'Appeal', section: 'exec', subsection: 'property-identification', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_Appeal' },
  { id: 'parking', storeId: 'parking', label: 'Parking', section: 'exec', subsection: 'property-identification', type: 'text', inputSource: 'auto-filled', required: false, valcreRange: 'Subject_Parking' },
  { id: 'total-units', storeId: 'total-units', label: 'Total Units', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'stories', storeId: 'stories', label: 'Number of Stories', section: 'exec', subsection: 'property-identification', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'building-format', storeId: 'building-format', label: 'Building Format', section: 'exec', subsection: 'property-identification', type: 'text', inputSource: 'auto-filled', required: false },

  // Exec - Value Summary Subsection
  { id: 'concluded-value', storeId: 'concluded-value', label: 'Concluded Value', section: 'exec', subsection: 'value-summary', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'value-scenario1', storeId: 'value-scenario1', label: 'Value Scenario 1', section: 'exec', subsection: 'value-summary', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'Value_Scenario1' },
  { id: 'value-scenario1-psf', storeId: 'value-scenario1-psf', label: 'Value Scenario 1 ($/SF)', section: 'exec', subsection: 'value-summary', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'Value_Scenario1PerUofM' },
  { id: 'value-scenario1-text', storeId: 'value-scenario1-text', label: 'Value Scenario 1 (Text)', section: 'exec', subsection: 'value-summary', type: 'text', inputSource: 'calculated', required: false, valcreRange: 'Value_Scenario1Text' },
  { id: 'value-scenario2', storeId: 'value-scenario2', label: 'Value Scenario 2', section: 'exec', subsection: 'value-summary', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'Value_Scenario2' },
  { id: 'value-scenario2-text', storeId: 'value-scenario2-text', label: 'Value Scenario 2 (Text)', section: 'exec', subsection: 'value-summary', type: 'text', inputSource: 'calculated', required: false, valcreRange: 'Value_Scenario2Text' },
  { id: 'value-scenario3', storeId: 'value-scenario3', label: 'Value Scenario 3', section: 'exec', subsection: 'value-summary', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'Value_Scenario3' },
  { id: 'value-scenario3-text', storeId: 'value-scenario3-text', label: 'Value Scenario 3 (Text)', section: 'exec', subsection: 'value-summary', type: 'text', inputSource: 'calculated', required: false, valcreRange: 'Value_Scenario3Text' },
  { id: 'value-sa-conclusion', storeId: 'value-sa-conclusion', label: 'Sales Approach Value Conclusion', section: 'exec', subsection: 'value-summary', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'Value_SARecScenario1' },
  { id: 'value-ia-conclusion', storeId: 'value-ia-conclusion', label: 'Income Approach Value Conclusion', section: 'exec', subsection: 'value-summary', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'Value_IARecScenario1' },
  { id: 'value-insurable', storeId: 'value-insurable', label: 'Insurable Value', section: 'exec', subsection: 'value-summary', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'Value_Insurable' },
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

  // Site - Usable Area and Qualitative Ratings (for Exec Summary)
  { id: 'legal-description', storeId: 'legal-description', label: 'Legal Description', section: 'site', subsection: 'site-area', type: 'text', inputSource: 'user-input', required: false },
  { id: 'land-area-usable-sf', storeId: 'land-area-usable-sf', label: 'Usable Land Area (SF)', section: 'site', subsection: 'site-area', type: 'number', inputSource: 'user-input', required: false },
  { id: 'land-area-usable-acres', storeId: 'land-area-usable-acres', label: 'Usable Land Area (Acres)', section: 'site', subsection: 'site-area', type: 'number', inputSource: 'user-input', required: false },
  { id: 'site-quality', storeId: 'site-quality', label: 'Site Quality', section: 'site', subsection: 'site-conditions', type: 'text', inputSource: 'user-input', required: false },
  { id: 'site-utility', storeId: 'site-utility', label: 'Site Utility', section: 'site', subsection: 'site-conditions', type: 'text', inputSource: 'user-input', required: false },
  { id: 'building-quality', storeId: 'building-quality', label: 'Building Quality', section: 'site', subsection: 'site-conditions', type: 'text', inputSource: 'user-input', required: false },
  { id: 'building-appeal', storeId: 'building-appeal', label: 'Building Appeal', section: 'site', subsection: 'site-conditions', type: 'text', inputSource: 'user-input', required: false },

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

  // Improvements - Additional Fields (for Exec Summary)
  { id: 'tenancy', storeId: 'tenancy', label: 'Tenancy', section: 'impv', subsection: 'building-overview', type: 'text', inputSource: 'user-input', required: false },
  { id: 'gba', storeId: 'gba', label: 'Gross Building Area (SF)', section: 'impv', subsection: 'building-overview', type: 'number', inputSource: 'auto-filled', required: false },
  { id: 'density-units-acre', storeId: 'density-units-acre', label: 'Density (Units/Acre)', section: 'impv', subsection: 'building-overview', type: 'number', inputSource: 'calculated', required: false },
  { id: 'actual-age', storeId: 'actual-age', label: 'Actual Age (Years)', section: 'impv', subsection: 'condition', type: 'number', inputSource: 'calculated', required: false },
  { id: 'effective-age', storeId: 'effective-age', label: 'Effective Age (Years)', section: 'impv', subsection: 'condition', type: 'number', inputSource: 'user-input', required: false },
  { id: 'economic-life', storeId: 'economic-life', label: 'Economic Life (Years)', section: 'impv', subsection: 'condition', type: 'number', inputSource: 'user-input', required: false },
  { id: 'remaining-useful-life', storeId: 'remaining-useful-life', label: 'Remaining Useful Life (Years)', section: 'impv', subsection: 'condition', type: 'number', inputSource: 'calculated', required: false },

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
  { id: 'calc-type1-contract-rent', storeId: 'calc-type1-contract-rent', label: 'Contract Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'calc-type1-cont-v-market', storeId: 'calc-type1-cont-v-market', label: 'Contract vs Market %', section: 'calc', subsection: 'calc-unit-mix', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-type1-per-unit', storeId: 'calc-type1-per-unit', label: 'Revenue/Unit', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-type1-per-sf', storeId: 'calc-type1-per-sf', label: 'Revenue/SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'calculated', required: false },

  { id: 'calc-type2-name', storeId: 'calc-type2-name', label: 'Unit Type 2', section: 'calc', subsection: 'calc-unit-mix', type: 'text', inputSource: 'user-input', required: false },
  { id: 'calc-type2-count', storeId: 'calc-type2-count', label: 'Unit Count', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type2-sf', storeId: 'calc-type2-sf', label: 'Avg SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type2-rent', storeId: 'calc-type2-rent', label: 'Market Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type2-annual', storeId: 'calc-type2-annual', label: 'Annual Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-type2-contract-rent', storeId: 'calc-type2-contract-rent', label: 'Contract Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'calc-type2-cont-v-market', storeId: 'calc-type2-cont-v-market', label: 'Contract vs Market %', section: 'calc', subsection: 'calc-unit-mix', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-type2-per-unit', storeId: 'calc-type2-per-unit', label: 'Revenue/Unit', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-type2-per-sf', storeId: 'calc-type2-per-sf', label: 'Revenue/SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'calculated', required: false },

  { id: 'calc-type3-name', storeId: 'calc-type3-name', label: 'Unit Type 3', section: 'calc', subsection: 'calc-unit-mix', type: 'text', inputSource: 'user-input', required: false },
  { id: 'calc-type3-count', storeId: 'calc-type3-count', label: 'Unit Count', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type3-sf', storeId: 'calc-type3-sf', label: 'Avg SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type3-rent', storeId: 'calc-type3-rent', label: 'Market Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type3-annual', storeId: 'calc-type3-annual', label: 'Annual Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-type3-contract-rent', storeId: 'calc-type3-contract-rent', label: 'Contract Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'calc-type3-cont-v-market', storeId: 'calc-type3-cont-v-market', label: 'Contract vs Market %', section: 'calc', subsection: 'calc-unit-mix', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-type3-per-unit', storeId: 'calc-type3-per-unit', label: 'Revenue/Unit', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-type3-per-sf', storeId: 'calc-type3-per-sf', label: 'Revenue/SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'calculated', required: false },

  { id: 'calc-type4-name', storeId: 'calc-type4-name', label: 'Unit Type 4', section: 'calc', subsection: 'calc-unit-mix', type: 'text', inputSource: 'user-input', required: false },
  { id: 'calc-type4-count', storeId: 'calc-type4-count', label: 'Unit Count', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type4-sf', storeId: 'calc-type4-sf', label: 'Avg SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type4-rent', storeId: 'calc-type4-rent', label: 'Market Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-type4-annual', storeId: 'calc-type4-annual', label: 'Annual Revenue', section: 'calc', subsection: 'calc-unit-mix', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-type4-contract-rent', storeId: 'calc-type4-contract-rent', label: 'Contract Rent/Mo', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'calc-type4-cont-v-market', storeId: 'calc-type4-cont-v-market', label: 'Contract vs Market %', section: 'calc', subsection: 'calc-unit-mix', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-type4-per-unit', storeId: 'calc-type4-per-unit', label: 'Revenue/Unit', section: 'calc', subsection: 'calc-unit-mix', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-type4-per-sf', storeId: 'calc-type4-per-sf', label: 'Revenue/SF', section: 'calc', subsection: 'calc-unit-mix', type: 'number', inputSource: 'calculated', required: false },

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
  { id: 'dircap-rent-total', storeId: 'dircap-rent-total', label: 'Total Rental Revenue', section: 'calc', subsection: 'calc-other-income', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_Rent' },
  { id: 'dircap-reimb-total', storeId: 'dircap-reimb-total', label: 'Reimbursement Total', section: 'calc', subsection: 'calc-other-income', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_Rmb' },
  { id: 'dircap-misc-total', storeId: 'dircap-misc-total', label: 'Miscellaneous Income Total', section: 'calc', subsection: 'calc-other-income', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_Misc' },
  { id: 'calc-pgr', storeId: 'calc-pgr', label: 'Potential Gross Revenue', section: 'calc', subsection: 'calc-other-income', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-pgr-per-unit', storeId: 'calc-pgr-per-unit', label: 'PGR Per Unit', section: 'calc', subsection: 'calc-other-income', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-pgr-per-sf', storeId: 'calc-pgr-per-sf', label: 'PGR Per SF', section: 'calc', subsection: 'calc-other-income', type: 'calculated', inputSource: 'calculated', required: false },

  // Calc - Vacancy Subsection
  { id: 'calc-vacancy-rate', storeId: 'calc-vacancy-rate', label: 'Vacancy Rate (%)', section: 'calc', subsection: 'calc-vacancy', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-bad-debt-rate', storeId: 'calc-bad-debt-rate', label: 'Bad Debt Rate (%)', section: 'calc', subsection: 'calc-vacancy', type: 'number', inputSource: 'user-input', required: false },
  { id: 'calc-concessions-rate', storeId: 'calc-concessions-rate', label: 'Concessions Rate (%)', section: 'calc', subsection: 'calc-vacancy', type: 'number', inputSource: 'user-input', required: false },
  { id: 'dircap-vacancy-total', storeId: 'dircap-vacancy-total', label: 'Vacancy Total', section: 'calc', subsection: 'calc-vacancy', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_VacancyTotal' },
  { id: 'dircap-concession-total', storeId: 'dircap-concession-total', label: 'Concession Total', section: 'calc', subsection: 'calc-vacancy', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_ConcessionTotal' },
  { id: 'dircap-loss-total', storeId: 'dircap-loss-total', label: 'Total Loss', section: 'calc', subsection: 'calc-vacancy', type: 'currency', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_LossTotal' },
  { id: 'calc-vacancy-loss', storeId: 'calc-vacancy-loss', label: 'Total Vacancy & Loss', section: 'calc', subsection: 'calc-vacancy', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-egr', storeId: 'calc-egr', label: 'Effective Gross Revenue', section: 'calc', subsection: 'calc-vacancy', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-egr-per-unit', storeId: 'calc-egr-per-unit', label: 'EGR Per Unit', section: 'calc', subsection: 'calc-vacancy', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-egr-per-sf', storeId: 'calc-egr-per-sf', label: 'EGR Per SF', section: 'calc', subsection: 'calc-vacancy', type: 'calculated', inputSource: 'calculated', required: false },

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
  { id: 'dircap-expense-ratio', storeId: 'dircap-expense-ratio', label: 'Expense Ratio', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_ExpenseRatio' },

  // Expense Line Labels (Valcre Direct Capitalization)
  { id: 'dircap-expense01-label', storeId: 'dircap-expense01-label', label: 'Expense Line 01', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense01' },
  { id: 'dircap-expense02-label', storeId: 'dircap-expense02-label', label: 'Expense Line 02', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense02' },
  { id: 'dircap-expense03-label', storeId: 'dircap-expense03-label', label: 'Expense Line 03', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense03' },
  { id: 'dircap-expense04-label', storeId: 'dircap-expense04-label', label: 'Expense Line 04', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense04' },
  { id: 'dircap-expense05-label', storeId: 'dircap-expense05-label', label: 'Expense Line 05', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense05' },
  { id: 'dircap-expense06-label', storeId: 'dircap-expense06-label', label: 'Expense Line 06', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense06' },
  { id: 'dircap-expense07-label', storeId: 'dircap-expense07-label', label: 'Expense Line 07', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense07' },
  { id: 'dircap-expense08-label', storeId: 'dircap-expense08-label', label: 'Expense Line 08', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense08' },
  { id: 'dircap-expense09-label', storeId: 'dircap-expense09-label', label: 'Expense Line 09', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense09' },
  { id: 'dircap-expense10-label', storeId: 'dircap-expense10-label', label: 'Expense Line 10', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense10' },
  { id: 'dircap-expense11-label', storeId: 'dircap-expense11-label', label: 'Expense Line 11', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense11' },
  { id: 'dircap-expense12-label', storeId: 'dircap-expense12-label', label: 'Expense Line 12', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense12' },
  { id: 'dircap-expense13-label', storeId: 'dircap-expense13-label', label: 'Expense Line 13', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense13' },
  { id: 'dircap-expense14-label', storeId: 'dircap-expense14-label', label: 'Expense Line 14', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense14' },
  { id: 'dircap-expense15-label', storeId: 'dircap-expense15-label', label: 'Expense Line 15', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense15' },
  { id: 'dircap-expense16-label', storeId: 'dircap-expense16-label', label: 'Expense Line 16', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense16' },
  { id: 'dircap-expense17-label', storeId: 'dircap-expense17-label', label: 'Expense Line 17', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense17' },
  { id: 'dircap-expense18-label', storeId: 'dircap-expense18-label', label: 'Expense Line 18', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense18' },
  { id: 'dircap-expense19-label', storeId: 'dircap-expense19-label', label: 'Expense Line 19', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense19' },
  { id: 'dircap-expense20-label', storeId: 'dircap-expense20-label', label: 'Expense Line 20', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense20' },
  { id: 'dircap-expense21-label', storeId: 'dircap-expense21-label', label: 'Expense Line 21', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense21' },
  { id: 'dircap-expense22-label', storeId: 'dircap-expense22-label', label: 'Expense Line 22', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense22' },
  { id: 'dircap-expense23-label', storeId: 'dircap-expense23-label', label: 'Expense Line 23', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense23' },
  { id: 'dircap-expense24-label', storeId: 'dircap-expense24-label', label: 'Expense Line 24', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense24' },
  { id: 'dircap-expense25-label', storeId: 'dircap-expense25-label', label: 'Expense Line 25', section: 'calc', subsection: 'calc-expenses', type: 'text', inputSource: 'user-input', required: false, valcreRange: 'IA_DirCap_Expense25' },

  // Expense Breakdown - Taxes
  { id: 'calc-exp-taxes-pct-pgr', storeId: 'calc-exp-taxes-pct-pgr', label: 'Taxes % of PGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-taxes-pct-egr', storeId: 'calc-exp-taxes-pct-egr', label: 'Taxes % of EGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-taxes-per-unit', storeId: 'calc-exp-taxes-per-unit', label: 'Taxes/Unit', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-exp-taxes-per-sf', storeId: 'calc-exp-taxes-per-sf', label: 'Taxes/SF', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'calculated', required: false },
  { id: 'calc-exp-taxes-annual', storeId: 'calc-exp-taxes-annual', label: 'Taxes Annual', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'user-input', required: false },

  // Expense Breakdown - Insurance
  { id: 'calc-exp-insurance-pct-pgr', storeId: 'calc-exp-insurance-pct-pgr', label: 'Insurance % of PGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-insurance-pct-egr', storeId: 'calc-exp-insurance-pct-egr', label: 'Insurance % of EGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-insurance-per-unit', storeId: 'calc-exp-insurance-per-unit', label: 'Insurance/Unit', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-exp-insurance-per-sf', storeId: 'calc-exp-insurance-per-sf', label: 'Insurance/SF', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'calculated', required: false },
  { id: 'calc-exp-insurance-annual', storeId: 'calc-exp-insurance-annual', label: 'Insurance Annual', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'user-input', required: false },

  // Expense Breakdown - Repairs
  { id: 'calc-exp-repairs-pct-pgr', storeId: 'calc-exp-repairs-pct-pgr', label: 'Repairs % of PGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-repairs-pct-egr', storeId: 'calc-exp-repairs-pct-egr', label: 'Repairs % of EGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-repairs-per-unit', storeId: 'calc-exp-repairs-per-unit', label: 'Repairs/Unit', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-exp-repairs-per-sf', storeId: 'calc-exp-repairs-per-sf', label: 'Repairs/SF', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'calculated', required: false },
  { id: 'calc-exp-repairs-annual', storeId: 'calc-exp-repairs-annual', label: 'Repairs Annual', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'user-input', required: false },

  // Expense Breakdown - Payroll
  { id: 'calc-exp-payroll-pct-pgr', storeId: 'calc-exp-payroll-pct-pgr', label: 'Payroll % of PGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-payroll-pct-egr', storeId: 'calc-exp-payroll-pct-egr', label: 'Payroll % of EGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-payroll-per-unit', storeId: 'calc-exp-payroll-per-unit', label: 'Payroll/Unit', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-exp-payroll-per-sf', storeId: 'calc-exp-payroll-per-sf', label: 'Payroll/SF', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'calculated', required: false },
  { id: 'calc-exp-payroll-annual', storeId: 'calc-exp-payroll-annual', label: 'Payroll Annual', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'user-input', required: false },

  // Expense Breakdown - Utilities
  { id: 'calc-exp-utilities-pct-pgr', storeId: 'calc-exp-utilities-pct-pgr', label: 'Utilities % of PGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-utilities-pct-egr', storeId: 'calc-exp-utilities-pct-egr', label: 'Utilities % of EGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-utilities-per-unit', storeId: 'calc-exp-utilities-per-unit', label: 'Utilities/Unit', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-exp-utilities-per-sf', storeId: 'calc-exp-utilities-per-sf', label: 'Utilities/SF', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'calculated', required: false },
  { id: 'calc-exp-utilities-annual', storeId: 'calc-exp-utilities-annual', label: 'Utilities Annual', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'user-input', required: false },

  // Expense Breakdown - Management
  { id: 'calc-exp-management-pct-pgr', storeId: 'calc-exp-management-pct-pgr', label: 'Management % of PGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-management-pct-egr', storeId: 'calc-exp-management-pct-egr', label: 'Management % of EGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-management-per-unit', storeId: 'calc-exp-management-per-unit', label: 'Management/Unit', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-exp-management-per-sf', storeId: 'calc-exp-management-per-sf', label: 'Management/SF', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'calculated', required: false },
  { id: 'calc-exp-management-annual', storeId: 'calc-exp-management-annual', label: 'Management Annual', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'user-input', required: false },

  // Expense Breakdown - Other
  { id: 'calc-exp-other-pct-pgr', storeId: 'calc-exp-other-pct-pgr', label: 'Other % of PGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-other-pct-egr', storeId: 'calc-exp-other-pct-egr', label: 'Other % of EGR', section: 'calc', subsection: 'calc-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-exp-other-per-unit', storeId: 'calc-exp-other-per-unit', label: 'Other/Unit', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'calc-exp-other-per-sf', storeId: 'calc-exp-other-per-sf', label: 'Other/SF', section: 'calc', subsection: 'calc-expenses', type: 'number', inputSource: 'calculated', required: false },
  { id: 'calc-exp-other-annual', storeId: 'calc-exp-other-annual', label: 'Other Annual', section: 'calc', subsection: 'calc-expenses', type: 'currency', inputSource: 'user-input', required: false },

  { id: 'calc-expenses-total', storeId: 'calc-expenses-total', label: 'Total Expenses', section: 'calc', subsection: 'calc-expenses', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-expense-ratio', storeId: 'calc-expense-ratio', label: 'Expense Ratio (%)', section: 'calc', subsection: 'calc-expenses', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-expenses-per-unit', storeId: 'calc-expenses-per-unit', label: 'Expenses Per Unit', section: 'calc', subsection: 'calc-expenses', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'calc-expenses-per-sf', storeId: 'calc-expenses-per-sf', label: 'Expenses Per SF', section: 'calc', subsection: 'calc-expenses', type: 'calculated', inputSource: 'calculated', required: false },

  // Expenses - Comment Fields (Page 45)
  { id: 'exp-taxes-comment', storeId: 'exp-taxes-comment', label: 'Taxes Comment', section: 'expenses', subsection: 'exp-comments', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exp-insurance-comment', storeId: 'exp-insurance-comment', label: 'Insurance Comment', section: 'expenses', subsection: 'exp-comments', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exp-repairs-comment', storeId: 'exp-repairs-comment', label: 'Repairs Comment', section: 'expenses', subsection: 'exp-comments', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exp-payroll-comment', storeId: 'exp-payroll-comment', label: 'Payroll Comment', section: 'expenses', subsection: 'exp-comments', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exp-utilities-comment', storeId: 'exp-utilities-comment', label: 'Utilities Comment', section: 'expenses', subsection: 'exp-comments', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exp-management-comment', storeId: 'exp-management-comment', label: 'Management Comment', section: 'expenses', subsection: 'exp-comments', type: 'text', inputSource: 'user-input', required: false },
  { id: 'exp-other-comment', storeId: 'exp-other-comment', label: 'Other Comment', section: 'expenses', subsection: 'exp-comments', type: 'text', inputSource: 'user-input', required: false },

  // Calc - Cap Rate Subsection
  { id: 'calc-cap-rate', storeId: 'calc-cap-rate', label: 'Cap Rate (%)', section: 'calc', subsection: 'calc-cap', type: 'number', inputSource: 'user-input', required: false },
  { id: 'cap-rate-average', storeId: 'cap-rate-average', label: 'Cap Rate Average', section: 'calc', subsection: 'calc-cap', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'cap-rate-range-high', storeId: 'cap-rate-range-high', label: 'Cap Rate Range High', section: 'calc', subsection: 'calc-cap', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'cap-rate-range-low', storeId: 'cap-rate-range-low', label: 'Cap Rate Range Low', section: 'calc', subsection: 'calc-cap', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'dircap-blend', storeId: 'dircap-blend', label: 'Cap Rate Blend', section: 'calc', subsection: 'calc-cap', type: 'percentage', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_Blend' },
  { id: 'dircap-caprate1', storeId: 'dircap-caprate1', label: 'Capitalization Rate 1', section: 'calc', subsection: 'calc-cap', type: 'percentage', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_CapRate1' },
  { id: 'dircap-caprate2', storeId: 'dircap-caprate2', label: 'Capitalization Rate 2', section: 'calc', subsection: 'calc-cap', type: 'percentage', inputSource: 'calculated', required: false, valcreRange: 'IA_DirCap_CapRate2' },

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

  // Calc - Revenue Percentages Subsection (Page 44 projection percentages)
  { id: 'calc-revenue-multifamily-pct-pgr', storeId: 'calc-revenue-multifamily-pct-pgr', label: 'Multifamily Revenue % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-revenue-rental-pct-pgr', storeId: 'calc-revenue-rental-pct-pgr', label: 'Rental Revenue % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-revenue-parking-pct-pgr', storeId: 'calc-revenue-parking-pct-pgr', label: 'Parking Revenue % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-revenue-laundry-pct-pgr', storeId: 'calc-revenue-laundry-pct-pgr', label: 'Laundry Revenue % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-revenue-misc-pct-pgr', storeId: 'calc-revenue-misc-pct-pgr', label: 'Misc Revenue % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-pgr-pct-pgr', storeId: 'calc-pgr-pct-pgr', label: 'PGR % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-egr-pct-pgr', storeId: 'calc-egr-pct-pgr', label: 'EGR % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'calc-noi-pct-pgr', storeId: 'calc-noi-pct-pgr', label: 'NOI % PGR', section: 'calc', subsection: 'calc-revenue-pct', type: 'percentage', inputSource: 'calculated', required: false },

  // ============================================================================
  // SECTION: LAND VALUE
  // ============================================================================

  { id: 'land-value-conclusion', storeId: 'land-value-conclusion', label: 'Land Value Conclusion', section: 'land1', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: COST APPROACH
  // ============================================================================

  { id: 'cost-approach-conclusion', storeId: 'cost-approach-conclusion', label: 'Cost Approach Conclusion', section: 'cost-s', type: 'textarea', inputSource: 'user-input', required: false },

  // ============================================================================
  // SECTION: HISTORICAL (Page 44 Operating History - YTD Actuals)
  // ============================================================================

  // Hist - Revenue Subsection (18 fields)
  { id: 'hist-revenue-multifamily-total', storeId: 'hist-revenue-multifamily-total', label: 'Multifamily Revenue', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-revenue-multifamily-per-unit', storeId: 'hist-revenue-multifamily-per-unit', label: 'Multifamily Revenue/Unit', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-multifamily-pct-pgr', storeId: 'hist-revenue-multifamily-pct-pgr', label: 'Multifamily Revenue % PGR', section: 'hist', subsection: 'hist-revenue', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-rental-total', storeId: 'hist-revenue-rental-total', label: 'Rental Revenue', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-revenue-rental-per-unit', storeId: 'hist-revenue-rental-per-unit', label: 'Rental Revenue/Unit', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-rental-pct-pgr', storeId: 'hist-revenue-rental-pct-pgr', label: 'Rental Revenue % PGR', section: 'hist', subsection: 'hist-revenue', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-parking-total', storeId: 'hist-revenue-parking-total', label: 'Parking Revenue', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-revenue-parking-per-unit', storeId: 'hist-revenue-parking-per-unit', label: 'Parking Revenue/Unit', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-parking-pct-pgr', storeId: 'hist-revenue-parking-pct-pgr', label: 'Parking Revenue % PGR', section: 'hist', subsection: 'hist-revenue', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-laundry-total', storeId: 'hist-revenue-laundry-total', label: 'Laundry Revenue', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-revenue-laundry-per-unit', storeId: 'hist-revenue-laundry-per-unit', label: 'Laundry Revenue/Unit', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-laundry-pct-pgr', storeId: 'hist-revenue-laundry-pct-pgr', label: 'Laundry Revenue % PGR', section: 'hist', subsection: 'hist-revenue', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-misc-total', storeId: 'hist-revenue-misc-total', label: 'Misc Revenue', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-revenue-misc-per-unit', storeId: 'hist-revenue-misc-per-unit', label: 'Misc Revenue/Unit', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-revenue-misc-pct-pgr', storeId: 'hist-revenue-misc-pct-pgr', label: 'Misc Revenue % PGR', section: 'hist', subsection: 'hist-revenue', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-pgr-total', storeId: 'hist-pgr-total', label: 'PGR Total', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-pgr-per-unit', storeId: 'hist-pgr-per-unit', label: 'PGR/Unit', section: 'hist', subsection: 'hist-revenue', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-pgr-pct', storeId: 'hist-pgr-pct', label: 'PGR %', section: 'hist', subsection: 'hist-revenue', type: 'percentage', inputSource: 'calculated', required: false },

  // Hist - Vacancy/EGR Subsection (6 fields)
  { id: 'hist-vacancy-total', storeId: 'hist-vacancy-total', label: 'Vacancy Loss', section: 'hist', subsection: 'hist-vacancy', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-vacancy-per-unit', storeId: 'hist-vacancy-per-unit', label: 'Vacancy/Unit', section: 'hist', subsection: 'hist-vacancy', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-vacancy-pct-pgr', storeId: 'hist-vacancy-pct-pgr', label: 'Vacancy % PGR', section: 'hist', subsection: 'hist-vacancy', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-egr-total', storeId: 'hist-egr-total', label: 'EGR Total', section: 'hist', subsection: 'hist-vacancy', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-egr-per-unit', storeId: 'hist-egr-per-unit', label: 'EGR/Unit', section: 'hist', subsection: 'hist-vacancy', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-egr-pct-pgr', storeId: 'hist-egr-pct-pgr', label: 'EGR % PGR', section: 'hist', subsection: 'hist-vacancy', type: 'percentage', inputSource: 'calculated', required: false },

  // Hist - Expenses Subsection (24 fields)
  { id: 'hist-exp-taxes-total', storeId: 'hist-exp-taxes-total', label: 'Taxes', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-exp-taxes-per-unit', storeId: 'hist-exp-taxes-per-unit', label: 'Taxes/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-taxes-pct-pgr', storeId: 'hist-exp-taxes-pct-pgr', label: 'Taxes % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-exp-insurance-total', storeId: 'hist-exp-insurance-total', label: 'Insurance', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-exp-insurance-per-unit', storeId: 'hist-exp-insurance-per-unit', label: 'Insurance/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-insurance-pct-pgr', storeId: 'hist-exp-insurance-pct-pgr', label: 'Insurance % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-exp-repairs-total', storeId: 'hist-exp-repairs-total', label: 'Repairs & Maintenance', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-exp-repairs-per-unit', storeId: 'hist-exp-repairs-per-unit', label: 'Repairs/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-repairs-pct-pgr', storeId: 'hist-exp-repairs-pct-pgr', label: 'Repairs % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-exp-payroll-total', storeId: 'hist-exp-payroll-total', label: 'Payroll', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-exp-payroll-per-unit', storeId: 'hist-exp-payroll-per-unit', label: 'Payroll/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-payroll-pct-pgr', storeId: 'hist-exp-payroll-pct-pgr', label: 'Payroll % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-exp-utilities-total', storeId: 'hist-exp-utilities-total', label: 'Utilities', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-exp-utilities-per-unit', storeId: 'hist-exp-utilities-per-unit', label: 'Utilities/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-utilities-pct-pgr', storeId: 'hist-exp-utilities-pct-pgr', label: 'Utilities % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-exp-management-total', storeId: 'hist-exp-management-total', label: 'Management', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-exp-management-per-unit', storeId: 'hist-exp-management-per-unit', label: 'Management/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-management-pct-pgr', storeId: 'hist-exp-management-pct-pgr', label: 'Management % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-exp-other-total', storeId: 'hist-exp-other-total', label: 'Other Expenses', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'hist-exp-other-per-unit', storeId: 'hist-exp-other-per-unit', label: 'Other/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-other-pct-pgr', storeId: 'hist-exp-other-pct-pgr', label: 'Other % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'hist-exp-total-total', storeId: 'hist-exp-total-total', label: 'Total Expenses', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-total-per-unit', storeId: 'hist-exp-total-per-unit', label: 'Total Expenses/Unit', section: 'hist', subsection: 'hist-expenses', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-exp-total-pct-pgr', storeId: 'hist-exp-total-pct-pgr', label: 'Total Expenses % PGR', section: 'hist', subsection: 'hist-expenses', type: 'percentage', inputSource: 'calculated', required: false },

  // Hist - NOI Subsection (3 fields)
  { id: 'hist-noi-total', storeId: 'hist-noi-total', label: 'NOI', section: 'hist', subsection: 'hist-noi', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-noi-per-unit', storeId: 'hist-noi-per-unit', label: 'NOI/Unit', section: 'hist', subsection: 'hist-noi', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'hist-noi-pct-pgr', storeId: 'hist-noi-pct-pgr', label: 'NOI % PGR', section: 'hist', subsection: 'hist-noi', type: 'percentage', inputSource: 'calculated', required: false },

  // ============================================================================
  // SECTION: RENT ROLL (Page 37)
  // ============================================================================

  // Rent Roll - Unit Type 1 Subsection (12 fields)
  { id: 'rentroll-type1-name', storeId: 'rentroll-type1-name', label: 'Type 1 Name', section: 'rentroll', subsection: 'rentroll-type1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'rentroll-type1-desc', storeId: 'rentroll-type1-desc', label: 'Type 1 Description', section: 'rentroll', subsection: 'rentroll-type1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'rentroll-type1-occ', storeId: 'rentroll-type1-occ', label: 'Type 1 Occupied', section: 'rentroll', subsection: 'rentroll-type1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rentroll-type1-vac', storeId: 'rentroll-type1-vac', label: 'Type 1 Vacant', section: 'rentroll', subsection: 'rentroll-type1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rentroll-type1-total', storeId: 'rentroll-type1-total', label: 'Type 1 Total', section: 'rentroll', subsection: 'rentroll-type1', type: 'number', inputSource: 'calculated', required: false },
  { id: 'rentroll-type1-pct', storeId: 'rentroll-type1-pct', label: 'Type 1 %', section: 'rentroll', subsection: 'rentroll-type1', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-type1-size', storeId: 'rentroll-type1-size', label: 'Type 1 Size (SF)', section: 'rentroll', subsection: 'rentroll-type1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rentroll-type1-vac-pct', storeId: 'rentroll-type1-vac-pct', label: 'Type 1 Vacancy %', section: 'rentroll', subsection: 'rentroll-type1', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-type1-occ-pct', storeId: 'rentroll-type1-occ-pct', label: 'Type 1 Occupancy %', section: 'rentroll', subsection: 'rentroll-type1', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-type1-recent-sf', storeId: 'rentroll-type1-recent-sf', label: 'Type 1 Recent Rent/SF', section: 'rentroll', subsection: 'rentroll-type1', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'rentroll-type1-actual-unit', storeId: 'rentroll-type1-actual-unit', label: 'Type 1 Actual Rent/Unit', section: 'rentroll', subsection: 'rentroll-type1', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'rentroll-type1-actual-sf', storeId: 'rentroll-type1-actual-sf', label: 'Type 1 Actual Rent/SF', section: 'rentroll', subsection: 'rentroll-type1', type: 'currency', inputSource: 'calculated', required: false },

  // Rent Roll - Unit Type 2 Subsection (12 fields)
  { id: 'rentroll-type2-name', storeId: 'rentroll-type2-name', label: 'Type 2 Name', section: 'rentroll', subsection: 'rentroll-type2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'rentroll-type2-desc', storeId: 'rentroll-type2-desc', label: 'Type 2 Description', section: 'rentroll', subsection: 'rentroll-type2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'rentroll-type2-occ', storeId: 'rentroll-type2-occ', label: 'Type 2 Occupied', section: 'rentroll', subsection: 'rentroll-type2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rentroll-type2-vac', storeId: 'rentroll-type2-vac', label: 'Type 2 Vacant', section: 'rentroll', subsection: 'rentroll-type2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rentroll-type2-total', storeId: 'rentroll-type2-total', label: 'Type 2 Total', section: 'rentroll', subsection: 'rentroll-type2', type: 'number', inputSource: 'calculated', required: false },
  { id: 'rentroll-type2-pct', storeId: 'rentroll-type2-pct', label: 'Type 2 %', section: 'rentroll', subsection: 'rentroll-type2', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-type2-size', storeId: 'rentroll-type2-size', label: 'Type 2 Size (SF)', section: 'rentroll', subsection: 'rentroll-type2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rentroll-type2-vac-pct', storeId: 'rentroll-type2-vac-pct', label: 'Type 2 Vacancy %', section: 'rentroll', subsection: 'rentroll-type2', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-type2-occ-pct', storeId: 'rentroll-type2-occ-pct', label: 'Type 2 Occupancy %', section: 'rentroll', subsection: 'rentroll-type2', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-type2-recent-sf', storeId: 'rentroll-type2-recent-sf', label: 'Type 2 Recent Rent/SF', section: 'rentroll', subsection: 'rentroll-type2', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'rentroll-type2-actual-unit', storeId: 'rentroll-type2-actual-unit', label: 'Type 2 Actual Rent/Unit', section: 'rentroll', subsection: 'rentroll-type2', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'rentroll-type2-actual-sf', storeId: 'rentroll-type2-actual-sf', label: 'Type 2 Actual Rent/SF', section: 'rentroll', subsection: 'rentroll-type2', type: 'currency', inputSource: 'calculated', required: false },

  // Rent Roll - Totals/Averages Subsection (13 fields)
  { id: 'rentroll-total-occ', storeId: 'rentroll-total-occ', label: 'Total Occupied', section: 'rentroll', subsection: 'rentroll-totals', type: 'number', inputSource: 'calculated', required: false },
  { id: 'rentroll-total-vac', storeId: 'rentroll-total-vac', label: 'Total Vacant', section: 'rentroll', subsection: 'rentroll-totals', type: 'number', inputSource: 'calculated', required: false },
  { id: 'rentroll-total-units', storeId: 'rentroll-total-units', label: 'Total Units', section: 'rentroll', subsection: 'rentroll-totals', type: 'number', inputSource: 'calculated', required: false },
  { id: 'rentroll-total-pct', storeId: 'rentroll-total-pct', label: 'Total %', section: 'rentroll', subsection: 'rentroll-totals', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-size', storeId: 'rentroll-avg-size', label: 'Average Size (SF)', section: 'rentroll', subsection: 'rentroll-totals', type: 'number', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-vac-pct', storeId: 'rentroll-avg-vac-pct', label: 'Average Vacancy %', section: 'rentroll', subsection: 'rentroll-totals', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-occ-pct', storeId: 'rentroll-avg-occ-pct', label: 'Average Occupancy %', section: 'rentroll', subsection: 'rentroll-totals', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-asking-unit', storeId: 'rentroll-avg-asking-unit', label: 'Average Asking Rent/Unit', section: 'rentroll', subsection: 'rentroll-totals', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-asking-sf', storeId: 'rentroll-avg-asking-sf', label: 'Average Asking Rent/SF', section: 'rentroll', subsection: 'rentroll-totals', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-recent-unit', storeId: 'rentroll-avg-recent-unit', label: 'Average Recent Rent/Unit', section: 'rentroll', subsection: 'rentroll-totals', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-recent-sf', storeId: 'rentroll-avg-recent-sf', label: 'Average Recent Rent/SF', section: 'rentroll', subsection: 'rentroll-totals', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-actual-unit', storeId: 'rentroll-avg-actual-unit', label: 'Average Actual Rent/Unit', section: 'rentroll', subsection: 'rentroll-totals', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'rentroll-avg-actual-sf', storeId: 'rentroll-avg-actual-sf', label: 'Average Actual Rent/SF', section: 'rentroll', subsection: 'rentroll-totals', type: 'currency', inputSource: 'calculated', required: false },

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
  { id: 'subject-location-rating', storeId: 'subject-location-rating', label: 'Location Rating', section: 'sales', subsection: 'subject-summary', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'subject-access-rating', storeId: 'subject-access-rating', label: 'Access Rating', section: 'sales', subsection: 'subject-summary', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'subject-exposure-rating', storeId: 'subject-exposure-rating', label: 'Exposure Rating', section: 'sales', subsection: 'subject-summary', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'subject-quality-rating', storeId: 'subject-quality-rating', label: 'Quality Rating', section: 'sales', subsection: 'subject-summary', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'subject-appeal-rating', storeId: 'subject-appeal-rating', label: 'Appeal Rating', section: 'sales', subsection: 'subject-summary', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'subject-proj-amenities', storeId: 'subject-proj-amenities', label: 'Project Amenities', section: 'sales', subsection: 'subject-summary', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-unit-amenities', storeId: 'subject-unit-amenities', label: 'Unit Amenities', section: 'sales', subsection: 'subject-summary', type: 'text', inputSource: 'user-input', required: false },

  // Sales - DCA Summary Subsection
  { id: 'dca-price-per-unit-concluded', storeId: 'dca-price-per-unit-concluded', label: 'Concluded Price Per Unit', section: 'sales', subsection: 'dca-summary', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'dca-price-per-unit-high', storeId: 'dca-price-per-unit-high', label: 'Price Per Unit High', section: 'sales', subsection: 'dca-summary', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-price-per-unit-low', storeId: 'dca-price-per-unit-low', label: 'Price Per Unit Low', section: 'sales', subsection: 'dca-summary', type: 'currency', inputSource: 'calculated', required: false },

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
  { id: 'comp1-city', storeId: 'comp1-city', label: 'City', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-noi', storeId: 'comp1-noi', label: 'NOI', section: 'sales', subsection: 'sale-comp-1', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp1-noi-per-unit', storeId: 'comp1-noi-per-unit', label: 'NOI/Unit', section: 'sales', subsection: 'sale-comp-1', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp1-province', storeId: 'comp1-province', label: 'Province', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-postal-code', storeId: 'comp1-postal-code', label: 'Postal Code', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-property-rights', storeId: 'comp1-property-rights', label: 'Property Rights', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-financing', storeId: 'comp1-financing', label: 'Financing', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-sale-conditions', storeId: 'comp1-sale-conditions', label: 'Conditions of Sale', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-expenditures-after', storeId: 'comp1-expenditures-after', label: 'Expenditures After Sale', section: 'sales', subsection: 'sale-comp-1', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp1-market-conditions', storeId: 'comp1-market-conditions', label: 'Market Conditions', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-sale-status', storeId: 'comp1-sale-status', label: 'Sale Status', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-total-trans-adj', storeId: 'comp1-total-trans-adj', label: 'Total Transactional Adj %', section: 'sales', subsection: 'sale-comp-1', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp1-adj-price-per-unit', storeId: 'comp1-adj-price-per-unit', label: 'Adjusted Price/Unit', section: 'sales', subsection: 'sale-comp-1', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp1-occupancy', storeId: 'comp1-occupancy', label: 'Occupancy %', section: 'sales', subsection: 'sale-comp-1', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'comp1-location', storeId: 'comp1-location', label: 'Location Rating', section: 'sales', subsection: 'sale-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp1-access', storeId: 'comp1-access', label: 'Access Rating', section: 'sales', subsection: 'sale-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp1-exposure', storeId: 'comp1-exposure', label: 'Exposure Rating', section: 'sales', subsection: 'sale-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp1-quality', storeId: 'comp1-quality', label: 'Quality Rating', section: 'sales', subsection: 'sale-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp1-condition', storeId: 'comp1-condition', label: 'Condition Rating', section: 'sales', subsection: 'sale-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp1-appeal', storeId: 'comp1-appeal', label: 'Appeal Rating', section: 'sales', subsection: 'sale-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp1-parking-type', storeId: 'comp1-parking-type', label: 'Parking Type', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-proj-amenities', storeId: 'comp1-proj-amenities', label: 'Project Amenities', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-unit-amenities', storeId: 'comp1-unit-amenities', label: 'Unit Amenities', section: 'sales', subsection: 'sale-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp1-total-phys-adj', storeId: 'comp1-total-phys-adj', label: 'Total Physical Adj %', section: 'sales', subsection: 'sale-comp-1', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp1-trans-adj-price', storeId: 'comp1-trans-adj-price', label: 'Transactional Adj Price', section: 'sales', subsection: 'sale-comp-1', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp1-net-adj', storeId: 'comp1-net-adj', label: 'Net Adjustment %', section: 'sales', subsection: 'sale-comp-1', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp1-gross-adj', storeId: 'comp1-gross-adj', label: 'Gross Adjustment %', section: 'sales', subsection: 'sale-comp-1', type: 'percentage', inputSource: 'calculated', required: false },

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
  { id: 'comp2-city', storeId: 'comp2-city', label: 'City', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-noi', storeId: 'comp2-noi', label: 'NOI', section: 'sales', subsection: 'sale-comp-2', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp2-noi-per-unit', storeId: 'comp2-noi-per-unit', label: 'NOI/Unit', section: 'sales', subsection: 'sale-comp-2', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp2-province', storeId: 'comp2-province', label: 'Province', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-postal-code', storeId: 'comp2-postal-code', label: 'Postal Code', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-property-rights', storeId: 'comp2-property-rights', label: 'Property Rights', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-financing', storeId: 'comp2-financing', label: 'Financing', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-sale-conditions', storeId: 'comp2-sale-conditions', label: 'Conditions of Sale', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-expenditures-after', storeId: 'comp2-expenditures-after', label: 'Expenditures After Sale', section: 'sales', subsection: 'sale-comp-2', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp2-market-conditions', storeId: 'comp2-market-conditions', label: 'Market Conditions', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-sale-status', storeId: 'comp2-sale-status', label: 'Sale Status', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-total-trans-adj', storeId: 'comp2-total-trans-adj', label: 'Total Transactional Adj %', section: 'sales', subsection: 'sale-comp-2', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp2-adj-price-per-unit', storeId: 'comp2-adj-price-per-unit', label: 'Adjusted Price/Unit', section: 'sales', subsection: 'sale-comp-2', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp2-occupancy', storeId: 'comp2-occupancy', label: 'Occupancy %', section: 'sales', subsection: 'sale-comp-2', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'comp2-location', storeId: 'comp2-location', label: 'Location Rating', section: 'sales', subsection: 'sale-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp2-access', storeId: 'comp2-access', label: 'Access Rating', section: 'sales', subsection: 'sale-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp2-exposure', storeId: 'comp2-exposure', label: 'Exposure Rating', section: 'sales', subsection: 'sale-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp2-quality', storeId: 'comp2-quality', label: 'Quality Rating', section: 'sales', subsection: 'sale-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp2-condition', storeId: 'comp2-condition', label: 'Condition Rating', section: 'sales', subsection: 'sale-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp2-appeal', storeId: 'comp2-appeal', label: 'Appeal Rating', section: 'sales', subsection: 'sale-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp2-parking-type', storeId: 'comp2-parking-type', label: 'Parking Type', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-proj-amenities', storeId: 'comp2-proj-amenities', label: 'Project Amenities', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-unit-amenities', storeId: 'comp2-unit-amenities', label: 'Unit Amenities', section: 'sales', subsection: 'sale-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp2-total-phys-adj', storeId: 'comp2-total-phys-adj', label: 'Total Physical Adj %', section: 'sales', subsection: 'sale-comp-2', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp2-trans-adj-price', storeId: 'comp2-trans-adj-price', label: 'Transactional Adj Price', section: 'sales', subsection: 'sale-comp-2', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp2-net-adj', storeId: 'comp2-net-adj', label: 'Net Adjustment %', section: 'sales', subsection: 'sale-comp-2', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp2-gross-adj', storeId: 'comp2-gross-adj', label: 'Gross Adjustment %', section: 'sales', subsection: 'sale-comp-2', type: 'percentage', inputSource: 'calculated', required: false },

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
  { id: 'comp3-city', storeId: 'comp3-city', label: 'City', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-noi', storeId: 'comp3-noi', label: 'NOI', section: 'sales', subsection: 'sale-comp-3', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp3-noi-per-unit', storeId: 'comp3-noi-per-unit', label: 'NOI/Unit', section: 'sales', subsection: 'sale-comp-3', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp3-province', storeId: 'comp3-province', label: 'Province', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-postal-code', storeId: 'comp3-postal-code', label: 'Postal Code', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-property-rights', storeId: 'comp3-property-rights', label: 'Property Rights', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-financing', storeId: 'comp3-financing', label: 'Financing', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-sale-conditions', storeId: 'comp3-sale-conditions', label: 'Conditions of Sale', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-expenditures-after', storeId: 'comp3-expenditures-after', label: 'Expenditures After Sale', section: 'sales', subsection: 'sale-comp-3', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp3-market-conditions', storeId: 'comp3-market-conditions', label: 'Market Conditions', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-sale-status', storeId: 'comp3-sale-status', label: 'Sale Status', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-total-trans-adj', storeId: 'comp3-total-trans-adj', label: 'Total Transactional Adj %', section: 'sales', subsection: 'sale-comp-3', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp3-adj-price-per-unit', storeId: 'comp3-adj-price-per-unit', label: 'Adjusted Price/Unit', section: 'sales', subsection: 'sale-comp-3', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp3-occupancy', storeId: 'comp3-occupancy', label: 'Occupancy %', section: 'sales', subsection: 'sale-comp-3', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'comp3-location', storeId: 'comp3-location', label: 'Location Rating', section: 'sales', subsection: 'sale-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp3-access', storeId: 'comp3-access', label: 'Access Rating', section: 'sales', subsection: 'sale-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp3-exposure', storeId: 'comp3-exposure', label: 'Exposure Rating', section: 'sales', subsection: 'sale-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp3-quality', storeId: 'comp3-quality', label: 'Quality Rating', section: 'sales', subsection: 'sale-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp3-condition', storeId: 'comp3-condition', label: 'Condition Rating', section: 'sales', subsection: 'sale-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp3-appeal', storeId: 'comp3-appeal', label: 'Appeal Rating', section: 'sales', subsection: 'sale-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp3-parking-type', storeId: 'comp3-parking-type', label: 'Parking Type', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-proj-amenities', storeId: 'comp3-proj-amenities', label: 'Project Amenities', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-unit-amenities', storeId: 'comp3-unit-amenities', label: 'Unit Amenities', section: 'sales', subsection: 'sale-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp3-total-phys-adj', storeId: 'comp3-total-phys-adj', label: 'Total Physical Adj %', section: 'sales', subsection: 'sale-comp-3', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp3-trans-adj-price', storeId: 'comp3-trans-adj-price', label: 'Transactional Adj Price', section: 'sales', subsection: 'sale-comp-3', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp3-net-adj', storeId: 'comp3-net-adj', label: 'Net Adjustment %', section: 'sales', subsection: 'sale-comp-3', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp3-gross-adj', storeId: 'comp3-gross-adj', label: 'Gross Adjustment %', section: 'sales', subsection: 'sale-comp-3', type: 'percentage', inputSource: 'calculated', required: false },

  // Sales - Comp 4 Subsection
  { id: 'comp4-name', storeId: 'comp4-name', label: 'Property Name', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-address', storeId: 'comp4-address', label: 'Address', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-sale-date', storeId: 'comp4-sale-date', label: 'Sale Date', section: 'sales', subsection: 'sale-comp-4', type: 'date', inputSource: 'user-input', required: false },
  { id: 'comp4-sale-price', storeId: 'comp4-sale-price', label: 'Sale Price', section: 'sales', subsection: 'sale-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp4-units', storeId: 'comp4-units', label: 'Units', section: 'sales', subsection: 'sale-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp4-price-per-unit', storeId: 'comp4-price-per-unit', label: 'Price/Unit', section: 'sales', subsection: 'sale-comp-4', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp4-gba', storeId: 'comp4-gba', label: 'GBA (SF)', section: 'sales', subsection: 'sale-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp4-price-per-sf', storeId: 'comp4-price-per-sf', label: 'Price/SF', section: 'sales', subsection: 'sale-comp-4', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp4-year', storeId: 'comp4-year', label: 'Year Built', section: 'sales', subsection: 'sale-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp4-cap-rate', storeId: 'comp4-cap-rate', label: 'Cap Rate (%)', section: 'sales', subsection: 'sale-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp4-city', storeId: 'comp4-city', label: 'City', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-noi', storeId: 'comp4-noi', label: 'NOI', section: 'sales', subsection: 'sale-comp-4', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp4-noi-per-unit', storeId: 'comp4-noi-per-unit', label: 'NOI/Unit', section: 'sales', subsection: 'sale-comp-4', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp4-province', storeId: 'comp4-province', label: 'Province', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-postal-code', storeId: 'comp4-postal-code', label: 'Postal Code', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-property-rights', storeId: 'comp4-property-rights', label: 'Property Rights', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-financing', storeId: 'comp4-financing', label: 'Financing', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-sale-conditions', storeId: 'comp4-sale-conditions', label: 'Conditions of Sale', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-expenditures-after', storeId: 'comp4-expenditures-after', label: 'Expenditures After Sale', section: 'sales', subsection: 'sale-comp-4', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp4-market-conditions', storeId: 'comp4-market-conditions', label: 'Market Conditions', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-sale-status', storeId: 'comp4-sale-status', label: 'Sale Status', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-total-trans-adj', storeId: 'comp4-total-trans-adj', label: 'Total Transactional Adj %', section: 'sales', subsection: 'sale-comp-4', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp4-adj-price-per-unit', storeId: 'comp4-adj-price-per-unit', label: 'Adjusted Price/Unit', section: 'sales', subsection: 'sale-comp-4', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp4-occupancy', storeId: 'comp4-occupancy', label: 'Occupancy %', section: 'sales', subsection: 'sale-comp-4', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'comp4-location', storeId: 'comp4-location', label: 'Location Rating', section: 'sales', subsection: 'sale-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp4-access', storeId: 'comp4-access', label: 'Access Rating', section: 'sales', subsection: 'sale-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp4-exposure', storeId: 'comp4-exposure', label: 'Exposure Rating', section: 'sales', subsection: 'sale-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp4-quality', storeId: 'comp4-quality', label: 'Quality Rating', section: 'sales', subsection: 'sale-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp4-condition', storeId: 'comp4-condition', label: 'Condition Rating', section: 'sales', subsection: 'sale-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp4-appeal', storeId: 'comp4-appeal', label: 'Appeal Rating', section: 'sales', subsection: 'sale-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp4-parking-type', storeId: 'comp4-parking-type', label: 'Parking Type', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-proj-amenities', storeId: 'comp4-proj-amenities', label: 'Project Amenities', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-unit-amenities', storeId: 'comp4-unit-amenities', label: 'Unit Amenities', section: 'sales', subsection: 'sale-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp4-total-phys-adj', storeId: 'comp4-total-phys-adj', label: 'Total Physical Adj %', section: 'sales', subsection: 'sale-comp-4', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp4-trans-adj-price', storeId: 'comp4-trans-adj-price', label: 'Transactional Adj Price', section: 'sales', subsection: 'sale-comp-4', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp4-net-adj', storeId: 'comp4-net-adj', label: 'Net Adjustment %', section: 'sales', subsection: 'sale-comp-4', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp4-gross-adj', storeId: 'comp4-gross-adj', label: 'Gross Adjustment %', section: 'sales', subsection: 'sale-comp-4', type: 'percentage', inputSource: 'calculated', required: false },

  // Sales - Comp 5 Subsection
  { id: 'comp5-name', storeId: 'comp5-name', label: 'Property Name', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-address', storeId: 'comp5-address', label: 'Address', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-sale-date', storeId: 'comp5-sale-date', label: 'Sale Date', section: 'sales', subsection: 'sale-comp-5', type: 'date', inputSource: 'user-input', required: false },
  { id: 'comp5-sale-price', storeId: 'comp5-sale-price', label: 'Sale Price', section: 'sales', subsection: 'sale-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp5-units', storeId: 'comp5-units', label: 'Units', section: 'sales', subsection: 'sale-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp5-price-per-unit', storeId: 'comp5-price-per-unit', label: 'Price/Unit', section: 'sales', subsection: 'sale-comp-5', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp5-gba', storeId: 'comp5-gba', label: 'GBA (SF)', section: 'sales', subsection: 'sale-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp5-price-per-sf', storeId: 'comp5-price-per-sf', label: 'Price/SF', section: 'sales', subsection: 'sale-comp-5', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'comp5-year', storeId: 'comp5-year', label: 'Year Built', section: 'sales', subsection: 'sale-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp5-cap-rate', storeId: 'comp5-cap-rate', label: 'Cap Rate (%)', section: 'sales', subsection: 'sale-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'comp5-city', storeId: 'comp5-city', label: 'City', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-noi', storeId: 'comp5-noi', label: 'NOI', section: 'sales', subsection: 'sale-comp-5', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp5-noi-per-unit', storeId: 'comp5-noi-per-unit', label: 'NOI/Unit', section: 'sales', subsection: 'sale-comp-5', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp5-province', storeId: 'comp5-province', label: 'Province', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-postal-code', storeId: 'comp5-postal-code', label: 'Postal Code', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-property-rights', storeId: 'comp5-property-rights', label: 'Property Rights', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-financing', storeId: 'comp5-financing', label: 'Financing', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-sale-conditions', storeId: 'comp5-sale-conditions', label: 'Conditions of Sale', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-expenditures-after', storeId: 'comp5-expenditures-after', label: 'Expenditures After Sale', section: 'sales', subsection: 'sale-comp-5', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'comp5-market-conditions', storeId: 'comp5-market-conditions', label: 'Market Conditions', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-sale-status', storeId: 'comp5-sale-status', label: 'Sale Status', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-total-trans-adj', storeId: 'comp5-total-trans-adj', label: 'Total Transactional Adj %', section: 'sales', subsection: 'sale-comp-5', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp5-adj-price-per-unit', storeId: 'comp5-adj-price-per-unit', label: 'Adjusted Price/Unit', section: 'sales', subsection: 'sale-comp-5', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp5-occupancy', storeId: 'comp5-occupancy', label: 'Occupancy %', section: 'sales', subsection: 'sale-comp-5', type: 'percentage', inputSource: 'user-input', required: false },
  { id: 'comp5-location', storeId: 'comp5-location', label: 'Location Rating', section: 'sales', subsection: 'sale-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp5-access', storeId: 'comp5-access', label: 'Access Rating', section: 'sales', subsection: 'sale-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp5-exposure', storeId: 'comp5-exposure', label: 'Exposure Rating', section: 'sales', subsection: 'sale-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp5-quality', storeId: 'comp5-quality', label: 'Quality Rating', section: 'sales', subsection: 'sale-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp5-condition', storeId: 'comp5-condition', label: 'Condition Rating', section: 'sales', subsection: 'sale-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp5-appeal', storeId: 'comp5-appeal', label: 'Appeal Rating', section: 'sales', subsection: 'sale-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Above Average', 'Average', 'Below Average', 'Inferior'] },
  { id: 'comp5-parking-type', storeId: 'comp5-parking-type', label: 'Parking Type', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-proj-amenities', storeId: 'comp5-proj-amenities', label: 'Project Amenities', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-unit-amenities', storeId: 'comp5-unit-amenities', label: 'Unit Amenities', section: 'sales', subsection: 'sale-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'comp5-total-phys-adj', storeId: 'comp5-total-phys-adj', label: 'Total Physical Adj %', section: 'sales', subsection: 'sale-comp-5', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp5-trans-adj-price', storeId: 'comp5-trans-adj-price', label: 'Transactional Adj Price', section: 'sales', subsection: 'sale-comp-5', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'comp5-net-adj', storeId: 'comp5-net-adj', label: 'Net Adjustment %', section: 'sales', subsection: 'sale-comp-5', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'comp5-gross-adj', storeId: 'comp5-gross-adj', label: 'Gross Adjustment %', section: 'sales', subsection: 'sale-comp-5', type: 'percentage', inputSource: 'calculated', required: false },

  // Sales - Conclusion Subsection
  { id: 'sales-value-indication', storeId: 'sales-value-indication', label: 'Sales Comparison Value', section: 'sales', subsection: 'sales-conclusion', type: 'number', inputSource: 'user-input', required: false },
  { id: 'sales-adjustment-summary', storeId: 'sales-adjustment-summary', label: 'Adjustment Summary', section: 'sales', subsection: 'sales-conclusion', type: 'textarea', inputSource: 'user-input', required: false },

  // Sales - DCA Summary Statistics (High, Avg, Med, Low)
  { id: 'dca-high-price-per-unit', storeId: 'dca-high-price-per-unit', label: 'High Price/Unit', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-high-trans-adj', storeId: 'dca-high-trans-adj', label: 'High Trans Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-high-trans-adj-price', storeId: 'dca-high-trans-adj-price', label: 'High Trans Adj Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-high-phys-adj', storeId: 'dca-high-phys-adj', label: 'High Physical Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-high-final-price', storeId: 'dca-high-final-price', label: 'High Final Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-high-net-adj', storeId: 'dca-high-net-adj', label: 'High Net Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-high-gross-adj', storeId: 'dca-high-gross-adj', label: 'High Gross Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-avg-price-per-unit', storeId: 'dca-avg-price-per-unit', label: 'Avg Price/Unit', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-avg-trans-adj', storeId: 'dca-avg-trans-adj', label: 'Avg Trans Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-avg-trans-adj-price', storeId: 'dca-avg-trans-adj-price', label: 'Avg Trans Adj Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-avg-phys-adj', storeId: 'dca-avg-phys-adj', label: 'Avg Physical Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-avg-final-price', storeId: 'dca-avg-final-price', label: 'Avg Final Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-avg-net-adj', storeId: 'dca-avg-net-adj', label: 'Avg Net Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-avg-gross-adj', storeId: 'dca-avg-gross-adj', label: 'Avg Gross Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-med-price-per-unit', storeId: 'dca-med-price-per-unit', label: 'Median Price/Unit', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-med-trans-adj', storeId: 'dca-med-trans-adj', label: 'Median Trans Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-med-trans-adj-price', storeId: 'dca-med-trans-adj-price', label: 'Median Trans Adj Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-med-phys-adj', storeId: 'dca-med-phys-adj', label: 'Median Physical Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-med-final-price', storeId: 'dca-med-final-price', label: 'Median Final Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-med-net-adj', storeId: 'dca-med-net-adj', label: 'Median Net Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-med-gross-adj', storeId: 'dca-med-gross-adj', label: 'Median Gross Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-low-price-per-unit', storeId: 'dca-low-price-per-unit', label: 'Low Price/Unit', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-low-trans-adj', storeId: 'dca-low-trans-adj', label: 'Low Trans Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-low-trans-adj-price', storeId: 'dca-low-trans-adj-price', label: 'Low Trans Adj Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-low-phys-adj', storeId: 'dca-low-phys-adj', label: 'Low Physical Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-low-final-price', storeId: 'dca-low-final-price', label: 'Low Final Price', section: 'sales', subsection: 'dca-statistics', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'dca-low-net-adj', storeId: 'dca-low-net-adj', label: 'Low Net Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'dca-low-gross-adj', storeId: 'dca-low-gross-adj', label: 'Low Gross Adj %', section: 'sales', subsection: 'dca-statistics', type: 'percentage', inputSource: 'calculated', required: false },

  // Sales - SCA Value Conclusion
  { id: 'sca-concluded-value-per-unit', storeId: 'sca-concluded-value-per-unit', label: 'Concluded Value/Unit', section: 'sales', subsection: 'sca-conclusion', type: 'currency', inputSource: 'user-input', required: false },
  { id: 'sca-indicated-value', storeId: 'sca-indicated-value', label: 'SCA Indicated Value', section: 'sales', subsection: 'sca-conclusion', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'sca-indicated-value-rounded', storeId: 'sca-indicated-value-rounded', label: 'SCA Indicated Value (Rounded)', section: 'sales', subsection: 'sca-conclusion', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'sca-value-per-sf', storeId: 'sca-value-per-sf', label: 'SCA Value/SF', section: 'sales', subsection: 'sca-conclusion', type: 'currency', inputSource: 'calculated', required: false },

  // ============================================================================
  // SECTION: RENTAL SURVEY (Market Rent Analysis)
  // Rental comparables for market rent support - 5 properties
  // Maps to workbook SURVEY1/SURVEY2 sheets
  // ============================================================================

  // --- RENTAL SURVEY INTRODUCTION ---
  { id: 'survey-intro', storeId: 'survey-intro', label: 'Rental Survey Introduction', section: 'survey', subsection: 'survey-overview', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'survey-methodology', storeId: 'survey-methodology', label: 'Survey Methodology', section: 'survey', subsection: 'survey-overview', type: 'textarea', inputSource: 'user-input', required: false },

  // --- SURVEY SUMMARY ---
  { id: 'contract-to-market-pct', storeId: 'contract-to-market-pct', label: 'Contract to Market %', section: 'survey', subsection: 'survey-summary', type: 'percentage', inputSource: 'calculated', required: false },
  { id: 'survey-1br-avg-rent', storeId: 'survey-1br-avg-rent', label: '1BR Average Rent', section: 'survey', subsection: 'survey-summary', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'survey-1br-avg-psf', storeId: 'survey-1br-avg-psf', label: '1BR Average PSF', section: 'survey', subsection: 'survey-summary', type: 'number', inputSource: 'calculated', required: false },
  { id: 'survey-2br-avg-rent', storeId: 'survey-2br-avg-rent', label: '2BR Average Rent', section: 'survey', subsection: 'survey-summary', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'survey-2br-avg-psf', storeId: 'survey-2br-avg-psf', label: '2BR Average PSF', section: 'survey', subsection: 'survey-summary', type: 'number', inputSource: 'calculated', required: false },

  // --- RENTAL COMP 1 ---
  { id: 'survey1-name', storeId: 'survey1-name', label: 'Property Name', section: 'survey', subsection: 'rental-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey1-address', storeId: 'survey1-address', label: 'Address', section: 'survey', subsection: 'rental-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey1-city', storeId: 'survey1-city', label: 'City', section: 'survey', subsection: 'rental-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey1-distance', storeId: 'survey1-distance', label: 'Distance (km)', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-units', storeId: 'survey1-units', label: 'Total Units', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-year-built', storeId: 'survey1-year-built', label: 'Year Built', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-stories', storeId: 'survey1-stories', label: 'Stories', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-location', storeId: 'survey1-location', label: 'Location Rating', section: 'survey', subsection: 'rental-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey1-quality', storeId: 'survey1-quality', label: 'Quality Rating', section: 'survey', subsection: 'rental-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey1-condition', storeId: 'survey1-condition', label: 'Condition Rating', section: 'survey', subsection: 'rental-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey1-appeal', storeId: 'survey1-appeal', label: 'Appeal Rating', section: 'survey', subsection: 'rental-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey1-amenities', storeId: 'survey1-amenities', label: 'Amenities Rating', section: 'survey', subsection: 'rental-comp-1', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey1-parking', storeId: 'survey1-parking', label: 'Parking', section: 'survey', subsection: 'rental-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey1-laundry', storeId: 'survey1-laundry', label: 'Laundry', section: 'survey', subsection: 'rental-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey1-utilities', storeId: 'survey1-utilities', label: 'Utilities Included', section: 'survey', subsection: 'rental-comp-1', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey1-1br-sf', storeId: 'survey1-1br-sf', label: '1BR Avg SF', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-1br-rent', storeId: 'survey1-1br-rent', label: '1BR Rent/Mo', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-1br-psf', storeId: 'survey1-1br-psf', label: '1BR Rent/SF', section: 'survey', subsection: 'rental-comp-1', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'survey1-2br-sf', storeId: 'survey1-2br-sf', label: '2BR Avg SF', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-2br-rent', storeId: 'survey1-2br-rent', label: '2BR Rent/Mo', section: 'survey', subsection: 'rental-comp-1', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey1-2br-psf', storeId: 'survey1-2br-psf', label: '2BR Rent/SF', section: 'survey', subsection: 'rental-comp-1', type: 'calculated', inputSource: 'calculated', required: false },

  // --- RENTAL COMP 2 ---
  { id: 'survey2-name', storeId: 'survey2-name', label: 'Property Name', section: 'survey', subsection: 'rental-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey2-address', storeId: 'survey2-address', label: 'Address', section: 'survey', subsection: 'rental-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey2-city', storeId: 'survey2-city', label: 'City', section: 'survey', subsection: 'rental-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey2-distance', storeId: 'survey2-distance', label: 'Distance (km)', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-units', storeId: 'survey2-units', label: 'Total Units', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-year-built', storeId: 'survey2-year-built', label: 'Year Built', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-stories', storeId: 'survey2-stories', label: 'Stories', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-location', storeId: 'survey2-location', label: 'Location Rating', section: 'survey', subsection: 'rental-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey2-quality', storeId: 'survey2-quality', label: 'Quality Rating', section: 'survey', subsection: 'rental-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey2-condition', storeId: 'survey2-condition', label: 'Condition Rating', section: 'survey', subsection: 'rental-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey2-appeal', storeId: 'survey2-appeal', label: 'Appeal Rating', section: 'survey', subsection: 'rental-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey2-amenities', storeId: 'survey2-amenities', label: 'Amenities Rating', section: 'survey', subsection: 'rental-comp-2', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey2-parking', storeId: 'survey2-parking', label: 'Parking', section: 'survey', subsection: 'rental-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey2-laundry', storeId: 'survey2-laundry', label: 'Laundry', section: 'survey', subsection: 'rental-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey2-utilities', storeId: 'survey2-utilities', label: 'Utilities Included', section: 'survey', subsection: 'rental-comp-2', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey2-1br-sf', storeId: 'survey2-1br-sf', label: '1BR Avg SF', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-1br-rent', storeId: 'survey2-1br-rent', label: '1BR Rent/Mo', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-1br-psf', storeId: 'survey2-1br-psf', label: '1BR Rent/SF', section: 'survey', subsection: 'rental-comp-2', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'survey2-2br-sf', storeId: 'survey2-2br-sf', label: '2BR Avg SF', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-2br-rent', storeId: 'survey2-2br-rent', label: '2BR Rent/Mo', section: 'survey', subsection: 'rental-comp-2', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey2-2br-psf', storeId: 'survey2-2br-psf', label: '2BR Rent/SF', section: 'survey', subsection: 'rental-comp-2', type: 'calculated', inputSource: 'calculated', required: false },

  // --- RENTAL COMP 3 ---
  { id: 'survey3-name', storeId: 'survey3-name', label: 'Property Name', section: 'survey', subsection: 'rental-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey3-address', storeId: 'survey3-address', label: 'Address', section: 'survey', subsection: 'rental-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey3-city', storeId: 'survey3-city', label: 'City', section: 'survey', subsection: 'rental-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey3-distance', storeId: 'survey3-distance', label: 'Distance (km)', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-units', storeId: 'survey3-units', label: 'Total Units', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-year-built', storeId: 'survey3-year-built', label: 'Year Built', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-stories', storeId: 'survey3-stories', label: 'Stories', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-location', storeId: 'survey3-location', label: 'Location Rating', section: 'survey', subsection: 'rental-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey3-quality', storeId: 'survey3-quality', label: 'Quality Rating', section: 'survey', subsection: 'rental-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey3-condition', storeId: 'survey3-condition', label: 'Condition Rating', section: 'survey', subsection: 'rental-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey3-appeal', storeId: 'survey3-appeal', label: 'Appeal Rating', section: 'survey', subsection: 'rental-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey3-amenities', storeId: 'survey3-amenities', label: 'Amenities Rating', section: 'survey', subsection: 'rental-comp-3', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey3-parking', storeId: 'survey3-parking', label: 'Parking', section: 'survey', subsection: 'rental-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey3-laundry', storeId: 'survey3-laundry', label: 'Laundry', section: 'survey', subsection: 'rental-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey3-utilities', storeId: 'survey3-utilities', label: 'Utilities Included', section: 'survey', subsection: 'rental-comp-3', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey3-1br-sf', storeId: 'survey3-1br-sf', label: '1BR Avg SF', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-1br-rent', storeId: 'survey3-1br-rent', label: '1BR Rent/Mo', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-1br-psf', storeId: 'survey3-1br-psf', label: '1BR Rent/SF', section: 'survey', subsection: 'rental-comp-3', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'survey3-2br-sf', storeId: 'survey3-2br-sf', label: '2BR Avg SF', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-2br-rent', storeId: 'survey3-2br-rent', label: '2BR Rent/Mo', section: 'survey', subsection: 'rental-comp-3', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey3-2br-psf', storeId: 'survey3-2br-psf', label: '2BR Rent/SF', section: 'survey', subsection: 'rental-comp-3', type: 'calculated', inputSource: 'calculated', required: false },

  // --- RENTAL COMP 4 ---
  { id: 'survey4-name', storeId: 'survey4-name', label: 'Property Name', section: 'survey', subsection: 'rental-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey4-address', storeId: 'survey4-address', label: 'Address', section: 'survey', subsection: 'rental-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey4-city', storeId: 'survey4-city', label: 'City', section: 'survey', subsection: 'rental-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey4-distance', storeId: 'survey4-distance', label: 'Distance (km)', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-units', storeId: 'survey4-units', label: 'Total Units', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-year-built', storeId: 'survey4-year-built', label: 'Year Built', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-stories', storeId: 'survey4-stories', label: 'Stories', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-location', storeId: 'survey4-location', label: 'Location Rating', section: 'survey', subsection: 'rental-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey4-quality', storeId: 'survey4-quality', label: 'Quality Rating', section: 'survey', subsection: 'rental-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey4-condition', storeId: 'survey4-condition', label: 'Condition Rating', section: 'survey', subsection: 'rental-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey4-appeal', storeId: 'survey4-appeal', label: 'Appeal Rating', section: 'survey', subsection: 'rental-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey4-amenities', storeId: 'survey4-amenities', label: 'Amenities Rating', section: 'survey', subsection: 'rental-comp-4', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey4-parking', storeId: 'survey4-parking', label: 'Parking', section: 'survey', subsection: 'rental-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey4-laundry', storeId: 'survey4-laundry', label: 'Laundry', section: 'survey', subsection: 'rental-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey4-utilities', storeId: 'survey4-utilities', label: 'Utilities Included', section: 'survey', subsection: 'rental-comp-4', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey4-1br-sf', storeId: 'survey4-1br-sf', label: '1BR Avg SF', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-1br-rent', storeId: 'survey4-1br-rent', label: '1BR Rent/Mo', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-1br-psf', storeId: 'survey4-1br-psf', label: '1BR Rent/SF', section: 'survey', subsection: 'rental-comp-4', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'survey4-2br-sf', storeId: 'survey4-2br-sf', label: '2BR Avg SF', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-2br-rent', storeId: 'survey4-2br-rent', label: '2BR Rent/Mo', section: 'survey', subsection: 'rental-comp-4', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey4-2br-psf', storeId: 'survey4-2br-psf', label: '2BR Rent/SF', section: 'survey', subsection: 'rental-comp-4', type: 'calculated', inputSource: 'calculated', required: false },

  // --- RENTAL COMP 5 ---
  { id: 'survey5-name', storeId: 'survey5-name', label: 'Property Name', section: 'survey', subsection: 'rental-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey5-address', storeId: 'survey5-address', label: 'Address', section: 'survey', subsection: 'rental-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey5-city', storeId: 'survey5-city', label: 'City', section: 'survey', subsection: 'rental-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey5-distance', storeId: 'survey5-distance', label: 'Distance (km)', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-units', storeId: 'survey5-units', label: 'Total Units', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-year-built', storeId: 'survey5-year-built', label: 'Year Built', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-stories', storeId: 'survey5-stories', label: 'Stories', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-location', storeId: 'survey5-location', label: 'Location Rating', section: 'survey', subsection: 'rental-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey5-quality', storeId: 'survey5-quality', label: 'Quality Rating', section: 'survey', subsection: 'rental-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey5-condition', storeId: 'survey5-condition', label: 'Condition Rating', section: 'survey', subsection: 'rental-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey5-appeal', storeId: 'survey5-appeal', label: 'Appeal Rating', section: 'survey', subsection: 'rental-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey5-amenities', storeId: 'survey5-amenities', label: 'Amenities Rating', section: 'survey', subsection: 'rental-comp-5', type: 'select', inputSource: 'user-input', required: false, options: ['Superior', 'Similar', 'Inferior'] },
  { id: 'survey5-parking', storeId: 'survey5-parking', label: 'Parking', section: 'survey', subsection: 'rental-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey5-laundry', storeId: 'survey5-laundry', label: 'Laundry', section: 'survey', subsection: 'rental-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey5-utilities', storeId: 'survey5-utilities', label: 'Utilities Included', section: 'survey', subsection: 'rental-comp-5', type: 'text', inputSource: 'user-input', required: false },
  { id: 'survey5-1br-sf', storeId: 'survey5-1br-sf', label: '1BR Avg SF', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-1br-rent', storeId: 'survey5-1br-rent', label: '1BR Rent/Mo', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-1br-psf', storeId: 'survey5-1br-psf', label: '1BR Rent/SF', section: 'survey', subsection: 'rental-comp-5', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'survey5-2br-sf', storeId: 'survey5-2br-sf', label: '2BR Avg SF', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-2br-rent', storeId: 'survey5-2br-rent', label: '2BR Rent/Mo', section: 'survey', subsection: 'rental-comp-5', type: 'number', inputSource: 'user-input', required: false },
  { id: 'survey5-2br-psf', storeId: 'survey5-2br-psf', label: '2BR Rent/SF', section: 'survey', subsection: 'rental-comp-5', type: 'calculated', inputSource: 'calculated', required: false },

  // --- RENT ANALYSIS: 1 BEDROOM ---
  { id: 'rent-1br-high', storeId: 'rent-1br-high', label: '1BR High Rent', section: 'survey', subsection: 'rent-analysis-1br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-1br-low', storeId: 'rent-1br-low', label: '1BR Low Rent', section: 'survey', subsection: 'rent-analysis-1br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-1br-avg', storeId: 'rent-1br-avg', label: '1BR Average Rent', section: 'survey', subsection: 'rent-analysis-1br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-1br-median', storeId: 'rent-1br-median', label: '1BR Median Rent', section: 'survey', subsection: 'rent-analysis-1br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-1br-concluded-sf', storeId: 'rent-1br-concluded-sf', label: '1BR Concluded SF', section: 'survey', subsection: 'rent-analysis-1br', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rent-1br-concluded-rent', storeId: 'rent-1br-concluded-rent', label: '1BR Concluded Rent', section: 'survey', subsection: 'rent-analysis-1br', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rent-1br-concluded-psf', storeId: 'rent-1br-concluded-psf', label: '1BR Concluded Rent/SF', section: 'survey', subsection: 'rent-analysis-1br', type: 'calculated', inputSource: 'calculated', required: false },

  // --- RENT ANALYSIS: 2 BEDROOM ---
  { id: 'rent-2br-high', storeId: 'rent-2br-high', label: '2BR High Rent', section: 'survey', subsection: 'rent-analysis-2br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-2br-low', storeId: 'rent-2br-low', label: '2BR Low Rent', section: 'survey', subsection: 'rent-analysis-2br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-2br-avg', storeId: 'rent-2br-avg', label: '2BR Average Rent', section: 'survey', subsection: 'rent-analysis-2br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-2br-median', storeId: 'rent-2br-median', label: '2BR Median Rent', section: 'survey', subsection: 'rent-analysis-2br', type: 'calculated', inputSource: 'calculated', required: false },
  { id: 'rent-2br-concluded-sf', storeId: 'rent-2br-concluded-sf', label: '2BR Concluded SF', section: 'survey', subsection: 'rent-analysis-2br', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rent-2br-concluded-rent', storeId: 'rent-2br-concluded-rent', label: '2BR Concluded Rent', section: 'survey', subsection: 'rent-analysis-2br', type: 'number', inputSource: 'user-input', required: false },
  { id: 'rent-2br-concluded-psf', storeId: 'rent-2br-concluded-psf', label: '2BR Concluded Rent/SF', section: 'survey', subsection: 'rent-analysis-2br', type: 'calculated', inputSource: 'calculated', required: false },

  // --- SURVEY CONCLUSION ---
  { id: 'survey-conclusion', storeId: 'survey-conclusion', label: 'Rental Survey Conclusion', section: 'survey', subsection: 'survey-conclusion', type: 'textarea', inputSource: 'user-input', required: false },
  { id: 'survey-market-rent-support', storeId: 'survey-market-rent-support', label: 'Market Rent Support Narrative', section: 'survey', subsection: 'survey-conclusion', type: 'textarea', inputSource: 'user-input', required: false },

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
  { id: 'recon-final-value-per-unit', storeId: 'recon-final-value-per-unit', label: 'Final Value/Unit', section: 'recon', subsection: 'final-value', type: 'currency', inputSource: 'calculated', required: false },
  { id: 'recon-final-value-per-sf', storeId: 'recon-final-value-per-sf', label: 'Final Value/SF', section: 'recon', subsection: 'final-value', type: 'currency', inputSource: 'calculated', required: false },

  // Recon - Methodology Toggles Subsection
  { id: 'use-dcf-methodology', storeId: 'use-dcf-methodology', label: 'Use DCF Methodology', section: 'recon', subsection: 'methodology-toggles', type: 'select', options: ['Yes', 'No'], inputSource: 'user-input', required: false },
  { id: 'property-is-listed', storeId: 'property-is-listed', label: 'Property Currently Listed', section: 'recon', subsection: 'methodology-toggles', type: 'select', options: ['Yes', 'No'], inputSource: 'user-input', required: false },

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

  // Subject Property - Basic Info
  { id: 'subject-actualage', storeId: 'subject-actualage', label: 'Actual Age', section: 'property-identification', subsection: 'subject-property', type: 'number', inputSource: 'user-input', required: false },
  { id: 'subject-city', storeId: 'subject-city', label: 'City', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-effectiveage', storeId: 'subject-effectiveage', label: 'Effective Age', section: 'property-identification', subsection: 'subject-property', type: 'number', inputSource: 'user-input', required: false },
  { id: 'subject-economiclife', storeId: 'subject-economiclife', label: 'Economic Life', section: 'property-identification', subsection: 'subject-property', type: 'number', inputSource: 'user-input', required: false },
  { id: 'subject-geocode', storeId: 'subject-geocode', label: 'Geocode', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-location', storeId: 'subject-location', label: 'Location', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-market', storeId: 'subject-market', label: 'Market', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-nra', storeId: 'subject-nra', label: 'Net Rentable Area', section: 'property-identification', subsection: 'subject-property', type: 'number', inputSource: 'user-input', required: false },
  { id: 'subject-owner', storeId: 'subject-owner', label: 'Owner', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-propertyname', storeId: 'subject-propertyname', label: 'Property Name', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-province', storeId: 'subject-province', label: 'Province', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-remaininglife', storeId: 'subject-remaininglife', label: 'Remaining Life', section: 'property-identification', subsection: 'subject-property', type: 'number', inputSource: 'user-input', required: false },
  { id: 'subject-state', storeId: 'subject-state', label: 'State', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-street', storeId: 'subject-street', label: 'Street', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-submarket', storeId: 'subject-submarket', label: 'Submarket', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-yearbuilt', storeId: 'subject-yearbuilt', label: 'Year Built', section: 'property-identification', subsection: 'subject-property', type: 'number', inputSource: 'user-input', required: false },
  { id: 'subject-zip', storeId: 'subject-zip', label: 'Zip Code', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-zoning', storeId: 'subject-zoning', label: 'Zoning', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-zoningcode', storeId: 'subject-zoningcode', label: 'Zoning Code', section: 'property-identification', subsection: 'subject-property', type: 'text', inputSource: 'user-input', required: false },
  { id: 'subject-zoningdescription', storeId: 'subject-zoningdescription', label: 'Zoning Description', section: 'property-identification', subsection: 'subject-property', type: 'textarea', inputSource: 'user-input', required: false },

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

export const getSubsectionsForSection = (sectionId: string): string[] =>
  Array.from(new Set(
    fieldRegistry
      .filter(f => f.section === sectionId && f.subsection)
      .map(f => f.subsection as string)
  ));
