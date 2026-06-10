# Per-Section "Test Data" Buttons — Ground-Truth Research

> Research-only doc. No code was modified. Every claim below carries a file:line citation
> against the live codebase (`~/Development/APR-Dashboard-v3`) as of 2026-06-09.
> Purpose: accurate starting point for a PRD to make these buttons fill PROPER, versioned,
> cascade-aware test data (like the HTML Field Registry / Logic-Fields tool).

---

## TL;DR

Each job-detail section has its OWN small "Test Data" button wired to its OWN private
`fillTestData()` function. There is no shared control and no shared dataset. Each handler
builds a hardcoded inline object and pushes it through the section's `onUpdateDetails`
callback into the single job-details state object. The values are **mostly static, partly
randomized each click**, and **completely ignore the LOE cascade logic** — they set the
cascade *output* field (`valuationPremises` / `valueScenarios`) directly to a random value
rather than setting the *input* (`statusOfImprovements`) and letting `loeCascade.ts` derive
it. That is the root of the "stale hand-typed cascade-output fields" problem Ben flagged.

There is a SECOND, unrelated test-data system (`src/utils/testDataGenerator.ts` +
`src/components/ui/TestDataButton.tsx`) that powers the public intake form — it is fully
randomized but is NOT what the job-detail section buttons use. Do not confuse the two.

---

## 1. WHERE the per-section "Test Data" buttons are implemented

**One button per section, each a per-section variant** — NOT a shared control. Each lives
inline inside its section component, in the action-button row of the section header/body
(opposite View-in-Valcre / Preview & Send). Each has its own private `fillTestData()` (the
client section names it `fillClientTestData`).

The LIVE accordion is `JobDetailAccordion.tsx` (confirmed canonical by
`src/components/dashboard/JobDetailView.tsx:3` — *"Use the correct clean version"*; the
`...Independent` and `...Simple` variants are explicitly marked "DO NOT USE" / "TEMPORARY").
So the buttons that matter are the ones in the NON-Independent section files:

| # | Section title (UI) | Component | Button render | Handler |
|---|---|---|---|---|
| 1 | "Client Submission" | `ClientSubmissionSection.tsx` | line 398-403 ("Test Data") | `fillClientTestData` @ 171 |
| 2 | "LOE Quote & Valuation Details" | `LoeQuoteSection.tsx` | line 1072-1083 ("Test Data") | `fillTestData` @ 832 |
| 3A | "Building Information & Client Documents" | `OrganizingDocsSection.tsx` | line 180-190 ("Test Data") | `fillTestData` @ 140 |
| 3B | "Data Gathering - Property Research" | `PropertyInfoSection.tsx` | line 125-135 ("Test Data") | `fillTestData` @ 84 |
| 4 | "Section 4" (docs/data-gather) | `Section4Compact.tsx` | renders via `fillTestData` @ 42 | `fillTestData` @ 42 |

All five are imported by the live accordion: `JobDetailAccordion.tsx:3-7`.

**A separate, parallel implementation exists and should be ignored for this work:**
`src/components/ui/TestDataButton.tsx` is a reusable component (props `onFillData`,
`dataType`) that calls the randomized generators in `src/utils/testDataGenerator.ts`. It is
used by the **public intake form** (`src/components/SubmissionForm.tsx`), the test-input
dashboard, and the `...Independent` (dead) section variants — NOT by the live job-detail
sections. It is also dev-only gated (`TestDataButton.tsx:67-74`). Knowing it exists matters
because it is the closest thing to "proper varied data" already in the repo and could be a
pattern source, but it is not what the job-detail buttons run today.

---

## 2. WHERE the job-detail fields are managed (state/store/form)

There is no Zustand store for the job-detail page (the 8,787-line Zustand store is the
standalone Report Builder, a different subsystem). Job-detail field values live in plain
React state inside the `useJobDetail` hook:

