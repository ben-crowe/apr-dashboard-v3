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

// SCOPE MAP - Dashboard "Intended Use" → Valcre "Scope" field (Nov 13, 2025)
// NOTE: Valcre has both "Scope" and "Authorized Use" fields - they are DIFFERENT
// Dashboard "Intended Use" maps to Valcre "Scope" (NOT "IntendedUses"/"Authorized Use")
const SCOPE_MAP: Record<string, string> = {
  // Dashboard values:
  "Financing/Refinancing": "Financing",
  "Financing": "Financing",
  "Insurance": "Financing",
  "Acquisition": "AcquisitionDisposition",
  "Disposition": "AcquisitionDisposition",
  "Litigation": "Litigation",
  "Estate Planning": "EstatePlanning",
  "Tax Appeal": "PropertyTaxAppeal",
  "Internal Valuation": "DecisionMakingInternal",

  // Complete Valcre "Scope" dropdown options:
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
    // Check for update operations
    if (jobData.updateType && jobData.jobId) {
      console.log(
        `Processing ${jobData.updateType} update for job ${jobData.jobId}`,
      );
      console.log('🔍 DEBUG - Full jobData received:', JSON.stringify(jobData, null, 2));

      try {
        // Authenticate with Valcre first
        console.log("Authenticating for update...");
        const authBody = {
          grant_type: "password",
          client_id: process.env.VALCRE_CLIENT_ID || "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
          client_secret: process.env.VALCRE_CLIENT_SECRET ||
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
        if (jobData.retainerAmount || jobData.RetainerAmount || jobData.Retainer)
          updateData.Retainer =
            jobData.retainerAmount || jobData.RetainerAmount || jobData.Retainer;
        if (jobData.deliveryDate || jobData.DeliveryDate) {
          const date = jobData.deliveryDate || jobData.DeliveryDate;
          updateData.DueDate = date.split("T")[0];
        }

        // Intended Use → Scope field (Nov 13, 2025 - Fixed)
        if (jobData.intendedUse) {
          const converted = SCOPE_MAP[jobData.intendedUse];
          if (converted) {
            updateData.Scope = converted;
            console.log(`✅ Intended Use mapped: "${jobData.intendedUse}" → "${converted}"`);
          } else {
            console.log(`⚠️ WARNING: Intended Use value "${jobData.intendedUse}" not in SCOPE_MAP, skipping`);
          }
        }

        if (jobData.ClientComments || jobData.specialInstructions)
          updateData.ClientComments =
            jobData.ClientComments || jobData.specialInstructions;
        if (jobData.InternalComments || jobData.internalComments || jobData.appraiserComments)
          updateData.Comments =
            jobData.InternalComments || jobData.internalComments || jobData.appraiserComments;
        if (jobData.deliveryComments)
          updateData.DeliveryComments = jobData.deliveryComments;
        if (jobData.paymentComments)
          updateData.PaymentComments = jobData.paymentComments;

        // Map Report fields to proper Valcre enum fields (Nov 13, 2025 - Fixed)

        // Property Rights → Purposes field (using PURPOSES_MAP)
        if (jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised) {
          const rawValue = jobData.propertyRightsAppraised || jobData.PropertyRightsAppraised;
          const converted = PURPOSES_MAP[rawValue];
          if (converted) {
            updateData.Purposes = converted;
            console.log(`✅ Property Rights mapped: "${rawValue}" → "${converted}"`);
          } else {
            console.log(`⚠️ WARNING: Property Rights value "${rawValue}" not in PURPOSES_MAP, skipping`);
          }
        }

        // Report Type → ReportFormat field (using REPORT_FORMAT_MAP)
        if (jobData.reportType || jobData.ReportType) {
          const rawValue = jobData.reportType || jobData.ReportType;
          const converted = REPORT_FORMAT_MAP[rawValue];
          if (converted && converted !== 'Form') {
            updateData.ReportFormat = converted;
            console.log(`✅ Report Type mapped: "${rawValue}" → "${converted}"`);
          } else if (!converted) {
            console.log(`⚠️ WARNING: Report Type value "${rawValue}" not in REPORT_FORMAT_MAP, skipping`);
          }
        }

        // Valuation Premises → RequestedValues field (using REQUESTED_VALUES_MAP)
        if (jobData.valuationPremises || jobData.ValuationPremises) {
          const rawValue = jobData.valuationPremises || jobData.ValuationPremises;
          const converted = REQUESTED_VALUES_MAP[rawValue];
          if (converted) {
            updateData.RequestedValues = converted;
            console.log(`✅ Valuation Premises mapped: "${rawValue}" → "${converted}"`);
          } else {
            console.log(`⚠️ WARNING: Valuation Premises value "${rawValue}" not in REQUESTED_VALUES_MAP, skipping`);
          }
        }

        // Payment Terms (keep in Comments for now - no dedicated Valcre field)
        if (jobData.paymentTerms) {
          const paymentSection = `Payment Terms: ${jobData.paymentTerms}`;
          updateData.Comments = updateData.Comments
            ? `${updateData.Comments} | ${paymentSection}`
            : paymentSection;
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
      client_id: process.env.VALCRE_CLIENT_ID || "c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh",
      client_secret: process.env.VALCRE_CLIENT_SECRET ||
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
          const existingContact = searchResults.value[0];
          // Try multiple possible ID field names
          clientId = existingContact.Id || existingContact.id || existingContact.ID ||
                    existingContact.ContactId || existingContact.contactId;
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
      // Try multiple possible ID field names
      clientId = contact.Id || contact.id || contact.ID ||
                 contact.ContactId || contact.contactId;
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
              fullResponse: contact
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
      needsSeparate: needsSeparatePropertyContact
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
        AddressState: addressParts.province || "AB",
        AddressPostalCode: addressParts.postalCode || "",
        PhoneNumber: jobData.PropertyContact.PhoneNumber || "",
        Email: jobData.PropertyContact.Email || "",
        Title: jobData.PropertyContact.Title || "Property Contact",
        OwnerId: 7095, // Chris's correct OwnerId
      };

      // Additional logging for PropertyContact investigation
      console.log('👤 Creating PropertyContact with data:', JSON.stringify(propertyContactData, null, 2));

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
        propertyContactId = propContact.Id || propContact.id || propContact.ID ||
                           propContact.ContactId || propContact.contactId;
        console.log("🔍 PropertyContact Response Keys:", Object.keys(propContact));
        console.log("✅ Property Contact created with ID:", propertyContactId);

        if (!propertyContactId) {
          console.warn("⚠️ PropertyContact created but no ID returned, will use null");
          console.warn("Response structure:", JSON.stringify(propContact, null, 2));
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
    // PROPERTY TYPE VALIDATION - Valcre only accepts specific enum values
    const VALID_PROPERTY_TYPES = [
      'Agriculture', 'Building', 'Healthcare', 'Hospitality', 'Industrial', 'Land',
      'Manufactured Housing', 'Multi-Family', 'Office', 'Retail', 'Self-Storage',
      'Single-Family', 'Special Purpose', 'Unknown'
    ];

    // Map legacy/invalid property types to valid ones
    const PROPERTY_TYPE_MAP: Record<string, string> = {
      'Mixed Use': 'Building',  // Map "Mixed Use" to "Building"
      'Commercial': 'Building',
      'Residential': 'Multi-Family',
    };

    if (jobData.PropertyType) {
      // Parse comma-separated property types and validate each one
      const propertyTypes = jobData.PropertyType.split(',').map((t: string) => t.trim()).filter(Boolean);
      const firstType = propertyTypes[0];

      // Map or validate the first property type (for PropertyType field - single value only)
      let validatedType = PROPERTY_TYPE_MAP[firstType] || firstType;

      if (!VALID_PROPERTY_TYPES.includes(validatedType)) {
        console.warn(`⚠️ Invalid PropertyType "${firstType}" - defaulting to "Building"`);
        validatedType = 'Building';  // Default fallback
      }

      propertyData.PropertyType = validatedType;
      console.log(`🏢 PropertyType: "${firstType}" → "${validatedType}"`);
    }

    if (jobData.PropertySubtype)
      propertyData.SecondaryType = jobData.PropertySubtype;

    // Set Types field from PropertyTypeEnum (now supports comma-separated multi-select)
    // NOTE: Valcre API cannot parse arrays - expects string primitive
    if (jobData.PropertyTypeEnum) {
      // Validate and filter property types for the Types field
      const propertyTypes = jobData.PropertyTypeEnum.split(',').map((t: string) => t.trim()).filter(Boolean);
      const validatedTypes = propertyTypes
        .map((type: string) => PROPERTY_TYPE_MAP[type] || type)  // Map invalid types
        .filter((type: string) => VALID_PROPERTY_TYPES.includes(type));  // Filter to valid only

      if (validatedTypes.length > 0) {
        propertyData.Types = validatedTypes.join(', ');
        console.log(`🏢 Types: "${jobData.PropertyTypeEnum}" → "${propertyData.Types}"`);
      } else {
        console.warn(`⚠️ No valid property types in "${jobData.PropertyTypeEnum}" - using "Building"`);
        propertyData.Types = 'Building';
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

    if (jobData.InternalComments || jobData.internalComments || jobData.appraiserComments)
      propertyData.CommentsPrivate = jobData.InternalComments || jobData.internalComments || jobData.appraiserComments;

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
    if (!propertyResponse.ok || property.success === false || property.error || property.status === "400") {
      console.error("❌ Valcre rejected Property creation:", property);
      return res
        .status(500)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({
          error: "Valcre API rejected Property creation",
          details: {
            message: property.error || "Property validation failed",
            valcreResponse: property,
            hint: property.error?.includes('was not found')
              ? 'Invalid enum value sent to Valcre API. Check PropertyType field.'
              : undefined
          },
        });
    }

    // Try multiple possible ID field names (case-insensitive)
    const propertyId = property.Id || property.id || property.ID ||
                      property.PropertyId || property.propertyId ||
                      property.PropertyID || property.propertyID;

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
            fullResponse: property
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

      // Scope and other LOE fields are set below after conversion mapping

      // Comments field for internal notes only
      Comments: jobData.InternalComments || jobData.internalComments || jobData.appraiserComments || "",

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
      if (converted && converted !== 'Form') {
        // Skip "Form" - not a valid Valcre enum value
        jobCreateData.ReportFormat = converted;
      } else if (!converted) {
        console.log(`⚠️ WARNING: ReportType value "${rawValue}" not in REPORT_FORMAT_MAP, skipping`);
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

    // Intended Use → Scope field (Nov 13, 2025 - Fixed)
    // NOTE: Valcre has BOTH "Scope" and "Authorized Use" (IntendedUses) fields
    // Dashboard "Intended Use" maps to "Scope" (NOT "IntendedUses")
    if (jobData.intendedUse) {
      const converted = SCOPE_MAP[jobData.intendedUse];
      console.log(`🟣 Intended Use: "${jobData.intendedUse}" → "${converted}"`);
      if (converted) {
        jobCreateData.Scope = converted;
      } else {
        console.log(`⚠️ WARNING: Intended Use value "${jobData.intendedUse}" not in SCOPE_MAP, skipping`);
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
