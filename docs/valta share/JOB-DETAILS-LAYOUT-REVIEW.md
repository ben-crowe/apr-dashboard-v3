# Job Details Field Layout — Review & Questions

**Date:** 2026-04-02
**Status:** Needs Ben's input before changes
**Section:** LOE Quote & Valuation Details > Job Details

---

## Current Layout (10 fields, 2 columns)

```
LEFT COLUMN                          RIGHT COLUMN
─────────────────────────────────    ─────────────────────────────────
Property Rights: [dropdown]          Scope of Work: [dropdown]
Payment Terms:   [dropdown]          Appraisal Fee: [$currency]
Report Type:     [dropdown]          Retainer Amount: [$currency]
Retainer Paid:   [date picker]       Amount Paid: [$currency]
Delivery Date:   [date picker]       Paid Date: [date picker]
```

**Problems:**
- Property Rights and Scope of Work are valuation fields mixed with payment fields
- Retainer fields are prominent but Chris doesn't use them
- No logical grouping (dates not together, amounts not together)
- Payment Terms default "On LOE Signature" doesn't match Chris's LOE contract language

---

## Proposed Layout — Option A (paired by type)

```
LEFT COLUMN (dates)                  RIGHT COLUMN (amounts/types)
─────────────────────────────────    ─────────────────────────────────
Report Type:     [dropdown]          Scope of Work: [dropdown]
Payment Terms:   [dropdown]          Appraisal Fee: [$currency]
Delivery Date:   [date picker]       Paid Date: [date picker]
Retainer Paid:   [date picker]       Retainer Amount: [$currency]
```

- Property Rights moved to Card 1 (Client Submission > Property Information) where it belongs per Valcre grouping
- Amount Paid removed as standalone field (it equals Appraisal Fee — redundant?)
- Primary payment pair (Delivery Date + Paid Date, Appraisal Fee) at top
- Secondary retainer pair at bottom (usually empty for Chris)
- 8 fields instead of 10

---

## Proposed Layout — Option B (grouped by purpose)

```
VALUATION (row 1)
Report Type:     [dropdown]          Scope of Work: [dropdown]

FINANCIAL (row 2-3)
Payment Terms:   [dropdown]          Appraisal Fee: [$currency]
Delivery Date:   [date picker]       Paid Date: [date picker]

RETAINER (row 4, secondary/dimmed)
Retainer Paid:   [date picker]       Retainer Amount: [$currency]
```

- Same as Option A but with visual grouping labels
- Retainer row could be collapsible or dimmed since Chris doesn't use it

---

## Open Questions for Ben

### Q1: Appraisal Fee vs Amount Paid — are these the same?
- Appraisal Fee = $6,000 (the total job cost)
- Amount Paid = $6,000 (what the client pays — which is the fee)
- Currently both are separate fields on the dashboard
- **Do we need both?** Or is Amount Paid redundant since it always equals the fee?
- If they're the same: remove Amount Paid, just use Appraisal Fee
- If different: when would Amount Paid differ from Appraisal Fee?

### Q2: Payment Terms dropdown options
Current options:
1. On LOE Signature (current default)
2. NET 30 Days
3. On Completion

Chris's LOE contract says: "due upon receipt... delinquent if not paid within five (5) days"

