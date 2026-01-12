

This is the **\#1 most difficult challenge** in building web-to-print reports. You have hit the fundamental difference between the web (which scrolls infinitely) and paper (which has fixed boundaries).

Here is the hard truth: **HTML/CSS alone cannot split a text block onto a new page.**

If you have a `<p>` tag that is 15 inches long, CSS cannot magically put the first 10 inches on Page 1 and the remaining 5 inches on Page 2. It will either:

1.  Run off the page (clipping).
2.  Run underneath your footer (overlapping).
3.  Stretch the page to 15 inches (destroying your print layout).

### **How this is typically solved (The Industry Standard)**

The industry standard solution is to use a **JavaScript Pagination Library** in your previewer. The most popular and robust open-source tool for this is **Paged.js**.

#### **What Paged.js does:**

1.  It takes your continuous HTML content.
2.  It measures it against the page size (8.5" x 11").
3.  It **automatically cuts** the content when it hits the bottom margin.
4.  It creates a **new page** DOM element.
5.  It moves the overflow text to the new page.
6.  It **automatically inserts your Header and Footer** on the new page.

### **The Solution Plan**

You need to tell your developer: **"Stop trying to fix this with just CSS. We need to implement Paged.js or a similar fragmentation engine."**

Here is exactly how you implement the "Elegant Flow" you are asking for.

#### **1. The CSS Strategy (The `@page` rules)**

Instead of manually creating `<div class="page-sheet">` for every single page in your code, you write **one long stream of content**, and you define what the "Page" looks like in CSS.

```css
/* Define the Paper */
@page {
    size: 8.5in 11in;
    margin: 0.75in;
    
    /* Define the Footer Area */
    @bottom-center {
        content: element(footerContent);
    }
}

/* Define the Footer Content */
.footer-element {
    position: running(footerContent); /* This tells Paged.js to repeat this on every page */
}
```

#### **2. The HTML Structure**

You stop hard-coding "Page 1", "Page 2", "Page 3". You just write the content.

```html
<body>
    <div class="footer-element">
        <div style="border-top:1px solid #ccc; display:flex; justify-content:space-between;">
             <span>1101, 1121 109 St, North Battleford</span>
             <span>File VAL251012 - 1</span>
        </div>
    </div>

    <div class="report-content">
        <h1>Introduction</h1>
        <p>...Long paragraph...</p>
        <p>...Another long paragraph...</p>
        <p>...More text...</p> 
    </div>
</body>
```

### **Why your current "Absolute Footer" failed**

In your current `PREVIEW-Master.html`, you have this:

```css
.page-footer {
    position: absolute;
    bottom: 0.75in;
}
```

`position: absolute` takes the footer **out of the flow**. The text doesn't know the footer is there, so it writes right over top of it.

If you switch to **Flexbox** (which I used in my previous "Formatted" file), the footer will be pushed down by the text. But once the text gets too long, **the footer gets pushed off the page entirely.**

### **Immediate "Hack" Fix (If you refuse to use Paged.js)**

If your team cannot implement a JS library right now, you must use **Flexbox** and accept that **pages cannot auto-flow**. You must force the user to manually move content to a new page block.

Here is the CSS to fix the *overlapping* issue (so the footer pushes down instead of being written over):

```css
/* The Page Container */
.page-sheet {
    display: flex;
    flex-direction: column;
    height: 11in;
    overflow: hidden; /* Clips content if it gets too long */
}

/* The Content Area */
.content-area {
    flex: 1; /* Takes up all available space */
    overflow: hidden; /* Ensures text doesn't bleed into footer area */
}

/* The Footer */
.page-footer {
    margin-top: auto; /* Pushes to bottom */
    height: 50px;     /* Fixed height to ensure space is reserved */
    flex-shrink: 0;   /* PREVENTS it from being squished by long text */
}
```

**The Trade-off with the Hack:**
If the user types too much, the text will just **stop** (get cut off) before it hits the footer. The user will then have to manually cut that text and paste it into a new Page block.

