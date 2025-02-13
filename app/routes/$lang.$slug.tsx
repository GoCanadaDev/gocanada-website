import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  HeadersFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, Params, useLoaderData } from "@remix-run/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { client } from "~/sanity/client"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og"
import { Post, postBySlugQuery } from "~/sanity/queries"
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
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { loadQuery } from "~/sanity/loader.server"
import { useQuery } from "~/sanity/loader"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import SubscribeForm from "~/components/SubscribeForm"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: Omit<LoaderDataType, "post"> & { post: { data: Post } }
}) => {
  const sanitizedData = sanitizeStrings(data)
  const title = [
    sanitizedData?.post.data.title[sanitizedData.post.data.language],
    data.siteConfig.siteTitle,
  ]
    .filter(Boolean)
    .join(" | ")

  const ogImageUrl = sanitizedData ? sanitizedData.ogImageUrl : null
  const description = sanitizedData ? sanitizedData.post.data.excerpt.en : ""

  return [
    { title },
    { name: "description", content: description },
    {
      property: "article:author",
      content: sanitizedData.post.data.author.name,
    },
    {
      property: "article:modified_time",
      content: sanitizedData.post.data._updatedAt,
    },
    {
      property: "article:published_time",
      content: sanitizedData.post.data.publishedAt,
    },
    {
      property: "article:section",
      content: sanitizedData.post.data.categories[0].title.en,
    },
    {
      property: "article:tag",
      content: sanitizedData.post.data.subCategories
        .map((sc) => sc.title.en)
        .join(", "),
    },
    { property: "og:description", content: description },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image:secure_url", content: ogImageUrl },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image", content: ogImageUrl },
    { property: "og:locale", content: "en_CA" },
    { property: "og:site_name", content: "Go Canada" },
    { property: "og:title", content: title },
    { property: "og:type", content: "article" },
    {
      property: "og:url",
      content: `https://gocanada.com/en/${sanitizedData.post.data.slug.en}`,
    },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: ogImageUrl },
    { property: "twitter:site", content: "@gocanada" },
    { property: "twitter:title", content: title },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://gocanada.com/en/${sanitizedData.post.data.slug.en}`,
    },
  ]
}

