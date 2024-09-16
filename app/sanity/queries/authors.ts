import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { SupportedLanguages } from "~/i18n"
import { PostPreview, postsProjection } from "./posts"
import { ImageAsset, ImageCrop, ImageHotspot, Slug } from "sanity"

export type Author = {
  _id: string
  name: string
  slug: Slug["current"]
  bio: LocalizedString
  title: string
  website?: string
  instagram?: string
  threads?: string
  twitter?: string
  youtube?: string
  facebook?: string
  email?: string
  language: SupportedLanguages
  image?: {
    id: string
    preview: string
    hotspot?: ImageHotspot
    crop?: ImageCrop
  } & ImageAsset
  posts?: PostPreview[]
  postsCount?: number
}

export const authorsProjection = `
  _id,
  name,
  "slug": slug.current,
  "bio": {
    "en": bio.en,
    "fr": bio.fr,
  },
  "title": title,
  "website": website,
  "instagram": instagram,
  "threads": threads,
  "twitter": twitter,
  "youtube": youtube,
  "facebook": facebook,
  "email": email,
  "language": $language,
  "postsCount": count(*[_type == "postType" && references(^._id)]),
  image{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
  },
`

export const authorsQuery = groq`*[_type == "authorType"] | order(_createdAt desc) {
  ${authorsProjection}
}`

export async function getAuthors(client: SanityClient, language: string) {
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
  client: SanityClient,
  language: string,
  slug: string
) {
  const result = await client.fetch(authorBySlugQuery, {
    language,
    slug,
  })

  return sanitizeStrings(result) as Author
}
