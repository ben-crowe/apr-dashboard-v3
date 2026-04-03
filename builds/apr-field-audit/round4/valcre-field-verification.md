# Round 4: Valcre Field Verification (API GET — Read-Only)

**Job:** VAL261028 (Valcre ID: 834469)
**Created:** 2026-03-28 at 23:02:54 UTC
**Method:** Direct Valcre API GET requests (no modifications)

---

## Job Entity Fields

| # | Dashboard Field | Value We Sent | Valcre Field | Value in Valcre | Match? |
|---|----------------|--------------|-------------|----------------|--------|
| 1 | Job Number | (auto) | Number | VAL261028 | PASS |
| 2 | Job Name | Southlands Plaza, 3494 Spring Parkway | Name | "Southlands Plaza, 3494 Spring Parkway, Calgary, AB" | PASS (enhanced with city/province) |
| 3 | Status | Lead | Status | "Lead" | PASS |
| 4 | Fee | $3,500 | Fee | 3500.0 | PASS |
| 5 | Retainer | $350 | Retainer | 350.0 | PASS |
| 6 | Due Date | 2026-04-11 | DueDate | "2026-04-11" | PASS |
| 7 | Bid Date | (auto) | BidDate | "2026-03-28" | PASS (creation date) |
| 8 | Intended Use → IntendedUses | Financing/Refinancing → "Financing" | IntendedUses | **"Financing"** | PASS |
| 9 | Property Rights → Purposes | Partial Interest → "PartialInterest" | Purposes | **"PartialInterest"** | PASS |
| 10 | Report Type → ReportFormat | (empty — not sent) | ReportFormat | **"Appraisal"** | **UNEXPECTED** — value exists despite not being sent |
| 11 | Valuation Premises → RequestedValues | Liquidation Value → "Liquidation" | RequestedValues | **"None"** | **FAIL** — should be "Liquidation" |
| 12 | Scope of Work → ScopeOfWork | All Applicable → "AllApplicable" | Scopes | **"None"** | **FAIL** — should be "AllApplicable" |
| 13 | Analysis Level | Comprehensive → "Detailed" | AnalysisLevel | "Detailed" | PASS |
| 14 | Client Comments | Test submission generated at 4:33:33 PM | ClientComments | "Test submission generated at 4:33:33 PM" | PASS |
| 15 | Delivery Comments | (empty) | DeliveryComments | "" | PASS |
| 16 | Payment Comments | (empty) | PaymentComments | "" | PASS |
| 17 | Internal Comments | (empty) | Comments | "" | PASS |
| 18 | Owner | Chris (7095) | OwnerId | 7095 | PASS |
| 19 | Client ID | (auto) | ClientId | 13594994 | PASS (Sarah Wilson) |
| 20 | Property Contact ID | (auto) | PropertyContactId | 13594995 | PASS (David Wright) |
| 21 | Property ID | (auto) | PropertyId | 26254290 | PASS |

### CRITICAL FAILURES

**RequestedValues = "None"** — We sent `valuationPremises: "Liquidation Value"` which should map via REQUESTED_VALUES_MAP to `"Liquidation"`. But Valcre stored "None". This means either:
- The server-side code didn't include RequestedValues in the job creation payload (it may only be in the UPDATE path, not the CREATE path)
- Or the Valcre API rejected the value silently

**Scopes = "None"** — We sent `scopeOfWork: "All Applicable"` which should map via SCOPE_OF_WORK_MAP to `"AllApplicable"`. But Valcre stored "None". Same root cause — the enum mapping may only apply to PATCH (update) operations, not POST (creation).

**ReportFormat = "Appraisal"** — Report Type was empty in the dashboard, yet Valcre has "Appraisal". This is likely the Valcre default value for new jobs.

---

## Client Contact (ID: 13594994)

| # | Dashboard Field | Value We Sent | Valcre Field | Value in Valcre | Match? |
|---|----------------|--------------|-------------|----------------|--------|
| 1 | First Name | Sarah | FirstName | "Sarah" | PASS |
| 2 | Last Name | Wilson | LastName | "Wilson" | PASS |
| 3 | Email | sarah.wilson.213072@test.com | Email | "sarah.wilson.213072@test.com" | PASS |
| 4 | Phone | (587) 665-7269 | PhoneNumber | "(587) 665-7269" | PASS |
| 5 | Title | Director | Title | **"Client"** | **MISMATCH** — sent "Director" but stored "Client" |
| 6 | Organization | Quantum Holdings | Company | "Quantum Holdings" | PASS |
| 7 | Address | 2399 Pine Place, Calgary... | AddressStreet | **"3494 Spring Parkway"** | **MISMATCH** — got property address, not client address |
| 8 | City | Calgary | AddressCity | "Calgary" | PASS |
| 9 | Province | AB | AddressState | "AB" | PASS |
| 10 | Postal Code | T2X 1Y6 | AddressPostalCode | **""** | **MISMATCH** — postal code lost |

### Contact Issues

1. **Title = "Client" instead of "Director"** — The code at `api/valcre.ts` line 575 sets `Title: jobData.ClientTitle || "Client"`. The client-side code sends `ClientTitle` but the property name on `jobData` is different. The fallback "Client" was used.

