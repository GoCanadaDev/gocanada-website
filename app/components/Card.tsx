import { Link } from "@remix-run/react"
import { type PostPreview } from "~/sanity/queries"
import { Typography } from "./Typography"
import { Image } from "./Image"
import { AspectRatio } from "./ui/aspect-ratio"
import { cn } from "~/lib/utils"
import { useEffect, useState } from "react"

export default function Card({
  post,
  showExcerpt,
  isLarge,
  hideImage,
  categoryToUse,
  disableImageTransition,
  loadingMode,
}: {
  post: PostPreview
  showExcerpt?: boolean
  isLarge?: boolean
  hideImage?: boolean
  categoryToUse?: PostPreview["categories"][0]
  disableImageTransition?: boolean
  loadingMode?: "lazy" | "eager"
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (
      post &&
      !!post.secondaryImage &&
      post.secondaryImage?.id &&
      isLarge &&
      !disableImageTransition
    ) {
      const cycleTime = 5000
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 2)
      }, cycleTime)
      return () => clearInterval(interval)
    }
  }, [post, isLarge])

  if (!post || !post.language) {
    return null
  }

  const linkTo = `/${post.language}/${post.slug[post.language]}`

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
              <div className="relative h-full w-full">
                {/* Main Image */}
                <Image
                  mode="cover"
                  id={post.mainImage.id}
                  alt=""
                  width={isLarge || hideImage ? 1024 : 576}
                  height={isLarge || hideImage ? 640 : 384}
                  preview={post.mainImage.preview ?? ""}
                  loading={loadingMode}
                  className={cn(
                    "absolute inset-0 h-full object-cover hover:scale-[1.05]",
                    {
                      "opacity-100 transition-transform":
                        currentImageIndex === 0,
                      "opacity-0":
                        currentImageIndex === 1 && post.secondaryImage?.id,
                      "transition-opacity duration-700":
                        post.secondaryImage?.id,
                    }
                  )}
                  aria-label={`Read more: ${post.title[post.language]}`}
                  hotspot={post.mainImage.hotspot}
                  crop={post.mainImage.crop}
                  {...({
                    fetchpriority: "high",
                  } as React.ImgHTMLAttributes<HTMLImageElement>)}
                />

                {/* Secondary Image (only rendered if it exists and isLarge is true) */}
                {post.secondaryImage && post.secondaryImage.id && isLarge && (
                  <Image
                    mode="cover"
                    id={post.secondaryImage.id}
                    alt=""
                    width={isLarge ? 1024 : 576}
                    height={isLarge ? 640 : 384}
                    preview={post.secondaryImage.preview ?? ""}
                    loading={loadingMode}
                    className={cn(
                      "absolute inset-0 h-full object-cover transition-opacity duration-700",
                      {
                        "opacity-100": currentImageIndex === 1,
                        "opacity-0": currentImageIndex === 0,
                      }
                    )}
                    aria-label={`Read more: ${post.title[post.language]}`}
                    hotspot={post.secondaryImage.hotspot}
                    crop={post.secondaryImage.crop}
                  />
                )}
              </div>
            </Link>
          </AspectRatio>
        </div>
      ) : (
        <AspectRatio
          ratio={3 / 2}
          className="mb-4 overflow-hidden bg-zinc-200 dark:bg-zinc-800"
        >
          <img
            src="https://place-hold.it/1024x640/bf2327/ffffff&text=placeholder&bold&fontsize=24"
            alt="placeholder"
            className="absolute inset-0 h-full object-cover hover:scale-[1.05]"
          />
        </AspectRatio>
      )}
      <div className={cn("relative space-y-2", { "space-y-3": isLarge })}>
        <p
          className={cn(
            "scroll-m-20 font-sans text-sm font-normal uppercase tracking-[6px] text-brand dark:text-zinc-100",
            {
              "text-base": isLarge,
            }
          )}
        >
          {categoryToUse
            ? categoryToUse.title[post.language]
            : post.categories[0].title[post.language]}
        </p>
        <Typography.H1
          className={cn(
            "mt-[11px] leading-[1] transition-colors duration-700 group-hover:text-brand",
            {
              "text-4xl lg:text-4xl": isLarge,
              "text-3xl lg:text-3xl lg:leading-[1]": !isLarge,
            }
          )}
        >
          {post.title[post.language]}
        </Typography.H1>
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
          By {typeof post.author?.name === "string" ? post.author.name : "TBD"}
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
