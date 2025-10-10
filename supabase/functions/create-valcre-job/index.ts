import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ============================================
// LOE FIELD CAMELCASE CONVERSION MAPS
// Source: LOE-CAMELCASE-CONVERSION.md
// ============================================

const PURPOSES_MAP: Record<string, string> = {
  "Fee Simple Interest": "FeeSimple",
  "Leased Fee Interest": "LeasedFee",
  "Leasehold Interest": "Leasehold",
  "Undivided Interest": "UndividedInterest",
  "Partial Interest": "PartialInterest",
  Other: "Other",
};

const REQUESTED_VALUES_MAP: Record<string, string> = {
  "As-Is": "AsIs",
  "As Complete": "AsComplete",
  "Prospective at Stabilization": "ProspectiveStabilization",
  "Liquidation Value": "LiquidationValue",
  "Going Concern Value": "GoingConcernValue",
  "Investment Value": "InvestmentValue",
  Other: "Other",
};

const SCOPES_MAP: Record<string, string> = {
  "All Applicable": "AllApplicable",
  "Cost Approach": "CostApproach",
  "Income Approach": "IncomeApproach",
  "Sales Comparison Approach": "SalesComparisonApproach",
  "Land Value": "LandValue",
};

const REPORT_FORMAT_MAP: Record<string, string> = {
  "Appraisal Report": "Appraisal",
  "Restricted Appraisal Report": "RestrictedAppraisal",
  "Letter of Opinion": "LetterOfOpinion",
  "Desktop Review": "DesktopReview",
};

// IMPORTANT: These are the EXACT 11 values from Valcre UI (see AUTHORIZED-USE-MAPPING.md)
const INTENDED_USES_MAP: Record<string, string> = {
  // Dashboard value → Valcre API value
  'Financing/Refinancing': 'Financing',
  'Financing': 'Financing',
  'Acquisition': 'Acquisition/Disposition',
  'Disposition': 'Acquisition/Disposition',
  'Acquisition/Disposition': 'Acquisition/Disposition',
  'Consulting': 'Consulting',
  'Decision-Making/Internal': 'Decision-Making/Internal',
  'Internal Decision Making': 'Decision-Making/Internal',
  'Dispute Resolution': 'Dispute Resolution',
  'Divorce': 'Divorce',
  'Establish Sales Price': 'Establish Sales Price',
  'Estate Planning': 'Estate Planning',
  'Financial Reporting': 'Financial Reporting',
  'Litigation': 'Litigation',
  'Litigation Support': 'Litigation',
  'Other': 'Other'
};

