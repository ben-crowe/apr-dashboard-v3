# Test 5: Integration Status Check

## Integration Indicators on VAL261101 Job

| Integration | Indicator | Status |
|-------------|-----------|--------|
| **Valcre** | "View in Valcre" button, Job Number: VAL261101 | ACTIVE — button enabled |
| **ClickUp** | "View in ClickUp" button present | BROKEN — onclick is noop() (no task ID stored) |
| **DocuSeal** | Submission ID not visible in UI | NOT SHOWN — no visible DocuSeal reference |
| **Email** | Testing mode: bc@crowestudio.com | CONFIGURED — emails route to test address |

## Console Health

| Severity | Message | Impact |
|----------|---------|--------|
| LOG | "VAL Number found in LOE details: VAL261101" | Good — Valcre number loaded from DB |
| LOG | "Default email set to: bc@crowestudio.com (testing mode)" | Good — test mode active |
| LOG | "Found files for job: Array(1)" | Good — file attachment working |
| WARNING | "Documents bucket does not exist" | **Issue** — Supabase storage bucket "documents" missing |
| ERROR | "DialogContent requires DialogTitle" | Minor — accessibility issue in Radix dialog |
| LOG | "Fetching jobs from Supabase..." (x2) | Double fetch on every page load |

## Network Requests

All Supabase API calls returning **200**:

| Endpoint | Status | Purpose |
|----------|--------|---------|
| `job_submissions?select=*&order=created_at.desc` | 200 | List all jobs |
| `job_submissions?select=*&id=eq.{uuid}` | 200 | Load specific job |
| `job_files?select=*&job_id=eq.{uuid}` | 200 | Load job files |
| `job_loe_details?select=*&job_id=eq.{uuid}` | 200 | Load LOE details |
| `job_property_info?select=*&job_id=eq.{uuid}` | 200 | Load property info |
| `storage/v1/bucket` | 200 | Check storage buckets |

**No CORS errors. No 401/403 auth failures. No failed requests.**

## Double Fetch Confirmed

The job_submissions list is fetched twice on every dashboard load (both return 200). Console shows two "Fetching jobs from Supabase..." messages. Likely caused by React StrictMode in development which runs effects twice.

## ClickUp Button Broken on VAL261101

The "View in ClickUp" button renders but its onclick handler is `noop()` — meaning no ClickUp task ID is stored in the database for this job. The button appears clickable but does nothing. This particular job was likely created before the ClickUp integration was fully wired, or the ClickUp task creation failed silently.

## Missing Storage Bucket

Console warning: "Documents bucket does not exist. Please create it manually in Supabase Dashboard." The bucket name is "documents" (separate from "job-files" which works). This may be for a document management feature not yet implemented.

## Summary

- **Supabase:** Fully healthy — all endpoints responding 200
- **Valcre:** Working — VAL number loaded, "View in Valcre" active
- **ClickUp:** Partially broken — button renders but has no task ID (noop)
- **DocuSeal:** Submission ID not surfaced in UI
- **Email:** Test mode active (bc@crowestudio.com)
- **No critical errors** — app is stable
