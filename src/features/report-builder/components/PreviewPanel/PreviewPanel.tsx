import { useEffect, useRef, useMemo, useCallback } from "react";
import { useReportBuilderStore } from "../../store/reportBuilderStore";
import { ReportSection } from "../../types/reportBuilder.types";

/**
 * Maps approach toggle field names to their corresponding page ranges.
 * When a toggle is disabled (false), pages in that range are hidden from preview.
 */
const APPROACH_TO_PAGES_MAP: Record<string, { start: number; end: number }> = {
  "home-use-income-approach": { start: 37, end: 51 },
  "home-use-sales-approach": { start: 56, end: 61 },
  "home-use-cost-approach": { start: 52, end: 55 },
};

/**
 * Helper function to find a field value from the sections array.
 * Searches through all sections and their subsections.
 */
function getFieldValueFromSections(
  sections: ReportSection[],
  fieldId: string,
): unknown {
  for (const section of sections) {
    // Check top-level fields
    const field = section.fields?.find((f) => f.id === fieldId);
    if (field) return field.value;

    // Check subsection fields
    for (const sub of section.subsections || []) {
      const subField = sub.fields?.find((f) => f.id === fieldId);
      if (subField) return subField.value;
    }
  }
  return undefined;
}

/**
 * Determines which page numbers should be excluded based on disabled approach toggles.
 * If a toggle value is undefined/null, it defaults to TRUE (pages shown).
 */
function getExcludedPageNumbers(sections: ReportSection[]): Set<number> {
  const excludedPages = new Set<number>();

  for (const [fieldName, pageRange] of Object.entries(APPROACH_TO_PAGES_MAP)) {
    const fieldValue = getFieldValueFromSections(sections, fieldName);
    // Default to enabled (true) if field value is undefined/null
    // Only exclude pages if explicitly set to false
    const isEnabled = fieldValue !== false;

    if (!isEnabled) {
      // Add all pages in this range to the excluded set
      for (let pageNum = pageRange.start; pageNum <= pageRange.end; pageNum++) {
        excludedPages.add(pageNum);
      }
    }
  }

  return excludedPages;
}