- `src/hooks/useJobDetail.ts:11` — pulls `jobDetails` / `setJobDetails` from `useJobData(jobId)`.
- `src/hooks/useJobDetail.ts:27-33` — `handleUpdateDetails(newDetails)` merges the partial
  into the single `jobDetails` object, calls `setJobDetails(updatedDetails)`, then
  `debouncedSave(updatedDetails)` (auto-persist to Supabase).
- This `handleUpdateDetails` is passed down as `onUpdateDetails` through
  `JobDetailAccordion.tsx:35,42,49,55,...` to every section.
- Source of the data on load: `src/hooks/useJobData.ts` (e.g. `:159` maps
  `loeData.value_scenarios → valueScenarios`, `:213` maps
  `propertyData.status_of_improvements → statusOfImprovements`).

So every section shares ONE flat `jobDetails` object. A Test Data button just merges its keys
into that object. The shape is `JobDetails` in `src/types/job.ts`.

---

## 3. WHAT a Test Data button DOES when clicked (click trace)

Identical pattern in all five sections:

1. Button `onClick={fillTestData}` (e.g. `LoeQuoteSection.tsx:1075`,
   `PropertyInfoSection.tsx:128`, `OrganizingDocsSection.tsx:183`,
   `ClientSubmissionSection.tsx:399`, `Section4Compact.tsx` via handler @ 42).
2. The handler guards `if (!onUpdateDetails) return;`.
3. It builds a local `const testData = { ... }` object (hardcoded inline in the handler).
4. It calls `onUpdateDetails(testData)` — e.g. `LoeQuoteSection.tsx:882`,
   `PropertyInfoSection.tsx:110`, `OrganizingDocsSection.tsx:158`,
   `Section4Compact.tsx:63`.
5. That routes to `useJobDetail.ts:27` → merges into `jobDetails` → `setJobDetails` →
   `debouncedSave` (auto-saves to Supabase).
6. Fires a `toast.success(...)` confirmation.

**Data source = the inline object literal hand-written in each handler.** There is no shared
dataset file, no JSON, no versioned set, no registry lookup. The LOE handler is the only one
that imports anything (`generateAppraisalTestData` from `testDataGenerator.ts` at
`LoeQuoteSection.tsx:21`) — but note it does **not actually use** that import inside
`fillTestData` (832-884); the handler hardcodes its own values.

---

## 4. WHAT data it fills — static vs randomized, same-every-time vs reshuffle

**Mixed, per section. None of it is "proper" in the sense of being a curated, realistic,
versioned dataset.** Breakdown:

### LOE Quote & Valuation Details — `LoeQuoteSection.tsx:832-884` (the section Ben named)
Deliberately MIXED static + random ("MIX of static (business-critical) and dynamic (for variety)"):
- **STATIC** every click: `appraisalFee: 6000`, `retainerAmount` = 20% of fee (`STATIC_FEE * 0.20`),
  `reportType: 'Appraisal Report'`, `paymentTerms: 'On LOE Signature'`, `deliveryTimeframe: '14 days'`,
  `deliveryDate` = today + 14 days (`:840-842`).
- **RANDOM each click** (reshuffles): `propertyRightsAppraised`, `valuationPremises`,
  `scopeOfWork`, and the appraiser/internal-note strings — all via
  `getRandom(arr)` = `arr[Math.floor(Math.random()*...)]` (`:845-851, 865-868, 874`).
- So clicking twice gives the SAME fee/dates but a DIFFERENT property-rights / valuation /
  scope pick each time.
- Note: `jobNumber` intentionally omitted (`:864` — comes from Valcre API).

### Client Submission — `ClientSubmissionSection.tsx:171-220+`
Heavily **RANDOMIZED** each click: random first/last name, title, company, address, phone,
email, property name/type, intended use, condition, sqft (`:190-217`, all
`Math.random()`-driven). Sets `valuationPremises: 'Market Value'` (static, `:211`). Also
injects mock `files` (`:218+`).

