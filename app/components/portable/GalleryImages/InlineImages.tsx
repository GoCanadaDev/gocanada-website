import { GalleryImagesProps } from "~/components/portable/GalleryImages/index"
import { SingleImage } from "./SingleImage"

export const InlineImages = ({ value }: GalleryImagesProps) => {
  if (!value) return null

  const firstAspectRatio = value?.images[0]?.metadata?.dimensions?.aspectRatio

  return (
    <div
      className={`grid grid-cols-1 gap-8 md:grid-cols-${value.images.length}`}
    >
      {value?.images
        .filter((image) => image?.asset?._ref)
        .map((image) => (
          <SingleImage
            key={image.asset._ref}
            inline
            aspectRatio={firstAspectRatio}
            value={{
              asset: image.asset,
              alt: image.alt,
              preview: image.preview,
              metadata: image.metadata,
              hotspot: image.hotspot,
              crop: image.crop,
              attribution: image.attribution,
              attributionUrl: image.attributionUrl,
              caption: image.caption,
            }}
            className=""
          />
        ))}
    </div>
  )
}
