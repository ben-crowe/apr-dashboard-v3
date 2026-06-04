---
content_type: reference
title: Valcre Job Custom Fields — LIVE list (bottom of the job)
source: Ben, read directly off the Valcre job UI, 2026-06-03
status: ground-truth
note: Match new/conflict dashboard fields against THESE by name. Pull each CustomFieldId from the live API. Do NOT conclude "no Valcre field" without checking this list.
---

# Valcre Job Custom Fields — LIVE (bottom of the job)

These are the actual Custom Fields shown at the bottom of the job in Valcre. Several of the
"11 conflict" fields almost certainly map here by name — verify each against the live API and
capture its CustomFieldId.

- Lender Company Name
- Lender Company Address
- Lender Contact Name
- Lender Contact Email
- Lender Contact Phone
- Lender Contact Title
- Valuation Premise - 1
- Valuation Premise - 2
- Appraised Value - 1
- Appraised Value - 2
- Tenancy
- State of Improvements
- Status of Improvements
- Property Subtype
- Land Metric
- Assignment Type
- Value Timeframe
- Approaches to Value
- Transaction Status
- Zoning Status

## Likely resolutions vs the 11 conflicts
- **Assignment Type** → custom field exists here (re-check vs CF12049 — the named CF may be the real target).
- **Transaction Status** → exists.
- **Zoning Status** → exists.
- **Value Timeframe** → exists (also an LOE gap field — solved).
- **Approaches to Value** → exists (also an LOE cascade gap field — solved).
- **Tenancy / State of Improvements / Status of Improvements / Property Subtype** → exist (map to LOE Current/Proposed-use improvement fields).
- **Valuation Premise 1/2 + Appraised Value 1/2** → likely the home for Value Scenarios / EA-HC value pairs.
