import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import type { ImageAsset, Slug } from "sanity"
import { PortableTextBlock } from "@sanity/types"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { Category } from "./categories"
import { Tag } from "./tags"

export const algoliaPostsProjection = `{
  "objectID": _id,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  "excerpt": {
    "en": excerpt.en,
    "fr": excerpt.fr,
  },
  "author": {
    "name": author->name,
    "slug": author->slug.current,
  },
  "category": {
    "title": {
      "en": category->title.en,
      "fr": category->title.fr,
    },
    "slug": {
      "en": category->slug.en.current,
      "fr": category->slug.fr.current,
    },
  },
  "tags": tags[]->{
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

export const algoliaPostsQuery = groq`*[_type == "postType"] | order(_createdAt desc) ${algoliaPostsProjection}`

export async function getAlgoliaPosts(client: SanityStegaClient) {
  const result = await client.fetch(algoliaPostsQuery)

  return Object.values(sanitizeStrings(result)) as Post[]
}

export const postsProjection = `
  _id,
  _createdAt,
  "language": $language,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  "category": {
    "title": {
      "en": category->title.en,
      "fr": category->title.fr,
    },
    "slug": {
      "en": category->slug.en.current,
      "fr": category->slug.fr.current,
    },
  },
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  "excerpt": {
    "en": excerpt.en,
    "fr": excerpt.fr,
  },
`

export const postsQuery = groq`*[_type == "postType" && defined(slug[$language].current)] | order(_createdAt desc){
  ${postsProjection}
}`

export async function getPosts(client: SanityStegaClient, language: string) {
  const result = await client.fetch(postsQuery, { language })
  return Object.values(sanitizeStrings(result)) as Post[]
}

export const latestPostsQuery = groq`*[_type == "postType" && defined(slug[$language].current)][0...5] | order(_createdAt desc){
  ${postsProjection}
}`

export async function getLatestPosts(
  client: SanityStegaClient,
  language: string
) {
  const result = await client.fetch(postsQuery, { language })
  return Object.values(sanitizeStrings(result)) as Post[]
}

export const trendingPostsQuery = groq`*[_type == "postType" && defined(slug[$language].current)][0...3] | order(_createdAt desc){
  ${postsProjection}
}`

export async function getTrendingPosts(
  client: SanityStegaClient,
  language: string
) {
  const result = await client.fetch(trendingPostsQuery, { language })
  return Object.values(sanitizeStrings(result)) as Post[]
}

const previousOrNextPostProjection = `
"title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
  _id,
  _createdAt,
  "language": $language,
  "category": {
    "title": {
      "en": category->title.en,
      "fr": category->title.fr,
    },
    "slug": {
      "en": category->slug.en.current,
      "fr": category->slug.fr.current,
    },
  },
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  }
`

export const postBySlugQuery = groq`*[_type == "postType" && slug[$language].current == $slug][0]{
  _id,
  _createdAt,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  "slug": {
    "en": slug.en.current,
    "fr": slug.fr.current,
  },
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
    "bio": author->bio,
  },
  "category": {
    "title": {
      "en": category->title.en,
      "fr": category->title.fr,
    },
    "slug": {
      "en": category->slug.en.current,
      "fr": category->slug.fr.current,
    },
  },
  "tags": tags[]->{
    ...,
    "title": {
      "en": title.en,
      "fr": title.fr,
    },
    "slug": {
      "en": slug.en.current,
      "fr": slug.fr.current,
    },
  },
  "language": $language,
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  "previousPost": *[_type == "postType" && count((tags[]->tag)[@ in ^.^.tags[]->tag]) > 0 && ^._createdAt > _createdAt]|order(_createdAt desc)[0]{ 
    ${previousOrNextPostProjection}
  },
  "nextPost": *[_type == "postType" && count((tags[]->tag)[@ in ^.^.tags[]->tag]) > 0 && ^._createdAt < _createdAt]|order(_createdAt asc)[0]{ 
    ${previousOrNextPostProjection}
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

export type NextOrPreviousPostType = {
  _id: string
  _createdAt: string
  language: "en" | "fr"
  title: LocalizedString
  slug: {
    en: Slug
    fr: Slug
  }
  category: {
    title: Category["title"]
    slug: Category["slug"]
  }
  mainImage: {
    id: string
    preview: string
    aspectRatio: number
  }
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
  excerpt: LocalizedString
  category: {
    title: Category["title"]
    slug: Category["slug"]
  }
  mainImage: {
    id: string
    preview: string
    aspectRatio: number
  }
}
export type Post = PostPreview & {
  body: PortableTextBlock[]
  author: {
    name: string
    slug: Slug["current"]
    image: ImageAsset
    bio: LocalizedString
  }
  tags: {
    title: Tag["title"]
    slug: Tag["slug"]
  }[]
  previousPost?: NextOrPreviousPostType
  nextPost?: NextOrPreviousPostType
}

export type AlgoliaPost = {
  objectID: string
  title: LocalizedString
  slug: {
    en: Slug
    fr: Slug
  }
  mainImage: {
    id: string
    preview: string
    aspectRatio: number
  }
  excerpt: LocalizedString
  category: {
    title: Category["title"]
    slug: Category["slug"]
  }
  __position: number
  __queryID?: string | undefined
}
