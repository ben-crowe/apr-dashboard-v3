---
title: v03 Field Registry — CANONICAL authority baseline (June-9 reviewed)
source: ~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx
status: canonical — the re-run baseline for Slice-4b (replaces the stale April docs/valta share/ copy)
parsed: 2026-06-17 by mcp-knowledge-manager
tags: [apr, registry, authority, baseline, slice-4b, client-source]
---

# v03 Field Registry — Canonical Authority Baseline

**67 fields**, parsed straight from Chris's June-9 reviewed workbook (the source the field-registry HTML names as truth). Use THIS as the reconciliation authority — the stale April copy that caused the mix-up has been archived (`docs/valta share/_archive/Valta-field-v03-APR2-STALE.xlsx`).

> **Future option (Ben, 2026-06-17 — note only, not scheduled): auto-pull from SharePoint.** Chris's
> workbook lives in a SharePoint folder system that's already connected via a SharePoint app. We could
> wire an instant-download integration so any agent pulls the registry **straight from source** on
> demand — and re-pull every time Chris (or anyone) says they changed it. That would make stale-copy
> drift like this *structurally impossible* (no local copies to go stale). Not proposed as work now —
> captured so we can reach for it if the manual re-pull ever becomes a recurring chore.

| # | VALTA Field Name | Label/UI | Dropdown List | New Custom | Required |
|---|---|---|---|---|---|
| 1 | `JobNumber` | Job Number |  | No | Yes |
| 2 | `JobName` | Job Name |  | No | Yes |
| 3 | `JobStatus` | Job Status |  | No | Yes |
| 4 | `SubjectProperty` | Subject Property |  | No | Yes |
| 5 | `ClientCompanyName` | Client Company Name |  | No | Yes |
| 6 | `ClientOrganizationAddress` | Client Organization Address |  | No | Yes |
| 7 | `ClientFirstName` | Client First Name |  | No | Yes |
| 8 | `ClientLastName` | Client Last Name |  | No | Yes |
| 9 | `ClientTitle` | Client Title |  | No | Yes |
| 10 | `ClientPhone` | Client Phone |  | No | Yes |
| 11 | `ClientEmail` | Client Email |  | No | Yes |
| 12 | `PropertyName` | Property Name |  | No | Yes |
| 13 | `PropertyAddress` | Property Address |  | No | Yes |
| 14 | `PropertyType` | Property Type |  | No | Yes |
| 15 | `PropertySubtype` | Property Subtype |  | No | No |
| 16 | `Tenancy` | Tenancy | ListTenancy | Yes | No |
| 17 | `StateofImprovements` | State of Improvements | ListSateofImprovements | Yes | No |
| 18 | `StatusofImprovements` | Status of Improvements | ListSatusofImprovements | Yes | No |
| 19 | `CurrentUseImprovements` | Current Use Improvements | ListCurrentUseImprovements | Yes | Yes |
| 20 | `ProposedUseImprovements` | Proposed Use Improvements | ListProposedUseImprovements | Yes | Yes |
| 21 | `InterestAppraised` | Interest Appraised | ListInterestAppraised | Yes | Yes |
| 22 | `AuthorizedUse` | Authorized Use | ListAuthorizedUse | Yes | Yes |
| 23 | `ValueScenarios` | Value Scenario (s) | ListValueScenarios | Yes | Yes |
| 24 | `ApproachestoValue` | Approaches to Value | ListApproachestoValue | Yes | Yes |
| 25 | `AssignmentType` | Assignment Type | ListAssignmentType | Yes | Yes |
| 26 | `ReportType` | Report Type | ListReportType | Yes | Yes |
| 27 | `DesktopReport` | Desktop Report | ListYes/No | Yes | Yes |
| 28 | `Valuetimeframe` | Value Timeframe | ListValueTimeFrame | Yes | Yes |
| 29 | `InspectionDate` | Inspection Date |  | No | No |
| 30 | `Fee` | Fee |  | No | Yes |
| 31 | `DeliveryTime` | Delivery Time |  | Yes | Yes |
| 32 | `PaidDate` | Paid Date |  | No | No |
| 33 | `Paid` | Paid |  | Yes | No |
| 34 | `RequestDate` | Request Date |  | No | No |
| 35 | `SignedDate` | Signed Date |  | No | No |
| 36 | `DueDate` | Due Date |  | No | No |
| 37 | `AmountPaid` | Amount Paid |  | No | No |
| 38 | `ClientDocuments` | Client Documents | ListClientDocuments | Yes | Yes |
| 39 | `PreviouslyAppraised` | Previously Appraised | ListYes/No | Yes | No |
| 40 | `TransactionStatus` | Transaction Status | ListTransactionStatus | Yes | Yes |
| 41 | `ZoningStatus` | Zoning Status | ListZoningStatus | Yes | No |
| 42 | `LandMetric` | Land $/Metric | ListLand$/Metric | Yes | No |
| 43 | `CMHCFinancing` | CMHC Financing | ListYes/No | Yes | No |
| 44 | `ValueScenario1` | Value Scenario 1 | ListValueScenarios | Yes | No |
| 45 | `ValueScenario2` | Value Scenario 2 | ListValueScenarios | Yes | No |
| 46 | `ValueScenario3` | Value Scenario 3 | ListValueScenarios | Yes | No |
| 47 | `ValueScenario4` | Value Scenario 4 | ListValueScenarios | Yes | No |
| 48 | `ValueScenario5` | Value Scenario 5 | ListValueScenarios | Yes | No |
| 49 | `ValueScenario6` | Value Scenario 6 | ListValueScenarios | Yes | No |
| 50 | `EA/HCSummary1` | EA/HC Summary 1 | ListEA/HCSummary | Yes | No |
| 51 | `EA/HCSummary2` | EA/HC Summary 2 | ListEA/HCSummary | Yes | No |
| 52 | `EA/HCSummary3` | EA/HC Summary 3 | ListEA/HCSummary | Yes | No |
| 53 | `EA/HCSummary4` | EA/HC Summary 4 | ListEA/HCSummary | Yes | No |
| 54 | `EA/HCSummary5` | EA/HC Summary 5 | ListEA/HCSummary | Yes | No |
| 55 | `EA/HCSummary6` | EA/HC Summary 6 | ListEA/HCSummary | Yes | No |
| 56 | `EADetail1` | EA Detail 1 | ListEADetail | Yes | No |
| 57 | `EADetail2` | EA Detail 2 | ListEADetail | Yes | No |
| 58 | `EADetail3` | EA Detail 3 | ListEADetail | Yes | No |
| 59 | `EADetail4` | EA Detail 4 | ListEADetail | Yes | No |
| 60 | `EADetail5` | EA Detail 5 | ListEADetail | Yes | No |
| 61 | `EADetail6` | EA Detail 6 | ListEADetail | Yes | No |
| 62 | `HCDetail1` | HC Detail 1 | ListHCDetail | Yes | No |
| 63 | `HCDetail2` | HC Detail 2 | ListHCDetail | Yes | No |
| 64 | `HCDetail3` | HC Detail 3 | ListHCDetail | Yes | No |
| 65 | `HCDetail4` | HC Detail 4 | ListHCDetail | Yes | No |
| 66 | `HCDetail5` | HC Detail 5 | ListHCDetail | Yes | No |
| 67 | `HCDetail6` | HC Detail 6 | ListHCDetail | Yes | No |
