import type { SanityClient } from "@sanity/client"
import groq from "groq"

import type { SupportedLanguages } from "~/i18n"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import type { PostPreview } from "~/sanity/queries/posts"
import { postsProjection } from "~/sanity/queries/posts"
import type { LocalizedString } from "~/sanity/queries/shared"

export type Category = {
  _id: string
  description: LocalizedString
  displayOrder: number
  enabled?: boolean
  language: SupportedLanguages
  posts?: PostPreview[]
  slug: LocalizedString
  subCategories: {
    _id: string
    title: LocalizedString
    slug: LocalizedString
    enabledInNav?: boolean
  }[]
  title: LocalizedString
}

export const categoriesQuery = groq`*[_type == "categoryType"] | order(displayOrder asc) {
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
  displayOrder,
  enabled,
  "subCategories": subCategories[]->{
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
  }
}`

export async function getCategories(client: SanityClient, language: string) {
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
  "posts": *[_type == "postType" && (references(^._id) || references(^.subCategories[]._ref))] | order(publishedAt desc){
    ${postsProjection}
  },
  "subCategories": subCategories[]->{
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
  }
}`

export async function getCategory(
  client: SanityClient,
  slug: string,
  language: string
) {
  const result = await client.fetch(categoryBySlugQuery, {
    slug,
    language,
  })
  return sanitizeStrings(result) as Category
}
