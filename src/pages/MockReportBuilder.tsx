import { useEffect } from 'react';
import { useReportBuilderStore } from '@/features/report-builder/store/reportBuilderStore';
import ReportBuilderLayout from '@/features/report-builder/components/ReportBuilderLayout';
import { useLoadJobIntoReport } from '@/features/report-builder/hooks/useLoadJobIntoReport';

interface MockReportBuilderProps {
  jobId?: string;
}

export default function MockReportBuilder({ jobId }: MockReportBuilderProps) {
  const sections = useReportBuilderStore((state) => state.sections);
  const initializeMockData = useReportBuilderStore((state) => state.initializeMockData);
  const generatePreview = useReportBuilderStore((state) => state.generatePreview);
  const setCurrentJobId = useReportBuilderStore((state) => state.setCurrentJobId);

  // Use provided jobId or default test ID for Image Configurator
  const effectiveJobId = jobId || 'test-job-001';

  // Hook to load job data into report builder when jobId is provided
  const { isLoading: isLoadingJob, error: jobLoadError } = useLoadJobIntoReport(jobId);

  // Set currentJobId in store when jobId prop is available
  useEffect(() => {
    setCurrentJobId(effectiveJobId);
    // Cleanup on unmount
    return () => {
      setCurrentJobId(null);
    };
  }, [effectiveJobId, setCurrentJobId]);

  useEffect(() => {
    const store = useReportBuilderStore.getState();
    const currentPreviewHtml = store.previewHtml;
    const activeTestMode = store.activeTestMode;

    // If coming from TDD page with previewHtml already set, DON'T clear it
    if (currentPreviewHtml && currentPreviewHtml.length > 1000 && (activeTestMode === 'test-report' || activeTestMode === 'user-input')) {
      console.log('MockReportBuilder: Using previewHtml from TDD page (not clearing)');
      return; // Keep the existing previewHtml
    }

    // Normal flow: clear and regenerate
    console.log('MockReportBuilder: Clearing cached template and previewHtml to force reload...');

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

  // Show loading state while job data is being loaded
  if (jobId && isLoadingJob) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading job data into report builder...</p>
        </div>
      </div>
    );
  }

  // Show error if job loading failed
  if (jobId && jobLoadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading job data:</p>
          <p>{jobLoadError}</p>
        </div>
      </div>
    );
  }

  return <ReportBuilderLayout />;
}
