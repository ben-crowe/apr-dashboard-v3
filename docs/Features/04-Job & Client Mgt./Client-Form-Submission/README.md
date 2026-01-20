# Client Form Submission

**Status:** ✅ **FULLY IMPLEMENTED & DEPLOYED**
**Production URL:** https://apr-dashboard-v3.vercel.app
**Last Updated:** November 5, 2025

---

## Overview

Client-facing appraisal request form embedded from Valta Website via iframe. **Single source of truth architecture** - the form lives on Valta Website, and APR Dashboard embeds it. Both projects share the same Supabase database for seamless integration.

---

## Quick Navigation

### 📋 [01-FORM-FIELD-MAPPING.md](./01-FORM-FIELD-MAPPING.md)
**Complete field-by-field reference**
- All 14 form fields with types and validation
- Dropdown options for all select fields
- Database column mapping
- Extracted from live production code

### 📧 [02-EMAIL-NOTIFICATION-FLOW.md](./02-EMAIL-NOTIFICATION-FLOW.md)
**Email architecture and configuration**
- How notifications are triggered
- Test mode vs production routing
- Resend API configuration
- Email content structure and timing

### 🔧 [03-INTEGRATION-ARCHITECTURE.md](./03-INTEGRATION-ARCHITECTURE.md)
**Technical implementation details**
- Iframe embedding pattern
- Shared database architecture
- Environment configuration
- Testing procedures and troubleshooting

---

## Architecture At A Glance

```
┌────────────────────┐
│  APR Dashboard     │  Embeds form via iframe
│  (Display Layer)   │  Reads from database
└────────────────────┘
         │
         │ ?embedded=true
         ↓
┌────────────────────┐
│  Valta Website     │  Owns the form
│  (Form Owner)      │  Handles submission
└────────────────────┘  Writes to database
         │              Triggers email
         ↓
┌────────────────────┐
│  Supabase DB       │  Shared by both projects
│  (Single Source)   │  job_submissions table
└────────────────────┘
```

---

## Key Features

✅ **Single Source of Truth** - Form on Valta Website, embedded everywhere
✅ **Test Mode Toggle** - Easy switching with `?test=true` parameter
✅ **Shared Database** - Both projects read/write same Supabase instance
✅ **Auto-Notifications** - Email sent immediately on submission
✅ **UUID Job IDs** - No conflicts, globally unique identifiers

---

## Quick Links

**Production Form (Standalone):**
https://valta.ca/request-appraisal/intake

**Production Form (Embedded in Dashboard):**
https://apr-dashboard-v3.vercel.app/submission-form

**Test Mode (Safe to use in production):**
https://apr-dashboard-v3.vercel.app/submission-form?test=true

---

## Related Sections

**Downstream Integrations (What happens after submission):**
- **03-ClickUp-Integration** - Auto-creates task with job details
- **06-LOE-Generator** - Uses form data to build engagement letter
- **07-Valcre-Integration** - Syncs when Valcre job number assigned
- **08-Client-Email-Sequence** - Triggers follow-up workflow

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Form Functionality | ✅ Live | All fields working |
| Iframe Embedding | ✅ Live | Embedded in Dashboard |
| Database Integration | ✅ Live | Shared Supabase instance |
| Email Notifications | ✅ Live | Resend API configured |
| Test Mode | ✅ Live | `?test=true` parameter working |
| Domain Verification | ⏳ Pending | Awaiting valta.ca DNS setup |

---

## Pending Items

**⏳ Email Domain Verification**
- Production emails currently go to bc@crowestudio.com
- After DNS setup: clientcare@valta.ca
- Requires SPF, DKIM, and verification TXT records

---

## Documentation Structure

This section follows the **focused files** pattern:
- **README.md** (this file) - Overview and navigation
- **01-** - Field mapping (what's in the form)
- **02-** - Email flow (what happens after submit)
- **03-** - Integration architecture (how it all works)

Each file is self-contained and focused on one aspect of the system.

---

**This section is production-ready and fully operational.**
