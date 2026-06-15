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
  sectionTitle?: string; // Numbered parent section/subsection title (e.g. "2. PROPERTY DESCRIPTION") — for grouping
  fieldLabel?: string;   // The specific field this box sits under (e.g. "Current Use"), '' if none
  ordered?: boolean;     // True only if this box is an <ol> list item (a real numbered list, e.g. the Appendix)
}

/**
 * Extract editable sections from HTML template
 * Uses regex matching to find and extract text sections
 * Subject line is now editable (first section)
 */
export function parseTemplate(html: string): EditableSection[] {
  // V07+ marker path: if the template carries data-editable markers, drive the
  // editor off those (the optimized template authored to the editability proposal).
  // Otherwise fall back to the legacy class-hunt (old V1/V2/V3 templates).
  if (/data-editable\s*=/.test(html)) {
    return parseByMarkers(html);
  }
  return parseSections(html);
}

/**
 * Marker-based parse (V07+). Every element tagged data-editable="ed-N" becomes one
 * editable section. The nearest preceding heading / field-label supplies the label,
 * so the left panel reads like the letter. Merge-token data + titles stay untouched
 * (they carry no marker). data-removable on a heading flags an X-to-delete section.
 */
function parseByMarkers(html: string): EditableSection[] {
  // Two kinds of context anchor, tracked SEPARATELY so each editable block is labelled by its
  // NUMBERED parent section (mirrors the template's 1–16 numbering) plus the specific field it
  // sits under — e.g. "2. PROPERTY DESCRIPTION — Current Use of the Property". Without this the
  // labels jump (field-names with no number for §1–3, then "4. PURPOSE…") and you can't follow
  // them against the letter.
  const sectionAnchors: Array<{ index: number; label: string }> = []; // h1/h3 — the numbered titles
  const fieldAnchors: Array<{ index: number; label: string }> = [];   // <p class="field-label"> sub-labels
  const secRe = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g;
  let sa: RegExpExecArray | null;
  while ((sa = secRe.exec(html)) !== null) {
    const label = stripHTMLTags(sa[1]).trim();
    if (label) sectionAnchors.push({ index: sa.index, label });
  }
  const fldRe = /<p class="field-label"[^>]*>([\s\S]*?)<\/p>/g;
  let fa: RegExpExecArray | null;
  while ((fa = fldRe.exec(html)) !== null) {
    const label = stripHTMLTags(fa[1]).trim();
    if (label) fieldAnchors.push({ index: fa.index, label });
  }
  const lastBefore = (arr: Array<{ index: number; label: string }>, idx: number) => {
    let best: { index: number; label: string } | null = null;
    for (const a of arr) { if (a.index < idx) best = a; else break; }
    return best;
  };
  const contextFor = (idx: number): { sectionTitle: string; fieldLabel: string } => {
    const sec = lastBefore(sectionAnchors, idx);
    const fld = lastBefore(fieldAnchors, idx);
    // The field-label only applies if it belongs to the CURRENT section (sits after its heading).
    const fieldInSection = fld && (!sec || fld.index > sec.index) ? fld.label : '';
    return { sectionTitle: sec ? sec.label : 'Cover Letter', fieldLabel: fieldInSection };
  };

  // A box is "ordered" ONLY if it's a list item inside an <ol> (a real numbered list, like the
  // Appendix legal-list). <ul> bullets (e.g. Inspection) and prose paragraphs are NOT numbered —
  // the page doesn't number them, so the editor must not invent numbers there either.
  const inOrderedList = (idx: number): boolean => {
    const before = html.slice(0, idx);
    const inOl = before.lastIndexOf('<ol') > before.lastIndexOf('</ol>');
    const inUl = before.lastIndexOf('<ul') > before.lastIndexOf('</ul>');
    if (inOl && inUl) return before.lastIndexOf('<ol') > before.lastIndexOf('<ul'); // nearest open wins
    return inOl;
  };

  const sections: EditableSection[] = [];
  const blockRe = /<(p|li)((?:\s[^>]*)?)\sdata-editable="([^"]+)"((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/g;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = blockRe.exec(html)) !== null) {
    const innerHTML = m[5];
    const edId = m[3];
    const content = stripHTMLTags(innerHTML);
    if (!content.trim()) continue;
    // LOCK the top-left client contact/address block (inside <div class="address-block">).
    // Its stacked <br/> line breaks get stripped on the editable-section round-trip, which
    // collapses the client name + address into one run-on line. It must stay NON-editable so
    // the formatting survives. Excluded from the editable regions, never made a box.
    // (Ben bug 2026-06-15 — contact-block-lock, PRD-APR-LOE-02 Part-1 Part-A.)
    if (/class="address-block"/.test(html.slice(Math.max(0, m.index - 120), m.index))) continue;
    n++;
    const ctx = contextFor(m.index);
    sections.push({
      id: edId,
      label: ctx.fieldLabel ? `${ctx.sectionTitle} — ${ctx.fieldLabel}` : ctx.sectionTitle,
      sectionTitle: ctx.sectionTitle,
      fieldLabel: ctx.fieldLabel,
      ordered: m[1] === 'li' && inOrderedList(m.index),
      content,
      placeholders: extractPlaceholders(innerHTML),
      htmlStart: '',
      htmlEnd: '',
      selector: `[data-editable="${edId}"]`,
      type: m[1] === 'li' ? 'term' : 'other',
      originalHTML: innerHTML,
    });
  }
  return sections;
}

