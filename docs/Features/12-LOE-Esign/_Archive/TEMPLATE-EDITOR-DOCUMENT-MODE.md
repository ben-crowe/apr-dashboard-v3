# Template Editor: Document Mode UX

**Current Approach:** Form-based with separate text boxes for each section

**New Approach:** Document-based with inline editable zones

---

## Design Goal

Show the LOE document **exactly as it appears in the preview**, but with only the boilerplate text sections editable. Everything else (field placeholders, headers, static text) is visible but read-only.

Think: **Google Docs with protected ranges** or **Medium editor with read-only sections**.

---

## Visual Concept

```
┌─────────────────────────────────────────────────────────────┐
│ Edit LOE Template                    [zoom controls] [×]     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [VALTA LOGO]                              January 20, 2026  │
│                              Skyline Investments | Robert... │
│                                                               │
│  Re: Letter of Engagement ("LOE" or "Agreement") for...      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Editable: Subject line text here...                  │    │
│  │ Can be multiple lines                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Editable: Thank you for your request to hire Valta   │    │
│  │ Property Valuations Ltd. ("Valta" or "Firm") to      │    │
│  │ complete the valuation and appraisal services...     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Property Identification                                      │
│  VAL261003, 355 Centre Street    ← Read-only, grayed mock    │
│                                                               │
│  Property Type                                                │
│  Multifamily                     ← Read-only, grayed mock    │
│                                                               │
│  Authorized Client                                            │
│  Skyline Investments             ← Read-only, grayed mock    │
│                                                               │
│  Authorized Users                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Editable: The authorized user of the appraisal       │    │
│  │ services described herein is for the Client listed   │    │
│  │ above. No other authorized users apply.              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ... (more read-only fields) ...                             │
│                                                               │
│  Terms & Conditions                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Editable: These Terms and Conditions are attached    │    │
│  │ to and incorporated into the above referenced...     │    │
│  │                                                       │    │
│  │ The appraisal, draft and/or final, shall be...       │    │
│  │                                                       │    │
│  │ (All terms as one flowing text block)                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Editable: If this letter of engagement correctly     │    │
│  │ outlines the Client's understanding...               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Sincerely,                       ← Read-only                │
│  Valta Property Valuations Ltd.   ← Read-only                │
│  [Signature Image]                ← Read-only                │
│                                                               │
│                             [Save Template] [Cancel]          │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Differences from Current Design

### Current (Form Mode):
- ❌ Separate bordered text boxes
- ❌ Only editable sections visible
- ❌ No context of full document
- ❌ Doesn't look like the actual LOE

### New (Document Mode):
- ✅ Full document visible
- ✅ Editable sections have subtle background/border
- ✅ Read-only sections grayed and non-interactive
- ✅ Looks exactly like the LOE preview
- ✅ Field placeholders shown as mock data or subtle `[field-name]`

---

## Implementation Approach

### Component Structure:

```tsx
<div className="document-editor">
  {/* Render sections IN DOCUMENT ORDER */}

  {/* Header - Read-only */}
  <DocumentSection readonly>
    <Logo />
    <DateDisplay mock="January 20, 2026" />
    <ClientInfo mock="Skyline Investments | Robert Brown..." />
  </DocumentSection>

  {/* Subject Line - Editable */}
  <EditableSection
    sectionId="subject-line"
    value={sections.get('subject-line')}
    onChange={handleChange}
    className="editable-zone"
  />

  {/* Introduction - Editable */}
  <EditableSection
    sectionId="intro"
    value={sections.get('intro')}
    onChange={handleChange}
    className="editable-zone"
  />

  {/* Property Details Table - Mixed */}
  <DocumentSection readonly>
    <TableRow label="Property Identification" value="VAL261003, 355 Centre Street" mock />
    <TableRow label="Property Type" value="Multifamily" mock />
    <TableRow label="Authorized Client" value="Skyline Investments" mock />
  </DocumentSection>

  <EditableSection
    sectionId="table-row-1"
    label="Authorized Users"
    value={sections.get('table-row-1')}
    onChange={handleChange}
    className="editable-zone table-cell"
  />

  <DocumentSection readonly>
    <TableRow label="Authorized Use" value="[intendeduses]" />
    <TableRow label="Fee" value="$4,500 plus applicable taxes" mock />
    {/* ... more read-only rows ... */}
  </DocumentSection>

  {/* Terms & Conditions - Editable */}
  <EditableSection
    sectionId="terms"
    value={sections.get('terms')}
    onChange={handleChange}
    className="editable-zone large"
    rows={20}
  />

  {/* Closing - Editable */}
  <EditableSection
    sectionId="action"
    value={sections.get('action')}
    onChange={handleChange}
    className="editable-zone"
  />

  {/* Signature Block - Read-only */}
  <DocumentSection readonly>
    <p>Sincerely,</p>
    <p>Valta Property Valuations Ltd.</p>
    <SignatureImage />
  </DocumentSection>
</div>
```

---

## Styling Guidelines

### Editable Sections:
```css
.editable-zone {
  background: rgba(59, 130, 246, 0.05); /* Very subtle blue tint */
  border: 1px dashed rgba(59, 130, 246, 0.3); /* Subtle dashed border */
  border-radius: 4px;
  padding: 8px 12px;
  transition: all 0.2s;
}

