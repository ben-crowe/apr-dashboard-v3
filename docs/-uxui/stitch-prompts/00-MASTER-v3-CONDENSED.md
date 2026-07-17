# MASTER v3 — CONDENSED (same spec as 00-MASTER-v3.md, ~40% the words)

Same ten pages, same rules, telegraphic phrasing so Stitch reads ALL of it
before any internal cutoff. Rules it violated in past runs are stated FIRST.
Paste everything below the line as one fresh generation.

---

Build ONE connected 10-page desktop web app, dark mode: "APR Dashboard" —
appraisal-firm operations (intake → job → Valcre number → engagement letter
(LOE) → client e-signature). Clients are first-class. Not standalone pages:
every nav item/button targets a real screen.

TOP RULES (previously violated — obey exactly):
1. NEVER render inputs as white/light filled boxes. All fields: gray label
   right-aligned to a colon, off-white value, transparent background, 1px
   underline #2a323d only, blue on focus. Applies to EVERY form/page.
2. Job tabs EXACTLY: "Client & Property (S1) | Job & Quote (S2) | Client
   Documents (S3) | Calculations". Do not rename.
3. Tone-on-tone: page #191d24, surfaces #1e232b, panels #20262f, hairlines
   #2a323d. No tinted header bars, no bright blocks, no boxes-in-boxes.
4. Floating panels (slide-outs/dialogs/previews): 1px lighter frame
   #39434f, 10px radius, soft shadow, gap of page background around frame.
   Slide-outs enter from right, full height, chevron on left edge closes.

STYLE: text #e7edf5 / #8b98a9 / #6b7789. One accent blue #3b82f6 (buttons,
links, active states). Status = tiny dots: slate Submitted, amber In
Progress, purple LOE Pending, green Signed/Completed. Red #ef4444
destructive only. System sans, dense: 19px titles, 14px sections, 13px
body. Buttons: solid blue primary 8px radius; hairline secondary; disabled
= dim + hint line why.

CHROME (pages 2–9, not sign-in/signing): fixed LEFT SIDEBAR #161b22,
hairline edge: blue logo + "APR Dashboard"; items Jobs, Clients; pinned
bottom: Firm & Appraiser, Users & Access. Active item = lighter row + blue
left edge. Slim top bar: global search, calendar/bell/moon icons,
"Appraiser" + avatar.

PAGES:
1 SIGN-IN — no chrome. Centered framed card: title, "Sign in to access
your dashboard", Email + Password underline fields, blue "Forgot
password?", full-width blue "Sign In", footer "Don't have an account?
Contact your administrator".
2 JOB LIST (home; sidebar Jobs active) — "Appraisal Submissions"; "Jobs" +
blue "+ New Job". Toolbar: search containing typed "riverside" + ✕,
"Status: All" and "Client: All clients" dropdowns, active chip "Client:
Dana Whitfield ✕", caption "3 of 18 jobs match". 3 dense rows: dot,
"VAL-2413 — Riverside Business Park" over client in slate, date, status
label right, "..." menu. Footer "15 jobs hidden by filters — clear to show
all".
3 JOB DETAIL (S1) — header "VAL-2413 — Riverside Business Park", status
pill, client "Dana Whitfield" as blue link, buttons "Send LOE" (blue),
"Edit", "...". Tab row per rule 2, S1 active. Sections "Client
Information" + "Property Information": 2-column label-colon underline
fields, realistic data. "Documents" strip: 3 small framed file cards.
Right rail framed "Workflow" checklist: ✓ Intake received, ✓ Valcre job
created — VAL-2413, ● LOE sent — awaiting signature (amber), ○ Signed,
○ Report.
4 JOB & QUOTE (S2) — same header, S2 tab active. Left sections: "Job
Setup" (Job Number VAL-2413, Assignment Type "Appraisal Report", Report
Type "Narrative — Comprehensive", Valuation "Market Value — Current",
Property Rights "Fee Simple", Intended Use), "Fees & Payment" (Fee $5,000,
Retainer $500, Terms "On LOE Signature"), "Comments" textarea. Right rail
framed "Actions" chain, each row icon+label+status+button: Valcre "Job
created · VAL-2413" ✓; ClickUp "Task created" ✓; Client folder "Google
folder linked" + Open; Engagement Letter: "Generate LOE" (secondary) +
"Preview & Send LOE" (blue), status "Not yet sent"; E-Signature: DISABLED
"Send LOE for e-signature" + hint "Generate the LOE first". Thin progress
bar "step 3 of 5" atop rail.
5 LOE PREVIEW & SEND — breadcrumb "← VAL-2413 · Job & Quote". Left: framed
preview pane, small WHITE letter page (firm name, addressee, scope, fee).
Right: compose panel — underline fields To/Subject/message, row "Template:
Standard LOE ▾", blue "Send LOE for e-signature", secondary "Back to job",
note "Client signs on a public page — no login needed."
6 CLIENTS (sidebar Clients active) — title + "Every client and their
appraisal history", blue "+ New Client", search. Table CLIENT | COMPANY |
EMAIL | PHONE | JOBS (counts) | LAST ACTIVITY, 6 rows, names as links. One
selected row + right SLIDE-OUT (framed, chevron close): avatar+name+
company, contact underline fields, "Active jobs" list (number, property,
dot, value), blue "View full client page", notes paragraph.
7 CLIENT DETAIL — header avatar+name+company+Active dot, "Edit client".
Stats "Jobs 5 · Active 2 · Last activity 3 days ago". Tabs Profile |
Jobs (5) | Files. Profile: sections Company (name,type,phone,website,
address), Contact (name,title,phone,mobile,email), Relationship (notes +
"Relationship owner: Ben Crowe"). Underline fields only.
8 FIRM & APPRAISER — title + "Your identity — set once, reused on every
job", blue "Save settings", framed info line (fills once, flows to every
job/report). Sections: Company (name,address,city,province,postal,phone,
email,website), Appraiser (name,title,role,email), Credentials & Licenses
(credentials,designation,license no+expiry,memberships), Signature & Bio
(signature line + 2 bio paragraphs), Logo & Headshot (2 framed upload
tiles: square logo, round headshot, Upload buttons).
9 USERS & ACCESS — title + "Who can sign in, and what they can do", blue
"Invite user", framed line "The dashboard is moving behind a sign-in —
everyone here gets their own login." Team members table: initials, name,
email, role pill (Admin/Appraiser/Viewer), dot Active/Invited, last
sign-in, "..."; one Invited row + blue "Resend invite". "Your account":
Profile (name,email), Password (current/new/confirm + "Update password"),
Sessions ("Signed in on 2 devices" + red "Sign out everywhere").
10 DOCUMENT SIGNING (public, no chrome) — "Valta Property Valuations",
"Letter of Engagement", property address. WHITE framed paper: scope,
standards, fee, confidentiality, signature area. Blue "Sign document".
Small post-sign note "Thank you, Dana — your signed copy is on its way".

NAV — wire all, no dead links: SignIn→2. Sidebar: Jobs→2, Clients→6,
Firm→8, Users→9, logo→2. 2: rows→3, +New Job→3, client chip→7. 3: S2
tab→4, client link→7, Send LOE→5. 4: S1 tab→3, Preview & Send→5. 5:
send→10, breadcrumb→4. 6: row→slide-out, View full client page→7,
slide-out jobs→3, chevron closes. 7: Jobs-tab rows→3. 10: Sign→success
state.

OUTPUT: all 10 pages, ONE connected prototype, Play mode clicks sign-in →
jobs → job → quote/LOE → preview → signing, and clients → client → jobs,
no dead ends.
