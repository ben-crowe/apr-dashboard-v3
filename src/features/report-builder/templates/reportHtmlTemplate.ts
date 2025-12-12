/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Report HTML Template
 *
 * Generates the complete HTML template for PDF reports.
 * Single source of truth for all report HTML generation.
 *
 * Template Structure:
 * - Document metadata and styles
 * - Cover page section
 * - All content sections (rendered based on section order)
 * - Auto-generated certification section
 *
 * @module reportHtmlTemplate
 */

import type { ReportSection, ReportField } from '../types/report-types';

/**
 * Field rendering logic
 *
 * Maps field types to their HTML representation.
 * Each field type has specific rendering rules:
 *
 * - text: Single line text with label
 * - textarea: Multi-line text with label
 * - date: Formatted date with label
 * - select/multiselect: Dropdown values with label
 * - checkbox: Boolean value as Yes/No
 * - image: Image URL or placeholder
 * - number: Numeric value with label
 * - currency: Formatted currency value
 *
 * All fields support empty/null values gracefully.
 */

/**
 * Section rendering logic
 *
 * Each section type has specific rendering rules:
 *
 * - cover-page: Special handling for report title page
 * - image-mgt: Not rendered (source for S4-photos)
 * - S4-photos: Renders from image-mgt data
 * - S5-cert: Auto-generated certification section
 * - All others: Standard section/subsection/field-group rendering
 *
 * Sections can contain:
 * - Direct fields (rendered in field groups)
 * - Subsections (containing fields)
 * - Special tables (executive summary, cap rate)
 *
 * Empty sections show placeholder text.
 */

/**
 * Generate complete HTML template for a report
 *
 * @param reportData - The complete report data structure
 * @returns Complete HTML string ready for PDF conversion
 */
