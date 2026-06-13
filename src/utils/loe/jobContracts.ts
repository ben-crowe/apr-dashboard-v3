/**
 * Job Contracts — saved client contract instances.
 *
 * A "contract" is a TEMPLATE filled with one client's job data and (optionally) tailored
 * by the user in the Contract Editor, then saved against the job. This is distinct from a
 * TEMPLATE (the reusable shell in `loe_templates`): a contract belongs to ONE job/client and
 * carries its own edited HTML + lifecycle state. See
 * docs/Features/12-LOE-Esign/CONTRACT-EDITOR-ARCHITECTURE.md.
 *
 * Lifecycle states:
 *   - 'draft' | 'saved' : created + tailored, not yet sent (reopen + keep editing)
 *   - 'sent'            : delivered to the client via DocuSeal (reopen to view what went out)
 */
import { supabase } from "@/integrations/supabase/client";

export type ContractState = 'draft' | 'saved' | 'sent';

export interface JobContract {
  id: string;
  job_id: string;
  template_id: string | null;
  template_version: number | null;
  name: string;
  contract_type: string | null;
  edited_html: string;
  state: ContractState;
  docuseal_submission_id: string | null;
  created_at: string;
  updated_at: string;
}

/** All saved contracts for a job, newest first. */
export async function loadJobContracts(jobId: string): Promise<JobContract[]> {
  if (!jobId) return [];
  const { data, error } = await supabase
    .from('job_contracts')
    .select('*')
    .eq('job_id', jobId)
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('loadJobContracts failed:', error);
    return [];
  }
  return (data || []) as JobContract[];
}

export interface SaveContractInput {
  id?: string;                 // present = update existing, absent = insert new
  jobId: string;
  name: string;
  editedHtml: string;
  templateId?: string | null;
  templateVersion?: number | null;
  contractType?: string | null;
  state?: ContractState;
  docusealSubmissionId?: string | null;
}

/** Insert a new saved contract, or update one in place when `id` is given. */
export async function saveJobContract(
  input: SaveContractInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const row: Record<string, unknown> = {
    job_id: input.jobId,
    name: input.name,
    edited_html: input.editedHtml,
    template_id: input.templateId ?? null,
    template_version: input.templateVersion ?? null,
    contract_type: input.contractType ?? null,
    state: input.state ?? 'saved',
    docuseal_submission_id: input.docusealSubmissionId ?? null,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabase.from('job_contracts').update(row).eq('id', input.id);
    if (error) return { success: false, error: error.message };
    return { success: true, id: input.id };
  }

  const { data, error } = await supabase
    .from('job_contracts')
    .insert(row)
    .select('id')
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, id: (data as { id: string } | null)?.id };
}

/** Flip a contract to 'sent' and record the DocuSeal submission once delivered. */
export async function markContractSent(
  id: string,
  docusealSubmissionId?: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('job_contracts')
    .update({
      state: 'sent',
      docuseal_submission_id: docusealSubmissionId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function deleteJobContract(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('job_contracts').delete().eq('id', id);
  return error ? { success: false, error: error.message } : { success: true };
}
