import { Image } from "~/components/Image"
import { ExternalLink } from "lucide-react"
import { Separator } from "~/components/ui/separator"

export type SingleImageProps = {
  value?: {
    id: string
    preview: string
    attribution?: string
    attributionUrl?: string
    caption?: string
    alt?: string
    fullBleed?: boolean
  }
}
export const SingleImage = ({ value }: SingleImageProps) => {
  if (!value) return null
  return (
    <figure className={value.fullBleed ? "full-bleed" : undefined}>
      <Image
        id={value.id}
        width={640}
        preview={value.preview}
        loading="lazy"
        className="w-full"
        alt={value.alt ?? ""}
      />
      {value.attribution || value.caption ? (
        <div className={value.fullBleed ? "holy-grail" : undefined}>
          <figcaption className="flex justify-between">
            {value.caption ? (
              <span className="flex-1 italic">{value.caption}</span>
            ) : null}
            {value.attribution ? (
              <span className="flex-1 text-right">
                Photo by{" "}
                {value.attributionUrl ? (
                  <a href={value.attributionUrl}>
                    {value.attribution}{" "}
                    <ExternalLink className="inline h-4 w-4" />
                  </a>
                ) : (
                  value.attribution
                )}
              </span>
            ) : null}
          </figcaption>
          <Separator className="my-8" />
        </div>
      ) : null}
    </figure>
  )
}
