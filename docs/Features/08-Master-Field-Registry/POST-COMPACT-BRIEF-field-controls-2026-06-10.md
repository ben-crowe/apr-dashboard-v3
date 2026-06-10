---
content_type: agent-brief
title: Post-Compact Brief for ui-designer — field control fixes (dropdown vs free-text)
status: READY TO HAND ui-designer when he returns from compact
created: 2026-06-10
owner: co-architect (audit) · ui-designer (executes)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
tags: [apr-workflow, field-registry, dashboard, dropdown, mock-vs-live, brief]
---

# Post-Compact Brief — field controls (what's a dropdown, what's wrong)

**Context:** Ben reviewed the MOCK and flagged several fields that look fully editable (free-text)
that should be dropdowns. Co-arch audited the LIVE app vs Chris's registry. Key finding: **the LIVE
app is mostly already correct — the MOCK is the laggard.** Only two fields are genuinely free-text
everywhere and need building.

## Live-app control audit (verified 2026-06-10)

Registry says these are dropdowns (`Select one/multiple option`). On the LIVE app they ALREADY
render as a proper `<Select>` — **no fix needed live**: Tenancy, State of Improvements, Status of
Improvements, Approaches to Value, Assignment Type, Report Type, Report Format, Analysis Level,
Value Timeframe, Previously Appraised, Transaction Status, Zoning Status, Land Metric, CMHC
Financing, **Property Subtype**, Scope of Work.

(Property Rights, Authorized Use, Client Documents, Property Type, Valuation Premises, Asset
Condition use other controls / live in ClientSubmissionSection — not flagged, verify only if a
specific oddity shows.)

## ⭐ OPERATING MODEL (Ben, 2026-06-10) — MOCK IS THE SOURCE OF TRUTH

**Do ALL of this on the MOCK first. Do NOT edit the live dashboard at all yet** — no moving fields
up on live, no removals on live, no piecemeal live edits. Perfect Section 2 + the whole layout on the
mock → Ben reviews + approves the mock → THEN a single pass makes the live match the mock. The live's
duplicate/leftover sections clear as a CONSEQUENCE of that "make live = mock" pass, not as a separate
first step. (The live stays messy meanwhile — fine, we work from the mock now.)

The dedup spec below describes the END STATE the mock should reflect (and the live will inherit on
sync) — it is NOT a license to start editing the live now.

