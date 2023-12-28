import type {
  ActionFunction,
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
import { writeClient } from "~/sanity/client.server"
import { getPost, Post } from "~/sanity/queries"

import { formatDate } from "~/lib/formatDate"
import { PortableText } from "@portabletext/react"
import { Layout } from "~/components/Layout"
import { useTranslation } from "react-i18next"
import { Image } from "~/components/Image"
import { Typography } from "~/components/Typography"
import { HeroImage } from "~/components/HeroImage"

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

// Perform a `like` or `dislike` mutation on a `record` document
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 })
  }

  const { token, projectId } = writeClient.config()

  if (!token) {
    throw new Response(
      `Setup "SANITY_WRITE_TOKEN" with a token with "Editor" permissions to your environment variables. Create one at https://sanity.io/manage/project/${projectId}/api#tokens`,
      { status: 401 }
    )
  }

  const body = await request.formData()
  const id = String(body.get("id"))
  const action = String(body.get("action"))

  if (id) {
    switch (action) {
      case "LIKE":
        return await writeClient
          .patch(id)
          .setIfMissing({ likes: 0 })
          .inc({ likes: 1 })
          .commit()
          .then(({ likes, dislikes }) => ({
            likes: likes ?? 0,
            dislikes: dislikes ?? 0,
          }))
      case "DISLIKE":
        return await writeClient
          .patch(id)
          .setIfMissing({ dislikes: 0 })
          .inc({ dislikes: 1 })
          .commit()
          .then(({ likes, dislikes }) => ({
            likes: likes ?? 0,
            dislikes: dislikes ?? 0,
          }))
      default:
        return json({ message: "Invalid action" }, 400)
    }
  }

  return json({ message: "Bad request" }, 400)
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
    params,
    ogImageUrl,
  })
}

export default function Slug() {
  const {
    i18n: { language },
  } = useTranslation()
  const { post } = useLoaderData<typeof loader>()

  const postInLocale = post._translations!.find(
    (p: Post) => p.language === language
  )!
  const translation = post._translations!.find(
    (p: Post) => p.language !== language
  )!

  const translationUrl = `/${translation.language}/${translation.slug.current}`

  return (
    <Layout translationUrl={translationUrl}>
      <article className="holy-grail">
        <div className="full-bleed">
          <HeroImage
            id={postInLocale.mainImage.id}
            title={postInLocale.title}
            preview={postInLocale.mainImage.preview}
          />
          {/* {postInLocale.mainImage ? (
            <Image
              id={postInLocale.mainImage.id}
              alt=""
              preview={postInLocale.mainImage.preview}
              mode="cover"
            />
          ) : (
            <div className="post__cover--none" />
          )} */}
        </div>
        <div className="mx-4 my-24">
          <Typography.H1>{postInLocale.title}</Typography.H1>
          <Typography.TextSmall>
            {formatDate(postInLocale._createdAt, postInLocale.language)}
          </Typography.TextSmall>
          <p className="post__excerpt">{postInLocale.excerpt}</p>
          <div className="post__content">
            <PortableText value={postInLocale.body} />
          </div>
        </div>
      </article>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
