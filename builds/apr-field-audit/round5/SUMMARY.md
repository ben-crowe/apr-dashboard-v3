# Round 5: Verification Test — Summary

**Date:** 2026-03-28/29
**Auditor:** QA Agent (dev-3.2)
**Test Job:** Harbourfront Tower, 250 Queens Quay W, Toronto (Marcus Wellington, Wellington Capital Group)

---

## 1. Form Submission — All Fields Matched on Dashboard

**18/18 fields PASS.** Every manually-entered field appears correctly.

| Field | Submitted | Dashboard Shows | Match? |
|-------|----------|-----------------|--------|
| First Name | Marcus | Marcus | PASS |
| Last Name | Wellington | Wellington | PASS |
| Title | Senior VP | Senior VP | PASS |
| Organization | Wellington Capital Group | Wellington Capital Group | PASS |
| Address | 888 Bay Street, Suite 1200, Toronto, ON M5S 2B4 | 888 Bay Street, Suite 1200, Toronto, ON M5S 2B4 | PASS |
| Phone | (416) 555-0199 | (416) 555-0199 | PASS |
| Email | marcus.wellington@test.com | marcus.wellington@test.com | PASS |
| Property Name | Harbourfront Tower | Harbourfront Tower | PASS |
| Property Address | 250 Queens Quay W, Toronto, ON M5J 2N3 | 250 Queens Quay W, Toronto, ON M5J 2N3 | PASS |
| Property Type | Multi-Family | Multi-Family (chip) | PASS |
| Authorized Use | First Mortgage Financing | First Mortgage Financing | PASS |
| Valuation Premises | Market Value | Market Value | PASS |
| Asset Condition | Good | Good | PASS |
| Notes | QA Round 5 verification test - manual entry | QA Round 5 verification test - manual entry | PASS |
| Property Contact First | Diana | Diana | PASS |
| Property Contact Last | Park | Park | PASS |
| Property Contact Email | diana.park@harbourfront.com | diana.park@harbourfront.com | PASS |
| Property Contact Phone | (416) 555-0200 | (416) 555-0200 | PASS |

---

## 2. "Authorized Use" Label — Confirmed Renamed

**YES — the form label reads "Authorized Use" (not "Intended Use").** The dropdown options match the VALTA-FIELD-SPEC `ListAuthorizedUse`:
- First Mortgage Financing
- Financial Reporting
- Insurance
- Internal Decision-Making
- Acquisition-Disposition
- Estate Planning
- Litigation
- GST

---

## 3. Valcre Job Creation — BLOCKED

**Status: FAILED** — `ScopeOfWork` field name rejected by Valcre API.

**Error:** `"The property 'ScopeOfWork' does not exist on type 'Valcre.Web.App.Dal.DB.Entity.Model.Job'"`

**Root cause:** A recent commit (`2c805b1`) added `ScopeOfWork` to the job creation payload, but the correct Valcre API field name is `Scopes` (confirmed in Round 4 API verification).

**Fix applied:** Commit `e26cc96` — changed `ScopeOfWork` to `Scopes` in both creation and update paths.

**Fix NOT deployed yet:** The dev server proxies `/api` to the production Vercel deployment (`apr-dashboard-v3.vercel.app`). Local code changes to `api/valcre.ts` require a `git push` + Vercel auto-deploy to take effect. The fix is committed but not pushed.

**Architecture finding:** `vite.config.ts` line 11-14 proxies `/api` to production:
```js
proxy: {
  '/api': {
    target: 'https://apr-dashboard-v3.vercel.app',
    changeOrigin: true
  }
}
```

This means ALL local testing hits the PRODUCTION Vercel serverless function. Local `api/valcre.ts` changes are invisible until deployed.

---

## 4. The 3 Bug Fixes — Verification Status

### Fix 1: Client Address (commit ed510bc)
**Status: NOT YET VERIFIABLE** — Requires Valcre job creation to succeed first. The fix is in the serverless function code but can't be tested until deployed to Vercel. The code correctly uses `clientAddressParts` parsed from `jobData.ClientAddress` instead of `addressParts` from `jobData.PropertyAddress`.

### Fix 2: Client Title
**Status: NOT YET VERIFIABLE** — Same reason. `ClientTitle` is being sent from the client-side (confirmed in earlier commit), and the server reads `jobData.ClientTitle || "Client"`. Should work once deployed.

### Fix 3: Scope of Work field name (commit e26cc96)
**Status: FIX COMMITTED, NOT DEPLOYED** — Changed `ScopeOfWork` to `Scopes` in both creation and update paths. This is the blocking fix — once deployed, Valcre job creation will work again.

---

## 5. Additional Finding: Valuation Premises Data Architecture Gap

**The `canCreateValcreJob` gate checks `jobDetails.valuationPremises` from `job_loe_details` table.** But the form submission only writes to `job_submissions.valuation_premises`. These are different tables.

When a new job is submitted via the intake form and the appraiser opens it on the dashboard:
- The Property Information section shows Valuation Premises (from `job_submissions`) — appears filled
- But `jobDetails.valuationPremises` (from `job_loe_details`) is NULL
- The "Create Valcre Job" button stays disabled even though the value appears on screen

**Workaround used:** Manually patched `job_loe_details.valuation_premises` via Supabase REST API.

**Recommended fix:** When a `job_loe_details` row is created (on first job detail load), auto-populate `valuation_premises` from the corresponding `job_submissions.valuation_premises` value.

---

## 6. Deployment Required Before Valcre Verification

Two commits need to be deployed to Vercel:

| Commit | Fix | Status |
|--------|-----|--------|
| `ed510bc` | Client address uses client address instead of property address | Committed, not pushed |
| `e26cc96` | `ScopeOfWork` → `Scopes` (correct Valcre API field name) | Committed, not pushed |

After `git push` and Vercel auto-deploy, re-run Round 5 Step 4 to verify all 3 fixes against the live Valcre API.

---

## Deliverables

| File | Content |
|------|---------|
| step1-form-filled.png | Filled form before submit |
| step1-success-confirmed.png | Success page |
| step2-dashboard-detail.png | Harbourfront job on dashboard |
| step2-harbourfront-detail.png | Job detail view |
| step3-loe-filled.png | LOE fields manually filled |
| SUMMARY.md | This file |

---

## Next Steps

1. **Push to Vercel:** `git push origin main` (needs Ben's approval)
2. **Wait for deploy** (~2 min)
3. **Re-run Valcre creation** on the Harbourfront Tower job
4. **Verify via API** that Scopes, RequestedValues, Contact address, and Contact title all map correctly
