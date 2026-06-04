---
content_type: notes
title: LOE-07 — Special Notes for Future Deep-Dives (parked, not now)
status: parked
created: 2026-06-04
author: co-architect
source_of_truth: docs/Features/12-LOE-Esign/loe07-build/LOE-template-v07.html
context: Ben flagged these two during the field-sync session — both are real, both need a dedicated conversation later. Banked here so they don't get lost.
---

# LOE-07 — Special Notes (future deep-dives)

Two items Ben called out as needing their own conversation. Neither is a bug; both are deliberately parked.

## 1. Section 10 — Extraordinary Assumptions & Hypothetical Conditions (the EA/HC table)

**What it is:** Section 10 of the v07 contract (`LOE-template-v07.html` ~lines 178-200) is a TABLE, not a single field. It has **6 rows**, each pairing a Value Scenario with its narrative:

| Left column | Right column |
|---|---|
| `[ValueScenario1]` | `[EA/HCSummary1]` |
| `[ValueScenario2]` | `[EA/HCSummary2]` |
| `[ValueScenario3]` | `[EA/HCSummary3]` |
| `[ValueScenario4]` | `[EA/HCSummary4]` |
| `[ValueScenario5]` | `[EA/HCSummary5]` |
| `[ValueScenario6]` | `[EA/HCSummary6]` |

**The split that makes it special:**
- **Left (Value Scenarios)** — ties to Valcre via the cascade (Status of Improvements → Value Scenarios). Structured data.
- **Right (EA/HC Summaries)** — **narrative text blocks pulled from a text library**, NOT simple field values. Each scenario has a pre-written extraordinary-assumption / hypothetical-condition paragraph. This is the "blocks of tables pulling in from Valcre" Ben remembered.

**Status:** parked. The EA/HC summary text library is not yet wired. The template ships with an Example block (As Is / As If Vacant Land) showing the intended prose style. Earlier flagged in FIELD-ROUTING as `[EA/HCSummary1-6]` = SPECIAL, narrative Text Library, not a field.

**Deep-dive needed:** where the narrative library lives, how a scenario maps to its summary paragraph, and how many rows actually render per job (suppress empty rows).

## 2. Purpose — the custom Valcre-sourced field

**What it is:** Ben's note — the dashboard "Purpose" concept pulls from **its own unique area inside Valcre**, distinct from everything else. It is NOT the same as the contract's Section 4 "Purpose of the Assignment" (which currently just renders "To estimate the [Valuetimeframe] market value…").

**Why it's parked:** earlier this session we confirmed the dashboard free-text "Purpose" field does NOT feed Valcre.Purposes (Property Rights feeds that via PURPOSES_MAP). So "Purpose" is currently an orphaned dashboard field. Ben says the real Purpose has a dedicated Valcre source area — that's a separate conversation.

**Deep-dive needed:** identify the unique Valcre area Purpose is meant to pull from, decide the control type, and wire it correctly (or retire the orphaned free-text field if it's a leftover).

---

*Both parked by Ben 2026-06-04 — revisit after the current field-sync + deploy work is closed.*
