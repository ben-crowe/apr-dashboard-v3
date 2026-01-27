# Custom Fields Integration - Future Work

**Created:** January 8, 2026  
**Status:** 📋 Future Work - After ClickUp & LOE Testing Complete  
**Priority:** Medium

---

## 🎯 Overview

Client has requested integration with new custom fields in Valcre. This document tracks the fields and integration approach for future implementation.

---

## 📋 New Custom Fields Required

### Lender Information Fields

1. **Lender Company Name**
2. **Lender Company Address**
3. **Lender Contact Name**
4. **Lender Contact Email**
5. **Lender Contact Phone**
6. **Lender Contact Title**

### Valuation Fields

7. **Valuation Premise - 1**
8. **Valuation Premise - 2**
9. **Appraised Value - 1**
10. **Appraised Value - 2**

### Test Field

11. **Test1**

---

## 🔄 Integration Approach

**Note:** User has existing documentation and workflows for custom field integration that should be reviewed before implementation.

### Steps (To be completed after current testing):

1. **Review Existing Documentation**
   - Locate custom field integration workflows
   - Review Valcre API custom field mapping patterns
   - Understand field type requirements

2. **Database Schema Updates**
   - Add columns to `job_submissions` or `job_loe_details` table
   - Determine appropriate data types
   - Add validation constraints if needed

3. **UI Updates**
   - Add form fields to appropriate dashboard sections
   - Add to "Fill Test Data" buttons
   - Ensure auto-save functionality

4. **Valcre API Integration**
   - Map fields to Valcre custom field IDs
   - Update `create-valcre-job` Edge Function
   - Test field population in Valcre

5. **ClickUp Integration**
   - Add fields to ClickUp task description (if needed)
   - Update task templates if required

---

## 📝 Field Mapping (To be determined)

| Dashboard Field | Valcre Custom Field ID | Data Type | Required |
|----------------|------------------------|-----------|----------|
| Lender Company Name | TBD | Text | TBD |
| Lender Company Address | TBD | Text | TBD |
| Lender Contact Name | TBD | Text | TBD |
| Lender Contact Email | TBD | Email | TBD |
| Lender Contact Phone | TBD | Phone | TBD |
| Lender Contact Title | TBD | Text | TBD |
| Valuation Premise - 1 | TBD | Text/Select | TBD |
| Valuation Premise - 2 | TBD | Text/Select | TBD |
| Appraised Value - 1 | TBD | Number/Currency | TBD |
| Appraised Value - 2 | TBD | Number/Currency | TBD |
| Test1 | TBD | TBD | TBD |

---

## 🔗 Related Documentation

- **Custom Field Integration Workflows:** (To be located)
- **Valcre API Documentation:** Custom Fields section
- **Database Schema:** `supabase/migrations/`
- **Edge Function:** `supabase/functions/create-valcre-job/index.ts`

---

## ⚠️ Notes

- **Status:** This is future work - do not implement until ClickUp and LOE testing is complete
- **Priority:** Medium - important but not blocking current workflow
- **Dependencies:** Requires review of existing custom field integration documentation

---

## 📅 Timeline

- **Created:** January 8, 2026
- **Planned Start:** After ClickUp integration testing complete
- **Estimated Effort:** TBD (after reviewing existing workflows)