/**
 * A row in the document-order editor view. Lets the left panel mirror the whole letter:
 * section/subsection headers appear ONCE, locked data fields are shown (greyed), and editable
 * wording is a box. Order matches the rendered letter exactly.
 */
export type EditorRow =
  | { kind: 'section'; text: string }                          // h1 numbered title (locked)
  | { kind: 'subsection'; text: string }                       // h3 (e.g. 14.1) (locked)
  | { kind: 'field'; label: string; value: string }            // field-label + its data value (locked)
  | { kind: 'editable'; id: string; content: string; label?: string } // editable wording box
  | { kind: 'locked'; content: string };                       // other prose/data (locked, e.g. signature lines)

/**
 * Parse the full letter into ordered rows for the Contract Editor. Marker templates produce the
 * complete structure (titles + locked data + editable wording); legacy templates fall back to the
 * editable-only list so they still work.
 */
export function parseEditorRows(html: string): EditorRow[] {
  if (!/data-editable\s*=/.test(html)) {
    return parseTemplate(html).map((s) => ({ kind: 'editable' as const, id: s.id, content: s.content, label: s.label }));
  }

  type Tok = { index: number; kind: string; a?: string; b?: string; id?: string };
  const toks: Tok[] = [];
  const scan = (source: string, fn: (m: RegExpExecArray) => Tok | null) => {
    const r = new RegExp(source, 'g');
    let m: RegExpExecArray | null;
    while ((m = r.exec(html)) !== null) { const t = fn(m); if (t) toks.push(t); }
  };
  scan('<h1[^>]*>([\\s\\S]*?)</h1>', (m) => ({ index: m.index, kind: 'section', a: stripHTMLTags(m[1]).trim() }));
  scan('<h3[^>]*>([\\s\\S]*?)</h3>', (m) => ({ index: m.index, kind: 'subsection', a: stripHTMLTags(m[1]).trim() }));
  scan('<p class="field-label"[^>]*>([\\s\\S]*?)</p>', (m) => ({ index: m.index, kind: 'fieldlabel', a: stripHTMLTags(m[1]).trim() }));
  scan('<(p|li)((?:\\s[^>]*)?)\\sdata-editable="([^"]+)"((?:\\s[^>]*)?)>([\\s\\S]*?)</\\1>', (m) => ({ index: m.index, kind: 'editable', id: m[3], b: stripHTMLTags(m[5]) }));
  scan('<(p|li)((?:\\s[^>]*)?)>([\\s\\S]*?)</\\1>', (m) => {
    const full = m[0];
    if (/data-editable=/.test(full) || /class="field-label"/.test(full)) return null;
    if (/<(signature-field|text-field|date-field|img)/.test(full)) return null;
    const text = stripHTMLTags(m[3]).trim();
    return text ? { index: m.index, kind: 'plain', b: text } : null;
  });
  toks.sort((x, y) => x.index - y.index);

  const rows: EditorRow[] = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.kind === 'section') rows.push({ kind: 'section', text: t.a! });
    else if (t.kind === 'subsection') rows.push({ kind: 'subsection', text: t.a! });
    else if (t.kind === 'editable') rows.push({ kind: 'editable', id: t.id!, content: t.b ?? '' });
    else if (t.kind === 'plain') rows.push({ kind: 'locked', content: t.b ?? '' });
    else if (t.kind === 'fieldlabel') {
      const next = toks[i + 1];
      if (next?.kind === 'plain') { rows.push({ kind: 'field', label: t.a!, value: next.b ?? '' }); i++; }
      else if (next?.kind === 'editable') { rows.push({ kind: 'editable', id: next.id!, content: next.b ?? '', label: t.a! }); i++; }
      else rows.push({ kind: 'field', label: t.a!, value: '' });
    }
  }
  return rows;
}

