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
  const sections = useReportBuilderStore((state) => state.sections);
  const generatePreview = useReportBuilderStore(
    (state) => state.generatePreview,
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Memoized helper to get field value from sections
  const getFieldValue = useCallback(
    (fieldId: string): unknown => {
      return getFieldValueFromSections(sections, fieldId);
    },
    [sections],
  );

  // Calculate excluded pages based on approach toggles
  const excludedPages = useMemo(() => {
    return getExcludedPageNumbers(sections);
  }, [sections]);

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

      // Handle toggle based on test mode
      // In test-report mode: disable toggle (always show calculated report)
      // In designer mode: enable toggle (user can switch between sample data and full test data)
      const toggle = iframeDoc.getElementById(
        "preview-toggle",
      ) as HTMLInputElement;
      const modeLabel = iframeDoc.getElementById("mode-label");
      if (toggle) {
        if (activeTestMode === "test-report") {
          // Disable toggle in test-report mode - always show interpolated values
          toggle.disabled = true;
          toggle.checked = true; // Always show interpolated values (real data)
          pagesWrapper.classList.add("preview-mode");
          if (modeLabel)
            modeLabel.textContent = "Preview Mode (Test Report Active)";
          toggle.style.opacity = "0.5";
          toggle.style.cursor = "not-allowed";
        } else {
          // Enable toggle in all other modes (user-input, designer, none)
          toggle.disabled = false;
          toggle.style.opacity = "1";
          toggle.style.cursor = "pointer";

          // For user-input mode: Default to ON (show real interpolated data)
          // For other modes: Check saved state or default to ON
          const savedToggleState = sessionStorage.getItem(
            "preview-toggle-state",
          );
          const shouldBeOn =
            activeTestMode === "user-input"
              ? true // Always default to ON for user-input (real data)
              : savedToggleState !== null
                ? savedToggleState === "true"
                : true;

          // Initialize toggle state and trigger handler to set up data-original
          if (toggle.checked !== shouldBeOn) {
            toggle.checked = shouldBeOn;
          }

          // IMPORTANT: When HTML is first interpolated, textContent contains real values
          // We need to ensure data-original is set BEFORE toggle runs
          const fields = iframeDoc.querySelectorAll(".field-mapped");
          fields.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            // Store current interpolated value as original (if not already stored)
            if (!htmlEl.dataset.original && htmlEl.textContent) {
              htmlEl.dataset.original = htmlEl.textContent;
            }
          });

          // Now trigger toggle handler to set correct display state
          if (shouldBeOn) {
            pagesWrapper.classList.add("preview-mode");
            // Toggle ON = Show interpolated values (already in textContent, restore from data-original if needed)
            fields.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              if (htmlEl.dataset.original) {
                htmlEl.textContent = htmlEl.dataset.original;
              }
            });
          } else {
            pagesWrapper.classList.remove("preview-mode");
            // Toggle OFF = Show sample data
            fields.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              const sample = htmlEl.getAttribute("data-sample");
              if (sample) {
                if (!htmlEl.dataset.original) {
                  htmlEl.dataset.original = htmlEl.textContent || "";
                }
                htmlEl.textContent = sample;
              }
            });
          }

          if (modeLabel) {
            modeLabel.textContent = toggle.checked
              ? activeTestMode === "user-input"
                ? "Preview Mode (Real Data)"
                : "Preview Mode"
              : "Designer Mode (Sample Data)";
          }

          // Save toggle state to sessionStorage when user manually changes it
          const toggleHandler = function () {
            sessionStorage.setItem(
              "preview-toggle-state",
              String(this.checked),
            );
          };
          toggle.removeEventListener("change", toggleHandler); // Remove if exists
          toggle.addEventListener("change", toggleHandler);
        }
      }

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
  }, [previewHtml, activeTestMode, excludedPages]);

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
