// Alt text rules shared by the Studio validation and the missing-alt report
// script, so both agree on what counts as "missing". Kept free of Sanity
// imports so the script can load it with plain Node.

export type ImageWithAlt = {
  asset?: { _ref?: string }
  alt?: string
}

// An image field with nothing uploaded doesn't need alt text yet.
export function isMissingAlt(
  image: ImageWithAlt | null | undefined
): image is ImageWithAlt & { asset: { _ref: string } } {
  if (!image?.asset?._ref) return false
  return !image.alt?.trim()
}

// Documents created before this only get a warning, so editors can keep
// updating existing posts while the alt text backlog is filled in. Remove
// once scripts/report-missing-alt-text.ts comes back clean.
export const ALT_TEXT_REQUIRED_FROM = "2026-10-29T00:00:00Z"

export function missingAltSeverity(
  documentCreatedAt: string | undefined
): "error" | "warning" {
  if (!documentCreatedAt) return "error"
  return new Date(documentCreatedAt) < new Date(ALT_TEXT_REQUIRED_FROM)
    ? "warning"
    : "error"
}

export type BlockContent = ({
  _type: string
  images?: ImageWithAlt[] | null
  [key: string]: unknown
} & ImageWithAlt)[]

export type PostImages = {
  mainImage?: ImageWithAlt | null
  secondaryImage?: ImageWithAlt | null
  body?: BlockContent | null
  byline?: BlockContent | null
}

export type MissingAltImage = {
  location: string
  assetRef: string
}

// Only the block types whose schema asks for alt text. Inline ad images
// don't have an alt field, so they're left alone.
export function findBlockImagesMissingAlt(
  label: string,
  blocks?: BlockContent | null
): MissingAltImage[] {
  return (blocks ?? []).flatMap((block, index) => {
    const location = `${label} block ${index + 1}`
    if (block._type === "image") {
      return missingAltAt(location, block)
    }
    if (block._type === "galleryType") {
      return (block.images ?? []).flatMap((image, imageIndex) =>
        missingAltAt(`${location}, gallery image ${imageIndex + 1}`, image)
      )
    }
    return []
  })
}

export function findPostImagesMissingAlt(post: PostImages): MissingAltImage[] {
  return [
    ...missingAltAt("Main image", post.mainImage),
    ...missingAltAt("Secondary image", post.secondaryImage),
    ...findBlockImagesMissingAlt("Body", post.body),
    ...findBlockImagesMissingAlt("Byline", post.byline),
  ]
}

function missingAltAt(
  location: string,
  image?: ImageWithAlt | null
): MissingAltImage[] {
  return isMissingAlt(image) ? [{ location, assetRef: image.asset._ref }] : []
}
