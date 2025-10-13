import { cn } from "~/lib/utils"
import { Typography } from "./Typography"
import { Link, useParams } from "@remix-run/react"
import { Post } from "~/sanity/queries"
import { ImageCrop, ImageHotspot, Reference } from "sanity"
import { generateSrcSet, urlForImage } from "~/lib/sanity.image"

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
  mainImageGradientOverlay,
  fullBleed,
  hotspot,
  crop,
  aspectRatio,
  isSponsored,
  sponsoredText,
}: HeroImageProps) => {
  const params = useParams()

  const renderFigCaption = () => {
    // Ensure we have valid string values
    const caption = typeof mainImageCaption === "string" ? mainImageCaption : ""
    const attribution =
      typeof mainImageAttribution === "string" ? mainImageAttribution : ""
    const attributionUrl =
      typeof mainImageAttributionUrl === "string" ? mainImageAttributionUrl : ""

    if (!caption && !attribution) return null

    return (
      <div
        className={cn("", {
          "mx-auto mb-8 w-10/12 max-w-7xl": !fullBleed,
          "absolute left-0 right-0 top-full": fullBleed,
          "w-8/12 max-w-7xl": !fullBleed && aspectRatio && aspectRatio < 1,
        })}
      >
        <figcaption
          className={cn(
            "flex justify-between font-sans text-zinc-500 dark:text-zinc-400",
            {
              "px-4 pt-2": fullBleed,
            }
          )}
        >
          {caption && <span className="flex-1 text-xs">{caption}</span>}
          {attribution && (
            <span className="flex-1 text-right text-xs">
              {attributionUrl ? (
                <a
                  href={attributionUrl}
                  className="text-brand transition-colors duration-200 hover:text-brandHover"
                >
                  {attribution}
                </a>
              ) : (
                attribution
              )}
            </span>
          )}
        </figcaption>
      </div>
    )
  }

  // Generate srcSet and main URL
  const imageAsset = {
    asset: {
      _ref: id,
      _type: "reference",
    } as Reference,
    crop,
    hotspot,
  }

  const imageSrcSet = generateSrcSet(imageAsset)
  const mainImageUrl = urlForImage(imageAsset)?.width(2560).url()

  return fullBleed ? (
    <section
      className={cn("relative inline-block w-full transition-all", {
        "mb-0":
          typeof mainImageAttribution === "string" ||
          typeof mainImageCaption === "string",
      })}
    >
      <figure>
        <img
          src={mainImageUrl}
          srcSet={imageSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, (max-width: 1536px) 75vw, 1920px"
          loading="eager"
          className="block h-auto max-h-screen w-full select-none object-cover"
          alt=""
          {...({
            fetchpriority: "high",
          } as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
        {renderFigCaption()}
      </figure>
      <div
        className={cn("absolute inset-0 z-[2] h-auto w-full select-none", {
          "bg-[radial-gradient(rgba(0,_0,_0,_0.3),_rgba(0,_0,_0,_0))]":
            mainImageGradientOverlay,
        })}
      />
      <div className="absolute inset-0 z-[3] mx-auto flex h-auto max-w-[100ch] flex-col items-center justify-center px-8 text-center">
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
          <div className="" />
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
        <img
          src={mainImageUrl}
          srcSet={imageSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, (max-width: 1536px) 75vw, 1920px"
          loading="eager"
          className={cn(
            "mx-auto mb-2 w-10/12 max-w-7xl select-none object-cover",
            {
              "w-8/12": aspectRatio && aspectRatio < 1,
            }
          )}
          alt=""
          {...({
            fetchpriority: "high",
          } as React.ImgHTMLAttributes<HTMLImageElement>)}
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
