import { Link, MetaFunction, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { Category, getCategories } from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Tag as TagIcon } from "lucide-react"
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = () => {
  const title = ["Categories", SITE_META.siteTitle].filter(Boolean).join(" | ")

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
  ]
}

interface IndexLoaderData {
  categories: Category[]
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)
  const categories = await getCategories(client, params.lang!)

  return json<IndexLoaderData>({
    categories,
  })
}

export default function CategoryIndexRoute() {
  const { categories } = useLoaderData() as IndexLoaderData
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
              className="mb-4 overflow-hidden rounded-md bg-slate-50 p-4 dark:bg-slate-800"
            >
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border ">
                  <TagIcon className="h-6 w-6 flex-shrink-0" />
                </div>

                <div className="ml-4 space-y-4">
                  <Typography.H3>
                    {category.title[category.language]}
                  </Typography.H3>
                  <Typography.TextMuted>
                    {category.description[category.language]}
                  </Typography.TextMuted>
                  <Typography.TextSmall>
                    <Link
                      prefetch="intent"
                      to={linkTo}
                      className="before:absolute before:inset-0"
                    >
                      <span className="sr-only">View category</span>
                    </Link>
                  </Typography.TextSmall>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
