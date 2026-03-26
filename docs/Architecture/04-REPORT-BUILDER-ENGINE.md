# 04 - Report Builder Engine

## System Goal
Produce a 79-page live HTML report populated dynamically via an intensive data-entry form. No external PDF/Word macro compilation is performed server-side for the draft phase.

## The 4-File Sync Rule
Every new field added to the report requires 4 specific locations to be updated simultaneously:
1. `fieldRegistry.ts` (the source of truth constraint interface, likely inside `src/features/report-builder/schema`)
2. The `TestDataSet` (used to populate mock previews without hitting DB constraints unnecessarily)
3. `Report-MF-template.html` / rendering components (the visual HTML mapping)
4. The `EditPanel` components (where the user actually types the data in)

## Live Preview
The architecture attempts a side-by-side or tabbed split-view: Form entries bound via Zustand immediately reflect into the Report preview panel.

*(Reviewer check: Are we still running off of the `.html` template exactly as written in public/, or are we rendering React components stringified?)*
