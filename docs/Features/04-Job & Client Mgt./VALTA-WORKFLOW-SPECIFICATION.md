# Valta Jobs Workflow Specification

**Document Version:** 1.0
**Created:** 2026-01-13
**Source:** Valta ClickUp Workspace (9014181018)
**List ID:** 901402094744

## Executive Summary

This document captures the complete workflow specification for Valta's job management system in ClickUp. This serves as the blueprint for:
1. Testing automation in BC workspace
2. Documentation for future internal PM system development
3. Understanding how appraisal jobs flow from lead to completion

## Workflow Status Pipeline

Valta uses a 5-stage status pipeline that tracks jobs through their lifecycle:

### 1. To Do (Open)
- **Color:** Green (#3db88b)
- **Type:** open
- **Purpose:** New jobs that need to be started
- **Typical Actions:** Initial setup, assign team members, gather requirements

### 2. In Progress (Custom)
- **Color:** Blue (#1090e0)
- **Type:** custom
- **Purpose:** Active work being performed on the job
- **Typical Actions:** Property research, site visits, appraisal work, report drafting

### 3. Waiting On (Custom)
- **Color:** Orange (#e16b16)
- **Type:** custom
- **Purpose:** Blocked jobs waiting on external input
- **Typical Actions:** Waiting for client info, waiting for payment, waiting for signatures

### 4. Done (Done)
- **Color:** Gray (#656f7d)
- **Type:** done
- **Purpose:** Work completed but not yet finalized
- **Typical Actions:** Final review, quality check, preparing for delivery

### 5. Job Done (Closed)
- **Color:** Dark Green (#008844)
- **Type:** closed
- **Purpose:** Fully completed and delivered jobs
- **Typical Actions:** Archived, invoiced, client received deliverables

## Job Lifecycle Flow

```
New Lead → To Do → In Progress → Waiting On (if needed) → Done → Job Done
                         ↓                    ↑
                         └────────────────────┘
                    (cycle if waiting on info)
```

## Custom Fields Structure

Valta uses 40 custom fields organized into 7 categories. Below are the essential fields for core workflow:

### Category 0: Job Identification
- **0.0 - Job Number** (short_text) - Unique identifier for each job

### Category 1: Client Information
- **1.0 - Client Full Name** (short_text)
- **1.1 - Client Title** (short_text)
- **1.2 - Client Organization Name** (short_text)
- **1.3 - Client Organization Address** (short_text)
- **1.4 - Client Phone** (short_text)
- **1.5 - Client Email** (short_text)

### Category 2: Property Details
- **2.0 - Property Name** (short_text)
- **2.1 - Property Address** (short_text)
- **2.2 - Property Type** (dropdown)
  - Multifamily
  - Self Storage
  - Retail
  - Industrial
  - Land
  - Office
  - Hotel
  - Senior
  - Other

- **2.3 - Asset Current Condition** (dropdown)
  - New Development
  - Existing Property

- **2.3 - Property Rights Appraised** (dropdown)
  - None, ASC 805, Condominium Ownership, Cost Segregation Study, Fee Simple Interest, Going Concern, Leased Fee Interest, Leasehold Interest, Market Study, Other, Partial Interest, Partial Interest Taking, Rent Restricted, Total Taking

- **2.3 - Intended Use** (dropdown)
  - Financing Purposes
  - Internal Business Decisions
  - Financial Reporting
  - Underwriting Decisions
  - Litigation Purposes
  - Other
  - GST

- **2.4 - Valuation Premises** (dropdown)
  - None, As-Is, Prospective at Completion, Prospective at Stabilization, As-Vacant, Insurable Replacement Cost, Bulk Value, Disposition, Go Dark, In Use, Liquidation, Lots, Lots to Houses, Market Rent Study, Other, Rent Restricted, Retrospective, Tax Credits

- **2.5 - Comments** (text) - Additional property details or special notes
- **2.6 - Date Received** (date) - When the job request came in
- **2.7 - Date Contract Created** (date) - When LOE/contract was generated

### Category 3: Financial & Scope
- **3.0 - Fee Amount** (currency USD) - Total job fee
- **3.1 - Disbursment** (number) - Payment tracking
- **3.2 - Payment Terms** (dropdown)
  - Net 30
  - Net 60
  - Upon Completion
  - 50% Upfront
  - On LOE Signature

- **3.3 - Delivery Date** (short_text) - Expected delivery date
- **3.4 - Report Type** (dropdown)
  - Comprehensive
  - Concise
  - Form
  - N/A

- **3.5 - Scope of Work** (dropdown)
  - None, All Applicable, Best One Approach, Best Two Approaches, Cost Approach, Direct Comparison Approach, Discounted Cash Flow, Feasibility Study, Income Approach, Land Value, Litigation, Market Research, Net Rent Review, Update

- **3.7 - Retainer Amount (%)** (number) - Upfront payment percentage

### Category 4: Actions/Automation Triggers
- **4.0 - Action: Create Valcre Job** (dropdown)
  - Yes
  - No

- **4.1 - Action: Create LOE Contract** (dropdown)
  - Send to Client
  - Draft Contract

### Category 5: External Links
- **5.0 - Link: Valcre Job Link** (url) - Link to Valcre system job record
- **5.0 - Link: Box Folder** (url) - Link to Box.com document storage
- **5.0 - Link: CRM Deal Ticket** (url) - Link to CRM system
- **5.0 - Link: LOE Contract 'Draft'** (url) - Link to draft contract in DocuSeal
- **5.3 - Action: CRM Deal Creation** (dropdown)
  - Yes
  - No
  - Created

### Category 6: Communication
- **6.0 - Send Email** (dropdown)
  - Yes
  - No
  - Sent

- **6.3 - Email Body** (text) - Template or draft email content

### Additional Tracking Fields
- **Job Status** (dropdown) - Granular substatus tracking (20 options including: Send LOE, Paid, Plan Job, Get Client Info, Book Tour, Search Comps, Review Report, etc.)
- **With** (dropdown) - Team member assignment
  - Chris
  - Amaan
  - Jamie
  - Monishaa

- **Task Type** (dropdown) - Department/category classification
  - Ops/Tech & Equip
  - Fin
  - App & Val
  - Brnd-Mktg-Sales
  - HR - Recruiting
  - Leg-Ins-Reg
  - Strat & Plan
  - Daily
  - Onboarding

- **Notes** (text/short_text) - General notes and updates
- **Files** (attachment) - Document attachments

## Task Structure Patterns

### Parent-Child Relationships
- Jobs often have subtasks for different stages
- Example: "9. Book Job" as subtask of parent job
- Parent tasks contain main job info
- Subtasks break down workflow stages

### Common Subtask Patterns
Based on the "Job Status" field options, typical subtasks include:
1. Send LOE (Letter of Engagement)
2. Get Client Info
3. Book Tour
4. Search Comps
5. Review Comps
6. Valuation
7. Review Report
8. Send to Client
9. Client Changes (if needed)
10. Final delivery

### Checklists Usage
- Tasks may contain checklists for detailed step tracking
- Used for QA checks, document requirements, review steps

## Automation Patterns (Visible via API)

### 1. Valcre Integration
- Field "4.0 - Action: Create Valcre Job" triggers job creation in Valcre appraisal system
- Link stored in "5.0 - Link: Valcre Job Link"

### 2. Contract Generation
- Field "4.1 - Action: Create LOE Contract" triggers contract drafting
- Draft link stored in "5.0 - Link: LOE Contract 'Draft'"
- Likely uses DocuSeal for e-signature

### 3. CRM Synchronization
- Field "5.3 - Action: CRM Deal Creation" tracks CRM deal creation
- Deal link stored in "5.0 - Link: CRM Deal Ticket"

### 4. Email Automation
- Field "6.0 - Send Email" controls automated email sending
- Email content from "6.3 - Email Body"
- Status tracking: Yes → Sent

### 5. Document Management
- "5.0 - Link: Box Folder" auto-created for each job
- Centralized document storage per job

## Typical Job Workflow Example

### Stage 1: New Job Created (To Do)
- Task created with Job Number
- Client info fields populated (1.0-1.5)
- Property details entered (2.0-2.4)
- Fee and payment terms set (3.0, 3.2)
- Assigned to team member (With field)

### Stage 2: Contract Phase (To Do → In Progress)
- "4.1 - Action: Create LOE Contract" set to "Draft Contract"
- Contract drafted and link stored
- Set to "Send to Client"
- "6.0 - Send Email" set to "Yes" to notify client
- Move to "Waiting On" status

### Stage 3: Contract Signed (Waiting On → In Progress)
- Payment received confirmation
- "Job Status" set to "Paid"
- "4.0 - Action: Create Valcre Job" set to "Yes"
- Valcre job created, link stored
- Box folder created for documents
- Move to "In Progress"

### Stage 4: Work Execution (In Progress)
- "Job Status" cycles through: Plan Job → Book Tour → Search Comps → Valuation → Review Report
- Team collaborates via subtasks and checklists
- Documents uploaded to Box folder
- May cycle to "Waiting On" if client clarification needed

### Stage 5: Delivery (Done → Job Done)
- "Job Status" set to "Send to Client"
- Report delivered via Box link
- Client feedback period
- Final revisions if needed
- Move to "Job Done" when complete
- Archive task

## Key Insights for Internal PM System

### 1. Status vs. Substatus Pattern
- Main status (5 stages) shows overall progress
- Job Status field (20+ options) shows detailed stage
- This two-tier system provides both overview and detail

### 2. Action Fields Drive Automation
- "Action: Create X" fields trigger external system integrations
- Automation updates link fields with results
- Clear handoff points between systems

### 3. Heavy External System Integration
- Valcre: Core appraisal work platform
- DocuSeal: Contract management
- CRM: Deal tracking (likely HubSpot or similar)
- Box: Document storage
- ClickUp acts as central orchestration layer

### 4. Team Collaboration Features
- "With" field for assignment
- Parent-child task relationships
- Checklists for detailed steps
- Comment system (not visible in API but standard ClickUp)

### 5. Client Communication Tracking
- Email automation with template storage
- Status tracking (Yes/No/Sent pattern)
- Date tracking for key milestones

## Simplified Fields for Testing

For BC test workspace, focus on these 15 core fields:

1. **0.0 - Job Number** (short_text)
2. **1.0 - Client Full Name** (short_text)
3. **1.5 - Client Email** (short_text)
4. **2.0 - Property Name** (short_text)
5. **2.1 - Property Address** (short_text)
6. **2.2 - Property Type** (dropdown: Multifamily, Retail, Office, Industrial, Other)
7. **2.6 - Date Received** (date)
8. **3.0 - Fee Amount** (currency)
9. **3.2 - Payment Terms** (dropdown: Net 30, Net 60, Upon Completion)
10. **3.4 - Report Type** (dropdown: Comprehensive, Concise, Form)
11. **4.0 - Action: Create Valcre Job** (dropdown: Yes, No)
12. **5.0 - Link: Box Folder** (url)
13. **With** (dropdown: Team members)
14. **Job Status** (dropdown: Core statuses only)
15. **Notes** (text)

## API Access Details

### Valta Workspace
- **Workspace ID:** 9014181018
- **Space ID:** 90140682617
- **List ID:** 901402094744
- **List Name:** Valta Jobs
- **Task Count:** 228 tasks
- **API Token:** pk_54774263_VRTOFK2ENK5O96J549ESCPUESS76E1AT

### BC Test Workspace
- **Workspace ID:** 10791838
- **Space ID:** 8555561
- **List Name:** To be created (BC Jobs - Test)
- **API Token:** pk_10791838_XB273RX0O9O1AL5WTZZIVREX1F3RUOL5

## Implementation Notes for Phase 3

When building internal PM system to replace ClickUp:

1. **Database Schema:** Use two-tier status system (main status + substatus)
2. **External Integrations:** Plan webhook architecture for Valcre, DocuSeal, Box
3. **Automation Engine:** Build rule-based automation for "Action" field triggers
4. **UI/UX:** Kanban board view for main statuses, table view for detailed fields
5. **Client Portal:** Public-facing view for status tracking and document access
6. **Mobile Support:** Field team needs mobile access for property tours
7. **Reporting:** Revenue tracking, job velocity, team utilization metrics

## Appendix: Complete Field Reference

See Valta custom fields JSON export for full field definitions including all dropdown options.

Total fields: 40
Field categories: 7 (0-6)
Dropdown fields: 15
Text fields: 18
URL fields: 5
Date fields: 2
Currency fields: 1
Number fields: 2
Attachment fields: 1
