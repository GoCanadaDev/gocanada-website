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
              height={512}
              preview={post.mainImage.preview ?? ""}
              loading="eager"
              className="transition-transform hover:scale-[1.05]"
              aria-label={`Read more: ${post.title[post.language]}`}
              hotspot={post.mainImage.hotspot}
              crop={post.mainImage.crop}
            />
          </Link>
        </AspectRatio>
      ) : null}
      <div className="relative space-y-2">
        <Typography.H4 className="font-normal text-brand">
          {post.category.title[post.language]}
        </Typography.H4>
        <Typography.H3 className="mt-[11px] leading-[1] transition-colors duration-700 group-hover:text-brand">
          {post.title[post.language]}
        </Typography.H3>
        {showExcerpt ? (
          <Typography.Paragraph
            className={
              isLarge
                ? "text-sm leading-snug text-slate-500"
                : "line-clamp-3 text-sm leading-snug text-slate-500"
            }
          >
            {post.excerpt[post.language]}
          </Typography.Paragraph>
        ) : null}
        <Typography.Paragraph className="text-xs uppercase tracking-widest text-slate-400">
          By {post.author.name}
        </Typography.Paragraph>
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
