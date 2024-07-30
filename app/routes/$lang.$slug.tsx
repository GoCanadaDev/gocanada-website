import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react"
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
import PortableTextComponents from "~/components/PortableTextComponents"
import { SITE_META } from "~/lib/utils"
import { MiniCard } from "~/components/MiniCard"
import AuthorCard from "~/components/AuthorCard"

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

  return (
    <Layout translationUrl={translationUrl}>
      <article className="mb-24">
        <div className="w-full">
          <HeroImage
            fullBleed={post.mainImageFullBleed}
            id={post.mainImage.id}
            title={post.title[post.language]}
            category={post.category}
            preview={post.mainImage.preview}
            mainImageCaption={post.mainImageCaption}
            mainImageAttribution={post.mainImageAttribution}
            mainImageAttributionUrl={post.mainImageAttributionUrl}
          />
        </div>
        <div className="holy-grail mx-4 my-12 max-w-none text-xl">
          <div className="mb-16 text-center">
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
            <Typography.Lead className="italic">
              {post.excerpt[post.language]}
            </Typography.Lead>
          </div>
          <Separator />
        </div>
        <div className="holy-grail hover:prose-a:text-brandHover prose-a:text-brand prose prose-slate mx-4 my-12 max-w-none lg:prose-lg dark:prose-invert prose-h1:font-serif prose-h2:font-serif prose-h3:font-serif prose-p:my-4 prose-figure:my-4 prose-ol:my-0 prose-ul:my-0 prose-li:my-0">
          <PortableText value={post.body} components={PortableTextComponents} />
        </div>
        <div className="mx-auto my-16 flex max-w-lg justify-center gap-4">
          {post.tags.map((tag) => (
            <div key={tag.title[post.language]} className="">
              <Link
                prefetch="intent"
                to={`/${post.language}/tags/${tag.slug[post.language]}`}
                className="rounded bg-gray-100 px-2.5 py-0.5 font-medium text-gray-800 no-underline dark:bg-gray-700 dark:text-gray-300"
              >
                {tag.title[post.language]}
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
              className={`group relative flex items-center gap-4 px-8 ${
                index === 1 ? "justify-end" : "justify-start"
              }`}
            >
              {index === 0 && (
                <Link
                  className="group-hover:text-brandHover text-sm before:absolute before:inset-0"
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
                  className="group-hover:text-brandHover text-sm before:absolute before:inset-0"
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
