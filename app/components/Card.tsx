import { Link } from "@remix-run/react"

import { type PostPreview } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { useTranslate } from "~/lib/useTranslate"
import { MoveRight } from "lucide-react"
import { AspectRatio } from "./ui/aspect-ratio"

export default function Card({ post }: { post: PostPreview }) {
  const { translate } = useTranslate()

  const linkTo = `/${post.language}/${post.slug[post.language]}`
  if (!post) {
    return null
  }

  return (
    <article className="max-w-screen-sm">
      {post.mainImage && post.mainImage?.id ? (
        <AspectRatio
          ratio={3 / 2}
          className="mb-4 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"
        >
          <Link prefetch="intent" to={linkTo}>
            <Image
              mode="cover"
              id={post.mainImage.id}
              alt=""
              width={640}
              preview={post.mainImage.preview ?? ""}
              loading="eager"
              className="transition-transform hover:scale-[1.05]"
              aria-label={`${translate("readMore")}: ${
                post.title[post.language]
              }`}
            />
          </Link>
        </AspectRatio>
      ) : null}
      <div className="">
        <Typography.H4>{post.category.title[post.language]}</Typography.H4>
        <Typography.H3 className="my-4">
          <Link prefetch="intent" to={linkTo}>
            {post.title[post.language]}
          </Link>
        </Typography.H3>
        <p>
          <Link
            className="text-sm"
            prefetch="intent"
            to={linkTo}
            aria-label={`${translate("readMore")}: ${
              post.title[post.language]
            }`}
          >
            {translate("readMore")} <MoveRight className="inline h-4 w-4" />
          </Link>
        </p>
      </div>
    </article>
  )
}
