import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

export type SitemapSlugs = {
  slug: string
  subCategories?: { slug: string }[]
}

const sitemapQuery = groq`*[_type in ["postType", "authorType", "staticPageType", "categoryType"]]{
    _type == "postType" => {
      "slug": "en/" + slug.en.current
    },
    _type == "authorType" => {
      "slug": "en/authors/" + slug.current
    },
    _type == "staticPageType" => {
      "slug": "en" + route
    },
    _type == "categoryType" => {
      "slug": "en/categories/" + slug.en.current,
      subCategories[]->{
        "slug": "en/categories/" + ^.slug.en.current + "/" + slug.en.current
      }
    }
}
`

export async function getSitemapSlugs(client: SanityClient) {
  const result = await client.fetch(sitemapQuery)
  return Object.values(sanitizeStrings(result)) as SitemapSlugs[]
}
