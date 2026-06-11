import type { VercelRequest, VercelResponse } from "@vercel/node";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// LOE Field Conversion Maps - Dashboard values → Valcre API values

// PURPOSES MAP - Property Rights Appraised conversion
// Maps Dashboard "Property Rights" field → Valcre "Purpose" field (Nov 13, 2025)
// Enum values confirmed from Valcre OData $metadata (JobPurposes) 2026-06-11:
//   None, FeeSimple, LeasedFee, Leasehold, Other, MarketStudy, PartialInterest,
//   Asc805, CostSegregation, RentRestricted, GoingConcern, LeaseholdFranchise,
//   PartialInterestTaking, TotalTaking, CondominiumOwnership, All
const PURPOSES_MAP: Record<string, string> = {
  "Fee Simple Interest": "FeeSimple",
  "Leased Fee Interest": "LeasedFee",
  "Leasehold Interest": "Leasehold",
  // "Undivided Interest" → no matching JobPurposes member; UNRESOLVED — omit to avoid 400
  "Partial Interest": "PartialInterest",
  "Partial Interest Taking": "PartialInterestTaking",
  "Total Taking": "TotalTaking",
  "Rent Restricted": "RentRestricted",
  "Market Study": "MarketStudy",
  Other: "Other",
  "Going Concern": "GoingConcern",
  "Condominium Ownership": "CondominiumOwnership",
  "Cost Segregation Study": "CostSegregation",  // was "CostSegregationStudy" — $metadata member is "CostSegregation"
  "ASC 805": "Asc805",                          // was "ASC805" — $metadata member is "Asc805"
  None: "None",
};

// REQUESTED VALUES (Valuation Premises) - Complete Valcre values (Nov 13, 2025 - Updated)
// Enum values confirmed from Valcre OData $metadata (JobRequestedValues) 2026-06-11:
//   None, AsIs, AsStabilized, AsComplete, AsVacant, Lots, LotsToHouses,
//   BulkValue, Retrospective, RentRestricted, RentSurvey, TaxCredits,
//   InsurableValue, Disposition, GoDark, Hypothetical, InUse, Liquidation,
//   Other, RelatedSiteValue, All
const REQUESTED_VALUES_MAP: Record<string, string> = {
  // Dashboard values:
  "Market Value": "AsIs",
  "As-Is": "AsIs",
  // "Market Rent" → no matching member ("MarketRentStudy" doesn't exist); UNRESOLVED — nearest is RentSurvey; flagged
  "Liquidation Value": "Liquidation",
  "Investment Value": "AsStabilized",    // was "ProspectiveAtStabilization" (not in enum); nearest schema member = "AsStabilized"
  "Insurable Value": "InsurableValue",   // was "InsurableReplacementCost" (not in enum); correct member = "InsurableValue"

  // Complete Valcre dropdown (reconciled with $metadata 2026-06-11):
  "Prospective at Completion": "AsComplete",     // was "ProspectiveAtCompletion" (not in enum); nearest = "AsComplete"
  "Prospective at Stabilization": "AsStabilized", // was "ProspectiveAtStabilization" (not in enum); nearest = "AsStabilized"
  "As-Vacant": "AsVacant",
  "Insurable Replacement Cost": "InsurableValue", // was "InsurableReplacementCost" (not in enum); correct member = "InsurableValue"
  "Bulk Value": "BulkValue",
  Disposition: "Disposition",
  "Go Dark": "GoDark",
  Hypothetical: "Hypothetical",
  "In Use": "InUse",
  Lots: "Lots",
  "Lots to Houses": "LotsToHouses",
  // "Market Rent Study" → "MarketRentStudy" not in enum; UNRESOLVED — nearest is RentSurvey; flagged
  Other: "Other",
  "Rent Restricted": "RentRestricted",
  Retrospective: "Retrospective",
  "Tax Credits": "TaxCredits",
};

// REPORT FORMAT - Complete Valcre values (Oct 5, 2025)
// Enum values confirmed from Valcre OData $metadata (JobReportFormat) 2026-06-11:
//   Appraisal, RestrictedAppraisal, DeskReview, AmendmentLetter, Consultation,
//   RentStudy, Evaluation, BrokerOpinionOfValue, Redirection, Completion, PeerReview
const REPORT_FORMAT_MAP: Record<string, string> = {
  // Dashboard values (verified):
  Comprehensive: "Appraisal",
  Summary: "Appraisal",
  Restricted: "RestrictedAppraisal",
  Form: "Form",  // NOTE: code deliberately skips "Form" — not a valid Valcre enum member

  // Complete Valcre dropdown (reconciled with $metadata 2026-06-11):
  "Appraisal Report": "Appraisal",
  "Amendment Letter": "AmendmentLetter",
  "Broker Opinion of Value": "BrokerOpinionOfValue",
  "Completion Report": "Completion",    // was "CompletionReport" — $metadata member is "Completion"
  Consultation: "Consultation",
  "Desk Review": "DeskReview",
  Evaluation: "Evaluation",
  "Peer Review": "PeerReview",
  "Rent Study": "RentStudy",
  "Restricted Appraisal Report": "RestrictedAppraisal",
};

// ANALYSIS LEVEL → Job.AnalysisLevel (native enum JobAnalysisLevel). Re-optioned 2026-06-04 (Option-b):
// dashboard now offers the REAL enum members verbatim (from live $metadata), so this map is 1:1 identity.
// Live metadata members: Detailed, Summary, Brief, RentalAssessmentLetter, RentalSubmission,
// RentalDetermination, ValuationAssessmentLetter, DetailedResidential, PropertyPro, RestrictedAccessReport,
// ProgressReport. (Old Concise/Form were NOT members — the API 400'd "Requested value 'Concise' was not found".)
const ANALYSIS_LEVEL_MAP: Record<string, string> = {
  Detailed: "Detailed",
  Summary: "Summary",
  Brief: "Brief",
  RentalAssessmentLetter: "RentalAssessmentLetter",
  RentalSubmission: "RentalSubmission",
  RentalDetermination: "RentalDetermination",
  ValuationAssessmentLetter: "ValuationAssessmentLetter",
  DetailedResidential: "DetailedResidential",
  PropertyPro: "PropertyPro",
  RestrictedAccessReport: "RestrictedAccessReport",
  ProgressReport: "ProgressReport",
  // Legacy dashboard value (pre-re-option) — keep so existing jobs that stored "Comprehensive" still sync.
  Comprehensive: "Detailed",
};

// SCOPE OF WORK MAP - Dashboard "Scope of Work" → Valcre "Scope" field (Nov 13, 2025)
// Enum values confirmed from Valcre OData $metadata (JobScopes enum) 2026-06-11:
//   None, AllApplicable, BestApproach, BestApproaches, DepreciatedReplacementCost, CostApproach,
//   DiscountedCashFlow, FeasibilityStudy, IncomeApproach, LandValue, Litigation,
//   MarketResearch, MarketStudy, RentSurvey, SalesComparisonApproach, Update, All
// UNRESOLVED: "Net Rent Review" → "NetRentReview" is NOT in JobScopes. Nearest candidate = "RentSurvey".
//   Left as "NetRentReview" pending Chris/Ben confirmation. Will trigger a Valcre 400 if this key is sent.
const SCOPE_OF_WORK_MAP: Record<string, string> = {
  "All Applicable": "AllApplicable",
  "Best One Approach": "BestApproach",       // was "BestOneApproach" — not in JobScopes enum; confirmed as "BestApproach"
  "Best Two Approaches": "BestApproaches",   // was "BestTwoApproaches" — corrected to "BestApproaches" per enum
  "Cost Approach": "CostApproach",
  "Direct Comparison Approach": "SalesComparisonApproach", // was "DirectComparisonApproach" — confirmed via job VAL261044 raw Scopes + JobScopes enum
  "Discounted Cash Flow": "DiscountedCashFlow",
  "Feasibility Study": "FeasibilityStudy",
  "Income Approach": "IncomeApproach",
  "Land Value": "LandValue",
  Litigation: "Litigation",
  "Market Research": "MarketResearch",
  "Market Study": "MarketStudy",
  "Net Rent Review": "NetRentReview", // FLAG: "NetRentReview" not found in JobScopes enum; nearest candidate is "RentSurvey" — left unchanged pending Chris/Ben confirmation
  Update: "Update",
};

