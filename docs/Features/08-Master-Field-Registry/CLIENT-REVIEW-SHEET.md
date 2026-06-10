---
content_type: client-review-sheet
title: Client Review Sheet — questions & concerns to clarify with Chris
status: living — append-only; each entry stays open until Chris answers, then mark RESOLVED
created: 2026-06-10
owner: co-architect (logs entries) · Ben (takes to Chris)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
source_file: docs/Features/08-Master-Field-Registry/client-source/Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx
purpose: One place to collect anything we need to ASK or CONFIRM with the client (Chris) before we build to it. Every entry pinpoints EXACTLY where in his file the question comes from — tab, row/column, exact text — so the question is never vague and never gets lost.
tags: [apr-workflow, client-review, field-registry, questions, chris, valta]
---

# Client Review Sheet — for Chris

**What this is:** a running list of questions and concerns to raise with our client (Chris)
before we build to his registry. Each item says **exactly where in his Excel file** the question
comes from, **what looks off**, and **what to ask** — so there's never any wondering about what
we're asking or why.

**His file:** `Valta Master Field Registry v03 - reviewed 2026-06-09.xlsx` (the version he keeps in
SharePoint, downloaded and saved in our `client-source/` folder). All pinpoints below were read
straight from that file on 2026-06-10.

---

## 1 — Value Scenarios — NOT a Chris question; it's a source-version + code problem on OUR side

**Status:** PARKED (no client question needed) · investigated + corrected 2026-06-10 · finalize at the
gap-fill stage, not now

**Short version:** this started as "Chris left the Value Scenarios Valcre field blank." That was a
misread caused by looking at the wrong copy of his file. Chris **did** specify it correctly. The
real issue is (a) two copies of his registry disagree, and (b) our code uses the old field anyway.

### How you read whether a custom field is specified

Three columns on the **"Field Registry"** tab tell you if a custom field is actually defined:
**Valcre Field Name**, **Valcre Field ID**, **Valcre Field Key**. Filled = he defined it.
Blank = he didn't (in that copy).

### The same field, both copies of his file — row 24, `ValueScenarios`

**The GOOD copy** (`...v3.1...IDS-FILLED...xlsx`):

- Valcre Field Name → *ValueScenarios*
- Valcre Field ID → *12414*
- Valcre Field Key → *12414*
- Record Location → *Job custom field*

→ a **complete** custom field: he gave us the name and the number.

**The copy the on-screen view is built from** (`...v03 - reviewed 2026-06-09.xlsx`):

- Valcre Field Name → *(blank)*
- Valcre Field ID → *(blank)*
- Valcre Field Key → *(blank)*
- Record Location → *Job*

→ same field, **everything blank.**

**Reference — a second complete one** (Transaction Status, good copy): Name *TransactionStatus*,
ID *12424*, Key *12424*. Same full pattern, so you can see what "done right" looks like.

### What this actually means

- **Chris answered it.** Value Scenarios IS a dedicated Valcre field — **12414**. No question to ask
  him.
- **Two copies of his file disagree** — the newer-dated `v03 reviewed` copy has NO Valcre IDs; the
  older-dated `IDS-FILLED` copy has them. The clean on-screen view is built off the copy that's
  missing the IDs. **We must settle which file is the real current source** (this is the
  "manage the source properly" concern).
- **Our code ignores 12414** — it still files value scenarios into the older **Valuation Premise**
  fields (CF11563/11564), leaving 12414 empty. (Same item logged in
  `REGISTRY-VS-CODE-DIVERGENCES.md`.)

**Next action (deferred to gap-fill stage):** pick the true source file → if 12414 is the intended
home, re-point our code from the Premise fields to 12414. No client input required.

---

## 2 — "Report Type" — naming reconcile only (options ARE defined)

**Status:** MOSTLY RESOLVED 2026-06-10 — options exist in registry (Dropdown Lists tab,
`ListReportType` = Comprehensive / Concise / Form). NOT a missing-info block. Only open piece = the
naming reconcile below (his "Report Type" ≈ our "Report Format").

**Where it is:** Tab **"Dropdown Lists"**, column **`ListReportType`** (column 16).

**His exact options:** `Comprehensive`, `Concise`, `Form`.

**What looks off:** those three describe the *length/depth* of a report. In the appraisal world,
"Report Type" usually means the legal kind — **Appraisal Report vs. Restricted Appraisal Report**.
His "Report Type" list looks more like what we'd call **Report Format**, not Report Type.

**What to ask Chris:**
> "Your 'Report Type' list is Comprehensive / Concise / Form. Is that the same thing we call
> **Report Format**? Or do you also have a separate Appraisal-vs-Restricted 'type' somewhere?"

---

## 3 — "Zoning Status" — options defined; mapping note only

**Status:** RESOLVED (options) 2026-06-10 — registry `ListZoningStatus` = In Place / To Be Rezoned.
Chris's intent is clear; not a missing-info block. (Any Valcre legal-conformance mapping is a wiring
detail, not a client question.)

**Where it is:** Tab **"Dropdown Lists"**, column **`ListZoningStatus`** (column 20).

**His exact options:** `In Place`, `To Be Rezoned`.

**What looks off:** Valcre's zoning status uses a different set — **Legal Conforming, Legal
Non-Conforming, Illegal**, etc. (the legal-compliance angle). His two options are about *whether a
rezoning is planned*, which is a different idea. They don't line up.

