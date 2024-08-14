import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { AspectRatio } from "./ui/aspect-ratio"

export default function TopAdBanner({}) {
  const { adConfig } = useRootLoaderData()

  console.log(adConfig)

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
              <div
                dangerouslySetInnerHTML={{ __html: adConfig.topBannerAdCode }}
              />
            </div>
          </AspectRatio>
        </div>
      </div>
    </div>
  )
}
