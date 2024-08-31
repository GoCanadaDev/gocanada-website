import React from "react"

import { GalleryImagesProps } from "~/components/portable/GalleryImages/index"
import { SingleImage } from "~/components/portable/GalleryImages/SingleImage"

export const GridImages = ({ value }: GalleryImagesProps) => {
  if (!value || !value.images || value.images.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-8 [&>figure]:m-0">
      {value?.images?.map((image) => {
        if (!image || !image.asset?._ref) return null
        return (
          <SingleImage
            value={image}
            key={image.asset._ref}
            className="aspect-square object-cover"
            isInGrid
            square
          />
        )
      })}
    </div>
  )
}
