---
title: "Workflow Verification — the job-document sorter: inbox → filed folder → SharePoint mirror → the listing showing it"
type: workflow-verification
status: draft by walkthrough-author — awaiting qa2 GATE ONE, then the fable round-trip, before any walker drives it
feature: an appraiser's file goes from the unsorted pile into one of the five job folders, is copied out to the client's SharePoint, and the folder then shows it — including the amber "filed but not mirrored" state and the union rule that keeps a SharePoint-only file visible
author: walkthrough-author (WRITER seat — wrote this from source; never opened the app)
source_read: src/features/job-documents/JobDocumentsPanel.tsx · src/features/job-documents/useJobDocuments.ts · supabase/functions/job-folder-docs/index.ts · supabase/functions/create-job-folders/index.ts · supabase/functions/_shared/jobSubfolders.ts · supabase/functions/_shared/filedName.ts · src/components/dashboard/JobDetailAccordion.tsx · src/pages/Dashboard.tsx
---

# Workflow Verification — the job-document sorter, end to end

> **What this proves.** One real file travels the whole path: added to a job's unsorted pile → filed into a folder (which writes the user's choice to the database FIRST) → copied out to the client's real SharePoint by the server (which stamps the mirror column ONLY on a confirmed 2xx) → shown inside its folder by the panel. Then the pre-registered break: the panel's folder contents are a UNION of database rows and the live SharePoint listing (INV-5) — a file that exists in SharePoint with no database row MUST still be shown, flagged. If the panel hides it, real client files are invisible to the user.

> **⛔ HARD RULE — verbatim from the deploy plan. NO AGENT CREATES, EDITS OR DELETES ANYTHING IN THE CLIENT'S CLICKUP WORKSPACE. Not to test, not to clean up, not one task. If an agent thinks it needs to touch the client's ClickUp, IT STOPS AND REPORTS. Ben pushes that button himself.** (Measured fact, for calibration not comfort: `src/features/job-documents/` contains no ClickUp reference; the panel invokes only `create-job-folders` and `job-folder-docs`, neither of which references ClickUp. This journey has no code path to ClickUp — the rule rides anyway.)

> **⚠ THIS WALK WRITES ONE REAL FILE INTO THE CLIENT'S REAL SHAREPOINT, PERMANENTLY.** There is no delete path in the app (`useJobDocuments.ts`: "We never delete from the client's tree. Accepted."). If the mirror lands, one ordinary-named test file remains in the client's `2. CLIENT SUPPLIED` folder and — after the break step deletes its database row — it is a ROW-LESS ORPHAN the app cannot act on. The report MUST name that file and its folder for Ben to remove by hand. If the mirror never lands, nothing is left anywhere but our own database and storage, both cleaned below.

---

## 1. Header block

