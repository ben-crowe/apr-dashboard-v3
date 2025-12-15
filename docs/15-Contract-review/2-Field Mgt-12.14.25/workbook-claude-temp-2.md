
You’ll be building a **repeatable pipeline**:

> Valcre workbook + sample reports → field map + templates → Claude Skill → auto‑filled appraisal reports.

Below is a concise, step‑by‑step SOP you can follow in VS Code with Claude Code.

***

## Phase 1 – Prepare the Valcre workbook

**Goal:** Make the workbook “machine readable” with clear field IDs.

1. Work on a copy
    - Save `Valcre_Appraisal_Template.xlsx` as a dev copy.
    - Keep the original untouched for safety.
2. Name all important cells
    - For every user input and computed result, create **Named Ranges** in Excel.
    - Use a consistent pattern:
        - Inputs: `Input_PropertyAddress`, `Input_YearBuilt`, `Input_SubjectPhoto1`
        - Outputs: `Output_ValueConclusion`, `Output_GLA`, `Output_CapRate`
3. Add a `FieldMap` sheet
Create a new sheet `FieldMap` with columns like:
    - `FieldName` – internal key: `property_address`, `year_built`, `value_conclusion`
    - `ExcelName` – named range: `Input_PropertyAddress`
    - `Sheet` – Excel sheet name
    - `CellAddress` – underlying cell (e.g. `B12`)
    - `Type` – `text | number | date | image | boolean | table`
    - `Role` – `input | computed`
    - `Description` – short human description

You can fill this manually for the first 20–30 fields, then let Claude help generate the rest later.

***

## Phase 2 – Turn reports into templates with placeholders

**Goal:** Convert your two fully filled reports into reusable templates.

1. Export the two sample reports
    - If they’re Word: keep `.docx` versions.
    - If PDF: try to get Word or at least good text exports.
2. Identify dynamic vs boilerplate sections
    - Dynamic: anything that changes per property (address, value, dates, zoning, rent roll stats, photos).
    - Boilerplate: standard scope, assumptions, certification language, etc.
3. Add placeholders into the report text
    - Replace dynamic chunks with field IDs that match `FieldName` from `FieldMap`, e.g.:
        - `123 Main St` → `{{property_address}}`
        - `January 1, 2025` → `{{effective_date}}`
        - `$850,000` → `{{value_conclusion}}`
    - Do this once per section; Claude can help you find and replace consistently.
4. Have Claude cross‑check with the workbook
In VS Code with Claude Code:
    - Give it:
        - The Valcre workbook file.
        - The two filled reports.
    - Ask:
        - “For each dynamic value in these reports, tell me which named range in the workbook it comes from, and propose a `FieldName` and placeholder (e.g., `{{field_name}}`).”
    - Review the mapping it proposes and update `FieldMap` + the templates until correct.

***

## Phase 3 – Build the `excel_appraisal` Skill in your repo

**Goal:** Give Claude a permanent “muscle memory” for this mapping and extraction.

1. Create a project folder
    - Example: `valcre-extractor/` inside your Antigravity workspace.
2. Create a Skill folder
    - `skills/excel_appraisal/`
Inside it, add:

**a) `SKILL.md` (high‑level instructions)**
Example structure:

```markdown
# Skill: excel_appraisal

## Purpose
This skill parses Valcre appraisal workbooks and generates:
- Field maps from named ranges and the FieldMap sheet
- JSON templates with {{placeholders}} for report generation

## Triggers
Use this skill when the user mentions:
- Valcre
- appraisal workbook
- FieldMap
- generating fields.json or templates.json
- report template placeholders

## Behavior
1. Open `Valcre_Appraisal_Template.xlsx` from the project root.
2. Use `excel_parser.py` to:
   - Scan Named Ranges and the `FieldMap` sheet
   - Output `generated/fields.json` and `generated/templates.json`
3. When the workbook changes, re-run the parser and show a diff of generated files.
4. Never invent field names; prefer existing `FieldMap.FieldName`. If missing, ask the user to confirm new names.
```

**b) `excel_parser.py` (the actual code)**
Responsibilities:
    - Read `Valcre_Appraisal_Template.xlsx` using `openpyxl` or `pandas`.
    - Read the `FieldMap` sheet and construct a list of fields.
    - Optionally scan specific “report” sheets and grab any cell containing `{{...}}` to build templates.
    - Write:
        - `generated/fields.json` – array of field definitions
        - `generated/templates.json` – array of template blocks with `text` + `fields`

You can ask Claude in VS Code:
> “Create a minimal `excel_parser.py` that reads the `FieldMap` sheet and outputs `generated/fields.json` and `generated/templates.json` based on any `{{ }}` placeholders it finds in the report sheets.”

***

## Phase 4 – Use Claude Code in your normal VS Code workflow

**Goal:** Make this a one‑command routine.

1. Open the repo in Antigravity + VS Code.
2. In the Claude side panel, tell it:
    - “Use the `excel_appraisal` skill to parse `Valcre_Appraisal_Template.xlsx` and regenerate `generated/fields.json` and `generated/templates.json`.”
3. Review the diff Claude shows you:
    - Check new or changed fields.
    - Confirm that template text still reads correctly with placeholders.

Whenever the client updates their Valcre workbook or report format, you repeat this command. Claude uses the Skill, runs the parser, and keeps everything in sync.

***

## Phase 5 – Generate real reports

**Goal:** Turn live inputs into final documents.

1. Your app collects data
    - Either from a web form, or directly from the workbook, or both.
    - It produces a data object keyed by `FieldName`:

