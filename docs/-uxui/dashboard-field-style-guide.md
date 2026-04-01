# Dashboard Field Style Guide

## Gold Standard: Job Details Section (LOE Quote)

Uses `TwoColumnFields` + `CompactField`. All lines are 160px.

```
JOB DETAILS

  Property Rights:  Fee Simple Interest v            Scope of Work:  All Applicable v
                    ────────────────────                              ────────────────────

    Payment Terms:  NET 30 Days         v             Appraisal Fee:  $7,500.00
                    ────────────────────                              ────────────────────

      Report Type:  Appraisal Report    v                  Retainer:  $3,750.00
                    ────────────────────                              ────────────────────

    Delivery Date:  2026-06-15
                    ────────────────────
                    |--- 160px --------|
```

---

## Three Field Types

All use the same line width in a two-column layout.

```
TYPE 1 — Select (chevron)              TYPE 2 — Text Input

   Label:  Selected Value  v              Label:  John Smith
           ────────────────                       ────────────────
           |-- 160px ------|                      |-- 160px ------|


TYPE 3 — Address (full-width row, spans both columns)

   Label:  289 Centre Street Suite 352, Calgary, AB T2P 3H7
           ────────────────
           |-- 160px ------|

SPACING — When switching between row types (single to double, double to single),
add extra vertical space to visually separate the different layouts.


ALIGNMENT — Single row below double row:
The single row's colon aligns with the LEFT column's colon above it.

   Label:  Selected Value  v              Label:  John Smith
           ────────────────                       ────────────────

   Label:  289 Centre Street Suite 352, Calgary, AB T2P 3H7
           ────────────────

Notes:
  - Address line is 160px, same as Types 1 and 2
  - Or no line at all (Valcre removes lines on long fields — TBD)
  - Line width has NO correlation to input field length
  - Users can type as much text as needed regardless of line width

Column Alignment Rules:
  - All two-column rows share the same two colon positions across the entire page
  - All three-column rows share the same three colon positions across the entire page
  - Single full-width rows align their colon to the two-column left colon position
  - Three-column left colon MUST align with two-column left colon (same start point)
  - Col 2 and Col 3 are evenly distributed to the right from that start point
  - Colon positions are FIXED by the grid — labels right-align to them, not the other way around

Reference Width:
  - All column positions are calculated from a known container width
  - Container width is determined by the dashboard card max-width at a reference
    viewport (1280px or 1440px — TBD, needs measurement from live page)
  - The frontend developer should measure the actual rendered container width
    and derive the exact colon positions from: label-width (160px) + grid gaps + column fractions
```

---

## Section Layouts

All doubles align globally. All singles align to the left colon.
All triples align globally. Column positions are page-wide, not per-section.

```
CLIENT INFORMATION

      First Name:  Michael                                Last Name:  Johnson
                   ────────────────                                   ────────────────

           Title:  VP of Real Estate                   Organization:  Premier Properties
                   ────────────────                                   ────────────────

           Phone:  (403) 555-0100                            Email:  michael@premier.ca
                   ────────────────                                   ────────────────

         Address:  289 Centre Street Suite 352, Calgary, AB T2P 3H7
                   ────────────────


PROPERTY INFORMATION

   Property Name:  Riverside Complex                  Property Type:  Multi-Family  v
                   ────────────────                                   ────────────────

         Address:  373 Centre Street, Calgary, AB T2R 1M5
                   ────────────────

  Authorized Use:  First Mortgage  v          Valuation Premises:  Market Value  v          Asset Condition:  Good  v
                   ────────────────                                ────────────────                              ────────────────


PROPERTY CONTACT

      First Name:  Marcus                                Email:  property.mgr@harbour.ca
                   ────────────────                               ────────────────

       Last Name:  Johnson                               Phone:  (416) 555-0456
                   ────────────────                               ────────────────
```

---

## Implementation

```
Two-column grid:    TwoColumnFields     grid-cols-2  gap-x-8
Three-column grid:  ThreeColumnFields   grid-cols-3  gap-x-6
Field wrapper:      CompactField        label min-w-[160px] right-aligned
Full-width row:     CompactField        fullWidth (md:col-span-2 or col-span-3)

Select line:      max-w-[160px]
Text input line:  max-w-[160px]
Address line:     max-w-[160px]  (or no line — TBD)
```

## Current vs Target

```
                  CURRENT                 TARGET
Grid:             inline div, gap-x-4    TwoColumnFields, gap-x-8
Labels:           min-w-[120px]          min-w-[160px] (CompactField)
Inputs:           max-w-[280px]          max-w-[160px]
Selects:          200px or 280px         max-w-[160px]
Address:          w-full (no cap)        max-w-[160px] or no line
```
