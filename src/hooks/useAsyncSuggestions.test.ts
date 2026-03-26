import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsyncSuggestions } from "./useAsyncSuggestions";

// ---- Test Types ----

interface TestSuggestion {
  id: number;
  label: string;
}

// ---- Helpers ----

/** Creates a mock fetch function that resolves after a given delay. */
function createMockFetch(
  data: TestSuggestion[],
  delay: number = 50
): (query: string, signal: AbortSignal) => Promise<TestSuggestion[]> {
  return vi.fn(
    (_query: string, signal: AbortSignal) =>
      new Promise<TestSuggestion[]>((resolve, reject) => {
        const timer = setTimeout(() => {
          if (signal.aborted) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
          }
          resolve(data);
        }, delay);

        // If the signal is aborted while waiting, clear the timer and reject
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        });
      })
  );
}

/** Creates a mock fetch function that rejects with an error after a given delay. */
function createFailingFetch(
  errorMessage: string,
  delay: number = 50
): (query: string, signal: AbortSignal) => Promise<TestSuggestion[]> {
  return vi.fn(
    (_query: string, signal: AbortSignal) =>
      new Promise<TestSuggestion[]>((_, reject) => {
        const timer = setTimeout(() => {
          if (signal.aborted) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
          }
          reject(new Error(errorMessage));
        }, delay);

        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        });
      })
  );
}

// ---- Tests ----

