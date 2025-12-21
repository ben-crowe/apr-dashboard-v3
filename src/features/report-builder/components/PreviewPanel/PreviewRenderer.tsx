import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useReportBuilderStore } from '../../store/reportBuilderStore';

interface PreviewRendererProps {
  html: string;
  zoom?: number;
  onZoomChange?: (newZoom: number) => void;
}

const PreviewRenderer = forwardRef<HTMLIFrameElement, PreviewRendererProps>(
  ({ html, zoom = 1, onZoomChange }, ref) => {
    const activeSection = useReportBuilderStore((state) => state.activeSection);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const minZoom = 0.1;
    const maxZoom = 1.5;

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

    // Pinch-to-zoom on trackpad - cross-browser support
    useEffect(() => {
      const container = containerRef.current;
      if (!container || !onZoomChange) return;

      const handleWheel = (e: WheelEvent) => {
        // Chrome/Firefox: Pinch gestures automatically set ctrlKey to true
        if (e.ctrlKey) {
          e.preventDefault();

          // deltaY > 0 means pinching in (zoom out)
          // deltaY < 0 means pinching out (zoom in)
          const zoomDelta = e.deltaY > 0 ? -0.025 : 0.025;
          const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + zoomDelta));
          onZoomChange(newZoom);
        }
      };

      // Safari-specific gesture events (WebKit)
      let lastScale = 1;

      const handleGestureStart = (e: Event) => {
        e.preventDefault();
        lastScale = 1;
      };

      const handleGestureChange = (e: Event) => {
        e.preventDefault();
        const gestureEvent = e as any; // GestureEvent is WebKit-specific

        if (gestureEvent.scale && gestureEvent.scale !== lastScale) {
          const scaleDiff = gestureEvent.scale - lastScale;
          const zoomDelta = scaleDiff * 0.5; // Adjust sensitivity
          const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + zoomDelta));
          onZoomChange(newZoom);
          lastScale = gestureEvent.scale;
        }
      };

      const handleGestureEnd = (e: Event) => {
        e.preventDefault();
        lastScale = 1;
      };

      // Add event listeners with passive: false to allow preventDefault
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('gesturestart', handleGestureStart, { passive: false });
      container.addEventListener('gesturechange', handleGestureChange, { passive: false });
      container.addEventListener('gestureend', handleGestureEnd, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('gesturestart', handleGestureStart);
        container.removeEventListener('gesturechange', handleGestureChange);
        container.removeEventListener('gestureend', handleGestureEnd);
      };
    }, [zoom, onZoomChange, minZoom, maxZoom]);

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
              transform: `scale(${zoom * 0.85})`,
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
                width: '100%', // Responsive to container width
                maxWidth: '8.5in', // Don't exceed actual page width
                minHeight: '1000in', // Tall enough for 90+ pages (11in each + gaps)
                height: 'auto', // Expands to fit content
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
