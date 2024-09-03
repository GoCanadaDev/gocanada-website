import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { ImageCrop, ImageHotspot } from "sanity"

export type AdConfigType = {
  featuredAdsEnabled: boolean
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
}

export const adConfigQuery = groq`*[_type == "adConfigType"] {
  featuredAdsEnabled,
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
}`

export async function getAdConfig(client: SanityClient) {
  const result = await client.fetch(adConfigQuery)

  return sanitizeStrings(result[0]) as AdConfigType
}
