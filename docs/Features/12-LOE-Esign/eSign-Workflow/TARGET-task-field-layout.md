# Target — field group order for the task (clean names, manual-sort)

Field NAMES stay clean — NO number prefixes. The ORDER is set by ClickUp's Manual sort: flip the Custom Fields ClickApp to Manual, then drag the fields into the order below in the Custom Field Manager. (Renaming does NOT reliably control order — see the roadmap.) Keep every field's type + drop-down options; the team fills groups 6–9, the dashboard feeds groups 1–5.

```
 GROUP                 FIELDS (in order, clean names)
 ────────────────────  ──────────────────────────────────────
 Dates                 Received Date · LOE Sent · LOE Signed · Delivery Date
 Job                   APR Dashboard Link · Valcre Job · Job Number
 Client                Client Full Name · Client Email · Client Phone · Client Organization
 Property              Property Name · Property Address · Property Type
 Property Contact      Contact Name · Contact Email · Contact Phone
 Appraisal Scope       Property Subtype · Interest Appraised · Authorized Use ·
                       State of Improvements · Status of Improvements ·
                       Approaches To Value · Value Scenario(s) · Report Type · Inspection Date
 Site / Transaction    Transaction Status · Zoning Status · Land $/Metric
 Team & Workflow       Phase Owner · Work Phase · Client Info Received · Invoice Paid ·
                       TTSZ Done · Template Saved · Photos Saved · Comps Provided
 Notes                 Notes · Task Type
```

Optional: PIN the fields so the order holds on real tasks (ClickUp floats filled/pinned fields toward the top).

Status tags (separate from fields — the job-state pipeline, at the Space level):
new arrival → loe sent → loe signed → awaiting payment → paid, plus an apr hub tag.
