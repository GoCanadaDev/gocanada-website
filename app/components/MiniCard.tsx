import { Link } from "@remix-run/react"
import { PostPreview, Post, NextOrPreviousPostType } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { AspectRatio } from "./ui/aspect-ratio"
import { cn } from "~/lib/utils"

export const MiniCard = ({
  post,
  reverse,
}: {
  post: Post | PostPreview | NextOrPreviousPostType
  reverse?: boolean
}) => {
  return (
    <article
      className={cn("group relative flex gap-8", {
        "md:text-right": reverse,
      })}
      key={post._id ?? post._createdAt}
    >
      <div
        className={cn("size-24 flex-shrink-0", {
          "md:order-1": reverse,
        })}
      >
        {post.mainImage && post.mainImage?.id ? (
          <AspectRatio
            ratio={1}
            className="overflow-hidden bg-zinc-200 dark:bg-zinc-800"
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
      <div className="space-y-2">
        <Typography.H4 className="text-sm font-normal text-brand">
          {post.categories[0].title[post.language]}
        </Typography.H4>
        <Typography.H3 className="mt-[11px] text-3xl leading-[1] transition-colors duration-700 group-hover:text-brand">
          {post.title[post.language]}
        </Typography.H3>
        {typeof post.excerpt[post.language] === "string" && (
          <Typography.Paragraph className="line-clamp-2 text-sm leading-snug text-zinc-600 dark:text-zinc-300">
            {post.excerpt[post.language]}
          </Typography.Paragraph>
        )}
        {"author" in post && post.author && post.author.name && (
          <Typography.Paragraph className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            By {post.author.name}
          </Typography.Paragraph>
        )}
        <p>
          <Link
            className="before:absolute before:inset-0"
            prefetch="intent"
            to={`/${post.language}/${post.slug[post.language]}`}
            aria-label={`Read more: ${post.title[post.language]}`}
          >
            <span className="sr-only">
              Continue reading about {post.title[post.language]}
            </span>
          </Link>
        </p>
      </div>
    </article>
  )
}
