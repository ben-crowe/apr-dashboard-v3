# Create BC Workspace Mirror - Implementation Spec

**Task for Cursor:** Create a mirrored Valta workflow in BC workspace for APR Dashboard testing

---

## Objective

Create a simplified mirror of Valta's ClickUp workflow in BC Workspace (8555561) that captures:
- ✅ Complete workflow stages (status columns)
- ✅ 10-step subtask process
- ✅ Minimal custom fields (Dashboard/Valcre links only)

**Purpose:** This mirror serves as:
1. Testing environment for 4-stage automation
2. Complete workflow documentation
3. **Specification for Phase 3: Internal project management system in APR Dashboard**

---

## BC Workspace Details

- **Workspace ID:** `8555561`
- **Workspace Name:** BC Workspace (Development)
- **List Name to Create:** `APR Test - Valta Mirror`
- **Description:** `Mirrored Valta workflow for testing. Will become spec for internal PM system (Phase 3).`

---

## Step 1: Create List with Status Columns

### Status Pipeline (5 stages - match Valta exactly)

| Order | Status Name | Type | Color | Purpose |
|-------|-------------|------|-------|---------|
| 0 | to do | open | `#3db88b` (green) | New jobs awaiting assignment |
| 1 | in progress | custom | `#1090e0` (blue) | Active work in progress |
| 2 | waiting on | custom | `#e16b16` (orange) | Blocked/waiting for client/info |
| 3 | done | done | `#656f7d` (gray) | Work complete, pending final |
| 4 | job done | closed | `#008844` (dark green) | Fully complete and archived |

**Status Flow:**
```
to do → in progress → waiting on (optional) → done → job done
         ↓                    ↑
         └────────────────────┘
    (cycle back if blocked)
```

---

## Step 2: Custom Fields (Minimal - Dashboard Replaces Most)

**Only create these 3 fields:**

### 1. Job Number
- **Type:** `short_text`
- **Name:** `Job Number`
- **Purpose:** Unique identifier (e.g., VAL251999)

### 2. Dashboard Link
- **Type:** `url`
- **Name:** `APR Dashboard Link`
- **Purpose:** Link to job in APR Dashboard

### 3. Valcre Link
- **Type:** `url`
- **Name:** `Valcre Job Link`
- **Purpose:** Link to job in Valcre system

**Note:** We're NOT creating the 39 custom fields from Valta - the Dashboard is now the system of record.

---

## Step 3: Task Template with 10 Subtasks

### Template Name
`APR Job Workflow Template`

### Task Name Format
`[JOB_NUMBER] - [PROPERTY_NAME], [ADDRESS]`

Example: `VAL251999 - Retail Center, 123 Main St, Vancouver, BC`

### 10 Subtasks (Checklist Items)

Create these as **checklist items** in the template:

1. **Team Leader** - Assign lead appraiser
2. **1. Create & Send LOE** - Generate and send Letter of Engagement
3. **2. Plan Job** - Review scope, assign resources, set timeline
4. **3. Pull (TTSZ) Tax, Title, Site Plan, Zoning** - Gather property documentation
5. **4. Tour Property** - Schedule and complete site inspection
6. **5. Sale and Lease Comps** - Research comparable properties
7. **6. Build Front End** - Create report structure and preliminary data
8. **7. Complete Valuation** - Finalize appraisal calculations
9. **8. Send to Client** - Deliver completed appraisal report
10. **9. Book Job** - Archive and update financial records

---

## Step 4: Create Test Task

After creating the list and template, create ONE test task to verify:

**Task Details:**
- **Name:** `TEST-001 - Test Property, 123 Test St, Vancouver, BC`
- **Status:** `to do`
- **Description:**
```markdown
▸ NEW APPRAISAL REQUEST: [View in APR Dashboard](https://apr-dashboard.vercel.app)

CLIENT INFORMATION
• Name: Test Client
• Email: test@example.com
• Phone: (555) 123-4567

PROPERTY INFORMATION
• Property Name: Test Property
• Address: 123 Test St
• Property Type: Retail

LOE QUOTE & VALUATION DETAILS
• Appraisal Fee: $3,500
• Retainer: $1,750
• Delivery Date: 2026-02-15
```

**Custom Fields:**
- Job Number: `TEST-001`
- APR Dashboard Link: `https://apr-dashboard.vercel.app/jobs/test-001`
- Valcre Job Link: `https://valcre.com/jobs/test`

**Subtasks:** All 10 should appear as checklist items (unchecked)

---

## Step 5: Document Results

After creating everything, capture:
1. **List ID** - Save for updating Supabase secrets
2. **List URL** - Share with team
3. **Template ID** - For programmatic task creation
4. **Screenshot** - Show status columns and test task

Save results to: `/Users/bencrowe/Development/APR-Dashboard-v3/docs/Features/04-Job & Client Mgt./BC-MIRROR-RESULTS.md`

---

## Verification Checklist

- [ ] List created in BC workspace with correct name
- [ ] 5 status columns match Valta exactly (names, colors, order)
- [ ] 3 custom fields created (Job Number, Dashboard Link, Valcre Link)
- [ ] Task template created with 10 subtasks
- [ ] Test task created and validates structure
- [ ] All IDs documented for automation

---

## Next Steps After Creation

Once mirror is built:
1. Update Supabase secrets to point to BC workspace list
2. Test Stage 1: Form submission → Task creation
3. Test Stage 2: Valcre job → Task update
4. Test Stage 2.5 & 3: DocuSeal webhooks → Task updates
5. Document workflow for Phase 3 internal PM system

---

**Ready to execute!** Use ClickUp API or UI - whichever is faster.