export const generateReportHtml = (reportData: {
  title: string;
  sections: ReportSection[];
  metadata?: Record<string, unknown>;
}): string => {
  console.log('[Template] Starting HTML generation for:', reportData.title);
  console.log('[Template] Section count:', reportData.sections.length);

  // Extract cover page data
  const coverPageSection = reportData.sections.find(s => s.id === 'cover-page');
  const reportTitle = reportData.title || 'Untitled Report';

  // Extract certification data
  const certSection = reportData.sections.find(s => s.id === 'S5-cert');

  // Get image-mgt section (source for all photos)
  const imageMgtSection = reportData.sections.find(s => s.id === 'image-mgt');

  // Extract report date from cover page or use current date
  let reportDate: Date | null = null;
  if (coverPageSection?.fields) {
    const inspectionDateField = coverPageSection.fields.find(f => f.id === 'inspection-date');
    if (inspectionDateField?.value) {
      reportDate = new Date(inspectionDateField.value as string);
    }
  }
  if (!reportDate) {
    reportDate = new Date();
  }

  // Helper: Render a single field
  const renderField = (field: ReportField): string => {
    console.log('[Template] Rendering field:', field.id, 'type:', field.type, 'value:', field.value);

    // Skip caption fields - they're rendered with their images
    if (field.id.endsWith('-caption')) {
      return '';
    }

    const label = field.label || field.id;
    let value = field.value;

    // Handle empty/null values
    if (value === null || value === undefined || value === '') {
      return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value empty-value">[Not provided]</span>
      </div>
      `;
    }

    // Handle different field types
    switch (field.type) {
      case 'textarea':
        // For textarea, preserve line breaks
        const textValue = String(value).replace(/\n/g, '<br>');
        return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value">${textValue}</span>
      </div>
        `;

      case 'date':
        // Format date
        const dateValue = new Date(value as string).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value">${dateValue}</span>
      </div>
        `;

      case 'checkbox':
        // Boolean as Yes/No
        const boolValue = value ? 'Yes' : 'No';
        return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value">${boolValue}</span>
      </div>
        `;

      case 'image':
        // Image field - handle both string and array values
        let imageUrl = '';
        if (typeof value === 'string') {
          imageUrl = value;
        } else if (Array.isArray(value) && value.length > 0) {
          imageUrl = value[0] as string;
        }

        if (!imageUrl) {
          return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value empty-value">[No image]</span>
      </div>
          `;
        }

        return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <div class="field-value">
          <img src="${imageUrl}" alt="${label}" style="max-width: 100%; height: auto; border: 1px solid #ddd;" />
        </div>
      </div>
        `;

      case 'currency':
        // Format as currency
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        const currencyValue = isNaN(numValue) ? '[Invalid]' :
          new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numValue);
        return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value">${currencyValue}</span>
      </div>
        `;

      case 'multiselect':
        // Handle array values
        const multiValue = Array.isArray(value) ? value.join(', ') : String(value);
        return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value">${multiValue}</span>
      </div>
        `;

      default:
        // Default: render as string
        return `
      <div class="field-item">
        <span class="field-label">${label}:</span>
        <span class="field-value">${String(value)}</span>
      </div>
        `;
    }
  };

  // Helper: Render cover page
  const renderCoverPage = (): string => {
    if (!coverPageSection) {
      return `
    <div class="cover-page">
      <div class="cover-header">
        <h1 class="cover-title">${reportTitle}</h1>
      </div>
    </div>
      `;
    }

    // Extract cover page fields
    const fields = coverPageSection.fields || [];

    // Get all field values with fallbacks
    const propertyName = fields.find(f => f.id === 'property-name')?.value || '[Property Name]';
    const streetAddress = fields.find(f => f.id === 'street-address')?.value || '[Street Address]';
    const city = fields.find(f => f.id === 'city')?.value || '[City]';
    const state = fields.find(f => f.id === 'state')?.value || '[State]';
    const zipCode = fields.find(f => f.id === 'zip-code')?.value || '[Zip]';
    const clientName = fields.find(f => f.id === 'client-name')?.value || '[Client Name]';
    const inspectionDateField = fields.find(f => f.id === 'inspection-date');
    const inspectionDate = inspectionDateField?.value
      ? new Date(inspectionDateField.value as string).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

    // CRITICAL: Image must be first field in cover-page section
    const coverImageField = fields.find(f => f.type === 'image');
    let coverImageUrl = '';
    if (coverImageField?.value) {
      if (typeof coverImageField.value === 'string') {
        coverImageUrl = coverImageField.value;
      } else if (Array.isArray(coverImageField.value) && coverImageField.value.length > 0) {
        coverImageUrl = coverImageField.value[0] as string;
      }
    }

    return `
    <div class="cover-page">
      ${coverImageUrl ? `
      <div class="cover-image-container">
        <img src="${coverImageUrl}" alt="Cover Image" class="cover-image" />
      </div>
      ` : ''}

      <div class="cover-content">
        <div class="cover-header">
          <h1 class="cover-title">${reportTitle}</h1>
        </div>

        <div class="cover-blue-section">
          <div class="cover-property-info">
            <h2 class="cover-property-name">${propertyName}</h2>
            <p class="cover-address">${streetAddress}</p>
            <p class="cover-city-state-zip">${city}, ${state} ${zipCode}</p>
          </div>

          <div class="cover-metadata">
            <div class="cover-meta-row">
              <span class="cover-meta-label">Prepared for:</span>
              <span class="cover-meta-value">${clientName}</span>
            </div>
            <div class="cover-meta-row">
              <span class="cover-meta-label">Inspection date:</span>
              <span class="cover-meta-value">${inspectionDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  };

  // Helper: Render executive summary section
  const renderExecutiveSummary = (section: ReportSection): string => {
    console.log('[Template] Rendering executive summary section');

    // Find the executive-summary subsection
    const execSummarySubsection = section.subsections?.find(s => s.id === 'executive-summary');

    if (!execSummarySubsection || !execSummarySubsection.fields || execSummarySubsection.fields.length === 0) {
      return `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      <div class="empty-state-block">[Add content to Executive Summary]</div>
    </div>
      `;
    }

    // Extract data fields
    const fields = execSummarySubsection.fields;
    const propertyType = fields.find(f => f.id === 'property-type')?.value || '[Not provided]';
    const yearBuilt = fields.find(f => f.id === 'year-built')?.value || '[Not provided]';
    const units = fields.find(f => f.id === 'units')?.value || '[Not provided]';
    const stories = fields.find(f => f.id === 'stories')?.value || '[Not provided]';
    const grossArea = fields.find(f => f.id === 'gross-area')?.value || '[Not provided]';
    const lotSize = fields.find(f => f.id === 'lot-size')?.value || '[Not provided]';
    const parking = fields.find(f => f.id === 'parking')?.value || '[Not provided]';
    const zoning = fields.find(f => f.id === 'zoning')?.value || '[Not provided]';

    return `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      <div class="subsection">
        <table class="exec-summary-table">
          <tr>
            <td class="exec-label">Property Type:</td>
            <td class="exec-value">${propertyType}</td>
            <td class="exec-label">Year Built:</td>
            <td class="exec-value">${yearBuilt}</td>
          </tr>
          <tr>
            <td class="exec-label">Units:</td>
            <td class="exec-value">${units}</td>
            <td class="exec-label">Stories:</td>
            <td class="exec-value">${stories}</td>
          </tr>
          <tr>
            <td class="exec-label">Gross Area:</td>
            <td class="exec-value">${grossArea}</td>
            <td class="exec-label">Lot Size:</td>
            <td class="exec-value">${lotSize}</td>
          </tr>
          <tr>
            <td class="exec-label">Parking:</td>
            <td class="exec-value">${parking}</td>
            <td class="exec-label">Zoning:</td>
            <td class="exec-value">${zoning}</td>
          </tr>
        </table>
      </div>
    </div>
    `;
  };

  // Helper: Render inspection findings section with subsections
  const renderInspectionFindings = (section: ReportSection): string => {
    console.log('[Template] Rendering inspection findings section');

    if (!section.subsections || section.subsections.length === 0) {
      return `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      <div class="empty-state-block">[Add inspection findings subsections]</div>
    </div>
      `;
    }

    let sectionHtml = `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
    `;

    // Render each subsection
    section.subsections.forEach(subsection => {
      if (!subsection.fields || subsection.fields.length === 0) return;

      sectionHtml += `
      <div class="subsection">
        <h3 class="subsection-title">${subsection.title}</h3>
        <div class="field-group">
      `;

      subsection.fields.forEach(field => {
        sectionHtml += renderField(field);
      });

      sectionHtml += `
        </div>
      </div>
      `;
    });

    sectionHtml += `
    </div>
    `;

    return sectionHtml;
  };

  // Helper: Render capital needs section with subsections and cap rate table
  const renderCapitalNeeds = (section: ReportSection): string => {
    console.log('[Template] Rendering capital needs section');

    if (!section.subsections || section.subsections.length === 0) {
      return `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      <div class="empty-state-block">[Add capital needs subsections]</div>
    </div>
      `;
    }

    let sectionHtml = `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
    `;

    // Check if cap-rate-table subsection exists
    const capRateSubsection = section.subsections.find(s => s.id === 'cap-rate-table');

    if (capRateSubsection && capRateSubsection.fields && capRateSubsection.fields.length > 0) {
      // Render cap rate table
      sectionHtml += `
      <div class="subsection">
        <h3 class="subsection-title">${capRateSubsection.title}</h3>
        <table class="cap-rate-table">
          <thead>
            <tr>
              <th class="cap-table-header">Component</th>
              <th class="cap-table-header">Immediate</th>
              <th class="cap-table-header">Year 1-5</th>
              <th class="cap-table-header">Year 6-10</th>
              <th class="cap-table-header">Year 11+</th>
              <th class="cap-table-header">Total</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Group fields by component (each component has 5 fields: immediate, yr1-5, yr6-10, yr11, total)
      const components = [
        { id: 'site', label: 'Site Improvements' },
        { id: 'structure', label: 'Structure' },
        { id: 'exterior', label: 'Exterior' },
        { id: 'roofing', label: 'Roofing' },
        { id: 'mechanical', label: 'Mechanical' },
        { id: 'electrical', label: 'Electrical' },
        { id: 'plumbing', label: 'Plumbing' },
        { id: 'interior', label: 'Interior' },
        { id: 'other', label: 'Other' }
      ];

      components.forEach(({ id, label }) => {
        const immediate = capRateSubsection.fields.find(f => f.id === `${id}-immediate`)?.value || 0;
        const yr1to5 = capRateSubsection.fields.find(f => f.id === `${id}-yr1-5`)?.value || 0;
        const yr6to10 = capRateSubsection.fields.find(f => f.id === `${id}-yr6-10`)?.value || 0;
        const yr11plus = capRateSubsection.fields.find(f => f.id === `${id}-yr11`)?.value || 0;
        const total = capRateSubsection.fields.find(f => f.id === `${id}-total`)?.value || 0;

        const formatCurrency = (val: unknown) => {
          const num = typeof val === 'number' ? val : parseFloat(String(val));
          return isNaN(num) ? '$0' :
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
        };

        sectionHtml += `
            <tr>
              <td class="cap-table-label">${label}</td>
              <td class="cap-table-value">${formatCurrency(immediate)}</td>
              <td class="cap-table-value">${formatCurrency(yr1to5)}</td>
              <td class="cap-table-value">${formatCurrency(yr6to10)}</td>
              <td class="cap-table-value">${formatCurrency(yr11plus)}</td>
              <td class="cap-table-value">${formatCurrency(total)}</td>
            </tr>
        `;
      });

      // Add totals row
      const totalImmediate = components.reduce((sum, { id }) => {
        const val = capRateSubsection.fields.find(f => f.id === `${id}-immediate`)?.value || 0;
        return sum + (typeof val === 'number' ? val : parseFloat(String(val)));
      }, 0);
      const totalYr1to5 = components.reduce((sum, { id }) => {
        const val = capRateSubsection.fields.find(f => f.id === `${id}-yr1-5`)?.value || 0;
        return sum + (typeof val === 'number' ? val : parseFloat(String(val)));
      }, 0);
      const totalYr6to10 = components.reduce((sum, { id }) => {
        const val = capRateSubsection.fields.find(f => f.id === `${id}-yr6-10`)?.value || 0;
        return sum + (typeof val === 'number' ? val : parseFloat(String(val)));
      }, 0);
      const totalYr11plus = components.reduce((sum, { id }) => {
        const val = capRateSubsection.fields.find(f => f.id === `${id}-yr11`)?.value || 0;
        return sum + (typeof val === 'number' ? val : parseFloat(String(val)));
      }, 0);
      const grandTotal = components.reduce((sum, { id }) => {
        const val = capRateSubsection.fields.find(f => f.id === `${id}-total`)?.value || 0;
        return sum + (typeof val === 'number' ? val : parseFloat(String(val)));
      }, 0);

      const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);
      };

      sectionHtml += `
            <tr class="cap-value-total">
              <td class="cap-table-label"><strong>TOTAL</strong></td>
              <td class="cap-table-value"><strong>${formatCurrency(totalImmediate)}</strong></td>
              <td class="cap-table-value"><strong>${formatCurrency(totalYr1to5)}</strong></td>
              <td class="cap-table-value"><strong>${formatCurrency(totalYr6to10)}</strong></td>
              <td class="cap-table-value"><strong>${formatCurrency(totalYr11plus)}</strong></td>
              <td class="cap-table-value"><strong>${formatCurrency(grandTotal)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      `;
    }

    // Render other subsections (non-cap-rate-table)
    section.subsections.forEach(subsection => {
      if (subsection.id === 'cap-rate-table') return; // Already rendered above
      if (!subsection.fields || subsection.fields.length === 0) return;

      sectionHtml += `
      <div class="subsection">
        <h3 class="subsection-title">${subsection.title}</h3>
        <div class="field-group">
      `;

      subsection.fields.forEach(field => {
        sectionHtml += renderField(field);
      });

      sectionHtml += `
        </div>
      </div>
      `;
    });

    sectionHtml += `
    </div>
    `;

    return sectionHtml;
  };

  // Helper: Render photos section
  // Now reads from image-mgt section (single source of truth for all images)
  const renderPhotosSection = (_section: ReportSection): string => {
    // Photo subsections mapping: subsection ID -> display title
    const photoSubsections = [
      { id: 'exterior-photos', title: 'EXTERIOR PHOTOGRAPHS' },
      { id: 'street-photos', title: 'STREET VIEW PHOTOGRAPHS' },
      { id: 'common-photos', title: 'INTERIOR COMMON AREA' },
      { id: 'unit-photos', title: 'UNIT INTERIOR PHOTOGRAPHS' },
      { id: 'systems-photos', title: 'BUILDING SYSTEMS' },
    ];

    // Check if image-mgt section has any photos
    if (!imageMgtSection || !imageMgtSection.subsections) {
      return `
    <div class="section">
      <h2 class="section-title">Photos</h2>
      <div class="empty-state-block">[Add photos in S3 IMAGE MGT section]</div>
    </div>
      `;
    }

    let photosHtml = `
    <div class="section">
      <h2 class="section-title">Photos</h2>
    `;

    let hasAnyPhotos = false;

    // Process each photo subsection from image-mgt
    photoSubsections.forEach(({ id: subsectionId, title: subsectionTitle }) => {
      const subsection = imageMgtSection.subsections?.find(s => s.id === subsectionId);
      if (!subsection || !subsection.fields || subsection.fields.length === 0) return;

      // Extract photo fields and their captions
      const photoData: Array<{ imageUrl: string; caption: string }> = [];

      // Group fields by their base name (e.g., 'img-exterior-1' and 'img-exterior-1-caption')
      const fieldMap = new Map<string, { imageUrl: string | null; caption: string }>();

      subsection.fields.forEach(field => {
        if (field.type === 'image') {
          // This is an image field - handle both string and array values
          let imageUrl: string | null = null;
          if (typeof field.value === 'string' && field.value) {
            imageUrl = field.value;
          } else if (Array.isArray(field.value) && field.value.length > 0) {
            imageUrl = field.value[0] as string;
          }
          const baseId = field.id;

          if (!fieldMap.has(baseId)) {
            fieldMap.set(baseId, { imageUrl, caption: '' });
          } else {
            const existing = fieldMap.get(baseId)!;
            existing.imageUrl = imageUrl;
          }
        } else if (field.id.endsWith('-caption')) {
          // This is a caption field
          const baseId = field.id.replace('-caption', '');
          const caption = String(field.value || '');

          if (!fieldMap.has(baseId)) {
            fieldMap.set(baseId, { imageUrl: null, caption });
          } else {
            const existing = fieldMap.get(baseId)!;
            existing.caption = caption;
          }
        }
      });

      // Convert map to array (only include entries with valid images)
      fieldMap.forEach(data => {
        if (data.imageUrl) {
          photoData.push({ imageUrl: data.imageUrl, caption: data.caption });
        }
      });

      if (photoData.length === 0) return;

      hasAnyPhotos = true;

      // Add subsection title
      photosHtml += `
      <h3 class="subsection-title">${subsectionTitle}</h3>
      <table class="photo-grid">
      `;

      // Render photos in 2-column grid (2 photos per row)
      for (let i = 0; i < photoData.length; i += 2) {
        photosHtml += `
        <tr>
          <td class="photo-item">
            <img src="${photoData[i].imageUrl}" alt="Photo" style="max-width: 100%; height: auto;" />
            <p class="photo-caption">${photoData[i].caption}</p>
          </td>
        `;

        // Add second photo in row if available
        if (i + 1 < photoData.length) {
          photosHtml += `
          <td class="photo-item">
            <img src="${photoData[i + 1].imageUrl}" alt="Photo" style="max-width: 100%; height: auto;" />
            <p class="photo-caption">${photoData[i + 1].caption}</p>
          </td>
        `;
        } else {
          // Odd number of photos - add empty cell
          photosHtml += `
          <td class="photo-item"></td>
        `;
        }

        photosHtml += `
        </tr>
        `;
      }

      photosHtml += `
      </table>
      `;
    });

    // If no photos found at all, show empty state
    if (!hasAnyPhotos) {
      return `
    <div class="section">
      <h2 class="section-title">Photos</h2>
      <div class="empty-state-block">[Add photos in S3 IMAGE MGT section]</div>
    </div>
      `;
    }

    photosHtml += `
    </div>
    `;

    return photosHtml;
  };

  // Helper function to render the CERTIFICATION section
  const renderCertificationSection = (): string => {
    // Get current date for the certification
    const certDate = reportDate || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Extract signature from cert section if available
    let signatureUrl = '';
    if (certSection?.fields) {
      const sigField = certSection.fields.find(f => f.id === 'signature' || f.type === 'image');
      if (sigField?.value) {
        if (typeof sigField.value === 'string') {
          signatureUrl = sigField.value;
        } else if (Array.isArray(sigField.value) && sigField.value.length > 0) {
          signatureUrl = sigField.value[0] as string;
        }
      }
    }

    // Extract inspector name from cert section or use default
    let inspectorName = 'Christopher Crowe';
    if (certSection?.fields) {
      const nameField = certSection.fields.find(f => f.id === 'inspector-name');
      if (nameField?.value) {
        inspectorName = String(nameField.value);
      }
    }

    return `
    <div class="section certification-section">
      <h2 class="section-title">CERTIFICATION</h2>

      <div class="cert-statement">
        <p>I certify that, to the best of my knowledge and belief, the statements of fact contained in this report are true and correct. This inspection was conducted in accordance with industry standards and professional practices.</p>

        <p>This report reflects the condition of the property as observed during the inspection conducted on ${certDate}. The findings and recommendations are based on visual observations and available documentation at the time of inspection.</p>

        <p>This certification is provided in accordance with professional inspection standards and represents an objective assessment of the property's physical condition.</p>
      </div>

      <div class="cert-signature-block">
        ${signatureUrl ? `
        <div class="cert-signature-image">
          <img src="${signatureUrl}" alt="Signature" style="max-width: 300px; height: auto;" />
        </div>
        ` : `
        <div class="cert-signature-line"></div>
        `}
        <div class="cert-signature-info">
          <p class="cert-name">${inspectorName}</p>
          <p class="cert-title">Certified Property Inspector</p>
          <p class="cert-date">${certDate}</p>
        </div>
      </div>
    </div>
    `;
  };

  // Helper: Render a generic section
  const renderSection = (section: ReportSection): string => {
    console.log('[Template] Rendering section:', section.id, section.title);

    // Handle special sections
    if (section.id === 'cover-page') {
      return ''; // Cover page rendered separately
    }

    if (section.id === 'image-mgt') {
      return ''; // Image management section not rendered (source for S4-photos)
    }

    if (section.id === 'S1-exec') {
      return renderExecutiveSummary(section);
    }

    if (section.id === 'S2-findings') {
      return renderInspectionFindings(section);
    }

    if (section.id === 'S3-capital') {
      return renderCapitalNeeds(section);
    }

    if (section.id === 'S4-photos') {
      return renderPhotosSection(section);
    }

    if (section.id === 'S5-cert') {
      return renderCertificationSection();
    }

    // Generic section rendering
    // Check if section has subsections
    if (section.subsections && section.subsections.length > 0) {
      let sectionHtml = `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      `;

      section.subsections.forEach(subsection => {
        if (!subsection.fields || subsection.fields.length === 0) return;

        sectionHtml += `
      <div class="subsection">
        <h3 class="subsection-title">${subsection.title}</h3>
        <div class="field-group">
        `;

        subsection.fields.forEach(field => {
          sectionHtml += renderField(field);
        });

        sectionHtml += `
        </div>
      </div>
        `;
      });

      sectionHtml += `
    </div>
      `;

      return sectionHtml;
    }

    // Section with direct fields (no subsections)
    if (section.fields && section.fields.length > 0) {
      let sectionHtml = `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      <div class="field-group">
      `;

      section.fields.forEach(field => {
        sectionHtml += renderField(field);
      });

      sectionHtml += `
      </div>
    </div>
      `;

      return sectionHtml;
    }

    // Empty section
    return `
    <div class="section">
      <h2 class="section-title">${section.title}</h2>
      <div class="empty-state-block">[No content added]</div>
    </div>
    `;
  };

  // Generate HTML for all sections
  const coverPageHtml = renderCoverPage();

  // Render sections in order (skip cover-page, it's already rendered)
  const sectionsHtml = reportData.sections
    .filter(s => s.id !== 'cover-page')
    .map(section => renderSection(section))
    .join('\n');

  // Combine everything into final HTML
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle}</title>
  <style>
    /* ============================================
       CRITICAL CSS VARIABLE DEFINITIONS
       These MUST be defined first before any usage
       ============================================ */
    :root {
      /* Primary Brand Colors */
      --primary-blue: #1e3a5f;
      --accent-blue: #2c5282;

      /* Text Colors */
      --text-dark: #1a202c;
      --text-gray: #4a5568;
      --text-light-gray: #718096;
      --text-dark-gray: #2d3748;

      /* Background Colors */
      --bg-light: #f7fafc;
      --bg-white: #ffffff;

      /* Border Colors */
      --border-gray: #e2e8f0;
      --border-light: #cbd5e0;

      /* Spacing */
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;

      /* Typography */
      --font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      --font-size-base: 11pt;
      --font-size-small: 9pt;
      --line-height-base: 1.6;
    }

    /* ============================================
       BASE STYLES
       ============================================ */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      line-height: var(--line-height-base);
      color: var(--text-dark);
      background: var(--bg-white);
    }

    /* Page Layout */
    @page {
      size: letter;
      margin: 0.75in;
    }

    /* ============================================
       COVER PAGE STYLES
       ============================================ */
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
    }

    .cover-image-container {
      width: 100%;
      height: 400px;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .cover-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .cover-title {
      font-size: 32pt;
      font-weight: 700;
      color: var(--primary-blue);
      margin: 0;
      padding: 1rem 0;
    }

    .cover-blue-section {
      background-color: var(--primary-blue);
      padding: 2.5rem 2rem;
      margin-top: auto;
      color: white;
    }

    .cover-property-info {
      margin-bottom: 2rem;
    }

    .cover-property-name {
      font-size: 24pt;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: white;
    }

    .cover-address,
    .cover-city-state-zip {
      font-size: 14pt;
      margin: 0.25rem 0;
      color: white;
      font-weight: 400;
    }

    .cover-metadata {
      border-top: 2px solid rgba(255, 255, 255, 0.3);
      padding-top: 1.5rem;
    }

    .cover-meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: white;
    }

    .cover-meta-label {
      font-weight: 600;
      font-size: 12pt;
      color: white;
    }

    .cover-meta-value {
      font-size: 12pt;
      color: white;
      font-weight: 400;
    }

    /* ============================================
       SECTION STYLES
       ============================================ */
    .section {
      margin-bottom: var(--spacing-xl);
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 18pt;
      font-weight: 700;
      color: var(--primary-blue);
      border-bottom: 2px solid var(--primary-blue);
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    .subsection {
      margin-bottom: var(--spacing-lg);
    }

    .subsection-title {
      font-size: 14pt;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.75rem;
    }

    /* ============================================
       FIELD STYLES
       ============================================ */
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .field-item {
      display: flex;
      gap: 0.5rem;
      align-items: baseline;
    }

    .field-label {
      font-weight: 600;
      color: var(--text-dark);
      min-width: 150px;
      flex-shrink: 0;
    }

    .field-value {
      color: var(--text-gray);
      flex: 1;
    }

    .empty-value {
      color: var(--text-light-gray);
      font-style: italic;
    }

    .empty-state-block {
      padding: 2rem;
      text-align: center;
      color: var(--text-light-gray);
      font-style: italic;
      background: var(--bg-light);
      border: 1px dashed var(--border-light);
      border-radius: 4px;
    }

    /* ============================================
       EXECUTIVE SUMMARY TABLE
       ============================================ */
    .exec-summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .exec-summary-table td {
      padding: 0.5rem;
      border: 1px solid var(--border-gray);
    }

    .exec-label {
      font-weight: 600;
      background: var(--bg-light);
      width: 25%;
    }

    .exec-value {
      color: var(--text-gray);
      width: 25%;
    }

    /* ============================================
       CAP RATE TABLE
       ============================================ */
    .cap-rate-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      font-size: 10pt;
    }

    .cap-rate-table th,
    .cap-rate-table td {
      padding: 0.5rem;
      border: 1px solid var(--border-gray);
      text-align: left;
    }

    .cap-table-header {
      background: var(--primary-blue);
      color: white;
      font-weight: 600;
      text-align: center;
    }

    .cap-table-label {
      font-weight: 600;
      background: var(--bg-light);
    }

    .cap-table-value {
      text-align: right;
      font-family: 'Courier New', monospace;
    }

    .cap-value-total {
      background: var(--bg-light);
      font-weight: bold;
    }

    .cap-value-total .cap-table-value {
      font-weight: bold;
    }


    /* PHOTOS Section Grid Styles */
    .photo-grid {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .photo-item {
      width: 50%;
      padding: 10px;
      text-align: center;
      vertical-align: top;
    }

    .photo-item img {
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .photo-caption {
      font-size: 11px;
      margin-top: 8px;
      font-style: italic;
      color: #666;
      line-height: 1.4;
    }

    /* CERTIFICATION Section Styles */
    .cert-statement {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .cert-statement p {
      text-align: justify;
      line-height: 1.8;
    }

    .cert-signature-block {
      margin-top: 3rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .cert-signature-image {
      margin-bottom: 0.5rem;
    }

    .cert-signature-line {
      width: 300px;
      border-bottom: 1px solid var(--text-dark);
      margin-bottom: 0.5rem;
      height: 60px;
    }

    .cert-signature-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .cert-name {
      font-weight: 600;
      font-size: 12pt;
      color: var(--text-dark);
    }

    .cert-title {
      font-size: 10pt;
      color: var(--text-gray);
    }

    .cert-date {
      font-size: 10pt;
      color: var(--text-gray);
    }

    /* ============================================
       UTILITY CLASSES
       ============================================ */
    .page-break {
      page-break-before: always;
    }

    .no-break {
      page-break-inside: avoid;
    }

    /* Print-specific styles */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .cover-page {
        page-break-after: always;
      }

      .section {
        page-break-inside: avoid;
      }
    }

    /* ============================================
       PHASE 0 REFERENCE DESIGN PATTERNS
       These styles match the extracted reference pages
       ============================================ */

    /* P01: Cover Page Layout */
    .cover-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .cover-hero-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      margin-bottom: 20px;
    }

    .cover-title-block {
      text-align: center;
      margin: 40px 0;
    }

    .cover-main-title {
      font-size: 36pt;
      font-weight: 700;
      color: var(--primary-blue);
      margin-bottom: 10px;
    }

    .cover-subtitle {
      font-size: 18pt;
      color: var(--text-gray);
    }

    .cover-info-box {
      background: var(--primary-blue);
      color: white;
      padding: 30px;
      margin-top: auto;
    }

    .cover-property-address {
      font-size: 20pt;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .cover-detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }

    .cover-detail-label {
      font-weight: 600;
    }

    .cover-detail-value {
      font-weight: 400;
    }

    /* P02: Executive Summary Table Layout */
    .exec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: var(--border-gray);
      border: 1px solid var(--border-gray);
    }

    .exec-cell {
      background: white;
      padding: 12px;
      display: flex;
      flex-direction: column;
    }

    .exec-cell-label {
      font-weight: 600;
      font-size: 9pt;
      color: var(--text-gray);
      margin-bottom: 4px;
    }

    .exec-cell-value {
      font-size: 11pt;
      color: var(--text-dark);
    }

    /* P03: Inspection Findings Section */
    .findings-category {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }

    .findings-category-title {
      background: var(--primary-blue);
      color: white;
      padding: 10px 15px;
      font-size: 14pt;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .findings-item {
      margin-bottom: 20px;
      padding-left: 20px;
      border-left: 3px solid var(--accent-blue);
    }

    .findings-item-title {
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .findings-item-description {
      color: var(--text-gray);
      line-height: 1.6;
    }

    /* P04: Capital Needs Table */
    .cap-table-wrapper {
      overflow-x: auto;
      margin: 20px 0;
    }

    .cap-needs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
    }

    .cap-needs-table th {
      background: var(--primary-blue);
      color: white;
      padding: 10px 8px;
      text-align: center;
      font-weight: 600;
      border: 1px solid white;
    }

    .cap-needs-table td {
      padding: 8px;
      border: 1px solid var(--border-gray);
      text-align: right;
    }

    .cap-needs-table td:first-child {
      text-align: left;
      font-weight: 600;
      background: var(--bg-light);
    }

    .cap-needs-total-row {
      background: var(--bg-light);
      font-weight: 700;
    }

    .cap-amount {
      font-family: 'Courier New', monospace;
      white-space: nowrap;
    }

    /* P05: Two-Column Text Layout */
    .two-col-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin: 20px 0;
    }

    .text-column h4 {
      color: var(--primary-blue);
      font-size: 12pt;
      margin-bottom: 10px;
    }

    .text-column p {
      text-align: justify;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    .text-column ul {
      margin-left: 20px;
      white-space: nowrap;
    }

    /* P06: Photo Grid (2x3) */
    .photo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(3, auto);
      gap: 20px;
      margin-top: 20px;
    }

    .photo-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      page-break-inside: avoid;
    }

    .photo-item img {
      width: 100%;
      height: auto;
      max-height: 250px;
      object-fit: cover;
      border: 1px solid var(--border-gray);
    }

    .photo-caption {
      font-size: 9pt;
      text-align: center;
      margin-top: 8px;
      font-weight: 600;
      color: var(--text-dark-gray);
    }

    /* P08: Full-Width Map Container */
    .map-container {
      width: 100%;
      margin-top: 20px;
      page-break-inside: avoid;
    }

    .map-container img {
      width: 100%;
      height: auto;
      border: 1px solid var(--border-gray);
    }

    .map-caption {
      text-align: center;
      font-size: 9pt;
      margin-top: 8px;
      color: var(--text-gray);
    }

    /* P09: Certification Page */
    .cert-page {
      page-break-before: always;
      padding: 40px 0;
    }

    .cert-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .cert-header h2 {
      font-size: 20pt;
      color: var(--primary-blue);
      margin-bottom: 10px;
    }

    .cert-body {
      max-width: 700px;
      margin: 0 auto;
    }

    .cert-paragraph {
      text-align: justify;
      line-height: 1.8;
      margin-bottom: 20px;
    }

    .cert-signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .cert-sig-block {
      flex: 1;
      max-width: 250px;
    }

    .cert-sig-line {
      border-top: 1px solid var(--text-dark);
      margin-bottom: 8px;
    }

    .cert-sig-label {
      font-size: 9pt;
      color: var(--text-gray);
    }

    .cert-sig-value {
      font-size: 11pt;
      font-weight: 600;
      color: var(--text-dark);
    }

  </style>
</head>
<body>
  ${coverPageHtml}
  ${sectionsHtml}
</body>
</html>
  `.trim();
};
