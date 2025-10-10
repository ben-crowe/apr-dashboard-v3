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
 */
export function isValcreJobNumber(jobNumber: string | number | undefined): boolean {
  if (!jobNumber) return false;
  const jobStr = jobNumber.toString();
  // Check for either VAL prefix OR PENDING (job submitted but waiting for number)
  return jobStr.startsWith(VALCRE_JOB_PREFIX) || jobStr.startsWith('PENDING-');
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