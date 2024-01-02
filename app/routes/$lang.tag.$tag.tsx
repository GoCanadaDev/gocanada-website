import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { MoveLeft } from "lucide-react"
import invariant from "tiny-invariant"
import { CardGrid } from "~/components/CardGrid"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Separator } from "~/components/ui/separator"
import { useTranslate } from "~/lib/useTranslate"
import { client } from "~/sanity/client"
import { Tag, getTag } from "~/sanity/queries"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
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
  const title = [data?.tag?.title[data.tag.language], home?.siteTitle]
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
  tag: Tag
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.tag, "Expected tag param")
  isLangSupportedLang(params.lang)
  const tag = await getTag(client, params.tag!, params.lang!)

  if (!tag) {
    throw new Response("Not found", { status: 404 })
  }

  return json({
    tag,
  })
}

export default function TagByNameRoute() {
  const { tag } = useLoaderData() as LoaderDataType
  const { translate } = useTranslate()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/tag/${tag.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${tag.language}/tag`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> {translate("viewAll")}
      </Link>
      <Typography.H1>{tag.title[tag.language]}</Typography.H1>
      <Typography.TextMuted>
        {tag.description[tag.language]}
      </Typography.TextMuted>
      <Separator className="my-8" />
      <CardGrid posts={tag.posts ?? []} />
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
