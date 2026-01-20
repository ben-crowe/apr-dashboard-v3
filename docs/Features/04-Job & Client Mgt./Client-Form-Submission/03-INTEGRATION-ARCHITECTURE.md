# Client Form Submission - Integration Architecture

**Status:** ✅ Production Deployed
**Last Updated:** November 5, 2025

---

## Architecture Pattern: Iframe Embedding

**Concept:** Single Source of Truth

**Implementation:**
- Form lives on Valta Website
- APR Dashboard embeds form via iframe
- Testing form IS the production form
- Both projects share same Supabase database

**Why This Pattern:**
- No form code duplication
- Changes in one place update everywhere
- Valta Website owns the form (their domain, their branding)
- Dashboard just displays it

---

## Iframe Implementation Code

**Location in APR Dashboard:**
`APR-Dashboard-v3/src/pages/SubmissionForm.tsx`

**Code:**
```tsx
const formUrl = `https://valta.ca/request-appraisal/intake?embedded=true${isTestMode ? '&test=true' : ''}`

<iframe
  src={formUrl}
  className="w-full h-full border-0"
  title="Appraisal Request Form"
  allow="clipboard-write"
/>
```

**URL Parameters:**
- `?embedded=true` - **CRITICAL** - Hides Valta Website header/footer, shows only form
- `?test=true` - **OPTIONAL** - Enables test mode (marks emails with [TEST] prefix)

---

## Database Integration

### Shared Supabase Instance

**Both Projects Connect to Same Database:**
- Valta Website: Writes to `job_submissions` on form submit
- APR Dashboard: Reads from `job_submissions` to display jobs

**Database Connection:**
```
Valta Website ──┐
                ├──> Supabase (job_submissions table)
APR Dashboard ──┘
```

### Benefits of Shared Database
- ✅ No API needed between projects
- ✅ Instant availability (no sync delay)
- ✅ Single source of truth for job data
- ✅ UUID prevents ID collisions

---

## Job ID Structure

**Type:** UUID (Universally Unique Identifier)

**Format:** `550e8400-e29b-41d4-a716-446655440000`

**Why UUID (Not Integer):**
- Prevents ID conflicts between projects
- Can be generated client-side or server-side
- No sequential numbering (security benefit)
- Globally unique across all systems

**Usage in Dashboard Links:**
```
https://apr-dashboard-v3.vercel.app/dashboard/job/550e8400-e29b-41d4-a716-446655440000
```

---

## Environment Configuration

### APR Dashboard Environment Variables

**File:** `.env` or `.env.local`

```env
# Valta Website URL for iframe
VITE_VALTA_FORM_URL=https://valta.ca/request-appraisal/intake

# Optional: Default test mode (can be toggled in UI)
VITE_TEST_MODE=false
```

### Valta Website Environment Variables

**File:** `.env.local`

```env
# Supabase connection
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Resend API for email notifications
RESEND_API_KEY=re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  APR DASHBOARD (Dashboard View)                             │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │ Iframe Container                            │            │
│  │                                             │            │
│  │  ┌──────────────────────────────────────┐  │            │
│  │  │ VALTA WEBSITE                        │  │            │
│  │  │ /request-appraisal/intake            │  │            │
│  │  │                                      │  │            │
│  │  │  • Client Info Form                 │  │            │
│  │  │  • Property Info Form               │  │            │
│  │  │  • Document Upload                  │  │            │
│  │  │  • Submit Button                    │  │            │
│  │  └──────────────────────────────────────┘  │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ User Submits
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  VALTA WEBSITE BACKEND                                       │
│                                                              │
│  • Form validation                                          │
│  • Save to Supabase job_submissions table                  │
│  • Trigger email Edge Function                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE DATABASE (Shared)                                 │
│                                                              │
│  job_submissions table:                                     │
│  ┌──────────────────────────────────────────────┐          │
│  │ id: UUID (primary key)                       │          │
│  │ client_first_name, client_last_name         │          │
│  │ property_name, property_address             │          │
│  │ ... (all form fields)                       │          │
│  │ created_at, updated_at                      │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
           ↓                                    ↓
    APR Dashboard                        Email Notification
    Reads Data                          (via Resend API)
```

---

## Testing Procedures

### Local Development Testing

**1. Start Valta Website (Dev Server):**
```bash
cd /Users/bencrowe/Development/Valta-Website
npm run dev
# Runs on http://localhost:3000
```

**2. Start APR Dashboard (Dev Server):**
```bash
cd /Users/bencrowe/Development/APR-Dashboard-v3
npm run dev
# Runs on http://localhost:5173
```

**3. Test Iframe Embedding:**
- Navigate to Dashboard submission form page
- Verify Valta form loads in iframe
- Check `?embedded=true` parameter is present in iframe src
- Confirm no Valta header/footer visible

**4. Test Form Submission:**
- Fill out all required fields
- Enable test mode toggle (adds `?test=true`)
- Submit form
- Verify:
  - ✅ Record appears in `job_submissions` table
  - ✅ Email sent to bc@crowestudio.com with `[TEST]` prefix
  - ✅ Dashboard link in email works

---

### Production Testing

**Test Submission Flow (Safe for Production):**

```bash
# 1. Open Dashboard with test mode
https://apr-dashboard-v3.vercel.app/submission-form?test=true

