# Cursor: How to Debug Page Load Failures

## STOP GUESSING - CHECK THE CONSOLE FIRST

When a page won't load, **YOU MUST check the actual error** before making changes.

---

## Method 1: Ask User to Check Browser Console (FASTEST)

```
Ben, the page won't load. Can you open your browser DevTools (F12 or Cmd+Option+I), go to the Console tab, and send me the error message you see?
```

User will see the exact error in red text and can copy it.

---

## Method 2: Check Dev Server Output

The terminal where `npm run dev` is running shows build errors immediately.

**Ask user:**
```
Ben, check the terminal where the dev server is running. Are there any red error messages or TypeScript errors?
```

---

## Method 3: Run Build Check

```bash
npm run build
```

This will show all TypeScript and build errors without needing the browser.

**Common build errors:**
- `Cannot find module '@/components/...'` → Import path wrong
- `Type 'X' is not assignable to 'Y'` → Type mismatch
- `Property 'X' does not exist` → Missing prop or typo

---

## Method 4: TypeScript Check Only

```bash
npx tsc --noEmit
```

Faster than full build, shows only TypeScript errors.

---

## What to Look For in Console

### Import Errors
```
Cannot find module '@/components/ui/textarea'
```
**Fix:** Check if file exists, check import path

### Undefined Variable
```
Cannot read property 'map' of undefined
```
**Fix:** Add null check or optional chaining

### React Hook Error
```
Invalid hook call. Hooks can only be called inside...
```
**Fix:** Move hook to component level, remove conditional

### TypeScript Error
```
Type 'string | undefined' is not assignable to type 'string'
```
**Fix:** Add type guard or default value

---

## Example Debugging Flow

**Cursor:** "Ben made a change and now the LOE page won't load"

### ❌ WRONG APPROACH:
```
"The page might not be loading because of the changes I made. Let me try reverting..."
```

### ✅ CORRECT APPROACH:
```
"Ben, can you check the browser console (F12 → Console tab) and tell me what error shows in red? This will tell us exactly what's broken."

[User reports: "TypeError: handleTextareaResize is not defined at TemplateEditorModal.tsx:362"]

"Got it. The handleTextareaResize function is being called but isn't defined in scope. I'll fix the function reference on line 362."
```

---

## Simple Debugging Checklist

When page won't load:

1. **Ask user for console error** → Get exact error message
2. **Check file and line number** → Error tells you where
3. **Read the error carefully** → "Cannot read property 'X'" means X is undefined
4. **Fix the specific issue** → Don't change random stuff
5. **Verify fix** → Ask user to refresh and confirm

---

## Common Mistakes

### ❌ Don't Do This:
- Guess what might be wrong
- Make random changes hoping it works
- Say "try clearing cache" without checking error
- Revert recent changes without understanding why

### ✅ Do This:
- Get exact error message from console
- Identify file and line number
- Understand what the error means
- Make targeted fix
- Confirm fix with user

---

## Template for User

When you need console output, say:

```
Ben, I need to see the exact error to fix this. Can you:
1. Open the page: http://localhost:8086/dashboard/job/[ID]
2. Press F12 (or Cmd+Option+I on Mac)
3. Click the "Console" tab
4. Copy any red error messages and send them to me

This will tell me exactly what's broken and where.
```

---

## Real Example from Today

**Problem:** LOE page won't load after adding auto-resize textareas

**Wrong approach:** "Maybe the textarea refs aren't working, let me try a different approach..."

**Right approach:**
1. Check console → "handleTextareaResize is not defined"
2. Check line 362 → Function called in onChange
3. Check line 38 → Function defined but not in scope
4. Fix → Function needs to be defined before being used in onChange
5. Done

---

## Remember

**The console tells you EXACTLY what's wrong.**

- Wrong: "The page might be broken because..."
- Right: "Console error on line 362: handleTextareaResize undefined. I'll fix the function reference."

**Stop guessing. Start reading errors.**
