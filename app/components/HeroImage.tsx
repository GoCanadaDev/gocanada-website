import { SanityImage } from "sanity-image"

import { baseUrl } from "~/sanity/projectDetails"
import { Typography } from "./Typography"
import { Link, useParams } from "@remix-run/react"
import { Post } from "~/sanity/queries"
import { ImageCrop, ImageHotspot } from "sanity"

type HeroImageProps = {
  id: string
  title: string
  category: Post["category"]
  preview: string
  mainImageCaption?: string
  mainImageAttribution?: string
  mainImageAttributionUrl?: string
  fullBleed?: boolean
  hotspot?: ImageHotspot
  crop?: ImageCrop
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
  hotspot,
  crop,
}: HeroImageProps) => {
  const params = useParams()

  const renderFigCaption = () => (
    <>
      {mainImageAttribution || mainImageCaption ? (
        <div
          className={`${
            fullBleed
              ? "absolute -bottom-8 left-0 right-0"
              : "mx-auto mb-8 w-10/12 max-w-7xl"
          }`}
        >
          <figcaption className="flex justify-between px-4 text-slate-500 dark:text-slate-400">
            {typeof mainImageCaption === "string" ? (
              <span className="flex-1 italic">{mainImageCaption}</span>
            ) : null}
            {typeof mainImageAttribution === "string" ? (
              <span className="flex-1 text-right">
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
    <section className="relative h-svh transition-all">
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
      <div className="absolute inset-0 z-[2] h-full w-full select-none bg-[radial-gradient(rgba(0,_0,_0,_0.3),_rgba(0,_0,_0,_0))]" />
      <div className="relative z-[3] mx-auto flex h-screen max-w-[100ch] flex-col items-center justify-center px-8 text-center">
        <Typography.H4 className="mb-12 text-white drop-shadow-lg">
          <Link
            prefetch="intent"
            to={`/${params.lang}/categories/${
              category.slug[params.lang as keyof typeof category.title]
            }`}
          >
            {category.title[params.lang as keyof typeof category.title]}
          </Link>
        </Typography.H4>
        <Typography.H1 className="text-white drop-shadow-lg">
          {title}
        </Typography.H1>
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
          className="mx-auto mb-2 w-10/12 max-w-7xl select-none object-cover"
          alt=""
          hotspot={hotspot}
          crop={crop}
        />
        {renderFigCaption()}
      </figure>
      <div className="mx-auto flex max-w-[100ch] flex-col items-center justify-center px-8 text-center">
        <Typography.H4 className="mb-12">
          <Link
            prefetch="intent"
            to={`/${params.lang}/categories/${
              category.slug[params.lang as keyof typeof category.title]
            }`}
          >
            {category.title[params.lang as keyof typeof category.title]}
          </Link>
        </Typography.H4>
        <Typography.H1 className="">{title}</Typography.H1>
      </div>
    </section>
  )
}
