# Master Template Management

## Current Master

**`Report-MF-Template-v2.6.0-integrated.html`** - Source of truth for the report template.

This file mirrors to: `public/Report-MF-template.html` (used by the app)

---

## File Naming Convention

| Suffix | Meaning |
|--------|---------|
| `vX.X.X-integrated` | Has calculator bridge code, deployed to app |
| `vX.X.X` (no suffix) | Work in progress, NOT yet integrated |

---

## Workflow: Making Template Changes

### 1. Start Work
```
Duplicate the current integrated version:
Report-MF-Template-v2.6.0-integrated.html
                    ↓
Report-MF-Template-v2.7.0.html  (bump version, remove "-integrated")
```

### 2. Make Edits
- Edit the new version (v2.7.0.html)
- Other agents can work on this file freely
- Keep edits in this folder or work elsewhere, then bring back here

### 3. Request Integration
When edits are complete, tell Claude:
> "Integrate v2.7.0 and deploy"

Claude will:
1. Add ~50 lines of calculator bridge code (postMessage listener)
2. Rename to `Report-MF-Template-v2.7.0-integrated.html`
3. Copy to `public/Report-MF-template.html`
4. Move old integrated version to `archive/`

### 4. Done
New master is live. App uses the updated template.

---

## What "Integration" Adds

The calculator bridge code (~50 lines) enables:
- `postMessage` listener for `CALCULATOR_UPDATE` events
- `isCalcField` protection (prevents test toggle overwriting calc values)
- Real-time sync between Calculator Demo and template preview

Without this code, the template works standalone but won't receive live calculator data.

---

## Deployment Target

```
Master (docs/):  Report-MF-Template-vX.X.X-integrated.html
                              ↓ (copy)
App (public/):   Report-MF-template.html  (no version number)
```

The app version has no version number - always check the master to know which version is deployed.

---

## Archive

Old versions are kept in `archive/` for reference. Safe to delete after confirming new version works.
