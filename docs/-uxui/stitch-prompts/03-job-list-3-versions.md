# Stitch prompts — Job LIST page, THREE layout versions (DARK)

Source: the real page at http://localhost:8086/dashboard — job rows carry a
status dot (Submitted / In Progress / LOE Pending / LOE Signed / Completed),
job number, client name, relative date, status label, and a hover actions menu
(View / Edit / Archive). Search filters by property name, address, or client
name; a status dropdown filters the set. Read from JobListItem.tsx +
job-list/JobSearch.tsx in ~/Development/apr-clean-working.

Paste each version as its OWN Stitch generation (three screens). Every block
carries the design system inline. All three must show the search WORKING:
the query "riverside" typed into the search field with visibly filtered
results and a result count — never an empty search box.

═══════════════════════════════════════════════════════════════════
VERSION A — dense single-line list (the current shape, refined)
═══════════════════════════════════════════════════════════════════

Design a web dashboard page for "APR Dashboard" — a professional appraisal-firm
operations tool. Desktop web, dark mode. This is the JOB LIST home view.

**Page structure:**

1. Deep charcoal page (#191d24). Slim top app bar in a recessed darker well
   (#161b22) with a bottom hairline: left, a small blue square logo mark and
   "APR Dashboard" in off-white; center, a compact global search field; right,
   small quiet icons (calendar, bell, moon, gear), the word "Appraiser" in
   slate, and a small round avatar.
2. Content in a centered white-less charcoal card (#1e2530, hairline border,
   subtly rounded, roomy padding), max ~1080px wide:
   - Page title "Appraisal Submissions" (semi-bold, off-white), and below it
     a row: section heading "Jobs" left; right, a solid blue "+ New Job"
     button.
   - Toolbar row: a wide underline-style search input with the typed query
     "riverside" and a small ✕ clear control; right of it a quiet dropdown
     reading "All Jobs". Under the toolbar a small slate caption: "3 of 18
     jobs match 'riverside'".
3. The list: three single-line rows (the filtered results), hairline
   dividers, each row left-to-right:
   - a tiny status square (amber for In Progress, purple for LOE Pending,
     green for LOE Signed),
   - a two-line main cell: job number + property name in off-white medium
     ("VAL-2413 — Riverside Business Park") with the client name in small
     slate underneath ("Dana Whitfield"),
   - a relative date in dim slate ("3 days ago"),
   - a right-aligned small status label ("In Progress"),
   - a quiet "..." menu icon at row end.
   Rows: VAL-2413 Riverside Business Park / Dana Whitfield / 3 days ago /
   In Progress · VAL-2398 Riverside Plaza Self-Storage / Marcus Lee /
   1 week ago / LOE Pending · VAL-2371 220 Riverside Dr Multi-Family /
   Priya Shah / 2 weeks ago / LOE Signed.
4. Below the results, a faint divider and a dim slate footer line:
   "15 jobs hidden by search — clear to show all".

**DESIGN SYSTEM (REQUIRED):**
Dense, quiet, utilitarian dark operations dashboard. Layered charcoal
surfaces, hairline borders, soft off-white text, one clear blue accent,
quiet selected states.
- Page #191d24 · Card #1e2530 (border #2b3542) · Recessed bars #161b22
- Text #e7edf5 · Secondary #8b98a9 · Dim #6b7789
- Action blue #3b82f6 · Status colors: slate (Submitted), amber (In Progress),
  purple (LOE Pending), green (LOE Signed / Completed) — tiny dots only,
  never colored row fills
- Error/destructive red #ef4444 only
- System UI sans-serif, dense: 19px semi-bold titles, 13px body, 12px captions
- Buttons 8px radius; cards subtly rounded; hairline dividers between rows

═══════════════════════════════════════════════════════════════════
VERSION B — card grid with pipeline summary strip
═══════════════════════════════════════════════════════════════════

Design a web dashboard page for "APR Dashboard" — a professional appraisal-firm
operations tool. Desktop web, dark mode. This is the JOB LIST home view as a
CARD GRID.

**Page structure:**

1. Same slim dark top app bar as the rest of the app: recessed well (#161b22),
   bottom hairline, blue logo mark + "APR Dashboard", center search, quiet
   icons + avatar right.
2. Page header on the charcoal page (no outer card): "Appraisal Submissions"
   semi-bold off-white left; solid blue "+ New Job" button right.
3. A pipeline summary strip: five small stat chips in a row, each a tiny
   charcoal card (#1e2530, hairline border) with a status dot, the status
   name in slate, and a count in off-white — Submitted 4, In Progress 6,
   LOE Pending 3, LOE Signed 3, Completed 2. The strip reads as a quiet
   overview, not big dashboard tiles.
4. Toolbar row: underline search field with the typed query "riverside" and
   a ✕ clear control, a "All Jobs" dropdown, and a slate caption "3 of 18
   match".
5. The grid: three job cards (the filtered results), three across, each card
   #1e2530 with hairline border, subtly rounded, compact padding:
   - top row: job number in off-white medium ("VAL-2413") + a small quiet
     status pill right (amber dot + "In Progress"),
   - property name as the card's main line ("Riverside Business Park"),
   - two small slate lines: client ("Dana Whitfield") and city/type
     ("Calgary · Office/Industrial"),
   - a hairline divider, then a footer row: relative date in dim slate
     ("3 days ago") left, and two tiny quiet icon buttons (eye, pencil) right.
   Cards: VAL-2413 Riverside Business Park (In Progress, amber) · VAL-2398
   Riverside Plaza Self-Storage (LOE Pending, purple) · VAL-2371 220
   Riverside Dr Multi-Family (LOE Signed, green).
6. Empty grid slots are NOT drawn — the three cards simply sit in the first
   row with the page background showing beneath.

**DESIGN SYSTEM (REQUIRED):**
(identical block to Version A — dense, quiet, utilitarian dark operations
dashboard)
- Page #191d24 · Card #1e2530 (border #2b3542) · Recessed bars #161b22
- Text #e7edf5 · Secondary #8b98a9 · Dim #6b7789
- Action blue #3b82f6 · Status dots: slate / amber / purple / green — dots and
  quiet pills only, never colored card fills
- Error red #ef4444 only
- System UI sans-serif, dense: 19px semi-bold titles, 13px body, 12px captions
- Buttons 8px radius; cards subtly rounded; hairline borders, whisper shadows

═══════════════════════════════════════════════════════════════════
VERSION C — status-grouped table (work-queue view)
═══════════════════════════════════════════════════════════════════

Design a web dashboard page for "APR Dashboard" — a professional appraisal-firm
operations tool. Desktop web, dark mode. This is the JOB LIST as a
STATUS-GROUPED TABLE — a work queue.

**Page structure:**

1. Same slim dark top app bar as the rest of the app (recessed well, hairline,
   logo + name, center search, quiet icons + avatar).
2. Page header: "Appraisal Submissions" semi-bold off-white left; blue
   "+ New Job" button right. Toolbar underneath: underline search with the
   typed query "riverside" + ✕, an "All Jobs" dropdown, caption "3 of 18
   match 'riverside'".
3. One bordered group box per status THAT HAS MATCHES (the two-level
   encapsulation the app uses everywhere): outer 1px border, 7px radius,
   tinted collapsible header bar (#222b38) with a chevron, the status dot,
   the status name (14px medium), and a small slate count — "In Progress · 1",
   "LOE Pending · 1", "LOE Signed · 1".
4. Inside each box, a compact table with a dim slate header row (JOB,
   PROPERTY, CLIENT, SUBMITTED, actions) in small uppercase letter-spaced
   type, and one hairline-divided row per job:
   - In Progress box: VAL-2413 · Riverside Business Park · Dana Whitfield ·
     3 days ago · "..." menu
   - LOE Pending box: VAL-2398 · Riverside Plaza Self-Storage · Marcus Lee ·
     1 week ago · "..." menu, plus a small blue text link "Send LOE reminder"
   - LOE Signed box: VAL-2371 · 220 Riverside Dr Multi-Family · Priya Shah ·
     2 weeks ago · "..." menu
5. At the bottom, two collapsed group boxes rendered header-bar-only with dim
   counts: "Submitted · 0 matches" and "Completed · 0 matches", their chevrons
   pointing right — showing the grouping persists under search.

**DESIGN SYSTEM (REQUIRED):**
(identical block — dense, quiet, utilitarian dark operations dashboard)
- Page #191d24 · Card #1e2530 (border #2b3542) · Group header bars #222b38 ·
  Recessed bars #161b22
- Text #e7edf5 · Secondary #8b98a9 · Dim #6b7789
- Action blue #3b82f6 · Status dots: slate / amber / purple / green
- Error red #ef4444 only
- System UI sans-serif, dense: 19px semi-bold titles, 14px medium group bars,
  10.5px uppercase letter-spaced table headers, 13px body
- Group boxes 7px radius with tinted header bars; buttons 8px; hairline
  dividers; nothing bright, dots not fills