2. **AddressStreet = property address** — The contact got the PROPERTY address (3494 Spring Parkway) instead of the CLIENT address (2399 Pine Place). The `addressParts` are parsed from `jobData.PropertyAddress`, not the client address. This is a **mapping bug**.

3. **PostalCode = empty** — The address "3494 Spring Parkway" has no postal code in it (the full address would be "3494 Spring Parkway, Calgary, AB" but the postal code from the original client address wasn't forwarded).

---

## Property Contact (ID: 13594995)

| # | Dashboard Field | Value We Sent | Valcre Field | Value in Valcre | Match? |
|---|----------------|--------------|-------------|----------------|--------|
| 1 | First Name | David | FirstName | "David" | PASS |
| 2 | Last Name | Wright | LastName | "Wright" | PASS |
| 3 | Email | david.wright.213073@test.com | Email | "david.wright.213073@test.com" | PASS |
| 4 | Phone | (403) 380-2644 | PhoneNumber | "(403) 380-2644" | PASS |
| 5 | Title | (not sent) | Title | **"Director"** | NOTE — got client's title "Director" not "Property Manager" |
| 6 | Company | Quantum Holdings | Company | "Quantum Holdings" | PASS |
| 7 | Address | 3494 Spring Parkway | AddressStreet | "3494 Spring Parkway" | PASS |

### Property Contact Issue

**Title = "Director"** — The code at `valcre.ts` line 331 sets property contact Title to `formData.clientTitle || 'Property Manager'`. The client's title "Director" was passed through instead of defaulting to "Property Manager". This is correct behavior per the code, but semantically wrong — the property contact should have their own title, not the client's.

---

## Property Entity (ID: 26254290)

| # | Dashboard Field | Value We Sent | Valcre Field | Value in Valcre | Match? |
|---|----------------|--------------|-------------|----------------|--------|
| 1 | Property Name | Southlands Plaza | Name | "Southlands Plaza" | PASS |
| 2 | Address | 3494 Spring Parkway | AddressStreet | "3494 Spring Parkway" | PASS |
| 3 | City | Calgary (parsed) | AddressCity | "Calgary" | PASS |
| 4 | Province | AB (parsed) | AddressState | "AB" | PASS |
| 5 | Property Type | Land | PropertyType | "Land" | PASS |
| 6 | Types | Land | Types | "Land" | PASS |
| 7 | Asset Condition → InvestmentGrade | Good → "2" | InvestmentGrade | **"B"** | **NOTE** — Sent "2", stored as "B" (Valcre converts internally) |
| 8 | Buildings Count | 1 (default) | BuildingsCount | 1 | PASS |
| 9 | Parking | 0 | ParkingSpacesCount | null | PASS (0 → null) |
| 10 | SizeSF | 0 | SizeSF | null | PASS (0 → null) |
| 11 | Zoning | (empty) | Zoning | null | PASS |
| 12 | Flood Zone | (empty) | SiteFloodZone | null | PASS |
| 13 | Utilities | (empty) | Utilities | null | PASS |
| 14 | Year Built | (empty) | (not in response) | — | N/A (YearBuilt not returned by API) |

### Property Notes

- InvestmentGrade: We sent the string "2" (mapped from "Good" via gradeMap). Valcre stored it as "B" — they use letter grades internally (A=1, B=2, C=3, D=4). The mapping is correct.
- PostalCode is empty — same issue as contact, the short address "3494 Spring Parkway" has no postal code component.

---

## Entity Relationship Chain

| Relationship | Expected | Actual | Match? |
|-------------|----------|--------|--------|
| Job.ClientId → Contact | Sarah Wilson (client) | 13594994 (Sarah Wilson) | PASS |
| Job.PropertyContactId → Contact | David Wright (property) | 13594995 (David Wright) | PASS |
| Job.PropertyId → Property | Southlands Plaza | 26254290 (Southlands Plaza) | PASS |
| Client ≠ Property Contact | Different people | 13594994 ≠ 13594995 | PASS |
| Contact addresses | Client: 2399 Pine Place / Property: 3494 Spring Parkway | **BOTH have 3494 Spring Parkway** | **FAIL** — client contact has property address |

**The entity chain is correctly linked (Job → Client, Property Contact, Property).** But the CLIENT CONTACT has the wrong address (got property address instead of client address).

---

## Summary of Failures

| # | Field | Expected | Actual | Severity |
|---|-------|----------|--------|----------|
| 1 | **RequestedValues** | "Liquidation" | "None" | HIGH — Valuation Premises not reaching Valcre on job creation |
| 2 | **Scopes (ScopeOfWork)** | "AllApplicable" | "None" | HIGH — Scope of Work not reaching Valcre on job creation |
| 3 | **Client Contact.AddressStreet** | "2399 Pine Place..." (client addr) | "3494 Spring Parkway" (property addr) | HIGH — client gets property address |
| 4 | **Client Contact.Title** | "Director" | "Client" | MEDIUM — title fallback used |
| 5 | **Client Contact.PostalCode** | "T2X 1Y6" | "" | MEDIUM — postal code lost in parsing |
| 6 | **Property Contact.Title** | "Property Manager" | "Director" | LOW — inherits client title |
| 7 | **ReportFormat** | (empty/none) | "Appraisal" | INFO — Valcre default value |
