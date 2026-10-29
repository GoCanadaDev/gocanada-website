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

type BlockContent = ({
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

export function findPostImagesMissingAlt(post: PostImages): MissingAltImage[] {
  const missing: MissingAltImage[] = []
  const recordIfMissing = (location: string, image?: ImageWithAlt | null) => {
    if (isMissingAlt(image)) {
      missing.push({ location, assetRef: image.asset._ref })
    }
  }

  recordIfMissing("Main image", post.mainImage)
  recordIfMissing("Secondary image", post.secondaryImage)

  // Only the block types whose schema asks for alt text. Inline ad images
  // don't have an alt field, so they're left alone.
  const scanBlocks = (label: string, blocks?: BlockContent | null) => {
    blocks?.forEach((block, index) => {
      const location = `${label} block ${index + 1}`
      if (block._type === "image") {
        recordIfMissing(location, block)
      } else if (block._type === "galleryType") {
        block.images?.forEach((image, imageIndex) =>
          recordIfMissing(`${location}, gallery image ${imageIndex + 1}`, image)
        )
      }
    })
  }

  scanBlocks("Body", post.body)
  scanBlocks("Byline", post.byline)

  return missing
}