// INTENDED USES MAP - Dashboard "Intended Use" → Valcre "Authorized Use" field (Nov 13, 2025)
// NOTE: Valcre has both "Scope" and "Authorized Use" fields - they are DIFFERENT
// Dashboard "Intended Use" maps to "Authorized Use" (IntendedUses), NOT "Scope"
const INTENDED_USES_MAP: Record<string, string> = {
  // Current dashboard values (matching Chris's Master Field Registry):
  "First Mortgage Financing": "Financing",
  "Financial Reporting": "FinancialReporting",
  Insurance: "Financing",
  "Internal Decision-Making": "DecisionMakingInternal",
  "Acquisition-Disposition": "AcquisitionDisposition",
  "Estate Planning": "EstatePlanning",
  Litigation: "Litigation",
  GST: "Other", // No dedicated Valcre enum — maps to Other

  // Legacy dashboard values (backwards compatibility for existing jobs):
  "Financing/Refinancing": "Financing",
  Financing: "Financing",
  Acquisition: "AcquisitionDisposition",
  Disposition: "AcquisitionDisposition",
  "Tax Appeal": "PropertyTaxAppeal",
  "Internal Valuation": "DecisionMakingInternal",

  // Additional Valcre dropdown options (for completeness):
  "Acquisition/Disposition": "AcquisitionDisposition",
  Consulting: "Consulting",
  "Decision-Making/Internal": "DecisionMakingInternal",
  "Dispute Resolution": "DisputeResolution",
  // "Divorce" → not in JobIntendedUses enum; UNRESOLVED — nearest is "Matrimonial"; flagged pending confirmation
  "Establish Sales Price": "EstablishSalesPrice",
  Other: "Other",
  "Property Tax Appeal": "PropertyTaxAppeal",
  Review: "Review",
};

// VALTA Custom Field IDs — created 2026-03-30 via POST /api/v1/CustomFields
// These are Job-level custom fields visible in Valcre's custom fields section
// v3.1 custom fields (CF12407-12427) — IDs + AvailableValue option IDs read LIVE from
// Valcre /CustomFields defs 2026-06-05. Field name = app camelCase key the sync reads from jobData.
const VALTA_CUSTOM_FIELD_IDS: Record<string, number> = {
  statusOfImprovements: 12407,
  tenancy: 12408,
  stateOfImprovements: 12409,
  currentUseImprovements: 12410,
  proposedUseImprovements: 12411,
  interestAppraised: 12412,
  authorizedUse: 12413,
  intendedUse: 12413, // D1: deduped Authorized Use intake field → same custom field (app sends `intendedUse`)
  valueScenarios: 12414,
  approachesToValue: 12415,
  assignmentType: 12416,
  reportType: 12417,
  desktopReport: 12418,
  valueTimeframe: 12419,
  deliveryTime: 12420,
  paid: 12421,
  clientDocuments: 12422,
  previouslyAppraised: 12423,
  transactionStatus: 12424,
  zoningStatus: 12425,
  landMetric: 12426,
  cmhcFinancing: 12427,
};

const VALTA_FIELD_CONFIG: Record<string, { type: string; options?: Record<string, number> }> = {
  statusOfImprovements: { type: "SingleOption", options: { "Improved - Completed": 7432, "Improved - Renovated": 7433, "Improved - Under Renovation": 7434, "Improved - Proposed Renovation": 7435, "Proposed - Vacant Land": 7436, "Proposed - Improved Land (Demolition Required)": 7437, "Proposed - Under Construction": 7438 } },
  tenancy: { type: "SingleOption", options: { "Multi-Tenant": 7418, "Owner Occupied": 7419, "Partial Owner Occupied": 7420, "Single-Tenant": 7421, "Unkown": 7422, "Vacant": 7423 } },
  stateOfImprovements: { type: "SingleOption", options: { "Improved": 7428, "Proposed": 7429, "Vacant Land": 7430, "Improved Development Land": 7431 } },
  currentUseImprovements: { type: "SingleOption", options: { "Vacant Land": 7445, "Single Family": 7446, "Multifamily": 7447, "Retail": 7448, "Industrial": 7449, "Office": 7450 } },
  proposedUseImprovements: { type: "SingleOption", options: { "Not Applicable": 7458, "Single Family": 7459, "Multifamily": 7460, "Mixed Use": 7461, "Retail": 7462, "Industrial": 7463, "Office": 7464 } },
  interestAppraised: { type: "MultiOption", options: { "Fee Simple": 7469, "Leased Fee Interest": 7470, "Leasehold Estate": 7471, "Going Concern": 7472 } },
  authorizedUse: { type: "SingleOption", options: { "First Mortgage Financing": 7481, "Litigation": 7482, "Estate Planning": 7483, "Acquisition-Disposition": 7484, "Internal Decision-Making": 7485, "Insurance": 7486, "Financial Reporting": 7487, "GST": 7488 } },
  intendedUse: { type: "SingleOption", options: { "First Mortgage Financing": 7481, "Litigation": 7482, "Estate Planning": 7483, "Acquisition-Disposition": 7484, "Internal Decision-Making": 7485, "Insurance": 7486, "Financial Reporting": 7487, "GST": 7488 } },
  valueScenarios: { type: "MultiOption", options: { "As Is Vacant Land": 7499, "As If Complete - Subdivided": 7500, "As If Complete - Serviced": 7501, "As If Complete - Rezoned": 7502, "As If Complete & Stabilized - Renovated": 7503, "As Stabilized": 7504, "As-Is": 7505, "As If Complete & Stabilized": 7506, "As If Vacant Land": 7507, "Insurable Replacement Cost": 7508 } },
  approachesToValue: { type: "MultiOption", options: { "Land Direct Comparison Approach": 7513, "Cost Approach": 7514, "Direct Comparison Approach": 7515, "Income Approach": 7516 } },
  assignmentType: { type: "SingleOption", options: { "Single Property": 7519, "Multiple Properties": 7520 } },
  reportType: { type: "SingleOption", options: { "Comprehensive": 7524, "Concise": 7525, "Form": 7526 } },
  desktopReport: { type: "SingleOption", options: { "Yes": 7529, "No": 7530 } },
  valueTimeframe: { type: "SingleOption", options: { "Current": 7534, "Prospective": 7535, "Retrospective": 7536 } },
  deliveryTime: { type: "Integer" },
  paid: { type: "Boolean" },
  clientDocuments: { type: "MultiOption", options: { "Previous Appraisal": 7548, "Environmental Reports": 7549, "Purchase & Sale Agreement": 7550, "Contact for Property Tour": 7551, "Development Permit Drawings": 7552, "Historical Operating Expenses": 7553, "Rent Roll": 7554, "Unit Mix": 7555, "Proforma": 7556, "Property Details": 7557, "Property Condition Reports": 7558 } },
  previouslyAppraised: { type: "SingleOption", options: { "Yes": 7561, "No": 7562 } },
  transactionStatus: { type: "MultiOption", options: { "Not Applicable": 7566, "Listed": 7567, "Under Contract": 7568 } },
  zoningStatus: { type: "SingleOption", options: { "In Place": 7571, "To Be Rezoned": 7572 } },
  landMetric: { type: "SingleOption", options: { "$/Unit": 7577, "$/FAR": 7578, "$/SF": 7579, "$/Acre": 7580 } },
  cmhcFinancing: { type: "SingleOption", options: { "Yes": 7583, "No": 7584 } },
};

// Value Scenarios → Valcre "Valuation Premise" custom fields (CF11563 Premise-1 / CF11564 Premise-2).
// MANUAL mapping — the app does NOT implement the Status-of-Improvements → scenario cascade (not built here).
// Only QA-verified scenario→option mappings are included; unverified values are SKIPPED (no guessing).
const VALUE_SCENARIO_PREMISE_MAP: Record<string, { fieldId: number; valueId: number }> = {
  "As-Is": { fieldId: 11563, valueId: 5128 },          // Premise-1 — verified QA 2026-06-04
  "As Is": { fieldId: 11563, valueId: 5128 },
  "As Stabilized": { fieldId: 11564, valueId: 5138 },  // Premise-2 — verified QA 2026-06-04
};

