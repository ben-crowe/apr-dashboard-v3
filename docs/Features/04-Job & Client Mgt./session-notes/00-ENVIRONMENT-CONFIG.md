# ClickUp Integration - Environment Configuration

**Purpose**: Clear separation of Development (Ben's) vs Production (Client's) ClickUp environments
**Date**: November 4, 2025
**Status**: Two distinct environments for safe testing → production deployment

---

## Overview

This ClickUp integration uses **TWO separate environments**:

1. **DEVELOPMENT** (Ben's ClickUp) - For testing with teammate before deployment
2. **PRODUCTION** (Client's Valta ClickUp) - For final testing and live use

**DO NOT mix these up.** Test in Development first, deploy to Production only after verification.

---

## 🔧 DEVELOPMENT ENVIRONMENT (Ben's ClickUp)

**Use for:**
- Pre-deployment testing with teammate
- Workflow verification
- Edge Function testing
- Breaking things safely
- Learning the system

**Workspace**: BC Workspace

### Configuration Details

| Setting | Value |
|---------|-------|
| **Team ID** | `8555561` |
| **API Key** | `pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU` |
| **Test List ID** | `901703694310` |
| **Space** | Dev.Projects |
| **Template ID** | (Create test template or skip template for testing) |

### ClickUp Structure

```
BC Workspace (8555561)
└── Dev.Projects (Space)
    └── APR-Appraisal (Folder)
        └── Test List (901703694310)
            └── [Test tasks will be created here]
```

### Document Location

**Project Documentation:**
- Document: Project Plan (ID: `85319-16017`)
- Folder: APR System Guide (ID: `85319-70637`)
- URL: https://app.clickup.com/8555561/v/d/85319-16017

### Test Workflow

1. **Form Submission (Test)**: Use staging/test APR Dashboard
2. **Database**: Test Supabase instance or separate test table
3. **Edge Function**: Deploy to test environment first
4. **Webhook**: Configure webhook to test Edge Function
5. **ClickUp Tasks**: Created in Ben's Test List (901703694310)
6. **Verification**: Check tasks appear correctly, no errors

### What to Test

- [ ] Form submission triggers task creation
- [ ] Task has correct format (client data, property data)
- [ ] Custom field "Dashboard Job URL" works
- [ ] Click from ClickUp → Opens Dashboard job
- [ ] Click from Dashboard → Opens ClickUp task
- [ ] No duplicate tasks created
- [ ] Stage 2 update works (after Valcre job created)
- [ ] Task name changes from "NEW SUBMISSION" to "VAL######"
- [ ] No errors in Supabase logs

---

## 🚀 PRODUCTION ENVIRONMENT (Client's Valta ClickUp)

**Use for:**
- Final testing after Development passes
- Live production deployment
- Real client jobs
- Team's actual workflow

**Workspace**: Valta

### Configuration Details

| Setting | Value |
|---------|-------|
| **Team ID** | `9014181018` |
| **API Key** | `pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5` |
| **Production List ID** | `901402094744` (Chris's list) |
| **Template ID** | `t-86b3exqe8` (LOE New Template 2025.01.09) |

### Template Details

**Template Name**: LOE New Template 2025.01.09
**Template ID**: `t-86b3exqe8`
**Subtasks Added**: 9 automatic subtasks
1. Create & Send LOE
2. Plan Job
3. Pull (TTSZ)
4. Tour Property
5. Sale and Lease Comps
6. Build Front End
7. Complete Valuation
8. Send to Client
9. Book Job

### ClickUp Structure

```
Valta Workspace (9014181018)
└── [Space Name]
    └── Chris's List (901402094744)
        └── [Production tasks created here]
```

### Production Workflow

1. **Form Submission**: Real client submits form at https://apr-hub-05-25.vercel.app
2. **Database**: Production `job_submissions` table in Supabase
3. **Edge Function**: Production Edge Function at `/functions/v1/create-clickup-task`
4. **Webhook**: Database webhook on INSERT to `job_submissions`
5. **ClickUp Tasks**: Created in Chris's List (901402094744) with 9 subtasks
6. **Team Notification**: Real team gets ClickUp notification
7. **Work Begins**: Team clicks from ClickUp to Dashboard to start job

### Production Deployment Steps

1. ✅ **Development testing complete** (all tests passed in Ben's ClickUp)
2. Update Edge Function with **Production API key** (`pk_10791838...`)
3. Update Edge Function with **Production List ID** (`901402094744`)
4. Deploy Edge Function to production: `supabase functions deploy create-clickup-task`
5. Configure production webhook (Supabase Dashboard)
6. Test with **ONE real job** submission
7. Verify task created correctly in Chris's List
8. Verify team receives notification
9. Verify bidirectional navigation works
10. Monitor for 24 hours before considering stable

---

## 🔐 API Key Security

**IMPORTANT**: These API keys have full access to their respective workspaces.

### Ben's Key (Development)
```
pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU
```
**Access**: BC Workspace (8555561)
**Permissions**: Full access to Ben's ClickUp
**Safe to test with**: Yes

### Client's Key (Production)
```
pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5
```
**Access**: Valta Workspace (9014181018)
**Permissions**: Full access to client's ClickUp
**Safe to test with**: ONLY after Development testing passes

---

## 📋 Edge Function Configuration

### Development Edge Function
**File**: `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/create-clickup-task/index.ts`

```typescript
// DEVELOPMENT CONFIGURATION
const CLICKUP_API_TOKEN = 'pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'
const CLICKUP_LIST_ID = '901703694310'  // Ben's test list
const CLICKUP_TEMPLATE_ID = null  // Skip template or create test template
const CLICKUP_WORKSPACE_ID = '8555561'  // BC Workspace
```

### Production Edge Function
**File**: `/Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/create-clickup-task/index.ts`

```typescript
// PRODUCTION CONFIGURATION
const CLICKUP_API_TOKEN = 'pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5'
const CLICKUP_LIST_ID = '901402094744'  // Chris's list in Valta
const CLICKUP_TEMPLATE_ID = 't-86b3exqe8'  // LOE New Template 2025.01.09
const CLICKUP_WORKSPACE_ID = '9014181018'  // Valta workspace
```

---

## 🔄 Switching Between Environments

### To Test in Development:
1. Update Edge Function with **Development** credentials (above)
2. Deploy to test environment
3. Configure webhook to point to test Edge Function
4. Submit test form
5. Verify tasks appear in Ben's test list (901703694310)

### To Deploy to Production:
1. **ONLY after Development testing passes**
2. Update Edge Function with **Production** credentials (above)
3. Deploy to production environment
4. Configure production webhook
5. Test with ONE real job
6. Monitor and verify

### Safety Checklist Before Production:
- [ ] All Development tests passed
- [ ] Team reviewed and approved
- [ ] Edge Function uses Production API key
- [ ] Edge Function uses Production List ID (901402094744)
- [ ] Template ID is set correctly (t-86b3exqe8)
- [ ] Webhook configured for production database
- [ ] Rollback plan ready
- [ ] Team knows testing is happening
- [ ] Monitoring in place

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
- Test in Production first (always test in Development)
- Mix API keys (Development key in Production config)
- Use wrong List ID (creates tasks in wrong workspace)
- Skip template ID in Production (no subtasks will be added)
- Deploy without testing webhook
- Forget to switch credentials when deploying

### ✅ DO:
- Always test in Development first
- Double-check API key matches environment
- Verify List ID matches environment
- Test webhook before enabling for production
- Keep Production credentials secure
- Document any changes to configuration

---

## 📊 Environment Comparison

| Feature | Development (Ben's) | Production (Client's) |
|---------|-------------------|---------------------|
| **Workspace** | BC Workspace | Valta Workspace |
| **Team ID** | 8555561 | 9014181018 |
| **API Key** | pk_63967834... | pk_10791838... |
| **List ID** | 901703694310 | 901402094744 |
| **Template** | Optional | Required (t-86b3exqe8) |
| **Subtasks** | Optional | 9 subtasks |
| **Team Notifications** | Ben only | Client's team |
| **Breaking Things** | OK | NOT OK |
| **Real Data** | No | Yes |
| **Purpose** | Testing & Learning | Production Use |

---

## 🔍 Verification Commands

### Check Development ClickUp
```bash
curl -X GET 'https://api.clickup.com/api/v2/list/901703694310' \
  -H 'Authorization: pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU'
```

### Check Production ClickUp
```bash
curl -X GET 'https://api.clickup.com/api/v2/list/901402094744' \
  -H 'Authorization: pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5'
```

### Verify Edge Function Configuration
```bash
# Check which environment is configured
grep "CLICKUP_API_TOKEN\|CLICKUP_LIST_ID" \
  /Users/bencrowe/Development/APR-Dashboard-v3/supabase/functions/create-clickup-task/index.ts
```

---

## 📝 Notes

### Why Two Environments?

**Safety**: Testing in Production risks:
- Creating duplicate/test tasks in client's workspace
- Team confusion from test notifications
- Breaking production workflow during testing
- Data pollution

**Proper Flow**:
1. Build in code
2. Test in Development (Ben's ClickUp)
3. Verify everything works
4. Deploy to Production (Client's ClickUp)
5. Final verification with ONE real job
6. Monitor and confirm stable

### Custom Fields

Both environments need custom field "Dashboard Job URL" created:

**Development**: Create in list 901703694310
**Production**: Create in list 901402094744

Use same field name in both for consistency.

---

## 🎯 Quick Reference

**Testing in Development?**
- API Key: `pk_63967834_W45TQXNS33YE9O1CA0K8RZDLGIM5B2FU`
- List ID: `901703694310`
- Workspace: BC (8555561)

**Deploying to Production?**
- API Key: `pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5`
- List ID: `901402094744`
- Template: `t-86b3exqe8`
- Workspace: Valta (9014181018)

**Not sure which to use?**
→ Use Development (Ben's) first, always.

---

**Last Updated**: November 4, 2025
**Maintained By**: Ben Crowe
**Related Documents**: 01-04 in this folder
