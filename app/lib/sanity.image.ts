import createImageUrlBuilder from "@sanity/image-url"
import type { Image } from "sanity"

import { dataset, projectId } from "~/sanity/projectDetails"

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
})

export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder
    ?.image(source)
    .auto("format") // Automatically choose the best format (WebP, AVIF, etc.)
    .quality(70) // Lower quality slightly to reduce payload size
    .fit("max") // Ensure the image fits within the specified dimensions
    .dpr(1) // Set device pixel ratio to 1 for better caching
}

// Helper function to generate srcSet for responsive images
export const generateSrcSet = (
  source: Image,
  widths: number[] = [400, 800, 1200, 1600, 1920, 2560]
): string | undefined => {
  if (!source?.asset?._ref) {
    return undefined
  }

  const srcSet = widths
    .map((width) => {
      const url = imageBuilder
        ?.image(source)
        .width(width)
        .auto("format")
        .quality(70)
        .fit("max")
        .dpr(1)
        .url()
      return url ? `${url} ${width}w` : null
    })
    .filter(Boolean)
    .join(", ")

  return srcSet || undefined
}

// Helper function to generate a blur placeholder
export const generateBlurPlaceholder = (source: Image) => {
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder
    ?.image(source)
    .width(20) // Very small size for blur
    .blur(10) // Add blur effect
    .auto("format")
    .quality(20) // Very low quality for placeholder
    .url()
}
