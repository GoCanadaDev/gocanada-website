import { Image } from "~/components/Image"
import { ImageProps } from "~/components/portable/GalleryImages/index"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { cn } from "~/lib/utils"

export type SingleImageProps = {
  value: ImageProps
  className?: string
  square?: boolean
  inline?: boolean
  hideAttribution?: boolean
  aspectRatio?: number
}

export const SingleImage = ({
  value,
  className,
  square,
  inline,
  hideAttribution,
  aspectRatio,
}: SingleImageProps) => {
  if (!value || !value?.asset?._ref) return null

  // commented out for now, but remove the false to make portrait images have some margins to not be so long
  const isPortrait =
    false && !inline && Boolean(value.metadata?.dimensions.aspectRatio < 1)

  return (
    <figure
      className={cn("", {
        "full-bleed": value.fullBleed,
        "lg:!mx-24": isPortrait && !square,
      })}
    >
      <AspectRatio
        ratio={
          inline
            ? aspectRatio
            : square
              ? 1
              : (value.metadata?.dimensions.aspectRatio ??
                (value.metadata?.dimensions.width ?? 1) /
                  (value.metadata?.dimensions.height ?? 1))
        }
        className={cn(
          "relative overflow-hidden [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
        )}
      >
        <Image
          id={value?.asset?._ref}
          preview={value.preview}
          loading="lazy"
          className={cn(
            "pointer-events-none absolute block h-full w-full object-cover object-center",
            className
          )}
          alt={value.alt ?? ""}
          width={1024}
        />
      </AspectRatio>
      {(!hideAttribution && value.attribution) || value.caption ? (
        <div className={value.fullBleed ? "holy-grail" : undefined}>
          <figcaption className="flex justify-between font-sans text-sm">
            {value.caption ? (
              <span className="flex-1">{value.caption}</span>
            ) : null}
            {value.attribution ? (
              <span className="flex-1 text-right">
                {value.attributionUrl ? (
                  <a
                    href={value.attributionUrl}
                    className="!border-0 !font-normal"
                  >
                    {value.attribution}
                  </a>
                ) : (
                  value.attribution
                )}
              </span>
            ) : null}
          </figcaption>
        </div>
      ) : null}
    </figure>
  )
}
