// Alt text rules shared by the Studio validation and the missing-alt report
// and drafting scripts, so both agree on what counts as "missing". Kept free of Sanity
// imports so the script can load it with plain Node.

export type ImageWithAlt = {
  _key?: string
  asset?: { _ref?: string }
  alt?: string
  caption?: string
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
  // Human-readable position, for editors
  location: string
  // Sanity patch path to the image, e.g. body[_key=="abc"].images[_key=="def"]
  path: string
  assetRef: string
  caption?: string
}

// Only the block types whose schema asks for alt text. Inline ad images
// don't have an alt field, so they're left alone.
export function findBlockImagesMissingAlt(
  label: string,
  path: string,
  blocks?: BlockContent | null
): MissingAltImage[] {
  return (blocks ?? []).flatMap((block, index) => {
    const location = `${label} block ${index + 1}`
    const blockPath = `${path}[_key=="${block._key}"]`
    if (block._type === "image") {
      return missingAltAt(location, blockPath, block)
    }
    if (block._type === "galleryType") {
      return (block.images ?? []).flatMap((image, imageIndex) =>
        missingAltAt(
          `${location}, gallery image ${imageIndex + 1}`,
          `${blockPath}.images[_key=="${image._key}"]`,
          image
        )
      )
    }
    return []
  })
}

export function findPostImagesMissingAlt(post: PostImages): MissingAltImage[] {
  return [
    ...missingAltAt("Main image", "mainImage", post.mainImage),
    ...missingAltAt("Secondary image", "secondaryImage", post.secondaryImage),
    ...findBlockImagesMissingAlt("Body", "body", post.body),
    ...findBlockImagesMissingAlt("Byline", "byline", post.byline),
  ]
}

function missingAltAt(
  location: string,
  path: string,
  image?: ImageWithAlt | null
): MissingAltImage[] {
  if (!isMissingAlt(image)) return []
  return [
    { location, path, assetRef: image.asset._ref, caption: image.caption },
  ]
}
