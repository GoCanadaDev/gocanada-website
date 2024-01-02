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
import { Category, getCategory } from "~/sanity/queries"
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
  const title = [data?.category?.title[data.category.language], home?.siteTitle]
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
  category: Category
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.category, "Expected category param")
  isLangSupportedLang(params.lang)
  const category = await getCategory(client, params.category!, params.lang!)

  if (!category) {
    throw new Response("Not found", { status: 404 })
  }

  return json({
    category,
  })
}

export default function CategoryByNameRoute() {
  const { category } = useLoaderData() as LoaderDataType
  const { translate } = useTranslate()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/category/${category.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${category.language}/category`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> {translate("viewAll")}
      </Link>
      <Typography.H1>{category.title[category.language]}</Typography.H1>
      <Typography.TextMuted>
        {category.description[category.language]}
      </Typography.TextMuted>
      <Separator className="my-8" />
      <CardGrid posts={category.posts ?? []} />
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
