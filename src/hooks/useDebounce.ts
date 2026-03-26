import { useState, useEffect } from "react"

/**
 * Custom hook that debounces a value by the specified delay.
 *
 * Useful for delaying expensive operations (e.g., API calls) until
 * the user has stopped typing or interacting.
 *
 * @template T - The type of the value being debounced
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before the value updates
 * @returns The debounced value, updated only after `delay` ms of inactivity
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // Only fires 300ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel the previous timeout on every value/delay change
    // or on unmount. This prevents stale updates and memory leaks.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
