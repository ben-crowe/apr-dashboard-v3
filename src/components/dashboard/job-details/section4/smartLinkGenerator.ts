// Smart Link Generator for Section 4 Documents
// Pre-populates URLs with property address for direct navigation

interface PropertyInfo {
  address: string;
  city: string;
  province: string;
}

export const generateSmartLinks = (property: PropertyInfo): Record<string, string> => {
  const encodedAddress = encodeURIComponent(property.address);
  const city = property.city.toLowerCase();
  const links: Record<string, string> = {};

  // Legal Documents
  if (property.province === 'AB') {
    links.land_title = `https://alta.registries.gov.ab.ca/spinii/search.aspx?type=address&value=${encodedAddress}`;
    links.survey = `https://alta.registries.gov.ab.ca/spinii/search.aspx?type=address&value=${encodedAddress}`;
  } else if (property.province === 'SK') {
    links.land_title = `https://apps.isc.ca/LSReg/web/Search.aspx?address=${encodedAddress}`;
    links.survey = `https://apps.isc.ca/LSReg/web/Search.aspx?address=${encodedAddress}`;
  }

  // Assessment Documents
  if (city === 'calgary') {
    links.assessment = `https://assessmentsearch.calgary.ca/Search?address=${encodedAddress}`;
    links.tax = `https://www.calgary.ca/property-tax/search.html?address=${encodedAddress}`;
  } else if (city === 'edmonton') {
    links.assessment = `https://www.edmonton.ca/residential_neighbourhoods/property_assessment/assessment-search.aspx?address=${encodedAddress}`;
    links.tax = `https://www.edmonton.ca/property-tax/search?address=${encodedAddress}`;
  } else if (city === 'saskatoon') {
    links.assessment = `https://apps4.saskatoon.ca/app/aSearch/property/${encodedAddress}`;
    links.tax = `https://www.saskatoon.ca/property-tax?address=${encodedAddress}`;
  }

  // Maps & Visuals
  if (city === 'calgary') {
    links.zoning = `https://maps.calgary.ca/CalgaryImagery/?find=${encodedAddress}&layers=zoning&zoom=18`;
    links.flood = `https://maps.calgary.ca/FloodInfo/?address=${encodedAddress}&showflood=true`;
    links.aerial = `https://maps.calgary.ca/CalgaryImagery/?find=${encodedAddress}&imagery=2024`;
  } else if (city === 'edmonton') {
    links.zoning = `https://maps.edmonton.ca/map.aspx?lookingFor=${encodedAddress}&maptype=zoning`;
    links.flood = `https://maps.edmonton.ca/floodinfo/?address=${encodedAddress}`;
    links.aerial = `https://maps.edmonton.ca/imagery/?address=${encodedAddress}`;
  } else if (city === 'saskatoon') {
    links.zoning = `https://map.saskatoon.ca/?address=${encodedAddress}&layer=zoning`;
    links.flood = `https://map.saskatoon.ca/?address=${encodedAddress}&layer=flood`;
    links.aerial = `https://map.saskatoon.ca/?address=${encodedAddress}&imagery=true`;
  }

  // Google Maps fallback (works everywhere)
  if (!links.aerial) {
    links.aerial = `https://www.google.com/maps/search/${encodedAddress}/@0,0,18z/data=!3m1!1e3`;
  }

  // Permits & Plans
  if (city === 'calgary') {
    links.permits = `https://www.calgary.ca/pda/pd/permits/search.html?address=${encodedAddress}`;
    links.site_plan = `https://www.calgary.ca/pda/pd/permits/site-plans.html?address=${encodedAddress}`;
  } else if (city === 'edmonton') {
    links.permits = `https://www.edmonton.ca/residential_neighbourhoods/permits/search-permits?address=${encodedAddress}`;
    links.site_plan = `https://www.edmonton.ca/permits/site-plans?address=${encodedAddress}`;
  }

  return links;
};