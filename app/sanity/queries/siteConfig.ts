import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

export type SiteConfigType = {
  enablePartners: boolean
  keywords: string[]
  siteDescription: string
  siteTitle: string
  footerText: string
}

export const siteConfigQuery = groq`*[_type == "siteConfigType"] {
  enablePartners,
  keywords,
  siteDescription,
  siteTitle,
  footerText,
}`

export async function getSiteConfig(client: SanityClient) {
  const result = await client.fetch(siteConfigQuery)

  return sanitizeStrings(result[0]) as SiteConfigType
}
