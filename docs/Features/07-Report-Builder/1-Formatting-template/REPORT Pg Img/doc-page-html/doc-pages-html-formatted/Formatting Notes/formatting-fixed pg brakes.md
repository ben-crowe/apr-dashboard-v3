Postential better solution:
and if this doesnt work that you just did then this would be a solution here read below

--

You're absolutely right! That's actually a better solution. Let me think through this: Current Flexbox Problem:Footer gets pushed down → disappears off page

User can't see where the page ends

No visual feedback that there's too much content

Alternative (Absolute Positioning) Solution:Footer ALWAYS visible at correct position (absolute at bottom)

If content is too long → content appears BEHIND footer (with footer on top due to z-index)

User can SEE the overlap = visual alarm "I have too much content"

User moves overlapping content to next page

Problem solved visually

This is better UX because:Footer never disappears (always shows page number, always marks page boundary)

Overlap is the visual alarm (not mysterious disappearing

--

This is a fantastic product decision. You are trading "layout safety" (Flexbox) for "user visibility" (Absolute Positioning), and in this specific use case—a document editor—visibility is king.

Your logic is sound:

The Visual Alarm: Seeing text run behind the footer is an immediate, intuitive signal: "I have typed too much."

The Anchor: The footer stays locked at the bottom (Inch 11), acting as the constant visual boundary of the page.

I have updated the CSS to implement this "Visual Overlap" strategy. I have also regenerated the HTML for Pages 13–16 (Sales, Scope, Data, Assistance) to match this new structure.

Part 1: The New "Visual Alarm" CSS
Replace your <style> block with this. Note the removal of Flexbox on the page sheet and the addition of z-index to the footer.

<style>
    /* --- 1. GLOBAL RESET & FONTS --- */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: "Open Sans", Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.4;
        background-color: #525659;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 0;
        color: black;
    }

    /* --- 2. PAPER SHEET (ABSOLUTE POSITIONING METHOD) --- */
    .page-sheet {
        background-color: white;
        width: 8.5in;
        height: 11in;            /* Locked Height */
        padding: 0.75in;         /* Margins */
        margin-bottom: 30px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        position: relative;      /* Establishes the coordinate system */
        overflow: hidden;        /* Cuts off anything that goes past 11" */
        display: block;          /* Standard flow (Not Flex) */
        page-break-after: always;
    }

    /* --- 3. THE "ANCHOR" FOOTER --- */
    .page-footer {
        position: absolute;      /* Locks it to the bottom */
        bottom: 0.75in;          /* Matches the page margin */
        left: 0.75in;
        right: 0.75in;
        height: 40px;            /* Fixed height */
        
        /* THE VISUAL ALARM SETTINGS */
        background-color: white; /* Opaque background hides text behind it */
        z-index: 100;            /* Forces it on TOP of overflowing text */
        
        /* Styling */
        border-top: 1px solid #ccc;
        padding-top: 10px;
        font-size: 9pt;
        color: #666;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* --- 4. STANDARD STYLING --- */
    .Header1 { font-size: 18pt; color: #003B7E; border-bottom: 1px solid #003B7E; padding-bottom: 5px; margin-bottom: 20px; font-weight: normal; }
    .Header2 { font-size: 12pt; color: #003B7E; font-weight: bold; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px; }
    .Subheader1 { font-size: 11pt; color: #003B7E; font-weight: bold; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; }
    p { margin-bottom: 10pt; text-align: justify; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt; }
    td, th { padding: 4px 8px; border: 1px solid #ddd; vertical-align: top; }
    .label-col { background-color: #f0f0f0; font-weight: bold; width: 35%; color: #333; }
    
    .field-mapped { background-color: rgba(255, 255, 0, 0.15); border-bottom: 1px dotted #999; cursor: help; font-weight: inherit; display: inline; }
    .field-mapped:hover::before { content: attr(title); position: absolute; transform: translateY(-100%); background: #333; color: white; padding: 4px 8px; font-size: 8pt; border-radius: 4px; white-space: nowrap; z-index: 1000; }
    
    .img-placeholder { width: 100%; display: flex; align-items: center; justify-content: center; background-color: #f4f4f4; border: 1px dashed #ccc; color: #666; margin-bottom: 15px; }
    .footer-accent { width: 60px; height: 10px; background: linear-gradient(to right, #4a9fd8, #003d7a); border-radius: 2px; }
    .page-num { color: #003B7E; font-weight: bold; margin-right: 15px; }

    @media print {
        body { background-color: white; padding: 0; display: block; }
        .page-sheet { width: 100%; margin: 0; box-shadow: none; padding: 0.75in; height: 11in; overflow: hidden; }
        .field-mapped { background-color: transparent; border: none; }
        .img-placeholder { border: none; background: none; }
    }
</style>


### **Part 2: HTML Content Pages 13–16 (Cleaned for Absolute Layout)**

*Append this after your Page 12 content.*

```html
<div class="page-sheet" data-page-num="Print 13">
    <div class="Header1">Introduction & Executive Summary</div>

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

    <div class="page-footer">
        <div><span class="page-num">13</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<div class="page-sheet" data-page-num="Print 14">
    <div class="Header1">Scope of Work</div>

    <p>The scope of work for this appraisal assignment is outlined below:</p>
    
    <ul>
        <li>The appraisal analyzes legal and physical features of the subject including site size, improvement size, site zoning, easements, encumbrances, site access and site exposure.</li>
        <li>The appraisal includes a market analysis for the <span class="field-mapped" title="{{Subject_Market}}">{{Subject_Market}}</span> market and <span class="field-mapped" title="{{Subject_Submarket}}">{{Subject_Submarket}}</span> submarket.</li>
        <li>Research of recent sale and rent comparables. Examined market conditions and analyzed their potential effect on the various properties.</li>
        <li>The appraisal includes a Highest and Best Use analysis for the subject property <span class="field-mapped" title="{{Report_HBUVacant}}">{{Report_HBUVacant}}</span> and <span class="field-mapped" title="{{Report_HBUImproved}}">{{Report_HBUImproved}}</span>.</li>
        <li>In selecting applicable approaches to value, the appraiser considered the agreed upon appraisal scope. As a result, this appraisal developed <b><span class="field-mapped" title="{{Report_Approaches}}">{{Report_Approaches}}</span></b>.</li>
    </ul>

    <p>The assignment was prepared as an <b><span class="field-mapped" title="{{Report_ReportType}}">{{Report_ReportType}}</span></b> in accordance with CUSPAP.</p>

    <div class="Subheader1">Exclusions</div>
    <p>The following work was not undertaken as it was not required for credible results within the scope of this concise assignment:</p>
    <ul>
        <li>Environmental reports, building condition assessments, and title searches were not reviewed.</li>
        <li>No verification of building permits or code compliance was undertaken.</li>
        <li>Rent rolls and operating statements were accepted as accurate without audit.</li>
    </ul>

    <div class="page-footer">
        <div><span class="page-num">14</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<div class="page-sheet" data-page-num="Print 15">
    <div class="Header1">Sources of Information</div>

    <p>The following sources of information were utilized in the preparation of this report:</p>

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

    <div class="page-footer">
        <div><span class="page-num">15</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<div class="page-sheet" data-page-num="Print 16">
    <div class="Header1">Assistance & Definitions</div>

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

    <div class="page-footer">
        <div><span class="page-num">16</span> <span class="field-mapped" title="{{Subject_Street}}">{{Subject_Street}}</span> | File <span class="field-mapped" title="{{Company_JobNumber}}">{{Company_JobNumber}}</span></div>
        <div class="footer-accent"></div>
    </div>
</div>

<br clear=all style='page-break-before:always'>
```