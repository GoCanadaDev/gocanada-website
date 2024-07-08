import { Link } from "@remix-run/react"
import { PostPreview, Post, NextOrPreviousPostType } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { useTranslate } from "~/lib/useTranslate"
import { MoveRight } from "lucide-react"
import { AspectRatio } from "./ui/aspect-ratio"

export const MiniCard = ({
  post,
  reverse,
}: {
  post: Post | PostPreview | NextOrPreviousPostType
  reverse?: boolean
}) => {
  const { translate } = useTranslate()

  return (
    <article
      className={`group relative flex gap-8 ${
        reverse ? "text-right" : undefined
      }`}
      key={post._id ?? post._createdAt}
    >
      <div
        className={`size-24 flex-shrink-0 ${reverse ? "order-1" : undefined}`}
      >
        {post.mainImage && post.mainImage?.id ? (
          <AspectRatio
            ratio={1}
            className="overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"
          >
            <Image
              mode="cover"
              id={post.mainImage.id}
              alt=""
              width={300}
              height={300}
              preview={post.mainImage.preview ?? ""}
              loading="lazy"
              aria-label={`${translate("readMore")}: ${
                post.title[post.language]
              }`}
            />
          </AspectRatio>
        ) : null}
      </div>
      <div className="space-y-4">
        <Typography.H4>{post.category.title[post.language]}</Typography.H4>
        <Typography.H3 className="text-lg uppercase tracking-wide transition-colors duration-700 group-hover:text-red-500">
          {post.title[post.language]}
        </Typography.H3>

        <p>
          <Link
            className="text-sm before:absolute before:inset-0"
            prefetch="intent"
            to={`/${post.language}/${post.slug[post.language]}`}
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
