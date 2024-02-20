import { Image } from "~/components/Image"
import { ExternalLink } from "lucide-react"
import { Separator } from "~/components/ui/separator"

export type TwoUpImageProps = {
  value?: {
    altOne?: string
    altTwo?: string
    attribution?: string
    attributionUrl?: string
    caption?: string
    fullBleed?: boolean
    imageOne: {
      type: string
      asset: {
        _ref: string
      }
    }
    imageTwo: {
      type: string
      asset: {
        _ref: string
      }
    }
    preview: string
  }
}
export const TwoUpImage = ({ value }: TwoUpImageProps) => {
  if (!value) return null
  console.log(value)
  return (
    <figure className={value.fullBleed ? "full-bleed" : undefined}>
      <div className="grid grid-cols-2 gap-4">
        <Image
          id={value.imageOne.asset._ref}
          width={640}
          preview={value.preview}
          loading="lazy"
          className="w-full"
          alt={value.altOne ?? ""}
        />
        <Image
          id={value.imageTwo.asset._ref}
          width={640}
          preview={value.preview}
          loading="lazy"
          className="w-full"
          alt={value.altTwo ?? ""}
        />
      </div>
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
