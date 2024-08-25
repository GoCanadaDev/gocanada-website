import { Image } from "~/components/Image"
import { ImageProps } from "~/components/portable/GalleryImages/index"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { cn } from "~/lib/utils"

export type SingleImageProps = {
  value: ImageProps
  className?: string
  isInGrid?: boolean
}

export const SingleImage = ({
  value,
  className,
  isInGrid,
}: SingleImageProps) => {
  if (!value || !value?.asset?._ref) return null

  return (
    <figure className={value.fullBleed ? "full-bleed" : undefined}>
      <AspectRatio
        ratio={
          value.metadata?.dimensions.aspectRatio ??
          (value.metadata?.dimensions.width ?? 1) /
            (value.metadata?.dimensions.height ?? 1)
        }
        className="relative overflow-hidden [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
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
      {value.attribution || value.caption ? (
        <div className={value.fullBleed ? "holy-grail" : undefined}>
          <figcaption className="flex justify-between">
            {value.caption ? (
              <span className="flex-1">{value.caption}</span>
            ) : null}
            {value.attribution ? (
              <span className="flex-1 text-right">
                {isInGrid ? "Photos" : "Photo"} by{" "}
                {value.attributionUrl ? (
                  <a href={value.attributionUrl}>{value.attribution}</a>
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
