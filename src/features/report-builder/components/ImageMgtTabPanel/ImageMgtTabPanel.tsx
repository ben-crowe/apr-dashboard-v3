/**
 * ImageMgtTabPanel.tsx
 * Renders the Image Management tab in the Report Builder
 * Wraps the standalone ImageConfiguratorDemo component
 */

import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ImageConfiguratorDemo } from '@/features/image-configurator';

export default function ImageMgtTabPanel() {
  const currentJobId = useReportBuilderStore((state) => state.currentJobId);

  // Show placeholder if no job is loaded
  if (!currentJobId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No Job Selected
          </h3>
          <p className="text-sm text-slate-400">
            To use the Image Configurator, please select a job from the Jobs Dashboard
            or load a report with an associated job ID.
          </p>
        </div>
      </div>
    );
  }

  // Render the full Image Configurator with the current job ID
  return (
    <div className="h-full">
      <ImageConfiguratorDemo jobId={currentJobId} className="h-full" />
    </div>
  );
}
