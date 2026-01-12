# Tagging System & Source Tracking Design

**Date:** January 8, 2026  
**Purpose:** Track job source (manual vs webform) and enable flexible tagging for future CRM/project management

---

## Requirements

1. **Distinguish Creation Source:**
   - Manual creation (dashboard)
   - Webform submission (public form)
   - Future: API, import, etc.

2. **Flexible Tagging System:**
   - Support multiple tags per job
   - Future-proof for CRM expansion
   - Easy filtering/searching

3. **Date Handling:**
   - Manual jobs: Use creation date (when appraiser created it)
   - Webform jobs: Use submission date (when client submitted)

---

## Database Schema Changes

### Add Fields to `job_submissions` Table

```sql
-- Source tracking
ALTER TABLE job_submissions 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'webform',
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS source_metadata JSONB DEFAULT '{}'::jsonb;

-- Constraints
ALTER TABLE job_submissions 
ADD CONSTRAINT valid_source CHECK (source IN ('webform', 'manual', 'api', 'import', 'crm'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_submissions_source ON job_submissions(source);
CREATE INDEX IF NOT EXISTS idx_job_submissions_tags ON job_submissions USING GIN(tags);
```

**Fields:**
- `source`: How the job was created (`webform`, `manual`, `api`, `import`, `crm`)
- `tags`: Array of tags for filtering (`['urgent', 'repeat-client', 'portfolio']`)
- `source_metadata`: Additional context (e.g., `{"ip_address": "...", "referrer": "..."}`)

---

## ClickUp Task Format Updates

### Different Labels Based on Source

**Webform Submission:**
```
New Client Request Received:  26.01.08 / 7:50 PM
```

**Manual Creation:**
```
Job Created Manually:  26.01.08 / 7:50 PM
```

**Future Sources:**
```
Job Created via API:  26.01.08 / 7:50 PM
Job Imported:  26.01.08 / 7:50 PM
```

---

## Tagging Examples

**Common Tags:**
- `urgent` - High priority
- `repeat-client` - Returning client
- `portfolio` - Part of portfolio job
- `referral` - Came from referral
- `cold-call` - From cold outreach
- `website` - From website form
- `linkedin` - From LinkedIn
- `test` - Test job

**Usage:**
```typescript
// Add tags when creating job
tags: ['urgent', 'repeat-client']

// Filter by tags
SELECT * FROM job_submissions 
WHERE tags @> '["urgent"]'::jsonb;

// Search multiple tags
WHERE tags ?| array['urgent', 'repeat-client'];
```

---

## Implementation Plan

### Phase 1: Source Tracking (Immediate)

1. **Add database fields** (migration)
2. **Update manual creation** - Set `source: 'manual'`
3. **Update webform submission** - Set `source: 'webform'`
4. **Update ClickUp task creation** - Use different label based on source

### Phase 2: Tagging System (Short-term)

1. **Add tags field** to database
2. **UI for adding tags** in dashboard
3. **Filter by tags** in job list
4. **ClickUp tags** sync (optional)

### Phase 3: CRM Integration (Future)

1. **Expand source types** (`api`, `import`, `crm`)
2. **Advanced tagging** (hierarchical, custom fields)
3. **Tag-based workflows** (automation)
4. **Reporting** by source/tags

---

## Code Changes Needed

### 1. Manual Job Creation
```typescript
// src/components/dashboard/job-list/JobListTitle.tsx
.insert({
  // ... existing fields
  source: 'manual',
  tags: []
})
```

### 2. Webform Submission
```typescript
// src/components/submission-form/useFormSubmission.ts
.insert({
  // ... existing fields
  source: 'webform',
  tags: [],
  source_metadata: {
    ip_address: req.headers['x-forwarded-for'],
    referrer: document.referrer
  }
})
```

### 3. ClickUp Task Creation
```typescript
// supabase/functions/create-clickup-task/index.ts
const sourceLabel = job.source === 'manual' 
  ? 'Job Created Manually'
  : job.source === 'api'
  ? 'Job Created via API'
  : 'New Client Request Received';

const description = `...
**${sourceLabel}:**  ${formattedDateTime}
...`;
```

---

## Future CRM Benefits

**Tagging enables:**
- Client segmentation (`repeat-client`, `vip`)
- Source tracking (`referral`, `website`, `linkedin`)
- Workflow automation (tag-based triggers)
- Reporting & analytics
- Project grouping (`portfolio`, `multi-property`)

**Source tracking enables:**
- Channel attribution
- Conversion tracking
- ROI analysis by source
- Automated workflows by source

---

## Migration Strategy

1. **Add columns** with defaults (non-breaking)
2. **Backfill existing jobs** - Set `source: 'webform'` for all existing
3. **Update code** to set source on creation
4. **Gradually add tags** as needed

---

**Status:** Design ready - Ready for implementation!
