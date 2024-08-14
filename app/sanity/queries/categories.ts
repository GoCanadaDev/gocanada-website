import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { SupportedLanguages } from "~/i18n"
import { PostPreview, postsProjection } from "~/sanity/queries/posts"

export type Category = {
  description: LocalizedString
  displayOrder: number
  enabled?: boolean
  language: SupportedLanguages
  posts?: PostPreview[]
  slug: LocalizedString
  subCategories: {
    title: LocalizedString
    slug: LocalizedString
  }[]
  title: LocalizedString
}

export const categoriesQuery = groq`*[_type == "categoryType"] | order(displayOrder asc) {
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
    "title": {
      "en": title.en,
      "fr": title.fr,
    },
    "slug": {
      "en": slug.en.current,
      "fr": slug.fr.current,
    },
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
  "posts": *[_type == "postType" && references(^._id)]{
    ${postsProjection}
  },
  "subCategories": subCategories[]->{
    "title": {
      "en": title.en,
      "fr": title.fr,
    },
    "slug": {
      "en": slug.en.current,
      "fr": slug.fr.current,
    },
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
