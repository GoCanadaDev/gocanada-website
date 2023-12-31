import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import type { ImageAsset, Slug } from "sanity"
import { PortableTextBlock } from "@sanity/types"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

export const postsQuery = groq`*[_type == "postType" && defined(slug[$language].current)] | order(_createdAt desc){
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
  body,
  "author": {
    "name": author->name,
    "slug": author->slug.current,
    "imageUrl": author->image.asset._ref,
  },
  "category": category->title[$language],
  "tags": tags[]->title[$language],
  "language": $language,
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
  },
}`

export async function getPosts(client: SanityStegaClient, language: string) {
  const result = await client.fetch(postsQuery, { language })
  return Object.values(sanitizeStrings(result)) as Post[]
}

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
  "body": body[] {
    ...,
    ...select(
      _type == "image" => {
        ...,
        "id": asset._ref,
        "preview": asset->.metadata.lqip
      } 
    )
  },
  "author": {
    "name": author->name,
    "slug": author->slug.current,
    "image": author->image,
  },
  "category": category->title[$language],
  "categorySlugs": {
    "en": category->slug.en.current,
    "fr": category->slug.fr.current,
  },
  "tags": tags[]->title[$language],
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
) {
  const result = await client.fetch(postBySlugQuery, {
    slug,
    language,
  })

  return sanitizeStrings(result) as Post
}

export type PostPreview = {
  _type: "post"
  _id: string
  _createdAt: string
  language: "en" | "fr"
  title: LocalizedString
  slug: {
    en: Slug
    fr: Slug
  }
  category: string
  categorySlugs: LocalizedString
  mainImage: {
    id: string
    preview: string
  }
}
export type Post = PostPreview & {
  body: PortableTextBlock[]
  author: {
    name: string
    slug: Slug
    image: ImageAsset
  }
  tags: string[]
  excerpt: LocalizedString
}
