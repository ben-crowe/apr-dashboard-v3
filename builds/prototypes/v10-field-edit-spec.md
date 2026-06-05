# v10 Field Edit Spec — Visual States

Every state shows the full table as you'd see it.
BOLD/CAPS = client can edit. lowercase italic = auto/read-only/greyed out.

Column renamed: "Valcre API Key" → "Valcre Field ID"
Column added: "Status"

---

## State 1: Default View — No editing

[+ New Field] button in header. All rows read-only. Click any Valta row to edit.

```
  #   Status   System   Field Name              Label                    Control Type      Source        Role        Dropdown List              Valcre Location   Valcre Field ID
  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  1   Active   Valta    PropertyType             Property Type            Select one        User Input    Trigger     ListPropertyType (9)       Property          Property.Types
  2   Active   Valta    JobNumber                Job Number               Alpha Numeric     Valcre API    —           —                          Job               Job.Number
  3   Active   Valta    Tenancy                  Tenancy                  Select one        User Input    Trigger     ListTenancy (6)            Job               —
```

---

## State 2: + New Field Clicked — Add row appears

New row at top. Client fills UPPERCASE cells only. Lowercase = greyed out.

```
  #   Status    System   Field Name   Label                  Control Type   Source       Role           Dropdown List   Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  —   pending   valta    auto         TYPE LABEL HERE...     SELECT... ▾    user input   SELECT... ▾    —               —                 —                 [Save] [Cancel]
  1   Active    Valta    PropertyType Property Type           Select one     User Input   Trigger        ListPropertyType (9)  Property     Property.Types
  2   Active    Valta    JobNumber    Job Number              Alpha Numeric  Valcre API   —              —                     Job          Job.Number
```

Client can edit:
  - LABEL        → text input, type the name
  - CONTROL TYPE → dropdown (see State 3)
  - ROLE         → dropdown: Independent / Trigger / Result

Everything else visible but greyed out, not clickable.

---

## State 3: Client clicks Control Type → dropdown opens

```
  #   Status    System   Field Name   Label                  Control Type   Source       Role           Dropdown List   Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  —   pending   valta    auto         MARKET CONDITION       SELECT... ▾    user input   SELECT... ▾    —               —                 —                 [Save] [Cancel]
                                                              ┌─────────────┐
                                                              │ Text        │
                                                              │ Number      │
                                                              │ Date        │
                                                              │ Dropdown  ◄─┤── picks this
                                                              │ Yes/No      │
                                                              │ Multi-line  │
                                                              └─────────────┘
  1   Active    Valta    PropertyType Property Type           Select one     User Input   Trigger        ListPropertyType (9)  Property     Property.Types
  2   Active    Valta    JobNumber    Job Number              Alpha Numeric  Valcre API   —              —                     Job          Job.Number
```

6 simplified choices. System maps to internal types on save:
  Text       → Text
  Number     → Whole Number
  Date       → Date
  Dropdown   → Select one option
  Yes/No     → Checkbox
  Multi-line → Multiple lines of text

---

## State 4: Type = Dropdown chosen → Dropdown List column wakes up

```
  #   Status    System   Field Name        Label                  Control Type   Source       Role           Dropdown List    Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  —   pending   valta    MarketCondition   MARKET CONDITION       DROPDOWN       user input   SELECT... ▾    SELECT... ▾      —                 —              [Save] [Cancel]
                                                                                                              ┌────────────────────────────┐
                                                                                                              │ Property Type (9)          │
                                                                                                              │ Property Subtype (3)       │
                                                                                                              │ Tenancy (6)                │
                                                                                                              │ Authorized Use (8)         │
                                                                                                              │ Status of Improvements (7) │
                                                                                                              │ Value Timeframe (3)        │
                                                                                                              │ Report Type (3)            │
                                                                                                              │ Assignment Type (2)        │
                                                                                                              │ Yes/No (2)                 │
                                                                                                              │ ─────────────────────────  │
                                                                                                              │ + New List                 │
                                                                                                              └────────────────────────────┘
  1   Active    Valta    PropertyType      Property Type           Select one     User Input   Trigger        ListPropertyType (9)   Property   Property.Types
  2   Active    Valta    JobNumber         Job Number              Alpha Numeric  Valcre API   —              —                      Job        Job.Number
```

Friendly names with counts. NOT internal List* names.
Dashboard lists only. "+ New List" at bottom opens inline option editor.
Field Name auto-previews as "MarketCondition" (from label, not editable).

---

## State 5: Client clicks Role → dropdown opens

```
  #   Status    System   Field Name        Label                  Control Type   Source       Role             Dropdown List          Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  —   pending   valta    MarketCondition   MARKET CONDITION       DROPDOWN       user input   SELECT... ▾      Property Type (9)      —                 —              [Save] [Cancel]
                                                                                              ┌──────────────┐
                                                                                              │ Independent  │
                                                                                              │ Trigger    ◄─┤── picks this
                                                                                              │ Result       │
                                                                                              └──────────────┘
  1   Active    Valta    PropertyType      Property Type           Select one     User Input   Trigger          ListPropertyType (9)   Property          Property.Types
  2   Active    Valta    JobNumber         Job Number              Alpha Numeric  Valcre API   —                —                      Job               Job.Number
```

