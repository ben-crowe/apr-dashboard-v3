---
content_type: delta-artifact
title: V3 ↔ V4 Field & Dropdown Alignment Delta
purpose: Scopes V4-COMPLETION-PLAN priority #1 (V3-tab alignment). V3 app = source of truth; update V4's V3-origin tabs (client-intake + loe-prep) to match.
created: 2026-06-21
author: qa-agent
gate: builder re-confirms EACH row against live code during the alignment build (this is a scoping map, not the final word — fieldRegistry.ts line refs must be re-verified at build time)
---

# V3 ↔ V4 Field Alignment Delta

**Scope:** the V3-origin tabs in the V4 builder — **client-intake (S1)** + **loe-prep (S2)** — vs the **current V3 app**. V3 app is the source of truth (Ben). This scopes priority #1 of the completion plan: make V4's V3-tab field names + dropdowns match V3.

> **NOT a deploy blocker.** The deploy/key bug is CLOSED (separate). This is field-alignment only. The agent's "blocking deploy" tags below are re-framed as "alignment priority."

## The real deltas that need fixing (V4 ← V3)

### A. Dropdowns wrong or missing options
| Field | V3 app (truth) | V4 registry now | Fix |
|---|---|---|---|
| **report type** | Comprehensive, Summary, Restricted, Form, Letter | Appraisal Report, Restricted Appraisal, Desktop Appraisal | replace V4 options with the V3 list |
| **property type** | Agriculture, Building, Healthcare, Hotel, Industrial, Land, Manufactured Housing, Multifamily, Office, Retail, Self-Storage, Single-Family, Seniors, Special Purpose, Unknown, Other (16) | Multi-Family, Office, Retail, Industrial, Land, Special Purpose (6) | add the 10 missing options to match V3 |
| **property subtype** | Low-Rise, Mid-Rise, High-Rise, Garden, Walk-Up, Townhouse, Mixed-Use | Apartment, MURB, Condo, Townhouse, Mixed-Use, Student Housing, Senior Living | reconcile to V3 (confirm canonical list w/ Ben/Valcre) |
| **intended/authorized use** | dropdown: First Mortgage Financing, Financial Reporting, Insurance, Internal Decision-Making, Acquisition-Disposition, Estate Planning, Litigation, GST | **plain text field** (`authorized-use`) | convert V4 to a dropdown w/ the V3 options |
| **valuation premises** | dropdown: Market Value, Market Rent, Investment Value, Insurable Value, Liquidation Value | **plain text field** | convert V4 to a dropdown w/ the V3 options |
| **asset condition** | dropdown: Excellent, Very Good, Good, Fair, Poor | **plain text field** | convert V4 to a dropdown w/ the V3 options |
| **tenancy** | dropdown: Multi-Tenant, Owner Occupied, Partial Owner Occupied, Single-Tenant, Unkown[sic], Vacant | **field missing in V4** | add the field + options (keep the `Unkown` spelling — load-bearing for Valcre per the registry audit) |

### B. Fields in V3, missing in V4 client-intake
- `property city`, `property province`, `property postal` (V4 only has the client address parts split, not the property ones)
- `tenancy` (above)

### C. Label-only differences (cosmetic, align for consistency)
- Client "Company Name" (V3) vs "Organization" (V4)
- "Street Address" (V3, used for both client+property) vs "Client Address"/"Property Address" (V4)
- "Postal Code" (V3) vs "Client Postal Code" (V4)
- "Additional Information" (V3) vs "Notes" (V4)
- "First Name/Department" (V3 property contact) vs "Contact First Name" (V4)

### D. V4-only fields — NOT conflicts, leave alone
The V4 loe-prep section carries the full report-builder set (assignment details, scope, ~20 appraiser fields, report boilerplate, valuation-type/appraisal-status). These are V4 additions for the 79-page report, not V3-sync items. Don't touch them in the alignment pass.

## Build note
Every row above is a SCOPING claim from a code read — the alignment builder MUST re-confirm each against live `fieldRegistry.ts` (the agent's line refs may drift) and against the live V3 app before changing it. The 4-file-sync rule applies to any registry edit (fieldRegistry ↔ TestDataSet ↔ template ↔ EditPanel).

## Sources
- V3 intake: `src/components/submission-form/PropertyInformationSection.tsx` + `ClientInformationSection.tsx`
- V3 LOE: `src/components/dashboard/job-details/loe-quote/PaymentSection.tsx`
- V4 registry: `src/features/report-builder/schema/fieldRegistry.ts` (sections `client-intake` + `loe-prep`)
