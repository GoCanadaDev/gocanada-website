import { Link } from "@remix-run/react"
import { type PostPreview } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { useTranslate } from "~/lib/useTranslate"
import { MoveRight } from "lucide-react"
import { AspectRatio } from "./ui/aspect-ratio"

export default function Card({
  post,
  showExcerpt,
}: {
  post: PostPreview
  showExcerpt?: boolean
}) {
  const { translate } = useTranslate()

  const linkTo = `/${post.language}/${post.slug[post.language]}`
  if (!post) {
    return null
  }

  return (
    <article className="group max-w-screen-md">
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
              width={768}
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
      <div className="relative space-y-4">
        <Typography.H4>{post.category.title[post.language]}</Typography.H4>
        <Typography.H3 className="uppercase tracking-wide transition-colors duration-700 group-hover:text-red-500">
          {post.title[post.language]}
        </Typography.H3>
        {showExcerpt ? (
          <Typography.Paragraph>
            {post.excerpt[post.language]}
          </Typography.Paragraph>
        ) : null}
        <p>
          <Link
            className="text-sm before:absolute before:inset-0"
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
