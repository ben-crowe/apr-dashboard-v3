# Stitch one-shot prompt — Sign-in screen (DARK) — paste everything below the line into Stitch desktop

Source design system: ~/Development/apr-clean-working/DESIGN.md (dark theme, Ben-approved)

---

Design a web sign-in page for "APR Dashboard" — a professional appraisal-firm
operations dashboard. Desktop web, dark mode.

**Page structure:**

1. Full-viewport deep charcoal page background (#191d24) with a single centered
   card (max width ~28rem) in a slightly lighter charcoal (#1e2530), subtly
   rounded corners, 1px hairline border (#2b3542), roomy internal padding.
   No imagery, no gradients, no decoration — quiet, utilitarian SaaS.
2. Card header, centered: the product name "APR Dashboard" as a semi-bold
   modest heading in soft off-white, with a smaller slate-gray subtitle:
   "Sign in to access your dashboard".
3. Sign-in form, stacked vertically with comfortable spacing:
   - "Email" — small slate-gray label above the field; input as a filled dark
     well (#171c24) with a bottom underline only (1px #2b3542), no side
     borders; placeholder "you@company.com" in dim slate.
   - "Password" — same field styling; masked-dots placeholder; a small
     "Forgot password?" blue text link right-aligned under the field.
4. A full-width solid blue primary button (#3b82f6) labeled "Sign In", white
   semi-bold text, subtly rounded (8px), slight darkening on hover.
5. Below the button, a centered small-text line in slate gray: "Don't have an
   account?" with a blue "Contact your administrator" link (no self-serve
   signup).
6. Focused inputs get a blue underline and a faint blue halo. Errors, if
   shown, use a thin red (#ef4444) helper line under the field — nothing loud.

**DESIGN SYSTEM (REQUIRED):**
Dense, quiet, utilitarian dark operations dashboard. Layered charcoal
surfaces, hairline borders, soft off-white text, one clear blue accent,
underline-only field wells, quiet selected states.
- Page background: deep charcoal #191d24
- Card/panel: charcoal #1e2530 with hairline border #2b3542
- Field wells: #171c24, bottom underline only (1px #2b3542)
- Headings & primary text: soft off-white #e7edf5
- Labels & secondary text: slate gray #8b98a9; placeholders dim slate #6b7789
- Primary action / links / focus: clear blue #3b82f6
- Errors only: red #ef4444
- Typography: system UI sans-serif, dense — semi-bold modest headings (~19px),
  small labels (~12.5px), 13px body
- Roundness: buttons/cards subtly rounded (7–8px); field wells square with
  underline only
