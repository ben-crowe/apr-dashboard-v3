# TDD Dashboard - Tab Architecture & Field Management

**Exported:** 2025-12-24 05:45 MST

## Executive Summary

The TDD (Test Data Dashboard) uses a **dual-layer tab architecture**:
- **S-Tabs (S1, S2, S3):** Workflow/management tabs for data entry consolidation
- **Numbered Tabs (01-22):** Report section tabs mirroring the Valcre workbook

Fields can appear in numbered tabs but be **"managed elsewhere"** via hyperlink, pointing users to the S-tabs where actual data entry happens.

---

## The Two Tab Types

### S-Tabs: Data Entry Management (3 tabs)

| Tab | Name | Purpose | Data Source |
|-----|------|---------|-------------|
| **S1** | Client Intake | Client-submitted info | External form (client fills out) |
| **S2** | LOE Prep | Appraiser job setup | Appraiser reviews & enters |
| **S3** | Image Management | All image uploads | Appraiser uploads here |

**Key Insight:** These tabs consolidate WHERE data entry happens, even if the data APPEARS elsewhere in the report structure.

### Numbered Tabs: Report Sections (01-22)

| Tab | Name | Mirrors |
|-----|------|---------|
| 01 | Cover Page | Valcre workbook Cover tab |
| 02 | Introduction Letter | Transmittal section |
| 05 | Report Information | Report setup |
| 06 | Executive Summary | Exec summary |
| 08 | Site Details | Site tab |
| 09 | Location Analysis | Location tab |
| 10 | Property Taxes | Tax tab |
| 11 | Market Analysis | Market tab |
| 12 | Improvements | Improvements tab |
| 13 | Zoning | Zoning tab |
| 14 | Highest & Best Use | HBU tab |
| 15 | Valuations | Income/Sales/Cost approaches |
| 16 | Land Value | Land valuation |
| 18 | Sales Comps | Sales comparison tab |
| 19 | Rent Comps | Rent survey tab |
| 20 | Rent Roll | Rent roll tab |
| 21 | Reconciliation | Final value reconciliation |
| 22 | Certification | Appraiser certification |

**Key Insight:** These tabs mirror the Valcre workbook structure because **appraisers think about reports this way**. Familiar mental model = easier adoption.

---

## The "Managed Elsewhere" Pattern

### Problem It Solves

Some fields logically belong in multiple places:
- Client name appears in Cover Page, Executive Summary, Certification
- Cover photo appears in Cover Page, Report Information
- Property address appears everywhere

**Without this pattern:** User enters same data in 5 different tabs = frustrating, error-prone.

**With this pattern:** User enters data ONCE in the management tab, sees it referenced elsewhere.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Tab 06 - EXECUTIVE SUMMARY                                 │
│                                                             │
│  Client Name: [Kenneth Engler]                              │
│               ↳ "Managed in S1 - Client Intake" [link]      │
│                                                             │
│  Property Photo: [thumbnail]                                │
│                  ↳ "Managed in S3 - Image Management" [link]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

User sees the field in context (Executive Summary) but clicks the link to edit it in the consolidated management tab (S1 or S3).

### Visual Behavior

| In Numbered Tab | Shows | Editable? | Link Goes To |
|-----------------|-------|-----------|--------------|
| Client info fields | Current value | No (read-only) | S1 - Client Intake |
| LOE/job fields | Current value | No (read-only) | S2 - LOE Prep |
| Image fields | Thumbnail/path | No (read-only) | S3 - Image Management |

---

## Field Flow Diagram

```
EXTERNAL INTAKE FORM (Client fills)
         │
         ▼
┌─────────────────────┐
│  S1 - CLIENT INTAKE │  ← Primary data entry
│  - client-name      │
│  - client-email     │
│  - property-address │
│  - intended-use     │
└─────────────────────┘
         │
         │ Auto-populates ──────────────────┐
         ▼                                  ▼
┌─────────────────────┐           ┌─────────────────────┐
│  S2 - LOE PREP      │           │  01 - COVER PAGE    │
│  (Appraiser adds)   │           │  (Shows client info │
│  - appraisal-fee    │           │   as read-only)     │
│  - delivery-date    │           │                     │
│  - scope-of-work    │           │  "Managed in S1" ↗  │
└─────────────────────┘           └─────────────────────┘
         │                                  │
         ▼                                  ▼
┌─────────────────────┐           ┌─────────────────────┐
│  S3 - IMAGE MGT     │           │  06 - EXEC SUMMARY  │
│  (All uploads here) │           │  (Shows images as   │
│  - cover-photo      │ ─────────▶│   thumbnails)       │
│  - subject-photos   │           │                     │
│  - comp-photos      │           │  "Managed in S3" ↗  │
│  - maps             │           └─────────────────────┘
└─────────────────────┘
```

