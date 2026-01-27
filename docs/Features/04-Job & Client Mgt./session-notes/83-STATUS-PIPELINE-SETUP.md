# Status Pipeline Setup Guide

**Date:** January 13, 2026  
**Purpose:** Step-by-step guide to add 5-stage status pipeline matching Valta workflow  
**Space:** APR Testing (90173368196) - **NEW DEDICATED SPACE** ✅  
**List:** APR Test - Valta Mirror (901709622357) - **CREATED** ✅  
**Why:** Statuses are inherited from space level, so we need a dedicated space for custom statuses

---

## Why a New Space?

**Problem:** Statuses are inherited from the **SPACE** level in ClickUp, not the list level. The original list was in "My Stuff" space which had statuses (`gen stuff`, `ideas`, `complete`) that couldn't be easily changed.

**Solution:** Created a dedicated **"APR Testing"** space (ID: 90173368196) where we can set custom statuses without affecting other lists.

**New Space Details:**
- **Space ID:** `90173368196`
- **Space Name:** `APR Testing`
- **Folder ID:** `90173368197` (APR Test Lists)
- **List:** Will be created in this new space

**Status:** New space is ready. Statuses need to be configured via UI.

---

## Required Statuses (From Valta Images)

Based on the Valta task board images, we need these exact 5 statuses:

| Order | Status Name | Type | Color | Color Code | Visual in Images |
|-------|-------------|------|-------|------------|------------------|
| 0 | **TO DO** | open | Green | `#3db88b` | Green outline circle |
| 1 | **IN PROGRESS** | custom | Blue | `#1090e0` | Solid blue circle |
| 2 | **WAITING ON** | custom | Orange | `#e16b16` | Solid orange circle |
| 3 | **DONE** | done | Gray | `#656f7d` | Gray circle with checkmark |
| 4 | **JOB DONE** | closed | Dark Green | `#008844` | Solid green circle with checkmark |

---

## Priority Colors (From Valta Images)

Based on the priority dropdown in Valta images:

| Priority | Color | Flag Color | Use Case |
|----------|-------|------------|----------|
| **Urgent** | Red | Red flag | Critical, immediate attention |
| **High** | Orange/Yellow | Orange flag | Important, prioritize soon |
| **Normal** | Blue | Blue flag | Standard priority (default) |
| **Low** | Grey | Grey flag | Low priority, can wait |
| **Clear** | None | No flag | No priority set |

**Note:** Priorities are standard ClickUp fields and don't need to be created - just use the correct priority values (1=Urgent, 2=High, 3=Normal, 4=Low).

---

## Setup Instructions (Via ClickUp UI)

**⚠️ IMPORTANT:** ClickUp API does NOT support creating custom statuses. This must be done via the web interface.

**⚠️ CRITICAL:** Statuses are inherited from the **SPACE** level, not the list level. We've created a dedicated **"APR Testing"** space (ID: 90173368196) so you can set custom statuses without affecting other lists.

### Step 1: Access Space Settings (Not List Settings)

1. Open the APR Testing space: `https://app.clickup.com/8555561/v/li/90173368196`
2. Click the **space name** at the top: **"APR Testing"**
3. Click **"Settings"** (gear icon) or right-click space name → **"Settings"**
4. Navigate to **"Statuses"** tab

**Alternative:** You can also access via the list:
1. Open BC mirror list: `https://app.clickup.com/8555561/v/f/90175530579/90173368196`
2. Click the **space name** (not list name): **"APR Testing"**
3. Click **"Settings"** → **"Statuses"**

### Step 2: Delete Existing Statuses (If Any)

**New Space:** The "APR Testing" space is brand new, so it may have default statuses or be empty.

1. Check what statuses exist (may be default ClickUp statuses)
2. If there are statuses you don't want, click the **"..."** menu next to each
3. Select **"Delete"** or **"Remove"**
4. Confirm deletion
5. Repeat for any unwanted statuses

**Note:** If the space is empty or has default statuses, you can skip this step and just create the 5 new statuses.

### Step 3: Create New Statuses

Create statuses in this exact order:

#### Status 1: TO DO
1. Click **"+ Add Status"** or **"Create Status"**
2. **Status Name:** `TO DO` (all caps, with space)
3. **Status Type:** Select **"Open"** (this is the default/open status)
4. **Color:** Click color picker, enter `#3db88b` or select green
5. **Order:** Should be first (orderindex: 0)
6. Click **"Save"** or **"Create"**

#### Status 2: IN PROGRESS
1. Click **"+ Add Status"**
2. **Status Name:** `IN PROGRESS` (all caps, with space)
3. **Status Type:** Select **"Custom"**
4. **Color:** Click color picker, enter `#1090e0` or select blue
5. **Order:** Should be second (orderindex: 1)
6. Click **"Save"**

#### Status 3: WAITING ON
1. Click **"+ Add Status"**
2. **Status Name:** `WAITING ON` (all caps, with space)
3. **Status Type:** Select **"Custom"**
4. **Color:** Click color picker, enter `#e16b16` or select orange
5. **Order:** Should be third (orderindex: 2)
6. Click **"Save"**

