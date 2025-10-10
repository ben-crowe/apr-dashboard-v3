// Smart links for finding documents based on property location
export const getSmartLinks = (propertyAddress: string) => {
  // Parse city from address (crude but effective for Calgary/Edmonton/Saskatoon)
  const isCalgary = propertyAddress?.toLowerCase().includes('calgary') || 
                    propertyAddress?.toLowerCase().includes(', ab') ||
                    propertyAddress?.toLowerCase().includes('t2');
  const isEdmonton = propertyAddress?.toLowerCase().includes('edmonton') || 
                      propertyAddress?.toLowerCase().includes('t5') ||
                      propertyAddress?.toLowerCase().includes('t6');
  const isSaskatoon = propertyAddress?.toLowerCase().includes('saskatoon') ||
                       propertyAddress?.toLowerCase().includes(', sk') ||
                       propertyAddress?.toLowerCase().includes('s7');
  
  // Default to Calgary if city not detected
  const city = isEdmonton ? 'edmonton' : isSaskatoon ? 'saskatoon' : 'calgary';
  
  // URL encode the address for use in query parameters
  const encodedAddress = encodeURIComponent(propertyAddress || '');
  
  const links = {
    calgary: {
      land_title: `https://alta.registries.gov.ab.ca/SpinII/SearchSelectType.aspx`,
      survey: `https://alta.registries.gov.ab.ca/SpinII/SearchSelectType.aspx`,
      assessment: `https://assessmentsearch.calgary.ca/`,
      tax_notice: `https://www.calgary.ca/property-tax.html`,
      zoning: `https://www.calgary.ca/pda/pd/calgary-land-use-bylaw-1p2007/land-use-bylaw-map.html`,
      flood: `https://maps.calgary.ca/RiverFlooding/`,
      aerial: `https://maps.google.com/maps?q=${encodedAddress}&t=k&z=18`,
      permits: `https://www.calgary.ca/pda/pd/home-building-and-renovations/building-permit-status.html`,
      site_plan: `https://www.calgary.ca/pda/pd/calgary-land-use-bylaw-1p2007/land-use-bylaw-map.html`
    },
    edmonton: {
      land_title: `https://alta.registries.gov.ab.ca/SpinII/SearchSelectType.aspx`,
      survey: `https://alta.registries.gov.ab.ca/SpinII/SearchSelectType.aspx`,
      assessment: `https://www.edmonton.ca/property-assessment-taxes/assessment-search`,
      tax_notice: `https://www.edmonton.ca/property-assessment-taxes`,
      zoning: `https://webdocs.edmonton.ca/zoningbylaw/mapbrowser/`,
      flood: `https://www.edmonton.ca/city_government/environmental_stewardship/flooding-flood-maps`,
      aerial: `https://maps.google.com/maps?q=${encodedAddress}&t=k&z=18`,
      permits: `https://www.edmonton.ca/residential_neighbourhoods/building_permits`,
      site_plan: `https://www.edmonton.ca/residential_neighbourhoods/building_permits/development-permits`
    },
    saskatoon: {
      land_title: `https://www.isc.ca/Pages/default.aspx`,
      survey: `https://www.isc.ca/Pages/default.aspx`,
      assessment: `https://www.saskatoon.ca/services-residents/property-tax-assessments/property-assessment`,
      tax_notice: `https://www.saskatoon.ca/services-residents/property-tax-assessments`,
      zoning: `https://www.saskatoon.ca/services-residents/neighbourhoods/zoning-maps`,
      flood: `https://www.saskatoon.ca/services-residents/emergency-management-fire-safety/flood-information`,
      aerial: `https://maps.google.com/maps?q=${encodedAddress}&t=k&z=18`,
      permits: `https://www.saskatoon.ca/services-residents/permits-licences/building-permits`,
      site_plan: `https://www.saskatoon.ca/services-residents/permits-licences/development-permits`
    }
  };
  
  return links[city];
};

// Helper labels for smart links
export const smartLinkLabels = {
  land_title: 'Search SPIN2',
  survey: 'Search SPIN2',
  assessment: 'Assessment Portal',
  tax_notice: 'Tax Portal',
  zoning: 'City Zoning Map',
  flood: 'Flood Map Viewer',
  aerial: 'Google Satellite',
  permits: 'Permit Search',
  site_plan: 'Planning Dept'
};