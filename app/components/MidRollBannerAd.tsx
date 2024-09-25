import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"

export default function MidRollBannerAd({}) {
  const { adConfig } = useRootLoaderData()

  if (!adConfig || !adConfig.featuredAdsEnabled) {
    return null
  }

  return (
    <div className="py-0 md:py-4">
      <div className="px-0 md:px-[3.5vw]">
        <div className="m-auto max-w-4xl">
          <div
            style={{
              position: "relative",
              aspectRatio:
                adConfig.midBannerAdWidth / adConfig.midBannerAdHeight,
              maxHeight: adConfig.midBannerAdHeight,
              maxWidth: adConfig.midBannerAdWidth,
              margin: "0 auto",
            }}
          >
            <div className="absolute inset-0">
              {typeof adConfig.midBannerAdCode === "string" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: adConfig.midBannerAdCode }}
                />
              ) : (
                <a
                  href={adConfig.midBannerAdUrl}
                  target="_blank"
                  rel="noopener"
                >
                  <SanityImage
                    id={adConfig.midBannerAdImage.id}
                    baseUrl={baseUrl}
                    preview={adConfig.midBannerAdImage.preview}
                    width={adConfig.midBannerAdWidth}
                    height={adConfig.midBannerAdHeight}
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