type LoaderDataType = {
  params: Params
  post: Post
  ogImageUrl: string
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  invariant(params.slug, "Expected slug param")
  isLangSupportedLang(params.lang)
  //const post = await getPost(client, params.slug!, params.lang!)

  const post = await loadQuery<Post | null>(postBySlugQuery, {
    slug: params.slug,
    language: params.lang,
  }).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  // post returns an empty object if the slug is not found, so check for empty object with Object.keys
  if (Object.keys(post).length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }
  const siteConfig = await getSiteConfig(client)

  // Create social share image url
  const { origin } = new URL(request.url)
  const ogImageUrl = `${origin}/resource/og?id=${post.data?._id}`

  return json(
    {
      params,
      post,
      ogImageUrl,
      siteConfig,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, s-maxage=31536000",
        // Tag with the post id
        "Cache-Tag": `posts:id:${post.data?._id}`,
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders

export default function Slug() {
  const { post, params } = useLoaderData<LoaderDataType>()
  const { data: postData } = useQuery<Post | null>(
    postBySlugQuery,
    { language: params.lang, slug: params.slug },
    {
      initial: post,
    }
  )
  const postToUse = sanitizeStrings(postData ?? post)

  const otherLanguage = useOtherLanguage()
  const formattedDate = useFormattedDate(
    postToUse.publishedAt,
    postToUse.language
  )

  const translationUrl = `/${otherLanguage}/${postToUse.slug[otherLanguage]}`

  const hasInlineAd =
    postToUse.body.findIndex((block) => block._type === "inlineAdType") > -1
  let halfwayThroughBodyMarker = Math.ceil(postToUse.body.length / 2)

  const halfwayBlock = postToUse.body[halfwayThroughBodyMarker]
  if (halfwayBlock._type !== "block" && halfwayBlock.style !== "normal") {
    const nextParagraph = [...postToUse.body]
      .slice(halfwayThroughBodyMarker, postToUse.body.length)
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
                  to={`/${postToUse.language}/categories/${
                    postToUse.categories[0].slug[postToUse.language]
                  }`}
                >
                  {postToUse.categories[0].title.en}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  prefetch="intent"
                  to={`/${postToUse.language}/categories/${postToUse.categories[0].slug[postToUse.language]}/${postToUse.subCategories[0].slug[postToUse.language]}`}
                >
                  {postToUse.subCategories[0].title.en}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {postToUse.title[postToUse.language]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <article className="mb-24">
        <div className="w-full">
          <HeroImage
            fullBleed={postToUse.mainImageFullBleed}
            id={postToUse.mainImage.id}
            title={postToUse.title[postToUse.language]}
            category={postToUse.categories[0]}
            preview={postToUse.mainImage.preview}
            mainImageCaption={postToUse.mainImageCaption}
            mainImageAttribution={postToUse.mainImageAttribution}
            mainImageAttributionUrl={postToUse.mainImageAttributionUrl}
            mainImageGradientOverlay={postToUse.mainImageGradientOverlay}
            hotspot={postToUse.mainImage.hotspot}
            crop={postToUse.mainImage.crop}
            aspectRatio={postToUse.mainImage.aspectRatio}
            isSponsored={postToUse.isSponsored}
            sponsoredText={postToUse.sponsoredText}
          />
        </div>
        <div
          // 1.32rem is to get the holy-grail width to match the prose width below
          className={cn("holy-grail mb-12 mt-4 text-[1.32rem]", {
            "mt-12": postToUse.mainImageFullBleed,
          })}
        >
          <div className="w-full text-center">
            <Typography.Paragraph className="font-sans text-xl italic text-zinc-500 md:text-2xl">
              {postToUse.excerpt[postToUse.language]}
            </Typography.Paragraph>
          </div>
          <div className="mb-12 mt-4 text-center">
            <Typography.Paragraph>
              By{" "}
              <Link
                prefetch="intent"
                to={`/${postToUse.language}/authors/${postToUse.author.slug}`}
                className="hover:text-brand"
              >
                {postToUse.author.name}
              </Link>
            </Typography.Paragraph>
            {postToUse.showDate && (
              <Typography.TextMuted>{formattedDate}</Typography.TextMuted>
            )}
          </div>
          <div className="mb-12 w-full text-center">
            <Typography.H4>Share</Typography.H4>
            <Share
              url={`/${postToUse.language}/${postToUse.slug[postToUse.language]}`}
              title={postToUse.title[postToUse.language]}
              tags={postToUse.subCategories.map(
                (sc) => sc.title[postToUse.language]
              )}
              description={postToUse.excerpt[postToUse.language]}
              media={postToUse.mainImage.id}
            />
          </div>
          {postToUse.byline &&
            Object.entries(postToUse.byline || {}).length > 0 && (
              <>
                <Separator className="h-0.5" />

                <Prose
                  className="!dark:text-zinc-400 !mb-0 !mt-4 font-sans !text-zinc-500"
                  disableHolyGrail
                >
                  <PortableText
                    value={postToUse.byline}
                    components={PortableTextComponents}
                  />
                </Prose>
              </>
            )}

          <Separator className="h-0.5" />
        </div>
        <Prose>
          <div>
            {hasInlineAd ? (
              <PortableText
                value={postToUse.body}
                components={PortableTextComponents}
              />
            ) : (
              // if no inline ad in the postToUse, manually insert the MidRollBannerAd halfway through the body blocks
              <>
                <PortableText
                  value={[...postToUse.body].slice(0, halfwayThroughBodyMarker)}
                  components={PortableTextComponents}
                />
                <div>
                  {postToUse.slug.en ===
                  "giveaway-win-a-three-night-stay-at-the-wickaninnish-inn-in-tofino" ? (
                    <div className="my-8 border bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                      <SubscribeForm pageLocation="thewick" />
                    </div>
                  ) : (
                    <div className="relative my-8 border bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                      <div className="absolute right-0 top-0 z-10 size-6 rounded-bl-sm border-b border-l bg-zinc-50 text-center font-sans text-xs uppercase leading-6 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                        ad
                      </div>
                      <MidRollBannerAd />
                    </div>
                  )}
                </div>
                <PortableText
                  value={[...postToUse.body].slice(
                    halfwayThroughBodyMarker,
                    postToUse.body.length
                  )}
                  components={PortableTextComponents}
                />
              </>
            )}
          </div>
          {false && (
            //adConfig.verticalPostAdUrl && (
            <aside className="sticky top-16 !col-span-1 !col-start-3">
              <div className="h-screen rounded-md bg-gray-100 p-4">
                <p>Your Ad Here</p>
              </div>
            </aside>
          )}
        </Prose>
        <div className="mx-auto my-16 flex max-w-lg flex-wrap justify-center gap-4">
          {postToUse.subCategories?.map((subCategory) => (
            <div key={subCategory.title[postToUse.language]} className="">
              <Link
                prefetch="intent"
                to={`/${postToUse.language}/categories/${postToUse.categories[0].slug[postToUse.language]}/${subCategory.slug[postToUse.language]}`}
                className="rounded bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-800 no-underline dark:bg-zinc-700 dark:text-zinc-300"
              >
                {subCategory.title[postToUse.language]}
              </Link>
            </div>
          ))}
        </div>
        <div className="space-y-24">
          <Separator />
          <AuthorCard author={postToUse.author} showLinkToAuthorPage />
          <Separator />
        </div>
      </article>

      <div className="mx-auto my-12 grid max-w-screen-xl grid-cols-1 gap-8 lg:grid-cols-2">
        {[postToUse.previousPost, postToUse.nextPost].map(
          (previousOrNextPost, index) => {
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
                    to={`/${postToUse.language}/${postToUse.slug[postToUse.language]}`}
                    aria-label={`Read more: ${postToUse.title[postToUse.language]}`}
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
          }
        )}
      </div>
    </Layout>
  )
}
