import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"
import { trackEvent } from "~/lib/utils"
import useVisibilityTracker from "~/lib/useVisibilityTracker"
import { useEffect, useRef } from "react"

export default function VerticalPostAd({
  bottomMarkerRef,
}: {
  bottomMarkerRef: React.RefObject<HTMLDivElement>
}) {
  const stickyRef = useRef<HTMLElement | null>(null)

  const { adConfig } = useRootLoaderData()

  const adRef = useVisibilityTracker(
    () => {
      trackEvent("Vertical Post Ad Viewed", {
        verticalPostAdUrl: adConfig.verticalPostAdUrl,
      })
    },
    {
      threshold: 0.5, // Trigger when 50% of the ad is visible
      rootMargin: "0px", // No margin around the viewport
    }
  )

  useEffect(() => {
    const stickyElement = stickyRef.current
    const bottomMarker = bottomMarkerRef.current

    if (!stickyElement || !bottomMarker) return

    // Track both visibility and scroll position
    let isMarkerVisible = false
    let previousY = 0 // To track scroll direction
    let hasCrossedMarkerDown = false // Track if we've crossed the marker scrolling down
    let lastScrollDirection: null | boolean = null // Track the last scroll direction

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        // Add a CSS transition for smooth opacity changes
        stickyElement.style.transition = "opacity 0.3s ease-out"

        // Determine scroll direction (up or down)
        const currentY = entry.boundingClientRect.top
        const isScrollingDown = currentY < previousY
        previousY = currentY

        // If the scroll direction changed from down to up, reset our crossed marker flag
        if (lastScrollDirection === true && !isScrollingDown) {
          hasCrossedMarkerDown = false
        }
        lastScrollDirection = isScrollingDown

        // Update marker visibility state
        isMarkerVisible = entry.isIntersecting

        if (isScrollingDown) {
          if (isMarkerVisible) {
            // Fade out based on intersection ratio when scrolling down through marker
            const ratio = 1 - Math.min(1, Math.max(0, entry.intersectionRatio))
            stickyElement.style.opacity = String(ratio)

            // Mark as crossed when we're mostly through the marker
            if (entry.intersectionRatio > 0.9) {
              hasCrossedMarkerDown = true
            }
          } else if (hasCrossedMarkerDown) {
            // Keep hidden after crossing marker going down
            stickyElement.style.opacity = "0"
          } else {
            // Fully visible before reaching marker
            stickyElement.style.opacity = "1"
          }
        } else {
          // Scrolling up
          if (isMarkerVisible) {
            // When scrolling up through the marker, gradually fade back in
            const ratio = Math.min(1, Math.max(0, 1 - entry.intersectionRatio))
            stickyElement.style.opacity = String(ratio)

            // Reset crossed flag when we're mostly out of the marker going up
            if (entry.intersectionRatio < 0.1) {
              hasCrossedMarkerDown = false
            }
          } else if (!hasCrossedMarkerDown) {
            // Fully visible when scrolled back above the marker
            stickyElement.style.opacity = "1"
          }
        }
      },
      {
        // Track multiple thresholds for smoother fade effect
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0],
        rootMargin: "0px",
      }
    )

    observer.observe(bottomMarker)

    return () => observer.disconnect()
  }, [])

  if (
    Object.keys(adConfig).length === 0 ||
    Object.keys(adConfig.verticalPostAdUrl).length === 0 ||
    Object.keys(adConfig.verticalPostAdImage).length
  ) {
    return null
  }

  return (
    <>
      <aside ref={stickyRef} className="sticky top-16 hidden h-0 lg:block">
        <div className="holy-grail text-[1.32rem]">
          <div className="!col-span-1 !col-start-3">
            <div className="m-auto pr-8 pt-12">
              <div
                style={{
                  position: "relative",
                  aspectRatio:
                    adConfig.verticalPostAdWidth /
                    adConfig.verticalPostAdHeight,
                  maxHeight: adConfig.verticalPostAdHeight,
                  maxWidth: adConfig.verticalPostAdWidth,
                  margin: "0 auto",
                }}
              >
                <div className="absolute inset-0" ref={adRef}>
                  {typeof adConfig.verticalPostAdCode === "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: adConfig.verticalPostAdCode,
                      }}
                    />
                  ) : (
                    <a
                      href={adConfig.verticalPostAdUrl}
                      target="_blank"
                      rel="noopener"
                      aria-label="Learn more from our advertising partner"
                      onClick={() =>
                        trackEvent("Vertical Post Ad Clicked", {
                          verticalPostAdUrl: adConfig.verticalPostAdUrl,
                        })
                      }
                    >
                      <SanityImage
                        id={adConfig.verticalPostAdImage.id}
                        baseUrl={baseUrl}
                        preview={adConfig.verticalPostAdImage.preview}
                        width={adConfig.verticalPostAdWidth}
                        height={adConfig.verticalPostAdHeight}
                        className="m-auto"
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