### Building Information & Client Documents — `OrganizingDocsSection.tsx:140-160`
Fully **STATIC** — same values every click: `yearBuilt: '1998'`, `buildingSize: '25000'`,
`numberOfUnits: 24`, `tenancy: 'Multi-Tenant'`,
**`statusOfImprovements: 'Improved - Under Renovation'`** (`:150` — this is the one section
that sets a real cascade INPUT; see Section 7).

### Data Gathering - Property Research — `PropertyInfoSection.tsx:84-112`
Fully **STATIC** — same every click: zoning, parcel number, building areas (`grossBuildingAreaSf: 185908`),
`yearBuilt: 2027`, assessment/tax values, etc. (`:87-108`).

### Section 4 — `Section4Compact.tsx:42-65`
Fully **STATIC** — same every click: a set of mock document URLs (`/test-docs/...`),
assessment split values, `documents_complete_count: 9` (`:45-61`).

**Summary:** two sections randomize each click (LOE partial, Client full), three are fixed
static. None pull from a shared/versioned data source. The randomization is for "variety in
testing," not realism — names and picks are arbitrary, not a coherent real property record.

---

## 5. HOW someone would MODIFY what it fills today

Today you edit the **inline object literal inside each section's `fillTestData()`** — there is
no central definition file:

- LOE values: edit `LoeQuoteSection.tsx:835-880`.
- Client values: edit `ClientSubmissionSection.tsx:171-220`.
- Building/3A values: edit `OrganizingDocsSection.tsx:143-156`.
- Property/3B values: edit `PropertyInfoSection.tsx:87-108`.
- Section 4 values: edit `Section4Compact.tsx:45-61`.

