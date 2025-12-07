# Valcre API Integration - APR Dashboard Phase 1

**Status:** ✅ **FULLY IMPLEMENTED & DEPLOYED**
**Last Updated:** November 4, 2025
**Project:** APR Dashboard v3
**Integration Type:** Two-way sync (Dashboard ↔ Valcre)

---

## Overview

Direct API integration with Valcre job management system. Syncs appraisal job data between APR Dashboard and Valcre using PascalCase field names and OAuth authentication.

## Architecture

### API Configuration
**File:** `src/config/valcre.ts`

```typescript
export const VALCRE_CONFIG = {
  apiUrl: 'https://api.valcre.com/v1',
  authEndpoint: '/oauth/token',
  jobsEndpoint: '/jobs',
  contactsEndpoint: '/contacts'
};

// Job number validation
export const isValcreJobNumber = (jobNumber?: string) => {
  if (!jobNumber) return false;
  // VAL prefix + 6 digits
  return /^VAL\d{6}$/.test(jobNumber);
};
```

### Integration Utility
**File:** `src/utils/webhooks/valcre.ts`

**Critical Bug Fix (October 2025):**
```typescript
// Line 142 - FIXED
Retainer: formatCurrency(data.retainerAmount)
// Previously used "RetainerAmount" which doesn't exist in Valcre API
```

## Field Mapping

### Dashboard → Valcre (PascalCase)

**Master Reference:** `.docs/field-mapping.md`

#### Client Contact Fields (7)
| Dashboard Field | Valcre Field | Type | Notes |
|----------------|--------------|------|-------|
| clientFirstName | Contact.FirstName | string | Property contact person |
| clientLastName | Contact.LastName | string | Property contact person |
| clientEmail | Contact.Email | string | Primary email |
| clientPhone | Contact.Phone | string | Raw numbers only |
| clientTitle | Contact.Title | string | Job title |
| clientOrganization | Contact.Company | string | Organization name |
| clientAddress | Contact.Address | string | Full address |

#### Property Fields (6)
| Dashboard Field | Valcre Field | Type | Notes |
|----------------|--------------|------|-------|
| propertyName | Job.PropertyName | string | Building/property name |
| propertyAddress | Job.AddressStreet | string | Street address |
| propertyTypes | Job.PropertyType | string | Comma-separated if multiple |
| intendedUse | Job.Purposes | string | Valuation purpose |
| valuationPremises | Job.ValuationType | string | Market value, etc. |
| assetCondition | Job.Condition | string | Excellent, Good, Fair, Poor |

#### LOE/Quote Fields (5)
| Dashboard Field | Valcre Field | Type | Notes |
|----------------|--------------|------|-------|
| appraisalFee | Job.Fee | number | Strip $ and commas |
| retainerAmount | **Job.Retainer** | number | **CRITICAL: Use Retainer not RetainerAmount** |
| paymentTerms | Job.PaymentTerms | string | On LOE Signature, NET 30, etc. |
| reportDeliveryDate | Job.DeliveryDate | date | ISO format |
| internalComments | Job.InternalNotes | string | Appraiser comments |

#### Building Information (5)
| Dashboard Field | Valcre Field | Type | Notes |
|----------------|--------------|------|-------|
| yearBuilt | Building.YearBuilt | string | Year as string |
| buildingSize | Building.GrossBuildingArea | string | Square footage |
| numberOfUnits | Building.NumberOfUnits | number | Integer |
| parkingSpaces | Building.ParkingSpaces | number | Integer |
| legalDescription | Property.LegalDescription | string | Full legal description |

### Currency Field Handling

**Critical Pattern:**
```typescript
// WRONG (Don't do this)
const value = "$1,234.56"
sendToValcre({ Fee: value }) // ❌ API will reject

// CORRECT
const rawValue = value.replace(/[^0-9.]/g, '') // "1234.56"
const numericValue = parseFloat(rawValue) // 1234.56
sendToValcre({ Fee: numericValue }) // ✅
```

**Implementation:**
```typescript
const formatCurrency = (value: string | number): number => {
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

// Usage in sync
const syncData = {
  Fee: formatCurrency(jobDetails.appraisalFee),
  Retainer: formatCurrency(jobDetails.retainerAmount),
  // ... other fields
};
```

## Sync Triggers

### Auto-Sync Scenarios

**1. Field Update (Dashboard → Valcre)**
```typescript
// Triggered on field blur (500ms debounce)
const autoSaveField = async (fieldName, value) => {
  // Always save to Supabase first
  await supabase.from('job_loe_details').upsert({
    job_id: job.id,
    [fieldName]: value
  });

  // Sync to Valcre if conditions met
  if (isValcreJobNumber(jobDetails.jobNumber) && jobDetails.valcreJobId) {
    await sendToValcre({
      jobId: jobDetails.valcreJobId,
      jobNumber: jobDetails.jobNumber,
      updateType: 'loe_details',
      [fieldName]: value
    });
  }
};
```

**2. LOE Generation (Dashboard → Valcre)**
```typescript
// When LOE is generated
await sendToValcre({
  jobId: valcreJobId,
  jobNumber: jobNumber,
  updateType: 'loe_generated',
  loeDocumentUrl: docusealSubmission.documents[0].url,
  loeGeneratedAt: new Date().toISOString()
});
```

