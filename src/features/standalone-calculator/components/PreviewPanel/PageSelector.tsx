/**
 * Page Selector Component
 * 
 * Dropdown to select between Page 48 (Direct Capitalization) and Page 49 (Income Conclusion)
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const pages = [
  { value: 'page-48', label: 'Direct Capitalization' },
  { value: 'page-49', label: 'Income Conclusion' },
] as const;

export function PageSelector() {
  const selectedPage = useCalculatorStore((state) => state.selectedPage);
  const setSelectedPage = useCalculatorStore((state) => state.setSelectedPage);

  return (
    <Select
      value={selectedPage}
      onValueChange={(value) => setSelectedPage(value as 'page-48' | 'page-49')}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select page" />
      </SelectTrigger>
      <SelectContent>
        {pages.map((page) => (
          <SelectItem key={page.value} value={page.value}>
            {page.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
