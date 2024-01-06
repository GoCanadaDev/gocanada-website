import { Image } from "~/components/Image"
import { ExternalLink } from "lucide-react"
import { Separator } from "~/components/ui/separator"

const PortableTextComponents = {
  types: {
    image: ({
              value,
            }: {
      value: {
        id: string
        preview: string
        attribution?: string
        attributionUrl?: string
        caption?: string
        alt?: string
      }
    }) => {
      return (
        <figure className="full-bleed">
          <Image
            id={value.id}
            width={640}
            preview={value.preview}
            loading="lazy"
            className="w-full"
            alt={value.alt ?? ""}
          />
          {value.attribution || value.caption ? (
            <div className="holy-grail">
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
    },
  },

  // marks: {
  //   link: ({ children, value }) => {
  //     const rel = !value.href.startsWith("/")
  //       ? "noreferrer noopener"
  //       : undefined
  //     return (
  //       <a href={value.href} rel={rel}>
  //         {children}
  //       </a>
  //     )
  //   },
  // },
}


export default PortableTextComponents