export default function PreviewPanel() {
  const previewHtml = useReportBuilderStore((state) => state.previewHtml);
  const activeTestMode = useReportBuilderStore((state) => state.activeTestMode);
  const showRawIds = useReportBuilderStore((state) => state.showRawIds);
  const sections = useReportBuilderStore((state) => state.sections);
  const generatePreview = useReportBuilderStore(
    (state) => state.generatePreview,
  );
  const scrollToReportPage = useReportBuilderStore((state) => state.scrollToReportPage);
  const setScrollToReportPage = useReportBuilderStore((state) => state.setScrollToReportPage);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Memoized helper to get field value from sections
  const getFieldValue = useCallback(
    (fieldId: string): unknown => {
      return getFieldValueFromSections(sections, fieldId);
    },
    [sections],
  );

  // Calculate excluded pages based on approach toggles
  // STABILIZED: Only update reference when actual page numbers change
  // This prevents re-injection on every field edit
  const excludedPagesRef = useRef<Set<number>>(new Set());
  const excludedPagesKey = useRef<string>("");

  const excludedPages = useMemo(() => {
    const newExcluded = getExcludedPageNumbers(sections);
    const newKey = Array.from(newExcluded).sort((a, b) => a - b).join(",");

    // Only return new Set if actual values changed
    if (newKey !== excludedPagesKey.current) {
      excludedPagesKey.current = newKey;
      excludedPagesRef.current = newExcluded;
      console.log("PreviewPanel: excludedPages changed to:", newKey || "(none)");
    }

    return excludedPagesRef.current;
  }, [sections]);

  // Scroll to specific page when triggered from Image Configurator
  useEffect(() => {
    if (scrollToReportPage === null || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Find the page with matching data-page-num
    const targetPage = iframeDoc.querySelector(
      `[data-page-num="Page ${scrollToReportPage}"]`
    );

    if (targetPage) {
      // Scroll the page into view within the iframe
      targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      console.log(`PreviewPanel: Scrolled to Page ${scrollToReportPage}`);
    } else {
      console.warn(`PreviewPanel: Page ${scrollToReportPage} not found in preview`);
    }

    // Clear the scroll target after scrolling
    setScrollToReportPage(null);
  }, [scrollToReportPage, setScrollToReportPage]);

  // Auto-load template when component mounts if previewHtml is empty
  useEffect(() => {
    if (!previewHtml && sections.length > 0) {
      console.log(
        "PreviewPanel: No previewHtml found, auto-loading template...",
      );
      generatePreview();
      console.log("PreviewPanel: Template auto-load triggered");
    }
  }, [previewHtml, sections.length, generatePreview]);

  // Inject the report pages into the standalone viewer when HTML changes
  useEffect(() => {
    if (!previewHtml || !iframeRef.current) return;

    const iframe = iframeRef.current;

    // Wait for iframe to load with retry logic
    const handleLoad = () => {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        console.warn("PreviewPanel: iframe document not accessible");
        return;
      }

      // Find the pages wrapper in the standalone viewer (with retry)
      let pagesWrapper = iframeDoc.getElementById("pages-wrapper");
      if (!pagesWrapper) {
        // Retry after a short delay - iframe might still be loading
        setTimeout(() => {
          pagesWrapper = iframeDoc.getElementById("pages-wrapper");
          if (!pagesWrapper) {
            console.error(
              "pages-wrapper not found in Report-MF-template.html after retry",
            );
            return;
          }
          injectPages(pagesWrapper, iframeDoc);
        }, 500);
        return;
      }

      injectPages(pagesWrapper, iframeDoc);
    };

    const injectPages = (pagesWrapper: HTMLElement, iframeDoc: Document) => {
      // Extract just the page-sheet divs from the template HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = previewHtml;
      const allPageSheets = tempDiv.querySelectorAll(".page-sheet");

      if (allPageSheets.length === 0) {
        console.warn(
          "PreviewPanel: No .page-sheet elements found in previewHtml",
        );
        return;
      }

      // Filter pages based on approach toggles
      const filteredPageSheets: Element[] = [];
      allPageSheets.forEach((page) => {
        const pageNumAttr = page.getAttribute("data-page-num");
        if (pageNumAttr) {
          const pageNum = parseInt(pageNumAttr, 10);
          if (!excludedPages.has(pageNum)) {
            filteredPageSheets.push(page);
          }
        } else {
          // Pages without data-page-num are always included
          filteredPageSheets.push(page);
        }
      });

      // Log filtering info if pages were excluded
      if (excludedPages.size > 0) {
        const excludedArray = Array.from(excludedPages).sort((a, b) => a - b);
        console.log(
          `PreviewPanel: Excluding pages due to disabled approaches: [${excludedArray.join(", ")}]`,
        );
        console.log(
          `PreviewPanel: Filtered from ${allPageSheets.length} to ${filteredPageSheets.length} pages`,
        );
      }

      // Clear wrapper and inject filtered pages
      pagesWrapper.innerHTML = "";
      filteredPageSheets.forEach((page) => {
        pagesWrapper.appendChild(page.cloneNode(true));
      });

      console.log(
        `PreviewPanel: Injected ${filteredPageSheets.length} pages. First page: ${filteredPageSheets[0]?.getAttribute("data-page-num")}, Last page: ${filteredPageSheets[filteredPageSheets.length - 1]?.getAttribute("data-page-num")}`,
      );

      // Trigger page count update AFTER pages are injected
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        const iframeWindow = iframe.contentWindow as Window & {
          updatePageCount?: () => void;
        };
        if (
          iframeWindow &&
          typeof iframeWindow.updatePageCount === "function"
        ) {
          iframeWindow.updatePageCount();
          console.log("PreviewPanel: Called updatePageCount()");
        } else {
          console.warn(
            "PreviewPanel: updatePageCount function not found in iframe",
          );
        }
      }, 100);

      // Pass activeTestMode to template via data attribute
      pagesWrapper.setAttribute("data-test-mode", activeTestMode);

      // Hide the toggle in the iframe (we control it from parent header)
      const toggle = iframeDoc.getElementById("preview-toggle") as HTMLInputElement;
      const modeLabel = iframeDoc.getElementById("mode-label");
      const toggleLabel = iframeDoc.querySelector(".toggle-label") as HTMLElement;
      
      if (toggle) {
        toggle.style.display = "none";
        toggle.style.visibility = "hidden";
        toggle.style.opacity = "0";
        toggle.style.pointerEvents = "none";
      }
      if (modeLabel) {
        modeLabel.style.display = "none";
        modeLabel.style.visibility = "hidden";
      }
      if (toggleLabel) {
        toggleLabel.style.display = "none";
        toggleLabel.style.visibility = "hidden";
      }

      // Store interpolated values in data-original for all fields (for populated class tracking)
      const fields = pagesWrapper.querySelectorAll(".field-mapped");
      fields.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        if (!htmlEl.dataset.original && htmlEl.textContent) {
          htmlEl.dataset.original = htmlEl.textContent;
        }
      });

      // Sync initial toggle state to iframe via postMessage
      // Template's toggle handler manages display (Dev Mode vs User Ready Mode)
      iframe.contentWindow?.postMessage(
        { type: 'TOGGLE_MODE', checked: showRawIds },
        '*'
      );

      console.log(
        `PreviewPanel: Injected ${filteredPageSheets.length} pages into preview`,
      );
    };

    // Try immediate injection if iframe is already loaded
    if (iframe.contentDocument?.readyState === "complete") {
      console.log("PreviewPanel: iframe already loaded, injecting immediately");
      handleLoad();
    } else {
      console.log("PreviewPanel: waiting for iframe load event");
      iframe.addEventListener("load", handleLoad);
      return () => iframe.removeEventListener("load", handleLoad);
    }

    // ADDITIONAL FIX: Force injection after short delay if iframe is stuck
    // This handles edge cases where readyState check fails
    const forceInjectTimeout = setTimeout(() => {
      if (iframe.contentDocument?.getElementById("pages-wrapper")) {
        console.log("PreviewPanel: Force-injecting after 300ms delay");
        handleLoad();
      }
    }, 300);

    return () => {
      clearTimeout(forceInjectTimeout);
      iframe.removeEventListener("load", handleLoad);
    };
  }, [previewHtml, activeTestMode, excludedPages, showRawIds]);

  // Sync toggle state to iframe via postMessage (template handles display logic)
  useEffect(() => {
    if (!iframeRef.current || !previewHtml) return;

    const iframe = iframeRef.current;

    // Let template's toggle handler manage field display
    // showRawIds: false = Dev Mode ({{field-id}}), true = User Ready Mode (data-sample)
    iframe.contentWindow?.postMessage(
      { type: 'TOGGLE_MODE', checked: showRawIds },
      '*'
    );
  }, [showRawIds, previewHtml]);

  return (
    <div className="h-full w-full">
      {previewHtml ? (
        <iframe
          ref={iframeRef}
          src="/Report-MF-template.html"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          title="Report Preview"
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      )}
    </div>
  );
}
