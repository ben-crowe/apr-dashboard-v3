# Auto-Save & Sync Bugs - APR Dashboard V3 Valcre Integration

**Production Testing Session:** January 10, 2025  
**Valcre Job ID:** VAL251014  
**Testing Method:** Live production environment, manual field testing

---

## Summary

Multiple fields in the LOE/Quote section are NOT triggering auto-save to database or sync to Valcre. Only specific fields (Appraisal Fee, Retainer Amount) have working auto-save handlers. User expects ALL field changes to:

1. Auto-save to Supabase database
2. Auto-sync to Valcre (for existing jobs)
3. Display toast notification confirming save/sync

**Current Behavior:** Most fields change visually but don't save or sync.

---

## Fields with WORKING Auto-Save ✅

### 1. Appraisal Fee
- **Status:** ✅ Working
- **Evidence:** Shows spinning indicator on change
- **Behavior:** Saves to database, syncs to Valcre

### 2. Retainer Amount
- **Status:** ✅ Working
- **Evidence:** Shows spinning indicator on change
- **Behavior:** Saves to database, syncs to Valcre

---

## Fields with BROKEN Auto-Save ❌

### 1. Valuation Premises (Dropdown)
- **Status:** ❌ Not working
- **Test Performed:** Changed from "Select..." to "Market Rent"
- **Expected:** Toast notification + sync to Valcre
- **Actual:** No console log, no notification, no sync
- **User Quote:** "I changed it, nothing spiraled to say it updated or no error or anything. So I don't think it's even mapping."
- **File:** `src/components/dashboard/job-details/LoeQuoteSection.tsx`
- **Fix Needed:** Add onChange handler with auto-save logic

### 2. Intended Use (Dropdown)
- **Status:** ❌ Not working
- **Test Performed:** Changed dropdown value
- **Expected:** Toast notification + sync to Valcre
- **Actual:** No update notification appeared
- **User Quote:** "I changed both, and still no indication that it was saved or indication that it synced to Valcre"
- **File:** `src/components/dashboard/job-details/LoeQuoteSection.tsx`
- **Fix Needed:** Add onChange handler with auto-save logic

### 3. Asset Condition (Dropdown)
- **Status:** ❌ Not working
- **Test Performed:** Changed dropdown value
- **Expected:** Toast notification + sync to Valcre
- **Actual:** No update notification appeared
- **User Quote:** "I changed both, and still no indication that it was saved or indication that it synced to Valcre"
- **File:** `src/components/dashboard/job-details/LoeQuoteSection.tsx`
- **Fix Needed:** Add onChange handler with auto-save logic

### 4. Appraiser Comments (Textarea)
- **Status:** ❌ Not working
- **Test Performed:** Added text to comments field
- **Expected:** Toast notification + sync to Valcre (spinning indicator at minimum)
- **Actual:** No spinning indicator, no notification
- **User Quote:** "I just added a comment to the appraiser comments section, and I did not see the little spinning update thing. But I did change the price, and I did see the spinning update thing."
- **File:** `src/components/dashboard/job-details/LoeQuoteSection.tsx`
- **Fix Needed:** Add onBlur handler with auto-save logic

---

## Special Case: Property Types Display Bug

### Property Types (Multi-Select Checkboxes)
- **Status:** 🔄 One-way data flow issue
- **Dashboard Display:** "Add more..." (empty, all checkboxes unchecked)
- **Valcre Display:** "Industrial" ✅
- **Issue:** Property Type DOES send to Valcre during job creation, but does NOT load back from database into UI
- **User Quote:** "we didn't even choose a property type in this job. The hell, but there was a property type. That's weird. So there was a property type in the test in Valcre, but I don't think we chose one here."
- **Root Cause:** Missing bidirectional data binding
- **File:** `src/components/dashboard/job-details/LoeQuoteSection.tsx`
- **Fix Needed:** 
  1. Load property types from database on component mount
  2. Check appropriate boxes based on saved values
  3. Add onChange handler with auto-save logic

---

## Missing Toast Notifications

### Current Behavior
- **Appraisal Fee/Retainer:** Show subtle spinning indicator only
- **Preview & Send LOE Button:** Shows proper toast notification ✅
- **All Other Fields:** No feedback at all ❌

