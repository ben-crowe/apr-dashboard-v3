
import { isValcreJobNumber } from '@/config/valcre';

/**
 * Format a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Format job number according to the standardized format:
 * [Job Number] – [Property Name], [Property Address]
 * 
 * Examples:
 * - CAL250111 - Heritage Tower, 204 9th Avenue SE Calgary AB
 * - CAL240537 - 6 Units Powell Street, 320 Powell Street Cochrane AB
 * - CAL230982 - Riverview Office Park, 150 Riverside Drive Edmonton AB
 * - CAL250080 - Parkview Apartments, 15-Unit MF 12945 101 St Edmonton AB
 * - CAL250069 - Riverside Commercial Plaza, 410&412 23 Ave NE Calgary
 */
// Helper function to clean address for display (removes province and postal code)
function cleanAddressForDisplay(address: string): string {
  if (!address) return '';
  
  // Remove postal code pattern (Canadian: T2P 1A1 or T2P1A1)
  let cleaned = address.replace(/\b[A-Z]\d[A-Z]\s*\d[A-Z]\d\b/gi, '').trim();
  
  // Remove province abbreviations (AB, BC, SK, MB, ON, QC, etc.)
  cleaned = cleaned.replace(/,?\s*\b(AB|BC|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU)\b/gi, '').trim();
  
  // Clean up any trailing commas or extra spaces
  cleaned = cleaned.replace(/,\s*$/, '').replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

export function formatJobNumber(jobNumber: string | undefined, job: any): string {
  // Get the actual job number (Valcre number)
  const valcreNumber = jobNumber || job.jobNumber;
  
  // If we have a Valcre job number, format it properly with property info
  if (isValcreJobNumber(valcreNumber)) {
    // Try to get property name and address
    const propertyName = job.propertyName || '';
    const propertyAddress = cleanAddressForDisplay(job.propertyAddress || '');
    
    // If we have property info, format it nicely
    if (propertyName || propertyAddress) {
      if (propertyName && propertyAddress) {
        // Full format: VAL250111 - Heritage Tower, 204 9th Avenue SE Calgary AB
        return `${valcreNumber} - ${propertyName}, ${propertyAddress}`;
      } else if (propertyAddress) {
        // Just address: VAL250111 - 204 9th Avenue SE Calgary AB
        return `${valcreNumber} - ${propertyAddress}`;
      } else {
        // Just property name: VAL250111 - Heritage Tower
        return `${valcreNumber} - ${propertyName}`;
      }
    }
    // If no property info, just return the Valcre number
    return valcreNumber;
  }
  
  // For jobs without a CAL number yet, show property info
  if (job.propertyName && job.propertyAddress) {
    const cleanedAddress = cleanAddressForDisplay(job.propertyAddress);
    return `${job.propertyName}, ${cleanedAddress}`;
  }
  
  if (job.propertyAddress) {
    // Clean and potentially truncate if too long
    const address = cleanAddressForDisplay(job.propertyAddress);
    return address.length > 40 ? address.substring(0, 37) + '...' : address;
  }
  
  if (job.propertyName) {
    return job.propertyName;
  }
  
  // Only show this if we have no property info at all
  return "New Submission";
}
