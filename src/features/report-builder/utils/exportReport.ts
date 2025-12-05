import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  fileName?: string;
  propertyName?: string;
  fileNumber?: string;
}

/**
 * Generate a default filename with timestamp
 */
function generateFileName(options: ExportOptions, extension: 'pdf' | 'docx' | 'html'): string {
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
 * Export the report as PDF using html2canvas and jsPDF
 * This creates a direct PDF download without print dialog
 */
export async function exportToPDFDirect(
  iframeRef: HTMLIFrameElement | null,
  options: ExportOptions = {}
): Promise<void> {
  if (!iframeRef?.contentDocument?.body) {
    throw new Error('Preview iframe not available');
  }

  try {
    const body = iframeRef.contentDocument.body;

    // Get all pages in the document
    const pages = body.querySelectorAll('.page');

    if (pages.length === 0) {
      throw new Error('No pages found in document');
    }

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      // Capture the page as canvas
      const canvas = await html2canvas(page, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add new page if not the first page
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));
    }

    // Generate filename and save
    const fileName = generateFileName(options, 'pdf');
    pdf.save(fileName);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Failed to export PDF');
  }
}

/**
 * Export the report as DOCX (Word document)
 * Since converting HTML to proper DOCX is complex, we export as HTML
 * which Word can open and convert automatically
 */
export async function exportToDOCX(
  html: string,
  options: ExportOptions = {}
): Promise<void> {
  try {
    // Create a complete HTML document with Word-friendly styling
    const wordHtml = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Appraisal Report</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11in;
      margin: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000000;
      margin: 0;
      padding: 0;
    }
    .page {
      page-break-after: always;
      width: 8.5in;
      min-height: 11in;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table, th, td {
      border: 1px solid black;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 12pt;
    }
    h2 {
      font-size: 18pt;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 8pt;
    }
    h3 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 8pt;
      margin-bottom: 6pt;
    }
    p {
      margin-bottom: 8pt;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
    `.trim();

    // Create a Blob with the HTML content
    const blob = new Blob([wordHtml], {
      type: 'application/msword',
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateFileName(options, 'docx');

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