---

## Why This Architecture?

### 1. Familiarity for Appraisers
Numbered tabs match Valcre workbook → appraisers know where things are.

### 2. Clean Data Entry
S-tabs consolidate input → no hunting across 22 tabs to enter client info.

### 3. Single Source of Truth
Field is stored once → displayed many places → no sync issues.

### 4. Workflow Separation
- S1 = Client workflow (external form)
- S2 = Appraiser workflow (job setup)
- S3 = Asset workflow (images)
- 01-22 = Report assembly (review, not entry)

### 5. Reduced Errors
Can't accidentally enter different client names in different tabs.

---

## Registry Implementation

### S-Tab Fields (Managed Here)

```typescript
// S1 - Client Intake fields
{ id: 'intake-client-first-name', section: 'client-intake', ... }
{ id: 'intake-client-email', section: 'client-intake', ... }
{ id: 'intake-property-name', section: 'client-intake', ... }

// S2 - LOE Prep fields  
{ id: 'loe-appraisal-fee', section: 'loe-prep', ... }
{ id: 'loe-delivery-date', section: 'loe-prep', ... }

// S3 - Image Management fields
{ id: 'img-cover-photo', section: 'image-mgt', ... }
{ id: 'img-exterior-1', section: 'image-mgt', ... }
{ id: 'comp1-photo', section: 'image-mgt', ... }
```

### Numbered Tab Fields (Display Here, Managed Elsewhere)

Some fields in numbered tabs might have a `managedIn` property (or similar) indicating they're read-only references:

```typescript
// In Cover Page section - displays client name
{ id: 'client-name', section: 'cover', managedIn: 'client-intake', ... }

// In Executive Summary - displays cover photo
{ id: 'cover-photo', section: 'exec', managedIn: 'image-mgt', ... }
```

---

## Field Counts by Tab

| Tab | Fields | Primary Entry? |
|-----|--------|----------------|
| S1 - Client Intake | 24 | ✅ Yes |
| S2 - LOE Prep | 11 | ✅ Yes |
| S3 - Image Management | 123 | ✅ Yes |
| 01 - Cover Page | 33 | Mixed |
| 02 - Introduction Letter | 1 | No |
| 05 - Report Information | 18 | Mixed |
| 06 - Executive Summary | 55 | Mixed |
| 08 - Site Details | 32 | ✅ Yes |
| 09 - Location Analysis | 6 | ✅ Yes |
| 10 - Property Taxes | 6 | ✅ Yes |
| 11 - Market Analysis | 13 | ✅ Yes |
| 12 - Improvements | 40 | ✅ Yes |
| 13 - Zoning | 6 | ✅ Yes |
| 14 - Highest & Best Use | 10 | ✅ Yes |
| 15 - Valuations | 80 | ✅ Yes |
| 16 - Land Value | 1 | ✅ Yes |
| 18 - Sales Comps | 187 | ✅ Yes |
| 19 - Rent Comps | 170 | ✅ Yes |
| 20 - Rent Roll | 14 | ✅ Yes |
| 21 - Reconciliation | 8 | ✅ Yes |
| 22 - Certification | 1 | Mixed |
| **TOTAL** | **839** | |

---

## Future Enhancements

### Auto-Population from S1
When client intake form is submitted:
1. `intake-client-first-name` → populates `client-name` in Cover
2. `intake-property-address` → populates `property-address` everywhere
3. etc.

### Hyperlink UI Component
Build a reusable component for "managed elsewhere" fields:
```tsx
<ManagedField 
  fieldId="client-name"
  managedIn="S1 - Client Intake"
  linkTo="/test-input?tab=client-intake"
/>
```

---

## Summary

| Concept | Implementation |
|---------|----------------|
| S-Tabs | Data entry consolidation |
| Numbered Tabs | Valcre workbook mirror |
| Managed Elsewhere | Read-only display + hyperlink |
| Single Source | Field stored once, displayed many |
| Workflow Separation | Client → Appraiser → Assets → Report |

**The beauty:** Appraisers see familiar report structure while getting clean, consolidated data entry. Best of both worlds.

---

*Created: 2025-12-23*
*Architecture by: Ben Crowe*
*Documented by: Claude (Extraction Agent)*
