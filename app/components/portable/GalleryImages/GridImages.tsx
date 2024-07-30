import React from "react"

import { GalleryImagesProps } from "~/components/portable/GalleryImages/index"
import { SingleImage } from "~/components/portable/GalleryImages/SingleImage"

export const GridImages = ({ value }: GalleryImagesProps) => {
  if (!value) return null

  return (
    <div className="grid grid-cols-2 gap-4 [&>figure]:m-0">
      {value.images.map((image) => (
        <SingleImage
          value={image}
          key={image.asset._ref}
          className="aspect-square object-cover"
        />
      ))}
    </div>
  )
}
