---
content_type: findings
title: Registry Cross-Check — Findings for the Team (low-key FYI, not blockers)
status: drafting — Ben + KN-Mgr; deliver to team at the section-2 / field-adds tweak window
created: 2026-06-17
author: mcp-knowledge-manager (with Ben)
audience: ui-designer (registry owner) + co-architect (sequencing) + qa-agent (cert)
relates_to: [DROPDOWN-RECONCILIATION-FINDINGS-2026-06-17.md, GENERATED-field-mapping.md, GENERATED-v3-drift-check.json, JOB-DETAIL-FIELD-AUDIT-2026-06-09.md]
tags: [apr, registry, cross-check, dropdowns, custom-fields, findings, section-2]
---

# Registry Cross-Check — Findings for the Team

## Framing (read first)

Ben + KN-Mgr read the field registry and did our own cross-check against the client's registry, the
live UI dropdowns, and the field spec. **None of this is a blocker or a "you missed it."** They're
small, easy tweaks — and most fold naturally into the **section-2 V3 dashboard tweaks** already on the
roadmap. The new drift-watchdog the UI designer just built is exactly the tool that will police most
of these going forward; several of these are good **test cases** to confirm it catches them.

Deliver whenever convenient — not urgent, won't interrupt the protection-first work.

> **✅ Registry-owner review (ui-designer, 2026-06-17):** confirmed accurate on §2 (State≠Status,
> distinct CFs), §4c (label drift), §4d (Report-Type/Format/Analysis-Level collapse + Subtype/Tenancy
> dual-home). **Two corrections folded in:** §2 typos are in the spec/Codex artifacts, NOT the canonical
> registry (which is clean); §3 "Required backwards" is RETRACTED (authoritative xlsx has all Required=Yes).
> **Clarification:** §4's "exists in Valcre" (the custom fields DO exist) ≠ Slice-4b's "absent from V4"
> (the V4 *report-builder schema* lacks the form fields) — two different "V4"s, no contradiction.
> **Confirmed:** the drift-watchdog DOES catch option-spelling diffs (Unknown vs "Unkown") — these are
> good test cases for it.

---

## 1. Dropdowns: reconcile to the client's lean list, not Valcre's full set

Full detail in `DROPDOWN-RECONCILIATION-FINDINGS-2026-06-17.md`. Summary:

- **Principle:** Valcre *offering* an option ≠ the client *wanting* it. Extra options = noise. Match
  the client's minimum logical list.
- **Property Type** — bloated (nearly double the client's list: Agriculture, Building, Healthcare,
  Manufactured Housing, Special Purpose, etc.) AND mis-spelled (Multi-Family→Multifamily, Senior→Seniors,
  Hospitality→Hotel). Trim + fix.
- **Tenancy** — the gap is in the **live app dropdown**, not the registry. Registry owner confirms the
  canonical `ListTenancy` ALREADY has "Partial Owner Occupied" — so the fix is bringing the app dropdown
  up to the registry, not changing the registry. (hyphen fix still applies: "Owner-Occupied"→"Owner Occupied".)
- 🛑 **"Unkown" is LOAD-BEARING — never "fix" it (locked 2026-06-17, QA-caught).** V3 deliberately keeps
  the misspelled "Unkown" because it matches Valcre's own typo'd option id (7422). Correcting it to
  "Unknown" makes the Valcre write **silently no-op** — the value fails to save with no error. **Never
  change the V3 option; instead align the MASTER list to "Unkown"** (Valcre-write compat is the binding
  constraint, with a desc noting it's Valcre's typo). This is NOT a Chris-preference call — it's a hard
  compatibility match. (An attempted cleanup was reverted this session.)
- **Two-way fix per field:** trim the bloat · add genuine gaps · fix spelling/format.

---

## 2. State of Improvements ≠ Status of Improvements (two fields — keep separate)

Confirmed in the registry itself (two distinct rows) and with Ben:

- **State of Improvements** = short list (Improved / Proposed / Vacant Land / Improved Development Land).
- **Status of Improvements** = detailed list (Improved-Completed, Under Renovation, Proposed-Vacant Land, …).
- **Both required, both real — do not merge.** Some route to Valcre custom fields, so field identity
  drives the destination; two fields = two destinations.
