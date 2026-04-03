# Valcre Custom Fields Audit — Job 834912 (VAL261030)

**Date:** 2026-03-31
**Job:** Harbourfront Tower, 250 Queens Quay W, Toronto ON
**Verified by:** QA-4 via API + Valcre UI screenshot

---

## Standard Valcre Fields (Top of Job Page)

### General

| Field | Value | New? |
|---|---|---|
| Job Name | VAL261030 | |
| Subject Property | Harbourfront Tower | |
| Address | 250 Queens Quay W, Toronto ON M5J 2N3 | |
| Fee | $1,500.00 | |
| Retainer | (value) | |
| Property Contact | (linked entity) | |
| Authorized Client | Wellington Capital Group | |

### Dates

| Field | Value | New? |
|---|---|---|
| (All date fields) | yyyy-mm-dd (empty) | |

### Report

| Field | Value | New? |
|---|---|---|
| Format | Appraisal Report | |
| Authorized Use | Financing | |
| Purpose | Fee Simple Interest | |
| Scope | All Applicable | |

### Staff / Permissions

| Field | Value | New? |
|---|---|---|
| (Standard fields) | (untouched) | |

### Comments

| Field | Value | New? |
|---|---|---|
| General | (populated via API) | |
| Detail | (populated via API) | |
| Delivery | (populated via API) | |

---

## Custom Fields Section (Flat List)

### Pre-existing Lender Fields (NOT ours — empty)

| Field | Value | New? |
|---|---|---|
| Lender Company Name | (empty) | |
| Lender Address | (empty) | |
| Lender Contact Name | (empty) | |
| Lender Email | (empty) | |
| Lender Phone | (empty) | |
| Lender Title | (empty) | |

### Pre-existing Valuation Fields (NOT ours — empty)

| Field | Value | New? |
|---|---|---|
| Valuation Premise 1 | 0 | |
| Valuation Premise 2 | 0 | |
| Appraised Value 1 | 0 | |
| Appraised Value 2 | 0 | |
| Test1 | (empty) | |

### 13 VALTA Fields — We Created & Populated ★

| Field | Value | ID | New? |
|---|---|---|---|
| Tenancy | Multi-Tenant | 12042 | ★ NEW |
| State of Improvements | Complete | 12043 | ★ NEW |
| Status of Improvements | As Is | 12044 | ★ NEW |
| Property Subtype | High-Rise | 12045 | ★ NEW |
| Land Metric | Square Feet | 12046 | ★ NEW |
| Environmental Assessment | Phase 1 - Clear | 12047 | ★ NEW |
| Heritage / Conservation | None | 12048 | ★ NEW |
| Assignment Type | Standard | 12049 | ★ NEW |
| Desktop Report | (checkbox) | 12050 | ★ NEW |
| Value Timeframe | Prospective | 12051 | ★ NEW |
| Approaches to Value | Direct Comparison | 12052 | ★ NEW |
| Transaction Status | Arms Length | 12053 | ★ NEW |
| Zoning Status | Legal Conforming | 12054 | ★ NEW |

---

## Summary

| Category | Count | Status |
|---|---|---|
| Standard Valcre fields | ~20 | Populated via API (General, Report, Comments) |
| Pre-existing custom (Lender) | 6 | Empty — not ours |
| Pre-existing custom (Valuation/Test) | 5 | Empty/zero — not ours |
| **VALTA fields (NEW)** | **13** | **★ Created + populated + QA verified 13/13** |
| **Total custom fields** | **24** | |

**Note:** Valcre UI has a display limit — may not render all custom fields in the scroll area. All 13 ★ fields confirmed present and populated via API. QA-4 also confirmed they render in the Valcre web UI when scrolled to.
