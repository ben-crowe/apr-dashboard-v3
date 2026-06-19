# Valcre API Field Reference - Master Index

**Source**: Valcre API Swagger Documentation  
**URL**: https://api-core.valcre.com/swagger/  
**Last Updated**: October 4, 2025

This directory contains complete API field definitions extracted from Valcre's Swagger documentation.

---

## Entity Reference Files

### Core Entities

| Entity | File | Fields | Description |
|--------|------|--------|-------------|
| **Contact** | [ENTITY-Contact.md](ENTITY-Contact.md) | 36 | Client contacts and property contacts |
| **Property** | [ENTITY-Property.md](ENTITY-Property.md) | 105 | Real estate properties being appraised |
| **Job** | [ENTITY-Job.md](ENTITY-Job.md) | 55 | Appraisal job/order records |
| **PropertyContact** | [ENTITY-PropertyContact.md](ENTITY-PropertyContact.md) | 7 | Relationship linking Contact to Property |

### Enum Values

| File | Description |
|------|-------------|
| [ENUMS-Job.md](ENUMS-Job.md) | All Job entity dropdown/enum values |

---

## Quick Field Lookup

### Contact Entity - Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `Id` | integer | Auto-generated unique identifier |
| `FirstName` | string (100) | Contact's first name |
| `LastName` | string (100) | Contact's last name |
| `Company` | string (250) | Company/organization name |
| `Email` | string (250) | Email address |
| `PhoneNumber` | string (100) | Primary phone number |
| `CellNumber` | string (100) | Mobile phone number |
| `AddressStreet` | string (100) | Street address line 1 |
| `AddressCity` | string (100) | City |
| `AddressState` | string (50) | State/province |
| `AddressPostalCode` | string (32) | Postal/ZIP code |
| `OwnerId` | integer | Foreign key to User (required) |
| `OfficeId` | integer | Foreign key to Office (required) |

### Property Entity - Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `Id` | integer | Auto-generated unique identifier |
| `Name` | string (500) | Property name/identifier |
| `AddressStreet` | string (250) | Street address |
| `AddressCity` | string (100) | City |
| `AddressState` | string (100) | State/province |
| `AddressPostalCode` | string (21) | Postal/ZIP code |
| `AddressCountry` | string (100) | Country |
| `Latitude` | number | GPS latitude (-90 to 90) |
| `Longitude` | number | GPS longitude (-180 to 180) |
| `Types` | enum | Property type (Residential, Commercial, etc.) |
| `OwnerId` | integer | Foreign key to User (required) |
| `OfficeId` | integer | Foreign key to Office (required) |

### Job Entity - Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `Id` | integer | Auto-generated unique identifier |
| `Number` | string (250) | Job number (e.g., VAL251007) |
| `Name` | string (250) | Job name/description |
| `PropertyId` | integer | Foreign key to Property |
| `ClientId` | integer | Foreign key to Client Contact |
| `PropertyContactId` | integer | Foreign key to Property Contact |
| `Fee` | number | Appraisal fee amount |
| `Retainer` | number | Retainer/deposit amount |
| `DueDate` | date | Delivery due date |
| `EffectiveDate` | date | Effective date of appraisal |
| `InspectionDate` | date | Property inspection date |
| `Status` | enum | Current job status |
| `OwnerId` | integer | Foreign key to User (required) |
| `OfficeId` | integer | Foreign key to Office (required) |

### Job Entity - LOE Fields (Creation-Only)

**CRITICAL**: These fields can ONLY be set during job creation (POST). They cannot be updated via PATCH.

| Field | Type | Description |
|-------|------|-------------|
| `Purposes` | enum | Property rights appraised (flags enum) |
| `RequestedValues` | enum | Valuation premises (flags enum) |
| `Scopes` | enum | Scope of work (flags enum) |
| `ReportFormat` | enum | Report format/type |

See [APR-Dashboard/CLAUDE.md](../../CLAUDE.md) for critical integration details.

### Job Entity - LOE Fields (Updateable)

These fields CAN be updated after job creation via PATCH:

| Field | Type | Description |
|-------|------|-------------|
| `IntendedUses` | enum | Intended/authorized use (flags enum) |
| `ClientComments` | string (4000) | Special instructions from client |
| `Comments` | string (4000) | Internal notes/comments |

### PropertyContact Entity - Fields

| Field | Type | Description |
|-------|------|-------------|
| `PropertyId` | integer | Foreign key to Property |
| `ContactId` | integer | Foreign key to Contact (required) |
| `Comments` | string (500) | Notes about relationship |

---

