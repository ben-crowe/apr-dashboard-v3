---
id: spec-v4-slice4-shared-section1-2-source
title: "SPEC — V4 Slice 4: Shared Section 1–2 field source (Option B build sub-spec)"
created: 2026-06-17
type: implementation-spec
status: READY FOR SIGN-OFF — Ben nodded the registry-as-defining-source reframe 2026-06-17; both honest flags resolved
track: "Track 1/2 join — co-architect authored; registry owner (ui-designer) + QA co-build"
owner: co-architect (author/design) · ui-designer (registry model + generator + fixture) · qa-agent (drift-check gate + reconcile) · Ben (sign-off)
source: PROPOSAL-shared-section1-2-field-source.md (Ben picked Option B 2026-06-17)
tags: [apr, v3, v4, registry, single-source, drift-check, sections-1-2, test-fixture, sync-toggle, spec]
---

# SPEC — V4 Slice 4: Shared Section 1–2 field source (Option B)

> **One line:** Make the registry the canonical master of the Section 1–2 field set. V4 GENERATES its
> fields from it; V3 stays untouched but gets a STRICT, release-BLOCKING drift-check against it; the V4
> test-data fixture + a fixture/live toggle both speak that one field contract. Kills silent drift,
> rebuilds nothing in V3.

> **PREP — nothing builds until QA passes + Ben signs off. Build is multi-owner; see ownership per phase.**

