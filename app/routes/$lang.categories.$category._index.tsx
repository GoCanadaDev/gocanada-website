import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { MoveLeft } from "lucide-react"
import invariant from "tiny-invariant"
import { CardGrid } from "~/components/CardGrid"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Separator } from "~/components/ui/separator"
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
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/categories/${category.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${category.language}/categories`}
        className="text-brand hover:text-brandHover"
      >
        <MoveLeft className="inline h-4 w-4" /> View all categories
      </Link>
      <div className="holy-grail space-y-2 text-center">
        <Typography.H4>Category</Typography.H4>
        <Typography.H1>{category.title[category.language]}</Typography.H1>
        <Typography.TextMuted className="mb-4">
          {category.description[category.language]}
        </Typography.TextMuted>
      </div>
      <div className="mx-auto flex flex-wrap justify-center gap-4">
        {category.subCategories?.length > 0 &&
          category.subCategories.map((subCat) => (
            <Link
              key={subCat.title[category.language]}
              prefetch="intent"
              to={`/${category.language}/categories/${
                category.slug[category.language]
              }/${subCat.slug[category.language]}`}
              className="inline-flex flex-nowrap rounded bg-gray-100 px-2.5 py-0.5 font-medium text-gray-800 no-underline dark:bg-gray-700 dark:text-gray-300"
            >
              {subCat.title[category.language]}
            </Link>
          ))}
      </div>

      <Separator className="my-2" />
      {category.posts?.length ? (
        <CardGrid posts={category.posts} categoryToUse={category} />
      ) : (
        <Typography.Lead>No posts to display.</Typography.Lead>
      )}
    </Layout>
  )
}
