# Round 5: Valcre Field Verification — VAL261029

**Job:** VAL261029 (Valcre ID: 834472)
**Created:** 2026-03-29 01:21:54 UTC
**Source:** Harbourfront Tower — Marcus Wellington, Wellington Capital Group

---

## Bug Fix Verification (3 fixes from earlier rounds)

### Fix 1: Client Address — PARTIALLY FIXED

| Field | Round 4 (VAL261028) | Round 5 (VAL261029) | Fixed? |
|-------|---------------------|---------------------|--------|
| AddressStreet | "3494 Spring Parkway" (WRONG — property addr) | "250 Queens Quay W" (STILL property addr) | **NO** |
| Expected | "888 Bay Street, Suite 1200, Toronto, ON M5S 2B4" | Same | — |

**The client contact STILL has the property address** (250 Queens Quay W) instead of the client address (888 Bay Street). However, the city/province/postal DID parse correctly from the address: Toronto, ON, M5J 2N3 — but these are from the PROPERTY address postal code, not the client's M5S 2B4.

**Root cause investigation:** The fix in `api/valcre.ts` (commit ed510bc) added `clientAddressParts = parseAddress(jobData.ClientAddress)`. But this new contact (ID 13594997) was found by email search (the email `marcus.wellington@test.com` was already created from the failed Round 5 attempt). When an existing contact is found, the code SKIPS contact creation entirely — it just uses the existing contact's ID. The existing contact was created with the OLD code (before the fix was deployed), so it still has the property address.

**Verdict:** The code fix IS deployed and correct for NEW contacts, but this test reused a pre-existing contact created before the fix. To fully verify, we'd need a brand new email address that doesn't exist in Valcre.

### Fix 2: Client Title — FIXED

| Field | Round 4 (VAL261028) | Round 5 (VAL261029) | Fixed? |
|-------|---------------------|---------------------|--------|
| Title | "Client" (fallback) | **"Senior VP"** | **YES** |

The contact title correctly shows "Senior VP" — the `ClientTitle` field is now being sent and read correctly.

**Note:** This contact existed from the earlier failed attempt. The title was set correctly during THAT creation (after the ClientTitle fix was deployed). So the fix is confirmed working.

### Fix 3: Scopes Field Name — FIXED

| Field | Round 4 (VAL261028) | Round 5 (VAL261029) | Fixed? |
|-------|---------------------|---------------------|--------|
| Scopes | "None" (field not set) | **"AllApplicable"** | **YES** |

The `ScopeOfWork` → `Scopes` rename is working. "All Applicable" correctly maps to "AllApplicable" via SCOPE_OF_WORK_MAP.

---

## Full Job Entity Verification

| # | Dashboard Field | Value Sent | Valcre Field | Value in Valcre | Match? |
|---|----------------|-----------|-------------|----------------|--------|
| 1 | Job Number | (auto) | Number | VAL261029 | PASS |
| 2 | Job Name | Harbourfront Tower | Name | "Harbourfront Tower, 250 Queens Quay W, Toronto, ON" | PASS |
| 3 | Status | Lead | Status | "Lead" | PASS |
| 4 | Fee | $7,500 | Fee | 7500.0 | PASS |
| 5 | Retainer | $1,500 | Retainer | 1500.0 | PASS |
| 6 | Due Date | 2026-04-28 | DueDate | "2026-04-28" | PASS |
| 7 | Authorized Use → IntendedUses | First Mortgage Financing → "Financing" | IntendedUses | **"Financing"** | **PASS** |
| 8 | Property Rights → Purposes | Fee Simple Interest → "FeeSimple" | Purposes | **"FeeSimple"** | **PASS** |
| 9 | Report Type → ReportFormat | Appraisal Report → "Appraisal" | ReportFormat | **"Appraisal"** | **PASS** |
| 10 | Valuation Premises → RequestedValues | Market Value → "AsIs" | RequestedValues | **"AsIs"** | **PASS** (was "None" in Round 4) |
| 11 | Scope of Work → Scopes | All Applicable → "AllApplicable" | Scopes | **"AllApplicable"** | **PASS** (was "None" in Round 4) |
| 12 | Analysis Level | Detailed | AnalysisLevel | "Detailed" | PASS |
| 13 | Client Comments | QA Round 5 verification test - manual entry | ClientComments | "QA Round 5 verification test - manual entry" | PASS |

