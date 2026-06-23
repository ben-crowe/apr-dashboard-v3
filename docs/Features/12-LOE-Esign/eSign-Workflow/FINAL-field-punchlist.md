# Final field punch-list — task 86e1yb8nz "VALTA JOBS - Temp V2"

Verified against the live list via the ClickUp API, 2026-06-19. Names are already clean (no prefixes). Three buckets of remaining work.

## 1. CODEX — create these 6 fields (its remaining tokens) + 1 rename
Create on the list, pick the type shown:
- **Received Date** — Date
- **LOE Sent** — Date
- **LOE Signed** — Date
- **Contact Name** — Text
- **Contact Email** — Email
- **Contact Phone** — Phone

Rename:
- **Valcre Job Link → Valcre Job**

That's Codex's whole job. Don't touch ordering (Ben handles that) or the duplicates/extras below.

## 2. DUPLICATES to delete — 5 pairs (Ben handles in the UI while reorganizing; API can't delete field definitions)
Each name exists twice; keep ONE, delete the redundant one:
- **Client Email** — KEEP the one typed **Email**, delete the plain-text one.
- **Report Type** (drop_down ×2) — keep the one that HAS the dropdown options, delete the empty/optionless one.
- **Property Type** (drop_down ×2) — keep the one with options, delete the other.
- **Property Name** (text ×2) — keep either, delete one.
- **Property Address** (text ×2) — keep either, delete one.

## 3. EXTRAS — pre-existing fields, keep-or-cull decision (Ben)
Not in our target; these came with the client template, not our doing:
- Client First Name + Client Last Name (redundant with Client Full Name)
- Job Status (clashes with the status-TAG pipeline — likely cull)
- Asset Condition · Payment Terms · Property Rights Appraised · Scope of Work · Valuation Premises (appraiser detail; the original plan said leave these to the dashboard)

## Tags — DONE
The 5 status tags + "apr hub" are already created in the Space via CLI. No tag work remains.
