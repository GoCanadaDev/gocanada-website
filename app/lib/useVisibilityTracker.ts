import { useEffect, useRef } from "react"

type VisibilityTrackerOptions = {
  threshold?: number
  rootMargin?: string
}

function useVisibilityTracker(
  onVisible: () => void,
  options: VisibilityTrackerOptions = {}
) {
  const elementRef = useRef(null)
  const wasVisibleRef = useRef(false)

  useEffect(() => {
    const currentElement = elementRef.current
    if (!currentElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger once when the element becomes visible
          if (entry.isIntersecting && !wasVisibleRef.current) {
            wasVisibleRef.current = true
            onVisible()
          }
        })
      },
      {
        threshold: options.threshold || 0.5, // 50% visible by default
        rootMargin: options.rootMargin || "0px",
      }
    )

    observer.observe(currentElement)

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [onVisible, options.threshold, options.rootMargin])

  return elementRef
}

export default useVisibilityTracker
