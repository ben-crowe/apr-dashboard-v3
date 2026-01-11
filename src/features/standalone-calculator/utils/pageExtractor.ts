/**
 * Page Extractor Utility
 * 
 * Extracts individual pages from Report-MF-template.html
 * Creates standalone HTML files with CSS and postMessage listeners
 */

import fs from 'fs';
import path from 'path';

/**
 * Extract a page from the template HTML
 */
export function extractPage(
  templatePath: string,
  pageNum: string,
  outputPath: string
): void {
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  
  // Extract CSS from <style> block
  const styleMatch = templateContent.match(/<style>([\s\S]*?)<\/style>/);
  const css = styleMatch ? styleMatch[1] : '';
  
  // Find page start marker
  const pageStartRegex = new RegExp(
    `<div class="page-sheet" data-page-num="Page ${pageNum}">`,
    'i'
  );
  const pageStartMatch = templateContent.match(pageStartRegex);
  
  if (!pageStartMatch) {
    throw new Error(`Page ${pageNum} not found in template`);
  }
  
  const pageStartIndex = pageStartMatch.index!;
  
  // Find next page-sheet div or end of template
  const nextPageRegex = /<div class="page-sheet" data-page-num="Page \d+">/gi;
  nextPageRegex.lastIndex = pageStartIndex + 1;
  const nextPageMatch = nextPageRegex.exec(templateContent);
  
  const pageEndIndex = nextPageMatch ? nextPageMatch.index : templateContent.length;
  
  // Extract page content
  const pageContent = templateContent.substring(pageStartIndex, pageEndIndex);
  
  // Create standalone HTML
  const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Page ${pageNum} - Direct Capitalization</title>
    <style>
${css}
    </style>
</head>
<body>
${pageContent}
    
    <script>
        // Listen for postMessage from parent window
        window.addEventListener('message', (event) => {
            if (event.data.type === 'UPDATE_FIELDS') {
                event.data.fields.forEach(({ id, value }) => {
                    // Find all elements with this field ID
                    const selectors = [
                        \`[data-field-id="{{\${id}}}"]\`,
                        \`[data-field-id="{{\${id}}}"]\`,
                        \`.field-mapped[title="{{\${id}}}"]\`,
                    ];
                    
                    selectors.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            element.textContent = value;
                            element.classList.add('populated');
                        });
                    });
                });
            }
        });
    </script>
</body>
</html>`;
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write file
  fs.writeFileSync(outputPath, standaloneHTML, 'utf-8');
  console.log(`Extracted Page ${pageNum} to ${outputPath}`);
}

/**
 * Extract multiple pages
 */
export function extractPages(
  templatePath: string,
  pageNums: string[],
  outputDir: string
): void {
  pageNums.forEach((pageNum) => {
    const outputPath = path.join(outputDir, `page-${pageNum}-direct-capitalization.html`);
    extractPage(templatePath, pageNum, outputPath);
  });
}
