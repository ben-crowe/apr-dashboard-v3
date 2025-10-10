export interface FieldDefinition {
  id: string;
  displayName: string;
  marker: string;
  dataPath: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'email' | 'address';
  required: boolean;
  defaultValue?: any;
  format?: (value: any) => string;
  validate?: (value: any) => boolean;
}

export class FieldRegistry {
  private fields = new Map<string, FieldDefinition>();
  
  constructor() {
    this.registerAPRHubFields();
  }
  
  private registerAPRHubFields() {
    const fields: FieldDefinition[] = [
      // Section 1 - Basic Info
      {
        id: 'date-created',
        displayName: 'Date Created',
        marker: '[--date-created--]',
        dataPath: 'dateCreated',
        type: 'date',
        required: true,
        format: (value) => {
          if (!value) return '';
          const date = new Date(value);
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      },
      {
        id: 'job-number',
        displayName: 'Job Number',
        marker: '[--job-number--]',
        dataPath: 'jobNumber',
        type: 'text',
        required: true
      },
      
      // Section 2 - Client Info
      {
        id: 'client-name',
        displayName: 'Client Name',
        marker: '[--client-name--]',
        dataPath: 'clientName',
        type: 'text',
        required: true
      },
      {
        id: 'client-email',
        displayName: 'Client Email',
        marker: '[--client-email--]',
        dataPath: 'clientEmail',
        type: 'email',
        required: true
      },
      {
        id: 'client-phone',
        displayName: 'Client Phone',
        marker: '[--client-phone--]',
        dataPath: 'clientPhone',
        type: 'text',
        required: true
      },
      {
        id: 'company-name',
        displayName: 'Company Name',
        marker: '[--company-name--]',
        dataPath: 'companyName',
        type: 'text',
        required: false
      },
      {
        id: 'client-address',
        displayName: 'Client Address',
        marker: '[--client-address--]',
        dataPath: 'clientAddress',
        type: 'address',
        required: false
      },
      {
        id: 'client-title',
        displayName: 'Client Title',
        marker: '[--client-title--]',
        dataPath: 'clientTitle',
        type: 'text',
        required: false
      },
      
      // Section 3A - Property Details
      {
        id: 'property-address',
        displayName: 'Property Address',
        marker: '[--property-address--]',
        dataPath: 'propertyAddress',
        type: 'address',
        required: true
      },
      {
        id: 'property-type',
        displayName: 'Property Type',
        marker: '[--property-type--]',
        dataPath: 'propertyType',
        type: 'text',
        required: true
      },
      {
        id: 'notes',
        displayName: 'Notes',
        marker: '[--notes--]',
        dataPath: 'notes',
        type: 'text',
        required: false
      },
      
      // Section 3B - Valuation Details
      {
        id: 'intended-use',
        displayName: 'Intended Use',
        marker: '[--intended-use--]',
        dataPath: 'intendedUse',
        type: 'text',
        required: true
      },
      {
        id: 'requested-value',
        displayName: 'Requested Value',
        marker: '[--requested-value--]',
        dataPath: 'requestedValue',
        type: 'text',
        required: true
      },
      {
        id: 'property-rights',
        displayName: 'Property Rights',
        marker: '[--property-rights--]',
        dataPath: 'propertyRights',
        type: 'text',
        required: true
      },
      {
        id: 'report-type',
        displayName: 'Report Type',
        marker: '[--report-type--]',
        dataPath: 'reportType',
        type: 'text',
        required: true
      },
      {
        id: 'appraisal-fee',
        displayName: 'Appraisal Fee',
        marker: '[--appraisal-fee--]',
        dataPath: 'appraisalFee',
        type: 'currency',
        required: true,
        format: (value) => {
          if (!value) return '$0.00';
          const num = parseFloat(value);
          return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
      },
      {
        id: 'retainer-amount',
        displayName: 'Retainer Amount',
        marker: '[--retainer-amount--]',
        dataPath: 'retainerAmount',
        type: 'currency',
        required: false,
        format: (value) => {
          if (!value) return '$0.00';
          const num = parseFloat(value);
          return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
      },
      {
        id: 'payment-terms',
        displayName: 'Payment Terms',
        marker: '[--payment-terms--]',
        dataPath: 'paymentTerms',
        type: 'text',
        required: true
      },
      {
        id: 'scope-of-work',
        displayName: 'Scope of Work',
        marker: '[--scope-of-work--]',
        dataPath: 'scopeOfWork',
        type: 'text',
        required: true
      },
      {
        id: 'report-delivery',
        displayName: 'Report Delivery',
        marker: '[--report-delivery--]',
        dataPath: 'reportDelivery',
        type: 'text',
        required: true
      }
    ];
    
    fields.forEach(field => this.register(field));
  }
  
  register(field: FieldDefinition) {
    this.fields.set(field.id, field);
  }
  
  getById(id: string): FieldDefinition | undefined {
    return this.fields.get(id);
  }
  
  getByMarker(marker: string): FieldDefinition | undefined {
    return Array.from(this.fields.values()).find(f => f.marker === marker);
  }
  
  getAllFields(): FieldDefinition[] {
    return Array.from(this.fields.values());
  }
  
  replaceFields(content: string, data: any): string {
    let result = content;
    
    this.fields.forEach(field => {
      const value = this.getValueByPath(data, field.dataPath);
      const formatted = field.format ? field.format(value) : (value || '');
      
      // Escape special regex characters in the marker
      const escapedMarker = field.marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(escapedMarker, 'g'), formatted);
    });
    
    return result;
  }
  
  highlightFields(content: string): string {
    return content.replace(
      /\[--([a-z-]+)--\]/g,
      '<span class="field-marker" data-field="$1">[--$1--]</span>'
    );
  }
  
  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  }
  
  validateFields(content: string, data: any): {
    valid: boolean;
    errors: Array<{ fieldId: string; message: string; severity: 'error' | 'warning' }>;
  } {
    const errors: Array<{ fieldId: string; message: string; severity: 'error' | 'warning' }> = [];
    
    // Find all field markers in content
    const fieldPattern = /\[--([a-z-]+)--\]/g;
    const matches = content.matchAll(fieldPattern);
    
    for (const match of matches) {
      const fieldId = match[1];
      const field = this.getById(fieldId);
      
      if (!field) {
        errors.push({
          fieldId,
          message: `Unknown field: [--${fieldId}--]`,
          severity: 'error'
        });
        continue;
      }
      
      const value = this.getValueByPath(data, field.dataPath);
      
      if (field.required && !value) {
        errors.push({
          fieldId,
          message: `Required field "${field.displayName}" is missing`,
          severity: 'error'
        });
      }
      
      if (field.validate && value && !field.validate(value)) {
        errors.push({
          fieldId,
          message: `Invalid value for "${field.displayName}"`,
          severity: 'error'
        });
      }
    }
    
    // Check for unused required fields
    this.fields.forEach(field => {
      if (field.required && !content.includes(field.marker)) {
        errors.push({
          fieldId: field.id,
          message: `Required field "${field.displayName}" not used in document`,
          severity: 'warning'
        });
      }
    });
    
    return {
      valid: errors.filter(e => e.severity === 'error').length === 0,
      errors
    };
  }
}