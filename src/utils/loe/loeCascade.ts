/**
 * LOE Section 10 cascade + narrative library — SHARED SOURCE.
 *
 * Source of truth: Valta Master Field Registry v3.1 (client "v03"), 2026-06-05.
 *   client-source/Valta-Master-Field-Registry-v3.1-2026-06-05.xlsx
 *   - STATUS_TO_SCENARIOS  ← TBD tab, Rule Set "200-Scenario" (rules R011–R022)
 *   - INSURANCE override   ← R023 (AuthorizedUse = Insurance → Set Value, replaces)
 *   - NARRATIVES           ← "EA-HC Text" tab (Summary / EADetail / HCDetail per scenario)
 *
 * v3.1 REALIGNMENT (2026-06-05) — the critical fix:
 *   Keys moved from the legacy "Existing -" prefixes to the v03 "Improved -" prefixes
 *   (+ the new "Improved - Proposed Renovation"). The cascade is EXACT-STRING keyed, so under
 *   the old keys it silently never fired for improved properties — that was the §10-blank bug.
 *
 * Name-normalization note [FLAG → Chris]:
 *   The TBD rules emit shorthand scenario names ("As Is", "As If Vacant"); the canonical
 *   ListValueScenarios option set + the EA-HC Text library use the full names ("As-Is",
 *   "As If Vacant Land"). We output the CANONICAL names so the narrative lookup resolves.
 *   Confirm with Chris that the rules' shorthand is just spreadsheet abbreviation, not a
 *   distinct value.
 *
 * Two mechanisms:
 *  1. Status of Improvements → ordered Value Scenarios (the LEFT column of §10).
 *  2. Value Scenario → matching narrative text (the RIGHT column), exact scenario-name match.
 */

// Status of Improvements → ordered Value Scenarios. Keys = v03 StatusofImprovements option values.
// (Spreadsheet typo "ListSatusofImprovements" is the TAB name only — the VALUES below are canonical.)
export const STATUS_TO_SCENARIOS: Record<string, string[]> = {
  'Improved - Completed': ['As Stabilized'],
  'Improved - Renovated': ['As Stabilized'],
  'Improved - Under Renovation': ['As-Is', 'As If Complete & Stabilized'],
  'Improved - Proposed Renovation': ['As-Is', 'As If Complete & Stabilized'],
  'Proposed - Vacant Land': ['As Is Vacant Land', 'As If Complete & Stabilized'],
  'Proposed - Improved Land (Demolition Required)': ['As If Vacant Land', 'As If Complete & Stabilized'],
  'Proposed - Under Construction': ['As If Vacant Land', 'As If Complete & Stabilized'],
};

// Override: Authorized Use = Insurance REPLACES the status-derived scenarios with this single one (R023).
export const INSURANCE_OVERRIDE_SCENARIO = 'Insurable Replacement Cost';

export interface Narrative {
  scenario: string;        // canonical ListValueScenarios value
  summary: string | null;  // §10 [EA/HCSummary_n] — the short summary line
  eaDetail: string | null; // future [EADetail_n] — extraordinary-assumption long form
  hcDetail: string | null; // future [HCDetail_n] — hypothetical-condition long form
}

