import { useReportBuilderStore } from '../store/reportBuilderStore';
import { cn } from '@/lib/utils';

export default function SectionSidebar() {
  const { sections, activeSection, setActiveSection } = useReportBuilderStore();

  return (
    <div className="w-[180px] bg-[#1a365d] text-white flex flex-col h-full overflow-y-auto">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={cn(
            'px-4 py-3 text-left font-semibold text-sm hover:bg-[#2d4a7c] transition-colors border-b border-[#2d4a7c]',
            activeSection === section.id && 'bg-[#3b5998] border-l-4 border-l-white'
          )}
        >
          {section.shortName}
        </button>
      ))}
    </div>
  );
}
