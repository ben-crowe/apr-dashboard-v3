# MASTER full-site Stitch prompt — v2 (one paste, all pages, dark tone-on-tone)

v2 changes (Ben's review of the first generation, 2026-07-17):
- STAY DARK (the first generation's scheme won) — but tone-on-tone: kill the
  contrasting blocked sections and tinted header bars.
- Underline-only fields everywhere (the V3 house pattern).
- Slide-out panels with a chevron close + the framed-edging trim.
- New pages from the Valcre study: a full Client detail page (three tabs:
  profile / jobs / files), client + status filters on the job list, and the
  admin Users & Access page kept.
- Full page map + navigation carried again — Stitch prefers regenerating the
  whole site over editing one page, so we lean into full regenerates.

How Ben runs it: paste everything below the line into Stitch desktop ONCE.
To change anything later, swap that page's section and regenerate the set.

Sources: live app routes in ~/Development/apr-clean-working (sign-in
src/pages/Login.tsx · job list JobListItem.tsx · job detail JobDetailView.tsx
· signing SigningPage.tsx) · approved dark settings mock
(~/Development/KM-Exp/data/screenshots/apr-settings-firm-appraiser.html) ·
Valcre client/job structure map (docs/-uxui/valcre-client-job-ia-map.md).

---

Build ONE connected multi-screen web app called "APR Dashboard" — a
professional appraisal firm's operations tool. Desktop web, dark mode. This
is NOT a set of standalone pages: every nav item, tab, and primary button
navigates to a real screen in this project. The app manages commercial
appraisal jobs from client intake through engagement-letter signing, with
clients as a first-class level: staff sign in, work a job list, open job
records, manage client records, firm settings, and users; clients get one
public page to sign their engagement letter (LOE). Generate this full set:
1 Sign-in, 2 Job List, 3 Job Detail, 4 Clients, 5 Client Detail,
6 Firm & Appraiser Settings, 7 Users & Access Settings, 8 Document Signing
(client-facing).

**DESIGN SYSTEM — governs every page. Dark, tone-on-tone, quiet:**
- Layered charcoals CLOSE in value — page #191d24, raised surfaces #1e232b,
  panels #20262f. Separation comes from SPACING and hairline borders
  (#2a323d), never from strong fill contrast. NO tinted header bars, NO
  bright blocks, NO filled input wells.
- Section headers are flat: a small semi-bold off-white title with a subtle
  chevron, sitting directly on the surface — not a colored bar.
- Fields: one line per field, label RIGHT-ALIGNED to a colon in slate gray
  (#8b98a9), value in off-white (#e7edf5) on a TRANSPARENT background with
  only a 1px underline (#2a323d) beneath the value; underline turns blue on
  focus. No boxes around inputs anywhere. Placeholders dim slate (#6b7789).
- Framed panels (the house trim): floating panels — slide-outs, dialogs,
  preview cards — get a 1px rounded frame one step lighter than their
  surroundings (#39434f), 10px radius, a soft outer shadow, and a small gap
  of page background around the frame so the panel reads as a framed inset.
- Slide-outs, not pop-ups: detail views slide in from the right as a full-
  height framed panel with a chevron button on its left edge to close.
- One interactive color: clear blue #3b82f6 (buttons, links, active-tab
  underline, focus). Status dots only — slate Submitted, amber In Progress,
  purple LOE Pending, green LOE Signed/Completed — never colored fills.
  Red #ef4444 for destructive/error text only.
- Typography: system UI sans-serif, dense — 19px semi-bold page titles,
  14px section titles, 13px body, 12.25px labels. Sentence case, no
  uppercase letter-spacing.
- Buttons: primary solid blue with white text (8px radius); secondary
  transparent with hairline border; text buttons for low emphasis.
- GLOBAL CHROME on every staff page (pages 2–7, NOT sign-in or signing): a
  slim top app bar on a slightly recessed surface (#161b22) with a bottom
  hairline — blue square logo mark + "APR Dashboard" left; nav links
  "Jobs · Clients" center-left; compact global search center; quiet icons
  (calendar, bell, moon, gear) + "Appraiser" + round avatar right.

**PAGE 1 — Sign-in.** No app bar. Centered framed card (~28rem) on the dark
page: "APR Dashboard" heading, slate subtitle "Sign in to access your
dashboard"; Email and Password with underline-only fields; small blue
"Forgot password?" link; full-width blue "Sign In"; footer "Don't have an
account? Contact your administrator" with the link in blue.

**PAGE 2 — Job List (home after sign-in).** Title "Appraisal Submissions",
"Jobs" heading row with blue "+ New Job" right. Toolbar: underline search
field WITH the typed query "riverside" and a ✕ clear; a "Status: All"
dropdown; a "Client: All clients" dropdown — and one active filter chip
showing "Client: Dana Whitfield ✕" so filtering by client is visibly on;
slate caption "3 of 18 jobs match". Below, three dense single-line rows,
hairline-divided: tiny status dot, job number + property in off-white
("VAL-2413 — Riverside Business Park") over client name in small slate,
relative date, right-aligned status label (In Progress amber, LOE Pending
purple, LOE Signed green), quiet "..." menu. Footer: "15 jobs hidden by
filters — clear to show all".

**PAGE 3 — Job Detail.** Header: job number + property as title, status
pill, right-aligned blue "Send LOE", secondary "Edit", "..." menu. The
client's name under the title is a blue LINK to that client's page. Sticky
tab row: "Client & Property (S1)" ACTIVE (blue underline), "Job & Quote
(S2)", "Client Documents (S3)", "Calculations". Body: two flat sections —
"Client Information" and "Property Information" — label-to-colon underline
fields in two columns (client name/company/email/phone; address, city,
property type, site area), realistic data. Below: a "Documents" strip of
three small framed file cards (survey PDF, zoning bylaw, title search).

**PAGE 4 — Clients.** Title "Clients" + slate subtitle "Every client and
their appraisal history", blue "+ New Client" right; underline search field.
A flat table, hairline-divided rows, dim headers (CLIENT, COMPANY, EMAIL,
PHONE, JOBS, LAST ACTIVITY): six realistic rows; the JOBS column shows a
count ("3 jobs"); client names are off-white links. One row is selected
(slightly darker fill + small blue dot) with a SLIDE-OUT panel open on the
right: full-height, framed with the light trim edge, a chevron close button
on its left edge — inside, the client's avatar + name + company, contact
fields (label-to-colon, underline), a compact list of their active jobs
(job number, property, status dot, quote value), a "View full client page"
blue link, and an internal-notes paragraph.

**PAGE 5 — Client Detail (the full client page).** Reached from the
slide-out's "View full client page" link and from the job page's client
link. Header: avatar + client name, company, a quiet "Active" dot, and a
right-aligned secondary "Edit client" button. Three tabs: "Profile" ACTIVE ·
"Jobs" · "Files". Profile tab body: two flat sections — "Company" (name,
type, phone, website, address in label-to-colon underline fields) and
"Contact" (name, title, phone, mobile, email) — plus "Relationship" (a
notes textarea with underline treatment and a "Relationship owner: Ben
Crowe" line). Under the tabs a small stat row of three quiet inline stats:
"Jobs 5 · Active 2 · Last activity 3 days ago". The Jobs tab is indicated
by a small count badge ("5").

**PAGE 6 — Firm & Appraiser Settings.** Reached from the app-bar gear.
Header: "Firm & Appraiser" title, slate subtitle "Your identity — set once,
reused on every job", blue "Save settings" right; a quiet framed info line:
these details fill once and flow to every job and report. Flat sections
(NO group boxes): "Company" (name, address, city, province, postal, phone,
email, website), "Appraiser" (name, title, role, email), "Credentials &
Licenses" (credentials, designation, license number + expiry, membership
numbers), "Signature & Bio" (signature line + two taller bio paragraphs,
underline treatment), "Logo & Headshot" (two framed upload tiles: square
logo thumb, round headshot thumb, each with a small bordered Upload
button). All fields label-to-colon underline style.

**PAGE 7 — Users & Access Settings.** Reached from the app-bar avatar.
Header: title, subtitle "Who can sign in, and what they can do", blue
"Invite user" right; a quiet framed info line: "The dashboard is moving
behind a sign-in — everyone here gets their own login." Flat section "Team
members": table rows — avatar initials, name, email, quiet role pill
(Admin / Appraiser / Viewer), status dot + Active/Invited, last sign-in,
"..." menu; one Invited row with a blue "Resend invite" link. Flat section
"Your account": Profile (name, email), Password (current/new/confirm +
secondary "Update password"), Sessions ("Signed in on 2 devices" + quiet
red "Sign out everywhere" text action).

**PAGE 8 — Document Signing (client-facing, public).** NO app bar. Firm
name "Valta Property Valuations" + "Letter of Engagement" header with the
property address in slate. The letter as a WHITE paper panel with the
framed trim edge on the dark page — scope of work, appraisal standards,
professional fee, confidentiality, a signature area — then a full-width
blue "Sign document" button and a small post-sign success note ("Thank
you, Dana — your signed copy is on its way").

**NAVIGATION MAP — wire ALL of these; every target is a screen in this
project; NO dead links:**
- Sign-in "Sign In" → Job List.
- App bar (all staff pages): logo/"APR Dashboard" → Job List; "Jobs" →
  Job List; "Clients" → Clients; gear → Firm & Appraiser; avatar →
  Users & Access.
- Job List: each row → Job Detail; the client-filter chip's client name →
  Client Detail; "+ New Job" → Job Detail.
- Job Detail: client-name link under the title → Client Detail; "Send LOE"
  → Document Signing; tabs S1/S2/S3/Calculations → stay on Job Detail.
- Clients: each row → opens the slide-out (same page); slide-out "View
  full client page" → Client Detail; slide-out job rows → Job Detail;
  chevron on the slide-out edge → closes it.
- Client Detail: Jobs tab rows → Job Detail; "Edit client" → stays.
- Document Signing "Sign document" → its post-sign success state.

**OUTPUT:** generate all eight pages as ONE connected prototype with the
navigation wired, so Play mode clicks the full loop — sign in → jobs → a
job → its client → the client's jobs → settings → back — with no dead ends.
