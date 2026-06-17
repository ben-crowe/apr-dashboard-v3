import { ReportSection } from '../types/reportBuilder.types';

export function generateReportHtml(sections: ReportSection[]): string {
  const coverSection = sections.find(s => s.id === 'cover');
  const execSection = sections.find(s => s.id === 'exec');

  // Helper function to get field value
  const getFieldValue = (section: ReportSection | undefined, fieldId: string): string => {
    if (!section) return '';

    // Check main fields
    const mainField = section.fields.find(f => f.id === fieldId);
    if (mainField) return String(mainField.value || '');

    // Check subsection fields
    if (section.subsections) {
      for (const subsection of section.subsections) {
        const subField = subsection.fields.find(f => f.id === fieldId);
        if (subField) return String(subField.value || '');
      }
    }

    return '';
  };

  // Cover page fields
  const propertyType = getFieldValue(coverSection, 'property-type-display');
  const propertyName = getFieldValue(coverSection, 'property-name');
  const streetAddress = getFieldValue(coverSection, 'street-address');
  const city = getFieldValue(coverSection, 'city');
  const province = getFieldValue(coverSection, 'province');
  const clientContactName = getFieldValue(coverSection, 'client-contact-name');
  const clientCompany = getFieldValue(coverSection, 'client-company');
  const clientAddress = getFieldValue(coverSection, 'client-address');
  const clientCity = getFieldValue(coverSection, 'client-city');
  const clientProvince = getFieldValue(coverSection, 'client-province');
  const clientPostal = getFieldValue(coverSection, 'client-postal');
  const appraiserCompany = getFieldValue(coverSection, 'appraiser-company');
  const appraiserAddress = getFieldValue(coverSection, 'appraiser-address');
  const appraiserPhone = getFieldValue(coverSection, 'appraiser-phone');
  const appraiserWebsite = getFieldValue(coverSection, 'appraiser-website');
  const valuationDate = getFieldValue(coverSection, 'valuation-date');
  const reportDate = getFieldValue(coverSection, 'report-date');
  const fileNumber = getFieldValue(coverSection, 'file-number');

  // Letter of Transmittal additional fields
  const valueScenario = getFieldValue(execSection, 'value-scenario') || 'As Stabilized';
  const propertyRights = getFieldValue(execSection, 'property-rights') || 'Fee Simple Estate';
  const buildingStyle = getFieldValue(execSection, 'building-style') || 'walkup';
  const totalBuildings = getFieldValue(execSection, 'total-buildings') || '1';
  const totalNra = getFieldValue(execSection, 'total-nra') || '';
  const yearBuilt = getFieldValue(execSection, 'year-built') || '';
  const occupancyRate = getFieldValue(execSection, 'occupancy-rate') || '100';
  const totalUnits = getFieldValue(execSection, 'total-units') || '';
  const stories = getFieldValue(execSection, 'stories') || '1';
  const buildingFormat = getFieldValue(execSection, 'building-format') || 'garden style';
  const concludedValue = getFieldValue(execSection, 'concluded-value') || '';
  const hypotheticalConditions = getFieldValue(execSection, 'hypothetical-conditions') || 'No Hypothetical Conditions were made for this assignment.';
  const extraordinaryAssumptions = getFieldValue(execSection, 'extraordinary-assumptions') || 'No Extraordinary Assumptions were made for this assignment.';
  const extraordinaryLimitingConditions = getFieldValue(execSection, 'extraordinary-limiting-conditions') || 'No Extraordinary Limiting Conditions were made for this assignment.';
  const appraiserName = getFieldValue(coverSection, 'appraiser-name') || '';
  const appraiserCredentials = getFieldValue(coverSection, 'appraiser-credentials') || '';
  const appraiserTitle = getFieldValue(coverSection, 'appraiser-title') || '';
  const appraiserEmail = getFieldValue(coverSection, 'appraiser-email') || '';
  const appraiserAicNumber = getFieldValue(coverSection, 'appraiser-aic-number') || '';

  // Formatting helpers
  const formatCurrency = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
  };

  const formatPercent = (value: string): string => {
    if (!value) return "";
    const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return value;
    return `${num.toFixed(1)}%`;
  };

  const propertyTypeLower = propertyType.toLowerCase();
  const appraiserCompanyShort = appraiserCompany.split(' ')[0] || appraiserCompany;

  // Extract cover photo from the cover-photo field
  const coverPhotoUrls = coverSection?.fields.find(f => f.id === 'cover-photo')?.value as string[] || [];
  const coverPhoto = coverPhotoUrls.length > 0 ? coverPhotoUrls[0] : null;

  // Helper function to render the SITE section with custom template
  // Helper function to render the SITE section with custom template - EXPANDED VERSION
  const renderSiteSection = (section: ReportSection): string => {
    // Get field values from subsections - EXISTING FIELDS
    const siteAreaSf = getFieldValue(section, 'site-total-area');
    const siteAcreage = getFieldValue(section, 'site-acreage');
    const siteAddress = getFieldValue(section, 'site-address') || `${streetAddress}, ${city}, ${province}`;
    const siteShape = getFieldValue(section, 'site-shape');
    const topography = getFieldValue(section, 'topography');
    const accessibility = getFieldValue(section, 'accessibility');
    const exposureVisibility = getFieldValue(section, 'exposure-visibility');

    // Adjacent uses
    const adjacentNorth = getFieldValue(section, 'adjacent-north');
    const adjacentSouth = getFieldValue(section, 'adjacent-south');
    const adjacentEast = getFieldValue(section, 'adjacent-east');
    const adjacentWest = getFieldValue(section, 'adjacent-west');

    // Site conditions
    const easements = getFieldValue(section, 'easements');
    const soils = getFieldValue(section, 'soils');
    const hazardousWaste = getFieldValue(section, 'hazardous-waste');
    const siteRating = getFieldValue(section, 'site-rating');
    const siteConclusion = getFieldValue(section, 'site-conclusion');

    // Site plan images
    const sitePlanImages = section.subsections
      ?.find(s => s.id === 'site-plan-images')
      ?.fields.find(f => f.id === 'site-plan-image')?.value as string[] || [];

    // Get IMPROVEMENTS section fields (for site improvements, parking, landscaping)
    const improvementsSection = sections.find(s => s.id === 'improvements');
    const siteImprovements = improvementsSection ? getFieldValue(improvementsSection, 'site-impv') : '';
    const landscaping = improvementsSection ? getFieldValue(improvementsSection, 'landscaping') : '';
    const parkingSpaces = improvementsSection ? getFieldValue(improvementsSection, 'parking-spaces') : '';
    const parkingRatio = improvementsSection ? getFieldValue(improvementsSection, 'parking-ratio') : '';
    const siteCoverage = improvementsSection ? getFieldValue(improvementsSection, 'impv-site-coverage') : '';

    return `
    <div class="section">
      <h2 class="section-title">Site Details</h2>

      <!-- PAGE 1: SITE OVERVIEW (0.5 page) -->
      <div class="site-overview-intro" style="margin-bottom: 2rem;">
        <p class="site-narrative-text">
          The subject property consists of ${siteAcreage ? `${Number(siteAcreage).toFixed(2)} acres (${siteAreaSf ? Number(siteAreaSf).toLocaleString() + ' SF' : ''})` : siteAreaSf ? `${Number(siteAreaSf).toLocaleString()} SF` : 'one parcel'} which is based on information obtained from property records. For the purposes of this report, we have relied on this site area and reserve the right to amend our analysis upon receipt of a formal legal plan. The following summarizes the salient characteristics of the subject site.
        </p>
      </div>

      <!-- PAGE 1-2: PHYSICAL CHARACTERISTICS TABLE (1 page) -->
      <h3 class="subsection-title">Physical Characteristics</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label" style="width: 35%;">Address</td>
            <td class="site-table-value">${siteAddress || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Site Area</td>
            <td class="site-table-value">
              ${siteAreaSf ? `${Number(siteAreaSf).toLocaleString()} SF` : ''}
              ${siteAreaSf && siteAcreage ? ' / ' : ''}
              ${siteAcreage ? `${Number(siteAcreage).toFixed(4)} AC` : ''}
              ${!siteAreaSf && !siteAcreage ? '<span class="empty-state">Not specified</span>' : ''}
            </td>
          </tr>
          <tr>
            <td class="site-table-label">Shape</td>
            <td class="site-table-value">${siteShape || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Topography</td>
            <td class="site-table-value">${topography || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Frontage</td>
            <td class="site-table-value">${exposureVisibility || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Access Points</td>
            <td class="site-table-value">${accessibility || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Corner Lot Status</td>
            <td class="site-table-value"><span class="empty-state">Not specified</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Adjacent Properties Sub-table -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Adjacent Properties</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label" style="width: 35%;">North</td>
            <td class="site-table-value">${adjacentNorth || '<span class="empty-state">Residential</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">South</td>
            <td class="site-table-value">${adjacentSouth || '<span class="empty-state">Residential</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">East</td>
            <td class="site-table-value">${adjacentEast || '<span class="empty-state">Residential</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">West</td>
            <td class="site-table-value">${adjacentWest || '<span class="empty-state">Residential</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Accessibility and Exposure Details -->
      <div style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Accessibility</h4>
        <p class="site-narrative-text">${accessibility || 'Access to the subject site is considered average overall.'}</p>

        <h4 class="site-narrative-label" style="margin-top: 1rem;">Exposure & Visibility</h4>
        <p class="site-narrative-text">${exposureVisibility || 'Exposure of the subject is considered average.'}</p>
      </div>

      <div class="page-break"></div>

      <!-- PAGE 2-3: UTILITIES (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Utilities</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label" style="width: 35%;">Water</td>
            <td class="site-table-value"><span class="empty-state">Municipal - Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Sewer</td>
            <td class="site-table-value"><span class="empty-state">Municipal - Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Electric</td>
            <td class="site-table-value"><span class="empty-state">Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Gas</td>
            <td class="site-table-value"><span class="empty-state">Available</span></td>
          </tr>
          <tr>
            <td class="site-table-label">Phone/Internet</td>
            <td class="site-table-value"><span class="empty-state">Available</span></td>
          </tr>
        </tbody>
      </table>

      <!-- PAGE 3: ENVIRONMENTAL (1 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Environmental Conditions</h3>

      ${soils || true ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Soils</h4>
          <p class="site-narrative-text">${soils || 'We have not undertaken a detailed soil analysis and we are not qualified to comment on soil conditions. As such, the soils are assumed to be similar to other lands in the area and suitable in drainage qualities and load bearing capacity to support the existing development.'}</p>
        </div>
      ` : ''}

      <div class="site-narrative-section" style="margin-top: 1rem;">
        <h4 class="site-narrative-label">Flood Zone Status</h4>
        <p class="site-narrative-text"><span class="empty-state">Based on available flood maps, the subject property is not located within a designated flood hazard area. Flood zone information should be verified with local authorities if required for specific purposes.</span></p>
      </div>

      ${hazardousWaste || true ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <h4 class="site-narrative-label">Hazardous Waste</h4>
          <p class="site-narrative-text">${hazardousWaste || 'Based on a review of an independent investigation to determine the presence or absence of toxins on the subject property, none are present. If questions arise, the reader is strongly cautioned to seek qualified professional assistance in this matter. Please see the Assumptions and Limiting Conditions for a full disclaimer.'}</p>
        </div>
      ` : ''}

      <div class="site-narrative-section" style="margin-top: 1rem;">
        <h4 class="site-narrative-label">Wetlands Status</h4>
        <p class="site-narrative-text"><span class="empty-state">No wetlands are known to exist on the subject property based on available environmental records and site inspection. Formal wetland delineation has not been conducted as part of this appraisal.</span></p>
      </div>

      <div class="page-break"></div>

      <!-- PAGE 4: EASEMENTS & ENCUMBRANCES (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Easements & Encumbrances</h3>
      ${easements || true ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${easements || 'A legal opinion regarding title information was not provided or commissioned in conjunction with this assignment. Under the scope of this appraisal, it is assumed that any legal notations and registered charges on title do not adversely affect the highest and best use of the subject property as described herein, unless otherwise noted. If there is any concern on the part of the reader with respect to the status of title, we recommend a legal opinion be obtained. A copy of the subject property title has been inserted in the appendix to this report if further information is required.'}</p>
        </div>
      ` : ''}

      <!-- PAGE 4-5: SITE IMPROVEMENTS (1 page) -->
      <h3 class="subsection-title" style="margin-top: 2rem;">Site Improvements</h3>

      <div class="site-narrative-section">
        <h4 class="site-narrative-label">Parking</h4>
        <table class="site-table" style="margin-top: 0.5rem;">
          <tbody>
            <tr>
              <td class="site-table-label" style="width: 35%;">Parking Type</td>
              <td class="site-table-value">${siteImprovements ? (siteImprovements.toString().toLowerCase().includes('paved') ? 'Paved surface parking' : siteImprovements.toString().toLowerCase().includes('gravel') ? 'Gravel surface parking' : 'Surface parking') : '<span class="empty-state">Surface parking</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Total Spaces</td>
              <td class="site-table-value">${parkingSpaces || '<span class="empty-state">Not specified</span>'}</td>
            </tr>
            <tr>
              <td class="site-table-label">Parking Ratio</td>
              <td class="site-table-value">${parkingRatio ? `${parkingRatio} spaces per unit` : '<span class="empty-state">Not specified</span>'}</td>
            </tr>
          </tbody>
        </table>
        ${parkingSpaces ? `
          <p class="site-narrative-text" style="margin-top: 0.5rem;">
            The subject provides ${parkingSpaces} parking spaces${parkingRatio ? ` and is therefore conforming to zoning requirements. The parking ratio of ${parkingRatio} per unit is within the typical range of spaces per unit and within zoning requirements` : ''}.
          </p>
        ` : ''}
      </div>

      ${landscaping || true ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <h4 class="site-narrative-label">Landscaping</h4>
          <p class="site-narrative-text">${landscaping || 'Landscaping around the building perimeter consists of shrubs and trees. The landscaping as proposed is well established and well maintained.'}</p>
        </div>
      ` : ''}

      <div class="site-narrative-section" style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Fencing</h4>
        <p class="site-narrative-text"><span class="empty-state">Standard perimeter fencing consistent with the property type and local area standards.</span></p>
      </div>

      <div class="site-narrative-section" style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Lighting</h4>
        <p class="site-narrative-text"><span class="empty-state">Exterior lighting is provided for parking areas, walkways, and building entrances for security and safety purposes.</span></p>
      </div>

      <div class="site-narrative-section" style="margin-top: 1.5rem;">
        <h4 class="site-narrative-label">Signage</h4>
        <p class="site-narrative-text"><span class="empty-state">Property identification signage is present and conforms to local signage ordinances.</span></p>
      </div>

      ${siteCoverage ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <h4 class="site-narrative-label">Site Coverage Ratio</h4>
          <p class="site-narrative-text">${siteCoverage}%, which is within market standards (20-35%) for similar properties in the area.</p>
        </div>
      ` : ''}

      ${siteImprovements ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <h4 class="site-narrative-label">General Site Improvements</h4>
          <p class="site-narrative-text">${siteImprovements}</p>
        </div>
      ` : ''}

      <div class="page-break"></div>

      <!-- PAGE 5: SITE RATING & CONCLUSION (0.5 page) -->
      ${siteRating || true ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Site Rating</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${siteRating || 'Overall, the subject site is considered average for its property type in terms of location, exposure, and access to employment, education, and shopping centers, based on its location characteristics.'}</p>
        </div>
      ` : ''}

      ${siteConclusion || true ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Site Conclusion</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${siteConclusion || 'In conclusion, the site\'s physical characteristics appear to be supportive of the subject\'s current use and there were no significant detriments discovered that would inhibit development in accordance with its highest and best use.'}</p>
        </div>
      ` : ''}

      <!-- Site Plan Images -->
      ${sitePlanImages.length > 0 ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Site Plans</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem;">
          ${sitePlanImages.map((url, index) => `
            <div style="border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden;">
              <img src="${url}" alt="Site Plan ${index + 1}" style="width: 100%; height: 250px; object-fit: cover;" />
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the TAX section with custom template
  const renderTaxSection = (section: ReportSection): string => {
    // Get field values from subsections
    const assessmentYear = getFieldValue(section, 'assessment-year');
    const landAssessment = getFieldValue(section, 'land-assessment');
    const buildingAssessment = getFieldValue(section, 'building-assessment');
    const totalAssessment = getFieldValue(section, 'total-assessment');
    const millRate = getFieldValue(section, 'mill-rate');
    const annualTaxes = getFieldValue(section, 'annual-taxes');
    const taxCommentary = getFieldValue(section, 'tax-commentary');

    return `
    <div class="section">
      <h2 class="section-title">Property Taxes & Assessment</h2>

      <!-- Property Taxes & Assessment Table -->
      <h3 class="subsection-title">Assessment & Tax Summary</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Assessment Year</td>
            <td class="site-table-value">${assessmentYear || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Land Assessment</td>
            <td class="site-table-value">${landAssessment ? formatCurrency(landAssessment) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Building Assessment</td>
            <td class="site-table-value">${buildingAssessment ? formatCurrency(buildingAssessment) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Total Assessment</td>
            <td class="site-table-value">${totalAssessment ? formatCurrency(totalAssessment) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Mill Rate</td>
            <td class="site-table-value">${millRate || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Annual Taxes</td>
            <td class="site-table-value">${annualTaxes ? formatCurrency(annualTaxes) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tax Commentary Narrative -->
      ${taxCommentary ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Tax Commentary</h3>
        <p class="site-narrative-text">${taxCommentary}</p>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the ZONE section with custom template
  const renderZoneSection = (section: ReportSection): string => {
    // Get field values from subsections
    const zoningClassification = getFieldValue(section, 'zoning-classification');
    const permittedUses = getFieldValue(section, 'permitted-uses');
    const maxHeight = getFieldValue(section, 'max-height');
    const maxDensity = getFieldValue(section, 'max-density');
    const minSetback = getFieldValue(section, 'min-setback');
    const parkingRequirements = getFieldValue(section, 'parking-requirements');
    const conformanceStatus = getFieldValue(section, 'conformance-status');
    const zoningConclusion = getFieldValue(section, 'zoning-conclusion');

    // Parse permitted uses if it's a comma-separated string or array
    let permittedUsesList: string[] = [];
    if (permittedUses) {
      if (typeof permittedUses === 'string') {
        permittedUsesList = permittedUses.split(',').map(use => use.trim()).filter(use => use);
      } else if (Array.isArray(permittedUses)) {
        permittedUsesList = permittedUses;
      }
    }

    const hasDevelopmentStandards = maxHeight || maxDensity || minSetback || parkingRequirements;

    return `
    <div class="section">
      <h2 class="section-title">Zoning Analysis</h2>

      <!-- Zoning Classification -->
      ${zoningClassification ? `
        <h3 class="subsection-title">Zoning Classification</h3>
        <p class="site-narrative-text">${zoningClassification}</p>
      ` : ''}

      <!-- Permitted Uses -->
      ${permittedUsesList.length > 0 ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Permitted Uses</h3>
        <ul style="margin-left: 2rem; line-height: 1.8; font-size: 12px;">
          ${permittedUsesList.map(use => `<li>${use}</li>`).join('')}
        </ul>
      ` : permittedUses ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Permitted Uses</h3>
        <p class="site-narrative-text">${permittedUses}</p>
      ` : ''}

      <!-- Development Standards Table -->
      ${hasDevelopmentStandards ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Development Standards</h3>
        <table class="site-table">
          <tbody>
            ${maxHeight ? `
              <tr>
                <td class="site-table-label">Maximum Height</td>
                <td class="site-table-value">${maxHeight}</td>
              </tr>
            ` : ''}
            ${maxDensity ? `
              <tr>
                <td class="site-table-label">Maximum Density</td>
                <td class="site-table-value">${maxDensity}</td>
              </tr>
            ` : ''}
            ${minSetback ? `
              <tr>
                <td class="site-table-label">Minimum Setback</td>
                <td class="site-table-value">${minSetback}</td>
              </tr>
            ` : ''}
            ${parkingRequirements ? `
              <tr>
                <td class="site-table-label">Parking Requirements</td>
                <td class="site-table-value">${parkingRequirements}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      ` : ''}

      <!-- Conformance Status -->
      ${conformanceStatus ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Conformance Status</h3>
        <p class="site-narrative-text">${conformanceStatus}</p>
      ` : ''}

      <!-- Zoning Conclusion -->
      ${zoningConclusion ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Zoning Conclusion</h3>
        <p class="site-narrative-text">${zoningConclusion}</p>
      ` : ''}

      ${!zoningClassification && !permittedUses && !hasDevelopmentStandards && !conformanceStatus && !zoningConclusion ? `
        <div class="empty-state">No zoning information provided</div>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the HBU (Highest & Best Use) section with custom template - EXPANDED VERSION
  const renderHbuSection = (section: ReportSection): string => {
    // Get field values - EXPANDED to include all fields
    const hbuIntroduction = getFieldValue(section, 'hbu-introduction') ||
      'The highest and best use of a property is defined as the legally permissible, physically possible, financially feasible, and maximally productive use that results in the highest value. This analysis serves as the foundation for the valuation process and determines the most reasonable and profitable use of the property to support its maximum present value.';

    const hbuMethodology = getFieldValue(section, 'hbu-methodology') ||
      'The analysis is completed through the following four tests:\n\n1. Legally Permissible - What uses are allowed under current zoning and regulatory requirements?\n2. Physically Possible - What uses are possible given the site\'s physical characteristics?\n3. Financially Feasible - What uses would generate sufficient income to justify development?\n4. Maximally Productive - Which legally permissible, physically possible, and financially feasible use produces the highest value?\n\nThis structured approach ensures a comprehensive evaluation of the property, moving from a broad market perspective to a focused determination of its optimal use.';

    // As Vacant Analysis - Four Tests
    const asVacantIntro = getFieldValue(section, 'as-vacant-intro') ||
      'In this section the highest and best use of the subject as though vacant is concluded after taking into consideration financial feasibility, maximal productivity, marketability, legal, and physical factors.';

    const legallyPermissible = getFieldValue(section, 'hbu-legally-permissible') ||
      getFieldValue(section, 'legally-permissible');
    const physicallyPossible = getFieldValue(section, 'hbu-physically-possible') ||
      getFieldValue(section, 'physically-possible');
    const financiallyFeasible = getFieldValue(section, 'hbu-financially-feasible') ||
      getFieldValue(section, 'financially-feasible');
    const maximallyProductive = getFieldValue(section, 'hbu-maximally-productive') ||
      getFieldValue(section, 'maximally-productive');
    const asVacantConclusion = getFieldValue(section, 'hbu-as-vacant-conclusion') ||
      getFieldValue(section, 'as-vacant-conclusion');

    // As Improved Analysis - Four Tests + Alternatives + Demolition Analysis
    const asImprovedIntro = getFieldValue(section, 'hbu-as-improved-intro');
    const asImprovedLegallyPermissible = getFieldValue(section, 'hbu-as-improved-legally-permissible');
    const asImprovedPhysicallyPossible = getFieldValue(section, 'hbu-as-improved-physically-possible');
    const asImprovedFinanciallyFeasible = getFieldValue(section, 'hbu-as-improved-financially-feasible');
    const asImprovedMaximallyProductive = getFieldValue(section, 'hbu-as-improved-maximally-productive');

    const asImprovedAlternatives = getFieldValue(section, 'hbu-as-improved-alternatives');
    const asImprovedDemolition = getFieldValue(section, 'hbu-as-improved-demolition');
    const asImprovedAnalysis = getFieldValue(section, 'hbu-as-improved-analysis') ||
      getFieldValue(section, 'as-improved-analysis');
    const asImprovedConclusion = getFieldValue(section, 'hbu-as-improved-conclusion') ||
      getFieldValue(section, 'as-improved-conclusion');

    // Most Probable Buyer
    const mostProbableBuyer = getFieldValue(section, 'hbu-most-probable-buyer') ||
      getFieldValue(section, 'most-probable-buyer');

    // Final HBU Conclusion
    const finalHbuConclusion = getFieldValue(section, 'hbu-final-conclusion') ||
      getFieldValue(section, 'final-hbu-conclusion');

    return `
    <div class="section">
      <h2 class="section-title">Highest & Best Use</h2>

      <!-- PAGE 1: INTRODUCTION (0.5 page) -->
      <h3 class="subsection-title">Introduction</h3>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${hbuIntroduction}</p>
      </div>

      <!-- HBU Methodology - Four Tests Explanation (0.5 page) -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">HBU Methodology</h3>
      <div class="site-narrative-section">
        <p class="site-narrative-text" style="white-space: pre-line;">${hbuMethodology}</p>
      </div>

      <div class="page-break"></div>

      <!-- PAGE 2: HIGHEST & BEST USE AS IF VACANT (1 page) -->
      <h2 class="section-title" style="margin-top: 2rem;">Highest & Best Use As If Vacant</h2>

      ${asVacantIntro ? `
        <div class="site-narrative-section" style="margin-bottom: 1.5rem;">
          <p class="site-narrative-text">${asVacantIntro}</p>
        </div>
      ` : ''}

      <!-- Test 1: Legally Permissible -->
      <div class="site-narrative-section">
        <h4 class="site-narrative-label">Legally Permissible</h4>
        ${legallyPermissible ? `
          <p class="site-narrative-text">${legallyPermissible}</p>
        ` : `
          <div class="empty-state">Private restrictions, zoning, building codes, historic district controls, and environmental regulations are considered, if applicable to the subject site. The legal factors influencing the highest and best use of the subject site are primarily government regulations such as zoning ordinances.</div>
        `}
      </div>

      <!-- Test 2: Physically Possible -->
      <div class="site-narrative-section" style="margin-top: 1rem;">
        <h4 class="site-narrative-label">Physically Possible</h4>
        ${physicallyPossible ? `
          <p class="site-narrative-text">${physicallyPossible}</p>
        ` : `
          <div class="empty-state">The test of what is physically possible for the subject site considers physical and locational characteristics that influence its highest and best use. There are no physical limitations that would prohibit development of the by-right uses on the site.</div>
        `}
      </div>

      <!-- Test 3: Financially Feasible -->
      <div class="site-narrative-section" style="margin-top: 1rem;">
        <h4 class="site-narrative-label">Financially Feasible</h4>
        ${financiallyFeasible ? `
          <p class="site-narrative-text">${financiallyFeasible}</p>
        ` : `
          <div class="empty-state">Based on the analysis of the subject's market and an examination of costs and investment metrics and real estate market attributes, development would likely have a value commensurate with its costs and requisite developer's profit.</div>
        `}
      </div>

      <!-- Test 4: Maximally Productive -->
      <div class="site-narrative-section" style="margin-top: 1rem;">
        <h4 class="site-narrative-label">Maximally Productive</h4>
        ${maximallyProductive ? `
          <p class="site-narrative-text">${maximallyProductive}</p>
        ` : `
          <div class="empty-state">Financial feasibility, maximal productivity, marketability, legal, and physical factors have been considered in determining the use that creates maximum value while conforming to the requirements of the first three tests.</div>
        `}
      </div>

      <!-- As Vacant Conclusion -->
      ${asVacantConclusion ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem; padding: 1rem; background-color: #f9fafb; border-left: 4px solid #3b82f6;">
          <h4 class="site-narrative-label">Highest & Best Use As If Vacant - Conclusion</h4>
          <p class="site-narrative-text" style="font-weight: bold;">${asVacantConclusion}</p>
        </div>
      ` : ''}

      <div class="page-break"></div>

      <!-- PAGE 3: HIGHEST & BEST USE AS IMPROVED (1 page) -->
      <h2 class="section-title" style="margin-top: 2rem;">Highest & Best Use As Improved</h2>

      ${asImprovedIntro ? `
        <div class="site-narrative-section" style="margin-bottom: 1.5rem;">
          <p class="site-narrative-text">${asImprovedIntro}</p>
        </div>
      ` : `
        <div class="site-narrative-section" style="margin-bottom: 1.5rem;">
          <p class="site-narrative-text">The legal factors influencing the highest and best use of the subject property are primarily governmental regulations such as zoning and building codes. The physical and locational characteristics of the subject improvements have been previously discussed in this report.</p>
        </div>
      `}

      <!-- As Improved - Four Tests Analysis -->
      ${asImprovedLegallyPermissible ? `
        <div class="site-narrative-section">
          <h4 class="site-narrative-label">Legally Permissible</h4>
          <p class="site-narrative-text">${asImprovedLegallyPermissible}</p>
        </div>
      ` : ''}

      ${asImprovedPhysicallyPossible ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <h4 class="site-narrative-label">Physically Possible</h4>
          <p class="site-narrative-text">${asImprovedPhysicallyPossible}</p>
        </div>
      ` : ''}

      ${asImprovedFinanciallyFeasible ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <h4 class="site-narrative-label">Financially Feasible</h4>
          <p class="site-narrative-text">${asImprovedFinanciallyFeasible}</p>
        </div>
      ` : ''}

      ${asImprovedMaximallyProductive ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <h4 class="site-narrative-label">Maximally Productive</h4>
          <p class="site-narrative-text">${asImprovedMaximallyProductive}</p>
        </div>
      ` : ''}

      <!-- Alternative Treatments Analysis -->
      ${asImprovedAlternatives ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <h4 class="site-narrative-label">Alternative Treatments</h4>
          <p class="site-narrative-text">${asImprovedAlternatives}</p>
        </div>
      ` : asImprovedAnalysis ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <p class="site-narrative-text">${asImprovedAnalysis}</p>
        </div>
      ` : `
        <div class="site-narrative-section" style="margin-top: 1.5rem;">
          <p class="site-narrative-text">The five possible alternative treatments of the property are: (1) redevelopment/demolition, (2) expansion, (3) renovation, (4) conversion, and (5) continued use "as-is". Each alternative is evaluated based on market conditions and financial feasibility.</p>
        </div>
      `}

      <!-- Demolition vs Continuation Analysis -->
      ${asImprovedDemolition ? `
        <div class="site-narrative-section" style="margin-top: 1rem;">
          <h4 class="site-narrative-label">Demolition Analysis</h4>
          <p class="site-narrative-text">${asImprovedDemolition}</p>
        </div>
      ` : ''}

      <!-- As Improved Conclusion -->
      ${asImprovedConclusion ? `
        <div class="site-narrative-section" style="margin-top: 1.5rem; padding: 1rem; background-color: #f9fafb; border-left: 4px solid #3b82f6;">
          <h4 class="site-narrative-label">Highest & Best Use As Improved - Conclusion</h4>
          <p class="site-narrative-text" style="font-weight: bold;">${asImprovedConclusion}</p>
        </div>
      ` : ''}

      <div class="page-break"></div>

      <!-- PAGE 4: MOST PROBABLE BUYER (0.5 page) -->
      ${mostProbableBuyer ? `
        <h3 class="subsection-title" style="margin-top: 2rem;">Most Probable Buyer</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${mostProbableBuyer}</p>
        </div>
      ` : ''}

      <!-- Final HBU Conclusion -->
      ${finalHbuConclusion ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Final Highest & Best Use Conclusion</h3>
        <div class="site-narrative-section" style="padding: 1rem; background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 4px;">
          <p class="site-narrative-text" style="font-weight: bold; font-size: 13px;">${finalHbuConclusion}</p>
        </div>
      ` : ''}
    </div>
    `;
  };

  // Helper function to render the RECON (Reconciliation) section with custom template
  const renderReconSection = (section: ReportSection): string => {
    // Get field values
    const reconIntroduction = getFieldValue(section, 'recon-introduction');

    // Value Summary Table data
    const incomeApproachValue = getFieldValue(section, 'income-approach-value');
    const incomeApproachWeight = getFieldValue(section, 'income-approach-weight');
    const salesComparisonValue = getFieldValue(section, 'sales-comparison-value');
    const salesComparisonWeight = getFieldValue(section, 'sales-comparison-weight');
    const costApproachValue = getFieldValue(section, 'cost-approach-value');
    const costApproachWeight = getFieldValue(section, 'cost-approach-weight');

    // Reconciliation Analysis
    const reconAnalysis = getFieldValue(section, 'recon-analysis');

    // Final Value Conclusion Table data
    const finalValueScenario = getFieldValue(section, 'final-value-scenario') || valueScenario;
    const finalInterestAppraised = getFieldValue(section, 'final-interest-appraised') || propertyRights;
    const finalEffectiveDate = getFieldValue(section, 'final-effective-date') || valuationDate;
    const finalConcludedValue = getFieldValue(section, 'final-concluded-value') || concludedValue;

    return `
    <div class="section">
      <h2 class="section-title">Reconciliation of Value</h2>

      <!-- Introduction -->
      ${reconIntroduction ? `
        <div class="site-narrative-section">
          <p class="site-narrative-text">${reconIntroduction}</p>
        </div>
      ` : ''}

      <!-- Value Summary Table -->
      ${(incomeApproachValue || salesComparisonValue || costApproachValue) ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Value Indications</h3>
        <table class="site-table">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 0.75rem; text-align: left; font-weight: 600; font-size: 11px;">Approach</th>
              <th style="padding: 0.75rem; text-align: right; font-weight: 600; font-size: 11px;">Value Indication</th>
              <th style="padding: 0.75rem; text-align: center; font-weight: 600; font-size: 11px;">Weight</th>
            </tr>
          </thead>
          <tbody>
            ${incomeApproachValue ? `
              <tr>
                <td class="site-table-label">Income Approach</td>
                <td class="site-table-value" style="text-align: right;">${formatCurrency(incomeApproachValue)}</td>
                <td class="site-table-value" style="text-align: center;">${incomeApproachWeight || 'Primary'}</td>
              </tr>
            ` : ''}
            ${salesComparisonValue ? `
              <tr>
                <td class="site-table-label">Sales Comparison Approach</td>
                <td class="site-table-value" style="text-align: right;">${formatCurrency(salesComparisonValue)}</td>
                <td class="site-table-value" style="text-align: center;">${salesComparisonWeight || 'Secondary'}</td>
              </tr>
            ` : ''}
            ${costApproachValue ? `
              <tr>
                <td class="site-table-label">Cost Approach</td>
                <td class="site-table-value" style="text-align: right;">${formatCurrency(costApproachValue)}</td>
                <td class="site-table-value" style="text-align: center;">${costApproachWeight || 'Not Used'}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      ` : ''}

      <!-- Reconciliation Analysis -->
      ${reconAnalysis ? `
        <h3 class="subsection-title" style="margin-top: 1.5rem;">Reconciliation Analysis</h3>
        <div class="site-narrative-section">
          <p class="site-narrative-text">${reconAnalysis}</p>
        </div>
      ` : ''}

      <!-- Final Value Conclusion -->
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Final Value Conclusion</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Value Scenario</td>
            <td class="site-table-value">${finalValueScenario}</td>
          </tr>
          <tr>
            <td class="site-table-label">Interest Appraised</td>
            <td class="site-table-value">${finalInterestAppraised}</td>
          </tr>
          <tr>
            <td class="site-table-label">Effective Date</td>
            <td class="site-table-value">${finalEffectiveDate}</td>
          </tr>
          <tr style="background-color: #eff6ff; font-weight: bold;">
            <td class="site-table-label">Concluded Market Value</td>
            <td class="site-table-value" style="font-size: 14px; color: #1e40af;">${formatCurrency(finalConcludedValue)}</td>
          </tr>
        </tbody>
      </table>

      ${!reconIntroduction && !incomeApproachValue && !salesComparisonValue && !reconAnalysis ? `
        <div class="empty-state">No reconciliation analysis provided</div>
      ` : ''}
    </div>
    `;
  };

  // Main report generation with all sections
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Appraisal Report - ${propertyName || streetAddress}</title>
      <style>
        @page {
          size: letter;
          margin: 0.75in;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12px;
          line-height: 1.6;
          color: #1f2937;
          background: white;
        }

        .cover-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          page-break-after: always;
          position: relative;
          padding: 2rem;
        }

        .cover-header {
          text-align: center;
        }

        .cover-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #111827;
        }

        .cover-subtitle {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .cover-address {
          font-size: 14px;
          margin-bottom: 2rem;
          color: #6b7280;
        }

        .cover-photo-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2rem 0;
        }

        .cover-photo {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
        }

        .cover-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .cover-section {
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 4px;
        }

        .cover-section-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .cover-section-content {
          font-size: 11px;
          color: #374151;
          line-height: 1.5;
        }

        .cover-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 2px solid #e5e7eb;
        }

        .cover-footer-item {
          font-size: 11px;
          margin: 0.25rem 0;
          color: #6b7280;
        }

        .section {
          margin-bottom: 2rem;
          page-break-inside: avoid;
        }

        .section-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #3b82f6;
          color: #1e40af;
        }

        .subsection-title {
          font-size: 14px;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .site-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 11px;
        }

        .site-table td {
          padding: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .site-table-label {
          font-weight: 600;
          color: #374151;
          width: 30%;
        }

        .site-table-value {
          color: #1f2937;
        }

        .site-narrative-section {
          margin: 1rem 0;
        }

        .site-narrative-label {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .site-narrative-text {
          font-size: 12px;
          line-height: 1.6;
          color: #374151;
          text-align: justify;
        }

        .empty-state {
          color: #9ca3af;
          font-style: italic;
          font-size: 11px;
        }

        .page-break {
          page-break-after: always;
        }

        @media print {
          .page-break {
            page-break-after: always;
          }

          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="cover-page">
        <div class="cover-header">
          <div class="cover-title">Appraisal Report</div>
          <div class="cover-subtitle">${propertyType}</div>
          <div class="cover-subtitle">${propertyName}</div>
          <div class="cover-address">
            ${streetAddress}<br>
            ${city}, ${province}
          </div>
        </div>

        ${coverPhoto ? `
          <div class="cover-photo-container">
            <img src="${coverPhoto}" alt="Property Photo" class="cover-photo">
          </div>
        ` : ''}

        <div class="cover-info">
          <div class="cover-section">
            <div class="cover-section-title">PREPARED FOR:</div>
            <div class="cover-section-content">
              ${clientContactName}<br>
              ${clientCompany}<br>
              ${clientAddress}<br>
              ${clientCity}, ${clientProvince} ${clientPostal}
            </div>
          </div>

          <div class="cover-section">
            <div class="cover-section-title">PREPARED BY:</div>
            <div class="cover-section-content">
              ${appraiserCompany}<br>
              ${appraiserAddress}<br>
              Office: ${appraiserPhone}<br>
              ${appraiserWebsite}
            </div>
          </div>
        </div>

        <div class="cover-footer">
          <div class="cover-footer-item">Date of Valuation: ${valuationDate}</div>
          <div class="cover-footer-item">Date of Report: ${reportDate}</div>
          <div class="cover-footer-item">File No: ${fileNumber}</div>
        </div>
      </div>

      <!-- Letter of Transmittal -->
      <div class="section">
        <div style="margin-bottom: 2rem;">
          <p style="margin-bottom: 1rem;">${reportDate}</p>
          <p style="margin-bottom: 1rem;">
            ${clientCompany}<br>
            ${clientAddress}<br>
            ${clientCity}, ${clientProvince} ${clientPostal}
          </p>
          <p style="margin-bottom: 1rem;">Attention: ${clientContactName},</p>
          <p style="margin-bottom: 1rem;">
            <strong>Re: ${valueScenario} (${propertyRights}) current market value for the property located at ${streetAddress}, ${city}, ${province}.</strong>
          </p>
        </div>

        <p style="margin-bottom: 1rem; text-align: justify;">
          ${appraiserCompany} is proud to present the appraisal report that satisfies the agreed upon scope of work with ${clientCompany}.
          The purpose of this assignment is to provide the ${valueScenario} current market value of the property which at the time of inspection
          represents the improved property as of the effective date${valueScenario.toLowerCase().includes('stabilized') ? ' and leased up at market rental rates and operating costs' : ''}
          for the property located at ${streetAddress}, ${city}, ${province} (herein referred to as the 'subject property').
        </p>

        <p style="margin-bottom: 1rem; text-align: justify;">
          The subject property, located at ${streetAddress}, ${city}, ${province}, is a ${propertyTypeLower}, ${buildingStyle} property
          with improvements located in ${city}. The improvements are comprised of ${totalBuildings} total building${parseInt(totalBuildings) > 1 ? 's' : ''},
          and consist of ${totalNra ? `${parseInt(totalNra).toLocaleString()} square feet of net rentable area (NRA)` : 'the improvements'} as of the valuation date.
          The property${yearBuilt ? `, reportedly built in ${yearBuilt},` : ''} is approximately ${formatPercent(occupancyRate)} occupied
          and features ${totalUnits} units in a ${stories}-story, ${buildingFormat} format.
        </p>

        <p style="margin-bottom: 1rem; text-align: justify;">
          Based upon our investigation of the real estate market and after considering all of the pertinent facts as set forth in the body of this appraisal report,
          as of the effective date, we have concluded the following:
        </p>

        ${concludedValue ? `
          <div style="text-align: center; margin: 2rem 0; padding: 1rem; background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 4px;">
            <div style="font-size: 14px; font-weight: bold; color: #1e40af;">Concluded Market Value</div>
            <div style="font-size: 24px; font-weight: bold; color: #1e40af; margin-top: 0.5rem;">${formatCurrency(concludedValue)}</div>
          </div>
        ` : ''}

        <div style="margin: 2rem 0;">
          <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 0.5rem;">Hypothetical Conditions</h3>
          <p style="text-align: justify; margin-bottom: 1rem;">${hypotheticalConditions}</p>

          <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 0.5rem;">Extraordinary Assumptions</h3>
          <p style="text-align: justify; margin-bottom: 1rem;">${extraordinaryAssumptions}</p>

          <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 0.5rem;">Extraordinary Limiting Conditions</h3>
          <p style="text-align: justify; margin-bottom: 1rem;">${extraordinaryLimitingConditions}</p>
        </div>

        <p style="margin-bottom: 1rem; text-align: justify;">
          The report has been completed in accordance with the Canadian Uniform Standards of Professional Appraisal Practice ("CUSPAP") adopted January 1, 2024.
          The full narrative appraisal report that follows sets forth the pertinent data and analyses leading to the conclusions presented herein.
          The appraisal requirements section of this report sets out the basis of the appraisal, definitions and the valuation methodology and must be read
          to gain a full understanding of the process.
        </p>

        <p style="margin-bottom: 2rem; text-align: justify;">
          If there are any specific questions or concerns regarding the attached appraisal report, or if ${appraiserCompanyShort} can be of additional assistance,
          please contact the individuals listed below.
        </p>

        <p style="margin-bottom: 1rem;">Respectfully Submitted,</p>
        <p style="margin-bottom: 1rem; font-weight: bold;">${appraiserCompany.toUpperCase()}</p>

        <div style="margin-top: 3rem;">
          <p style="font-weight: bold;">${appraiserName}${appraiserCredentials ? `, ${appraiserCredentials}` : ''}</p>
          ${appraiserTitle ? `<p>${appraiserTitle}</p>` : ''}
          ${appraiserEmail ? `<p>${appraiserEmail}</p>` : ''}
          ${appraiserAicNumber ? `<p>AIC No: ${appraiserAicNumber}</p>` : ''}
        </div>
      </div>

      <div class="page-break"></div>

      <!-- Render all other sections -->
      ${sections.filter(s => s.id !== 'cover' && s.id !== 'exec').map(section => {
        if (section.id === 'site') {
          return renderSiteSection(section);
        } else if (section.id === 'tax') {
          return renderTaxSection(section);
        } else if (section.id === 'zone') {
          return renderZoneSection(section);
        } else if (section.id === 'hbu') {
          return renderHbuSection(section);
        } else if (section.id === 'recon') {
          return renderReconSection(section);
        } else {
          // Default rendering for other sections
          return `
            <div class="section">
              <h2 class="section-title">${section.title}</h2>
              ${section.fields.map(field => `
                <div style="margin-bottom: 1rem;">
                  <strong>${field.label}:</strong>
                  <span>${field.value || '<span class="empty-state">Not specified</span>'}</span>
                </div>
              `).join('')}
            </div>
          `;
        }
      }).join('\n')}
    </body>
    </html>
  `;
}
