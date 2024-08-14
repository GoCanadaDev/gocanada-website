import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

export type AdConfigType = {
  featuredAdsEnabled: boolean
  topBannerAdCode: string
  topBannerAdWidth: number
  topBannerAdHeight: number
}

export const adConfigQuery = groq`*[_type == "adConfigType"] {
  featuredAdsEnabled,
  topBannerAdCode,
  topBannerAdWidth,
  topBannerAdHeight,
}`

export async function getAdConfig(client: SanityClient) {
  const result = await client.fetch(adConfigQuery)

  return sanitizeStrings(result[0]) as AdConfigType
}
