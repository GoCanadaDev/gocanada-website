import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"

import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import i18next from "~/i18next.server"
import type { RootLoaderData as RootLoader } from "~/root"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og"
import { getPost, Post } from "~/sanity/queries"

import { formatDate } from "~/lib/formatDate"
import { PortableText } from "@portabletext/react"
import { Layout } from "~/components/Layout"
import { useTranslation } from "react-i18next"
import { Typography } from "~/components/Typography"
import { HeroImage } from "~/components/HeroImage"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { urlForImage } from "~/lib/sanity.image"
import { Separator } from "~/components/ui/separator"

export const meta: MetaFunction<
  typeof loader,
  {
    root: RootLoader
  }
> = ({ data, matches }) => {
  const rootData = matches.find((match) => match.id === `root`)
    ?.data as RootLoader

  const home = rootData ? rootData.initial.data : null
  const title = [data?.post?.title, home?.siteTitle].filter(Boolean).join(" | ")
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
  let language = (await i18next.getLocale(request)) as SupportedLanguages
  const post = await getPost(client, params.slug!, language)

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
  const {
    i18n: { language },
  } = useTranslation()
  const { post } = useLoaderData() as LoaderDataType

  const translation = post._translations!.find(
    (p: Post) => p.language !== language
  )

  const translationUrl = translation
    ? `/${translation.language}/${translation.slug.current}`
    : undefined

  return (
    <Layout translationUrl={translationUrl}>
      <article className="holy-grail">
        <div className="full-bleed">
          <HeroImage
            id={post.mainImage.id}
            title={post.title}
            category={post.category}
            preview={post.mainImage.preview}
          />
        </div>
        <div className="mx-4 my-24">
          <div className="mb-8 flex items-center">
            <Avatar>
              <AvatarImage
                src={urlForImage(post.author.image)
                  ?.width(100)
                  .height(100)
                  .url()}
              />
              <AvatarFallback>
                {
                  // fake out initials by grabbing capitalized letters
                  post.author.name
                    .match(/(\b\S)?/g)!
                    .join("")
                    .toUpperCase()
                }
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <Typography.TextSmall>{post.author.name}</Typography.TextSmall>
              <Typography.TextMuted>
                {formatDate(post._createdAt, post.language)}
              </Typography.TextMuted>
            </div>
          </div>

          <div className="mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <Typography.Lead className="mb-24 italic">
            {post.excerpt}
          </Typography.Lead>
          <Separator />
          <div className="prose prose-xl prose-slate my-24 max-w-none dark:prose-invert lg:prose-2xl prose-a:text-red-600 hover:prose-a:text-red-500">
            <PortableText value={post.body} />
          </div>
        </div>
      </article>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
