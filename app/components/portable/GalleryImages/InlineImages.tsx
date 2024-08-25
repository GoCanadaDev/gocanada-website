import { GalleryImagesProps } from "~/components/portable/GalleryImages/index"
import { Image } from "~/components/Image"

export const InlineImages = ({ value }: GalleryImagesProps) => {
  if (!value) return null

  const attribution =
    value.images[0]?.attribution ?? value.images[1]?.attribution ?? ""
  const caption = value.images[0]?.caption ?? value.images[1]?.caption ?? ""
  const attributionUrl =
    value.images[0]?.attributionUrl ?? value.images[1]?.attributionUrl ?? ""

  return (
    <figure>
      <div
        className={`grid grid-cols-1 gap-8 md:grid-cols-${value.images.length}`}
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
                className="pointer-events-none !m-0 h-full w-full object-cover"
              />
            </div>
          ))}
      </div>
      {attribution || caption ? (
        <figcaption className="mt-2 flex justify-between">
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
      ) : null}
    </figure>
  )
}
