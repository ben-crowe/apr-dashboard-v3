/**
 * Template Parser Utility
 * Extracts editable text sections from HTML template and reconstructs HTML from edited text
 */

export interface EditableSection {
  id: string;
  label: string;
  content: string;
  placeholders: string[];
  htmlStart: string; // HTML before the content
  htmlEnd: string; // HTML after the content
  selector: string; // CSS selector or pattern for reconstruction
  type: 'intro' | 'term' | 'table-cell' | 'other'; // Section type
  originalHTML?: string; // Original HTML for accurate reconstruction (for table cells)
}

/**
 * Extract editable sections from HTML template
 * Uses regex matching to find and extract text sections
 * Only extracts content after the subject-line (header area is non-editable)
 */
export function parseTemplate(html: string): EditableSection[] {
  const sections: EditableSection[] = [];
  
  // Find where editable content starts (after subject-line)
  const subjectLineMatch = html.indexOf('<div class="subject-line">');
  if (subjectLineMatch === -1) {
    // Fallback: start from beginning if subject-line not found
    return parseSections(html);
  }
  
  // Extract only content after subject-line
  const editableContent = html.substring(subjectLineMatch);
  return parseSections(editableContent);
}

/**
 * Parse all editable sections from HTML content
 */
function parseSections(html: string): EditableSection[] {
  const sections: EditableSection[] = [];
  
  // Extract introduction paragraph (.intro)
  const introMatch = html.match(/(<div class="intro">)([\s\S]*?)(<\/div>)/);
  if (introMatch) {
    const content = stripHTMLTags(introMatch[2]);
    const placeholders = extractPlaceholders(content);
    sections.push({
      id: 'intro',
      label: 'Introduction Paragraph',
      content,
      placeholders,
      htmlStart: introMatch[1],
      htmlEnd: introMatch[3],
      selector: '.intro',
      type: 'intro'
    });
  }

  // Extract all terms list items (only top-level <li>, not nested ones)
  const termsListMatch = html.match(/<ol class="terms-list">([\s\S]*?)<\/ol>/);
  if (termsListMatch) {
    const termsListHTML = termsListMatch[1];
    // Match only top-level <li> elements (not nested in sublists)
    // Use a more careful regex that doesn't match nested <li> tags
    let termIndex = 1;
    let searchPos = 0;
    
    while (true) {
      // Find next top-level <li> tag
      const liStart = termsListHTML.indexOf('<li>', searchPos);
      if (liStart === -1) break;
      
      // Find matching </li> - need to handle nested lists
      let depth = 0;
      let liEnd = liStart + 4; // Start after '<li>'
      
      while (liEnd < termsListHTML.length) {
        if (termsListHTML.substring(liEnd).startsWith('<ol')) {
          depth++;
        } else if (termsListHTML.substring(liEnd).startsWith('</ol>')) {
          depth--;
        } else if (termsListHTML.substring(liEnd).startsWith('</li>') && depth === 0) {
          break;
        }
        liEnd++;
      }
      
      if (liEnd < termsListHTML.length) {
        const liContent = termsListHTML.substring(liStart + 4, liEnd);
        const content = stripHTMLTags(liContent);
        if (content.trim()) {
          const placeholders = extractPlaceholders(content);
          sections.push({
            id: `term-${termIndex}`,
            label: `Term ${termIndex}`,
            content,
            placeholders,
            htmlStart: '<li>',
            htmlEnd: '</li>',
            selector: `.terms-list > li:nth-child(${termIndex})`,
            type: 'term',
            originalHTML: liContent // Store for accurate reconstruction
          });
          termIndex++;
        }
        searchPos = liEnd + 5; // Move past '</li>'
      } else {
        break;
      }
    }
  }

  // Extract action/closing section
  const actionMatch = html.match(/(<div class="action-section">\s*<p>)([\s\S]*?)(<\/p>\s*<\/div>)/);
  if (actionMatch) {
    const content = stripHTMLTags(actionMatch[2]);
    const placeholders = extractPlaceholders(content);
    sections.push({
      id: 'action',
      label: 'Closing Statement',
      content,
      placeholders,
      htmlStart: actionMatch[1],
      htmlEnd: actionMatch[3],
      selector: '.action-section p',
      type: 'other'
    });
  }

  // Extract editable table cells (those with substantial text content, not just placeholders)
  const tableMatches = Array.from(html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g));
  let tableCellIndex = 1;
  for (const tableMatch of tableMatches) {
    const fullMatch = tableMatch[0]; // Full <td>...</td> match
    const innerHTML = tableMatch[1]; // Content inside <td>
    const cellContent = stripHTMLTags(innerHTML);
    // Only include cells with substantial text (more than 20 chars) that aren't just placeholders
    if (cellContent.trim().length > 20 && !/^\[[\w.-]+\]$/.test(cellContent.trim())) {
      const placeholders = extractPlaceholders(cellContent);
      // Create a unique ID based on content hash or index
      const cellId = `table-cell-${tableCellIndex}`;
      sections.push({
        id: cellId,
        label: `Table Cell ${tableCellIndex}`,
        content: cellContent,
        placeholders,
        htmlStart: fullMatch.substring(0, fullMatch.indexOf('>') + 1),
        htmlEnd: '</td>',
        selector: `td:nth-of-type(${tableCellIndex})`,
        type: 'table-cell',
        originalHTML: innerHTML // Store original HTML for accurate matching
      });
      tableCellIndex++;
    }
  }

  return sections;
}