- ⚠ **List-name typos — CORRECTED by registry owner (2026-06-17):** the canonical HTML registry is
  **CLEAN** — it has the correct `ListStateofImprovements` / `ListStatusofImprovements`. The "Sate" /
  "Satus" typos live only in **`VALTA-FIELD-SPEC.md`** and **Codex's `dropdown-field-reference.md`**
  (the artifacts Ben pasted from). **Fix those two, NOT the canonical registry.** Also: Codex's file has
  these two lists SWAPPED under the labels — fix there too. (Good news: the source of truth is fine.)

---

## 3. Field-spec observations (from the VALTA Master Field Registry)

- ~~**Required flags look backwards on the cascade.**~~ **RETRACTED 2026-06-17 — inaccurate.** Registry
  owner parsed the authoritative `Valta-field-v03.xlsx`: Status, State, Tenancy AND Value Scenarios,
  Approaches are **ALL Required = Yes**. The "triggers Not-Required / outputs Required" reading came from
  a possibly-stale pasted artifact, not the source of truth. No inconsistency exists. Dropped.
- **Section-10 narrative fields may be a build gap.** EA/HC Summary 1–6, EA Detail 1–6, HC Detail 1–6 are
  all flagged "New Custom Valcre Field = Yes," but they sit **beyond the certified custom-field block**
  (the CF set we verified against `api/valcre.ts`). So these custom fields likely **don't exist in Valcre
  yet** — either unbuilt, or built and not yet recorded. ← Ben's Valcre knowledge resolves this (see §4).
- **Desktop Report contradicts itself** — tagged "Delete" in the margin yet marked Required = Yes. The
  client wants it removed (matches the Job-Detail audit). Drop it.
- **Native remaps to confirm as intentional:** "Signed Date" → Valcre "Awarded Date"; "Request Date" →
  Valcre "Bid Date". Sensible, but a renamed mapping is where confusion creeps in — confirm.
- **Client Organization Address → "Various / Various".** One app field pointing at Valcre's several
  address fields — needs decomposing into the structured address sub-fields, not a one-to-one map.
- **Value Scenarios shape:** appears once as a multi-select master AND again as six single-select slots
  (1–6). Confirm the six are the per-scenario report slots, not a duplication.

---

## 4. Valcre custom-field cross-check (against live job VAL261101, 2026-06-17)

Ben pulled a live Valcre test job (VAL261101 Westside Mall) showing the actual custom fields.
Result of matching the spec's "New Custom = Yes" rows against what's really in Valcre:

**✅ Built and matched (all present in Valcre):** Status of Improvements, **State of Improvements**,
Tenancy, Current Use, Proposed Use, Interest Appraised, Authorized Use, Value Scenario(s), Approaches
to Value, Assignment Type, Report Type, Desktop Report, Value Timeframe, Delivery Time, Paid, Client
Documents, Previously Appraised, Transaction Status, Zoning Status, Land $/Metric, CMHC Financing —
**plus the full Section-10 set: Value Scenario 1–6, EA/HC Summary 1–6, EA Detail 1–6, HC Detail 1–6.**

- **§3 Section-10 question RESOLVED — NOT a build gap.** Those narrative custom fields physically exist
  in Valcre (empty on this job, but created). Chris built them.
- **State ≠ Status confirmed LIVE.** Both exist as distinct custom fields on the real job (Status filled
  = "Proposed - Improved Land (Demolition Required)", State present + empty). Settles §2 definitively.
