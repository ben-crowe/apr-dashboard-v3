import { useReportBuilderStore } from '../store/reportBuilderStore';

/**
 * Maps approach toggle field IDs to their associated section IDs.
 * When a toggle is disabled (false), all sections in its array are dimmed in the sidebar.
 */
const APPROACH_TO_SECTIONS_MAP: Record<string, string[]> = {
  'home-use-income-approach': ['income'],
  'home-use-sales-approach': ['sales'],
  'home-use-cost-approach': ['cost-s'],
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

  // Only show main data entry tabs - consolidated approach tabs with tables
  // Hidden: TDD-only tabs, redundant tabs (calc moved to approach tabs), template-driven pages
  const VISIBLE_SECTION_IDS = new Set([
    'home',       // Central data hub
    'site',       // Site details
    'impv',       // Improvements/building
    'image-mgt',  // All images consolidated
    'income',     // Income approach (inputs + table)
    'sales',      // Sales comparison (inputs + table)
    'cost-s',     // Cost approach (inputs + table)
    'recon',      // Reconciliation
  ]);

  const filteredSections = sections.filter(section =>
    VISIBLE_SECTION_IDS.has(section.id)
  );

  // Sort sections: 'home' first, then everything else in original order
  const sortedSections = [...filteredSections].sort((a, b) => {
    if (a.id === 'home') return -1;
    if (b.id === 'home') return 1;
    return 0; // Maintain original order for all other sections
  });

  // Build set of section IDs that are DISABLED (dimmed, not hidden)
  const disabledSectionIds = new Set<string>();
  for (const [toggleFieldId, sectionIds] of Object.entries(APPROACH_TO_SECTIONS_MAP)) {
    // Default behavior: if toggle value is undefined/null, treat as TRUE (enabled)
    // Only disable sections when toggle is explicitly false
    const toggleValue = getFieldValueFromSections(sections, toggleFieldId);
    const isEnabled = toggleValue !== false;
    if (!isEnabled) {
      sectionIds.forEach(id => disabledSectionIds.add(id));
    }
  }

  // Keep ALL sections visible (don't filter) - disabled ones will be dimmed
  const editorSections = sortedSections;

  return (
    <div className="w-[180px] text-white flex flex-col h-full overflow-y-auto" style={{ backgroundColor: '#2a2a2a' }}>
      {editorSections.map((section) => {
        const isDisabled = disabledSectionIds.has(section.id);

        return (
          <button
            key={section.id}
            onClick={() => !isDisabled && setActiveSection(section.id)}
            disabled={isDisabled}
            className="px-4 py-3 text-left font-semibold text-sm transition-colors border-b"
            style={{
              backgroundColor: activeSection === section.id ? '#333333' : '#2a2a2a',
              borderColor: '#4b5563',
              borderLeft: activeSection === section.id ? '4px solid #ffffff' : 'none',
              color: isDisabled ? '#666666' : '#ffffff',
              opacity: isDisabled ? 0.5 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isDisabled && activeSection !== section.id) {
                e.currentTarget.style.backgroundColor = '#333333';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = activeSection === section.id ? '#333333' : '#2a2a2a';
            }}
          >
            {section.shortName}
          </button>
        );
      })}
    </div>
  );
}
