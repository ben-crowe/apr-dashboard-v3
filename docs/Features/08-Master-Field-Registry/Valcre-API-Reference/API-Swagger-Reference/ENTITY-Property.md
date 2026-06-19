# Property Entity - API Field Reference

**Source**: Valcre API Swagger Documentation  
**Schema**: `Valcre.Web.App.Dal.DB.Entity.Model.Property`  
**Last Updated**: October 4, 2025

## Endpoints

- **GET** `/api/v1/Propertys` - List all (with OData filters)
- **GET** `/api/v1/Propertys({id})` - Get specific record
- **POST** `/api/v1/Propertys` - Create new record
- **PATCH** `/api/v1/Propertys({id})` - Update existing record
- **DELETE** `/api/v1/Propertys({id})` - Delete record

## Total Fields: 105

## Fields Reference

| Field Name | Type | Required | Max Length | Format | Nullable | Description |
|------------|------|----------|------------|--------|----------|-------------|
| AddressCity | string (string) | No | 100 | string | Yes | Address component |
| AddressCountry | string (string) | No | 100 | string | Yes | Address component |
| AddressCounty | string (string) | No | 100 | string | Yes | Address component |
| AddressPostalCode | string (string) | No | 21 | string | Yes | Address component |
| AddressState | string (string) | No | 100 | string | Yes | Address component |
| AddressStreet | string (string) | No | 250 | string | Yes | Address component |
| AddressStreet2 | string (string) | No | 100 | string | Yes | Address component |
| AdjacentEastComments | string | No | 2000 | - | Yes | - |
| AdjacentNorthComments | string | No | 2000 | - | Yes | - |
| AdjacentSouthComments | string | No | 2000 | - | Yes | - |
| AdjacentWestComments | string | No | 2000 | - | Yes | - |
| Amenities | enum | No | - | - | No | - |
| BuildableArea | integer (int64) | No | - | int64 | Yes | - |
| BuildingAnchorRatio | number (double) | No | - | double | Yes | - |
| BuildingAnchorTenants | string | No | 500 | - | Yes | - |
| BuildingAverageBayDepth | string (string) | No | 250 | string | Yes | - |
| BuildingLossFactor | number (double) | No | - | double | Yes | - |
| BuildingSizeImported | integer (int32) | No | - | int32 | Yes | - |
| BuildingTenancy | enum | No | - | - | Yes | - |
| Buildings | array | No | - | - | Yes | Collection/array field |
| BuildingsCount | integer (int32) | No | - | int32 | Yes | - |
| CommentsPrivate | string (multiline) | No | 8000 | multiline | Yes | - |
| Contacts | array | No | - | - | Yes | Collection/array field |
| Density | number (double) | No | - | double | Yes | - |
| DescriptionText | string (multiline) | No | 8000 | multiline | Yes | - |
| Easements | string (string) | No | 2000 | string | Yes | - |
| Entitlements | string (string) | No | 500 | string | Yes | - |
| EnvironmentalIssues | string (string) | No | 2000 | string | Yes | - |
| Expenses | array | No | - | - | Yes | Collection/array field |
| Files | array | No | - | - | Yes | Collection/array field |
| FunctionalDesignComments | string | No | 2000 | - | Yes | - |
| GeocodeSearched | boolean | No | - | - | Yes | - |
| HotelAccessType | enum | No | - | - | Yes | - |
| HotelBackOfficeArea | number (double) | No | - | double | Yes | - |
| HotelChainScale | enum | No | - | - | Yes | - |
| HotelFlag | string (string) | No | 250 | string | Yes | - |
| HotelGuestAmenities | enum | No | - | - | No | - |
| HotelLobbyArea | number (double) | No | - | double | Yes | - |
| HotelMeetingSpaceArea | number (double) | No | - | double | Yes | - |
| HotelRestaurantArea | number (double) | No | - | double | Yes | - |
| HotelRoomAmenities | enum | No | - | - | No | - |
| HotelServiceType | enum | No | - | - | Yes | - |
| Id | integer (int32) | No | - | int32 | No | Unique identifier (auto-generated) |
| ImageOrder | string | No | - | - | Yes | - |
| ImportedId | string | No | 100 | - | Yes | Foreign key reference |
| IncludedLaundryAmenities | enum | No | - | - | No | - |
| InvestmentGrade | enum | No | - | - | Yes | - |
| IsInactive | boolean | No | - | - | No | - |
| Jobs | array | No | - | - | Yes | Collection/array field |
| LandscapingComments | string | No | 2000 | - | Yes | - |
| Latitude | number (double) | No | - | double | Yes | - |
| Leases | array | No | - | - | Yes | Collection/array field |
| Longitude | number (double) | No | - | double | Yes | - |
| Lots | array | No | - | - | Yes | Collection/array field |
| Market | string (string) | No | 250 | string | Yes | - |
| ModifiedTime | string (date-time) | No | - | date-time | No | Last modification timestamp |
| Name | string (string) | No | 500 | string | Yes | Display name |
| OffSiteImprovements | string (string) | No | 2000 | string | Yes | - |
| OfficeId | integer (int32) | No | - | int32 | No | Foreign key to Office |
| Parcels | array | No | - | - | Yes | Collection/array field |
| ParkingRatio | number (double) | No | - | double | Yes | - |
| ParkingSpacesCount | integer (int32) | No | - | int32 | Yes | - |
| ParkingTypes | enum | No | - | - | No | - |
| PermittedBuildingHeight | number (double) | No | - | double | Yes | - |
| PermittedFAR | number (double) | No | - | double | Yes | - |
| PopulationArea | enum | No | - | - | Yes | - |
| ProjectDesign | string (string) | No | 250 | string | Yes | - |
| PropertyType | string (string) | No | 250 | string | Yes | - |
| ProposedLandUse | string (string) | No | 250 | string | Yes | - |
| QualitativeAccess | enum | No | - | - | Yes | - |
| QualitativeAppeal | enum | No | - | - | Yes | - |
| QualitativeBuilding | enum | No | - | - | Yes | - |
| QualitativeCondition | enum | No | - | - | Yes | - |
| QualitativeExposure | enum | No | - | - | Yes | - |
| QualitativeLocation | enum | No | - | - | Yes | - |
| Sales | array | No | - | - | Yes | Collection/array field |
| SecondaryType | string (string) | No | 250 | string | Yes | - |
| SecurityFeatures | enum | No | - | - | No | - |
| SignageComments | string | No | 2000 | - | Yes | - |
| SiteCorner | enum | No | - | - | Yes | - |
| SiteFloodZone | enum | No | - | - | Yes | - |
| SiteGrade | enum | No | - | - | Yes | - |
| SiteHBU | string (string) | No | 4000 | string | Yes | - |
| SiteShape | enum | No | - | - | Yes | - |
| SiteTopography | enum | No | - | - | Yes | - |
| SiteUtility | enum | No | - | - | Yes | - |
| SiteView | enum | No | - | - | Yes | - |
| SizeSF | integer (int32) | No | - | int32 | Yes | - |
| StorageFacilityFeatures | enum | No | - | - | No | - |
| StorageRetailArea | number (double) | No | - | double | Yes | - |
| StorageSecurityFeatures | enum | No | - | - | No | - |
| Streets | array | No | - | - | Yes | Collection/array field |
| SubType | enum | No | - | - | Yes | - |
| SubmarketName | string (string) | No | 250 | string | Yes | - |
| Surveys | array | No | - | - | Yes | Collection/array field |
| Tags | string | No | 4000 | - | Yes | - |
| TenantId | integer (int32) | No | - | int32 | No | Multi-tenant identifier |
| Types | enum | No | - | - | No | - |
| UnitAmenities | enum | No | - | - | No | - |
| Units | array | No | - | - | Yes | Collection/array field |
| Utilities | string (string) | No | 2000 | string | Yes | - |
| VehicleStorageCount | integer (int32) | No | - | int32 | Yes | - |
| YardStorageComments | string | No | 2000 | - | Yes | - |
| Zoning | string (string) | No | 500 | string | Yes | - |
| ZoningName | string (string) | No | 500 | string | Yes | - |

## Important Notes

1. **Id Field**: Auto-generated by API, do not include in POST requests
2. **Required Fields**: None - check Valcre documentation for business rules
3. **OData Format**: Use parentheses syntax `/api/v1/Propertys(123)` not `/api/v1/Propertys/123`
4. **Nullable Fields**: Fields marked nullable can be omitted or set to null
5. **Enum Fields**: Refer to separate enum reference files for valid values

## Field Count by Type

- **array**: 12 fields
- **boolean**: 2 fields
- **enum**: 30 fields
- **integer (int32)**: 8 fields
- **integer (int64)**: 1 fields
- **number (double)**: 13 fields
- **string**: 12 fields
- **string (date-time)**: 1 fields
- **string (multiline)**: 2 fields
- **string (string)**: 24 fields
