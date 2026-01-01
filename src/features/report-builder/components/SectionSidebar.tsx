import { useReportBuilderStore } from '../store/reportBuilderStore';

/**
 * Maps approach toggle field IDs to their associated section IDs.
 * When a toggle is disabled (false), all sections in its array are hidden from the sidebar.
 */
const APPROACH_TO_SECTIONS_MAP: Record<string, string[]> = {
  'home-use-income-approach': ['income', 'calc', 'rentroll', 'calc-output', 'hist'],
  'home-use-sales-approach': ['sales', 'rent-analysis'],
  'home-use-cost-approach': ['cost', 'cost-s'],
};

/**
 * Helper function to get a field value from nested sections structure.
 * Searches through all sections and their subsections to find a field by ID.
 */
const getFieldValueFromSections = (
  sections: ReturnType<typeof useReportBuilderStore>['sections'],
  fieldId: string
): unknown => {
  for (const section of sections) {
    // Check top-level fields
    const field = section.fields?.find(f => f.id === fieldId);
    if (field) return field.value;

    // Check subsection fields
    for (const sub of section.subsections || []) {
      const subField = sub.fields?.find(f => f.id === fieldId);
      if (subField) return subField.value;
    }
  }
  return undefined;
};

export default function SectionSidebar() {
  const { sections, activeSection, setActiveSection } = useReportBuilderStore();

  // Filter out S-tabs (client-intake, loe-prep, image-mgt) - these are TDD-only
  // Editor Panel should only show numbered report page tabs
  const filteredSections = sections.filter(section =>
    section.id !== 'client-intake' &&
    section.id !== 'loe-prep' &&
    section.id !== 'image-mgt'
  );

  // Sort sections: 'home' first, then everything else in original order
  const sortedSections = [...filteredSections].sort((a, b) => {
    if (a.id === 'home') return -1;
    if (b.id === 'home') return 1;
    return 0; // Maintain original order for all other sections
  });

  // Build set of section IDs to hide based on disabled approach toggles
  const hiddenSectionIds = new Set<string>();
  for (const [toggleFieldId, sectionIds] of Object.entries(APPROACH_TO_SECTIONS_MAP)) {
    // Default behavior: if toggle value is undefined/null, treat as TRUE (enabled)
    // Only hide sections when toggle is explicitly false
    const toggleValue = getFieldValueFromSections(sections, toggleFieldId);
    const isEnabled = toggleValue !== false;
    if (!isEnabled) {
      sectionIds.forEach(id => hiddenSectionIds.add(id));
    }
  }

  // Filter out sections whose approach is disabled
  const editorSections = sortedSections.filter(section => !hiddenSectionIds.has(section.id));

  return (
    <div className="w-[180px] text-white flex flex-col h-full overflow-y-auto" style={{ backgroundColor: '#2a2a2a' }}>
      {editorSections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className="px-4 py-3 text-left font-semibold text-sm transition-colors border-b"
          style={{
            backgroundColor: activeSection === section.id ? '#333333' : '#2a2a2a',
            borderColor: '#4b5563',
            borderLeft: activeSection === section.id ? '4px solid #ffffff' : 'none',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            if (activeSection !== section.id) {
              e.currentTarget.style.backgroundColor = '#333333';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = activeSection === section.id ? '#333333' : '#2a2a2a';
          }}
        >
          {section.shortName}
        </button>
      ))}
    </div>
  );
}
