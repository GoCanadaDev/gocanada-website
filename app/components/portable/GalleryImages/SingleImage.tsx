import { Image } from "~/components/Image"
import { ImageProps } from "~/components/portable/GalleryImages/index"
import { cn } from "~/lib/utils"

export type SingleImageProps = {
  value: ImageProps
  className?: string
}

export const SingleImage = ({ value, className }: SingleImageProps) => {
  if (!value || !value?.asset?._ref) return null

  return (
    <figure className={value.fullBleed ? "full-bleed" : undefined}>
      <Image
        id={value?.asset?._ref}
        width={640}
        preview={value.preview}
        loading="lazy"
        className={cn("pointer-events-none w-full", className)}
        alt={value.alt ?? ""}
      />
      {value.attribution || value.caption ? (
        <div className={value.fullBleed ? "holy-grail" : undefined}>
          <figcaption className="flex justify-between">
            {value.caption ? (
              <span className="flex-1">{value.caption}</span>
            ) : null}
            {value.attribution ? (
              <span className="flex-1 text-right">
                Photo by{" "}
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