/**
 * Reconstruct a marker-based template: swap each data-editable block's inner content
 * for the user's edited text. Merge-token data fields are preserved by IDENTITY — each
 * surviving [Field] bracket in the edited text is re-wrapped with its original
 * <span class="merge-token" data-token="…"> wrapper, so the data-field highlight + id
 * survive the save (auto-fill keys off the bare bracket either way). A token the user
 * deletes from the wording stays gone — re-wrap only what's still there.
 */
function reconstructByMarkers(html: string, editedSections: Map<string, string>): string {
  return html.replace(
    /(<(?:p|li)(?:\s[^>]*)?\sdata-editable=")([^"]+)("(?:\s[^>]*)?>)([\s\S]*?)(<\/(?:p|li)>)/g,
    (full, open, edId, openEnd, origInner, close) => {
      if (!editedSections.has(edId)) return full;
      const edited = editedSections.get(edId)!;

      // Map each original merge-token span by its bracket text, e.g.
      // "[Valuetimeframe]" -> '<span class="merge-token" data-token="Valuetimeframe">[Valuetimeframe]</span>'
      const spanByBracket = new Map<string, string>();
      const spanRe = /<span class="merge-token"[\s\S]*?<\/span>/g;
      let sm: RegExpExecArray | null;
      while ((sm = spanRe.exec(origInner)) !== null) {
        const bracket = (sm[0].match(/\[[\w./-]+\]/) || [])[0];
        if (bracket && !spanByBracket.has(bracket)) spanByBracket.set(bracket, sm[0]);
      }

      // Escape the user's edited text first, THEN re-insert the raw token spans so their
      // own markup isn't escaped. Literal split/join avoids regex-escaping the brackets.
      let out = escapeAndFormatHTML(edited);
      for (const [bracket, span] of spanByBracket) {
        out = out.split(bracket).join(span);
      }
      return `${open}${edId}${openEnd}${out}${close}`;
    }
  );
}

/**
 * Parse all editable sections from HTML content
 */
