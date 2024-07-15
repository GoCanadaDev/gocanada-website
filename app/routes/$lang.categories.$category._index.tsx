import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { MoveLeft, Tag as TagIcon } from "lucide-react"
import invariant from "tiny-invariant"
import { CardGrid } from "~/components/CardGrid"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Separator } from "~/components/ui/separator"
import { useTranslate } from "~/lib/useTranslate"
import { client } from "~/sanity/client"
import { Category, getCategory } from "~/sanity/queries"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = [
    data?.category?.title[data.category.language],
    SITE_META.siteTitle,
  ]
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
  const { translations } = useTranslate()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/categories/${category.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${category.language}/categories`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> {translations.viewAll}
      </Link>
      <div className="holy-grail space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center rounded-full border-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
          <TagIcon className="mx-auto h-8 w-8" />
        </div>
        <Typography.H4>{translations.postsTagged}</Typography.H4>
        <Typography.H1>{category.title[category.language]}</Typography.H1>
        <Typography.TextMuted>
          {category.description[category.language]}
        </Typography.TextMuted>
      </div>
      <Separator className="my-8" />
      <CardGrid posts={category.posts ?? []} />
    </Layout>
  )
}
