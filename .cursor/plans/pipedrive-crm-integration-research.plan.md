# Pipedrive CRM Integration - Research & Planning

**Session ID**: pipedrive-crm-research-2025-10-10  
**Status**: Research Complete - Awaiting Business Decision  
**Priority**: Medium (depends on business requirements)  
**Researcher**: Marcel (Terminal)  
**Date**: October 10, 2025

---

## Executive Summary

Marcel completed deep-dive research on Pipedrive CRM integration for APR Dashboard V3. **Key finding**: No existing Pipedrive integration found in current codebase. Multiple n8n community templates available, but Chris's specific Pipedrive setup, Make.com workflows, and API credentials are missing.

**Critical Question**: Is Pipedrive still needed, or has it been replaced by GoHighLevel (GHL) CRM?

---

## Research Findings

### ✅ FOUND: Available Resources

#### 1. n8n Workflow Templates
**Location**: `/Users/bencrowe/Documents/Vault/Dev.Proj/Core-Dev-Environment/8.n8n-Expert-System/workflows/`

**6 Community Templates Discovered**:
1. `0062_Manual_Pipedrive_Create_Triggered.json` - Manual deal creation (2 nodes)
2. `0071_Pipedrive_Update_Triggered.json` - Webhook-triggered updates (1 node)
3. `0249_Pipedrive_Stickynote_Create_Webhook.json` - Note creation via webhook (11 nodes)
4. `0251_Pipedrive_Spreadsheetfile_Create_Triggered.json` - Spreadsheet integration (12 nodes)
5. `0379_Code_Pipedrive_Create_Triggered.json` - Box + OpenAI + Pipedrive (11 nodes)
6. `1619_Code_Pipedrive_Automation_Triggered.json` - Full automation workflow (11 nodes)

**Status**: Generic templates, not customized for Chris's business

#### 2. GoHighLevel (GHL) CRM Documentation
**Location**: `/01-APR-Resources/12-CRM-Setup/`

**Contents**:
- Complete GHL pipeline stages
- Automation workflows
- **Hypothesis**: GHL might be the REPLACEMENT for Pipedrive

#### 3. Current Tech Stack (Confirmed Integrations)
- ✅ **Valcre API** - Appraisal management (working)
- ✅ **ClickUp API** - Task management (working)
- ✅ **DocuSeal** - E-signatures (working)
- ✅ **Supabase** - Database (working)
- ❌ **Pipedrive** - NOT integrated

### ❌ NOT FOUND: Critical Missing Components

#### 1. Pipedrive API Credentials
**Searched Locations**:
- `/01-APR-Resources/02-Credentials/01-CREDENTIALS-VAULT.md` - Not found
- Golden Memories - Not found
- Environment variables (.env files) - Not found
- APR Dashboard codebase - Not found

**What's Missing**:
- Pipedrive API token
- Pipedrive company domain
- Account owner details (personal vs company account)

#### 2. Make.com Workflows
**Expected**: 8 Make.com workflow files (per ECOSYSTEM-INVENTORY)  
**Found**: 0 files

**Searched Locations**:
- APR-Dashboard repository - No Make.com JSON
- APR-Console-Project - No Make.com JSON
- Documents/Vault - No Make.com exports

**Hypothesis**: Make.com workflows might be:
1. In a separate Make.com account (not exported)
2. Deprecated/deleted when switching to n8n
3. Never migrated to V3 codebase

#### 3. Jotform → Pipedrive Integration
**References Found**:
- Jotform mentioned in field mapping docs
- No Jotform webhook configuration
- No Jotform API credentials
- No active Jotform integration in V3

**Questions**:
- Was Jotform the OLD submission form (before V3)?
- Did Jotform → Make.com → Pipedrive workflow exist?
- Is this legacy architecture from pre-V3 days?

#### 4. Data Field Mapping
**Missing Documentation**:
- No mapping table: APR Dashboard fields → Pipedrive fields
- Unknown custom fields in Pipedrive
- No sync logic documentation

---

## Integration Architecture Questions

### Business Logic (UNANSWERED)

**When should sync happen?**
- [ ] On job creation?
- [ ] On status updates?
- [ ] On client submission?
- [ ] Manual trigger only?

**What entities sync?**
- [ ] Deals (jobs/appraisals)?
- [ ] Persons (clients)?
- [ ] Organizations (client companies)?
- [ ] Activities (tasks/notes)?

**Sync Direction**:
- [ ] One-way: Dashboard → Pipedrive
- [ ] Two-way: Dashboard ↔ Pipedrive
- [ ] Pipedrive as source of truth?