**My Advice:**
Go with **Paged.js**. It is the only way to get the "Word Processor" behavior where typing more text automatically creates a new page with the correct footer.






--------

My apologies. I was looking at the file numbers (`page-14.html`), which contained maps, but you are referring to the **Printed Page Numbers** (at the bottom right of the page).

Based on your Table of Contents and the document flow:

  * **Printed Page 12:** Identification (You have this).
  * **Printed Page 13:** Sales History & Exposure (You have this).
  * **Printed Pages 14–16:** These are the **Scope of Work** and **Data Sources** pages (Text-heavy pages, NO maps).

The "Missing Footer" issue on text-heavy pages is exactly what the **Flexbox Fix** solves.

Here is the correct HTML for **Printed Pages 13–16** (The text sections). I have applied the `flex-direction: column` fix so the footers will stick to the bottom 11" line and **never** fall off, even if the text is long.

### **Corrected Batch: Pages 13–16 (Scope & Data Sources)**

**Instructions:**

1.  **Delete** the "Maps" block I gave you previously (if you pasted it).
2.  **Append** this code after your "Identification of Assignment" page (Printed Page 12).

<!-- end list -->

```html
<div class="page-sheet" data-page-num="Print 13">
    <div class="Header1">Introduction & Executive Summary</div>

    <div style="flex: 1;">
        <div class="Subheader1">Extraordinary Assumptions</div>
        <p>
            <span class="field-mapped" title="{{Report_Extraordinary}}">{{Report_Extraordinary}}</span>
        </p>

        <div class="Subheader1">Extraordinary Limiting Conditions</div>
        <p>
            <span class="field-mapped" title="{{Report_LimCond}}">{{Report_LimCond}}</span>
        </p>

        <div class="Header2">Property And Sales History</div>
        
        <div class="Subheader1">Current Owner</div>
        <p>
            The subject property is currently under the ownership of <span class="field-mapped" title="{{Subject_Owner}}">{{Subject_Owner}}</span>.
        </p>

        <div class="Subheader1">Three-Year Sales History</div>
        <p>
            <span class="field-mapped" title="{{Subject_SaleHistory}}">{{Subject_SaleHistory}}</span>
        </p>

        <div class="Header2">Exposure & Marketing Time</div>
        <p>
            An estimate of market value is related to the concept of reasonable exposure time. Exposure time is the property's estimated marketing time prior to a hypothetical sale at market value on the effective date of the appraisal.
        </p>
        
        <p>
            Noting the subject property's physical, legal, economic and market characteristics, which are described further in this report, we have concluded a reasonable estimate of <b>exposure and marketing time</b> for the subject property to be <span class="field-mapped" title="{{Subject_ExposureTime}}">{{Subject_ExposureTime}}</span>.
        </p>

        <div class="Subheader1">EXPOSURE & MARKETING TIME</div>
        <table style="width:100%;">
            <tr style="background-color:#003B7E; color:white; font-weight:bold;">
                <td>PROFILE</td>
                <td>AVERAGE</td>
            </tr>
            <tr>
                <td>Exposure Period Conclusion</td>
                <td><span class="field-mapped" title="{{Subject_ExposureTime}}">{{Subject_ExposureTime}}</span></td>
            </tr>
            <tr>
                <td>Marketing Time Conclusion</td>
                <td><span class="field-mapped" title="{{Subject_Marketing}}">{{Subject_Marketing}}</span></td>
            </tr>
        </table>
    </div>

    <div class="page-footer">
        <div><span class="page-num">13</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<div class="page-sheet" data-page-num="Print 14">
    <div class="Header1">Scope of Work</div>

    <div style="flex: 1;">
        <p>
            The scope of work for this appraisal assignment is outlined below:
        </p>
        
        <ul>
            <li>The appraisal analyzes legal and physical features of the subject including site size, improvement size, site zoning, easements, encumbrances, site access and site exposure.</li>
            <li>The appraisal includes a market analysis for the <span class="field-mapped" title="{{Subject_Market}}">{{Subject_Market}}</span> market and <span class="field-mapped" title="{{Subject_Submarket}}">{{Subject_Submarket}}</span> submarket.</li>
            <li>Research of recent sale and rent comparables. Examined market conditions and analyzed their potential effect on the various properties.</li>
            <li>The appraisal includes a Highest and Best Use analysis for the subject property <span class="field-mapped" title="{{Report_HBUVacant}}">{{Report_HBUVacant}}</span> and <span class="field-mapped" title="{{Report_HBUImproved}}">{{Report_HBUImproved}}</span>.</li>
            <li>In selecting applicable approaches to value, the appraiser considered the agreed upon appraisal scope. As a result, this appraisal developed <b><span class="field-mapped" title="{{Report_Approaches}}">{{Report_Approaches}}</span></b>.</li>
        </ul>

        <p>
            The assignment was prepared as an <b><span class="field-mapped" title="{{Report_ReportType}}">{{Report_ReportType}}</span></b> in accordance with CUSPAP.
        </p>

        <div class="Subheader1">Exclusions</div>
        <p>
            The following work was not undertaken as it was not required for credible results within the scope of this concise assignment:
        </p>
        <ul>
            <li>Environmental reports, building condition assessments, and title searches were not reviewed.</li>
            <li>No verification of building permits or code compliance was undertaken.</li>
            <li>Rent rolls and operating statements were accepted as accurate without audit.</li>
        </ul>
    </div>

    <div class="page-footer">
        <div><span class="page-num">14</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<div class="page-sheet" data-page-num="Print 15">
    <div class="Header1">Sources of Information</div>

    <div style="flex: 1;">
        <p>
            The following sources of information were utilized in the preparation of this report:
        </p>

        <div class="img-placeholder" style="height: 250px;">
            [IMAGE: <span class="field-mapped" title="{{Report_InfoSources}}">Report_InfoSources</span>]
        </div>

        <div class="Subheader1">Subject Property Inspection</div>
        <div class="img-placeholder" style="height: 100px;">
            [IMAGE: <span class="field-mapped" title="{{Report_Inspection}}">Report_Inspection</span>]
        </div>
        
        <p style="margin-top:15px; font-size:9pt; color:#666;">
            <i>Note: The appraiser has not performed a technical inspection of the improvements (i.e. electrical, plumbing, heating, etc.) and is not qualified to do so.</i>
        </p>
    </div>

    <div class="page-footer">
        <div><span class="page-num">15</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<div class="page-sheet" data-page-num="Print 16">
    <div class="Header1">Assistance & Definitions</div>

    <div style="flex: 1;">
        <div class="Subheader1">Real Property Appraisal Assistance</div>
        <p>
            <span class="field-mapped" title="{{Report_Assistance}}">{{Report_Assistance}}</span> provided real property appraisal assistance to the appraisers signing this certification. Assistance included data research, verification, and drafting of report sections under direct supervision.
        </p>

        <div class="Subheader1">Definitions</div>
        <p>
            <b>Market Value:</b> The most probable price which a property should bring in a competitive and open market under all conditions requisite to a fair sale, the buyer and seller each acting prudently and knowledgeably, and assuming the price is not affected by undue stimulus.
        </p>
        <p>
            <b>Fee Simple Estate:</b> Absolute ownership unencumbered by any other interest or estate, subject only to the limitations imposed by the governmental powers of taxation, eminent domain, police power, and escheat.
        </p>
        <p>
            <b>Leased Fee Interest:</b> The ownership interest held by the lessor, which includes the right to receive the contract rent specified in the lease plus the reversionary right when the lease expires.
        </p>
    </div>

    <div class="page-footer">
        <div><span class="page-num">16</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<br clear=all style='page-break-before:always'>
```