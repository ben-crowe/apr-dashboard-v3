# MASTER full-site Stitch prompt — v3 (one paste; left sidebar; REAL workflow buttons)

v3 changes (Ben + ui-designer review of the v2 generation, 2026-07-17):
- LEFT SIDEBAR becomes the global nav (v2's top-bar-only read as "missing
  something"; Stitch's own invented hub screen proved the sidebar right).
- White boxed inputs BANNED as a prohibition — they crept back on every
  form page in v2.
- Job-page tab names locked (v2 renamed S2/S3 on its own).
- The REAL workflow lands on the job page: the S2 Job & Quote screen with
  the actual action chain from the live app — Send to Valcre (VAL number),
  ClickUp task, Google folder, Generate LOE → Preview & Send LOE → Send LOE
  for e-signature — labels read from the live code (actions/ValcreAction.tsx,
  ESignatureAction.tsx, ContractAction.tsx, LOEPreviewModal.tsx).
- New LOE Preview & Send page (what opens from "Preview & Send LOE").
- NO report/editor page — the real report builder already exists; out of scope.
- Framed slide-out with chevron close restated.

How Ben runs it: paste everything below the line into Stitch desktop ONCE as
a fresh full generation. Ignore/replace the earlier v1/v2 and grayscale
screens — this set supersedes them.

---

Build ONE connected multi-screen web app called "APR Dashboard" — a
professional appraisal firm's operations tool. Desktop web, dark mode. NOT
standalone pages: every sidebar item, tab, and button navigates to a real
screen. The app runs commercial appraisal jobs end to end: intake → job
record → Valcre job number → engagement letter (LOE) → client e-signature —
with clients as a first-class level. Generate this set: 1 Sign-in, 2 Job
List, 3 Job Detail (Client & Property), 4 Job & Quote (LOE prep), 5 LOE
Preview & Send, 6 Clients, 7 Client Detail, 8 Firm & Appraiser Settings,
9 Users & Access Settings, 10 Document Signing (client-facing).

**DESIGN SYSTEM — governs every page. Dark, tone-on-tone, quiet:**
- Layered charcoals CLOSE in value — page #191d24, raised surfaces #1e232b,
  panels #20262f. Separation from SPACING and hairlines (#2a323d), never
  strong fill contrast. No tinted header bars, no bright blocks.
- **INPUT PROHIBITION: never render an input, textarea, or select as a
  white or light filled box.** Every field is: label RIGHT-ALIGNED to a
  colon in slate (#8b98a9), value in off-white (#e7edf5) on a TRANSPARENT
  dark background, ONLY a 1px underline (#2a323d) beneath the value, blue
  underline on focus. This applies to EVERY form on EVERY page, including
  settings and client pages.
- Section headers flat: small semi-bold off-white title + subtle chevron,
  directly on the surface. No colored bars, no boxes-in-boxes.
- Framed panels (the house trim): slide-outs, dialogs, previews get a 1px
  rounded frame one step lighter (#39434f), 10px radius, soft shadow, and a
  visible gap of page background around the frame — a framed inset. Detail
  views SLIDE OUT from the right, full height, chevron button on the left
  edge to close.
- One interactive color: blue #3b82f6. Status dots only (slate Submitted,
  amber In Progress, purple LOE Pending, green LOE Signed/Completed) —
  small dots + quiet text, never colored fills. Red #ef4444 destructive only.
  Green #22c55e ONLY for completed checkmarks in workflow progress.
- Typography: system UI sans, dense — 19px semi-bold page titles, 14px
  section titles, 13px body, 12.25px labels, sentence case.
- Buttons: primary solid blue white-text (8px radius); secondary transparent
  hairline; text buttons low emphasis. Disabled = reduced opacity with a
  small hint line why (e.g. "Create a Valcre job first").

**GLOBAL CHROME — on every staff page (pages 2–9, NOT sign-in or signing):**
- **LEFT SIDEBAR, fixed, slightly recessed (#161b22), hairline right edge:**
  small blue square logo + "APR Dashboard" at top; then nav items with small
  icons — "Jobs", "Clients"; a thin divider; pinned at the BOTTOM: "Firm &
  Appraiser" and "Users & Access". Active item = slightly lighter row fill +
  blue left edge + off-white text; inactive dim slate.
- Slim top bar: compact global search center-left, quiet icons (calendar,
  bell, moon) right with "Appraiser" + round avatar.

**PAGE 1 — Sign-in.** No chrome. Centered framed card (~28rem): "APR
Dashboard", slate subtitle "Sign in to access your dashboard", Email +
Password underline fields, blue "Forgot password?" link, full-width blue
"Sign In", footer "Don't have an account? Contact your administrator".

**PAGE 2 — Job List (home after sign-in; sidebar "Jobs" active).** Title
"Appraisal Submissions"; "Jobs" heading row + blue "+ New Job". Toolbar:
underline search WITH typed query "riverside" + ✕; "Status: All" dropdown;
"Client: All clients" dropdown; one active chip "Client: Dana Whitfield ✕";
caption "3 of 18 jobs match". Three dense hairline-divided rows: status dot,
"VAL-2413 — Riverside Business Park" over client name in slate, date,
right-aligned status label, "..." menu. Footer "15 jobs hidden by filters —
clear to show all".

**PAGE 3 — Job Detail — Client & Property (S1).** Header: "VAL-2413 —
Riverside Business Park" + status pill "In Progress"; client name "Dana
Whitfield" as a blue link under the title; right-aligned blue "Send LOE",
secondary "Edit", "..." menu. Tab row (EXACT names, do not rename):
"Client & Property (S1)" ACTIVE · "Job & Quote (S2)" · "Client Documents
(S3)" · "Calculations". Body: flat sections "Client Information" (client
name, company, email, phone) and "Property Information" (address, city,
property type, site area) in two-column label-to-colon underline fields
with realistic data; a "Documents" strip of three small framed file cards.
Right rail: a framed "Workflow" panel — a vertical progress checklist with
states: "✓ Intake received" (green check), "✓ Valcre job created —
VAL-2413" (green check), "● LOE sent — awaiting signature" (amber dot),
"○ Signed" (dim), "○ Report" (dim).

**PAGE 4 — Job & Quote (S2) — the LOE prep screen.** Same job header + tab
row with "Job & Quote (S2)" ACTIVE. Left column, flat sections of underline
fields: "Job Setup" (Job Number VAL-2413, Assignment Type "Appraisal
Report", Report Type "Narrative — Comprehensive", Valuation Type "Market
Value — Current", Property Rights "Fee Simple", Intended Use); "Fees &
Payment" (Fee $5,000, Retainer $500, Payment Terms "On LOE Signature");
"Comments" (a taller underline textarea). Right rail, a framed "Actions"
panel — the real action chain as stacked rows, each: an icon, a label, a
status line, and a button:
- "Valcre" — status "Job created · VAL-2413" with green check; secondary
  button "Send to Valcre" shown in its done state.
- "ClickUp" — status "Task created in Valta workspace"; green check.
- "Client folder" — status "Google folder linked"; small "Open" link.
- "Engagement Letter (LOE)" — buttons "Generate LOE" (secondary) and
  "Preview & Send LOE" (primary blue); status line "Not yet sent".
- "E-Signature" — disabled button "Send LOE for e-signature" with the hint
  "Generate the LOE first" (dim slate hint under the button).
A thin workflow progress bar across the top of the rail shows step 3 of 5.

**PAGE 5 — LOE Preview & Send (opens from "Preview & Send LOE").** The job
header shrinks to one breadcrumb line "← VAL-2413 · Job & Quote". Two
columns: LEFT, a framed document preview pane — a white letter page
("Valta Property Valuations — Letter of Engagement", addressee, scope of
work, fee) rendered small inside the dark framed panel with a subtle page
edge; RIGHT, an email compose panel with underline fields (To
d.whitfield@rivercreek.com, Subject "Engagement Letter — Riverside Business
Park", a short editable message body) and beneath it: primary blue "Send
LOE for e-signature", secondary "Back to job", and a dim slate note "Client
signs on a public page — no login needed." One quiet template row above the
compose: "Template: Standard LOE ▾".

**PAGE 6 — Clients (sidebar "Clients" active).** Title "Clients" + subtitle
"Every client and their appraisal history"; blue "+ New Client"; underline
search. Flat table (CLIENT, COMPANY, EMAIL, PHONE, JOBS, LAST ACTIVITY),
six realistic rows, JOBS as counts, names as off-white links. One selected
row (slightly darker + blue dot) with the SLIDE-OUT open on the right:
full-height FRAMED panel (light trim edge, visible gap, soft shadow) with
a chevron close button centered on its left edge — inside: avatar + name +
company, contact fields (label-to-colon underline), "Active jobs" list
(number, property, status dot, quote value), blue "View full client page"
link, internal-notes paragraph.

**PAGE 7 — Client Detail.** Header: avatar, client name, company, quiet
"Active" dot, secondary "Edit client" right. Small stat row: "Jobs 5 ·
Active 2 · Last activity 3 days ago". Tabs: "Profile" ACTIVE · "Jobs (5)" ·
"Files". Profile: flat sections "Company" (name, type, phone, website,
address), "Contact" (name, title, phone, mobile, email), "Relationship"
(notes textarea + "Relationship owner: Ben Crowe") — ALL underline fields,
no boxes.

**PAGE 8 — Firm & Appraiser Settings (sidebar bottom item).** Title +
subtitle "Your identity — set once, reused on every job"; blue "Save
settings". Quiet framed info line: these details fill once and flow to
every job and report. Flat sections: "Company" (name, address, city,
province, postal, phone, email, website), "Appraiser" (name, title, role,
email), "Credentials & Licenses" (credentials, designation, license number
+ expiry, membership numbers), "Signature & Bio" (signature line, two bio
paragraphs), "Logo & Headshot" (two framed upload tiles: square logo,
round headshot, small bordered Upload buttons). Underline fields ONLY.

**PAGE 9 — Users & Access Settings (sidebar bottom item).** Title +
subtitle "Who can sign in, and what they can do"; blue "Invite user".
Framed info line: "The dashboard is moving behind a sign-in — everyone
here gets their own login." Flat "Team members" table: avatar initials,
name, email, quiet role pill (Admin / Appraiser / Viewer), status dot +
Active/Invited, last sign-in, "..." menu; one Invited row with blue
"Resend invite". Flat "Your account": Profile (name, email), Password
(current/new/confirm + secondary "Update password"), Sessions ("Signed in
on 2 devices" + quiet red "Sign out everywhere").

**PAGE 10 — Document Signing (client-facing, public; NO chrome).** Firm
name "Valta Property Valuations" + "Letter of Engagement" + property
address in slate. The letter as a WHITE paper panel with the framed trim on
the dark page — scope of work, appraisal standards, professional fee,
confidentiality, signature area — full-width blue "Sign document", and a
small post-sign success note ("Thank you, Dana — your signed copy is on
its way").

**NAVIGATION MAP — wire ALL; every target exists; NO dead links:**
- Sign-in "Sign In" → Job List.
- Sidebar (all staff pages): Jobs → Job List; Clients → Clients; Firm &
  Appraiser → page 8; Users & Access → page 9; logo → Job List.
- Job List: rows → Job Detail (S1); "+ New Job" → Job Detail; client-chip
  name → Client Detail.
- Job Detail (S1): tab "Job & Quote (S2)" → page 4; client-name link →
  Client Detail; "Send LOE" → LOE Preview & Send; workflow-panel "LOE
  sent" row → LOE Preview & Send.
- Job & Quote (S2): tab "Client & Property (S1)" → page 3; "Preview & Send
  LOE" → LOE Preview & Send.
- LOE Preview & Send: "Send LOE for e-signature" → Document Signing;
  breadcrumb "← VAL-2413 · Job & Quote" → page 4.
- Clients: rows → slide-out (same page); "View full client page" → Client
  Detail; slide-out job rows → Job Detail; chevron closes the slide-out.
- Client Detail: "Jobs (5)" tab rows → Job Detail.
- Document Signing "Sign document" → its post-sign success state.

**OUTPUT:** all ten pages as ONE connected prototype, navigation wired, so
Play mode clicks the full real workflow — sign in → jobs → a job → its
quote & LOE prep → preview & send → the client's signing page → back — and
the client loop — clients → a client → their jobs — with no dead ends.
