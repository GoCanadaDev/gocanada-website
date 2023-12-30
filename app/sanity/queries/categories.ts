import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { LocalizedString } from "~/sanity/queries/shared"

export type Category = {
  name: LocalizedString
  description: LocalizedString
}

export const categoriesQuery = groq`*[_type == "categoryType"] | order(_createdAt desc) {
  _id,
  "name": {
    "en": name.en,
    "fr": name.fr,
  },
  "description": {
    "en": description.en,
    "fr": description.fr,
  },
  _createdAt,
  "language": $language,
}`


export async function getCategories(
  client: SanityStegaClient,
  language: string
): Promise<Category[]> {
  return await client.fetch(categoriesQuery, { language })
}
/*
export const postBySlugQuery = groq`*[_type == "postType" && slug[$language].current == $slug][0]{
  _id,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  _createdAt,
  "excerpt": {
    "en": excerpt.en,
    "fr": excerpt.fr,
  },
  body,
  "author": {
    "name": author->name,
    "slug": author->slug.current,
    "image": author->image,
  },
  "category": category->name[$language],
  "tags": tags[]->name[$language],
  "language": $language,
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
  },
}`

export async function getPost(
  client: SanityStegaClient,
  slug: string,
  language: string
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
    language,
  })
}
*/
