# Contract Editor — Architecture & Intent

_How the client-facing letter editor is meant to work: templates as reusable shells, job data as the fill, and the editor as the place you finalize a letter before it's sent. Captured 2026-06-13 from a working session that clarified the model end-to-end._

**Tags:** #loe #contract-editor #template-library #architecture #apr-dashboard #docuseal

---

## 1. The one-paragraph model

A **template** is a reusable letter shell (the LOE, a thank-you letter, etc.). When a user opens it from a job, **that client's job-ticket data auto-fills the template's fields**, producing a filled letter for *that* client. The user can then **reword the editable parts before sending** — that's the **Contract Editor**. The template's *structure* and its *data bindings* are never touched here; restructuring lives in a separate, future **Template Editor** on the management side.

> The editor's whole value: a letter is rarely a perfect static map. Most sends get a touch-up — personalize a paragraph, soften a line — and you'd never push that one-off wording into the APR job fields. You do it here, right before it goes out.

---

## 2. Two modes — do not conflate them

| | **Edit Contract** (built) | **Edit Template** (future) |
|---|---|---|
| **What it is** | Tailor one client's letter before sending | Restructure the template's bones |
| **Opens from** | The job ticket → Preview & Send | A management / settings area (never the job ticket) |
| **Already filled?** | Yes — this client's job data is loaded | No — you're editing the blank shell |
| **You can** | Reword editable wording | Move sections, define what's editable, change structure |
| **You cannot** | Move/restructure or unlock data fields | n/a |
| **How often** | Every time you send a letter | Rarely — only when improving a template |
| **Where versions live** | Only the live/best version is used | The full version history + diary |

The modal today is labelled **"Edit LOE Template"** — that name is wrong for this mode and is half the confusion. It is **Edit Contract**: you're editing the *contract for a client*, not the template.

---

## 3. What's editable vs what's locked (the SOP)

The editor renders the **whole filled letter**, top to bottom, mirroring the preview. Every part is clearly one of:

**Editable — open text box:**
- Body wording — sentences, clauses, terms. The narrative the user might personalize.

**Locked — shown, greyed, with a lock (never editable here):**
- **Section titles & numbers** — the structure.
- **Data fields pulled from the job ticket** — client, property, fee, dates, report type, value scenarios. They auto-fill from the job; editing them here would break the link to their source.
- **Signature blocks** — the DocuSeal anchors.

**Why locked parts are shown, not hidden:** the user skims the entire letter, sees exactly what they can and can't change, and confirms nothing's missing. A locked data field is self-explanatory — it's coming from the job ticket, so to change it you change the *job*, not the letter. There is no "unlock" here; unlocking a data field would mean re-binding the template's bones, which only happens in Template Editor mode.

---

## 4. Templates are reusable shells — and the editor is template-agnostic

LOE-07 is **one** template. A thank-you letter is **another**. Each is a distinct shell with its own wording and its own editable sections, but all of them pull from the **same job-ticket data** — each taking only the fields it needs.

The editor doesn't know or care which letter it's showing. It reads **editability markers** off whatever template loaded and renders editable wording as boxes, everything else locked. So a new template authored to the same marker convention drops into the **same** Contract Editor with zero new code. **One editor, every template.**

---

## 5. The two dropdowns — a critical distinction

There are two different template pickers, and they must not be confused:

**A. The Preview/Contract picker (client side, from the job dashboard)**
- Lists the **actual distinct templates** — LOE, Thank-You Letter, … — **one entry per template type.**
- Shows **only the live/best version** of each. It does **NOT** list version 1, 2, 3, 4 of the same LOE.
- A clogged dropdown of an LOE's version-lifecycle ("this one's newer, these are older") is the wrong UX — those versions belong behind the scenes.
- Picking an entry fills that template with this client's job data, ready to tailor + send.

**B. The Template Editor picker (management side, future)**
- Its own previewer, for structuring templates and managing their versions.
- Reached from a settings / management button — **never from the job ticket.**

> Why entering from the job ticket removes all ambiguity: going in from a job ticket *means* "all this client's job-ticket fields are what I intend to map into whatever template I pick." There's no question about which data fills the letter — it's the client whose ticket you just left.

---

## 6. The dashboard entry point & contract lifecycle

The job-dashboard button is currently **"Preview & Send LOE"** — too LOE-specific. It should be general: **"Create Contract"** (you go there, then *pick* what to make — LOE, thank-you, etc.). "Create New" is always available.

