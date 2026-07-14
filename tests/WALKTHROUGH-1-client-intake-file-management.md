---
title: "Workflow Verification 1 of 5 — Client Intake and File Management (FILLED example)"
type: workflow-verification
status: filled example for Ben — react-reviewed + designer-reviewed, corrected to the live screen
feature: a client's submission and its files, from the intake form to sorted into the job's folders and copied to SharePoint
---

# Workflow Verification 1 of 5 — Client Intake and File Management (form submission → SharePoint)

> **⭐ This document is a WORKFLOW VERIFICATION (Ben, 2026-07-14).** An agent drives the running product end to end, screenshots every step, and each shot passes or fails. It is **not** a "walkthrough" (that means talking a build through out loud to find gaps in how the team hands work over) and it is **not** an "audit" (that means a cold agent reading how a build RUN went — the process, not the product). Three different jobs; until today two of them shared a word, and an agent asked for one got whichever it found first. The file name still says WALKTHROUGH; the term above is what governs.

> **This is ONE section of a five-part app walkthrough.** It starts at the public intake form where a client submits details and attaches files, and ends with those files sorted into the job's folders and copied to SharePoint. The other four flows are **not written yet** — listed here so you see where this one sits:
>
> 1. **Client Intake and File Management** — the intake submission and its files, from the form to SharePoint *(this document)*
> 2. **Job creation from the intake** — the submission becoming a job record in the dashboard *(tentative, not written)*
> 3. **Job & client management** — the job pushed into the firm's job-tracking tools *(tentative, not written)*
> 4. **Engagement letter & e-signature** — the signable engagement letter stage *(tentative, not written)*
> 5. **Report builder** — building the appraisal report *(tentative, not written)*

---

## What this app is — read before you touch a step

You are testing part of an **appraisal-job workflow system** for a property-valuation firm:

- **A client submits an intake form** — the public "Appraisal Request" form where someone requesting a property appraisal fills in their details and attaches documents. Submitting it **creates a job**.
- **The job lands in the dashboard** — the firm's internal workspace, where one job moves through several stages (intake, job/client management, e-signature of the engagement letter, report builder).
- **Documents are one of those flows** — a client's uploaded files must reach the firm's document store, **SharePoint**, sorted into five fixed folders per job.

**This walkthrough tests the document path end to end.** It follows a single file from the intake form, into the job, filed into a folder, copied to the client's real SharePoint, and confirmed there by eye. **These are real client documents in the client's real SharePoint** — treat the data as live.

---

## Run these searches BEFORE you start

- **Run the two-phase search skill — `/search-2phase` — scoped to this project. Declare the skill by name; do not paste a raw command.** The skill owns both phases, the scoping, and the refuse-to-skip. A pasted command is something an agent half-runs; the skill named does the whole job.
- **Run it TWICE — once per subject, they are two different subjects.** A single blended query returns whichever subject the recent records favour and silently drops the other:
  - `/search-2phase` for the **client-intake flow** — the Appraisal Request form and submission — scoped to this project.
  - `/search-2phase` for **job creation in the dashboard** — scoped to this project.
- **Read the results YOURSELF.** Running the search is not the whole job; the understanding only forms in whoever did the reading. Do not hand the comprehension search to a helper agent.
- **Read the project map first:** `docs/00-APR-MASTER-DASHBOARD.md`. The `/prime-apr` skill runs this for you.
- **The five folder names come from one file:** `supabase/functions/_shared/jobSubfolders.ts` — the source of truth if the app ever shows a sixth or renamed folder.

---

## How to drive this walk

- **Open your OWN browser surface** and use only that ref for the whole walk: `cmux browser open <url> --workspace <ws>`. The app is shown in a shared surface in this workspace — if two agents drive the same one, each navigates the page out from under the other and reads the wrong screen.
- **Drive with the built-in browser:** `cmux browser <surface> navigate | eval | screenshot --out <path>`. Where a control has **no accessible role** (several here are plain divs, not buttons), use the exact selector given in the step — a snapshot looking for a "button" will find nothing and wrongly report the control missing.
- **The failure rule:** when a step fails, **stop there, capture the screenshot, and report it.** Do NOT repair the app mid-walk — a walk that fixes as it goes hides the defect it was meant to find.

