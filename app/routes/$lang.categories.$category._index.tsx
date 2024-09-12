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
  const title = `${data.category.title.en} | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({ title, description })
}

type LoaderDataType = {
  category: Category
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.category, "Expected category param")
  isLangSupportedLang(params.lang)
  const category = await getCategory(client, params.category!, params.lang!)
  const siteConfig = await getSiteConfig(client)

  if (!category) {
    throw new Response("Not found", { status: 404 })
  }

  return json({
    category,
    siteConfig,
  })
}

export default function CategoryByNameRoute() {
  const { category } = useLoaderData<LoaderDataType>()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/categories/${category.slug[otherLanguage]}`

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
            <BreadcrumbPage>{category.title[category.language]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="holy-grail space-y-2 text-center">
        <Typography.H4 className="text-brand">Category</Typography.H4>
        <Typography.H1>{category.title[category.language]}</Typography.H1>
        {typeof category.description[category.language] === "string" && (
          <Typography.TextMuted className="mb-4">
            {category.description[category.language]}
          </Typography.TextMuted>
        )}
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
              className="inline-flex flex-nowrap rounded bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-800 no-underline dark:bg-zinc-700 dark:text-zinc-300"
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