// GetValues readback — Valcre UpdateSelectFieldValue returns HTTP 200 even on internal failure, so the
// ONLY proof a custom-field write landed is reading it back (AUTO-SYNC-WIRING-MAP gotcha 1). type=6 = Job.
async function getJobCustomFieldValues(token: string, jobId: number): Promise<any[]> {
  try {
    const r = await fetch(
      `https://api-core.valcre.com/api/v1/CustomFields/GetValues?entityId=${jobId}&type=6`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : d?.value || d?.Values || [];
  } catch {
    return [];
  }
}

// Confirm a select custom field holds the expected AvailableValueId.
// GetValues(type=6) returns FIELD-DEFINITION entries keyed by `Id` (= the custom field id), with the
// job's chosen value(s) nested in `SelectedValues[]` (each `{ CustomFieldId, AvailableValueId, SelectedIds }`).
// Verified live against VAL261101/CF12407 2026-06-05. Tolerant of the older flat shape too.
function customFieldHasValue(values: any[], fieldId: number, expectedValueId: number): boolean {
  // New shape: the def entry whose Id === fieldId, value(s) under SelectedValues.
  const def = values.find((v) => (v?.Id ?? v?.id) === fieldId);
  if (def && Array.isArray(def.SelectedValues)) {
    for (const sv of def.SelectedValues) {
      if ((sv?.AvailableValueId ?? sv?.availableValueId) === expectedValueId) return true;
      const ids = String(sv?.SelectedIds ?? "").split(",").map((s) => s.trim());
      if (ids.includes(String(expectedValueId))) return true;
    }
  }
  // Legacy flat shape: entry keyed by CustomFieldId with the value inline.
  const flat = values.find(
    (v) => (v?.CustomFieldId ?? v?.customFieldId ?? v?.FieldId) === fieldId,
  );
  if (flat) {
    const av = flat.AvailableValueId ?? flat.availableValueId ?? flat.SelectedAvailableValueId;
    if (av === expectedValueId) return true;
    const sel = String(flat.SelectedIds ?? flat.selectedIds ?? "").split(",").map((s) => s.trim());
    if (sel.includes(String(expectedValueId))) return true;
  }
  return false;
}

// Set VALTA custom field values on a Valcre job
// Called after job creation or update when VALTA fields are present
// Uses correct Valcre API property names: EntityId, CustomFieldId, Value/SelectedValues
async function setValtaCustomFields(
  token: string,
  jobId: number,
  jobData: any,
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  const API_BASE = "https://api-core.valcre.com/api/v1";

  for (const [fieldName, fieldDefId] of Object.entries(VALTA_CUSTOM_FIELD_IDS)) {
    const value = jobData[fieldName];
    if (value === undefined || value === null || value === "") continue;

    const config = VALTA_FIELD_CONFIG[fieldName];
    if (!config) continue;

    try {
      let endpoint: string;
      let body: any;

      if (config.type === "SingleOption") {
        // SingleOption uses AvailableValueId (single object)
        endpoint = `${API_BASE}/CustomFields/UpdateSelectFieldValue`;
        const optionId = config.options?.[String(value)];
        if (!optionId) {
          console.log(`  Custom field ${fieldName}: no matching option for "${value}", skipping`);
          continue;
        }
        body = {
          EntityId: jobId,
          CustomFieldId: fieldDefId,
          AvailableValueId: optionId,
        };
      } else if (config.type === "MultiOption") {
        // MultiOption uses SelectedIds as a STRING (not array — Valcre OData quirk)
        endpoint = `${API_BASE}/CustomFields/UpdateSelectFieldValue`;
        const textValues = typeof value === "string"
          ? value.split(",").map((v: string) => v.trim())
          : [String(value)];
        const ids = textValues
          .map((v) => config.options?.[v])
          .filter((id): id is number => id !== undefined);
        if (ids.length === 0) {
          console.log(`  Custom field ${fieldName}: no matching options for "${value}", skipping`);
          continue;
        }
        body = {
          EntityId: jobId,
          CustomFieldId: fieldDefId,
          SelectedIds: ids.join(","), // Must be string, not array
        };
      } else {
        // String, Boolean — use UpdateFieldValue
        endpoint = `${API_BASE}/CustomFields/UpdateFieldValue`;
        body = {
          EntityId: jobId,
          CustomFieldId: fieldDefId,
          Value: config.type === "Boolean" ? (value === "Yes" || value === true) : String(value),
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok || response.status === 204) {
        // Gotcha 1: HTTP 200 != success. For SingleOption, verify the write via GetValues readback.
        if (config.type === "SingleOption") {
          const expectedId = config.options?.[String(value)];
          const vals = await getJobCustomFieldValues(token, jobId);
          if (expectedId && customFieldHasValue(vals, fieldDefId, expectedId)) {
            console.log(`  Custom field ${fieldName}=${value} → VERIFIED (readback)`);
            results.success++;
          } else {
            console.error(`  Custom field ${fieldName}=${value} → HTTP 200 but READBACK FAILED (value not set)`);
            results.errors.push(`${fieldName}: 200 but readback failed`);
            results.failed++;
          }
        } else {
          console.log(`  Custom field ${fieldName}=${value} → OK (${config.type})`);
          results.success++;
        }
      } else {
        const errText = await response.text();
        console.error(`  Custom field ${fieldName} FAILED: ${errText}`);
        results.errors.push(`${fieldName}: ${errText}`);
        results.failed++;
      }
    } catch (err: any) {
      console.error(`  Custom field ${fieldName} ERROR: ${err.message}`);
      results.errors.push(`${fieldName}: ${err.message}`);
      results.failed++;
    }
  }

  return results;
}

// Helper function to parse dollar amounts (strip $ and commas)
function parseDollarAmount(value: string | number | undefined): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  return parseFloat(value.toString().replace(/[$,]/g, "")) || 0;
}

// Helper function to parse city and province from address
function parseAddress(address: string): {
  street: string;
  city: string;
  province: string;
  postalCode: string;
} {
  // Default values - empty strings instead of assumed location
  // Previously defaulted to Calgary/AB which caused incorrect data for non-Alberta properties
  let result = {
    street: address,
    city: "",
    province: "",
    postalCode: "",
  };

  if (!address) return result;

  // Try to parse the address
  // Format expected: "123 Main St, Calgary, AB T2P 1A1" or "123 Main St Calgary AB"
  const parts = address.split(",").map((s) => s.trim());

  if (parts.length >= 2) {
    result.street = parts[0];

    // Check if last part contains province and postal code
    const lastPart = parts[parts.length - 1];
    const provinceMatch = lastPart.match(
      /\b(AB|BC|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU)\b/i,
    );
    const postalMatch = lastPart.match(/\b([A-Z]\d[A-Z]\s*\d[A-Z]\d)\b/i);

    if (postalMatch) {
      result.postalCode = postalMatch[1].replace(/\s/g, " ");
    }

    if (provinceMatch) {
      result.province = provinceMatch[1].toUpperCase();
      // The part before the province is the city
      if (parts.length === 3) {
        result.city = parts[1];
      } else if (parts.length === 2) {
        // Extract city from the last part (before province)
        const cityPart = lastPart.substring(0, provinceMatch.index).trim();
        if (cityPart && !postalMatch) result.city = cityPart;
      }
    } else if (parts.length >= 2) {
      // No province found, assume second part is city
      result.city = parts[1]
        .replace(/\b([A-Z]\d[A-Z]\s*\d[A-Z]\d)\b/i, "")
        .trim();
    }
  }

  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { jobData } = req.body;

    if (!jobData) {
      return res.status(400).json({ error: "Missing jobData in request" });
    }

    console.log("Received job data:", JSON.stringify(jobData, null, 2));
    // Check for update operations
    if (jobData.updateType && jobData.jobId) {
      console.log(
        `Processing ${jobData.updateType} update for job ${jobData.jobId}`,
      );
      console.log(
        "🔍 DEBUG - Full jobData received:",
        JSON.stringify(jobData, null, 2),
      );

      try {
        // Authenticate with Valcre first
        console.log("Authenticating for update...");
        const authBody = {
          grant_type: "password",
          client_id:
            process.env.VALCRE_CLIENT_ID || "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
          client_secret:
            process.env.VALCRE_CLIENT_SECRET ||
            "6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ",
          username: process.env.VALCRE_USERNAME || "chris.chornohos@valta.ca",
          password: process.env.VALCRE_PASSWORD || "Valvalta1!",
          scope: "offline_access",
          audience: "https://valcre.api.com",
        };

        const authResponse = await fetch(
          "https://auth.valcre.com/oauth/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(authBody),
          },
        );

        const authData = await authResponse.json();
        const token = authData.access_token;

        // Prepare update data based on what fields are provided
        const updateData: any = {};

        // Map job fields that can be updated - handle both regular updates and LOE details
        if (jobData.appraisalFee || jobData.AppraisalFee)
          updateData.Fee = jobData.appraisalFee || jobData.AppraisalFee;
        if (
          jobData.retainerAmount ||
          jobData.RetainerAmount ||
          jobData.Retainer
        )
          updateData.Retainer =
            jobData.retainerAmount ||
            jobData.RetainerAmount ||
            jobData.Retainer;
        if (jobData.deliveryDate || jobData.DeliveryDate) {
          const date = jobData.deliveryDate || jobData.DeliveryDate;
          updateData.DueDate = date.split("T")[0];
        }

        // PRD-A clean native-Job-field mappings — verified live on VAL261101.
        // Only native prop names are sent to updateData (OData 500s on unknown props).
        // Request Date → Job.BidDate (#1)
        if (jobData.requestDate) {
          updateData.BidDate = String(jobData.requestDate).split("T")[0];
          console.log(`✅ Request Date → BidDate: "${updateData.BidDate}"`);
        }
        // Signed Date → Job.AwardDate (#2)
        if (jobData.signedDate) {
          updateData.AwardDate = String(jobData.signedDate).split("T")[0];
          console.log(`✅ Signed Date → AwardDate: "${updateData.AwardDate}"`);
        }
        // Effective Date → Job.EffectiveDate (#3)
        if (jobData.effectiveDate) {
          updateData.EffectiveDate = String(jobData.effectiveDate).split("T")[0];
          console.log(`✅ Effective Date → EffectiveDate: "${updateData.EffectiveDate}"`);
        }

        // Authorized Use — D1 (v3.1, 2026-06-05): MOVED OFF native Job.IntendedUses ONTO the new
        // CUSTOM field CF12413. Per the v3.1 master AuthorizedUse = "New Custom Valcre Field = Yes",
        // so the native IntendedUses writes (intendedUse + authorizedUse) are removed. The value now
        // flows through setValtaCustomFields via the `intendedUse` key (the deduped intake field) →
        // CF12413 with the 8 ListAuthorizedUse option IDs. INTENDED_USES_MAP is retained only for the
        // create path's legacy fallback until that's migrated too.

        // Analysis Level → Job.AnalysisLevel (AUTO-SYNC-WIRING-MAP 2026-06-04). ANALYSIS_LEVEL_MAP keys only.
        if (jobData.analysisLevel) {
          const converted = ANALYSIS_LEVEL_MAP[jobData.analysisLevel];
          if (converted) {
            updateData.AnalysisLevel = converted;
            console.log(`✅ Analysis Level mapped: "${jobData.analysisLevel}" → "${converted}"`);
          } else {
            console.log(`⚠️ WARNING: Analysis Level value "${jobData.analysisLevel}" not in ANALYSIS_LEVEL_MAP, skipping`);
          }
        }

        // Scope of Work → ScopeOfWork field (Nov 13, 2025 - Added; multi-select Jun 2026)
        if (jobData.scopeOfWork || jobData.ScopeOfWork) {
          const rawValue = jobData.scopeOfWork || jobData.ScopeOfWork;
          const mappedScopes = rawValue
            .split(',')
            .map((v: string) => v.trim())
            .map((v: string) => {
              const mapped = SCOPE_OF_WORK_MAP[v];
              if (!mapped) {
                console.warn(`⚠️ WARNING: Scope of Work value "${v}" not in SCOPE_OF_WORK_MAP, skipping`);
              }
              return mapped;
            })
            .filter(Boolean);
          if (mappedScopes.length > 0) {
            updateData.Scopes = mappedScopes.join(', ');
            console.log(
              `✅ Scope of Work mapped: "${rawValue}" → "${updateData.Scopes}"`,
            );
          } else {
            console.log(
              `⚠️ WARNING: No valid Scope of Work values mapped from "${rawValue}", skipping`,
            );
          }
        }

        if (jobData.ClientComments || jobData.specialInstructions)
          updateData.ClientComments =
            jobData.ClientComments || jobData.specialInstructions;
        if (
          jobData.InternalComments ||
          jobData.internalComments ||
          jobData.appraiserComments
        )
          updateData.Comments =
            jobData.InternalComments ||
            jobData.internalComments ||
            jobData.appraiserComments;
        if (jobData.deliveryComments)
          updateData.DeliveryComments = jobData.deliveryComments;
        if (jobData.paymentComments)
          updateData.PaymentComments = jobData.paymentComments;
        if (jobData.paymentAmount || jobData.PaymentAmount)
          updateData.AmountPaid = jobData.paymentAmount || jobData.PaymentAmount;
        if (jobData.paymentPaidDate || jobData.PaymentPaidDate) {
          const date = jobData.paymentPaidDate || jobData.PaymentPaidDate;
          updateData.PaidDate = date.split("T")[0];
        }

        // Map Report fields to proper Valcre enum fields (Nov 13, 2025 - Fixed)

        // Property Rights → Purposes field (using PURPOSES_MAP)
        if (
          jobData.propertyRightsAppraised ||
          jobData.PropertyRightsAppraised
        ) {
          // Job.Purposes is a SINGLE enum but the dashboard field is multi-select (comma-joined).
          // House pattern for multi-select → single-enum = "First value only" (matches PropertyType,
          // 1-API-FIELD-MAPPING-REFERENCE.md). Take the primary selection so multi-select degrades
          // gracefully instead of silently skipping (whole comma string never matches a map key).
          const rawValue = String(
            jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised,
          )
            .split(",")[0]
            .trim();
          const converted = PURPOSES_MAP[rawValue];
          if (converted) {
            updateData.Purposes = converted;
            console.log(
              `✅ Property Rights mapped: "${rawValue}" → "${converted}"`,
            );
          } else {
            console.log(
              `⚠️ WARNING: Property Rights value "${rawValue}" not in PURPOSES_MAP, skipping`,
            );
          }
        }

        // Report Type → ReportFormat field (using REPORT_FORMAT_MAP)
        if (jobData.reportType || jobData.ReportType) {
          const rawValue = jobData.reportType || jobData.ReportType;
          const converted = REPORT_FORMAT_MAP[rawValue];
          if (converted && converted !== "Form") {
            updateData.ReportFormat = converted;
            console.log(
              `✅ Report Type mapped: "${rawValue}" → "${converted}"`,
            );
          } else if (!converted) {
            console.log(
              `⚠️ WARNING: Report Type value "${rawValue}" not in REPORT_FORMAT_MAP, skipping`,
            );
          }
        }

        // Valuation Premises → RequestedValues field (using REQUESTED_VALUES_MAP)
        if (jobData.valuationPremises || jobData.ValuationPremises) {
          const rawValue =
            jobData.valuationPremises || jobData.ValuationPremises;
          const converted = REQUESTED_VALUES_MAP[rawValue];
          if (converted) {
            updateData.RequestedValues = converted;
            console.log(
              `✅ Valuation Premises mapped: "${rawValue}" → "${converted}"`,
            );
          } else {
            console.log(
              `⚠️ WARNING: Valuation Premises value "${rawValue}" not in REQUESTED_VALUES_MAP, skipping`,
            );
          }
        }

        // Payment Terms (keep in Comments for now - no dedicated Valcre field)
        if (jobData.paymentTerms) {
          const paymentSection = `Payment Terms: ${jobData.paymentTerms}`;
          updateData.Comments = updateData.Comments
            ? `${updateData.Comments} | ${paymentSection}`
            : paymentSection;
        }

        // VALTA-FIELD-SPEC fields — stored as Valcre custom fields (v3.1 IDs 12407-12427, re-pointed 2026-06-05).
        // NOT in Valcre native Job schema — set via CustomFields/UpdateFieldValue after PATCH.
        // See setValtaCustomFields() call after successful update response.

        console.log(
          "Sending update to Valcre:",
          JSON.stringify(updateData, null, 2),
        );

        // Update the job using PATCH
        const updateUrl = `https://api-core.valcre.com/api/v1/Jobs(${jobData.jobId})`;
        const updateResponse = await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        // For updates, we can't easily update Property/Parcel entities since we don't have their IDs
        // But we can add the parcel/assessment data to Comments for now
        const additionalUpdates = [];
        if (jobData.ParcelNumber)
          additionalUpdates.push(`Parcel: ${jobData.ParcelNumber}`);
        if (jobData.ParcelLegalDescription)
          additionalUpdates.push(`Legal: ${jobData.ParcelLegalDescription}`);
        if (jobData.ParcelUsableLandSf)
          additionalUpdates.push(
            `Usable Land: ${jobData.ParcelUsableLandSf} SF`,
          );
        if (jobData.GrossLandSf)
          additionalUpdates.push(`Gross Land: ${jobData.GrossLandSf} SF`);
        if (jobData.AssessmentYear)
          additionalUpdates.push(`Assessment Year: ${jobData.AssessmentYear}`);
        if (jobData.LandAssessmentValue)
          additionalUpdates.push(`Land Value: $${jobData.LandAssessmentValue}`);
        if (jobData.ImprovedAssessmentValue)
          additionalUpdates.push(
            `Improved Value: $${jobData.ImprovedAssessmentValue}`,
          );
        if (jobData.Taxes) additionalUpdates.push(`Taxes: $${jobData.Taxes}`);

        if (additionalUpdates.length > 0) {
          console.log(
            "Note: PropertyParcel/Assessment fields added to Comments (update limitation)",
          );
        }

        const updateResponseText = await updateResponse.text();
        console.log("Update response status:", updateResponse.status);
        console.log("Update response:", updateResponseText);

        // Valcre can return HTTP 200 with a FAILURE body for the native PATCH
        // (e.g. {"status":"400","success":false,"error":["Requested value 'Concise' was not found."]}).
        // Detect it so a rejected native write is NOT reported as success (the 200-not-success trap that
        // hid the AnalysisLevel bug — invalid enum value silently accepted at the HTTP layer).
        let nativePatchError: string | null = null;
        try {
          const parsed = JSON.parse(updateResponseText);
          if (parsed && (parsed.success === false || parsed.status === "400" || parsed.status === 400 || parsed.error)) {
            nativePatchError = Array.isArray(parsed.error)
              ? parsed.error.join("; ")
              : String(parsed.error ?? parsed.status ?? "native PATCH rejected");
            console.error(`🔴 Native PATCH returned HTTP ${updateResponse.status} but body indicates FAILURE: ${nativePatchError}`);
          }
        } catch {
          /* non-JSON body (empty 204 etc.) = no in-body error */
        }

        if (updateResponse.ok || updateResponse.status === 204) {
          // NATIVE readback (2026-06-04): the per-field native bug hid behind a 200, so verify the PATCH
          // actually landed by reading the native fields back — don't trust updateResponse.ok alone.
          const nativeVerify: Record<string, { sent: any; actual: any; ok: boolean }> = {};
          const nativeKeys = Object.keys(updateData);
          if (nativeKeys.length > 0) {
            try {
              const gr = await fetch(
                `https://api-core.valcre.com/api/v1/Jobs(${jobData.jobId})?$select=${nativeKeys.join(",")}`,
                { headers: { Authorization: `Bearer ${token}` } },
              );
              if (gr.ok) {
                const jobRow = await gr.json();
                for (const k of nativeKeys) {
                  const sent = String(updateData[k] ?? "");
                  const actual = String(jobRow?.[k] ?? "");
                  const ok = actual === sent || actual.split("T")[0] === sent.split("T")[0];
                  nativeVerify[k] = { sent: updateData[k], actual: jobRow?.[k], ok };
                  console.log(`  Native ${k}: sent="${sent}" actual="${actual}" → ${ok ? "VERIFIED" : "MISMATCH"}`);
                }
              } else {
                console.warn(`  Native readback GET failed: ${gr.status}`);
              }
            } catch (e: any) {
              console.warn(`  Native readback error: ${e.message}`);
            }
          }

          // Set VALTA custom fields if any are present in the update
          let customFieldResults = { success: 0, failed: 0, errors: [] as string[] };
          const hasValtaFields = Object.keys(VALTA_CUSTOM_FIELD_IDS).some(
            (key) => jobData[key] !== undefined && jobData[key] !== null && jobData[key] !== "",
          );
          if (hasValtaFields) {
            console.log("Setting VALTA custom fields on job update...");
            customFieldResults = await setValtaCustomFields(token, jobData.jobId, jobData);
            console.log(
              `VALTA custom fields: ${customFieldResults.success} set, ${customFieldResults.failed} failed`,
            );
          }

          // Fix 1: valueScenarios now routes ONLY through setValtaCustomFields → CF12414 (MultiOption,
          // holds all 10 scenario options). The legacy CF11563/11564 (Premise-1/Premise-2) dual-write was
          // removed because it only mapped 3 of the 10 scenario names — any scenario NOT in
          // VALUE_SCENARIO_PREMISE_MAP (e.g. "As If Complete & Stabilized") caused a failed-write that
          // bubbled up as "Failed to sync valueScenarios to Valcre" even though CF12414 held the data
          // correctly (readback-verified on job 784140, 2026-06-10). valueScenarios lands in CF12414
          // via the setValtaCustomFields() call above (the `valueScenarios` key in VALTA_CUSTOM_FIELD_IDS).

          // PropertySubtype → Property.SecondaryType (update path).
          // SecondaryType lives on the Property entity, not the Job entity, so it cannot go into
          // updateData (the Job PATCH). Resolve the linked PropertyId from the job record then PATCH it.
          let propertySubtypePatched = false;
          const rawSubtype = jobData.PropertySubtype || jobData.propertySubtype;
          if (rawSubtype) {
            try {
              const jobFetchResp = await fetch(
                `https://api-core.valcre.com/api/v1/Jobs(${jobData.jobId})?$select=PropertyId`,
                { headers: { Authorization: `Bearer ${token}` } },
              );
              if (jobFetchResp.ok) {
                const jobRow = await jobFetchResp.json();
                const linkedPropertyId = jobRow?.PropertyId;
                if (linkedPropertyId) {
                  const propPatchResp = await fetch(
                    `https://api-core.valcre.com/api/v1/Properties(${linkedPropertyId})`,
                    {
                      method: "PATCH",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ SecondaryType: rawSubtype }),
                    },
                  );
                  if (propPatchResp.ok || propPatchResp.status === 204) {
                    console.log(`✅ PropertySubtype → SecondaryType="${rawSubtype}" on Property ${linkedPropertyId}`);
                    propertySubtypePatched = true;
                  } else {
                    const errBody = await propPatchResp.text();
                    console.error(`⚠️ SecondaryType PATCH failed (${propPatchResp.status}): ${errBody}`);
                  }
                } else {
                  console.warn(`⚠️ SecondaryType: job ${jobData.jobId} has no linked PropertyId — skipping`);
                }
              } else {
                console.warn(`⚠️ SecondaryType: failed to fetch job PropertyId (${jobFetchResp.status})`);
              }
            } catch (subtypeErr: any) {
              console.error(`⚠️ SecondaryType patch error: ${subtypeErr.message}`);
            }
          }

          return res
            .status(200)
            .setHeader("Access-Control-Allow-Origin", "*")
            .json({
              success: true,
              message: `Job ${jobData.jobId} updated successfully`,
              updateType: jobData.updateType,
              updatedFields: Object.keys(updateData),
              valcreResponse: updateResponseText || "No content (success)",
              customFields: hasValtaFields ? customFieldResults : undefined,
              nativeVerified: nativeKeys.length > 0 ? nativeVerify : undefined,
              nativePatchError: nativePatchError || undefined,
            });
        } else {
          console.error("Update failed:", updateResponseText);
          return res
            .status(500)
            .setHeader("Access-Control-Allow-Origin", "*")
            .json({
              success: false,
              error: "Failed to update job",
              details: updateResponseText,
              updateData: updateData,
            });
        }
      } catch (updateError: any) {
        console.error("Update error:", updateError);
        return res
          .status(500)
          .setHeader("Access-Control-Allow-Origin", "*")
          .json({
            success: false,
            error: "Update operation failed",
            message: updateError.message,
          });
      }
    }

    // Authenticate with Valcre
    console.log("Authenticating with Valcre...");
    const authBody = {
      grant_type: "password",
      client_id:
        process.env.VALCRE_CLIENT_ID || "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
      client_secret:
        process.env.VALCRE_CLIENT_SECRET ||
        "6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ",
      username: process.env.VALCRE_USERNAME || "chris.chornohos@valta.ca",
      password: process.env.VALCRE_PASSWORD || "Valvalta1!",
      scope: "offline_access",
      audience: "https://valcre.api.com",
    };

    const authResponse = await fetch("https://auth.valcre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authBody),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      console.error("Authentication failed:", errorData);
      return res
        .status(401)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({ error: "Authentication failed", details: errorData });
    }

    const authData = await authResponse.json();
    console.log(
      "Authentication successful, token received:",
      authData.access_token ? "Yes" : "No",
    );
    const token = authData.access_token;

    // STEP 1: Check if Contact exists or create new one
    let clientId: number;

    // Get CLIENT contact info from jobData (sent by webhook)
    // Parse client name from ClientName field
    // Fix 3: accept both PascalCase (webhook) and camelCase (dashboard update) field names
    const clientFullName = jobData.ClientName || jobData.clientName || "Client Contact";
    const [clientFirstName, ...clientLastParts] = clientFullName.split(" ");
    const clientLastName = clientLastParts.join(" ") || "Contact";

    const clientEmail = jobData.ClientEmail || jobData.clientEmail || "";
    const contactCompany = jobData.ClientCompany || jobData.clientOrganization || "Direct Client";

    // Parse the property address for property creation
    const addressParts = parseAddress(
      jobData.PropertyAddress || jobData.Street || "",
    );

    // Parse the client address separately for contact creation
    // Falls back to property address if no client address provided
    // Fix 3b: accept camelCase clientAddress (dashboard) in addition to PascalCase ClientAddress (webhook).
    // Without this fallback, clientAddressParts fell back to addressParts (property address) when the
    // dashboard sent clientAddress — so the contact received the PROPERTY address instead of the client's.
    const clientAddressParts = (jobData.ClientAddress || jobData.clientAddress)
      ? parseAddress(jobData.ClientAddress || jobData.clientAddress)
      : addressParts;

    // Try to find existing contact by email (if provided)
    if (clientEmail) {
      console.log(
        "Checking for existing CLIENT contact with email:",
        clientEmail,
      );
      const searchUrl = `https://api-core.valcre.com/api/v1/Contacts?$filter=Email eq '${encodeURIComponent(clientEmail)}'`;

      const searchResponse = await fetch(searchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (searchResponse.ok) {
        const searchResults = await searchResponse.json();
        if (searchResults.value && searchResults.value.length > 0) {
          const existingContact = searchResults.value[0];
          // Try multiple possible ID field names
          clientId =
            existingContact.Id ||
            existingContact.id ||
            existingContact.ID ||
            existingContact.ContactId ||
            existingContact.contactId;
          console.log("✅ Found existing contact with ID:", clientId);
        }
      }
    }

    // Create new contact if not found
    if (!clientId!) {
      console.log("Creating new CLIENT Contact entity...");
      const contactData = {
        Company: contactCompany,
        FirstName: clientFirstName,
        LastName: clientLastName,
        AddressStreet: clientAddressParts.street,
        AddressCity: clientAddressParts.city,
        AddressState: clientAddressParts.province || "",
        AddressPostalCode: clientAddressParts.postalCode || "",
        PhoneNumber: jobData.ClientPhone || jobData.clientPhone || "",
        Email: clientEmail,
        // Fix 3a: accept camelCase clientTitle (dashboard update). Without this fallback the Title
        // was always "Client" when the dashboard sent clientTitle (camelCase).
        Title: jobData.ClientTitle || jobData.clientTitle || "Client",
        OwnerId: 7095, // Chris's correct OwnerId
      };

      const contactResponse = await fetch(
        "https://api-core.valcre.com/api/v1/Contacts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        },
      );

      if (!contactResponse.ok) {
        const errorText = await contactResponse.text();
        console.error("Failed to create Contact:", errorText);
        return res
          .status(500)
          .setHeader("Access-Control-Allow-Origin", "*")
          .json({
            error: "Failed to create Contact entity",
            details: errorText,
          });
      }

      const contact = await contactResponse.json();
      // Try multiple possible ID field names
      clientId =
        contact.Id ||
        contact.id ||
        contact.ID ||
        contact.ContactId ||
        contact.contactId;
      console.log("🔍 Contact Response Keys:", Object.keys(contact));
      console.log("✅ Contact created with ID:", clientId);

      if (!clientId) {
        console.error("❌ Contact created but no ID returned!");
        console.error("Response structure:", JSON.stringify(contact, null, 2));
        return res
          .status(500)
          .setHeader("Access-Control-Allow-Origin", "*")
          .json({
            error: "Contact created but no ID returned",
            details: {
              message: "Valcre API returned a response without an ID field",
              responseKeys: Object.keys(contact),
              fullResponse: contact,
            },
          });
      }
    }

    // STEP 2: Create Property Contact Entity (if different from client)
    let propertyContactId: number | null = null;

    // Check if we need a separate property contact (different email or name)
    const needsSeparatePropertyContact =
      jobData.PropertyContact &&
      (jobData.PropertyContact.Email !== clientEmail ||
        jobData.PropertyContact.FirstName !== clientFirstName ||
        jobData.PropertyContact.LastName !== clientLastName);

    console.log(`🔍 PropertyContact check:`, {
      hasPropertyContact: !!jobData.PropertyContact,
      propertyContactData: jobData.PropertyContact,
      propertyEmail: jobData.PropertyContact?.Email,
      clientEmail: clientEmail,
      emailsDifferent: jobData.PropertyContact?.Email !== clientEmail,
      needsSeparate: needsSeparatePropertyContact,
    });

    if (needsSeparatePropertyContact) {
      console.log("Creating separate Property Contact entity...");
      const propertyContactData = {
        Company: jobData.PropertyContact.Company || contactCompany,
        FirstName: jobData.PropertyContact.FirstName || clientFirstName,
        LastName: jobData.PropertyContact.LastName || clientLastName,
        AddressStreet:
          jobData.PropertyContact.AddressStreet || addressParts.street,
        AddressCity: addressParts.city,
        AddressState: addressParts.province || "",
        AddressPostalCode: addressParts.postalCode || "",
        PhoneNumber: jobData.PropertyContact.PhoneNumber || "",
        Email: jobData.PropertyContact.Email || "",
        Title: jobData.PropertyContact.Title || "Property Contact",
        OwnerId: 7095, // Chris's correct OwnerId
      };

      // Additional logging for PropertyContact investigation
      console.log(
        "👤 Creating PropertyContact with data:",
        JSON.stringify(propertyContactData, null, 2),
      );

      const propContactResponse = await fetch(
        "https://api-core.valcre.com/api/v1/Contacts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyContactData),
        },
      );

      if (propContactResponse.ok) {
        const propContact = await propContactResponse.json();
        // Try multiple possible ID field names
        propertyContactId =
          propContact.Id ||
          propContact.id ||
          propContact.ID ||
          propContact.ContactId ||
          propContact.contactId;
        console.log(
          "🔍 PropertyContact Response Keys:",
          Object.keys(propContact),
        );
        console.log("✅ Property Contact created with ID:", propertyContactId);

        if (!propertyContactId) {
          console.warn(
            "⚠️ PropertyContact created but no ID returned, will use null",
          );
          console.warn(
            "Response structure:",
            JSON.stringify(propContact, null, 2),
          );
          propertyContactId = null;
        }
      } else {
        const errorText = await propContactResponse.text();
        console.log(
          "⚠️ Failed to create separate Property Contact, will use ClientId",
        );
      }
    } else {
      // CRITICAL FIX: Leave propertyContactId as null - don't default to clientId
      // This prevents duplicate contact display in Valcre UI
      // The form layer handles "Same as Client Contact" logic - API should just map data
      propertyContactId = null;
      console.log(
        "No separate property contact needed - PropertyContactId will be null",
      );
    }

    // STEP 3: Create Property Entity - WITH ALL MAPPED FIELDS
    console.log("Creating Property entity with all mapped fields...");
    // Use the property name from jobData (contains custom name or fallback from webhook)
    // This preserves user's custom building names like "Tech Center Building"
    // DO NOT fall back to address - use "Unnamed Property" instead
    const propertyName = jobData.Name || "Unnamed Property";

    const propertyData: any = {
      // Basic address fields - combine unit with street if provided
      Name: propertyName,
      AddressStreet: jobData.PropertyUnit
        ? `${jobData.PropertyStreet || addressParts.street}, ${jobData.PropertyUnit}`
        : jobData.PropertyStreet || addressParts.street,
      AddressCity: jobData.PropertyCity || addressParts.city,
      AddressState: jobData.PropertyState || addressParts.province || "",
      AddressPostalCode:
        jobData.PropertyPostalCode || addressParts.postalCode || "",
    };

    // Add all other Property fields if provided
    // PROPERTY TYPE VALIDATION - Valcre only accepts specific enum values
    const VALID_PROPERTY_TYPES = [
      'Agriculture', 'Building', 'Healthcare', 'Hospitality', 'Industrial', 'Land',
      'Manufactured Housing', 'Multi-Family', 'Office', 'Retail', 'Self-Storage',
      'Single-Family', 'Special Purpose', 'Unknown'
    ];

    // Map legacy/invalid property types to valid ones
    // NOTE: Multi-Family goes in Types field (multi-select), PropertyType field uses "Building"
    const PROPERTY_TYPE_MAP: Record<string, string> = {
      'Mixed Use': 'Building',
      'Commercial': 'Building',
      'Residential': 'Building',
      'Multi-Family': 'Building', // PropertyType field doesn't support Multi-Family - it goes in Types field only
      'Multifamily': 'Building', // Dashboard canonical spelling (one word) → same as Multi-Family
    };

    // TYPES FIELD CONVERSION - Dashboard values → Valcre Types field values
    // Based on empirical test data from actual Valcre jobs (test-valcre-property-types.ts)
    // The Types field uses PascalCase: "MultiFamily", "HealthCare", etc.
    const TYPES_FIELD_MAP: Record<string, string> = {
      'Multi-Family': 'MultiFamily',
      'Multifamily': 'MultiFamily', // Dashboard canonical spelling (one word)
      'Single-Family': 'SingleFamily',
      'Self-Storage': 'SelfStorage',
      'Manufactured Housing': 'ManufacturedHousing',
      'Special Purpose': 'SpecialPurpose',
      'Healthcare': 'HealthCare', // "HealthCare" with capital C
      'Mixed Use': 'Building', // Valcre has no "Mixed Use" Types value; map to Building
      // Others pass through as-is (Agriculture, Building, Hospitality, Industrial, Land, Office, Retail, Unknown)
    };

    if (jobData.PropertyType) {
      // Parse comma-separated property types and validate each one
      const propertyTypes = jobData.PropertyType.split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      const firstType = propertyTypes[0];

      // Map or validate the first property type (for PropertyType field - single value only)
      let validatedType = PROPERTY_TYPE_MAP[firstType] || firstType;

      if (!VALID_PROPERTY_TYPES.includes(validatedType)) {
        console.warn(
          `⚠️ Invalid PropertyType "${firstType}" - defaulting to "Building"`,
        );
        validatedType = "Building"; // Default fallback
      }

      propertyData.PropertyType = validatedType;
      console.log(`🏢 PropertyType: "${firstType}" → "${validatedType}"`);
    }

    if (jobData.PropertySubtype)
      propertyData.SecondaryType = jobData.PropertySubtype;

    // Set Types field from PropertyTypeEnum (now supports comma-separated multi-select)
    // NOTE: Valcre API cannot parse arrays - expects string primitive
    // CRITICAL: Use TYPES_FIELD_MAP for conversion (e.g., "Multi-Family" → "MultiFamily")
    if (jobData.PropertyTypeEnum) {
      // Parse comma-separated property types
      const propertyTypes = jobData.PropertyTypeEnum.split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

      // Convert using TYPES_FIELD_MAP (Dashboard format → Valcre format)
      const convertedTypes = propertyTypes
        .map((type: string) => TYPES_FIELD_MAP[type] || type); // Convert format (e.g., "Multi-Family" → "MultiFamily")

      if (convertedTypes.length > 0) {
        propertyData.Types = convertedTypes.join(", ");
        console.log(
          `🏢 Types: "${jobData.PropertyTypeEnum}" → "${propertyData.Types}"`,
        );
      } else {
        console.warn(
          `⚠️ No valid property types in "${jobData.PropertyTypeEnum}" - using "Building"`,
        );
        propertyData.Types = "Building";
      }
    }
    if (jobData.BuildingSize) propertyData.SizeSF = jobData.BuildingSize;
    if (jobData.GrossBuildingAreaSf)
      propertyData.SizeSF = jobData.GrossBuildingAreaSf;
    if (jobData.NetRentableAreaSf)
      propertyData.RentableSF = jobData.NetRentableAreaSf;
    if (jobData.YearBuilt) propertyData.YearBuilt = jobData.YearBuilt;
    if (jobData.NumberOfUnits)
      propertyData.BuildingsCount = jobData.NumberOfUnits;
    if (jobData.ParkingSpaces)
      propertyData.ParkingSpacesCount = jobData.ParkingSpaces;
    if (jobData.ZoningClassification)
      propertyData.Zoning = jobData.ZoningClassification;
    if (jobData.ZoneAbbreviation)
      propertyData.ZoningName = jobData.ZoneAbbreviation;
    if (jobData.LandUseDesignation)
      propertyData.ProposedLandUse = jobData.LandUseDesignation;
    if (jobData.FloodZone) propertyData.SiteFloodZone = jobData.FloodZone;
    if (jobData.Utilities) propertyData.Utilities = jobData.Utilities;
    if (jobData.UsableLandSf) propertyData.BuildableArea = jobData.UsableLandSf;
    if (jobData.EnvironmentalPhase1)
      propertyData.EnvironmentalIssues = jobData.EnvironmentalPhase1;
    if (jobData.Notes) propertyData.OffSiteImprovements = jobData.Notes;
    // Map AssetCondition to InvestmentGrade - needs to be STRING of number!
    if (jobData.AssetCondition) {
      const gradeMap: Record<string, string> = {
        Excellent: "1", // A
        "Very Good": "2", // B
        Good: "2", // B (map to closest)
        Fair: "3", // C
        Poor: "4", // ValueAdd
      };
      propertyData.InvestmentGrade = gradeMap[jobData.AssetCondition] || "2"; // Default to B if unknown
    }

    // Map AssetQuality to QualitativeCondition - also needs to be STRING
    if (jobData.AssetQuality) {
      const qualityMap: Record<string, string> = {
        Excellent: "1",
        "Very Good": "2",
        Good: "3",
        "Above Average": "4",
        Average: "5",
        "Below Average": "6",
        Fair: "7",
        Poor: "8",
      };
      propertyData.QualitativeCondition =
        qualityMap[jobData.AssetQuality] || "5"; // Default to Average
    }
    if (jobData.MarketArea) propertyData.Market = jobData.MarketArea;
    if (jobData.Submarket) propertyData.SubmarketName = jobData.Submarket;

    // Combine descriptions into DescriptionText
    const descriptions = [];
    if (jobData.LegalDescription)
      descriptions.push(`Legal: ${jobData.LegalDescription}`);
    // Scope of Work removed - kept in UI but not sent to Valcre
    if (jobData.SpecialInstructions)
      descriptions.push(`Instructions: ${jobData.SpecialInstructions}`);
    if (descriptions.length > 0)
      propertyData.DescriptionText = descriptions.join(" | ");

    if (
      jobData.InternalComments ||
      jobData.internalComments ||
      jobData.appraiserComments
    )
      propertyData.CommentsPrivate =
        jobData.InternalComments ||
        jobData.internalComments ||
        jobData.appraiserComments;

    console.log("🚨 CRITICAL DEBUG - Property Data Being Sent:");
    console.log(`   PropertyType field: "${propertyData.PropertyType}"`);
    console.log(
      `   Full propertyData: ${JSON.stringify(propertyData, null, 2)}`,
    );
    const propertyResponse = await fetch(
      "https://api-core.valcre.com/api/v1/Properties",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      },
    );

    const propertyResponseText = await propertyResponse.text();
    console.log("Property Response Status:", propertyResponse.status);
    console.log("Property Response:", propertyResponseText);

    // Parse response first to check for Valcre's error format
    let property;
    try {
      property = JSON.parse(propertyResponseText);
    } catch (e) {
      console.error("Failed to parse Property response:", e);
      return res
        .status(500)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({
          error: "Invalid Property response",
          details: propertyResponseText,
        });
    }

    // Check for Valcre's error format (they return 200 with error in body!)
    if (
      !propertyResponse.ok ||
      property.success === false ||
      property.error ||
      property.status === "400"
    ) {
      console.error("❌ Valcre rejected Property creation:", property);
      return res
        .status(500)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({
          error: "Valcre API rejected Property creation",
          details: {
            message: property.error || "Property validation failed",
            valcreResponse: property,
            hint: property.error?.includes("was not found")
              ? "Invalid enum value sent to Valcre API. Check PropertyType field."
              : undefined,
          },
        });
    }

    // Try multiple possible ID field names (case-insensitive)
    const propertyId =
      property.Id ||
      property.id ||
      property.ID ||
      property.PropertyId ||
      property.propertyId ||
      property.PropertyID ||
      property.propertyID;

    console.log("🔍 Property Response Keys:", Object.keys(property));
    console.log("🔍 Extracted Property ID:", propertyId);
    console.log("✅ Property created with ID:", propertyId);

    if (!propertyId) {
      console.error("❌ Property created but no ID returned!");
      console.error("Response structure:", JSON.stringify(property, null, 2));
      console.error("Available keys:", Object.keys(property));
      return res
        .status(500)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({
          error: "Property created but no ID returned",
          details: {
            message: "Valcre API returned a response without an ID field",
            responseKeys: Object.keys(property),
            fullResponse: property,
          },
        });
    }

    // STEP 4: Create PropertyParcel if parcel data is provided
    if (jobData.ParcelNumber || jobData.ParcelLegalDescription) {
      console.log("Creating PropertyParcel entity...");
      const parcelData: any = {
        PropertyId: propertyId, // Link to the Property
        Number: jobData.ParcelNumber || "",
        LegalDescription:
          jobData.ParcelLegalDescription || jobData.LegalDescription || "",
        PrimaryArea: jobData.ParcelUsableLandSf || jobData.UsableLandSf || 0,
        ExcessArea: jobData.GrossLandSf || 0,
      };

      console.log("PropertyParcel data:", JSON.stringify(parcelData, null, 2));

      const parcelResponse = await fetch(
        "https://api-core.valcre.com/api/v1/PropertyParcels",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parcelData),
        },
      );

      if (parcelResponse.ok) {
        const parcel = await parcelResponse.json();
        const parcelId = parcel.Id || parcel.id;
        console.log("✅ PropertyParcel created with ID:", parcelId);

        // Create PropertyParcelAssessment if assessment data is provided
        if (jobData.AssessmentYear || jobData.LandAssessmentValue) {
          console.log("Creating PropertyParcelAssessment...");
          const assessmentData = {
            ParcelId: parcelId, // Correct field name
            Year: jobData.AssessmentYear || new Date().getFullYear(),
            LandValue: jobData.LandAssessmentValue || 0,
            ImprovedValue: jobData.ImprovedAssessmentValue || 0,
            Taxes: jobData.Taxes || 0,
          };

          const assessmentResponse = await fetch(
            "https://api-core.valcre.com/api/v1/PropertyParcelAssessments",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(assessmentData),
            },
          );

          if (assessmentResponse.ok) {
            const assessment = await assessmentResponse.json();
            console.log(
              "✅ PropertyParcelAssessment created with ID:",
              assessment.Id || assessment.id,
            );
          } else {
            const errorText = await assessmentResponse.text();
            console.log(
              "⚠️ Failed to create PropertyParcelAssessment:",
              errorText,
            );
          }
        }
      } else {
        const errorText = await parcelResponse.text();
        console.log("⚠️ Failed to create PropertyParcel:", errorText);
      }
    }

    // STEP 5: Create Job Entity with references
    console.log(
      "Creating Job entity with Client, Property, and PropertyContact references...",
    );

    // Construct formatted Job.Name: "{Property.Name}, {Street}, {City}, {State}"
    const street = propertyData.AddressStreet || addressParts.street || "";
    const city = propertyData.AddressCity || addressParts.city || "";
    const state = propertyData.AddressState || addressParts.province || "";
    const jobName = `${propertyName}, ${street}, ${city}, ${state}`;
    console.log(`🏢 Job Name: "${jobName}"`);

    const jobCreateData: any = {
      Name: jobName,
      Status: "Lead",
      OwnerId: 7095, // Chris's correct OwnerId

      // CRITICAL: Reference the entities we just created!
      ClientId: clientId, // This makes client info appear in Valcre!
      PropertyId: propertyId, // This links the property!
      PropertyContactId: propertyContactId, // This links the property contact!

      // Job-specific fields
      Fee: parseDollarAmount(jobData.Fee || jobData.AppraisalFee) || 0,
      Retainer:
        parseDollarAmount(jobData.Retainer || jobData.RetainerAmount) || 350.0,

      // Payment tracking
      AmountPaid: parseDollarAmount(jobData.AmountPaid || jobData.paymentAmount) || 0,
      PaidDate: jobData.paymentPaidDate ? jobData.paymentPaidDate.split("T")[0] : null,

      // Due Date - Valcre expects just date format like "2025-10-31"
      DueDate: jobData.DeliveryDate ? jobData.DeliveryDate.split("T")[0] : null,

      // Bid Date - Date proposal was submitted (format: "2025-10-01")
      BidDate: jobData.bidDate || new Date().toISOString().split("T")[0],

      // Scope and other LOE fields are set below after conversion mapping

      // Comments field for internal notes only
      Comments:
        jobData.InternalComments ||
        jobData.internalComments ||
        jobData.appraiserComments ||
        "",

      // Client-visible comments
      ClientComments:
        jobData.ClientComments || jobData.SpecialInstructions || "",

      // Delivery and Payment comments (new custom fields)
      DeliveryComments: jobData.deliveryComments || "",
      PaymentComments: jobData.paymentComments || "",
    };

    // ========== OPTIONAL LOE FIELD MAPPINGS ==========
    // These are OPTIONAL - if conversion fails, skip the field instead of blocking job creation

    // ReportFormat - Convert using map (e.g., "Appraisal Report" → "Appraisal")
    if (jobData.reportType || jobData.ReportType) {
      const rawValue = jobData.reportType || jobData.ReportType;
      const converted = REPORT_FORMAT_MAP[rawValue];
      if (converted && converted !== "Form") {
        // Skip "Form" - not a valid Valcre enum value
        jobCreateData.ReportFormat = converted;
      } else if (!converted) {
        console.log(
          `⚠️ WARNING: ReportType value "${rawValue}" not in REPORT_FORMAT_MAP, skipping`,
        );
      }
    }

    // Purposes - Convert using map (e.g., "Fee Simple Interest" → "FeeSimple")
    if (jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised) {
      const rawValue =
        jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised;
      const converted = PURPOSES_MAP[rawValue];
      if (converted) {
        jobCreateData.Purposes = converted;
      }
    }

    // RequestedValues - Convert using map (e.g., "As-Is" → "AsIs")
    if (jobData.valuationPremises || jobData.ValuationPremises) {
      const rawValue = jobData.valuationPremises || jobData.ValuationPremises;
      const converted = REQUESTED_VALUES_MAP[rawValue];
      console.log(`🟣 Valuation Premises: "${rawValue}" → "${converted}"`);
      if (converted) {
        jobCreateData.RequestedValues = converted;
      } else {
        console.log(
          `⚠️ WARNING: ValuationPremises value "${rawValue}" not in REQUESTED_VALUES_MAP, skipping`,
        );
      }
    }

    // Intended Use → Authorized Use field (IntendedUses)
    // NOTE: Valcre has BOTH "Scope" and "Authorized Use" (IntendedUses) fields
    // Dashboard "Intended Use" maps to "Authorized Use" (IntendedUses)
    if (jobData.intendedUse) {
      const converted = INTENDED_USES_MAP[jobData.intendedUse];
      console.log(`🟣 Intended Use: "${jobData.intendedUse}" → "${converted}"`);
      if (converted) {
        jobCreateData.IntendedUses = converted;
      } else {
        console.log(
          `⚠️ WARNING: Intended Use value "${jobData.intendedUse}" not in INTENDED_USES_MAP, skipping`,
        );
      }
    }

    // Scope of Work → Scopes field (Valcre API field name is "Scopes", not "ScopeOfWork"; multi-select Jun 2026)
    if (jobData.scopeOfWork || jobData.ScopeOfWork) {
      const rawValue = jobData.scopeOfWork || jobData.ScopeOfWork;
      const mappedScopes = rawValue
        .split(',')
        .map((v: string) => v.trim())
        .map((v: string) => {
          const mapped = SCOPE_OF_WORK_MAP[v];
          if (!mapped) {
            console.warn(`⚠️ WARNING: Scope of Work value "${v}" not in SCOPE_OF_WORK_MAP, skipping`);
          }
          return mapped;
        })
        .filter(Boolean);
      if (mappedScopes.length > 0) {
        jobCreateData.Scopes = mappedScopes.join(', ');
        console.log(`🟣 Scope of Work: "${rawValue}" → "${jobCreateData.Scopes}"`);
      } else {
        console.log(
          `⚠️ WARNING: No valid Scope of Work values mapped from "${rawValue}", skipping`,
        );
      }
    }

    // AnalysisLevel - Use mapping table
    if (jobData.analysisLevel && ANALYSIS_LEVEL_MAP[jobData.analysisLevel]) {
      jobCreateData.AnalysisLevel = ANALYSIS_LEVEL_MAP[jobData.analysisLevel];
    }

    // VALTA-FIELD-SPEC fields — stored as Valcre custom fields (v3.1 IDs 12407-12427, re-pointed 2026-06-05).
    // NOT in Valcre native Job schema — set via CustomFields/UpdateFieldValue after creation.
    // See setValtaCustomFields() call after successful job creation response.

    console.log(
      "Sending Job data to Valcre:",
      JSON.stringify(jobCreateData, null, 2),
    );

    const jobResponse = await fetch("https://api-core.valcre.com/api/v1/Jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobCreateData),
    });

    const responseText = await jobResponse.text();
    console.log("Valcre Job response status:", jobResponse.status);
    console.log("Valcre Job response:", responseText);

    // Parse response first to check for errors
    let createdJob: any;
    try {
      createdJob = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Valcre Job response:", responseText);
      throw new Error("Invalid response from Valcre");
    }

    // Check if Valcre returned an error (they return 200 with error in body!)
    if (
      createdJob.status === "400" ||
      createdJob.success === false ||
      createdJob.error
    ) {
      console.error("Valcre Job creation error:", createdJob);
      throw new Error(
        createdJob.error?.join
          ? createdJob.error.join(", ")
          : createdJob.message || "Job creation failed in Valcre",
      );
    }

    // Handle successful creation
    if (jobResponse.status === 201 || jobResponse.status === 200) {
      const valNumber =
        createdJob.Number || createdJob.number || createdJob.JobNumber;
      const jobId = createdJob.Id || createdJob.id;

      console.log("✅ Successfully created job!");
      console.log("✅ VAL Number:", valNumber);
      console.log("✅ Job ID:", jobId);

      // Set VALTA custom fields on the newly created job
      let customFieldResults = { success: 0, failed: 0, errors: [] as string[] };
      if (jobId) {
        const hasValtaFields = Object.keys(VALTA_CUSTOM_FIELD_IDS).some(
          (key) => jobData[key] !== undefined && jobData[key] !== null && jobData[key] !== "",
        );
        if (hasValtaFields) {
          console.log("Setting VALTA custom fields on new job...");
          customFieldResults = await setValtaCustomFields(token, jobId, jobData);
          console.log(
            `VALTA custom fields: ${customFieldResults.success} set, ${customFieldResults.failed} failed`,
          );
        }
      }

      if (valNumber) {
        return res
          .status(200)
          .setHeader("Access-Control-Allow-Origin", "*")
          .json({
            success: true,
            jobNumber: valNumber,
            jobId: jobId || valNumber,
            message: "Job created successfully in Valcre",
            valcreData: {
              id: jobId,
              number: valNumber,
              name: createdJob.Name,
              status: createdJob.Status || "Lead",
            },
            customFields: customFieldResults.success > 0 ? customFieldResults : undefined,
          });
      } else {
        // Job was created but no number returned - still success
        console.log("Job created but no VAL number in response:", createdJob);
        return res
          .status(200)
          .setHeader("Access-Control-Allow-Origin", "*")
          .json({
            success: true,
            jobNumber: jobId || "Check Valcre Dashboard",
            jobId: jobId,
            message: "Job created in Valcre (no VAL number yet)",
            details: createdJob,
          });
      }
    }

    // Handle error response
    let errorDetails;
    try {
      errorDetails = responseText
        ? JSON.parse(responseText)
        : "Empty error response";
    } catch {
      errorDetails = responseText || "Unknown error";
    }
    console.error("Job creation failed:", errorDetails);

    return res
      .status(jobResponse.status || 500)
      .setHeader("Access-Control-Allow-Origin", "*")
      .json({
        error: "Failed to create job",
        status: jobResponse.status,
        details: errorDetails,
      });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body was:", req.body);
    return res
      .status(500)
      .setHeader("Access-Control-Allow-Origin", "*")
      .json({
        error: "Internal server error",
        message: error.message || "Unknown error occurred",
        details: error.toString(),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
  }
}