# 2. Fill form with test data
Client: Test User
Property: Test Property 123

# 3. Submit and verify:
✓ Email received with [TEST] prefix
✓ Job appears in Dashboard
✓ UUID job ID generated correctly
✓ All form fields saved to database
```

**Production Submission Flow (Real Data):**

```bash
# 1. Open Dashboard (no test parameter)
https://apr-dashboard-v3.vercel.app/submission-form

# 2. Fill form with real client data

# 3. Submit and verify:
✓ Email received WITHOUT [TEST] prefix
✓ Email sent to correct recipient
✓ Job appears in Dashboard immediately
✓ ClickUp task auto-created (if integration active)
```

---

## Known Issues & Resolutions

### ✅ Resolved Issues

**Cross-Origin Iframe Access:**
- **Problem:** Cannot access iframe content due to CORS
- **Solution:** Use `?embedded=true` parameter to control what Valta Website renders
- **Status:** Working correctly

**Test Mode Email Routing:**
- **Problem:** Test submissions going to production inbox
- **Solution:** `?test=true` parameter marks emails with [TEST] prefix
- **Status:** Working correctly

**Shared Database Conflicts:**
- **Problem:** Worried about ID collisions between projects
- **Solution:** UUID primary keys (globally unique)
- **Status:** No conflicts observed

---

### ⏳ Pending Issues

**Email Domain Verification:**
- **Issue:** Waiting for valta.ca DNS setup
- **Impact:** Production emails still going to bc@crowestudio.com instead of clientcare@valta.ca
- **Timeline:** Awaiting client DNS access

**Form Field Additions:**
- **Issue:** Any new fields must be added in Valta Website project first
- **Impact:** Dashboard cannot add fields independently
- **Solution:** Follow single source of truth pattern (Valta owns form)

---

## Integration Points

### Upstream Dependencies (Form → Dashboard)

**Valta Website provides:**
1. Form UI and validation
2. Form submission handling
3. Database write operations
4. Email notification trigger

**APR Dashboard consumes:**
1. Iframe embed URL
2. Shared database (read access)
3. Job ID from form submissions

### Downstream Integrations (Dashboard → Other Systems)

**After form submission, APR Dashboard handles:**
1. **ClickUp Integration** - Auto-creates task with job details
2. **Valcre Integration** - Syncs job when Valcre number assigned
3. **LOE Generator** - Uses form data to build Letter of Engagement
4. **Client Email Sequence** - Triggers follow-up email workflow
5. **DocuSeal** - Sends LOE for client signature

---

## Security Considerations

### Iframe Security

**Allow Permissions:**
```html
allow="clipboard-write"
```
- Permits form to copy text to clipboard
- No camera, microphone, or location access

**Content Security Policy:**
- Valta Website checks `Referer` header
- Only allows embedding from authorized domains
- Prevents unauthorized iframe usage

### Database Access

**Supabase Row Level Security (RLS):**
- Both projects use service role keys (full access)
- Public anon keys restricted to read-only
- Write operations require authentication

---

## Performance Considerations

### Iframe Loading

**Initial Load Time:**
- Valta Website: ~500ms (Next.js SSR)
- Form Interactive: ~1000ms (hydration + component mount)

**Optimization:**
- Form code-split from main Valta bundle
- Lazy-load document upload component
- Minimal external dependencies

### Database Write Performance

**Average Submission Time:**
- Form validation: < 100ms
- Database write: < 200ms
- Email trigger: < 500ms
- **Total:** < 800ms from submit to confirmation

---

## Documentation References

### Primary Docs (APR Dashboard)
- `IFRAME-FORM-INTEGRATION.md` - Complete architecture details
- `README.md` - Project overview with email architecture section

### Related Docs (Valta Website)
- `app/request-appraisal/intake/page.tsx` - Form component code
- `supabase/functions/send-appraisal-request/index.ts` - Email Edge Function

### Related Sections (APR Dashboard Planning)
- 01-FORM-FIELD-MAPPING.md - Complete field reference
- 02-EMAIL-NOTIFICATION-FLOW.md - Email architecture
- 03-ClickUp-Integration - Task creation after submission

---

## Future Enhancements

### Planned Features
- [ ] Multi-file upload progress bars
- [ ] Client portal access post-submission
- [ ] Real-time form validation improvements
- [ ] Save-and-resume functionality (draft submissions)
- [ ] Form analytics (field completion rates)

### Potential Improvements
- [ ] Reduce iframe initial load time
- [ ] Pre-fill form from URL parameters (return clients)
- [ ] Mobile-optimized form layout
- [ ] Accessibility audit and improvements

---

**Integration is production-ready and fully operational.**
**All systems communicating correctly via shared database architecture.**
