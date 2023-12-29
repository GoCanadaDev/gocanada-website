import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import type { ImageAsset, Slug } from "sanity"
import { PortableTextBlock } from "@sanity/types"

export const HOME_QUERY = groq`*[_id == "home"][0]{ title, siteTitle }`

export const postsQuery = groq`*[_type == "postType" && language == $language && defined(slug.current)] | order(_createdAt desc){
  _id,
  title,
  slug,
  language,
  _createdAt,
  excerpt,
  body,
  "author": {
    "name": author->name,
    "slug": author->slug.current,
    "imageUrl": author->image.asset._ref,
  },
  "category": category->title,
  "tags": tags[]->title,
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    _createdAt,
    title,
    slug,
    language,
    excerpt,
    body,
    "author": {
      "name": author->name,
      "slug": author->slug.current,
      "imageUrl": author->image.asset._ref,
    },
    "category": category->title,
    "tags": tags[]->title,
    mainImage{
      "id": asset._ref,
      "preview": asset->metadata.lqip,
    }
  },
}`

export async function getPosts(
  client: SanityStegaClient,
  language: string
): Promise<Post[]> {
  return await client.fetch(postsQuery, { language })
}

export const postBySlugQuery = groq`*[_type == "postType" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  language,
  _createdAt,
  excerpt,
  body,
  excerpt,
  body,
  "author": {
    "name": author->name,
    "slug": author->slug.current,
    "image": author->image,
  },
  "category": category->title,
  "tags": tags[]->title,
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    _createdAt,
    title,
    slug,
    language,
    excerpt,
    body,
    "author": {
      "name": author->name,
      "slug": author->slug.current,
      "image": author->image,
    },
    "category": category->title,
    "tags": tags[]->title,
    mainImage{
      "id": asset._ref,
      "preview": asset->metadata.lqip,
    }
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

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export type PostPreview = {
  _type: "post"
  _id: string
  _createdAt: string
  _translations?: Post[]
  language: "en" | "fr"
  title: string
  slug: Slug
  category: string
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
  excerpt: string
}

// https://www.sanity.io/schemas/get-the-categories-subcategories-an-author-has-written-for-a0ff8d4d
// export const authors = groq`
//   *[_type == 'author' && slug.current == $slug && archived == false][0]{
//     _id,
//   _updatedAt,
//   name,
//   'slug': slug.current,
//   role,
//   image,
//   bio,
//   socialMedia,
//   }
// `

// *[_id == $authorId][0] {
//   "subcategories": array::unique(*[_id in *[_type == "post" && references(^.^._id)].subcategory._ref])[] {
//     _id,
//     "path": "/news/" + parent->.slug.current + "/" + slug.current,
//     title
//   }
// }

// Get current, previous and next post, filtered by tags
// https://www.sanity.io/schemas/get-current-previous-and-next-post-filtered-by-tags-e14e0251
// *[_type == $type && slug.current == $slug]{
//     "current": {
//       "slug": slug.current, title, publicReleaseDate, "tags": tags[]->tag
//     },
//     "previous": *[_type == $type && count((tags[]->tag)[@ in ^.^.tags[]->tag]) > 0 && ^.publicReleaseDate > publicReleaseDate]|order(publicReleaseDate desc)[0]{
//         "slug": slug.current, title, publicReleaseDate, "tags": tags[]->tag
//     },
//     "next": *[_type == $type && count((tags[]->tag)[@ in ^.^.tags[]->tag]) > 0 && ^.publicReleaseDate < publicReleaseDate]|order(publicReleaseDate asc)[0]{
//         "slug": slug.current, title, publicReleaseDate, "tags": tags[]->tag
//     },
// }|order(publicReleaseDate)[0]