**Integration Purpose**:
- [ ] Replace ClickUp integration?
- [ ] Run alongside ClickUp (dual CRM)?
- [ ] Legacy system (GHL is replacement)?

### Technical Architecture (UNKNOWN)

**Current V3 Stack**:
```
User → APR Dashboard V3 → Supabase → ???
                         ↓
                    Valcre API (working)
                    ClickUp API (working)
                    Pipedrive API (missing)
```

**Proposed Options**:

**Option A: Direct API Integration** (like Valcre)
```
Dashboard → api/pipedrive.ts → Pipedrive REST API
          → Supabase (persist sync status)
```

**Option B: n8n Middleware**
```
Dashboard → Webhook → n8n → Pipedrive API
          → Supabase
```

**Option C: Hybrid** (like current ClickUp)
```
Dashboard → Supabase → Database Trigger → Webhook → n8n → Pipedrive
```

---

## Field Mapping (NEEDS DEFINITION)

### APR Dashboard Fields → Pipedrive Fields

**Unknown Mappings** (examples to clarify):

| APR Dashboard Field | Pipedrive Field | Notes |
|---------------------|-----------------|-------|
| `clientFirstName` | `Person.first_name`? | TBD |
| `clientLastName` | `Person.last_name`? | TBD |
| `clientEmail` | `Person.email`? | TBD |
| `clientOrganization` | `Organization.name`? | TBD |
| `propertyAddress` | `Deal.custom_field`? | TBD |
| `jobNumber` (VAL251022) | `Deal.title`? | TBD |
| `appraisalFee` | `Deal.value`? | TBD |
| `deliveryDate` | `Deal.expected_close_date`? | TBD |
| `intendedUse` | `Deal.custom_field`? | TBD |

**Custom Fields** (if any):
- [ ] List Pipedrive custom fields
- [ ] Map to APR Dashboard fields

---

## Critical Information Needed from Ben

### 1. Pipedrive API Credentials
- **API Token**: [REQUIRED]
- **Company Domain**: [REQUIRED] (e.g., `chrischornohos.pipedrive.com`)
- **Account Type**: Personal or company account?
- **Account Owner**: Chris Chornohos email?

### 2. Make.com Workflow Export
- **Option A**: Export JSON from Make.com account
- **Option B**: Screenshots of Make.com scenarios
- **Option C**: Describe workflow: "When Jotform submits → What happens in Make.com → What hits Pipedrive"

### 3. Business Requirements Clarification
- **Question 1**: Is Pipedrive still needed for V3?
- **Question 2**: Or has GoHighLevel (GHL) replaced Pipedrive?
- **Question 3**: If both exist, what's the split? (GHL for sales, Pipedrive for operations?)
- **Question 4**: When should data sync to Pipedrive?

### 4. Field Mapping Requirements
- **Question 1**: Which APR Dashboard fields MUST sync to Pipedrive?
- **Question 2**: Are there custom fields in Pipedrive?
- **Question 3**: Should we sync Property Contact separately from Client Contact?
- **Question 4**: How should we handle job updates (PATCH existing deal or create new activity)?

### 5. Integration Architecture Preference
- **Option A**: Direct API (like Valcre) - Fast, real-time
- **Option B**: n8n workflows - Flexible, visual debugging
- **Option C**: Hybrid - Supabase triggers + n8n

---

## Recommended Next Steps

### Phase 1: Business Decision (BEN'S INPUT REQUIRED)

**Task 1.1**: Clarify Pipedrive vs GHL CRM Strategy
- [ ] Is Pipedrive active or legacy?
- [ ] Is GHL the primary CRM now?
- [ ] Do we need both?

**Task 1.2**: Provide Pipedrive API Credentials
- [ ] API token
- [ ] Company domain
- [ ] Account owner

**Task 1.3**: Define Integration Scope
- [ ] What entities sync (Deals/Persons/Orgs)?
- [ ] When does sync happen (creation/update/manual)?
- [ ] One-way or two-way sync?

### Phase 2: Architecture Design (MARCEL + CURSOR)

**Task 2.1**: Map APR Dashboard → Pipedrive Fields
- [ ] Create mapping table
- [ ] Identify custom fields
- [ ] Define data transformations

**Task 2.2**: Choose Integration Approach
- [ ] Direct API (api/pipedrive.ts)
- [ ] n8n workflows
- [ ] Hybrid (Supabase triggers + n8n)

**Task 2.3**: Design Sync Logic
- [ ] When to trigger sync
- [ ] Error handling strategy
- [ ] Retry logic
- [ ] Conflict resolution (if two-way)

### Phase 3: Implementation (CURSOR)

