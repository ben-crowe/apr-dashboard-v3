# Contact Field Bug Fixes — Analysis

## Bug 1: Client Address Uses Property Address

**Root cause:** `api/valcre.ts` line 532 — `addressParts` is parsed from `jobData.PropertyAddress` and then used for BOTH the client contact (line 575) AND the property entity. The client's actual address is never sent from the client-side code.

**Client-side gap:** `src/utils/webhooks/valcre.ts` sends `ClientName`, `ClientEmail`, `ClientPhone`, `ClientCompany` but NOT `ClientAddress` or `ClientTitle`.

**Fix (two parts):**
1. In `src/utils/webhooks/valcre.ts` — add `ClientAddress` and `ClientTitle` to the job creation payload
2. In `api/valcre.ts` — parse the client address separately and use it for the Contact entity

## Bug 2: Client Title Shows "Client" Instead of Actual Title

**Root cause:** `api/valcre.ts` line 581 — `Title: jobData.ClientTitle || "Client"`. The value `jobData.ClientTitle` is always undefined because the client-side never sends it.

**Fix:** Same as Bug 1 part 1 — add `ClientTitle: formData.clientTitle` to the job creation payload in `src/utils/webhooks/valcre.ts`.

## Bug 3: Postal Code Lost

**Root cause:** The postal code regex in `parseAddress()` actually works correctly for well-formatted addresses. The issue is that short addresses like "3494 Spring Parkway" have no postal code to parse. However, when the CLIENT address "2399 Pine Place, Calgary, AB T2X 1Y6" is used instead, the postal code WILL be parsed correctly.

**Fix:** Bug 3 is resolved by fixing Bug 1 — once the client contact uses the client address (which contains the full address with postal code), the parsing will extract it correctly. No regex fix needed.

## Files to Change

1. `src/utils/webhooks/valcre.ts` — Add ClientAddress and ClientTitle to job creation payload
2. `api/valcre.ts` — Parse client address separately for Contact entity creation
