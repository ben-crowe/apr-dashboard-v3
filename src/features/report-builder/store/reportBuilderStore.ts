import { create } from "zustand";
import {
  ReportBuilderState,
  ReportSection,
  SectionGroup,
} from "../types/reportBuilder.types";
import { generateReportHtml } from "../templates/reportHtmlTemplate";
import { northBattlefordTestData } from "../data/northBattlefordTestData";

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

const getMockData = (): ReportSection[] => [
  {
    id: "cover",
    name: "Cover Page",
    shortName: "COVER",
    fields: [
      {
        id: "cover-photo",
        label: "Cover Photo",
        type: "image",
        value: [],
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "property-type-display",
        label: "Property Type",
        type: "text",
        value: "Multi-Family Walkup",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "property-name",
        label: "Property Name",
        type: "text",
        value: "North Battleford Apartments",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "street-address",
        label: "Street Address",
        type: "text",
        value: "1101, 1121 109 St",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "city",
        label: "City",
        type: "text",
        value: "North Battleford",
        isEditable: true,
        inputType: "auto-filled",
      },
      {
        id: "province",
        label: "Province",
        type: "text",
        value: "Saskatchewan",
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
            value: "Valta Property Valuations Ltd.",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-address",
            label: "Company Address",
            type: "text",
            value: "300, 4838 Richard Road SW",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-city",
            label: "Company City",
            type: "text",
            value: "Calgary, AB T3E 6L1",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-phone",
            label: "Company Phone",
            type: "text",
            value: "587-801-5151",
            isEditable: true,
            inputType: "auto-filled",
          },
          {
            id: "appraiser-website",
            label: "Company Website",
            type: "text",
            value: "www.valta.ca",
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
    name: "Letter of Transmittal",
    shortName: "HOME",
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
    id: "custom",
    name: "Custom Fields",
    shortName: "CUSTOM",
    fields: [
      {
        id: "custom-field-1",
        label: "Custom Field 1",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "custom-field-2",
        label: "Custom Field 2",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "custom-field-3",
        label: "Custom Field 3",
        type: "text",
        value: "",
        isEditable: true,
        inputType: "user-input",
      },
    ],
  },
  {
    id: "maps",
    name: "Location Maps",
    shortName: "MAPS",
    fields: [
      {
        id: "map-regional",
        label: "Regional Map",
        type: "image",
        value: [],
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "map-local",
        label: "Local Area Map",
        type: "image",
        value: [],
        isEditable: true,
        inputType: "user-input",
      },
      {
        id: "map-aerial",
        label: "Aerial/Site Map",
        type: "image",
        value: [],
        isEditable: true,
        inputType: "user-input",
      },
    ],
  },
  {
    id: "report",
    name: "Report Information",
    shortName: "REPORT",
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
    shortName: "EXEC",
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
            value: "As Stabilized",
            isEditable: true,
            inputType: "dropdown",
            options: ["As Is", "As Stabilized", "As Complete", "As Proposed"],
          },
          {
            id: "property-rights",
            label: "Property Rights",
            type: "text",
            value: "Fee Simple Estate",
            isEditable: true,
            inputType: "dropdown",
            options: ["Fee Simple Estate", "Leased Fee", "Leasehold"],
          },
          {
            id: "building-style",
            label: "Building Style",
            type: "text",
            value: "walkup",
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
    shortName: "PHOTOS",
    fields: [],
    subsections: [
      {
        id: "exterior-photos",
        title: "EXTERIOR PHOTOGRAPHS",
        fields: [
          {
            id: "photos-exterior",
            label: "Exterior Photos",
            type: "image",
            value: [],
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
            id: "photos-street",
            label: "Street View Photos",
            type: "image",
            value: [],
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
            id: "photos-common",
            label: "Common Area Photos",
            type: "image",
            value: [],
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
            id: "photos-units",
            label: "Unit Interior Photos",
            type: "image",
            value: [],
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
            id: "photos-systems",
            label: "Building Systems Photos",
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
    id: "site",
    name: "Site Details",
    shortName: "SITE",
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
            value: "Rectangular",
            isEditable: true,
            inputType: "user-input",
          },
          {
            id: "topography",
            label: "Topography",
            type: "text",
            value: "Level",
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
    shortName: "LOCATION",
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
    shortName: "TAX",
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
    shortName: "MARKET",
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
    shortName: "IMPV",
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
    shortName: "ZONE",
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
    shortName: "HBU",
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
    shortName: "CALC",
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
    shortName: "LAND1",
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
    shortName: "COST-S",
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
    shortName: "SALES",
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
            value: "Average",
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
    shortName: "INCOME",
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
    id: "recon",
    name: "Reconciliation",
    shortName: "RECON",
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
            value: "As Stabilized",
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
    shortName: "CERT",
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
    id: "intro",
    name: "Introduction",
    sections: ["cover", "home", "custom", "maps", "report"],
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
    sections: ["land1", "cost-s", "sales", "income"],
  },
  { id: "conclusion", name: "Conclusion", sections: ["recon", "cert"] },
];

export const useReportBuilderStore = create<ReportBuilderState>((set, get) => ({
  sections: [],
  sectionGroups: [],
  activeSection: "cover",
  previewHtml: "",
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

  generatePreview: () => {
    const sections = get().sections;
    const html = generateReportHtml(sections);
    set({ previewHtml: html });
  },

  initializeMockData: () => {
    const sections = getMockData();
    const html = generateReportHtml(sections);
    set({ sections, sectionGroups, previewHtml: html });
  },

  toggleSidebar: () => {
    set({ sidebarCollapsed: !get().sidebarCollapsed });
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

  loadFullTestData: () => {
    // Load comprehensive North Battleford test data (240+ fields)
    const sections = get().sections;
    let mappedCount = 0;
    let unmappedFields: string[] = [];

    // Photo consolidation: map individual photos to consolidated arrays
    const photoConsolidation: Record<string, string[]> = {
      "photos-exterior": [],
      "photos-street": [],
      "photos-common": [],
      "photos-units": [],
      "photos-systems": [],
    };

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

    // First pass: handle regular fields and collect photos
    Object.entries(northBattlefordTestData).forEach(([testFieldId, value]) => {
      // Handle individual photo fields -> consolidate to arrays
      if (
        testFieldId.startsWith("photo-exterior-") &&
        !testFieldId.includes("caption")
      ) {
        if (Array.isArray(value) && value.length > 0) {
          photoConsolidation["photos-exterior"].push(...value);
        }
        mappedCount++;
        return;
      }
      if (
        testFieldId.startsWith("photo-street-") &&
        !testFieldId.includes("caption")
      ) {
        if (Array.isArray(value) && value.length > 0) {
          photoConsolidation["photos-street"].push(...value);
        }
        mappedCount++;
        return;
      }
      if (
        (testFieldId.startsWith("photo-hallway") ||
          testFieldId.startsWith("photo-stairway") ||
          testFieldId.startsWith("photo-lobby")) &&
        !testFieldId.includes("caption")
      ) {
        if (Array.isArray(value) && value.length > 0) {
          photoConsolidation["photos-common"].push(...value);
        }
        mappedCount++;
        return;
      }
      if (
        (testFieldId.startsWith("photo-kitchen") ||
          testFieldId.startsWith("photo-bathroom") ||
          testFieldId.startsWith("photo-bedroom") ||
          testFieldId.startsWith("photo-livingroom")) &&
        !testFieldId.includes("caption")
      ) {
        if (Array.isArray(value) && value.length > 0) {
          photoConsolidation["photos-units"].push(...value);
        }
        mappedCount++;
        return;
      }
      if (
        (testFieldId.startsWith("photo-electrical") ||
          testFieldId.startsWith("photo-mechanical") ||
          testFieldId.startsWith("photo-laundry")) &&
        !testFieldId.includes("caption")
      ) {
        if (Array.isArray(value) && value.length > 0) {
          photoConsolidation["photos-systems"].push(...value);
        }
        mappedCount++;
        return;
      }
      // Skip photo captions for now (would need caption handling in template)
      if (testFieldId.includes("-caption")) {
        mappedCount++;
        return;
      }

      // Map test data field ID to store field ID (some differ)
      const storeFieldId = testDataFieldMapping[testFieldId] || testFieldId;

      if (fieldExists(storeFieldId)) {
        get().updateFieldValue(storeFieldId, value);
        mappedCount++;
      } else {
        unmappedFields.push(`${testFieldId} -> ${storeFieldId}`);
      }
    });

    // Apply consolidated photos
    Object.entries(photoConsolidation).forEach(([fieldId, photos]) => {
      if (photos.length > 0) {
        get().updateFieldValue(fieldId, photos);
      }
    });

    // Run calculations after loading CALC data
    get().runCalculations();

    // Regenerate preview with all data
    const updatedSections = get().sections;
    const html = generateReportHtml(updatedSections);
    set({ previewHtml: html });

    console.log(
      `Test data loaded: ${mappedCount}/${Object.keys(northBattlefordTestData).length} fields mapped`,
    );
    if (unmappedFields.length > 0) {
      console.log("Unmapped fields (need store definition):", unmappedFields);
    }
  },
}));
