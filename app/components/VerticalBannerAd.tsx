import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"
import { trackEvent } from "~/lib/utils"
import useVisibilityTracker from "~/lib/useVisibilityTracker"
import { useEffect, useRef, useState } from "react"

export default function VerticalBannerAd({
  bottomMarkerRef,
}: {
  bottomMarkerRef: React.RefObject<HTMLDivElement>
}) {
  const stickyRef = useRef<HTMLElement | null>(null)

  const { adConfig } = useRootLoaderData()
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  const adRef = useVisibilityTracker(
    () => {
      trackEvent("Vertical Banner Ad Viewed", {
        verticalBannerAdUrl:
          adConfig.verticalBannerAds[currentAdIndex].verticalBannerAdUrl,
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

  useEffect(() => {
    if (adConfig && adConfig.verticalBannerAds.length > 1) {
      const cycleTime = adConfig.verticalBannerAdsCycleTime * 1000 // Convert to milliseconds
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % adConfig.verticalBannerAds.length
        )
        trackEvent("Vertical Ad Banner Viewed", {
          verticalBannerAdUrl:
            adConfig.verticalBannerAds[
              (currentAdIndex + 1) % adConfig.verticalBannerAds.length
            ].verticalBannerAdUrl,
        })
      }, cycleTime)
      return () => clearInterval(interval)
    }
  }, [adConfig, currentAdIndex])

  if (
    !adConfig ||
    !adConfig.featuredAdsEnabled ||
    !adConfig.verticalBannerAds.length
  ) {
    return null
  }

  const currentAd = adConfig.verticalBannerAds[currentAdIndex]

  return (
    <>
      <aside
        ref={stickyRef}
        className="sticky right-0 top-16 !col-span-1 !col-start-3 hidden h-0 lg:block"
      >
        <div className="text-[1.32rem]">
          <div className="">
            <div className="m-auto pr-8 pt-12">
              <div
                style={{
                  position: "relative",
                  aspectRatio:
                    currentAd.verticalBannerAdWidth /
                    currentAd.verticalBannerAdHeight,
                  maxHeight: currentAd.verticalBannerAdHeight,
                  maxWidth: currentAd.verticalBannerAdWidth,
                  margin: "0 auto",
                }}
              >
                <div className="absolute inset-0" ref={adRef}>
                  {typeof currentAd.verticalBannerAdCode === "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentAd.verticalBannerAdCode,
                      }}
                    />
                  ) : (
                    <a
                      href={currentAd.verticalBannerAdUrl}
                      target="_blank"
                      rel="noopener"
                      aria-label="Learn more from our advertising partner"
                      onClick={() =>
                        trackEvent("Vertical Banner Ad Clicked", {
                          verticalBannerAdUrl: currentAd.verticalBannerAdUrl,
                        })
                      }
                    >
                      <SanityImage
                        id={currentAd.verticalBannerAdImage.id}
                        baseUrl={baseUrl}
                        preview={currentAd.verticalBannerAdImage.preview}
                        width={currentAd.verticalBannerAdWidth}
                        height={currentAd.verticalBannerAdHeight}
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
