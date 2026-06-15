---
id: note-local-vs-deployed-api
title: "⚠ READ THIS — local dev hits the DEPLOYED server, not your local api/ code"
date: 2026-06-15
type: gotcha-note
author: qa-agent
priority: high
tags: [gotcha, vite-proxy, deploy, valcre, api, testing, root-cause]
---

# ⚠ Local dev hits the DEPLOYED server — not your local `api/` code

**This caused real, repeated confusion (Ben + qa, 2026-06-15).** Write it where everyone testing sees it.

## The thing to know

The local dev server (`localhost:8086`) proxies every **`/api`** call to the **PRODUCTION Vercel
deployment** (see `vite.config.ts` proxy). So:

- **Client/React changes** (anything under `src/`) → take effect LOCALLY the moment you save. ✓
- **Server changes** (anything under `api/`, e.g. `api/valcre.ts` — the Valcre proxy, field mapping,
  empty-PATCH logic, custom-field handling) → DO NOTHING locally. The local app calls PROD's copy of
  that function. Your local `api/` edit is invisible until you **deploy**.

## Why it bit us

We were diagnosing the cascade→Valcre sync and editing both `src/` (client) AND `api/valcre.ts`
(server). The client edits worked locally; the server edits silently didn't — so fields "still didn't
sync" even though the fix was written. It looked like the fix didn't work; really it just wasn't live.
Symptoms that are ACTUALLY this: "my api change does nothing," "fixed it but it still fails the same
way," "works for client fields but not server-mapped ones."

## The rule

- Testing a **client** change → just reload localhost. No deploy needed.
- Testing a **server** (`api/`) change → you MUST deploy first (`vercel --prod`), THEN test. There is no
  local-server path; the proxy always points at prod.
- When a sync result looks wrong, FIRST ask: "is the server fix actually deployed?" before debugging code.

(Also documented globally in the cli-agent-all toolkit: `JUDGMENT-dashboard.md` → "My local api/ change
does nothing on the dashboard / the Vite proxy gotcha." This project-local note exists because it cost us
a real diagnosis cycle.)

*qa-agent · 2026-06-15. Captured at Ben's request after the cascade-sync work was tested against
not-yet-deployed server code.*
