# Styling Deployment Protection

**Date:** January 27, 2026
**Session:** APR-Continue.Testing
**Status:** ⚠️ CRITICAL - Styling Protection Required

---

## Issue

**Local dev has broken styling** - Agent changes corrupted colors/styling.
**Live deployment has correct styling** - Must protect from accidental deployment.

---

## Current State

### Local Dev (localhost:8088)
- ❌ Colors are atrocious
- ❌ Dark/light theme both wrong
- ❌ Fields, buttons, UI elements have bad colorways
- **DO NOT DEPLOY THIS STYLING**

### Live Deployment
- ✅ Styling is correct
- ✅ Colors working properly
- **PROTECT THIS - DO NOT OVERWRITE**

---

## Root Cause

Agent made styling changes during previous sessions that broke local styling. These changes were NOT deployed to live (fortunately), so live still has correct styling.

---

## Deployment Rules - MANDATORY

### ✅ SAFE TO DEPLOY
- Edge Functions (supabase/functions/)
- Database migrations
- Backend logic changes
- API integrations

### ❌ DO NOT DEPLOY
- src/index.css (until reverted to match live)
- Component styling files (until verified against live)
- Theme configuration (until verified against live)
- Any CSS/Tailwind changes made locally

---

## Action Plan

**Task Created:** #1 - Revert local dev styling to match live deployment

**Steps:**
1. Compare local vs live styling files
2. Identify corrupted files (likely src/index.css)
3. Pull correct styling from live deployment
4. Apply to local dev
5. Verify local matches live appearance
6. Add deployment checklist to prevent future styling accidents

---

## Deployment Checklist (Future)

Before ANY deployment to live:

**Pre-Deploy Verification:**
- [ ] Edge Functions only? → Safe to deploy
- [ ] Includes frontend files? → STOP - Check styling
- [ ] src/index.css modified? → Compare with live first
- [ ] Component styling changed? → Verify against live
- [ ] Backend only changes? → Safe to deploy

**Styling Verification (if frontend included):**
- [ ] Compare local styling with live deployment
- [ ] Test local appearance matches live
- [ ] Get user approval for any styling changes
- [ ] Never deploy styling changes accidentally

---

## Prevention Strategy

### Option 1: Git Branch Protection
- Create `styling-protection` branch from live
- All deployments must compare against this branch first
- Never merge local styling changes without explicit approval

### Option 2: Deployment Script
- Create pre-deployment script that blocks styling files
- Require `--include-styling` flag to deploy frontend
- Force manual review of styling changes

### Option 3: Environment Variable
- Add `BLOCK_STYLING_DEPLOY=true` to deployment config
- Require explicit override to deploy styling
- Log all styling deployment attempts

---

## User Quote

> "if we deploy live, I don't want to deploy my fucking shitty ass colorways live"

**Translation:** Protect live styling at all costs. Fix local to match live, never the reverse.

---

## Files to Check

Likely corrupted files:
- `src/index.css` - Main styling file
- Component-specific CSS files
- Tailwind configuration
- Theme files

**Next Step:** Read these files and compare with live deployment to identify differences.

---

## Related

- **Task:** #1 - Revert local dev styling to match live deployment
- **Session:** 102-oauth-valta-connection.md (mentioned styling issue during testing)

---

**Priority:** CRITICAL - Must resolve before next deployment
**Blocker:** OAuth testing can continue, but deployment requires styling fix
