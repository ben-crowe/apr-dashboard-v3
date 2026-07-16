import { describe, it, expect } from "vitest";
import {
  mapJobToDocuSealFields,
  deriveContractBoundJobFields,
  CONTRACT_BOUND_JOB_FIELDS,
  isContractBoundField,
} from "./docuseal";
import type { DetailJob, JobDetails } from "@/types/job";

// Item 8 anti-drift gate. The "in LOE" chip is DERIVED from the jobField metadata on
// mapJobToDocuSealFields — this test pins that derived set to the agreed contract-bound fields, so any
// future edit to the mapping that adds/removes a jobField (and forgets the chip, or leaves a stale one)
// FAILS the build until the set and this list are reconciled. That is what makes "the chip follows the
// mapping" real and falsifiable.

// The agreed contract-bound job-page fields (coarch2 ruling 2026-07-16). 18 fields = 18 chips. Only
// client_name is a composite (clientFirstName + clientLastName → two chipped inputs). The LOE `notes`
// field falls back to specialInstructions in code, but its chip-backing field is `notes` (the Client
// Comments input); specialInstructions has NO on-page field, so it is not a chip-able field and is not
// in this set — that is what lets the build-time drift gate assert chip set === derived set.
const EXPECTED_CONTRACT_BOUND_FIELDS = [
  // Client identity + contact
  "clientOrganization",
  "clientAddress",
  "clientFirstName",
  "clientLastName",
  "clientPhone",
  "clientTitle",
  "clientEmail",
  // Property + client comments (LOE `notes` chip-backs the Client Comments input)
  "notes",
  "propertyAddress",
  "scopeOfWork",
  // Job / financial
  "jobNumber",
  "appraisalFee",
  "retainerAmount",
  // Contract-template selects that have a real job-page input
  "propertyType",
  "intendedUse",
  "valuationPremises",
  "propertyRightsAppraised",
  "reportType",
].sort();

describe("Item 8 — contract-bound field marker (single source of truth)", () => {
  it("derived contract-bound set equals the agreed set (chip follows the mapping)", () => {
    const derived = [...deriveContractBoundJobFields()].sort();
    expect(derived).toEqual(EXPECTED_CONTRACT_BOUND_FIELDS);
    // The exported constant is the same derived set the chip reads.
    expect([...CONTRACT_BOUND_JOB_FIELDS].sort()).toEqual(EXPECTED_CONTRACT_BOUND_FIELDS);
  });

  it("every expected field reports as contract-bound", () => {
    for (const field of EXPECTED_CONTRACT_BOUND_FIELDS) {
      expect(isContractBoundField(field)).toBe(true);
    }
  });

  it("template-only selects with no job-page input are NOT marked", () => {
    // Payment Terms field was removed 2026-06-19; Report Delivery has no job-details input (it lives
    // only in the separate DocumentBuilder). They carry no jobField in the mapping, so they must NOT
    // appear in the derived set — otherwise a chip would be promised with no field to attach it to.
    expect(isContractBoundField("paymentTerms")).toBe(false);
    expect(isContractBoundField("reportDelivery")).toBe(false);
  });

  it("auto/signature fields (not job-page inputs) are NOT marked", () => {
    expect(isContractBoundField("date_created")).toBe(false);
    expect(isContractBoundField("date_signed")).toBe(false);
    expect(isContractBoundField("client_signature")).toBe(false);
  });

  it("the additive jobField metadata does not change the contract output (value) of any field", () => {
    // Same job/jobDetails → the {name, value} the DocuSeal submission reads is unchanged. We assert the
    // value shape for a representative sample; jobField/jobFields are extra props the submitter ignores.
    const job = {
      clientOrganization: "Acme Holdings",
      clientFirstName: "Sarah",
      clientLastName: "Mitchell",
      clientEmail: "s@acme.com",
      propertyAddress: "123 Main St",
    } as unknown as DetailJob;
    const jobDetails = { scopeOfWork: "Income Approach", appraisalFee: 5000 } as unknown as JobDetails;
    const byName = Object.fromEntries(
      mapJobToDocuSealFields(job, jobDetails).map((e) => [e.name, e.value]),
    );
    expect(byName["company_name"]).toBe("Acme Holdings");
    expect(byName["client_name"]).toBe("Sarah Mitchell");
    expect(byName["client_email"]).toBe("s@acme.com");
    expect(byName["property_address"]).toBe("123 Main St");
    expect(byName["scope_of_work"]).toBe("Income Approach");
    expect(byName["appraisal_fee"]).toBe(5000);
    // Selects still send empty value (no overlay bleed) even though they're contract-bound.
    expect(byName["property_type"]).toBe("");
    expect(byName["report_type"]).toBe("");
  });
});