**3. Job Creation (Valcre → Dashboard)**
```typescript
// Manual job number entry creates Valcre job
onJobNumberAssigned(async (jobNumber) => {
  const valcreJob = await createValcreJob({
    JobNumber: jobNumber,
    PropertyName: job.propertyName,
    AddressStreet: job.propertyAddress,
    // ... all available fields
  });

  // Store Valcre ID in dashboard
  await supabase.from('job_loe_details').update({
    valcre_job_id: valcreJob.id
  }).eq('job_id', job.id);
});
```

## Sync Status Tracking

### Database Fields
```sql
ALTER TABLE job_loe_details ADD COLUMN valcre_job_id VARCHAR;
ALTER TABLE job_loe_details ADD COLUMN valcre_synced_at TIMESTAMP;
ALTER TABLE job_loe_details ADD COLUMN valcre_sync_error TEXT;
```

### Sync Validation
```typescript
const validateSync = (jobDetails) => {
  const errors = [];

  if (!isValcreJobNumber(jobDetails.jobNumber)) {
    errors.push('Invalid job number format (must be VAL######)');
  }

  if (!jobDetails.valcreJobId) {
    errors.push('No Valcre job ID found');
  }

  if (!jobDetails.propertyAddress) {
    errors.push('Property address required');
  }

  return {
    canSync: errors.length === 0,
    errors
  };
};
```

## Error Handling

### Common Errors

**1. Retainer Field Error (Fixed October 2025)**
```typescript
// OLD (Broken)
RetainerAmount: formatCurrency(data.retainerAmount) // ❌ Field doesn't exist

// NEW (Fixed)
Retainer: formatCurrency(data.retainerAmount) // ✅ Correct field name
```

**2. Currency Format Error**
```
Error: Invalid value for Fee: "$1,234.56"
Expected: number
```
**Fix:** Strip formatting before sending

**3. Missing Job ID**
```
Error: Job not found in Valcre
```
**Fix:** Ensure `valcre_job_id` is set in database

**4. Authentication Error**
```
Error: OAuth token expired
```
**Fix:** Implement token refresh logic

### Retry Logic
```typescript
const sendToValcre = async (data, retries = 3) => {
  try {
    const response = await fetch(VALCRE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Valcre API error: ${response.status}`);
    }

    return {
      success: true,
      data: await response.json()
    };
  } catch (error) {
    if (retries > 0) {
      await delay(1000);
      return sendToValcre(data, retries - 1);
    }

    return {
      success: false,
      error: error.message
    };
  }
};
```

## Testing

### Test Scenarios

**1. New Job Creation**
```typescript
// Create job in dashboard
const job = await createJob({
  clientEmail: 'test@example.com',
  propertyAddress: '123 Main St, Calgary, AB'
});

// Assign Valcre job number
await assignJobNumber(job.id, 'VAL250137');

// Verify sync
const valcreJob = await getValcreJob('VAL250137');
expect(valcreJob.AddressStreet).toBe('123 Main St, Calgary, AB');
```

**2. Field Update Sync**
```typescript
// Update field in dashboard
await updateJobDetails(job.id, {
  appraisalFee: 2500
});

// Verify Valcre updated
const valcreJob = await getValcreJob(job.valcreJobId);
expect(valcreJob.Fee).toBe(2500);
```

**3. Currency Formatting**
```typescript
// Test currency cleaning
expect(formatCurrency('$1,234.56')).toBe(1234.56);
expect(formatCurrency('1234.56')).toBe(1234.56);
expect(formatCurrency(1234.56)).toBe(1234.56);
```

## Known Issues

### Resolved
- ✅ **Retainer field name** - Fixed October 2025 (line 142 in valcre.ts)
- ✅ **Currency formatting** - Implemented strip and parse logic
- ✅ **Field name mapping** - Documented in field-mapping.md

### Current Limitations
- ⚠️ **One-way sync priority** - Dashboard → Valcre (Valcre → Dashboard not implemented)
- ⚠️ **No conflict resolution** - Last write wins
- ⚠️ **Manual job number entry** - No auto-generation from Valcre
- ⚠️ **Token refresh** - OAuth tokens not automatically refreshed

## Configuration

### Environment Variables
```env
# Valcre API Configuration
VITE_VALCRE_API_URL=https://api.valcre.com/v1
VITE_VALCRE_CLIENT_ID=your_client_id
VITE_VALCRE_CLIENT_SECRET=your_client_secret
VITE_VALCRE_REDIRECT_URI=https://apr-dashboard-v3.vercel.app/auth/callback
```

### API Credentials
**Stored in:** Vercel Environment Variables (Production)
**Never commit:** Keep credentials out of git repository

## Documentation References

### Critical Documents
- `/Users/bencrowe/Development/APR-Dashboard-v3/.docs/field-mapping.md` - **MASTER FIELD REFERENCE**
- `/Users/bencrowe/Development/APR-Dashboard-v3/.docs/api-reference.md` - API endpoints
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/utils/webhooks/valcre.ts` - Implementation
- `/Users/bencrowe/Development/APR-Dashboard-v3/src/config/valcre.ts` - Configuration

### Related Sections
- **Section 4: APR Dashboard** - Source of data being synced
- **Section 6: LOE Generator** - Uses Valcre job data

---

**Valcre integration is production-ready with critical retainer field bug fixed.**
