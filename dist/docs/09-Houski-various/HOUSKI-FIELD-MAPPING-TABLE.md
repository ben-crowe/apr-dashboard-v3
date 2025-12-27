# HOUSKI FIELD MAPPING TABLE

## Complete Mapping: APR Hub Fields → Houski API Fields

| Section | APR Hub Field | Houski API Field | Available? | Priority |
|---------|---------------|------------------|------------|----------|
| **3A - Building Information** |
| 3A | yearBuilt | `construction_year` | ✅ YES | HIGH |
| 3A | buildingSize | `total_floor_area` | ✅ YES | HIGH |
| 3A | numberOfUnits | `unit_count` | ✅ YES | HIGH |
| 3A | parkingSpaces | `parking_total` | ⚠️ MAYBE | MEDIUM |
| 3A | legalDescription | `legal_description` | ⚠️ MAYBE | LOW |
| **3B - Property Site** |
| 3B | zoningClassification | `zoning` | ✅ YES | HIGH |
| 3B | zoneAbbreviation | `zoning` (same field) | ✅ YES | HIGH |
| 3B | landUseDesignation | `land_use_designation` | ⚠️ MAYBE | MEDIUM |
| 3B | floodZone | `flood_zone` | ❌ UNLIKELY | LOW |
| 3B | utilities | N/A | ❌ NO | LOW |
| **3B - Parcels Summary** |
| 3B | parcelNumber | `parcel_id` | ⚠️ MAYBE | MEDIUM |
| 3B | usableLandSf | `lot_sqft` | ✅ YES | HIGH |
| 3B | grossLandSf | `lot_sqft` (same) | ✅ YES | HIGH |
| 3B | usableLandAcres | `lot_acres` | ✅ YES | HIGH |
| 3B | grossLandAcres | `lot_acres` (same) | ✅ YES | HIGH |
| **3B - Assessments & Taxes** |
| 3B | assessmentYear | `assessment_year` | ✅ YES | HIGH |
| 3B | landAssessmentValue | `land_assessment` | ⚠️ MAYBE | HIGH |
| 3B | improvedAssessmentValue | `improvement_assessment` | ⚠️ MAYBE | HIGH |
| 3B | totalAssessmentValue | `assessment_value` | ✅ YES | HIGH |
| 3B | assessedValue | `assessment_value` (same) | ✅ YES | HIGH |
| 3B | taxes | `property_taxes` | ⚠️ MAYBE | HIGH |

## SIMPLIFIED PRIORITY MAPPING (What to Focus On)

### 🎯 HIGH PRIORITY - Most Likely Available:
```javascript
// These 10 fields should definitely work:
const houskiFieldsToRequest = [
  'construction_year',      // → yearBuilt
  'total_floor_area',       // → buildingSize  
  'unit_count',            // → numberOfUnits
  'zoning',                // → zoningClassification & zoneAbbreviation
  'lot_sqft',              // → usableLandSf & grossLandSf
  'lot_acres',             // → usableLandAcres & grossLandAcres
  'assessment_year',       // → assessmentYear
  'assessment_value',      // → totalAssessmentValue & assessedValue
  'property_type',         // → buildingType (bonus field)
  'property_taxes'         // → taxes (if available)
];
```

### 📊 ACTUAL API CALL TO USE:
```bash
curl -X GET "https://api.houski.ca/search?api_key=e081b601-58f5-4b03-858a-7584874089e0&query=YOUR_ADDRESS_HERE&select=construction_year,total_floor_area,unit_count,zoning,lot_sqft,lot_acres,assessment_year,assessment_value,property_type,property_taxes,parking_total,legal_description,parcel_id,land_assessment,improvement_assessment"
```

## MAPPING LOGIC FOR THE CODE:

```javascript
// When Houski data comes back, map it like this:
function mapHouskiToAPRHub(houskiData) {
  return {
    // Section 3A - Building Information
    yearBuilt: houskiData.construction_year,
    buildingSize: houskiData.total_floor_area,
    numberOfUnits: houskiData.unit_count,
    parkingSpaces: houskiData.parking_total || '',
    legalDescription: houskiData.legal_description || '',
    
    // Section 3B - Property Site
    zoningClassification: houskiData.zoning,
    zoneAbbreviation: houskiData.zoning, // Same as classification
    landUseDesignation: houskiData.land_use_designation || '',
    floodZone: '', // Not available from Houski
    utilities: '', // Not available from Houski
    
    // Section 3B - Parcels Summary
    parcelNumber: houskiData.parcel_id || '',
    usableLandSf: houskiData.lot_sqft,
    grossLandSf: houskiData.lot_sqft, // Same value
    usableLandAcres: houskiData.lot_acres,
    grossLandAcres: houskiData.lot_acres, // Same value
    
    // Section 3B - Assessments & Taxes
    assessmentYear: houskiData.assessment_year,
    landAssessmentValue: houskiData.land_assessment || '',
    improvedAssessmentValue: houskiData.improvement_assessment || '',
    totalAssessmentValue: houskiData.assessment_value,
    assessedValue: houskiData.assessment_value, // Same as total
    taxes: houskiData.property_taxes || ''
  };
}
```

## IMPORTANT NOTES:

1. **Some fields map to the same Houski field** (e.g., zoning → both zoningClassification AND zoneAbbreviation)
2. **Some fields won't be available** (e.g., utilities, floodZone) - that's OK!
3. **Focus on the HIGH PRIORITY fields first** - these are most likely to work
4. **Test with a real address** to see what actually comes back
5. **The agent found that `construction_year` and `property_type` DO work** from their testing

## NEXT STEPS FOR TERMINAL AGENT:

1. Use the API call above with all the field names
2. See what actually comes back from Houski
3. Map whatever IS available to our APR Hub fields
4. Leave empty strings for fields that aren't available
5. Update the button handler to populate all these fields

The key is: GET WHAT YOU CAN from Houski, don't worry about fields that aren't available!