---
content_type: loe-grade-record
title: LOE Grade — Schedule A markers + Example-block removal (Codex fix verify)
status: PASS — verified on the LIVE Supabase loe_templates DB row
owner: qa-agent (verify gate) · Codex (template edit) · co-architect (gate author)
home: ~/Development/APR-Dashboard-v3/docs/00-APR-MASTER-DASHBOARD.md
date: 2026-06-10
tags: [apr-workflow, loe, loe07, schedule-a, example-block, test-coverage-gate, codex, valta]
---

# LOE Grade — Schedule A + Example block (Codex fix)

**Tags:** #apr-workflow #loe #schedule-a #test-coverage-gate #codex
**Gate:** [LOE Test Coverage Gate](~/Development/APR-Dashboard-v3/tests/LOE-TEST-COVERAGE-GATE.md) — items **B5 / B6 / B7**.
**Fix spec:** [CODEX-TEMPLATE-FIXES-2026-06-10.md](~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/CODEX-TEMPLATE-FIXES-2026-06-10.md)

## What was verified

Codex edited the LOE-07-1 template and pushed to the **live Supabase `loe_templates` DB row** (the network errors in its pane were read-backs; the write landed — confirmed by DB readback, NOT by its success claim). qa then rendered BOTH a single-property and a multi-property job against the live DB template and verified at the rendered-PDF level (gate D9/D10: served over http + playwright `pdf`).

## Scorecard

| Gate item | Result | Evidence |
|---|---|---|
| **B5** — Schedule A conditional | **PASS** | Single-property → Schedule A GONE (7-pg PDF, zero "SCHEDULE" in text). Multi-property → Schedule A PRESENT (8-pg PDF, "SCHEDULE" appears). Page-count delta confirms conditional drop. DB template carries `<!-- SCHEDULE-A:START/END -->` (1 pair). |
| **B6** — Example block removed | **PASS** | `<p>Example</p>` + sample table gone in DB template; 0 "Example" legend in both rendered PDFs. §10 EAHC table now runs straight into §11. |
| **B7** — token leaks | **PASS** | 0 unresolved `[Token]` with a full data fill, both versions. |
| (regression) §10 EAHC fences intact | **PASS** | 6 EAHC-ROW fence pairs untouched; §10 cascade still suppresses blank rows. |

## Evidence PDFs

- Single-property (Schedule A absent): ~/Development/APR-Dashboard-v3/tests/LOE-scheduleA-single.pdf
- Multi-property (Schedule A present): ~/Development/APR-Dashboard-v3/tests/LOE-scheduleA-multi.pdf

## Notes

- Deploy path used by Codex: edited HTML → Supabase `loe_templates` active row. qa confirmed the live DB row `updated_at` bumped and the markers/removal are present (never trusted the success claim — read the DB).
- This closes the Schedule-A class of miss that slipped the earlier grade. Gate items B5/B6/B7 now have a passing record.

**Last reviewed:** 2026-06-10 by qa-agent — verified Codex's Schedule A + Example-block fix on the live DB template; B5/B6/B7 PASS.
