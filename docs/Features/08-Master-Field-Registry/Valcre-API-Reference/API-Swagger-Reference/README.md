# Valcre API Field Reference

Complete API field definitions extracted from Valcre's official Swagger documentation.

**Last Updated**: October 4, 2025
**Source**: https://api-core.valcre.com/swagger/v1/swagger.json

---

## Quick Start

**START HERE**: [00-INDEX.md](00-INDEX.md) - Master index with quick lookup tables

---

## Entity References

| Entity | Fields | Description | File |
|--------|--------|-------------|------|
| Contact | 36 | Client/property contact persons | [ENTITY-Contact.md](ENTITY-Contact.md) |
| Property | 105 | Real estate properties | [ENTITY-Property.md](ENTITY-Property.md) |
| Job | 55 | Appraisal job/order records | [ENTITY-Job.md](ENTITY-Job.md) |
| PropertyContact | 7 | Contact-to-property relationship | [ENTITY-PropertyContact.md](ENTITY-PropertyContact.md) |

**Total**: 203 fields documented across 4 entities

---

## Enum Values

[ENUMS-Job.md](ENUMS-Job.md) - All Job entity dropdown/enum values (8 enums, 122 values)

Includes:
- Job Status
- Purposes (Property Rights)
- Requested Values (Valuation Premises)
- Scopes (Scope of Work)
- Report Format
- Intended Uses (Authorized Use)
- Analysis Level
- Staff Role

---

## Documentation

[EXTRACTION-SUMMARY.md](EXTRACTION-SUMMARY.md) - Complete extraction process, key findings, and validation

---

## What's in Each Entity File?

Every entity reference file contains:

1. **Endpoints** - GET, POST, PATCH, DELETE with OData format
2. **Complete Field List** - All fields in alphabetical order
3. **Field Details** - Type, required status, max length, format, nullable
4. **Important Notes** - Auto-generated fields, required fields, special considerations
5. **Field Type Breakdown** - Statistics on field types

---

## Critical Integration Knowledge

### LOE Fields (Creation-Only)

These 4 Job fields can ONLY be set during creation (POST), NOT via PATCH:

- **Purposes** - Property rights appraised
- **RequestedValues** - Valuation premises
- **Scopes** - Scope of work
- **ReportFormat** - Report format/type

See [/APR-Dashboard/CLAUDE.md](../../CLAUDE.md) for complete integration details.

### Required System Fields

All entities require (despite schema showing optional):

- **OwnerId** - Must be 6276 (Chris)
- **OfficeId** - Must be 285

### Enum Text Labels

Swagger provides numeric values only. For text labels, see:

- [../PROPERTY-RIGHTS-MAPPING.md](../PROPERTY-RIGHTS-MAPPING.md)
- [../VALUATION-PREMISES-MAPPING.md](../VALUATION-PREMISES-MAPPING.md)
- [../SCOPE-MAPPING.md](../SCOPE-MAPPING.md)
- [../REPORT-FORMAT-EXACT-MAPPING.md](../REPORT-FORMAT-EXACT-MAPPING.md)
- [../AUTHORIZED-USE-MAPPING.md](../AUTHORIZED-USE-MAPPING.md)

---

## Common Lookups

### Contact Entity - Key Fields
```
FirstName, LastName, Company, Email, PhoneNumber, CellNumber
AddressStreet, AddressCity, AddressState, AddressPostalCode
OwnerId (required: 6276), OfficeId (required: 285)
```

### Property Entity - Key Fields
```
AddressStreet, AddressCity, AddressState, AddressPostalCode
Latitude, Longitude, Types (enum)
OwnerId (required: 6276), OfficeId (required: 285)
```

### Job Entity - Key Fields
```
PropertyId, ClientId, PropertyContactId
Fee, Retainer, DueDate, EffectiveDate, InspectionDate
Purposes, RequestedValues, Scopes, ReportFormat (creation-only!)
IntendedUses, ClientComments, Comments (updateable)
OwnerId (required: 6276), OfficeId (required: 285)
```

---

## API Conventions

**OData Format**: `/api/v1/Jobs(702141)` not `/api/v1/Jobs/702141`

**Authentication**: OAuth password grant
```
POST https://auth.valcre.com/oauth/token
client_id: c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh
username: chris.chornohos@valta.ca
```

**Query Parameters**: `$select`, `$expand`, `$filter`, `$orderby`, `$top`, `$skip`, `$count`

---

## File Sizes

```
00-INDEX.md              8.3 KB  (master index)
ENTITY-Contact.md        3.7 KB  (36 fields)
ENTITY-Property.md       7.7 KB  (105 fields)
ENTITY-Job.md            4.7 KB  (55 fields)
ENTITY-PropertyContact   1.7 KB  (7 fields)
ENUMS-Job.md             5.9 KB  (8 enums)
EXTRACTION-SUMMARY.md   13.0 KB  (process documentation)
```

**Total**: 45 KB of comprehensive API documentation

---

## Related Documentation

- [/APR-Dashboard/CLAUDE.md](../../CLAUDE.md) - Critical Valcre integration knowledge
- [/03-Valcre-Integration.Dev/_FINAL-WORKING/](../../03-Valcre-Integration.Dev/_FINAL-WORKING/) - Working integration examples
- [/05-Master-Field-Mapping/](../) - Field mapping documentation

---

**Maintained By**: Ben Crowe
**Status**: Complete and verified
**Next Update**: When Valcre API schema changes
