import React from "react"
import { GalleryImagesProps } from "~/components/portable/GalleryImages/index"
import { Image } from "~/components/Image"

export const InlineImages = ({ value }: GalleryImagesProps) => {
  if (!value) return null

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-${value.images.length}`}
    >
      {value?.images
        .filter((image) => image?.asset?._ref)
        .map((image) => (
          <div key={image.asset._ref}>
            <Image
              id={image.asset._ref}
              alt={image.alt ?? ""}
              width={640}
              loading="lazy"
              className="pointer-events-none w-full"
            />
          </div>
        ))}
    </div>
  )
}
