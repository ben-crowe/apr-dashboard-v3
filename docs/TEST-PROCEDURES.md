# APR Dashboard Test Procedures

## Issue Resolution Log

### 2026-01-27: Dashboard Jobs Display Issue

**Problem:** Dashboard showing 0 jobs, "TypeError: Failed to fetch"

**Root Cause:** Dev server wasn't running (not a code issue, not an RLS issue, not an API issue)

**Resolution:** Start dev server with `npm run dev`

**Current Status:** ✅ RESOLVED - 22 jobs displaying correctly

---

## Test Job Creation Procedure

### Prerequisites
- Dev server must be running: `npm run dev`
- Navigate to: `http://localhost:8088/dashboard` (port may vary - check console output)

### Method 1: Test Job Button (PREFERRED)

**This is the correct way to test job creation:**

1. Open dashboard: `http://localhost:8088/dashboard`
2. Locate the "Test Job" button (usually in header or toolbar)
3. Click "Test Job" button
4. System automatically creates a test job with pre-filled data
5. Verify new job appears in the job list

**Using agent-browser:**
```bash
agent-browser navigate http://localhost:8088/dashboard
agent-browser click 'button:has-text("Test Job")'
agent-browser screenshot
```

### Method 2: Manual Form Entry (NOT PREFERRED)

**DON'T manually fill forms unless specifically testing form validation.**

The Test Job button exists for a reason - use it.

---

## Verification Checklist

After creating a test job:

- [ ] New job appears in dashboard job list
- [ ] Job has correct property name (e.g., "OAuth Test Property")
- [ ] Job has valid property type (e.g., "Residential")
- [ ] Job has status "submitted"
- [ ] No console errors
- [ ] Job persists after page refresh

---

## Database Verification

Check jobs in database via Management API:

```bash
curl -X POST "https://api.supabase.com/v1/projects/ngovnamnjmexdpjtcnky/database/query" \
  -H "Authorization: Bearer [MANAGEMENT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) FROM job_submissions;"}'
```

---

## Common Issues

### Jobs Not Displaying

1. **Check dev server is running:**
   ```bash
   curl http://localhost:8088 -I
   ```
   Expected: 200 OK

2. **Check console errors:**
   ```bash
   agent-browser navigate http://localhost:8088/dashboard
   agent-browser console
   ```

3. **Verify Supabase connection:**
   - Check logs show "Fetching jobs from Supabase..."
   - Check logs show "Supabase jobs: [Object, Object, ...]"
   - NO "Failed to fetch" errors

### Dev Server Not Starting

```bash
# Kill existing processes on port
lsof -ti:8088 | xargs kill -9

# Restart
npm run dev
```

---

## Critical Notes

**ALWAYS use the Test Job button for testing.**

Do NOT:
- ❌ Manually fill forms just to test if job creation works
- ❌ Skip verification steps
- ❌ Assume jobs display without checking console
- ❌ Forget to document when procedures change

**DO:**
- ✅ Click "Test Job" button
- ✅ Verify in browser AND console
- ✅ Check database if unclear
- ✅ Update this document when procedures change

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start dev server | `npm run dev` |
| Check server running | `curl http://localhost:8088 -I` |
| Navigate to dashboard | `agent-browser navigate http://localhost:8088/dashboard` |
| Create test job | `agent-browser click 'button:has-text("Test Job")'` |
| Check console | `agent-browser console` |
| Take screenshot | `agent-browser screenshot` |

---

**Last Updated:** 2026-01-27
**Status:** Jobs displaying correctly, Test Job button functional