### Expected Behavior
**User provided screenshot example:**
```
Toast Notification (bottom of screen):
"Preview generated - please review before sending"
```

**User Quote:** "So we got to have it so it brings up that lower prompt that pops up in the bottom of the window... That thing is cool to have. It's a nice little indicator that things are loading. That definitely does not come up when I do a lot of the other changes, so that indicates that the other changes are not syncing."

### Implementation Needed
All field auto-save operations should display toast notification:
- **On Save Success:** "Field updated successfully" or "Synced to Valcre"
- **On Save Error:** "Failed to update field" with error details
- **Style:** Bottom-of-screen popup (same as preview notification)
- **Duration:** 3-5 seconds

---

## Technical Investigation Required

### File: `src/components/dashboard/job-details/LoeQuoteSection.tsx`

**Tasks:**
1. Review which fields have auto-save handlers (onChange/onBlur with save logic)
2. Identify pattern used for working fields (Appraisal Fee, Retainer Amount)
3. Apply same pattern to broken fields (Valuation Premises, Intended Use, Asset Condition, Appraiser Comments)
4. Add toast notification system to ALL auto-save operations
5. Fix Property Types bidirectional data binding

**Pattern to Implement:**
```typescript
// Example for dropdown fields
const handleFieldChange = async (fieldName: string, value: any) => {
  try {
    // 1. Update local state
    setFieldValue(value);
    
    // 2. Save to Supabase
    await updateJobField(jobId, fieldName, value);
    
    // 3. Sync to Valcre (if job exists in Valcre)
    if (valcreJobNumber) {
      await syncToValcre(valcreJobNumber, { [fieldName]: value });
    }
    
    // 4. Show success toast
    showToast('success', 'Field updated and synced to Valcre');
  } catch (error) {
    showToast('error', `Failed to update ${fieldName}: ${error.message}`);
  }
};
```

---

## Testing Checklist

After fixes applied, verify each field:

### Dropdowns
- [ ] Valuation Premises - change value, verify toast + Valcre sync
- [ ] Intended Use - change value, verify toast + Valcre sync
- [ ] Asset Condition - change value, verify toast + Valcre sync
- [ ] Property Types - check boxes, verify toast + Valcre sync + loads from DB

### Text Fields
- [ ] Appraisal Fee - confirm still working with new toast
- [ ] Retainer Amount - confirm still working with new toast
- [ ] Appraiser Comments - add text, verify toast + Valcre sync

### Valcre Verification
- [ ] Open VAL251014 in Valcre
- [ ] Verify all changed fields appear correctly
- [ ] Verify Property Types persists after page reload

---

## Related Bugs

See also:
- `.cursor/COMMENTS-BUG.md` - Comments mapping issue (separate from auto-save)
- `.cursor/test-results.json` - Production test results

---

## Priority

**HIGH** - User cannot reliably update job details in production. Multiple critical fields are not saving or syncing, leading to data loss and Valcre integration failures.

**User Impact:** 
- Changes appear to save visually but are lost on page reload
- Valcre job data becomes out of sync with dashboard
- No user feedback causes confusion ("Did my change save?")
- Property Types data exists but is invisible to user

---

## Implementation Steps

1. **Phase 1: Add Auto-Save Handlers**
   - Review LoeQuoteSection.tsx event handlers
   - Add onChange/onBlur handlers to all broken fields
   - Implement save-to-database logic
   - Implement sync-to-Valcre logic (for existing jobs)

2. **Phase 2: Toast Notification System**
   - Create/enhance toast notification component
   - Add success notifications to all save operations
   - Add error notifications with details
   - Match style of existing "Preview generated" notification

3. **Phase 3: Property Types Bidirectional Sync**
   - Add database load on component mount
   - Check boxes based on saved values
   - Add onChange handler with auto-save
   - Test create → reload → verify persists

4. **Phase 4: Production Testing**
   - Test each field individually
   - Verify Valcre sync for each change
   - Verify toast notifications appear
   - Verify data persists after page reload

---

**Created:** January 10, 2025  
**Status:** Documented, awaiting Cursor implementation  
**Next Step:** Cursor to implement auto-save handlers and toast notifications
