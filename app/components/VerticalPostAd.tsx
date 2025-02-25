import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"
import { trackEvent } from "~/lib/utils"
import useVisibilityTracker from "~/lib/useVisibilityTracker"

export default function VerticalPostAd({}) {
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

  if (!adConfig || !adConfig.verticalPostAdUrl) {
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
                adConfig.verticalPostAdWidth / adConfig.verticalPostAdHeight,
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
  )
}
