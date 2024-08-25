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
    fullBleed: fullBleedOne,
    preview: previewOne,
    caption: captionOne,
    asset: assetOne,
  } = value.imageOne
  const {
    attribution: attributionTwo,
    attributionUrl: attributionUrlTwo,
    alt: altTwo,
    fullBleed: fullBleedTwo,
    preview: previewTwo,
    caption: captionTwo,
    asset: assetTwo,
  } = value.imageTwo

  const attribution = value.attribution || attributionOne || attributionTwo
  const attributionUrl =
    value.attributionUrl || attributionUrlOne || attributionUrlTwo
  const caption = value.caption || captionOne || captionTwo
  const fullBleed = value.fullBleed || fullBleedOne || fullBleedTwo

  return (
    <div className={value.fullBleed ? "full-bleed" : undefined}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <SingleImage
          value={{
            asset: assetOne,
            alt: value.altOne || altOne,
            preview: previewOne,
            metadata: value.imageOne.metadata,
            hotspot: value.imageOne.hotspot,
            crop: value.imageOne.crop,
          }}
          className="aspect-square object-cover"
        />
        <SingleImage
          value={{
            asset: assetTwo,
            alt: value.altTwo || altTwo,
            preview: previewTwo,
            metadata: value.imageTwo.metadata,
            crop: value.imageTwo.crop,
          }}
          className="aspect-square object-cover"
        />
      </div>
      {attribution || caption ? (
        <div className={fullBleed ? "holy-grail" : undefined}>
          <figcaption className="!-mt-2 flex justify-between">
            {caption ? <span className="flex-1">{caption}</span> : null}
            {attribution ? (
              <span className="flex-1 text-right">
                Photos by{" "}
                {attributionUrl ? (
                  <a href={attributionUrl}>{attribution}</a>
                ) : (
                  attribution
                )}
              </span>
            ) : null}
          </figcaption>
        </div>
      ) : null}
    </div>
  )
}