// Verbatim from the v3.1 EA-HC Text tab. 6 scenarios carry text; 4 are option-set members with text
// PENDING (As If Complete - Rezoned / Serviced / Subdivided, Insurable Replacement Cost) — they resolve
// to null (the §10 row keeps its literal bracket) until Chris supplies copy.
// NOTE: client-authored text is reproduced VERBATIM, including its typos ("makret"). Correcting client
// legal language is Chris's call, not ours — flagged, not silently fixed.
export const NARRATIVES: Narrative[] = [
  {
    scenario: "As Is Vacant Land",
    summary: "current market value of the subject property as of the effective date",
    eaDetail: null,
    hcDetail: null,
  },
  {
    scenario: "As If Vacant Land",
    summary: "current makret value based on the extraordinary assumption and hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date.",
    eaDetail: "The As If Vacant market land value is developed under the extraordinary assumption that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. This assumption is contrary to the known physical state of the property and is made for the purpose of estimating the underlying land value.",
    hcDetail: "The As If Vacant market land value is developed under the hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. This condition is contrary to the known physical state of the property and is made for the purpose of estimating the underlying land value.",
  },
  {
    scenario: "As If Complete & Stabilized",
    summary: "current market value of the subject property as proposed based upon the extraordinary assumption and hypothetical condition that the project is 100% complete and fully leased at market rents and is at stabilized occupancy, as of the effective date.",
    eaDetail: "The As If Vacant market land value is developed under the extraordinary assumption that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. This assumption is contrary to the known physical state of the property and is made for the purpose of estimating the underlying land value.",
    hcDetail: "The As If Vacant market land value is developed under the hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. This condition is contrary to the known physical state of the property and is made for the purpose of estimating the underlying land value.",
  },
  {
    scenario: "As-Is",
    summary: "current market value of the subject property as improved as of the effective date",
    eaDetail: null,
    hcDetail: null,
  },
  {
    scenario: "As Stabilized",
    summary: "current market value of the subject property based on the extraordinary assumption that the subject property is fully leased at market rents and is at stabilized occupancy as of the effective date.",
    eaDetail: "The As Stabilized value has been developed based on the extraordinary assumption that the subject property is fully leased at prevailing market rents and has achieved stabilized occupancy as of the effective date of the appraisal. Under this premise, no deductions are made for holding costs, rent loss, or lease-up expenses. In addition it is an extraordinary assumption that all units could achieve current market rent levels and stabilized occupancy as of the effective date. In reality, as of the effective date, the property's existing lease terms reflect contract rents that are deemed to be below-market rents. For the purposes of this analysis, it is assumed that lease-up to market rent levels has occurred under typical market conditions, without undue delay or concessions exceeding market norms. If this assumption proves incorrect, such as market rents are not achievable the value conclusion may be materially impacted.",
    hcDetail: "The As Stabilized value has been developed based on the hypothetical condition that the subject property is fully leased at prevailing market rents and has achieved stabilized occupancy as of the effective date of the appraisal. Under this premise, no deductions are made for holding costs, rent loss, or lease-up expenses. In addition it is a hypothetical condition that all units could achieve current market rent levels and stabilized occupancy as of the effective date. In reality, as of the effective date, the property's existing lease terms reflect contract rents that are deemed to be below-market rents. For the purposes of this analysis, it is assumed that lease-up to market rent levels has occurred under typical market conditions, without undue delay or concessions exceeding market norms. If this hypothetical condition proves incorrect, such as market rents are not achievable the value conclusion may be materially impacted.",
  },
  {
    scenario: "As If Complete & Stabilized - Renovated",
    summary: "current market value of the subject property as proposed based upon the extraordinary assumption and hypothetical condition that the renovation is 100% complete and the property is fully leased and is at stabilized occupancy, as of the effective date.",
    eaDetail: "The As If Renovated & Stabilized market value concluded herein has been developed under the extraordinary assumption that the existing improvements, as described in this report, have been fully renovated and have been leased at market rents with stabilized occupancy as of the effective date. In reality, the renovations are not complete as of the effective date. This appraisal does not consider unforeseeable events that could affect the timing, cost, or outcome of the renovation and lease-up process. If the stated hypothetical condition does not hold true, the value conclusion presented herein may be materially affected.",
    hcDetail: "The As If Renovated & Stabilized market value concluded herein has been developed under the hypothetical condition that the existing improvements, as described in this report, have been fully renovated and have been leased at market rents with stabilized occupancy as of the effective date. In reality, the renovations are not complete as of the effective date. This appraisal does not consider unforeseeable events that could affect the timing, cost, or outcome of the renovation and lease-up process. If the stated hypothetical condition does not hold true, the value conclusion presented herein may be materially affected.",
  },
];

/**
 * Derive the ordered Value Scenarios for §10's LEFT column.
 * Insurance override (Authorized Use) wins over the Status-of-Improvements cascade.
 */
export function deriveValueScenarios(statusOfImprovements?: string, authorizedUse?: string): string[] {
  if ((authorizedUse || '').toLowerCase().includes('insurance')) {
    return [INSURANCE_OVERRIDE_SCENARIO];
  }
  return STATUS_TO_SCENARIOS[(statusOfImprovements || '').trim()] || [];
}

/**
 * Resolve the §10 RIGHT-column summary for a scenario ([EA/HCSummary_n]).
 * Exact scenario-name match. Returns null when no library entry (or text) exists.
 */
export function resolveNarrative(scenario: string): string | null {
  const hit = NARRATIVES.find(n => n.scenario === scenario);
  return hit ? hit.summary : null;
}

/**
 * Full 3-slot lookup (Summary + EADetail + HCDetail) for the future [EADetail_n] / [HCDetail_n]
 * tokens. Returns the whole Narrative or null. Not yet consumed by the template.
 */
export function resolveNarrativeDetails(scenario: string): Narrative | null {
  return NARRATIVES.find(n => n.scenario === scenario) || null;
}
