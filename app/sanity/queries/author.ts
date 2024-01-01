import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { SupportedLanguages } from "~/i18n"
import { PostPreview, postsProjection } from "./posts"

export type Author = {
  name: string
  slug: string
  bio: LocalizedString
  language: SupportedLanguages
  image: {
    id: string
    preview: string
  }
  posts?: PostPreview[]
}

export const authorBySlugQuery = groq`*[_type == "authorType" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  "bio": {
    "en": bio.en,
    "fr": bio.fr,
  },
  "language": $language,
  image{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
  },
  "posts": *[_type == "postType" && references(^._id)]{
    ${postsProjection}
  },
}`

export async function getAuthor(
  client: SanityStegaClient,
  language: string,
  slug: string,
) {
  const result = await client.fetch(authorBySlugQuery, {
    language,
    slug,
  })

  return sanitizeStrings(result) as Author
}
