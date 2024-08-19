import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { ImageAsset } from "sanity"

export type AdConfigType = {
  featuredAdsEnabled: boolean
  topBannerAdUrl: string
  topBannerAdImage: ImageAsset
  topBannerAdCode: string
  topBannerAdWidth: number
  topBannerAdHeight: number
}

export const adConfigQuery = groq`*[_type == "adConfigType"] {
  featuredAdsEnabled,
  topBannerAdUrl,
  topBannerAdImage,
  topBannerAdCode,
  topBannerAdWidth,
  topBannerAdHeight,
}`

export async function getAdConfig(client: SanityClient) {
  const result = await client.fetch(adConfigQuery)

  return sanitizeStrings(result[0]) as AdConfigType
}
