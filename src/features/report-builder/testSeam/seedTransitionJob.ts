/**
 * TRANSITION SEED — create a real V3 job for the chunk-3 transition diff (code half).
 *
 * Writes ONLY the 3-row set Create Report READS — job_submissions + job_property_info +
 * job_loe_details — from the chunk-1 fixed dataset:
 *   - job_submissions : formToDbRow(FIXED_FORM_DATA) — the PRODUCTION insert shape (intake goes
 *     through the real form path). No sourceMetadata (the report bridge never reads it).
 *   - job_property_info : { property_subtype, tenancy } from FIXED_FORM_DATA — mirrors the real
 *     intake form's companion insert.
 *   - job_loe_details : the bridge-read LOE columns from FIXED_LOE_ROW, seeded DIRECTLY to the
 *     table. NOTE (must be stated in the artifact): LOE is authored in the LoeQuote UI, not the
 *     intake form — so this is "intake via the form path; LOE via table shape." Route-parity
 *     still holds (both diff routes traverse the same fieldMappings).
 *
 * EXCLUDED by design: job_files (Create Report does not read it) and ALL external integrations
 * (ClickUp / Valcre / DocuSeal) — this seed fires NOTHING external. handleSubmit itself fires no
 * external calls in the current code, but this seed also never invokes it wholesale.
 *
 * Idempotent: cleanup-by-marker runs first so re-runs never pile up rows. This is CODE the driver
 * (codex) invokes during the live run — not run here.
 */

import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';
import { formToDbRow } from '@/components/submission-form/useFormSubmission';
import { FIXED_FORM_DATA } from '@/utils/testDataGenerator';
import { FIXED_LOE_ROW, FIXED_PROPERTY_ROW } from './composeReportFields';

/** Idempotency marker — the fixed dataset's client email uniquely tags seeded jobs. */
export const TRANSITION_SEED_EMAIL = FIXED_FORM_DATA.clientEmail;

/** The bridge-read LOE columns this seed fills (covers every loe.* read in fieldMappings). */
export const SEEDED_LOE_COLUMNS: readonly string[] = [
  'valcre_job_id',
  'report_type',
  'property_rights_appraised',
  'scope_of_work',
  'status_of_improvements',
  'value_scenarios',
  'approaches_to_value',
  'value_timeframe',
];

/** Delete any previously-seeded transition job(s) + companions. Children first, then the job. */
export async function cleanupTransitionSeed(): Promise<void> {
  const { data: jobs } = await supabase
    .from('job_submissions')
    .select('id')
    .eq('client_email', TRANSITION_SEED_EMAIL);

  for (const job of jobs ?? []) {
    await supabase.from('job_property_info').delete().eq('job_id', job.id);
    await supabase.from('job_loe_details').delete().eq('job_id', job.id);
  }
  await supabase
    .from('job_submissions')
    .delete()
    .eq('client_email', TRANSITION_SEED_EMAIL);
}

/**
 * Seed the 3-row Create-Report read-set and return the new job id. Idempotent (cleanup first).
 * Throws loud on any insert error — a partial seed must not silently produce a misleading diff.
 */
export async function seedTransitionJob(): Promise<string> {
  await cleanupTransitionSeed();

  // 1. job_submissions — production insert shape via formToDbRow (no sourceMetadata).
  const { data: job, error: jobErr } = await supabase
    .from('job_submissions')
    .insert(formToDbRow(FIXED_FORM_DATA))
    .select('id')
    .single();
  if (jobErr || !job) {
    throw new Error(`seedTransitionJob: job_submissions insert failed: ${jobErr?.message}`);
  }
  const jobId = job.id;

  // 2. job_property_info — mirrors the real intake form companion insert.
  const propertyRow: TablesInsert<'job_property_info'> = {
    job_id: jobId,
    property_subtype: FIXED_PROPERTY_ROW.property_subtype ?? null,
    tenancy: FIXED_PROPERTY_ROW.tenancy ?? null,
  };
  const { error: piErr } = await supabase
    .from('job_property_info')
    .insert(propertyRow);
  if (piErr) {
    throw new Error(`seedTransitionJob: job_property_info insert failed: ${piErr.message}`);
  }

  // 3. job_loe_details — every bridge-read LOE column from FIXED_LOE_ROW (upsert, as the real
  //    LoeQuote path does). Cleanup already removed any prior row, so this lands one fresh row.
  const loeRow: TablesInsert<'job_loe_details'> = {
    job_id: jobId,
    valcre_job_id: FIXED_LOE_ROW.valcre_job_id ?? null,
    job_number: FIXED_LOE_ROW.job_number ?? null,
    report_type: FIXED_LOE_ROW.report_type ?? null,
    property_rights_appraised: FIXED_LOE_ROW.property_rights_appraised ?? null,
    scope_of_work: FIXED_LOE_ROW.scope_of_work ?? null,
    status_of_improvements: FIXED_LOE_ROW.status_of_improvements ?? null,
    value_scenarios: FIXED_LOE_ROW.value_scenarios ?? null,
    approaches_to_value: FIXED_LOE_ROW.approaches_to_value ?? null,
    value_timeframe: FIXED_LOE_ROW.value_timeframe ?? null,
    delivery_date: FIXED_LOE_ROW.delivery_date ?? null,
  };
  const { error: loeErr } = await supabase
    .from('job_loe_details')
    .upsert(loeRow);
  if (loeErr) {
    throw new Error(`seedTransitionJob: job_loe_details upsert failed: ${loeErr.message}`);
  }

  return jobId;
}
