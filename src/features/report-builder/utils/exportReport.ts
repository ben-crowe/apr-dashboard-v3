export interface ExportOptions {
  fileName?: string;
  propertyName?: string;
  fileNumber?: string;
}

/**
 * Generate a default filename with timestamp
 */
function generateFileName(options: ExportOptions, extension: 'pdf' | 'docx' | 'doc' | 'html'): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  if (options.fileName) {
    return `${options.fileName}.${extension}`;
  }

  const parts: string[] = ['appraisal-report'];

  if (options.fileNumber) {
    parts.push(options.fileNumber);
  } else if (options.propertyName) {
    // Clean property name for filename
    const cleanName = options.propertyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    parts.push(cleanName);
  }

  parts.push(timestamp);

  return `${parts.join('-')}.${extension}`;
}

/**
 * Export the report as PDF using print dialog
 * This is the simplest and most reliable method
 */
export async function exportToPDF(
  iframeRef: HTMLIFrameElement | null,
  options: ExportOptions = {}
): Promise<void> {
  if (!iframeRef?.contentWindow) {
    throw new Error('Preview iframe not available');
  }

  try {
    // Trigger the browser's print dialog
    // The user can then "Save as PDF"
    iframeRef.contentWindow.print();
  } catch (error) {
    console.error('Failed to open print dialog:', error);
    throw new Error('Failed to export PDF');
  }
}

/**
 * Export the report as Word document (.doc format)
 * We export as HTML with Word-compatible markup which Word can open natively.
 * Note: Uses .doc extension (not .docx) because .docx requires OOXML/ZIP format.
 */
export async function exportToDOCX(
  html: string,
  options: ExportOptions = {}
): Promise<void> {
  try {
    // Create a complete HTML document with Word-friendly styling and XML namespaces
    const wordHtml = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="APR Dashboard Report Builder">
  <meta name="Originator" content="APR Dashboard">
  <title>Appraisal Report</title>
  <!--[if gte mso 9]>
  <xml>
    <o:DocumentProperties>
      <o:Author>APR Dashboard</o:Author>
      <o:LastAuthor>APR Dashboard</o:LastAuthor>
      <o:Revision>1</o:Revision>
      <o:Created>${new Date().toISOString()}</o:Created>
      <o:LastSaved>${new Date().toISOString()}</o:LastSaved>
      <o:Pages>1</o:Pages>
      <o:Words>0</o:Words>
      <o:Characters>0</o:Characters>
      <o:Company>Valta Appraisals</o:Company>
    </o:DocumentProperties>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
    </o:OfficeDocumentSettings>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:SpellingState>Clean</w:SpellingState>
      <w:GrammarState>Clean</w:GrammarState>
      <w:TrackMoves>false</w:TrackMoves>
      <w:TrackFormatting/>
      <w:ValidateAgainstSchemas/>
      <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
      <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
      <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
      <w:DoNotPromoteQF/>
      <w:LidThemeOther>EN-US</w:LidThemeOther>
      <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
      <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
      <w:Compatibility>
        <w:BreakWrappedTables/>
        <w:SnapToGridInCell/>
        <w:WrapTextWithPunct/>
        <w:UseAsianBreakRules/>
        <w:DontGrowAutofit/>
        <w:SplitPgBreakAndParaMark/>
        <w:EnableOpenTypeKerning/>
        <w:DontFlipMirrorIndents/>
        <w:OverrideTableStyleHps/>
      </w:Compatibility>
      <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    /* Word-compatible styles */
    @page {
      size: 8.5in 11in;
      margin: 1in;
      mso-page-orientation: portrait;
    }
    @page Section1 {
      mso-header-margin: .5in;
      mso-footer-margin: .5in;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000000;
      margin: 0;
      padding: 0;
      mso-ansi-font-size: 12.0pt;
      mso-bidi-font-size: 12.0pt;
      mso-fareast-font-family: "Times New Roman";
    }
    .page {
      page-break-after: always;
      mso-break-type: section-break;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    table, th, td {
      border: 1px solid black;
      mso-border-alt: solid black .5pt;
    }
    th, td {
      padding: 5pt;
      text-align: left;
      vertical-align: top;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 12pt;
      mso-style-name: "Heading 1";
    }
    h2 {
      font-size: 18pt;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 8pt;
      mso-style-name: "Heading 2";
    }
    h3 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 8pt;
      margin-bottom: 6pt;
      mso-style-name: "Heading 3";
    }
    p {
      margin-top: 0;
      margin-bottom: 8pt;
      mso-style-name: "Normal";
    }
    img {
      max-width: 100%;
      height: auto;
    }
    /* Preserve whitespace and line breaks */
    .preserve-whitespace {
      white-space: pre-wrap;
      mso-line-break-override: none;
    }
  </style>
</head>
<body lang="EN-US" style="tab-interval:.5in">
  <div class="Section1">
    ${html}
  </div>
</body>
</html>`;

    // Create a Blob with Word-compatible MIME type
    // Using 'application/msword' for .doc format
    const blob = new Blob(['\ufeff' + wordHtml], {
      type: 'application/msword;charset=utf-8',
    });

    // Create download link - use .doc extension (not .docx)
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFileName(options, 'doc');

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate DOCX:', error);
    throw new Error('Failed to export DOCX');
  }
}

/**
 * Export the report as standalone HTML file
 * This can be opened in browsers or imported into other tools
 */
export async function exportToHTML(
  html: string,
  options: ExportOptions = {}
): Promise<void> {
  try {
    // Create a complete HTML document
    const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appraisal Report</title>
</head>
<body>
  ${html}
</body>
</html>`;

    // Create a Blob with the HTML content
    const blob = new Blob([completeHtml], {
      type: 'text/html',
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFileName(options, 'html');

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate HTML:', error);
    throw new Error('Failed to export HTML');
  }
}

/**
 * Get export options from the report sections
 */
export function getExportOptionsFromSections(sections: any[]): ExportOptions {
  const coverSection = sections.find(s => s.id === 'cover');

  if (!coverSection) {
    return {};
  }

  // Helper to get field value
  const getFieldValue = (fieldId: string): string => {
    const field = coverSection.fields?.find((f: any) => f.id === fieldId);
    return field?.value ? String(field.value) : '';
  };

  return {
    propertyName: getFieldValue('property-name'),
    fileNumber: getFieldValue('file-number'),
  };
}
