import { create } from "zustand";
import {
  ReportBuilderState,
  ReportSection,
  ReportField,
  SectionGroup,
} from "../types/reportBuilder.types";
import { northBattlefordTestData } from "../data/northBattlefordTestData";
import { fieldRegistry } from "../schema/fieldRegistry";

// Field ID mapping: test data ID -> store field ID (for fields that differ)
const testDataFieldMapping: Record<string, string> = {
  // CALC section - unit fields
  "calc-unit-1-type": "calc-type1-name",
  "calc-unit-1-count": "calc-type1-count",
  "calc-unit-1-sf": "calc-type1-sf",
  "calc-unit-1-market-rent": "calc-type1-rent",
  "calc-unit-2-type": "calc-type2-name",
  "calc-unit-2-count": "calc-type2-count",
  "calc-unit-2-sf": "calc-type2-sf",
  "calc-unit-2-market-rent": "calc-type2-rent",
  "calc-unit-3-type": "calc-type3-name",
  "calc-unit-3-count": "calc-type3-count",
  "calc-unit-3-sf": "calc-type3-sf",
  "calc-unit-3-market-rent": "calc-type3-rent",
  "calc-unit-4-type": "calc-type4-name",
  "calc-unit-4-count": "calc-type4-count",
  "calc-unit-4-sf": "calc-type4-sf",
  "calc-unit-4-market-rent": "calc-type4-rent",

  // LOCATION section
  "location-overview": "location-overview-text",
  "location-walk-score": "walk-score",
  "location-transit-score": "transit-score",
  "location-bike-score": "bike-score",
  "location-local-area": "local-area-description",
  "location-nearby-schools": "nearby-schools",
  "location-public-transit": "public-transit",

  // TAX section
  "tax-assessment-year": "assessment-year",
  "tax-assessed-value-total": "total-assessment",
  "tax-land-value": "land-assessment",
  "tax-building-value": "building-assessment",
  "tax-annual-amount": "annual-taxes",
  "tax-mill-rate": "mill-rate",

  // ZONE section
  "zone-classification": "zoning-classification",
  "zone-description": "zoning-description",
  "zone-max-height": "max-height",
  "zone-max-density": "max-density",
  "zone-parking-req": "parking-requirements",
  "zone-conformance": "zoning-conformance",
  "zone-conclusion": "zoning-conclusion",
  "zone-map-image": "zoning-map",

  // HBU section
  "hbu-introduction": "hbu-intro",
  "hbu-vacant-max-productive": "hbu-vacant-productive",
  "hbu-improved-analysis": "hbu-improved",
  "hbu-final-conclusion": "hbu-conclusion-text",

  // SALES section
  "subject-num-units": "subject-units",
  "subject-year-built": "subject-year",

  // IMPV section - prefix mapping
  "impv-num-stories": "impv-stories",
  "impv-project-amenities": "project-amenities",
  "impv-unit-amenities": "unit-amenities",
  "impv-laundry": "laundry",
  "impv-security": "security",
  "impv-foundation": "foundation",
  "impv-exterior-walls": "exterior-walls",
  "impv-roof": "roof",
  "impv-elevator": "elevator",
  "impv-hvac": "hvac",
  "impv-electrical": "electrical",
  "impv-plumbing": "plumbing",
  "impv-fire-protection": "fire-protection",
  "impv-interior-walls": "interior-walls",
  "impv-ceilings": "ceilings",
  "impv-flooring": "flooring",
  "impv-doors-windows": "doors-windows",
  "impv-site-improvements": "site-impv",
  "impv-landscaping": "landscaping",
  "impv-parking-spaces": "parking-spaces",
  "impv-parking-ratio": "parking-ratio",
  "impv-overall-condition": "overall-condition",
  "impv-functional-design": "functional-design",
  "impv-hazardous-materials": "hazardous-materials",

  // MARKET section
  "market-national-overview": "national-overview",
  "market-provincial-overview": "provincial-overview",
  "market-local-overview": "local-market",
  "market-segment-overview": "multifamily-overview",
  "market-rent-trend": "rent-trend",
  "market-vacancy-rate": "market-vacancy-rate",

  // SITE section
  "site-total-area": "site-total-area",
  "site-acreage": "site-acreage",
  "site-address": "site-address",

  // HBU additional mappings
  "hbu-vacant-conclusion": "hbu-vacant-productive",
  "hbu-improved-conclusion": "hbu-improved",

  // ZONE additional mappings
  "zone-permitted-uses": "permitted-uses",

  // EXEC section mappings
  "property-type": "property-type-display",
  "postal-code": "client-postal",

  // CALC expense mapping
  "calc-exp-marketing": "calc-exp-other", // Marketing grouped into other expenses

  // IMPV additional mappings (fields that need to be added or mapped)
  "impv-occupancy-rate": "occupancy-rate",
  "impv-insulation": "impv-insulation",
  "impv-interior-finish": "impv-interior-finish",
  "impv-roof-condition": "impv-roof-condition",
  "impv-building-footprint": "impv-building-footprint",
  "impv-site-coverage": "impv-site-coverage",

  // LOCATION additional mappings
  "location-aerial-map": "map-aerial",
  "location-local-map": "map-local",
  "location-nearby-amenities": "location-nearby-amenities",

  // MARKET detailed mappings
  "market-national-gdp": "market-national-gdp",
  "market-national-inflation": "market-national-inflation",
  "market-provincial-unemployment": "market-provincial-unemployment",
  "market-provincial-key-industries": "market-provincial-key-industries",
  "market-local-population": "market-local-population",
  "market-local-employment": "market-local-employment",
  "market-supply-pipeline": "market-supply-pipeline",
  "market-demand-drivers": "market-demand-drivers",

  // ZONE additional
  "zone-setbacks": "zone-setbacks",
  "zone-minimum-lot-size": "zone-minimum-lot-size",
  "zone-conditional-uses": "zone-conditional-uses",

  // RECON
  "recon-rounded-value": "recon-final-value",

  // PHOTOS - map individual photos to consolidated arrays (special handling in loadFullTestData)
  // These will be handled specially since store uses arrays
};

// Helper to build image-mgt section from fieldRegistry
const buildImageMgtSection = (): ReportSection => {
  const subsections: Record<string, { id: string; title: string; fields: ReportField[] }> = {
    'cover-images': { id: 'cover-images', title: 'COVER & SIGNATURE', fields: [] },
    'maps': { id: 'maps', title: 'MAPS', fields: [] },
    'exterior-photos': { id: 'exterior-photos', title: 'EXTERIOR PHOTOGRAPHS', fields: [] },
    'street-photos': { id: 'street-photos', title: 'STREET VIEW PHOTOGRAPHS', fields: [] },
    'common-photos': { id: 'common-photos', title: 'INTERIOR COMMON AREA', fields: [] },
    'unit-photos': { id: 'unit-photos', title: 'UNIT INTERIOR PHOTOGRAPHS', fields: [] },
    'systems-photos': { id: 'systems-photos', title: 'BUILDING SYSTEMS', fields: [] },
  };

  // Populate fields from fieldRegistry
  fieldRegistry.forEach(fieldDef => {
    if (fieldDef.section === 'image-mgt' && fieldDef.subsection && subsections[fieldDef.subsection]) {
      subsections[fieldDef.subsection].fields.push({
        id: fieldDef.storeId,
        label: fieldDef.label,
        type: fieldDef.type as any,
        value: fieldDef.defaultValue || '',
        isEditable: true,
        inputType: 'user-input',
      });
    }
  });

  return {
    id: 'image-mgt',
    name: 'Section 3: Image Management',
    shortName: 'S3 - IMAGE MGT',
    fields: [],
    subsections: Object.values(subsections),
  };
};

