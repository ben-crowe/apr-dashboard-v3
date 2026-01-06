# APR Dashboard: 4-Stage Pipeline

> **Read time:** 2 minutes
> **Purpose:** Understand how the full system works

---

## The Four Stages

```
STAGE 1: CLIENT INTAKE -----> STAGE 2: JOB MGT & LOE -----> STAGE 3: E-SIGNATURE -----> STAGE 4: REPORT BUILDER
   /                          /dashboard/job/:jobId          DocuSeal                    /mock-builder
   job_submissions            job_loe_details                Signed LOE                  (944+ fields)
                              job_property_info
```

### Stage 1: Client Intake
- **Route:** Public form submission
- **Data:** Client info, property address, appraisal type
- **Table:** `job_submissions`

### Stage 2: Job Management & LOE
- **Route:** `/dashboard/job/:jobId`
- **Data:** Letter of Engagement details, property research
- **Tables:** `job_loe_details`, `job_property_info`

### Stage 3: E-Signature
- **Integration:** DocuSeal
- **Data:** Signed Letter of Engagement
- **Flow:** LOE sent, client signs, work begins

### Stage 4: Report Builder
- **Route:** `/mock-builder` (future: `/dashboard/job/:jobId/report`)
- **Data:** 944 fields across 30+ sections
- **Output:** Complete appraisal report

---

## Current Integration Status

| Stage | Status | Notes |
|-------|--------|-------|
| 1 -> 2 | Working | Job submissions flow to job management |
| 2 -> 3 | Working | LOE generation and e-signature |
| 3 -> 4 | **BROKEN** | Report Builder is disconnected |

**Gap:** Report Builder does not receive data from Stages 1-3. No persistence layer.

---

## Data Flow (Target State)

```
Client submits form
    |
    v
job_submissions table
    |
    v
Appraiser reviews, creates LOE
    |
    v
job_loe_details + job_property_info
    |
    v
DocuSeal sends LOE, client signs
    |
    v
Appraiser opens Report Builder
    |
    v
Job data pre-populates "Home" section
    |
    v
Appraiser completes report
    |
    v
report_builder_data table (persisted)
    |
    v
PDF generation
```

---

## Key Integration Work Pending

1. **Database:** Create `report_builder_data` table
2. **Route:** Add `/dashboard/job/:jobId/report`
3. **Bridge:** Pull job data into Report Builder "Home" section
4. **Persistence:** Auto-save with 2-second debounce
5. **Locking:** Prevent edits to fields that come from earlier stages

---

## File References

| Document | Path |
|----------|------|
| Full ecosystem details | `docs/bc research & notes/FULL-ECOSYSTEM-INTEGRATION.md` |
| Mission and phases | `docs/bc research & notes/ORCHESTRATOR-CONTEXT.md` |
| Hybrid execution plan | `docs/APR-Hybrid-Execution-Plan.md` |

---

*This is a summary. For deep technical details, see the referenced documents.*