To add a value: add a key to the relevant object (key must match a `JobDetails` field name in
`src/types/job.ts` and the section's input `name`/binding). To add a "versioned set":
**there is no mechanism today** — you would have to invent one. The closest existing pattern
to copy is the intake generator (`src/utils/testDataGenerator.ts`, which has pooled
randomization) and the Report Builder's `TestDataSet1.ts`
(`src/features/image-configurator/report-builder/data/TestDataSet1.ts`) — both are separate
subsystems, neither is wired to the job-detail buttons.

---

## 6. COVERAGE — does every section have one, does it fill all fields?

- **Every live job-detail section has a Test Data button** (all 5 listed in Section 1).
- **None fill ALL fields in their section** — each fills a curated subset of keys the author
  chose. Examples of partial coverage:
  - LOE: fills the quote/valuation/payment fields but intentionally skips `jobNumber`
    (`:864`) and does NOT set `statusOfImprovements`, `authorizedUse`, or `valueScenarios`
    as cascade-consistent (see Section 7).
  - Building/3A sets `statusOfImprovements` but the derived `valueScenarios` is never filled
    here.
  - Client section fills client + minimal property fields, leaves many property-detail fields
    to other sections.
- **Incomplete/missing notes:** there is no test data for some cross-cutting fields, and the
  fields most prone to staleness are exactly the cascade OUTPUT fields (`valueScenarios`,
  the §10 narrative slots) which no button populates correctly.

---

## 7. RELATIONSHIP to the field registry + cascade logic (`src/utils/loe/loeCascade.ts`)

**This is the crux of Ben's flag.** The Test Data buttons do NOT respect the cascade.

How the cascade actually works (`src/utils/loe/loeCascade.ts`):
- `STATUS_TO_SCENARIOS` (`:29-37`) maps a `statusOfImprovements` value → an ordered list of
  Value Scenarios. `INSURANCE_OVERRIDE_SCENARIO` (`:40`) overrides when authorized use =
  Insurance.
- `deriveValueScenarios(statusOfImprovements, authorizedUse)` (`:97-102`) is the input→output
  derivation.
- `resolveNarrative(scenario)` (`:108-111`) maps a scenario → §10 narrative text.

Where the cascade is consumed: **ONLY in `src/utils/loe/generateLOE.ts`** (`:175, :218,
:254`) — i.e. at LOE-document GENERATION time, not in the live editing UI. Verified:
grepping the whole `src/` tree, the only importers of `deriveValueScenarios`/`resolveNarrative`
are `generateLOE.ts`. The live `LoeQuoteSection` editing UI does NOT call the cascade.

What the LOE Test Data button does instead:
- It sets `valuationPremises` to a RANDOM pick from a hardcoded array
  (`LoeQuoteSection.tsx:846, 866`) — this is a cascade OUTPUT-ish field set directly.
- It does NOT set `statusOfImprovements` or `authorizedUse` at all.
- The actual `Value Scenarios` UI field (`LoeQuoteSection.tsx:1337-1340`) is a plain
  multi-select bound straight to `jobDetails.valueScenarios` — a hand-typed/independent value
  with no live derivation from status.

Net effect (exactly the bug Ben described): the displayed Value-Scenarios / valuation fields
hold whatever was typed or randomly dumped, and they do NOT update when
`statusOfImprovements` changes. The only place the two are reconciled is when the LOE document
is generated — so the on-screen values can be stale relative to the cascade rules.
`OrganizingDocsSection.tsx:150` sets a valid `statusOfImprovements` ('Improved - Under
Renovation') but nothing derives the matching scenarios back into `valueScenarios` for display.

---

## Current state vs. what a proper versioned-test-data feature needs (PRD starting point)

### Current state (honest summary)
- 5 independent inline `fillTestData()` handlers, one per section, no shared source.
- Data is a hand-written grab-bag: 3 sections static, 2 partly/fully randomized per click.
- "Random" = arbitrary variety, NOT realistic coherent property records.
- Buttons dump values directly into the flat `jobDetails` state and auto-save.
- Cascade logic (`loeCascade.ts`) is bypassed entirely by the buttons; it only runs at LOE
  doc-generation. Cascade-output fields (Value Scenarios, §10 narratives) are therefore
  hand-typed and go stale.
- No version concept, no "pick a version → Fill" UX, no single source of truth.

### What a proper versioned feature would need
1. **A single source-of-truth dataset** (or a small set of named, versioned datasets) — e.g.
   `loe-v3.1`, `multifamily-renovation`, `vacant-land` — analogous to the Field
   Registry / Logic-Fields tool's versioned sets. Candidate home: a `data/` module mirroring
   the Report Builder's `TestDataSet1.ts` pattern, but keyed to `JobDetails` field names.
2. **Realistic, internally-consistent records** — one coherent property (status, scenarios,
   fees, narratives all agreeing) rather than per-field random picks.
3. **Version-picker UX** — a small dropdown/popover at the section header (or one global
   control) to choose a dataset version, then "Fill Test Data" applies it. Mirrors the
   HTML Field Registry tool's "pick a version → Fill" flow.
4. **Cascade-aware fill** — the fill must set INPUTS (`statusOfImprovements`, `authorizedUse`)
   and then run `deriveValueScenarios()` + `resolveNarrative()` to populate the OUTPUT fields
   (`valueScenarios`, §10 narrative slots) so on-screen values match the cascade rules.
   This also implies making the live UI run the cascade on status change — fixing the stale
   field bug independent of test data.
5. **Field-registry alignment** — fill keys validated against `JobDetails`
   (`src/types/job.ts`) and, where relevant, the Master Field Registry, so coverage gaps and
   key typos surface.
6. **Optional dev-gating decision** — the intake `TestDataButton` is dev-only; the
   job-detail buttons currently are NOT gated. Decide whether versioned test data stays
   visible in production.

### Key files for the build phase
- Buttons/handlers: `src/components/dashboard/job-details/{LoeQuoteSection,ClientSubmissionSection,OrganizingDocsSection,PropertyInfoSection,Section4Compact}.tsx`
- State: `src/hooks/useJobDetail.ts`, `src/hooks/useJobData.ts`, `src/types/job.ts`
- Cascade (must be honored): `src/utils/loe/loeCascade.ts`, consumed in `src/utils/loe/generateLOE.ts`
- Existing pattern references: `src/utils/testDataGenerator.ts` (pooled random),
  `src/features/image-configurator/report-builder/data/TestDataSet1.ts` (versioned dataset shape)