## API Conventions

### Authentication

```bash
POST https://auth.valcre.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
client_id=c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh
client_secret=6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ
username=chris.chornohos@valta.ca
password=Valvalta1!
scope=offline_access
audience=https://valcre.api.com
```

### OData URL Format

**Correct**: `/api/v1/Jobs(702141)`  
**Wrong**: `/api/v1/Jobs/702141`

Always use parentheses for entity keys, not slashes.

### OData Query Parameters

- `$select` - Limit fields returned
- `$expand` - Include related entities (max depth: 2)
- `$filter` - Filter results (max 100 expressions)
- `$orderby` - Sort results (max 5 expressions)
- `$top` - Limit result count
- `$skip` - Pagination offset
- `$count` - Include total count

### Required System Fields

All entities require:
- `OwnerId` - Must be valid User ID (e.g., 6276 for Chris)
- `OfficeId` - Must be valid Office ID (e.g., 285)
- `TenantId` - Auto-set by API based on authentication

### Auto-Generated Fields

Do NOT include in POST requests:
- `Id` - Auto-generated primary key
- `ModifiedTime` - Auto-set by API
- `TenantId` - Auto-set by API

---

## Common Workflows

### 1. Create Client Contact → Create Property → Create Job

```javascript
// Step 1: Create Contact
POST /api/v1/Contacts
{
  "FirstName": "John",
  "LastName": "Doe",
  "Company": "ABC Lending",
  "Email": "john@abc.com",
  "PhoneNumber": "555-1234",
  "OwnerId": 6276,
  "OfficeId": 285
}
// Returns: { Id: 12345 }

// Step 2: Create Property
POST /api/v1/Properties
{
  "AddressStreet": "123 Main St",
  "AddressCity": "Toronto",
  "AddressState": "ON",
  "AddressPostalCode": "M1M 1M1",
  "OwnerId": 6276,
  "OfficeId": 285
}
// Returns: { Id: 67890 }

// Step 3: Create Job
POST /api/v1/Jobs
{
  "PropertyId": 67890,
  "ClientId": 12345,
  "Fee": 500,
  "Retainer": 200,
  "DueDate": "2025-12-31",
  "Purposes": 1,           // Creation-only field
  "RequestedValues": 2,    // Creation-only field
  "Scopes": 4,             // Creation-only field
  "ReportFormat": 1,       // Creation-only field
  "IntendedUses": 8,       // Updateable field
  "OwnerId": 6276,
  "OfficeId": 285
}
```

### 2. Verify Job Data (Round-Trip)

```javascript
// After creating job with ID 702141
// Wait 3 seconds for API processing
await new Promise(resolve => setTimeout(resolve, 3000));

// Verify data persisted
GET /api/v1/Jobs(702141)?$expand=Property,Client,PropertyContact

// Check that ALL fields match what you sent
// Especially Purposes, RequestedValues, Scopes, ReportFormat
```

---

## Field Mapping Resources

Additional field mapping documentation in `/05-Master-Field-Mapping/`:

- `VALCRE-FIELD-MAPPING.md` - Master field mapping reference
- `VALUATION-PREMISES-MAPPING.md` - RequestedValues enum (18 values)
- `PROPERTY-RIGHTS-MAPPING.md` - Purposes enum (13 values)
- `SCOPE-MAPPING.md` - Scopes enum (14 values)
- `REPORT-FORMAT-EXACT-MAPPING.md` - ReportFormat enum (10 values)
- `AUTHORIZED-USE-MAPPING.md` - IntendedUses enum

---

## Extraction Process

**Date**: October 4, 2025  
**Source**: https://api-core.valcre.com/swagger/v1/swagger.json  
**Method**: Direct Swagger JSON parsing  
**Entities Documented**: 4 core entities  
**Total Fields**: 203 fields across all entities  
**Enums Extracted**: 8 Job-related enums

All field definitions, types, lengths, and validations extracted directly from OpenAPI 3.0 specification.

---

## Related Documentation

- [APR-Dashboard/CLAUDE.md](../../CLAUDE.md) - Critical Valcre integration knowledge
- [03-Valcre-Integration.Dev/_FINAL-WORKING/](../../03-Valcre-Integration.Dev/_FINAL-WORKING/) - Working integration examples
- [GOLDEN_MEMORIES.md](~/Documents/Vault/Dev.Proj/Core-Dev-Environment/03-Memory-Database/GOLDEN_MEMORIES.md) - Cross-project memory

---

**Last Updated**: October 4, 2025  
**Maintained By**: Ben Crowe  
**Status**: Complete and verified
