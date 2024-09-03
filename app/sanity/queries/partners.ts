import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { ImageAsset } from "sanity"

export type Partner = {
  name: string
  link: string
  displayOrder: number
  logo: {
    id: string
    preview: string
    aspectRatio: number
  } & ImageAsset
}

export const partnersQuery = groq`*[_type == "partnerType"] | order(displayOrder desc) {
  name,
  link,
  displayOrder,
  logo{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
    "metadata": asset->metadata,
  },
}`

export async function getPartners(client: SanityClient) {
  const result = await client.fetch(partnersQuery)
  return Object.values(sanitizeStrings(result)) as Partner[]
}
