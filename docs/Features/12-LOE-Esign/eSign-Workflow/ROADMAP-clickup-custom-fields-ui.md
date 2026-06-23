# ClickUp Custom Fields — UI Roadmap for a Computer-Use Agent

> Purpose: hand a computer-use agent the exact click-paths so it does NOT have to discover the ClickUp UI by trial-and-error. Sourced ONLY from the public ClickUp Help Center (human how-to, not the API). Where the docs are silent, that is stated explicitly.

---

## THE ONE ANSWER THAT MATTERS MOST: Field ordering

**Question:** is a task's custom-field order driven by the field NAME (alphabetical), by manual drag, or by a per-view setting?

**Definitive answer (from the docs):** It is **a Workspace-level setting**, defaulting to **alphabetical (A–Z by field name)**, switchable to **manual drag** by a Workspace owner/admin.

- Default: *"Custom Fields are displayed in alphabetical order unless a Workspace owner or admin has decided to sort Custom Fields manually."*
- The toggle lives in the **Custom Fields ClickApp**: a **Sort** dropdown with options **A-Z** vs **Manual**. It is workspace-wide, not per-view.
- Manual reordering is then done in the **Custom Field Manager** (drag handles), NOT inside the task detail view itself.

**Critical scope limit — what manual sort actually affects:**
- It updates field order in **task detail view**, **Board view**, and **Calendar view**.
- It does **NOT** affect **List view** or **Table view** column order — those columns are reordered separately by dragging the column headers (a per-view layout, independent of the ClickApp sort).

**Fixed precedence that always overrides your chosen order:** even in alphabetical or manual mode, ClickUp groups fields by a fixed hierarchy first — filled required fields → empty required fields → filled pinned fields → empty pinned fields → the rest (from largest to smallest Hierarchy location). Your A-Z / manual order applies *within* those groups. So "rename to force position" is unreliable; pinning/required status wins.

**Agent takeaway:** do NOT assume renaming a field reorders it, and do NOT look for a drag handle in the task panel. To reorder: flip the ClickApp to Manual, then drag in the Custom Field Manager.

Source: [Manually sort Custom Fields](https://help.clickup.com/hc/en-us/articles/18332756185751-Manually-sort-Custom-Fields)

---

## 1. Rename an existing custom field

**Mechanic that matters:** rename is global — *"Changes will apply to the Custom Field throughout your Workspace."* There is no per-list display name.

**Click-path (fastest — from List or Table view):**
1. Click the **custom field's column header** (the column name in the view's header row).
2. The column menu opens; **rename it directly at the top of that menu** (the field name is editable inline at the top).
3. (Optional, for more than the name) click **Edit field** to open the mini editor, or **Advanced settings** to open the full **Custom Field Manager**.

**Click-path (from Custom Field Manager):**
1. Open the **Custom Field Manager**.
2. Click a field to open its editor (or click the **ellipsis `...`** on its right and select **Edit**).
3. Change the name, then click **Save** (lower-right).

**Gotchas/limits:**
- Renaming is workspace-wide and instant across every view and task.
- Standard/built-in fields cannot be renamed (open ClickUp feature request) — this path is for *custom* fields only.

