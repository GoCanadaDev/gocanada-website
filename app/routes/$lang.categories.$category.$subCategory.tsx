import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { MoveLeft, Tag as TagIcon } from "lucide-react"
import invariant from "tiny-invariant"
import { CardGrid } from "~/components/CardGrid"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Separator } from "~/components/ui/separator"
import { client } from "~/sanity/client"
import {
  Category,
  SubCategory,
  getCategory,
  getSubCategory,
} from "~/sanity/queries"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = [
    data?.subCategory?.title[data.subCategory.language],
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
  subCategory: SubCategory
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.category, "Expected category param")
  invariant(params.subCategory, "Expected subCategory param")
  isLangSupportedLang(params.lang)
  const category = await getCategory(client, params.category!, params.lang!)
  if (!category) {
    throw new Response("Category Not found", { status: 404 })
  }

  const subCategory = await getSubCategory(
    client,
    params.subCategory!,
    params.lang!
  )
  if (!subCategory) {
    throw new Response("Sub Category Not found", { status: 404 })
  }
  return json({
    category,
    subCategory,
  })
}

export default function SubCategoryByNameRoute() {
  const { category, subCategory } = useLoaderData() as LoaderDataType
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/categories/${subCategory.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${subCategory.language}/categories/${
          category.slug[category.language]
        }`}
        className="hover:text-brandHover text-brand"
      >
        <MoveLeft className="inline h-4 w-4" /> View all{" "}
        {category.title[category.language]}
      </Link>
      <div className="holy-grail space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center rounded-full border-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
          <TagIcon className="mx-auto h-8 w-8" />
        </div>
        <Typography.H4>{category.title[category.language]}</Typography.H4>
        <Typography.H1>{subCategory.title[subCategory.language]}</Typography.H1>
        <Typography.TextMuted>
          {subCategory.description[subCategory.language]}
        </Typography.TextMuted>
      </div>
      <Separator className="my-8" />
      {subCategory.posts?.length ? (
        <CardGrid posts={subCategory.posts} />
      ) : (
        "No posts to display."
      )}
    </Layout>
  )
}
