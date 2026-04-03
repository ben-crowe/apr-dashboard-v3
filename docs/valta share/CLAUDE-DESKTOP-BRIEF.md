# Conditional Field Picker — Project Brief for Claude Desktop

## What This Is

An interactive HTML prototype showing how appraisal job fields cascade — when you pick one dropdown value, other fields auto-fill based on business rules. Built for Chris (client) to visualize his field registry logic.

## Files

- **Prototype:** `~/Development/APR-Dashboard-v3/builds/prototypes/conditional-field-picker.html`
- **Logic Reference:** `~/Development/APR-Dashboard-v3/docs/valta share/CONDITIONAL-FIELD-LOGIC.md`
- **Chris's Source Registry:** `~/Development/APR-Dashboard-v3/docs/valta share/Valta-field-v03.xlsx`

## How the Cascade Works

There are 2 groups of conditional logic across 19 dropdown fields. Only 9 fields have cascade rules — the other 10 are normal user-picked dropdowns.

### Group 1: Property Rights (3 triggers → 1 result)

Three fields can set Property Rights. Last one picked wins (override priority):

```
A  Property Type        ──┐
B  Property Subtype     ──┼──→  Property Rights
C  Tenancy              ──┘
```

**A  Property Type**
   Multifamily, Self-Storage, Land, Hotel, Seniors → Fee Simple
   Retail, Industrial, Office → Leased Fee Interest

**B  Property Subtype** (overrides A)
   Mixed Use → Fee Simple & Leased Fee

**C  Tenancy** (overrides A and B)
   Owner-Occupied → Fee Simple
   Multi-Tenant → Leased Fee Interest
   Partial Owner Occupied → Leasehold Estate
   Single-Tenant → Going Concern

### Group 2: Valuation Chain (2 triggers → 2 results, chained)

One trigger cascades through two result fields left to right:

```
D  Status of Improvements  ──┐
                              ├──→  Value Scenarios  ──→  Approaches to Value
E  Authorized Use          ──┘
```

**D  Status of Improvements**
   Existing - Completed → As Stabilized → Direct Comparison + Income
   Under Renovation → As Is + As If Complete → Direct Comparison + Income + Cost
   Vacant Land → As Is Vacant + As If Complete → Land Direct Comparison + Cost
   Under Construction → As If Vacant + As If Complete → Land Direct Comparison + Cost

**E  Authorized Use** (overrides D)
   Insurance → Insurable Replacement Cost → Cost Approach

## Dropdown Options (from Chris's Registry)

**Property Type (9):** Multifamily, Self-Storage, Retail, Industrial, Office, Land, Hotel, Seniors, Other

**Property Subtype (3):** Apartment, Townhouse, Mixed Use

**Tenancy (6):** Multi-Tenant, Owner Occupied, Partial Owner Occupied, Single-Tenant, Unknown, Vacant

**Interest Appraised / Property Rights (4):** Fee Simple, Leased Fee Interest, Leasehold Estate, Going Concern

**Authorized Use (8):** First Mortgage Financing, Financial Reporting, Insurance, Internal Decision-Making, Acquisition-Disposition, Estate Planning, Litigation, GST

**Status of Improvements (7):** Existing - Completed, Existing - Renovated, Existing - Under Renovation, Existing - To Be Renovated, Proposed - Vacant Land, Proposed - Improved Land (Demolition Required), Proposed - Under Construction

**Value Scenarios (10):** As Is Vacant Land, As If Vacant Land, As If Complete & Stabilized, As-Is, As Stabilized, As If Complete & Stabilized - Renovated, As If Complete - Rezoned, As If Complete - Serviced, As If Complete - Subdivided, Insurable Replacement Cost

**Approaches to Value (4):** Land Direct Comparison Approach, Cost Approach, Direct Comparison Approach, Income Approach

**Report Type (3):** Comprehensive, Concise, Form

**Assignment Type (2):** Single Property, Multiple Properties

**Value Timeframe (3):** Current, Prospective, Retrospective

**Transaction Status (3):** Not Applicable, Listed, Under Contract

**Land Metric (3):** Square Feet, Acres, Hectares

**Desktop Report (2):** Yes, No

**CMHC Financing (2):** Yes, No

**Client Documents (11):** Previous Appraisal, Property Details, Proforma, Unit Mix, Rent Roll, Historical Operating Expenses, Development Permit Drawings, Contact for Property Tour, Purchase & Sale Agreement, Environmental Reports, Property Condition Reports

## Prototype Features

- **Two views:** Full Dashboard (all fields in real app layout) and Logic Fields Only (just the 9 cascade fields)
- **Interactive cascade:** Pick a dropdown, watch dependent fields auto-fill
- **Override visual:** When Tenancy overrides Property Type, the overridden trigger should dim
- **Rule Explorer:** Bottom section shows all 6 rules with lettered sections (A-E), expandable details
- **Question marks (?):** On trigger fields — hover shows which result field it affects
- **Fill Test Data:** Button fills text inputs, leaves dropdowns empty for testing

## What Needs Work

- Override dimming (pick Tenancy → Property Type dims) not fully implemented
- Rule Explorer formatting: A/B/C as section headers with two-column table underneath (trigger options left, results right)
- All 24 rules verified against Chris's matrix (23/24 passed, 1 fixed)
- The prototype HTML is self-contained — open in any browser, no server needed (though currently served via python http.server)

## Key Principle

- **User Choice** fields say "Choose..." — the user picks
- **Auto-set** fields say "Set by [trigger]" — the system picks, but user can open the dropdown to see possible values
- Both look like normal dropdowns — the placeholder text is the only difference
