import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import { ExternalLink, MoveRight } from "lucide-react"

import { client } from "~/sanity/client"
import type { RootLoaderData } from "~/root"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og"
import { getPost, Post } from "~/sanity/queries"

import { formatDate } from "~/lib/formatDate"
import { PortableText } from "@portabletext/react"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { HeroImage } from "~/components/HeroImage"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { urlForImage } from "~/lib/sanity.image"
import { Separator } from "~/components/ui/separator"
import invariant from "tiny-invariant"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { Image } from "~/components/Image"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { UserMediaObject } from "~/components/UserMediaObject"
import { useTranslate } from "~/lib/useTranslate"

export const meta: MetaFunction<
  typeof loader,
  {
    root: RootLoaderData
  }
> = ({ data, matches }) => {
  const rootData = matches.find((match) => match.id === `root`)
    ?.data as RootLoaderData

  const home = rootData ? rootData.initial.data : null
  const title = [data?.post?.title[data.post.language], home?.siteTitle]
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

  if (!post) {
    throw new Response("Not found", { status: 404 })
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

  const translationUrl = `/${otherLanguage}/${post.slug[otherLanguage]}`

  // TODO: move the components and PortableText to a separate file
  const myPortableTextComponents = {
    types: {
      image: ({
        value,
      }: {
        value: {
          id: string
          preview: string
          attribution?: string
          attributionUrl?: string
          caption?: string
          alt?: string
        }
      }) => {
        return (
          <figure className="full-bleed">
            <Image
              id={value.id}
              width={640}
              preview={value.preview}
              loading="lazy"
              className="w-full"
              alt={value.alt ?? ""}
            />
            {value.attribution || value.caption ? (
              <div className="holy-grail">
                <figcaption className="flex justify-between">
                  {value.caption ? (
                    <span className="flex-1 italic">{value.caption}</span>
                  ) : null}
                  {value.attribution ? (
                    <span className="flex-1 text-right">
                      Photo by{" "}
                      {value.attributionUrl ? (
                        <a href={value.attributionUrl}>
                          {value.attribution}{" "}
                          <ExternalLink className="inline h-4 w-4" />
                        </a>
                      ) : (
                        value.attribution
                      )}
                    </span>
                  ) : null}
                </figcaption>
                <Separator className="my-8" />
              </div>
            ) : null}
          </figure>
        )
      },
    },

    // marks: {
    //   link: ({ children, value }) => {
    //     const rel = !value.href.startsWith("/")
    //       ? "noreferrer noopener"
    //       : undefined
    //     return (
    //       <a href={value.href} rel={rel}>
    //         {children}
    //       </a>
    //     )
    //   },
    // },
  }

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
        <div className="holy-grail mx-4 my-24 max-w-none">
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
                <Typography.TextMuted>
                  {formatDate(post._createdAt, post.language)}
                </Typography.TextMuted>
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
        <div className="holy-grail prose prose-xl prose-slate mx-4 my-24 max-w-none dark:prose-invert lg:prose-2xl prose-a:text-red-600 hover:prose-a:text-red-500">
          <PortableText
            value={post.body}
            components={myPortableTextComponents}
          />
        </div>
      </article>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
