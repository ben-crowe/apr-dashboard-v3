/**
 * LOE Section 10 cascade + narrative library — SHARED SOURCE.
 *
 * Extracted verbatim from the registry app (public/field-registry-v6.html: SCEN @ ~810, NARRATIVES @ ~1869)
 * so the LOE generator can import it WITHOUT duplicating the data inside generateLOE.ts. This is the single
 * source the generator reads. As Chris adds library entries in the registry, mirror them here (long-term:
 * both should consume one JSON — flagged as follow-up) and more scenarios auto-resolve with no code change.
 *
 * Two mechanisms:
 *  1. Status of Improvements → ordered Value Scenarios (the LEFT column of §10).
 *  2. Value Scenario → matching EA/HC narrative text (the RIGHT column), exact-string trigger match.
 */

// Status of Improvements → ordered Value Scenarios. Keys are byte-identical to the registry SCEN map.
export const STATUS_TO_SCENARIOS: Record<string, string[]> = {
  'Existing - Completed': ['As Stabilized'],
  'Existing - Renovated': ['As Stabilized'],
  'Existing - Under Renovation': ['As-Is', 'As If Complete & Stabilized'],
  'Existing - To Be Renovated': ['As-Is', 'As If Complete & Stabilized'],
  'Proposed - Vacant Land': ['As Is Vacant Land', 'As If Complete & Stabilized'],
  'Proposed - Improved Land (Demolition Required)': ['As If Vacant Land', 'As If Complete & Stabilized'],
  'Proposed - Under Construction': ['As If Vacant Land', 'As If Complete & Stabilized'],
};

// Override: Authorized Use = Insurance REPLACES the status-derived scenarios with this single scenario.
export const INSURANCE_OVERRIDE_SCENARIO = 'Insurable Replacement Cost';

export interface Narrative {
  id: string;
  type: string;
  name: string;
  trigger: string; // literal trigger string — matched EXACTLY (e.g. 'Value Scenarios = "As If Vacant Land"')
  usedIn: string;  // pipe list, e.g. 'Report | LOE'
  text: string;
}

// Verbatim from registry NARRATIVES. Today only "As If Vacant Land" has entries → only it resolves.
// NOTE: 'As Is Vacant Land' ≠ 'As If Vacant Land' — different trigger string, will NOT resolve.
export const NARRATIVES: Narrative[] = [
  {
    id: 'EA-001',
    type: 'Extraordinary Assumption',
    name: 'As If Vacant — Demolition',
    trigger: 'Value Scenarios = "As If Vacant Land"',
    usedIn: 'Report | LOE',
    text: 'The As If Vacant market land value is developed under the hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date of the appraisal. This condition is contrary to the known physical state of the property and is made for the purpose of estimating the underlying land value.',
  },
  {
    id: 'EA-002',
    type: 'Extraordinary Assumption',
    name: 'As If Vacant — Demolition (variant)',
    trigger: 'Value Scenarios = "As If Vacant Land"',
    usedIn: 'Report | LOE',
    text: 'The As If Vacant market land value is developed under the hypothetical condition that the existing improvements on the subject site do not exist, and that the property is vacant as of the effective date. This condition is contrary to the known physical state of the property and is made for the purpose of estimating the underlying land value.',
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
 * Resolve the EA/HC narrative text for a scenario (§10 RIGHT column).
 * Exact-string trigger match + usedIn must include 'LOE'. Returns null when no library entry matches.
 */
export function resolveNarrative(scenario: string): string | null {
  const trigger = `Value Scenarios = "${scenario}"`;
  const hit = NARRATIVES.find(n => n.trigger === trigger && n.usedIn.includes('LOE'));
  return hit ? hit.text : null;
}
