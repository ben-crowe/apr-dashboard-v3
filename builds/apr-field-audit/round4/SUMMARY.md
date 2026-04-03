# Round 4: Valcre Field Verification — Summary

**Date:** 2026-03-28
**Auditor:** QA Agent (dev-3.2)
**Method:** Valcre REST API (GET only) + Valcre Web UI (read-only login)
**Job:** VAL261028 (ID 834469) — Southlands Plaza, 3494 Spring Parkway

---

## 1. API Verification Results

### Job Entity — 21 fields checked

| Result | Count |
|--------|-------|
| PASS | 16 |
| FAIL | 2 |
| UNEXPECTED | 1 |
| INFO | 2 |

**CRITICAL FAILURES:**
- **RequestedValues = "None"** — Dashboard sent "Liquidation Value" (should map to "Liquidation"). Valcre stored "None". The REQUESTED_VALUES_MAP conversion is NOT applied during job creation, only during updates.
- **Scopes = "None"** — Dashboard sent "All Applicable" (should map to "AllApplicable"). Valcre stored "None". Same root cause — SCOPE_OF_WORK_MAP not applied during creation.

**Root cause:** In `api/valcre.ts`, the server-side handler has TWO paths:
1. **Update path** (lines 260-380): Maps `valuationPremises` → `RequestedValues` and `scopeOfWork` → `ScopeOfWork` using the conversion maps
2. **Creation path** (lines 726+): Creates the Property entity with mapped fields, but the Job entity creation does NOT include RequestedValues or ScopeOfWork in the payload

The enum fields (IntendedUses, Purposes) ARE set during creation because they're passed as camelCase fields that the update handler picks up. But RequestedValues and Scopes are only set in the update PATCH path.

### Contact Entity — 10 fields per contact

**Client Contact (Sarah Wilson, ID 13594994):**
- 7/10 PASS
- **3 MISMATCHES:**
  - AddressStreet = property address (3494 Spring Parkway) instead of client address (2399 Pine Place). **Bug:** `parseAddress()` parses from `jobData.PropertyAddress`, not client address.
  - Title = "Client" (fallback) instead of "Director" (actual). **Bug:** `jobData.ClientTitle` naming mismatch.
  - PostalCode = "" (lost in address parsing).

**Property Contact (David Wright, ID 13594995):**
- 7/7 checked PASS
- Title = "Director" (inherited from client title field — semantically odd but code-correct)

### Property Entity — 14 fields checked

- 12/14 PASS
- InvestmentGrade: Sent "2", stored as "B" — Valcre internal letter-grade conversion (correct behavior)
- PropertyType = "Land" — confirmed both via API and Web UI

---

## 2. Entity Relationship Chain

```
Job (VAL261028, ID 834469)
  ├── ClientId: 13594994 → Sarah Wilson (Quantum Holdings) ✓
  ├── PropertyContactId: 13594995 → David Wright (Quantum Holdings) ✓
  └── PropertyId: 26254290 → Southlands Plaza ✓
```

**All three relationships correctly linked.** Client and Property Contact are separate entities (different IDs, different people). Property is correctly associated.

**Issue:** Client contact has the property address, not the client's actual address.

---

## 3. Fields Sent But Didn't Land

| Field | Sent Value | Expected Valcre Value | Actual | Why |
|-------|-----------|----------------------|--------|-----|
| Valuation Premises | Liquidation Value | RequestedValues = "Liquidation" | "None" | Not included in job creation payload |
| Scope of Work | All Applicable | Scopes = "AllApplicable" | "None" | Not included in job creation payload |
| Client Title | Director | Contact.Title = "Director" | "Client" | Field name mismatch (ClientTitle vs jobData key) |
| Client Address | 2399 Pine Place... | Contact.AddressStreet | "3494 Spring Parkway" | parseAddress uses PropertyAddress |
| Postal Code | T2X 1Y6 | Contact.AddressPostalCode | "" | Short address has no postal code |

---

## 4. Valcre Fields That Are Empty But Shouldn't Be

| Valcre Field | Expected | Actual | Fix Priority |
|-------------|----------|--------|-------------|
| RequestedValues | "Liquidation" | "None" | **HIGH** — add to job creation payload |
| Scopes | "AllApplicable" | "None" | **HIGH** — add to job creation payload |
| Contact.AddressPostalCode | "T2X 1Y6" | "" | MEDIUM — parse from full address |
| Property.AddressPostalCode | "" | "" | MEDIUM — no postal in short address |

---

## 5. Web UI Screenshots

Successfully logged into Valcre web app (https://app.valcre.com) as chris.chornohos@valta.ca.

| Screenshot | Content |
|-----------|---------|
| valcre-login.png | Auth0 login page |
| valcre-after-login.png | Dashboard with jobs list |
| valcre-my-leads.png | My Leads filter showing VAL261028 |
| valcre-job-overview.png | Job detail with annotated elements |
| valcre-job-detail-wide.png | Full job detail — General, Dates, Report, Staff |
| valcre-report-section.png | Report section showing Format, Auth Use, Scope, Purpose, Values |
| valcre-property-page.png | Property page — Southlands Plaza, type "Land", site details |

### Confirmed in Web UI

| Field | UI Label | UI Value |
|-------|----------|----------|
| Job Number | Job Number | VAL261028 |
| Job Name | Job Name | Southlands Plaza, 3494 Spring Parkway, Calgary, AB |
| Subject Property | Subject Property | Southlands Plaza, 3494 Spring Parkway, Calgary, AB |
| Property Contact | Property Contact | David Wright, Quantum Holdings |
| Authorized Client | Authorized Client | Sarah Wilson, Quantum Holdings |
| Fee | Fee | $3,500.00 |
| Retainer | Retainer | $350.00 |
| Format | Format | Appraisal Report |
| Authorized Use | Authorized Use | Financing |
| **Scope** | **Scope** | **(empty)** |
| Analysis Level | Analysis Level | Comprehensive |
| Purpose | Purpose | Partial Interest |
| **Values** | **Values** | **(empty)** |
| Client Comments | Client | Test submission generated at 4:33:33 PM |
| Property Type | Property Type (on property page) | Land |

---

## 6. Authorized Use Field — Did New Values Map Correctly?

**YES.** The IntendedUses mapping worked correctly:
- Dashboard: "Financing/Refinancing" → INTENDED_USES_MAP → "Financing"
- Valcre API: IntendedUses = "Financing"
- Valcre UI: Authorized Use = "Financing"

The Purposes mapping also worked:
- Dashboard: "Partial Interest" → PURPOSES_MAP → "PartialInterest"
- Valcre API: Purposes = "PartialInterest"
- Valcre UI: Purpose = "Partial Interest"

**The two that FAILED are RequestedValues and Scopes** — these are NOT in the job creation payload, only in the update path. This is the highest priority fix.

---

## Deliverables

| File | Content |
|------|---------|
| valcre-job-834469.json | Full job entity JSON |
| valcre-client-contact.json | Sarah Wilson contact |
| valcre-property-contact.json | David Wright contact |
| valcre-property.json | Southlands Plaza property |
| valcre-field-verification.md | Detailed field-by-field comparison |
| valcre-login.png | Valcre login page |
| valcre-after-login.png | Post-login dashboard |
| valcre-my-leads.png | Leads list with VAL261028 |
| valcre-job-overview.png | Job detail annotated |
| valcre-job-detail-wide.png | Full job detail wide view |
| valcre-report-section.png | Report section fields |
| valcre-property-page.png | Property detail page |
| SUMMARY.md | This file |