**Task 3.1**: Set Up Pipedrive API Connection
- [ ] Create `api/pipedrive.ts` handler
- [ ] Test authentication
- [ ] Implement rate limiting

**Task 3.2**: Build Entity Creation Flows
- [ ] Create Person (client)
- [ ] Create Organization (client company)
- [ ] Create Deal (job/appraisal)
- [ ] Link entities correctly

**Task 3.3**: Build Update Flows
- [ ] Update Deal on job changes
- [ ] Add Activity/Note on status updates
- [ ] Handle PropertyContact separately?

**Task 3.4**: Add Sync Status Tracking
- [ ] Supabase table: `pipedrive_sync_log`
- [ ] Track sync attempts, errors, timestamps
- [ ] UI indicator (like Valcre "Syncs to Valcre" badge)

### Phase 4: Testing & Validation

**Task 4.1**: Test Entity Creation
- [ ] Create test job → Verify Pipedrive Deal created
- [ ] Verify Person/Organization linking
- [ ] Check all custom fields populated

**Task 4.2**: Test Update Sync
- [ ] Update job in Dashboard → Verify Pipedrive updates
- [ ] Test error scenarios (invalid API token, rate limits)

**Task 4.3**: Production Rollout
- [ ] Enable for test jobs first
- [ ] Monitor sync success rate
- [ ] Full rollout after validation

---

## Open Questions for Discussion

1. **Primary CRM Strategy**:
   - Is Pipedrive the primary CRM or is it GHL?
   - If both, what's the division of responsibility?

2. **Make.com Migration**:
   - Do we reverse-engineer old Make.com workflows?
   - Or build fresh integration with modern architecture?

3. **Jotform Legacy**:
   - Was Jotform the old form system (pre-V3)?
   - Can we ignore Jotform → Pipedrive flow for V3?

4. **ClickUp Integration**:
   - Does Pipedrive REPLACE ClickUp?
   - Or do both integrations coexist?

5. **Custom Fields**:
   - What custom fields exist in Pipedrive?
   - Do we need to create new custom fields?

---

## Reference Materials

### Valcre API Integration (Working Model)
**Location**: `/Users/bencrowe/Development/APR-Dashboard/api/valcre.ts`

**Key Patterns to Replicate**:
- OAuth authentication flow
- Entity creation (Contact, Property, Job)
- Error handling with graceful degradation
- Retry logic for transient failures
- Sync status tracking

### ClickUp API Integration (Working Model)
**Location**: `/Users/bencrowe/Development/APR-Dashboard/src/utils/webhooks/clickup.ts`

**Key Patterns**:
- Task creation on job submission
- Task updates on status changes
- Link tasks to jobs via custom fields

### n8n Workflow Templates
**Location**: `/Users/bencrowe/Documents/Vault/Dev.Proj/Core-Dev-Environment/8.n8n-Expert-System/workflows/`

**Available Templates**:
- Manual Pipedrive create
- Webhook-triggered updates
- Sticky note creation
- Spreadsheet integration
- Full automation workflows

---

## Success Criteria

**Integration is successful when**:
1. ✅ Every new job creates a Deal in Pipedrive
2. ✅ Client Contact creates/updates Person in Pipedrive
3. ✅ Client Organization creates/updates Organization in Pipedrive
4. ✅ Job updates sync to Pipedrive Deal
5. ✅ Sync failures are logged and retried
6. ✅ UI shows sync status (like Valcre badge)
7. ✅ No duplicate entities created
8. ✅ Integration doesn't break existing Valcre/ClickUp flows

---

## Todo Items

- [ ] **Ben**: Clarify Pipedrive vs GHL CRM strategy
- [ ] **Ben**: Provide Pipedrive API credentials
- [ ] **Ben**: Export Make.com workflows OR describe old Jotform flow
- [ ] **Ben**: Define field mapping requirements
- [ ] **Marcel**: Research Pipedrive API documentation
- [ ] **Marcel**: Create field mapping table template
- [ ] **Cursor**: Implement Pipedrive API integration (after requirements clear)
- [ ] **Cursor**: Add sync status tracking
- [ ] **Cursor**: Build UI indicators for Pipedrive sync

---

**Next Action**: Awaiting Ben's input on business requirements and API credentials before proceeding to Phase 2 (Architecture Design).

---

**Related Documents**:
- `/01-APR-Resources/12-CRM-Setup/` - GHL CRM documentation
- `.cursor/plans/remove-field-indicators-add-section-spinner-e74158f8.plan.md` - Current PropertyType/PropertyContact work
- `/Users/bencrowe/Documents/Vault/Dev.Proj/Core-Dev-Environment/03-Memory-Database/GOLDEN_MEMORIES.md` - System knowledge base
