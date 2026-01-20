# New APR Testing Space Setup

**Date:** January 13, 2026  
**Purpose:** Document the new dedicated space created for APR testing with custom statuses

---

## Why a New Space?

**Problem Identified:** ClickUp statuses are inherited from the **SPACE** level, not the list level. The original list was created in "My Stuff" space which had existing statuses (`gen stuff`, `ideas`, `complete`) that couldn't be easily customized.

**Solution:** Created a dedicated **"APR Testing"** space where we can set custom statuses matching Valta workflow without affecting other lists.

---

## New Space Details

### Space Information
- **Space ID:** `90173368196`
- **Space Name:** `APR Testing`
- **Workspace:** BC Workspace (8555561)
- **Privacy:** Public (not private)
- **URL:** `https://app.clickup.com/8555561/v/li/90173368196`

### Folder Information
- **Folder ID:** `90175530579`
- **Folder Name:** `APR Test Lists`
- **Space:** APR Testing (90173368196)

### List Information
- **List ID:** `901709622357` ✅ **CREATED**
- **List Name:** `APR Test - Valta Mirror`
- **Folder:** APR Test Lists (90175530579)
- **URL:** `https://app.clickup.com/8555561/v/f/90175530579/90173368196`
- **Current Statuses:** Default ClickUp statuses ("to do", "complete") - need to be replaced

---

## Status Configuration

**Statuses must be configured at the SPACE level:**

1. Open space: `https://app.clickup.com/8555561/v/li/90173368196`
2. Click space name → **Settings** → **Statuses**
3. Create 5 statuses matching Valta workflow (see `83-STATUS-PIPELINE-SETUP.md`)

**Required Statuses:**
- TO DO (open, #3db88b)
- IN PROGRESS (custom, #1090e0)
- WAITING ON (custom, #e16b16)
- DONE (done, #656f7d)
- JOB DONE (closed, #008844)

---

## Migration from Old List

### Old List (My Stuff Space)
- **List ID:** `901709621852`
- **Space:** My Stuff (90030326242)
- **Folder:** LOE Workflow (90171828559)
- **Status:** Has wrong statuses inherited from space

### New List (APR Testing Space)
- **List ID:** `901709622357` ✅
- **Space:** APR Testing (90173368196)
- **Folder:** APR Test Lists (90175530579)
- **Current Statuses:** Default ("to do", "complete") - need to configure 5 Valta statuses
- **Status:** Ready for status configuration

---

## Next Steps

1. ✅ **DONE:** Created new space "APR Testing" (90173368196)
2. ✅ **DONE:** Created folder "APR Test Lists" (90175530579)
3. ✅ **DONE:** Created list "APR Test - Valta Mirror" (901709622357)
4. ⏳ **PENDING:** Configure 5 statuses at space level (via UI) - **NEXT STEP**
5. ⏳ **PENDING:** Create custom fields (Job Number, Dashboard Link, Valcre Link, Job Status)
6. ⏳ **PENDING:** Create test task
7. ⏳ **PENDING:** Update Supabase secrets with new List ID (901709622357)

---

## Benefits of New Space

1. **Isolated Testing** - Won't affect other lists/spaces
2. **Custom Statuses** - Can set exact Valta workflow statuses
3. **Clean Slate** - No inherited statuses to deal with
4. **Future-Proof** - Can add more test lists without conflicts

---

**Document Status:** ✅ Space Created  
**Next Step:** Configure statuses at space level (see `83-STATUS-PIPELINE-SETUP.md`)
