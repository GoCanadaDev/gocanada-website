import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  HeadersFunction,
} from "react-router"
import { data } from "react-router"
import { Link, Params, useLoaderData } from "react-router"
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
import { useQuery } from "@sanity/react-loader"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { loadQueryOptions } from "~/sanity/loadQueryOptions.server"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: Omit<LoaderDataType, "initial"> & { initial: { data: Post } }
}) => {
  const sanitizedData = sanitizeStrings(data?.initial?.data)
  const title = [
    sanitizedData?.title[sanitizedData.language],
    data.siteConfig.siteTitle,
  ]
    .filter(Boolean)
    .join(" | ")
  const ogImageUrl = data ? data.ogImageUrl : null
  const description = data ? sanitizedData.excerpt.en : ""

  return [
    { title },
    { name: "description", content: description },
    { property: "article:author", content: sanitizedData.author.name },
    {
      property: "article:modified_time",
      content: sanitizedData._updatedAt,
    },
    {
      property: "article:published_time",
      content: sanitizedData.publishedAt,
    },
    {
      property: "article:section",
      content: sanitizedData.categories[0].title.en,
    },
    {
      property: "article:tag",
      content: sanitizedData.subCategories.map((sc) => sc.title.en).join(", "),
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
      content: `https://gocanada.com/en/${sanitizedData.slug.en}`,
    },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: ogImageUrl },
    { property: "twitter:site", content: "@gocanada" },
    { property: "twitter:title", content: title },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://gocanada.com/en/${sanitizedData.slug.en}`,
    },
  ]
}

