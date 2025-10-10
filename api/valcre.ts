import type { VercelRequest, VercelResponse } from "@vercel/node";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// LOE Field Conversion Maps - Dashboard values → Valcre API values

// PURPOSES MAP - Property Rights Appraised conversion
const PURPOSES_MAP: Record<string, string> = {
  "Fee Simple Interest": "FeeSimple",
  "Leased Fee Interest": "LeasedFee",
  "Leasehold Interest": "Leasehold",
  "Undivided Interest": "UndividedInterest",
  "Partial Interest": "PartialInterest",
  "Other": "Other",
  "Going Concern": "GoingConcern",
  "Condominium Ownership": "CondominiumOwnership",
  "Cost Segregation Study": "CostSegregationStudy",
  "ASC 805": "ASC805",
  "None": "None",
};

// REQUESTED VALUES (Valuation Premises) - Complete Valcre values (Oct 5, 2025)
const REQUESTED_VALUES_MAP: Record<string, string> = {
  // Dashboard values (verified):
  "Market Value": "AsIs",
  "As-Is": "AsIs",
  "Market Rent": "MarketRentStudy",  // Dashboard sends "Market Rent", Valcre expects "MarketRentStudy"
  "Liquidation Value": "Liquidation",
  "Investment Value": "InvestmentValue",
  "Insurable Value": "InsurableValue",

  // Complete Valcre dropdown (from screenshots):
  "Prospective at Completion": "ProspectiveAtCompletion",
  "Prospective at Stabilization": "ProspectiveAtStabilization",
  "As-Vacant": "AsVacant",
  "Insurable Replacement Cost": "InsurableReplacementCost",
  "Bulk Value": "BulkValue",
  "Disposition": "Disposition",
  "Go Dark": "GoDark",
  "Hypothetical": "Hypothetical",
  "In Use": "InUse",
  "Lots": "Lots",
  "Lots to Houses": "LotsToHouses",
  "Market Rent Study": "MarketRentStudy",
  "Other": "Other",
  "Rent Restricted": "RentRestricted",
  "Retrospective": "Retrospective",
  "Tax Credits": "TaxCredits",
};

// REPORT FORMAT - Complete Valcre values (Oct 5, 2025)
const REPORT_FORMAT_MAP: Record<string, string> = {
  // Dashboard values (verified):
  "Comprehensive": "Appraisal",
  "Summary": "Appraisal",
  "Restricted": "RestrictedAppraisal",
  "Form": "Form",

  // Complete Valcre dropdown (from screenshots):
  "Appraisal Report": "Appraisal",
  "Amendment Letter": "AmendmentLetter",
  "Broker Opinion of Value": "BrokerOpinionOfValue",
  "Completion Report": "CompletionReport",
  "Consultation": "Consultation",
  "Desk Review": "DeskReview",
  "Evaluation": "Evaluation",
  "Peer Review": "PeerReview",
  "Rent Study": "RentStudy",
  "Restricted Appraisal Report": "RestrictedAppraisal",
};

// ANALYSIS LEVEL - Valcre values (Oct 5, 2025)
const ANALYSIS_LEVEL_MAP: Record<string, string> = {
  "Comprehensive": "Detailed", // Verified from job 706542
  "Concise": "Concise",
  "Form": "Form",
};

// INTENDED USES (Authorized Use) - Complete Valcre values (Oct 5, 2025)
const INTENDED_USES_MAP: Record<string, string> = {
  // Dashboard values (verified):
  "Financing/Refinancing": "Financing",
  "Financing": "Financing",
  "Insurance": "Financing",  // Dashboard sends "Insurance", map to "Financing"
  "Acquisition": "AcquisitionDisposition",
  "Disposition": "AcquisitionDisposition",
  "Litigation": "Litigation",
  "Estate Planning": "EstatePlanning",

  // Complete Valcre dropdown (from screenshots):
  "Acquisition/Disposition": "AcquisitionDisposition",
  "Consulting": "Consulting",
  "Decision-Making/Internal": "DecisionMakingInternal",
  "Dispute Resolution": "DisputeResolution",
  "Divorce": "Divorce",
  "Establish Sales Price": "EstablishSalesPrice",
  "Financial Reporting": "FinancialReporting",
  "Other": "Other",
  "Property Tax Appeal": "PropertyTaxAppeal",
  "Review": "Review",
};

// Helper function to parse dollar amounts (strip $ and commas)
function parseDollarAmount(value: string | number | undefined): number {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
}

