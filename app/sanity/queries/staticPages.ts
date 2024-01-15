import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { PortableTextBlock } from "@sanity/types"
import { LocalizedString } from "~/sanity/queries/shared"

export async function getStaticPageByRoute(
  client: SanityStegaClient,
  language: string | undefined,
  route: string
): Promise<StaticPage | null> {
  return await client.fetch<StaticPage | null>(staticPageBySlugQuery, {
    route,
    language,
  })
}

export const staticPageBySlugQuery = groq`*[_type == "staticPageType" && route == $route][0]{
  _id,
  _createdAt,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
  route,
  "body": {
    "en": body.en,
    "fr": body.fr,
  },
  "language": $language,
}`

// get all staticPages where isFooterLink is true
const footerLinksQuery = groq`*[_type == "staticPageType" && isFooterLink == true]{
  _id,
  _createdAt,
   route,
  "language": $language,
  "title": {
    "en": title.en,
    "fr": title.fr,
  },
}`

export async function getFooterLinks(
  client: SanityStegaClient,
  language: string | undefined
): Promise<StaticPageRoute[]> {
  return await client.fetch<StaticPage[]>(footerLinksQuery, {
    language,
  })
}

export type StaticPageRoute = {
  _type: "staticPageType"
  _id: string
  _createdAt: string
  route: string
  language: "en" | "fr"
  title: LocalizedString
}

export type StaticPage = {
  body: {
    en: PortableTextBlock[]
    fr: PortableTextBlock[]
  }
} & StaticPageRoute
