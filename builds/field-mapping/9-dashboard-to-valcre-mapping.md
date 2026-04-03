# Dashboard → Valcre Complete Field Mapping

> Every dashboard field mapped to its Valcre destination.
> Valcre has TWO main areas: **Job** (your screenshot) and **Property** (separate tab).
> Plus sub-entities: **Parcels**, **Expenses** (taxes).
> Status: MAPPED = wired in api/valcre.ts, NOT MAPPED = destination exists but not wired yet, NO DESTINATION = Valcre has no field for this.

---

## Section 1: Client Information & Property Details

### CLIENT INFORMATION → Valcre Job: General + Contact Entity

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| First Name | Daniel | Job → Contact | Contact.FirstName | MAPPED |
| Last Name | Westbrook | Job → Contact | Contact.LastName | MAPPED |
| Title | Managing Director | Job → Contact | Contact.Title | MAPPED |
| Organization | Westbrook Capital Group | Job → Contact | Contact.Company | MAPPED |
| Phone | (416) 555-0123 | Job → Contact | Contact.Phone | MAPPED |
| Email | daniel@westbrookcapital.ca | Job → Contact | Contact.Email | MAPPED |
| Address | 200 Queens Quay West Suite 2100... | Job → Contact | Contact.AddressStreet + City + State + PostalCode | MAPPED |

### PROPERTY INFORMATION → Valcre Job: General + Property Entity

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Property Name | Harbourfront Tower | Property entity | Property.Name | MAPPED |
| Property Type | Multi-Family | Property entity | Property.PropertyType + Property.Types | MAPPED |
| Property Address | 250 Queens Quay West... | Property entity | Property.AddressStreet + City + State + PostalCode | MAPPED |
| Authorized Use | First Mortgage Financing | Job tab: Report | Job.IntendedUses | MAPPED |
| Valuation Premises | Market Value | Job tab: Report | Job.RequestedValues | MAPPED |
| Asset Condition | Good | — | NO DESTINATION | Dashboard-only (Supabase) |

### PROPERTY CONTACT → Valcre Job: General (Property Contact field)

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Contact First Name | Marcus | Job → Contact | PropertyContact.FirstName | NOT MAPPED |
| Contact Last Name | Johnson | Job → Contact | PropertyContact.LastName | NOT MAPPED |
| Contact Email | property.manager@harbourfront.ca | Job → Contact | PropertyContact.Email | NOT MAPPED |
| Contact Phone | (416) 555-0456 | Job → Contact | PropertyContact.Phone | NOT MAPPED |

> Note: PropertyContactId is null on ALL of Chris's real jobs. His team doesn't use Property Contact in Valcre.

### CLIENT COMMENTS → Valcre Job: Comments

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Additional Info / Comments | Multi-family tower... | Job tab: Comments | Job.ClientComments | MAPPED |

---

## Section 2: LOE Quote & Valuation Details

### JOB DETAILS → Valcre Job: General + Report

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Job Number | VAL261030 | Job tab: General | Job.Number | MAPPED (auto) |
| Property Rights | Fee Simple Interest | Job tab: Report | Job.Purposes | MAPPED |
| Scope of Work | All Applicable | Job tab: Report | Job.Scopes | MAPPED |
| Payment Terms | On LOE Signature | — | NO DESTINATION | Dashboard + ClickUp only |
| Appraisal Fee | $7,500.00 | Job tab: General | Job.Fee | MAPPED |
| Report Type | Appraisal Report | Job tab: Report | Job.ReportFormat | MAPPED |
| Retainer Amount | $1,500.00 | Job tab: General | Job.Retainer | MAPPED |
| Delivery Date | 2026-04-30 | Job tab: Dates | Job.DueDate | MAPPED |

### COMMENTS → Valcre Job: Comments

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| General Comments | — | Job tab: Comments | Job.Comments | MAPPED |
| Delivery Comments | — | Job tab: Comments | Job.DeliveryComments | MAPPED |
| Payment Comments | — | Job tab: Comments | Job.PaymentComments | MAPPED |

---

## Section 3: Building Information & Client Documents

### BUILDING INFORMATION → Valcre Property Entity

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Year Built | 2018 | Property tab: General | Property.YearBuilt | NOT MAPPED |
| Building Size (SF) | 185,000 | Property tab: General | Property.SizeSF | NOT MAPPED |
| Number of Units | 380 | Property tab: Unit Counts | Unit Counts table | NOT MAPPED |
| Parking Spaces | 425 | Property tab: General | Property.ParkingSpacesCount | NOT MAPPED |

### 13 VALTA FIELDS → Valcre Custom Fields (on Job)

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Tenancy | Multi-Tenant | Job tab: Custom Fields | CustomField 12042 | MAPPED |
| State of Improvements | Complete | Job tab: Custom Fields | CustomField 12043 | MAPPED |
| Status of Improvements | As Is | Job tab: Custom Fields | CustomField 12044 | MAPPED |
| Property Subtype | High-Rise | Job tab: Custom Fields | CustomField 12045 | MAPPED |
| Land Metric | Square Feet | Job tab: Custom Fields | CustomField 12046 | MAPPED |
| Environmental Assessment | Phase 1 - Clear | Job tab: Custom Fields | CustomField 12047 | MAPPED |
| Heritage / Conservation | None | Job tab: Custom Fields | CustomField 12048 | MAPPED |
| Assignment Type | Standard | Job tab: Custom Fields | CustomField 12049 | MAPPED |
| Desktop Report | false | Job tab: Custom Fields | CustomField 12050 | MAPPED |
| Value Timeframe | Prospective | Job tab: Custom Fields | CustomField 12051 | MAPPED |
| Approaches to Value | Direct Comparison | Job tab: Custom Fields | CustomField 12052 | MAPPED |
| Transaction Status | Arms Length | Job tab: Custom Fields | CustomField 12053 | MAPPED |
| Zoning Status | Legal Conforming | Job tab: Custom Fields | CustomField 12054 | MAPPED |