- **Feature:** file a document from a job's unsorted pile into one of the five job folders; the server mirrors it to the client's SharePoint; the folder shows it; a SharePoint-only file stays visible flagged.
- **Test data:** job **VAL261068** — measured ground truth (2026-07-17): its SharePoint folder set EXISTS and all five buckets are empty, and no `job_files` row anywhere has ever had `filed_bucket` or `sharepoint_path` set. So this job gives us live folders, an empty stage, and a genuinely never-tried mirror. The test file is a small PDF the walker generates locally (Step 3.1) — never a real client document.
- **Destination (the proof):** the `job_files` row's `filed_bucket` and `sharepoint_path` columns, read straight from the database; the file visible inside its folder on screen; the `job-folder-docs` listing containing the filed name. **Never the app's toast or any "success" response.**
- **Session held:** none — the app has no login. Every route renders directly. Do not authenticate anything.
- **The walker's toolset — declared, and every step below uses ONLY these:**
  1. **Playwright, headless** (the globally-installed Playwright, Chromium) — navigate, click, fill, selectOption, setInputFiles, hover, evaluate, screenshot. This is the capture standard (Ben's ruling 2026-07-17). agent-browser is banned. The cmux in-workspace browser is the only sanctioned fallback for interactive clicking if headless driving jams — captures still go through Playwright.
  2. **Shell (Bash)** — to run the Playwright scripts, `curl`, and the small file-generation and env-reading commands given verbatim below. All keys come from the project's own `.env.local`; no key is invented.
  3. **Database read/write via Supabase REST (`curl`)** — exact commands supplied per step. The ONLY database write in this walk is the single row-delete that plants the break (Step 6.2), plus the cleanup delete at the end.
  4. **`job-folder-docs` invoked via `curl`** — the app's own edge function. This is a DATA PAIR beside the screenshots, **never the independent cross-check**: the panel unions this same source, so it cannot vouch for the panel. The walker has NO direct SharePoint/Graph access and no step below requires any.
- **What the walker does NOT hold:** direct SharePoint (Graph/Entra) auth; any ClickUp access; any repair permission. On a failed step: stop, shoot, report, change nothing.

**Environment setup (run once, from the project root `~/Development/apr-clean-working`):**

```bash
cd ~/Development/apr-clean-working
export SB_URL=$(grep '^VITE_SUPABASE_URL='  .env.local | cut -d'"' -f2)
export SB_KEY=$(grep '^VITE_SUPABASE_PUBLISHABLE_KEY=' .env.local | cut -d'"' -f2)
# Floor: if either is empty, STOP — report DISCOVERY "env keys not readable", do not improvise keys.
[ -n "$SB_URL" ] && [ -n "$SB_KEY" ] || echo 'DISCOVERY: .env.local keys missing'
```

**Dev server (check, then start only if down):**

```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:8086/ || true
# 200 → it is running, use it. Anything else → start it yourself (agents are authorized):
#   (cd ~/Development/apr-clean-working && npm run dev &) then re-check until 200.
# Floor: if it will not serve after starting, STOP — DISCOVERY, report the npm output.
```

---

## 2. Search prime — before you drive

- Run **`/search-2phase`** scoped to this project, once for **the job-document sorter and its SharePoint mirror**, and once for **the job page / Client Documents section**. Two subjects, two runs. Read the results yourself.
- Read the project map first: `docs/00-APR-MASTER-DASHBOARD.md` (`/prime-apr` runs it for you).
- The five folder names come from ONE file: `supabase/functions/_shared/jobSubfolders.ts`. If the app ever shows a sixth or a renamed folder, that file is the source of truth.

---

## 3. Capabilities map — filled first

| Capability | Built? | Second state? | Where it lives on screen | What proves it works |
|---|---|---|---|---|
| See the five folder tabs for a job | Yes | **live** (green dot, clickable) vs **dormant** (dimmed, inert — job has no folder set). BOTH walked: Steps 2.1 and 2.2 | the tab row at the top of the Client Documents section | live: green dot + clickable; dormant: dimmed, no dot, title says "this folder does not exist yet" |
| Create the folder set | Yes | button reads **"Create folder set"** (no set) vs **"Folders"** green (set exists) — both states SHOT (Steps 2.1, 2.2); the create ACTION itself is NOT fired in this walk (VAL261068 already has its set; creating one writes permanently to the client's tree with no need) | right end of the tab row, after a hairline divider | dim + "Create folder set" on a folderless job; green + "Folders" on VAL261068 |
| Add a file to the unsorted pile | Yes | drop a file / click-or-Enter opens the picker (one upload path) | dashed box "Drop files here, or click to choose" at the top of the left gallery | the file card appears in Unsorted; a `job_files` row exists with `filed_bucket` null |
| File a document into a folder — dropdown route | Yes | dropdown disabled while no folder set exists (gate `canFile`) | the "Move to…" select under each unsorted card | card leaves Unsorted; row's `filed_bucket` = the folder |
| File by dragging onto a folder card / onto a tab | Yes | drag disabled while no folder set | thumbnail → folder card in the grey well, or → a tab | same proof as the dropdown route |
| The server mirrors a filed file to SharePoint | **Never yet attempted — the genuine unknown** | mirrored (`sharepoint_path` set) vs amber "filed but not mirrored" — the FORK, Step 5 walks whichever occurs and asserts the contract either way | server-side; visible as the amber mark's absence/presence | `sharepoint_path` non-null on the row AND the filed name in the `job-folder-docs` listing |
| Amber mark on a filed-but-not-mirrored file | Yes | present only when mirror failed; absent when mirrored — the other half of the Step 5 fork | top-right of the card ("SharePoint failed"), `!` on the folder slot, cloud icon + count on the tab | `filed_bucket` set + `sharepoint_path` null on the row, and the mark visible |
| Folder contents show SharePoint-only files flagged (INV-5 union) | Yes — **the pre-registered break, Step 6** | with bytes here (normal card) vs SharePoint-only (blue "in SharePoint", no dropdown) | folder slots + the left gallery when the folder is open | after the row-delete: the item STILL visible, flagged — or the break FIRES |
| Un-file back to Unsorted | Yes | "↩ Back to Unsorted" appears in the select only after filing | the same "Move to…" select | NOT walked here — covered by Workflow Verification 1 (intake & file management); out of this journey's scope, deliberately |
| Preview a document in-app | Yes | — | click a thumbnail | NOT walked here — covered by Workflow Verification 1; out of scope, deliberately |
| Open the folder set in SharePoint web | Yes | "Folders" button opens `folderUrl` in a new tab; disabled when the job record carries no folder URL | the green "Folders" button | NOT walked — it opens the client's live SharePoint in a browser the walker must not wander; noted for the free look only |
| Delete a file from a folder / from SharePoint | **GAP — no delete action exists anywhere in this feature** | — | (not present) | fail-closed: Step 7.2 asserts no delete control exists on a filed card. Passes trivially today; flips to a real test if a delete ever ships, with no rewrite |

---

## 4. The walkthrough — numbered steps

**Screenshot directory:** `tests/_verify-shots/doc-sorter/` (create it first: `mkdir -p ~/Development/apr-clean-working/tests/_verify-shots/doc-sorter`).

### Step 0 — prove your instruments, BOTH directions, before trusting anything

**Step 0.1** — Prove the database read can say YES and NO.

```bash
# YES — a known-present query. The job_files table holds pre-existing rows (measured 2026-07-17).
curl -s "$SB_URL/rest/v1/job_files?select=id,file_name&limit=1" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
# MUST return at least one real row (a JSON array with one object). [] here = the instrument is
# blind (wrong key, RLS wall) → STOP, DISCOVERY. Do not proceed to any data pair with a blind reader.

# NO — a known-absent query.
curl -s "$SB_URL/rest/v1/job_files?select=id&file_name=eq.no-such-file-zzz-99.pdf" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
# MUST return []. A non-empty answer here means the reader is not filtering — also STOP.
```

**Step 0.2** — Resolve the test job's id, from its job number. This derivation has a floor.

```bash
curl -s "$SB_URL/rest/v1/job_submissions?job_number=eq.VAL261068&select=id,job_number,property_name" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
# Save the returned id as JOBID:  export JOBID=<the id value>
# Floor: [] → STOP, DISCOVERY "VAL261068 not found" — report to the coordinator; do NOT substitute
# another job on your own judgement (job choice is a scope decision, not a walker decision).
```

**Step 0.3** — Prove the `job-folder-docs` listing instrument, both directions.

```bash
# YES — VAL261068 has a folder set (measured ground truth), so:
curl -s -X POST "$SB_URL/functions/v1/job-folder-docs" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" -H "Content-Type: application/json" \
  -d "{\"jobId\":\"$JOBID\",\"action\":\"list\"}"
# MUST return HTTP 200 JSON with "foldersExist": true and a "buckets" array naming ALL FIVE:
# "1. REPORT", "2. CLIENT SUPPLIED", "3. WORK FILES (TTSZ, PICS, COMPS)",
# "4. CLIENT BILLING (Invoice, LOE)", "5. LETTER OF RELIANCE (LOR)".
# A 503 body {"configured": false, ...} → SharePoint write-side is unconfigured → the MIRROR AND THE
# BREAK ARE UNREACHABLE THIS RUN. Continue only through Step 4 (filing is database-truth and still
# testable), record every SharePoint-dependent step as DISCOVERY, never PASS.
# Floor: any other error → STOP, DISCOVERY with the exact body.

# NO — the same call for a job WITHOUT a folder set must say so, not invent folders.
# Find one (11 of 14 jobs have none): loop ids from
#   curl -s "$SB_URL/rest/v1/job_submissions?select=id,job_number&job_number=neq.VAL261068&limit=14" \
#     -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
# calling the list action per id until one returns {"foldersExist": false, "buckets": []}.
# Save that id as NOFOLDER_JOBID (it is also used in Step 2.2).
# Floor: if every job has folders (none returns false), skip Step 2.2 and record it as
# DISCOVERY "no folderless job available for the dormant-state shot" — do not fake one.
```

### Step 1 — the page, and the section

**Step 1.1** — Navigate to `http://localhost:8086/dashboard/job/$JOBID`. The job detail page renders as one vertical scroll. Find the collapsible section headed **"Client Documents"** (a grey header bar with a chevron). It is open by default; **if the chevron points right (collapsed), click the header once to expand it** — never shoot it folded. Inside: a "Documents to Request" field, then the sorter — a hint line "Drag onto a folder or its tab · or use the dropdown on a file", the five folder tabs, a progress row, a two-column area: left gallery with a dashed drop box, right a grey "Job Folders" well with five white folder cards.

> **SCREENSHOT [A]** — the whole Client Documents section, expanded, on VAL261068: tab row, progress row, drop box, and the grey well with all five folder cards visible.
> **PASS [A]** = all five tabs read (short labels) "1. Report", "2. Client Supplied", "3. Work Files", "4. Client Billing", "5. Letter of Reliance", **each with a small green dot** (the folder set exists), and the button at the row's right end is green and reads **"Folders"**. FAIL = any tab missing, any tab dimmed with no dot on THIS job, the button reading "Create folder set", or a sixth folder name. Data pair: the Step 0.3 YES listing (five buckets, `foldersExist` true).

**Step 2.1** *(same shot as A covers the live state — this step is the assertion)* — On VAL261068 every tab is **live**: green dot, normal text, `title` = the full folder name. The gate is open: `data-live="true"` on each tab.

```bash
# Machine assertion (Playwright evaluate, on the open page):
#   document.querySelectorAll('[data-testid="folder-tab"][data-live="true"]').length === 5
```

**Step 2.2** — The tabs' SECOND state. Navigate to `http://localhost:8086/dashboard/job/$NOFOLDER_JOBID` (the folderless job found in Step 0.3). Expand "Client Documents" if collapsed. The five tabs render **dormant**: dimmed, NO green dot, not clickable (`data-live="false"`, `title` ends "— this folder does not exist yet"), and the row's button is dim and reads **"Create folder set"**. **Do NOT press it** — creating a folder set writes permanently into the client's SharePoint tree and is not this walk's journey.

> **SCREENSHOT [B]** — the folderless job's tab row: five dimmed tabs without dots, the dim "Create folder set" button.
> **PASS [B]** = dormant styling on all five + "Create folder set" visible. FAIL = tabs showing green dots or the button reading "Folders" on a job whose listing said `foldersExist: false`. Data pair: the Step 0.3 NO listing for this job. Machine assertion: `querySelectorAll('[data-testid="folder-tab"][data-live="false"]').length === 5`.

Then return to `http://localhost:8086/dashboard/job/$JOBID` and re-expand the section if needed. Everything below happens on VAL261068.

### Step 3 — negative control, then the file enters

**Step 3.1** — Prove the test file ABSENT before it exists anywhere. Generate it, then check all three destinations:

```bash
mkdir -p ~/Development/apr-clean-working/tests/_verify-shots/doc-sorter
# A tiny one-page PDF (valid, ~0.3 KB, far under the 4 MB mirror cap):
printf '%%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n164\n%%%%EOF\n' > /tmp/walk-doc-sorter-test.pdf

# ABSENT in the database:
curl -s "$SB_URL/rest/v1/job_files?job_id=eq.$JOBID&file_name=eq.walk-doc-sorter-test.pdf&select=id" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"          # MUST be []
# ABSENT in the SharePoint listing (search the Step 0.3 YES output):
#   no item name containing "walk-doc-sorter-test" in ANY bucket.
# ABSENT on screen: the Unsorted gallery does not show a card named walk-doc-sorter-test.pdf.
```

> **SCREENSHOT [C]** — the left gallery in its starting state on VAL261068 (the Unsorted view header and whatever the pile holds — per ground truth, expected empty: the green "Everything is sorted" line).
> **PASS [C]** = no card named `walk-doc-sorter-test.pdf` anywhere on the page, AND both absence reads above returned empty. FAIL = the name already present anywhere — STOP, the stage is contaminated; report before touching it. *(This step CAN fail — it is a real check against three sources, not a photo of empty space.)*

**Step 3.2** — Add the file. The drop box ("Drop files here, or click to choose") routes clicks to a hidden file input; drive that input directly — it is the app's own scripted-access path:

```bash
# Playwright: page.setInputFiles('[data-testid="file-picker"]', '/tmp/walk-doc-sorter-test.pdf')
```

A toast appears ("1 file added — unsorted, file them into a folder") — **ignore it as proof**. The gallery now shows a card named `walk-doc-sorter-test.pdf` in Unsorted; the progress row reads "**1** still to sort"; under the card sits a "Move to…" dropdown.

> **SCREENSHOT [D]** — the Unsorted gallery with the new card: its name visible, the "Move to…" select visible beneath it, the "1 still to sort" progress line in frame.
> **PASS [D]** = card + name + dropdown + counter all present. FAIL = no card (upload path broken), or a card with no dropdown, or the counter unchanged. Data pair (the destination, not the toast):
> ```bash
> curl -s "$SB_URL/rest/v1/job_files?job_id=eq.$JOBID&file_name=eq.walk-doc-sorter-test.pdf&select=id,file_path,filed_bucket,sharepoint_path" \
>   -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
> # MUST return exactly ONE row, filed_bucket null, sharepoint_path null. Save its id as ROWID and
> # its file_path as STORAGEPATH.
> ```

### Step 4 — filing: the database-first half (needs SharePoint for nothing)

**Step 4.1** — On the new card, open its "Move to…" dropdown (`select` element, `data-testid="move-to-folder"`, accessible name "Move `walk-doc-sorter-test.pdf` to a folder") and choose **"2. CLIENT SUPPLIED"**.

```bash
# Playwright: page.selectOption('[data-testid="move-to-folder"]', '2. CLIENT SUPPLIED')
# (One unsorted card exists, so one such select exists; if more appear, scope by the card's name first.)
```

What should appear, in order: the card leaves the Unsorted gallery (progress flips to the green "Everything is sorted" line); the "2. Client Supplied" tab's count reads 1; the "2. CLIENT SUPPLIED" folder card in the grey well flashes green and its first slot fills with the file's thumbnail.

> **SCREENSHOT [E]** — the panel after filing: Unsorted empty ("Everything is sorted"), the "2. CLIENT SUPPLIED" folder card with one filled slot, its header reading "1 file", the tab count 1.
> **PASS [E]** = all three visible movements happened. FAIL = the card still in Unsorted, or vanished entirely (filed nowhere), or in a different folder. Data pair — the half of filing that owes SharePoint nothing:
> ```bash
> curl -s "$SB_URL/rest/v1/job_files?id=eq.$ROWID&select=filed_bucket,filed_at,sharepoint_path" \
>   -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
> # MUST show filed_bucket = "2. CLIENT SUPPLIED" and filed_at set. sharepoint_path is Step 5's
> # question — do not read anything into it yet.
> ```

**Step 4.2** — Open the folder on screen: click the **"2. CLIENT SUPPLIED"** folder card in the grey well (`[data-testid="folder-card"][data-folder="2. CLIENT SUPPLIED"]`). The left gallery's header changes to "2. CLIENT SUPPLIED · 1 file" with a "back to Unsorted" button, and the file's card renders there.

> **SCREENSHOT [F]** — the left gallery showing the folder view: header "2. CLIENT SUPPLIED", the file card inside it.
> **PASS [F]** = the file visible INSIDE its folder view. FAIL = folder view empty while the tab count says 1 (a real bug: the row is filed but the folder does not render it). *(Broken and working do NOT photograph identically here — but pair it anyway:)* machine assertion: `document.querySelectorAll('[data-testid="doc-thumb"]').length === 1` with the gallery header containing "2. CLIENT SUPPLIED".

### Step 5 — the mirror: the genuine unknown. A FORK — walk whichever arm reality takes, assert the contract on both

The filing click in Step 4.1 also fired the server call (`job-folder-docs`, action `file-from-storage`). Its outcome was unknown when this document was written — **either arm is a result worth having; neither arm is "the walk failed" by itself.** Read the row:

```bash
curl -s "$SB_URL/rest/v1/job_files?id=eq.$ROWID&select=filed_bucket,sharepoint_path" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
```

**Arm MIRRORED — `sharepoint_path` is non-null.**

**Step 5.1M** — On screen (reload the page, reopen the section, reopen the folder view — carry the state): the card shows NO amber mark, the tab shows NO cloud icon.

> **SCREENSHOT [G]** — the folder view after reload: the card clean (no "SharePoint failed" badge), the tab row without a cloud mark.
> **PASS [G]** = no amber anywhere for this file AND the data pair holds BOTH landed-signals: (1) `sharepoint_path` non-null on the row; (2) the filed name present in the listing —
> ```bash
> curl -s -X POST "$SB_URL/functions/v1/job-folder-docs" \
>   -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" -H "Content-Type: application/json" \
>   -d "{\"jobId\":\"$JOBID\",\"action\":\"list\"}"
> # In the "2. CLIENT SUPPLIED" bucket: an item whose name is "walk-doc-sorter-test-<8hex>.pdf",
> # where <8hex> = the first 8 characters of ROWID with dashes removed (the filed-name rule,
> # filedName.ts — the copy carries the row-keyed name, NOT the bare original name).
> ```
> FAIL = `sharepoint_path` set but the name absent from the listing (a stamp with no landing — the exact false-2xx this contract forbids), or amber shown on screen while `sharepoint_path` is set (screen contradicting the row). **Remember: this listing is the same source the panel unions — it is a data pair, not an independent witness. The row + the on-screen folder are the proof.**

**Arm AMBER — `sharepoint_path` is null.**

**Step 5.1A** — The amber CONTRACT, as a checked assertion (this is not the break; it is the rule that a failed mirror must never fake success). On screen (after reload, folder reopened): the card carries the amber badge **"SharePoint failed"** (top-right, `data-testid="amber-mark"`, title "Filed here. The copy to SharePoint has not landed — the file is safe."); the folder card's slot shows a small `!`; the "2. Client Supplied" tab shows a small cloud icon.

> **SCREENSHOT [G]** — the folder view with the amber badge visible on the card, and the tab's cloud mark in frame.
> **PASS [G]** = amber visible on screen AND the row reads `filed_bucket` = "2. CLIENT SUPPLIED" with `sharepoint_path` null AND the listing does NOT contain the filed name. The file reads as FILED, never as lost. FAIL = `sharepoint_path` NON-NULL while the mirror demonstrably did not land (a stamp without a 2xx — a real bug, report it hard), or the file bounced back to Unsorted, or it vanished.
> **AND: on this arm the INV-5 break is UNREACHABLE. Steps 6.x are recorded as `DISCOVERY — INV-5 untested: its prerequisite (a landed mirror) did not occur this run`, NEVER as PASS.** A 503 or any error from `job-folder-docs` means the write NEVER LANDED — never "the panel correctly showed nothing". Skip to Step 7.

### Step 6 — THE PRE-REGISTERED BREAK: INV-5 union rendering (MIRRORED arm only)

**⛔ THE LANDED-CONFIRMATION GATE — do not touch the row until BOTH signals from Step 5.1M are positively in hand:** (1) `sharepoint_path` non-null, (2) the filed name in the listing. Without both, deleting the row leaves no SharePoint copy, the panel correctly shows nothing, and that empty panel is INDISTINGUISHABLE from "INV-5 works" — a break that never fired, read as a pass. If either signal is missing: DISCOVERY, stop this step.

**Step 6.1** — Record what the panel shows NOW (the before-state of the break): folder view open, one card, with a normal "Move to…" dropdown (we hold the bytes).

**Step 6.2** — Plant the break: delete the file's database row — the SharePoint copy then has no row, which is exactly the `sharepointOnly` condition the union rule exists for. **This deletes OUR row in OUR database; it touches nothing in the client's tree.**

```bash
curl -s -X DELETE "$SB_URL/rest/v1/job_files?id=eq.$ROWID" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" -H "Prefer: return=representation"
# BOTH-DIRECTIONS PROOF OF THE DELETE ITSELF:
#   YES — the response body must contain the deleted row (return=representation shows what went).
#   NO  — re-read must now be empty:
curl -s "$SB_URL/rest/v1/job_files?id=eq.$ROWID&select=id" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"     # MUST be []
# Floor: if the DELETE returns [] and the re-read still shows the row (RLS refused the delete),
# the instrument cannot plant the break → DISCOVERY "break unplantable with the walker's key",
# STOP this step, report. Never report INV-5 either way from an unplanted break.
```

**Step 6.3** — Reload the page (full navigation, not a soft refresh), expand "Client Documents", click the **"2. CLIENT SUPPLIED"** folder card. **The file must STILL be visible** — now as a SharePoint-only item: in the folder slot and in the gallery card, a blue document icon with the text **"in SharePoint"**, and NO "Move to…" dropdown (nothing in our database to move). Its name on screen is the FILED name (`walk-doc-sorter-test-<8hex>.pdf`).

> **SCREENSHOT [H]** — the folder view after the row-delete and reload: the item present, flagged "in SharePoint", no dropdown under it.
> **PASS [H]** = the item visible and flagged. **FAIL — THE BREAK FIRES — the folder shows empty ("This folder is empty") or the item is gone:** a real client file in SharePoint is invisible to the user. Capture, stop, report — this is the failure this whole walk exists to be able to see. Data pair: the listing still contains the filed name (the file exists; only our row is gone) —
> ```bash
> curl -s -X POST "$SB_URL/functions/v1/job-folder-docs" \
>   -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" -H "Content-Type: application/json" \
>   -d "{\"jobId\":\"$JOBID\",\"action\":\"list\"}"   # name still in "2. CLIENT SUPPLIED"
> ```
> *(Broken and working DO photograph differently here — an empty folder vs a flagged card — but the machine assertion rides anyway: `document.body.innerText.includes('in SharePoint')` within the folder view, and `querySelectorAll('[data-testid="move-to-folder"]').length === 0` in that view.)*

> **SCREENSHOT [I]** — zoom/crop of the flagged card itself (the blue "in SharePoint" label legible) — the one-glance evidence of INV-5 holding.
> **PASS [I]** = label legible. FAIL = covered by [H].

### Step 7 — closing assertions

**Step 7.1** — The tab count and the folder card count still include the SharePoint-only item (count 1), and the progress row does NOT count it as "still to sort" (SharePoint-only items are excluded from the sorted/unsorted arithmetic — `filedCount` counts only non-`sharepointOnly` items; with the row deleted, expected on-screen state: "Everything is sorted", folder count 1).

> **SCREENSHOT [J]** — the full panel: tab row with "2. Client Supplied · 1", progress row, grey well.
> **PASS [J]** = counts as stated. FAIL = the item double-counted, or counted as unsorted, or the count 0 while the card renders.

**Step 7.2** — Fail-closed GAP step: confirm NO delete control exists for a filed or SharePoint-only item — no button, menu, or dropdown entry offering delete/remove on the card, the slot, or the folder view. Passes trivially today (no such control is in the source). If one ever appears, this step flips to a real both-states test of it with no rewrite.

> **PASS** = no delete control found. FAIL = a delete control exists (the source has changed — flag for a document update, and do NOT press it).

### Step 8 — FREE LOOK (no expected outcome)

Scroll the entire Client Documents section slowly, at normal zoom, both the Unsorted view and each of the five folder views (click each folder card once). Report anything wrong, ugly, misaligned, truncated, overlapping, flickering, or surprising, even though no step asked about it. Known context so you do not re-report it: an older "Uploaded Documents" list elsewhere on the page may show the same records — a known open item, not a finding.

> **SCREENSHOT [K]** — anything the free look surfaces (one shot per finding); otherwise one final full-section shot as the closing frame.

### Cleanup — leave the stage as found (our side only)

```bash
# AMBER arm only: Step 6 never ran, so the test row still exists — remove it first, same proof shape:
#   curl -s -X DELETE "$SB_URL/rest/v1/job_files?id=eq.$ROWID" \
#     -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" -H "Prefer: return=representation"
#   then re-read id=eq.$ROWID → MUST be []. (Mirrored arm: the row went in Step 6.2 already.)
# The storage object is now orphaned on BOTH arms — remove it:
curl -s -X DELETE "$SB_URL/storage/v1/object/job-files/$STORAGEPATH" \
  -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY"
# Verify gone (both directions: this URL returned the bytes in the walk; now it must 404 or refuse):
curl -s -o /dev/null -w '%{http_code}' "$SB_URL/storage/v1/object/public/job-files/$STORAGEPATH"
# Floor: if the storage delete is refused, report the orphaned object's path — do not retry blindly.
# THE SHAREPOINT COPY (mirrored arm): CANNOT be removed — no delete path exists. REPORT IT BY NAME:
#   "walk-doc-sorter-test-<8hex>.pdf in VAL261068's '2. CLIENT SUPPLIED' folder — row-less orphan,
#    Ben removes it by hand in SharePoint." This line is REQUIRED in the report on the mirrored arm.
```

---

## 5. Machine-runnable table

| Step | Route / action | Control (text or selector) | Expected state to capture | Screenshot out-path |
|---|---|---|---|---|
| [A] | `navigate http://localhost:8086/dashboard/job/$JOBID` | section header "Client Documents" (expand if chevron points right) | 5 live tabs w/ green dots, green "Folders" button | `tests/_verify-shots/doc-sorter/step-A.png` |
| [B] | `navigate http://localhost:8086/dashboard/job/$NOFOLDER_JOBID` | same section header | 5 dormant tabs, dim "Create folder set" (do NOT press) | `tests/_verify-shots/doc-sorter/step-B.png` |
| [C] | back on `$JOBID` page | left gallery, Unsorted view | test filename absent on screen + `[]` from both absence reads | `tests/_verify-shots/doc-sorter/step-C.png` |
| [D] | `setInputFiles '[data-testid="file-picker"]' /tmp/walk-doc-sorter-test.pdf` | hidden input inside `[data-testid="drop-zone"]` | card in Unsorted, "Move to…" select, "1 still to sort"; DB row exists, `filed_bucket` null | `tests/_verify-shots/doc-sorter/step-D.png` |
| [E] | `selectOption '[data-testid="move-to-folder"]' '2. CLIENT SUPPLIED'` | the select under the card | Unsorted empty, folder card slot filled, tab count 1; row `filed_bucket` set | `tests/_verify-shots/doc-sorter/step-E.png` |
| [F] | `click '[data-testid="folder-card"][data-folder="2. CLIENT SUPPLIED"]'` | the folder card in the grey well | gallery header "2. CLIENT SUPPLIED · 1 file", card inside | `tests/_verify-shots/doc-sorter/step-F.png` |
| [G] | reload → reopen section → reopen folder | `[data-testid="amber-mark"]` present or absent | MIRRORED arm: no amber + both landed-signals; AMBER arm: badge visible + `sharepoint_path` null | `tests/_verify-shots/doc-sorter/step-G.png` |
| [H] | LANDED-GATE → `curl DELETE` the row → full reload → reopen folder | the folder view | item still visible, flagged "in SharePoint", no dropdown — or THE BREAK FIRES (empty folder) | `tests/_verify-shots/doc-sorter/step-H.png` |
| [I] | crop/zoom of the flagged card | blue "in SharePoint" label | label legible | `tests/_verify-shots/doc-sorter/step-I.png` |
| [J] | full panel | tab row + progress row | tab "2. Client Supplied · 1", "Everything is sorted" | `tests/_verify-shots/doc-sorter/step-J.png` |
| [K] | free look | — | anything surprising; else closing frame | `tests/_verify-shots/doc-sorter/step-K.png` |

---

## 6. How to drive this walk

- **Capture with Playwright, headless** — the global install; write shots to the out-paths above. Never agent-browser. If headless interaction jams on a control, the cmux in-workspace browser is the only sanctioned interactive fallback — captures still come from Playwright.
- **Selectors are given because several controls are not what a role-snapshot expects:** the folder card is a clickable `div` (not a button); the file input is hidden; the "Move to…" is a native `select`. Use the `data-testid` selectors verbatim.
- **On a failed step: STOP.** Capture the shot, report the exact fail, change nothing. A walk is a test, not a repair session.
- **When reality does not match a step, say it out loud in the report** — the step said X, the screen showed Y, here is what you did. A silent skip returns a clean report on an untested app.
- **Trust nothing the app says about itself.** Toasts, green ticks, 200s — none is a pass. The row, the listing, the thing on screen in its folder — those are.
- **Carry the state forward.** Steps assume: section expanded → file added → filed → folder view open → reload re-collapses nothing by default but re-verify the section is open after every full navigation.
- **Report per step:** the pass marker observed OR the exact fail — never a bare tick. Report each item to coarch2 as it lands.

---

## 7. Human-only list — for Ben, shots attached

- **Real mouse hovers:** the thumbnail's hover wash + expand circle, the "?" folder-set tooltip, and each folder's "ⓘ contents" tooltip are `:hover`/mouse-enter surfaces. A synthetic hover is not a human hover — Ben glances once at each on the live page.
- **Aesthetics:** whether the grey well / white card / slot contrast reads right in both themes; whether the amber badge (if it occurred) is noticeable enough at a glance.
- **The "Folders" button's destination:** it opens the client's live SharePoint in a browser tab — the walker does not wander the client's tenant; Ben confirms the five folders (and, on the mirrored arm, the orphaned test file to remove) with his own session.
- **The leftover test file (mirrored arm):** `walk-doc-sorter-test-<8hex>.pdf` in VAL261068's "2. CLIENT SUPPLIED" — row-less, invisible to the app's normal controls, removable only by hand in SharePoint.

---

## 8. The story in one glance

The five folders are alive for the test job `[A]`, and on a job without a folder set the same tabs sit dormant with filing correctly off `[B]` — the gate's two states. The stage is proven empty of our test file in the database, the SharePoint listing, and on screen `[C]`; the file then enters through the panel's own picker and waits, unsorted, with a dropdown offering the five folders `[D]`. Choosing "2. CLIENT SUPPLIED" moves it out of the pile and into the folder card instantly — database truth, no SharePoint needed `[E]` — and opening the folder shows it inside `[F]`. Then the genuine unknown: either the mirror landed (no amber, the row stamped, the filed row-keyed name in the listing) or it did not (the amber "SharePoint failed" badge, the row unstamped — filed, never lost) `[G]`. Only with the landing positively confirmed do we delete the file's own database row, and the folder must STILL show it, flagged "in SharePoint" — the union rule holding `[H]`, legible up close `[I]`, counted once and not resurrected into the unsorted pile `[J]`. A final free look catches whatever no step predicted `[K]`.

---

## Writer's honesty note — where the code did not fully decide a step

1. **The exact on-screen name of the SharePoint-only item after the break (Step 6.3):** the union matcher and the slot `title` use the LISTING's item name, which by the filed-name rule is `walk-doc-sorter-test-<8hex>.pdf` — but the 8-hex value is only knowable at run time from the row id. The walker must compute it (`ROWID` minus dashes, first 8 characters) before deleting the row, or the name assertion cannot be made afterward.
2. **`$NOFOLDER_JOBID` (Steps 0.3 / 2.2) is discovered at run time**, not named here — the folderless set changes as jobs get folders. The discovery loop and its floor are supplied; if none exists the dormant-state shot is a declared DISCOVERY, not a quiet skip.
3. **The mirror fork means one of the two Step 5 arms is never exercised in any single run.** The un-walked arm's assertions remain untested that day — this is inherent to a live unknown, stated so nobody reads one green arm as both.
4. **The row-delete's RLS permission (Step 6.2) is unproven from source alone** — the app never deletes `job_files` rows, so no code path demonstrates the anon key may. The step therefore proves the delete both directions and floors out to DISCOVERY if refused, but I could not remove the uncertainty by reading.
5. **Reload behavior of the section's open/default state** is asserted from source (open by default) — if a future change persists collapse state, Step 6.3's "expand if collapsed" instruction absorbs it.
