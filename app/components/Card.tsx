import { Link } from "@remix-run/react"

import { type PostPreview } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { useTranslate } from "~/lib/useTranslate"
import { MoveRight } from "lucide-react"

export default function Card({ post }: { post: PostPreview }) {
  const { translate } = useTranslate()

  const linkTo = `/${post.language}/${post.slug[post.language]}`
  if (!post) {
    return null
  }

  return (
    <div className="card max-w-screen-sm">
      {post.mainImage && post.mainImage?.id ? (
        <div className="mb-4 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800">
          <Link prefetch="intent" to={linkTo}>
            <Image
              id={post.mainImage.id}
              alt=""
              width={640}
              preview={post.mainImage.preview ?? ""}
              loading="eager"
              className="transition-transform hover:scale-[1.05]"
            />
          </Link>
        </div>
      ) : null}
      <div className="card__container">
        <Typography.H4>{post.category}</Typography.H4>
        <Typography.H3>
          <Link prefetch="intent" to={linkTo}>
            {post.title[post.language]}
          </Link>
        </Typography.H3>
        <p>
          <Link className="text-sm" prefetch="intent" to={linkTo}>
            {translate("readMore")} <MoveRight className="inline" />
          </Link>
        </p>
      </div>
    </div>
  )
}
