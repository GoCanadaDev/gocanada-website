import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"
import { trackEvent } from "~/lib/utils"
import useVisibilityTracker from "~/lib/useVisibilityTracker"
import { useState, useEffect } from "react"

export default function TopAdBanner({}) {
  const rootLoaderData = useRootLoaderData()
  const adConfig = rootLoaderData?.adConfig
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  const adRef = useVisibilityTracker(
    () => {
      if (adConfig?.topBannerAds?.[currentAdIndex]) {
        trackEvent("Top Ad Banner Viewed", {
          topBannerAdUrl: adConfig.topBannerAds[currentAdIndex].topBannerAdUrl,
        })
      }
    },
    {
      threshold: 0.5, // Trigger when 50% of the ad is visible
      rootMargin: "0px", // No margin around the viewport
    }
  )

  useEffect(() => {
    if (adConfig && adConfig.topBannerAds.length > 1) {
      const cycleTime = adConfig.topBannerAdsCycleTime * 1000 // Convert to milliseconds
      const interval = setInterval(() => {
        setCurrentAdIndex(
          (prevIndex) => (prevIndex + 1) % adConfig.topBannerAds.length
        )
        trackEvent("Top Ad Banner Viewed", {
          topBannerAdUrl:
            adConfig.topBannerAds[
              (currentAdIndex + 1) % adConfig.topBannerAds.length
            ].topBannerAdUrl,
        })
      }, cycleTime)
      return () => clearInterval(interval)
    }
  }, [adConfig, currentAdIndex])

  if (
    !adConfig ||
    !adConfig.featuredAdsEnabled ||
    adConfig.topBannerAds?.length === 0
  ) {
    return null
  }

  const currentAd =
    adConfig.topBannerAds?.length > 0 && adConfig.topBannerAds[currentAdIndex]

  const aspectRatio =
    (currentAd.topBannerAdWidth ?? 0) / (currentAd.topBannerAdHeight ?? 0)

  if (aspectRatio === undefined || isNaN(aspectRatio)) {
    return null
  }

  return (
    <div className="py-4">
      <div className="px-[3.5vw]">
        <div className="m-auto max-w-4xl">
          <div
            style={{
              position: "relative",
              aspectRatio: aspectRatio,
              maxHeight: currentAd.topBannerAdHeight,
              maxWidth: currentAd.topBannerAdWidth,
              margin: "0 auto",
            }}
          >
            <div className="absolute inset-0" ref={adRef}>
              {typeof currentAd.topBannerAdCode === "string" ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentAd.topBannerAdCode,
                  }}
                />
              ) : (
                <a
                  href={currentAd.topBannerAdUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Learn more from our advertising partner"
                  onClick={() =>
                    trackEvent("Top Ad Banner Clicked", {
                      topBannerAdUrl: currentAd.topBannerAdUrl,
                    })
                  }
                >
                  <SanityImage
                    id={currentAd.topBannerAdImage.id}
                    baseUrl={baseUrl}
                    preview={currentAd.topBannerAdImage.preview}
                    width={currentAd.topBannerAdWidth}
                    height={currentAd.topBannerAdHeight}
                    className="m-auto"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