## Locked decisions (from the approved proposal — do NOT re-litigate)
- **Option B** (not A): registry = master; V4 generates from it; V3 = drift-check, not a rebuild. (V3 is hand-built JSX — LoeQuoteSection 2301 lines/119 fields, ClientSubmission 912/97, zero registry import — so A's live-render = a V3 rebuild Ben ruled out.)
- **Asymmetric:** V4 (schema-driven) CONSUMES a generated config; V3 (hardcoded) gets a CONFORMANCE/DRIFT-CHECK only.
- **Canonical key = registry `n` (PascalCase), treated as an OPAQUE id.** Crosswalk is EXPLICIT per field, never algorithmically derived (PascalCase is inconsistent — `StatusofImprovements`).
- **Non-destructive:** V4-only S1/S2 fields (bucket 4) are REVIEWED, never auto-removed.
- **The drift-check is a HARD GATE** (blocks release) and **STRICT** (watches dropdown OPTIONS Chris edits, not just names). A loose/passive checker is worse than nothing — false confidence.

## Honest limit (state it, don't hide it)
"Edit once → both follow" is **automatic for registry → V4 only.** **V3 → registry stays a MANUAL mirror step** (V3 has no schema to consume). Full auto-both-ways = a later V3 refactor (Option A), out of scope here. What B guarantees: the registry is the agreed truth, V4 auto-follows, and drift is *caught and blocked*, not silently shipped.

---

## Build phases

### Phase 1 — Extend the registry FIELDS model (owner: ui-designer)
Add to the `FIELDS` model in `public/field-registry-v6.html` the metadata a form config needs (current model has only the descriptive core: name/label/control/dropdown/required):
- **Alias columns:** `v3key` (the REAL camelCase key V3's JSX uses, e.g. `scopeOfWork`) + `v4id` (the REAL kebab id in `fieldRegistry.ts`, e.g. `scope-of-work`).
- **Form-layout metadata:** sub-section/tab assignment, field ORDER, validation, conditional show/hide, placeholder/defaults.
- **`section-home` tag (scope enforcer):** each field tagged with its V3 form-file home; fields homed in `OrganizingDocs`/`PropertyInfo`/`Section4Compact` (S3/S4) are flagged out-of-Slice-4. The `v3key`→file trace produces this tag; bucket-4 + drift-check read it so the S1+S2 boundary is code-enforced, not remembered.
- **⚑ Alias capture is the careful part (ui-designer, code-confirmed asymmetric risk):**
  - `v4id` is CLEAN — `fieldRegistry.ts` has `id===storeId` + explicit section; read it straight.
  - `v3key` is the REAL risk — V3 keys fields via scattered JSX `id`/`name` attrs through a shared `onInputChange`, with up to THREE candidate keys per field (JSX input id · form-STATE key · camelCase sync key in `VALCRE_SYNC_FIELDS`) that don't always coincide. Some v3keys WILL be ambiguous.
  - **Canonical `v3key` = the form-STATE key the form actually reads/writes** (NOT the display id) — that's what the drift-check must compare against.
  - **Run a 5-field alias-capture SPIKE first** to surface the ambiguity pattern before committing the full-capture estimate. Then full capture.
  - **QA reconciles EVERY captured v3key against the real code** — a wrong alias = a silent drift-check miss (same discipline as the bridge reconcile).
  - **⚑ v3key SHAPE is section-dependent (capture finding):** S2 (`LoeQuoteSection`) = FLAT `jobDetails.X`; S1 (`ClientSubmissionSection`) = NESTED `job.client.X` / `job.property.X` AND DELEGATED to `client-submission/*.tsx` sub-components → S1 capture must trace the sub-component tree (heavier per-field than S2). Capture S2-flat first, then the S1 nested/delegated set.
  - **Mechanism PROVEN + Batch 1 done (2026-06-17):** FIELDS model extended with `v3key`/`v4id`/`sectionHome`, generator emits them, derivative parses clean; reusable `scripts/inject-aliases.mjs`. Batch 1 (ReportType, ScopeOfWork, InterestAppraised, AuthorizedUse, LegalDescription) captured + with QA.
  - **⚑ COMPOSITE-FIELD RULE (co-arch call):** `PropertyContact` (Chris-registry 1 row = MEMBERSHIP) **SPLITS into 4 rows** — `contact-first-name`/`contact-last-name`/`contact-email`/`contact-phone`, each 1:1 with its v4 field — so the drift-check stays uniform + per-field (a v4id-LIST composite would force a checker special-case). Documented as a **1→4 expansion** (we own representation; Chris owns membership) — NOT a reconcile mismatch.
- Regenerate the derivatives.
- **Feasibility CONFIRMED (ui-designer, code-checked):** the model extension + generator changes are incremental (same pattern as this session's st/rt/bn add), not a rewrite.

### Phase 2 — Generator emit targets (owner: ui-designer)
Extend `scripts/generate-registry-derivatives.mjs` (today emits docs only) with two new emit targets, both off the one master:
- **V4 form config** keyed by `v4id` — the schema-driven V4 S1/S2 consumes this.
- **V3 drift-check** keyed by `v3key` — compares V3's actual fields/options against the master, emits divergences. **⚑ Compare via the ALIAS MAP (`v3key`↔`n`↔`v4id`), NEVER assume `v3key==v4id`** — renames are common (3 of 5 in capture Batch 1: InterestAppraised→property-rights, AuthorizedUse→intended-use, LegalDescription→report-legal).

### Phase 3 — The drift-check as a HARD GATE (owner: qa-agent; co-arch wiring) — HARDENED per QA gate
The strict, release-blocking change-detector. QA-authored requirements (from the gate):
- **STRICT — watches the actual dropdown OPTIONS, not just field names** (options are what Chris edits). Per field, both directions (missing + extra). **Also watches field ORDER and REQUIRED-ness** (QA: Chris may reorder fields or change which are mandatory, not only edit dropdowns) — name + presence + placement + options + order + required flag.
- **⚑ FAIL-CLOSED — refuse to pass if it CANNOT check something.** If a field's options aren't machine-readable, the check FAILS — it never waves the field through. This directly answers the V3 blind-spot QA found: V3's dropdown options are mixed — some in importable consts (`CASCADE_OPTIONS`, `DOC_TYPES`) but **~55 inline `<SelectItem>` literals scattered across LoeQuoteSection's 2301 lines**, which can't be read without fragile JSX parsing or a self-drifting manifest. **Consequence (precursor task):** to make those fields checkable, their inline options must be lifted into importable consts (a small, behavior-preserving V3 change — the ONLY V3 touch in this slice, and it's mechanical, not a form rebuild). Until a field's options are readable, fail-closed blocks it — which is the forcing function to lift them.
- **Blocks the CLIENT (Production) release ONLY** — preview/dev builds are NOT blocked, so Chris + we can still iterate fast. The gate bites at the prod boundary.
- **⚑ STATUS TAG per field** (e.g. `synced` | `approved-change` | `pending`) so the check can tell "someone forgot to sync" (BLOCK) from "we changed the master on purpose" (ALLOW). Without it, every legit master change jams the line. A deliberate change is marked approved → passes; an unexplained mismatch → blocks.
- **Protect deliberately-different fields — V4-only AND shared (QA delta).** The generate step (Phase 2) must NOT overwrite an intentional difference — neither a V4-only field (bucket-4) NOR a deliberately-different config on a SHARED field. Intentional divergence (marked `approved-change`) is preserved, not clobbered by the master.
- **Runs PER-CHANGE, not periodic (QA delta 3)** — the check fires on every change, especially during Chris's tuning week; a weekly/manual run is useless mid-tuning (drift would ship between runs).
- **Fail-closed covers the CHECK'S OWN failure (QA delta 4)** — if the checker crashes, can't read the master, or the field set comes back empty → exit RED. It must NEVER report "no drift found" from a failed/empty run (a silent green is the worst outcome).
- Reuses QA's reconcile pattern. **QA owns this phase + confirmed the folded text matches their sent version.**

**✅ PHASE-3 ENGINE BUILT + QA-PROVEN (2026-06-17, commit c958a68 `scripts/v3-drift-gate.mjs`):** 12/12 cases, QA independently re-proven (not the fork's fixtures) — options/order/required/absent/twin-sectionHome all BLOCK; fail-closed all RED (missing manifest, empty config, unreadable, unaccepted gap); coverage-BLIND fires; approved-change passes; prod-blocks/non-prod-report-only; accepted known-gap flags-not-blocks. Engine APPROVED to wire. **Design balance: flag-not-block for ACCEPTED gaps — Ben + QA endorse.** 3 tightenings on the known-gap list: (1) appending to it is REVIEW-GATED (adding a gap = a decision); (2) each known-gap carries a resolve-by/tracking ref (so it can't live forever as a silent escape — flags go banner-blind); (3) surface the accepted-gap COUNT as drift-debt.

**⚑⚑ ACTIVATION-CRITICAL — NON-CIRCULAR MASTER (QA, the catch fixtures can't expose):** the gate diffs V3-actual vs MASTER. If MASTER is sourced from the same V3-actual feed, the gate compares V3 to itself → **CIRCULAR false-pass every run** (the exact silent hole, dressed as working). **DECISION (co-arch, adopt QA's stronger fix b): the gate reads MASTER expectations (option/order/required per field) from the CERTIFIED CONFIG — which Phase 2 must now also EMIT, registry-sourced — NOT from the V3 manifest.** The manifest supplies V3-ACTUAL only; master comes from the registry-derived config. **⚑ DO NOT flip prod-live until the master-source is verified non-circular by QA.**

**Activation checklist (gate is NOT live until ALL done):** (a) ✅ QA blocking-proof; (b) Phase-2 emit extended to carry registry-sourced master option/order/required; (c) gate reads master from config (non-circular); (d) the inline-`<SelectItem>` lift → V3-ACTUAL manifest generator; (e) QA verifies non-circular end-to-end; (f) wire into the prod build command.

### Phase 4 — Test-data fixture + sync toggle (owner: ui-designer)
- V4's "fill with test data" (existing Load Data button) fixture is **keyed to the canonical field set** (`n`+`v3key`/`v4id`) and **drift-checked against the master** (so it can't rot when Chris tunes S2).
- **Sync toggle** on V4's existing test-mode switch: OFF = fixture (bypass V3, fast iteration); ON = live V3→V4 sync (true end-to-end). **Both states feed the SAME canonical contract** — fixture and live describe fields identically (no "passes in fixture, breaks live").
- **Feasibility CONFIRMED (ui-designer, code-checked):** `reportBuilderStore` already has `activeTestMode` (`'none'|'test-report'|'designer'`) + `setTestMode` + `loadDataSet1User/All` + `testDataFieldMapping`; the live path reuses the existing `useLoadJobIntoReport` bridge. Build = extend an enum + a load path, not new infrastructure.

### Phase 0 (precursor) — Reconcile against CHRIS'S REGISTRY as the defining source (owner: ui-designer; co-arch reviews) — REFRAMED 2026-06-17
**The defining authority for the S1+S2 field set is Chris's registry — specifically the SOURCE XLSX `docs/valta share/Valta-field-v03.xlsx` (NOT the `.md`, which is a lossy view), and NOT our V3 code.** Key findings (ui-designer, xlsx-parsed):
- Authority = the **xlsx, ~45 field rows**, ALL Record Location='Job'. **The `VALTA-FIELD-SPEC.md` is a LOSSY conversion** — it dropped ~payment/date/logic fields (DeliveryTime, PaidDate, Paid, RequestDate, SignedDate, DueDate, AmountPaid, ClientDocuments, ZoningStatus, CMHCFinancing), the EA1–5 expansion, and several columns (App Location, Valcre Field Name/Label/ID/Key, Owner, Status). Use the xlsx; treat the .md as a stale view. (Earlier "37" came from the lossy .md; "62" was the spec header — actual ≈ **45**.)
- Those ~45 = the authoritative JOB-STAGE field set = **the S1+S2 UNION** (the explicit "what should our app have" definition Ben wanted).
- The deep building/data-gathering fields (Year Built, Building Size, Parcels, Assessments) are **STILL ABSENT** from the xlsx → CONFIRMS they're out of LOE-stage scope (Valcre/appraisal stage), not a gap. (Validates the S3/S4 exclusion.)
- The xlsx has an **`App Location` column but Chris left it BLANK for every field** → his registry does NOT designate app placement → the **S1-vs-S2 split (and section placement) is 100% OURS** (Ben confirmed). Chris defines MEMBERSHIP; we own the split.
- Our `field-registry-v6.html` (48 rows) already ≈ matches the xlsx set → **we weren't missing fields; the .md was just a lossy view.** Phase-0 reconcile = lay our 48 vs the xlsx ~45 (authority); already close.
- `'Required'` in the xlsx = OUR-APP-required (core client/property/cascade/LOE = Yes; payment/date/EA = No). Data note: `EA1` appears 5× in the xlsx = a merged-cell artifact for EA1–5.

**New Phase-0 procedure (flips the order — registry defines, code verifies):**
1. Take the xlsx **~45** as the canonical S1+S2 set (NOT the lossy .md).
2. **Reconcile our app against it — THIS IS THE S3-EXTRACTION COMPLETENESS CHECK (Ben's actual goal for this whole thread).** For EVERY one of the ~45 Chris-registry fields, check WHERE it currently lives in our app. The point: **before we "disregard Section 3 onward," guarantee we pulled EVERYTHING out of S3/S4 that belongs in S1–2.** The side-by-side sweep is the systematic guarantee — not a spot-check. `State of Improvements` + `Land Metric` are the two strays caught by eye → **MOVE S3→S2 is a HARD to-do THIS round (Ben: lock now, do not defer).** The sweep surfaces any OTHER stray beyond those two. Any app S1/S2 field NOT in the ~45 = bucket-4 review (operational extra → justify or drop, **never auto-remove**).
3. The code **`section-home` tag is now a RECONCILE INPUT (verify against), NOT the authority.** Chris's registry membership is the authority; the code tag confirms placement.
4. Assign each of the ~45 an **S1/S2 stage in OUR registry** (we own the split — `App Location` is blank, so no Chris confirm needed); render via the stage-filter.

**✅ PHASE-0 RESULT (ui-designer, 2026-06-17 — sweep + spike done):**
- **S3-EXTRACTION COMPLETENESS = CONFIRMED.** Our 52-row registry is a full SUPERSET of Chris's 41 job-level fields (the lone set-diff "miss" = a `'Paid '` trailing-space artifact, not real). Enumerating the S3 `OrganizingDocsSection`: the ONLY Chris-job-level fields stranded there are **`stateOfImprovements` + `landMetric`** (→ move S2). Everything else in S3 (`yearBuilt`, `buildingSize`, `numberOfUnits`, `parkingSpaces`, `environmentalAssessment`, `heritageConservation`, `legalDescription`) is deep building data NOT in Chris's registry → correctly STAYS S3. **Guarantee: only those 2 belong up; nothing else stranded.** (Count settled at 41 from the xlsx.)
- **EXTRAS (ours, not in Chris's set) = bucket-4 review, none auto-removed:** `CurrentUseImprovements`, `ProposedUseImprovements`, `PreviouslyAppraised`, `LegalDescription`, `ScopeOfWork`, `PropertyContact`, `ReportDate` (+ EA1–5 = the EA expansion vs Chris's single EA row). Surface for review during Chris's S2-tuning week.
- **SPIKE (v3key):** the form-STATE key IS reliably findable in the section files (captured exact: `statusOfImprovements`, `valueScenarios`, `clientEmail`, `propertyType`, `scopeOfWork`). **⚑ Auto-deriving v3key from the PascalCase name BREAKS on multi-word fields** (`stateOfImprovements`=capital O, `valueTimeframe`=capital T) → v3key MUST be captured EXPLICITLY per field, never algorithmically (this is exactly the "opaque id" rule, now proven). v4id capture = label/storeId match, not casing.
- **NET: no blockers. Ready for full v3key/v4id capture (co-arch review + QA reconcile).**

**⚑⚑ PHASE-1 MAJOR FINDING (ui-designer, 2026-06-17) — capture surfaced a V4 FIELD GAP, not just aliases.** Pulling V4's real `fieldRegistry.ts` S1/S2 set (83 entries) + grepping the whole registry, the in-scope fields split into THREE classes:
- **Class 1 — DIRECT/ALIAS** (exist both sides, normal v3key+v4id capture): client contact, property name/address/type/subtype, fee, report-type, scope-of-work, legal.
- **Class 2 — SEMANTIC RENAME** (exist in V4 under a different id): `InterestAppraised`→v4 `property-rights`, `AuthorizedUse`→v4 `intended-use`.
- **Class 3 — ⚑ ABSENT FROM V4 ENTIRELY** (0 hits in `fieldRegistry.ts`): `StatusofImprovements`, `ValueScenarios`, `ApproachestoValue`, `AssignmentType`, `Valuetimeframe`, `TransactionStatus`, `ZoningStatus`, `CMHCFinancing`, `LandMetric` (+ likely `DesktopReport`, `ClientDocuments`, `Current/ProposedUse`, `PreviouslyAppraised`). **V4's S1/S2 registry is the LOE-document/appraiser field set — it has NO field for the valuation-cascade + job-classification set that Chris's registry requires and V3 S2 collects.** This is WHY the §10 cascade "never bridged to the builder" (the Slice-3 finding) — V4 literally has no fields to land it in.

**⚑ CLASS 4 (NEW — found resolving InspectionDate, 2026-06-17): present-in-V4 + Chris-required but NOT COLLECTED IN V3.** `InspectionDate` exists in V4 (`report-inspectiondate`) and Chris requires it, but **no live V3 form collects it** (not intake, not LOE, not Valcre readback) — so there's no v3key; it's a **V3-COLLECTION GAP**. Tagged fail-closed in the registry (`v3=GAP-no-V3-input`, `st=mismatched-stale`) → the drift-check flags it, never silent-passes. **Fix = ADD a V3 INPUT** (opposite direction from 4b's add-to-V4). **Co-arch call: its OWN micro-item (Slice 4c), NOT folded into 4b** — 4b stays purely V4-side adds; 4c is a single V3-side input add that likely wants a form-placement nod (which V3 section) during Chris's tuning week. Low priority, no regression (V3 doesn't collect it today regardless). Tagged + carried, never dropped.
> **Full taxonomy the reconcile surfaced:** Class 1 (both, direct) · Class 2 (both, renamed) · Class 3 (Chris+V3, absent-from-V4 → add to V4 = Slice 4b) · Class 4 (Chris+V4, not-collected-in-V3 → add V3 input = Slice 4c).

**SCOPE DECISION (co-arch, recommend to Ben): BRANCH class 3 to its own next slice (Slice 4b), do NOT fold into Slice 4.**
- Slice 4 ships the shared-source machinery + drift-check + **classes 1+2** (fields that exist both sides) — Chris's tuning-week drift-protection lands now.
- **Class 3 = the "ADD-TO-V4 list"** — net-new V4 fields, each needing a `fieldRegistry.ts` entry + a template `{{placeholder}}` + the mandated **4-file sync** + test data + render-verify. That's heavier, different-in-kind work, and it's the SAME work that closes the Slice-3 cascade-bridge gap. The capture output IS the ready-made Slice-4b spec (registry defines them; V4 builds them; section-home=S2).
- Rationale: folding ~13 net-new fields would bloat Slice 4 and delay the drift-protection; branching sequences the risk and gets Chris protected on the existing fields sooner. **Pending Ben's bless (ui-designer briefing him in parallel).**

**⚑ BOTH HONEST FLAGS — RESOLVED (2026-06-17):**
- ~~37-vs-62 count~~ → **RESOLVED:** the xlsx (authority) has **~45** rows; the .md "37" was lossy + the "62" header was wrong. Reconcile our 48 vs the xlsx ~45.
- ~~Chris confirm for stage~~ → **DROPPED:** the xlsx `App Location` column is blank for every field, so placement is ours by definition (Ben confirmed). No Chris confirm on the split.

---

## Acceptance
1. Registry `FIELDS` carries `v3key` + `v4id` + layout metadata for the full S1/S2 set; QA reconciles aliases against real code (zero wrong aliases).
2. Generator emits a V4 config + a V3 drift-check off the one master; V4 S1/S2 builds from the generated config.
3. **Drift-check BLOCKS — MULTI-CASE + coverage-counted (QA):** introduce deliberate mismatches across SEVERAL fields (incl. a changed dropdown OPTION AND an unreadable/inline-option field) → the check FAILS on each. The check must REPORT how many fields it actually verified (coverage count) so it can't pass while blind to everything except the one broken field. A field marked `approved-change` passes; an unexplained mismatch blocks. Fail-closed: an uncheckable field FAILS, never skipped.
4. V4-only fields surfaced for review; none auto-removed.
5. Test-data fixture keyed to the canonical set; toggle OFF = fixture, ON = live V3→V4, both speaking the same contract; fixture is drift-checked too.
6. V3's live forms are UNCHANGED (no rebuild); intake/LOE still work exactly as today.
7. `tsc --noEmit` + build clean; deployed.

## ⚑ SCOPE BOUNDARY — Sections 1 & 2 ONLY (hard, Ben 2026-06-17 — do NOT let any agent drift past this)
**IN SCOPE — the only two V3 components matched to V4:**
- **Section 1 = `ClientSubmissionSection.tsx`** (client intake).
- **Section 2 = `LoeQuoteSection.tsx`** (LOE / valuation prep + the cascade).

**OUT OF SCOPE — verified in code, NEVER auto-map these:**
- **Section 3 = `OrganizingDocsSection.tsx`** (Building Information, etc.) **+ `PropertyInfoSection.tsx`** ("Data Gathering – Property Research": Zoning, Zone Code, Flood Zone, Parcels Summary, Assessments & Taxes, Land Value/Improved Value, etc.).
- **Section 4 = `Section4Compact.tsx`** (Document Upload & Organization: Land Title Certificate, Survey/RPR, Tax Notice, Aerial/Zoning/Flood maps, Building Permits, Site Plan).
- All Building Info / Property Research / Parcels / Assessments / Document-Upload fields are Section 3–4 → **not part of this slice, not mapped, not touched.**
> **⚑ NAME-COLLISION TRAP:** Section 3's "State of Improvements" (in `OrganizingDocsSection`) is a DIFFERENT field from Section 2's "Status of Improvements" cascade trigger. Only the **Section 2** one is in scope. Do not conflate them.

**Code-traced field classification (ui-designer, 2026-06-17 — the registry is BROADER than S1+S2, so phases FILTER to this subset):**
- **CONFIRMED IN-SCOPE (S2 / LoeQuoteSection):** `statusOfImprovements`, `zoningStatus`, `transactionStatus`, `cmhcFinancing`, `currentUse`, `proposedUse`, `previouslyAppraised`, `valueScenarios`, `authorizedUse`.
- **⚑ REVERSED 2026-06-17 — `StateofImprovements`/CF12409 + `LandMetric`/CF12426 are IN SCOPE (move S3→S2), NOT excluded.** We had excluded them on V3 CODE placement (they sit in `OrganizingDocsSection`). But Chris's authoritative registry (`docs/VALTA-FIELD-SPEC.md`, the Valta Master Field Registry) lists BOTH as JOB-LEVEL fields he wants: #18 State of Improvements + #35 Land Metric, Source=`User Input`, Required=Yes, Outputs=LOR/Excel/Word/ClickUp. State of Improvements feeding the **LOR** = a pre-acceptance/LOE output → by Ben's "if Chris wants it for the LOE, it's S2" rule, these belong in **Section 2**. **Registry wins over code placement** (it's the field-definition authority). Action: these two MOVE S3→S2 as part of this slice.
- **`tenancy` = S2-ONLY (corrected — no dual-home).** The earlier "dual-home" flag was a grep matching a COMMENT in `OrganizingDocsSection` ("Tenancy MOVED to Section 2 … 2026-06-10 migration"), not a live S3 field. So tenancy lives only in S2 — just CONFIRM, no spike resolution needed.
- **The S2/S3 duplicate cleanup Ben's rule targets was ALREADY DONE (2026-06-10 migration).** That migration moved `Status of Improvements`, `Property Subtype`, and `Tenancy` out of S3 into S2 (documented in `OrganizingDocsSection` comments). So there are no stale S2-twins to delete in S3 today.
- The per-field `section-home` tag (Phase 1) still systematically CONFIRMS no stale S2-twin remains in S3 — enforcement, not just trust in the June migration.

> **⚑⚑ REOPENED — NOT FOR SIGN-OFF YET (2026-06-17).** A scope-authority reframe is in flight: the State-of-Improvements/Land-Metric mismatch proved we've been scoping from OUR V3 CODE placement, when **Chris's registry (`docs/VALTA-FIELD-SPEC.md`) is the defining authority** for what S1/S2 SHOULD contain. ui-designer is detailing a proposal to make Chris's registry (stage-tagged) the defining source and reconcile our sections against IT — and briefing Ben. **Do NOT lock this spec or start build until that's folded.** The `section-home` (code-placement) tag becomes a *reconcile input* against Chris's stage tag, not the authority itself.
- **ENFORCEMENT MECHANISM (not "remembered"):** Phase 1 tags each registry field with its **V3 section-home** (the `v3key`→form-file trace IS the in/out classifier). Any field whose form lives in `OrganizingDocs`/`PropertyInfo`/`Section4Compact` is flagged **out-of-Slice-4**. Bucket-4 reverse-pass AND the drift-check both READ this tag → the S1+S2 boundary lives in the registry per-field, code-enforced.

## Out of scope (other)
- **The V3 forms refactor** (reading the registry live = Option A) — later, only if full auto-both-ways is wanted.
- Removing any V4-extra field — gated behind explicit review.
- Calculator track; SaaS/domain track.

---

*co-architect, 2026-06-17. Ben approved Option B. → QA spec-gate flaw-review (+ QA folds their 4 points into Phase 3) → ui-designer confirms Phase 1/2/4 mechanics + alias-capture feasibility → Ben sign-off → build (multi-owner) → QA build-verify (the deliberate-mismatch-blocks test is the proof).*