function parseSections(html: string): EditableSection[] {
  const sections: EditableSection[] = [];
  
  // Extract sections in DOCUMENT ORDER (as they appear in the LOE):
  // 1. Subject line (FIRST)
  // 2. Introduction paragraph
  // 3. Table cells
  // 4. Closing statement
  // 5. Terms & Conditions (LAST)
  
  // 1. Extract subject line (FIRST) - Only the boilerplate part before field placeholders
  const subjectLineMatch = html.match(/(<div class="subject-line">)([\s\S]*?)(<\/div>)/);
  if (subjectLineMatch) {
    const fullContent = stripHTMLTags(subjectLineMatch[2]);

    // Split at "Identified as:" - everything after that is field placeholders
    const splitPattern = /Identified as:\s*/i;
    const match = fullContent.match(splitPattern);

    let content = fullContent;
    let placeholders: string[] = [];

    if (match && match.index !== undefined) {
      // Extract only the boilerplate part (up to and including "Identified as:")
      content = fullContent.substring(0, match.index! + match[0].length).trim();
      // Field placeholders are everything after
      const fieldPart = fullContent.substring(match.index! + match[0].length);
      placeholders = extractPlaceholders(fieldPart);
    } else {
      placeholders = extractPlaceholders(content);
    }

    sections.push({
      id: 'subject-line',
      label: 'Subject Line',
      content,
      placeholders,
      htmlStart: subjectLineMatch[1],
      htmlEnd: subjectLineMatch[3],
      selector: '.subject-line',
      type: 'other'
    });
  }
  
  // 2. Extract introduction paragraph (.intro)
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

  // 2. Extract ALL table rows - users can override any field value
  const tableRowMatches = Array.from(html.matchAll(/<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g));
  let tableRowIndex = 1;
  for (const rowMatch of tableRowMatches) {
    const headerCell = stripHTMLTags(rowMatch[1]).trim();
    const valueCellHTML = rowMatch[2];
    const valueCellContent = stripHTMLTags(valueCellHTML).trim();

    // Extract all rows - users can override field placeholders if needed
    const placeholders = extractPlaceholders(valueCellContent);
    const rowId = `table-row-${tableRowIndex}`;

    // Store the full row HTML for reconstruction
    const fullRowMatch = rowMatch[0];
    const rowStart = fullRowMatch.indexOf('<tr>');
    const rowEnd = fullRowMatch.lastIndexOf('</tr>') + 5;
    const fullRowHTML = fullRowMatch.substring(rowStart, rowEnd);

    sections.push({
      id: rowId,
      label: `${headerCell}`,
      content: valueCellContent, // Only the value cell content is editable
      placeholders,
      htmlStart: fullRowHTML.substring(0, fullRowHTML.indexOf('</td>') + 5), // Up to end of first <td>
      htmlEnd: fullRowHTML.substring(fullRowHTML.lastIndexOf('<td'), fullRowHTML.length), // From second <td> to end
      selector: `.property-table tr:nth-child(${tableRowIndex})`,
      type: 'table-cell',
      originalHTML: valueCellHTML // Store original HTML for accurate reconstruction
    });
    tableRowIndex++;
  }

  // 3. Extract action/closing section
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

  // 4. Extract entire Terms & Conditions section as ONE block (LAST)
  const termsListMatch = html.match(/(<ol class="terms-list">)([\s\S]*?)(<\/ol>)/);
  if (termsListMatch) {
    const termsListHTML = termsListMatch[2]; // Content inside <ol>...</ol>
    // Extract all text content, preserving structure with newlines between terms
    // Convert each <li> to plain text with double newlines between terms
    let content = '';
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
        const termText = stripHTMLTags(liContent);
        if (termText.trim()) {
          // Add term text with double newline separator
          if (content) {
            content += '\n\n';
          }
          content += termText.trim();
        }
        searchPos = liEnd + 5; // Move past '</li>'
      } else {
        break;
      }
    }
    
    if (content.trim()) {
      const placeholders = extractPlaceholders(content);
      sections.push({
        id: 'terms',
        label: 'Terms & Conditions',
        content: content.trim(),
        placeholders,
        htmlStart: termsListMatch[1],
        htmlEnd: termsListMatch[3],
        selector: '.terms-list',
        type: 'term',
        originalHTML: termsListHTML // Store original HTML for accurate reconstruction
      });
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
    .replace(/<\/li>/gi, '\n') // Add line break after each list item
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

  // V07+ marker path mirrors the marker-based parse.
  if (/data-editable\s*=/.test(originalHTML)) {
    return reconstructByMarkers(originalHTML, editedSections);
  }

  // Subject line is now editable, so reconstruct entire HTML
  return reconstructSections(originalHTML, editedSections, parsedSections);
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

  // Update subject line section
  if (editedSections.has('subject-line') && parsedSections) {
    const editedContent = editedSections.get('subject-line')!;
    const section = parsedSections.find(s => s.id === 'subject-line');

    // Get the field placeholders part from the original HTML
    const originalMatch = reconstructed.match(/<div class="subject-line">([\s\S]*?)<\/div>/);
    let fieldPlaceholdersPart = '';

    if (originalMatch && section) {
      const originalFullContent = stripHTMLTags(originalMatch[1]);
      // Extract everything after "Identified as:" from original
      const splitPattern = /Identified as:\s*/i;
      const match = originalFullContent.match(splitPattern);
      if (match && match.index !== undefined) {
        fieldPlaceholdersPart = originalFullContent.substring(match.index! + match[0].length);
      }
    }

    // Combine edited boilerplate + original field placeholders
    const fullContent = editedContent + (fieldPlaceholdersPart ? ' ' + fieldPlaceholdersPart : '');
    const htmlContent = escapeAndFormatHTML(fullContent);

    reconstructed = reconstructed.replace(
      /<div class="subject-line">[\s\S]*?<\/div>/,
      `<div class="subject-line">\n        ${htmlContent}\n    </div>`
    );
  }

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

  // Update Terms & Conditions section (single block)
  if (editedSections.has('terms') && parsedSections) {
    const editedContent = editedSections.get('terms')!;
    const termsSection = parsedSections.find(s => s.id === 'terms');
    
    if (termsSection && termsSection.originalHTML) {
      // Split edited content by double newlines to get individual terms
      const editedTerms = editedContent.split(/\n\n+/).filter(t => t.trim());
      
      // Parse original HTML to extract structure (including nested lists)
      const originalTermsListHTML = termsSection.originalHTML;
      const originalTerms: Array<{ textContent: string; hasNestedList: boolean; nestedListHTML?: string; beforeText?: string }> = [];
      
      let searchPos = 0;
      while (true) {
        const liStart = originalTermsListHTML.indexOf('<li>', searchPos);
        if (liStart === -1) break;
        
        // Find matching </li> handling nested lists
        let depth = 0;
        let liEnd = liStart + 4;
        
        while (liEnd < originalTermsListHTML.length) {
          if (originalTermsListHTML.substring(liEnd).startsWith('<ol')) {
            depth++;
          } else if (originalTermsListHTML.substring(liEnd).startsWith('</ol>')) {
            depth--;
          } else if (originalTermsListHTML.substring(liEnd).startsWith('</li>') && depth === 0) {
            break;
          }
          liEnd++;
        }
        
        if (liEnd < originalTermsListHTML.length) {
          const liContent = originalTermsListHTML.substring(liStart + 4, liEnd);
          const hasNestedList = liContent.includes('<ol class="terms-sublist">');
          let nestedListHTML: string | undefined;
          let beforeText: string | undefined;
          
          if (hasNestedList) {
            // Extract nested list HTML and text before it
            const nestedMatch = liContent.match(/([\s\S]*?)(<ol class="terms-sublist">[\s\S]*?<\/ol>)([\s\S]*)/);
            if (nestedMatch) {
              beforeText = stripHTMLTags(nestedMatch[1]).trim();
              nestedListHTML = nestedMatch[2];
            }
          }
          
          originalTerms.push({
            textContent: stripHTMLTags(liContent).trim(),
            hasNestedList,
            nestedListHTML,
            beforeText
          });
          
          searchPos = liEnd + 5;
        } else {
          break;
        }
      }
      
      // Reconstruct terms list HTML
      let reconstructedTermsHTML = '';
      
      // Match edited terms to original terms to preserve nested lists
      for (let i = 0; i < editedTerms.length; i++) {
        const editedTerm = editedTerms[i].trim();
        const originalTerm = originalTerms[i];
        
        let termHTML = '';
        
        // Check if this term originally had a nested list
        if (originalTerm && originalTerm.hasNestedList && originalTerm.nestedListHTML) {
          // Preserve nested list structure
          // The edited term should contain the text that was before the nested list
          // We'll put the edited text before the nested list
          const escapedText = escapeAndFormatHTML(editedTerm);
          termHTML = escapedText + '\n                ' + originalTerm.nestedListHTML;
        } else {
          // Simple term - just escape and format
          termHTML = escapeAndFormatHTML(editedTerm);
        }
        
        reconstructedTermsHTML += `            <li>${termHTML}</li>`;
        if (i < editedTerms.length - 1) {
          reconstructedTermsHTML += '\n            \n';
        }
      }
      
      // Replace entire terms list
      reconstructed = reconstructed.replace(
        /<ol class="terms-list">[\s\S]*?<\/ol>/,
        `<ol class="terms-list">\n${reconstructedTermsHTML}\n        </ol>`
      );
    }
  }

  // Update table rows using parsed sections for accurate matching
  if (parsedSections) {
    editedSections.forEach((editedContent, sectionId) => {
      if (sectionId.startsWith('table-row-')) {
        const section = parsedSections.find(s => s.id === sectionId);
        if (section && section.originalHTML) {
          const htmlContent = escapeAndFormatHTML(editedContent);
          const originalText = stripHTMLTags(section.originalHTML);
          
          // Find and replace the value cell in the matching table row
          reconstructed = reconstructed.replace(
            /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g,
            (match, headerCell, valueCell) => {
              const cellText = stripHTMLTags(valueCell);
              // Match if the text content matches the original
              if (cellText.trim() === originalText.trim() || 
                  (cellText.length > 20 && Math.abs(cellText.length - originalText.length) < 5 &&
                   cellText.substring(0, 50) === originalText.substring(0, 50))) {
                // Replace the value cell content
                const valueTdStart = match.indexOf('</td>') + 5;
                const valueTdEnd = match.indexOf('</td>', valueTdStart);
                const valueTdTag = match.substring(valueTdStart, match.indexOf('>', valueTdStart) + 1);
                return match.substring(0, valueTdStart) + valueTdTag + htmlContent + '</td>' + match.substring(valueTdEnd + 5);
              }
              return match;
            }
          );
        }
      }
      // Also handle old table-cell- format for backward compatibility
      else if (sectionId.startsWith('table-cell-')) {
        const section = parsedSections.find(s => s.id === sectionId);
        if (section && section.originalHTML) {
          const htmlContent = escapeAndFormatHTML(editedContent);
          const originalText = stripHTMLTags(section.originalHTML);
          
          reconstructed = reconstructed.replace(
            /<td[^>]*>([\s\S]*?)<\/td>/g,
            (match, cellContent) => {
              const cellText = stripHTMLTags(cellContent);
              if (cellText.trim() === originalText.trim() || 
                  (cellText.length > 20 && Math.abs(cellText.length - originalText.length) < 5 &&
                   cellText.substring(0, 50) === originalText.substring(0, 50))) {
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
