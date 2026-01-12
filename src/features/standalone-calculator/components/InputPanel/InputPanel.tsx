/**
 * Input Panel Component
 * 
 * Container for all input sections (left panel, 40% width)
 */

import { UnitMixSection } from './UnitMixSection';
import { OtherIncomeSection } from './OtherIncomeSection';
import { VacancySection } from './VacancySection';
import { ExpensesSection } from './ExpensesSection';
import { CapRateSection } from './CapRateSection';

export function InputPanel() {
  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Income Approach Inputs</h2>
        
        <UnitMixSection />
        <OtherIncomeSection />
        <VacancySection />
        <ExpensesSection />
        <CapRateSection />
      </div>
    </div>
  );
}
