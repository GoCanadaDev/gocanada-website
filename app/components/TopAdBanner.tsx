import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { AspectRatio } from "./ui/aspect-ratio"
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
          <AspectRatio
            ratio={adConfig.topBannerAdWidth / adConfig.topBannerAdHeight}
          >
            <div className="absolute inset-0">
              {adConfig.topBannerAdCode ? (
                <div
                  dangerouslySetInnerHTML={{ __html: adConfig.topBannerAdCode }}
                />
              ) : (
                <a href={adConfig.topBannerAdUrl} target="_blank">
                  <SanityImage
                    id={adConfig.topBannerAdImage._id}
                    baseUrl={baseUrl}
                    preview={adConfig.topBannerAdImage.metadata.lqip}
                    width={adConfig.topBannerAdWidth}
                    height={adConfig.topBannerAdHeight}
                  />
                </a>
              )}
            </div>
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
