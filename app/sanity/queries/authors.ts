import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { SupportedLanguages } from "~/i18n"
import { PostPreview, postsProjection } from "./posts"
import { ImageAsset, Slug } from "sanity"

export type Author = {
  name: string
  slug: Slug["current"]
  bio: LocalizedString
  language: SupportedLanguages
  image: {
    id: string
    preview: string
  } & ImageAsset
  posts?: PostPreview[]
}

export const authorsProjection = `
  _id,
  name,
  "slug": slug.current,
  "bio": {
    "en": bio.en,
    "fr": bio.fr,
  },
  "language": $language,
  image{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
  },
`

export const authorsQuery = groq`*[_type == "authorType"] | order(_createdAt desc) {
  ${authorsProjection}
}`

export async function getAuthors(client: SanityStegaClient, language: string) {
  const result = await client.fetch(authorsQuery, { language })
  return Object.values(sanitizeStrings(result)) as Author[]
}

export const authorBySlugQuery = groq`*[_type == "authorType" && slug.current == $slug][0]{
  ${authorsProjection}
  "posts": *[_type == "postType" && references(^._id)]{
    ${postsProjection}
  },
}`

export async function getAuthor(
  client: SanityStegaClient,
  language: string,
  slug: string
) {
  const result = await client.fetch(authorBySlugQuery, {
    language,
    slug,
  })

  return sanitizeStrings(result) as Author
}
