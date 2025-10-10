// Shared styles for consistent section headers across all dashboard sections
export const sectionNumberStyle = "flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center";
export const sectionNumberTextStyle = "text-sm font-semibold text-blue-700 dark:text-blue-400";
export const sectionTitleStyle = "text-base font-semibold text-gray-900 dark:text-gray-100";
export const sectionTriggerStyle = "hover:no-underline py-4";
export const sectionContentStyle = "pt-1 pb-6";
export const sectionContentWrapperStyle = "bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-6";

// Consistent subheading style for all sections
export const subheadingStyle = "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700";

// Field group container style
export const fieldGroupStyle = "bg-white dark:bg-gray-800/50 rounded-md p-4 border border-gray-200 dark:border-gray-700";

export const SectionNumber = ({ number }: { number: string }) => (
  <div className={sectionNumberStyle}>
    <span className={sectionNumberTextStyle}>{number}</span>
  </div>
);

export const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-3">
    <SectionNumber number={number} />
    <h3 className={sectionTitleStyle}>{title}</h3>
  </div>
);