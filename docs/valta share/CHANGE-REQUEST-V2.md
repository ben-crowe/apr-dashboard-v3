# Valta Master Field Registry — V2 Change Request

**Date:** 2026-04-01
**Source:** Client shared folder (3 files)
**Prepared by:** apr-domain-agent

---

## Files Received

| File | What It Is | Action |
|------|-----------|--------|
| `Valta-Master-Field-Registry-v2.xlsx` | Updated business spec (renamed from v1) | Use as new source of truth |
| `Valcre Field Registry.xlsx` | Standard Valcre API field reference (344 fields) | Archive — we already have this covered |
| `LOE Template.docx` | LOE template changes from client | Review separately |

## Version Comparison

| | V1 (Valta Field Reg-cc.xlsx) | V2 (Valta-Master-Field-Registry-v2.xlsx) |
|---|---|---|
| Total fields | 37 | 39 |
| Columns | 23 | 24 (added Valcre Field Key API) |
| Dropdown lists | 23 rows, 44 cols | 24 rows, 45 cols (added ListClientDocuments) |

---

## 4 New Fields

### 1. AmountPaid
- **Label:** Amount Paid
- **Type:** Decimal
- **Source:** Logic (calculated)
- **Valcre mapping:** `Job.AmountPaid` (native Valcre field — already exists in API)
- **Location:** Job record
- **New field?** No — exists in Valcre, just not wired in our dashboard
- **Dashboard placement:** LOE/Payment section alongside Fee and Retainer

### 2. PaidDate
- **Label:** Paid Date
- **Type:** Date
- **Source:** Logic (auto-set when payment confirmed)
- **Valcre mapping:** `Job.PaidDate` (native Valcre field)
- **Location:** Job record
- **New field?** No — exists in Valcre
- **Dashboard placement:** LOE/Payment section, auto-populated when AmountPaid matches Fee

### 3. DeliveryTime
- **Label:** Delivery Time
- **Type:** Whole Number
- **Source:** User Input
- **Valcre mapping:** Maps to `Job.PaidDate` in the spreadsheet (likely a mapping error — should be its own field or DeliveryDate-related)
- **Location:** Job record
- **New field?** No per spreadsheet
- **Dashboard placement:** LOE section near Delivery Date — likely represents business days until delivery
- **NEEDS CLARIFICATION:** The Valcre mapping shows PaidDate which doesn't make sense for DeliveryTime. Likely should map to a custom field or be dashboard-only.

### 4. ClientDocuments
- **Label:** Client Documents
- **Type:** Multi-select dropdown
- **Source:** Logic
- **New field?** YES — this is genuinely new
- **Required:** Yes
- **Dropdown options (11):**
  - Previous Appraisal
  - Property Details
  - Proforma
  - Unit Mix
  - Rent Roll
  - Historical Operating Expenses
  - Development Permit Drawings
  - Contact for Property Tour
  - Purchase & Sale Agreement
  - Environmental Reports
  - Property Condition Reports
- **Dashboard placement:** New section in job detail — checklist of documents received from client. This is the Document Hub concept from the Platform Strategy.
- **Valcre mapping:** No native Valcre field — would need custom field (same pattern as VALTA fields) or dashboard-only tracking

---

## 2 Removed Fields (EA, HC)

| V1 Field | V1 Type | Status in V2 |
|----------|---------|-------------|
| EA (Extraordinary Assumptions) | Multi-line text, Logic | Removed from registry |
| HC (Hypothetical Conditions) | Multi-line text, Logic | Removed from registry |

**Note:** These may have been moved to the Narrative Library sheet (EA-001, EA-002 entries exist there) rather than being field registry entries. The logic for these is template-driven, not field-driven.

---

## Implementation Assessment

### Easy (native Valcre fields, just wire them):
- **AmountPaid** — Add to dashboard LOE section, map to `Job.AmountPaid`
- **PaidDate** — Add to dashboard, map to `Job.PaidDate`, auto-set logic

### Medium (needs design decision):
- **DeliveryTime** — Clarify: business days? Maps to what in Valcre? Dashboard-only or synced?

### Larger (new feature):
- **ClientDocuments** — Multi-select checklist, 11 document types. This is the start of the Document Hub. Options:
  1. Custom field in Valcre (like VALTA fields pattern)
  2. Dashboard-only with Supabase storage
  3. Full Document Hub integration per Platform Strategy

### No action needed:
- **EA/HC removal** — These are handled via Narrative Library, not field registry

---

## Approved Implementation: Payment Tracking (2 pairs)

Per Ben's direction, implement as two grouped payment milestones:

| Field | Label | Type | Supabase | Valcre Mapping |
|-------|-------|------|----------|---------------|
| `retainer_paid_date` | Retainer Paid | Date | `job_loe_details` or `job_submissions` | No mapping (dashboard only) |
| `retainer_amount` | Retainer Amount | Currency | Already exists | `Job.Retainer` (existing) |
| `payment_paid_date` | Payment Paid | Date | New column | `Job.PaidDate` |
| `payment_amount` | Payment Amount | Currency | New column | `Job.AmountPaid` |

**Dashboard placement:** Grouped pair in LOE/Payment section. Two line items side by side — retainer pair + final payment pair.

**Logic:** Retainer paid date is manual or future payment trigger. Payment paid date auto-sets or manual. Eventually connected to online payment integration.

---

## Remaining Items (Need Ben's Input)

- **DeliveryTime** — Business days to delivery? Clarify mapping.
- **ClientDocuments** — Multi-select checklist (11 doc types). Start of Document Hub. Scope TBD.
- **LOE Template.docx** — Client sent updated LOE template. Review separately.

---

## File Metadata

### Valta-Master-Field-Registry-v2.xlsx
- **Renamed from:** `Valta Master Field Registry (1).xlsx` (client's original filename)
- **Previous version:** `~/Development/APR-Dashboard-v3/Valta Field Reg-cc.xlsx` (now v1)
- **Changes from v1:**
  - ADDED: AmountPaid (Decimal, Logic, Job.AmountPaid)
  - ADDED: PaidDate (Date, Logic, Job.PaidDate)
  - ADDED: DeliveryTime (Whole Number, User Input — Valcre mapping unclear)
  - ADDED: ClientDocuments (Multi-select, 11 options, NEW field, Required)
  - ADDED: Column 24 — "Valcre Field Key (API)"
  - ADDED: Dropdown column ListClientDocuments (11 options)
  - REMOVED: EA (Extraordinary Assumptions) — moved to Narrative Library
  - REMOVED: HC (Hypothetical Conditions) — moved to Narrative Library

### Valcre Field Registry.xlsx
- Standard Valcre API reference (344 fields, 7 entities)
- We already have this covered in `1-API-FIELD-MAPPING-REFERENCE.md`
- Action: Archive

### LOE Template.docx
- Client's updated LOE template
- Review pending — separate task