**1a. Remove the "Appraisal Assignment" group from Data Gathering (PropertyInfoSection).** Every
field in it is LOE-prep now living in Section 2 — remove the whole group:
Assignment Type · Approaches to Value · Transaction Status · Zoning Status · Desktop Report (delete
entirely) · Value Timeframe (**verify it's actually in Section 2 first — was NOT visible in Ben's
Section 2 view; don't delete the only copy**). Data Gathering then keeps only the real research
groups: Property Site · Parcels Summary · Assessments & Taxes.

**1b. Building Information (OrganizingDocsSection) strays:**
- **Status of Improvements** — DUPLICATE (rendered in BOTH LoeQuoteSection + OrganizingDocsSection).
  Remove the Building-Info copy.
- **Property Subtype + Tenancy** — live code has them ONLY in Building Info (NOT in Section 2 yet) —
  MOVE them up to Section 2's "Value Scenarios & Approaches" group (mock already has them there).
- KEEP in Building Info: Year Built, Building Size, Number of Units, Parking Spaces, State of
  Improvements *(NOT Status — different field)*, Land Metric, Env. Assessment, Heritage, Legal
  Description.

**1c. Remove the "Other" section** (Lead Appraiser + Desktop Report) — see item F.

**Safety:** the duplicated status/transaction/zoning fields are one underlying value shown twice
(FLAG-1) — removing the extra copy loses no data, breaks no sync. Don't touch sync arrays.

**3-way option divergence to resolve (NOT a blocker for the dedup, but flag it):**
- **Property Subtype** — three conflicting option lists: LIVE app (Low-Rise/Mid-Rise/High-Rise/
  Garden/Walk-Up/Townhouse/Mixed-Use) ≠ Chris registry (Apartment/Townhouse/Mixed Use/Shopping
  Centre) ≠ Valcre live SecondaryType (Apartments/Low-rise/Multifamily/Warehouse). Reconcile (QA
  PV-1 + client trail) before trusting any one set when it moves up.
- **Land Metric** — LIVE app offers AREA units (Square Feet/Acres/Hectares) but Chris registry
  "Land $/Metric" is DOLLAR-per-unit ($/Unit/$/FAR/$/SF/$/Acre) — nearly two different fields.
  Flag to client trail.

## THE ACTUAL FIXES

### A. Genuinely free-text on LIVE — must BUILD as dropdowns (both live + mock)

Only two. Convert to single-select dropdowns, options from Chris's registry Dropdown Lists tab:

- **Current Use** (`currentUse`, LoeQuoteSection.tsx:1496 — currently `<Input type=text>`) → dropdown.
  Options (`ListCurrentUseImprovements`): Vacant Land · Single Family · Multifamily · Retail ·
  Industrial · Office.
- **Proposed Use** (`proposedUse`, LoeQuoteSection.tsx:1499 — currently `<Input type=text>`) → dropdown.
  Options (`ListProposedUseImprovements`): Not Applicable · Single Family · Multifamily · Mixed Use ·
  Retail · Industrial · Office.
  (Test-data value "Multi-tenant industrial / warehouse" is NOT a valid option — use "Industrial".)

### B. Mock-only mismatches — bring the MOCK in line with the LIVE app

The live app already has these as dropdowns; the mock wrongly shows free-text. Fix the MOCK to match
live (the live app is the more-correct reference here). Confirmed example: **Property Subtype** (live
= `<Select>`, mock = free-text input). **Audit the whole mock against the live controls** and fix any
field the mock renders as free-text that live renders as a dropdown.

### C. Purpose (2.3) — leave free-text, it's correct; do NOT make it a dropdown

Purpose is genuinely free-text (NOT in Chris's registry as a field; an orphan). It is *meant* to feed
the LOE "Purpose of the Assignment" paragraph (prose), but is **not yet wired** to the LOE. Actions:
- Keep it as a free-text box (editable is correct).
- Tooltip: "free text — fills the LOE Purpose of the Assignment paragraph (wiring pending)." Do NOT
  say "Chris requested it" — he didn't.
- Test value = a SENTENCE, not "Financial Reporting" (that collides with the Authorized Use dropdown
  option). Use: "To estimate the current market value of the subject property in support of the
  client's refinancing application."
- Real build item (separate): wire Purpose field → the LOE Purpose paragraph token.

### D2. Authorized Use — auto-fill from intake Intended Use (Ben 2026-06-10)

Authorized Use is NOT a separate pick — it auto-carries from the intake **Intended Use** field.
- **Mock:** render it auto-filled-from-intake + tooltip "Auto-filled from Intended Use (set at intake)
  — picks from the field above." When Fill blanks the cascade inputs, do NOT blank Authorized Use.
- **Value Scenarios tooltip:** "Computed from Status of Improvements + Authorized Use (the cascade)."
- **Live wiring to-do (verify/build on sync):** generateLOE already falls back
  `jd.authorizedUse || job.intendedUse` (LOE side half-wired), but the DASHBOARD must actually
  auto-populate Authorized Use from the intake Intended Use. Confirm/build — likely react-spec/
  fullstack, not visual.

### D. Job Status (2.2) — wire to Valcre native Status (separate build)

NOT free-text, NOT a pipeline tracker. Reflects Valcre's native Status. Interim: locked/italic, no
tooltip. Real build = two-way Valcre Status sync (push + pull). See PROPOSED-SECTION-RESORT
open-items.

### E. Property Subtype value reconcile (Chris item, via QA PV-1)

Chris's 4 subtype values (Apartment/Townhouse/Mixed Use/Shopping Centre) do NOT match Valcre's live
`SecondaryType` values (Apartments/Low-rise/Multifamily/Warehouse…); "Apartment" vs "Apartments" =
silent-no-write risk; no industrial subtype. Either adopt Valcre's actual values (recommended) or
Chris expands his list. On the client-review trail; not a build blocker.

### F. Remove the "Other" section — delete Lead Appraiser + Desktop Report (Ben 2026-06-10)

Both confirmed removable; removing both empties the section, so delete the whole **"Other"
SectionGroup**.
- **"Other" SectionGroup** lives in LoeQuoteSection.tsx (~L1583) and contains exactly **Lead
  Appraiser** (~L1585) + **Desktop Report** (~L1597). Remove both fields → remove the SectionGroup.
- **Lead Appraiser** — not in Chris's registry at all (Ben: remove).
- **Desktop Report** — Chris said delete; already un-wired from Valcre (CF12050 doesn't exist on
  tenant), the UI field just lingered. Safe to remove.
- **Duplicate Desktop Report** ALSO renders in PropertyInfoSection.tsx (~L110-111) — remove that
  copy too.
- Safe: neither is in VALCRE_SYNC_FIELDS; removing the UI controls breaks no sync. (Leaving the
  unused `leadAppraiser`/`desktopReport` state keys is harmless; clean if trivial.)

## Post-migration VISUAL items (QA captured, 2026-06-10) — do AFTER the migration lands

**SIZING (already routed to ui-designer — queued behind migration as a layout-only commit):**
1. **WIDTH (the big one):** live has NO width cap — `JobDetailView.tsx:49` outer div stretches
   full-viewport → the side dead-space. Mock caps at max-width 960px centered. FIX: add
   `max-w-[960px] mx-auto` at that outer div (tune if a wide section needs more).
2. **DENSITY:** live `space-y-8` (32px gaps) + `py-6 pb-32` = bulky/long. Tighten to ~space-y-4/5,
   trim padding, match the mock's CompactField density.
3. NOT font — inputs already h-7/small. Pure spacing + width.

**POLISH (QA captured, NOT yet dispatched — needs a separate dispatch):**
Live MIXES input styles — some underline (LoeQuote h-7 border-b), others BOXED (addresses h-9
bg-card border) = the inconsistent "no underline" look Ben flagged. Mock = ONE consistent underline
style + `.f:hover` row-tint + underline brighten-on-hover/darken-on-focus + dropdown item hover/
selected states. FIX: all live inputs → underline-style, add row-hover glow + transitions + dropdown
polish. (Dispatch this to ui-designer as a separate visual pass after the structural migration.)

## Parked follow-up (after the mock's dialed) — Ben 2026-06-10

**Client-submission → Section 1 mapping check.** The intake/client-submission form is where Section 1
data originates. Verify that EVERY field a client submits has a proper receiving field in Section 1
(Client Information & Property Details) — no submitted answer should land nowhere. Cross-check the
public SubmissionForm fields → job_submissions → Section 1 display. Do this after the mock is
finalized; it's a separate verification pass.

## Hard rules (unchanged)

- **Mock first, then live** for any new change — EXCEPT the two genuine builds (A) land on both;
  the mock-catch-up (B) makes the mock match live.
- Do NOT touch the VALCRE_SYNC_FIELDS / CLICKUP_CARD_FIELDS arrays, the sync if-chain, or the
  file-upload section. Preserve every field binding. Type-check + build clean. QA readback-verifies.

## Comb-through polish notes (Ben, mock review 2026-06-10) — batch into ONE polish pass

**Full-width single-control rows → constrain to left-column width.** When a dropdown/input sits ALONE on a row (no second field beside it), its control + underline currently stretches edge-to-edge across the full page width — looks goofy. Should sit at the normal left-aligned column width, same as paired-row inputs.
- Confirmed offenders: **Scope of Work**, **Payment Terms** (+ "a couple more" — audit all solo-on-a-row controls).
- **Correct reference already in the layout: Value Timeframe** — its dropdown stays tucked to one side at proper width. Match that treatment exactly.
- Fix on the mock (source of truth) → carries to live on sync.

**REGRESSION — field-table (bottom of mock) expanded dropdown options jumped back to far-left.** In the mock's bottom field-registry TABLE, when you click a row's toggle to reveal its dropdown options, the options should render directly UNDER the toggle/sub-option name (so the eye doesn't travel). They regressed to appearing flush at the far left (the old behavior). Restore the under-the-toggle drop position — it was the nicer, no-scan version. (Mock-page field table, not the dashboard field rows.)

**Top-ribbon test-data control → frameless text links + add a Clear (Ben 2026-06-10).** Remove the button FRAME around the test-data control in the very top ribbon — it should be subtle/hidden, not in-your-face. No button boxes at all, just text words. Add a "Clear" action (wipes the test data back to empty). Layout, left→right: **Clear** · thin vertical divider · **Fill with Test Data** — all frameless text, subtle styling. Clear first, then the divider, then Fill.

**Empty-state for plain dropdowns → shaded dash "—" (Ben 2026-06-10).** Select dropdowns currently have only word options, so an unchosen one still displays a word and looks filled. Unchosen/empty dropdowns should show a shaded dash "—" placeholder (the empty state), so empty reads as empty and only a real selection shows a solid word. Consistency goal: one visual language dashboard-wide — shaded dash / "Pending" = empty, solid bright = filled. Apply to all plain Select fields that can be unselected.

**Empty-state language — TWO meanings, refine (Ben 2026-06-10):**
- **"Pending"** (shaded) = a DERIVED field that auto-fills once an upstream choice is made (the cascade). Applies to **Value Scenarios** AND **Approaches to Value**. (Approaches currently shows a "—" — change it to "Pending" to match its sibling.)
- **"—"** (shaded dash) = a USER-CHOICE dropdown that simply hasn't been picked yet (Property Subtype, Tenancy, etc.).
- Rationale: the empty state itself signals whether the user must act. Pending = it fills itself; dash = you pick it. Keep the two distinct everywhere.

**Empty-state language — FINAL (Ben 2026-06-10, supersedes the dash):** Use a WORD that signals whose job it is — NOT a bare "—" (a dash doesn't say whether to act).
- **"Choose"** (shaded) = USER-CHOICE empty — the user must pick. Property Subtype, Tenancy, Scope of Work, Status of Improvements (cascade DRIVER is a user pick), and all plain user dropdowns.
- **"Pending"** (shaded) = DERIVED empty — auto-fills from the cascade, not the user's job. Value Scenarios, Approaches to Value.
- DROP the bare-dash empty state entirely; replace any "—" empty with "Choose" (user) or "Pending" (derived) as appropriate.

**Cascade Options picker → add a scoped "Clear" entry (Ben 2026-06-10).** The cascade section is where a user will experiment repeatedly, so it needs its own discoverable reset. Add **Clear** as an entry INSIDE the Cascade Options dropdown — set off from V1-V4, placed at the TOP (before V1) as the "back to nothing" reset. Picking it resets ONLY the cascade: Status of Improvements → "Choose", Value Scenarios + Approaches → "Pending", picker label → back to "pick a scenario". Leaves the rest of the dashboard untouched. (Distinct scope from the global top-ribbon Clear, which wipes ALL test data.)

**Empty-state — CORRECTION (Ben 2026-06-10, supersedes "Choose"):**
- User-choice empty word = **"Select…"** (with trailing ellipsis), NOT "Choose". "Select" is the correct dropdown convention.
- CRITICAL: the empty placeholder (both "Select…" and "Pending") must render **shaded/dim gray, NOT bright white** — bright made empty fields read as filled. Reference treatment already correct in-app: "Client Documents: Select…" (dim + ellipsis). Match it.
- Rule: empty = DIM (Select… / Pending); only a REAL selected value is bright.
- Dates ("yyyy-mm-dd") + Year Built: dim when empty, brighten once set.

**More mock-comb items (Ben 2026-06-10) — perfect on MOCK, then ONE push to live:**
- **Section 1 client fields** (First/Last Name, Phone, Email, Title, Org) have NO empty-state view — give them the dim placeholder treatment, consistent with the empty-reads-as-empty rule.
- **Address fields need an underline** — on live they're still the boxed h-9 inputs from the migration (no underline). Convert to underline-style like every other field (this is the mixed-input POLISH offender).
- **Sizing may not have deployed** — Ben says the live site still isn't tighter (max-w-[960px] + density). Verify it actually landed on live; re-push if not.
- **WORKING MODEL reaffirmed:** perfect ALL small detail on the mock → ONE clean deploy so live matches mock in a single push → THEN Ben combs the live site. No half-synced live combing.
