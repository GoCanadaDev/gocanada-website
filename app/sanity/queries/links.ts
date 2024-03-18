import groq from "groq"
import type { SanityStegaClient } from "@sanity/client/stega"
import { ImageAsset } from "sanity"

export type LinksPageType = {
  title: string
  leadIn: string
  headerImage: {
    id: string
    preview: string
    aspectRatio: number
  } & ImageAsset
  links: {
    title: string
    url: string
    withImage: boolean
    image: {
      id: string
      preview: string
      aspectRatio: number
    } & ImageAsset
  }[]
}

export const linksQuery = groq`*[_type == "linksPageType"] {
  title,
  leadIn,
  headerImage{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  links[]{
    title,
    url,
    withImage,
    "image": image.asset->{
      ...,
      "id": _id,
      "preview": metadata.lqip,
      "aspectRatio": metadata.dimensions.aspectRatio,
    },
  }
}`

export async function getLinks(client: SanityStegaClient) {
  const result = await client.fetch(linksQuery)

  return result[0] as LinksPageType
}
