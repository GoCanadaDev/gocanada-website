import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { client } from "~/sanity/client"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og"
import { getPost, Post } from "~/sanity/queries"
import useFormattedDate from "~/lib/useFormattedDate"
import { PortableText } from "@portabletext/react"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { HeroImage } from "~/components/HeroImage"
import { Separator } from "~/components/ui/separator"
import invariant from "tiny-invariant"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import PortableTextComponents from "~/components/portable"
import { SITE_META } from "~/lib/utils"
import { MiniCard } from "~/components/MiniCard"
import AuthorCard from "~/components/AuthorCard"
import Share from "~/components/Share"
import Prose from "~/components/portable/Prose"
import { cn } from "~/lib/utils"
import MidRollBannerAd from "~/components/MidRollBannerAd"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = [data?.post?.title[data.post.language], SITE_META.siteTitle]
    .filter(Boolean)
    .join(" | ")
  const ogImageUrl = data ? data.ogImageUrl : null

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image", content: ogImageUrl },
  ]
}

type LoaderDataType = {
  post: Post
  ogImageUrl: string
}

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  invariant(params.slug, "Expected slug param")
  isLangSupportedLang(params.lang)
  const post = await getPost(client, params.slug!, params.lang!)

  // post returns an empty object if the slug is not found, so check for empty object with Object.keys
  if (Object.keys(post).length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  // Create social share image url
  const { origin } = new URL(request.url)
  const ogImageUrl = `${origin}/resource/og?id=${post._id}`

  return json({
    post,
    ogImageUrl,
  })
}

