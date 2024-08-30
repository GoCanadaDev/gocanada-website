import { SanityImage } from "sanity-image"
import { cn } from "~/lib/utils"
import { baseUrl } from "~/sanity/projectDetails"
import { Typography } from "./Typography"
import { Link, useParams } from "@remix-run/react"
import { Post } from "~/sanity/queries"
import { ImageCrop, ImageHotspot } from "sanity"

type HeroImageProps = {
  id: string
  title: string
  category?: Post["categories"][0]
  preview: string
  mainImageCaption?: string
  mainImageAttribution?: string
  mainImageAttributionUrl?: string
  mainImageGradientOverlay?: boolean
  fullBleed?: boolean
  hotspot?: ImageHotspot
  crop?: ImageCrop
  aspectRatio?: number
  isSponsored?: Post["isSponsored"]
  sponsoredText?: Post["sponsoredText"]
}

export const HeroImage = ({
  id,
  title,
  category,
  preview,
  mainImageCaption,
  mainImageAttribution,
  mainImageAttributionUrl,
  fullBleed,
  mainImageGradientOverlay,
  hotspot,
  crop,
  aspectRatio,
  isSponsored,
  sponsoredText,
}: HeroImageProps) => {
  const params = useParams()

  console.log({ mainImageGradientOverlay })

  const renderFigCaption = () => (
    <>
      {mainImageAttribution || mainImageCaption ? (
        <div
          className={cn("", {
            "mx-auto mb-8 w-10/12 max-w-7xl": !fullBleed,
            "absolute left-0 right-0 top-full": fullBleed,
            "w-8/12 max-w-7xl": !fullBleed && aspectRatio && aspectRatio < 1,
          })}
        >
          <figcaption
            className={cn(
              "flex justify-between text-zinc-500 dark:text-zinc-400 ",
              {
                "px-4 pt-2": fullBleed,
              }
            )}
          >
            {typeof mainImageCaption === "string" ? (
              <span className="flex-1 text-sm">{mainImageCaption}</span>
            ) : null}
            {typeof mainImageAttribution === "string" ? (
              <span className="flex-1 text-right text-sm">
                Photo by{" "}
                {typeof mainImageAttributionUrl === "string" ? (
                  <a
                    href={mainImageAttributionUrl}
                    className="text-brand transition-colors duration-200 hover:text-brandHover"
                  >
                    {mainImageAttribution}
                  </a>
                ) : (
                  mainImageAttribution
                )}
              </span>
            ) : null}
          </figcaption>
        </div>
      ) : null}
    </>
  )

  return fullBleed ? (
    <section
      className={cn("relative h-svh transition-all", {
        "mb-12": mainImageAttribution || mainImageCaption,
      })}
    >
      <figure>
        <SanityImage
          id={id}
          baseUrl={baseUrl}
          preview={preview}
          width={1440}
          loading="eager"
          className="absolute inset-0 z-[1] h-full w-full select-none object-cover"
          alt=""
          hotspot={hotspot}
          crop={crop}
        />
        {renderFigCaption()}
      </figure>
      <div
        className={cn("absolute inset-0 z-[2] h-full w-full select-none", {
          "bg-[radial-gradient(rgba(0,_0,_0,_0.3),_rgba(0,_0,_0,_0))]":
            mainImageGradientOverlay,
        })}
      />
      <div className="relative z-[3] mx-auto flex h-screen max-w-[100ch] flex-col items-center justify-center px-8 text-center">
        {category ? (
          <Typography.H4 className="mb-6 text-white drop-shadow-lg">
            <Link
              prefetch="intent"
              to={`/${params.lang}/categories/${
                category.slug[params.lang as keyof typeof category.title]
              }`}
            >
              {category.title[params.lang as keyof typeof category.title]}
            </Link>
          </Typography.H4>
        ) : (
          <div className="mb-16" />
        )}
        <Typography.H1 className="text-white drop-shadow-lg">
          {title}
        </Typography.H1>
        {typeof isSponsored === "boolean" && isSponsored === true && (
          <div className="mb-6 mt-4">
            <Typography.H4 className="flex items-center text-white drop-shadow-lg">
              {typeof sponsoredText === "string" ? sponsoredText : "Sponsored"}
            </Typography.H4>
          </div>
        )}
      </div>
    </section>
  ) : (
    <section>
      <figure>
        <SanityImage
          id={id}
          baseUrl={baseUrl}
          preview={preview}
          width={1440}
          loading="eager"
          className={cn(
            "mx-auto mb-2 w-10/12 max-w-7xl select-none object-cover",
            {
              "w-8/12": aspectRatio && aspectRatio < 1,
            }
          )}
          alt=""
          hotspot={hotspot}
          crop={crop}
        />
        {renderFigCaption()}
      </figure>
      <div className="mx-auto flex max-w-[100ch] flex-col items-center justify-center px-8 text-center">
        {category ? (
          <Typography.H4 className="mb-6">
            <Link
              prefetch="intent"
              to={`/${params.lang}/categories/${
                category.slug[params.lang as keyof typeof category.title]
              }`}
            >
              {category.title[params.lang as keyof typeof category.title]}
            </Link>
          </Typography.H4>
        ) : (
          <div className="mb-16" />
        )}
        <Typography.H1 className="">{title}</Typography.H1>
        {typeof isSponsored === "boolean" && isSponsored === true && (
          <div className="mb-6 mt-4">
            <Typography.H4 className="flex items-center">
              {typeof sponsoredText === "string" ? sponsoredText : "Sponsored"}
            </Typography.H4>
          </div>
        )}
      </div>
    </section>
  )
}