Sources: [Edit Custom Fields](https://help.clickup.com/hc/en-us/articles/6303561371543-Edit-Custom-Fields) · [Intro to Custom Field Manager](https://help.clickup.com/hc/en-us/articles/13066263096727-Intro-to-Custom-Field-Manager)

---

## 2. Create a new custom field on a list

**Mechanic that matters:** the field is created at the **Hierarchy location of the view/task you create it from** (Space/Folder/List), and is auto-added to every task in that location.

**Click-path (from List or Table view — primary):**
1. Open the **List or Table view** on the target list.
2. In the **upper-right corner above the task table**, click the **`+` (plus) icon**. (Alternative: click the **`...` ellipsis** and select **Add a column**.)
3. **Search for and select a field type** (see types below).
4. **Name the field** and configure it (e.g. dropdown options).
5. *(Business Plus / Enterprise only)* optionally click **More settings and permissions** to set field permissions.
6. Click **Create**.

**Other entry points:** you can also create a field from inside a **task** (in the Custom Fields area) or from the **Custom Field Manager** directly. Same field-type picker.

**Field types we care about (all supported):** Text, Date, Email, Phone, URL, Dropdown, Checkbox — all listed in the type picker.

**Gotchas/limits:**
- Dropdown (and Label) fields: up to **500 options**; you can bulk-add options by copy-pasting values from outside ClickUp.
- Field **permissions** (locking who can edit) require **Business Plus or Enterprise**. The Custom Field Manager itself is on **all plans**.
- Creating from a List view adds the field to that List's location only; creating from a Space-level view scopes it Space-wide.

Sources: [Create Custom Fields](https://help.clickup.com/hc/en-us/articles/6303481086487-Create-Custom-Fields) · [Custom Field types](https://help.clickup.com/hc/en-us/articles/6303499162647-Custom-Field-types) · [Intro to Custom Fields](https://help.clickup.com/hc/en-us/articles/6303536766231-Intro-to-Custom-Fields)

---

## 3. Field ordering / display

See **THE ONE ANSWER** section above — that is the authoritative answer. Quick recap for the agent:

**Click-path to switch ordering mode + reorder:**
1. Open **ClickApps** (Workspace settings) → find the **Custom Fields ClickApp**.
2. Click its **Sort** dropdown → choose **Manual** (or **A-Z** for alphabetical default).
3. Open the **Custom Field Manager** → select the location in the **left sidebar**.
4. Click the **Reorder toggle** (upper-right corner).
5. Use the **drag handles** (left of each field) to reorder within each category. Saves automatically.

**Do NOT:** look for drag handles in the task detail panel, or try to reorder via List/Table column drags expecting it to change the task panel — those are separate (see Section 4).

Source: [Manually sort Custom Fields](https://help.clickup.com/hc/en-us/articles/18332756185751-Manually-sort-Custom-Fields)

---

## 4. The distinction the agent must not confuse

Three separate concepts — keep them apart:

**(a) A task's custom fields** — data fields (Text, Date, Dropdown, etc.) attached to a task. Live at a Hierarchy location, appear in the task detail panel. Ordered by the ClickApp Sort setting (Section 3). By default only **pinned, required, or fields-with-data** show on a task; empty unpinned fields are hidden. **Pinning** forces a field to always show (even empty) on all tasks workspace-wide. This is data + global visibility.

**(b) Board / Table / List VIEW columns** — a *per-view layout choice* of which fields are displayed and in what column order, in that one view only. Adding a field as a column (the `+`/Add a column control) affects only that view's table. Reordering columns = dragging column headers in that view. This is presentation, scoped to one view.

**(c) Tasks / subtasks** — the work items themselves in the Hierarchy (Space → Folder → List → Task → Subtask). Custom fields hang off tasks; views display tasks. "Organize the custom fields" (a + their order) is NOT the same as "put fields on a board" (b) and neither creates or moves tasks (c).

**The trap:** "organize the custom fields" = the ClickApp sort + Custom Field Manager (global, affects task panel/Board/Calendar). "Put them on a board / show them as columns" = a per-view column choice. An agent told to "organize the fields" should go to the Custom Field Manager, not start dragging board columns.

Sources: [Show Custom Fields in tasks and views](https://help.clickup.com/hc/en-us/articles/6330455628439-Show-Custom-Fields-in-tasks-and-views) · [Pin Custom Fields](https://help.clickup.com/hc/en-us/articles/22769161093015-Pin-Custom-Fields) · [Set Custom Fields on tasks](https://help.clickup.com/hc/en-us/articles/6303576489239-Set-Custom-Fields-on-tasks)

---

## 5. Creating list/Space tags and coloring them

**Mechanic that matters:** **tags live at the Space level.** *"Task tags live at the Space level of the ClickUp Hierarchy"* — any rename/recolor/delete affects every task in that Space. (There is no per-List tag scope; the "list tag" idea resolves to a Space tag applied to tasks in that list.)

**Click-path to create a tag (from a task in any view):**
1. **List view:** hover over a task → click the **tag icon** → type to create a new tag or search an existing one.
2. **Board view:** hover over a task card → the **tag icon** appears → click to create/add/edit/remove/delete.
3. **Table view:** add the **Tags column** → use it to create/add tags.
4. Use the **New** button to quickly add a brand-new tag inline.

**Click-path to color a tag:**
1. Next to any tag, click the **ellipsis `...` icon**.
2. Select **Change color**.
3. Pick from the **standard color spectrum**, OR click the **dropper icon** to enter a **hex code** / custom color.

**Rename a tag:** ellipsis `...` → **Rename** → type → Enter/Return.

**Gotchas/limits:**
- Rename / recolor / delete all propagate to **every task in the Space** — there is no undo-per-task.
- Tags are Space-scoped: a tag created in Space A is not available in Space B.

Sources: [Intro to tags](https://help.clickup.com/hc/en-us/articles/6304056754583-Intro-to-tags) · [Manage task tags](https://help.clickup.com/hc/en-us/articles/6304382595991-Manage-task-tags) · [Edit tags](https://help.clickup.com/hc/en-us/articles/6304011761815-Edit-tags)

---

## Notes on doc confidence

- **Field ordering:** the docs are explicit and unambiguous (alphabetical default, workspace ClickApp toggle to manual, scope excludes List/Table columns). No guessing required.
- **Exact on-screen pixel positions** (icon coordinates) are NOT in the docs — the agent must still visually locate the `+`, `...`, column header, and Reorder toggle. The control *names* and *relative locations* above are documented; absolute coordinates are not.
- **API note (out of scope but relevant):** reordering custom-field positions in tasks is a long-standing public-API feature request, i.e. the API historically could NOT set field display order — this is a UI-only operation. Treat field reordering as UI-only.