Once a contract is **created + saved**, it becomes a first-class object on that client's dashboard — you don't lose it into a one-shot send. The button grows into a **button + dropdown**:

- **Create Contract** (always) — start a new one from any template.
- **A dropdown/list of this client's existing contracts** — everything **saved, prepped, or sent**, each reopenable in preview.

**Contract states (per client):**

| State | Meaning |
|---|---|
| **Saved / Draft** | Created + tailored, not yet sent — reopen and keep editing |
| **Prepped** | Ready to go, awaiting send |
| **Sent** | Delivered to the client (DocuSeal) — reopen to view what went out |

So the dashboard always lets you spin up a new contract **and** see the history of what you've prepped or sent this client — instead of a single button that forgets everything after one send. That alone removes a lot of the current confusion about "where did my letter go."

---

## 7. Template Library & version lifecycle (future)

The full version history is **not** a dropdown in front of the user. It lives in a **Template Library** (the future settings/management environment):

- Holds **every version** of each template, with an editable history / **version diary**.
- Older or superseded versions sit here, out of the client-facing picker.
- A **"Live" button** promotes a version → it becomes the active one shown in the Preview/Contract picker.
- A retired version can be **reignited** — edited and re-made-live later.

Net: the client-facing picker only ever shows the **best, live** version of each template type. The lifecycle churn stays in the library.

---

## 8. Current build status

:::details{.boxed summary="What's built vs pending (2026-06-13)"}

**Built + verified live:**
- Marker-based, template-agnostic parser (`data-editable` / `data-removable`) with backward-compatibility for legacy class-based templates — `~/Development/APR-Dashboard-v3/src/utils/loe/templateParser.ts`.
- Editor renders **every** parsed section via one generic, id-agnostic map (replaced the old 5 hardcoded section IDs that silently dropped everything else) — `~/Development/APR-Dashboard-v3/src/components/dashboard/job-details/actions/TemplateEditorModal.tsx`.
- Round-trip preserves the merge-token data fields (re-wrapped by identity on save).
- Section labels carry the template's numbering — e.g. "2. Property Description — Current Use of the Property" — so the panel tracks the letter line-for-line.
- A marked demo template ("V07 — EDITABLE (demo)") proves it end-to-end. The marking is a reproducible script — `~/Development/APR-Dashboard-v3/docs/Features/12-LOE-Esign/loe07-build/mark-editable.py`.
- **Renamed** the dashboard button **"Preview & Send LOE" → "Create Contract"** and the modal **"Edit LOE Template" → "Edit Contract".**
- **Saved-contract framework** — new `job_contracts` table (one row per saved client contract: `job_id`, `template_id/version`, `name`, `edited_html`, `state` draft/saved/sent, `docuseal_submission_id`); data layer `~/Development/APR-Dashboard-v3/src/utils/loe/jobContracts.ts` (load/save/markSent/delete). The Contract Editor's Save now writes a **job contract** (not a template); the dashboard shows a **Saved Contracts** list per client (name + state badge + Open) and "Create Contract" always starts a new one. Save→list loop verified live.

**Pending (next steps):**
- Render the **locked** parts too (titles, job-ticket data, signatures) shown greyed with a lock — currently only editable boxes render. (Section 3 SOP.)
- Wire "Open" on a saved contract to reopen it in **edit** mode (currently reopens the preview seeded with its HTML); and flip a contract to **sent** on send (`markContractSent`).
- Decide whether to mark the **default** template (not just the demo) so the editor is rich on the default path — Ben's call; markers are non-visual + send-safe.
- Collapse the client-facing picker to **one live version per template type** (hide the version-lifecycle clutter). Tied to the Template Library work.

**Future (separate environments, not built):**
- The **Template Editor** (restructure templates) + the **Template Library** (version history, diary, Live button) on the management/settings side.
- Additional templates (e.g. thank-you letter) authored to the same marker convention.

:::

---

## 9. Glossary

- **Template** — a reusable letter shell (LOE-07, thank-you letter, …). Pulls job data into its fields.
- **Contract** — a template filled with one client's job data; what you edit + send.
- **Edit Contract** — per-client wording editor, opened from the job ticket. (Built.)
- **Edit Template** — structural editor for the template shell, on the management side. (Future.)
- **Template Library** — where all versions live, with history + a Live button. (Future.)
- **Marker** — `data-editable` / `data-removable` attributes that tell the editor what's editable vs locked, independent of the template.
