import React from "react"

import { SingleImage } from "~/components/portable/GalleryImages/SingleImage"
import { TwoUpImage } from "~/components/portable/GalleryImages/TwoUpImage"
import { CarouselImages } from "~/components/portable/GalleryImages/CarouselImages"
import { GridImages } from "~/components/portable/GalleryImages/GridImages"
import { InlineImages } from "~/components/portable/GalleryImages/InlineImages"

export type ImageProps = {
  asset: {
    _ref: string
  }
  preview?: string
  attribution?: string
  attributionUrl?: string
  caption?: string
  alt?: string
  fullBleed?: boolean
}

export enum GalleryDisplay {
  Single = "single",
  TwoUp = "twoUp",
  Carousel = "carousel",
  Inline = "inline",
  Grid = "grid",
}

export type GalleryImagesProps = {
  value?: {
    display: GalleryDisplay
    images: ImageProps[]
  }
}

const GalleryImages = ({ value }: GalleryImagesProps) => {
  if (!value || !value?.images?.length) return null

  switch (value.display) {
    case GalleryDisplay.Single: {
      return <SingleImage value={value.images[0]} />
    }
    case GalleryDisplay.TwoUp:
      return (
        <TwoUpImage
          value={{ imageOne: value.images[0], imageTwo: value.images[1] }}
        />
      )
    case GalleryDisplay.Carousel:
      return <CarouselImages value={value} />
    case GalleryDisplay.Grid:
      return <GridImages value={value} />
    case GalleryDisplay.Inline:
    default:
      return <InlineImages value={value} />
  }
}

export default GalleryImages
