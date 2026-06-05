# v10 Field Edit Spec — Markdown Table Version

Every state shows the full table. **BOLD** = client can edit. *italic* = auto/read-only/greyed.

Column renamed: ~~Valcre API Key~~ → **Valcre Field ID**. Column added: **Status**.

---

## State 1: Default View — No editing

`[+ New Field]` button in header. All rows read-only. Click any Valta row to edit.

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|
| 1 | Active | Valta | PropertyType | Property Type | Select one | User Input | Trigger | ListPropertyType (9) | Property | Property.Types |
| 2 | Active | Valta | JobNumber | Job Number | Alpha Numeric | Valcre API | — | — | Job | Job.Number |
| 3 | Active | Valta | Tenancy | Tenancy | Select one | User Input | Trigger | ListTenancy (6) | Job | — |

---

## State 2: + New Field Clicked — Add row appears

New row at top. Client fills **BOLD** cells only. *Italic* = greyed out.

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| *—* | *Pending* | *Valta* | *auto* | **Type label here...** | **Select... ▾** | *User Input* | **Select... ▾** | *—* | *—* | *—* | `Save` `Cancel` |
| 1 | Active | Valta | PropertyType | Property Type | Select one | User Input | Trigger | ListPropertyType (9) | Property | Property.Types | |
| 2 | Active | Valta | JobNumber | Job Number | Alpha Numeric | Valcre API | — | — | Job | Job.Number | |

> Client can edit: **Label** (text input), **Control Type** (dropdown), **Role** (dropdown)
> Everything else visible but greyed out, not clickable.

---

## State 3: Client clicks Control Type — dropdown opens

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| *—* | *Pending* | *Valta* | *auto* | **Market Condition** | **Select... ▾** | *User Input* | **Select... ▾** | *—* | *—* | *—* | `Save` `Cancel` |

**↓ Control Type dropdown (6 simplified choices):**

| | |
|---|---|
| Text | |
| Number | |
| Date | |
| **▸ Dropdown** | ← *picks this* |
| Yes/No | |
| Multi-line | |

> System maps on save: Text→Text, Number→Whole Number, Date→Date, Dropdown→Select one option, Yes/No→Checkbox, Multi-line→Multiple lines of text

---

## State 4: Type = Dropdown chosen — Dropdown List column wakes up

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| *—* | *Pending* | *Valta* | *MarketCondition* | **Market Condition** | **Dropdown** | *User Input* | **Select... ▾** | **Select... ▾** | *—* | *—* | `Save` `Cancel` |

> *Field Name auto-previews as "MarketCondition" (from label, not editable)*

**↓ Dropdown List picker (friendly names, dashboard lists only):**

| | |
|---|---|
| Property Type (9) | |
| Property Subtype (3) | |
| Tenancy (6) | |
| Authorized Use (8) | |
| Status of Improvements (7) | |
| Value Timeframe (3) | |
| Report Type (3) | |
| Assignment Type (2) | |
| Yes/No (2) | |
| ──────────── | |
| **+ New List** | |

> NOT internal `List*` names. Dashboard lists only. "+ New List" opens inline option editor.

---

## State 5: Client clicks Role — dropdown opens

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| *—* | *Pending* | *Valta* | *MarketCondition* | **Market Condition** | **Dropdown** | *User Input* | **Select... ▾** | **Property Type (9)** | *—* | *—* | `Save` `Cancel` |

**↓ Role dropdown:**

| | |
|---|---|
| Independent | *Default. No cascade logic.* |
| **▸ Trigger** | *← picks this. "Configure Logic" button after save.* |
| Result | *Set by a cascade. "Configure Logic" button after save.* |

---

## State 6: All fields chosen — ready to save

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| *—* | *Pending* | *Valta* | *MarketCondition* | **Market Condition** | **Dropdown** | *User Input* | **Trigger** | **Property Type (9)** | *—* | *—* | `Save` `Cancel` |
| 1 | Active | Valta | PropertyType | Property Type | Select one | User Input | Trigger | ListPropertyType (9) | Property | Property.Types | |
| 2 | Active | Valta | JobNumber | Job Number | Alpha Numeric | Valcre API | — | — | Job | Job.Number | |

> Client filled: **Label**, **Control Type**, **Role**, **Dropdown List**
> System auto-fills on save: #, Status, System, Field Name, Source, Valcre Location, Valcre Field ID

---

## State 7: After Save — new row in table

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| **NEW** | **Pending** | Valta | MarketCondition | Market Condition | Select one | User Input | Trigger | ListPropertyType (9) | — | — | `Configure Logic` |
| 1 | Active | Valta | PropertyType | Property Type | Select one | User Input | Trigger | ListPropertyType (9) | Property | Property.Types | |
| 2 | Active | Valta | JobNumber | Job Number | Alpha Numeric | Valcre API | — | — | Job | Job.Number | |

> ↑ **Amber pulse highlight** on new row for 2-3 seconds
>
> Auto-generated: Field Name "MarketCondition", Control Type "Select one" (from "Dropdown"), Source "User Input", Status "Pending", Valcre Location — (dev team), Valcre Field ID — (dev team)
>
> `Configure Logic` → navigates to Logic Fields tab

---

## State 8: Edit Existing Field — click row 1

**BOLD** = editable. *italic* = read-only/greyed.

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| *1* | *Active* | *Valta* | *PropertyType* | **Property Type** | **Select one ▾** | *User Input* | **Trigger ▾** | **ListPropertyType (9) ▾** | *Property* | *Property.Types* | `Save` `Cancel` |
| 2 | Active | Valta | JobNumber | Job Number | Alpha Numeric | Valcre API | — | — | Job | Job.Number | |
| 3 | Active | Valta | Tenancy | Tenancy | Select one | User Input | Trigger | ListTenancy (6) | Job | — | |

> Editable: **Label**, **Control Type**, **Role**, **Dropdown List** (if type = dropdown)
> Read-only: *#, Status, System, Field Name, Source, Valcre Location, Valcre Field ID*
> Field Name **NEVER** changes even if Label is edited. Set once on creation.

---

## State 9: Non-dropdown field — simple add

| # | Status | System | Field Name | Label | Control Type | Source | Role | Dropdown List | Valcre Location | Valcre Field ID | |
|---|--------|--------|------------|-------|-------------|--------|------|---------------|-----------------|-----------------|---|
| *—* | *Pending* | *Valta* | *InspectionNotes* | **Inspection Notes** | **Multi-line** | *User Input* | **Independent** | *—* | *—* | *—* | `Save` `Cancel` |
| 1 | Active | Valta | PropertyType | Property Type | Select one | User Input | Trigger | ListPropertyType (9) | Property | Property.Types | |

> Type = Multi-line, Role = Independent. Dropdown List stays inactive. No "Configure Logic" after save.

---

## Rules

- All dropdowns show **"Select..."** in muted text until chosen. No defaults.
- Everything from v5 stays: all 4 tabs, scope toggle, search, filters, sorting, expandable dropdown rows, Fill Test Data, Reset.
