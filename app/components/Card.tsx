import { Link } from "@remix-run/react"
import { type PostPreview } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { AspectRatio } from "./ui/aspect-ratio"

export default function Card({
  post,
  showExcerpt,
  isLarge,
  hideImage,
}: {
  post: PostPreview
  showExcerpt?: boolean
  isLarge?: boolean
  hideImage?: boolean
}) {
  const linkTo = `/${post.language}/${post.slug[post.language]}`
  if (!post) {
    return null
  }

  return (
    <article className="group max-w-screen-md">
      {!hideImage && post.mainImage && post.mainImage?.id ? (
        <AspectRatio
          ratio={3 / 2}
          className="mb-4 overflow-hidden bg-slate-200 dark:bg-slate-800"
        >
          <Link prefetch="intent" to={linkTo}>
            <Image
              mode="cover"
              id={post.mainImage.id}
              alt=""
              width={768}
              preview={post.mainImage.preview ?? ""}
              loading="eager"
              className="transition-transform hover:scale-[1.05]"
              aria-label={`Read more: ${post.title[post.language]}`}
            />
          </Link>
        </AspectRatio>
      ) : null}
      <div className="relative space-y-0">
        <Typography.H4>{post.category.title[post.language]}</Typography.H4>
        <Typography.H3 className="group-hover:text-brand transition-colors duration-700">
          {post.title[post.language]}
        </Typography.H3>
        {showExcerpt ? (
          <Typography.Paragraph className={isLarge ? "" : "line-clamp-3"}>
            {post.excerpt[post.language]}
          </Typography.Paragraph>
        ) : null}
        <p>
          <Link
            className="text-sm before:absolute before:inset-0"
            prefetch="intent"
            to={linkTo}
            aria-label={`Read more: ${post.title[post.language]}`}
          >
            <span className="sr-only">Read more</span>
          </Link>
        </p>
      </div>
    </article>
  )
}
