import { useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import ReportBuilderLayout from '@/features/report-builder/components/ReportBuilderLayout';

export default function MockReportBuilder() {
  const initializeMockData = useReportBuilderStore((state) => state.initializeMockData);

  useEffect(() => {
    // Initialize with mock data on mount
    initializeMockData();
  }, [initializeMockData]);

  return <ReportBuilderLayout />;
}