const getMockData = (): ReportSection[] => [
  // ═══════════════════════════════════════════════════════════════════════════
  // V3 OPERATIONAL SECTIONS - These mirror the deployed V3 Dashboard
  // Fields entered here auto-populate to their locations in other tabs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "client-intake",
    name: "Section 1: Client Intake",
    shortName: "S1 - INTAKE",
    fields: [],
    subsections: [
      {
        id: "client-info-intake",
        title: "CLIENT INFORMATION",
        fields: [
          {
            id: "intake-client-first-name",
            label: "Client First Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
            mapsTo: "client-contact-name", // Maps to cover section
          },
          {
            id: "intake-client-last-name",
            label: "Client Last Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "intake-client-email",
            label: "Client Email",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "intake-client-phone",
            label: "Client Phone",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "intake-client-title",
            label: "Client Title",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "intake-client-organization",
            label: "Client Organization",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
            mapsTo: "client-company",
          },
          {
            id: "intake-client-address",
            label: "Client Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
            mapsTo: "client-address",
          },
        ],
      },
      {
        id: "property-info-intake",
        title: "PROPERTY INFORMATION",
        fields: [
          {
            id: "intake-property-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
            mapsTo: "property-name",
          },
          {
            id: "intake-property-address",
            label: "Property Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
            mapsTo: "street-address",
          },
          {
            id: "intake-property-type",
            label: "Property Type",
            type: "dropdown",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: [
              "Agriculture",
              "Building",
              "Healthcare",
              "Hospitality",
              "Industrial",
              "Land",
              "Manufactured Housing",
              "Multi-Family",
              "Office",
              "Retail",
              "Self-Storage",
              "Single-Family",
              "Special Purpose",
            ],
            mapsTo: "property-type-display",
          },
          {
            id: "intake-intended-use",
            label: "Intended Use",
            type: "dropdown",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: [
              "Financing/Refinancing",
              "Acquisition",
              "Disposition",
              "Insurance",
              "Litigation",
              "Estate Planning",
            ],
            mapsTo: "assignment-intended-use",
          },
          {
            id: "intake-valuation-premises",
            label: "Valuation Premises",
            type: "dropdown",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: ["As Is", "As Stabilized", "As Complete", "As Proposed"],
            mapsTo: "value-scenario",
          },
          {
            id: "intake-asset-condition",
            label: "Asset Condition",
            type: "dropdown",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: ["New Development", "Existing Property"],
          },
        ],
      },
      {
        id: "property-contact-intake",
        title: "PROPERTY CONTACT (if different from client)",
        fields: [
          {
            id: "intake-property-contact-first-name",
            label: "Property Contact First Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "intake-property-contact-last-name",
            label: "Property Contact Last Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "intake-property-contact-email",
            label: "Property Contact Email",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "intake-property-contact-phone",
            label: "Property Contact Phone",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "notes-intake",
        title: "ADDITIONAL NOTES",
        fields: [
          {
            id: "intake-notes",
            label: "Client Notes",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "loe-prep",
    name: "Section 2: LOE Prep",
    shortName: "S2 - LOE",
    fields: [],
    subsections: [
      {
        id: "job-assignment",
        title: "JOB ASSIGNMENT",
        fields: [
          {
            id: "loe-valcre-job-id",
            label: "Valcre Job ID (VAL#)",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
            mapsTo: "file-number",
          },
        ],
      },
      {
        id: "financial-terms",
        title: "FINANCIAL TERMS",
        fields: [
          {
            id: "loe-appraisal-fee",
            label: "Appraisal Fee",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "loe-retainer-amount",
            label: "Retainer Amount",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "loe-payment-terms",
            label: "Payment Terms",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "delivery-details",
        title: "DELIVERY & REPORT DETAILS",
        fields: [
          {
            id: "loe-delivery-date",
            label: "Delivery Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "loe-report-type",
            label: "Report Type",
            type: "dropdown",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: [
              "Narrative Appraisal Report",
              "Summary Appraisal Report",
              "Restricted Appraisal Report",
            ],
            mapsTo: "report-type",
          },
          {
            id: "loe-property-rights",
            label: "Property Rights Appraised",
            type: "dropdown",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: ["Fee Simple Estate", "Leased Fee", "Leasehold"],
            mapsTo: "property-rights",
          },
        ],
      },
      {
        id: "scope-details",
        title: "SCOPE OF WORK",
        fields: [
          {
            id: "loe-scope-of-work",
            label: "Scope of Work",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
            mapsTo: "report-scope",
          },
          {
            id: "loe-special-instructions",
            label: "Special Instructions",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "comments-section",
        title: "COMMENTS",
        fields: [
          {
            id: "loe-internal-comments",
            label: "Internal Comments (not synced)",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "loe-appraiser-comments",
            label: "Appraiser Comments (syncs to Valcre)",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  // Build image-mgt section dynamically from fieldRegistry
  buildImageMgtSection(),
  // ═══════════════════════════════════════════════════════════════════════════
  // REPORT BUILDER SECTIONS - Standard appraisal report sections
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "cover",
    name: "Cover Page",
    shortName: "01 - COVER",
    fields: [
      {
        id: "img-cover-photo",
        label: "Cover Photo - Main property image",
        type: "image",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "img-signature",
        label: "Appraiser Signature",
        type: "image",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "property-type-display",
        label: "Property Type",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "property-name",
        label: "Property Name",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "street-address",
        label: "Street Address",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "city",
        label: "City",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "province",
        label: "Province",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "valuation-date",
        label: "Date of Valuation",
        type: "date",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "report-date",
        label: "Date of Report",
        type: "date",
        value: new Date().toLocaleDateString("en-CA"),
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "file-number",
        label: "File No",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
    ],
    subsections: [
      {
        id: "client-info",
        title: "PREPARED FOR",
        fields: [
          {
            id: "client-contact-name",
            label: "Client Contact",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "client-company",
            label: "Client Company",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "client-address",
            label: "Client Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "client-city",
            label: "Client City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "client-province",
            label: "Client Province",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "client-postal",
            label: "Client Postal Code",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "appraiser-info",
        title: "PREPARED BY",
        fields: [
          {
            id: "appraiser-name",
            label: "Appraiser Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "appraiser-credentials",
            label: "Appraiser Credentials",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "appraiser-title",
            label: "Appraiser Title",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "appraiser-company",
            label: "Company Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-address",
            label: "Company Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-city",
            label: "Company City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-phone",
            label: "Company Phone",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-website",
            label: "Company Website",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-email",
            label: "Appraiser Email",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "appraiser-aic-number",
            label: "AIC Number",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "home",
    name: "Introduction Letter",
    shortName: "02 - INTRO",
    fields: [],
    subsections: [
      {
        id: "transmittal-content",
        title: "LETTER OF TRANSMITTAL",
        fields: [
          {
            id: "transmittal-date",
            label: "Letter Date",
            type: "date",
            value: new Date().toLocaleDateString("en-CA"),
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "transmittal-body",
            label: "Letter Body",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "maps",
    name: "Location Maps",
    shortName: "03 - MAPS",
    fields: [],
    subsections: [
      {
        id: "location-maps",
        title: "LOCATION MAPS",
        fields: [
          {
            id: "img-map-regional",
            label: "Regional Map - Province/region context",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-map-local",
            label: "Local Area Map - City/neighborhood",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "aerial-maps",
        title: "AERIAL & SITE MAPS",
        fields: [
          {
            id: "img-map-aerial-1",
            label: "Aerial View - Bird's eye of property",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-map-aerial-2",
            label: "Site Boundary - Property lines shown",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-zoning-map",
            label: "Zoning Map - Municipal zoning",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "site-plans",
        title: "SITE PLANS",
        fields: [
          {
            id: "img-site-plan-1",
            label: "Site Plan - Layout/footprint",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-site-plan-2",
            label: "Survey/Plot Plan",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "assignment",
    name: "Identification of Assignment",
    shortName: "04 - ASSIGN",
    fields: [],
    subsections: [
      {
        id: "assignment-property-id",
        title: "PROPERTY IDENTIFICATION",
        fields: [
          {
            id: "assignment-property-legal",
            label: "Legal Description",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "assignment-property-address",
            label: "Property Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "assignment-property-type",
            label: "Property Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "assignment-property-interest",
            label: "Property Interest Appraised",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: ["Fee Simple Estate", "Leased Fee", "Leasehold"],
          },
        ],
      },
      {
        id: "assignment-client",
        title: "CLIENT & INTENDED USE",
        fields: [
          {
            id: "assignment-client-name",
            label: "Client Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "assignment-client-address",
            label: "Client Address",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "assignment-intended-use",
            label: "Intended Use",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "assignment-intended-users",
            label: "Intended Users",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "assignment-scope",
        title: "SCOPE OF WORK",
        fields: [
          {
            id: "assignment-inspection-date",
            label: "Inspection Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "assignment-inspection-type",
            label: "Inspection Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: ["Complete Interior & Exterior", "Exterior Only", "Drive-by"],
          },
          {
            id: "assignment-inspector-name",
            label: "Inspector Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "assignment-data-sources",
            label: "Data Sources",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "assignment-analysis-methods",
            label: "Analysis Methods",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "assignment-dates",
        title: "EFFECTIVE DATES",
        fields: [
          {
            id: "assignment-effective-date",
            label: "Effective Date of Value",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "assignment-report-date",
            label: "Report Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "assignment-conditions",
        title: "ASSUMPTIONS & CONDITIONS",
        fields: [
          {
            id: "assignment-hypothetical",
            label: "Hypothetical Conditions",
            type: "textarea",
            value: "No Hypothetical Conditions were made for this assignment.",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "assignment-extraordinary-assumptions",
            label: "Extraordinary Assumptions",
            type: "textarea",
            value: "No Extraordinary Assumptions were made for this assignment.",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "assignment-general-assumptions",
            label: "General Assumptions",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "assignment-limiting-conditions",
            label: "Limiting Conditions",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "report",
    name: "Report Information",
    shortName: "05 - REPORT",
    fields: [
      {
        id: "report-type",
        label: "Report Type",
        type: "text",
        value: "Appraisal Report",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "report-purpose",
        label: "Purpose",
        type: "textarea",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "report-scope",
        label: "Scope of Work",
        type: "textarea",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "report-compliance",
        label: "Compliance Standard",
        type: "text",
        value: "CUSPAP 2024",
        isEditable: true,
        inputType: "auto-filled",
      },
    ],
  },
  {
    id: "exec",
    name: "Executive Summary",
    shortName: "06 - EXEC",
    fields: [],
    subsections: [
      {
        id: "property-identification",
        title: "PROPERTY IDENTIFICATION",
        fields: [
          {
            id: "value-scenario",
            label: "Value Scenario",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: ["As Is", "As Stabilized", "As Complete", "As Proposed"],
          },
          {
            id: "property-rights",
            label: "Property Rights",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "dropdown",
            options: ["Fee Simple Estate", "Leased Fee", "Leasehold"],
          },
          {
            id: "building-style",
            label: "Building Style",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "total-buildings",
            label: "Total Buildings",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "total-nra",
            label: "Net Rentable Area (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "year-built",
            label: "Year Built",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "occupancy-rate",
            label: "Occupancy Rate (%)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "total-units",
            label: "Total Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "stories",
            label: "Number of Stories",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "building-format",
            label: "Building Format",
            type: "text",
            value: "garden style",
            isEditable: true,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "value-summary",
        title: "VALUE SUMMARY",
        fields: [
          {
            id: "concluded-value",
            label: "Concluded Value",
            type: "calculated",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "hypothetical-conditions",
            label: "Hypothetical Conditions",
            type: "textarea",
            value: "No Hypothetical Conditions were made for this assignment.",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "extraordinary-assumptions",
            label: "Extraordinary Assumptions",
            type: "textarea",
            value:
              "No Extraordinary Assumptions were made for this assignment.",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "extraordinary-limiting-conditions",
            label: "Extraordinary Limiting Conditions",
            type: "textarea",
            value:
              "No Extraordinary Limiting Conditions were made for this assignment.",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "photos",
    name: "Property Photographs",
    shortName: "07 - PHOTOS",
    fields: [],
    subsections: [
      {
        id: "exterior-photos",
        title: "EXTERIOR PHOTOGRAPHS",
        fields: [
          {
            id: "img-exterior-1",
            label: "Exterior 1 - Front Facade",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-1-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-2",
            label: "Exterior 2 - Rear Elevation",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-2-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-3",
            label: "Exterior 3 - Left Side",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-3-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-4",
            label: "Exterior 4 - Right Side",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-4-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-5",
            label: "Exterior 5 - Detail/Feature",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-5-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-6",
            label: "Exterior 6 - Additional",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-exterior-6-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "street-views",
        title: "STREET VIEW PHOTOGRAPHS",
        fields: [
          {
            id: "img-street-1",
            label: "Street View 1 - Looking North",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-street-1-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-street-2",
            label: "Street View 2 - Looking South",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-street-2-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-street-3",
            label: "Street View 3 - Streetscape/Context",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-street-3-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "interior-common",
        title: "INTERIOR COMMON AREA",
        fields: [
          {
            id: "img-common-1",
            label: "Common Area 1 - Lobby/Entrance",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-common-1-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-common-2",
            label: "Common Area 2 - Hallway/Corridor",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-common-2-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-common-3",
            label: "Common Area 3 - Amenity Space",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-common-3-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-common-4",
            label: "Common Area 4 - Additional",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-common-4-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "unit-interiors",
        title: "UNIT INTERIOR PHOTOGRAPHS",
        fields: [
          {
            id: "img-unit-1",
            label: "Unit Interior 1 - Living Room",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-1-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-2",
            label: "Unit Interior 2 - Kitchen",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-2-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-3",
            label: "Unit Interior 3 - Bedroom",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-3-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-4",
            label: "Unit Interior 4 - Bathroom",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-4-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-5",
            label: "Unit Interior 5 - Additional Room",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-5-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-6",
            label: "Unit Interior 6 - Additional",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-unit-6-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "building-systems",
        title: "BUILDING SYSTEMS",
        fields: [
          {
            id: "img-systems-1",
            label: "Building Systems 1 - Mechanical Room",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-systems-1-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-systems-2",
            label: "Building Systems 2 - Electrical Panel",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-systems-2-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-systems-3",
            label: "Building Systems 3 - Plumbing/Water Heater",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-systems-3-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-systems-4",
            label: "Building Systems 4 - HVAC/Furnace",
            type: "image",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "img-systems-4-caption",
            label: "Caption",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "site",
    name: "Site Details",
    shortName: "08 - SITE",
    fields: [],
    subsections: [
      {
        id: "site-area",
        title: "SITE AREA",
        fields: [
          {
            id: "site-total-area",
            label: "Total Site Area (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "site-acreage",
            label: "Site Acreage",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "site-address",
            label: "Site Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "site-shape",
            label: "Shape",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "topography",
            label: "Topography",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "accessibility",
            label: "Accessibility",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "exposure-visibility",
            label: "Exposure & Visibility",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "adjacent-uses",
        title: "ADJACENT USES",
        fields: [
          {
            id: "adjacent-north",
            label: "North",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "adjacent-south",
            label: "South",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "adjacent-east",
            label: "East",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "adjacent-west",
            label: "West",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "site-conditions",
        title: "SITE CONDITIONS",
        fields: [
          {
            id: "easements",
            label: "Easements & Encroachments",
            type: "textarea",
            value: "Assumed satisfactory unless noted",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "soils",
            label: "Soils",
            type: "textarea",
            value: "Assumed suitable for development",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "hazardous-waste",
            label: "Environmental Concerns",
            type: "textarea",
            value: "None present based on review",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "site-rating",
            label: "Site Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "site-conclusion",
            label: "Site Conclusion",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "site-plan-images",
        title: "SITE PLAN IMAGES",
        fields: [
          {
            id: "site-plan-image",
            label: "Site Plan Images",
            type: "image",
            value: [],
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "location",
    name: "Location Analysis",
    shortName: "09 - LOCATION",
    fields: [],
    subsections: [
      {
        id: "location-overview",
        title: "LOCATION OVERVIEW",
        fields: [
          {
            id: "location-overview-text",
            label: "Location Overview",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "location-access",
            label: "Access",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "public-transit",
            label: "Public Transportation",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "walkability-scores",
        title: "WALKABILITY SCORES",
        fields: [
          {
            id: "walk-score",
            label: "Walk Score",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "transit-score",
            label: "Transit Score",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "bike-score",
            label: "Bike Score",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "local-area",
        title: "LOCAL AREA",
        fields: [
          {
            id: "local-area-description",
            label: "Local Area Description",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "nearby-schools",
            label: "Nearby Schools",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "location-nearby-amenities",
            label: "Nearby Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "tax",
    name: "Property Taxes",
    shortName: "10 - TAX",
    fields: [
      {
        id: "assessment-year",
        label: "Assessment Year",
        type: "number",
        value: new Date().getFullYear(),
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "land-assessment",
        label: "Land Assessment",
        type: "number",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "building-assessment",
        label: "Building Assessment",
        type: "number",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "total-assessment",
        label: "Total Assessment",
        type: "number",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "mill-rate",
        label: "Mill Rate",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "annual-taxes",
        label: "Annual Taxes",
        type: "number",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "tax-commentary",
        label: "Tax Commentary",
        type: "textarea",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
    ],
  },
  {
    id: "market",
    name: "Market Analysis",
    shortName: "11 - MARKET",
    fields: [],
    subsections: [
      {
        id: "market-national",
        title: "NATIONAL OVERVIEW",
        fields: [
          {
            id: "national-overview",
            label: "National Economic Overview",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-national-gdp",
            label: "GDP Growth",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-national-inflation",
            label: "Inflation Rate",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "market-provincial",
        title: "PROVINCIAL OVERVIEW",
        fields: [
          {
            id: "provincial-overview",
            label: "Provincial Overview",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-provincial-unemployment",
            label: "Unemployment Rate",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-provincial-key-industries",
            label: "Key Industries",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "market-local",
        title: "LOCAL MARKET",
        fields: [
          {
            id: "local-market",
            label: "Local Market Analysis",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-local-population",
            label: "Population",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-local-employment",
            label: "Employment",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "market-multifamily",
        title: "MULTIFAMILY MARKET",
        fields: [
          {
            id: "multifamily-overview",
            label: "Multifamily Market Overview",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-vacancy-rate",
            label: "Market Vacancy Rate (%)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "rent-trend",
            label: "Rent Trend",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-supply-pipeline",
            label: "Supply Pipeline",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "market-demand-drivers",
            label: "Demand Drivers",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "impv",
    name: "Improvements",
    shortName: "12 - IMPV",
    fields: [],
    subsections: [
      {
        id: "building-overview",
        title: "BUILDING OVERVIEW",
        fields: [
          {
            id: "impv-overview",
            label: "Overview",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "impv-num-buildings",
            label: "Number of Buildings",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "impv-nra",
            label: "Net Rentable Area (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "impv-year-built",
            label: "Year Built",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "impv-num-units",
            label: "Number of Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "impv-stories",
            label: "Number of Stories",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "impv-building-format",
            label: "Building Format",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "amenities",
        title: "AMENITIES",
        fields: [
          {
            id: "project-amenities",
            label: "Project Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "unit-amenities",
            label: "Unit Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "laundry",
            label: "Laundry",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "security",
            label: "Security Features",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "construction",
        title: "CONSTRUCTION",
        fields: [
          {
            id: "foundation",
            label: "Foundation",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "exterior-walls",
            label: "Exterior Walls/Framing",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "roof",
            label: "Roof",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "impv-roof-condition",
            label: "Roof Condition",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "impv-insulation",
            label: "Insulation",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "elevator",
            label: "Elevator",
            type: "text",
            value: "None",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "systems",
        title: "BUILDING SYSTEMS",
        fields: [
          {
            id: "hvac",
            label: "HVAC",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "electrical",
            label: "Electrical",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "plumbing",
            label: "Plumbing",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "fire-protection",
            label: "Fire Protection",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "finishes",
        title: "INTERIOR FINISHES",
        fields: [
          {
            id: "interior-walls",
            label: "Interior Walls",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "ceilings",
            label: "Ceilings",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "flooring",
            label: "Flooring",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "doors-windows",
            label: "Doors & Windows",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "impv-interior-finish",
            label: "Interior Finish Quality",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "site-improvements",
        title: "SITE IMPROVEMENTS",
        fields: [
          {
            id: "site-impv",
            label: "Site Improvements",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "landscaping",
            label: "Landscaping",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "parking-spaces",
            label: "Parking Spaces",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "parking-ratio",
            label: "Parking Ratio",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "impv-building-footprint",
            label: "Building Footprint (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "impv-site-coverage",
            label: "Site Coverage (%)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "condition",
        title: "CONDITION",
        fields: [
          {
            id: "overall-condition",
            label: "Overall Condition",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "functional-design",
            label: "Functional Design",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "hazardous-materials",
            label: "Hazardous Materials",
            type: "textarea",
            value: "Assumes free of hazardous waste, asbestos, mold",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "zone",
    name: "Zoning",
    shortName: "13 - ZONE",
    fields: [
      {
        id: "zoning-classification",
        label: "Zoning Classification",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "zoning-description",
        label: "Zoning Description",
        type: "textarea",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "permitted-uses",
        label: "Permitted Uses",
        type: "textarea",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "zone-conditional-uses",
        label: "Conditional Uses",
        type: "textarea",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "zone-minimum-lot-size",
        label: "Minimum Lot Size",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "zone-setbacks",
        label: "Setback Requirements",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "max-height",
        label: "Max Height",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "max-density",
        label: "Max Density",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "min-setback",
        label: "Min Setback",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "parking-requirements",
        label: "Parking Requirements",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "site-coverage",
        label: "Site Coverage",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "zoning-conformance",
        label: "Conformance",
        type: "text",
        value: "Legally conforming use",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "zoning-conclusion",
        label: "Zoning Conclusion",
        type: "textarea",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "zoning-map",
        label: "Zoning Map",
        type: "image",
        value: [],
        isEditable: true,
        inputType: "user-input",
      },
    ],
  },
  {
    id: "hbu",
    name: "Highest & Best Use",
    shortName: "14 - HBU",
    fields: [],
    subsections: [
      {
        id: "hbu-introduction",
        title: "INTRODUCTION",
        fields: [
          {
            id: "hbu-intro",
            label: "HBU Introduction",
            type: "textarea",
            value:
              "The highest and best use of a property is defined as the reasonably probable use of property that results in the highest value.",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "hbu-as-vacant",
        title: "AS VACANT",
        fields: [
          {
            id: "hbu-vacant-legal",
            label: "Legally Permissible",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "hbu-vacant-physical",
            label: "Physically Possible",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "hbu-vacant-financial",
            label: "Financially Feasible",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "hbu-vacant-productive",
            label: "Maximally Productive",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "hbu-as-improved",
        title: "AS IMPROVED",
        fields: [
          {
            id: "hbu-improved",
            label: "Highest & Best Use As Improved",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "hbu-conclusion",
        title: "CONCLUSION",
        fields: [
          {
            id: "hbu-conclusion-text",
            label: "HBU Conclusion",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "calc",
    name: "Calculator",
    shortName: "15 - CALC",
    fields: [],
    subsections: [
      {
        id: "calc-unit-mix",
        title: "UNIT MIX",
        fields: [
          // Unit Type 1
          {
            id: "calc-type1-name",
            label: "Unit Type 1",
            type: "text",
            value: "1BR/1BA",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type1-count",
            label: "Unit Count",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type1-sf",
            label: "Avg SF",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type1-rent",
            label: "Market Rent/Mo",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type1-annual",
            label: "Annual Revenue",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          // Unit Type 2
          {
            id: "calc-type2-name",
            label: "Unit Type 2",
            type: "text",
            value: "2BR/1BA",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type2-count",
            label: "Unit Count",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type2-sf",
            label: "Avg SF",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type2-rent",
            label: "Market Rent/Mo",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type2-annual",
            label: "Annual Revenue",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          // Unit Type 3
          {
            id: "calc-type3-name",
            label: "Unit Type 3",
            type: "text",
            value: "2BR/2BA",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type3-count",
            label: "Unit Count",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type3-sf",
            label: "Avg SF",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type3-rent",
            label: "Market Rent/Mo",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type3-annual",
            label: "Annual Revenue",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          // Unit Type 4
          {
            id: "calc-type4-name",
            label: "Unit Type 4",
            type: "text",
            value: "3BR/2BA",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type4-count",
            label: "Unit Count",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type4-sf",
            label: "Avg SF",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type4-rent",
            label: "Market Rent/Mo",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-type4-annual",
            label: "Annual Revenue",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          // Totals
          {
            id: "calc-total-units",
            label: "Total Units",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-total-sf",
            label: "Total SF",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-avg-unit-sf",
            label: "Avg Unit SF",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-total-rental-revenue",
            label: "Total Rental Revenue",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-avg-rent-per-unit",
            label: "Avg Rent/Unit",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-avg-rent-per-sf",
            label: "Avg Rent/SF",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "calc-other-income",
        title: "OTHER INCOME",
        fields: [
          {
            id: "calc-parking-per-unit",
            label: "Parking $/Unit/Mo",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-parking-total",
            label: "Parking Annual",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-laundry-per-unit",
            label: "Laundry $/Unit/Mo",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-laundry-total",
            label: "Laundry Annual",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-other-income",
            label: "Other Income Annual",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-total-other-income",
            label: "Total Other Income",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-pgr",
            label: "Potential Gross Revenue",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "calc-vacancy",
        title: "VACANCY & LOSS",
        fields: [
          {
            id: "calc-vacancy-rate",
            label: "Vacancy Rate (%)",
            type: "number",
            value: 5,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-bad-debt-rate",
            label: "Bad Debt Rate (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-concessions-rate",
            label: "Concessions Rate (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-vacancy-loss",
            label: "Total Vacancy & Loss",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-egr",
            label: "Effective Gross Revenue",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "calc-expenses",
        title: "OPERATING EXPENSES",
        fields: [
          {
            id: "calc-exp-management",
            label: "Management",
            type: "number",
            value: 4.25,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "percent_egr",
          },
          {
            id: "calc-exp-taxes",
            label: "Real Estate Taxes",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-exp-insurance",
            label: "Insurance",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-exp-repairs",
            label: "Repairs & Maintenance",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-exp-utilities",
            label: "Utilities",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-exp-payroll",
            label: "Payroll",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-exp-admin",
            label: "Admin & General",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-exp-reserves",
            label: "Replacement Reserves",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-exp-other",
            label: "Other Expenses",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
            expenseCalcBase: "per_unit",
          },
          {
            id: "calc-expenses-total",
            label: "Total Expenses",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-expense-ratio",
            label: "Expense Ratio (%)",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "calc-cap",
        title: "CAPITALIZATION",
        fields: [
          {
            id: "calc-cap-rate",
            label: "Cap Rate (%)",
            type: "number",
            value: 6.5,
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "calc-adjustments",
        title: "POST-VALUE ADJUSTMENTS",
        fields: [
          {
            id: "calc-adj-capex",
            label: "CapEx Adjustment",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-adj-leasing",
            label: "Leasing Costs",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-adj-other",
            label: "Other Adjustments",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "calc-adj-total",
            label: "Total Adjustments",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "calc-results",
        title: "VALUATION RESULTS",
        fields: [
          {
            id: "calc-noi",
            label: "Net Operating Income",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-noi-per-unit",
            label: "NOI/Unit",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-noi-per-sf",
            label: "NOI/SF",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-raw-value",
            label: "Raw Value",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-indicated-value",
            label: "Indicated Value",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-value-per-unit",
            label: "Value/Unit",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-value-per-sf",
            label: "Value/SF",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "calc-grm",
            label: "GRM",
            type: "calculated",
            value: 0,
            isEditable: false,
            inputType: "auto-filled",
          },
        ],
      },
    ],
  },
  {
    id: "land1",
    name: "Land Value",
    shortName: "16 - LAND",
    fields: [
      {
        id: "land-value-conclusion",
        label: "Land Value Conclusion",
        type: "textarea",
        value: "Land value analysis not applicable for this assignment.",
        isEditable: true,
        inputType: "user-input",
      },
    ],
  },
  {
    id: "cost-s",
    name: "Cost Approach",
    shortName: "17 - COST",
    fields: [
      {
        id: "cost-approach-conclusion",
        label: "Cost Approach Conclusion",
        type: "textarea",
        value: "Cost approach not applicable for this assignment.",
        isEditable: true,
        inputType: "user-input",
      },
    ],
  },
  {
    id: "sales",
    name: "Sales Comparison",
    shortName: "18 - SALES",
    fields: [],
    subsections: [
      {
        id: "subject-summary",
        title: "SUBJECT PROPERTY SUMMARY",
        fields: [
          {
            id: "subject-units",
            label: "Number of Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "subject-gba",
            label: "Gross Building Area (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "subject-year",
            label: "Year Built",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "subject-site-area",
            label: "Site Area (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "subject-parking",
            label: "Parking Ratio",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "subject-condition",
            label: "Condition",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "sale-comp-1",
        title: "COMPARABLE SALE 1",
        fields: [
          {
            id: "comp1-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-sale-date",
            label: "Sale Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-sale-price",
            label: "Sale Price",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-units",
            label: "Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-price-per-unit",
            label: "Price/Unit",
            type: "calculated",
            value: "",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "comp1-gba",
            label: "GBA (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-price-per-sf",
            label: "Price/SF",
            type: "calculated",
            value: "",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "comp1-year",
            label: "Year Built",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-cap-rate",
            label: "Cap Rate (%)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-property-rights",
            label: "Property Rights Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-financing",
            label: "Financing Terms Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-conditions-sale",
            label: "Conditions of Sale Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-market-time",
            label: "Market/Time Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-location",
            label: "Location Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-size",
            label: "Size Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-age-condition",
            label: "Age/Condition Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp1-adj-other",
            label: "Other Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "sale-comp-2",
        title: "COMPARABLE SALE 2",
        fields: [
          {
            id: "comp2-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-sale-date",
            label: "Sale Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-sale-price",
            label: "Sale Price",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-units",
            label: "Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-price-per-unit",
            label: "Price/Unit",
            type: "calculated",
            value: "",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "comp2-gba",
            label: "GBA (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-price-per-sf",
            label: "Price/SF",
            type: "calculated",
            value: "",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "comp2-year",
            label: "Year Built",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-cap-rate",
            label: "Cap Rate (%)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-property-rights",
            label: "Property Rights Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-financing",
            label: "Financing Terms Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-conditions-sale",
            label: "Conditions of Sale Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-market-time",
            label: "Market/Time Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-location",
            label: "Location Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-size",
            label: "Size Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-age-condition",
            label: "Age/Condition Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp2-adj-other",
            label: "Other Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "sale-comp-3",
        title: "COMPARABLE SALE 3",
        fields: [
          {
            id: "comp3-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-sale-date",
            label: "Sale Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-sale-price",
            label: "Sale Price",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-units",
            label: "Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-price-per-unit",
            label: "Price/Unit",
            type: "calculated",
            value: "",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "comp3-gba",
            label: "GBA (SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-price-per-sf",
            label: "Price/SF",
            type: "calculated",
            value: "",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "comp3-year",
            label: "Year Built",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-cap-rate",
            label: "Cap Rate (%)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-property-rights",
            label: "Property Rights Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-financing",
            label: "Financing Terms Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-conditions-sale",
            label: "Conditions of Sale Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-market-time",
            label: "Market/Time Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-location",
            label: "Location Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-size",
            label: "Size Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-age-condition",
            label: "Age/Condition Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "comp3-adj-other",
            label: "Other Adj (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "sales-conclusion",
        title: "VALUE CONCLUSION",
        fields: [
          {
            id: "sales-value-indication",
            label: "Sales Comparison Value",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "sales-adjustment-summary",
            label: "Adjustment Summary",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "income",
    name: "Income Approach",
    shortName: "19 - INCOME",
    fields: [],
    subsections: [
      {
        id: "income-potential",
        title: "POTENTIAL INCOME",
        fields: [
          {
            id: "income-pgi-narrative",
            label: "PGI Analysis",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "income-expenses",
        title: "OPERATING EXPENSES",
        fields: [
          {
            id: "income-expense-narrative",
            label: "Expense Analysis",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "income-noi",
        title: "NET OPERATING INCOME",
        fields: [
          {
            id: "income-noi-narrative",
            label: "NOI Analysis",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "income-analysis",
        title: "INCOME APPROACH ANALYSIS",
        fields: [
          {
            id: "income-cap-rate-analysis",
            label: "Cap Rate Analysis",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "income-value-indication",
            label: "Income Approach Value",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "calculated",
          },
        ],
      },
    ],
  },
  {
    id: "rental-survey",
    name: "Rental Survey",
    shortName: "20 - RENTAL",
    fields: [],
    subsections: [
      {
        id: "rental-subject",
        title: "SUBJECT PROPERTY",
        fields: [
          {
            id: "rental-subject-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-city",
            label: "City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-province",
            label: "Province",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-rent-type",
            label: "Rent Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-rent-unit-avg",
            label: "Rent per Unit ($/unit)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-rent-sf-avg",
            label: "Rent per SF ($/SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-unit-amenities",
            label: "Unit Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-utilities-included",
            label: "Utilities Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-parking-included",
            label: "Parking Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-parking-type",
            label: "Parking Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-laundry",
            label: "Laundry",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-survey-comments",
            label: "Survey Comments",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-units",
            label: "Total Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-avg-unit-sf",
            label: "Average Unit SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-location-rating",
            label: "Location Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-quality-rating",
            label: "Quality Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-condition-rating",
            label: "Condition Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-appeal-rating",
            label: "Appeal Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-project-amenities",
            label: "Project Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-subject-security-features",
            label: "Security Features",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "rental-comp-1",
        title: "RENTAL COMPARABLE 1",
        fields: [
          {
            id: "rental-comp1-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-city",
            label: "City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-province",
            label: "Province",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-rent-type",
            label: "Rent Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-rent-unit-avg",
            label: "Rent per Unit ($/unit)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-rent-sf-avg",
            label: "Rent per SF ($/SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-unit-amenities",
            label: "Unit Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-utilities-included",
            label: "Utilities Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-parking-included",
            label: "Parking Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-parking-type",
            label: "Parking Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-laundry",
            label: "Laundry",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-survey-comments",
            label: "Survey Comments",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-units",
            label: "Total Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-avg-unit-sf",
            label: "Average Unit SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-location-rating",
            label: "Location Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-quality-rating",
            label: "Quality Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-condition-rating",
            label: "Condition Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-appeal-rating",
            label: "Appeal Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-project-amenities",
            label: "Project Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp1-security-features",
            label: "Security Features",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "rental-comp-2",
        title: "RENTAL COMPARABLE 2",
        fields: [
          {
            id: "rental-comp2-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-city",
            label: "City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-province",
            label: "Province",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-rent-type",
            label: "Rent Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-rent-unit-avg",
            label: "Rent per Unit ($/unit)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-rent-sf-avg",
            label: "Rent per SF ($/SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-unit-amenities",
            label: "Unit Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-utilities-included",
            label: "Utilities Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-parking-included",
            label: "Parking Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-parking-type",
            label: "Parking Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-laundry",
            label: "Laundry",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-survey-comments",
            label: "Survey Comments",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-units",
            label: "Total Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-avg-unit-sf",
            label: "Average Unit SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-location-rating",
            label: "Location Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-quality-rating",
            label: "Quality Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-condition-rating",
            label: "Condition Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-appeal-rating",
            label: "Appeal Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-project-amenities",
            label: "Project Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp2-security-features",
            label: "Security Features",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "rental-comp-3",
        title: "RENTAL COMPARABLE 3",
        fields: [
          {
            id: "rental-comp3-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-city",
            label: "City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-province",
            label: "Province",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-rent-type",
            label: "Rent Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-rent-unit-avg",
            label: "Rent per Unit ($/unit)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-rent-sf-avg",
            label: "Rent per SF ($/SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-unit-amenities",
            label: "Unit Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-utilities-included",
            label: "Utilities Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-parking-included",
            label: "Parking Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-parking-type",
            label: "Parking Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-laundry",
            label: "Laundry",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-survey-comments",
            label: "Survey Comments",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-units",
            label: "Total Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-avg-unit-sf",
            label: "Average Unit SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-location-rating",
            label: "Location Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-quality-rating",
            label: "Quality Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-condition-rating",
            label: "Condition Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-appeal-rating",
            label: "Appeal Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-project-amenities",
            label: "Project Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp3-security-features",
            label: "Security Features",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "rental-comp-4",
        title: "RENTAL COMPARABLE 4",
        fields: [
          {
            id: "rental-comp4-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-city",
            label: "City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-province",
            label: "Province",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-rent-type",
            label: "Rent Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-rent-unit-avg",
            label: "Rent per Unit ($/unit)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-rent-sf-avg",
            label: "Rent per SF ($/SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-unit-amenities",
            label: "Unit Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-utilities-included",
            label: "Utilities Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-parking-included",
            label: "Parking Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-parking-type",
            label: "Parking Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-laundry",
            label: "Laundry",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-survey-comments",
            label: "Survey Comments",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-units",
            label: "Total Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-avg-unit-sf",
            label: "Average Unit SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-location-rating",
            label: "Location Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-quality-rating",
            label: "Quality Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-condition-rating",
            label: "Condition Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-appeal-rating",
            label: "Appeal Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-project-amenities",
            label: "Project Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp4-security-features",
            label: "Security Features",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "rental-comp-5",
        title: "RENTAL COMPARABLE 5",
        fields: [
          {
            id: "rental-comp5-name",
            label: "Property Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-address",
            label: "Address",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-city",
            label: "City",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-province",
            label: "Province",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-rent-type",
            label: "Rent Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-rent-unit-avg",
            label: "Rent per Unit ($/unit)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-rent-sf-avg",
            label: "Rent per SF ($/SF)",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-unit-amenities",
            label: "Unit Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-utilities-included",
            label: "Utilities Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-parking-included",
            label: "Parking Included",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-parking-type",
            label: "Parking Type",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-laundry",
            label: "Laundry",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-survey-comments",
            label: "Survey Comments",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-units",
            label: "Total Units",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-avg-unit-sf",
            label: "Average Unit SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-location-rating",
            label: "Location Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-quality-rating",
            label: "Quality Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-condition-rating",
            label: "Condition Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-appeal-rating",
            label: "Appeal Rating",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-project-amenities",
            label: "Project Amenities",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-comp5-security-features",
            label: "Security Features",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "unit-analysis-1br",
        title: "UNIT ANALYSIS - 1 BEDROOM",
        fields: [
          {
            id: "rental-1br-sf",
            label: "1BR Average SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-rent-per-unit",
            label: "1BR Rent per Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-rent-per-sf",
            label: "1BR Rent per SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-final-conclusion",
            label: "1BR Final Conclusion",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-high-rent-unit",
            label: "High - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-high-rent-sf",
            label: "High - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-avg-rent-unit",
            label: "Average - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-avg-rent-sf",
            label: "Average - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-med-rent-unit",
            label: "Median - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-med-rent-sf",
            label: "Median - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-low-rent-unit",
            label: "Low - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-1br-low-rent-sf",
            label: "Low - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "unit-analysis-2br",
        title: "UNIT ANALYSIS - 2 BEDROOM",
        fields: [
          {
            id: "rental-2br-sf",
            label: "2BR Average SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-rent-per-unit",
            label: "2BR Rent per Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-rent-per-sf",
            label: "2BR Rent per SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-final-conclusion",
            label: "2BR Final Conclusion",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-high-rent-unit",
            label: "High - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-high-rent-sf",
            label: "High - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-avg-rent-unit",
            label: "Average - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-avg-rent-sf",
            label: "Average - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-med-rent-unit",
            label: "Median - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-med-rent-sf",
            label: "Median - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-low-rent-unit",
            label: "Low - Rent/Unit",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "rental-2br-low-rent-sf",
            label: "Low - Rent/SF",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
    ],
  },
  {
    id: "recon",
    name: "Reconciliation",
    shortName: "21 - RECON",
    fields: [],
    subsections: [
      {
        id: "value-indications",
        title: "VALUE INDICATIONS",
        fields: [
          {
            id: "recon-income-value",
            label: "Income Approach Value",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "recon-sales-value",
            label: "Sales Comparison Value",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "recon-cost-value",
            label: "Cost Approach Value",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "reconciliation-weights",
        title: "RECONCILIATION WEIGHTS",
        fields: [
          {
            id: "recon-income-weight",
            label: "Income Weight (%)",
            type: "number",
            value: 60,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "recon-sales-weight",
            label: "Sales Weight (%)",
            type: "number",
            value: 40,
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "recon-cost-weight",
            label: "Cost Weight (%)",
            type: "number",
            value: 0,
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "reconciliation-analysis",
        title: "RECONCILIATION ANALYSIS",
        fields: [
          {
            id: "recon-narrative",
            label: "Reconciliation Narrative",
            type: "textarea",
            value: "",
            isEditable: true,
            inputType: "user-input",
          },
        ],
      },
      {
        id: "final-value",
        title: "FINAL VALUE CONCLUSION",
        fields: [
          {
            id: "recon-final-value",
            label: "Final Value",
            type: "number",
            value: "",
            isEditable: true,
            inputType: "calculated",
          },
          {
            id: "recon-value-premise",
            label: "Value Premise",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "recon-effective-date",
            label: "Effective Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
        ],
      },
    ],
  },
  {
    id: "cert",
    name: "Certification",
    shortName: "22 - CERT",
    fields: [],
    subsections: [
      {
        id: "certification-statements",
        title: "CERTIFICATION",
        fields: [
          {
            id: "cert-statement-1",
            label: "Statement 1",
            type: "textarea",
            value:
              "The statements of fact contained in this report are true and correct.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-2",
            label: "Statement 2",
            type: "textarea",
            value:
              "The reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions and are my personal, impartial, and unbiased professional analyses, opinions, and conclusions.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-3",
            label: "Statement 3",
            type: "textarea",
            value:
              "I have no present or prospective interest in the property that is the subject of this report and no personal interest with respect to the parties involved.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-4",
            label: "Statement 4",
            type: "textarea",
            value:
              "I have performed no services, as an appraiser or in any other capacity, regarding the property that is the subject of this report within the three-year period immediately preceding acceptance of this assignment.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-5",
            label: "Statement 5",
            type: "textarea",
            value:
              "I have no bias with respect to the property that is the subject of this report or to the parties involved with this assignment.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-6",
            label: "Statement 6",
            type: "textarea",
            value:
              "My engagement in this assignment was not contingent upon developing or reporting predetermined results.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-7",
            label: "Statement 7",
            type: "textarea",
            value:
              "My compensation for completing this assignment is not contingent upon the development or reporting of a predetermined value or direction in value that favors the cause of the client, the amount of the value opinion, the attainment of a stipulated result, or the occurrence of a subsequent event directly related to the intended use of this appraisal.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-8",
            label: "Statement 8",
            type: "textarea",
            value:
              "My analyses, opinions, and conclusions were developed, and this report has been prepared, in conformity with the Canadian Uniform Standards of Professional Appraisal Practice.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-9",
            label: "Statement 9",
            type: "textarea",
            value:
              "I have made a personal inspection of the property that is the subject of this report.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-10",
            label: "Statement 10",
            type: "textarea",
            value:
              "No one provided significant real property appraisal assistance to the person signing this certification.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-11",
            label: "Statement 11",
            type: "textarea",
            value:
              "The reported analyses, opinions, and conclusions were developed, and this report has been prepared, in conformity with the requirements of the Code of Professional Ethics and Standards of Professional Appraisal Practice of the Appraisal Institute.",
            isEditable: false,
            inputType: "auto-filled",
          },
          {
            id: "cert-statement-12",
            label: "Statement 12",
            type: "textarea",
            value:
              "As of the date of this report, I have completed the continuing education program for Designated Members of the Appraisal Institute.",
            isEditable: false,
            inputType: "auto-filled",
          },
        ],
      },
      {
        id: "signature-block",
        title: "SIGNATURE",
        fields: [
          {
            id: "cert-signature",
            label: "Signature Image",
            type: "image",
            value: [],
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "cert-sign-name",
            label: "Appraiser Name",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "cert-sign-credentials",
            label: "Credentials",
            type: "text",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "cert-sign-date",
            label: "Signature Date",
            type: "date",
            value: "",
            isEditable: true,
            inputType: "auto-filled",
          },
        ],
      },
    ],
  },
  // END PHASE 5 - ALL SECTIONS COMPLETE
];

const sectionGroups: SectionGroup[] = [
  {
    id: "v3-operations",
    name: "V3 Dashboard",
    sections: ["client-intake", "loe-prep"],
  },
  {
    id: "intro",
    name: "Introduction",
    sections: ["cover", "home", "maps", "assignment", "report"],
  },
  {
    id: "analysis",
    name: "Analysis",
    sections: ["exec", "photos", "site", "location", "tax", "market"],
  },
  {
    id: "improvements",
    name: "Improvements",
    sections: ["impv", "zone", "hbu"],
  },
  { id: "calculator", name: "Calculator", sections: ["calc"] },
  {
    id: "valuation",
    name: "Valuation",
    sections: ["land1", "cost-s", "sales", "rental-survey", "income"],
  },
  { id: "conclusion", name: "Conclusion", sections: ["recon", "cert"] },
];

export const useReportBuilderStore = create<ReportBuilderState>((set, get) => ({
  sections: [],
  sectionGroups: [],
  activeSection: "cover",
  previewHtml: "",
  previewTemplate: "", // Cached PREVIEW-Master.html template
  isDirty: false,
  sidebarCollapsed: false,

  setActiveSection: (sectionId: string) => {
    set({ activeSection: sectionId });
  },

  updateFieldValue: (fieldId: string, value: string | string[] | number) => {
    const sections = get().sections;
    const updatedSections = sections.map((section) => {
      const updatedFields = section.fields.map((field) =>
        field.id === fieldId ? { ...field, value } : field,
      );
      const updatedSubsections = section.subsections?.map((subsection) => ({
        ...subsection,
        fields: subsection.fields.map((field) =>
          field.id === fieldId ? { ...field, value } : field,
        ),
      }));
      return {
        ...section,
        fields: updatedFields,
        subsections: updatedSubsections,
      };
    });
    set({ sections: updatedSections, isDirty: true });
    // Regenerate preview HTML after field update for live sync
    get().generatePreview();
  },

  reorderImages: (fieldId: string, imageUrls: string[]) => {
    get().updateFieldValue(fieldId, imageUrls);
  },

  addImage: (fieldId: string, imageUrl: string) => {
    const sections = get().sections;
    const field = sections
      .flatMap((s) => [
        ...s.fields,
        ...(s.subsections?.flatMap((ss) => ss.fields) || []),
      ])
      .find((f) => f.id === fieldId);
    if (field && Array.isArray(field.value)) {
      get().updateFieldValue(fieldId, [...field.value, imageUrl]);
    }
  },

  removeImage: (fieldId: string, imageUrl: string) => {
    const sections = get().sections;
    const field = sections
      .flatMap((s) => [
        ...s.fields,
        ...(s.subsections?.flatMap((ss) => ss.fields) || []),
      ])
      .find((f) => f.id === fieldId);
    if (field && Array.isArray(field.value)) {
      get().updateFieldValue(
        fieldId,
        field.value.filter((url) => url !== imageUrl),
      );
    }
  },

  generatePreview: async () => {
    const sections = get().sections;
    // Ensure template is loaded
    const template = await get().loadPreviewTemplate();
    const html = get().interpolateTemplate(sections, template);
    set({ previewHtml: html });
  },

  initializeMockData: async () => {
    const sections = getMockData();
    // Load template first
    const template = await get().loadPreviewTemplate();
    const html = get().interpolateTemplate(sections, template);
    set({ sections, sectionGroups, previewHtml: html });
  },

  toggleSidebar: () => {
    set({ sidebarCollapsed: !get().sidebarCollapsed });
  },

  // Load PREVIEW-Master.html template (fetch once, cache)
  loadPreviewTemplate: async () => {
    const currentTemplate = get().previewTemplate;
    if (currentTemplate) {
      return currentTemplate; // Already loaded
    }

    try {
      const response = await fetch('/Report-MF-template.html');
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
      }
      const html = await response.text();
      set({ previewTemplate: html });
      return html;
    } catch (error) {
      console.error('Error loading Report-MF-template.html:', error);
      throw error;
    }
  },

  // Interpolate field values into template (synchronous - template must be preloaded)
  interpolateTemplate: (sections: ReportSection[], template: string) => {
    let html = template;

    // Build field value map from all sections
    const fieldMap = new Map<string, string>();

    sections.forEach(section => {
      // Handle section fields
      section.fields?.forEach(field => {
        const value = get().formatFieldValue(field);
        fieldMap.set(field.id, value);
      });

      // Handle subsection fields
      section.subsections?.forEach(subsection => {
        subsection.fields?.forEach(field => {
          const value = get().formatFieldValue(field);
          fieldMap.set(field.id, value);
        });
      });
    });

    // Replace all {{field-id}} placeholders with actual values
    fieldMap.forEach((value, fieldId) => {
      const placeholder = `{{${fieldId}}}`;
      html = html.replaceAll(placeholder, value);
    });

    // Leave unreplaced placeholders as-is (for toggle display in test mode)
    return html;
  },

  // Format field value based on type
  formatFieldValue: (field: ReportField) => {
    if (!field.value && field.value !== 0) return '';

    switch (field.type) {
      case 'currency':
        return `$${Number(field.value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      case 'percentage':
        return `${field.value}%`;
      case 'date':
        return new Date(field.value).toISOString().split('T')[0];
      case 'image':
        // For images, return the URL or empty
        return Array.isArray(field.value) ? field.value[0] || '' : String(field.value);
      default:
        return String(field.value);
    }
  },

  loadCalcTestData: () => {
    const updateField = (
      fieldId: string,
      value: string | number | string[],
    ) => {
      get().updateFieldValue(fieldId, value);
    };

    // North Battleford Test Data - Valcre Accurate
    // Source: ValuationWorkbench.tsx loadValcreTestData()
    // Expected Output: $1,780,000

    // Unit Mix (16 units total, avg $1,020/mo = $195,840 rental)
    updateField("calc-type1-name", "1BR/1BA");
    updateField("calc-type1-count", 4);
    updateField("calc-type1-sf", 550);
    updateField("calc-type1-rent", 900);

    updateField("calc-type2-name", "2BR/1BA");
    updateField("calc-type2-count", 12);
    updateField("calc-type2-sf", 667);
    updateField("calc-type2-rent", 1060);

    updateField("calc-type3-count", 0);
    updateField("calc-type4-count", 0);

    // Other Income (Valcre: $375/unit/yr parking, $150/unit/yr laundry)
    // Field values are monthly per unit, multiplied by units × 12 in calc
    updateField("calc-parking-per-unit", 31.25); // $375/yr / 12 = $31.25/mo
    updateField("calc-laundry-per-unit", 12.5); // $150/yr / 12 = $12.50/mo
    updateField("calc-other-income", 0);

    // Vacancy
    updateField("calc-vacancy-rate", 4);
    updateField("calc-bad-debt-rate", 0);
    updateField("calc-concessions-rate", 0);

    // Operating Expenses (Valcre-accurate per_unit annual values)
    updateField("calc-exp-management", 4.25); // percent_egr (4.25%)
    updateField("calc-exp-taxes", 1168); // per_unit ($1,168/unit/yr)
    updateField("calc-exp-insurance", 710); // per_unit ($710/unit/yr)
    updateField("calc-exp-repairs", 830); // per_unit ($830/unit/yr)
    updateField("calc-exp-utilities", 1315); // per_unit ($1,315/unit/yr)
    updateField("calc-exp-payroll", 500); // per_unit ($500/unit/yr)
    updateField("calc-exp-admin", 0); // per_unit (not in Valcre test)
    updateField("calc-exp-reserves", 0); // per_unit (not in Valcre test)
    updateField("calc-exp-other", 245); // per_unit ($245/unit/yr)

    // Cap Rate
    updateField("calc-cap-rate", 6.25);

    // Post-Value Adjustments
    updateField("calc-adj-capex", 0);
    updateField("calc-adj-leasing", 0);
    updateField("calc-adj-other", 0);

    // Trigger calculations
    get().runCalculations();
  },

  runCalculations: () => {
    const sections = get().sections;

    // Helper to get field value
    const getFieldValue = (fieldId: string): number => {
      for (const section of sections) {
        const field = section.fields.find((f) => f.id === fieldId);
        if (field) return Number(field.value) || 0;

        if (section.subsections) {
          for (const sub of section.subsections) {
            const subField = sub.fields.find((f) => f.id === fieldId);
            if (subField) return Number(subField.value) || 0;
          }
        }
      }
      return 0;
    };

    // Helper to get expense calc base
    const getExpenseBase = (fieldId: string): string => {
      for (const section of sections) {
        if (section.subsections) {
          for (const sub of section.subsections) {
            const field = sub.fields.find((f) => f.id === fieldId);
            if (field && field.expenseCalcBase) return field.expenseCalcBase;
          }
        }
      }
      return "per_unit";
    };

    // Unit Mix Calculations
    const type1Count = getFieldValue("calc-type1-count");
    const type1Sf = getFieldValue("calc-type1-sf");
    const type1Rent = getFieldValue("calc-type1-rent");
    const type1Annual = type1Count * type1Rent * 12;

    const type2Count = getFieldValue("calc-type2-count");
    const type2Sf = getFieldValue("calc-type2-sf");
    const type2Rent = getFieldValue("calc-type2-rent");
    const type2Annual = type2Count * type2Rent * 12;

    const type3Count = getFieldValue("calc-type3-count");
    const type3Sf = getFieldValue("calc-type3-sf");
    const type3Rent = getFieldValue("calc-type3-rent");
    const type3Annual = type3Count * type3Rent * 12;

    const type4Count = getFieldValue("calc-type4-count");
    const type4Sf = getFieldValue("calc-type4-sf");
    const type4Rent = getFieldValue("calc-type4-rent");
    const type4Annual = type4Count * type4Rent * 12;

    const totalUnits = type1Count + type2Count + type3Count + type4Count;
    const totalSf =
      type1Count * type1Sf +
      type2Count * type2Sf +
      type3Count * type3Sf +
      type4Count * type4Sf;
    const avgUnitSf = totalUnits > 0 ? totalSf / totalUnits : 0;
    const totalRentalRevenue =
      type1Annual + type2Annual + type3Annual + type4Annual;
    const avgRentPerUnit =
      totalUnits > 0 ? totalRentalRevenue / totalUnits / 12 : 0;
    const avgRentPerSf = totalSf > 0 ? totalRentalRevenue / totalSf / 12 : 0;

    // Other Income
    const parkingPerUnit = getFieldValue("calc-parking-per-unit");
    const laundryPerUnit = getFieldValue("calc-laundry-per-unit");
    const otherIncome = getFieldValue("calc-other-income");
    const parkingTotal = parkingPerUnit * totalUnits * 12;
    const laundryTotal = laundryPerUnit * totalUnits * 12;
    const totalOtherIncome = parkingTotal + laundryTotal + otherIncome;
    const pgr = totalRentalRevenue + totalOtherIncome;

    // Vacancy & Loss
    const vacancyRate = getFieldValue("calc-vacancy-rate");
    const badDebtRate = getFieldValue("calc-bad-debt-rate");
    const concessionsRate = getFieldValue("calc-concessions-rate");
    const totalVacancyRate = vacancyRate + badDebtRate + concessionsRate;
    const vacancyLoss = pgr * (totalVacancyRate / 100);
    const egr = pgr - vacancyLoss;

    // Operating Expenses
    const calculateExpense = (fieldId: string): number => {
      const value = getFieldValue(fieldId);
      const base = getExpenseBase(fieldId);
      switch (base) {
        case "percent_pgr":
          return pgr * (value / 100);
        case "percent_egr":
          return egr * (value / 100);
        case "fixed":
          return value;
        case "per_unit":
          return value * totalUnits;
        case "per_sf":
          return value * totalSf;
        default:
          return value * totalUnits;
      }
    };

    const expManagement = calculateExpense("calc-exp-management");
    const expTaxes = calculateExpense("calc-exp-taxes");
    const expInsurance = calculateExpense("calc-exp-insurance");
    const expRepairs = calculateExpense("calc-exp-repairs");
    const expUtilities = calculateExpense("calc-exp-utilities");
    const expPayroll = calculateExpense("calc-exp-payroll");
    const expAdmin = calculateExpense("calc-exp-admin");
    const expReserves = calculateExpense("calc-exp-reserves");
    const expOther = calculateExpense("calc-exp-other");
    const expensesTotal =
      expManagement +
      expTaxes +
      expInsurance +
      expRepairs +
      expUtilities +
      expPayroll +
      expAdmin +
      expReserves +
      expOther;
    const expenseRatio = egr > 0 ? (expensesTotal / egr) * 100 : 0;

    // NOI & Valuation
    const noi = egr - expensesTotal;
    const noiPerUnit = totalUnits > 0 ? noi / totalUnits : 0;
    const noiPerSf = totalSf > 0 ? noi / totalSf : 0;

    const capRate = getFieldValue("calc-cap-rate");
    const rawValue = capRate > 0 ? noi / (capRate / 100) : 0;
    const roundedValue = Math.round(rawValue / 10000) * 10000;

    // Adjustments
    const adjCapex = getFieldValue("calc-adj-capex");
    const adjLeasing = getFieldValue("calc-adj-leasing");
    const adjOther = getFieldValue("calc-adj-other");
    const adjTotal = adjCapex + adjLeasing + adjOther;
    const indicatedValue = roundedValue - adjTotal;

    const valuePerUnit = totalUnits > 0 ? indicatedValue / totalUnits : 0;
    const valuePerSf = totalSf > 0 ? indicatedValue / totalSf : 0;
    const grm =
      totalRentalRevenue > 0 ? indicatedValue / totalRentalRevenue : 0;

    // Update all calculated fields
    const updateField = (fieldId: string, value: number) => {
      get().updateFieldValue(fieldId, value);
    };

    // Unit Mix calculated
    updateField("calc-type1-annual", type1Annual);
    updateField("calc-type2-annual", type2Annual);
    updateField("calc-type3-annual", type3Annual);
    updateField("calc-type4-annual", type4Annual);
    updateField("calc-total-units", totalUnits);
    updateField("calc-total-sf", totalSf);
    updateField("calc-avg-unit-sf", Math.round(avgUnitSf));
    updateField("calc-total-rental-revenue", totalRentalRevenue);
    updateField("calc-avg-rent-per-unit", Math.round(avgRentPerUnit));
    updateField("calc-avg-rent-per-sf", Math.round(avgRentPerSf * 100) / 100);

    // Other Income calculated
    updateField("calc-parking-total", parkingTotal);
    updateField("calc-laundry-total", laundryTotal);
    updateField("calc-total-other-income", totalOtherIncome);
    updateField("calc-pgr", pgr);

    // Vacancy calculated
    updateField("calc-vacancy-loss", vacancyLoss);
    updateField("calc-egr", egr);

    // Expenses calculated
    updateField("calc-expenses-total", Math.round(expensesTotal));
    updateField("calc-expense-ratio", Math.round(expenseRatio * 100) / 100);
    updateField("calc-expenses-per-unit", totalUnits > 0 ? Math.round((expensesTotal / totalUnits) * 100) / 100 : 0);
    updateField("calc-expenses-per-sf", totalSf > 0 ? Math.round((expensesTotal / totalSf) * 100) / 100 : 0);


    // Expense Breakdown - Calculate and output all 5 metrics per category (35 fields total for Page 49)
    const expenseCategories = [
      { name: "taxes", value: expTaxes },
      { name: "insurance", value: expInsurance },
      { name: "repairs", value: expRepairs },
      { name: "payroll", value: expPayroll },
      { name: "utilities", value: expUtilities },
      { name: "management", value: expManagement },
      { name: "other", value: expOther },
    ];

    expenseCategories.forEach(({ name, value }) => {
      const annual = Math.round(value);
      const perUnit = totalUnits > 0 ? value / totalUnits : 0;
      const perSf = totalSf > 0 ? value / totalSf : 0;
      const pctPgr = pgr > 0 ? (value / pgr) * 100 : 0;
      const pctEgr = egr > 0 ? (value / egr) * 100 : 0;

      updateField(`calc-exp-${name}-annual`, annual);
      updateField(`calc-exp-${name}-per-unit`, Math.round(perUnit * 100) / 100);
      updateField(`calc-exp-${name}-per-sf`, Math.round(perSf * 100) / 100);
      updateField(`calc-exp-${name}-pct-pgr`, Math.round(pctPgr * 100) / 100);
      updateField(`calc-exp-${name}-pct-egr`, Math.round(pctEgr * 100) / 100);
    });

    // Adjustments calculated
    updateField("calc-adj-total", adjTotal);

    // Results
    updateField("calc-noi", Math.round(noi));
    updateField("calc-noi-per-unit", Math.round(noiPerUnit));
    updateField("calc-noi-per-sf", Math.round(noiPerSf * 100) / 100);
    updateField("calc-raw-value", Math.round(rawValue));
    updateField("calc-indicated-value", indicatedValue);
    updateField("calc-value-per-unit", Math.round(valuePerUnit));
    updateField("calc-value-per-sf", Math.round(valuePerSf * 100) / 100);
    updateField("calc-grm", Math.round(grm * 100) / 100);

    // Sync to RECON
    updateField("recon-income-value", indicatedValue);

    console.log("Calculations complete. Indicated Value:", indicatedValue);
  },

  loadFullTestData: async () => {
    console.log("=== LOAD FULL TEST DATA CALLED ===");
    console.log("northBattlefordTestData keys:", Object.keys(northBattlefordTestData).length);
    // Load comprehensive North Battleford test data with image fields
    // Uses northBattlefordTestData which has field IDs matching store exactly
    const sections = get().sections;
    let mappedCount = 0;
    let unmappedFields: string[] = [];

    // Helper to check if field exists in store
    const fieldExists = (fieldId: string): boolean => {
      for (const section of sections) {
        if (section.fields.find((f) => f.id === fieldId)) return true;
        if (section.subsections) {
          for (const sub of section.subsections) {
            if (sub.fields.find((f) => f.id === fieldId)) return true;
          }
        }
      }
      return false;
    };

    // Load all fields from test data (field IDs match store exactly)
    Object.entries(northBattlefordTestData).forEach(([fieldId, value]) => {
      // Map test data field ID to store field ID (for any that still differ)
      const storeFieldId = testDataFieldMapping[fieldId] || fieldId;

      if (fieldExists(storeFieldId)) {
        get().updateFieldValue(storeFieldId, value);
        mappedCount++;
      } else {
        unmappedFields.push(fieldId);
      }
    });

    // Run calculations after loading CALC data
    get().runCalculations();

    // Regenerate preview with all data
    const updatedSections = get().sections;
    const template = await get().loadPreviewTemplate();
    const html = get().interpolateTemplate(updatedSections, template);
    set({ previewHtml: html });

    console.log(
      `Test data loaded: ${mappedCount}/${Object.keys(northBattlefordTestData).length} fields mapped`,
    );
    if (unmappedFields.length > 0) {
      console.log("Unmapped fields (need store definition):", unmappedFields);
    }
  },
}));
