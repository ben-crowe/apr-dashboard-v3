# Comparison Fix: How to Properly Compare Report Output

## The Problem That Was Found

The `generate_and_compare.cjs` script was **NOT using the actual template**. Instead of:
- Importing and executing the 364KB `reportHtmlTemplate.ts` (7,198 lines)

It was:
- Using a hardcoded `generateSimpleHTML()` stub function (~150 lines)

This made the entire comparison meaningless - we were comparing a throwaway stub against the Valcre reference, not our actual output.

---

## Method 1: Capture from Running App (Recommended)

The most reliable way to get the actual rendered HTML:

### Steps:
1. Start the dev server:
   ```bash
   cd /Users/bencrowe/Development/APR-Dashboard-v3
   npm run dev
   ```

2. Open http://localhost:5173 (or whatever port)

3. Navigate to Report Builder

4. In the browser dev tools (F12), find the preview iframe:
   - Look for `<iframe title="Report Preview">`
   - Right-click inside the iframe → "View Frame Source"
   - Or in Console: `document.querySelector('iframe').contentDocument.documentElement.outerHTML`

5. Copy the HTML and save to `generated-report-FROM-APP.html`

6. Run comparison:
   ```bash
   cd docs/15-Contract-review/Valcre\ Workbook/
   python3 compare_reports.py
   ```
   (Update the script to point to the new file)

---

## Method 2: Export and Compare

1. Use the **Export PDF** button in the app
2. This triggers `exportToPDF()` which uses the same HTML
3. If using Gotenberg, capture the HTML before it's sent

---

## Method 3: tsx Direct Execution (For Automation)

If tsx is installed, you could run the TypeScript directly:

```bash
# Install tsx if needed
npm install -D tsx

# Create a runner script that imports the template
npx tsx generate_real_report.ts
```

But this requires:
- Setting up proper module resolution
- Mocking/providing the sections data structure
- May need tsconfig path mapping

---

## What to Fix in compare_reports.py

Update the file path at the top:
```python
GENERATED_HTML = Path("generated-report-FROM-APP.html")
```

Instead of the stub output.

---

## Expected Results After Fix

With the **actual** template output, we should see:
- Match percentage **significantly higher** than 1.1%
- Proper section-by-section comparison
- Identification of real gaps (missing fields, formatting differences)
- The 80% visual coverage we've been tracking should be reflected

---

## Key Lesson

**Never trust comparison results without verifying the comparison is testing the right thing.**

The 1.1% match should have been an immediate red flag - it meant either:
1. The comparison was broken (✓ this was the case)
2. The template was completely wrong (not the case - it's 364KB of code)

Always sanity-check metrics before accepting them.
