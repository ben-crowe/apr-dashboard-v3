---
id: section-2-cascade-mapping-plan
title: "Section-2 Cascade Fields — the PLAN (how it should map) + wiring audit"
date: 2026-06-15
type: mapping-plan-audit
author: qa-agent
authority: "Registry is the deciding factor (Ben). This is the intended state; the audit checks the code against it."
tags: [loe, cascade, section-2, valcre-mapping, wiring-audit, registry]
---

# Section-2 Cascade Fields — Plan + Wiring Audit

**Method (Ben's):** first state how each field SHOULD behave (source + does-it-map-to-Valcre, per the
registry). THEN audit how the code is actually wired against that plan. The registry is the deciding
factor — not a per-field debate.

## THE PLAN — how each Section-2 "Value Scenarios & Approaches" field should behave

Every field below **maps to Valcre per the registry** — none are "display only." What differs is
WHERE the value comes from (its source) and WHICH section fires the sync.

| Field | Source (where the value comes from) | Maps to Valcre? | Valcre home (registry) |
|---|---|---|---|
| **Status of Improvements** | user-picked (the cascade input) | YES | "Status of Improvements" custom field |
| **Value Scenarios** | derived from Status of Improvements | YES | "Value Scenario(s)" custom field |
| **Property Rights** | derived from Type/Subtype/Tenancy (Tenancy wins) | YES | native **"Purpose"** field |
| **Approaches to Value** | derived from Status of Improvements | YES (registry) | "Approaches to Value" custom field |
| **Property Subtype** | **mirror** of Section 1 | YES | "Property Subtype" custom field |
| **Tenancy** | **mirror** of Section 1 | YES | "Tenancy" custom field |
| **Value Timeframe** | user-picked | YES | "Value Timeframe" custom field |

**Mirror ≠ doesn't-map.** Subtype/Tenancy are *entered in Section 1* (so Section 2 shows them as
"from Subtype / from Tenancy"), but they still map to Valcre — they just sync **from Section 1**, not
from Section 2.

## THE AUDIT — how the code is actually wired vs the plan

| Field | Should map | Actually wired? | Verdict |
|---|---|---|---|
| Value Scenarios | yes (from Sec 2) | ✅ wired, lands in Valcre | **OK** — popup false-alarm already FIXED (committed) |
| Property Rights | yes (from Sec 2) | ✅ wired, but the native "Purposes" PATCH **fails** (live-captured) | ❌ **REAL failure** — popup is HONEST; sync genuinely fails |
| Status of Improvements | yes | ❌ **NOT in sync list** | **FIX** — wire it (registry says map; code doesn't) |
| Approaches to Value | yes (registry) | ❌ on code "do-not-wire" list | **RECONCILE** — registry says map, code says don't |
| Property Subtype | yes, from Section 1 | ❓ verify Section 1 syncs it | **VERIFY** |
| Tenancy | yes, from Section 1 | ❓ verify Section 1 syncs it | **VERIFY** |
| Value Timeframe | yes | ❓ verify wiring | **VERIFY** |

## The false-ERROR situation (what matters for a client review)

Of the two cascade-sync popups, **one was a false alarm (now fixed); the other is a REAL failure**
(corrected 2026-06-15 after a live capture — do NOT mute it):

1. **Empty-native-PATCH** (custom-only syncs like Value Scenarios) — fired "Failed to sync" while the
   data actually landed. **FALSE alarm → FIXED + committed** (client verdict now ignores the
   empty-patch case).
2. **Property Rights → native "Purposes" PATCH genuinely FAILS** — live capture on job 890842 returned
   `success:false, "Failed to update job", updateData:{Purposes:"LeasedFee"}`. The popup is **HONEST**.
   The registry says Purposes is single-enum + "LeasedFee" is a valid member + format is right — yet
   Valcre rejects it, AND the proxy **swallows the real error** (`details:""`). So this is a **REAL
   sync bug**, not a popup to mute. (Earlier I twice nearly mis-called it false — the verify-before-mute
   check caught the real failure.)

## Fix list to be client-review-clean (in priority order)

1. **Property Rights REAL sync failure** — (a) make the proxy SURFACE Valcre's native-PATCH error
   instead of swallowing it (`"Failed to update job"` / `details:""` is useless for diagnosis); (b)
   then fix the actual "Purposes" update rejection. NOT a popup mute — the popup is honest.
2. **Wire Status of Improvements → Valcre** (registry says map; not in the sync list).
3. **Reconcile Approaches to Value** — registry says map (CF "Approaches to Value"); code has it on
   do-not-wire. Decide per registry (likely: wire it).
4. **Verify Subtype / Tenancy / Value Timeframe** actually sync from their proper source.
5. **(Server)** skip the empty native PATCH at the source (root cleanup; deploy-gated).

## Bottom line for Ben
- Every Section-2 cascade field **is meant to map to Valcre** (registry). No "should it map?" debates.
- The Value Scenarios popup was lying → **fixed.** The Property Rights popup is **honest — a REAL
  sync failure** (Purposes PATCH rejected; proxy hides the cause). That's the real gap.
- Until #1–#2 land, a client review would see a Property Rights error that is **correct** (it really
  fails) + a Status that doesn't reach Valcre. After the real fixes, every mapped field reaches Valcre
  and every popup is honest.

*qa-agent · registry-grounded plan + audit. Not all of Section 2 is a mirror — Subtype/Tenancy are;
the rest are derived/picked and DO sync. Two false-alarm families: empty-PATCH (fixed), readback
(open).*
