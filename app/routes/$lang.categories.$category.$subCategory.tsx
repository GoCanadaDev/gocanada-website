import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { Search } from "lucide-react"
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
import { genericMetaTags, SITE_META } from "~/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = `${data.subCategory.title.en} | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({ title, description })
}

type LoaderDataType = {
  category: Category
  subCategory: SubCategory
  siteConfig: SiteConfigType
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

  const siteConfig = await getSiteConfig(client)

  return json({
    category,
    subCategory,
    siteConfig,
  })
}

export default function SubCategoryByNameRoute() {
  const { category, subCategory } = useLoaderData<LoaderDataType>()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/categories/${subCategory.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" prefetch="intent">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link prefetch="intent" to={`/${category.language}/categories`}>
                Categories
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                prefetch="intent"
                to={`/${subCategory.language}/categories/${
                  category.slug[category.language]
                }`}
              >
                {category.title[category.language]}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {subCategory.title[subCategory.language]}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="holy-grail space-y-2 text-center">
        <Typography.H4 className="text-brand">
          {category.title[category.language]}
        </Typography.H4>
        <Typography.H1>{subCategory.title[subCategory.language]}</Typography.H1>
        {typeof subCategory.description[subCategory.language] === "string" && (
          <Typography.TextMuted>
            {subCategory.description[subCategory.language]}
          </Typography.TextMuted>
        )}
      </div>
      <Separator className="my-2" />
      {subCategory.posts?.length ? (
        <CardGrid posts={subCategory.posts} categoryToUse={category} />
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
