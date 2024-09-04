import groq from "groq"
import type { SanityClient } from "@sanity/client"
import type { ImageCrop, ImageHotspot, ImageMetadata, Slug } from "sanity"
import { PortableTextBlock } from "@sanity/types"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { Category } from "./categories"
import { Tag } from "./tags"
import { Author } from "./authors"

export const algoliaPostsProjection = `{
  "objectID": _id,
  "title": title.en,
  "slug": slug.en.current,
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  "excerpt": excerpt.en,
  "body": body[_type == "block" && style == "normal"]{
    "text": children[].text
  }[].text[],
  "author": {
    "name": author->name,
    "slug": author->slug.current,
  },
  "categories": categories[]->{
    "title": title.en,
    "slug": slug.en.current,
  },
}`

export const algoliaPostsQuery = groq`*[_type == "postType"] | order(publishedAt desc) ${algoliaPostsProjection}`

export async function getAlgoliaPosts(client: SanityClient) {
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
  "categories": categories[]->{
    "title": {
      "en": title.en,
      "fr": title.fr,
    },
    "slug": {
      "en": slug.en.current,
      "fr": slug.fr.current,
    },
  },
  mainImage{
    ...,
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
`

export const postsQuery = groq`*[_type == "postType" && defined(slug[$language].current)] | order(publishedAt desc){
  ${postsProjection}
}`

export async function getPosts(client: SanityClient, language: string) {
  const result = await client.fetch(postsQuery, { language })
  return Object.values(sanitizeStrings(result)) as Post[]
}

export const featuredPostsQuery = groq`*[_type == "featuredPostsConfig"][0]{
  "featuredPosts": featuredPosts[]->{
    ${postsProjection}
  },
}`

export async function getFeaturedPosts(client: SanityClient, language: string) {
  const result = await client.fetch(featuredPostsQuery, { language })
  return Object.values(sanitizeStrings(result.featuredPosts)) as Post[]
}

export const trendingPostsQuery = groq`*[_type == "featuredPostsConfig"][0]{
  "trendingPosts": trendingPosts[]->{
    ${postsProjection}
  }
}`

export async function getTrendingPosts(client: SanityClient, language: string) {
  const result = await client.fetch(trendingPostsQuery, { language })
  return Object.values(sanitizeStrings(result.trendingPosts)) as Post[]
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
  "categories": categories[]->{
    "title": {
      "en": title.en,
      "fr": title.fr,
    },
    "slug": {
      "en": slug.en.current,
      "fr": slug.fr.current,
    },
  },
  mainImage{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  "excerpt": {
    "en": excerpt.en,
    "fr": excerpt.fr,
  },
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
  isSponsored,
  sponsoredText,
  byline,
  "body": body[] {
    ...,
    ...select(
      _type == 'inlineAdType' => {
        enabledUntil,
        adUrl,
        adCode,
        adWidth,
        adHeight,
        adImage {
          ...,
          "id": asset._ref,
          "preview": asset->metadata.lqip,
          "metadata": asset->metadata,
          "hotspot": asset->hotspot,
          "crop": asset->crop,
          "aspectRatio": asset->metadata.dimensions.aspectRatio,
        },
      },
      _type == 'galleryType' => {
        display,
        images[] {
          ...,
          "id": asset._ref,
          "preview": asset->metadata.lqip,
          "metadata": asset->metadata,
          "hotspot": asset->hotspot,
          "crop": asset->crop,
          "aspectRatio": asset->metadata.dimensions.aspectRatio,
        },
      },
      _type == "image" => {
        ...,
        "id": asset._ref,
        "preview": asset->metadata.lqip,
        "metadata": asset->metadata,
        "hotspot": asset->hotspot,
        "crop": asset->crop,
        "aspectRatio": asset->metadata.dimensions.aspectRatio,
      },
    ),
  },
  // not sure why authorsProjection wont work here 😢
  "author": author->{
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
    image{
      ...,
      "id": asset._ref,
      "preview": asset->metadata.lqip,
    },
  },
  "categories": categories[]->{
    "title": {
      "en": title.en,
      "fr": title.fr,
    },
    "slug": {
      "en": slug.en.current,
      "fr": slug.fr.current,
    },
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
  "showDate": showDate,
  mainImageFullBleed,
  mainImageGradientOverlay,
  mainImageCaption,
  mainImageAttribution,
  mainImageAttributionUrl,
  mainImage{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  "previousPost": *[_type == "postType" && ^.publishedAt > publishedAt]|order(publishedAt desc)[0]{ 
    ${previousOrNextPostProjection}
  },
  "nextPost": *[_type == "postType" && ^.publishedAt < publishedAt]|order(publishedAt asc)[0]{ 
    ${previousOrNextPostProjection}
  },
}`

export async function getPost(
  client: SanityClient,
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
  categories: {
    title: Category["title"]
    slug: Category["slug"]
  }[]
  showDate: boolean
  mainImageFullBleed: boolean
  mainImageGradientOverlay: boolean
  mainImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
  excerpt: LocalizedString
}

export type PostPreview = {
  _type: "post"
  _id: string
  _createdAt: string
  language: "en" | "fr"
  title: LocalizedString
  author: Author
  slug: {
    en: Slug
    fr: Slug
  }
  excerpt: LocalizedString
  categories: {
    title: Category["title"]
    slug: Category["slug"]
  }[]
  mainImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
    metadata: ImageMetadata
  }
}
export type Post = PostPreview & {
  body: PortableTextBlock[]
  tags: {
    title: Tag["title"]
    slug: Tag["slug"]
  }[]
  previousPost?: NextOrPreviousPostType
  nextPost?: NextOrPreviousPostType
  isSponsored?: boolean
  sponsoredText?: string
  byline?: PortableTextBlock[]
  subCategories: {
    title: Category["title"]
    slug: Category["slug"]
  }[]
  showDate: boolean
  mainImageCaption: string
  mainImageAttribution: string
  mainImageAttributionUrl: string
  mainImageFullBleed: boolean
  mainImageGradientOverlay: boolean
}

export type AlgoliaPost = {
  objectID: string
  title: string
  slug: string
  mainImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
  excerpt: LocalizedString
  body: string
  categories: {
    title: string
    slug: string
  }[]
  __position: number
  __queryID?: string | undefined
}