type LoaderDataType = {
  params: Params
  initial: Post
  ogImageUrl: string
  siteConfig: SiteConfigType
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { options } = await loadQueryOptions(request.headers)

  invariant(params.slug, "Expected slug param")
  isLangSupportedLang(params.lang)
  //const post = await getPost(client, params.slug!, params.lang!)

  const initial = await loadQuery<Post>(
    postBySlugQuery,
    {
      slug: params.slug,
      language: params.lang,
    },
    options
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  // post returns an empty object if the slug is not found, so check for empty object with Object.keys
  if (!initial.data) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }
  const siteConfig = await getSiteConfig(client)

  // Create social share image url
  const { origin } = new URL(request.url)
  const ogImageUrl = `${origin}/resource/og?id=${initial.data?._id}`

  return data(
    {
      params,
      initial,
      ogImageUrl,
      query: postBySlugQuery,
      siteConfig,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, s-maxage=31536000",
        // Tag with the post id
        "Cache-Tag": `posts:id:${initial.data?._id}`,
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders

export default function Slug() {
  const { initial, query, params } = useLoaderData<typeof loader>()
  const { data, loading } = useQuery(
    query,
    {
      slug: params.slug,
      language: params.lang,
    },
    { initial }
  )

  const sanitizedPost = sanitizeStrings<Post>(data)

  const otherLanguage = useOtherLanguage()
  const formattedDate = useFormattedDate(
    sanitizedPost.publishedAt,
    sanitizedPost.language
  )

  if (loading || !data) {
    return <div>Loading...</div>
  }

  const translationUrl = `/${otherLanguage}/${sanitizedPost.slug?.[otherLanguage]}`

  const hasInlineAd =
    sanitizedPost.body.findIndex((block) => block._type === "inlineAdType") > -1
  let halfwayThroughBodyMarker = Math.ceil(sanitizedPost.body.length / 2)

  const halfwayBlock = sanitizedPost.body[halfwayThroughBodyMarker]
  if (halfwayBlock._type !== "block" && halfwayBlock.style !== "normal") {
    const nextParagraph = [...sanitizedPost.body]
      .slice(halfwayThroughBodyMarker, sanitizedPost.body.length)
      .findIndex((block) => block._type === "block" && block.style === "normal")

    halfwayThroughBodyMarker = halfwayThroughBodyMarker + nextParagraph
  }

  if (loading) {
    return <div>Loading...</div>
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
                  to={`/${sanitizedPost.language}/categories/${
                    sanitizedPost.categories[0].slug[sanitizedPost.language]
                  }`}
                >
                  {sanitizedPost.categories[0].title.en}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  prefetch="intent"
                  to={`/${sanitizedPost.language}/categories/${sanitizedPost.categories[0].slug[sanitizedPost.language]}/${sanitizedPost.subCategories[0].slug[sanitizedPost.language]}`}
                >
                  {sanitizedPost.subCategories[0].title.en}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {sanitizedPost.title[sanitizedPost.language]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <article className="mb-24">
        <div className="w-full">
          <HeroImage
            fullBleed={sanitizedPost.mainImageFullBleed}
            id={sanitizedPost.mainImage.id}
            title={sanitizedPost.title[sanitizedPost.language]}
            category={sanitizedPost.categories[0]}
            preview={sanitizedPost.mainImage.preview}
            mainImageCaption={sanitizedPost.mainImageCaption}
            mainImageAttribution={sanitizedPost.mainImageAttribution}
            mainImageAttributionUrl={sanitizedPost.mainImageAttributionUrl}
            mainImageGradientOverlay={sanitizedPost.mainImageGradientOverlay}
            hotspot={sanitizedPost.mainImage.hotspot}
            crop={sanitizedPost.mainImage.crop}
            aspectRatio={sanitizedPost.mainImage.aspectRatio}
            isSponsored={sanitizedPost.isSponsored}
            sponsoredText={sanitizedPost.sponsoredText}
          />
        </div>
        <div
          // 1.32rem is to get the holy-grail width to match the prose width below
          className={cn("holy-grail mb-12 mt-4 text-[1.32rem]", {
            "mt-12": sanitizedPost.mainImageFullBleed,
          })}
        >
          <div className="w-full text-center">
            <Typography.Paragraph className="font-sans text-xl italic text-zinc-500 md:text-2xl">
              {sanitizedPost.excerpt[sanitizedPost.language]}
            </Typography.Paragraph>
          </div>
          <div className="mb-12 mt-4 text-center">
            <Typography.Paragraph>
              By{" "}
              <Link
                prefetch="intent"
                to={`/${sanitizedPost.language}/authors/${sanitizedPost.author.slug}`}
                className="hover:text-brand"
              >
                {sanitizedPost.author.name}
              </Link>
            </Typography.Paragraph>
            {sanitizedPost.showDate && (
              <Typography.TextMuted>{formattedDate}</Typography.TextMuted>
            )}
          </div>
          <div className="mb-12 w-full text-center">
            <Typography.H4>Share</Typography.H4>
            <Share
              url={`/${sanitizedPost.language}/${sanitizedPost.slug[sanitizedPost.language]}`}
              title={sanitizedPost.title[sanitizedPost.language]}
              tags={sanitizedPost.subCategories.map(
                (sc) => sc.title[sanitizedPost.language]
              )}
              description={sanitizedPost.excerpt[sanitizedPost.language]}
              media={sanitizedPost.mainImage.id}
            />
          </div>
          {sanitizedPost.byline &&
            Object.entries(sanitizedPost.byline || {}).length > 0 && (
              <>
                <Separator className="h-0.5" />

                <Prose
                  className="!dark:text-zinc-400 !mb-0 !mt-4 font-sans !text-zinc-500"
                  disableHolyGrail
                >
                  <PortableText
                    value={sanitizedPost.byline}
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
              value={sanitizedPost.body}
              components={PortableTextComponents}
            />
          ) : (
            // if no inline ad in the sanitizedPost, manually insert the MidRollBannerAd halfway through the body blocks
            <>
              <PortableText
                value={[...sanitizedPost.body].slice(
                  0,
                  halfwayThroughBodyMarker
                )}
                components={PortableTextComponents}
              />
              <div className="relative my-8 border bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="absolute right-0 top-0 z-10 size-6 rounded-bl-sm border-b border-l bg-zinc-50 text-center font-sans text-xs uppercase leading-6 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                  ad
                </div>
                <MidRollBannerAd />
              </div>
              <PortableText
                value={[...sanitizedPost.body].slice(
                  halfwayThroughBodyMarker,
                  sanitizedPost.body.length
                )}
                components={PortableTextComponents}
              />
            </>
          )}
        </Prose>
        <div className="mx-auto my-16 flex max-w-lg flex-wrap justify-center gap-4">
          {sanitizedPost.subCategories?.map((subCategory) => (
            <div key={subCategory.title[sanitizedPost.language]} className="">
              <Link
                prefetch="intent"
                to={`/${sanitizedPost.language}/categories/${sanitizedPost.categories[0].slug[sanitizedPost.language]}/${subCategory.slug[sanitizedPost.language]}`}
                className="rounded bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-800 no-underline dark:bg-zinc-700 dark:text-zinc-300"
              >
                {subCategory.title[sanitizedPost.language]}
              </Link>
            </div>
          ))}
        </div>
        <div className="space-y-24">
          <Separator />
          <AuthorCard author={sanitizedPost.author} showLinkToAuthorPage />
          <Separator />
        </div>
      </article>
      <div className="mx-auto my-12 grid max-w-screen-xl grid-cols-1 gap-8 lg:grid-cols-2">
        {[sanitizedPost.previousPost, sanitizedPost.nextPost].map(
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
                    to={`/${sanitizedPost.language}/${sanitizedPost.slug[sanitizedPost.language]}`}
                    aria-label={`Read more: ${sanitizedPost.title[sanitizedPost.language]}`}
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
