# API Reference

## Valcre Integration

**Base URL:** `https://api.valcre.com/v1`

### Authentication

Uses API key in request headers:
```
X-API-Key: [your_valcre_api_key]
```

### Endpoints

#### Create Job
```
POST /jobs
Content-Type: application/json

{
  "Name": "Property Name",
  "ClientName": "Client Name",
  "PropertyAddress": "123 Main St",
  "Retainer": 3000,
  "AppraisalFee": 5000,
  ...
}
```

#### Update Job
```
PATCH /jobs/{jobId}
Content-Type: application/json

{
  "Retainer": 3500,
  "AppraisalFee": 5500,
  ...
}
```

#### Get Job
```
GET /jobs/{jobId}
```

### Field Name Conventions

- Use PascalCase for field names (e.g., `Retainer`, not `retainer_amount`)
- Currency fields: Send as numbers without $ or commas
- Dates: ISO 8601 format (`YYYY-MM-DD`)

---

## Supabase

**Project ID:** `[your_project_id]`
**URL:** `https://[project-id].supabase.co`

### Tables

#### job_submissions
Main form submissions table
- `id` (uuid, primary key)
- `job_number` (text) - Valcre job number
- `valcre_job_id` (integer) - Valcre internal ID
- `property_name`, `property_address`, etc.
- `created_at`, `updated_at`

#### job_loe_details
Line of effort / quote details
- `id` (uuid, primary key)
- `job_id` (uuid, foreign key to job_submissions)
- `job_number` (text) - Valcre job number
- `appraisal_fee`, `retainer_amount`, etc.
- `created_at`, `updated_at`

### RLS Policies

Row Level Security is enabled on all tables.
Public access allowed for authenticated operations.

---

## ClickUp Integration

**API URL:** `https://api.clickup.com/api/v2`

### Create Task
```
POST /list/{list_id}/task
Authorization: Bearer [clickup_api_key]

{
  "name": "VAL123456 - Property Name",
  "description": "Client: ...",
  ...
}
```

### Update Task
```
PUT /task/{task_id}
Authorization: Bearer [clickup_api_key]
```

---

## Environment Variables Required

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VALCRE_API_KEY
CLICKUP_API_KEY
CLICKUP_LIST_ID
```