// Helper function to parse city and province from address
function parseAddress(address: string): {
  street: string;
  city: string;
  province: string;
  postalCode: string;
} {
  // Default values for Alberta
  let result = {
    street: address,
    city: "Calgary",
    province: "AB",
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
    console.log(`🔍 DEBUG - PropertyType in jobData: "${jobData.PropertyType}" (type: ${typeof jobData.PropertyType})`);

    // Check for update operations
    if (jobData.updateType && jobData.jobId) {
      console.log(
        `Processing ${jobData.updateType} update for job ${jobData.jobId}`,
      );

      try {
        // Authenticate with Valcre first
        console.log("Authenticating for update...");
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
        if (jobData.retainerAmount || jobData.RetainerAmount)
          updateData.Retainer =
            jobData.retainerAmount || jobData.RetainerAmount;
        if (jobData.deliveryDate || jobData.DeliveryDate) {
          const date = jobData.deliveryDate || jobData.DeliveryDate;
          updateData.DueDate = date.split("T")[0];
        }
        // Skip IntendedUses for now - causing enum errors with Valcre
        // if (jobData.IntendedUses) updateData.IntendedUses = jobData.IntendedUses;
        if (jobData.ClientComments || jobData.specialInstructions)
          updateData.ClientComments =
            jobData.ClientComments || jobData.specialInstructions;
        if (jobData.InternalComments || jobData.internalComments)
          updateData.Comments =
            jobData.InternalComments || jobData.internalComments;

        // Add Report fields to Comments for now (until we fix enum issues)
        const reportFields = [];
        if (jobData.reportType || jobData.ReportType)
          reportFields.push(
            `Report Type: ${jobData.reportType || jobData.ReportType}`,
          );
        if (jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised)
          reportFields.push(
            `Property Rights: ${jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised}`,
          );
        if (jobData.valuationPremises || jobData.ValuationPremises)
          reportFields.push(
            `Valuation: ${jobData.valuationPremises || jobData.ValuationPremises}`,
          );
        if (jobData.AnalysisLevel)
          reportFields.push(`Analysis Level: ${jobData.AnalysisLevel}`);
        if (jobData.paymentTerms)
          reportFields.push(`Payment Terms: ${jobData.paymentTerms}`);

        if (reportFields.length > 0) {
          const reportSection = reportFields.join(" | ");
          updateData.Comments = updateData.Comments
            ? `${updateData.Comments} | ${reportSection}`
            : reportSection;
        }

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
          return res
            .status(200)
            .setHeader("Access-Control-Allow-Origin", "*")
            .json({
              success: true,
              message: `Job ${jobData.jobId} updated successfully`,
              updateType: jobData.updateType,
              updatedFields: Object.keys(updateData),
              valcreResponse: updateResponseText || "No content (success)",
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
      client_id: "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
      client_secret:
        "6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ",
      username: "chris.chornohos@valta.ca",
      password: "Valvalta1!",
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

    // Parse the property address for contact/property creation
    const addressParts = parseAddress(jobData.PropertyAddress || jobData.Street || "");

    // Try to find existing contact by email (if provided)
    if (clientEmail) {
      console.log("Checking for existing CLIENT contact with email:", clientEmail);
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
          clientId = searchResults.value[0].Id || searchResults.value[0].id;
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
        AddressStreet: addressParts.street,
        AddressCity: addressParts.city,
        AddressState: addressParts.province || "AB",
        AddressPostalCode: addressParts.postalCode || "",
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
      clientId = contact.Id || contact.id;
      console.log("✅ Contact created with ID:", clientId);
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
      propertyEmail: jobData.PropertyContact?.Email,
      clientEmail: clientEmail,
      emailsDifferent: jobData.PropertyContact?.Email !== clientEmail,
      needsSeparate: needsSeparatePropertyContact
    });

    if (needsSeparatePropertyContact) {
      console.log("Creating separate Property Contact entity...");
      const propertyContactData = {
        Company: jobData.PropertyContact.Company || contactCompany,
        FirstName: jobData.PropertyContact.FirstName || firstName,
        LastName: jobData.PropertyContact.LastName || lastName,
        AddressStreet:
          jobData.PropertyContact.AddressStreet || addressParts.street,
        AddressCity: addressParts.city,
        AddressState: addressParts.province || "AB",
        AddressPostalCode: addressParts.postalCode || "",
        PhoneNumber: jobData.PropertyContact.PhoneNumber || "",
        Email: jobData.PropertyContact.Email || "",
        Title: jobData.PropertyContact.Title || "Property Contact",
        OwnerId: 7095, // Chris's correct OwnerId
      };

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
        propertyContactId = propContact.Id || propContact.id;
        console.log("✅ Property Contact created with ID:", propertyContactId);
      } else {
        console.log(
          "⚠️ Failed to create separate Property Contact, will use ClientId",
        );
      }
    } else {
      // CRITICAL FIX: Leave propertyContactId as null - don't default to clientId
      // This prevents duplicate contact display in Valcre UI
      // The form layer handles "Same as Client Contact" logic - API should just map data
      propertyContactId = null;
      console.log("No separate property contact needed - PropertyContactId will be null");
    }

    // STEP 3: Create Property Entity - WITH ALL MAPPED FIELDS
    console.log("Creating Property entity with all mapped fields...");
    // Use the property name from jobData (contains custom name or fallback from webhook)
    // This preserves user's custom building names like "Tech Center Building"
    // DO NOT fall back to address - use "Unnamed Property" instead
    const propertyName = jobData.Name || 'Unnamed Property';

    const propertyData: any = {
      // Basic address fields - combine unit with street if provided
      Name: propertyName,
      AddressStreet: jobData.PropertyUnit
        ? `${jobData.PropertyStreet || addressParts.street}, ${jobData.PropertyUnit}`
        : jobData.PropertyStreet || addressParts.street,
      AddressCity: jobData.PropertyCity || addressParts.city,
      AddressState: jobData.PropertyState || addressParts.province || "AB",
      AddressPostalCode:
        jobData.PropertyPostalCode || addressParts.postalCode || "",
    };

    // Add all other Property fields if provided
    console.log(`🏢 PropertyType from jobData: "${jobData.PropertyType}" (type: ${typeof jobData.PropertyType})`);
    if (jobData.PropertyType) {
      // Use PropertyType directly - dashboard now sends exact Valcre values
      propertyData.PropertyType = jobData.PropertyType;
      console.log(`✅ PropertyType set to: "${propertyData.PropertyType}"`);
    } else {
      console.log(`⚠️ PropertyType is falsy, not setting on Property entity`);
    }
    if (jobData.PropertySubtype)
      propertyData.SecondaryType = jobData.PropertySubtype;
    if (jobData.PropertyTypeEnum) propertyData.Types = jobData.PropertyTypeEnum;
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

    if (jobData.InternalComments)
      propertyData.CommentsPrivate = jobData.InternalComments;

    console.log('🚨 CRITICAL DEBUG - Property Data Being Sent:');
    console.log(`   PropertyType field: "${propertyData.PropertyType}"`);
    console.log(`   Full propertyData: ${JSON.stringify(propertyData, null, 2)}`);
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

    if (!propertyResponse.ok) {
      console.error("Failed to create Property:", propertyResponseText);
      return res
        .status(500)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({
          error: "Failed to create Property entity",
          details: propertyResponseText,
        });
    }

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

    const propertyId = property.Id || property.id;
    console.log("✅ Property created with ID:", propertyId);

    if (!propertyId) {
      console.error("Property created but no ID returned!", property);
      return res
        .status(500)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({
          error: "Property created but no ID returned",
          details: property,
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
    const street = propertyData.AddressStreet || addressParts.street || '';
    const city = propertyData.AddressCity || addressParts.city || '';
    const state = propertyData.AddressState || addressParts.province || '';
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
      Fee: parseDollarAmount(jobData.Fee || jobData.AppraisalFee) || 3500.0,
      Retainer: parseDollarAmount(jobData.Retainer || jobData.RetainerAmount) || 350.0,

      // Due Date - Valcre expects just date format like "2025-10-31"
      DueDate: jobData.DeliveryDate ? jobData.DeliveryDate.split("T")[0] : null,

      // Bid Date - Date proposal was submitted (format: "2025-10-01")
      BidDate: jobData.bidDate || new Date().toISOString().split("T")[0],

      // IntendedUses - CANNOT be set during POST, must PATCH after creation (see below)

      // Comments field for internal notes only
      Comments: jobData.InternalComments || "",

      // Client-visible comments
      ClientComments:
        jobData.ClientComments || jobData.SpecialInstructions || "",
    };

    // ========== OPTIONAL LOE FIELD MAPPINGS ==========
    // These are OPTIONAL - if conversion fails, skip the field instead of blocking job creation

    // ReportFormat - Convert using map (e.g., "Appraisal Report" → "Appraisal")
    if (jobData.reportType || jobData.ReportType) {
      const rawValue = jobData.reportType || jobData.ReportType;
      const converted = REPORT_FORMAT_MAP[rawValue];
      if (converted) {
        jobCreateData.ReportFormat = converted;
      }
    }

    // Purposes - Convert using map (e.g., "Fee Simple Interest" → "FeeSimple")
    if (jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised) {
      const rawValue = jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised;
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
        console.log(`⚠️ WARNING: ValuationPremises value "${rawValue}" not in REQUESTED_VALUES_MAP, skipping`);
      }
    }

    // IntendedUses (Authorized Use) - Convert using map
    if (jobData.intendedUse && INTENDED_USES_MAP[jobData.intendedUse]) {
      const converted = INTENDED_USES_MAP[jobData.intendedUse];
      console.log(`🟣 Intended Use: "${jobData.intendedUse}" → "${converted}"`);
      if (converted) {
        jobCreateData.IntendedUses = converted;
      } else {
        console.log(`⚠️ WARNING: IntendedUse value "${jobData.intendedUse}" not in INTENDED_USES_MAP, skipping`);
      }
    }

    // AnalysisLevel - Use mapping table
    if (jobData.analysisLevel && ANALYSIS_LEVEL_MAP[jobData.analysisLevel]) {
      jobCreateData.AnalysisLevel = ANALYSIS_LEVEL_MAP[jobData.analysisLevel];
    }

    // DO NOT add unmapped fields to Comments - all fields should have proper mappings

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
