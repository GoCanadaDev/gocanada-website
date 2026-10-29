import type { SanityClient } from "@sanity/client"
import groq from "groq"

import type { SupportedLanguages } from "~/i18n"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import type { PostPreview } from "~/sanity/queries/posts"
import { postsProjection } from "~/sanity/queries/posts"
import type { LocalizedString } from "~/sanity/queries/shared"

export type SubCategory = {
  _id: string
  title: LocalizedString
  slug: LocalizedString
  enabledInNav?: boolean
  description: LocalizedString
  language: SupportedLanguages
  posts?: PostPreview[]
}

export const subCategoriesQuery = groq`*[_type == "subCategoryType"] | order(displayOrder asc) {
  _id,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  enabledInNav,
  "description": {
    "en": description.en,
    "fr": description.fr,
  },
  "language": $language,
}`

export async function getSubCategories(client: SanityClient, language: string) {
  const result = await client.fetch(subCategoriesQuery, { language })
  return Object.values(sanitizeStrings(result)) as SubCategory[]
}

export const subCategoryBySlugQuery = groq`*[_type == "subCategoryType" && slug[$language].current == $slug][0]{
  _id,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  enabledInNav,
  "description": {
    "en": description.en,
    "fr": description.fr,
  },
  "language": $language,
  "posts": *[_type == "postType" && references(^._id)]{
    ${postsProjection}
  },
}`

export async function getSubCategory(
  client: SanityClient,
  slug: string,
  language: string
) {
  const result = await client.fetch(subCategoryBySlugQuery, {
    slug,
    language,
  })
  return sanitizeStrings(result) as SubCategory
}
