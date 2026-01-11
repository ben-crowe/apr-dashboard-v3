/**
 * Valcre Configuration
 * 
 * This file contains configuration for Valcre integration including
 * the job number prefix used by your Valcre account.
 */

/**
 * The prefix used for Valcre job numbers.
 * Change this to match your Valcre account settings.
 * 
 * Examples:
 * - 'CAL' for Calgary (old format)
 * - 'VAL' for Valta (new format)
 * - Any custom prefix your Valcre account uses
 */
export const VALCRE_JOB_PREFIX = 'VAL'; // Changed from 'CAL' to 'VAL'

/**
 * Check if a job number is a valid Valcre job number
 * Accepts any format that starts with VAL prefix (Valcre may use various formats)
 * Also accepts PENDING- prefix for jobs waiting for number
 * 
 * Note: We don't reject "TEST" numbers because Valcre might actually return them
 * if the client changed their naming convention. Instead, check valcre_job_id
 * to verify if it's a real job.
 */
export function isValcreJobNumber(jobNumber: string | number | undefined): boolean {
  if (!jobNumber) return false;
  const jobStr = jobNumber.toString();
  
  // Check for PENDING prefix (job submitted but waiting for number)
  if (jobStr.startsWith('PENDING-')) return true;
  
  // Check for VAL prefix (any format - Valcre may use various naming conventions)
  return jobStr.startsWith(VALCRE_JOB_PREFIX);
}

/**
 * Check if a job has a REAL Valcre job (not just a number, but actual job ID)
 * This is the definitive check - if valcre_job_id exists, it's a real job
 * Checks both snake_case (valcre_job_id) and camelCase (valcreJobId) formats
 */
export function hasRealValcreJob(jobDetails: { valcre_job_id?: number | string | null; valcreJobId?: number | string | null; jobNumber?: string | null } | undefined): boolean {
  if (!jobDetails) return false;
  
  // Check both snake_case and camelCase formats
  const valcreJobId = jobDetails.valcre_job_id || jobDetails.valcreJobId;
  
  // If we have a Valcre job ID, it's definitely real
  if (valcreJobId && valcreJobId !== null && valcreJobId !== 'null' && valcreJobId !== 0) {
    return true;
  }
  
  // If we have a job number but no ID, it might be pending or fake
  // But we can't reject it - Valcre might have returned it
  return false;
}

/**
 * Check if this is a pending Valcre job (submitted but waiting for number)
 */
export function isPendingValcreJob(jobNumber: string | number | undefined): boolean {
  if (!jobNumber) return false;
  return jobNumber.toString().startsWith('PENDING-');
}

/**
 * Format examples for UI display
 * Valcre format: VAL + 2-digit year + 4-digit sequence
 * Example: VAL251001
 */
export const VALCRE_JOB_EXAMPLE = `${VALCRE_JOB_PREFIX}251001`;