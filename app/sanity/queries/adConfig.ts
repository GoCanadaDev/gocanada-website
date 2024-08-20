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
}

export const adConfigQuery = groq`*[_type == "adConfigType"] {
  featuredAdsEnabled,
  topBannerAdUrl,
  topBannerAdImage{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  topBannerAdCode,
  topBannerAdWidth,
  topBannerAdHeight,
}`

export async function getAdConfig(client: SanityClient) {
  const result = await client.fetch(adConfigQuery)

  return sanitizeStrings(result[0]) as AdConfigType
}
