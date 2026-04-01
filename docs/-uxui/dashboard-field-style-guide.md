# Dashboard Field Style Guide

## Gold Standard: Job Details Section (LOE Quote)

Uses `TwoColumnFields` component with `CompactField` wrappers.
All lines — selects and inputs — are the same 160px width within each column.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  JOB DETAILS                                                               │
│                                                                             │
│  Property Rights:  Fee Simple Interest  v     Scope of Work:  All Applicable  v  │
│                    ─────────────────────       ─────────────────────          │
│                    ◄──── 160px ────────►       ◄──── 160px ────────►          │
│                                                                             │
│  Payment Terms:    NET 30 Days          v     Appraisal Fee:  $7,500.00      │
│                    ─────────────────────       ─────────────────────          │
│                                                                             │
│  Report Type:      Appraisal Report     v     Retainer Amount: $3,750.00     │
│                    ─────────────────────       ─────────────────────          │
│                                                                             │
│  Delivery Date:    2026-06-15                                                │
│                    ─────────────────────                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Three Field Types

All three types use the SAME line width within a two-column layout.

```
TYPE 1 — Select Dropdown (chevron)
┌──────────────────────────────┐
│  Label:   Selected Value   v │
│           ─────────────────  │
│           ◄── 160px ──────►  │
└──────────────────────────────┘

TYPE 2 — Text Input (short)
┌──────────────────────────────┐
│  Label:   John Smith         │
│           ─────────────────  │
│           ◄── 160px ──────►  │
└──────────────────────────────┘

TYPE 3 — Text Input (address / long)
Full-width row — spans both columns.
Line is capped, input text can overflow for typing.
┌─────────────────────────────────────────────────────────────────────┐
│  Address:   289 Centre Street Suite 352, Calgary, AB T2P 3H7       │
│             ─────────────────────────────────────────────────       │
│             ◄────────────────── 400px ─────────────────────►       │
└─────────────────────────────────────────────────────────────────────┘
```

## Two-Column Layout Pattern

Every section uses `TwoColumnFields` → `grid grid-cols-2 gap-x-8`.
Fields pair side by side. Address drops to its own full-width row.

```
CLIENT INFORMATION
──────────────────────────────────────────────────────────────────────
  Col 1 (left)                          Col 2 (right)
  ──────────────────                    ──────────────────

  First Name:  Michael                  Last Name:   Johnson
               ─────────────────                     ─────────────────

  Title:       VP of Real Estate        Organization: Premier Properties
               ─────────────────                      ─────────────────

  Phone:       (403) 555-0100           Email:       michael@premier.ca
               ─────────────────                     ─────────────────

  Address:     289 Centre Street Suite 352, Calgary, AB T2P 3H7
               ─────────────────────────────────────────────────
               ◄──────────── full-width row, 400px line ───────►


PROPERTY INFORMATION
──────────────────────────────────────────────────────────────────────
  Property Name: Riverside Complex      Property Type: Multi-Family  v
                 ─────────────────                     ─────────────────

  Address:       373 Centre Street, Calgary, AB T2R 1M5
                 ─────────────────────────────────────────────────

  Authorized Use: First Mortgage    v   Valuation Premises: Market Value  v
                  ─────────────────                        ─────────────────

  Asset Condition: Good             v
                   ─────────────────


PROPERTY CONTACT
──────────────────────────────────────────────────────────────────────
  First Name:  Marcus                   Email:  property.mgr@harbour.ca
               ─────────────────                ─────────────────

  Last Name:   Johnson                  Phone:  (416) 555-0456
               ─────────────────                ─────────────────
```

## Implementation Reference

```
Component:        TwoColumnFields        (grid grid-cols-2 gap-x-8)
Field wrapper:    CompactField           (flex items-center, label min-w-[160px] right-aligned)
Full-width field: CompactField fullWidth (md:col-span-2)

Select trigger:   max-w-[160px] !bg-transparent border-0 border-b border-b-gray-400
                  dark:border-b-white/20 !rounded-none px-0
Text input:       max-w-[160px] h-7 text-sm
Address input:    max-w-[400px] h-7 text-sm  (inside fullWidth CompactField)
```

## Current vs Target

```
                    CURRENT (broken)              TARGET (consistent)
                    ─────────────────             ─────────────────────
Grid component:     inline div, gap-x-4          TwoColumnFields, gap-x-8
Label width:        [&_label]:min-w-[120px]      CompactField default (160px)
Text inputs:        max-w-[280px]                max-w-[160px]
Selects:            max-w-[200px] or [280px]     max-w-[160px]
Address:            w-full (edge to edge)        max-w-[400px]
```
