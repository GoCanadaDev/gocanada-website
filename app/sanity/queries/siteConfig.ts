import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

export type SiteConfigType = {
  enablePartners: boolean
  keywords: string[]
  siteDescription: string
  siteTitle: string
}

export const siteConfigQuery = groq`*[_type == "siteConfigType"] {
  enablePartners,
  keywords,
  siteDescription,
  siteTitle,
}`

export async function getSiteConfig(client: SanityStegaClient) {
  const result = await client.fetch(siteConfigQuery)

  return sanitizeStrings(result[0]) as SiteConfigType
}
