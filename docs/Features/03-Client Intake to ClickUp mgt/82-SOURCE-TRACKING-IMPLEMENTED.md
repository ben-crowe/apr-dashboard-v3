# Source Tracking & Tagging System - Implementation Complete

**Date:** January 8, 2026  
**Status:** ✅ Implemented

---

## What Was Added

### 1. Database Schema
- ✅ `source` column - Tracks how job was created
- ✅ `tags` column - JSONB array for flexible tagging
- ✅ `source_metadata` column - Additional context (referrer, user agent, etc.)
- ✅ Indexes for performance
- ✅ Constraints for data integrity

### 2. Code Updates
- ✅ Manual job creation sets `source: 'manual'`
- ✅ Webform submission sets `source: 'webform'`
- ✅ ClickUp task shows different label based on source

---

## ClickUp Task Labels

**Webform Submission:**
```
New Client Request Received:  26.01.08 / 7:50 PM
```

**Manual Creation:**
```
Job Created Manually:  26.01.08 / 7:50 PM
```

**Future Sources:**
- API: `Job Created via API`
- Import: `Job Imported`
- CRM: `Job Created via CRM`

---

## Usage Examples

### Filter by Source
```sql
-- Get all manual jobs
SELECT * FROM job_submissions WHERE source = 'manual';

-- Get all webform submissions
SELECT * FROM job_submissions WHERE source = 'webform';
```

### Filter by Tags
```sql
-- Jobs tagged as 'urgent'
SELECT * FROM job_submissions WHERE tags @> '["urgent"]'::jsonb;

-- Jobs with multiple tags
SELECT * FROM job_submissions 
WHERE tags ?| array['urgent', 'repeat-client'];
```

### Add Tags (via code)
```typescript
await supabase
  .from('job_submissions')
  .update({ tags: ['urgent', 'repeat-client'] })
  .eq('id', jobId);
```

---

## Migration

**File:** `supabase/migrations/20260108_add_source_and_tags.sql`

**Run:**
```bash
supabase db reset  # Development
# Or apply migration in production
```

**Backfill:**
- All existing jobs set to `source: 'webform'`
- Empty tags arrays
- Empty source_metadata

---

## Future Enhancements

### Phase 2: Tag Management UI
- Add/remove tags in dashboard
- Tag suggestions/autocomplete
- Tag-based filtering in job list

### Phase 3: CRM Integration
- Hierarchical tags
- Tag-based workflows
- Reporting by source/tags
- Client segmentation

---

## Files Modified

1. **Database:**
   - `supabase/migrations/20260108_add_source_and_tags.sql` (new)

2. **Frontend:**
   - `src/components/dashboard/job-list/JobListTitle.tsx` (updated)
   - `src/components/submission-form/useFormSubmission.ts` (updated)

3. **Backend:**
   - `supabase/functions/create-clickup-task/index.ts` (updated)

---

**Status:** ✅ Ready for use - Migration needed to activate!
