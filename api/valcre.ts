import type { VercelRequest, VercelResponse } from "@vercel/node";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// LOE Field Conversion Maps - Dashboard values → Valcre API values

// PURPOSES MAP - Property Rights Appraised conversion
// Maps Dashboard "Property Rights" field → Valcre "Purpose" field (Nov 13, 2025)
const PURPOSES_MAP: Record<string, string> = {
  "Fee Simple Interest": "FeeSimple",
  "Leased Fee Interest": "LeasedFee",
  "Leasehold Interest": "Leasehold",
  "Undivided Interest": "UndividedInterest",
  "Partial Interest": "PartialInterest",
  "Partial Interest Taking": "PartialInterestTaking",
  "Total Taking": "TotalTaking",
  "Rent Restricted": "RentRestricted",
  "Market Study": "MarketStudy",
  Other: "Other",
  "Going Concern": "GoingConcern",
  "Condominium Ownership": "CondominiumOwnership",
  "Cost Segregation Study": "CostSegregationStudy",
  "ASC 805": "ASC805",
  None: "None",
};

// REQUESTED VALUES (Valuation Premises) - Complete Valcre values (Nov 13, 2025 - Updated)
const REQUESTED_VALUES_MAP: Record<string, string> = {
  // Dashboard values (verified against Valcre dropdown):
  "Market Value": "AsIs",
  "As-Is": "AsIs",
  "Market Rent": "MarketRentStudy",
  "Liquidation Value": "Liquidation",
  "Investment Value": "ProspectiveAtStabilization", // No direct "Investment Value" in Valcre - using "Prospective at Stabilization" (what investors care about)
  "Insurable Value": "InsurableReplacementCost", // Fixed: was "InsurableValue" (doesn't exist)

  // Complete Valcre dropdown (from screenshots):
  "Prospective at Completion": "ProspectiveAtCompletion",
  "Prospective at Stabilization": "ProspectiveAtStabilization",
  "As-Vacant": "AsVacant",
  "Insurable Replacement Cost": "InsurableReplacementCost",
  "Bulk Value": "BulkValue",
  Disposition: "Disposition",
  "Go Dark": "GoDark",
  Hypothetical: "Hypothetical",
  "In Use": "InUse",
  Lots: "Lots",
  "Lots to Houses": "LotsToHouses",
  "Market Rent Study": "MarketRentStudy",
  Other: "Other",
  "Rent Restricted": "RentRestricted",
  Retrospective: "Retrospective",
  "Tax Credits": "TaxCredits",
};

// REPORT FORMAT - Complete Valcre values (Oct 5, 2025)
const REPORT_FORMAT_MAP: Record<string, string> = {
  // Dashboard values (verified):
  Comprehensive: "Appraisal",
  Summary: "Appraisal",
  Restricted: "RestrictedAppraisal",
  Form: "Form",

  // Complete Valcre dropdown (from screenshots):
  "Appraisal Report": "Appraisal",
  "Amendment Letter": "AmendmentLetter",
  "Broker Opinion of Value": "BrokerOpinionOfValue",
  "Completion Report": "CompletionReport",
  Consultation: "Consultation",
  "Desk Review": "DeskReview",
  Evaluation: "Evaluation",
  "Peer Review": "PeerReview",
  "Rent Study": "RentStudy",
  "Restricted Appraisal Report": "RestrictedAppraisal",
};

// ANALYSIS LEVEL - Valcre values (Oct 5, 2025)
const ANALYSIS_LEVEL_MAP: Record<string, string> = {
  Comprehensive: "Detailed", // Verified from job 706542
  Concise: "Concise",
  Form: "Form",
};

// SCOPE OF WORK MAP - Dashboard "Scope of Work" → Valcre "Scope" field (Nov 13, 2025)
const SCOPE_OF_WORK_MAP: Record<string, string> = {
  "All Applicable": "AllApplicable",
  "Best One Approach": "BestOneApproach",
  "Best Two Approaches": "BestTwoApproaches",
  "Cost Approach": "CostApproach",
  "Direct Comparison Approach": "DirectComparisonApproach",
  "Discounted Cash Flow": "DiscountedCashFlow",
  "Feasibility Study": "FeasibilityStudy",
  "Income Approach": "IncomeApproach",
  "Land Value": "LandValue",
  Litigation: "Litigation",
  "Market Research": "MarketResearch",
  "Market Study": "MarketStudy",
  "Net Rent Review": "NetRentReview",
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
  Divorce: "Divorce",
  "Establish Sales Price": "EstablishSalesPrice",
  Other: "Other",
  "Property Tax Appeal": "PropertyTaxAppeal",
  Review: "Review",
};

