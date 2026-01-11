/**
 * TypeScript Wrapper for Gmail API Email Checking
 * 
 * This script provides a TypeScript interface to the Python Gmail API checker
 * for easier integration with TypeScript-based testing workflows.
 * 
 * Usage:
 *   npx tsx scripts/check-bc-email.ts --search "subject:Letter of Engagement"
 *   npx tsx scripts/check-bc-email.ts --latest --max-results 5
 *   npx tsx scripts/check-bc-email.ts --wait-for "subject:Letter of Engagement" --timeout 120
 */

import { execSync } from 'child_process';
import { join } from 'path';
import * as process from 'process';

const SCRIPT_DIR = __dirname;
const PYTHON_SCRIPT = join(SCRIPT_DIR, 'check-bc-email.py');

interface CheckEmailOptions {
  search?: string;
  latest?: boolean;
  emailId?: string;
  waitFor?: string;
  maxResults?: number;
  showBody?: boolean;
  timeout?: number;
}

interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  body?: string;
}

/**
 * Check emails using the Python Gmail API script
 */
export function checkEmail(options: CheckEmailOptions): EmailMessage[] {
  const args: string[] = [];
  
  if (options.search) {
    args.push('--search', options.search);
  }
  if (options.latest) {
    args.push('--latest');
  }
  if (options.emailId) {
    args.push('--email-id', options.emailId);
  }
  if (options.waitFor) {
    args.push('--wait-for', options.waitFor);
  }
  if (options.maxResults) {
    args.push('--max-results', options.maxResults.toString());
  }
  if (options.showBody) {
    args.push('--show-body');
  }
  if (options.timeout) {
    args.push('--timeout', options.timeout.toString());
  }
  
  try {
    const command = `python3 "${PYTHON_SCRIPT}" ${args.join(' ')}`;
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    
    // Note: The Python script handles its own output formatting
    // This wrapper is mainly for programmatic use
    return [];
  } catch (error: any) {
    console.error('Error checking email:', error.message);
    throw error;
  }
}

/**
 * Wait for an email matching a query
 */
export async function waitForEmail(
  query: string, 
  timeout: number = 60
): Promise<EmailMessage | null> {
  return new Promise((resolve, reject) => {
    try {
      checkEmail({ waitFor: query, timeout, showBody: true });
      // The Python script handles waiting, so we resolve after it completes
      resolve(null);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get latest emails
 */
export function getLatestEmails(maxResults: number = 10): EmailMessage[] {
  return checkEmail({ latest: true, maxResults });
}

/**
 * Search for emails
 */
export function searchEmails(query: string, maxResults: number = 10): EmailMessage[] {
  return checkEmail({ search: query, maxResults });
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options: CheckEmailOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--search' && args[i + 1]) {
      options.search = args[++i];
    } else if (arg === '--latest') {
      options.latest = true;
    } else if (arg === '--email-id' && args[i + 1]) {
      options.emailId = args[++i];
    } else if (arg === '--wait-for' && args[i + 1]) {
      options.waitFor = args[++i];
    } else if (arg === '--max-results' && args[i + 1]) {
      options.maxResults = parseInt(args[++i], 10);
    } else if (arg === '--show-body') {
      options.showBody = true;
    } else if (arg === '--timeout' && args[i + 1]) {
      options.timeout = parseInt(args[++i], 10);
    }
  }
  
  if (Object.keys(options).length === 0) {
    console.log(`
Usage:
  npx tsx scripts/check-bc-email.ts --search "subject:Letter of Engagement" --max-results 5
  npx tsx scripts/check-bc-email.ts --latest --max-results 10
  npx tsx scripts/check-bc-email.ts --wait-for "subject:Letter of Engagement" --timeout 120
    `);
    process.exit(1);
  }
  
  checkEmail(options);
}