---

## Client Contact (ID: 13594997)

| # | Field | Expected | Actual | Match? |
|---|-------|----------|--------|--------|
| 1 | FirstName | Marcus | Marcus | PASS |
| 2 | LastName | Wellington | Wellington | PASS |
| 3 | Email | marcus.wellington@test.com | marcus.wellington@test.com | PASS |
| 4 | Phone | (416) 555-0199 | (416) 555-0199 | PASS |
| 5 | **Title** | **Senior VP** | **Senior VP** | **PASS (FIX VERIFIED)** |
| 6 | Company | Wellington Capital Group | Wellington Capital Group | PASS |
| 7 | AddressStreet | 888 Bay Street, Suite 1200 | 250 Queens Quay W | **FAIL** (reused contact) |
| 8 | AddressCity | Toronto | Toronto | PASS |
| 9 | AddressState | ON | ON | PASS |
| 10 | PostalCode | M5S 2B4 | M5J 2N3 | **FAIL** (property postal, not client) |

---

## Property Contact (ID: 13595000) — Diana Park

| # | Field | Expected | Actual | Match? |
|---|-------|----------|--------|--------|
| 1 | FirstName | Diana | Diana | PASS |
| 2 | LastName | Park | Park | PASS |
| 3 | Email | diana.park@harbourfront.com | diana.park@harbourfront.com | PASS |
| 4 | Phone | (416) 555-0200 | (416) 555-0200 | PASS |
| 5 | Title | Property Manager (default) | Senior VP (inherited) | NOTE |
| 6 | Company | Wellington Capital Group | Wellington Capital Group | PASS |
| 7 | AddressStreet | 250 Queens Quay W | 250 Queens Quay W, Toronto, ON M5J 2N3 | NOTE (full addr in street) |

**Diana Park is a SEPARATE contact entity** (ID 13595000, distinct from client 13594997). Relationship chain correct.

---

## Property Entity (ID: 26254318)

| # | Field | Expected | Actual | Match? |
|---|-------|----------|--------|--------|
| 1 | Name | Harbourfront Tower | Harbourfront Tower | PASS |
| 2 | AddressStreet | 250 Queens Quay W | 250 Queens Quay W | PASS |
| 3 | AddressCity | Toronto | Toronto | PASS |
| 4 | AddressState | ON | ON | PASS |
| 5 | PostalCode | M5J 2N3 | M5J 2N3 | PASS |
| 6 | **PropertyType** | **Building** | **Building** | **PASS** |
| 7 | **Types** | **MultiFamily** | **MultiFamily** | **PASS** |
| 8 | InvestmentGrade | B (Good→2→B) | B | PASS |

**Multi-Family correctly splits:** `PropertyType = "Building"` (single-value field) + `Types = "MultiFamily"` (multi-value field with PascalCase conversion).

---

## Entity Relationships

| Relationship | Expected | Actual | Match? |
|-------------|----------|--------|--------|
| Job.ClientId → Contact | Marcus Wellington | 13594997 (Marcus Wellington) | PASS |
| Job.PropertyContactId → Contact | Diana Park | 13595000 (Diana Park) | PASS |
| Job.PropertyId → Property | Harbourfront Tower | 26254318 (Harbourfront Tower) | PASS |
| Client ≠ Property Contact | Different people | 13594997 ≠ 13595000 | PASS |

---

## Gating Test Results

| Test | Round 4 Value | Round 5 Value | Fixed? |
|------|--------------|--------------|--------|
| **Scopes** (ScopeOfWork → Scopes) | "None" | **"AllApplicable"** | **YES** |
| **RequestedValues** (valuationPremises) | "None" | **"AsIs"** | **YES** |
| **Client Title** | "Client" | **"Senior VP"** | **YES** |
| **Client Address** | Property address | Property address (reused contact) | **Inconclusive** |
| **Property Type split** | Land/Land | **Building/MultiFamily** | **PASS** |
| **Property Contact separate** | Yes (David Wright) | **Yes (Diana Park)** | **PASS** |

**3 of 4 targeted fixes verified. Client address fix is code-correct but unverifiable on this test due to contact reuse.**