**Proposed new options:**
1. **Due Upon Receipt** (new default — matches Chris's LOE language)
2. NET 30 Days (keep)
3. On Completion (keep)
4. On LOE Signature (keep but not default)

### Q3: Property Rights — move to Card 1?
- Valcre puts it in the Report tab (with Report Type, Scope of Work)
- Our Card 1 (Client Submission) has Property Type, Authorized Use, Valuation Premises
- Property Rights logically belongs there, not in the payment section
- **Move it?** Or leave it in Job Details?

### Q4: Comments — how many blocks?
Currently 3 comment blocks:
1. Appraiser Comments (general/internal)
2. Delivery Comments
3. Payment Comments

Chris's LOE has no payment-specific comments field. **Remove Payment Comments?** Or keep for internal use?

### Q5: Retainer fields — keep visible or collapse?
Chris doesn't use retainer tracking. Two options:
- Keep visible but at bottom (secondary)
- Hide behind a "Show Retainer" toggle
- Remove entirely (data stays in DB, just not shown)

---

## Dropdown Options Reference

### Payment Terms
| Option | Source |
|--------|--------|
| Due Upon Receipt | Chris's LOE contract |
| NET 30 Days | Original build |
| On Completion | Original build |
| On LOE Signature | Original build (was default) |

### Report Type
| Option | Source |
|--------|--------|
| Appraisal Report | Default (Chris uses this) |
| Full Narrative Report | Original build |

### Scope of Work
| Option | Source |
|--------|--------|
| All Applicable | Default |
| Income Approach | Added |
| Direct Comparison | Added |
| Cost Approach | Added |

### Property Rights
| Option | Source |
|--------|--------|
| Fee Simple Interest | Default |
| Leased Fee Interest | Added |
| Leasehold Interest | Added |

---

## What's NOT changing (confirmed working)

- Job Information section (Job Number, ClickUp Task) — stays as-is
- Comments section — stays unless Ben says to reduce
- LOE preview/send flow — working
- Valcre sync — working (stale job ID on test data, not a code issue)
- Test Data button logic — payment = fee, retainer = 0, dates calculated

---

---

## ClickUp Integration — Questions & Status

**Full spec at:** `builds/field-mapping/10-clickup-workflow-sync-spec.md`

### What Chris's ClickUp Board Looks Like

Chris's production Valta Jobs board has **~48 custom fields** organized as columns. His team uses this as their daily workflow dashboard. Key field groups:

**Workflow Checkboxes (6)** — color-coded progress tracking:
- 1.1 Client Info Received
- 1.2 Invoice Paid
- 1.3 TTSZ Done (Tax/Title/SitePlan/Zoning)
- 2.1 Template Saved
- 2.2 Photos Saved
- 2.3 Comps Provided

**Job Data Dropdowns (15)** — same data as our dashboard:
- Property Type, Subtype, Interest Appraised, Authorized Use
- State/Status of Improvements, Approaches to Value
- Value Scenarios, Report Type, Desktop Report
- Transaction Status, Zoning Status, Land Metric
- Plus dates and financial fields

**Links (5)** — URLs to external systems:
- Valcre Job, Box Folder, LOE Contract, CRM Deal, APR Dashboard

### Current State

| Metric | Status |
|--------|--------|
| Fields auto-filled on ClickUp task creation | 7 of 48 |
| Fields live-synced when dashboard changes | 0 |
| Workflow checkboxes on our dashboard | 0 |
| Double-entry eliminated | ~15% |

### Open Questions — ClickUp

### Q6: Are we building toward replacing ClickUp or syncing with it?
- **Option A: Sync** — Keep ClickUp as Chris's daily view, auto-populate from our dashboard so no double-entry. Phases 1-2 from the spec.
- **Option B: Replace** — Build a board/list view on our dashboard that mirrors ClickUp's layout. Chris stops opening ClickUp. Phases 3-4 from the spec.
- The INBOX item #10 (APR Dashboard → Full ClickUp Replacement Roadmap) suggests Replace is the long-term goal.
- **What does Chris want?** Does he want to keep ClickUp or move to our dashboard?

### Q7: Workflow checkboxes — manual or automated?
- Chris's team manually checks these boxes as they complete steps
- Some could be auto-checked (Client Info Received = auto on form submit, Invoice Paid = auto when Amount Paid is set)
- Others are inherently manual (TTSZ Done, Photos Saved, Comps Provided)
- **Should we add these checkboxes to our dashboard?** If yes, should they sync to ClickUp or replace it?

### Q8: Payment Terms in ClickUp
- Chris has a "z. Payment Terms" dropdown field on ClickUp (field #22)
- We have a Payment Terms dropdown on our dashboard
- **Do the options match?** Our options: Due Upon Receipt, NET 30 Days, On Completion, On LOE Signature
- Need to check Chris's ClickUp dropdown options to make sure they align

### Q9: Which ClickUp phase is next?
The spec proposes 4 phases:
1. **Phase 1:** Expand task creation from 7 → 21 auto-filled fields (quick win)
2. **Phase 2:** Live sync — field changes on dashboard push to ClickUp in real-time
3. **Phase 3:** Workflow checkboxes on our dashboard
4. **Phase 4:** Board view on our dashboard (replaces ClickUp)

**Which phase should we prioritize?** Phase 1 is the easiest and eliminates the most double-entry.

### Q10: 3.1 Disbursement field in ClickUp
- Chris has a "3.1 Disbursement" number field on ClickUp
- This is likely the retainer/disbursement percentage
- We have `disbursement_percentage` in our DB but it's not actively used
- **Is this the retainer percentage?** If so, what value does Chris typically use?

---

## Next Steps

1. Ben reviews this doc and answers Q1-Q10
2. We implement the approved layout changes
3. ClickUp phase decision determines next feature work
4. Quick QA cycle on any changes
