import type { SanityClient } from "@sanity/client"

/**
 * Wraps a Sanity fetch call with a timeout to prevent hanging requests
 * in restrictive WebView environments (e.g., Instagram in-app browser).
 *
 * @param fetchFn - The async function that performs the Sanity fetch
 * @param timeoutMs - Timeout in milliseconds (default: 8000ms)
 * @param fallbackValue - Value to return if the fetch times out or fails
 * @returns Promise that resolves to the fetch result or fallback value
 */
export async function sanityFetchWithTimeout<T>(
  fetchFn: () => Promise<T>,
  timeoutMs: number = 8000,
  fallbackValue: T
): Promise<T> {
  let timeoutId: NodeJS.Timeout

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Sanity fetch timeout after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    const result = await Promise.race([fetchFn(), timeoutPromise])
    clearTimeout(timeoutId!)
    return result
  } catch (error) {
    clearTimeout(timeoutId!)
    console.error("Sanity fetch failed or timed out:", error)
    return fallbackValue
  }
}