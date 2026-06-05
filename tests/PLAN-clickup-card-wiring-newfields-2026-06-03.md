---
content_type: wiring-plan
status: draft-pending-QA-routing-map
created: 2026-06-03
author: react-specialist
related: [JOB-PREP-FIELDS-MAP-2026-06-03.md]
targets:
  - supabase/functions/update-clickup-task/index.ts  (Stage-2 card — primary)
  - supabase/functions/create-clickup-task/index.ts   (Stage-1 card — no change proposed)
---

# ClickUp Card Wiring Plan — New Job-Prep Fields

**HOLD:** edits + deploy gated on QA's field-routing map (which fields → ClickUp vs LOE-only).
This doc maps WHERE each ClickUp-bound field would slot. Final inclusion = QA map.

## Architecture finding (drives everything)

- **Stage-1** (`create-clickup-task`) fires at **job creation**, before the LOE-Quote fields are
  filled. New job-prep fields would render **blank** there → do NOT wire new fields into Stage-1.
- **Stage-2** (`update-clickup-task`) fires on the LOE/Valcre update, AFTER fields are filled.
  It reads `job_loe_details(*)` as `loeDetails.*` and rebuilds the card as
  `updatedStage1 + stage2Section`. **All new fields slot into `stage2Section`** (lines ~204-225).
- All 15 new columns already exist on `job_loe_details` (added 2026-06-03), so Stage-2 can read
  them with zero schema work. Field names below are the snake_case DB columns.

## Proposed slots in `stage2Section` (update-clickup-task/index.ts)

Current Stage-2 block has: PROPERTY VALUATION (Property Rights, Scope of Work, Report Type),
FINANCIAL DETAILS (Fee, Retainer, Delivery Date, Payment Terms), APPRAISER NOTES.

| New field (DB col) | Proposed card section | Render note | Routing recommendation |
|---|---|---|---|
| `report_format` | PROPERTY VALUATION (after Report Type) | `Comprehensive/Concise/Form` | ClickUp ✓ (task-relevant) |
| `analysis_level` | PROPERTY VALUATION | text | ClickUp likely |
| `value_scenarios` | PROPERTY VALUATION | comma-string → render as-is | **QA call** — may be LOE-doc detail |
| `purpose` | PROPERTY VALUATION | text | **QA call** — LOE-doc detail likely |
| `authorized_use` | PROPERTY VALUATION | ⚠ may duplicate Stage-1 "Use:" (job.intended_use) | **QA call** — dedupe risk |
| `assignment_type` | new ASSIGNMENT block | `Single/Multiple Properties` | ClickUp likely |
| `job_status` | new ASSIGNMENT/STATUS block | text | ClickUp ✓ (workflow status) |
| `transaction_status` | new ASSIGNMENT/STATUS block | `Listed/Under Contract/NA` | ClickUp likely |
| `zoning_status` | new ASSIGNMENT/STATUS block | text | **QA call** — LOE-doc detail likely |
| `desktop_report` | new ASSIGNMENT/STATUS block | Yes/No | ClickUp likely |
| `cmhc_financing` | new ASSIGNMENT/STATUS block | Yes/No | ClickUp likely (CA flag) |
| `lead_appraiser` | new ASSIGNMENT block | text | ClickUp ✓ (assignment) |
| `effective_date` | FINANCIAL/DATES block | `formatDate()` | **QA call** — LOE-doc detail |
| `request_date` | DATES block | `formatDate()` | **QA call** — overlaps received |
| `signed_date` | DATES block | `formatDate()` | ⚠ overlaps Stage-1 "▸ LOE Signed" tracker (docuseal-fed) |

Property Rights is already on the card (`property_rights_appraised`); now a comma-string after the
multi-select change — renders fine, no change needed.

## Proposed new card sub-sections (only the QA-confirmed fields get rendered)

```
**PROPERTY VALUATION**
• Property Rights:  ...        (exists)
• Scope of Work:    ...        (exists)
• Report Type:      ...        (exists)
• Report Format:    ...        (new)
• Analysis Level:   ...        (new, if routed)
• Value Scenarios:  ...        (new, if routed)
...

**ASSIGNMENT**
• Job Status:        ...
• Assignment Type:   ...
• Lead Appraiser:    ...
• Transaction Status:...
• Desktop Report:    ...
• CMHC Financing:    ...

**KEY DATES**
• Effective Date:    ...
• Request Date:      ...
• Signed Date:       ...
```

Each line uses the existing `${loeDetails.<col> || ''}` pattern; dates via `formatDate()`.

## Flags (pre-existing issues found while reading the builders)

1. **Stale hardcoded token in update-clickup-task** (line 79): same dead literal
   `pk_10791838_TPNA2KDR…` I removed from create-clickup-task. The dev fallback will 401 if
   reached. Recommend the same fix (drop literal, read secret only) when we touch this file.
2. **No env pin in update-clickup-task** — uses `CLICKUP_ENV` (currently `production`) →
   Valta workspace + `CLICKUP_API_TOKEN_VALTA`. Stage-2 currently targets Chris's prod workspace,
   while Stage-1 (create) is pinned to Ben's test list. For an end-to-end test on Ben's test card,
   Stage-2 would also need pinning to dev. **Flag — confirm test vs prod intent before wiring.**
3. **Dedup risks to resolve in the map:** `authorized_use` vs Stage-1 "Use:" (job.intended_use);
   `signed_date` vs the docuseal-fed "▸ LOE Signed" tracker line.

## What I need to proceed

QA's field-routing map (ClickUp vs LOE-only per field). Then I wire ONLY the ClickUp-bound ones
into `stage2Section`, apply the token/pin fixes if we're testing on Ben's card, and deploy.