.editable-zone:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.5);
}

.editable-zone:focus-within {
  background: white;
  border: 2px solid rgb(59, 130, 246);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Read-only Sections:
```css
.document-section.readonly {
  color: rgba(0, 0, 0, 0.5); /* Grayed out */
  user-select: none;
  pointer-events: none;
}

.mock-field {
  color: rgba(0, 0, 0, 0.4); /* Even lighter for mock data */
  font-style: italic;
  background: rgba(0, 0, 0, 0.02);
  padding: 2px 6px;
  border-radius: 3px;
}
```

### Field Placeholders (Two Options):

**Option A: Bracket Notation**
```tsx
<span className="field-placeholder">[client-name]</span>
// Styled: gray, monospace, small
```

**Option B: Mock Data** (Recommended)
```tsx
<span className="field-mock">Skyline Investments</span>
// Styled: italic, slightly grayed, maybe with a subtle background
```

---

## Component Props

### EditableSection Component:
```tsx
interface EditableSectionProps {
  sectionId: string;
  value: string;
  onChange: (id: string, value: string) => void;
  label?: string; // Optional label above textarea
  placeholder?: string;
  rows?: number; // Dynamic based on content
  className?: string;
  placeholders?: string[]; // Field placeholders in this section
}
```

### DocumentSection Component:
```tsx
interface DocumentSectionProps {
  readonly: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### TableRow Component:
```tsx
interface TableRowProps {
  label: string;
  value: string;
  mock?: boolean; // If true, style as mock data
  placeholder?: boolean; // If true, show as [field-name]
}
```

---

## Benefits of This Approach

1. **Natural Document Flow** - Looks like the actual LOE
2. **Context Awareness** - Users see where editable sections fit in the document
3. **Less Cognitive Load** - No jumping between form fields and preview
4. **Visual Consistency** - Editor matches preview layout
5. **Better Understanding** - Users see field placeholders in context
6. **Professional Feel** - More like document editing than form filling

---

## Changes Required

### File: `TemplateEditorModal.tsx`

**Current Structure:**
```tsx
{editableSections.map((section) => (
  <Textarea key={section.id} value={...} onChange={...} />
))}
```

**New Structure:**
```tsx
<DocumentEditor>
  {renderDocumentSections()} {/* Renders ALL sections in document order */}
</DocumentEditor>
```

**New Functions Needed:**
```tsx
// Render the full document with mixed editable/readonly sections
const renderDocumentSections = () => {
  return (
    <>
      <ReadOnlyHeader />
      <EditableSection section={getSection('subject-line')} />
      <EditableSection section={getSection('intro')} />
      <ReadOnlyTableRows />
      <EditableSection section={getSection('table-row-1')} label="Authorized Users" />
      <ReadOnlyTableRows />
      <EditableSection section={getSection('terms')} rows={20} />
      <EditableSection section={getSection('action')} />
      <ReadOnlySignature />
    </>
  );
};
```

---

## Mock Data Examples

### Recommended Mock Values:
```tsx
const MOCK_DATA = {
  'client-name': 'Skyline Investments',
  'client-contact': 'Robert Brown, VP of Real Estate',
  'property-address': '355 Centre Street, Calgary, AB T2R 1M5',
  'property-type': 'Multifamily Residential',
  'val-number': 'VAL261003',
  'fee': '$4,500',
  'date': 'January 20, 2026',
  'report-type': 'Narrative Appraisal Report',
  'due-date': '15 business days'
};
```

### Displaying Mock Data:
```tsx
<span className="field-mock" title="Field: [client-name]">
  {MOCK_DATA['client-name']}
</span>
```

On hover, show the actual field name as a tooltip.

---

## Font Size Control

Keep the font size control, but apply it to **both** editable and read-only sections for consistency:

```tsx
<div className="document-editor" style={{ fontSize: `${fontSize}px` }}>
  {/* All content inherits this font size */}
</div>
```

---

## Cursor Prompt

Here's what to tell Cursor:

```
Redesign the template editor to show the FULL LOE document in a flowing layout, not as separate form fields.

Current approach: Separate text boxes for each editable section
New approach: Show the complete document with inline editable zones

Requirements:
1. Show ALL document content (headers, tables, terms, signature) in document order
2. Only boilerplate sections (intro, authorized users, terms, closing) are editable
3. Editable sections have subtle blue tint and dashed border
4. Read-only sections are grayed and non-interactive
5. Field placeholders shown as subtle mock data (e.g., "Skyline Investments" instead of "[client-name]")
6. Table structure preserved with labels visible
7. Looks like the actual LOE preview, just with editable zones

Create new components:
- EditableSection: Textarea with subtle styling
- DocumentSection: Read-only wrapper for static content
- TableRow: Show label + mock value or [field] placeholder

The editor should feel like editing a document, not filling a form.
```

---

## Next Steps

1. **Create mock data constants** for field placeholders
2. **Build DocumentSection and EditableSection components**
3. **Refactor TemplateEditorModal** to render full document
4. **Style editable zones** with subtle backgrounds
5. **Test flow and readability**

Would you like me to start implementing this new approach?