Independent = default, no logic.
Trigger = drives a cascade → "Configure Logic" button after save.
Result = set by a cascade → "Configure Logic" button after save.

---

## State 6: All fields chosen, ready to save

```
  #   Status    System   Field Name        Label                  Control Type   Source       Role      Dropdown List      Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  —   pending   valta    MarketCondition   MARKET CONDITION       DROPDOWN       user input   TRIGGER   Property Type (9)  —                 —              [Save] [Cancel]
  1   Active    Valta    PropertyType      Property Type           Select one     User Input   Trigger   ListPropertyType (9)  Property       Property.Types
  2   Active    Valta    JobNumber         Job Number              Alpha Numeric  Valcre API   —         —                     Job            Job.Number
```

Client filled: Label, Control Type, Role, Dropdown List.
System auto-fills on save: #, Status, System, Field Name, Source, Valcre Location, Valcre Field ID.

---

## State 7: After Save — new row in table

```
  #    Status    System   Field Name        Label                  Control Type   Source       Role      Dropdown List          Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  NEW  Pending   Valta    MarketCondition   Market Condition       Select one     User Input   Trigger   ListPropertyType (9)   —                 —              [Configure Logic]
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ↑ amber pulse highlight for 2-3 seconds on new row

  1    Active    Valta    PropertyType      Property Type           Select one     User Input   Trigger   ListPropertyType (9)   Property          Property.Types
  2    Active    Valta    JobNumber         Job Number              Alpha Numeric  Valcre API   —         —                      Job               Job.Number
```

Auto-generated:
  Field Name:      "MarketCondition" (from label)
  Control Type:    "Select one" (mapped from "Dropdown")
  Source:          "User Input"
  Status:          "Pending"
  Valcre Location: — (dev team assigns later)
  Valcre Field ID: — (dev team maps later)

[Configure Logic] button → navigates to Logic Fields tab.

---

## State 8: Edit Existing Field — click row 1

UPPERCASE = editable. lowercase = read-only/greyed.

```
  #   Status   System   Field Name     Label                  Control Type     Source       Role          Dropdown List            Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  1   active   valta    PropertyType   PROPERTY TYPE          SELECT ONE ▾     user input   TRIGGER ▾     LISTPROPERTYTYPE (9) ▾   property          Property.Types     [Save] [Cancel]
  2   Active   Valta    JobNumber      Job Number              Alpha Numeric   Valcre API   —             —                        Job               Job.Number
  3   Active   Valta    Tenancy        Tenancy                 Select one      User Input   Trigger       ListTenancy (6)          Job               —
```

Editable:      Label, Control Type, Role, Dropdown List (if type = dropdown)
Read-only:     #, Status, System, Field Name, Source, Valcre Location, Valcre Field ID

Field Name NEVER changes even if Label is edited. Set once on creation.

---

## State 9: Non-dropdown field — simple add

```
  #   Status    System   Field Name        Label                  Control Type   Source       Role           Dropdown List   Valcre Location   Valcre Field ID
  ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  —   pending   valta    InspectionNotes   INSPECTION NOTES       MULTI-LINE     user input   INDEPENDENT    —               —                 —              [Save] [Cancel]
  1   Active    Valta    PropertyType      Property Type           Select one     User Input   Trigger        ListPropertyType (9)  Property     Property.Types
```

Type = Multi-line, Role = Independent.
Dropdown List stays inactive (—).
No "Configure Logic" button after save.

---

---

## State 10: Configure Logic — Landing on Logic Fields tab

User clicked [Configure Logic] on their new field (e.g. "Financing Type", Role = Trigger).
They land on the Logic Fields tab in EDIT MODE. The page expands to give more room.

What they see:

```
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  CASCADE LOGIC — EDIT MODE                                          [Done]      │
  ├─────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                 │
  │  HOW THIS WORKS:                                                                │
  │  ┌───────────────────────────────────────────────────────────────────────────┐   │
  │  │ 1. Your new field "Financing Type" is in Column 1 (the trigger)         │   │
  │  │ 2. Pick a RESULT field in Column 2 — what does your trigger control?    │   │
  │  │ 3. Map each trigger option to a result in the table below               │   │
  │  │ 4. Click [Done] when finished                                           │   │
  │  └───────────────────────────────────────────────────────────────────────────┘   │
  │                                                                                 │
  │  ── Existing Cascade Groups (read-only reference) ──────────────────────────    │
  │                                                                                 │
  │  Group 1 — Property Rights:                                                     │
  │  A  Property Type        ──┐                                                    │
  │  B  Property Subtype     ──┼──→  Property Rights                                │
  │  C  Tenancy              ──┘                                                    │
  │                                                                                 │
  │  Group 2 — Value Scenarios & Approaches:                                        │
  │  D  Status of Improvements  ──┐                                                 │
  │                                ├──→  Value Scenarios  ──→  Approaches to Value  │
  │  E  Authorized Use          ──┘                                                 │
  │                                                                                 │
  │  ── NEW: Group 3 — Your Logic (edit this) ─────────────────────────────────     │
  │                                                                                 │
  │  F  Financing Type  ──→  [ SELECT RESULT FIELD... ▾ ]                           │
  │      ↑ amber highlight                                                          │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘
```

