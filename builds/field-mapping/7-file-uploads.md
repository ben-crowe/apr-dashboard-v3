# File Uploads & Storage

> Current state of file handling across the APR system + planned integrations.

---

## Client Upload (Intake Form)

| Detail | Value |
|--------|-------|
| Location on form | "Required Documents" section at bottom |
| Input type | `<input type="file">` with "Choose Files" button |
| Multiple files | Yes |
| Accepted types | All file types (no restriction currently) |
| Size limit | No explicit limit (Supabase default: 50MB per file) |
| Required | Not enforced — form submits without files |

### Documents Requested

| Document | Description |
|----------|-------------|
| Full Property Details or Prior Appraisal | Primary document |
| Additional Relevant Documentation | Supporting docs |
| Environmental/Geotechnical Reports | If available |
| Existing Floor Plans or Site Plans | If available |
| Current/Previous Leases or Financials | If available |
| Condo/Strata Documentation (if applicable) | If applicable |

---

## Supabase Storage

| Detail | Value |
|--------|-------|
| Bucket | `job-files` |
| Path structure | `{job_id}/{filename}` |
| Table | `job_files` |
| Columns | id, job_id, file_name, file_path, file_size, mime_type, uploaded_at |
| Row count | 10 files across all jobs |
| Access | Authenticated (Supabase RLS) |

### Upload Flow

```
Client selects files on form
    │
    ├─► Files uploaded to Supabase Storage bucket `job-files`
    │     Path: {job_id}/{original_filename}
    │
    ├─► Record created in `job_files` table
    │     Links file to job via job_id
    │
    └─► Dashboard shows files in "Uploaded Documents" section
          with file name, size, and download link
```

---

## Dashboard Display

| Section | Where |
|---------|-------|
| Client-uploaded files | Section 1: "UPLOADED DOCUMENTS" under Client Information |
| Appraiser documents | Section 5: "Document Upload & Organization" |

### Section 1 — Uploaded Documents

- Shows files uploaded by the client at submission
- "Upload Files" button for appraiser to add more
- Displays: file name, "No files uploaded yet" if empty

### Section 5 — Document Upload & Organization

8 document categories with source buttons + upload:

| Document | Source Button | Purpose |
|----------|-------------|---------|
| Land Title Certificate | Search SPIN2 | Title search |
| Survey Certificate/RPR | Search SPIN2 | Survey |
| Tax Assessment Notice | Tax Portal | Tax records |
| Aerial Photo | Google Satellite | Aerial view |
| Zoning Map | City Zoning Map | Zoning verify |
| Flood Map | Flood Map Viewer | Flood risk |
| Building Permits | Permit Search | Permit history |
| Site Plan | Planning Dept | Site layout |

> Each document has a source button (opens external site) and an Upload button (saves to Supabase).

---

## Valcre

| Detail | Status |
|--------|--------|
| Files sent to Valcre | No — not currently implemented |
| Valcre file API | Exists (`/api/v1/Jobs({id})/Files`) but not wired |
| Plan | Not prioritized — files stay in Supabase |

---

## ClickUp

| Detail | Status |
|--------|--------|
| Files attached to tasks | No — not currently implemented |
| Box Folder field | Chris has a "Box Folder" URL field on ClickUp tasks |
| Pattern | Team manually links Box folder URL after job setup |

---

## Planned: SharePoint / OneDrive Integration

| Detail | Plan |
|--------|------|
| Platform | Microsoft SharePoint (valtapropertyvaluations.sharepoint.com) |
| Auth | Microsoft Graph API + OAuth2 |
| Folder structure | Per-job folders: `/{VAL_number} - {Property_Name}/` |
| Auto-create | On Valcre job creation, create SharePoint folder |
| Sync | Upload client files from Supabase to SharePoint folder |
| Link back | Store SharePoint folder URL on dashboard + ClickUp task |
| Status | **Not built** — in integration roadmap (commit 98ceff5) |
| Priority | After ClickUp verify, before Pipedrive |

### Planned Flow

```
Current:
  Client uploads → Supabase Storage → Dashboard view only

Future:
  Client uploads → Supabase Storage → Dashboard view
                                     → SharePoint folder (auto-sync)
                                     → ClickUp task (folder URL)
                                     → Valcre job (optional)
```

---

## File Count Summary

| Location | Current | Planned |
|----------|---------|---------|
| Supabase Storage | 10 files | Primary store |
| Dashboard | View + upload | No change |
| Valcre | None | Optional future |
| ClickUp | None (Box URL only) | SharePoint URL |
| SharePoint | Not built | Auto-created per job |

---

*Files currently live only in Supabase. The SharePoint integration is the key planned improvement — gives the Valta team access to job files in their existing Microsoft ecosystem without logging into the APR Dashboard.*
