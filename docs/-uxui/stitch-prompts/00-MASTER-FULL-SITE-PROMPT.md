# MASTER full-site Stitch prompt — ONE paste generates ALL pages

How Ben runs it: paste everything below the line into Stitch desktop ONCE.
Stitch builds the whole page set from this single prompt. To change one page,
swap that page's section and regenerate — never re-paste the whole thing with
edits bundled.

Sources: sign-in from /login (src/pages/Login.tsx) · job list from /dashboard
(JobListItem.tsx, job-list/JobSearch.tsx — dense layout, Version A of the
three-versions file) · job detail from /dashboard job view (JobDetailView.tsx
+ the approved dark Firm & Appraiser mock, measured off this page) · Firm &
Appraiser from the approved mock (apr-settings-firm-appraiser.html) · users &
access = new page, shaped from the sibling mock + the Linear library file
(shape only) · document signing from /sign/:id (SigningPage.tsx, DocuSeal) ·
client management = new page, shaped from the Linear library file + the intake
form's client fields. Per-page detail was trimmed to keep this inside one
Stitch paste; the full per-page prompts remain in this folder.

---

Design "APR Dashboard" — a professional appraisal firm's operations web app.
Desktop web, dark mode throughout. It manages commercial appraisal jobs from
client intake through engagement-letter signing: staff sign in, work a job
list, open job details, manage firm settings and users; clients get one
public page to sign their engagement letter (LOE). Generate this full set of
pages: 1 Sign-in, 2 Job List, 3 Job Detail, 4 Firm & Appraiser Settings,
5 Users & Access Settings, 6 Document Signing (client-facing), 7 Clients.

**DESIGN SYSTEM — governs every page:**
Dense, quiet, utilitarian dark operations dashboard. Layered charcoal
surfaces, hairline borders, soft off-white text, one clear blue accent,
underline-only field wells, quiet selected states. No gradients, no imagery,
no decoration.
- Page background deep charcoal #191d24 · cards/panels #1e2530 with 1px
  hairline border #2b3542 · group header bars raised charcoal #222b38 ·
  recessed tab/app bars #161b22 · input wells #171c24 with a bottom underline
  only (1px #2b3542), square corners
- Text: headings/primary soft off-white #e7edf5 · labels/secondary slate
  #8b98a9 · placeholders/dim #6b7789
- Interactive: one clear blue #3b82f6 for primary buttons, links, active-tab
  underlines, focus; info banners dim blue #2a3a54 with #33517d border;
  destructive/error red #ef4444 only
- Status dot colors (tiny dots/quiet pills only, never colored fills): slate
  Submitted · amber In Progress · purple LOE Pending · green LOE Signed /
  Completed
- Typography: system UI sans-serif, dense — 19px semi-bold page titles, 14px
  medium group-bar titles, 10.5px uppercase letter-spaced sub-headings, 13px
  body, 12.25px field labels
- Shape: group boxes 7px radius with tinted collapsible header bars; buttons
  and banners 8px; cards subtly rounded; hairline dividers everywhere
- House patterns: forms use one line per field with the label RIGHT-ALIGNED
  to a colon (fixed label column so colons align) and the value in a filled
  well with underline only. Selected tabs are off-white text + 2px blue
  bottom underline — never bright. Staff pages share a slim top app bar in
  the recessed well: blue square logo mark + "APR Dashboard" left, compact
  global search center, quiet icons (calendar, bell, moon, gear), the word
  "Appraiser" and a small round avatar right.

**PAGE 1 — Sign-in.** No app bar. Deep charcoal full-viewport page, one
centered card (~28rem): "APR Dashboard" heading + slate subtitle "Sign in to
access your dashboard"; Email and Password fields (labels above, underline
wells, placeholder "you@company.com"); small right-aligned blue "Forgot
password?" link; full-width blue "Sign In" button; centered footer line
"Don't have an account? Contact your administrator" with the link in blue.
No self-serve signup.