The existing groups (1 and 2) are shown as READ-ONLY reference so the user
understands the pattern. Their new group (3) is the editable area.

---

## State 11: Configure Logic — Pick result field

User clicks the result field dropdown. Shows available fields that could be results.

```
  F  Financing Type  ──→  [ SELECT RESULT FIELD... ▾ ]
                           ┌──────────────────────────┐
                           │ Interest Appraised        │
                           │ Value Scenarios            │
                           │ Approaches to Value        │
                           │ ────────────────────────── │
                           │ + Create New Result Field  │
                           └──────────────────────────┘
```

User picks or creates the result field. Then the mapping table appears.

---

## State 12: Configure Logic — Map trigger options to results

User picked "Financing Type" as trigger → result field chosen.
Now map each dropdown option to an outcome.

```
  ── Group 3: Financing Type → [Result Field Name] ──────────────────────

  TRIGGER OPTION              RESULT
  ────────────────────────────────────────────────────────────
  Option 1                    [ Select outcome... ▾ ]
  Option 2                    [ Select outcome... ▾ ]
  Option 3                    [ Select outcome... ▾ ]

  + Add mapping rule
```

Each trigger option (from the dropdown list the user created) gets a row.
User picks what result each option produces.

Example filled in:

```
  ── Group 3: Financing Type → Loan Category ────────────────────────────

  TRIGGER OPTION              RESULT
  ────────────────────────────────────────────────────────────
  Conventional                Standard Underwriting
  CMHC Insured                CMHC Guidelines
  Private Lending             Alternative Assessment

  + Add mapping rule

  [ Save Logic ]  [ Cancel ]
```

---

## State 13: Configure Logic — Saved, back to normal view

User clicks [Save Logic] or [Done]. Edit mode closes.
Logic tab returns to normal layout with the new group added.

```
  Group 1 — Property Rights (3 triggers → 1 result)
  A  Property Type        ──┐
  B  Property Subtype     ──┼──→  Property Rights
  C  Tenancy              ──┘

  Group 2 — Value Scenarios & Approaches (2 triggers → 2 results, chained)
  D  Status of Improvements  ──┐
                                ├──→  Value Scenarios  ──→  Approaches to Value
  E  Authorized Use          ──┘

  Group 3 — Financing Type → Loan Category (1 trigger → 1 result)
  F  Financing Type  ──→  Loan Category
```

Rule Explorer below also shows the new group with the mapping table.

Back on the Field Registry tab, the field status could update to show
"Logic Configured" or similar indicator.

---

## Rules

All dropdowns show "Select..." in muted text until chosen. No defaults.

Everything from v5 stays unchanged:
  - All 4 tabs (Full Dashboard, Logic Fields, Field Registry, Rule Audit)
  - Scope toggle (Valta Dashboard / Valcre)
  - Search, checkbox filters, column sorting
  - Expandable dropdown rows, Fill Test Data, Reset

---

## State x Column Quick Reference

Maps each state to the editability of the five primary client-facing columns plus Field Name. Columns that the spec does not address for a given state are marked `n/a`.

`edit` = client can type or select. `read-only` = visible but not interactive. `hidden` = not shown or inactive (—). `n/a` = spec does not address this column for this state.

| State | Context | Label | Control Type | Role | Dropdown List | Field Name |
|-------|---------|-------|-------------|------|--------------|-----------|
| 1 | Default view — no editing | read-only | read-only | read-only | read-only | read-only |
| 2 | New field row appears | edit | edit | edit | hidden | read-only |
| 3 | Control Type dropdown open | edit | edit | edit | hidden | read-only |
| 4 | Dropdown type chosen — Dropdown List activates | edit | edit | edit | edit | read-only |
| 5 | Role dropdown open | edit | edit | edit | edit | read-only |
| 6 | All fields chosen, ready to save | edit | edit | edit | edit | read-only |
| 7 | After save — row committed | read-only | read-only | read-only | read-only | read-only |
| 8 | Edit existing field | edit | edit | edit | edit* | read-only |
| 9 | Non-dropdown new field | edit | edit | edit | hidden | read-only |
| 10 | Logic tab — edit mode landing | n/a | n/a | n/a | n/a | n/a |
| 11 | Logic tab — pick result field | n/a | n/a | n/a | n/a | n/a |
| 12 | Logic tab — map trigger options | n/a | n/a | n/a | n/a | n/a |
| 13 | Logic tab — saved, return to normal view | read-only | read-only | read-only | read-only | read-only |

\* State 8 Dropdown List: editable only when the field's Control Type is Dropdown. Hidden (—) for all other types. Spec: "Dropdown List (if type = dropdown)".

States 10-12 operate on the Logic Fields tab, not the Field Registry table. The five columns above are not rendered in that context.