```json
{
  "property_address": "789 Elm St",
  "effective_date": "2025-02-10",
  "value_conclusion": 910000
}
```

2. Your templating layer (server or client)
    - Loads `templates.json`.
    - For each template block, replaces `{{field_name}}` tokens with values.
    - Outputs a complete DOCX/PDF or HTML report.

Claude can help you:

- Write the merge engine code (Node, Python, whatever you like).
- Add tests using your two real reports as “golden” examples.

***

## Where your Microsoft learning doc fits

Your Microsoft tools doc (Excel, Word, etc.) is perfect as a **Skill input**:

- Drop that doc into your repo, e.g. `docs/ms-office-with-claude.md`.
- Link it from `SKILL.md` or mention:
> “For details on how this client uses Microsoft tools with Claude, see `docs/ms-office-with-claude.md`.”

That way, when Claude Code is using the `excel_appraisal` Skill, it can also respect any special conventions or tricks you’ve already documented for Excel, Word, or SharePoint.

***

If you’d like, next step: tell me your preferred language for `excel_parser.py` (Python vs Node) and I can draft a small, concrete file/folder layout you can paste straight into your repo and let Claude flesh out.



-----

Perfect. That's the cleanest approach. Here's the refined end state:

***

## End Goal – Clear breakdown

**You want:**

1. **Word document (master template)**  
   - Contains your full appraisal report structure and boilerplate.  
   - Every dynamic spot is marked with a **field ID** (e.g., `{{property_address}}`, `{{value_conclusion}}`).  
   - This becomes your "source of truth" for report layout.

2. **Field ID Register (JSON)**  
   - Canonical list of all field IDs used in the template.  
   - Maps each ID to:
     - Data type (text, number, date, image)  
     - Source (input from user, computed from Excel, static text)  
     - Description  
     - Validation rules (if any)

3. **HTML conversion**  
   - Convert the Word template to HTML (preserving structure/styling).  
   - The field IDs (`{{property_address}}`) stay in place in the HTML.  
   - Your app renders this HTML and replaces field IDs with live data programmatically.

***

## How the mapping process enables this

The Skill + `excel_parser.py` you build will:

1. **Read the Valcre workbook** to understand what fields exist and their sources.  
2. **Read your two client‑approved Word reports** to see how/where those fields appear in the final document.  
3. **Propose a canonical field ID list** and suggest placeholders for the Word template.  
4. **Generate the Field ID Register** (JSON) automatically, so you don't hand‑code it.

Once locked in, your Word template has field IDs, and your register is just a structured version of "what each ID means."

***

## Concrete workflow

### Step 1: Claude analyzes and maps  
In VS Code:

> "Parse the Valcre workbook, look at the two sample Word reports, and tell me:
> - What field IDs should exist?
> - Where should each one go in the report?
> - Propose a Field ID Register (JSON) and show where each ID should be placed in the Word template as `{{field_id}}`."

Claude produces:
- `field_register.json` – canonical list
- A marked‑up version of each sample report showing proposed `{{placeholder}}` positions

### Step 2: You lock in the template  
- Review Claude's proposals in your Word documents.  
- Manually add the `{{field_id}}` markers to the final Word template where Claude suggested.  
- Save as `AppraisalReport_Master.docx`.

### Step 3: Convert to HTML  
- Use a converter (e.g., Pandoc, or Word's "Save as HTML"):  
  ```bash
  pandoc AppraisalReport_Master.docx -t html -o AppraisalReport_Master.html
  ```
- The `{{field_id}}` markers remain in the HTML.  
- Clean up HTML if needed (remove Word‑specific cruft).

### Step 4: Your app uses it  
- Load `AppraisalReport_Master.html` and `field_register.json`.  
- When user fills form or selects property:
  - Gather data into an object keyed by field IDs.  
  - Replace all `{{field_id}}` tokens in the HTML with actual values.  
  - Render the filled HTML in a preview or convert to PDF for download.

***

## What the Skill outputs for you

Your `excel_appraisal` Skill will generate:

```
generated/
├── field_register.json          # Canonical field definitions
├── template_mapping.json        # Which fields appear in which sections
└── field_placement_report.md    # Human-readable guide showing proposed {{}} placements
```

Example `field_register.json`:

```json
{
  "fields": [
    {
      "field_id": "property_address",
      "type": "text",
      "source": "input",
      "valcre_named_range": "Input_PropertyAddress",
      "description": "Subject property street address",
      "required": true
    },
    {
      "field_id": "value_conclusion",
      "type": "number",
      "source": "computed",
      "valcre_cell": "Output!B45",
      "description": "Final concluded value",
      "format": "currency"
    }
  ]
}
```

***

## Quick recap of your pipeline

1. **Valcre workbook** → Claude Skill analyzes  
2. **Sample Word reports** → Claude Skill compares  
3. **Field ID Register** (JSON) → auto‑generated, you review  
4. **Word template** → you add `{{field_id}}` markers based on Claude's suggestions  
5. **HTML version** → auto‑converted from Word  
6. **Your app** → loads HTML + Register, swaps `{{field_id}}` with live data  

The mapping is the glue that connects steps 1–2 to steps 4–6.

***

Ready to scaffold this? Tell me:

- Python or Node for `excel_parser.py`?  
- Where's your Valcre file (e.g., `./data/Valcre_Template.xlsx`)?  
- And your two sample Word reports—same folder or different?

I'll draft the exact folder structure + starter `excel_parser.py` + `SKILL.md` you can paste into your repo.