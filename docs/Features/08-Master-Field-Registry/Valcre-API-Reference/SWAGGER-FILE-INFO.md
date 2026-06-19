# Valcre API Documentation - Master Reference

**Date Created:** October 4, 2025
**Purpose:** Central reference for all Valcre API documentation sources

---

## 🎯 Live API Documentation URLs

### Primary Documentation Sources

**Swagger/Jagger API Documentation:**
```
https://api-core.valcre.com/swagger/
```
- Complete API reference with all endpoints
- All entity field names (Job, Property, Contact, PropertyContact, etc.)
- Data types, required fields, validation rules
- Request/response examples
- **Use this as the definitive source for API field names**

**Data Dictionary:**
```
https://go.valcre.com/data-dictionary
```
- Field definitions and descriptions
- Business logic explanations
- Field relationships

**Sample Application:**
```
https://go.valcre.com/api-sample
```
- Working code examples
- Integration patterns

---

## 📄 Local PDF Documentation

**Valcre API Guide PDF Locations:**

1. **APR Dashboard (Primary):**
   ```
   /Users/bencrowe/Development/APR-Dashboard/01-APR-Resources/02-Credentials/Valcre API Guide.pdf
   ```

2. **Valcre Integration Reference:**
   ```
   /Users/bencrowe/Development/APR-Dashboard/03-Valcre-Integration.Dev/03-Reference/Valcre API Guide.pdf
   ```

3. **APR Hub Master:**
   ```
   /Users/bencrowe/Documents/Vault/Dev.Proj/Projects-Active/APR-Ecosystem/01-APR-Hub-MAIN/_APR-Hub-Master/02-Credentials/Valcre API Guide.pdf
   ```

---

## 🔑 API Access Information

**OAuth Token Endpoint:**
```
https://auth.valcre.com/oauth/token
```

**Base API URL:**
```
https://api-core.valcre.com/api/v1/
```

**Authentication Details:**
- See: `/01-APR-Resources/02-Credentials/VALCRE-CREDENTIALS.md`
- OAuth 2.0 password grant flow
- Tokens expire after 24 hours
- Supports refresh tokens

---

## 🎯 Key Entities & Endpoints

### Contact Entity
```
POST /api/v1/Contacts
GET /api/v1/Contacts(id)
PATCH /api/v1/Contacts(id)
```

### Property Entity
```
POST /api/v1/Properties
GET /api/v1/Properties(id)
PATCH /api/v1/Properties(id)
```

### Job Entity
```
POST /api/v1/Jobs
GET /api/v1/Jobs(id)
PATCH /api/v1/Jobs(id)
```

### PropertyContacts (Relationship)
```
POST /api/v1/PropertyContacts
```
- Links Contact entity to Property entity
- Separate from PropertyContact embedded in Job

---

## 📝 Next Steps for Complete Documentation

### Task: Extract All API Field Definitions

**Objective:** Create comprehensive field mapping documentation from Swagger API docs

**Agent to Use:** `api-designer` or `api-documenter`

**URLs to Scrape/Document:**
1. Swagger API: https://api-core.valcre.com/swagger/
2. Data Dictionary: https://go.valcre.com/data-dictionary

**Output Format:**
- Markdown files for each entity (Contact.md, Property.md, Job.md, etc.)
- Include: Field name, data type, required/optional, description, validation rules
- Cross-reference with our existing field mappings

**Deliverable:**
- Complete searchable API field reference
- Easy lookup for any Valcre API field
- Eliminates guesswork in field mapping table

---

## 📚 Related Documentation

**Current Field Mapping Table:**
```
/05-Master-Field-Mapping/CLIENT-SUBMISSION-FORM-FIELDS.md
```

**LOE Fields Reference:**
```
/05-Master-Field-Mapping/LOE-FIELDS-MASTER-REFERENCE.md
```

**Successful Test Scripts:**
```
/03-Valcre-Integration.Dev/SCRIPTS-REVIEW-2025-10-03/01-test-valcre-complete-workflow.js
```

**Entity Model Documentation:**
```
/03-Valcre-Integration.Dev/valcre-integration/documentation/VALCRE-ENTITY-MODEL-DISCOVERY.md
```

---

## 🔍 Support Contacts

**Valcre Support:** support@valcre.com
**API Documentation Contact:** Grant Norling, MAI
**Phone:** +1 (503) 481-4958

---

**Status:** Ready for agent to extract complete field definitions from Swagger docs
