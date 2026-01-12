# Iframe Form Integration - APR Dashboard

## Overview

Replace the existing testing form (`SubmissionForm.tsx`) with an iframe embedding the **live production form** from the Valta Website. This creates a single source of truth and eliminates code drift.

## Why Iframe Embedding?

**Problem:** Maintaining two separate forms (Dashboard testing form + Website production form) leads to:
- Code drift and inconsistencies
- Validation differences
- Different field requirements
- Maintenance burden

**Solution:** Embed the live website form in the dashboard
- ✅ Testing form IS the production form
- ✅ Zero code drift
- ✅ Same database, validation, email system
- ✅ Any website updates immediately reflect in testing

## Implementation

### Step 1: Replace Existing Testing Form

**Location:** `src/components/SubmissionForm.tsx` (or wherever your testing form lives)

**Replace with:**

```tsx
import { useState } from 'react'

export default function AppraisalTestingForm() {
  const [isTestMode, setIsTestMode] = useState(true)

  // Build URL with embedded and test mode parameters
  const formUrl = `https://valta.ca/request-appraisal/intake?embedded=true${isTestMode ? '&test=true' : ''}`

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Toggle control */}
      <div className="p-4 bg-gray-100 border-b flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isTestMode}
            onChange={(e) => setIsTestMode(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">
            Test Mode {isTestMode && '(emails marked with [TEST])'}
          </span>
        </label>

        <div className="text-sm text-gray-600">
          {isTestMode
            ? 'Emails will have [TEST] prefix and go to bc@crowestudio.com'
            : 'Normal production mode - emails go to clientcare@valta.ca (after domain verified)'}
        </div>
      </div>

      {/* Embedded form iframe */}
      <div className="flex-1">
        <iframe
          src={formUrl}
          className="w-full h-full border-0"
          title="Appraisal Request Form"
          allow="clipboard-write"
        />
      </div>
    </div>
  )
}
```

### Step 2: Update Route/Component References

Find where `SubmissionForm` is imported and used, replace with new `AppraisalTestingForm`.

**Example:**
```tsx
// Before:
import SubmissionForm from '@/components/SubmissionForm'

// After:
import AppraisalTestingForm from '@/components/AppraisalTestingForm'
```

### Step 3: Remove Old Testing Form

Once verified working:
```bash
# Backup the old form first
mv src/components/SubmissionForm.tsx src/components/SubmissionForm.tsx.backup

# After testing, remove backup
rm src/components/SubmissionForm.tsx.backup
```

## URL Parameters Explained

### `?embedded=true`
**What it does:**
- Hides website header/navigation
- Hides "What Happens Next" section
- Hides confirmation/trust indicators section
- Reduces padding for compact display
- Shows ONLY the form fields and submit button

**What it keeps:**
- All form fields and validation
- File upload functionality
- Database submission logic
- Email notification system

### `?test=true`
**What it does:**
- Shows yellow banner: "🧪 TEST MODE - Email will be marked with [TEST] prefix"
- Adds `[TEST]` to email subject line
- Currently both test and production send to `bc@crowestudio.com`
- After domain verification, can route to different recipients

**What it doesn't affect:**
- Form functionality (still works normally)
- Database submissions (still saves to `job_submissions`)
- Form validation (same rules)

## URL Examples

### Normal Website Form (Not for Dashboard)
```
https://valta.ca/request-appraisal/intake
```
Full website experience with header, footer, all sections.

### Embedded Production Mode
```
https://valta.ca/request-appraisal/intake?embedded=true
```
- Shows only form, no website chrome
- Submissions are REAL (not test)
- Email has NO [TEST] prefix
- Goes to production recipient

### Embedded Test Mode (Recommended for Dashboard)
```
https://valta.ca/request-appraisal/intake?embedded=true&test=true
```
- Shows only form with test banner
- Submissions saved to database (REAL)
- Email has [TEST] prefix
- Goes to test recipient (bc@crowestudio.com)

## Database Behavior

**All submissions (test and production) save to:**
- Database: `job_submissions` table in Supabase
- Email: Sent via `send-appraisal-request` edge function
- Files: Uploaded to `job-files` storage bucket
- Metadata: `job_files` table tracks uploads

**Test mode ONLY affects:**
- Email subject prefix (`[TEST]` vs normal)
- Yellow banner visibility on form
- Recipient email address (after domain verified)

**Test submissions are REAL submissions** - they appear in your dashboard job list just like production submissions.

## Email Recipients

**Current State (Both go to Ben):**
```typescript
const recipient = isTestMode ? 'bc@crowestudio.com' : 'bc@crowestudio.com';
```

**After valta.ca domain verified in Resend:**
```typescript
const recipient = isTestMode ? 'bc@crowestudio.com' : 'clientcare@valta.ca';
```

**To change:** Edit in Valta Website project at:
`supabase/functions/send-appraisal-request/index.ts` line 335

## Cross-Origin Considerations

Since dashboard and website are different origins:

**✅ Works Fine:**
- Form loads and displays
- All form interactions
- Database submissions
- File uploads
- Email notifications

**⚠️ Limitations:**
- Can't detect form submission completion from parent (cross-origin security)
- Can't use postMessage between iframe and parent
- Can't auto-redirect or refresh dashboard after submission

**Workaround for Dashboard Refresh:**

Use Supabase Realtime to listen for new `job_submissions`:

```tsx
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeJobUpdates() {
  useEffect(() => {
    const channel = supabase
      .channel('job_submissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_submissions'
        },
        (payload) => {
          console.log('New job submission:', payload.new)
          // Refresh your job list here
          // Or show a toast notification
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}
```

## Testing Checklist

Before removing old form, test:

### Embedded Test Mode
- [ ] Form loads without errors
- [ ] Yellow test banner shows
- [ ] All fields present and functional
- [ ] Property address is required
- [ ] File uploads work
- [ ] Submission saves to database
- [ ] Email sent with `[TEST]` prefix
- [ ] New job appears in dashboard list
- [ ] Dashboard link in email works

### Embedded Production Mode
- [ ] Toggle test mode OFF
- [ ] Test banner disappears
- [ ] Form still works
- [ ] Email sent WITHOUT `[TEST]` prefix
- [ ] Everything else same as test mode

### Toggle Functionality
- [ ] Toggle switches between modes instantly
- [ ] URL updates correctly
- [ ] Iframe reloads with new parameters

## Migration Steps

1. **Backup existing form:** Save `SubmissionForm.tsx` somewhere safe
2. **Create new component:** `AppraisalTestingForm.tsx` with iframe code above
3. **Update imports:** Replace old component references
4. **Test thoroughly:** Use checklist above
5. **Monitor first submissions:** Verify everything works
6. **Remove old form:** Delete backup after confidence

## Benefits Achieved

✅ **Single source of truth** - One form to maintain
✅ **Zero code drift** - Testing always matches production
✅ **Less maintenance** - Changes in one place
✅ **Same validation** - No discrepancies
✅ **Same database** - Consistent data structure
✅ **Easy testing** - Toggle between modes
✅ **Simpler codebase** - Less duplication

## Support

**Website Project (Valta-Website):**
- Form implementation and URL parameters
- Email notification system
- Database schema

**Dashboard Project (APR-Dashboard-v3):**
- Iframe integration (this guide)
- Job list and management
- Dashboard UI

**Questions:** bc@crowestudio.com

---

**Created:** October 16, 2025
**Session:** Iframe embedding implementation
**Related:** Valta-Website `VALTA-WORKFLOW-DOCUMENTATION.md`
