import { Link } from "react-router"
import { type PostPreview } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { AspectRatio } from "./ui/aspect-ratio"
import { cn } from "~/lib/utils"

export default function Card({
  post,
  showExcerpt,
  isLarge,
  hideImage,
  categoryToUse,
}: {
  post: PostPreview
  showExcerpt?: boolean
  isLarge?: boolean
  hideImage?: boolean
  categoryToUse?: PostPreview["categories"][0]
}) {
  const linkTo = `/${post.language}/${post.slug[post.language]}`
  if (!post) {
    return null
  }

  return (
    <article className="group">
      {post.mainImage && post.mainImage?.id ? (
        <div
          className={cn("", {
            "md:hidden": hideImage,
          })}
        >
          <AspectRatio
            ratio={3 / 2}
            className="mb-4 overflow-hidden bg-zinc-200 dark:bg-zinc-800"
          >
            <Link prefetch="intent" to={linkTo}>
              <Image
                mode="cover"
                id={post.mainImage.id}
                alt=""
                // if hideImage, we need a bigger size for the image at the sm breakpoint
                width={isLarge || hideImage ? 1024 : 576}
                height={isLarge || hideImage ? 640 : 384}
                preview={post.mainImage.preview ?? ""}
                loading="eager"
                className="h-full object-cover transition-transform hover:scale-[1.05]"
                aria-label={`Read more: ${post.title[post.language]}`}
                hotspot={post.mainImage.hotspot}
                crop={post.mainImage.crop}
              />
            </Link>
          </AspectRatio>
        </div>
      ) : null}
      <div className={cn("relative space-y-2", { "space-y-3": isLarge })}>
        <Typography.H4
          className={cn("text-sm font-normal text-brand", {
            "text-base": isLarge,
          })}
        >
          {categoryToUse
            ? categoryToUse.title[post.language]
            : post.categories[0].title[post.language]}
        </Typography.H4>
        <Typography.H3
          className={cn(
            "mt-[11px] text-3xl leading-[1] transition-colors duration-700 group-hover:text-brand",
            { "text-4xl": isLarge }
          )}
        >
          {post.title[post.language]}
        </Typography.H3>
        {showExcerpt ? (
          <Typography.Paragraph
            className={cn(
              "line-clamp-2 text-sm leading-snug text-zinc-600  dark:text-zinc-300"
            )}
          >
            {post.excerpt[post.language]}
          </Typography.Paragraph>
        ) : null}
        <Typography.Paragraph
          className={cn(
            "text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          )}
        >
          By {post.author.name}
        </Typography.Paragraph>
        <p>
          <Link
            className="before:absolute before:inset-0"
            prefetch="intent"
            to={linkTo}
            aria-label={`Read more: ${post.title[post.language]}`}
          >
            <span className="sr-only">
              Continuing reading about {post.title[post.language]}
            </span>
          </Link>
        </p>
      </div>
    </article>
  )
}
