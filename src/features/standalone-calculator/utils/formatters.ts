/**
 * Field Value Formatters
 * 
 * Format calculated values for display in template pages
 */

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercent(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(2)}%`;
}

/**
 * Format per-unit value
 */
export function formatPerUnit(value: number): string {
  return formatCurrency(value);
}

/**
 * Format per-SF value
 */
export function formatPerSF(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '$0.00/SF';
  return `$${value.toFixed(2)}/SF`;
}

/**
 * Format field value based on field ID pattern
 */
export function formatFieldValue(fieldId: string, value: number | string): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined || isNaN(value as number)) return '';
  
  const numValue = value as number;
  
  // Percentage fields
  if (fieldId.includes('-rate') || fieldId.includes('-pct') || fieldId.includes('cap-rate')) {
    return formatPercent(numValue);
  }
  
  // Per-SF fields
  if (fieldId.includes('-per-sf') || fieldId.includes('-sf')) {
    return formatPerSF(numValue);
  }
  
  // Per-unit fields
  if (fieldId.includes('-per-unit')) {
    return formatPerUnit(numValue);
  }
  
  // Currency fields (default)
  return formatCurrency(numValue);
}
