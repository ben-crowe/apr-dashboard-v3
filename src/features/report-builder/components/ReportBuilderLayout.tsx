import { useNavigate } from 'react-router-dom';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useReportBuilderStore } from '../store/reportBuilderStore';
import EditPanel from './EditPanel/EditPanel';
import PreviewPanel from './PreviewPanel/PreviewPanel';
import SectionSidebar from './SectionSidebar';

export default function ReportBuilderLayout() {
  const navigate = useNavigate();
  const showRawIds = useReportBuilderStore((state) => state.showRawIds);
  const setShowRawIds = useReportBuilderStore((state) => state.setShowRawIds);
  const activeTestMode = useReportBuilderStore((state) => state.activeTestMode);
  const activeSection = useReportBuilderStore((state) => state.activeSection);

  // Use wider editor panel (75%) for Image Configurator section
  const isImageMgtSection = activeSection === 'image-mgt';
  const editPanelSize = isImageMgtSection ? 75 : 60;
  const previewPanelSize = isImageMgtSection ? 25 : 40;

  // Note: Test data is loaded from TDD page (/test-input), not from Report Builder
  // The store persists data across navigation

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Navigation Header */}
      <div className="text-white px-4 py-2 flex items-center justify-between shrink-0 border-b" style={{ backgroundColor: '#1f1f1f', borderColor: '#4b5563' }}>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/test-input')}
            variant="ghost"
            size="sm"
            className="gap-2 text-white hover:!bg-[#2a2a2a] hover:!text-white"
            style={{ backgroundColor: 'transparent', color: '#ffffff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to TDD
          </Button>
          <span style={{ color: '#9ca3af' }}>|</span>
          <span className="font-semibold">Report Builder</span>
        </div>
        
        {/* Toggle Switch - OFF=Raw IDs, ON=Test Data */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">
            {showRawIds ? (activeTestMode === 'user-input' ? 'User Flow Test' : activeTestMode === 'test-report' ? 'Template Test' : 'Preview Mode') : 'Raw IDs'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showRawIds}
              onChange={(e) => {
                console.log('Toggle clicked, new value:', e.target.checked);
                setShowRawIds(e.target.checked);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <SectionSidebar />

      <ResizablePanelGroup
        key={isImageMgtSection ? 'image-mgt' : 'default'}
        direction="horizontal"
        className="flex-1"
      >
        <ResizablePanel
          defaultSize={editPanelSize}
          minSize={isImageMgtSection ? 60 : 50}
        >
          <EditPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={previewPanelSize}
          maxSize={isImageMgtSection ? 40 : 50}
        >
          <PreviewPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </div>
  );
}
