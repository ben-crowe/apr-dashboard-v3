# Registry Rework — Charter + Work Package (Ben + Fable1 live session, 2026-07-16)

**Status:** BEN-APPROVED charter; work routes fable → co-architect (Main) → APR team.
**Prototype:** `public/s-tab-crosswalk.html` (all patterns below are LIVE on it; every change committed on this worktree today).
**MANDATORY FOR EVERY AGENT TOUCHING THIS:** run the full two-phase search (`/search-2phase`, both phases) on the field-registry / crosswalk / V3-V4 topic BEFORE any work. Read this file + the prototype page. No dump-and-execute.

## THE CHARTER (Ben's end-state, one sentence)

Two vocabularies total: OUR kebab ids everywhere we control (V3 = V4 = client's registry), and Valcre's names at the edge behind ONE mapping file.

1. **One internal language.** V3's database columns get renamed to the V4 kebab ids (migration sweep, all-at-once, not column-by-column). After it the bridge is a pipe, not a translator.
2. **Client adopts our ids.** Proposal to the client: his registry takes our kebab ids; his labels stay whatever he likes. The crosswalk page is the exhibit.
3. **Valcre stays foreign by design.** One ours→Valcre mapping file at the border. Nothing else translates anything.

## THE NAMING GRAMMAR (Ben-blessed)

Kebab, ordered **owner → object → part**: `client-address-street`, `client-address-city`, `client-address-postal`, `contact-address-street`.
(Valcre's ordering discipline, our kebab notation. Kills the client-city / client-organization-address disorder.)

## DROPDOWN VALUE IDS (Ben-approved design gap)

No dropdown value anywhere carries its own id — the display string IS the stored value (root of the Hotel mess). Rework gives every value a stable kebab id + display label, on the V4 side. Renames become label-only.

## THE BUILD (APR team, normal gates)

1. **Merge the crosswalk prototype INTO the Master Registry (Valta) page** (`public/master-registry-valta.html`) — keep the master page's tabs (Field Registry / Logic Fields / Scenarios / Mock Dashboard / Live Dashboard) and its group navigation (Job / Contact / Property / Building / Parcel) and Ben's dropdown toggles; bring in the prototype's columns: Reg-check | # | V3 (bold label + dash id, amber ≠ where it differs from V4) | V4 (bold label + id + values one-per-line indented) | Valta (client label + PascalCase id) | Valcre (dotted API name) | Status | Field Type. Master page is an early version: clean up, never delete.
2. **Filter spec — TWO tabs, Ben's exact semantics:**
   - **V3 tab:** ONLY rows with a V3 side, each showing its matching V4/Valta/Valcre. No gaps.
   - **V4 tab:** ALL V4 rows INCLUDING those with an empty V3 cell — the gaps are the point (shows what V3 does not feed).
3. **Rename sweep (migration):** every V3 column whose name drifts from its V4 id renames to the V4 id, one migration pass, grammar above. Worklist = the amber ≠ marks on the prototype. Includes `client_organization` → per grammar; `client_postal_code` question resolves to `client-address-postal` family.
4. **Bridge fix:** `useLoadJobIntoReport.ts` derives client-city/province/postal by PARSING the combined `client_address` string while real columns `client_city` / `client_province` / `client_postal_code` exist and are written by the intake form. Read the real columns.
5. **Fourth column reserved:** the full-length Valcre list (~the December VALCRE-TO-TEMPLATE-CROSSWALK, ~324 rows) — placeholder only, not yet.
6. **Explorer page rework notes (field-registry-v6.html):** System column goes; the two confusing tabs (Valta dashboard / Valcre) go; V3/V4 chips become the checkbox filters above; keep Ben's dropdown toggle pattern. Early version: clean up, never delete.
7. **Terminology, locked:** human words = **label**; kebab = **field id**. Never "field name".


## PER-COLUMN DROPDOWN VALUES (Ben, added same session — KEY requirement)

Each column shows its OWN system's values, indented under its own field:
- **V3 column:** V3's values. **V4 column:** V4's values.
- **Client (Valta) column:** EXACTLY the values from his Excel sheet's named ranges (e.g. ListPropertyType = 9 values incl Hotel) — verbatim, even where they differ from V3/V4. This is the key line: his column mirrors his sheet, never ours.
- **Valcre column:** Valcre's values, truncated with "…" when the list runs long.
The side-by-side value lists are where every dropdown dispute becomes visible (Hotel proved it).

## KNOWN EXTRACTION TRAP (bit us live — do not reintroduce)

When scraping fieldRegistry.ts for a field's options, BOUND the scan to that field's own entry (stop at the next `id:`) — an unbounded forward scan attaches the NEXT field's options to fields that have none (property-address briefly showed the property-type list). Same class: master-registry row numbers must come from the RENDERED page, not array order.

## STILL HELD (do not build — resolves inside this rework with Ben)

- Property-type VALUE SET (Hotel/Hospitality/Multifamily spellings, Seniors/Other). Receipt on file: the client's signed XLSX named range `ListPropertyType` ('Dropdown Lists'!$B$2:$B$10) = Multifamily, Self-Storage, Retail, Industrial, Office, Land, **Hotel**, Seniors, Other — Hospitality appears nowhere in the client file; it is our app's invention. Two contradicting 2026-06-17 records (registry annotation vs DROPDOWN-RECONCILIATION-FINDINGS) must be reconciled.
- Client's registry has 6 worksheets + ~16 DEFINED NAMES that ARE the dropdown lists — build value work on those named ranges, never on renderings.
- Possible no-join-key between the December crosswalk's Valcre named ranges and the client XLSX's PascalCase ids — test before assuming alignment.

## ALREADY DISPATCHED SEPARATELY (do not duplicate)

4 wiring gaps (assignment-type, transaction-status, zoning-status, cmhc-financing — on V3 job page, absent from v3OriginFields.ts; valuation-type is a DOCUMENTED exclusion, leave alone) · user-settings tab spec (29 appraiser/company fields) · dup reconciliations (appraiser-*/company-*, report-date pair, inspection-date pair) · Documents-to-Request relocation.
