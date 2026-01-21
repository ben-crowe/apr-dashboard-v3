# Cursor: Check Console Errors (Automatic)

## When Page Won't Load - Run This Command

```bash
bash scripts/check-page-errors.sh
```

That's it. You'll see the actual console errors.

---

## Example Output

```
Checking: http://localhost:8086/dashboard/job/f8f1106a-e44c-477e-b046-42315ce38d8f

✗ Rendered more hooks than during the previous render.
✗ Rendered more hooks than during the previous render.
✗ Cannot read property 'handleTextareaResize' of undefined
✓ Browser closed
```

Now you know EXACTLY what's wrong.

---

## Check Different URL

```bash
bash scripts/check-page-errors.sh http://localhost:8086/your-page
```

---

## What You Get

- ✓ All React errors
- ✓ All JavaScript errors
- ✓ All console errors
- ✓ Zero human interaction needed

---

## Workflow

1. Make code change
2. Run: `bash scripts/check-page-errors.sh`
3. See errors → Fix them
4. No errors → Done

**Never ask Ben for console output. Run the script.**

---

## Common Errors You'll See

### "Rendered more hooks than..."
**Problem:** Hook count changed between renders
**Fix:** Check if hooks are called conditionally

### "Cannot read property 'X' of undefined"
**Problem:** Variable X is undefined
**Fix:** Add null check or ensure variable exists

### "X is not a function"
**Problem:** Variable isn't the type you think
**Fix:** Check variable definition

### "Cannot find module"
**Problem:** Import path wrong
**Fix:** Check file path and imports

---

## Remember

When page won't load:
1. Run `bash scripts/check-page-errors.sh`
2. Read the actual error
3. Fix the actual error
4. Don't guess

**The script tells you exactly what's broken.**