## Run notes — read these or you will misread the app

- **A blank page is usually a dead browser tab, NOT a broken app.** The built-in browser tab can silently drop to `about:blank`, then answer every read as empty and refuse to navigate — it looks exactly like an app crash. Open a FRESH surface; the dead one never recovers.
- **Every file currently shows TWICE** — an older "Uploaded Documents" list and the newer "Client Documents" panel read the same records. Known open item. Work in the **Client Documents** panel; ignore the duplicate.
- **The client's SharePoint already holds two leftover test PDFs** from an earlier session (pending removal). Check for the specific file YOU filed; don't expect an empty tenant.

---

## Capabilities map — every user capability, filled first

| Capability | Built? | Where it lives on screen | What proves it works |
|---|---|---|---|
| Submit the intake form with a file attached | Yes | the public "Appraisal Request" form | a new job + the file in that job's unsorted pile |
| See the submitted file waiting unsorted | Yes | Client Documents panel (must be expanded), left gallery | the file card in the Unsorted area |
| Create the folder set for a new job | Yes | one small button at the right end of the folder-tabs row | the button turns green and reads "Folders"; five folders exist |
| Drag a file straight into the panel | Yes (proven) | dashed drop box at top of the left gallery | a dropped file uploads and appears in Unsorted |
| File a document into a folder | Yes | the "Move to" select box below each file's thumbnail | the file leaves Unsorted and appears under the chosen folder tab |
| Un-file (put a file back to Unsorted) | Yes | the "Back to Unsorted" entry in that select, after filing | the file returns to Unsorted and stays there across a reload |
| The app copies a filed file to SharePoint | Yes | (server, on filing) | the file appears in the matching SharePoint folder |
| Preview a document in the app | Yes | the file tile (a div, not a button — see selector) | the document renders readable in the preview frame |
| Upload straight into one named folder | GAP | (not present) | fail-closed: no such control exists yet |

---

## The walkthrough — numbered steps

### Precondition — the intake form

**Step 1.1** — Open the public "Appraisal Request" form. Press the **"Test Data"** button to fill every field in one click.
> **Where the button is:** top-right of the form's header row, same line as the heading "Appraisal Request". It is **deliberately faint** — small grey text, no border, no fill, with a small downward chevron to its left. Look for grey text top-right; a walker scanning for a normal button misses it. Hover tooltip: "Fill test data for development". In a script, match on visible text `Test Data` or the title attribute `Fill test data for development` (no test id).
> The button fills client, property, and contact fields but does **not** attach a file — that's the one manual step.

**Step 1.2** — In the documents section, attach a small test PDF named clearly (e.g. `walkthrough-test.pdf`).
> **SCREENSHOT [A]** — the form filled by "Test Data", with the test PDF attached, before submitting.
> **PASS [A]** = every field is populated and the attached file's name shows.

![step A](~/Development/KM-Exp/data/screenshots/apr-df-A.png)

**Step 1.3** — Submit the form.
> **SCREENSHOT [B]** — the success/confirmation screen.
> **PASS [B]** = the form reports success. Data pair: a new intake record exists and a document record references the file at the new job's storage path.

![step B](~/Development/KM-Exp/data/screenshots/apr-df-B.png)

### A. The file waits unsorted

**Step 2.1 — expand the panel FIRST.** On the new job's page, the Client Documents panel starts **collapsed**. Click the button whose exact text is **"Client Documents"** to expand it. (Skip this and you screenshot empty space and wrongly report the file never arrived.)
> **SCREENSHOT [C]** — the expanded panel with the file in the Unsorted area of the left gallery.
> **PASS [C]** = the file is in Unsorted. Data pair: exactly one document record for this job with no folder set.

![step C](~/Development/KM-Exp/data/screenshots/apr-df-C.png)

### B. Create the folder set (the dependency, first)

