---
title: APR "Fill with Test Data" — Field Contract (Empty vs Filled)
status: active
created: 2026-06-12
updated: 2026-06-12
last_reviewed: 2026-06-12
description: "The exact per-field contract for the dashboard's Test-Mode 'Fill with Test Data' — every Section 1/2/3/4 field, its empty-state placeholder, and the value Fill writes. The regression guard so Fill never silently drops a field again."
tags: [apr-workflow, test-data, fill, dashboard, qa-gate, ground-truth, regression-guard]
entities: ["[[JobDetailAccordion]]", "[[LoeQuoteSection]]", "[[ClientSubmissionSection]]"]
---

# APR "Fill with Test Data" — Field Contract

**Tags:** #apr-workflow #test-data #fill #qa-gate #ground-truth #regression-guard
**Entities:** [[JobDetailAccordion]] [[LoeQuoteSection]] [[ClientSubmissionSection]]

**↑ Home:** [APR Master Dashboard](~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md)

**What this is.** The exact contract for **Test Mode → "Fill with Test Data"** on a dashboard job. Every field, its **empty-state** (the rendered placeholder on a blank job), and the **filled** value Fill writes. This is the regression guard: if a field stops filling, diff it against this table.

**Source of truth (code):** the empty placeholders come from the rendered Selects/inputs; the filled values come from `handleFillTestData` in [JobDetailAccordion.tsx](~/Development/APR-Dashboard-v3/src/components/dashboard/JobDetailAccordion.tsx) (`onUpdateJob` = Section 1, `onUpdateDetails` = Sections 2–4).

**Two Fill rules baked in:**
- **Smart Fill** — if Section 1 already holds real submission data, Fill writes **only** Section 2–4 and preserves Section 1. The table below is the **blank-job** case (both fill).
- **Cascade hold-back** — the 3 cascade-derived fields (Value Scenarios, Property Rights, Approaches to Value) stay **empty after Fill** until a Cascade Options scenario is picked. That empty-after-Fill state is **correct**, not a miss.

---

## Section 1 — Client Information & Property Details (`onUpdateJob`)

| Field | Empty state (blank job) | After Fill |
|---|---|---|
| First Name | `First name` | Sarah |
| Last Name | `Last name` | Mitchell |
| Title | `Client title` | Portfolio Manager |
| Organization | `Organization` | Bridgepoint Capital Partners |
| Phone | `Phone` | (403) 555-0142 |
| Email | `Client email` | sarah.mitchell@bridgepointcap.com |
| Address | `Client address` | 350 7th Avenue SW, Suite 1800, Calgary, AB T2P 3N9 |
| Property Name | `Property name` | Riverside Commerce Centre |
| Property Address | `Property address` | 4820 Macleod Trail SE, Calgary, AB T2G 0A5 |
| Property Type | `Please Select` | Industrial |
| Property Subtype | `from Section 1` | Multi-Tenant Industrial |
| Tenancy | `from Section 1` | Multi-Tenant |
| Authorized Use | `Please Select` | Financial Reporting |
| Valuation Premises | `Select valuation premises` | Market Value |
| Asset Condition | `Select asset condition` | Good |
| Property Contact — First | `First name/department` | Daniel |
| Property Contact — Last | `Last name` | Okafor |
| Property Contact — Email | `Email` | d.okafor@riversidecc.ca |
| Property Contact — Phone | `Phone` | (403) 555-0199 |
| Client Comments | (empty) | Refinancing appraisal; site access via property manager Daniel Okafor. |

---

## Section 2 — LOE Quote & Valuation Details (`onUpdateDetails`)

