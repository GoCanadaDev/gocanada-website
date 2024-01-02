import { SanityImage } from "sanity-image"

import { dataset, projectId } from "~/sanity/projectDetails"
import { Typography } from "./Typography"
import { Link, useParams } from "@remix-run/react"
import { Post } from "~/sanity/queries"
const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

type HeroImageProps = {
  id: string
  title: string
  category: Post["category"]
  preview: string
}

export const HeroImage = ({ id, title, category, preview }: HeroImageProps) => {
  const params = useParams()

  return (
    <section className="relative h-screen transition-all">
      <SanityImage
        id={id}
        baseUrl={baseUrl}
        preview={preview}
        width={1440}
        loading="eager"
        className="absolute inset-0 z-[1] h-full w-full select-none object-cover"
        alt=""
      />
      <div className="absolute inset-0 z-[2] h-full w-full select-none bg-[radial-gradient(rgba(0,_0,_0,_0.3),_rgba(0,_0,_0,_0))]" />
      <div className="relative z-[3] mx-auto flex h-screen max-w-[100ch] flex-col items-center justify-center px-8 text-center">
        <Typography.H4 className="mb-8 text-white drop-shadow-lg">
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
  )
}