describe("useAsyncSuggestions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial state with empty suggestions and no loading/error", () => {
    const mockFetch = createMockFetch([]);
    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 300)
    );

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("fetches suggestions after debounce period", async () => {
    const mockData: TestSuggestion[] = [
      { id: 1, label: "Apple" },
      { id: 2, label: "Apricot" },
    ];
    const mockFetch = createMockFetch(mockData, 10);

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 300)
    );

    // Trigger fetch
    act(() => {
      result.current.fetchSuggestions("ap");
    });

    // Should show loading immediately
    expect(result.current.isLoading).toBe(true);

    // Fetch should NOT have been called yet (debounce hasn't elapsed)
    expect(mockFetch).not.toHaveBeenCalled();

    // Advance past debounce period
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Fetch should now have been called
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("ap", expect.any(AbortSignal));

    // Advance past the mock fetch delay
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Suggestions should be populated, loading should be false
    expect(result.current.suggestions).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("shows loading state during fetch", async () => {
    const mockFetch = createMockFetch([{ id: 1, label: "Test" }], 100);

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 100)
    );

    // Initially not loading
    expect(result.current.isLoading).toBe(false);

    // Trigger fetch
    act(() => {
      result.current.fetchSuggestions("test");
    });

    // Should immediately show loading
    expect(result.current.isLoading).toBe(true);

    // Advance past debounce, fetch is now in-flight
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Still loading while fetch is in-flight
    expect(result.current.isLoading).toBe(true);

    // Advance past fetch delay
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Loading should be done
    expect(result.current.isLoading).toBe(false);
  });

  it("handles fetch errors gracefully", async () => {
    const mockFetch = createFailingFetch("Network error", 10);

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 100)
    );

    act(() => {
      result.current.fetchSuggestions("fail");
    });

    // Advance past debounce + fetch delay
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Should have error, no suggestions, not loading
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("cancels stale requests when rapid typing occurs (race condition prevention)", async () => {
    let callCount = 0;
    const mockFetch = vi.fn(
      (query: string, signal: AbortSignal) =>
        new Promise<TestSuggestion[]>((resolve, reject) => {
          callCount++;
          const currentCall = callCount;
          const timer = setTimeout(() => {
            if (signal.aborted) {
              reject(new DOMException("Aborted", "AbortError"));
              return;
            }
            // Each call returns data tagged with its query
            resolve([{ id: currentCall, label: `Result for: ${query}` }]);
          }, 50);

          signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 100)
    );

    // Type "a" then quickly type "ab" before debounce fires
    act(() => {
      result.current.fetchSuggestions("a");
    });

    // Advance 50ms (half the debounce), then type more
    act(() => {
      vi.advanceTimersByTime(50);
    });

    act(() => {
      result.current.fetchSuggestions("ab");
    });

    // Advance past second debounce (100ms from "ab")
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Only the second fetch should have fired (first debounce was cancelled)
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("ab", expect.any(AbortSignal));

    // Resolve the fetch
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    // Should show results for the latest query only
    expect(result.current.suggestions).toEqual([
      { id: 1, label: "Result for: ab" },
    ]);
  });

  it("aborts in-flight request when a new fetch starts", async () => {
    const slowFetch = vi.fn(
      (query: string, signal: AbortSignal) =>
        new Promise<TestSuggestion[]>((resolve, reject) => {
          const timer = setTimeout(() => {
            if (signal.aborted) {
              reject(new DOMException("Aborted", "AbortError"));
              return;
            }
            resolve([{ id: 1, label: `Result: ${query}` }]);
          }, 200); // Slow fetch: 200ms

          signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(slowFetch, 50)
    );

    // Start first fetch
    act(() => {
      result.current.fetchSuggestions("first");
    });

    // Let debounce fire, starting the in-flight request
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(slowFetch).toHaveBeenCalledTimes(1);

    // While first fetch is in-flight (200ms), trigger a second fetch
    act(() => {
      result.current.fetchSuggestions("second");
    });

    // Let second debounce fire
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    // Second fetch should have been called, first should have been aborted
    expect(slowFetch).toHaveBeenCalledTimes(2);

    // Let the second fetch resolve
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // Only the second result should appear (first was aborted)
    expect(result.current.suggestions).toEqual([
      { id: 1, label: "Result: second" },
    ]);
    expect(result.current.isLoading).toBe(false);
  });

  it("clears suggestions when query is empty", async () => {
    const mockData: TestSuggestion[] = [{ id: 1, label: "Test" }];
    const mockFetch = createMockFetch(mockData, 10);

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 100)
    );

    // First, populate suggestions
    act(() => {
      result.current.fetchSuggestions("test");
    });
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    expect(result.current.suggestions).toEqual(mockData);

    // Now send empty query
    act(() => {
      result.current.fetchSuggestions("");
    });

    // Should clear immediately without debounce
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("clears suggestions when query is whitespace-only", () => {
    const mockFetch = createMockFetch([]);
    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 100)
    );

    act(() => {
      result.current.fetchSuggestions("   ");
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("clearSuggestions resets all state and cancels pending operations", async () => {
    const mockFetch = createMockFetch([{ id: 1, label: "Test" }], 100);

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 50)
    );

    // Start a fetch
    act(() => {
      result.current.fetchSuggestions("test");
    });

    expect(result.current.isLoading).toBe(true);

    // Clear before debounce fires
    act(() => {
      result.current.clearSuggestions();
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    // Advance timers -- fetch should NOT fire since we cleared
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("uses default debounce of 300ms when not specified", async () => {
    const mockFetch = createMockFetch([{ id: 1, label: "Default" }], 10);

    const { result } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch)
    );

    act(() => {
      result.current.fetchSuggestions("query");
    });

    // At 299ms, should not have fetched yet
    await act(async () => {
      vi.advanceTimersByTime(299);
    });
    expect(mockFetch).not.toHaveBeenCalled();

    // At 300ms, should fire
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("supports generic types for suggestion data", async () => {
    interface CustomItem {
      value: string;
      metadata: { score: number };
    }

    const customData: CustomItem[] = [
      { value: "item1", metadata: { score: 0.95 } },
    ];

    const mockFetch = createMockFetch(customData as any, 10) as unknown as (
      query: string,
      signal: AbortSignal
    ) => Promise<CustomItem[]>;

    const { result } = renderHook(() =>
      useAsyncSuggestions<CustomItem>(mockFetch, 50)
    );

    act(() => {
      result.current.fetchSuggestions("custom");
    });

    await act(async () => {
      vi.advanceTimersByTime(50);
    });
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // TypeScript should infer suggestions as CustomItem[]
    const firstSuggestion = result.current.suggestions[0];
    expect(firstSuggestion.value).toBe("item1");
    expect(firstSuggestion.metadata.score).toBe(0.95);
  });

  it("cleans up on unmount (aborts in-flight and clears timers)", async () => {
    const mockFetch = createMockFetch([{ id: 1, label: "Test" }], 200);

    const { result, unmount } = renderHook(() =>
      useAsyncSuggestions<TestSuggestion>(mockFetch, 50)
    );

    // Start a fetch
    act(() => {
      result.current.fetchSuggestions("test");
    });

    // Let debounce fire so fetch is in-flight
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Unmount while fetch is in-flight -- should not throw or cause state update warnings
    unmount();

    // Advance timers to let the aborted fetch try to resolve
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // No assertions needed -- the test passes if no warnings/errors are thrown
  });
});
