import { useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import ReportBuilderLayout from '@/features/report-builder/components/ReportBuilderLayout';

export default function MockReportBuilder() {
  const sections = useReportBuilderStore((state) => state.sections);
  const initializeMockData = useReportBuilderStore((state) => state.initializeMockData);

  useEffect(() => {
    // Only initialize if store is empty (preserves data from Test Input Dashboard)
    if (sections.length === 0) {
      console.log('MockReportBuilder: Store empty, initializing with mock data...');
      initializeMockData();
    } else {
      console.log('MockReportBuilder: Store already has data, skipping initialization');
    }
  }, [sections.length, initializeMockData]);

  return <ReportBuilderLayout />;
}
