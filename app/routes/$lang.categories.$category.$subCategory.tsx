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
import { SubCategory, getSubCategory } from "~/sanity/queries"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import type { RootLoaderData } from "~/root"
import { useOtherLanguage } from "~/lib/useOtherLanguage"

// TODO
// export const meta: MetaFunction<
//   typeof loader,
//   {
//     root: RootLoaderData
//   }
// > = ({ data, matches }) => {
//   const rootData = matches.find((match) => match.id === `root`)
//     ?.data as RootLoaderData

//   const home = rootData ? rootData.initial.data : null
//   const title = [data?.category?.title[data.category.language], home?.siteTitle]
//     .filter(Boolean)
//     .join(" | ")

//   return [
//     { title },
//     { property: "twitter:card", content: "summary_large_image" },
//     { property: "twitter:title", content: title },
//     { property: "og:title", content: title },
//   ]
// }

type LoaderDataType = {
  subCategory: SubCategory
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.subCategory, "Expected subCategory param")
  isLangSupportedLang(params.lang)
  const subCategory = await getSubCategory(
    client,
    params.subCategory!,
    params.lang!
  )

  if (!subCategory) {
    throw new Response("Not found", { status: 404 })
  }
  return json({
    subCategory,
  })
}

export default function SubCategoryByNameRoute() {
  const { subCategory } = useLoaderData() as LoaderDataType
  const { translate } = useTranslate()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/categories/${subCategory.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${subCategory.language}/categories`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> {translate("viewAll")}
      </Link>
      <div className="holy-grail space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center rounded-full border-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
          <TagIcon className="mx-auto h-8 w-8" />
        </div>
        <Typography.H4>{translate("postsTagged")}</Typography.H4>
        <Typography.H1>{subCategory.title[subCategory.language]}</Typography.H1>
        <Typography.TextMuted>
          {subCategory.description[subCategory.language]}
        </Typography.TextMuted>
      </div>
      <Separator className="my-8" />
      TODO: get posts by subcategory here
      {/* <CardGrid posts={subCategory.posts ?? []} /> */}
    </Layout>
  )
}
