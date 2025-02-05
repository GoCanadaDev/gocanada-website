import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"
import { trackEvent } from "~/lib/utils"
import { useEffect } from "react"
import useVisibilityTracker from "~/lib/useVisibilityTracker"

export default function TopAdBanner({}) {
  const { adConfig } = useRootLoaderData()

  const adRef = useVisibilityTracker(
    () => {
      trackEvent("Top Ad Banner Viewed", {
        topBannerAdUrl: adConfig.topBannerAdUrl,
      })
    },
    {
      threshold: 0.5, // Trigger when 50% of the ad is visible
      rootMargin: "0px", // No margin around the viewport
    }
  )

  if (!adConfig || !adConfig.featuredAdsEnabled) {
    return null
  }

  return (
    <div className="py-4">
      <div className="px-[3.5vw]">
        <div className="m-auto max-w-4xl">
          <div
            style={{
              position: "relative",
              aspectRatio:
                adConfig.topBannerAdWidth / adConfig.topBannerAdHeight,
              maxHeight: adConfig.topBannerAdHeight,
              maxWidth: adConfig.topBannerAdWidth,
              margin: "0 auto",
            }}
          >
            <div className="absolute inset-0" ref={adRef}>
              {typeof adConfig.topBannerAdCode === "string" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: adConfig.topBannerAdCode }}
                />
              ) : (
                <a
                  href={adConfig.topBannerAdUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Learn more from our advertising partner"
                  onClick={() =>
                    trackEvent("Top Ad Banner Clicked", {
                      topBannerAdUrl: adConfig.topBannerAdUrl,
                    })
                  }
                >
                  <SanityImage
                    id={adConfig.topBannerAdImage.id}
                    baseUrl={baseUrl}
                    preview={adConfig.topBannerAdImage.preview}
                    width={adConfig.topBannerAdWidth}
                    height={adConfig.topBannerAdHeight}
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
