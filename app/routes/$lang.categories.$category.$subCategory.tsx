import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { MoveLeft, Search } from "lucide-react"
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
        className="text-brand hover:text-brandHover"
      >
        <MoveLeft className="inline h-4 w-4" /> View all{" "}
        {category.title[category.language]}
      </Link>
      <div className="holy-grail space-y-2 text-center">
        <Typography.H4 className="text-brand">
          {category.title[category.language]}
        </Typography.H4>
        <Typography.H1>{subCategory.title[subCategory.language]}</Typography.H1>
        <Typography.TextMuted>
          {subCategory.description[subCategory.language]}
        </Typography.TextMuted>
      </div>
      <Separator className="my-2" />
      {subCategory.posts?.length ? (
        <CardGrid posts={subCategory.posts} />
      ) : (
        <div className="text-center">
          <Search className="mb-4 inline h-12 w-12" />
          <Typography.H3>No Posts Found</Typography.H3>
          <Typography.Paragraph>
            No posts have been categorized{" "}
            {subCategory.title[subCategory.language]} yet.
          </Typography.Paragraph>
        </div>
      )}
    </Layout>
  )
}