/**
 * Strip HTML tags and decode entities, preserving text content and line breaks
 */
function stripHTMLTags(html: string): string {
  if (!html) return '';
  
  // Replace <br> tags with newlines first
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#160;/g, ' '); // Non-breaking space
  
  // Clean up multiple newlines and whitespace
  text = text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/^\s+|\s+$/gm, '') // Trim each line
    .trim();
  
  return text;
}

/**
 * Extract placeholder patterns from text
 */
function extractPlaceholders(text: string): string[] {
  const pattern = /\[[\w.-]+\]/g;
  const matches = text.match(pattern) || [];
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Reconstruct HTML from edited sections
 */
export function reconstructHTML(
  originalHTML: string,
  editedSections: Map<string, string>,
  parsedSections?: EditableSection[]
): string {
  let reconstructed = originalHTML;

  // Find where editable content starts (after subject-line)
  const subjectLineMatch = originalHTML.indexOf('<div class="subject-line">');
  if (subjectLineMatch === -1) {
    // Fallback: reconstruct from beginning
    return reconstructSections(originalHTML, editedSections, parsedSections);
  }

  // Split HTML: header (non-editable) + editable content
  const headerHTML = originalHTML.substring(0, subjectLineMatch);
  const editableHTML = originalHTML.substring(subjectLineMatch);
  
  const reconstructedEditable = reconstructSections(editableHTML, editedSections, parsedSections);
  
  return headerHTML + reconstructedEditable;
}

/**
 * Reconstruct editable sections in HTML
 */
function reconstructSections(
  html: string,
  editedSections: Map<string, string>,
  parsedSections?: EditableSection[]
): string {
  let reconstructed = html;

  // Update introduction section
  if (editedSections.has('intro')) {
    const editedContent = editedSections.get('intro')!;
    const htmlContent = escapeAndFormatHTML(editedContent);
    reconstructed = reconstructed.replace(
      /<div class="intro">[\s\S]*?<\/div>/,
      `<div class="intro">\n        ${htmlContent}\n    </div>`
    );
  }

  // Update action/closing section
  if (editedSections.has('action')) {
    const editedContent = editedSections.get('action')!;
    const htmlContent = escapeAndFormatHTML(editedContent);
    reconstructed = reconstructed.replace(
      /<div class="action-section">\s*<p>[\s\S]*?<\/p>\s*<\/div>/,
      `<div class="action-section">\n        <p>${htmlContent}</p>\n    </div>`
    );
  }

  // Update terms list items using parsed sections for accurate matching
  const termsListMatch = reconstructed.match(/<ol class="terms-list">([\s\S]*?)<\/ol>/);
  if (termsListMatch && parsedSections) {
    let termsListHTML = termsListMatch[1];
    let termIndex = 1;
    let searchPos = 0;
    
    // Replace each top-level term
    while (true) {
      const liStart = termsListHTML.indexOf('<li>', searchPos);
      if (liStart === -1) break;
      
      // Find matching </li> handling nested lists
      let depth = 0;
      let liEnd = liStart + 4;
      
      while (liEnd < termsListHTML.length) {
        if (termsListHTML.substring(liEnd).startsWith('<ol')) {
          depth++;
        } else if (termsListHTML.substring(liEnd).startsWith('</ol>')) {
          depth--;
        } else if (termsListHTML.substring(liEnd).startsWith('</li>') && depth === 0) {
          break;
        }
        liEnd++;
      }
      
      if (liEnd < termsListHTML.length) {
        const termId = `term-${termIndex}`;
        const section = parsedSections.find(s => s.id === termId);
        
        if (section && editedSections.has(termId)) {
          const editedContent = editedSections.get(termId)!;
          const originalContent = section.originalHTML || termsListHTML.substring(liStart + 4, liEnd);
          
          // Check if original content has nested lists - if so, preserve structure
          const hasNestedList = originalContent.includes('<ol') || originalContent.includes('<ul');
          
          let replacementContent: string;
          if (hasNestedList && section.originalHTML) {
            // Preserve nested list structure by keeping original HTML structure
            // Extract nested list HTML from original
            const nestedListMatch = section.originalHTML.match(/([\s\S]*?)(<ol[\s\S]*?<\/ol>)([\s\S]*)/);
            if (nestedListMatch) {
              // Split edited content into parts before and after nested list
              const editedLines = editedContent.split('\n').filter(l => l.trim());
              const beforeText = editedLines[0] || '';
              const afterText = editedLines.slice(1).join('\n');
              
              replacementContent = escapeAndFormatHTML(beforeText) + 
                                   nestedListMatch[2] + // Preserve nested list HTML
                                   (afterText ? '<br>' + escapeAndFormatHTML(afterText) : '');
            } else {
              replacementContent = escapeAndFormatHTML(editedContent);
            }
          } else {
            // No nested lists - simple replacement
            replacementContent = escapeAndFormatHTML(editedContent);
          }
          
          // Replace the content
          termsListHTML = termsListHTML.substring(0, liStart + 4) + 
                         replacementContent + 
                         termsListHTML.substring(liEnd);
          
          // Adjust search position
          searchPos = liStart + 4 + replacementContent.length;
        } else {
          searchPos = liEnd + 5;
        }
        termIndex++;
      } else {
        break;
      }
    }
    
    reconstructed = reconstructed.replace(
      /<ol class="terms-list">[\s\S]*?<\/ol>/,
      `<ol class="terms-list">${termsListHTML}</ol>`
    );
  }

  // Update table cells using parsed sections for accurate matching
  if (parsedSections) {
    editedSections.forEach((editedContent, sectionId) => {
      if (sectionId.startsWith('table-cell-')) {
        const section = parsedSections.find(s => s.id === sectionId);
        if (section && section.originalHTML) {
          const htmlContent = escapeAndFormatHTML(editedContent);
          // Find the table cell by matching the original HTML content
          // We need to match the full <td> tag with its content
          const originalText = stripHTMLTags(section.originalHTML);
          
          // Try to find and replace the cell by matching the text content
          reconstructed = reconstructed.replace(
            /<td[^>]*>([\s\S]*?)<\/td>/g,
            (match, cellContent) => {
              const cellText = stripHTMLTags(cellContent);
              // Match if the text content is very similar (allowing for minor whitespace differences)
              if (cellText.trim() === originalText.trim() || 
                  (cellText.length > 20 && Math.abs(cellText.length - originalText.length) < 5 &&
                   cellText.substring(0, 50) === originalText.substring(0, 50))) {
                // Replace the content while preserving the <td> tag attributes
                const tdTag = match.substring(0, match.indexOf('>') + 1);
                return `${tdTag}${htmlContent}</td>`;
              }
              return match;
            }
          );
        }
      }
    });
  }

  return reconstructed;
}

/**
 * Escape HTML and format newlines
 */
function escapeAndFormatHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
