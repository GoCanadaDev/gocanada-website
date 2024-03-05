import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { SupportedLanguages } from "~/i18n"
import { PostPreview, postsProjection } from "./posts"
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
  },
}`

export async function getPartners(client: SanityStegaClient) {
  const result = await client.fetch(partnersQuery)
  return Object.values(sanitizeStrings(result)) as Partner[]
}
