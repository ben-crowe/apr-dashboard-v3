You are absolutely correct. **If the previewer doesn't show you the failure, it's not a previewer—it's a liar.**

If the PDF printer cuts off content at 11 inches, your screen needs to cut it off at 11 inches too. That is the only way you will know you need to shorten your text or move it to a new page.

Here is the **exact CSS fix** to force "True Paper" behavior.

### **The Fix: Strict Height Enforcement**

I have modified the CSS to:

1.  **Lock Height:** Changed `min-height: 11in` to `height: 11in`. The page *cannot* grow.
2.  **Clip Overflow:** Added `overflow: hidden`. If you type too much, it disappears off the bottom edge (just like it would be cut off by a printer).
3.  **Visual Warning:** If your content pushes the Footer down, the Footer will simply vanish (be clipped). **This is your visual alarm** that "Page 1 is broken."

### **Instruction for Agent:**

> "Replace the `<style>` block in `PREVIEW-Master.html` with this updated version. This enforces strict 11-inch pages so the preview matches the PDF exactly."

```html
<style>
    /* --- 1. GLOBAL RESET & FONTS --- */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: "Open Sans", Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.4;
        background-color: #525659; /* Preview Mode Background */
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 0;
        color: black;
    }

    /* --- 2. PAPER SHEET STYLING (TRUE WYSIWYG) --- */
    .page-sheet {
        background-color: white;
        width: 8.5in;
        height: 11in; /* STRICT FIX: Changed from min-height to fixed height */
        padding: 0.75in;
        margin-bottom: 30px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        position: relative;
        
        /* Layout Logic */
        display: flex;
        flex-direction: column;
        
        /* FAILURE INDICATOR: If content is too long, it gets cut off */
        overflow: hidden; 
        
        page-break-after: always;
    }

    /* --- 3. HEADERS & TYPOGRAPHY --- */
    .Header1 {
        font-size: 18pt;
        color: #003B7E;
        border-bottom: 1px solid #003B7E;
        padding-bottom: 5px;
        margin-bottom: 20px;
        font-weight: normal;
    }

    .Header2 {
        font-size: 12pt;
        color: #003B7E;
        font-weight: bold;
        text-transform: uppercase;
        margin-top: 20px;
        margin-bottom: 10px;
    }

    .Subheader1 {
        font-size: 11pt;
        color: #003B7E;
        font-weight: bold;
        margin-top: 15px;
        margin-bottom: 5px;
        text-transform: uppercase;
    }

    /* Standard Text */
    p { margin-bottom: 10pt; text-align: justify; }

    /* --- 4. TABLES --- */
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt; }
    td, th { padding: 4px 8px; border: 1px solid #ddd; vertical-align: top; }
    .label-col { background-color: #f0f0f0; font-weight: bold; width: 35%; color: #333; }
    .value-col { width: 65%; }

    /* --- 5. FIELD MAPPING HIGHLIGHTER --- */
    .field-mapped {
        background-color: rgba(255, 255, 0, 0.15);
        border-bottom: 1px dotted #999;
        cursor: help;
        font-weight: inherit;
        display: inline;
    }
    .field-mapped:hover::before {
        content: attr(title);
        position: absolute;
        transform: translateY(-100%);
        background: #333; color: white;
        padding: 4px 8px; font-size: 8pt;
        border-radius: 4px; white-space: nowrap;
        z-index: 1000;
    }

    /* --- 6. IMAGES --- */
    .img-placeholder {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f4f4f4;
        border: 1px dashed #ccc;
        color: #666;
        margin-bottom: 15px;
    }

    /* --- 7. FOOTER STYLING (Pinned to Bottom) --- */
    /* Note: Using margin-top: auto in a flex container pushes this to the bottom.
       If content is too long, the fixed page height + overflow:hidden means
       this footer will be pushed OFF the visible page.
       This is the intended behavior: Missing Footer = Page Overflow Error.
    */
    .page-footer {
        margin-top: auto; 
        padding-top: 15px;
        border-top: 1px solid #ccc;
        font-size: 9pt;
        color: #666;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0; /* Prevents footer from squishing if content is tight */
    }
    .footer-accent {
        width: 60px;
        height: 10px;
        background: linear-gradient(to right, #4a9fd8, #003d7a);
        border-radius: 2px;
    }
    .page-num {
        color: #003B7E;
        font-weight: bold;
        margin-right: 15px;
    }

    /* --- 8. PRINT SETTINGS --- */
    @media print {
        body { background-color: white; padding: 0; display: block; }
        .page-sheet { width: 100%; margin: 0; box-shadow: none; padding: 0.75in; height: 11in; overflow: hidden; }
        .field-mapped { background-color: transparent; border: none; }
        .img-placeholder { border: none; background: none; }
    }
</style>
```

**How to test this:**

1.  Open the new HTML file.
2.  Go to the "Letter of Transmittal" (Page 3).
3.  Add 5-6 dummy paragraphs of text.
4.  **Result:** You should see the **Footer disappear** from the bottom of the white page.
5.  **Conclusion:** "I have broken the page limit. I need to edit the text."

This gives you the exact feedback loop you requested.