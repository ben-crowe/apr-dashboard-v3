// EXPANDED SALES SECTION - TO BE INTEGRATED INTO reportHtmlTemplate.ts
// This file contains the expanded renderSalesSection function
// Replace lines 1465-1732 in reportHtmlTemplate.ts with this content

const renderSalesSection = (section: ReportSection): string => {
  // Helper to calculate Price/Unit
  const calculatePricePerUnit = (salePrice: string, numUnits: string): string => {
    const price = parseFloat(salePrice.replace(/[^0-9.-]/g, ''));
    const units = parseFloat(numUnits.replace(/[^0-9.-]/g, ''));
    if (isNaN(price) || isNaN(units) || units === 0) return '-';
    return formatCurrency(String(price / units));
  };

  // Helper to calculate Price/SF
  const calculatePricePerSF = (salePrice: string, gba: string): string => {
    const price = parseFloat(salePrice.replace(/[^0-9.-]/g, ''));
    const sf = parseFloat(gba.replace(/[^0-9.-]/g, ''));
    if (isNaN(price) || isNaN(sf) || sf === 0) return '-';
    const pricePerSF = price / sf;
    return `$${pricePerSF.toFixed(2)}`;
  };

  // Subject Property Summary data
  const subjectNumUnits = getFieldValue(section, 'subject-num-units');
  const subjectGba = getFieldValue(section, 'subject-gba');
  const subjectYearBuilt = getFieldValue(section, 'subject-year-built');
  const subjectSiteArea = getFieldValue(section, 'subject-site-area');
  const subjectCondition = getFieldValue(section, 'subject-condition');

  // Sale 1 data
  const sale1Name = getFieldValue(section, 'sale1-name');
  const sale1Address = getFieldValue(section, 'sale1-address');
  const sale1SaleDate = getFieldValue(section, 'sale1-sale-date');
  const sale1SalePrice = getFieldValue(section, 'sale1-sale-price');
  const sale1NumUnits = getFieldValue(section, 'sale1-num-units');
  const sale1Gba = getFieldValue(section, 'sale1-gba');
  const sale1YearBuilt = getFieldValue(section, 'sale1-year-built');
  const sale1CapRate = getFieldValue(section, 'sale1-cap-rate');
  const sale1SiteArea = getFieldValue(section, 'sale1-site-area');
  const sale1Condition = getFieldValue(section, 'sale1-condition');
  const sale1Description = getFieldValue(section, 'sale1-description');

  // Sale 2 data
  const sale2Name = getFieldValue(section, 'sale2-name');
  const sale2Address = getFieldValue(section, 'sale2-address');
  const sale2SaleDate = getFieldValue(section, 'sale2-sale-date');
  const sale2SalePrice = getFieldValue(section, 'sale2-sale-price');
  const sale2NumUnits = getFieldValue(section, 'sale2-num-units');
  const sale2Gba = getFieldValue(section, 'sale2-gba');
  const sale2YearBuilt = getFieldValue(section, 'sale2-year-built');
  const sale2CapRate = getFieldValue(section, 'sale2-cap-rate');
  const sale2SiteArea = getFieldValue(section, 'sale2-site-area');
  const sale2Condition = getFieldValue(section, 'sale2-condition');
  const sale2Description = getFieldValue(section, 'sale2-description');

  // Sale 3 data
  const sale3Name = getFieldValue(section, 'sale3-name');
  const sale3Address = getFieldValue(section, 'sale3-address');
  const sale3SaleDate = getFieldValue(section, 'sale3-sale-date');
  const sale3SalePrice = getFieldValue(section, 'sale3-sale-price');
  const sale3NumUnits = getFieldValue(section, 'sale3-num-units');
  const sale3Gba = getFieldValue(section, 'sale3-gba');
  const sale3YearBuilt = getFieldValue(section, 'sale3-year-built');
  const sale3CapRate = getFieldValue(section, 'sale3-cap-rate');
  const sale3SiteArea = getFieldValue(section, 'sale3-site-area');
  const sale3Condition = getFieldValue(section, 'sale3-condition');
  const sale3Description = getFieldValue(section, 'sale3-description');

  // Sale 4 data - NEW
  const sale4Name = getFieldValue(section, 'sale4-name');
  const sale4Address = getFieldValue(section, 'sale4-address');
  const sale4SaleDate = getFieldValue(section, 'sale4-sale-date');
  const sale4SalePrice = getFieldValue(section, 'sale4-sale-price');
  const sale4NumUnits = getFieldValue(section, 'sale4-num-units');
  const sale4Gba = getFieldValue(section, 'sale4-gba');
  const sale4YearBuilt = getFieldValue(section, 'sale4-year-built');
  const sale4CapRate = getFieldValue(section, 'sale4-cap-rate');
  const sale4SiteArea = getFieldValue(section, 'sale4-site-area');
  const sale4Condition = getFieldValue(section, 'sale4-condition');
  const sale4Description = getFieldValue(section, 'sale4-description');

  // Sale 5 data - NEW
  const sale5Name = getFieldValue(section, 'sale5-name');
  const sale5Address = getFieldValue(section, 'sale5-address');
  const sale5SaleDate = getFieldValue(section, 'sale5-sale-date');
  const sale5SalePrice = getFieldValue(section, 'sale5-sale-price');
  const sale5NumUnits = getFieldValue(section, 'sale5-num-units');
  const sale5Gba = getFieldValue(section, 'sale5-gba');
  const sale5YearBuilt = getFieldValue(section, 'sale5-year-built');
  const sale5CapRate = getFieldValue(section, 'sale5-cap-rate');
  const sale5SiteArea = getFieldValue(section, 'sale5-site-area');
  const sale5Condition = getFieldValue(section, 'sale5-condition');
  const sale5Description = getFieldValue(section, 'sale5-description');

  // Sale 6 data - NEW
  const sale6Name = getFieldValue(section, 'sale6-name');
  const sale6Address = getFieldValue(section, 'sale6-address');
  const sale6SaleDate = getFieldValue(section, 'sale6-sale-date');
  const sale6SalePrice = getFieldValue(section, 'sale6-sale-price');
  const sale6NumUnits = getFieldValue(section, 'sale6-num-units');
  const sale6Gba = getFieldValue(section, 'sale6-gba');
  const sale6YearBuilt = getFieldValue(section, 'sale6-year-built');
  const sale6CapRate = getFieldValue(section, 'sale6-cap-rate');
  const sale6SiteArea = getFieldValue(section, 'sale6-site-area');
  const sale6Condition = getFieldValue(section, 'sale6-condition');
  const sale6Description = getFieldValue(section, 'sale6-description');

  // Sales Comparison Value Conclusion
  const salesValueIndication = getFieldValue(section, 'sales-value-indication');
  const adjustmentSummary = getFieldValue(section, 'adjustment-summary');
  const salesMethodology = getFieldValue(section, 'sales-methodology');
  const salesReconciliation = getFieldValue(section, 'sales-reconciliation');

  return `
  <div class="section">
    <h2 class="section-title">Sales Comparison Approach</h2>

    <!-- PAGE 1: Introduction & Methodology -->
    <h3 class="subsection-title">Sales Comparison Methodology</h3>
    <div class="site-narrative-section">
      <p class="site-narrative-text">
        ${salesMethodology || 'The Sales Comparison Approach is predicated on the principle of substitution, which holds that a prudent buyer will not pay more for a property than the cost of acquiring an equally desirable substitute property in the absence of complicating factors such as undue delay. In applying this approach, recent sales of properties similar to the subject are analyzed and compared to the subject property. The sales are then adjusted for differences between the comparables and the subject property to estimate the market value of the subject.'}
      </p>
      <p class="site-narrative-text">
        In this analysis, six comparable sales have been selected based on similarity to the subject property in terms of location, size, age, condition, and physical characteristics. Each comparable has been verified and analyzed for factors including property rights conveyed, financing terms, conditions of sale, market conditions (time), location, physical characteristics, and any other factors that may affect value.
      </p>
    </div>

    <!-- Subject Property Summary Table -->
    <h3 class="subsection-title" style="margin-top: 1.5rem;">Subject Property Summary</h3>
    <table class="site-table">
      <thead>
        <tr>
          <th class="site-table-label" style="background: #1a365d; color: white;">Item</th>
          <th class="site-table-value" style="background: #1a365d; color: white;">Subject</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="site-table-label">Number of Units</td>
          <td class="site-table-value">${subjectNumUnits || '<span class="empty-state">Not specified</span>'}</td>
        </tr>
        <tr>
          <td class="site-table-label">GBA</td>
          <td class="site-table-value">${subjectGba ? `${Number(subjectGba).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
        </tr>
        <tr>
          <td class="site-table-label">Year Built</td>
          <td class="site-table-value">${subjectYearBuilt || '<span class="empty-state">Not specified</span>'}</td>
        </tr>
        <tr>
          <td class="site-table-label">Site Area</td>
          <td class="site-table-value">${subjectSiteArea ? `${Number(subjectSiteArea).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
        </tr>
        <tr>
          <td class="site-table-label">Condition</td>
          <td class="site-table-value">${subjectCondition || '<span class="empty-state">Not specified</span>'}</td>
        </tr>
      </tbody>
    </table>

    <!-- PAGE BREAK - PAGE 2: Comp 1 & 2 -->
    <div style="page-break-before: always;"></div>

    <!-- Comparable Sale 1 -->
    ${sale1Name || sale1Address ? `
      <h3 class="subsection-title">Comparable Sale 1</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Property</td>
            <td class="site-table-value">${sale1Name || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Address</td>
            <td class="site-table-value">${sale1Address || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Date</td>
            <td class="site-table-value">${sale1SaleDate || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Price</td>
            <td class="site-table-value">${sale1SalePrice ? formatCurrency(sale1SalePrice) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Units</td>
            <td class="site-table-value">${sale1NumUnits || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/Unit</td>
            <td class="site-table-value">${sale1SalePrice && sale1NumUnits ? calculatePricePerUnit(sale1SalePrice, sale1NumUnits) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">GBA</td>
            <td class="site-table-value">${sale1Gba ? `${Number(sale1Gba).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/SF</td>
            <td class="site-table-value">${sale1SalePrice && sale1Gba ? calculatePricePerSF(sale1SalePrice, sale1Gba) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Year Built</td>
            <td class="site-table-value">${sale1YearBuilt || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Cap Rate</td>
            <td class="site-table-value">${sale1CapRate ? `${sale1CapRate}%` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
        </tbody>
      </table>
    ` : ''}

    <!-- Comparable Sale 2 -->
    ${sale2Name || sale2Address ? `
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Comparable Sale 2</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Property</td>
            <td class="site-table-value">${sale2Name || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Address</td>
            <td class="site-table-value">${sale2Address || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Date</td>
            <td class="site-table-value">${sale2SaleDate || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Price</td>
            <td class="site-table-value">${sale2SalePrice ? formatCurrency(sale2SalePrice) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Units</td>
            <td class="site-table-value">${sale2NumUnits || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/Unit</td>
            <td class="site-table-value">${sale2SalePrice && sale2NumUnits ? calculatePricePerUnit(sale2SalePrice, sale2NumUnits) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">GBA</td>
            <td class="site-table-value">${sale2Gba ? `${Number(sale2Gba).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/SF</td>
            <td class="site-table-value">${sale2SalePrice && sale2Gba ? calculatePricePerSF(sale2SalePrice, sale2Gba) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Year Built</td>
            <td class="site-table-value">${sale2YearBuilt || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Cap Rate</td>
            <td class="site-table-value">${sale2CapRate ? `${sale2CapRate}%` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
        </tbody>
      </table>
    ` : ''}

    <!-- PAGE BREAK - PAGE 3: Comp 3 & 4 -->
    <div style="page-break-before: always;"></div>

    <!-- Comparable Sale 3 -->
    ${sale3Name || sale3Address ? `
      <h3 class="subsection-title">Comparable Sale 3</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Property</td>
            <td class="site-table-value">${sale3Name || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Address</td>
            <td class="site-table-value">${sale3Address || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Date</td>
            <td class="site-table-value">${sale3SaleDate || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Price</td>
            <td class="site-table-value">${sale3SalePrice ? formatCurrency(sale3SalePrice) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Units</td>
            <td class="site-table-value">${sale3NumUnits || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/Unit</td>
            <td class="site-table-value">${sale3SalePrice && sale3NumUnits ? calculatePricePerUnit(sale3SalePrice, sale3NumUnits) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">GBA</td>
            <td class="site-table-value">${sale3Gba ? `${Number(sale3Gba).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/SF</td>
            <td class="site-table-value">${sale3SalePrice && sale3Gba ? calculatePricePerSF(sale3SalePrice, sale3Gba) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Year Built</td>
            <td class="site-table-value">${sale3YearBuilt || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Cap Rate</td>
            <td class="site-table-value">${sale3CapRate ? `${sale3CapRate}%` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
        </tbody>
      </table>
    ` : ''}

    <!-- Comparable Sale 4 - NEW -->
    ${sale4Name || sale4Address ? `
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Comparable Sale 4</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Property</td>
            <td class="site-table-value">${sale4Name || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Address</td>
            <td class="site-table-value">${sale4Address || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Date</td>
            <td class="site-table-value">${sale4SaleDate || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Price</td>
            <td class="site-table-value">${sale4SalePrice ? formatCurrency(sale4SalePrice) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Units</td>
            <td class="site-table-value">${sale4NumUnits || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/Unit</td>
            <td class="site-table-value">${sale4SalePrice && sale4NumUnits ? calculatePricePerUnit(sale4SalePrice, sale4NumUnits) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">GBA</td>
            <td class="site-table-value">${sale4Gba ? `${Number(sale4Gba).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/SF</td>
            <td class="site-table-value">${sale4SalePrice && sale4Gba ? calculatePricePerSF(sale4SalePrice, sale4Gba) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Year Built</td>
            <td class="site-table-value">${sale4YearBuilt || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Cap Rate</td>
            <td class="site-table-value">${sale4CapRate ? `${sale4CapRate}%` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
        </tbody>
      </table>
    ` : ''}

    <!-- PAGE BREAK - PAGE 4: Comp 5 & 6 -->
    <div style="page-break-before: always;"></div>

    <!-- Comparable Sale 5 - NEW -->
    ${sale5Name || sale5Address ? `
      <h3 class="subsection-title">Comparable Sale 5</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Property</td>
            <td class="site-table-value">${sale5Name || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Address</td>
            <td class="site-table-value">${sale5Address || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Date</td>
            <td class="site-table-value">${sale5SaleDate || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Price</td>
            <td class="site-table-value">${sale5SalePrice ? formatCurrency(sale5SalePrice) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Units</td>
            <td class="site-table-value">${sale5NumUnits || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/Unit</td>
            <td class="site-table-value">${sale5SalePrice && sale5NumUnits ? calculatePricePerUnit(sale5SalePrice, sale5NumUnits) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">GBA</td>
            <td class="site-table-value">${sale5Gba ? `${Number(sale5Gba).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/SF</td>
            <td class="site-table-value">${sale5SalePrice && sale5Gba ? calculatePricePerSF(sale5SalePrice, sale5Gba) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Year Built</td>
            <td class="site-table-value">${sale5YearBuilt || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Cap Rate</td>
            <td class="site-table-value">${sale5CapRate ? `${sale5CapRate}%` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
        </tbody>
      </table>
    ` : ''}

    <!-- Comparable Sale 6 - NEW -->
    ${sale6Name || sale6Address ? `
      <h3 class="subsection-title" style="margin-top: 1.5rem;">Comparable Sale 6</h3>
      <table class="site-table">
        <tbody>
          <tr>
            <td class="site-table-label">Property</td>
            <td class="site-table-value">${sale6Name || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Address</td>
            <td class="site-table-value">${sale6Address || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Date</td>
            <td class="site-table-value">${sale6SaleDate || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Sale Price</td>
            <td class="site-table-value">${sale6SalePrice ? formatCurrency(sale6SalePrice) : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Units</td>
            <td class="site-table-value">${sale6NumUnits || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/Unit</td>
            <td class="site-table-value">${sale6SalePrice && sale6NumUnits ? calculatePricePerUnit(sale6SalePrice, sale6NumUnits) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">GBA</td>
            <td class="site-table-value">${sale6Gba ? `${Number(sale6Gba).toLocaleString()} SF` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Price/SF</td>
            <td class="site-table-value">${sale6SalePrice && sale6Gba ? calculatePricePerSF(sale6SalePrice, sale6Gba) : '<span class="empty-state">-</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Year Built</td>
            <td class="site-table-value">${sale6YearBuilt || '<span class="empty-state">Not specified</span>'}</td>
          </tr>
          <tr>
            <td class="site-table-label">Cap Rate</td>
            <td class="site-table-value">${sale6CapRate ? `${sale6CapRate}%` : '<span class="empty-state">Not specified</span>'}</td>
          </tr>
        </tbody>
      </table>
    ` : ''}

    <!-- PAGE BREAK - PAGE 5-6: Comparable Sales Summary Table -->
    <div style="page-break-before: always;"></div>

    <h3 class="subsection-title">Comparable Sales Summary</h3>
    <table class="site-table" style="font-size: 0.85rem;">
      <thead>
        <tr style="background: #1a365d; color: white;">
          <th style="padding: 0.5rem;">Property</th>
          <th style="padding: 0.5rem;">Address</th>
          <th style="padding: 0.5rem;">Sale Date</th>
          <th style="padding: 0.5rem;">Sale Price</th>
          <th style="padding: 0.5rem;">Units</th>
          <th style="padding: 0.5rem;">GBA</th>
          <th style="padding: 0.5rem;">Price/Unit</th>
          <th style="padding: 0.5rem;">Price/SF</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #f5f5f5; font-weight: bold;">
          <td style="padding: 0.5rem;">Subject</td>
          <td style="padding: 0.5rem;">${propertyAddress || 'Subject Property'}</td>
          <td style="padding: 0.5rem;">-</td>
          <td style="padding: 0.5rem;">-</td>
          <td style="padding: 0.5rem;">${subjectNumUnits || '-'}</td>
          <td style="padding: 0.5rem;">${subjectGba ? `${Number(subjectGba).toLocaleString()} SF` : '-'}</td>
          <td style="padding: 0.5rem;">-</td>
          <td style="padding: 0.5rem;">-</td>
        </tr>
        ${sale1Name || sale1Address ? `
        <tr>
          <td style="padding: 0.5rem;">Sale 1</td>
          <td style="padding: 0.5rem;">${sale1Address || sale1Name || '-'}</td>
          <td style="padding: 0.5rem;">${sale1SaleDate || '-'}</td>
          <td style="padding: 0.5rem;">${sale1SalePrice ? formatCurrency(sale1SalePrice) : '-'}</td>
          <td style="padding: 0.5rem;">${sale1NumUnits || '-'}</td>
          <td style="padding: 0.5rem;">${sale1Gba ? `${Number(sale1Gba).toLocaleString()} SF` : '-'}</td>
          <td style="padding: 0.5rem;">${sale1SalePrice && sale1NumUnits ? calculatePricePerUnit(sale1SalePrice, sale1NumUnits) : '-'}</td>
          <td style="padding: 0.5rem;">${sale1SalePrice && sale1Gba ? calculatePricePerSF(sale1SalePrice, sale1Gba) : '-'}</td>
        </tr>
        ` : ''}
        ${sale2Name || sale2Address ? `
        <tr>
          <td style="padding: 0.5rem;">Sale 2</td>
          <td style="padding: 0.5rem;">${sale2Address || sale2Name || '-'}</td>
          <td style="padding: 0.5rem;">${sale2SaleDate || '-'}</td>
          <td style="padding: 0.5rem;">${sale2SalePrice ? formatCurrency(sale2SalePrice) : '-'}</td>
          <td style="padding: 0.5rem;">${sale2NumUnits || '-'}</td>
          <td style="padding: 0.5rem;">${sale2Gba ? `${Number(sale2Gba).toLocaleString()} SF` : '-'}</td>
          <td style="padding: 0.5rem;">${sale2SalePrice && sale2NumUnits ? calculatePricePerUnit(sale2SalePrice, sale2NumUnits) : '-'}</td>
          <td style="padding: 0.5rem;">${sale2SalePrice && sale2Gba ? calculatePricePerSF(sale2SalePrice, sale2Gba) : '-'}</td>
        </tr>
        ` : ''}
        ${sale3Name || sale3Address ? `
        <tr>
          <td style="padding: 0.5rem;">Sale 3</td>
          <td style="padding: 0.5rem;">${sale3Address || sale3Name || '-'}</td>
          <td style="padding: 0.5rem;">${sale3SaleDate || '-'}</td>
          <td style="padding: 0.5rem;">${sale3SalePrice ? formatCurrency(sale3SalePrice) : '-'}</td>
          <td style="padding: 0.5rem;">${sale3NumUnits || '-'}</td>
          <td style="padding: 0.5rem;">${sale3Gba ? `${Number(sale3Gba).toLocaleString()} SF` : '-'}</td>
          <td style="padding: 0.5rem;">${sale3SalePrice && sale3NumUnits ? calculatePricePerUnit(sale3SalePrice, sale3NumUnits) : '-'}</td>
          <td style="padding: 0.5rem;">${sale3SalePrice && sale3Gba ? calculatePricePerSF(sale3SalePrice, sale3Gba) : '-'}</td>
        </tr>
        ` : ''}
        ${sale4Name || sale4Address ? `
        <tr>
          <td style="padding: 0.5rem;">Sale 4</td>
          <td style="padding: 0.5rem;">${sale4Address || sale4Name || '-'}</td>
          <td style="padding: 0.5rem;">${sale4SaleDate || '-'}</td>
          <td style="padding: 0.5rem;">${sale4SalePrice ? formatCurrency(sale4SalePrice) : '-'}</td>
          <td style="padding: 0.5rem;">${sale4NumUnits || '-'}</td>
          <td style="padding: 0.5rem;">${sale4Gba ? `${Number(sale4Gba).toLocaleString()} SF` : '-'}</td>
          <td style="padding: 0.5rem;">${sale4SalePrice && sale4NumUnits ? calculatePricePerUnit(sale4SalePrice, sale4NumUnits) : '-'}</td>
          <td style="padding: 0.5rem;">${sale4SalePrice && sale4Gba ? calculatePricePerSF(sale4SalePrice, sale4Gba) : '-'}</td>
        </tr>
        ` : ''}
        ${sale5Name || sale5Address ? `
        <tr>
          <td style="padding: 0.5rem;">Sale 5</td>
          <td style="padding: 0.5rem;">${sale5Address || sale5Name || '-'}</td>
          <td style="padding: 0.5rem;">${sale5SaleDate || '-'}</td>
          <td style="padding: 0.5rem;">${sale5SalePrice ? formatCurrency(sale5SalePrice) : '-'}</td>
          <td style="padding: 0.5rem;">${sale5NumUnits || '-'}</td>
          <td style="padding: 0.5rem;">${sale5Gba ? `${Number(sale5Gba).toLocaleString()} SF` : '-'}</td>
          <td style="padding: 0.5rem;">${sale5SalePrice && sale5NumUnits ? calculatePricePerUnit(sale5SalePrice, sale5NumUnits) : '-'}</td>
          <td style="padding: 0.5rem;">${sale5SalePrice && sale5Gba ? calculatePricePerSF(sale5SalePrice, sale5Gba) : '-'}</td>
        </tr>
        ` : ''}
        ${sale6Name || sale6Address ? `
        <tr>
          <td style="padding: 0.5rem;">Sale 6</td>
          <td style="padding: 0.5rem;">${sale6Address || sale6Name || '-'}</td>
          <td style="padding: 0.5rem;">${sale6SaleDate || '-'}</td>
          <td style="padding: 0.5rem;">${sale6SalePrice ? formatCurrency(sale6SalePrice) : '-'}</td>
          <td style="padding: 0.5rem;">${sale6NumUnits || '-'}</td>
          <td style="padding: 0.5rem;">${sale6Gba ? `${Number(sale6Gba).toLocaleString()} SF` : '-'}</td>
          <td style="padding: 0.5rem;">${sale6SalePrice && sale6NumUnits ? calculatePricePerUnit(sale6SalePrice, sale6NumUnits) : '-'}</td>
          <td style="padding: 0.5rem;">${sale6SalePrice && sale6Gba ? calculatePricePerSF(sale6SalePrice, sale6Gba) : '-'}</td>
        </tr>
        ` : ''}
      </tbody>
    </table>

    <!-- PAGE BREAK - PAGE 7-8: Individual Comparable Cards -->
    <div style="page-break-before: always;"></div>

    <h3 class="subsection-title">Comparable Sales Analysis</h3>

    ${sale1Description || sale1Name ? `
      <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 1 - ${sale1Name || sale1Address}</h4>
        <p>${sale1Description || 'This property is located at ' + (sale1Address || 'address not specified') + ' and sold on ' + (sale1SaleDate || '[date not specified]') + ' for ' + (sale1SalePrice ? formatCurrency(sale1SalePrice) : '[price not specified]') + '. The property contains ' + (sale1NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale1Gba ? Number(sale1Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
      </div>
    ` : ''}

    ${sale2Description || sale2Name ? `
      <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 2 - ${sale2Name || sale2Address}</h4>
        <p>${sale2Description || 'This property is located at ' + (sale2Address || 'address not specified') + ' and sold on ' + (sale2SaleDate || '[date not specified]') + ' for ' + (sale2SalePrice ? formatCurrency(sale2SalePrice) : '[price not specified]') + '. The property contains ' + (sale2NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale2Gba ? Number(sale2Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
      </div>
    ` : ''}

    ${sale3Description || sale3Name ? `
      <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 3 - ${sale3Name || sale3Address}</h4>
        <p>${sale3Description || 'This property is located at ' + (sale3Address || 'address not specified') + ' and sold on ' + (sale3SaleDate || '[date not specified]') + ' for ' + (sale3SalePrice ? formatCurrency(sale3SalePrice) : '[price not specified]') + '. The property contains ' + (sale3NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale3Gba ? Number(sale3Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
      </div>
    ` : ''}

    ${sale4Description || sale4Name ? `
      <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 4 - ${sale4Name || sale4Address}</h4>
        <p>${sale4Description || 'This property is located at ' + (sale4Address || 'address not specified') + ' and sold on ' + (sale4SaleDate || '[date not specified]') + ' for ' + (sale4SalePrice ? formatCurrency(sale4SalePrice) : '[price not specified]') + '. The property contains ' + (sale4NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale4Gba ? Number(sale4Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
      </div>
    ` : ''}

    ${sale5Description || sale5Name ? `
      <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 5 - ${sale5Name || sale5Address}</h4>
        <p>${sale5Description || 'This property is located at ' + (sale5Address || 'address not specified') + ' and sold on ' + (sale5SaleDate || '[date not specified]') + ' for ' + (sale5SalePrice ? formatCurrency(sale5SalePrice) : '[price not specified]') + '. The property contains ' + (sale5NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale5Gba ? Number(sale5Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
      </div>
    ` : ''}

    ${sale6Description || sale6Name ? `
      <div style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <h4 style="color: #1a365d; margin-bottom: 0.5rem;">Comparable Sale 6 - ${sale6Name || sale6Address}</h4>
        <p>${sale6Description || 'This property is located at ' + (sale6Address || 'address not specified') + ' and sold on ' + (sale6SaleDate || '[date not specified]') + ' for ' + (sale6SalePrice ? formatCurrency(sale6SalePrice) : '[price not specified]') + '. The property contains ' + (sale6NumUnits || '[number not specified]') + ' units with a gross building area of ' + (sale6Gba ? Number(sale6Gba).toLocaleString() + ' SF' : '[size not specified]') + '. This comparable is considered relevant to the subject property valuation due to its similar characteristics and recent transaction date.'}</p>
      </div>
    ` : ''}

    <!-- PAGE BREAK - PAGE 9: Adjustment Grid -->
    <div style="page-break-before: always;"></div>

    <h3 class="subsection-title">Adjustment Grid Analysis</h3>
    <div class="site-narrative-section" style="margin-bottom: 1rem;">
      <p class="site-narrative-text">
        The following adjustment grid provides a systematic analysis of how each comparable sale differs from the subject property. Adjustments are made to the sale prices of the comparables to account for these differences, bringing them to a common basis for comparison with the subject property.
      </p>
    </div>

    <table class="site-table" style="font-size: 0.75rem;">
      <thead>
        <tr style="background: #1a365d; color: white;">
          <th style="padding: 0.4rem;">Element</th>
          <th style="padding: 0.4rem;">Subject</th>
          <th style="padding: 0.4rem;">Sale 1</th>
          <th style="padding: 0.4rem;">Sale 2</th>
          <th style="padding: 0.4rem;">Sale 3</th>
          <th style="padding: 0.4rem;">Sale 4</th>
          <th style="padding: 0.4rem;">Sale 5</th>
          <th style="padding: 0.4rem;">Sale 6</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 0.4rem; font-weight: bold;">Sale Price</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">${sale1SalePrice ? formatCurrency(sale1SalePrice) : '-'}</td>
          <td style="padding: 0.4rem;">${sale2SalePrice ? formatCurrency(sale2SalePrice) : '-'}</td>
          <td style="padding: 0.4rem;">${sale3SalePrice ? formatCurrency(sale3SalePrice) : '-'}</td>
          <td style="padding: 0.4rem;">${sale4SalePrice ? formatCurrency(sale4SalePrice) : '-'}</td>
          <td style="padding: 0.4rem;">${sale5SalePrice ? formatCurrency(sale5SalePrice) : '-'}</td>
          <td style="padding: 0.4rem;">${sale6SalePrice ? formatCurrency(sale6SalePrice) : '-'}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td colspan="8" style="padding: 0.4rem; font-weight: bold;">ADJUSTMENTS</td>
        </tr>
        <tr>
          <td style="padding: 0.4rem;">Property Rights</td>
          <td style="padding: 0.4rem;">Fee Simple</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
        </tr>
        <tr>
          <td style="padding: 0.4rem;">Financing Terms</td>
          <td style="padding: 0.4rem;">Cash Equiv.</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
        </tr>
        <tr>
          <td style="padding: 0.4rem;">Conditions of Sale</td>
          <td style="padding: 0.4rem;">Arms Length</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
          <td style="padding: 0.4rem;">0%</td>
        </tr>
        <tr>
          <td style="padding: 0.4rem;">Market Conditions (Time)</td>
          <td style="padding: 0.4rem;">Current</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
        </tr>
        <tr>
          <td style="padding: 0.4rem;">Location</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
        </tr>
        <tr>
          <td style="padding: 0.4rem;">Size (Units)</td>
          <td style="padding: 0.4rem;">${subjectNumUnits || '-'}</td>
          <td style="padding: 0.4rem;">${sale1NumUnits || '-'}</td>
          <td style="padding: 0.4rem;">${sale2NumUnits || '-'}</td>
          <td style="padding: 0.4rem;">${sale3NumUnits || '-'}</td>
          <td style="padding: 0.4rem;">${sale4NumUnits || '-'}</td>
          <td style="padding: 0.4rem;">${sale5NumUnits || '-'}</td>
          <td style="padding: 0.4rem;">${sale6NumUnits || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 0.4rem;">Age/Condition</td>
          <td style="padding: 0.4rem;">${subjectYearBuilt || '-'}/${subjectCondition || '-'}</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
        </tr>
        <tr style="background: #f9fafb; font-weight: bold;">
          <td style="padding: 0.4rem;">Net Adjustment</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
        </tr>
        <tr style="background: #1a365d; color: white; font-weight: bold;">
          <td style="padding: 0.4rem;">Adjusted Price</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
          <td style="padding: 0.4rem;">-</td>
        </tr>
      </tbody>
    </table>

    <div class="site-narrative-section" style="margin-top: 1rem;">
      <p class="site-narrative-text" style="font-size: 0.85rem; font-style: italic;">
        Note: Specific adjustment percentages and amounts should be filled in based on market analysis and appraiser judgment. The adjustment grid above provides the framework for systematic comparison.
      </p>
    </div>

    <!-- PAGE BREAK - PAGE 10: Adjustment Summary -->
    <div style="page-break-before: always;"></div>

    ${adjustmentSummary ? `
      <h3 class="subsection-title">Adjustment Summary</h3>
      <div class="site-narrative-section">
        <p class="site-narrative-text">${adjustmentSummary}</p>
      </div>
    ` : `
      <h3 class="subsection-title">Adjustment Summary</h3>
      <div class="site-narrative-section">
        <p class="site-narrative-text">
          The comparable sales required adjustments for various factors to make them more comparable to the subject property. The primary adjustments considered include:
        </p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li><strong>Property Rights:</strong> All comparables sold with fee simple interest, requiring no adjustment.</li>
          <li><strong>Financing Terms:</strong> All sales were verified as arms-length transactions with conventional financing or cash, requiring no adjustment.</li>
          <li><strong>Conditions of Sale:</strong> All transactions were verified as arms-length sales between unrelated parties under normal market conditions.</li>
          <li><strong>Market Conditions:</strong> Adjustments for time were considered based on market trend analysis in the local multifamily market.</li>
          <li><strong>Location:</strong> Adjustments were made for differences in neighborhood quality, access to amenities, and overall desirability.</li>
          <li><strong>Size:</strong> Adjustments were considered for differences in unit count and gross building area.</li>
          <li><strong>Age and Condition:</strong> Adjustments were made based on effective age and overall condition of the improvements.</li>
        </ul>
      </div>
    `}

    <!-- PAGE BREAK - PAGE 11: Sales Reconciliation -->
    <div style="page-break-before: always;"></div>

    <h3 class="subsection-title">Sales Comparison Reconciliation</h3>
    <div class="site-narrative-section">
      ${salesReconciliation ? `
        <p class="site-narrative-text">${salesReconciliation}</p>
      ` : `
        <p class="site-narrative-text">
          Based on the analysis of the six comparable sales, the following reconciliation is presented. Each comparable was analyzed for its degree of similarity to the subject property, with consideration given to the quantity and quality of adjustments required.
        </p>
        <p class="site-narrative-text" style="margin-top: 1rem;">
          The comparable sales indicate a range of values for properties similar to the subject. After applying appropriate adjustments for differences in property characteristics, the adjusted sale prices provide a reasonable indication of the subject property's market value. Greater weight was given to comparables requiring fewer and smaller adjustments, as these represent more reliable indicators of value.
        </p>
        <p class="site-narrative-text" style="margin-top: 1rem;">
          The sales comparison approach provides strong support for the concluded value, as the market for multifamily properties in this area is active with sufficient comparable sales data to develop a reliable indication of value.
        </p>
      `}
    </div>

    <!-- Sales Comparison Value Conclusion -->
    <h3 class="subsection-title" style="margin-top: 1.5rem;">Sales Comparison Value Conclusion</h3>
    <table class="cap-value-table">
      <tbody>
        <tr class="cap-value-total">
          <td class="cap-table-label"><strong>Indicated Value - Sales Comparison Approach</strong></td>
          <td class="cap-table-value"><strong>${salesValueIndication ? formatCurrency(salesValueIndication) : '<span class="empty-state">Not specified</span>'}</strong></td>
        </tr>
      </tbody>
    </table>

    ${!subjectNumUnits && !sale1Name && !sale2Name && !sale3Name && !sale4Name && !sale5Name && !sale6Name ? `
      <div class="empty-state">No sales comparison data provided. Complete the subject property summary and comparable sales fields to generate a comprehensive sales comparison analysis.</div>
    ` : ''}
  </div>
  `;
};
