# Valcre Entity Model Discovery - CRITICAL FINDING
*Last Updated: September 9, 2025*

## 🚨 CRITICAL DISCOVERY: Why VAL251001 Shows Client Info But VAL251002 Doesn't

### The Problem
- **VAL251001** (Mike Winnitoy) - Shows client name, company, address in Valcre file explorer ✅
- **VAL251002** (Riverside Complex) - Missing client info in Valcre file explorer ❌

### The Root Cause
Valcre uses **separate entity relationships**, not inline fields on the Job object!

## Valcre Entity Model

### Core Entities

#### 1. **Contact** Entity (Shows as "Client" in Valcre)
```javascript
Contact {
  Id: number,
  Company: string,           // Shows in "Client Company" column
  FirstName: string,         // Combined for "Client Name" column
  LastName: string,          // Combined for "Client Name" column
  AddressStreet: string,     // Shows in "Street" column
  AddressCity: string,       // Shows in "City" column
  AddressState: string,      // Shows in "State/Province" column
  PhoneNumber: string,
  Email: string,
  // ... other fields
}
```

#### 2. **Property** Entity
```javascript
Property {
  Id: number,
  Name: string,
  AddressStreet: string,
  AddressCity: string,
  AddressState: string,
  // ... property details
}
```

#### 3. **Job** Entity
```javascript
Job {
  Id: number,
  Number: string,            // e.g., "VAL251001"
  Name: string,              // Job name/description
  
  // CRITICAL RELATIONSHIPS:
  ClientId: number,          // References Contact entity (SHOWS CLIENT INFO!)
  PropertyId: number,        // References Property entity
  PropertyContactId: number, // References another Contact (property contact)
  
  // Direct fields:
  Status: string,
  Fee: number,
  IntendedUses: string,
  Comments: string,
  // ... other job fields
}
```

## Why VAL251001 Works But VAL251002 Doesn't

### VAL251001 Structure:
```json
{
  "Number": "VAL251001",
  "ClientId": 13538052,        // ✅ HAS CLIENT REFERENCE!
  "PropertyContactId": null,
  // ... other fields
}
```
- Has `ClientId` which references a Contact entity
- Valcre loads the Contact and displays its Company, Name, and Address fields

### VAL251002 Structure:
```json
{
  "Number": "VAL251002",
  "ClientId": null,             // ❌ NO CLIENT REFERENCE!
  "PropertyContactId": 13538062,
  // ... other fields
}
```
- No `ClientId` means no client info to display
- Only has `PropertyContactId` which is for additional contacts, not the main client

## The Solution: Two-Step Process

### Step 1: Create Contact Entity First
```javascript
// Create the client Contact
const contactResponse = await fetch('https://api-core.valcre.com/api/v1/Contacts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Company: formData.clientOrganization,
    FirstName: firstName,
    LastName: lastName,
    AddressStreet: formData.propertyAddress,
    AddressCity: parsedCity,
    AddressState: 'AB',
    PhoneNumber: formData.clientPhone,
    Email: formData.clientEmail,
    OwnerId: 7095
  })
});

const contact = await contactResponse.json();
const clientId = contact.Id;
```

### Step 2: Create Job with ClientId Reference
```javascript
// Create the job with ClientId reference
const jobResponse = await fetch('https://api-core.valcre.com/api/v1/Jobs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Name: formData.propertyName,
    Number: '',  // Auto-generated
    Status: 'Lead',
    OwnerId: 7095,
    
    // CRITICAL: Reference the Contact entity!
    ClientId: clientId,  // This makes client info appear!
    
    // Optional: Still include PropertyContact for additional info
    PropertyContact: {
      FirstName: firstName,
      LastName: lastName,
      // ... other contact fields
    },
    
    // Other job fields
    Fee: formData.appraisalFee,
    IntendedUses: 'Financing',
    // ... etc
  })
});
```

## Implementation Requirements

### 1. Update Edge Function
The Edge Function needs to:
1. First create a Contact entity
2. Get the Contact ID
3. Create the Job with `ClientId` set to the Contact ID

### 2. Update valcre.ts
The frontend doesn't need major changes, just ensure it sends all client data to the Edge Function.

### 3. Handle Existing Contacts
Consider checking if a Contact already exists (by email or company name) before creating a new one to avoid duplicates.

## Field Mapping Summary

| APR Field | Valcre Entity | Valcre Field | Purpose |
|-----------|---------------|--------------|---------|
| clientOrganization | Contact | Company | Shows in "Client Company" column |
| clientName | Contact | FirstName + LastName | Shows in "Client Name" column |
| propertyAddress | Contact | AddressStreet | Shows in "Street" column |
| (parsed city) | Contact | AddressCity | Shows in "City" column |
| clientPhone | Contact | PhoneNumber | Contact phone |
| clientEmail | Contact | Email | Contact email |
| propertyName | Job | Name | Job name |
| appraisalFee | Job | Fee | Job fee |
| intendedUse | Job | IntendedUses | Job purpose |

## Testing Validation

To verify this works:
1. Create a Contact via API
2. Create a Job with ClientId set to the Contact ID
3. Check Valcre file explorer - client info should appear!

## Notes

- The "Client" columns in Valcre's file explorer come from the related Contact entity, NOT from fields on the Job itself
- PropertyContactId is for additional contacts, not the main client display
- This explains why some jobs show client info (have ClientId) and others don't (only have PropertyContactId)
- VAL251001 was likely created manually in Valcre with a proper Contact reference

---
*This discovery is critical for proper Valcre integration. Without creating a Contact entity and referencing it via ClientId, jobs will not display client information in Valcre's file explorer.*