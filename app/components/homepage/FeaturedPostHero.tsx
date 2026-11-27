import { Link } from "@remix-run/react"
import { ArrowRight } from "lucide-react"
import type { Reference } from "sanity"

import { withEnglishFallback } from "~/lib/localeFallback"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { generateSrcSet, urlForImage } from "~/lib/sanity.image"
import type { PostPreview } from "~/sanity/queries"

import { Typography } from "../Typography"
import { AspectRatio } from "../ui/aspect-ratio"
import { Button } from "../ui/button"

export const FeaturedPostHero = ({ post }: { post: PostPreview }) => {
  const postData = withEnglishFallback(sanitizeStrings(post))
  // Generate srcSet and main URL
  const imageAsset = {
    asset: {
      _ref: postData.mainImage.id,
      _type: "reference",
    } as Reference,
    crop: postData.mainImage.crop,
    hotspot: postData.mainImage.hotspot,
  }

  const imageSrcSet = generateSrcSet(imageAsset)
  const mainImageUrl = urlForImage(imageAsset)?.width(1920).url()

  return (
    <div className="relative -mx-12 -mt-4">
      <AspectRatio ratio={2.25} className="overflow-clip">
        <img
          src={mainImageUrl}
          srcSet={imageSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, (max-width: 1536px) 75vw, 1920px"
          loading="eager"
          className="hero-parallax w-full object-cover"
          alt={postData.mainImage.alt}
          style={{ viewTransitionName: "post-hero-image" }}
          {...({
            fetchpriority: "high",
          } as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
        <div className="absolute inset-0 w-2/3 bg-[radial-gradient(ellipse_100%_100%_at_left,var(--tw-gradient-stops))] from-black/80 to-transparent"></div>
        <div className="absolute left-8 top-1/2 w-1/2 -translate-y-1/2 space-y-4">
          <p
            className={
              "font-sans text-sm font-normal uppercase tracking-[6px] !text-zinc-100 drop-shadow-md"
            }
          >
            Featured Story
          </p>
          <Typography.H1
            className={
              "text-3xl leading-[1] !text-zinc-100 drop-shadow-md duration-700 lg:text-5xl lg:leading-[1]"
            }
          >
            {postData.title[postData.language]}
          </Typography.H1>
          <Typography.Lead className="leading-snug !text-zinc-100 drop-shadow-md">
            {postData.excerpt[postData.language]}
          </Typography.Lead>
          <Button asChild variant="secondary" className="drop-shadow-md">
            <Link
              to={`/${postData.language}/${postData.slug[postData.language]}`}
            >
              Read the story <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </AspectRatio>
    </div>
  )
}
