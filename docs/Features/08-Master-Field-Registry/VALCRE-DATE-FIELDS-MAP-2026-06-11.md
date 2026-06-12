---
title: "Valcre Date Fields — Map & Coverage"
status: active
created: 2026-06-11
updated: 2026-06-11
last_reviewed: 2026-06-11
description: "The 8 native Valcre 'Dates' fields, what the APR integration currently maps to each, and which are unmapped (no dashboard source yet)."
tags: [valcre, date-fields, field-mapping, integration, ground-truth, loose-end, apr-dashboard]
entities: ["[[Valcre]]", "[[api/valcre.ts]]", "[[FIELD-DATA-MAP-where-everything-lives]]"]
related: ["~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/FIELD-DATA-MAP-where-everything-lives.md", "~/Development/APR-Dashboard-v3/docs/Features/08-Master-Field-Registry/PRD-A-fields-to-valcre-mapping.md"]
---

# Valcre Date Fields — Map & Coverage

**Tags:** #valcre #date-fields #field-mapping #integration #ground-truth #loose-end
**Entities:** [[Valcre]] [[api/valcre.ts]] [[FIELD-DATA-MAP-where-everything-lives]]

> **Why this exists.** Verified 2026-06-11 from a live client Valcre job: Valcre's **Dates** area has 8 date fields. Our integration only writes to 3 of them; the other 5 have **no dashboard source mapped**. This doc is the record of what's there and what's covered, so we can decide deliberately what should feed the unmapped ones.

---

## The 8 Valcre "Dates" fields + our coverage

| # | Valcre Date field | Client example value | Our source (dashboard → Valcre) | Mapped? |
|---|---|---|---|---|
| 1 | **Bid Date** | 2026-05-21 | `requestDate` → `BidDate` (defaults to **today** if absent) | ✅ mapped |
| 2 | **Awarded Date** | 2026-05-21 | — (likely = **LOE-signed date**; we capture `signed_at`/`signed_date` but don't push it) | ❌ unmapped |
| 3 | **Inspection Date** | 2026-05-21 | — (client reused the Awarded Date value here on this job — looks incidental, not a rule) | ❌ unmapped |
| 4 | **Date of Value** | (blank) | — | ❌ unmapped |
| 5 | **Internal Due Date** | (blank) | — | ❌ unmapped |
| 6 | **Due Date** | 2026-06-11 | `deliveryDate` → `DueDate` | ✅ mapped |
| 7 | **Invoice Date** | (blank) | — | ❌ unmapped |
| 8 | **Paid Date** | (blank) | `paymentPaidDate` → `PaidDate` | ✅ mapped |

**Coverage: 3 of 8 mapped** (Bid, Due, Paid). **5 unmapped** (Awarded, Inspection, Date of Value, Internal Due, Invoice).

---

## Where the mapping lives (code)

All native-date writes are in the Valcre serverless function — [api/valcre.ts](~/Development/APR-Dashboard-v3/api/valcre.ts):

- `deliveryDate` → `updateData.DueDate` (and on create: `DueDate`).
- `requestDate` → `updateData.BidDate` — on create, `BidDate` **defaults to the current date** when no `bidDate`/`requestDate` is sent, so Bid Date is never blank on our jobs.
- `paymentPaidDate` → `updateData.PaidDate`.

These are **native Valcre Job date properties**, not custom fields — so they don't appear in the custom-field list pulled by [valcre-list-custom-fields.sh](~/.claude/scripts/apr/valcre-list-custom-fields.sh).

---

## Open question (for a future mapping pass)

The 5 unmapped Valcre dates (Awarded, Inspection, Date of Value, Internal Due, Invoice) have **no current dashboard field feeding them**. Before wiring any of them we need to decide: (a) does the dashboard/registry even capture that date, and (b) is the client asking us to populate it — per the registry rule, we only push what we're asked to push. None of these are in scope today; this doc is the placeholder so the decision is deliberate, not forgotten.

**Strongest candidate, when we do a mapping pass:** **Awarded Date** likely means the **LOE-signed date** (Ben's read, 2026-06-11). We already capture that as `signed_at` / `signed_date` on `job_loe_details` (written by the DocuSeal webhook on signature) — it just isn't pushed to Valcre. So `signed_at → Awarded Date` is the obvious low-effort wire-up if the client confirms that's the intent. On the sample job the client also put that same date in **Inspection Date**, but that looks incidental (Inspection Date = physical property inspection, a different event) — don't treat the duplication as a mapping rule.

---

*Source: live client Valcre job, Dates panel, captured 2026-06-11. Code refs verified against [api/valcre.ts](~/Development/APR-Dashboard-v3/api/valcre.ts).*

**Last reviewed:** 2026-06-11 by qa-agent — created from live Valcre Dates panel + code verification of native-date mapping.
