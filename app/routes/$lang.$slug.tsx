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
import { UserMediaObject } from "~/components/UserMediaObject"
import { useTranslate } from "~/lib/useTranslate"
import PortableTextComponents from "~/components/PortableTextComponents"
import { SITE_META } from "~/lib/utils"
import { MiniCard } from "~/components/MiniCard"

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
  const { translate } = useTranslate()
  const otherLanguage = useOtherLanguage()
  const formattedDate = useFormattedDate(post._createdAt, post.language)

  const translationUrl = `/${otherLanguage}/${post.slug[otherLanguage]}`

  return (
    <Layout translationUrl={translationUrl}>
      <article className="">
        <div className="w-full">
          <HeroImage
            id={post.mainImage.id}
            title={post.title[post.language]}
            category={post.category}
            preview={post.mainImage.preview}
          />
        </div>
        <div className="holy-grail mx-4 my-24 max-w-none text-xl">
          <UserMediaObject
            name={post.author.name}
            image={post.author.image}
            hoverCardContent={
              <>
                <Typography.TextMuted>
                  {post.author.bio[post.language]}
                </Typography.TextMuted>
                <Typography.TextSmall>
                  <Link
                    prefetch="intent"
                    to={`/${post.language}/authors/${post.author.slug}`}
                    className="text-red-600 hover:text-red-500"
                  >
                    {translate("viewAll")}
                    {""}
                    <MoveRight className="inline h-4 w-4" />
                  </Link>
                </Typography.TextSmall>
              </>
            }
            content={
              <>
                <Typography.Paragraph>
                  <Link
                    prefetch="intent"
                    to={`/${post.language}/authors/${post.author.slug}`}
                    className=""
                  >
                    {post.author.name}
                  </Link>
                </Typography.Paragraph>
                <Typography.TextMuted>{formattedDate}</Typography.TextMuted>
              </>
            }
          />

          <div className="mb-8">
            {post.tags.map((tag) => (
              <Link
                prefetch="intent"
                key={tag.title[post.language]}
                to={`/${post.language}/tags/${tag.slug[post.language]}`}
                className="me-2 inline-block rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 no-underline dark:bg-gray-700 dark:text-gray-300"
              >
                {tag.title[post.language]}
              </Link>
            ))}
          </div>
          <div className="mb-24 w-full text-center">
            <Typography.Lead className="italic">
              {post.excerpt[post.language]}
            </Typography.Lead>
          </div>
          <Separator />
        </div>
        <div className="holy-grail prose prose-xl prose-slate mx-4 my-24 max-w-none lg:prose-2xl dark:prose-invert prose-a:text-red-600 hover:prose-a:text-red-500">
          <PortableText value={post.body} components={PortableTextComponents} />
        </div>
      </article>

      <div className="my-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {[post.previousPost, post.nextPost].map((previousOrNextPost, index) => {
          if (!previousOrNextPost || !previousOrNextPost.title)
            return <div key="">&nbsp;</div>
          return (
            <div
              key={previousOrNextPost._id}
              className={`group relative flex items-center gap-4 ${
                index === 1 ? "justify-end" : "justify-start"
              }`}
            >
              {index === 0 && (
                <Link
                  className="text-sm before:absolute before:inset-0 group-hover:text-red-600"
                  prefetch="intent"
                  to={`/${post.language}/${post.slug[post.language]}`}
                  aria-label={`${translate("readMore")}: ${
                    post.title[post.language]
                  }`}
                >
                  <ChevronLeft className="size-8" />
                </Link>
              )}
              <MiniCard post={previousOrNextPost} reverse={index === 1} />
              {index === 1 && (
                <Link
                  className="text-sm before:absolute before:inset-0 group-hover:text-red-600"
                  prefetch="intent"
                  to={`/${previousOrNextPost.language}/${
                    previousOrNextPost.slug[previousOrNextPost.language]
                  }`}
                  aria-label={`${translate("readMore")}: ${
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
