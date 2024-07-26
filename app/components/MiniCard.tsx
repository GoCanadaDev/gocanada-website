import { Link } from "@remix-run/react"
import { PostPreview, Post, NextOrPreviousPostType } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { AspectRatio } from "./ui/aspect-ratio"

export const MiniCard = ({
  post,
  reverse,
}: {
  post: Post | PostPreview | NextOrPreviousPostType
  reverse?: boolean
}) => {
  return (
    <article
      className={`group relative flex gap-8 ${reverse ? "text-right" : ""}`}
      key={post._id ?? post._createdAt}
    >
      <div className={`size-24 flex-shrink-0 ${reverse ? "order-1" : ""}`}>
        {post.mainImage && post.mainImage?.id ? (
          <AspectRatio
            ratio={1}
            className="overflow-hidden bg-slate-200 dark:bg-slate-800"
          >
            <Image
              mode="cover"
              id={post.mainImage.id}
              alt=""
              width={300}
              height={300}
              preview={post.mainImage.preview ?? ""}
              loading="lazy"
              aria-label={`Read more: ${post.title[post.language]}`}
            />
          </AspectRatio>
        ) : null}
      </div>
      <div className="space-y-0">
        <Typography.H4>{post.category.title[post.language]}</Typography.H4>
        <Typography.H3 className="text-lg uppercase tracking-wide transition-colors duration-700 group-hover:text-red-500">
          {post.title[post.language]}
        </Typography.H3>
        <Typography.Paragraph className="line-clamp-2">
          {post.excerpt[post.language]}
        </Typography.Paragraph>

        <p>
          <Link
            className="text-sm before:absolute before:inset-0"
            prefetch="intent"
            to={`/${post.language}/${post.slug[post.language]}`}
            aria-label={`Read more: ${post.title[post.language]}`}
          >
            <span className="sr-only">Read more</span>
          </Link>
        </p>
      </div>
    </article>
  )
}