// VALTA Custom Field IDs — created 2026-03-30 via POST /api/v1/CustomFields
// These are Job-level custom fields visible in Valcre's custom fields section
const VALTA_CUSTOM_FIELD_IDS: Record<string, number> = {
  tenancy: 12042,
  stateOfImprovements: 12043,
  statusOfImprovements: 12044,
  propertySubtype: 12045,
  landMetric: 12046,
  // 12047 environmentalAssessment, 12048 heritageConservation, 12050 desktopReport REMOVED —
  // these IDs do NOT exist on the tenant (verified live API + admin screenshot 2026-06-03); writes silently 400'd.
  assignmentType: 12049,
  valueTimeframe: 12051,
  approachesToValue: 12052,
  transactionStatus: 12053,
  zoningStatus: 12054,
};

// Custom field types and AvailableValue IDs for dropdown fields
// AvailableValueIds map: dashboard display value → Valcre AvailableValue ID
const VALTA_FIELD_CONFIG: Record<
  string,
  { type: string; options?: Record<string, number> }
> = {
  tenancy: {
    type: "SingleOption",
    options: {
      "Multi-Tenant": 5949, "Single-Tenant": 5950, "Owner-Occupied": 5951,
      "Partial Owner Occupied": 5952, "Vacant": 5953, "Unknown": 5954,
    },
  },
  stateOfImprovements: {
    type: "SingleOption",
    options: { "Proposed": 5955, "Under Construction": 5956, "Complete": 5957 },
  },
  statusOfImprovements: {
    type: "SingleOption",
    options: { "As Is": 5958, "As Complete": 5959, "As Stabilized": 5960, "As Proposed": 5961 },
  },
  propertySubtype: {
    type: "SingleOption",
    options: {
      "Low-Rise": 5962, "Mid-Rise": 5963, "High-Rise": 5964, "Garden": 5965,
      "Walk-Up": 5966, "Townhouse": 5967, "Mixed-Use": 5968,
    },
  },
  landMetric: {
    type: "SingleOption",
    options: { "Square Feet": 5969, "Acres": 5970, "Hectares": 5971 },
  },
  assignmentType: {
    type: "SingleOption",
    options: { "Standard": 5972, "Update": 5973, "Retrospective": 5974, "Desktop": 5975 },
  },
  valueTimeframe: {
    type: "SingleOption",
    options: { "Current": 5976, "Retrospective": 5977, "Prospective": 5978 },
  },
  approachesToValue: {
    type: "MultiOption",
    options: {
      "All Applicable": 5979, "Cost Approach": 5980, "Direct Comparison": 5981,
      "Income Approach": 5982, "Cost + Direct Comparison": 5983,
      "Cost + Income": 5984, "Direct Comparison + Income": 5985,
    },
  },
  transactionStatus: {
    type: "SingleOption",
    options: {
      "Arms Length": 5986, "Arm's Length": 5986, // Handle both apostrophe variants
      "Non-Arms Length": 5987, "Non-Arm's Length": 5987,
      "Listing": 5988, "Under Contract": 5989, "REO/Bank Sale": 5990,
    },
  },
  zoningStatus: {
    type: "SingleOption",
    options: {
      "Legal Conforming": 5991, "Legal Non-Conforming": 5992,
      "Illegal": 5993, "No Zoning": 5994,
    },
  },
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

// Confirm a single-option custom field holds the expected AvailableValueId (tolerant of shape/casing variants).
function customFieldHasValue(values: any[], fieldId: number, expectedValueId: number): boolean {
  const item = values.find(
    (v) => (v?.CustomFieldId ?? v?.customFieldId ?? v?.FieldId) === fieldId,
  );
  if (!item) return false;
  const av = item.AvailableValueId ?? item.availableValueId ?? item.SelectedAvailableValueId;
  if (av === expectedValueId) return true;
  const sel = String(item.SelectedIds ?? item.selectedIds ?? "")
    .split(",")
    .map((s) => s.trim());
  return sel.includes(String(expectedValueId));
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

        // Intended Use → Authorized Use field (IntendedUses)
        if (jobData.intendedUse) {
          const converted = INTENDED_USES_MAP[jobData.intendedUse];
          if (converted) {
            updateData.IntendedUses = converted;
            console.log(
              `✅ Intended Use mapped: "${jobData.intendedUse}" → "${converted}"`,
            );
          } else {
            console.log(
              `⚠️ WARNING: Intended Use value "${jobData.intendedUse}" not in INTENDED_USES_MAP, skipping`,
            );
          }
        }

        // Authorized Use → Job.IntendedUses (AUTO-SYNC-WIRING-MAP 2026-06-04). Same native target as
        // intendedUse (last-writer-wins). INTENDED_USES_MAP keys only — non-key values silently skip (gotcha b).
        if (jobData.authorizedUse) {
          const converted = INTENDED_USES_MAP[jobData.authorizedUse];
          if (converted) {
            updateData.IntendedUses = converted;
            console.log(`✅ Authorized Use mapped: "${jobData.authorizedUse}" → "${converted}"`);
          } else {
            console.log(`⚠️ WARNING: Authorized Use value "${jobData.authorizedUse}" not in INTENDED_USES_MAP, skipping`);
          }
        }

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

        // Scope of Work → ScopeOfWork field (Nov 13, 2025 - Added)
        if (jobData.scopeOfWork || jobData.ScopeOfWork) {
          const rawValue = jobData.scopeOfWork || jobData.ScopeOfWork;
          const converted = SCOPE_OF_WORK_MAP[rawValue];
          if (converted) {
            updateData.Scopes = converted;
            console.log(
              `✅ Scope of Work mapped: "${rawValue}" → "${converted}"`,
            );
          } else {
            console.log(
              `⚠️ WARNING: Scope of Work value "${rawValue}" not in SCOPE_OF_WORK_MAP, skipping`,
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
          const rawValue =
            jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised;
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

        // VALTA-FIELD-SPEC fields — stored as Valcre custom fields (IDs 12042-12054).
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

          // Value Scenarios → CF11563 (Premise-1) / CF11564 (Premise-2). MANUAL mapping, verified values
          // only (AUTO-SYNC-WIRING-MAP 2026-06-04 — no cascade built). Each write is readback-verified.
          if (jobData.valueScenarios) {
            const scenarios = String(jobData.valueScenarios)
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
            for (const sc of scenarios) {
              const m = VALUE_SCENARIO_PREMISE_MAP[sc];
              if (!m) {
                console.log(`  Value Scenario "${sc}": no verified Valcre option — skipped (needs QA verification)`);
                continue;
              }
              try {
                const resp = await fetch(
                  `https://api-core.valcre.com/api/v1/CustomFields/UpdateSelectFieldValue`,
                  {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ EntityId: jobData.jobId, CustomFieldId: m.fieldId, AvailableValueId: m.valueId }),
                  },
                );
                const vals = await getJobCustomFieldValues(token, jobData.jobId);
                if ((resp.ok || resp.status === 204) && customFieldHasValue(vals, m.fieldId, m.valueId)) {
                  console.log(`  Value Scenario "${sc}" → CF${m.fieldId}=${m.valueId}: VERIFIED (readback)`);
                  customFieldResults.success++;
                } else {
                  console.error(`  Value Scenario "${sc}" → CF${m.fieldId}: HTTP ${resp.status} but READBACK FAILED`);
                  customFieldResults.errors.push(`valueScenario ${sc}: readback failed`);
                  customFieldResults.failed++;
                }
              } catch (e: any) {
                console.error(`  Value Scenario "${sc}" ERROR: ${e.message}`);
                customFieldResults.errors.push(`valueScenario ${sc}: ${e.message}`);
                customFieldResults.failed++;
              }
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
    const clientFullName = jobData.ClientName || "Client Contact";
    const [clientFirstName, ...clientLastParts] = clientFullName.split(" ");
    const clientLastName = clientLastParts.join(" ") || "Contact";

    const clientEmail = jobData.ClientEmail || "";
    const contactCompany = jobData.ClientCompany || "Direct Client";

    // Parse the property address for property creation
    const addressParts = parseAddress(
      jobData.PropertyAddress || jobData.Street || "",
    );

    // Parse the client address separately for contact creation
    // Falls back to property address if no client address provided
    const clientAddressParts = jobData.ClientAddress
      ? parseAddress(jobData.ClientAddress)
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
        PhoneNumber: jobData.ClientPhone || "",
        Email: clientEmail,
        Title: jobData.ClientTitle || "Client",
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
    };

    // TYPES FIELD CONVERSION - Dashboard values → Valcre Types field values
    // Based on empirical test data from actual Valcre jobs (test-valcre-property-types.ts)
    // The Types field uses PascalCase: "MultiFamily", "HealthCare", etc.
    const TYPES_FIELD_MAP: Record<string, string> = {
      'Multi-Family': 'MultiFamily',
      'Single-Family': 'SingleFamily',
      'Self-Storage': 'SelfStorage',
      'Manufactured Housing': 'ManufacturedHousing',
      'Special Purpose': 'SpecialPurpose',
      'Healthcare': 'HealthCare', // "HealthCare" with capital C
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

    // Scope of Work → Scopes field (Valcre API field name is "Scopes", not "ScopeOfWork")
    if (jobData.scopeOfWork || jobData.ScopeOfWork) {
      const rawValue = jobData.scopeOfWork || jobData.ScopeOfWork;
      const converted = SCOPE_OF_WORK_MAP[rawValue];
      console.log(`🟣 Scope of Work: "${rawValue}" → "${converted}"`);
      if (converted) {
        jobCreateData.Scopes = converted;
      } else {
        console.log(
          `⚠️ WARNING: Scope of Work value "${rawValue}" not in SCOPE_OF_WORK_MAP, skipping`,
        );
      }
    }

    // AnalysisLevel - Use mapping table
    if (jobData.analysisLevel && ANALYSIS_LEVEL_MAP[jobData.analysisLevel]) {
      jobCreateData.AnalysisLevel = ANALYSIS_LEVEL_MAP[jobData.analysisLevel];
    }

    // VALTA-FIELD-SPEC fields — stored as Valcre custom fields (IDs 12042-12054).
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