| Field | Empty state (blank job) | After Fill |
|---|---|---|
| Job Number | (Valcre-native, blank) | *(unchanged — set by Create Valcre Job)* |
| Job Status | (Valcre-native, locked) | *(unchanged)* |
| Purpose | (empty — free-text) | *(unchanged — user input)* |
| Status of Improvements | `Select...` | *(empty — set by Cascade Options picker)* |
| **Value Scenarios** | `from Status` | *(stays empty until scenario picked — cascade)* |
| **Property Rights** | `from Property Type` | *(stays empty until scenario picked — cascade)* |
| **Approaches to Value** | `from Status` | *(stays empty until scenario picked — cascade)* |
| Property Subtype *(mirror)* | `from Section 1` | Multi-Tenant Industrial |
| Tenancy *(mirror)* | `from Section 1` | Multi-Tenant |
| Value Timeframe | `Select...` | Current |
| Scope of Work | `Select...` | Income Approach |
| Report Type | `Select...` | Appraisal Report |
| Report Format | `Select...` | Comprehensive |
| Assignment Type | `Select...` | Single Property |
| Analysis Level | `Select...` | Detailed |
| Appraisal Fee | `$ amount` | 6500 |
| Retainer Amount | `$ amount` | 1500 |
| Payment Terms | `Select...` | On LOE Signature |
| Effective Date | `yyyy-mm-dd` | 2026-06-15 |
| Request Date | `yyyy-mm-dd` | 2026-06-09 |
| Delivery Date | `yyyy-mm-dd` | 2026-07-10 |
| Delivery Time (weeks) | (empty) | 4 |
| Client Documents | (none selected) | Rent Roll, Historical Operating Expenses, Purchase & Sale Agreement |
| Previously Appraised | `Select...` | No |
| Current Use | (empty) | Multi-tenant industrial / warehouse |
| Proposed Use | (empty) | Multi-tenant industrial / warehouse |
| CMHC Financing | `Select...` | No |
| Transaction Status | `Select...` | Under Contract |
| Zoning Status | `Select...` | In Place |
| Valuation Premises | `Select...` | Market Value |

---

## Section 3 — Building Information (`onUpdateDetails`)

| Field | Empty state (blank job) | After Fill |
|---|---|---|
| Year Built | (empty) | 2008 |
| Building Size (SF) | (empty) | 84500 |
| Number of Units | (empty) | 12 |
| Parking Spaces | (empty) | 140 |
| Legal Description | (empty) | Plan 0712345, Block 4, Lot 7 |

---

## Section 4 — Data Gathering / Property Research (`onUpdateDetails`)

| Field | Empty state (blank job) | After Fill |
|---|---|---|
| Zoning Classification | (empty) | I-G (Industrial General) |
| Zone Abbreviation | (empty) | IG-2 |
| Land Use Designation | (empty) | Industrial |
| Flood Zone | (empty) | Zone X (minimal risk) |
| Utilities | (empty) | Full municipal services |
| Parcel Number | (empty) | 0192-837-465 |
| Gross Land SF | (empty) | 84500 |
| Assessed Value | (empty) | 11400000 |
| Taxes | (empty) | 168000 |
| Assessment Year | (empty) | 2026 |
| Land Assessment Value | (empty) | 4200000 |
| Improved Assessment Value | (empty) | 7200000 |
| Total Assessment Value | (empty) | 11400000 |

---

## Known fix history (why this contract exists)

- **2026-06-12 — double `onUpdateDetails` clobber:** `handleFillTestData` called `onUpdateDetails` twice (big object, then a cascade-blank object). `handleUpdateDetails` merges from a stale closure, so the 2nd call wiped the 1st → Section 2 + Subtype/Tenancy came back empty. **Fix:** merged into one call.
- **2026-06-12 — Section 1 rollback:** `handleUpdateJob` optimistically set state then **reverted to the stale-empty job on any DB-write error** → Section 1 filled then went blank. **Fix:** keep the optimistic state, no rollback; gate the save-failure toast on a real Valcre job.

---

**Last reviewed:** 2026-06-12 by qa-agent — authored as the anti-regression contract after both Fill bugs were fixed + verified live on a blank job (every Section 1–4 field fills; cascade cluster correctly empty until a scenario is picked).