#### Status 4: DONE
1. Click **"+ Add Status"**
2. **Status Name:** `DONE` (all caps)
3. **Status Type:** Select **"Done"** (this marks task as complete but not archived)
4. **Color:** Click color picker, enter `#656f7d` or select gray
5. **Order:** Should be fourth (orderindex: 3)
6. Click **"Save"**

#### Status 5: JOB DONE
1. Click **"+ Add Status"**
2. **Status Name:** `JOB DONE` (all caps, with space)
3. **Status Type:** Select **"Closed"** (this archives the task)
4. **Color:** Click color picker, enter `#008844` or select dark green
5. **Order:** Should be last (orderindex: 4)
6. Click **"Save"**

### Step 4: Verify Status Order

After creating all 5 statuses, verify the order matches:
1. TO DO (open, green)
2. IN PROGRESS (custom, blue)
3. WAITING ON (custom, orange)
4. DONE (done, gray)
5. JOB DONE (closed, dark green)

If order is wrong, drag and drop statuses to reorder them.

---

## Status Flow Diagram

```
TO DO → IN PROGRESS → WAITING ON (optional) → DONE → JOB DONE
         ↓                    ↑
         └────────────────────┘
    (cycle back if blocked)
```

**Workflow:**
- New jobs start in **TO DO**
- Move to **IN PROGRESS** when work begins
- Move to **WAITING ON** if blocked (client info, documents, etc.)
- Move to **DONE** when work is complete
- Move to **JOB DONE** when fully archived/closed

---

## Verification Checklist

After setup, verify:

- [ ] All 5 statuses exist with correct names (all caps)
- [ ] Colors match Valta exactly:
  - [ ] TO DO = Green (#3db88b)
  - [ ] IN PROGRESS = Blue (#1090e0)
  - [ ] WAITING ON = Orange (#e16b16)
  - [ ] DONE = Gray (#656f7d)
  - [ ] JOB DONE = Dark Green (#008844)
- [ ] Status types are correct:
  - [ ] TO DO = Open
  - [ ] IN PROGRESS = Custom
  - [ ] WAITING ON = Custom
  - [ ] DONE = Done
  - [ ] JOB DONE = Closed
- [ ] Order is correct (0-4)
- [ ] Test task can be moved through all statuses

---

## API Verification (After Setup)

Once statuses are created via UI, verify via API:

```bash
# Check space statuses (statuses are at space level)
curl -X GET "https://api.clickup.com/api/v2/space/90173368196" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq '.statuses[] | {status, color, type, orderindex}'

# Or check list statuses (inherited from space)
curl -X GET "https://api.clickup.com/api/v2/list/[LIST_ID]" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  | jq '.statuses[] | {status, color, type, orderindex}'
```

Expected output:
```json
{
  "status": "TO DO",
  "color": "#3db88b",
  "type": "open",
  "orderindex": 0
}
{
  "status": "IN PROGRESS",
  "color": "#1090e0",
  "type": "custom",
  "orderindex": 1
}
{
  "status": "WAITING ON",
  "color": "#e16b16",
  "type": "custom",
  "orderindex": 2
}
{
  "status": "DONE",
  "color": "#656f7d",
  "type": "done",
  "orderindex": 3
}
{
  "status": "JOB DONE",
  "color": "#008844",
  "type": "closed",
  "orderindex": 4
}
```

---

## Priority Usage in Code

When creating/updating tasks via API, use these priority values:

```typescript
// Priority values for ClickUp API
const PRIORITY = {
  URGENT: 1,    // Red flag
  HIGH: 2,      // Orange flag
  NORMAL: 3,    // Blue flag (default)
  LOW: 4        // Grey flag
}

// Example task creation
const taskPayload = {
  name: "Task Name",
  priority: PRIORITY.URGENT,  // Sets red "Urgent" flag
  status: "TO DO"
}
```

---

## Troubleshooting

### Status Not Appearing
- Check if status was created in correct list (not folder/space level)
- Verify list has "Override Statuses" enabled
- Refresh browser and check again

### Wrong Colors
- ClickUp color picker may show different values
- Manually enter hex code: `#3db88b` for green
- Verify color matches Valta images exactly

### Can't Delete Status
- Status may be in use by tasks
- Move all tasks to different status first
- Then delete the status

### Status Order Wrong
- Drag and drop statuses in Settings → Statuses
- Order is saved automatically
- Verify via API after reordering

---

## Next Steps

After statuses are set up:

1. ✅ Update Edge Function to use new status names
2. ✅ Test task creation with "TO DO" status
3. ✅ Test status transitions through workflow
4. ✅ Verify colors match Valta exactly
5. ✅ Document status IDs for automation

---

**Document Status:** ✅ Setup Guide Complete  
**Action Required:** Manual setup via ClickUp UI  
**Estimated Time:** 5-10 minutes
