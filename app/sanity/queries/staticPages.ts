import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { PortableTextBlock } from "@sanity/types"
import { LocalizedString } from "~/sanity/queries/shared"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { ImageCrop, ImageHotspot } from "sanity"

export async function getStaticPageByRoute(
  client: SanityClient,
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
    "en": body.en[] {
      ...,
      ...select(
        _type == 'galleryType' => {
          display,
          images[] {
            ...,
            "id": asset._ref,
            "preview": asset->.metadata.lqip,
            "metadata": asset->metadata,
            "hotspot": asset->hotspot,
            "crop": asset->crop,
          },
        },
        _type == "image" => {
          ...,
          "id": asset._ref,
          "preview": asset->.metadata.lqip,
          "metadata": asset->metadata,
          "hotspot": asset->hotspot,
          "crop": asset->crop,
        },
      ),
    },
    "fr": body.fr[] {
      ...,
      ...select(
        _type == 'galleryType' => {
          display,
          images[] {
            ...,
            "id": asset._ref,
            "preview": asset->.metadata.lqip,
            "metadata": asset->metadata,
            "hotspot": asset->hotspot,
            "crop": asset->crop,
          },
        },
        _type == "image" => {
          ...,
          "id": asset._ref,
          "preview": asset->.metadata.lqip,
          "metadata": asset->metadata,
          "hotspot": asset->hotspot,
          "crop": asset->crop,
        },
      ),
    },
  },
  "language": $language,
  mainImage{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  mainImageCaption,
  mainImageAttribution,
  mainImageAttributionUrl,
  mainImageFullBleed,
  mainImageGradientOverlay
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
  client: SanityClient,
  language: string | undefined
): Promise<StaticPageRoute[]> {
  const result = await client.fetch(footerLinksQuery, {
    language,
  })

  return Object.values(sanitizeStrings(result)) as StaticPageRoute[]
}

export type StaticPageRoute = {
  _type: "staticPageType"
  _id: string
  _createdAt: string
  route: string
  language: "en" | "fr"
  title: LocalizedString
  mainImageCaption: string
  mainImageAttribution: string
  mainImageAttributionUrl: string
  mainImageFullBleed: boolean
  mainImageGradientOverlay: boolean
  mainImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
}

export type StaticPage = {
  body: {
    en: PortableTextBlock[]
    fr: PortableTextBlock[]
  }
} & StaticPageRoute
