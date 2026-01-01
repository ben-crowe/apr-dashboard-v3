import { useReportBuilderStore } from '../store/reportBuilderStore';
import { cn } from '@/lib/utils';

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
  const editorSections = [...filteredSections].sort((a, b) => {
    if (a.id === 'home') return -1;
    if (b.id === 'home') return 1;
    return 0; // Maintain original order for all other sections
  });

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