// Conversion helper function
function convertToCamelCase(
  uiValue: string | undefined,
  fieldType: "purposes" | "values" | "scopes" | "format" | "uses",
): string | undefined {
  if (!uiValue) return undefined;

  const maps = {
    purposes: PURPOSES_MAP,
    values: REQUESTED_VALUES_MAP,
    scopes: SCOPES_MAP,
    format: REPORT_FORMAT_MAP,
    uses: INTENDED_USES_MAP,
  };

  return maps[fieldType][uiValue] || uiValue;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    // Parse the request body with better error handling
    let jobData;
    try {
      const body = await req.text();
      console.log("Raw request body:", body);

      if (!body) {
        throw new Error("Empty request body");
      }

      const parsed = JSON.parse(body);
      jobData = parsed.jobData;

      if (!jobData) {
        throw new Error("Missing jobData in request");
      }
    } catch (parseError) {
      console.error("Request parsing error:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: parseError.message,
          hint: 'Request should be: { "jobData": {...} }',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Received job data:", jobData);

    // Check if this is an update request for client & property info (Section 1)
    if (jobData.updateType === "client_property_info" && jobData.jobId) {
      console.log("Updating client & property info for job:", jobData.jobId);

      // For now, log what we would send to Valcre
      // These fields are already proven to work in job creation
      const clientPropertyUpdate = {
        // Client Information
        PropertyContact: {
          FirstName: jobData.clientFirstName,
          LastName: jobData.clientLastName,
          Company: jobData.clientOrganization,
          Email: jobData.clientEmail,
          PhoneNumber: jobData.clientPhone,
          Title: jobData.clientTitle,
          AddressStreet: jobData.clientAddress,
        },
        // Property Information
        Name: jobData.propertyName || jobData.propertyAddress,
        Comments: jobData.notes || "", // Only actual property notes, no field workarounds
        // IntendedUses is set below after conversion - DO NOT set here
        // Asset condition maps to InvestmentGrade (if provided)
        ...(jobData.assetCondition && {
          InvestmentGrade:
            jobData.assetCondition === "Excellent"
              ? "1"
              : jobData.assetCondition === "Very Good"
                ? "1"
                : jobData.assetCondition === "Good"
                  ? "2"
                  : jobData.assetCondition === "Average"
                    ? "3"
                    : jobData.assetCondition === "Fair"
                      ? "4"
                      : jobData.assetCondition === "Poor"
                        ? "5"
                        : null,
        }),
      };

      console.log(
        "Client/Property update payload:",
        JSON.stringify(clientPropertyUpdate, null, 2),
      );

      // TODO: Implement actual PATCH request to Valcre API
      // For now, return success to test the flow
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "Client & property info update logged (not yet sent to Valcre)",
          fields: clientPropertyUpdate,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if this is an update request for property research (Section 3B)
    if (jobData.updateType === "property_research" && jobData.jobId) {
      console.log("Updating property research data for job:", jobData.jobId);

      // For now, log what we would send to Valcre
      // These fields need to be tested against Valcre API
      const propertyUpdate = {
        // Section 3B - Property Site
        Zoning: jobData.zoningClassification,
        ZoningCode: jobData.zoneAbbreviation,
        LandUse: jobData.landUseDesignation,
        FloodZone: jobData.floodZone,
        Utilities: jobData.utilities,

        // Section 3B - Parcels Summary
        ParcelNumber: jobData.parcelNumber,
        LandArea: jobData.usableLandSf,
        GrossLandArea: jobData.grossLandSf,
        LandAreaAcres: jobData.usableLandAcres,
        GrossLandAreaAcres: jobData.grossLandAcres,

        // Section 3B - Assessments & Taxes
        AssessmentYear: jobData.assessmentYear,
        LandValue: jobData.landAssessmentValue,
        ImprovementValue: jobData.improvedAssessmentValue,
        AssessedValue: jobData.totalAssessmentValue,
        TaxAssessedValue: jobData.assessedValue,
        AnnualTaxes: jobData.taxes,
      };

      console.log(
        "Property update payload:",
        JSON.stringify(propertyUpdate, null, 2),
      );

      // TODO: Implement actual PATCH request to Valcre API
      // For now, return success to test the flow
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "Property research data update logged (not yet sent to Valcre)",
          fields: propertyUpdate,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if this is an update request for LOE details (Section 2)
    if (jobData.updateType === "loe_details" && jobData.jobId) {
      console.log("Updating LOE details for job:", jobData.jobId);

      // For now, log what we would send to Valcre
      const loeUpdate = {
        // Financial Details
        Fee: jobData.appraisalFee,
        Retainer: jobData.retainerAmount,
        DueDate: jobData.deliveryDate,

        // LOE fields - Converted below, DO NOT set raw values here
        // PropertyRights, RequestedValues, Scopes, ReportFormat are set after conversion

        // Actual comment fields
        ClientComments: jobData.specialInstructions || "",
        InternalNotes: jobData.internalComments || "",
      };

      console.log("LOE update payload:", JSON.stringify(loeUpdate, null, 2));

      // TODO: Implement actual PATCH request to Valcre API
      // For now, return success to test the flow
      return new Response(
        JSON.stringify({
          success: true,
          message: "LOE details update logged (not yet sent to Valcre)",
          fields: loeUpdate,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if this is an update request for building info (Section 3A)
    if (jobData.updateType === "building_info" && jobData.jobId) {
      console.log("Updating building info for job:", jobData.jobId);

      // For now, log what we would send to Valcre
      // These fields need to be tested against Valcre API
      const buildingUpdate = {
        // Section 3A - Building Information
        YearBuilt: jobData.yearBuilt,
        BuildingArea: jobData.buildingSize,
        Units: jobData.numberOfUnits,
        ParkingSpaces: jobData.parkingSpaces,
        LegalDescription: jobData.legalDescription,
      };

      console.log(
        "Building update payload:",
        JSON.stringify(buildingUpdate, null, 2),
      );

      // TODO: Implement actual PATCH request to Valcre API
      // For now, return success to test the flow
      return new Response(
        JSON.stringify({
          success: true,
          message: "Building info update logged (not yet sent to Valcre)",
          fields: buildingUpdate,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if this is a test submission
    const isTestSubmission =
      jobData.clientEmail &&
      (jobData.clientEmail.toLowerCase().includes("@test.com") ||
        jobData.clientEmail.toLowerCase().includes("test@") ||
        jobData.clientEmail.toLowerCase().includes("@example.com"));

    // REMOVED TEST MODE - We want real VAL numbers for testing
    // Test emails will still go through to Valcre to get proper VAL numbers

    console.log("Authenticating with Valcre...");

    // OAuth credentials
    const authBody = {
      grant_type: "password",
      client_id: "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
      client_secret:
        "6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ",
      username: "chris.chornohos@valta.ca",
      password: "Valvalta1!",
      scope: "offline_access",
      audience: "https://valcre.api.com",
    };

    // Get OAuth token
    const authResponse = await fetch("https://auth.valcre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authBody),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      console.log("Authentication failed:", errorData);
      return new Response(
        JSON.stringify({ error: "Authentication failed", details: errorData }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    console.log("✅ Authentication successful");

    // ============================================
    // STEP 1: CREATE CLIENT CONTACT
    // ============================================
    let clientId = null;

    if (jobData.clientFirstName && jobData.clientLastName) {
      console.log("📇 Creating client contact...");

      const contactData = {
        FirstName: jobData.clientFirstName,
        LastName: jobData.clientLastName,
        Company: jobData.clientCompany || jobData.clientOrganization,
        Email: jobData.clientEmail,
        PhoneNumber: jobData.clientPhone,
      };

      const contactResponse = await fetch(
        "https://api-core.valcre.com/api/v1/Contacts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        },
      );

      if (contactResponse.ok) {
        const contact = await contactResponse.json();
        clientId = contact.Id;
        console.log(
          `✅ Client contact created: ${contact.FirstName} ${contact.LastName} (ID: ${clientId})`,
        );
      } else {
        const errorText = await contactResponse.text();
        console.error("Client contact creation failed:", errorText);
      }
    }

    // ============================================
    // STEP 2: CREATE PROPERTY
    // ============================================
    let propertyId = null;

    if (jobData.propertyAddress && jobData.propertyCity) {
      console.log("🏢 Creating property...");

      const propertyData = {
        Name: jobData.propertyName || jobData.propertyAddress,
        AddressStreet: jobData.propertyAddress,
        AddressCity: jobData.propertyCity,
        AddressState: jobData.propertyState || jobData.propertyProvince,
        AddressPostalCode: jobData.propertyPostalCode || jobData.propertyZip,
        AddressCountry: jobData.propertyCountry || "Canada",
        Types: jobData.propertyType || "Office",
        ...(jobData.assetCondition && { Condition: jobData.assetCondition }),
      };

      const propertyResponse = await fetch(
        "https://api-core.valcre.com/api/v1/Properties",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyData),
        },
      );

      if (propertyResponse.ok) {
        const property = await propertyResponse.json();
        propertyId = property.Id;
        console.log(
          `✅ Property created: ${property.AddressStreet}, ${property.AddressCity} (ID: ${propertyId})`,
        );
      } else {
        const errorText = await propertyResponse.text();
        console.error("Property creation failed:", errorText);
      }
    }

    // ============================================
    // STEP 3: CREATE PROPERTY CONTACT (if provided)
    // ============================================
    let propertyContactId = null;

    if (jobData.propertyContactFirstName && jobData.propertyContactLastName) {
      console.log("📇 Creating property contact...");

      const propContactData = {
        FirstName: jobData.propertyContactFirstName,
        LastName: jobData.propertyContactLastName,
        Company: jobData.propertyContactCompany,
        Email: jobData.propertyContactEmail,
        PhoneNumber: jobData.propertyContactPhone,
        Title: jobData.propertyContactTitle,
      };

      const propContactResponse = await fetch(
        "https://api-core.valcre.com/api/v1/Contacts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propContactData),
        },
      );

      if (propContactResponse.ok) {
        const propContact = await propContactResponse.json();
        propertyContactId = propContact.Id;
        console.log(
          `✅ Property Contact created: ${propContact.FirstName} ${propContact.LastName} (ID: ${propertyContactId})`,
        );
      } else {
        const errorText = await propContactResponse.text();
        console.error("Property contact creation failed:", errorText);
      }
    }

    // ============================================
    // STEP 4: CREATE JOB WITH ALL FIELDS
    // ============================================
    console.log("📋 Creating job with all fields...");

    // Convert LOE fields from UI text to camelCase format
    const purposes = convertToCamelCase(
      jobData.propertyRightsAppraised,
      "purposes",
    );
    const requestedValues = convertToCamelCase(
      jobData.valuationPremises,
      "values",
    );
    const scopes = convertToCamelCase(jobData.scopeOfWork, "scopes");
    const reportFormat = convertToCamelCase(jobData.reportType, "format");
    const intendedUses = convertToCamelCase(jobData.intendedUse, "uses");

    console.log("🔍 CONVERSION DEBUG:");
    console.log("  Raw intendedUse from form:", jobData.intendedUse);
    console.log("  Converted intendedUses:", intendedUses);
    console.log("  Map lookup result:", INTENDED_USES_MAP[jobData.intendedUse || ""]);

    // Build job name from property address or name
    const jobName =
      jobData.propertyName ||
      `${jobData.propertyAddress}, ${jobData.propertyCity} ${jobData.propertyState || jobData.propertyProvince}`;

    const jobPayload = {
      Name: jobName,
      Status: "Lead",
      OwnerId: 7095, // Chris Chornohos

      // Link to created entities
      ...(propertyId && { PropertyId: propertyId }),
      ...(propertyContactId && { PropertyContactId: propertyContactId }),
      ...(clientId && { ClientId: clientId }),

      // Financial fields
      ...(jobData.appraisalFee && { Fee: parseFloat(jobData.appraisalFee) }),
      ...(jobData.retainerAmount && {
        Retainer: parseFloat(jobData.retainerAmount),
      }),
      ...(jobData.deliveryDate && { DueDate: jobData.deliveryDate }),

      // Set BidDate to today if not provided
      BidDate: jobData.bidDate || new Date().toISOString().split("T")[0],

      // LOE FIELDS - CREATION-ONLY (camelCase format)
      ...(purposes && { Purposes: purposes }),
      ...(requestedValues && { RequestedValues: requestedValues }),
      ...(scopes && { Scopes: scopes }),
      ...(reportFormat && { ReportFormat: reportFormat }),

      // LOE FIELDS - UPDATEABLE
      ...(intendedUses && { IntendedUses: intendedUses }),

      // Analysis Level
      AnalysisLevel: "Detailed",

      // Comments
      ...(jobData.specialInstructions && {
        ClientComments: jobData.specialInstructions,
      }),
      ...(jobData.internalComments && { Comments: jobData.internalComments }),
    };

    console.log("Sending to Valcre API:", JSON.stringify(jobPayload, null, 2));

    const jobResponse = await fetch("https://api-core.valcre.com/api/v1/Jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobPayload),
    });

    // Read response body once
    const responseText = await jobResponse.text();
    console.log("🔍 DEBUGGING VALCRE RESPONSE:");
    console.log("Status:", jobResponse.status);
    console.log("Headers:", Object.fromEntries(jobResponse.headers.entries()));
    console.log("Raw response:", responseText);
    console.log("Response length:", responseText?.length || 0);

    // Try to parse error details
    if (!jobResponse.ok) {
      try {
        const errorObj = JSON.parse(responseText);
        console.log("Valcre error object:", JSON.stringify(errorObj, null, 2));
        if (errorObj.error?.message) {
          console.log("Specific error:", errorObj.error.message);
        }
      } catch {
        console.log("Could not parse error as JSON");
      }
    }

    // Check for successful creation (201 or 200 status)
    if (jobResponse.status === 201 || jobResponse.status === 200) {
      console.log("Job created successfully with status:", jobResponse.status);
      try {
        const createdJob = JSON.parse(responseText);
        const valNumber = createdJob.Number || createdJob.number;
        const jobId = createdJob.Id || createdJob.id;

        console.log("✅ Successfully created job!");
        console.log("✅ VAL Number:", valNumber);
        console.log("✅ Job ID:", jobId);
        console.log("✅ Full response:", JSON.stringify(createdJob, null, 2));

        // Return the actual VAL number if we have it
        if (valNumber && valNumber.startsWith("VAL")) {
          return new Response(
            JSON.stringify({
              success: true,
              jobNumber: valNumber,
              jobId: jobId || valNumber,
              message: "Job created successfully in Valcre",
              valcreData: {
                id: jobId,
                number: valNumber,
                name: createdJob.Name,
                status: createdJob.Status || "Lead",
                propertyId: propertyId,
                clientId: clientId,
                propertyContactId: propertyContactId,
              },
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        } else {
          // No VAL number in response - log the issue
          console.error("No VAL number in Valcre response:", createdJob);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Valcre did not return a job number",
              details: createdJob,
              message: "Job may have been created - check Valcre dashboard",
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      } catch (parseErr) {
        console.error("Failed to parse successful response:", parseErr);
        // Even if parsing fails, return success since we got 201/200
        return new Response(
          JSON.stringify({
            success: true,
            jobNumber: `VAL-TEMP-${Date.now()}`,
            jobId: `VAL-TEMP-${Date.now()}`,
            message: "Job created in Valcre (parsing issue)",
            debug: responseText,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Handle other non-success statuses
    if (!jobResponse.ok && jobResponse.status !== 201) {
      let errorDetails;
      try {
        errorDetails = responseText
          ? JSON.parse(responseText)
          : "Empty error response";
      } catch {
        errorDetails = responseText || "Unknown error";
      }
      console.log("Job creation failed with status:", jobResponse.status);
      console.log("Error details:", errorDetails);
      return new Response(
        JSON.stringify({
          error: "Failed to create job",
          status: jobResponse.status,
          details: errorDetails,
        }),
        {
          status: jobResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let createdJob;
    try {
      if (!responseText) {
        throw new Error("Empty response from Valcre API");
      }

      createdJob = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("Failed to parse Valcre response:", parseErr);
      return new Response(
        JSON.stringify({
          error: "Invalid response from Valcre API",
          details: parseErr.message,
          response: responseText,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Job created successfully!");
    console.log("Response type:", typeof createdJob);
    console.log("Response keys:", Object.keys(createdJob || {}));
    console.log("Full response:", JSON.stringify(createdJob, null, 2));

    // Remove all the complex fallback logic - it's causing issues
    // If we didn't get a successful response, just fail cleanly

    // Try to extract job number and ID if we got a proper response
    const jobNumber =
      createdJob?.Number ||
      createdJob?.JobNumber ||
      createdJob?.jobNumber ||
      createdJob?.number;

    const jobId =
      createdJob?.Id || createdJob?.id || createdJob?.ID || createdJob?._id;

    if (jobNumber) {
      console.log("Successfully extracted Job Number:", jobNumber);
      console.log("Successfully extracted Job ID:", jobId);

      return new Response(
        JSON.stringify({
          success: true,
          jobNumber: jobNumber,
          jobId: jobId || jobNumber,
          job: createdJob,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // If we still don't have a job number, return with temporary reference
    const fallbackRef = `PENDING-${Date.now()}`;
    console.log("Could not extract job number, using fallback:", fallbackRef);

    return new Response(
      JSON.stringify({
        success: true,
        jobNumber: fallbackRef,
        jobId: fallbackRef,
        message: "Job submitted to Valcre. Check dashboard for VAL number.",
        debug: {
          responseKeys: Object.keys(createdJob || {}),
          rawResponse: createdJob,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
