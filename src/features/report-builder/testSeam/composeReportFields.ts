/**
 * Shared test-data seam (chunk 1) — deterministic report-field composition.
 *
 * Feeds EVERY field-id the report bridge (`fieldMappings`) reads, across ALL THREE DB
 * targets: job_submissions (via formToDbRow), job_loe_details, job_property_info. Composing
 * only the job_submissions row would silently drop every loe/property field-id and make the
 * chunk-3 transition-diff meaningless.
 *
 * Zero DB writes. Behavior-neutral seam only — the chunk-2 Fill-V3 button will call
 * composeReportFields(); do NOT wire a button or touch any UI here.
 */

import type { FormData } from '@/utils/validation';
import { formToDbRow } from '@/components/submission-form/useFormSubmission';
import { FIXED_FORM_DATA } from '@/utils/testDataGenerator';
import {
  fieldMappings,
  type JobData,
  type LoeData,
  type PropertyData,
} from '../hooks/useLoadJobIntoReport';

/**
 * LOE companion row (job_loe_details shape). Standalone / hand-authored — LOE fields have
 * no intake-form origin (they are set at loe-prep), so nothing here derives from
 * FIXED_FORM_DATA. `valcre_job_id` is fixed so the `job-number` mapping resolves
 * deterministically without a DB-generated id.
 */
export const FIXED_LOE_ROW: LoeData = {
  // NUMERIC string: job_loe_details.valcre_job_id is an INTEGER column, so the seed writes this
  // as a number. Kept as a numeric string here (LoeData types it string; the job-number mapping
  // returns the raw value and the snapshot's normalize() stringifies it) so the Fill-V3 baseline
  // and the DB-read pushed snapshot both normalize to the same "9990001". A distinctive test id,
  // unlikely to collide with a real one.
  valcre_job_id: '9990001',
  job_number: 'VJ-FIXED-0001',
  report_type: 'Comprehensive',
  property_rights_appraised: 'Fee Simple Estate',
  scope_of_work: 'Complete appraisal with interior and exterior inspection.',
  delivery_date: '2026-01-15',
  status_of_improvements: 'Improved - Completed',
  value_scenarios: 'As-Is',
  approaches_to_value: 'Income, Direct Comparison, Cost',
  value_timeframe: 'Current',
};

/**
 * Property-info companion row (job_property_info shape). `tenancy` and `property_subtype`
 * DERIVE from FIXED_FORM_DATA (single definition) — the real V3 job carries those form →
 * job_property_info, so a re-typed value would diff against itself in the chunk-3 transition
 * diff. `property_name` and `legal_description` have no intake-form origin, so hand-authored.
 * (property_subtype has no fieldMappings entry today; carried for diff-honesty when a mapping
 * is later added.)
 */
export const FIXED_PROPERTY_ROW: PropertyData = {
  property_name: 'Fixture Plaza',
  legal_description: 'Plan 1234567, Block 5, Lot 6',
  tenancy: FIXED_FORM_DATA.tenancy,
  property_subtype: FIXED_FORM_DATA.propertySubtype,
};

export interface ComposedReportField {
  fieldId: string;
  value: string;
}

/**
 * Runs the fixed dataset through the REAL bridge (formToDbRow → fieldMappings across all
 * three DB shapes) and returns the report-builder field-id/value pairs, plus the two derived
 * full-name fields the hook writes outside the mapping table (client-full-name,
 * contact-full-name). Mirrors useLoadJobIntoReport's populate exactly, including its guard
 * that drops undefined/null/'' values. Zero DB writes.
 *
 * Defaults to the fixed dataset + companions; params allow reuse with other rows.
 */
export function composeReportFields(
  formData: FormData = FIXED_FORM_DATA,
  loe: LoeData = FIXED_LOE_ROW,
  property: PropertyData = FIXED_PROPERTY_ROW,
): ComposedReportField[] {
  // formToDbRow (no sourceMetadata — the bridge never reads source_metadata) yields the
  // job_submissions row shape the fieldMappings read as JobData.
  const jobRow = formToDbRow(formData) as unknown as JobData;
  const fields: ComposedReportField[] = [];

  for (const mapping of fieldMappings) {
    const value = mapping.getValue(jobRow, loe, property);
    if (value !== undefined && value !== null && value !== '') {
      fields.push({ fieldId: mapping.fieldId, value });
    }
  }

  // Derived full-name fields — the hook computes these AFTER the mapping populate, from the
  // just-populated first/last (FIX 2 made full-name a derived, never-independently-entered
  // field). Mirror it so the seam matches what loadJob actually writes.
  const deriveFullName = (first?: string | null, last?: string | null) =>
    [first, last].filter(Boolean).join(' ');
  const clientFullName = deriveFullName(jobRow.client_first_name, jobRow.client_last_name);
  if (clientFullName) fields.push({ fieldId: 'client-full-name', value: clientFullName });
  const contactFullName = deriveFullName(
    jobRow.property_contact_first_name,
    jobRow.property_contact_last_name,
  );
  if (contactFullName) fields.push({ fieldId: 'contact-full-name', value: contactFullName });

  return fields;
}
