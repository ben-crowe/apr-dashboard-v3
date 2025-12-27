Here's the complete consolidated issues document:

---

# APR DASHBOARD - VALCRE MAPPING ISSUES & QUESTIONS

## Issue Index

1. [Report Type Field - Clarification Needed](#1-report-type-field---clarification-needed)
2. [Appraiser Comments Field - Not Mapping to Valcre](#2-appraiser-comments-field---not-mapping-to-valcre)
3. [LOE Email Preview - Error After Email Change](#3-loe-email-preview---error-after-email-change)
4. [Valuation Premises Not Mapping (CRITICAL)](#4-valuation-premises-not-mapping-critical)
5. [Valcre Field Mapping - Complete Structure Review](#5-valcre-field-mapping---complete-structure-review)

---

## 1. Report Type Field - Clarification Needed

**Question:** Is the client submission form intentionally designed to ONLY create "Appraisal Report" type jobs?

**Context:**
- Dashboard LOE section has "Report Type" dropdown with 10+ options (Amendment Letter, Broker Opinion of Value, Consultation, Desk Review, etc.)
- Client submission form does NOT have a "Report Type" field
- Client (Chris) has never mentioned this as a missing field

**Assumption:**
- Client form submissions = Always "Appraisal Report" jobs
- Other report types = Internal jobs or special requests handled outside public form workflow
- Report Type dropdown exists in dashboard/Valcre for edge cases only

**Action needed:**
- Confirm this assumption is correct
- If yes, hard-code "Appraisal Report" as default for client form submissions
- Document this design decision

---

## 2. Appraiser Comments Field - Not Mapping to Valcre

**Issue:** Appraiser Comments are not saving to Valcre and disappear from dashboard UI

**Steps to reproduce:**
1. Fill in Section 2 LOE fields
2. Add text in "Appraiser Comments" field (e.g., "Jane Williams assigned. Standard timeline - coordinate site visit")
3. Click "Create Valcre Job" button
4. Comments disappear from dashboard UI
5. Check Valcre Job → Comments → "General" field = Empty

**Current behavior:**
- Comments disappear from dashboard
- Comments do NOT save to Valcre at all
- Valcre "General" comments field remains empty

**Expected behavior:**
- Dashboard "Appraiser Comments" should map to Valcre Job → Comments → "General" field
- Comments should remain visible in dashboard after job creation

**Note:** Client comments ARE working correctly (Client form "Additional Information" → Dashboard "Client Comments" → Valcre "Client" comments field) ✅

---

## 3. LOE Email Preview - Error After Email Change

**Issue:** Error message appears after changing email in LOE eSignature Previewer

**Steps to reproduce:**
1. Fill in LOE section and click "Preview & Send LOE"
2. In the eSignature Previewer box, change the recipient email (for testing purposes)
3. Submit/Send the LOE

**Current behavior:**
- Redirects back to dashboard
- Shows error message (something about "send the client the link" or similar)
- Unclear if email was actually sent

**Questions:**
- What is the exact error message?
- Did the email actually send? (Check test inbox)
- Is this error only when email is changed, or always?
- Should changing the email be allowed in preview mode?

**Positive note:**
- ✅ Field mapping to multi-page DocuSeal appears to be working correctly
- ✅ All LOE fields are populating properly in the eSignature document

---

## 4. Valuation Premises Not Mapping (CRITICAL)

**Issue:** Client form "Valuation Premises" field is not mapping to Valcre Custom Fields

**Expected mapping:**
```
Client form "Valuation Premises" 
  ↓
Dashboard Section 1 "Valuation Premises"
  ↓
Valcre Custom Fields → "Valuation Premise - 1"
```

**Current status:**
- Field appears on client form ✅
- Field appears in dashboard Section 1 ✅
- Field does NOT map to Valcre Custom Fields ❌

**Client form dropdown options:**
- Market Value: As Is
- Market Value: As Is & As Stabilized
- Market Value: As Complete & As Stabilized
- Market Value: Land As Is & As Complete & As Stabilized
- Market Value: Land As Is
- Market Value: Land As Is & As Rezoned

**Valcre Custom Field "Valuation Premise - 1" options:**
- As Is
- As Stabilized
- As If Renovated & Stabilized
- As If Complete & Stabilized
- As Is Vacant Land
- As If Vacant Land
- As If Rezoned
- As If Serviced
- As If Subdivided

**This is critical** because it defines the appraisal scope and valuation scenario. Without this mapping, appraisers must manually enter this information in Valcre.

**Action needed:**
- Map client form "Valuation Premises" to Valcre Custom Field "Valuation Premise - 1"
- May need to adjust dropdown values to match Valcre's expected format (remove "Market Value:" prefix?)

---

## 5. Valcre Field Mapping - Complete Structure Review

**Context:** Full Valcre job field structure with all available options and current mapped values.

### ✅ CONFIRMED WORKING MAPPINGS

| Dashboard Field | Valcre Destination | Status |
|----------------|-------------------|---------|
| Delivery Date | Dates → Due Date | ✅ Working |
| Appraisal Fee | General → Fee | ✅ Working |
| Retainer Amount | General → Retainer | ✅ Working |
| Property Name + Address | General → Subject Property | ✅ Working |
| Property Contact | General → Property Contact | ✅ Working |
| Client Info | General → Authorized Client | ✅ Working |
| Report Type | Report → Format | ✅ Working |
| Intended Use | Report → Authorized Use | ✅ Working |
| Client Comments | Comments → Client | ✅ Working |

---

### ❓ UNKNOWN MAPPING STATUS (Need to Verify)

| Dashboard Field | Expected Valcre Destination | Current Status | Notes |
|----------------|---------------------------|----------------|-------|
| **Scope of Work** | Report → Scope | ❓ Unknown | Not visible in test screenshots - need to verify if mapping |
| **Property Rights** | Report → Purpose | ⚠️ May be mapping | Terminology might be mismatched - "Purpose" vs "Property Rights" |
| **Analysis Level** | Report → Analysis Level | ❓ Unknown | Shows "Comprehensive" in Valcre - where is this coming from? Hardcoded? |
| **Payment Terms** | ??? | ❓ Unknown | No clear Valcre destination identified |
| **Asset Condition** | ??? | ❓ Unknown | No clear Valcre destination identified |
| **Property Type** | General → Type (shows "Building") | ⚠️ May be mapping | Need to verify with different property types |

---

### 📋 COMPLETE VALCRE FIELD STRUCTURE

**General Section**

| Valcre Field | Dashboard Source | Status |
|--------------|------------------|--------|
| Job Number | Auto-generated by Valcre | ✅ Working |
| Job Name | Property Name? | ❓ Verify |
| Subject Property | Property Name + Address | ✅ Working |
| Property Contact | Property Contact fields | ✅ Working |
| Authorized Client | Client Info fields | ✅ Working |
| Client File Number | ??? | ❓ Need to map? |
| Borrower | ??? | ❓ Need to map? |
| Status | Manual appraiser selection | N/A |
| Fee | Appraisal Fee | ✅ Working |
| Retainer | Retainer Amount | ✅ Working |
| Amount Paid | Payment tracking | N/A (appraiser fills) |
| Check Number | Payment tracking | N/A (appraiser fills) |
| Appraised Value | Final value | N/A (appraiser fills) |

**Dates Section**

| Valcre Field | Dashboard Source | Status |
|--------------|------------------|--------|
| Bid Date | ??? | ❓ Need to map? |
| Awarded Date | ??? | ❓ Need to map? |
| Inspection Date | ??? | ❓ Need to map? |
| Date of Value | ??? | ❓ Need to map? |
| Internal Due Date | ??? | ❓ Need to map? |
| Due Date | Report Delivery Date | ✅ Working |
| Invoice Date | ??? | ❓ Need to map? |
| Paid Date | Payment tracking | N/A (appraiser fills) |

**Report Section**

| Valcre Field | Available Options | Dashboard Source | Status |
|--------------|------------------|------------------|--------|
| Format | • Amendment Letter<br>• Appraisal Report<br>• Broker Opinion of Value<br>• Completion Report<br>• Consultation<br>• Desk Review<br>• Evaluation<br>• Peer Review<br>• Rent Study<br>• Restricted Appraisal Report | Report Type | ✅ Working |
| Authorized Use | (dropdown) | Intended Use | ✅ Working |
| Scope | (dropdown) | Scope of Work? | ❓ Unknown |
| Analysis Level | • Comprehensive<br>• Concise<br>• Form | ??? | ❓ Where from? |
| Purpose | (dropdown) | Property Rights? | ⚠️ Terminology mismatch? |
| Values | (dropdown) | ??? | ❓ Need to map? |

**Staff Section**

| Valcre Field | Dashboard Source | Status |
|--------------|------------------|--------|
| Primary Appraiser | Auto-assigned | ✅ Working |
| Role (multiple) | ??? | ❓ Need to map? |

**Permissions**

| Valcre Field | Options | Status |
|--------------|---------|--------|
| Confidential | No / Yes | ❓ Need to map? |

**Comments Section**

| Valcre Field | Dashboard Source | Status |
|--------------|------------------|--------|
| General | Appraiser Comments | ❌ **NOT MAPPING** |
| Client | Client "Additional Information" | ✅ Working |
| Delivery | ??? | ❓ Need to map? |
| Payment | ??? | ❓ Need to map? |

**Custom Fields Section**

| Valcre Field | Available Options | Dashboard Source | Status |
|--------------|------------------|------------------|--------|
| Lender Company Name | Text field | Not on forms | ❓ Add to forms? |
| Lender Company Address | Text field | Not on forms | ❓ Add to forms? |
| Lender Contact Name | Text field | Not on forms | ❓ Add to forms? |
| Lender Contact Email | Text field | Not on forms | ❓ Add to forms? |
| Lender Contact Phone | Text field | Not on forms | ❓ Add to forms? |
| Lender Contact Title | Text field | Not on forms | ❓ Add to forms? |
| **Valuation Premise - 1** | • As Is<br>• As Stabilized<br>• As If Renovated & Stabilized<br>• As If Complete & Stabilized<br>• As Is Vacant Land<br>• As If Vacant Land<br>• As If Rezoned<br>• As If Serviced<br>• As If Subdivided | Client form "Valuation Premises" | ❌ **NOT MAPPING (CRITICAL!)** |
| **Valuation Premise - 2** | (same options as above) | Second scenario? | ❓ When used? |
| Appraised Value - 1 | Text/number field | Final value | N/A (appraiser fills) |
| Appraised Value - 2 | Text/number field | Final value | N/A (appraiser fills) |

---

### 🔍 KEY QUESTIONS TO RESOLVE

1. **Lender fields** - Should these be added for financing-related jobs? Conditional based on "Intended Use: Financing Purposes"?

2. **Valuation Premise - 2** - When/why would a second valuation premise be used? Is this for scenarios like "As Is + As Stabilized"?

3. **Analysis Level** - Where is "Comprehensive" coming from? Is it hardcoded or derived from another field?

4. **Property Rights vs Purpose** - Dashboard has "Property Rights" but Valcre has "Purpose" - are these the same thing or different concepts?

5. **Unmapped dashboard fields** - What should happen with:
   - Payment Terms
   - Asset Condition
   - Property Type (appears to show as "Building" in Valcre)

6. **Date fields** - Should any of these be populated:
   - Bid Date
   - Awarded Date
   - Inspection Date
   - Date of Value
   - Internal Due Date
   - Invoice Date

---

## SUMMARY: Critical Issues

**Must fix:**
1. ❌ Valuation Premises not mapping to Valcre Custom Field "Valuation Premise - 1"
2. ❌ Appraiser Comments not mapping to Valcre Comments "General" field (and disappearing from dashboard UI)

**Should investigate:**
3. ❓ LOE email preview error when changing recipient email
4. ❓ Scope of Work mapping status
5. ❓ Property Rights/Purpose terminology
6. ❓ Analysis Level source
7. ❓ Lender fields - add to forms or leave empty?

---

**End of Issues Document**