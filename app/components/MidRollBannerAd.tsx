import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"
import { trackEvent } from "~/lib/utils"
import useVisibilityTracker from "~/lib/useVisibilityTracker"
import { useState, useEffect } from "react"

export default function MidRollBannerAd({}) {
  const { adConfig } = useRootLoaderData()
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  const adRef = useVisibilityTracker(
    () => {
      if (adConfig?.midBannerAds?.[currentAdIndex]) {
        trackEvent("Midroll Ad Banner Viewed", {
          midBannerAdUrl: adConfig.midBannerAds[currentAdIndex].midBannerAdUrl,
        })
      }
    },
    {
      threshold: 0.5, // Trigger when 50% of the ad is visible
      rootMargin: "0px", // No margin around the viewport
    }
  )

  useEffect(() => {
    if (adConfig && adConfig.midBannerAds && adConfig.midBannerAds.length > 1) {
      const cycleTime = adConfig.midBannerAdsCycleTime * 1000 // Convert to milliseconds
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % adConfig.midBannerAds.length
        )
        trackEvent("Midroll Ad Banner Viewed", {
          midBannerAdUrl:
            adConfig.midBannerAds[
              (currentAdIndex + 1) % adConfig.midBannerAds.length
            ].midBannerAdUrl,
        })
      }, cycleTime)
      return () => clearInterval(interval)
    }
  }, [adConfig, currentAdIndex])

  if (
    !adConfig ||
    !adConfig.featuredAdsEnabled ||
    !adConfig.midBannerAds ||
    adConfig.midBannerAds.length === 0
  ) {
    return null
  }

  const currentAd =
    adConfig.midBannerAds?.length > 0 && adConfig.midBannerAds[currentAdIndex]

  if (!currentAd) {
    return null
  }

  const aspectRatio =
    (currentAd.midBannerAdWidth ?? 0) / (currentAd.midBannerAdHeight ?? 0)

  if (aspectRatio === undefined || isNaN(aspectRatio)) {
    return null
  }

  return (
    <div className="my-8">
      <div className="py-0 md:py-4">
        <div className="px-0 md:px-[3.5vw]">
          <div className="m-auto max-w-4xl">
            <div
              style={{
                position: "relative",
                aspectRatio:
                  currentAd.midBannerAdWidth / currentAd.midBannerAdHeight,
                maxHeight: currentAd.midBannerAdHeight,
                maxWidth: currentAd.midBannerAdWidth,
                margin: "0 auto",
              }}
            >
              <div className="absolute inset-0" ref={adRef}>
                {typeof currentAd.midBannerAdCode === "string" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentAd.midBannerAdCode,
                    }}
                  />
                ) : (
                  <a
                    href={currentAd.midBannerAdUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label="Learn more from our advertising partner"
                    onClick={() =>
                      trackEvent("MidRoll Ad Banner Clicked", {
                        midBannerAdUrl: currentAd.midBannerAdUrl,
                      })
                    }
                  >
                    <SanityImage
                      id={currentAd.midBannerAdImage.id}
                      baseUrl={baseUrl}
                      preview={currentAd.midBannerAdImage.preview}
                      width={currentAd.midBannerAdWidth}
                      height={currentAd.midBannerAdHeight}
                      className="m-auto"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
