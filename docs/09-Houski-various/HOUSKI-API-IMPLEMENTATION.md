# Houski API Implementation Guide

## API Credentials
```
API Key: e081b601-58f5-4b03-858a-7584874089e0
Base URL: https://api.houski.ca/v1
```

## Key Endpoint: Property Details
```
GET https://api.houski.ca/v1/properties/details
```

### Required Headers
```javascript
headers: {
  'Authorization': 'Bearer e081b601-58f5-4b03-858a-7584874089e0',
  'Content-Type': 'application/json'
}
```

### Query Parameters
```javascript
// Example for Avenue Living property
const params = {
  address: '1510 8th Street East',
  city: 'Saskatoon',
  province: 'SK',
  country: 'CA'
}
```

## Implementation Code for Frontend

### 1. Create API Function
**File**: `/Users/bencrowe/Development/APR-Hub-Repo/src/lib/houski-api.ts`

```typescript
const HOUSKI_API_KEY = 'e081b601-58f5-4b03-858a-7584874089e0';
const HOUSKI_BASE_URL = 'https://api.houski.ca/v1';

export async function fetchHouskiPropertyData(address: string, city: string, province: string) {
  try {
    // Build query string
    const queryParams = new URLSearchParams({
      address: address,
      city: city,
      province: province,
      country: 'CA'
    });

    const response = await fetch(`${HOUSKI_BASE_URL}/properties/details?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HOUSKI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Houski API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Houski returns an array of properties, get the first match
    const property = data.results?.[0] || data;
    
    return {
      success: true,
      data: property
    };
  } catch (error) {
    console.error('Houski API error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 2. Update Gather Data Button Handler
**File**: `src/components/dashboard/sections/Section3APropertyInfo.tsx`

```typescript
const handleGatherData = async () => {
  setIsGathering(true);
  
  try {
    // Get address from current job data
    const address = jobData.propertyAddress || jobData.address;
    const city = jobData.propertyCity || jobData.city;
    const province = jobData.propertyProvince || jobData.province || 'SK';
    
    if (!address || !city) {
      toast.error('Property address is required for data gathering');
      return;
    }
    
    // Call Houski API
    const result = await fetchHouskiPropertyData(address, city, province);
    
    if (result.success && result.data) {
      // Map Houski fields to our form fields
      const houskiData = result.data;
      
      // Update Section 3A fields (Building Info)
      updateFormField('buildingSize', houskiData.buildingSize || houskiData.totalBuildingArea);
      updateFormField('yearBuilt', houskiData.yearBuilt || houskiData.constructionYear);
      updateFormField('buildingType', mapBuildingType(houskiData.propertyType));
      updateFormField('numberOfUnits', houskiData.totalUnits || houskiData.unitCount);
      
      // Update Section 3B fields (Property Research)
      updateFormField('currentTaxAssessment', houskiData.assessedValue || houskiData.assessmentTotal);
      updateFormField('previousYearTaxes', houskiData.taxAmount || houskiData.propertyTax);
      updateFormField('landSize', houskiData.lotSize || houskiData.landArea);
      updateFormField('zoningDesignation', houskiData.zoning || houskiData.zoningCode);
      
      toast.success('Property data gathered successfully!');
    } else {
      toast.error('Could not find property data');
    }
  } catch (error) {
    console.error('Error gathering data:', error);
    toast.error('Failed to gather property data');
  } finally {
    setIsGathering(false);
  }
};

// Helper function to map Houski property types to our dropdown values
function mapBuildingType(houskiType: string): string {
  const typeMap = {
    'apartment': 'Apartment Building',
    'condo': 'Condominium',
    'townhouse': 'Townhouse',
    'commercial': 'Commercial',
    'mixed': 'Mixed Use',
    'office': 'Office Building'
  };
  
  const lowerType = (houskiType || '').toLowerCase();
  for (const [key, value] of Object.entries(typeMap)) {
    if (lowerType.includes(key)) {
      return value;
    }
  }
  return houskiType; // Return original if no match
}
```

## Expected Houski Response Structure

```json
{
  "results": [
    {
      "propertyId": "SK-123456",
      "address": "1510 8th Street East",
      "city": "Saskatoon",
      "province": "SK",
      
      // Building Information (Section 3A)
      "buildingSize": 125000,          // Square feet
      "totalBuildingArea": 125000,     // Alternative field name
      "yearBuilt": 1978,
      "constructionYear": 1978,         // Alternative field name
      "propertyType": "Apartment",
      "totalUnits": 150,
      "unitCount": 150,                 // Alternative field name
      
      // Property Research (Section 3B)
      "assessedValue": 18500000,        // Current tax assessment
      "assessmentTotal": 18500000,      // Alternative field name
      "taxAmount": 385000,              // Annual property taxes
      "propertyTax": 385000,             // Alternative field name
      "lotSize": 2.5,                   // Acres
      "landArea": 2.5,                  // Alternative field name
      "zoning": "RM3",                  // Zoning designation
      "zoningCode": "RM3",               // Alternative field name
      
      // Additional useful fields
      "neighborhood": "Nutana",
      "postalCode": "S7H 0T1",
      "latitude": 52.1234,
      "longitude": -106.5678
    }
  ]
}
```

## Testing the Implementation

### Test Case 1: Avenue Living Property
```javascript
// Test with known Avenue Living property
const testAddress = '1510 8th Street East';
const testCity = 'Saskatoon';
const testProvince = 'SK';

// Should return building data for this multi-unit residential property
```

### Test Case 2: Error Handling
```javascript
// Test with invalid address
const testAddress = 'Invalid Address 12345';
// Should show error toast: "Could not find property data"
```

### Test Case 3: Missing Address
```javascript
// Test with no address in job data
// Should show error toast: "Property address is required for data gathering"
```

## Important Notes

1. **API Key Security**: In production, move API key to environment variable
2. **Rate Limiting**: Houski may have rate limits - add throttling if needed
3. **Field Mapping**: Houski may use different field names - check both primary and alternative names
4. **Building Aggregation**: Houski provides building-level data, perfect for APR needs
5. **Error Handling**: Always provide user feedback for failures
6. **Province Default**: Default to 'SK' if province not provided

## Troubleshooting

### If API returns 401 Unauthorized
- Check API key is correct: `e081b601-58f5-4b03-858a-7584874089e0`
- Ensure "Bearer " prefix in Authorization header

### If API returns 404 Not Found
- Verify endpoint URL: `https://api.houski.ca/v1/properties/details`
- Check address formatting (no special characters)

### If fields don't populate
- Check console for Houski response structure
- Verify field names match (use alternative names if needed)
- Ensure updateFormField function is working correctly

## Contact Support
- Houski Documentation: https://docs.houski.ca
- API Status: Check if API is operational
- Test in Postman first if having issues