**Step 3.1 — negative control.** Look at the folder-tabs row and a file's card.
> **SCREENSHOT [D]** — the folder tabs dimmed (no green dots), a **dim outlined button reading "Create folder set"** at the right end of that row (past a thin vertical divider), and the file's "Move to" select greyed.
> **PASS [D]** = filing is blocked while no folders exist.
> **CRITICAL:** a greyed "Create folder set" on a fresh job means **SharePoint is unreachable**, not that the gate is working (the button disables when it can't reach SharePoint). If greyed, the walk can't proceed — report SharePoint down, don't record a pass.

![step D](~/Development/KM-Exp/data/screenshots/apr-df-D.png)

**Step 3.2** — Press "Create folder set" and wait.
> **SCREENSHOT [E]** — the **same button now green, reading "Folders" with a checkmark**; each folder tab bright with a small green dot; the five folder cards in the right-hand grey column. (Pressing the green "Folders" button later opens the job's SharePoint folder in a new tab.)
> **PASS [E]** = the button is green and reads "Folders"; five folders exist. Data pair: spot-confirm the same five exist on SharePoint.

![step E](~/Development/KM-Exp/data/screenshots/apr-df-E.png)

### C. Drag a second file straight into the panel (proven built)

**Step 4.1** — Find the **dashed drop box at the top of the left gallery** reading "Drop files here, or click to choose". Drag a second real file onto it (or click it to open the picker).
> **SCREENSHOT [F]** — the dropped file now in Unsorted alongside the first.
> **PASS [F]** = the dropped file uploads and appears in Unsorted. (Proven byte-for-byte: a real multi-page PDF dropped in, downloaded back, matched exactly.)

![step F](~/Development/KM-Exp/data/screenshots/apr-df-F.png)

### D. File a document into a folder

**Step 5.1** — On a file's card, open the **"Move to" select below the thumbnail** (full card width, not on the right edge; selector `[data-testid=move-to-folder]`).
> **SCREENSHOT [G]** — the select open: a placeholder "Move to…" first, then the five **full** names: `1. REPORT`, `2. CLIENT SUPPLIED`, `3. WORK FILES (TTSZ, PICS, COMPS)`, `4. CLIENT BILLING (Invoice, LOE)`, `5. LETTER OF RELIANCE (LOR)`.
> **PASS [G]** = the five full names appear here, exactly. Note: the folder **tabs** show SHORTENED names ("2. Client Supplied", "3. Work Files") — check the names in THIS dropdown, not the tabs. A sixth "Back to Unsorted" appears only **after** a file is filed, so "a sixth option" is a FAIL only before filing.

![step G](~/Development/KM-Exp/data/screenshots/apr-df-G.png)

**Step 5.2 — negative control for the destination.** Before filing, open the client's SharePoint `2. CLIENT SUPPLIED` folder for this job.
> **SCREENSHOT [H]** — that folder without your file (leftover test PDFs may be present — look for YOUR filename's absence).
> **PASS [H]** = your file is not there before you file it.

![step H](~/Development/KM-Exp/data/screenshots/apr-df-H.png)

**Step 5.3** — Choose `2. CLIENT SUPPLIED` from the select.
> **SCREENSHOT [I]** — the file **gone from Unsorted** and **present under the "2. Client Supplied" tab** when you click that tab.
> **PASS [I]** = the file left Unsorted AND shows under the tab. Data pair: the file's folder field now reads `2. CLIENT SUPPLIED`. (Count alone is not enough — confirm the card actually moved.)

![step I](~/Development/KM-Exp/data/screenshots/apr-df-I.png)

### E. It copies to SharePoint — the destination proof

**Step 6.1** — Refresh the client's SharePoint `2. CLIENT SUPPLIED` folder.
> **SCREENSHOT [J]** — the folder now showing YOUR document, "Modified By" reading `SharePoint App`, timestamp matching the filing.
> **PASS [J]** = your file is present in the real SharePoint folder, authored by `SharePoint App`, timestamped to now. **The file appearing here is the pass — not the app saying "filed."**

![step J](~/Development/KM-Exp/data/screenshots/apr-df-J.png)

### F. Un-file — filing is not a one-way door

Filing used to be one-way; putting a file in the wrong folder trapped it. Un-filing is a shipped fix. Use the SECOND file (the dragged-in one), so the SharePoint-proven file stays put.

**Step 7.1** — File the second file into any folder, then open its "Move to" select again and choose **"Back to Unsorted"** (the sixth entry that appears after filing). Then **reload the page**.
> **SCREENSHOT [K]** — the second file back in the Unsorted area, and still there after the reload.
> **PASS [K]** = the file returns to Unsorted AND survives a page reload (not just a screen flicker). Data pair: its folder field is cleared back to none.

![step K](~/Development/KM-Exp/data/screenshots/apr-df-K.png)

### G. Preview it in the app

**Step 8.1 — negative control with teeth.** Before opening anything, assert nothing is previewed: `document.querySelector('[data-testid=doc-frame]')` returns **null**.
> **SCREENSHOT [L]** — the panel with no document open (paired with the null assertion above — the assertion is what can actually fail).
> **PASS [L]** = the doc-frame element is null before you click.

![step L](~/Development/KM-Exp/data/screenshots/apr-df-L.png)

**Step 8.2** — Open the document. The file tile is a plain `div`, **not a button** — a snapshot won't find a control. Click it by selector: find the file-name label (`div.truncate` containing the filename), walk up to its `closest('div.flex.flex-col.overflow-hidden')` tile, and click that tile's `firstElementChild`.
> **SCREENSHOT [M]** — the document rendered readable in the preview frame (a real page, not a blank/broken box).
> **PASS [M]** = TWO checks together, because a blank white box looks identical to a real page in a photo: (1) the screenshot shows readable content; (2) assert `[data-testid=doc-frame]` is now **non-null** AND its `src` matches `/\.pdf/i` — it really points at the PDF.

![step M](~/Development/KM-Exp/data/screenshots/apr-df-M.png)

---

## The story in one glance

Thirteen pictures: the client fills the intake form with the faint "Test Data" button and attaches a file `[A]`, submits it `[B]`; the panel is expanded and the file waits in Unsorted `[C]`; filing is blocked until the folder set is created `[D]`, then the small button goes green to "Folders" and five folders exist `[E]`; a second file drags straight in `[F]`; the "Move to" dropdown shows the five full names `[G]`; the destination folder lacks our file before we file `[H]`; the file leaves Unsorted and appears under the Client Supplied tab `[I]` and really lands in the client's SharePoint, authored by the app `[J]`; un-filing returns the second file to Unsorted and it survives a reload `[K]`; and the document previews readably, confirmed by the frame's PDF source `[L][M]`. Any one wrong is where the feature fails.

---

## Machine-runnable layer — for the walking agent

One row per screenshot. Open your OWN surface. Save each to the named path.

| Shot | Action | Control (text / selector) | Expected state to capture | Save to |
|---|---|---|---|---|
| A | open Appraisal Request form, press Test Data, attach `walkthrough-test.pdf` | text `Test Data` / title `Fill test data for development` | form filled, file name shown | apr-df-A.png |
| B | submit the form | submit button | success screen | apr-df-B.png |
| C | click `Client Documents` to expand, view panel | button text `Client Documents` | file in Unsorted (ignore old duplicate list) | apr-df-C.png |
| D | look at folder-tabs row + a file card, before creating folders | button `Create folder set` (id create-folders) | tabs dimmed, button dim/outlined, Move-to greyed | apr-df-D.png |
| E | press Create folder set, wait | same button (id open-folders after) | button green reads `Folders`, tabs bright + green dots, 5 cards | apr-df-E.png |
| F | drop a 2nd file on the drop box | drop box (id drop-zone) `Drop files here, or click to choose` | dropped file appears in Unsorted | apr-df-F.png |
| G | open a file's Move to select | `[data-testid=move-to-folder]` | placeholder + five FULL folder names | apr-df-G.png |
| H | open SharePoint `2. CLIENT SUPPLIED` (held session) | — | your file absent | apr-df-H.png |
| I | choose `2. CLIENT SUPPLIED` | move-to-folder | file gone from Unsorted, present under that tab | apr-df-I.png |
| J | refresh SharePoint `2. CLIENT SUPPLIED` | — | your file present, Modified By SharePoint App | apr-df-J.png |
| K | file the 2nd file, choose `Back to Unsorted`, reload page | move-to-folder → `Back to Unsorted` | file back in Unsorted, survives reload | apr-df-K.png |
| L | assert no preview open | eval `[data-testid=doc-frame]` is null | empty preview + null assertion | apr-df-L.png |
| M | click the file tile (div.truncate → closest div.flex.flex-col.overflow-hidden → firstElementChild) | (no role — use selector) | doc-frame non-null AND src matches /\.pdf/i, page readable | apr-df-M.png |
