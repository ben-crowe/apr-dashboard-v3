# Stitch one-shot prompt — Users & Access settings page (DARK) — paste everything below the line into Stitch desktop

Source design system: ~/Development/apr-clean-working/DESIGN.md (dark theme, Ben-approved)
Sibling reference: the approved Firm & Appraiser settings mock
(~/Development/KM-Exp/data/screenshots/apr-settings-firm-appraiser.html) — this
screen is its neighbor tab and must read as the same family.

---

Design a web settings page titled "Users & Access" for "APR Dashboard" — a
professional appraisal-firm operations dashboard. Desktop web, dark mode. This
page manages who can sign in to the dashboard and each person's own account.

**Page structure:**

1. Deep charcoal page (#191d24), content in a centered column (max ~1080px).
   A slim sticky tab bar across the top in a recessed darker well (#161b22)
   with a bottom hairline: inactive tabs in dim slate — "Client & Property (S1)",
   "Job & Quote (S2)", "Client Documents (S3)", "Calculations", "Firm &
   Appraiser" — and the ACTIVE tab "Users & Access" with a small gear icon,
   off-white semi-bold text and a 2px blue bottom underline.
2. Page header row: left, an "Users & Access" heading (semi-bold, ~19px,
   off-white) with a one-line slate-gray subtitle "Who can sign in, and what
   they can do."; right, a solid blue "Invite user" button with white text.
3. An informational banner: dim blue panel (#2a3a54, 1px #33517d border,
   rounded) with a small info icon and one sentence: "The dashboard is moving
   behind a sign-in — everyone listed here gets their own login."
4. Section one — a single bordered group box (1px border, 7px radius) with a
   tinted collapsible header bar (#222b38) titled "Team members" with a
   chevron. Inside, a clean table-style list, one row per person, hairline
   row dividers:
   - columns: avatar circle with initials, Name (off-white), Email (slate),
     Role as a small quiet pill ("Admin" / "Appraiser" / "Viewer"), Status
     (a small dot + "Active" or "Invited" in slate), Last sign-in (dim slate),
     and a trailing quiet "..." actions menu.
   - 4 example rows; one row shows the "Invited" state with a subtle
     "Resend invite" blue text link.
5. Section two — a second bordered group box with tinted header "Your
   account". Inside, flat sub-sections with small uppercase letter-spaced
   headings, fields laid out one per line with the label right-aligned to a
   colon and the value in a filled dark well (#171c24) with a bottom underline
   only:
   - "PROFILE": Name, Email.
   - "PASSWORD": Current password, New password, Confirm new password, and a
     right-aligned secondary "Update password" button (transparent, hairline
     border).
   - "SESSIONS": one line "Signed in on 2 devices" with a quiet red text
     action "Sign out everywhere".
6. Keep everything quiet and dense: hairline borders, no bright fills, the
   only saturated color is the blue accent and the single red text action.

**DESIGN SYSTEM (REQUIRED):**
Dense, quiet, utilitarian dark operations dashboard. Layered charcoal
surfaces, hairline borders, soft off-white text, one clear blue accent,
underline-only field wells, quiet selected states.
- Page background: deep charcoal #191d24
- Card/panel: charcoal #1e2530 with hairline border #2b3542; group header
  bars raised charcoal #222b38
- Recessed tab bar: #161b22; active tab = off-white text + 2px blue underline
- Field wells: #171c24, bottom underline only (1px #2b3542); label
  right-aligned to a colon, fixed label column so colons align
- Headings & primary text: soft off-white #e7edf5
- Labels & secondary text: slate gray #8b98a9; placeholders/dim text #6b7789
- Primary action / links / focus: clear blue #3b82f6; banner panel #2a3a54
  with border #33517d
- Destructive text action only: red #ef4444
- Typography: system UI sans-serif, dense — 19px semi-bold page title, 14px
  medium group-bar titles, 10.5px uppercase letter-spaced sub-headings,
  12–13px body/labels
- Roundness: group boxes 7px, buttons/banners 8px; field wells square
