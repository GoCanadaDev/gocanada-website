import { ImageProps } from "~/components/portable/GalleryImages/index"
import { SingleImage } from "~/components/portable/GalleryImages/SingleImage"

export type TwoUpImageProps = {
  value?: {
    imageOne: ImageProps
    imageTwo: ImageProps
    altOne?: string
    altTwo?: string
    attribution?: string
    attributionUrl?: string
    caption?: string
    fullBleed?: boolean
    preview?: string
  }
}
export const TwoUpImage = ({ value }: TwoUpImageProps) => {
  if (!value) return null

  const {
    attribution: attributionOne,
    attributionUrl: attributionUrlOne,
    alt: altOne,
    preview: previewOne,
    caption: captionOne,
    asset: assetOne,
  } = value.imageOne
  const {
    attribution: attributionTwo,
    attributionUrl: attributionUrlTwo,
    alt: altTwo,
    preview: previewTwo,
    caption: captionTwo,
    asset: assetTwo,
  } = value.imageTwo

  return (
    <div className={value.fullBleed ? "full-bleed" : undefined}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <SingleImage
          value={{
            asset: assetOne,
            alt: altOne,
            preview: previewOne,
            metadata: value.imageOne.metadata,
            hotspot: value.imageOne.hotspot,
            crop: value.imageOne.crop,
            attribution: attributionOne,
            attributionUrl: attributionUrlOne,
            caption: captionOne,
          }}
          square
        />
        <SingleImage
          value={{
            asset: assetTwo,
            alt: altTwo,
            preview: previewTwo,
            metadata: value.imageTwo.metadata,
            crop: value.imageTwo.crop,
            attribution: attributionTwo,
            attributionUrl: attributionUrlTwo,
            caption: captionTwo,
          }}
          square
        />
      </div>
    </div>
  )
}
