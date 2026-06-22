---
content_type: prd
title: PRD — Login + Roles (low-friction auth for the APR ecosystem)
status: DRAFT — NOT scheduled. Awaiting qa-agent review + core-agent selection BEFORE any build/deploy.
created: 2026-06-22
author: co-architect
gate: qa-agent (review this PRD + the agent choice + the deploy prompt BEFORE anything is built)
priority: NEXT (Ben, 2026-06-22 — "within the next couple of days," client + team start using the app)
tags: [apr-dashboard, auth, login, roles, rbac, supabase, low-friction, ecosystem]
---

# PRD — Login + Roles (low-friction auth)

> **⛔ Process note (locked after a queue-jump 2026-06-22):** this is a PLAN, not a go-order. Nothing
> gets built or deployed until the qa-agent has reviewed (a) this PRD, (b) WHICH core-group agent
> should own the build, and (c) the exact deploy prompt. Co-arch authors + gates with qa; we do NOT
> guess an agent or self-deploy. Ben sets the go-time — he has NOT said "build now."

## Why (the problem)

1. **The app is wide open — no login.** Today every route renders to anyone with the URL. Ben's
   client (and his team) are about to start using it and **do not want to feel their data sits on a
   public, anyone-can-open URL.** A login makes it feel private and safe — which is the real driver.
2. **It also fixes the our-version-vs-their-version hack.** Right now "keep V4 from the client" is
   solved by a separate URL + a build flag (`VITE_V4_ENABLED`) — only because there's no identity to
   tell staff apart from the client. With login + roles, that hack retires: one site, and what you
   see is decided by WHO you are.
3. **It's the foundation of the ecosystem.** Ben's mental model — "the client has a subscription to
   one section of our platform" — IS role/tier-based access. This PRD is that foundation.

## Goal

Add **authentication + role-based access** to the APR app so that:
- the client logs in (low-friction) and sees ONLY their section;
- internal staff log in and see everything, including V4 and the future "push data to report" controls;
- the experience is NOT annoying — no logging in every visit.

## Hard requirement — LOW-FRICTION login (Ben's emphasis)

The client must not be annoyed. Research + spec the EASIEST clean path. Candidates to evaluate (the
research leg decides):
- **Magic-link / passwordless email** (no password to remember) vs **Google/OAuth SSO** vs **passkeys**.
- **Long-lived / persistent sessions** + "remember this device" so they sign in rarely, not per-visit.
- The minimal-clicks acceptance flow.
Output a recommended default with the trade-offs, not a menu dump.

## Scope

**IN:**
- Auth on the **dashboard + report builder** (the private surfaces).
- A **role/tier model**: at minimum `staff` (internal, full incl. V4) vs `client` (their section).
- Route/section gating driven by role (replaces the URL/flag split over time).
- Low-friction session UX per the hard requirement above.

**OUT / KEEP PUBLIC:**
- The **client intake submission form** stays **public, no login** — appraisal requesters should not
  have to sign up. Only the staff/client *app* surfaces get gated.
- Multi-tenant SaaS billing/subscription plumbing — the ROLE model is in scope; actual billing is later.
- Ripping out the apr-v4 URL / flag immediately — it stays as the bridge until auth is live, then retires.

## Ground truth to build on (verify in the research leg)

- **Supabase is already the backend** — Supabase Auth + RLS is the obvious-fit, low-build path.
- **A `/login` route + Supabase-auth code already EXIST but are NOT enforced** (per project CLAUDE.md).
  So this is partly *activating + role-extending* dormant code, not greenfield — confirm its state.
- `report_builder_data` and email tables currently ship with RLS deliberated OFF — auth changes the
  calculus; the research leg must state the RLS posture per table.

## Open questions for the research/spec leg (the deployed agent answers these)

1. Lowest-friction method for THIS client (magic-link vs Google OAuth vs passkey) + session length.
2. Exact role model + where roles are stored (a `profiles.role` column? Supabase custom claims?).
3. How gating works in the React app (route guards + conditional sections) given the dormant /login.
4. RLS posture per table once identity exists.
5. The migration path: how the apr-v4 URL/flag retires cleanly once roles gate V4.
6. Effort/sequence estimate so Ben can pick the go-time.

## Deliverable from the build (once scheduled)

A clean architecture-decision doc + step-by-step implementation plan covering the above, with the
recommended low-friction default called out, ready for Ben to green-light.

## Agent selection — DECIDE WITH QA, do not guess (open)

Pick from our **core group** the agent best fit for a research-plus-spec auth job on a Supabase/React
codebase — put the choice to the qa-agent for agreement BEFORE deploying. (The earlier instinct to
grab `domain-apr-mgr` was a wrong guess — domain manager ≠ auth/research specialist.) Co-arch + qa
agree the agent + the prompt, THEN deploy on Ben's go.

---

*Authored 2026-06-22 by co-architect as the correct PRD-first path (after a queue-jump correction).
Pairs with the asset-routing + tab-scheme specs. Status stays DRAFT/NEXT until Ben sets go-time.*
