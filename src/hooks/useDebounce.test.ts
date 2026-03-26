import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useDebounce } from "./useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500))
    expect(result.current).toBe("hello")
  })

  it("does not update the value before the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } }
    )

    // Change the value
    rerender({ value: "world", delay: 500 })

    // Advance time but not enough to trigger the debounce
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Should still be the old value
    expect(result.current).toBe("hello")
  })

  it("updates the value after the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } }
    )

    // Change the value
    rerender({ value: "world", delay: 500 })

    // Advance time past the delay
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should now be updated
    expect(result.current).toBe("world")
  })

  it("cancels the previous timeout on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    )

    // Rapid successive changes
    rerender({ value: "ab", delay: 500 })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: "abc", delay: 500 })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: "abcd", delay: 500 })

    // Still the initial value since each change resets the timer
    expect(result.current).toBe("a")

    // Now let the final debounce complete
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should only reflect the most recent value
    expect(result.current).toBe("abcd")
  })

  it("cleans up the timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout")

    const { unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 500 } }
    )

    unmount()

    // clearTimeout should have been called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it("works with numeric values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(42)
  })

  it("works with object values", () => {
    const initial = { query: "foo" }
    const updated = { query: "bar" }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initial, delay: 200 } }
    )

    expect(result.current).toBe(initial)

    rerender({ value: updated, delay: 200 })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe(updated)
  })

  it("resets the timer when the delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 500 } }
    )

    rerender({ value: "updated", delay: 500 })

    // Advance partway
    act(() => {
      vi.advanceTimersByTime(400)
    })

    // Change the delay - this resets the timer
    rerender({ value: "updated", delay: 1000 })

    // The old 500ms timer was cleared, so value should still be initial
    expect(result.current).toBe("test")

    // Advance the full new delay
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe("updated")
  })
})
