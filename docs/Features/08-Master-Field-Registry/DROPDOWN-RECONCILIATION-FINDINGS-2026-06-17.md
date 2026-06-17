---
content_type: findings
title: Dropdown Reconciliation Findings — app dropdowns vs client's logical list
status: captured — for team review AFTER the V4-transition work (do NOT interrupt current build)
created: 2026-06-17
author: mcp-knowledge-manager (with Ben)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
relates_to: [JOB-DETAIL-FIELD-AUDIT-2026-06-09.md, DROPDOWN-VS-REGISTRY-AUDIT.md, REGISTRY-VS-CODE-DIVERGENCES.md, GENERATED-field-mapping.md]
client_reference_list: ~/Development/dropdown-field-reference.md
tags: [apr, dropdowns, registry, client-registry, reconciliation, noise-reduction]
---

# Dropdown Reconciliation Findings

## The principle (Ben's call)

**Reconcile every dropdown to the CLIENT's logical minimum list — not to everything Valcre offers.**
The fact that Valcre *allows* an option does not mean the client *wants* it on the dropdown. An
appraiser who deals with a core group of property types does not want a long list of options they'll
never pick — the extras are just **noise** that slows selection. Minimum logical list wins.

## Root cause (suspected)

The team appears to have extracted the **full Valcre option sets** when building the dropdowns,
assuming Valcre's fuller list was the better/safer source. It isn't — the client's curated list is
the requirement. The client may also have *forgotten* a few genuine options; those get added back.
So this is a **two-way reconciliation**, not a one-way trim.

## Findings so far (live-UI spot checks vs client reference, 2026-06-17)

| Field | App dropdown today | Client's logical list | Verdict |
|---|---|---|---|
| **Property Type** | ~16 options incl. Agriculture, Building, Healthcare, Manufactured Housing, Single-Family, Special Purpose, Unknown | 9 (Multifamily, Self-Storage, Retail, Industrial, Office, Land, Hotel, Seniors, Other) | ❌ **BLOATED + mis-spelled.** Trim the extras. Fix spellings: app "Multi-Family→Multifamily", "Senior→Seniors", "Hospitality→Hotel" |
| **Tenancy** | 4 (Owner-Occupied, Single-Tenant, Multi-Tenant, Vacant) | 6 (adds **Partial Owner Occupied**, **Unkown**) | ⚠ **TOO SHORT — app is MISSING two the client wants.** Add them. Also hyphen: app "Owner-Occupied" vs client "Owner Occupied" |
| **Status / State of Improvements** | detailed 7 (Improved-Completed, Under Renovation, Proposed-Vacant Land, etc.) | TWO related fields: simple **State** (Improved / Proposed / Vacant Land) + detailed **Status** | ⚠ Two-field distinction — keep simple-State and detailed-Status separate; don't merge |

> Note: "Unkown" is the client's spelling (typo preserved) and matches the live code option set
> (`api/valcre.ts`), so it is intentional/consistent — do not "correct" it without the client's say.

## ⚠ LOCKED: State of Improvements ≠ Status of Improvements (two distinct fields)

Confirmed with Ben 2026-06-17. These are **two different fields with two different dropdowns — both
required, both real. Do NOT merge or collapse them**, and do NOT pick one based on "which one Valcre
has." Agents have already been confused on this.

- **State of Improvements** = the SHORT list (Improved / Proposed / Vacant Land / Improved Development Land).
- **Status of Improvements** = the DETAILED list (Improved-Completed, Improved-Renovated, Under
  Renovation, Proposed-Vacant Land, Proposed Land (Demolition Required), Under Construction, …).

**Codex slip to fix:** in `~/Development/dropdown-field-reference.md` these two appear **SWAPPED**
(the detailed list landed under "State", the short list under "Status"). Correct the labels.

**Why it matters beyond labels:** some of these dropdowns feed Valcre **custom fields** — so the
field identity drives where the value is written. Two fields = two destinations. *Where* each maps is
a separate downstream question; for now the established fact is simply that **both fields exist and are required.**

## This is NOT new — it confirms prior audit work

The Property Type spelling drift and the missing Tenancy options were **already flagged** in
`JOB-DETAIL-FIELD-AUDIT-2026-06-09.md` and `REGISTRY-VS-CODE-DIVERGENCES.md`. These screenshots
confirm them live in the UI. The dropdown bloat is the new, additional finding.

## The fix (one rule, applied per field)

Walk each dropdown against the client reference list (`~/Development/dropdown-field-reference.md`,
which matches the certified option sets) and the client v03 registry:
1. **Trim** options the client doesn't want (the Valcre-bloat) → less noise.
2. **Add** genuine options the client wants that the app is missing.
3. **Fix** spelling/format mismatches so cascade keys + Valcre sync don't silently break.

## Status / handoff

- **Captured now; held for the team.** They're mid V4-transition — do NOT interrupt. Introduce these
  findings when they surface, as a registry-update pass.
- **Next step (when greenlit):** a systematic field-by-field comparison — app dropdown vs client
  reference vs Valcre-offered — producing the complete trim/add/fix punch-list. Read-only, no
  conflict with the V4 build. Ben is doing a few more spot checks first.
- Source-of-truth target = the client v03 registry + the generated derivative; the dropdown reference
  file is the human-readable lean list.
