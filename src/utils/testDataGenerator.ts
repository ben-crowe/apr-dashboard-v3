/**
 * Test Data Generator for APR Hub
 * Generates varied test data for form testing
 * Uses test.com domain to allow detection and API bypass
 */

// Pool of first names for variety
const firstNames = [
  'John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Lisa',
  'James', 'Karen', 'William', 'Nancy', 'Richard', 'Betty', 'Joseph', 'Helen',
  'Thomas', 'Sandra', 'Christopher', 'Donna', 'Daniel', 'Carol', 'Matthew', 'Ruth',
  'Anthony', 'Sharon', 'Mark', 'Michelle', 'Donald', 'Laura', 'Steven', 'Sarah',
  'Kevin', 'Patricia', 'Brian', 'Jennifer', 'George', 'Maria', 'Edward', 'Susan'
];

// Pool of last names for variety
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill'
];

// Pool of company names for variety
const companies = [
  'Apex Properties', 'Summit Realty', 'Horizon Group', 'Pinnacle Investments',
  'Urban Development', 'Metro Holdings', 'Capital Ventures', 'Prime Assets',
  'Golden Gate Properties', 'Skyline Realty', 'Pacific Management', 'Quantum Holdings',
  'Silverstone Group', 'Diamond Properties', 'Atlas Investments', 'Phoenix Realty',
  'Cornerstone Development', 'Evergreen Holdings', 'Nexus Properties', 'Meridian Group'
];

// Pool of street names for variety
const streetNames = [
  'Main', 'Oak', 'Maple', 'Elm', 'Cedar', 'Pine', 'Birch', 'Washington',
  'Lake', 'Park', 'View', 'Hill', 'Forest', 'Spring', 'River', 'Mountain',
  'Center', 'Broadway', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'
];

// Pool of street types
const streetTypes = [
  'Street', 'Avenue', 'Road', 'Boulevard', 'Lane', 'Drive', 'Court', 'Place',
  'Circle', 'Parkway', 'Way', 'Terrace', 'Plaza', 'Trail'
];

// Pool of property types for variety - MUST MATCH DROPDOWN VALUES EXACTLY
const propertyTypes = [
  'Office', 'Retail', 'Industrial', 'Multifamily', 'Mixed Use', 'Land'
];

// Pool of cities (Calgary area)
const cities = [
  'Calgary', 'Airdrie', 'Cochrane', 'Okotoks', 'Chestermere', 'Strathmore',
  'High River', 'Canmore', 'Banff', 'Red Deer', 'Edmonton', 'Lethbridge'
];

