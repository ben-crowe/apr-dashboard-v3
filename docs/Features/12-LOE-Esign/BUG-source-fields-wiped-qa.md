---
id: bug-source-fields-wiped
title: "Source fields (Property Type / Subtype / Tenancy) get wiped — TWO triggers, same symptom"
date: 2026-06-16
type: bug-record
author: qa-agent
status: cascade-trigger FIXED (qa) · toggle-trigger IN PROGRESS (ui-designer)
tags: [loe, cascade, source-fields, data-loss, stale-closure, insert-from-data, bug]
---

# Source fields wiped — one symptom, two root causes

**Symptom (Ben, live):** the three Section-1 source fields — **Property Type, Property Subtype,
Tenancy** — get **emptied** during normal use. They're SOURCE fields the cascade READS from (to derive
Property Rights); nothing should ever clear them.

There are **two independent triggers** with **two different root causes** — both must be fixed:

## Trigger 1 — switching the CASCADE dropdown  (FIXED — qa, commit on main)
- **Cause:** `handleUpdateDetails` in `src/hooks/useJobDetail.ts` merged against a **stale `jobDetails`
  closure** (`{ ...jobDetails, ...newDetails }`). The cascade fires several rapid `onUpdateDetails`
  calls (status → derived scenarios/approaches/rights); a later call spread an OLD snapshot and
  clobbered the just-entered source fields.
- **Fix:** functional setState — `setJobDetails(prev => { const u = {...prev, ...newDetails};
  debouncedSave(u); return u; })` — so every rapid update merges against the LATEST state.
- **Verified:** Ben ran all cascades, fields held (VAL261101 + VAL261062).

## Trigger 2 — toggling the "view mapped fields" / Insert-from-data CHECKBOX off  (IN PROGRESS — ui-designer)
- **Cause:** `handleInsertFromData(false)` in `LoeQuoteSection.tsx` (~L1128-1143) **explicitly cleared**
  the three fields on toggle-OFF: `onUpdateJob({ propertyType: '' })` +
  `onUpdateDetails({ propertySubtype: '', tenancy: '', propertyRightsAppraised: '' })` (the old
  stash-then-empty-all-six "Insert from data" behavior). So unchecking the box to hide the mapped view
  wiped the real data.
- **Fix (ui-designer, in flight):** remove the clear/stash branch — toggling the checkbox just flips the
  VIEW (`setInsertFromData(checked)`), never erases data. `mappedSources` ref becomes dead (harmless).
- **Status:** ui-designer mid-verify (toggle on/off, confirm fields persist). Not yet committed/deployed
  as of this record.

## Why two fixes for one symptom
They share the symptom but not the cause: Trigger 1 is a **save-race** (stale closure, affects ANY rapid
multi-field update), Trigger 2 is an **intentional clear** in the test-mode toggle path. Fixing one does
NOT fix the other. Both are now addressed.

*qa-agent · 2026-06-16. Documented at Ben's request after he noticed the checkbox-toggle reproduced the
same wipe as the cascade. Trigger 1 = mine (fixed); Trigger 2 = ui-designer's (in flight).*
