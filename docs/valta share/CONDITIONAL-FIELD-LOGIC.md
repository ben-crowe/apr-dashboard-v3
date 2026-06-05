---
content_type: cascade-rules
title: Conditional Field Logic — Complete Reference (the cascade rule set)
status: active — authoritative cascade rules
owner: co-architect
home: 00-APR-MASTER-DASHBOARD.md
registry_v6: "https://apr-dashboard-v3.vercel.app/field-registry-v6.html (Rule Explorer — live source)"
tags: [apr-workflow, cascade, conditional-field-logic, cascade-to-loe, value-scenarios, property-rights, approaches-to-value, registry-v6]
keywords: [conditional field logic, cascade rules, predefined fields on option combo, status of improvements, value scenarios approaches, property rights tenancy override]
related: [../Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md]
---

# Conditional Field Logic — Complete Reference

> The authoritative plain-language cascade rule set (predefined fields that auto-fill on option
> combos). Live interactive version = the Valta Registry V6 Rule Explorer:
> https://apr-dashboard-v3.vercel.app/field-registry-v6.html · feeds the LOE per
> [CASCADE-TO-LOE-CONTRACT-NOTES.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CASCADE-TO-LOE-CONTRACT-NOTES.md).

---

## Group 1: Property Rights

Three triggers all point to the same result. Last one picked overrides the others.

```
TRIGGERS                              RESULT
─────────────────────────────         ─────────────────────────────
Property Type                    →    Property Rights
  Multifamily          = Fee Simple
  Self-Storage         = Fee Simple
  Land                 = Fee Simple
  Hotel                = Fee Simple
  Seniors              = Fee Simple
  Retail               = Leased Fee Interest
  Industrial           = Leased Fee Interest
  Office               = Leased Fee Interest

Property Subtype (override)      →    Property Rights
  Mixed Use            = Fee Simple & Leased Fee

Tenancy (override)               →    Property Rights
  Owner-Occupied       = Fee Simple
  Multi-Tenant         = Leased Fee Interest
  Partial Owner Occ.   = Leasehold Estate
  Single-Tenant        = Going Concern
  Unknown              = (no change)
  Vacant               = (no change)
```

**How override works:**
- Pick Property Type = Retail → Property Rights = Leased Fee Interest
- Then pick Tenancy = Owner-Occupied → Property Rights changes to Fee Simple
- Property Type dims out (overridden), Tenancy is now the active driver
- Last pick wins

---

## Group 2: Valuation Chain

Two triggers drive Value Scenarios, which then drives Approaches to Value.

```
TRIGGERS                              RESULT 1                 RESULT 2
─────────────────────────────         ─────────────────────    ─────────────────────
Status of Improvements           →    Value Scenarios      →   Approaches to Value

  Existing - Completed                  As Stabilized            Direct Comparison
                                                                 Income Approach

  Under Renovation                      As Is                    Direct Comparison
                                        As If Complete           Income Approach
                                                                 Cost Approach

  To Be Renovated                       As Is                    Direct Comparison
                                        As If Complete           Income Approach
                                                                 Cost Approach

  Vacant Land                           As Is Vacant Land        Land Direct Comparison
                                        As If Complete           Cost Approach

  Improved Land (Demolition)            As If Vacant             Land Direct Comparison
                                        As If Complete           Cost Approach

  Under Construction                    As If Vacant             Land Direct Comparison
                                        As If Complete           Cost Approach

Authorized Use (override)        →    Value Scenarios
  Insurance                             Insurable Replacement Cost
```

**How the chain works:**
- Pick Status of Improvements = Under Renovation
- Value Scenarios auto-sets to: As Is + As If Complete & Stabilized
- Approaches auto-sets to: Direct Comparison + Income + Cost Approach
- Three fields update from one pick

---

## Full Cascade Example

```
Step 1:  User picks Property Type = Retail
         → Property Rights = Leased Fee Interest (auto-set, dimmed)

Step 2:  User picks Tenancy = Owner-Occupied
         → Property Rights = Fee Simple (overridden, Property Type dimmed)

Step 3:  User picks Status of Improvements = Vacant Land
         → Value Scenarios = As Is Vacant Land + As If Complete & Stabilized
         → Approaches to Value = Land Direct Comparison + Cost Approach
```

---

## Summary

```
GROUP 1:
  Property Type ────────→ Property Rights
  Property Subtype ─────→ (override)
  Tenancy ──────────────→ (override)

GROUP 2:
  Status of Improvements ──→ Value Scenarios ──→ Approaches to Value
  Authorized Use ──────────→ (override)
```

6 rules. 5 trigger fields. 3 result fields. Everything else is a normal user-picked dropdown.

---

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

---

## Quick Reference

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

Last picked wins. C overrides B overrides A.

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
   Insurance → Insurable Replacement Cost