// Helper function to get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random number in range
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to format phone number
function formatPhoneNumber(number: string): string {
  const cleaned = number.replace(/\D/g, '');
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

// Generate a unique timestamp-based identifier
function getUniqueId(): string {
  return Date.now().toString().slice(-6);
}

export interface TestClientData {
  clientFirstName: string;
  clientLastName: string;
  clientTitle: string;
  clientOrganization: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
}

export interface TestPropertyData {
  propertyAddress: string;
  propertyCity: string;
  propertyProvince: string;
  propertyPostalCode: string;
  propertyType: string;
  intendedUse: string;
  assetCondition: string;
  appraisalPurpose: string;
  reportType: string;
  priorityLevel: string;
  specialInstructions: string;
}

export interface TestAppraisalData {
  appraisalType: string;
  fee: number;
  urgentFee: number;
  reportDueDate: string;
  inspectionDate: string;
  specialRequirements: string;
}

/**
 * Generate varied client test data
 * Uses @test.com domain for easy detection and API bypass
 */
export function generateClientTestData(): TestClientData {
  const uniqueId = getUniqueId();
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const company = getRandomElement(companies);
  const streetNumber = getRandomNumber(100, 9999);
  const streetName = getRandomElement(streetNames);
  const streetType = getRandomElement(streetTypes);
  const suite = getRandomNumber(1, 50) > 25 ? `Suite ${getRandomNumber(100, 500)}, ` : '';
  
  // Generate phone with 403 or 587 area code (Calgary)
  const areaCode = Math.random() > 0.5 ? '403' : '587';
  const phoneNumber = `${areaCode}${getRandomNumber(200, 999)}${getRandomNumber(1000, 9999)}`;
  
  return {
    clientFirstName: firstName,
    clientLastName: lastName,
    clientTitle: getRandomElement(['Owner', 'Property Manager', 'CEO', 'VP Operations', 'Director', 'Asset Manager']),
    clientOrganization: company,
    clientAddress: `${suite}${streetNumber} ${streetName} ${streetType}, Calgary, AB T2X ${getRandomNumber(0, 9)}Y${getRandomNumber(0, 9)}`,
    clientPhone: formatPhoneNumber(phoneNumber),
    clientEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueId}@test.com`
  };
}

/**
 * Generate varied property test data
 */
export function generatePropertyTestData(): TestPropertyData {
  const streetNumber = getRandomNumber(100, 9999);
  const streetName = getRandomElement(streetNames);
  const streetType = getRandomElement(streetTypes);
  const city = getRandomElement(cities);
  const propertyType = getRandomElement(propertyTypes);
  
  // Generate postal code (Alberta format T#X #Y#)
  const postalCode = `T${getRandomNumber(0, 9)}${String.fromCharCode(65 + getRandomNumber(0, 25))} ${getRandomNumber(0, 9)}${String.fromCharCode(65 + getRandomNumber(0, 25))}${getRandomNumber(0, 9)}`;
  
  return {
    propertyAddress: `${streetNumber} ${streetName} ${streetType}`,
    propertyCity: city,
    propertyProvince: 'Alberta',
    propertyPostalCode: postalCode,
    propertyType: propertyType,
    // MUST MATCH DROPDOWN VALUES EXACTLY - intendedUse field in form
    intendedUse: getRandomElement(['Financing/Refinancing', 'Acquisition', 'Disposition', 'Insurance', 'Litigation', 'Estate Planning']),
    // MUST MATCH DROPDOWN VALUES EXACTLY - assetCondition field in form
    assetCondition: getRandomElement(['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']),
    appraisalPurpose: getRandomElement(['Financing', 'Purchase', 'Refinancing', 'Sale', 'Estate Planning', 'Insurance']),
    reportType: getRandomElement(['Full Narrative', 'Form Report', 'Restricted Use', 'Summary Report']),
    priorityLevel: getRandomElement(['Standard', 'Urgent', 'Rush']),
    specialInstructions: `Test property - ${propertyType}. Contact property manager for access.`
  };
}

/**
 * Generate appraisal-specific test data
 */
export function generateAppraisalTestData(): TestAppraisalData {
  const baseFee = getRandomNumber(2000, 5000);
  const daysOut = getRandomNumber(7, 21);
  const reportDate = new Date();
  reportDate.setDate(reportDate.getDate() + daysOut);
  
  const inspectionDate = new Date();
  inspectionDate.setDate(inspectionDate.getDate() + getRandomNumber(2, 5));
  
  return {
    appraisalType: getRandomElement(['Commercial', 'Residential Income', 'Industrial', 'Retail', 'Office']),
    fee: baseFee,
    urgentFee: baseFee + 500,
    reportDueDate: reportDate.toISOString().split('T')[0],
    inspectionDate: inspectionDate.toISOString().split('T')[0],
    specialRequirements: getRandomElement([
      'Environmental assessment required',
      'Zoning verification needed',
      'Include comparable sales analysis',
      'Highest and best use analysis required',
      'No special requirements'
    ])
  };
}

/**
 * Generate a test PDF file
 */
export function generateTestPDFFile(): File {
  const testPdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test Property Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000317 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n408\n%%EOF';
  const blob = new Blob([testPdfContent], { type: 'application/pdf' });
  return new File([blob], 'test-property-document.pdf', { type: 'application/pdf' });
}

/**
 * Generate complete test form data
 * Combines all test data generators and creates a test PDF file
 */
export function generateCompleteTestData() {
  const client = generateClientTestData();
  const property = generatePropertyTestData();
  const appraisal = generateAppraisalTestData();

  // Generate a property name
  const propertyNames = [
    'Riverside Plaza', 'Summit Tower', 'Parkview Apartments', 'Metro Center',
    'Heritage Building', 'Downtown Complex', 'Westside Mall', 'East Village Lofts',
    'Northgate Center', 'Southlands Plaza', 'Central Station', 'Gateway Building'
  ];

  // 50/50 chance: same as client or different property contact
  const sameAsClient = Math.random() > 0.5;
  const propertyContact = sameAsClient ? null : generateClientTestData();

  return {
    ...client,
    // Add property fields with correct names for the form
    propertyName: getRandomElement(propertyNames),
    propertyAddress: property.propertyAddress,
    propertyType: property.propertyType,
    intendedUse: property.intendedUse,
    valuationPremises: getRandomElement(['Market Value', 'Market Rent', 'Investment Value', 'Insurable Value', 'Liquidation Value']),
    assetCondition: property.assetCondition,
    // Property contact fields - 50/50 same or different
    sameAsClientContact: sameAsClient,
    propertyContactFirstName: sameAsClient ? client.clientFirstName : propertyContact!.clientFirstName,
    propertyContactLastName: sameAsClient ? client.clientLastName : propertyContact!.clientLastName,
    propertyContactEmail: sameAsClient ? client.clientEmail : propertyContact!.clientEmail,
    propertyContactPhone: sameAsClient ? client.clientPhone : propertyContact!.clientPhone,
    // Add other fields
    notes: `Test submission generated at ${new Date().toLocaleTimeString()}`,
    additionalComments: `Test submission generated at ${new Date().toLocaleTimeString()}`,
    numberOfUnits: getRandomNumber(1, 50).toString(),
    yearBuilt: getRandomNumber(1960, 2023).toString(),
    buildingSize: `${getRandomNumber(5000, 50000)} sq ft`,
    lotSize: `${getRandomNumber(10000, 100000)} sq ft`,
    zoning: getRandomElement(['C-1', 'C-2', 'I-1', 'I-2', 'M-1', 'M-2', 'R-1', 'R-2']),
    // Add test PDF file
    files: [generateTestPDFFile()]
  };
}

/**
 * Check if an email is a test email
 * Used to bypass real API calls for test data
 */
export function isTestEmail(email: string): boolean {
  return email.toLowerCase().includes('@test.com') || 
         email.toLowerCase().includes('test@') ||
         email.toLowerCase().includes('@example.com');
}

/**
 * Generate a mock CAL number for test submissions
 * Format: TEST-YYMMDD-####
 */
export function generateMockCALNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = getRandomNumber(1000, 9999);
  
  return `TEST-${year}${month}${day}-${random}`;
}