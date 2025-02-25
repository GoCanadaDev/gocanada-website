import groq from "groq"
import type { SanityClient } from "@sanity/client"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { ImageCrop, ImageHotspot } from "sanity"
import { PortableTextBlock } from "@sanity/types"

export type PopupPromoConfig = {
  popupPromoEnabled: boolean
  popupImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
  popupTitle: string
  popupCopy: PortableTextBlock[]
  popupButtonText: string
  popupButtonUrl: string
}

export const popupPromoConfigQuery = groq`*[_type == "popupPromoConfigType"][0] {
  popupPromoEnabled,
  popupImage{
    ...,
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "metadata": asset->metadata,
    "hotspot": hotspot,
    "crop": crop,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  popupTitle,
  "popupCopy": popupCopy[] {
    ...,
    ...select(
      _type == "image" => {
        ...,
        "id": asset._ref,
        "preview": asset->metadata.lqip,
        "metadata": asset->metadata,
        "hotspot": hotspot,
        "crop": crop,
        "aspectRatio": asset->metadata.dimensions.aspectRatio,
      },
    ),
  },
  popupButtonText,
  popupButtonUrl,
}`

export async function getPopupPromoConfig(client: SanityClient) {
  const result = await client.fetch(popupPromoConfigQuery)
  return sanitizeStrings(result) as PopupPromoConfig
}
