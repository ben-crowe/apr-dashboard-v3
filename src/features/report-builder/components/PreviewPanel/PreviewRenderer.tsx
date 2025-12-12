import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';

interface PreviewRendererProps {
  html: string;
  zoom?: number;
}

const PreviewRenderer = forwardRef<HTMLIFrameElement, PreviewRendererProps>(
  ({ html, zoom = 1 }, ref) => {
    const activeSection = useReportBuilderStore((state) => state.activeSection);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State for drag-to-pan functionality
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

    // Expose the iframe ref to parent component
    useImperativeHandle(ref, () => iframeRef.current as HTMLIFrameElement);

    // Update iframe content when HTML changes
    useEffect(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();
        }
      }
    }, [html]);

    // Scroll to active section when it changes
    useEffect(() => {
      if (!activeSection || !iframeRef.current?.contentDocument || !containerRef.current) return;

      // Small delay to ensure content is rendered
      const timeoutId = setTimeout(() => {
        const iframeDoc = iframeRef.current?.contentDocument;
        if (!iframeDoc) return;

        const sectionElement = iframeDoc.getElementById(`section-${activeSection}`);
        if (sectionElement && containerRef.current) {
          // Get the section's position within the iframe content
          const sectionRect = sectionElement.getBoundingClientRect();
          const iframeBody = iframeDoc.body;
          const bodyRect = iframeBody.getBoundingClientRect();

          // Calculate the position relative to the iframe content
          const sectionTop = sectionRect.top - bodyRect.top;

          // Account for zoom and padding (32px = 2rem padding)
          const scrollTarget = (sectionTop * zoom) + 32;

          // Smooth scroll the container
          containerRef.current.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
          });
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    }, [activeSection, zoom]);

    // Mouse handlers for drag-to-pan
    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      if (containerRef.current) {
        setScrollStart({
          x: containerRef.current.scrollLeft,
          y: containerRef.current.scrollTop
        });
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      containerRef.current.scrollLeft = scrollStart.x - dx;
      containerRef.current.scrollTop = scrollStart.y - dy;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    return (
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto"
        style={{
          backgroundColor: '#525659', // Dark grey like Adobe Acrobat
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Inner wrapper with padding and centering - THIS is what gets scaled */}
        <div
          style={{
            padding: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100%',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out',
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
          >
            <iframe
              ref={iframeRef}
              title="Report Preview"
              className="border-0 bg-white shadow-lg"
              style={{
                width: '8.5in', // Fixed page width
                minHeight: '90in', // Tall enough for ~82 pages (79 pages + buffer)
                display: 'block',
              }}
              sandbox="allow-same-origin allow-modals"
            />
          </div>
        </div>
      </div>
    );
  }
);

PreviewRenderer.displayName = 'PreviewRenderer';

export default PreviewRenderer;
