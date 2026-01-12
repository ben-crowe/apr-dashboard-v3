# EXACT HOUSKI FIELDS NEEDED FOR APR HUB

## Clear Instructions for Terminal Agent

You have the property address. Here are the EXACT fields we need from Houski API for our APR Hub job application:

## SECTION 3A - Building Information (Chris fills this out)
These are the fields in our APR Hub that need Houski data:

1. **buildingSize** (our field) 
   - Need from Houski: `total_floor_area` or `building_sqft`
   - What it is: Total square footage of the building

2. **yearBuilt** (our field)
   - Need from Houski: `construction_year` 
   - What it is: Year the building was constructed

3. **buildingType** (our field)
   - Need from Houski: `property_type`
   - What it is: Type of building (Commercial, Residential, Mixed Use, etc.)

4. **numberOfUnits** (our field)
   - Need from Houski: `unit_count` or `number_of_units`
   - What it is: Total number of units in the building

## SECTION 3B - Property Research Data
These are additional research fields we want:

5. **currentTaxAssessment** (our field)
   - Need from Houski: `assessment_value` or `assessed_total`
   - What it is: Current municipal tax assessment value

6. **previousYearTaxes** (our field)
   - Need from Houski: `property_taxes` or `tax_amount`
   - What it is: Actual property taxes paid last year

7. **landSize** (our field)
   - Need from Houski: `lot_sqft` or `land_area`
   - What it is: Size of the land/lot in square feet or acres

8. **zoningDesignation** (our field)
   - Need from Houski: `zoning` or `zoning_designation`
   - What it is: Municipal zoning code (e.g., C-1, RM-3, etc.)

## SUMMARY - We Need These 8 Fields:

### From Houski API, try to get:
```
construction_year     → maps to → yearBuilt
property_type        → maps to → buildingType  
total_floor_area     → maps to → buildingSize
unit_count          → maps to → numberOfUnits
assessment_value    → maps to → currentTaxAssessment
property_taxes      → maps to → previousYearTaxes
lot_sqft           → maps to → landSize
zoning             → maps to → zoningDesignation
```

## IF HOUSKI DOESN'T HAVE A FIELD:
- That's OK! Just get what's available
- Leave the field empty if Houski doesn't provide it
- Focus on getting the fields that ARE available

## YOUR TASK:
1. Use the search endpoint with these field names in the select parameter
2. Get whatever fields Houski actually has available
3. Map them to our APR Hub fields
4. Don't worry if some fields aren't available - just get what you can

## EXAMPLE API CALL:
```bash
curl -X GET "https://api.houski.ca/search?api_key=e081b601-58f5-4b03-858a-7584874089e0&query=ADDRESS_HERE&select=construction_year,property_type,total_floor_area,unit_count,assessment_value,property_taxes,lot_sqft,zoning"
```

Then map whatever comes back to our fields!