export default function Slug() {
  const { post } = useLoaderData() as LoaderDataType
  const otherLanguage = useOtherLanguage()
  const formattedDate = useFormattedDate(post._createdAt, post.language)

  const translationUrl = `/${otherLanguage}/${post.slug[otherLanguage]}`

  const hasInlineAd =
    post.body.findIndex((block) => block._type === "inlineAdType") > -1
  let halfwayThroughBodyMarker = Math.ceil(post.body.length / 2)

  const halfwayBlock = post.body[halfwayThroughBodyMarker]
  if (halfwayBlock._type !== "block" && halfwayBlock.style !== "normal") {
    const nextParagraph = [...post.body]
      .slice(halfwayThroughBodyMarker, post.body.length)
      .findIndex((block) => block._type === "block" && block.style === "normal")

    halfwayThroughBodyMarker = halfwayThroughBodyMarker + nextParagraph
  }

  return (
    <Layout translationUrl={translationUrl}>
      <div className="container mx-auto p-4 lg:px-12">
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" prefetch="intent">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  prefetch="intent"
                  to={`/${post.language}/categories/${
                    post.categories[0].slug[post.language]
                  }`}
                >
                  {post.categories[0].title.en}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  prefetch="intent"
                  to={`/${post.language}/categories/${post.categories[0].slug[post.language]}/${post.subCategories[0].slug[post.language]}`}
                >
                  {post.subCategories[0].title.en}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title[post.language]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <article className="mb-24">
        <div className="w-full">
          <HeroImage
            fullBleed={post.mainImageFullBleed}
            id={post.mainImage.id}
            title={post.title[post.language]}
            category={post.categories[0]}
            preview={post.mainImage.preview}
            mainImageCaption={post.mainImageCaption}
            mainImageAttribution={post.mainImageAttribution}
            mainImageAttributionUrl={post.mainImageAttributionUrl}
            mainImageGradientOverlay={post.mainImageGradientOverlay}
            hotspot={post.mainImage.hotspot}
            crop={post.mainImage.crop}
            aspectRatio={post.mainImage.aspectRatio}
            isSponsored={post.isSponsored}
            sponsoredText={post.sponsoredText}
          />
        </div>
        <div
          // 1.32rem is to get the holy-grail width to match the prose width below
          className={cn("holy-grail mb-12 mt-4 text-[1.32rem]", {
            "mt-12": post.mainImageFullBleed,
          })}
        >
          <div className="w-full text-center">
            <Typography.Paragraph className="font-sans text-xl italic text-zinc-500 md:text-2xl">
              {post.excerpt[post.language]}
            </Typography.Paragraph>
          </div>
          <div className="mb-12 mt-4 text-center">
            <Typography.Paragraph>
              By{" "}
              <Link
                prefetch="intent"
                to={`/${post.language}/authors/${post.author.slug}`}
                className="hover:text-brand"
              >
                {post.author.name}
              </Link>
            </Typography.Paragraph>
            {post.showDate && (
              <Typography.TextMuted>{formattedDate}</Typography.TextMuted>
            )}
          </div>
          <div className="mb-12 w-full text-center">
            <Typography.H4>Share</Typography.H4>
            <Share
              url={`/${post.language}/${post.slug[post.language]}`}
              title={post.title[post.language]}
              tags={post.subCategories.map((sc) => sc.title[post.language])}
              description={post.excerpt[post.language]}
              media={post.mainImage.id}
            />
          </div>
          {post.byline && Object.entries(post.byline || {}).length > 0 && (
            <>
              <Separator className="h-0.5" />

              <Prose
                className="!dark:text-zinc-400 !mb-0 !mt-4 font-sans !text-zinc-500"
                disableHolyGrail
              >
                <PortableText
                  value={post.byline}
                  components={PortableTextComponents}
                />
              </Prose>
            </>
          )}

          <Separator className="h-0.5" />
        </div>
        <Prose>
          {hasInlineAd ? (
            <PortableText
              value={post.body}
              components={PortableTextComponents}
            />
          ) : (
            // if no inline ad in the post, manually insert the MidRollBannerAd halfway through the body blocks
            <>
              <PortableText
                value={[...post.body].slice(0, halfwayThroughBodyMarker)}
                components={PortableTextComponents}
              />
              <div className="relative my-8 border bg-zinc-100 dark:bg-zinc-800">
                <div className="absolute right-0 top-0 z-10 size-6 rounded-bl-sm border-b border-l bg-zinc-50 text-center font-sans text-xs uppercase leading-6 dark:bg-zinc-950">
                  ad
                </div>
                <MidRollBannerAd />
              </div>
              <PortableText
                value={[...post.body].slice(
                  halfwayThroughBodyMarker,
                  post.body.length
                )}
                components={PortableTextComponents}
              />
            </>
          )}
        </Prose>
        <div className="mx-auto my-16 flex max-w-lg flex-wrap justify-center gap-4">
          {post.subCategories?.map((subCategory) => (
            <div key={subCategory.title[post.language]} className="">
              <Link
                prefetch="intent"
                to={`/${post.language}/categories/${post.categories[0].slug[post.language]}/${subCategory.slug[post.language]}`}
                className="rounded bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-800 no-underline dark:bg-zinc-700 dark:text-zinc-300"
              >
                {subCategory.title[post.language]}
              </Link>
            </div>
          ))}
        </div>
        <div className="space-y-24">
          <Separator />
          <AuthorCard author={post.author} showLinkToAuthorPage />
          <Separator />
        </div>
      </article>

      <div className="mx-auto my-12 grid max-w-screen-xl grid-cols-1 gap-8 lg:grid-cols-2">
        {[post.previousPost, post.nextPost].map((previousOrNextPost, index) => {
          if (!previousOrNextPost || !previousOrNextPost.title)
            return <div key="">&nbsp;</div>
          return (
            <div
              key={previousOrNextPost._id}
              className="group relative flex items-center gap-4 px-8"
            >
              {index === 0 && (
                <Link
                  className="hidden text-sm before:absolute before:inset-0 group-hover:text-brandHover md:block"
                  prefetch="intent"
                  to={`/${post.language}/${post.slug[post.language]}`}
                  aria-label={`Read more: ${post.title[post.language]}`}
                >
                  <ChevronLeft className="size-8" />
                </Link>
              )}
              <MiniCard post={previousOrNextPost} reverse={index === 1} />
              {index === 1 && (
                <Link
                  className="hidden text-sm before:absolute before:inset-0 group-hover:text-brandHover md:block"
                  prefetch="intent"
                  to={`/${previousOrNextPost.language}/${
                    previousOrNextPost.slug[previousOrNextPost.language]
                  }`}
                  aria-label={`Read more: ${
                    previousOrNextPost.title[previousOrNextPost.language]
                  }`}
                >
                  <ChevronRight className="size-8" />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