**What to ask Chris:**
> "Your Zoning Status options are 'In Place' and 'To Be Rezoned.' Valcre's zoning field is about
> legal conformance (Legal Conforming / Non-Conforming / Illegal). Do you want your two values to
> map into Valcre's zoning field, or are these two separate things?"

---

## 4 — "Land $/Metric" — REOPENED: live app vs registry are different concepts

**Status:** OPEN (divergence) 2026-06-10 — registry `ListLand$/Metric` = **$/Unit, $/FAR, $/SF,
$/Acre** (dollar-per-unit basis for land value). BUT the **live app's "Land Metric" dropdown** offers
**Square Feet, Acres, Hectares** (units of AREA). Those are nearly two different fields — one is a
$-rate basis, the other a land-area unit.

**What to ask Chris / decide:**
> "Is 'Land $/Metric' the dollar-rate basis ($/SF, $/Acre…) as your registry says, or the land-area
> unit (SF/Acres/Hectares) the app currently shows? They're different things — which do you want,
> and are both needed?"

**Where it is:** Tab **"Dropdown Lists"**, column **`ListLand$/Metric`** (column 21).

**His exact options:** `$/Unit`, `$/FAR`, `$/SF`, `$/Acre`.

**What looks off:** nothing wrong — it just isn't clear what this field drives or where it shows
up. It looks like the per-unit basis for stating land value, but we want to confirm before wiring.

**What to ask Chris:**
> "Your 'Land $/Metric' list is $/Unit, $/FAR, $/SF, $/Acre. Confirm — is this the basis you want
> land value expressed in, and where should it appear (LOE, report, both)?"

---

## 5 — Typo in his sheet: "Unkown"

**Status:** OPEN · raised 2026-06-10

**Where it is:** Tab **"Dropdown Lists"**, column **`ListTenancy`**, **row 6** — the cell reads
`Unkown`.

**What looks off:** spelling — should be **"Unknown."** Small, but if we build the dropdown from
his sheet exactly, the typo carries through into the live app.

**What to ask Chris:**
> "Tiny one — your Tenancy list has 'Unkown' (missing the second 'n'). We'll correct it to
> 'Unknown' unless you meant something else."

---

## 6 — Property Subtype list has no industrial option (his list is residential/retail)

**Status:** OPEN · raised 2026-06-10

**Where it is:** Tab **"Dropdown Lists"**, column **`ListPropertySubtype`**.

**His exact options:** `Apartment`, `Townhouse`, `Mixed Use`, `Shopping Centre`.

**What looks off:** all four are residential/retail. There's **no industrial subtype** (or office,
etc.). Property Subtype maps to Valcre's **native Subtype field**, which is nested under Property
Type — so an Industrial property would need industrial subtypes that aren't in Chris's list. (Our
test job is industrial and none of his four fit it.)

**QA live Valcre check (read-only, 2026-06-10 — PV-1):**
- Live native field is **`SecondaryType`** (the `SubType` field exists but is empty/unused) — small
  mapping correction vs registry's "Subtype" name.
- Real Valcre values in use (100-property sample): **Apartments, Low-rise, Multifamily, Warehouse.**
- **NONE of Chris's 4 appear**, and his **"Apartment" ≠ Valcre's "Apartments"** (plural near-miss =
  silent-no-write risk).
- Industrial gap CONFIRMED: Valcre supports industrial subtypes (Warehouse seen), but Chris's 4 have
  none; the Industrial test property has `SecondaryType=None` — no valid Chris-option to pick.
- Caveat: a sample shows what's USED, not the full accepted enum; definitive per-option "which land"
  needs the write→readback test (held for Ben's go).

**What to ask Chris:**
> "Your Property Subtype values (Apartment / Townhouse / Mixed Use / Shopping Centre) don't match
> what Valcre actually uses (Apartments / Low-rise / Multifamily / Warehouse…), and 'Apartment' vs
> Valcre's 'Apartments' would silently fail to save. Also no industrial/office subtype, though Valcre
> supports them. Do you want us to **use Valcre's actual SecondaryType values** (recommended), or do
> you want your curated list added to Valcre per property type?"

---

## 7 — Section 1 fields NOT in Chris's registry: Valuation Premises + Asset Condition

**Status:** OPEN (decision) 2026-06-10

**Where:** these are app **Section 1 (Client Submission)** fields — Ben's own pre-registry names. Neither
appears in Chris's registry (checked Field Registry tab — no Valuation Premise / Asset Condition row).

**They're well-formed, just outside the registry:**
- **Valuation Premises** (app options): Market Value · Market Rent · Investment Value · Insurable Value ·
  Liquidation Value. Relates to the Valcre "premise" concept (where value scenarios land, CF11563/11564)
  but is a DISTINCT field (Ben: don't merge with Value Scenarios). Note: its Valcre sync currently FAILS
  on create (RequestedValues=None).
- **Asset Condition** (app options): Excellent · Very Good · Good · Fair · Poor. Standard condition scale;
  no obvious registry/Valcre target.

**Naming note (separate, RESOLVED):** "Authorized Use" is the registry-correct label; the "Intended Use"
label in the Clean client component is the inconsistent one (Intended Use is Valcre's NATIVE name for the
same field). Standardize the dashboard label to "Authorized Use."

**Decision for Ben/Chris:**
> "Valuation Premises and Asset Condition are useful fields we use but they're not in your registry.
> Do you want them added to the registry (and mapped to Valcre — Valuation Premises → the premise fields?),
> or do they stay as our internal app fields outside the registry?"

---

*Append new entries above this line as they come up. Keep each one pinpointed to tab + row/column +
exact text, so the question is always clear.*
