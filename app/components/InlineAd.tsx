import { SanityImage } from "sanity-image"
import { baseUrl } from "~/sanity/projectDetails"
import { ImageCrop, ImageHotspot } from "sanity"
import { useEffect, useState } from "react"

export type InlineAdProps = {
  enabledUntil?: string
  adUrl: string
  adCode?: string
  adWidth: number
  adHeight: number
  adImage: {
    id: string
    preview: string
    aspectRatio: number
    hotspot?: ImageHotspot
    crop?: ImageCrop
  }
}
export default function InlineAd({
  value: { enabledUntil, adUrl, adCode, adWidth, adHeight, adImage },
}: {
  value: InlineAdProps
}) {
  const formattedDate = new Date(enabledUntil ?? "").toLocaleDateString(
    `en-CA`,
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  )
  const [today, setToday] = useState<string | null>(null)

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(`en-CA`, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    )
  }, [])

  if (
    today &&
    typeof enabledUntil === "string" &&
    new Date(today).getTime() > new Date(formattedDate).getTime()
  ) {
    return null
  }

  return (
    <div className="relative my-8 border bg-zinc-100 dark:bg-zinc-800">
      <div className="absolute right-0 top-0 z-10 size-6 rounded-bl-sm border-b border-l bg-zinc-50 text-center font-sans text-xs uppercase leading-6 dark:bg-zinc-950">
        ad
      </div>
      <div className="py-0 md:py-4">
        <div className="py-0 md:px-[3.5vw]">
          <div className="m-auto max-w-4xl">
            <div
              style={{
                position: "relative",
                aspectRatio: adWidth / adHeight,
                maxHeight: adHeight,
                maxWidth: adWidth,
                margin: "0 auto",
              }}
            >
              <div className="absolute inset-0">
                {typeof adCode === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: adCode }} />
                ) : (
                  <a href={adUrl} target="_blank" rel="noopener">
                    <SanityImage
                      id={adImage.id}
                      baseUrl={baseUrl}
                      preview={adImage.preview}
                      width={adWidth}
                      height={adHeight}
                      className="m-auto"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
