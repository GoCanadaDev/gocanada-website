import { Link, MetaFunction, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { Category, getCategories } from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Tag as TagIcon } from "lucide-react"
import { genericMetaTags, SITE_META } from "~/lib/utils"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "~/lib/structuredData"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = `Categories | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  const canonical = `/en/categories`
  return genericMetaTags({
    title,
    description,
    canonical,
    schemas: [
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateBlogSchema({ description }),
      generateBreadcrumbSchema([
        {
          name: "Home",
          url: "https://gocanada.com/en",
        },
        {
          name: "Categories",
          url: canonical,
        },
      ]),
    ],
  })
}

interface LoaderDataType {
  categories: Category[]
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)
  const categories = await getCategories(client, params.lang!)
  const siteConfig = await getSiteConfig(client)

  return json<LoaderDataType>({
    categories,
    siteConfig,
  })
}

export default function CategoryIndexRoute() {
  const { categories } = useLoaderData<LoaderDataType>()
  const params = useParams()
  const lang = params.lang as SupportedLanguages

  return (
    <Layout
      translationUrl={lang === "en" ? "/fr/categories" : "/en/categories"}
      useMargins
    >
      <div className="grid auto-rows-min grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {categories?.map((category) => {
          if (!category.enabled) {
            return null
          }
          const linkTo = `/${lang}/categories/${
            category.slug[category.language]
          }`

          return (
            <div
              key={category.title[lang]}
              className="relative mb-4 overflow-hidden rounded-md bg-zinc-50 p-4 dark:bg-zinc-800"
            >
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border ">
                  <TagIcon className="h-6 w-6 flex-shrink-0" />
                </div>

                <div className="ml-4 space-y-4">
                  <Typography.H3>
                    {category.title[category.language]}
                  </Typography.H3>
                  {typeof category.description[category.language] ===
                    "string" && (
                    <Typography.TextMuted>
                      {category.description[category.language]}
                    </Typography.TextMuted>
                  )}

                  <Link
                    prefetch="intent"
                    to={linkTo}
                    className="before:absolute before:inset-0"
                  >
                    <span className="sr-only">View category</span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
