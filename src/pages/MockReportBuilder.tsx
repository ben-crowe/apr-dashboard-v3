import { useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import ReportBuilderLayout from '@/features/report-builder/components/ReportBuilderLayout';

export default function MockReportBuilder() {
  const sections = useReportBuilderStore((state) => state.sections);
  const initializeMockData = useReportBuilderStore((state) => state.initializeMockData);
  const generatePreview = useReportBuilderStore((state) => state.generatePreview);

  useEffect(() => {
    // ALWAYS clear cached template AND previewHtml FIRST to force reload of latest version
    console.log('MockReportBuilder: Clearing cached template and previewHtml to force reload...');
    const store = useReportBuilderStore.getState();
    
    // Clear cache immediately
    useReportBuilderStore.setState({ 
      previewTemplate: '' as any,
      previewHtml: ''
    });
    
    // Wait a tick to ensure cache is cleared, then initialize
    setTimeout(() => {
      // Only initialize if store is empty (preserves data from Test Input Dashboard)
      const currentSections = useReportBuilderStore.getState().sections;
      if (currentSections.length === 0) {
        console.log('MockReportBuilder: Store empty, initializing with mock data...');
        initializeMockData();
      } else {
        console.log('MockReportBuilder: Store already has data, regenerating preview with fresh template...');
        // Regenerate preview with fresh template
        generatePreview();
      }
    }, 100);
  }, []); // Run once on mount only

  return <ReportBuilderLayout />;
}
