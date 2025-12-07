# Appraisal Report Generator Project

## Location Found
**Path**: `/Users/bencrowe/Development/APR-Hub-Extended/_APR-Hub-Master/14-Contract-Generator/Report-Generator/`

## Key Files for Document Mapping Research

### Field Mapping Documentation
- `docs/imported-from-obsidian-reference/Field Map-Master & JobTicket Data.md`
  - Contains complete field mapping from job tickets to report

### Component Structure
- `src/components/job-card/DocumentsSection.tsx`
  - Shows how documents are organized in the app
- `src/components/job-card/property-details/PropertyDetailsForm.tsx`
  - Property data fields that go to report

### Research Files
- `research/pdf-generation/implementation-examples/react-pdf-appraisal-template.md`
  - Template structure for appraisal reports
- `research/pdf-generation/professional-layouts/appraisal-report-standards.md`
  - Standards for report layout

### Document Management
- `src/utils/documentUploadUtils.ts`
- `src/utils/fileUploadUtils.ts`
- `src/integrations/supabase/storage.ts`

## How to Research This Project

### Questions to Ask the Agent:
1. "What images/documents go in each section of the appraisal report?"
2. "How does the Field Map-Master map job ticket fields to report sections?"
3. "What's the structure of the DocumentsSection component?"
4. "Where do property photos vs legal documents go in the report?"
5. "How does the side-by-side viewer work?"

### Key Insights Already Visible:
- Has full document upload and management system
- Includes property details forms
- Has document extraction capabilities
- Built with side-by-side viewer
- Complete field mapping from tickets to reports

## Next Steps:
1. Copy this project to current workspace OR
2. Have an agent analyze it in place
3. Extract the document-to-report mapping
4. Understand the merge document structure
5. Consider using this instead of Word merge docs

## Integration Possibility:
Instead of:
```
APR Hub → Valcre → Word Merge Doc
```

Could be:
```
APR Hub → Report Generator → PDF Output
         ↓
    (Skip Valcre for documents)
```

The Report Generator already knows:
- Where every field goes
- Where every image belongs
- How to format the report
- How to generate the PDF

This could replace both Valcre's merge function AND the Word template!