### LEGAL DESCRIPTION → Valcre Parcels Sub-Entity

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Legal Description | Plan 123; Lot 45 | Property → Parcels | Parcel.LegalDescription | NOT MAPPED |

---

## Section 4: Data Gathering — Property Research

### PROPERTY SITE → Valcre Property Entity

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Zoning | C-5 Commercial | Property tab: Site | Property.Zoning | NOT MAPPED |
| Zone Code | MU-2 | Property tab: Site | Property.ZoningName | NOT MAPPED |
| Land Use | Mixed-Use Residential | Property tab: Site | Property.ProposedLandUse | NOT MAPPED |
| Flood Zone | Zone X (minimal) | Property tab: Site | Property.SiteFloodZone | NOT MAPPED |
| Utilities | Full municipal | Property tab: Site | Property.Utilities | NOT MAPPED |

### PARCELS SUMMARY → Valcre Parcels Sub-Entity

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Parcel Number | 067098897 | Property → Parcels | Parcel.Number | NOT MAPPED |
| Usable Land (SF) | 31,220 | Property → Parcels | Parcel.PrimaryArea | NOT MAPPED |
| Usable Land (Acres) | 0.717 | — | Calculated from SF | NOT MAPPED |
| Gross Land (SF) | 35,400 | Property → Parcels | Parcel.PrimaryArea + ExcessArea | NOT MAPPED |
| Gross Land (Acres) | 0.813 | — | Calculated from SF | NOT MAPPED |

### ASSESSMENTS & TAXES → Valcre Expenses Sub-Entity

| Dashboard Field | Value | Valcre Location | Valcre Field | Status |
|----------------|-------|----------------|-------------|--------|
| Assessment Year | 2025 | Property → Expenses | Expense.Year | NOT MAPPED |
| Land Assessment | $4,200,000 | Property tab: Custom Fields or Expenses | Needs verification | NOT MAPPED |
| Improved Assessment | $18,500,000 | Property tab: Custom Fields or Expenses | Needs verification | NOT MAPPED |
| Total Assessment | $22,700,000 | Property tab: Custom Fields or Expenses | Needs verification | NOT MAPPED |
| Annual Taxes | $285,000 | Property → Expenses | Expense.Taxes | NOT MAPPED |
| Tax Rate | 1.255% | Property tab: Custom Fields | Needs verification | NOT MAPPED |

---

## Mapping Summary

| Category | Total Fields | MAPPED | NOT MAPPED | NO DESTINATION |
|----------|-------------|--------|-----------|----------------|
| Client Information (7) | 7 | 7 | 0 | 0 |
| Property Information (6) | 6 | 5 | 0 | 1 (Asset Condition) |
| Property Contact (4) | 4 | 0 | 4 | 0 |
| Client Comments (1) | 1 | 1 | 0 | 0 |
| LOE / Job Details (8) | 8 | 7 | 0 | 1 (Payment Terms) |
| Comments (3) | 3 | 3 | 0 | 0 |
| Building Info (4) | 4 | 0 | 4 | 0 |
| 13 VALTA Custom Fields | 13 | 13 | 0 | 0 |
| Legal Description (1) | 1 | 0 | 1 | 0 |
| Property Site (5) | 5 | 0 | 5 | 0 |
| Parcels Summary (5) | 5 | 0 | 4 | 1 (Acres = calculated) |
| Assessments & Taxes (6) | 6 | 0 | 6 | 0 |
| **TOTAL** | **68** | **36** | **30** | **2** |

---

## Valcre Destinations by Tab

### Job Tab (your screenshot)
- General: Job Number, Name, Property, Address, Contact, Client, Fee, Retainer, Status
- Dates: Bid Date, Delivery Date, + 6 empty
- Report: Format, Authorized Use, Scope, Purposes, RequestedValues
- Staff: 4 empty
- Permissions: Confidential
- Comments: General, Delivery, Payment, Client
- Custom Fields: 11 existing + 13 VALTA

### Property Tab (separate page in Valcre)
- Property details: Name, Address, Type, SizeSF, ParkingSpacesCount, BuildingsCount
- Site details: Zoning, ZoningName, SiteFloodZone, Utilities, ProposedLandUse
- Parcels (sub-entity): Number, LegalDescription, PrimaryArea, ExcessArea
- Expenses (sub-entity): Year, Taxes, + income/expense fields

---

## Next Steps

| Priority | Action | Fields |
|----------|--------|--------|
| 1 | Wire Building Info to Property entity | Building Size, Units, Parking (3 fields) |
| 2 | Wire Property Site to Property entity | Zoning, Zone Code, Land Use, Flood Zone, Utilities (5 fields) |
| 3 | Wire Parcels to Parcel sub-entity | Parcel Number, Legal Description, Land Areas (4 fields) |
| 4 | Wire Taxes to Expense sub-entity | Assessment Year, Annual Taxes (2 fields) |
| 5 | Verify Assessment fields | Land/Improved/Total Assessment, Tax Rate — check Property Custom Fields or Expenses (4 fields) |
| 6 | Wire Property Contact | First, Last, Email, Phone (4 fields — low priority, Chris doesn't use it) |

*30 fields need mapping — all have destinations in Valcre (Property tab, Parcels, Expenses). Only 2 fields have no clear native destination (Asset Condition, Payment Terms — dashboard-only). 36 fields already mapped and working.*
