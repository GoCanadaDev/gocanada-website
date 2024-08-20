import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"

export default function TopAdBanner({}) {
  const { adConfig } = useRootLoaderData()

  if (!adConfig.featuredAdsEnabled) {
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
            <div className="absolute inset-0">
              {typeof adConfig.topBannerAdCode === "string" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: adConfig.topBannerAdCode }}
                />
              ) : (
                <a href={adConfig.topBannerAdUrl} target="_blank">
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
