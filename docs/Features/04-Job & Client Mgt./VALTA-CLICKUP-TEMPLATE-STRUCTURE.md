# Valta ClickUp Template Structure

**Template Name**: LOE New Template 2025.01.09
**Template ID**: `t-86b3exqe8`
**Date Captured**: January 13, 2026

---

## Key Finding

**NO SUBTASKS** - This template uses **custom fields** for workflow tracking, not subtask checklists.

---

## Custom Fields (40 total)

### 0. Job Identification
- **0.0 - Job Number** (short_text)

### 1. Client Information
- **1.0 - Client Full Name** (short_text)
- **1.1 - Client Title** (short_text)
- **1.2 - Client Organization Name** (short_text)
- **1.3 - Client Organization Address** (short_text)
- **1.4 - Client Phone** (short_text)
- **1.5 - Client Email** (short_text)

### 2. Property Information
- **2.0 - Property Name** (short_text)
- **2.1 - Property Address** (short_text)
- **2.2 - Property Type** (dropdown)
  - Multifamily, Self Storage, Retail, Industrial, Land, Office, Hotel, Senior, Other
- **2.3 - Asset Current Condition** (dropdown)
  - New Development, Existing Property
- **2.3 - Intended Use** (dropdown)
  - Financing Purposes, Internal Business Decisions, Financial Reporting, Underwriting Decisions, Litigation Purposes, Other, GST
- **2.3 - Property Rights Appraised** (dropdown)
  - None, ASC 805, Condominium Ownership, Cost Segregation Study, Fee Simple Interest, Going Concern, Leased Fee Interest, Leasehold Interest, Market Study, Other, Partial Interest, Partial Interest Taking, Rent Restricted, Total Taking
- **2.4 - Valuation Premises** (dropdown)
  - None, As-Is, Prospective at Completion, Prospective at Stabilization, As-Vacant, Insurable Replacement Cost, Bulk Value, Disposition, Go Dark, In Use, Liquidation, Lots, Lots to Houses, Market Rent Study, Other, Rent Restricted, Retrospective, Tax Credits
- **2.5 - Comments** (text)
- **2.6 - Date Received** (date)
- **2.7 - Date Contract Created** (date)

### 3. Financial & Scope
- **3.0 - Fee Amount** (currency - USD)
- **3.1 - Disbursement** (number)
- **3.2 - Payment Terms** (dropdown)
  - Net 30, Net 60, Upon Completion, 50% Upfront, On LOE Signature
- **3.3 - Delivery Date** (short_text)
- **3.4 - Report Type** (dropdown)
  - Comprehensive, Concise, Form, N/A
- **3.5 - Scope of Work** (dropdown)
  - None, All Applicable, Best One Approach, Best Two Approaches, Cost Approach, Direct Comparison Approach, Discounted Cash Flow, Feasibility Study, Income Approach, Land Value, Litigation, Market Research, Net Rent Review, Update
- **3.7 - Retainer Amount (%)** (number)

### 4. Action Triggers
- **4.0 - Action: Create Valcre Job** (dropdown)
  - Yes, No
- **4.1 - Action: Create LOE Contract** (dropdown)
  - Send to Client, Draft Contract
- **5.3 - Action: CRM Deal Creation** (dropdown)
  - Yes, No, Created

### 5. Links
- **5.0 - Link: Box Folder** (url)
- **5.0 - Link: CRM Deal Ticket** (url)
- **5.0 - Link: LOE Contract 'Draft'** (url)
- **5.0 - Link: Valcre Job Link** (url)

### 6. Email Integration
- **6.0 - Send Email** (dropdown)
  - Yes, No, Sent
- **6.3 - Email Body** (text)

### 7. Files & Workflow
- **Files** (attachment)
- **Job Status** (dropdown) - **20 status options:**
  - Send LOE, Paid, Plan Job, Get Client Info, Book Tour, Call Client Clarify, Search Comps, Front End, Review Comps, Valuation, Review Report, Edits, Review & Book Tour, Send to Client, Client Changes, Not Paid, Not Signed, LOR Req Sent V/A, Sent for Review, Cancel
- **Notes** (text)
- **Notes** (short_text) - duplicate field
- **Task Type** (dropdown)
  - Ops/Tech & Equip, Fin, App & Val, Brnd-Mktg-Sales, HR - Recruiting, Leg-Ins-Reg, Strat & Plan, Daily, Onboarding
- **With** (dropdown) - Team member assignment
  - Chris, Amaan, Jamie, Monishaa

---

## What This Means for Mirroring

To recreate this in BC workspace, we need to:
1. Create a new list in BC workspace
2. Set up ALL 40 custom fields with exact names and dropdown options
3. Create a template that includes these custom fields
4. Test task creation with the template

**Challenge**: This is a MASSIVE custom field setup. We may want to use ClickUp's list duplication feature or manually create a simplified version for testing.

---

## Alternative Approach

Instead of manually recreating 40 custom fields, we could:
1. Test with BC workspace first using the EXISTING simple template
2. Verify the 4-stage automation works end-to-end
3. THEN worry about custom field mapping later

The critical part for testing is:
- Task creation works
- Task updates preserve data
- Webhook integration functions
- Progressive updates (Stage 1 → 2 → 2.5 → 3) work correctly

Custom fields are nice-to-have but not critical for the core automation testing.