- **Why the count is high (Chris's "different versions"):** the numbered/versioned slots — Value Scenario
  1–6, EA/HC Summary 1–6, EA Detail 1–6, HC Detail 1–6, Valuation Premise 1–2, Appraised Value 1–2.
  By design, not over-creation.

**🆕 Custom fields in Valcre that our spec does NOT list (the real new finding):**
| Valcre custom field | In our registry spec? | Note |
|---|---|---|
| Lender Company Name / Company Address / Contact Name / Email / Phone / Title (6) | ❌ not in spec | Same Lender set the master dashboard flagged as an open "add to form / conditional / skip?" decision. Confirmed to exist in Valcre. |
| Valuation Premise - 1, Valuation Premise - 2 | ❌ not in spec | Legacy premise fields (the dual-write/CF11563-11564 pair QA/co-arch flagged for cleanup). Filled here (As Is / As Stabilized). |
| Appraised Value - 1, Appraised Value - 2 | ❌ not in spec | Value outputs, versioned 1/2. |

**Data-value sanity (consistent with code):** Tenancy = "Unkown" (typo value, matches code), Approaches
= "Land Direct Comparison Approach, Cost Approach" (atomic multi), Interest Appraised = "Fee Simple". ✓

**Open items from this cross-check:** (1) decide whether the 6 Lender fields join the registry/form or
stay out; (2) confirm the Valuation Premise legacy pair is being retired (per the earlier cleanup flag);
(3) add Appraised Value 1/2 to the registry if they're report outputs we surface.

---

## 4c. Client submission form ↔ Dashboard Section 1 (compared 2026-06-17)

Confirmed: **the field sets match.** The fields recently added to Section 1 (Authorized Use, Valuation
Premises, Asset Condition) are present on the client submission form too — the two surfaces mirror each
other on content. Differences are small:

**Label drift (same field, different label — align for consistency):**
| Submission form | Dashboard Section 1 |
|---|---|
| Client Company Name | Organization |
| Client Title | Title |
| Asset Current Condition | Asset Condition |
| Additional Information | Client Comments / Notes |
| Property Contact "First Name/Department" | Property Contact "First Name" |

**Dropdown bloat reaches the intake form too (not just the dashboard):**
- Property Type on the form is the same over-stuffed list — it even defaults to **"Agriculture," which
  is NOT in the client's nine**.
- Property Subtype shows **"Low-Rise" — a Valcre value absent from the client's four subtypes**
  (Apartment / Townhouse / Mixed Use / Shopping Centre). So the form carries a subtype the client list
  doesn't have. The §1 reconcile-to-client's-lean-list fix applies to BOTH the dashboard and the form.

**Structural note (not a field mismatch):** the submission form spells out the specific required
documents (Full Property Details/Prior Appraisal, Proforma, Unit Mix/Rent Roll, Operating Expenses,
Drawings/Plans, property-tour contact) as guidance; the dashboard has a generic upload only. The form
carries richer document structure the dashboard doesn't surface.

Cross-reference: `INTAKE-FORM-FIELDMAP-2026-06-03.md` is the prior documented intake map — reconcile
labels there too if it's still treated as live.

> **Note (Ben, 2026-06-17):** the submission form here is our test form, but **treat it as the one that
> becomes live** — at production it replaces the form on the client's Valta site. So the dropdown/field
> fixes here carry straight to production; no separate reconciliation of the old Valta-site form needed.
>
> **Scope for now = mapping, dropdowns, fields ONLY.** The form's look/redesign is a SEPARATE, later
> category of work (it's had little design time) — done before go-live, not now. **"Live" terminology:**
> *testing phase* = form wired to our dashboard (the form→dashboard button works) — still test;
> *live/deployed* = pushed onto the client's Valta site — a planned future step, scheduled when ready.

---

## 4d. Section 2 (LOE / job-prep) review (2026-06-17)

Ben's read — Section 2 carries more fields than it needs. Confirmed; the redundancy is real:

**Likely-redundant triple — collapse candidate:** **Report Type · Report Format · Analysis Level** all
resolve to the same Comprehensive / Concise / Form choice (the audit's "Report Type confusion"). Three
fields for one concept — strongest "too many fields" target in the section.

**Section-1 overlap (enter-once, don't re-type):** **Property Subtype** and **Tenancy** appear in BOTH
Section 1 and Section 2. Not deletions — they must SHARE one value (consolidation pattern). If they're
independent inputs in each section they can drift apart. Wire them to one source.

**Cascade is correctly modeled (good):** Value Scenarios, Property Rights, Approaches to Value, and the
"Section 10 write-ups" panel are DERIVED outputs (computed from Status of Improvements + Subtype +
Tenancy), shown where derived fields belong — not free-pick. Confirm they render as read-outs, not
editable selects.

**Question — Purpose:** rendered as free text here, but the registry treats it as derived from Property
Rights (PURPOSES_MAP). May not need to be a typed field — could auto-fill.

**Dropdowns:** all selects here (Current Use, Proposed Use, Status of Improvements, Transaction Status,
Zoning Status, Scope of Work, Payment Terms, Client Documents, Assignment Type) get the same §1
reconcile-to-client's-list treatment. Status of Improvements here is the DETAILED field — keep the
State/Status distinction (§2).

**Dates / native mapping (fine):** Request Date→Valcre Bid Date, Signed Date→Awarded Date, plus
Effective/Delivery/Paid dates — large but mostly native Valcre mappings; no change needed beyond
confirming the remaps are intentional (§3).

---

## 4e. Registry viewer — move the inline V3/V4 tags into filterable COLUMNS (Ben, 2026-06-17)

The HTML registry viewer currently slaps V3/V4 badges **inline beside each field name** (~55 Valta
dashboard fields). Ben's call: that's messy and barely usable — decoration, not data. Replace with:

- A **Dashboard column** — values V3 / V4 / Live (the three dashboards) — **filterable**.
- A **Section column** — **filterable**.
- A per-dashboard filter (toggle/checkbox) so you can view ONE dashboard at a time and confirm
  alignment at a glance — no field missing from a dashboard, no misalignment.

**Same problem, second costume — the top "Valta Dashboard / Valcre" toggle.** It splits data that
should be columns: flip to Valta, flip to Valcre, but you can't see a field beside its Valcre mapping
in one row. The toggle hides the *relationship* the way the tags hide the *dashboard* dimension.

**The unifying principle (one recommendation, not scattered nitpicks):** **one table, proper columns,
FILTER — don't toggle, don't tag.** Each field = one row. Two columns carry the dimensions now buried
in tags (Ben's naming, 2026-06-17):
- **Dashboard** — which dashboard the field is on (V4 / V3 / Live).
- **Location** — where it sits *within* that dashboard (its section/spot).

Plus the existing columns: Valta name · Valta label · Valcre field. Filter by Dashboard to view one at
a time; the Location column shows where each field lands. **This pairing is what surfaces misalignment**
— a field in a different Location on V3 vs V4 shows up side-by-side instead of being guessed at.
Toggling/tagging siloes the data and hides these cross-relationships; filtering keeps the whole picture
and just narrows it.

**The verification mode to build toward (the payoff): group-by-field, dashboards side-by-side.** Add a
"group by" so you can filter to V4 + V3 and see each field's dashboards aligned on one row — a V4 field
with a BLANK in the V3 column = it's missing from V3, spotted at a glance. The empty cell *is* the
finding; no cross-referencing. Works both directions (V3 fields V4 dropped, V4 fields V3 never had).
This is the concrete alignment check — design the columns so this view falls out of them.

**Why it's cheap (not new data):** the generator ALREADY carries `v3key` / `v4id` / `sectionHome` +
the Valcre mapping per field. This is a PRESENTATION change — render that existing per-field data as
filterable columns instead of toggles + inline tags. Turns decoration into an **alignment-verification
surface** (filter V3 vs V4, spot the gaps). Owner: ui-designer (registry viewer + generator).

---

## 5. Delivery plan

- **Non-urgent FYI**, delivered at the section-2 / field-adds (Slice 4b) window — not into the
  protection-first work.
- Framed as "we cross-checked the registry, here's what we noticed — easy tweaks," for ui-designer
  (registry owner) + co-architect (sequencing) + qa-agent (cert).
- Best use: feed §1–§3 as **test cases** to confirm the drift-watchdog catches them.
- ⭐ **Dropdown fixes apply to BOTH surfaces — the dashboard Section 1 AND the client submission form.**
  They share the same field set (§4c), so any trim/add/spelling fix must land on both, not just one.
  Fixing one surface and forgetting the other is the easy miss this cross-check exists to prevent.
