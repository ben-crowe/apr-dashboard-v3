---
id: spec-address-structured-split
title: "Build Spec — Structured address (client + property): Street / City / Province / Postal"
status: ready-for-build
created: 2026-06-16
updated: 2026-06-16
type: build-spec
owner: ui-designer (spec/mock) · react-spec (build) · qa-agent (verify) · Ben (direction)
mock_reference: ~/Development/APR-Dashboard-v3/public/field-registry-v6.html  (Mock Dashboard view — client 1.7/1.7b/1.7c/1.7d, property 1.12/1.12b/1.12c/1.12d)
tags: [apr-workflow, loe, address, dashboard, intake, data-model, valcre, build-spec]
---

# Build Spec — Structured address (client + property)

> **REVISED 2026-06-16 → FOUR fields, not two.** Decision (Ben): map to what Valcre actually stores.
> Valcre's address = four structured fields (`AddressStreet` / `AddressCity` / `AddressState` /
> `AddressPostalCode`), so our fields become four — each maps **1:1**, NO parsing anywhere. This
> SUPERSEDES the earlier two-field (`…Locality`) draft. The registry currently defines address as one
> free-text field and is silent on the breakup (logged as a Chris question) — Valcre's four are the only
> authoritative structured names, so we follow those. Mock is the visual source of truth.

## The four fields (both client + property)
| Our field (camelCase) | DB column (job_submissions) | Valcre field | Valcre display |
|---|---|---|---|
| `clientAddress` (street — EXISTING, now street-only) | `client_address` | `AddressStreet` | Street |
| `clientCity` (NEW) | `client_city` | `AddressCity` | City |
| `clientProvince` (NEW) | `client_province` | `AddressState` | State/Province |
| `clientPostal` (NEW) | `client_postal_code` | `AddressPostalCode` | ZIP/Postal |
| `propertyAddress` (street — EXISTING, now street-only) | `property_address` | `AddressStreet` | Street |
| `propertyCity` (NEW) | `property_city` | `AddressCity` | City |
| `propertyProvince` (NEW) | `property_province` | `AddressState` | State/Province |
| `propertyPostal` (NEW) | `property_postal_code` | `AddressPostalCode` | ZIP/Postal |

## Files + changes
1. **DB migration** — add 6 nullable-text columns to `job_submissions`: `client_city`, `client_province`, `client_postal_code`, `property_city`, `property_province`, `property_postal_code`. (`client_address`/`property_address` stay, now hold street only.)
2. **`src/integrations/supabase/types.ts`** — add the 6 columns (Row/Insert/Update).
3. **`src/types/job.ts`** — add `clientCity? clientProvince? clientPostal? propertyCity? propertyProvince? propertyPostal?: string`.
4. **`src/components/dashboard/job-details/ClientSubmissionSection.tsx`** (holds BOTH addresses):
   - Client: "Address" → **Street Address** (`clientAddress`) + **City** (`clientCity`) + **Province** (`clientProvince`) + **Postal Code** (`clientPostal`).
   - Property: "Property Address" → **Street Address** (`propertyAddress`) + **City** (`propertyCity`) + **Province** (`propertyProvince`) + **Postal Code** (`propertyPostal`).
   - All new fields auto-save + add to the field sync list AND the `syncData` PAYLOAD (mirror `clientAddress` ~L53/128/445-447). Layout per mock (Street row, then City/Province/Postal).
