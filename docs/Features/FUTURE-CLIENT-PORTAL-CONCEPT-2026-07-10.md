---
content_type: feature-concept
title: "Client Portal — appraisal customers get accounts (future feature, Ben 2026-07-10)"
status: CONCEPT — noted for future spec; not scheduled
created: 2026-07-10
source: Ben, oversight session with frontier-reviewer (live Valta site walk)
tags: [apr, client-portal, future-feature, submission-form, valta-website]
---

# Client Portal — future feature concept (Ben, 2026-07-10)

**The live Valta website's request-appraisal page already presents TWO routes** (https://valta.ca/request-appraisal):

1. **"Welcome Back" — returning-client portal:** log in, place new appraisals, track order status, download completed reports, place rush orders.
2. **"Start Your First Appraisal" — first-time submission:** the intake form, no account needed up front — "we'll create your client account during this process."

**The concept to spec later:** an appraisal customer (our client's client) gets a persistent account — log in, see status of their jobs, download reports, and submit a NEW request without re-entering everything (profile pre-fills). They become a recurring client with a recurring dashboard account. First-time submitters get their account created as a side effect of their first intake.

**Adjacent known items (context for the future spec):**
- The V4 series' Part 2 (PRD-APR-V4-02, declared) — client upload page + follow-up email with SharePoint-bucket sync — is a natural sibling: same audience (client's client), same "their own page" surface. The portal likely absorbs or hosts it.
- `client_profiles` already exists in the database (CRM rows) — the account concept has a data home to grow from.
- The no-login rule on the APR dashboard app is UNCHANGED by this — the portal is a separate client-facing surface with its own auth, not a login on our internal dashboard.

**Standing suspicion to verify FIRST (pre-portal):** the live Valta-site form may have DRIFTED from our testing submission form (field set / options). The written standalone check exists (fill valta.ca/request-appraisal/intake in test mode → confirm every field lands in the dashboard) — queued for qa after the current build chunk. Any improvements flow one way: our testing form is the canonical source, website form updates become versioned releases of it (Ben's rule, 2026-07-10).
