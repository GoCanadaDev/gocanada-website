import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { ImageCrop, ImageHotspot } from "sanity"

export type AdConfigType = {
  featuredAdsEnabled: boolean
  topBannerAdsCycleTime: number
  topBannerAds: {
    topBannerAdUrl: string
    topBannerAdImage: {
      id: string
      preview: string
      aspectRatio: number
      hotspot?: ImageHotspot
      crop?: ImageCrop
    }
    topBannerAdCode: string
    topBannerAdWidth: number
    topBannerAdHeight: number
  }[]
  topBannerAdUrl: string
  topBannerAdImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
  topBannerAdCode: string
  topBannerAdWidth: number
  topBannerAdHeight: number
  midBannerAdUrl: string
  midBannerAdImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
  midBannerAdCode: string
  midBannerAdWidth: number
  midBannerAdHeight: number
  verticalPostAdUrl: string
  verticalPostAdImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
  verticalPostAdCode: string
  verticalPostAdWidth: number
  verticalPostAdHeight: number
}

export const adConfigQuery = groq`*[_type == "adConfigType"] {
  featuredAdsEnabled,
  topBannerAdsCycleTime,
  topBannerAds[]{
    topBannerAdUrl,
    topBannerAdImage{
      ...,
      "id": asset._ref,
      "preview": asset->metadata.lqip,
      "metadata": asset->metadata,
      "hotspot": asset->hotspot,
      "crop": asset->crop,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
    },
    topBannerAdCode,
    topBannerAdWidth,
    topBannerAdHeight,
  },
  topBannerAdUrl,
  topBannerAdImage{
     ...,
   "id": asset._ref,
   "preview": asset->metadata.lqip,
   "metadata": asset->metadata,
   "hotspot": asset->hotspot,
   "crop": asset->crop,
   "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  topBannerAdCode,
  topBannerAdWidth,
  topBannerAdHeight,
  midBannerAdUrl,
  midBannerAdImage{
    ...,
   "id": asset._ref,
   "preview": asset->metadata.lqip,
   "metadata": asset->metadata,
   "hotspot": asset->hotspot,
   "crop": asset->crop,
   "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  midBannerAdCode,
  midBannerAdWidth,
  midBannerAdHeight,
  verticalPostAdUrl,
  verticalPostAdImage{
    ...,
   "id": asset._ref,
   "preview": asset->metadata.lqip,
   "metadata": asset->metadata,
   "hotspot": asset->hotspot,
   "crop": asset->crop,
   "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  verticalPostAdCode,
  verticalPostAdWidth,
  verticalPostAdHeight,
}`

export async function getAdConfig(client: SanityClient) {
  const result = await client.fetch(adConfigQuery)

  return sanitizeStrings(result[0]) as AdConfigType
}