**PAGE 2 — Job List (the home view after sign-in).** App bar on top. A
content card titled "Appraisal Submissions", then a "Jobs" heading row with a
blue "+ New Job" button right. Toolbar: an underline search field WITH the
typed query "riverside" and a ✕ clear control, an "All Jobs" dropdown, and a
slate caption "3 of 18 jobs match 'riverside'". Below, three dense
single-line rows (the filtered results) with hairline dividers — tiny status
dot, job number + property in off-white ("VAL-2413 — Riverside Business
Park") over the client name in small slate ("Dana Whitfield"), relative date
("3 days ago"), right-aligned status label ("In Progress" amber, "LOE
Pending" purple, "LOE Signed" green), and a quiet "..." row menu. Footer
line: "15 jobs hidden by search — clear to show all".

**PAGE 3 — Job Detail.** App bar, then a job header row: job number + property
name as the title, a quiet status pill, and right-aligned actions (blue
"Send LOE" button, secondary bordered "Edit", "..." menu). Under it a sticky
recessed tab bar: "Client & Property (S1)" ACTIVE (blue underline), "Job &
Quote (S2)", "Client Documents (S3)", "Calculations", "Firm & Appraiser".
Body: two collapsible bordered group boxes with tinted header bars —
"Client Information" and "Property Information" — each holding two-column
label-to-colon field rows in underline wells (client name, company, email,
phone; property address, city, province, property type, site area). Values
filled with realistic appraisal data.

**PAGE 4 — Firm & Appraiser Settings.** App bar + the same job-page tab bar
with a gear-icon "Firm & Appraiser" tab ACTIVE. Header: "Firm & Appraiser"
title, slate subtitle "Your identity — set once, reused on every job", blue
"Save settings" button right. A dim blue info banner: these details fill once
and flow to every job. ONE bordered group box "Firm & Appraiser Identity"
containing flat uppercase-headed sub-sections: COMPANY (name, address, city,
province, postal, phone, email, website), APPRAISER (name, title, role,
email), CREDENTIALS & LICENSES (credentials, designation, license number +
expiry, membership numbers), SIGNATURE & BIO (signature line, two bio
paragraphs as taller wells), LOGO & HEADSHOT (two dashed-border upload tiles:
square logo thumb, round headshot thumb, each with an Upload button).

**PAGE 5 — Users & Access Settings.** Same app bar + tab bar, "Users &
Access" gear tab ACTIVE. Header: title, slate subtitle "Who can sign in, and
what they can do", blue "Invite user" button. Dim blue banner: "The dashboard
is moving behind a sign-in — everyone listed here gets their own login."
Group box "Team members": a table-style list, hairline-divided rows — avatar
initials, Name, Email, a quiet role pill (Admin / Appraiser / Viewer),
status dot + "Active" or "Invited", last sign-in, "..." menu; one Invited row
shows a blue "Resend invite" link. Second group box "Your account" with
uppercase sub-sections: PROFILE (name, email), PASSWORD (current, new,
confirm + a bordered secondary "Update password" button), SESSIONS ("Signed
in on 2 devices" + a quiet red "Sign out everywhere" text action).

**PAGE 6 — Document Signing (client-facing, public).** NO app bar, no
navigation — a clean page a client reaches from an email link. Centered
column: a small header with the firm name "Valta Property Valuations" and
"Letter of Engagement" title with the property address in slate under it.
The document itself as a tall white-paper panel (this one page shows a light
document on the dark page) with placeholder contract text and a signature
field area. Below, a full-width blue "Sign document" button. Include a
subtle post-sign confirmation state hint: a small centered success panel
("Thank you, Dana — your signed copy is on its way to your email").

**PAGE 7 — Clients.** App bar; sidebar-less like the rest. Content card
titled "Clients" with a blue "+ New Client" button and an underline search
field. A table with dim uppercase headers (CLIENT, COMPANY, EMAIL, PHONE,
JOBS, LAST ACTIVITY) and six hairline-divided rows of realistic client rows;
the row's client name is an off-white medium link. Clicking-state hint: one
row shown selected (slightly darker fill + small blue dot) with a right-side
slide-over panel visible, holding that client's label-to-colon detail fields
(name, company, email, phone, address) and a small "Jobs" list of two linked
job numbers with status dots.
