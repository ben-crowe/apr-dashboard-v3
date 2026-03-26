import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Return type for the useAsyncSuggestions hook.
 * Generic type T represents the shape of each suggestion item.
 */
export interface UseAsyncSuggestionsReturn<T> {
  /** Current list of fetched suggestions */
  suggestions: T[];
  /** Whether a fetch is currently in progress */
  isLoading: boolean;
  /** Error from the most recent fetch attempt, or null */
  error: Error | null;
  /** Trigger a new suggestions fetch for the given query */
  fetchSuggestions: (query: string) => void;
  /** Clear all suggestions and reset state */
  clearSuggestions: () => void;
}

/**
 * Hook for fetching async suggestions with built-in debouncing and
 * request cancellation via AbortController.
 *
 * Prevents race conditions from rapid typing by aborting in-flight
 * requests when a new query arrives before the previous one resolves.
 *
 * @param fetchFn - Async function that receives a query string and AbortSignal,
 *                  and returns an array of suggestions of type T.
 * @param debounceMs - Milliseconds to debounce before triggering a fetch.
 *                     Defaults to 300ms.
 *
 * @example
 * ```tsx
 * const { suggestions, isLoading, fetchSuggestions } = useAsyncSuggestions<User>(
 *   async (query, signal) => {
 *     const res = await fetch(`/api/users?q=${query}`, { signal });
 *     return res.json();
 *   },
 *   250
 * );
 * ```
 */
export function useAsyncSuggestions<T>(
  fetchFn: (query: string, signal: AbortSignal) => Promise<T[]>,
  debounceMs: number = 300
): UseAsyncSuggestionsReturn<T> {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Ref to hold the current AbortController so we can cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Ref to hold the debounce timer so we can clear it on new input
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Clears all suggestions, cancels any pending fetch, and resets error state.
   */
  const clearSuggestions = useCallback(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSuggestions([]);
    setIsLoading(false);
    setError(null);
  }, []);

  /**
   * Triggers an async fetch for suggestions after the debounce period.
   * If called again before the debounce fires, the previous timer is cleared.
   * If a fetch is already in-flight, it is aborted via AbortController before
   * starting a new one, preventing stale responses from overwriting fresh data.
   */
  const fetchSuggestions = useCallback(
    (query: string) => {
      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // If query is empty, clear everything immediately (no debounce needed)
      if (!query.trim()) {
        clearSuggestions();
        return;
      }

      // Show loading immediately for responsive UI feedback
      setIsLoading(true);
      setError(null);

      debounceTimerRef.current = setTimeout(async () => {
        // Abort any previous in-flight request to prevent race conditions
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a fresh AbortController for this request
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
          const results = await fetchFn(query, controller.signal);

          // Only update state if this request was NOT aborted.
          // A newer request may have superseded this one while it was in flight.
          if (!controller.signal.aborted) {
            setSuggestions(results);
            setIsLoading(false);
            setError(null);
          }
        } catch (err) {
          // Silently ignore AbortError -- this is expected when cancelling stale requests
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          // Only update error state if this request was not aborted
          if (!controller.signal.aborted) {
            setError(
              err instanceof Error ? err : new Error("Failed to fetch suggestions")
            );
            setSuggestions([]);
            setIsLoading(false);
          }
        }
      }, debounceMs);
    },
    [fetchFn, debounceMs, clearSuggestions]
  );

  // Cleanup on unmount: abort any in-flight request and clear debounce timer
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    clearSuggestions,
  };
}