5. **`src/components/SubmissionForm.tsx`** (intake) — split both addresses into the four inputs each; submit into the new columns.
6. **Valcre — map 1:1, DELETE the parser (this is the simplification + it FIXES the truncated-street bug):**
   - **UPDATE path `api/valcre.ts`** (~L1010): set `AddressStreet=clientAddress`, `AddressCity=clientCity`, `AddressState=clientProvince`, `AddressPostalCode=clientPostal` **directly** — REMOVE the `parseAddress(clientAddress)` call for the contact (it took only the first comma-segment as street → dropped "1776 Maple Way"; gone now). Same 1:1 for the property entity (~L1179) and PropertyContact (~L1099).
   - **CREATE path `src/utils/webhooks/valcre.ts`** (~L263, ~L159) — send the four fields directly from the intake submission; no concatenation, no parse.
   - **PREREQUISITE:** the dashboard + intake must SEND all four fields in their Valcre payloads (not just persist to Supabase) so the server has them. No recombine anywhere — each part is its own field.
   - **⚑⚑ CLIENT vs PROPERTY — NEVER CROSS THE TWO (Ben, 2026-06-16; there is a documented past bug here):** the ORGANIZATION/client address (`clientAddress`/`clientCity`/`clientProvince`/`clientPostal`) maps ONLY to the Valcre **Contact** entity. The PROPERTY address (`propertyAddress`/`propertyCity`/`propertyProvince`/`propertyPostal`) maps ONLY to the Valcre **Property** entity. They are TWO DIFFERENT addresses. History: api/valcre.ts ~L964-967 notes a prior bug where "the contact received the PROPERTY address instead of the client's." When deleting `parseAddress`, do NOT let either side fall back to the other address's parts. Client→Contact, Property→Property, full stop. Same separation in the LOE: `[ClientOrganizationAddress]`/`[ClientAddressLocality]` = the CLIENT's address; `[PropertyAddress]`/`[PropertyAddressLocality]` = the PROPERTY's address.
7. **LOE template + mapper `src/utils/loe/generateLOE.ts`:**
   - **Client contact block (locked `.address-block`, template ~L360):** after `[ClientOrganizationAddress]<br/>` (street) add ONE composed locality line token `<span class="merge-token" data-token="ClientAddressLocality">[ClientAddressLocality]</span><br/>`. The **mapper composes** `[ClientAddressLocality]` = `"{city}, {province}  {postal}"` (trimmed; single comma after city, two spaces before postal). Block is NON-editable (locked 2026-06-15) so the extra line renders safely.
   - **⚑ EMPTY-STATE SUPPRESSION (mapper-side):** if city+province+postal are ALL empty (legacy rows), SUPPRESS the locality line **and its `<br/>`** — never emit a blank `[…Locality]<br/>` (mirror the §10 scenario-row suppression already in generateLOE.ts). Same for property.
   - **Property address field (template ~L378 `[PropertyAddress]`):** the mapper sets `[PropertyAddress]` = the recombined full property address `"{street}, {city}, {province}  {postal}"` (street-only if the rest empty). It's a single field-value line ("Property Address: …"), so recombine for display is correct there.
   - **⚑ `[JobName]` (mapper ~L154 = `propertyName, propertyAddress`):** `propertyAddress` is now street-only → the composite label loses the city. Default = leave street-only for the label; flag only if QA finds it reads wrong.

## Migration of existing rows
Legacy rows keep the full address in `client_address`/`property_address` (street field) with empty city/province/postal → LOE renders one line (street), Valcre gets street-only for those rows until re-entered. Acceptable. OPTIONAL one-time split of existing rows — note only, not required.

## Acceptance (QA — test job VAL261101, local first; deployed app gated on Ben's deploy)
1. Dashboard Section 1 shows Street / City / Province / Postal for BOTH client and property (matches the mock).
2. Enter all four parts → save → reopen → all persist (round-trip, verified in Supabase: the 6 new columns).
3. Generate the LOE → client block: name / company / **street line** / **city, province postal line** / phone / email; property address shows the full recombined address.
4. **Valcre 1:1 — readback-verify BOTH the client Contact AND the Property** in Valcre: `AddressStreet`/`AddressCity`/`AddressState`/`AddressPostalCode` each hold the matching field exactly, no parsing artifacts, street NOT truncated. **EXPLICIT no-cross check:** the Contact holds the CLIENT's address (use a DIFFERENT client vs property address on the test job so a swap is visible) and the Property holds the PROPERTY's address — confirm they are NOT swapped.
5. Contact block stays NON-editable (2026-06-15 lock holds).
6. **Legacy-row case:** a row with empty city/province/postal renders the address on ONE line in the LOE — no blank gap / no empty `<br/>` in the locked contact block. Confirm client + property.

## Out of scope
- Google address validation / autocomplete (parked — needs the Maps/Places API enabled on the Google project; in-repo component is a mock/stub).
- The registry-defines-address-as-one-field gap (logged as a Chris question — registry should adopt the four parts).

---
*ui-designer · approved on the mock 2026-06-16 (four-field, side-by-side) · ready for react-spec build + qa round-trip verify*
