import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { MetaFunction, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { CardGrid } from "~/components/CardGrid"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Separator } from "~/components/ui/separator"
import { client } from "~/sanity/client"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { Author, getAuthor } from "~/sanity/queries/author"
import type { RootLoaderData } from "~/root"
import { useOtherLanguage } from "~/lib/useOtherLanguage"

export const meta: MetaFunction<
  typeof loader,
  {
    root: RootLoaderData
  }
> = ({ data, matches }) => {
  const rootData = matches.find((match) => match.id === `root`)
    ?.data as RootLoaderData

  const home = rootData ? rootData.initial.data : null
  const title = [data?.author?.name, home?.siteTitle]
    .filter(Boolean)
    .join(" | ")

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
  ]
}

type LoaderDataType = {
  author: Author
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  isLangSupportedLang(params.lang)
  invariant(params.slug, "Expected slug param")

  const author = await getAuthor(client, params.lang!, params.slug!)

  if (!author) {
    throw new Response("Not found", { status: 404 })
  }

  return json({
    author,
  })
}

export default function AuthorBySlugRoute() {
  const { author } = useLoaderData() as LoaderDataType
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/${author.slug}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Typography.H1>{author.name}</Typography.H1>
      <Typography.TextMuted>{author.bio[author.language]}</Typography.TextMuted>
      <Separator className="my-8" />
      <CardGrid posts={author.posts ?? []} />
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
