/**
 * V3-ORIGIN FIELD ID-SET — the partition boundary for the two-button test fill (chunk 2).
 *
 * SINGLE SOURCE OF TRUTH. Every consumer keys off this one list:
 *   - loadDataSet1User's exclude (Fill-V4 never writes a V3-origin field — INV-2 runtime guard).
 *   - Fill-V3 filters composeReportFields() to exactly these ids (KR1: fills ONLY V3-origin fields).
 *   - The TestDataSet1 strip removed exactly the entries whose store-id is in this set (INV-1).
 *
 * DERIVATION (authoritative, not guessed): the genuine V3-app fields, mapped to their V4
 * registry store-ids —
 *   S1 (client-intake): the V3 intake form fields — ClientInformationSection.tsx +
 *     PropertyInformationSection.tsx + PropertyContactSection.tsx. Excludes the V4-only
 *     appraiser company-info block and the V4-added client aliases (client-name/attention/
 *     salutation).
 *   S2 (loe-prep): the ten V3 LOE quote fields — the loe-quote/*.tsx sections. Excludes the
 *     V4-only loe-prep report-builder set (appraiser-*, report boilerplate, assignment-details,
 *     valuation-type/appraisal-status, etc.) per V3-V4-FIELD-ALIGNMENT-DELTA.md Section D — those
 *     stay Fill-V4 territory.
 *
 * Every id here was verified to exist in fieldRegistry.ts AND resolve to section
 * client-intake or loe-prep. client-full-name / contact-full-name are the V3-derived
 * calculated fields the report bridge writes (from V3 first/last), included so Fill-V3 mirrors
 * the production populate.
 *
 * NOTE (INV-0, chunk-3 watch): several V3-origin ids are NOT carried by the report bridge
 * (composeReportFields) — asset-condition, valuation-premises, property-subtype,
 * property-city/province/postal, client-title, intake-notes, delivery-date, appraisal-fee,
 * retainer-amount, payment-terms, appraiser-comments. They are stripped + excluded, so they end
 * up empty under BOTH buttons. That is production-faithful (a real job doesn't bridge them
 * either) — do NOT invent fills for them.
 */

// S1 — client-intake (V3 intake form)
const V3_ORIGIN_S1 = [
  'client-first-name',
  'client-last-name',
  'client-email',
  'client-phone',
  'client-title',
  'client-company-name',
  'client-organization-address',
  'client-city',
  'client-province',
  'client-postal',
  'client-full-name',
  'property-name',
  'property-address',
  'property-city',
  'property-province',
  'property-postal',
  'property-type',
  'property-subtype',
  'tenancy',
  'authorized-use',
  'valuation-premises',
  'asset-condition',
  'contact-first-name',
  'contact-last-name',
  'contact-email',
  'contact-phone',
  'contact-full-name',
  'intake-notes',
] as const;

// S2 — loe-prep (the ten V3 LOE quote fields)
const V3_ORIGIN_S2 = [
  'report-type',
  'interest-appraised',
  'delivery-date',
  'job-number',
  'scope-of-work',
  'appraisal-fee',
  'retainer-amount',
  'payment-terms',
  'appraiser-comments',
] as const;

export const V3_ORIGIN_FIELD_IDS: readonly string[] = [
  ...V3_ORIGIN_S1,
  ...V3_ORIGIN_S2,
];

const V3_ORIGIN_SET = new Set<string>(V3_ORIGIN_FIELD_IDS);

/** True if the given registry store-id is a V3-origin field (S1 or S2). */
export function isV3OriginField(fieldId: string): boolean {
  return V3_ORIGIN_SET.has(fieldId);
}
