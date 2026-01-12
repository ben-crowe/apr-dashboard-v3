# Locked Field IDs - Calculator Outputs

**WARNING: These field IDs are OUTPUT from calculator code. Do NOT change without updating the source calculator.**

## Data Flow Architecture

```
User Input (TabPanels)
        ↓
Calculator Tables (source of truth)
        ↓
Hidden Fields (Zustand Store)
        ↓
HTML Template (display only)
```

**Rule**: Registry and templates must match calculator outputs, NOT the other way around.

---

## Income Table Outputs
Source: `src/features/report-builder/tables/income-table.ts`

| Field ID | Description |
|----------|-------------|
| `calc-total-units` | Total unit count |
| `calc-total-sf` | Total square footage |
| `calc-pgr` | Potential Gross Revenue |
| `calc-pgr-per-unit` | PGR per unit |
| `calc-total-rental-revenue` | Total rental revenue |
| `calc-type1-annual` | Type 1 annual rent |
| `calc-type1-count` | Type 1 unit count |
| `calc-type1-sf` | Type 1 square footage |
| `calc-type1-rent` | Type 1 rent per unit |
| `calc-type2-annual` | Type 2 annual rent |
| `calc-type2-count` | Type 2 unit count |
| `calc-type2-sf` | Type 2 square footage |
| `calc-type2-rent` | Type 2 rent per unit |
| `calc-type3-annual` | Type 3 annual rent |
| `calc-type3-count` | Type 3 unit count |
| `calc-type3-sf` | Type 3 square footage |
| `calc-type3-rent` | Type 3 rent per unit |
| `calc-type4-annual` | Type 4 annual rent |
| `calc-type4-count` | Type 4 unit count |
| `calc-type4-sf` | Type 4 square footage |
| `calc-type4-rent` | Type 4 rent per unit |

---

## Expense Table Outputs
Source: `src/features/report-builder/tables/expense-table.ts`

| Field ID | Description |
|----------|-------------|
| `calc-expenses-total` | Total operating expenses |
| `calc-expenses-per-unit` | Expenses per unit |
| `calc-exp-taxes-annual` | Property taxes annual |
| `calc-exp-taxes-per-unit` | Taxes per unit |
| `calc-exp-taxes-pct` | Taxes as % of EGI |
| `calc-exp-insurance-annual` | Insurance annual |
| `calc-exp-insurance-per-unit` | Insurance per unit |
| `calc-exp-insurance-pct` | Insurance as % of EGI |
| `calc-exp-utilities-annual` | Utilities annual |
| `calc-exp-utilities-per-unit` | Utilities per unit |
| `calc-exp-utilities-pct` | Utilities as % of EGI |
| `calc-exp-repairs-annual` | Repairs/maintenance annual |
| `calc-exp-repairs-per-unit` | Repairs per unit |
| `calc-exp-repairs-pct` | Repairs as % of EGI |
| `calc-exp-management-annual` | Management annual |
| `calc-exp-management-per-unit` | Management per unit |
| `calc-exp-management-pct` | Management as % of EGI |
| `calc-exp-reserves-annual` | Reserves annual |
| `calc-exp-reserves-per-unit` | Reserves per unit |
| `calc-exp-reserves-pct` | Reserves as % of EGI |
| `calc-exp-other-annual` | Other expenses annual |
| `calc-exp-other-per-unit` | Other per unit |
| `calc-exp-other-pct` | Other as % of EGI |

---

## Vacancy Table Outputs
Source: `src/features/report-builder/tables/vacancy-table.ts`

| Field ID | Description |
|----------|-------------|
| `calc-egr` | Effective Gross Revenue |
| `calc-egr-per-unit` | EGR per unit |
| `calc-vacancy-loss` | Vacancy & collection loss |
| `calc-vacancy-pct` | Vacancy rate percentage |

---

## NOI Table Outputs
Source: `src/features/report-builder/tables/noi-table.ts`

| Field ID | Description |
|----------|-------------|
| `calc-noi` | Net Operating Income |
| `calc-noi-per-unit` | NOI per unit |
| `calc-expense-ratio` | Operating expense ratio |

---

## Capitalization Table Outputs
Source: `src/features/report-builder/tables/capitalization-table.ts`

| Field ID | Description |
|----------|-------------|
| `calc-indicated-value` | Indicated value (final) |
| `calc-value-per-unit` | Value per unit |
| `calc-raw-value` | Raw calculated value |
| `calc-grm` | Gross Rent Multiplier |
| `recon-income-value` | Income approach value for reconciliation |

---

## Protected Field Categories

### NEVER Change Without Calculator Update:
- `calc-*` - All calculator output fields
- `comp*` - Comparable sale fields (CompsEditor output)
- `rentcomp*` - Rent comparable fields (RentCompsEditor output)

### Safe to Change (User Input Fields):
- Fields with `inputSource: "user-input"` in registry
- Fields with `inputSource: "valcre-mapping"` (crosswalk aligned)
- Fields with `inputSource: "api-fetch"` (external data)

---

## Before Changing Any Field ID

1. **Check this document** - Is it a locked calculator output?
2. **Search calculator tables** - `grep -r "field-id" src/features/report-builder/tables/`
3. **Search editors** - `grep -r "field-id" src/features/report-builder/editors/`
4. **If found** - Change calculator code FIRST, then registry/template

---

## Related Documentation

- Crosswalk Authority: `valcre_template_crosswalk.json`
- Field Registry: `src/features/report-builder/schema/fieldRegistry.ts`
- Page Templates: `src/features/report-builder/templates/reportPageTemplates.ts`
- Calculator Tables: `src/features/report-builder/tables/*.ts`

---

*Last Updated: 2026-01-07*
*Session: Crosswalk Alignment & Calculator Architecture Review*
