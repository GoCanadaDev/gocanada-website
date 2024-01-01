import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { SupportedLanguages } from "~/i18n"

export type Tag = {
  title: LocalizedString
  slug: LocalizedString
  description: LocalizedString
  language: SupportedLanguages
}

export const tagsQuery = groq`*[_type == "tagType"] | order(_createdAt desc) {
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

export async function getTags(client: SanityStegaClient, language: string) {
  const result = await client.fetch(tagsQuery, { language })
  return Object.values(sanitizeStrings(result)) as Tag[]
}

export const tagBySlugQuery = groq`*[_type == "tagType" && slug[$language].current == $slug][0]{
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
}`

export async function getTag(
  client: SanityStegaClient,
  slug: string,
  language: string
) {
  const result = await client.fetch(tagBySlugQuery, {
    slug,
    language,
  })
  return sanitizeStrings(result) as Tag
}
