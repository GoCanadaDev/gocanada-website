import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { SupportedLanguages } from "~/i18n"
import { Post, PostPreview, postsProjection } from "~/sanity/queries/posts"

export type Category = {
  title: LocalizedString
  slug: LocalizedString
  description: LocalizedString
  language: SupportedLanguages
  posts?: PostPreview[]
}

export const categoriesQuery = groq`*[_type == "categoryType"] | order(_createdAt desc) {
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  "description": {
    "en": description.en,
    "fr": description.fr,
  },
  "language": $language,
}`

export async function getCategories(
  client: SanityStegaClient,
  language: string
) {
  const result = await client.fetch(categoriesQuery, { language })
  return Object.values(sanitizeStrings(result)) as Category[]
}

export const categoryBySlugQuery = groq`*[_type == "categoryType" && slug[$language].current == $slug][0]{
  _id,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  "description": {
    "en": description.en,
    "fr": description.fr,
  },
  "language": $language,
  "posts": *[_type == "postType" && references(^._id)]{
    ${postsProjection}
  },
}`

export async function getCategory(
  client: SanityStegaClient,
  slug: string,
  language: string
) {
  const result = await client.fetch(categoryBySlugQuery, {
    slug,
    language,
  })
  return sanitizeStrings(result) as Category
}
