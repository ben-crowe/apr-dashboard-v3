/**
 * Export Button Component
 * 
 * Downloads current page as HTML file
 */

import { useCalculatorStore } from '../../store/calculatorStore';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

const pageMap = {
  'page-48': {
    filename: 'page-48-direct-capitalization.html',
    title: 'Direct Capitalization',
  },
  'page-49': {
    filename: 'page-49-income-conclusion.html',
    title: 'Income Conclusion',
  },
};

export function ExportButton() {
  const selectedPage = useCalculatorStore((state) => state.selectedPage);

  const handleExport = async () => {
    const page = pageMap[selectedPage];
    
    try {
      // Fetch the page HTML from public folder
      const response = await fetch(`/standalone-calculator-pages/${page.filename}`);
      if (!response.ok) {
        throw new Error('Page not found');
      }
      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      saveAs(blob, page.filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export page. Please try again.');
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Export Pages
    </Button>
  );
}
